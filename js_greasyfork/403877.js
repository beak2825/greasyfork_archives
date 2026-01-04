// ==UserScript==
// @name        Subreddit filter
// @namespace   RedditPopFilter
// @version     0.0.9
// @license     Apache 2.0
// @description Filter the reddit popular page of terrible subreddits
// @author      zachmu
// @include     https://*.reddit.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/403877/Subreddit%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/403877/Subreddit%20filter.meta.js
// ==/UserScript==

var filterSub = [
    "/r/PoliticalHumor/",
    "/r/MurderedByWords/",
    "/r/ENLIGHTENEDCENTRISM/",
    "/r/SelfAwarewolves/",
    "/r/Overwatch/",
    "/r/TopMindsOfReddit/",
    "/r/ShitPostCrusaders/",
    "/r/badwomensanatomy/",
    "/r/The_Mueller/",
    "/r/IncelTears/",
    "/r/trashy/",
    "/r/JusticePorn/",
    "/r/JusticeServed/",
    "/r/thatHappened/",
    "/r/vaxxhappened/",
    "/r/Instagramreality/",
    "/r/gatekeeping/",
    "/r/KidsAreFuckingStupid/",
    "/r/fuckthesepeople/",
    "/r/iamatotalpieceofshit/",
    "/r/iamverysmart/",
    "/r/iamverybadass/",
    "/r/ihavesex/",
    "/r/EntitledBitch/",
    "/r/insanepeoplefacebook/",
    "/r/insanepeoplequora/",
    "/r/insaneparents/",
    "/r/Cringetopia/",
    "/r/Nicegirls/",
    "/r/niceguys/",
    "/r/justneckbeardthings/",
    "/r/4PanelCringe/",
    "/r/sadcringe/",
    "/r/cringe/",
    "/r/quityourbullshit/",
    "/r/entitledparents/",
    "/r/creepyPMs/",
    "/r/rareinsults/",
    "/r/AteTheOnion/",
    "/r/creepyasterisks/",
    "/r/TheRightCantMeme/",
    "/r/imveryedgy/",
    "/r/notliketheothergirls/",
    "/r/BlackPeopleTwitter/",
    "/r/TwoXChromosomes/",
    "/r/MaliciousCompliance/",
    "/r/NotHowGirlsWork/",
    "/r/ToiletPaperUSA/",
    "/r/Gamingcirclejerk/",
    "/r/PewdiepieSubmissions/",
    "/r/menwritingwomen/",
    "/r/politics/",
    "/r/worldpolitics/",
    "/r/Trumpgret/",
    "/r/WhitePeopleTwitter/",
    "/r/facepalm/",
    "/r/FragileWhiteRedditor/",
    "/r/therewasanattempt/",
    "/r/Bad_Cop_No_Donut/",
    "/r/Whatcouldgowrong/",
    "/r/holdmyfries/",
    "/r/awfuleverything/",
    "/r/NoahGetTheBoat/",
    "/r/lgbt/",
    "/r/bi_irl/",
    "/r/LeopardsAteMyFace/",
    "/r/PublicFreakout/",
    "/r/ActualPublicFreakouts/",
];

function filter() {
    var elements = document.querySelectorAll("a[data-click-id=subreddit]")
    elements.forEach(function(a, i) {
        if (filterSub.indexOf(a.attributes.href.value) >= 0) {
            a.closest("div.scrollerItem").style.display = "none"
        }
    })
}

var mutationObserver = new MutationObserver(function(mutations) {
    filter();
});

mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
});

filter();
