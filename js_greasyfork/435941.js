// ==UserScript==
// @name         屏蔽CSDN广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通过css屏蔽csdn广告
// @author       番茄炒鸡蛋
// @match        https://blog.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/435941/%E5%B1%8F%E8%94%BDCSDN%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/435941/%E5%B1%8F%E8%94%BDCSDN%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let csdn_css=`
      .blog_container_aside,.blog-footer-bottom,.more-toolbox-new,.recommend-box,.csdn-side-toolbar {
        display:none
      }
     `
    GM_addStyle(csdn_css);
})();