// ==UserScript==
// @name        Scroll to workspace with Iframe focus.
// @version     1.00
// @description Scrolls to workspace, and makes any keypress active.
// @author      Casul_Scrub , Solaire of Astora, Dr.Knox
// @namespace   http://userscripts.org/users/523367
// @icon        http://mturkforum.com/image.php?u=64396&dateline=1456882978&type=thumb
// @match       https://*.mturk.com/mturk/preview*
// @match       https://*.mturk.com/mturk/accept*
// @match       https://*.mturk.com/mturk/continue*
// @match       https://*.mturk.com/mturk/submit*
// @match       https://*.mturk.com/mturk/return*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/19155/Scroll%20to%20workspace%20with%20Iframe%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/19155/Scroll%20to%20workspace%20with%20Iframe%20focus.meta.js
// ==/UserScript==

$(document).ready(function ()
{   
    var is_a_HIT = $('input[type="hidden"][name="isAccepted"]').length > 0;
    if (is_a_HIT === true){
        var captcha = $('input[name="userCaptchaResponse"]').length > 0;
        
        if (captcha === false){
            var workspace;
            var iframe = $('iframe')[0];
            var hit_wrapper = $('div[id="hit-wrapper"]')[0];

            if (iframe){
                iframe.style.minHeight = '100vh';
                $(window).load(function(){iframe.focus();});
                workspace = iframe;
            }
            else if (hit_wrapper){
                var hit_wrapper_ypos = hit_wrapper.getBoundingClientRect().top;
                var pad = hit_wrapper_ypos + window.innerHeight - document.documentElement.clientHeight;
                
                if (pad > 0){
                    $('form[name="hitForm"][method="POST"][action="/mturk/hitReview"]').parent().before('<div style="height: '+pad+'">');
                }
                workspace = hit_wrapper;                
            }

            var isAccepted = $('input[type="hidden"][name="isAccepted"][value="true"]').length > 0;
            if (workspace && isAccepted === true){ 
                // HIT accepted scroll and focus
                workspace.scrollIntoView();
                var mturk_iframe = document.querySelector("iframe");
                if (mturk_iframe){
                    mturk_iframe.focus();
                }
             
            }
            else if (workspace && isAccepted === false){ 
                // previewing Hit
                var timer = $('span[id="theTime"][class="title_orange_text"]')[0];
                timer.scrollIntoView();
            }
        }
    }
});