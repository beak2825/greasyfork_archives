// ==UserScript==
// @name         my csdn layout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to change csdn css!
// @author       bo.zou
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/472700/my%20csdn%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/472700/my%20csdn%20layout.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // Your code here...
   toHandle()

    function toHandle() {
        var toDeleteElementClass = [ 'toolbar-inside','more-toolbox-new','blog_container_aside','recommend-right_aside','recommendAdBox','csdn-side-toolbar','recommendAdBox','csdn-side-toolbar', 'article-info-box',
                              'column-group', 'recommendNps', 'copyright-box', , 'recommend-nps-box', 'template-box', 'blog-footer-bottom', 'csdn-toolbar']

        for (const e of toDeleteElementClass) {
            deleteElement(e)
        }

        var toClickButtonClass = ['look-more-preCode', 'look-more-preCode']
        for (const e of toClickButtonClass) {
            clickButton(e)
        }
        scroll(-100,0)
        fullScreen()

    }




    // Your function here...
    function deleteElement(className){
        var nodes = document.getElementsByClassName(className);
        if (nodes && nodes[0] && nodes[0].style) {

            nodes[0].setAttribute('style', 'display: none !important');
            nodes[0].parentNode.removeChild(nodes[0]);
            // nodes[0].style.width = 0;
        }
    }
    function clickButton(className){
        var nodes = document.getElementsByClassName(className);
        if (nodes && nodes[0]) {
            for (const node of nodes) {
               node.click()
            }
        }
    }

    function fullScreen() {
        let nodes = document.getElementsByClassName('container');
        if (nodes && nodes[0] && nodes[0].style) {
            nodes[0].setAttribute('style', `width: ${(document.documentElement.clientWidth)/1.6}px !important`);
        }

        var changeSizeElement = ['blog-content-box', 'recommend-box', 'comment-box', 'second-recommend-box', 'recommend-item-box', 'content-box']
        for (const e of changeSizeElement) {
            let nodes = document.getElementsByClassName(e);
            if (nodes && nodes[0] && nodes[0].style) {
                for (const node of nodes){
                    node.setAttribute('style', `width: ${document.documentElement.clientWidth*2/3}px !important`);
                }


            }
        }


    }
})();