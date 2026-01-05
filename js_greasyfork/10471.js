// ==UserScript==
// @name        [deprecated] muahahaha youtube
// @namespace   muahahaha
// @include     https://www.youtube.com/watch?*
// @include     http://www.youtube-mp3.org*
// @version     2.1.1.1
// @grant       GM_addStyle
// @description use youtube-mp3.org, savefrom.net, bajaryoutube.com, keepvid.com, peggo.co, clipconverter.cc and youtube.com/embed from "more" menu in youtube.com
// @downloadURL https://update.greasyfork.org/scripts/10471/%5Bdeprecated%5D%20muahahaha%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/10471/%5Bdeprecated%5D%20muahahaha%20youtube.meta.js
// ==/UserScript==
if (location.host === 'www.youtube-mp3.org') {
  if (document.querySelector('.ff__addon_ad')) {
    document.querySelector('.ff__addon_ad').style.display = 'none';
  }
  document.querySelector('#content').setAttribute('x-addon', 'true');
}
else if (location.host === 'www.youtube.com') {
  var createButton = function ($text_value, $function_onclick, $url_icon_16) {
    var button = document.querySelector('#action-panel-overflow-menu').appendChild(document.createElement('li')).appendChild(document.createElement('button'));
    button.setAttribute('type', 'button');
    button.classList.add('yt-ui-menu-item');
    button.classList.add('has-icon');
    button.classList.add('yt-uix-menu-close-on-select');
    button.classList.add('action-panel-trigger');
    button.classList.add('action-panel-trigger-transcript');
    if ($url_icon_16) {
      var theclass = 'muahahaha_class_' + Math.round(Math.random() * 1000);
      button.classList.add(theclass);
      GM_addStyle('.' + theclass + '::before{background-image:url(' + $url_icon_16 + ');background-position:0 0;}');
    }
    button.onclick = $function_onclick;
    var span = button.appendChild(document.createElement('span'));
    span.classList.add('yt-ui-menu-item-label');
    button.appendChild(document.createTextNode($text_value));
    return button;
  };
  createButton('youtube-mp3.org [↗]', function () {
    open('http://www.youtube-mp3.org/redir?url=' + encodeURIComponent(location.href));
  }, 'http://www.youtube-mp3.org/favicon.ico'
  );
  createButton('savefrom.net [↗]', function () {
    open('http://savefrom.net/?url=' + encodeURIComponent(location.href));
  }, 'http://savefrom.net/favicon.ico'
  );
  createButton('bajaryoutube.com [↗]', function () {
    open(location.href.replace('https://','http://').replace('http://www.youtube.com/','http://www.bajaryoutube.com/'));
  }, 'http://www.bajaryoutube.com/favicon.ico'
  );
  createButton('keepvid.com [↗]', function () {
    open('http://keepvid.com/?url=' + encodeURIComponent(location.href));
  }, 'http://keepvid.com/favicon.ico'
  );
  createButton('peggo.co [↗]', function () {
    open('http://peggo.co/dvr/?vidurl=' + encodeURIComponent(location.href));
  }, 'http://peggo.co/static/img/favicon.ico'
  );
  createButton('clipconverter.cc [↗]', function () {
    open('http://www.clipconverter.cc/?ref=bookmarklet&url=' + encodeURIComponent(location.href));
  }, 'http://static.clipconverter.cc/images/favicon.ico'
  );
  createButton('yt/embed [↗]', function () {
    open(document.querySelector('meta[property="og:video:secure_url"]').content);
  }, 'https://youtube.com/favicon.ico'
  );
}