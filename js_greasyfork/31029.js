// ==UserScript==
// @name         EM Game Saver
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Save EM Games to disk and then load them even after the site deletes them.
// @author       nearbeer
// @match        https://epicmafia.com/lobby
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/31029/EM%20Game%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/31029/EM%20Game%20Saver.meta.js
// ==/UserScript==

(function() {
    window.setInterval(function() {
        var games = document.querySelectorAll(".gamerow");
        games.forEach(function(gameRow) {
            if(gameRow && !gameRow.ondblclick) {
                var gameID = gameRow.getAttribute("data-gid");
                var gameURL = "https://s3.amazonaws.com/em-gamerecords/" + gameID;
                var button = document.createElement("button");
                var buttonText = document.createTextNode("download");
                button.appendChild(buttonText);
                console.log(gameURL);
                gameRow.ondblclick = function() { open(gameURL, "_blank"); };
            }
        });
    }, 1000);
    var dropZone = document.getElementById('container');

    dropZone.addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    dropZone.addEventListener('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.onload = function(e2) {
            var url = e2.target.result;
            var newWindow = open("https://epicmafia.com/game/6044298");
            newWindow.XMLHttpRequest.prototype.setRequestHeader=function() {};
            Object.defineProperty(newWindow, "record_location", {
                get: function() { return url; },
                set: function() { }
            });
        };
        reader.readAsDataURL(file);
    });
})();