// ==UserScript==
// @name        Hide VP9 support from YouTube + Force 30 fps video
// @author      Joey_JTS
// @namespace   https://greasyfork.org/en/users/761382-joey-jts
// @version     1.0
// @license     MIT
// @description This userscript hides VP9 support along with disabling 60 fps (forces 30 fps). Special thanks to Jefferson Scher and SteveJobzniak for this.
// @match       https://www.youtube.com/*
// @match       https://www.youtube-nocookie.com/*
// @match       https://www.youtu.be/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/493563/Hide%20VP9%20support%20from%20YouTube%20%2B%20Force%2030%20fps%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/493563/Hide%20VP9%20support%20from%20YouTube%20%2B%20Force%2030%20fps%20video.meta.js
// ==/UserScript==

// Modified from https://github.com/erkserkserks/h264ify/tree/master/src/inject as of 2018-05-16 (MIT license)

var mse = window.MediaSource;
if (mse){
  // Set up replacement for MediaSource type support function
  var nativeITS = mse.isTypeSupported.bind(mse);
  mse.isTypeSupported = ourITS(nativeITS);
}
// Here's the replacement
function ourITS(fallback){
  // type is a string (hopefully!) sent by the page
  return function (type) {
    if (type === undefined) return '';
    // We only reject VP9
    if (type.toLowerCase().indexOf('vp9') > -1) return '';
    if (type.toLowerCase().indexOf('vp09') > -1) return ''; // Added 12/20/2019
    // Let Firefox handle everything else
    return fallback(type);
  };
}


