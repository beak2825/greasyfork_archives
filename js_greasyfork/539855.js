// ==UserScript==
// @name		BvS Zombjas Hotkeys (2025)
// @namespace	bvs
// @description	Hotkeys for BvS Zombjas. A box displays the hotkeys and their functions on the zombjas page.
// @author	    Authority2, taltamir, itsnyxtho
// @license     MIT
// @icon        https://github.com/itsnyxtho/bvs/blob/main/other/images/anime_cubed-icon.png?raw=true
// @version     3.6
// @history     3.6    2025 Update to add refresh action to the end of the action list.
//                     version by itsnyxtho
// @history     3.5    2025 Update to get it working. Changes to visual display of hotkeys.
//                     version by itsnyxtho
// @history		3.0    Removed searching from contextual action button. Tweaked
//                     hospital strategy (heal infection, then fight, then heal HP).
//                     Added special key for searching specifically (L). version by taltamir.
// @history		2.0    Optimized strategy. added heal infection, heal HP, and search. Instead
//                     of keys surrounding G, use numpad and keys surrounding S (left and right
//                     handed options). switched include to match. rewrote almost all code.
//                     fixed bug where key detected press rather than release despite notes
//                     saying otherwise. version by taltamir
// @history		1.0    Initial version by Authority2
// @include		http*://*animecubed*.com/billy/bvs/zombjas.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/539855/BvS%20Zombjas%20Hotkeys%20%282025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539855/BvS%20Zombjas%20Hotkeys%20%282025%29.meta.js
// ==/UserScript==

// Register hotkeys for Hotkey Reference Box
(function registerHotkeys() {
  const HOTKEY_STORAGE_KEY = "bvs-hotkeys_zombjas";

  const hotkeys = [
    { keyCombination: "Q / Numpad 7", description: "Move up-left", ownerScript: "BvS Zombjas Hotkeys" },
    { keyCombination: "W / Numpad 8", description: "Move up", ownerScript: "BvS Zombjas Hotkeys" },
    { keyCombination: "E / Numpad 9", description: "Move up-right", ownerScript: "BvS Zombjas Hotkeys" },
    { keyCombination: "A / Numpad 4", description: "Move left", ownerScript: "BvS Zombjas Hotkeys" },
    { keyCombination: "D / Numpad 6", description: "Move right", ownerScript: "BvS Zombjas Hotkeys" },
    { keyCombination: "Z / Numpad 1", description: "Move down-left", ownerScript: "BvS Zombjas Hotkeys" },
    { keyCombination: "X / Numpad 2", description: "Move down", ownerScript: "BvS Zombjas Hotkeys" },
    { keyCombination: "C / Numpad 3", description: "Move down-right", ownerScript: "BvS Zombjas Hotkeys" },
    { keyCombination: "S / Numpad 5", description: "Take action (heal/fight)", ownerScript: "BvS Zombjas Hotkeys" },
    { keyCombination: "R / L", description: "Search", ownerScript: "BvS Zombjas Hotkeys" },
  ];

  localStorage.setItem(
    HOTKEY_STORAGE_KEY,
    JSON.stringify({
      locations: {
        include: ["http*://*animecubed*.com/billy/bvs/zombjas.html"],
        exclude: [],
      },
      hotkeys,
    }),
  );
})();

