// ==UserScript==
// @name         Indreams Short Share
// @version      0.1
// @description  Adds a share link to Indreams using the drms.me format.
// @author       Mandogy
// @match        https://indreams.me/*
// @grant        none
// @namespace https://greasyfork.org/users/771507
// @downloadURL https://update.greasyfork.org/scripts/427661/Indreams%20Short%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/427661/Indreams%20Short%20Share.meta.js
// ==/UserScript==

(function() {
    'use strict';
function my_script(){
    var share = document.getElementsByClassName("share__list");
    share = share[0];
    var link = document.createElement("li");
    var share_button = document.createElement("button");
    share_button.setAttribute("class", "share_link");
    share_button.innerText = "Share Link";
    link.appendChild(share_button);
    share.appendChild(link);
    share_button.onclick = function(){
	var pathname = window.location.pathname;
	var position = pathname.lastIndexOf("/") + 1;
	pathname = pathname.substring(position);
	console.log(pathname);
	var link = ("https://drms.me/" + pathname);
	var copyToClipboard = str => {
		var el = document.createElement('textarea');
		el.value = link;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	};
    copyToClipboard();
    }
}
    var intervalID = window.setInterval(myCallback, 100);

function myCallback() {
    if(document.getElementsByClassName("share_link").length == 0 && document.getElementsByClassName("share__list").length != 0){
        console.log("Copy Link Added");
        my_script();
    }
}

})();