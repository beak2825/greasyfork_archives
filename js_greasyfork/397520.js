// ==UserScript==
// @name         Forjoy TV Crack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Forjoy TV Crack No Login
// @author       You
// @match        http://play.forjoytv.com/tvplayer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397520/Forjoy%20TV%20Crack.user.js
// @updateURL https://update.greasyfork.org/scripts/397520/Forjoy%20TV%20Crack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Original: https://gist.github.com/BrockA/2625891
    Non-jQuery version by: Adam Katz,
      https://gist.github.com/adamhotep/7c9068f2196326ab79145ae308b68f9e
    License: CC BY-NC-SA 4.0 (*not* GPL-compatible)
      changes made by Adam Katz (tracked by adamhotep's github gist) are
      also licensed GPL v2+ (but note the CC BY-NC-SA prevents commercial use)
    License via https://gist.github.com/BrockA/2625891#gistcomment-1617026


    Usage example:

        // ==UserScript==
        // …
        // @require	https://git.io/waitForKeyElements.js
        // ==/UserScript==


        waitForKeyElements (
            "div.comments",
            commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (elem) {
            elem.innerHTML = "This comment changed by waitForKeyElements().";
        }

*/
function waitForKeyElements (
    selectorTxt,    /* Required: The querySelector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed the matched element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                       search.
                    */
) {
    var targetNodes, btargetsFound;

    //--- Additionally avoid what we've found
    var selectorClean = selectorTxt.replace(/(,)|$/g, ":not([wfke_found])$1");

    if (typeof iframeSelector == "undefined")
        targetNodes     = document.querySelectorAll(selectorClean);
    else {
        targetNodes = [];
        var iframe = document.querySelectorAll(iframeSelector);
        for (var i = 0, il = iframe.length; i < il; i++) {
            var nodes = iframe[i].querySelectorAll(selectorClean);
            if (nodes) targetNodes.concat(Array.from(nodes));
        }
    }

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        //--- Found target node(s).  Go through each and act if they are new.
        for (var t = 0, tl = targetNodes.length; t < tl; t++) {

            if (!targetNodes[t].getAttribute("wfke_found")) {
                //--- Call the payload function.
                var cancelFound = false;
                try {
                    cancelFound     = actionFunction (targetNodes[t]);
                }
                //--- Log errors to console rather than stopping altogether
                catch (error) {
                    var name = actionFunction.name;
                    if (name)
                        name = 'in function "' + name + '":\n';
                    console.log ("waitForKeyElements: actionFunction error\n"
                        + name + error);
                }
                if (cancelFound)
                    btargetsFound   = false;
                else
                    targetNodes[t].setAttribute("wfke_found", true);
            }
        }
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
//my script starts


waitForKeyElements("iframe", function(elem) {
if (frames[0].document.body.innerHTML!=="" && !frames[0].document.body.getAttribute("been_there")) {


var script = frames[0].document.createElement("script");
script.innerHTML = `
function getList(cat){
var cid = "";
if (cat == "kanto"){
cid = "BFCFCB97C6AB191C1EAC5656F69C693B";
} else if (cat == "kansai"){
cid = "85DEA01A5770B7988BADB2C209A39DFD";
} else if (cat == "bs"){
cid = "87C346F31DE292ED2CA89CAE4DD90C72";
} else if (cat == "cs"){
cid = "D731104C80F156057BA8C2B833779536";
} else {
cid = "BFCFCB97C6AB191C1EAC5656F69C693B";
}
PlayerCtx.apiInfo = {
        host: "http://demo.fuji.live:9083",
        rtmfp_host: "rtmfp://demo.fuji.live:9035",
        uid: "C2D9261F3D5753E74E97EB28FE2D8B26",
        cid: cid,
        referer: "http://forjoytv.com"
    };
updateUserInfo();
PlayerCtx.uinfo_id = true;
clearTimeout(gts.h);
gts.h = null;
};

window.addEventListener("load", function(event) {
    //console.log("All resources finished loading!");
    var table = document.querySelectorAll('.userinfo_table tbody')[0];
    var channelMenu = document.createElement("tr");
    channelMenu.innerHTML = '<td class="userinfo_name">Channels：</td><td><div class="userinfo_value" style="color: #ccc"><span onclick="getList(&quot;kanto&quot;)">関東</span> <span onclick="getList(&quot;kansai&quot;)">関西</span> <span onclick="getList(&quot;bs&quot;)">BS</span> <span onclick="getList(&quot;cs&quot;)">CS</span></div></td>';
    table.prepend(channelMenu);
getList("kanto");
  });
`;

frames[0].document.body.appendChild(script);
frames[0].document.body.setAttribute("been_there", 1);
}
}
);
})();