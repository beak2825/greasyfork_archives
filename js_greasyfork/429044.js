// ==UserScript==
// @name         MH: M400 Hunting Helper
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.0.10
// @description  Adds the ability to one click travel to the next m400 assigment location
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @connect      http://www.mousehuntgame.com/*
// @connect      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/429044/MH%3A%20M400%20Hunting%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/429044/MH%3A%20M400%20Hunting%20Helper.meta.js
// ==/UserScript==
$(document).ready(function() {
    const debug = localStorage.getItem('ws.debug');
    if (debug == true) {
        console.log('M400 Hunting Helper');
    };
});

$(document).on('click', '.campPage-tabs-tabHeader.quests', function() {
    setTimeout(renderQuestTab, 400);
});

function renderQuestTab() {
    if ($('#questTravelButton').length > 0) {
    } else {
        const allTasks = $('.campPage-quests-objective-container:not(".locked")');
        $(allTasks).find('.campPage-quests-objective-content').css({'width': '50%',});
        const questTravelButton = document.createElement('button');
        questTravelButton.id = 'questTravelButton';
        $(questTravelButton).addClass('mousehuntActionButton small');
        $(questTravelButton).attr('title', 'Travel to task location');
        const travelText = document.createElement('span');
        $(travelText).addClass('travelText').text('Travel').css({
            'font-size': '12px',
        });
        $(questTravelButton).append(travelText);
        $(allTasks).find('.campPage-quests-objective').append(questTravelButton);
        $('.campPage-tabs-tabContent').find('.mousehuntActionButton.small').css({
            'width': '75px',
            'height': '25px',
            'vertical-align': 'middle',
        });
    }
    if ($('.campPage-quests-title').text() == 'Track down the elusive M400') {
        $('.campPage-quests-footer-smash').text('Smash M400 Hunting Research Assigment')
    } else if ($('.campPage-quests-title').text() == 'M400 Bait Research') {
        $('.campPage-quests-footer-smash').text('Smash M400 Bait Research Assigment')
    }
}

$(document).on('click', '#questTravelButton', function() {
    if ($('.campPage-tabs-tabHeader.quests').hasClass('active')) {
        if ($('.campPage-quests-title').text() == 'Track down the elusive M400'||'M400 Bait Research') {
            let location = $(this).parent().parent().find('.campPage-quests-objective-task').text();
            let bait = "";
            const locationSplit = location.split(' in ');
            if (locationSplit[1] == undefined) {
                const mouseSplit = location.split('from ');
                location = convertMouseToLocation(mouseSplit[1].replace(' Mice','xyz').replace(' Mouse','xyz').split('xyz')[0])
            } else {
                const baitSplit = locationSplit[1].replace('the ','').split(' using ');
                if (baitSplit[1] == undefined) {
                    location = baitSplit[0];
                } else {
                    location = baitSplit[0];
                    bait = baitSplit[1];
                }
            }
            app.pages.TravelPage.travel(convertNameToClass(location));
            if (bait == 'Fusion Fondue') {
                hg.utils.TrapControl.setBait(1386).go();
            }
        }
    }
});

