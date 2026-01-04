// ==UserScript==
// @name          WaniKani Dashboard Leech List Unburnable Edit
// @namespace     https://www.wanikani.com
// @description   Shows top leeches on dashboard (replaces critical items) and all leeches on a dedicated page (replaces critical items)
// @author        ukebox (edited by Pep95)
// @version       2.1.0
// @require       https://code.jquery.com/jquery-3.3.1.min.js#sha256=FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=
// @include       https://www.wanikani.com/dashboard
// @include       https://www.wanikani.com/
// @include       https://www.wanikani.com/critical-items
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/388571/WaniKani%20Dashboard%20Leech%20List%20Unburnable%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/388571/WaniKani%20Dashboard%20Leech%20List%20Unburnable%20Edit.meta.js
// ==/UserScript==

/*
jshint esversion: 6
*/

(function() {
    'use strict';

    let sumval;
    let dom = {};
    dom.$ = jQuery.noConflict(true);

    if (!window.wkof) {
        let response = confirm('WaniKani Dashboard Leech List script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }

        return;
    }

    const leechThreshold = 1;
    const config = {
        wk_items: {
            options: {
                review_statistics: true,
                assignments: true
            },
            filters: {
                srs: {value: '-1,0,9', invert: true}
            }
        }
    };

    const srs_stages = [
        'Initiate',
        'Apprentice 1',
        'Apprentice 2',
        'Apprentice 3',
        'Apprentice 4',
        'Guru 1',
        'Guru 2',
        'Master',
        'Enlightened',
        'Burned'
    ];

    window.wkof.include('Menu,Settings,ItemData');
    window.wkof.ready('Menu,Settings,ItemData').then(load_settings).then(install_menu).then(getItems).then(determineLeeches).then(updatePage);

    function getItems() {
        return window.wkof.ItemData.get_items(config);
    }

    function determineLeeches(items) {
        return items.filter(item => isLeech(item));
    }

    function summer( item ) {
        var sum = 0;
        console.log( "sum1: "+sum+" "+item);
        for( var impcnt in item ) {
            console.log( "sum1: "+sum+" what is item.impcnt: "+item.impcnt );
            if( item.hasOwnProperty( impcnt ) && item.impcnt == 1) {
                sum += parseFloat( item[impcnt] );
                console.log( "sum1: "+sum+" "+item );
            }
        }
        return sum;
    }

    function isLeech(item) {

        if (item.review_statistics === undefined) {
            return false;
        }

        let reviewStats = item.review_statistics;
        let meaningScore = computeLeechScore(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak);
        let readingScore = computeLeechScore(reviewStats.reading_incorrect, reviewStats.reading_current_streak);

        item.leech_score = Math.max(meaningScore, readingScore);

        if (item.assignments.srs_stage == 9) {
            meaningScore = 0;
            readingScore = 0;
        }

        if (meaningScore < readingScore) {
            item.highestincorrect = reviewStats.reading_incorrect;
            item.highestincorrectstreak = reviewStats.reading_current_streak;
        } else {
            item.highestincorrect = reviewStats.meaning_incorrect;
            item.highestincorrectstreak = reviewStats.meaning_current_streak;
        }

        item.mustBurn = (item.highestincorrect - item.highestincorrectstreak) + item.assignments.srs_stage >= 9;

        if (item.mustBurn){
            item.impossible = "不可能";
            item.impcnt = 1;
        } else {
            item.impossible = " ";
            item.impcnt = 0;
        }

        item.srsstagename = srs_stages[item.assignments.srs_stage];

        return meaningScore >= leechThreshold || readingScore >= leechThreshold;
    }

    function computeLeechScore(incorrect, currentStreak) {
        return incorrect / Math.pow((currentStreak || 0.5), 1.5);
    }


    function updatePage(items) {

        let is_dashboard = window.location.pathname !== "/critical-items";
        let totalleeches = items.length;

        if (is_dashboard) {
            items = items.sort((a, b) => (b.highestincorrect - a.highestincorrect)||(a.highestincorrectstreak - b.highestincorrectstreak)).slice(0,10);
        } else {
            items = items.sort((a, b) => (b.highestincorrect - a.highestincorrect)||(a.highestincorrectstreak - b.highestincorrectstreak));
        }

        console.log(items);

        makeLeechList(items, is_dashboard, totalleeches);
    }

    function round(number, decimals)
    {
        return +(Math.round(number + "e+" + decimals) + "e-" + decimals);
    }

    function makeLeechList(items, for_dashboard, totalleeches) {
        let rows = "";
        let textstuff = "";
        let sumval = 0;
        let temp = "";
        //writer = "";
        let d = new Date();

        //temp = "Leeches " + d.getdate() + "-" + d.getMonth()+1 + "-" + d.getFullYear + " " + d.getHours() + ":" + d.getMinutes() + ".txt";
        //textstuff = "You have " + totalleeches + " leeches as of " + d.getdate() + "-" + d.getMonth()+1 + "-" + d.getFullYear + " " + d.getHours() + ":" + d.getMinutes() + "\r\n\r\n";
        temp = "Leeches as of Now.txt";
        textstuff = "You have " + totalleeches + " leeches as of now.\r\n\r\n";

        //set fso = CreateObject("Scripting.FileSystemObject");
        //set s   = fso.CreateTextFile(temp, True);

        items.forEach(item => {
            let type = item.assignments.subject_type;
            //use slug by default (for kanji and vocab)
            let representation = item.data.slug;

            //The slug of a radical just has its name, we want the actual symbol.
            if (type === 'radical') {
                if (item.data.characters) {
                    //use characters for radicals when possible
                    representation = item.data.characters;
                } else if (item.data.character_images) {
                    //use SVG image for scalability
                    let image_data = item.data.character_images.find(x => x.content_type === "image/svg+xml" && x.metadata.inline_styles);
                    if (image_data) {
                        representation = `<img style="height: 1em; width: 1em; filter: invert(100%);" src="${image_data.url}" />`;
                    }
                }
            }

            if (for_dashboard) {
                rows+=`<li class="subject-character-grid__item">
                         <a class="subject-character subject-character--${type} subject-character--grid subject-character--unlocked title="${representation}" href="${item.data.document_url}">
                           <div class="subject-character__content">
                             <span class=subject-character__characters lang="ja">${representation}</span>
                             <div class="subject-character__info">
                               <span class="subject-character__additional-info">
                                 <table style="width:150px">
                                   <td width="40%" align="right"> ${item.impossible} </td>
                                   <td width="30%" align="right">${item.highestincorrect}/${item.highestincorrectstreak}</td>
                                   <td width="30%" align="right">${round(item.leech_score, 2)}</td>
                                 </table>
                               </span>
                             </div>
                           </div>
                         </a>
                       </li>`;
            } else {
                rows+=`<li class="subject-character-grid__item">
                         <a class="subject-character subject-character--${type} subject-character--grid subject-character--unlocked title="${representation}" href="${item.data.document_url}">
                           <div class="subject-character__content">
                             <span class=subject-character__characters lang="ja">${representation}</span>
                             <div class="subject-character__info">
                               <span class="subject-character__additional-info">
                                 <table style="width:300px">
                                   <td width="25%" align="right"> ${item.impossible} </td>
                                   <td width="5%" align="left"></td><td width="30%" align="left"> ${item.srsstagename} </td>
                                   <td width="15%" align="right">${item.highestincorrect}/${item.highestincorrectstreak}</td>
                                   <td width="15%" align="right">${round(item.leech_score, 2)}</td>
                                 </table>
                               </span>
                             </div>
                           </div>
                         </a>
                       </li>`;
            }

            if (for_dashboard == 0 && wkof.settings.LeechListUnburnable.CreateTxt) {
                textstuff+=`${representation}\r\n`;
            }

            if (item.impcnt == 1) {
                sumval = sumval + 1;
            }

        });

        if (for_dashboard == 0 && wkof.settings.LeechListUnburnable.CreateTxt) {
            var a = document.createElement("a");
            a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(textstuff);
            a.download = temp;
            a.click();
        }

        if (for_dashboard == 1) {
          let sectionContent = `<div class="wk-panel__header">
                                  <h2 class="wk-panel__title">${for_dashboard ? 'Top ' : ''}Leeches${for_dashboard ? ' (' + totalleeches + ')' : ''}</h2>
                                </div>
                                <div class="wk-panel__content">
                                  <div class="dashboard-lists">
                                    <div class="subject-character-grid subject-character-grid--single-column">
                                      <ol class="subject-character-grid__items">
                                        ${rows}
                                      </ol>
                                    </div>
                                    <div class="dashboard-lists__buttons">
                                      <a class="wk-button wk-button--default" ${for_dashboard ? 'href="/critical-items"' : ''}>
                                        <span class="wk-button__text">
                                          ${for_dashboard ? 'See More Leeches...' : totalleeches + ' leeches total (' + sumval + ' burn-only leeches)'}
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                </div>`;
          dom.$('.wk-panel--dashboard-list-critical').html(sectionContent);
        } else {
          let sectionContent = `<ol class="subject-character-grid__items">
                                  ${rows}
                                  <li class="subject-character-grid__item">
                                    <a class="subject-character subject-character--grid subject-character--unlocked" style="background-color:#F4F4F4;">
                                      <div class="subject-character__content">
                                        <div class="subject-character__info" style="margin: 0 auto;">
                                          <span class="subject-character__additional-info">
                                            <div style="width: 100%; text-align: center; color: #333;">
                                              ${totalleeches} LEECHES TOTAL (${sumval} BURN-ONLY LEECHES)
                                            </div>
                                          </span>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                </ol>`;
          dom.$('.subject-character-grid').html(sectionContent);
          dom.$('.page-header__title-text').html("Leech List");
          dom.$('.wk-text').html(totalleeches + " leeches in total (of which " + sumval + " burn-only leeches)");
          dom.$('.subject-character-grid').css('border-radius', '6px');
          dom.$('.subject-character-grid').css('overflow', 'hidden');
        }
    }

    // Load settings and set defaults
    function load_settings() {
        var defaults = {
            CreateTxt: 'false',
        };
        return wkof.Settings.load('LeechListUnburnable', defaults);
    }

    // Installs the options button in the menu
    function install_menu() {
        var config = {
            name: 'leech_list_unburnable',
            submenu: 'Settings',
            title: 'Leech List Unburnable Edit',
            on_click: open_settings
        };
        wkof.Menu.insert_script_link(config);
    }

    // Create the options
    function open_settings(items) {
        var config = {
            script_id: 'LeechListUnburnable',
            title: 'Leech List Unburnable Edit',
            content: {
                CreateTxt: {
                    type: 'checkbox',
                    label: 'Create Txt File',
                    hover_tip: 'Create Txt File when loading the Critical Items Page',
                    default: 'false'
                }
            }
        }
        var dialog = new wkof.Settings(config);
        dialog.open();
    }

    // Returns a promise and a resolve function
    function new_promise() {
        var resolve, promise = new Promise((res, rej)=>{resolve = res;});
        return [promise, resolve];
    }

})();

/*         item.startleech = 9 - (item.assignments.srs_stage - item.highestincorrectstreak);

        switch(item.startleech) {
            case 8:
                if (item.highestincorrect>18) {
                    item.impossible = "不可能"
                    item.impcnt = 1
                } else {
                    item.impossible = " "
                    item.impcnt = 0
                }
                break;
            case 7:
                if (item.highestincorrect>14) {
                    item.impossible = "不可能"
                    item.impcnt = 1
                } else {
                    item.impossible = " "
                    item.impcnt = 0
                }
                break;
            case 6:
                if (item.highestincorrect>11) {
                    item.impossible = "不可能"
                    item.impcnt = 1
                } else {
                    item.impossible = " "
                    item.impcnt = 0
                }
                break;
            case 5:
                if (item.highestincorrect>7) {
                    item.impossible = "不可能"
                    item.impcnt = 1
                } else {
                    item.impossible = " "
                    item.impcnt = 0
                }
                break;
            case 4:
                if (item.highestincorrect>5) {
                    item.impossible = "不可能"
                    item.impcnt = 1
                } else {
                    item.impossible = " "
                    item.impcnt = 0
                }
                break;
            case 3:
                if (item.highestincorrect>2) {
                    item.impossible = "不可能"
                    item.impcnt = 1
                } else {
                    item.impossible = " "
                    item.impcnt = 0
                }
                break;
            case 2:
                if (item.highestincorrect>0) {
                    item.impossible = "不可能"
                    item.impcnt = 1
                } else {
                    item.impossible = " "
                    item.impcnt = 0
                }
                break;
            case 1:
                if (item.highestincorrect>0) {
                    item.impossible = "不可能"
                    item.impcnt = 1
                } else {
                    item.impossible = " "
                    item.impcnt = 0
                }
                break;
            default:
                item.impossible = " "
                item.impcnt = 0
        } */

/*         switch(item.assignments.srs_stage) {
            case 8:
                item.srsstagename = "Enlightened";
                break;
            case 7:
                item.srsstagename = "Master";
                break;
            case 6:
                item.srsstagename = "Guru 2";
                break;
            case 5:
                item.srsstagename = "Guru 1";
                break;
            case 4:
                item.srsstagename = "Apprentice 4";
                break;
            case 3:
                item.srsstagename = "Apprentice 3";
                break;
            case 2:
                item.srsstagename = "Apprentice 2";
                break;
            case 1:
                item.srsstagename = "Apprentice 1";
                break;
            default:
                item.srsstagename = "Exception";
                break;
        } */

        //var summed = summer( item );
        //console.log( "sum: "+summed );

/*                 rows+=`<tr class="${type}">
                         <td>
                           <a href="${item.data.document_url}">
                             <span lang="ja">${representation}</span>
                             <span class="pull-right">
                               <table style="width:150px">
                                 <td width="40%" align="right"> ${item.impossible} </td>
                                 <td width="30%" align="right">${item.highestincorrect}/${item.highestincorrectstreak}</td>
                                 <td width="30%" align="right">${round(item.leech_score, 2)}</td>
                               </table>
                             </span>
                           </a>
                         </td>
                       </tr>`; */
/*                 rows+=`<tr class="${type}">
                         <td>
                           <a href="${item.data.document_url}">
                             <span lang="ja">${representation}</span>
                             <span class="pull-right">
                               <table style="width:300px">
                                 <td width="25%" align="right"> ${item.impossible} </td>
                                 <td width="5%" align="left"></td><td width="30%" align="left"> ${item.srsstagename} </td>
                                 <td width="15%" align="right">${item.highestincorrect}/${item.highestincorrectstreak}</td>
                                 <td width="15%" align="right">${round(item.leech_score, 2)}</td>
                               </table>
                             </span>
                           </a>
                         </td>
                       </tr>`; */