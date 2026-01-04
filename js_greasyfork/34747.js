// ==UserScript==
// @name          SZ审核
// @description   一键通过
// @namespace     Violentmonkey Scripts
// @include       *://my.jjwxc.net/backend/political_examine.php*
// @grant         GM_addStyle
// @version       0.0.2.20171106
// @downloadURL https://update.greasyfork.org/scripts/34747/SZ%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/34747/SZ%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==

var newbtn = document.createElement("input");
newbtn.type = "button";
newbtn.value = "一键通过";
newbtn.onclick = autopass;
newbtn.setAttribute ('id', 'newbtn');
document.body.appendChild(newbtn); 

function autopass () {
  var btns = document.getElementsByTagName('input');
  if (btns.length > 2) {
    if (btns[0].value=="√无涉政内容") {
      btns[0].click();
    }
    for( var i = btns.length -2 ; i>=0 ; i--) {
        if (btns[i].value=="√无涉政内容") {
           btns[i].click();
        }
    }
  }
}

//--- Style our newly added elements using CSS.
GM_addStyle ("\
    input#newbtn {\
        position: fixed;\
        top: 0;\
        left: 0;\
    }\
");