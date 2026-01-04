// ==UserScript==
// @name     RSwiki Version History
// @description Adds skip to Jan 09 Page for RsWiki
// @version  1
// @grant    none
// @run-at   document-end
// @match  https://runescape.wiki/w/*
// @license GNU GPLv3
// @namespace https://greasyfork.org/users/1088091
// @downloadURL https://update.greasyfork.org/scripts/500600/RSwiki%20Version%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/500600/RSwiki%20Version%20History.meta.js
// ==/UserScript==


var currentPage = window.location.href;

var historyInfo = document.querySelector('#ca-history > a:nth-child(1)');
console.log(historyInfo);
let historyEra = document.createElement('a');
historyEra.href = historyInfo.href + "&year=2009&month=1&tagfilter=";
historyEra.innerText = 'Jan 09 Page';
historyInfo.after(historyEra);

const intervalId = setInterval(loadFuture,100)

function loadFuture(){
  var futurePage = document.querySelector('.before > a:nth-child(5)');
  if(currentPage.endsWith("&year=2009&month=1&tagfilter=")){
  	if(futurePage){
    	clearInterval(intervalId);
 			window.location.href = document.querySelector('.before > a:nth-child(5)').href; 
  	}
  }
}