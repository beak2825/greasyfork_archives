// ==UserScript==
// @name         文心一言去水印
// @namespace    yiyan
// @version      1.2
// @description  文心一言 背景去水印, 图片去水印
// @author       Gari
// @match        *://yiyan.baidu.com/*
// @icon         https://nlp-eb.cdn.bcebos.com/logo/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474808/%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/474808/%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("gariScript 启动!");

    class yiyanHelper {
        constructor(params) {
            this.background = typeof(params.watermark.background) === 'boolean' ? params.watermark.background : true;
            this.img = typeof(params.watermark.img) === 'boolean' ? params.watermark.img : true;
            this.imgTimerID = {};
        }

        removeWatermarkBackground() {
            const styleEle = document.createElement('style');
            styleEle.innerText='div[style^="pointer-events"] {height:0 !important;width:0 !important;transform: rotate(90deg);overflow: hidden;}';
            document.body.appendChild(styleEle);
        }

        removeWatermarkAIImg(nodeClass) {
            return function() {
                const imgList = document.querySelectorAll("div."+nodeClass+" img");
                imgList.forEach(function (nodeImg){
                    const imgSrc = nodeImg.src;
                    if (imgSrc.indexOf('wm_ai')!=-1 && imgSrc.match(/\?./)) {
                        nodeImg.src = imgSrc.replace(/\?(.*)$/, '');
                    }
                })
            };
        };

        isActiveCurrentPageToRemove(nodeClass) {
            const hiddenProperty = 'hidden' in document ? 'hidden' :
                'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' :
                'msHidden' in document ? 'msHidden' :
                null;
            if (hiddenProperty) {
              const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
              const that = this;
              const onVisibilityChange = function() {
                if (!document[hiddenProperty]) {
                  that.imgTimerID[nodeClass] || (that.imgTimerID[nodeClass] = setInterval(that.removeWatermarkAIImg(nodeClass), 200));
                } else {
                  that.imgTimerID[nodeClass] && (clearInterval(that.imgTimerID[nodeClass]) || (that.imgTimerID[nodeClass] = ''));
                }
              };
              document.addEventListener(visibilityChangeEvent, onVisibilityChange);
            }
        }

        checkPageAndObservePage(nodeClass) {
            const that = this;
            return function() {
                const dialogContent = document.querySelector('.'+nodeClass);
                if (dialogContent) {
                    const observer = new MutationObserver(that.removeWatermarkAIImgCallback());
                    observer.observe(dialogContent, {
                        childList: true,
                        subtree: true
                    });
                    that.imgTimerID[nodeClass] && clearInterval(that.imgTimerID[nodeClass]) || (that.imgTimerID[nodeClass] = '');
                }
            }
        }

        removeWatermarkAIImgCallback() {
            return function(mutationsList, observer) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                          mutation.addedNodes.forEach(function(node) {
                            if (node.nodeName === 'IMG') {
                              const imgSrc = node.src;
                              if (imgSrc.indexOf('wm_ai')!=-1 && imgSrc.match(/\?./)) {
                                node.src = imgSrc.replace(/\?(.*)$/, '');
                              }
                            } else {
                              const imgList = node.getElementsByTagName('img');
                              for (let i = 0; i < imgList.length; i++) {
                                const imgSrc = imgList[i].src;
                                if (imgSrc.indexOf('wm_ai')!=-1 && imgSrc.match(/\?./)) {
                                  imgList[i].src = imgSrc.replace(/\?(.*)$/, '');
                                }
                              }
                            }
                          });
                        }
                    }
                }
            };
        };

        run() {
            this.background && this.removeWatermarkBackground();
            let className;
            // this.img && (className = 'custom-html') && ((this.imgTimerID[className] = setInterval(this.removeWatermarkAIImg(className), 200)) && this.isActiveCurrentPageToRemove(className));
            this.img && (className = 'ant-modal-root') && ((this.imgTimerID[className] = setInterval(this.removeWatermarkAIImg(className), 200)) && this.isActiveCurrentPageToRemove(className));
            this.img && (className = 'dialogueCardListContent') && (this.imgTimerID[className] = setInterval(this.checkPageAndObservePage(className), 200));
            // this.img && (className = 'ant-modal-root') && (this.imgTimerID[className] = setInterval(this.checkPageAndObservePage(className), 200)); //todo invalid
        }
    }

    const config = {
        watermark:{
            background:true,
            img:true,
        }
    };
    const _yiyan = new yiyanHelper(config);
    _yiyan.run();
})();