// ==UserScript==
// @name         Item Highlighter - Magical Book Shop
// @version      1.0
// @description  Highlight items you specify in this shop.
// @author       goldenstranger
// @match        https://www.neopets.com/objects.phtml?type=shop&obj_type=7
// @namespace https://greasyfork.org/users/951153
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491844/Item%20Highlighter%20-%20Magical%20Book%20Shop.user.js
// @updateURL https://update.greasyfork.org/scripts/491844/Item%20Highlighter%20-%20Magical%20Book%20Shop.meta.js
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

"Culture and History of Faerieland",
"Bruces Guide to Combat Eating",
"A Chia Story",
"Super Secret Guide to the Defenders of Neopia Headquarters",
"A History of Chias",
"Illusens Diary",
"The Voodoo Techo",
"Beating Sloth",
"A Seasonal Pea",
"Ultimate Space Chronicles Set",
"Brain Trees Brainiac",
"Lenny Cookbook",
"Best Friends",
"Inside the Mind of Bob",
"Decoding a Coded Decoding Book",
"The Shadow Usul",
"Cures for Bad Breath",
"Olde Zafara",
"A Chia Halloween",
"Neopian Heroes",
"Inside the Gifts for your Enemies",
"Sophie, A Biography",
"Forbidden Zafara",
"Petfolio",
"Trigonometry Hyperbolics",
"Uni Myths",
"The Bad Skeith",
"The Magic Staff",
"Zafara Mystery Collection",
"Chomby Mysteries",
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
