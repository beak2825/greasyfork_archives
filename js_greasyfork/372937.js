// ==UserScript==
// @name          WaniKani Dashboard Leech Tables - Notice your leeches
// @namespace     wk-dashboard-leech-display
// @description   Shows your Leeches on the Wanikani dashboard
// @author        Dani2
// @version       1.6
// @include       https://www.wanikani.com/dashboard
// @include       https://www.wanikani.com/
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/372937/WaniKani%20Dashboard%20Leech%20Tables%20-%20Notice%20your%20leeches.user.js
// @updateURL https://update.greasyfork.org/scripts/372937/WaniKani%20Dashboard%20Leech%20Tables%20-%20Notice%20your%20leeches.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //------------------------------
	// Wanikani Framework
	//------------------------------
	if (!window.wkof) {
		let response = confirm('WaniKani Dashboard Leech List script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}

		return;
	}

	const config = {
		wk_items: {
			options: {
				review_statistics: true
			},
            filters: {
                level: '1..+0', //only retrieve items from lv 1 up to and including current level
                srs: {value: 'lock, init, burn', invert: true} //exlude locked, initial and burned items
            }
		}
	};

	wkof.include('ItemData, Menu, Settings');
	wkof.ready('ItemData, Menu, Settings').then(install_menu).then(install_settings).then(getItems).then(getLeechScores).then(updatePage).then(toggleExistingItemsTables);

    //------------------------------
	// Styling
	//------------------------------
    var leechTableCss = `
        .noLeeches {
            margin: 0 0 20px 0;
        }
        .radicalCharacterImgSize {
            font-size: 12px;
        }
        /*TOOLTIP*/

        [tooltip]:hover:before {
            /* needed - do not touch */
            opacity: 1;

            /* customizable */
            background: yellow;
            margin-top: -50px;
            margin-left: 20px;
        }

        [tooltip]:not([tooltip-persistent]):before {
            pointer-events: none;
        }

        a.tooltipImg strong {line-height:30px;}
        a.tooltipImg span {
            z-index:10;display:none; padding:7px 10px;
            margin-top:30px; margin-left:-160px;
            width:300px; line-height:16px;
        }
        a.tooltipImg:hover span{
            display:inline; position:absolute;
            border:2px solid #FFF;  color:#EEE;
            background:#333 url(https://cdn.wanikani.com/default-avatar-300x300-20121121.png) repeat-x 0 0;
        }

        .callout {z-index:20;position:absolute;border:0;top:-14px;left:120px;}

        a.tooltipImg span
        {
            border-radius:2px;
            box-shadow: 0px 0px 8px 4px #666;
            /*opacity: 0.8;*/
        }
        a.tooltipImg:before {
            pointer-events: none;
        }
        /*END TOOLTIP*/

        /*makes space*/
        #leech-table:after{
            clear: none;
        }
        #leaderboard:after{
            clear: none;
        }`;

    var leechStyling = document.createElement('style');
    leechStyling.type='text/css';
    if(leechStyling.styleSheet){
        leechStyling.styleSheet.cssText = leechTableCss;
    }else{
        leechStyling.appendChild(document.createTextNode(leechTableCss));
    }
    document.getElementsByTagName('head')[0].appendChild(leechStyling);

    //------------------------------
	// Menu
	//------------------------------
    var settings_dialog;
    var defaults = {
        totalNumberOfLeeches: 30,
        leechesPerTable: 10,
        leechThreshold: 1,
        newlyUnlockedItems: false,
        criticalConditionsItems: false,
        newlyBurnedItems: false,
    };

    function install_menu() {
        wkof.Menu.insert_script_link({
            script_id: 'Leech_Tables',
            name: 'Leech_Tables',
            submenu:   'Settings',
            title:     'Leech Tables',
            on_click:  open_settings
        });
    }

    function open_settings() {
        settings_dialog.open();
    }

    function install_settings() {
        settings_dialog = new wkof.Settings({
            script_id: 'Leech_Tables',
            name: 'Leech_Tables',
            title: 'Leech Tables',
            on_save: process_settings,
            settings: {
                'totalNumberOfLeeches': {type:'dropdown',label:'Total number of leeches',hover_tip: 'The amount of leeches you want to display',default:defaults.totalNumberOfLeeches,
                                         content:{5:'5 (Min)', 10:'10', 15:'15', 20:'20', 25:'25', 30:'30 (default)', 35:'35', 40:'40', 45:'45', 50:'50', 100:'100', 200:'200'}},
                'leechesPerTable': {type:'dropdown',label:'Number of leeches per table',hover_tip: 'Defines how many leeches will be included per table',default:defaults.leechesPerTable,
                                    content:{10:'10 (default)', 15:'15', 20:'20', 25:'25', 30:'30', 35:'35', 40:'40'}},
                'leechThreshold': {type:'dropdown',label:'Leech threshold',hover_tip: 'Determine yourself what is and isn\'t a leech',default:defaults.leechThreshold,
                                   content:{1:'1 (default)', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9', 10:'10', 100:'100'}},
                'newlyUnlockedItems': {type:'checkbox',hover_tip: 'If selected removes the \'newly unlocked items\' table',label:'Disable newly unlocked items',default:defaults.newlyUnlockedItems},
                'criticalConditionsItems': {type:'checkbox',hover_tip: 'If selected removes the \'critical conditions items\' table',label:'Disable critical conditions items',default:defaults.criticalConditionsItems},
                'newlyBurnedItems': {type:'checkbox',hover_tip: 'If selected removes the \'newly burned items\' table',label:'Disable newly burned items',default:defaults.newlyBurnedItems}
            }
        });
        settings_dialog.load().then(function(){
            wkof.settings.Leech_Tables = $.extend(true, {}, defaults,wkof.settings.Leech_Tables);
            settings_dialog.save();
        });
    }
    function process_settings(){
        settings_dialog.save();
        //refresh leech tables
        getItems().then(getLeechScores).then(updatePage);
        toggleExistingItemsTables();
    }

    //------------------------------
	// Leech List
	//------------------------------
	function getItems() {
		return wkof.ItemData.get_items(config);
	}

	function getLeechScores(items) {
		return items.filter(isLeech);
	}

	function isLeech(item) {
		if (item.review_statistics === undefined) {
			return false;
		}

		let reviewStats = item.review_statistics;
		let meaningScore = getLeechScore(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak);
		let readingScore = getLeechScore(reviewStats.reading_incorrect, reviewStats.reading_current_streak);

        item.leech_score = Math.max(meaningScore, readingScore);
		return item.leech_score >= parseFloat(wkof.settings.Leech_Tables.leechThreshold);
	}

	function getLeechScore(incorrect, currentStreak) {
        //get incorrect number than lessen it using the user's correctStreak
        let leechScore = incorrect / Math.pow((currentStreak || 0.5), 1.5); // '||' => if currentstreak zero make 0.5 instead (prevents dividing by zero)
        leechScore = Math.round(leechScore * 100) / 100; //round to two decimals
		return leechScore;
	}

	function updatePage(items) {
        //sort by leechscore, if score equal sort by level ascending
        items = items.sort(function(a, b){return (a.leech_score == b.leech_score) ? a.data.level - b.data.level : b.leech_score - a.leech_score}).slice(0, parseInt(wkof.settings.Leech_Tables.totalNumberOfLeeches));

        createTopLeechTables(items);
	}

    function itemsCharacterCallback (itemsData){
        //check if an item has characters. Kanji and vocabulary will always have these but wk-specific radicals (e.g. gun, leaf, stick) use images instead
        if(itemsData.characters!= null) {
            return itemsData.characters;
        } else if (itemsData.character_images!= null){
            return '<i class="radical-'+itemsData.slug+' radicalCharacterImgSize"></i>';
            //return '<img class="radical-img" src="https://cdn.wanikani.com/subjects/images/8786-worm-small.png">'
        } else {
            //if both characters and character_images are somehow absent try using slug instead
            return itemsData.slug;
        }
    }

    function createTopLeechTables(items) {
        let sectionContents = "";
        let numberPerTable = parseInt(wkof.settings.Leech_Tables.leechesPerTable);
        let startnumberTable = 0;
        let endNumberTable = numberPerTable;
        let nrOfTables = 3;
        let noLeechesFoundMessage = 'There are no leeches available. Have you tried lowering the leechthreshold?';
        let noLeechesFoundStyling = '';

        //make sure we don't create empty tables if there are too few leeches
        if(items.length == 0){ //if no leeches
            nrOfTables = 0;
            //if threshold already at the lowest then change message to no longer request they lower it
            if(wkof.settings.Leech_Tables.leechThreshold <= 1){
                noLeechesFoundMessage = 'You have no leeches at the moment.';
            }
            noLeechesFoundStyling = 'alert fade in noLeeches';
            sectionContents += noLeechesFoundMessage;
        } else if(items.length < wkof.settings.Leech_Tables.totalNumberOfLeeches) { //if less leeches available then user requested
            var ratio = items.length / (numberPerTable*3);
            if(ratio <= 0.34){
                nrOfTables = 1;
            } else if(ratio <= 0.67){
                nrOfTables = 2;
            }
        } else if (numberPerTable >= wkof.settings.Leech_Tables.totalNumberOfLeeches){ //if table capacity greater than user's requested amount of leeches
            nrOfTables = 1;
        }

        //Create leech tables
        for (var i = 0; i < nrOfTables; i++){
            //In case there are less than the requested amount of leeches
            if(items.length <= endNumberTable){
                endNumberTable = items.length; nrOfTables--;
            }
            sectionContents += `
                <div class="span4">
                    <section class="kotoba-table-list dashboard-sub-section" style="position: relative;">
                        <h3 class="small-caps">Top Leeches ${startnumberTable+1}-${endNumberTable}</h3>
                            <table>
                                <tbody>`;
            for (var j = startnumberTable; j < endNumberTable; j++){
                sectionContents += `<tr class="${items[j].object}">
                                        <td tooltip="${items[j].data.meanings[0].meaning} ${items[j].data.readings !== undefined ? ', '+items[j].data.readings[0].reading : ""}">
                                            <a href="${items[j].data.document_url}"><span lang="ja">${itemsCharacterCallback(items[j].data)}</span><span class="pull-right">${items[j].leech_score}</span></a>
                                        </td>
                                    </tr>`;
            }
            //preparing for next table
            startnumberTable += numberPerTable;
            endNumberTable += numberPerTable;

            sectionContents += `
                                </tbody>
                            </table>
                    </section>
                </div>`;
        }

        let leechTableStyle = '<div id="leech_table" class="row '+noLeechesFoundStyling+'">'
        sectionContents += `</div>`;

        //check if a leech table is already there
        if(document.getElementById("leech_table")) {
            sectionContents = leechTableStyle + sectionContents;
            $('#leech_table ').replaceWith(sectionContents);//replace existing list
        } else {
            if ($('section.progression').length) {
                $('section.progression').after(leechTableStyle);
            }
            else {
                $('section.srs-progress').after(leechTableStyle);
            }
            $('#leech_table ').append(sectionContents);
        }

        //eventlisteners
        //document.getElementById('leech_table-stats').addEventListener('click', test);
    }

    //------------------------------
	// New Unlocks, Critical Condition and Newly Burned Items
	//------------------------------
    function toggleExistingItemsTables(){
        let newlyUnlockedItemTable = document.querySelector(".span4 > .recent-unlocks");
        let criticalItemTable = document.querySelector(".span4 > .low-percentage");
        let newlyBurnedItemTable = document.querySelector(".span4 > .recent-retired");

        if(wkof.settings.Leech_Tables.newlyUnlockedItems){
            newlyUnlockedItemTable.closest("div").style.display = "none";
        }else {
            newlyUnlockedItemTable.closest("div").style.display = "block";
        }
        if(wkof.settings.Leech_Tables.criticalConditionsItems){
            criticalItemTable.closest("div").style.display = "none";
        }else {
            criticalItemTable.closest("div").style.display = "block";
        }
        if(wkof.settings.Leech_Tables.newlyBurnedItems){
            newlyBurnedItemTable.closest("div").style.display = "none";
        }else {
            newlyBurnedItemTable.closest("div").style.display = "block";
        }
    }

})();