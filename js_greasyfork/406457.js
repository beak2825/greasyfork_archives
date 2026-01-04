// ==UserScript==
// @name         Chocolate Avy
// @version      1.0
// @description  Automatically highlights items r90+ for the avatar.
// @author       polarbear
// @match        http://www.neopets.com/objects.phtml?type=shop&obj_type=14
// @namespace https://greasyfork.org/users/558454
// @downloadURL https://update.greasyfork.org/scripts/406457/Chocolate%20Avy.user.js
// @updateURL https://update.greasyfork.org/scripts/406457/Chocolate%20Avy.meta.js
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
"Angry Candy",
"Apple and Custard Drops",
"Apple Moquot Lollypop",
"Baby Cabbage Jelly Beans",
"Banana Jelly Flotsam",
"Barbed Wire Black Licorice",
"Blueberry Gummy Slorg",
"Blueberry Gummy Stamp",
"Blumaroo Cotton Candy",
"Bullseyes",
"Buzz Chocolate Bar",
"Candy Cane Chocolate Advent Calendar",
"Candy Pirate Earrings",
"Candy Whistle",
"Caramel and Custard Drops",
"Charcoal Jelly Beans",
"Cherry Aboogala Lolly",
"Cherry Meerca Gobstopper",
"Cherry Mootix Lollypop",
"Choco Spray",
"Chococherry Blumaroo Ears",
"Chocolate Achyfi Lollypop",
"Chocolate Advent Calendar",
"Chocolate Balthazar",
"Chocolate Crown of Sinsi",
"Chocolate Crown of the Faeries",
"Chocolate Cybunny Negg",
"Chocolate Dr Sloth",
"Chocolate Gum",
"Chocolate Jeran",
"Chocolate King Skarl",
"Chocolate Lipstick",
"Chocolate Maractite Coins",
"Chocolate Moltenore",
"Chocolate Orange Easter Negg",
"Chocolate Peach",
"Chocolate Peanuts With Peas",
"Chocolate Ruki Kit",
"Chocoon",
"Codestone Truffle",
"Creamy Choccywhip",
"Crunchy Chocolate Grarrl",
"Dark Chocolate Lutari",
"Dark Chocolate Poogle",
"Dark Chocolate Scorchio",
"Dark Chocolate Shoyru",
"Dark Chocolate Skeith",
"Dark Chocolate Tuskaninny",
"Dark Chocolate Zafara",
"Deluxe Strawberry Toffee Chokato",
"Destruct-O Chocolate Squares",
"Double Chocolate Jelly Beans",
"Draik Sugar Skull",
"ErgyFruit Jelly Beans",
"Fishy Delight Grarrl Gobstopper",
"Fluff N Stuff Grarrl Gobstopper",
"Gnorbu Gum",
"Gnorbu Lollipop",
"Grape Gummy Slorg",
"Green Apple Aisha Lollypop",
"Hazelnut Whirl",
"Holiday Bell Chocolate Advent Calendar",
"Jelly Bean Pirate Chest",
"Juppiemint Bar",
"Kau Sundae",
"Kikopop",
"Kougra Sugar Skull",
"Large Swirly Chocolate Cybunny",
"Large White Chocolate Cybunny",
"Lemon and Lime Easter Negg",
"Lemon Bumbluz Lolly",
"Lemon Pinchit Lollypop",
"Lemon Sherbert Jelly Beans",
"Lime Skidget Lolly",
"Lost City Lanes Lime Gobstopper",
"Luxury Chocolate Easter Negg",
"Marshmallow Plumpy",
"Miniature Chocolate Chocolate Factory",
"Mint Chocolate Blumaroo",
"Mint Chocolate Chia",
"Mint Chocolate Easter Negg",
"Mint Chocolate Kacheek",
"Mint Chocolate Lupe",
"Mint Chocolate Peophin",
"Mint Chocolate Tuskaninny",
"Minty Choccywhip",
"Mud Lollipop",
"Neotruffle",
"Neverending Jar of Jellybeans",
"Omnipotent Onion Grarrl Gobstopper",
"Orange Chocolate Pyramid",
"Orange Chocolate Scorchio",
"Orange Chocolate Tuskaninny",
"Orange Gummy Slorg",
"Orange Gummy Stamp",
"Orange Lightmite Lollypop",
"Orange Scoach Lolly",
"Peanut Butter Gormball Truffle",
"Peophin Chocolate Medallion",
"Pretty Pink Easter Negg",
"Rainbow Candy Floss",
"Raspberry and Vanilla Nova",
"Raspberry Chocolate Tuskaninny",
"Red Buzz Lolly",
"Sniddberry Meerca Gobstopper",
"Snowflake Chocolate Advent Calendar",
"Spooky Flying Doughnut",
"Spotted Easter Negg",
"Strawberries and Cream Easter Negg",
"Strawberry Fondant Surprise",
"Sugar Moehog Skull",
"Sugar Tonu Skull",
"Super Spicy Jelly Beans",
"Sweet Necklace",
"Thornberry Candy Gavel",
"Toffee Dubloon",
"Ummagine Candy Cane",
"Uni Sugar Skull",
"Walking Carpet Cotton Candy",
"White Chocolate Lutari",
"White Chocolate Nova",
"Yummy Drops"
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