// ==UserScript==
// @name         Better Search - google.com Youtube, Reddit, StackOverflow, GitHub, GresyFork search
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Using this script, you can do Youtube, Reddit, StackOverflow, GitHub, GresyFork search in google.com
// @author       You
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478547/Better%20Search%20-%20googlecom%20Youtube%2C%20Reddit%2C%20StackOverflow%2C%20GitHub%2C%20GresyFork%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/478547/Better%20Search%20-%20googlecom%20Youtube%2C%20Reddit%2C%20StackOverflow%2C%20GitHub%2C%20GresyFork%20search.meta.js
// ==/UserScript==

let elementToDelete = document.getElementById("SIvCob");

if (elementToDelete !== null) {
    elementToDelete.remove();
}

document.getElementsByName("btnK")[1].remove();
document.getElementsByName("btnI")[1].remove();
document.getElementsByName("btnK")[0].remove();
document.getElementsByName("btnI")[0].remove();


let div1 = document.getElementsByClassName("FPdoLc lJ9FBc")[0].childNodes[1];
let div2 = document.getElementsByClassName("lJ9FBc")[0].childNodes[3];
let html = '<input style="margin: 4px;" class="gNO89b" value="Google Search" aria-label="Google Search" name="btnK" role="button" tabindex="0" type="submit" data-ved="0ahUKEwi0m6O7hpuCAxXoQ_EDHWTCBB8Q4dUDCBI"><input style="margin: 4px;" class="gNO89b" value="YouTube Search" aria-label="YouTube Search" name="btnK" role="button" tabindex="0" type="submit" data-ved="0ahUKEwi0m6O7hpuCAxXoQ_EDHWTCBB8Q4dUDCBI"><input style="margin: 4px;" class="gNO89b" value="Reddit Search" aria-label="Reddit Search" name="btnK" role="button" tabindex="0" type="submit" data-ved="0ahUKEwi0m6O7hpuCAxXoQ_EDHWTCBB8Q4dUDCBI"><br><input style="margin: 4px;" class="gNO89b" value="StackOverflow Search" aria-label="StackOverflow Search" name="btnK" role="button" tabindex="0" type="submit" data-ved="0ahUKEwi0m6O7hpuCAxXoQ_EDHWTCBB8Q4dUDCBI"><input style="margin: 4px;" class="gNO89b" value="GitHub Search" aria-label="GitHub Search" name="btnK" role="button" tabindex="0" type="submit" data-ved="0ahUKEwi0m6O7hpuCAxXoQ_EDHWTCBB8Q4dUDCBI"><input style="margin: 4px;" class="gNO89b" value="GreasyFork Search" aria-label="GreasyFork Search" name="btnK" role="button" tabindex="0" type="submit" data-ved="0ahUKEwi0m6O7hpuCAxXoQ_EDHWTCBB8Q4dUDCBI">';

let a = document.createElement("a");

div1.innerHTML += html;
div2.innerHTML += html;

div2.style.marginTop = "-16px";

document.getElementsByClassName("oBa0Fe aciXEb")[0].remove();

let textarea = document.querySelector("textarea");

let googleSearch;
let youtubeSearch;
let redditSearch;
let stackoverflowSearch;
let githubSearch;
let greasyforkSearch;

googleSearch = div1.childNodes[1];
youtubeSearch = div1.childNodes[2];
redditSearch = div1.childNodes[3];
stackoverflowSearch = div1.childNodes[5];
githubSearch = div1.childNodes[6];
greasyforkSearch = div1.childNodes[7];

googleSearch.addEventListener("click", e => {
    e.preventDefault();

    a.href = "https://www.google.com/search?q=" + textarea.value;
    a.click();
});

youtubeSearch.addEventListener("click", e => {
    e.preventDefault();

    a.href = "https://www.youtube.com/results?search_query=" + textarea.value;
    a.click();
});

