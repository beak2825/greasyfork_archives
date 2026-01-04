// ==UserScript==
// @name         Better Regex101 Cheatsheet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the cheatsheet of RegExr on regex101
// @author       You
// @match        https://regex101.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=regex101.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/478981/Better%20Regex101%20Cheatsheet.user.js
// @updateURL https://update.greasyfork.org/scripts/478981/Better%20Regex101%20Cheatsheet.meta.js
// ==/UserScript==

(function() {
    window.addEventListener("load",()=>{
    let style = `.cheatsheet a {
    margin-right: 8px;
    color: var(--label-color);
}
#cheatsheet:not(.Z1_qK+#cheatsheet){
    display:none;
}
.cheatsheet {
    width: 100%;
    margin: 6px;
    line-height: 15px;
    font-size: 14px;
    font-family: 'Source Code Pro';
}

.cheatsheet th {
    text-align: left;
    font-weight: 700;
    padding: 10px 0px 2px;
    color: var(--label-color);
}`

    let html = '<div id="cheatsheet"> <table class="cheatsheet"> <tbody><tr><th colspan="2" data-id="charclasses">Character classes</th></tr> <tr><td><a>.</a></td><td>any character except newline</td></tr> <tr><td><a>\\w</a><a>\\d</a><a>\\s</a></td><td>word, digit, whitespace</td></tr> <tr><td><a>\\W</a><a>\\D</a><a>\\S</a></td><td>not word, digit, whitespace</td></tr> <tr><td><a>[abc]</a></td><td>any of a, b, or c</td></tr> <tr><td><a>[^abc]</a></td><td>not a, b, or c</td></tr> <tr><td><a>[a-g]</a></td><td>character between a &amp; g</td></tr> <tr><th colspan="2" data-id="anchors">Anchors</th></tr> <tr><td><a>^abc$</a></td><td>start / end of the string</td></tr> <tr><td><a>\\b</a><a>\\B</a></td><td>word, not-word boundary</td></tr> <tr><th colspan="2" data-id="escchars">Escaped characters</th></tr> <tr><td><a>\\.</a><a>\\*</a><a>\\\\</a></td><td>escaped special characters</td></tr> <tr><td><a>\\t</a><a>\\n</a><a>\\r</a></td><td>tab, linefeed, carriage return</td></tr> <tr><th colspan="2" data-id="groups">Groups &amp; Lookaround</th></tr> <tr><td><a>(abc)</a></td><td>capture group</td></tr> <tr><td><a>\\1</a></td><td>backreference to group #1</td></tr> <tr><td><a>(?:abc)</a></td><td>non-capturing group</td></tr> <tr><td><a>(?=abc)</a></td><td>positive lookahead</td></tr> <tr><td><a>(?!abc)</a></td><td>negative lookahead</td></tr> <tr><th colspan="2" data-id="quants">Quantifiers &amp; Alternation</th></tr> <tr><td><a>a*</a><a>a+</a><a>a?</a></td><td>0 or more, 1 or more, 0 or 1</td></tr> <tr><td><a>a{5}</a><a>a{2,}</a></td><td>exactly five, two or more</td></tr> <tr><td><a>a{1,3}</a></td><td>between one &amp; three</td></tr> <tr><td><a>a+?</a><a>a{2,}?</a></td><td>match as few as possible</td></tr> <tr><td><a>ab|cd</a></td><td>match ab or cd</td></tr> </tbody></table> </div>'
    document.querySelector("#quickrefParent").insertAdjacentHTML("afterend",html+`<style>${style}</style>`)
    })
    // Your code here...
})();