// ==UserScript==
// @name         Scouts Membership System (UK) Tweaks
// @description  Provide a few tweaks including a role compliance report to the Scouts Website
// @namespace    http://tampermonkey.net/
// @version      100000072
// @author       David Breakwell
// @match        https://membership.scouts.org.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scouts.org.uk
// @grant  GM_xmlhttpRequest
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_addStyle
// @grant GM_notification
// @grant GM_log
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_getResourceURL
// @run-at      document-idle
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/gojs/3.0.17/go.js
// @require     https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
// @require     https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.min.js

// @require     https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js
// @require     https://cdn.jsdelivr.net/npm/luxon@2.3.1/build/global/luxon.min.js
// @resource    jqUI_CSS  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css
// @resource    leaf https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
// @resource    IconSet1  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/images/ui-icons_222222_256x240.png
// @resource    IconSet2  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/images/ui-icons_454545_256x240.png
// @resource    LeafletPin  https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png
// @resource    LeafletShadow   https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png
// @resource    tabulator https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css
// @connect tsa-memportal-prod-fun01.azurewebsites.net
// @connect tsauksprodasa001.blob.core.windows.net
// @connect tsauksprodasa001.table.core.windows.net
// @connect api.postcodes.io
// @connect learn.scouts.org.uk
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536334/Scouts%20Membership%20System%20%28UK%29%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/536334/Scouts%20Membership%20System%20%28UK%29%20Tweaks.meta.js
// ==/UserScript==
//     https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
var code_version = "100000072";
var learning_popup;
var mem = [{}];
var mems= [];
var mapmems= [];
var memsunique = [];
var roles = [];
var role_detail = [];
var dbs_detail = [];
var mem_learning= [];
var learn = [];
var mem_lcount;
var role_max_count;
var respond = false;
var end = false;
var un="";
var debug = false;
var keepalive = null;
var orgcounter = 0;
var myDiagram;
var postcode_regex = new RegExp("[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]? ?[0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}")
var mappin = {};
var map = {};
var mapunits = [];
var postcodes = [];
var defcolors=['#fafad2','#ffe4b5','#ffa07a','#ff6347'];
var defcolorsT=['#000000','#000000','#000000','#000000'];
var colors=['#fafad2','#ffe4b5','#ffa07a','#ff6347'];
var colorsT=['#000000','#000000','#000000','#000000'];
var colormeanings = ["90 Days","60 Days","30 Days","Expired"];
var daylimits = [90,60,30,0,-9999999];
var tabletabulator = null;
var added_css = false;
var added_default = false;
var roles_count = 0;
var debug_log = [];

