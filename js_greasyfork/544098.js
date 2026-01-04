// ==UserScript==
// @name          Google - Custom search on nested labels
// @author        Gianluca Negrelli
// @homepage      https://www.ugmfree.it/contact
// @grant         none
// @namespace     GoogleScript
// @description   And finally you can search on nested labels. Shame on Google... it's a useful feature so simple to automate!
// @include       https://mail.google.com/mail/*
// @icon          https://www.gstatic.com/marketing-cms/assets/images/66/ac/14b165e647fd85c824bfbe5d6bc5/gmail.webp
// @version       0.0.3
// @copyright     CC Attribution-NoDerivatives 4.0 International
// @downloadURL https://update.greasyfork.org/scripts/544098/Google%20-%20Custom%20search%20on%20nested%20labels.user.js
// @updateURL https://update.greasyfork.org/scripts/544098/Google%20-%20Custom%20search%20on%20nested%20labels.meta.js
// ==/UserScript==

// --------------------------------------------------------
// The script generates a new icon on the side of every root custom label.
// Clicking on it you search on that only label.
// If you want a deeper search, open the label to show the sublabels and click again on the icon.
// If you want an even deeper search, open the sublabels and click the icon again.
// --------------------------------------------------------
var cssCustomClass = `
	.divSearchAll { cursor: pointer; margin-left:5px; display: inline}
	.imgSearchAll{ width: 16px; vertical-align: middle; filter: brightness(0) invert(1); }
`;

var searchAllIcon = 'https://img.icons8.com/?size=48&id=IO2m4mkNF5TB&format=png'

// --------------------------------------------------------
// JS functions to call outside greasemonkey
// --------------------------------------------------------
var headTag = document.getElementsByTagName("head")[0];
var scriptNode = document.createElement('script');
var styleNode = document.createElement('style');

// --------------------------------------------------------
// Workaround for Chromium browsers.
// --------------------------------------------------------
var trustedPolicy = null;
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  trustedPolicy = trustedTypes.createPolicy("default", {
    createHTML: (input) => input,
    createScript: (input) => input,
    createScriptURL: (input) => input
  });
}

styleNode.type = 'text/css';
//styleNode.innerHTML = cssCustomClass;
styleNode.innerHTML = trustedPolicy ? trustedPolicy.createHTML(cssCustomClass) : cssCustomClass;
headTag.appendChild(styleNode);


// --------------------------------------------------------
// Process the visible labels.
// --------------------------------------------------------
function initLabels(){
	var elements = document.getElementsByClassName('aim');
	var masterDiv = null;
	var masterLabels = [];

	if(elements.length == 0)
	{
		return null;
	}

	console.log(`Found elements = ${elements.length}`);

	var lastRootHref = 'not-an-URI';

	// Cycle over every element to find the custom labels.
	for(var i = 0; i < elements.length; i++){
		var parentElement = elements[i];
		var searchHref = parentElement.querySelectorAll('a[href^="https://mail.google.com/mail/u/0/#label/"]');
		if(searchHref.length == 0){
			// It's not a custom label.
			continue;
		}
		searchHref = searchHref[0].href;

		// --------------------------------------------------------
		// Check if it is a sub label.
		// --------------------------------------------------------
		if(searchHref.startsWith(lastRootHref + '/')) {
			// It's a sublabel or a subsublabel or even more deep.
			let lastMaster = masterLabels[masterLabels.length - 1];

			var currentSearchValue = lastMaster.getAttribute('data-search');
			var currentSearchRoot = lastMaster.getAttribute('data-search-root');
			var labelName = searchHref.replace(lastRootHref, "");
			labelName = decodeURIComponent(labelName);
			labelName = labelName.replace(/\+/g, '-').replace(/\//g, '-');

			var newSearchValue = `${currentSearchValue}+OR+label:${currentSearchRoot}${labelName}`;
			lastMaster.setAttribute('data-search', newSearchValue);
			var img = lastMaster.querySelector('.imgSearchAll');
			img.setAttribute('title',img.getAttribute('title') + ', ' + labelName.substring(1));
			continue;
		}

		// --------------------------------------------------------
		// It's not a sub but a root element.
		// --------------------------------------------------------
		if(!masterDiv){

			// Ascend to found the parent container of all labels.
			var el = parentElement;

			while (el) {
				el = el.parentElement;
				if (
					el &&
					el.tagName === 'DIV' &&
					el.querySelector('h2') // Checks if h2 is nested inside
				) {
					masterDiv = el;
					break;
				}
			}
		}

		// Accept and update the lastRoot
		lastRootHref = searchHref;
		var lastLabelName = lastRootHref.substring(lastRootHref.lastIndexOf('/') + 1);
		lastLabelName = lastLabelName.replace(/\+/g, '-');

		masterLabels.push(parentElement);

		// If the img is already present, remove it to create it again because it could be changed.
		const target = parentElement.querySelector('img.imgSearchAll');
		if (target && target.parentElement) {
			target.parentElement.remove();
		}

		parentElement.setAttribute('data-search', ':' + lastLabelName);
		parentElement.setAttribute('data-search-root', lastLabelName);

		//console.log(`href = ${lastRootHref}`);

		// Add the search tool.
		// Use a string literal to define your new element.
		const imgHtml = `
	    <div class="divSearchAll">
        <img src="${searchAllIcon}" class="imgSearchAll" alt="" title="Search mails with label: ${lastLabelName}">
      </div>
		`;

		// Insert it as the last child.
        //parentElement.querySelector('span').insertAdjacentHTML('beforeend', imgHtml);
        const safeHtml = trustedPolicy ? trustedPolicy.createHTML(imgHtml) : imgHtml;
        parentElement.querySelector('span').insertAdjacentHTML('beforeend', safeHtml);
	}

	// Attach the click events to every created element.
	const imgs = masterDiv.querySelectorAll('img.imgSearchAll');
	imgs.forEach(img => {
		img.removeEventListener('click', clickForDeepSearch);
		img.addEventListener('click', clickForDeepSearch);
	});

	return masterDiv;
}


// --------------------------------------------------------
// Click for a deep search.
// --------------------------------------------------------
function clickForDeepSearch(){
	event.stopPropagation(); // Prevents bubbling

	//console.log('You clicked:', event.target);

	var searchTerm = null;

	let el = event.target;

	while (el) {
		el = el.parentElement;
		if (el && el.hasAttribute('data-search')) {
			searchTerm = el.getAttribute('data-search');
			break;
		}
	}

	if(searchTerm){
		var searchHash = encodeURIComponent(searchTerm).replace(/%2B/g, '+').replace(/%2D/g, '-');;
		var newURI = `${window.location.href.split('#')[0]}${'#search/label' + searchHash}`;
		// console.log(`Redirect to the link ${newURI}`);
		location.href = newURI;
	}
}

// --------------------------------------------------------
// Attach the observer to refresh the deep searches.
// --------------------------------------------------------
function attachObserver(masterDiv){
	const config = { childList: true, subtree: true };

	let timeoutId = null;

	const callback = (mutationsList, observer) => {
		if (timeoutId) return; // Skip if debounce already scheduled

		timeoutId = setTimeout(() => {
			//console.log('Batch of mutations detected. Running callback once.');
			initLabels();

			timeoutId = null; // Reset debounce timer
		}, 3000); // Adjust this delay as needed
	};

	const observer = new MutationObserver(callback);
	observer.observe(masterDiv, config);
}

window.setTimeout(function(){
	var masterDiv = initLabels();
	if(masterDiv){
		attachObserver(masterDiv);
	}
}
,5000);

