// ==UserScript==
// @name        [GC] Trading Post QoL L2
// @namespace   Masterofdarkness
// @match       https://www.grundos.cafe/island/tradingpost/*
// @match       https://grundos.cafe/island/tradingpost/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @license     MIT
// @version     1.1
// @author      Masterofdarkness
// @description Adds links to the static lot numbers, show how many active lots you have, move autosale items to the top and change the color of the lot, highlight relics, highlight bad actors
// @downloadURL https://update.greasyfork.org/scripts/525620/%5BGC%5D%20Trading%20Post%20QoL%20L2.user.js
// @updateURL https://update.greasyfork.org/scripts/525620/%5BGC%5D%20Trading%20Post%20QoL%20L2.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //Global values
    let badUserList;
    let badUserFlag;
    let itemWantList;
    let itemWantFlag;
    let cheapRelicsFlag;
    let vpIconFlag;

    //Global buttons

    //Main Functions
    scriptAddons();
    staticClickableLinks();
    personalTradeFunctions();

    //Listeners
    window.addEventListener('load', loadSavedSettings);

//
//All Functions
//

    function loadSavedSettings()
    {
        //Bad users
        badUserFlag = GM_getValue('baduserflag');
        triggerToggle('toggle1',badUserFlag);
        //Cheap relics
        cheapRelicsFlag = GM_getValue('cheaprelicsflag');
        triggerToggle('toggle2',cheapRelicsFlag);
        //VP icon search
        vpIconFlag = GM_getValue('vpiconflag');
        triggerToggle('toggle3',vpIconFlag);

        /*
        if(vpIconFlag)
        {
            alert(vpIconFlag);
            window.addEventListener('load', addVPIcon);
        }*/
    }

