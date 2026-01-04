// ==UserScript==
// @name        Twitch - Mute and hide ads, while keeping the audio of the stream on
// @namespace   TWITCHADS
// @description Automatically mutes and hides the Twitch player when an advertisement started and revert it back to normal once finished. The stream can still be heard during ads. You can also display ads via the "Ads Options" button.
// @include     https://www.twitch.tv/*
// @include     https://twitch.tv/*
// @version     1.17
// @license     MIT
// @author      Harest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/371186/Twitch%20-%20Mute%20and%20hide%20ads%2C%20while%20keeping%20the%20audio%20of%20the%20stream%20on.user.js
// @updateURL https://update.greasyfork.org/scripts/371186/Twitch%20-%20Mute%20and%20hide%20ads%2C%20while%20keeping%20the%20audio%20of%20the%20stream%20on.meta.js
// ==/UserScript==
(async function() {

  /* Persistent settings you can edit for the most part (they'll have the mention "EDITABLE")
     Starting with v1.17, some parameters will only be managed via the "Ads Options" button
     Currently: disableDisplay. Changing the value here will have no direct effect, until you
     refresh the saved settings from the "Ads Options" menu.
  */
  var _tmuteCustomVars = {"timerCheck": 500,                // EDITABLE - Checking rate of ad in progress (in milliseconds; recommended value: 250 - 1000; default: 500)
                          "adsDisplayed": 0,                //            Keep track of the total number of ads displayed
                          "disableDisplay": true,           // EDITABLE - Disable the player display during an ad (true = yes (default), false = no)
                          "anticipatePreroll": false,       // EDITABLE - Temporarily mute and/or hide the player when loading a new stream to anticipate a pre-roll ad (true = yes, false = no (default))
                          "anticipateTimer": 3000,          // EDITABLE - Time where the player is muted and/or hidden when loading a new stream to anticipate a pre-roll ad (in milliseconds; default: 3000)
                          "adUnlockAt": 270,                // EDITABLE - Unlock the player if this amount of seconds elapsed during an ad (in seconds; default: 270)
                          "adMinTime": 2,                   // EDITABLE - Minimum amount of seconds the player will be muted/hidden since an ad started (in seconds; default: 2)
                         };
  
  // Load (saved) custom settings
  async function loadSettings(overwrite = false) {
    let settings = {};
    for (const setting in _tmuteCustomVars) {
      let settingValue = typeof GM_getValue === "undefined" ? await GM.getValue(setting) : GM_getValue(setting);
      // By default, we overwrite set values outside of the currently handled one, to allow the above persistent settings to be taken into account
      if (settingValue === undefined || overwrite === true || (setting !== "disableDisplay" && setting !== "adsDisplayed")) {
        settingValue = _tmuteCustomVars[setting];
        (typeof GM_setValue === "undefined") ? await GM.setValue(setting, settingValue) : GM_setValue(setting, settingValue);
      }
      settings[setting] = settingValue;
    }
    return settings;
  }

  // Save a custom setting (currently only handle disableDisplay and adsDisplayed)
  async function saveSetting(key, value) {
    (typeof GM_setValue === "undefined") ? await GM.setValue(key, value) : GM_setValue(key, value);
  }
  
  // Variables used to run the script, don't edit these
  var _tmuteLoadedVars = await loadSettings();
  var _tmuteVars = {..._tmuteLoadedVars,
                    "adInProgress": false,            //            Track if an ad is in progress or not (directly linked to player mute state)
                    "anticipateInProgress": false,    //            Used to check if we're currently anticipating a pre-roll ad
                    "anticipatePrematureEnd": false,  //            Used to check if we prematurely ended a pre-roll ad anticipation
                    "alreadyMuted": false,            //            Used to check if the player is muted at the start of an ad
                    "adElapsedTime": undefined,       //            Used to check if Twitch forgot to remove the ad notice
                    "playerIdAds": 0,                 //            Player ID where ads may be displayed (default 0, varying on squads page)
                    "displayingOptions": false,       //            Either ads options extended menu is currently displayed or not
                    "highwindPlayer": undefined,      //            If you've the Highwind Player or not
                    "currentPage": undefined,         //            Current page to know if we need to reset ad detection on init, or add the ads options back
                    "currentChannel": undefined,      //            Current channel to avoid pre-roll ad anticipation to trigger if we visit channel pages
                    "optionsInitialized": false,      //            Used to know if the ads options have been initialized on the current page
                    "optionsInitializing": false,     //            Used to track the ads options initialization
                    "volumePremute": undefined        //            Main player volume, used to set the volume of the stream top right during an ad
                   };
  // Selectors for the current player (hw: highwind player, only one existing currently)
  var _tmuteSelectors = { "hw":  { "player": "video-player__container",                               // Player class
                                   "playerVideo": ".video-player__container video",                   // Player video selector
                                   "playerDuringAd": "pbyp-player-instance",                          // Top-right player class, existing sometimes during an ad
                                   "playerHidingDuringAd": "picture-by-picture-player--collapsed",    // Class hiding the top-right player (during an ad)
                                   "muteButton": "button[data-a-target='player-mute-unmute-button']", // (un)mute button selector
                                   "volumeSlider": "input[data-a-target='player-volume-slider']",     // Volume slider selector
                                   "adNotice": undefined,                                             // Ad notice class
                                   "adNoticeFinder": "[data-a-target='ax-overlay']",                  // Ad notice selector to find the class
                                   "viewersCount": "metadata-layout__support"                         // Viewers count wrapper class
                                 }
                        };
  // Current selector (automatically set below)
  var currentSelector = undefined;
  
  // Check if there's an ad (main loop)
  function checkAd()
  { 
    // Check if you're watching a stream, useless to continue if not
    if (_tmuteVars.highwindPlayer === undefined) {
      var isHwPlayer = document.getElementsByClassName(_tmuteSelectors.hw.player).length;
      var isViewing = Boolean(isHwPlayer);
      if (isViewing === false) return;
      
      // We set the type of player currently used
      _tmuteVars.highwindPlayer = Boolean(isHwPlayer);
      currentSelector = (_tmuteVars.highwindPlayer === true) ? _tmuteSelectors.hw : null;
      console.log("You're currently using the " + ((_tmuteVars.highwindPlayer === true) ? "Highwind" : "new unknown") + " player.");
      if (currentSelector === null) {
        clearInterval(_tmuteVars.autoCheck);
        console.log("Script stopped. Failed to find the player, Twitch changed something. Feel free to contact the author of the script.");
      }
    } else {
      var isViewing = Boolean(document.getElementsByClassName(currentSelector.player).length);
      if (isViewing === false) return;
    }
    
    // Initialize the ads options if necessary.
    if (_tmuteVars.optionsInitialized === false || window.location.pathname != _tmuteVars.currentPage) {
      initAdsOptions();
      if (currentSelector.adNotice === undefined) return;
    }
    
    var advert = document.getElementsByClassName(currentSelector.adNotice)[_tmuteVars.playerIdAds];
    
    if (_tmuteVars.adElapsedTime !== undefined)
    {
      _tmuteVars.adElapsedTime += _tmuteVars.timerCheck / 1000;
      if (_tmuteVars.adElapsedTime >= _tmuteVars.adUnlockAt && advert.childNodes[1] !== undefined) 
      {
        for (var i = 0; i < advert.childElementCount; i++)
        {
          if (!advert.childNodes[i].classList.contains(currentSelector.adNotice)) advert.removeChild(advert.childNodes[i]);
        }
        console.log("Unlocking Twitch player as Twitch forgot to remove the ad notice after the ad(s).");
      }
    }
    
    if ((advert.childElementCount > 2 && _tmuteVars.adInProgress === false) || (_tmuteVars.adInProgress === true && advert.childElementCount <= 2)) 
    {
      // Update at the start of an ad if the player is already muted or not
      if (advert.childElementCount > 2) {
        if (_tmuteVars.anticipateInProgress !== false) {
          clearTimeout(_tmuteVars.anticipateInProgress);
          _tmuteVars.anticipateInProgress = false;
          _tmuteVars.anticipatePrematureEnd = true;
          console.log("Pre-roll ad anticipation ended prematurely, ad detected.");
        } else {
          isAlreadyMuted();
        }
      }
      
      // Keep the player muted/hidden for the minimum ad time set (Twitch started to remove the ad notice before the end of some ads)
      if (advert.childElementCount <= 2 && _tmuteVars.adElapsedTime !== undefined && _tmuteVars.adElapsedTime < _tmuteVars.adMinTime) return;

      mutePlayer();
    }
  }

  // Main function to (un)mute and (un)hide the player called by checkAd()
  function mutePlayer()
  {
    if (document.querySelector(currentSelector.muteButton) !== null)
    {
      if (_tmuteVars.anticipatePrematureEnd === true) { // If we ended a pre-roll ad anticipation early, we prevent an invert of the player mute state
        _tmuteVars.anticipatePrematureEnd = false;
        _tmuteVars.adInProgress = !(_tmuteVars.adInProgress);
      } else {
        actionMuteClick();
      }

      if (_tmuteVars.adInProgress === true)
      {
        _tmuteVars.adsDisplayed++;
        saveSetting("adsDisplayed", _tmuteVars.adsDisplayed);
        _tmuteVars.adElapsedTime = 1;
        console.log("Ad #" + _tmuteVars.adsDisplayed + " detected. Player " + (_tmuteVars.alreadyMuted === true ? "already " : "") + "muted.");
        actionHidePlayer();
        unmuteAdPlayer();
      } else {
        console.log("Ad #" + _tmuteVars.adsDisplayed + " finished (lasted " + _tmuteVars.adElapsedTime + "s)." + (_tmuteVars.alreadyMuted === true ? "" : " Player unmuted."));
        _tmuteVars.adElapsedTime = undefined;
        actionHidePlayer(false);
        
        // Mute the stream shown top right during the ad to prevent double audio
        var playerDuringAd = document.getElementsByClassName(currentSelector.playerDuringAd)[0];
        if (playerDuringAd !== undefined) {
          playerDuringAd.childNodes[0].muted = true;
        }
      }
    } else {
      console.log("No volume button found (class changed ?).");
    }
  }
  
  // Unmute (and unhide) the stream showing top right during an ad if the player was initially unmuted
  function unmuteAdPlayer(firstCall = true) {
    var playerDuringAd = document.getElementsByClassName(currentSelector.playerDuringAd)[0];
    if (playerDuringAd !== undefined) {
      playerDuringAd.childNodes[0].setAttribute("controls", true);
      if (_tmuteVars.alreadyMuted === false) {
        playerDuringAd.childNodes[0].volume = _tmuteVars.volumePremute;
        playerDuringAd.childNodes[0].muted = false;
      }
      // Check the player is not hidden by Twitch, else force display it
      var playerHidden = document.getElementsByClassName(currentSelector.playerHidingDuringAd)[0];
      if (playerHidden !== undefined) {
        playerHidden.classList.remove(currentSelector.playerHidingDuringAd);
        console.log("Stream top right hidden detected during the ad. Unhidden.");
      }
    } else if (firstCall === true) { // Delaying a bit just in case it didn't load in DOM yet
      setTimeout(function() { unmuteAdPlayer(false); }, 2000);
    }
  }
  
  // (un)Mute (and (un)hide) the player when loading a stream to anticipate a pre-roll ad, 
  // to reduce to nothing the delay you can have before the ad notice is displayed by Twitch / script detects a pre-roll ad
  function anticipatePreroll(initCall = true) {
    if (_tmuteVars.anticipatePreroll === false || (_tmuteVars.anticipateInProgress !== false && initCall === true)) return;
    if (document.querySelector(currentSelector.muteButton) !== null) {
      if (initCall === true) isAlreadyMuted();
      actionMuteClick(true);
    }
    actionHidePlayer(initCall);
    
    if (initCall === true) {
      console.log("Pre-roll ad anticipation set for ", _tmuteVars.anticipateTimer, " ms. Player " + (_tmuteVars.alreadyMuted === true ? "already " : "") + "muted.");
      _tmuteVars.anticipateInProgress = setTimeout(function() { anticipatePreroll(false); }, _tmuteVars.anticipateTimer);
    } else {
      _tmuteVars.anticipateInProgress = false;
      console.log("Pre-roll ad anticipation ended.");
    }
  }
  
  // Click on the (un)mute button
  function actionMuteClick(anticipatingCall = false) {
    _tmuteVars.volumePremute = document.querySelectorAll(currentSelector.playerVideo)[_tmuteVars.playerIdAds].volume;
    if (_tmuteVars.alreadyMuted === false) document.querySelectorAll(currentSelector.muteButton)[_tmuteVars.playerIdAds].click(); // If the player is already muted before an ad, we avoid to unmute it.
    if (anticipatingCall === false) _tmuteVars.adInProgress = !(_tmuteVars.adInProgress);
  }
  
  // (un)Hide the player
  function actionHidePlayer(hideIt = true) {
    if (_tmuteVars.disableDisplay === true) {
      document.querySelectorAll(currentSelector.playerVideo)[_tmuteVars.playerIdAds].style.visibility = (hideIt === true) ? "hidden" : "visible";
    }
  }
  
  // Detect (and set) if the player is already muted or not (to revert it to its initial state after an ad or anticipating a pre-roll)
  function isAlreadyMuted() {
    if (_tmuteVars.highwindPlayer === true) {
      _tmuteVars.alreadyMuted = Boolean(document.querySelector(currentSelector.volumeSlider).valueAsNumber === 0);
    }
  }
  
  // Detect if the ads options have been initialized, and starts init if required
  function initAdsOptions(lastCalls = 0, failSafeCall = false) {
    clearTimeout(_tmuteVars.optionsInitializing);
    var optionsInitialized = (document.getElementById("_tmads_options") === null) ? false : true;
    if (optionsInitialized === true) initUpdate();
    if (optionsInitialized === false) {
      _tmuteVars.optionsInitialized = false;
      adsOptions("init");
      _tmuteVars.optionsInitializing = setTimeout(function() { initAdsOptions(); }, _tmuteVars.timerCheck);
    } else if (lastCalls < 5) { // Doing last checks just in case as Twitch reloads these elements on load
      lastCalls++;
      if (lastCalls === 5) failSafeCall = true;
      _tmuteVars.optionsInitializing = setTimeout(function() { initAdsOptions(lastCalls, failSafeCall); }, Math.max(_tmuteVars.timerCheck, 500)); 
    } else if (failSafeCall === true) { // Some actions can remove the ads options button from the page, so we keep a check as a failsafe
      _tmuteVars.optionsInitializing = setTimeout(function() { initAdsOptions(lastCalls, failSafeCall); }, 60000); 
    }
  }
  
  // Update different values on init
  function initUpdate() {
    if (window.location.pathname != _tmuteVars.currentPage) {
      // Do the resets needed if we changed page during an ad
      if (_tmuteVars.adInProgress === true) {
        resetPlayerState();
      } else if (_tmuteVars.adInProgress === false && (_tmuteVars.currentChannel === undefined || window.location.pathname.startsWith("/" + _tmuteVars.currentChannel) === false)) {
        anticipatePreroll();
      }
    }

    _tmuteVars.currentPage = window.location.pathname;
    _tmuteVars.currentChannel = window.location.pathname.split("/")[1];

    // Find the ad notice class if not already set
    if (currentSelector.adNotice === undefined) {
      clearInterval(_tmuteVars.autoCheck); // Temporarily stop the checks while we find the ad notice class
      if (document.querySelector(currentSelector.adNoticeFinder) !== null)
      {
        currentSelector.adNotice = document.querySelector(currentSelector.adNoticeFinder).parentNode.className;
        console.log("Ad notice class retrieved (\"" + currentSelector.adNotice + "\") and set.");
        _tmuteVars.autoCheck = setInterval(checkAd, _tmuteVars.timerCheck); // Ad notice class set, we can set the ad auto check back up
      } else {
        console.log("Script stopped. Failed to find the ad notice class, Twitch changed something. Feel free to contact the author of the script.");
      }
    }
  }
  
  // Reset player state when switching stream during an ad
  function resetPlayerState() {
    actionMuteClick();
    actionHidePlayer(false);
    console.log("Stream switched during an ad. Reverted player state.");
  }
  
  // Manage ads options
  function adsOptions(changeType = "show")
  {
    switch(changeType) {
      // Manage player display during an ad (either hiding the ads or still showing them)
      case "display":
        _tmuteVars.disableDisplay = !(_tmuteVars.disableDisplay);
        saveSetting("disableDisplay", _tmuteVars.disableDisplay);
        // Update the player display if an ad is supposedly in progress
        if (_tmuteVars.adInProgress === true) document.querySelectorAll(currentSelector.playerVideo)[_tmuteVars.playerIdAds].style.visibility = (_tmuteVars.disableDisplay === true) ? "hidden" : "visible";
        document.getElementById("_tmads_display").innerText = (_tmuteVars.disableDisplay === true ? "Show" : "Hide") + " player during ads";
        break;
      // Force a player unlock if Twitch didn't remove the ad notice properly instead of waiting the auto unlock
      case "unlock":
        var advert = document.getElementsByClassName(currentSelector.adNotice)[0];
        
        if (_tmuteVars.adElapsedTime === undefined && advert.childNodes[2] === undefined)
        {
          alert("There's no ad notice displayed. No unlock to do.");
        } else {
          // We set the elapsed time to the unlock timer to trigger it during the next check.
          _tmuteVars.adElapsedTime = _tmuteVars.adUnlockAt;
          console.log("Unlock requested.");
        }
        break;
      // Display the ads options button
      case "init":
        initUpdate();
        
        if (document.getElementsByClassName(currentSelector.viewersCount)[0] === undefined) break;
        
        // Append ads options and events related
        var optionsTemplate = document.createElement("div");
        optionsTemplate.id = "_tmads_options-wrapper";
        const buttonStyle = document.createElement('style');
        buttonStyle.textContent = `
        #_tmads_options-wrapper {
          margin-right: 10px;
        }
        ._tmads_button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 2px 0 2px;
          margin-left: 10px;
          height: 30px;
          width: unset;
          border-radius: var(--border-radius-medium);
          background-color: var(--color-background-button-text-default);
          color: var(--color-fill-button-icon);
        }
        #_tmads_options {
          display: inline-flex;
          border-radius: var(--border-radius-large);
          background-color: var(--color-background-body);
          position: fixed;
          z-index: 5;
          margin-left: -300px;
        }
        ._tmads_button:hover {
          background-color: var(--color-background-button-text-hover);
          color: var(--color-fill-button-icon-hover);
        }`;
        document.querySelector('head').appendChild(buttonStyle);
        optionsTemplate.innerHTML = `
        <span id="_tmads_options" style="display: none;">
        	<button type="button" id="_tmads_refreshsettings" class="_tmads_button" title="Refresh saved custom settings from the userscript"><svg width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" 
          d="M12 4a2 2 0 0 1-3.562 1.249A5.005 5.005 0 0 0 6.25 6.693a3.978 3.978 0 0 0-2-.685 7.011 7.011 0 0 1 3.896-2.76A2 2 0 0 1 12 4zm6 6a2 2 0 1 1-3.249-1.562 5.004 5.004 0 0
          0-1.444-2.188c.394-.577.64-1.261.685-2a7.011 7.011 0 0 1 2.76 3.896A2 2 0 0 1 18 10zm-6.146 6.752a2 2 0 1 1-.292-2 5.004 5.004 0 0 0 2.188-1.445c.577.394 1.261.64 2 .685a7.011
          7.011 0 0 1-3.896 2.76zm-6.605-5.19a2 2 0 1 0-2 .292 7.012 7.012 0 0 0 2.759 3.897c.045-.74.291-1.424.685-2.001a5.005 5.005 0 0 1-1.444-2.188z"></path></svg></button>
          <button type="button" id="_tmads_unlock" class="_tmads_button">Unlock player</button>
          <button type="button" id="_tmads_display" class="_tmads_button">` + (_tmuteVars.disableDisplay === true ? "Show" : "Hide") + ` player during ads</button>
        </span>
        <button type="button" id="_tmads_showoptions" class="_tmads_button">Ads Options</button>`;
        
        // Normal player page
        if (document.getElementsByClassName(currentSelector.viewersCount)[0] !== undefined)
        {
          _tmuteVars.playerIdAds = 0;
          try {
            document.getElementsByClassName(currentSelector.viewersCount)[0].parentNode.childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[1].appendChild(optionsTemplate); // Standard bottom
          } catch(e) {
            try {
              document.getElementsByClassName(currentSelector.viewersCount)[0].childNodes[2].childNodes[0].appendChild(optionsTemplate); // Standard top (short variance, abandoned potentially?)
            } catch(e) {
              optionsTemplate.style = "padding-top: 5px;";
              document.getElementsByClassName(currentSelector.viewersCount)[0].parentNode.childNodes[1].appendChild(optionsTemplate); // Last chance attachment, should always work
            }
          }
        }
        
        document.getElementById("_tmads_showoptions").addEventListener("click", adsOptions, false);
        document.getElementById("_tmads_display").addEventListener("click", function() { adsOptions("display"); }, false);
        document.getElementById("_tmads_unlock").addEventListener("click", function() { adsOptions("unlock"); }, false);
        document.getElementById("_tmads_refreshsettings").addEventListener("click", function() { loadSettings(true); 
                                                                                                 alert("Saved custom settings refreshed from the userscript.\n" + 
                                                                                                      "For them to be taken into account, you'll need to refresh the current page."); 
                                                                                               }, false);
        _tmuteVars.optionsInitialized = true;
        console.log("Ads options initialized.");
        
        break;
      // Display/Hide the ads options
      case "show":
      default:
        _tmuteVars.displayingOptions = !(_tmuteVars.displayingOptions);
        document.getElementById("_tmads_options").style.display = (_tmuteVars.displayingOptions === false) ? "none" : "inline-flex";
    } 
  }
  
  // Start the background check
  _tmuteVars.autoCheck = setInterval(checkAd, _tmuteVars.timerCheck);
  
})();