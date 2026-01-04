// ==UserScript==
// @name            kbin hide posts after voting
// @description     Removes posts that you've voted on from your feed
// @author          ShaunaTheDead86
// @namespace       http://tampermonkey.net/
// @license         MIT
// @version         1.1
// @match           https://kbin.social/*
// @match           https://fedia.io/*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/469175/kbin%20hide%20posts%20after%20voting.user.js
// @updateURL https://update.greasyfork.org/scripts/469175/kbin%20hide%20posts%20after%20voting.meta.js
// ==/UserScript==
     
updateSettings();
const target = document.querySelector("#content").children[0];
const observerConfig = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver(() => updatePosts(target));
observer.observe(target, observerConfig);
updatePosts(target);
 
function updateSettings() {
    try {
        const allSettings = [
            { text: "Hide Upvoted", name: "hide-upvoted" },
            { text: "Hide Downvoted", name: "hide-downvoted" },
        ];
 
        allSettings.forEach((setting) => getSettingCookie(setting.name) === null ? setSetting(setting.name, true) : null);
 
        const settingsList = Array.from(document.getElementById("settings").children).find((e) => e.className === "settings-list");
        const settingLabel = document.createElement("strong");
        settingLabel.innerText = "Hide posts after voting";
        settingsList.appendChild(settingLabel);
 
        allSettings.forEach((setting) => {
            const row = document.createElement("div");
            row.className = "row";
 
            const span = document.createElement("span");
            span.innerText = setting.text;
 
            const buttonContainer = document.createElement("div");
            const settingActive = getSetting(setting.name) === "true";
            buttonContainer.appendChild(createSettingButton("yes", setting.name, settingActive));
            buttonContainer.append(" | ");
            buttonContainer.appendChild(createSettingButton("no", setting.name, !settingActive));
 
            row.appendChild(span);
            row.appendChild(buttonContainer);
 
            settingsList.appendChild(row);
        });
    } catch (err) {
        console.log("ERROR: function updateSettings: ", err);
    }
}
 
function updatePosts(target) {
    try {
        const location = window.location.toString();
        const invalidSite = !location.includes("kbin.social") && !location.includes("fedia.io")
        if (invalidSite || allSettingsOff()) observer.disconnect();
        
        const articles = Array.from(target.children).filter((e) => e.id.includes("entry-"));
        articles.forEach((article) => {
            const aside = Array.from(article.children).find((e) => e.className === "vote");
            const activeButtons = Array.from(aside.children).filter((e) => e.className.includes("active"));
            activeButtons.forEach((activeButton) => {
                const isUpvote = activeButton.className.includes("vote__up");
                const activeSetting = Boolean(getSetting(isUpvote ? "hide-upvoted" : "hide-downvoted"));
                if (activeSetting) {
                    const sibling = article.nextElementSibling;
                    const hasMedia = sibling.className === "js-container";
                    const isKbin = window.location.toString().includes("kbin.social");
                    if (isKbin && hasMedia) sibling.remove();
                    article.remove();
                }
            });
        });
    } catch (err) {
        console.log("ERROR: function updatePosts: ", err);
    }
}
 
function createSettingButton(option, name, active) {
    try {
        const btn = document.createElement("a");
        btn.innerText = option === "yes" ? "Yes" : "No";
        btn.className = ["kes-setting-" + option, "link-muted", active ? "active" : ""].join(" ");
        btn.dataset.setting = name;
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => {
            setSetting(name, option === "yes" ? true : false);
            Array.from(btn.parentElement.children).forEach((e) => e.classList.remove("active"));
            btn.classList.add("active");
        });
        return btn;
    } catch (err) {
        console.log("ERROR: function createSettingButton: ", err);
    }
}
 
function getSettingCookie(setting) {
    return localStorage.getItem("setting-" + setting);
}
 
function getSetting(setting) {
    const value = localStorage.getItem("setting-" + setting);
    if (!value) return true;
    return value === "true" ? true : false;
}
 
function allSettingsOff() {
    return [getSetting("hide-upvoted"), getSetting("hide-downvoted")].every((e) => !e)
}
 
function setSetting(name, value) {
    if (allSettingsOff() && value) observer.observe(target, observerConfig);
    localStorage.setItem("setting-" + name, value);
}