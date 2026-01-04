// ==UserScript==
// @name         WaniKani Fast Answer + Always play audio
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       onani
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
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/522980/WaniKani%20Fast%20Answer%20%2B%20Always%20play%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/522980/WaniKani%20Fast%20Answer%20%2B%20Always%20play%20audio.meta.js
// ==/UserScript==


window.wk_fawa = {};

(function(global) {

    /* global wkof, Stimulus, WaniKani, importShim, $ */

    'use strict';

    if (!window.wkof) {
        if (confirm("WaniKani Fast Answer + Always play audio requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?"))
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
    var idPronounceUrl = {};


    if(window.location.pathname == "/" || window.location.pathname == "/dashboard"){
        wkof.include('Apiv2, Menu, Settings');
        wkof.ready('Menu').then(install_menu);
        wkof.ready('Settings').then(install_settings);

    } else {
        wkof.include('Apiv2, Settings, ItemData');
        wkof.ready('ItemData').then(fetchItems);

        wkof.ready('Settings').then(install_settings).then(function(){
            $('#user-response').after("<div id='divCorrect' class='hidden quiz-input__input'><span id='lblCorrect' type='text' style='display: none;' disabled></span></div>");
            window.addEventListener("didAnswerQuestion", function (e) {
                showCorrect(e);
                if(idPronounceUrl.hasOwnProperty(e.detail.subjectWithStats.subject.id)){
                    let pronounceAudio = new Audio(idPronounceUrl[e.detail.subjectWithStats.subject.id]);
                    pronounceAudio.volume = 1; // Set volume to maximum
                    pronounceAudio.play();
                }
            })
            window.addEventListener(`willShowNextQuestion`, e => {
                $('#divCorrect').addClass('hidden');
            });
            window.addEventListener("didUnanswerQuestion", function (e) {
                $('#divCorrect').addClass('hidden');
            })
        });
    }

    function fetchItems() {
        wkof.ItemData.get_items({wk_items: {options: {subjects: true}}})
        .then(processItems);
    }

    function processItems(items) {
    items.forEach(item => {
        if (item.data.pronunciation_audios) {
            const femaleWebm = item.data.pronunciation_audios.find(audio =>
                audio.content_type === 'audio/webm' &&
                audio.metadata?.gender === 'female'
            );
            if (femaleWebm) {
                // Store the URL if we found a matching audio
                idPronounceUrl[item.id] = femaleWebm.url;
            }
            }
        });
    }

    function install_menu() {
        wkof.Menu.insert_script_link({
            script_id: 'fawa',
            name: 'fawa',
            submenu:   'Settings',
            title:     'WaniKani Fast Answer + Always play audio',
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
            title: 'WaniKani Fast Answer + Always play audio',
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

    function getAnswer(e){
        let meanings = e.detail.subjectWithStats.subject.meanings.map(r => r.text).join(', ');
        let readings = (e.detail.subjectWithStats.subject.readings?.[0]?.text || 'Error').toString();

        return {
            meanings: meanings,
            readings: readings
        }
    }

    function showCorrect(e){
        let answer = getAnswer(e);
        let reading = answer.readings;
        let meaning = answer.meanings;

         if(e.detail.questionType == 'reading'){
            $('#lblCorrect').text(reading);
            $('#divCorrect').removeClass('hidden');
         } else if (e.detail.questionType == 'meaning'){
             $('#lblCorrect').text(meaning);
             $('#divCorrect').removeClass('hidden');
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