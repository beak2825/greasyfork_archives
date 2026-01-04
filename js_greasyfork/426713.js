// ==UserScript==
// @name         代码对比/归并工具文本框宽度调整脚本(实用在线工具 - 开源中国(OSCHINA))
// @namespace    https://greasyfork.org/zh-CN/scripts/426713
// @version      0.2
// @description  工具网址: https://tool.oschina.net/diff/ 其他工具网址: https://tool.oschina.net/
// @author       beibeibeibei
// @match        *tool.oschina.net/diff*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426713/%E4%BB%A3%E7%A0%81%E5%AF%B9%E6%AF%94%E5%BD%92%E5%B9%B6%E5%B7%A5%E5%85%B7%E6%96%87%E6%9C%AC%E6%A1%86%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4%E8%84%9A%E6%9C%AC%28%E5%AE%9E%E7%94%A8%E5%9C%A8%E7%BA%BF%E5%B7%A5%E5%85%B7%20-%20%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%28OSCHINA%29%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426713/%E4%BB%A3%E7%A0%81%E5%AF%B9%E6%AF%94%E5%BD%92%E5%B9%B6%E5%B7%A5%E5%85%B7%E6%96%87%E6%9C%AC%E6%A1%86%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4%E8%84%9A%E6%9C%AC%28%E5%AE%9E%E7%94%A8%E5%9C%A8%E7%BA%BF%E5%B7%A5%E5%85%B7%20-%20%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%28OSCHINA%29%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector("form.form-inline.well").innerHTML = "<div class=\"diff-editor-width\" style=\"font-size: 24px;margin-bottom: 5px;\"><c style=\"color: black;\">代码对比/归并 powered by OSCHINA</c><button type=\"button\" style=\"padding: 0 10px;border-radius: 4px;color: rgba(0,0,0,0.65);height: 36px;float: right;\" onclick=\"var W = document.querySelector(\'input[class=diff-editor-width]\').value; if(W<430){W=430}; document.querySelector(\'#diff-editor-lhs\').style.width = W + \'px\'; document.querySelector(\'#diff-editor-rhs\').style.width = W + \'px\'; document.querySelector(\'#diff-editor-lhs > div > div.CodeMirror-scroll.cm-s-default\').style.width = W + \'px\'; document.querySelector(\'#diff-editor-rhs > div > div.CodeMirror-scroll.cm-s-default\').style.width = W + \'px\'; document.querySelector(\'#diff\').style.width = (W - 476) * 2 + 1000 + \'px\';document.querySelector(\'#mainContent\').style.width = (W - 476)*2 + 1000 + \'px\';\">修改宽度</button><input type=\"text\" class=\"diff-editor-width\" value=\"476\" style=\"width: 50px;height: 36px;box-sizing: border-box;border: 1px solid #2d78f4;float: right;\"><input id=\"hiddenText\" type=\"text\" style=\"display:none\" /></div><br><div style=\"color:#C00;margin-bottom: 5px;\">由于IE全系列对HTML5的Canvas以及File API支持不好，推荐使用<a href=\"http://www.oschina.net/p/chrome\" target=\"blank\" one-link-mark=\"yes\">Chrome</a>、<a href=\"http://www.oschina.net/p/firefox\" target=\"blank\" one-link-mark=\"yes\">Firefox</a>浏览器，另外请选择正确的文件编码方式以免出现乱码或者显示错误。</div>" + document.querySelector("form.form-inline.well").innerHTML;
    document.querySelector("#headerNavMenu").remove();
    document.querySelector("#mainContent > div.toolName").remove();
    document.querySelector("#diff").style.marginTop = "5px";
    document.querySelector("form.form-inline.well").style.padding = "15px";
    document.querySelector("form.form-inline.well").style.height = "80px";
    document.querySelector("#mainContent > div > div[style^='color:#C00;']").remove();
    // Your code here...
})();