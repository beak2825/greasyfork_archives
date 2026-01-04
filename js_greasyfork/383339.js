// ==UserScript==
// @name SvPO kitten reward
// @namespace http://www.jaron.nl/
// @description Toont plaatje van kitten bij goed antwoord; werkt alleen in combinatie met SVPO check submit
// @match           http://svpo.nl/*
// @match           https://svpo.nl/*
// @match           http://www.svpo.nl/*
// @match           https://www.svpo.nl/*
// @version 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/383339/SvPO%20kitten%20reward.user.js
// @updateURL https://update.greasyfork.org/scripts/383339/SvPO%20kitten%20reward.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {

const css = `
	.kitten-holder {
		position: fixed;
		top: 20px;
		left: calc(50% + 200px);/* op oog bepaald */
		/* background: hsl(120, 31%, 76%); */
	}

	.kitten-holder img {
		overflow: hidden;
		display: block;
		border-radius: 50%;
		width: 120px;
		width: 120px;
	}
`;
	

const divElm = document.createElement('div');
const imgElm = document.createElement('img');

/**
* 
* @returns {undefined}
*/
const showKitten = function() {
	const rnd=Math.floor(50*Math.random());
	const size=200+rnd;
	imgElm.src = 'https://placekitten.com/'+size+'/'+size;
};

/**
* 
* @returns {undefined}
*/
const hideKitten = function() {
	imgElm.src = '';
};


/**
* add css styles
* @returns {undefined}
*/
const addStyles = function() {
	const styles = document.createElement('style');
	styles.innerHTML = css;
	document.querySelector('head').appendChild(styles);
};


/**
* initialiseer alles
* @returns {undefined}
*/
const init = function() {
	
	divElm.appendChild(imgElm);
	divElm.classList.add('kitten-holder');
	
	document.body.appendChild(divElm);

	document.body.addEventListener('answercorrect', showKitten);
	document.body.addEventListener('answerfalse', hideKitten);

	addStyles();
};


init();

})();