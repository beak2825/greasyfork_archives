// ==UserScript==
// @name           Googler
// @name:ko        구글러

// @description    Change the search results of Daum, Bing and Yahoo to Google search results.
// @description:ko 다음, 빙, 야후 검색결과를 구글 검색결과로 바꿉니다.

// @namespace      https://ndaesik.tistory.com/
// @version        2022.06.15.22.23
// @author         ndaesik
// @icon           https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com
// @match          *.bing.com/search?*
// @match          *search.daum.net/search?*
// @match          *search.yahoo.com/search?*

// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/437239/Googler.user.js
// @updateURL https://update.greasyfork.org/scripts/437239/Googler.meta.js
// ==/UserScript==

location.replace( 'https://www.google.com/search?q=' + document.URL.split(/[?|&]q=|p=/)[1].split('&')[0] )