// ==UserScript==
// @name         Steam: Buyorders
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Minimal price, History of BuyOrders
// @author       gortik
// @license      MIT
// @match        https://steamcommunity.com/market/listings/*
// @match        https://steamcommunity.com/market/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/480409/Steam%3A%20Buyorders.user.js
// @updateURL https://update.greasyfork.org/scripts/480409/Steam%3A%20Buyorders.meta.js
// ==/UserScript==

/*
  0.2.3: Wiki link was removed from SCM
*/

(function() {
    'use strict';
    console.log('Set minimal price for buyout')
    addListenerToBuyButton();
})();

/////////////////////////////////////// Leaves in title only name of item \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//Steam Community Market :: Listings for Strange Festivized Stickybomb Launcher
function clearDocumentTitle() {
    let arr = document.title.split( /Steam Community Market :: Listings for (?:\d+-)?/ );
    if ( arr.length != 2 ) {
        console.err( 'TM-Error: Name of item in title.' );
    } else {
        document.title = arr[1];
    }
}


function addListenerToBuyButton() {
    let buyButton = document.querySelector('.market_commodity_buy_button, .market_noncommodity_buyorder_button');
    if (!buyButton)
        return;
	let tmpListener = buyButton.onclick;
	buyButton.onclick = setMinPriceBuyOut;
	buyButton.addEventListener('click', tmpListener)
}

function setMinPriceBuyOut() {
	console.log(CreateBuyOrderDialog.m_nBestBuyPrice);
    let nodedArr = document.querySelectorAll('.market_commodity_orders_header_promote');
	let minPriceNode = nodedArr.length == 4 ? nodedArr[3] : nodedArr[1];
    //3,00€ --> 3,--€
    minPriceNode = minPriceNode.textContent.replace(/-/g, '0');
    minPriceNode = minPriceNode.replace(/[^0-9]/g, '')*1 + 1;
        //document.querySelector('#market_commodity_buyreqeusts_table table').rows[1].cells[0].textContent.replace(/[^0-9]/g, '')*1;
	CreateBuyOrderDialog.m_nBestBuyPrice = minPriceNode.toString();
	//console.log(CreateBuyOrderDialog.m_nBestBuyPrice)

    // set min items to buy
    document.querySelector( '#market_buy_commodity_input_quantity' ).value = 2;
    // auto check agree to the terms
    document.querySelector( '#market_buyorder_dialog_accept_ssa' ).checked = true
}

/////////////////////////////////////// Number of sales in past //////////////////////////////////////////////
//earliest date for history
if (g_plotPriceHistory)
    new Date(g_plotPriceHistory.axes.xaxis.min);

function daysAgoDate(days) {
	return new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000).getTime() ;
}

//number of sales from DAYS ago till now
function sumOfSales(days) {
	let	d = daysAgoDate(days),
		data = g_plotPriceHistory._plotData[0],
		sum = 0;

	for (let i = data.length - 1; i >= 0; i--) {
		//get sum only till date 'd'
		if (data[i][0] < d)
			break;
		sum += data[i][2] * 1;
	}
	return sum
}

document.querySelector('.jqplot-title').textContent += ' (' + sumOfSales(30) + ')';

///////////////////////////////////////////////////////////////


