// ==UserScript==
// @name         YouTube Playlist Duration Sort
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add duration sorting options to YouTube playlists.
// @author       Surf Archer
// @icon         https://www.youtube.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @match        https://www.youtube.com/playlist?*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/412659/YouTube%20Playlist%20Duration%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/412659/YouTube%20Playlist%20Duration%20Sort.meta.js
// ==/UserScript==

// VERSION HISTORY
// ---------------
// v0.2  08-Oct-2020 Initial public release.
// v0.3  08-Oct-2020 Removed unusued/unneeded functions. Reordered code for ease of reading. Wrote out use of wait().
// v0.4  20-Oct-2020 Restructured to modern format. Made this a prviate script - it only works on Chrome on Windows.
// v0.5  21-Oct-2020 Implemented new method to reorder playlists - synthesizing YouTube fetch() commands. Fix to debug mode.

'use strict';

logMsg("Initialising YouTube Playlist Duration Sort...");

const debug = false;

// Setup code.
addSortMenuItem("Duration (shortest)", "durationSortClickShortest");
addSortMenuItem("Duration (longest)", "durationSortClickLongest");
injectJS();

function addSortMenuItem(text, handler) {
    var sfm = document.querySelector("#sort-filter-menu");
    var submenu = sfm.querySelector("#menu");

    var d1=document.createElement("DIV");
    d1.setAttribute("class", "item style-scope yt-dropdown-menu");
    d1.textContent=text;

    var d2=document.createElement("DIV");
    d2.setAttribute("secondary", "");
    d2.setAttribute("id", "subtitle");
    d2.setAttribute("class", "style-scope yt-dropdown-menu");
    d2.setAttribute("hidden", "");

    var pib=document.createElement("paper-item-body");
    pib.setAttribute("class", "style-scope yt-dropdown-menu");
    pib.appendChild(d1);
    pib.appendChild(d2);

    var pi=document.createElement("paper-item");
    pi.setAttribute("class", "style-scope yt-dropdown-menu");
    pi.setAttribute("role", "option");
    pi.tabindex="0";
    pi.appendChild(pib);

    var e=document.createElement("A");
    e.setAttribute("class", "yt-simple-endpoint style-scope yt-dropdown-menu");
    e.setAttribute("id", handler);
    e.setAttribute("tabindex", "-1");
    e.appendChild(pi);

    submenu.appendChild(e);
}

function injectJS() {
    logMsg("Injecting Javascript...");

    var script = document.createElement("script");
    script.type = "application/javascript";
    script.textContent = ("(" + injectScript + ")();").replace("const debug = false;", "const debug = "+debug+";");

    document.body.appendChild(script);

    logMsg("Javascript injected!");
}

