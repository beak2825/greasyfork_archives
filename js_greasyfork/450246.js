// ==UserScript==
// @name         Faboo restocker
// @version      1.0
// @description  Automatically highlights items worth buying.
// @author       Artnerd
// @match        https://www.neopets.com/objects.phtml?type=shop&obj_type=4
// @namespace https://greasyfork.org/users/951153
// @downloadURL https://update.greasyfork.org/scripts/450246/Faboo%20restocker.user.js
// @updateURL https://update.greasyfork.org/scripts/450246/Faboo%20restocker.meta.js
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
"Zafara Altador Heroine Wig",
"Yurble Farmer Shirt",
"Yellow Zebba T-Shirt",
"Yellow Sunutek T-Shirt",
"Yellow Ramosan T-Shirt",
"Yellow Moltenore T-Shirt",
"Yellow Kookith T-Shirt",
"Yellow Jasmine Mutant Glasses",
"Yellow Buzzer T-Shirt",
"Yellow Avabot T-Shirt",
"Xweetok Wizard Cloak",
"Xweetok Popstar Dress",
"Xweetok Popstar Earrings",
"Xweetok Party Dress",
"Xandra Xweetok Wig",
"Xandra Xweetok Cape",
"Xandra Xweetok Dress",
"Wolfsbane Mutant Shorts",
"Winter Ranger Kougra Trousers",
"Winter Ranger Kougra Shoes",
"Warrior Lupe Maiden Shoes",
"Warrior Lupe Maiden Necklace",
"Warrior Lupe Maiden Bracers",
"Veiled Uni Robe",
"Veiled Uni Shoes",
"Veiled Uni Wig",
"Usul Ski Suit",
"Usul Red Winter Hat",
"Uni Knight Top Armour",
"Uni Knight Helmet",
"Trendy Aisha Shirt and Trousers",
"Trendy Aisha Scarf",
"Traditional Shenkuu Hissi Hat",
"Traditional Shenkuu Hissi Gloves",
"Super Fan Quiggle Mouth",
"Sunny Flotsam Sandals",
"Studded Leather Uni Trousers",
"Studded Leather Uni Top",
"Studded Leather Uni Shoes",
"Steel Nails",
"Spring Time Male Krawk Shirt",
"Spring Time Female Krawk Bouquet",
"Sparkling Green Chia Shoes",
"Space Wanderer Xweetok Dress",
"Sophie the Swamp Witch Ixi Wig",
"Sophie the Swamp Witch Ixi Shoes",
"Sophie the Swamp Witch Ixi Magic Smoke",
"Sophie the Swamp Witch Ixi Dress",
"Snowy Xweetok Collar",
"Snowy Xweetok Dress",
"Sneaky Card Jetsam Trousers",
"Sneaky Card Jetsam Cards",
"Slug Monster Flotsam Costume",
"Slithery Mutant Wig",
"Slick Gelert Trousers",
"Slick Gelert Shirt and Vest",
"Shrouded Draik Trousers",
"Shrouded Draik Shirt and Sash",
"Shoyru Pyjama Plushie",
"Shoyru Pink Aviator Trousers",
"Shoyru Pink Aviator Jacket",
"Shoyru Knight Boots",
"Shop Wizard JubJub Pendant",
"Shenkuu-Inspired Paper Parasol",
"Shenkuu Gelert Wig",
"School Girl Shoes",
"School Girl Plaid Skirt",
"Scary Moehog Trousers",
"Roxton Lutari Shirt and Vest",
"Roxton Lutari Trousers",
"Rocket Shoyru Helmet",
"Rock Beast Nimmo Body",
"Rock and Roll Kiko Headphones",
"Ritzy Aisha Trousers",
"Retro Galactic Blumaroo Boots",
"Retro Galactic Blumaroo Jumpsuit",
"Retro Galactic Blumaroo Tail Gadget",
"Retro Galactic Blumaroo Wig",
"Red Fur Jacket",
"Quiggle Tea Party Makeup",
"Queen Amira Aisha Blouse",
"Queen Amira Aisha Headdress",
"Queen Amira Aisha Pants",
"Queen Amira Aisha Sandals",
"Queen Amira Aisha Tail Wrap",
"Purple Krawk Cloak",
"Purple Hissi Dress",
"Punk Kiko Wig",
"Punk Kiko Gloves",
"Punk Kiko Shirt",
"Punk Kiko Contacts",
"Pretty Net Dress",
"Poogle Wizard Hat",
"Poogle Tutu",
"Poogle Punk Collar",
"Poogle Mohawk",
"Poogle Ballet Shoes",
"Poison Ivy Mutant Shoes",
"Pink Walein T-Shirt",
"Pink Kadoatie T-Shirt",
"Pink Flowered Kougra Dress",
"Pink Flosset T-Shirt",
"Pink Dreadlocks",
"Pink Blooky T-Shirt",
"Pinceron T-Shirt",
"Phoenix Pteri Plumage",
"Phoenix Pteri Tail Wrap",
"Phoenix Pteri Talons",
"Pharaoh Beard",
"Orchid Ruki Armour Bottom",
"Orchid Ruki Armour Top",
"Orchid Ruki Helmet",
"Orchid Ruki Shield",
"Orchid Ruki Sword",
"On the Go Cybunny Dress",
"On the Go Cybunny Makeup",
"On the Go Cybunny Shoes",
"On the Go Cybunny Wig",
"Oleander Mutant Shirt",
"Ombre Fyora Wig",
"Officer Zerix Grundo Glasses",
"Officer Zerix Grundo Prosthetic Antennae",
"Officer Zerix Grundo Red Contacts",
"Officer Zerix Grundo Uniform",
"Mysterious Draik Gloves",
"Mysterious Draik Jacket",
"Mysterious Draik Mask",
"Mynci Explorer Satchel",
"Mutant Book",
"Mutant Chthonic Amulet",
"Mutant Crown of Fresh Florals",
"Mutant Leather Armour",
"Mutant Milkshake",
"Moth Queen Aisha Gloves",
"Moth Queen Aisha Gown",
"Moth Queen Aisha Headdress",
"Morguss Kau Robe",
"Morguss Kau Skarl Doll",
"Money Tree Ghost Quiggle Arm Wraps",
"Money Tree Ghost Quiggle Bag",
"Money Tree Ghost Quiggle Chains",
"Milk Maid Kau Blouse",
"Medieval Shield",
"Medieval Sword",
"Medieval Armour",
"Medieval Helmet",
"Magic Sparkle Wand",
"Lutari Rollerskate Waitress Skates",
"Lutari Rollerskate Waitress Tray",
"Lutari Gentleman Shoes",
"Lutari Gentleman Trousers",
"Lutari Gentleman Hat",
"Lutari Gentleman Jacket",
"Lutari Band Leader Jacket",
"Lutari Aviator Jacket",
"Lupe Vagabond Trousers",
"Lupe Vagabond Gauntlets",
"Lupe Knight Tail Armour",
"Lupe Knight Top Armour",
"Lupe Knight Bottom Armour",
"Lupe Knight Foot Armour",
"Lupe Hunter Jacket",
"Lovely Kacheek Tail Cover",
"Lovely Kacheek Wig",
"Lovely Kacheek Dress",
"Lotus Xweetok Dress",
"Little Red Riding Hood Cybunny Cape",
"Little Red Riding Hood Cybunny Dress",
"Little Hearts Dress",
"Lacy Poogle Sleeping Gown",
"Lacy Gnorbu Dress",
"Kyrii Mage Robe",
"Kyrii Mage Cape",
"Kyrii Hostess Dress",
"Krawk T-Shirt",
"Krawk Wizard Beard",
"Krawk Wizard Cloak",
"Krawk Wizard Hood",
"Krawk Wizard Shoes",
"Krawk Wizard Staff",
"Kougra Space Suit",
"Kougra Warrior Princess Dress",
"Kougra Adventurer Hat",
"King Coltzan Lupe Postiche",
"King Coltzan Lupe Belted Skirt",
"King Coltzan Lupe Crown",
"Kiko Space Exploration Helmet",
"Kentari Shoyru Shoes",
"Kacheek Pyjama Cap",
"Kacheek Pyjama Doll",
"Kacheek Pyjama Gown",
"Jungle Aisha Hat",
"Ixi Forest Cape",
"Illusens Lucky Bracelet",
"Illusen Umbrella Cut Dress",
"I Love Wadjet T-Shirt",
"I Love Scarabug T-Shirt",
"I Love Selket T-Shirt",
"I Love Splyke T-Shirt",
"I Love Spyder T-Shirt",
"I Love Tenna T-Shirt",
"I Love Khamette T-Shirt",
"I Love Lyins T-Shirt",
"I Love Hornsby T-Shirt",
"I Love Kadoatie T-Shirt",
"I Love Chezzoom T-Shirt",
"I Love Faerie Cadro T-Shirt",
"I got taxed by the Tax Beast T-Shirt",
"I Love Buzzer T-Shirt",
"Hissi Swordsman Coat",
"Hissi Gentleman Jacket",
"Hissi Gentleman Shirt and Waistcoat",
"Highland Gelert Boots",
"Heart Print Dress",
"Hasee T-Shirt",
"Grundo Space Belt",
"Grundo Space Goggles",
"Green Poogle Rag Doll",
"Green Kougra Wig",
"Governor McGill Krawk Trousers",
"Governor McGill Krawk Wig",
"Gothic Korbat Wig",
"Gothic Kougra Jacket",
"Gothic Kougra Mask",
"Gothic Kougra Shoes",
"Gothic Kougra Trousers",
"Gothic Kougra Wig",
"Goth Blumaroo Makeup",
"Glamourous Skeith Dress",
"Glam Rocker Tonu Jacket",
"Forest Sage Ruki Tunic",
"Forest Sage Ruki Sarong",
"Flower Basket",
"Ferocious Negg Suit",
"Fauna Acara Wig",
"Fashionable Gelert Shirt and Jacket",
"Fancy Kacheek Uniform Boots",
"Fancy Grarrl Makeup",
"Fancy Aisha Wig",
"Fance Top",
"Fancy Aisha Dress",
"Faerie Queen Wings",
"Eyrie Militia Coat",
"Erisim T-Shirt",
"Elephante Bard Cape",
"Elephante Barbarian Sword",
"Elephante Barbarian Trousers",
"Elegant Lutari Wig",
"Elegant Pink Draik Fan",
"Elegant Lutari Dress",
"Elegant Lutari Gloves",
"Elegant Lutari Necklace",
"Elegant Kacheek Warrior Wig",
"Elegant Kacheek Warrior Cape",
"Elegant Draik Dress",
"Elegant Draik Earrings",
"Elegant Draik Hat",
"Elegant Draik Necklace",
"Easygoing Xweetok Scarf",
"Dress of Nature",
"Draik Sorceress Belt and Tunic",
"Draik Sorceress Cloak",
"Draik Archer Hat",
"Draik Archer Quiver",
"Draik Archer Trousers",
"Disco Aisha Shoes",
"Deserted Tomb Monster Hissi Tongue",
"Deserted Tomb Monster Hissi Sash",
"Deserted Tomb Monster Hissi Exoskeleton",
"Delightful Poogle Necklace",
"Delicate Lavender Draik Necklace",
"Dark Hooded Elephante Boots",
"Dapper Poogle Spats",
"Dapper Poogle Trousers",
"Dapper Poogle Hat",
"Cybunny Ocean Warrior Cape",
"Cybunny Ocean Warrior Dress",
"Cybunny Ocean Warrior Gloves",
"Cyberpunk Draik Armoured Wings",
"Cyberpunk Draik Armoured Claws",
"Cyberpunk Draik Armoured Tail",
"Cyberpunk Draik Helmet",
"Cyberpunk Draik Armour",
"Cute Cup of Borovan",
"Cowhand Peophin Boots",
"Cowhand Peophin Hat",
"Cowhand Peophin Pants",
"Cowhand Peophin Shirt",
"Cool Negg Meera Shoes",
"Cool Negg Meerca Costume",
"Cool Negg Meerca Glasses",
"Colourful Male Hissi Dancer Costume",
"Chomby Rainbow Bow",
"Chomby Grave Digger Hat",
"Chocolate Tuxedo",
"Checkered Lily Mutant Wig",
"Charming Pink Draik Gown",
"Bubble Mote Buddy",
"Bori Rainbow Dress",
"Bori Detective Magnifying Glass",
"Bone Print Gelert Sweater",
"Blue Khonsu T-Shirt",
"Blue Bogie T-Shirt",
"Blood of my Enemies Mutant Makeup",
"Black Hissi Choker",
"Basket of Baked Draik Goodies",
"Baby Cloud Hat",
"Alien Aisha Ears",
"Aisha Space Suit",
"Abbess Grarrl Dress",
"Abbess Grarrl Eye Makeup",
"Abbess Grarrl Head Accessory",
"Abbess Grarrl Lipstick",
"3D Glasses",

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