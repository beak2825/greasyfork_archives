// ==UserScript==
// @name         禁用Alert
// @namespace    https://gitee.com/erike77/
// @version      1.0.0
// @description  将原始alert函数备份为original_alert函数，并重写alert函数以阻止弹窗警告
// @author       Particle_G
// @match        */*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393611/%E7%A6%81%E7%94%A8Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/393611/%E7%A6%81%E7%94%A8Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.original_alert = window.alert;
    window.alert = (text) => {console.log(text);};
})();