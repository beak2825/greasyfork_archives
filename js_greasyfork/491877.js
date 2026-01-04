// ==UserScript==

// @name         NGA 文章範本儲存器 (本地)
// @name:zh-TW   NGA 文章範本儲存器 (本地)
// @name:zh-CN   NGA 文章模版存储器 (本地)
// @name:ja      NGA 文章テンプレートストレージ（ローカル）
// @name:en      NGA Article Template Repository (Local)
// @version      1.8
// @author       Scott

// @description         儲存文章範本到本地儲存並供檢索
// @description:zh-TW   儲存文章範本到本地儲存並供檢索
// @description:zh-CN   存储文章模版到本地存储并供检索
// @description:ja      記事のテンプレートをローカルに保存して検索に使用します
// @description:en      Save article template to local storage for retrieval.


// @namespace    https://www.youtube.com/c/ScottDoha


// @match        *://bbs.ngacn.cc/*.php*
// @match        *://ngabbs.com/*.php*
// @match        *://nga.178.com/*.php*
// @match        *://bbs.nga.cn/*.php*
// @match        *://g.nga.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/491877/NGA%20%E6%96%87%E7%AB%A0%E7%AF%84%E6%9C%AC%E5%84%B2%E5%AD%98%E5%99%A8%20%28%E6%9C%AC%E5%9C%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491877/NGA%20%E6%96%87%E7%AB%A0%E7%AF%84%E6%9C%AC%E5%84%B2%E5%AD%98%E5%99%A8%20%28%E6%9C%AC%E5%9C%B0%29.meta.js
// ==/UserScript==

!function(){"use strict";var e=GM_getValue("savedTemplates",{"範本 1":"這是範本1的內容。","範本 2":"這是範本2的內容。","範本 3":"這是範本3的內容。","範本 4":"這是範本4的內容。","範本 5":"這是範本5的內容。"}),t=document.createElement("select");for(var n in t.id="templateSelect",t.style.marginRight="10px",t.style.display="inline-block",t.style.width="100px",e){var a=document.createElement("option");a.value=n,a.textContent=n,t.appendChild(a)}t.addEventListener("change",(function(){var n=t.value;document.querySelector('textarea[name="post_content"]').value=e[n]}));var l=document.createElement("div");l.style.marginTop="0px",l.style.float="right";var i=document.createElement("div");i.textContent="by Scottdoha",i.style.display="inline-block",i.style.marginRight="10px";var r=document.createElement("input");r.type="text",r.placeholder="範本名稱",r.style.marginRight="5px";var o=document.createElement("button");o.textContent="保存範本",o.style.marginRight="5px",o.addEventListener("click",(function(){if(""!==(a=r.value.trim())){var n=document.querySelector('textarea[name="post_content"]');for(var a in e[a]=n.value,GM_setValue("savedTemplates",e),t.innerHTML="",e){var l=document.createElement("option");l.value=a,l.textContent=a,t.appendChild(l)}alert("範本已保存！")}else alert("請輸入範本名稱！")}));var d=document.createElement("button");d.textContent="刪除範本",d.addEventListener("click",(function(){var n=t.value;if(confirm("確定要刪除選中的範本嗎？")){for(var a in delete e[n],GM_setValue("savedTemplates",e),t.innerHTML="",e){var l=document.createElement("option");l.value=a,l.textContent=a,t.appendChild(l)}alert("範本已刪除！")}})),l.appendChild(i),l.appendChild(t),l.appendChild(r),l.appendChild(o),l.appendChild(d),document.querySelector('input[type="file"]').insertAdjacentElement("beforebegin",l)}();