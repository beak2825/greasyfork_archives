// ==UserScript==
// @name         noi-pro
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  happy
// @author       jsh
// @match        http://noi.openjudge.cn/topic/*
// @match        http://noi.openjudge.cn/ch0101/clarify/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423004/noi-pro.user.js
// @updateURL https://update.greasyfork.org/scripts/423004/noi-pro.meta.js
// ==/UserScript==
 function parseDom(arg) {
　　 var objE = document.createElement("div");
　　 objE.innerHTML = arg;
　　 return objE.childNodes;
};
function customInfoCard() {
	var a = document.querySelectorAll("p,h1,h2,h3,h4,h5,h6,a");
	for (var i = 0; i < a.length; i++) {
		if (a[i].innerText[0]== "<") {
            var inserta= parseDom(a[i].innerText)[0];
			a[i].parentNode.replaceChild(inserta,a[i]);
		}
	}
}
(function() {
    var k = window.setInterval(customInfoCard, 500);
    var items=document.getElementsByTagName("p");
    var fg=document.getElementsByTagName("a");
    var username=fg[1].firstChild.nodeValue;
    for(var i=0;i<items.length;i++){
        var t="@"+username;
        var value=items[i].firstChild.nodeValue;
        if(value.indexOf(t)>-1){
            t="有人@了你";
            alert(t);
        }
    }
})();