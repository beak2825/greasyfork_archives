// ==UserScript==
// @name         Guess retriever
// @version      0.2
// @description  Retrieves guesses under a certain score threshold from your duels
// @author       You
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @require      https://unpkg.com/@popperjs/core@2.11.5/dist/umd/popper.min.js
// @namespace    https://greasyfork.org/users/1011193
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151668
// @downloadURL https://update.greasyfork.org/scripts/482055/Guess%20retriever.user.js
// @updateURL https://update.greasyfork.org/scripts/482055/Guess%20retriever.meta.js
// ==/UserScript==


let hide = false;
let styles = GM_getValue("guessFinderStyles");
if (!styles) {
    hide = true;
    styles = {};
}
let css =`
#guessFinderPopupWrapper, #guessFinderSearchWrapper, #guessFinderSlantedRoot, #guessFinderSlantedStart, #guessFinderInputWrapper, #guessFinderPopup, #guessFinderToggle, #guessFinderTogglePicture, #runButton, .buttonContainer {
    box-sizing: border-box;
  }

  #guessFinderPopup {
    background: rgba(26, 26, 46, 0.9);
    padding: 15px;
    border-radius: 10px;
    max-height: 80vh;
    overflow-y: auto;
    width: 28em;
  }

  #guessFinderPopup div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  #guessFinderPopup input {
    background: rgba(255,255,255,0.1);
    color: white;
    border: none;
    border-radius: 5px;
  }

  .buttonContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  #runButton {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
  }

  #runButton:hover {
    background: rgba(255, 255, 255, 0.25);
    cursor: pointer;
  }

  #guessFinderToggle {
    width: 59.19px;
  }

  #guessFinderTogglePicture {
    justify-content: center;
  }

  #guessFinderTogglePicture img {
    width: 20px;
    filter: brightness(0) invert(1);
    opacity: 60%;
  }

.inputContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.inputLabel {
  margin: 0;
  padding-right: 6px;
  color: white; /* Adjust if necessary */
}

#dropdownInput {
  background: rgba(255,255,255,0.1);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px; /* Adjust padding as needed */
}
  `

GM_addStyle(css);

const guiHTMLHeader = `
<div id="guessFinderPopupWrapper">
  <div id="guessFinderSearchWrapper">
    <div id="guessFinderSlantedRoot">
      <div id="guessFinderSlantedStart"></div>
      <div id="guessFinderInputWrapper">
        <div id="guessFinderPopup" style="background: rgba(26, 26, 46, 0.9); padding: 15px; border-radius: 10px; max-height: 80vh; overflow-y: auto; width: 28em">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span id="mmaAPIkey" style="margin: 0; padding-right: 6px;"> Map Making App API</span>
            <input id="mmaAPIkeyInput" name="mmaAPIkey" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px">
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span id="scoreThresholdLabel" style="margin: 0; padding-right: 6px;">Score Threshold</span>
            <input type="number" id="scoreThresholdInput" name="scoreThreshold" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px">
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span id="monthsOfDuelsLabel" style="margin: 0; padding-right: 6px;">Months of Duels</span>
            <input type="number" id="monthsOfDuelsInput" name="monthsOfDuels" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px">
          </div>
          <div class="inputContainer">
              <span class="inputLabel">Map Making App Map:</span>
              <select id="dropdownInput" name="dropdownInput">
                   <option value="option1">Option 1</option>
                   <option value="option2">Option 2</option>
                   <option value="option3">Option 3</option>
                   <option value="option4">Option 4</option>
              </select>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; margin-top: 20px;">
            <button id="runButton" >Run</button>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; margin-top: 20px;">
            <p id="guessFinderStatus"></p>
          </div>
        </div>
        <button style="width: 59.19px" id="guessFinderToggle"><picture id="guessFinderTogglePicture" style="justify-content: center"><img src="https://www.svgrepo.com/show/532540/location-pin-alt-1.svg" style="width: 20px; filter: brightness(0) invert(1); opacity: 60%;"></picture></button>
      </div>
      <div id="guessFinderSlantedEnd"></div>
    </div>
  </div>
</div>

`

