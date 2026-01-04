// ==UserScript==
// @name         Nicovideo:GINZA-HTML5 autoset 1080p
// @namespace    https://twitter.com/tigerauge0
// @version      1.12
// @description  If 1080p is available, set to 1080p automatically.
// @author       HAC
// @match        http://www.nicovideo.jp/watch/*
// @match        https://www.nicovideo.jp/watch/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/37305/Nicovideo%3AGINZA-HTML5%20autoset%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/37305/Nicovideo%3AGINZA-HTML5%20autoset%201080p.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver(function (mutationRecords, thisObserver) {
        // 最初に自動と低が表示されてから、後で.PlayerOptionDropdown-menuノード指定で変更が入り、細かい画質が追加される
        for(let mutationRecord of mutationRecords) {
            let dropdownMenuDomObj;
            // .PlayerOptionDropdown-menu
            dropdownMenuDomObj = mutationRecord.target;
            if(dropdownMenuDomObj.classList.contains('PlayerOptionDropdown-menu')) {
                if(dropdownMenuDomObj.childNodes.length) {
                    let dropdownItemTopDomObj = dropdownMenuDomObj.childNodes[0];
                    // .PlayerOptionDropdown-menu > .PlayerOptionDropdownItem
                    if(dropdownItemTopDomObj.classList.contains('PlayerOptionDropdownItem')) {
                        if(dropdownItemTopDomObj.childNodes.length) {
                            let dropdownItemTopInnerDomObj = dropdownItemTopDomObj.childNodes[0];
                            // .PlayerOptionDropdown-menu > .PlayerOptionDropdownItem > .PlayerOptionDropdownItem-inner
                            if(dropdownItemTopInnerDomObj.classList.contains('PlayerOptionDropdownItem-inner')) {
                                if(/1080p/.test(dropdownItemTopInnerDomObj.textContent)) {
                                    if(!dropdownItemTopDomObj.classList.contains('is-disabled')) {
                                        console.log("1080p is available.");
                                        dropdownItemTopInnerDomObj.click();
                                        let autoPlayDomObj = document.getElementById('AutoPlayMenuItem-on');
                                        if( autoPlayDomObj && autoPlayDomObj.checked === true){
                                            let videoContainerDomObj = document.getElementById('MainVideoPlayer');
                                            if(videoContainerDomObj.getElementsByTagName('video').length) {
                                                let videoDomObj = videoContainerDomObj.getElementsByTagName('video')[0];
                                                videoDomObj.addEventListener('loadedmetadata', function() {
                                                    console.log("Autoplay start.");
                                                    videoDomObj.play();
                                                });
                                            }
                                        }
                                    } else {
                                        console.log("1080p is not available because of low-quality mode.");
                                    }
                                } else {
                                    console.log("1080p doesn't exist.");
                                }
                                // 問題点: .PlayerOptionDropdownItem[0]が検出できなかった場合、Observeし続ける
                                thisObserver.disconnect();
                                break;
                            }
                        }
                    }
                }
            }
        }
    });
    observer.observe(document.getElementById('js-app'), { childList: true, subtree: true});
})();