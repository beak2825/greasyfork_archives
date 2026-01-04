// ==UserScript==
// @name         Link to image from tuner
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Adds more UI features to the style tuner
// @match        https://tuner.midjourney.com/*
// @match        https://tuner.nijijourney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=midjourney.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478895/Link%20to%20image%20from%20tuner.user.js
// @updateURL https://update.greasyfork.org/scripts/478895/Link%20to%20image%20from%20tuner.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    window.extraTuners = [];
    let bottomDiv = document.createElement("div");
    bottomDiv.style.margin = "600px";
    document.body.appendChild(bottomDiv);

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function extractGuid(string) {
        let matches = string.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        if (matches.length > 0) return matches[0];
        else return null;
    }

    function parseNumber(inputString) {
        const match = inputString.match(/\d+/);
        if (match) { return parseInt(match[0], 10); }
        return null;
    }

    function plusOne(inputString) {
        let number = parseInt(inputString);
        return inputString.replace(number, number +1);
    }

    window.scrollToQuestion = function (event) {
        const question = event.target.dataset.question;
        let label = Array.from(document.getElementsByTagName("label")).filter(x => x.htmlFor == "question-" + question + "-answer-2")[0];
        label.scrollIntoView({behavior: "instant", block: "start"});
        window.scrollBy(0, -100)
    };

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();

        return (
            rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    function copySelections() {
        let selections = Array.from(document.getElementsByTagName("label")).filter(x => !x.htmlFor.includes("answer-2") && (x.innerHTML.includes("outline-width: 3px;") || x.innerHTML.includes("outline-width:3px;"))).map(x => x.htmlFor);
        navigator.clipboard.writeText(JSON.stringify(selections));
    }

    async function pasteSelections() {
        function isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        let clip = await navigator.clipboard.readText();
        if(isJsonString(clip)) {
            Array.from(document.getElementsByTagName("input")).filter(x => x.id.includes("answer-2")).forEach(x => x.click());
            JSON.parse(clip).forEach(name => {
                document.getElementById(name)?.click();
            });
        }
    }

    function getAnswer(question) {
        let label = Array.from(document.getElementsByTagName("label")).find(x => x.htmlFor.includes("question-" + question) && (x.innerHTML.includes("outline-width: 3px;") || x.innerHTML.includes("outline-width:3px;")));
        if (label) return parseNumber(label.htmlFor.replace("question-" + question, ""));
        else return false;
    }
    function setAnswer(question, value) {
        document.getElementById("question-" + question + "-answer-" + value)?.click();
    };

    function openViewer() {

        let lefts = Array.from(document.getElementsByTagName("label")).filter(x => x.htmlFor.includes("answer-1")).map(x => extractGuid(x.innerHTML));
        let rights = Array.from(document.getElementsByTagName("label")).filter(x => x.htmlFor.includes("answer-3")).map(x => extractGuid(x.innerHTML));
        console.log("rights", rights);
        let pairs = lefts.map(x => ({ left: x, right: rights.shift()}));

        let style = "display: inline; max-width: 25vw; max-height: 50vh; margin: 0px;";
        let divs = pairs.map((x, i) => `
        <div id=${i+1} class="pair" style="display: none; font-size: 0px;">
        <div style="display: grid;">
        <div>
        <img loading="lazy" src="https://cdn.midjourney.com/${x.left}/0_0.webp" style="${style}">
        <img loading="lazy" src="https://cdn.midjourney.com/${x.left}/0_1.webp" style="${style}">
        </div>
        <div>
        <img loading="lazy" src="https://cdn.midjourney.com/${x.left}/0_2.webp" style="${style}">
        <img loading="lazy" src="https://cdn.midjourney.com/${x.left}/0_3.webp" style="${style}">
        </div>
        </div>
        <div style="display: grid;">
        <div>
        <img loading="lazy" src="https://cdn.midjourney.com/${x.right}/0_0.webp" style="${style}">
        <img loading="lazy" src="https://cdn.midjourney.com/${x.right}/0_1.webp" style="${style}">
        </div>
        <div>
        <img loading="lazy" src="https://cdn.midjourney.com/${x.right}/0_2.webp" style="${style}">
        <img loading="lazy" src="https://cdn.midjourney.com/${x.right}/0_3.webp" style="${style}">
        </div>
        </div>
        </div>`).join("");

        let viewer = window.open('', window.location.pathname.split()[0], {popup: true});
        window.viewer = viewer;
        viewer.document.body.style.background = "black";
        viewer.document.body.style.margin = "0px";
        viewer.document.body.innerHTML = divs;

        let scriptTag = window.viewer.document.createElement("script");
        scriptTag.innerHTML = `document.getElementById("1").style.display = "flex";

        window.addEventListener("message", async (event) => {
            let target = document.getElementById(event.data);
            Array.from(document.getElementsByClassName("pair")).forEach(x => x.style.display = "none");
            target.style.display = "flex";
            Array.from(target.nextElementSibling.getElementsByTagName("img")).forEach(y => { y.loading = "eager"; });
            Array.from(target.previousElementSibling.getElementsByTagName("img")).forEach(y => { y.loading = "eager"; });
        });

        function attachModal(imgElement) {
            // Create modal element
            const modal = document.createElement('div');
            modal.style.display = 'none';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            modal.style.zIndex = '999';
            modal.style.overflow = 'auto';
            modal.style.cursor = 'pointer';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';

            // Create image element inside modal
            const modalImg = document.createElement('img');
            modalImg.loading = "lazy";
            modalImg.src = imgElement.src;
            modalImg.style.display = 'inline-block';
            modalImg.style.maxWidth = '100%';
            modalImg.style.maxHeight = '100%';

            modal.appendChild(modalImg);

            modal.addEventListener('click', function () {
                modal.style.display = 'none';
            });
            imgElement.addEventListener('click', function () {
                modal.style.display = 'flex';
            });

            document.body.appendChild(modal);
        }

        Array.from(document.getElementsByTagName("img")).forEach(x => attachModal(x));`

    viewer.document.body.appendChild(scriptTag);
    }

    // Arrow key navigation
    document.addEventListener('keydown', hotkey, false);
    function hotkey(e) {
        let current = parseInt(Array.from(document.getElementsByClassName("lg:absolute top-0 -left-16 lg:bg-neutral-300/5 w-6 lg:w-12 lg:h-12 flex items-center justify-center text-neutral-300/60 tabular-nums")).find(x => isInViewport(x))?.innerText);

        if (e.key == "ArrowRight" || e.key == "d") {
            if(current) current -= 1;
            if(getAnswer(current) == 1) setAnswer(current, 2);
            else setAnswer(current, 3);
        }
        if (e.key == "ArrowLeft" || e.key == "a") {
            if(current) current -= 1;
            if(getAnswer(current) == 3) setAnswer(current, 2);
            else setAnswer(current, 1);
        }
        if (e.key == "ArrowUp" || e.key == "w") {
            let target = Array.from(document.getElementsByClassName("lg:absolute top-0 -left-16 lg:bg-neutral-300/5 w-6 lg:w-12 lg:h-12 flex items-center justify-center text-neutral-300/60 tabular-nums"))
            .find(x => x.innerText == current - 1);
            if(!target) return;
            e.preventDefault();
            target.scrollIntoView({behavior: "instant", block: "start"});
            window.scrollBy(0, -100)
        }
        if (e.key == "ArrowDown"|| e.key == "s") {
            let target = Array.from(document.getElementsByClassName("lg:absolute top-0 -left-16 lg:bg-neutral-300/5 w-6 lg:w-12 lg:h-12 flex items-center justify-center text-neutral-300/60 tabular-nums"))
            .find(x => x.innerText == current + 1);
            if(!target) return;
            e.preventDefault();
            target.scrollIntoView({behavior: "instant", block: "start"});
            window.scrollBy(0, -100)
        }
    }

    // Scroll sync
    window.addEventListener("message", async (event) => {
        if(document.hasFocus()) return;
        let current = Array.from(
            document.getElementsByClassName("lg:absolute top-0 -left-16 lg:bg-neutral-300/5 w-6 lg:w-12 lg:h-12 flex items-center justify-center text-neutral-300/60 tabular-nums")).find(x => x.innerText == event.data);
        current.scrollIntoView({behavior: "instant", block: "start"});
        window.scrollBy(0, -100)
    }, false);

    window.onscroll = function() {
        let current = Array.from(document.getElementsByClassName("lg:absolute top-0 -left-16 lg:bg-neutral-300/5 w-6 lg:w-12 lg:h-12 flex items-center justify-center text-neutral-300/60 tabular-nums")).find(x => isInViewport(x));
        if(!current) return;

        if(window.viewer) {
            window.viewer.postMessage(parseNumber(current.innerText));
        }
        if(!document.hasFocus()) return;

        if(!window.opener) { // Origin window
            window.extraTuners.forEach(x => x.postMessage(current.innerText));
        }
        else { // Spawned window
            window.opener.postMessage(current.innerText);
        }
    };

    // Image buttons
    function addButtonToElement(targetElement) {
        let id = null;
        let matches = targetElement.innerHTML.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        if(matches?.length > 0) {
            id = matches[0];
        }
        else return;

        var button = document.createElement("a");
        button.href = "https://cdn.midjourney.com/" + id + "/grid_0.webp";
        button.innerText = "View";
        button.target = "_blank";

        button.style.position = "absolute";
        button.style.top = "0";
        button.style.left = "0";
        button.style.display = "none";
        button.style.backgroundColor = "black";
        button.style.color = "white";

        targetElement.addEventListener("mouseover", function () {
            button.style.display = "block";
        });
        targetElement.addEventListener("mouseout", function () {
            button.style.display = "none";
        });
        targetElement.appendChild(button);

        //Copy id button

        var button2 = document.createElement("button");
        button2.textContent = "Copy id";

        button2.style.position = "absolute";
        button2.style.top = "0";
        button2.style.right = "0";
        button2.style.display = "none";
        button2.style.backgroundColor = "black";
        button2.style.color = "white";

        targetElement.addEventListener("mouseover", function () {
            button2.style.display = "block";
        });
        targetElement.addEventListener("mouseout", function () {
            button2.style.display = "none";
        });
        button2.addEventListener("click", function () {
            navigator.clipboard.writeText(id);
        });
        targetElement.appendChild(button2);
    }

    var leftPane = document.createElement('div');
    leftPane.style.position = 'fixed';
    leftPane.style.top = '0';
    leftPane.style.left = '0';
    leftPane.style.width = '100px';
    leftPane.style.height = '100vh'
    leftPane.style.color = 'white';
    leftPane.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    leftPane.style.overflow = 'auto';
    leftPane.style.zIndex = '9999';
    document.body.appendChild(leftPane);


    if(!window.opener) {
        let windowButton = document.createElement("button");
        windowButton.textContent = "Scroll sync";
        windowButton.onclick = function () {
            let url = window.prompt("Enter tuner URL to sync with");
            if (url != null) window.extraTuners.push(window.open(url));
        };
        leftPane.appendChild(windowButton);
    }

    let viewerButton = document.createElement("button");
    viewerButton.textContent = "Open viewer";
    viewerButton.onclick = openViewer;
    leftPane.appendChild(viewerButton);

    let copyButton = document.createElement("button");
    copyButton.textContent = "Copy picks";
    copyButton.onclick = copySelections;
    leftPane.appendChild(copyButton);

    let pasteButton = document.createElement("button");
    pasteButton.textContent = "Paste picks";
    pasteButton.onclick = pasteSelections;
    leftPane.appendChild(pasteButton);

    let selectionsList = document.createElement('div');
    selectionsList.style.marginTop = "10px";
    leftPane.appendChild(selectionsList);

    let updateList = () => {
        let selections = Array.from(document.getElementsByTagName("label")).filter(x => !x.htmlFor.includes("answer-2") && (x.innerHTML.includes("outline-width: 3px;") || x.innerHTML.includes("outline-width:3px;"))).map(x => x.htmlFor);
        selectionsList.innerHTML = `<ul>${selections.map(x => x.replace("question-", "").replace("-answer-1", " - left").replace("-answer-3", " - right")).map(x => "<li style='cursor: pointer;' data-question=" + parseNumber(x) + ">" + plusOne(x) + "</li>").join("")}</ul>`;
        Array.from(selectionsList.firstChild.children).forEach(x => { x.onclick = window.scrollToQuestion });
    };
    document.body.onclick = updateList;
    updateList();

    await timeout(1200);
    Array.from(document.getElementsByTagName("picture")).forEach(x => addButtonToElement(x));

})();