// ==UserScript==
// @name        获取四库一平台的钥匙 - mohurd.gov.cn
// @namespace   Violentmonkey Scripts
// @match       https://jzsc.mohurd.gov.cn/data/company/detail
// @grant       none
// @version     1.2
// @author      -
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @description 2023/10/24 19:06:19
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478156/%E8%8E%B7%E5%8F%96%E5%9B%9B%E5%BA%93%E4%B8%80%E5%B9%B3%E5%8F%B0%E7%9A%84%E9%92%A5%E5%8C%99%20-%20mohurdgovcn.user.js
// @updateURL https://update.greasyfork.org/scripts/478156/%E8%8E%B7%E5%8F%96%E5%9B%9B%E5%BA%93%E4%B8%80%E5%B9%B3%E5%8F%B0%E7%9A%84%E9%92%A5%E5%8C%99%20-%20mohurdgovcn.meta.js
// ==/UserScript==
(function () {
    'use strict';
    jQuery.noConflict();
    (function ($) {
        window.addEventListener('load', function () { //等缓存完了再运行
            //你的代码
            // 创建一个按钮元素
            const importButton = document.createElement('button');
            importButton.textContent = '复制钥匙(点我复制)';
            importButton.id = 'getsyyptaccessToken'; // 设置按钮的id
            // 添加点击事件处理程序来弹出提示
            importButton.addEventListener('click', function () {
                var accessToken = localStorage.getItem("accessToken");
                if (accessToken) {
                    navigator.clipboard.writeText(accessToken);
                    const skyptKeyDiv = document.getElementById('skyptkey');
                    // 赋值
                    skyptKeyDiv.textContent = accessToken;
                    alert("恭喜!成功复制钥匙");
                } else {
                    alert("复制失败,请先输入验证码刷新后尝试");
                }

            });
            // 选择要添加按钮的元素
            const nameSpan = document.querySelector('#app > div > div > div.detaile-header.mb20 > h3 > span.name');
            // 添加按钮到指定位置
            nameSpan.insertAdjacentElement('afterend', importButton);
            // 选中要插入的父元素
            const parent = document.querySelector('.detaile-header__info--table');

            // 创建新的div
            const newDiv = document.createElement('div');
            newDiv.innerHTML = `
  <div data-v-8cba55c6="" class="el-row el-row--flex">
    <div data-v-8cba55c6="" class="el-col el-col-24">
      <div data-v-8cba55c6="" class="label" style="width: 140px;">四库一平台钥匙:</div>
      <div data-v-8cba55c6="" id="skyptkey" class="value"></div>
    </div>
  </div>
`;

            // 插入到父元素内
            parent.appendChild(newDiv);
            document.getElementById('skyptkey').textContent = localStorage.getItem("accessToken");
        }, false);
    })(jQuery);
})();
