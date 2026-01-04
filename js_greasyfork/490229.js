// ==UserScript==
// @name        聚水潭 ERP 图片尺寸调整
// @version     1.1
// @author      ShiShiBits
// @icon        https://assets.sursung.com/pkg/static/imgs/202011/favicon.ico
// @description  调整商品放大镜图片尺寸
// @author       ShiSHiBits
// @match        *://*.erp321.com/*
// @grant        none
// @note         调整商品放大镜图片尺寸为垂直分辨率 -100 大小
// @note         调整商品打印+自动勾选、图片显示尺寸
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1276350
// @downloadURL https://update.greasyfork.org/scripts/490229/%E8%81%9A%E6%B0%B4%E6%BD%AD%20ERP%20%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/490229/%E8%81%9A%E6%B0%B4%E6%BD%AD%20ERP%20%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    var screenWidth = window.screen.width;
    var screenHeight = window.screen.height;
  //商品打印+代码
        // 获取元素并设置焦点【辅助码输入框】
    var element = document.querySelector("#skustock");
    if (element) {
      element.focus();
    }
        // 获取元素并设置默认勾选【扫描商品编码直接打印】
    var checkBoxElement = document.getElementById("skuInputPrint");
    if (checkBoxElement) {
        $("input[type='checkbox']").attr("checked", true);
    }

    // 获取元素并设置宽度和高度为500px
    var spModeSkupicElement = document.getElementById("sp_mode_skupic");
    if (spModeSkupicElement) {
        spModeSkupicElement.style.width = "500px";
        spModeSkupicElement.style.height = "500px";
    }


    //商品放大镜代码

        // 获取id为"pic"的元素
    var pictureElement = document.getElementById("pic");
    if (pictureElement) {
        // 设置宽度为垂直分辨率-100px
        pictureElement.style.width = screenHeight - 100 + "px";
        // 获取id为"remark"的元素
        var remarkElement = document.getElementById("remark");
        if (remarkElement) {
            // 隐藏元素
            remarkElement.style.display = 'none';
        }
    }

})();