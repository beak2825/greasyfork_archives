// ==UserScript==
// @name         BananaBlocker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Block people that are complete bananas on Gamebanana.
// @author       PBalint817
// @icon         https://images.gamebanana.com/static/img/banana.png
// @match        https://gamebanana.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538441/BananaBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/538441/BananaBlocker.meta.js
// ==/UserScript==
'use strict';

class User {

    static filter = {
        Default: -1,
        Keep: 0,
        Hide: 1,
        Remove: 2
    };

    static defaults = {
        Posts: User.filter.Remove,
        Comments: User.filter.Keep,
        Replies: User.filter.Keep
    }

    constructor(id, o=undefined){
        if (typeof(id) !== 'number'){
            throw new Error('Expected number as id, got ' + typeof(id))
        }
        this.id = id;

        if (!o || typeof(o) !== 'object'){
            o = {}
        }
        for (const key in User.defaults){
            const defaultValue = User.defaults[key]
            if (!(key in o)){
                o[key] = User.filter.Default;
                continue;
            }
            let value = o[key];
            if (value === undefined){
                value = -1;
            }
            if ((typeof(value) !== typeof(defaultValue))){
                console.warn(`The option '${key}' got a value of type '${typeof(value)}', expected '${typeof(defaultValue)}'`);
                o[key] = User.filter.Default;
                continue;
            }
        }
        for (const key in User.defaults){
            this[key] = User.defaults[key]
        }
        for (const key in o){
            if (!(key in this)){
                if (key !== 'id'){
                    console.warn(`The option '${key}' is not valid and was ignored.`);
                }
                continue;
            }
            this[key] = o[key]
        }
    }
}

let disableOnProfile;
let blockList;

function loadConfig(){
    let t = GM_getValue("disableOnProfile");
    if (typeof(t) !== 'boolean'){
        t = true;
        GM_setValue("disableOnProfile", true);
    }
    disableOnProfile = t;


    let userDefaults = GM_getValue("defaults");
    if (typeof(userDefaults) !== 'object'){
        userDefaults = {...User.defaults};
        GM_setValue("defaults", userDefaults)
    }
    const validNumbers = new Set(Object.values(User.filter));
    validNumbers.delete(User.filter.Default);

    for (const key in userDefaults){
        if (!(key in User.defaults)){
            console.warn(`The default for option '${key}' is not valid and was ignored.`);
            continue;
        }
        const defaultValue = User.defaults[key];
        const value = userDefaults[key];
        if (typeof(defaultValue) !== typeof(value)){
            console.warn(`The default for option '${key}' got a value of type '${typeof(value)}', expected '${typeof(defaultValue)}'`);
            continue;
        }
        if (typeof(defaultValue) === 'number'){
            if (!validNumbers.has(value)){
                console.warn(`The default for option '${key}' was out of range.`)
                continue;
            }
        }
        User.defaults[key] = value;
    }

    t = GM_getValue("blockList");
    if (typeof(t) !== 'object'){
        t = {};
        GM_setValue("blockList", t);
    }

    blockList = t;

    for (let key in {...blockList}){
        let value = blockList[key];
        if (typeof(key) !== 'number'){
            delete blockList[key];
            key = +key;
            blockList[key] = value;
        }
        if (!Number.isSafeInteger(key) || key < 1){
            delete blockList[key];
            continue;
        }
        if (typeof(value) !== 'object'){
            value = {};
        }
        delete value.id;
        blockList[key] = new User(key, value);
    }
}

function saveConfig(){
    GM_setValue('disableOnProfile', disableOnProfile);
    GM_setValue('defaults', User.defaults);
    GM_setValue('blockList', blockList);
}


loadConfig();


function getDefaultBlock(){
    return Object.fromEntries(Object.keys(User.defaults).map(key => [key, User.filter.Default]))
}

function getBlockIncludingDefault(id, key){
    if (!(id in blockList)){
        return null;
    }
    const user = blockList[id]
    if (!(key in user)){
        throw new Error(`tried to access invalid key from block list (id=${id}, key=${key})`);
    }
    const value = user[key];
    if (value === User.filter.Default || value === undefined){
        return -1;
    }
    return value;
}


function getBlockType(id, key){
    if (!(id in blockList)){
        return null;
    }
    const user = blockList[id]
    if (!(key in user)){
        throw new Error(`tried to access invalid key from block list (id=${id}, key=${key})`);
    }
    const value = user[key];
    if (value === User.filter.Default || value === undefined){
        return User.defaults[key];
    }
    return value;
}

