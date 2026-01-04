// ==UserScript==
// @name         Clickup Random Standup
// @namespace    https://github.com/AndreasMattsson
// @version      0.7
// @description  Add button to pick a random assignee in Clickup boards
// @author       Andreas Mattsson
// @include      /^https?\:\/\/app\.clickup\.com\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459518/Clickup%20Random%20Standup.user.js
// @updateURL https://update.greasyfork.org/scripts/459518/Clickup%20Random%20Standup.meta.js
// ==/UserScript==


(function() {
    'use strict';

let dontObserve = false;
const userListSelector = "#app-root cu-team-users-sidebar cu-team-user-item-simple, #app-root cu-team-users-sidebar cu-team-user-item";
const getUserElements = () => Array.from(document.querySelectorAll(userListSelector)).filter((x) => x.querySelector('.cu-team-user-item__avatar-count, .cu-team-users-block__simple-body-item-check'));
const getPeople = (nameFilter) => Object.fromEntries(Array.from(getUserElements()).map((x) => [x.querySelector('.cu-team-users-block__simple-body-item-info-top, .cu-team-user-item__name').innerText.trim(), [x.matches('.cu-team-user-item_selected-collapsed') || !!x.querySelector('.cu-team-users-block__simple-body-item-active'), x.querySelector('.cu-team-users-block__simple-body-item-check') || x]]).filter(([name]) => !nameFilter || nameFilter(name)));
const getCurrentNames = () => Object.entries(getPeople()).filter(([_, [current]]) => current).map(([name]) => name);
const getCandidates = () => getPeople((name) => !window.selectedNames.has(name) && (window.poolNames.size == 0 || window.poolNames.has(name)));
window.poolNames = window.poolNames || new Set();
const handleUserList = () => {
	const userElements = getUserElements();
	const firstElement = userElements && userElements.length > 0 && userElements[0];
	const container = firstElement && firstElement.parentElement;
    let buttonElement = document.getElementById('btn-random-assignee');
	window.selectedNames = window.selectedNames || new Set();
	if (container && !buttonElement) {
		const extraCss = firstElement.tagName.toLowerCase() == 'cu-team-user-item' ? 'text-align: center; font-size: 10px; padding: 0.1em' : '';
		const buttonHtml = '<div id="btn-random-assignee" class="cu-team-users-block__simple-body-item ng-star-inserted" style="cursor: pointer; padding-top: 5px;"><div class="cu-team-users-block__simple-body-item-avatar cu-team-users-block__simple-body-item-avatar-unassigned"><div class="icon"><img style="background: white; border-radius: 100%; user-select: none;" class="ng-star-inserted" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIzLjIxIDEyLjU0IDIwLjg2IDEuOTJBMS41IDEuNSAwIDAgMCAxOS4wNi44aC4wMUw4LjQ1IDMuMTNhMS41IDEuNSAwIDAgMC0xLjEzIDEuOHYtLjAybC45OCA0LjQ1SDIuMjVjLS44MyAwLTEuNS42OC0xLjUgMS41djEwLjg4YzAgLjgzLjY3IDEuNSAxLjUgMS41aDEwLjg3Yy44MyAwIDEuNS0uNjcgMS41LTEuNXYtNS43N2w3LjQ1LTEuNjVhMS41IDEuNSAwIDAgMCAxLjE0LTEuOHYuMDF6bS0xMC4wOSA5LjIxSDIuMjZWMTAuODdoNi4zOGwxLjA0IDQuNjdhMS41IDEuNSAwIDAgMCAxLjQ2IDEuMThjLjExIDAgLjIzLS4wMS4zNC0uMDRoLS4wMWwxLjY2LS4zN3Y1LjQ0em04LjYzLTguODgtMTAuNjIgMi4zNUw4Ljc4IDQuNiAxOS40IDIuMjVsMi4zNSAxMC42MnoiLz48cGF0aCBkPSJNMy43NSAxMi4zOGgxLjg4djEuODdIMy43NXYtMS44OHpNMy43NSAxOC4zOGgxLjg4djEuODdIMy43NXYtMS44OHpNOS43NSAxOC4zOGgxLjg4djEuODdIOS43NXYtMS44OHpNNi43NSAxNS4zOGgxLjg4djEuODdINi43NXYtMS44OHpNMTAuNTcgNS43NGwxLjgzLS40LjQgMS44My0xLjgzLjQtLjQtMS44M3pNMTcuNzMgMTAuM2wxLjgzLS40LjQgMS44My0xLjgzLjQtLjQtMS44M3pNMTQuMTUgOC4wMmwxLjgzLS40LjQgMS44My0xLjgzLjQtLjQtMS44M3oiLz48L3N2Zz4="/></div></div><div class="cu-team-users-block__simple-body-item-info"><div class="cu-team-users-block__simple-body-item-info-top" id="btn-random-assignee-text" style="user-select: none; ' + extraCss + '">Randomize</div></div></div>';
		const template = document.createElement('template');
		template.innerHTML = buttonHtml;
		const button = template.content.firstChild;
		container.prepend(button);
		buttonElement = button;
		button.onclick = () => {
			dontObserve = false;
			const currentNames = getCurrentNames();
            if (!window.selectedNames.size && currentNames.length > 1) {
                window.poolNames = new Set([...currentNames]);
            }
			const candidates = getCandidates();
			const keys = Object.keys(candidates);
			const targetNameSet = new Set(currentNames);
			if (keys.length) {
				const selectedName = keys[ keys.length * Math.random() << 0];
				window.selectedNames.add(selectedName);
                if (!targetNameSet.has(selectedName)) {
                    targetNameSet.add(selectedName);
                } else {
                    targetNameSet.delete(selectedName);
                }
			} else {
				window.selectedNames.clear();
                window.poolNames.clear();
			}
			const perElementTimeout = 200;
            window.timeoutsToCancel && window.timeoutsToCancel.forEach((x) => clearTimeout(x))
			window.timeoutsToCancel = Array.from(targetNameSet).map((name, index) => {
				const timeout = index * perElementTimeout;
				return setTimeout(() => {
					const people = getPeople();
					const target = people[name];
					target && target[1] && target[1].click();
				}, timeout);
			});
			setTimeout(() => {
				handleUserList();
				dontObserve = false;
			}, targetNameSet.size * perElementTimeout);
		};
	}
	const textElement = document.getElementById('btn-random-assignee-text');
	if (textElement) {
        if (!window.selectedNames.size) {
            const nameCount = getCurrentNames().length;
            if (nameCount > 1) {
                textElement.innerText = "Random\xa0" + nameCount;
            } else {
                textElement.innerText = "Randomize";
            }
        } else {
            const candidateCount = window.poolNames.size || userElements.length;
            if (candidateCount == window.selectedNames.size) {
				textElement.innerText = "" + window.selectedNames.size + " / " + candidateCount + " Reset?";
			} else {
				textElement.innerText = "Random " + window.selectedNames.size + " / " + candidateCount;
			}
        }
	}
};

window.userListDisplayed = getUserElements().length;
window.usersSelected = getCurrentNames().length;
if (window.userListDisplayed) { handleUserList(); }

const observer = new MutationObserver((mutations, observer) => {
  if (dontObserve) {
      return;
  }
  const userListDisplayed = getUserElements().length;
  const usersSelected = getCurrentNames().length;
  if (window.userListDisplayed != userListDisplayed || window.usersSelected != usersSelected) {
	window.userListDisplayed = userListDisplayed;
	dontObserve = true;
	handleUserList();
	dontObserve = false;
  }
});

observer.observe(document, {
  subtree: true,
  attributes: true
});

})();