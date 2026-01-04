// ==UserScript==
// @name         Farside redirect
// @version      1.0
// @description  Redirects twitter, reddit, youtube, medium, instagram to a proven-working open-source third-party frontend counterpart. Use the menu to enable/disable for specific sites
// @match        http://*/*
// @include      *
// @license      MIT
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        unsafeWindow
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM.registerMenuCommand
// @run-at       document-start
// @namespace https://greasyfork.org/users/288098
// @downloadURL https://update.greasyfork.org/scripts/441742/Farside%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/441742/Farside%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let preferences = {}
    preferences.sites = {
        all: true,
        twitter: true,
        reddit: true,
        youtube: true,
        medium: true,
        instagram: true,
    }
    preferences.init = async function (){
        const defaultPreferences = preferences.sites;
        let loadedPreferences = await preferences.load();
        if (Object.keys(preferences.sites).length != Object.keys(defaultPreferences).length){
            preferences.sites = defaultPreferences;
            await preferences.save(preferences.sites);
        }
        if (!loadedPreferences){
            await preferences.save(preferences.sites);
        }
    }
    preferences.save = async function (){
        let newPreferences = JSON.stringify(preferences.sites);
        let saved = await GM.setValue("farsidePreferences", newPreferences);
        return saved;
    }
    preferences.load = async function (){
        let fetchedPreferences = await GM.getValue("farsidePreferences");
        if (!fetchedPreferences){return false}
        preferences.sites = JSON.parse(fetchedPreferences);
        return preferences.sites;
    }
    preferences.toggle = function (site){
        preferences.sites[site] = !preferences.sites[site];
    }
    async function registerMenuItems(){
        for (let site in preferences.sites) {
           // console.log(`${site}: ${preferences.sites[site]}`);
            GM.registerMenuCommand(`${site}: ${preferences.sites[site] ? "enabled" : "disabled"}`, async () => {
                preferences.toggle(site);
                await preferences.save();
                unsafeWindow.location.reload();
            });
        }
    }

    function replaceUrl(url, regex, newDomain) {
        return url.replace(regex, `$1://${newDomain}/$3`);
    }

    function getDomain(url) {
        if (url) {
            return url.replace(/https?:\/\/([^\/]*).*/, "$1");
        } else {
            return null;
        }
    }

    function redirect(originalUrl) {


        let farsideInstances = {
            nitter: "farside.link/nitter",
            teddit: "farside.link/teddit",
            invidious: "farside.link/invidious",
            scribe: "farside.link/scribe",
            bibliogram: "farside.link/bibliogram",
        };

        const originalDomain = getDomain(originalUrl);
        const twitterRegex = preferences.sites.twitter ? /(https?):\/\/(twitter.com)\/(.*)/ : /tHisShoUldNeverMatch/;
        const redditRegex = preferences.sites.reddit ? /(https?):\/\/(reddit.com|www.reddit.com|old.reddit.com|np.reddit.com|new.reddit.com|amp.reddit.com)\/(.*)/ : /tHisShoUldNeverMatch/;
        const youtubeRegex = preferences.sites.youtube ? /(https?):\/\/(youtube.com|m.youtube.com|www.youtube.com|youtu.be)\/(.*)/ : /tHisShoUldNeverMatch/;
        const mediumRegex = preferences.sites.medium ? /https?:\/\/(?:.*\.)*(?<!link\.)medium\.com(\/.*)?$/ : /tHisShoUldNeverMatch/;
        const instagramPostRegex = preferences.sites.instagram ? /https?:\/\/(www\.)?(instagram.com|instagr.am)\/.*(p|tv)\/.*/ : /tHisShoUldNeverMatch/;
        const instagramRegex = preferences.sites.instagram ? /https?:\/\/(www\.)?(instagram.com|instagr.am)\/.*/ : /tHisShoUldNeverMatch/;

        try {
            // Twitter
            if (twitterRegex.test(originalUrl)) {
                const newUrl = replaceUrl(
                    originalUrl,
                    twitterRegex,
                    farsideInstances.nitter
                );
                return {
                    redirectUrl: newUrl
                };
            }

            // Reddit
            if (redditRegex.test(originalUrl)) {
                const newUrl = replaceUrl(
                    originalUrl,
                    redditRegex,
                    farsideInstances.teddit
                );
                return {
                    redirectUrl: newUrl
                };
            }

            // YouTube
            if (youtubeRegex.test(originalUrl)) {
                const newUrl = replaceUrl(
                    originalUrl,
                    youtubeRegex,
                    farsideInstances.invidious
                );
                return {
                    redirectUrl: newUrl
                };
            }

            // Medium
            if (mediumRegex.test(originalUrl)) {
                const newUrl = originalUrl.replace(
                    mediumRegex,
                    `https://${farsideInstances.scribe}$1`
                );
                return {
                    redirectUrl: newUrl
                };
            }
            // Instagram
            if (instagramPostRegex.test(originalUrl)) {
                const newUrl = originalUrl.replace(
                    /https?:\/\/((www\.)?(instagram.com|instagr.am)(\/accounts\/login\/\?next=)?)/,
                    `https://${farsideInstances.bibliogram}`
                );
                return {
                    redirectUrl: newUrl
                };
            }

            if (instagramRegex.test(originalUrl)) {
                const newUrl = originalUrl.replace(
                    /https?:\/\/((www\.)?(instagram.com|instagr.am))/,
                    `https://${farsideInstances.bibliogram}/u`
                );
                return {
                    redirectUrl: newUrl
                };
            }
            else {return false}
        }
        catch(e){
            console.log(e);
        }
    }


    async function start(){
        await preferences.init();
        registerMenuItems();
        if (preferences.sites.all === false){return}
        const currentUrl = unsafeWindow.location.href;
        const redirectLocation = redirect(currentUrl);
        if (redirectLocation){
            unsafeWindow.location = redirectLocation.redirectUrl;
        }
    }

    start();

    // This script was modified from the original extension at https://addons.mozilla.org/en-US/firefox/addon/farside/
    // Reason for porting: I want to be able to disable it for specific sites at will.
    /*
browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {
    urls: [
      ...twitterUrls,
      ...redditUrls,
      ...youtubeUrls,
      ...mediumUrls,
      ...instagramUrls,
    ],
  },
  ["blocking"]
);
*/

})();