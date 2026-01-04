// ==UserScript==
// @name         Heart Mixlr AutoHeart
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make AutoHeart the hearts go
// @author       DeadlyPliers
// @match        https://*mixlr.com/*
// @icon         data:image/jpg;base64,R0lGODlhAQABAAAAACH5BAEKAAEAL
// @grant        none
// @runat        document-start
// @downloadURL https://update.greasyfork.org/scripts/424293/Heart%20Mixlr%20AutoHeart.user.js
// @updateURL https://update.greasyfork.org/scripts/424293/Heart%20Mixlr%20AutoHeart.meta.js
// ==/UserScript==
 
function main() {
    // if you only want to decrease the heart refresh time
    // code to set heart refresh time to 0
    // 1000 = 1 second
    var heartSpam = false;
    window.Mixlr.heartRefreshTime = 2100;
    window.$('.action_container')[0].outerHTML = '<div class="action_container"><a class="action" title="Heart this now"></a><a id="heart_bot" class="icon-enter" title="Heart Bot">Heart Bot</a></div>';
    jQ('#heart_bot').click(function(e) {
        e.preventDefault();
 
        if (heartSpam === false)
        {
            heartSpam = true;
        }
        else
        {
            heartSpam = false;
        }
    });
 
    setInterval(function() {
            if (heartSpam === true)
            {
                doHeart(2.1);
            }
        }, 2.1 * 1000);
 
    window.$('.action_container')[0].style.display = 'inline-flex';
 
    // with random seconds interval
    function setRandomInterval(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    function doHeart(seconds) {
        console.log('hearting at', seconds);
        window.User.current.heartBroadcast();
    }
    function heartRandomInterval(min, max, callback) {
        var randomSeconds = setRandomInterval(min, max) * 1000;
        setTimeout(function() {
            callback(randomSeconds);
            heartRandomInterval(min, max, callback);
        }, randomSeconds);
    }
}
 
// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}
 
// load jQuery and execute the main function
addJQuery(main);