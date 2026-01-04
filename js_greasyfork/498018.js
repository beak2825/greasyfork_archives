// ==UserScript==
// @name         [KPX] Reddit Redirect
// @namespace    https://www.reddit.com/
// @version      0.4
// @description  Redirect from old.reddit.com to www.reddit.com
// @author       KPCX
// @match        *://*.reddit.com/r/*
// @match        *://*.reddit.com/message/messages*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498018/%5BKPX%5D%20Reddit%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/498018/%5BKPX%5D%20Reddit%20Redirect.meta.js
// ==/UserScript==

(function () {
    // First function: Redirect old Reddit URLs to new Reddit URLs
    function redirectOldRedditUrls() {
        const currentUrl = window.location.href;

        if (currentUrl.includes('www.reddit.com/r/randnsfw/hot')) {
            window.location.href = currentUrl.replace('www.reddit.com/r/randnsfw/hot', 'old.reddit.com/r/randnsfw/hot');
        }
        else if (currentUrl.includes('www.reddit.com/r/randnsfw/new')) {
            window.location.href = currentUrl.replace('www.reddit.com/r/randnsfw/new', 'old.reddit.com/r/randnsfw/new');
        }
        else if (currentUrl.includes('www.reddit.com/r/randnsfw/top')) {
            window.location.href = currentUrl.replace('www.reddit.com/r/randnsfw/top', 'old.reddit.com/r/randnsfw/top');
        }
        else if (currentUrl.includes('www.reddit.com/r/randnsfw/rising')) {
            window.location.href = currentUrl.replace('www.reddit.com/r/randnsfw/rising', 'old.reddit.com/r/randnsfw/rising');
        }
        else if (!currentUrl.includes('www.reddit.com/message/messages')) {
            window.location.href = currentUrl.replace('old.reddit.com', 'www.reddit.com');
        }
        //else if (!currentUrl.includes('old.reddit.com/r/')) {
        //    window.location.href = currentUrl.replace('old.reddit.com', 'www.reddit.com');
        //}
    }

    // Second function: Redirect specific subreddits to /r/randnsfw/
    function redirectSubreddits() {
        const subredditsToRedirect = [
            "/r/.*chastity.*",
            "/r/.*GayPorn.*",
            "/r/.*hentai.*",
            "/r/.*sissies.*",
            "/r/.*sissy.*",
            "/r/.*FemBoy.*",
            "/r/gay.*",
            "/r/.*GenshinImpact.*",
            "/r/.*bigdick.*",
            "/r/.*futanari.*",
            "/r/.*rule34.*",
            "/r/.*anime.*",
            "/r/.*shemale.*",
            "/r/1200isfineIGUESSugh/",
            "/r/ABDL/",
            "/r/Arknuts/",
            "/r/AskRedditNSFW/",
            "/r/AzurLewd/",
            "/r/BDSMcommunity/",
            "/r/BangaloreGW/",
            "/r/Botchedsurgeries/",
            "/r/CartoonPorn/",
            "/r/CharacterAi_NSFW/",
            "/r/CheatingCaptions/",
            "/r/ChickWithDick/",
            "/r/ChrisChanSonichu/",
            "/r/DadsAndBoys/",
            "/r/DadsGoneWild/",
            "/r/DickPicRequestv2/",
            "/r/DicksOnBabes/",
            "/r/DirtyConfession/",
            "/r/DirtySnapchat/",
            "/r/EdgingTalk/",
            "/r/Femdom/",
            "/r/Feminization/",
            "/r/ForcedFeminization/",
            "/r/FurryPornSubreddit/",
            "/r/Futadomworld/",
            "/r/GWASapphic/",
            "/r/GoneWildAudioGay/",
            "/r/GoneWildTrans/",
            "/r/Hololewd/",
            "/r/HonkaiStarRail34/",
            "/r/Kappachino/",
            "/r/Limitlessrp/",
            "/r/MakeMeSuffer/",
            "/r/MassiveCock/",
            "/r/MedicalGore/",
            "/r/MikeAdriano/",
            "/r/MomSonIncest/",
            "/r/MonsterGirl/",
            "/r/NSFW411/",
            "/r/NSFWgaming/",
            "/r/NTR/",
            "/r/NarcoFootage/",
            "/r/Nootropics/",
            "/r/NuclearRevenge/",
            "/r/OnlyIfShesPackin/",
            "/r/OopsThatsDeadly/",
            "/r/Overwatch_Porn/",
            "/r/PEDs/",
            "/r/Pegging/",
            "/r/Perfectdick/",
            "/r/PokePorn/",
            "/r/RandomActsOfBlowJob/",
            "/r/SauceSharingCommunity/",
            "/r/SexToys/",
            "/r/SissificationProject/",
            "/r/SluttyConfessions/",
            "/r/SluttyConfessionsDesi/",
            "/r/SmallDickGirls/",
            "/r/Teencocks/",
            "/r/Tentai/",
            "/r/ThickDick/",
            "/r/Vaping/",
            "/r/Vindicta/",
            "/r/VlinesAbsAndDick/",
            "/r/Warhammer_Smut/",
            "/r/YoungGuysGoneWild/",
            "/r/alasjuicy/",
            "/r/asiansissification/",
            "/r/beingaDIK/",
            "/r/boypussy/",
            "/r/broslikeus/",
            "/r/bwc/",
            "/r/chickflixxx/",
            "/r/cigars/",
            "/r/dickgirls/",
            "/r/dirtypenpals/",
            "/r/dirtyr4r/",
            "/r/ecchi/",
            "/r/fnafpornrp/",
            "/r/fresh_teendick/",
            "/r/funpiece/",
            "/r/gettingbigger/",
            "/r/gonewildstories/",
            "/r/ladybonersgw/",
            "/r/lewdgames/",
            "/r/monsterdicks/",
            "/r/notgayatall/",
            "/r/penis/",
            "/r/perkydicks/",
            "/r/pets_and_ownwers/",
            "/r/ratemycock/",
            "/r/sex_comics/",
            "/r/sexstories/",
            "/r/sexualidade/",
            "/r/softies/",
            "/r/straightturnedgay/",
            "/r/swingersr4r/",
            "/r/teendicks_/",
            "/r/theadamfriedlandshow/",
            "/r/thighdeology/",
            "/r/traps/",
            "/r/tscum/",
            "/r/vaporents/",
            "/r/worldpolitics/",
            "/r/AskGayMen/",
            "/r/MomNTR/",
            "/r/AskRedditAfterDark/",
            "/r/nsfwcyoa/",
            "/r/masturbation/",
            "/r/phr4r/",
            "/r/CelebEconomy/",
            "/r/BDSMpersonals/",
            "/r/MorbidReality/",
            "/r/twinks/",
            "/r/AVN_Lovers/",
            "/r/accidents/",
            "/r/gentlefemdom/",
            "/r/NSFW_Caption/",
            "/r/SuperModelIndia/",
            "/r/CelebsBR/",
            "/r/doujinshi/",
            "/r/painal/",
            "/r/sdnsfw/",
            "/r/transporn/",
            "/r/cuckoldstories2/",
            "/r/ChatGPTNSFW/",
            "/r/BallBusting/",
            "/r/GOONED/",
            "/r/EroticHypnosis/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/",
            "/r/fillerreplaceme/"
        ];

        const currentPath = window.location.pathname;

        // Extract current subreddit and ensure correct formatting
        const currentSubredditMatch = currentPath.match(/^\/r\/[^\/]+\/?/);
        const currentSubreddit = currentSubredditMatch ? currentSubredditMatch[0] : '';

        // Extract current category
        const currentCategoryMatch = currentPath.match(/^\/r\/[^\/]+\/(hot|new|top|rising)?\/?/);
        const currentCategory = currentCategoryMatch ? currentCategoryMatch[1] : '';

        const subredditRegex = new RegExp(subredditsToRedirect.join('|') + '\/?$', 'i');

        if (subredditRegex.test(currentSubreddit)) {
            let targetUrl = `https://www.reddit.com/r/randnsfw/`;

            if (['hot', 'new', 'top', 'rising'].includes(currentCategory)) {
                targetUrl += `${currentCategory}/`;
            }

            window.location.href = targetUrl;
        }
    }

    redirectOldRedditUrls();
    redirectSubreddits();
})();