// ==UserScript==
// @name         JellyNeo Direct Dailies Links
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Love JellyNeo's Dailies list, but hate that some of the links take extra work (like unnecessary clicks)? Skip the trouble and go straight to the end!
// @author       chanakin
// @match        https://www.jellyneo.net/index.php?go=dailies
// @match        https://www.jellyneo.net/?go=dailies
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jellyneo.net
// @grant        none
// @license      MIT
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/501365/JellyNeo%20Direct%20Dailies%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/501365/JellyNeo%20Direct%20Dailies%20Links.meta.js
// ==/UserScript==

const COCONUT_SHY_DIRECT_LINK_NO_FLASH = "https://www.neopets.com/halloween/process_cocoshy.phtml?coconut=3"
const GERAPTIKUS_TOMB_FINAL_URL = "https://www.neopets.com/worlds/geraptiku/process_tomb.phtml"
const EXPELLIBOX_DIRECT_LINK_NO_FLASH = "https://ncmall.neopets.com/games/giveaway/process_giveaway.phtml"
const DAILY_PUZZLE_SOLUTION = "https://www.jellyneo.net/?go=dailypuzzle"
const TEST_YOUR_STRENGTH_NO_FLASH = "http://www.neopets.com/halloween/strtest/process_strtest.phtml"
const BAGATELLE_NO_FLASH = "http://www.neopets.com/halloween/process_bagatelle.phtml"
const CORKGUN_NO_FLASH = "http://www.neopets.com/halloween/process_corkgun.phtml"
const SECRET_LAB = "https://www.neopets.com/lab2.phtml"
const METEOR = "https://www.neopets.com/moon/meteor.phtml?getclose=1"
const FOOD_CLUB_BETS = "https://www.reddit.com/r/neopets/search/?q=food%20club&restrict_sr=1&sort=new"
const BURIED_TREASURE = "https://www.neopets.com/pirates/buriedtreasure/buriedtreasure.phtml?326,47"
const SECRET_NINJA_TRAINING_SCHOOL_STATUS = "https://www.neopets.com/island/fight_training.phtml?type=status"
const SWASHBUCKLING_ACADEMY_STATUS = "https://www.neopets.com/pirates/academy.phtml?type=status"
const MYSTERY_ISLAND_TRAINING_SCHOOL_STATUS = "https://www.neopets.com/island/training.phtml?type=status"

addButtonToOpenAllDailies();
replaceLinks();

function addButtonToOpenAllDailies() {
    var openAllButton = $('<button/>', {
        text: "Open All In New Tab",
        style: 'display: block; margin: 8px auto 0px auto;',
        id: 'openAll',
        click: function () { $('.yd-dailies-img-link').each(function () {
            $(this)[0].click()
        })}
    })

    $('.content-wrapper .text-center').append(openAllButton)
}

function replaceLinks() {
    $("a[href='https://www.neopets.com/halloween/coconutshy.phtml']").attr("href", COCONUT_SHY_DIRECT_LINK_NO_FLASH);
    $("a[href='https://www.neopets.com/worlds/geraptiku/tomb.phtml']").attr("href", GERAPTIKUS_TOMB_FINAL_URL);
    $("a[href='http://ncmall.neopets.com/mall/shop.phtml?page=giveaway']").attr("href", EXPELLIBOX_DIRECT_LINK_NO_FLASH);
    $("a[href='https://ncmall.neopets.com/mall/shop.phtml?page=giveaway']").attr("href", EXPELLIBOX_DIRECT_LINK_NO_FLASH);
    $("a[href='https://www.neopets.com/community/']").attr("href", DAILY_PUZZLE_SOLUTION);
    $("a[href='https://www.neopets.com/halloween/strtest/index.phtml']").attr("href", TEST_YOUR_STRENGTH_NO_FLASH);
    $("a[href='https://www.neopets.com/halloween/bagatelle.phtml']").attr("href", BAGATELLE_NO_FLASH);
    $("a[href='https://www.neopets.com/halloween/corkgun.phtml']").attr("href", CORKGUN_NO_FLASH)
    $("a[href='https://www.neopets.com/lab.phtml']").attr("href", SECRET_LAB)
    $("a[href='https://www.neopets.com/moon/meteor.phtml']").attr("href", METEOR)
    $("a[href='https://www.neopets.com/pirates/foodclub.phtml?type=bet']").attr("href", FOOD_CLUB_BETS)
    $("a[href='https://www.neopets.com/pirates/buriedtreasure/index.phtml']").attr("href", BURIED_TREASURE)
    $("a[href='https://www.neopets.com/island/fight_training.phtml']").attr("href", SECRET_NINJA_TRAINING_SCHOOL_STATUS)
    $("a[href='https://www.neopets.com/pirates/academy.phtml']").attr("href", SWASHBUCKLING_ACADEMY_STATUS)
    $("a[href='https://www.neopets.com/island/training.phtml']").attr("href", MYSTERY_ISLAND_TRAINING_SCHOOL_STATUS)
}