// ==UserScript==
// @name           亚马逊listing挽尊
// @author         xiafanmao
// @license      Zlib/Libpng License
// @version        1.1
// @description    display fake BSR badge on Amazon product pages.
// @namespace      null
// @require        https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @match        *://www.amazon.com/*
// @match        *://www.amazon.ca/*
// @match        *://www.amazon.co.uk/*
// @match        *://www.amazon.de/*
// @match        *://www.amazon.fr/*
// @match        *://www.amazon.it/*
// @match        *://www.amazon.es/*
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452178/%E4%BA%9A%E9%A9%AC%E9%80%8Alisting%E6%8C%BD%E5%B0%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/452178/%E4%BA%9A%E9%A9%AC%E9%80%8Alisting%E6%8C%BD%E5%B0%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

//var webtxt = document.documentElement.innerText
//var re1 = new RegExp('(?<=Best Sellers Rank.*in).*');
//var cgt = webtxt.match(re1);
var webtxt = document.documentElement.innerText
if(webtxt.indexOf("See Top 100") != -1) {
var re1 = new RegExp('(?<=Best Sellers Rank.*in).*?(?=[(])');
}else{
re1 = new RegExp('(?<=Best Sellers Rank.*in).*');
    }
var cgt = webtxt.match(re1);

var links = document.getElementsByTagName('a')
for(let i=0; i<links.length; i++){
  let linkUrl=links[i].href
var re = new RegExp('https://www.*/gp/bestsellers.*pd_zg_ts.*');
var lk = linkUrl.match(re);
  if(lk!=null){
      var lk2 = lk[0];
  }
}

      var insertHTML = `
<div class="zg-badge-wrapper">
	        <a class="badge-link" href="${lk2}"  title="${cgt}">
	        <i class="a-icon a-icon-addon p13n-best-seller-badge">#1 Best Seller</i> <span class="cat-name">
	            <span class="cat-link">in ${cgt}</span>
	        </span>
	        </a>
	        </div>`;
            const el = (document.getElementById('acBadge_feature_div')
                        || false);
            if (el) {
                el.insertAdjacentHTML('afterEnd', insertHTML);
            }

})();