// ==UserScript==
// @name         WaniKani Disable Default Answers
// @namespace    *://www.wanikani.com
// @version      0.2.1
// @description  Prevent default answers from being marked as correct. Answer in your synonyms.
// @author       polv
// @match      *://www.wanikani.com/*vocabulary/*
// @match      *://www.wanikani.com/*kanji/*
// @match      *://www.wanikani.com/*radical/*
// @match      *://www.wanikani.com/review/session*
// @match      *://www.wanikani.com/lesson/session*
// @copyright  2017 polv
// @downloadURL https://update.greasyfork.org/scripts/36070/WaniKani%20Disable%20Default%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/36070/WaniKani%20Disable%20Default%20Answers.meta.js
// ==/UserScript==

var word = "";
var exception_array = $.jStorage.get('exception_array', []);

(function() {
    'use strict';

 // Hook into App Store
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    $(`<style type='text/css'>
            .hover_blacklist, .not_accepted {
                text-decoration:line-through;
            }
            .blackened {
                display: inline;
            }
        </style>`).appendTo('head');
    
    var url = document.URL;
    var answer_array = [];
    
    if (url.indexOf('vocabulary') != -1 || url.indexOf('kanji') != -1 || url.indexOf('radical') != -1) {
        word = $('span.japanese-font-styling-correction:first').text().trim();
        
        $('div.alternative-meaning:first').addClass('blacklist');
        $('div.blacklist h2').remove();
        $('div.blacklist').prepend('<h2>Acceptable Answers</h2>');

        var text = $('div.span12 h1').text().replace(/[0-9]|[\u3000-\u9faf]/g, '').trim();
        if($('div.blacklist p').text()  !== '') $('div.blacklist p').prepend(', ');
        $('div.blacklist p').prepend(text);
        answer_array = $('div.blacklist p').text().trim().toLowerCase().split(', ');
        

        var html = '';
        
        for(var i = 0; i<answer_array.length; i++){
            html += '<p class="blackened ' + isException(word, answer_array[i]) + '">' + answer_array[i] + '</p>';
            if(i+1<answer_array.length) html += ', ';
        }
        $('div.blacklist p').remove();
        $('div.blacklist').append(html);
        
        $('p.blackened').hover(function(){
            $(this).toggleClass('hover_blacklist');
        });

        $('p.blackened').click(function(){
            $(this).toggleClass('not_accepted');
            
            if(!isException(word, $(this).text())) exception_array.push([word, $(this).text()]);
            else removeException(word, $(this).text());
            
            $.jStorage.set('exception_array', exception_array);
        });
    
    } else if (url.indexOf('review/session') != -1 || url.indexOf('lesson/session') != -1) {
        $.jStorage.listenKeyChange('currentItem', function(key) {
            word = $('div#character').text().trim();
        });

        var observer = new MutationObserver(function(mutations) {
            for(var i=0; i<mutations.length; ++i) {
                if(mutations[i].target.classList[0]) {
                    if(isException(word, $("#user-response").val())){
                        console.log('Exception!');
                        WKO_ignoreAnswer();
                        wkdoublecheck.set_state('first_submit');
                    }
                }
            }
        });
        observer.observe($('#answer-form fieldset').get(0), { attributes: true });
        
        var observer2 = new MutationObserver(function(mutations) {
            $("#supplement-voc-meaning .col1 h2:nth-child(1)").html('Acceptable Answers');
            var answer_array = [$('#meaning').html().toLowerCase(),];
            if ($('#supplement-voc-synonyms').html() != '(None)')
                answer_array = answer_array.concat($('#supplement-voc-synonyms').html().toLowerCase().split(', '));
            
            var html = '';
            for(var i = 0; i<answer_array.length; i++){
                html += '<p class="blackened ' + isException(word, answer_array[i]) + '">' + answer_array[i] + '</p>';
                if(i+1<answer_array.length) html += ', ';
            }
            $('#supplement-voc-synonyms').html(html);
            
            $('p.blackened').hover(function(){
                $(this).toggleClass('hover_blacklist');
            });
            $('p.blackened').click(function(){
                $(this).toggleClass('not_accepted');
                
                if(!isException(word, $(this).text())) exception_array.push([word, $(this).text()]);
                else removeException(word, $(this).text());

                $.jStorage.set('exception_array', exception_array);
            });
        });
        observer2.observe($('div#character').get(0), { attributes: true, childList: true, characterData: true });

        waitForKeyElements("section#item-info-meaning", function(){
            $("#item-info-col1").prepend('<section class="blacklist"><h2>Acceptable Meanings</h2></section>');

            var answer_array = $('section#item-info-meaning').text().slice(8).toLowerCase().split(', ');

            var html = '';
            for(var i = 0; i<answer_array.length; i++){
                html += '<p class="blackened ' + isException(word, answer_array[i]) + '">' + answer_array[i] + '</p>';
                if(i+1<answer_array.length) html += ', ';
            }
            $('section.blacklist').append(html);
            $('section#item-info-meaning').css('display','none');
            
            if ($('#answer-form input').attr('lang') == 'ja') $('section.blacklist').css('display','none');
            
            $('p.blackened').hover(function(){
                $(this).toggleClass('hover_blacklist');
            });
            $('p.blackened').click(function(){
                $(this).toggleClass('not_accepted');
                
                if(!isException(word, $(this).text())) exception_array.push([word, $(this).text()]);
                else removeException(word, $(this).text());

                $.jStorage.set('exception_array', exception_array);
            });
        });
    }
})();

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
        delete controlObj [controlKey];
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

function isException(word, exception) {
    for(var i=0; i<exception_array.length; i++){
        if(exception_array[i][0] == word && exception_array[i][1] == exception) 
            return "not_accepted";
    }
    
    return false;
}

function removeException(word, exception) {
    for(var i=0; i<exception_array.length; i++){
        if(exception_array[i][0] == word && exception_array[i][1] == exception) {
            exception_array.splice(i,1);
            return "Done";
        }
    }
    
    return "Failed";
}

function WKO_ignoreAnswer() {
    $('#answer-form fieldset').removeClass('correct');
    $("#answer-form form").effect("shake", {}, 400).find("input").focus();
    return true;
}