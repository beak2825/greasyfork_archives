// ==UserScript==
// @name         国资e学播放器永久显示控制条
// @namespace    https://penicillin.github.io/
// @version      0.1
// @description  国资e学播放器永久显示控制进度条
// @author       Penicillin
// @match        https://elearning.tcsasac.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460630/%E5%9B%BD%E8%B5%84e%E5%AD%A6%E6%92%AD%E6%94%BE%E5%99%A8%E6%B0%B8%E4%B9%85%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/460630/%E5%9B%BD%E8%B5%84e%E5%AD%A6%E6%92%AD%E6%94%BE%E5%99%A8%E6%B0%B8%E4%B9%85%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
var styleElement = document.createElement('style');
document.getElementsByTagName('head')[0].appendChild(styleElement);
styleElement.append('.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {opacity: unset !important;}');
})();