//Make static Lot#s clickable links
    function staticClickableLinks()
    {
        document.querySelectorAll('div.flex-column.small-gap span > strong, div.flex.space-between > strong').forEach(strong => {const m = strong.innerHTML.match(/Lot #(\d+)/);if(m)strong.innerHTML = `<a href="https://www.grundos.cafe/island/tradingpost/lot/${m[1]}">Lot #${m[1]}</a>`});
    }

//Mark Decieving Users Trade Lots
    function checkBadUsers(inputtoggle)
    {
        var output;
        output = GM_getValue('baduserlist', 'no bad users');
        if(output)
        {
            let baduserCount = 0;
            document.querySelectorAll('div.trade-lot.flex-column.big-gap').forEach(lookup => {const badusers = lookup.querySelector('a[href^="/userlookup/"]');
                                                                                              if(badusers)
                                                                                              {
                                                                                                  if(badUserList.includes(badusers.textContent))
                                                                                                  {
                                                                                                      if(inputtoggle)
                                                                                                      {
                                                                                                          lookup.style.backgroundColor = '#FF0000';
                                                                                                      }
                                                                                                      else
                                                                                                      {
                                                                                                          lookup.style.backgroundColor = 'transparent';
                                                                                                      }
                                                                                                      baduserCount++;
                                                                                                  }
                                                                                              }
                                                                                             });
        }
        badUserFlag = GM_setValue('baduserflag',inputtoggle);
    }

//Check Relic Prices
    function checkRelicPrices(inputtoggle)
    {
            const tradeLotContainer = document.querySelectorAll('div.trade-lot.flex-column.big-gap')

            tradeLotContainer.forEach(function(tradeLot) {

                //If Bad user is selling a relic
                if(badUserList.includes(tradeLot.querySelector('a[href^="/userlookup/"]').textContent))
                {
                    return;
                }

                //Get AutoSale price
                if(tradeLot.querySelector('[id^="quicksale-text"]'))
                {
                    let autosaleText = tradeLot.querySelector('[id^="quicksale-text"]').textContent.replace(/[^0-9]/g, '');
                    //alert(autosaleText);
                }
                /*
                //Get wishlist and try to extract a price
                if(tradeLot.querySelector('[id^="wishlist-text"]'))
                {
                    let wishlistText = tradeLot.querySelector('[id^="wishlist-text"]').textContent.replace(/[^0-9]/g, '');
                    alert(wishlistText);
                }*/

                // Select all trade-item elements within the current trade lot
                var listofItems = tradeLot.querySelectorAll('.trade-item');

                // Get the number of trade-item elements
                var numberOfItems = listofItems.length;

                // Get the names of items inside each trade-item element
                var itemNames = [];

                listofItems.forEach(function(tradeItem) {
                    var relicItemName = tradeItem.innerText.replace(/\(.*?\)/g, '').trim();
                    //If its a relic, push to stack
                    if(relicList.includes(relicItemName))
                    {
                        itemNames.push(relicItemName);
                    }
                    //Relic Price
                });

                if(itemNames.length > 0)
                {
                    if(inputtoggle)
                    {
                        tradeLot.style.backgroundColor = '#4CAF50';
                    }
                    else
                    {
                        tradeLot.style.backgroundColor = 'transparent';
                    }
                }
            });

        cheapRelicsFlag = GM_setValue('cheaprelicsflag',inputtoggle);
    }

//
//All Personal Trade Elements
//

//Activate routines only if on your main trade page
    function personalTradeFunctions()
    {
        if(window.location.href == 'https://www.grundos.cafe/island/tradingpost/') {
            //Move AutoSale items to the top and change color to trade lot blue
            const container = document.querySelector('.trading_post');
            let tradeLots = Array.from(container.querySelectorAll('.trade-lot'));
            const hrBars = Array.from(container.querySelectorAll('hr'));
            const pattern = /^[0-9,]+ NP$/;

            let createLot = Array.from(container.querySelectorAll('.flex-column.big-gap'));
            let createLotButtonText = createLot[createLot.length - 1];

            tradeLots = tradeLots.map(tradeLot => { return { div : tradeLot, hrBar: tradeLot.nextElementSibling.tagName === 'HR' ? tradeLot.nextElementSibling : null }});
            tradeLots.sort((a, b) => {
                const spanA = a.div.querySelector('span[id^="quicksale-text-"]');
                const spanB = b.div.querySelector('span[id^="quicksale-text-"]');

                const matchesA = spanA && pattern.test(spanA.textContent.trim());
                const matchesB = spanB && pattern.test(spanB.textContent.trim());

                return (matchesB ? 1 : 0) - (matchesA ? 1 : 0);
            });

            tradeLots.forEach(tradeLot => {
                if(!tradeLot.div.innerHTML.includes(`<em class="gray">None</em>`)) {
                    tradeLot.div.style.backgroundColor = '#b0bcec';
                }
                container.appendChild(tradeLot.div);
                if (tradeLot.hrBar) {
                    container.appendChild(tradeLot.hrBar);
                }

            });


            //Get Number of active lots
            let i = 0;
            document.querySelectorAll('div.trade-lot.flex-column.big-gap').forEach(trade => {i++});

            //Print value of active lots out of 20
            let elements = document.querySelector('strong.center.bigfont')
            elements.textContent += ` (${i}/20)`;


            container.appendChild(createLotButtonText);
        }
    }

//
//All Listener Functions
//
    function addVPIcon(inputtoggle) {

        if(inputtoggle)
        {
            const tpItems = document.querySelectorAll('.trade-item');
            tpItems.forEach(tradeItem => {
                if (tradeItem.querySelector('.vp-icon')) return;

                const itemInfo = tradeItem.querySelector('.item-info span');
                const itemImage = tradeItem.querySelector('.small-image');
                if (!itemInfo || !itemImage) return;
                const itemName = itemInfo.textContent.trim();
                const icon = document.createElement('img');
                icon.src = 'https://virtupets.net/assets/images/vp.png';
                icon.alt = 'Search Virtupets';
                icon.style.width = '25px';
                icon.style.height = '25px';
                icon.style.cursor = 'pointer';
                icon.style.marginRight = '8px';
                icon.classList.add('vp-icon');
                icon.addEventListener('click', () => {
                    const searchUrl = `https://virtupets.net/search?q=${encodeURIComponent(itemName)}`;
                    window.open(searchUrl, '_blank');
                });
                itemImage.parentElement.insertAdjacentElement('beforebegin', icon);
            });
        }

        vpIconFlag = GM_setValue('vpiconflag',inputtoggle);
    }

    function triggerToggle(toggleId, state) {
        // Get the checkbox element by its ID
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            // Set the checkbox state (true or false)
            toggle.checked = state;

            // Dispatch a 'change' event to trigger event listeners
            const event = new Event('change');
            toggle.dispatchEvent(event);
        }
    }

//
//Script Addons
//
    function scriptAddons()
    {
        //Bad Users
        badUserList = GM_getValue('baduserlist', []).join(',');

        GM_registerMenuCommand('Set Bad User List', function() {
            let value = prompt('Enter a comma separated list of which users to mark', GM_getValue('baduserlist', []).join(','));
            if (value) {
                badUserList = [];
                for (const item of value.split(','))
                {
                    badUserList.push(item.trim());
                    GM_setValue('baduserlist', badUserList);
                }
            }
        }, 'i');

        //Item List
        itemWantList = GM_getValue('itemwantlist', []).join(',');

        GM_registerMenuCommand('Set Item Want List', function() {
            let value = prompt('Enter a comma separated list of which items to mark', GM_getValue('itemwantlist', []).join(','));
            if (value) {
                itemWantList = [];
                for (const item of value.split(','))
                {
                    itemWantList.push(item.trim());
                    GM_setValue('itemwantlist', itemWantList);
                }
            }
        }, 'i');

    }

//
//Fixed Window Setup
//

    // Create the fixed window container
    const fixedWindow = document.createElement('div');
    fixedWindow.classList.add('fixed-window');

    // Add the window title
    const title = document.createElement('h2');
    title.textContent = 'TP QoL Settings';
    fixedWindow.appendChild(title);

    // Create a container for toggle switches with labels
    const toggleGroup = document.createElement('div');
    toggleGroup.classList.add('toggle-group');

    /////
    // Create Toggle 1 with label
    const toggle1Container = document.createElement('div');
    toggle1Container.classList.add('toggle-container');

    const toggle1LabelText = document.createElement('span');
    toggle1LabelText.textContent = 'Show Bad Users';
    toggle1Container.appendChild(toggle1LabelText);

    const toggle1Label = document.createElement('label');
    toggle1Label.classList.add('switch');
    const toggle1Input = document.createElement('input');
    toggle1Input.type = 'checkbox';
    toggle1Input.id = 'toggle1';
    toggle1Label.appendChild(toggle1Input);
    const toggle1Slider = document.createElement('span');
    toggle1Slider.classList.add('slider');
    toggle1Label.appendChild(toggle1Slider);

    toggle1Container.appendChild(toggle1Label);
    toggleGroup.appendChild(toggle1Container);

    // Create Toggle 2 with label
    const toggle2Container = document.createElement('div');
    toggle2Container.classList.add('toggle-container');

    const toggle2LabelText = document.createElement('span');
    toggle2LabelText.textContent = 'Show Relics';
    toggle2Container.appendChild(toggle2LabelText);

    const toggle2Label = document.createElement('label');
    toggle2Label.classList.add('switch');
    const toggle2Input = document.createElement('input');
    toggle2Input.type = 'checkbox';
    toggle2Input.id = 'toggle2';
    toggle2Label.appendChild(toggle2Input);
    const toggle2Slider = document.createElement('span');
    toggle2Slider.classList.add('slider');
    toggle2Label.appendChild(toggle2Slider);

    toggle2Container.appendChild(toggle2Label);
    toggleGroup.appendChild(toggle2Container);

    // Create Toggle 3 with label
    const toggle3Container = document.createElement('div');
    toggle3Container.classList.add('toggle-container');

    const toggle3LabelText = document.createElement('span');
    toggle3LabelText.textContent = 'Show VP Icon (Requires F5)';
    toggle3Container.appendChild(toggle3LabelText);

    const toggle3Label = document.createElement('label');
    toggle3Label.classList.add('switch');
    const toggle3Input = document.createElement('input');
    toggle3Input.type = 'checkbox';
    toggle3Input.id = 'toggle3';
    toggle3Label.appendChild(toggle3Input);
    const toggle3Slider = document.createElement('span');
    toggle3Slider.classList.add('slider');
    toggle3Label.appendChild(toggle3Slider);

    toggle3Container.appendChild(toggle3Label);
    toggleGroup.appendChild(toggle3Container);
    /////

    // Append toggle group to the fixed window
    fixedWindow.appendChild(toggleGroup);

    // Append the fixed window to the body
    document.body.appendChild(fixedWindow);

    // Optional: Add JavaScript to handle toggle actions
    toggle1Input.addEventListener('change', function () {
        checkBadUsers(this.checked);
        console.log('Toggle 1 is now: ' + (this.checked ? 'ON' : 'OFF'));
    });

    toggle2Input.addEventListener('change', function () {
        checkRelicPrices(this.checked);
        console.log('Toggle 2 is now: ' + (this.checked ? 'ON' : 'OFF'));
    });

    toggle3Input.addEventListener('change', function () {
        //checkVPIcon(this.checked);
        addVPIcon(this.checked);
        console.log('Toggle 3 is now: ' + (this.checked ? 'ON' : 'OFF'));
    });

    // Inject custom CSS to style the fixed window and toggle switches
    GM_addStyle(`
        /* Fixed Window Styling */
        .fixed-window {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: white;
            border: 2px solid #ccc;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            width: 250px;
        }

        .fixed-window h2 {
            font-size: 18px;
            margin-bottom: 10px;
            color: #008000;
        }

        /* Toggle Group Styling */
        .toggle-group {
            display: flex;
            flex-direction: column;
            gap: 20px;
            color: #000000;
        }

        .toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }

        .toggle-container span {
            font-size: 14px;
        }

        /* Toggle Switch Styles */
        .switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 20px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            border-radius: 50px;
        }

        .slider:before {
            content: "";
            position: absolute;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: 0.4s;
        }

        input:checked + .slider {
            background-color: #4CAF50;
        }

        input:checked + .slider:before {
            transform: translateX(14px);
        }
    `);
})();

