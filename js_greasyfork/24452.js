// ==UserScript==
// @name         festify.us vote script
// @namespace    https://einbaum.org/
// @version      1.0.3
// @description  Unlimited votes on festify.us songs!
// @author       https://github.com/EinBaum
// @include      http://festify.us/*
// @include      https://festify.us/*

// @supportURL   https://github.com/EinBaum/festify.us-vote-script/issues
// @homepageURL  https://github.com/EinBaum/festify.us-vote-script

// @downloadURL https://update.greasyfork.org/scripts/24452/festifyus%20vote%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/24452/festifyus%20vote%20script.meta.js
// ==/UserScript==

function FVS_AddVoteSingle(songName, songID) {
    'use strict';

    document.cookie = "connect.sid=";
    console.log("Voting: " + songName);

    var listID = window.location.pathname.split("&")[0].substring(1);

    var http = new XMLHttpRequest();
    var url = "/api/parties/" + listID + "/queue";
    var params = JSON.stringify({name: songName, spotifyID: songID});

    http.open("POST", url, true);
    http.withCredentials = false;
    http.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            console.log("Voted!");
        }
    };
    http.send(params);
}

function FVS_AddVoteMultiple(songName, songID, num) {
    'use strict';

    for (var i = 0; i < num; i++) {
        FVS_AddVoteSingle(songName, songID);
    }
}

function FVS_CreateButton(parent, songName, songID) {
    'use strict';

    var inp = document.createElement("input");
    inp.value = "1";
    inp.setAttribute("style", "position: absolute; z-index: 999; width: 70px; margin-left: 410px; margin-top: -65px; padding: 0");
    parent.appendChild(inp);

    var btn = document.createElement("div");
    btn.setAttribute("style", "position: absolute; z-index: 999; margin-left: 500px; margin-top: -55px; width: 30px; font-size: 30px");
    btn.onclick = function() {
        FVS_AddVoteMultiple(songName, songID, inp.value);
    };

    var btnicon = document.createElement("i");
    btnicon.className = "fa fa-tree";
    btn.appendChild(btnicon);

    parent.appendChild(btn);
}

var FVS_regex = /^([^\(]*) \((.*?)\)$/;

function FVS_CheckElement(node) {
    'use strict';

    if (node && node.tagName && node.tagName.toLowerCase() == "div") {
        var label = node.getAttribute("analytics-label");
        if (label) {
            var result = FVS_regex.exec(label);
            FVS_CreateButton(node.parentElement, result[2], result[1]);
        }
    }
}

(function() {
    'use strict';

    var config = { childList: true, subtree: true };
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                FVS_CheckElement(mutation.addedNodes[i]);
            }
        });
    });
    observer.observe(document.body, config);
})();
