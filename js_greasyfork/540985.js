// ==UserScript==
// @name         juexiaotime
// @namespace    http://tampermonkey.net/
// @version      2025-05-24
// @description  juexiaotime exam
// @author       You
// @match        https://www.juexiaotime.com/mokaopaper/*
// @match        https://www.juexiaotime.com/exam-graph?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juexiaotime.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/540985/juexiaotime.user.js
// @updateURL https://update.greasyfork.org/scripts/540985/juexiaotime.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitForKeyElements ( selectorTxt,  actionFunction,  bWaitOnce,    iframeSelector) {
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
    waitForKeyElements('#objective_topic_title',r=>{
         $('.exam-page').css('-webkit-user-select','unset').css('min-width','auto');


        let target = $('#objective_topic_title')[0];

        $('button:contains("下一题")').on('click',function(){
            $('#next').remove();
            $('#next0').remove();
            $('#next1').remove();
            $('#next2').remove();
            $('#next3').remove();

             let key =  $('#objective_topic_title')[0].textContent;
             $('#objective_topic_title').append(`<a id="next" href="https://www.baidu.com/s?wd=${key}" target='_blank'>Search</a>`);

            $('.choiceContext').each((i,item)=>{
              let key = $(item).find('.choicetext')[0].textContent;
              $(item).append(`<a id="next${i}" href="https://www.baidu.com/s?wd=${key}" target='_blank'>Search</a>`);
            })
        })

    })

    waitForKeyElements('#kgtitle',r=>{
        $('.exam-answer').css('-webkit-user-select','unset');
    })
    document.querySelectorAll('*').forEach(function(element) {
      element.oncontextmenu = null;
    });


})();