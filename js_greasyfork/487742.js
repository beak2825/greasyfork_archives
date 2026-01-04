// ==UserScript==
// @name         Disable x2 when LBM hold
// @namespace    ytb-tools
// @version      0.1.1
// @description  This user-script for those who are annoyed by the feature that speeds up video while holding down the mouse button.
// @author       kvark
// @license      MIT
// @match        http*://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/487742/Disable%20x2%20when%20LBM%20hold.user.js
// @updateURL https://update.greasyfork.org/scripts/487742/Disable%20x2%20when%20LBM%20hold.meta.js
// ==/UserScript==

//Options section
const disableLBMx2 = true; //disable x2 speed when mouse left button hold.
const disableSPBx2 = false; //same for space bar. But this may break some inputs.
//End of options section

(()=>{
    'use strict';

    class bezel {
        constructor(cls, d)
        {
            const node = document.createElement('div');
            node.className = 'ytp-bezel-scradd-' + cls;
            node.style = 'display: none;';
            node.innerHTML = `<div class="ytp-bezel">
                            <div class="ytp-bezel-icon">
                              <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                                <path class="ytp-svg-fill" d="${d}"></path>
                              </svg>
                            </div>
                          </div>`;
            this.node = node;
        }
        show(){
            this.node.style = '';
            setTimeout(()=>{this.node.style = 'display: none;'}, 500);
        }
    }

    function triggerMouseEvent(node, eventType) {
        const mouseEvent = document.createEvent('MouseEvents');
        mouseEvent.initEvent(eventType, true, true);
        node.dispatchEvent(mouseEvent);
    }

    function loop(){
        setTimeout(()=>{
            const videocont_list = document.querySelectorAll('div.html5-video-container');
            if (videocont_list[0]){
                for (let videocont of videocont_list){
                    if (videocont.evAdded)
                        continue;
                    //console.log('event added');
                    videocont.addEventListener('mousedown', (e)=>{
                        e.stopImmediatePropagation();
                        triggerMouseEvent(videocont.parentNode, "mousedown");
                    }, true);
                    const bezel_play = new bezel('play', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');
                    const bezel_pause = new bezel('pause', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');
                    videocont.after(bezel_play.node, bezel_pause.node);
                    videocont.addEventListener('click', (e)=>{
                        e.stopImmediatePropagation();
                        const mainvideo = videocont.querySelector('video.html5-main-video');
                        if (mainvideo.paused){
                            mainvideo.play();
                            bezel_play.show();
                        }
                        else {
                            mainvideo.pause();
                            bezel_pause.show();
                        }
                    }, true);
                    videocont.evAdded = true;
                }
            }
            loop();
        }, 50)
    }

    if (disableLBMx2) loop();

    if (disableSPBx2) {
        document.addEventListener('keydown', (e)=>{
            const elname = e.target.nodeName
            const elid = e.target.id
            if(e.keyCode == 32 && elname != 'INPUT' && elname != 'TEXTAREA' && elname != 'BUTTON' && elid != 'contenteditable-root' ) {
                e.stopImmediatePropagation();
                e.preventDefault();
                //console.log("key pressed in: " + elname);
            }
        }, true);
    }
})();