const showPopup = (showButton, popup) => {
    popup.style.display = 'block';
    Popper.createPopper(showButton, popup, {
        placement: 'bottom',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 10],
                },
            },
        ],
    });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const iterativeSetTimeout = async (func, initDelay, cond) => {
    while (!cond()) {
        await delay(initDelay);
        await func();
        initDelay *= 2;
    }
};


const stylesUsed = [
    "header_item__",
    "quick-search_wrapper__",
    "slanted-wrapper_root__",
    "slanted-wrapper_variantGrayTransparent__",
    "slanted-wrapper_start__",
    "quick-search_searchInputWrapper__",
    "slanted-wrapper_end__",
    "slanted-wrapper_right__",
    "quick-search_searchInputButton__",
    "quick-search_iconSection__",
];

const uploadDownloadStyles = async () => {
    stylesUsed.forEach(style => {
    });
    await iterativeSetTimeout(scanStyles, 0.1, () => checkAllStylesFound(stylesUsed) !== undefined);
    if (hide) {
        document.querySelector("#guessFinderPopupWrapper").hidden = "";
    }
    stylesUsed.forEach(style => {
        styles[style] = cn(style);
    });
    setStyles();
    GM_setValue("guessFinderStyles", styles);
}

const getStyle = style => {
    return styles[style];
}

const setStyles = () => {
    try {
        document.querySelector("#guessFinderPopupWrapper").className = getStyle("header_item__");
        document.querySelector("#guessFinderSearchWrapper").className = getStyle("quick-search_wrapper__");
        document.querySelector("#guessFinderSlantedRoot").className = getStyle("slanted-wrapper_root__") + " " + getStyle("slanted-wrapper_variantGrayTransparent__");
        document.querySelector("#guessFinderSlantedStart").className = getStyle("slanted-wrapper_start__")+ " " + getStyle("slanted-wrapper_right__");
        document.querySelector("#guessFinderInputWrapper").className = getStyle("quick-search_searchInputWrapper__");
        document.querySelector("#guessFinderSlantedEnd").className = getStyle("slanted-wrapper_end__")+ " " + getStyle("slanted-wrapper_right__");
        document.querySelector("#guessFinderToggle").className = getStyle("quick-search_searchInputButton__");
        document.querySelector("#guessFinderLabel1").className = getStyle("label_sizeXSmall__") + getStyle("label_variantWhite__");
        document.querySelector("#guessFinderLabel2").className = getStyle("label_sizeXSmall__") + getStyle("label_variantWhite__");
        document.querySelector("#guessFinderTogglePicture").className = getStyle("quick-search_iconSection__");
        document.querySelectorAll(".deleteButton").forEach(el => el.className = el.className + " " + getStyle("quick-search_searchInputButton__"));
    } catch (err) {
        console.error(err);
    }
}


const insertHeaderGui = async (header, gui) => {

    header.insertAdjacentHTML('afterbegin', gui);

    // Resolve class names
    if (hide) {
        document.querySelector("#guessFinderPopupWrapper").hidden = "true"
    }

    scanStyles().then(() => uploadDownloadStyles());
    setStyles();

    const showButton = document.querySelector('#guessFinderToggle');
    const popup = document.querySelector('#guessFinderPopup');
    popup.style.display = 'none';

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target == popup || popup.contains(target) || !document.contains(target)) return;
        if (target.matches('#guessFinderToggle, #guessFinderToggle *')) {
            e.preventDefault();
            showPopup(showButton, popup);
        } else {
            popup.style.display = 'none';
        }
    });
}

let MAP_MAKING_API_KEY = localStorage.getItem("guessFinderMMAApiKey");

