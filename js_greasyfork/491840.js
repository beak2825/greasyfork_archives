
// ==UserScript==
// @name         Item Highlighter - Ice Crystals
// @version      1.0
// @description  Finds items you specify in Ice Crystals Shop.
// @author       goldenstranger
// @match        https://www.neopets.com/objects.phtml?type=shop&obj_type=36
// @namespace https://greasyfork.org/en/users/1284871
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491840/Item%20Highlighter%20-%20Ice%20Crystals.user.js
// @updateURL https://update.greasyfork.org/scripts/491840/Item%20Highlighter%20-%20Ice%20Crystals.meta.js
// ==/UserScript==

(function() {

    var patterns = [], classes = [];

    //    Rendering styles for our various word classes

    addGlobalStyle('span.red { background-color: #000000; color: #ff1a00; } ' +
           'span.yellow { background-color: #000000; color: #fdff00;} ' +
           'span.green { background-color: #000000; color: #23ea11;} ' +
                 'span.blank { background-color: #ffffff; color: #ffffff} ' );

    //    RED words. These items are black background with red text.

    defwords([

"Freezing Potion",
"Icy Snowflake",
"Ice Sceptre",
"Snowflake Pendant",
"Claw of the Ancient Bori",
"Frozen Scroll",
"Stone Snowflake",
"Unlockable Ice Treasure",
"Frozen Wave Scimitar",
"Frozen Water Daggers",

                ],
    "red");

    //    Add one or more words to the dictionary with a specified class

    function defwords(words, which_class) {
    for (var i = 0; i < words.length; i++) {
        var w = words[i].replace(/^=/, "");
        patterns.push(new RegExp("([^a-zA-Z])(" + w + ")([^a-zA-Z])",
        words[i].match(/^=/) ? "g" : "gi"));
        classes.push(which_class);
    }
    }

    //    Quote HTML metacharacters in body text

    function quoteHTML(s) {
    s = s.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    return s;
    }

    //    Add one or more CSS style rules to the document

    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    }

    //    Apply highlighting replacements to a text sequence

    var curpat; // Hidden argument to repmatch()
    var changes;// Number of changes made by repmatch()

    function repmatch(matched, before, word, after) {
    changes++;
    return before + '<span class="' + classes[curpat] + '">' + word + '</span>' + after;
    }

    function highlight(s) {
    s = " " + s;
    for (curpat = 0; curpat < patterns.length; curpat++) {
        s = s.replace(patterns[curpat],
            repmatch);
    }
    return s.substring(1);
    }

    //    We only modify HTML/XHTML documents
    if (document.contentType &&
        (!(document.contentType.match(/html/i)))) {
        return;
    }

    // Highlight words in body copy

    var textnodes = document.evaluate("//body//text()", document, null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (var i = 0; i < textnodes.snapshotLength; i++) {
    var node = textnodes.snapshotItem(i);
    /* Test whether this text node appears within a
       <style>, <script>, or <textarea> container.
       If so, it is not actual body text and must
       be left alone to avoid wrecking the page. */
    if (node.parentNode.tagName != "STYLE" &&
        node.parentNode.tagName != "TEXTAREA" &&
        node.parentNode.tagName != "SCRIPT") {
        /* Many documents have large numbers of empty text nodes.
           By testing for them, we avoid running all of our
           regular expressions over a target which they can't
           possibly match. */
        if (!(node.data.match(/^\s*$/))) {
        var s = " " + node.data + " ";
        changes = 0;
        var d = highlight(quoteHTML(s));
        if (changes > 0) {
            var rep = document.createElement("span");
            rep.innerHTML = d.substring(1, d.length - 1);
            node.parentNode.replaceChild(rep, node);
        }
        }
    }
    }

})();