// ==UserScript==
// @name         GGn Trading Card Sorter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      MIT
// @description  Sort Trading Cards in Inventory by Card Category. Also adds a link to display crafting book.
// @author       drlivog
// @match        https://gazellegames.net/user.php?*action=inventory*&category=Trading+Cards*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464230/GGn%20Trading%20Card%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/464230/GGn%20Trading%20Card%20Sorter.meta.js
// ==/UserScript==

/* globals $ */

const sort_on_load = true;

let sort = 1;

const book_recipes = {
    Christmas: ["2304", "Book of Christmas Crafting"],
    Staff: ["2386", "Staff Card Crafting"],
    Portal: ["2387", "Portal Card Crafting"],
    Mario: ["2405", "Mario Card Crafting"],
    Halloween: ["2614", "Book of Halloween Crafting"],
    Trading: ["2626", "Trading Deck Crafting Recipes"],
    Birthday: ["2839", "Book of Birthday Crafting"],
    Valentine: ["3003", "Book of Valentine Crafting"]
};

$(document).ready(function() {
    'use strict';
    console.log("Started Card Sorter");
    //add Trading Book Links to Cards
    $('#items_list li div.center.item_description').each(function(index, el) {
        let cat = $(el).text().match(/Category:\s(.+)/im)?.[1]?.trim();
        if (cat == undefined || cat == null) return;
        let book = getBookForCategory(cat);
        if (book == null) return;
        let descript = $(el).html()?.replace(new RegExp(cat.replaceAll(" ", ".*"),"ig"),`<a href="#0" onclick='ReadBook("${book[0]}","${book[1]}"); return false;'>${cat}</a>`);
        $(el).html(descript);
    });

    function getBookForCategory(category) {
        for(let key in book_recipes) {
            if (category.includes(key)) {
                return book_recipes[key];
            }
        }
        return null;
    }

    const button = $('<input type="button" value="Sort Cards">').click(function() {
        if (sort==1) {
            console.log("Ascending");
            $(this).val("Sort Cards (v)");
        } else {
            console.log("Descending");
            $(this).val("Sort Cards (^)");
        }
        let cells = $('#items_list li').get();
        cells.sort(function(a,b) {
            let cat_a = $(a).find('div.center.item_description')?.text()?.match(/Category:\s(.+)/i);
            let cat_b = $(b).find('div.center.item_description')?.text()?.match(/Category:\s(.+)/i);
            if (cat_a && cat_b) { //matched category for both
                cat_a = cat_a[1].toLowerCase(); //get category part of match
                cat_b = cat_b[1].toLowerCase();
                if (cat_a < cat_b) return -sort;
                if (cat_a > cat_b) return sort;
                if (cat_a === cat_b) { //if category the same, sort by name
                    let name_a = $(a).find('div#clickable h3')?.text()?.toLowerCase();
                    let name_b = $(b).find('div#clickable h3')?.text()?.toLowerCase();
                    return name_a.localeCompare(name_b)*sort;
                }
            } else {
                if (!cat_a && !cat_b) {
                    let name_a = $(a).find('div#clickable h3')?.text()?.toLowerCase();
                    let name_b = $(b).find('div#clickable h3')?.text()?.toLowerCase();
                    return name_a.localeCompare(name_b)*sort;
                } else if (!cat_a) { //always uncategorized on top
                    return -1;
                } else { //always uncategorized on top
                    return 1;
                }
            }
        });
        sort*=-1;
        const list = $('#items_list');
        $.each(cells, function(index, row) {
            list.append(row);
        });
    }).insertBefore('#items_list');

    if (sort_on_load) button.click();

    $('#content').append(`<div class="hidden">
    <div id="book_2304_dialog" class="book_dialog">
						<div id="book_2304" class="book">
							<div class="book_content"><div style="text-align:center;"><span class="size7">New Recipes</span><br>
<br>
<span class="size5">Prismatic Shard</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/3a9ekk.png" src="https://ptpimg.me/3a9ekk.png"><br>
<br>
<span class="size5">Rainbow Star Badge</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/42n2qq.png" src="https://ptpimg.me/42n2qq.png"><br>
<br>
<span class="size5">Prismatic Shard Badge</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/063mz6.png" src="https://ptpimg.me/063mz6.png"><br>
<br>
<span class="size7">Christmas Recipes</span><br>
<span class="size7">Christmas Decks</span><br>
<br>
<span class="size5">Abominable Santa</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/545ydb.png" src="https://ptpimg.me/545ydb.png"><br>
<br>
<span class="size5">Icy Kisses</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/wbhxco.png" src="https://ptpimg.me/wbhxco.png"><br>
<br>
<span class="size5">Sexy Santa</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/072x2n.png" src="https://ptpimg.me/072x2n.png"><br>
<br>
<span class="size5">Christmas Cheer</span> <br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/08dlxn.png" src="https://ptpimg.me/08dlxn.png"><br>
<br>
<span class="size5">Gingerbread Doomslayer</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/74ode7.png" src="https://ptpimg.me/74ode7.png"><br>
<br>
<span class="size5">Mario Christmas</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/1r878u.png" src="https://ptpimg.me/1r878u.png"><br>
<br>
<span class="size5">Baby Yoda with Gingerbread</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/61a3vl.png" src="https://ptpimg.me/61a3vl.png"><br>
<br>
<span class="size5">Dirt 5</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/itqw35.png" src="https://ptpimg.me/itqw35.png"><br>
<br>
<span class="size5">Gazelle</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/2qh0q5.png" src="https://ptpimg.me/2qh0q5.png"><br>
<br>
<span class="size5">Mafia</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/84o8fr.png" src="https://ptpimg.me/84o8fr.png"><br>
<br>
<span class="size5">Trading Card: Grievous</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/Christmas2021_Grievous_Recipe.png" src="/static/common/items/Items/Recipe/Christmas2021_Grievous_Recipe.png"><br>
<br>
<span class="size5">Trading Card: Mando</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/Christmas2021_Mando_Recipe.png" src="/static/common/items/Items/Recipe/Christmas2021_Mando_Recipe.png"><br>
<br>
<span class="size5">Trading Card: Doomguy</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/Christmas2021_Doomguy_Recipe.png" src="/static/common/items/Items/Recipe/Christmas2021_Doomguy_Recipe.png"><br>
<br>
<span class="size5">Trading Card: Have a Breathtaking Christmas</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/Christmas2021_Have_a_Breathtaking_Christmas_Recipe.png" src="/static/common/items/Items/Recipe/Christmas2021_Have_a_Breathtaking_Christmas_Recipe.png"><br>
<br>
<span class="size7">Holidays Decks</span><br>
<span style="color:red;font-weight:700;">Combine your Christmas deck with two or three future different holiday decks, and have another shot at a holiday pet!</span><br>
<br>
Learn more by reading the <a href="/shop.php?ItemID=2869">Book of Pet Crafting</a>.<br>
<br>
<span class="size7">Legacy Crafting</span><br>
<span class="size5">Christmas Tree Badge</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/rn0j02.png" src="https://ptpimg.me/rn0j02.png"><br>
<br>
<span class="size5">Bauble Badge</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/oqao4m.png" src="https://ptpimg.me/oqao4m.png"><br>
<br>
<span class="size5">Chance at Impostor Bauble Badge</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/3u7p04.png" src="https://ptpimg.me/3u7p04.png"><br>
<br>
<span class="size5">Impostor Bauble Badge</span><br>
Maybe a certain criminal organization can help you find the impostor among your mates!<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/ne6vwz.png" src="https://ptpimg.me/ne6vwz.png"><br>
</div></div>
						</div>
					</div>
    <div id="book_2386_dialog" class="book_dialog">
						<div id="book_2386" class="book">
							<div class="book_content"><div style="text-align:center;"><span class="size7">Level 2 Cards</span><br>
<br>
<span class="size5">The Golden Throne</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/yy3n76.png" src="https://ptpimg.me/yy3n76.png"><br>
<br>
<span class="size5">The Biggest Banhammer</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/bmzw12.png" src="https://ptpimg.me/bmzw12.png"><br>
<br>
<span class="size5">The Staff Beauty Parlor</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/0x8830.png" src="https://ptpimg.me/0x8830.png"><br>
<br>
<span class="size5">Random Level 2 Card</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/vsh1i0.png" src="https://ptpimg.me/vsh1i0.png"><br>
<br>
<br>
<span class="size7">Level 3 Cards</span><br>
<br>
<span class="size5">The Realm of Staff</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/z86z9o.png" src="https://ptpimg.me/z86z9o.png"></div></div>
						</div>
					</div><div id="book_2387_dialog" class="book_dialog">
						<div id="book_2387" class="book">
							<div class="book_content"><div style="text-align:center;"><span class="size7">Level 2 Cards</span><br>
<br>
<span class="size5">Portal Gun</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/13f866.png" src="https://ptpimg.me/13f866.png"><br>
<br>
<span class="size5">Rick's Portal Gun</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/ze5u0w.png" src="https://ptpimg.me/ze5u0w.png"><br>
<br>
<span class="size5">Space Wormhole</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/571a6f.png" src="https://ptpimg.me/571a6f.png"><br>
<br>
<br>
<span class="size7">Level 3 Cards</span><br>
<br>
<span class="size5">Interdimensional Portal</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/7ozpde.png" src="https://ptpimg.me/7ozpde.png"></div></div>
						</div>
					</div><div id="book_2405_dialog" class="book_dialog">
						<div id="book_2405" class="book">
							<div class="book_content"><div style="text-align:center;"><span class="size7">Level 2 Cards</span><br>
<br>
<span class="size5">Super Mushroom</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/iield8.png" src="https://ptpimg.me/iield8.png"><br>
<br>
<span class="size5">Fire Flower</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/ztn5w1.png" src="https://ptpimg.me/ztn5w1.png"><br>
<br>
<span class="size5">Penguin Suit</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/u1k9zc.png" src="https://ptpimg.me/u1k9zc.png"><br>
<br>
<br>
<span class="size7">Level 3 Cards</span><br>
<br>
<span class="size5">Goal Pole</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/7n2786.png" src="https://ptpimg.me/7n2786.png"></div></div>
						</div>
					</div><div id="book_2614_dialog" class="book_dialog">
						<div id="book_2614" class="book">
							<div class="book_content"><div style="text-align:center;"><span class="size7">Halloween Recipes</span><br>
<br>
<span class="size7">2022 Halloween</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/4rl8l9.png" src="https://ptpimg.me/4rl8l9.png"><br>
<br>
<span class="size7">Ghastly 2021 Halloween</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/Halloween2021_Ghostbusters_Recipe.png" src="/static/common/items/Items/Recipe/Halloween2021_Ghostbusters_Recipe.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/Halloween2021_Boo_Recipe.png" src="/static/common/items/Items/Recipe/Halloween2021_Boo_Recipe.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/Halloween2021_King_Boo_Recipe.png" src="/static/common/items/Items/Recipe/Halloween2021_King_Boo_Recipe.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/Halloween2021_Tombstone_Badge_Recipe.png" src="/static/common/items/Items/Recipe/Halloween2021_Tombstone_Badge_Recipe.png"><br>
<br>
<span class="size7">Halloween Trading Cards</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/pq5531.png" src="https://ptpimg.me/pq5531.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/240266.png" src="https://ptpimg.me/240266.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/9mje81.png" src="https://ptpimg.me/9mje81.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/0x4fmb.png" src="https://ptpimg.me/0x4fmb.png"><br>
<br>
<span class="size7">Halloween Badge</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/36246p.png" src="https://ptpimg.me/36246p.png"><br>
<br>
<span class="size7">Cupcake Trading Cards</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/53s2i7.png" src="https://ptpimg.me/53s2i7.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/19smbs.png" src="https://ptpimg.me/19smbs.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/313v8y.png" src="https://ptpimg.me/313v8y.png"><br>
<br>
<span class="size7">Cupcake Badge</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/9tg448.png" src="https://ptpimg.me/9tg448.png"><br>
<br>
<span class="size7">Holidays Decks</span><br>
<span style="color:red;font-weight:700;">Combine your Halloween deck with two or three future different holiday decks, and have another shot at a holiday pet!</span><br>
<br>
Learn more by reading the <a href="/shop.php?ItemID=2869">Book of Pet Crafting</a>.<br>
<br>
<span class="size7">Special Box</span><br>
<span style="color:red;font-weight:700;">Combine some Halloween cards with future special holiday decks to get a very special box!</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/valentine2022_recipe_special_box.png" src="/static/common/items/Items/Recipe/valentine2022_recipe_special_box.png"></div></div>
						</div>
					</div><div id="book_2626_dialog" class="book_dialog">
						<div id="book_2626" class="book">
							<div class="book_content"><div style="text-align:center;"><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/styles/game_room/images/icons/enchant.png" src="/static/styles/game_room/images/icons/enchant.png"> <br>
<br>
<span class="size5">Please note that working with trading decks requires an  <a href="/shop.php?ItemID=2247">Enchantment Circle</a>. Be sure you have purchased one before you try crafting.</span><br>
<br>
<br>
<div style="text-align:center;"><span class="size7">Flame Lootbox Recipes</span><br>
<span class="size5">Random Lootbox</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/8b4s79.jpg" src="https://ptpimg.me/8b4s79.jpg"><br>
<br>
<span class="size5">Din's Lootbox</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/y05y89.jpg" src="https://ptpimg.me/y05y89.jpg"><br>
<br>
<span class="size5">Farore's Lootbox</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/5ul2di.jpg" src="https://ptpimg.me/5ul2di.jpg"><br>
<br>
<span class="size5">Nayru's Lootbox</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/5c371u.jpg" src="https://ptpimg.me/5c371u.jpg"><br>
<br>
<span class="size7">Holidays Decks</span><br>
<span style="color:red;font-weight:700;">Combine your Birthday deck with two future different holiday decks, and have another shot at a holiday pet!</span><br>
<br>
Learn more by reading the <a href="/shop.php?ItemID=2869">Book of Pet Crafting</a>.</div></div></div>
						</div>
					</div><div id="book_2839_dialog" class="book_dialog">
						<div id="book_2839" class="book">
							<div class="book_content"><div style="text-align:center;"><span class="size7">Birthday Recipes</span><br>

<span class="size5">11th Birthday Trading Cards</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/3938yd.png" src="https://ptpimg.me/3938yd.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/22lb12.png" src="https://ptpimg.me/22lb12.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/9dj6k6.png" src="https://ptpimg.me/9dj6k6.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/t1ui8h.png" src="https://ptpimg.me/t1ui8h.png"><br>
<br>
<span class="size5">10th Birthday Trading Cards</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/431bp6.png" src="https://ptpimg.me/431bp6.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/3m1ihm.png" src="https://ptpimg.me/3m1ihm.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/l40ya1.png" src="https://ptpimg.me/l40ya1.png"><br>
<br>
<span class="size5">9th Birthday Trading Cards</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/7i0n6j.png" src="https://ptpimg.me/7i0n6j.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/a263n2.png" src="https://ptpimg.me/a263n2.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/ib5poe.png" src="https://ptpimg.me/ib5poe.png"><br>
<br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/3o46j5.png" src="https://ptpimg.me/3o46j5.png"><br>
<br>
<span class="size7">Birthday Badges</span><br>
<span class="size5">13th Birthday</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/Birthday2023_Badge_Recipe.png" src="/static/common/items/Items/Recipe/Birthday2023_Badge_Recipe.png"><br>
<br>
<span class="size5">12th Birthday</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/ijhwko.png" src="https://ptpimg.me/ijhwko.png"><br>
<br>
<span class="size5">11th Birthday</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/4cknyw.png" src="https://ptpimg.me/4cknyw.png"><br>
<br>
<span class="size5">10th Birthday</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/czy49g.png" src="https://ptpimg.me/czy49g.png"><br>
<br>
<span class="size5">9th Birthday</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/9z5h41.png" src="https://ptpimg.me/9z5h41.png"><br>
<br>
<span class="size7">Holidays Decks</span><br>
<span style="color:red;font-weight:700;">Combine some Birthday decks with different holiday decks, and have another shot at a holiday pet!</span><br>
<br>
Learn more by reading the <a href="/shop.php?ItemID=2869">Book of Pet Crafting</a>.<br>
<br>
<span class="size7">Special Box</span><br>
<span style="color:red;font-weight:700;">Combine some Birthday cards with other special holiday decks to get a very special box!</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/valentine2022_recipe_special_box.png" src="/static/common/items/Items/Recipe/valentine2022_recipe_special_box.png"></div></div>
						</div>
					</div><div id="book_3003_dialog" class="book_dialog">
						<div id="book_3003" class="book">
							<div class="book_content"><div style="text-align:center;"><span class="size7">Valentine Cards</span><br>
<br>
<span class="size5">Kirlia and Meloetta</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/e20u5y.png" src="https://ptpimg.me/e20u5y.png"><br>
<br>
<span class="size5">Dom and Maria</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/12d93o.png" src="https://ptpimg.me/12d93o.png"><br>
<br>
<span class="size5">Mr and Mrs Pac Man</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/dqymg2.png" src="https://ptpimg.me/dqymg2.png"><br>
<br>
<span class="size5">Angelise Reiter</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/dmzdy5.png" src="https://ptpimg.me/dmzdy5.png"><br>
<br>
<span class="size5">Sophitia</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/5q9009.png" src="https://ptpimg.me/5q9009.png"><br>
<br>
<span class="size5">Yennefer</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://ptpimg.me/3cd8iz.png" src="https://ptpimg.me/3cd8iz.png"><br>
<br>
<br>
<span class="size7">Special Box</span><br>
<span style="color:red;font-weight:700;">Combine your Valentine cards with future special holiday decks to get a very special box!</span><br>
<img style="max-width: 600px;" onclick="lightbox.init(this,600);" alt="https://gazellegames.net/static/common/items/Items/Recipe/valentine2022_recipe_special_box.png" src="/static/common/items/Items/Recipe/valentine2022_recipe_special_box.png"><br>
<br>
<br>
<span class="size5">Please note that working with gems, magical feathers, and other Valentine equipment requires an <a href="/shop.php?ItemID=2247">Enchantment Circle</a>. Be sure you have purchased and activated one before you try crafting enchanted boots.</span><br>
<br>
</div></div>
						</div>
					</div>
                    </div>`)
});