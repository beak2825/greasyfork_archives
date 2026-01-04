// ==UserScript==
// @name        4chan 404 Archive Links
// @match       https://boards.4channel.org/*/thread/*
// @match       http://boards.4channel.org/*/thread/*
// @match       https://boards.4chan.org/*/thread/*
// @match       http://boards.4chan.org/*/thread/*
// @grant       none
// @version     1.0
// @description Redirects dead 4chan threads to archives without 4chan-X
// @author      Ihidd
// @grant       GM_getResourceText
// @resource    res_archives_json https://4chenz.github.io/archives.json/archives.json
// @run-at      document-idle
// @license MIT
// @namespace https://greasyfork.org/users/916881
// @downloadURL https://update.greasyfork.org/scripts/445332/4chan%20404%20Archive%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/445332/4chan%20404%20Archive%20Links.meta.js
// ==/UserScript==

(function () { 
  "use strict";
  
  function clear_all_timeouts() {
    let highest_timeout_id = setTimeout(";");
    for (let i = 0; i < highest_timeout_id; i++) {
        clearTimeout(i); 
    }
  }

  function create_board_link_node(url, text) {
    let link_node = document.createElement("a");
    link_node.href = url;
    link_node.innerHTML = text;

    let link_div = document.createElement("div");
    link_div.classList.add("shown");
    link_div.innerHTML = "[";
    link_div.appendChild(link_node);
    link_div.innerHTML += "]";

    return link_div;
  }
  
  function is_404_page() {
    let box_title_bar = document.querySelector(".boxbar h2");
    return !(!box_title_bar) && box_title_bar.innerHTML.includes("404");
  }
  
  function append_archive_links() {
    const url_path = window.location.pathname.toString().split("/");
    const url_board_name = url_path[1];
    const url_thread_no = url_path[3];

    const archives_json_text = GM_getResourceText("res_archives_json");
    const archives_json = JSON.parse(archives_json_text);

    let board_links_parent = document.getElementsByClassName("boxcontent")[0];
    let archive_links_hr = document.createElement("hr");
    board_links_parent.appendChild(archive_links_hr);

    for (const archive of archives_json) {
      if(archive.boards.includes(url_board_name)) {
        let protocol = "https";
        if(!archive.https) {
          protocol = "http";
        }
        let board_link_node = create_board_link_node(`${protocol}://${archive.domain}/${url_board_name}/thread/${url_thread_no}`, archive.name);
        board_links_parent.appendChild(board_link_node);
      }
    }
  }
  
  if(is_404_page()) {
    // Prevent the redirect - race condition but can't find a better method
    window.setTimeout(clear_all_timeouts, 5000);
    
    append_archive_links();
  }
})();
