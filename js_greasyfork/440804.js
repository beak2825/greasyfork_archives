// ==UserScript==
// @name         go_JD_union
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动跳转到商品相应的京东联盟，自己的返利自己赚!
// @include http*://item.jd.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440804/go_JD_union.user.js
// @updateURL https://update.greasyfork.org/scripts/440804/go_JD_union.meta.js
// ==/UserScript==

// Your code here...
//debugger;
function run(){
	var searchPrefix="https://union.jd.com/proManager/index?pageNo=1&keywords=";
	var link=location.href;
    var realLink=getRealLink(link);
    //alert(realLink);
    var targetLink=searchPrefix+encodeURIComponent(realLink);
	var block;
    //block=document.querySelector("#summary-weight");
    block=document.querySelector("#choose-btns");
	var br=document.createElement('br');
	var mamaLink=document.createElement('a');
	mamaLink.href=targetLink;
	mamaLink.target='_blank';
	mamaLink.innerText='go_JD_union';
	block.appendChild(mamaLink);


}

function getRealLink(longLink){
	var n=longLink.indexOf('?');
    if (n==-1){
        return longLink;
    }
return longLink.substr(0,n);

}


run();