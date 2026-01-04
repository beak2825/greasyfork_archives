// ==UserScript==
// @name        Echo360 Super Speed
// @namespace   https://www.petertanner.dev/
// @description Adds faster speed options (4x, 3x) to Echo360 player and allows the user to add their own speed options.
// @include     *://echo360.net.au/*
// @include     *://echo360.org.uk/*
// @include     *://echo360.org/*
// @include     *://echo360.ca/*
// @include     *://echo360.org.au/*
// @version     1.2
// @author      Peter Tanner
// @namespace   https://github.com/peter-tanner/Echo360-Super-Speed-Userscript/
// @supportURL  https://github.com/peter-tanner/Echo360-Super-Speed-Userscript/issues
// @license     GPL-3.0
// @website     https://www.petertanner.dev/
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/501694/Echo360%20Super%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/501694/Echo360%20Super%20Speed.meta.js
// ==/UserScript==

/* USER CUSTOMIZATION BEGIN */
// NOTE: Add (or remove) speeds to this array to your liking.
// Note that there is a browser set limit of 16x, and speeds above 4x are muted.
// https://searchfox.org/mozilla-central/rev/f1c881ba5603410dacbe52874053af38bd825c3b/dom/html/HTMLMediascript_Element.cpp#179-183
const selected_speeds = [4, 3, 2, 1.75, 1.5, 1.25, 1, 0.75];
// const selected_speeds = [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25]; // Default Echo360 speeds.

// NOTE: Change this to modify how much the speed changes when you use the < or
// > hotkey to change speed
const speed_hotkey_increment = 0.25;
/* USER CUSTOMIZATION END */

// The code in compatible string representation since we are putting strings in
// script tags instead of executing them here.
const speed_code_txt =
  "[" +
  selected_speeds
    .map((speed) => `{label:"${speed}x",value:${speed}}`)
    .join(",") +
  "]";

const max_speed = Math.max(...selected_speeds);
const min_speed = Math.min(...selected_speeds);

// The page contains a script tag which is called after the player bundle
// `echoPlayerV2FullApp.react-bundle.js` is downloaded. This tag is generated
// with the page and contains information about the video (such as the title,
// institution and thumbnail paths) and calls the player with this information.
// This contextual information is stored in the variable to be called after the
// player is modified.
var player_calling_context =
  "console.error('Echo360 super speed failed to load :(')";

new MutationObserver(async (mutations, observer) => {
  let script_elem = mutations
    .flatMap((e) => [...e.addedNodes])
    .filter((e) => e.tagName === "SCRIPT")
    .find((e) => e.src.match(/echoPlayerV2FullApp\.react-bundle\.js/));

  if (script_elem) {
    // Do not load the unmodified player code
    observer.disconnect();
    script_elem.remove();

    // Download the player code for modification...
    await fetch(script_elem.src)
      .then((e) => e.text())
      .then((player_code) => {
        player_code = player_code.replace(
          // Overwrite all previous speeds in case the user wants to remove the
          // default speeds
          '[{label:"2x",value:2},{label:"1.75x",value:1.75},{label:"1.5x",value:1.5},{label:"1.25x",value:1.25},{label:"1x",value:1},{label:"0.75x",value:.75},{label:"0.5x",value:.5},{label:"0.25x",value:.25}]',

          // Replace with our custom speeds
          speed_code_txt
        );

        player_code = player_code.replace(
          // This code handles hotkeys for changing speed, adjust bounds to match new speeds.
          '{key:">",handler:function(){b<2&&I(b+.25)}},{key:"<",handler:function(){b>.25&&I(b-.25)}}',
          `{key:">",handler:function(){b<${max_speed}&&I(b+${speed_hotkey_increment})}},{key:"<",handler:function(){b>${min_speed}&&I(b-${speed_hotkey_increment})}}`
        );

        // Add the player calling context code since this event listener does
        // not block, resulting in the original player calling code being called
        // (with a harmless error, since the player code has not loaded by the
        // time it is called)
        player_code +=
          ";" +
          player_calling_context +
          "; console.log('Echo360 super speed has successfully been loaded :3')";

        // Create a new script tag containing the modified player & add to head
        const new_script = document.createElement("script");
        new_script.type = "text/javascript";
        new_script.textContent = player_code;
        document.getElementsByTagName("head")[0].append(new_script);
      });
  }
}).observe(document, {
  childList: true,
  subtree: true,
});

window.addEventListener(
  "load",
  () => {
    const script_elems = document.getElementsByTagName("script");
    player_calling_context = script_elems[script_elems.length - 1].innerText;
  },
  false
);
