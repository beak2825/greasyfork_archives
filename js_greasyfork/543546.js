// ==UserScript==
// @name         [comicat] search in complete
// @name:zh-CN   【漫猫动漫】合集搜索
// @description  Let you search Title in complete page on [comicat.org]
// @description:zh-CN 让【漫猫动漫】可以在合集页内搜索指定的标题
// @namespace	 http://www.mapaler.com/
// @version      1.0.1
// @author       Mapaler <mapaler@163.com>
// @copyright	 2025+, Mapaler <mapaler@163.com>
// @license      MIT
// @match        *://www.comicat.org/complete-*
// @match        *://www.comicat.org/*complete=*
// @icon         https://www.comicat.org/images/favicon/comicat.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543546/%E3%80%90%E6%BC%AB%E7%8C%AB%E5%8A%A8%E6%BC%AB%E3%80%91%E5%90%88%E9%9B%86%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/543546/%E3%80%90%E6%BC%AB%E7%8C%AB%E5%8A%A8%E6%BC%AB%E3%80%91%E5%90%88%E9%9B%86%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
const url = new URL(location);
//套一层 form
const topsearchDiv = document.querySelector(".topsearch");
if (!topsearchDiv) return;
const form = document.createElement("form");
form.id = "f_topsearch";
form.action = "search.php";
form.append(...topsearchDiv.children);
topsearchDiv.appendChild(form);
//修改目前的输入框
const iptTopsearch = form.querySelector("#topsearch");
iptTopsearch.name = "keyword";
iptTopsearch.type = "search";
//删除原来的按钮，生成新的按钮
let oldBtn = form.querySelector("a");
const btnSumbit = document.createElement("button");
btnSumbit.type = "sumbit";
btnSumbit.innerHTML = oldBtn.innerHTML;
form.appendChild(btnSumbit);
oldBtn.remove();
oldBtn = null;
//建立隐藏属性
const iptComplete = document.createElement("input");
iptComplete.name = "complete";
iptComplete.type = "hidden";
iptComplete.value = (url=>{
    //经测试，值为 0、"" 时能搜索到非合集，为 NaN、false 时搜索不到合集
    if (url.pathname.includes("/complete-")) return 1;
    let param = Number(url.searchParams.get("complete"));
    if (Boolean(param) || Number.isNaN(param)) return 1;
    return 0;
})(url);
form.appendChild(iptComplete);
})();