function convertMouseToLocation(mouseName) {
    let locationName = "";
    const meadow = ['Meadow','Bionic'];
    const bazaar = ['Bazaar','Master Burglar','Burglar','Granite'];
    const kGauntlet = ["King's Gauntlet",'Cavalier','Terra','Knight','Page','Phalanx','Stealth'];
    const training = ['Training Grounds','Ninja','Kung Fu','Samurai','Archer'];
    const meditation = ['Meditation Room','Master of the Cheese Belt','Master of the Cheese Claw','Master of the Cheese Fang','Masters of the Cheese Belt','Masters of the Cheese Claw','Masters of the Cheese Fang'];
    const pinacle = ['Pinnacle Chamber','Master of the Dojo','Masters of the Dojo','Dojo Sensei'];
    const catacombs = ['Catacombs','Lycan','Terror Knight','Keeper'];
    const fGrove = ['Forbidden Grove','Realm Ripper','Realm Rippers'];
    const aRealm = ['Acolyte Realm','Gate Guardian','Sorceror','Gorgon'];
    const ssh4 = ['S.S. Huntington IV','Buccaneer','Captain'];
    const derrDunes = ['Derr Dunes','Grunt','Guardian','Renegade','Seer','Trailblazer'];
    const nergPlains = ['Nerg Plains','Conjurer','Conqueror','Defender','Finder','Pathfinder'];
    const elubShore = ['Elub Shore','Mystic','Pack','Protector','Scout','Vanquisher'];
    const jod = ['Jungle of Dread','Magma Carrier','Primal','Stonework Warrior','Pygmy Wrangler','Swarm of Pygmy'];
    const balacksCove = ["Balack's Cove",'Derr Lich','Elub Lich','Nerg Lich'];
    const dracano = ['Dracano','Draconic Warden','Whelpling','Dragon'];
    const slushyShoreline = ['Slushy Shoreline','Chipper','Snow Slinger','Snow Sniper','Snow Soldier','Yeti','Polar Bear'];
    const csc = ['Claw Shot City','Prospector','Ruffian','Saloon Gal','Lasso Cowgirl','Shopkeeper','Tumbleweed','Pyrite'];
    const seasonalGarden = ['Seasonal Garden','Mystic Knight','Technic Knight','Mystic Bishop','Technic Bishop'];
    const muridaeMarket = ['Muridae Market','Blacksmith','Mage Weaver','Market Guard','Spice Merchant','Market Thief','Pie Thief','Lumberjack','Glass Blower','Limestone Miner'];
    const sandDunes = ['Sand Dunes','Sand Colossus','Scarab','Serpentine','Grubling Herder','Sand Pilgrim','Sand Pilgrims','Quesodillo','Spiky Devil','Dunehopper'];
    const livingGarden = ['Living Garden','Barkshell','Camofusion','Thorn','Twisted Hotcakes','Bark','Camoflower','Strawberry Hotcakes','Thistle','Calalilly','Shroom'];
    const lostCity = ['Lost City','Cursed Librarian','Cursed Enchanter','Essence Guardian','Essence Collector','Ethereal Enchanter','Ethereal Librarian','Ethereal Librarians','Ethereal Thief','Ethereal Engineer'];
	const crystalLibrary = ['Crystal Library','Effervescent','Walker','Tome Sprite','Pocketwatch'];
	const mousoleum = ['Mousoleum','Zombie','Ravenous Zombie'];
	const tod = ['Town of Digby','Lambent Crystal'];
	const laboratory = ['Laboratory','Monster'];
    const allLocations = [meadow,bazaar,kGauntlet,training,meditation,pinacle,catacombs,fGrove,aRealm,ssh4,
                          derrDunes,nergPlains,elubShore,jod,dracano,balacksCove,slushyShoreline,csc,seasonalGarden,
                          muridaeMarket,livingGarden,lostCity,sandDunes,crystalLibrary,mousoleum,tod,laboratory];
    allLocations.forEach(function(array,e) {
        if (array.includes(mouseName)) {
            locationName = array[0];
        }
    })
    return locationName;
}