async function mmaFetch(url, options = {}) {
	const response = await fetch(new URL(url, 'https://map-making.app'), {
		...options,
		headers: {
			accept: 'application/json',
			authorization: `API ${MAP_MAKING_API_KEY.trim()}`,
			...options.headers
		}
	});
	if (!response.ok) {
		let message = 'Unknown error';
		try {
			const res = await response.json();
			if (res.message) {
				message = res.message;
			}
		} catch {}
		alert(`An error occurred while trying to connect to Map Making App. ${message}`);
		throw Object.assign(new Error(message), { response });
	}
	return response;
}

async function getMaps(suppress = false) {
    if (MAP_MAKING_API_KEY === null) {
        if (!suppress) alert("Please input an API key for Map Making App");
        return;
    }
	const response = await mmaFetch(`/api/maps`);
	const maps = await response.json();
	return maps;
}

async function importLocations(mapId, locations) {
	const response = await mmaFetch(`/api/maps/${mapId}/locations`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			edits: [{
				action: { type: 4 },
				create: locations,
				remove: []
			}]
		})
	});
	await response.json();
}

const API_Key = 'bdc_e4a84278a5684f4786dd8277e4948ac4';

const ERROR_RESP = -1000000;

let count = 0;

async function getCountryCode(coords) {
    if (coords[0] <= -85.05) return 'AQ';
    count++
    if (API_Key.toLowerCase().match("^(bdc_)?[a-f0-9]{32}$") != null) {
        const api = "https://api.bigdatacloud.net/data/reverse-geocode?latitude="+coords.lat+"&longitude="+coords.lng+"&localityLanguage=en&key="+API_Key;
        return await fetch(api)
            .then(res => (res.status !== 200) ? ERROR_RESP : res.json())
            .then(out => (out === ERROR_RESP) ? ERROR_RESP : CountryDict[out.countryCode]);
    } else {
        const api = `https://nominatim.openstreetmap.org/reverse.php?lat=${coords.lat}&lon=${coords.lng}&zoom=21&format=jsonv2&accept-language=en`;
        return await fetch(api)
            .then(res => (res.status !== 200) ? ERROR_RESP : res.json())
            .then(out => (out === ERROR_RESP) ? ERROR_RESP : CountryDict[out?.address?.country_code?.toUpperCase()]);
    }
};

const fetchGeoGuessrData = async (id, cutoffDate) => {
    let after = null;
    let paginationToken = "", fetchedGames = [];
    let page = 0;
    let duelsFound = 0;
    while (true) {
        page++
        let url = "https://www.geoguessr.com/api/v4/feed/private";
        if (paginationToken !== "") {
            url += "?paginationToken=" + paginationToken;
        }
        let response = await fetch(url),
            n = await response.text(),
            jsonData = JSON.parse(n);
        if (jsonData.entries.length === 0) {
            console.log("All data fetched.");
            break;
        }
        const filteredEntries = jsonData.entries.filter(entry => {
            const entryTime = new Date(entry.time);
            const cutoffTime = new Date(cutoffDate);
            return entryTime >= cutoffTime;
        });
        if (filteredEntries.length === 0) {
            console.log("All data fetched.");
            break;
        }

        // Extract game IDs from filtered entries
        for (const entry of filteredEntries) {
            // Parse the payload as JSON
            const payloadData = JSON.parse(entry.payload);
            if (Array.isArray(payloadData)) {
                // If payloadData is an array, process each item
                for (const payloadItem of payloadData) {
                    if (payloadItem.payload && payloadItem.payload.gameId && payloadItem.payload.gameMode === "Duels") {
                        fetchedGames.push(payloadItem.payload.gameId);
                        duelsFound++;
                    }
                }
            } else {
                // If payloadData is an object, check and process directly
                if (payloadData.gameId && payloadData.gameMode === "Duels") {
                    fetchedGames.push(payloadData.gameId);
                }
            }
        }

        statusUpdater.updateStatus("fetchingDuels", duelsFound, new Date(filteredEntries[filteredEntries.length-1].time).toISOString());
        paginationToken = jsonData.paginationToken;
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }
    statusUpdater.updateStatus("filteringDuplicates");
    fetchedGames = fetchedGames.filter((game, index, array) => array.indexOf(game) === index); // removes duplicates
//    return fetchedGames.includes(after) ? fetchedGames.slice(0, fetchedGames.indexOf(after)) : fetchedGames;
    return fetchedGames;
};

