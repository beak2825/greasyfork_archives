// ==UserScript==
// @name         WME Feed Manager
// @namespace    http://tampermonkey.net/
// @version      2019.05.11.8
// @description  Adds easy options for clearing useless feed items
// @author       SkyviewGuru
// @copyright    2017-2019, SkyviewGuru
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369379/WME%20Feed%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/369379/WME%20Feed%20Manager.meta.js
// ==/UserScript==

$(function() {
    'use strict';
    let appTitle = 'SkyviewGuru DFS';
    let bootstrapTimeout = 1000;
    let moreTimes = 200;
    let queue = [];
    let timeBetweenMoreItems = 1000; //   1 second
    let timeBetweenPurges = 125; //     1/8 seconds

    // Bootstrap code courtesy of MapOMatic, and used with permission. Thank you sir!
    function bootstrap() {
        if (W &&
            W.loginManager &&
            W.loginManager.events &&
            W.loginManager.events.register &&
            W.map &&
            W.loginManager.user) {
            console.log('WMEFM: Initializing!');
            init();
        }
        else {
            setTimeout(function () {
                bootstrap();
            }, bootstrapTimeout);
        }
    };

    function init() {
        // Force the scrollbar to avoid accidentally clicking off the trash can and clicking an element
        $('div.tab-content').css('overflow-y','scroll');

        // Insert our button to Trim the Fat!
        $('div#sidepanel-feed div.feed-content').prepend(
            '<div class="feed-manager-skyviewguru" style="margin-bottom: 0.5em;">' +
                '<button id="btnFeedMgr-Execute">Trim the Fat!</button>' +
                '<button id="btnFeedMgr-LoadMore">Load More</button>' +
            '</div>'
        );

        // Add a listener
        $('button#btnFeedMgr-Execute').on('click',function() {
            trimTheFat();
        });
        $('button#btnFeedMgr-LoadMore').on('click',function() {
            loadLotsMore();
        });
    };

    // Load LOTS more items
    function loadLotsMore(i,itemCount) {
        console.log('WMEFM: loadLotsMore entered!!');
        let $items = $('div.feed-issues ul.feed-list li.feed-item');
        if(typeof i === 'undefined') {
            i = 1;
            itemCount = $items.length;
        }

        // Click "Load more"...
        $('div#sidepanel-feed div.feed-load-section div.feed-more div.feed-load-more').click();

        // First iteration or we have more items than we had on the last call
        if(i === 1 || $items.length > itemCount) {
            console.log('WMEFM: Entering if, iteration #' + i, '$items.length: ', $items.length, 'itemCount: ', itemCount);

            // Disable the button, we're still processing.
            $('#btnFeedMgr-LoadMore').prop('disabled',true).css( { 'background-color': 'darkgray', 'color': 'gray' } );

            // Wait briefly and load some more
            setTimeout((function(i,itemCount) {
                return function() {
                    loadLotsMore(++i);
                }
            }(i,itemCount)), timeBetweenMoreItems * i);
        }
        else {
            // Done loading
            console.log('WMEFM: Finally finished');
            $('#btnFeedMgr-LoadMore').prop('disabled',false).removeAttr('style');
            return;
        }
    };

    // Purge the items in the queue
    function purgeItems($this) {
        // Loop until the queue is fully purged.
        console.log('WMEFM: purgeItems entered, ' + queue.length + ' items to purge.');

        // Disable further purging if there are items in the queue. We'll re-enable it after we reach the final index.
        let lastItemIndex = queue.length - 1;
        if (lastItemIndex > 0) $('#btnFeedMgr-Execute').prop('disabled',true).css( { 'background-color': 'darkgray', 'color': 'gray' } );

        // Loop through each item of the queue, delay as set above.
        queue.forEach(function(item, index) {
            setTimeout( (function( item, index ) {
                return function() {
                    console.log('WMEFM: purgeItem index ' + index + ' of ' + lastItemIndex);
                    let $item = queue[index];
                    $item.find('div.inner div.delete').click();

                    // If we're done processing the last item...
                    if(index === lastItemIndex) {
                        // Re-enable purging...
                        $('#btnFeedMgr-Execute').prop('disabled',false).removeAttr('style');

                        // Clear the queue
                        queue.length = 0;
                    }
                };
            }( item, index )), (timeBetweenPurges * index) );
        });

        return;
    };

    function trimTheFat() {
        // DEBUGGING! Make it easy to see what's going on -- temporary only
        //console.clear();

        // Issues to clear, regex
        let stateRegex = /, (Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Deleware|Florida|Georgia|Hawaii|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)$/;
        let stateUSRegex = /, (Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Deleware|Florida|Georgia|Hawaii|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming), United States$/;

        let issues = {
            "mp":  {
                "state": stateRegex,
                "titles": /Missing Parking Lot Place/
            },
            "pu":  {
                //"state": stateRegex
                "state": /, /
            },
            "swdd": {
                "state": stateUSRegex
            },
            "ur":  {
                "state": stateUSRegex
            }
        };

        // Map problems
        $('.feed-issue-mp').each(function() {
            let $mp1 = $(this).find('div.inner div.content div.title span.type');
            let $mp2 = $(this).find('div.inner div.content div.subtext');

            // Map problem in general                    || Segments without details detected
            if(issues.mp.titles.test($mp1.text().trim()) || issues.swdd.state.test($mp2.text().trim()) ||

            // Routing problem
            issues.mp.state.test($mp2.text().trim())) {
                queue.push($(this));
            }
        });

        // Place update requests
        $('.feed-issue-pu').each(function() {
            let $pu = $(this).find('div.inner div.content div.subtext');
            let $pu1 = $pu.find('span.state');

            // Out-of-area PURs or No-State PURs
            if(($pu1.text() && issues.pu.state.test( $pu1.text() )) || (!$pu1.text()) ) {
                queue.push($(this));
            }
        });

        // Update requests
        $('.feed-issue-ur').each(function() {
            // Out-of-area URs
            let $ur = $(this).find('div.inner div.content div.subtext');

            if(issues.ur.state.test( $ur.text().trim() )) {
                queue.push($(this));
            }
        });

        // Purge the items
        purgeItems();
    };

    bootstrap();
});