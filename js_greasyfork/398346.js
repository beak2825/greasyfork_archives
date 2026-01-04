// ==UserScript==
// @name         VRChat WEB Shorthand
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds shorthands for web site features. (Quick launch world and invite buttons for friends list)
// @author       slick
// @match        https://www.tampermonkey.net/index.php?version=4.10.6105&ext=fire&updated=true
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @include      /.*?:\/\/.*?vrchat.*?\..*?(home|launch|api).*?/
// @downloadURL https://update.greasyfork.org/scripts/398346/VRChat%20WEB%20Shorthand.user.js
// @updateURL https://update.greasyfork.org/scripts/398346/VRChat%20WEB%20Shorthand.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var limitReshreshMs = 1000;
    var lastRefresh = Date.now();

    $(document).ready(setTimeout(function() {
        addLaunchButton();
        //addRefreshButton();

        setDOMEvent(".friend-container", addLaunchButton);
        setDOMEvent(".location-container", addLaunchButton);
        setDOMEvent(".home-content", addLaunchButton);
    }, 3000));

    function setDOMEvent(element, callback) {
      $("body").on('DOMSubtreeModified', element, function() {
            setTimeout(function() {callback();}, 200);
      });
    }

    function addLaunchButton() {
      if(!canRefresh()) return;

      $( ".launchb" ).remove();
      $('.location-title').each(function( index ) {
            var webLink = $( this ).children()[1].href;
            var link = webLink.substring(webLink.indexOf('=')+1, webLink.lastIndexOf('&'));
            var instanceId = webLink.substring(webLink.lastIndexOf('=')+1);
            var fullLink = link + ":" + instanceId;
            var launchButton = '<div class="launchb"><br><a href="vrchat://launch?ref=vrchat.com&id=' + fullLink + '" class="btn btn-primary launch-btn" style="padding: 2px 2px;">LAUNCH WORLD</a></div>';

            $(this).append(launchButton);
      });
    }

    function addRefreshButton() {
      var refreshButton = '<span id="refreshb" style="margin-left: 5px"><a class="btn btn-secondary" title="Refresh" href="#"><span class="fa fa-sync-alt"></span>&nbsp; Refresh</a></span>';
      $('.navbar-header').append(refreshButton);
      $("#refreshb").click (addLaunchButton);
    }

    function canRefresh() {
      if((Date.now() - lastRefresh) >= limitReshreshMs) {
        lastRefresh = Date.now();
        return true;
      }
      return false;
    }
})();