const findIncorrectGuesses = async (gameData, playerId, status, score = null) => {
    let incorrectRounds = [];

    const rounds = gameData.rounds;

    // Finding the team and player by playerId
    let foundPlayer = null;
    let t = null;
    gameData.teams.forEach(team => {
        team.players.forEach(player => {
            if (player.playerId == playerId) {
                foundPlayer = player;
                t = team;
            }
        });
    });

    if (!foundPlayer) {
        return []; // Player not found, returning empty array
    }

     for (const round of t.roundResults) {
         let guessedCountryCode = null, actualCountryCode = null
         const roundLocation = rounds.find(r => r.roundNumber === round.roundNumber).panorama;
         status.guesses++;
         console.log(round);
         if (score === null) {
             return;
             guessedCountryCode = await getCountryCode({ lat: round.bestGuess.lat, lng: round.bestGuess.lng });
             actualCountryCode = await getCountryCode({ lat: roundLocation.lat, lng: roundLocation.lng });
             if (guessedCountryCode !== actualCountryCode) {
                 status.matching++;
                 incorrectRounds.push({
                     roundNumber: round.roundNumber,
                     score: round.score,
                     guessedCountryCode,
                     actualCountryCode,
                     panorama: roundLocation
                 });
             }
         } else if (round.score <= score) {
             status.matching++;
             incorrectRounds.push({
                 roundNumber: round.roundNumber,
                 score: round.score,
                 guessedCountryCode,
                 actualCountryCode,
                 panorama: roundLocation
             });
         }
         statusUpdater.updateStatus('findingGuesses', status.guesses, score === null ? 'wrongCountry' : "belowThreshold", status.matching);
    }
    return incorrectRounds;
};

const decodePanoId = (hexString) => {
    let decodedString = "";
    for (let i = 0; i < hexString.length; i += 2) {
        const hexPair = hexString.substr(i, 2);
        const char = String.fromCharCode(parseInt(hexPair, 16));
        decodedString += char;
    }
    return decodedString;
};

function extractDate(timestamp) {
    var match = timestamp.match(/^(\d{4}-\d{2})/);
    return match ? match[1] : null;
}

const formatScore = score => {
    const base = Math.floor(score / 1000);
    const decimal = Math.floor((score % 1000) / 100) * 0.1;
    const formattedScore = base + decimal;

    return formattedScore.toFixed(1) + 'k';
};

const subtractMonths = (months) => {
    if (months < 0) {
        throw new Error('Number of months must be positive');
    }

    const date = new Date();
    date.setMonth(date.getMonth() - months);

    return date.toISOString().split('T')[0]; // Returns the date in 'YYYY-MM-DD' format
};

function StatusUpdater(elementId) {
  this.element = document.getElementById(elementId);
  this.states = {
    fetchingDuels: (duelsCount, currentDate) =>
      `Fetching duel ids. <br/> Duels found: ${duelsCount} <br/> Checked through date: ${currentDate}`,
    filteringDuplicates: () => `Filtering out duplicate ids`,
    findingGuesses: (guessesCount, additionalState, additionalCount) => {
        let additionalText = '';
        if (additionalState === 'wrongCountry') {
            additionalText = ` Finding wrong country guesses. Guesses found: ${additionalCount}`;
        } else if (additionalState === 'belowThreshold') {
            additionalText = ` Finding guesses below score threshold. Guesses found: ${additionalCount}`;
        }
        return `Finding guesses. <br/> Guesses checked: ${guessesCount} <br/> ${additionalText}`;
    },
    pushingLocations: (mapName, locationsCount) =>
      `Pushing locations to ${mapName} <br/> locations pushed: ${locationsCount}`,
    done: () => `Done!`
  };
}

