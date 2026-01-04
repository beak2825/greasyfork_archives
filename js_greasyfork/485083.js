// ==UserScript==
// @name Instagram-Pixwox redirector
// @description	Redirect Instagram to equivalent Pixnoy (formerly Pixwox/Piokok) page
// @version 1.14
// @author honest_joe
// @homepage https://greasyfork.org/users/1249547-honest-joe
// @run-at document-start
// @match https://www.instagram.com/*
// @icon https://www.pixnoy.com/favicon.ico
// @license MIT
// @namespace https://greasyfork.org/users/1249547
// @downloadURL https://update.greasyfork.org/scripts/485083/Instagram-Pixwox%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/485083/Instagram-Pixwox%20redirector.meta.js
// ==/UserScript==

/*
  Note: Add
  www.pixnoy.com##.profile > .as-bar
  www.pixnoy.com##.insight.similar.be-1.l_pre_m
  www.pixnoy.com##div.similar.be-1.l_pre_m:nth-of-type(4)
  www.pixnoy.com##div.as-bar:nth-of-type(7)
  www.pixnoy.com##div.as-bar:nth-of-type(14)
  to adblocker to remove holes and crap in piokok page
*/


// Pixwox translations are crap
//const lang = "de/";
const lang = "";

const debug = false;
if (debug) {
    alert(
        "\nDEBUG INFO" +
        "\nHostname " + window.location.hostname +
        "\nPath " + window.location.pathname +
        "\nSearch " + window.location.search +
        "\nHash " + window.location.hash
    );
}

