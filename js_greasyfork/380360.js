// ==UserScript==
// @name         IconFont-阿里巴巴矢量图标库一键加入购物车
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  IconFont-阿里巴巴矢量图标库提供一键加入购物车功能
// @author       devifish
// @license      MIT
// @match        *://www.iconfont.cn/collections/detail*
// @match        *://iconfont.cn/collections/detail*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at	     document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/380360/IconFont-%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%A0%87%E5%BA%93%E4%B8%80%E9%94%AE%E5%8A%A0%E5%85%A5%E8%B4%AD%E7%89%A9%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/380360/IconFont-%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%A0%87%E5%BA%93%E4%B8%80%E9%94%AE%E5%8A%A0%E5%85%A5%E8%B4%AD%E7%89%A9%E8%BD%A6.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const icon_id_prefix = "J_icon_id_";
  const icons_save_name = "__iconfont_car_icons__";

  const $ = window.$;
  const body = document.body;
  const observer = new MutationObserver(records => {
    for (var record of records) {
      let target = record.target;

      if (target.querySelector(".block-radius-btn-group")) {
        observer.disconnect();

        const add_all_btn = `
          <span class="radius-btn radius-btn-share" title="一键添加到购物车" style="background: #2274d5">
            <span class="iconfont icon-gouwuche1" style="font-size: 27px;"></span>
          </span>
        `;
        let $add_all_btn = $(add_all_btn);
        let $btn_group = $(target).find(".block-radius-btn-group");
        let $icons = $(".collection-detail .block-icon-list li");

        $add_all_btn.click(async () => {
          let data = [];

          $.each($icons, (i, icon) => {
            let $icon = $(icon);
            data.push({
              id: $icon.attr("class").replace(icon_id_prefix, ""),
              name: $icon.find(".icon-name").text(),
              projectId: -1,
              show_svg: $icon.find(".icon-twrap").html()
            })
          });
          localStorage.setItem(icons_save_name, JSON.stringify(data));
          alert(`已将该页面 ${$icons.length} 个图标添加到了购物车`);
          location.reload();
        }).prependTo($btn_group);;
        
        break;
      }
    }
  });

  observer.observe(body, { childList: true });
})();
