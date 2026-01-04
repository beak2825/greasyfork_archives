// ==UserScript==
// @name         qyyx-pv-ui-compression
// @namespace    https://qyyx-pv-ui-compression.arsk.tech
// @version      0.0.9
// @description  营销平台UI脚本
// @author       KEKE.LIU
// @match        https://qyyx-pv.saicmotor.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=saicmotor.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491536/qyyx-pv-ui-compression.user.js
// @updateURL https://update.greasyfork.org/scripts/491536/qyyx-pv-ui-compression.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var styles = `.ant-layout { margin-top:auto }
  header { display:none !important; }
  #home-container #main-box { margin-top:0 !important; }
  #home-container #content-box { padding: 10px !important; }
  .table-query{ padding: 10px !important; border-radius:0 !important }
  .table-query .marginTop { margin-bottom: 2px; }
  .table-content { padding: 10px !important; border-radius:0 !important }
  .table-handle { margin: 5px 0 !important; }
  .ant-table table { color: black }
  .workDetails .left .list-carimg { width: 100%; gap: 5px; display:flex !important; flex-wrap: wrap !important; }
  .workDetails .left .list-carimg > div { width: 32% !important; }
  .workDetails .left .list-carimg > div > img[alt="example"] { width: 100% !important; margin:0 !important; height:auto; }
  .workDetails .left .order-worklist [data-v-5aeed8da] { padding:0 !important; }
  .workDetails .left .order-worklist .list { width: 95% !important; }
  .workDetails .left .order-worklist .list .value { font-size: 13px; padding-left:0; max-height: none !important; }
  .workDetails .right .listItem { font-size: 13px; }
  .workDetails[data-v-5aeed8da] { column-gap: 10px; }
  .workDetails .left .order-workmsg[data-v-5aeed8da] { height: auto; line-height:1; padding: 0 !important; }
  .workDetails .left .order-workmsg .order-workmsg-top { align-items: center !important; justify-content: space-between !important; padding: 5px 0 !important; }
  .ant-modal { top: 20px !important; }`;

  styles = styles.replace(/(\r\n|\n|\r)/gm, '');
  const css = document.createElement('style');
  css.innerText = styles;
  document.head.appendChild(css);
})();