(function() {
    'use strict';
    function do_move() {
        console.log(document.getElementById("member-nav").value);
    }

    function do_debug(message) {
        if (document.getElementById("gmdebug").checked) {
        do_debug2(message)
        }
    }

     function do_debug2(message) {

         debug_log.push({"time":Date.now(), "message": message});
        GM_log(message);

    }

    function  report_showdebuglog() {
       var html="<table>";
       for (var i=0;i<debug_log.length;i++) {
           var ds = new Date(debug_log[i].time).toDateString();
           html+="<tr><td style='width:20%'>"+ds+"</td><td style='width:80%'>"+debug_log[i].message+"</td>";
       }
        html+="</table>";
        try {
        html+= tabletabulator.getHtml();
        } catch{}
          var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
           WinPrint.document.body.innerHTML = html;
    }

    function dopage() {
        //    if(window.location.href.indexOf("subunitsau")!=-1) {

        setTimeout(function() {
            console.log("After Wait");
            console.log(window.location.href );
            if ((window.location.href == "https://membership.scouts.org.uk/")||(window.location.href == "https://membership.scouts.org.uk/#/")) {
                console.log("Homepage");
                if (document.getElementById("member-nav-list")==null){
                    var gotolist="<datalist id='member-nav-list'><option value='Add a New Member'></option>";
                    gotolist+="<option value='My Units'></option>";
                    gotolist+="</datalist>";

                    gotolist ='<label for="member-nav" style="font-size: 1.5em;font-weight: 600">What do you want to do?&nbsp;</label>' + gotolist;
                    gotolist += '<input style="width: 50%; font-size: 1.5em "list="member-nav-list" id="member-nav" name="member-nav-choice" onchange="do_move"/>';
                    if( document.getElementById("title")!=null) {

                        if (document.getElementById("quick_nav")==null) {
                            gotolist = '<div id="quick_nav">'+gotolist+'</div>';
                            //      document.getElementById("title").outerHTML += (gotolist);

                        } else
                        {
                            //      document.getElementById("quick_nav").innerHTML = (gotolist);
                        }
                    } // title

                } // already dispalyed
            }
            if (window.location.href.indexOf("subunitsau") != -1) {
                //document.body.appendChild(button);
                var htmlToInsert;
                htmlToInsert = '<span id="DavesnewText"><p>There are <a href="';
                htmlToInsert += window.location.href.substring(0, window.location.href.indexOf("subunitsau"));
                htmlToInsert += 'teamsau"><span id="teamcounter"></span></a> Teams at this level</p><span><span id="DavesList"><span>';
                //console.log(document.getElementById("header-main-title-all-units-grid"));

                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/UnitTeamsAndRolesListingAsync",
                    data: '{"unitId" : "' + window.location.href.substring(window.location.href.indexOf("allunits/") + 9, window.location.href.indexOf("subunitsau") - 1) + '", "type" : "team"}',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                        "Accept": "application/json, text/plain, */*"
                    },
                    onload: function(response) {
                        //    console.log("gut response");
                        //    console.log(response.responseText);
                        //    console.log(JSON.parse(response.responseText));
                        if (JSON.parse(response.responseText).teams.length > 1) {
                            document.getElementById("teamcounter").innerHTML = JSON.parse(response.responseText).teams.length;
                        } else {
                            htmlToInsert = '<p>There is <a href="';
                            htmlToInsert += window.location.href.substring(0, window.location.href.indexOf("subunitsau"));
                            htmlToInsert += 'teamsau/' + JSON.parse(response.responseText).teams[0].teamId + "/teamdashboardaut";
                            htmlToInsert += '"><span id="teamcounter">1</span></a> Team at this level</p>';
                            document.getElementById("DavesnewText").innerHTML = (htmlToInsert);
                        }
                        var elements = document.querySelectorAll('[id^=grid-unit]');
                        var elements2 = document.querySelectorAll('[id^=grid-parentUnit]');
                        for (var loop = 0; loop < elements.length; loop++) {
                            var htmlToInsert2 = '<a href="';
                            htmlToInsert2 += elements[loop].href.substring(0, elements[loop].href.indexOf("subunitsau"));
                            htmlToInsert2 += 'teamsau">&nbsp;&nbsp;&nbsp;<strong style=" display: inline-block;  width: 40px; height: 40px;line-height: 40px;text-align: center; background-color: #007bff;  cursor:pointer; color: white; border-color: #007bff; border-radius: 50%;font-size: 20px;font-weight: bold;">T</strong></a>';
                            elements2[loop].outerHTML += htmlToInsert2;
                        }
                    }
                }); // End of request
                document.getElementById("header-main-title-all-units-grid").innerHTML += (htmlToInsert);
                var button = document.createElement("Button");
                button.innerHTML = "Add a Member";
                button.onclick = () => {

                    window.open(window.location.href.substring(0, window.location.href.indexOf("subunitsau")) + "unitdetailsau/addmemberau", "_self");
                };
                button.style = "background: rgb(0, 97, 205);font-weight: 700;font-family: 'Nunito Sans';font-size: 20px;line-height: 1.5;color: white;min-height: 46px;max-width: 215px; cursor:pointer;vertical-align: middle;padding: 8px 24px;border-color: #007bff;";
                document.getElementById("header-main-title-all-units-grid").appendChild(button);

            }
        })

        if (window.location.href.indexOf("teamdashboardaut") != -1) {
            setTimeout(function() {
                var button = document.createElement("Button");
                button.innerHTML = "Add a Member";
                button.onclick = () => {

                    window.open(window.location.href.substring(0, window.location.href.indexOf("teamsau")) + "unitdetailsau/addmemberau", "_self");
                };
                button.style = "background: rgb(0, 97, 205);font-weight: 700;font-family: 'Nunito Sans';font-size: 20px;line-height: 1.5;color: white;min-height: 46px;max-width: 215px;vertical-align: middle;padding: 8px 24px;border: none; cursor:pointer;";
                document.getElementById("header-button-wrapper-action-list").appendChild(button);
            }, 1000);
        }

    } // dopage

    function addButton(text, onclick, cssObj,pos) {
        if (pos=="T") {
            cssObj = cssObj || {position: 'absolute', top: '63px', left:'50%', 'z-index': 3}
        }
        if (pos=="B") {
            cssObj = cssObj || {position: 'absolute', top: '30px', left:'50%', 'z-index': 3}
        }
        if (pos=="C") {
            cssObj = cssObj || {position: 'absolute', top: '30px', left:'40%', 'z-index': 3}
        }
        if (pos=="D") {
            cssObj = cssObj || {position: 'absolute', top: '63px', left:'40%', 'z-index': 3}
        }
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        btnStyle.position = 'absolute'
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }
    function get_data(count){
        var datapass;
        var max = 50;
        un = document.getElementById("gmunitname").value;
        document.getElementById("gmUnit").innerHTML = un;
        $("#gmState")[0].innerText = "Requesting Members for "+un+" ("+count+")"+"Total read "+mems.length;
        if (debug) {do_debug("get_data :Version "+code_version);}
        if (debug) {do_debug("get_data : Collection for Report");}
        if (debug) {do_debug("Unit Request for "+un+" Count "+count);}
        if (debug) {
            do_debug("Unit Request for "+un+" :"+ JSON.parse(localStorage.getItem("authInfo")).idToken.substring(1,50));
            var tokexpDate = new Date( JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.exp *1000);
            do_debug("Token expires :"+ tokexpDate.toGMTString());
        }
        //  document.getElementById("gmState").innerText = "Hello World";
        datapass = '{"pagesize":'+max+',"nexttoken":'+count+',"filter":{"global":"","globaland":false,"fieldand":true,"filterfields":[{"field":"unitName","value":"'+un+'"}]},"isSuspended":false}';
        //       console.log(datapass);
        if (debug) {do_debug("Counter for get_data "+count);}
        GM_xmlhttpRequest({
            method: "POST",
            context: count,
            url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/MemberListingAsync",
            data: datapass,
            //            synchronous:    true,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
                if (debug) { do_debug("Counter Recieved "+response.context)}
                // console.log(JSON.parse(response.responseText).data[1]);
                var mem = null;
                try { mem=JSON.parse(response.responseText).data} catch {console.log("JSON Error "+response.responseText);}
                //   mem =(JSON.parse(response.responseText).data);
                if (mem!=null) {
                    if (debug) {
                        for (var debugloop=0;debugloop<mem.length;debugloop++){
                             do_debug("Member "+mem[debugloop].firstname+" "+mem[debugloop].unitName+mem[debugloop].Role);
                        }
                    }
                }
                if ((mem==null)&&(debug)) {
                     do_debug("GetData: We got an error collecting data for mems page"+response.context);
                }
                if (mem!=null) {
                    mems = mems.concat(mem);
                }
                if (debug) { do_debug("mems now has length "+mems.length);}

                //      console.log(mem.length);
                //      console.log(JSON.parse(response.responseText).data);
                if (response.status!=200) {  do_debug2("HTTP error "+response.status);  do_debug2(JSON.stringify(response));}
                //     console.log(mem);
                //    console.log(JSON.parse(response.responseText).data.length);
                $("#gmState")[0].innerText = "Reading Members for "+un+" ("+response.context+") "+"Total read "+mems.length+"("+mem.length+")";
                if ( JSON.parse(response.responseText).data.length ==50) {get_data(count+1); } else {roles_count = 0;report2()};},
            onerror:   function(response) {  do_debug2("ON Error"); do_debug2(JSON.stringify(response))},
            onabort:  function(response) {  do_debug2("ON Abort"); do_debug2(JSON.stringify(response))}
        });

    }

    function clear_mems(){
        //if (1!=1){
        if (debug) { do_debug("Clear Mems entry: mems now has length "+mems.length);}
        if(document.getElementById("gmmissing").checked) {
            var onlymems = [];
            var onlymemsu = [];
            var act = ['managerDisclosureCheck','dataProtectionTrainingComplete','signDeclaration','updateMemberProfile','referenceRequest','safeguardconfidentialEnquiryCheck','managerWelcomeConversation','coreLearning','managerTrusteeCheck'];

            for (var i = 0; i < role_detail.length; i++) {
                var displine=true;

                if (document.getElementById("gmmissing").checked) {
                    var any_missing = false;
                    for (var j = 0; j < act.length; j++) {
                        if (role_detail[i].actions.find((element)=>element.typeid==act[j])) {
                            var value = role_detail[i].actions.find((element)=>element.typeid==act[j]).status;
                            if ((value!="Satisfactory")&&(value!="Completed")&&(value!="Held - Satisfactory")){ any_missing=true;}
                        }
                    }
                    if (any_missing==false) {displine=false}
                }
                if (displine) {
                    var memobj = new Object();
                    memobj = mems.find((element) => element.id == roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).ContactId);
                    onlymems.push(memobj);
                }
            }
            //roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).RoleName)
            // mems = mems.filter( function(v) {return v.id == onlymems.find((element)=>element.id== v.id)})
            mems = onlymems;
            for(i=0;i<memsunique.length;i++) {
                if (mems.findIndex(e=>e.id==memsunique[i].id)>-1) {
                    onlymemsu.push(memsunique[i]);
                }
            }
            memsunique = onlymemsu;
            if (debug) { do_debug("Clear Mems exit: mems now has length "+mems.length);}
        }
        //       }
        if (mems.length==0) { alert('The report will not be generated as your filters have resulted in no members being selected')}
    }

    function concatenate_name () {
       var st = "";
        if ((document.getElementById("gmpersonnamef").value !="")||(document.getElementById("gmpersonnamel").value !="")){
            if (document.getElementById("gmpersonnamef").value!="") {st = document.getElementById("gmpersonnamef").value}
            if ((document.getElementById("gmpersonnamef").value !="")&&(document.getElementById("gmpersonnamel").value !="")) {st+=" "};
             if (document.getElementById("gmpersonnamel").value!="") {st += document.getElementById("gmpersonnamel").value}
            if (debug) { do_debug("Match Names "+document.getElementById("gmpersonname").value);}
            st = st.toLowerCase();
        }
        return st;
    }

    function report2() {
        //  console.log(mem[1]);
        //      console.log(mems);

        if (debug) { do_debug("report2 : Collection for Report");}
        if (debug) { do_debug("report2 : Number of Members"+mems.length);}
        if (document.getElementById("gmwelcome").checked) {
            if (document.getElementById("gmhelper").checked) {
                mems = mems.filter( function(v) {return v.Role!="Non Member - Needs disclosure";})
                mems = mems.filter( function(v) {return v.Role!="Holding";})
                if (debug) { do_debug("Report 2: Remove Helpers roles now has length "+roles.length);}
            }

        }
        if (debug) { do_debug("mems now has length "+mems.length);}
        if (document.getElementById("gmteamname").value !=""){
            if (debug) {GM_log("Match team "+document.getElementById("gmteamname").value);}
            mems = mems.filter( function(v) {return v.Team.includes(document.getElementById("gmteamname").value);})
            if (debug) {GM_log("mems now has length "+mems.length);}

        }
        if(document.getElementById("gmexact").checked) { //gmexact
            if (debug) { do_debug("Match team "+document.getElementById("gmteamname").value);}
            mems = mems.filter( function(v) {return v.unitName == document.getElementById("gmunitname").value;})
            if (debug) { do_debug("mems now has length "+mems.length);}
        }
        if ((document.getElementById("gmpersonnamef").value !="")||(document.getElementById("gmpersonnamel").value !="")){
            var st = concatenate_name();
            mems = mems.filter( function(v) {return v.fullname.toLowerCase().includes(st);})
            if (debug) { do_debug("mems now has length "+mems.length);}

        }
        if (mems.length==0) { alert('The report will not be generated as your filters have resulted in no members being selected')}
        if (debug) { do_debug("Check for Duplicates ");}
        var seen = {};
        var out = [];
        var len = mems.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
            var item = mems[i];
            if(seen[item.id] !== 1) {
                seen[item.id] = 1;
                out[j++] = item;
            }
        }
      //  if (!document.getElementById("gmwelcome").checked) {
            mems = out;
     //   }
        memsunique = out;
        if (document.getElementById("gmwelcome").checked) {
            if (document.getElementById("gmhelper").checked) {
                mems = mems.filter( function(v) {return v.Role!="Non Member - Needs disclosure";})
                mems = mems.filter( function(v) {return v.Role!="Holding";})
                if (debug) { do_debug("Report 2: Remove Helpers roles now has length "+roles.length);}
            }
            mem_lcount = 0;
            clear_mems();
            report5()
        } else {



            if (mems.length==0) { alert('The report will not be generated as your filters have resulted in no members being selected')}
            $("#gmState")[0].innerText = "Number of Members "+mems.length;
             do_debug("Number of Members "+mems.length);
             do_debug("Number of Unique Members "+memsunique.length);
            for(var loop = 0;loop<memsunique.length; loop++) {
                if (debug) { do_debug("Request Roles for "+loop+" "+memsunique[loop].firstname+" "+memsunique[loop].unitName);}

                GM_xmlhttpRequest({
                    method: "POST",
                    context: loop+1,
                    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/GetMemberRolesAsync",
                    data: '{"contactId": "'+memsunique[loop].id+'"}',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                        "Accept": "application/json, text/plain, */*"
                    },
                    onload: function(response) {//console.log(response.context);
                        roles_count +=1;
                        $("#gmState")[0].innerText = "Number of Members "+memsunique.length+" reading roles for number "+response.context;
                        //     console.log(mems.length);
                        if (response.status!=200) { do_debug2("HTTP error "+response.status);  do_debug2(JSON.stringify(response));}
                        if (debug) { do_debug("Request Roles received for "+response.context+" "+memsunique[response.context-1].firstname+" "+memsunique[response.context-1].unitName);}
                        var jrole= null;
                        try { jrole=JSON.parse(response.responseText).data} catch {console.log("JSON Error "+response.responseText);}
                        if (jrole!=null) {
                            roles=roles.concat(jrole);
                        }
                        if ((jrole==null)&&(debug)) {
                             do_debug("GetData: We got an error collecting roles for member "+response.context+mems[response.context-1].firstname);
                        }
                        if (debug) { do_debug("Context "+response.context+" mems length "+memsunique.length+" "+response.context+" "+mems[response.context-1].firstname+" "+(response.context-1==memsunique.length-1)+" Roles Count "+(roles_count))}

                        // console.log(JSON.parse(response.responseText));
                  //      GM_log("Context "+response.context+ " "+ response.context-1 + "Unique "+memsunique.length
                        if (roles_count==memsunique.length){console.log("Exit");console.log(roles);console.log(mems);report3();} },
                    onerror:   function(response) {  do_debug2("ON Error"); do_debug2(JSON.stringify(response))},
                    onabort:  function(response) {  do_debug2("ON Abort"); do_debug2(JSON.stringify(response))}
                });
            };
        }
    }


    function report3() {
        console.log(roles);
        if (debug) { do_debug("Report 3: mems now has length "+mems.length);}
        if (debug) { do_debug("Report 3: roles now has length "+roles.length);}
        if (document.getElementById("gmhelper").checked) {

            roles = roles.filter( function(v) {return !v.RoleName.includes("Non Member - Needs disclosure");})
            roles = roles.filter( function(v) {return !v.RoleName.includes("Holding");})
            if (debug) { do_debug("Report 3: Remove Helpers roles now has length "+roles.length);}
        }
        if (document.getElementById("gmclosed").checked) {
            roles = roles.filter( function(v) {return v.Closed});
            roles = roles.filter( function(v) {return v.EndDate==null});
            roles = roles.filter( function(v) {return !v.IsSecondaryLevel});
            if (debug) { do_debug("Report 3: Remove Closed roles now has length "+roles.length);}
            console.log(roles);

        }
        if (document.getElementById("gmteamname").value !=""){
            roles = roles.filter( function(v) {if( v.Team==null){return false} else {return v.Team.includes(document.getElementById("gmteamname").value);}})
            if (roles.length==0) { alert('There were no roles in Units matching the Unit Name maybe check you have a % at the end to get all the sub Units')}
            if (debug) { do_debug("Report 3: Filter by Team roles now has length "+roles.length);}
        }
        if (document.getElementById("gmteamonly").checked){
            var  filter = document.getElementById("gmunitname").value.replaceAll("%", "*");
            let w = filter.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
            const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
            roles = roles.filter( function(v) {return re.test(v.UnitId)});
            if (debug) { do_debug("Report 3: Filter by for Unit only roles now has length "+roles.length);}
        }

        var xml = 0;
        var nullc=0;

        if (roles.length==0) { alert('The report will not be generated as your filters have resulted in no roles being selected')}

        for(var loop=0;loop<roles.length;loop++) {
            if (debug) { do_debug("Report 3: Roles Loop request for "+roles[loop].RoleName+" "+roles[loop].Team+" "+loop);}
            //  console.log(roles[loop].EndDate);
            $("#gmState")[0].innerText = "Checking Role "+loop+" of "+roles.length;
            if ((roles[loop].EndDate==null)||(roles[loop].Status!=null)) {
                //   console.log("OK");
                role_max_count = loop;
                GM_xmlhttpRequest({
                    method: "POST",

                    context: loop+1,
                    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/GenerateSASTokenAsync",
                    data: '{container: "contacts", permissions: "R", file: "'+roles[loop].ContactId+'/membership/'+roles[loop].Id+'/audit/data.json"}',
                    //                  synchronous:    true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                        "Accept": "application/json, text/plain, */*"
                    },
                    onload: function(response) {
                        if (debug) { do_debug("Report 3: Roles Blob request for "+response.context+" ")}
                                     if (debug) { do_debug("Report 3: Roles Blob request for "+(response.context-1)+" "+roles[response.context-1].RoleName+" "+roles[response.context-1].Team);}
                        $("#gmState")[0].innerText = "Fetching Role "+response.context+" of "+roles.length;
                        GM_xmlhttpRequest({
                            method: "GET",
                            Accept: "application/json;odata=minimalmetadata",
                            context: response.context+1,
                            url: JSON.parse(response.responseText).token,

                            onload: function(response) { // console.log(response.responseText);
                                // console.log(JSON.parse(response.responseText));
                                // console.log("Total"+(role_detail.length + nullc + xml));
                                //  console.log("Aim"+(roles.length-1));
                                if (debug) { do_debug("Report 3: Roles Loop received for "+(response.context-2)+" "+roles[response.context-2].RoleName+" "+roles[response.context-2].Team);}
                                if (response.status!=200) { do_debug2("HTTP error "+response.status);  do_debug2(JSON.stringify(response));}
                                $("#gmState")[0].innerText = "Checking Role "+response.context;
                                if(!response.responseText.includes("xml")) { role_detail.push(JSON.parse(response.responseText));} else {xml++; console.log("XML for "+response.context)};
                                if (debug) { do_debug("Report 3: role_detail.length : " +role_detail.length+" XML "+xml+" nullc "+nullc + " roles "+roles.length);}
                                if ((role_detail.length+nullc+xml)>=roles.length){console.log("Finish REport 3");console.log(role_detail); mem_lcount = 0;clear_mems();report5()}},
                            onerror:   function(response) {  do_debug2("Report 3 ON Error"); do_debug2(JSON.stringify(response))},
                            onabort:  function(response) {  do_debug2("Report ON Abort"); do_debug2(JSON.stringify(response))}

                        })

                    },
                    onerror:   function(response) {  do_debug2("Report 3 Outer ON Error"); do_debug2(JSON.stringify(response))},
                    onabort:  function(response) {  do_debug2("Report 3 Outer ON Abort"); do_debug2(JSON.stringify(response))}
                });
            } else { nullc++}
        }
    }



    function report5() {

        if (document.getElementById("gmlearning").checked) {

            if (debug) { do_debug("Report 5: Get Learning for "+memsunique[mem_lcount].firstname+" "+memsunique[mem_lcount].Team)+" "+mem_lcount;}
            GM_xmlhttpRequest({
                method: "POST",

                url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/GetLmsDetailsAsync",
                data: '{"contactId": "'+memsunique[mem_lcount].id+'"}',
                context:  mem_lcount+1,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                    "Accept": "application/json, text/plain, */*"
                },
                onload: function(response) {
                    $("#gmState")[0].innerText = "Number of Members "+memsunique.length+" reading learning for number "+mem_lcount;
                    if (debug) { do_debug("Report 5: Learning received for "+(response.context-1));}
                    var l = new Object;
                    l.id = memsunique[ mem_lcount].id;
                    l.learn = [];
                    try { l.learn=JSON.parse(response.responseText)} catch {console.log("JSON Error "+response.responseText);}
                    mem_learning[mem_lcount] = l;
                    // console.log(JSON.parse(response.responseText));
                    if ( mem_lcount==memsunique.length-1){console.log(mem_learning);report6();}else{ mem_lcount++;report5()}},
                onerror:   function(response) {  do_debug2("ON Error"); do_debug2(JSON.stringify(response))},
                onabort:  function(response) {  do_debug2("ON Abort"); do_debug2(JSON.stringify(response))}
            });

        } else {report6() }
    }

    function xmlToJson(xml) {
        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) {
            // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) {
            // text
            obj = xml.nodeValue;
        }

        // do children
        // If all text nodes inside, get concatenated text from them.
        var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
            return node.nodeType === 3;
        });
        if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
            obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
                return text + node.nodeValue;
            }, "");
        } else if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                //  if (nodeName=="m:properties") {nodeName = "m_properties"}
                if (nodeName[1]==":") {nodeName = nodeName.replace(":", "_")};
                if (typeof obj[nodeName] == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof obj[nodeName].push == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    }

    function report6() {
        var xmlURL ="";
        var xml = 0; var nullc=0;

        if (document.getElementById("gmdbs").checked) {

            for(var loop=0;loop<memsunique.length;loop++) {
                if (debug) { do_debug("Report 6: DBS requested for "+loop+" "+memsunique[loop].firstname);}
                //  console.log(roles[loop].EndDate);
                $("#gmState")[0].innerText = "Checking Disclosure "+loop+" of "+memsunique.length;
                GM_xmlhttpRequest({
                    method: "POST",
                    context: loop+1,
                    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/GenerateSASTokenAsync",
                    data: '{"table": "Disclosures", "permissions": "R", "partitionkey" : "'+memsunique[loop].id+'"}',
                    synchronous:    true,
                    headers: {
                        "Content-Type": "application/json",
                        "Type" : "table",
                        "accept-language" : "en-GB,en;q=0.9",
                        "sec-fetch-site" : "cross-site",
                        "Origin" : "https://membership.scouts.org.uk",
                        "content-encoding" : "gzip",
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                        "Accept": "application/json, text/plain, */*"
                    },
                    onload: function(response) {
                        xmlURL = "";
                        if (debug) { do_debug("Report 6: DBS Blob URL Received for "+(response.context-1)+" "+memsunique[response.context-1].firstname);}
                        try { xmlURL =  JSON.parse(response.responseText) } catch {console.log(response.responseText)};
                        if (xmlURL=="") { if (debug) { do_debug("Report 6: DBS Blob URL JSON Error " +response.responseText);} }
                        if (xmlURL!="") {
                            $("#gmState")[0].innerText = "Fetching DBS "+response.context+" of "+memsunique.length;
                            GM_xmlhttpRequest({
                                method: "GET",
                                context: response.context,
                                url: JSON.parse(response.responseText).token,
                                onload: function(response) {
                                    if (debug) { do_debug("Report 6: DBS received for "+(response.context-1)+" "+memsunique[response.context-1].firstname);}
                                    if (response.status!=200) { do_debug2("HTTP error "+response.status);  do_debug2(JSON.stringify(response));}
                                    $("#gmState")[0].innerText = "Checking DBS "+response.context;
                                    if(response.responseText.includes("xml")) { var XmlNode = new DOMParser().parseFromString(response.responseText, 'text/xml');
                                                                               var dbsxml = xmlToJson(XmlNode); dbsxml.id = memsunique[response.context-1].id;
                                                                               dbsxml.firstname = memsunique[response.context-1].firstname;
                                                                               dbs_detail.push(dbsxml);} else {xml++};
                                    if (dbs_detail.length+xml>=memsunique.length){console.log(dbs_detail); report4()}},
                                onerror:   function(response) {  do_debug2("ON Error"); do_debug2(JSON.stringify(response))},
                                onabort:  function(response) {  do_debug2("ON Abort"); do_debug2(JSON.stringify(response))}

                            }) } else {xml++; if (dbs_detail.length+xml>=memsunique.length){console.log(dbs_detail); report4()}}

                    }
                });

            }
        } else {report4()}

    }

    function report_headers(table) {
        var expirytext = "Expiry";
        var expirytextdays = "Expiry Days";
        var act = ['managerDisclosureCheck','dataProtectionTrainingComplete','signDeclaration','updateMemberProfile','referenceRequest','safeguardconfidentialEnquiryCheck','managerWelcomeConversation','coreLearning','managerTrusteeCheck'];
        var title = ['Role','Unit','Team','Name','Number','Status','Start Date','Days','Disclosure','GDPR','Declaration','Profile','References','CE Check','Welcome','Learning','Trustee'];
        var learn = ['Creating Inclusion','Data Protection in Scouts','Who We Are and What We Do','Safeguarding','Safety','First Response','Delivering a Great Programme','Being a Trustee in Scouts','Leading Scout Volunteers'];
        var tr = document.createElement('TR');
        table.appendChild(tr);

        for (var i=0; i<title.length;i++){
            var td = document.createElement('TH');

            if (i>7) { td.style.writingMode = "vertical-lr"; td.style.backgroundColor='lightcyan';}
            //  td.style.writingmode = 'vertical-lr';
            td.appendChild(document.createTextNode(title[i]));
            var visible = true;
            if ((i>4)&&(document.getElementById("gmwelcome").checked)){visible=false};
            if ((i==4)&&(!document.getElementById("gmnumber").checked)){visible=false};
            if (visible) { tr.appendChild(td); }
        }

        if (document.getElementById("gmlearning").checked) {
            for ( i=0; i<learn.length;i++){
                td = document.createElement('TH');
                td.style.writingMode = "vertical-lr";
                td.style.backgroundColor = 'LightGray';
                td.appendChild(document.createTextNode(learn[i]));
                tr.appendChild(td);
                if (((i==3)||(i==4)||(i==5))&&(document.getElementById("gmdates").checked)) {
                    td = document.createElement('TH');
                    td.style.writingMode = "vertical-lr";
                    td.style.backgroundColor = 'LightGray';
                    td.appendChild(document.createTextNode(learn[i]+" "+expirytext));
                    tr.appendChild(td);
                }
                if (((i==3)||(i==4)||(i==5))&&(document.getElementById("gmdays").checked)) {
                    td = document.createElement('TH');
                    td.style.writingMode = "vertical-lr";
                    td.style.backgroundColor = 'LightGray';
                    td.appendChild(document.createTextNode(learn[i]+" "+expirytextdays));
                    tr.appendChild(td);
                }
            }
        }
        if (document.getElementById("gmdbs").checked) {
            td = document.createElement('TH');
            td.style.backgroundColor = 'LightGray';
            td.appendChild(document.createTextNode("DBS Expiry"));

            tr.appendChild(td);
            td = document.createElement('TH');
            td.style.writingMode = "vertical-lr";
            td.style.backgroundColor = 'LightGray';
            td.appendChild(document.createTextNode("DBS Days Remaining"));

            tr.appendChild(td);
            if (document.getElementById("gmdbsip").checked){
                td = document.createElement('TH');
                td.style.backgroundColor = 'LightGray';
                td.appendChild(document.createTextNode("DBS Status"));

                tr.appendChild(td);
            }
        }
    }

    function tabulator_id_url() {
    }

    var headerMenu = function(){
        var menu = [];
        var columns = this.getColumns();

        for(let column of columns){

            //create checkbox element using font awesome icons
            let icon = document.createElement("span");
            icon.classList.add("fas");
            icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

            //build label
            let label = document.createElement("span");
            let title = document.createElement("span");

            title.textContent = " " + column.getDefinition().title;

            label.appendChild(icon);
            label.appendChild(title);

            //create menu item
            menu.push({
                label:label,
                action:function(e){
                    //prevent menu closing
                    e.stopPropagation();

                    //toggle current column visibility
                    column.toggle();

                    //change menu item icon
                    if(column.isVisible()){
                        icon.classList.remove("fa-square");
                        icon.classList.add("fa-check-square");
                    }else{
                        icon.classList.remove("fa-check-square");
                        icon.classList.add("fa-square");
                    }
                }
            });
        }

        return menu;
    };

    function report_headers_tabulator() {
        var expirytext = "Expiry";
        var expirytextdays = "Expiry Days";
        var act = ['managerDisclosureCheck','dataProtectionTrainingComplete','signDeclaration','updateMemberProfile','referenceRequest','safeguardconfidentialEnquiryCheck','managerWelcomeConversation','coreLearning','managerTrusteeCheck'];
        var title = ['Name','Role','Unit','Team','Number','Email','Status','Start Date','Days','Disclosure','GDPR','Declaration','Profile','References','CE Check','Welcome','Growing Roots Learning','Trustee Check'];
        var learn = ['Creating Inclusion','Data Protection in Scouts','Who We Are and What We Do','Safeguarding','Safety','First Response','Delivering a Great Programme','Being a Trustee in Scouts','Leading Scout Volunteers'];
        var titlefieldnames = ['name','role','unit','team','number','email','status','start','days','disclosure','gdpr','declaration','profile','references','ce','welcome','learning','trustee'];
        var learnfieldnames = ['inclusion','datap','who','safeguarding','safety','firstresponse','programme','trustee2','leading'];
        var dbs = ['DBS','DBS Expiry','DBS Days','DBS Status'];
        var dbsfieldnames = ['dbs','dbs_expiry','dbs_expirydays','dbsstatus'];
        var headers = [];

        var color_formatter = function testFormatter(cell, formatterParams) {    var days = cell.getValue();
                                                                             if(document.getElementById("gmcolor").checked) {
                                                                                 var fv =  cell.getData()[cell.getField().substr(0,cell.getField().indexOf("_"))];
                                                                                 if ("✅❌✔⚡".includes(fv)) {
                                                                                     for(cloop=0;cloop<4;cloop++) {
                                                                                         if ((days<=daylimits[cloop])&&(days>daylimits[cloop+1])) {
                                                                                             cell.getElement().style.backgroundColor = colors[cloop];
                                                                                             cell.getElement().style.color = colorsT[cloop];
                                                                                         }}}
                                                                             }
                                                                             return days}
        var color_formatter_date = function testFormatter(cell, formatterParams) {
            if(document.getElementById("gmcolor").checked) {
                var fv =  cell.getData()[cell.getField().substr(0,cell.getField().indexOf("_"))];
                if ("✅❌✔⚡".includes(fv)) {
                    var days  = cell.getData()[cell.getField()+"days"];
                    for(cloop=0;cloop<4;cloop++) {
                        if ((days<=daylimits[cloop])&&(days>daylimits[cloop+1])) {
                            cell.getElement().style.backgroundColor = colors[cloop];
                            cell.getElement().style.color = colorsT[cloop];
                        }}}}
            return cell.getValue()}
        //   for (var i=0; i<title.length;i++){
        var group = new Object;
        var visible = true;
         group.columns = [];
         group.title = "";
         group.frozen = true;

                var head = new Object;
                head.title = title[0];
                head.field = titlefieldnames[0];
                head.headerFilter = "input";

                head.formatterParams = new Object;
                head.formatter="link"; head.formatterParams.urlField = "memberURL";head.formatterParams.target = "_blank"
                head.headerMenu = headerMenu;
                group.columns.push(head);



          headers.push(group);
        group = new Object;
         group.columns = [];
         group.title = "";
        for (var i=1; i<9;i++){

             visible = true;
          //  if (((i>4))&&(document.getElementById("gmwelcome").checked)){visible=false};
            //    if ((i==4)&&(!document.getElementById("gmnumber").checked)){visible=false};
          //  if (visible) {
                head = new Object;
                head.title = title[i];
                head.field = titlefieldnames[i];
                head.headerFilter = "input";
                head.visible = visible;
                if ((i==4)&&(!document.getElementById("gmnumber").checked))  { head.visible=false}
                if (i==7) {    head.sorter = "date";}
                if (i==8) {    head.sorter = "number"; head.headerFilterPlaceholder = "less than" ; head.headerFilterFunc = "<";  head.headerFilter = "number";}
                if (i==0) { head.frozen = true;}
                head.formatterParams = new Object;
                if (i==0){head.formatter="link"; head.formatterParams.urlField = "memberURL";head.formatterParams.target = "_blank"}

            //    if (i>7) { head.headerVertical = true;}
                head.headerMenu = headerMenu;
                group.columns.push(head);
          //  }

        }
          headers.push(group);
        group = new Object;
      //  if (!document.getElementById("gmwelcome").checked) {
            group.columns = [];
            group.title = "Welcome Activities";
            //    group.cssClass = "blue-background";
            for (i=9; i<title.length;i++){
                visible = true;
               // if ((i>7)&&(document.getElementById("gmwelcome").checked)){visible=false};
                 if (document.getElementById("gmwelcome").checked) { visible = false};
            //    if (visible) {
                  head = new Object;
                    head.visible = visible;
                    head = new Object;
                    head.title = title[i];
                    head.field = titlefieldnames[i];
                    head.cssClass = "blue-background";

                    head.formatterParams = new Object;
                    if (i>7) { head.headerVertical = true;}
                    if (i==10) {head.visible = false;}
                    head.headerFilter = "list";
                    head.headerFilterParams = {    valuesLookup:"active" }
                    group.columns.push(head);
               // }
            }
            headers.push(group);
      //  }
        group = new Object;

            group.columns = [];
            group.title = "Learning";
            //      group.cssClass = "yellow-background";
            for ( i=0; i<learn.length;i++){

                head = new Object;
                if (!document.getElementById("gmlearning").checked) {
                    head.visible = false;
                }
                head.title = learn[i];
                head.field = learnfieldnames[i];
                head.headerVertical = true;
                head.cssClass = "yellow-background";
                head.headerFilter = "list";
                head.headerFilterParams = {    valuesLookup:"active" }
                 if (!document.getElementById("gmlearning").checked) {
                    head.visible = false;
                }
                group.columns.push(head);
                if (((i==3)||(i==4)||(i==5))) {
                    head = new Object;
                    head.title = learn[i]+" "+expirytext;
                    head.field = learnfieldnames[i]+"_expiry";
                    head.sorter = "date";
                    head.headerVertical = true;
                    head.formatter = color_formatter_date;
                    head.cssClass = "yellow-background";
                    head.headerFilter = "input";
                     if (!document.getElementById("gmdates").checked) {
                    head.visible = false;
                }
                    group.columns.push(head);
                }
                if (((i==3)||(i==4)||(i==5))) {
                    head = new Object;
                    head.title = learn[i]+" "+expirytextdays;
                    head.field = learnfieldnames[i]+"_expirydays";
                    head.sorter = "number";
                    head.headerVertical = true;
                    head.formatter = color_formatter;
                    head.cssClass = "yellow-background";
                    head.headerFilterPlaceholder = "less than",
                        head.headerFilterFunc = "<"
                    head.headerFilter = "number";
                     if (!document.getElementById("gmdays").checked) {
                    head.visible = false;
                }
                    group.columns.push(head);
                }
            }
            headers.push(group);

        group = new Object;

            group.columns = [];
            group.title = "DBS";
            // group.cssClass = "orange-background";
            for ( i=0; i<dbs.length-1;i++){
                head = new Object;
                head.title = dbs[i];
                head.field = dbsfieldnames[i];
                 if (!document.getElementById("gmdbs").checked) {
                     head.visible = false;
                 }
                head.cssClass = "orange-background";
                if (i==0) {
                    head.headerFilter = "list";
                    head.headerFilterParams = {    valuesLookup:"active" }
                } else {              head.headerFilter = "input"; }
                if (i==0) { head.headerVertical = true;}

                if (i==2) {     head.sorter = "number";   head.formatter = color_formatter;   head.headerFilterPlaceholder = "less than" ; head.headerFilterFunc = "<";  head.headerFilter = "number";}
                if (i==1) {     head.sorter = "date";   head.formatter = color_formatter_date;}
                group.columns.push(head);
            }
            //   if (document.getElementById("gmdbsip").checked){
            head = new Object;
            head.title = dbs[3];
            head.field = dbsfieldnames[3];
            if (!document.getElementById("gmdbsip").checked) {
                     head.visible = false;
            }
            head.cssClass = "orange-background";
            head.headerFilter = "input";
            group.columns.push(head);
            headers.push(group);
            //   }
      //  }
        return headers;
    }


    function report4() {
        if (debug) { do_debug("Report 4 : Data Collected - generate report ");}
        if (debug) { do_debug("Report 4 : Roles Detail "+role_detail.length);}
        if (debug) { do_debug("Report 4 : Mems  "+mems.length);}
        if (debug) { do_debug("Report 4 : Roles  "+roles.length);}
        if (debug) { do_debug("Report 4 : Learning  "+mem_learning.length);}
        if (debug) { do_debug("Report 4 : DBS  "+ dbs_detail.length);}
        var expirytext = "Expiry";
        var expirytextdays = "Expiry Days";
        var act = ['managerDisclosureCheck','dataProtectionTrainingComplete','signDeclaration','updateMemberProfile','referenceRequest','safeguardconfidentialEnquiryCheck','managerWelcomeConversation','coreLearning','managerTrusteeCheck'];
        var title = ['Role','Unit','Team','Name','Status','Start Date','Days','Disclosure','GDPR','Declaration','Profile','References','CE Check','Welcome','Learning','Trustee'];
        var learn = ['Creating Inclusion','Data Protection in Scouts','Who We Are and What We Do','Safeguarding','Safety','First Response','Delivering a Great Programme','Being a Trustee in Scouts','Leading Scout Volunteers'];

        $("#gmState")[0].innerText = "Data Collection Completed";
        var myTableDiv = document.getElementById("gmTable");
        var table = document.createElement('TABLE');
        table.border = '1';
        table.id = "GMourreport";

        var tableBody = document.createElement('THEAD');
        table.appendChild(tableBody);
        //    var tr = document.createElement('TR');
        //   tableBody.appendChild(tr);
        report_headers(tableBody);
        tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);
        var tablines = [];
        var   tr = document.createElement('TR');
        if (!(document.getElementById("gmwelcome").checked)) {
            for (i = 0; i < role_detail.length; i++) {
                var displine=true;

                if (document.getElementById("gmmissing").checked) {
                    var any_missing = false;
                    for (var j = 0; j < act.length; j++) {
                        if (role_detail[i].actions.find((element)=>element.typeid==act[j])) {
                            var value = role_detail[i].actions.find((element)=>element.typeid==act[j]).status;
                            if ((value!="Satisfactory")&&(value!="Completed")&&(value!="Held - Satisfactory")){ any_missing=true;}
                        }
                    }
                    if (any_missing==false) {displine=false}
                }
                if (displine) {
                    //      tr = document.createElement('TR');
                    //      tableBody.appendChild(tr);

                    output_report_line(tableBody,i,mems.findIndex( (element) => element.id == roles.find( (element) => element.Id == role_detail[i].roleApprovalMemberShipId).ContactId));
                    tablines.push(report_line_tabulator(i,mems.findIndex( (element) => element.id == roles.find( (element) => element.Id == role_detail[i].roleApprovalMemberShipId).ContactId)));
                }
            }
        }
        else
        {
            for (var i = 0; i < mems.length; i++) {
                if (mems[i].Role!=null) {
                    output_report_line(tableBody,-1,i);
                    tablines.push( report_line_tabulator(-1,i))
                }
            }
        }
        table.style.fontSize = "10pt";
        document.getElementById("gmTable").innerHTML="";
        //  myTableDiv.appendChild(table);

        //   console.log(hasStyleRule("tabulator-col.tabulator-sortable.tabulator-col-sorter-element.orange-background"));
        if (!added_css) {
            added_css=true;
            GM_addStyle ('.fa-check-square:before { content: "✅";   }' );
            GM_addStyle ('.fa-square:before { content: "🟩";   }' );
            GM_addStyle('.tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-sorter-element.blue-background {background : #ADD8E6 }');
            GM_addStyle('.tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-sorter-element.yellow-background {background : #FFFFE0 }');
            GM_addStyle('.tabulator-col.tabulator-sortable.tabulator-col-sorter-element.orange-background {background : #FFDAB9 }');
            GM_addStyle('th.blue-background {    writing-mode: vertical-lr;    background-color: lightcyan; }');
            GM_addStyle('th.yellow-background {    writing-mode: vertical-lr;    background-color: lightgoldenrodyellow; }');
            GM_addStyle('th.orange-background {    writing-mode: vertical-lr;    background-color: salmon; }');
            GM_addStyle('table.tabulator-print-table, tr, th, td {    border: solid;}');
        }
        tabletabulator = new Tabulator("#gmTabulator", {data: tablines,  printAsHtml:true,  columnHeaderVertAlign :"bottom",  maxHeight:"100%", columns: report_headers_tabulator(),    movableColumns: true,   dependencies:{  DateTime:luxon.DateTime, },
                                                        downloadEncoder:function(fileContents, mimeType){
                                                            var b = new Blob([fileContents], {type:mimeType});    var url = URL.createObjectURL(b);
                                                            url = window.URL.createObjectURL(b);
                                                            var filename = 'myBlobFile.xlsx';

                                                            var a = document.createElement('a');
                                                            a.style = 'display: none';
                                                            a.href = url;
                                                            a.download = filename;

                                                            // IE 11
                                                            if (window.navigator.msSaveBlob !== undefined) {
                                                                window.navigator.msSaveBlob(b, filename);
                                                                return;
                                                            }
                                                            document.body.appendChild(a);
                                                            var e = new MouseEvent ("click");
                                                            a.dispatchEvent (e);
                                                            window.URL.revokeObjectURL(url);
                                                            document.body.removeChild(a);
                                                            // });
                                                        }
                                                       }); // tabulator
        tabletabulator.on("tableBuilt", function(){
            if (!document.getElementById("gmnumber").checked) { tabletabulator.hideColumn("number") }
            if (!document.getElementById("gmdates").checked) { tabletabulator.hideColumn("safeguarding_expiry");tabletabulator.hideColumn("firstresponse_expiry");tabletabulator.hideColumn("safety_expiry") }
            if (!document.getElementById("gmdays").checked) { tabletabulator.hideColumn("safeguarding_expirydays");tabletabulator.hideColumn("firstresponse_expirydays");tabletabulator.hideColumn("safety_expirydays") }
            if (!document.getElementById("gmdbsip").checked) { tabletabulator.hideColumn("dbsstatus") }
        });
    }

    var trustee_roles = ['Lead Volunteer','Trustee','Treasurer','Youth Lead','Chair'];

    function is_trustee(rolename) {
        if (trustee_roles.findIndex(e=>e == rolename)>-1) {return true}
        if (rolename.includes(trustee_roles[0])) {return true}
        return false;
    }
    var no_dbs = ['President','Vice President','Holding','Retired Member','Nations Staff Member','Council Member','Network Member','Locally Employed Staff','National Staff member','National Staff team leader','Trustee Board Sub-Team Member'];

    function needs_dbs(rolename) {
        if (no_dbs.findIndex(e=>e == rolename)>-1) {return false} else {return true};
    }

    var no_training = ['President','Vice President','Holding','Retired Member','Non Member - Needs disclosure','Council Member','Network Member','Designated Carers'];

    function needs_training(rolename) {
        if (no_training.findIndex(e=>e == rolename)>-1) {return false} else {return true};
    }

    function is_section(unit_type) {
        if ((unit_type=='Group Section')||(unit_type=='District Section')||(unit_type=='County Section')) {return true}
        else if ((unit_type=="866060000")||(unit_type=='866060002')||(unit_type=='866060007')) {return true}
        else {return false}
    }

    var mainteams = ['Leadership Team','Volunteering Development Team','Support Team','Programme Team','14-24 Team'];

    function is_mainteam(team_name) {
        if (mainteams.findIndex((element)=>element==team_name>-1)) {return true} else {return false}
    }

    function is_teamleader(rolename,unit_type,ParentTeamId,team_name) {
        //  if ((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName.includes('Lead Volunteer'))||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Team Leader')&&((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='Group Section')&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='District Section'))) {
        if (rolename.includes('Lead Volunteer')) { return true;}
        if (rolename.includes('Youth Lead')) { return true;}
        if (ParentTeamId!=null) {return false} // Is a Sub team
        if (!is_mainteam(team_name)) {return false}
        if ((rolename=='Team Leader')&&!is_section(unit_type)) {return true}
        return false;
    }
    function is_firstresponse(unit_type,role_name,team_name) {
        if (is_section(unit_type)) {return true}
        if (role_name=="Group Lead Volunteer") {return true}
        if ((team_name=='14-24 Team')&&(role_name=="Team Leader")) {return true}
        return false;
    }



    // *****************************************************************
    /// This is used for the refresh but no new data
    /// *****************************************************************
    function output_report_line(table,role_index,mem_index) {
        var act = ['managerDisclosureCheck','dataProtectionTrainingComplete','signDeclaration','updateMemberProfile','referenceRequest','safeguardconfidentialEnquiryCheck','managerWelcomeConversation','coreLearning','managerTrusteeCheck'];
        var title = ['Role','Unit','Team','Name','Status','Start Date','Days','Disclosure','GDPR','Declaration','Profile','References','CE Check','Welcome','Learning','Trustee'];
        var learn = ['Creating Inclusion','Data Protection in Scouts','Who We Are and What We Do','Safeguarding','Safety','First Response','Delivering a Great Programme','Being a Trustee in Scouts','Leading Scout Volunteers'];

        var tr = document.createElement('TR');
        table.appendChild(tr);
        // Name
        if (role_index>=0) {
            var td = document.createElement('TD');
            td.appendChild(document.createTextNode(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName));
            tr.appendChild(td);
            td = document.createElement('TD');
            td.appendChild(document.createTextNode(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitId));
            tr.appendChild(td);
            td = document.createElement('TD');
            td.appendChild(document.createTextNode(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).Team));
            tr.appendChild(td);
        } else
        {
            td = document.createElement('TD');
            td.appendChild(document.createTextNode(mems[mem_index].Role));
            tr.appendChild(td);
            td = document.createElement('TD');
            td.appendChild(document.createTextNode(mems[mem_index].unitName));
            tr.appendChild(td);
            td = document.createElement('TD');
            td.appendChild(document.createTextNode(mems[mem_index].Team));
            tr.appendChild(td);
        }
        td = document.createElement('TD');
        var fullname = mems[mem_index].fullname;
        //  var nameid = mems.find((element) => element.id == roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).ContactId).id;
        var nameid = mems[mem_index].id;
        var memhtml = '<a href="https://membership.scouts.org.uk/#/membersearch/'+nameid+'/viewmember" target="_blank">'+fullname+'</a>';
        tr.appendChild(td);
        td.innerHTML=(memhtml);
        if (document.getElementById("gmnumber").checked) {
            td = document.createElement('TD');
            td.appendChild(document.createTextNode(mems[mem_index].membershipnumber));
            tr.appendChild(td);
        };
        if (role_index>=0) {

            // Role
            td = document.createElement('TD');
            td.appendChild(document.createTextNode(role_detail[role_index].rolestatus));
            tr.appendChild(td);
            td = document.createElement('TD');
            var sdate = new Date(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).StartDate);
            td.appendChild(document.createTextNode(sdate.toLocaleDateString('en-GB')));
            var days  = Math.round((new Date() - sdate) / (1000 * 60 * 60 * 24));
            tr.appendChild(td);

            td = document.createElement('TD');
            td.appendChild(document.createTextNode(days));
            tr.appendChild(td);

            for (var j = 0; j < act.length; j++) {
                td = document.createElement('TD');
                //   td.width = '75';
                if (role_detail[role_index].actions.find((element)=>element.typeid==act[j])) {

                    var state= 0x274C;
                    var value = role_detail[role_index].actions.find((element)=>element.typeid==act[j]).status;
                    if ((value=="Satisfactory")||(value=="Completed")||(value=="Held - Satisfactory")){state= 0x2705;}

                    //  td.appendChild(document.createTextNode(role_detail[i].actions.find((element)=>element.typeid==act[j]).status+String.fromCodePoint(state)));
                    td.appendChild(document.createTextNode(String.fromCodePoint(state)));

                    //   td.appendChild(document.createTextNode(String.fromCodePoint(state)));
                } else {
                    // Deal with bug in API that means this can be missing.....
                    if(j==3) {
                        state= 0x274C;
                        td.appendChild(document.createTextNode(String.fromCodePoint(state)));
                    } else {
                        td.appendChild(document.createTextNode(" "))
                    }
                }
                td.style.backgroundColor='lightcyan';
                tr.appendChild(td);
            }
        } else {

        }
        // Learning

        if (document.getElementById("gmlearning").checked) {
            for ( j = 0; j < learn.length; j++) {
                td = document.createElement('TD');
                state= 0x274C;
                var lr = mem_learning.find((element) => element.id == mems[mem_index].id);
                if (lr.learn.find((object)=>object.title==learn[j])){
                    state= 0x2705;
                }
                // Check Expiry x26A1
                if (lr.learn.find((object)=>object.title==learn[j])){
                    if (lr.learn.find( (object) => object.title == learn[j]).expiryDate !=null) {
                        sdate = new Date(lr.learn.find((object)=>object.title==learn[j]).expiryDate);
                        days  = Math.round((sdate - new Date()) / (1000 * 60 * 60 * 24));
                        if (days<=90) {state = 0x26A1;
                                      }
                    } else {days=0;sdate = new Date("1977-01-01T00:00:01Z") ;}
                } else {days=0;sdate = new Date("1977-01-01T00:00:01Z") ;}
                if (role_index>=0) {
                    var role_find = {};
                    role_find = roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId);
                    if (j==7) {
                        // Trustee
                        //       if ((!roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName.includes('Lead Volunteer'))&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName!='Trustee')) {
                        if (!is_trustee(role_find.RoleName)) {
                            if(state==0x2705) {state=0x2714;}
                            else {
                                state = 0x0020;
                            }
                        }
                    }
                    if (j==8) {
                        // Team Lead is_teamleader(rolename,unit_type,ParentTeamId,team_name)
                        //   if ((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName.includes('Lead Volunteer'))||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Team Leader')&&((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='Group Section')&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='District Section'))) {
                        if (is_teamleader(role_find.RoleName,role_find.UnitType,role_find.ParentTeamId,role_find.Team)) {
                        } else {if(state==0x2705) {
                            state=0x2714;}
                                else {
                                    state = 0x0020;
                                }}
                    }
                    /*  if (j==8) {
                        // Team Lead of Subteam means no training... Parent being null means this isn't a subteam
                        if ((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).ParentTeamId==null)) {

                        } else {if((state==0x2705)||(state == 0x2714)) {
                            state=0x2714;}
                                else {
                                    state = 0x0020;
                                }}
                    }*/
                    if (j==6) {
                        // programme - only section roles
                        //    if ((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='Group Section')&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='District Section')) {
                        if (!is_section(role_find.UnitType) )
                            if(state==0x2705) {
                                state=0x2714;}
                            else {
                                state = 0x0020;
                            }
                    }

                    if (j==5) {
                        // First Response
                        //    if ((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType=='Group Section')||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType=='District Section')||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Group Lead Volunteer')||((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Team Leader'))&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).Team=='14-24 Team')) {
                        if (is_firstresponse(role_find.UnitType,role_find.RoleName,role_find.Team)) {
                        } else { if(state==0x2705) {
                            state=0x2714;}
                                else {
                                    state = 0x0020;
                                }
                               }
                    }
                    // Check for those not needing training
                    //   var rn = roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName;
                    //   if ((rn=='Non Member - Needs disclosure')||(rn=='President')||(rn=='Vice President')||(rn=='Holding')||(rn=='Retired Member')) {
                    if (!needs_training(role_find.RoleName)) {
                        if ((state == 0x26A1)||(state == 0x2705)||(state == 0x2714)) {
                            state=0x2714;}
                        else {
                            state = 0x0020;
                        }
                    }

                } else {

                    if ((j==7)&&(mems[mem_index].Role!=null)) {
                        // Trustee
                        if (!is_trustee(mems[mem_index].Role)) {
                            //  if ((!mems[mem_index].Role.includes('Lead Volunteer'))&&(mems[mem_index].RoleName!='Trustee')) {

                            if(state==0x2705) {
                                state=0x2714;}
                            else {
                                state = 0x0020;
                            }
                        }
                    }
                    if ((j==8)&&(mems[mem_index].Role!=null)) {
                        // Team Lead
                        if (is_teamleader(mems[mem_index].Role,mems[mem_index].unittype,null,mems[mem_index].Team)) {

                            //         if ((mems[mem_index].Role.includes('Lead Volunteer'))||(mems[mem_index].Role=='Team Leader')&&((mems[mem_index].unittype!='Group Section')&&(mems[mem_index].unittype!='District Section'))) {

                        } else {if(state==0x2705) {
                            state=0x2714;}
                                else {
                                    state = 0x0020;
                                }}
                    }
                    /*       if (j==8) {
                        var mainteams = ['Leadership Team','Volunteering Development Team','Support Team','Programme Team','14-24 Team'];
                        // Team Lead for Sub teams
                        if (mainteams.find((element)=>element==mems[mem_index].Team!=undefined)
                           ) {

                        } else {if((state==0x2705)||(state == 0x2714)) {
                            state=0x2714;}
                                else {
                                    state = 0x0020;
                                }}
                    }*/
                    if (j==6) {
                        // programme - only section roles
                        if (!is_section(mems[mem_index].unittype) ){
                            //       if ((mems[mem_index].unittype!='Group Section')&&(mems[mem_index].unittype!='District Section')) {
                            if(state==0x2705) {
                                state=0x2714;}
                            else {
                                state = 0x0020;
                            }
                        }
                    }
                    if ((j==5)&&(mems[mem_index].Role!=null)) {
                        // First Response
                        //     if ((mems[mem_index].unittype=='Group Section')||(mems[mem_index].unittype=='District Section')||(mems[mem_index].Role=='Group Lead Volunteer')||((mems[mem_index].Role=='Team Leader'))&&(mems[mem_index].Team=='14-24 Team')) {
                        if (is_firstresponse(mems[mem_index].unittype,mems[mem_index].Role,mems[mem_index].Team)) {

                        } else { if(state==0x2705) {
                            state=0x2714;}
                                else {
                                    state = 0x0020;
                                } }
                    }
                    // Check for those not needing training
                    var rn = mems[mem_index].Role;
                    if (rn!=null) {
                        if (!needs_training(mems[mem_index].Role)) {
                            if ((state == 0x26A1)||(state == 0x2705)||(state == 0x2714)) {
                                state=0x2714;}
                            else {
                                state = 0x0020;
                            }
                        }
                    }

                }
                td.appendChild(document.createTextNode(String.fromCodePoint(state)));
                td.style.backgroundColor = 'LightGray';
                tr.appendChild(td);
                var blankdate =  new Date("1977-01-01T00:00:01Z");
                if ((document.getElementById("gmdates").checked)&&((j==3)||(j==4)||(j==5))) {
                    td = document.createElement('TD');
                    if (lr.learn.find( (object) => object.title == learn[j])) {
                        if (sdate.getTime()!= blankdate.getTime()) {
                            td.style.backgroundColor = 'LightGray';
                            if (( state != 0x0020)&&(document.getElementById("gmcolor").checked)){
                                for(var cloop=0;cloop<4;cloop++) {
                                    if ((days<=daylimits[cloop])&&(days>daylimits[cloop+1])) {
                                        td.style.backgroundColor = colors[cloop];
                                        td.style.textColor = colorsT[cloop];
                                    }}}
                            td.appendChild(document.createTextNode(sdate.toLocaleDateString('en-GB')));
                        }
                    } else {
                        if (( state != 0x0020)&&(document.getElementById("gmcolor").checked)){
                            for(cloop=0;cloop<4;cloop++) {
                                if ((days<=daylimits[cloop])&&(days>daylimits[cloop+1])) {
                                    td.style.backgroundColor = colors[cloop];
                                    td.style.textColor = colorsT[cloop];
                                }}}
                    }

                    tr.appendChild(td);
                }
                if (((j==3)||(j==4)||(j==5))&&(document.getElementById("gmdays").checked)) {
                    td = document.createElement('TD');
                    td.style.backgroundColor = 'LightGray';
                    if (!document.getElementById("gmwelcome").checked) {
                        if ((j!=3)||(((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType=='Group Section')||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType=='District Section')||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Group Lead Volunteer')||((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Team Leader'))&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).Team=='14-24 Team'))&&j==3)) {

                            if (sdate!= new Date("1000-01-01T00:00:01Z")) {
                                td.appendChild(document.createTextNode(days));

                            }
                        }
                    } else {  if (sdate!= new Date("1000-01-01T00:00:01Z")) {
                        td.appendChild(document.createTextNode(days));

                    }}
                    if (( state != 0x0020)&&(document.getElementById("gmcolor").checked)){
                        for(cloop=0;cloop<4;cloop++) {
                            if ((days<=daylimits[cloop])&&(days>daylimits[cloop+1])) {
                                td.style.backgroundColor = colors[cloop];
                                td.style.textColor = colorsT[cloop];
                            }}}
                    tr.appendChild(td);
                }

            }
        }
        if (document.getElementById("gmdbs").checked) {
            if (role_index>=0) {
                rn = roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName;
            } else { rn=mems[mem_index].Role;}
            //    if ((rn=='President')||(rn=='Vice President')||(rn=='Holding')||(rn=='Retired Member')) {
            if (!needs_dbs(rn)) {
                // No DBS Needed
                td = document.createElement('TD');
                tr.appendChild(td);
                td = document.createElement('TD');
                tr.appendChild(td);

            } else {
                var mindex = dbs_detail.findIndex((element)=> element.id == mems[mem_index].id)
                if (mindex>=0) {
                    var time = new Date("1000-01-01T00:00:01Z") ;
                    var timel = new Date("1000-01-01T00:00:01Z") ;
                    var dbs_status = "";
                    if (dbs_detail[mindex].feed.entry != undefined) {
                        if ( dbs_detail[mindex].feed.entry.length != undefined ) {
                            for(var dbsloop=0;dbsloop<dbs_detail[mindex].feed.entry.length;dbsloop++) {
                                sdate = new Date(dbs_detail[mindex].feed.entry[dbsloop].content.m_properties.d_ExpiryDate);
                                if (sdate>time) { time = sdate;}
                                sdate = new Date(dbs_detail[mindex].feed.entry[dbsloop].content.m_properties.d_IssuedDate);
                                if (sdate>timel) { timel = sdate;dbs_status=dbs_detail[mindex].feed.entry[dbsloop].content.m_properties.d_Status; if (dbs_status!="Disclosure issued"){dbs_status+=" "+timel.toLocaleDateString('en-GB')}}
                            }
                        }
                        if (dbs_detail[mindex].feed.entry.length == undefined) {
                            // Single DBS
                            sdate = new Date(dbs_detail[mindex].feed.entry.content.m_properties.d_ExpiryDate);
                            if (sdate>time) { time = sdate;}
                            sdate = new Date(dbs_detail[mindex].feed.entry.content.m_properties.d_DateModified);
                            dbs_status=dbs_detail[mindex].feed.entry.content.m_properties.d_Status;
                            if (dbs_status!="Disclosure issued"){dbs_status+=" "+sdate.toLocaleDateString('en-GB')}
                        }
                    }
                    td = document.createElement('TD');
                    var dbsdatedisp = time.toLocaleDateString('en-GB');
                    if (time<new Date()) {dbsdatedisp=String.fromCodePoint(0x274C)};
                    var expdays  = Math.round((time-new Date()) / (1000 * 60 * 60 * 24));
                    if ((expdays<=90)&&(expdays>0)) {dbsdatedisp+=String.fromCodePoint(0x26A1)}
                    if ((document.getElementById("gmcolor").checked)){
                        for(cloop=0;cloop<4;cloop++) {
                            if ((expdays<=daylimits[cloop])&&(expdays>daylimits[cloop+1])) {
                                td.style.backgroundColor = colors[cloop];
                                td.style.textColor = colorsT[cloop];
                            }}}
                    td.appendChild(document.createTextNode(dbsdatedisp));

                    tr.appendChild(td);
                    td = document.createElement('TD');
                    if ((document.getElementById("gmcolor").checked)){
                        for(cloop=0;cloop<4;cloop++) {
                            if ((expdays<=daylimits[cloop])&&(expdays>daylimits[cloop+1])) {
                                td.style.backgroundColor = colors[cloop];
                                td.style.textColor = colorsT[cloop];
                            }}}
                    if(expdays>0) {
                        td.appendChild(document.createTextNode(expdays));
                    }
                    tr.appendChild(td);
                    if (document.getElementById("gmdbsip").checked){
                        td = document.createElement('TD');
                        td.appendChild(document.createTextNode(dbs_status));
                        tr.appendChild(td);
                    }
                } else {td = document.createElement('TD');td.appendChild(document.createTextNode(String.fromCodePoint(0x274C))); tr.appendChild(td);td = document.createElement('TD');tr.appendChild(td);
                        if (document.getElementById("gmdbsip").checked) { td = document.createElement('TD');tr.appendChild(td); }
                       }
            }
        }
    }


    function report_line_tabulator(role_index,mem_index) {
        var act = ['managerDisclosureCheck','dataProtectionTrainingComplete','signDeclaration','updateMemberProfile','referenceRequest','safeguardconfidentialEnquiryCheck','managerWelcomeConversation','coreLearning','managerTrusteeCheck'];
        var title = ['Role','Unit','Team','Name','Number','Email','Status','Start Date','Days','Disclosure','GDPR','Declaration','Profile','References','CE Check','Welcome','Learning','Trustee'];
        var learn = ['Creating Inclusion','Data Protection in Scouts','Who We Are and What We Do','Safeguarding','Safety','First Response','Delivering a Great Programme','Being a Trustee in Scouts','Leading Scout Volunteers'];
        var titlefieldnames = ['role','unit','team','name','number','email','status','start','days','disclosure','gdpr','declaration','profile','references','ce','welcome','learning','trustee'];
        var learnfieldnames = ['inclusion','datap','who','safeguarding','safety','firstresponse','programme','trustee2','leading'];
        var dbs = ['DBS Expiry','DBS Days','DBS Status'];
        var dbsfieldnames = ['dbs','dbs_expiry','dbs_expirydays','dbsstatus'];
        var line = new Object;

        // Name
        if (role_index>=0) {
            line.role = roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName;
            line.unit = roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitId;
            line.team = roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).Team;
            line.memberURL  = 'https://membership.scouts.org.uk/#/membersearch/'+roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).ContactId+"/viewmember";
        } else
        {
            line.role = mems[mem_index].Role;
            line.unit = mems[mem_index].unitName;
            line.team = mems[mem_index].Team;
            line.memberURL = 'https://membership.scouts.org.uk/#/membersearch/'+mems[mem_index].id+"/viewmember";
        }
        line.name = mems[mem_index].fullname;

        //  var nameid = mems.find((element) => element.id == roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).ContactId).id;
        var nameid = mems[mem_index].id;
        // line.memberURL  = 'https://membership.scouts.org.uk/#/membersearch/'+mems.find((element) => element.id == roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).ContactId).id+"/viewmember";
        //  var memhtml = '<a href="https://membership.scouts.org.uk/#/membersearch/'+nameid+'/viewmember" target="_blank">'+fullname+'</a>';
        //     if (document.getElementById("gmnumber").checked) {
        line.number = mems[mem_index].membershipnumber;
        //   };
        if (role_index>=0) {
            line.status = role_detail[role_index].rolestatus;

            var sdate = new Date(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).StartDate);
            line.start = sdate.toLocaleDateString('en-GB').toString();
            var days  = Math.round((new Date() - sdate) / (1000 * 60 * 60 * 24));
            line.days = days;
            for (var j = 0; j < act.length; j++) {

                if (role_detail[role_index].actions.find((element)=>element.typeid==act[j])) {

                    var state= 0x274C;
                    var value = role_detail[role_index].actions.find((element)=>element.typeid==act[j]).status;
                    if ((value=="Satisfactory")||(value=="Completed")||(value=="Held - Satisfactory")){state= 0x2705;}

                    line[titlefieldnames[j+9]] = String.fromCodePoint(state);

                } else {
                    // Deal with bug in API that means this can be missing.....
                    if(j==3) {
                        state= 0x274C;
                        line[titlefieldnames[j+9]] = String.fromCodePoint(state);
                    } else {
                        line[titlefieldnames[j+9]] = "";
                    }
                }
            }
        } else { }


        // Learning

        if (document.getElementById("gmlearning").checked) {
            for ( j = 0; j < learn.length; j++) {

                state= 0x274C; // Red Cross 10060
                var lr = mem_learning.find((element) => element.id == mems[mem_index].id);
                if (lr.learn.find((object)=>object.title==learn[j])){
                    state= 0x2705; // Green Tick 9989
                }
                // Check Expiry
                var has_expiry = false;
                if (lr.learn.find((object)=>object.title==learn[j])){
                    if (lr.learn.find( (object) => object.title == learn[j]).expiryDate !=null) {
                        sdate = new Date(lr.learn.find((object)=>object.title==learn[j]).expiryDate);
                        days  = Math.round((sdate - new Date()) / (1000 * 60 * 60 * 24));
                        has_expiry = true;
                        if (days<=90) {state = 0x26A1; } // Flash 9889
                        if (days<0) {state = 0x274C;}   // Red Cross 10060
                    } else {days=0;sdate = new Date("1977-01-01T00:00:01Z") ;}
                } else {days=0;sdate = new Date("1977-01-01T00:00:01Z") ;}
                if (role_index>=0) {
                    var role_find = {};
                    role_find = roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId);
                    if (j==7) {
                        // Trustee
                        //       if ((!roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName.includes('Lead Volunteer'))&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName!='Trustee')) {
                        if (!is_trustee(role_find.RoleName)) {
                            if(state==0x2705) {state=0x2714;} // Black Tick
                            else {
                                state = 0x0020;
                            }
                        }
                    }
                    if (j==8) {
                        // Team Lead is_teamleader(rolename,unit_type,ParentTeamId,team_name)
                        //   if ((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName.includes('Lead Volunteer'))||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Team Leader')&&((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='Group Section')&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='District Section'))) {
                        if (is_teamleader(role_find.RoleName,role_find.UnitType,role_find.ParentTeamId,role_find.Team)) {
                        } else {if(state==0x2705) {
                            state=0x2714;}
                                else {
                                    state = 0x0020;
                                }}
                    }

                    if (j==6) {
                        // programme - only section roles
                        //    if ((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='Group Section')&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType!='District Section')) {
                        if (!is_section(role_find.UnitType) )
                            if(state==0x2705) {
                                state=0x2714;}
                            else {
                                state = 0x0020;
                            }
                    }

                    if (j==5) {
                        if ((!has_expiry)&&(state== 0x2705)) { state= 0x274C; } // Set to Expired....
                        // First Response
                        //    if ((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType=='Group Section')||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType=='District Section')||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Group Lead Volunteer')||((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Team Leader'))&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).Team=='14-24 Team')) {
                        if (is_firstresponse(role_find.UnitType,role_find.RoleName,role_find.Team)) {
                        } else { if((!has_expiry)&&(state==0x274C)) {state=0x0020;}
                                if(state==0x2705) { // Green
                                    state=0x2714;} // Black Tick
                                else if (state==0x26A1) {} // Flash
                                else if (state==0x274C) {state=0x2716;} // Cross
                                else {
                                    state = 0x0020;
                                }
                               }
                    }
                    // Check for those not needing training
                    //   var rn = roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName;
                    //   if ((rn=='Non Member - Needs disclosure')||(rn=='President')||(rn=='Vice President')||(rn=='Holding')||(rn=='Retired Member')) {
                    if (!needs_training(role_find.RoleName)) {
                        if ((state == 0x26A1)||(state == 0x2705)||(state == 0x2714)) {
                            state=0x2714;}   // Black Tick
                        else if (state==0x2716) {} // Black Cross
                        else {
                            state = 0x0020;
                        }
                    }

                } else {

                    if ((j==7)&&(mems[mem_index].Role!=null)) {
                        // Trustee
                        if (!is_trustee(mems[mem_index].Role)) {
                            //  if ((!mems[mem_index].Role.includes('Lead Volunteer'))&&(mems[mem_index].RoleName!='Trustee')) {

                            if(state==0x2705) {
                                state=0x2714;}
                            else {
                                state = 0x0020;
                            }
                        }
                    }
                    if ((j==8)&&(mems[mem_index].Role!=null)) {
                        // Team Lead
                        if (is_teamleader(mems[mem_index].Role,mems[mem_index].unittype,null,mems[mem_index].Team)) {

                            //         if ((mems[mem_index].Role.includes('Lead Volunteer'))||(mems[mem_index].Role=='Team Leader')&&((mems[mem_index].unittype!='Group Section')&&(mems[mem_index].unittype!='District Section'))) {

                        } else {if(state==0x2705) {
                            state=0x2714;}
                                else {
                                    state = 0x0020;
                                }}
                    }

                    if (j==6) {
                        // programme - only section roles
                        if (!is_section(mems[mem_index].unittype) ){
                            //       if ((mems[mem_index].unittype!='Group Section')&&(mems[mem_index].unittype!='District Section')) {
                            if(state==0x2705) {
                                state=0x2714;}
                            else {
                                state = 0x0020;
                            }
                        }
                    }
                    if ((j==5)&&(mems[mem_index].Role!=null)) {
                        // First Response
                        //     if ((mems[mem_index].unittype=='Group Section')||(mems[mem_index].unittype=='District Section')||(mems[mem_index].Role=='Group Lead Volunteer')||((mems[mem_index].Role=='Team Leader'))&&(mems[mem_index].Team=='14-24 Team')) {
                        if (is_firstresponse(mems[mem_index].unittype,mems[mem_index].Role,mems[mem_index].Team)) {

                        } else  { if(state==0x2705) { // Green
                            state=0x2714;} // Black Tick
                                 else if (state==0x26A1) {} // Flash
                                 else if (state==0x274C) {state=0x1F7A6;} // Cross
                                 else {
                                     state = 0x0020;
                                 }
                                }
                    }
                    // Check for those not needing training
                    var rn = mems[mem_index].Role;
                    if (rn!=null) {
                        if (!needs_training(mems[mem_index].Role)) {
                            if ((state == 0x26A1)||(state == 0x2705)||(state == 0x2714)) {
                                state=0x2714;}
                            else if (state==0x1F7A6) {}
                            else {
                                state = 0x0020;
                            }
                        }
                    }

                }
                line[learnfieldnames[j]] = String.fromCodePoint(state);

                var blankdate =  new Date("1977-01-01T00:00:01Z");
                if (((j==3)||(j==4)||(j==5))) {

                    if (lr.learn.find( (object) => object.title == learn[j])) {
                        //  if (sdate.getTime()!= blankdate.getTime()) {

                        line[learnfieldnames[j]+'_expiry'] = sdate.toLocaleDateString('en-GB');


                    } else {  line[learnfieldnames[j]+'_expiry'] = ""; }
                } else {

                    line[learnfieldnames[j]+'_expiry'] = "";
                }


                if (((j==3)||(j==4)||(j==5))) {

                    if (!document.getElementById("gmwelcome").checked) {
                        //   if ((j!=5)||(((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType=='Group Section')||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).UnitType=='District Section')||(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Group Lead Volunteer')||((roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName=='Team Leader'))&&(roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).Team=='14-24 Team'))&&j==5)) {

                        //       if (sdate!= new Date("1000-01-01T00:00:01Z")) {
                        if (has_expiry) {
                            line[learnfieldnames[j]+'_expirydays'] = days;

                        } else {  line[learnfieldnames[j]+'_expirydays'] = ""}
                        //    }
                    } else {if (sdate!= new Date("1000-01-01T00:00:01Z")) {
                        line[learnfieldnames[j]+'_expirydays'] = days;

                    }}


                }
            }

        }
        if (document.getElementById("gmdbs").checked) {
            if (role_index>=0) {
                rn = roles.find((element) => element.Id==role_detail[role_index].roleApprovalMemberShipId).RoleName;
            } else { rn=mems[mem_index].Role;}
            if (!needs_dbs(rn)) {
                // No DBS Needed
                line.dbs_expiry = "";
                line.dbs_expirydays = "";
                line.dbsstatus = "";
                line.dbs =" ";

            } else {
                var mindex = dbs_detail.findIndex((element)=> element.id == mems[mem_index].id)
                if (mindex>=0) {
                    var time = new Date("1000-01-01T00:00:01Z") ;
                    var timel = new Date("1000-01-01T00:00:01Z") ;
                    var dbs_status = "";
                    if (dbs_detail[mindex].feed.entry != undefined) {
                        if ( dbs_detail[mindex].feed.entry.length != undefined ) {
                            for(var dbsloop=0;dbsloop<dbs_detail[mindex].feed.entry.length;dbsloop++) {
                                sdate = new Date(dbs_detail[mindex].feed.entry[dbsloop].content.m_properties.d_ExpiryDate);
                                if (sdate>time) { time = sdate;}
                                sdate = new Date(dbs_detail[mindex].feed.entry[dbsloop].content.m_properties.d_IssuedDate);
                                if (sdate>timel) { timel = sdate;dbs_status=dbs_detail[mindex].feed.entry[dbsloop].content.m_properties.d_Status; if (dbs_status!="Disclosure issued"){dbs_status+=" "+timel.toLocaleDateString('en-GB')}}
                            }
                        }
                        if (dbs_detail[mindex].feed.entry.length == undefined) {
                            // Single DBS
                            sdate = new Date(dbs_detail[mindex].feed.entry.content.m_properties.d_ExpiryDate);
                            if (sdate>time) { time = sdate;}
                            sdate = new Date(dbs_detail[mindex].feed.entry.content.m_properties.d_DateModified);
                            dbs_status=dbs_detail[mindex].feed.entry.content.m_properties.d_Status;
                            if (dbs_status!="Disclosure issued"){dbs_status+=" "+sdate.toLocaleDateString('en-GB')}
                        }
                    }
                    line.dbs = "";
                    var dbsdatedisp = time.toLocaleDateString('en-GB');
                    if (time<new Date()) {dbsdatedisp=String.fromCodePoint(0x274C)};
                    var expdays  = Math.round((time-new Date()) / (1000 * 60 * 60 * 24));
                    if ((expdays<=90)&&(expdays>0)) {
                      //  dbsdatedisp+=String.fromCodePoint(0x26A1);
                        line.dbs = String.fromCodePoint(0x26A1);
                    }

                    line.dbs_expiry =dbsdatedisp;

                    line.dbsstatus = "";
                    if (expdays<0) {  line.dbs = String.fromCodePoint(0x274C); };
                    if (expdays>90) {  line.dbs = String.fromCodePoint(0x2705); };
                    line.dbsstatus = dbs_status;
                    line.dbs_expirydays = expdays;

                } else {
                    line.dbsexpiry = String.fromCodePoint(0x274C);
                    line.dbs = String.fromCodePoint(0x274C);
                    line.dbsexpirydays = "";
                    line.dbsstatus= "";
                }
            }
        }

        return line;
    }







    function report_filter(e) {
        if (!document.getElementById("gmnumber").checked) { tabletabulator.hideColumn("number") } else { tabletabulator.showColumn("number") }
        if (!document.getElementById("gmdates").checked) { tabletabulator.hideColumn("safeguarding_expiry");tabletabulator.hideColumn("firstresponse_expiry");tabletabulator.hideColumn("safety_expiry") } else
        { tabletabulator.showColumn("safeguarding_expiry");tabletabulator.showColumn("firstresponse_expiry");tabletabulator.showColumn("safety_expiry") }
        if (!document.getElementById("gmdays").checked) { tabletabulator.hideColumn("safeguarding_expirydays");tabletabulator.hideColumn("firstresponse_expirydays");tabletabulator.hideColumn("safety_expirydays") } else
        { tabletabulator.showColumn("safeguarding_expirydays");tabletabulator.showColumn("firstresponse_expirydays");tabletabulator.showColumn("safety_expirydays") }
        if (!document.getElementById("gmdbsip").checked) { tabletabulator.hideColumn("dbsstatus") } else  { tabletabulator.showColumn("dbsstatus") }

        var titlefieldnames = ['disclosure','gdpr','declaration','profile','references','ce','welcome','learning','trustee'];
        if (document.getElementById("gmwelcome").checked) {
            for(var i=0; i<titlefieldnames.length;i++) {
                tabletabulator.hideColumn(titlefieldnames[i]) }

        }
        else {
            for( i=0; i<titlefieldnames.length;i++) {
                //tabletabulator.showColumn(titlefieldnames[i])
                if(i!=1) {tabletabulator.showColumn(titlefieldnames[i]) }
            }
        }

        var learnfieldnames = ['inclusion','datap','who','safeguarding','safety','firstresponse','programme','trustee2','leading'];
        if (!document.getElementById("gmlearning").checked) {
            for(i=0; i<learnfieldnames.length;i++) {
                tabletabulator.hideColumn(learnfieldnames[i])
                if ((i>=3)&&(i<=5)) {
                    tabletabulator.hideColumn(learnfieldnames[i]+"_expiry")
                    tabletabulator.hideColumn(learnfieldnames[i]+"_expirydays")
                }
            }
        } else {
            for( i=0; i<learnfieldnames.length;i++) {
                tabletabulator.showColumn(learnfieldnames[i])
                if ((i>=3)&&(i<=5)) {
                    tabletabulator.showColumn(learnfieldnames[i]+"_expiry")
                    tabletabulator.showColumn(learnfieldnames[i]+"_expirydays")
                }
            }
        }
        var dbsfieldnames = ['dbs','dbs_expiry','dbs_expirydays','dbsstatus'];
        if (!document.getElementById("gmdbs").checked) {
            for(i=0; i<dbsfieldnames.length;i++) {
                tabletabulator.hideColumn(dbsfieldnames[i])
            }
        } else {
            for(i=0; i<dbsfieldnames.length;i++) {
                tabletabulator.showColumn(dbsfieldnames[i])
            }
        }

        if (!document.getElementById("gmdates").checked) { tabletabulator.hideColumn("safeguarding_expiry");tabletabulator.hideColumn("firstresponse_expiry");tabletabulator.hideColumn("safety_expiry") } else
        { tabletabulator.showColumn("safeguarding_expiry");tabletabulator.showColumn("firstresponse_expiry");tabletabulator.showColumn("safety_expiry") }
        if (!document.getElementById("gmdays").checked) { tabletabulator.hideColumn("safeguarding_expirydays");tabletabulator.hideColumn("firstresponse_expirydays");tabletabulator.hideColumn("safety_expirydays") } else
        { tabletabulator.showColumn("safeguarding_expirydays");tabletabulator.showColumn("firstresponse_expirydays");tabletabulator.showColumn("safety_expirydays") }
        if (!document.getElementById("gmdbsip").checked) { tabletabulator.hideColumn("dbsstatus") } else  { tabletabulator.showColumn("dbsstatus") }
        tabletabulator.clearFilter(true);
        var tabfilters = [];
          if (document.getElementById("gmhelper").checked) {
              tabfilters.push({field : "role",type: "!=", value: 'Non Member - Needs disclosure'});
               tabfilters.push({field : "role",type: "!=", value: 'Holding'});
          }
        tabfilters.push({field : "name",type: "like", value: concatenate_name()});
        tabfilters.push( {field: "team", type: "like", value: document.getElementById("gmteamname").value});
         if (document.getElementById("gmmissing").checked) {
            tabfilters.push({field : "status",type: "keywords", value: 'Provisional'});
        }
        tabletabulator.setFilter(tabfilters);


        tabletabulator.redraw(true);
    }




    function report_filter2() {


        var expirytext = "Expiry";
        var expirytextdays = "Expiry Days";
        var act = ['managerDisclosureCheck','dataProtectionTrainingComplete','signDeclaration','updateMemberProfile','referenceRequest','safeguardconfidentialEnquiryCheck','managerWelcomeConversation','coreLearning','managerTrusteeCheck'];
        var title = ['Role','Unit','Team','Name','Status','Start Date','Days','Disclosure','GDPR','Declaration','Profile','References','CE Check','Welcome','Learning','Trustee'];
        var learn = ['Creating Inclusion','Data Protection in Scouts','Who We Are and What We Do','Safeguarding','Safety','First Response','Delivering a Great Programme','Being a Trustee in Scouts','Leading Scout Volunteers'];
        $("#gmState")[0].innerText = "Data Collection Completed";
        var myTableDiv = document.getElementById("gmTable");
        var table = document.createElement('TABLE');
        table.border = '1';
        table.id = "GMourreport";
        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        report_headers(tableBody);

        if (!(document.getElementById("gmwelcome").checked)) {
            for (i = 0; i < role_detail.length; i++) {
                var displine=true;

                if (document.getElementById("gmmissing").checked) {
                    var any_missing = false;
                    for (var j = 0; j < act.length; j++) {
                        if (role_detail[i].actions.find((element)=>element.typeid==act[j])) {
                            var value = role_detail[i].actions.find((element)=>element.typeid==act[j]).status;
                            if ((value!="Satisfactory")&&(value!="Completed")&&(value!="Held - Satisfactory")){ any_missing=true;}
                        }
                    }
                    if (any_missing==false) {displine=false}
                }
                //
                if (document.getElementById("gmteamonly").checked) {
                    var  filter = document.getElementById("gmunitname").value.replaceAll("%", "*");
                    let w = filter.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
                    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
                    if(!re.test(roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).UnitId)){displine=false}
                }

                if (mems.find((element) => element.id == roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).ContactId)!=undefined){

                    var fullname = mems.find((element) => element.id == roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).ContactId).fullname;
                    if (document.getElementById("gmpersonname").value!="") {
                    //    if(!fullname.toLowerCase().includes(document.getElementById("gmpersonname").value.toLowerCase())){displine=false}
                            if(!fullname.toLowerCase().includes(concatenate_name)){displine=false}
                    }
                } else {displine=false;}

                if (document.getElementById("gmteamname").value!="") {
                    if (!roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).Team.toLowerCase().includes(document.getElementById("gmteamname").value.toLowerCase())){displine=false}
                }

                if (document.getElementById("gmhelper").checked) {
                    var rolename = roles.find((element) => element.Id==role_detail[i].roleApprovalMemberShipId).RoleName;
                    if (rolename.includes("Non Member - Needs disclosure")) {displine=false;}
                    if (rolename.includes("Holding")) {displine=false;}
                }
                if (displine) {
                    output_report_line(tableBody,i,mems.findIndex( (element) => element.id == roles.find( (element) => element.Id == role_detail[i].roleApprovalMemberShipId).ContactId));

                }
            }
        }
        else
        {
            for (var i = 0; i < mems.length; i++) {
                displine = true;
                fullname = mems[i].fullname;
                if (document.getElementById("gmpersonname").value!="") {
                    if(!fullname.toLowerCase().includes(concatenate_name)){displine=false}
                }
                if (mems[i].Role==null) { displine=false}
                if (displine) {
                    output_report_line(tableBody,-1,i);
                }
            }
        }
        table.style.fontSize = "10pt";
        document.getElementById("gmTable").innerHTML="";
        myTableDiv.appendChild(table);


        //var tf = new TableFilter('GMourreport',filtersConfig );
        //t
    }

  // var level_de = "e5b6ecb0-0360-9cde-f269-7660a2afb0fb";
  //  var level_de = "89d2f00e-6d57-8032-be02-47393fcf0556";
    var level_de="";
    var learning_json = {};
    var welcome = {};
     var role_detailu;
    var xml = 0;

    function get_dedata7alt(index) {
            if (debug) { do_debug("Report 7 Alt: DBS requested for "+index+" "+role_detailu.data[index].Firstname);}
                //  console.log(roles[loop].EndDate);
                $("#gmState")[0].innerText = "Disclosure "+index+" of "+role_detailu.data.length+" (Check)";
                GM_xmlhttpRequest({
                    method: "POST",
                    context: index+1,
                    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/GenerateSASTokenAsync",
                    data: '{"table": "Disclosures", "permissions": "R", "partitionkey" : "'+role_detailu.data[index].Id+'"}',
                    synchronous:    true,
                    headers: {
                        "Content-Type": "application/json;",
                        "Type" : "table",
                        "accept-language" : "en-GB,en;q=0.9",
                        "sec-fetch-site" : "cross-site",
                        "Origin" : "https://membership.scouts.org.uk",
                        "content-encoding" : "gzip",
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                        "Accept": "application/json, text/plain, */*"
                    },
                    onload: function(response) {
                        var xmlURL = "";
                        if (debug) { do_debug("Report 7 Alt: DBS Blob URL Received for "+(response.context-1)+" "+role_detailu.data[response.context-1].Firstname);}
                        try { xmlURL =  JSON.parse(response.responseText) } catch {console.log(response.responseText)};
                        if (xmlURL=="") { if (debug) { do_debug2("Report 7 Alt: DBS Blob URL JSON Error " +response.responseText);} }
                        if (xmlURL!="") {
                           // $("#gmState")[0].innerText = "Fetching DBS "+response.context+" of "+role_detailu.data.length;
                              $("#gmState")[0].innerText = "Disclosure "+response.context+" of "+role_detailu.data.length+" (Fetch)";
                            GM_xmlhttpRequest({
                                method: "GET",
                                context: response.context,
                                 headers: {                            "Accept": "application/json",
                        "Content-Type": "application/json;odata=minimalmetadata"},
                                url: JSON.parse(response.responseText).token,
                                onload: function(response) {
                                    if (debug) { do_debug("Report 7 Alt: DBS received for "+(response.context-1)+" "+role_detailu.data[response.context-1].Firstname);}
                                    if (response.status!=200) { do_debug2("HTTP error "+response.status);  do_debug(JSON.stringify(response));}
                                    //$("#gmState")[0].innerText = "Checking DBS "+response.context;
                                    $("#gmState")[0].innerText = "Disclosure "+response.context+" of "+role_detailu.data.length+" (Check)";

                                    try {
                                      var dbs_option = JSON.parse(response.responseText);
                                       dbs_option.id = role_detailu.data[response.context-1].Id;
                                    dbs_detail.push(dbs_option);
                                      do_debug("DBS Data "+dbs_detail.length+" XML "+xml);
                                    } catch {xml++}
                                    if ((response.context)<role_detailu.data.length){get_dedata7alt(response.context)}else{get_dedata6()}},
                                onerror:   function(response) {  do_debug2("ON Error"); do_debug2(JSON.stringify(response));get_dedata7alt(response.context)},
                                onabort:  function(response) {  do_debug2("ON Abort"); do_debug2(JSON.stringify(response));get_dedata7alt(response.context)}

                            }) } else {xml++;do_debug("DBS Data "+dbs_detail.length);  if (  (response.context)<role_detailu.data.length){get_dedata7alt(response.context)}else{console.log(dbs_detail); get_dedata6()}}

                    }
                });

    }
    function get_dedata7() {
        var xmlURL ="";
        xml = 0; var nullc=0;
        var role_unique = [];
          role_unique = role_detail.data.filter(element => {
          const isDuplicate = role_unique.includes(element.Id);

          if (!isDuplicate) {
            role_unique.push(element.Id);

         return true;
        }

  return false;
});
      role_detailu = {data: []};
      for (var loopu=0;loopu<role_unique.length;loopu++) {
          if(role_detail.data.find(e=>e.Id==role_unique[loopu].Id).membershipid!="") {
          role_detailu.data.push(role_detail.data.find(e=>e.Id==role_unique[loopu].Id))
          }
      }
        if (document.getElementById("gmdbs").checked) {
          if (!document.getElementById("gmdbsalt").checked) {
            for(var loop=0;loop<role_detailu.data.length;loop++) {
                if (debug) { do_debug("Report 6: DBS requested for "+loop+" "+role_detailu.data[loop].Firstname);}
                //  console.log(roles[loop].EndDate);
                $("#gmState")[0].innerText = "Checking Disclosure "+loop+" of "+role_detailu.data.length;
                GM_xmlhttpRequest({
                    method: "POST",
                    context: loop+1,
                    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/GenerateSASTokenAsync",
                    data: '{"table": "Disclosures", "permissions": "R", "partitionkey" : "'+role_detailu.data[loop].Id+'"}',
                    synchronous:    true,
                    headers: {
                        "Content-Type": "application/json;",
                        "Type" : "table",
                        "accept-language" : "en-GB,en;q=0.9",
                        "sec-fetch-site" : "cross-site",
                        "Origin" : "https://membership.scouts.org.uk",
                        "content-encoding" : "gzip",
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                        "Accept": "application/json, text/plain, */*"
                    },
                    onload: function(response) {
                        xmlURL = "";
                        if (debug) { do_debug("Report 6: DBS Blob URL Received for "+(response.context-1)+" "+role_detailu.data[response.context-1].Firstname);}
                        try { xmlURL =  JSON.parse(response.responseText) } catch {console.log(response.responseText)};
                        if (xmlURL=="") { if (debug) { do_debug2("Report 6: DBS Blob URL JSON Error " +response.responseText);} }
                        if (xmlURL!="") {
                            $("#gmState")[0].innerText = "Fetching DBS "+response.context+" of "+role_detailu.data.length;
                            GM_xmlhttpRequest({
                                method: "GET",
                                context: response.context,
                                 headers: {                            "Accept": "application/json",
                        "Content-Type": "application/json;odata=minimalmetadata"},
                                url: JSON.parse(response.responseText).token,
                                onload: function(response) {
                                    if (debug) { do_debug("Report 6: DBS received for "+(response.context-1)+" "+role_detailu.data[response.context-1].Firstname);}
                                    if (response.status!=200) { do_debug2("HTTP error "+response.status);  do_debug(JSON.stringify(response));}
                                    $("#gmState")[0].innerText = "Checking DBS "+response.context;

                                    try {
                                      var dbs_option = JSON.parse(response.responseText);
                                       dbs_option.id = role_detailu.data[response.context-1].Id;
                                    dbs_detail.push(dbs_option);
                                      do_debug("DBS Data "+dbs_detail.length+" XML "+xml);
                                    } catch {xml++}
                                    if (dbs_detail.length+xml>=role_detailu.data.length){console.log(dbs_detail); get_dedata6()}},
                                onerror:   function(response) {  do_debug2("ON Error"); do_debug2(JSON.stringify(response))},
                                onabort:  function(response) {  do_debug2("ON Abort"); do_debug2(JSON.stringify(response))}

                            }) } else {xml++;do_debug("DBS Data "+dbs_detail.length);  if (  dbs_detail.length+xml>=role_detailu.data.length){console.log(dbs_detail); get_dedata6()}}

                    }
                });

            }
        }  else {get_dedata7alt(0)}
        } else {get_dedata6()}

    }


   function get_dedata6() {
       do_debug("DBS Data "+dbs_detail.length);
        $("#gmState")[0].innerHTML = "Data Collection Complete";
    /*   console.log("Mems "+mems.length);
       console.log(mems);
         console.log("Role Detail "+role_detail.data.length);
       console.log(role_detail);
          console.log("Role "+roles.data.length);
       console.log(roles);
         console.log("Learn ");
       console.log(learning_json);
         console.log("Welcome "+welcome.data.length);
       console.log(welcome);*/
       var tablines = [];
      
       var act = ['managerDisclosureCheck','dataProtectionTrainingComplete','signDeclaration','updateMemberProfile','referenceRequest','safeguardconfidentialEnquiryCheck','managerWelcomeConversation','coreLearning','managerTrusteeCheck'];
        var title = ['Name','Role','Unit','Team','Number','Email','Status','Start Date','Days','Disclosure','GDPR','Declaration','Profile','References','CE Check','Welcome','Growing Roots Learning','Trustee Check'];
        var learn = ['Creating Inclusion','Data Protection in Scouts','Who We Are and What We Do','Safeguarding','Safety','First Response','Delivering a Great Programme','Being a Trustee in Scouts','Leading Scout Volunteers'];
        var learn2 = ['Creating Inclusion','GDPR - General Data Protection Regulations','Who We Are and What We Do','Safeguarding','Safety','First Response','Delivering a great programme','Being a Trustee in Scouts','Leading Scout Volunteers'];
        var titlefieldnames = ['name','role','unit','team','number','email','status','start','days','disclosure','gdpr','declaration','profile','references','ce','welcome','learning','trustee'];
        var learnfieldnames = ['inclusion','datap','who','safeguarding','safety','firstresponse','programme','trustee2','leading'];
        var dbs = ['DBS','DBS Expiry','DBS Days','DBS Status'];
        var dbsfieldnames = ['dbs','dbs_expiry','dbs_expirydays','dbsstatus'];
         for (var i=0;i<role_detail.data.length;i++) {
              var r = welcome.data.find(e=>e['First name'].trim()==role_detail.data[i].PreferredName.trim() && e['Last name'].trim()==role_detail.data[i].Lastname.trim()&&e['Role']==role_detail.data[i].Role&&e['Team ID']==role_detail.data[i].TeamId&&e['Unit name']==role_detail.data[i].UnitName)
         // r = roles.data.find(e=> e["First name"]+" "+e["SurnamLast name"]==role_detail.data[i].FullName&e["Role"]==role_detail.data[i].Role&&e["Unit Name"]==role_detail.data[i].UnitName);
          if (r == undefined)  {
                 r = welcome.data.find(e=>e['First name'].trim()==role_detail.data[i].Firstname.trim() && e['Last name'].trim()==role_detail.data[i].Lastname.trim()&&e['Role']==role_detail.data[i].Role&&e['Team ID']==role_detail.data[i].TeamId&&e['Unit name']==role_detail.data[i].UnitName)

          }
         // console.log(role_detail.data[i].FullName);
          if (r == undefined) { do_debug2("No welcome found for "+role_detail.data[i].FullName)} else {
         role_detail.data[i].membershipid = r["Membership number"];
         role_detail.data[i].teamname = r["Team"];
    //     if (role_detail.data[i].TeamId == "c30f4d78-a1f8-ed11-8f6d-6045bdd0ed08") { role_detail.data[i].teamname = "Leadership Team"}
      //   role_detail.data[i].startdate = r["StartDate"];
         role_detail.data[i].email = r["Communication email"];
        if (debug) { do_debug(i+" "+r["MembershipNumber"]+" "+r["First name"]+" "+r["name"]+" "+role_detail.data[i].FullName+" "+role_detail.data[i].UnitName+" "+role_detail.data[i].teamname+" "+role_detail.data[i].Role); }

           r = roles.data.find(e=> e["Membership number"]==role_detail.data[i].membershipid&&e["Role"]==role_detail.data[i].Role&&e["Unit name"]==role_detail.data[i].UnitName&&e["Team"]==role_detail.data[i].teamname);

              if(r!=undefined) {
              role_detail.data[i].startdate = r["Start date"];
          } else {if (debug) {do_debug("No Start Date can be Found "+role_detail.data[i].membershipid);}}

     }
         }
       for ( i=0;i<role_detail.data.length;i++) {
                   if (debug) { do_debug(i+" "+ role_detail.data[i].membershipid+" "+role_detail.data[i].FullName+" "+role_detail.data[i].UnitName+" "+role_detail.data[i].teamname+" "+role_detail.data[i].Role); }
 if (debug) { do_debug(i+" "+ role_detail.data[i].unitid+" "+role_detail.data[i].UnitName+" "+role_detail.data[i].teamname+" "+role_detail.data[i].TeamId+" "+role_detail.data[i].Role); }
           if (((document.getElementById("gmpersonnamef").value=="")&&(document.getElementById("gmpersonnamel").value==""))||((role_detail.data[i].FullName.toLowerCase().includes(document.getElementById("gmpersonnamel").value.toLowerCase()))&&(role_detail.data[i].FullName.toLowerCase().includes(document.getElementById("gmpersonnamef").value.toLowerCase())))){
           if (role_detail.data[i].membershipid!=undefined) {
               var line={};
           line.name = role_detail.data[i].FullName;
           line.role = role_detail.data[i].Role;
           line.unit = role_detail.data[i].UnitName;
           line.team = role_detail.data[i].teamname;
           line.number = role_detail.data[i].membershipid;
           line.status = role_detail.data[i].RoleStatusName;
           if ( line.status==null) { line.status = '-' }
           line.email = role_detail.data[i].email;
           line.memberURL = 'https://membership.scouts.org.uk/#/membersearch/'+role_detail.data[i].Id+"/viewmember";
           if (role_detail.data[i].hasOwnProperty("startdate")) {
           var myDate = new Date( Date.parse(role_detail.data[i].startdate));
             line.start = myDate.toLocaleDateString('en-GB');
           line.days = Math.round((new Date() - myDate) / (1000 * 60 * 60 * 24));
           } else {
              line.start = "-"; line.days = "-"
           }
         //  line.days = 0;
           var state = 0x0000;
           //<div id="gmTabulator2"><p>Key: ✅ Required and complete ❌ Required ⚡Complete but near expiry ✔ Not required but complete ✖ Not required but expired </p></div> \
           for(var j=0;j<act.length;j++){
         //      var w = welcome.data.find(e=>e.MembershipNumber == role_detail.data[i].membershipid && e.CategoryKey == act[j]);
               var w = welcome.data.find(e=>e['Membership number']==role_detail.data[i].membershipid&&e['Role']==role_detail.data[i].Role&&e['Team ID']==role_detail.data[i].TeamId&& e['Category key'] == act[j]&&e['Unit name']==role_detail.data[i].UnitName&&e.Status=="Completed")
              if(w==null){
               w = welcome.data.find(e=>e['Membership number']==role_detail.data[i].membershipid&&e['Role']==role_detail.data[i].Role&&e['Team ID']==role_detail.data[i].TeamId&& e['Category key'] == act[j]&&e['Unit name']==role_detail.data[i].UnitName)
              }
               if (w!=null) {
                   if (w.Status=="Completed") {
                   line[titlefieldnames[9+j]] = "✅";
                   state = 0x2705;
                   }
                   if (w.Status!="Completed") {
                   line[titlefieldnames[9+j]] = "❌"
                      state = 0x274C;
                   }
                   if (role_detail.data[i].RoleStatusName!="Full") {
                       // DE sometimes seems to send us two rows with a different status - DE assumes if the role is full then status doesn't matter so we will do the same
                       w = welcome.data.find(e=>e['Membership number']==role_detail.data[i].membershipid&&e['Role']==role_detail.data[i].Role&&e['Team ID']==role_detail.data[i].TeamId&& e.CategoryKey == act[j]&&e['Unit name']==role_detail.data[i].UnitName&&e.Status=="New")
                       if (w!=null) {
                           line[titlefieldnames[9+j]] = "❌"
                           state = 0x274C;
                       }
                   }
                   if (role_detail.data[i].RoleStatusName=="Full") {
                       // DE sometimes seems to send us two rows with a different status - DE assumes if the role is full then status doesn't matter so we will do the same
                       line[titlefieldnames[9+j]] = "✅";
                       state = 0x2705;

                   }
               } else { line[titlefieldnames[9+j]] ="";}
           }
           if(learning_json.hasOwnProperty("rows")) {
           for(j=0;j<learn2.length;j++) {
               var l = null;
               if (learning_json.rows.hasOwnProperty("row")) {
                   l = learning_json.rows.row.find(e=>e.cells.cell[2].value==role_detail.data[i].membershipid && e.cells.cell[6].value==learn[j]);
               }
               var ol=null;
               if ((l==null)&&(mem_learning[0].id==role_detail.data[i].Id)) {
                  ol = mem_learning[0].learn.find(e=>e.title==learn[j]);
               }
               state= 0x274C; // Red Cross
               var days = 0;
               if (l!=null) {
                  // line[learnfieldnames[j]] = "✅";
                   state = 0x2705; // Green Tick
                   if (l.cells.cell[7].value!="Skill does not expire") {
                        myDate = new Date( Date.parse(l.cells.cell[8].value));
                        line[learnfieldnames[j]+"_expiry"] = myDate.toLocaleDateString('en-GB');
                        days = Math.round((myDate - new Date() ) / (1000 * 60 * 60 * 24));
                        line[learnfieldnames[j]+"_expirydays"] = Math.round((myDate - new Date() ) / (1000 * 60 * 60 * 24));
                        if (days<=90) {state = 0x26A1; } // Flash 9889
                        if (days<0) {state = 0x274C;} // Red Cross
                   }
               }
                if (ol!=null) {
                  // line[learnfieldnames[j]] = "✅";
                   state = 0x2705; // Green Tick
                   if (ol.expiryDate!=null) {
                        myDate = new Date( Date.parse(ol.expiryDate));
                        line[learnfieldnames[j]+"_expiry"] = myDate.toLocaleDateString('en-GB');
                        days = Math.round((myDate - new Date() ) / (1000 * 60 * 60 * 24));
                        line[learnfieldnames[j]+"_expirydays"] = Math.round((myDate - new Date() ) / (1000 * 60 * 60 * 24));
                        if (days<=90) {state = 0x26A1; } // Flash 9889
                        if (days<0) {state = 0x274C;} // Red Cross
                   }

               }
               if (j==7) { // Trustee Training
                    if (!is_trustee(line.role)) {
                            if(state==0x2705) {state=0x2714;} // Black Tick
                            else {
                                state = 0x0020;
                            }
                        }

               }
               if (j==8) { // Leading Training
                   if (is_teamleader(line.role,role_detail.data[i].unitTypeId,role_detail.data[i].ParentTeamId,line.team)) {
                        } else {if(state==0x2705) {
                            state=0x2714;}
                                else {
                                    state = 0x0020;
                                }}

               }
               if (j==6) {                         // programme - only section roles
                     if (!is_section(role_detail.data[i].unitTypeId) ){
                            if(state==0x2705) {
                                state=0x2714;}
                            else {
                                state = 0x0020;
                            }
                     }

               }
                if (j==5) {  // First reponse

                        //   if ((!has_expiry)&&(state== 0x2705)) { state= 0x274C; } // Set to Expired....
                        // First Response
                        if (is_firstresponse(role_detail.data[i].unitTypeId,line.role,line.team)) {
                        } else {
                                if(state==0x2705) { // Green
                                    state=0x2714;} // Black Tick
                                else if (state==0x26A1) {} // Flash
                                else if (state==0x274C) {
                                    if (l!=null) { //Learning has been found
                                    state=0x2716;
                                    } else {
                                    state=0x0020;
                                    }
                                } // Cross
                                else {
                                    state = 0x0020;
                                }
                               }

                }
                  if (!needs_training(line.role)) {
                        if ((state == 0x26A1)||(state == 0x2705)||(state == 0x2714)) {
                            state=0x2714;}   // Black Tick
                        else if (state==0x2716) {} // Black Cross
                        else {
                             if (l!=null) { //Learning has been found
                                    state=0x2716;
                                    } else {
                                    state=0x0020;
                                    }

                //            state = 0x0020;
                        }
                  }
                  line[learnfieldnames[j]] = String.fromCodePoint(state);

             } // learning
           }else {if(document.getElementById("gmlearning").checked){$("#gmState")[0].innerText = "!!!!! Make sure you are logged into Learn.scouts.org.uk!!!!!";}}
            if (document.getElementById("gmdbs").checked) {
              if (!needs_dbs(line.role)) {
                  line.dbs_expiry = "";
                line.dbs_expirydays = "";
                line.dbsstatus = "";
                line.dbs =" ";
              } else {

                 var mindex = dbs_detail.findIndex((element)=> element.id == role_detail.data[i].Id)
                  if (mindex>=0) {
                      var time = new Date("1000-01-01T00:00:01Z") ;
                      var timel = new Date("1000-01-01T00:00:01Z") ;
                      var dbs_status = "";


                            for(var dbsloop=0;dbsloop<dbs_detail[mindex].value.length;dbsloop++) {
                          var       sdate = new Date(dbs_detail[mindex].value[dbsloop].ExpiryDate);
                                if (sdate>time) { time = sdate;}
                                sdate = new Date(dbs_detail[mindex].value[dbsloop].IssuedDate);
                                if (sdate>timel) { timel = sdate;dbs_status=dbs_detail[mindex].value[dbsloop].Status;
                                if (dbs_status!="Disclosure issued"){dbs_status+=" "+timel.toLocaleDateString('en-GB')}}
                                if ((dbs_detail[mindex].value[dbsloop].ExpiryDate=="")&&(!dbs_detail[mindex].value[dbsloop].hasOwnProperty("IssuedDate"))){
                                    sdate = new Date(dbs_detail[mindex].value[dbsloop].DateModified);
                                    dbs_status = dbs_detail[mindex].value[dbsloop].Status+" "+sdate.toLocaleDateString('en-GB');
                                }
                            }


                            // Single DBS
                      //      sdate = new Date(dbs_detail[mindex].feed.entry.content.m_properties.d_ExpiryDate);
                      //      if (sdate>time) { time = sdate;}
                      //      sdate = new Date(dbs_detail[mindex].feed.entry.content.m_properties.d_DateModified);
                      //      dbs_status=dbs_detail[mindex].feed.entry.content.m_properties.d_Status;
                      //      if (dbs_status!="Disclosure issued"){dbs_status+=" "+sdate.toLocaleDateString('en-GB')}


                    line.dbs = "";
                    var dbsdatedisp = time.toLocaleDateString('en-GB');
                    if (time<new Date()) {dbsdatedisp=String.fromCodePoint(0x274C)};
                    var expdays  = Math.round((time-new Date()) / (1000 * 60 * 60 * 24));
                    if ((expdays<=90)&&(expdays>0)) {
                      //  dbsdatedisp+=String.fromCodePoint(0x26A1);
                        line.dbs = String.fromCodePoint(0x26A1);
                    }

                    line.dbs_expiry =dbsdatedisp;

                    line.dbsstatus = "";
                    if (expdays<0) {  line.dbs = String.fromCodePoint(0x274C); };
                    if (expdays>90) {  line.dbs = String.fromCodePoint(0x2705); };
                    line.dbsstatus = dbs_status;
                    if (expdays>-300000) {
                    line.dbs_expirydays = expdays;
                    }


                  } else {
                    line.dbsexpiry = String.fromCodePoint(0x274C);
                    line.dbs = String.fromCodePoint(0x274C);
                    line.dbsexpirydays = "";
                    line.dbsstatus= "";
                  }

               }
           }
           tablines.push(line);
           } else {console.log("No Membership NUmber");}
           }
       }

       console.log(tablines);
       console.log("Headers");
       console.log(report_headers_tabulator());
             do_debug("Do Grid");
    //   if (document.getElementById("gmtablines").checked) {
    //     for(var tl=0;tl<tablines.length;tl++) {
    //
    //     }
    //   }
       if (tabletabulator==null) {
       tabletabulator = new Tabulator("#gmTabulator",{
                        data: tablines,
                     //    debugEventsExternal:debug,
                     //       debugEventsInternal:debug, //console log internal events

                        printAsHtml: true,
                        columnHeaderVertAlign: "bottom",
                        maxHeight: "100%",
                        columns: report_headers_tabulator(),
                        movableColumns: true,
                        dependencies: {
                            DateTime: luxon.DateTime,
                        },
                        downloadEncoder: function(fileContents, mimeType) {
                            var b = new Blob([fileContents],{
                                type: mimeType
                            });
                            var url = URL.createObjectURL(b);
                            url = window.URL.createObjectURL(b);
                            var filename = 'myBlobFile.xlsx';

                            var a = document.createElement('a');
                            a.style = 'display: none';
                            a.href = url;
                            a.download = filename;

                            // IE 11
                            if (window.navigator.msSaveBlob !== undefined) {
                                window.navigator.msSaveBlob(b, filename);
                                return;
                            }
                            document.body.appendChild(a);
                            var e = new MouseEvent("click");
                            a.dispatchEvent(e);
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                            // });
                        }
                    });
            tabletabulator.on("tableBuilt", function(){
                do_debug("Table Built and Displayed");
              //  do_debug(tabletabulator.getHtml());
            });

        console.log(tabletabulator);
       } else {
            do_debug("Clear Table and repopulate with "+tablines.length+" rows of data");
           tabletabulator.clearData();
           tabletabulator.replaceData(tablines);


       }
    //    tabletabulator.redraw(true);

   }

   function get_dedata6a() {
       // My Learning as learning system doesn't give it....
       // My ID JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.extension_ContactId
         $("#gmState")[0].innerText = "Request Learning for logged on user";
          do_debug("Get Learning Summary for user "+JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.extension_ContactId);
          GM_xmlhttpRequest({
                method: "POST",

                url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/GetLmsDetailsAsync",
                data: '{"contactId": "'+JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.extension_ContactId+'"}',
                context:  1,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                    "Accept": "application/json, text/plain, */*"
                },
                onload: function(response) {
                     $("#gmState")[0].innerText = "Processing Learning for logged on user";
                    if (debug) { do_debug("Report 5: Learning received for "+(response.context-1));}
                    var l = new Object;
                    l.id = JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.extension_ContactId;
                    l.learn = [];
                    try { l.learn=JSON.parse(response.responseText)} catch {console.log("JSON Error "+response.responseText);}
                    mem_learning[0] = l;
                       do_debug("Learning for user read successfully "+JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.extension_ContactId);
                    // console.log(JSON.parse(response.responseText));
                    get_dedata7() },
                onerror:   function(response) {  do_debug2("ON Error"); do_debug2(JSON.stringify(response))},
                onabort:  function(response) {  do_debug2("ON Abort"); do_debug2(JSON.stringify(response))}
            });


   }

    var training_ids = ["152688","116405","10613435","116408","116407","120015","116401","116406","116402","10613429","119993","149144","152687","116405","10613429","116404","10613434","116403"];
    var training_reads = [];

    function get_dedata5b() {
            do_debug(" Request Data for Welcome Status");
           var report = { WhereClause: null,
                  aggregateField: "MembershipNumber",
                  aggregateFunction: "COUNT",
                  distinct: true,
                  emailId: null,
                  isDashboardQuery: false,
                  isHierarchy: true,
                  orderby: "",
                  pageNo: 1,
                  pageSize: 5000000,
                  query: "",
                  selectFields: ["PreferredName","LastName","MembershipNumber","Role","CompletedDate","OwnerName","ActionType","OnBoardingActionStatusId","Status","ActionListId","LocationDistrict","OnBoardingActionStatus","ActionList","County","CategoryKey","Team","StatusId","LocationGroup","TeamId","RoleId","EmailAddress","unitName"],
                  table: "InProgressActionDashboardView",
                  teamId: "",
                  unitId: level_de,
                //    unitId:"89d2f00e-6d57-8032-be02-47393fcf0556",
              //    treeVal:{"type":"group","id":"cca1f1b8-25e9-4b2f-a0f4-4f141d5ab86f"},
                  userId: null,
                  viewQueryAction: "data"
                 }
     if (document.getElementById("gmpersonnamef").value != "") {
                        report.query = "PreferredName  LIKE '%" + document.getElementById("gmpersonnamef").value+"%'";
                          if (document.getElementById("gmpersonnamel").value != "") { report.query +=" AND "; }
                 }
                 if (document.getElementById("gmpersonnamel").value != "") {
                        report.query += "LastName LIKE '%" + document.getElementById("gmpersonnamel").value+"%'";
                 }
          if ((document.getElementById("gmpersonnamef").value != "")||(document.getElementById("gmpersonnamel").value != "")) {  report.query += " AND "; }
          report.query += " COALESCE(Role, '') <> ''"; // only pick up stuff with a role

          if (document.getElementById("gmteamonly").checked) {
             report.isHierarchy = false;
          }
        $("#gmState")[0].innerText = "Joining Journey Data Requested";
        do_debug(" Joining Journey Data Requested "+report.query);
                 GM_xmlhttpRequest({
    method: "POST",
    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/DataExplorer/GetResultsAsync",
    data: JSON.stringify(report),
    headers: {
        "Content-Type": "application/json;odata=minimalmetadata",
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
        "Accept": "application/json, text/plain, */*",
        "Type": "table"

    },

    onload: function(response) {
         do_debug(" Data Read for Welcome Status");
         $("#gmState")[0].innerText = "Joining Journey Data Collected";
        welcome = JSON.parse(response.responseText);
         do_debug("Welcome Status length "+welcome.data.length);
        mem_learning = [];
        get_dedata6a()
    },
    onerror:   function(response) { do_debug2("ON Error");do_debug2(JSON.stringify(response))},
    onabort:  function(response) { do_debug2("ON Abort");do_debug2(JSON.stringify(response))}
});
    }

    // var training_ids = ["152688","116405","10613435","116408","116407","120015","116401","116406","116402","10613429","119993","149144","152687","116405","10613429","116404","10613434","116403"];
   function get_dedata5(lcontext) {
       if (document.getElementById("gmlearnslow").checked) {
                $("#gmState")[0].innerText = "Read Learning Data "+(1+lcontext)+" of "+training_ids.length;
       } else { $("#gmState")[0].innerText = "Read Learning Data "}

  //   console.log("role");
  //   console.log(roles);

  
          //152688 Welcome Convo
          //116408 Safeguarding
          //116407 safety
          //120015 Trustee
          //116401 Trustee
          //116406 Who we are
          //116405 Leading Scout Volunteers 10613435 (WB)
       //116404 Delivering 10613434 (WB)
       // 116402 Inclusion  10613429 WB
       // 119993 GDPR 116403
       // 149144  First Response  152687
       // 153014 Suspension Lead
     //  var training_ids = ["152688","116405","10613435","116408","116407","120015","116401","116406","116402","10613429","119993","149144","152687","116405","10613429","116404","10613434","116403"];

       var lurl = "https://learn.scouts.org.uk/ilp/restapi/lms/dashboards/8/panels/121/results/table?exportAggregations=false&skill=152688,116405,10613435,116408,116407,120015,116401,116406,116402,10613429,119993,149144,152687,116405,10613429,116404,10613434,116403";
        if (document.getElementById("gmlearnslow").checked) {
      lurl = "https://learn.scouts.org.uk/ilp/restapi/lms/dashboards/8/panels/121/results/table?exportAggregations=false&skill="
      lurl += training_ids[lcontext];
      do_debug("Request Learning for "+lcontext+" "+training_ids[lcontext]);
        } else {  do_debug("Request Learning for Everything")}
     if (!document.getElementById("gmpersonnamef").value=="") {
         lurl+="&firstname="+document.getElementById("gmpersonnamef").value
     }
     if (!document.getElementById("gmpersonnamel").value=="") {
         lurl+="&lastname="+document.getElementById("gmpersonnamel").value
     }
       do_debug("Learning URL "+lurl);
    if (document.getElementById("gmlearning").checked) {
     GM_xmlhttpRequest({
            method: "GET",
            context: lcontext+1,
            url: lurl,
            //    data: datapass,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
                do_debug("Learning received for "+lcontext+" "+training_ids[lcontext]);
                try {

           //     console.log(xmlToJson(response.responseText));

                if (response.context==1) {
                learning_json = JSON.parse(response.responseText);
                } else
                {
                    var learning_json2 = JSON.parse(response.responseText);
                    learning_json.rows.row.push(...learning_json2.rows.row);
                }
                } catch {do_debug2("Error Reading Learning"); do_debug2(JSON.stringify(response));};
                do_debug("Learning length is now "+learning_json.rows.row.length);
                $("#gmState")[0].innerText = "Learning Report Collected "+response.context;
                if (((response.context-1)<training_ids.length)&&(document.getElementById("gmlearnslow").checked)) {get_dedata5(response.context)} else {get_dedata5b()}
            },
            onerror:   function(response) { do_debug2("ON Error");do_debug2(JSON.stringify(response))},
            onabort:  function(response) { do_debug2("ON Abort");do_debug2(JSON.stringify(response))}
        });

    } else {
         $("#gmState")[0].innerText = "Joining Journey Data Requested";
         get_dedata5b();
    }
   }

    function  get_dedata4() {
                 $("#gmState")[0].innerText = "Read Team Directory";
                 do_debug("Read Team Directory ");
                  var report = { WhereClause: null,
                  aggregateField: "*",
                  aggregateFunction: "COUNT",
                  distinct: true,
                  emailId: null,
                  isDashboardQuery: false,
                  isHierarchy: true,
                  orderby: "",
                  pageNo: 1,
                  pageSize: 50000,
                  query: "",
                  selectContactFields: null,
                  selectFields: ["FirstName","LastName","MembershipNumber","Role","Team","CountyName","DistrictName","GroupName","Telephone","StartDate","EmailAddress"],
                  table: "PreloadedAwardsDashboardView",
                  teamId: "",
                  unitId: level_de,
                  userId: null,
                  viewQueryAction: "data"
                 }
                              var report2 = { WhereClause: null,
                  aggregateField: "*",
                  aggregateFunction: "COUNT",
                  distinct: true,
                  emailId: null,
                  isDashboardQuery: false,
                  isHierarchy: true,
                  orderby: "",
                  pageNo: 1,
                  pageSize: 5000,
                  query: "",
                  selectContactFields: null,
                  selectFields: ["FirstName","LastName","MembershipNumber","EmailAddress","Telephone","DistrictName","County","Role","Team","unitName","Line2","PostalCode","Country","Town","GroupName","CountyName","Line1","StartDate"],
                  table: "PreloadedAwardsDashboardView",
                  teamId: "",
                  unitId: level_de,
                  userId: null,
                  viewQueryAction: "data"
                 }
                 if (document.getElementById("gmpersonnamef").value != "") {
                        report2.query = "FirstName LIKE '%" + document.getElementById("gmpersonnamef").value+"%'";
                          if (document.getElementById("gmpersonnamel").value != "") { report2.query +=" AND "; }
                 }
                 if (document.getElementById("gmpersonnamel").value != "") {
                        report2.query += "LastName LIKE '%" + document.getElementById("gmpersonnamel").value+"%'";
                 }
         if (document.getElementById("gmteamonly").checked) {
             report2.isHierarchy = false;
         }
          do_debug("Query "+report2.query);
          GM_xmlhttpRequest({
    method: "POST",
    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/DataExplorer/GetResultsAsync",
    data: JSON.stringify(report2),
    headers: {
        "Content-Type": "application/json;odata=minimalmetadata",
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
        "Accept": "application/json, text/plain, */*",
        "Type": "table"

    },

    onload: function(response) { //  console.log(response);console.log(count);

     //   console.log(JSON.parse(response.responseText));
        roles = JSON.parse(response.responseText);
                 $("#gmState")[0].innerText = roles.length+" team members read";
        do_debug("Roles read  "+roles.data.length);
        training_reads = [];
        get_dedata5(0)
    },
    onerror:   function(response) { do_debug2("ON Error");do_debug2(JSON.stringify(response))},
    onabort:  function(response) { do_debug2("ON Abort");do_debug2(JSON.stringify(response))}
});

                            }

    function get_dedata3() {
         $("#gmState")[0].innerText = "Read team members";
          do_debug("Read Team Data");
        var q = "(";
        if (document.getElementById("gmteamonly").checked) {
            q += "unitid='"+mems[0].id+"' ";
        } else {
        for (var i=0;i<mems.length;i++) { //
            q+="unitid='"+mems[i].id+"' ";
          if (i!=mems.length-1) { q+=" OR ";}
        }

        }
         q+=")";
        if (document.getElementById("gmpersonnamel").value != "") {
            q+=" AND FullName LIKE '%"+document.getElementById("gmpersonnamel").value+"%'";
        }
        if (document.getElementById("gmpersonnamef").value != "") {
            q+=" AND FullName LIKE '%"+document.getElementById("gmpersonnamef").value+"%'";
        }
         do_debug("Query "+q);
        var report2 = {
                contactId: "",
                distinct: true,
                id: "",
         isHierarchy: true,
                isDashboardQuery: false,
                name: "",
                order: "asc",
                orderBy: "Lastname",
                pageNo: 1,
                pageSize: 5000,
             //   query: `unitid='e5b6ecb0-0360-9cde-f269-7660a2afb0fb'`,
                query: q,
       // query: `unitid='89d2f00e-6d57-8032-be02-47393fcf0556'`, Runnymede
                selectFields: ["Id", "PreferredName", "FullName", "Firstname", "Lastname", "RoleStatusName", "Role", "unitid", "TeamId", "ParentTeamId", "UnitPrefix", "Unitname","ContactMembershipId", "UnitTypeId"],

          //          "RoleStatusName", "Role"
          //      ],
//selectFields: ["Id"],
                table: "TeamMembersView"
            };
        if (document.getElementById("gmteamonly").checked) {
             report2.isHierarchy = true;
         }
       GM_xmlhttpRequest({
          method: "POST",
    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/DataExplorer/GetResultsAsync",
    data: JSON.stringify(report2),
    headers: {
        "Content-Type": "application/json;odata=minimalmetadata",
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
        "Accept": "application/json, text/plain, */*",
        "Type": "table"

    },

    onload: function(response) { //  console.log(response);console.log(count);

            do_debug("Teams Read ");
       
        role_detail = JSON.parse(response.responseText);
                 $("#gmState")[0].innerText = "Role Details for members read "+role_detail.length;
        do_debug("Role Detail length "+role_detail.data.length);

        get_dedata4();
    },
    onerror:   function(response) { do_debug2("ON Error");do_debug2(JSON.stringify(response))},
    onabort:  function(response) { do_debug2("ON Abort");do_debug2(JSON.stringify(response))}
});

    }

    function get_dedata2(oc) {
            $("#gmState")[0].innerText = "Request data for SubUnits" ;
 if (document.getElementById("gmteamonly").checked) {
                        get_dedata3()
                    } else{
         // Get the Tree
        var max=50;
     //   mems = [];
    //    mems[0] = {id: level_de};
        var datapass = '{"pagesize":'+max+',"nexttoken":'+oc+',"filter":{"global" : "","globaland":false,"fieldand":true},"unitId":"'+level_de+'"}';
        //       console.log(datapass);
        if (debug) {do_debug("Counter for get_Sub Unit "+oc);}
        GM_xmlhttpRequest({
            method: "POST",
            context: oc+1,
            url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/UnitListingAsync",
            data: datapass,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
                if (debug) {do_debug("Counter Received "+response.context)}
                // console.log(JSON.parse(response.responseText).data[1]);
                var mem = null;
                try { mem=JSON.parse(response.responseText).data} catch {console.log("JSON Error "+response.responseText);}
                //   mem =(JSON.parse(response.responseText).data);
                if (mem.length>0) {
                    if (debug) {

                    }
                }
                if ((mem.length==0)&&(debug)) {
                    do_debug("GetData: We got an error collecting data for Sub mems page"+response.context);
                }
                if (mem.length!=0) {
                    mems = mems.concat(mem);
                }
                $("#gmorgstatus")[0].innerHTML = mems.length+" Units read";
                if (debug) {do_debug("Sub Units mems now has length "+mems.length);}
                if (debug) {do_debug("Sub Units mem now has length "+mem.length);}
                if (response.status!=200) {do_debug2(" Sub Units HTTP error "+response.status); do_debug2(JSON.stringify(response));}
                 $("#gmState")[0].innerText = mems.length+" SubUnits read" ;
                if ( mem.length ==50) {get_dedata2(oc+1); } else {missed = 0; get_dedata3()};},
            onerror:   function(response) { do_debug2("ON Error");do_debug2(JSON.stringify(response))},
            onabort:  function(response) { do_debug2("ON Abort");do_debug2(JSON.stringify(response))}
        });
                    }
    }

    function get_deorgdata(oc,ol) {
        // Find the root
        var max = 50;
        teams = [];
        subteams = [];
        maxsubteam = 0;
        un = document.getElementById("gmunitname").value;
        var unt= unitsearchvalues[ol];
          document.getElementById("gmUnit").innerHTML = un;
     //   if (debug) {do_debug("Unit Request for "+un+" Count "+oc+"/"+ol);}
        if (debug) {
            do_debug("Unit Request for "+un+" :"+ " Count "+oc+"/"+ol+" "+unitsearchtypes[ol]);
       //     var tokexpDate = new Date( JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.exp *1000);
        }
        $("#gmState")[0].innerHTML = "Checking for "+unitsearchtypes[ol]+" "+un;
        var datapass = '{"pagesize":'+max+',"nexttoken":'+oc+',"filter":{"global" : "","globaland":false,"fieldand":true,filterfields:[{ "field" : "'+unt+'", "value": "'+un+'"}]},"unitId":""}';
    //    if (debug) {do_debug("Counter for get_data "+oc);}
        GM_xmlhttpRequest({
            method: "POST",
            context: oc+1,
            url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/UnitListingAsync",
            data: datapass,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
           //     if (debug) {do_debug("Counter Recieved "+response.context)}
                // console.log(JSON.parse(response.responseText).data[1]);
                var mem = null;
                try { mem=JSON.parse(response.responseText).data} catch {console.log("JSON Error "+response.responseText);}
                //   mem =(JSON.parse(response.responseText).data);
                if (mem.length>0) {
                    if (debug) {

                    }
                }
                if ((mem.length==0)&&(debug)) {
                    do_debug("GetData: No match for "+response.context+" "+ document.getElementById("gmUnit").innerHTML+" "+unitsearchtypes[ol]);
                }
                if (mem.length!=0) {
                    mems = mems.concat(mem);
                      if (debug) {do_debug("Unit found and has length "+mems.length+" "+ document.getElementById("gmUnit").innerHTML+" "+unitsearchtypes[ol]);}
                }
              


                if (response.status!=200) {do_debug2("HTTP error "+response.status); do_debug2(JSON.stringify(response));}
                $("#gmorgstatus")[0].innerHTML = "Checking for "+unitsearchtypes[response.context]+" "+un;

                if ((ol<unitsearchvalues.length)&&( mems.length==0)) {get_deorgdata(oc,ol+1); } else {

                    var  filter = document.getElementById("gmunitname").value.replaceAll("%", "*");
                    let w = filter.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
                    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
                    mems = mems.filter( function(v) {return re.test(v.unitName)});
                    level_de = mems[0].id;
                     mems = [];
                    mems[0] =  {id: level_de};
                    //      if (debug) {GM_log("Re: Filter by for Unit only roles now has length "+roles.length);}


                    get_dedata2(0)};
            },
            onerror:   function(response) { do_debug2("ON Error");do_debug2(JSON.stringify(response))},
            onabort:  function(response) { do_debug2("ON Abort");do_debug2(JSON.stringify(response))}
        });

    }


   function get_data_de() {
        mems =[];
          orglevel = 0;
        orglevel = +document.getElementById("gmsorglevelr").value;
        //     debug = true;
        get_deorgdata(orgcounter,orglevel);
      // mems.push({id: level_de});
  //  get_dedata2(0);
    }



    function get_data_deold() {
    var report = { WhereClause: null,
                  aggregateField: "*",
                  aggregateFunction: "COUNT",
                  distinct: true,
                  emailId: null,
                  isDashboardQuery: false,
                  isHierarchy: true,
                  orderby: "",
                  pageNo: 1,
                  pageSize: 5000,
                  query: "",
                  selectContactFields: null,
                  selectFields: ["FirstName","LastName","MembershipNumber","Role","Team","CountyName","DistrictName","GroupName","Telephone"],
                  table: "PreloadedAwardsDashboardView",
                  teamId: "",
            //      unitId:"e5b6ecb0-0360-9cde-f269-7660a2afb0fb",
                    unitId:"89d2f00e-6d57-8032-be02-47393fcf0556",
              //    treeVal:{"type":"group","id":"cca1f1b8-25e9-4b2f-a0f4-4f141d5ab86f"},
                  userId: null,
                  viewQueryAction: "data"
                 }
    //e5b6ecb0-0360-9cde-f269-7660a2afb0fb
    var report2 = {
                contactId: "",
                distinct: true,
                id: "",
         isHierarchy: true,
                isDashboardQuery: false,
                name: "",
                order: "asc",
                orderBy: "Lastname",
                pageNo: 1,
                pageSize: 5000,
                query: `unitid='e5b6ecb0-0360-9cde-f269-7660a2afb0fb'`,
       // query: `unitid='89d2f00e-6d57-8032-be02-47393fcf0556'`, Runnymede
                selectFields: ["Id", "PreferredName", "FullName", "Firstname", "Lastname", "RoleStatusName", "Role", "unitid", "TeamId", "ParentTeamId", "UnitPrefix", "Unitname","ContactMembershipId", "UnitTypeId"],

          //          "RoleStatusName", "Role"
          //      ],
//selectFields: ["Id"],
                table: "TeamMembersView"
            };
        var report3 = {
                                        contactId: "",
                                        id: "",
                                        name: "",
                                 //       query: "ContactId ='".concat(l, "' AND IsNANUnit = 0"),
                        //                query: `unitid='89d2f00e-6d57-8032-be02-47393fcf0556'`,
             query: `unitid='e5b6ecb0-0360-9cde-f269-7660a2afb0fb'`,
                                        table: "ContactUnitsView",
                                        order: "asc",
                                        orderBy: "Team",
             isHierarchy: true,
                                        selectFields: ["TeamId", "Team", "UnitName", "unitid", "ParentTeam", "ParentTeamId", "unitType", "unitTypeId", "AllowSubTeam", "unitPrefix"],
                                        distinct: !0,
                                        isDashboardQuery: !1
                                    };
          GM_xmlhttpRequest({
    method: "POST",
    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/DataExplorer/GetResultsAsync",
    data: JSON.stringify(report),
    headers: {
        "Content-Type": "application/json;odata=minimalmetadata",
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
        "Accept": "application/json, text/plain, */*",
        "Type": "table"

    },

    onload: function(response) { //  console.log(response);console.log(count);
        console.log("report");
        console.log(JSON.parse(response.responseText));
    },
    onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
    onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
});
         GM_xmlhttpRequest({
    method: "POST",
    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/DataExplorer/GetResultsAsync",
    data: JSON.stringify(report3),
    headers: {
        "Content-Type": "application/json;odata=minimalmetadata",
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
        "Accept": "application/json, text/plain, */*",
        "Type": "table"

    },

    onload: function(response) { //  console.log(response);console.log(count);
        console.log("report3");
        console.log(JSON.parse(response.responseText));
    },
    onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
    onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
});
                  GM_xmlhttpRequest({
    method: "POST",
    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/DataExplorer/GetResultsAsync",
    data: JSON.stringify(report2),
    headers: {
        "Content-Type": "application/json;odata=minimalmetadata",
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
        "Accept": "application/json, text/plain, */*",
        "Type": "table"

    },

    onload: function(response) { //  console.log(response);console.log(count);
          console.log("report2");
        console.log(JSON.parse(response.responseText));
    },
    onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
    onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
});
    }

    function report_onclick() {
        // RUn Report
        //     console.log("Report");
     learning_popup.close();
        if   (document.getElementById("gmdebug").checked) {
            debug = true;
        }
        var count = 1;
        mem="";
        //  $("#gmpopup").dialog ( {modal: true, height: 500, width: "100%"} );
        mems = [];
        role_detail=[];
        roles=[];
        document.getElementById("gmTable").innerHTML="Table will appear here....";
        //   document.getElementById("gmUnit").innerHTML = "UKJDKJD";
        var responsetext = "";
        var datapass;
        mem_learning= [];
        learn = [];
        dbs_detail=[];
        var tokexpDate = new Date( JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.exp *1000);
     if(document.getElementById("gmexplorer").checked) {
         debug_log = [];
         if (tabletabulator!=null) {
           tabletabulator.clearData();
         }
         get_data_de(count);
      } else {
             get_data(count);
       }

    }


    function report_onclick2() {
        // Open Dialog
        console.log("Report");
        var count = 1;
        mem="";
        var h = $( window ).height();
        $("#gmpopup").dialog ( {modal: true, height: (h*0.75), width: "100%"} );
        mems = [];
        role_detail=[];
        roles=[];
        memsunique=[];
        //   document.getElementById("gmTable").innerHTML="Table will appear here....";
        var responsetext = "";
        var datapass;
        mem_learning= [];
        keepalive = window.setInterval(function () {
            if (window.location.href=='https://membership.scouts.org.uk/#/learning') {
                var ul = document.getElementById('menu-list-item-left-nav-homePageTile');
                if (ul!=null) { ul.click(); }
            }
            else {
                ul = document.getElementById('menu-list-item-left-nav-learning');
                ul.click();
            }

            console.log("Keep Alive Active");
        }, 25000);  //5000 is 5 Seconds
        $('#gmpopup').on('dialogclose', function(event) {
            // alert('closed');
            clearInterval(keepalive);
            console.log("Keep Alive Cancelled");
        });
        datapass = '{"pagesize":50,"sort":{"field":"unitName","type":"asc"},"contactId":"'+JSON.parse(localStorage.getItem("authInfo")).idTokenClaims.extension_ContactId+'"}';

        GM_xmlhttpRequest({
    method: "POST",
    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/MyUnitsAsync",
    data: datapass,
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
        "Accept": "application/json, text/plain, */*"
    },

    onload: function(response) { //  console.log(response);console.log(count);
        var myUnits = JSON.parse(response.responseText);
        for (var i=0;i<myUnits.data.length;i++) {
            document.getElementById("myUnits").innerHTML+= '<option value="'+myUnits.data[i].unitName+'">';
        }
    },
    onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
    onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
});
      if(document.getElementById("gmexplorer").checked) {
          // Ensure we are logged on to learning by opening a popup - cross domain means we can't check ourselves
     learning_popup = window.open("https://learn.scouts.org.uk", "_blank","popup");
      }
    }

    function report_print() {

        // var prtContent = document.getElementById("GMourreport");
        //  var prtContent = (tabletabulator.getHtml());
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        WinPrint.document.body.innerHTML = tabletabulator.getHtml();
        WinPrint.document.head.innerHTML += '<style> th.blue-background {    writing-mode: vertical-lr;    background-color: lightcyan; } \
th.yellow-background {    writing-mode: vertical-lr;    background-color: lightgoldenrodyellow; } th.orange-background {    writing-mode: vertical-lr;    background-color: salmon; } \
table.tabulator-print-table, tr, th, td {    border: solid;font-family: sans-serif;}</style>';
        //   WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
      //  WinPrint.close();
    }

    function savecolors() {
        GM_setValue("colors", JSON.stringify(colors));
        GM_setValue("colorsT", JSON.stringify(colorsT));
    }
    function resetcolors() {
        colors = defcolors;
        colorsT = defcolorsT;
        for(cloop=0; cloop<colors.length;cloop++){
            document.getElementById("cpreview"+cloop).style.backgroundColor = colors[cloop];
            document.getElementById("cpreview"+cloop).style.color = colorsT[cloop];
            document.getElementById("back"+cloop).value = colors[cloop];
            document.getElementById("fore"+cloop).value = colorsT[cloop];
        }

    }
    function updateFirstC(event) {
        console.log("Update First");
        if (event.target.name.includes("back")) {
            document.getElementById("cpreview"+event.target.name[4]).style.backgroundColor = event.target.value;
            colors[event.target.name[4]] = event.target.value;
        }
        if (event.target.name.includes("fore")) {
            document.getElementById("cpreview"+event.target.name[4]).style.color = event.target.value;
            colorsT[event.target.name[4]] = event.target.value;
        }

        console.log(event);
    }

    function watchColorPicker(event) {
        console.log("Watch CP");
        console.log(event);
    }

    var unitsearchvalues = ["866060008","866060006","866060005","866060004","866060007","866060003","866060002","866060001","866060000"];
    var unitsearchtypes = ["Organisation","Country","Region","County","County Section","District","District Section","Group","Group Section"];
    var unitcount = [];
    var orglevel = 0;
    var  teams = [];
    var subteams = [];
    var maxsubteam = 0;


    function get_orgdata(oc,ol) {
        // Find the root
        var max = 50;
        teams = [];
        subteams = [];
        maxsubteam = 0;
        un = document.getElementById("gmunitnameo").value;
        var unt= unitsearchvalues[ol];
        if (debug) {GM_log("Unit Request for "+un+" Count "+oc+"/"+ol);}
        if (debug) {
            GM_log("Unit Request for "+un+" :"+ JSON.parse(localStorage.getItem("authInfo")).idToken.substring(1,50));
            var tokexpDate = new Date( JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.exp *1000);
        }
        $("#gmorgstatus")[0].innerHTML = "Checking for "+unitsearchtypes[ol]+" "+un;
        var datapass = '{"pagesize":'+max+',"nexttoken":'+oc+',"filter":{"global" : "","globaland":false,"fieldand":true,filterfields:[{ "field" : "'+unt+'", "value": "'+un+'"}]},"unitId":""}';
        if (debug) {GM_log("Counter for get_data "+oc);}
        GM_xmlhttpRequest({
            method: "POST",
            context: oc+1,
            url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/UnitListingAsync",
            data: datapass,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
                if (debug) {GM_log("Counter Recieved "+response.context)}
                // console.log(JSON.parse(response.responseText).data[1]);
                var mem = null;
                try { mem=JSON.parse(response.responseText).data} catch {console.log("JSON Error "+response.responseText);}
                //   mem =(JSON.parse(response.responseText).data);
                if (mem.length>0) {
                    if (debug) {

                    }
                }
                if ((mem.length==0)&&(debug)) {
                    GM_log("GetData: We got an error collecting data for mems page"+response.context);
                }
                if (mem.length!=0) {
                    mems = mems.concat(mem);
                }
                if (debug) {GM_log("mems now has length "+mems.length);}


                if (response.status!=200) {GM_log("HTTP error "+response.status); GM_log(JSON.stringify(response));}
                $("#gmorgstatus")[0].innerHTML = "Checking for "+unitsearchtypes[response.context]+" "+un;

                if ((ol<unitsearchvalues.length)&&( mems.length==0)) {get_orgdata(oc,ol+1); } else {

                    var  filter = document.getElementById("gmunitnameo").value.replaceAll("%", "*");
                    let w = filter.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
                    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
                    mems = mems.filter( function(v) {return re.test(v.unitName)});
                    //      if (debug) {GM_log("Re: Filter by for Unit only roles now has length "+roles.length);}


                    get_orgdata2(0)};
            },
            onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
            onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
        });

    }

    var tealgrad = new go.Brush('Linear', { 0: 'rgb(32, 178, 170)', 1: 'rgb(0,128,128)' });
    var greengrad = new go.Brush('Linear', { 0: 'rgb(154, 205, 50)', 1: 'rgb(34, 139, 34)' });
    var bluegrad = new go.Brush('Linear', { 0: 'rgb(135, 206, 235)', 1: 'rgb(0, 191, 255)' });
    var redgrad = new go.Brush('Linear', { 0: 'rgb(220, 20, 60)', 1: 'rgb(255, 0, 0)' });
    var browngrad = new go.Brush('Linear', { 0: 'rgb(218, 160, 109)', 1: 'rgb(149, 69, 53 )' });
    var blackgrad = new go.Brush('Linear', { 0: 'rgb(0,0,0)', 1: 'rgb(0,0,0 )' });
    var pinkgrad = new go.Brush('Linear', { 0: 'rgb(128,0,0)', 1: 'rgb(200,0,0 )' });
    var greygrad = new go.Brush('Linear', { 0: 'rgb(128,128,128)', 1: 'rgb(200,200,200 )' });
    var purplegrad = new go.Brush('Linear', { 0: 'rgb(138,43,226)', 1: 'rgb(147,112,219 )' });


    function sectionBrushConverter(node) {
        if (node.unitType === "Group Section") {
            if (node.unitName.includes("Cub")) { return greengrad}
            if (node.unitName.includes("Pack")) { return greengrad}
            if (node.unitName.includes("Squirrel")) { return redgrad}
            if (node.unitName.includes("Drey")) { return redgrad}
            if (node.unitName.includes("Beaver")) { return bluegrad}
            if (node.unitName.includes("Colony")) { return bluegrad}
            return tealgrad;
        }
        if (node.unitType === "District Section") {
            return browngrad;
        }
        if (node.unitType === "Group") {
            return pinkgrad;
        }
        if (node.unitType === "District") {
            return blackgrad;
        }
        if (node.unitType === "Team") {
            return purplegrad;
        }
        if (node.unitType === "Sub Team") {
            return greygrad;
        }

        return "#44CCFF"
        // if (gender === "F") return pinkgrad;
    }

    var missed = 0;

    function get_orgdata2(oc) {
        // Get the Tree
        if (mems.length==0) { $("#gmorgstatus")[0].innerHTML = "No Units found";}

        var max=50;
        var datapass = '{"pagesize":'+max+',"nexttoken":'+oc+',"filter":{"global" : "","globaland":false,"fieldand":true},"unitId":"'+mems[0].id+'"}';
        //       console.log(datapass);
        if (debug) {GM_log("Counter for get_Sub Unit "+oc);}
        GM_xmlhttpRequest({
            method: "POST",
            context: oc+1,
            url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/UnitListingAsync",
            data: datapass,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
                if (debug) {GM_log("Counter Received "+response.context)}
                // console.log(JSON.parse(response.responseText).data[1]);
                var mem = null;
                try { mem=JSON.parse(response.responseText).data} catch {console.log("JSON Error "+response.responseText);}
                //   mem =(JSON.parse(response.responseText).data);
                if (mem.length>0) {
                    if (debug) {

                    }
                }
                if ((mem.length==0)&&(debug)) {
                    GM_log("GetData: We got an error collecting data for Sub mems page"+response.context);
                }
                if (mem.length!=0) {
                    mems = mems.concat(mem);
                }
                $("#gmorgstatus")[0].innerHTML = mems.length+" Units read";
                if (debug) {GM_log("Sub Units mems now has length "+mems.length);}
                if (debug) {GM_log("Sub Units mem now has length "+mem.length);}
                if (response.status!=200) {GM_log("HTTP error "+response.status); GM_log(JSON.stringify(response));}
                if ( mem.length ==50) {get_orgdata2(oc+1); } else {missed = 0; get_orgdata5()};},
            onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
            onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
        });

    }




    function  get_orgdata5() {
        // Get Teams
        var minlevel = $("#gmorglevel").val();
        mems = mems.filter(function(n) {return n.UnitLevel>=minlevel});
        if (mems.length==0) { $("#gmorgstatus")[0].innerHTML = "No Units found";}

        //  $("#gmorgstatus")[0].innerHTML = response.context+" sub teams read";

        var exclude_section_teams = document.getElementById("gmnosteams").checked;
        var exclude_all_teams = document.getElementById("gmnoteams").checked;
        if (!exclude_all_teams) {
            for(var i=0;i<mems.length;i++) {

                //(b.unitType === "Group Section")&&(a.unitType === "Group Section")
                if ((exclude_section_teams)&&((mems[i].unitType === "Group Section")||(mems[i].unitType === "District Section")))  {
                    missed+=1;
                } else {
                    var datapass = '{"unitId":"'+mems[i].id+'","type":"team"}';
                    GM_xmlhttpRequest({
                        method: "POST",
                        context: i+1,
                        url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/UnitTeamsAndRolesListingAsync",
                        data: datapass,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                            "Accept": "application/json, text/plain, */*"
                        },

                        onload: function(response) { //  console.log(response);console.log(count);
                            if (debug) {GM_log("Counter Recieved "+response.context)}
                            // console.log(JSON.parse(response.responseText).data[1]);
                            var mem = null;
                            try { mem=JSON.parse(response.responseText)} catch {console.log("JSON Error "+response.responseText);}
                            //   mem =(JSON.parse(response.responseText).data);
                            $("#gmorgstatus")[0].innerHTML = response.context+" teams read";
                            teams.push(mem);
                            //console.log(mem);
                            //    $("#gmorgstatus")[0].innerHTML = mems.length+" Units read";

                            if (response.status!=200) {GM_log("HTTP error "+response.status); GM_log(JSON.stringify(response));}

                            $("#gmState")[0].innerText = "Reading Sub Units for "+un+" ("+response.context+") "+"Total read "+mems.length;
                            if ( teams.length+missed== mems.length) {subteams = []; maxsubteam=0; get_orgdata6();}},
                        onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
                        onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
                    });

                }

            }} else {get_orgdata3(false)}
    }


    function  get_orgdata6() {
        for(var i=0;i<teams.length;i++) {
            for (var j=0;j<teams[i].teams.length;j++) {
                if (teams[i].teams[j].allowSubTeam){
                    maxsubteam +=1;
                    var datapass = '{"unitId":"'+teams[i].unitId+'","type":"subteam","teamId" :"'+teams[i].teams[j].teamId+'"}';
                    GM_xmlhttpRequest({
                        method: "POST",
                        context: maxsubteam,
                        url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/UnitTeamsAndRolesListingAsync",
                        data: datapass,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                            "Accept": "application/json, text/plain, */*"
                        },

                        onload: function(response) { //  console.log(response);console.log(count);
                            if (debug) {GM_log("Counter Recieved "+response.context)}
                            // console.log(JSON.parse(response.responseText).data[1]);
                            var mem = null;
                            try { mem=JSON.parse(response.responseText)} catch {console.log("JSON Error "+response.responseText);}
                            //   mem =(JSON.parse(response.responseText).data);

                            subteams.push(mem);
                            //console.log(mem);
                            //    $("#gmorgstatus")[0].innerHTML = mems.length+" Units read";
                            $("#gmorgstatus")[0].innerHTML = response.context+" sub teams read";
                            if (response.status!=200) {GM_log("HTTP error "+response.status); GM_log(JSON.stringify(response));}

                            $("#gmState")[0].innerText = "Reading Sub Units for "+un+" ("+response.context+") "+"Total read "+mems.length;
                            if ( response.context == maxsubteam) {get_orgdata3(false);}},
                        onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
                        onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
                    });

                }
            }
        }
    }
    function section_sort(a,b) {
        if (a.UnitLevel!=b.UnitLevel) {
            if (a.UnitLevel<b.UnitLevel) {return -1}
            if (a.UnitLevel==b.UnitLevel) {return 0}
            if (a.UnitLevel>b.UnitLevel) {return 1}
        }

        if ((a.UnitLevel==b.UnitLevel)&&(a.UnitLevel!=1)) {
            if (a.unitName<b.unitName) {return -1}
            if (a.unitName==b.unitName) {return 0}
            if (a.unitName>b.unitName) {return 1}
        }

        if ((b.unitType === "Group Section")&&(a.unitType === "Group Section")) {
            var asection = 4;
            if (a.unitName.includes("Cub")) {asection = 3;}
            if (a.unitName.includes("Pack")) { asection = 3;}
            if (a.unitName.includes("Drey")) { asection = 1;}
            if (a.unitName.includes("Squirrel")) { asection = 1;}
            if (a.unitName.includes("Beaver")) {asection = 2;}
            if (a.unitName.includes("Colony")) { asection = 2;}
            var bsection = 4;
            if (b.unitName.includes("Cub")) {bsection = 3;}
            if (b.unitName.includes("Pack")) { bsection = 3;}
            if (b.unitName.includes("Drey")) { bsection = 1;}
            if (b.unitName.includes("Squirrel")) { bsection = 1;}
            if (b.unitName.includes("Beaver")) {bsection = 2;}
            if (b.unitName.includes("Colony")) { bsection = 2;}
            if (asection<bsection) {return -1}
            if (asection==bsection) {return 0}
            if (asection>bsection) {return 1}
        }




        return 0
    }

    function section_sort2(a,b) {
        var c= section_sort(a,b) ;
        //   console.log(a.unitType +" "+a.unitName+" "+b.unitType +" "+b.unitName+" "+c);
        return c;
    }

    function get_orgdata3(justdisplay) {
        if (!justdisplay) {
            // Add in Teams
            for (var i=0; i<teams.length;i++) {
                for (var j=0; j<teams[i].teams.length; j++) {
                    var mem = new Object;
                    mem.parentUnitId =  teams[i].unitId;
                    mem.id = teams[i].teams[j].teamId+teams[i].unitId;
                    mem.unitName = teams[i].teams[j].teamName;
                    mem.UnitLevel = 98;
                    mem.unitType = "Team";
                    mem.teamunitId = teams[i].unitId;
                    mems.push(mem);
                }
            }
            for (i=0;i<subteams.length; i++) {
                if (subteams[i].teams!=null) {
                    for ( j=0; j<subteams[i].teams.length; j++) {
                        mem = new Object;
                        mem.parentUnitId =  subteams[i].teams[j].parentTeamId+ subteams[i].unitId;
                        mem.id = subteams[i].teams[j].teamId;
                        mem.unitName = subteams[i].teams[j].teamName;
                        mem.UnitLevel = 99;
                        mem.unitType = "Sub Team";
                        mem.teamunitId = subteams[i].unitId;
                        mems.push(mem);
                    }}}
            mems.sort(section_sort2);
            console.log(mems);
            console.log("teams");
            console.log(teams);
            console.log("Subteams");
            console.log(subteams);
        }
        myDiagram.nodeTemplate =
            new go.Node("Horizontal",
                        { background: "#44CCFF" }).bind('background', '', sectionBrushConverter)
            .add(
            //  new go.Picture({ margin: 10, width: 50, height: 50, background: "red" })
            //    .bind("source"),
            new go.TextBlock("Default Text",
                             { margin: 8, stroke: "white", font: "bold 12px sans-serif" })
            .bind("text", "unitName")
        );



        myDiagram.linkTemplate =
            new go.Link(
            // default routing is go.Routing.Normal
            // default corner is 0
            { routing: go.Routing.Orthogonal, corner: 5 })
            .add(
            // the link path, a Shape
            new go.Shape({ strokeWidth: 3, stroke: "#555" }),
            // if we wanted an arrowhead we would also add another Shape with toArrow defined:
            //new go.Shape({  toArrow: "Standard", stroke: null  })
        );


        myDiagram.addDiagramListener("ObjectSingleClicked",
                                     e => {
            //   console.log(e.hm.nl.ii);
            var gotourl = "https://membership.scouts.org.uk/#/teams/allunits/";

            if (e.hm.nl.ii.UnitLevel>97) {
                gotourl+=e.hm.nl.ii.teamunitId } else
                {gotourl+=e.hm.nl.ii.id.substring(0,36);}
            if (e.hm.nl.ii.UnitLevel<20) {
                gotourl+="/unitdetailsau";
            }
            if (e.hm.nl.ii.UnitLevel>97) {
                gotourl+="/teamsau/";
            }
            if (e.hm.nl.ii.UnitLevel==99) {
                gotourl+=(e.hm.nl.ii.parentUnitId).substring(0,36);
            }
            if (e.hm.nl.ii.UnitLevel==98) {
                gotourl+=(e.hm.nl.ii.id).substring(0,36);
            }
            if (e.hm.nl.ii.UnitLevel>97) {
                gotourl+="/teamdashboardaut";
            }
            if (e.hm.nl.ii.UnitLevel==99) {
                gotourl+="/"+(e.hm.nl.ii.id).substring(0,36)+"/subteamdashboardaust";
            }
            window.location.assign(gotourl);
        });


        myDiagram.model =
            new go.TreeModel(
            { nodeParentKeyProperty: "parentUnitId",  // this property refers to the parent node data
             nodeKeyProperty : "id",
             nodeDataArray: mems,
             angle: 90,
             arrangement: true,
             scale: 0.25,
             initialDocumentSpot: go.Spot.Top,
             initialViewportSpot: go.Spot.Top});


    }

    //   var map = {};

    function show_organogram() {
        var h = $( window ).height();
        $("#gmorganogram").dialog ( {modal: false, height: (h*0.75), width: "80%"} );
        try { myDiagram = new go.Diagram("myDiagramDiv",{
            "undoManager.isEnabled": true,
            layout: new go.TreeLayout({ angle: 0, layerSpacing: 35, scale: 0.25 }) // initialAutoScale: go.AutoScale.UniformToFill })
        });} catch {}
        myDiagram.addDiagramListener('InitialLayoutCompleted', function(e) {
            var dia = e.diagram;
            // add height for horizontal scrollbar
            dia.div.style.width = (dia.documentBounds.width + 24) + "px";
            if (( (dia.documentBounds.height + 24)  *  (dia.documentBounds.width))< 20000000 ) {
                dia.div.style.height = (dia.documentBounds.height + 24) + "px";
            } else {  dia.div.style.height = "25000px";}

        });

        orgcounter = 0;
        mems=[];
        orglevel = 0;
        //  debug = true;
        mems = GM_getValue("orgmems", []);

        get_orgdata3(true);
        //   get_orgdata(orgcounter,orglevel);
    }
    var locations = [];

    function get_mapdata5() {
        var errors = [];
        for (var i=1; i<mapunits.length; i++) {
            if (mapunits[i].unitType=="Group") {
                var postcode ="";
                var ptype = "";
                if (mapunits[i].contactDetails.meetingPlaceAddress.postcode !="") {
                    postcode = mapunits[i].contactDetails.meetingPlaceAddress.postcode
                    ptype = "(Meeting Place)"
                } else {
                    if (mapunits[i].contactDetails.correspondenceAddress.postcode !="") {
                        postcode = mapunits[i].contactDetails.correspondenceAddress.postcode
                          ptype = "(Contact Address)"
                    }
                }
                if (postcode!="") {
                    var loc = locations.find(e=>e.query == postcode);
                    if (loc.result!=null){

                        var marker = L.marker([loc.result.latitude,loc.result.longitude],{icon: mappin}).addTo(map).bindPopup(mapunits[i].name+"<br>"+postcode+"<br>"+ptype+"<br>"+mapunits[i].hierarchy.district+" District").openPopup();
                    } else { errors.push("Invalid postcode for "+mapunits[i].name+" "+postcode);}
                } else { errors.push("No postcode for "+mapunits[i].name);}
            }
        }
        $("#gmerrors")[0].innerHTML ="";
        for (i=0;i<errors.length;i++) {
            $("#gmerrors")[0].innerHTML += errors[i]+"<br>";
        }
    }

    function get_postcodes(index) {
        var subpostcodes = [];
        for(var i=index*100;i<(index*100+100)&&i<postcodes.length;i++) {
            subpostcodes.push(postcodes[i]);
        }
        console.log(subpostcodes);
        var pi = {};
        pi.postcodes = subpostcodes;
        var datapass = JSON.stringify(pi);
        GM_xmlhttpRequest({
            method: "POST",
            context: index+1,
            url: "https://api.postcodes.io/postcodes?filter=postcode,longitude,latitude",
            data: datapass,
            headers: {
                "Content-Type": "application/json",
              //  "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
                //    console.log(response.responseText);
                locations  = locations.concat(JSON.parse(response.responseText).result);
                $("#gmmapstatus")[0].innerHTML = locations.length+" Postcodes read of "+postcodes.length;
                if ((response.context)*100<postcodes.length) {get_postcodes(response.context)} else {get_mapdata5()};
            },
            onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
            onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
        });

    }

    function get_mapdata4() {
        console.log(mapunits);
        postcodes=[];
        for (var i=0;i<mapunits.length;i++) {
            if (mapunits[i].contactDetails.meetingPlaceAddress.postcode !="") { postcodes.push(mapunits[i].contactDetails.meetingPlaceAddress.postcode) } else {
                if (mapunits[i].contactDetails.correspondenceAddress.postcode !="") {postcodes.push(mapunits[i].contactDetails.correspondenceAddress.postcode) }
            }
        }


        get_postcodes(0);

    }
    function get_mapdata3() {
        debug = true;
        // Remove verything but sections
        console.log(mapmems);
        mapunits = [];
        //https://tsa-memportal-prod-fun01.azurewebsites.net/api/GetUnitDetailAsync
        //unitId: "8942fe62-d032-4651-9317-7a9b929e710d"
        for (var i=1; i<mapmems.length; i++) {
            if (mapmems[i].unitType=="Group") {
                console.log("Unit "+i+" "+mapmems[i].unitName);
                var datapass = '{"unitId": "'+mapmems[i].id+'"}';
                GM_xmlhttpRequest({
                    method: "POST",
                    context: i+1,
                    url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/GetUnitDetailAsync",
                    data: datapass,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                        "Accept": "application/json, text/plain, */*"
                    },

                    onload: function(response) { //  console.log(response);console.log(count);
                        if (debug) {GM_log("Counter Received "+response.context)}
                        // console.log(JSON.parse(response.responseText).data[1]);
                        var mem = null;
                        try { mem = JSON.parse(response.responseText)} catch {console.log("JSON Error "+response.responseText);}
                        //   mem =(JSON.parse(response.responseText).data);
                        mapunits.push(mem);
                        //    console.log(mapunits);
                        if (mapunits.length==mapmems.filter(e=>e.unitType=="Group").length) {
                            get_mapdata4();
                        }
                        $("#gmmapstatus")[0].innerHTML = mapunits.length+" Groups read of "+mapmems.filter(e=>e.unitType=="Group").length;
                        if (debug) {GM_log("Units mems now has length "+mapmems.length);}
                        if (response.status!=200) {GM_log("HTTP error "+response.status); GM_log(JSON.stringify(response));}
                    },
                    onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
                    onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
                });
            }}
    }
    function get_mapdata2(oc) {
        // Get the Tree
        if (mems.length==0) { $("#gmorgstatus")[0].innerHTML = "No Units found";}

        var max=50;
        var datapass = '{"pagesize":'+max+',"nexttoken":'+oc+',"filter":{"global" : "","globaland":false,"fieldand":true},"unitId":"'+mapmems[0].id+'"}';
        //       console.log(datapass);
        if (debug) {GM_log("Counter for get_Sub Unit "+oc);}
        GM_xmlhttpRequest({
            method: "POST",
            context: oc+1,
            url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/UnitListingAsync",
            data: datapass,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
                if (debug) {GM_log("Counter Received "+response.context)}
                // console.log(JSON.parse(response.responseText).data[1]);
                var mem = null;
                try { mem=JSON.parse(response.responseText).data} catch {console.log("JSON Error "+response.responseText);}
                //   mem =(JSON.parse(response.responseText).data);
                if (mem.length>0) {
                    if (debug) {

                    }
                }
                if ((mem.length==0)&&(debug)) {
                    GM_log("GetData: We got an error collecting data for Sub mems page"+response.context);
                }
                if (mem.length!=0) {
                    mapmems = mapmems.concat(mem);
                }
                $("#gmmapstatus")[0].innerHTML = mapmems.length+" Units read";
                if (debug) {GM_log("Units mems now has length "+mapmems.length);}
                if (response.status!=200) {GM_log("HTTP error "+response.status); GM_log(JSON.stringify(response));}
                if ( mem.length ==50) {get_mapdata2(oc+1); } else {missed = 0; mapunits=[]; get_mapdata3()};},
            onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
            onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
        });

    }

    function get_mapdata(oc,ol) {
        // Find the root
        var max = 50;

        un = document.getElementById("gmunitnamem").value;
        var unt= unitsearchvalues[ol];
        if (debug) {GM_log("Unit Request for "+un+" Count "+oc+"/"+ol);}
        if (debug) {
            GM_log("Unit Request for "+un+" :"+ JSON.parse(localStorage.getItem("authInfo")).idToken.substring(1,50));
            var tokexpDate = new Date( JSON.parse(localStorage.getItem("authInfo")).account.idTokenClaims.exp *1000);
        }
        $("#gmmapstatus")[0].innerHTML = "Checking for "+unitsearchtypes[ol]+" "+un;
        var datapass = '{"pagesize":'+max+',"nexttoken":'+oc+',"filter":{"global" : "","globaland":false,"fieldand":true,filterfields:[{ "field" : "'+unt+'", "value": "'+un+'"}]},"unitId":""}';
        if (debug) {GM_log("Counter for get_data "+oc);}
        GM_xmlhttpRequest({
            method: "POST",
            context: ol+1,
            url: "https://tsa-memportal-prod-fun01.azurewebsites.net/api/UnitListingAsync",
            data: datapass,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
                if (debug) {GM_log("Counter Recieved "+response.context)}
                // console.log(JSON.parse(response.responseText).data[1]);
                var mem = null;
                try { mem=JSON.parse(response.responseText).data} catch {console.log("JSON Error "+response.responseText);}
                //   mem =(JSON.parse(response.responseText).data);
                if (mem.length>0) {
                    if (debug) {

                    }
                }
                if ((mem.length==0)&&(debug)) {
                    GM_log("GetData: We got an error collecting data for map mems page"+response.context);
                }
                if (mem.length!=0) {
                    mapmems = mapmems.concat(mem);
                }
                if (debug) {GM_log("map mems now has length "+mapmems.length);}


                if (response.status!=200) {GM_log("HTTP error "+response.status); GM_log(JSON.stringify(response));}
                $("#gmmapstatus")[0].innerHTML = "Checking for "+unitsearchtypes[response.context-1]+" "+un;

                if ((ol<unitsearchvalues.length)&&( mapmems.length==0)) {get_mapdata(oc,response.context); } else {

                    var  filter = document.getElementById("gmunitnamem").value.replaceAll("%", "*");
                    let w = filter.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
                    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
                    mapmems = mapmems.filter( function(v) {return re.test(v.unitName)});



                    get_mapdata2(0)};
            },
            onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
            onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
        });

    }

    function show_map() {
        var h = $( window ).height();
        $("#gmmap").dialog ( {modal: false, height: (h*0.75), width: "80%"} );
        try {
            map = L.map('gmmapdiv').setView([51.505, -0.09], 13);
        } catch {}
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        mappin = L.icon({
            iconUrl: GM_getResourceURL("LeafletPin"),
            shadowUrl: GM_getResourceURL("LeafletShadow"),

            iconSize:     [25, 41], // size of the icon
            shadowSize:   [41, 41], // size of the shadow
            iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
          //  shadowAnchor: [0, 0],  // the same for the shadow
            popupAnchor:  [1, -34] // point from which the popup should open relative to the iconAnchor
        });
        orgcounter = 0;
        mapmems=[];
        orglevel = 0;
        //  debug = true;
        //    mems = GM_getValue("orgmems", []);

        //  get_mapdata3(true);
        //   get_orgdata(orgcounter,orglevel);
    }

    function myCallback(blob) {
        var url = window.URL.createObjectURL(blob);
        var filename = 'myBlobFile.png';

        var a = document.createElement('a');
        a.style = 'display: none';
        a.href = url;
        a.download = filename;

        // IE 11
        if (window.navigator.msSaveBlob !== undefined) {
            window.navigator.msSaveBlob(blob, filename);
            return;
        }
        document.body.appendChild(a);
        requestAnimationFrame(() => {
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    }

    function  down_organogram() {
        var blob = myDiagram.makeImageData({ background: 'white', returnType: 'blob', callback: myCallback,   size: new go.Size(NaN,NaN) });
        console.log(myDiagram.documentBounds.height);
        console.log(myDiagram.documentBounds.width);
    }

    function  save_organogram() {
     //   GM_setValue("orgmems", mems);
        $("#gmorgstatus")[0].innerHTML = "Hierarchy saved for instant recall";
    }

    function run_organogram() {

        orgcounter = 0;
        mems=[];
        orglevel = 0;
        orglevel = +document.getElementById("gmsorglevel").value;
        //     debug = true;
        get_orgdata(orgcounter,orglevel);

    }

    function run_map() {

        orgcounter = 0;
        mapmems=[];
        orglevel = 0;
        orglevel = +document.getElementById("gmsmaplevel").value;
        get_mapdata(orgcounter,orglevel);

    }

    function clear_cookies() {
        var cookies = document.cookie.split("; ");
        for (var c = 0; c < cookies.length; c++) {
            var d = window.location.hostname.split(".");
            while (d.length > 0) {
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                var p = location.pathname.split('/');
                document.cookie = cookieBase + '/';
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                };
                d.shift();
            }
        }
    }

    function run_learn() {
        GM_xmlhttpRequest({
            method: "GET",
            context: 1,
            url: "https://learn.scouts.org.uk/ilp/restapi/lms/dashboards/8/panels/121/results/table?exportAggregations=false&skill=152688,149148,149147,153014,7804027,7802399,116405,10613435&assessmentType=0",
            //    data: datapass,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("authInfo")).idToken,
                "Accept": "application/json, text/plain, */*"
            },

            onload: function(response) { //  console.log(response);console.log(count);
                console.log(response);
                console.log(xmlToJson(response.responseText));
                console.log(JSON.parse(xmlToJson(response.responseText)));_
            },
            onerror:   function(response) { GM_log("ON Error");GM_log(JSON.stringify(response))},
            onabort:  function(response) { GM_log("ON Abort");GM_log(JSON.stringify(response))}
        });


    }

    function  report_saveXLS() {
        // document.getElementById("gmTabulator2").innerHTML = (tabletabulator.getHtml());
        tabletabulator.download("xlsx", "data.xlsx", {sheetName:"My Data",documentProcessing: function(wb) {

            /* create a new worksheet */
            var ws = XLSX.utils.aoa_to_sheet([
                ["Data Extracted from Scout Membership system"],
                ["Export Date:", new Date()]
            ]);

            /* add to workbook */
            //https://github.com/gitbrent/xlsx-js-style
            XLSX.utils.book_append_sheet(wb, ws, "Extract Information");
            //  wb.Sheets['My Data']['A1'].s = { font: { bold: true, color: { rgb: "FF0000" } } }
            for(var i=7;i<16;i++) {
                //   wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:i})].s =  { alignment: { textRotation: 180 }  }
            }
            var cw = tabletabulator.getColumnLayout();
            var wc = [];
            var cnames = [];
            var cc = 0;
            // Headers
            for (i=0; i<cw.length;i++) {
                if (cw[i].hasOwnProperty("columns")) {
                    var group_visible = false;
                    var group_start = cc;
                    for (var j=0; j<cw[i].columns.length;j++) {
                        if (cw[i].columns[j].visible) {
                            group_visible = true;
                      //  if ( wb.Sheets['My Data'].hasOwnProperty(XLSX.utils.encode_cell({r:1, c:cc}))) {
                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s = { font: { bold: true}};
                            if(cw[i].columns[j].hasOwnProperty("headerVertical")) {
                                wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.alignment  =  { textRotation: 180, vertical: "top", horizontal: "center" }  ;
                            } else
                            {  wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.alignment  =  { vertical: "top" }  ;}
                            if(cw[i].columns[j].hasOwnProperty("cssClass")) {
                                switch(cw[i].columns[j].cssClass) {
                                    case 'blue-background':  wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.fill = { fgColor: { rgb: "ADD8E6" } };
                                        break;
                                    case 'yellow-background':
                                        wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.fill = { fgColor: { rgb: "FFFFE0" } };
                                        break;
                                    case 'orange-background':
                                        wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.fill = { fgColor: { rgb: "FFDAB9" } };
                                        break;
                                }
                            }

                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.border = { top: {style: "thin", color: { rgb: "000000" }}}
                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.border.bottom = {style: "thin", color: { rgb: "000000" }}
                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.border.left = {style: "thin", color: { rgb: "000000" }}
                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.border.right = {style: "thin", color: { rgb: "000000" }}
                            wc.push({width: cw[i].columns[j].width*.15});
                            cnames.push(cw[i].columns[j].field);
                            cc++;
                     //   }
                    }
                    if ((group_visible)&&(wb.Sheets['My Data'].hasOwnProperty(XLSX.utils.encode_cell({r:0, c:group_start})))) {
                        // Group Header
                        wb.Sheets['My Data'][XLSX.utils.encode_cell({r:0, c:group_start})].s = { font: { bold: true}};
                        wb.Sheets['My Data'][XLSX.utils.encode_cell({r:0, c:group_start})].s.fill = { fgColor: { rgb: "DCDCDC" } };
                    }
                }
            } else {
                if (cw[i].visible){
                    wc.push({width: cw[i].width*.15});
                    cnames.push(cw[i].field);
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:0, c:cc})].s = { font: { bold: true}, alignment: {vertical:"top"}};
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s = { font: { bold: true}, alignment: {vertical:"top"}};
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:0, c:cc})].s.border = { top: {style: "thin", color: { rgb: "000000" }}}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:0, c:cc})].s.border.bottom = {style: "thin", color: { rgb: "000000" }}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:0, c:cc})].s.border.left = {style: "thin", color: { rgb: "000000" }}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:0, c:cc})].s.border.right = {style: "thin", color: { rgb: "000000" }}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.border = { top: {style: "thin", color: { rgb: "000000" }}}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.border.bottom = {style: "thin", color: { rgb: "000000" }}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.border.left = {style: "thin", color: { rgb: "000000" }}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:1, c:cc})].s.border.right = {style: "thin", color: { rgb: "000000" }}
                    cc++;
                   }
            }
            // cc++;
        }
                                                      wb.Sheets['My Data']["!cols"]= wc;
        // Color Cells for ticks etc
        for (i=0;i<tabletabulator.getRows().length;i++) {
            for (j=0; j<wc.length; j++) {
                if (wb.Sheets['My Data'].hasOwnProperty(XLSX.utils.encode_cell({r:i+2, c:j}))) {
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s = {};
                    if (wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].hasOwnProperty("v")){
                        if(wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].v=="✅") {
                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s = { font: {color: { rgb: "00FF00" } },  alignment: { horizontal: "center" }  }
                        }
                        if(wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].v=="❌") {
                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s = { font: {color: { rgb: "FF0000" } },  alignment: { horizontal: "center" } }
                        }
                        if(wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].v=="✖") {
                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s = { font: {color: { rgb: "000000" } },  alignment: { horizontal: "center" } }
                        }
                        if(wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].v=="✔") {
                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s = { font: {color: { rgb: "000000" } },  alignment: { horizontal: "center" } }
                        }
                        if(wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].v=="⚡") {
                            wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s = { font: {color: { rgb: "FFA500" } },  alignment: { horizontal: "center" } }
                        }
                        if ((cnames[j].indexOf("dbs")==0)||(cnames[j].indexOf("safeguarding")==0)||(cnames[j].indexOf("safety")==0)||(cnames[j].indexOf("firstresponse")==0)) {
                            var ci =-1;
                            if (cnames[j].indexOf("_")==-1) {
                                ci = cnames.findIndex(e=>e==cnames[j]+"_expirydays"); ci = -1; // No colour for Icon column...
                            } else
                            { ci = cnames.findIndex(e=>e== cnames[j].substring(0, cnames[j].indexOf("_"))+"_expirydays");}
                            var expdays = -1;
                            if (ci>-1) {
                                var cs = cnames.findIndex(e=>e== cnames[j].substring(0, cnames[j].indexOf("_")));
                                var css = wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2,c:cs})];
                                if ("✅❌✔⚡✖".includes(css.v)) {
                                    if (wb.Sheets['My Data'].hasOwnProperty(XLSX.utils.encode_cell({r:i+2, c:ci}))) {
                                        if (wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:ci})].hasOwnProperty("v")) {
                                            expdays = wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:ci})].v;
                                        }
                                    }
                                    if(document.getElementById("gmcolor").checked) {
                                        for(cloop=0;cloop<4;cloop++) {
                                            if ((expdays<=daylimits[cloop])&&(expdays>daylimits[cloop+1])) {
                                                wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s.fill =  {fgColor: { rgb:  colors[cloop].substring(1,7)  }}
                                                // td.style.backgroundColor = colors[cloop];
                                                // td.style.textColor = colorsT[cloop];

                                            }}}
                                }}


                        }
                    }
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s.border = { top: {style: "thin", color: { rgb: "000000" }}}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s.border.bottom = {style: "thin", color: { rgb: "000000" }}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s.border.left = {style: "thin", color: { rgb: "000000" }}
                    wb.Sheets['My Data'][XLSX.utils.encode_cell({r:i+2, c:j})].s.border.right ={style: "thin", color: { rgb: "000000" }}
                }}
        }
        return wb;
    }});
}

