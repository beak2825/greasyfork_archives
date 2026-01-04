// ==UserScript==
// @name         Hydrogen-IM
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      http*://hydrogen.*.aws.ytech.co.nz/admin/search/listing/*
// @include      http*://jsoneditoronline.org/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40851/Hydrogen-IM.user.js
// @updateURL https://update.greasyfork.org/scripts/40851/Hydrogen-IM.meta.js
// ==/UserScript==

function addPrettySerializedView() {
    var element = $('#id_serialized');
    var text = element.text();
    var url = 'https://jsoneditoronline.org/?json={}';
    element.parent().append(
        "<div>" +
        "  <div><a id='a-serialized-view' href='#'>Show/hide pretty view</a></div>" +
        "  <div id='json-viewer-container'></div>" +
        "  <div><iframe id='iframe-serialized-view' class='serialized-view' src='" + url + "'></iframe></div>" +
        "</div>"
    );

    var alink = $('#a-serialized-view');
    var iframe = $('#iframe-serialized-view');
    alink.click(function() {
        iframe.toggle();
    });

    var iframe_win = document.getElementById('iframe-serialized-view').contentWindow;
    var jsonViewReady = false;


    window.addEventListener('message', function(e) {
        if (e.origin.match(/^http.?:\/\/jsoneditoronline.org/)) {
            if (e.data === 'jsoneditoronline ready') {
                jsonViewReady = true;
            }
        }
    });

    // Wait for event listener on jsoneditoronline.org
    var sendData = function() {
        setTimeout(function() {
            if (!jsonViewReady) {
                sendData();
            }
            iframe_win.postMessage(text, '*');
        }, 200);
    };

    sendData();
}


(function() {
    'use strict';

    if (location.href.match(/^http.?:\/\/jsoneditoronline\.org/)) {
        window.addEventListener('message', function(e) {
            console.log('****', e.origin);
            if (e.origin.match(/^http.?:\/\/hydrogen\./)) {
                localStorage.data = e.data;
                location.href = location.href.split('?')[0];
            }
        });
        window.parent.postMessage('jsoneditoronline ready', '*');
    } else {
        GM_addStyle('.serialized-view {width: 100%; min-height: 800px; display: none;}');
        addPrettySerializedView();
    }
})();
