// ==UserScript==
// @name         Movieffm 名偵探柯南日語
// @namespace    http://tampermonkey.net/
// @version      2025-04-04
// @description  Auto Next Video!
// @author       LODDY
// @license      CC-BY-NC-SA-1.0
// @match        https://www.movieffm.net/drama/218627/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=movieffm.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.js
// @downloadURL https://update.greasyfork.org/scripts/529316/Movieffm%20%E5%90%8D%E5%81%B5%E6%8E%A2%E6%9F%AF%E5%8D%97%E6%97%A5%E8%AA%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/529316/Movieffm%20%E5%90%8D%E5%81%B5%E6%8E%A2%E6%9F%AF%E5%8D%97%E6%97%A5%E8%AA%9E.meta.js
// ==/UserScript==

(() => {
    'use strict';
    var checkNowTime = '';
    var checkFullTime = '';

    var spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        keyCode: 32,
        code: 'Space',
        which: 32,
        bubbles: true,
        cancelable: true
    });

    // 取得現有時間
    checkTime();
    function checkTime() {
        //art-control art-control-time
        var onloadCheckTime = function() {
            const targetNode = document.querySelector('div.art-control.art-control-time');
            //console.log(targetNode);
            //console.log(targetNode.innerText);
            var targetNodeArray = targetNode.innerText.split(' / ');
            var nowTime = targetNodeArray[0];
            var fullTime = targetNodeArray[1];
            //console.log(nowTime);
            //console.log(fullTime);
            if (nowTime == fullTime) {
                if (fullTime != '00:00') {
                    getNextVideo();
                } else {
                    setTimeout(onloadCheckTime, 1000);
                }
            } else {
                setTimeout(onloadCheckTime, 1000);
            }
        }
        onloadCheckTime();
    }

    function getNowTime() {
        //art-control art-control-time
        var onloadGetNowTime = function() {
            const targetNode = document.querySelector('div.art-control.art-control-time');
            //console.log(targetNode);
            //console.log(targetNode.innerText);
            var targetNodeArray = targetNode.innerText.split(' / ');
            checkNowTime = targetNodeArray[0];
            //console.log('======checkNowTime======');
            //console.log(checkNowTime);
            //console.log('========================');
            return checkNowTime;
        }
        onloadGetNowTime();
    }

    function getFullTime() {
        //art-control art-control-time
        var onloadGetFullTime = function() {
            const targetNode = document.querySelector('div.art-control.art-control-time');
            //console.log(targetNode);
            //console.log(targetNode.innerText);
            var targetNodeArray = targetNode.innerText.split(' / ');
            checkFullTime = targetNodeArray[1];
            //console.log('======checkFullTime======');
            //console.log(checkFullTime);
            //console.log('=========================');
            return checkFullTime;
        }
        onloadGetFullTime();
    }

    function getNextVideo() {
        //active dooplay_player_option
        var onloadGetNowVideo = function() {
            const targetNode = document.querySelector('a.active.dooplay_player_option');
            //console.log("start get next video");
            //console.log(targetNode);
            //console.log(targetNode.innerText);
            var nowVideo = targetNode.innerText;
            //var nextVideo = targetNodeArray[1];
            //console.log(nowVideo);
            if (parseInt(nowVideo) >= 0) {
                var onloadGetNextVideo = function() {
                    const targetNextPage = document.querySelectorAll('div.sourcelist');
                    //console.log(targetNextPage);
                    targetNextPage.forEach((elements) => {
                        //console.log(elements.style.display)
                        if (elements.style.display != 'none') {
                            //console.log(targetNextPage[i].children)
                            //console.log(targetNextPage[i].children[0])
                            //console.log(targetNextPage[i].children[0].childNodes[parseInt(nowVideo)])
                            //console.log(elements.children[0].childNodes[parseInt(nowVideo)])
                            var targetNextNode = elements.children[0].childNodes[parseInt(nowVideo)];
                            $(targetNextNode).click();
                            targetNextNode.click();
                        }
                    });

                    var onloadCheckVideoLoaded = function() {
                        getNowTime();
                        //console.log(checkNowTime)
                        //console.log(checkNowTime == '00:00')
                        if (checkNowTime == '00:00') {
                            var onloadStartVideo = function() {
                                const targetNodeStart = document.querySelector('i.art-icon.art-icon-play.hint--rounded.hint--top');
                                getFullTime();
                                //console.log(checkFullTime)
                                //console.log(checkFullTime != '00:00')
                                if (checkFullTime != '00:00') {
                                    sleep(2000);
                                    targetNodeStart.addEventListener('click', function () {
                                        console.log('Clicked Start');
                                    }, true);
                                    targetNodeStart.click();
                                    //document.dispatchEvent(spaceEvent);
                                    const targetNodeFullScreen = document.querySelector('div.art-control.art-control-fullscreen.hint--rounded.hint--top');
                                    targetNodeFullScreen.addEventListener('click', function () {
                                        console.log('Clicked FullScreen');
                                    }, true);
                                    targetNodeFullScreen.click();
                                    checkTime();
                                } else {
                                    setTimeout(onloadStartVideo, 1000);
                                }
                            }
                            onloadStartVideo();
                        } else {
                            setTimeout(onloadCheckVideoLoaded, 1000);
                        }

                    }
                    onloadCheckVideoLoaded();
                }
                onloadGetNextVideo();
            } else {
                setTimeout(onloadGetNowVideo, 1000);
            }
        }
        onloadGetNowVideo();
    }

    async function sleep(duration) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }
})();