function save_selection() {
   var criteria = {
       'gmunitname' : document.getElementById("gmunitname").value,
       'gmsorglevelr' : document.getElementById("gmsorglevelr").value,
       'gmexplorer' : document.getElementById("gmexplorer").checked,
       'gmteamonly' : document.getElementById("gmteamonly").checked,
       'gmexact' : document.getElementById("gmexact").checked,
       'gmpersonnamef' : document.getElementById("gmpersonnamef").value,
       'gmpersonnamel' : document.getElementById("gmpersonnamel").value,
       'gmteamname' : document.getElementById("gmteamname").value,
       'gmwelcome' : document.getElementById("gmwelcome").checked,
       'gmmissing' : document.getElementById("gmmissing").checked,
       'gmlearning' : document.getElementById("gmlearning").checked,
       'gmdates' : document.getElementById("gmdates").checked,
       'gmdays' : document.getElementById("gmdays").checked,
       'gmlearnslow' : document.getElementById("gmlearnslow").checked,
       'gmdbs' : document.getElementById("gmdbs").checked,
       'gmdbsip' : document.getElementById("gmdbsip").checked,
       'gmnumber' : document.getElementById("gmnumber").checked,
       'gmcolor' : document.getElementById("gmcolor").checked,
       'gmhelper' : document.getElementById("gmhelper").checked,
        'gmclosed' : document.getElementById("gmclosed").checked
     }
    GM_setValue("selection", JSON.stringify(criteria));
}

