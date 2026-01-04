// ==UserScript==
// @name Hybris HAC scripts usability fixes
// @namespace github.com/openstyles/stylus
// @version 1.0.2
// @description Style to show the code, output & result at the same page in the HAC script runner
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:.*/console/scripting.?)$/
// @downloadURL https://update.greasyfork.org/scripts/405070/Hybris%20HAC%20scripts%20usability%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/405070/Hybris%20HAC%20scripts%20usability%20fixes.meta.js
// ==/UserScript==

(function() {
let css = `
#tabs-edit:before {
   font-weight: bold;
   content: "Script:";
}
#tabs-edit {
    display: block !important;
}

#tabs-result:before {
   font-weight: bold;
   content: "Results:";
}
#tabs-result {
    display: block !important;
}

#tabs-output:before {
   font-weight: bold;
   content: "Output:";
}
#tabs-output {
    display: block !important;
}

#tabs-stacktrace:before {
   font-weight: bold;
   content: "Exception stacktrace:";
}
#tabs-stacktrace {
    display: block !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