StatusUpdater.prototype.updateStatus = function(state, ...args) {
  if (this.states[state]) {
    this.element.innerHTML = this.states[state](...args);
  } else {
    console.error("Invalid state");
  }
};

let statusUpdater;

let userId = localStorage.getItem("guessFinderUserId")
if (userId == null) {
    fetch('https://geoguessr.com/api/v3/profiles', {method: "GET", "credentials": "include"})
        .then(response => response.json())
        .then(data => {
        if(data && data.user.id) {
            userId = data.user.id;
            localStorage.setItem("guessFinderUserId", userId);
        } else {
            console.log('ID not found in the response');
        }
    })
        .catch(error => console.error('Error:', error));
}

const run = async () => {
    MAP_MAKING_API_KEY = document.getElementById('mmaAPIkeyInput').value
    localStorage.setItem('guessFinderMMAApiKey', MAP_MAKING_API_KEY);
    const maps = await getMaps();
    const mapId = document.getElementById('dropdownInput').value;
    if (mapId == "") return;
    const months = document.getElementById("monthsOfDuelsInput").value;
    if (months <= 0) return;
    const scoreThreshold = document.getElementById("scoreThresholdInput").value;
    if (scoreThreshold == "" || scoreThreshold < 0) return;
    const map = maps.find(map => map.id == mapId);
    const duelIds = await fetchGeoGuessrData(userId, subtractMonths(months));
    let locsPushed = 0;
    let status = {matching: 0, guesses: 0}
    for (const id of duelIds) {
        let api_url = `https://game-server.geoguessr.com/api/duels/${id}`;
        let res = await fetch(api_url, {method: "GET", "credentials": "include"})
        let json = await res.json();
        const incorrectGuesses = await findIncorrectGuesses(json, userId, status, scoreThreshold);
        if (incorrectGuesses.length) {
//            console.log(`https://www.geoguessr.com/duels/${res}/summary`);
  //          console.log(incorrectGuesses);
            for (const guess of incorrectGuesses) {
                let loc = guess.panorama;
                if (loc.panoId) loc.panoId = decodePanoId(loc.panoId);
                let tags = [];
                if (guess.guessedCountryCode) tags.push(`guessed ${guess.guessedCountryCode}`)
                if (guess.actualCountryCode) tags.push(`actual ${guess.actualCountryCode}`)
                tags.push(`date: ${extractDate(json.rounds[0].startTime)}`)
                tags.push(`score: ${formatScore(guess.score)}`)
                await importLocations(map.id, [{
                    id: -1,
                    location: loc,
                    panoId: loc.panoId ?? null,
                    heading: loc.heading ?? 0,
                    pitch: loc.pitch ?? 0,
                    zoom: loc.zoom === 0 ? null : loc.zoom,
                    tags,
                    flags: loc.panoId ? 1 : 0
                }]);
                locsPushed++;
            }
        }
    }
    statusUpdater.updateStatus("done");
}

const populateMaps = maps => {
    const dropdown = document.querySelector("#dropdownInput");
    maps.forEach( item => {
        let option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        dropdown.appendChild(option);
    });
};

const addPopup = async (refresh=false) => {
    if (refresh || (document.querySelector('[class^=header_header__]') && document.querySelector('#guessFinderPopupWrapper') === null)) {
        if (!refresh) {
            insertHeaderGui(document.querySelector('[class^=header_context__]'), guiHTMLHeader)
            const dropdown = document.querySelector("#dropdownInput");
            const maps = await getMaps(true);

            // Clear existing options
            dropdown.innerHTML = '';
            // Append new options
            let defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = ''; // Empty text for default option
            dropdown.appendChild(defaultOption);

            if (maps) {
                populateMaps(maps);
            }

            let apiKey = document.getElementById("mmaAPIkeyInput");
            apiKey.value = MAP_MAKING_API_KEY;
//            console.log(MAP_MAKING_API_KEY);

            apiKey.addEventListener("input", async () => {
                MAP_MAKING_API_KEY = apiKey.value
                const maps = await getMaps();
                populateMaps(maps);
            });

            const runButton = document.getElementById('runButton');
            if (runButton) {
                runButton.addEventListener('click', run);
            }
            statusUpdater = new StatusUpdater("guessFinderStatus");
        }
    }
}

