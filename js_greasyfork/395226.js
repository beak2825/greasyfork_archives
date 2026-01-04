// ==UserScript==
// @name         PU - E校園一鍵登入
// @namespace    MZ
// @version      0.1
// @description  PU-E校園一鍵登入
// @author       MZ
// @match        https://alcat.pu.edu.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395226/PU%20-%20E%E6%A0%A1%E5%9C%92%E4%B8%80%E9%8D%B5%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/395226/PU%20-%20E%E6%A0%A1%E5%9C%92%E4%B8%80%E9%8D%B5%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    var account = "" ;
    var password = "" ;


    var button = document.createElement("input");
    button.type = "button";
    button.value = "Login";

    var c = document.evaluate('/html/body/nav/div/div[2]/form/div[2]/div[2]/button', document,null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    c.appendChild(button);

    button.onclick = function(){
		document.getElementsByName("uid")[0].value = account;
        document.getElementsByName("upassword")[0].value = password;
	};
})();