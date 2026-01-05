// ==UserScript==
// @name        mmmturkeybacon Scroll To Workspace
// @version     3.08
// @description When a HIT has been accepted, this script scrolls the mturk workspace to the top of the window. When a HIT is being previewed, this script scrolls the 'Accept HIT' button to the top of the window, unless there is a CAPTCHA. Whenever a HIT is previewed or accepted, this script sets the iframe height equal to the browser's viewport height to ensure proper scrolling and gives focus to the iframe.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://*.mturk.com/mturk/preview*
// @match       https://*.mturk.com/mturk/accept*
// @match       https://*.mturk.com/mturk/continue*
// @match       https://*.mturk.com/mturk/submit*
// @match       https://*.mturk.com/mturk/return*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/3105/mmmturkeybacon%20Scroll%20To%20Workspace.user.js
// @updateURL https://update.greasyfork.org/scripts/3105/mmmturkeybacon%20Scroll%20To%20Workspace.meta.js
// ==/UserScript==

$(document).ready(function ()
{   
    var is_a_HIT = $('input[type="hidden"][name="isAccepted"]').length > 0;
    if (is_a_HIT == true)
    {
        var captcha = $('input[name="userCaptchaResponse"]').length > 0;
        if (captcha == false)
        {
            var workspace;
            var iframe = $('iframe')[0];
            var hit_wrapper = $('div[id="hit-wrapper"]')[0];

            if (iframe)
            {
                iframe.style.minHeight = '100vh';
                //iframe.focus();
                $(window).load(function(){iframe.focus();});
                workspace = iframe;
            }
            else if (hit_wrapper)
            {
                /* Changing the hit-wrapper height is undesirable because it adds extra space between the end of the contents of the HIT and the submit button.
                 * Instead, padding is added to the end of the page to ensure proper scrolling.
                 */

                // window.innerHeight == viewport height
                // if there is a vertical scrollbar then $(window).height() == $(document).height()
                // if there is not a vertical scrollbar then $(window).height() === document.documentElement.clientHeight which can be less than the viewport height

                var hit_wrapper_ypos = hit_wrapper.getBoundingClientRect().top;
                var pad = hit_wrapper_ypos + window.innerHeight - document.documentElement.clientHeight;
                if (pad > 0)
                {
                    $('form[name="hitForm"][method="POST"][action="/mturk/hitReview"]').parent().before('<div style="height: '+pad+'">');
                }
                workspace = hit_wrapper;                
            }

            var isAccepted = $('input[type="hidden"][name="isAccepted"][value="true"]').length > 0;
            if (workspace && isAccepted == true)
            { // HIT accepted
                workspace.scrollIntoView();
                
                //if (window.chrome)
                //{
                //    /* This solves the problem of chrome scrolling to the last position it
                //     * remembers. However, if a page is loaded that chrome doesn't remember
                //     * a position for this will snap back to the top of the workspace the
                //     * first time the user scrolls, which is not an ideal solution and why
                //     * this is commented out.
                //     * A timeout of 0 works, but it is jarring and looks buggy.
                //     */
                //    $(window).load(function(){window.onscroll = function(){ window.onscroll=null; setTimeout( function(){workspace.scrollIntoView();}, 500 ); }});
                //}
            }
            else if (workspace && isAccepted == false)
            { // previewing HIT
                var timer = $('span[id="theTime"][class="title_orange_text"]')[0];
                timer.scrollIntoView();

                //if (window.chrome)
                //{
                //    $(window).load(window.onscroll = function(){ window.onscroll=null; setTimeout( function(){timer.scrollIntoView();}, 500);});
                //}
            }
        }
    }
});