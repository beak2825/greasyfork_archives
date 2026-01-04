// ==UserScript==
// @name         Remove Youtube Propaganda
// @namespace    https://gitlab.com/Dwyriel
// @version      1.11.1
// @description  Tries to remove any banner and other dismissibles that are plain annoying (or straight up propaganda).
// @author       Dwyriel
// @license      MIT
// @match        *://*.youtube.com/*
// @grant        GM.registerMenuCommand
// @homepageURL  https://gitlab.com/Dwyriel/Greasyfork-Scripts
// @downloadURL https://update.greasyfork.org/scripts/462455/Remove%20Youtube%20Propaganda.user.js
// @updateURL https://update.greasyfork.org/scripts/462455/Remove%20Youtube%20Propaganda.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // #region Variables and constants
    const userscriptName = "[Remove Youtube Propaganda]";
    const userscriptPolicyName = "RYP_Policy";
    let mutationObs;
    const idsToRemove = [
        "big-yoodle", //main page banner
        "clarify-box" //video page "clarification"
    ];
    const elementsToRemove = [
        "ytm-statement-banner-renderer", "ytd-statement-banner-renderer", //main page banner
        "ytm-clarification-renderer", "ytd-clarification-renderer", //search and video page "clarification" (specific topics only)
        "ytm-info-panel-container-renderer", "ytd-info-panel-container-renderer", //search page "clarification" (specific topics only)
        "ytd-info-panel-content-renderer", //Extra info/propaganda about the channel, seems to be desktop only
        "ytm-brand-video-singleton-renderer", "ytd-brand-video-singleton-renderer", //a very specific video youtube is promoting in the main page (for reasons)
        "yt-mealbar-promo-renderer" //youtube premium/ad-free popup, afaik there's no mobile version
    ];
    const elementsByClassToRemove = [];
    // #endregion

    // #region Utility Functions
    const mutationObsStart = () => { mutationObs.observe(document.body, { attributes: true, childList: true, subtree: true }); };
    const yesNoString = (bool) => { return bool ? "Yes" : "No"; };
    // #endregion

    // #region Optional features
    class OptionalFeature {
        key = "";
        menuString = "";
        method = () => { };
        isEnabled = false;

        constructor(key, menuString, method, defaultStartingValue) {
            this.key = key;
            this.menuString = menuString;
            this.method = method;
            this.isEnabled = defaultStartingValue;
        }

        action() {
            mutationObs.disconnect();
            this.isEnabled = !this.isEnabled;
            localStorage.setItem(this.key, this.isEnabled);
            if (this.isEnabled)
                this.method(); //todo fix
            GM.registerMenuCommand(this.menuString + yesNoString(this.isEnabled), this.action.bind(this), { id: this.key, autoClose: false });
            mutationObsStart();
        }
    }
    let optinalFeatures = [];
    // #region ReplaceYoutubeLogo
    const youtubeMobileLogoReplacement = `<c3-icon class="mobile-topbar-logo full-logo" fill-icon="false" id="home-icon"><span class="yt-icon-shape yt-spec-icon-shape"><div style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg xmlns="http://www.w3.org/2000/svg" id="yt-ringo2-svg_yt2" width="93" height="20" viewBox="0 0 93 20" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><g><path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"></path><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"></path></g><g id="youtube-paths_yt2"><path d="M37.1384 18.8999V13.4399L40.6084 2.09994H38.0184L36.6984 7.24994C36.3984 8.42994 36.1284 9.65994 35.9284 10.7999H35.7684C35.6584 9.79994 35.3384 8.48994 35.0184 7.22994L33.7384 2.09994H31.1484L34.5684 13.4399V18.8999H37.1384Z"></path><path d="M44.1003 6.29994C41.0703 6.29994 40.0303 8.04994 40.0303 11.8199V13.6099C40.0303 16.9899 40.6803 19.1099 44.0403 19.1099C47.3503 19.1099 48.0603 17.0899 48.0603 13.6099V11.8199C48.0603 8.44994 47.3803 6.29994 44.1003 6.29994ZM45.3903 14.7199C45.3903 16.3599 45.1003 17.3899 44.0503 17.3899C43.0203 17.3899 42.7303 16.3499 42.7303 14.7199V10.6799C42.7303 9.27994 42.9303 8.02994 44.0503 8.02994C45.2303 8.02994 45.3903 9.34994 45.3903 10.6799V14.7199Z"></path><path d="M52.2713 19.0899C53.7313 19.0899 54.6413 18.4799 55.3913 17.3799H55.5013L55.6113 18.8999H57.6012V6.53994H54.9613V16.4699C54.6812 16.9599 54.0312 17.3199 53.4212 17.3199C52.6512 17.3199 52.4113 16.7099 52.4113 15.6899V6.53994H49.7812V15.8099C49.7812 17.8199 50.3613 19.0899 52.2713 19.0899Z"></path><path d="M62.8261 18.8999V4.14994H65.8661V2.09994H57.1761V4.14994H60.2161V18.8999H62.8261Z"></path><path d="M67.8728 19.0899C69.3328 19.0899 70.2428 18.4799 70.9928 17.3799H71.1028L71.2128 18.8999H73.2028V6.53994H70.5628V16.4699C70.2828 16.9599 69.6328 17.3199 69.0228 17.3199C68.2528 17.3199 68.0128 16.7099 68.0128 15.6899V6.53994H65.3828V15.8099C65.3828 17.8199 65.9628 19.0899 67.8728 19.0899Z"></path><path d="M80.6744 6.26994C79.3944 6.26994 78.4744 6.82994 77.8644 7.73994H77.7344C77.8144 6.53994 77.8744 5.51994 77.8744 4.70994V1.43994H75.3244L75.3144 12.1799L75.3244 18.8999H77.5444L77.7344 17.6999H77.8044C78.3944 18.5099 79.3044 19.0199 80.5144 19.0199C82.5244 19.0199 83.3844 17.2899 83.3844 13.6099V11.6999C83.3844 8.25994 82.9944 6.26994 80.6744 6.26994ZM80.7644 13.6099C80.7644 15.9099 80.4244 17.2799 79.3544 17.2799C78.8544 17.2799 78.1644 17.0399 77.8544 16.5899V9.23994C78.1244 8.53994 78.7244 8.02994 79.3944 8.02994C80.4744 8.02994 80.7644 9.33994 80.7644 11.7299V13.6099Z"></path><path d="M92.6517 11.4999C92.6517 8.51994 92.3517 6.30994 88.9217 6.30994C85.6917 6.30994 84.9717 8.45994 84.9717 11.6199V13.7899C84.9717 16.8699 85.6317 19.1099 88.8417 19.1099C91.3817 19.1099 92.6917 17.8399 92.5417 15.3799L90.2917 15.2599C90.2617 16.7799 89.9117 17.3999 88.9017 17.3999C87.6317 17.3999 87.5717 16.1899 87.5717 14.3899V13.5499H92.6517V11.4999ZM88.8617 7.96994C90.0817 7.96994 90.1717 9.11994 90.1717 11.0699V12.0799H87.5717V11.0699C87.5717 9.13994 87.6517 7.96994 88.8617 7.96994Z"></path></g></svg></div></span></c3-icon>`;
    const replaceYoutubeLogoDesktop = (youtubeLogo) => {
        let isEventLogoActive = youtubeLogo.getAttribute("hidden") === null;
        if (!isEventLogoActive)
            return;
        youtubeLogo.parentElement.getElementsByTagName("div")[0]?.removeAttribute("hidden");
        youtubeLogo.parentElement.setAttribute("title", "Youtube");
        youtubeLogo.setAttribute("hidden", "");
        console.log(`${userscriptName} (Desktop) Replaced youtube logo with default one`);
    };
    const replaceYoutubeLogoMobile = (youtubeLogo) => {
        let parentElement = youtubeLogo.parentElement;
        try {
            if (trustedTypes) {
                const trustedTypesPolice = trustedTypes.createPolicy(userscriptPolicyName, { createHTML: (string) => string });
                parentElement.innerHTML = trustedTypesPolice.createHTML(youtubeMobileLogoReplacement);
            } else {
                parentElement.innerHTML = youtubeMobileLogoReplacement;
            }
            parentElement.setAttribute("key", "logo");
            console.log(`${userscriptName} (Mobile) Replaced youtube logo with default one`);
        } catch (err) {
            console.error(`${userscriptName} (Mobile) Couldn't replace youtube logo`);
            console.error(err);
        }
    };
    const ReplaceYoutubeLogo = new OptionalFeature(
        "RYP_replace_logo", //key
        "Replace event logo: ", //menu string
        () => { //method
            //context: usually returns an array with two elements, second one was always hidden, no idea what it's used for.
            let youtubeLogo = document.getElementsByTagName("ytd-yoodle-renderer")[0];
            if (youtubeLogo) {
                replaceYoutubeLogoDesktop(youtubeLogo);
                return;
            }
            youtubeLogo = document.getElementsByTagName("ytm-logo-entity")[0];
            if (youtubeLogo)
                replaceYoutubeLogoMobile(youtubeLogo);
        },
        false // default starting value
    );
    optinalFeatures.push(ReplaceYoutubeLogo);
    // #endregion 
    // #region RemoveShorts
    const RemoveShorts = new OptionalFeature(
        "RYP_remove_shorts", //key
        "Remove shorts section: ", //menu string
        () => { //method
            document.querySelectorAll("ytd-rich-shelf-renderer[is-shorts]:not(.ryp-hidden)").forEach((ele) => {
                let sect = ele.closest("ytd-rich-section-renderer");
                if (sect == null)
                    return;
                console.log("Hidding element: ", sect);
                ele.classList.add("ryp-hidden");
                sect.style.display = "none";
            });
            document.querySelectorAll("ytm-rich-section-renderer:not(.ryp-hidden) h2[class*='shelf-header-layout'] span").forEach((ele) => {
                if (ele.innerText == "Shorts") { //note: English only, couldn't find any other way to properly identify the "Shorts" mobile section without hardcoding the search
                    let sect = ele.closest("ytm-rich-section-renderer");
                    if (sect == null)
                        return;
                    console.log("Hidding element: ", sect);
                    sect.classList.add("ryp-hidden");
                    sect.style.display = "none";
                }
            });
        },
        false //default starting value
    );
    optinalFeatures.push(RemoveShorts);
    // #endregion
    // #region RemoveForYou
    const RemoveForYou = new OptionalFeature(
        "RYP_remove_for_you", //key
        "Remove \"for you\" channel section: ", //menu string
        () => { //method
            //note: English only, couldn't find any other way to properly identify the "For you" section without hardcoding the search
            if (!window.location.pathname.includes("/@"))
                return;
            let sectionRenderer = document.getElementsByTagName("ytd-section-list-renderer"); //search page also uses it, and all tags still exist in the html even when not being used (they're just hidden)
            if (sectionRenderer.length > 0)
                for (let ytdSectRenderer of sectionRenderer) {
                    let sections = ytdSectRenderer.querySelector(`div[id="contents"]`).childNodes;
                    for (let sect of sections) {
                        let spans = sect.querySelectorAll("span");
                        for (let span of spans)
                            if (RegExp("^For You").test(span.innerText)) {
                                sect.remove();
                                console.log(`${userscriptName} Removed "For You" section`);
                                return;
                            }
                    }
                }
            else {
                sectionRenderer = document.getElementsByTagName("ytm-item-section-renderer");
                for (let ytmSectRenderer of sectionRenderer) {
                    let sections = ytmSectRenderer.querySelectorAll("ytm-horizontal-card-list-renderer");
                    for (let sect of sections) {
                        let spans = sect.querySelectorAll("span");
                        for (let span of spans)
                            if (RegExp("^For You").test(span.innerText)) {
                                if (sectionRenderer.length == 1)
                                    ytmSectRenderer.remove();
                                else
                                    sect.remove();
                                console.log(`${userscriptName} Removed "For You" section`);
                                return;
                            }
                    }
                }
            }
        },
        false //default starting value
    );
    optinalFeatures.push(RemoveForYou);
    // #endregion
    // #region RemovePeopleMentioned
    const RemovePeopleMentioned = new OptionalFeature(
        "RYP_remove_people_mentioned", //key
        "Remove people mentioned: ", //menu string
        () => { //method
            let elements = document.getElementsByTagName("yt-video-attributes-section-view-model"); //same for both desktop & mobile, seems to only be used to show the "People Mentioned" section
            for (let element of elements)
                element.remove();
        },
        false
    );
    optinalFeatures.push(RemovePeopleMentioned);
    // #endregion
    // #region MobileRemoveCommunityPostsFromHomepage
    const RemoveCommPostsHomepage = new OptionalFeature(
        "RYP_remove_community_post_homepage", //key
        "Remove Community Post Homepage: ", //menu string
        () => { //method
            let posts = document.getElementsByTagName("ytm-backstage-post-thread-renderer");
            for (let post of posts)
                post.closest("ytm-rich-section-renderer").remove();
        },
        false
    );
    optinalFeatures.push(RemoveCommPostsHomepage);
    // #endregion
    // #endregion

    const callback = () => {
        mutationObs.disconnect();
        for (let id of idsToRemove) {
            let element = document.getElementById(id);
            if (element) {
                element.remove();
                console.log(`${userscriptName} Removed element of id: ${id}`);
            }
        }
        for (let elementName of elementsToRemove) {
            let elements = document.getElementsByTagName(elementName);
            for (let element of elements) {
                element.remove();
                console.log(`${userscriptName} Removed element with tag name: ${elementName}`);
            }
        }
        for (let className of elementsByClassToRemove) {
            let elements = document.getElementsByClassName(className);
            for (let element of elements) {
                element.remove();
                console.log(`${userscriptName} Removed element with class: ${className}`);
            }
        }
        for (let optinalFeature of optinalFeatures)
            if (optinalFeature.isEnabled)
                optinalFeature.method();
        document.querySelectorAll("[has-video-summary]").forEach(element => element.parentElement.remove()); //removes AI generated video summaries
        mutationObsStart();
    };

    /* Script start */
    mutationObs = new MutationObserver(callback);
    try {
        for (let optinalFeature of optinalFeatures) {
            let value = localStorage.getItem(optinalFeature.key);
            if (value)
                optinalFeature.isEnabled = value == "true";
        }
    } catch {
        console.error(`${userscriptName} Couldn't read saved settings from localStorage`);
    }
    try {
        for (let optinalFeature of optinalFeatures)
            GM.registerMenuCommand(optinalFeature.menuString + yesNoString(optinalFeature.isEnabled), optinalFeature.action.bind(optinalFeature), { id: optinalFeature.key, autoClose: false });
    } catch {
        console.error(`${userscriptName} Couldn't add GM menu entries`);
    }
    callback();
})();
