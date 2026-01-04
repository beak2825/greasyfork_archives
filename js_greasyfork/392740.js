// ==UserScript==
// @name         龙的天空论坛备注用户
// @version      0.7
// @include        http://www.lkong.net/forum*
// @include        http://www.lkong.net/viewthread.php*
// @include        http://www.lkong.net/thread*
// @include        http://www.lkong.net/redirect.php*
// @author       仙圣
// @description 仅支持旧版龙空，但大家可以修改为任何一个Discuz!论坛……备注名不建议太长，太长会显示不完全。
// @namespace https://greasyfork.org/users/76579
// @downloadURL https://update.greasyfork.org/scripts/392740/%E9%BE%99%E7%9A%84%E5%A4%A9%E7%A9%BA%E8%AE%BA%E5%9D%9B%E5%A4%87%E6%B3%A8%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/392740/%E9%BE%99%E7%9A%84%E5%A4%A9%E7%A9%BA%E8%AE%BA%E5%9D%9B%E5%A4%87%E6%B3%A8%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==
(function() {
    var setid = ["1","2"];//此处为用户的uid
    var note = ["这是备注","备注2"];
    var names = document.getElementsByClassName("xw1");
    for(var a=0; a<names.length; a++) {
       for(var n=0; n<setid.length; n++) {
        if (names[a].href == location.origin+"/home.php?mod=space&uid="+setid[n])
         {
            names[a].innerHTML += '<img src="https://i.loli.net/2019/11/09/Kjwi68ecyCmqaS2.png" class="vm" alt="备注" >'+note[n];
         }
       }
    }

    document.addEventListener("DOMContentLoaded",go);

    go();
     function go(){
        var x="div.pi{padding-left: 15px;height:30px;}";
        var y=document.createElement('style');
        y.innerHTML=x;
        document.getElementsByTagName('head')[0].appendChild(y);
    }
    }
)();