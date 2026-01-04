// ==UserScript==
// @name         FreeLogoDesign去水印
// @namespace    freelogodesign
// @version      1.0
// @description  FreeLogoDesign 去水印
// @author       Gari
// @match        *://logo-maker.freelogodesign.org/*
// @icon         https://logo-maker.freelogodesign.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474810/FreeLogoDesign%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/474810/FreeLogoDesign%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // fl-dropcontainer
    console.log("gariScript 启动!");

    class freeLogoHelper {
        constructor(params) {
            this.background = typeof(params.watermark.background) === 'boolean' ? params.watermark.background : false;
        }

        removeWatermarkBackground () {
            const styleEle = document.createElement('style');
            styleEle.innerText='.fl-dropcontainer>svg {display:none;}';
            document.body.appendChild(styleEle);
        }

        RemoveWatermarkAIImgCallback () {
            return function(mutationsList, observer) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                            let newNodes = Array.from(mutation.addedNodes).filter(node => node.hasAttribute('data-chat-id'));
                            if (newNodes.length > 0) {
                                mutation.addedNodes.forEach(function (node){
                                    const nodeImgs = node.querySelectorAll('img');
                                    nodeImgs.forEach(function (nodeImg){
                                        const imgSrc = nodeImg.src;
                                        if (imgSrc.match(/\?./)) {
                                            nodeImg.src = imgSrc.replace(/\?(.*)$/, '');
                                            console.log(imgSrc)
                                            console.log(nodeImg.src)
                                        }
                                    })
                                });
                            }
                        }

                    }
                }
            };
        };

        RemoveWatermarkAIImgInterval () {
            return function() {
                const chImg = document.querySelectorAll("div.custom-html img");
                chImg.forEach(function (nodeImg){
                    const imgSrc = nodeImg.src;
                    if (imgSrc.match(/\?./)) {
                        nodeImg.src = imgSrc.replace(/\?(.*)$/, '');
                        console.log(imgSrc)
                        console.log(nodeImg.src)
                    }
                })
                const amrImg = document.querySelectorAll("div.ant-modal-root img");
                amrImg.forEach(function (nodeImg){
                    const imgSrc = nodeImg.src;
                    if (imgSrc.match(/\?./)) {
                        nodeImg.src = imgSrc.replace(/\?(.*)$/, '');
                        console.log(imgSrc)
                        console.log(nodeImg.src)
                    }
                })
            };
        };

        run () {
            if (this.background === false) {
                this.removeWatermarkBackground();
            }
        }
    }

    const freeLogo = new freeLogoHelper({
        watermark : {
            background : false,
        }
    });
    freeLogo.run();
})();