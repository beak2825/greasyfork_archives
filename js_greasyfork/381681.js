// ==UserScript==
// @name         通用视频网站控制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://hdtv.neu6.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381681/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/381681/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

'use strict';

var cm_raiseVolumn = null;
var cm_reduceVolumn = null;
var cm_progressForward = null;
var cm_progressBackward = null;
var cm_speedUp = null;
var cm_speedDown = null;
var cm_fullPage = null;
var cm_fullScreen = null;

function cm_main() {

}

function cm_initSite() {

};

function cm_addHotKey() {
    $(document).keyup(function(e) {
        switch (e.keyCode === 31) {
        }
    });
}

