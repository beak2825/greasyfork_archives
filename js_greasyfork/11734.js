// ==UserScript==
// @name           Youtube: Show related videos if missing
// @name:de        Youtube: Zeige Videovorschläge an, falls sie fehlen
// @namespace      tfr
// @description    On pages of age-restricted videos, related videos are missing. This script re-adds the related videos.
// @description:de Auf Seiten altersbeschränkter Videos fehlen die Videovorschläge. Dieses Skript fügt sie wieder hinzu.
// @author         tfr (https://github.com/t-fr/)
// @license        CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @license        MIT license; https://pastebin.com/raw.php?i=4TMeeUXC
// @compatible     firefox Works with Firefox and Greasemonkey
// @incompatible   chrome Does not work with Chrome and Tampermonkey
// @compatible     opera Works with Opera and Violent monkey, but not with Tampermonkey Beta
// @oujs:author    tfr
// @include        http://www.youtube.com/watch?*
// @include        https://www.youtube.com/watch?*
// @version        4
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11734/Youtube%3A%20Show%20related%20videos%20if%20missing.user.js
// @updateURL https://update.greasyfork.org/scripts/11734/Youtube%3A%20Show%20related%20videos%20if%20missing.meta.js
// ==/UserScript==

/* This script is dual-licensed under CC0 and the MIT license.
 * You can choose which one you want to use.
 * CC0 license: http://creativecommons.org/publicdomain/zero/1.0/deed.en
 * MIT license: https://pastebin.com/raw.php?i=4TMeeUXC
 *
 * Dieses Skript steht sowohl unter CC0 als auch unter der MIT-Lizenz.
 * Sie können sich aussuchen, welche Lizenz Sie nutzen.
 * CC0-Lizenz: http://creativecommons.org/publicdomain/zero/1.0/deed.de
 * MIT-Lizenz: https://pastebin.com/raw.php?i=4TMeeUXC
 */

/* Version 4: Do not write "by ..." in video title
 * Version 3: Update license information
 */

