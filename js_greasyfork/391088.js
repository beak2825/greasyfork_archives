// ==UserScript==

// @name         Internet Archive Saver
// @description  This userscript saves every visited page to the Internet Archive Wayback Machine (archive.org), if the page has not already been saved there within the last 30 days. This prevents duplicate saves (We don't want to spam the Internet Archive). Some sites are excluded by default (No need to archive google searches, for example). You can add more @exclude flags on your own.
// @namespace    https://greasyfork.org/de/users/160920-flo-pinguin
// @homepage     https://greasyfork.org/de/scripts/391088-internet-archive-saver
// @author       FloPinguin
// @icon         https://abload.de/img/imageuqk3d.png
// @version      3.1
// @grant        GM_xmlhttpRequest
// @connect      archive.org
// @noframes

// @match        *://*/*

// @exclude      *startpage.com*
// @exclude      *google.*/search*
// @exclude      *ecosia.*/search*
// @exclude      *bing.*/search*
// @exclude      *yahoo.*/search*
// @exclude      *ask.com*
// @exclude      *duckduckgo.com*
// @exclude      *aol.*/search*
// @exclude      *yandex.*/search*
// @exclude      *baidu.*
// @exclude      *docs.google.*
// @exclude      *archive.*
// @exclude      http://localhost*

// @downloadURL https://update.greasyfork.org/scripts/391088/Internet%20Archive%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/391088/Internet%20Archive%20Saver.meta.js
// ==/UserScript==



// ==ChangeLog==

// V1.0 - Initial version
// V1.1 - Small exclude optimizations
// V2.0 - Badges! The archiving status gets shown in the bottom-right corner of each visited page. A = Archived, FIRST = First archival, U = Archiving unneccessary, E = Archiving error. This can be turned off in the settings. Version 2.0 also features more detailed console output.
// V2.1 - The Wayback Availability JSON API does not work at the moment. A temporarily fix to check for archiving necessity has been implemented. Version 2.1 also features badge bugfixes.
// V2.2 - The Wayback Availability JSON API now works again
// V3.0 - Better recognition if archiving is necessary by taking into account that the "Wayback Machine Save Page Now Feature" doesn't know our cookies.
// V3.1 - Small optimizations, better error handling

// ==/ChangeLog==



(function() {
    /* SETTINGS */
    var SHOW_BADGES = true;



    console.log("[IA Saver] Requesting the URL (" + location.href + ") without our cookies, like IA does, to get the final URL after redirects...")
    GM_xmlhttpRequest({
        method: 'GET',
        url: location.href,
        anonymous: true,
        onload: function(data){
            archiving_necessity_check(data.finalUrl);
        },
        onerror: function(){
            var log = "[IA Saver] Failed to load the URL without our cookies";
            console.error(log);
            showBadge("E", "#ff2e2e", log)
        }
    });

    function archiving_necessity_check(url){
        console.log("[IA Saver] Asking for archiving necessity... (" + url + ")")
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://archive.org/wayback/available?url=' + encodeURIComponent(url),
            //url: 'https://web.archive.org/__wb/sparkline?url=' + encodeURIComponent(url) + '&collection=web&output=json',
            onload: function(data){
                data = JSON.parse(data.responseText);

                if (isEmpty(data.archived_snapshots)){
                    //if (data.last_ts == null){
                    archive(url, true);
                }else{
                    var last_save = timestampConvert(data.archived_snapshots.closest.timestamp);
                    //var last_save = timestampConvert(data.last_ts);
                    if (Date.now() - last_save > 2592000000){
                        archive(url, false);
                    }else{
                        var log = "[IA Saver] Archiving unnecessary, latest save: " + new Date(last_save).toString() + " (" + data.archived_snapshots.closest.timestamp + ")";
                        //var log = "[IA Saver] Archiving unnecessary, latest save: " + new Date(last_save).toString() + " (" + data.last_ts + ")";
                        console.log(log);
                        showBadge("U", "darkorange", log)
                    }
                }
            },
            onerror: function(){
                var log = "[IA Saver] Failed to ask for archiving neccesity";
                console.error(log);
                showBadge("E", "#ff2e2e", log)
            }
        });
    }

    function archive(url, first){
        console.log("[IA Saver] Archiving...")
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://web.archive.org/save/' + url,
            onload: function(data){
                var log;
                if (data.status == 200){
                    log = "[IA Saver] " + (first ? "FIRST ARCHIVAL!" : "Archived!") + " (https://web.archive.org/web/" + url + ")";
                    console.log(log);
                    showBadge(first ? "FIRST" : "A", "green", log)
                }else{
                    log = "[IA Saver] IA threw an error (" + data.status + " - " + data.statusText + ")";
                    console.error(log);
                    showBadge("E", "#ff2e2e", log)
				}
            },
            onerror: function(){
                var log = "[IA Saver] Failed to archive";
                console.error(log);
                showBadge("E", "#ff2e2e", log)
            }
        });
    }

    function showBadge(status, color, title){
        if (SHOW_BADGES){
            var el = document.createElement("div");
            el.setAttribute("title", title)
            el.setAttribute("onclick", "window.open('https://web.archive.org/web/*/" + location.href + "', '_blank')")
            el.setAttribute("style", "position: fixed; display: block; bottom: 0; right: 0; background: " + color + "; color: #fff; padding: 2px 3px; user-select: none; cursor: pointer; font-size: 12px; border-radius: 0; z-index: 1000000000000000000; font-family: Arial; width: initial; box-shadow: none; margin: 0;");
            el.innerHTML = status;
            var body = document.getElementsByTagName("html")[0];
            body.insertBefore(el, body.firstChild);
        }
    }

    function timestampConvert(ts){
        return Date.parse(ts.replace(
            /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
            '$4:$5:$6 $2/$3/$1 GMT'
        ));
    }

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
})();