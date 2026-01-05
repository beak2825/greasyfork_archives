// ==UserScript==
// @name        mmmturkeybacon Logged Out Alert
// @version     1.04
// @description Alerts you if you've been logged out of mturk. Your dashboard page must remain open in a tab for this script to work. To have this script open a new sign in page when a log out is detected change OPEN_SIGNIN_WIN to true.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/dashboard
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/3098/mmmturkeybacon%20Logged%20Out%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/3098/mmmturkeybacon%20Logged%20Out%20Alert.meta.js
// ==/UserScript==

var CHECK_DELAY = 61000; // milliseconds delay between logged in check
var OPEN_SIGNIN_WIN = false;
var TIMEOUT_TIME_LIMIT = 15000;

$(document).ready(function()
{
    var alerted = false;
    function check_logged_in()
    {
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://www.mturk.com/mturk/dashboard',
            timeout: TIMEOUT_TIME_LIMIT,
            onload: function(response)
            {
                //console.log(response.finalUrl);

                if (response.finalUrl === 'https://www.mturk.com/mturk/dashboard')
                { // logged in
                    alerted = false;
                    setTimeout(check_logged_in, CHECK_DELAY);
                }
                else if (response.finalUrl.lastIndexOf('https://www.amazon.com/ap/signin?openid.ns', 0) === 0 || response.finalUrl === 'https://www.mturk.com/mturk/beginsignin')
                { // logged out
                    if (alerted == false)
                    { // only alert one time after being logged out
                        alerted = true;

                        if (OPEN_SIGNIN_WIN)
                        {
                            window.open("data:text/html,<html><title>mmmturkeybacon Logged Out Alert: You are not signed in.</title><body><center><h2>mmmturkeybacon Logged Out Alert has detected you are not signed in.</h2>You are being redirected to the <a href='https://www.mturk.com/mturk/beginsignin'>worker sign in page</a>.</center></body><script type='text/javascript'>alert('mmmturkeybacon Logged Out Alert: You are not signed in.');document.location.href='https://www.mturk.com/mturk/beginsignin'</script></html>");
                        }
                        else
                        {
                            alert('mmmturkeybacon Logged Out Alert: You are not signed in.');
                        }
                    }
                    // if a sign in is immediately followed by a sign out variable alerted won't get reset to false and another alert won't happen
                    // so reduce the delay to 5 seconds to make it less likely that we miss a sign in immediately followed by a sign out
                    setTimeout(check_logged_in, 5000);
                }
                else
                {
                    console.log(response.finalUrl);
                    alert('mmmturkeybacon Logged Out Alert: An unknown error occurred. Are you signed in? Reload page to restart this script.');
                }
            },
            onerror: function(response)
            {
                console.log(response.finalUrl);
                alert('mmmturkeybacon Logged Out Alert: An unknown error occurred. Are you signed in? Reload page to restart this script.');
            },
            ontimeout: function()
            {
                console.log(response.finalUrl);
                alert('mmmturkeybacon Logged Out Alert: Timed out. Reload page to restart this script.');
            }
        });
    }
    check_logged_in();
});