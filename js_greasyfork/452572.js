// ==UserScript==
// @name         AdultConfessions.com Toggle Stories
// @namespace    https://adultconfessions.com/
// @version      1.1
// @license      GPLv3
// @description  Provides a toggle button for stories on AdultConfessions.com, and hides ads
// @author       ceodoe
// @match        https://adultconfessions.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adultconfessions.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/452572/AdultConfessionscom%20Toggle%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/452572/AdultConfessionscom%20Toggle%20Stories.meta.js
// ==/UserScript==
let hiddenPosts = GM_getValue("ACTS_HiddenPosts", new Array(0));

GM_addStyle(`
    .storyToggler {
        cursor: pointer;
    }

    .post-adverts, div[style="padding-bottom:6px"] {
        display: none !important;
    }
`);


let posts = document.querySelectorAll("div.post");

for(let i = 0; i < posts.length; i++) {
    // Fix it so that the entire post isn't a link, only the headline
    let link = posts[i].querySelector(`a[href^="story-"]`);
    let story = posts[i].querySelector("a > div.story");
    let storyID = link.href.match(/([0-9]+)/i)[0];
    link.insertAdjacentElement("afterend", story);

    // Create toggle element
    let toggleElement = document.createElement("span");
    toggleElement.classList.add("storyToggler");
    toggleElement.innerHTML = `[Toggle story]`;
    toggleElement.storyID = storyID;
    toggleElement.onclick = function() {
        let post = this.nextElementSibling;

        if(post.style.display == "none") {
            post.style.display = "block";
            this.innerHTML = `[Toggle story]`;

            let foundIndex = hiddenPosts.indexOf(this.storyID);
            if(foundIndex > -1) {
                hiddenPosts.splice(foundIndex, 1);
            }
        } else {
            post.style.display = "none";
            this.innerHTML = `[Toggle story] - ${post.querySelector("a > h1.story_title > span").innerHTML}`;
            hiddenPosts.push(this.storyID);
        }

        GM_setValue("ACTS_HiddenPosts", hiddenPosts);
    };

    // Wrap post contents in a div so we can easily hide all of it
    posts[i].innerHTML = `<div class="postWrapper">${posts[i].innerHTML}</div>`;
    posts[i].insertAdjacentElement("afterbegin", toggleElement);

    // Has post been hidden before? Hide it now
    if(hiddenPosts.includes(storyID)) {
        toggleElement.nextElementSibling.style.display = "none";
        toggleElement.innerHTML = `[Toggle story] - ${toggleElement.nextElementSibling.querySelector("a > h1.story_title > span").innerHTML}`;
    }
}