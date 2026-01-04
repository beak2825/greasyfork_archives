// ==UserScript==
// @name         TradeOffer Items Info
// @namespace    http://tampermonkey.net/
// @version      0.14.1
// @description  Adds info about properties of items in trade offer.
// @author       gortik
// @license      MIT
// @run-at       document-idle
// @match        https://steamcommunity.com/tradeoffer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470381/TradeOffer%20Items%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/470381/TradeOffer%20Items%20Info.meta.js
// ==/UserScript==

/*
  0.12 Works now for my and theirs tradebox
  0.13 Some => for, because outdated browser
  0.14 Added uncraftable
    0.14.1 Added support for items with more spells --> ^2
*/

//img.offsetParent

function waitForElm( selector, callback ) {
	//return new Promise(resolve => {
		/*if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}*/

		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				//resolve(document.querySelector(selector));
				//observer.disconnect();
                callback();
			}
		});
        let targetNode = document.querySelector( selector );

		observer.observe(targetNode, {
			childList: true,
			//subtree: true
		});
	//});
}

var totalItems = 0;

var css = `
		.my-info-inv {
			position: absolute;
			color: #b4b4b4;
		}

		.my-bottom-left {
			left: 4px;
			bottom: 4px;
		}

		.my-top-right {
			right: 4px;
			top: 4px;
		}

		.my-bottom-right {
			right: 4px;
			bottom: 4px;
		}

		.my-subtle {
			color: #b4b4b459;
		}

		.my-spelled {
			/* gold */
			color: #FFD700;
		}

        sup {
            /* for lower and upper indexes ~ ^2 */
            font-size: 65%;
        }
	`;

/*var targetNode = document.querySelector("#inventories");
var observer = new MutationObserver(function(){
    console.log(targetNode);
    }
);
observer.observe(targetNode, { childList: true });
*/

(function() {
    'use strict';
    //await waitForElm( "img[src$='throbber.gif']" );
    //await waitForElm( '#inventories' );
    addCSStyle(css);
    waitForElm( '#inventories', findPartsAndSpells );
    // Your code here...
})();


function addCSStyle(styleText) {
    //console.log( 'Adding CSS style: ', styleText );
	let style = document.createElement('style');
	style.type = 'text/css';
	document.head.appendChild(style);
	style.appendChild(document.createTextNode(styleText));
}

function getSpell(item) { //v2.10
	let spells = [],
		re;

	if (item.descriptions)
		item.descriptions.forEach(desc => {
			re = desc.value.match(/Halloween: ([\w ]+) \(spell/);
			if (re && desc.color === '7ea9d1')
				spells.push(re[1]);
		});

    return spells;
}

function getStrangeParts(item) { //v2.11

	let parts = [],
		match,
		//(Headshot Kills: 0)
		re = /\(([\w-Ü ()]+): \d+\)/,
		remove = [' Kills', ' Killed'],
		skip = [{
				type: 'Medi Gun',
				part: 'Kill Assists'
			},
			{
				type: 'Vaccinator',
				part: 'Kill Assists'
			},
			{
				type: 'Crop',
				part: 'Teammates Whipped'
			}, //Disciplinary Action
			{
				type: 'Tickle',
				part: 'Kills'
			}, //Holiday Punch
			{
				type: 'Wrench',
				part: 'Kills'
			},
			{
				type: 'Wrench',
				part: 'Sentry Kills'
			}, //Southern Hospitality
			{
				type: 'Grenade Launcher',
				part: 'Double Donks'
			} //Strange Loose Cannon
		];

	if (item.descriptions)
		//players can rename description to look like part/spell
		item.descriptions.filter(desc => desc.color)
		.forEach(desc => {
			//ends with '... Kills: 125)'
			//or with '... Kills (Only Turbine): 125)'
			match = desc.value.match(re);

			if (match) {
				let part = match[1];
				//skip parts which have all weapons (f.e: Wrench: Kills)
                //fix for outdated browser
				/*if (skip.some(e => item.type.indexOf(e.type) != -1 && part == e.part))
					return;*/
                for ( let e of skip ) {
                    if (item.type.indexOf(e.type) != -1 && part == e.part)
                        return;
                }
				//removes unneeded string
				remove.forEach(e => part = part.replace(e, ''));
				parts.push(part);
			}
		});
	return (parts.length) ? '//(' + parts.join(', ') + ')' : null;
}


function getKillStreak(item) {
	let name = item.market_hash_name;

	if (name.indexOf('Professional') != -1)
		return 'K' + getSup(3);
	if (name.indexOf('Specialized') != -1)
		return 'K' + getSup(2);
	if (name.indexOf('Killstreak') != -1)
		return 'K';
	return '';
}

function isCraftable( item ) {
    let craftable = true;

    if ( item && item.descriptions ) {
		item.descriptions.forEach( desc => {
            if ( desc.value === '( Not Usable in Crafting )' && desc.name === 'attribute' )
                craftable = false;
        });
    }
    return craftable;
}

// for lower and upper indexes ~ ^2
function getSup( text ) {
    return '<sup>' + text + '</sup>'
}

//adds info to item element square in inventory
function addMarksToItem(element) {
	let spell, parts, killstreak, marks = [],
		item;

	//tradeoffer: elem.rgItem.descriptions		inventory: elem.rgItem.description.descriptions
	item = element.rgItem.description != undefined ? element.rgItem.description : element.rgItem
	spell = getSpell(item);
	parts = getStrangeParts(item);
	killstreak = getKillStreak(item);


	//untradable or uncraftable items
    let text = '';
	if ( item.tradable === 0 )
        text += 'U';
    if ( !isCraftable( item ) )
        text += 'ȼ';

    if ( text ) {
		marks.push({
			class: 'my-info-inv my-bottom-right my-subtle',
			text: text
		});
	}

	//has spell or parts
	if ( spell.length || parts || killstreak ) {
		let text = '',
            classList = 'my-info-inv my-top-right';
        if ( spell.length ) {
            classList += ' my-spelled';
            text += 'S';
            if ( spell.length > 1 )
                text += getSup( '2 ' );
        }
		if (parts) {
			text += 'P';
		}
		marks.push({
			class: classList,
			text: text + killstreak
		});
	}
	//there is mark to add
	marks.forEach(mark => element.insertAdjacentHTML('beforeend', '<div class="' + mark.class + '">' + mark.text + '</div>'));
}

//check for strange_parts, spell in items and marks them
function findPartsAndSpells(items_element) {
    let item,
        active_inv = g_ActiveInventory ? g_ActiveInventory.elInventory : document;

	items_element = items_element || active_inv.querySelectorAll('.item.app440')
	console.log('Parts and spells function: ' + items_element.length);

	if (!items_element.length)
		return;

	if (items_element[0][0])
		console.log(items_element[0][0].rgItem)
	else
		console.log(items_element[0].rgItem)

	items_element.forEach(element => {
		//jquery	 m.fn.init [div.itemHolder]
		element = element[0] || element;
		item = element.rgItem;
		if (!item) {
			console.log('Item not defined: ', element);
			return;
		}
		if (item.checked) {
			console.log('Item was already checked: ', item);
			return;
		}

		totalItems++;
		item.checked = 1;
		addMarksToItem(element);
	});

	console.log('----' + totalItems + '----');
}



