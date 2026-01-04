// ==UserScript==
// @name         Song List
// @version      0.1
// @description  Song list history for everynoise.com.
// @author       Randyr
// @match        http://everynoise.com/
// @include      http://everynoise.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @namespace https://greasyfork.org/users/131271
// @downloadURL https://update.greasyfork.org/scripts/30471/Song%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/30471/Song%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        try {
            var x = document.getElementById('mirror');
            x.className = "centered";
            x.style = "";
            x = document.getElementById('tunnel');
            x.className = "centered";
            x.style = "";
        } catch (e) {}

        var div = document.createElement('div');
        div.className = "float-bottom";
        $('.title').first().after(div);

        var label_prev     = $(document.createElement('p')).text('Previous: '),
            label_curr     = $(document.createElement('p')).text('Current: '),
            previous_song  = $(document.createElement('p')).text('-'),
            curr_song      = $(document.createElement('p')).text('-'),
            history_button = document.createElement('div');

        history_button.className = "button-right";
        history_button.innerHTML = "History";

        $(div).append(label_prev);
        $(div).append(previous_song);
        $(div).append(label_curr);
        $(div).append(curr_song);
        $(div).append(history_button);

        var history_panel = [
            '<div id="history-panel" class="modal">',
            '  <div class="modal-content">',
            '    <div class="modal-header">',
            '      <span class="close">&times;</span>',
            '      <h2>History</h2>',
            '    </div>',
            '    <div class="modal-body">',
            '      <ol id="history-list"></ol>',
            '    </div>',
            '  </div>',
            '</div>',
        ].join('\n');

        $('body').append(history_panel);

        var current_song = '';
        var playlist = [];

        function getDivByArtist(artist) {
            var xpath = '//div[text()="' + artist + '"]';
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        function playlist_append(song_div, song_name) {
            playlist.push(song_div);
            curr_song.text(song_name);
            $('#history-list').append('<li>' + song_name + '</li>');

            try {
                var prev_song = playlist[playlist.length - 2].title.replace('e.g.', '');
                previous_song.text(prev_song);
            } catch (e) { }
        }

        function getSong() {
            if (current_song === nowplaying || nowplaying === '') {
                return;
            }
            current_song = nowplaying;
            var song_div = getDivByArtist(current_song);
            var song_name = song_div.title.replace('e.g.', '');
            playlist_append(song_div, song_name);
        }

        function check() {
            getSong();
            setTimeout(function() {
                check();
            }, 1000);
        }

        check();

        var modal = document.getElementById('history-panel');
        var span = document.getElementsByClassName('close')[0];

        history_button.onclick = function() {
            if (modal.style.display === "block") {
                modal.style.display = "none";
            } else {
                modal.style.display = "block";
            }
        };

        span.onclick = function() {
            modal.style.display = "none";
        };
    }

    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+main+')();'));
    (document.body || document.head || document.documentElement).appendChild(script);

    var css = [
        ".centered {",
        "    margin: auto;",
        "    width: 50%;",
        "    padding: 0;",
        "    margin-top: 15px;",
        "}",
        ".centered > .canvas {",
        "    margin: auto;",
        "    width: 50%;",
        "}",
        ".float-bottom {",
        "    position: fixed;",
        "    height: 50px;",
        "    width: 100%;",
        "    z-index: 1001;",
        "    opacity: 1;",
        "    margin: -8px;",
        "    bottom: 0;",
        "    background-color: #616161;",
        "    box-shadow: 0px -1px 22px 0px rgba(89,89,89,0.61);",
        "}",
        ".float-bottom > p {",
        "    color: white;",
        "    float: left;",
        "    display: inline;",
        "    margin-left: 10px;",
        "    height: 100%;",
        "}",
        ".float-bottom > p:nth-child(1), .float-bottom > p:nth-child(2) {",
        "    color: rgba(224, 224, 224, 0.64);",
        "}",
        ".button-right {",
        "    float: right;",
        "    display: inline;",
        "    padding: 12px 18px;",
        "    height: 100%;",
        "    color: white;",
        "    text-align: center;",
        "    background-color: rgb(79,195,247);",
        "    border-radius: 3px;",
        "    font-size: 14px;",
        "    cursor: pointer;",
        "}",
        ".modal {",
        "    display: none;",
        "    position: fixed;",
        "    z-index: 1001;",
        "    top: 5%;",
        "    opacity: 1;",
        "    transform: scaleX(1);",
        "    left: 75%;",
        "    right: 25%;",
        "    width: 20%;",
        "    max-height: 50%;",
        "    overflow-y: auto;",
        "    background-color: rgb(0, 0, 0);",
        "    background-color: rgba(0, 0, 0, 0.4);",
        "    -webkit-animation-name: fadeIn;",
        "    -webkit-animation-duration: 0.4s;",
        "    animation-name: fadeIn;",
        "    animation-duration: 0.4s;",
        "    margin: auto;",
        "    border-radius: 2px;",
        "    box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.3);",
        "}",
        "@media screen and (max-width: 992px) {",
        "    .modal {",
        "        width: 30%;",
        "        left: 65%;",
        "    }",
        "}",
        ".modal-content {",
        "    background-color: #fefefe;",
        "}",
        ".close {",
        "    color: white;",
        "    float: right;",
        "    font-size: 28px;",
        "    font-weight: bold;",
        "}",
        ".close:hover, .close:focus {",
        "    color: #000;",
        "    text-decoration: none;",
        "    cursor: pointer;",
        "}",
        ".modal-header {",
        "    padding: 2px 14px;",
        "    background-color: rgba(79,195,247, 0.8);",
        "    color: white;",
        "}",
        ".modal-header h2 {",
        "    margin-top: 10px;",
        "    margin-bottom: 5px;",
        "}",
        ".modal-body {",
        "    padding: 2px 12px;",
        "    border: 1px solid #E0E0E0;",
        "}",
        "@-webkit-keyframes slideIn {",
        "    from {bottom: -300px; opacity: 0}",
        "    to {bottom: 0; opacity: 1}",
        "}",
        "@keyframes slideIn {",
        "    from {bottom: -300px; opacity: 0}",
        "    to {bottom: 0; opacity: 1}",
        "}",
        "@-webkit-keyframes fadeIn {",
        "    from {opacity: 0}",
        "    to {opacity: 1}",
        "}",
        "@keyframes fadeIn {",
        "    from {opacity: 0}",
        "    to {opacity: 1}",
        "}",
    ].join('\n');

    var stylescript = document.createElement('style');
    stylescript.type = "text/css";
    stylescript.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(stylescript);
})();