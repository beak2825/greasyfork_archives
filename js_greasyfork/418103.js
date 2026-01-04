// ==UserScript==
// @name         Jut.su improved player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Dead4W
// @match        https://jut.su/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/418103/Jutsu%20improved%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/418103/Jutsu%20improved%20player.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let jQuery;
  let $;
  $ = jQuery = window.jQuery;

  let p;
  let episode_logged_start = 0;

  let regex_episode_info = /pview_id *= *"\d+"; *eval\( *Base64.decode\( *"([^"']+)"/;
  let regex_episode_last_time = /pview_id *= *"\d+"; *eval\( *Base64.decode\( *"([^"']+)"/;

  /**
   * @param {string} episode_info_base64
   */
  function update_episode_info(episode_info_base64) {
    $('body').append($("<script>eval(Base64.decode('" + episode_info_base64 + "'))</script>"));
  }

  /**
   * @param {jQuery} new_sources
   */
  function update_video_sources(new_sources) {
    let current_video_sources = $("#my-player_html5_api source");

    new_sources.each(function (i, new_video_source_item) {
      if (current_video_sources.length > i) $(current_video_sources[i]).attr("src", $(new_video_source_item).attr("src"));
    });
  }

  /**
   * @param {jQuery} new_title
   */
  function update_page_title(new_title) {
    $("title").text(new_title.text());
  }

  /**
   * @param {jQuery} new_player
   */
  function update_video_poster(new_player) {
    $("#my-player_html5_api").attr("poster", new_player.attr("poster"));
  }

  /**
   * @param {array} overlays
   */
  function update_overlay(overlays) {
    window.player.overlay({
      content: 'Default overlay content',
      debug: false,
      overlays: overlays
    });
  }

  /**
   * @param {string} loc
   * @param {boolean} historySave
   * @param {object} data
   * @param {string} title
   */
  function setLoc(locat, historySave = false, data = {}, title = " ") {
    console.log(locat);
    let curLoc = locat.replace(/#(\/|!)?/, '').replace(/^\//, '');
    let l = (location.toString().match(/#(.*)/) || {})[1] || '';
    if (!l) {
      l = (location.pathname || '') + (location.search || '');
    }
    l = encodeURIComponent(l);
    if (l.replace(/^(\/|!)/, '') != curLoc) {
      try {
        if (historySave !== false) {
          history.pushState(data, title, '/' + curLoc);
        }
        else {
          history.replaceState(data, title, '/' + curLoc);
        }
        return;
      }
      catch (e) {}
      window.chHashFlag = true;
      location.hash = '#/' + curLoc;
      if (withFrame && getLoc() != curLoc) {
        setFrameContent(curLoc);
      }
    }
  }

  /**
   * @param {jQuery} data
   * @param {string} episode_url
   * @param {boolean} saveHistory
   */
  function play_new_episode(data, episode_url, saveHistory = true) {
    let prev_episode_elem;
    let episode_info;
    let episode_last_time;
    let new_next_episode_elem;
    let new_prev_episode_elem;

    data.find("script").each((i, e) => {
      if ((episode_info = e.innerHTML.match(regex_episode_info))) {
        update_episode_info(episode_info[1]);
      }

      if ((episode_last_time = e.innerHTML.match(regex_episode_last_time))) {
        episode_logged_start = +episode_last_time[1];
      }
    })

    $('h1.header_video span').text(
      data.find('h1.header_video span').text()
    )

    update_video_sources(data.find("#my-player source"));

    update_video_poster(data.find("#my-player"));

    update_page_title(data.find("title"));

    new_next_episode_elem = data.find('.there_is_link_to_next_episode');

    if (new_next_episode_elem.length) {
      $('.there_is_link_to_next_episode').attr("href", new_next_episode_elem.attr('href'))
        .html(new_next_episode_elem.html());
    }
    else {
      $('.there_is_link_to_next_episode').remove();
    }

    new_prev_episode_elem = data.find('.vnleft');
    prev_episode_elem = $('.vnleft');

    if (prev_episode_elem.length) {
      prev_episode_elem.attr("href", new_prev_episode_elem.attr('href'))
        .html(new_prev_episode_elem.html());
    }

    update_overlay([]);
    reload_player();

    if (saveHistory) {
      setLoc(episode_url, true, {
        "url": episode_url,
        "pview_anime": window.pview_anime,
      }, data.find("title").text());
    }
  }

  function reload_player() {
    p.onload = () => {
      p.currentTime = episode_logged_start;
    }
    p.load();
    p.play();
  }

  /**
   * @param {string} episode_url
   * @param {boolean} saveHistory
   */
  function start_episode(episode_url, saveHistory = true) {
    $.get(episode_url, (data) => {
      play_new_episode($(data), episode_url, saveHistory);
    })
  }

  function end_episode() {
    let next_episode_url
    if ((next_episode_url = $('.there_is_link_to_next_episode').attr('href')) !== "") {
      start_episode(next_episode_url);
    }
  }

  function main() {
    if (!(p = $('#my-player')).length) return;

    window.onpopstate = function (event) {
      let data = event.state;
      window.testvar = data;
      if (data.url.match(/\/episode-\d+/) && window.pview_anime === data.pview_anime) {
        start_episode(data.url, false);
      }
      else if (data !== undefined && data !== null) {
        location.href = data.url;
      }
    };

    $(".videoBlock .achiv_switcher").append("<div class=\"achiv_switcher_in\" style=\"float: left;\">Skip<div class=\"mchat_wrap_out\" style=\"display: inline-block; top: -1.7em; right: 15px; \"><div class=\"mchat_wrap\">\n" +
      "<input type=\"checkbox\" id=\"skip_on\" onchange=\"skip_switch_change();\" checked=\"\">\n" +
      "<label class=\"mchat_slider-v2\" for=\"skip_on\" style=\"background: transparent; box-shadow: none; box-sizing: content-box; border-color: transparent; \"></label>\n" +
      "</div></div>\n" +
      "\n" +
      "\n" +
      "</div>");

    window.skip_switch_change = () => {
      let is_checked = $("#skip_on").is(':checked');
      window.Cookies.set("player[skip]", (window.is_skip = is_checked));
    }

    window.is_skip = window.Cookies.get("player[skip]");

    if (window.is_skip !== "true" && window.is_skip !== "false") {
      window.Cookies.set("player[skip]", (window.is_skip = "false"));
    }

    window.is_skip = (window.is_skip === "true");

    $("#skip_on").prop('checked', window.is_skip);

    $('.vnleft, .vnright').bind("click", (e) => {
      let el = $(e.currentTarget);

      start_episode(el.attr('href'));

      e.preventDefault();
      return false;
    });

    p = p[0];

    p.ontimeupdate = () => {
      if (!window.is_skip) return;
      if (p.currentTime > window.video_intro_start && p.currentTime < window.video_intro_end && p.currentTime > 5) p.currentTime = window.video_intro_end;
      if (p.currentTime > window.video_outro_start && p.currentTime > 5) end_episode();
    }

    p.onended = end_episode;

  }

  document.load = main();
})();
