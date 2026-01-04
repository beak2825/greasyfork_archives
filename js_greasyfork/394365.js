// ==UserScript==
// @name          Wanikani Number of Learned Kanji, Vocab
// @namespace     https://www.wanikani.com
// @description   Shows how many Kanji, Vocabulary, and/or radical items you've learned in the dashboard. See SETTINGS.
// @author        Saimin
// @version       0.8.3
// @include       /^https://(www|preview).wanikani.com/(dashboard)?$/
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/394365/Wanikani%20Number%20of%20Learned%20Kanji%2C%20Vocab.user.js
// @updateURL https://update.greasyfork.org/scripts/394365/Wanikani%20Number%20of%20Learned%20Kanji%2C%20Vocab.meta.js
// ==/UserScript==

// Introduction to this script, explanation of settings, leave feedback:
//   https://community.wanikani.com/t/userscript-number-of-learned-kanji-vocabulary/41042

// some code adapted with thanks from following scripts (which this is compatible with):
// Progress Percentages by Kumirei
//   https://community.wanikani.com/t/userscript-progress-percentages/35080
// SRS and Leech breakdown script by seanblue.
//   https://community.wanikani.com/t/userscript-wanikani-dashboard-srs-and-leech-breakdown/32756


(function() {
    'use strict';

        // --- don't change this (see Settings below) --- //
        const sectionsToPlaceAround = {
            reviewStatus: "review-status",
            srsProgress: "wk-panel wk-panel--level-progress",
            levelProgression: "progression",
        }
        const placements = {
            before: 0,
            after: 1
        }
        // --- don't change above --- //

        // --- SETTINGS (change things here) --- //
        let placeBeforeOrAfterSection = placements.after; // you can change the "before" to "after" to place the section after the section you specify below
        let sectionToPlaceAround = sectionsToPlaceAround.srsProgress; // you can change the "srsProgress" to e.g. "progression" (see above) to place this section before/after the progression section

        let srsStageLearned = 5; // 5: kanji counts as learned when it's Guru+. To set it to apprentice+, set this to 1. burned is 9.
        let srsStageLearnedDescription = "(Guru+)";

        let showKanjiLearned = 1; // set to 0 to not show number of kanji learned
        let showVocabLearned = 1; // set to 0 to not show number of vocabulary items learned
        let showRadicalsLearned = 1; // set to 0 to not show number of radicals learned

        let learnedPrefix = "Learned"; // you can change this to any text. To remove this text completely, set it to "".
        // --- SETTINGS end --- //

    const config = {
        wk_items: {
            options: {
                assignments: true
            }
        }
    };

	if (!window.wkof) {
		let response = confirm('WK Number of Learned Items script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}

		return;
    }


     let style =
		`<style id="number-of-learned-items">
.number-of-learned-items {
	//position: relative;
    margin: 5px 0 5px;
    //grid-column: 1/span 6;
    //grid-row:  / 5;
}

.number-of-learned-items > div {
    border-radius: 3px;
    background: #F4F4F4 !important;
    padding: 5px 0px;
}
.noli-item {
    display: inline-block;
    //width: 40%;
    text-align: left;
}
.noli-first-item {
    margin-left: 20px;
}
.noli span {
    display: inline;
    font-size: 14px;
    border-radius: 5px;
}
.number-of-learned-items .item-description {
    //font-weight: bold;
}
.number-of-learned-items .items-learned-number {
    font-weight: bold;
}

.dashboard section.srs-progress span {
    margin-bottom: 0.0em;
}

</style>`

    const head = document.head;
    head.insertAdjacentHTML( 'beforeend', style);

    if (is_dark_theme()) head.insertAdjacentHTML( 'beforeend', '<style id="number-of-learned-items_dark">'+
    '.number-of-learned-items {'+
    '    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7), 2px 2px 2px rgba(0, 0, 0, 0.7);'+
    '}'+
    '.number-of-learned-items > div {'+
    '    background: #232629 !important;'+
    '}'+
    '.noli-item {'+
    '    color: rgb(240,240,240);'+
    '}'+
    '</style>');

	wkof.include('ItemData');
	wkof.ready('ItemData').then(getItems).then(mapItemsToSrs).then(addNumberOfLearnedItemsSection);

	function getItems(items) {
        return wkof.ItemData.get_items(config);
		//return wkof.ItemData.get_items(config).then(filterToActiveAssignments);
	}

	function filterToActiveAssignments(items) {
		return items.filter(itemIsActiveAssignment);
	}

	function itemIsActiveAssignment(item) {
		let assignments = item.assignments;
		if (assignments === undefined) {
			return false;
		}

		let srsStage = getSrsStage(assignments);

		return srsStage >= 1 && srsStage <= 9;
	}

	function getSrsStage(assignments) {
        if (!assignments) {
            return 0; // not yet learned
        }
		return assignments.srs_stage;
	}

	function mapItemsToSrs(items) {
		let itemsBySrs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((result, srs) => { // stage 0 = not yet learned
			result[srs] = {
                kanji: 0,
                vocab: 0,
                radicals: 0
            };

			return result;
        }, {});
        // separation by srs stage may be necessary in future if we want to show kanji learned per SRS stage etc.

        itemsBySrs.kanjiLearned = 0;
        itemsBySrs.radicalsLearned = 0;
        itemsBySrs.vocabLearned = 0;

        itemsBySrs.totalKanji = 0;
        itemsBySrs.totalRadicals = 0;
        itemsBySrs.totalVocab = 0;

		items.forEach(function(item) {
			let srsStage = getSrsStage(item.assignments);
            if (showKanjiLearned && item.object == 'kanji') {
                itemsBySrs[srsStage].kanji++;
                itemsBySrs.totalKanji++;
                if (srsStage >= srsStageLearned) {
                    itemsBySrs.kanjiLearned++;
                }
            } else if (showVocabLearned && item.object == 'vocabulary') {
                itemsBySrs[srsStage].vocab++;
                itemsBySrs.totalVocab++;
                if (srsStage >= srsStageLearned) {
                    itemsBySrs.vocabLearned++;
                }
            } else if (showRadicalsLearned && item.object == 'radical') {
                itemsBySrs[srsStage].radicals++;
                itemsBySrs.totalRadicals++;
                if (srsStage >= srsStageLearned) {
                    itemsBySrs.radicalsLearned++;
                }
            }
		});

		return itemsBySrs;
	}

	/*function addNumberOfLearnedItemsSection(itemsBySrs) {
        /*let itemInfo = {
            kanjiLearned = 0,
            vocabLearned = 0,
            radicalsLearned = 0,
            totalKanji = 0,
            totalVocab = 0,
            totalRadicals = 0
        }
        let kanjiLearned = 0;
        let vocabLearned = 0;
        let radicalsLearned = 0;

        let totalKanji = 0;
        let totalVocab = 0;
        let totalRadicals = 0;
        for (let i=1; i<=9; i++) { // default: i=5 (guru)
            itemInfo.totalKanji += itemsBySrs[i].kanji;
            itemInfo.totalVocab += itemsBySrs[i].vocab;
            itemInfo.totalRadicals += itemsBySrs[i].radicals;
        }

        if (i >= srsStageLearned) {
            itemInfo.kanjiLearned += itemsBySrs[i].kanji;
            itemInfo.vocabLearned += itemsBySrs[i].vocab;
            itemInfo.radicalsLearned += itemsBySrs[i].radicals;
        }

		return addKanjiAndVocabSection(itemInfo);
	}*/

	function addNumberOfLearnedItemsSection(itemsBySrs) {
        if (learnedPrefix != "") {
            learnedPrefix += "&nbsp;";
        }
        let kanjiLearnedDescription = "Kanji";
        let vocabLearnedDescription = "Vocab items";
        let radicalsLearnedDescription = "Radicals";

        let kanjiLearnedHoverText = `${itemsBySrs.kanjiLearned}/${itemsBySrs.totalKanji} WK-Kanji learned`;
        let vocabLearnedHoverText = `${itemsBySrs.vocabLearned}/${itemsBySrs.totalVocab} WK-Vocab learned`;
        let radicalsLearnedHoverText = `${itemsBySrs.radicalsLearned}/${itemsBySrs.totalRadicals} WK-Radicals learned`;

        // Add elements
		var section = document.createElement('section');
        section.className = 'number-of-learned-items'; // number of learned items

        var list = document.createElement('div');
        list.insertAdjacentHTML( 'beforeend', '<div class="noli-item" id="">'+
            '<span class="noli-item noli-first-item">'+learnedPrefix+'</span></div>');
        if (showKanjiLearned) {
            const separatorSuffix = (showVocabLearned || showRadicalsLearned) ? ",&nbsp;" : "";
            list.insertAdjacentHTML( 'beforeend', '<div class="noli-item" id="" title="'+kanjiLearnedHoverText+'">'+
                '<span class="items-learned-number">'+itemsBySrs.kanjiLearned+'</span>'+
                '<span class="item-description">'+' '+kanjiLearnedDescription+separatorSuffix+'</span></div>');
        }
        if (showVocabLearned) {
            const separatorSuffix = (showRadicalsLearned) ? ",&nbsp;" : "";
            list.insertAdjacentHTML( 'beforeend',
                '<div class="noli-item" id="" title="'+vocabLearnedHoverText+'">'+
                '<span class="items-learned-number">'+itemsBySrs.vocabLearned+'</span>'+
                '<span class="item-description">'+' '+vocabLearnedDescription+separatorSuffix+'</span></div>');
        }
        if (showRadicalsLearned) {
            list.insertAdjacentHTML( 'beforeend', '<div class="noli-item" id="" title="'+radicalsLearnedHoverText+'">'+
                '<span class="items-learned-number">'+itemsBySrs.radicalsLearned+'</span>'+
                '<span class="item-description">'+' '+radicalsLearnedDescription+'</span></div>');
        }
        if (srsStageLearnedDescription != "" && srsStageLearnedDescription != null) {
            list.insertAdjacentHTML( 'beforeend', '<div class="noli-item" id="">'+
            '<span class="noli-item">'+'&nbsp;'+srsStageLearnedDescription+'</span></div>');
        }

        section.appendChild(list);

        const sectionToPlaceAroundElement = document.getElementsByClassName(sectionToPlaceAround)[0];
        if (placeBeforeOrAfterSection == placements.before) {
            sectionToPlaceAroundElement.before(section);
        } else {
            sectionToPlaceAroundElement.after(section);
        }

		return section;
    }

    // Handy little function that rfindley wrote. Checks whether the theme is dark. Fixed to not use jquery.
	function is_dark_theme() {
		// Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
        const style = window.getComputedStyle(document.body);
		return style.getPropertyValue('background-color').match(/\((.*)\)/)[1].split(',').slice(0,3).map(str => Number(str)).reduce((a, i) => a+i)/(255*3) < 0.5;
	}
})();