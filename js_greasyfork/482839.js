// ==UserScript==
// @name         Restocking Profit Highlighter (STORE)
// @namespace    http://www.neocodex.us/
// @version      1.0
// @description  Automatically highlights profitable items in Neopets stores.
// @author       MediaTriggerWords, modified by ayyylmao on NeoCodex
// @match        https://www.neopets.com/objects.phtml?obj_type=47&type=shop
// @match        https://www.neopets.com/objects.phtml?obj_type=49&type=shop
// @match        https://www.neopets.com/objects.phtml?obj_type=14&type=shop
// @match        https://www.neopets.com/objects.phtml?obj_type=46&type=shop
// @match        https://www.neopets.com/objects.phtml?obj_type=30&type=shop
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482839/Restocking%20Profit%20Highlighter%20%28STORE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482839/Restocking%20Profit%20Highlighter%20%28STORE%29.meta.js
// ==/UserScript==

(function() {

    var patterns = [], classes = [];

    /*    The following define the classes of words.  If the first
    character of the specification is "=", the match will be
    case-sensitive, otherwise it will be case-insensitive.
    The specification is a regular expression, and should
    contain metacharacters to handle variant spellings and
    plurals.  Any grouping within these patterns *must* be done
    with a (?: ... ) specification to avoid messing up the
    capture from the text string.

    You may add additional categories as you wish, but be sure to
    declare their rendering in the style definition below.  */

    //    Rendering styles for our various word classes

    addGlobalStyle('span.purple { background-color: #000000; color: #a020f0; } ' +
           'span.green { background-color: #000000; color: #23ea11; } ' +
           'span.yellow { background-color: #000000; color: #fdff00;} ' +
           'span.orange { background-color: #000000; color: #ffa500; } ' +
           'span.red { background-color: #000000; color: #ff1a00;} ' +
                 'span.blank { background-color: #000000; color: #ffffff} ' );

    // BLANK items. Items in this list will appear as white on white and be functionally invisible.300-1000

    defwords([
        "Grape Pizza ",
"Whole Cheese Pizza ",
"Ergy Pizza ",
"Four Dirt Pizza Block ",
"Half Garden Fresh Pizza ",
"Whole Pepperoni and Mushroom Pesto Pizza ",
"Whole Sushi Pizza ",
"Chyrsaberry Pizza ",
"Yam-Lime Pizza ",
"Caramel Pizza Slice ",
"Broccoli and Cheese Pizza ",
"Cherry Cheese Pizza ",
"Bullseye Pizza ",
"Tropical Fruit Pizza Slice ",
"Vegetarian Pizza",
"Mac and Cheese Pizza ",
"Whole Watermelon Pizza ",
"1/3 Yummy Cloud Pizza",
"Chopped Cheops Salad",
"Gebmid Jellies",
"Sand Tofu",
"Ptolymelon",
"Gherkin Hot Dog",
"Lentil And Bean Hot Dog",
        ],
             "blank");

    //    GREEN words. These items are black background with green text.profit : 1000-2000

    defwords([
        "Chocolate Chip Pizza ",
"Garden Fresh Pizza Slice ",
"Whole Garden Fresh Pizza ",
"Dung Pizza ",
"Cookie Pizza ",
"Whole Frozen Corn Pizza ",
"Sauce Drenched Pizza ",
"Edible Tar Pizza ",
"Roast Chestnut Pizza Slice ",
"Split Pizza ",
"Frog Leg Pizza",
"Whole White Pizza",
"Half Yummy Cloud Pizza ",
"Aisharoni Pizza ",
"Peas and Corn Pizza ",
"Whole Yummy Cloud Pizza ",
"Pepperoni and Mushroom Pizza",
"Jelly Bean Pizza ",
"Smiley Pizza",
"Root Beer Barrels",
"Pyraberry",
"First Date Cake",
"Gummy Sand Horus",
"Sand Watermelon",
"Fluorescent Hot Dog",
"Tarragon and Brie Hot Dog",
"Cucumber Hot Dog",
"Baby Cabbage Hot Dog",
"Extra Slim Hot Dog",
"Overcooked Hot Dog",
"Plain Sweet Potato",
"Snorkle Snout",
"This Isnt Chili Cheese Fries",
"Chocolate Covered Peanuts",
"Pumpkin Ice Cream",
"Marshmallow and Slime Souffle",
"Bone-Chilling Bacon",
"Jalapeno Cheese Nightmare",
"Raspberry Ghostkerchief Jelly",
"The Stuff",
"Bloody Ghost Toast",
"Steamed Ectoplasm",
"Cup of Pustulence",
"Holiday Ghostpuff",
"Eyeball Slushie",
"Roast Worm with Cranberries",
"Macawormi and Cheese",
"Beast Burger",
"Finger Sandwiches",
"Bleeding Heart Jelly Sundae",
         ],
    "green");

    //    YELLOW words. Black background, yellow text.profit : 2000-5000

    defwords([
        "Starfish Pizza",
"Spaghetti and Meatballs Pizza",
"Tigerbuggle Pizza",
"Whole Chilli Cheese Pizza",
"Spicy Taco Pizza",
"Potato and Leek Pizza",
"Whole Cheesesteak Pizza",
"Yellow Lab Jellies Chocolate Bar",
"Chokato Candy Cane",
"Reject Fire Mote Lolly",
"Mega Minty Korbat Cake",
"Strawberry Meerca Lolly ",
"Baby Cabbage Jelly Beans",
"Peppermint Gormball Gumball",
"Uni Pops",
"Lemon Tonu Hard Candy",
"Candy Whistle",
"Chocolate and Cream Kyrii",
"Chewy Strawberry Aisha Ears",
"Torpedos",
"Milk Chocolate Usul",
"Rosy Apples",
"Valentines Chocolate Selection",
"Milk Chocolate Nova",
"Grape Blumaroo Gummy Die",
"Furry Fury Grarrl Gobstopper",
"Candy Heart Necklace",
"Buzz Honey Lolly",
"Mint Chocolate Tuskaninny",
"Chocolate Turkey",
"Valentines Heart Shaped Chocolate Box",
"Milk Chocolate Buzz",
"Milk Chocolate Krawk Coin",
"Sweet Baked Beans",
"Salty Gumball",
"Balloon-Shaped Rainbow Candy",
"Gummy Worm Lollypop ",
"Dark Chocolate Ruki",
"Gemmy Beans",
"Sugared Elephante Feet",
"Dust Covered Salad",
"Kelp Covered Hot Dog",
"Ant Eaten Corn Dog",
"Sand Hot Dog",
"Slime-Frosted Pretzel",
"Grape Gummy Slorg",
"Kau Sundae",
"Barbed Wire Black Licorice",
"Mint Chocolate Chia",
"White Chocolate Nova",
"Chocolate King Skarl",
"Codestone Truffle",
"Blueberry Gummy Stamp",
"Green Apple Aisha Lollypop",
"Heart Lollipop",
"Chunky Cherry Grarrl Gobstopper",
"Ummagine Candy Cane",
"Lime Skidget Lolly",
"Orange Chocolate Tuskaninny",
"2 Scoops of Friendship",
"Korbat Sugar Skull",
"Dark Chocolate Shoyru",
"Box of Dung Chocolates",
"Lime Grarrl Pop",
"Hard Doughnutfruit Candies",
"White Blackberry Candy",
"Chocolate Dipped Pteri Tail",
"Heart Shaped Chocolates",
"Mint Chocolate Krawk Coin",
"Pink Gormball Gumball",
"Gummy Aubergine Chia",
"Valentines Chocolate Selection",
"Grape Gummy Book",
"Orange Lupe Hard Candy",
"Lime Bori Lolly",
"Raspberry Achyfi Lollypop",
"Raspberry Neodrops",
"Orange Chocolate JubJub",
"Dark Chocolate Hissi",
"Strawberry Achyfi Lollypop",
"Sweet Baked Beans",
"Milk Chocolate Nova",
"Fyora Lollyswirl",
"Orange Chocolate Jetsam",
"Dried Kumquat Sweets",
"Jelly Wocky",
"Coffee Candy",
"Blueberry Grundo Lollypop",
"Chocolate Flakes",
"Mallowicious Bar",
"Screlon Sour Saucer",
"Uni Pops",
"Milk Chocolate A",
"Blobbule Snorkle Lollypop",
"Lightning Bolt Lollypop",
"Orange Chocolate Grarrl",
"Dark Chocolate Acara",
"Pineapple Lollypop",
"Pink Lemonade Gummy Peophin",
"Gummy Fish",
"Bubblegum Cybunny",
"Caramel Dipped Skeith Wings",
"Sour Apple Lupe Hard Candy",
"Dark Chocolate Bruce",
"Sour Gummy Skeith Tail",
"Grape Blumaroo Gummy Die",
         ],
    "yellow");

        //    ORANGE words. These items are black background with orange text.profit : 5000-10000

    defwords([
        "Grape Gummy Slorg",
"Milk Chocolate Tuskaninny",
"Kau Sorbet",
"Mint Chocolate Blumaroo",
"Kau Sundae",
"Mustard Mayhem Grarrl Gobstopper",
"Mud Lollipop",
"Miniature Chocolate Chocolate Factory",
"Dark Chocolate Hissi",
"Cherry Bori Lolly",
"Milk Chocolate Pteri",
"Lemon Curd Gormball Truffle",
"Mint Chocolate Chia",
"Gnorbu Lollipop",
"Chocolate King Skarl",
"White Chocolate Nova",
"Sludge Filled Jelly Beans",
"Lime Jelly JubJub",
"Sugar Aisha Skull",
"Green Lab Jellies Candy",
"Green Apple Aisha Lollypop",
"Dried Kumquat Sweets",
"Milk Chocolate Hollow Cybunny ",
"Dark Chocolate Peophin",
"Sour Lemon Lolly",
"Bubblegum Zafara",
"Lime Skidget Lolly",
"Uni Sugar Skull",
"Blueberry Grundo Lollypop",
"Gummy Yoyo",
"Orange Cream Techo Truffle",
"Peanut Brittles",
"Raspberry Achyfi Lollypop",
"Strawberry Neodrops",
"Lolli Keyring ",
"Asparagus Chia Treat",
"Chokato Chia Treat",
"Chocolate Coated Lolly",
"Rainbow Elephante Lolly",
"Grape Peophin Lollypop",
"Heart Lollipop",
"Milk Chocolate Peophin",
"Grondik Root Hot Dog",
"Brain Ice Cream",
"Worm Stew",
"Strawberry Ice Cream Apple Lantern",
"Elephante Trunk Stew",
"Spooky Handwich",
"Disturbing Gelatin",
"Candy Skull",
"Sponge Apple",
"Ednas Spooky Brew",
"Pumpkin Pot Pie",
"Brains and Dumplings",
"Carnivorous Carved Pumpkin",
"Assorted Fruit Blocks",
         ],
    "orange");

        //    RED words. Black background, red text.profit : 10000-50000

    defwords([
        "Rainbow Melt Pizza",
"Whole Cheeseburger Pizza",
"Whole Cauliflower and Lentil Pizza",
"Whole Mushroom Pizza",
"Squid Delight Pizza",
"Bullseyes",
"Minty Choccywhip",
"Chocolate Jeran",
"Cherry Aboogala Lolly ",
"Milk Chocolate Kiko ",
"Gnorbu Gum",
"Apple and Custard Drops",
"Milk Chocolate Kacheek",
"Banana Jelly Flotsam",
"Neverending Jar of Jellybeans",
"Orange Lupe Hard Candy",
"Toffee Apple",
"Mint Chocolate Peophin",
"Acara Jelly Pops",
"Sugar Moehog Skull",
"Kau Cookie",
"Lemon Grarrl Gummy",
"Fruity Korbites",
"Codestone Truffle",
"Lemon Sugared Gelert Gummy",
"Lemon Bumbluz Lolly",
"Chocolate Maractite Coins",
"Angry Candy",
"Odorra Pod",
"Peppered Kersla Bug",
"Dried Blusops",
"Pyramid Pear",
"Patrapiller and Honey",
"Fried Suwek",
"Sloth Dog",
"Honey Coated Hot Dog",
"Stone Hot Dog",
"Strawberry Flavoured Hot Dog",
"14 Karat Baked Potato",
"Dessert Hot Dog",
"Shrimp Salad Hot Dog",
"Deluxe Jacket Potato",
"Poison Apples",
"Chocolate Coated Eye",
"Pink Spooky Popcorn",
"Pink Spooky Ice Cream",
"Spooky Ghostbeef",
"Forgotten Apple",
"Gummi Worms",
"BluePepper Porridge",
         ],
             "red");

     //    PURPLE words. These items are black background with green text.profit : 50k+

    defwords([
        "PIZZA OF DEATH",
"Peachy Pizza",
"Happy Birthday Pizza",
"Pirate Pizza",
"Whole Steak and Egg Pizza",
"Double Chocolate Jelly Beans",
"Neotruffle",
"Chocolate Moltenore",
"Pretty Pink Easter Negg",
"Chocolate Crown of Sinsi",
"Spotted Easter Negg",
"Mint Chocolate Easter Negg",
"Chocolate Orange Easter Negg",
"Lemon and Lime Easter Negg",
"Strawberries and Cream Easter Negg",
"Luxury Chocolate Easter Negg",
"Chocolate Ruki Kit",
"Marshmallow Plumpy",
"Orange Lightmite Lollypop",
"Chocolate Advent Calendar",
"Holiday Bell Chocolate Advent Calendar",
"Sugar Tonu Skull",
"Creamy Choccywhip",
"Spooky Flying Doughnut",
"Caramel and Custard Drops",
"Snowflake Chocolate Advent Calendar",
"Chocolate Cybunny Negg",
"Hazelnut Whirl",
"Chocolate Peach",
"Omnipotent Onion Grarrl Gobstopper",
"Yummy Drops",
"ErgyFruit Jelly Beans",
"Chocolate Blossom",
"Super Spicy Jelly Beans",
"Orange Scoach Lolly",
"Chocolate Dr Sloth",
"Draik Sugar Skull",
"Cherry Meerca Gobstopper",
"Cherry Mootix Lollypop",
"Pyramid Purpple",
"Geopeppers",
"Pyramid Strawberry",
"Pyramid Banana",
"Gwontek Melon",
"Burning Hot Dog",
"Diamond Hot Dog",
"Punk Rocker Hot Dog",
"Well-Aged Hot Dog",
"Linked Hot Dogs",
"Mini Baby Hot Dogs",
"Mecha Hot Dog",
"Big Beefy Hot Dog",
"Natural Hot Dog",
"Stealthy Hot Dog",
"Salt Water Hot Dog",
"Hot Dog with Everything",
"Parts on a Pizza",
"Cadaverous Cola",
"Crunchy Snotball",
"Pumpkin Scoopings",
"Halloween Candy Cane",
"Jelly Spider Eyeball",
"Wing of Korbat",
"Snorkle Pudding",
"Coco Pumpkin",
"Meerca Pie",
"Jelly Finger",
"Runny Snot",
"Apple Lantern",
"Mouldy Cheese",
"Spoooky Muffin",
"Grundo Toe Lint",
"Pink Apple Lantern",
"Ghost Puff",
"Elderly Apple",
         ],
    "purple");

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

    var curpat;             // Hidden argument to repmatch()
    var changes;            // Number of changes made by repmatch()

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