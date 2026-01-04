// ==UserScript==
// @name        自动切换商品详情页标题
// @namespace   Violentmonkey Scripts
// @match       https://item-console.duolainc.com/#/detail/index/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/30/2022, 2:04:52 PM 单品的详情页 tab 标题会自动切换为 itemid + 类目名称的格式，方便识别
// @license MIT  
// @downloadURL https://update.greasyfork.org/scripts/450447/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E9%A1%B5%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/450447/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E9%A1%B5%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

console.log('油猴脚本-切换标题')

var interval = setInterval(function() { ChangeTabTitleWith(); }, 5000);

function ChangeTabTitleWith(){
   var item_id = document.querySelector('#app > div > div > section > div > div.el-card.detail-card.is-always-shadow > div > div > div.detail-info-right > div:nth-child(3) > div > form > div:nth-child(1) > div > label').innerText
   var category = document.querySelector('#app > div > div > section > div > div.el-card.detail-card.is-always-shadow > div > div > div.detail-info-right > div:nth-child(3) > div > form > div:nth-child(4) > div > label > a').innerText
   var NewTabTitle = item_id + '-' + category
   console.log(NewTabTitle)
    if(item_id != null){
      document.title = NewTabTitle;
      clearInterval(interval)
    }
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        console.log('页面加载完成')
      // setTimeout(function() { ChangeTabTitleWithf(); }, 5000);
          interval;

    }
}

