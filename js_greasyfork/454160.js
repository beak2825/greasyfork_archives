// ==UserScript==
// @name         Steam histogram gortik
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  steam histogram
// @license      MIT
// @author       gortik
// @match        https://steamcommunity.com/market/listings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/454160/Steam%20histogram%20gortik.user.js
// @updateURL https://update.greasyfork.org/scripts/454160/Steam%20histogram%20gortik.meta.js
// ==/UserScript==

var data = {
	'Mann Co. Supply Crate Key': 1,
	'Name Tag': 5,
	'Indubitably Green': 8,
	'Backpack Expander': 14,
	'Tour of Duty Ticket': 20,


	'Archimedes Strangifier Chemistry Set Series #1': 8237867,
	'Summer Shades Strangifier Chemistry Set Series #1': 8253895,


    'Dark Age Defender Strangifier Chemistry Set Series #2': 8241712,
    'Bird-Man of Aberdeen Strangifier Chemistry Set Series #1': 8237856,
    'Sandvich Safe Strangifier Chemistry Set Series #2': 8240415,
    'Professor Speks Strangifier Chemistry Set Series #2': 8238235,
    'Lord Cockswain\'s Novelty Mutton Chops and Pipe Strangifier Chemistry Set Series #2': 8240453,
    'Blood Banker Strangifier Chemistry Set Series #2': 8238342,
    'Outback Intellectual Strangifier Chemistry Set Series #2': 8238360,
    'Boston Boom-Bringer Strangifier Chemistry Set Series #2': 8240446,
    'Foppish Physician Strangifier Chemistry Set Series #2': 8240313,
	'Stockbroker\'s Scarf Strangifier Chemistry Set Series #2': 8240665,		//add el99

	'Strange Foppish Physician': 1950544,
	'Strange Lord Cockswain\'s Novelty Mutton Chops and Pipe': 1945768,
	'Strange Sandvich Safe': 1950551,
	'Strange Dark Age Defender': 1944229,
	'Strange Bird-Man of Aberdeen': 1552382,
	'Strange Blood Banker': 1943018,
	'Strange Outback Intellectual': 1947749,
	'Strange Boston Boom-Bringer': 1950545,


	'Stockbroker\'s Scarf Strangifier': 1945775,
	'Foppish Physician Strangifier': 1943020,
	'Professor Speks Strangifier': 1938484,
	'Dark Age Defender Strangifier': 1944208,
	'Bird-Man of Aberdeen Strangifier': 1422256,
	'Villain\'s Veil Strangifier': 1422329,
	'All-Father Strangifier': 1422328,
	'Summer Shades Strangifier': 1422257,
	'Blood Banker Strangifier': 1941819,
	'Boston Boom-Bringer Strangifier': 1945770,
	'Bonk Boy Strangifier': 1422693,

	'Strange Part: Kills While Explosive Jumping': 19,
	'Strange Part: Posthumous Kills': 48,
	'Strange Part: Scouts Killed': 51,
	'Strange Part: Gib Kills': 88,		//elhalf 2.38?
	'Strange Part: Buildings Destroyed': 89,
	'Strange Part: Headshot Kills': 90,
	'Strange Part: Projectiles Reflected': 91,
	'Strange Part: Domination Kills': 94,
	'Strange Part: Demomen Killed': 95,
	'Strange Part: Critical Kills': 96,			//el99 1.7 too high?
	'Strange Part: Soldiers Killed': 97,
	'Strange Part: Cloaked Spies Killed': 102,
	'Strange Part: Sappers Destroyed': 103,
	'Strange Part: Engineers Killed': 105,
	'Strange Part: Robots Destroyed': 106,
	'Strange Part: Low-Health Kills': 107,
	'Strange Part: Halloween Kills': 117,
	'Strange Part: Snipers Killed': 1279,
	'Strange Part: Underwater Kills': 1308,
	'Strange Part: Kills While Übercharged': 1313,
	'Strange Part: Pyros Killed': 1323,
	'Strange Part: Medics Killed': 60264,
	'Strange Part: Long-Distance Kills': 60821,
	'Strange Part: Giant Robots Destroyed': 410052,
	'Strange Part: Full Health Kills': 8243452,
	'Strange Part: Kills with a Taunt Attack': 1374156,
	'Strange Part: Spies Killed': 2555875,		//romtor move to 3.3 ? 28orders @ 3.31
	'Strange Part: Unusual-Wearing Player Kills': 2555729,
	'Strange Part: Allied Healing Done': 2555868,
	'Strange Part: Point-Blank Kills': 2556318,
	'Strange Part: Burning Enemy Kills': 2556324,
	'Strange Part: Damage Dealt': 2556894,
	'Strange Cosmetic Part: Fires Survived': 14484753,
	'Strange Cosmetic Part: Freezecam Taunt Appearances': 14483540,
	'Strange Part: Player Hits': 32222692,
	'Strange Part: Teammates Extinguished': 175922988,

	'Strange Spy-cicle': 8239038,
	'Strange Diamond Botkiller Wrench Mk.I': 3645,
	'Strange Carbonado Botkiller Scattergun Mk.I': 3504,
	'Strange Silver Botkiller Minigun Mk.I': 3529,
	'Strange Bazaar Bargain': 8239071,
	'Strange Gold Botkiller Scattergun Mk.I': 3468,
	'Strange Splendid Screen': 8242619,
	'Strange L\'Etranger': 8242456,
	'Strange Rust Botkiller Scattergun Mk.I': 3535,
	'Strange Gold Botkiller Scattergun Mk.II': 3649,
	'Strange Diamond Botkiller Medi Gun Mk.I': 3592,
	'Strange Diamond Botkiller Sniper Rifle Mk.I': 3596,
	'Strange Rocket Launcher': 2301135,
	'Strange Market Gardener': 8242495,
	'Strange Shotgun': 8239147,
	'Strange Dead Ringer': 8242032,
	'Strange Gold Botkiller Minigun Mk.II': 3624,
	'Strange Wrap Assassin': 8242547,
	'Strange Tomislav': 2261348,
	'Strange Black Box': 2324639,
	'Strange Wrench': 2263642,
	'Strange Fire Axe': 8239156,
	'Strange Equalizer': 8239021,
	'Strange Reserve Shooter': 8242033,
	'Strange Persian Persuader': 8239058,
	'Strange Bonesaw': 8241993,
	'Strange Pain Train': 8238991,
	'Strange Shovel': 8239087,
	'Strange Syringe Gun': 8239005,
	'Strange Natascha': 8241995,
	'Strange Fists of Steel': 8237541,
	'Strange Enforcer': 8239040,
	'Strange Back Scratcher': 8242459,
	'Strange Neon Annihilator': 8239172,
	'Strange Lollichop': 8239074,
	'Strange Homewrecker': 8237550,
	'Strange Sandman': 8239012,
	'Strange Kukri': 8239301,
	'Strange Jarate': 8239163,
	'Strange Powerjack': 8238996,
	'Strange Killing Gloves of Boxing': 8242026,
	'Strange Revolver': 8237548,
	'Strange Ambassador': 2262733,
	'Strange Razorback': 8237378,
	'Strange Bat': 8242483,
	'Strange Flame Thrower': 2296072,
	'Strange Overdose': 8239164,
	'Strange Blutsauger': 2281244,
	'Strange Sydney Sleeper': 8238985,
	'Strange Stickybomb Launcher': 2283197,
	'Strange Boston Basher': 8241998,
	'Strange Degreaser': 8242000,
	'Strange Scorch Shot': 8240476,
	'Strange Shortstop': 8239057,
	'Strange Pistol': 8239003,
	'Strange Southern Hospitality': 8242454,
	'Strange Rainblower': 8239070,
	'Strange Flying Guillotine': 8239167,
	'Strange Amputator': 8242020,
	'Strange Fists': 8238973,
	'Strange Knife': 2263165,
	'Strange Axtinguisher': 2295611,
	'Strange Wrangler': 35131467,
	'Strange Detonator': 8239044,
	'Strange Grenade Launcher': 2283050,
	'Strange Phlogistinator': 8244426,
	'Strange SMG': 2301500,
	'Strange Medi Gun': 2259982,
	'Strange Cloak and Dagger': 35131469,
	'Strange Gloves of Running Urgently': 8239007,
	'Strange Bushwacka': 8242009,
	'Strange Brass Beast': 8242461,
	'Strange Sniper Rifle': 2293668,
	'Strange Liberty Launcher': 8239045,
	'Strange Scattergun': 2298485,
	'Strange Backburner': 8239168,
	'Strange Bottle': 8239153,
	'Strange Family Business': 8242472,
	'Strange Frontier Justice': 2263752,
	'Strange Atomizer': 8239051,
	'Strange Vaccinator': 17645443,
	'Strange Diamondback': 8242027,
	'Strange Scottish Resistance': 8239042,
	'Strange Escape Plan': 8242498,
    'Strange Carbonado Botkiller Sniper Rifle Mk.I': 3502,
    'Strange Soda Popper': 8239200,
    'Strange Blood Botkiller Scattergun Mk.I': 3601,
    'Strange Silver Botkiller Scattergun Mk.II': 3608,
    'Strange Eyelander': 2298780,
    'Strange Silver Botkiller Sniper Rifle Mk.I': 3593,
    'Strange Silver Botkiller Knife Mk.II': 3515,



	'Strange Festivized Medi Gun': 175951413,
	'Strange Festivized Shovel': 175952022,
	'Strange Festivized Knife': 175951409,
	'Strange Festivized Rocket Launcher': 175951417,
	'Strange Festivized Wrench': 175951511,
	'Strange Festivized Kukri': 175951533,
	'Strange Festivized Panic Attack': 175956016,
	'Strange Festivized Crusader\'s Crossbow': 175951332,
	'Strange Festivized Scattergun': 175951420,
	'Strange Festivized Powerjack': 175951426,
	'Strange Festivized Killstreak Amputator': 176012645,
	'Strange Festivized Killstreak Rocket Launcher': 175951561,
	'Strange Festivized Killstreak Panic Attack': 175971695,
	'Strange Festivized Killstreak Knife': 175951966,
	'Strange Festivized Killstreak Scattergun': 175951315,
	'Strange Festivized Revolver': 175951319,


	'Strange Killstreak Sniper Rifle': 2284755,


	'Strange Festivized Specialized Killstreak Crusader\'s Crossbow': 175951462,
	'Strange Festivized Specialized Killstreak Scottish Resistance': 175951729,
	'Strange Specialized Killstreak Iron Bomber': 159601624,
	'Strange Killstreak Frontier Justice': 2363453,
    'Strange Festivized Specialized Killstreak Sniper Rifle': 175951320,


	'Strange Killstreak Liberty Launcher': 2263748,
	'Strange Specialized Killstreak Fan O\'War': 2376012,
	'Strange Specialized Killstreak Loch-n-Load': 2310641,
	'Strange Specialized Killstreak Backburner': 2347941,
	'Strange Killstreak Stickybomb Launcher': 2258396,
	'Strange Killstreak Market Gardener': 2256181,
	'Strange Specialized Killstreak Half-Zatoichi': 2316394,
	'Strange Professional Killstreak Overdose': 2375124,
	'Strange Professional Killstreak Killing Gloves of Boxing': 2355067,
	'Strange Professional Killstreak Escape Plan': 2416443,
	'Strange Killstreak Fists': 2361876,
	'Strange Professional Killstreak Half-Zatoichi': 2308991,
	'Genuine Specialized Killstreak AWPer Hand': 6728465,
	'Strange Gold Botkiller Minigun Mk.I': 3511,
	'Strange Specialized Killstreak Rocket Launcher': 2259642,
	'Strange Specialized Killstreak Conniver\'s Kunai': 2361526,
	'Strange Festivized Killstreak Minigun': 175951324,
	'Strange Festivized Minigun': 175951317,

    'Specialized Killstreak Conscientious Objector': 2361880,
	'Strange Festivized Specialized Killstreak Ubersaw': 175953404,
	'Strange Mad Milk': 8238997,
	'Strange Festive Sandvich': 2781,
	'Strange Australium Black Box': 2368669,

	'AK-47 | Slate (Well-Worn)': 176240977,
	'Desert Eagle | Printstream (Field-Tested)': 176185978,
	'Poacher\'s Safari Jacket': 20551398,
	'Bill\'s Hat': 19951612,

	'Unusual Taunt: The Homerunner\'s Hobby Unusualifier': 176265369,
	'Unusual Taunt: Surgeon\'s Squeezebox Unusualifier': 175953927,
	'Unusual Taunt: The Hot Wheeler Unusualifier': 176279468,
	'Unusual Taunt: Mannrobics Unusualifier': 173249384,
	'Unusual Taunt: The Schadenfreude Unusualifier': 172978813,
	'Unusual Taunt: Burstchester Unusualifier': 173306194,
	'Unusual Taunt: Yeti Smash Unusualifier': 175922942,
	'Unusual Taunt: Deep Fried Desire Unusualifier': 173270511,
	'Unusual Taunt: Bad Pipes Unusualifier': 173278973,
	'Unusual Taunt: The Box Trot Unusualifier': 173184013,
	'Unusual Taunt: The Proletariat Posedown Unusualifier': 175852433,
	'Unusual Taunt: The Mannbulance! Unusualifier': 176265415,

	'Strange Festive Bat': 2828,				//39e	have one elf
	'Strange Festive Flame Thrower': 2829,		//25e
	'Strange Festive Minigun': 2728,				//29-30
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
          _storageVarName = 'my_steam_nameID',		//browser localStorage item name
          _storageAttr = 'nameID'			//steam object has data for this script under storageAttr

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
        //_log( `Loaded storage: ${data}` );
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

function getItemName() {
    let elements = document.querySelectorAll('.market_listing_nav a');
    if (elements.length == 2)
        return elements[1].textContent;
    else
        throw 'Name of item wasnt found.'
}

function getNameID() {
    let regex = /Market_LoadOrderSpread\( (\d+) \)/,
        result
    //Market_LoadOrderSpread( 8240453 );	// initial load
    result = (document.documentElement.innerHTML.match(regex));
    if (result)
        return result[1];
    else
        throw 'NameID wasnt found.'
}

function showNameID() {
    //'Lord Cockswain\'s Novelty Mutton Chops and Pipe Strangifier Chemistry Set Series #2': 8240453,
    let itemName = getItemName().replace( /'/g, "\\'" ),
        nameID = getNameID(),
        parent = document.querySelector( '.item_desc_description' );

    if (parent)
        parent.insertAdjacentHTML( 'beforeend', '<div>\'' + itemName + '\': ' + nameID + ',</div>' )
    //parent.insertAdjacentHTML( 'beforeend', '<table style="width:100%"><tr><td>' + itemName + '</td><td>' + nameID + '</td></tr></table>' )
}

function saveNameID() {
    let itemName = getItemName(),
        nameID = getNameID(),
        nameIDs;

    nameIDs = storageHandler.loadStorage() || {};

    //check if nameID is not already saved
    if ( !data[ itemName ] && !nameIDs[ itemName ] ) {
        log( 'new nameID' );
        nameIDs[ itemName ] = nameID;
        log( nameIDs );
        storageHandler.saveStorage( nameIDs );
    }

}

var log = logger('nameIDs');

(function() {
    'use strict';
    showNameID();
    saveNameID();
    // Your code here...
})();