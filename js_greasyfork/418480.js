// ==UserScript==
// @name         Replace Idle Heroes names with GirlsxBattle2 names
// @namespace    https://greasyfork.org/en/users/715572-patrick-law
// @version      1.22
// @description  Add GxB2 names to IH pages
// @author       Patrick Law
// @include      *finalhive.com/*
// @include      *idleheroes.fandom.com/*
// @include      *idleheroeslist.com/*
// @include      *idleheroes.pro/*
// @include      *reddit.com/r/IdleHeroes/*
// @require      http://code.jquery.com/jquery-3.5.1.js
// @downloadURL https://update.greasyfork.org/scripts/418480/Replace%20Idle%20Heroes%20names%20with%20GirlsxBattle2%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/418480/Replace%20Idle%20Heroes%20names%20with%20GirlsxBattle2%20names.meta.js
// ==/UserScript==

var $ = window.jQuery;
$(document).ready(replaceNames);

/*if (window.location.href.indexOf("finalhive.com/idle-heroes/leaderboards") > -1) {
    var anchors = document.getElementsByClassName("no-underline flex content-center items-stretch justify-start");
    for (var i = 0; i < anchors.length; i++) {
        if (anchors[i].href.indexOf("hero") > -1) {
            anchors[i].href = (anchors[i].href.replace("finalhive.com/idle-heroes/hero/", "cthug.org/i/") + "-os.png")
            .replace("scarlet-queen-halora", "halora")
            .replace("sword-flash-xia", "sfx")
            .replace("belrain", "bel")
            .replace("amuvor", "amu")
            .replace("valkyrie", "valk")
            .replace("das-moge", "das")
            .replace("asmodel", "asmo")
            .replace("king-barton", "kb")
            .replace("cthugha", "cthug")
            .replace("valentino", "val")
            .replace("sigmund", "sig")
            .replace("demon-hunter", "dh")
            .replace("flame-strike", "fs")
            .replace("blood-blade", "bb")
            .replace("faith-blade", "fb")
            .replace("dark-arthindol", "da")
            .replace("heart-watcher", "hw")
            .replace("unimax-3000", "unimax")
            .replace("corpsedemon", "cd")
            .replace("kamath", "kam")
            .replace("iceblink", "ib")
            .replace("starlight", "star")
            .replace("malassa", "mal")
            .replace("sleepless", "sleep")
            .replace("dantalian", "dant")
            .replace("dragon-slayer", "ds")
            .replace("od-01", "od")
            .replace("margaret", "marg")
            .replace("lord-balrog", "lb")
            .replace("eddga", "ed")
            .replace("dominator", "dom")
            .replace("fat-mu", "fatmu")
            .replace("faceless", "face")
            .replace("honor-guard", "hg")
            .replace("bleecker", "blee")
            .replace("deathsworn", "ds")
            .replace("asmo-the-dauntless", "atd")
            .replace("eloise", "elo")
            .replace("star-wing-jahra", "swj");
        }
    }
}*/

