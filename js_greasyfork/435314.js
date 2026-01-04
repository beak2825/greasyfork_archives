// ==UserScript==
// @name         KSS discollect
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Quick removal of group from collections
// @author       KSS
// @match        https://gazellegames.net/torrents.php?id=*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/435314/KSS%20discollect.user.js
// @updateURL https://update.greasyfork.org/scripts/435314/KSS%20discollect.meta.js
// ==/UserScript==



function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var authKey = getUrlVars(document.getElementsByTagName('link')[4].href).authkey;
var groupId = document.URL.replace(/.*id=/, '').replace(/&.*/, '');

function refresh() {
    window.location.reload(true);
}


async function rm_group_from_coll(coid) {
    let requests = [];
    try {
            requests.push($.post("https://gazellegames.net/collections.php",
                {
             "action": "manage_handle",
             "auth": authKey,
             "collageid": coid,
             "remove[]": groupId,
             "submit": "Remove"
         }));
        }
    catch(e) {};
    return Promise.all(requests);
}


(function() {
    'use strict';

    class Rm_button {
        constructor(coll) {
            var collid = coll.href.replace(/.*id=/, '');
//            alert(collid);
            var btn = document.createElement('input');
            btn.type = "button";
            btn.style= "background-color:red;color:black; height:12px ;padding: 0px 0px; font-size:8px";
            btn.value = "[-]";
            btn.id = "test"+collid;
            btn.onclick = (async function() {
                await rm_group_from_coll(collid);
                refresh()
    })
            coll.after(btn);
        }
    }

    var collecs = $('a[href^="collections.php?id="]');
    for ( var i = 0; i < collecs.length ; i++ ) {
        new Rm_button(collecs[i]);
    }

        })();