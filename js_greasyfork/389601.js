// ==UserScript==
// @name         百度脑图全屏运行
// @namespace    qianshan
// @include      *://naotu.baidu.com/file/*
// @version      0.6
// @description  全屏化运行，双击右键即可切换！
// @author       千山
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389601/%E7%99%BE%E5%BA%A6%E8%84%91%E5%9B%BE%E5%85%A8%E5%B1%8F%E8%BF%90%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/389601/%E7%99%BE%E5%BA%A6%E8%84%91%E5%9B%BE%E5%85%A8%E5%B1%8F%E8%BF%90%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isFS = false;
    /*
     *全屏化
     *隐藏工具条以及头部
     */
    let backup = {
        __inited: false,
        minderEditorContainerTop: 0,
        minderEditorTop: 0,
    };

    function fullscreen(isIn) {
        if (typeof(isIn) === "undefined") {
            isIn = !isFS;
        }
        if (isIn && !backup.__inited) {
            backup.minderEditorContainerTop = $('.minder-editor-container').css("top");
            backup.minderEditorTop = $('.minder-editor-container .minder-editor').css("top");
            backup.__inited = true;
        }
        $('header').css("display", isIn ? "none" : "block");
        $('.minder-editor-container .top-tab').css("display", isIn ? "none" : "block");
        $('.minder-editor-container').css("top", isIn ? 0 : backup.minderEditorContainerTop);
        $('.minder-editor-container .minder-editor').css("top", isIn ? 0 : backup.minderEditorTop);
        isFS = isIn;
    }
    /*
     * 初始化
     * 1：全屏化
     * 2：监听节点点击，退出全屏
     */
    $(function() {
        fullscreen();
        $(".minder-editor-container").mouseup(function(evt) {
            if (evt.which === 3) {
                if (evt.originalEvent.detail === 2) {
                    fullscreen();
                }
            }
        });

    });
})();