function injectScript() {
    logMsg("Initialising durationSort...");

    // This following gets modified to "carry into" from the outer process during injection.
    const debug = false;
    var duratonSortRunning = false;
    var currentDelay = 0;

    addScriptToPage("//cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js");

    document.getElementById('durationSortClickShortest').onclick = durationSortClickShortest;
    document.getElementById('durationSortClickLongest').onclick = durationSortClickLongest;

    document.addEventListener('ytplDurationSortEvent', durationSortEvent);

    // EVENT HANDLERS.
    function durationSortClickShortest() {
        logMsg('durationSortClickShortest')
        delayedRun(function(){
            var event = new CustomEvent('ytplDurationSortEvent', {
                detail: {
                    operation: "init", order: 0
                }
            });
            document.dispatchEvent(event);
        }, 50);
    }

    function durationSortClickLongest() {
        logMsg('durationSortClickLongest')
        delayedRun(function(){
            var event = new CustomEvent('ytplDurationSortEvent', {
                detail: {
                    operation: "init", order: 1
                }
            });
            document.dispatchEvent(event);
        }, 50);
    }

    function durationSortEvent(e) {
        logDebug("durationSortEvent("+JSON.stringify(e.detail)+")");
        currentDelay = 0;
        switch(e.detail.operation) {
            case "init":
                initSort(e);
                break;
            case "scroll-to-end":
                loadPlaylist(e);
                break;
            case "sort":
                sortPlaylist(e);
                break;
            case "finished":
                finishedSorting();
                break;
        }
    }

    // WORKER FUNCTIONS.
    function initSort(e) {
        logMsg("Initialising playlist sorting...");

        // De-click the menu.
        delayedRun(function(){
            var elemMenu = document.querySelector("#sort-filter-menu > yt-sort-filter-sub-menu-renderer > yt-dropdown-menu > paper-menu-button");
            var evObj = document.createEvent('Events');
            evObj.initEvent('click', true, false);
            elemMenu.dispatchEvent(evObj);
        }, 50);

        // Lock the page.
        delayedRun(lockPage(true), 100);

        // Then initiate the sort.
        e.detail.operation = "sort";
        delayedRun(function(){
            var event = new CustomEvent('ytplDurationSortEvent', {detail: e.detail});
            document.dispatchEvent(event);
        }, 150);
    }

    function loadPlaylist(e) {
        logMsg("Ensuring playlist is fully loaded...");

        logMsg(" - loadPlaylist() starting");
        var playList = document.querySelector("#contents > ytd-playlist-video-renderer:nth-child(1)").parentNode;
        var numChildren = playList.children.length;
        logDebug("   - Videos in list: "+numChildren);
        if(numChildren > 0) {
            logDebug("   - Scrolling to last video...");
            document.querySelector("#contents > ytd-playlist-video-renderer:nth-child("+numChildren+")").scrollIntoView(true);

            // Then initiate the sort.
            delayedRun(function(){
                var event = new CustomEvent('ytplDurationSortEvent', {
                    detail: { operation: "sort", order: e.detail.order }
                });
                document.dispatchEvent(event);
            }, 250);
        }
        logMsg(" - loadPlaylist() finished");
    }

    function sortPlaylist(e) {
        logDebug(" - sortPlaylist("+JSON.stringify(e.detail)+") starting");

        var numInList=document.querySelector("#contents > ytd-playlist-video-renderer:nth-child(1)").parentNode.children.length;
        var eventSent=false;
        for (var i = 1; numInList > 1 && i < numInList && !eventSent; i++) {
            var nInd=i + 1;
            var nSecs=parseInt(getRowVal(i, "lengthSeconds"));

            var nPrevInd=0;
            var nMoveTo=-1;
            while(nPrevInd < nInd && nMoveTo == -1) {
                var nPrevSecs=parseInt(getRowVal(nPrevInd, "lengthSeconds"));
                if(nPrevSecs !== undefined) {
                    if(e.detail.order == 0 && nPrevSecs > nSecs) {
                        nMoveTo=nPrevInd;
                    }
                    if(e.detail.order == 1 && nPrevSecs < nSecs) {
                        nMoveTo=nPrevInd;
                    }
                }
                nPrevInd++;
            }

            if(nMoveTo > -1) {
                nMoveTo++;
                logDebug(" - MOVING row "+nInd+" ("+nSecs+" secs) to row "+nMoveTo+" ("+nPrevSecs+" secs)", true);
                moveRowTo(nInd, nMoveTo);

                if(i < (numInList - 1)) {
                    // Then send the finished event.
                    delayedRun(function(){
                        var event = new CustomEvent('ytplDurationSortEvent', {
                            detail: e.detail
                        });
                        document.dispatchEvent(event);
                    }, 750);
                    eventSent=true;
                }
            } else {
                logDebug(" - Ignoring row "+nInd+" (duration: "+nSecs+", prevDuration: "+nPrevSecs+")");
            }
        }

        if(!eventSent) {
            // Then initiate the sort.
            delayedRun(function(){
                var event = new CustomEvent('ytplDurationSortEvent', {
                    detail: { operation: "finished", order: e.detail.order }
                });
                document.dispatchEvent(event);
            }, 250);
        } else {
            logDebug(" - sortPlaylist("+JSON.stringify(e.detail)+") finished");
        }
    }

    function finishedSorting() {
        logMsg("Finished sorting, doing cleanup...");
        logDebug(" - re-enable the page.");
        lockPage(false);
        logDebug(" - re-fresh the page.");
        if(!debug) {
            location.reload();
        } else {
            logDebug("   - Skipping reload since DEBUG is on.");
        }
    };

    // PLAYLIST FUNCTIONS.
    function getRowVal(index, key) {
        var row=document.querySelector("#contents > ytd-playlist-video-renderer:nth-child(1)").parentNode.children[index];
        if((key in row.data)) {
            return row.data[key];
        }
    }

    function moveRowTo(src, dest) {
        var ret=false;
        var srcElement=document.querySelector("#contents > ytd-playlist-video-renderer:nth-child("+src+")");
        var destElement=document.querySelector("#contents > ytd-playlist-video-renderer:nth-child("+dest+")");
        var srcEndpoint=srcElement.data.menu.menuRenderer.items[3].menuServiceItemRenderer.serviceEndpoint;

        // Build the body part.
        var b={"context":{}, "actions":[{"setVideoId":"", "action":""}], "params":"", "playlistId":""};
        b.context=window.ytcfg.get("INNERTUBE_CONTEXT");
        b.context.client.screenWidthPoints=window.innerWidth;
        b.context.client.screenHeightPoints=window.innerHeight;
        b.context.client.screenPixelDensity=Math.round(window.devicePixelRatio || 1);
        b.context.client.screenDensityFloat=window.devicePixelRatio || 1;
        b.context.client.utcOffsetMinutes=-Math.floor((new Date).getTimezoneOffset());
        b.context.client.userInterfaceTheme="USER_INTERFACE_THEME_LIGHT";
        b.context.request.internalExperimentFlags=[];
        b.context.request.consistencyTokenJars=[];
        b.context.user={};
        b.context.clientScreenNonce=window.ytcfg.get("client-screen-nonce");

        // Add in the parts specific to the srcRow.
        b.context.clickTracking={"clickTrackingParams" : srcEndpoint.clickTrackingParams};
        b.actions=srcEndpoint.playlistEditEndpoint.actions;
        if(dest > 1) {
            // Don't need to worry about this if it's being moved to the top.
            var destEndpoint=destElement.previousElementSibling.data.menu.menuRenderer.items[3].menuServiceItemRenderer.serviceEndpoint;
            b.actions[0].movedSetVideoIdPredecessor=destEndpoint.playlistEditEndpoint.actions[0].setVideoId;
        }

        b.params=srcEndpoint.playlistEditEndpoint.params;
        b.playlistId=srcEndpoint.playlistEditEndpoint.playlistId;
        var s=JSON.stringify(b);

        // Now build the request.
        var r={"credentials": "include", "headers":{}, "referrer": "", "body": "", "method": "POST", "mode": "cors"};
        if(!("user-agent" in r.headers) && !("User-Agent" in r.headers)) {
            r.headers['User-Agent']=navigator.userAgent;
        }
        r.headers.Accept="*/*";
        r.headers['Accept-Language']=(navigator.language || navigator.userLanguage);
        r.headers['Content-Type']="application/json";
        r.headers.Authorization=sapisidHash();
        if(!("x-goog-authuser" in r.headers) && !("X-Goog-Authuser" in r.headers) && !("X-Goog-AuthUser" in r.headers)) {
            r.headers['X-Goog-AuthUser']=window.ytcfg.get("SESSION_INDEX");
        }
        r.headers['X-Origin']=window.location.origin;

        r.referrer=window.location.href;
        r.body=s;

        // Dispatch the fetch with the right key and wait for it to finish.
        var key=window.ytcfg.get("INNERTUBE_API_KEY");
        var promise=fetch("https://www.youtube.com/youtubei/v1/browse/edit_playlist?key="+key, r);
        promise.then(value => {
            destElement.parentNode.insertBefore(srcElement, destElement);
            ret=true;
        });

        return ret;
    }

    // GENERIC UTILITY FUNCTIONS
    function addScriptToPage(s) {
        var script = document.createElement("script");
        script.setAttribute("src", s);
        document.body.appendChild(script);
    }

    function delayedRun(code, delay=100) {
        currentDelay += delay;
        setTimeout(code, delay);
    }

    function lockPage(op=true) {
        var divId="yt-pl-ds-shadow";
        if(op) {
            var shadowed = document.createElement("div");
            shadowed.id=divId;
            shadowed.style="position:fixed; top:0; left:0; z-index:9999999999; background-color:#000; opacity:0.5; width:100%; height:100%;";
            shadowed.innerHTML = "<br />";
            document.body.appendChild(shadowed);
        } else {
            document.getElementById(divId).remove();
        }
    };

    function logDebug(msg, force=false) {
        if(debug || force) {
            console.debug("[yt-pl-duration-sort] "+msg);
        }
    }

    function logMsg(msg) {
        console.log("[yt-pl-duration-sort] "+msg);
    }

    function sapisidHash() {
        var ret="";

        // First get the cookie value.
        var cookies=decodeURIComponent(document.cookie).split(';');
        const SC1="SAPISIDHASH=";
        const SC2="__Secure-3PAPISID=";
        var cval="";
        for(var i=0; i < cookies.length && cval == ""; i++) {
            var c=cookies[i].trim();
            if(c.indexOf(SC1) == 0) {
                cval=c.substring(SC1.length, c.length);
            } else if(c.indexOf(SC2) == 0) {
                cval=c.substring(SC2.length, c.length);
            }
        }

        // Now generate the hash.
        if(cval != "") {
            var timeSecs = Math.floor(new Date().getTime()/1000);
            var s=timeSecs+" "+cval+" https://www.youtube.com"
            var h=CryptoJS.SHA1(s);
            s=h.toString();
            ret="SAPISIDHASH "+timeSecs+"_"+s;
        }
        return ret;
    }


    logMsg("Initialisation of YouTube Playlist Duration Sort finished...");
}

function logMsg(msg) {
    console.log("[yt-pl-duration-sort] "+msg);
}
