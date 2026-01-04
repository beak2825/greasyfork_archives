// ==UserScript==
// @name           Ultrawide Wikipedia Pleasurizer
// @description    Constrains Wikipedia content on widescreen and superwide monitors (e.g. 32:9 5120x1440) to make it more enjoyable to read.
// @author         Sgt. Nukem
// @include        https://*.wikipedia.org
// @version        0.666
// @namespace https://greasyfork.org/users/324223
// @downloadURL https://update.greasyfork.org/scripts/394072/Ultrawide%20Wikipedia%20Pleasurizer.user.js
// @updateURL https://update.greasyfork.org/scripts/394072/Ultrawide%20Wikipedia%20Pleasurizer.meta.js
// ==/UserScript==

function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}


/*   (100% - 120rem) / 2   */

const ultrawideCSS = `
/* @media screen and (min-width: 4000px) */
#content { /* .mw-body { */
    padding-left:  calc((100% - 120rem) / 2);  /* 100em; */
    padding-right: calc((100% - 120rem) / 2);  /* 100em; */
    transition: padding-left .5s, padding-right .5s;
}
`;


addCss(ultrawideCSS);
