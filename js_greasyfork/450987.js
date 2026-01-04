// ==UserScript==
// @name     koszykPGG - tylko groszek
// @namespace sss
// @description Skrypt ukrywa węgiel pozostawiając tylko ekogroszek luzem na stronie PGG
// @license MIT
// @version  1.21
// @grant    none
// @include  *sklep.pgg.pl*
// @namespace https://greasyfork.org/users/952625
// @downloadURL https://update.greasyfork.org/scripts/450987/koszykPGG%20-%20tylko%20groszek.user.js
// @updateURL https://update.greasyfork.org/scripts/450987/koszykPGG%20-%20tylko%20groszek.meta.js
// ==/UserScript==
(function(){'use strict';
	document.body.innerHTML = document.body.innerHTML.replace(/<hr>/g, '');
	document.body.innerHTML = document.body.innerHTML.replace(/Groszek - Marcel/g, '<SPAN STYLE="background-color:pink;">Groszek - Marcel</SPAN>');
	document.body.innerHTML = document.body.innerHTML.replace(/Groszek - Sośnica/g, '<SPAN STYLE="background-color:pink;">Groszek - Sośnica</SPAN>');
	document.body.innerHTML = document.body.innerHTML.replace(/Groszek - Bielszowice/g, '<SPAN STYLE="background-color:pink;">Groszek - Bielszowice</SPAN>');
	for (const image of document.images) {
	  if (image.src === 'https://static.pgg.pl/shop/img/produkty/grupy/xs/orzech.jpg' ||
	  	  image.src === 'https://static.pgg.pl/shop/img/produkty/grupy/xs/kostka.jpg' ||
	  	  //image.src === 'https://static.pgg.pl/shop/img/produkty/grupy/xs/groszek.jpg' ||
	  	  //image.src === 'https://static.pgg.pl/shop/img/produkty/grupy/xs/groszek_II.jpg' ||
          image.src === 'https://static.pgg.pl/shop/img/produkty/grupy/xs/mial_21_24.jpg') {
            //image.style.border = "10px dotted black";
            //image.parentElement.style.color = "red";
            image.parentElement.parentElement.parentElement.parentElement.style.display="none";
	  };
      //if (image.src.indexOf("banner")>0) image.parentElement.parentElement.parentElement.parentElement.parentElement.style.display="none";
      if (image.src.indexOf("paleta")>0 || image.src.indexOf("bigbag")>0) image.parentElement.parentElement.parentElement.parentElement.style.display="none";
	};
	//document.getElementById("slider").parentElement.style.display="none";
	var id1 = document.getElementsByClassName('slider_container');
    id1[0].style.display="none";
	//var id2 = document.getElementsByClassName('alert alert-secondary fade show rounded-0 text-center pb-0 mb-0');
	var id2 = document.getElementsByClassName('text-center mt-3');
    id2[0].style.display="none";
	//var id0=document.getElementsByTagName("hr");
    //for (let ii = 0; ii < 33; ii++) id0[ii].style.display="none";
	//id0.forEach(el => el.style.display="none");
            let dv = document.getElementById('main').content.firstChild
            dv.style.boredr=1;
            console.log(dv.parentElement)  // null
            console.log(dv.parentNode)     // document fragment
})()