//
//Lists & Arrays
//

//Relics
const relicList = [`Air Faerie Crown`, `Air Faerie Token`, `Ancient Lupe Wand`, `Aquatic Gem`, `Army Math Tools`,
`Attack Cape`, `Attack Fork`, `Bag of Occult Jelly`, `Battle Plunger`, `Battle Quill`,
`Bit of Evil Clown`,`Bismuth`, `Blizzard Ring`, `Blood Grub`, `Boom Sticks`, `Brain Tree Branch`,
`Brain Tree Knife`, `Brain Tree Mace`, `Brain Tree Root`, `Brain Tree Splinters`,
`Cabbage of Mystery`, `Candy Club`, `Castle Defenders Shield`, `Castle Defenders Sword`,
`Caustic Potion`, `Charles' Torch`, `Cobrall Wand`, `Dark Faerie Dagger`, `Dark Faerie Token`, `Donny's Mallet`, `Earth Faerie Dagger`, `Earth Faerie Token`, `Earth Stone Gem`,
`Elephante Lamp`, `Eraser of the Dark Faerie`, `Exploding Space Bugs`, `Faerie Eraser`, `Fat Red Pen`, `Fire Faerie Token`, `Fire Stone Gem`, `Frostbite Dart`, `Fumpu Leaf Medallion`, `Garin's Sword`,
`Genie Orb`, `Ghost Lupe Sword`, `Golden Aisha Wand`, `Golden Meepit Statue`, `Golden Pirate Amulet`,
`Good Snowball`, `Grarrg Tooth`, `Great Snowball`, `Grundo Gavel`, `Halloween Aisha Bucket`, `Happy Anniversary Negg`,
`Happy Negg Eraser`, `Hawk Bracelet`, `Hawk Wand`, `Iced Wand`, `Iceray Bracelet`, `Irregulation Chainmail`,
`Jar of Spiders`, `King Kelpbeards Blessing`, , `Legendary von Roo Ring`, `Light Faerie Dagger`, `Light Faerie Token`,
`Magic Branch`, , `Malice Potion`, `Melting Mirror`, `Monotonous Dial`, `Mystical Fish Lobber`, `Mystic Guitar`,
`Mystic Jelly Bean Necklace`, `Neutron Wand`, , `Official Prissy Miss Hair Brush`, `Patched Magic Hat`,
`Pear of Disintegration`, , `Platinum Dubloon`, `Poké Ball`,`Portable Seismometer`, `Power Negg Eraser`, `Pumpkin Stick`, `Radish Bow`, `Rainbow Cybunny Wand`,
`Rainbow Kacheek Pendant`, `Rainbow Negg Eraser`, `Rainbow Pteri Feather`, `Reinvented Wheel`, `Ring of the Lost`,
`Robo Sloth Fist of Power`, `Royal Wedding Ring`, `Rusty Garden Pitchfork`, `Rutabaga Lance`, `Scarab Amulet`, `Scroll of Ultimate Knowledge`,
`Snowager Pendant`, `Snowager Sleep Ray`, `Snow Beast Horn`, `Snowflake Pendant`, `Snowglobe Staff`, `Soul Stone`,
`Space Amulet`, `Space Faeries Shield`, `Space Faerie Token`, `Spider Grundo Sword`, `Spirited Fiddle`, `Spooky Slime`,
`Squash Club`, `Staff of Brain`, `Starry Scorchio Wand`, `Superior Battle Plunger`, `Trident of Chiazilla`, `Trusty Hand Cannon`,
`Tyrannian Amulet`, `Ultra Fire Gem`, `Wand of the Snow Faerie`, `Water Faerie Dagger`, `Water Faerie Token`, `Wind Up Rat`,
`Witches Orb`, `Wooden Compass`, `Zucchini Bat`
];