/*
    This script tells YouTube that your browser only supports 30FPS or less,
    which means that you will see regular 30FPS versions of all HD videos.

    WHY DO THIS?:
      For my six year old laptop, switching from 1080p60 to 1080p30 reduces
      the CPU usage by 2-4x, and removes all CPU overloads that used to make
      my browser and video playback freeze! This means longer battery life,
      and a much happier video watching experience!

      (Furthermore, most older graphics cards only support hardware acceleration
      of 1080p30 or lower, which means that using this script may allow your
      graphics card to perform the video decoding for great battery savings!)

    INSTALLATION:
      Install the Tampermonkey (https://tampermonkey.net) extension for your
      specific browser, and then install this script into Tampermonkey.

      This script has been tested and confirmed working in Safari 9/10+ for Mac
      and Google Chrome for Mac. But it should work in *all* browsers and OS's
      that support the Tampermonkey extension - on Windows, Mac and Linux!

      However, I only officially guarantee that it works in Chrome and Safari!

      (This script does NOT work via Chrome's own basic built-in script support!)

    IMPORTANT NOTE TO ALL USERS:
      We DO NOT affect embedded YouTube videos, because embedded players
      *only* check for high-FPS support, so blocking those queries would
      mean completely losing *all* HD resolutions for embedded videos!

      I suggest clicking the "Watch on YouTube" button to play embedded
      high-FPS videos directly on YouTube in 30FPS instead!

    DO YOU WANT TO DONATE A BEER AS THANKS FOR MY WORK?:
      Totally optional. ;-)

      * PayPal: https://www.paypal.me/Armindale/0usd
      * Bitcoin: 18XF1EmrkpYi4fqkR2XcHkcJxuTMYG4bcv

    SCRIPT VERSION 1.3 NEWS:
      Now limits the maximum amount of injection (high-FPS blocking) retries
      to just two page reloads, and then displays a message bar which lets the
      user decide what to do if they've all failed. This is just for severely bugged
      web browsers, since most browsers always succeed on their first attempt!

    SCRIPT VERSION 1.4 NEWS:
      Minor change to the address bar history handling.

    SCRIPT VERSION 1.5 NEWS:
      Rewrote the "injection success?" detection method. Previously, we checked
      for the existence of YouTube's "window.ytplayer" object as a sign of too-late
      injection. But in Sept of 2017, they rewrote their site so that the object
      almost always exists by the time our userscript runs. Therefore, the method
      has instead been changed to now wait for a fraction of a second and then check
      if our code has actually blocked any formats. If so, we're sure that we've
      successfully injected the format blocker and disabled high-FPS!

    SCRIPT VERSION 1.6 NEWS:
      As I've said above, I only officially support Chrome and Safari (because it's
      a lot of work to test different browsers). However, this new release improves
      the script's behavior in other browsers, at least for now. The script has been
      improved and verified to now also work in Firefox with Tampermonkey. But please
      be aware that Chrome and Safari remain the only officially supported browsers
      that I will test each release in. Feel free to report any problems you may
      discover in non-supported browsers, but please don't leave negative reviews
      regarding those other browsers since I only guarantee Chrome and Safari to work!

    SCRIPT VERSION 1.7 NEWS:
      After some careful research, I've come up with an even more reliable and faster
      method for detecting injection success. It now uses a hybrid method, which first
      does a brand new, instant check that sees if YouTube's video player code has been
      loaded. If their player has already been loaded, then we treat that as an instant
      failure and perform a retry. But if there is no player yet, then we can be almost
      certain that we've successfully been injected into the page early enough. Then,
      we simply wait a while and perform a final verification (same as in v1.5+ but with
      a much longer delay) to confirm that we've actually blocked all high-FPS formats.
      This new method greatly enhances the chances of early success in all browsers. Enjoy!

    SCRIPT VERSION 1.8 NEWS:
      Enhanced processing speed for the injection-counter in your browser's address bar.

    SCRIPT VERSION 1.9 NEWS:
      Just a little bit of autumn cleaning (after all these recent changes), to improve
      the source code readability.
*/
(function() {
    'use strict';

    var useQueryDebug = false; // Show all format checker queries.
    var useTimeElapsedDebug = false; // Show time elapsed from injection to 1st format blocking.
    var useCallstackDebug = false; // Show the call stack trace.

    var createNewTypeChecker = function(originalChecker, fnQueryCallback, debugQueries, debugCallstack) {
        return function(videoType) {
            if (debugCallstack) {
                console.trace(); // Shows who called our format checker.
            }
            if (debugQueries) {
                console.log('Format Query: "' + videoType + '", originalAnswer: "' + originalChecker(videoType) + '"');
            }
            if (fnQueryCallback) {
                fnQueryCallback('query', videoType);
            }

            if (videoType === undefined) {
                return false;
            }

            // Block all queries regarding high-framerate support.
            var matches = videoType.match(/framerate=(\d+)/);
            if (matches && (matches[1] > 30)) {
                if (debugQueries) {
                    console.log('Blocking High-FPS format: "' + videoType + '"');
                }
                if (fnQueryCallback) {
                    fnQueryCallback('block', videoType);
                }
                return false;
            }

            // Let the browser answer all other codec queries.
            return originalChecker(videoType);
        };
    };

    var isVideoPage = function() {
        return (location.pathname && location.pathname === '/watch');
    };

    var getReloadCount = function() {
        // Get the current reload counter value if one exists.
        var fpsReloads = null;
        if (location.hash && location.hash !== '' && location.hash !== '#') {
            var matches = location.hash.match(/fpsreloads=(\d+)/);
            if (matches) {
                fpsReloads = parseInt(matches[1], 10);
            }
        }

        return fpsReloads;
    };

    var setReloadCountAndRetryInjection = function(newReloadCount) {
        var oldHash = '',
            newHash = '';

        // Get the current hash value, but ignore any "fpsreloads=X" value.
        if (location.hash && location.hash !== '' && location.hash !== '#') {
            oldHash = location.hash;
            if (oldHash) {
                if (oldHash.charAt(0) === '#') {
                    oldHash = oldHash.substr(1); // Skip the leading # symbol.
                }
                oldHash = oldHash.replace(/&?fpsreloads=\d+/, '');
            }
        }

        // Determine which new hash to use.
        if (oldHash !== '') {
            newHash = oldHash + '&fpsreloads=' + newReloadCount;
        } else {
            newHash = 'fpsreloads=' + newReloadCount;
        }

        // Set the hash, which tracks the number of page reloads we've attempted.
        location.hash = newHash;

        // Reload the current video page (since merely setting the hash is not enough to cause a reload in most browsers).
        location.reload();
    };

    var deleteReloadCount = function() {
        // Removes any "fpsreloads=X" counter from the URL, without reloading the page.
        if (window.history && window.history.replaceState) {
            var newUrl = location.href.replace(/(#?)fpsreloads=\d+&?/g, '$1').replace(/[#&]+$/, '');
            if (location.href != newUrl) {
                window.history.replaceState({}, document.title, newUrl);
            }
        }
    };

    /*
        This function handles automatic injection retries, which ensures that we've successfully
        injected our high-FPS format blocker BEFORE YouTube has performed its video format check.

        If we've been injected too late (which can happen for reasons such as bad browser timing
        or bad Tampermonkey behavior), then this function automatically retries the injection.

        Here's how the script injection and algorithm works:

        * This script is specified to run at "document-start" (before anything
          else on the YouTube webpage is loaded). But whether that early injection
          actually succeeds or not depends 100% on the browser and Tampermonkey.
        * The YouTube format check is done by their "window.ytplayer.load()" function
          (or specifically, by a deeply internal function that it calls). So we need
          to know if the "load()"-function exists yet. If it doesn't exist, then
          we can of course be sure that it hasn't been called!
        * Even during early injection, the "window.ytplayer" object almost always
          exists (because YouTube's code creates it very early), but it's created
          as an empty object without any properties (so its "load" function or "config"
          array properties don't exist yet).
        * Therefore, our first success-check is: If the "window.ytplayer" object is
          missing OR completely empty (aka "has no load() function"), then we've definitely
          been injected early enough (to probably be guaranteed to block the formats in time).
        * Furthermore, even if we THINK we've injected early enough, we'll STILL check
          to be 100% sure, by launching a timer which waits a few seconds and then
          checks if our injected format blocker has blocked the high-FPS formats.
          If so, then we can be totally certain that we've successfully blocked
          all high-FPS videos in the current tab.
        * If either the initial "window.ytplayer" check or the timer detects a
          failure (meaning we were injected too late), then we perform a quick,
          automatic page reload to retry the injection. Almost all failures are
          due to being too late during the initial injection (so that the "load()"
          function has already been called), so we'll detect most failures instantly
          and reload instantly; faster than the user can even notice it happening!
          This automatic page reload mechanism is the ONLY way to retry late injection.
        * But, if we're on the YouTube homepage or a search results page, or any other
          non-"/watch" video page, then it doesn't MATTER if we're injected late,
          since those pages don't contain any video players. (And forcing an
          auto-reload in those cases would just needlessly annoy people since
          it would happen every time that they manually type in "youtube.com".)
          The reason that it doesn't matter when we inject on non-video pages,
          is that the injection will always succeed on non-video tabs, because the
          injected code will still be in memory when the user navigates to a video,
          since YouTube doesn't truly "go to" other pages; it simply "replaces the HTML".
        * Sometimes, your browser/tab is COMPLETELY bugged and can't be fixed.
          In that situation, we give up after too many reload attempts (to avoid
          an endless reload loop), and we instead notify the user that the FPS
          replacement has failed and that the tab is playing in 60fps if available.
          We also give them some options to help them retry the injection manually.
    */
    var handleInjectionRetries = function(isOkay, currentFPSReloads) {
        // If we're not currently on a video page, we must treat that as success too, because non-video pages
        // don't have any video player (so there's never any risk of being injected "too late" there).
        if (isOkay || !isVideoPage()) {
            // Success. Ensure that any possible lingering reload counter is erased from the address bar.
            deleteReloadCount();
        } else {
            // Failure (on a video page). Now determine how many times we've attempted injection into this tab.
            // Start reload counter at one if no value exists, otherwise increment current value by +1.
            var nextReloadCount = (typeof currentFPSReloads === 'number' ? currentFPSReloads + 1 : 1);

            // We allow a limited amount of reload attempts to try to inject before the YouTube player.
            // The user can click the "failure" message at the bottom of the video to try again, if they want to.
            // NOTE: The 2nd "reload attempt" is actually the 3rd load of the page. And if we haven't successfully
            // injected before the YouTube player in 3 load attempts, then we have almost no chance of doing it
            // even with further reloads (there's only about a 10% chance that it would work within 9 loads in such
            // an incredibly bugged browser tab). Most proper tabs work within 1-2, maybe 3 loads. So we abort after 3.
            // That way, the user has a chance to decide quickly instead of waiting for reloads. Most videos are not high-FPS!
            if (nextReloadCount <= 2) { // 1 load + 2 reloads = 3 attempts total
                // Reload the page to perform the next injection attempt attempt.
                // NOTE: Waiting LONGER (via a timer) before reloading the page does NOT help the user's browser "react faster"
                // during the next reload (it STILL won't inject the script in time). The ONLY thing we can do is reload the page
                // repeatedly until we either succeed or give up.
                setReloadCountAndRetryInjection(nextReloadCount);
            } else {
                // It's time to give up. The repeatedly failed reloads are enough to know that the user's current browser tab
                // is totally bugged out and won't recover. So we'll stop trying and will tell the user instead.

                // First, let's remove the "fpsreloads=X" value from the address bar, otherwise it will stay there forever.
                deleteReloadCount();

                // Now create a nice, floating, fixed bar at the bottom of the YouTube video page. Most importantly,
                // the bar is non-blocking (unlike an alert()), meaning music playlists won't pause waiting for user input.
                var createErrorDiv = function() {
                    if (!document.body) {
                        return false;
                    }
                    // Check for officially supported browsers. There is no guarantee that other browser engines
                    // are capable of injecting this script early enough to block YouTube's formats.
                    var isChrome = !!window.chrome && !!window.chrome.webstore;
                    var isSafari = navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent.indexOf('Safari') > -1;
                    var isSupportedBrowser = isChrome || isSafari;
                    // Create the error message.
                    var errorMessage = '<p>Your browser failed to disable 60 FPS playback in this tab. Videos in this tab will play in 60 FPS if available.</p>' +
                        '<p style="font-size:85%">You can try again by <a href="#reload" onclick="location.reload();return false" style="color:#fff;text-decoration:underline">reloading</a> the page, using a <a href="#newtab" onclick="var ytplayer=document.getElementById(\'movie_player\');if(ytplayer&&ytplayer.pauseVideo){ytplayer.pauseVideo();};window.open(location.href,\'_blank\');return false" style="color:#fff;text-decoration:underline">new tab</a> or restarting your browser.</p>' +
                        (!isSupportedBrowser ? '<p style="background-color:#000; margin-top:1em;">Special Notice: You are using an unsupported web browser. We can only guarantee success in Google Chrome and Safari.</p>' : '');
                    var errorDiv = document.createElement('div');
                    errorDiv.style.position = 'fixed';
                    errorDiv.style.bottom = 0;
                    errorDiv.style.left = 0;
                    errorDiv.style.width = '100%';
                    errorDiv.style.padding = '10px';
                    errorDiv.style.textAlign = 'center';
                    errorDiv.style.fontSize = '130%';
                    errorDiv.style.fontWeight = 'bold';
                    errorDiv.style.color = '#fff';
                    errorDiv.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
                    errorDiv.style.zIndex = '99999';
                    errorDiv.innerHTML = errorMessage;
                    document.body.appendChild(errorDiv);
                    return true;
                };

                // Because we're running at document-start, we may not have a DOM yet. So defer the creation
                // of the footer warning bar until the DOM has finished loading, if necessary.
                if (document.readyState !== 'interactive' && document.readyState !== 'complete') {
                    var createdDiv = false;
                    document.addEventListener('readystatechange', function(evt) {
                        if (!createdDiv && (document.readyState === 'interactive' || document.readyState === 'complete')) {
                            createdDiv = createErrorDiv(); // Deferred creation.
                        }
                    }, false);
                } else {
                    createErrorDiv(); // DOM was already loaded, so create the bar immediately.
                }
            }
        }
    };

    /*
        Override the browser's Media Source Extensions codec checker,
        to tell YouTube that we don't support any formats above 30FPS.

        (It's very important that this userscript is @run-at document-start,
        before any of the YouTube scripts have had time to query the MSE!)
    */
    if (window.MediaSource) {
        // Read the current "fpsreloads=X" count from the URL, if a value exists.
        var currentFPSReloads = getReloadCount();

        // This instantly detects whether our userscript has *definitely* been injected too late into the page:
        // All of YouTube's high-FPS format checks are performed by window.ytplayer.load()'s call-chain.
        // If we're injected early enough, the "window.ytplayer" object will either be totally missing (rarely),
        // or is completely empty with no properties or functions yet (this is the situation most of the time).
        var injectedTooLate = !(!window.ytplayer || Object.getOwnPropertyNames(window.ytplayer).length === 0);
        if (isVideoPage() && injectedTooLate) { // We only need to perform this check if we're on a video page.
            handleInjectionRetries(false, currentFPSReloads); // Failed.
            return; // Skips the rest of the code below.
        }

        // The YouTube player code hasn't been loaded yet, so it's almost certain that our injection will succeed.
        // We should therefore remove any "fpsreloads=X" value from the URL now, so that people can copy and paste
        // their video link to share it with others without sharing the "fpsreloads=X" value.
        deleteReloadCount();

        // Even though we didn't see the YouTube player's "load()" function, we'll also set up a separate check which waits
        // a while and then verifies that we've successfully blocked high-FPS formats. This is just for extra safety.
        var injectedAtTime = performance.now(); // Debug variable.
        var blockCount = 0;
        var updateBlockCount = function(action, videoType) {
            if (action == 'block') {
                blockCount++;
                if (useTimeElapsedDebug && blockCount === 1) {
                    console.log('Time from injection until 1st blocked format: ' + (performance.now() - injectedAtTime));
                }
            }
        };
        var verifyBlockCount = function() {
            // As of 2017, we expect to block 5 formats under normal circumstances, but that number
            // may change. Either way, JavaScript is single-threaded, so if our overridden format
            // checking function has been queried by YouTube even a single time, it means that we've
            // successfully injected before YouTube's scripts did their format capability check!
            if (blockCount >= 1) {
                handleInjectionRetries(true, currentFPSReloads); // Successfully injected.
            } else {
                handleInjectionRetries(false, currentFPSReloads); // Failed.
            }
        };

        // How long to wait until we confirm injection success by checking how many (if any) formats we've
        // blocked. This delay must be carefully balanced, so that the page has a chance to fully load and
        // perform its format check.
        //
        // The time it takes from injection until format blocking depends on how early the browser injects
        // us into the page, and how fast the browser executes the rest of YouTube's code after that!
        // It is also influenced by the user's computer speed.
        //
        // Here are browser measurements for how long after injection YouTube's format check usually happens:
        // - Safari: 200-775ms (Usually 250-550ms).
        // - Chrome: 700-2050ms (Usually around 1800ms, but sometimes frequents the 900ms range).
        // - Firefox: Not measured with the new timer code, but it was ~600-800ms longer than Chrome.
        //
        // Anyway, because of the fact that our "window.ytplayer" check above is so accurate at instantly
        // detecting almost 100% of all cases of too-late injection, we don't need this "was the injection
        // truly successful?" verification to be very fast, so we can afford to let it wait for a long time.
        // Because if we didn't see the "window.ytplayer.load()" function, then we can be almost totally
        // certain that we've been injected early enough and that our format-blocker will be successful.
        if (isVideoPage()) {
            // Check for confirmed "format blocking success" 12 seconds after injection into this video page.
            setTimeout(verifyBlockCount, 12000);
        } else {
            // We've definitely been injected into the site early enough, since we're on a non-video page!
            handleInjectionRetries(true, currentFPSReloads); // Successfully injected.
        }

        // Inject our video format blocker.
        var originalChecker = window.MediaSource.isTypeSupported.bind(window.MediaSource);
        window.MediaSource.isTypeSupported = createNewTypeChecker(originalChecker, updateBlockCount, useQueryDebug, useCallstackDebug);
    }
})();