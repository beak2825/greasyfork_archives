// ==UserScript==
// @name         Polru navigation buttons
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Clickable banners and navigation buttons for Endchan Polru board
// @author       Ananas
// @match        https://endchan.net/*
// @match        https://endchan.gg/*
// @match        https://endchan.org/*
// @icon         https://static-00.iconduck.com/assets.00/chipmunk-emoji-251x256-6pwz7m12.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461975/Polru%20navigation%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/461975/Polru%20navigation%20buttons.meta.js
// ==/UserScript==

//Detecting the domain
var currentDomain = window.location.hostname;
if (currentDomain.endsWith('.net')) {
    var url = 'https://endchan.net/polru/';
} else if (currentDomain.endsWith('.gg')) {
    url = 'https://endchan.gg/polru/';
} else if (currentDomain.endsWith('.org')) {
    url = 'https://endchan.org/polru/';
} else {
    url = 'https://endchan.net/polru/'; //.net as default if everything fails somehow
}

//Making polru banner clickable
var bannerImage = document.querySelector("img[src*='polru']");
bannerImage.setAttribute("onclick", "window.location.href = '" + url + "';");
bannerImage.style.cursor = "pointer";
bannerImage.setAttribute("title", "Chipmunk Homepage"); //gives an error on other pages and stops the script: Uncaught (in promise) TypeError: Cannot read properties of null (reading 'setAttribute')

//Making /polru/ - pol - Russian Edition text clickable
var labelName = document.querySelector("#labelName");
if (labelName.textContent.includes("polru")) {
    labelName.setAttribute("onclick", "window.location.href = '" + url + "';");
    labelName.style.cursor = "pointer";
    labelName.addEventListener("mouseenter", function() {
        labelName.style.textDecoration = "underline";
    });
    labelName.addEventListener("mouseleave", function() {
        labelName.style.textDecoration = "none";
    });
}

//Adding link to Polru main page at the bottom of the thread
var div_array = document.getElementsByClassName("de-thr-buttons");
var bottom_div = div_array[0];
var bottom_link = document.createElement("span");
var link_content = "Перейти на главную /polru";
bottom_link.innerText = link_content;
bottom_link.setAttribute("onclick", "window.location.href = '" + url + "';");
bottom_link.style.cursor = "pointer";
bottom_link.classList.add("de-abtn");
var square_bracket_L = document.createElement("span");
square_bracket_L.innerText = '[';
square_bracket_L.style.paddingLeft = "5px";
var square_bracket_R = document.createElement("span");
square_bracket_R.innerText = ']';
bottom_div.appendChild(square_bracket_L);
bottom_div.appendChild(bottom_link);
bottom_div.appendChild(square_bracket_R);

//Creating UP navigation button
var up_btn = document.createElement('img');
up_btn.src = "https://icon-library.com/images/arrow-down-icon/arrow-down-icon-6.jpg";

//Set the button's CSS styles
up_btn.style.position = "fixed";
up_btn.style.top = "15px";
up_btn.style.right = "10px";
up_btn.style.width = "4vw";
up_btn.style.height = "4vw";
up_btn.style.opacity = "0.1";
up_btn.style.cursor = "pointer";
up_btn.style.transform = "rotate(180deg)";

//Set the button's hover styles
up_btn.addEventListener("mouseenter", function() {
    up_btn.style.opacity = "1.0";
});
up_btn.addEventListener("mouseleave", function() {
    up_btn.style.opacity = "0.1";
});

//Click and scroll UP
up_btn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        //behavior: "smooth"
    });
});
document.body.appendChild(up_btn);

//Creating DOWN navigation button
var dwn_btn = document.createElement('img');
dwn_btn.src = "https://icon-library.com/images/arrow-down-icon/arrow-down-icon-6.jpg";

//Set the button's CSS styles
dwn_btn.style.position = "fixed";
dwn_btn.style.bottom = "15px";
dwn_btn.style.right = "10px";
dwn_btn.style.width = "4vw";
dwn_btn.style.height = "4vw";
dwn_btn.style.opacity = "0.1";
dwn_btn.style.cursor = "pointer";

//Set the button's hover styles
dwn_btn.addEventListener("mouseenter", function() {
    dwn_btn.style.opacity = "1.0";
});
dwn_btn.addEventListener("mouseleave", function() {
    dwn_btn.style.opacity = "0.1";
});

//Click and scroll DOWN
dwn_btn.addEventListener("click", function() {
    window.scrollTo({
        top: document.body.scrollHeight,
        //behavior: "smooth"
    });
});
document.body.appendChild(dwn_btn);