const updateImage = (refresh=false) => {
    // Don't do anything while the page is loading
    if (document.querySelector("[class^=page-loading_loading__]")) return;
    addPopup();
}


new MutationObserver(async (mutations) => {
    updateImage()
}).observe(document.body, { subtree: true, childList: true });

const CountryDict = {
    AF: 'AF',
    AX: 'FI', // Aland Islands
    AL: 'AL',
    DZ: 'DZ',
    AS: 'US', // American Samoa
    AD: 'AD',
    AO: 'AO',
    AI: 'GB', // Anguilla
    AQ: 'AQ', // Antarctica
    AG: 'AG',
    AR: 'AR',
    AM: 'AM',
    AW: 'NL', // Aruba
    AU: 'AU',
    AT: 'AT',
    AZ: 'AZ',
    BS: 'BS',
    BH: 'BH',
    BD: 'BD',
    BB: 'BB',
    BY: 'BY',
    BE: 'BE',
    BZ: 'BZ',
    BJ: 'BJ',
    BM: 'GB', // Bermuda
    BT: 'BT',
    BO: 'BO',
    BQ: 'NL', // Bonaire, Sint Eustatius, Saba
    BA: 'BA',
    BW: 'BW',
    BV: 'NO', // Bouvet Island
    BR: 'BR',
    IO: 'GB', // British Indian Ocean Territory
    BN: 'BN',
    BG: 'BG',
    BF: 'BF',
    BI: 'BI',
    KH: 'KH',
    CM: 'CM',
    CA: 'CA',
    CV: 'CV',
    KY: 'UK', // Cayman Islands
    CF: 'CF',
    TD: 'TD',
    CL: 'CL',
    CN: 'CN',
    CX: 'AU', // Christmas Islands
    CC: 'AU', // Cocos (Keeling) Islands
    CO: 'CO',
    KM: 'KM',
    CG: 'CG',
    CD: 'CD',
    CK: 'NZ', // Cook Islands
    CR: 'CR',
    CI: 'CI',
    HR: 'HR',
    CU: 'CU',
    CW: 'NL', // Curacao
    CY: 'CY',
    CZ: 'CZ',
    DK: 'DK',
    DJ: 'DJ',
    DM: 'DM',
    DO: 'DO',
    EC: 'EC',
    EG: 'EG',
    SV: 'SV',
    GQ: 'GQ',
    ER: 'ER',
    EE: 'EE',
    ET: 'ET',
    FK: 'GB', // Falkland Islands
    FO: 'DK', // Faroe Islands
    FJ: 'FJ',
    FI: 'FI',
    FR: 'FR',
    GF: 'FR', // French Guiana
    PF: 'FR', // French Polynesia
    TF: 'FR', // French Southern Territories
    GA: 'GA',
    GM: 'GM',
    GE: 'GE',
    DE: 'DE',
    GH: 'GH',
    GI: 'UK', // Gibraltar
    GR: 'GR',
    GL: 'DK', // Greenland
    GD: 'GD',
    GP: 'FR', // Guadeloupe
    GU: 'US', // Guam
    GT: 'GT',
    GG: 'GB', // Guernsey
    GN: 'GN',
    GW: 'GW',
    GY: 'GY',
    HT: 'HT',
    HM: 'AU', // Heard Island and McDonald Islands
    VA: 'VA',
    HN: 'HN',
    HK: 'CN', // Hong Kong
    HU: 'HU',
    IS: 'IS',
    IN: 'IN',
    ID: 'ID',
    IR: 'IR',
    IQ: 'IQ',
    IE: 'IE',
    IM: 'GB', // Isle of Man
    IL: 'IL',
    IT: 'IT',
    JM: 'JM',
    JP: 'JP',
    JE: 'GB', // Jersey
    JO: 'JO',
    KZ: 'KZ',
    KE: 'KE',
    KI: 'KI',
    KR: 'KR',
    KW: 'KW',
    KG: 'KG',
    LA: 'LA',
    LV: 'LV',
    LB: 'LB',
    LS: 'LS',
    LR: 'LR',
    LY: 'LY',
    LI: 'LI',
    LT: 'LT',
    LU: 'LU',
    MO: 'CN', // Macao
    MK: 'MK',
    MG: 'MG',
    MW: 'MW',
    MY: 'MY',
    MV: 'MV',
    ML: 'ML',
    MT: 'MT',
    MH: 'MH',
    MQ: 'FR', // Martinique
    MR: 'MR',
    MU: 'MU',
    YT: 'FR', // Mayotte
    MX: 'MX',
    FM: 'FM',
    MD: 'MD',
    MC: 'MC',
    MN: 'MN',
    ME: 'ME',
    MS: 'GB', // Montserrat
    MA: 'MA',
    MZ: 'MZ',
    MM: 'MM',
    NA: 'NA',
    NR: 'NR',
    NP: 'NP',
    NL: 'NL',
    AN: 'NL', // Netherlands Antilles
    NC: 'FR', // New Caledonia
    NZ: 'NZ',
    NI: 'NI',
    NE: 'NE',
    NG: 'NG',
    NU: 'NZ', // Niue
    NF: 'AU', // Norfolk Island
    MP: 'US', // Northern Mariana Islands
    NO: 'NO',
    OM: 'OM',
    PK: 'PK',
    PW: 'PW',
    PS: 'IL', // Palestine
    PA: 'PA',
    PG: 'PG',
    PY: 'PY',
    PE: 'PE',
    PH: 'PH',
    PN: 'GB', // Pitcairn
    PL: 'PL',
    PT: 'PT',
    PR: 'US', // Puerto Rico
    QA: 'QA',
    RE: 'FR', // Reunion
    RO: 'RO',
    RU: 'RU',
    RW: 'RW',
    BL: 'FR', // Saint Barthelemy
    SH: 'GB', // Saint Helena
    KN: 'KN',
    LC: 'LC',
    MF: 'FR', // Saint Martin
    PM: 'FR', // Saint Pierre and Miquelon
    VC: 'VC',
    WS: 'WS',
    SM: 'SM',
    ST: 'ST',
    SA: 'SA',
    SN: 'SN',
    RS: 'RS',
    SC: 'SC',
    SL: 'SL',
    SG: 'SG',
    SX: 'NL', // Sint Maarten
    SK: 'SK',
    SI: 'SI',
    SB: 'SB',
    SO: 'SO',
    ZA: 'ZA',
    GS: 'GB', // South Georgia and the South Sandwich Islands
    ES: 'ES',
    LK: 'LK',
    SD: 'SD',
    SR: 'SR',
    SJ: 'NO', // Svalbard and Jan Mayen
    SZ: 'SZ',
    SE: 'SE',
    CH: 'CH',
    SY: 'SY',
    TW: 'TW', // Taiwan
    TJ: 'TJ',
    TZ: 'TZ',
    TH: 'TH',
    TL: 'TL',
    TG: 'TG',
    TK: 'NZ', // Tokelau
    TO: 'TO',
    TT: 'TT',
    TN: 'TN',
    TR: 'TR',
    TM: 'TM',
    TC: 'GB', // Turcs and Caicos Islands
    TV: 'TV',
    UG: 'UG',
    UA: 'UA',
    AE: 'AE',
    GB: 'GB',
    US: 'US',
    UM: 'US', // US Minor Outlying Islands
    UY: 'UY',
    UZ: 'UZ',
    VU: 'VU',
    VE: 'VE',
    VN: 'VN',
    VG: 'GB', // British Virgin Islands
    VI: 'US', // US Virgin Islands
    WF: 'FR', // Wallis and Futuna
    EH: 'MA', // Western Sahara
    YE: 'YE',
    ZM: 'ZM',
    ZW: 'ZW'
};