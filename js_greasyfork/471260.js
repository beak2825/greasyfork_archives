// ==UserScript==
// @name     WikiSideBarOnOff
// @description aside Sidebar DokuWiki on/off
// @version  1.2
// @grant    none
// @match http://192.168.50.30/*
// @namespace https://greasyfork.org/users/233939
// @downloadURL https://update.greasyfork.org/scripts/471260/WikiSideBarOnOff.user.js
// @updateURL https://update.greasyfork.org/scripts/471260/WikiSideBarOnOff.meta.js
// ==/UserScript==

var btn_aside = '<button id="btn_sidebar">SideBar on/off</button>&nbsp;';
document.getElementsByClassName('bchead')[0].insertAdjacentHTML('beforebegin', btn_aside);

var state_aside = window.localStorage.getItem('state_aside');
if (state_aside == 'hidden'){
	document.getElementById('dokuwiki__aside').style.visibility = 'hidden';
    pads = document.getElementsByClassName('pad');
    pads[2].style.marginLeft = '0';
}
if (state_aside == ''){
	document.getElementById('dokuwiki__aside').style.visibility = '';
	pads = document.getElementsByClassName('pad');
	pads[2].style.marginLeft = '18em';
}

document.getElementById('btn_sidebar').addEventListener('click', function(){
  if (document.getElementById('dokuwiki__aside').style.visibility == ''){
	document.getElementById('dokuwiki__aside').style.visibility = 'hidden';
    pads = document.getElementsByClassName('pad');
    pads[2].style.marginLeft = '0';
	window.localStorage.setItem('state_aside', 'hidden');
  } else {
    document.getElementById('dokuwiki__aside').style.visibility = '';
	pads = document.getElementsByClassName('pad');
	pads[2].style.marginLeft = '18em';
	window.localStorage.setItem('state_aside', '');
  }
});