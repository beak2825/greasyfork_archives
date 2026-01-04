// ==UserScript==
// @name          Filter Prompt for 'Awesome-Selfhosted'
// @version       1.1.2
// @author				SirJson
// @grant         none
// @license       MIT; https://spdx.org/licenses/MIT.html
// @description   Shows on the Awesome-Selfhosted GitHub page a filter prompt that allows you to hide any technology that you are not interested in
// @namespace     https://webasm.dev/gmscripts
// @run-at        document-idle
// @match         https://github.com/awesome-selfhosted/awesome-selfhosted
// @downloadURL https://update.greasyfork.org/scripts/425625/Filter%20Prompt%20for%20%27Awesome-Selfhosted%27.user.js
// @updateURL https://update.greasyfork.org/scripts/425625/Filter%20Prompt%20for%20%27Awesome-Selfhosted%27.meta.js
// ==/UserScript==

const css = `
	.dropbtn {
    background-color: #8e68ad;
    color: white;
    padding: 8px;
    margin: 8px;
    font-size: 11px;
    border: none;
  }
  
  .dropup {
    display: block;
  }
  
  .dropup-content {
    display: none;
  }

  .reveal {
	  display: block;
  }

  .hide {
	  display: none !important;
  }
  
  .dropup-content {
    display: hidden;
  }

  
  .dropup:hover .dropbtn {
	background-color: #2980B9;
  }

  .filter-container {
    display: grid;
    grid-template-rows: auto auto auto auto;
    border: 1px solid var(--color-scale-gray-5);
    width: auto;
    padding: 1rem;
    gap: 8px;
    margin-bottom: 1rem;
    border-radius: 8px;
  }

  .button-row {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }
`;


addStyle(css);

function newDropup() {
	console.group('Constructing dropup');
	let container = document.createElement('div');
	let bnt = document.createElement('button');
	let content = document.createElement('ul');
	console.debug('Elements created');
	container.classList.add('dropup');
	bnt.classList.add('dropbtn');
	content.classList.add('dropup-content');
	console.debug('classes added');
	container.appendChild(bnt);
	container.appendChild(content);
	console.debug('inner structure done');
	bnt.innerText = 'Toggle hidden ↴';
	bnt.addEventListener('click', () => { content.classList.toggle('reveal') })
	console.groupEnd('finalize');
	return { 'main': container, 'target': content };
}

/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 */
function addStyle(styleString) {
	console.debug('Adding new CSS Styles');
	const style = document.createElement('style');
	style.textContent = styleString;
	document.head.append(style);
}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}


function filter(tagName) {
	console.debug('Filter for', tagName);
	const searchTerm = tagName.toString().trim().toUpperCase();
	const listitems = document.querySelector('.markdown-body').querySelectorAll('li');
	let marked = {

	}
	for (let lit of listitems) {
		if (lit.children > 3 || !lit.querySelector('code')) continue;
		let tags = lit.querySelectorAll('code');
		let discard = true;
		for (var value of tags) {
			if (value.innerText.trim().toUpperCase() == searchTerm) discard = false;
		}
		if (discard) {
			let lkey = lit.parentNode.dataset.listkey;
			if (!marked.hasOwnProperty(lkey)) {
				lkey = uuidv4();
				marked[lkey] = {
					parent: lit.parentNode,
					children: []
				};

				lit.parentNode.dataset.listkey = lkey;
				console.debug('added listkey', lkey)

			}
			console.debug('added child to hide for lkey', lkey);
			marked[lkey].children.push(lit);
		}
	}


	for (const [key, value] of Object.entries(marked)) {
		let drop = newDropup();
		console.group('Begin reorder for list', key);
		for (let child of value.children) {
			let oldNode = child.parentNode.removeChild(child);
			drop.target.appendChild(oldNode);
		}
		console.groupEnd('Reorder done', key);
		value.parent.appendChild(drop.main);
	}
}

function createFilterPrompt() {
	let container = document.createElement('div');
	container.classList.add('filter-container');
	let inner = {
		text: document.createElement('h3'),
		example: document.createElement('p'),
		filterInput: document.createElement('input'),
		buttonLine: document.createElement('div'),
	};
	let innerBntLine = {
		cancelBnt: document.createElement('button'),
		runBnt: document.createElement('button')
	}
	for (let k of Object.keys(inner)) {
		container.appendChild(inner[k]);
	}
	for (let k of Object.keys(innerBntLine)) {
		inner.buttonLine.appendChild(innerBntLine[k]);
	}

	inner.text.innerText = "Filter by language";
	inner.example.innerText = "Example: Enter Python below and press Run"
	inner.filterInput.id = 'userFilter';
	inner.buttonLine.classList = 'button-row';

	innerBntLine.runBnt.addEventListener('click', () => { filter(inner.filterInput.value); container.classList.add('hide'); });
	innerBntLine.runBnt.innerText = 'Run';
	innerBntLine.runBnt.classList.add('btn');

	innerBntLine.cancelBnt.addEventListener('click', () => container.classList.add('hide'));
	innerBntLine.cancelBnt.innerText = 'Cancel';
	innerBntLine.cancelBnt.classList.add('btn');

	return container;
}
document.querySelector('.repository-content').insertAdjacentElement('beforebegin', createFilterPrompt());
