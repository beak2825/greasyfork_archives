// ==UserScript==
// @name        	DC - Evénements
// @namespace   	DreadCast
// @include     	https://www.dreadcast.eu/Main
// @grant       	none
// @author 			Kmaschta
// @date 			09/04/2017
// @version 		1.1
// @description 	Fait poper des events une fois par jour
// @compat 			Firefox, Chrome
// @require      	http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/28835/DC%20-%20Ev%C3%A9nements.user.js
// @updateURL https://update.greasyfork.org/scripts/28835/DC%20-%20Ev%C3%A9nements.meta.js
// ==/UserScript==

jQuery.noConflict();

const evenements = [{
    title: 'Tout va bien !',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lacinia, dolor non porta lobortis, sem nunc faucibus ex, vel congue nulla dui quis dolor. Ut in tortor eget nisl bibendum condimentum. In accumsan dictum velit, et interdum ligula. Nulla eros nibh, vehicula eleifend lobortis sed, accumsan id augue. Donec tincidunt gravida ante sed dictum. Mauris ornare, ante nec molestie aliquet, libero ipsum egestas dolor, ac fermentum libero est nec velit. Sed in condimentum leo, bibendum varius quam. Etiam varius enim sed nibh maximus viverra. Suspendisse sagittis suscipit magna, eget efficitur dolor cursus in.',
    image: 'http://i.imgur.com/qdxxsVC.png',
    weight: 1,
}, {
    title: 'Tout va mal !',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lacinia, dolor non porta lobortis, sem nunc faucibus ex, vel congue nulla dui quis dolor. Ut in tortor eget nisl bibendum condimentum. In accumsan dictum velit, et interdum ligula. Nulla eros nibh, vehicula eleifend lobortis sed, accumsan id augue. Donec tincidunt gravida ante sed dictum. Mauris ornare, ante nec molestie aliquet, libero ipsum egestas dolor, ac fermentum libero est nec velit. Sed in condimentum leo, bibendum varius quam. Etiam varius enim sed nibh maximus viverra. Suspendisse sagittis suscipit magna, eget efficitur dolor cursus in.',
    image: 'http://i.imgur.com/IneLPFn.png',
    weight: 1,
}];

const LOCALSTORAGE_KEY = 'dc_evenements_last_displayed';

const displayEvenement = function (evt) {
    const content = '<center><img alt="'+ evt.title +'" src="'+ evt.image +'" /></center><p style="padding: 1rem;">'+ evt.description +'<p>';
    const box = new LightBox('dc_event', 1, evt.title, content);
    box.display();

    const now = new Date();
    window.localStorage.setItem(LOCALSTORAGE_KEY, now.toISOString());
};

const shouldDisplayEvenement = function (date) {
    if (!date) return true;

    const lastTimeDisplayed = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return lastTimeDisplayed < today;
};

const weightedRandom = function(options) {
    const tempArray = [];

    for (const key of Object.keys(options)) {
        const weight = options[key];

        for (let i = 1; i<= weight; i++) {
           tempArray.push(key);
        }
    }

    return tempArray[Math.floor(Math.random() * tempArray.length)];
};

const selectEvenement = function(eventList) {
    const options = {};

    let i = 0;
    for (const evt of eventList) {
        options[i] = evt.weight;
        i++;
    }

    return eventList[weightedRandom(options)];
};

jQuery(document).ready(function() {
    console.log('DC - Evénements on');

    const lastTimeDisplayed = window.localStorage.getItem(LOCALSTORAGE_KEY);
    if (shouldDisplayEvenement(lastTimeDisplayed)) {
        const evt = selectEvenement(evenements);
        displayEvenement(evt);
    }
});