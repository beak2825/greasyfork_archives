// ==UserScript==
// @name         Logitech Sync Plus
// @namespace    http://tampermonkey.net/
// @version      2.13.4
// @description  Logitec Sync optimizations
// @author       StvnMrtns
// @include      https://sync.logitech.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482824/Logitech%20Sync%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/482824/Logitech%20Sync%20Plus.meta.js
// ==/UserScript==

var icon_room;
var icon_configuration;
var icon_update;
var icon_reboot;
var icon_time;

var icon_dot_red;
var icon_dot_orange;
var icon_dot_green;

var icon_roommate;
var icon_computer;
var icon_camera;
var icon_tap_ip;
var icon_tap;
var icon_rally_bar_mini;
var icon_rally_bar;
var icon_remote_controller;

var line_date;
var line_date_converted;
var line_time;
var line_time_converted;
var line_datetime;

var planned_times = [];
var activity_container;
var activity_date;
var activity_line;
var activity_line_time;
var event_container;
var event_text_container;
var activity_container_prefix;
var activity_date_prefix;
var activity_line_prefix;
var activity_line_time_prefix;
var event_container_prefix;
var event_text_container_prefix;

(function() {
    'use strict';

    var version_name = '';
    var version_number = GM_info.script.version;

    // classes | class-value regulary changes at Logitech
    activity_container = 'djrOIw';   // class="containers__NonFullWidthContainer-sc-566aaba3-7 xXxXxX"               | search for class in source: class="containers__NonFullWidthContainer-sc- "
    activity_date = 'gnVpFU';        // class="Body__Body3-sc-17rsza-2 xXxXxX"                                       | search for class in source: class="Body__Body3-sc- "
    activity_line = 'gPIRzH';        // class="Body__Body4-sc-17rsza-3 xXxXxX"                                       | search for class in source: class="Body__Body4-sc- "
    activity_line_time = 'jZFCYA';   // class="Label__Label2-sc-qs84ke-1 xXxXxX"                                     | search for class in source: class="Label__Label2-sc- "

    event_container = 'cMINoF';      // class="containers__Container-sc-89dea2f6-8 xXxXxX custom-line"                                         | search for class in source: class="containers__Container-sc- "
    event_text_container = 'gBsfUV'; // class="containers__Container-sc-89dea2f6-8 Events__EventTextContainer-sc-6eb25dd1-0 xXxXxX zZzZzZ"     | search for class in source: class="Events__EventTextContainer-sc- "

    // classes | perfixes to search for
    activity_container_prefix = 'containers__NonFullWidthContainer-sc-';
    activity_date_prefix = 'Body__Body3-sc-';
    activity_line_prefix = 'Body__Body4-sc-';
    activity_line_time_prefix = 'Label__Label2-sc-';

    event_container_prefix = 'containers__Container-sc-';
    event_text_container_prefix = 'Events__EventTextContainer-sc-';

    // on load
    $(window).on('load', function() {
        initPages();

        // global structure
        editGlobalStructure(version_name, version_number);
    });

    // on change (url)
    let previousUrl = '';
    const observer = new MutationObserver(function(mutations) {
        if (location.href !== previousUrl) {
            previousUrl = location.href;
            initPages();
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);
})();

// ***********************************************
// Init pages
// ***********************************************
function initPages()
{
    var page_url = window.location.href;

    var page_inventory = page_url.indexOf('/inventory/') >= 0;
    var page_inventory_room_activity = page_url.indexOf('/inventory/') >= 0 && page_url.indexOf('/room/activity') >= 0;

    // global CSS
    editGlobalCSS();

    // Inventory/Room/Activity
    if(page_inventory_room_activity)
    {
        // wait till dynamic content is loaded
        waitForKeyElements ('div[class*="'+activity_container_prefix+'"]', editPageInventoryRoomActivity);

    }

    var icon_size = '24';

    // icons
    icon_room                   = '<svg class="custom-svg" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 4h7c1.105 0 2 .796 2 1.778v12.444c0 .982-.895 1.778-2 1.778h-7c-1.105 0-2-.796-2-1.778V5.778C4.5 4.796 5.395 4 6.5 4zm0 14h7V6h-7v12zM18 7v10a1 1 0 000 2 2 2 0 002-2V7a2 2 0 00-2-2 1 1 0 000 2zm-6.5 4h2v2h-2v-2z" fill="currentColor" fill-rule="evenodd"></path></svg>';
    icon_configuration          = '<svg class="custom-svg" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.336 3l-.12.005c-.6.055-1.101.507-1.18 1.12l-.243 1.643-.061.03a7.27 7.27 0 00-.534.302l-.108.069-1.631-.637a1.45 1.45 0 00-.477-.086c-.462 0-.9.242-1.138.652l-1.66 2.794-.062.115a1.292 1.292 0 00.388 1.577l1.36 1.034-.009.167a5.571 5.571 0 00-.004.215l.004.215.01.167-1.358 1.032c-.52.4-.656 1.11-.34 1.675L4.85 17.91c.233.404.674.643 1.14.643l.118-.005c.119-.01.237-.037.35-.08l1.628-.638.095.062c.175.109.354.21.537.303l.075.036.245 1.66c.082.636.647 1.108 1.298 1.108h3.331l.121-.005a1.299 1.299 0 001.18-1.12l.241-1.644.063-.03a7.27 7.27 0 00.533-.3l.108-.07 1.632.637c.188.063.332.086.477.086.461 0 .9-.242 1.137-.652l1.66-2.794.06-.118a1.3 1.3 0 00-.385-1.574l-1.361-1.034.01-.165a5.7 5.7 0 00.004-.217l-.004-.217-.01-.165 1.357-1.032c.52-.4.657-1.11.34-1.675L19.154 6.09a1.312 1.312 0 00-1.14-.643l-.119.005c-.118.01-.236.037-.35.08l-1.629.637-.093-.06a6.99 6.99 0 00-.537-.304l-.077-.037-.244-1.658C14.884 3.472 14.318 3 13.667 3h-3.33zm.39 1.8h2.55l.336 2.23.492.193c.433.169.84.394 1.228.678l.41.3 2.203-.842L19.2 9.425l-1.853 1.38.068.516c.035.27.052.476.052.679 0 .203-.017.41-.052.68l-.068.515 1.853 1.379-1.256 2.067-2.195-.84-.408.291a5.695 5.695 0 01-1.237.685l-.492.192-.337 2.231h-2.549l-.336-2.23-.492-.193A5.378 5.378 0 018.67 16.1l-.41-.3-2.204.841-1.255-2.066 1.854-1.379-.068-.516A5.204 5.204 0 016.535 12c0-.149.01-.308.03-.49l.09-.705L4.8 9.425l1.257-2.067 2.196.84.408-.29a5.695 5.695 0 011.237-.685l.492-.192.336-2.231zM12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm0 1.75a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5z" fill="currentColor" fill-rule="evenodd"></path></svg>';
    icon_update                 = '<svg class="custom-svg" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.7729469,10.236715 L12.7726377,18.4181932 L14.3188406,16.8730716 L15.4119525,17.9661836 L12,21.3781361 L8.58804749,17.9661836 L9.68115942,16.8730716 L11.2266377,18.4181932 L11.2270531,10.236715 L12.7729469,10.236715 Z M11.6135266,3.28019324 C14.8517702,3.28019324 17.5604023,5.63222894 18.0851482,8.75104313 C19.9019557,9.06884385 21.2753623,10.654643 21.2753623,12.5555556 C21.2753623,14.6898819 19.5449544,16.4202899 17.410628,16.4202899 L17.410628,16.4202899 L15.0917874,16.4202899 L15.0917874,14.8743961 L17.410628,14.8743961 C18.6911809,14.8743961 19.7294686,13.8361084 19.7294686,12.5555556 C19.7294686,11.2725941 18.6877563,10.2298055 17.3968179,10.2390142 L17.3968179,10.2390142 L16.6678351,10.2442142 L16.6200218,9.51678251 C16.4470014,6.88444886 14.2616229,4.82608696 11.6135266,4.82608696 C8.93275839,4.82608696 6.73152539,6.9345869 6.60238357,9.6062083 L6.60238357,9.6062083 L6.57476776,10.1775105 L6.02035029,10.3181167 C4.99774598,10.57746 4.2705314,11.4931929 4.2705314,12.5555556 C4.2705314,13.8361084 5.30881913,14.8743961 6.58937198,14.8743961 L6.58937198,14.8743961 L8.90821256,14.8743961 L8.90821256,16.4202899 L6.58937198,16.4202899 C4.4550456,16.4202899 2.72463768,14.6898819 2.72463768,12.5555556 C2.72463768,10.9715986 3.68964478,9.58500802 5.10575015,8.99726951 C5.52575438,5.76086493 8.28705686,3.28019324 11.6135266,3.28019324 Z"></path></svg>';
    icon_reboot                 = '<svg class="custom-svg" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.65 6.35a7.95 7.95 0 00-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 007.21-4.56c.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53a5.994 5.994 0 01-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0112 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z" id="a"></path></svg>';
    icon_time                   = '<svg class="custom-svg" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="TopCards__GrayRoomIcon-sc-dwm0ak-0 jNELDE"><path d="M15.5 12.25a4.75 4.75 0 110 9.5 4.75 4.75 0 010-9.5zm0 1.75a3 3 0 100 6 3 3 0 000-6zm-6-10.25v2h5v-2h1.75v2h4v6.5H18.5v-.75h-13v6.25h4.75v1.75h-6.5V5.75h4v-2H9.5zm6.75 11.55v1h1v1.75H14.5V15.3h1.75zm-8.5-7.8H5.5v2.25h13V7.5h-2.25v.75H14.5V7.5h-5v.75H7.75V7.5z" fill="currentColor" fill-rule="evenodd"></path></svg>';

    icon_dot_red                = '<svg width="16px" height="16px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="#FF2947" fill-rule="evenodd"><circle cx="12" cy="12" r="8"></circle></g></svg>';
    icon_dot_orange             = '<svg width="16px" height="16px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="#F39500" fill-rule="evenodd"><circle cx="12" cy="12" r="8"></circle></g></svg>';
    icon_dot_green              = '<svg width="16px" height="16px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="#55D464" fill-rule="evenodd"><circle cx="12" cy="12" r="8"></circle></g></svg>';

    icon_roommate               = '<svg class="custom-svg" width="'+icon_size+'" height="'+icon_size+'" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M27.53 12.1c1.252 0 2.394.715 2.946 1.845l.537 1.1c.228.468.337.963.337 1.452v-.002V25.3a3.3 3.3 0 01-3.3 3.3h-16.5a3.3 3.3 0 01-3.3-3.3v-8.805l.008-.22c.03-.45.152-.888.358-1.289l.565-1.1a3.28 3.28 0 012.915-1.786zm1.622 7.515a3.265 3.265 0 01-1.084.185H11.53c-.378 0-.742-.065-1.081-.184V25.3a1.1 1.1 0 001.1 1.1h16.5a1.1 1.1 0 001.1-1.1zM15.4 23.1a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm4.4 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm4.4 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm-6.6-2.2a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm-4.4 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm8.8 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm4.4 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm1.13-6.6H12.098a1.093 1.093 0 00-.973.595l-.564 1.1a1.097 1.097 0 00.972 1.605h16.536a1.103 1.103 0 00.98-1.584l-.536-1.1a1.093 1.093 0 00-.981-.616zm-11.58 2.2h7.7a1.1 1.1 0 010 2.2h-7.7a1.1 1.1 0 010-2.2z" fill="currentColor"></path></svg>';
    icon_computer               = '<svg class="custom-svg" width="'+icon_size+'" height="'+icon_size+'" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M27.53 12.1c1.252 0 2.394.715 2.946 1.845l.537 1.1c.228.468.337.963.337 1.452v-.002V25.3a3.3 3.3 0 01-3.3 3.3h-16.5a3.3 3.3 0 01-3.3-3.3v-8.805l.008-.22c.03-.45.152-.888.358-1.289l.565-1.1a3.28 3.28 0 012.915-1.786zm1.622 7.515a3.265 3.265 0 01-1.084.185H11.53c-.378 0-.742-.065-1.081-.184V25.3a1.1 1.1 0 001.1 1.1h16.5a1.1 1.1 0 001.1-1.1zM15.4 23.1a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm4.4 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm4.4 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm-6.6-2.2a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm-4.4 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm8.8 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm4.4 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm1.13-6.6H12.098a1.093 1.093 0 00-.973.595l-.564 1.1a1.097 1.097 0 00.972 1.605h16.536a1.103 1.103 0 00.98-1.584l-.536-1.1a1.093 1.093 0 00-.981-.616zm-11.58 2.2h7.7a1.1 1.1 0 010 2.2h-7.7a1.1 1.1 0 010-2.2z" fill="currentColor"></path></svg>';
    icon_camera                 = '<svg class="custom-svg" width="'+icon_size+'" height="'+icon_size+'" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20.3167,9.0002 C24.3647,9.0002 27.6587,12.2932 27.6587,16.3412 C27.6587,16.4312 27.6487,16.5212 27.6447,16.6122 L27.6447,16.6122 L28.5607,28.0622 L28.5637,28.0972 L28.7187,30.0372 L11.9997,30.0372 L11.9997,28.0622 L26.5537,28.0622 L25.9897,21.0022 C25.8387,21.1832 25.6787,21.3602 25.5097,21.5302 C24.1227,22.9182 22.2787,23.6822 20.3167,23.6822 C16.2687,23.6822 12.9757,20.3882 12.9757,16.3412 C12.9757,12.2932 16.2687,9.0002 20.3167,9.0002 Z M20.3167,11.0002 C17.3707,11.0002 14.9757,13.3952 14.9757,16.3412 C14.9757,19.2862 17.3707,21.6822 20.3167,21.6822 C21.7437,21.6822 23.0857,21.1262 24.0957,20.1162 C25.1037,19.1072 25.6577,17.7662 25.6577,16.3412 C25.6577,13.3952 23.2617,11.0002 20.3167,11.0002 Z M20.3164,13.0146 C21.6634,13.0146 22.8184,13.8216 23.3414,14.9736 L23.3414,14.9736 L21.5204,15.7966 C21.3114,15.3376 20.8524,15.0146 20.3164,15.0146 C20.1364,15.0146 19.9654,15.0516 19.8084,15.1176 L19.8084,15.1176 L19.0434,13.2706 C19.4354,13.1066 19.8654,13.0146 20.3164,13.0146 Z"></path></svg>';
    icon_tap_ip                 = '<svg class="custom-svg" width="'+icon_size+'" height="'+icon_size+'" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M24.42 13.86c1.683 0 2.97 1.287 2.97 2.97v3.96l3.96.693c1.089.198 1.782 1.188 1.584 2.277l-.99 5.643c-.396 1.881-1.98 3.267-3.861 3.267h-3.762c-1.188 0-2.277-.495-2.97-1.386l-4.554-5.247a2.38 2.38 0 01-.198-2.871c.594-.891 1.683-1.287 2.673-1.089l2.178.693v-5.94c0-1.683 1.287-2.97 2.97-2.97zm0 1.98c-.594 0-.99.396-.99.99v8.514l-4.653-1.188h-.198a.756.756 0 00-.495.198.301.301 0 000 .396l4.554 5.247c.396.396.891.693 1.485.693h3.762c.99 0 1.782-.693 1.98-1.584l.99-5.643-5.445-.99V16.83c0-.594-.396-.99-.99-.99zM27.5 9.9a3.3 3.3 0 013.3 3.3v7.07l-2.2-.385V13.2a1.1 1.1 0 00-.971-1.092L27.5 12.1H12.1a1.1 1.1 0 00-1.1 1.1v11a1.1 1.1 0 001.1 1.1l3.11.001c.13.53.386 1.033.76 1.46l.64.739H12.1a3.3 3.3 0 01-3.294-3.106L8.8 24.2v-11a3.3 3.3 0 013.3-3.3zm-8.8 3.3v2.2h-4.4v4.4h-2.2v-5.5a1.1 1.1 0 011.1-1.1h5.5z" fill="currentColor" fill-rule="evenodd"></path></svg>';
    icon_tap                    = '<svg class="custom-svg" width="'+icon_size+'" height="'+icon_size+'" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M25,13 C26.7,13 28,14.3 28,16 L28,20 L32,20.7 C33.1,20.9 33.8,21.9 33.6,23 L32.6,28.7 C32.2,30.6 30.6,32 28.7,32 L24.9,32 C23.7,32 22.6,31.5 21.9,30.6 L17.3,25.3 C16.6,24.5 16.5,23.3 17.1,22.4 C17.7,21.5 18.8,21.1 19.8,21.3 L22,22 L22,16 C22,14.3 23.3,13 25,13 Z M25,15 C24.4,15 24,15.4 24,16 L24,24.6 L19.3,23.4 L19.1,23.4 L19.1,23.4 C18.9,23.4 18.7,23.5 18.6,23.6 C18.5,23.7 18.5,23.9 18.6,24 L23.2,29.3 C23.6,29.7 24.1,30 24.7,30 L28.5,30 C29.5,30 30.3,29.3 30.5,28.4 L31.5,22.7 L26,21.7 L26,16 C26,15.4 25.6,15 25,15 Z M29.0117695,9 C31.6117695,9 33,10.7056409 33,13.0056409 L33,18.8 L31,18.8 L31,13.0056409 C31,11.8056409 30.5117695,11 29.0117695,11 L10.9894824,11 C9.48948241,11 9,11.8056409 9,13.0056409 L9,22.9953604 C9,24.1953604 9.48948241,25 10.9894824,25 L15.7,25 L15.7,27 L10.9894824,27 C8.38948241,27 7,25.2953604 7,22.9953604 L7,13.0056409 C7,10.7056409 8.38948241,9 10.9894824,9 L29.0117695,9 Z M17,13 L17,15 L13,15 L13,19 L11,19 L11,15 C11,13.9 11.9,13 13,13 L17,13 Z"></path></svg>';
    icon_rally_bar_mini         = '<svg class="custom-svg" width="'+icon_size+'" height="'+icon_size+'" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M15.023 25.01v1.246h10.022v-1.245h2.005V28H13.018v-2.99h2.005zM16.05 13v1.993h-4.633c-1.882 0-3.412 1.522-3.412 3.394 0 1.87 1.53 3.391 3.412 3.391h4.634v1.993h-4.634C8.431 23.771 6 21.355 6 18.387 6 15.417 8.43 13 11.417 13h4.634zm12.533 0C31.569 13 34 15.416 34 18.387c0 2.968-2.43 5.384-5.416 5.384H23.95v-1.993h4.634c1.881 0 3.411-1.521 3.411-3.391 0-1.872-1.53-3.394-3.411-3.394H23.95V13h4.634zm-8.591 1.376c2.206 0 4 1.794 4 4a3.972 3.972 0 01-1.17 2.827 3.975 3.975 0 01-2.83 1.173c-2.206 0-4-1.794-4-4s1.794-4 4-4zm0 2c-1.103 0-2 .897-2 2a2.002 2.002 0 003.415 1.414 2.002 2.002 0 00-1.415-3.413zm-7 1a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" fill-rule="evenodd"></path></svg>';
    icon_rally_bar              = '<svg class="custom-svg" width="'+icon_size+'" height="'+icon_size+'" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M15.023 26.041v1.233h10.022v-1.233h2.005V29H13.018v-2.959h2.005zM19.993 11c4.057 0 7.358 3.248 7.358 7.24 0 1.934-.764 3.751-2.153 5.118a7.372 7.372 0 01-5.205 2.124c-4.057 0-7.358-3.249-7.358-7.242 0-3.992 3.3-7.24 7.358-7.24zm-7.946 1.92v1.972h-1.63c-1.882 0-3.412 1.507-3.412 3.36 0 1.85 1.53 3.356 3.412 3.356h1.63v1.973h-1.63C7.431 23.581 5 21.19 5 18.251c0-2.94 2.43-5.332 5.417-5.332h1.63zm17.537 0c2.985 0 5.416 2.39 5.416 5.331 0 2.938-2.43 5.33-5.416 5.33h-1.63v-1.973h1.63c1.881 0 3.411-1.506 3.411-3.357 0-1.852-1.53-3.36-3.411-3.36h-1.63V12.92h1.63zm-9.591.053c-2.952 0-5.353 2.363-5.353 5.267 0 2.905 2.401 5.27 5.353 5.27 1.43 0 2.775-.55 3.787-1.546a5.191 5.191 0 001.567-3.724c0-2.904-2.403-5.267-5.354-5.267zm0 1.987c1.35 0 2.507.796 3.032 1.932l-1.826.811a1.33 1.33 0 00-1.715-.67l-.768-1.82a3.354 3.354 0 011.277-.253z" fill="currentColor" fill-rule="evenodd"></path></svg>';
    icon_remote_controller      = '<svg class="custom-svg" width="'+icon_size+'" height="'+icon_size+'" viewBox="-50 -50 400 400" xmlns="http://www.w3.org/2000/svg"><g><g><g><path d="M128.114,58.411c-2.412,2.406-2.412,6.306,0,8.724c2.419,2.412,6.312,2.412,8.724,0c7.219-7.207,18.967-7.207,26.185,0 c1.203,1.203,2.783,1.808,4.362,1.808c1.579,0,3.159-0.605,4.362-1.808c2.419-2.419,2.419-6.318,0-8.724 C159.723,46.386,140.139,46.386,128.114,58.411z"/><path d="M189.191,49.687c2.419-2.412,2.419-6.312,0-8.724c-10.483-10.489-24.433-16.27-39.266-16.27s-28.783,5.781-39.26,16.27 c-2.419,2.412-2.419,6.318,0,8.724c1.197,1.203,2.776,1.808,4.362,1.808c1.58,0,3.153-0.605,4.362-1.808 c8.151-8.157,19.004-12.655,30.535-12.655c11.538,0,22.385,4.498,30.542,12.655C182.885,52.099,186.772,52.099,189.191,49.687z"/><path d="M206.646,23.508C191.498,8.354,171.353,0,149.931,0s-41.567,8.354-56.715,23.508c-2.412,2.419-2.412,6.306,0,8.724 c2.419,2.419,6.312,2.419,8.724,0c12.821-12.821,29.863-19.886,47.99 -19.886s35.175,7.065,47.99,19.886 c1.203,1.203,2.783,1.808,4.362,1.808s3.159-0.605,4.362-1.808C209.058,29.813,209.058,25.926,206.646,23.508z"/><path d="M177.869,77.742h-61.7c-14.29,0-24.68,10.39-24.68,24.68v135.74c0,28.53,24.26,61.7,55.53,61.7 c31.276,0,55.53-33.17,55.53-61.7v-135.74C202.549,88.132,192.158,77.742,177.869,77.742z M190.209,238.162 c0,22.354-19.263,49.36-43.19,49.36s-43.19-27.006-43.19-49.36v-135.74c0-7.497,4.843-12.34,12.34-12.34h61.7 c7.497,0,12.34,4.843,12.34,12.34V238.162z"/><path d="M147.019,114.762c-10.205,0-18.516,8.305-18.516,18.51c0,10.205,8.311,18.51,18.516,18.51 c10.211,0,18.51-8.305,18.51-18.51C165.529,123.067,157.224,114.762,147.019,114.762z M147.019,139.442 c-3.406,0-6.176-2.764-6.176-6.17s2.77-6.17,6.176-6.17s6.17,2.764,6.17,6.17S150.425,139.442,147.019,139.442z"/></g></g></g></svg>';

}

// ***********************************************
// Edit global structure
// ***********************************************
function editGlobalStructure(name, number)
{
    // Logitech Sync Plus logo
    var el_dot = '<svg width="12px" height="12px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g class="custom-text-blue" fill-rule="evenodd"><circle cx="12" cy="12" r="8"></circle></g></svg>';
    var el_logoplus = '<span class="logi-plus">'+el_dot+' Logi Sync Plus '+name+' <span class="version">'+number+'</span></span><span class="logi-plus-info">'+el_dot+' <span class="info"></span></span>';
    $('div#root').prepend(el_logoplus);
}

// ***********************************************
// Edit global CSS
// ***********************************************
function editGlobalCSS()
{
    GM_addStyle('.custom-line { padding-left: 3px; padding-right: 3px; border: 1px solid transparent; border-radius: 4px; }');
    GM_addStyle('.custom-line svg.custom-svg { margin: 0px 5px 0px 0px; vertical-align: top; }');
    GM_addStyle('.custom-line span.'+activity_line_time+' svg.custom-svg { vertical-align: middle; }');
    GM_addStyle('.custom-line span.'+activity_line_time+' span.time { display: inline-block; width: 30px; text-align: right; }');
    GM_addStyle('.custom-line-reboot { margin-left: 75px; opacity: 0.35; }');
    GM_addStyle('.custom-line-reboot:hover { opacity: 0.95; }');

    GM_addStyle('.custom-badge { display: inline-flex; justify-content: center; align-items: center; color: #333333 !important; padding: 0 0.25rem; border: 1px solid transparent; border-radius: 4px; }');
    GM_addStyle('.custom-room { background: rgba(0, 0, 0, 0.05); }');
    GM_addStyle('.custom-configuration { background: rgba(100, 100, 100, 0.05); }');
    GM_addStyle('.custom-configuration p { color: #AAAAAA !important; }');
    GM_addStyle('.custom-configuration p span { color: #999999 !important; }');
    GM_addStyle('.custom-action { background: rgba(129, 78, 250, 0.75); padding-top: 3px; padding-bottom: 3px; }');
    GM_addStyle('.custom-action p { color: #FFFFFF !important; }');
    GM_addStyle('.custom-action p span { color: #999999 !important; }');

    GM_addStyle('.custom-bg-red         { background: rgba(255, 41, 71, 0.25); }');
    GM_addStyle('.custom-bg-red-soft    { background: rgba(255, 41, 71, 0.1); }');
    GM_addStyle('.custom-bg-red-full    { background: rgba(255, 41, 71, 0.75); color: #666666 !important; }');
    GM_addStyle('.custom-bg-orange      { background: rgba(216, 144, 31, 0.25); }');
    GM_addStyle('.custom-bg-orange-soft { background: rgba(216, 144, 31, 0.1); }');
    GM_addStyle('.custom-bg-orange-full { background: rgba(216, 144, 31, 0.75); color: #666666 !important; }');
    GM_addStyle('.custom-bg-green       { background: rgba(85, 212, 100, 0.35); }');
    GM_addStyle('.custom-bg-green-soft  { background: rgba(85, 212, 100, 0.1); }');
    GM_addStyle('.custom-bg-green-full  { background: rgba(85, 212, 100, 0.75); color: #666666 !important; }');

    GM_addStyle('.custom-text-bold      { font-weight: bold !important; }');
    GM_addStyle('.custom-text-red       { color: #FF2947 !important; }');
    GM_addStyle('.custom-text-orange    { color: #F39500 !important; }');
    GM_addStyle('.custom-text-green     { color: #55D464 !important; }');
    GM_addStyle('.custom-text-blue      { color: #00B8FC !important; }');

    GM_addStyle('.logi-plus { position: absolute; top: 10px; right: 50px; color: #AAAAAA; font-size: 11px; z-index: 1005; }');
    GM_addStyle('.logi-plus-info { position: absolute; bottom: 10px; right: 50px; color: #AAAAAA; font-size: 11px; z-index: 1005; line-height: 1.5em; }');
    GM_addStyle('.logi-plus-info .info { display: inline-block; }');
}

// ***********************************************
// Edit Inventory/Room/Activity page
// ***********************************************
function editPageInventoryRoomActivity()
{
    // on load
    editPageInventoryRoomActivityContent();

    // on change
    if($('div.'+activity_container)[0])
    {
        var observer = new MutationObserver(function(e) {
            editPageInventoryRoomActivityContent();
        });
        observer.observe($('div.'+activity_container)[0], {characterData: true, childList: true});
    }
}

// ***********************************************
// Edit Inventory/Room/Activity content
// ***********************************************
function editPageInventoryRoomActivityContent()
{
    var page_url = window.location.href;

    var page_inventory = page_url.indexOf('/inventory/') >= 0;
    var page_inventory_room_activity = page_url.indexOf('/inventory/') >= 0 && page_url.indexOf('/room/activity') >= 0;

    // Inventory/Room/Activity
    if(page_inventory_room_activity)
    {
        $('div.'+activity_container+' p').each(function(){

            // date
            if($(this).hasClass(activity_date))
            {
                // find and convert date
                line_date = $(this).text();
                line_date_converted = ConvertDateformat(line_date);
            }

            // information
            if($(this).hasClass(activity_line) && !$(this).hasClass('processed-line'))
            {
                $(this).parents('div').eq(1).addClass('custom-line');
                $(this).addClass('processed-line');

                // find and convert time
                line_time = $(this).parents('div').eq(1).find('span.'+activity_line_time).text();
                if(line_time.indexOf('GMT') >= 0)
                {
                    line_time = line_time.substring(0, line_time.indexOf('GMT')-1);
                }
                else if(line_time.indexOf('CET') >= 0)
                {
                    line_time = line_time.substring(0, line_time.indexOf('CET')-1);
                }
                else if(line_time.indexOf('CEST') >= 0)
                {
                    line_time = line_time.substring(0, line_time.indexOf('CEST')-1);
                }
                line_time_converted = ConvertTimeformat('00:00', line_time);

                line_datetime = new Date(line_date+' '+line_time).getTime();

                // change date & time
                $(this).parents('div').eq(1).find('span.'+activity_line_time).attr('title',$(this).parents('div').eq(1).find('span.'+activity_line_time).text()).html(line_date_converted+' '+icon_time+' <span class="time">'+line_time_converted+'</span>');


                // save the times of reboots
                if($(this).is(':contains("reboot has")'))
                {
                    if(!planned_times.includes(line_datetime))
                    {
                        planned_times.push(line_datetime);
                    }
                }
                // save the times of firmware updates
                if($(this).is(':contains("firmware update to")') || $(this).is(':contains("CollabOS update to")'))
                {
                    if(!planned_times.includes(line_datetime))
                    {
                        planned_times.push(line_datetime);
                    }
                }

                // save the times of nightly reboots of NUC
                if($(this).parents('div.'+event_container).eq(0).find('div.'+event_text_container).is(':contains("Tap was")') &&
                   (
                       $(this).parents('div').eq(1).find('span.'+activity_line_time).is(':contains("02:2")') ||
                       $(this).parents('div').eq(1).find('span.'+activity_line_time).is(':contains("02:3")') ||
                       $(this).parents('div').eq(1).find('span.'+activity_line_time).is(':contains("02:4")')
                   )
                  )
                {
                    if(!planned_times.includes(line_datetime))
                    {
                        planned_times.push(line_datetime);
                    }
                }

                // save the times of nightly reboots of device settings
                if($(this).parents('div.'+event_container).eq(0).find('div.'+event_text_container).is(':contains("room is now")') &&
                   (
                       $(this).parents('div').eq(1).find('span.'+activity_line_time).is(':contains("02:0")') ||
                       $(this).parents('div').eq(1).find('span.'+activity_line_time).is(':contains("02:1")') ||
                       $(this).parents('div').eq(1).find('span.'+activity_line_time).is(':contains("02:2")')
                    ||
                       $(this).parents('div').eq(1).find('span.'+activity_line_time).is(':contains("03:0")') ||
                       $(this).parents('div').eq(1).find('span.'+activity_line_time).is(':contains("03:1")') ||
                       $(this).parents('div').eq(1).find('span.'+activity_line_time).is(':contains("03:2")')
                   )
                  )
                {console.log('found other');
                    if(!planned_times.includes(line_datetime))
                    {
                        planned_times.push(line_datetime);
                    }
                }
            }
        });

        // configuration
        // ------------------------------
        // scheduled
        $('div.'+activity_container+' p:contains("scheduled a"):not(.processed-icon-configuration)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-configuration');

            $(this).prepend(icon_configuration);
            $(this).addClass('processed-icon-configuration');
        });
        // canceled
        $('div.'+activity_container+' p:contains("canceled a"):not(.processed-icon-configuration)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-configuration');

            $(this).prepend(icon_configuration);
            $(this).addClass('processed-icon-configuration');
        });
        // triggered
        $('div.'+activity_container+' p:contains("triggered a"):not(.processed-icon-configuration)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-configuration');

            $(this).prepend(icon_configuration);
            $(this).addClass('processed-icon-configuration');
        });
        // has set
        $('div.'+activity_container+' p:contains("has set"):not(.processed-icon-configuration)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-configuration');

            $(this).prepend(icon_configuration);
            $(this).addClass('processed-icon-configuration');
        });
        // has enabled
        $('div.'+activity_container+' p:contains("has enabled"):not(.processed-icon-configuration)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-configuration');

            $(this).prepend(icon_configuration);
            $(this).addClass('processed-icon-configuration');
        });
        // has turned
        $('div.'+activity_container+' p:contains("has turned"):not(.processed-icon-configuration)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-configuration');

            $(this).prepend(icon_configuration);
            $(this).addClass('processed-icon-configuration');
        });
        // changed
        $('div.'+activity_container+' p:contains("changed"):not(.processed-icon-configuration)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-configuration');

            $(this).prepend(icon_configuration);
            $(this).addClass('processed-icon-configuration');
        });
        // deactivated
        $('div.'+activity_container+' p:contains("deactivated"):not(.processed-icon-configuration)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-configuration');

            $(this).prepend(icon_configuration);
            $(this).addClass('processed-icon-configuration');
        });


        // reboot
        $('div.'+activity_container+' p:contains("reboot"):contains("daily"):not(.processed-icon-action)').not('.processed-icon-configuration').each(function(){
            $(this).parents('div').eq(1).addClass('custom-action');

            $(this).html($(this).html().replace(/ - daily scheduled/gi,'<br>'+icon_reboot+' Daily scheduled'));

            $(this).addClass('processed-icon-action');
        });
        $('div.'+activity_container+' p:contains("reboot"):contains("weekly"):not(.processed-icon-action)').not('.processed-icon-configuration').each(function(){
            $(this).parents('div').eq(1).addClass('custom-action');

            $(this).html($(this).html().replace(/ - weekly scheduled/gi,'<br>'+icon_reboot+' Weekly scheduled'));

            $(this).addClass('processed-icon-action');
        });
        // update
        $('div.'+activity_container+' p:contains("firmware update"):not(.processed-icon-action)').not('.processed-icon-configuration').each(function(){
            $(this).parents('div').eq(1).addClass('custom-action');

            $(this).html($(this).html().replace(/firmware update/gi,icon_update+'firmware update'));
            $(this).addClass('processed-icon-action');
        });
        $('div.'+activity_container+' p:contains("CollabOS update"):not(.processed-icon-action)').not('.processed-icon-configuration').each(function(){
            $(this).parents('div').eq(1).addClass('custom-action');

            $(this).html($(this).html().replace(/CollabOS update/gi,icon_update+'CollabOS update'));
            $(this).addClass('processed-icon-action');
        });

        // complete
        $('div.'+activity_container+' p:contains("has completed"):not(.processed-process)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-action');

            $(this).html($(this).html().replace(/has completed/gi,'has completed '+icon_dot_green));
            $(this).addClass('processed-process');
        });
        $('div.'+activity_container+' p:contains("has finished"):not(.processed-process)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-action');

            $(this).html($(this).html().replace(/has finished/gi,'has finished '+icon_dot_green));
            $(this).addClass('processed-process');
        });

        // start
        $('div.'+activity_container+' p:contains("has started"):not(.processed-process)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-action');

            $(this).html($(this).html().replace(/has started/gi,'has started '+icon_dot_red));
            $(this).addClass('processed-process');
        });



        // meeting room
        // ------------------------------
        // room icon
        $('div.'+activity_container+' p:contains("meeting room"):not(.processed-icon-device)').each(function(){
            $(this).prepend(icon_room);
            $(this).addClass('processed-icon-device');
        });
        // room block
        $('div.'+activity_container+' p:contains("meeting room"):not(.processed-room)').each(function(){
            $(this).parents('div').eq(1).addClass('custom-room');
            $(this).addClass('processed-room');
        });
        // room online
        $('div.'+activity_container+' p:contains("is now online"):not(.processed-connection)').each(function(){
            $(this).html($(this).html().replace(/online/gi,'<span class="custom-badge custom-text-green custom-text-bold">online</span>'));
            $(this).parents('div').eq(1).addClass('custom-bg-green-soft');
            $(this).addClass('processed-connection');
        });
        // room offline
        $('div.'+activity_container+' p:contains("is now offline"):not(.processed-connection)').each(function(){
            $(this).html($(this).html().replace(/offline/gi,'<span class="custom-badge custom-text-red custom-text-bold">offline</span>'));
            $(this).parents('div').eq(1).addClass('custom-bg-red-soft');
            $(this).addClass('processed-connection');
        });

        // device
        // ------------------------------
        // computer icon
        //$('div.'+activity_container+' p:contains("Computer"):not(.processed-icon-device)').each(function(){
        //    $(this).prepend(icon_computer);
        //    $(this).addClass('processed-icon-device');
        //});
        // roommate icon
        $('div.'+activity_container+' p:contains("RoomMate"):not(.processed-icon-device):not(.processed-icon-configuration)').each(function(){
            $(this).prepend(icon_roommate);
            $(this).addClass('processed-icon-device');
        });
        // camera icon
        $('div.'+activity_container+' p:contains("Camera"):not(.processed-icon-device):not(.processed-icon-configuration)').each(function(){
            $(this).prepend(icon_camera);
            $(this).addClass('processed-icon-device');
        });
        // rally bar mini icon
        $('div.'+activity_container+' p:contains("Rally Bar Mini"):not(.processed-icon-device):not(.processed-icon-configuration)').each(function(){
            $(this).prepend(icon_rally_bar_mini);
            $(this).addClass('processed-icon-device');
        });
        // rally bar icon
        $('div.'+activity_container+' p:contains("Rally Bar"):not(.processed-icon-device):not(.processed-icon-configuration)').each(function(){
            $(this).prepend(icon_rally_bar);
            $(this).addClass('processed-icon-device');
        });
        // tap ip icon
        $('div.'+activity_container+' p:contains("Tap IP"):not(.processed-icon-device):not(.processed-icon-configuration)').each(function(){
            $(this).prepend(icon_tap_ip);
            $(this).addClass('processed-icon-device');
        });
        // tap icon
        $('div.'+activity_container+' p:contains("Tap"):not(.processed-icon-device):not(.processed-icon-configuration)').each(function(){
            $(this).prepend(icon_tap);
            $(this).addClass('processed-icon-device');
        });
        // remote controller icon
        $('div.'+activity_container+' p:contains("Remote Controller"):not(.processed-icon-device):not(.processed-icon-configuration)').each(function(){
            $(this).prepend(icon_remote_controller);
            $(this).addClass('processed-icon-device');
        });


        // device connect
        $('div.'+activity_container+' p:contains("was reconnected"):not(.processed-connection)').each(function(){
            $(this).html($(this).html().replace(/reconnected/gi,'<span class="custom-badge custom-bg-green-soft custom-text-green">reconnected</span>'));
            $(this).addClass('processed-connection');
        });
        $('div.'+activity_container+' p:contains("was connected"):not(.processed-connection)').each(function(){
            $(this).html($(this).html().replace(/connected/gi,'<span class="custom-badge custom-bg-green-soft custom-text-green">connected</span>'));
            $(this).addClass('processed-connection');
        });

        // device disconnect
        $('div.'+activity_container+' p:contains("was disconnected"):not(.processed-connection)').each(function(){
            $(this).html($(this).html().replace(/disconnected/gi,'<span class="custom-badge custom-bg-red-soft custom-text-red">disconnected</span>'));
            $(this).addClass('processed-connection');
        });
        $('div.'+activity_container+' p:contains("has forgotten"):not(.processed-connection)').each(function(){
            $(this).html($(this).html().replace(/forgotten/gi,'<span class="custom-badge custom-bg-red-soft custom-text-red">forgotten</span>'));
            $(this).addClass('processed-connection');
        });

        // device associated
        $('div.i'+activity_container+' p:contains("was associated"):not(.processed-connection)').each(function(){
            $(this).html($(this).html().replace(/associated/gi,'<span class="custom-badge custom-bg-green-soft custom-text-green">associated</span>'));
            $(this).html($(this).html().replace(/connected/gi,'<span class="custom-badge custom-bg-green-soft custom-text-green">connected</span>'));
            $(this).addClass('processed-connection');
        });
        // device deprovisioned
        $('div.'+activity_container+' p:contains("has deprovisioned"):not(.processed-connection)').each(function(){
            $(this).html($(this).html().replace(/deprovisioned/gi,'<span class="custom-badge custom-bg-red-soft custom-text-red">deprovisioned</span>'));
            $(this).addClass('processed-connection');
        });


        // process indents
        $('div.'+activity_container+' p').each(function(){

            // date
            if($(this).hasClass(activity_date))
            {
                // find and convert date
                line_date = $(this).text();
                line_date_converted = ConvertDateformat(line_date);
            }

            // information
            if($(this).hasClass(activity_line) && !$(this).hasClass('processed-indent'))
            {
                // find and convert time
                line_time = $(this).parents('div').eq(1).find('span.'+activity_line_time).attr('title');
                if(line_time.indexOf('GMT') >= 0)
                {
                    line_time = line_time.substring(0, line_time.indexOf('GMT')-1);
                }
                else if(line_time.indexOf('CET') >= 0)
                {
                    line_time = line_time.substring(0, line_time.indexOf('CET')-1);
                }
                else if(line_time.indexOf('CEST') >= 0)
                {
                    line_time = line_time.substring(0, line_time.indexOf('CEST')-1);
                }
                line_time_converted = ConvertTimeformat('00:00', line_time);

                line_datetime = new Date(line_date+' '+line_time).getTime();

                // check if this datetime is between every indent-time and 10 minutes later of 5 minutes before
                var minutes_check_after = 10;
                var minutes_check_before = 5;

                var indent = false;
                planned_times.forEach((time) => {

                    if(parseInt(time) <= parseInt(line_datetime) && parseInt(line_datetime) <= (parseInt(time) + parseInt(minutes_check_after * 60 * 1000)))
                    {
                        indent = true;
                    }
                    else if(parseInt(time) >= parseInt(line_datetime) && parseInt(line_datetime) >= (parseInt(time) - parseInt(minutes_check_before * 60 * 1000)))
                    {
                        indent = true;
                    }
                });

                // filter triggered message (= configuration)
                if($(this).is(':contains("triggered a")'))
                {
                    indent = false;
                }

                if(indent == true)
                {
                    $(this).parents('div').eq(1).addClass('custom-line-reboot');
                    $(this).addClass('processed-indent');
                }
            }
        });

        // check classes
        var classes_active = 0;
        var classes_active_changes = '';

        if($('.'+activity_container)[0])
        {
            classes_active++;
        }
        else
        {
            classes_active_changes += 'activity_container: <span class="custom-text-red">'+activity_container+'</span> > <span class="custom-text-green">'+$('[class*="'+activity_container_prefix+'"]').attr('class').split(/\s+/)[1]+'</span><br>';
        }

        if($('.'+activity_date)[0])
        {
            classes_active++;
        }
        else
        {
            classes_active_changes += 'activity_date: <span class="custom-text-red">'+activity_date+'</span> > <span class="custom-text-green">'+$('[class*="'+activity_date_prefix+'"]').attr('class').split(/\s+/)[1]+'</span><br>';
        }

        if($('.'+activity_line)[0])
        {
            classes_active++;
        }
        else
        {
            classes_active_changes += 'activity_line: <span class="custom-text-red">'+activity_line+'</span> > <span class="custom-text-green">'+$('[class*="'+activity_line_prefix+'"]').attr('class').split(/\s+/)[1]+'</span><br>';
        }

        if($('.'+activity_line_time)[0])
        {
            classes_active++;
        }
        else
        {
            classes_active_changes += 'activity_line_time: <span class="custom-text-red">'+activity_line_time+'</span> > <span class="custom-text-green">'+$('[class*="'+activity_line_time_prefix+'"]').attr('class').split(/\s+/)[1]+'</span><br>';
        }

        if($('.'+event_container)[0])
        {
            classes_active++;
        }
        else
        {
            classes_active_changes += 'event_container: <span class="custom-text-red">'+event_container+'</span> > <span class="custom-text-green">'+$('[class*="'+event_container_prefix+'"]').attr('class').split(/\s+/)[1]+'</span><br>';
        }

        if($('.'+event_text_container)[0])
        {
            classes_active++;
        }
        else
        {
            classes_active_changes += 'event_text_container: <span class="custom-text-red">'+event_text_container+'</span> > <span class="custom-text-green">'+$('[class*="'+event_text_container_prefix+'"]').attr('class').split(/\s+/)[2]+'</span><br>';
        }


        $('.logi-plus g').removeClass();
        $('.logi-plus-info g').removeClass();

        if(classes_active == 0)
        {
            $('.logi-plus g').addClass('custom-text-red');
            $('.logi-plus-info g').addClass('custom-text-red');
            $('.logi-plus-info .info').html(classes_active_changes+'<br>Logi Sync changes detected for Logi Sync Plus');
        }
        else if(classes_active == 6)
        {
            $('.logi-plus g').addClass('custom-text-green');
            $('.logi-plus-info g').addClass('custom-text-green');
            $('.logi-plus-info .info').html('All systems are go');
        }
        else
        {
            $('.logi-plus g').addClass('custom-text-orange');
            $('.logi-plus-info g').addClass('custom-text-orange');
            $('.logi-plus-info .info').html(classes_active_changes+'<br>Logi Sync changes detected for Logi Sync Plus');
        }
    }
}


function ConvertTimeformat(format, str)
{
    var hours = Number(str.match(/^(\d+)/)[1]);
    var minutes = Number(str.match(/:(\d+)/)[1]);
    if(str.match(/\s?([AaPp][Mm]?)$/))
    {
        var AMPM = str.match(/\s?([AaPp][Mm]?)$/)[1];
        var pm = ['P', 'p', 'PM', 'pM', 'pm', 'Pm'];
        var am = ['A', 'a', 'AM', 'aM', 'am', 'Am'];
        if (pm.indexOf(AMPM) >= 0 && hours < 12) hours = hours + 12;
        if (am.indexOf(AMPM) >= 0 && hours == 12) hours = hours - 12;
    }
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    if (format == '0000') {
        return (sHours + sMinutes);
    } else if (format == '00:00') {
        return (sHours + ":" + sMinutes);
    } else {
        return false;
    }
}

function ConvertDateformat(str)
{
    var date = new Date(str);
    var weekday = date.getDay();
    var day = date.getDate();
    var month = date.getMonth()+1;

    var weekdayNames = ["ZO", "MA", "DI", "WO", "DO", "VR", "ZA"];

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    return weekdayNames[weekday]+" "+day+"/"+month;
}