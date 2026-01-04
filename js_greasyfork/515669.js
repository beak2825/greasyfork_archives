// ==UserScript==
// @name         nHentai QoL
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Tracks history, removes annoying characters from comments, and links replies in comments
// @author       Exiua
// @match        https://nhentai.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/515669/nHentai%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/515669/nHentai%20QoL.meta.js
// ==/UserScript==

// Blacklisted tags will be highlighted red
const blacklist = [];
// Warning tags will be highlighted orange
const warning = [];

const commentCleaningRegex = /\u3662+/gm;
const postIdRegex = /\/g\/(\d+)\/?/gm;
const pageRegex = /\/\d+\/\d+\//gm;

(function() {
    'use strict';

    window.addEventListener('load', main);
    //setTimeout(main, 10000);
})();

function main(){
    checkIfReloadNeeded();

    const currentUrl = window.location.href;
    if(currentUrl.includes("/g/")){
        commentSectionHandler();
        handlePost(currentUrl);
    }
    else{
        // Add favorites to history
        /*if(currentUrl.includes("/favorites/")){
            favLoader();
        }*/
        const mainPage = currentUrl == "https://nhentai.net/";
        handleGallery(mainPage);
    }
}

function favLoader(){
    const container = document.getElementById("favcontainer");
    for(const post of container.children){
        const id = post.getAttribute("data-id");
        const caption = post.getElementsByClassName("caption")[0];
        const title = caption.innerText;
        GM_setValue(id, title);
    }
    console.log("done");
    const nextBtn = document.getElementsByClassName("next")[0];
    nextBtn.click();
}

function handlePost(url){
    const match = postIdRegex.exec(url);
    const postId = match[1];
    const title = document.getElementsByClassName("title")[0].innerText;
    GM_setValue(postId, title);
    if(pageRegex.test(url)){
        return;
    }

    const tagContainer = document.getElementById("tags");
    for(const tagSet of tagContainer.children){
        const tags = tagSet.getElementsByClassName("tags")[0];
        checkTags(tags);
    }

    const container = document.getElementById("related-container");
    checkPosts(container);
}

function checkTags(tags){
    for(const tag of tags.children){
        const nameTag = tag.getElementsByClassName("name")[0];
        if(nameTag == null){
            continue;
        }

        const name = nameTag.innerText;
        if(blacklist.includes(name)){
            addColor(tag, "#FF0000");
        }
        else if(warning.includes(name)){
            addColor(tag, "#FF9900");
        }
    }
}

function addColor(elem, color){
    elem.setAttribute("style", "color: " + color + ";");
}

function handleGallery(mainPage){
    if(mainPage){
        const popularContainer = document.getElementsByClassName("container index-container index-popular")[0];
        checkPosts(popularContainer);
    }

    const container = document.getElementsByClassName("container index-container")[0];
    checkPosts(container);
}

function checkPosts(postsParent){
    for(const post of postsParent.children){
        if(post.tagName != "DIV"){
            continue;
        }

        const classes = post.getAttribute("class");
        if (classes.includes("blacklisted")){
            continue;
        }

        const anchor = post.getElementsByTagName("a")[0];
        const href = anchor.getAttribute("href");
        postIdRegex.lastIndex = 0;
        const match = postIdRegex.exec(href);
        if(GM_getValue(match[1]) == null){
            continue;
        }

        fadePost(post);
    }
}

function fadePost(post){
    const img = post.getElementsByTagName("img")[0];
    img.setAttribute("style", "opacity: 20%;");
}

function checkIfReloadNeeded(){
    const errors = document.getElementsByTagName("h1");
    if(errors.length == 0){
        return;
    }

    const error = errors[0];
    if(error.innerText != "429 Too Many Requests"){
        return;
    }

    const timeout = getRandomInt(500, 1000);
    setTimeout(reload, timeout);
}

