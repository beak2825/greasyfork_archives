// ==UserScript==
// @name         SteamMarket History - Names to Links
// @namespace    http://tampermonkey.net/
// @version      0.39.2
// @description  ...
// @license      MIT
// @author       gortik
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @match        https://steamcommunity.com/market/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456738/SteamMarket%20History%20-%20Names%20to%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/456738/SteamMarket%20History%20-%20Names%20to%20Links.meta.js
// ==/UserScript==

/*
On Steam Community Market History page converts names of recent transactions to links to theirs SM page.
  0.32: When item was renamed, shows its name as: "market_name"
  0.33: Fix crash, when name of item is not loaded
  0.34: After clicking near link, copy item_name to clipboard
         --error when renamed
  0.36: Copy is triggered on whole market row
        Highlights row when copy to clipboard
    0.39.1: Gold color for spelled items and shows if item has multiple spells
*/

function findItemInAssets(assets, searchAttr) {
	let	appids = Object.keys(assets),
		contextids, ids, item, found_item;

	appids.some(appid => {
		contextids = Object.keys(assets[appid]);
		return contextids.some(contextid => {
			ids = Object.keys(assets[appid][contextid]);
			return ids.some(id => {
				item = assets[appid][contextid][id];
				//console.log(item);
				if (item[searchAttr.name] == searchAttr.value) {
					found_item = item;
					return true;
				}
			});
		});
	});
	//console.log('Found: ', found_item);
	return found_item;
}

