// ==UserScript==
// @name         好买基金点击到天天基金
// @namespace    https://greasyfork.org/users/14059
// @version      0.1
// @description  在好买基金的自选页面点击链接会打开天天基金的页面,需手动点击替换链接油猴菜单
// @author       setycyas
// @match        https://www.howbuy.com/fundtool/zixuan.htm
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436570/%E5%A5%BD%E4%B9%B0%E5%9F%BA%E9%87%91%E7%82%B9%E5%87%BB%E5%88%B0%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91.user.js
// @updateURL https://update.greasyfork.org/scripts/436570/%E5%A5%BD%E4%B9%B0%E5%9F%BA%E9%87%91%E7%82%B9%E5%87%BB%E5%88%B0%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  GM_registerMenuCommand('替换链接',function(){
    let links = document.getElementsByTagName('a'); //所有的链接
    let patt = /https:\/\/www.howbuy.com\/fund\/([0-9]{6})\//; //好买基金的基金链接正则表达式
    //let patt = /\/fund\/([0-9]{6})\//; //好买基金的基金链接正则表达式
    let totalFound = 0; //找到的链接总数
    for(let i = 0;i < links.length;i++){
      let m = links[i].href.match(patt);
      if(m) {
          links[i].href = 'http://fund.eastmoney.com/'+m[1]+'.html';
          links[i].target = '_blank';
          totalFound += 1;
      }
    }
    alert('替换成天天基金链接成功!替换总数:'+totalFound);
  });

  return;
})();