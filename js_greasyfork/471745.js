// ==UserScript==
// @name              批量取消twitter屏蔽
// @name:en           batch unblock for twitter
// @namespace         None
// @version           1.0
// @description       在推特pc网页（https://twitter.com/settings/blocked/all）右下角添加一个按钮，可以一键批量取消推特的屏蔽列表，默认一次清除30个屏蔽，可以手动下拉加载更多后，一键取消
// @description:en    Add a button in the bottom right corner of the webpage to batch cancel the blocked list of Twitter with one click. By default, 30 blocks can be cleared at once. You can manually drop down to load more and then cancel with one click
// @author            抱紧
// @create            2023-07-26
// @lastmodified      2023-07-26
// @include           http*://twitter.com/settings/blocked/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471745/%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88twitter%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/471745/%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88twitter%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

//先打开这个页面：https://twitter.com/settings/blocked/all
//然后点击页面右下角的按钮

let i = document.getElementsByClassName("css-18t94o4 css-1dbjc4n r-42olwf r-sdzlij r-1phboty r-rs99b7 r-2yi16 r-1qi8awa r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr");
let unblockList = [];

const btn = document.createElement("button");
btn.textContent = "一键取消当前页面所有屏蔽";
btn.style.position = "fixed";
btn.style.bottom = "20px";
btn.style.right = "20px";
document.body.appendChild(btn);
btn.addEventListener("click", function() {
    for (let j = 0; j < i.length; j++) {
        if (i[j].offsetWidth && i[j].offsetHeight) {
            unblockList.push(i[j]);
        }
    }
    for (let a = 0; a < unblockList.length; a++) {
            unblockList[a].click();
            console.log("成功取消屏蔽第", a+1, "个账户");
    }
});