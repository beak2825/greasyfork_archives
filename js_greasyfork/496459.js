// ==UserScript==
// @name         学习通返回旧版
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  创建超星学习通返回旧版的按钮
// @author       Ray&ChatGPT
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/mycourse/stu*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/496459/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%BF%94%E5%9B%9E%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/496459/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%BF%94%E5%9B%9E%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';


   var button = document.createElement('button');
button.innerHTML = '回到旧版';
button.style.position = 'absolute'; // 或者 'absolute' 如果您想要相对于某个容器定位
button.style.top = '10px'; // 距离顶部 10px
button.style.left = '50%'; // 居中
button.style.zIndex = '9999';
button.style.padding = '10px';
button.style.backgroundColor = '#008CBA';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';

document.body.appendChild(button);



    // 点击按钮时的处理函数
    button.onclick = function() {
        var currentUrl = window.location.href;
        var urlParams = new URLSearchParams(window.location.search);
        var courseid = urlParams.get('courseid');
        var clazzid = urlParams.get('clazzid');
        var cpi = urlParams.get('cpi');

        if (courseid && clazzid && cpi) {
            var newUrl = `https://mooc1.chaoxing.com/visit/stucoursemiddle?courseid=${courseid}&clazzid=${clazzid}&cpi=${cpi}&ismooc2=0`;
            window.location.href = newUrl;
        } else {
            alert('请进入课程后再点击');
        }
    };
})();
