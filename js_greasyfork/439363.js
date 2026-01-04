// ==UserScript==
// @name         Spritecow显示坐标
// @namespace    Siner
// @version      1.2
// @description  输出当前鼠标位置相对于选中的精灵图中心点的坐标值
// @author       Siner
// @match        *://*/*
// @license     Siner
// @match      *spritecow.com/*
// @icon         http://www.spritecow.com/assets/9/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439363/Spritecow%E6%98%BE%E7%A4%BA%E5%9D%90%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/439363/Spritecow%E6%98%BE%E7%A4%BA%E5%9D%90%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //添加输出区域
    document.getElementsByClassName("toolbar bottom")[0].innerHTML += "<div class='toolbar-group'><div role='button' class='invert-bg' id='SourcerectDiv'><font style='vertical-align: inherit;'><font style='vertical-align: inherit;'>Sourcerect：<span id='Sourcerect'></span></font></font></div><div role='button' class='invert-bg'><font style='vertical-align: inherit;'><font style='vertical-align: inherit;'>Handle：<span id='Handle'></span></font></font></div></div>";
    document.getElementsByClassName("toolbar bottom")[0].innerHTML += "<div role='button' class='select-sprite active'>点击Sourcerect可复制值</div>";
    //初始化变量：
    var Sourcerect = "";
    var Handle = "";
    //鼠标移动事件，计算Handle位置
    function mouseMove(ev) {
        ev = ev || window.event;
        var highlight = document.getElementsByClassName("highlight")[0];
        var mousePos = mouseXY(ev);
        //计算大小
        var x = Number(highlight.style.width.substr(0,highlight.style.width.length - 2)) / 2 + Number(highlight.style.left.substr(0,highlight.style.left.length - 2)) + 20;
        var y = Number(highlight.style.height.substr(0,highlight.style.height.length - 2)) / 2 + Number(highlight.style.top.substr(0,highlight.style.top.length - 2)) + 60;
        Handle = Math.round(mousePos.x - x) + "," + Math.round((mousePos.y - y) * -1);
        document.getElementById('Handle').innerHTML = Handle;
    }
    //鼠标点击事件，计算Sourcerect位置
    function mouseClick(ev) {
        setTimeout(function () {
        var highlight = document.getElementsByClassName("highlight")[0];
        Sourcerect = highlight.style.left + "," + highlight.style.top + "," + highlight.style.width + "," + highlight.style.height;
        Sourcerect = Sourcerect == ",,," || highlight.style.width =="0px" ? "None":Sourcerect.replace(/px/g,'');
        document.getElementById('Sourcerect').innerHTML = Sourcerect;
    }, 100)
    }
    //获取鼠标位置
    function mouseXY(ev) {
        if (ev.pageX || ev.pageY) {
            return { x: ev.pageX, y: ev.pageY };
        }
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
        };
    }

    function copy (text) {
        const el = document.createElement('input')
        el.setAttribute('value', text)
        document.body.appendChild(el)
        el.select()
        if (document.execCommand('copy')){
            document.body.removeChild(el);
            //alert('复制成功，Sourcerect值为：' + text);
        }else{
            document.body.removeChild(el);
            //alert('复制失败，已被浏览器阻止，请手动填写Sourcerect值：' + text);
        }

}
    //注册点击事件
    document.onmousemove = mouseMove;
    document.getElementsByClassName("sprite-canvas-container")[0].onclick = mouseClick;
    //document.onclick = mouseClick;
    document.getElementById('SourcerectDiv').onclick = function copySourcerect() {copy(Sourcerect);};
})();