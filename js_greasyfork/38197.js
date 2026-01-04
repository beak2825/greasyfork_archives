// ==UserScript==
// @name     Skribblio Google Search
// @version  1.0.4
// @match    https://skribbl.io/*
// @description Google Search for skribbl.io
// @namespace https://greasyfork.org/users/169540
// @author   TheOriginalBob
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/38197/Skribblio%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/38197/Skribblio%20Google%20Search.meta.js
// ==/UserScript==

var check = false;

var imgButton = document.createElement('button');
imgButton.id = 'imgButton';
imgButton.innerHTML = 'Show';

var refPicture = document.createElement('img');
refPicture.id = 'refPicture';
refPicture.style.width = '200px';
refPicture.style.height = '100px';
refPicture.style.top = '300px';
refPicture.style.position = 'fixed';
refPicture.style.display = 'none';

document.getElementById('containerChat').appendChild(refPicture);
document.getElementsByClassName('containerToolbar')[0].appendChild(imgButton);

document.getElementsByClassName('containerToolbar')[0].addEventListener('click', function(ele){
	if (ele.target.id == 'imgButton') {
 		
    refPicture.setAttribute('src',imageDisplay());
    
    const endGame = setInterval(function(){
 			if(document.getElementById('overlay').style.display !== 'none') {
  			clearInterval(endGame);
    		refPicture.style.display = 'none';
        ele.target.innerHTML = 'Show';
  		}
  	},500);
    
    if (ele.target.innerHTML == 'Show') {
    	refPicture.style.display = '';
      ele.target.innerHTML = 'Hide';
    } else {
    	refPicture.style.display = 'none';
      ele.target.innerHTML = 'Show';
    }
  }
});

function imageDisplay(){
	const word = document.getElementById('currentWord').innerHTML;
	var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', "https://api.qwant.com/api/search/images?count=1&offset=0&q=" + word + " drawing",false);
  xmlHttp.send();
  var result = JSON.parse(xmlHttp.responseText);
  if (result.status == 'error') {
  	alert('An Error Occured While Getting Image');
  } else {
  	result = result.data.result.items[0].media;
  	return result;
  }
}

setInterval(function(){
  const word = document.getElementsByClassName('word');
	if(document.getElementById('overlay').style.display !== 'none' && word.length > 1 && !word[2].getAttribute('title')) {
    check = true;
  	word[0].setAttribute('title',wikiWord(word[0].innerHTML));
    word[1].setAttribute('title',wikiWord(word[1].innerHTML));
    word[2].setAttribute('title',wikiWord(word[2].innerHTML));
  }
},1000);

function wikiWord(word) {
  const xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "POST", 'https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&list=search&srsearch=' + word, false);
    xmlHttp.send(null);
    var result = xmlHttp.responseText;
		if (result.startsWith('Missing required request header')) {
    	xmlHttp.open( "POST", 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&list=search&srsearch=' + word, false);
      xmlHttp.send(null);
  	  var result = xmlHttp.responseText;
      return JSON.parse(result).query.search[0].snippet.replace(/<(.*?)\>/g,'').replace(/\&(.*?)\;/g,'');
    } else {
    	return JSON.parse(result).query.search[0].snippet.replace(/<(.*?)\>/g,'').replace(/\&(.*?)\;/g,'');
    }
}