const defaultTimeout = 5000;
const blockerInjectedClassName = "BananaBlockerInjectedClass";
const redactedClassName = "BananaBlockerRedacted";
const blockedMsgHtml = `<i style="color: gray; cursor: pointer" class>Click to show blocked message.</i>`;
const blockedPostHtml = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: darkred; z-index: 10; text-align: center; font-weight: bold; background-color: rgba(255, 255, 255, 0.5); text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); padding: 4px 8px; border-radius: 4px; pointer-events: none">Blocked</div>`

function waitForElementOrLoad(selector, timeout, callback, failCallback) {
    const element = document.querySelector(selector);
    if (element) return callback(element);

    let isObserving = false;

    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
            observer.disconnect();
            isObserving = false;
            if (callback){
                callback(el);
            }
        }
    });

    if (timeout){
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (!isObserving) return;
                observer.disconnect();
                isObserving = false;
                if (failCallback){
                    failCallback();
                }
            }, timeout);
        });
    }

    isObserving = true;
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function filterAllSubmissions(rootElement) {
    const posts = [...rootElement.querySelectorAll(".PreviewWrapper")];
    for (const post of posts){
        const avatar = post.querySelector(".Avatar");
        let isProfile = false;
        let href;
        if (avatar) {
            href = avatar.href;
        }
        else{
            const navigatorLink = document.querySelector("#SubNavigator a");
            if (!navigatorLink) continue;
            href = navigatorLink.href;
            isProfile = true;
        }
        if (typeof(href) !== 'string') continue;
        const split = href.split('/');
        const userId = +split[split.length-1];
        if (!userId) continue;

        let value = getBlockType(userId, 'Posts')
        if (!value){
            continue;
        }

        if (isProfile && disableOnProfile){
            if (value > User.filter.Hide){
                value = User.filter.Hide;
            }
        }
        removeSubmission(post, value);
    }
}

function removeSubmission(post, mode){
    const parent = post.parentElement;
    if (parent.classList.contains(blockerInjectedClassName)) {
        return;
    }
    parent.classList.add(blockerInjectedClassName);

    if (mode === 1){
        parent.dataset._sinitialvisibility = "warn";
        post.innerHTML += blockedPostHtml;

    }
    else{
        parent.dataset._sinitialvisibility = "hide";
    }
}

function main1(element){

    const contentWrapper = element;

    filterAllSubmissions(document);

    const submissions = document.querySelector('#SubmissionsListModule');

    const observer = new MutationObserver(() => {
        filterAllSubmissions(submissions);
    });

    observer.observe(submissions, {
        childList: true,
        subtree: true
    });
}


function filterAllComments(rootElement){
    const comments = [...rootElement.querySelectorAll("div.Post")];
    for (const comment of comments){
        const memberlink = comment.querySelector(".MemberLink");
        if (!memberlink) continue;
        const href = memberlink.href;
        if (typeof(href) !== 'string') continue;
        const split = href.split('/');
        const userId = +split[split.length-1];
        if (!userId) continue;

        const parentElement = comment.parentElement;
        if (parentElement.classList.contains("Replies")){
            const value = getBlockType(userId, "Replies");
            if (!value) continue;

            removeComment(comment, value)
        }
        else{
            const value = getBlockType(userId, "Comments");
            if (!value) continue;

            removeComment(comment, value)
        }
    }
}

function removeComment(comment, mode){
    if (mode === 1){
        const contents = comment.querySelector(".RichText");
        if (!contents.classList.contains(blockerInjectedClassName)){
            contents.classList.add(blockerInjectedClassName);
            const originalHTML = contents.innerHTML;
            const refresh = () => {
                if (contents.classList.contains(redactedClassName)){
                    contents.innerHTML = blockedMsgHtml;
                }
                else{
                    contents.innerHTML = originalHTML;
                }
            }
            const toggle = () => {
                if (contents.classList.contains(redactedClassName)) {
                    contents.classList.remove(redactedClassName)
                }
                else {
                    contents.classList.add(redactedClassName);
                }
                refresh();
            };
            contents.addEventListener('click', toggle);
            toggle();
            const observer = new MutationObserver(() => {
                observer.disconnect();
                refresh();
                observer.observe(contents, {characterData: false, childList: true, attributes: false})
            })

            observer.observe(contents, {characterData: false, childList: true, attributes: false});
        }
    }
    else {
        comment.remove();
    }
}