redditSearch.addEventListener("click", e => {
    e.preventDefault();

    if (textarea.value.slice(0, 2) == "r/") {
        a.href = "https://www.reddit.com/" + textarea.value;
    } else if (textarea.value.slice(0, 2) == "u/") {
        a.href = "https://www.reddit.com/" + textarea.value;
    } else {
        a.href = "https://www.reddit.com/search/?q=" + textarea.value;
    }

    a.click();
});

stackoverflowSearch.addEventListener("click", e => {
    e.preventDefault();

    a.href = "https://stackoverflow.com/search?q=" + textarea.value;
    a.click();
});

githubSearch.addEventListener("click", e => {
    e.preventDefault();

    a.href = "https://github.com/search?q=" + textarea.value;
    a.click();
});

greasyforkSearch.addEventListener("click", e => {
    e.preventDefault();

    if (textarea.value.slice(textarea.value.length - 8) == " scripts") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 8);
    } else if (textarea.value.slice(textarea.value.length - 6) == " hacks") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 6);
    } else if (textarea.value.slice(textarea.value.length - 7) == " cheats") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 7);
    } else if (textarea.value.slice(textarea.value.length - 5) == " mods") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 5);
    } else if (textarea.value.slice(textarea.value.length - 7) == " script") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 7);
    } else if (textarea.value.slice(textarea.value.length - 5) == " hack") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 5);
    } else if (textarea.value.slice(textarea.value.length - 6) == " cheat") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 6);
    } else if (textarea.value.slice(textarea.value.length - 4) == " mod") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 4);
    } else {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value;
    }

    a.click();
});

googleSearch = div2.childNodes[1];
youtubeSearch = div2.childNodes[2];
redditSearch = div2.childNodes[3];
stackoverflowSearch = div2.childNodes[5];
githubSearch = div2.childNodes[6];
greasyforkSearch = div2.childNodes[7];

googleSearch.addEventListener("click", e => {
    e.preventDefault();

    a.href = "https://www.google.com/search?q=" + textarea.value;
    a.click();
});

youtubeSearch.addEventListener("click", e => {
    e.preventDefault();

    a.href = "https://www.youtube.com/results?search_query=" + textarea.value;
    a.click();
});

redditSearch.addEventListener("click", e => {
    e.preventDefault();

    if (textarea.value.slice(0, 2) == "r/") {
        a.href = "https://www.reddit.com/" + textarea.value;
    } else if (textarea.value.slice(0, 2) == "u/") {
        a.href = "https://www.reddit.com/" + textarea.value;
    } else {
        a.href = "https://www.reddit.com/search/?q=" + textarea.value;
    }

    a.click();
});

stackoverflowSearch.addEventListener("click", e => {
    e.preventDefault();

    a.href = "https://stackoverflow.com/search?q=" + textarea.value;
    a.click();
});

githubSearch.addEventListener("click", e => {
    e.preventDefault();

    a.href = "https://github.com/search?q=" + textarea.value;
    a.click();
});

greasyforkSearch.addEventListener("click", e => {
    e.preventDefault();

    if (textarea.value.slice(textarea.value.length - 8) == " scripts") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 8);
    } else if (textarea.value.slice(textarea.value.length - 6) == " hacks") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 6);
    } else if (textarea.value.slice(textarea.value.length - 7) == " cheats") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 7);
    } else if (textarea.value.slice(textarea.value.length - 5) == " mods") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 5);
    } else if (textarea.value.slice(textarea.value.length - 7) == " script") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 7);
    } else if (textarea.value.slice(textarea.value.length - 5) == " hack") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 5);
    } else if (textarea.value.slice(textarea.value.length - 6) == " cheat") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 6);
    } else if (textarea.value.slice(textarea.value.length - 4) == " mod") {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value.slice(0, textarea.value.length - 4);
    } else {
        a.href = "https://greasyfork.org/en/scripts?q=" + textarea.value;
    }

    a.click();
});

div1.innerHTML += '<p>Better Search by PGH_475</p><p>Want to play a cool game? Try <a href="https://www.plazmaburst2.com/">Plazma Burst 2</a>!</p>';