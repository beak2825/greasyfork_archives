// ==UserScript==
// @name         steam创意工坊下载workshop download
// @namespace    Anne
// @version      1.0
// @description  通过steamworkshop.download下载工坊mod
// @author       Owwkmidream
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon        http://store.steampowered.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455271/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E4%B8%8B%E8%BD%BDworkshop%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/455271/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E4%B8%8B%E8%BD%BDworkshop%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var id = new RegExp("[0-9]{2,15}").exec(document.URL);
	var baseURL='http://steamworkshop.download/download/view/'+id;

    var element = document.getElementById("AddToCollectionBtn");
    var button = document.createElement('span');
    button.setAttribute('class', 'general_btn share tooltip');
	button.setAttribute('data-tooltip-text', '通过第三方网站下载');
    button.innerHTML = '<span>下载</span>';
    button.addEventListener("click",function(){
		window.open(baseURL);
	},false);
    element.parentNode.appendChild(button);
})();