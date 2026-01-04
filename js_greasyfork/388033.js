// ==UserScript==
// @name Outlook mailto: Handler
// @namespace Violentmonkey Scripts
// @match https://outlook.live.com/mail/*
// @grant none
// @version 0.0.1.20190821021306
// @description Let's Outlook.com open mailto: links
// @downloadURL https://update.greasyfork.org/scripts/388033/Outlook%20mailto%3A%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/388033/Outlook%20mailto%3A%20Handler.meta.js
// ==/UserScript==

navigator.registerProtocolHandler("mailto",
                                 "https://outlook.live.com/mail/deeplink/compose?mailto=%s",
                                 "Outlook");

const isMailToHandler = () => {
  const params = new URLSearchParams(window.location.search);
  
  const mailto = params.get('mailto');
  if (!mailto)
     return false;
  
  const sansScheme = mailto.split(':')[1];
  const [to, queryString] = sansScheme.split('?');
  const queryParams = new URLSearchParams(queryString);
  queryParams.append('to', to);
  
  return queryParams.toString();
}

const mailToSearch = isMailToHandler();

if (mailToSearch) {
  window.location.search = mailToSearch;
}

