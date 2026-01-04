// ==UserScript==
// @name        JAV 网站在线联动
// @namespace    m-team javbus javlibrary jable connector
// @version      3.1.1
// @description  enjoy yourself
// @license      1285500
// @author       1285500
// @include     *://jable.tv/*
// @include     *://www.javbus.com/*
// @include     *://www.javlibrary.com/*
// @include     *://kp.m-team.cc/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9.17.2/dist/sweetalert2.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/491972/JAV%20%E7%BD%91%E7%AB%99%E5%9C%A8%E7%BA%BF%E8%81%94%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/491972/JAV%20%E7%BD%91%E7%AB%99%E5%9C%A8%E7%BA%BF%E8%81%94%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var openSystemConfig = function() {
            var threshold = GM_getValue('threshold', 100);
            var filter_true = '';
            if (GM_getValue('filter_true', 1) !== 0) {
                GM_setValue('filter_true', 1);
                filter_true = "checked";
            }
            var highlight_new = ''
            if (GM_getValue('highlight_new', 1) !== 0) {
                GM_setValue('highlight_new', 1);
                highlight_new = "checked";
            }
            let dom = `<div>
                          <label class="tm-setting">变暗标题筛选种子<input type="checkbox" id="filter_true" ${filter_true} class="tm-checkbox"></label>
                          <label class="tm-setting">变暗标题的用户阈值<input type="text" id="thresholdInput" class="tm-text" value="${threshold}"></label>
                          <label class="tm-setting">高亮新发布的种子<input type="checkbox" id="highlight_new" ${highlight_new} class="tm-checkbox" value="${highlight_new}"></label>
                        </div>`;

            Swal.fire({
                title: '脚本设置',
                html: dom,
                confirmButtonText: '保存'
            }).then((result) => {
                if (result.value) {
                    if (document.getElementById('filter_true').checked) {
                        GM_setValue('filter_true', 1);
                    } else {
                        GM_setValue('filter_true', 0);
                    }
                    if (document.getElementById('highlight_new').checked) {
                        GM_setValue('highlight_new', 1);
                    } else {
                        GM_setValue('highlight_new', 0);
                    }
                    threshold = document.getElementById('thresholdInput').value;
                    console.log("save threshold", threshold);
                    GM_setValue('threshold', threshold);
                    history.go(0);
                }
            })
    }
    GM_addStyle(`
        .tm-setting {display: flex;align-items: center;justify-content: space-between;padding-top: 20px;}
        .tm-checkbox {width: 16px;height: 16px;}
        .tm-text {width: 150px;height: 16px;}
      `);
    GM_registerMenuCommand('设置', openSystemConfig);

    GM_addStyle(`
    tr.hdr-highlight {
      border-left: 4px solid #00f3ff !important;
      background: transparent !important;
      color: inherit !important;
      font-weight: 600 !important;
      box-shadow: inset 0 0 0 1px rgba(0, 243, 255, 0.2) !important;
      opacity: 1 !important;
    }
  `);

    const JABLE_FAVICON_DATA = 'data:image/x-icon;base64,AAABAAMAEBAAAAEAIABoBAAANgAAACAgAAABACAAKBEAAJ4EAAAwMAAAAQAgAGgmAADGFQAAKAAAABAAAAAgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI1j/H6NYv35jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL9+Y1j/n6NYv35jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+NYv35jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/mXL+/72j/v/GsP7/u6D+/5Zt/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/7qf/v/s5P7/5tz+//v6///x7P//lWz+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+PY/7/jmL+/45i/v+si/7//////7aZ/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/l2/+//////+8o/7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/5dv/v//////vKP+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+Xb/7//////72j/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/l2/+//////+9o/7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/5dv/v//////vaP+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+Xb/7//////72j/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/kmj+/8Wu/v+lgv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jWL9+Y5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL9+Y1j/H6NYv35jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jWL9+Y1j/H4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAACAAAABAAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH9//wKNYvx8jWL9545i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL9541i/3x/f/8CjWL8fI5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/41i/3yNYf3njmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jWL9545i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+8ov7/49j+//by/v/+/v///v7///Tw/v/bzv7/rY3+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/+jf/v//////////////////////////////////////ybT+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/5dr+/+LX/v/Qvf7/ybT+/9G//v/w6v//////////////////qon+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+RZ/7/jmL+/45i/v+OYv7/jmL+/5Bl/v/h1f/////////////UxP7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/7CR/v///////////+fe/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/oX3+////////////6+T+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+ge/7////////////r5P7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/6B8/v///////////+vk/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/oHz+////////////6+T+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+gfP7////////////r5P7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/6B8/v///////////+zk/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/oHz+////////////7OT+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+gfP7////////////s5P7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/6B8/v///////////+zk/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/oHz+////////////7OT+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+gfP7////////////s5P7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/6B8/v///////////+zk/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/oHv+//z7/v/8+/7/6uL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+NYf3njmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL9549j/nuOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+NYvx8f3//Ao1i/HyNYf7mjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+NYf7mjWL8fH9//wIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAADAAAABgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACRW/8OkGH8XI5h/ceNYv33jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+NYv33jWL9yJBj/lyIZv8PAAAAAJFb/w6OYf2VjWH9+I5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/feNYP2WiGb/D41h/FyNYf34jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv33kGP8XI5h/ceOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jWD9yI5h/faOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jWL9945i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/lGr+/6eE/v+1mf7/v6f+/8Wu/v/Hsf7/xa/+/7+m/v+xk/7/nXj+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+mg/7/5t3///Tw///59////fz///7+//////////7///z7///49f//8ez//9LB//+bdP7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+vkP7/9/T////////////////////////////////////////////////////////q4v//o3/+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+vkP7/9/T/////////////////////////////////////////////////////////////6OD//5py/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+vkP7/7uj//9XG/v+9o/7/rY3+/6aD/v+ph/7/uJv+/9nL/v/8+v///////////////////////825/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+Tav7/kGX+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/49k/v+5nv7/+fb//////////////////+/o//+Xb/7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+SZ/7/39L+//////////////////Xx//+ohv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/v6b+//////////////////j1//+xkv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/r5H+//////////////////j2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////j2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rYz+//////////////////j2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////j2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////j2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////j2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////j2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////j2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//////////////////n2//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/rY3+//7+///+/v///v7///j1//+zlv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/nXb+/8Os/v/DrP7/w6z+/8Co/v+ge/7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45h/faOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jWL9945h/ceOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jWL9yI5i/1uOYv33jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+NYf34jWH8XIhm/w+NYv+UjmL9945i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/41h/fiOYf2VkVv/DgAAAACIZv8PjWH8XI5h/saOYf32jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYf32jmH+xo1h/FyRW/8OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

    const JAVLIB_FAVICON_DATA = 'data:image/x-icon;base64,AAABAAEAICAAAAAAAACoDAAAFgAAACgAAAAgAAAAQAAAAAEAGAAAAAAAgAwAAAAAAAAAAAAAAAAAAAAAAAC7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnXbvz78f/78//89P/89//9+f/++//9+f/99//89f/88//78v/VZvu7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnZdvz////////////////////////////////////////////89P/jmPzTYPu8DPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnZdvz////////////////////////////////////////////////////////eify7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnZdvz////////////////////////////////////////////////////////12/67Cfm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnZdvz////////////////////////12/7cgPzcgPzcgPzcgPzcgfzdhfzgj/zaefy7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnZdvz////////////////////9+P7+/f7Wavu7CPncfvztvP7vxP7wyf7xzv7z0/7z1P7lof27CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnZdfz////////////////////chfvz1v39+f7OTPrQVPvOTPvNSfrNSPrMRfvKQPrLQ/rhkPy7Cfm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnZc/z////////////////////Xb/vEKPrwyf3PU/u7CPm7CPm7CPm7CPm7CPm7CPm7Cfn02P7JPfq7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnYcfz////////////////////Xb/u7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnaefzknfy7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnYb/z////////////////////Xb/u7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnCIPn45/6/Fvm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnXbfz////////////////////Xbvu7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnpsP3VZvu7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnXbPz////////////////////Xbfu7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnPUfvvxv27Cfm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnWafz////////////////////Wa/u7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm9Dvn24P7GMPq7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnOTvv////////////////////VaPu7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnZd/vDJPq7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm+Evn56v7////////////////VZvu7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnQU/v99//////////////UZfu7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnHM/rmpf345v79+f/TYfu7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm/GPnXb/zcfvzOS/u8C/m7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnGL/r34v7////////////qs/29D/m7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CfnwyP7////////////////////aevy7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnBH/r+/P/////////////////////vw/67CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnBHvr++//////////////////////uwv67CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7Cfnvxf7////////////////////ad/y7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPnFLPr23/7////////////prf29Dvm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm+EvnSXPvYcvzMRPq7Cfm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPm7CPkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

    const MISSAV_FAVICON_DATA = 'data:image/x-icon;base64,AAABAAMAEBAAAAEAIABoBAAANgAAACAgAAABACAAKBEAAJ4EAAAwMAAAAQAgAGgmAADGFQAAKAAAABAAAAAgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHY/oxi2H6mIxi+9qNYvz6jWL8+oxi+9qLYfqYh2P6MQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBm/wqMYfqbjmL+/Y5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v2MYfqbgGb/CgAAAAAAAAAAAAAAAIBm/wqMYvvBjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/4xi+8GAZv8KAAAAAAAAAACMYfqbjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jGH6mwAAAACHY/oxjmL+/Y5i/v+OYv7/jmL+/5Jo/v+ylf3/kGX+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v2HY/oxi2H6mI5i/v+OYv7/jmL+/45i/v+qi/v//////+vk/v+ri/3/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/i2H6mIxi+9qOYv7/jmL+/45i/v+OYv7/q4z7/////////////////9jK/f+bdP3/jmL+/45i/v+OYv7/jmL+/4xi+9qNYvz6jmL+/45i/v+OYv7/jmL+/6uM+///////////////////////+vj//7ed/f+OYv7/jmL+/45i/v+NYvz6jWL8+o5i/v+OYv7/jmL+/45i/v+rjPv///////////////////////n3/v+2mvz/jmL+/45i/v+OYv7/jWL8+oxi+9qOYv7/jmL+/45i/v+OYv7/q4z7/////////////////9fI/f+ac/3/jmL+/45i/v+OYv7/jmL+/4xi+9qLYfqYjmL+/45i/v+OYv7/jmL+/6qL+///////6uL+/6iI/f+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+LYfqYh2P6MY5i/v2OYv7/jmL+/45i/v+SaP7/sZP+/49k/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv79h2P6MQAAAACMYfqbjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i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/P+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/h2LuW4ti+Z6OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/yLb4/////////////////////////////f3//9PD/P+Ycvv/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+LYvmeimL2zY5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v/Itvj///////////////////////////////////////f1/v+/qPr/kWb+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/4pi9s2KYvfqjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/8i2+P/////////////////////////////////////////////////q4/3/q4z8/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/imL36o5h/f6OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/yLb4///////////////////////////////////////////////////////+/v//pob7/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYf3+jmH9/o5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v/Itvj///////////////////////////////////////////////////////38/v+kg/r/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45h/f6KYvfqjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/8i2+P/////////////////////////////////////////////////m3/z/p4f7/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/imL36opi9s2OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/yLb4////////////////////////////////////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3SYAAAAAAAAAAAAAAABtbdsHiWPzm45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/j2T+/6SD/P+oiPv/k2r9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/4lj85ttbdsHAAAAAAAAAACCZOYzjWL84o5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/uqL6//Tw/v/18f7/3NH6/6SE+f+PY/7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/41i/OKCZOYzAAAAAFVV/wOHY/R3jWL9+Y5i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+RaPr/5Nz7//////////////////n3/v/Gsfr/m3T9/49j/f+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/41i/fmHY/R3VVX/A4Bj4xKKYvizjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////+/f//5dz9/7ui+/+Xb/z/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+KYvizgGPjEoNg6iWKYvfjjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6//////////////////////////////////r5/v/h2Pv/qIj8/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+KYvfjg2DqJYFi7FGOYv76jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6////////////////////////////////////////////+vn+/8m3+f+cd/z/j2T9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv76gWLsUYVi7oqOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6//////////////////////////////////////////////////79///o4fz/vab6/5hy+/+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/hWLuiohi9LaOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6////////////////////////////////////////////////////////////+/n+/+Xd+/+sjvr/j2T+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGL0tohi9NWOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////////////////////////////////////////////////////5+P3/zbv6/516/P+QZf7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGL01Yhh9fGOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6/////////////////////////////////////////////////////////////////////////////////+7o/v+2m/z/kGX+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGH18Y5i/v6OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////////////////////////////////////////////////////////////////////l3vv/mHH9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/o5i/v6OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////////////////////////////////////////////////////////////////////k3Pr/mHH9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/ohh9fGOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6/////////////////////////////////////////////////////////////////////////////v7//+ji/P+yl/r/kGX9/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGH18Yhi9NWOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////////////////////////////////////////////////////49v3/xrT6/5p0/f+QZP3/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGL01Yhi9LaOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6////////////////////////////////////////////////////////////+vj+/+LZ/P+oifn/j2T+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/iGL0toVi7oqOYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6//////////////////////////////////////////////////79///l3f3/uaD6/5Zu/P+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/hWLuioFi7FGOYv76jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6////////////////////////////////////////////+fn9/8Wx+/+bdf3/j2P+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv76gWLsUYNg6iWKYvfjjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6//////////////////////////////////n3/v/azvv/oYD6/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+KYvfjg2DqJYBj4xKKYvizjmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i/v+UbPr/5+D6///////////////////////8+/7/49r8/7ab/P+Vbfz/jmL+/45i/v+OYv7/jmL+/45i/v+OYv7/jmL+/45i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';


    var getAVID = function(title) {
        console.log("Parse: " + title);
        var regs = [
            new RegExp('^([a-zA-Z]{2,5}-[0-9]{2,5}) {0,1}.*'), // dmm
            new RegExp('(259LUXU-[0-9]{3,4})','i'), // LUXU259
            new RegExp('([0-9]{3}[a-zA-Z]{3,4}-[0-9]{3,4})'), // 300MIUM 200GANA 332NAMA 300NTK ...
            new RegExp('([0-9]{5,6}[\-\_]{1}[0-9]{2,3})'), // 1pondo
            // few
            // Carib
            // HEYZO
        ];

        for(var i=0; i<regs.length; i++){
            var avid = regs[i].exec(title);
            if(avid != null){
              let _vid = (avid[1].replace('_','-')).toUpperCase();
              console.log("Parsed: " + _vid);
              return _vid;
            }
        }

        return null;
    };

    var append_link = function() {
      var jab_site_root = "https://jable.tv";
      var jlib_site_root = "https://www.javlibrary.com";
      var mt_site_root = "https://kp.m-team.cc";
      var missav_site_root = "https://missav.ws";

      var jlib_regex = RegExp(jlib_site_root + "\/(.+)\/?v=");
      var jlib_index_regex = RegExp(jlib_site_root + "\/(.+)\/vl_.*");

      var jab_regex = RegExp(jab_site_root + "/videos/(.+)/");
      var mteam_regex = RegExp(mt_site_root + "/(.+)/(.+)"); //https://kp.m-team.cc/browse/adult https://kp.m-team.cc/detail/XXXXXX

      var jlib_paths = jlib_regex.exec(location.href);
      var jlib_index = jlib_index_regex.exec(location.href);
      var jab_paths = jab_regex.exec(location.href);

      if (jlib_index !== null) {
          // jlib index page
          let elements = document.querySelectorAll(".video");
          if (elements != null) {
                for (var i = 0, element; element = elements[i]; i++) {
                    let title = element.querySelector('.id').innerText;
                    var avid = getAVID(title);
                    if (avid != null) {
                      var target = element.querySelector(".toolbar");

                      if (target.classList.contains('modified')) continue;
                      target.classList.add('modified');

                      var mteam_root = document.createElement('pre');
                      target.appendChild(mteam_root);

                      var jab = document.createElement('a');
                      jab.innerHTML = `<img src="${JABLE_FAVICON_DATA}" height="16px" width="16px" />`;
                      jab.href = jab_site_root + '/videos/' + avid + '/';
                      jab.target = '_blank';
                      mteam_root.appendChild(jab);
                    }
                }
          }

      } else if (jlib_paths !== null) {
          // jlib
          var target = document.querySelector('#video_id');

          if (target.classList.contains('modified')) return;
          target.classList.add('modified');

          let avid = target.querySelectorAll('td')[1].innerText;
          var mteam_root = document.createElement('pre');
          var mteam = document.createElement('a');
          mteam.style = 'color:#880000';
          mteam.innerHTML = ' PT搜索';
          mteam.href = mt_site_root + '/browse/adult?keyword=' + avid;
          mteam.target = '_blank';
          mteam_root.appendChild(mteam);
          target.insertBefore(mteam_root, target.querySelectorAll('table')[0]);

          var jabplay = document.createElement('a');
          jabplay.innerHTML = ' 播放(Jable)';
          jabplay.href = jab_site_root + '/videos/' + avid + '/';
          jabplay.target = '_blank';
          jabplay.style = 'color:#880000';
          mteam_root.appendChild(jabplay);

          var missavplay = document.createElement('a');
          missavplay.innerHTML = ' 播放(Missav)';
          missavplay.href = missav_site_root + '/' + avid;
          missavplay.target = '_blank';
          missavplay.style = 'color:#880000';
          mteam_root.appendChild(missavplay);

          return;
      } else if (jab_paths !== null) {
          // jable
          let avid = jab_paths[1];
          var mteam_root = document.createElement('pre');
          var mteam = document.createElement('a');
          mteam.style = 'color:#fff';
          mteam.innerHTML = ' PT搜索';
          mteam.href = mt_site_root + '/browse/adult?keyword=' + avid;
          mteam.target = '_blank';
          mteam_root.appendChild(mteam);
          var target = document.querySelector('.header-left');

          if (target.classList.contains('modified')) return;
          target.classList.add('modified');

          target.insertBefore(mteam_root, target.querySelectorAll('p')[1]);

          var jlib = document.createElement('a');
          jlib.innerHTML = ' 评分';
          jlib.href = jlib_site_root + '/cn/vl_searchbyid.php?keyword=' + avid;
          jlib.target = '_blank';
          jlib.style = 'color:#fff';
          mteam_root.appendChild(jlib);

          return;
      }

      var mteam_paths = mteam_regex.exec(location.href);
      if (mteam_paths === null) {
          return;
      }
      switch(mteam_paths[1]) {
          case "browse":
              // List
              var elements = document.querySelector("table").rows;
              if (elements != null && elements.length > 1) {
                for (var i = 1, element; element = elements[i]; i++) {
                    const isCensored = element.textContent.includes('Censored') && !element.textContent.includes('Uncensored');
                    if (isCensored === false) {
                      continue;
                    }
                    let title = element.querySelectorAll('a[href*="/detail"]')[0].textContent;
                    console.log("Query: ", title);
                    var avid = getAVID(title);
                    if (avid != null) {
                      var target = element.querySelector('button').parentElement;

                      if (target.classList.contains('modified')) continue;
                      target.classList.add('modified');

                      var mteam_root = document.createElement('pre');
                      mteam_root.style.margin = '4px';
                      target.appendChild(mteam_root);

                      var jlib = document.createElement('a');
                      jlib.innerHTML = `<img style="height: 20px; width: 20px; border-radius: 50%; border: 1px solid #2f4879; object-fit: cover;" src="${JAVLIB_FAVICON_DATA}" />`;
                      jlib.href = jlib_site_root + '/cn/vl_searchbyid.php?keyword=' + avid;
                      jlib.target = '_blank';
                      jlib.style.marginRight = '2px';
                      mteam_root.appendChild(jlib);

                      var jab = document.createElement('a');
                      jab.innerHTML = `<img style="height: 20px; width: 20px; border-radius: 50%; border: 1px solid #2f4879; object-fit: cover;" src="${JABLE_FAVICON_DATA}" />`;
                      jab.href = jab_site_root + '/videos/' + avid + '/';
                      jab.target = '_blank';
                      jab.style.marginRight = '2px';
                      mteam_root.appendChild(jab);

                      var missav = document.createElement('a');
                      missav.innerHTML = `<img style="height: 20px; width: 20px; border-radius: 50%; border: 1px solid #2f4879; object-fit: cover;" src="${MISSAV_FAVICON_DATA}" />`;
                      missav.href = missav_site_root + '/' + avid;
                      missav.target = '_blank';
                      missav.style.marginRight = '2px';
                      mteam_root.appendChild(missav);
                    }
                }
              }
              return;
          case "detail":
              // Detail
              if (/\sCensored/.test(document.documentElement.innerHTML)) {
                  var avid = getAVID(document.querySelector('h2').textContent.match(/(.+?) /)[0])
                    if (avid != null) {
                      var jlib = document.createElement('a');
                      jlib.innerHTML = '评分';
                      jlib.href = jlib_site_root + '/cn/vl_searchbyid.php?keyword=' + avid;
                      jlib.target = '_blank';
                      jlib.style = 'color:#880000';
                      var msearch = document.createElement('a');
                      msearch.innerHTML = '站内搜索';
                      msearch.href = mt_site_root + '/browse/adult?keyword=' + avid;
                      msearch.target = '_blank';
                      msearch.style = 'color:#880000';
                      var jabplay = document.createElement('a');
                      jabplay.innerHTML = '播放(Jable)';
                      jabplay.href = jab_site_root + '/videos/' + avid + '/';
                      jabplay.target = '_blank';
                      jabplay.style = 'color:#880000';
                      var missavplay = document.createElement('a');
                      missavplay.innerHTML = '播放(Missav)';
                      missavplay.href = missav_site_root + '/' + avid;
                      missavplay.target = '_blank';
                      missavplay.style = 'color:#880000';

                      var target = document.querySelector('h2');

                      if (target.classList.contains('modified')) return;
                      target.classList.add('modified');

                      var mteam_root = document.createElement('pre');
                      target.appendChild(mteam_root);
                      mteam_root.appendChild(document.createTextNode(' ['));
                      mteam_root.appendChild(jlib);
                      mteam_root.appendChild(document.createTextNode('] ['));
                      mteam_root.appendChild(jabplay);
                      mteam_root.appendChild(document.createTextNode('] ['));
                      mteam_root.appendChild(missavplay);
                      mteam_root.appendChild(document.createTextNode('] ['));
                      mteam_root.appendChild(msearch);
                      mteam_root.appendChild(document.createTextNode(']'));
                    }
              }
              return;
      }
    }


    var remove_less = function() {
        if (GM_getValue('filter_true', 1) === 0) return;

        let threshold = GM_getValue('threshold', 100);
        if (location.search.indexOf("search") != -1) {
            console.log("disable filter for search");
            return;
        }
        if(window.location.href.indexOf('/browse/') == -1) {
          return;
        }
        console.log("RLU: filtering...");
        var elements = document.querySelector("table").rows;
        if (elements != null && elements.length > 1) {
          for (var i = 1, element; element = elements[i]; i++) {
              // console.log(`RLU:${i}: ${element.outerHTML}`);
              var seeds = null;
              var ants = null;
              if (location.hostname == "springsunday.net") {
                  seeds = element.querySelector("td:nth-child(7)");
                  ants = element.querySelector("td:nth-child(8)");
              } else if (location.hostname.includes("m-team")) {
                  if (GM_getValue('highlight_new', 1) === 1) {
                    const released_at = element.querySelector('td span.block')?.textContent?.trim() || '';
                    if (/分鐘|秒|minutes|seconds/i.test(released_at)) {
                      element.classList.add('hdr-highlight');
                      continue;
                    }
                  }
                  element.classList.remove('hdr-highlight');
                  let length = element.querySelectorAll('td .align-middle').length;
                  seeds = element.querySelectorAll('td .align-middle')[length-3].textContent;
                  // console.log(`RLU:seeds: ${seeds}`);
                  ants = element.querySelectorAll('td .align-middle')[length-1].textContent;
                  // console.log(`RLU:ants: ${ants}`);
              }
              element.style.opacity = "0.5";
              console.log("RLU:seeds:", seeds, "ants:", ants);
              if (seeds || ants) {
                  let seeds_num = parseInt(seeds) || 0;
                  let antss_num = parseInt(ants) || 0;
                  let total_users = seeds_num + antss_num;
                  console.log("Total: ", total_users, " threshold: " + threshold);
                  if (total_users >= threshold) {
                      element.style.opacity = "1";
                  }
              }
          }
        }
    }
    new MutationObserver(remove_less).observe(document, {childList: true, subtree: true});
    new MutationObserver(append_link).observe(document, {childList: true, subtree: true});
})();