function main2(element){
    const commentWrapper = element;

    filterAllComments(document);

    const comments = document.querySelector('#PostsListModule');

    const observer = new MutationObserver(() => {
        filterAllComments(comments);
    });

    observer.observe(comments, {
        childList: true,
        subtree: true
    });
}

function hideProfileSubmissions(rootElement){

    const posts = [...rootElement.querySelectorAll(".PreviewWrapper")];
    for (const post of posts)
    {

    }
}


function main3(targetSelector, element){
    if (targetSelector !== "#IdentityModule"){
        filterAllSubmissions(document);

        const submissions = document.querySelector(targetSelector);

        const observer = new MutationObserver(() => {
            filterAllSubmissions(submissions);
        });

        observer.observe(submissions, {
            childList: true,
            subtree: true
        });
    }

    const re = /^https:\/\/gamebanana\.com\/members\/\d+/;
    if (document.URL.match(re)){
        waitForElementOrLoad("#IdentityModule .Content", defaultTimeout, injectUserBlockSetting, () => {})
    }
}

function injectUserBlockSetting(element){
    if (element.querySelector("#UserBlockerCheckboxInjected")) return;

    element.innerHTML += "<input type='checkbox' id='UserBlockerCheckboxInjected'>Block</input>"
    element.innerHTML += "<ul class='KeyInfo'></ul>"
    const ul = element.lastChild;

    const regexResult = [.../^https:\/\/gamebanana\.com\/members\/(\d+)/.exec(document.URL)]
    const targetId = regexResult[regexResult.length-1];

    let optionHtml = ""
    for (const key in User.filter){
        optionHtml += `<option value='${User.filter[key]}'>${key}</option>`
    }

    const baseId = "UserBlockerOption"

    for (const key in User.defaults){
        const currentId = `${baseId}_${key}`
        ul.innerHTML += `<li><select id="${currentId}">${optionHtml}</select><small>${key}</small></li>`;
        ul.lastChild.firstChild.dataset.targetKey = key;
    }

    const btn = element.querySelector("input");

    let listenerEnabled = false;

    function loopListener(e) {
        if (!listenerEnabled) return;
        const selectElement = e.target;
        const value = +selectElement.value;
        const targetKey = selectElement.dataset.targetKey;

        if (!Object.values(User.filter).includes(value)) return;
        if (!Object.keys(User.defaults).includes(targetKey)) return;

        const user = blockList[targetId];
        user[targetKey] = value;
        updateBlock(user);
        refreshValues();

        btn.checked = targetId in blockList;
        btn.dispatchEvent(new Event("change"), {bubbles: true})


    }

    for (const li of ul.children){
        const select = li.querySelector("select");
        select.addEventListener('change', loopListener)
    }

    function refreshValues(){
        if (!btn.checked) return;
        listenerEnabled = false;
        for (const key in User.defaults){
            const currentId = `${baseId}_${key}`
            const select = document.querySelector('#'+currentId);
            const blockType = getBlockIncludingDefault(targetId, key);
            select.value = blockType
            select.dispatchEvent(new Event("change"), {bubbles: true})
        }
        listenerEnabled = true;
    }

    btn.addEventListener('change', e => {
        if (e.target.checked){
            ul.style.visibility = "";
            if (!(targetId in blockList)){
                if (listenerEnabled){
                    addBlock(targetId);
                }
                refreshValues();
            }
        }
        else{
            ul.style.visibility = "hidden";
            if (listenerEnabled){
                removeBlock(targetId);
            }
        }
    })

    btn.checked = targetId in blockList;
    btn.dispatchEvent(new Event("change"), {bubbles: true})
    refreshValues();
    listenerEnabled = true;
}



function addBlock(targetId){
    loadConfig();
    blockList[targetId] = getDefaultBlock();
    saveConfig();
}

function updateBlock(user){
    loadConfig();
    if (!(user.id in blockList)){
        return false;
    }
    blockList[user.id] = user;
    saveConfig();
    return true;
}

function removeBlock(targetId){
    loadConfig();
    delete blockList[targetId];
    saveConfig();
}

