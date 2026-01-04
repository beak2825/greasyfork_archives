// ==UserScript==
// @name         Wanikani 2 Cool 4 Progress
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Are you level 60? Psssh! You don't have time for any of those silly progress bars! Get rid of 'em with this neat script!
// @author       Pep95
// @require      https://code.jquery.com/jquery-3.3.1.min.js#sha256=FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=
// @include      https://www.wanikani.com/dashboard
// @include      https://www.wanikani.com/
// @grant	     none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389831/Wanikani%202%20Cool%204%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/389831/Wanikani%202%20Cool%204%20Progress.meta.js
// ==/UserScript==

/*
jshint esversion: 6
*/

(function() {
    'use strict';

    console.log('Function starts');

    let dom = {};
    dom.$ = window.jQuery.noConflict(true);


    if (!window.wkof) {
        let response = confirm('WaniKani Dashboard 2 Cool 4 Progress script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }

        return;
    }

    const config = {
        wk_items: {
            options: {
                review_statistics: true,
                assignments: true,
            },
            filter: {
                level: '1..+0',
                srs: '1..8'
            }
        }
    };

    wkof.include('Menu,Settings,ItemData');
    wkof.ready('Menu,Settings,ItemData').then(load_settings).then(install_menu).then(getItems).then(determineRatio).then(createBar);


    function getItems() {
        return wkof.ItemData.get_items(config);
    }

    function getSrsStage(assignments) {
		return assignments.srs_stage;
	}

    function determineRatio(items) {
		let itemsBySrs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((result, srs) => {
			result[srs] = {
				total: 0,
				leech: 0
			};

			return result;
		}, {});

		items.forEach(function(item) {
			let srsStage = (item.assignments ? getSrsStage(item.assignments) : 0);
			itemsBySrs[srsStage].total++;

		});

		return itemsBySrs;
    }

    function createBar(itemsBySrs) {

        ////////////////////////////////////
        //Calculate Widths And Margin-Left//
        ////////////////////////////////////

        let widths = new Array();
        let widthsRem = new Array();
        let widthsText = new Array();
        let widthsTextRem = new Array();
        let widthsDispText = new Array();
        let widthsDispTextTitle = new Array();
        var i;

        if (wkof.settings.total_progression.Subsection) {
            let AllItems = itemsBySrs[0].total + itemsBySrs[1].total + itemsBySrs[2].total + itemsBySrs[3].total + itemsBySrs[4].total + itemsBySrs[5].total + itemsBySrs[6].total + itemsBySrs[7].total + itemsBySrs[8].total + itemsBySrs[9].total;
            widths[0] = 100*itemsBySrs[0].total/AllItems;
            widthsText[0] = widths[0] + "%";
            if (widths[0] > 3.8) {
                widthsDispText[0] = widths[0].toFixed(2) + "%";
            } else {
                widthsDispText[0] = "";
            }
            for (i = 1; i < 10; i++) {
                widths[i] = 100*itemsBySrs[i].total/AllItems;
                widthsText[i] = widths[i] + "%";
                if (widths[i] > 3.8) {
                    widthsDispText[i] = widths[i].toFixed(2) + "%";
                } else {
                    widthsDispText[i] = "";
                }
            }
            if (wkof.settings.total_progression.ReverseOrder) {
                widthsRem[9] = 0;
                widthsTextRem[9] = widthsRem[9] + "%";
                for (i = 1; i < 10; i++) {
                    widthsRem[9-i] = widths[10-i] + widthsRem[10-i];
                    widthsTextRem[9-i] = widthsRem[9-i] + "%";
                }
            } else {
                widthsRem[0] = 0;
                widthsTextRem[0] = widthsRem[0] + "%";
                for (i = 1; i < 10; i++) {
                    widthsRem[i] = widths[i-1] + widthsRem[i-1];
                    widthsTextRem[i] = widthsRem[i] + "%";
                }
            }
        } else {
            let itemsBySrsNoSub = [];
            itemsBySrsNoSub[0] = itemsBySrs[0].total;
            itemsBySrsNoSub[1] = itemsBySrs[1].total + itemsBySrs[2].total + itemsBySrs[3].total + itemsBySrs[4].total;
            itemsBySrsNoSub[2] = itemsBySrs[5].total + itemsBySrs[6].total;
            itemsBySrsNoSub[3] = itemsBySrs[7].total;
            itemsBySrsNoSub[4] = itemsBySrs[8].total;
            itemsBySrsNoSub[5] = itemsBySrs[9].total;
            let AllItems = itemsBySrsNoSub[0] + itemsBySrsNoSub[1] + itemsBySrsNoSub[2] + itemsBySrsNoSub[3] + itemsBySrsNoSub[4] + itemsBySrsNoSub[5];
            widths[0] = 100*itemsBySrsNoSub[0]/AllItems;
            widthsText[0] = widths[0] + "%";
            if (widths[0] > 3.8) {
                widthsDispText[0] = widths[0].toFixed(2) + "%";
            } else {
                widthsDispText[0] = "";
            }
            for (i = 1; i < 6; i++) {
                widths[i] = 100*itemsBySrsNoSub[i]/AllItems;
                widthsText[i] = widths[i] + "%";
                if (widths[i] > 3.8) {
                    widthsDispText[i] = widths[i].toFixed(2) + "%";
                } else {
                    widthsDispText[i] = "";
                }
            }
            if (wkof.settings.total_progression.ReverseOrder) {
                widthsRem[5] = 0;
                widthsTextRem[5] = widthsRem[5] + "%";
                for (i = 1; i < 6; i++) {
                    widthsRem[5-i] = widths[6-i] + widthsRem[6-i];
                    widthsTextRem[5-i] = widthsRem[5-i] + "%";
                }
            } else {
                widthsRem[0] = 0;
                widthsTextRem[0] = widthsRem[0] + "%";
                for (i = 1; i < 6; i++) {
                    widthsRem[i] = widths[i-1] + widthsRem[i-1];
                    widthsTextRem[i] = widthsRem[i] + "%";
                }
            }
        }

        /////////////////
        //Hovertip Text//
        /////////////////

        if (wkof.settings.total_progression.Subsection) {
            widthsDispTextTitle[0] = "Locked/Lessons: " + widths[0].toFixed(2) + "%";
            widthsDispTextTitle[1] = "Apprentice 1: " + widths[1].toFixed(2) + "%";
            widthsDispTextTitle[2] = "Apprentice 2: " + widths[2].toFixed(2) + "%";
            widthsDispTextTitle[3] = "Apprentice 3: " + widths[3].toFixed(2) + "%";
            widthsDispTextTitle[4] = "Apprentice 4: " + widths[4].toFixed(2) + "%";
            widthsDispTextTitle[5] = "Guru 1: " + widths[5].toFixed(2) + "%";
            widthsDispTextTitle[6] = "Guru 2: " + widths[6].toFixed(2) + "%";
            widthsDispTextTitle[7] = "Master: " + widths[7].toFixed(2) + "%";
            widthsDispTextTitle[8] = "Enlightened: " + widths[8].toFixed(2) + "%";
            widthsDispTextTitle[9] = "Burned: " + widths[9].toFixed(2) + "%";
        } else {
            widthsDispTextTitle[0] = "Locked/Lessons: " + widths[0].toFixed(2) + "%";
            widthsDispTextTitle[1] = "Apprentice: " + widths[1].toFixed(2) + "%";
            widthsDispTextTitle[2] = "Guru: " + widths[2].toFixed(2) + "%";
            widthsDispTextTitle[3] = "Master: " + widths[3].toFixed(2) + "%";
            widthsDispTextTitle[4] = "Enlightened: " + widths[4].toFixed(2) + "%";
            widthsDispTextTitle[5] = "Burned: " + widths[5].toFixed(2) + "%";
        }

        //////////////////
        //Create Colours//
        //////////////////

        let LockedLessonColor = "";
        let Apprentice1Color = "";
        let Apprentice2Color = "";
        let Apprentice3Color = "";
        let Apprentice4Color = "";
        let Guru1Color = "";
        let Guru2Color = "";
        let MasterColor = "";
        let EnlightenedColor = "";
        let BurnColor = "";
        let AutoFade = 0;

        /////////////////
        //Apply Presets//
        /////////////////

        switch (wkof.settings.total_progression.Presets){
            case '0':
                LockedLessonColor = wkof.settings.total_progression.LockedLessonColor;
                Apprentice1Color = wkof.settings.total_progression.Apprentice1Color;
                Apprentice2Color = wkof.settings.total_progression.Apprentice2Color;
                Apprentice3Color = wkof.settings.total_progression.Apprentice3Color;
                Apprentice4Color = wkof.settings.total_progression.Apprentice4Color;
                Guru1Color = wkof.settings.total_progression.Guru1Color;
                Guru2Color = wkof.settings.total_progression.Guru2Color;
                MasterColor = wkof.settings.total_progression.MasterColor;
                EnlightenedColor = wkof.settings.total_progression.EnlightenedColor;
                BurnColor = wkof.settings.total_progression.BurnColor;
                AutoFade = wkof.settings.total_progression.AutoFade;
                break;
            case '1':
                wkof.settings.total_progression.LockedLessonColor = "#545454";
                wkof.settings.total_progression.Apprentice1Color = "#ffe0f4";
                wkof.settings.total_progression.Apprentice2Color = "#ff80d4";
                wkof.settings.total_progression.Apprentice3Color = "#ff33bb";
                wkof.settings.total_progression.Apprentice4Color = "#f500a3";
                wkof.settings.total_progression.Guru1Color = "#b95bd1";
                wkof.settings.total_progression.Guru2Color = "#a035bb";
                wkof.settings.total_progression.MasterColor = "#3a5bde";
                wkof.settings.total_progression.EnlightenedColor = "#009EEE";
                wkof.settings.total_progression.BurnColor = "#fab623";
                wkof.settings.total_progression.AutoFade = 0;
                LockedLessonColor = "#545454";
                Apprentice1Color = "#ffe0f4";
                Apprentice2Color = "#ff80d4";
                Apprentice3Color = "#ff33bb";
                Apprentice4Color = "#f500a3";
                Guru1Color = "#b95bd1";
                Guru2Color = "#a035bb";
                MasterColor = "#3a5bde";
                EnlightenedColor = "#009EEE";
                BurnColor = "#fab623";
                AutoFade = 0;
                break;
            case '2':
                wkof.settings.total_progression.LockedLessonColor = "#545454";
                wkof.settings.total_progression.Apprentice1Color = "#a2d3fd";
                wkof.settings.total_progression.Apprentice2Color = "#7ec0f9";
                wkof.settings.total_progression.Apprentice3Color = "#50abf9";
                wkof.settings.total_progression.Apprentice4Color = "#2f98f3";
                wkof.settings.total_progression.Guru1Color = "#7edcb8";
                wkof.settings.total_progression.Guru2Color = "#30dc9a";
                wkof.settings.total_progression.MasterColor = "#c9ce3a";
                wkof.settings.total_progression.EnlightenedColor = "#f67301";
                wkof.settings.total_progression.BurnColor = "#da4453";
                wkof.settings.total_progression.AutoFade = 0;
                LockedLessonColor = "#545454";
                Apprentice1Color = "#a2d3fd";
                Apprentice2Color = "#7ec0f9";
                Apprentice3Color = "#50abf9";
                Apprentice4Color = "#2f98f3";
                Guru1Color = "#7edcb8";
                Guru2Color = "#30dc9a";
                MasterColor = "#c9ce3a";
                EnlightenedColor = "#f67301";
                BurnColor = "#da4453";
                AutoFade = 0;
                break;
            default:
                break;
        }

        /////////////
        //Auto-Fade//
        /////////////

        var part3 = 5/6;
        var part2 = 4/6;
        var part1 = 3/6;

        if (wkof.settings.total_progression.AutoFade == 1) {
            wkof.settings.total_progression.Apprentice3Color = rgb2hex(255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Apprentice4Color,1))*part3),255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Apprentice4Color,2))*part3),255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Apprentice4Color,3))*part3));
            wkof.settings.total_progression.Apprentice2Color = rgb2hex(255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Apprentice4Color,1))*part2),255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Apprentice4Color,2))*part2),255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Apprentice4Color,3))*part2));
            wkof.settings.total_progression.Apprentice1Color = rgb2hex(255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Apprentice4Color,1))*part1),255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Apprentice4Color,2))*part1),255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Apprentice4Color,3))*part1));
            wkof.settings.total_progression.Guru1Color = rgb2hex(255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Guru2Color,1))*part2),255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Guru2Color,2))*part2),255-Math.round((255-hex2rorgorb(wkof.settings.total_progression.Guru2Color,3))*part2));
        }

        ///////////////////////////////////
        //Actually Finally Create The Bar//
        ///////////////////////////////////

		let MyBar

        if (wkof.settings.total_progression.PercentagePosition == 1) {
            if (wkof.settings.total_progression.Subsection) {
                MyBar = `<div class="removeit" style="height: 30px; width: 100%; position: relative; margin-bottom: 12px; border-radius: 6px; overflow: hidden">
<div title="${widthsDispTextTitle[0]}" style="height: 30px; width: ${widthsText[0]}; background-color: ${LockedLessonColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[0]};"> ${widthsDispText[0]} </div>
<div title="${widthsDispTextTitle[1]}" style="height: 30px; width: ${widthsText[1]}; background-color: ${Apprentice1Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[1]};"> ${widthsDispText[1]} </div>
<div title="${widthsDispTextTitle[2]}" style="height: 30px; width: ${widthsText[2]}; background-color: ${Apprentice2Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[2]};"> ${widthsDispText[2]} </div>
<div title="${widthsDispTextTitle[3]}" style="height: 30px; width: ${widthsText[3]}; background-color: ${Apprentice3Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[3]};"> ${widthsDispText[3]} </div>
<div title="${widthsDispTextTitle[4]}" style="height: 30px; width: ${widthsText[4]}; background-color: ${Apprentice4Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[4]};"> ${widthsDispText[4]} </div>
<div title="${widthsDispTextTitle[5]}" style="height: 30px; width: ${widthsText[5]}; background-color: ${Guru1Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[5]};"> ${widthsDispText[5]} </div>
<div title="${widthsDispTextTitle[6]}" style="height: 30px; width: ${widthsText[6]}; background-color: ${Guru2Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[6]};"> ${widthsDispText[6]} </div>
<div title="${widthsDispTextTitle[7]}" style="height: 30px; width: ${widthsText[7]}; background-color: ${MasterColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[7]};"> ${widthsDispText[7]} </div>
<div title="${widthsDispTextTitle[8]}" style="height: 30px; width: ${widthsText[8]}; background-color: ${EnlightenedColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[8]};"> ${widthsDispText[8]} </div>
<div title="${widthsDispTextTitle[9]}" style="height: 30px; width: ${widthsText[9]}; background-color: ${BurnColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[9]};"> ${widthsDispText[9]} </div>
</div>`;
            } else {
                MyBar = `<div class="removeit" style="height: 30px; width: 100%; position: relative; margin-bottom: 12px; border-radius: 6px; overflow: hidden">
<div title="${widthsDispTextTitle[0]}" style="height: 30px; width: ${widthsText[0]}; background-color: ${LockedLessonColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[0]};"> ${widthsDispText[0]} </div>
<div title="${widthsDispTextTitle[1]}" style="height: 30px; width: ${widthsText[1]}; background-color: ${Apprentice4Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[1]};"> ${widthsDispText[1]} </div>
<div title="${widthsDispTextTitle[2]}" style="height: 30px; width: ${widthsText[2]}; background-color: ${Guru2Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[2]};"> ${widthsDispText[2]} </div>
<div title="${widthsDispTextTitle[3]}" style="height: 30px; width: ${widthsText[3]}; background-color: ${MasterColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[3]};"> ${widthsDispText[3]} </div>
<div title="${widthsDispTextTitle[4]}" style="height: 30px; width: ${widthsText[4]}; background-color: ${EnlightenedColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[4]};"> ${widthsDispText[4]} </div>
<div title="${widthsDispTextTitle[5]}" style="height: 30px; width: ${widthsText[5]}; background-color: ${BurnColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[5]};"> ${widthsDispText[5]} </div>
</div>`;
            }
        } else if (wkof.settings.total_progression.PercentagePosition == 2) {
            if (wkof.settings.total_progression.Subsection) {
                MyBar = `<div class="removeit" style="height: 30px; width: 100%; position: relative; margin-top: 12px; border-radius: 6px; overflow: hidden">
<div title="${widthsDispTextTitle[0]}" style="height: 30px; width: ${widthsText[0]}; background-color: ${LockedLessonColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[0]};"> ${widthsDispText[0]} </div>
<div title="${widthsDispTextTitle[1]}" style="height: 30px; width: ${widthsText[1]}; background-color: ${Apprentice1Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[1]};"> ${widthsDispText[1]} </div>
<div title="${widthsDispTextTitle[2]}" style="height: 30px; width: ${widthsText[2]}; background-color: ${Apprentice2Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[2]};"> ${widthsDispText[2]} </div>
<div title="${widthsDispTextTitle[3]}" style="height: 30px; width: ${widthsText[3]}; background-color: ${Apprentice3Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[3]};"> ${widthsDispText[3]} </div>
<div title="${widthsDispTextTitle[4]}" style="height: 30px; width: ${widthsText[4]}; background-color: ${Apprentice4Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[4]};"> ${widthsDispText[4]} </div>
<div title="${widthsDispTextTitle[5]}" style="height: 30px; width: ${widthsText[5]}; background-color: ${Guru1Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[5]};"> ${widthsDispText[5]} </div>
<div title="${widthsDispTextTitle[6]}" style="height: 30px; width: ${widthsText[6]}; background-color: ${Guru2Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[6]};"> ${widthsDispText[6]} </div>
<div title="${widthsDispTextTitle[7]}" style="height: 30px; width: ${widthsText[7]}; background-color: ${MasterColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[7]};"> ${widthsDispText[7]} </div>
<div title="${widthsDispTextTitle[8]}" style="height: 30px; width: ${widthsText[8]}; background-color: ${EnlightenedColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[8]};"> ${widthsDispText[8]} </div>
<div title="${widthsDispTextTitle[9]}" style="height: 30px; width: ${widthsText[9]}; background-color: ${BurnColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[9]};"> ${widthsDispText[9]} </div>
</div>`;
            } else {
                MyBar = `<div class="removeit" style="height: 30px; width: 100%; position: relative; margin-top: 12px; border-radius: 6px; overflow: hidden">
<div title="${widthsDispTextTitle[0]}" style="height: 30px; width: ${widthsText[0]}; background-color: ${LockedLessonColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[0]};"> ${widthsDispText[0]} </div>
<div title="${widthsDispTextTitle[1]}" style="height: 30px; width: ${widthsText[1]}; background-color: ${Apprentice4Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[1]};"> ${widthsDispText[1]} </div>
<div title="${widthsDispTextTitle[2]}" style="height: 30px; width: ${widthsText[2]}; background-color: ${Guru2Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[2]};"> ${widthsDispText[2]} </div>
<div title="${widthsDispTextTitle[3]}" style="height: 30px; width: ${widthsText[3]}; background-color: ${MasterColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[3]};"> ${widthsDispText[3]} </div>
<div title="${widthsDispTextTitle[4]}" style="height: 30px; width: ${widthsText[4]}; background-color: ${EnlightenedColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[4]};"> ${widthsDispText[4]} </div>
<div title="${widthsDispTextTitle[5]}" style="height: 30px; width: ${widthsText[5]}; background-color: ${BurnColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 30px; color: #efefef; margin-left: ${widthsTextRem[5]};"> ${widthsDispText[5]} </div>
</div>`;
            }
        } else if (wkof.settings.total_progression.PercentagePosition == 3) {
            if (wkof.settings.total_progression.Subsection) {
                MyBar = `<div class="removeit" style="height: 36px; border-radius: 36px; overflow: hidden; width: 100%; margin-top: 20px; margin-bottom: 20px; position: relative;">
<div title="${widthsDispTextTitle[0]}" style="height: 36px; width: ${widthsText[0]}; background-color: ${LockedLessonColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[0]};"> ${widthsDispText[0]} </div>
<div title="${widthsDispTextTitle[1]}" style="height: 36px; width: ${widthsText[1]}; background-color: ${Apprentice1Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[1]};"> ${widthsDispText[1]} </div>
<div title="${widthsDispTextTitle[2]}" style="height: 36px; width: ${widthsText[2]}; background-color: ${Apprentice2Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[2]};"> ${widthsDispText[2]} </div>
<div title="${widthsDispTextTitle[3]}" style="height: 36px; width: ${widthsText[3]}; background-color: ${Apprentice3Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[3]};"> ${widthsDispText[3]} </div>
<div title="${widthsDispTextTitle[4]}" style="height: 36px; width: ${widthsText[4]}; background-color: ${Apprentice4Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[4]};"> ${widthsDispText[4]} </div>
<div title="${widthsDispTextTitle[5]}" style="height: 36px; width: ${widthsText[5]}; background-color: ${Guru1Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[5]};"> ${widthsDispText[5]} </div>
<div title="${widthsDispTextTitle[6]}" style="height: 36px; width: ${widthsText[6]}; background-color: ${Guru2Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[6]};"> ${widthsDispText[6]} </div>
<div title="${widthsDispTextTitle[7]}" style="height: 36px; width: ${widthsText[7]}; background-color: ${MasterColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[7]};"> ${widthsDispText[7]} </div>
<div title="${widthsDispTextTitle[8]}" style="height: 36px; width: ${widthsText[8]}; background-color: ${EnlightenedColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[8]};"> ${widthsDispText[8]} </div>
<div title="${widthsDispTextTitle[9]}" style="height: 36px; width: ${widthsText[9]}; background-color: ${BurnColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[9]};"> ${widthsDispText[9]} </div>
</div>`;
            } else {
                MyBar = `<div class="removeit" style="height: 36px; border-radius: 36px; overflow: hidden; width: 100%; margin-top: 20px; margin-bottom: 20px; position: relative;">
<div title="${widthsDispTextTitle[0]}" style="height: 36px; width: ${widthsText[0]}; background-color: ${LockedLessonColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[0]};"> ${widthsDispText[0]} </div>
<div title="${widthsDispTextTitle[1]}" style="height: 36px; width: ${widthsText[1]}; background-color: ${Apprentice4Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[1]};"> ${widthsDispText[1]} </div>
<div title="${widthsDispTextTitle[2]}" style="height: 36px; width: ${widthsText[2]}; background-color: ${Guru2Color}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[2]};"> ${widthsDispText[2]} </div>
<div title="${widthsDispTextTitle[3]}" style="height: 36px; width: ${widthsText[3]}; background-color: ${MasterColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[3]};"> ${widthsDispText[3]} </div>
<div title="${widthsDispTextTitle[4]}" style="height: 36px; width: ${widthsText[4]}; background-color: ${EnlightenedColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[4]};"> ${widthsDispText[4]} </div>
<div title="${widthsDispTextTitle[5]}" style="height: 36px; width: ${widthsText[5]}; background-color: ${BurnColor}; position: absolute; text-align: center; vertical-align: middle; line-height: 36px; color: #efefef; margin-left: ${widthsTextRem[5]};"> ${widthsDispText[5]} </div>
</div>`;
            }
        }

        let testblock = `<div style="height : 1000px; width : 1000px; background-color: green"></div>`
        if (wkof.settings.total_progression.PercentagePosition == 1) {
            dom.$('.removeit').remove();
            dom.$('.srs-progress').before(MyBar);
            if (wkof.settings.total_progression.RemoveProgression) {
                dom.$('.radicals-progress').css("display","none");
                dom.$('.kanji-progress').css("display","none");
                dom.$('.wk-panel--level-progress').css("display","none");
            } else {
                dom.$('.wk-panel--level-progress').css("display","block");
                dom.$('.radicals-progress').css("display","block");
                dom.$('.kanji-progress').css("display","block");
            }
        } else if (wkof.settings.total_progression.PercentagePosition == 2) {
            dom.$('.removeit').remove();
            dom.$('.srs-progress').after(MyBar);
            if (wkof.settings.total_progression.RemoveProgression) {
                dom.$('.radicals-progress').css("display","none");
                dom.$('.kanji-progress').css("display","none");
                dom.$('.wk-panel--level-progress').css("display","none");
            } else {
                dom.$('.wk-panel--level-progress').css("display","block");
                dom.$('.radicals-progress').css("display","block");
                dom.$('.kanji-progress').css("display","block");
            }
        } else if (wkof.settings.total_progression.PercentagePosition == 3) {
            if (wkof.settings.total_progression.RemoveProgression) {
                dom.$('.removeit').remove();
                dom.$('.wk-panel--level-progress').html(MyBar);
                dom.$('.wk-panel--level-progress').prepend(`<h3 class="removeit" style="font-size: var(--font-size-medium); line-height:var(--title-line-height); margin-bottom: 0px;">Post-60 Progress Bar</h3>`);
                dom.$('.wk-panel--level-progress').css("display","block");
                dom.$('.kanji-progress').css("display","none");
                dom.$('.radicals-progress').css("display","none");
            } else {
                dom.$('.removeit').remove();
                dom.$('.wk-panel--level-progress').prepend(`<hr class="removeit" style="height:2px; border-width:0; background-color: #ECECEC;">`);
                dom.$('.wk-panel--level-progress').prepend(MyBar);
                dom.$('.wk-panel--level-progress').prepend(`<h3 class="removeit" style="font-size: var(--font-size-medium); line-height:var(--title-line-height); margin-bottom: 0px;">Total Progress Bar</h3>`);
                dom.$('.wk-panel--level-progress').css("display","block");
                dom.$('.radicals-progress').css("display","block");
                dom.$('.kanji-progress').css("display","block");
            }
        }
    }

    function hex2rorgorb(hexin,rgb) {
        var col = 0;
        var hexpart1 = hexin.substr(2*rgb-1, 1);
        var hexpart2 = hexin.substr(2*rgb, 1);
        switch(hexpart1){
            case "a":
                col = 160;
                break;
            case "b":
                col = 176;
                break;
            case "c":
                col = 192;
                break;
            case "d":
                col = 208;
                break;
            case "e":
                col = 224;
                break;
            case "f":
                col = 240;
                break;
            default:
                col = parseInt(hexpart1*16);
                break;
        }
        switch(hexpart2){
            case "a":
                col = col + 10;
                break;
            case "b":
                col = col + 11;
                break;
            case "c":
                col = col + 12;
                break;
            case "d":
                col = col + 13;
                break;
            case "e":
                col = col + 14;
                break;
            case "f":
                col = col + 15;
                break;
            default:
                col = col + parseInt(hexpart2);
                break;
        }

//         console.log(hexin + ", " + hexpart1 + ", " + hexpart2 + ", " + col)
        return col;
    }

    function num2hex(hexin) {
        var col = "";
        switch(hexin){
            case 15:
                col = "f";
                break;
            case 14:
                col = "e";
                break;
            case 13:
                col = "d";
                break;
            case 12:
                col = "c";
                break;
            case 11:
                col = "b";
                break;
            case 10:
                col = "a";
                break;
            default:
                col = hexin.toString();
                break;
        }
        return col;
    }

    function rgb2hex(rcol, gcol, bcol){
        var firrcol = 0;
        var secrcol = 0;
        var firgcol = 0;
        var secgcol = 0;
        var firbcol = 0;
        var secbcol = 0;
        var hexout = "";
        firrcol = Math.floor(rcol/16);
        secrcol = rcol - firrcol*16;
        firgcol = Math.floor(gcol/16);
        secgcol = gcol - firgcol*16;
        //console.log(gcol + ", " + firgcol + ", " + secgcol)
        firbcol = Math.floor(bcol/16);
        secbcol = bcol - firbcol*16;
        hexout = "#" + num2hex(firrcol) + num2hex(secrcol) + num2hex(firgcol) + num2hex(secgcol) + num2hex(firbcol) + num2hex(secbcol);

        //console.log(rcol + ", " + gcol + ", " + bcol)
        //console.log(hexout)
        return hexout;
    }

    // Fetches items and updates display
		function fetch_and_update() {
            fetch_items().then(getItems).then(determineRatio).then(createBar)
		}

		// Fetches the relevant items
		function fetch_items() {
				var [promise, resolve] = new_promise();
				var config = {
						wk_items: {
								options: {assignments: true},
								filters: {level: "1..+0"}
						}
				};
				wkof.ItemData.get_items(config).then(resolve);
				return promise;
		}

		// Load settings and set defaults
		function load_settings() {
            var defaults = {
                RemoveProgression: 'true',
                PercentagePosition: '3',
                ReverseOrder: 'false',
                Subsection: 'true',
                Presets: '0',
                AutoFade: 'true',
                LockedLessonColor: '#545454',
                Apprentice1Color: '#ffe0f4',
                Apprentice2Color:  '#ff80d4',
                Apprentice3Color:  '#ff33bb',
                Apprentice4Color: '#f500a3',
                Guru1Color: '#b95bd1',
                Guru2Color: '#a035bb',
                MasterColor: '#3a5bde',
                EnlightenedColor: '#009eee',
                BurnColor: '#fab623'
            };
            return wkof.Settings.load('total_progression', defaults);
        }

    // Installs the options button in the menu
        function install_menu() {
            var config = {
                name: 'total_progression_settings',
                submenu: 'Settings',
                title: 'Total Progression Bar',
                on_click: open_settings
            };
            wkof.Menu.insert_script_link(config);
        }

		// Create the options
		function open_settings(items) {
            var config = {
                script_id: 'total_progression',
                title: 'Total Progression',
                on_save: fetch_and_update,
                content: {
                    PercentagePosition: {
                        type: 'dropdown',
                        label: 'Position Total Progress Bar',
                        hover_tip: 'Where should the total progress bar be positioned?',
                        default: '3',
                        content: {
                            1: 'Above the SRS Breakdown',
                            2: 'Below the SRS Breakdown',
                            3: 'Inside the Progress Bar Section'
                        }
                    },
                    RemoveProgression: {
                        type: 'checkbox',
                        label: 'Remove Level Progress Bar?',
                        hover_tip: 'Should the Level-Specific Progress Bars for Radicals and Kanji be removed?',
                        default: 'true'
                    },
                    ReverseOrder: {
                        type: 'checkbox',
                        label: 'Reverse Order?',
                        hover_tip: 'Reverse the order of the categories',
                        default: 'false'
                    },
                    Subsection: {
                        type: 'checkbox',
                        label: 'Use Subsections?',
                        hover_tip: 'Divide Apprentice and Guru into subsections',
                        default: 'true'
                    },
                    Presets: {
                        type: 'dropdown',
                        label: 'Preset',
                        hover_tip: 'Do you want to use a preset?',
                        default: '0',
                        content: {
                            0: 'Custom',
                            1: 'Wanikani Default (Gold)',
                            2: 'Breeze Dark'
                        }
                    },
                    AutoFade: {
                        type: 'checkbox',
                        label: 'AutoFade',
                        hover_tip: 'Automatically fade Apprentice Colours from Apprentice 4 and Guru Colours from Guru 2.',
                        default: 'true'
                    },
                    LockedLessonColor: {
                        type: 'color',
                        label: 'Locked/Lesson Color',
                        hover_tip: 'The color of Locked/Lesson Items',
                        default: '#545454'
                    },
                    Apprentice1Color: {
                        type: 'color',
                        label: 'Apprentice 1 Color',
                        hover_tip: 'The color of Apprentice 1 Items',
                        default: '#ffe0f4'
                    },
                    Apprentice2Color: {
                        type: 'color',
                        label: 'Apprentice 2 Color',
                        hover_tip: 'The color of Apprentice 2 Items',
                        default: '#ff80d4'
                    },
                    Apprentice3Color: {
                        type: 'color',
                        label: 'Apprentice 3 Color',
                        hover_tip: 'The color of Apprentice 3 Items',
                        default: '#ff33bb'
                    },
                    Apprentice4Color: {
                        type: 'color',
                        label: 'Apprentice 4 Color',
                        hover_tip: 'The color of Apprentice 4 Items',
                        default: '#f500a3'
                    },
                    Guru1Color: {
                        type: 'color',
                        label: 'Guru 1 Color',
                        hover_tip: 'The color of Guru 1 Items',
                        default: '#b95bd1'
                    },
                    Guru2Color: {
                        type: 'color',
                        label: 'Guru 2 Color',
                        hover_tip: 'The color of Guru 2 Items',
                        default: '#a035bb'
                    },
                    MasterColor: {
                        type: 'color',
                        label: 'Master Color',
                        hover_tip: 'Master Items',
                        default: '#3a5bde'
                    },
                    EnlightenedColor: {
                        type: 'color',
                        label: 'Enlightened Color',
                        hover_tip: 'The color of Enlightened Items',
                        default: '#009eee'
                    },
                    BurnColor: {
                        type: 'color',
                        label: 'Burn Color',
                        hover_tip: 'The color of Burn Items',
                        default: '#fab623'
                    }
                }
            }
            var dialog = new wkof.Settings(config);
            dialog.open();
        }

		// Adds the script's CSS to the page
