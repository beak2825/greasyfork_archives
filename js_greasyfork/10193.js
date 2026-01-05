// ==UserScript==
// @name        Domain Monster Minimalist Modern Grey Re-style - no Orange
// @namespace   english
// @description Domain Monster Minimalist Modern Re-style  - http://pushka.com/coding-donation
// @include     http*://*domainmonster.com*
// @version     1.9
// @run-at document-end
// @grant       GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/10193/Domain%20Monster%20Minimalist%20Modern%20Grey%20Re-style%20-%20no%20Orange.user.js
// @updateURL https://update.greasyfork.org/scripts/10193/Domain%20Monster%20Minimalist%20Modern%20Grey%20Re-style%20-%20no%20Orange.meta.js
// ==/UserScript==
// Main - Reddit The Button Show Cheaters


var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '          /*DM CSS*/ #headerContent img,#theFuture{display:none;}div#headerContent {  height: 70px;}#headerContent ul.login li a{width:100px; height:100px;}  /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}        ';
document.getElementsByTagName('head')[0].appendChild(style);




/*
$( document ).ready(function() {
	var styles1 = {
      background-image : "url('http://i.imgur.com/CPeXrqs.png')"
    };
    $( "#headerContent li:nth-child(1)" ).css( styles1 );
	var styles = {
      background-image : "url('http://i.imgur.com/Xqk5ak3.png')"
    };
    $( "#headerContent li:nth-child(2)" ).css( styles );

});
*/


