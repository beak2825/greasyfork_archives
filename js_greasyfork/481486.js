// ==UserScript==
// @name         AWBW Replay archive
// @namespace    https://awbw.amarriner.com/
// @version      1.06
// @description  Reload or download an archived replay, from 2023 onward.
// @author       Truniht
// @match        https://awbw.amarriner.com/game.php?games_id=*
// @match        https://awbw.amarriner.com/replay_download.php?games_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @connect awbw.mooo.com
// @grant GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481486/AWBW%20Replay%20archive.user.js
// @updateURL https://update.greasyfork.org/scripts/481486/AWBW%20Replay%20archive.meta.js
// ==/UserScript==

(function() {
    var gameID = window.location.href.match(/_id=([0-9]+)/)[1];
    var replayChecked = false;
    var downloadStarted = false;
    var replayLoaded = false;
    var replayExists = false;
    var downloadedData = '';

    function hasReplay(success, failure) {
        //Check if the archive has this replay, will call success with the response, failure if the http request failed
        if (replayChecked) return;
        replayChecked = true;

        GM.xmlHttpRequest({
            method: "GET",
            url: 'http://awbw.mooo.com/hasReplay.php?gameID='+gameID,
            onload: success,
            onerror: failure
        });
    }

    function downloadFile(data, filename, type) {
        var file = data;
        if (window.navigator.msSaveOrOpenBlob) {// IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        }
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    function downloadReplay(dButton) {
        if (downloadedData) {
            downloadFile(downloadedData, gameID + '.zip', 'application/zip');
            return true;
        }

        if (downloadStarted) return;
        downloadStarted = true;

        dButton.textContent = 'Downloading...';

        GM.xmlHttpRequest({
            method: "GET",
            url: 'http://awbw.mooo.com/downloadReplay.php?gameID='+gameID,
            responseType: "blob",
            onload: function(response) {
                dButton.textContent = 'Click to save';
                downloadedData = response.response;
            },
            onerror: function() {
                dButton.textContent = 'Error, try later';
            }
        });
    }

    function reloadReplay() {
        if (replayLoaded) return; //Don't let people mash the button
        replayLoaded = true;
        var dButton = downloadButton.firstChild.firstChild.lastChild;
        dButton.textContent = 'Please wait...';

        GM.xmlHttpRequest({
            method: "GET",
            url: 'http://awbw.mooo.com/reloadReplay.php?gameID='+gameID,
            onload: function(response) {
                switch(response.responseText) {
                    case 'success': dButton.textContent = 'Done, reloading'; location.reload(); break;
                    case 'error': dButton.textContent = 'Error, try later'; break;
                    case 'noReplay': dButton.textContent = 'Replay not in archive'; break;
                    default: dButton.textContent = 'Unknown error';
                }
            },
            onerror: function(response) {
                dButton.textContent = 'Error, try later';
            }
        });
    }

    //Check if game is no longer archived
    var downloadDirectButton;
    if (document.querySelector('.replay-open')) {
        if (document.querySelector('.replay-open').style.display !== 'none') return;
        var downloadButton = document.createElement('div');

        downloadButton.style = 'margin-left: 4px; width: auto !important; display: flex;';
        downloadButton.className = 'replay-download game-tools-btn';
        downloadButton.innerHTML = '<span class="game-tools-bg small_text" style="padding: 0 8px;">'+
            '<a class="center" style="width: 100%; height: 100%;">'+
            '<img src="terrain/divehide.gif" alt="Reload replay" style="margin-right: 4px;">'+
            '<span>Reload replay</span>'+
            '</a>'+
            '</span>';
        downloadButton.addEventListener('click', reloadReplay);

        document.getElementById('game-menu-controls').lastElementChild.appendChild(downloadButton);

        downloadDirectButton = document.createElement('div');
        downloadDirectButton.style = 'margin-left: 4px; width: auto !important; display: flex;';
        downloadDirectButton.className = 'replay-download game-tools-btn';
        downloadDirectButton.innerHTML = '<span class="game-tools-bg small_text" style="padding: 0 8px;">'+
            '<a class="center" style="width: 100%; height: 100%;">'+
            '<img src="terrain/divehide.gif" alt="Download" style="margin-right: 4px;">'+
            '<span>Download</span>'+
            '</a>'+
            '</span>';
        downloadDirectButton.addEventListener('click', function() {
            var dButton = downloadDirectButton.firstChild.firstChild.lastChild;
            if (replayChecked) {
                //Go directly to download
                if (replayExists) downloadReplay(dButton);
                return;
            }

            //Check if the replay exists first
            dButton.textContent = 'Please wait...';
            hasReplay(function(response) {
                switch(response.responseText) {
                    case 'yes': replayExists = true; downloadReplay(dButton); break;
                    case 'no': dButton.textContent = 'Replay not in archive'; break;
                    default: dButton.textContent = 'Unknown error';
                }
            }, function() {
                dButton.textContent = 'Error, try later';
            });
        });

        document.getElementById('game-menu-controls').lastElementChild.appendChild(downloadDirectButton);
    }
    else if (window.location.href.indexOf('replay_download') >= 0 && document.body.textContent === '{"err":true,"message":"Game is not active, can not download"}') {
        document.body.textContent = 'Please wait...';
        //Check if the replay is in the archive, and add a button to download if it is
        hasReplay(function(response) {
            if (response.responseText == 'no') {
                document.body.textContent = 'Replay not in archive';
                return;
            }
            if (response.responseText != 'yes') {
                document.body.textContent = 'Archive encountered unknown error';
                return;
            }
            downloadDirectButton = document.createElement('div');
            downloadDirectButton.innerHTML = '<a style="cursor: pointer; border: 1px solid; padding: 5px;">'+
                '<img src="terrain/divehide.gif" alt="Download" style="margin-right: 4px;">'+
                '<span>Download replay from archive</span>'+
                '</a>';
            downloadDirectButton.addEventListener('click', function() {
                downloadReplay(downloadDirectButton.firstChild.lastChild);
            });

            document.body.innerHTML = '';
            document.body.appendChild(downloadDirectButton);
        }, function() {
            document.body.textContent = 'Error, archive not responding, try later';
        });
    }
})();