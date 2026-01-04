// ==UserScript==
// @name         MusicBrainz Artist Credits Helper
// @namespace    https://github.com/y-young/userscripts
// @version      2024.5.5
// @description  Split and fill artist credits, append character voice actor credit, and guess artists from track titles.
// @author       y-young
// @license      MIT; https://opensource.org/licenses/MIT
// @supportURL   https://github.com/y-young/userscripts/labels/mb-artist-credits-helper
// @match        https://*.musicbrainz.org/release/*/edit
// @match        https://*.musicbrainz.org/release/add*
// @icon         https://musicbrainz.org/static/images/favicons/apple-touch-icon-72x72.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/441280/MusicBrainz%20Artist%20Credits%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/441280/MusicBrainz%20Artist%20Credits%20Helper.meta.js
// ==/UserScript==

"use strict";

const CLIENT = "Artist Credits Helper/2024.5.5(https://github.com/y-young)";
// Default values
const CV_JOIN_PHRASES = [" (CV ", ")"];
const SEPARATOR = ",";

const TRACK_ARTIST_PATTERN =
    /(?<=\s\(?)([^\w\s\(]{1,3} ?\S{1,3})\s?(?=Ver|Remix|ソロ)/i;
const JOIN_PHRASE_PATTERN =
    /\s*(?:[\(（]CV[\.:： ]?|[\)）]\s*[,，、・]?|\s(?:featuring|feat|ft|vs)[\.\s]|,|，|、|&|・)\s*/gi;

const ENABLE_GUESS_TRACK_ARTISTS = true;
const ENABLE_APPEND_CHARACTER_CV = true;

/**
 * Fetch API wrapper with user agent and headers
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<Response>}
 */
function request(url, options = {}) {
    return fetch(origin + url, {
        ...options,
        headers: {
            "user-agent": CLIENT,
            accept: "application/json",
        },
    });
}

/**
 * Set the value of an input element and trigger React events
 * @param {HTMLInputElement} input
 * @param {string} value
 */
function setInputValue(input, value) {
    if (!input || input.disabled) {
        return;
    }
    // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
    ).set;
    nativeInputValueSetter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * @typedef {object} ArtistCredit
 * @property {string} artist Artist name in database
 * @property {string} [creditedAs] Artist as credited
 * @property {string} [joinPhrase] Join phrase
 */

/**
 * @typedef {object} ArtistCreditInputs
 * @property {HTMLInputElement} artist
 * @property {HTMLInputElement} creditedAs
 * @property {HTMLInputElement} joinPhrase
 */

class ArtistCreditsEditor {
    #bubble;
    #addButton;

    init(bubble) {
        this.#bubble = bubble;
        this.#addButton = bubble.querySelector("button.add-item.with-label");
    }

    /**
     * Get input boxes of some artist credits
     * @param {number} [sliceIndex=0] Index at which to start slicing
     * @returns {ArtistCreditInputs[]}
     */
    getInputs(sliceIndex = 0) {
        const inputs = Array.from(
            this.#bubble.querySelectorAll("input[type=text]")
        );
        const SIZE = 3;
        return Array.from(new Array(Math.ceil(inputs.length / SIZE)), (_, i) =>
            inputs.slice(i * SIZE, i * SIZE + SIZE)
        )
            .slice(sliceIndex)
            .map((input) => ({
                artist: input[0],
                creditedAs: input[1],
                joinPhrase: input[2],
            }));
    }

    /**
     * Fill in the given artist credits, replacing existing ones
     * @param {ArtistCredit[]} credits
     */
    fill(credits) {
        let inputs = this.getInputs();
        // Add new artist credits if necessary
        if (inputs.length < credits.length) {
            for (let i = 1; i <= credits.length - inputs.length; ++i) {
                setTimeout(() => this.#addButton.click(), 10);
            }
        }
        setTimeout(() => {
            inputs = this.getInputs();
            credits.forEach((credit, index) =>
                this.updateInputs(inputs[index], credit)
            );
        }, 30);
    }

    /**
     * Append a new artist credit
     * @param {ArtistCredit} credit
     */
    append(credit) {
        this.#addButton.click();
        setTimeout(() => {
            const newInput = this.getInputs(-1)[0];
            this.updateInputs(newInput, credit);
        }, 10);
    }

    /**
     * Update an existing artist credit at given index
     * @param {number} index
     * @param {(oldCredit: ArtistCredit) => ArtistCredit} updater
     */
    update(index, updater) {
        const inputs = this.getInputs().at(index);
        if (!inputs) {
            return;
        }
        const oldCredit = Object.fromEntries(
            Object.entries(inputs).map(([key, value]) => [key, value.value])
        );
        const newCredit = updater(oldCredit);
        this.updateInputs(inputs, newCredit);
    }

    /**
     * Update a group of artist credit input boxes
     * @param {ArtistCreditInputs} inputs
     * @param {ArtistCredit} newCredit
     */
    updateInputs(inputs, newCredit) {
        for (const key in newCredit) {
            const value = newCredit[key];
            if (value) {
                setInputValue(inputs[key], value);
            }
        }
    }
}

const editor = new ArtistCreditsEditor();

/**
 * Query API for the voice actor of an character
 * @param {string} characterMBID
 * @returns {Promise<string?>} MBID of voice actor
 */
async function getVoiceActor(characterMBID) {
    if (!characterMBID) {
        return Promise.resolve(null);
    }
    const RELATIONSHIP_ID = "e259a3f5-ce8e-45c1-9ef7-90ff7d0c7589";
    return request(`/ws/2/artist/${characterMBID}?inc=artist-rels&fmt=json`)
        .then((response) => response.json())
        .then(
            (data) =>
                data.relations.find(
                    (relation) =>
                        relation["type-id"] === RELATIONSHIP_ID &&
                        relation.direction === "backward" &&
                        !relation.ended
                )?.artist.id ?? alert("No voice actor relationship found.")
        );
}

/**
 * Get the MBID of a given character in preview text
 * @param {string} characterName
 * @returns {string|undefined} MBID of the character
 */
function getCharacterMBID(characterName) {
    const bubble = document.getElementById("artist-credit-bubble");
    const previewText = bubble.querySelectorAll("tr")[1];
    const artists = Array.from(previewText.querySelectorAll("a")).map(
        (link) => {
            let name;
            if (link.parentNode.classList.contains("name-variation")) {
                // Credit name differs from artist name
                name = link.title.split(" – ")[0].trim();
            } else {
                name = link.querySelector("bdi").innerText.trim();
            }
            const gid = link.href.split("/artist/")[1];
            return { name, gid };
        }
    );
    return (
        artists?.find((artist) => artist.name === characterName)?.gid ??
        alert("Character not found in preview text.")
    );
}

/**
 * Append the voice actor credit of the character
 * corresponding to the last artist credits
 */
function appendCharacterCV() {
    const characterName = editor.getInputs(-1)[0]?.artist?.value;
    if (!characterName) {
        alert("Please enter a character first.");
        return;
    }
    const { joinPhrases, separator } = getCVJoinPhrases();
    getVoiceActor(getCharacterMBID(characterName)).then((mbid) => {
        if (!mbid) {
            return;
        }
        editor.update(-2, (credit) => ({
            ...credit,
            joinPhrase: credit.joinPhrase + separator + " ",
        }));
        editor.update(-1, (credit) => ({
            ...credit,
            joinPhrase: joinPhrases[0],
        }));
        editor.append({ artist: mbid, joinPhrase: joinPhrases[1] });
    });
}

function getCVJoinPhrases() {
    const config = GM_getValue("cv_join_phrases");
    return {
        joinPhrases: CV_JOIN_PHRASES,
        separator: SEPARATOR,
        ...config,
    };
}

function setCVJoinPhrases() {
    const config = getCVJoinPhrases();
    const phrase1 = prompt(
        `Enter the first part of join phrases:`,
        config.joinPhrases[0]
    );
    const phrase2 = prompt(
        `Enter the second part of join phrases:`,
        config.joinPhrases[1]
    );
    const separator = prompt(`Enter the separator:`, config.separator);
    GM_setValue("cv_join_phrases", {
        joinPhrases: [phrase1, phrase2],
        separator: separator,
    });
}

/**
 * Guess the solo artist of from track titles and fill the artist credits in tracklist
 * @param {MouseEvent} event
 */
function guessTrackArtists(event) {
    const index = event.target.dataset.index;
    const trackList = document.querySelectorAll("table.medium").item(index);
    const tracks = trackList.querySelectorAll("tr.track");
    tracks.forEach((track) => {
        const title = track.querySelector("td.title > input").value;
        const artist = title.match(TRACK_ARTIST_PATTERN);
        if (!artist) {
            console.log("No artist found:", title);
            return;
        }
        const input = track.querySelector("td.artist input.name");
        setInputValue(input, artist[1]);
    });
}

/**
 * Split a string into multiple artist credits
 * @param {string} str
 * @returns {ArtistCredit[]} Parsed artist credits
 * @example
 * // returns [
 * //   { artist: "A", joinPhrase: " vs. " },
 * //   { artist: "B", joinPhrase: " feat. " },
 * //   { artist: "C" }
 * // ]
 * parseArtistCreditsString("A vs. B feat. C")
 * @example
 * // returns [
 * //   { artist: "A", joinPhrase: "(CV." },
 * //   { artist: "B", joinPhrase: "), " },
 * //   { artist: "C", joinPhrase: "(CV." },
 * //   { artist: "D", joinPhrase: ")" },
 * // ]
 * parseArtistCreditsString("A(CV.B), C(CV.D)")
 */
function parseArtistCreditsString(str) {
    if (!str) {
        return [];
    }
    const matches = str.matchAll(JOIN_PHRASE_PATTERN);
    const artists = str.split(JOIN_PHRASE_PATTERN);
    const credits = [];
    let pos = 0;
    for (const artist of artists) {
        const credit = { artist };
        pos += artist.length;
        const next = matches.next();
        if (!next.done) {
            const match = next.value;
            if (match.index === pos) {
                credit.joinPhrase = match[0];
                pos += match[0].length;
            }
        }
        credits.push(credit);
    }
    /*
        If the string is pasted outside the bubble
        we need to overwrite the first credited name exclusively.
    */
    if (credits[0]) {
        credits[0].creditedAs = credits[0].artist;
    }
    return credits;
}

/**
 * Parse the string in the first artist name input box and fill the artist credits
 */
function parseArtistCredits() {
    const acString = editor.getInputs()[0]?.artist?.value;
    if (!acString) {
        alert(
            "Please enter the artist credits to parse in the first input box."
        );
        return;
    }
    editor.fill(parseArtistCreditsString(acString));
}

function createButton(title, onClick) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.style.float = "left";
    button.innerText = title;
    button.addEventListener("click", onClick);
    return button;
}

function initBubbleTools() {
    const initButtons = (bubble) => {
        const container = bubble.querySelector("div.buttons");
        if (ENABLE_APPEND_CHARACTER_CV) {
            const appendButton = createButton(
                "Append Character CV",
                appendCharacterCV
            );
            container.appendChild(appendButton);
        }
        const parseButton = createButton(
            "Parse Artist Credits",
            parseArtistCredits
        );
        container.appendChild(parseButton);
    };

    const observerCallback = () => {
        const bubble = document.getElementById("artist-credit-bubble");
        if (!bubble) {
            return;
        }
        initButtons(bubble);
        editor.init(bubble);
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true });
}

function initTrackTools() {
    if (!ENABLE_GUESS_TRACK_ARTISTS) {
        return;
    }
    document
        .querySelectorAll("#tracklist-tools")
        .forEach((trackList, index) => {
            const button = createButton(
                "Guess artist from track titles",
                guessTrackArtists
            );
            button.dataset.index = index;
            trackList.querySelector("div.buttons").appendChild(button);
        });
}

initBubbleTools();
initTrackTools();
GM_registerMenuCommand("Config CV Join Phrases", setCVJoinPhrases);