function convertNameToClass(locationName) {
    const debug = localStorage.getItem('ws.debug');
    let locationTag = "";
    if (locationName == 'Fiery Warpath') {
        locationTag = 'desert_warpath';
    } else if (locationName == 'Seasonal Garden') {
        locationTag = 'seasonal_garden';
    } else if (locationName == 'Meadow') {
        locationTag = 'meadow';
    } else if (locationName == 'Town of Gnawnia') {
        locationTag = 'town_of_gnawnia';
    } else if (locationName == 'Windmill') {
        locationTag = 'windmill';
    } else if (locationName == 'Harbour') {
        locationTag = 'harbour';
    } else if (locationName == 'Mountain') {
        locationTag = 'mountain';
    } else if (locationName == "King's Arms") {
        locationTag = 'kings_arms';
    } else if (locationName == 'Tournament Hall') {
        locationTag = 'tournament_hall';
    } else if (locationName == "King's Gauntlet") {
        locationTag = 'kings_gauntlet';
    } else if (locationName == 'Calm Clearing') {
        locationTag = 'calm_clearing';
    } else if (locationName == 'Great Gnarled Tree') {
        locationTag = 'great_gnarled_tree';
    } else if (locationName == 'Lagoon') {
        locationTag = 'lagoon';
    } else if (locationName == 'Laboratory') {
        locationTag = 'laboratory';
    } else if (locationName == 'Mousoleum') {
        locationTag = 'mousoleum';
    } else if (locationName == 'Town of Digby') {
        locationTag = 'town_of_digby';
    } else if (locationName == 'Bazaar') {
        locationTag = 'bazaar';
    } else if (locationName == 'Toxic Spill') {
        locationTag = 'pollution_outbreak';
    } else if (locationName == 'Training Grounds') {
        locationTag = 'training_grounds';
    } else if (locationName == 'Dojo') {
        locationTag = 'dojo';
    } else if (locationName == 'Meditation Room') {
        locationTag = 'meditation_room';
    } else if (locationName == 'Pinnacle Chamber') {
        locationTag = 'pinnacle_chamber';
    } else if (locationName == 'Catacombs') {
        locationTag = 'catacombs';
    } else if (locationName == 'Forbidden Grove') {
        locationTag = 'forbidden_grove';
    } else if (locationName == 'Acolyte Realm') {
        locationTag = 'forbidden_grove';
    } else if (locationName == 'Cape Clawed') {
        locationTag = 'cape_clawed';
    } else if (locationName == 'Elub Shore') {
        locationTag = 'elub_shore';
    } else if (locationName == 'Nerg Plains') {
        locationTag = 'nerg_plains';
    } else if (locationName == 'Derr Dunes') {
        locationTag = 'derr_dunes';
    } else if (locationName == 'Jungle of Dread') {
        locationTag = 'jungle_of_dread';
    } else if (locationName == 'Dracano') {
        locationTag = 'dracano';
    } else if (locationName == "Balack's Cove") {
        locationTag = 'balacks_cove';
    } else if (locationName == 'Claw Shot City') {
        locationTag = 'claw_shot_city';
    } else if (locationName == 'Gnawnian Express Station') {
        locationTag = 'train_station';
    } else if (locationName == 'Fort Rox') {
        locationTag = 'fort_rox';
    } else if (locationName == 'S.S. Huntington IV') {
        locationTag = 'ss_huntington_ii';
    } else if (locationName == "Zugzwang's Tower") {
        locationTag = 'zugzwang_tower';
    } else if (locationName == 'Crystal Library') {
        locationTag = 'zugzwang_library';
    } else if (locationName == 'Slushy Shoreline') {
        locationTag = 'slushy_shoreline';
    } else if (locationName == 'Iceberg') {
        locationTag = 'iceberg';
    } else if (locationName == 'Sunken City') {
        locationTag = 'sunken_city';
    } else if (locationName == 'Muridae Market') {
        locationTag = 'desert_city';
    } else if (locationName == 'Living Garden') {
        locationTag = 'desert_oasis';
    } else if (locationName == 'Twisted Garden') {
        locationTag = 'desert_oasis';
    } else if (locationName == 'Lost City') {
        locationTag = 'lost_city';
    } else if (locationName == 'Cursed City') {
        locationTag = 'lost_city';
    } else if (locationName == 'Sand Dunes') {
        locationTag = 'sand_dunes';
    } else if (locationName == 'Sand Crypts') {
        locationTag = 'sand_dunes';
    }
    if (debug == true) {
        console.log('Traveling to: ',locationName,locationTag);
    }
    return locationTag;
}

$(document).on('click', '.campPage-quests-footer-smash', function() {
    if ($('.campPage-quests-title').text() == 'Track down the elusive M400') {
        if (confirm("Smash Your M400 Hunting Research Assignment?")) {
            const smashIt = 'library_m400_research_quest_item';
            hg.utils.UserInventory.smashItem(smashIt,1,function (resp) {;})
        }
    } else if ($('.campPage-quests-title').text() == 'M400 Bait Research') {
        if (confirm("Smash Your M400 Bait Research Assignment?")) {
            const smashIt = 'library_m400_bait_research_quest_item';
            hg.utils.UserInventory.smashItem(smashIt,1,function (resp) {;})
        }
    }
})
