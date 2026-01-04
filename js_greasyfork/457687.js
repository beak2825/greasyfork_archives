// ==UserScript==
// @name         myShopDetect
// @run-at document-body
// @namespace    http://huaqin.com/
// @version      0.1
// @description  方便抢购时检测商品
// @author       Austin
// @match        http://shop.huaqin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457687/myShopDetect.user.js
// @updateURL https://update.greasyfork.org/scripts/457687/myShopDetect.meta.js
// ==/UserScript==
// 原系统已经定义 document.getElementById 为$

(function () {
    if (location.href.indexOf("goods.php?id=") > -1) {
        addButton(1)
    } else if (location.pathname == '/') {
        addButton(0)
    }
})();

// 添加商品探测页面按钮
function addButton(goodsFlag) {
    var strControlHTML = `
    <div style="padding:2px;position:fixed;top:40px;left:2px;z-index:99999" id="myselfFloat">
    <div  style="background-color:rgb(208, 227, 245);opacity: 0.8;">
    当前地址<input size=40 value="" id='currPage' placeholder="可手工修改地址后跳转"> <span style="cursor:pointer;" id="refresh">🔄</span> <span style="cursor:pointer;" id="btPre">⏪</span> <span style="cursor:pointer;" id="btNext">⏩</span>
    </div>
  </div>
  `;
    var oNode = document.createElement('div');
    oNode.innerHTML = strControlHTML;
    document.body.append(oNode);
    // 绑定事件
    setTimeout(function () {
        btPre.onclick = function () {
            toPage(-1)
            return false
        }
        btNext.onclick = function () {
            toPage(1)
            return false
        }
        refresh.onclick = function () {
            toPage(0)
        }
    }, 1)
    // 是商品页面
    if (goodsFlag == 1) {
        currPage.value = location.href
    } else {
        // 首页，只用之前记录的变量
        currPage.value = localStorage.getItem('plugin-Currpage')
    }
}
function toPage(step) {
    var url = currPage.value;
    if (url == '') {
        url = location.href
    }
    url = url.replace(/\?id=(\d+)/, function (a, b) {
        var num = parseInt(b) + step;
        return '?id=' + num
    })
    localStorage.setItem('plugin-Currpage', url)
    // 真实跳转
    location.href = url
}