(() => {
  /*
    Key notes:
    numpad 1 = 97
    numpad 2 = 98
    numpad 3 = 99
    numpad 4 = 100
    numpad 5 = 101
    numpad 6 = 102
    numpad 7 = 103
    numpad 8 = 104
    numpad 9 = 105

    q = 81
    w = 87
    e = 69
    a = 65
    r = 82
    s = 83
    d = 68
    z = 90
    x = 88
    c = 67
  */

  function submit_form(form_name) {
    if (document.forms.namedItem(form_name)) {
      remove_listener(); //Remove keypress listener before page refresh
      location.assign("javascript:" + form_name + ".submit()");
    }
  }

  function key_press(event) {
    if (document.forms.namedItem("theworldends")) {
      //If player pin is available, take it no matter what was pressed
      submit_form("theworldends");
    } else if (event.keyCode == 81 || event.keyCode == 103) {
      //keypress N7 or q = upleft.
      submit_form("moveul"); //move
    } else if (event.keyCode == 87 || event.keyCode == 104) {
      //keypress N8 or w = up.
      submit_form("moveu"); //move
    } else if (event.keyCode == 69 || event.keyCode == 105) {
      //keypress N9 or e = upright.
      submit_form("moveur"); //move
    } else if (event.keyCode == 65 || event.keyCode == 100) {
      //keypress N4 or a = left.
      submit_form("movel"); //move
    } else if (event.keyCode == 68 || event.keyCode == 102) {
      //keypress N6 or d = right.
      submit_form("mover"); //move
    } else if (event.keyCode == 90 || event.keyCode == 97) {
      //keypress N1 or z = downleft.
      submit_form("movedl"); //move
    } else if (event.keyCode == 88 || event.keyCode == 98) {
      //keypress N2 or x = down.
      submit_form("moved"); //move
    } else if (event.keyCode == 67 || event.keyCode == 99) {
      //keypress N3 or c = downright.
      submit_form("movedr"); //move
    } else if (event.keyCode == 83 || event.keyCode == 101) {
      //keypress N5 or s = middle aka actions.
      action(); //action
    } else if (event.keyCode == 82 || event.keyCode == 76) {
      //keypress R or L = search.
      submit_form("zsearch"); //Search
    }
  }

  function action() {
    if (document.forms.namedItem("zheal")) {
      //Check if there is a Heal Infection button
      submit_form("zheal"); //Heal Infection (self)
    } else if (document.forms.namedItem("thrillers")) {
      //Check if there is an fight Thrillers button
      submit_form("thrillers"); //Fight
    } else if (document.forms.namedItem("barglers")) {
      //Check if there is an fight Barglers button
      submit_form("barglers"); //Fight
    } else if (document.forms.namedItem("thumpers")) {
      //Check if there is an fight Thumpers button
      submit_form("thumpers"); //Fight
    } else if (document.forms.namedItem("noms")) {
      //Check if there is an fight Noms button
      submit_form("noms"); //Fight
    } else if (document.forms.namedItem("zfight")) {
      //Check if there is an fight Zombjas button
      submit_form("zfight"); //Fight
    } else if (document.forms.namedItem("zhpheal")) {
      //Check if there is a Heal HP button
      submit_form("zhpheal"); //Heal HP (self)
    } else {
      submit_form("ref"); //If no actions are available, submit the form to refresh the page.
    }
  }

  var div = document.createElement("div");
  div.innerHTML = `
<div style="box-sizing: border-box; border: 2px solid #660000; color: white; background-color: black; font-family: monospace; padding: 4px; margin: 6px 0; white-space: pre-wrap; line-height: 1.15; max-width: 350px; border-radius: 2px; font-size: 11px;"><span style="color:red; font-size: 14px; font-weight: 600;">Zombjas Hotkeys</span>

Use numpad keys (<span style="color:deeppink">78946123</span>) or keys around S (<span style="color:deeppink">QWEADZXC</span>) to move.

Press <span style="color:deeppink">numpad 5</span> or <span style="color:deeppink">S</span> key for actions in order:

    <span style="color:forestgreen">Heal Infection</span> > <span style="color:crimson">Thriller</span> > <span style="color:darkkhaki">Bargler</span> >
    <span style="color:mediumpurple">Thumper</span> > <span style="color:tomato">Nom</span> > <span style="color:darkseagreen">Zombja</span> > <span style="color:springgreen">Heal HP</span> > <span style="color:turquoise">Refresh</span>

Press <span style="color:deeppink">R</span> or <span style="color:deeppink">L</span> to search.
</div>
`;
  document.evaluate("//table[@width=910]/tbody/tr/td/table/tbody/tr/td", document, null, XPathResult.ANY_TYPE, null).iterateNext().appendChild(div);

  function remove_listener() {
    window.removeEventListener("keyup", key_press, false); // Removes the event listener, this is critically important to prevent "playing too fast" errors when spamming the button.
  }

  window.addEventListener("keyup", key_press, false); //When a key is released, run function key_press and provide it with keyID.
})();
