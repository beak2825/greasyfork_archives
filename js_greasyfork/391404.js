// ==UserScript==
// @name         dev_group_list2
// @namespace    http://www.deviantart.com/
// @version      7.5
// @description  Better Submit-to-group dialog
// @author       Dediggefedde
// @match        https://www.deviantart.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/391404/dev_group_list2.user.js
// @updateURL https://update.greasyfork.org/scripts/391404/dev_group_list2.meta.js
// ==/UserScript==
/* globals $*/
(function () {
    'use strict';
    let userName = "";
    let userId = 0;
    let moduleID = 0;
    let grPerReq = 24;
    let allGroups = []; //{userId,useridUuid,username,usericon,type,isNewDeviant,latestDate}
    let displayedGroups = []; //subset of currently displayed groups
    const inactiveDate = new Date();
    inactiveDate.setMonth(inactiveDate.getMonth() - 3); //inactive if latest submission before 3 months
    // isNewDeviant not needed.
    // type=oneof{group, super group}
    // usericon always starts with https://a.deviantart.net/avatars-big
    // useridUuid specific to the group, contains submission rights
    // userid of the group
    // latestDate newest publish date of thumb for a folder; filled later when folders requested
    let groupN = 0;
    let listedGroups = new Set(); //list of group userIDs this deviation is inside
    let devID;
    let collections = [{
        id: 0,
        name: "all",
        groups: [],
        showing: 1
    }];
    let collectionOrder = [];
    let colMode = 0; //0 show, 1 add, 2 remove, 3 delete
    let colModeTarget = 0;
    let macros = []; //{id, name, data:[{folderName, folderID, groupID, type}]}
    let macroOrder = [];
    let macroMode = 0; //0 idle, 1 record, 2 play, 3 remove
    let macroModeTarget = 0; //for recording
    let colListMode = 0; //0 collection, 1 macro;
    let fetchingGroups = false; //prevent refresh button requesting multiple times at once
    let entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    let loadedFolders = new Map();
    let lastGroupClickID;
    let scrollPosBefore = -1;
    let targetName = ""; //target group, collection or macro name
    let ngrpCnt = 0; //progress counter fetching groups
    let ngrpleft = 0;
    let showingFolders=false;

    let curOffset = 0; //current page offset endless scrolling
    let curColOffset = 0; //current page offset within a collection
    let scrollEnd = false; //scroll reached end, stop endless scroll
    let curFilterID = 0; //current active collection ID
    let curFilterMode = ""; //collection/macro
    let displayColGroups=[]; //groups in last displayed collection
    let subFolderOrder=0; //order  of subfolder list
    let subfolderCache=[]; //current list of subfolders
    let sortBut=null; //HTML element for sorting subfolder
    let navigating=false;//disable scroll while filling groups

    const errtyps = Object.freeze({
        Connection_Error: "Connection Error",
        No_User_ID: "No User ID",
        Unknown_Error: "Site Error",
        Parse_Error: "Parse Error",
        Wrong_Setting: "Wrong Profile setting"
    });
    //error protocol convention: ErrType of errtyps, ErrDescr as text, ErrDetail with exception object
    //alert of type/descr, console log with detail

    function err(type, descr, detail) {
        return { ErrType: type, ErrDescr: descr, ErrDetail: detail };
    }

    function errorHndl(err) {
        myMsgBox("<strong>Type</strong>: " + err.ErrType + "<br /><strong>Description</strong>: " + err.ErrDescr + "<br /><br />See the log (F12 in Chrome/Firefox) for more details.<br />If the error persist, feel free to write me a <a style=\"text-decoration: underline;\" href=\"https://www.deviantart.com/dediggefedde/art/dev-group-list2-817465905#comments\">comment</a>.", "Error");
        console.error("dev_group_list2 error:", err);
    }

    function fillAdminGroups(offset) {
        let token = $("input[name=validate_token]").val();
        let murl = `https://www.deviantart.com/${userName}/about`;
        return new Promise(function (resolve, reject) {
            GM.xmlHttpRequest({
                method: "GET",
                url: murl,
                onerror: function (response) {
                    reject(err(errtyps.Connection_Error, "Connection to " + murl + " failed", response));
                },
                onload: function (response) {
                    let rex = /<section id="group_list_admins" .*?<\/section>/i;
                    let res = rex.exec(response.responseText);
                    if (res == null) return resolve(allGroups);

                    let rex2 = /"https:\/\/www.deviantart.com\/(.*?)"/gi;
                    let groupnames = [];
                    let rex2mtch;
                    while (rex2mtch = rex2.exec(res[0])) groupnames.push(rex2mtch[1]);

                    let grpcnt = groupnames.length;
                    if (grpcnt == 0) return resolve(allGroups);

                    groupnames.forEach(groupName => {
                        //group array structure {userId,useridUuid,username,usericon,type,isNewDeviant,latestDate}
                        //response structure {{gruser},{owner},{pagedata}}, owner=userId,useridUuid,etc.
                        GM.xmlHttpRequest({
                            method: "GET",
                            url: `https://www.deviantart.com/_puppy/dauserprofile/init/about?username=${groupName}&csrf_token=${token}`,
                            onerror: function (response) {
                                if (--grpcnt == 0) resolve(allGroups);
                            },
                            onload: function (response) {
                                let resp = JSON.parse(response.responseText);
                                if (resp.owner == null) console.error("dev_group_list2 error: " + groupName + " can not be added since it's not migrated yet.");
                                else allGroups = allGroups.concat(resp.owner);
                                if (--grpcnt == 0) resolve(allGroups);
                            }
                        });
                    });

                }
            });
        });
    }

    //API calls getting data
    function fillGroups(offset) { //async+callback //load all groups

        let token = $("input[name=validate_token]").val();
        let murl = "https://www.deviantart.com/_puppy/gruser/module/groups/members?username=" + userName + "&moduleid=" + moduleID + "&gruserid=" + userId + "&gruser_typeid=4&offset=" + offset + "&limit=" + grPerReq + "&csrf_token=" + token;
        return new Promise(function (resolve, reject) {
            GM.xmlHttpRequest({
                method: "GET",
                url: murl,
                onerror: function (response) {
                    reject(err(errtyps.Connection_Error, "Connection to " + murl + " failed", response));
                },
                onload: function (response) {
                    if (response.status == 500) {
                        reject(err(errtyps.Connection_Error, "Connection error " + murl + " failed", response));
                        return
                    }
                    let resp = JSON.parse(response.responseText);
                    if (offset == 0) allGroups = [];

                    let newnams = resp.results.map(x => x.userId);
                    if (allGroups.map(x => x.userId).filter(x => newnams.includes(x)).length > 0) {
                        reject(err(errtyps.Wrong_Setting, "Double group entries detected. Probably wrong sorting at profile/about's group-member section. Please choose asc or desc, not random.", allGroups));
                        $("#dgl2_refresh").css("cursor", "pointer");
                        return;
                    }

                    allGroups = allGroups.concat(resp.results);
                    groupN = resp.total;

                    let frac = 0;
                    if (groupN > 0) frac = allGroups.length / groupN * 100;
                    frac = Math.round(frac);

                    $("#dgl2_refresh rect").css("fill", "url(#dgl2_grad1)");
                    $("#dgl2_grad1_stop1").attr("offset", frac + "%");
                    $("#dgl2_grad1_stop2").attr("offset", (frac + 1) + "%");
                    $("#dgl2_refresh").attr("title", frac + " %");
                    $("span.dgl2_descr").text("Loading List of Groups... " + frac + " %");

                    if (resp.hasMore) {
                        resolve(fillGroups(resp.nextOffset));
                    } else {
                        $("#dgl2_refresh rect").css("fill", "");
                        $("#dgl2_refresh").css("cursor", "pointer");

                        resolve(allGroups);
                    }
                }
            });
        });
    }

    function grabIDfromPage(name) {
        return new Promise(function (resolve, reject) {
            GM.xmlHttpRequest({
                method: "GET",
                url: "https://www.deviantart.com/" + name,
                onerror: function (response) {
                    reject(err(errtyps.Connection_Error, "Connection to https://www.deviantart.com/" + name + " failed", response));
                },
                onload: async function (response) {

                    $("#dgl2_refresh rect").css("fill", "url(#dgl2_grad1)");
                    ngrpCnt += 1;
                    $("span.dgl2_descr").text(`Loading List of Groups IDs... ${ngrpCnt}/${ngrpleft}`);

                    let rex = /itemid":(.*?),"friendid":"(.*?)"/i;
                    let mat = response.responseText.match(rex);
                    if (mat == null) {
                        reject(err(errtyps.No_User_ID, "Request of " + name + "-id failed", response));
                        return;
                    }

                    allGroups.forEach(gr => {
                        if (gr.username == name) {
                            gr.userId = mat[1];
                            gr.useridUuid = mat[2];
                        }
                    });
                    GM.setValue("groups", JSON.stringify(allGroups));
                    resolve(mat[1]);
                }
            });
        });
    }

    function fillSubFolder(groupID, type, name) { //async+callback //type =[collection,gallery]
        if (typeof groupID == "undefined") {
            $(".dgl2_groupdialog ").css("cursor", "wait");
            $(".dgl2_groupButton").css("cursor", "wait");
            return grabIDfromPage(name).then(id => {
                groupID = id;
                lastGroupClickID = id;
                scrollPosBefore = document.querySelector(".dgl2_groupCol").scrollTop;
                return fillSubFolder(groupID, type, name);
            }).catch(erg => {
                errorHndl(erg);
                $(".dgl2_groupdialog ").css("cursor", "pointer");
                return null;
            });
        }

        return new Promise(function (resolve, reject) {
            let token = $("input[name=validate_token]").val();
            let murl = `https://www.deviantart.com/_puppy/dadeviation/group_folders?groupid=${groupID}&type=${type}&csrf_token=${token}`;
            GM.xmlHttpRequest({
                method: "GET",
                url: murl,
                onerror: function (response) {
                    reject(err(errtyps.Connection_Error, "Connection to " + murl + " failed", response));
                },
                onload: async function (response) {
                    let resp;
                    let errg;
                    try {
                        resp = JSON.parse(response.responseText);
                    } catch (ex) {
                        errg = err(errtyps.Connection_Error, `Page problems reaching ${murl} Please try again later!`, ex)
                        reject(errg)
                    }
                    if (typeof resp.results == "undefined") {
                        errg = err(errtyps.Parse_Error, "Error parsing website response. Private browser mode active?", response);
                        errorHndl(errg);
                    } else {
                        let latestDate = Math.max(...Object.values(resp.results).map(o => o.thumb ? new Date(o.thumb.publishedTime) : null));
                        let grInd = allGroups.findIndex(item => item.userId == groupID);
                        allGroups[grInd].latestDate = latestDate;
                        let but = document.querySelector(`button.dgl2_groupButton[groupid='${groupID}']`);
                        if (latestDate != null && but != null) {
                            but.setAttribute("title", escapeHtml(allGroups[grInd].username) + "\n Last submission: " + (new Date(latestDate)).toLocaleString());
                            but.setAttribute("activity", (inactiveDate < new Date(latestDate)) ? "active" : "inactive");
                        }
                        insertSubFolders(resp.results);
                        if (macroMode == 1) {
                            for (let gr of macros[macroModeTarget].data) {
                                if (gr.groupID == groupID) {
                                    $("button.dgl2_groupButton[folderID='" + gr.folderID + "']").addClass("folderInMacro");
                                    break;
                                }
                            }
                        }
                    }
                    $(".dgl2_groupdialog").css("cursor", "");
                    $(".dgl2_groupButton").css("cursor", "pointer");
                    $("div.groupPopup").focus();
                    resolve(resp.results);

                }
            });
        });
    }

    function fillModuleID() { //async+callback //get Module ID for group submission
        let murl = "https://www.deviantart.com/" + userName + "/about";
        return new Promise(function (resolve, reject) {
            GM.xmlHttpRequest({
                method: "GET",
                url: murl,
                onerror: function (response) {
                    reject(err(errtyps.Connection_Error, "Connection to " + murl + " failed", response));
                },
                onload: async function (response) {
                    try {
                        let resp = (response.responseText);
                        let ind = resp.indexOf(`id="group_list_members"`);
                        if (ind < 0) return reject(err(errtyps.Wrong_Setting, "No group-member section in /about page", resp));
                        resp = resp.substr(ind);
                        let modIdMat = /data-moduleid="(\d+)"/i.exec(resp);
                        if (modIdMat == null) return reject(err(errtyps.Wrong_Setting, "No module-id in the group-member section", resp));
                        moduleID = modIdMat[1];
                        resolve(moduleID);
                    } catch (ex) {
                        reject(err(errtyps.Unknown_Error, "Something went wrong while accessing groups", ex));
                    }
                }
            });
        });
    }

    function fillListedGroups(devID, cursor) {
        let token = $("input[name=validate_token]").val();
        let murl = `https://www.deviantart.com/_puppy/dadeviation/featured_in_groups?deviationid=${devID}&limit=25&csrf_token=${token}&cursor=${cursor}`;
        return new Promise(function (resolve, reject) {
            GM.xmlHttpRequest({
                method: "GET",
                url: murl,
                onerror: function (response) {
                    reject(err(errtyps.Connection_Error, "Connection to " + murl + " failed", response));
                },
                onload: async function (response) {
                    let res;
                    try {
                        res = JSON.parse(response.responseText);
                    } catch (ers) {
                        reject(err(errtyps.Connection_Error, "Reading " + murl + " failed", { ers, response }));
                        return;
                    }
                    for (let entr of res.results) {
                        listedGroups.add(parseInt(entr.userId));
                    }

                    if (res.cursor){
                        resolve(fillListedGroups(devID, res.cursor));
                    }else{
                        resolve(listedGroups);
                    }
                }
            });
        });

    }

    function requestAddSubmission(devID, folderID, groupID, type) { //async+callback //type =[collection,gallery]
        let macroFchanged = false;
        if (macroMode == 1) {
            if (macros[macroModeTarget].data.some(e => e.groupID === groupID)) {
                macros[macroModeTarget].data.forEach(function (el) {
                    if (el.groupID === groupID) {
                        el.folderID = folderID;
                        el.folderName = loadedFolders.get(folderID);
                    }
                }); //change folder of present group
                macroFchanged = true;
            } else { //don't add if included already
                macros[macroModeTarget].data.push({
                    folderName: loadedFolders.get(folderID),
                    folderID: folderID,
                    groupID: groupID,
                    type: type
                });
            }
            GM.setValue("macros", JSON.stringify(macros));
        }

        return new Promise(function (resolve, reject) {
            let token = $("input[name=validate_token]").val();
            let dat = {
                "groupid": parseInt(groupID),
                "type": type.toString(),
                "folderid": parseInt(folderID),
                "deviationid": parseInt(devID),
                "csrf_token": token.toString(),
            };
            let murl = `https://www.deviantart.com/_puppy/dadeviation/group_add`;
            if (macroMode == 1) { //don't submit while adding to macros
                resolve({ success: true, gname: groupNameById(groupID), fname: loadedFolders.get(folderID), fchanged: macroFchanged });
            } else {
                GM.xmlHttpRequest({
                    method: "POST",
                    url: murl,
                    headers: {
                        "Accept": 'application/json, text/plain, */*',
                        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
                        "Content-Type": 'application/json',
                        "Pragma": "no-cache",
                        "Cache-Control": "no-cache"
                    },
                    dataType: 'json',
                    data: JSON.stringify(dat),
                    onerror: function (response) {
                        response.gname = groupNameById(groupID);
                        reject(err(errtyps.Connection_Error, "Connection to https://www.deviantart.com/_puppy/dadeviation/group_add failed", response));
                    },
                    onload: async function (response) {
                        let resp = JSON.parse(response.responseText);
                        resp.gname = groupNameById(groupID);
                        resolve(resp);
                    }
                });
            }
        });
    }

    function playMacro(index) {
        macroMode = 2;
        let promises = [];
        for (let d of macros[index].data) {
            promises.push(requestAddSubmission(devID, d.folderID, d.groupID, d.type));
        }
        Promise.all(promises).catch(err => {
            alert(macros[index].name + " Error!<br/>" + JSON.stringify(macros[index].data) + " " + JSON.stringify(err), "Error");
        }).then(res => {
            myMsgBox(
                res.filter(obj => obj.gname !== "").map(obj => {
                    let retval = "<strong>" + obj.gname + "</strong>: "
                    if (obj.success) {
                        retval += "Success! ";
                        if (obj.needsVote == true) retval += " Vote pending";
                    } else {
                        retval += "Error! ";
                        if (obj.errorDetails) retval += obj.errorDetails;
                    }
                    return retval;
                }).join("<br/>"), "Play Macro " + macros[macroModeTarget].name);
        })
        macroMode = 0;
    }
    //event handlers
    function Ev_groupClick(event) { //event propagation
        event.stopPropagation();

        let targetBut = $(event.target).closest(".dgl2_groupButton");
        let groupID = targetBut.attr("groupID");
        let groupNam = targetBut.attr("groupname");

        if (groupID == "undefined") {
            grabIDfromPage(groupNam).then(id => {
                $(event.target).closest(".dgl2_groupButton").attr("groupID", id);
                Ev_groupClick(event);
            });
            return;
        }
        let elInd;
        switch (colMode) {
            case 1: //add
                elInd = collections[colModeTarget].groups.indexOf(groupID);
                if (elInd == -1) {
                    collections[colModeTarget].groups.push(groupID);
                    GM.setValue("collections", JSON.stringify(collections));
                    targetBut.addClass("dgl2_inCollection");
                    targetName = targetBut.attr("groupName");
                    document.querySelector("#dgl2_CollTab [colid='"+collections[colModeTarget].id+"'] .dgl2_colGrCnt").innerHTML=collections[colModeTarget].groups.length;
                }
                break;
            case 2: //remove
                targetName = collections[colModeTarget].name;
                switch (colListMode) {
                    case 0: //collection
                        elInd = collections[colModeTarget].groups.indexOf(groupID);
                        if (elInd > -1) {
                            collections[colModeTarget].groups.splice(elInd, 1);
                            document.querySelector("#dgl2_CollTab [colid='"+collections[colModeTarget].id+"'] .dgl2_colGrCnt").innerHTML=collections[colModeTarget].groups.length;
                            GM.setValue("collections", JSON.stringify(collections));
                        }
                        insertFilteredGroups(colModeTarget);
                        break;
                    case 1: //macro
                        for (elInd = 0; elInd < macros[macroModeTarget].data.length; ++elInd) {
                            if (macros[macroModeTarget].data[elInd].groupID == groupID) break;
                        }

                        if (elInd < macros[macroModeTarget].data.length) {
                            macros[macroModeTarget].data.splice(elInd, 1);
                            GM.setValue("macros", JSON.stringify(macros));
                        }
                        insertMacroGroups(macroModeTarget);
                        break;
                }
                break;
            case 0:
            default:
                if (targetBut.attr("type") == "group") {
                    lastGroupClickID = targetBut.attr("groupID");
                    scrollPosBefore = document.querySelector(".dgl2_groupCol").scrollTop;
                    fillSubFolder(groupID, "gallery", groupNam);
                    if (macroMode != 1) {
                        targetName = targetBut.attr("groupName");

                        [...document.querySelectorAll(`.dgl2_colContains`)].forEach(el => el.classList.remove("dgl2_colContains"));
                        collections.forEach(function (collection) {
                            if (collection.groups.length === 0 || collection.groups.includes(groupID)) {
                                document.querySelector(`#dgl2_CollTab [colid="${collection.id}"]`).classList.add("dgl2_colContains");
                            }
                        });
                    } else {

                    }
                    // displayModeText();
                    //Add this deviation to a group folder
                } else if (targetBut.attr("type") == "folder") {
                    requestAddSubmission(devID, targetBut.attr("folderID"), targetBut.attr("groupID"), targetBut.attr("folderType")).then(function (arg) {
                        if (arg.success == true) {
                            if (macroMode == 1) {
                                if (arg.fchanged) {
                                    myMsgBox(arg.gname + " target folder changed to " + arg.fname, "Info");
                                } else {
                                    myMsgBox(arg.gname + "/" + arg.fname + " added to macro", "Info");
                                }
                                insertMacros(); //update titles
                                filterDisplay(false); //go back to groups view

                                $("div.dgl2_groupWrapper").addClass("dgl2_addGroup");
                                displayModeText();
                                //$("span.dgl2_descr").text("macro " + macros[macroModeTarget].name + " is recording.");
                                for (let el of macros[macroModeTarget].data) {
                                    $("button.dgl2_groupButton[groupID=" + el.groupID + "]").addClass("dgl2_inCollection");
                                }
                                macroMode = 1;

                                document.querySelector(".dgl2_groupCol").scrollTop = scrollPosBefore;
                                let lastgrBut = $("button[groupid=" + lastGroupClickID + "]")
                                //lastgrBut[0].scrollIntoView();
                                lastgrBut.addClass("shadow-pulse");
                            } else {
                                let retfun = function () {
                                    $("span.dgl2_titleText").click();
                                    document.querySelector(".dgl2_groupCol").scrollTop = scrollPosBefore;
                                    let lastgrBut = $("button[groupid=" + lastGroupClickID + "]")
                                    // lastgrBut[0].scrollIntoView();
                                    lastgrBut.addClass("shadow-pulse");
                                };
                                if (arg.needsVote) {
                                    myMsgBox("Success! Submission pending group's vote", "Info").then(retfun);
                                } else {
                                    myMsgBox("Success! Submission added to group", "Info").then(retfun);
                                }
                            }

                        } else {
                            throw arg;
                        }
                        /*
		deviationGroupCount: 1
		needsVote: true
		*/
                    }).catch(function (arg) {
                        let tx = "deviation-ID: " + devID + "<br/>" +
                            "Group-Name: " + (arg.gname ? arg.gname : "Unknown") + "<br/>" +
                            (arg.errorDescription ? arg.errorDescription : "Unexpected error.") + "<br/>" +
                            (arg.errorDetails ? JSON.stringify(arg.errorDetails) : JSON.stringify(arg))
                        let errg = err(errtyps.Unknown_Error, tx, arg);
                        errorHndl(errg);
                    });
                }
        }
    }

    function Ev_ContextSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        event.target = $("#dgl2_grContext select option:selected").get(0);
        Ev_groupClick(event);
        $("#dgl2_grContext").hide().find("select").empty();
    }

    function Ev_groupContext(event) {
        event.stopPropagation();
        event.preventDefault();

        let groupID = $(event.target).closest("button.dgl2_groupButton").attr("groupid");
        if(groupID==null){return;}

        let el = $("#dgl2_grContext");
        if (el.length == 0) {
            el = $("<div id='dgl2_grContext'><span class='desc'>Submit to a Folder</span><br /><select size=5></select><br/><button>Submit</button></div>").appendTo(document.body);
            el.find("button").click(Ev_ContextSubmit);
        }
        el.find("select").hide();
        el.finish().show().css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
        fillSubFolder(groupID, "gallery", $(event.target).closest("button.dgl2_groupButton").attr("groupname")).then(function () {
            if(el.find("select").find("option").length==0)el.hide();
            el.find("select").show().focus().get(0).selectedIndex = 0;
        });

    }

    function highlightLetter(which) {

        $(".dgl2_letterfound").removeClass("dgl2_letterfound");
        $(".dgl2_groupdialog button.dgl2_groupButton[groupName^='" + which + "' i]").addClass("dgl2_letterfound").focus();
        $(".dgl2_groupdialog button.dgl2_groupButton[folderName^='" + which + "' i]").addClass("dgl2_letterfound").focus();
    }

    function Ev_colListClick(event) {
        event.stopPropagation();
        if (event.target.role == "collections") {
            colListMode = 0;
            $("div.dgl2_CollTitle.active").removeClass("active");
            $("div.dgl2_CollTitle[role='collections']").addClass("active");
            insertCollections();
        } else if (event.target.role == "macros") {
            colListMode = 1;
            $("div.dgl2_CollTitle.active").removeClass("active");
            $("div.dgl2_CollTitle[role='macros']").addClass("active");
            insertMacros();
        }

        let id = $(event.target).closest("li").first().attr("colID");
        if (typeof id == "undefined" && $(event.target).closest("button").hasClass("dgl2_topBut")) id = 0;
        else if (typeof id == "undefined") return;
        let clasNam = $(event.target).closest("button").attr("class");
        let index;
        if (colListMode == 0) index = colIndexById(id);
        else if (colListMode == 1) index = makIndexById(id);
        $("div.dgl2_groupWrapper").removeClass("dgl2_addGroup").removeClass("dgl2_remGroup");
        $("button.dgl2_inCollection").removeClass("dgl2_inCollection");
        let el;
        let obj, dat;
        let d = new Date();
        targetName = "";

        if (clasNam) clasNam = clasNam.replace(" dgl2_topBut", "");
        switch (clasNam) {
            case "dgl2_export":
                obj = {
                    collections: collections,
                    collectionOrder: collectionOrder,
                    macros: macros,
                    macroOrder: macroOrder
                };
                dat = d.getFullYear() + ("0" + d.getMonth()).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2);
                download(JSON.stringify(obj), "dev_group_list2_data_" + dat + ".txt");
                break;
            case "dgl2_import":
                upload().then(function (imp) {
                    try {
                        let i;
                        let obj = JSON.parse(imp);
                        if (obj.macros && obj.macroOrder) {
                            macros = obj.macros;
                            macroOrder = obj.macroOrder;
                        }
                        if (obj.collections && obj.collectionOrder) {
                            collections = obj.collections;
                            collectionOrder = obj.collectionOrder;
                        } else if (typeof obj[0] != "undefined" && (obj[0][0].indexOf("_collist") != -1 || obj[1][0].indexOf("_collist") != -1)) { //v1 compatibility mode
                            collections = [{
                                id: 0,
                                name: "all",
                                groups: [],
                                showing: 1
                            }];
                            let ind = (obj[0][0].indexOf("_collist") != -1) ? 0 : ((obj[1][0].indexOf("_collist") != -1) ? 1 : -1)
                            let oldList = obj[ind][1].split("\u0002");
                            let coll = oldList.map((list, ind) => {
                                let entries = list.split("\u0001");
                                let nam = entries.shift();
                                return {
                                    id: ind + 1,
                                    name: nam,
                                    groups: entries.map(el => {
                                        return $("button[groupname='" + el + "']").attr("groupid");
                                    }).filter(el => typeof el != "undefined"),
                                    showing: 1
                                }
                            });
                            collections = collections.concat(coll).sort((a, b) => a.id > b.id);
                            collectionOrder = collections.map(col => "dgl2item-" + col.id);
                        } else {
                            throw "No collections found!";
                        }
                        //clean up old groups not beeing a member of anymore
                        for (i in macros) {
                            macros[i].data = macros[i].data.filter(el => { return groupNameById(el.groupID) != "" });
                        }
                        for (i in collections) {
                            collections[i].groups = collections[i].groups.filter(el => { return groupNameById(el) != "" });
                        }
                    } catch (ex) {
                        errorHndl(err(errtyps.Parse_Error, "Not a valid dev_group_list2 file", ex));
                        return;
                    }

                    GM.setValue("collectionOrder", JSON.stringify(collectionOrder));
                    GM.setValue("collections", JSON.stringify(collections));
                    GM.setValue("macroOrder", JSON.stringify(macroOrder));
                    GM.setValue("macros", JSON.stringify(macros));
                    myMsgBox("Import successfull!", "Info");
                    filterDisplay();
                    $("div.dgl2_CollTitle[role='collections']").click();
                });
                break;
            case "dgl2_add":
                // filterDisplay();
                switch (colListMode) {
                    case 0: //collection
                        targetName = collections[index].name;
                        colMode = 1;
                        colModeTarget = index;
                        $("div.dgl2_groupWrapper").addClass("dgl2_addGroup");
                        for (el of collections[index].groups) {
                            $("button.dgl2_groupButton[groupID=" + el + "]").addClass("dgl2_inCollection");
                        }
                        displayModeText();
                        break;
                    case 1:
                        colMode = 0;
                        // filterDisplay();
                        $("div.dgl2_groupWrapper").addClass("dgl2_addGroup");
                        targetName = macros[index].name;
                        for (el of macros[index].data) {
                            $("button.dgl2_groupButton[groupID=" + el.groupID + "]").addClass("dgl2_inCollection");
                        }
                        macroMode = 1;
                        macroModeTarget = index;
                        displayModeText();
                        break;
                }
                break;
            case "dgl2_sub":
                switch (colListMode) {
                    case 0: //collection
                        insertFilteredGroups(index);
                        targetName = collections[index].name;
                        colMode = 2;
                        colModeTarget = index;
                        $("div.dgl2_groupWrapper").addClass("dgl2_remGroup");
                        displayModeText();
                        break;
                    case 1: //macro
                        insertMacroGroups(index);
                        targetName = macros[index].name;
                        colMode = 2;
                        macroMode = 3;
                        macroModeTarget = index;
                        $("div.dgl2_groupWrapper").addClass("dgl2_remGroup");
                        displayModeText();
                        break;
                }
                break;
            case "dgl2_del":
                switch (colListMode) {
                    case 0: //collection
                        myMsgBox("Delete Collection " + collections[index].name + " ?", "Collection", 1).then(con => {
                            if (!con) return;
                            collections.splice(index, 1);
                            collectionOrder.splice(collectionOrder.indexOf("dgl2item-" + id), 1);

                            GM.setValue("collectionOrder", JSON.stringify(collectionOrder));
                            GM.setValue("collections", JSON.stringify(collections));

                            filterDisplay(true);
                            insertCollections();
                        });
                        break;
                    case 1: //macro
                        myMsgBox("Delete Macro " + macros[index].name + " ?", "Macro", 1).then(con => {
                            if (!con) return;
                            macros.splice(index, 1);
                            macroOrder.splice(macroOrder.indexOf("dgl2item-" + id), 1);

                            GM.setValue("macroOrder", JSON.stringify(macroOrder));
                            GM.setValue("macros", JSON.stringify(macros));

                            filterDisplay();
                            insertMacros();
                        });
                        break;
                }
                break;
            case "dgl2_new":
                switch (colListMode) {
                    case 0: //collection
                        el = {
                            name: "New Collection",
                            groups: [],
                            showing: 1
                        };
                        el.id = getLowestFree(collections);
                        collections.push(el);
                        collectionOrder.push("dgl2item-" + el.id);

                        GM.setValue("collectionOrder", JSON.stringify(collectionOrder));
                        GM.setValue("collections", JSON.stringify(collections));

                        filterDisplay();
                        insertCollections();
                        break;
                    case 1: //macros
                        el = {
                            name: "New Macro",
                            data: []
                        };
                        el.id = getLowestFree(macros);
                        macros.push(el);
                        macroOrder.push("dgl2item-" + el.id);

                        GM.setValue("macroOrder", JSON.stringify(macroOrder));
                        GM.setValue("macros", JSON.stringify(macros));

                        filterDisplay();
                        insertMacros();
                        break;
                }
                break;
            case "dgl2_visible":

                switch (colListMode) {
                    case 0: //collection
                        if (!collections[index].hasOwnProperty("showing")) collections[index].showing = 0;
                        else collections[index].showing = 1 - collections[index].showing; //toggle 0 and 1
                        GM.setValue("collections", JSON.stringify(collections));

                        $(event.target).closest("li").attr("active", collections[index].showing);
                        filterDisplay();
                        break;
                    case 1: //macro
                        //donothing
                        break;
                }
                break;
            case "dgl2_edit":
                switch (colListMode) {
                    case 0: //collection
                        myMsgBox("Please enter a new collection name!", "Change Collection Name", 2, collections[index].name).then(nam => {
                            if (!nam) return;
                            collections[index].name = nam;
                            GM.setValue("collections", JSON.stringify(collections));
                            insertCollections();
                        });
                        break;
                    case 1: //macro
                        myMsgBox("Please enter a new macro name!", "Change Macro Name", 2, macros[index].name).then(nam => {
                            if (!nam) return;
                            macros[index].name = nam;
                            GM.setValue("macros", JSON.stringify(macros));
                            insertMacros();
                        });
                        break;
                }
                break;
            case undefined:
            default:
                switch (colListMode) {
                    case 0: //collection
                        colMode = 0;
                        insertFilteredGroups(index);
                        break;

                    case 1: //macro
                        myMsgBox("Do you want to add this to the following groups?<br/>" + macros[index].data.map(obj => {
                            return groupNameById(obj.groupID);
                        }).join(", "), "Submit to Groups", 1).then(con => {
                            if (!con) { } else {
                                macroMode = 2;
                                playMacro(index);
                            }
                            displayModeText();
                        });
                        break;
                }

        }
        displayModeText();
    }

    function Ev_getGroupClick() {
        if (fetchingGroups) return;
        fetchingGroups = true;
        allGroups.forEach((el) => {
            if (el.userId == 0) {
                el.userId = "undefined"
                el.useridUuid = "undefined"
            }
        });

        $("span.dgl2_descr").text("Loading Module ID...");
        $("#dgl2_refresh").css("cursor", "pointer");
        fillModuleID().then(function () {
            $("span.dgl2_descr").text("Loading List of Groups...");
            $("#dgl2_refresh").css("cursor", "wait");
            return fillGroups(0);
        }).then(function () {
            $("span.dgl2_descr").text("Loading List of Admin-Groups...");
            return fillAdminGroups(0);
        }).then(function () {
            GM.setValue("groups", JSON.stringify(allGroups));
        }).catch(function (e) {
            if (e.ErrType != null) errorHndl(e);
            else errorHndl(err(errtyps.Unknown_Error, "fillGroups error", e));
        }).finally(function () {
            fetchingGroups = false;
            allGroups = allGroups.filter(el => { return el != null && el.username != null; });
            allGroups.sort((a, b) => a.username.localeCompare(b.username));
            filterDisplay();
            $("#dgl2_refresh rect").css("fill", "");
            $("#dgl2_refresh").css("cursor", "pointer");
            displayModeText();
            document.querySelector("#dgl2_CollTab [colid='0'] .dgl2_colGrCnt").innerHTML=allGroups.length;
        });
    }
    //templates
    function getGroupTemplate(name, img, id, latestDate = null) { //return HTML string
        return `<button title='${escapeHtml(name)}${(latestDate != null) ? "\nLast submission: " + (new Date(latestDate)).toLocaleString() : ""}' class='dgl2_groupButton' groupID=${id} type='group' groupName='${escapeHtml(name)}' activity='${latestDate == null ? "unknown" : ((inactiveDate < new Date(latestDate)) ? "active" : "inactive")}'>
	<div class='dgl2_imgwrap'>
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' class='dgl2_hover'>"
			<path d='M4.75,3.25 L7,3.25 L7,4.75 L4.75,4.75 L4.75,7 L3.25,7 L3.25,4.75 L1,4.75 L1,3.25 L3.25,3.25 L3.25,1 L4.75,1 L4.75,3.25 Z'></path>
		</svg>
		<img class='dgl2_group_image' src='${img}'/>
	</div>
	<div class='dgl2_groupName'>${escapeHtml(name)}</div>
	</button>`;
    }

    function getSubFolderOptionTemplate(name, devCnt, grID, foID, foType, img) {
        //text option only needs name,IDs and type
        return "<option class='dgl2_groupButton' groupID=" + grID + " folderName='" + escapeHtml(name) + "' folderID=" + foID + " folderType='" + foType + "' type='folder'>" + escapeHtml(name) + "</option>";
    }

    function getSubFolderTemplate(name, devCnt, grID, foID, foType, img, parentId) { //return HTML string
        loadedFolders.set("" + foID, name);
        let imgstring;
        if (img == null) { //no thumbnail (empty or readonly)
            imgstring = "<div class='dgl2_group_image'></div>";
        } else if (img.textContent) { //journal
            imgstring = "<p class='dgl2_journalSubF'>" + img.textContent.excerpt + "</p>";
        } else {
            let i;
            let cstr = "";
            img = img.media;
            for (i of img.types) {
                if (typeof i.c != "undefined") {
                    cstr = i.c;
                    break;
                }
            }
            if (cstr == "") {
                for (i of img.types) {
                    if (typeof i.s != "undefined") {
                        cstr = i.s;
                        break;
                    }
                }
            }
            if (img.baseUri) imgstring = img.baseUri;
            if (img.prettyName) imgstring += cstr.replace("<prettyName>", img.prettyName);
            if (img.token) imgstring += "?token=" + img.token[0];
            imgstring = "<img class='dgl2_group_image' title='" + escapeHtml(name) + "' src='" + imgstring + "'/>";
        }
        let parentIdStr = (parentId ? " parentId='" + parentId + "'" : "");

        return "<button class='dgl2_groupButton' groupID=" + grID + " folderName='" + escapeHtml(name) + "' folderID=" + foID + " folderType='" + foType + "'" + parentIdStr + " type='folder'>" +
            "  <div class='dgl2_imgwrap'>" +
            "    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' class='dgl2_hover'>" +
            "      <path d='M4.75,3.25 L7,3.25 L7,4.75 L4.75,4.75 L4.75,7 L3.25,7 L3.25,4.75 L1,4.75 L1,3.25 L3.25,3.25 L3.25,1 L4.75,1 L4.75,3.25 Z'></path>" +
            "    </svg>" +
            imgstring +
            "  </div>" +
            "  <div class='dgl2_groupName'>" + escapeHtml(name) + "</div>" +
            "  <div class='dgl2_devCnt'>" + devCnt + "</div>" +
            "</button>";
    }

    function getSearchBarTemplate() {
        return "<input id='dgl2_searchbar' type='text' placeholder='Search'/>";
    }

    function getCollectionColTemplate() {
        return `<div id='dgl2_CollTab'><div class='dgl2_CollTitleBut'>
		 <div class='dgl2_CollTitle' role='collections'>Collections</div>
		 <div class='dgl2_CollTitle' role='macros'>Macros</div>
		 <div class='' role='buttons'></div>
		 </div><ul class='sortableList'></ul></div>`;
    }

    function getAddButTemplate() {
        let sty = getComputedStyle(document.body);
        return "<button title='Add group to collection/macro' class='dgl2_add'><svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='24' height='24' viewBox='0 0 172 172'>" +
            "	<g style='stroke:" + sty.color + ";stroke-width:15;'>" +
            "		<rect x='00' y='00' style='opacity:0.1' rx='50' ry='50' width='172' height='172'></rect>" +
            "		<line x1='86' y1='30' x2='86' y2='142' />" +
            "		<line x1='30' y1='86' x2='142' y2='86' />" +
            "	</g>" +
            "</svg></button>";
    }

    function getRecButTemplate() {
        let sty = getComputedStyle(document.body);
        return "<button title='Add groups to macro' class='dgl2_add'><svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='24' height='24' viewBox='0 0 172 172'>" +
            "	<g style='stroke:" + sty.color + ";stroke-width:15;'>" +
            "		<rect x='00' y='00' style='opacity:0.1' rx='50' ry='50' width='172' height='172'></rect>" +
            "		<ellipse cx='86' cy='86' rx='40' ry='40'></ellipse>" +
            "	</g>" +
            "</svg></button>";
    }

    function getNewColTemplate() {
        let sty = getComputedStyle(document.body);
        return "<button title='New collection/macro' class='dgl2_new dgl2_topBut'><svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='24' height='24' viewBox='0 0 172 172'>" +
            "	<g style='stroke:" + sty.color + ";stroke-width:15;'>" +
            "		<rect x='00' y='00' style='opacity:0.1' rx='50' ry='50' width='172' height='172'></rect>" +
            "		<line x1='86' y1='30' x2='86' y2='142' />" +
            "		<line x1='30' y1='86' x2='142' y2='86' />" +
            "	</g>" +
            "</svg></button>";
    }

    function getSubButTemplate() {
        let sty = getComputedStyle(document.body);
        return "<button title='Remove groups from collection/macro' class='dgl2_sub'><svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='24' height='24' viewBox='0 0 172 172'>" +
            "	<g style='stroke:" + sty.color + ";stroke-width:15;'>" +
            "		<rect x='00' y='00' style='opacity:0.1' rx='50' ry='50' width='172' height='172'></rect>" +
            "		<line x1='30' y1='86' x2='142' y2='86' />" +
            "	</g>" +
            "</svg></button>";
    }

    function getRefreshButTemplate() {
        let sty = getComputedStyle(document.body);
        return "<button  title='refresh list of groups' id='dgl2_refresh'><svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='24' height='24' viewBox='0 0 172 172' style=' fill:#000000;'><g fill='none' fill-rule='nonzero' stroke='none' stroke-width='1' stroke-linecap='butt' stroke-linejoin='miter' stroke-miterlimit='10' stroke-dasharray='' stroke-dashoffset='0' font-family='none' font-weight='none' font-size='none' text-anchor='none' style='mix-blend-mode: normal'><path d='M0,172v-172h172v172z' fill='none'></path>" +
            " <linearGradient id='dgl2_grad1' x1='0%' y1='100%' x2='0%' y2='0%'><stop id='dgl2_grad1_stop1' offset='0%' style='stop-color:rgb(0,255,0);stop-opacity:1' /><stop id='dgl2_grad1_stop2' offset='100%' style='stop-color:rgb(255,0,0);stop-opacity:1' /></linearGradient>" +
            "<rect x='00' y='00' style='stroke:" + sty.color + ";stroke-width:5;opacity:0.1' rx='50' ry='50' width='172' height='172'></rect>" +
            "<g fill='" + sty.color + "'><path d='M62.00062,36.98l7.99979,10.89333h21.44625c18.10591,0 32.68,14.57409 32.68,32.68v21.78667h-16.34l21.78667,29.78646l21.78667,-29.78646h-16.34v-21.78667c0,-23.99937 -19.57396,-43.57333 -43.57333,-43.57333zM42.42667,39.87354l-21.78667,29.78646h16.34v21.78667c0,23.99938 19.57396,43.57333 43.57333,43.57333h29.44604l-7.99979,-10.89333h-21.44625c-18.10591,0 -32.68,-14.57409 -32.68,-32.68v-21.78667h16.34z'></path></g><path d='M43.86,172c-24.22321,0 -43.86,-19.63679 -43.86,-43.86v-84.28c0,-24.22321 19.63679,-43.86 43.86,-43.86h84.28c24.22321,0 43.86,19.63679 43.86,43.86v84.28c0,24.22321 -19.63679,43.86 -43.86,43.86z' fill='none'></path><path d='M47.3,168.56c-24.22321,0 -43.86,-19.63679 -43.86,-43.86v-77.4c0,-24.22321 19.63679,-43.86 43.86,-43.86h77.4c24.22321,0 43.86,19.63679 43.86,43.86v77.4c0,24.22321 -19.63679,43.86 -43.86,43.86z' fill='none'></path></g></svg></button";
    }

    function getDelButTemplate() {
        let sty = getComputedStyle(document.body);
        return "<button title='Delete collection/macro' class='dgl2_del'><svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='24' height='24' viewBox='0 0 172 172'>" +
            "<g style='stroke-width:5;stroke:" + sty.color + ";fill:none'>" +
            "	<rect x='00' y='00' style='opacity:0.1' rx='50' ry='50' width='172' height='172'></rect>" +
            "	<rect x='50' y='50' rx='5' ry='5' width='72' height='92'></rect>" +
            "	<rect x='65' y='35' rx='5' ry='5' width='42' height='15'></rect>" +
            "  <line x1='40' y1='50' x2='132' y2='50'/>" +
            "  <line x1='70' y1='132' x2='70' y2='60'/>" +
            "  <line x1='86' y1='132' x2='86' y2='60'  />" +
            "  <line x1='104' y1='132' x2='104' y2='60' />" +
            "  </g>" +
            "</svg></button>";
    }

    function getExportButTemplate() {
        return '<button title="Export collection/macro list to file" class="dgl2_export dgl2_topBut"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 5.2916665 5.2916668">' +
            '   <g transform="translate(0,-291.70832)">' +
            '      <path style="fill:#008000;"' +
            '          d="M 0.26458332,291.9729 H 5.0270831 v 4.7625 H 0.79345641 l -0.52887309,-0.51217 z" />' +
            '      <rect style="fill:#ffffff;" width="3.7041667" height="1.8520833" x="0.79374999" y="292.23749" />' +
            '      <rect style="fill:#ffffff;" width="2.6458333" height="1.3229259" x="1.3229166" y="295.41248" />' +
            '      <rect style="fill:#008000;" width="0.52916676" height="0.79375702" x="2.9104166" y="295.67706" />' +
            '   </g>' +
            '</svg></button>';
    }

    function getImportButTemplate() {
        return '<button class="dgl2_import dgl2_topBut" title="Import collection/macro list from file" ><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 5.2916665 5.2916668">' +
            '	<g transform="translate(0,-291.70832)">' +
            '		<rect style="fill:#806600;" width="3.96875" height="2.9104137" x="0.52916664" y="293.03125" />' +
            '		<path style="fill:#ffcc00;" d="m 0.52916666,295.94165 0.79375004,-2.11666 h 3.96875 l -0.7937501,2.11666 z" />' +
            '		<rect style="fill:#00DD00;" width="0.52916664" height="1.0583333" x="3.4395833" y="292.50208" />' +
            '		<path style="fill:#00DD00;" d="m 3.175,292.50207 0.5291667,-0.52917 0.5291667,0.52917 z" />' +
            '	</g>' +
            '</svg></button>';
    }

    function getTitleBarTemplate() {
        return '<span class="dgl2_titleText">Add to Group</span>' +
            '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill-rule="evenodd" d="M8.84210526,13 L8.84210526,21.1578947 L2,21.1578947 L2,9.57894737 L12,3 L22,9.57894737 L22,21.1578947 L15.1578947,21.1578947 L15.1578947,13 L8.84210526,13 Z"></path></svg>' +
            '<span class="dgl2_descr">Add this deviation to one of your groups</span>'
    }

    function getEditButTemplate() {
        return '<button title="Change collection/macro name" class="dgl2_edit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.389 6.4503l-3-3-1.46-1.45-1.41 1.42-11.52 11.58-1 .97v6.03h5.987l1.013-1 11.41-11.76 1.39-1.41-1.41-1.38zm-4.45-1.62l3 3-.88.87-3-3 .88-.87zm.74 5.33l-8.21 8.2-2.801-3.0118 8.0028-8.099 3.0083 2.9108zm-12.68 9.84v-3.17l3.0433 3.17H3.9991z"></path></svg></button>';
    }

    function getVisibleButTemplate() {
        return `<button title="Hide/show groups within collection" class="dgl2_visible">
<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 500 250" stroke-width="20">
<defs>
<radialGradient id="c1" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#ffffff" />
<stop offset=".5" stop-color="hsl(40, 60%, 60%)" />
<stop offset="1" stop-color="#3dff3d" />
</radialGradient>
</defs>
<ellipse role="sclera" cx="250" cy="125" rx="200" ry="100" fill="white"/>
<ellipse role="iris" cx="250" cy="125" rx="95" ry="95" stroke="black" fill="url(#c1)"/>
<ellipse role="pupil" cx="250" cy="125" rx="50" ry="50" stroke="none" fill="black"/>
<ellipse role="light" cx="200" cy="80" rx="50" ry="50" stroke="none" fill="#fffffaee"/>
<ellipse role="outline" cx="250" cy="125" rx="200" ry="100" stroke="black" fill="none"/>
</svg>
</button>`;
    }

    function addCss() {
        if ($("#dgl2_style").length > 0) return;
        let style = $("<style type='text/css' id='dgl2_style'></style>");

        //searchbar
        style.append("#dgl2_searchbar{background: var(--L3);box-shadow: inset 0 1px 4px 0 rgba(0,0,0,.25);padding: 5px;width: 50%;}");

        //right collection column
        style.append(`
#dgl2_CollTab{color: #2d3a2d;padding-left:15px; overflow-y: auto;font-family: CalibreSemiBold,sans-serif;font-weight: 600;font-size: 20px;font-display: swap;line-height: 24px;letter-spacing: .3px;margin-bottom: 28px;grid-row: 2;}
#dgl2_CollTab ul{overflow-wrap: anywhere;overflow: auto;list-style: none;margin-top: 20px;}
#dgl2_CollTab ul li{cursor:pointer;padding:2px;display:grid;grid-template: auto/7px auto 16px 16px 16px 16px 16px;}
#dgl2_CollTab ul li:hover{background:linear-gradient(to right, rgba(255,0,0,0.1), rgba(255,0,0,0));}
#dgl2_CollTab button{cursor:pointer;border-width: 0;padding: 0;margin: 0;background-color: transparent;}
#dgl2_CollTab button rect{user-select: none;fill: #f008;}
#dgl2_CollTab button:hover rect{fill:red; }
#dgl2_refresh{margin-left:auto;border-width:0px;background:transparent;cursor:pointer}
#dgl2_CollTab div.buttons{display: inline-block;vertical-align: middle;margin: 0 5px;}
div.dgl2_groupCol{overflow-y:auto;grid-row: 2;position:relative;}
div.dgl2_groupdialog{display: grid;position: fixed;top: 50%;left: 50%;z-index:42;transform: translate(-50%,-50%);height: 80%;background-color:#afcaa9;grid-template-columns: auto 300px;grid-template-rows: 50px auto;width: 80%;border: 2px solid #2a5d00;border-radius: 10px;box-shadow: 1px 1px 2px ;}
div.dgl2_titlebar{cursor:move;display:flex;justify-content:space-between;grid-row: 1;grid-column: 1/3;background: linear-gradient(#619c32,#378201);color: white;align-items: center;}
div.dgl2_titlebar > * {margin: 7px;}
#dgl2_refresh:hover rect{fill:red;}
div.dgl2_closeDiag{border-radius: 50px;padding: 7px;cursor: pointer;}
#dgl2_refresh rect{fill:rgba(255,0,0,0.1);}
#dgl2_CollTab ul li span.handle{vertical-align:middle; display:inline-block; width:5px; height:100%; cursor:move; text-align:center;background-color:#363; background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38gYGAEESAAEGAAasgJOgzOKCoAAAAASUVORK5CYII=);}
button.dgl2_groupButton{vertical-align:bottom;border-radius:15px; background-color:rgba(255,255,255,0.5);margin:5px; padding:5px; width:120px; border-width:0px; overflow:hidden; position:relative; cursor:pointer; }
button.dgl2_groupButton[parentId]{border-bottom:2px solid #d57917;margin-bottom:15px;}
button.dgl2_groupButton[parentId] img {height: 25px;}
div.dgl2_imgwrap{ position: relative;}
svg.dgl2_hover{ position: absolute; left: 50%; width:50%; height:50%; transform: translate(-50%,50%); opacity:0; transition: ease 0.25s; }
img.dgl2_group_image{ opacity:1; width:100px; height:50px; transition: ease 0.25s; border-radius:2px; }
div.dgl2_groupName{ font-family: CalibreSemiBold; font-size: 15px; line-height: 15px; font-weight: 600; letter-spacing: 0.3px; word-break: break-word; }
button.dgl2_groupButton:hover{background-color:rgba(255,255,255,0.8);}
button.dgl2_groupButton:hover svg.dgl2_hover{opacity:1;}
button.dgl2_groupButton:hover img.dgl2_group_image{opacity:0.3;}
button.dgl2_groupButton:active{background-color:rgba(255,255,255,0.3);}
button.dgl2_groupButton.dgl2_inGroup{background-image:linear-gradient(red, transparent);}
span.dgl2_titleText{cursor:pointer;}
span.dgl2_descr{font-family: CalibreRegular,sans-serif; font-weight: 400; font-size: 13px; font-display: swap; letter-spacing: 1.3px; margin-left: 32px; text-transform: uppercase;}
button.dgl2_edit{height:0.5em;}
button.dgl2_edit:hover path{fill:red;}
#dgl2_CollTab button svg{width: 90%;}
#dgl2_CollTab button.dgl2_visible:hover ellipse{stroke: red;}
div.dgl2_addGroup{background-color: rgba(0, 255, 0, 0.3);}
div.dgl2_remGroup{background-color: rgba(255, 0, 0, 0.3);}
button.dgl2_inCollection{background-color: rgba(15, 104, 5, 0.7);}
button.dgl2_export:hover ,button.dgl2_import:hover {opacity:0.8}
button.dgl2_export:active ,button.dgl2_import:active {opacity:1}
div.dgl2_CollTitleBut{display: flex;gap: 5px;margin: 5px 0;}
#dgl2_CollTab div.dgl2_CollTitle {cursor:pointer;border: 1px ridge green;border-radius: 10px 10px 0 0;padding: 1px 4px;background: linear-gradient(to bottom, #8fae70, #a1c38b);user-select: none;}
#dgl2_CollTab div.dgl2_CollTitle:hover {background: linear-gradient(to bottom, #99be74, #85be5f);}
#dgl2_CollTab div.dgl2_CollTitle.active {background: linear-gradient(to bottom, #bfee7f, #97d570)!important;}
.dgl2_journalSubF { overflow: hidden; height: 50px; font-size: xx-small; text-align: left; margin-bottom: 5px;}
.groupPopup .ui-widget-content{background-color:#afcaa9 !important;color:black;}
button.dgl2_letterfound {background-color: rgba(105, 14, 5, 0.7);}
.folderInMacro {background-color:rgba(205, 24, 25, 0.6)!important;}
@keyframes shadowPulse {0% {box-shadow: 0px 0px 50px 20px #f00;} 100% {box-shadow: 0px 0px 50px 20px #ff000000;}}
.shadow-pulse {animation-name: shadowPulse;animation-duration: 0.5s;animation-iteration-count: infinite;animation-timing-function: linear; animation-direction:alternate;}
#dgl2_grContext{display: none;z-index: 1000;position: absolute;overflow: hidden;white-space: nowrap;padding: 5px;background-color: #afcaa9;border-radius: 5px;border: 2px solid green;}
#dgl2_grContext select{background: none; border: none;width:100%;margin:5px 0;}
#dgl2_grContext select option{background-color: #ddffd8;}
#dgl2_grContext select option:nth-child(even) {background-color: #6fd061;}
#dgl2_grContext select option::selection {color: red;background: yellow;}
#dgl2_grContext button {cursor:pointer; width: 100%;background-color: #408706;color: white;border: 1px outset black;border-radius: 5px;}
#dgl2_grContext button:hover { background-color: #608706;}
#dgl2_CollTab li[active='0'] button.dgl2_visible ellipse[role='iris'] { fill: lightgray;stroke:lightgray}
#dgl2_CollTab li[active='0'] button.dgl2_visible ellipse { fill: lightgray;}
#dgl2_CollTab li button{display: flex; height: 100%;align-items: center;}
#dgl2_CollTab li.dgl2_drgover{border-top: 2px solid blue;}
#dgl2_alertBox {color: #2d3a2d; z-index:7777;box-shadow: 1px 1px 2px black;position: fixed;top: 50%;left: 50%;background-color: #afcaa9;border-radius: 5px;border: 2px solid #285c00;transform: translate(-50%, -50%);}
#dgl2_alertBox .dgl2_alertTitle{cursor:move;background-color:#5d982d;color:white;font-weight: bold;}
#dgl2_alertBox div.dgl2_alertButtons div{padding: 5px;display: inline-block;border-radius: 5px;border: 1px solid;cursor: pointer;margin:5px;}
#dgl2_alertBox .dgl2_alertOKBut{background-color: #d0e8cb;}
#dgl2_alertBox .dgl2_alertCancelBut{background-color: #e8e3cb;}
#dgl2_alertBox>div{padding:5px;overflow: scroll;  max-height: 80vh;  max-width: 80vw;}
#dgl2_alertBox div.dgl2_alertButtons{display: flex;flex-direction: row-reverse;}
#dgl2_promptVal{display: block;margin: 5px;border-radius: 5px;width: 90%;}
button.dgl2_groupButton[activity="inactive"]{background-color:#666;}
.dgl2_colContains{color:red;}
.dgl2_ColSelected{color:darkgreen}
.dgl2_colGrCnt{font-size: xx-small;vertical-align: super;background: #dfd;border-radius: 5px;padding: 1px 1px 1px 2px;margin-left: 5px;border: 1px solid green;}
.dgl2_sortSubFolder{position:absolute;top:10px;right:10px;width:20px;height:20px;line-height:20px;border:1px solid black;background-color:green;border-radius:5px;cursor:pointer;text-align:center;display:none;user-select:none}
`);
        $("head").append(style);
    }

    //function from https://www.w3schools.com/howto/howto_js_draggable.asp
    //makes elements draggable
    function dragElement(elmnt) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        if (elmnt.querySelector(".dgl2_alertTitle")) {
            // if present, the header is where you move the DIV from:
            elmnt.querySelector(".dgl2_alertTitle").onmousedown = dragMouseDown;
        }
        if (elmnt.querySelector(".dgl2_titlebar")) {
            // if present, the header is where you move the DIV from:
            elmnt.querySelector(".dgl2_titlebar").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.tagName == "INPUT") return;

            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    //filling GUI DOM
    function insertFilteredGroups(id) {
        curFilterID = id;
        curFilterMode = "collection";
        if (id == 0) targetName = ""
        else targetName = collections[id].name;
        filterDisplay(undefined, false);
    }

    function insertMacroGroups(id) {
        curFilterID = id;
        curFilterMode = "macro";
        filterDisplay(undefined, false);
    }

    function insertMacros() {
        const coltab = $("#dgl2_CollTab");
        let colList = coltab.find("ul");
        colList.empty();
        let el, descr;
        for (let col of macros) {
            descr = "";
            for (let gr of col.data) {
                descr += groupNameById(gr.groupID) + "/" + gr.folderName + "\n";
            }
            el = "<li colid=" + col.id + " title='" + escapeHtml(descr) + "' id='dgl2item-" + col.id + "'><span class='handle'></span><span>" + col.name + "</span>" + getEditButTemplate();
            el += getRecButTemplate() + getSubButTemplate() + getDelButTemplate();
            el += "</li>";
            colList.append(el);
        }
        if (macroOrder.length > 0) {
            $.each(macroOrder, function (i, position) {
                let $target = colList.find('#' + position);
                $target.appendTo(colList); // or prependTo for reverse
            });
        }
        makesortable();
    }

    function sanitizeCollections(){
        collections.forEach(c=>{
            c.groups=c.groups.filter(cgrId=>cgrId!=null && allGroups.some(agr=> agr.userId==cgrId));
        });
    }

    function insertCollections() {
        const coltab = $("#dgl2_CollTab");
        let colList = coltab.find("ul");
        colList.empty();
        let el;
        for (let col of collections) {
            el = `<li colid=${col.id} active='${col.showing}' id='dgl2item-${col.id}'><span class='handle'></span>
		<div>${col.name}<span class='dgl2_colGrCnt'>${col.groups.length>0?col.groups.length:allGroups.length}</span></div>
		${getEditButTemplate()}`;
            if (col.id > 0) el += getVisibleButTemplate() + getAddButTemplate() + getSubButTemplate() + getDelButTemplate();
            el += "</li>";
            colList.append(el);
        }
        if (collectionOrder.length > 0) {
            $.each(collectionOrder, function (i, position) {
                let $target = colList.find('#' + position);
                $target.appendTo(colList); // or prependTo for reverse
            });
        }
        makesortable();
    }

    function makesortable() {
        let lists = document.querySelectorAll("ul.sortableList li");

        for (let i = 0; i < lists.length; ++i) {
            lists[i].draggable = "true";
            addDragHandler(lists[i]);
        }
    }

    //drag handler for drag-sortable lists
    function addDragHandler(entry) {
        entry.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', this.id);
            e.dataTransfer.effectAllowed = 'move';
        }, false);
        entry.addEventListener('dragover', function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            this.classList.add('dgl2_drgover');
            e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
            return false;
        }, false);
        entry.addEventListener('dragleave', function (e) {
            this.classList.remove('dgl2_drgover');
        }, false);
        entry.addEventListener('drop', function (e) {
            var dropHTML = e.dataTransfer.getData('text/plain');
            this.parentNode.insertBefore(document.querySelector("#" + dropHTML), this);
            this.classList.remove('dgl2_drgover');

            if (colListMode == 0) {
                collectionOrder = [...this.parentNode.querySelectorAll("[draggable]")].map(el => el.id);
                GM.setValue("collectionOrder", JSON.stringify(collectionOrder));
            } else if (colListMode == 1) {
                macroOrder = [...this.parentNode.querySelectorAll("[draggable]")].map(el => el.id);
                GM.setValue("macroOrder", JSON.stringify(macroOrder));
            }
            return false;
        }, false);
        entry.addEventListener('dragend', function (e) {
            this.classList.remove('dgl2_drgover');
        }, false);
    }

    function insertSearchBar() {
        let bar = $(getSearchBarTemplate());
        let refrBut = $(getRefreshButTemplate());

        $("div.dgl2_titlebar").append(refrBut).append(bar).append(
            $("<div class='dgl2_closeDiag'>X</div>").click(function () {
                $("div.dgl2_groupdialog").hide();
            })
        );

        bar.keyup(function () {
            filterDisplay(true, false); //search evaluated in function, preserve filter
        });

        refrBut.click(Ev_getGroupClick);

        $("span.dgl2_titleText").click(function () {
            if (colListMode == 0) {
                filterDisplay(false,!showingFolders); //when showing a groups folder, return to last collection first, otherwise list of all groups

                colMode=0;
                macroMode=0;
                $("div.dgl2_groupWrapper").removeClass("dgl2_addGroup").removeClass("dgl2_remGroup");

                if(curFilterID==0 && colMode==0){
                    targetName = "";
                }
                displayModeText();

                let lastgrBut = $("button[groupid=" + lastGroupClickID + "]");
                if (lastgrBut.length > 0) {
                    document.querySelector(".dgl2_groupCol").scrollTop = scrollPosBefore;
                    lastgrBut.addClass("shadow-pulse");
                }
            } else {
                if(showingFolders){
                    filterDisplay(false);
                    displayModeText();

                    document.querySelector(".dgl2_groupCol").scrollTop = scrollPosBefore;
                    let lastgrBut = $("button[groupid=" + lastGroupClickID + "]")
                    //lastgrBut[0].scrollIntoView();
                    lastgrBut.addClass("shadow-pulse");
                }else{
                    macroMode = 0;//abort macro mode add/remove
                    filterDisplay(false);
                    displayModeText();
                    $("div.dgl2_groupWrapper").removeClass("dgl2_addGroup").removeClass("dgl2_remGroup");
                    $("button.dgl2_inCollection").removeClass("dgl2_inCollection");
                }
            }
        });
    }

    function insertSubFolders(newSubFolders=null) { //fill view with subfolders //subfolders not stored, request when needed
        navigating=true;
        let buts = $("button.dgl2_groupButton"); //button wrapper
        if(newSubFolders!=null)subfolderCache=newSubFolders;
        let comps=[(a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
                   (a,b)=>b.name.toLowerCase().localeCompare(a.name.toLowerCase()),
                   (a,b)=>a.position>b.position];
        document.querySelector(".dgl2_sortSubFolder").style.display="block";

        subfolderCache.forEach((el,ind)=>{el.position=ind;});
        const subfolders = subfolderCache //sorting sub-folders
        .filter(el => el.parentId == null) //grouping by lack of parent
        .sort(comps[subFolderOrder])//(a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) //sort folders by name
        .reduce((acc, curr) => {
            const children = subfolderCache
            .filter(({ parentId }) => parentId === curr.folderId) //assigning subfolders to folders
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())); //sorting subfolders by name
            acc.push(curr, ...children);
            return acc;
        }, []);

        if (buts.length > 0) {
            let subf;
            let newBut;
            showingFolders=true;
            displayModeText();
            if ($("#dgl2_grContext").is(":visible")) {
                let cont = $("#dgl2_grContext select");
                cont.empty();
                for (subf of subfolders) {
                    if (subf.thumb == null) continue; //no thumb=db problem, so also no text entry
                    newBut = $(getSubFolderOptionTemplate(subf.name, subf.size, subf.owner.userId, subf.folderId, subf.type, subf.thumb));
                    cont.append(newBut);
                }
                if (subfolders.length == 0) {
                    $("#dgl2_grContext span.desc").html("This group does<br/>not allow submissions<br/>using the gallery<br/>system!");
                } else {
                    $("#dgl2_grContext span.desc").text("Submit to a Folder");
                }

            } else {
                let par = buts.first().parent();
                par.empty();
                for (subf of subfolders) {
                    newBut = $(getSubFolderTemplate(subf.name, subf.size, subf.owner.userId, subf.folderId, subf.type, subf.thumb, subf.parentId));
                    par.append(newBut);
                }
                if (subfolders.length == 0) {
                    par.append("This group does not allow submissions using the gallery system!");
                }
                par.not("[dgl2]").attr("dgl2", 1).click(Ev_groupClick);
            }
        }
        setTimeout(() => {
            navigating=false;
        }, 1000);
    }

    function displayModeText() {
        let titl = "Add to Group";
        let descr = "Add this deviation to one of your groups";
        if (targetName != "") {
            if (colListMode == 0) { //collection
                if (colMode == 0) { //show
                    if(showingFolders){
                        titl = "< Back";
                        descr = "Submitting to " + targetName;
                    }else{
                        titl = "< Main List";
                        descr = "Showing Collection " + targetName;
                    }
                } else if (colMode == 1) { //add
                    titl = "< Stop Adding";
                    descr = "Add groups to Collection " + targetName;
                } else if (colMode == 2) { //remove
                    titl = "< Stop Removing";
                    descr = "Remove groups from Collection " + targetName;
                }
            } else { //macros
                if (macroMode == 0) {
                } else if (macroMode == 1) {
                    if(showingFolders){
                        titl = "< Back to Overview ";
                    }else{
                        titl = "< Stop Recording ";
                    }
                    descr = "Macro " + targetName + " is recording.";
                } else if (macroMode == 3) { //remove
                    titl = "< Stop Removing";
                    descr = "Remove groups from " + targetName;
                }
            }
        }
        $("span.dgl2_titleText").text(titl);
        $("span.dgl2_descr").text(descr);
    }

    function filterDisplay(reset = true, clearFilterID = true, isScrolling=false) {
        let isCollection=("collection" == curFilterMode && curFilterID > 0) ;
        if (reset) {
            scrollEnd = false;
            if(isCollection)displayColGroups = [];
            else displayedGroups = [];
            if(isCollection)curColOffset = 0;
            else curOffset = 0;
        } else if (!reset&&isScrolling && scrollEnd) {
            return;
        }
        if (clearFilterID) {
            curFilterID = 0;
            curFilterMode = "";
            isCollection=false;
        }
        showingFolders=false;

        //prepare group-ID blacklist (not these)
        let hideGroupsInd = new Set();
        collections.forEach(col => {
            if (0 == col.showing) {
                col.groups.forEach(grID => hideGroupsInd.add(parseInt(grID)));
            }
        });

        //prepare group-ID filter (only these)
        let showGroupsInd = new Set();
        if ("collection" == curFilterMode && curFilterID > 0) { //first is "all"
            collections[curFilterID].groups.forEach(el => showGroupsInd.add(parseInt(el)));
        } else if ("macro" == curFilterMode) {
            macros[curFilterID].data.forEach(el => showGroupsInd.add(parseInt(el.groupID)));
        }

        const search = document.getElementById("dgl2_searchbar").value.toLowerCase();
        const sWords = search.split(" ");

        //fill display object
        let i;
        let cnt = 0;
        let start
        if(!isCollection)start=curOffset;
        else start=curColOffset;
        for (i = start; i < allGroups.length && cnt < 100; ++i) {
            const gr = allGroups[i];
            if (hideGroupsInd.has(gr.userId)) continue; //hidden by user per collection
            if (search != "" && !sWords.every(term => gr.username.toLowerCase().includes(term))) continue; //search text, hide if not every word found in name
            if (showGroupsInd.size > 0 && !showGroupsInd.has(gr.userId)) continue; //not in filtered output
            if (isCollection) displayColGroups.push(gr);
            else displayedGroups.push(gr);
            ++cnt;
        }

        if (i == allGroups.length) {
            scrollEnd = true;
        }
        if(!isCollection)curOffset = i;
        else curColOffset=i;

        if (isCollection) displayGroups(displayColGroups);
        else displayGroups(displayedGroups);
    }

    function displayGroups(displayGr) { //fill view with groups //groups are stored
        // displayModeText(); //adapt gui text

        document.querySelector(".dgl2_sortSubFolder").style.display="";
        //insert displayGroups object into DOM
        let tmpCont = document.createDocumentFragment();
        displayGr.forEach(gr => {
            const el = document.createElement("div");
            el.innerHTML = getGroupTemplate(gr.username, gr.usericon, gr.userId, gr.latestDate);
            if(listedGroups.has(gr.userId))el.firstElementChild.classList.add("dgl2_inGroup");
            tmpCont.append(el.firstElementChild);
        });

        const cont = $("div.dgl2_groupWrapper");
        cont.empty();
        cont.append(tmpCont);

        [...document.querySelectorAll(`.dgl2_colContains`)].forEach(el => el.classList.remove("dgl2_colContains"));
        [...document.querySelectorAll("#dgl2_CollTab .dgl2_ColSelected")].forEach(el => el.classList.remove("dgl2_ColSelected"));
        document.querySelector("#dgl2_CollTab [colid='" + collections[curFilterID].id + "']")?.classList.add("dgl2_ColSelected");

        if(colListMode==1 && macroModeTarget!=-1){
            for (let el of macros[macroModeTarget].data) {
                $("button.dgl2_groupButton[groupID=" + el.groupID + "]").addClass("dgl2_inCollection");
            }
        }else if(colListMode==0 && colModeTarget>0){
            for (let el of collections[colModeTarget].groups) {
                $("button.dgl2_groupButton[groupID=" + el + "]").addClass("dgl2_inCollection");
            }
        }
    }

    function uniqBy(a, key) {
        let seen = new Set();
        return a.filter(item => {
            let k = key(item);
            return seen.has(k) ? false : seen.add(k);
        });
    }

    function insertColTab() {
        const grDiag = $("div.dgl2_groupdialog").not("[dgl2]").attr("dgl2", 1);
        if (grDiag.length == 0) return;
        const coltab = $(getCollectionColTemplate());
        grDiag.append(coltab);
        coltab.find("div[role='buttons']")
            .append(getNewColTemplate())
            .append(getExportButTemplate())
            .append(getImportButTemplate());
        coltab.click(Ev_colListClick);

        colListMode = 0;
        $("div.dgl2_CollTitle[role='collections']").addClass("active");
    }

    function insertHTML() {
        if ($("div.dgl2_groupdialog").length > 0) return;

        //HTML stuff
        addCss();
        $("<div class='dgl2_groupdialog'><div class='dgl2_titlebar'></div><div class='dgl2_groupCol'><div class='dgl2_groupWrapper'></div></div></div>").appendTo($("body"));
        $("div.dgl2_titlebar").html(getTitleBarTemplate());
        insertSearchBar();
        insertColTab();
        $("div.dgl2_groupWrapper").not("[dgl2]").attr("dgl2", 1).click(Ev_groupClick).contextmenu(Ev_groupContext);;

        //user credits
        userName = $("a.user-link").attr("data-username"); //"d-iawahl"; "retr00lka"; dediggefedde
        userId = $("a.user-link").attr("data-userid"); //"83358270"; "106669542"; 3396247

        let devInd = location.href.indexOf("?");
        if (devInd == -1) {
            devID = location.href.match(/(\d+)\D*$/)[1];
        } else {
            devID = location.href.substring(0, devInd).match(/(\d+)\D*$/)[1];
        }

        //loading settings & fetching stuff
        let proms = [
            GM.getValue("collections", ""),
            GM.getValue("collectionOrder", ""),
            GM.getValue("macros", ""),
            GM.getValue("macroOrder", ""),
            GM.getValue("groups", ""),
            GM.getValue("subFolderOrder",0)
        ];

        Promise.all(proms).then(([cols, colOrder, macs, macOrder, grps,subOrd]) => {
            if (cols != "") collections = JSON.parse(cols);
            collections.forEach(el => { if (!el.hasOwnProperty("showing")) { el.showing = 1; }; }); //backward-compatibility for collection-showing attribute before v3.0
            if (colOrder != "") collectionOrder = JSON.parse(colOrder);
            if (macs != "") {
                macros = JSON.parse(macs);
                macros.forEach(function (el) { el.data = uniqBy(el.data, JSON.stringify); }); //unique macros
            }
            if (macOrder != "") macroOrder = JSON.parse(macOrder);

            if (grps == "") {
                insertCollections();
                Ev_getGroupClick();
            } else {
                allGroups = JSON.parse(grps);
                sanitizeCollections();
                insertCollections();
                document.querySelector("#dgl2_CollTab [colid='0'] .dgl2_colGrCnt").innerHTML=allGroups.length;
                allGroups.sort((a, b) => a.username.localeCompare(b.username));
                filterDisplay();
            }

            subFolderOrder=(subOrd>=0&&subOrd<3)?subOrd:0;
            displaySortState();

            return fillListedGroups(devID, "");
        }).then(()=>{
            for(let l of listedGroups){
                document.querySelector(".dgl2_groupButton[groupid='"+l+"']")?.classList.add("dgl2_inGroup");
            }
        }).catch(function (e) {
            errorHndl(err(errtyps.Unknown_Error, "Error Loading Database", e));
            return insertCollections();
        });

        //scroll event handler
        let isScrolling = false;
        $(".dgl2_groupCol").on("scroll", function (ev) { //endless scrolling feature
            if (isScrolling) return; //throttle
            if(navigating)return; //
            isScrolling = true;
            setTimeout(function () {
                const scrollHeight = ev.target.scrollHeight;
                const scrollPosition = ev.target.scrollTop + ev.target.clientHeight;
                if (scrollHeight - scrollPosition < 200) { //200px until end  && targetName == ""
                    filterDisplay(false,false,true);// Call to insert new groups
                }
                isScrolling = false;
            }, 50); //only once every 50ms.
        });

        let cont=document.querySelector(".dgl2_groupCol");
        sortBut=document.createElement("div");
        sortBut.className="dgl2_sortSubFolder";
        sortBut.addEventListener("click",()=>{
            subFolderOrder+=1;
            if(subFolderOrder>2)subFolderOrder=0;
            GM.setValue("subFolderOrder",subFolderOrder);
            insertSubFolders();
            displaySortState();
        });
        cont.appendChild(sortBut);
    }
    function displaySortState(){
        sortBut.innerHTML=["Δ","∇","O"][subFolderOrder];
        sortBut.title=["alphabetical","reverse alphabetical","original"][subFolderOrder]+" order";
    }


    function getLowestFree(collection) {
        collection.sort(function (a, b) {
            return a.id - b.id;
        }); //changing order does not matter thanks to index/order array
        let lowest = -1;
        let i;
        for (i = 0; i < collection.length; ++i) {
            if (collection[i].id != i) {
                lowest = i;
                break;
            }
        }
        if (lowest == -1 && collection.length > 0) {
            lowest = collection[collection.length - 1].id + 1;
        } else if (collection.length == 0) lowest = 0;
        return lowest;

    }

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    }

    function download(data, filename) {
        let file = new Blob([data], {
            type: "application/json"
        });
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    function upload() {
        return new Promise(function (resolve, reject) {
            let inp = $('<input type="file" id="input">').appendTo("body").click()
            inp.change(function () {
                let reader = new FileReader();
                reader.onload = function (evt) {
                    resolve(evt.target.result);
                };
                reader.readAsBinaryString($(this).prop("files")[0]);
            });
            return "";
        });
    }

    function colIndexById(id) {
        for (let i = 0; i < collections.length; ++i) {
            if (collections[i].id == id) return i;
        }
        return -1;
    }

    function makIndexById(id) {
        for (let i = 0; i < macros.length; ++i) {
            if (macros[i].id == id) return i;
        }
        return -1;
    }

    //shows an alert box with text
    //mode 0:alert, 1:confirm, 2 prompt
    function myMsgBox(tex, titl = "Notification", mode = 0, defText = "") {
        let dfd = new $.Deferred();

        let box = $("#dgl2_alertBox");
        if (box.length == 0) {
            box = $("<div id='dgl2_alertBox'></div>").appendTo("body");
        }

        box.html("<div class='dgl2_alertTitle'></div><div class='dgl2_alertText'></div><div class='dgl2_alertButtons'></div>");
        box.find("div.dgl2_alertText").html(tex);
        box.find("div.dgl2_alertTitle").html(titl);

        if (mode == 0) {
            $("<div class='dgl2_alertOKBut'>OK</div>").click(function () {
                dfd.resolve(true);
                $("#dgl2_alertBox").hide();
            }).appendTo(box.find("div.dgl2_alertButtons"));
        } else if (mode == 1) {
            $("<div class='dgl2_alertOKBut'>OK</div>").click(function () {
                dfd.resolve(true);
                $("#dgl2_alertBox").hide();
            }).appendTo(box.find("div.dgl2_alertButtons"));
            $("<div class='dgl2_alertCancelBut'>Cancel</div>").click(function () {
                dfd.resolve(false);
                $("#dgl2_alertBox").hide();
            }).appendTo(box.find("div.dgl2_alertButtons"));
        } else if (mode == 2) {
            $("<input type='text' id='dgl2_promptVal' value='" + defText + "' class='text ui-widget-content ui-corner-all'>").appendTo(box.find("div.dgl2_alertText"));
            $("<div class='dgl2_alertOKBut'>OK</div>").click(function () {
                dfd.resolve($("#dgl2_promptVal").val());
                $("#dgl2_alertBox").hide();
            }).appendTo(box.find("div.dgl2_alertButtons"));
            $("<div class='dgl2_alertCancelBut'>Cancel</div>").click(function () {
                dfd.resolve(false);
                $("#dgl2_alertBox").hide();
            }).appendTo(box.find("div.dgl2_alertButtons"));
        }
        box.show();

        dragElement(box[0]);

        return dfd.promise();
    }

    function showPopup(event) {
        event.preventDefault();
        event.stopPropagation();
        insertHTML(); //does nothing if already inserted

        let el = $("div.dgl2_groupdialog");

        el.show();
        dragElement(el[0]);
        el.attr("tabindex", "0");
        el.keydown(function (event) {
            if (event.target.tagName != "INPUT") {
                highlightLetter(String.fromCharCode(event.which));
            }
        });
        $("div.dgl2_groupdialog, div.dgl2_groupdialog>div").click(function (event) {
            event.stopPropagation();
            if (event.target.tagName != "INPUT") {
                $("div.dgl2_groupdialog").focus();
            }
        });
    }

    function groupNameById(id) {
        for (let g of allGroups) {
            if (g.userId == id) return g.username;
        }
        return "";
    }

    function init() {
        if (location.href.indexOf("/art/") === -1 && location.href.indexOf("/journal/") === -1) return;

        let buttonLine = document.querySelector("path[d='M18.63 17l1.89 5h2l-2.53-7h-6.67l.64 2zM4.04 15l-2.52 7h2l1.88-5h4.23l1.89 5h2l-2.53-7zM7.52 4.33c1.9304.011 3.4873 1.5829 3.48 3.5133-.0074 1.9303-1.5762 3.4903-3.5066 3.4866C5.563 11.3263 4 9.7604 4 7.83c0-1.933 1.567-3.5 3.5-3.5h.02zm-.02-2C4.4624 2.33 2 4.7924 2 7.83s2.4624 5.5 5.5 5.5 5.5-2.4624 5.5-5.5-2.4624-5.5-5.5-5.5zM13 3.37a5.59 5.59 0 0 1 1.5 1.45 3.41 3.41 0 0 1 1.5-.35c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5a3.41 3.41 0 0 1-1.5-.35 5.63 5.63 0 0 1-1.5 1.46c1.968 1.2806 4.532 1.1706 6.3831-.2738 1.8511-1.4445 2.5812-3.9047 1.8175-6.125C20.437 3.9608 18.348 2.4702 16 2.47a5.4102 5.4102 0 0 0-3 .9z']");
        if (buttonLine === null) { return; }

        let buttonSVG = buttonLine.closest("svg");
        if (buttonSVG.getAttribute("dgl2") === "1") { return; }

        buttonSVG.setAttribute("dgl2", "1");
        buttonSVG.insertAdjacentHTML('beforeend', '<path stroke="#0A0" stroke-width="4" stroke-opacity="0.8" d="M12 18H24M18 12V24"/>');
        buttonSVG.addEventListener("click", showPopup);

        document.addEventListener("mousedown", (event) => {
            if (event.target.closest("#dgl2_grContext") === null) {
                $("#dgl2_grContext").hide().find("select").empty();
            }
        });
     }

    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
    init();

})();