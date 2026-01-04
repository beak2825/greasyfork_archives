// ==UserScript==
// @name dev.kylin.com链接修正
// @namespace kylinos
// @match https://dev.kylin.com/*
// @grant none
// @description dev.kylin.com link fix
// @version 0.0.1.20180704063703
// @downloadURL https://update.greasyfork.org/scripts/370034/devkylincom%E9%93%BE%E6%8E%A5%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/370034/devkylincom%E9%93%BE%E6%8E%A5%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==
(function(){
var a_list = document.querySelectorAll('a');
for(i=0;i<a_list.length;i++){
  var tmp_a = a_list[i];
  var tmp_href = tmp_a.getAttribute('href');
  //alert(tmp_href);
  if(tmp_href.startsWith('https://launchpad.dev')){
    //alert('change');
    tmp_a.setAttribute('href',tmp_href.replace('https://launchpad.dev','https://dev.kylin.com',1))
  }
  if(tmp_href.startsWith('/')){
    tmp_a.setAttribute('href','https://dev.kylin.com'+tmp_href)
  }
}
})()