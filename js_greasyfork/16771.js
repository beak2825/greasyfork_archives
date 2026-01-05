// ==UserScript==
// @name       Filter YouTube subscriptions videos
// @version    0.2
// @description Allows to hide matched videos from subscriptions page
// @match      http://www.youtube.com/feed/subscriptions
// @match      http://youtube.com/feed/subscriptions
// @match      https://www.youtube.com/feed/subscriptions
// @match      https://youtube.com/feed/subscriptions
// @license    GPLv3 - http://www.gnu.org/licenses/gpl-3.0.en.html
// @copyright  sergey.larionov@gmail.com
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.1.0/lodash.js

// @namespace https://greasyfork.org/users/29165
// @downloadURL https://update.greasyfork.org/scripts/16771/Filter%20YouTube%20subscriptions%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/16771/Filter%20YouTube%20subscriptions%20videos.meta.js
// ==/UserScript==


var install = jQuery.now();
var funcFilter = function() {
    var start = jQuery.now();
    var aElementList = [];
    
 
    var videoMatchHide = {};
    videoMatchHide['Arumba'] = ['Punch Club', 'Arumba Plays The Binding of Isaac', 'EUIV', 'Hero Defense Haunted Island'];
    videoMatchHide['EnterElysium'] = ['XCOM 2'];
    videoMatchHide['*'] = ['Crashlands', 'Lego Marvel Avengers', 'Train Valley'];
    
    _.each(videoMatchHide, function (v, k) {
        videoMatchHide[k] = videoMatchHide[k].map(function (a) {
            return new RegExp(a);
        });
    });
    
    var allVideos = _.map($('div.expanded-shelf div.yt-thumb.video-thumb'), function (item) {
        return $(item).closest('.feed-item-container.browse-list-item-container');
    });
    
    var len = allVideos.length;
    
    var toHide = [];
    for (var i = 0; i < len; i++) {
        var row = allVideos[i].clone();
           channelName = $.trim(row.find('.shelf-title-table').text());
           videoTitle = $.trim(row.find('.yt-uix-tile h3').text());
        
        var checkMatches = function (matches) {
             if (_.some(matches, function (m) {
                     return m.test(videoTitle);
                 })) {
                     
                 toHide.push(allVideos[i]);
             }
        };
        
        if (videoMatchHide[channelName] && videoMatchHide[channelName].length) {
            checkMatches(videoMatchHide[channelName]);
        }
        
        if (videoMatchHide['*'] && videoMatchHide['*'].length) {
            checkMatches(videoMatchHide['*']);
        }
    }
    
    _.each(toHide, function (a) {
        a.hide();
    });
    
    var finish = jQuery.now();
    console.log('start - ' + (finish - install) / 1000, 'finish - ' + (finish - install) / 1000, 'total - ' + (finish - start) / 1000);
};

document.addEventListener("DOMNodeInserted", _.throttle(funcFilter, 100) , false);
funcFilter();


