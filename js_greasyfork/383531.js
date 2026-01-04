// ==UserScript==
// @name          WaniKani Review Item Count Details
// @namespace     https://www.wanikani.com
// @description   Show amount of radical, kanji, vocabulary items remaining during review
// @author        irrelephant
// @version       1.0
// @include       *://www.wanikani.com/review/session*

// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/383531/WaniKani%20Review%20Item%20Count%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/383531/WaniKani%20Review%20Item%20Count%20Details.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.wkof) {
        var response = confirm('WaniKani Item Hover Details script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    wkof.include('ItemData');
    wkof.ready('ItemData').then(fetch_items);

    // This function is called when the ItemData module is ready to use.
    function fetch_items() {
        // Retrieve only the /subjects and /assignments endpoints.
        // var config = 'subjects, assignments';
        var config = {
            wk_items: {
                options: {
                    assignments: false,
                    review_statistics: false,
                    study_materials:false
                }
            }
        };
        wkof.ItemData.get_items(config)
            .then(setup);
    }

    function setup(items) {
        console.log('Retrieved ' + items.length + ' items.');
                $('#stats').append('<span id="review-count-details"></span>');

        addStyle("#review-count-details span{padding-left:10px;opacity:0.8;}");


           $.jStorage.listenKeyChange('activeQueue', function (key, action) {
            updateInfo(items);
      });

             $.jStorage.listenKeyChange('reviewQueue', function (key, action) {
            updateInfo(items);
      });



    }

    function updateInfo(allItems) {
        var itemCount = {
            radical:0,
            kanji: 0,
            vocabulary:0
        };

        let reviewQueue = $.jStorage.get('activeQueue').concat($.jStorage.get('reviewQueue'));

        reviewQueue.forEach(function(queueItem){
            var type = getItemType(allItems, queueItem);
            itemCount[type]++;
        }, this);


        renderInfo(itemCount);

    }

    function renderInfo(itemCount){
        $("#review-count-details").html("<span>R: "+ itemCount.radical + "</span><span>K: "+itemCount.kanji + "</span><span>V: "+itemCount.vocabulary+"</span>");
    }


    function getItemType(allItems, queueItem){
        var type = "";
        var queueItemId = queueItem
        allItems.forEach(function(item){
            if(item.id==queueItem.id){
                type = item.object;
            }
        }, this);
        return type;
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

}());
