// ==UserScript==
// @name         Reddit old design redirector 
// @description  Reroutes old.reddit... to www.reddit...
// @match        https://old.reddit.com/*
// @version      0.2
// @author       mica
// @namespace    greasyfork.org/users/12559
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/396495/Reddit%20old%20design%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/396495/Reddit%20old%20design%20redirector.meta.js
// ==/UserScript==
 
location.replace(location.href.replace('/old.','/www.'));