// AI-generated because I got lazy (UI and JS in general is not my passion...)
function showBlockListSetting() {
    // Create modal overlay
    const modalOverlay = document.createElement("div");
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    modalOverlay.style.zIndex = "9999";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#2b2b2b";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.width = "80%";
    modalContent.style.maxWidth = "600px";
    modalContent.style.maxHeight = "80vh";
    modalContent.style.overflow = "auto";

    // Add title and close button
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0;">Global settings</h2>
            <button id="closeBlocklistModal" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
        </div>
        <div>
          <ul style="list-style-type: none">
            <li>
              <small>Disable on profiles: </small>
              <input type='checkbox' id="BlockerConfig_ProfileToggle"/>
            </li>
            <li>
                <p>Defaults:</p>
                <ul class="KeyInfo" id="BlockerConfig_Defaults" style="list-style-type: none; margin-left: 20px">
                </ul>
            </li>
          </ul>
        </div>
    `;

    let listenerEnabled = false;

    // Append content to overlay
    modalOverlay.appendChild(modalContent);

    // Add to document
    document.body.appendChild(modalOverlay);

    const defaults = document.querySelector("#BlockerConfig_Defaults");

    let optionHtml = ""
    for (const key in User.filter){
        if (User.filter[key] === User.filter.Default) continue;

        optionHtml += `<option value='${User.filter[key]}'>${key}</option>`
    }

    const baseId = "DefaultBlockerOption"

    for (const key in User.defaults){
        const currentId = `${baseId}_${key}`
        defaults.innerHTML += `<li><small>${key}</small><select id="${currentId}">${optionHtml}</select></li>`;
        defaults.lastChild.querySelector("select").dataset.targetKey = key;
    }

    function loopListener(e) {
        if (!listenerEnabled) return;
        const selectElement = e.target;
        const value = +selectElement.value;
        const targetKey = selectElement.dataset.targetKey;

        if (!Object.values(User.filter).includes(value)) return;
        if (!Object.keys(User.defaults).includes(targetKey)) return;

        loadConfig();
        User.defaults[targetKey] = value;
        saveConfig();
        refreshValues();
    }

    for (const li of defaults.children){
        const select = li.querySelector("select");
        select.addEventListener('change', loopListener)
    }

    const profileToggle = document.querySelector("#BlockerConfig_ProfileToggle")

    function refreshValues(){
        listenerEnabled = false;
        profileToggle.checked = disableOnProfile;
        profileToggle.dispatchEvent(new Event("change"), {bubbles: true});

        for (const key in User.defaults){
            const currentId = `${baseId}_${key}`
            const select = document.querySelector('#'+currentId);
            const blockType = User.defaults[key];
            select.value = blockType
            select.dispatchEvent(new Event("change"), {bubbles: true})
        }
        listenerEnabled = true;
    }

    profileToggle.addEventListener("change", e => {
        if (!listenerEnabled) return;
        loadConfig();
        disableOnProfile = e.target.checked;
        saveConfig();
        refreshValues();
    })


    // Close button functionality
    const closeButton = modalOverlay.querySelector("#closeBlocklistModal");
    closeButton.addEventListener("click", () => {
        document.body.removeChild(modalOverlay);
    });


    // Close when clicking outside content
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });

    refreshValues();

    listenerEnabled = true;
}

function injectBlockListSetting(mainLinks)
{
    const blockerConfigId = "InjectedBlockerConfig";
    const blockerConfig = mainLinks.querySelector(`#${blockerConfigId}`);
    if (blockerConfig){
        return; // already injected
    }
    const btn = document.createElement("button")
    btn.id = blockerConfigId;
    btn.innerHTML = `<spriteicon class="SmallSettingsIcon GagsIcon"></spriteicon><div><div>Blocklist</div><small>View blocked users</small></div>`

    mainLinks.prepend(btn);


    btn.addEventListener("click", showBlockListSetting);
}

function main4(element){
    const observer = new MutationObserver(() => {
        const mainLinks = element.querySelector("#SiteMenu .MainLinks");
        if (!mainLinks) return;

        injectBlockListSetting(mainLinks);
    });

    observer.observe(element, {
        childList: true,
        subtree: true,
    });
}


waitForElementOrLoad('#SubmissionsListModule', defaultTimeout, main1, () => {});

waitForElementOrLoad('#PostsListModule', defaultTimeout, main2, () => {});

for (const selector of ["#SubmissionsList", "#ModSubmissionsModule", "#IdentityModule"]){
  waitForElementOrLoad(selector, defaultTimeout, elem => {main3(selector, elem)}, () => {});
}

waitForElementOrLoad('#PrimaryNav', defaultTimeout, main4, () => {});
