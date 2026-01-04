// ==UserScript==
// @name         我的 老男人Miku
// @description  写给Miku233大佬的脚本，方便大家回顾大佬的公众号名字，以及一键直达大佬主页！
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       You
// @match        https://bbs.oldmantvg.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oldmantvg.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526794/%E6%88%91%E7%9A%84%20%E8%80%81%E7%94%B7%E4%BA%BAMiku.user.js
// @updateURL https://update.greasyfork.org/scripts/526794/%E6%88%91%E7%9A%84%20%E8%80%81%E7%94%B7%E4%BA%BAMiku.meta.js
// ==/UserScript==

// ==/UserScript==


(function() {
    'use strict';

    // 添加miku快捷访问按钮
    add_miku_btn();

    // 添加miku的图帖说明
    add_miku_detail();

})();

function add_miku_btn(){
    // 创建新的 <li> 元素
    var newItem = document.createElement("li");
    newItem.classList.add("nav-item");

    // 创建新的 <a> 元素
    var newLink = document.createElement("a");
    newLink.classList.add("nav-link");
    newLink.href = "https://bbs.oldmantvg.net/user-thread-14079.htm";
    newLink.target = "_blank";

    // 创建新的 <span> 元素
    var newSpan = document.createElement("span");
    newSpan.style.color = "#ff5cad";

    // 创建新的 <b> 元素
    var newB = document.createElement("b");
    newB.textContent = "miku233";

    // 将 <b> 元素添加到 <span> 元素中
    newSpan.appendChild(newB);

    // 将 <span> 元素添加到 <a> 元素中
    newLink.appendChild(newSpan);

    // 将 <a> 元素添加到 <li> 元素中
    newItem.appendChild(newLink);
    document.querySelector(".navbar-nav.mr-auto").appendChild(newItem);
}

function add_miku_detail(){

    // 获取目标 div
    const messageDiv = document.querySelector('div.message.break-all[isfirst="1"]');

    // 统计文字数量
    const textContent = messageDiv.textContent.trim();
    const textCount = textContent.length;

    // 统计图片数量
    const images = messageDiv.querySelectorAll('img');
    const imageCount = images.length;

    // 检查条件
    if (imageCount > 40) {
        document.querySelectorAll("h4.break-all").forEach(h4 => {
        let content = h4.textContent.trim();
        let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
        let colorfulText = document.createElement("span");
        colorfulText.innerText = "图帖";
        colorfulText.style.fontWeight = "bold";

        let hue = 0;
        function animateColors() {
            hue = (hue + 1) % 360;
            colorfulText.style.color = `hsl(${hue}, 100%, 50%)`;
            requestAnimationFrame(animateColors);
        }
        animateColors();

        let message = `这是一个`;
        message += colorfulText.outerHTML;
        message += `。
想要获取资源，请先关注微信公众号  <span style='color: red;'>Chocobo Network</span>
然后在公众号内回复  <span style='color: red;'>${content}</span>`;

        let p = document.createElement("p");
        p.innerHTML = message.replace(/\n/g, "<br>");
        h4.insertAdjacentElement("afterend", p);
     });
    }

    console.log("文字数量: " + textCount);
    console.log("图片数量: " + imageCount);

}
