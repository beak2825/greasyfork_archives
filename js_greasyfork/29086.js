// ==UserScript==
// @name         Simple Print LeetCode Problems
// @namespace    https://greasyfork.org/en/users/114838-groundzyy
// @version      0.3.3.31
// @description  Removed unnecessary elements in the page for a clear PDF print of the leetcode question only
// @author       groundzyy
// @match        https://leetcode.com/problems/*
// @downloadURL https://update.greasyfork.org/scripts/29086/Simple%20Print%20LeetCode%20Problems.user.js
// @updateURL https://update.greasyfork.org/scripts/29086/Simple%20Print%20LeetCode%20Problems.meta.js
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

waitForKeyElements (
    "div.like-and-dislike"
    , commentCallbackFunction
);

//--- Page-specific function to do what we want when the node is found.
function commentCallbackFunction (jNode) {

    $('div.content-wrapper > div.navbar').remove();

    var diff = $('#desktop-side-bar div ul.side-bar-list li:nth-child(2) span:nth-child(2)').text();
    $('.question-title h3').text($('.question-title h3').text() + ' (' + diff + ')');

    $('head title').text($('.question-title h3').text().trim().replace('.', ''));
    $('div.like-and-dislike').parent().remove();
    $('nav.tab-view').parent().remove();
    $('div.action-btn-base').remove();
    $('div#interviewed-div').remove();
    $('div.question-detail-bottom').parent().remove();
    $('div.notepad-wrapper').remove();
    $('div#notepad-container').remove();
    $('div#lc_navbar_placeholder').remove();
    $('#supportModal').remove();
    $('div.CreateModal-base').remove();
    $('#lc-alert-container').remove();
    $('.showspoilers').remove();
    $('#MathJax_Message').remove();


    if ($('#tags-company a')) {
        $('#tags-company').html('Companies: ' + $('#tags-company').html());
        $('.question-panel').append($('#tags-company'));
    }
    if ($('#tags-topic a')) {
        $('#tags-topics').html('Topics: ' + $('#tags-topics').html());
        $('.question-panel').append($('#tags-topics'));
    }
    if ($('#tags-question a')) {
        $('#tags-question').html('Similar Questions: ' + $('#tags-question').html());
        $('.question-panel').append($('#tags-question'));
    }
    $('footer').remove();
    $('#desktop-side-bar').remove();

    $('body').css('font-size', '24px');
    $('body').css('line-height', '24px');
    $('.question-title').css('margin-top', '2px');
    $('.spoilers').css('display', '');
    $('pre').css('font-size', '24px');
    $('pre').css('white-space', 'pre-wrap');
    $('a.btn-primary').css('font-size', '18px');
    $('div.question-title h3').css('font-size', '32px');
    $('p').css('margin-bottom', '20px');
    $('p').css('margin-top', '20px');
    $('div.content-wrapper').css('padding-bottom', '0px');

    $('div a').removeClass('text-sm btn-xs label text-sm label-M label-E');
    $('#tags-company a').addClass('text-lg');
    $('#tags-topics a').addClass('text-lg');
    $('div a').removeClass('round');
    $('#tags-question a').addClass('text-lg btn btn-default btn-round text-lg');
    $('div > a').removeAttr("href");

    $('a').removeClass("label-Easy");
    $('a').removeClass("label-Medium");
    $('a').removeClass("label-Hard");

    $('div#tags-company, div#tags-topics, div#tags-question').css('font-size', '14px');
    $('div a.btn').removeClass('sidebar-tag text-lg');

};