// 		function add_css() {
// 				dom.$('head').append('<style id="Total_Progress_CSS">'+
// 								 '#total_progress {'+
// 								 '    background: #434343;'+
// 								 '    border-radius: 0 0 3px 3px;'+
// 								 '    height: 30px;'+
// 								 '    line-height: 30px;'+
// 								 '    color: rgb(240, 240, 240);'+
// 								 '    font-size: 16px;'+
// 								 '}'+
// 								 '#total_progress > div {'+
// 								 '    width: calc(20% - 1px);'+
// 								 '    display: inline-block;'+
// 								 '    text-align: center;'+
// 								 '}'+
// 								 '#total_progress .level_label {'+
// 								 '    font-weight: bold;'+
// 								 '}'+
// // 								 '.dashboard > .container > .row > .span12 > section.srs-progress {'+
// // 								 '    margin-bottom: 0 !important;'+
// // 								 '}'+
// // 								 '.srs-progress > ul > li {'+
// // 								 '    border-radius: 0 !important;'+
// // 								 '}'+
// 								 '#total_progress.dark_theme {'+
// 								 '    background: #232629;'+
// 								 '    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7), 2px 2px 2px rgba(0, 0, 0, 0.7);'+
// 								 '    margin: 0 3px 3px 3px;'+
// 								 '}'+
// 								 '#total_progress.dark_theme > div:not(:last-child) {'+
// 								 '    border-right: 1px solid #31363b;'+
// 								 '}'+
// 								 '</style>');
// 		}

		// Returns a promise and a resolve function
		function new_promise() {
				var resolve, promise = new Promise((res, rej)=>{resolve = res;});
				return [promise, resolve];
		}

// 		// Handy little function that rfindley wrote. Checks whether the theme is dark.
// 		function is_dark_theme() {
// 				// Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
// 				return $('body').css('background-color').match(/\((.*)\)/)[1].split(',').slice(0,3).map(str => Number(str)).reduce((a, i) => a+i)/(255*3) < 0.5;
// 		}


})();