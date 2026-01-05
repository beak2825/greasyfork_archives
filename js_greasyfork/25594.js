// ==UserScript==
// @name           Bad Covers Everywhere!
// @author         newstarshipsmell
// @namespace      https://greasyfork.org/en/scripts/25594-bad-covers-everywhere
// @description    Lets you know if a cover isn't on a good host.
// @require        https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @include        /https?:\/\/redacted\.ch\/(artist|bookmarks|collages?|top10|torrents|userhistory)\.php.*/
// @include        /https?:\/\/apollo\.rip\/(artist|bookmarks|collages?|top10|torrents|userhistory)\.php.*/
// @include        /https?:\/\/notwhat\.cd\/(artist|bookmarks|collages?|top10|torrents|userhistory)\.php.*/
// @version        2.1.4
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/25594/Bad%20Covers%20Everywhere%21.user.js
// @updateURL https://update.greasyfork.org/scripts/25594/Bad%20Covers%20Everywhere%21.meta.js
// ==/UserScript==

//By death2y
//Contributions by mcnellis, OhmG, parsec and HeroKid
//Sonicloop - added main artist, collage (thanks  Wingman4l7), snatched, seeding and fixed some unhandled exceptions
//newstarshipsmell: Added Bookmarks, Leeching, Notifications, Collage Subscriptions and Top 10; fixed Browse Torrents and Collages; cleaned up / condensed code;
//  script now runs on content reload (paginated Collages/Bookmarks pages, Torrents / Sn/Up/Se/Le / Notifications w/ Infinite Scroll)
// Updated to run on WCD successors. 1/1/17 updated to add GM_config settings menu.

// _____________________________________________________________________________

var mainFields = {
  'good_hosts': {
    'label': 'Good Hosts:', 'type': 'textarea', 'rows': 8, 'cols': 24, 'default': 'apollo.rip\nnotwhat.cd\nredacted.ch\nptpimg.me\nimgur.com',
    'title': 'If you want more hosts to be "good", add them to this list'
  },
  'large_border_size': {
    'label': 'Large border size:', 'type': 'unsigned int', 'size' : 1, 'min': 0, 'max': 100, 'default': 50, 'title': 'Pixel-width of border around larger images on Artist / Torrent Group pages'
  },
  'small_border_size': {
    'label': 'Small border size:', 'type': 'unsigned int', 'size' : 1, 'min': 0, 'max': 100, 'default': 30, 'title': 'Pixel-width of border around smaller images in lists'
  },
  'bad_color': {
    'label': 'Bad host border color:', 'type': 'text', 'size': 8, 'default': 'red', 'title': 'Color of border for images hosted on "bad" hosts\nCan be a name, e.g. red, yellow, etc. or a hex, e.g. #ff0000, #ffff00, etc.'
  },
  'thumb_color': {
    'label': 'Thumbnail border color:', 'type': 'text', 'size': 8, 'default': 'yellow', 'title': 'Color of border for thumbnails\nCan be a name, e.g. red, yellow, etc. or a hex, e.g. #ff0000, #ffff00, etc.'
  },
  'script_wait': {
    'label': 'Script wait time:', 'type': 'unsigned int', 'size' : 1, 'min': 0, 'max': 10000, 'default': 222, 'title': 'Milliseconds for the script to wait for page contents to finish loading before re-executing'
  }
};

GM_config.init({
  'id': 'MainMenu', 'title': 'Bad Covers Everywhere! settings', 'fields': mainFields,
  'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
  'events':
  {
    'save': function() { location.reload(); }
  }
});

GM_registerMenuCommand('Bad Covers Everywhere! settings', function() {GM_config.open();});

var hosts = GM_config.get('good_hosts').split('\n');
var largeBorderSize = GM_config.get('large_border_size');
var smallBorderSize = GM_config.get('small_border_size');
var badColor = GM_config.get('bad_color');
var thumbColor = GM_config.get('thumb_color');
var scriptWait = GM_config.get('script_wait');

var pages = [
  {'type': 'Torrent Group', 'pattern': /torrents\.php(\?|\?page=\d+&)id=\d+/},
  {'type': 'Artist', 'pattern': /artist\.php(?!\?action=(edit|history))/, 'selector': 'div.group_image'},
  {'type': 'Torrents / Up/Se/Le/Sn / Notifs. / Collage Subs. / Top 10', 'pattern': /(torrents\.php($|\?|\?page=\d+&)((type=(uploaded|seeding|leeching|snatched))|action=notify|(?!id=))|userhistory\.php\?action=subscribed_collages|top10\.php($|\?type=(torrents|votes)))/, 'selector': 'div.group_image'},
  {'type': 'Bookmarks / Collages', 'pattern': /(bookmarks\.php\?type=torrents|collages?\.php\?id=\d+)/, 'selector': '[class^="image_group_"]'}
];

var type = -1;
for (var i = 0; i < pages.length; i++) {
  if (pages[i].pattern.test(window.location.href)) {
    type = i;
    i = pages.length;
  }
}
function embaddenSomeCovers() {
  if (!bGbl_ChangeEventListenerInstalled)
  {
    bGbl_ChangeEventListenerInstalled = true;
    document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
  }

  if (type < 2) {
    var mainImgElem = document.querySelector('div.box_image img');
    if (mainImgElem) {
      if (!goodHosts.test(mainImgElem.src.split('://')[1].split('/')[0])) {
        mainImgElem.style.boxSizing = "border-box";
        mainImgElem.style.border = largeBorder;
      } else if (/_thumb\./.test(mainImgElem.onclick)) {
        mainImgElem.style.boxSizing = "border-box";
        mainImgElem.style.border = largeThumbBorder;
      }
    }
  }

  if (type > 0) {
    var listImgNodeList = document.getElementById('content').querySelectorAll(pages[type].selector);
    var listImgElem;
    for (i = 0; i < listImgNodeList.length; i++) {
      listImgElem = listImgNodeList[i].getElementsByTagName('img')[0];
      if (listImgElem) {
        if (!goodHosts.test(listImgElem.src.split('://')[1].split('/')[0])) {
          listImgElem.style.boxSizing = "border-box";
          listImgElem.style.border = smallBorder;
        } else if (/_thumb\./.test(listImgElem.onclick)) {
          listImgElem.style.boxSizing = "border-box";
          listImgElem.style.border = smallThumbBorder;
        }
      }
    }
  }
}


function HandleDOM_ChangeWithDelay(zEvent) {
  if (typeof zGbl_DOM_ChangeTimer == "number")
  {
    clearTimeout (zGbl_DOM_ChangeTimer);
    zGbl_DOM_ChangeTimer = '';
  }
  zGbl_DOM_ChangeTimer = setTimeout (function() { embaddenSomeCovers(); }, scriptWait);
}

if (type > -1) {
  goodHosts = new RegExp('(\0|' + hosts.join('|').replace(/(^|\|)https?:\/\//g, '$1').replace(/(^|\|)www\./g, '$1').replace(/\/.*?(\||$)/g, '$1').replace(/\./g, '\\.') + ')');
  largeBorder = "." + largeBorderSize + "em outset " + badColor;
  smallBorder = "." + smallBorderSize + "em outset " + badColor;
  largeThumbBorder = "." + largeBorderSize + "em outset " + thumbColor;
  smallThumbBorder = "." + smallBorderSize + "em outset " + thumbColor;

  var zGbl_DOM_ChangeTimer = '';
  var bGbl_ChangeEventListenerInstalled = false;

  window.addEventListener ("load", embaddenSomeCovers, false);
}