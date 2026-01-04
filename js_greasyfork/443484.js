// ==UserScript==
// @name  Random episode chooser
// @description Highlight a random episode in homepage
// @match       https://www.tvtime.com/*
// @version     1.2.2
// @run-at      document-end
// @grant       none
// @license     MIT
// @author      Morryx
// @namespace https://greasyfork.org/users/807892
// @downloadURL https://update.greasyfork.org/scripts/443484/Random%20episode%20chooser.user.js
// @updateURL https://update.greasyfork.org/scripts/443484/Random%20episode%20chooser.meta.js
// ==/UserScript==

// Direct link (find a way to save it easily, some share place)

random = function (max = 1, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
is_numeric = function (c) {
  return /^\d+$/.test(c);
};
toint_string = function (str) {
  var new_str = '';
  if (str == '' || str == null) return 0;
  for (i = 0; i < str.length; i++) {
    var char = str.charAt(i);
    if (is_numeric(char)) new_str += char;
  }
  return +new_str;
};
addCss = function (code, append) {
  if (code !== '') add_css += '' + code;

  if (typeof append != 'undefined' && append) appendCss();
};
appendCss = function () {
  $('#customStyle').remove();
  if (add_css !== '')
    $body.append($('<style id="customStyle">' + add_css + '</style>'));
};

// Settings
var storage_key = 'RandomEpisode_Settings',
  default_settings = {
    filter: [],
  };
save_settings = function (settings) {
  window.localStorage.setItem(storage_key, JSON.stringify(settings));
};
clear_settings = function () {
  window.localStorage.removeItem(storage_key);
};
get_settings = function () {
  var settings = window.localStorage.getItem(storage_key),
    default_settings_length = Object.keys(default_settings).length,
    last_added_settings = Object.keys(default_settings)[default_settings_length - 1],
    key = false;

  if (settings === null) settings = {};
  else settings = JSON.parse(settings);

  if (!settings.hasOwnProperty(last_added_settings) || default_settings_length != Object.keys(settings).length) {
    for (key in default_settings) {
      if (!settings.hasOwnProperty(key)) settings[key] = default_settings[key];
    }
  }

  for (key in settings) {
    if (!default_settings.hasOwnProperty(key)) delete settings[key];
  }

  save_settings(settings);
  return settings;
};
change_settings = function (key, value) {
  settings[key] = value;
  save_settings(settings);
};

var settings = get_settings(),
  add_css = '',
  $body = false;
$(function () {
  $body = $('body[id]');
  if ($body.hasClass('home')) {
    var img_selector = '.image-crop img',
      $episodes = $('.to-watch-list').first().find('li[id]'),
      previous_show = '',
      tries = 0,
      get_id_show = function ($episode) {
        var id_show = '',
          url = $episode.find('.nb-reviews-link.secondary-link').attr('href'),
          regex = /\/[0-9]+/g,
          founds = url.match(regex);

        if (founds !== null && founds.length)
          id_show = toint_string(founds[0]);

        return id_show;
      },
      choose = function () {
        var random_episode = random($episodes.length - 1),
          $episode = $episodes.eq(random_episode),
          id_show = get_id_show($episode);

        if (settings.filter.includes(id_show) ||
          previous_show == id_show) {
          tries++;
          if (tries < 50)
            choose();
          return;
        }

        previous_show = id_show;
        $episodes
          .removeClass('ep_choosed')
          .find(img_selector).css('opacity', '0.75');
        $episode
          .addClass('ep_choosed')
          .find('.to-watch-icon').click(function () {
            $t = $(this);
            setInterval(function () {
              if ($t.parent().hasClass('watched'))
                location.reload();
            }, 2500);
          });
      },
      add_filter = function ($episode) {
        var id_show = get_id_show($episode),
          txt = 'Add to filter',
          filter_class = 'green',
          click = function () {
            settings.filter.push(id_show);
            change_settings('filter', settings.filter);
            add_filter($episode);
          };

        if (settings.filter.includes(id_show)) {
          txt = 'Remove to filter';
          filter_class = 'orange';
          click = function () {
            var index = settings.filter.indexOf(id_show);
            if (index > -1)
              settings.filter.splice(index, 1);
            change_settings('filter', settings.filter);
            add_filter($episode);
          };
        }

        var $nav = $episode.find('.nav'),
          $filter = $('<a class="filter ' + filter_class + '">' + txt + '</a>');
        $nav.find('.filter').remove();
        $filter.click(click);
        $nav.append($filter);
      };

    $('#home').dblclick(function () {
      tries = 0;
      $episodes = $('.to-watch-list').first().find('li[id]');
      choose();
    });
    choose();

    $episodes.each(function () {
      add_filter($(this));
    });

    addCss(
      '.nav .filter{' +
      '  float: left;' +
      '  cursor: pointer;' +
      '}' +
      '.nav .filter.orange{color:orange}' +
      '.nav .filter.green{color:green;font-weight:bold}' +
      '.ep_choosed{' +
      '  transform: translateY(-20px) scale(1.2);' +
      '  background-color: #ffd700;' +
      '  border-radius: 10px;' +
      '  box-shadow: 0 0 10px -5px black;' +
      '}' +
      '.ep_choosed ' + img_selector + '{opacity:1!important}'
    );
  }

  appendCss();
});