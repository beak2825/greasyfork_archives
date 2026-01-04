// ==UserScript==
// @name         Hide/Show ruby text/Furigana (hotkey & on-screen button)
// @description  Add an on-screen button and hotkey to toggle furigana on an off
// @version      1.6
// @match        <all_urls>
// @grant        none
// @namespace    https://greasyfork.org/users/683917
// @downloadURL https://update.greasyfork.org/scripts/413660/HideShow%20ruby%20textFurigana%20%28hotkey%20%20on-screen%20button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/413660/HideShow%20ruby%20textFurigana%20%28hotkey%20%20on-screen%20button%29.meta.js
// ==/UserScript==

(function() {



  /* CONFIGURATION */


  // If left as "", it uses the key under ESC (independed of the keyboard layout). When customized the keyboard layout is respected.
  const HOTKEY = ""; 

  // Show or hide the onscreen button. Doesn't affect the hotkey.
  const ONSCREEN_BUTTON_ENABLED = false;

  // This is inserted verbatim into the CSS for the button, so for example replacing "left" with "right" will put the button on the right of the screen.
  const ONSCREEN_BUTTON_POSITION = "top:5px;left:5px";

  /*---------------*/



  const css_visible = 'rt {visibility:visible !important;} .furigana {visibility:visible !important;}';
  const css_hidden = 'rt {visibility:hidden !important;} .furigana {visibility:hidden !important;}';
  const box_text_visible = 'ふりがな：見';
  const box_text_hidden = 'ふりがな：隠';

  var show_furigana = true;

  window.addEventListener('load', function() {
    
    // life.ou.edu special case
    if(document.domain == "life.ou.edu")  {
    	document.body.innerHTML = document.body.innerHTML.replace(/([一-龠ぁ-ゔ]+)（([ぁ-ゔ]*)）/g," <ruby>$1<rt>$2</rt></ruby>");
    }

    //Only activate script if <ruby> tags are actually used on the website
    if(document.getElementsByTagName("ruby").length > 0 || document.getElementsByClassName("furigana").length > 0) {

      //Add global style
      var style = document.createElement('style');
      document.head.appendChild(style);
      style.type = 'text/css';
      //style.innerHTML = css_visible;

      if(ONSCREEN_BUTTON_ENABLED) {
        //Add on-screen button
        var onscreen_button = document.createElement('div');
        onscreen_button.style = 'position:fixed;'+ONSCREEN_BUTTON_POSITION+';padding:2px 5px;z-index:1000;border-radius:5px;background-color:rgba(0,0,0,0.9);color:#ffffff;cursor:pointer;';
        onscreen_button.onclick = toggle_furigana;
        onscreen_button.innerHTML = box_text_visible;
       
        document.body.appendChild(onscreen_button);
      }

      window.addEventListener('keydown', function(e) {
        if((HOTKEY != "" && e.key == HOTKEY) || (HOTKEY == "" && e.code == "Backquote")) {
          console.log("Toggle Furigana");
          toggle_furigana();
        }
      },true);

      function toggle_furigana() {
        if(show_furigana) {
          show_furigana = false;
          style.innerHTML = css_hidden;
          onscreen_button.innerHTML = box_text_hidden;
        } else {
          show_furigana = true;
          style.innerHTML = css_visible;
          onscreen_button.innerHTML = box_text_visible;
        }
      }
    }
  });

})();