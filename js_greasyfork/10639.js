// ==UserScript==
// @name        Reddit Show User Age
// @namespace   dub4u
// @description Shows account age next to usernames in subreddits that you moderate
// @include     http://www.reddit.com/r/*
// @include     https://www.reddit.com/r/*
// @require     //code.jquery.com/jquery-2.2.4.min.js
// @require     //cdnjs.cloudflare.com/ajax/libs/protonet-jquery.inview/1.1.2/jquery.inview.min.js
// @require     //cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js
// @grant       unsafeWindow
// @version     1.4
// @downloadURL https://update.greasyfork.org/scripts/10639/Reddit%20Show%20User%20Age.user.js
// @updateURL https://update.greasyfork.org/scripts/10639/Reddit%20Show%20User%20Age.meta.js
// ==/UserScript==
// @require     //raw.githubusercontent.com/protonet/jquery.inview/5a4dc9f2537016a9dcf0acc4a2c469500021586c/jquery.inview.min.js

var seen = new Object(),
    queue = new Array(),
    store = unsafeWindow.localStorage,
    cache = store.getItem('user_age_cache'),
    cache_is_dirty = false,
    offset = (new Date).getTimezoneOffset()*60,
    WAIT = 2100; // ms

if (cache) {
  cache = JSON.parse(cache);
} else {
  cache = {};
}

$.get('/subreddits/mine/moderator.json', function(data) {

  if (!data.data) {
    return;
  }

  var url = window.location.pathname.split('/', 3).join('/') + '/';

  var moderated = $.map(data.data.children, function(e, i) {
    return e.data.url;
  });

  moderated.push('/r/mod/');

  $.each(moderated, function(i, e) {
    if (e == url) {
      loadKarma();
      return false;
    }
  });
});

function loadKarma() {
  $('.sitetable .tagline .author').bind('inview', function(e, isInView) {
    if (isInView && !seen[this]) {
      var user = this.toString().match(/\/([^\/]+)$/)[1];
      seen[this] = 1;
      queue.push(user);
    }
  });

  setTimeout(processQueue, 1000);
}

function processQueue() {
  if (cache_is_dirty) {
    store.setItem('user_age_cache', JSON.stringify(cache));
    cache_is_dirty = false;
  }

  var i = 0,
      url;

  while (user = queue.shift()) {
    if (cache[user]) {
      showUserAge(cache[user]);
    } else {
      getAboutJson(user, i*WAIT);
      i++;
    }
  }

  i++;

  setTimeout(processQueue, i*WAIT);
}

function getAboutJson(user, delay) {
  setTimeout(function() {
    $.get('/user/' + user + '/about.json', function(response) {
      if (!response.data) {
        return;
      }
      cache[user] = {
        i: response.data.id,
        c: response.data.created
      };
      cache_is_dirty = true;
      showUserAge(cache[user]);
    });
  }, delay);
}

function showUserAge(user) {
  var created = moment((user.c+offset)*1000),
      text = 'redditor for ' + created.fromNow(true);

  if (created.isAfter(moment().subtract(30, 'days'))) {
    $('.sitetable .author.id-t2_' + user.i).closest('.entry')
          .css('background', '#dfc');
  }


  $('.sitetable .tagline .author.id-t2_' + user.i + ' ~ .userattrs')
    .after(' (<span class="userkarma">' + text + '</span>)');
}
