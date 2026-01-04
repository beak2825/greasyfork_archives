// ==UserScript==
// @name         block ad BLT by nyanz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://blogtruyen.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408967/block%20ad%20BLT%20by%20nyanz.user.js
// @updateURL https://update.greasyfork.org/scripts/408967/block%20ad%20BLT%20by%20nyanz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('div.qc-css').remove();
    $('div.qc-inner').remove();
    $('div.adtrue-div').remove();
    $('section.bg-white comments').remove();
    $("div[style='display: block; position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; z-index: 2147483647; background-color: rgba(0, 0, 0, 0.7);']").remove();
    $("div[style='display: block; position: fixed; height: 480px; width: 600px; margin: -240px auto 0px -300px; left: 50%; top: 50%; z-index: 2147483647; line-height: 1;']").remove();
    $("section[style='background: none;margin: 10px auto;width: 1200px;height: 1200px;z-index: 999;position: relative;']").css('background', 'none');

    $("section div[style='float: left;']").remove();
    //comment BLT in reading page
    $("section.comments[style='padding: 3px; margin-bottom: 10px;    float: left; width: 530px;border-left: 5px solid #000000;    border-right: 5px solid #000000;']").remove();
    $("section[style='background: white;margin: 10px auto; width: 1200px;height: 1200px; z-index: 999; position: relative;']").css('height','auto');
    $("section div[style='background:#fff;width:368px;float:left;display:inline;max-height: 1150px;overflow-y: scroll;overflow-x: hidden;']").css('width','100%');

})();