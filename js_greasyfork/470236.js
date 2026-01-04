// ==UserScript==
// @name     	    Hide or Remove YouTube Shorts
// @description	    on each and every page except the Shorts page.
// @version  	    1.2
// @grant    	    none
// @match    	    https://www.youtube.com/*
// @exclude 	    https://www.youtube.com/shorts/*
// @license         MIT
// @namespace       Hide or Remove YouTube Shorts automatically
// @downloadURL https://update.greasyfork.org/scripts/470236/Hide%20or%20Remove%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/470236/Hide%20or%20Remove%20YouTube%20Shorts.meta.js
// ==/UserScript==

var videoPanels = 0;
var contents = null;

//Find page contents.
(() => {
    let interval = setInterval(() => {
        let query = 'ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer';
        contents = document.querySelectorAll(query)[0].__shady_native_childNodes[12];

        if(contents) {
            clearInterval(interval);
            init();
        }
    }, 500);
})()

function init() {
    let slider = createSlider();

    let refresh = () => {
        setOpacity(slider.value);
        requestAnimationFrame(refresh);
    }

    requestAnimationFrame(refresh);
}

function createSlider() {
    let slider = document.createElement("input");

    slider.type = "range";
    slider.min = "0";
    slider.max = "1";
    slider.step = "0.05";
    slider.value = getOpacity() || "0.5"; // get saved value or use default
    slider.style.width = "30%";

    //Update opacity on change.
    slider.addEventListener("input", async (e) => setOpacity(e.target.value));

    //add the slider to the end div.
    let endDiv = document.getElementById("end");
    endDiv.prepend(slider);

    return slider;
}

function getOpacity() {
    return localStorage.getItem("opacity");
}

async function setOpacity(v) {
    let vp = contents.__shady_native_childElementCount;

    if(vp != videoPanels || getOpacity() != v) {
        videoPanels = vp;

        await new Promise(r => setTimeout(r, 200));

        localStorage.setItem("opacity", v);
        let shorts = getShorts();

        for(let s of shorts) {
            s.style.opacity = v;
        }
    }
}

function getShorts() {
    let videos = [...document.querySelectorAll("#dismissible.style-scope.ytd-rich-grid-media")];
    let shorts = [];

    for(let video of videos) {
        let content = video.__shady_native_textContent;

        if(content.includes('SHORTS') ) {
            shorts.push(video);
        }
    }

    return shorts;
}