function getSpell(item) {	//v2.10
	let spells = [], re;

	if (item.descriptions) {
		item.descriptions.forEach(desc => {
			re = desc.value.match(/Halloween: ([\w ]+) \(spell/);
			if (re && desc.color === '7ea9d1')
				spells.push(re[1]);
		});
	}
    if ( spells.length == 0 ) {
        return ''
    } else {
        spells = spells.length === 1 ? '[S]' : `[S${getSup( spells.length )}]`;
        return `<span style="color: #FFD700;">${spells}</span>`
    }
	//return (spells.length) ? '[S]' : '';
}

function getStrangeParts(item) {	//v2.13	+Kills (Only Turbine): 125 added
	const parts_desc_color = '756b5e';
	let	parts = [], match,
		//(Headshot Kills: 0)
		re = /\(([\w-Ü ()]+): \d+\)/,
		remove_re = /( Kills)|( Killed)/,
		skip = [
                {type: 'Medi Gun', part:  'Kill Assists'},
                {type: 'Medi Gun', part:  'Übers'},
				{type: 'Vaccinator', part:  'Kill Assists'},
				{type: 'Crop', part: 'Teammates Whipped'},		//Disciplinary Action
				{type: 'Tickle', part: 'Kills'},				//Holiday Punch
				{type: 'Wrench', part: 'Kills'},
				{type: 'Wrench', part: 'Sentry Kills'},			//Southern Hospitality
				{type: 'Grenade Launcher', part: 'Double Donks'}	//Strange Loose Cannon
			   ];

	if (item.descriptions) {
		//players can rename description to look like part/spell
		item.descriptions
		//parts in description have parts_desc_color
			.filter(desc => desc.color == parts_desc_color)
			.forEach(desc => {
			//ends with '... Kills: 125)'
			//or with '... Kills (Only Turbine): 125)'
			match = desc.value.match(re);

			if (match) {
				let part = match[1];
				//skip parts which have all weapons of this type (f.e: Wrench: Kills)
				if (!skip.some(e => item.type.includes(e.type) && part == e.part ))
				{
					//removes unneeded string (Headshot Kills -> Headshot)
					part.replace( remove_re, '' );
					parts.push(part);
				}
			}
		});
	}
	return (parts.length) ? '[P]' : '';
}
function getItemByName(name) {
	//looks in g_rgAssets for market_name (helpful when item was renamed)
	let item = findItemInAssets(g_rgAssets, {name: 'name', value: name});

	if (!item)
		console.log('Asset for item ' + name + ' wasn\'t found.');
	return item;
}

//history_row_3541518141442205580_3541513243441105581_name
function getItemByID(id) {
	if (!item_ids[id]) {
		//console.log('Asset for item ' + id + ' wasn\'t found.');
		return;
	}
	let ids = item_ids[id],
		item = g_rgAssets[ids.appid][ids.contextid][ids.assetid];

	return item;
}

function createLink(id, name) {
    let item = getItemByID(id) || getItemByName(name),
		parts = '';

	if (!item) return;
	//check for strange parts and spelled items
	parts = getSpell(item) + getStrangeParts(item);

	if (parts.length) {
		parts += ' ';
        // add space between spells and parts
        parts = parts.replace( 'span>[', 'span> [' );
		console.log( parts );
	}
	let link = ' href="https://steamcommunity.com/market/listings/' + item.appid + '/' + encodeURIComponent(item.market_hash_name) + '"';
	//title if item was renamed
	let title = item.market_hash_name == name ? '' : ' title="' + name + '"';
	//show market_name instead of renamed name; if renamed add ""
	name = item.market_hash_name == name ? name : '"' + item.market_hash_name + '"';
	//link to SM page and text stays same even if item was renamed
	return '<a' + link + title + ' class="market_listing_item_name_link" data-name="' + item.market_hash_name + '">' + parts + name + '</a>';
}

function convertNamesToLinks() {
	console.log('Converting names to links.')
	let name;
	document.querySelectorAll('#tabContentsMyMarketHistory .market_listing_item_name').forEach(e => {
		//only textNode doesnt have tagName attribute (span, a: have tagName)
		if (e.childNodes[0] && e.childNodes[0].tagName)
			return;
		// name for item wasn't loaded
		if (e.childNodes.length == 0)
			return;
		name = e.textContent;
		//removes text node
		e.childNodes[0].remove();
		//instead creates link to market with same text
		//newElement('a', '<a href="' + getItemByName(name) + '" class="market_listing_item_name_link">' + name + '</a>', e);
		newElement('a', createLink(e.id, name), e);

		let market_listing_row_elem = e.closest( '.market_listing_row' );
		// clicking on whole row will COPY itemName to clipboard ( closest was div )
		market_listing_row_elem.addEventListener( 'click', (e) => {
			// currentTarget: the object to which the current event handler is attached (.market_listing_row), taget: usually child of currentTarget
            // get anchor element with data-name attribute with item_name
			let item_name = e.currentTarget.querySelector( '.market_listing_item_name a' ).dataset.name;
			navigator.clipboard.writeText( item_name );
		} );
		createHighlight( market_listing_row_elem );
	});
}

function newElement(tag, outerHTML, parent) {
	let element = document.createElement(tag);
	parent.appendChild(element);
	element.outerHTML = outerHTML;
}

// hook ajax response function and run displayGem on pageswitch
function hookHistoryHandler() {
	var handlerBak = g_oMyHistory.m_fnResponseHandler;
	//console.log(g_oMyHistory.m_fnResponseHandler)
	g_oMyHistory.m_fnResponseHandler = function(response) {
		handlerBak(response);
		convertNamesToLinks();
	}
	//console.log(g_oMyHistory.m_fnResponseHandler)
}

let item_ids = {};
//hook hover creation for items
function hoverHook() {
	let oldCreateItemHoverFromContainer = window.CreateItemHoverFromContainer;
	window.CreateItemHoverFromContainer = myCreateItemHoverFromContainer;

	function myCreateItemHoverFromContainer( container, id, appid, contextid, assetid, amount ) {
		if (!item_ids[id] && id.endsWith('_name'))
			item_ids[id] = {
				appid: appid,
				contextid: contextid,
				assetid: assetid
			}
		//console.log(container, id, appid, contextid, assetid, amount);
		return oldCreateItemHoverFromContainer(container, id, appid, contextid, assetid, amount);
	}
}

/////////////////////////////// Highlight on click ///////////////////////////////

function addCSStyle (styleText) {
	let style = document.createElement('style');
	style.type = 'text/css';
	document.head.appendChild(style);
	style.appendChild(document.createTextNode(styleText));
}

let my_css = `
	.highlight-click {
		animation: highlight 2s;
	}

	@keyframes highlight {
		30% {
			border-color: yellow;
		}
		100% {
			border-color: #16202d;
		}
	}
    sup {
        /* for lower and upper indexes ~ ^2 */
        font-size: 65%;
    }
`
addCSStyle( my_css );

function createHighlight( elem ) {
	elem.onclick = (e) => {
		// highlights whole row
		let	market_listing_elem = elem//e.target.closest( '.market_listing_row' );
		addAnimationClass( market_listing_elem );
		setTimeout( () => { removeAnimationClass( market_listing_elem ) }, 1.7e3 );
	}
}

function addAnimationClass( elem ) {
	elem.classList.add( 'highlight-click' );
}

function removeAnimationClass( elem ) {
	elem.classList.remove( 'highlight-click' );
}

// for lower and upper indexes ~ ^2
function getSup( text ) {
    return '<sup>' + text + '</sup>'
}

//////////////////////////////////////////////////////////////

function start() {
	//change to observer?
	//document.querySelector('#tabContentsMyMarketHistoryRows')
	//history wasn't loaded yet
	if (!g_oMyHistory) {
		setTimeout(start, 500);
		return;
	}
	//1st page is loaded with html
	convertNamesToLinks();
	hookHistoryHandler();

}

function renameSCMTitle() {
    console.log(window.location)
    if ( window.location == 'https://steamcommunity.com/market/' ) {
        document.title = 'SCM | ' + document.querySelector('.account_name').textContent;
    }
}

(function() {
	'use strict';
	renameSCMTitle()
	console.log('SteamMarket History - Names to Links');
	hoverHook();
	document.querySelector('#tabMyMarketHistory').addEventListener('click', function() {
		setTimeout(start, 1500);
	});
	// Your code here...
})();