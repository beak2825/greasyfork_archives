// ==UserScript==
// @name         tw.mobi.yahoo_style.display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  購物中心訂單查詢
// @author       You
// @match        https://tw.mobi.yahoo.com/member
// @grant    GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/387116/twmobiyahoo_styledisplay.user.js
// @updateURL https://update.greasyfork.org/scripts/387116/twmobiyahoo_styledisplay.meta.js
// ==/UserScript==

/*
            GM_openInTab(url, options)：開啟新的tabe
            active：焦點放在新開的頁面
            insert：將新的頁面放在目前頁面的後面
            setParent：取代目前頁面
*/

(function() {
    'use strict';
      var target=document.getElementById("promotion-banner");
      target.style.display="none";
                 // document.getElementsByClassName
      var target2=document.getElementsByClassName("Mb(8px) Mx(a) Pt(24px) W(100%)")[1];
      target2.style.display="none";

    //var scrollTop =  document.body.scrollTop; // || 0;
    //scrollTop =500;
    //document.documentElement.scrollTop=200;
    // Your code here...
     var input=document.createElement("input");
     input.id="dm1";
     input.name="daimom";
     input.type="button";
     input.value="購物中心訂單查詢";
     input.onclick = showAlert;
     input.setAttribute("style", "font-size:20px;position:absolute;top:90px;right:10px;z-index:888;");
     document.body.appendChild(input);

     var input2=document.createElement("input");
     input2.id="dm2";
     input2.name="daimom2";
     input2.type="button2";
     input2.value="重整";
     input2.onclick = 重新整理;
     input2.setAttribute("style", "font-size:12px;position:absolute;top:230px;left:30px;width:50px;z-index:777;");
     document.body.appendChild(input2);
})();

function showAlert(){
    //var curTab = GM_openInTab ('https://tw.buy.yahoo.com/','active');
    var curTab = GM_openInTab ('https://tw.buy.yahoo.com/myaccount/orderlist',{ active: true });
}

function 重新整理(){
    history.go(0);
}
