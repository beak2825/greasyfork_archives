// ==UserScript==
// @name Quora Shit Remover
// @namespace http://tampermonkey.net/
// @version 0.2
// @description Remove shit from quora feed
// @match https://www.quora.com/*
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/372793/Quora%20Shit%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/372793/Quora%20Shit%20Remover.meta.js
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

function scrub() {
    'use strict';

    $('.HyperLinkBundle').each(function() {
      $(this).remove();
      // console.log('Removing link');
    });

    $('.Bundle div').not('.checked').each(function() {
      var $this = $(this);
      
      $this.addClass('checked');
      
      if ($this.text() == 'Promoted') {
        $this.closest('.Bundle').parent().remove();
        // console.log('Removing promoted post (type 1)');
      }
    });
  
    $('.Bundle p').not('.checked').each(function() {
      var $this = $(this);
      
      $this.addClass('checked');
      
      if ($this.text().match(/^ *promoted +by +/)) {
        $this.closest('.Bundle').parent().remove();
        // console.log('Removing promoted post (type 2)');
      }
    });
  
    $('a[target]').removeAttr('target');
    $('a[action_mousedown]').removeAttr('action_mousedown').removeClass();

}

waitForKeyElements (
	"div",
    scrub
);

$('body').on('click', 'a', function(e) {
  var href = $(this).prop('href');
  
  if (href.match(/quora.com/)) {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = href;
    return false;
  }
})