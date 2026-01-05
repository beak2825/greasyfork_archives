// ==UserScript==
// @name        WaniKani Lesson Tab Reorder
// @namespace   rfindley
// @description Reorder the tabs on the Lesson page
// @version     1.0.0
// @include     https://www.wanikani.com/lesson/session*
// @copyright   2016+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17054/WaniKani%20Lesson%20Tab%20Reorder.user.js
// @updateURL https://update.greasyfork.org/scripts/17054/WaniKani%20Lesson%20Tab%20Reorder.meta.js
// ==/UserScript==

wkltr = {};

(function(gobj) {
    
    var settings = {
        order: {
            rad: [0,1],     // 0=Name, 1=Examples
            kan: [0,2,1,3], // 0=Radical Breakdown, 1=Meaning, 2=Reading, 3=Examples
            voc: [0,2,1]    // 0=Kanji Breakdown, 1=Meaning, 2=Reading
        }
    };

    var ignore_keychange = false;

    //-------------------------------------------------------------------
    // Reorder tab contents.
    //-------------------------------------------------------------------
    function rearrange_tab_contents() {
        $.each(['rad', 'kan', 'voc'], function(idx, type) {
            // Rearrange tab contents.
            var order = settings.order[type];
            var content_ul = $('#lesson #supplement-'+type);
            var content_li = content_ul.children();
            var new_content_li = [];
            for (var idx = 0; idx < order.length; idx++)
                new_content_li.push(content_li[order[idx]]);
            content_li.detach();
            content_ul.append(new_content_li);
        });
    }

    //-------------------------------------------------------------------
    // Reorder tab labels.
    //-------------------------------------------------------------------
    function rearrange_tabs() {
        console.log('Rearranging tabs...');
        var tab_li = $('#lesson #supplement-nav li');
        var type = tab_li.attr('data-itemtype').slice(0,3);
        var order = settings.order[type];
        var idx;

        var tab_text = [];
        // Save original tab labels
        for (idx = 0; idx < tab_li.length; idx++)
            tab_text.push(tab_li.eq(idx).text());
        // Rearrange tab labels
        for (idx = 0; idx < tab_li.length; idx++)
            tab_li.eq(idx).text(tab_text[order[idx]]);

        ignore_keychange = false;
    }

    //-------------------------------------------------------------------
    // Listen for change to lesson index.
    //-------------------------------------------------------------------
    function key_change(key, action) {
        // Lesson Index changes twice per item change, so ignore duplicates.
        if (ignore_keychange === true) return;
        ignore_keychange = true;

        // In case other scripts (Reorder?) manipulate the lesson index,
        // we want to schedule our rearrangement in a future time slot.
        // Also, this fulfills the other half of our 'ignore_keychange'
        // above, since 'ignore' gets set back to 'false' after our work
        // is done.
        setTimeout(rearrange_tabs, 0);
    }

    //-------------------------------------------------------------------
    // Startup. Runs at document 'load' event.
    //-------------------------------------------------------------------
    function startup() {
        // Do a one-time rearrangement of the tab contents.
        // WK's javascript will populate them properly thereafter.
        rearrange_tab_contents();
        
        // Listen for navigation to new lessons.
        $.jStorage.listenKeyChange('l/lessonIndex', key_change);
    }
        
    // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        startup();
    else
        window.addEventListener("load", startup, false);

}(wkltr));