// ==UserScript==
// @name         GitHub Clear Dashboard
// @description  Removes trash from github dashboard.
// @version      1.0.1
// @author       tariel36
// @namespace    https://github.com/tariel36/github-clear-dashboard
// @match        https://github.com/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534869/GitHub%20Clear%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/534869/GitHub%20Clear%20Dashboard.meta.js
// ==/UserScript==

const inter = 100;
const maxCounter = (3 * 1000) / inter;

let counter = 0;

const interval = setInterval(() => {
    tryLoadMore();
    centerList();
}, inter);

function clearDashboard() {
    const mainDiv = document.querySelector('.application-main > div > div > div');

    if (mainDiv) {
        mainDiv.remove();
    }

    const side = getSide();

    if (side) {
        side.style = "display: flex; justify-items: center; justify-content: center; width: 100%;";

        const innerDiv = side.querySelector('div');

        if (innerDiv) {
            innerDiv.style = 'min-width: 350px; max-width: 800px; width: 50%;';
        }
    }

    centerList();
}


function tryLoadMore() {
    counter++;

    if (counter >= maxCounter) {
        clearInterval(interval);
        return;
    }

    const side = getSide();

    const btn = side?.querySelector('button');

    if (!btn) {
        return;
    }

	btn.classList.remove('width-full');

	const form = document.querySelector('.js-repos-container > form');

    if (form) {
        form.style = 'text-align: center';
    }

    btn.click();
}

function centerList() {
    const side = getSide();

    if (!side) {
        return;
    }

    const repos = [...side.querySelectorAll('.list-style-none')];

    if (!repos) {
        return;
    }

	repos.forEach(x => {
		x.querySelectorAll('li')
			.forEach(y => {
				y.style = 'text-align: center;';
				y.querySelector('div').style = 'justify-content: center;';
			});
	});
}

function getSide() {
    return document.querySelector('aside.feed-left-sidebar');;
}

window.addEventListener('load', function() {
    clearDashboard();
}, false);