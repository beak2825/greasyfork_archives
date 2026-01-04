// ==UserScript==
// @name         Instagram Open Orig
// @namespace
// @version      0.4
// @description  Открывает оригинал фото в Инстаграм
// @author       sdlv
// @include      *://www.instagram.com/*
// @grant none
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @namespace
// @namespace https://greasyfork.org/users/227863
// @downloadURL https://update.greasyfork.org/scripts/377915/Instagram%20Open%20Orig.user.js
// @updateURL https://update.greasyfork.org/scripts/377915/Instagram%20Open%20Orig.meta.js
// ==/UserScript==

function listen() {

    var url = window.location.href;

    var div1 = document.createElement('div');

    div1.style.cssText="padding: 10px; background: #e8e8e8; text-align:center; display:none; position:absolute; width: 100%; z-index: 1000;";

    div1.classList.add('azaza');


    var dev = document.getElementsByClassName('_2dDPU')[0];


    if (url.indexOf("https://www.instagram.com/p/") == 0) { ready(); }

function onePic() {

    try {

    var orig = document.querySelector('.kPFhm').firstChild.firstChild.firstChild.getAttribute('src');

    } catch (err) {

    orig = document.querySelector('.kPFhm').firstChild.firstChild.getAttribute('src');
   }

    dev.insertBefore(div1, dev.children[0]);
    div1.innerHTML = orig;
    $('.azaza').slideDown(400);

}

function manyPic() {

	var string = '';
	var x = 0;
	var timerId = setInterval(function() {

	var pics_src = document.querySelector('._97aPb').querySelectorAll('._-1_m6')[x].querySelector('img').getAttribute('src');

	string = string + pics_src + '<br>';


	try {
	document.getElementsByClassName("coreSpriteRightChevron")[0].click();
	} catch (err) {
		clearInterval(timerId);
		dev.insertBefore(div1, dev.children[0]);
        div1.innerHTML = string;
        $('.azaza').slideDown(400);
	}
	x++;

	}, 100);

	}

function ready() {

    var pic = document.getElementsByClassName('kPFhm')[0];


    if (document.getElementsByClassName('kPFhm')[0] === undefined ) {
    pic = document.getElementsByClassName('RzuR0')[0];
    }

    pic.ondblclick = function() {

    var close_button = document.querySelector("button.ckWGn");
    close_button.style.cssText="display: none";

    if (document.getElementsByClassName("coreSpriteRightChevron")[0] !== undefined ) { manyPic();
    } else { onePic(); }
     }
}

}

setInterval(listen, 300);