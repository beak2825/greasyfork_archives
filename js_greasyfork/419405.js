// ==UserScript==
// @name         dA_DragnFav
// @namespace    phi.pf-control.de/userscripts/dA_DragnFav/dA_DragnFav.user.js
// @version      3.5
// @description  drag thumbs and deviations to yur favourites/collections
// @author       Dediggefedde
// @match        https://www.deviantart.com/*
// @require    	 http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT; http://opensource.org/licenses/MIT
// @noframes
// @sandbox      DOM
// @downloadURL https://update.greasyfork.org/scripts/419405/dA_DragnFav.user.js
// @updateURL https://update.greasyfork.org/scripts/419405/dA_DragnFav.meta.js
// ==/UserScript==
//
//
/* globals $*/
/* jshint esnext:true */
/* eslint curly: 0 */

(function () {
    'use strict';
    //# temporary variables
    let grIDs = [];
    let pGrIDs = [];
    let settingmode = false;
    let groupOrder = [];
    let hiddengroups = [];
    let headerfilled = false;
    //# resources
    //hook copied from deviantart svg
    let imgHook = '<svg width="50" height="50" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="M1.237 6.187L0 4.95l1.237-1.238L2.475 4.95l3.712-3.713 1.238 1.238-4.95 4.95-1.238-1.238z" fill-rule="evenodd"></path></svg>';
    //imgGear copied from inkscape "render gear", slightly adjusted
    let imgGear = '<svg  xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20.444057 20.232336" > <g transform="translate(-15.480352,-5.6695418)">  <g transform="matrix(0.26458333,0,0,0.26458333,25.702381,15.78571)"  style="fill:#000000">  <path  style="fill:#000000;stroke:#000000;stroke-width:1"  d="m 28.46196,-3.25861 4.23919,-0.48535 0.51123,0.00182 4.92206,1.5536 v 4.37708 l -4.92206,1.5536 -0.51123,0.00182 -4.23919,-0.48535 -1.40476,6.15466 4.02996,1.40204 0.45982,0.22345 3.76053,3.53535 -1.89914,3.94361 -5.1087,-0.73586 -0.4614,-0.22017 -3.60879,-2.2766 -3.93605,4.93565 3.02255,3.01173 0.31732,0.40083 1.8542,4.81687 -3.42214,2.72907 -4.2835,-2.87957 -0.32017,-0.39856 -2.26364,-3.61694 -5.68776,2.73908 1.41649,4.0249 0.11198,0.49883 -0.41938,5.14435 -4.26734,0.97399 -2.6099,-4.45294 -0.11554,-0.49801 -0.47013,-4.2409 h -6.31294 l -0.47013,4.2409 -0.11554,0.49801 -2.6099,4.45294 -4.26734,-0.97399 -0.41938,-5.14435 0.11198,-0.49883 1.41649,-4.0249 -5.68776,-2.73908 -2.26364,3.61694 -0.32017,0.39856 -4.2835,2.87957 -3.42214,-2.72907 1.8542,-4.81687 0.31732,-0.40083 3.02255,-3.01173 -3.93605,-4.93565 -3.60879,2.2766 -0.4614,0.22017 -5.1087,0.73586 -1.89914,-3.94361 3.76053,-3.53535 0.45982,-0.22345 4.02996,-1.40204 -1.40476,-6.15466 -4.23919,0.48535 -0.51123,-0.00182 -4.92206,-1.5536 v -4.37708 l 4.92206,-1.5536 0.51123,-0.00182 4.23919,0.48535 1.40476,-6.15466 -4.02996,-1.40204 -0.45982,-0.22345 -3.76053,-3.53535 1.89914,-3.94361 5.1087,0.73586 0.4614,0.22017 3.60879,2.2766 3.93605,-4.93565 -3.02255,-3.01173 -0.31732,-0.40083 -1.8542,-4.81687 3.42214,-2.72907 4.2835,2.87957 0.32017,0.39856 2.26364,3.61694 5.68776,-2.73908 -1.41649,-4.0249 -0.11198,-0.49883 0.41938,-5.14435 4.26734,-0.97399 2.6099,4.45294 0.11554,0.49801 0.47013,4.2409 h 6.31294 l 0.47013,-4.2409 0.11554,-0.49801 2.6099,-4.45294 4.26734,0.97399 0.41938,5.14435 -0.11198,0.49883 -1.41649,4.0249 5.68776,2.73908 2.26364,-3.61694 0.32017,-0.39856 4.2835,-2.87957 3.42214,2.72907 -1.8542,4.81687 -0.31732,0.40083 -3.02255,3.01173 3.93605,4.93565 3.60879,-2.2766 0.4614,-0.22017 5.1087,-0.73586 1.89914,3.94361 -3.76053,3.53535 -0.45982,0.22345 -4.02996,1.40204 z"  />  <circle  style="fill:#ffffff;stroke:#000000;stroke-width:1"  cx="0"  cy="0"  r="15" />  </g>  </g> </svg>';
    //CSS styling
    //"#dA_DragnFav_header div[folderId] * {pointer-events: none;}
    GM_addStyle(`
#dA_DragnFav_header {color:#122;background-color: #8fac85cc;z-index: 77;position: fixed;width: 100%;border: 2px ridge white;
display: none;padding: 20px;justify-content: center;align-items: center;flex-wrap: wrap;box-sizing: border-box;}
#dA_DragnFav_header div[folderId] {padding: 15px;border-radius: 5px;background-color: #ffffdd;border: 1px solid black;margin: 10px;
display:flex;align-items: center;flex-direction: column;position: relative;overflow:clip;}
#dA_DragnFav_header div[folderId] img {height:50px;max-width: 100px; overflow: hidden;text-overflow: ellipsis;font-size: smaller;}
#dA_DragnFav_header div.dA_DragnFav_sets{position:absolute;top:10px;right:10px;cursor:pointer;}
#dA_DragnFav_header div.dA_DragnFav_markhide{background-color:#a22;}
div.dA_DragnFav_right{right:0}
div.dA_DragnFav_groupTitle{display:inline-block;}
div.dA_DragnFav_left{left:0}
div.dA_DragnFav_over{z-index:3;position: absolute;top: 0;width: 50%;height: 100%;
background-color: #b9d9b1;display: flex;align-items: center;justify-content: center;opacity:0;text-shadow: 3px 3px 3px #0006;font-weight:bold;color: #300;}
div.dA_DragnFav_over p{pointer-events: none;}
div.dA_DragnFav_inside {position:absolute;z-index:2;left:0;width:100%;top:0;height:100%;display:flex;align-items: center;justify-content: center;visibility:hidden}
div.dA_DragnFav_inside svg {fill:green;}
#dA_DragnFav_drowDown{color:var(--g-typography-primary);position:absolute;z-index:99;top:0;left:0;border:1px solid green;
border-radius:5px;background: linear-gradient(90deg,var(--g-bg-primary),var(--g-bg-secondary),var(--g-bg-primary));}
#dA_DragnFav_drowDown ul{max-height:350px;overflow-y:scroll;border-radius:5px;}
#dA_DragnFav_drowDown li{height:50px;background-color:var(--g-bg-primary);position: relative;overflow:hidden;margin:2px 0;}
#dA_DragnFav_drowDown li:hover{background-color:var(--g-bg-secondary)}
#dA_DragnFav_drowDown img{overflow: hidden;text-overflow: ellipsis;font-size: smaller;max-width: 100px;height: 100%;}
#dA_DragnFav_drowDown div.dA_DragnFav_wrapImg{width: 100px; overflow: hidden;text-overflow: ellipsis;font-size: smaller;
display:inline-block;vertical-align:middle;position: relative;height: 100%;text-align: center;}
#dA_DragnFav_drowDown div.dA_DragnFav_groupTitle{margin:0 15px}
#dA_DragnFav_header div[folderId][type="private_collection"] { border: 1px dashed black;}
#dA_DragnFav_drowDown>span {position:absolute;top:5px;right:20px;z-index:99;cursor:pointer;}
#dA_DragnFav_drowDown>span:hover {color:#777;}

`.replace(/\s\s+/g, ''));
    //# https requests
    //gets your currently available collections. returns promise with json response on success. response or parse error on error
    //assumes <21 collections
    function getCollections(type = "collection", offset = 0) {
        const token = $("input[name=validate_token]").val();
        if (token === undefined) {
            return Promise.reject("Invalid Token Element");
        }

        const url=  `https://www.deviantart.com/_puppy/dashared/gallection/folders?type=${type}&offset=${offset}&limit=20&csrf_token=${token}`

        return fetch(url, {
            method: "GET",
            headers: {
                "accept": 'application/json, text/plain, */*',
                "content-type": 'application/json;charset=UTF-8'
            }
        })
            .then(response => response.json())
            .then(dat => {
            if (dat.hasMore) {
                return getCollections(type, dat.nextOffset).then(nret => {
                    dat.results = dat.results.concat(nret.results);
                    return dat;
                });
            } else if (type === "collection") {
                return getCollections("private_collection", 0).then(nret => {
                    dat.results = dat.results.concat(nret.results);
                    return dat;
                });
            } else {
                return dat;
            }
        })
            .catch(error => {
            console.log("dA_DragnFav error:", error,url);
            alert(`dA_DragnFav Error reaching webserver at ${url}!\nSee the log (F12) for more details!`);
            throw error;
        });
    }
    //get list of collection ids, this deviation id is inside already
    //returns promise with json response on success. response or parse error on error
    function inCollections(id, type = "collections") {
        const token = $("input[name=validate_token]").val();
        if (token === undefined) {
            return Promise.reject("Invalid Token Element");
        }

        const url = `https://www.deviantart.com/_puppy/dashared/${type}/collections_for_deviation?deviationid=${id}&csrf_token=${token}`;

        return fetch(url, {
            method: "GET",
            headers: {
                "accept": 'application/json, text/plain, */*',
                "content-type": 'application/json;charset=UTF-8'
            }
        })
            .then(response => response.json())
            .then(dat => {
            if (!dat.collectionIds) {
                console.log("dA_DragnFav Error: wrong response for collectionIds", type, dat,url);
                alert("dA_DragnFav Error: wrong response for collectionIds!\nSee the log (F12) for more details!");
                throw new Error("Invalid response for collectionIds");
            }
            return dat;
        })
            .catch(error => {
            console.log("dA_DragnFav error:", error,url);
            alert(`dA_DragnFav Error reaching webserver at ${url}!\nSee the log (F12) for more details!`);
            throw error;
        });
    }
    //sets the collection of the deviation with this id to the array cols (folder ids).
    //searches for validate_token on current page
    function setCollection(id, cols, type = "collections") {
        const token = $("input[name=validate_token]").val();
        if (token === undefined) {
            return Promise.reject("Invalid Token Element");
        }

        const url = `https://www.deviantart.com/_puppy/dashared/${type}/collect`;
        const dats = {
            "itemid": id,
            "folderids": cols,
            "csrf_token": token
        };

        return fetch(url, {
            method: "POST",
            headers: {
                "accept": 'application/json, text/plain, */*',
                "content-type": 'application/json'
            },
            body: JSON.stringify(dats)
        })
            .then(response => response.json())
            .then(dat => {
            return dat; // Expected success: { success: true }
        })
            .catch(error => {
            console.log("dA_DragnFav error:", error,url);
            alert(`Error reaching webserver at ${url}!\nSee the log (F12) for more details!`);
            throw error;
        });
    }
    //# event listener
    //when items are dragged onto the bar
    function itemDroppedOnCol(event, add = true, mid = 0) {
        let id = mid;
        if (mid == 0 && "dataTransfer" in event.originalEvent)
            id = parseInt(event.originalEvent?.dataTransfer?.getData('id') ?? "0"); //changed
        let fEl = $(event.target).closest("[folderId]");
        let fId = parseInt((fEl.attr("folderId")) ?? "0"); //changed
        let ftyp = fEl.attr("type") ?? "collection"; //changed
        if (ftyp == "collection") {
            if (!add)
                grIDs = [];
            if (!grIDs.includes(fId)) {
                grIDs.push(fId);
                setCollection(id, grIDs, "collections").then(ret => {
                    fEl.find(".dA_DragnFav_inside").css("visibility", "visible");
                }).then(() => {
                    markCollections(id);
                }).catch(ex => {
                    console.log("dA_DragnFav Error calling setCollection1", ex,id);
                    alert("dA_DragnFav Error calling setCollection1\nSee the log (F12) for more details!");
                });
            }
        }
        else if (ftyp == "private_collection") {
            if (!add)
                pGrIDs = [];
            if (!pGrIDs.includes(fId)) {
                pGrIDs.push(fId);
                setCollection(id, pGrIDs, "privatecollections").then(ret => {
                    fEl.find(".dA_DragnFav_inside").css("visibility", "visible");
                }).then(() => {
                    markCollections(id);
                }).catch(ex => {
                    console.log("dA_DragnFav Error calling setCollection2", ex,id)
                    alert("dA_DragnFav Error calling setCollection2\nSee the log (F12) for more details!");
                }
                        );
            }
        }
    }
    function leaveSettingMode() {
        settingmode = false;
        $("#dA_DragnFav_header div.dA_DragnFav_markhide").css("display", "none");
        $("#dA_DragnFav_header div.dA_DragnFav_setDescr").remove();
        $("#dA_DragnFav_header").fadeOut();
    }
    function enterSettingMode() {
        settingmode = true;
        //show hidden
        $("#dA_DragnFav_header div.dA_DragnFav_markhide").css("display", "block");
        //make sortable
        $("#dA_DragnFav_header").sortable({
            helper: 'clone',
            forceHelperSize: true,
            forcePlaceholderSize: true,
            placeholder: "ui-state-highlight",
            items: 'div.dA_DragnFav_group',
            cursor: 'move',
            update: function (event, ui) {
                let colOrder = $(this).sortable('toArray', { attribute: 'folderId' });
                GM.setValue("groupOrder", JSON.stringify(colOrder));
            }
        }).prepend("<div class='dA_DragnFav_setDescr' style='width:100%'>Drag items to rearange them. Click an item to hide/show it. Click the gear to leave the settings mode.</div>");
    }
    //# initialization, reruns periodically for dynamic site building
    //insert fav-header
    function fillHeader(id) {
        (new Promise(function (resolve, reject) {
            if (headerfilled) {
                resolve(id);
                return;
            }
            getCollections().then((ret) => {
                headerfilled = true;
                let tex = "";
                let contextTex = "<span onclick='this.parentElement.style.display=\"none\"'>X</span><ul>";
                ret.results.forEach((el) => {
                    let thumb = "";
                    try {
                        if (el.thumb && el.thumb.coverImage && el.thumb.coverImage.media && el.thumb.coverImage.media.types && el.thumb.coverImage.media.prettyName && el.thumb.coverImage.media.token && el.thumb.coverImage.media.types[0] && el.thumb.coverImage.media.types[0].c) { //optional chaining breaks tampermonkey syntax highlight...
                            thumb += `${el.thumb.coverImage.media.baseUri}${el.thumb.coverImage.media.types[0].c.replace("<prettyName>", el.thumb.coverImage.media.prettyName)}?token=${el.thumb.coverImage.media.token[0]}`;
                        }
                        else if (el.thumb && el.thumb.media && el.thumb.media.baseUri && el.thumb.media.types && el.thumb.media.prettyName && el.thumb.media.token && el.thumb.media.types[0] && el.thumb.media.types[0].c) {
                            thumb += `${el.thumb.media.baseUri}${el.thumb.media.types[0].c.replace("<prettyName>", el.thumb.media.prettyName)}?token=${el.thumb.media.token[0]}`;
                        }
                    }
                    catch (ex) {
                        console.log("dA_DragnFav error: thumbnail not parsed", ex);
                    }
                    let thTitl = "no thumb";
                    if (el.thumb) {
                        thTitl = el.thumb.title;
                    }
                    tex += `
		<div class='dA_DragnFav_group ${hiddengroups.includes(el.folderId) ? "dA_DragnFav_markhide" : ""}' type=${el.type} folderId='${el.folderId}' ${hiddengroups.includes(el.folderId) ? "style='display:none;'" : ""}>
			<img src='${thumb}' alt='${thTitl}' title='${thTitl}'/>
			<div class='dA_DragnFav_groupTitle'>${el.name}</div>
			<div class='dA_DragnFav_inside'>${imgHook}</div>
			<div class='dA_DragnFav_over dA_DragnFav_left'><p>Add</p></div>
			<div class='dA_DragnFav_over dA_DragnFav_right'><p>Move</p></div>
		</div>
		`.replace(/\s\s+/g, '');
                    contextTex += `<li class='dA_DragnFav_group ${hiddengroups.includes(el.folderId) ? "dA_DragnFav_markhide" : ""}' type=${el.type} folderId='${el.folderId}' ${hiddengroups.includes(el.folderId) ? "style='display:none;'" : ""}>
			<div class='dA_DragnFav_wrapImg'><img src='${thumb}' alt='${thTitl}' title='${thTitl}'/></div>
			<div class='dA_DragnFav_groupTitle'>${el.name}</div>
			<div class='dA_DragnFav_inside'>${imgHook}</div>
			<div class='dA_DragnFav_over dA_DragnFav_left'><p>Add</p></div>
			<div class='dA_DragnFav_over dA_DragnFav_right'><p>Move</p></div>
		</li>`.replace(/\s\s+/g, '');
                });
                contextTex+="</ul>";
                let header = $("#dA_DragnFav_header");
                header.html(tex).append(`<div class='dA_DragnFav_sets'>${imgGear}</div>`);
                $("#dA_DragnFav_drowDown").html(contextTex);
                $.each(groupOrder, function (i, folderid) {
                    let $target = header.find(`[folderid='${folderid}']`);
                    $target.appendTo(header); // or prependTo for reverse
                });
                $("#dA_DragnFav_header div.dA_DragnFav_group").on("click", function (ev) {
                    if (settingmode && !$(this).hasClass("noClick")) { //hide toggle click in setting-mode
                        let fid = parseInt($(this).attr("folderId") ?? "0");
                        let fhidInd = hiddengroups.indexOf(fid);
                        if (fhidInd > -1) {
                            hiddengroups.splice(fhidInd, 1);
                            $(this).removeClass("dA_DragnFav_markhide");
                        }
                        else {
                            hiddengroups.push(fid);
                            $(this).addClass("dA_DragnFav_markhide");
                        }
                        GM.setValue("hiddengroups", JSON.stringify(hiddengroups));
                    }
                });
                //fav-header drag receivable
                $("#dA_DragnFav_header div.dA_DragnFav_over").on('dragover', false).on("dragenter", function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    $(ev.target).css("opacity", "0.7");
                }).on("dragleave", function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    $(ev.target).css("opacity", "0");
                }).on("drop", function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    $(ev.target).css("opacity", "0");
                    itemDroppedOnCol(ev, $(ev.target).hasClass("dA_DragnFav_left"));
                });
                $("#dA_DragnFav_drowDown div.dA_DragnFav_over").on('mouseover', false).on("mouseenter", function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    $(ev.target).css("opacity", "0.7");
                }).on("mouseleave", function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    $(ev.target).css("opacity", "0");
                }).on("click", function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    $(ev.target).css("opacity", "0");
                    let id = parseInt(document.getElementById("dA_DragnFav_drowDown")?.getAttribute("ImgId") ?? "0");
                    itemDroppedOnCol(ev, $(ev.target).hasClass("dA_DragnFav_left"), id);
                });
                //settings open on drag, close on click
                $("#dA_DragnFav_header div.dA_DragnFav_sets").on('dragover', false).on("dragenter", function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                }).on("dragleave", function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                }).on("drop", function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    enterSettingMode();
                }).on("click", function (ev) {
                    leaveSettingMode();
                });
                resolve(id);
                return;
            }).catch(ex => {
                console.log("dA_DragnFav: Error in getCollections:", ex,id);
                alert("dA_DragnFav: in getCollections!\nSee the log (F12) for more details!");
                reject(ex);
            });
        })).then(markCollections).catch(ex => {
            console.log("dA_DragnFav: Error in fillHeader:", ex,id);
            alert("dA_DragnFav: in filling the header!\nSee the log (F12) for more details!");
        });
    }
    function markCollections(id) {
        if (id == null)
            return;
        $(".dA_DragnFav_inside").css("visibility", "");
        $(".dA_DragnFav_group").css("background-color", "");
        // grIDs = [];
        inCollections(id, "collections").then(ret => {
            if (!ret.collectionIds) {
                console.log("dA_DragnFav: Error checking collections:", ret, id);
                alert("dA_DragnFav: Error checking collections!\nSee the log (F12) for more details!");
                return null;
            }
            ret.collectionIds.forEach(el => {
                $("[folderId=" + el + "]").find(".dA_DragnFav_inside").css("visibility", "visible");
                $("[folderId=" + el + "]").closest(".dA_DragnFav_group").css("background-color", "rgb(180, 255, 200)");
            });
            grIDs = ret.collectionIds;
            return inCollections(id, "privatecollections");
        }).then(ret => {
            if (!ret?.collectionIds) {
                console.log("dA_DragnFav: Error checking private collections:", ret, id);
                alert("dA_DragnFav: Error checking private collections!\nSee the log (F12) for more details!");
                return;
            }
            ret.collectionIds.forEach(el => {
                $("[folderId=" + el + "]").find(".dA_DragnFav_inside").css("visibility", "visible");
                $("[folderId=" + el + "]").closest(".dA_DragnFav_group").css("background-color", "rgb(180, 255, 200)");
            });
            pGrIDs = ret.collectionIds;
        }).catch(ex => {
            console.log("dA_DragnFav: Error during checking collections", ex);
            alert("dA_DragnFav: Error while checking collections!\nSee the  the log (F12) for details.");
        });
    }
    function dragEnd() {
        if (!settingmode) {
            $("#dA_DragnFav_header").fadeOut();
        }
    }
    function dragStart(ev) {
        $("#dA_DragnFav_header").css("display", "flex");
        $("div.dA_DragnFav_over").css("opacity", "0");
        let drEl = ev.target.closest("[devId]");
        let id;
        id = drEl.getAttribute("devId");
        if (!id) {
            console.log("dA_DragnFav Error: ID can not be fetched", drEl, $(ev.target), $(ev.target).attr("href"), document.querySelector("meta[property='og:url']")?.getAttribute("content"));
            alert("dA_DragnFav Error: ID can not be fetched!\nSee the log (F12) for more details!");
        }
        if (ev.originalEvent?.dataTransfer?.setData('id', id)) {
            console.log("dA_DragnFav Error: ID can not be transfered", ev, id, drEl);
            alert("dA_DragnFav Error: ID can not be transfered!\nSee the log (F12) for more details!");
        }
        fillHeader(id);
    }
    //make deviations draggable, passing link with ID
    function makeDraggable() {
        //thumbs in links
        let els = $("a[href^='https://www.deviantart.com/'][href*='/art/'],a[href^='https://www.deviantart.com/'][href*='/journal/']").not("[dA_DragnFav]").attr("dA_DragnFav", 1).attr("draggable", "true");
        if (els.length > 0) {
            els.each((ind, el) => {
                el.setAttribute("devId", el.href.match(/(\d+)(#[^\/]*)?$/)?.[1] ?? "0");
            });
            els.on("dragstart", dragStart).on("dragend", dragEnd);
        }
        //fullview
        els = $("img[property='contentUrl'][fetchpriority='high']").not("[dA_DragnFav]").attr("dA_DragnFav", 2).attr("draggable", "true");
        if (els.length > 0) {
            els.each((ind, el) => {
                el.setAttribute("devId", location.href.match(/deviantart.com\/[^\/]*\/art\/[^\/]*?(\d+)$/)?.[1] ?? "0"
                                // document.querySelector("meta[property='og:url']").getAttribute("content").match(/\d+$/)[0]
                               );
            });
            els.on("dragstart", dragStart).on("dragend", dragEnd);
        }
        //fav button on fullview
        els = $(".AMkCNL.CzSwTY > button:nth-child(1)").not("[dA_DragnFav]").attr("dA_DragnFav", 1);
        if (els.length > 0) {
            els.each((ind, el) => {
                let itEl = el.parentNode?.querySelector("a[href^='https://www.deviantart.com/'][href*='/art/'],a[href^='https://www.deviantart.com/'][href*='/journal/']");
                let devId;
                if (itEl == null)
                    devId = location.href.match(/-(\d\d+)(?:(\D)*)?$/)?.[1] ?? "0";
                else
                    devId = itEl.href.match(/-(\d\d+)(?:(\D)*)?$/)?.[1] ?? "0";
                el.setAttribute("devId", devId);
            });
            els.on("contextmenu", function (e) {
                e.preventDefault();
                let el = e.target.closest("button");
                let devId = parseInt(el?.getAttribute("devId") ?? "0");
                fillHeader(devId);
                $('#dA_DragnFav_drowDown').attr("ImgId", devId).css({ 'top': e.pageY, 'left': e.pageX }).show();
            });
            let plusImg = document.createElementNS('http://www.w3.org/2000/svg', "path");
            plusImg.setAttribute("stroke", "#0f0");
            plusImg.setAttribute("stroke-width", "3");
            plusImg.setAttribute("stroke-opacity", "0.8");
            plusImg.setAttribute("d", "M16 20H24M20 16V24");
            els.find("svg").append(plusImg);
        }
        //overview fav button
        els = $("button").filter((i, el) => {
            return null != el.querySelector("svg path[d*='M8.562 1c.277 0 .536.144.7.384l.058.095 1.425 2.675 3.174.474c.29.043.539.241.668.524l.043.11.32.993c.104.326.042.686-.157.945l-.081.093-2.229 2.226.546']");
        }).not("[dA_DragnFav]").attr("dA_DragnFav", 1);
        if (els.length > 0) {
            els.each((ind, el) => {
                let itEl = el.parentNode?.parentNode?.querySelector("a[href^='https://www.deviantart.com/'][href*='/art/'],a[href^='https://www.deviantart.com/'][href*='/journal/']");
                let devId = "0";
                if (itEl == null)
                    devId = location.href.match(/-(\d\d+)((\D)*)?$/)?.[1] ?? "0";
                else
                    devId = itEl.href.match(/-(\d\d+)((\D)*)?$/)?.[1] ?? "0";
                el.setAttribute("devId", devId);
            });
            els.on("contextmenu", function (e) {
                e.preventDefault();
                let el = e.target.closest("button");
                let id = parseInt(el?.getAttribute("devId") ?? "0");
                fillHeader(id);
                $('#dA_DragnFav_drowDown').attr("ImgId", id).css({ 'top': e.pageY, 'left': e.pageX }).show();
            });
            let plusImg = document.createElementNS('http://www.w3.org/2000/svg', "path");
            plusImg.setAttribute("stroke", "green");
            plusImg.setAttribute("stroke-width", "3");
            plusImg.setAttribute("stroke-opacity", "0.8");
            plusImg.setAttribute("d", "M8 12H16M12 8V16");
            els.find("svg").append(plusImg);
        }
    }
    //runs every interval
    function init(mutationList, observer) {
        if (document.getElementById("dA_DragnFav_header") == null) {
            $("header[role='banner']").after("<div id='dA_DragnFav_header'>");
            headerfilled = false;
        }
        makeDraggable();
        if (document.getElementById("dA_DragnFav_styles") == null) {
            $("head").append('<link id="dA_DragnFav_styles"' +
                             'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/le-frog/jquery-ui.min.css" ' +
                             'rel="stylesheet" type="text/css">');
        }
        if (document.getElementById("dA_DragnFav_drowDown") == null) {
            $("body").append("<div id='dA_DragnFav_drowDown'></div>");
            $("#dA_DragnFav_drowDown").hide();
        }
        $(document).on("click", function (ev) { $("#dA_DragnFav_drowDown").hide(); });
    }

    GM.getValue("hiddengroups", "").then(ret => {
        try{
            if (ret != "") {
                hiddengroups = JSON.parse(ret);
            }
        }catch(ex){
            hiddengroups=[];
        }
        return GM.getValue("groupOrder", "");
    }).then(ret => {
        try{
            if (ret != "") {
                groupOrder = JSON.parse(ret);
            }
        }catch(ex){
            groupOrder=[];
        }
        //setInterval(init, 1000); // check every second

        const observer = new MutationObserver(init);
        observer.observe(document.body,{ childList: true, subtree: true });
    });
})();
//# sourceMappingURL=dA_DragnFav.js.map