// ==UserScript==
// @name         ChatGPT avatar
// @namespace    Anong0u0
// @version      1.2
// @description  Change the ChatGPT avatar to your liking.
// @author       Anong0u0
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/492871/ChatGPT%20avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/492871/ChatGPT%20avatar.meta.js
// ==/UserScript==



// Paste and change the image url here, between the "double apostrophes"
const GPT_AvatarURL = "https://pixiv.cat/102439408-1.jpg",
     User_AvatarURL = ""

// You can edit avatar size here, default is "2rem"
const  GPT_AvatarSize = "2.5rem",
      User_AvatarSize = "2.5rem";




// Don't edit below if you don't know what are you doing
const css = document.createElement("style")
css.innerHTML = `
/* user avatar */
main [data-testid="fruit-juice-profile"] > div > div {
    width: ${User_AvatarSize};
    height: ${User_AvatarSize};
    background-image: url("${User_AvatarURL}");
    background-size: cover;
}
main [data-testid="fruit-juice-profile"] > div > div img {
    width: auto;
    height: auto;
    display: ${User_AvatarURL ? "none":"block"};
}

/* GPT avatar */
main div.gizmo-bot-avatar {
    background-image: url("${GPT_AvatarURL}");
    background-size: cover;
    width: ${GPT_AvatarSize} !important;
    height: ${GPT_AvatarSize} !important;
}
main div.gizmo-bot-avatar div {background: unset}
main svg[width="41"][height="41"][viewBox="0 0 41 41"][fill="none"] {
    width: auto;
    height: auto;
    display: ${GPT_AvatarURL ? "none":"block"}
}
`
document.body.append(css)





