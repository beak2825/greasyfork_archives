// ==UserScript==
// @name         Youtube covid info panel removed
// @namespace    http://www.youtube.com
// @version      1.01
// @description  Removes the covid information panel, below youtube videos MAY2021
// @author       thundermilksage@gmail.com
// @include      *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426648/Youtube%20covid%20info%20panel%20removed.user.js
// @updateURL https://update.greasyfork.org/scripts/426648/Youtube%20covid%20info%20panel%20removed.meta.js
// ==/UserScript==

    document.getElementById('clarify-box') .remove();