function get_selection() {
   var criteria = JSON.parse(GM_getValue("selection",{}));
   if (criteria.hasOwnProperty("gmunitname")) {
       document.getElementById("gmunitname").value = criteria.gmunitname;
       document.getElementById("gmexplorer").checked = criteria.gmexplorer
       document.getElementById("gmteamonly").checked = criteria.gmteamonly;
       document.getElementById("gmexact").checked = criteria.gmexact;
       document.getElementById("gmpersonnamef").value = criteria.gmpersonnamef;
       document.getElementById("gmpersonnamel").value = criteria.gmpersonnamel;
       document.getElementById("gmteamname").value = criteria.gmteamname;
       document.getElementById("gmwelcome").checked = criteria.gmwelcome;
       document.getElementById("gmmissing").checked = criteria.gmmissing;
       document.getElementById("gmlearning").checked = criteria.gmlearning;
       document.getElementById("gmdates").checked = criteria.gmdates;
       document.getElementById("gmdays").checked = criteria.gmdays;
       document.getElementById("gmlearnslow").checked = criteria.gmlearnslow;
       document.getElementById("gmdbs").checked = criteria.gmdbs;
       document.getElementById("gmdbsip").checked = criteria.gmdbsip;
       document.getElementById("gmnumber").checked = criteria.gmnumber;
       document.getElementById("gmcolor").checked = criteria.gmcolor;
       document.getElementById("gmhelper").checked = criteria.gmhelper;
       document.getElementById("gmclosed").checked = criteria.gmclosed;
     }

}

