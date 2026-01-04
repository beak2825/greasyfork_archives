// ==UserScript==
// @name 获取 ss:// 协议链接
// @namespace mouyong
// @description 获取 ss:// 协议链接，并自动复制到粘贴板，方便用户操作
// @author 牟勇
// @license LGPL
// @match https://www.youneed.win/free-ss
// @match https://flywind.ml/free-ss
// @grant none
// @version 0.0.4
// @downloadURL https://update.greasyfork.org/scripts/386995/%E8%8E%B7%E5%8F%96%20ss%3A%20%E5%8D%8F%E8%AE%AE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/386995/%E8%8E%B7%E5%8F%96%20ss%3A%20%E5%8D%8F%E8%AE%AE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

var ss_LinkList = [];

function getLink() {
  var s2 = document.querySelectorAll("tbody > tr");

  try {
     for (var i=0; i<s2.length; i++) {
        var link = 'ss://'+btoa(s2[i].children[3].innerText+':'+s2[i].children[2].innerText+'@'+s2[i].children[0].innerText+':'+s2[i].children[1].innerText);
       
        ss_LinkList.push(link);
       
       
        console.log(link)
     }
    console.log(ss_LinkList.join('\n'));
  } catch(e) {
    alert("生成链接错误: " + e.message)
    console.error(e)
    console.log(ss_LinkList.reverse().join('\n'));
  }
  
}

function copySSlink() {
  var input = document.createElement('input')
  
  try {
    
    var link = ss_LinkList.shift();
    
    if (link) {
      input.setAttribute('value', link);
      
      document.body.appendChild(input);
      
      input.select();
      
      document.execCommand('copy');
      
      alert('复制成功, 当前链接是 ' + link);
      
    } else {
      alert("未获取到 ss 协议链接，请手动打开控制台进行复制");
    }
    
  } catch(e) {
    alert("复制 ss 协议连接错误" + e.message);
  }
}

window.onload = function () {
  getLink();

  copySSlink();
}