async function redirectPW() {
    window.stop();
    const normre = /^\/[A-Za-z0-9_.-]+\/?$/;                             // /username/ (or /username)
    const postre = /^\/[A-Za-z0-9_.-]+\/p\/[A-Za-z0-9_.-]+\/?$/;         // /username/p/UufHJFU347/
    const post2re = /^\/p\/[A-Za-z0-9_.-]+\/?$/;                         // /p/UufHJFU347/
    const tvre = /^\/tv\/[A-Za-z0-9_.-]+\/?$/;                           // /tv/UufHJFU347/
    const storiesre = /^\/stories\/[A-Za-z0-9_.-]+\/?$/;                 // /stories/username/
    const stories2re = /^\/stories\/[A-Za-z0-9_.-]+\/[0-9]+\/?$/;        // /stories/username/2345435/
    const reelsre = /^\/[A-Za-z0-9_.-]+\/reels\/?$/;                     // /username/reels/
    const reelpostre = /^\/reel\/[A-Za-z0-9_.-]+\/?$/;                   // /reel/UufHJFU347/
    const reelembed = /^\/reel\/[A-Za-z0-9_.-]+\/embed/;                 // /reel/UufHJFU347/embed
    const reelpost2re = /^\/[A-Za-z0-9_.-]+\/reel\/[A-Za-z0-9_.-]+\/?$/; // /username/reel/UufHJFU347/
    const hashtagre = /^\/explore\/tags\/[A-Za-z0-9_.-]+\/?$/;           // /explore/tags/hashtag/
    const embedre = /^\/p\/[A-Za-z0-9_.-]+\/embed/;                      // /p/UufHJFU347/embed
    const a_normre = /com%2F[A-Za-z0-9_.-]+(%2F)?$/;                     // /username/ or /username
    const a_norm2re = /com%2F[A-Za-z0-9_.-]+%2F%3F.*$/;             // /username/?hl=en
    const a_norm3re = /com%2F[A-Za-z0-9_.-]+%2F&[A-Za-z0-9_]+$/;    // /username+weird param
    const a_storiesre = /com%2Fstories%2F[A-Za-z0-9_.-]+%2F$/;      // with login
    const a_stories2re = /com%2Fstories%2F.*%2F[0-9]+%2F$/;         // direct link to story with login
    const a_reelsre = /com%2F.*%2Freels%2F/;                        // with login
    const a_reel2re = /com%2Freel%2F[A-Za-z0-9_.-]+%2F%3F/;         // with login

    let pathname = window.location.pathname;
    let search = window.location.search;
    let oops = false;

    switch (true) {
        case pathname == "/":
            // Homepage
            if (debug) alert("p=/");
            pathname = "";
            search = "";
            break;
        case normre.test(pathname):
            if (debug) alert("normre");
            pathname = pathname.replace(/^\//, "profile/");
            search = "";
            break;
        case postre.test(pathname):
        case reelpost2re.test(pathname):
            if (debug) alert("post/reelpost2re");
            pathname = pathname.replace(/^\/[A-Za-z0-9_.-]+\/(p|reel)\//, "post/");
            search = "";
            break;
        case post2re.test(pathname):
        case tvre.test(pathname):
        case reelpostre.test(pathname):
            if (debug) alert("post2/tv/reelpostre");
            pathname = pathname.replace(/^\/(p|tv|reel)\//, "post/");
            search = "";
            break;
        case storiesre.test(pathname):
            if (debug) alert("storiesre");
            pathname = pathname.replace(/^\/stories\//, "profile/");
            pathname = pathname.replace(/\/?$/, "/stories/");

            // useless
            //if ( pathname.charAt(pathname.length-1)=="/" ) {
            //    pathname = pathname.replace(/\/?$/, "/stories/");
            //} else {
            //    pathname = pathname + "/stories/";
            //}

            break;
        case stories2re.test(pathname):
            // direct link to story not supported, show stories page
            if (debug) alert("stories2re");
            pathname = pathname.replace(/^\/stories\//, "profile/");
            pathname = pathname.replace(/\/[0-9]+\/?$/, "/stories/");
            break;
        case reelsre.test(pathname):
            if (debug) alert("reelsre");
            pathname = pathname.replace(/^\//, "profile/");
            pathname = pathname.replace(/reels\/?$/, "igtv/");
            break;
        case hashtagre.test(pathname):
            if (debug) alert("hashtagre");
            pathname = pathname.replace(/^\/explore\/tags\//, "tag/");
            search = "";
            break;
        case embedre.test(pathname):
        case reelembed.test(pathname):
            // Insta post embedded in other page
            // do nothing
            oops = true;
            break;
        case pathname.startsWith("/accounts/login/"):
        case pathname.startsWith("/accounts/signup/"):
            // login shown; path useless look in search
            if (debug) alert("/acc");
            pathname = "";
            switch (true) {
                case a_storiesre.test(search):
                    search = search.replace(/\?.*stories%2F/, "profile/");
                    search = search.replace(/%2F$/, "/stories/");
                    break;
                case a_stories2re.test(search):
                    // direct link to story not supported, show stories page
                    search = search.replace(/\?.*stories%2F/, "profile/");
                    search = search.replace(/%2F.*%2F$/, "/stories/");
                    break;
                case a_reelsre.test(search):
                    search = search.replace(/\?.*instagram\.com%2F/, "profile/");
                    search = search.replace(/%2F.*$/, "/igtv/");
                    break;
                case a_reel2re.test(search):
                    search = search.replace(/\?.*instagram\.com%2Freel%2F/, "post/");
                    search = search.replace(/%2F.*$/, "");
                    break;
                case a_normre.test(search):
                case a_norm2re.test(search):
                case a_norm3re.test(search):
                    search = search.replace(/\?.*instagram\.com%2F/, "profile/");
                    search = search.replace(/%2F%3F.*$/, ""); // norm2
                    search = search.replace(/%2F&[A-Za-z0-9_]+$/, ""); // weird param
                    search = search.replace(/%2F$/, "");
                    break;
                default:
                    alert(
                        "redirectPW: acc WTF" +
                        "\nDEBUG INFO" +
                        "\nHostname " + window.location.hostname +
                        "\nPath " + window.location.pathname +
                        "\nSearch " + window.location.search +
                        "\nHash " + window.location.hash
                    );
                    oops = true;
                    break;
                    // TODO: post2
            }
            break;
        default:
            // don't know what to do
            alert(
                "redirectPW: WTF" +
                "\nDEBUG INFO" +
                "\nHostname " + window.location.hostname +
                "\nPath " + window.location.pathname +
                "\nSearch " + window.location.search +
                "\nHash " + window.location.hash
            );
            oops = true;
            break;
    }
    if (!oops) {
        window.location.replace(`https://www.pixnoy.com/${lang}${pathname}${search}`);
    }
}

if (window.location.hostname == "www.instagram.com") redirectPW();