// ==UserScript==
// @name         sachnoiviet downloader
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  chạy rồi, nhưng có chút chậm!
// @author       Nagi Springfield
// @match        *sachnoiviet.com/sach-noi/*
// @grant        none
// @license      MIT
// @copyright    2021, hungba (https://openuserjs.org/users/hungba)
// @downloadURL https://update.greasyfork.org/scripts/419669/sachnoiviet%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/419669/sachnoiviet%20downloader.meta.js
// ==/UserScript==

(function() {
    // create btn download all
    $('.fr.like').after("<div id='download-all' class='fr like' style='cursor: pointer; margin-right: 10px'><a>Download all</a></div>");

    $('#download-all').click(function() {
        var links = $('#jp_container_1 .jp-playlist .jp-free-media a');
        links.map(function(index, item) {
            setTimeout(function timer() {
                var fname = item.href.split('/');
                fname = fname[fname.length - 1];
                fname = decodeURI(fname);
                // item.setAttribute('download', fname);
                // item.removeAttribute('target');
                download(item.href, fname);
            }, 5000 * index);
        });
    });

    function download(url, fileName) {
        console.log('start download: ' + fileName);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onprogress = function(event) {
            if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total)*100;
                //yourShowProgressFunction(percentComplete);
            }
        };

        xhr.onload = function(event) {
            if (this.status == 200) {
                _saveBlob(this.response, fileName);
            }
            else {
                //yourErrorFunction()
            }
        };

        xhr.onerror = function(event){
            //yourErrorFunction()
        };

        xhr.send();
    }
    function _saveBlob(response, fileName) {
        if(navigator.msSaveBlob){
            //OK for IE10+
            navigator.msSaveBlob(response, fileName);
        }
        else{
            _html5Saver(response, fileName);
        }
    }

    function _html5Saver(blob , fileName) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        document.body.removeChild(a);
    }
})();