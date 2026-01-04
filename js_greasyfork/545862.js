// ==UserScript==
// @name         British Zed.City Ultra Immersion + Teapot Emoji
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Full British/Cockney immersive Zed.City: 200+ interjections, 🫖 logo, menus, tooltips, blue background, white text
// @match        *://zed.city/*
// @match        *://www.zed.city/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545862/British%20ZedCity%20Ultra%20Immersion%20%2B%20Teapot%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/545862/British%20ZedCity%20Ultra%20Immersion%20%2B%20Teapot%20Emoji.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Word swaps ===
    const customWordSwaps = {
        "Stronghold": "Gaff",
        "Faction": "Gang",
        "Inventory": "Briefcase",
        "Explore": "Mooching",
        "Beer": "Newkie Brown",
        "Vodka": "Glens",
        "Zedbull": "White Lightning"
    };

    // === 200+ British/Cockney interjections ===
    const britishInterjections = [
        "Blimey!","Oi!","Cor blimey!","Guv'nor!","Oi mate!","Blimey guv'nor!","Crikey!","Ta!","By Jove!","Top hole!",
        "Cheerio!","Fancy a cuppa?","Bloody hell!","Gobsmacked!","Codswallop!","Bollocks!","Bugger!","Tosh!","Wotcha!","Luvly jubbly!",
        "Horses' arses!","Jammy sod!","Naff!","Ruddy hell!","Stone the crows!","Bob's your uncle!","Righto!","Sod off!","Gadzooks!","Barmy!",
        "Knackered!","Lorry!","Blighter!","Dodgy!","Faffing about!","Chuffed!","Brolly!","Plonker!","Waffle!","Fiddle-faddle!",
        "Cheeky!","Crumpet!","Pip pip!","Skive!","Gormless!","Miffed!","Shambles!","Hunky-dory!","Dosh!","Nutter!",
        "Twerp!","Grouse!","Beefy!","Bung!","Yonks!","Twit!","Doddle!","Rubbish!","Gob!","Kip!",
        "Bangers!","Pukka!","Chuffed to bits!","Codger!","Dingbat!","Flog!","Jammy!","Lad!","Lush!","Mug!",
        "Nicked!","Owt!","Punter!","Quid!","Scrummy!","Snookered!","Sprog!","Squiffy!","Tickety-boo!","Toshy!",
        "Wazzock!","Yon!","Zonked!","Gander!","Tally-ho!","Whinge!","Woop!","Zounds!","Bellyache!","Plonk!",
        "Barmy!","Daft!","Naff off!","Piffle!","Ruddy!","Sussed!","Cod!","Fiddlesticks!","Balderdash!","Knockout!",
        "Rabble!","Snog!","Tosh!","Budge up!","Cobblers!","Dosh!","Fiddle-dee-dee!","Gobsmacked!","Lolly!","Piff!","Jolly good!","Guv!","Blighter!","Crikey Moses!","By gum!","Gadzooks!","Lushious!","Bunging!","Barmy nancy!","Codswalloping!","Dodgy geezer!","Wotcher!","Cack-handed!","Knacker!","Rumpus!","Higgledy-piggledy!","Jammy git!","Miffed as a lark!","Nobby!","Plonking about!","Rumpy-pumpy!","Skint!","Twaddle!","Bungler!","Faff about!","Toshy tosh!","Wally!","Yonks of fun!","Zany!","Blinding!","Chinwag!","Daft as a brush!","Gob!","Hobnob!","Jammy dodger!","Knock-kneed!","Lumpy!","Mugwump!","Nincompoop!","Piffle-paffle!","Quaint!","Roughshod!","Sodden!","Tick-tock!","Uffish!","Vexed!","Wheedle!","Yabber!","Zig-zag!","Boffin!","Clapped out!","Dodgy blighter!","Fandango!","Guv'nor's orders!","Hogwash!","Jiggery-pokery!","Knees-up!","Ludicrous!","Mumbo-jumbo!","Naffed off!","Old chap!","Poppycock!","Quid pro quo!","Rabble-rouser!","Skedaddle!","Topsy-turvy!","Whopper!","Yokel!","Zippy!"
    ];

    function applyCustomWordSwaps(text) {
        for (const [original, replacement] of Object.entries(customWordSwaps)) {
            const regex = new RegExp(`\\b${original}\\b`, 'gi');
            text = text.replace(regex, match =>
                match[0] === match[0].toUpperCase()
                    ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
                    : replacement
            );
        }
        return text;
    }

    function getBritishInterjection() {
        return britishInterjections[Math.floor(Math.random() * britishInterjections.length)];
    }

    function translateNode(node) {
        if (!node._britishTranslated) {
            let text = applyCustomWordSwaps(node.nodeValue);
            if (Math.random() < 0.25) text += " " + getBritishInterjection();
            node.nodeValue = text;
            node._britishTranslated = true;
        }
    }

    function walkAndTranslate(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (!node.nodeValue.trim()) continue;
            translateNode(node);
        }
    }

    // === Logo replacement with teapot emoji ===
    function replaceLogo() {
        const logo = document.querySelector('img[src*="zed.city"]');
        if (logo && !logo._britishReplaced) {
            logo.style.width = '48px';
            logo.style.height = '48px';
            logo.src = ''; // remove src
            logo.alt = '🫖';
            logo.innerText = '🫖'; // fallback for broken img
            logo._britishReplaced = true;
        }
    }

    // === Red/white/blue UI styling with blue background and white text ===
    function applyUIStyling() {
        document.body.style.fontFamily = 'Georgia, Times, serif';
        document.body.style.backgroundColor = '#0000ff'; // blue background
        document.body.style.color = '#ffffff'; // white text

        // Buttons
        document.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach(btn => {
            btn.style.backgroundColor = '#ff0000'; // red
            btn.style.color = '#ffffff';
            btn.style.borderRadius = '5px';
            btn.title = "Oi! Click me, gov'nor!";
        });

        // Links
        document.querySelectorAll('a').forEach(link => {
            link.style.color = '#ffffff'; // white links
            link.title = "Have a butcher's!";
        });

        // Menus, modals
        document.querySelectorAll('.menu, .modal').forEach(el => {
            el.style.backgroundColor = '#0000ff';
            el.style.border = '2px solid #ff0000';
            el.style.color = '#ffffff';
        });
    }

    // === Initial execution ===
    walkAndTranslate(document.body);
    replaceLogo();
    applyUIStyling();

    // === Observe dynamic content ===
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(n => {
                if (n.nodeType === Node.TEXT_NODE) translateNode(n);
                else if (n.nodeType === Node.ELEMENT_NODE) {
                    walkAndTranslate(n);
                    replaceLogo();
                    applyUIStyling();
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
