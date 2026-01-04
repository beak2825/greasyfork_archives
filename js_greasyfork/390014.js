// ==UserScript==
// @name         备注
// @version      0.3
// @include      https://www.mcbbs.net/*
// @author       xmdhs
// @description discuz备注用户
// @namespace https://greasyfork.org/users/166541
// @downloadURL https://update.greasyfork.org/scripts/390014/%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/390014/%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==
(function() {
    var setid = ["1770442"];
    var note = ["这是备注"];
    var names = document.getElementsByClassName("xw1");
    for(var a=0; a<names.length; a++) {
       for(var n=0; n<setid.length; n++) {
        if (names[a].href == location.origin+"/home.php?mod=space&uid="+setid[n])
         {  
            names[a].innerHTML += '<img src="https://i.loli.net/2019/11/09/Kjwi68ecyCmqaS2.png" class="vm" alt="备注" title="'+note[n]+'">';
         }
       }
    }
}
)();