function report_download() {
    tabletabulator.getHtml();
    //    const clipboardItem = new ClipboardItem({
    //        'text/html': new Blob([document.getElementById("GMourreport").outerHTML], { type: 'text/html' }),
    //        'text/plain': new Blob([document.getElementById("GMourreport").innerText], { type: 'text/plain' })
    //    });
    const clipboardItem = new ClipboardItem({
        'text/html': new Blob([tabletabulator.getHtml()], { type: 'text/html' }),
        'text/plain': new Blob([tabletabulator.getHtml().innerText], { type: 'text/plain' })
    });
    navigator.clipboard.write([clipboardItem]);
}
// Navigation Watcher
/*
    navigation.addEventListener("navigate", e => {
        console.log("EventLstener");
        console.log(e);

        if (document.getElementById("quick_nav")!=null){console.log("remove");document.getElementById("quick_nav").innerHTML ="";}

        setTimeout(function() {

        }, 2000);

    }) // Event listener
*/
/*   setTimeout(function() {
        console.log("New Page");
        //    dopage(); Deactive Unit/Teams
    }, 2000);
 */
// Your code here...
var newHTML         = document.createElement ('div');
// <p>Exclude Welcome Information <input  type="checkbox" id="gmexc" name="gmtexc" /><p> \
//<p><input   type="checkbox" id="gmtraffic" name="gmtraffic" /> Show 90 Day Traffic LIghts  \
newHTML.innerHTML   = '             \
<div id="gmpopup" title="Roles Report">   \
<p>      \
Unit <input   type="text" list="myUnits"  id="gmunitname" size=30 name="gmunitname"  placeholder="Enter Unit Name (% =wildcard)"/><datalist id="myUnits"></datalist>  \
Start At <select id="gmsorglevelr" name="gmsorglevelr" /><option value="0">Organisation</option><option value="1">Country</option><option value="2">Region</option><option value="3">County</option><option value="4">County Sections</option> <option value="5">District</option><option value="6">District Sections</option><option value="7">Group</option><option value="8">Group Section</option></select> \
<button id="gmRunReport">Run Report</button> <button id="gmFilterReport">Refresh Display</button> Criteria: <button id="gmsavecriteria">💾</button> <button id="gmgetcriteria">🔄</button></p> \
<input   type="checkbox" id="gmexplorer" name="gmexplorer" checked /> Use Data Explorer data  \
<fieldset> <legend>Run Status</legend><strongb><span id="gmState">Enter Unit Name above (can include % wildcard) and run report</span></fieldset>  \
<fieldset id="gmaddcriteria" name="gmaddcriteria" > <legend>Additional Criteria</legend>Include Roles for matching Unit Only <input  type="checkbox" id="gmteamonly" name="gmteamonly" /> Exact Match <input   type="checkbox" id="gmexact" name="gmexact" /> <p> \
<p>First Name Filter <input   type="text" id="gmpersonnamef" name="gmpersonnamef" /> Last Name Filter <input   type="text" id="gmpersonnamel" name="gmpersonnamel" /> Team Filter <input   type="text" id="gmteamname" name="gmteamname" /><p></fieldset> \
<fieldset> <legend>Welcome</legend><input   type="checkbox" id="gmwelcome" name="gmwelcome" /> Exclude Role Audit \
 <input   type="checkbox" id="gmmissing" name="gmmissing" /> Only show volunteers with missing audit items</fieldset> \
<fieldset> <legend>Learning</legend><input   type="checkbox" id="gmlearning" name="gmlearning" /> Show Detailed learning  \
<input   type="checkbox" id="gmdates" name="gmdates" /> Show Expiry Dates \
<input   type="checkbox" id="gmdays" name="gmdays" /> Show Days to Expiry  <input   type="checkbox" id="gmlearnslow" name="gmlearnslow" /> Read each course separately</fieldset> \
<fieldset><legend>Disclosures</legend><input   type="checkbox" id="gmdbs" name="gmdbs" /> Show DBS Information <input   type="checkbox" id="gmdbsip" name="gmdbsip" /> Show DBS Status  <input   type="checkbox" id="gmdbsalt" name="gmdbsalt" /> Alternative Method \
</fieldset>  \
<fieldset><legend>Display Options</legend><input   type="checkbox" id="gmnumber" name="gmnumber" /> Show Membership Number<input   type="checkbox" id="gmcolor" name="gmcolor" /> Use Color \
<input   type="checkbox" id="gmhelper" name="gmhelper" /> Exclude Helpers/Holding Roles  <input   type="checkbox" id="gmclosed" name="gmclosed" checked/> Exclude Closed Roles </fieldset>\
<p>Showing All Roles for members of <span id="gmUnit"></span></p>       \
<span id="gmTablex"><button id="gmXLS">Copy to Clipboard</button></span>  \
<span id="gmTablep"><button id="gmPrint">Print</button></span>  \
<span id="gmTablex2"><button id="gmSaveReport">Save XLS</button></span>  \
<span id="gmTable">Report will appear here!</span>  \
<div id="gmTabulator"></div> \
<div id="gmTabulator2"><p>Key: ✅ Required and complete ❌ Required ⚡Complete but near expiry ✔ Not required but complete ✖ Not required but expired </p></div> \
<p><input   type="checkbox" id="gmdebug" name="gmdebug" /> Debug Info - usually this should be off  <button id="gmshowdebug">Show Debug Log</button> </p> \
<p><button id="gmsavecolors">Save Colors</button> <button id="gmresetcolors">Reset Colors</button></p> \
<div id="htmlset" style=""></div> \
</div> ';
    //<p><input   type="checkbox" id="gmexplorer" name="gmexplorer" /> Experimental Data Collection</p> \
