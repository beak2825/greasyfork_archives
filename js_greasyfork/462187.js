// ==UserScript==
// @name         Amharic/HaHu Pronunciation Tooltip
// @description  Displays a tooltip with a pronunciation button for selected Amharic/HaHu characters on any website.
// @match       *://*/*
// @grant        none
// @version      1.6
// @license      MIT
// @author       @skatbr
// @namespace    https://github.com/skatbr
// @downloadURL https://update.greasyfork.org/scripts/462187/AmharicHaHu%20Pronunciation%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/462187/AmharicHaHu%20Pronunciation%20Tooltip.meta.js
// ==/UserScript==

const amharicToEnglish = {
    ሀ: "ha",
    ሁ: "hu",
    ሂ: "hee",
    ሃ: "ha",
    ሄ: "hae",
    ህ: "heh",
    ሆ: "ho",
    ለ: "le",
    ሉ: "lu",
    ሊ: "lee",
    ላ: "la",
    ሌ: "lay",
    ል: "leh",
    ሎ: "lo",
    ሐ: "ha",
    ሑ: "hu",
    ሒ: "hee",
    ሓ: "ha",
    ሔ: "hae",
    ሕ: "heh",
    ሖ: "ho",
    መ: "muh",
    ሙ: "moo",
    ሚ: "mee",
    ማ: "ma",
    ሜ: "mae",
    ም: "mih",
    ሞ: "mo",
    ሠ: "seh",
    ሡ: "soo",
    ሢ: "see",
    ሣ: "sa",
    ሤ: "sae",
    ሥ: "sih",
    ሦ: "so",
    ረ: "reh",
    ሩ: "roo",
    ሪ: "ree",
    ራ: "ra",
    ሬ: "rae",
    ር: "rih",
    ሮ: "ro",
    ሰ: "seh",
    ሱ: "soo",
    ሲ: "see",
    ሳ: "sa",
    ሴ: "sae",
    ስ: "sih",
    ሶ: "so",
    ሸ: "sheh",
    ሹ: "shoo",
    ሺ: "shee",
    ሻ: "sha",
    ሼ: "shae",
    ሽ: "shih",
    ሾ: "sho",
    ቀ: "qeh",
    ቁ: "qoo",
    ቂ: "qee",
    ቃ: "qa",
    ቄ: "qae",
    ቅ: "qih",
    ቆ: "qo",
    በ: "beh",
    ቡ: "boo",
    ቢ: "bee",
    ባ: "ba",
    ቤ: "bae",
    ብ: "bih",
    ቦ: "bo",
    ቨ: "veh",
    ቩ: "voo",
    ቪ: "vee",
    ቫ: "va",
    ቬ: "vae",
    ቭ: "vih",
    ቮ: "vo",
    ተ: "teh",
    ቱ: "too",
    ቲ: "tee",
    ታ: "ta",
    ቴ: "tae",
    ት: "tih",
    ቶ: "to",
    ቸ: "cheh",
    ቹ: "choo",
    ቺ: "chee",
    ቻ: "cha",
    ቼ: "chae",
    ች: "chih",
    ቾ: "cho",
    ኀ: "ha",
    ኁ: "hu",
    ኂ: "hee",
    ኃ: "ha",
    ኄ: "hae",
    ኅ: "heh",
    ኆ: "ho",
    ነ: "neh",
    ኑ: "noo",
    ኒ: "nee",
    ና: "na",
    ኔ: "nae",
    ን: "nih",
    ኖ: "no",
    ኘ: "gneh",
    ኙ: "gnoo",
    ኚ: "gnee",
    ኛ: "gna",
    ኜ: "gnae",
    ኝ: "gnih",
    ኞ: "gno",
    አ: "aa",
    ኡ: "oo",
    ኢ: "ee",
    ኣ: "aa",
    ኤ: "ae",
    እ: "ih",
    ኦ: "o",
    ከ: "keh",
    ኩ: "koo",
    ኪ: "kee",
    ካ: "ka",
    ኬ: "kae",
    ክ: "kih",
    ኮ: "ko",
    ኸ: "huh",
    ኹ: "hu",
    ኺ: "hee",
    ኻ: "ha",
    ኼ: "hae",
    ኽ: "heh",
    ኾ: "ho",
    ወ: "weh",
    ዉ: "woo",
    ዊ: "wee",
    ዋ: "wa",
    ዌ: "wae",
    ው: "wih",
    ዎ: "wo",
    ዐ: "aa",
    ዑ: "oo",
    ዒ: "ee",
    ዓ: "aa",
    ዔ: "ae",
    ዕ: "ih",
    ዖ: "o",
    ዘ: "ze",
    ዙ: "zu",
    ዚ: "zee",
    ዛ: "zaa",
    ዜ: "zae",
    ዝ: "zih",
    ዞ: "zo",
    ዠ: "zjeh",
    ዡ: "zjoo",
    ዢ: "zjee",
    ዣ: "zjaa",
    ዤ: "zjae",
    ዥ: "zjih",
    ዦ: "zjo",
    የ: "ye",
    ዩ: "yu",
    ዪ: "yee",
    ያ: "yaa",
    ዬ: "yae",
    ይ: "yih",
    ዮ: "yo",
    ደ: "duh",
    ዱ: "doo",
    ዲ: "dee",
    ዳ: "daa",
    ዴ: "dae",
    ድ: "dih",
    ዶ: "do",
    ጀ: "je",
    ጁ: "joo",
    ጂ: "jee",
    ጃ: "jaa",
    ጄ: "jae",
    ጅ: "jih",
    ጆ: "jo",
    ገ: "guh",
    ጉ: "goo",
    ጊ: "gee",
    ጋ: "ga",
    ጌ: "gae",
    ግ: "gih",
    ጎ: "go",
    ጠ: "tte",
    ጡ: "ttu",
    ጢ: "ttee",
    ጣ: "ttaa",
    ጤ: "ttae",
    ጥ: "ttih",
    ጦ: "tto",
    ጨ: "chhe",
    ጩ: "chhoo",
    ጪ: "chhee",
    ጫ: "chhaa",
    ጬ: "chhae",
    ጭ: "chhih",
    ጮ: "cho",
    ጰ: "ppuh",
    ጱ: "ppoo",
    ጲ: "ppee",
    ጳ: "ppaa",
    ጴ: "ppae",
    ጵ: "ppih",
    ጶ: "ppo",
    ጸ: "tse",
    ጹ: "tsoo",
    ጺ: "tsee",
    ጻ: "tsaa",
    ጼ: "tsae",
    ጽ: "tsih",
    ጾ: "tso",
    ፀ: "tse",
    ፁ: "tsoo",
    ፂ: "tsee",
    ፃ: "tsaa",
    ፄ: "tsae",
    ፅ: "tsih",
    ፆ: "tso",
    ፈ: "fuh",
    ፉ: "foo",
    ፊ: "fee",
    ፋ: "faa",
    ፌ: "fae",
    ፍ: "fih",
    ፎ: "fo",
    ፐ: "peh",
    ፑ: "poo",
    ፒ: "pee",
    ፓ: "paa",
    ፔ: "pae",
    ፕ: "pih",
    ፖ: "po",
};

