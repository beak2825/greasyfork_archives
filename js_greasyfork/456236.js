// ==UserScript==
// @name         Steam inventory helper
// @namespace    http://tampermonkey.net/
// @version      0.32.1
// @description  ...
// @author       gortik
// @license      MIT
// @match        https://steamcommunity.com/profiles/*/inventory*
// @match        https://steamcommunity.com/id/*/inventory*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @downloadURL https://update.greasyfork.org/scripts/456236/Steam%20inventory%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/456236/Steam%20inventory%20helper.meta.js
// ==/UserScript==

/*
  0.21: total processed items added
  0.30: added killstreak
  0.31: added uncraftable
    0.32.1: added ^2 for multiple spelled items
*/

var totalItems = 0;

(function() {
    'use strict';
    loadInventoryHook2();
    loadInventoryHook();
    // Your code here...
})();

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
	`

	function addCSStyle( styleText ) {
		let style = document.createElement( 'style' );
		style.type = 'text/css';
		document.head.appendChild( style );
		style.appendChild(document.createTextNode( styleText ));
	}

function getSpell( item ) {	//v2.10
    let spells = [], re;

    if (item.descriptions)
        item.descriptions.forEach(desc => {
            re = desc.value.match(/Halloween: ([\w ]+) \(spell/);
            if (re && desc.color === '7ea9d1')
                spells.push(re[1]);
        });

    return spells;
}

function getStrangeParts( item ) {	//v2.11

    let	parts = [], match,
        //(Headshot Kills: 0)
        re = /\(([\w-Ü ()]+): \d+\)/,
        remove = [' Kills', ' Killed'],
        skip = [	{type: 'Medi Gun', part:  'Kill Assists'},
                {type: 'Vaccinator', part:  'Kill Assists'},
                {type: 'Crop', part: 'Teammates Whipped'},		//Disciplinary Action
                {type: 'Tickle', part: 'Kills'},				//Holiday Punch
                {type: 'Wrench', part: 'Kills'},
                {type: 'Wrench', part: 'Sentry Kills'},			//Southern Hospitality
                {type: 'Grenade Launcher', part: 'Double Donks'}	//Strange Loose Cannon
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
                if (skip.some(e => item.type.indexOf(e.type) != -1 && part == e.part))
                    return;
                //removes unneeded string
                remove.forEach(e => part = part.replace(e, ''));
                parts.push(part);
            }
        });
    return (parts.length) ? '//(' + parts.join(', ') + ')' : null;
}


function getKillStreak( item ) {
    let name = item.market_hash_name;
        //getSup = ( text ) => '<sup>' + text + '</sup>'

    if (name.indexOf('Professional') != -1)
        return 'K' + getSup( 3 );
    if (name.indexOf('Specialized') != -1)
        return 'K' + getSup( 2 );
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
	function addMarksToItem( element ) {
        let	spell, parts, killstreak, marks = [],
            item = element.rgItem.description;

        spell = getSpell( item );
        parts = getStrangeParts( item );
        killstreak = getKillStreak( item );

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
        //untradable items
        /*if ( item.tradable === 0 ) {
            marks.push( {
                class: 'my-info-inv my-bottom-right my-subtle',
                text: 'U'
            });
        }*/
        //has spell or parts
        if ( spell.length || parts || killstreak) {
            let text = '', classList = 'my-info-inv my-top-right';
            if ( spell.length ) {
                classList += ' my-spelled';
                text += 'S';
                if ( spell.length > 1 )
                    text += getSup( '2 ' );
            }
            if ( parts ) {
                text += 'P';
            }
            marks.push( {
                class: classList,
                text: text + killstreak
            });
        }
        //there is mark to add
        marks.forEach( mark => element.insertAdjacentHTML( 'beforeend', '<div class="' + mark.class + '">' + mark.text + '</div>') );
	}

	//check for strange_parts, spell in items and marks them
	function findPartsAndSpells( items_element ) {
		let item;
		items_element = items_element || document.querySelectorAll( '.item.app440' )
        console.log('Parts and spells function: ' + items_element.length);

        if (!items_element.length)
            return;

		if (items_element[0][0])
			console.log(items_element[0][0].rgItem)
		else
			console.log(items_element[0].rgItem)

		items_element.forEach( element => {
			//jquery	 m.fn.init [div.itemHolder]
			element = element[0] || element;
			item = element.rgItem;
			if (!item) {
                console.log( 'Item not defined: ', element);
				return;
            }
            if ( item.checked ) {
                console.log( 'Item was already checked: ', item);
                return;
            }

            totalItems++;
            item.checked = 1;
            addMarksToItem( element );
		});

        console.log('----' + totalItems + '----');
	}

	function loadInventoryHook() {
		let old_fun = g_ActiveInventory.m_SingleResponsivePage.EnsurePageItemsCreated;
		g_ActiveInventory.m_SingleResponsivePage.EnsurePageItemsCreated = () => {
			//sending g_ActiveInventory as this
			old_fun.call( g_ActiveInventory );
            g_ActiveInventory.m_SingleResponsivePage.EnsurePageItemsCreated = old_fun;
            findPartsAndSpells();
            console.log( 'Parts and Spells highlighted.' );

		}
	}
	var rgItems
	function loadInventoryHook2() {
		var old = g_ActiveInventory.GetPageItems
		g_ActiveInventory.GetPageItems = (iPage) => {
			rgItems = old.call( g_ActiveInventory, iPage );
			console.log(rgItems)
            console.log(rgItems[0][0].rgItem)
			findPartsAndSpells( rgItems );
			return rgItems;
		}
	}

	addCSStyle( css )
	//findPartsAndSpells();