// ==UserScript==
// @name         AniList Jimaku Button
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds a button to individual anime pages on AniList that links to the corresponding Jimaku entry
// @author       https://github.com/konata-san
// @match        https://anilist.co/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAACXBIWXMAAAsSAAALEgHS3X78AAAEMklEQVRoge2ay28TRxzHf7O7s47t2CgxiWOvLXAaSiGhpJQ6xJCH5ZiG2CkNpUE9V+rf0UNPubRVT6FSe2rVh0CCQCtIIQSl6qUSARIoUiEPk1alEk6MmviR9fRgKQqz9npf1irSfuWD/Z3Hbz67vxnPrI18oUOwk8WYPQC9sgDMlgVgtiwAs2UBmC0LwGxZAGbLAjBbOx6AM6QXjDGDEGVuiqIoioAYwm6LUiyi4qYhQUsyAMBeV/f1+c/9vhbKv3z12tj5b9Ojn4ie4JaJNjLuiTFb6r7+uCUZANB5uKMr/CaPMeWfOT009vvz/IFeyl+PnLN9bxiAAXMgMTggHT0ACII/3N0t9QmuA6DzTbP0AtjtdW/Ho2WLOJZNDpzQ2X9V6QWIHAu3eJsrlY4EOYcxy0RF6QJACCWH4gxTsZPdNohVpDNGugBcrvpYf498nbMCkSywRkoXQH9PxNPYIF9nyAe7eT1Bqkg7AMMww0Mnq1bz8BD3Es1Rqg9Dc0tvc9PxSBdl/vl4IZfLUea5ILA1yyLtANG+E7vcLsr85rsLd+7OUeZxDwh2zXGqSCMAy3HS/Mnl8lO3f73y8yQhL+VMIw8JX62ySCPAnqDQebiDMp8sLD5ZWJqanvlvfZ0qGhFqlUUaAQaivW5XPWVO3pgWRXE59fTe/QdUUbgBQk5toapICwDGXOJUnDLzhcLN6RkAKBbJxE/XqSxyY3hXqEkWaQHYv6/t4IFXKXNl5e/5h49K72/P/JbJvKAqjAaAq8HxSUuX8Vifw04vK/MPH3kaG4MBIRgQAODxwiJVod0NHW5NY5SV6q0WxjgpyR8AOBnr6++NbH202WxUBTsL7/jJ7KrBc1n1HXj9UPsrrXulPs/z9U7n1gtzZS7NB0HgjF6LVAMkT8VxueOLErXVwxtVtk6qpS6FbDY+MRjTHIxF8H6AzDobsqEjQCouSvh5is38q7BPdQBHj3T6fT5VTSiNCPDxvqPpvV/K1GHW/vGMf8il/1LSoQoAhNDp5KB0c7+5KWaz2bL1HQ47erlBqxOOedDNZ3Jxiw1Cwf+a8QBut2sgSj9iAICLl658+sU4SDIC8/ir8c/aWkPbTQQwGiBTz5D8t5ryQ5AKgO6ut7zeJjoSIT9enFhOrZRtcv2XW20fhShzsAV28bCaVx5ZTkpXIYZhhhNlji9Ly0/v3K34kEe6MwWAoAOi9HXQLqUA3uamnu6w1J+8cWtjo8wEKGlu/o/FpRRlIoD3BCKXIoQw+Q2FA1OaQu0H96dX11bXMtvNIilevnpNppUoij9cuHR2ZJjy92SJJw3pQlkKglNz/OKswoEhhf9WYVmWY1mpny8UpEmipGGuKJ32AABAAIkFqFAoldI7IJYeNauXTENDdhU7/vcBC8BsWQBmywIwWxaA2bIAzJYFYLYsALO14wH+B+qJGDfRYjT0AAAAAElFTkSuQmCC
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/493476/AniList%20Jimaku%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/493476/AniList%20Jimaku%20Button.meta.js
// ==/UserScript==

