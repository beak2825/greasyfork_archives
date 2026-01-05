// ==UserScript==
// @name           BvS Workshop Helper
// @namespace      Garyzx
// @description    Displays the ingredients needed to make something and adds a link to make it
// @version	   1.5
// @history        1.5 New domain - animecubedgaming.com - Channel28
// @history        1.4 Now https compatible (Updated by Channel28)
// @history        1.3 Multiple recipes for same object is now allowed (Thanks TalTamir for noticing something was wrong.  Updated by Channel28)
// @history        1.2 Fixed things so works in GreaseMonkey now (Updated by Channel28)
// @history        1.1 Added grant permissions (Updated by Channel28)
// @history        1.0 Initial Release
// @include        http*://*animecubed.com/billy/bvs/workshop.html
// @include        http*://*animecubedgaming.com/billy/bvs/workshop.html
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/2488/BvS%20Workshop%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/2488/BvS%20Workshop%20Helper.meta.js
// ==/UserScript==

(function() {
    var recipes = {};
    recipes["Malted Pill"] = "Food Pills,Food Pills";
    recipes["Biggie Chips"] = "Bag of Chips,Bag of Chips";
    recipes["Potion Base"] = "Boring Bulb,Boring Bulb";
    recipes["Milkshake"] = "Glowing Goo,Malted Pill";
    recipes["Doublestacker"] = "Tasty Burger,Tasty Burger";
    recipes["Double Double"] = "Biggie Chips,Doublestacker";
    recipes["Tasty Tonic"] = "Tasty Twig,Potion Base";
    recipes["Bitter Medicine"] = "Bitter Powder,Potion Base";
    recipes["Ultra Elixir"] = "Glowing Goo,Potion Base";
    recipes["Super Potion"] = "Glowing Goo,Glowing Goo";
    recipes["Smokestack"] = "Smokeblossom,Potion Base";
    recipes["Silver Potion"] = "Silver Clover,Potion Base";
    recipes["Silver Elixir"] = "Silver Emulsion,Potion Base";
    recipes["Mood Ring Kit"] = "Silver Ringlet,Glowing Goo";
    recipes["Silver Pin Kit"] = "Silver Pin Piece,Silver Pin Piece";
    recipes["Cure Right Wounds"] = "The Right Stuff,Potion Base";
    recipes["Wasteland Rebreather"] = "Dust Matrix,Filter Wrappings";
    recipes["Emergency Rations"] = "Milkshake,Double Double";
    recipes["Powerful Potion"] = "Power Flower,Potion Base";
    recipes["Jet-Black Potion"] = "Blackened Dust,Potion Base";
    recipes["Ochre Potion"] = "Wasteland Dust,Potion Base";
    recipes["Ashen War Paint"] = "The Right Stuff,Ashen Film";
    recipes["'Diet' Soda"] = "Curdled Powder,Greass";
    recipes["Greassy Burger"] = "Mystery Meat,Greass";
    recipes["Greassy Fries"] = "Green Potatoes,Greass";
    recipes["Greassy Nuggets"] = "Pigeon Chunks,Greass";
    recipes["Greassy Royale"] = "Dehydrated Sammich,Greass";
    recipes["Dark Mixture"] = "Dark Water,Dark Water";
    recipes["Dark Draft"] = "Dark Mixture,The Right Stuff";
    recipes["Make-Out Mood Enhancer"] = "Stark Moonlight,Stark Moonlight";
    recipes["Monochrome Pheromone"] = "Monochrome Flower,Monochrome Flower";
    recipes["Reversing Hourglass"] = "Ebony Sand,Ebony Sand";
    recipes["Rotating Timesphere"] = "Dayshade,Nightshade";
    recipes["Ashen Film"] = "Smokeblossom,Smokeblossom";
    recipes["Bitter Powder"] = "Medicinal Herbs,Medicinal Herbs";
    recipes["Powerpack"] = "Power Flower,Power Flower";
    recipes["Twigpile"] = "Tasty Twig,Tasty Twig";
    recipes["Glowing Goo"] = "Powerpack,Twigpile";
    recipes["The Right Stuff"] = "Glowing Goo,Apple-y Goodness";
    recipes["Apple-y Goodness"] = "Juicy Apple,Juicy Apple";
    recipes["Milkshake"] = "Malted Pill,Glowing Goo";
    recipes["Silver Pair"] = "Silver Petals,Silver Petals";
    recipes["Silver Clover"] = "Silver Pair,Silver Pair";
    recipes["Silver Ringlet"] = "Silver Clover,Silver Clover";
    recipes["Silver Emulsion"] = "Silver Ringlet,Silver Ringlet";
    recipes["Silver Pin Piece"] = "Silver Emulsion,Silver Emulsion";
    recipes["Dustpile"] = "Wasteland Dust,Wasteland Dust";
    recipes["Dust Matrix"] = "Dustpile,Dustpile";
    recipes["Filter Wrappings"] = "Filtered Thread,Filtered Thread";
    recipes["Basic Dustcloak"] = "Basic Harness,Filter Wrappings";
    recipes["Weighted Dustcloak"] = "Weighted Harness,Filter Wrappings";
    recipes["Wasteland Dustcloak"] = "Wasteland Harness,Filter Wrappings";
    recipes["Dustcloak of Sneaking"] = "Magical Harness,Filter Wrappings";
    recipes["Makeshift Pistol"] = "Basic Firing Pin,Basic Handle";
    recipes["Average Pistol"] = "Basic Firing Pin,Reinforced Handle";
    recipes["Wasteland Pistol"] = "Cobalt Firing Pin,Reinforced Handle";
    recipes["Pistol of Repeating"] = "Magical Firing Pin,Reinforced Handle";
    recipes["Makeshift Scythe"] = "Basic Polearm,Curved Blade";
    recipes["Silver Scythe"] = "Quality Polearm,Curved Blade";
    recipes["Wasteland Scythe"] = "Excellent Polearm,Sharp Crystal";
    recipes["Scythe of Razing"] = "Magical Polearm,Sharp Crystal";
    recipes["Desert Shades"] = "Desert Monocle,Desert Monocle";
    recipes["Solid Shades"] = "Solid Monocle,Desert Monocle";
    recipes["Fur Lined Boots"] = "Regular Boot Design,Filtered Thread";
    recipes["Quality Boots"] = "Quality Boot Design,Filtered Thread";
    recipes["Wasteland Boots"] = "Wasteland Boot Design,Indestructible Thread";
    recipes["Boots of Walking"] = "Magical Boot Design,Indestructible Thread";
    recipes["Basic Cowl"] = "Six Regular Furs,Filtered Thread";
    recipes["Dark Cowl"] = "Six Quality Furs,Filtered Thread";
    recipes["Wasteland Cowl"] = "Six Wasteland Hides,Indestructible Thread";
    recipes["Cowl of the Second HoCage"] = "Magical Hide Pattern,Indestructible Thread";
    recipes["Metal Rivets"] = "Metal Scraps,Metal Scraps";
    recipes["Wooden Plating"] = "Wooden Tile,Wooden Tile";
    recipes["Ceramic Plating"] = "Ceramic Tile,Ceramic Tile";
    recipes["Steel Plating"] = "Steel Tile,Steel Tile";
    recipes["Reinforced Plating"] = "Steel Tile,Ceramic Tile";
    recipes["Basic Harness (via Wood)"] = "Wooden Plating,Metal Rivets";
    recipes["Basic Harness (via Ceramic)"] = "Ceramic Plating,Metal Rivets";
    recipes["Weighted Harness"] = "Steel Plating,Metal Rivets";
    recipes["Wasteland Harness"] = "Reinforced Plating,Metal Rivets";
    recipes["Magical Harness"] = "Wasteland Harness,Lightning Rune";
    recipes["Basic Handle"] = "Copper Shaft,Metal Rivets";
    recipes["Reinforced Handle"] = "Silver Shaft,Metal Rivets";
    recipes["Basic Firing Pin"] = "Copper Shaft,Blackened Dust";
    recipes["Cobalt Firing Pin"] = "Cobalt Shaft,Blackened Dust";
    recipes["Magical Firing Pin"] = "Cobalt Firing Pin,Ocelot Rune";
    recipes["Curved Blade"] = "Reflector Shard,Sharpening Stone";
    recipes["Crystal Slag (via Lens)"] = "Crystal Lens,Acid Vial";
    recipes["Crystal Slag (via Sand)"] = "Glassed Sand,Acid Vial";
    recipes["Sharp Crystal"] = "Crystal Slag,Sharpening Stone";
    recipes["Copper Pole"] = "Copper Shaft,Copper Shaft";
    recipes["Basic Polearm"] = "Copper Pole,Cracked Gear";
    recipes["Average Gear"] = "Cracked Gear,Blackened Dust";
    recipes["Silver Pole"] = "Silver Shaft,Silver Shaft";
    recipes["Quality Polearm (via Silver)"] = "Silver Pole,Average Gear";
    recipes["Quality Polearm (via Cobalt)"] = "Cobalt Pole,Average Gear";
    recipes["Perfect Gear"] = "Average Gear,Blackened Dust";
    recipes["Cobalt Pole"] = "Cobalt Shaft,Cobalt Shaft";
    recipes["Excellent Polearm"] = "Cobalt Pole,Perfect Gear";
    recipes["Magical Polearm"] = "Excellent Polearm,Fox Rune";
    recipes["Brass Framework"] = "Brass Wiring,Brass Wiring";
    recipes["Desert Monocle"] = "Brass Framework,Crystal Lens";
    recipes["Solid Monocle"] = "Desert Monocle,Wolf Rune";
    recipes["Rubber Pile"] = "Rubber Bits,Rubber Bits";
    recipes["Rubber Base"] = "Rubber Pile,Acid Vial";
    recipes["Two Regular Furs"] = "Regular Fur Piece,Regular Fur Piece";
    recipes["Three Regular Furs"] = "Two Regular Furs,Regular Fur Piece";
    recipes["Four Regular Furs"] = "Three Regular Furs,Regular Fur Piece";
    recipes["Five Regular Furs"] = "Four Regular Furs,Regular Fur Piece";
    recipes["Six Regular Furs"] = "Five Regular Furs,Regular Fur Piece";
    recipes["Regular Boot Design"] = "Four Regular Furs,Rubber Base";
    recipes["Two Quality Furs"] = "Quality Fur Piece,Quality Fur Piece";
    recipes["Three Quality Furs"] = "Two Quality Furs,Quality Fur Piece";
    recipes["Four Quality Furs"] = "Three Quality Furs,Quality Fur Piece";
    recipes["Five Quality Furs"] = "Four Quality Furs,Quality Fur Piece";
    recipes["Six Quality Furs"] = "Five Quality Furs,Quality Fur Piece";
    recipes["Quality Boot Design"] = "Four Quality Furs,Rubber Base";
    recipes["Two Wasteland Hides"] = "Wasteland Hide Piece,Wasteland Hide Piece";
    recipes["Three Wasteland Hides"] = "Two Wasteland Hides,Wasteland Hide Piece";
    recipes["Four Wasteland Hides"] = "Three Wasteland Hides,Wasteland Hide Piece";
    recipes["Five Wasteland Hides"] = "Four Wasteland Hides,Wasteland Hide Piece";
    recipes["Six Wasteland Hides"] = "Five Wasteland Hides,Wasteland Hide Piece";
    recipes["Wasteland Boot Design"] = "Four Wasteland Hides,Rubber Base";
    recipes["Magical Boot Design"] = "Wasteland Boot Design,Mantis Rune";
    recipes["Magical Hide Pattern"] = "Six Wasteland Hides,Snake Rune";
    recipes["Copper Dust"] = "Copper Slag,Copper Slag";
    recipes["Copper Sliver"] = "Copper Dust,Copper Dust";
    recipes["Copper Shaft"] = "Copper Sliver,Copper Sliver";
    recipes["Silver Dust"] = "Silver Slag,Silver Slag";
    recipes["Silver Sliver"] = "Silver Dust,Silver Dust";
    recipes["Silver Shaft"] = "Silver Sliver,Silver Sliver";
    recipes["Cobalt Dust"] = "Cobalt Slag,Cobalt Slag";
    recipes["Cobalt Sliver"] = "Cobalt Dust,Cobalt Dust";
    recipes["Cobalt Shaft"] = "Cobalt Sliver,Cobalt Sliver";
 
    var items = {}, used, needs, tabs, str, item1 = "", item2 = "", item0 = "";
    function check(item) {
        if (!items[item])
            items[item] = 0;
        if (!used[item])
            used[item] = 0;
        if (items[item] - used[item] > 0) {
            used[item]++;
            log(item + " found.");
            return true;
        }
        if (!recipes[item]) {
            log("<b>" + item + " not found.</b>");
            return false;
        }
        log(item + " not found.");
        if (!needs[item])
            needs[item] = 0;
        needs[item]++;
        tabs++;
        var need = recipes[item].split(',');
        item0 = item;
        item1 = need[0];
        item2 = need[1];
        var good = check(need[0]);
        good = check(need[1]) && good;
        tabs--;
        return good;
    }
 
    function log(message) {
        str += "<br>\n";
        for (var n = 0; n < tabs; n++)
            str += "&nbsp;&nbsp;&nbsp;";
        str += message;
    }
 
    function mix() {
        var form = document.forms.namedItem("mixit");
        var option;
        if (option = document.evaluate("option[text()=\"" + item1 + "\"]", form.elements.namedItem("ingreda"), null, XPathResult.ANY_TYPE, null).iterateNext()) {
            option.selected = true;
            if (option = document.evaluate("option[text()=\"" + item2 + "\"]", form.elements.namedItem("ingredb"), null, XPathResult.ANY_TYPE, null).iterateNext()) {
                option.selected = true;
                form.elements.namedItem("amount").value = needs[item0];
                form.submit();
            }
        }
    }
 
    function change() {
        var item = select.options[select.selectedIndex].text;
        GM_setValue("lastItem", item);
        var amt = text.value;
        GM_setValue("lastAmt", amt);
        used = {};
        needs = {};
        tabs = 0;
        str = "";
        var need = recipes[item].split(',');
        item1 = need[0];
        item2 = need[1];
        item0 = item;
        needs[item] = amt;
        var good = true;
        for (var n = 0; n < amt; n++) {
            good = check(need[0]) && good;
            good = check(need[1]) && good;
        }
        linkDiv.innerHTML = "";
        if (good) {
            if (needs[item0] > 100)
                needs[item0] = 100;
            var a = document.createElement("a");
            a.href = "#";
            a.addEventListener("click", mix, true);
            a.innerHTML = needs[item0] + " " + item1 + " + " + needs[item0] + " " + item2 + " = " + needs[item0] + " " + item0;
            linkDiv.appendChild(a);
        }
        resultDiv.innerHTML = str;
    }
 
    var itemNodes = document.evaluate('//td/b[contains(text(), "Ingredients")]/ancestor::table[1]//td/span[contains(@onclick, "var")]/ancestor::tr[1]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < itemNodes.snapshotLength; i++) {
        var node = itemNodes.snapshotItem(i);
        items[node.querySelector('td>span>b').textContent] = node.querySelector('td[align=center]').textContent - 0;
    }
 
    var div = document.createElement("div");
    var insertionPoint = document.evaluate('//b[contains(text(), "Potion Mixing")]', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    insertionPoint.parentNode.insertBefore(div, insertionPoint);
 
    var text = document.createElement("input");
    text.type = "text";
    text.size = 4;
    text.value = GM_getValue("lastAmt", "1");
    div.appendChild(text);
    var item = GM_getValue("lastItem", "Super Potion");
    var select = document.createElement("select");
    for (i in recipes) {
        var option = document.createElement("option");
        option.text = i;
        if (i == item)
            option.selected = true;
        select.appendChild(option);
    }
    select.addEventListener("change", change, true);
    text.addEventListener("change", change, true);
    div.appendChild(select);
    var linkDiv = document.createElement("div");
    div.appendChild(linkDiv);
    var resultDiv = document.createElement("div");
    div.appendChild(resultDiv);
    change();
})();