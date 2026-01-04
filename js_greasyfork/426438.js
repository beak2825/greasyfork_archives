// ==UserScript==
// @name Plex Dark Small Static Control Bar
// @namespace imadedis
// @version 0.0.4
// @description Keeps a small control bar always on screen during playback, dark color
// @author imadedis
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://app.plex.tv/*
// @include /^(?:https?://.*:32400/.*)$/
// @include /^(?:.*:32400/.*)$/
// @include https://app.plex.tv*/*
// @downloadURL https://update.greasyfork.org/scripts/426438/Plex%20Dark%20Small%20Static%20Control%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/426438/Plex%20Dark%20Small%20Static%20Control%20Bar.meta.js
// ==/UserScript==

(function() {
let css = `

/* static controlbar */
[class^='AudioVideoFullPlayer-bottomBar'] {
    bottom: 0px !important;
    height: 25px !important;
    transform: translateY(0px) !important;
}

/* controlbar */
[class^='ControlsContainer-controlsContainer'] {
    height: 100%;
    padding-top: 0%;
}    
    
[class^='PlayerControls-volumeSlider'] {
    height: 65%;
    bottom: unset;
}

div[class*='VerticalSlider-track'] {
    width: 3px;}

[class^='PlayerControlsMetadata'] {
    display: inline-flex;
    align-items: baseline;
    }

    [class^='MetadataPosterTitle-singleLineTitle'] {
padding-right: 10px;
}

[class^='PlayerControls-buttonGroupCenter'] {
    margin: 0;
}

[class^='Player-miniPlayerContainer']>div {
    bottom: 0px !important;
}    
    
/* move subtitles */

.libjass-subs,
libjass-subs:active {
    height: 100% !important;
}

/* move subtitles (optional) */

/*
.Subtitles-measure-3cYuWS {}
    top: -10% !important; 
*/


/* color controlbar*/
[class^='PlayerIconButton'] {
    background-color: transparent;
}

[class^='BottomBar-bottomBar'] {
    background-color: transparent;
}
    
div[class^='SeekBar-seekBarBuffer'] {
    background-color: rgba(194, 194, 194, 0.4);
}

div[class^='SeekBar-seekBarFill'] {
    background-color: rgba(255, 255, 255, .4);
}

div[class^='VolumeSlider-fill'] {
    background-color: #C3C3C3;
}

/* color AudioVideoFullPlayer-videoTopBar-LTn8L6 */
    
div[class*='AudioVideoFullPlayer-videoTopBar'] {
    background-color: transparent;
}    
    
/* color PlayPauseOverlay-playCircle-1xl6BG PlayButton-playCircle */    
    
svg[class^='Play'] {
    background-color: transparent !important;
    border-color: #C3C3C3 !important;
    box-shadow: none !important;
}

/* options container */

div[class*='AudioVideoStripeContainer-container'] {
    bottom: 0% !important;
/*     background-color: transparent;  */
}

[class*='IconButton-isActive'] {
    color:grey !important;
}

[class*='isSelected'] {
    color:white;
    border-color:white;
}

div[class*='selectedIcon'] {
    color:white !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
