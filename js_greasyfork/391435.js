// ==UserScript==
// @name         WaniKani Reviews Color Progress Bar And Real Percentage
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       Jigen
// @license      MIT
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @require      https://greasyfork.org/scripts/432561-jigen-s-upload-of-waitforkeyelements/code/Jigen's%20upload%20of%20WaitForKeyElements.js?version=971522
// @require      https://greasyfork.org/scripts/369353-jigen-s-other-stuff/code/Jigen's%20other%20stuff.js?version=604095
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391435/WaniKani%20Reviews%20Color%20Progress%20Bar%20And%20Real%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/391435/WaniKani%20Reviews%20Color%20Progress%20Bar%20And%20Real%20Percentage.meta.js
// ==/UserScript==

function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;
 
    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);
 
    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;
 
            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }
 
    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];
 
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}


window.wk_reviewsColorProgressBar = {};

(function(global) {
    'use strict';

    if (!window.wkof) {
        if (confirm('WaniKani Reviews Color Progress Bar And Real Percentage requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    var settings_dialog;
    var defaults = {
        barHeight: 5,
        swap: false,
        colorBar: true,
        realPercent: true,
        seperateRightWrong: true
    };
    //var failList = [];

    var wrongCount = 0;
    var rightCount = 0;
    if(window.location.pathname == "/" || window.location.pathname == "/dashboard"){
        wkof.include('Apiv2, Menu, Settings');
        wkof.ready('Menu').then(install_menu);
        wkof.ready('Settings').then(install_settings);
    } else {
        wkof.include('Settings');
        waitForKeyElements("#progress-bar", function(){
            wkof.ready('Settings')
                .then(install_settings)
                .then(function(){
            //wkof.settings.rcpb = $.extend(true, {}, defaults, wkof.settings.rcpb);
                //$.jStorage.listenKeyChange('wrongCount', function (key, action) {
                //    debugger;
                //    if(wrongCount != $.jStorage.get('wrongCount')){
                //        wrongCount = $.jStorage.get('wrongCount');
                //        if(failList.includes($.jStorage.get('lastItems')[$.jStorage.get('lastItems').length - 1]) == false){
                //            failList.push($.jStorage.get('lastItems')[$.jStorage.get('lastItems').length - 1]);
                //        }
                //    }
                //});
                var total = $.jStorage.get('reviewQueue').length + $.jStorage.get('activeQueue').length;
                $.jStorage.listenKeyChange('lastItems', function (key, action) {
                    //jQuery.grep($.jStorage.index(), function( n, i ) {
                    //    return ( n.match('^[rkv][0-9]+') );
                    //});
                    //$.jStorage.get('lastItems')[$.jStorage.get('lastItems').length - 1];
                    if($.jStorage.get($.jStorage.get('lastItems')[$.jStorage.get('lastItems').length - 1]).mi + ($.jStorage.get($.jStorage.get('lastItems')[$.jStorage.get('lastItems').length - 1]).ri == null ? 0 : $.jStorage.get($.jStorage.get('lastItems')[$.jStorage.get('lastItems').length - 1]).ri) > 0){
                        wrongCount = wrongCount + 1;
                    } else {
                        rightCount = rightCount + 1;
                    }
                    $('#barCorrect').css('width',(rightCount / total * 100) + '%');
                    $('#barWrong').css('width',(wrongCount / total * 100) + '%');
                    $('#real-correct-rate').text((rightCount / (rightCount + wrongCount) * 100).toFixed(2));
                    $('#completed-correct-count').text(rightCount);
                    $('#completed-incorrect-count').text(wrongCount);
                });
            });
        });
    }

    function install_menu() {
        wkof.Menu.insert_script_link({
            script_id: 'rcpb',
            name: 'rcpb',
            submenu:   'Settings',
            title:     'WaniKani Reviews Color Progress Bar And Real Percentage',
            on_click:  open_settings
        });
    }
    function open_settings() {
        settings_dialog.open();
    }
    function install_settings() {
        settings_dialog = new wkof.Settings({
            script_id: 'rcpb',
            name: 'rcpb',
            title: 'WaniKani Reviews Color Progress Bar',
            on_save: process_settings,
            settings: {
                'grp_main': {
                    type:'group',
                    label:'Main',
                    content:{
                        'colorBar': {type:'checkbox',label:'Show Color Progress',default:defaults.colorBar},
                        'realPercent': {type:'checkbox',label:'Show Real Percent',default:defaults.realPercent},
                        'swap': {type:'checkbox',label:'Swap Correct/Incorrect',default:defaults.swap},
                        'barHeight': {type:'number',label:'Bar Height (in px)',default:defaults.barHeight}
                    }
                }
            }
        });
        settings_dialog.load().then(function(){
            wkof.settings.rcpb = $.extend(true, {}, defaults, wkof.settings.rcpb);
                if(wkof.settings.rcpb.swap == true){
                    $('#progress-bar #bar').after('<div id="barWrong" style="width: 0%;">&nbsp;</div><div id="barCorrect" style="width: 0%;">&nbsp;</div>');
                    $('#completed-count').after('<span id="completed-correct-count">0</span>');
                    $('#completed-count').prev().before('<i id="completed-incorrect-count-icon" class="icon-remove"></i><span id="completed-incorrect-count">0</span>');
                } else {
            debugger;
                    $('#progress-bar #bar').after('<div id="barCorrect" style="width: 0%;">&nbsp;</div><div id="barWrong" style="width: 0%;">&nbsp;</div>');
                    $('#completed-count').after('<span id="completed-correct-count">0</span><i id="completed-incorrect-count-icon" class="icon-remove completed-incorrect-count-icon"></i><span id="completed-incorrect-count">0</span>');
                }
                $('#correct-rate').after('<span id="real-correct-rate">100</span>');
            var css = '#barCorrect { ' +
                ' background-color: #88cc00;' +
                '}' +
                '#barWrong {' +
                ' background-color: #ff0033;' +
                '}' +
                '#real-correct-rate:after {' +
                ' content: "%";' +
                '}'
            if(wkof.settings.rcpb.colorBar == true){
                css = css + '#progress-bar {' +
                    ' display: flex;' +
                    ' height: ' + wkof.settings.rcpb.barHeight + 'px; '+
                    '}' +
                    '#progress-bar #bar {' +
                    ' display: none;' +
                    '}'
            } else {
                css = css + '#progress-bar #barWong, #progress-bar #barCorrect {' +
                    ' display: none;' +
                '}'
            }
            if(wkof.settings.rcpb.realPercent == true){
                css = css + '#completed-count, #correct-rate {' +
                    ' display: none;' +
                    '}'
            } else {
                css = css + '#completed-correct-count, #completed-incorrect-count, #completed-incorrect-count-icon, #real-correct-rate {'+
                    ' display: none;' +
                    '}'
            }
            jigen.addStyle(css);
        });
    }
    function process_settings(){
        settings_dialog.save();
        console.log('Settings saved!');
    }
})(window.wk_reviewsColorProgressBar);