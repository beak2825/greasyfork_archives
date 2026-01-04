// ==UserScript==
// @name         FA auto-reload 503
// @namespace    https://greasyfork.org/ru/users/303426-титан
// @version      1.1
// @description  Automatically reloads 503 pages
// @author       Титан
// @match        https://www.furaffinity.net/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furaffinity.net
// @require      https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526876/FA%20auto-reload%20503.user.js
// @updateURL https://update.greasyfork.org/scripts/526876/FA%20auto-reload%20503.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let time = [1000, 3000];
    console.log("503 script launched")
	var arriveOptions = {
		fireOnAttributesModification: false, // Defaults to false. Setting it to true would make arrive event fire on existing elements which start to satisfy selector after some modification in DOM attributes (an arrive event won't fire twice for a single element even if the option is true). If false, it'd only fire for newly created elements.
		onceOnly: false,                      // Defaults to false. Setting it to true would ensure that registered callbacks fire only once. No need to unbind the event if the attribute is set to true, it'll automatically unbind after firing once.
		existing: true                      // Defaults to false. Setting it to true would ensure that the registered callback is fired for the elements that already exist in the DOM and match the selector. If options.onceOnly is set, the callback is only called once with the first element matching the selector.
	};
    window.onload = function() {
        Refresh(document.querySelector("body > h2"));
    }

	document.arrive('body > h2', arriveOptions, function(newElem) {
        console.log("reading page")
        console.log(newElem)
        Refresh(newElem);
	});

    function Refresh(newElem) {
        if(!newElem.innerText) return
		if(newElem.innerText == "Error 503")
		{
            console.log("503 script fired")
			setTimeout(function(){ location.reload(); }, Math.floor(Math.random()*time[1]-time[0]) + time[0]);
		}
    }
})();