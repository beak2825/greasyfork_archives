// ==UserScript==
// @name         Review Notifications (beta)
// @namespace    sff-reviews
// @version      3.2.0-beta
// @description  Notify me when a review needs attention
// @author       amflare
// @match        https://scifi.stackexchange.com/review
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/40482/Review%20Notifications%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40482/Review%20Notifications%20%28beta%29.meta.js
// ==/UserScript==
(function () {
  'use strict';

  //=== INIT ===//
  console.info('Review Notifications: Active');

  Notification.requestPermission();

  const SEC = 1000;
  const MIN = 60;
  const TITLE = $('title').text();
  let config = Object.assign({rate:30}, GM_getValue("config", {
    allowNotification: {
      closevotes: true,
      firstposts: true,
      lateanswers: true,
      reopenvotes: true,
      suggestededits: true,
      lowqualityposts: true
    },
    ratelimit: {
      closevotes: 0,
      firstposts: 0,
      lateanswers: 0,
      reopenvotes: 0,
      suggestededits: 0,
      lowqualityposts: 0
    },
    clean: true
  }));
  tickRateLimit(true);

  let interval = setInterval(cron, config.rate * SEC);

  createSidebar();
  checkReviews();

  //=== ALIAS ===//
  function cron() {
    topBarAjax();
    // |--fullPageAjax
    //    |--createSidebar
    //    |--checkReviews
    //       |--tockRateLimit
    // |--tickRateLimit
    // |--updateSidebar
    // |--GM_setValue
  }

  //=== CHECK ===//
  function topBarAjax() {
    $.get("https://scifi.stackexchange.com/topbar/review", function(html,t,j) {
      if (j.status !== 200) {
        console.log(t);
        console.log(j);
        clearInterval(interval);
        return;
      }
      let atLeastOne = false;
      let clear = false;
      let quickDom = $('<quickDom>').append($.parseHTML(html));
      $('li.-item', quickDom).each(function(){
        atLeastOne = ($(this).hasClass('danger-urgent') || $(this).hasClass('danger-active') || atLeastOne);
      });
      if (atLeastOne) {
        fullPageAjax();
        config.clean = false;
      } else if (!config.clean) {
        fullPageAjax();
        clear = true;
      }
      tickRateLimit(clear);
      saveConfig();
    });
  }

  function fullPageAjax() {
    $.get("https://scifi.stackexchange.com/review", function(html) {
      let tempDom = $('<output>').append($.parseHTML(html));
      let newContent = $('div.container', tempDom).html();
      $('div.container').html(newContent);
      createSidebar();
      checkReviews();
    });
  }

  function checkReviews() {
    let count = 0;
    let queue = '';
    $('.dashboard-item').each(function(){
      let num = $('.dashboard-num', this).text();
      if (num >= 1) {
        queue = $('.dashboard-title a', this).text();
        let key = queue.toLowerCase().replace(/ /g,'');
        if (config.allowNotification[key]) {
          count++;
          tockRateLimit(key);
        }
      }
    });
    if (count === 1) {
      notifyMe(queue);
    } else if (count > 1) {
      notifyMe('Reviews Available');
    }
    if(count !== 0) {
      $('title').text('('+count+') '+TITLE);
    } else {
      $('title').text(TITLE);
    }
  }

  function tickRateLimit(clear) {
    for (let key in config.ratelimit) {
      if (config.ratelimit[key] === -1) {
        continue;
      } else if (config.ratelimit[key] === 1 || clear) {
        config.ratelimit[key] = 0;
        config.allowNotification[key] = true;
      } else if (config.ratelimit[key] > 1) {
        config.ratelimit[key] -= 1;
      }
    }
    if (clear) config.clean = true;
    saveConfig();
  }

  function tockRateLimit(key) {
    config.allowNotification[key] = false;
    config.ratelimit[key] = ((MIN/config.rate) + 1);
    saveConfig();
  }

  //=== SIDEBAR ===//
  function createSidebar() {
    let html = `<div class="module rn newuser">
                <h4>Review Notifications</h4>
                <strong>Refresh Rate</strong>
                <p>
                  <input type="number" class="rn-config" name="rn-rate" id="rn-rate" style="width:80px">
                  <label for="rn-rate">Seconds</label>
                  <br>
                  <span class="rn-alert" style="color:darkred;font-size:8px; display:none;cursor:pointer;" onclick="window.location.reload()">Change will take effect on reload</span>
                </p>
                <span class="rn-toggle-allow" style="cursor:pointer;"><strong>Notifications</strong></span>
                <p>
                  <input type="checkbox" class="rn-config" name="closevotes" id="closevotes" disabled="disabled">
                  <label for="closevotes">Close Votes</label>
                  <br>
                  <input type="checkbox" class="rn-config" name="firstposts" id="firstposts" disabled="disabled">
                  <label for="firstposts">First Post</label>
                  <br>
                  <input type="checkbox" class="rn-config" name="lateanswers" id="lateanswers" disabled="disabled">
                  <label for="lateanswers">Late Answers</label>
                  <br>
                  <input type="checkbox" class="rn-config" name="suggestededits" id="suggestededits" disabled="disabled">
                  <label for="reopenvotes">Low Quality Posts</label>
                  <br>
                  <input type="checkbox" class="rn-config" name="reopenvotes" id="reopenvotes" disabled="disabled">
                  <label for="suggestededits">Reopen Votes</label>
                  <br>
                  <input type="checkbox" class="rn-config" name="lowqualityposts" id="lowqualityposts" disabled="disabled">
                  <label for="lowqualityposts">Suggested Edits</label>
                  <br>
                </p>
              </div>`;

    $('#sidebar').append(html);
    updateSidebar();
  }

  function updateSidebar() {
    $('#rn-rate').val(config.rate);
    $.each(config.allowNotification, function(key, allow) {
      $('#'+key).attr('checked', allow);
      $('label[for='+key+']').attr('title', config.ratelimit[key]);
    });
  }

  //=== UTILITIES ===//
  function updateConfig(e) {
    let val = $(e.currentTarget).val();

    if ($.isNumeric(val)) {
      config.rate = Math.max(val, 10);
      $('.rn-alert').css('display', 'inline');
    } else {
      let id = $(e.currentTarget).attr('id');
      let checked = $(e.currentTarget).prop('checked');

      config.allowNotification[id] = checked;
      config.ratelimit[id] = checked ? 0 : -1;
    }

    saveConfig();
  }

  function saveConfig() {
    updateSidebar();
    GM_setValue("config", config);
  }

  function notifyMe(msg) {
    if (!Notification) {
      alert('Desktop notifications not available in your browser. Try Chromium.');
      return;
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    } else {
      let n = new Notification(msg, {
        icon: 'https://cdn.sstatic.net/Sites/scifi/img/favicon.ico',
        tag: 'sffreviews',
        renotify: true
      });

      n.onclick = function() {
        window.parent.parent.focus();
        this.close();
      };

      n.onerror = function () {
        clearInterval(interval);
        errorMsg('There has been a problem with Review Notifications. Please refresh the page to fix.');
      }
      n.onclose = function () {
        console.log('CLOSED');
      }

      setTimeout(n.close.bind(n), 5000);
    }
  }

  function errorMsg(msg) {
    $('.review-page').prepend('<div id="overlay-header" style="display: block; opacity: 1;">'+msg+'<br><a class="close-overlay">close this message</a></div>')
  }

  //=== EVENT LISTENERS ===//
  $('#sidebar')
    .on('change', '.rn-config', updateConfig)
    .on('dblclick', '.rn-toggle-allow', function() {
      $.each(config.allowNotification, function(key, value) {
        $('#'+key).attr('disabled', !$('#'+key).prop('disabled'));
      });
    });
  $('.review-page').on('click', '.close-overlay', function() {
    $('#overlay-header').remove();
  });
}());