// ==UserScript==
// @name         中移网大
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在中移网大播放视频界面防止自动暂停，可以多开视频播放页面，会自动刷完该页面所有视频
// @author       You
// @match        https://wangda.chinamobile.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427646/%E4%B8%AD%E7%A7%BB%E7%BD%91%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/427646/%E4%B8%AD%E7%A7%BB%E7%BD%91%E5%A4%A7.meta.js
// ==/UserScript==

(function() {

console.log('start');
setTimeout(function(){

    if (document.getElementsByClassName('item sub-text')[0].innerText=='文档')
 {
  console.log('这是文档阅读');
  window.setInterval(function(){
    document.getElementsByClassName('item sub-text')[document.getElementsByClassName('item sub-text').length-1].click();
    for(var i = 0; i < document.getElementsByClassName('item sub-text').length; i++)
    {

    if (document.getElementsByClassName('required ')[i].getElementsByTagName('span')[0].textContent !='已完成')
    {
    console.log(i,document.getElementsByClassName('required ')[i].getElementsByTagName('span')[0].textContent);
    document.getElementsByClassName('item sub-text')[i].click();
    break;
    }
    else
    {
    console.log(i,document.getElementsByClassName('required ')[i].getElementsByTagName('span')[0].textContent);

    }
     };
         } ,5000);
 }
 else
 {
  console.log('这是视频阅读材料')
  window.setInterval(function(){
  if (document.getElementsByClassName('videojs-referse-btn'))
       {
    document.getElementsByClassName('videojs-referse-btn')[0].click();
    }
  else
      {
      document.getElementsByClassName('vjs-big-play-button')[0].click();
      }
  }, 3000);

 }





}, 10000);
})();