(function() {
'use strict';
    let currentPageUrl, anilistId, JIMAKU_API_KEY;

    async function setupVariables() {
        currentPageUrl = window.location.href;
        const anilistIdRegexMatch = currentPageUrl.match(/^https:\/\/anilist\.co\/anime\/(\d+)(\/.*)?$/);
        anilistId = anilistIdRegexMatch ? anilistIdRegexMatch[1] : null;
    }

    async function promptAPIKey() {
        const apiKey = prompt("Please enter your Jimaku API key:");
        if (apiKey !== null && apiKey !== "") {
            await GM.setValue("API_KEY_JIMAKU", apiKey);
        }
    }

    async function getAPIKey() {
        let apiKey = await GM.getValue("API_KEY_JIMAKU");
        if (!apiKey) {
            await promptAPIKey();
            apiKey = await getAPIKey();
        }
        return apiKey;
    }

    document.addEventListener('DOMContentLoaded', function() {
        const pageLoadObserver = new MutationObserver(async function() {
            if (!window.location.href.startsWith('https://anilist.co/anime')) {
                document.getElementById('jimaku-button').remove();
                return;
            }
            const overviewButton = document.querySelector('.nav > a.router-link-exact-active');
            if(!overviewButton) return;

            pageLoadObserver.disconnect();

            if (document.getElementById('jimaku-button')) return;

            JIMAKU_API_KEY = await getAPIKey();
            await setupVariables();
            await addJimakuButton(overviewButton);
        });
        const pageNavigationObserver = new MutationObserver(async function() {
            if (window.location.href === currentPageUrl) return;
            if (!window.location.href.startsWith('https://anilist.co/anime')) {
                document.getElementById('jimaku-button').remove();
                return;
            }

            const jimakuButton = document.getElementById('jimaku-button');
            if (!jimakuButton) return;

            await setupVariables();
            await updateJimakuButton(jimakuButton);
        });

        const observerConfig = { childList: true, subtree: true };
        pageLoadObserver.observe(document.body, observerConfig);
        pageNavigationObserver.observe(document.body, observerConfig);
        window.addEventListener('popstate', function () {
            pageLoadObserver.disconnect();
            pageLoadObserver.observe(document.body, observerConfig);
        });
    });

    async function fetchJimakuId(anilistId) {
        const cachedJimakuId = await GM.getValue('jimakuId_' + anilistId);
        return cachedJimakuId ? cachedJimakuId : await fetchJimakuIdFromAPI(anilistId);
    }

    async function fetchJimakuIdFromAPI(anilistId) {
        const response = await fetch(`https://jimaku.cc/api/entries/search?anilist_id=${anilistId}`, { headers: { 'authorization': JIMAKU_API_KEY } });
        const data = await response.json();

        if (response.ok && data[0]) {
            const id = data[0].id;
            await GM.setValue('jimakuId_' + anilistId, id);
            return id;
        }
        if (!data[0]) {
            console.log(`No jimaku entry found for anilist id: ${anilistId}`)
        }
        console.error('Error fetching data from Jimaku API:', data.error);
        if (response.status === 401) {
            await GM.setValue("API_KEY_JIMAKU", null);
            console.log("Invalid Jimaku API key supplied.")
            alert("Error: Invalid Jimaku API key.");
        }
        return "..";
    }

    async function addJimakuButton(overviewButton) {
        const jimakuButton = createJimakuButton(overviewButton);
        jimakuButton.href = "https://jimaku.cc/";
        overviewButton.parentNode.insertBefore(jimakuButton, overviewButton.nextSibling);
        updateJimakuButton(jimakuButton);
    }

    async function updateJimakuButton(jimakuButton) {
        try {
            const id = await fetchJimakuId(anilistId);
            jimakuButton.href = `https://jimaku.cc/entry/${id}`;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function createJimakuButton(overviewButton) {
        const jimakuButton = document.createElement('a');
        jimakuButton.innerText = 'Jimaku';
        jimakuButton.setAttribute('id', 'jimaku-button');
        for (const { name, value } of overviewButton.attributes) {
            jimakuButton.setAttribute(name, value);
        }
        return jimakuButton;
    }

  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const jimakuButton = document.getElementById('jimaku-button');
        if (!jimakuButton || jimakuButton.dataset.duplicated) return;
        const hohExtraBox = document.querySelector('.hohExtraBox');
        if (hohExtraBox) {
          const aniwatcher = document.getElementById('aniwatcher_button_hopefully_this_is_uniue');
          if (aniwatcher) {
            const clonedElement = aniwatcher.cloneNode(true);
            clonedElement.id = 'jimaku-button';
            clonedElement.setAttribute('href', jimakuButton.getAttribute('href'));
            clonedElement.textContent = 'Jimaku ';
            clonedElement.dataset.duplicated = "true";
            aniwatcher.after(clonedElement);
            jimakuButton.remove();
          }
          else {
            let h = document.createElement("a");
            h.id = 'jimaku-button';
            h.setAttribute('href', jimakuButton.getAttribute('href'));
            h.textContent = 'Jimaku ';
            h.dataset.duplicated = "true";
            h.setAttribute("data-v-5776f768", "");
            h.className = "link";
            h.setAttribute("target", "_blank");
            h.style.transitionDuration = "150ms";
            hohExtraBox.insertBefore(h, hohExtraBox.firstChild.nextSibling);
            jimakuButton.remove();
          }
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
