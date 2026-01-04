// ==UserScript==
// @include       http://chomikuj.pl/*
// @include       https://chomikuj.pl/*
// @description   Wyciąga bezpośrednie linki do plików mp3, działa bez logowania i bez zużywania transferu.
// @author        Marek Drwota
// @name          mp3_chomikuj.user
// @version 0.0.1.20200429123833
// @namespace https://greasyfork.org/users/546628
// @downloadURL https://update.greasyfork.org/scripts/402275/mp3_chomikujuser.user.js
// @updateURL https://update.greasyfork.org/scripts/402275/mp3_chomikujuser.meta.js
// ==/UserScript==

function zm() {
var linki=document.getElementsByTagName('a');

for (i=0;i<linki.length;i+=1)
  if (linki[i].hasAttribute('href'))
    if (linki[i].getAttribute('href').match(/,[0-9]+[.]mp3/)!=null)
      {
	file_id=linki[i].getAttribute('href').match(/,[0-9]+[.]mp3/);
	file_id=file_id[0].substr(1,file_id[0].length-5);
	nazwa=linki[i].getAttribute('title')+'.mp3';
	linki[i].setAttribute('download',nazwa);
	linki[i].setAttribute('href','http://chomikuj.pl/Audio.ashx?id='+file_id+'&type=2&tp=mp3');
	linki[i].setAttribute('class','');
      }

window.setTimeout(zm,6000);
}
window.setTimeout(zm,1000);
