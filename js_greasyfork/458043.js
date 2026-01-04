// ==UserScript==
// @name         Discord Clipboard Queue
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Copies the next clip from a list every time you paste in the Discord web app
// @author       Anonymous
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458043/Discord%20Clipboard%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/458043/Discord%20Clipboard%20Queue.meta.js
// ==/UserScript==

window.nextClipDiv = null;
window.clipList = null;
window.selectedClip = null;

window.localforage.config({
    name        : 'clipboardQueue',
    version     : 1.0,
    size        : 4980736,
    storeName   : 'keyvaluepairs',
    description : ''
});

(async function() {
    'use strict';

    let menuHtml =`
<div style="display:flex;width:100%;margin-bottom:2px;">
<input style="width:100%;" type="text" id="permutationsInput" />
<button id="permutationsButton" style="width:140px;">Load Permutations</button>
</div>
<div style="display:flex;">
<select style="width:100%;" id="clipList">
  <option value="">[no clips loaded]</option>
</select>
<button id="recopyButton" style="width:40px;">Copy</button>
<button id="loadClipsButton" style="width:100px;">Load Clips</button>
</div>
`;

    function save() {
        if(window.nextClipDiv) {
            window.selectedClip = window.clipList.value;
            window.localforage.setItem("clipQueueDiv", window.nextClipDiv.innerHTML);
            window.localforage.setItem("selectedClip", document.getElementById("clipList").value);
            window.localforage.setItem("permutationPrompt", document.getElementById("permutationsInput").value);
        }
    }
    async function load() {
        let item = await window.localforage.getItem("clipQueueDiv");
        let selected = await window.localforage.getItem("selectedClip");
        let permutationPrompt = await window.localforage.getItem("permutationPrompt");
        if(item) menuHtml = item;
        if (selected) window.selectedClip = selected;
        if (permutationPrompt) window.permutationPrompt = permutationPrompt;
    }

    async function loadClips() {
        let text = await navigator.clipboard.readText();
        let split = text.split(/\r?\n|\r|\n/g);
        split.push("[end of clips]");
        navigator.clipboard.writeText(split[0]);
        window.clipList.innerHTML = split.map(x => `<option value="${x}">${x}</option>`).join("");
        save();
    }

    async function reCopy() {
        navigator.clipboard.writeText(window.clipList.value);
    }

    async function loadNextClip() {
        let i = window.clipList.selectedIndex;
        if(i != window.clipList.options.length -1) {
            if(window.clipList.value == await navigator.clipboard.readText()){
                window.clipList.options[++i%window.clipList.options.length].selected = true;
            }
            navigator.clipboard.writeText(window.clipList.value);
        }
        save();
    }

    function bindPasteEvent() {
        let target = document.querySelector('[data-slate-node="element"]')?.parentElement?.parentElement?.parentElement;
        if(target){
            if(!target.onpaste) target.onpaste = loadNextClip;
            return true;
        }
        else return false;
    }

    function getPermutations() {
        let input = document.getElementById("permutationsInput").value;
        let groups = input.match(/{.+?}/g).map(x => (x.replace("{", "").replace("}", "").split(",").map(y => ({ group: x, variant: y}))));
        let combinations = getAllCombinations(groups);
        let prompts = combinations.map(x => {
            let prompt = input;
            x.forEach(y => { prompt = prompt.replace(y.group, y.variant) });
            return "/imagine prompt:" + prompt;
        });
        prompts.push("[end of permutations]");
        navigator.clipboard.writeText(prompts[0]);
        window.clipList.innerHTML = prompts.map(x => `<option value="${x}">${x}</option>`);
        save();
    }

    function getAllCombinations(arrays) {
        const result = [];
        const recursive = (current, remaining) => {
            if (remaining.length === 0) {
                result.push(current);
            } else {
                const [head, ...tail] = remaining;
                for (const element of head) {
                    recursive([...current, element], tail);
                }
            }
        };
        recursive([], arrays);
        return result;
    }

    async function init() {
        while(true){
            if(bindPasteEvent()){

                if(!window.nextClipDiv) {
                    window.nextClipDiv = document.createElement('div');
                    window.nextClipDiv.style = "margin-bottom:12px;";
                    window.nextClipDiv.innerHTML = menuHtml;
                }

                document.querySelector('[class="form-3gdLxP"]').appendChild(window.nextClipDiv);
                document.getElementById("loadClipsButton").onclick = loadClips;
                document.getElementById("recopyButton").onclick = reCopy;
                document.getElementById("permutationsButton").onclick = getPermutations;

                window.clipList = document.getElementById("clipList");

                if(window.selectedClip) window.clipList.value = window.selectedClip;
                if(window.permutationPrompt) document.getElementById("permutationsInput").value = window.permutationPrompt;

                if(!window.clipList.onchange) {
                    window.clipList.onchange = () => {
                        navigator.clipboard.writeText(window.clipList.value);
                        save();
                    }
                }

                break;
            }
            await timeout(1000);
        }
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var oldHref = document.location.href;
    // Init again on href change
    window.onload = function() {
        var bodyList = document.querySelector("body")
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    init();
                }
            });
        });
        var config = {
            childList: true,
            subtree: true
        };
        observer.observe(bodyList, config);
    };

    await load();
    init();

})();