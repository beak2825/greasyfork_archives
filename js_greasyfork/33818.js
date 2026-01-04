// ==UserScript==
// @name         WaniKani Fast Abridged Wrong/Multiple Answer
// @namespace    http://tampermonkey.net/
// @version      4.12
// @description  try to take over the world!
// @author       You
// @match        https://*.wanikani.com/subjects/review*
// @match        https://*.wanikani.com/subjects/extra_study*
// @match        https://wanikani.com/
// @match        https://wanikani.com/dashboard
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @match        https://preview.wanikani.com/
// @match        https://preview.wanikani.com/dashboard
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33818/WaniKani%20Fast%20Abridged%20WrongMultiple%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/33818/WaniKani%20Fast%20Abridged%20WrongMultiple%20Answer.meta.js
// ==/UserScript==

window.wk_fawa = {};

//var wrongCountFAWA;
(function(global) {


    /* global wkof, Stimulus, WaniKani, importShim, $ */

    'use strict';
    // Hook into App Store
    // try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    if (!window.wkof) {
        if (confirm('WaniKani Fast Abridged Wrong/Multiple Answer requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    var settings_dialog;
    var defaults = {
        alwaysShow: false,
        alwaysShowOnlyMultiple: false,
        dontShowWrong: false,
        correctColor: "#88cc00",
        incorrectColor: "#ff0033",
        customColor: false
    };


    if(window.location.pathname == "/" || window.location.pathname == "/dashboard"){
        wkof.include('Apiv2, Menu, Settings');
        wkof.ready('Menu').then(install_menu);
        wkof.ready('Settings').then(install_settings);
        debugger;
        $('.dashboard__content').before("<section class='dashboard__notice'><div class='dashboard__notice-section'><span class='main'>WaniKani Fast Abridged Wrong/Multiple Answer has been retired</span><span class='link'><a href='https://greasyfork.org/en/scripts/511539-wanikani-reviews-plus'>Wanikani Reviews Plus</a> has taken its place, with more features</span><span class='lick'></span><a href='https://community.wanikani.com/t/userscript-wanikani-reviews-plus/67455/17'>Community Discussion</a></div></section>");
    } else {
        wkof.include('Apiv2, Settings');
        wkof.ready('Settings').then(install_settings).then(function(){
            $('#user-response').after("<div id='divCorrect' class='hidden quiz-input__input'><span id='lblCorrect' type='text' style='display: none;' disabled></span></div>");
            window.addEventListener("didAnswerQuestion", function (e) {
                showCorrect(e);
            })
            window.addEventListener(`willShowNextQuestion`, e => {
                $('#divCorrect').addClass('hidden');
            });
            window.addEventListener("didUnanswerQuestion", function (e) {
                $('#divCorrect').addClass('hidden');
            })
        //document.body.addEventListener('keydown', function(event){
        //    if ((event.which === 27 || event.which === 8) &&
        //        (event.target.nodeName === 'BODY') &&
        //        (!document.querySelector('#wkofs_doublecheck')))
        //    {
        //        $('#divCorrect').addClass('hidden');
        //    }
        //    return true;
        //});
        });
    }

    function install_menu() {
        wkof.Menu.insert_script_link({
            script_id: 'fawa',
            name: 'fawa',
            submenu:   'Settings',
            title:     'Fast Abridged Wrong/Multiple Answer',
            on_click:  open_settings
        });
    }
    function open_settings() {
        settings_dialog.open();
    }
    function install_settings() {
        settings_dialog = new wkof.Settings({
            script_id: 'fawa',
            name: 'fawa',
            title: 'Fast Abridged Wrong/Multiple Answer',
            on_save: process_settings,
            settings: {
				'grp_main': {
                    type:'group',
                    label:'Main',
                    content:{
                        'alwaysShow': {type:'checkbox',label:'Always Show Correct Answers',default:defaults.alwaysShow,on_change:alwaysShowChanged},
                        'alwaysShowOnlyMultiple': {type:'checkbox',label:'&nbsp;&nbsp;&nbsp;(Only if multiple answers)',default:defaults.alwaysShowOnlyMultiple},
                        'dontShowWrong': {type:'checkbox',label:'&nbsp;&nbsp;&nbsp;(Don\'t show wrongs)',default:defaults.dontShowWrong}
                    }
                },
                'grp_colors':{
                    type: 'group',
                    label: 'colors',
                    content: {
                        'customColor': {type:'checkbox',label:'Custom Colors',default:defaults.customColor,on_change:customColorsChanged},
                        'correctColor': {type:'color',label:'Correct',default:defaults.correctColor},
                        'incorrectColor': {type:'color',label:'Incorrect',default:defaults.incorrectColor},
                    }
                }
            }
        });
        settings_dialog.load().then(function(){
            wkof.settings.fawa = $.extend(true, {}, defaults, wkof.settings.fawa);
            addStyle('#divCorrect.hidden {' +
                     '  display: none !important;' +
                     '}' +
                     '#divCorrect {' +
                     '  width: 100% !important;' +
                     '  display:table !important;' +
                     '}' +
                     '#lblCorrect {' +
                     '  height: ' + $('#answer-form input[type=text]').css('height') + ' !important;' +
                     '  min-height: ' + $('#answer-form input[type=text]').css('height') + ' !important;' +
                     '  display:table-cell !important;' +
                     '  vertical-align:middle; !important;' +
                     '  font-family: ' + $('#user-response').css('font-family') + ';' +
                     '  font-size: ' + $('#user-response').css('font-size') + ';' +
                     '  color: #fff; !important;' +
                     '  -webkit-text-fill-color: #fff; !important;' +
                     '  text-shadow: ' + ($(window).width() < 767 ? '1px 1px 0 rgba(0,0,0,0.2);' : '2px 2px 0 rgba(0,0,0,0.2);') + ' !important;' +
                     '  -webkit-transition: background-color 0.1s ease-in; !important;' +
                     '  -moz-transition: background-color 0.1s ease-in; !important;' +
                     '  -o-transition: background-color 0.1s ease-in; !important;' +
                     '  transition: background-color 0.1s ease-in; !important;' +
                     '  opacity: 1 !important;' +
                     '}' +
                     '.quiz-input__input-container[correct=true] #divCorrect {' +
                     ' background-color: ' + (wkof.settings.fawa.customColor == true ? wkof.settings.fawa.correctColor : '#88cc00') + ' !important;' +
                     '}' +
                     '.quiz-input__input-container[correct=false] #divCorrect {' +
                     ' background-color: ' + (wkof.settings.fawa.customColor == true ? wkof.settings.fawa.incorrectColor : '#f03') + '!important;' +
                     '}' +
                     '.dashboard__notice {' +
                     ' background: deeppink;' +
                     ' color: white;' +
                     ' padding: 20px;' +
                     ' border-radius: 6px;' +
                     ' margin-bottom: 20px;' +
                     '}' +
                     '.dashboard__notice .dashboard__notice-section {' +
                     ' row-gap: 2px;' +
                     ' display: grid;' +
                     '}' +
                     '.dashboard__notice .main {' +
                     ' font-size: 2rem;' +
                     ' padding-bottom: 5px;' +
                     ' font-weight: bold;' +
                     '}' +
                     '.dashboard__notice .link {' +
                     ' font-size: 1.5rem;' +
                     '}')
        });
    }
    function alwaysShowChanged(){
        if($(this).prop('checked') == false){
            $('#fawa_alwaysShowOnlyMultiple').attr('disabled','disabled');
            $('#fawa_alwaysShowOnlyMultiple').prop("checked",false);
            $('#fawa_alwaysShowOnlyMultiple').closest('.row').css('display','none');
            $('#fawa_dontShowWrong').attr('disabled','disabled');
            $('#fawa_dontShowWrong').prop("checked",false);
            $('#fawa_dontShowWrong').closest('.row').css('display','none');
        } else {
            $('#fawa_alwaysShowOnlyMultiple').removeAttr('disabled');
            $('#fawa_alwaysShowOnlyMultiple').closest('.row').css('display','block');
            $('#fawa_dontShowWrong').removeAttr('disabled');
            $('#fawa_dontShowWrong').closest('.row').css('display','block');
        }
    }
    function customColorsChanged(){
        if($(this).prop('checked') == false){
            $('#fawa_grp_colors .row:gt(0)').css('display','none');
        } else {
            $('#fawa_grp_colors .row:gt(0)').css('display','block');
        }
    }
    function process_settings(){
        settings_dialog.save();
        console.log('Settings saved!');
    }

    function showBar(correct){
        $('#lblCorrect').css('display','block');
    }

    function getMeanings(e){
        let quiz_input = Stimulus.getControllerForElementAndIdentifier(document.querySelector(`[data-controller~="quiz-input"]`),'quiz-input')
        let synonyms = quiz_input.quizUserSynonymsOutlet.synonymsForSubjectId(e.detail.subjectWithStats.subject.id);
        //let synonyms = [];
        //if(quiz_input.quizUserSynonymsOutlet.synonyms.hasOwnProperty(e.detail.subjectWithStats.subject)){
        //    synonyms = [...quiz_input.quizUserSynonymsOutlet.synonyms[5894]];
        //}
        return [...e.detail.subjectWithStats.subject.meanings, ...synonyms].join(", ")
    }

    function getReadings(e){
        return e.detail.subjectWithStats.subject.readings.map(r => r.reading).join(", ")
    }

    function showCorrect(e){
          switch((e.detail.subjectWithStats.subject.type + ' ' + e.detail.questionType).toLowerCase()) {
            case "vocabulary reading":
                  if(e.detail.results.passed && wkof.settings.fawa.alwaysShowOnlyMultiple == true && getReadings(e).indexOf(",") === -1) return;
                showBar(e.detail.results.passed);
                  $('#lblCorrect').text(getReadings(e));
                $('#divCorrect').removeClass('hidden');
                break;
            case "vocabulary meaning":
            case "kanji meaning":
            case "radical meaning":
            case "kanavocabulary meaning":
                  debugger;
                if(e.detail.results.passed && wkof.settings.fawa.alwaysShowOnlyMultiple == true && (getMeanings(e).indexOf(",") === -1)) return;
                showBar(e.detail.results.passed);
                $('#lblCorrect').text(getMeanings(e));
                $('#divCorrect').removeClass('hidden');
                break;
            case "kanji reading":
                switch(e.detail.subjectWithStats.subject.primary_reading_type){
                    case "onyomi":
                        if(e.detail.results.passed && wkof.settings.fawa.alwaysShowOnlyMultiple == true && e.detail.subjectWithStats.subject.onyomi.length === 1) return;
                        showBar(e.detail.results.passed);
                        $('#lblCorrect').text(e.detail.subjectWithStats.subject.onyomi.join(", "));
                        $('#divCorrect').removeClass('hidden');
                        break;
                    case "kunyomi":
                        if(e.detail.results.passed && wkof.settings.fawa.alwaysShowOnlyMultiple == true && e.detail.subjectWithStats.subject.kunyomi.length === 1) return;
                        showBar(e.detail.results.passed);
                        $('#lblCorrect').text(e.detail.subjectWithStats.subject.kunyomi.join(", "));
                        $('#divCorrect').removeClass('hidden');
                        break;
                }
                break;
        }
    }

    function addStyle(aCss) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }
})(window.wk_fawa);