let button = null;
let tooltip = null;

const createButton = (text) => {
    const btn = document.createElement("button");
    btn.classList.add("mdl-button", "mdl-js-button", "mdl-button--fab", "mdl-js-ripple-effect", "mdl-button--colored");
    btn.innerHTML = `<i class="material-icons">volume_up</i>`;
    return btn;
};

const createTooltip = (text) => {
    const tip = document.createElement("div");
    tip.classList.add("mdl-tooltip");
    tip.setAttribute("data-mdl-for", `amharic-tooltip-button`);
    tip.innerHTML = text;
    tip.style.zIndex = "99999999";
    return tip;
};
let playbackSpeed = 1; // Default playback speed

// Function to create a dropdown menu for selecting playback speed
const createPlaybackSpeedMenu = () => {
    const menu = document.createElement("div");
    menu.classList.add("playback-speed-menu");
    menu.style.cssText = `
        position: fixed !important;
        z-index: 99999999 !important;
        top: ${window.pageYOffset + window.innerHeight - 50}px !important;
        left:${window.pageXOffset + window.innerWidth - 100}px !important;
        background-color:white !important;
        border-radius:5px !important;
        padding:5px !important;
        font-size:12px !important;
        font-weight:bold !important;
        box-shadow :0 0 10px rgba(0,0,0,0.2) !important;
        `;

    const label = document.createElement("span");
    label.classList.add("playback-speed-label");
    label.textContent = `Speed : `;
    menu.appendChild(label);

    const select = document.createElement("select");
    select.classList.add("playback-speed-select");
    const speeds = ["0.5x", "1x", "1.5x", "2x", "2.5x", "3x", "3.5x", "4x", "4.5x", "5x"];
    speeds.forEach((speed) => {
        const option = document.createElement("option");
        option.value = speed;
        option.textContent = speed;
        if (parseFloat(speed) === playbackSpeed) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    select.addEventListener("change", (event) => {
        playbackSpeed = parseFloat(event.target.value);
    });
    menu.appendChild(select);

    return menu;
};

// if not playback-speed-menu found, create one
var playbackSpeedMenu = null;
if (!document.getElementById("playback-speed-menu")) {
    playbackSpeedMenu = createPlaybackSpeedMenu();
    document.body.appendChild(playbackSpeedMenu);
}

let audio = null; // Declare the audio variable outside of the playAudio function

document.addEventListener("click", (event) => {
    const selectedText = window.getSelection().toString().trim();
    const characters = selectedText.split("");

    if (characters.length > 0) {
        let audioIndex = 0;
        const playAudio = () => {
            const englishName = amharicToEnglish[characters[audioIndex]];
            if (!englishName) {
                audioIndex++;
                if (audioIndex < characters.length) {
                    setTimeout(() => {
                        playAudio();
                    }, 0); // delay between each audio clip
                }
                return;
            }

            const audioUrl = `https://s3.amazonaws.com/i.litcdn.com/dict/sounds/mp3/${englishName.toLowerCase()}.mp3`;
            if (audio) {
                audio.pause(); // Stop the previous audio clip
                audio.currentTime = 0; // Reset the current time of the audio clip
            }
            audio = new Audio(audioUrl);
            audio.playbackRate = playbackSpeed; // Set the playback speed
            audio.play();

            audio.addEventListener("ended", () => {
                audioIndex++;
                if (audioIndex < characters.length) {
                    setTimeout(() => {
                        playAudio();
                    }, 0); // delay between each audio clip
                }
            });

            if (button) {
                button.remove();
                tooltip?.remove();
            }

            button = createButton(characters[audioIndex]);
            button.setAttribute("id", `amharic-tooltip-button`);
            const range = window.getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();
            button.style.top = `${rect.top + window.pageYOffset - 10}px`;
            button.style.left = `${rect.left + window.pageXOffset + rect.width}px`;

            document.body.appendChild(button);

            button.addEventListener("click", (event) => {
                event.stopPropagation();

                if (tooltip) {
                    tooltip.remove();
                }

                tooltip = createTooltip(englishName);
                const buttonRect = button.getBoundingClientRect();
                tooltip.style.top = `${buttonRect.top + window.pageYOffset + buttonRect.height / 2 - tooltip.offsetHeight / 2}px`;
                tooltip.style.left = `${buttonRect.left + window.pageXOffset + buttonRect.width}px`;

                document.body.appendChild(tooltip);
                componentHandler.upgradeElement(tooltip); // Upgrade the tooltip element to use Material Design
                audio.play();
            });
        };

        playAudio();
    } else {
        if (button) {
            button.style.display = "none";
            tooltip?.remove();
        }
    }
});

document.addEventListener("mousedown", (event) => {
    if (button && !button.contains(event.target)) {
        button.style.display = "none";
        tooltip?.remove();
    }
});
