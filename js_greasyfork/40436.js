// ==UserScript==
// @name         MyShowsLinks
// @namespace    http://alamote.pp.ua/
// @version      0.3.0
// @author       AlaMote
// @description  Быстрые ссылки на сериалы
// @icon         http://alamote.pp.ua/staff/alamote-logo.png
// @include      https://myshows.me/*
// @downloadURL https://update.greasyfork.org/scripts/40436/MyShowsLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/40436/MyShowsLinks.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    const links = [
        {title: "Silicon Valley", link: "http://rezka.ag/series/comedy/2040-kremnievaya-dolina-2014.html"},
        {title: "Gotham", link: "http://rezka.ag/series/fiction/2089-gotem-2014.html"},
        {title: "Peaky Blinders", link: "http://rezka.ag/series/drama/1929-ostrye-kozyrki-2013.html"},
        {title: "The Blacklist", link: "http://rezka.ag/series/thriller/1967-chernyy-spisok-2013.html"},
        {title: "The Blacklist: Redemption", link: "http://rezka.ag/series/thriller/23632-chernyy-spisok-iskuplenie.html"},
        {title: "DC's Legends of Tomorrow", link: "http://rezka.ag/series/fiction/11465-legendy-zavtrashnego-dnya-2016.html"},
        {title: "The Last Man on Earth", link: "http://rezka.ag/series/comedy/7882-posledniy-chelovek-na-zemle-2015.html"},
        {title: "iZombie", link: "http://rezka.ag/series/horror/7971-ya-zombi-2015.html"},
        {title: "Orange Is the New Black", link: "http://rezka.ag/series/drama/1924-oranzhevyy-hit-sezona.html"},
        {title: "Arrow", link: "http://rezka.ag/series/fiction/153-strela-2012.html"},
        {title: "Smallville", link: "http://rezka.ag/series/melodrama/1766-tayny-smolvilya.html"},
        {title: "Brooklyn Nine-Nine", link: "http://rezka.ag/series/comedy/1958-bruklin-9-9-2013.html"},
        {title: "Fear the Walking Dead", link: "http://rezka.ag/series/horror/10831-boytes-hodyachih-mertvecov-2015.html"},
        {title: "Game of Thrones", link: "http://rezka.ag/series/fantasy/45-igra-prestolov-2011.html"},
        {title: "New Girl", link: "http://rezka.ag/series/comedy/1825-novenkaya.html"},
        {title: "Supergirl", link: "http://rezka.ag/series/action/11110-supergerl-2015.html"},
        {title: "The Big Bang Theory", link: "http://rezka.ag/series/comedy/1154-teoriya-bolshogo-vzryva-2007.html"},
        {title: "The Flash", link: "http://rezka.ag/series/fiction/2090-flesh-2014.html"},
        {title: "Vikings", link: "http://rezka.ag/series/drama/71-vikingi-2013.html"},
        {title: "You're the Worst", link: "http://rezka.ag/series/comedy/1990-ty-voploschenie-poroka-2014.html"},
        {title: "Mr. Robot", link: "http://rezka.ag/series/thriller/9364-mister-robot-2015.html"},
        {title: "The 100", link: "http://rezka.ag/series/fiction/1984-sotnya-2014.html"},
        {title: "Marvel's The Punisher", link: "http://rezka.ag/series/action/26081-karatel-2017.html"},
        {title: "Chernobyl", link: "https://rezka.ag/series/drama/30751-chernobyl-2019.html"},
        {title: "Scream: The TV Series", link: "https://rezka.ag/series/horror/10721-krik-2015.html"},
        {title: "Black Mirror", link: "https://rezka.ag/series/fiction/77-chernoe-zerkalo-2011.html"},
        {title: "Altered Carbon", link: "https://rezka.ag/series/fiction/26879-vidoizmenennyy-uglerod-2018.html"},
        {title: "Harrow", link: "https://rezka.ag/series/drama/27269-doktor-herrou-2018.html"},
        {title: "The Queen's Gambit", link: "https://rezka.ag/series/drama/35793-hod-korolevy-2020.html"},
    ];
    const genericLink = 'https://rezka.ag/search?do=search&subaction=search&q=';

    const getLink = name => {
        return links.find(l => l.title === name)?.link ?? genericLink + name;
    }

    setTimeout(() => {
        let serials = document.getElementsByClassName("Unwatched-showTitle");
        for (let i = 0; i < serials.length; i++) {
            const name = serials.item(i).getElementsByClassName('Unwatched-showTitle-inline').item(0).innerHTML.trim();
            serials.item(i).setAttribute('href', getLink(name));
            serials.item(i).setAttribute('target', '_blank');
        }
    }, 1000);


})();