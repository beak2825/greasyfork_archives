// ==UserScript==
// @id           SortRemoveYouTubeWatchLaterlist
// @namespace    https://greasyfork.org/users/42190
// @name         Sort/Remove YouTube Watch Later List
// @Author       Jus7ForFun
// @version      0.2.2
// @description  Adds sort and remove button for the Youtube Watch Later page
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @license      GNU GPL v3
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/19427/SortRemove%20YouTube%20Watch%20Later%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/19427/SortRemove%20YouTube%20Watch%20Later%20List.meta.js
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

waitForKeyElements ("#pl-video-table", SortButton);

waitForKeyElements(".playlist-actions", RemoveButton);


function qselector(query, context) {
    return (context || document).querySelector(query);
}

function MakeButton(text, action) {
    var btn = document.createElement('button');
    btn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default';
    btn.innerHTML = '<span class="yt-uix-button-content">' + text + '</span>';
    btn.addEventListener('click', action, false);
    qselector('.playlist-actions').appendChild(btn);
}


function RemoveButton () {
    MakeButton ('Clear The List', function(evt) {
        Removelist ();
    });
}


function SortButton () {
    MakeButton ('Sort Alphabetically', function(evt) {
        SortList ();
    });
}


function Removelist(){
    var el = document.getElementsByClassName('pl-video-edit-remove');
    if (el.length > 0) {
        el[el.length-1].click();
        setTimeout(Removelist,200);
    }
}

function SortList () {
    $('html, body').css('display', 'none');
    var WatchLaterListRows = [],
        SortedList = '';
    $('#pl-video-table > tbody  > tr').each(function() {
        var video = $(this);
        WatchLaterListRows.push(video[0]);
        video.remove();
    });
    var Sorted = $.makeArray(WatchLaterListRows).sort(function(a,b){
        return ( $(a).attr('data-title') < $(b).attr('data-title') ) ? -1 : 1;
    });
    $.each(Sorted, function(index, video) {
        SortedList += video.outerHTML;
    });
    $('#pl-load-more-destination').append(SortedList);
    $('html, body').css('display', 'block');
}