var buyOrdersHistory = (function() {
	let	_buyOrders, _itemSKU,
        elemOutput;

	start();

    function _error(erorrText, variable) {
        elemOutput.textContent = erorrText;
        throw `[Error] ${erorrText}:  ${variable}`;
    }

	function _getItemDefIndex() {
		let wikiLink = document.querySelector('.btn_small.btn_grey_white_innerfade'),
            regex;

		if (wikiLink) {
			let id = wikiLink.href.match(/\d+/)[0];
			//console.log('ID: ' + id);
			return id;
        // "http:\/\/wiki.teamfortress.com\/scripts\/itemredirect.php?id=30132&lang=en_US"
		} else if ( regex = document.documentElement.innerHTML.match( /itemredirect\.php\?id=(\d+)&lang/ ) ) {
            return regex[1];
        }
		else
			_error('Wiki link not found!', wikiLink);
	}

    function _getItemName() {
        let arr = document.title.split('Listings for ');
        if (arr.length != 2)
            _error('Erorr getting name of item.', arr);
        else {
            return arr[1];
        }
    }

	//adds info about buyorder to html
	function _add2HTML(item) {
		//formats date to Mon-Day-Year, Time
		let formatDateFun = d => d.toString().replace(/\w+ (\w+) (\d+) (\d+) ([\d:]+).*/,'$2-$1-$3, $4');

        elemOutput.textContent = formatDateFun(new Date(item.date)) + ' | ' + _itemSKU;
	}

	function _newBuyOrder() {
		//'place order' button
		/*document.querySelector('#market_buyorder_dialog_purchase')
		.addEventListener('click', function() {*/
            console.log('New buy order: ' + _itemSKU);
			_buyOrders[_itemSKU] = {
				date: new Date().getTime()
			}
			storageHandler.saveStorage(_buyOrders);
		//});
	}

    //{"success":1,"active":1,"purchased":0,"quantity":"1","quantity_remaining":"1","purchases":[]}
    function _hookBuyOrder() {
        let oldFun = CreateBuyOrderDialog.OnPollForBuyOrderCompletionSuccess;
        CreateBuyOrderDialog.OnPollForBuyOrderCompletionSuccess = newFun;

        function newFun(buy_orderid, response) {
            console.log(response);
            if (response.responseJSON && response.responseJSON.success)
                _newBuyOrder();
            oldFun(buy_orderid, response);
        }
    }

    function _getSKU() {
        let itemDefIndex, itemName;

        itemDefIndex = _getItemDefIndex();
        itemName = _getItemName();
        _itemSKU = new tf2ItemSKU().getSKU(itemDefIndex, itemName);
        console.log(`${itemName}: ${_itemSKU}`)
        return _itemSKU;
    }

    /*function _convertOldData(obj) {
        console.log('Coverting old data');
        //chem sets, strangifiers, unusalifiers
        [20000, 20001, 20005, 6522, 9258].forEach(e => delete obj[e]);
        Object.keys(obj).forEach(id => {
            if (id.indexOf(';') != -1) return;

            console.log('Coverting: ' + id);
            let tmpObj;
            tmpObj = obj[id];
            delete obj[id];
            if (id < 1000)
                obj[id + ';11'] = tmpObj;
            else
                obj[id + ';6'] = tmpObj;
        });
        storageHandler.saveStorage(obj);
    }*/

    //element for output text
    function getInfoElement() {
        elemOutput = document.querySelector('#my_market_buylistings_number') || document.querySelector('#my_market_selllistings_number');
        if (!elemOutput) {
            let parent = document.querySelector('#largeiteminfo_item_descriptors'),
                newNode = document.createTextNode('');
            if (!parent)
                elemOutput = newNode;
            else
                elemOutput = parent.insertBefore(newNode, parent.firstChild);
        }
    }

	function start() {
        getInfoElement();
		_getSKU();
		_buyOrders = storageHandler.loadStorage() || {};

        _hookBuyOrder();
        //Buy button hook
		/*document.querySelector('.market_commodity_buy_button, .market_noncommodity_buyorder_button')
            .addEventListener('click', _newBuyOrder);*/

		if (_buyOrders[_itemSKU]) {
			_add2HTML(_buyOrders[_itemSKU]);
		}
        else {
            console.log('BuyOrder not found in storage.');
            elemOutput.textContent = _itemSKU;
        }

        clearDocumentTitle();
	}

	return {
		start: start
	}
})

