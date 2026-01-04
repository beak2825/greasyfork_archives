// ==UserScript==
// @name         WordPress 后台文章列表美化脚本
// @namespace    http://21zys.com/
// @version      1.0.0
// @description  美化 WordPress 后台文章列表，取消换行，增加鼠标悬浮显示
// @match        *://*/wp-admin/*
// @author       21zys
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/508874/WordPress%20%E5%90%8E%E5%8F%B0%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/508874/WordPress%20%E5%90%8E%E5%8F%B0%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 CSS 样式
    function replace_css_style() {
        GM_addStyle(`th#title{width:20%;}th#author{width:3%;}th#categories{width:12%;}th#tags{width:12%;}th#taxonomy-series{width:5%;}th#date{width:12%;}th#cao_price{width:3%;}th#cao_vip_rate{width:5%;}.widefat *{word-wrap:none !important;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;}.el-tooltip{position:absolute;background-color:rgb(255,255,255) !important;border-radius:4px;-webkit-border-radius:5px;border:none;padding:5px 20px;font-size:12px;line-height:1.5;z-index:10000;visibility:hidden;white-space:nowrap;transition:opacity 0.2s ease-in-out;text-decoration:none;opacity:0;}.el-tooltip.show{visibility:visible;opacity:1;}.el-tooltip a{text-decoration:none;}`);
    }

    // 创建一个 el-tooltip 元素
    function create_tooltip() {
        const tooltip = document.createElement('div');
        tooltip.classList.add('el-tooltip');
        document.body.appendChild(tooltip);
        return tooltip;
    }

    // 获取 <td> 标签中的 <strong> 子标签内容，仅当 class 包含 "title" 时
    function get_strong_text(td) {
        const strong = td.querySelector('strong');
        return strong ? strong.innerHTML.trim() : '';
    }

    // 获取 <td> 标签的内部 HTML，支持 <br> 换行
    function get_td_html(td) {
        return td.innerHTML.trim();  // 获取 td 标签的完整 HTML 内容
    }

    // 为所有 <td> 标签添加 el-tooltip 悬浮提示功能，支持 "title" class 和 <br> 换行
    function add_hover_show() {
        const tooltip = create_tooltip();
        const tdElements = document.querySelectorAll('td');

        tdElements.forEach(td => {
            td.addEventListener('mouseenter', function() {
                let content;

                // 如果 td 的 class 包含 "title"，则只显示 <strong> 标签内的内容
                if (td.classList.contains('title')) {
                    content = get_strong_text(td);
                } else {
                    content = get_td_html(td); // 否则显示整个 td 的 HTML 内容
                }

                if (content) {
                    tooltip.innerHTML = content;  // 设置 tooltip 的内容为 HTML
                    const rect = td.getBoundingClientRect();
                    const tooltipX = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2;
                    const tooltipY = rect.top + window.scrollY - tooltip.offsetHeight - 10;
                    tooltip.style.left = `${tooltipX}px`;
                    tooltip.style.top = `${tooltipY}px`;
                    tooltip.classList.add('show');  // 显示 tooltip
                }
            });

            td.addEventListener('mouseleave', function() {
                tooltip.classList.remove('show');  // 隐藏 tooltip
            });
        });
    }

    // 执行添加样式和悬浮显示功能
    replace_css_style();
    add_hover_show();

})();
