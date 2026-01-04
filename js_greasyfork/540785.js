// ==UserScript==
// @name         WME Sidebar Wiki
// @namespace    https://github.com/WazeDev/wme-sidebar-wiki
// @version      0.0.6
// @description  Adds the wiki to the sidebar.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540785/WME%20Sidebar%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/540785/WME%20Sidebar%20Wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let toggleSidebar = false;
    let isOtherNavItemOpen;
    let navItem;
    let otherNavItems;
    let otherSidePanels;
    let tabContent;
    let countryAbbr;
    let wikiPath = "/c/wazeopedia/5162/none";

    window.SDK_INITIALIZED.then(init);

    async function init() {
        const sdk = window.getWmeSdk({
            scriptId: 'wme-sidebar-wiki',
            scriptName: 'WME Sidebar Wiki'
        });
        while (sdk.DataModel.Countries.getTopCountry() === null) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        countryAbbr = sdk.DataModel.Countries.getTopCountry().abbr;
        countryAbbrMatcher();
        waitForElm('.tab-content').then((elm) => {
            createNavIcon();
            createSidebar();
        });
    }

    function countryAbbrMatcher() {
        switch (countryAbbr) {
            case "US":
                wikiPath = "/c/wazeopedia/usa-wazeopedia/5240/none"
                break
            case "CA":
                wikiPath = "/c/wazeopedia/canada-wazeopedia/5181/none"
                break
            case "MX":
                wikiPath = "/c/wazeopedia/mexico-wazeopedia/5214/none"
                break
        }
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function createNavIcon() {
        navItem = document.createElement("wz-navigation-item");
        let navLabel = document.createElement("span");
        let icon = document.createElement("i");
        icon.className = "w-icon w-icon-book";
        navItem.setAttribute("data-for", "wiki");
        navItem.setAttribute("is-collapsed-labeled", "true");
        navItem.setAttribute("selected", "false");
        navItem.appendChild(icon);
        navLabel.textContent = "Wiki";
        navItem.appendChild(navLabel);
        navItem.addEventListener("click", toggleSidebarCheck);
        let navDrawer = document.getElementById("drawer");
        navDrawer.appendChild(navItem);
        otherNavItems = Array.from(document.getElementById("drawer").children).filter((el) => {
            return el.tagName === "WZ-NAVIGATION-ITEM" && el.getAttribute("data-for") != "wiki"
        });
        otherNavItems.forEach((e) => {
            e.addEventListener("click", otherNavItemHandler)
        })
    }

    function createSidebar() {
        let sidebar = document.createElement("div");
        let iframe = document.createElement("iframe");
        iframe.style = "height: 99%; width: 100%; resize: horizontal;";
        sidebar.className = "tab-pane sidebar-tab-pane";
        sidebar.style = "max-width: 100%; width: inherit;";
        sidebar.id = "sidepanel-wiki";
        iframe.src = `https://www.waze.com/discuss${wikiPath}?mobile_view=1`;
        sidebar.appendChild(iframe);
        tabContent = document.getElementsByClassName("tab-content")[0];
        tabContent.insertBefore(sidebar, document.getElementById("sidepanel-prefs").nextSibling);
        otherSidePanels = Array.from(tabContent.children).filter((c) => {
            return !c.id.includes("wiki") && c.id.includes("sidepanel")
        });
    }

    function toggleSidebarCheck() {
        console.log("Toggling sidebar...");
        if (toggleSidebar) {
            closeWikiSidebar();
        } else {
            openWikiSidebar();
        }
    }

    function otherNavItemHandler() {
        console.log("Other nav item clicked...");
        isOtherNavItemOpen = true;
        navItem.setAttribute("selected", "false");
        document.getElementsByClassName("sidebar-layout")[0].style = "";
        document.getElementById("sidepanel-wiki").className = "tab-pane sidebar-tab-pane";
        toggleSidebar = false;
    }

    function openWikiSidebar() {
        console.log("Opening wiki sidebar...");
        navItem.setAttribute("selected", "true");
        document.getElementsByClassName("sidebar-layout")[0].style = "max-width: 100%";
        document.getElementsByClassName("app container-fluid")[0].className = "app container-fluid show-sidebar";
        if (isOtherNavItemOpen) {
            otherNavItems.forEach((e) => {
                e.setAttribute("selected", "false")
            });
            otherSidePanels.forEach((e) => {
                e.className = "tab-pane sidebar-tab-pane"
            });
            isOtherNavItemOpen = false;
        }
        document.getElementById("sidepanel-wiki").className = "tab-pane sidebar-tab-pane active";
        toggleSidebar = true;
    }

    function closeWikiSidebar() {
        console.log("Closing wiki sidebar...");
        navItem.setAttribute("selected", "false");
        document.getElementsByClassName("sidebar-layout")[0].style = "";
        document.getElementsByClassName("app container-fluid")[0].className = "app container-fluid";
        document.getElementById("sidepanel-wiki").className = "tab-pane sidebar-tab-pane";
        toggleSidebar = false;
    }
})();