if (window.document.getElementById('watch7-sidebar-modules') && !window.document.getElementById('watch-related'))
{
  var videoid = window.location.search.substr(window.location.search.indexOf('v=') + 2);
  if (videoid.indexOf('&') > - 1)
  {
    videoid = videoid.substr(0, videoid.indexOf('&'));
  }
  videoid = decodeURIComponent(videoid);
  GM_xmlhttpRequest({
    method: 'GET',
    url: '//www.youtube.com/get_video_info?asv=3&video_id=' + videoid,
    onload: function (response)
    {
      if (response.status == 200)
      {
        var relatedList = response.responseText.substr(response.responseText.indexOf('rvs=') + 4);
        if (relatedList.indexOf('&') > - 1)
        {
          relatedList = relatedList.substr(0, relatedList.indexOf('&'));
        }
        relatedList = decodeURIComponent(relatedList);
        relatedListS = relatedList.split(',');
        var sidebarModules = window.document.getElementById('watch7-sidebar-modules');
        var sidebarSection = window.document.createElement('div');
        sidebarSection.setAttribute('class', 'watch-sidebar-section');
        sidebarModules.appendChild(sidebarSection);
        var sidebarBody = window.document.createElement('div');
        sidebarBody.setAttribute('class', 'watch-sidebar-body');
        sidebarSection.appendChild(sidebarBody);
        var relatedVideoList = window.document.createElement('ul');
        relatedVideoList.setAttribute('id', 'watch-related');
        relatedVideoList.setAttribute('class', 'video-list');
        sidebarBody.appendChild(relatedVideoList);
        for (var i = 0; i < relatedListS.length; i++)
        {
          if (relatedListS[i].indexOf('id=') > - 1 && relatedListS[i].indexOf('title=') > - 1 && relatedListS[i].indexOf('author=') > - 1 && relatedListS[i].indexOf('length_seconds=') > - 1)
          {
            var relatedId = relatedListS[i].substr(relatedListS[i].indexOf('id=') + 3);
            if (relatedId.indexOf('&') > - 1)
            {
              relatedId = relatedId.substr(0, relatedId.indexOf('&'));
            }
            relatedId = relatedId.replace(/\+/g, ' ');
            relatedId = decodeURIComponent(relatedId);
            var relatedTitle = relatedListS[i].substr(relatedListS[i].indexOf('title=') + 6);
            if (relatedTitle.indexOf('&') > - 1)
            {
              relatedTitle = relatedTitle.substr(0, relatedTitle.indexOf('&'));
            }
            relatedTitle = relatedTitle.replace(/\+/g, ' ');
            relatedTitle = decodeURIComponent(relatedTitle);
            var relatedAuthor = relatedListS[i].substr(relatedListS[i].indexOf('author=') + 7);
            if (relatedAuthor.indexOf('&') > - 1)
            {
              relatedAuthor = relatedAuthor.substr(0, relatedAuthor.indexOf('&'));
            }
            relatedAuthor = relatedAuthor.replace(/\+/g, ' ');
            relatedAuthor = decodeURIComponent(relatedAuthor);
            var relatedLength = relatedListS[i].substr(relatedListS[i].indexOf('length_seconds=') + 15);
            if (relatedLength.indexOf('&') > - 1)
            {
              relatedLength = relatedLength.substr(0, relatedLength.indexOf('&'));
            }
            relatedLength = relatedLength.replace(/\+/g, ' ');
            relatedLength = decodeURIComponent(relatedLength);
            var relatedLengthRest = parseInt(relatedLength);
            var relatedLengthStr = ':' + ((relatedLengthRest % 60) < 10 ? '0' : '') + (relatedLengthRest % 60).toString();
            relatedLengthRest = Math.floor(relatedLengthRest / 60);
            relatedLengthStr = (relatedLengthRest >= 60 && (relatedLengthRest % 60) < 10 ? '0' : '') + (relatedLengthRest % 60).toString() + relatedLengthStr;
            relatedLengthRest = Math.floor(relatedLengthRest / 60);
            relatedLengthStr = (relatedLengthRest > 0 ? relatedLengthRest.toString() + ':' + relatedLengthStr : relatedLengthStr);
            var listElem = window.document.createElement('li');
            listElem.setAttribute('class', 'video-list-item related-list-item show-video-time related-list-item-compact-video');
            relatedVideoList.appendChild(listElem);
            var listElemCont = window.document.createElement('div');
            listElemCont.setAttribute('class', 'content-wrapper');
            listElem.appendChild(listElemCont);
            var listElemContLink = window.document.createElement('a');
            listElemContLink.setAttribute('class', 'yt-uix-sessionlink content-link');
            listElemContLink.setAttribute('title', relatedTitle);
            listElemContLink.setAttribute('href', 'https://www.youtube.com/watch?v=' + relatedId);
            listElemCont.appendChild(listElemContLink);
            var listElemContLinkSpan1 = window.document.createElement('span');
            listElemContLinkSpan1.setAttribute('class', 'title');
            listElemContLinkSpan1.setAttribute('aria-describedby', 'description-id-' + i);
            listElemContLinkSpan1.appendChild(window.document.createTextNode(relatedTitle));
            listElemContLink.appendChild(listElemContLinkSpan1);
            var listElemContLinkSpan2 = window.document.createElement('span');
            listElemContLinkSpan2.setAttribute('id', 'description-id-' + i);
            listElemContLinkSpan2.setAttribute('class', 'accessible-description');
            listElemContLinkSpan2.appendChild(window.document.createTextNode((navigator.language.toLowerCase().substr(0, 2) == 'de' ? '- Dauer: ' : '- Duration: ') + relatedLengthStr));
            listElemContLink.appendChild(listElemContLinkSpan2);
            var listElemContLinkSpan3 = window.document.createElement('span');
            listElemContLinkSpan3.setAttribute('class', 'stat attribution');
            listElemContLinkSpan3.appendChild(window.document.createTextNode((navigator.language.toLowerCase().substr(0, 2) == 'de' ? 'von ' : 'by ') + relatedAuthor));
            listElemContLink.appendChild(listElemContLinkSpan3);
            var listElemThum = window.document.createElement('div');
            listElemThum.setAttribute('class', 'thumb-wrapper');
            listElem.appendChild(listElemThum);
            var listElemThumLink = window.document.createElement('a');
            listElemThumLink.setAttribute('class', 'yt-uix-sessionlink thumb-link');
            listElemThumLink.setAttribute('aria-hidden', 'true');
            listElemThumLink.setAttribute('tabindex', '-1');
            listElemThumLink.setAttribute('href', 'https://www.youtube.com/watch?v=' + relatedId);
            listElemThum.appendChild(listElemThumLink);
            var listElemThumLinkSpan = window.document.createElement('span');
            listElemThumLinkSpan.setAttribute('class', 'yt-uix-simple-thumb-wrap yt-uix-simple-thumb-related');
            listElemThumLinkSpan.setAttribute('data-vid', relatedId);
            listElemThumLinkSpan.setAttribute('tabindex', '0');
            listElemThumLink.appendChild(listElemThumLinkSpan);
            var listElemThumImg = window.document.createElement('img');
            listElemThumImg.setAttribute('width', '120');
            listElemThumImg.setAttribute('height', '90');
            listElemThumImg.setAttribute('aria-hidden', 'true');
            listElemThumImg.setAttribute('alt', '');
            listElemThumImg.setAttribute('src', '//i.ytimg.com/vi/' + relatedId + '/default.jpg');
            listElemThumLinkSpan.appendChild(listElemThumImg);
          }
        }
      }
    }
  });
}