// ==UserScript==
// @name         疫情防控通自动填写与提交
// @namespace    https://github.com/npfjcg
// @version      1.0
// @license      GPLv3
// @description  中国石油大学（华东）2019新型冠状病毒肺炎防控填报系统自动获取位置信息并提交
// @author       npfjcg
// @include      *://app.upc.edu.cn/ncov/wap/default/index*
// @downloadURL https://update.greasyfork.org/scripts/399625/%E7%96%AB%E6%83%85%E9%98%B2%E6%8E%A7%E9%80%9A%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%B8%8E%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/399625/%E7%96%AB%E6%83%85%E9%98%B2%E6%8E%A7%E9%80%9A%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%B8%8E%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

exec(function () {
    return vm.getLocation();
});

alert("正在获取位置中，请稍后");
sleep(500).then(() => {
    exec(function () {
        return vm.confirm();
    });
})