var tf2ItemSKU = function() {
    let _itemSKU, _itemName, _defIndex;

    function getSKU(defIndex, itemName) {
        //console.log(itemName + ': ' + defIndex);
        _itemName = itemName;
        _defIndex = defIndex;
        _itemSKU = `${defIndex};${getQuality()}`
        _itemSKU += getKillstreak();
        _itemSKU += isFestivized();
        _itemSKU += getChemSet();
        _itemSKU += getUnusualifiers();
        return _itemSKU;
    }

    function getQuality() {
        let qualities = { 'Genuine': 1, 'Vintage': 3, 'Unusual': 5, 'Unique': 6, 'Strange': 11, 'Collector\'s': 14 },
            item1Word = _itemName.split(' ')[0], itemQ;
        itemQ = qualities[item1Word] || 6;
        if (_itemName.startsWith('Strange Part:')) itemQ = 6;
        //console.log('Quality: ' + itemQ);
        return itemQ;
    }

    function getKillstreak() {
        if (_itemName.indexOf('Professional') != -1)
            return ';kt-3';
        if (_itemName.indexOf('Specialized') != -1)
            return ';kt-2';
        if (_itemName.indexOf('Killstreak') != -1)
            return ';kt-1';
        return '';
    }

    function isFestivized() {
        if (_itemName.indexOf('Festivized') != -1)
            return ';festive';
        else
            return '';
    }

    function getChemSet() {
        let setIDs = [20000, 20001, 20005, 6522], target;
        if (!setIDs.find(e => e == _defIndex)) return '';

        let allTargets = { 'Blood': 30132, 'Boston': 707, 'Foppish': 878, 'Professor': 343, 'Camera': 103, 'Bird-Man': 776, 'Sandvich': 643, 'Lord': 440, 'Stockbroker\'s': 336, 'Dark': 30073, 'Merc\'s': 541, 'Archimedes': 828, 'Toss-Proof': 757, 'Teddy': 386, 'RoBro': 733, 'All-Father': 647, 'Summer': 486, 'Fancy': 446, 'Villain\'s': 393, 'Sight': 387, 'Outback': 645, 'Bonk': 451 };

        //searches by first word from name
        target = allTargets[_itemName.split(' ')[0]];
        if (target == undefined) {
                //alert('Couldnt find SKU!!!');
                console.log('Chemistry sets SKU: ' + target);
        }
        return ';td-' + target;
    }

    function getUnusualifiers() {
        console.log(_defIndex)
        if (_defIndex != 9258) return '';

        let allTargets = {
            "The Travel Agent": 31290,
            "Drunk Mann's Cannon": 31291,
			"Hot Wheeler":		31239,
			"Schadenfreude":		463,
			"Shooter's Stakeout":		31237,
			"Conga":		1118,
			"Victory Lap":		1172,
			"Mannbulance!":		31203,
			"Kazotsky Kick":		1157,
			"Mannrobics":		1162,
			"Boston Boarder":		31156,
			"Rancho Relaxo":		1115,
			"Scotsmann's Stagger":		30840,
			"Rock, Paper, Scissors":		1110,
			"Dueling Banjo":		30842,
			"Homerunner's Hobby":		31233,
			"Zoomin' Broom":		30672,
			"Surgeon's Squeezebox":		30918,
			"High Five!":		167,
			"Square Dance":		1106,
			"Pooped Deck":		31153,
			"Skullcracker":		1111,
			"Time Out Therapy":		31154,
			"Director's Vision":		438,
			"Bare Knuckle Beatdown":		31207,
			"Luxury Lounge":		30922,
			"Scorcher's Solo":		31157,
			"Flippin' Awesome":		1107,
			"Fresh Brewed Victory":		1113,
			"Texas Truckin":		31160,
			"Table Tantrum":		1174,
			"Box Trot":		30615,
			"Drunken Sailor":		31201,
			"Carlton":		1168,
			"Panzer Pants":		1196,
			"Shred Alert Unusualifier":		1015,
			"Profane Puppeteer":		31202,
			"Runner's Rhythm":		30921,
			"Skating Scorcher":		30919,
			"Fist Bump":		31162,
			"Pool Party":		30570,
			"Rocket Jockey":		31155,
			"Soviet Strongarm":		30844,
			"Didgeridrongo":		30839,
			"Killer Solo":		30609,
			"Second Rate Sorcery":		30816,
			"Doctor's Defibrillators":		31236,
			"Balloonibouncer":		30763,
			"Oblooterated":		1120,
			"Proletariat Posedown":		30616,
			"Meet the Medic":		477,
			"Fubar Fanfare":		30761,
			"Trackman's Touchdown":		30917,
			"Deep Fried Desire":		1119,
			"Jumping Jack":		30845,
			"Boston Breakdance":		30572,
			"Party Trick":		1112,
			"Results Are In":		1109,
			"Buy A Life":		1108,
			"I See You":		1116,
			"Soldier's Requiem":		30673,
			"Scooty Scoot":		1197,
			"Bad Pipes":		30671,
			"Battin' a Thousand":		1117,
			"Bucking Bronco":		30618,
			"Disco Fever":		30762,
			"Spent Well Spirits":		1114,
			"Russian Arms Race":		30843,
			"Spin-to-Win":		31161,
			"Bunnyhopper":		30920,
			"Headcase":		30876,
			"Yeti Punch":		1182,
			"Burstchester":		30621,
			"Most Wanted":		30614,
			"Yeti Smash":		1183
        },
        target// = Object.keys(allTargets).find(e => _itemName.indexOf(e) != -1);
        {
            //problem with some steam prototype on opera vpn
            let arr = Object.keys(allTargets);
            for (let i = 0; i < arr.length; i++) {
                if (_itemName.indexOf( arr[i] ) != -1)
                    target = arr[i];
            }
        }


        if (target == undefined) alert('Couldnt find SKU!!!');
        target = allTargets[target];
        //console.log('Unusualifier sets SKU: ' + target);
        return ';td-' + target;
    }

    return {
        getSKU: getSKU
    }
}

