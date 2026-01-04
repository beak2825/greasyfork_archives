// ==UserScript==
// @name        Wanikani Self-Study Quiz - Test Version
// @namespace   rfindley
// @description Quiz yourself on Wanikani items
// @version     3.0.32
// @include     /^https://(www|preview).wanikani.com//
// @exclude     /^https://(www|preview).wanikani.com/(review|lesson)/
// @require     https://greasyfork.org/scripts/40692-wanikani-open-framework-additional-filters/code/WaniKani%20Open%20Framework%20Additional%20Filters.user.js
// @require     https://greasyfork.org/scripts/412570-wanikani-open-framework-date-filters/code/WaniKani%20Open%20Framework%20Date%20Filters.user.js
// @require     https://greasyfork.org/scripts/376095-wanikani-part-of-speech-filter/code/Wanikani%20Part-of-Speech%20Filter.user.js
// @require     https://greasyfork.org/scripts/377613-wanikani-open-framework-jlpt-joyo-and-frequency-filters/code/Wanikani%20Open%20Framework%20JLPT,%20Joyo,%20and%20Frequency%20filters.user.js
// @require     https://greasyfork.org/scripts/377971-wanikani-open-framework-visually-similar-kanji-filter/code/Wanikani%20Open%20Framework:%20Visually%20similar%20kanji%20filter.user.js
// @require     https://greasyfork.org/scripts/412768-wanikani-open-framework-statistics-filters/code/WaniKani%20Open%20Framework%20Statistics%20Filters.user.js
// @require     https://unpkg.com/wanakana@4.0.2/umd/wanakana.min.js
// @copyright   2018+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/412863/Wanikani%20Self-Study%20Quiz%20-%20Test%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/412863/Wanikani%20Self-Study%20Quiz%20-%20Test%20Version.meta.js
// ==/UserScript==
// @require     https://greasyfork.org/scripts/409955-wanikani-item-list-filter-for-self-study-quiz/code/Wanikani%20Item%20List%20Filter%20(for%20Self-Study%20Quiz).user.js


window.ss_quiz = {};

