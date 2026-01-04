// ==UserScript==
// @name         Youku Downloader
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  try to take over the world!
// @author       You
// @match        https://v.youku.com/v_show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387856/Youku%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/387856/Youku%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
        (function() {
        function ajaxEventTrigger(event) {
            var ajaxEvent = new CustomEvent(event, { detail: this });
            window.dispatchEvent(ajaxEvent);
        };
        var oldXHR = window.XMLHttpRequest;
        function newXHR() {
            var realXHR = new oldXHR();
            realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
            return realXHR;
        };
        window.XMLHttpRequest = newXHR;
    })();

    // Intercept to Ajax to ".m3u8?"
    // to get file list contents including ....
    var m3u8 = '';
    window.addEventListener('ajaxLoad', event => {
        if (event.detail.responseURL.indexOf('.m3u8?') > 0) {
            m3u8 = event.detail.responseText;
        };
    });

    var irAlbumName = '';
    window.addEventListener('load', () => {
        let module_basic_sub = document.querySelector("#module_basic_sub");
        module_basic_sub.insertAdjacentHTML('beforeend', '<a class="v-sub-btn" id="superDownload" href="###">超级下载</a>');
        let superDownloadEle = document.querySelector("#superDownload");
        let metairAlbumName = document.querySelector('meta[name="irAlbumName"]');
        if (metairAlbumName != null) {
            irAlbumName = metairAlbumName.attributes.content.value;
        }
        superDownloadEle.onclick = function () {
            if (this.innerText == '超级下载') {
                let targetAlbumNames = localStorage.getItem('YoukuSuperDownloadAlbumNames');
                if (targetAlbumNames == null || targetAlbumNames.length < 1) {
                    targetAlbumNames = irAlbumName;
                } else {
                    targetAlbumNames += ('|:|' + irAlbumName);
                };
                localStorage.setItem('YoukuSuperDownloadAlbumNames', targetAlbumNames);
                this.innerText = '停止超级下载'
                window.superDownload = true;
                superDownload();
            } else {
                removeAlbumFromList();
            };
        };

        if (isInTargetList() == true) {
            superDownloadEle.innerText = '停止超级下载';
            superDownload();
        };
    });

    function isInTargetList() {
        if (irAlbumName == '') {
            console.log('Cannot Get Album Name');
            return false;
        }
        let targetAlbumNames = localStorage.getItem('YoukuSuperDownloadAlbumNames');
        console.log('Target Album Names: ' + targetAlbumNames);
        if (targetAlbumNames != null) {
            let albumNames = targetAlbumNames.split('|:|');
            for (let i = 0; i < albumNames.length; i++) {
                if (albumNames[i] == irAlbumName) {
                    console.log('Album Name "' + irAlbumName + '" found!.');
                    return true;
                };
            };
            console.log('Album Name "' + irAlbumName + '" NOT found!.');
            return false;
        } else {
            console.log('Album Name "' + irAlbumName + '" NOT found!.');
            return false;
        };
    };

    function removeAlbumFromList() {
        console.log('Remove Album Name "' + irAlbumName + '".');
        window.superDownload = false;
        document.querySelector("#superDownload").innerText = '超级下载'
        let targetAlbumNames = localStorage.getItem('YoukuSuperDownloadAlbumNames');
        if (targetAlbumNames != null) {
            let albumNames = targetAlbumNames.split('|:|');
            let albumNames2 = [];
            for (let i = 0; i < albumNames.length; i++) {
                if (albumNames[i] != irAlbumName) {
                    albumNames2.push(albumNames[i]);
                };
            };
            targetAlbumNames = albumNames2.join('|:|');
        } else {
            targetAlbumNames = '';
        };
        console.log('Target Album Names: ' + targetAlbumNames);
        localStorage.setItem('YoukuSuperDownloadAlbumNames', targetAlbumNames);
    };

    function superDownload() {
        console.log('Start Super Download!');

        //Pause Video Player
        let videoPlayerController = document.querySelector("#ykPlayer div.h5player-dashboard div.h5-control-wrap div.control-icon.control-play-icon.control-pause-icon");
        if (videoPlayerController != null) {
            console.log('Pause Current Video Player!');
            videoPlayerController.click();
        };

        //Check if list been obtained.
        if (m3u8 == '') {
            console.log('Video File List have not been obtained. Planned to reload the page in 5 seconds...');
            setTimeout( ()=>{
                location.reload(true);
            }, 5000);
        } else {

            let irTitle = document.querySelector('meta[name="irTitle"]');
            let title = irTitle.attributes.content.value;
            console.log('Start Download Drama: ' + title);

            let myRe = /^https:\/\/.+-(\d+)\.ts\?.+$/gm;
            let myArray;
            let urlList = [];
            while ((myArray = myRe.exec(m3u8)) !== null) {
                urlList.push({fileNo: myArray[1], downloadLink: myArray[0]});
            };
            console.log('File List to be Downloaded:');
            console.log(urlList);

            (async function fetchVideoFiles() {
                console.log('Start Fetch Video Files:');
                let urlObj = urlList.shift();
                while (urlObj != undefined) {
                    if (window.superDownload == false) {
                        console.log('Download Stoped!');
                        removeAlbumFromList();
                        return;
                    } else {
                        console.log(urlObj);
                        try {
                            let response = await fetch(urlObj.downloadLink);
                            if (response.ok == false) {
                                throw 0;
                            };
                            let blob = await response.blob();
                            let tmp_a = document.createElement('a');
                            let url = window.URL.createObjectURL(blob);
                            tmp_a.href = url;
                            tmp_a.download = title + ' ' + urlObj.fileNo + '.ts';
                            tmp_a.click();
                            window.URL.revokeObjectURL(url);
                            tmp_a.remove();
                            console.log('Segment download finished! Start to download the next segment in 1 second....');
                            await Sleep(1000);
                            urlObj = urlList.shift();
                        } catch (err) {
                            location.reload(true);
                        };
                    };
                };

                console.log('This Drama has been Downloaded. Looking for Next Drama...');
                let curPageIndex = 0;
                let curEle = null;
                while (curEle == null) {
                    curPageIndex += 1;
                    curEle = document.querySelector("#listitem_page" + curPageIndex + " > div.current");
                    if (curPageIndex > 10 ) {
                        console.log('Cannot find current selection!');
                        return;
                    }
                };
                if (curEle.nextElementSibling != null) {
                    console.log('Go to next drama...');
                    await Sleep(1000);
                    curEle.nextElementSibling.firstElementChild.click();
                } else {
                    let divDramaTabDt = document.querySelector("#bpmodule-playpage-anthology > div.drama-tab > dt");
                    if (divDramaTabDt != null && divDramaTabDt.childElementCount > curPageIndex) {
                        console.log('Go to next drama in next page...');
                        divDramaTabDt.children[curPageIndex].firstElementChild.click();
                        await Sleep(1000);
                        let divNextPage = document.getElementById("listitem_page" + (curPageIndex + 1));
                        console.log(divNextPage);
                        divNextPage.firstElementChild.firstElementChild.click();
                    } else {
                        console.log('Download completed!');
                        removeAlbumFromList();
                    };
                };
            })();
        };
    };

    var Sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};
})();