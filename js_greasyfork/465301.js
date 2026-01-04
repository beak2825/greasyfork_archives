// ==UserScript==
// @name             [SNOLAB] Keep only one page per domain
// @namespace        https://userscript.snomiao.com/
// @version          0.1.0
// @description      Keep only one page per domain
// @author           snomiao@gmail.com
// @match            *://*
// @grant            none
// @contributionURL  https://snomiao.com/donate
// @supportURL       https://github.com/snomiao/userscript/issues
// @downloadURL https://update.greasyfork.org/scripts/465301/%5BSNOLAB%5D%20Keep%20only%20one%20page%20per%20domain.user.js
// @updateURL https://update.greasyfork.org/scripts/465301/%5BSNOLAB%5D%20Keep%20only%20one%20page%20per%20domain.meta.js
// ==/UserScript==

window === window.open(location.href + "#", location.hostname) ||
  window.open("", "_self").close();