// Add Color Selectors
document.body.appendChild (newHTML);
var colors_JSON = GM_getValue("colors", JSON.stringify(defcolors));
var colorsT_JSON = GM_getValue("colorsT", JSON.stringify(defcolorsT));
colors = JSON.parse(colors_JSON);
colorsT = JSON.parse(colorsT_JSON);
var  HTMLSettings         = document.createElement ('div');
for (var cloop=0;cloop<4;cloop+=1){
    HTMLSettings.innerHTML   += '<p><span style="display: inline-block; width :75px">'+colormeanings[cloop]+'</span> '+'<input type="color" id="back'+cloop+'" name="back'+cloop+'" value="'+colors[cloop]+'" />'+'<span> <input type="color" id="fore'+cloop+'" name="fore'+cloop+'" value="'+colorsT[cloop]+'" /></span>   <span id="cpreview'+cloop+'">1000</span></p>';
}
document.getElementById("htmlset").appendChild (HTMLSettings);
for (cloop=0;cloop<4;cloop+=1){
    document.getElementById("back"+cloop).addEventListener("input", updateFirstC, false);
    document.getElementById("back"+cloop).addEventListener("change", watchColorPicker, false);
    document.getElementById("fore"+cloop).addEventListener("input", updateFirstC, false);
    document.getElementById("fore"+cloop).addEventListener("change", watchColorPicker, false);
    document.getElementById("cpreview"+cloop).style.backgroundColor = colors[cloop];
    document.getElementById("cpreview"+cloop).style.color = colorsT[cloop];
    document.getElementById("cpreview"+cloop).style.padding = "10px";
}
$("#gmpopup").hide();
newHTML         = document.createElement ('div');
newHTML.innerHTML   = '             \
<div id="gmorganogram" title="Organogram">Unit <input   type="text" id="gmunitnameo" size=30 name="gmunitnameo"  placeholder="Enter Unit Name (% =wildcard)"/> \
Start At <select id="gmsorglevel" name="gmsorglevel" /><option value="0">Organisation</option><option value="1">Country</option><option value="2">Region</option><option value="3">County</option><option value="4">County Sections</option> <option value="5">District</option><option value="6">District Sections</option><option value="7"  >Group</option><option value="8">Group Section</option></select> \
<button id="gmRunOrg">Chart Data</button><button id="gmSaveOrg">Save</button> <button id="gmDownOrg">Download</button>\
<p><input   type="checkbox" id="gmnoteams" name="gmnoteams" /> Show Units Only <input   type="checkbox" id="gmnosteams" name="gmnosteams" checked/> Exclude section Teams</p> \
<p>Display down to: <select id="gmorglevel" name="gmorglevel" /> <option value="1">Group Section</option><option value="2" selected="selected">Group</option><option value="3">District Sections</option><option value="4">District</option><option value="5">County Sections</option><option value="6">County</option><option value="7">Region</option><option value="8">Country</option><option value="9">Organisation</option></select> \
<p> Status : <span id="gmorgstatus"></span></P> \
<div id="myDiagramDiv" style="width:1000px; height:40000px; background-color: #DAE4E4;"></div><p> <div style="height:1000px;display:none" id="map"></div> </p></div>   \
';
document.body.appendChild (newHTML);
$("#gmorganogram").hide();

