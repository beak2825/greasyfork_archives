// ==UserScript==
// @name Better StackOverflow
// @namespace -
// @version 1.2.3
// @description adds outline to code blocks, ad block, no cookie modal, various fixes.
// @author NotYou
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/458075/Better%20StackOverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/458075/Better%20StackOverflow.meta.js
// ==/UserScript==

(function() {
let css = `/* Darker Accepted Mark Background in questions list */

.s-post-summary--stats .s-post-summary--stats-item.has-answers.has-accepted-answer {
    background-color: var(--green-legacy-600);
    border-color: var(--green-legacy-600);
}

/* Fix; Keyboard and Tag Elements | https://meta.stackexchange.com/a/257138/260841 */

kbd,
.s-prose .post-tag {
    white-space: pre-wrap;
    max-width: calc(100% - 0.1em);
}

/* Fix; Non-Vertically Aligned Elements at Sidebar | https://meta.stackexchange.com/q/388770/ */

#sidebar .related a,
#sidebar .linked a {
    margin: auto 0;
}

/* Fix; Remove Default FF styles for <select> */

select {
    -webkit-appearance: none;
       -moz-appearance: none;
            appearance: none;
}

/* Fix; No Overflowing Avatar Text */

.s-avatar.s-user-card--avatar {
    overflow: hidden;
}

/* Ad Block */

.img_ad,
#dfp-tsb,
#dfp-smlb,
#dfp-tlb,
#dfp-mlb,
.js-report-ad-button-container,
.adsbox,
#newsletter-ad,

/* Cookie */

.js-consent-banner {
    display: none !important;
}

.js-tag-editor.tag-editor.multi-line.s-input {
    width: 100% !important;
}

/* Code Outline */

.default.s-code-block {
    --color: rgba(0, 0, 0, .2);
}

[class*="lang-"] {
    border: 2px solid var(--color);
}

[class*="lang-"]::after {
    content: '\\a'var(--content);
    color: var(--color) !important;
    padding: 2px 5px 5px 5px;
    font-weight: 800;
}

.snippet-code [class*="lang-"]::after {
    content: '\\a\\a'var(--content);
}

.s-code-block::after {
    font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.lang-none {
    --color: rgb(100, 0, 0);
    --content: "Plain";
}

.lang-js {
    --color: rgb(247, 223, 30);
    --content: "JS";
}

.lang-js::after {
    color: rgb(0, 0, 0);
}

.lang-html {
    --color: rgb(242, 103, 44);
    --content: "HTML";
}

.lang-css {
    --color: rgb(52, 169, 222);
    --content: "CSS";
}

.lang-java {
    --color: rgb(234, 146, 5);
    --content: "Java";
}

.lang-py,
.lang-python {
    --color: rgb(54, 119, 173);
    --content: "Python";
}

.lang-cpp {
    --color: rgb(101, 154, 210);
    --content: "C++";
}

.lang-cs,
.lang-csharp {
    --color: rgb(93, 108, 189);
    --content: "C#";
}

.lang-c {
    --color: rgb(93, 108, 189);
    --content: "C";
}

.lang-php {
    --color: rgb(93, 108, 189);
    --content: "PHP";
}

.lang-rb {
    --color: rgb(174, 21, 5);
    --content: "Ruby";
}

.lang-r {
    --color: rgb(35, 105, 190);
    --content: "R";
}

.lang-perl {
    --color: rgb(66, 68, 109);
    --content: "Perl";
}

.lang-bsh {
    --color: rgb(41, 48, 54);
    --content: "Bash";
}

.lang-kotlin {
    --color: rgb(117, 114, 227);
    --content: "Kotlin";
}

.lang-rust {
    --color: rgb(0, 0, 0);
    --content: "Rust";
}

.lang-regex {
    --color: rgb(64, 209, 178);
    --content: "RegEx";
}

.lang-sql {
    --color: rgb(192, 207, 212);
    --content: "SQL";
}

.lang-pascal {
    --color: rgb(50, 96, 160);
    --content: "Pascal";
}

.lang-vb {
    --color: rgb(60, 110, 179);
    --content: "VB";
}

.lang-xml {
    --color: rgb(0, 95, 174);
    --content: "XML";
}

.lang-lua {
    --color: rgb(0, 0, 128);
    --content: "Lua";
}

.lang-go {
    --color: rgb(106, 215, 228);
    --content: "Go";
}

.lang-swift {
    --color: rgb(250, 42, 31);
    --content: "Swift";
}

.lang-clj {
    --color: rgb(145, 180, 255);
    --content: "Clojure";
}

.lang-scala {
    --color: rgb(234, 2, 0);
    --content: "Scala";
}

.lang-typescript {
    --color: rgb(49, 120, 198);
    --content: "TypeScript";
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
