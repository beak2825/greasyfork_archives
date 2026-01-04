// ==UserScript==
// @namespace https://kludge.guru/
// @name Redirect PostgreSQL.org docs to current version
// @description Very useful when coming from elsewhere and ending up with docs some random ancient version.
// @match https://www.postgresql.org/docs/*
// @version          1.0
// @downloadURL https://update.greasyfork.org/scripts/420522/Redirect%20PostgreSQLorg%20docs%20to%20current%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/420522/Redirect%20PostgreSQLorg%20docs%20to%20current%20version.meta.js
// ==/UserScript==

function maybeRedirect() {

  if (!document.referrer || document.referrer.indexOf('https://www.postgresql.org') === 0) { return; }

  const { pathname } = document.location;
  const match = pathname.match(/^\/docs\/[0-9\.]+\/(.*)$/);
  if (!match) { return; }

  const url = `/docs/current/${match[1]}`;
  const a = document.querySelector(`a[href="${url}"]`);
  if (!a) { return; }

  location.replace(url);

}

maybeRedirect();
