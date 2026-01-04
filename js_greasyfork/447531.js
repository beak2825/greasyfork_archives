// ==UserScript==
// @name        knife4j 文档微服务 服务名自动拼接
// @namespace   Violentmonkey Scripts
// @match       https://*/doc.html
// @grant       none
// @version     0.1.1
// @author      -
// @description 7/7/2022, 11:08:53 AM
// @downloadURL https://update.greasyfork.org/scripts/447531/knife4j%20%E6%96%87%E6%A1%A3%E5%BE%AE%E6%9C%8D%E5%8A%A1%20%E6%9C%8D%E5%8A%A1%E5%90%8D%E8%87%AA%E5%8A%A8%E6%8B%BC%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/447531/knife4j%20%E6%96%87%E6%A1%A3%E5%BE%AE%E6%9C%8D%E5%8A%A1%20%E6%9C%8D%E5%8A%A1%E5%90%8D%E8%87%AA%E5%8A%A8%E6%8B%BC%E6%8E%A5.meta.js
// ==/UserScript==


setInterval(() => {
  var ele = document.querySelector("#app > div > section > section > div > div.ant-tabs-content.ant-tabs-content-no-animated.ant-tabs-top-content.ant-tabs-card-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > main > div > div > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-left-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.knife4j-debug > div > div > div > div:nth-child(1) > div > span > input");
  let eletext = ele.value;
  
  let text = document.querySelector("#app > div > section > section > header > div > span").innerHTML;
  if (!eletext.includes(text)){
    ele.click()
    ele.value = text+eletext;
    ele.dispatchEvent(new InputEvent('input'));
    
    
  }
}, 200)
