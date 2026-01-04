// ==UserScript==
// @name         TransformativeWorks AO3 Redirect
// @description  Redirect archive.transformativeworks.org to archiveofourown.org
// @author       C89sd
// @version      0.1
// @match        https://archive.transformativeworks.org/*
// @match        https://archiveofourown.gay/*
// @namespace    https://greasyfork.org/users/1376767
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/545305/TransformativeWorks%20AO3%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/545305/TransformativeWorks%20AO3%20Redirect.meta.js
// ==/UserScript==

location.replace(
  location.href
    .replace("archive.transformativeworks.org", "archiveofourown.org")
    .replace("archiveofourown.gay", "archiveofourown.org")
);