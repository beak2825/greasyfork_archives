// ==UserScript==
// @name         WK Smaller Lessons And Reviews Buttons
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  try to take over the world!
// @author       You
// @icon         https://i.pinimg.com/236x/5f/68/68/5f6868d18acbc1221de49387a3c07833--batman-poster-batman-batman.jpg
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @require      https://greasyfork.org/scripts/369353-jigen-s-other-stuff/code/Jigen's%20other%20stuff.js?version=604095
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/397281/WK%20Smaller%20Lessons%20And%20Reviews%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/397281/WK%20Smaller%20Lessons%20And%20Reviews%20Buttons.meta.js
// ==/UserScript==

window.wk_smaller_lessons_and_reviews_buttons = {};
(function() {
    'use strict';

    if (!window.wkof) {
        if (confirm('WaniKani Smaller Lessons And Reviews Buttons requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    var settings_dialog;
    var defaults = {
        showRecentLessons: true,
        showRecentMistakes: true,
        showBurns: true,
        showLevel: true
    };

    wkof.include('Apiv2, Menu, Settings');
    wkof.ready('Menu').then(install_menu);
    wkof.ready('Settings').then(install_settings);


    function install_menu() {
        wkof.Menu.insert_script_link({
            script_id: 'smaller_lessons_and_reviews_buttons',
            name: 'smaller_lessons_and_reviews_buttons',
            submenu:   'Settings',
            title:     'Smaller Lessons And Reviews Buttons',
            on_click:  open_settings
        });
    }

    function open_settings() {
        settings_dialog.open();
    }
    function process_settings(){
        settings_dialog.save();
        console.log('Settings saved!');
    }

    function install_settings() {
        console.log("dfsafasfas");
        settings_dialog = new wkof.Settings({
            script_id: 'smaller_lessons_and_reviews_buttons',
            name: 'smaller_lessons_and_reviews_buttons',
            title: 'Smaller Lessons And Reviews Buttons',
            on_save: process_settings,
            settings: {
				'grp_main': {
                    type:'group',
                    label:'Main',
                    content:{
                        'showRecentLessons': {type:'checkbox',label:'Show Recent Lessons',default:defaults.alwaysShow,on_change:defaults.showRecentLessons},
                        'showRecentMistakes': {type:'checkbox',label:'Show Recent Mistakes',default:defaults.showRecentMistakes},
                        'showBurns': {type:'checkbox',label:'Show Burned Items',default:defaults.showBurns},
                        'showLevel': {type:'checkbox',label:'Show Level',default:defaults.showLevel},
                    }
                },
            }
        });
        settings_dialog.load().then(function(){
            wkof.settings.smaller_lessons_and_reviews_buttons = $.extend(true, {}, defaults, wkof.settings.smaller_lessons_and_reviews_buttons);
        adjust_buttons();
        });
    }

    function adjust_buttons() {
        $('.lesson-and-review-count').detach().appendTo('.navigation-shortcuts')

    if($('.lessonAndReviewButtons').length == 0){
        $('.lessons-and-reviews').remove();
        $('.dashboard-progress').css('grid-row','1 / 3');
        //make lesson hover work with it
        $('.lessonAndReviewButtons .lessons').mouseover(function(){
            $('.lessonAndReviewButtons .lessons').attr('data-content',$('.navigation .navigation-shortcut--lessons a').attr('data-content')).popover({
                html: true,
                animation: false,
                placement: 'bottom',
                trigger: 'hover',
                template: '<div class="popover review-time"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
            });
        });
        if(wkof.settings.smaller_lessons_and_reviews_buttons.showLevel == true){
            $($('.sitemap__section-header')[0]).before('<button class="dashboard-level">'+$('li.user-summary__attribute a')[0].href.split('/level/')[1]+'</button>');
        }
        var extraStudy = $('.extra-study-button__link');
        var removedCount = 0;
        if(wkof.settings.smaller_lessons_and_reviews_buttons.showBurns == true){
            //var newBurnedItems = `<li class="navigation-shortcut navigation-shortcut--burnedItems" data-count="${extraStudy[2].textContent.replace(' Burned Items','')}"><a class="navigation-shortcut__button" href="https://www.wanikani.com/subjects/extra_study?queue_type=burned_items"><span class="navigation-shortcut__count">${extraStudy[2].textContent.replace(' Burned Items','')}</span> Burned Items</a></li>`;
            var newBurnedItems = `<li class="navigation-shortcut navigation-shortcut--burnedItems" data-count="${extraStudy[1].textContent.replace(' Burned Items','')}"><a class="navigation-shortcut__button" href="https://www.wanikani.com/subjects/extra_study?queue_type=burned_items"><span class="navigation-shortcut__count">${extraStudy[1].textContent.replace(' Burned Items','')}</span> Burned Items</a></li>`;
            $('.navigation-shortcut--reviews').after(newBurnedItems);
            removedCount = removedCount + 1;
        }
        if(wkof.settings.smaller_lessons_and_reviews_buttons.showRecentMistakes == true){
            //$('.recent-mistakes-dashboard__item').length
        //    var newRecentMistakes = `<li class="navigation-shortcut navigation-shortcut--recentMistakes" data-count="${extraStudy[1].textContent.replace(' Recent Mistakes','')}"><a class="navigation-shortcut__button" href="https://www.wanikani.com/subjects/extra_study?queue_type=recent_mistakes"><span class="navigation-shortcut__count">${extraStudy[1].textContent.replace(' Recent Mistakes','')}</span> Recent Mistakes</a></li>`;
            var newRecentMistakes = `<li class="navigation-shortcut navigation-shortcut--recentMistakes" data-count="${$('.recent-mistakes-dashboard__item').length}"><a class="navigation-shortcut__button" href="https://www.wanikani.com/subjects/extra_study?queue_type=recent_mistakes"><span class="navigation-shortcut__count">${$('.recent-mistakes-dashboard__item').length}</span> Recent Mistakes</a></li>`;
            $('.navigation-shortcut--reviews').after(newRecentMistakes);
            removedCount = removedCount + 1;
        }
        if(wkof.settings.smaller_lessons_and_reviews_buttons.showRecentLessons == true){
            var newRecentLessons = `<li class="navigation-shortcut navigation-shortcut--recentLessons" data-count="${extraStudy[0].textContent.replace(' Recent Lessons','')}"><a class="navigation-shortcut__button" href="https://www.wanikani.com/subjects/extra_study?queue_type=recent_lessons"><span class="navigation-shortcut__count">${extraStudy[0].textContent.replace(' Recent Lessons','')}</span> Recent Lessons</a></li>`;
            $('.navigation-shortcut--reviews').after(newRecentLessons);
            removedCount = removedCount + 1;
        }
        if(removedCount == 3){
            $('.logo').remove();
        }

        $('[data-react-class="ExtraStudyDashboard/ExtraStudyDashboard"]').remove();
        $('.sitemap__section-header--help').parent().remove();

        jigen.addStyle(`
.navigation-shortcuts, .navigation-shortcuts.hidden{
    display: flex !important;
    visibility: visible;
}
.global-header .container {
justify-content: center;
}
@media (min-width: 768px){
.dashboard .progress-and-forecast .forecast {
grid-row: 1 / 3;
}
}
                         .dashboard-level {
                             min-width: 16px;
                             padding: 0 8px;
                             font-size: 0.75rem;
                             display: inline-block;
                             border-radius: 4px 0 0 4px;
                             vertical-align: top;
                             line-height: 32px;
                             color: #fff;
                             text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3);
                             font-weight: bold !important;
                             text-align: center;
    background: transparent;
    color: black;
    line-height: 28px;
    color: rgb(51, 51, 51);
border: 2px solid rgba(0, 0, 0, 0.1);
                         }
[aria-controls=sitemap__levels],[aria-controls=sitemap__vocabulary],[aria-controls=sitemap__kanji],[aria-controls=sitemap__radicals]{
                             border-radius: 0 4px 4px 0;
border: 2px solid rgba(0, 0, 0, 0.1);
border-left: 0
width:auto;
display: inline;
border-radius: 4px;
}
[aria-controls=sitemap__vocabulary],[aria-controls=sitemap__kanji],[aria-controls=sitemap__radicals]{
margin-right: 0;
margin-left: 0;
}
.navigation-shortcut--recentMistakes, .navigation-shortcut--recentLessons, .navigation-shortcut--burnedItems, .sitemap {
white-space: nowrap;
}
[aria-controls=sitemap__levels] {
padding: 0;
border-radius: 0 4px 4px 0;
width: 80px;
}
.dashboard-level {
border-right: none;
}
[data-react-class="ExtraStudyDashboardLegacy/ExtraStudyDashboard"] {
display: none;
}
`);
    }
    }
})(wk_smaller_lessons_and_reviews_buttons);