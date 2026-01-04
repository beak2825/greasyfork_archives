// ==UserScript==
// @name		KG_Antipalevo
// @version		0.1
// @description	Show with red color in the type field when you are talking with somebody in private mode
// @include		https://klavogonki.ru/g*
// @include		http://klavogonki.ru/g*
// @namespace https://greasyfork.org/users/153313
// @downloadURL https://update.greasyfork.org/scripts/404426/KG_Antipalevo.user.js
// @updateURL https://update.greasyfork.org/scripts/404426/KG_Antipalevo.meta.js
// ==/UserScript==

(function() {

	function antiPalevo(o) {
		if (/^\<.*\>/.test(o.value))
		{
			if (!/private/.test(o.className)) {
                o.className+=" private";
                document.querySelector('.text').setAttribute('style', 'color:#d60');
            }
		} else {
			o.className = o.className.replace(" private", "");
            document.querySelector('.text').removeAttribute('style', 'color:#d60');
		}
	}

	if (window.self != window.top) return;

	var s = document.createElement('script');
	s.innerHTML = antiPalevo;
	document.body.appendChild(s);

	//attaching events...
    var i = 0;
	var inputs = document.getElementsByClassName("text");
	for (i=0; i<inputs.length; i++)
	{
		inputs[i].setAttribute('onkeyup', 'antiPalevo(this)');
		inputs[i].setAttribute('onpaste', 'antiPalevo(this)');
	}
})()
