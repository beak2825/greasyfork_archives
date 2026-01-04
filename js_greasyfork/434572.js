// ==UserScript==
// @name         Focusmate button simulator - Gmail style
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  Focusmate pressing automation
// @author       Contact WeChat @H2018336
// @match        https://www.focusmate.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=focusmate.com
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/434572/Focusmate%20button%20simulator%20-%20Gmail%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/434572/Focusmate%20button%20simulator%20-%20Gmail%20style.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function ck(v){
        $(v).length && $(v)[0].click();
    };
    $(document).ready(
        function(){
            let off = !1;
            document.onkeyup=function(e){
                if(e.keyCode==71){
                    // placeholder bit, for key-sequence activation.
                }else{
                    off = !1;
                }
            };
            document.onkeydown = function(e) {
                if(e.keyCode==71){ // g-key,as the trigger
                    off = !0;
                }else if(e.keyCode==13){// Enter key: (In "Book a session" box, hit Enter to confirm booking.)
                    $('[name="title"]').length && ck('app-spinner-button button[type="submit"]');
                }else if(e.keyCode==27){//ESC
                    ck('.ng-star-inserted fa-icon.std-modal-close')
                }else if(off){
                    console.log(e.keyCode)
                    switch(e.keyCode){
                        case 65 ://a - View all
                            ck('.upc-header a.upc-header-link');
                            break;
                        case 66 ://b - Book a session
                            ck("button.f-btn--primary");
                            setTimeout(function(){ $('input[name="title"]').attr('autocomplete','off')[0].focus()},300);
                            break;
                        case 67 ://c - Book/Create a session (same as gb)
                            ck("button.f-btn--primary");
                            setTimeout(function(){ $('input[name="title"]').attr('autocomplete','off')[0].focus()},300);
                            break;
                        case 84 ://t - Today (button)
                            ck('.fm-cal-toolbar a.today-btn')
                            break;
                        case 80 ://p - left-button
                            ck('.fm-cal-toolbar a.left')
                            break;
                        case 78 ://n - right-button
                            ck('.fm-cal-toolbar a.right')
                            break;
                        case 74 ://j - Join a session
                            ck('.upc-content-wrapper .fm-vid-btn-card')
                            break;
                        case 72 ://h
                            ck('a.fm-breadcrumb-item:contains(Calendar)')
                            break;
                        case 68 ://d - Delete a session: Cancel, and confirm very quickly
                            if($('button.cancel .cancel-yes .cancel-yes .ng-star-inserted').length){
                                ck('button.cancel .cancel-yes .cancel-yes .ng-star-inserted')
                            }else{
                                ck('.cancel')
                                setTimeout(function(){ck('.cancel-yes .cancel-yes .ng-star-inserted')},300);
                            }
                            break;
                        case 87 ://w - toggl Day/Week-view
                            ck('.fm-cal-toolbar a.day-week')
                            break;

                        case 73 ://i - Invite button
                            ck('.help-menu-btn-container a.fm-main-help-btn ')
                            break;
                        case 50 ://2 - Pick 25m
                            ck('.fm-cal-toolbar a.duration-left')
                            break;
                        case 53 ://5 - Pick 50m
                            ck('.fm-cal-toolbar a.duration-middle')
                            break;
                        case 55 ://7 - Pick 50m
                            ck('.fm-cal-toolbar a.duration-right')
                            break;

                    }
                }

            }
        }
    );
})();