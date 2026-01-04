// ==UserScript==
// @name        知乎、百度去除cookie
// @namespace   github.com/GreenDebug
// @version      11.4.5.33
// @description 去除cookie
// @author       GreenDebug
// @match        http://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462606/%E7%9F%A5%E4%B9%8E%E3%80%81%E7%99%BE%E5%BA%A6%E5%8E%BB%E9%99%A4cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/462606/%E7%9F%A5%E4%B9%8E%E3%80%81%E7%99%BE%E5%BA%A6%E5%8E%BB%E9%99%A4cookie.meta.js
// ==/UserScript==
const gf_script_version={
last_ver:'3.5.0',
    last_note:`更新 & 优化:
    1.侧边栏快捷操作命令\`addaction\`（添加） \`delaction\`（删除）
    2.\`zhelp\`命令修复
    `
};
(function(){

    const all = (arr, fn = Boolean) => arr.every(fn);
    function getCookie(name) {
        if(name=='baidu')  return '114514'
    var preg = new RegExp("(^| )" + name + "=([^;]*)(;|$)", "g");
    if (preg.test(document.cookie)) {
        return RegExp.$2;
    } else {
        return "";
    }
    try{
        var cookie=getCookie('baidu');
      all([...cookie]);
    }catch{
    }
}
})();