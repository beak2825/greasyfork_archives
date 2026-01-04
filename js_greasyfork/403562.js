// ==UserScript==
// @name        REDcord JS
// @match       https://redacted.ch/*
// @version     0.035
// @author      donkey
// @description JS necessary for using the REDcord CSS
// @namespace   https://greasyfork.org/users/162296
// @grant       GM.getValue
// @grant       GM.setValue

// @downloadURL https://update.greasyfork.org/scripts/403562/REDcord%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/403562/REDcord%20JS.meta.js
// ==/UserScript==


(async () => {
  'use strict';
  
  
  (function(document, history, location) {
  var HISTORY_SUPPORT = !!(history && history.pushState);

  var anchorScrolls = {
    ANCHOR_REGEX: /^#[^ ]+$/,
    OFFSET_HEIGHT_PX: 63,

    /**
     * Establish events, and fix initial scroll position if a hash is provided.
     */
    init: function() {
      this.scrollToCurrent();
      $(window).on('hashchange', $.proxy(this, 'scrollToCurrent'));
      $('body').on('click', 'a', $.proxy(this, 'delegateAnchors'));
    },

    /**
     * Return the offset amount to deduct from the normal scroll position.
     * Modify as appropriate to allow for dynamic calculations
     */
    getFixedOffset: function() {
      return this.OFFSET_HEIGHT_PX;
    },

    /**
     * If the provided href is an anchor which resolves to an element on the
     * page, scroll to it.
     * @param  {String} href
     * @return {Boolean} - Was the href an anchor.
     */
    scrollIfAnchor: function(href, pushToHistory) {
      var match, anchorOffset;

      if(!this.ANCHOR_REGEX.test(href)) {
        return false;
      }

      match = document.getElementById(href.slice(1));

      if(match) {
        anchorOffset = $(match).offset().top - this.getFixedOffset();
        $('html, body').animate({ scrollTop: anchorOffset});

        // Add the state to history as-per normal anchor links
        if(HISTORY_SUPPORT && pushToHistory) {
          history.pushState({}, document.title, location.pathname + href);
        }
      }

      return !!match;
    },
    
    /**
     * Attempt to scroll to the current location's hash.
     */
    scrollToCurrent: function(e) { 
      if(this.scrollIfAnchor(window.location.hash) && e) {
      	e.preventDefault();
      }
    },

    /**
     * If the click event's target was an anchor, fix the scroll position.
     */
    delegateAnchors: function(e) {
      var elem = e.target;

      if(this.scrollIfAnchor(elem.getAttribute('href'), true)) {
        e.preventDefault();
      }
    }
  };

	$(document).ready($.proxy(anchorScrolls, 'init'));
})(window.document, window.history, window.location);

  
  
  
  
  
  // Unfortunately, assignment to innerHTML causes the destruction of all child elements, even if you're trying to append
 /* const html_to_insert = document.body.innerHTML.replace(/(StarLord)/gi, "<span class='starlord'>$1</span>");
  document.body.innerHTML = "";
  document.body.insertAdjacentHTML('beforeend', html_to_insert);
  */
  
  const placer = document.getElementById("wrapper");
  const userinfoUsername = document.getElementById("userinfo_username");
  const userinfoMajor = document.getElementById("userinfo_major");
  const userinfoMinor = document.getElementById("userinfo_minor");
  const userinfoStats = document.getElementById("userinfo_stats");
  const clearer = document.createElement("div");
  clearer.classList.add('clear_flex');
  document.getElementById("header").appendChild(clearer);
  
  const ratio = document.getElementById("stats_ratio")
  if (parseFloat(ratio.getElementsByTagName("span")[0].textNode) > 1.0) { ratio.classList.add('hidden'); }
  if (parseFloat(ratio.getElementsByTagName("span")[0].getElementsByTagName("span")[0].textContent) > 1.0) { ratio.classList.add('hidden'); }
  
  const sidebar = document.createElement("div");
  sidebar.setAttribute("id", "sss");
  
  
  const userbar = document.createElement("div");
  userbar.setAttribute("id", "userbar");
  const userbar_avatar = document.createElement("a");
  userbar_avatar.setAttribute("title", "Settings");
  userbar_avatar.classList.add('tooltip');
  userbar_avatar.href = document.getElementById("nav_useredit").getElementsByTagName("a")[0].href;
  userbar_avatar.setAttribute("id", "userbar__avatar");
  
  
  const old_sidebar = document.getElementsByClassName("sidebar")[0];
  const sidebar2 = document.createElement("div");
  sidebar2.setAttribute("id", "ttt");
  
  
  // get / set avatar
  if (window.location.href.includes("user.php?action=edit")) {

    sidebar2.classList.add("ttt_sticky");
    document.getElementById("submit").setAttribute("form", "userform");

    let avatar_url = document.getElementById('avatar').value;
    await GM.setValue('avatar_url', avatar_url);
    userbar_avatar.style["background-image"] = "url('" + avatar_url + "')"
  } else {
    let avatar_url = await GM.getValue('avatar_url', '');
    userbar_avatar.style["background-image"] = "url('" + avatar_url + "')"
  }
  
  
  // for now... whitelist pages with nice searchbars
  var search_form;
  if (window.location.href.includes("torrents.php") || window.location.href.includes("collages.php") || window.location.href.includes("requests.php")) {
    search_form = document.getElementById("content").getElementsByClassName("search_form")[0];
  }
  
  if (old_sidebar) {
    sidebar2.appendChild(old_sidebar);
    placer.insertBefore(sidebar2, placer.children[3]);
   } else if (search_form) {
    sidebar2.classList.add("ttt_sticky");
    sidebar2.appendChild(search_form);
    placer.insertBefore(sidebar2, placer.children[3]);
    // advanced search
    /* 
    document.getElementById('artist_name').getElementsByClassName("label")[0].remove();
    document.getElementsByClassName('ft_artistname')[0].getElementsByTagName("input")[0].placeholder = "Artist name";
    document.getElementById('album_torrent_name').getElementsByClassName("label")[0].remove();
    document.getElementsByClassName('ft_groupname')[0].getElementsByTagName("input")[0].placeholder = "Album/Torrent name";
    document.getElementById('record_label').getElementsByClassName("label")[0].remove();
    document.getElementsByClassName('ft_recordlabel')[0].getElementsByTagName("input")[0].placeholder = "Record label";
    document.getElementById('catalogue_number_year').getElementsByClassName("label")[0].remove();
    document.getElementsByClassName('ft_cataloguenumber')[0].getElementsByTagName("input")[0].placeholder = "Catalogue number";
    document.getElementById('catalogue_number_year').getElementsByClassName("label")[0].remove();
    document.getElementsByClassName('ft_year')[0].getElementsByTagName("input")[0].placeholder = "Year";
    */
  }
  
  
  
  userbar.appendChild(userbar_avatar);
  userbar.appendChild(userinfoUsername);
  
  
  const icon_help = document.createElement("li");
  icon_help.setAttribute("id", "nav_help");
  const icon_help_link = document.createElement("a");
  icon_help_link.classList.add("tooltip");
  icon_help_link.setAttribute("title", "REDcord Bugs & Help");
  icon_help_link.href = "https://redacted.ch/forums.php?action=viewthread&threadid=42223";
  icon_help.appendChild(icon_help_link);
  userinfoMajor.appendChild(icon_help);
  
  const icon_logout = document.createElement("li");
  icon_logout.setAttribute("id", "nav_new_logout");
  const icon_logout_link = document.createElement("a");
  icon_logout_link.setAttribute("title", "Logout");
  icon_logout_link.classList.add('tooltip');
  icon_logout_link.href = "../logout.php";
  icon_logout.appendChild(icon_logout_link);
  userinfoMajor.appendChild(icon_logout);
  
  sidebar.appendChild(userbar);
  sidebar.appendChild(userinfoMinor);
  sidebar.appendChild(userinfoStats);
  
  placer.insertBefore(sidebar, placer.children[2]);
  
  
  
  const avatar_box = document.getElementById("badgesdiv");
  if (avatar_box) {
    old_sidebar.insertBefore(avatar_box, old_sidebar.children[1]);
  }
  
  const artist_info = document.getElementById("artist_information");
  if (artist_info) {
    old_sidebar.insertBefore(artist_info, old_sidebar.children[1]);
  }
  const artist_comments = document.getElementById("artistcomments");
  if (artist_comments) {
    old_sidebar.appendChild(artist_comments);
  }
  
  
  let posts = document.getElementsByClassName("forum_post");
  for (var post of posts) {
    var id = post.id.slice(4);
    const bar_id = document.getElementById("bar" + id);
    const post_id = post.getElementsByClassName("post_id")[0];
   // const quote_id = document.getElementById("quote_" + id);
    if (bar_id) {
   // bar_id.insertBefore(quote_id, bar_id.children[0]); .quote_#### needs to be inserted on artist, torrent comments!
      bar_id.insertBefore(post_id, bar_id.children[0]);
      // const avatar_node = post.getElementsByClassName("avatar")[0];
      // var class_node = post.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].getElementsByTagName("div")[0].getElementsByTagName("strong")[1];
      // class_node.textContent = class_node.textContent.slice(1, -1);
      // avatar_node.appendChild(class_node);
    }
  }
  
  
  let counter = 1;
  for (var searchbar of document.querySelectorAll("#searchbars input[type='text']")) {
    searchbar.setAttribute("accesskey", counter++) 
  }  
  
})();