var logger = (LOG_PREFIX) =>
	function log( ...args ) {
		// 2. Prepend log prefix log string
		args.unshift('[' + LOG_PREFIX + '] ' );
		// 3. Pass along arguments to console.log
		console.log.apply( this, args );
	}

var storageHandler = (function() {
	const _isTM = typeof GM == 'object' && typeof GM_setValue == 'function' && typeof GM_getValue == 'function',
          _log = logger('Storage'),
          _storageVarName = 'my_steam',		//browser localStorage item name
          _storageAttr = 'buyorders'			//steam object has data for this script under storageAttr

    _log(`StorageHandler from TamperMonkey: ${_isTM}`);

	function saveStorage( newData ) {
		_log('Saving to storage: ', newData);
        //saving only storageAttr, so first I have to load whole storageVarName object
		const data = getStorage();
		data[_storageAttr] = newData;
        //finally saving
		setStorage( data );
	}

    function setStorage( data ) {
        if (_isTM) {
            GM_setValue( _storageVarName, JSON.stringify( data ) );
        }
        localStorage.setItem( _storageVarName, JSON.stringify( data ) );
	}

	function getStorage() {
		let data;

        data = _isTM ? GM_getValue( _storageVarName ) : localStorage.getItem( _storageVarName );
        if (!data) {
            if (_isTM) {
                _log('No storage in TM, trying localStorage ...');
                data = localStorage.getItem( _storageVarName );
            }
            if (!data) {
                data = '{}';
            }
        }
		return JSON.parse( data );
	}

    function deleteStorage() {
        GM_deleteValue( _storageVarName );
        _log(_storageVarName + ' deleted.')
    }

	function loadStorage() {
		_log(`Loading storage: ${_storageVarName}[${_storageAttr}]`);
		const data = getStorage();

		if (data) {
            _log( data );
			return data[_storageAttr];
		} else {
			_log('Failed to load storage: ' + _storageVarName);
			return null;
		}
	}

	return {
		saveStorage: saveStorage,
		loadStorage: loadStorage,
        deleteStorage: deleteStorage
	}
})();

var buyOrdersHandler = new buyOrdersHistory();
mystor = storageHandler


