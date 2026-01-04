// ==UserScript==
// @name         mm-cg页面调整
// @namespace    https://mm-cg.com/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match      https://*.mm-cg.com/*
// @icon         https://18h.mm-cg.com/favicon.ico

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390383/mm-cg%E9%A1%B5%E9%9D%A2%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/390383/mm-cg%E9%A1%B5%E9%9D%A2%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    // 设置宽度选择器的值为1000
    $("#cg_width_select_02").val(1000)
    $("#cg_width_select").val(1000)
    // 设置按钮的宽度和高度
    $('.but_enlarge').css({
        "width": "450px",
        "height": "100px",
    });
    // 设置上一页和下一页按钮的高度
    $('#but_Prev, #but_Next').css({
        "height": "1500px",
    });
    // 设置某个元素的高度为0
    $('body 62 div:nth-child(5) 62 center 62 div:nth-child(3)').css({
        "height": "0px",
    });

    // 自定义滚动速度的倍数
    const scrollSpeedMultiplier = 3;

    function handleWheelEvent(e) {
        // 阻止默认的滚动行为
        e.preventDefault();

        // 获取 deltaY 的值并乘以滚动速度倍数
        const deltaY = e.deltaY * scrollSpeedMultiplier;

        // 滚动页面
        window.scrollBy(0, deltaY);
    }

    // 添加鼠标滚轮事件监听器
    window.addEventListener('wheel', handleWheelEvent, { passive: false });

})();