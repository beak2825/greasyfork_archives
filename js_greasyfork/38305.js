// ==UserScript==
// @name     Doodletoo
// @version  1
// @grant    none
// @match    http://www.doodletoo.com/*
// @author   TheOriginalBob
// @description Image search as a reference for doodletoo
// @namespace https://greasyfork.org/users/169540
// @downloadURL https://update.greasyfork.org/scripts/38305/Doodletoo.user.js
// @updateURL https://update.greasyfork.org/scripts/38305/Doodletoo.meta.js
// ==/UserScript==

var inputText = document.createElement('input');
inputText.id = 'searchInput';
inputText.setAttribute('type','text');
inputText.style.position = 'fixed';
inputText.style.zIndex = 1000;
inputText.style.top = '650px';
inputText.style.left = '10px';

document.getElementById('shadow').appendChild(inputText);

var imageResult = document.createElement('img');
imageResult.id = 'imageResult';
imageResult.style.position = 'fixed';
imageResult.style.zIndex = 1000;
imageResult.style.top = '400px';
imageResult.style.left = '10px';
imageResult.style.width = '400px';
imageResult.style.height = '250px';

document.getElementById('shadow').appendChild(imageResult);

imageResult.addEventListener('click',function(ele){
	imageResult.style.display = 'none';
});

inputText.addEventListener('keyup', function(ele){
	if (ele.keyCode == 13) {
    var xmlHttp = new XMLHttpRequest();
 	 	xmlHttp.open('GET', "https://api.qwant.com/api/search/images?count=1&offset=0&q=" + inputText.value,false);
  	xmlHttp.send();
  	var result = JSON.parse(xmlHttp.responseText);
    if (result.status == 'error') {
  		return alert('An Error Occured While Getting Image');
  	} else {
  		result = result.data.result.items[0].media;
  	}
    imageResult.setAttribute('src',result);
    imageResult.style.display = ''
  	inputText.value = null;
  }
});