// ==UserScript==
// @id             izzysoft_SELP
// @name           StackExchange Link Personalizer
// @version        1.4
// @namespace      http://projects.izzysoft.de/
// @author         IzzySoft
// @description    Personalizes links to questions with your userID for sharing and collecting (Announcer/Booster/Publicist) badges
// @license        CC BY-NC-SA
// @include        http*://*.stackexchange.com/*
// @include        http*://askubuntu.com/*
// @include        http*://mathoverflow.net/*
// @include        http*://serverfault.com/*
// @include        http*://stackapps.com/*
// @include        http*://stackoverflow.com/*
// @include        http*://meta.stackoverflow.com/*
// @include        http*://superuser.com/*
// @grant          none
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/27697/StackExchange%20Link%20Personalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/27697/StackExchange%20Link%20Personalizer.meta.js
// ==/UserScript==
var skipClasses = ['flag-post-link','close-question-link','edit-post','comments-link '];

if ( document.getElementsByClassName('my-profile')[0].href.match(/\/users\/(\d+)\/.*/i) ) {
  var user_id = RegExp.$1;

  for(var i = 0; i < document.links.length; i++) {
    var elem = document.links[i];
    if ( skipClasses.indexOf(elem.className) != -1 ) continue;
    if ( elem.hostname != document.location.hostname ) continue;
    if ( elem.href.match(/\/questions\/(\d+)\/.*(\?.+#.+)/i) ) {
      null; // doesn't work with replaced URL here for some reason
    } else if ( elem.href.match(/\/questions\/(\d+)\/.*(#.+)/i) ) {
      elem.href='/q/'+RegExp.$1+'/'+user_id+RegExp.$2;
    } else if ( elem.href.match(/\/questions\/(\d+)\/.*/i) ) {
      elem.href='/q/'+RegExp.$1+'/'+user_id;
    }
  }
}
