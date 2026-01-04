
// ==UserScript==
// @name         Increase Moodle login timeout warning.
// @name:zh-TW   Increase Moodle login timeout warning.
// @name:zh-HK   Increase Moodle login timeout warning.
// @name:zh-CN   Increase Moodle login timeout warning.
// @name:ja      Increase Moodle login timeout warning.
// @name:kr      Increase Moodle login timeout warning.
// @name:ar      Increase Moodle login timeout warning.
// @name:bg      Increase Moodle login timeout warning.
// @name:cs      Increase Moodle login timeout warning.
// @name:da      Increase Moodle login timeout warning.
// @name:de      Increase Moodle login timeout warning.
// @name:el      Increase Moodle login timeout warning.
// @name:eo      Increase Moodle login timeout warning.
// @name:es      Increase Moodle login timeout warning.
// @name:fi      Increase Moodle login timeout warning.
// @name:fr      Increase Moodle login timeout warning.
// @name:fr-CA   Increase Moodle login timeout warning.
// @name:he      Increase Moodle login timeout warning.
// @name:hu      Increase Moodle login timeout warning.
// @name:id      Increase Moodle login timeout warning.
// @name:it      Increase Moodle login timeout warning.
// @name:ko      Increase Moodle login timeout warning.
// @name:nb      Increase Moodle login timeout warning.
// @name:nl      Increase Moodle login timeout warning.
// @name:pl      Increase Moodle login timeout warning.
// @name:pt-BR   Increase Moodle login timeout warning.
// @name:ro      Increase Moodle login timeout warning.
// @name:ru      Increase Moodle login timeout warning.
// @name:sk      Increase Moodle login timeout warning.
// @name:sr      Increase Moodle login timeout warning.
// @name:sv      Increase Moodle login timeout warning.
// @name:th      Increase Moodle login timeout warning.
// @name:tr      Increase Moodle login timeout warning.
// @name:uk      Increase Moodle login timeout warning.
// @name:ug      Increase Moodle login timeout warning.
// @name:vi      Increase Moodle login timeout warning.
// @description         Increase Moodle login timeout warning. Prevent logout
// @description:ar      Increase Moodle login timeout warning. Prevent logout
// @description:bg      Increase Moodle login timeout warning. Prevent logout
// @description:da      Increase Moodle login timeout warning. Prevent logout
// @description:de      Increase Moodle login timeout warning. Prevent logout
// @description:el      Increase Moodle login timeout warning. Prevent logout
// @description:eo      Increase Moodle login timeout warning. Prevent logout
// @description:fi      Increase Moodle login timeout warning. Prevent logout
// @description:fr-CA   Increase Moodle login timeout warning. Prevent logout
// @description:he      Increase Moodle login timeout warning. Prevent logout
// @description:hu      Increase Moodle login timeout warning. Prevent logout
// @description:id      Increase Moodle login timeout warning. Prevent logout
// @description:it      Increase Moodle login timeout warning. Prevent logout
// @description:ko      Increase Moodle login timeout warning. Prevent logout
// @description:nb      Increase Moodle login timeout warning. Prevent logout
// @description:nl      Increase Moodle login timeout warning. Prevent logout
// @description:pl      Increase Moodle login timeout warning. Prevent logout
// @description:pt-BR   Increase Moodle login timeout warning. Prevent logout
// @description:ro      Increase Moodle login timeout warning. Prevent logout
// @description:ru      Increase Moodle login timeout warning. Prevent logout
// @description:sk      Increase Moodle login timeout warning. Prevent logout
// @description:sr      Increase Moodle login timeout warning. Prevent logout
// @description:sv      Increase Moodle login timeout warning. Prevent logout
// @description:th      Increase Moodle login timeout warning. Prevent logout
// @description:tr      Increase Moodle login timeout warning. Prevent logout
// @description:uk      Increase Moodle login timeout warning. Prevent logout
// @description:ug      Increase Moodle login timeout warning. Prevent logout
// @description:vi      Increase Moodle login timeout warning. Prevent logout
// @homepage     https://github.com/DeveloperMDCM/
// @version      0.2
// @description        Increase Moodle login timeout warning. Prevent logout
// @description:zh-TW  Increase Moodle login timeout warning. Prevent logout
// @description:zh-HK  Increase Moodle login timeout warning. Prevent logout
// @description:zh-CN  Increase Moodle login timeout warning. Prevent logout
// @description:ja     Increase Moodle login timeout warning. Prevent logout
// @description:kr     Increase Moodle login timeout warning. Prevent logout
// @description:fr     Increase Moodle login timeout warning. Prevent logout
// @description:cs     Increase Moodle login timeout warning. Prevent logout
// @description:en     Increase Moodle login timeout warning. Prevent logout
// @description:es     Increase Moodle login timeout warning. Prevent logout
// @author       MDCM
// @match        https://*.pv.cecar.edu.co/*
// @icon         https://i.pinimg.com/280x280_RS/8c/70/64/8c706467626f2c37489fea4f93ad1306.jpg
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @license MIT
// @namespace https://github.com/DeveloperMDCM/
// @downloadURL https://update.greasyfork.org/scripts/459988/Increase%20Moodle%20login%20timeout%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/459988/Increase%20Moodle%20login%20timeout%20warning.meta.js
// ==/UserScript==

(function () {
  // Moodle tools by: DeveloperMDCM
  "use strict";
  let valido = true;
  setInterval(() => {
     const btnSession = document.querySelector('#page-my-index > div:nth-child(7) > div.modal.moodle-has-zindex.show > div > div > div.modal-footer > button.btn.btn-primary')
    const btn2Session = document.querySelector("#page-course-view-grid > div:nth-child(7) > div.modal.moodle-has-zindex.show > div > div > div.modal-footer > button.btn.btn-primary")
const btn3Session = document.querySelector("#page-mod-assign-view > div:nth-child(6) > div.modal.moodle-has-zindex.show > div > div > div.modal-footer > button.btn.btn-primary");

const btn4Session = document.querySelector("#page-mod-assign-view > div:nth-child(7) > div.modal.moodle-has-zindex.show > div > div > div.modal-footer > button.btn.btn-primary");
    if(btnSession != undefined || btn2Session != undefined || btn3Session != undefined || btn4Session != undefined ) {
        btnSession.click();
        btn2Session.click();
bt3Session.click();
        console.log('Delete Session timeout by: MDCM')
    }
  },1000)

})();
