// ==UserScript==
// @name         Ruby Tag (Furigana) Mouseover Zoom
// @description  When hovering over a ruby element, overlays a large version for easier reading
// @version      2.2
// @grant        none
// @match        <all_urls> 
// @namespace https://greasyfork.org/users/683917
// @downloadURL https://update.greasyfork.org/scripts/413451/Ruby%20Tag%20%28Furigana%29%20Mouseover%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/413451/Ruby%20Tag%20%28Furigana%29%20Mouseover%20Zoom.meta.js
// ==/UserScript==

(function() {
  'use strict';



  /* CONFIGURATION  */

  const HOLD_KEY = "Control";
  const FONT_SIZE = '50px';
  const FONT_COLOR = '#ffffff';
  const BACKGROUND_COLOR = 'rgba(0,0,0,0.7)';

  /* END OF CONFIGURATION  */




  var active = false;
  var current_hover;

  var hoverbox;

  window.addEventListener('keydown', function(e) {
    if(e.key == HOLD_KEY　|| (HOLD_KEY == "Control" && e.ctrlKey && !active) || (HOLD_KEY == "Alt" && e.altKey && !active) || (HOLD_KEY == "Shift" && e.shiftKey && !active)) {
      active = true;
      attach_to_ruby();
      if(current_hover != null) mouseover(current_hover);
    }
  },false);

  window.addEventListener('keyup', function(e) {
    if(e.key == HOLD_KEY || (HOLD_KEY == "Control" && !e.ctrlKey && active) || (HOLD_KEY == "Alt" && !e.ctrlKey && active) || (HOLD_KEY == "Shift" && !e.shiftKey && active)) {
      active = false;
      hoverbox.style.display = 'none';
    }
  },false);

  window.addEventListener('load', function() {

    hoverbox = document.createElement('div');
    hoverbox.style = 'position:fixed;top:0;left:0;padding: 4px 8px;line-height:normal;z-index:1000;background-color:'+BACKGROUND_COLOR+';color:'+FONT_COLOR+';pointer-events:none;font-size:'+FONT_SIZE+';';
    hoverbox.style.display = 'none';
    document.body.appendChild(hoverbox);

    attach_to_ruby();

  }, false);

  function attach_to_ruby() {
    var ruby_elems = document.getElementsByTagName("ruby");
    console.log("Found " + ruby_elems.length + " ruby elements");
    for(var re of ruby_elems) {
      re.onmouseover = function(event){mouseover(event.target);};
      re.onmouseout = function(event){mouseout(event.target);};
    } 
  }

  function mouseover(e) {
    if(e.tagName == "RUBY") {
      if(active && hoverbox.style.display == 'none') {
        hoverbox.innerHTML='<ruby>'+e.innerHTML+'</ruby>';
        hoverbox.style.display = 'block';

        var e_rect = e.getBoundingClientRect();
        var hb_rect = hoverbox.getBoundingClientRect();
        var x = Math.min(window.innerWidth-hb_rect.width, Math.max(0, e_rect.x+e_rect.width/2-hb_rect.width/2));
        hoverbox.style.left = x+'px';
        var y = Math.min(window.innerHeight-hb_rect.height, Math.max(0, e_rect.y+e_rect.height/2-hb_rect.height/2));
        hoverbox.style.top = y+'px';
        //hoverbox.style.transform = 'translate(-50%, -50%)';
      }
      current_hover = e;
    }
  }

  function mouseout(e) {
    if(e.tagName == "RUBY") {
      if(current_hover == e) {
        current_hover = null;
        if(active) {
          hoverbox.style.display = 'none';
        }
      }
    }
  }

})();