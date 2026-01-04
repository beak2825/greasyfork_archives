// ==UserScript==
// @name         [Torn] Expanded Mini-profile
// @namespace    https://www.github.com/TravisTheTechie
// @version      0.7
// @description  Adds the number of energy boosts and crime skills to the mini profile.
// @author       Travis Smith
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530382/%5BTorn%5D%20Expanded%20Mini-profile.user.js
// @updateURL https://update.greasyfork.org/scripts/530382/%5BTorn%5D%20Expanded%20Mini-profile.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

(async function() {
    'use strict';

    const observer = new MutationObserver(handleBodyUpdate);
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    function createConfigPanel(targetElement) {
        const configLineStyle = "display: flex; justify-content: space-between;";
        const configPanel = `
    <div class="mini-profile-config" style="background-color: #f0f0f0; display: none; transition: visibility 0.5s, opacity 0.5s linear;">
      <div style="${configLineStyle}">
        <label>API Key</label>
        <input id="ApiKey" type="text" />
      </div>
      <div style="${configLineStyle}">
        <label>Show Xanax used</label>
        <input id="ShowXanax" type="checkbox" />
      </div>
      <div style="${configLineStyle}">
        <label>Show energy cans (eCans) used</label>
        <input id="ShowECans" type="checkbox" />
      </div>
      <div style="${configLineStyle}">
        <label>Show energy refills used</label>
        <input id="ShowERefills" type="checkbox" />
      </div>
      <div style="${configLineStyle}">
        <label>Show total crime skill</label>
        <input id="ShowTotalCrime" type="checkbox" />
      </div>
      <div style="${configLineStyle}">
        <label>Show individual crime skills</label>
        <input id="ShowCrime" type="checkbox" />
      </div>
      <div style="display: flex; justify-content: space-around; padding: 5px;">
        <button style="flex-grow: 1" id="btnConfigSave">Save</button>
        <button style="flex-grow: 1" id="btnConfigCancel">Cancel</button>
      </div>
    </div>
    `;
        targetElement.insertAdjacentHTML('beforeend', configPanel);
        const miniProfileConfigElement = document.querySelector(".mini-profile-config");
        miniProfileConfigElement.querySelector("#btnConfigCancel").onclick = function(evt) {
            evt.preventDefault();
            hideConfig();
        }
        miniProfileConfigElement.querySelector("#btnConfigSave").onclick = function(evt) {
            evt.preventDefault();
            const ApiKeyElement = miniProfileConfigElement.querySelector("#ApiKey");
            if (ApiKeyElement) {
                GM_setValue("ApiKey", ApiKeyElement.value);
            }
            const ShowElements = miniProfileConfigElement.querySelectorAll("[id*=Show]");
            for(const showElement of ShowElements) {
                GM_setValue(showElement.id, showElement.checked);
            }
            hideConfig();
        }

        // load config
        const ApiKeyElement = miniProfileConfigElement.querySelector("#ApiKey");
        if (ApiKeyElement) {
            ApiKeyElement.value = GM_getValue("ApiKey") || "";
        }
        const ShowElements = miniProfileConfigElement.querySelectorAll("[id*=Show]");
        for(const showElement of ShowElements) {
            showElement.checked = GM_getValue(showElement.id);
        }
    }

    function showConfig() {
        const configElement = document.querySelector("#profile-mini-root .mini-profile-config");
        if (configElement) {
            configElement.style.display = "block";
        }
    }

    function hideConfig() {
        const configElement = document.querySelector("#profile-mini-root .mini-profile-config");
        if (configElement) {
            configElement.style.display = "none";
        }
    }

    async function handleBodyUpdate() {
        const profileWrapperElement = document.querySelector("#profile-mini-root [class*=profile-mini-_userProfileWrapper___]");
        if (!profileWrapperElement) return;
        // tag already there, stop
        if (profileWrapperElement.querySelector("#miniProfileSettings")) return;

        // find the userId
        const userImgElement = document.querySelector("#profile-mini-root div[class*=profile-mini-_userImageWrapper] a");
        if (!userImgElement) return;
        const userId = parseInt(userImgElement?.href?.replace(/\D/g, "")) || 0;
        if (!userId) return;

        const settingsDiv = `<span id='miniProfileSettings' title="Mini Profile Settings" style="color: rgb(116, 192, 252); text-decoration: none;">⚙ Mini Profile Settings</span>`;
        profileWrapperElement.insertAdjacentHTML('beforeend', settingsDiv);

        createConfigPanel(profileWrapperElement);

        const miniProfileSettings = document.querySelector("#miniProfileSettings");
        miniProfileSettings.onclick = showConfig;

        const apiKey = GM_getValue('ApiKey');
        if (!apiKey) {
            return;
        }

        const url = `https://api.torn.com/user/${userId}?selections=personalstats&key=${apiKey}`;
        const response = await fetch(url);
        const results = await response.json();

        // max-height limits the
        const miniProfileWrapperElement = document.querySelector("#profile-mini-root [class*=profile-mini-_wrapper___]");
        if (miniProfileWrapperElement) {
            miniProfileWrapperElement.style.maxHeight = '100%';
        }

        const energyItems = [
            {
                configKey: "ShowXanax",
                shouldShow: (data) => !!data?.personalstats?.xantaken,
                render: (data) => `Xanax: ${data?.personalstats?.xantaken}`
            },
            {
                configKey: "ShowECans",
                shouldShow: (data) => !!data?.personalstats?.energydrinkused,
                render: (data) => `eCans Used: ${data?.personalstats?.energydrinkused}`
            },
            {
                configKey: "ShowERefills",
                shouldShow: (data) => !!data?.personalstats?.refills,
                render: (data) => `eRefills: ${data?.personalstats?.refills}`
            },
        ];

        const energyDivText = energyItems
        .filter((x) => GM_getValue(x.configKey))
        .filter((x) => x.shouldShow(results))
        .map((x) => x.render(results))
        .join(", ");

        if (energyDivText) {
            const energyDiv = `<div class="custom-energy-boosts">${energyDivText}</span>`;
            profileWrapperElement.insertAdjacentHTML('beforeend', energyDiv);
        }

        const crimeSkills = [
            {
                label: "Search for Cash",
                value: (data) => data?.personalstats?.searchforcashskill
            },
            {
                label: "Bootlegging",
                value: (data) => data?.personalstats?.bootleggingskill
            },
            {
                label: "Graffiti",
                value: (data) => data?.personalstats?.graffitiskill
            },
            {
                label: "Shoplifting",
                value: (data) => data?.personalstats?.shopliftingskill
            },
            {
                label: "Pickpocketing",
                value: (data) => data?.personalstats?.pickpocketingskill
            },
            {
                label: "Card Skimming",
                value: (data) => data?.personalstats?.cardskimmingskill
            },
            {
                label: "Burglary",
                value: (data) => data?.personalstats?.burglaryskill
            },
            {
                label: "Hustling",
                value: (data) => data?.personalstats?.hustlingskill
            },
            {
                label: "Disposal",
                value: (data) => data?.personalstats?.disposalskill
            },
            {
                label: "Cracking",
                value: (data) => data?.personalstats?.crackingskill
            },
            {
                label: "Forgery",
                value: (data) => data?.personalstats?.forgeryskill
            },
            {
                label: "Scamming",
                value: (data) => data?.personalstats?.scammingskill
            }
        ];

        if (GM_getValue("ShowTotalCrime")) {
            let crimeSkillSum = 0;
            crimeSkills.forEach(x => (crimeSkillSum += x.value(results) || 0));

            const crimeSkillTotal = `<span class="custom-crime-skill-total">Total Crime Skills: ${crimeSkillSum}</span>`;
            profileWrapperElement.insertAdjacentHTML('beforeend', crimeSkillTotal);
        }

        if (GM_getValue("ShowCrime")) {
            const crimeSkillsContent = crimeSkills
            .map(x => `<span class="custom-crime-skill">${x.label}: ${x.value(results)}</span>`)
            .join("\n");
            profileWrapperElement.insertAdjacentHTML('beforeend', crimeSkillsContent);
        }
    }
})();