(function(gobj) {

    /* global $, wkof, wanakana */
    /* eslint no-multi-spaces: "off" */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name =  'Self-Study Quiz';
    var scriptId = 'ss_quiz';
    var wkof_version_needed = '1.0.17';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    if (wkof.version.compare_to(wkof_version_needed) === 'older') {
        if (confirm(script_name+' requires Wanikani Open Framework version '+wkof_version_needed+'.\nDo you want to be forwarded to the update page?')) {
            window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
        }
        return;
    }

    wkof.include('Menu');
    wkof.ready('Menu').then(install_menu);

    function install_menu() {
        wkof.Menu.insert_script_link({
            name: 'selfstudyquiz',
            submenu: 'Open',
            title: 'Self-Study Quiz',
            on_click: open_quiz
        });
    }

    //########################################################################
    // QUIZ SETTINGS DIALOG
    //########################################################################

    //========================================================================
    // setup_quiz_settings()
    //------------------------------------------------------------------------
    var quiz_settings_state = 'init';
    function setup_quiz_settings() {
        if (quiz_settings_state === 'init') {
            quiz_settings_state = 'loading';
            return wkof.ready('Settings')
            .then(function(){
                quiz_settings_state = 'setup';
                setup_quiz_settings();
            });
        }
        if (quiz_settings_state !== 'setup') return;

        var config = {
            script_id: scriptId,
            title: 'Self-Study Quiz',
            pre_open: preopen_quiz_settings,
            on_save: save_quiz_settings,
            on_close: close_quiz_settings,
            on_refresh: refresh_quiz_settings,
            no_bkgd: true,
            settings: {
                pg_questions: {type:'page',label:'Questions',hover_tip:'Choose what quiz questions you want to be asked',content:{
                    grp_qpre_list: {type:'group',label:'Presets List',content:{
                        active_qpreset: {type:'list',refresh_on_change:true,hover_tip:'Question Presets',content:{}},
                    }},
                    grp_qpre: {type:'group',label:'Selected Preset',content:{
                        sect_qpre_name: {type:'section',label:'Preset Name'},
                        qpre_name: {type:'text',label:'Edit Preset Name',on_change:refresh_qpresets,path:'@qpresets[@active_qpreset].name',hover_tip:'Enter a name for the selected preset'},

                        sect_qpre_question: {type:'section',label:'Questions <span class="icon-circle-arrow-right"></span> Answers'},
                        char2mean: {type:'checkbox',label:'Rad/Kan/Voc <span class="icon-circle-arrow-right"></span> Meaning',path:'@qpresets[@active_qpreset].content.char2mean',hover_tip:'Question: A radical or kanji character, or vocab word drawn with kanji\nAnswer: The meaning in English'},
                        char2read: {type:'checkbox',label:'Kan/Voc <span class="icon-circle-arrow-right"></span> Reading',path:'@qpresets[@active_qpreset].content.char2read',hover_tip:'Question: A kanji character, or vocab word drawn with kanji\nAnswer: The Japanese reading, in hiragana or katakana'},
                        read2mean: {type:'checkbox',label:'Voc Reading <span class="icon-circle-arrow-right"></span> Meaning',path:'@qpresets[@active_qpreset].content.read2mean',hover_tip:'Question: A kanji or vocab reading, in hiragana or katakana\nAnswer: The meaning in English'},
                        mean2read: {type:'checkbox',label:'Voc Meaning <span class="icon-circle-arrow-right"></span> Reading',path:'@qpresets[@active_qpreset].content.mean2read',hover_tip:'Question: A vocab word in English\nAnswer: The Japanese reading, in hiragana or katakana'},
                        aud2mean: {type:'checkbox',label:'Voc Audio <span class="icon-circle-arrow-right"></span> Meaning',path:'@qpresets[@active_qpreset].content.aud2mean',hover_tip:'Question: A vocab word, in spoken audio\nAnswer: The meaning in English'},
                        aud2read: {type:'checkbox',label:'Voc Audio <span class="icon-circle-arrow-right"></span> Reading',path:'@qpresets[@active_qpreset].content.aud2read',hover_tip:'Question: A vocab word, in spoken audio\nAnswer: The Japanese reading, in hiragana or katakana'},
                    }},
                }},
                pg_items: {type:'page',label:'Items',hover_tip:'Choose what items you want to be quizzed on',content:{
                    grp_ipre_list: {type:'group',label:'Presets List',content:{
                        active_ipreset: {type:'list',refresh_on_change:true,hover_tip:'Item Presets',content:{}},
                    }},
                    grp_ipre: {type:'group',label:'Selected Preset',content:{
                        sect_ipre_name: {type:'section',label:'Preset Name'},
                        ipre_name: {type:'text',label:'Edit Preset Name',on_change:refresh_ipresets,path:'@ipresets[@active_ipreset].name',hover_tip:'Enter a name for the selected preset'},

                        sect_ipre_srcs: {type:'section',label:'Item Sources'},
                        ipre_srcs: {type:'tabset',content:{}},
                    }},
                }},
                pg_opts: {type:'page',label:'Settings',hover_tip:'Configure the user interface settings',content:{
                    grp_quiz_size: {type:'group',label:'Quiz Size',content:{
                        max_quiz_size: {type:'number',label:'Maximum Quiz Size',hover_tip:'Set the approximate maximum quiz size. (0 for unlimited)',default:0},
                    }},
                    grp_synonyms: {type:'group',label:'Synonyms',content:{
                        synonyms_order: {type:'dropdown',label:'Synonym order in Help',hover_tip:'Set the order that synonyms appear in Help hints. (default: First)',default:'first',content:{first:'First',last:'Last'}},
                    }},
                    grp_typos: {type:'group',label:'Typo Tolerance',content:{
                        allow_typos: {type:'checkbox',label:'Allow typos',hover_tip:'When enabled, English answers with minor typos will be accepted.',default:true},
                    }},
                    grp_help: {type:'group',label:'Wrong Answers',content:{
                        autoshow_correct: {type:'checkbox',label:'Auto-show Correct Answer',hover_tip:'Automatically show the correct answer\nwhen you answer incorrectly.',default:false},
                    }},
                    grp_msgs: {type:'group',label:'Warning Messages',content:{
                        show_slightly_off: {type:'checkbox',label:'Answer is slightly off',path:'@messages.show_slightly_off',hover_tip:'Tells you when your answer is slightly off',default:true},
                        show_multi_reading: {type:'checkbox',label:'Has multiple readings',path:'@messages.show_multi_reading',hover_tip:'Tells you when an item has multiple readings',default:false},
                    }},
                    grp_halt: {type:'group',label:'Override Lightning',content:{
                        halt_slightly_off: {type:'checkbox',label:'Halt if slightly off',path:'@messages.halt_slightly_off',hover_tip:'Override lightning mode when your answer is slightly off',default:true},
                        halt_multi_reading: {type:'checkbox',label:'Halt if multiple readings',path:'@messages.halt_multi_reading',hover_tip:'Override lightning mode when an item has multiple readings',default:false},
                    }},
                    grp_audio: {type:'group',label:'Audio',content:{
                        audio_type: {type:'dropdown',label:'Audio file type',hover_tip:'Audio file type (default=mp3)',default:'mp3',content:{mp3:'mp3',ogg:'ogg'}},
                        audio_gender: {type:'dropdown',label:'Speaker',hover_tip:'',default:'rotate',content:{rotate:'Rotate',random:'Random',male:'Male',female:'Female'}},
                    }},
                }},
            },
        };

        populate_items_config(config);

        quiz.settings_dialog = new wkof.Settings(config);
        quiz_settings_state = 'ready';
        open_quiz_settings();
    }

    //========================================================================
    // preopen_quiz_settings()
    //------------------------------------------------------------------------
    function preopen_quiz_settings(dialog) {
        var btn_grp =
            '<div class="pre_list_btn_grp">'+
            '<button type="button" ref="###" action="new" class="ui-button ui-corner-all ui-widget" title="Create a new preset">New</button>'+
            '<button type="button" ref="###" action="up" class="ui-button ui-corner-all ui-widget" title="Move the selected preset up in the list"><span class="icon-arrow-up"></span></button>'+
            '<button type="button" ref="###" action="down" class="ui-button ui-corner-all ui-widget" title="Move the selected preset down in the list"><span class="icon-arrow-down"></span></button>'+
            '<button type="button" ref="###" action="delete" class="ui-button ui-corner-all ui-widget" title="Delete the selected preset">Delete</button>'+
            '</div>';

        var wrap = dialog.find('#ss_quiz_active_qpreset').closest('.row');
        wrap.addClass('pre_list_wrap');
        wrap.prepend(btn_grp.replace(/###/g, 'qpreset'));
        wrap.find('.pre_list_btn_grp').on('click', 'button', preset_button_pressed);

        wrap = dialog.find('#ss_quiz_active_ipreset').closest('.row');
        wrap.addClass('pre_list_wrap');
        wrap.prepend(btn_grp.replace(/###/g, 'ipreset'));
        wrap.find('.pre_list_btn_grp').on('click', 'button', preset_button_pressed);

        $('#ss_quiz_ipre_srcs .row:first-child').each(function(i,e){
            var row = $(e);
            var right = row.find('>.right');
            row.prepend(right);
            row.addClass('src_enable');
        });

        // Customize the item source filters.
        var srcs = $('#ss_quiz_ipre_srcs');
        var flt_grps = srcs.find('.wkof_group');
        flt_grps.addClass('filters');
        var filters = flt_grps.find('.row');
        filters.prepend('<div class="enable"><input type="checkbox"></div>');
        filters.on('change', '.enable input[type="checkbox"]', toggle_filter);

        init_settings();
        refresh_qpresets();
        refresh_ipresets();
    }

    //========================================================================
    // open_quiz_settings()
    //------------------------------------------------------------------------
    function open_quiz_settings() {
        if (quiz_settings_state !== 'ready') return setup_quiz_settings();
        quiz_settings_state = 'open';
        var backup = {};
        quiz.backup = backup;
        backup.max_quiz_size = quiz.settings.max_quiz_size;
        backup.qpre = JSON.stringify(quiz.settings.qpresets[quiz.settings.active_qpreset].content);
        backup.ipre = JSON.stringify(quiz.settings.ipresets[quiz.settings.active_ipreset].content);
        quiz.settings_dialog.open();
    }

    //========================================================================
    // save_quiz_settings()
    //------------------------------------------------------------------------
    function save_quiz_settings(settings) {
        quiz.settings = settings;
        populate_presets($('#ss_quiz_qna'), settings.qpresets, settings.active_qpreset);
        populate_presets($('#ss_quiz_source'), settings.ipresets, settings.active_ipreset);
        var qpre = JSON.stringify(quiz.settings.qpresets[quiz.settings.active_qpreset].content);
        var ipre = JSON.stringify(quiz.settings.ipresets[quiz.settings.active_ipreset].content);
        var reshuffle = (qpre !== quiz.backup.qpre) || (quiz.settings.max_quiz_size !== quiz.backup.max_quiz_size);
        var refetch = (ipre !== quiz.backup.ipre);
        var redraw = (quiz.settings.synonyms_order !== quiz.backup.synonyms_order);
        delete quiz.backup;
        if (refetch) {
            fetch_items().then(quiz.start);
        } else if (reshuffle) {
            quiz.start();
        } else if (redraw) {
            quiz.qinfo.cache = {};
            quiz.ask();
        }
    }

    //========================================================================
    // close_quiz_settings()
    //------------------------------------------------------------------------
    function close_quiz_settings(settings) {
        quiz_settings_state = 'setup';
    }

    //========================================================================
    // refresh_quiz_settings()
    //------------------------------------------------------------------------
    function refresh_quiz_settings(settings) {
        $('#ss_quiz_ipre_srcs .wkof_group .row').each(function(i,e){
            var row = $(e);
            var panel = row.closest('[role="tabpanel"]');
            var source = panel.attr('id').match(/^ss_quiz_pg_(.*)$/)[1];
            //var filter_name = row.find('.setting').attr('name').slice((source+'_flt_').length);
            var name_elem = row.attr('name') || row.find('.setting').attr('name');
            var filter_name = name_elem.slice((source+'_flt_').length);
            var preset = quiz.settings.ipresets[quiz.settings.active_ipreset].content;
            var enabled = false;
            try {
                enabled = preset[source].filters[filter_name].enabled;
            } catch(e) {}

            if (enabled) {
                row.addClass('checked');
            } else {
                row.removeClass('checked');
            }
            row.find('.enable input[type="checkbox"]').prop('checked', enabled);
        });
    }

    //========================================================================
    // refresh_qpresets()
    //------------------------------------------------------------------------
    function refresh_qpresets() {
        var settings = quiz.settings;
        populate_presets($('#ss_quiz_active_qpreset'), settings.qpresets, settings.active_qpreset);
    }

    //========================================================================
    // refresh_ipresets()
    //------------------------------------------------------------------------
    function refresh_ipresets() {
        var settings = quiz.settings;
        populate_presets($('#ss_quiz_active_ipreset'), settings.ipresets, settings.active_ipreset);
    }

    //========================================================================
    // preset_button_pressed()
    //------------------------------------------------------------------------
    function preset_button_pressed(e) {
        var settings = quiz.settings;
        var ref = e.currentTarget.attributes.ref.value;
        var action = e.currentTarget.attributes.action.value;
        var selected = Number(settings['active_'+ref]);
        var presets = settings[ref+'s'];
        var elem = $('#ss_quiz_active_'+ref);

        var dflt;
        if (ref === 'qpreset') {
            dflt = {name:'<untitled>', content:$.extend(true, {}, qpre_defaults)};
        } else {
            dflt = {name:'<untitled>', content:$.extend(true, {}, ipre_defaults)};
        }

        switch (action) {
            case 'new':
                presets.push(dflt);
                selected = presets.length - 1;
                settings[ref+'s'] = presets;
                settings['active_'+ref] = selected;
                populate_presets(elem, presets, selected);
                quiz.settings_dialog.refresh();
                $('#ss_quiz_'+ref.slice(0,4)+'_name').focus().select();
                break;

            case 'up':
                if (selected <= 0) break;
                presets = [].concat(presets.slice(0, selected-1), presets[selected], presets[selected-1], presets.slice(selected+1));
                selected--;
                settings[ref+'s'] = presets;
                settings['active_'+ref] = selected;
                populate_presets(elem, presets, selected);
                break;

            case 'down':
                if (selected >= presets.length-1) break;
                presets = [].concat(presets.slice(0, selected), presets[selected+1], presets[selected], presets.slice(selected+2));
                selected++;
                settings[ref+'s'] = presets;
                settings['active_'+ref] = selected;
                populate_presets(elem, presets, selected);
                break;

            case 'delete':
                presets = presets.slice(0, selected).concat(presets.slice(selected+1));
                if (presets.length === 0) presets = [dflt];
                selected = Math.max(0, selected-1);
                settings[ref+'s'] = presets;
                settings['active_'+ref] = selected;
                populate_presets(elem, presets, selected);
                quiz.settings_dialog.refresh();
                break;
        }
    }

    //========================================================================
    // init_settings()
    //------------------------------------------------------------------------
    var qpre_defaults = {char2mean:false, char2read:false, read2mean:false, mean2read:false, aud2mean:false, aud2read:false};
    function init_settings() {
        var idx;
        // Merge some defaults
        var defaults = {
            pairing: 'reading_first',
            allow_typos: true,
            play_audio: true,
            mute_audio: false,
            autoshow_correct: false,
            max_quiz_size: 0, // 0 = unlimited
            messages: {
                show_slightly_off: true,
                show_multi_reading: false,
                halt_slightly_off: true,
                halt_multi_reading: false,
            }
        };
        var settings = $.extend(true, {}, defaults, wkof.settings.ss_quiz);
        wkof.settings.ss_quiz = quiz.settings = settings;
        if (settings.qpresets === undefined) {
            settings.qpresets = [
                {name:'All Questions', content:{char2mean:true, char2read:true, read2mean:true, mean2read:true, aud2mean:true, aud2read:true}},
                {name:'Japanese to English', content:{char2mean:true, char2read:true, read2mean:false, mean2read:false, aud2mean:false, aud2read:false}},
                {name:'English to Japanese', content:{char2mean:false, char2read:false, read2mean:false, mean2read:true, aud2mean:false, aud2read:false}},
                {name:'Audio Quiz', content:{char2mean:false, char2read:false, read2mean:false, mean2read:false, aud2mean:true, aud2read:true}},
            ];
            settings.active_qpreset = 0;
        }
        for (idx in settings.qpresets) {
            settings.qpresets[idx].content = $.extend(true, {}, qpre_defaults, settings.qpresets[idx].content);
        }
        if (settings.messages === undefined) {
            settings.messages = {show_slightly_off:true, show_multi_reading:false, halt_slightly_off:true, halt_multi_reading:false}
        }
        if (settings.ipresets === undefined) {
            settings.ipresets = [
                {name:'All Learned Items', content:{wk_items:{enabled:true,filters:{srs:{enabled:true,value:{appr1:true,appr2:true,appr3:true,appr4:true,guru1:true,guru2:true,mast:true,enli:true,burn:true}}}}}},
                {name:'Apprentice Items', content:{wk_items:{enabled:true,filters:{srs:{enabled:true,value:{appr1:true,appr2:true,appr3:true,appr4:true}}}}}},
                {name:'Burned Items', content:{wk_items:{enabled:true,filters:{srs:{enabled:true,value:{burn:true}}}}}},
                {name:'Resurrected Items', content:{wk_items:{enabled:true,filters:{have_burned:{enabled:true,value:true},srs:{enabled:true,value:{appr1:true,appr2:true,appr3:true,appr4:true,guru1:true,guru2:true,mast:true,enli:true}}}}}},
            ];
            settings.active_ipreset = 0;
        }
        if (ipre_defaults) {
            for (idx in settings.ipresets) {
                settings.ipresets[idx].content = $.extend(true, {}, ipre_defaults, settings.ipresets[idx].content);
            }
        }
    }

    //========================================================================
    // populate_items_config()
    //------------------------------------------------------------------------
    var ipre_defaults;
    function populate_items_config(config) {
        const group_labels = {basics: 'Basic Filters', leech: 'Leech Studying', burned: 'Burned Items Studying', review: 'Lessons and Reviews', date: 'Dates and Events',
                              item: 'Items and Information', stats: 'Statistics', other: 'Other Filters'}
        const flt_ordering = {item_type: {group: 'basics', order: 10, suborder: 10}, level: {group: 'basics', order: 10, suborder: 20},
                              srs: {group: 'basics', order: 10, suborder: 30},

                              additionalFilters_leechTraining: {group: 'leech', order: 20, suborder: 10}, statsFilters_LeechLteq: {group: 'leech', order: 20, suborder: 20},
                              statsFilters_minCurStrGteq: {group: 'leech', order: 20, suborder: 30}, statsFilters_minCurStrLteq: {group: 'leech', order: 20, suborder: 40},
                              statsFilters_percentageTotalCorGteq: {group: 'leech', order: 20, suborder: 50}, statsFilters_percentageTotalCorLteq: {group: 'leech', order: 20, suborder: 60},

                              have_burned: {group: 'burned', order: 30, suborder: 10},
                              dateFilters_burnedAfter: {group: 'burned', order: 30, suborder: 20}, dateFilters_burnedBefore: {group: 'burned', order: 30, suborder: 30},

                              additionalFilters_recentLessons: {group: 'review', order: 40, suborder: 10}, additionalFilters_timeUntilReview: {group: 'review', order: 40, suborder: 20},
                              additionalFilters_failedLastReview: {group: 'review', order: 40, suborder: 30},

                              dateFilters_reviewIsScheduled: {group: 'date', order: 50, suborder: 10},
                              dateFilters_reviewAfter: {group: 'date', order: 50, suborder: 20}, dateFilters_reviewBefore: {group: 'date', order: 50, suborder: 30},
                              dateFilters_hadLesson: {group: 'date', order: 50, suborder: 40},
                              dateFilters_lessonAfter: {group: 'date', order: 50, suborder: 50}, dateFilters_lessonBefore: {group: 'date', order: 50, suborder: 60},
                              dateFilters_hadPassedGuru: {group: 'date', order: 50, suborder: 70},
                              dateFilters_passedGuruAfter: {group: 'date', order: 50, suborder: 80}, dateFilters_passedGuruBefore: {group: 'date', order: 50, suborder: 90},
                              dateFilters_hadResurrected: {group: 'date', order: 50, suborder: 100},
                              dateFilters_resurrectedAfter: {group: 'date', order: 50, suborder: 110}, dateFilters_resurrectedBefore: {group: 'date', order: 50, suborder: 120},
                              dateFilters_isUnlocked: {group: 'date', order: 50, suborder: 130},
                              dateFilters_unlockedAfter: {group: 'date', order: 50, suborder: 140}, dateFilters_unlockedBefore: {group: 'date', order: 50, suborder: 150},

                              radical_list: {group: 'item', order: 60, suborder: 10}, kanji_list: {group: 'item', order: 60, suborder: 20},
                              vocabulary_list: {group: 'item', order: 60, suborder: 30}, additionalFilters_relatedItems: {group: 'item', order: 60, suborder: 40},
                              part_of_speech: {group: 'item', order: 60, suborder: 200}, visually_similar_kanji : {group: 'item', order: 60, suborder: 150},
                              jlpt_level: {group: 'item', order: 60, suborder: 210},
                              joyo_grade: {group: 'item', order: 60, suborder: 220}, total_frequency: {group: 'item', order: 60, suborder: 230},

                              statsFilters_meaningCorAnsGteq: {group: 'stats', order: 70, suborder: 10}, statsFilters_meaningCorAnsLteq: {group: 'stats', order: 70, suborder: 20},
                              statsFilters_readingCorAnsGteq: {group: 'stats', order: 70, suborder: 30}, statsFilters_readingCorAnsLteq: {group: 'stats', order: 70, suborder: 40},
                              statsFilters_meaningIncorAnsGteq: {group: 'stats', order: 70, suborder: 50}, statsFilters_meaningIncorAnsLteq: {group: 'stats', order: 70, suborder: 60},
                              statsFilters_readingIncorAnsGteq: {group: 'stats', order: 70, suborder: 70}, statsFilters_readingIncorAnsLteq: {group: 'stats', order: 70, suborder: 80},
                              statsFilters_totalCorAnsGteq: {group: 'stats', order: 70, suborder: 90}, statsFilters_totalCorAnsLteq: {group: 'stats', order: 70, suborder: 100},
                              statsFilters_totalIncorAnsGteq: {group: 'stats', order: 70, suborder: 110}, statsFilters_totalIncorAnsLteq: {group: 'stats', order: 70, suborder: 120},
                              statsFilters_percentageMeaningCorGteq: {group: 'stats', order: 70, suborder: 130}, statsFilters_pecentagerMeaningCorLteq: {group: 'stats', order: 70, suborder: 140},
                              statsFilters_percentageReadingCorGteq: {group: 'stats', order: 70, suborder: 150}, statsFilters_percentageReadingCorLteq: {group: 'stats', order: 70, suborder: 160},
                              statsFilters_meaningCurStrGteq: {group: 'stats', order: 70, suborder: 170}, statsFilters_meaningCurStrLteq: {group: 'stats', order: 70, suborder: 180},
                              statsFilters_meaningMaxStrGteq: {group: 'stats', order: 70, suborder: 190}, statsFilters_meaningMaxStrLteq: {group: 'stats', order: 70, suborder: 200},
                              statsFilters_readingCurStrGteq: {group: 'stats', order: 70, suborder: 210}, statsFilters_readingCurStrLteq: {group: 'stats', order: 70, suborder: 220},
                              statsFilters_readingMaxStrGteq: {group: 'stats', order: 70, suborder: 230}, statsFilters_readingMaxStrLteq: {group: 'stats', order: 70, suborder: 240},
                              statsFilters_bothCurStrGteq: {group: 'stats', order: 70, suborder: 250}, statsFilters_bothCurStrLteq: {group: 'stats', order: 70, suborder: 260},
                             };
        const dflt_ordering = {group: 'other', order: 100000, suborder: 100000};

        var ipre_srcs = config.settings.pg_items.content.grp_ipre.content.ipre_srcs.content;
        var srcs = wkof.ItemData.registry.sources;
        ipre_defaults = {};
        for (var src_name in srcs) {
            var src = srcs[src_name];
            var pg_content = {};
            ipre_srcs['pg_'+src_name] = {type:'page',label:src.description,content:pg_content};
            var settings = {};
            ipre_defaults[src_name] = settings;
            pg_content[src_name+'_enable'] = {
                type:'checkbox',
                label:'Include this source',
                path:'@ipresets[@active_ipreset].content["'+src_name+'"].enabled',
                hover_tip:'Check to include this data source in the quiz'
            };
            // Enable Wanikani source by default.
            settings.enabled = (src_name === 'wk_items');

            // Add 'Options' section.  'wk_items' is handled automatically.
            if (src_name !== 'wk_items') {
                if (src.options && Object.keys(src.options).length > 0) {
                    settings.options = {};
                    var opt_content = {};
                    pg_content['grp_'+src_name+'_options'] = {type:'group',label:'Options',content:opt_content};
                    for (var opt_name in src.options) {
                        var opt = src.options[opt_name];
                        switch (opt.type) {
                            case 'checkbox':
                                opt_content[src_name+'_opt_'+opt_name] = {
                                    type:'checkbox',
                                    label:opt.label,
                                    default:opt.default,
                                    hover_tip:opt.hover_tip
                                }
                                break;
                        }
                    }
                }
            }

            // Add 'Filters' section.
            if (src.filters && Object.keys(src.filters).length > 0) {
                settings.filters = {};
                var flt_content = {};
                let fltList = [];
                pg_content['grp_'+src_name+'_filters'] = {type:'group',label:group_labels.basics,content:flt_content};
                for (var flt_name in src.filters) {
                    var flt = src.filters[flt_name];
                    if (flt.no_ui  || flt.type === undefined) continue;  // no_ui or one of Kumirei's empty filters
                    let fltOrder = flt_ordering[flt_name] || dflt_ordering;
                    fltList.push([flt_name, flt, fltOrder]);
                };
                fltList.sort((a,b)=> a[2].order === b[2].order ? a[2].suborder - b[2].suborder : a[2].order - b[2].order);
                let curGroup = 'basics'
                for (let triple in fltList){
                    flt_name = fltList[triple][0];
                    flt = fltList[triple][1];
                    let group = fltList[triple][2].group;
                    if (group !== curGroup){
                        flt_content = {};
                        pg_content['grp_'+group+'_filters'] = {type:'group',label:group_labels[group],content:flt_content};
                        curGroup = group;
                    }
                    settings.filters[flt_name] = {enabled:false, value:flt.default};
                    switch (flt.type) {
                        case 'checkbox':
                            flt_content[src_name+'_flt_'+flt_name] = {
                                type:'checkbox',
                                label:flt.label,
                                default:flt.default,
                                path:'@ipresets[@active_ipreset].content["'+src_name+'"].filters["'+flt_name+'"].value',
                                validate: flt.validate,
                                hover_tip:flt.hover_tip
                            }
                            break;
                        case 'multi':
                            var dflt = flt.default;
                            if (typeof flt.filter_value_map === 'function') dflt = flt.filter_value_map(dflt);
                            flt_content[src_name+'_flt_'+flt_name] = {
                                type:'list',
                                multi:true,
                                size:Math.min(4,Object.keys(flt.content).length),
                                label:flt.label,
                                content:flt.content,
                                default:dflt,
                                path:'@ipresets[@active_ipreset].content["'+src_name+'"].filters["'+flt_name+'"].value',
                                validate: flt.validate,
                                hover_tip:flt.hover_tip
                            }
                            settings.filters[flt_name].value = dflt;
                            break;
                        case 'text':
                        case 'number':
                        case 'input':
                            flt_content[src_name+'_flt_'+flt_name] = {
                                type:flt.type,
                                label:flt.label,
                                placeholder:flt.placeholder,
                                default:flt.default,
                                path:'@ipresets[@active_ipreset].content["'+src_name+'"].filters["'+flt_name+'"].value',
                                validate: flt.validate,
                                hover_tip:flt.hover_tip
                            }
                            break;
                        case 'button':
                            flt_content[src_name+'_flt_'+flt_name] = {
                                type:flt.type,
                                label:flt.label,
                                on_click:flt.on_click,
                                validate: flt.validate,
                                hover_tip:flt.hover_tip
                            }
                            break;
                   case 'html':
                        flt_content[src_name+'_flt_'+flt_name] = {
                            type:flt.type,
                            label:flt.label,
                            html:flt.html.replaceAll(/\sid=".*?_/g, ' id="'+scriptId+'_').replaceAll(/\sfor=".*?_/g, ' for="'+scriptId+'_'),
                            path:'@ipresets[@active_ipreset].content["'+src_name+'"].filters["'+flt_name+'"].value',
		                 	hover_tip:flt.hover_tip,
                            pre_open:flt.pre_open,
                            content:flt.content,
                        };
                        settings.filters[flt_name].value = {};
                        for (var cname in flt.content){
                            settings.filters[flt_name].value[cname] = flt.content[cname].default;
                            flt.content[cname].path = '@ipresets[@active_ipreset].content["'+src_name+'"].filters["'+flt_name+'"].value.'+cname;
                        };
                        break;
                    }
                }
            }
        }
    }

    //========================================================================
    // toggle_filter()
    //------------------------------------------------------------------------
    function toggle_filter(e) {
        var row = $(e.delegateTarget);
        var panel = row.closest('[role="tabpanel"]');
        var source = panel.attr('id').match(/^ss_quiz_pg_(.*)$/)[1];
        var enabled = row.find('.enable input[type="checkbox"]').prop('checked');
        var preset = quiz.settings.ipresets[quiz.settings.active_ipreset].content;
        //var filter_name = row.find('.setting').attr('name').slice((source+'_flt_').length);
        var name_elem = row.attr('name') || row.find('.setting').attr('name');
        var filter_name = name_elem.slice((source+'_flt_').length);

        if (enabled) {
            row.addClass('checked');
        } else {
            row.removeClass('checked');
        }
        try {
            preset[source].filters[filter_name].enabled = enabled;
        } catch(e) {}
    }

    //########################################################################
    // QUIZ DIALOG
    //########################################################################

    //========================================================================
    // install_css()
    //------------------------------------------------------------------------
    function install_css() {
        $('head').append(
            '<style id="ss_quiz_css" type="text/css">'+
            '.noselect {-webkit-touch-callout:none; -webkit-user-select:none; -khtml-user-select:none; -moz-user-select: none; -ms-user-select:none; user-select: none;}'+

            '#ss_quiz [lang="ja"] {font-family: "Meiryo","Yu Gothic","Hiragino Kaku Gothic Pro","TakaoPGothic","Yu Gothic","ヒラギノ角ゴ Pro W3","メイリオ","Osaka","MS PGothic","ＭＳ Ｐゴシック",sans-serif;}'+
            '#ss_quiz {position:fixed; z-index:12001; width:573px; background-color:#000; border-radius:8px; border:8px solid rgba(0,0,0,0.85); font-size:16px; line-height:16px; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;}'+
            '#ss_quiz * {text-align:center;}'+

            '#ss_quiz .titlebar {cursor:move; text-align:left; padding-bottom:4px; font-size:1.125em; font-weight:bold; line-height:1.125em; background-color:rgba(0,0,0,0.85); color:#ddd;}'+
            '#ss_quiz .titlebar .button {display:inline-block; float:right; height:20px; width:20px; line-height:1em; cursor:pointer; border:1px solid rgba(255,255,255,0.2); border-radius:4px;}'+

            '#ss_quiz .prev, #ss_quiz .next {display:inline-block; width:80px; color:#fff; line-height:8em; cursor:pointer;}'+
            '#ss_quiz .prev:hover {background-image:linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.2));}'+
            '#ss_quiz .next:hover {background-image:linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.2));}'+
            '#ss_quiz .prev {float:left;}'+
            '#ss_quiz .next {float:right;}'+

            '#ss_quiz .cfgbar {background-color:rgba(32,32,32,0.85); padding:4px 0; border-bottom:1px solid #444;}'+
            '#ss_quiz .cfgbar select {margin:0; background:transparent; color:rgba(255,255,255,0.5); border:1px solid #777; width:248px; height:2em; text-align:left; font-size:0.875em; border-radius:4px; padding:4px 6px;}'+
            '#ss_quiz .cfgbar option {color:#000;}'+
            '#ss_quiz .cfgbar .button {display:inline-block; width:24px; height:24px; cursor:pointer; color:#777; font-size:24px; vertical-align:middle;}'+
            '#ss_quiz .cfgbar .button:hover {color:#ccc;}'+

            '#ss_quiz .statusbar {line-height:1em; color:rgba(255,255,255,0.5); background-color:rgba(32,32,32,0.85);}'+

            '#ss_quiz .settings {float:left; padding:6px 8px; text-align:left; line-height:1.5em; font-size:0.875em;}'+
            '#ss_quiz .settings span[class*="icon-"] {font-size:1.3em; padding:0 2px;}'+
            '#ss_quiz .settings .ss_audio {padding-left:0; padding-right:4px;}'+
            '#ss_quiz .settings .ss_done {font-size:1.25em;}'+
            '#ss_quiz .settings .ss_pair {font-weight:bold;}'+
            '#ss_quiz .settings span {cursor:pointer;}'+
            '#ss_quiz .settings > span:hover {color:rgba(255,255,204,0.8);}'+
            '#ss_quiz .settings span.active {color:#ffc;}'+

            '#ss_quiz .stats_labels {text-align:right; font-family:monospace; font-size:14px; line-height:14px; white-space:pre;}'+
            '#ss_quiz .stats {float:right; text-align:right; color:rgba(255,255,255,0.8); font-family:monospace; padding:0 5px;}'+

            '#ss_quiz .icon-audio:before {content:"\\f028";}'+

            '#ss_quiz .ss_audio {display:inline-block;box-sizing:border-box;width:22px;text-align:left}'+
            '#ss_quiz .ss_audio:before {content:"\\f026";}'+
            '#ss_quiz .ss_audio.active:before {content:"\\f028";}'+
            '#ss_quiz .ss_audio.mute {color:rgba(255,0,0,0.8);}'+
            '#ss_quiz .ss_audio.mute:hover {color:rgba(255,127,127,0.8);}'+

            '#ss_quiz[data-qtype="characters"] .question {font-size:2em;}'+
            '#ss_quiz .question svg.radical {width:1em;height:1em;stroke:#fff;stroke-width:68;stroke-linecap:square;stroke-miterlimit:2;fill:none;}'+

            '#ss_quiz .atype {font-size:1.75em; line-height:2em; cursor:default; color:#fff; border-top:1px solid #000; border-bottom:1px solid #000;}'+
            '#ss_quiz[data-atype="reading"] .atype {color:#fff; text-shadow:-1px -1px 0 #000; border-top:1px solid #555; border-bottom:1px solid #000; background-color:#2e2e2e; background-image:linear-gradient(to bottom, #3c3c3c, #1a1a1a); background-repeat:repeat-x;}'+
            '#ss_quiz[data-atype="meaning"] .atype {color:#555; text-shadow:-1px -1px 0 rgba(255,255,255,0.1); border-top:1px solid #d5d5d5; border-bottom:1px solid #c8c8c8; background-color:#e9e9e9; background-image:linear-gradient(to bottom, #eee, #e1e1e1); background-repeat:repeat-x;}'+

            '#ss_quiz .help {display:none;'+
            '  position:absolute; top:3%; left:13%; width:74%; box-sizing:border-box; border:2px solid #000; border-radius:15px; padding:4px;'+
            '  color:#555; text-shadow:2px 2px 0 rgba(0,0,0,0.13); background-color:rgba(255,255,255,0.9); font-size:0.8em; line-height:1.2em;'+
            '}'+
            '#ss_quiz.help .help {display:inherit;}'+

            '#ss_quiz .message {visibility:hidden;'+
            '  position:absolute; bottom:3%; left:13%; width:74%; box-sizing:border-box; border:2px solid #000; border-radius:15px; padding:4px;'+
            '  color:#555; text-shadow:2px 2px 0 rgba(0,0,0,0.13); background-color:rgba(255,255,255,0.9); font-size:0.6em; line-height:1.2em; opacity:0; transition:visibility 0.25s, opacity 0.25s linear;'+
            '}'+
            '#ss_quiz.message .message {visibility:visible; opacity:1; transition:visibility 0s, opacity 0.25s linear;}'+

            '#wkof_ds #ss_quiz .answer {font-size:1.75em; background-color:#ddd; padding:8px;}'+
            '#wkof_ds #ss_quiz .answer input {'+
            '  width:100%; background-color:#fff; height:2em; margin:0; border:2px solid #000; padding:0;'+
            '  box-sizing:border-box; border-radius:0; font-size:1em;'+
            '}'+
            '#wkof_ds #ss_quiz[data-result="correct"] .answer input {color:#fff; background-color:#8c8; text-shadow:2px 2px 0 rgba(0,0,0,0.2);}'+
            '#wkof_ds #ss_quiz[data-result="incorrect"] .answer input {color:#fff; background-color:#f03; text-shadow:2px 2px 0 rgba(0,0,0,0.2);}'+

            '#ss_quiz .btn.requiz {position:absolute; top:6px; right:6px; padding-left:6px; padding-right:6px;}'+

            '#ss_quiz .qwrap {height:8em; position:relative; clear:both; font-size:1.75em}'+
            '#ss_quiz[data-itype="radical"] .qwrap, #ss_quiz[data-itype="radical"] .summary .que {background-color:#0af;}'+
            '#ss_quiz[data-itype="kanji"] .qwrap, #ss_quiz[data-itype="kanji"] .summary .que {background-color:#f0a;}'+
            '#ss_quiz[data-itype="vocabulary"] .qwrap, #ss_quiz[data-itype="vocabulary"] .summary .que {background-color:#a0f;}'+

            '#ss_quiz .qwrap > .center {display:none; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);}'+

            '#ss_quiz[data-mode="loading"] .qwrap {background-color:#ccc; opacity:0.5;}'+
            '#wkof_ds #ss_quiz[data-mode="loading"] .answer {opacity:0.5;}'+

            '#ss_quiz[data-mode="question"] .question {display:block;}'+
            '#ss_quiz .question {overflow-x:auto; overflow-y:hidden; color:#fff; text-align:center; line-height:1.1em; font-size:1em; cursor:default;}'+
            '#ss_quiz .question .icon-audio {font-size:2.5em; cursor:pointer;}'+

            '#ss_quiz[data-mode="summary"] .summary {display:block;}'+
            '#ss_quiz .summary {display:none; position:absolute; width:74%; height:100%; background-color:rgba(0,0,0,0.7); color:#fff; font-weight:bold;}'+
            '#ss_quiz .summary h3 {'+
            '  background-image:linear-gradient(to bottom, #3c3c3c, #1a1a1a); background-repeat:repeat-x;'+
            '  border-top:1px solid #777; border-bottom:1px solid #000; margin:0; box-sizing:border-box;'+
            '  text-shadow:2px 2px 0 rgba(0,0,0,0.5); color:#fff; font-size:0.8em; font-weight:bold; line-height:40px;'+
            '}'+
            '#ss_quiz .summary .errors {position:absolute; top:40px; bottom:0px; width:100%; margin:0; overflow-y:auto; list-style-type:none;}'+
            '#ss_quiz .summary li {margin:4px 0 0 0; font-size:0.6em; font-weight:bold; line-height:1.4em;}'+

            '#ss_quiz .summary .errors span {display:inline-block; padding:2px 4px 0px 4px; border-radius:4px; line-height:1.1em; max-width:50%; vertical-align:middle; cursor:pointer;}'+
            '#ss_quiz .summary .ans {background-color:#fff; color:#000;}'+
            '#ss_quiz .summary .wrong {color:#f22;}'+


            //--[ Settings dialog ]-------------------------------------------
            '#wkof_ds div[role="dialog"][aria-describedby="wkofs_ss_quiz"] {z-index:12002;}'+

            '#wkofs_ss_quiz.wkof_settings .pre_list_btn_grp {width:60px;float:left;margin-right:2px;}'+
            '#wkofs_ss_quiz.wkof_settings .pre_list_btn_grp button {width:100%; padding:2px 0;}'+
            '#wkofs_ss_quiz.wkof_settings .pre_list_btn_grp button:not(:last-child) {margin-bottom:2px;}'+
            '#wkofs_ss_quiz.wkof_settings .pre_list_wrap {display:flex;}'+
            '#wkofs_ss_quiz.wkof_settings .pre_list_wrap .right {flex:1;}'+
            '#wkofs_ss_quiz.wkof_settings .pre_list_wrap .list {overflow:auto;height:100%;}'+

            //---[ Modifications for html type, the original line was commented out and the new line is just below ]-------------------

            '#wkofs_ss_quiz.wkof_settings .filters .row {border-top:1px solid #ccc; padding:6px 4px; margin-bottom:0;}'+
            '#wkofs_ss_quiz.wkof_settings .filters .row:not(.checked) {padding-top:0px;padding-bottom:0px;}'+
            '#wkofs_ss_quiz .filters .row .enable input[type="checkbox"] {margin:0;}'+
//            '#wkofs_ss_quiz.narrow .filters .row.checked .right input[type="checkbox"]:after {content:"⇐yes?";margin-left:28px;line-height:30px;}'+
            '#wkofs_ss_quiz.narrow .filters .row.checked:not(.html_type) .right input[type="checkbox"]:after {content:"⇐yes?";margin-left:28px;line-height:30px;}'+
            '#wkofs_ss_quiz .filters .row.checked {background-color:#f7f7f7;}'+
            '#wkofs_ss_quiz .filters .row:not(.checked) {opacity:0.5;}'+
            '#wkofs_ss_quiz .filters .row .enable {display:inline; margin:0; float:left;}'+
//            '#wkofs_ss_quiz:not(.narrow) .filters .left {width:170px;}'+
            '#wkofs_ss_quiz:not(.narrow) .filters .row:not(.html_type) .left {width:170px;}'+
            // new rule for html_type - makes the label on the same line as the checkbox - filling the rest of the line
            '#wkofs_ss_quiz .filters .row.html_type .left {width:calc(100% - 36px);}'+

            '#wkofs_ss_quiz .filters .row .enable input[type="checkbox"] {margin:0 4px 0 0;}'+
            '#wkofs_ss_quiz .filters .row:not(.checked) .right {display:none;}'+
            '#wkofs_ss_quiz .filters .row:not(.checked) .left label {text-align:left;}'+
//            '#wkofs_ss_quiz.narrow .filters .row .left {width:initial;}'+
            '#wkofs_ss_quiz.narrow .filters .row:not(.html_type) .left {width:initial;}'+
//            '#wkofs_ss_quiz.narrow .filters .row .left label {line-height:30px;}'+
            '#wkofs_ss_quiz.narrow .filters .row:not(.html_type) .left label {line-height:30px;}'+
            '#wkofs_ss_quiz #ss_quiz_ipre_srcs .src_enable .left {width:initial;}'+
            '#wkofs_ss_quiz #ss_quiz_ipre_srcs .src_enable .left label {text-align:left;width:initial;line-height:30px;}'+
            '#wkofs_ss_quiz #ss_quiz_ipre_srcs .src_enable .right {float:left; margin:0 4px;width:initial;}'+
            //----------------------------------------------------------------

            '</style>'
        );
    }

    //========================================================================
    // open_quiz()
    //------------------------------------------------------------------------
    var quiz_setup_state = 'init';
    function open_quiz(custom_options) {
        if (quiz_setup_state === 'init') {
            quiz_setup_state = 'loading';
            install_css();
            wkof.include('ItemData, Settings');
            wkof.ready('ItemData, Settings').then(function(){
                return wkof.Settings.load('ss_quiz');
            }).then(function(){
                quiz_setup_state = 'ready';
                init_settings();
                open_quiz(custom_options);
            });
        }
        if (quiz_setup_state !== 'ready') return;

        var quiz_html =
            '<div id="ss_quiz" class="dialog" data-itype="loading" data-atype="meaning" data-mode="question">'+
            '  <div class="titlebar noselect">Self-Study Quiz<span class="button" title="Close the quiz.\nHotkey: Rapid triple-tap [Esc]">x</span></div>'+
            '  <div class="cfgbar">'+
            '    <select id="ss_quiz_qna" title="Choose what quiz questions you want to be asked"></select>'+
            '    <select id="ss_quiz_source" title="Choose what items you want to be quizzed on"></select>'+
            '    <span class="icon-repeat shuffle button" title="Shuffle Quiz (Ctrl-S)\nDouble-click to reset Round counter"></span>'+
            '    <span class="icon-cog config button" title="Configure presets"></span>'+
            '  </div>'+
            '  <div class="statusbar">'+
            '    <div class="settings noselect">'+
            '      <span class="icon-bolt ss_lightning" title="Lightning Mode: Skip <enter> on correct answers (Ctrl-L)"></span>'+
            '      <span class="icon-audio ss_audio" title="Toggle when to play audio (Ctrl-Shift-A)\n* Red = Never play audio\n* Gray = Audio questions only\n* Yellow = Audio questions, After correct reading, Opening help for reading\n\nTo play audio immediately, press (Ctrl-A)"></span>'+
            '      <span class="icon-question-sign ss_help" title="Help: Peek at item info (F1, Ctrl-H, or ?)"></span>'+
            '      <span class="icon-step-forward ss_done" title="End the quiz and show summary (Esc or Ctrl-E)"></span><br />'+
            '      <span class="ss_pair" title="Pairing mode: Group reading and meaning together (Ctrl-P)">Pairing: <span class="data">Disabled</span></span>'+
            '    </div>'+
            '    <div class="stats"></div>'+
            '    <div class="stats_labels">Round:<br>Remaining:<br>Correct:<br>Incorrect:</div>'+
            '  </div>'+
            '  <div class="qwrap">'+
            '    <div class="prev" title="Previous question (Ctrl-Left)"><i class="icon-chevron-left"></i></div>'+
            '    <div class="next" title="Next question (Ctrl-Right)"><i class="icon-chevron-right"></i></div>'+
            '    <div class="question center"></div>'+
            '    <div class="help"></div>'+
            '    <div class="message"></div>'+
            '    <div class="summary center">'+
            '      <h3>Summary - <span class="percent">100%</span> Correct <button class="btn requiz" title="Re-quiz wrong items">Re-quiz</button></h3>'+
            '      <ul class="errors"></ul>'+
            '    </div>'+
            '  </div>'+
            '  <div class="atype">Loading...</div>'+
            '  <div class="answer"><input type="text" lang="en" value=""></div>'+
            '</div>';

        if (quiz.dialog) quiz.close();
        var dialog = (quiz.dialog = $(quiz_html));

        var settings = quiz.settings;
        init_custom_options(custom_options);
        populate_presets(dialog.find('#ss_quiz_qna'), settings.qpresets, settings.active_qpreset);
        populate_presets(dialog.find('#ss_quiz_source'), settings.ipresets, settings.active_ipreset);

        wkof.Settings.background.open();
        $('#wkof_ds').append(dialog);

        dialog.css('top', Math.max(0,Math.floor((window.innerHeight - dialog.outerHeight()) / 2)));
        dialog.css('left', Math.floor((window.innerWidth - dialog.outerWidth()) / 2));

        // Initialize settings
        var settings_bar = dialog.find('.statusbar .settings');
        if (settings.lightning_mode === true) settings_bar.find('.ss_lightning').addClass('active');
        if (settings.repeat_quiz === true) settings_bar.find('.ss_repeat').addClass('active');
        if (settings.shuffle_on_repeat === true) settings_bar.find('.ss_shuffle').addClass('active');
        if (settings.play_audio === true) settings_bar.find('.ss_audio').addClass('active');
        if (settings.mute_audio === true) settings_bar.find('.ss_audio').addClass('mute');
        toggle_pairing(null, true /* initialize */);

        // Events
        dialog.find('.settings .ss_lightning').on('click', toggle_lightning);
        dialog.find('.settings .ss_audio').on('click', toggle_audio);
        dialog.find('.settings .ss_help').on('click', toggle_help);
        dialog.find('.settings .ss_pair').on('click', toggle_pairing);
        dialog.find('.settings .ss_done').on('click', process_escape);
        dialog.find('.prev').on('click', quiz.prev);
        dialog.find('.next').on('click', quiz.next);
        dialog.find('.titlebar').on('mousedown touchstart', drag);
        dialog.find('.cfgbar .button.shuffle').on('click', manual_shuffle);
        dialog.find('.cfgbar .button.config').on('click', open_quiz_settings);
        dialog.find('.titlebar .button').on('click', close_quiz);
        dialog.find('.summary .requiz').on('click', quiz.requiz);
        dialog.find('.question').on('click', '.icon-audio', play_audio.bind(null,true,null));
        $('#ss_quiz_qna').on('change', qpreset_changed);
        $('#ss_quiz_source').on('change', ipreset_changed);
        $('body').on('keydown.ss_quiz_key keypress.ss_quiz_key', quiz_key_handler);
        freeze_body();

        set_mode('loading');
        fetch_items().then(quiz.start);
    }

    //========================================================================
    // init_custom_options()
    //------------------------------------------------------------------------
    function init_custom_options(custom) {
        if (!custom) {
            quiz.custom = {
                has_ipreset: false,
                using_ipreset: false,
                has_qpreset: false,
                using_qpreset: false,
            }
            return;
        }
        quiz.custom = custom;
        if (custom.qpreset) {
            quiz.custom.has_qpreset = true;
            quiz.custom.using_qpreset = true;
        }
        if (custom.ipreset) {
            quiz.custom.has_ipreset = true;
            quiz.custom.using_ipreset = true;
        }
    }

    //========================================================================
    // close_quiz()
    //------------------------------------------------------------------------
    function close_quiz(e) {
        unfreeze_body();
        $('body').off('.ss_quiz_key');
        quiz.dialog.remove();
        wkof.Settings.background.close();
        if (quiz.custom && typeof quiz.custom.on_close === 'function') quiz.custom.on_close();
    }

    var body_scroll_y;
    function freeze_body() {
        body_scroll_y = window.scrollY;
        $('body').css('overflow', 'hidden').scrollTop(body_scroll_y);
    }
    function unfreeze_body() {
        $('body').css('overflow','unset');
        window.scroll({top:body_scroll_y});
    }

    //========================================================================
    // qpreset_changed()
    //------------------------------------------------------------------------
    function qpreset_changed(e) {
        var settings = quiz.settings;
        var selected = e.target.selectedOptions[0].attributes.name.value;
        if (selected === 'custom') {
            quiz.custom.using_qpreset = true;
        } else {
            quiz.custom.using_qpreset = false;
            settings.active_qpreset = selected;
            wkof.Settings.save('ss_quiz');
        }
        quiz.start();
    }

    //========================================================================
    // ipreset_changed()
    //------------------------------------------------------------------------
    function ipreset_changed(e) {
        var settings = quiz.settings;
        var selected = e.target.selectedOptions[0].attributes.name.value;
        if (selected === 'custom') {
            quiz.custom.using_ipreset = true;
        } else {
            quiz.custom.using_ipreset = false;
            settings.active_ipreset = selected;
            wkof.Settings.save('ss_quiz');
        }
        fetch_items().then(quiz.start);
    }

    //========================================================================
    // populate_presets()
    //------------------------------------------------------------------------
    function populate_presets(elem, presets, active_preset) {
        var html = '';
        for (var idx in presets) {
            var preset = presets[idx];
            var name = preset.name.replace(/</g,'&lt;').replace(/>/g,'&gt;');
            html += '<option name="'+idx+'">'+name+'</option>';
        }
        var elem_name = elem.attr('id')
        if (elem_name === 'ss_quiz_qna' && quiz.custom.has_qpreset) {
            html += '<option name="custom">('+quiz.custom.qpreset.name+')</option>';
            if (quiz.custom.using_qpreset) active_preset = presets.length;
        } else if (elem_name === 'ss_quiz_source' && quiz.custom.has_ipreset) {
            html += '<option name="custom">('+quiz.custom.ipreset.name+')</option>';
            if (quiz.custom.using_ipreset) active_preset = presets.length;
        }
        elem.html(html);
        elem.children().eq(active_preset).prop('selected', true);
    }

    //########################################################################
    // QUIZ DATA
    //########################################################################

    var quiz = {
        // Dialogs
        dialog: null,
        settings_dialog: null,

        // Item Lists
        items: [],
        group_list: [],
        serial_list: [],
        index: null,

        // Status
        showing_help: false,
        mode: 'loading',

        // Question Info
        qinfo: {
            load: load_qinfo,
            prep: prep_qinfo,
            cache: {},
        },

        // Stats
        stats: {
            round: 1,
            total: 0,
            correct: 0,
            incorrect: 0,
        },

        // Functions
        start: start_quiz,
        shuffle: shuffle_quiz,
        requiz: requiz,
        ask: ask_question,
        submit: submit_answer,
        prev: prev_question,
        next: next_question,
        close: close_quiz,
    };
    gobj.open = open_quiz;

    //========================================================================
    // fetch_items()
    //------------------------------------------------------------------------
    function fetch_items() {
        var settings = quiz.settings;
        var ipreset = (quiz.custom.using_ipreset ? quiz.custom.ipreset.content : settings.ipresets[settings.active_ipreset].content);

        set_mode('loading');
        var config = {};
        for (var src_name in ipreset) {
            var src_preset = ipreset[src_name];
            if (!src_preset.enabled) continue;
            if (!wkof.ItemData.registry.sources[src_name]) continue;
            var src_cfg = {};
            config[src_name] = src_cfg;
            src_cfg.filters = {};
            if (src_name === 'wk_items') src_cfg.options = {study_materials: true};
            var ipre_filters = src_preset.filters;
            for (var flt_name in ipre_filters) {
                var ipre_flt = ipre_filters[flt_name];
                if (!ipre_flt.enabled) continue;
                if (!wkof.ItemData.registry.sources[src_name].filters[flt_name]) continue;
                src_cfg.filters[flt_name] = {value: ipre_flt.value};
                if (ipre_flt.invert === true) src_cfg.filters[flt_name].invert = true;
            }
        }
        return wkof.ItemData.get_items(config)
        .then(function(items){
            quiz.items = items;
        });
    }

    //========================================================================
    // shuffle_quiz()
    //------------------------------------------------------------------------
    function shuffle_quiz() {
        var settings = quiz.settings;
        var qpreset = (quiz.custom.using_qpreset ? quiz.custom.qpreset.content : settings.qpresets[settings.active_qpreset].content);
        var pairing = settings.pairing || 'disabled';

        var valid_question_types = {
            char2read: {radical:false, kanji:true,  vocabulary:true},
            char2mean: {radical:true,  kanji:true,  vocabulary:true},
            read2mean: {radical:false, kanji:false, vocabulary:true},
            mean2read: {radical:false, kanji:false, vocabulary:true},
            aud2read:  {radical:false, kanji:false, vocabulary:true},
            aud2mean:  {radical:false, kanji:false, vocabulary:true},
        };

        var id, idx, item, qset;
        var grp_list = quiz.group_list = [];
        quiz.stats.total = 0;
        switch (pairing) {
            case 'disabled':
                var qna = ['char2mean','char2read','read2mean','mean2read','aud2mean','aud2read'];
                for (id in quiz.items) {
                    item = quiz.items[id];
                    for (idx in qna) {
                        var qtype = qna[idx];
                        if (valid(qtype)) {
                            grp_list.push({item:item, qna:[qtype], order:Math.random()});
                        }
                    }
                }
                break;

            case 'reading_first':
                for (id in quiz.items) {
                    item = quiz.items[id];
                    qset = [];
                    if (valid('char2read')) qset.push('char2read');
                    if (valid('char2mean')) qset.push('char2mean');
                    if (qset.length > 0) grp_list.push({item:item, qna:qset, order:Math.random()});
                    if (valid('mean2read')) grp_list.push({item:item, qna:['mean2read'], order:Math.random()});
                    if (valid('read2mean')) grp_list.push({item:item, qna:['read2mean'], order:Math.random()});
                    qset = [];
                    if (valid('aud2read')) qset.push('aud2read');
                    if (valid('aud2mean')) qset.push('aud2mean');
                    if (qset.length > 0) grp_list.push({item:item, qna:qset, order:Math.random()});
                }
                break;

            case 'meaning_first':
                for (id in quiz.items) {
                    item = quiz.items[id];
                    qset = [];
                    if (valid('char2mean')) qset.push('char2mean');
                    if (valid('char2read')) qset.push('char2read');
                    if (qset.length > 0) grp_list.push({item:item, qna:qset, order:Math.random()});
                    if (valid('read2mean')) grp_list.push({item:item, qna:['read2mean'], order:Math.random()});
                    if (valid('mean2read')) grp_list.push({item:item, qna:['mean2read'], order:Math.random()});
                    qset = [];
                    if (valid('aud2mean')) qset.push('aud2mean');
                    if (valid('aud2read')) qset.push('aud2read');
                    if (qset.length > 0) grp_list.push({item:item, qna:qset, order:Math.random()});
                }
                break;

            case 'random_order':
                for (id in quiz.items) {
                    item = quiz.items[id];
                    qset = [];
                    if (Math.random() < 0.5) {
                        if (valid('char2read')) qset.push('char2read');
                        if (valid('char2mean')) qset.push('char2mean');
                    } else {
                        if (valid('char2mean')) qset.push('char2mean');
                        if (valid('char2read')) qset.push('char2read');
                    }
                    if (qset.length > 0) grp_list.push({item:item, qna:qset, order:Math.random()});
                    if (valid('mean2read')) grp_list.push({item:item, qna:['mean2read'], order:Math.random()});
                    if (valid('read2mean')) grp_list.push({item:item, qna:['read2mean'], order:Math.random()});
                    qset = [];
                    if (Math.random() < 0.5) {
                        if (valid('aud2read')) qset.push('aud2read');
                        if (valid('aud2mean')) qset.push('aud2mean');
                    } else {
                        if (valid('aud2mean')) qset.push('aud2mean');
                        if (valid('aud2read')) qset.push('aud2read');
                    }
                    if (qset.length > 0) grp_list.push({item:item, qna:qset, order:Math.random()});
                }
                break;
        }

        grp_list.sort(function(a,b){return a.order - b.order;});
        var serial_list = quiz.serial_list = [];
        for (var idx1 in grp_list) {
            for (var idx2 in grp_list[idx1].qna) {
                serial_list.push([idx1, idx2]);
            }
        }
        quiz.qinfo.cache = {};
        quiz.stats.real_total = quiz.stats.total;
        if (settings.max_quiz_size > 0) quiz.stats.total = Math.min(quiz.stats.total, settings.max_quiz_size);

        function valid(qtype) {
            var valid = ((qpreset[qtype] === true) && (valid_question_types[qtype][item.object] === true));
            if (valid) quiz.stats.total++;
            return valid;
        }
    }

    //########################################################################
    // QUIZ
    //########################################################################

    //========================================================================
    // jw_distance() - Jaro-Winkler Distance
    //------------------------------------------------------------------------
    function jw_distance(a, c) {var h,b,d,k,e,g,f,l,n,m,p;if(a.length>c.length) {c=[c,a];a=c[0];c=c[1];}k=~~Math.max(0,c.length/2-1);e=[];g=[];b=n=0;for(p=a.length;n<p;b=++n){for(h=a[b],l=Math.max(0,b-k),f=Math.min(b+k+1,c.length),d=m=l;l<=f?m<f:m>f;d=l<=f?++m:--m){if(g[d]===undefined&&h===c[d]){e[b]=h;g[d]=c[d];break;}}}e=e.join("");g=g.join("");d=e.length;if(d){b=f=k=0;for(l=e.length;f<l;b=++f){h=e[b];if(h!==g[b])k++;}b=g=e=0;for(f=a.length;g<f;b=++g){h=a[b];if(h===c[b])e++;else	break;}a=(d/a.length+d/c.length+(d-~~(k/2))/d)/3;a+=0.1*Math.min(e,4)*(1-a);}else{a=0;}return	a;}

    //========================================================================
    // to_title_case() - Make first letter of each word upper-case.
    //------------------------------------------------------------------------
    function to_title_case(str) {return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});}

    //========================================================================
    // start_quiz()
    //------------------------------------------------------------------------
    function start_quiz(options) {
        if (!options) options = {};
        if (options.keep_round_count !== true) options.keep_round_count = false; // Default 'false'
        if (!options.keep_round_count) quiz.stats.round = 1;
        quiz.stats.correct = 0;
        quiz.stats.incorrect = 0;
        quiz.index = 0;
        quiz.shuffle();
        if (quiz.stats.total === 0) return set_mode('no_items');
        set_mode('question');
    }

    //========================================================================
    // requiz()
    //------------------------------------------------------------------------
    function requiz() {
        quiz.do_requiz = true;
        quiz.next();
    }

    //========================================================================
    // set_mode()
    //------------------------------------------------------------------------
    function set_mode(mode) {
        var dialog = quiz.dialog;
        if (mode === 'previous') mode = quiz.last_mode;
        dialog.attr('data-mode', mode);
        switch (mode) {
            case 'loading':
                dialog.attr('data-itype', 'loading');
                dialog.attr('data-atype', 'loading');
                dialog.find('.atype').html('Loading...');
                break;

            case 'no_items':
                dialog.attr('data-itype', 'loading');
                dialog.attr('data-atype', 'reading');
                dialog.find('.atype').html('No questions found!');
                break;

            case 'question':
                ask_question();
                break;

            case 'summary':
                dialog.attr('data-atype', 'reading');
                dialog.find('.atype').html('[Enter] for new quiz, [Esc] to return');
                dialog.find('.answer input').val('').prop('readonly', true);
                dialog.attr('data-result', '');
                populate_errors();
                break;
        }
        if (quiz.mode !== quiz.last_mode) quiz.last_mode = quiz.mode;
        quiz.mode = mode;
    }

    function is_svg(img) {return (img.content_type === 'image/svg+xml') && (img.metadata.inline_styles === false);}

    //========================================================================
    // ask_question()
    //------------------------------------------------------------------------
    function ask_question(erase_old_answer) {
        var dialog = quiz.dialog;
        var qinfo = quiz.qinfo.load(quiz.index);

        toggle_help('off');
        dialog.attr('data-itype', qinfo.item.type);
        dialog.attr('data-qtype', qinfo.question.type);
        dialog.attr('data-atype', qinfo.answer.type);
        if (quiz.message_timer) {
            clearTimeout(quiz.message_timer);
            delete quiz.message_timer;
        }
        dialog.removeClass('message');

        // Draw the question
        var question = dialog.find('.question');
        question.attr('lang', qinfo.question.lang);
        if (qinfo.question.html || qinfo.item.type !== 'radical') {
            question.html(qinfo.question.html);
        } else {
            qinfo.question.svg_promise.then(function(qinfo){
                if (quiz.index === qinfo.index) question.html(qinfo.question.html);
            });
        }

        // Initialize the answer
        var input = $('#ss_quiz .answer input');
        var old_answer = get_user_answer(quiz.index);
        if (erase_old_answer) {
            if (old_answer[0] !== '') quiz.stats[old_answer[0]]--;
            update_quiz_stats();
            set_user_answer(quiz.index, '', '');
            old_answer = ['', ''];
        }
        if (old_answer[0] !== '') {
            dialog.attr('data-result', old_answer[0]);
            input.val(old_answer[1]).prop('readonly', true);
        } else {
            dialog.attr('data-result', '');
            input.val('').prop('readonly', false);
        }

        if (qinfo.answer.lang === 'ja') {
            if (input.attr('lang') !== 'ja') {
                input.attr('lang', 'ja');
                wanakana.bind(input[0], {IMEMode:true});
            }
        } else {
            if (input.attr('lang') === 'ja') {
                input.attr('lang', 'en');
                wanakana.unbind(input[0]);
            }
        }

        // Populate the help window
        dialog.find('.help').attr('lang',qinfo.answer.lang).html(to_title_case(qinfo.answer.good.join(', '))+(qinfo.answer.help_suffix || ''));
        dialog.find('.atype').html(qinfo.answer.html);

        // Update progress stats
        update_quiz_stats();

        // If question is audio, play audio now.
        if (!erase_old_answer && qinfo.question.type === 'audio') {
            play_audio(true /* force_play */, qinfo);
        }

        input.focus();

        quiz.qinfo.prep(quiz.index);
    }

    //========================================================================
    // play_audio()
    //------------------------------------------------------------------------
    function play_audio(force_play, qinfo) {
        if (quiz.settings.mute_audio) return;
        if (!force_play && !quiz.settings.play_audio) return;
        if (!qinfo) qinfo = quiz.qinfo.load(quiz.index);
        if (!qinfo) return;
        if (!qinfo.question.audio_promise) return;
        qinfo.question.audio_promise.then(function(qinfo){
            if (!((quiz.index === qinfo.index) ||
                  (quiz.settings.lightning_mode && quiz.index === (qinfo.index + 1)))) return;
            qinfo.question.audio.currentTime = 0;
            qinfo.question.audio.play();
        });
    }

    //========================================================================
    // load_qinfo()
    //------------------------------------------------------------------------
    function load_qinfo(index) {
        if (index < 0 || index >= quiz.stats.total) return null;
        if (!quiz.qinfo.cache[index]) populate_qinfo(index);
        return quiz.qinfo.cache[index];
    }

    //========================================================================
    // prep_qinfo()
    //------------------------------------------------------------------------
    function prep_qinfo(index) {
        Object.keys(quiz.qinfo.cache).forEach(function(cache_idx){
            if (cache_idx < index-2 || cache_idx > index+2) {
                delete quiz.qinfo.cache[cache_idx];
            }
        });
        for (var ofs = 1; ofs <= 2; ofs++) {
            populate_qinfo(index+ofs);
        }
    }

    //========================================================================
    // populate_qinfo()
    //------------------------------------------------------------------------
    function populate_qinfo(index) {
        if (index < 0 || index >= quiz.stats.total) return;
        if (quiz.qinfo.cache[index]) return;
        var qinfo = {index:index, item:{}, question:{}, answer:{}};
        quiz.qinfo.cache[index] = qinfo;

        var grp_idx = quiz.serial_list[index];
        var group = quiz.group_list[grp_idx[0]];
        var item = group.item;
        var qnatype = group.qna[grp_idx[1]];
        qinfo.first_in_group = (grp_idx[1] == 0);
        qinfo.item.type = item.object;
        qinfo.item.object = item;
        qinfo.question.type = {
            char2read:'characters', char2mean:'characters', mean2read:'meaning',
            read2mean:'reading', aud2read:'audio', aud2mean:'audio'
        }[qnatype];
        qinfo.answer.type = {
            char2read:'reading', char2mean:'meaning', mean2read:'reading',
            read2mean:'meaning', aud2read:'reading', aud2mean:'meaning'
        }[qnatype];
        qinfo.answer.html = to_title_case(qinfo.item.type+' '+qinfo.answer.type);

        var synonyms = [];
        try {synonyms = item.study_materials.meaning_synonyms || [];} catch(e) {}
        var meanings = item.data.meanings.map(meaning => meaning.meaning);
        if (quiz.settings.synonyms_order === 'first') {
            meanings = synonyms.concat(meanings).map(meaning => meaning.toLowerCase());
        } else {
            meanings = meanings.concat(synonyms).map(meaning => meaning.toLowerCase());
        }

        if (qinfo.item.type === 'vocabulary') {
            qinfo.question.audio_promise = new Promise(function(resolve, reject){
                qinfo.question.audio = new Audio();
                qinfo.question.audio.oncanplaythrough = function(){
                    resolve(qinfo);
                }
                if (item.id !== undefined) {
                    var audio_sources = item.data.pronunciation_audios;
                    var filtered_sources;
                    switch (quiz.settings.audio_type) {
                        case 'mp3': filtered_sources = audio_sources.filter(a => a.content_type == 'audio/mpeg'); break;
                        case 'ogg': filtered_sources = audio_sources.filter(a => a.content_type == 'audio/ogg'); break;
                        default: filtered_sources = audio_sources;
                    }
                    if (filtered_sources.length !== 0) audio_sources = filtered_sources;
                    switch (quiz.settings.audio_gender) {
                        case 'male': filtered_sources = audio_sources.filter(a => a.metadata.gender == 'male'); break;
                        case 'female': filtered_sources = audio_sources.filter(a => a.metadata.gender == 'female'); break;
                        case 'rotate':
                            quiz.gender = quiz.gender || 'female';
                            quiz.gender = (quiz.gender === 'female' ? 'male' : 'female');
                            filtered_sources = audio_sources.filter(a => a.metadata.gender == quiz.gender);
                            break;
                        default: filtered_sources = audio_sources;
                    }
                    if (filtered_sources.length !== 0) audio_sources = filtered_sources;
                    if (audio_sources.length === 0) {
                        qinfo.question.audio.src = null;
                    } else {
                        qinfo.question.audio.src = audio_sources[Math.floor(Math.random() * audio_sources.length)].url;
                    }
                }
            });
        }

        switch (qinfo.question.type) {
            case 'characters':
                qinfo.question.lang = 'ja';
                if (qinfo.item.type === 'radical' && !item.data.characters) {
                    var svg_url = item.data.character_images.filter(is_svg)[0].url;
                    qinfo.question.svg_promise = wkof.load_file(svg_url).then(function(svg){
                        qinfo.question.html = svg;
                        return qinfo;
                    });
                } else {
                    qinfo.question.html = item.data.characters;
                }
                break;

            case 'reading':
                qinfo.question.lang = 'ja';
                qinfo.question.html = item.data.readings.map(reading => reading.reading).join(', ');
                break;

            case 'meaning':
                qinfo.question.lang = 'en';
                qinfo.question.html = to_title_case(meanings.join(', '));
                break;

            case 'audio':
                qinfo.question.lang = 'ja';
                qinfo.question.html = '<span class="icon-audio"></span>';
                qinfo.answer.help_suffix = '<br><span lang="ja">('+item.data.characters+')</span>';
                break;
        }

        var idx, idx2, reading;
        qinfo.answer.other = [];
        qinfo.answer.bad = [];
        qinfo.answer.reading_type = '';
        switch (qinfo.answer.type) {
            case 'reading':
                qinfo.answer.good = [];
                qinfo.answer.lang = 'ja';
                for (idx in item.data.readings) {
                    reading = item.data.readings[idx];
                    if (qinfo.item.type === 'vocabulary' || reading.accepted_answer) {
                        qinfo.answer.good.push(reading.reading);
                        if (qinfo.item.type === 'kanji') {
                            qinfo.answer.reading_type = reading.type.replace('yomi','\'yomi');
                        }
                    } else {
                        qinfo.answer.other.push(reading.reading);
                    }
                    qinfo.answer.bad = meanings;
                }
                break;

            case 'meaning':
                qinfo.answer.good = meanings;
                qinfo.answer.lang = 'en';
                if (!item.data.readings) break;
                for (idx in item.data.readings) {
                    reading = item.data.readings[idx];

                    if (qinfo.item.type === 'vocabulary' || reading.accepted_answer) {
                        qinfo.answer.bad.push(reading.reading);
                    }
                }
                break;
        }
    }

    //========================================================================
    // get_user_answer()
    //------------------------------------------------------------------------
    function get_user_answer(index) {
        var grp_idx = quiz.serial_list[index];
        var group = quiz.group_list[grp_idx[0]];
        if (!group.answer || !group.answer[grp_idx[1]]) return ['', ''];
        return group.answer[grp_idx[1]];
    }

    //========================================================================
    // set_user_answer()
    //------------------------------------------------------------------------
    function set_user_answer(index, status, answer) {
        var grp_idx = quiz.serial_list[index];
        var group = quiz.group_list[grp_idx[0]];
        if (!group.answer) group.answer = [];
        group.answer[grp_idx[1]] = [status, answer];
    }

    //========================================================================
    // submit_answer()
    //------------------------------------------------------------------------
    function submit_answer() {
        var dialog = quiz.dialog;
        var input = $('#ss_quiz .answer input');

        var qinfo = quiz.qinfo.load(quiz.index);
        var item = qinfo.item.object;
        var itype = qinfo.item.type;
        var atype = qinfo.answer.type;
        var raw_answer = input.val();
        var answer = raw_answer;
        var action = 'fail';
        var msgcfg = quiz.settings.messages;
        var is_exact = true;
        var is_multi = false;
        var message;

        if (answer === '') {
            atype = 'ignore';
            action = 'shake';
        }

        switch (atype) {
            case 'reading':
                answer = wanakana.toHiragana(answer);
                if (qinfo.answer.good.indexOf(answer) >= 0 || qinfo.answer.good.indexOf(raw_answer) >= 0) {
                    action = 'correct';
                    if (qinfo.answer.good.length > 1) is_multi = true;
                    if (is_multi && msgcfg.show_multi_reading) message = 'This item has multiple readings';
                } else if (itype === 'kanji' && qinfo.answer.other.indexOf(answer) >= 0) {
                    action = 'shake';
                    message = 'We\'re looking for the '+to_title_case(qinfo.answer.reading_type)+' reading';
                } else {
                    var bad = qinfo.answer.bad.map(function(english){
                        return wanakana.toHiragana(english.toLowerCase());
                    });
                    if (bad.indexOf(answer) >= 0) {
                        action = 'shake';
                        message = 'We\'re looking for the reading, not the meaning';
                    } else if (!wanakana.isKana(answer)) {
                        action = 'shake';
                        message = 'Your answer contains invalid characters';
                    } else {
                        action = 'incorrect';
                    }
                }
                break;

            case 'meaning':
                var is_correct = false;
                is_exact = false;
                answer = answer.toLowerCase();
                var allow_typos = (quiz.settings.allow_typos === true);
                for (var idx in qinfo.answer.good) {
                    var good_answer = qinfo.answer.good[idx];
                    if (answer === good_answer) {
                        is_correct = true;
                        is_exact = true;
                        break;
                    } else if (allow_typos && jw_distance(good_answer, answer) > 0.9) {
                        is_correct = true;
                    }
                }
                if (is_correct) {
                    action = 'correct';
                    if (!is_exact && msgcfg.show_slightly_off === true) message = "Your answer was slightly off";
                } else {
                    var alt_answer = wanakana.toHiragana(answer,{IMEMode:true});
                    if (qinfo.answer.bad.indexOf(alt_answer) >= 0) {
                        action = 'shake';
                        message = 'We\'re looking for the meaning, not the reading';
                    } else {
                        action = 'incorrect';
                    }
                }
                break;
        }

        if (action !== 'shake') set_user_answer(quiz.index, action, answer);
        switch (action) {
            case 'correct':
                quiz.stats.correct++;

                // If question is reading, play audio now.
                if (qinfo.answer.type === 'reading' && qinfo.question.type !== 'audio') {
                    play_audio(false /* force_play */, qinfo);
                }

                if ((quiz.settings.lightning_mode === true) &&
                    (!is_multi || !msgcfg.show_multi_reading || !msgcfg.halt_multi_reading) &&
                    (is_exact || !msgcfg.show_slightly_off || !msgcfg.halt_slightly_off )) {

                    return quiz.next();
                } else {
                    update_quiz_stats();
                    input.prop('readonly', true);
                }
                dialog.attr('data-result', 'correct');
                break;

            case 'shake':
                shake(input);
                input.focus();
                break;

            case 'incorrect':
                quiz.stats.incorrect++;
                update_quiz_stats();
                input.prop('readonly', true);
                dialog.attr('data-result', 'incorrect');

                if (quiz.settings.autoshow_correct && !quiz.showing_help) {
                    toggle_help('on');
                }
                break;
        }

        if (message) {
            dialog.find('.message').text(message);
            dialog.addClass('message');
            if (quiz.message_timer) {
                clearTimeout(quiz.message_timer);
                delete quiz.message_timer;
            }
            quiz.message_timer = setTimeout(function(){
                dialog.removeClass('message');
                quiz.message_timer = undefined;
            },2750);
        }
    }

    //========================================================================
    // shake()
    //------------------------------------------------------------------------
    function shake(elem) {
        var dist = '15px';
        var speed = 75;
        var right = {padding:'0 '+dist+' 0 0'}, left = {padding:'0 0 0 '+dist}, center = {padding:"0 0 0 0"};

        elem.animate(left,speed/2).animate(right,speed)
        .animate(left,speed).animate(right,speed)
        .animate(left,speed).animate(center,speed/2);
    }

    //========================================================================
    // prev_question()
    //------------------------------------------------------------------------
    function prev_question() {
        switch (quiz.mode) {
            case 'question':
                if (quiz.index > 0) quiz.index--;
                quiz.ask();
                break;

            case 'summary':
                if (quiz.index === quiz.stats.total) {
                    quiz.index = quiz.stats.total - 1;
                    update_quiz_stats();
                }
                set_mode('question');
                break;
        }
        quiz.ask();
    }

    //========================================================================
    // next_question()
    //------------------------------------------------------------------------
    function next_question() {
        switch (quiz.mode) {
            case 'question':
                if (quiz.index < quiz.stats.total-1) {
                    quiz.index++;
                    quiz.ask();
                } else {
                    quiz.index = quiz.stats.total;
                    update_quiz_stats();
                    set_mode('summary');
                }
                break;

            case 'summary':
                if (quiz.do_requiz) {
                    delete quiz.do_requiz;
                    if (!quiz.original_items) {
                        quiz.original_items = quiz.items;
                    }
                    quiz.items = quiz.requiz_items;
                    delete quiz.requiz_items;
                } else {
                    delete quiz.requiz_items;
                    if (quiz.original_items) {
                        quiz.items = quiz.original_items;
                        delete quiz.original_items;
                    }
                    quiz.stats.round++;
                }
                quiz.start({keep_round_count:true});
                break;
        }
    }

    //========================================================================
    // populate_errors()
    //------------------------------------------------------------------------
    function populate_errors() {
        var dialog = quiz.dialog;
        var percent_elem = dialog.find('.summary .percent');
        var errors_elem = dialog.find('.summary .errors');

        var total = quiz.stats.correct + quiz.stats.incorrect;
        var percent = (total === 0 ? 100 : 100 * quiz.stats.correct / total);
        percent_elem.text((Math.round(percent*100)/100).toString()+'%');
        if (total === quiz.stats.correct) {
            $('#ss_quiz .summary .requiz').addClass('hidden');
        } else {
            $('#ss_quiz .summary .requiz').removeClass('hidden');
        }

        var idx;
        var err_list = dialog.find('.summary .errors');
        err_list.html('');
        var requiz_items = {};
        quiz.requiz_items = [];
        for (idx = 0; idx < quiz.stats.total; idx++) {
            var grp_idx = quiz.serial_list[idx];
            var group = quiz.group_list[grp_idx[0]];
            if (!group.answer) continue;
            var answer = group.answer[grp_idx[1]];
            if (!answer || answer[0] !== 'incorrect') continue;
            var item = group.item;
            if (!requiz_items[item.id]) {
                requiz_items[item.id] = 1;
                quiz.requiz_items.push(item);
            }
            var itype = item.object;
            var qnatype = group.qna[grp_idx[1]];
            answer = answer[1];
            var qtype = {
                char2read:'characters', char2mean:'characters', mean2read:'meaning',
                read2mean:'reading', aud2read:'audio', aud2mean:'audio'
            }[qnatype];
            var atype = {
                char2read:'reading', char2mean:'meaning', mean2read:'reading',
                read2mean:'meaning', aud2read:'reading', aud2mean:'meaning'
            }[qnatype];
            var qlang = (qtype === 'meaning' ? 'en' : 'ja');
            var alang = (atype === 'meaning' ? 'en' : 'ja');
            var qtitle = to_title_case(itype+' '+atype);
            var atitle;
            switch (atype) {
                case 'meaning':
                    var synonyms = [];
                    try {synonyms = item.study_materials.meaning_synonyms || [];} catch(e) {}
                    var meanings = item.data.meanings.map(meaning => meaning.meaning);
                    if (quiz.settings.synonyms_order === 'first') {
                        meanings = synonyms.concat(meanings).map(meaning => meaning.toLowerCase());
                    } else {
                        meanings = meanings.concat(synonyms).map(meaning => meaning.toLowerCase());
                    }
                    atitle = meanings.join(', ');
                    break;
                case 'reading':
                    atitle = to_title_case(item.data.readings.map(reading => reading.reading).join(', '));
                    break;
            }
            var qtext = item.data.slug;
            if (qtype === 'audio') qtext += ' <i class="icon-audio"></i>';
            var atext = answer + ' <i class="icon-remove-sign wrong"></i>';
            err_list.append(
                '<li><span class="que" lang="'+qlang+'" title="'+qtitle+'">'+qtext+'</span>'+
                '<i class="icon-long-arrow-right"></i>'+
                '<span class="ans" lang="'+alang+'" title="'+atitle+'">'+atext+'</span></li>'
            );
        }
    }

    //========================================================================
    // update_quiz_stats()
    //------------------------------------------------------------------------
    function update_quiz_stats() {
        var stats = $('#ss_quiz .stats_labels');
        var stats_width = quiz.stats.total.toString().length; // Number of digits in quiz counter
        var remaining = quiz.stats.total - quiz.index;
        stats.html(
            'Round: '+('       '+quiz.stats.round).slice(-1*stats_width)+'<br>'+
            'Remaining: '+('       '+remaining).slice(-1*stats_width)+'<br>'+
            'Correct: '+('       '+quiz.stats.correct).slice(-1*stats_width)+'<br>'+
            'Incorrect: '+('       '+quiz.stats.incorrect).slice(-1*stats_width)
        );
    }

    //========================================================================
    // quiz_key_handler()
    //------------------------------------------------------------------------
    var keycode_xlat = {
        '8':'Backspace', '13':'Enter', '27':'Escape', '37':'ArrowLeft', '39':'ArrowRight', '65':'KeyA',
        '69':'KeyE', '72':'KeyH', '76':'KeyL', '80':'KeyP', '82':'KeyR', '83':'KeyS', '112':'F1',
    };
    function quiz_key_handler(e) {
        if (quiz_settings_state === 'open') return true;
        var input = quiz.dialog.find('.answer input');
        var input_readonly = input.prop('readonly');
        var code;
        if (e.type === 'keydown') {
            if (e.originalEvent.keyCode) {
                code = keycode_xlat[e.originalEvent.keyCode] || 'Unknown';
            } else {
                code = e.originalEvent.code;
            }
        } else {
            code = String.fromCharCode(e.charCode);
        }

        if (code === 'Enter') {
            if (quiz.mode === 'question' && !input_readonly) {
                quiz.submit(e);
            } else {
                quiz.next();
            }
        } else if (code === 'Escape') {
            process_escape();
        } else if (code === 'F1' || code === '?') {
            toggle_help();
        } else if (code === 'Backspace') {
            // Prevent backspace from navigating away from the page.
            if (quiz.mode !== 'question') return false;
            if (input_readonly) quiz.ask(true /* erase_old_answer */);
            return true;
        } else if (e.ctrlKey || e.metaKey) {
            switch (code) {
                case 'KeyA':
                    if (e.shiftKey) {
                        toggle_audio();
                    } else {
                        play_audio(true);
                    }
                    break;
                case 'KeyE': process_escape(); break;   // End
                case 'KeyH': toggle_help(); break;      // Help
                case 'KeyL': toggle_lightning(); break; // Lightning
                case 'KeyP': toggle_pairing(); break;   // Pairing
                case 'KeyR': // Re-quiz
                    if (quiz.mode !== 'summary' || quiz.dialog.find('.summary .requiz').hasClass('hidden')) break;
                    quiz.requiz();
                    break;
                case 'KeyS': manual_shuffle(); break;
                case 'ArrowLeft': quiz.prev(); break;
                case 'ArrowRight': quiz.next(); break;
                default: return true;
            }
        } else {
            var is_special = (e.key.length !== 1);
            if (is_special) return true;

            // Let the browser handle regular keys in the input box
            if (e.target === input[0]) return true;

            // Let the browser handle all other keys while not in question mode.
            if (quiz.mode !== 'question') return true;
        }
        return false;
    }

    //========================================================================
    // manual_shuffle()
    //------------------------------------------------------------------------
    function manual_shuffle() {
        var keep_round_count = true;
        if (quiz.shuffle_timer === undefined) {
            quiz.shuffle_timer = setTimeout(function(){
                delete quiz.shuffle_timer;
            }, 1000);
        } else {
            clearTimeout(quiz.shuffle_timer);
            delete quiz.shuffle_timer;
            keep_round_count = false;
        }
        quiz.start({keep_round_count:keep_round_count});
    }

    //========================================================================
    // process_escape()
    //------------------------------------------------------------------------
    function process_escape() {
        if (quiz.escape_timer === undefined) {
            quiz.escape_counter = 1;
            quiz.escape_timer = setTimeout(function(){
                delete quiz.escape_counter;
                delete quiz.escape_timer;
            }, 750);
        } else {
            quiz.escape_counter++;
            if (quiz.escape_counter === 3) {
                clearTimeout(quiz.escape_timer);
                delete quiz.escape_timer;
                quiz.close();
                return;
            }
        }
        switch (quiz.mode) {
            case 'question':
                set_mode('summary');
                break;

            case 'summary':
                if (quiz.index === quiz.stats.total) quiz.index = quiz.stats.total-1;
                set_mode('previous');
                break;
        }
    }

    //========================================================================
    // toggle_audio()
    //------------------------------------------------------------------------
    function toggle_audio() {
        var elem = $('#ss_quiz .settings .ss_audio');
        if (quiz.settings.mute_audio) {
            quiz.settings.mute_audio = false;
            quiz.settings.play_audio = false;
            elem.removeClass('mute');
            elem.removeClass('active');
        } else if (quiz.settings.play_audio) {
            quiz.settings.mute_audio = true;
            quiz.settings.play_audio = false;
            elem.addClass('mute');
            elem.removeClass('active');
        } else {
            quiz.settings.mute_audio = false;
            quiz.settings.play_audio = true;
            elem.removeClass('mute');
            elem.addClass('active');
        }
        wkof.Settings.save('ss_quiz');
    }

    //========================================================================
    // toggle_help()
    //------------------------------------------------------------------------
    function toggle_help(value) {
        if (quiz.mode !== 'question') return;
        var elem = $('#ss_quiz .settings .ss_help');
        switch (value) {
            case 'on':
                elem.addClass('active');
                quiz.dialog.addClass('help');
                quiz.showing_help = true;
                break;
            case 'off':
                elem.removeClass('active');
                quiz.dialog.removeClass('help');
                quiz.showing_help = false;
                break;
            default:
                elem.toggleClass('active');
                quiz.dialog.toggleClass('help');
                quiz.showing_help = !quiz.showing_help;
                break;
        }
        var qinfo = quiz.qinfo.load(quiz.index);
        if (quiz.showing_help && qinfo.answer.type === 'reading') play_audio(false /* force_play */);
    }

    //========================================================================
    // toggle_lightning()
    //------------------------------------------------------------------------
    function toggle_lightning() {
        var elem = $('#ss_quiz .settings .ss_lightning');
        elem.toggleClass('active');
        quiz.settings.lightning_mode = elem.hasClass('active');
        wkof.Settings.save('ss_quiz');
    }

    //========================================================================
    // toggle_pairing()
    //------------------------------------------------------------------------
    function toggle_pairing(e, initialize) {
        var elem_pair = $('#ss_quiz .settings .ss_pair');
        var elem_data = elem_pair.find('.data');
        var values = ['disabled', 'reading_first', 'meaning_first', 'random_order'];
        var value = Math.max(0, values.indexOf(quiz.settings.pairing));

        if (!initialize) value = (value + 1) % values.length;
        quiz.settings.pairing = value = values[value];
        wkof.Settings.save('ss_quiz')

        switch (value) {
            case 'disabled': elem_data.text('Disabled'); elem_pair.removeClass('active'); break;
            case 'reading_first': elem_data.text('Reading First'); elem_pair.addClass('active'); break;
            case 'meaning_first': elem_data.text('Meaning First'); elem_pair.addClass('active'); break;
            case 'random_order': elem_data.text('Random Order'); elem_pair.addClass('active'); break;
        }
        if (!initialize) quiz.start({keep_round_count:true});
    }

    //========================================================================
    // drag()
    //------------------------------------------------------------------------
    function drag(e) {
        var dlg = $(e.currentTarget).closest('.dialog');
        var pos = dlg.position();
        var ofs = {x: e.pageX-pos.left, y: e.pageY-pos.top};
        $('body')
        .on('mousemove.ss_quiz_drag touchmove.ss_quiz_drag', function(e){
            dlg.css({left: Math.max(0,e.pageX-ofs.x), top: Math.max(0,e.pageY-ofs.y)});
        })
        .on('mouseup.ss_quiz_drag touchend.ss_quiz_drag', function(e){
            $('body').off('.ss_quiz_drag');
        });
    }

    wkof.set_state('ss_quiz', 'ready');

})(window.ss_quiz);
