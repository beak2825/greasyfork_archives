// ==UserScript==
// @name         Arrow keys for NetAcad
// @namespace    https://static-course-assets.s3.amazonaws.com/
// @version      0.10
// @description  Arrow keys will scroll pages and figures, and numbers for total sections/topics/pages are inserted
// @author       TakingItCasual
// @match        https://static-course-assets.s3.amazonaws.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381813/Arrow%20keys%20for%20NetAcad.user.js
// @updateURL https://update.greasyfork.org/scripts/381813/Arrow%20keys%20for%20NetAcad.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function get_active_button_i(button_list){
    for(let i=0; i < button_list.length; i++){
      if(button_list[i].classList.contains("active")) return i;
    }
    return -1; // Shouldn't be reached
  }
  function prev_figure(fig_buttons, active_button_i){
    if(active_button_i == 0) return false;
    fig_buttons[active_button_i-1].click()
    return true;
  }
  function next_figure(fig_buttons, active_button_i){
    if(active_button_i == fig_buttons.length-1) return false;
    fig_buttons[active_button_i+1].click()
    return true;
  }
  function scroll_figure(figs, scroll_func){
    if(figs.length == 0) return false;
    let fig_buttons = [];
    figs.forEach(function(fig){
      fig_buttons.push(fig.getElementsByTagName("button")[0]);
    });
    let active_button_i = get_active_button_i(fig_buttons);
    return scroll_func(fig_buttons, active_button_i);
  }
  document.onkeydown = function(e){
    // If, for example, the search overlay is active, disable arrow keys
    if(document.getElementsByClassName("overlay active").length > 0) return;
    let menu_bar = window.top.document.getElementById("page-slide-buttons");
    let figs = [...menu_bar.getElementsByTagName("li")];
    if(e.keyCode == 37){
      if(!scroll_figure(figs, prev_figure)){
        window.top.document.getElementById("page-menu-previous-button").click();
      }
    }else if(e.keyCode == 39){
      if(!scroll_figure(figs, next_figure)){
        window.top.document.getElementById("page-menu-next-button").click();
      }
    }
  };

  let _maps = [
    ["map-sections", "2"],
    ["map-topics", "3"],
    ["map-pages", "4"],
  ]

  for(const _map of _maps){
    let _part_map = window.top.document.getElementById(_map[0]);
    let _part_max = _part_map.getElementsByTagName("li").length;
    if(_part_max > 0){ // This script is run 3 times, the first of which the counts are zero
      if(_map[0] == "map-sections") _part_max--; // Section numbering seems to always start from 0
      const _header = window.top.document.querySelector("div#page-header");
      let _part_text = _header.querySelector('li[aria-level="' + _map[1] + '"] span.breadcrumbs-header');
      let tmp_txt = _part_text.innerHTML;
      if(tmp_txt.indexOf("/") == -1){ // To prevent the 3rd run from repeating this
        let last_dot = tmp_txt.lastIndexOf(".") + 1;
        _part_text.innerHTML = tmp_txt.slice(0, last_dot) + "(" + tmp_txt.slice(last_dot) + "/" + _part_max + ")";
      }
    }
  }
})();