function reload(){
    location.reload();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cleanText(){
    const comments = document.getElementById("comments");
    for(const child of comments.children){
        const commentBody = child.getElementsByClassName("body")[0];
        let oldText = commentBody.innerText;
        let newText = oldText.replace(new RegExp("[\\u0300-\\u0e4e]+", "gm"), "").replace(commentCleaningRegex, "");
        commentBody.innerText = newText;
        if(newText !== oldText){
            console.log("Cleaned comment");
        }

        const username = child.getElementsByClassName("left")[0].getElementsByTagName("a")[0];
        oldText = commentBody.innerText;
        newText = oldText.replace(new RegExp("[\\u0300-\\u0e4e]+", "gm"), "").replace(commentCleaningRegex, "");
        commentBody.innerText = newText;
        if(newText !== oldText){
            console.log("Cleaned username");
        }
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function commentSectionHandler(){
    console.log("Waiting for comments");
    waitForElm("#comments > .comment").then((_) => {
        console.log("Found comments");
        setTimeout(() => {
            cleanText();
            linkReplies();
            anchorTagLinks();
        }, 100);
    });
}

function anchorTagLinks(){
    const comments = document.getElementById("comments");
    const children = comments.children;
    for(const comment of children){
        const body = comment.getElementsByClassName("body")[0];
        const words = body.innerHTML.split(" ");
        const links = [];
        let i = 0;
        for(const word of words){
            const [wordPart, punctuation] = getPunctuation(word);
            if (isNumeric(wordPart)){
                const link = {
                    text: wordPart,
                    href: `https://nhentai.net/g/${wordPart}/`,
                    punctuation: punctuation,
                    index: i,
                };
                links.push(link);
                //console.log(link);
            }
            else if(wordPart.startsWith("https://")){
                const link = {
                    text: wordPart,
                    href: wordPart,
                    punctuation: punctuation,
                    index: i,
                };
                links.push(link);
                //console.log(link);
            }
            i++;
        }

        const html = body.innerHTML.split(" ");
        for(const link of links){
            const anchorRaw = `<a href="${link.href}">${link.text}</a>`;
            const anchor = link.punctuation != null ? anchorRaw + link.punctuation : anchorRaw;
            //const toReplace = link.punctuation != null ? link.text + link.punctuation : link.text;
            //html.replace(toReplace, anchor);
            html[link.index] = anchor;
            console.log(html);
        }

        body.innerHTML = html.join(" ");
        //console.log(body);
    }
}

function getPunctuation(word) {
    const punctuation = ['.', ',', '!', '?', ';', ':'];
    let lastChar = word[word.length - 1];

    if (punctuation.includes(lastChar)) {
        return [word.slice(0, -1), lastChar];
    }

    return [word, null];
}

// See: https://stackoverflow.com/a/175787
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function linkReplies(){
    const comments = document.getElementById("comments");
    const children = comments.children;
    let spaces = 0;
    const commentLinks = {};
    for(let i = children.length - 1; i >= 0; i--){
        const child = children[i];
        const id = child.getAttribute("id");
        const bodyWrapper = child.getElementsByClassName("body-wrapper")[0];
        const username = bodyWrapper.getElementsByTagName("a")[0].innerText.toLowerCase().trim();
        //console.log("Username: \"" + username + "\"");
        const spaceCount = (username.match(/ /g) || []).length;
        spaces = Math.max(spaceCount, spaces);
        //console.log("Max Spaces: " + spaces);
        commentLinks[username] = id;
        const body = child.getElementsByClassName("body")[0];
        const bodyParts = body.innerText.split(" ");
        let bodyPartIndex = -1;
        for(const part of bodyParts){
            bodyPartIndex++;
            if(!part.startsWith("@")){
                continue;
            }

            let found = false;
            for(let j = 0; j <= spaces && !found; j++){
                // Remove '@'
                const extraParts = bodyParts.slice(bodyPartIndex + 1, bodyPartIndex + 1 + j).join(" ");
                const rawUsername = part.substring(1) + (extraParts === "" ? "" : " " + extraParts);
                const username = rawUsername.toLowerCase();
                //console.log("Tagged Username: \"" + username + "\"");
                for(const user in commentLinks){
                    //console.log(`Checking: ${user} === ${username}, Result: ${user === username}`);
                    if(user !== username && !username.startsWith(user)){
                        continue;
                    }

                    const id = commentLinks[user];
                    const anchor = "<a href=\"#" + id + "\">@" + rawUsername + "</a>";
                    const relpaceTarget = "@" + rawUsername;
                    //console.log("Replace Target: " + relpaceTarget + ", Replacement: " + anchor);
                    let bodyHtml = body.innerHTML;
                    bodyHtml = bodyHtml.replace(relpaceTarget, anchor);
                    //console.log(bodyHtml);
                    body.innerHTML = bodyHtml;
                    //console.log(body.innerHTML, body);
                    found = true;
                    break;
                }
            }
        }
    }
}