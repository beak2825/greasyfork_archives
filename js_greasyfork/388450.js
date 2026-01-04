// ==UserScript==
// @name          MetaFilter embiggen small hyperlinks
// @description	  Makes small hyperlinks in comments on MetaFilter.com and all subsites larger. Helpful on mobile devices.
// @author        Tehhund
// @match         *://*.metafilter.com/*
// @version       15
// @namespace https://greasyfork.org/users/324881
// @downloadURL https://update.greasyfork.org/scripts/388470/MetaFilter%20embiggen%20small%20hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/388470/MetaFilter%20embiggen%20small%20hyperlinks.meta.js
// ==/UserScript==

(function() {document.head.innerHTML += ('<style> .smallcopy > a:link, .smallcopy > span > span > a:link { font-size: 130% ; } </style>');} )();
