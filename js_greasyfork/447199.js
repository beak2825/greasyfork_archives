"use strict";
// ==UserScript==
// @name        Thirty Dollar Rewrite
// @namespace   TempoOptimiser
// @match       https://thirtydollar.website/
// @grant       none
// @version     1.4.5
// @author      TempoOptimiser
// @description Rewrites Thirty Dollar Website's code to use an accurate audio engine
// @license     MIT; https://spdx.org/licenses/MIT.html
// @downloadURL https://update.greasyfork.org/scripts/447199/Thirty%20Dollar%20Rewrite.user.js
// @updateURL https://update.greasyfork.org/scripts/447199/Thirty%20Dollar%20Rewrite.meta.js
// ==/UserScript==
// SPDX-License-Identifier: MIT
/*
Copyright 2022 TempoOptimiser

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// Portions of this script were authored by GDColon and modified by
// TempoOptimiser. They are marked as necessary.
// Updated as of version s (🗿) and welp (💾).
// TEMPORARY HACK until I figure out how to get unsavedChanges working.
window.setUnsavedChanges = function (unsaved) {
    unsavedChanges = !!unsaved;
    // don't disable the button
    $("#saveBtn").removeClass("alreadySaved");
};
window.setUnsavedChanges(true);
// This code is authored by GDColon, with minor adjustments by TempoOptimiser.
// As a result, the code below is licensed under the same license as Thirty
// Dollar Website (i.e. GDColon has rights to this code).
// (hey GDColon, feel free to take this code without attribution)
// hack to work around quick saving not working due to Safe Browsing
window.quickSave = async function () {
    if (!saveLocation) {
        $("#downloadBtn").trigger("click"); // save as
        return;
    }
    let saveData = generateSequenceFile();
    if (!saveData.length)
        return;
    try {
        const writable = await saveLocation.createWritable();
        await writable.write(saveData);
        setUnsavedChanges(false);
        await writable.close();
    }
    catch (e) {
        alert(`An error occurred when quicksaving: ${e}\nFalling back to Save As.`);
        $("#downloadBtn").trigger("click"); // save as
    }
};
let chordOption = 2 /* ARPEGGIATE_AND_DELAY_OTHERS_WITHIN_SAME_COMBINE */;
const chordOptionUi = [
    {
        value: 0 /* NO_ARPEGGIATE */,
        short: "No delay",
        long: "All notes within a combine play together at the same time.",
    },
    {
        value: 1 /* ARPEGGIATE_AND_ONLY_DELAY_CHORD */,
        short: "Delay notes within the same chord",
        long: "Every note in a combine which has the same sound, but a different " +
            "pitch to the previous one, is played 10 milliseconds after the " +
            "previous one. All other notes in the combine are not delayed.",
    },
    {
        value: 2 /* ARPEGGIATE_AND_DELAY_OTHERS_WITHIN_SAME_COMBINE */,
        short: "Delay notes within the same combine",
        long: "Every note in a combine which has the same sound, but a different " +
            "pitch to the previous one, delays itself and all notes after it in " +
            "the same combine by an additional 10 milliseconds. All notes after " +
            "the combine are not delayed.",
    },
    {
        value: 3 /* ARPEGGIATE_AND_DELAY_EVERYTHING_ELSE */,
        short: "Delay everything afterwards (default)",
        long: "Every note in a combine which has the same sound, but a different " +
            "pitch to the previous one, delays itself and ALL notes after it by " +
            "an additional 10 milliseconds - including notes after the combine. " +
            "This is the default behaviour of the website.",
    },
];
const style = `
.options label, .options select, .options input {
  font-family: Lato, Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: white;
}
.options select, .options input {
  background-color: black;
}
.options label {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-right: 10px;
}
.options {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  background-color: rgb(0, 0, 0, 0.25);
  margin-bottom: 18px;
  padding: 10px;
  border-radius: 8px;
}
.options div {
  display: flex;
  justify-content: center;
}
.options input[type="checkbox"] {
  height: inherit;
}
#sequence p {
  top: 35px !important;
}
#sequence img {
  margin: 0 !important;
  padding: 6px !important;
}
#sequence div {
  overflow-y: visible !important;
}
.options input {
  font-weight: revert;
  width: revert;
  height: revert;
  font-size: 16px;
}
.options input::-webkit-outer-spin-button,
.options input::-webkit-inner-spin-button {
  -webkit-appearance: auto !important;
  margin: revert;
}
`;
// NOTE: This will fail if the script is run before the HTML is loaded.
const sequenceDiv = document.getElementById("sequence");
// For some reason this has a DOMSubtreeModified listener to set scrollTop to
// 200. Remove it to make loading faster.
// This should hopefully avoid the scroll events which cause additional
// scrollTop to 200 setters.
// ...
// Turns out the reason it was done this was so wheel events don't scroll the
// document. We can fix that in another way.
$(sequenceDiv).off("DOMSubtreeModified");
function preventScroll(ev) {
    var _a;
    if (ev.target instanceof HTMLElement &&
        (ev.target.parentElement === sequenceDiv ||
            ((_a = ev.target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === sequenceDiv)) {
        ev.preventDefault();
    }
}
sequenceDiv.addEventListener("wheel", preventScroll);
sequenceDiv.addEventListener("touchmove", preventScroll);
// For good measure...
$.fn.scrollTop = function (value) {
    if (value !== undefined) {
        return this;
    }
    else {
        return this[0].scrollTop;
    }
};
let chordOptionSelect = undefined;
let scrollWindowLines = -1;
let scrollWindowLinesInput = undefined;
let smoothScroll = false;
let smoothScrollInput = undefined;
function setOptionsEnabled(enabled) {
    if (chordOptionSelect) {
        chordOptionSelect.disabled = !enabled;
    }
    if (scrollWindowLinesInput) {
        scrollWindowLinesInput.disabled = !enabled;
    }
    if (smoothScrollInput) {
        smoothScrollInput.disabled = !enabled;
    }
}
function createUi() {
    const styleEl = document.createElement("style");
    styleEl.textContent = style;
    document.head.appendChild(styleEl);
    const insertBefore = document.getElementById("sequence").parentElement;
    const parentDiv = document.createElement("div");
    {
        const infoBox = document.createElement("div");
        infoBox.classList.add("infobox");
        parentDiv.appendChild(infoBox);
        {
            const header = document.createElement("h1");
            header.textContent = "Thirty Dollar Rewrite options";
            infoBox.appendChild(header);
            const span = document.createElement("span");
            infoBox.appendChild(span);
            {
                const p = document.createElement("p");
                p.textContent = "Hover over options for a description";
                span.appendChild(p);
            }
        }
        const optionsDiv = document.createElement("div");
        optionsDiv.classList.add("options");
        parentDiv.appendChild(optionsDiv);
        {
            const chordOptionDiv = document.createElement("div");
            optionsDiv.appendChild(chordOptionDiv);
            {
                const chordOptionLabel = document.createElement("label");
                chordOptionLabel.setAttribute("for", "chord-option");
                chordOptionLabel.textContent = "Chord playback:";
                chordOptionDiv.appendChild(chordOptionLabel);
                chordOptionSelect = document.createElement("select");
                chordOptionSelect.id = "chord-option";
                for (let i = 0; i < chordOptionUi.length; i++) {
                    const option = chordOptionUi[i];
                    const selected = chordOption === option.value;
                    // Options have value (index of chordOptionUi).
                    const optionEl = new Option(option.short, i.toFixed(), selected, selected);
                    optionEl.title = option.long;
                    chordOptionSelect.add(optionEl);
                    if (selected) {
                        chordOptionDiv.title = option.long;
                    }
                }
                chordOptionSelect.addEventListener("input", function () {
                    const index = Number(this.value);
                    const option = chordOptionUi[index];
                    chordOption = option.value;
                    chordOptionDiv.title = option.long;
                });
                chordOptionDiv.appendChild(chordOptionSelect);
            }
            const scrollWindowLinesDiv = document.createElement("div");
            scrollWindowLinesDiv.title =
                "If set to -1: The screen does not automatically scroll down when " +
                    "you play the song.\n" +
                    "Otherwise, this sets how many rows need to be played before the " +
                    "screen automatically scrolls down. Lower = more scrolling, higher = " +
                    "less scrolling.";
            optionsDiv.appendChild(scrollWindowLinesDiv);
            {
                const scrollWindowLinesLabel = document.createElement("label");
                scrollWindowLinesLabel.setAttribute("for", "scroll-window-lines-option");
                scrollWindowLinesLabel.textContent =
                    "Rows to play before scrolling the screen";
                scrollWindowLinesDiv.appendChild(scrollWindowLinesLabel);
                scrollWindowLinesInput = document.createElement("input");
                scrollWindowLinesInput.id = "scroll-window-lines-option";
                scrollWindowLinesInput.type = "number";
                scrollWindowLinesInput.min = "-1";
                scrollWindowLinesInput.max = "15";
                scrollWindowLinesInput.step = "2";
                scrollWindowLinesInput.value = scrollWindowLines.toFixed();
                scrollWindowLinesInput.addEventListener("change", function () {
                    const value = Number(this.value);
                    scrollWindowLines = value;
                    // Enforce scrollWindowLines is 1 mod 2.
                    if (scrollWindowLines < 0) {
                        scrollWindowLines = -1;
                    }
                    else {
                        scrollWindowLines = Math.min(((scrollWindowLines >> 1) << 1) + 1, 15);
                    }
                    if (scrollWindowLines != value) {
                        this.value = scrollWindowLines.toFixed();
                    }
                });
                scrollWindowLinesDiv.appendChild(scrollWindowLinesInput);
            }
            const smoothScrollDiv = document.createElement("div");
            smoothScrollDiv.title =
                "Whether the auto-scrolling is smooth. If unchecked, the window's " +
                    'scroll "snaps" to the next scroll position.';
            optionsDiv.appendChild(smoothScrollDiv);
            {
                const smoothScrollLabel = document.createElement("label");
                smoothScrollLabel.setAttribute("for", "smooth-scroll-option");
                smoothScrollLabel.textContent = "Smoothly auto-scroll screen?";
                smoothScrollDiv.appendChild(smoothScrollLabel);
                smoothScrollInput = document.createElement("input");
                smoothScrollInput.id = "smooth-scroll-option";
                smoothScrollInput.type = "checkbox";
                smoothScrollInput.checked = smoothScroll;
                smoothScrollInput.addEventListener("input", function () {
                    smoothScroll = this.checked;
                });
                smoothScrollDiv.appendChild(smoothScrollInput);
            }
        }
    }
    insertBefore.insertAdjacentElement("beforebegin", parentDiv);
}
window.addEventListener("load", createUi);
let audioContext = new AudioContext();
const pendingSounds = new Set();
// sound: absn
const overrideableSounds = new Map();
let sequencerInstance = undefined;
const soundToAudioBufferMap = new Map();
async function soundToAudioBuffer(sound) {
    const existing = soundToAudioBufferMap.get(sound);
    if (existing) {
        return existing;
    }
    let audioBuffer;
    // special case _pause
    if (sound.endsWith("_pause.wav")) {
        audioBuffer = audioContext.createBuffer(1, 1, audioContext.sampleRate);
    }
    else {
        const req = await fetch(sound);
        const arrayBuffer = await req.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    }
    soundToAudioBufferMap.set(sound, audioBuffer);
    return audioBuffer;
}
function resetAudioContext() {
    audioContext.close();
    audioContext = new AudioContext();
    pendingSounds.clear();
    overrideableSounds.clear();
    sequencerInstance === null || sequencerInstance === void 0 ? void 0 : sequencerInstance.forceStop();
    sequencerInstance = undefined;
}
function webAudioPlaySound(sound, overrideable, time, pitch = 0, volume = 0.5) {
    var _a;
    // special case _pause
    if (sound === "_pause") {
        return undefined;
    }
    if (overrideable === 2 /* OVERRIDE */) {
        (_a = overrideableSounds.get(sound)) === null || _a === void 0 ? void 0 : _a.stop();
    }
    const absn = new AudioBufferSourceNode(audioContext, {
        buffer: soundToAudioBufferMap.get(sound),
        playbackRate: Math.pow(2, pitch / 12),
    });
    const gainNode = new GainNode(audioContext, {
        gain: volume,
    });
    absn.connect(gainNode);
    gainNode.connect(audioContext.destination);
    absn.addEventListener("ended", () => {
        absn.disconnect();
        gainNode.disconnect();
        pendingSounds.delete(absn);
        if (overrideable !== 0 /* NOT_OVERRIDEABLE */ &&
            overrideableSounds.get(sound) === absn) {
            overrideableSounds.delete(sound);
        }
    });
    absn.start(time);
    pendingSounds.add(absn);
    if (overrideable !== 0 /* NOT_OVERRIDEABLE */) {
        overrideableSounds.set(sound, absn);
    }
    return absn;
}
function webAudioStopSounds() {
    if (sequencerInstance) {
        sequencerInstance.forceStop();
    }
    for (const sound of pendingSounds) {
        // The event listener will clean itself up.
        sound.stop();
    }
}
// Preload intros.
soundToAudioBuffer(intros[intro].path);
// Event listeners are triggered in the order they are added, so we can get the
// updated intro from the original event listener.
document.getElementById("caption").addEventListener("click", () => {
    soundToAudioBuffer(intros[intro].path);
});
// "pitch" is used as a playback speed in the original...
// we do a little trolling
// (This is to prevent any floating point errors from converting to and from
// percent.)
window.semitonesToPercent = function (semitones) {
    return Number(semitones);
};
window.playSound = async function (name, pitch = 0, stopPrev) {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    await soundToAudioBuffer(name);
    // pitch is now semitones
    webAudioPlaySound(name, stopPrev ? 2 /* OVERRIDE */ : 1 /* OVERRIDEABLE */, undefined, pitch, volume);
};
window.startSequence = async function (instant = false) {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    if (active || document.getElementById("sequence").childElementCount === 0) {
        return;
    }
    webAudioStopSounds();
    // taken verbatim from the website
    active = true;
    $(".playInfo").hide();
    $(".stopInfo").show();
    setOptionsEnabled(false);
    sequencerInstance = new Sequencer();
    await sequencerInstance.prepareBuffers();
    let startTime = MIN_START_AFTER_SECONDS;
    if (!instant) {
        const introSound = intros[intro].path;
        const buffer = await soundToAudioBuffer(introSound);
        webAudioPlaySound(introSound, 0 /* NOT_OVERRIDEABLE */, undefined, undefined, 1);
        startTime = buffer.duration;
    }
    sequencerInstance.startAfter(startTime);
};
window.stopSounds = webAudioStopSounds;
const originalCancel = window.cancel;
window.cancel = function (immediate) {
    setOptionsEnabled(true);
    originalCancel(immediate);
};
window.loadSequence = function (data) {
    if (!data)
        return;
    const nameToEl = new Map();
    for (const soundEl of document.getElementById("icons").children) {
        const name = soundEl.getAttribute("str");
        if (!name) {
            continue;
        }
        nameToEl.set(name, soundEl);
    }
    for (const actionEl of document.getElementById("actions").children) {
        const name = actionEl.getAttribute("action");
        if (!name) {
            continue;
        }
        nameToEl.set("!" + name, actionEl);
    }
    sequenceDiv.innerHTML = "";
    let loaded = (data !== null && data !== void 0 ? data : "").replace(/\s/g, "").split("|");
    for (const saText of loaded) {
        const [data, count] = saText.split("=");
        const [name, pitch, num] = data.split("@");
        let unclonedEl = nameToEl.get(name);
        if (unclonedEl === undefined) {
            if (name[0] === "!") {
                console.warn(`Unknown action ${name} in loaded file. Skipping.`);
                continue;
            }
            else {
                console.warn(`Unknown sound ${name} in loaded file. Falling back to _pause.`);
                unclonedEl = nameToEl.get("_pause");
            }
        }
        const el = unclonedEl.cloneNode(true);
        if (name.startsWith("!")) {
            // Action.
            const actionName = name.slice(1);
            const action = actions.find((action) => action.name === actionName);
            if ("amount" in action) {
                let fixedNum;
                if (num === "x") {
                    fixedNum = "multiply";
                }
                else if (num === "+") {
                    fixedNum = "add";
                }
                else {
                    fixedNum = undefined;
                }
                // hack: addAction is slow, so do it once and clone the final sequence
                // node.
                addAction(actionName, Number(pitch), fixedNum, $(el));
                if (count) {
                    const toClone = sequenceDiv.lastElementChild;
                    for (let i = 0; i < Number(count) - 1; i++) {
                        sequenceDiv.appendChild(toClone.cloneNode(true));
                    }
                }
                continue;
            }
            else if ("isTarget" in action) {
                // hack: deal with isTarget without using addAction
                const target = pitch === undefined ? "1" : pitch;
                el.setAttribute("amount", target);
                el.setAttribute("min", action.set[0].toFixed());
                el.setAttribute("min", action.set[1].toFixed());
                const p = document.createElement("p");
                p.textContent = target;
                el.appendChild(p);
            }
        }
        else {
            // Sound.
            if (pitch !== undefined && pitch !== "0") {
                el.setAttribute("pitch", pitch);
                const p = document.createElement("p");
                p.textContent = (pitch[0] === "-" ? "" : "+") + pitch;
                el.appendChild(p);
            }
            el.removeAttribute("soundorigin");
            el.removeAttribute("soundname");
        }
        const actualCount = Number(count !== null && count !== void 0 ? count : "1");
        for (let i = 0; i < actualCount; i++) {
            sequenceDiv.appendChild(el.cloneNode(true));
        }
    }
};
// JS doesn't have a queue lmao
class Queue {
    constructor() {
        this.toPush = [];
        this.currentQueue = [];
    }
    push(v) {
        this.toPush.push(v);
    }
    top() {
        var _a;
        return (_a = this.currentQueue[this.currentQueue.length - 1]) !== null && _a !== void 0 ? _a : this.toPush[0];
    }
    pop() {
        const popped = this.currentQueue.pop();
        if (popped !== undefined) {
            return popped;
        }
        else {
            while (this.toPush.length > 1) {
                // Safety: this.toPush is non-empty as we checked the length.
                this.currentQueue.push(this.toPush.pop());
            }
            // this.toPush.length must be 1 or 0 here.
            return this.toPush.pop();
            // this.toPush.length must be 0 here.
        }
    }
    length() {
        return this.toPush.length + this.currentQueue.length;
    }
    empty() {
        return this.currentQueue.length === 0 && this.toPush.length === 0;
    }
}
function isSound(sa) {
    return sa.type === "sound";
}
const AUDIO_LOOKAHEAD_SECONDS = 5;
// completely arbitrary
const MIN_START_AFTER_SECONDS = 0.02;
let sequenceColumns = Math.floor((sequenceDiv.clientWidth - 20) / 70);
window.addEventListener("resize", () => {
    sequenceColumns = Math.floor((sequenceDiv.clientWidth - 20) / 70);
});
class Sequencer {
    constructor() {
        this.lastSequenceColumns = 0;
        this.lastScrollIndex = 0;
        // A number from 0 inclusive to scrollWindowLines exclusive, which is the
        // "offset" of the current scroll window.
        this.scrollOffset = 0;
        this.eventLoop = () => {
            if (this.endOfEffects) {
                return;
            }
            window.requestAnimationFrame(this.eventLoop);
            this.runToLookahead();
            this.cleanToCut();
            this.executeEffects();
        };
        const sequence = [
            ...document.getElementById("sequence").getElementsByTagName("div"),
        ].map((div) => div2sa(div));
        this.sequence = sequence;
        this.sequenceIndex = 0;
        this.currentTime = 0;
        this.volume = clamp(defaultVolume / 200, 0, 1);
        this.beatsPerMinute = clamp(defaultTempo, 10, 10000);
        this.secondsPerBeat = 60 / this.beatsPerMinute;
        this.soundDelay = 0;
        this.scrubUntil = sequence.map((sa) => sa.type).lastIndexOf("startpos");
        this.loopIndex = 0;
        this.pendingEffects = new Queue();
        this.toCut = new Queue();
        this.buffersReady = false;
        this.endOfEffects = false;
        this.endOfSequence = false;
    }
    prepareBuffers() {
        if (this.buffersReady) {
            return Promise.resolve();
        }
        const sounds = [
            ...new Set(this.sequence.filter(isSound).map((s) => s.sound)),
        ];
        return Promise.all(sounds.map(soundToAudioBuffer)).then(() => (this.buffersReady = true));
    }
    playSound(sound) {
        const time = this.currentTime + this.soundDelay / 100;
        const node = webAudioPlaySound(sound.sound, 0 /* NOT_OVERRIDEABLE */, time, sound.pitch, this.volume);
        if (node) {
            this.toCut.push({ node, time });
        }
    }
    /**
     * Also adds the untrigger to pendingEffects.
     */
    untrigger(index, except = []) {
        this.pendingEffects.push({
            type: "untriggerAfter",
            index,
            except,
            time: this.currentTime,
        });
        const exceptions = except.concat(["loop", "loopmany", "startpos"]);
        // Optimisation here - only go to sequenceIndex.
        // Assumptions:
        // - Something can only be triggered iff it is played - i.e. sequenceIndex
        //   was once at that position.
        // - The only way of untriggering is this function, which normally
        //   untriggers EVERYTHING strictly after the index.
        // - The only ways of jumping back are:
        //   - loop
        //   - loopMany
        //   - jump
        // - All untriggers exclude loop and loopMany.
        // - Therefore, it is impossible to jump back to a point such that:
        //   - something WASN'T untriggered between the two jump points
        //   - and that something will be untriggered the next time around.
        // - The only possible type of that must be something passed into except -
        //   jump and target - but jumping back again is impossible, as:
        //   - jump destinations cannot go backwards over time, and
        //   - loops do not get untriggered.
        // uhhh this is too hard to think about, let's do the naive thing
        for (let i = index + 1; i < this.sequence.length; i++) {
            const sa = this.sequence[i];
            if (!exceptions.includes(sa.type)) {
                sa.triggered = false;
            }
        }
    }
    sequenceStep() {
        let time = this.currentTime;
        if (this.sequenceIndex >= this.sequence.length) {
            this.pendingEffects.push({ type: "end", time });
            this.endOfSequence = true;
            return;
        }
        const sa = this.sequence[this.sequenceIndex];
        const div = sa.div;
        const img = sa.img;
        if (scrollWindowLines !== -1) {
            this.pendingEffects.push({
                type: "scroll",
                index: this.sequenceIndex,
                time,
            });
        }
        if (chordOption ===
            2 /* ARPEGGIATE_AND_DELAY_OTHERS_WITHIN_SAME_COMBINE */ ||
            chordOption === 1 /* ARPEGGIATE_AND_ONLY_DELAY_CHORD */) {
            if (sa.type === "sound") {
                // If we're on a sound, effects should obey soundDelay.
                time += this.soundDelay / 100;
            }
            else {
                this.soundDelay = 0;
            }
        }
        this.pendingEffects.push({ type: "reset", div, time });
        switch (sa.type) {
            case "sound":
                // Early return if scrubbing.
                if (this.sequenceIndex < this.scrubUntil) {
                    this.sequenceIndex++;
                    break;
                }
                this.pendingEffects.push({ type: "bounce", div, time });
                this.playSound(sa);
                const maybeCombine = this.sequence[this.sequenceIndex + 1];
                let timeDelta = 0;
                if ((maybeCombine === null || maybeCombine === void 0 ? void 0 : maybeCombine.type) === "combine") {
                    this.pendingEffects.push({
                        type: "pulseAndTrigger",
                        div: maybeCombine.div,
                        img: maybeCombine.img,
                        time,
                    });
                    // Probably pointless to store this, but whatever.
                    maybeCombine.triggered = true;
                    const maybeSameSound = this.sequence[this.sequenceIndex + 2];
                    // delay so chords work (sorry)
                    if (chordOption !== 0 /* NO_ARPEGGIATE */ &&
                        (maybeSameSound === null || maybeSameSound === void 0 ? void 0 : maybeSameSound.type) === "sound" &&
                        maybeSameSound.sound === sa.sound &&
                        maybeSameSound.pitch !== sa.pitch) {
                        if (chordOption === 3 /* ARPEGGIATE_AND_DELAY_EVERYTHING_ELSE */) {
                            timeDelta = 1 / 1000;
                        }
                        else {
                            this.soundDelay++;
                        }
                    }
                    else if (chordOption === 1 /* ARPEGGIATE_AND_ONLY_DELAY_CHORD */) {
                        // Was a combine, but chord has stopped.
                        this.soundDelay = 0;
                    }
                    this.sequenceIndex += 2;
                }
                else {
                    timeDelta = this.secondsPerBeat;
                    this.soundDelay = 0;
                    this.sequenceIndex++;
                }
                this.currentTime += timeDelta;
                break;
            case "loop":
                if (sa.triggered) {
                    this.sequenceIndex++;
                    break;
                }
                this.untrigger(this.loopIndex);
                this.pendingEffects.push({ type: "pulseAndTrigger", div, img, time });
                sa.triggered = true;
                this.sequenceIndex = this.loopIndex;
                break;
            case "loopmany":
                if (sa.triggered) {
                    this.sequenceIndex++;
                    break;
                }
                this.untrigger(this.loopIndex);
                // Untrigger every loop BEFORE this index.
                for (let i = 0; i < this.sequenceIndex; i++) {
                    const other = this.sequence[i];
                    if (other.type === "loop" && other.triggered) {
                        other.triggered = false;
                        // Remove triggered class and call resetAmount($(div)).
                        this.pendingEffects.push({
                            type: "resetAmount",
                            div: other.div,
                            time,
                        });
                        this.pendingEffects.push({
                            type: "untriggerSingle",
                            div: other.div,
                            time,
                        });
                        // other.left isn't defined, lol
                    }
                }
                // $(div).removeAndAdd('pulse');
                this.pendingEffects.push({ type: "removeAndAddPulse", div, time });
                if (sa.left === undefined) {
                    sa.left = sa.amount;
                }
                sa.left -= 1;
                if (sa.left <= 0) {
                    this.pendingEffects.push({ type: "trigger", img, time });
                    this.pendingEffects.push({ type: "setText", div, text: "", time });
                    sa.triggered = true;
                }
                else {
                    this.pendingEffects.push({
                        type: "setText",
                        div,
                        text: sa.left.toString(),
                        time,
                    });
                }
                this.sequenceIndex = this.loopIndex;
                break;
            case "jump":
                if (sa.triggered) {
                    this.sequenceIndex++;
                    break;
                }
                const target = this.sequence.findIndex((seqSa) => seqSa.type === "target" &&
                    !seqSa.triggered &&
                    seqSa.amount == sa.amount);
                if (target === -1) {
                    this.pendingEffects.push({ type: "pulseAndTrigger", div, img, time });
                    sa.triggered = true;
                    this.sequenceIndex++;
                    break;
                }
                const position = target + 1;
                this.untrigger(position, ["jump", "target"]);
                this.pendingEffects.push({ type: "pulseAndTrigger", div, img, time });
                sa.triggered = true;
                this.pendingEffects.push({
                    type: "pulseAndTrigger",
                    div: this.sequence[target].div,
                    img: this.sequence[target].img,
                    time,
                });
                this.sequence[target].triggered = true;
                this.sequenceIndex = position;
                break;
            case "cut":
                if (this.sequenceIndex >= this.scrubUntil) {
                    // Stop sounds.
                    while (!this.toCut.empty()) {
                        const popped = this.toCut.pop();
                        popped.node.stop(this.currentTime);
                    }
                }
                this.pendingEffects.push({ type: "pulseAndTrigger", div, img, time });
                sa.triggered = true;
                this.sequenceIndex++;
                break;
            case "flash":
                if (this.sequenceIndex >= this.scrubUntil) {
                    this.pendingEffects.push({ type: "flash", time });
                }
                this.pendingEffects.push({ type: "pulseAndTrigger", div, img, time });
                sa.triggered = true;
                this.sequenceIndex++;
                break;
            case "speed":
                const newBeatsPerMinute = modifyNum(this.beatsPerMinute, sa.amount, sa.num);
                if (newBeatsPerMinute >= 0) {
                    this.beatsPerMinute = clamp(newBeatsPerMinute, 10, 10000);
                    this.secondsPerBeat = 60 / this.beatsPerMinute;
                    this.pendingEffects.push({
                        type: "setBpm",
                        bpm: newBeatsPerMinute,
                        time,
                    });
                }
                this.pendingEffects.push({ type: "pulseAndTrigger", div, img, time });
                sa.triggered = true;
                this.sequenceIndex++;
                break;
            case "volume":
                const newVolumeTimes200 = modifyNum(this.volume * 200, sa.amount, sa.num);
                if (newVolumeTimes200 >= 0) {
                    this.volume = clamp(newVolumeTimes200 / 200, 0, 1);
                    this.pendingEffects.push({
                        type: "setVolume",
                        volumeTimes200: newVolumeTimes200,
                        time,
                    });
                }
                this.pendingEffects.push({ type: "pulseAndTrigger", div, img, time });
                sa.triggered = true;
                this.sequenceIndex++;
                break;
            case "stop":
                this.pendingEffects.push({ type: "addPulse", div, time });
                if (this.sequenceIndex < this.scrubUntil) {
                    this.pendingEffects.push({ type: "trigger", img, time });
                    sa.triggered = true;
                    this.sequenceIndex++;
                    break;
                }
                if (sa.amount > 0) {
                    // Don't include 0.
                    let beatOffset = 1;
                    for (let beatsLeft = sa.amount - 1; beatsLeft > 0; beatsLeft--) {
                        this.pendingEffects.push({
                            type: "setText",
                            div,
                            text: beatsLeft.toString(),
                            time: time + beatOffset * this.secondsPerBeat,
                        });
                        beatOffset++;
                    }
                    this.currentTime += sa.amount * this.secondsPerBeat;
                    time = this.currentTime;
                    this.pendingEffects.push({ type: "resetAmount", div, time });
                    this.pendingEffects.push({ type: "trigger", img, time });
                    sa.triggered = true;
                }
                // original code doesn't break lmao
                this.sequenceIndex++;
                break;
            case "looptarget":
                this.loopIndex = this.sequenceIndex;
                this.pendingEffects.push({ type: "pulseAndTrigger", div, img, time });
                sa.triggered = true;
                this.sequenceIndex++;
                break;
            // @ts-expect-error fallthrough
            case "startpos":
                this.pendingEffects.push({ type: "pulseAndTrigger", div, img, time });
                sa.triggered = true;
            // fallthrough
            default:
                this.sequenceIndex++;
                break;
        }
    }
    runToLookahead() {
        while (!this.endOfSequence &&
            this.currentTime < audioContext.currentTime + AUDIO_LOOKAHEAD_SECONDS) {
            this.sequenceStep();
        }
    }
    cleanToCut() {
        while (!this.toCut.empty() &&
            this.toCut.top().time < this.currentTime - AUDIO_LOOKAHEAD_SECONDS) {
            this.toCut.pop();
        }
    }
    scrollToIndex(index) {
        // Technically redundant, but juuust in case.
        if (scrollWindowLines === -1) {
            return;
        }
        const row = Math.floor(index / sequenceColumns);
        // Always jump unless the "group" is the same and we didn't get resized.
        if (sequenceColumns === this.lastSequenceColumns) {
            const group = Math.floor((row - this.scrollOffset) / scrollWindowLines);
            const lastRow = Math.floor(this.lastScrollIndex / sequenceColumns);
            const lastGroup = Math.floor((lastRow - this.scrollOffset) / scrollWindowLines);
            if (group === lastGroup) {
                this.lastScrollIndex = index;
                this.lastSequenceColumns = sequenceColumns;
                return;
            }
        }
        // Jump now.
        // This usually doesn't change unless the cursor position changed a lot,
        // such as through a target or a loop.
        this.scrollOffset = row % scrollWindowLines;
        // Focus on the row (scrollWindowLines >> 1) below where we currently are.
        const toFocusRow = row + (scrollWindowLines >> 1);
        const toFocusIndex = Math.min(toFocusRow * sequenceColumns, this.sequence.length - 1);
        this.sequence[toFocusIndex].div.scrollIntoView({
            block: "center",
            behavior: smoothScroll ? "smooth" : "auto",
        });
        this.lastScrollIndex = index;
        this.lastSequenceColumns = sequenceColumns;
    }
    executeEffects() {
        while (!this.pendingEffects.empty() &&
            this.pendingEffects.top().time <= audioContext.currentTime) {
            const effect = this.pendingEffects.pop();
            let div;
            switch (effect.type) {
                case "start":
                    // The commented out code results in a small bug for some reason...
                    $(".placed").removeClass("placed");
                    // for (const placed of document.getElementsByClassName("placed")) {
                    //   placed.classList.remove("placed");
                    // }
                    break;
                case "untriggerAfter":
                    window.untrigger(effect.index, effect.except);
                    break;
                case "end":
                    window.cancel(false);
                    this.endOfEffects = true;
                    break;
                case "reset":
                    div = $(effect.div);
                    div.removeClass("bounce");
                    div.removeClass("pulse");
                    break;
                case "bounce":
                    div = $(effect.div);
                    if (!settings.noAnimations) {
                        div.removeAndAdd("bounce");
                    }
                    break;
                case "pulseAndTrigger":
                    if (!settings.noAnimations) {
                        effect.div.classList.add("pulse");
                    }
                    effect.img.classList.add("triggered");
                    break;
                case "resetAmount":
                    div = $(effect.div);
                    window.resetAmount(div);
                    break;
                case "untriggerSingle":
                    div = $(effect.div);
                    div.find("img").removeClass("triggered");
                    break;
                case "removeAndAddPulse":
                    div = $(effect.div);
                    // manually re-implement removeAndAdd here
                    div.removeClass("pulse");
                    if (!settings.noAnimations) {
                        setTimeout(() => {
                            div.addClass("pulse");
                        }, 10);
                    }
                    break;
                case "trigger":
                    effect.img.classList.add("triggered");
                    break;
                case "setText":
                    div = $(effect.div);
                    div.find("p").text(effect.text);
                    break;
                case "flash":
                    // wtf?
                    $("body").removeClass();
                    $("body").removeAndAdd("screenflash");
                    break;
                case "setBpm":
                    window.setTempo(effect.bpm);
                    break;
                case "setVolume":
                    window.setVolume(effect.volumeTimes200);
                    break;
                case "addPulse":
                    if (!settings.noAnimations) {
                        div = $(effect.div);
                        div.addClass("pulse");
                    }
                    break;
                case "scroll":
                    this.scrollToIndex(effect.index);
                    break;
                // default:
                //   effect.type;
            }
        }
    }
    startAfter(seconds) {
        this.currentTime = audioContext.currentTime + seconds;
        this.pendingEffects.push({ type: "start", time: this.currentTime });
        this.eventLoop();
    }
    forceStop() {
        this.endOfEffects = true;
    }
}
function div2sa(div) {
    var _a;
    const img = div.getElementsByTagName("img")[0];
    const sound = div.getAttribute("sound");
    const triggered = false;
    if (sound) {
        // NOTE: The existing code uses the <p> here, not the pitch attribute.
        const pitch = Number((_a = div.getAttribute("pitch")) !== null && _a !== void 0 ? _a : "0");
        return { type: "sound", sound, div, img, pitch, triggered };
    }
    const type = div.getAttribute("action");
    switch (type) {
        case "startpos":
        case "flash":
        case "combine":
        case "cut":
        case "looptarget":
        case "loop":
            return { type, div, img, triggered };
        case "speed":
        case "volume":
        case "stop":
        case "loopmany":
        case "target":
        case "jump":
            const amountStr = div.getAttribute("amount");
            if (amountStr === null) {
                throw new Error(`${type} does not have an amount`);
            }
            const amount = Number(amountStr);
            if (!Number.isFinite(amount)) {
                throw new Error(`${type} does not have a finite amount: ${amountStr}`);
            }
            if (type === "speed" || type === "volume") {
                const num = div.getAttribute("num");
                if (num === null || num === "add" || num === "multiply") {
                    return { type, amount, num, div, img, triggered };
                }
                else {
                    throw new Error(`${type} does not have valid num: ${num}`);
                }
            }
            else {
                return { type, amount, div, img, triggered };
            }
        default:
            throw new Error(`unknown action ${type}`);
    }
}
function modifyNum(base, amount, num) {
    switch (num) {
        case "add":
            return base + amount;
        case "multiply":
            return base * amount;
        case null:
            return amount;
    }
}
