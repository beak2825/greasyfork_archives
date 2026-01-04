// ==UserScript==
// @name        湖南人才市场公共教育网切换专业课
// @namespace   Violentmonkey Scripts
// @match       https://www.hnpxw.org/userStudy*
// @grant       none
// @version     1.01
// @author      -
// @description 2024/7/7 18:20:36
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499985/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%E5%88%87%E6%8D%A2%E4%B8%93%E4%B8%9A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/499985/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%E5%88%87%E6%8D%A2%E4%B8%93%E4%B8%9A%E8%AF%BE.meta.js
// ==/UserScript==
let hre = location.href
if (hre.includes("https://www.hnpxw.org/userStudy")){
      setInterval(() => {
try {
if(document.querySelector("#tab-third").innerText != '专业课（0）'){
document.querySelector("#tab-third").click()}
} catch(err) {window.location.reload();}
      }, 1000);
	}