newHTML         = document.createElement ('div');
newHTML.innerHTML   = '             \
<div id="gmmap" title="Map">Unit <input   type="text" id="gmunitnamem" size=30 name="gmunitnamem"  placeholder="Enter Unit Name (% =wildcard)"/> \
Start At <select id="gmsmaplevel" name="gmsmaplevel" /><option value="0">Organisation</option><option value="1">Country</option><option value="2">Region</option><option value="3">County</option><option value="4">County Sections</option> <option value="5">District</option><option value="6">District Sections</option><option value="7">Group</option><option value="8">Group Section</option></select> \
<button id="gmRunMap">Map Data</button>\
<p> Status : <span id="gmmapstatus"></span></P> \
<p> <div style="height:1000px" id="gmmapdiv"></div> </p><p>Errors</p><p><div id="gmerrors"></div><div>Key</div><div id="gmkey"></div>\
</div>   \
';
document.body.appendChild (newHTML);
$("#gmmap").hide();
var iconSet1    = GM_getResourceURL ("IconSet1");
var iconSet2    = GM_getResourceURL ("IconSet2");
//  var iconSet3    = GM_getResourceURL ("LeafletPin");
//  var iconSet4    = GM_getResourceURL ("LeafletShadow");
var jqUI_CssSrc = GM_getResourceText ("jqUI_CSS");
var leaf_Css = GM_getResourceText("leaf");
var tabulator_css = GM_getResourceText("tabulator");
jqUI_CssSrc     = jqUI_CssSrc.replace (/url\(images\/ui\-bg_.*00\.png\)/g, "");
jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-icons_222222_256x240\.png/g, iconSet1);
jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-icons_454545_256x240\.png/g, iconSet2);
//  var testing = GM_info();
GM_addStyle (jqUI_CssSrc);
GM_addStyle (leaf_Css);
GM_addStyle (tabulator_css );
addButton("Role Report", report_onclick2, "","T");
addButton("Clear Cookies", clear_cookies,"", "B");
GM_setValue("orgmems", ""); // Clear any stored data following removal of org/map functions
//addButton("Organogram", show_organogram,"", "C");
//addButton("Map", show_map,"", "D");
//   addButton("Map Groups", run_map,"", "D");