function replaceNames() {

    if (window.location.href.indexOf("idle-heroes/leaderboards") > -1) {
        document.querySelector("#app > main > div > section.flex.justify-center.flex-wrap > h1").innerHTML = "For detailed differences, refer to <a href=https://docs.google.com/spreadsheets/d/1Ci8MB9GtJ9Di-BcstwTONzOPjhsOby7_OagaaqnMhrU>docs.google.com/spreadsheets/d/1Ci8MB9GtJ9Di-BcstwTONzOPjhsOby7_OagaaqnMhrU</a>";
        replaceInText(document.querySelector("#app > main > div > section.flex.justify-center.flex-wrap > h3"), /\Pick a Faction\b/, "Pick a House\n(N-Gen Iron Fist, Skye, Von Helsing, Holly, Monica are original to GxB2.)");

        replaceInText(document.querySelector("#app > main > div > section.flex.justify-center.flex-wrap > ul"), /\bShadow\b/, "Ghost (Shadow)");
        replaceInText(document.querySelector("#app > main > div > section.flex.justify-center.flex-wrap > ul"), /\bFortress\b/, "Human (Fortress)");
        replaceInText(document.querySelector("#app > main > div > section.flex.justify-center.flex-wrap > ul"), /\bAbyss\b/, "Monster (Abyss)");
        //replaceInText(document.querySelector("#app > main > div > section.flex.justify-center.flex-wrap > ul"), /\bFairy\b/, "Fairy (Fairy)");
        replaceInText(document.querySelector("#app > main > div > section.flex.justify-center.flex-wrap > ul"), /\bDark\b/, "Demon (Dark)");
        replaceInText(document.querySelector("#app > main > div > section.flex.justify-center.flex-wrap > ul"), /\bLight\b/, "Angel (Light)");

        var selects = document.getElementsByTagName("span");
        for (var i = 0, il = selects.length; i < il; i++) {
            if (selects[i].className.indexOf("overflow-hidden flex content-center items-center text-grey-darkest text-xl float-left h-16 p-2") > -1) {
                selects[i].className = "px-3 py-2 no-underline inline-block text-grey-darkest font-bold";
            }
        }
    }

    var textWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            // Skip whitespace-only nodes
            if (node.nodeValue.trim()) {
                return NodeFilter.FILTER_ACCEPT;
            }

            return NodeFilter.FILTER_SKIP;
        }
    },
            false);
    while (textWalker.nextNode()) {
        var textNode = textWalker.currentNode;
        var oldText = textNode.nodeValue;
        var newText = oldText.replace(/\bDominator\b/, "Succuba (Dominator)");
        newText = newText.replace(/\bLutz\b/, "Dracula (Lutz)");
        newText = newText.replace(/\bBaade\b/, "Wildtress (Baade but worse)");
        newText = newText.replace(/\bAidan\b/, "Giana (Aidan but better)");
        newText = newText.replace(/\bKharma\b/, "Sapphire (Kharma)");
        newText = newText.replace(/\bField\b/, "Wu Kong (Field)");
        newText = newText.replace(/\bHonor Guard\b/, "Chevalir (Honor Guard)");
        newText = newText.replace(/\bIceblink\b/, "Javelin (Iceblink)");
        newText = newText.replace(/\bIceBlink\b/, "Javelin (IceBlink)");
        newText = newText.replace(/\bIce Blink\b/, "Javelin (Ice Blink)");
        newText = newText.replace(/\bBleecker\b/, "Geisha (Bleecker)");
        newText = newText.replace(/\bMirage\b/, "Caitlyn (Mirage)");
        newText = newText.replace(/\bMiki\b/, "Guan Yin (Miki)");
        newText = newText.replace(/\bOD-01\b/, "Librarian (OD-01)");
        newText = newText.replace(/\bMargaret\b/, "Nia (Margaret but worse)");
        newText = newText.replace(/\bQueen\b/, "Nobunaga (Queen)");
        newText = newText.replace(/\bLord Balrog\b/, "Silvia (Lord Balrog)");
        newText = newText.replace(/\bFat Mu\b/, "Toyo (Fat Mu but worse)");
        newText = newText.replace(/\bGusta\b/, "Masamune (Gusta)");
        newText = newText.replace(/\bKarim\b/, "Hexa (Karim)");
        newText = newText.replace(/\bDemon Hunter\b/, "Amazon (Demon Hunter)");
        newText = newText.replace(/\bDragon Slayer\b/, "Bud Elf (Dragon Slayer)");
        newText = newText.replace(/\bFaceless\b/, "Himoto (Faceless)");
        newText = newText.replace(/\bStarlight\b/, "Lavia (Starlight but worse)");
        newText = newText.replace(/\bGroo\b/, "Susan (Groo but worse)");
        newText = newText.replace(/\bMalassa\b/, "Pandaria (Malassa)");
        newText = newText.replace(/\bDark Arthindol\b/, "Amelia (Dark Arthindol but worse)");
        newText = newText.replace(/\bSleepless\b/, "Scythe (Sleepless)");
        newText = newText.replace(/\bGerke\b/, "Angel (Gerke but better)");
        newText = newText.replace(/\bAsmodel\b/, "Gabriel (Asmodel but worse)");
        newText = newText.replace(/\bOrmus\b/, "Blowie (Ormus but much worse)");
        newText = newText.replace(/\bDantalian\b/, "Alice (Dantalian)");
        newText = newText.replace(/\bWalter\b/, "Ennmaya (Walter)");
        newText = newText.replace(/\bRosa\b/, "Nani (Rosa)");
        newText = newText.replace(/\bEmily\b/, "Hottie (Emily but worse)");
        newText = newText.replace(/\bBlood Blade\b/, "Gambler (Blood Blade but worse)");
        newText = newText.replace(/\bEddga\b/, "Aquaris (Eddga but worse)");
        newText = newText.replace(/\bFlame Strike\b/, "Saint (Flame Strike but damage increases when anyone dies instead of burnt)");
        newText = newText.replace(/\bBarea\b/, "Muppet (Barea but worse)");
        newText = newText.replace(/\bDas Moge\b/, "Lucifer (Das Moge)");
        newText = newText.replace(/\bMichelle\b/, "Michael (Michelle)");
        newText = newText.replace(/\bSigmund\b/, "Sonya (Sigmund but worse)");
        newText = newText.replace(/\bSkerei\b/, "Priestess (Skerei)");
        newText = newText.replace(/\bVesa\b/, "Kong Ming (Vesa but worse)");
        newText = newText.replace(/\bCorpsedemon\b/, "Fencer (Corpsedemon but worse)");
        newText = newText.replace(/\bKamath\b/, "Sakura (Kamath)");
        newText = newText.replace(/\bAmuvor\b/, "Wraith (Amuvor but worse)");
        newText = newText.replace(/\bFaith Blade\b/, "Phoenix (Faith Blade but worse)");
        newText = newText.replace(/\bKroos\b/, "Psychic (Kroos)");
        newText = newText.replace(/\bHeart Watcher\b/, "Linky (Heart Watcher)");
        newText = newText.replace(/\bValentino\b/, "CapsuGirl (Valentino)");
        newText = newText.replace(/\bJahra\b/, "Valeera (Jahra but better)");
        newText = newText.replace(/\bKing Barton\b/, "Turin (King Barton but better)");
        newText = newText.replace(/\bMihm\b/, "Esau & Jacob (Mihm)");
        newText = newText.replace(/\bBelrain\b/, "Raphael (Belrain but worse)");
        newText = newText.replace(/\bValkyrie\b/, "Mio (Valkyrie)");
        newText = newText.replace(/\bXia\b/, "Ithil (Xia)");
        newText = newText.replace(/\bCthugha\b/, "Empress Saint (Cthugha but worse)");
        newText = newText.replace(/\bCthuga\b/, "Empress Saint (Cthugha but worse)");
        newText = newText.replace(/\bHorus\b/, "Fenrir (Horus)");
        newText = newText.replace(/\bAspen\b/, "Kratos (Aspen)");
        newText = newText.replace(/\bAida\b/, "Nephilim (Aida)");
        newText = newText.replace(/\bOberon\b/, "Krystal (Oberon but better)");
        newText = newText.replace(/\bPenny\b/, "Rogue (Penny)");
        newText = newText.replace(/\bAmen-Ra\b/, "Izanami (Amen-Ra)");
        newText = newText.replace(/\bAmen-Raa\b/, "Izanami (Amen-Ra)");
        newText = newText.replace(/\bNakia\b/, "Trinity (Nakia but better?)");
        newText = newText.replace(/\bGustin\b/, "Vivian (Gustin but better)"); // 9 2019
        newText = newText.replace(/\bGaruda\b/, "Joan (Garuda but worse)"); // 10 2019
        newText = newText.replace(/\bUniMax 3000\b/, "Mika (UniMax 3000)"); // 11 2019
        newText = newText.replace(/\bUnimax-3000\b/, "Mika (UniMax 3000)"); // 11 2019
        newText = newText.replace(/\bTara\b/, "Uriel (Tara)"); // 12 2019
        newText = newText.replace(/\bCarrie\b/, "Apate (Carrie)"); // 1 2020
        newText = newText.replace(/\bElyvia\b/, "Vera (Elyvia)"); // 2 2020
        newText = newText.replace(/\bDelacium\b/, "Estel (Delacium)"); // 3 2020
        newText = newText.replace(/\bIthaqua\b/, "Blair (Ithaqua)"); // 4 2020
        newText = newText.replace(/\bSherlock\b/, "Teresa (Sherlock)"); // 5 2020
        newText = newText.replace(/\bDrake\b/, "Frexie (Drake)"); // 6 2020
        newText = newText.replace(/\bRussell\b/, "Angelica (Russell)"); // 6 2020
        newText = newText.replace(/\bRogan\b/, "Kassy (Rogan)"); // 7 2020
        newText = newText.replace(/\bIgnis\b/, "Ignis"); // 8 2020
        newText = newText.replace(/\bTix\b/, "Diana (Tix)"); // 9 2020
        newText = newText.replace("Sword Flash - Ithil (Xia)", "Sword Flash - Xia"); // 9 2020
        newText = newText.replace("Sword Flash", "Sword Flash"); // 9 2020
        newText = newText.replace(/\bFlora\b/, "Flora"); // 10 20202
        newText = newText.replace(/\bInosuke\b/, "Inosuke"); // 10 2020
        newText = newText.replace(/\bMorax\b/, "Morax"); // 11 2020
        newText = newText.replace("Scarlet Nobunaga (Queen) - Halora", "Scarlet Queen - Halora (Void Nobu)"); // 12 2020
        newText = newText.replace("Scarlet Nobunaga (Queen)", "Scarlet Queen"); // 12 2020
        newText = newText.replace(/\bPhorcys\b/, "Phorcys"); // 12 2020
        newText = newText.replace(/\bTussilago\b/, "Tussilago");
        newText = newText.replace("Gabriel (Asmodel) the Dauntless", "Asmodel the Dauntless (Void Gabriel)");
        newText = newText.replace("Star Wing - Valeera (Jahra but better)", "Star Wing - Jahra (Void Valeera)");
        newText = newText.replace("Fairy Nobunaga (Queen)", "Fairy Queen");
        newText = newText.replace("Fairy Queen - Kong Ming (Vesa but worse)", "Fairy Queen - Kong Ming (Void KM)");
        textNode.nodeValue = newText;
    }
}

function replaceInText(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
        case Node.DOCUMENT_NODE:
            replaceInText(node, pattern, replacement);
            break;
        case Node.ELEMENT_NODE:
            replaceInText(node, pattern, replacement);
            break;
        case Node.TEXT_NODE:
            node.textContent = node.textContent.replace(pattern, replacement);
        }
    }
}
