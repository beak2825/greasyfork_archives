// ==UserScript==
// @name         Wykop Afera Remover
// @namespace    http://www.wykop.pl/ludzie/januszradeon/
// @version      0.2
// @description  Nie wyświetla znalezisk zawierających zabronione słowa kluczowe. Słowa kluczowe dodajemy na samym dole w formulażu.
// @author       januszradeon
// @include      http://www.wykop.pl/
// @include      http://www.wykop.pl/strona/*
// @include      http://www.wykop.pl/wykopalisko/*
// @include      http://www.wykop.pl/hity/*
// @include      http://www.wykop.pl/najnowsze/*
// @include      http://www.wykop.pl/aktywne/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10631/Wykop%20Afera%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/10631/Wykop%20Afera%20Remover.meta.js
// ==/UserScript==


var injectedStuff = `
<div id="injectedForm" style=" padding:10px; position:absolute; z-index:9999;">

<h3 style="padding:5px; text-align:center;">Afera remover</h3>
<input type="text" id="injKW" style="width:200px"></input>
<button onclick="localStorage.BlackKeywords=document.getElementById('injKW').value; location.reload();">OK</button>
<p style="padding:5px; text-align:center;">Wypisz słowa kluczowe po przecinku</p>

</div>
`
document.body.innerHTML+=injectedStuff;
keywords=localStorage.BlackKeywords.toLowerCase().replace(RegExp(" ","g"),"").split(",");

if(!keywords[0]==""){

	var divy=document.getElementsByClassName('link iC');

	for(var n=0;n<divy.length;n++)
	{
			for(var i=0;i<keywords.length;i++)
			{
					if (divy[n].getElementsByTagName('h2')[0].getElementsByTagName('a')[0].getAttribute('title').toLowerCase().indexOf(keywords[i]) >= 0 )divy[n].style.display = "none";
			}
	}

}
//by januszradeon