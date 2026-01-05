// ==UserScript==
// @name         DuckDuckVader
// @namespace    pxgamer
// @version      1.0.0
// @description  Adds a Star Wars theme to DDG.
// @author       pxgamer
// @include      *duckduckgo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20176/DuckDuckVader.user.js
// @updateURL https://update.greasyfork.org/scripts/20176/DuckDuckVader.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';
    // Set dark theme
    const darktheme = false;

    const icons = {
        ddv_icon:       'https://pxstat.us/img/ddg.ico',
        empire:         'https://pximg.xyz/images/a2953610cebead141a45dccbcf9b4a26.png',
        rebellion:      'https://pximg.xyz/images/cbb105c6b990d4377e8caac28f66d3ff.png',
        duckduckvader:  'https://pximg.xyz/images/b5161751e12e8dd67e9ebd32b9c59cb3.png',
        death_star:     'https://pximg.xyz/images/5e17830c92c9d424583562f325e14993.png',
        clone_trooper:  'https://pximg.xyz/images/d0459862f22a4da2783dd2873351adac.png',
        r2d2:           'https://pximg.xyz/images/8cd897d7a3464adb858d547ddec4a54d.png',
        darth_vader:    'https://pximg.xyz/images/c7f81673c184766261c0f77140cf8b0f.png',
        c3po:           'https://pximg.xyz/images/1ebfbf15dac7c30c4c37110e2a7b089f.png',
        yoda:           'https://pximg.xyz/images/684f7e5651bd8b671c1b5b42c656680a.png',
        ls_green:       'https://pximg.xyz/images/dc89a67fd6b7074d00799a36b9e02d5a.png',
        ls_red:         'https://pximg.xyz/images/887f1b0100f57b2f2ac0d9da1f05f9f7.png',
        xwing:          'https://pximg.xyz/images/7f6dfab841f61e9744d74c8e66603146.png',
        leia:           'https://pximg.xyz/images/24c537b1303fb80d4a42d743bdb416de.png',
        boba_fett:      'https://pximg.xyz/images/07a5a5d8b7559d27a50f2313cb8ffbea.png',
        atat:           'https://pximg.xyz/images/041bd728f8bd7ad0be3d0ab1ea784731.png',
        m_falcon:       'https://pximg.xyz/images/d00c8361eacbbe5f82c39f5da482cefa.png',
        chewbacca:      'https://pximg.xyz/images/fbecac70beb699e1f25308a21f96e148.png',
        tie_fighter:    'https://pximg.xyz/images/c3cb241d0f8d48b65542701d8a857d9d.png',
        admiral_ackbar: 'https://pximg.xyz/images/832b2714f14236164cdc2756a930497b.png'
    };

    const quotes = [
        "Judge me by my size, do you?",
        "Do or do not… there is no try.",
        "Fear leads to anger. Anger leads to hate. Hate leads to suffering.",
        "Wars not make one great.",
        "I\'ve got a bad feeling about this",
        "Truly wonderful, the mind of a child is.",
        "Your eyes can deceive you, don\'t trust them.",
        "Who\'s the more foolish, the fool? Or the fool who follows him?",
        "There\'s always a bigger fish",
        "Death is a natural part of life.",
        "I\'m getting too old for this sort of thing.",
        "…there\'s nothing I can do about it right now. It\'s such a long way from here.",
        "You must do what you feel is right, of course.",
        "Don\'t be too proud of this technological terror you\'ve constructed.",
        "I find your lack of faith disturbing",
        "I care.",
        "What good is a reward if you ain\'t around to use it?",
        "Never tell me the odds.",
        "Patience!",
        "Don\'t give in to hate.",
        "Mind what you have learned. Save you it can.",
        "I love you. … I know",
        "May the force be with you.",
        "Twilight is upon me, and soon night must fall. That is the way of things.",
        "Already know you that which you need.",
        "Once you start down the dark path, forever will it dominate your destiny.",
        "Pass on what you have learned.",
        "You will find that many of the truths we cling to depend greatly on our own point of view.",
        "I was wrong.",
        "You cannot escape your destiny.",
        "Your insight serves you well.",
        "I know. Somehow I\'ve always known.",
        "I can save him. I can turn him back to the good side. I have to try.",
        "Indeed, you are powerful…",
        "Search your feelings",
        "Let go of your hate.",
        "Your overconfidence is your weakness",
        "It\'s a trap",
        "Your thoughts betray you.",
        "Don\'t center on your anxieties.",
        "Keep your concentration here and now, where it belongs.",
        "Mind tricks won\'t work on me, only money.",
        "Now, be brave and don\'t look back.",
        "… defiance, I sense in you. Need that, you do not.",
        "Impossible to see, the future is.",
        "Always in motion is the future.",
        "You don\'t want to sell me death sticks. You want to go home and rethink your life.",
        "It seems your patience has paid off.",
        "In time you will learn to trust your feelings. Then you will be invincible.",
        "Do not assume anything. Clear, your mind must be.",
        "To be angry is to be human.",
        "I know I\'m better than this.",
        "We have a job to do.",
        "Much to learn, you still have.",
        "Twice the pride, double the fall.",
        "Rise.",
        "I must know the truth.",
        "Your arrogance blinds you",
        "The ability to speak does not make you intelligent.",
        "Concentrate on the moment.",
        "Feel, don\'t think",
        "Trust your instincts",
        "Son, my place is here, my future is here. It is time for you to let go.",
        "Your focus determines your reality.",
        "You will know when you are calm, at peace, passive.",
        "Clear your mind of questions.",
        "I don\'t believe it… … That is why you fail.",
        "Attachment leads to jealousy. The shadow of greed, that is.",
        "Luminous beings are we…",
        "Thank the maker.",
        "You know better than to trust a strange computer.",
        "Look, good against remotes is one thing. Good against the living, that\'s something else.",
        "I\'ll be careful.",
        "The circle is now complete. When I left you, I was but the learner. Now I am the master.",
        "You have hate, you have anger, but you don\'t use them.",
        "Don\'t get cocky.",
        "Yeah, I\'m responsible now, the price you pay for being successful.",
        "Strike me down and I will become more powerful than you can possibly imagine.",
        "What have I done?",
        "You will not take her from me! … Your anger and lust for power have already done that.",
        "Compassion, which I would define as unconditional love, is essential…",
        "Sometimes we must do what is requested of us.",
        "Just relax, concentrate.",
        "I wasn\'t strong enough, but I promise I won\'t fail again.",
        "We live in a real world… come back to it.",
        "Anything is possible",
        "I\'m not afraid to die.",
        "All mentors have a way of seeing more of our faults than we would like. It\'s the only way we grow.",
        "Sometimes there are things no one can fix.",
        "The day we stop believing democracy can work is the day we lose it.",
        "In my experience, there\'s no such thing as luck.",
        "There is much fear that clouds your judgement.",
        "Do what must be done.",
        "Have faith, my love. Everything will soon be set right.",
        "In a dark place we find ourselves… a little more knowledge might light our way.",
        "I want more… and I know I shouldn\'t.",
        "I\'m not afraid … … You will be. You… will… be.",
        "What\'s in there? … Only what you take with you.",
        "I can feel your anger, it gives you focus… makes you stronger",
        "All who gain power are afraid to lose it"
    ];

    // All pages set favicon
    (function() {
        let link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = icons.ddv_icon;
        document.getElementsByTagName('head')[0].appendChild(link);
    }());

    // Global theme settings
    if (darktheme) {
        $("head link[rel='stylesheet']").last().after("<style>.header-wrap, .header-wrap--home { border-top-color: red; }</style>");
    }
    if (!darktheme) {
        $("head link[rel='stylesheet']").last().after("<style>.header-wrap, .header-wrap--home { border-top-color: green; }</style>");
    }

    // For Home
    if (location.href == 'https://duckduckgo.com/' || location.href == 'https://duckduckgo.com/?q=') {
        $('.logo-wrap--home').html('');
        $('.logo-wrap--home').css('background-image', 'url('+icons.duckduckvader+')');
        $('.logo-wrap--home').css('width', '187px');
        $('.logo-wrap--home').css('height', '103px');
        document.title = 'DuckDuckVader';
        if (darktheme) {
            $('body').css('background-color', 'black');
            $('.logo-wrap--home').css('-webkit-filter', 'invert(100%)');
            $('.search__button').css('background-image', 'url('+icons.empire+')');
        }
        else {
            $('.search__button').css('background-image', 'url('+icons.rebellion+')');
        }
        $('.tag-home').html('<span>'+quotes[Math.floor(Math.random()*quotes.length) + 1]+'</span>');
        $('.search__button').val('');
        $('.search__button').css('background-size', 'contain');
    }
    if (location.href.indexOf('https://duckduckgo.com/?q=') > -1) {
        document.title = document.title.replace('DuckDuckGo', 'DuckDuckVader');
        if (darktheme) {
            $('.header__logo-wrap').replaceWith('<a href="/" style="position: absolute; display: inline-block; left: 5px; top: 0px;"><img style="height: 50px; width: 50px; margin-left: 40%;" src="'+icons.tie_fighter+'"/></a>');
            // Future features
            //$("head link[rel='stylesheet']").last().after("<style>body { background-color: black; } div.result__pagenum { color: white; } .result.highlight { background-color: #A9A9A9; } a.result__a, .result__a:visited { color: aqua; } .highlight a.result__a { color: white !important; } a.result__url { color: beige; } a.result__menu { color: red; }</style>");
        }
        else {
            $('.header__logo-wrap').replaceWith('<a href="/" style="position: absolute; display: inline-block; left: 5px; top: 0px;"><img style="height: 50px; width: 50px; margin-left: 40%;" src="'+icons.m_falcon+'"/></a>');
        }
    }
})();
