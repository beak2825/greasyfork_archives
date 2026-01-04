// ==UserScript==
// @author       Ajay Kumar (ajaybnl@gmail.com)
// @name         Connect Punjab Broadband News Ad Remover
// @namespace    https://mypi.space/
// @version      1.0
// @description  Remove Connect Punjab (or Any) Broadband News Ad Page
// @include      *.websiteforever.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/392493/Connect%20Punjab%20Broadband%20News%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/392493/Connect%20Punjab%20Broadband%20News%20Ad%20Remover.meta.js
// ==/UserScript==
var url = window.location.href;


if (url.search("cb.websiteforever.com") >= 0) {
    url = url.replace('https://cb.websiteforever.com/?req_url=','');
    url = url.replace('http://cb.websiteforever.com/?req_url=','');
    var m=url.indexOf("&usid=");
    url=url.slice(0, m);
    window.location = url;
}

//Connect ads links like:
//https://cb.websiteforever.com/?req_url=http://www.santabanta.com/&usid=a5c1e3a768ad43ad8837acf361567378&t=1573892597