document.getElementById("gmRunReport").onclick = report_onclick;
document.getElementById("gmshowdebug").onclick = report_showdebuglog;
document.getElementById("gmFilterReport").onclick = report_filter;
document.getElementById("gmsavecriteria").onclick = save_selection;
document.getElementById("gmgetcriteria").onclick = get_selection;
document.getElementById("gmSaveReport").onclick = report_saveXLS;
document.getElementById("gmsavecolors").onclick = savecolors;
document.getElementById("gmresetcolors").onclick = resetcolors;
document.getElementById("gmXLS").onclick = report_download;
document.getElementById("gmPrint").onclick = report_print;
document.getElementById("gmunitname").value = un;
document.getElementById("gmpopup").style.fontSize = "10pt";
document.getElementById("gmorganogram").style.fontSize = "10pt";
document.getElementById("gmmap").style.fontSize = "10pt";
document.getElementById("gmRunOrg").onclick = run_organogram;
document.getElementById("gmSaveOrg").onclick = save_organogram;
document.getElementById("gmDownOrg").onclick = down_organogram;
document.getElementById("gmRunMap").onclick = run_map;

$( "[name='gmlearning']" ).on( "change", report_filter );
$( "[name='gmdates']" ).on( "change", report_filter );
$( "[name='gmdays']" ).on( "change", report_filter );
$( "[name='gmdbs']" ).on( "change", report_filter );
$( "[name='gmdbsip']" ).on( "change", report_filter );
$( "[name='gmwelcome']" ).on( "change", report_filter );
$( "[name='gmnumber']" ).on( "change", report_filter );
$( "[name='gmcolor']" ).on( "change", report_filter );
$( "[name='gmhelper']" ).on( "change", report_filter );
$( "[name='gmmissing']" ).on( "change", report_filter );
//$( "[name='gmexplorer']" ).on( "change", function() { $("[name='gmaddcriteria']").toggle()});




var blkrs = GM_info.script.options.override.use_blockers;
if (blkrs.length>0) {
    var clicked = GM_notification({
        text: "There maybe an issue with your XHR blacklist this may stop things running - check the plugin settings",
        title: "Scout Membership Plugin",
        url: 'https:/example.com/',
        onclick: (event) => {
            //The userscript is still running, so don't open example.com
            event.preventDefault();
            // Display an alert message instead
            //    alert('I was clicked!')
        }
    });
}






GM_addStyle ('.fa-check-square:before { content: "✅";   }' );
GM_addStyle ('.fa-square:before { content: "🟩";   }' );
GM_addStyle('.tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-sorter-element.blue-background {background : #ADD8E6 }');
GM_addStyle('.tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-sorter-element.yellow-background {background : #FFFFE0 }');
GM_addStyle('.tabulator-col.tabulator-sortable.tabulator-col-sorter-element.orange-background {background : #FFDAB9 }');
GM_addStyle('th.blue-background {    writing-mode: vertical-lr;    background-color: lightcyan; }');
GM_addStyle('th.yellow-background {    writing-mode: vertical-lr;    background-color: lightgoldenrodyellow; }');
GM_addStyle('th.orange-background {    writing-mode: vertical-lr;    background-color: salmon; }');
GM_addStyle('table.tabulator-print-table, tr, th, td {    border: solid;}');

})();