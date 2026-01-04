// ==UserScript==
// @name        91自动填充增强 
// @namespace   91自动填充增强
// @version     1.5
// @author      Tak
// @match    https://www.91tvg.com/thread*
// @match    https://www.91tvg.com/forum.php*
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @description 91页面回复框自动填充
// @homepage  https://greasyfork.org/zh-CN/scripts/426029-91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%A2%9E%E5%BC%BA
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/426029/91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/426029/91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
var wordPool = ["厉害", "蟹蟹", "摸摸大", "分享", "学习", "厉害了", "真棒", "666", "真的厉害了","11.0.1可用么","SX可用么"];
function getOne(arr) {
    var index = Math.floor((Math.random() * arr.length));
    return arr[index];
} 

(function() {

    var allValues = document.getElementsByClassName("t_f");
    var len = allValues.length;

    var arr = [];
    for (i = 0; i < len; i++) {
        arr.push(allValues[i])
    }

    var mes = Math.floor(Math.random() * len);

    var inputParam = getOne(wordPool) + arr[mes].innerText + ", " + getOne(wordPool)

    $("[name='message']").val(inputParam);

})();