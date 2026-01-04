// ==UserScript==
// @name         Crunchyroll Profiles
// @namespace    https://gist.github.com/Derro8/88ba240acdcb5acd4464a489343cca34
// @version      2024-02-09
// @description  Uses new multiprofile endpoints to implement profiles before release.
// @author       chonker
// @match        https://www.crunchyroll.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486562/Crunchyroll%20Profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/486562/Crunchyroll%20Profiles.meta.js
// ==/UserScript==

/*
Press "S" to toggle the switch profile UI.
Press "C" to toggle the create profile UI.
Press "D" to toggle the delete profile UI.
*/

var profileId = localStorage.profileId;
var hasSentToken = false;
var authToken;
var getReduxState = () => JSON.parse(localStorage[`PERSISTED_REDUX_STATE_${localStorage.ajs_user_id.replaceAll("\"", "")}`]);

async function getToken(body) {
    return (await fetch("https://www.crunchyroll.com/auth/v1/token", {
        credentials: "include",
        method: "POST",
        headers: {
            Authorization: "Basic bm9haWhkZXZtXzZpeWcwYThsMHE6",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    })).json();
}

async function request(token, url, params) {
    if(params.headers === undefined) params.headers = {};
    params.headers.Authorization = "Bearer " + token;

    if(typeof params.body === "object") {
        params.headers["Content-Type"] = "application/json";
        params.body = JSON.stringify(params.body);
    }

    return await fetch("https://www.crunchyroll.com/" + url, params);
}

async function switchProfile(id) {
    var refreshToken = getReduxState().userManagement.account.prevRefreshToken;
    var response = await getToken(`profile_id=${id}&refresh_token=${refreshToken}&grant_type=refresh_token_profile_id`);

    authToken = response.access_token;

    localStorage.profileId = id;
    profileId = id;

    return response;
}

async function getProfiles() {
    var data = await getToken("grant_type=etp_rt_cookie");
    return await (await request(data.access_token, "accounts/v1/me/multiprofile", {
        method: "GET",
    })).json();
}

async function getProfile(id) {
    var data = await getToken("grant_type=etp_rt_cookie");
    return await (await request(data.access_token, `accounts/v1/me/multiprofile/${id}`, {
        method: "GET",
    })).json();
}

async function deleteProfile(id) {
    var data = await getToken("grant_type=etp_rt_cookie");
    if(localStorage.profileId === id) (delete localStorage.profileId) & (profileId = undefined) & (window.location.reload());
    return await (await request(data.access_token, `accounts/v1/me/multiprofile/${id}`, {
        method: "DELETE",
    })).json();
}

async function createProfile(profile_name, username) {
    var data = await getToken("grant_type=etp_rt_cookie");
    return await (await request(data.access_token, "accounts/v1/me/multiprofile", {
        method: "POST",
        body: {
            profile_name: profile_name,
            username: username
        }
    })).json();
}

async function updateProfile(id, body) {
    var data = await getToken("grant_type=etp_rt_cookie");
    return await (await request(data.access_token, `accounts/v1/me/multiprofile/${id}`, {
        method: "PATCH",
        body: typeof body === "string" ? body : JSON.stringify(body)
    })).json();
}

window.switchProfile = switchProfile;
window.createProfile = createProfile;
window.updateProfile = updateProfile;
window.deleteProfile = deleteProfile;
window.getProfiles = getProfiles;
window.getProfile = getProfile;

function createModal() {
    var container = document.createElement("div");

    container.style.width = "auto";
    container.style.height = "auto";
    container.style.position = "fixed";
    container.style.left = "35%";
    container.style.top = "65px";
    container.style.zIndex = "500";

    return container;
}

function createProfileUI() {
    const container = createModal();

    const block = document.createElement("div");
    const title = document.createElement("div");

    const profileName = document.createElement("input");
    const userName = document.createElement("input");
    const createButton = document.createElement("input");

    const profileNameLabel = document.createElement("label");
    const userNameLabel = document.createElement("label");

    block.style.backgroundColor = "rgb(40, 40, 40)";
    block.style.height = "240px";
    block.style.width = "350px";
    block.style.borderRadius = "15px";

    title.innerText = "Create Profile";
    title.style.fontSize = "24px";
    title.style.position = "relative";
    title.style.left = "30%";
    title.style.top = "10px";

    profileName.style.position = "relative";
    profileName.style.top = "55px";
    profileName.style.left = "20%";
    profileName.style.color = "rgb(255, 255, 255)";
    profileName.style.backgroundColor = "rgb(60, 60, 60)";
    profileName.style.borderRadius = "5px";
    profileName.style.borderBlockWidth = "0px";
    profileName.style.textAlign = "center";

    profileNameLabel.innerText = "Profile Name";
    profileNameLabel.style.fontSize = "17px";
    profileNameLabel.style.color = "rgb(240, 240, 240)";
    profileNameLabel.style.position = "relative";
    profileNameLabel.style.left = "-82px";
    profileNameLabel.style.top = "28px";

    userName.style.position = "relative";
    userName.style.color = "rgb(255, 255, 255)";
    userName.style.borderBlockWidth = "0px";
    userName.style.top = "85px";
    userName.style.left = "20%";
    userName.style.backgroundColor = "rgb(60, 60, 60)";
    userName.style.borderRadius = "5px";
    userName.style.textAlign = "center";

    userNameLabel.innerText = "Username";
    userNameLabel.style.fontSize = "17px";
    userNameLabel.style.color = "rgb(240, 240, 240)";
    userNameLabel.style.position = "relative";
    userNameLabel.style.left = "-72px";
    userNameLabel.style.top = "58px";

    createButton.type = "button";
    createButton.value = "Create";
    createButton.style.position = "relative";
    createButton.style.width = "100px";
    createButton.style.left = "33%";
    createButton.style.top = "100px";
    createButton.style.fontSize = "16px";
    createButton.style.color = "rgb(30, 30, 30)";
    createButton.classList.add("button--xqVd0");
    createButton.classList.add("button--is-type-one--3uIzT");
    createButton.classList.add("action-button");

    createButton.addEventListener("click", () => 
        createProfile(
            profileName.value,
            userName.value
        ).then(response => switchProfile(response.profile_id).then(() => window.location.reload()))
    );

    block.appendChild(title);
    block.appendChild(profileName);
    block.appendChild(profileNameLabel);
    block.appendChild(userName);
    block.appendChild(userNameLabel);
    block.appendChild(createButton);

    container.appendChild(block);

    return container;
}

function switchProfileUI() {
    const container = createModal();

    const block = document.createElement("div");
    const title = document.createElement("div");

    block.style.backgroundColor = "rgb(40, 40, 40)";
    block.style.height = "auto";
    block.style.width = "200px";
    block.style.borderRadius = "15px";

    if(localStorage.profileId !== undefined) getProfile(localStorage.profileId).then(profile => (block.style.backgroundImage = `url("https://static.crunchyroll.com/assets/wallpaper/1920x400/${profile.wallpaper}")`))

    title.innerText = "Who's Watching?";
    title.style.fontSize = "24px";
    title.style.position = "relative";
    title.style.left = "4%";
    title.style.top = "10px";
    title.style.paddingBottom = "20px";

    block.appendChild(title);

    getProfiles().then(response => {
        const profiles = response.profiles;
        for(const profile of profiles) {
            if(!profile.can_switch) continue;

            var item = document.createElement("div");
            var image = document.createElement("img");
            var span = document.createElement("span");
            var name = document.createElement("p");

            span.style.paddIngLeft = "18px";
            span.style.display = "block";
            span.style.textAlign = "center";

            name.style.overflow = "hidden";
            name.style.fontSize = "20px";
            name.style.fontWeight = "300";
            name.style.textOverflow = "ellipsis";
            name.style.textAlign = "center";
            name.innerText = profile.profile_name;

            image.src = `https://static.crunchyroll.com/assets/avatar/170x170/${profile.avatar}`;
            image.style.borderRadius = "100%";
            image.style.width = "50px";
            image.style.height = "50px";

            item.style.position = "relative";
            item.style.paddingBottom = "5px";
            item.style.cursor = "pointer";

            span.appendChild(image);
            item.appendChild(span);
            item.appendChild(name);

            item.addEventListener("click", () =>
                switchProfile(profile.profile_id).then(() => window.location.reload())
            );

            block.appendChild(item);
        };
    });

    container.appendChild(block);

    return container;
}

function deleteProfileUI() {
    const container = createModal();

    const block = document.createElement("div");
    const title = document.createElement("div");

    block.style.backgroundColor = "rgb(40, 40, 40)";
    block.style.height = "auto";
    block.style.width = "200px";
    block.style.borderRadius = "15px";

    if(localStorage.profileId !== undefined) getProfile(localStorage.profileId).then(profile => (block.style.backgroundImage = `url("https://static.crunchyroll.com/assets/wallpaper/1920x400/${profile.wallpaper}")`))

    title.innerText = "Delete Profile";
    title.style.fontSize = "24px";
    title.style.position = "relative";
    title.style.left = "15%";
    title.style.top = "10px";
    title.style.paddingBottom = "20px";

    block.appendChild(title);

    getProfiles().then(response => {
        const profiles = response.profiles;

        for(const profile of profiles) {
            var item = document.createElement("div");
            var image = document.createElement("img");
            var span = document.createElement("span");
            var name = document.createElement("p");

            span.style.paddIngLeft = "18px";
            span.style.display = "block";
            span.style.textAlign = "center";

            name.style.overflow = "hidden";
            name.style.fontSize = "20px";
            name.style.fontWeight = "300";
            name.style.textOverflow = "ellipsis";
            name.style.textAlign = "center";
            name.innerText = profile.profile_name;

            image.src = `https://static.crunchyroll.com/assets/avatar/170x170/${profile.avatar}`;
            image.style.borderRadius = "100%";
            image.style.width = "50px";
            image.style.height = "50px";

            item.style.position = "relative";
            item.style.paddingBottom = "5px";
            item.style.cursor = "pointer";

            span.appendChild(image);
            item.appendChild(span);
            item.appendChild(name);

            item.addEventListener("click", () =>
                container.remove()&deleteProfile(profile.profile_id)
            );

            block.appendChild(item);
        };
    });

    container.appendChild(block);

    return container;
}

(function() {
    'use strict';

    if(localStorage.profileId === undefined)
        getProfiles().then(data => {
            if(data.profiles.length === 1 && data.tier_max_profiles > 1) document.body.appendChild(createProfileUI());
            else document.body.appendChild(switchProfileUI());
        });
    else {
        try {
            getProfile(localStorage.profileId).then(profile => {
                if(profile === undefined || !profile.can_switch) (delete localStorage.profileId)&(document.body.appendChild(switchProfileUI()));
                else switchProfile(localStorage.profileId);
            });
        } catch (e) {
            document.body.appendChild(switchProfileUI())
        }
    }

    var createProfileContainer = undefined;
    var switchProfileContainer = undefined;
    var deleteProfileContainer = undefined;

    window.document.addEventListener("keydown", (event) => {
        if(event.target !== null && event.target.nodeName === "INPUT") return;
        if(event.key === "c") {
            if(createProfileContainer === undefined) return document.body.appendChild((createProfileContainer = createProfileUI()));
            else (createProfileContainer.remove())&(createProfileContainer = undefined);
        }
        if(event.key === "s") {
            if(switchProfileContainer === undefined) return document.body.appendChild((switchProfileContainer = switchProfileUI()));
            else (switchProfileContainer.remove())&(switchProfileContainer = undefined);
        }
        if(event.key === "d") {
            if(deleteProfileContainer === undefined) return document.body.appendChild((deleteProfileContainer = deleteProfileUI()));
            else (deleteProfileContainer.remove())&(deleteProfileContainer = undefined);
        }
    })

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    const origHeader = XMLHttpRequest.prototype.setRequestHeader;

    const profileUrl = "https://www.crunchyroll.com/accounts/v1/me/profile";
    const tokenUrl = "https://www.crunchyroll.com/auth/v1/token";

    XMLHttpRequest.prototype.open = function() {
        if(arguments[1] === profileUrl && profileId !== undefined)
            arguments[1] = `https://www.crunchyroll.com/accounts/v1/me/multiprofile/${profileId}`;

        this.__url = arguments[1];

        origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function() {
        if(!hasSentToken && authToken !== undefined && arguments[0] === "Authorization" && /Bearer (.+)/.test(arguments[1]))
            arguments[1] = "Bearer " + authToken;

        origHeader.apply(this, arguments);
    }

    XMLHttpRequest.prototype.send = function() {
        if(this.__url === tokenUrl && profileId !== undefined && /grant_type=etp_rt_cookie/.test(arguments[0])) {
            var state = getReduxState();

            arguments[0] = arguments[0].replace(/grant_type=etp_rt_cookie/, `profile_id=${localStorage.profileId}&refresh_token=${state.userManagement.account.prevRefreshToken}&grant_type=refresh_token_profile_id`);

            hasSentToken = true;
        }

        origSend.apply(this, arguments);
    }
})();