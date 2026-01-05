// ==UserScript==
// @name           RED Forum Time Cards
// @namespace      RED
// @description    Shows time cards ("Two months later...") in the forums
// @version        1.0.1
// @include        http*://*redacted.cd/forums.php*action=viewthread*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/25377/RED%20Forum%20Time%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/25377/RED%20Forum%20Time%20Cards.meta.js
// ==/UserScript==


var pref = {
// _________________________________________________________
// ____________________ Preferences ________________________

//    Minimum number of days between posts
          minDays: 14,

//    Write numerals in word form
          numsAsWords: true,

//    Activate SpongeBob mode
          spongeBob: false
// _________________________________________________________
// _________________ End of Preferences ____________________
};


var stor = {
  get: function (key, def) {
    var val = window.localStorage && localStorage.getItem(key);
    return typeof val == 'string' ? JSON.parse(val) : def;
  },
  set: function (key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
};


function addStyle(s) {
  var newStyle = document.createElement('style');
  newStyle.textContent = s;
  newStyle.type = 'text/css';
  (document.head || document.getElementsByTagName('head')[0]).appendChild(newStyle);
}


function postTime(post) {
  var elem = post.getElementsByClassName('time')[0];
  var time = elem.title || window.$ && $(elem).data('tooltipsterContent');
  return Date.parse(time) / 1000 || 0;
}


function timecard(t1, t2) {
  function sayNum(num) {
    var words = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
                 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
    return pref.numsAsWords && words[num] || num;
  }

  var units = [{ name: 'minute', fl: 1 },
               { name: 'hour',   fl: 1 },
               { name: 'day',    fl: 0.979 },
               { name: 'week',   fl: 0.9285 },
               { name: 'month',  fl: 1 },
               { name: 'year',   fl: 0.958 }];

  for (var i = units.length; i--; ) {
    var num = (t1 - t2) / len[units[i].name];
    // rounding 6.5 days to 1 week rather than 7 days
    if (num >= units[i].fl) {
      num = Math.round(num);
      return [sayNum(num), ' ', units[i].name, num != 1 ? 's' : '', ' later...'].join('');
    }
  }
  return 'Meanwhile...';
}


addStyle([
  '.ftc_outer { margin: 15px 0 10px !important; text-align: center; }',
  '.ftc_timecard { margin: 0 !important; padding: 8px 16px !important;',
                  'font-weight: bold; display: inline-block; }',
  '.ftc_char { position: relative; }',
  '.ftc_char:nth-child(11n+2) { top: 1px; }',
  '.ftc_char:nth-child(11n+7), .ftc_char:nth-child(11n+8) { top: -1px; }',
  '.forum_post.ftc_above { margin-bottom: 0 !important; }',
  '.ftc_outer + .forum_post { margin-top: 0 !important; }'
].join(''));

var len = { minute: 60, hour: 3600, day: 86400,
            week: 604800, month: 2629746, year: 31556952 };

var param = {
  threadId: +(/[?&]threadid=(\d+)/.exec(window.location.search) || '00')[1],
  page: +(/[?&]page=(\d+)/.exec(window.location.search) || '01')[1]
};

var posts = document.querySelectorAll('.forum_post:not(.sticky_post):not(.preview_wrap)');
var i = 0, il = posts.length;

var lastRead = stor.get('ftc_lastRead', {});
var timeThis, timePrev =
    param.threadId === lastRead.threadId && param.page - lastRead.page === 1 ?
      lastRead.time :
      postTime(posts[i++]);

for (; i < il; i++) {
  timeThis = postTime(posts[i]);

  if (timeThis - timePrev >= pref.minDays * len.day) {
    if (i) {
      posts[i-1].classList.add('ftc_above');
    } else if (posts[0].previousElementSibling.classList.contains('sticky_post')) {
      posts[0].previousElementSibling.classList.add('hidden');
    }

    var newDiv = document.createElement('div');
    newDiv.className = 'ftc_timecard box box2';
    newDiv.textContent = timecard(timeThis, timePrev);
    if (pref.spongeBob) {
      newDiv.innerHTML = newDiv.textContent.toUpperCase().
          replace(/\w/g, '<span class="ftc_char">$&</span>');
    }
    var outerDiv = document.createElement('div');
    outerDiv.className = 'ftc_outer';
    outerDiv.appendChild(newDiv);
    posts[i].parentNode.insertBefore(outerDiv, posts[i]);
  }

  timePrev = timeThis;
}

stor.set('ftc_lastRead', { threadId: param.threadId, page: param.page, time: timePrev });