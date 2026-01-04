// ==UserScript==
// @name         Blooket Bot Blocker (BBB)
// @namespace    https://tameprmonkey.net/
// @version      12.0
// @description  Block Bots in Blooket!
// @author       thundercatcher
// @match        *://*dashboard.blooket.com/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445547/Blooket%20Bot%20Blocker%20%28BBB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445547/Blooket%20Bot%20Blocker%20%28BBB%29.meta.js
// ==/UserScript==

if (
  window.fireLoaded ||
  window.parent?.kantibotEnabled ||
  window.parent?.fireLoaded
) {
  throw "[ANTIBOT] - page is loaded";
}
if (window.localStorage.extraCheck) {
  console.log("[ANTIBOT] - Detected PIN Checker");
}
if (window.localStorage.kahootThemeScript) {
  console.log("[ANTIBOT] - Detected KonoSuba Theme");
}

let writePromise = new Promise(() => {});

// Should allow for default behavior and reload page
if (location.pathname.includes("/oauth2/")) {
  setTimeout(() => {
    location.reload();
  }, 3e3);
} else {
  writePromise = new Promise((res) =>
    setTimeout(() => {
      document.write(`
      <p id="antibot-loading-notice">[ANTIBOT] - Patching Blooket. Please wait.</p>
      <p>If screen stays blank for a long time, report an issue in <a href="https://discord.gg/TSBEk5yzU8">Discord</a>.</p>
     `);
      res();
    }, 250)
  );
}
window.antibotAdditionalScripts = window.antibotAdditionalScripts || [];
window.antibotAdditionalReplacements =
  window.antibotAdditionalReplacements || [];
window.kantibotEnabled = true;

/**
 * External Libraries
 * Note: This script requires https://raw.githubusercontent.com/theusaf/a-set-of-english-words/master/index.js
 * - This is a script that loads 275k english words into a set. (about 30MB ram?)
 * @see https://github.com/theusaf/a-set-of-english-words
 *
 * Also, it requires https://raw.githubusercontent.com/theusaf/random-name/master/names.js
 * - Loads a bunch of names into sets.
 * @see https://raw.githubusercontent.com/theusaf/random-name
 *
 * If these get removed or fail to load, this should not break the service, but will cause certain features to not work
 */
const url = window.location.href,
  requiredAssets = [
    "https://raw.githubusercontent.com/theusaf/a-set-of-english-words/master/index.js",
    "https://raw.githubusercontent.com/theusaf/random-name/master/names.js"
  ],
  importBlobURLs = {};

window.importBlobURLs = importBlobURLs;

/**
 * Creates a blob url from a string.
 *
 * @param {string} script The text to convert to a blob url
 * @returns {string} The blob url
 */
function createBlobURL(script) {
  return URL.createObjectURL(
    new Blob([script], { type: "application/javascript" })
  );
}

/**
 * Patches the imported url and resolves with the patched script.
 *
 * @param {string} url The url being imported
 * @returns {Promise<any>} The imported script's exports
 */
async function antibotImport(url) {
  const importBlobURLs =
      window.importBlobURLs ??
      window.parent?.importBlobURLs ??
      window.windw?.importBlobURLs,
    makeHttpRequest =
      window.kantibotMakeHTTPRequest ??
      window.parent?.kantibotMakeHTTPRequest ??
      window.windw?.kantibotMakeHTTPRequest,
    createBlobURL =
      window.kantibotCreateBlobURL ??
      window.parent?.kantibotCreateBlobURL ??
      window.windw?.kantibotCreateBlobURL;

  console.log(`[ANTIBOT] - Handling import of ${url}`);
  // We need to intercept any requests and modify them!
  if (url.startsWith(".")) {
    url = `https://assets-cdn.kahoot.it/player/v2/assets${url.substring(1)}`;
  }
  if (importBlobURLs[url]) {
    console.log(`[ANTIBOT] - ${url} already exists.`);
    return import(importBlobURLs[url]);
  } else {
    // check if this url needs to be patched!
    let { response: moduleCode } = await makeHttpRequest(url),
      needsEdit = false;
    const importFunctionRegex = /\bimport\b\(/g,
      importStatementRegex =
        /\bimport\b[\w.\-{}\s[\],:]*?\bfrom\b"[\w.\-/]*?"/g;

    // if it has dynamic import statements
    if (importFunctionRegex.test(moduleCode)) {
      needsEdit = true;
      moduleCode = moduleCode.replace(importFunctionRegex, "antibotImport(");
      moduleCode = `${antibotImport.toString()}${moduleCode}`;
    }
    // if it has a regular import statement
    if (importStatementRegex.test(moduleCode)) {
      // Check if url exists for the import
      for (const imp of moduleCode.match(importStatementRegex)) {
        const [, impURL] = imp.match(/"([\w.\-/]*?)"/);
        let editedImportURL = impURL;
        if (editedImportURL.startsWith(".")) {
          editedImportURL = `https://assets-cdn.kahoot.it/player/v2/assets${editedImportURL.substring(
            1
          )}`;
        }
        if (importBlobURLs[editedImportURL]) {
          needsEdit = true;
          moduleCode = moduleCode.replace(
            impURL,
            importBlobURLs[editedImportURL]
          );
        }
      }
    }
    if (needsEdit) {
      // Create a blob url and import it!
      console.log(`[ANTIBOT] - Modifying ${url} and creating blob url.`);
      const blobURL = createBlobURL(moduleCode);
      importBlobURLs[url] = blobURL;
      return import(blobURL);
    } else {
      console.log(`[ANTIBOT] - ${url} does not require a blob version.`);
      // So we don't keep checking it each time
      importBlobURLs[url] = url;
      return import(url);
    }
  }
}

/**
 * Makes an http request, and resolves with the request after the response is received.
 *
 * @param {string} url The url to request
 * @returns {Promise<XMLHttpRequest>}
 */
function makeHttpRequest(url) {
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.send();
  return new Promise((resolve, reject) => {
    request.onerror = request.onload = () => {
      if (request.readyState === 4 && request.status === 200) {
        resolve(request);
      } else {
        reject(request);
      }
    };
  });
}

/**
 * Fetches the main page, and fetches the assets to be modified.
 *
 * @returns {Promise<{
 *   page: string,
 *   mainScriptURL: string
 * }>} The page's content (patched) and the main script's url
 */
async function fetchMainPage() {
  const mainPageRequest = await makeHttpRequest(url),
    [mainScriptURL] = mainPageRequest.response.match(
      /\/\/assets-cdn.*\/v2\/assets\/index.*?(?=")/
    ),
    originalPage = mainPageRequest.response.replace(
      /<script type="module".*?<\/script>/,
      ""
    );
  return {
    page: originalPage,
    mainScriptURL: mainScriptURL.startsWith("//")
      ? `https:${mainScriptURL}`
      : mainScriptURL
  };
}

/**
 * Fetches the main script and patches it to gain access to internal data.
 *
 * @param {string} mainScriptURL The url of the main script
 * @returns {Promise<string>} The main script (patched)
 */
async function fetchMainScript(mainScriptURL) {
  const mainScriptRequest = await makeHttpRequest(mainScriptURL);
  let mainScript = mainScriptRequest.response;
  // Access the currentQuestionTimer and change the question time
  const currentQuestionTimerRegex =
      /currentQuestionTimer:([$\w]+)\.payload\.questionTime/,
    [, currentQuestionTimerLetter] = mainScript.match(
      currentQuestionTimerRegex
    );
  mainScript = mainScript.replace(
    currentQuestionTimerRegex,
    `currentQuestionTimer:${currentQuestionTimerLetter}.payload.questionTime + (()=>{
      return (windw.antibotData.settings.teamtimeout * 1000) || 0;
    })()`
  );

  // Access global functions. Also gains direct access to the controllers?
  const globalFuncRegex =
      /\({[^"`]*?quiz[^"`]*?startQuiz:([$\w]+).*?}\)=>{(?=var)/,
    [globalFuncMatch, globalFuncLetter] = mainScript.match(globalFuncRegex);
  mainScript = mainScript.replace(
    globalFuncRegex,
    `${globalFuncMatch}windw.antibotData.kahootInternals.globalFuncs = {startQuiz:${globalFuncLetter}};`
  );
  // Access the fetched quiz information. Allows the quiz to be modified when the quiz is fetched!
  // Note to future maintainer: if code switches back to using a function(){} rather than arrow function, see v3.1.5
  const fetchedQuizInformationRegex =
      /RETRIEVE_KAHOOT_ERROR",.*?{response:([$\w]+)}\)/,
    [fetchedQuizInformationCode, fetchedQuizInformationLetter] =
      mainScript.match(fetchedQuizInformationRegex);
  mainScript = mainScript.replace(
    fetchedQuizInformationRegex,
    `RETRIEVE_KAHOOT_ERROR",${
      fetchedQuizInformationCode
        .split('RETRIEVE_KAHOOT_ERROR",')[1]
        .split("response:")[0]
    }response:(()=>{
      windw.antibotData.kahootInternals.globalQuizData = ${fetchedQuizInformationLetter};
      windw.antibotData.methods.extraQuestionSetup(${fetchedQuizInformationLetter});
      return ${fetchedQuizInformationLetter};
    })()})`
  );
  // Access the core data
  const coreDataRegex = /([$\w]+)\.game\.core/,
    [, coreDataLetter] = mainScript.match(coreDataRegex);
  mainScript = mainScript.replace(
    coreDataRegex,
    `(()=>{
      if(typeof windw !== "undefined"){
        windw.antibotData.kahootInternals.kahootCore = ${coreDataLetter};
      }
      return ${coreDataLetter}.game.core;
    })()`
  );
  // Access game settings (somehow removed from the core data...)
  // 3.2.8 --> added back to core data
  // This code doesn't actually do anything, but is kept in case
  const gameSettingsRegex = /getGameOptions\(\){/;
  mainScript = mainScript.replace(
    gameSettingsRegex,
    `getGameOptions() {
      if (typeof windw !== "undefined") {
        windw.antibotData.kahootInternals.gameOptions = this;
      }`
  );
  // Access two factor stuff
  const twoFactorRegex = /(const [$\w]+=)7,/;
  mainScript = mainScript.replace(
    twoFactorRegex,
    `${mainScript.match(twoFactorRegex)[1]}(()=>{
      const antibotConfig = JSON.parse(localStorage.antibotConfig || "{}"),
        {twoFactorTime} = antibotConfig;
      if (twoFactorTime) {
        return +twoFactorTime;
      } else {
        return 7;
      }
    })(),`
  );
  // Overwrite navigation (opens in parent, preventing iframe issues)
  const navigationRegex =
      /prototype\.navigate=function\(([$\w]+)\){(.{1,80}?window\.location\.replace)/,
    [, navigationLetter, navigationOriginalCode] =
      mainScript.match(navigationRegex);
  mainScript = mainScript.replace(
    navigationRegex,
    `prototype.navigate = function(${navigationLetter}) {
      if (${navigationLetter}.url && typeof windw !== "undefined") {
        windw.location.replace(${navigationLetter}.url);
        return;
      }
      ${navigationOriginalCode}`
  );

  // access message socket
  // moved from "vendors"
  const patchedScriptRegex = /\.onMessage=function\(([$\w]+),([$\w]+)\)\{/,
    [, websocketMessageLetter1, websocketMessageLetter2] =
      mainScript.match(patchedScriptRegex);
  mainScript = mainScript.replace(
    patchedScriptRegex,
    `.onMessage = function(${websocketMessageLetter1},${websocketMessageLetter2}){
      windw.antibotData.methods.websocketMessageHandler(${websocketMessageLetter1},${websocketMessageLetter2});`
  );

  // other replacements
  for (const func of window.antibotAdditionalReplacements) {
    mainScript = func(mainScript);
  }

  // modified import
  mainScript = mainScript.replace(/\bimport\b\(/g, "antibotImport(");

  mainScript = `${antibotImport.toString()}${mainScript}`;

  return mainScript;
}

const kantibotProgramCode = () => {
  class EvilBotJoinedError extends Error {
    constructor() {
      super("Bot Banned, Ignore Join");
    }
  }

  class AnsweredTooQuicklyError extends Error {
    constructor() {
      super("Answer was too quick!");
    }
  }

  const windw = window.parent;
  window.windw = windw;

  /**
   * createSetting - Creates a setting option string
   *
   * @param  {String}   name         The name of the option
   * @param  {String}   type         The type of the option
   * @param  {String}   id           The id of the option
   * @param  {String}   description  The description of the option
   * @param  {String}   default      The default value of the option
   * @param  {Function} setup        A function to modify the input,label
   * @param  {Function} callback     A function to call when the value changes
   * @returns {String}               The resulting HTML for the option
   */
  function createSetting(
    name,
    type,
    id,
    description,
    def = null,
    setup = () => {},
    callback = () => {}
  ) {
    const label = document.createElement("label"),
      input =
        type === "textarea"
          ? document.createElement("textarea")
          : document.createElement("input"),
      container = document.createElement("div");
    if (type !== "textarea") {
      input.setAttribute("type", type);
    } else {
      input.setAttribute(
        "onclick",
        `
        this.className = "antibot-textarea";
        `
      );
      input.setAttribute(
        "onblur",
        `
        this.className = "";
        `
      );
    }
    input.id = label.htmlFor = `antibot.config.${id}`;
    label.id = input.id + ".label";
    label.title = description;
    label.innerHTML = name;
    if (type === "checkbox") {
      container.append(input, label);
      input.setAttribute(
        "onclick",
        `
        const value = event.target.checked;
        windw.antibotData.methods.setSetting(event.target.id.match(/\\w+$/)[0], value);
        (${callback.toString()})(event.target);
        `
      );
    } else {
      container.append(label, input);
      input.setAttribute(
        "onchange",
        `
        const value = event.target.nodeName === "TEXTAREA" ? event.target.value.split("\\n") : event.target.type === "number" ? +event.target.value : event.target.value;
        windw.antibotData.methods.setSetting(event.target.id.match(/\\w+$/)[0], value);
        (${callback.toString()})(event.target);
        `
      );
      label.className = "antibot-input";
    }
    if (def != null) {
      if (type === "checkbox") {
        if (def) {
          input.setAttribute("checked", "");
        }
      } else {
        input.setAttribute("value", `${def}`);
      }
    }
    setup(input, label);
    return container.outerHTML;
  }

  // create watermark
  const UITemplate = document.createElement("template");
  UITemplate.innerHTML = `<div id="antibotwtr">
    <p>v3.5.0 ©theusaf</p>
    <p id="antibot-killcount">0</p>
    <details>
      <summary>config</summary>
      <div id="antibot-settings">
${createSetting(
  "Block Fast Answers",
  "checkbox",
  "timeout",
  "Blocks answers sent 0.5 seconds after the question starts"
)}
${createSetting(
  "Block Random Names",
  "checkbox",
  "looksRandom",
  "Blocks names that look random, such as 'rAnDOM naMe'",
  true
)}
${createSetting(
  "Block Format F[.,-]L",
  "checkbox",
  "blockformat1",
  "Blocks names using the format [First][random char][Last]",
  true
)}
${createSetting(
  "Additional Blocking Filters",
  "checkbox",
  "blockservice1",
  "Enables multiple additional blocking filters for some bot programs"
)}
${createSetting(
  "Block Numbers",
  "checkbox",
  "blocknum",
  "Blocks names containing numbers, if multiple with numbers join within a short period of time"
)}
${createSetting(
  "Force Alphanumeric Names",
  "checkbox",
  "forceascii",
  "Blocks names containing non-alphanumeric characters, if multiple join within a short period of time"
)}
${createSetting(
  "Detect Patterns",
  "checkbox",
  "patterns",
  "Blocks bots spammed using similar patterns"
)}
${createSetting(
  "Additional Question Time",
  "number",
  "teamtimeout",
  "Adds extra seconds to a question",
  0,
  (input) => input.setAttribute("step", 1)
)}
${createSetting(
  "Two-Factor Auth Timer",
  "number",
  "twoFactorTime",
  "Specify the number of seconds for the two-factor auth. The first iteration will use the default 7 seconds, then will use your input",
  7,
  (input) => {
    input.setAttribute("step", 1);
    input.setAttribute("min", 1);
  },
  () => {
    windw.antibotData.methods.kahootAlert(
      "Changes will only take effect upon reload."
    );
  }
)}
${createSetting(
  "Name Match Percent",
  "number",
  "percent",
  "The percent to check name similarity before banning the bot.",
  0.6,
  (input) => input.setAttribute("step", 0.1)
)}
${createSetting(
  "Word Blacklist",
  "textarea",
  "wordblock",
  "Block names containing any from a list of words. Separate by new line."
)}
${createSetting(
  "Auto-Lock Threshold",
  "number",
  "ddos",
  "Specify the number of bots/minute to lock the game. Set to 0 to disable",
  0,
  (input) => input.setAttribute("step", 1)
)}
${createSetting(
  "Lobby Auto-Start Time",
  "number",
  "start_lock",
  "Specify the maximum amount of time for a lobby to stay open after a player joins. Set to 0 to disable",
  0,
  (input) => input.setAttribute("step", 1)
)}
${createSetting(
  "Show Antibot Timers",
  "checkbox",
  "counters",
  "Display Antibot Counters/Timers (Lobby Auto-Start, Auto-Lock, etc)"
)}
${createSetting(
  "Counter Kahoot! Cheats",
  "checkbox",
  "counterCheats",
  "Adds an additional 5 second question at the end to counter cheats. Changing this mid-game may break the game or will not apply until refresh",
  null,
  undefined,
  () => {
    windw.antibotData.methods.kahootAlert(
      "Changes may only take effect upon reload."
    );
  }
)}
${createSetting(
  "Enable CAPTCHA",
  "checkbox",
  "enableCAPTCHA",
  "Adds a 30 second poll at the start of the quiz. If players don't answer it correctly, they get banned. Changing this mid-game may break the game or will not apply until refresh",
  null,
  undefined,
  () => {
    windw.antibotData.methods.kahootAlert(
      "Changes may only take effect upon reload."
    );
  }
)}
${createSetting(
  "Reduce False-Positivess",
  "checkbox",
  "reduceFalsePositives",
  "Makes some checks less strict to attempt to reduce the number of false-positives banned."
)}
      </div>
    </details>
  </div>
  <style>
    #antibotwtr {
      position: fixed;
      bottom: 100px;
      right: 100px;
      font-size: 1rem;
      opacity: 0.4;
      transition: opacity 0.4s;
      z-index: 5000;
      background: white;
      text-align: center;
      border-radius: 0.5rem;
    }
    #antibotwtr summary {
      text-align: left;
    }
    #antibotwtr:hover {
      opacity: 1;
    }
    #antibotwtr p {
      display: inline-block;
    }
    #antibotwtr p:first-child {
      font-weight: 600;
    }
    #antibot-killcount {
      margin-left: 0.25rem;
      background: black;
      border-radius: 0.5rem;
      color: white;
    }
    #antibotwtr details {
      background: grey;
    }
    #antibotwtr input[type="checkbox"] {
      display: none;
    }
    #antibotwtr label {
      color: black;
      font-weight: 600;
      display: block;
      background: #c60929;
      border-radius: 0.5rem;
      height: 100%;
      word-break: break-word;
    }
    #antibotwtr .antibot-input {
      height: calc(100% - 1.5rem);
      background: #864cbf;
      color: white;
    }
    #antibotwtr input,textarea {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1rem;
      border-radius: 0.25rem;
      border: solid 1px black;
      font-family: "Montserrat", sans-serif;
      resize: none;
    }
    #antibotwtr input:checked+label {
      background: #26890c;
    }
    #antibot-settings {
      display: flex;
      flex-wrap: wrap;
      max-width: 25rem;
      max-height: 24rem;
      overflow: auto;
    }
    #antibot-settings > div {
      flex: 1;
      max-width: 33%;
      min-width: 33%;
      min-height: 6rem;
      box-sizing: border-box;
      position: relative;
      border: solid 0.5rem transparent;
    }
    #antibot-counters {
      position: absolute;
      right: 10rem;
      top: 11rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      pointer-events: none;
      z-index: 1;
    }
    #antibot-counters div {
      background: rgba(0,0,0,0.5);
      padding: 0.5rem;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .antibot-count-num {
      display: block;
      text-align: center;
    }
    .antibot-count-desc {
      text-align: center;
      font-size: 1.25rem;
      display: block;
    }
    .antibot-textarea {
      position: fixed;
      width: 40rem;
      height: 30rem;
      margin: auto;
      left: 0;
      top: 0;
      margin-left: calc(50% - 20rem);
      z-index: 1;
      font-size: 1.5rem;
      font-weight: bold;
    }
  </style>`;
  const counters = document.createElement("div");
  counters.id = "antibot-counters";
  document.body.append(UITemplate.content.cloneNode(true), counters);

  function makeHttpRequest(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.send();
    return new Promise((resolve, reject) => {
      request.onerror = request.onload = () => {
        if (request.readyState === 4 && request.status === 200) {
          resolve(request);
        } else {
          reject(request);
        }
      };
    });
  }

  async function patchLobbyView(url) {
    const { response } = await makeHttpRequest(url),
      lobbyRegex = /\w=[a-z]\.startQuiz/,
      lobbyLetter = response.match(lobbyRegex)[0].match(/[a-z](?=\.)/)[0],
      patched = response.replace(
        response.match(lobbyRegex)[0],
        `${response.match(lobbyRegex)[0]},
        ANTIBOT_PATCH = (() => {
          windw.antibotData.kahootInternals.globalFuncs = ${lobbyLetter};
        })()`
      ),
      script = document.createElement("script");
    script.innerHTML = patched;
    document.head.append(script);
  }

  function capitalize(string) {
    string = string.toLowerCase();
    return string[0].toUpperCase() + string.slice(1);
  }

  function similarity(s1, s2) {
    // remove numbers from name if name is not only a number
    if (isNaN(s1) && typeof s1 !== "object" && !isUsingNamerator()) {
      s1 = s1.replace(/[0-9]/gm, "");
    }
    if (isNaN(s2) && typeof s2 !== "object" && !isUsingNamerator()) {
      s2 = s2.replace(/[0-9]/gm, "");
    }
    if (!s2) {
      return 0;
    }
    // if is a number of the same length
    if (s1) {
      if (!isNaN(s2) && !isNaN(s1) && s1.length === s2.length) {
        return 1;
      }
    }
    // apply namerator rules
    if (isUsingNamerator()) {
      if (!isValidNameratorName(s2)) {
        return -1;
      } else {
        // safe name
        return 0;
      }
    }
    if (!s1) {
      return;
    }
    // ignore case
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    let longer = s1,
      shorter = s2;
    // begin math to determine similarity
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (
      (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
    );
  }

  function isValidNameratorName(name) {
    const First = [
        "Adorable",
        "Agent",
        "Agile",
        "Amazing",
        "Amazon",
        "Amiable",
        "Amusing",
        "Aquatic",
        "Arctic",
        "Awesome",
        "Balanced",
        "Blue",
        "Bold",
        "Brave",
        "Bright",
        "Bronze",
        "Captain",
        "Caring",
        "Champion",
        "Charming",
        "Cheerful",
        "Classy",
        "Clever",
        "Creative",
        "Cute",
        "Dandy",
        "Daring",
        "Dazzled",
        "Decisive",
        "Diligent",
        "Diplomat",
        "Doctor",
        "Dynamic",
        "Eager",
        "Elated",
        "Epic",
        "Excited",
        "Expert",
        "Fabulous",
        "Fast",
        "Fearless",
        "Flying",
        "Focused",
        "Friendly",
        "Funny",
        "Fuzzy",
        "Genius",
        "Gentle",
        "Giving",
        "Glad",
        "Glowing",
        "Golden",
        "Great",
        "Green",
        "Groovy",
        "Happy",
        "Helpful",
        "Hero",
        "Honest",
        "Inspired",
        "Jolly",
        "Joyful",
        "Kind",
        "Knowing",
        "Legend",
        "Lively",
        "Lovely",
        "Lucky",
        "Magic",
        "Majestic",
        "Melodic",
        "Mighty",
        "Mountain",
        "Mystery",
        "Nimble",
        "Noble",
        "Polite",
        "Power",
        "Prairie",
        "Proud",
        "Purple",
        "Quick",
        "Radiant",
        "Rapid",
        "Rational",
        "Rockstar",
        "Rocky",
        "Royal",
        "Shining",
        "Silly",
        "Silver",
        "Smart",
        "Smiling",
        "Smooth",
        "Snowy",
        "Soaring",
        "Social",
        "Space",
        "Speedy",
        "Stellar",
        "Sturdy",
        "Super",
        "Swift",
        "Tropical",
        "Winged",
        "Wise",
        "Witty",
        "Wonder",
        "Yellow",
        "Zany"
      ],
      Last = [
        "Alpaca",
        "Ant",
        "Badger",
        "Bat",
        "Bear",
        "Bee",
        "Bison",
        "Boa",
        "Bobcat",
        "Buffalo",
        "Bunny",
        "Camel",
        "Cat",
        "Cheetah",
        "Chicken",
        "Condor",
        "Crab",
        "Crane",
        "Deer",
        "Dingo",
        "Dog",
        "Dolphin",
        "Dove",
        "Dragon",
        "Duck",
        "Eagle",
        "Echidna",
        "Egret",
        "Elephant",
        "Elk",
        "Emu",
        "Falcon",
        "Ferret",
        "Finch",
        "Fox",
        "Frog",
        "Gator",
        "Gazelle",
        "Gecko",
        "Giraffe",
        "Glider",
        "Gnu",
        "Goat",
        "Goose",
        "Gorilla",
        "Griffin",
        "Hamster",
        "Hare",
        "Hawk",
        "Hen",
        "Horse",
        "Ibex",
        "Iguana",
        "Impala",
        "Jaguar",
        "Kitten",
        "Koala",
        "Lark",
        "Lemming",
        "Lemur",
        "Leopard",
        "Lion",
        "Lizard",
        "Llama",
        "Lobster",
        "Macaw",
        "Meerkat",
        "Monkey",
        "Mouse",
        "Newt",
        "Octopus",
        "Oryx",
        "Ostrich",
        "Otter",
        "Owl",
        "Panda",
        "Panther",
        "Pelican",
        "Penguin",
        "Pigeon",
        "Piranha",
        "Pony",
        "Possum",
        "Puffin",
        "Quail",
        "Rabbit",
        "Raccoon",
        "Raven",
        "Rhino",
        "Rooster",
        "Sable",
        "Seal",
        "SeaLion",
        "Shark",
        "Sloth",
        "Snail",
        "Sphinx",
        "Squid",
        "Stork",
        "Swan",
        "Tiger",
        "Turtle",
        "Unicorn",
        "Urchin",
        "Wallaby",
        "Wildcat",
        "Wolf",
        "Wombat",
        "Yak",
        "Yeti",
        "Zebra"
      ],
      F = name.match(/[A-Z][a-z]+(?=[A-Z])/);
    if (F === null || !First.includes(F[0])) {
      return false;
    }
    const L = name.replace(F[0], "");
    if (!Last.includes(L)) {
      return false;
    }
    return true;
  }

  function isFakeValid(name) {
    if (!windw.isUsingNamerator && isValidNameratorName(name)) {
      return true;
    }
    if (getSetting("blocknum") && /\d/.test(name)) {
      return true;
    }
    if (getSetting("forceascii") && /[^\d\s\w_-]/.test(name)) {
      return true;
    }
    return /(^([A-Z][a-z]+){2,3}\d{1,2}$)|(^([A-Z][^A-Z\n]+?)+?(\d[a-z]+\d*?)$)|(^[a-zA-Z]+\d{4,}$)/.test(
      name
    );
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) {
        costs[s2.length] = lastValue;
      }
    }
    return costs[s2.length];
  }

  function getPatterns(string) {
    const isLetter = (char) => {
        return /\p{L}/u.test(char);
      },
      isUppercaseLetter = (char) => {
        return char.toUpperCase() === char;
      },
      isNumber = (char) => {
        return /\p{N}/u.test(char);
      };
    let output = "",
      mode = null,
      count = 0;
    for (let i = 0; i < string.length; i++) {
      const char = string[i];
      let type = null;
      if (isLetter(char)) {
        if (isUppercaseLetter(char)) {
          type = "C";
        } else {
          type = "L";
        }
      } else if (isNumber(char)) {
        type = "D";
      } else {
        // special character
        type = "U";
      }
      if (type !== mode) {
        if (mode !== null) {
          output += Math.floor(count / 3);
        }
        count = 0;
        mode = type;
        output += type;
      } else {
        count++;
        if (i === string.length - 1) {
          output += Math.floor(count / 3);
        }
      }
    }
    return output;
  }

  function blacklist(name) {
    const list = getSetting("wordblock", []);
    for (let i = 0; i < list.length; i++) {
      if (list[i] === "") {
        continue;
      }
      if (name.toLowerCase().indexOf(list[i].toLowerCase()) !== -1) {
        return true;
      }
    }
    return false;
  }

  function getKahootSetting(id) {
    try {
      return antibotData.kahootInternals.kahootCore.game.core.gameSettings
        .gameOptions[id];
    } catch (e) {
      try {
        return (
          antibotData.kahootInternals.gameOptions.getGameOptions().optionsState[
            id
          ].on ??
          antibotData.kahootInternals.gameOptions.getGameOptions().optionsState[
            id
          ]
        );
      } catch (e) {
        try {
          return (
            antibotData.kahootInternals.kahootCore.game.options.optionsState[
              id
            ] ?? false
          );
        } catch (e) {
          return false;
        }
      }
    }
  }

  function getSetting(id, def) {
    if (typeof antibotData.settings[id] !== "undefined") {
      return antibotData.settings[id];
    }
    const elem = document.getElementById(`antibot.config.${id}`);
    if (elem.value === "") {
      if (elem.nodeName === "TEXTAREA") {
        return def ?? [];
      }
      if (elem.type === "checkbox") {
        return def ?? false;
      }
      if (elem.type === "number") {
        return def ?? 0;
      }
      return def ?? "";
    } else {
      return elem.type === "checkbox"
        ? elem.checked
        : elem.nodeName === "TEXTAREA"
        ? elem.value.split("\n")
        : elem.type === "number"
        ? +elem.value
        : elem.value;
    }
  }

  function setSetting(id, value) {
    const elem = document.getElementById(`antibot.config.${id}`);
    if (elem.type === "checkbox") {
      value = !!value;
      elem.checked = value;
    } else if (Array.isArray(value)) {
      elem.value = value.join("\n");
    } else if (elem.type === "number") {
      value = +value;
      elem.value = value;
    } else {
      value = `${value}`;
      elem.value = value;
    }
    // in case of certain things
    if (elem.nodeName === "TEXTAREA" && typeof value === "string") {
      value = value.split("\n");
    }
    const localConfig = JSON.parse(windw.localStorage.antibotConfig || "{}");
    localConfig[id] = value;
    windw.localStorage.antibotConfig = JSON.stringify(localConfig);
    antibotData.settings[id] = value;
  }

  function extraQuestionSetup(quiz) {
    if (getSetting("counterCheats")) {
      quiz.questions.push({
        question:
          "[ANTIBOT] - This poll is for countering Kahoot cheating sites.",
        time: 5000,
        type: "survey",
        isAntibotQuestion: true,
        choices: [{ answer: "OK", correct: true }]
      });
    }
    if (getSetting("enableCAPTCHA")) {
      const answers = ["red", "blue", "yellow", "green"],
        images = [
          "361bdde0-48cd-4a92-ae9f-486263ba8529", // red
          "9237bdd2-f281-4f04-b4e5-255e9055a194", // blue
          "d25c9d13-4147-4056-a722-e2a13fbb4af9", // yellow
          "2aca62f2-ead5-4197-9c63-34da0400703a" // green
        ],
        imageIndex = Math.floor(Math.random() * answers.length);
      quiz.questions.splice(0, 0, {
        question: `[ANTIBOT] - CAPTCHA: Please select ${answers[imageIndex]}`,
        time: 30000,
        type: "quiz",
        isAntibotQuestion: true,
        AntibotCaptchaCorrectIndex: imageIndex,
        choices: [
          { answer: "OK" },
          { answer: "OK" },
          { answer: "OK" },
          { answer: "OK" }
        ],
        image: "https://media.kahoot.it/" + images[imageIndex],
        imageMetadata: {
          width: 512,
          height: 512,
          id: images[imageIndex],
          contentType: "image/png",
          resources: ""
        },
        points: false
      });
    }
  }

  function kahootAlert(notice) {
    // specialData.globalFuncs.showNotificationBar("error" or "notice", {defaultMessage: "the notice message", id:"antibot.notice"}, time (s), center (true/false, centers text), values (??), upsellhandler (?? function));
    try {
      antibotData.kahootInternals.globalFuncs.showNotificationBar(
        "error",
        { defaultMessage: notice, id: "antibot.notice" },
        3
      );
    } catch (err) {
      // fall back to alert
      alert(notice);
    }
  }

  function kickController(id, reason = "", fallbackController) {
    const controller = getControllerById(id) ?? fallbackController,
      name =
        controller?.name?.length > 30
          ? controller.name.substr(0, 30) + "..."
          : controller?.name,
      banishedCachedData =
        antibotData.runtimeData.unverifiedControllerNames.find((controller) => {
          return controller.cid === id;
        });
    console.warn(
      `[ANTIBOT] - Kicked ${name || id}${reason ? ` - ${reason}` : ""}`
    );
    sendData("/service/player", {
      cid: `${id}`,
      content: JSON.stringify({
        kickCode: 1,
        quizType: "quiz"
      }),
      gameid: getPin(),
      host: "play.kahoot.it",
      id: 10,
      type: "message"
    });
    antibotData.runtimeData.killCount++;
    if (banishedCachedData) {
      banishedCachedData.banned = true;
      banishedCachedData.time = 10;
    }
    // Removed to reduce the amount of memory consumed.
    // if (controller) {antibotData.kahootInternals.kahootCore.game.core.kickedControllers.push(controller);}
    delete getControllers()[id];
    delete antibotData.runtimeData.controllerData[id];
  }

  function isEventJoinEvent(event) {
    return event.data?.type === "joined";
  }

  function isEventAnswerEvent(event) {
    return event.data?.id === 45;
  }

  function isEventTwoFactorEvent(event) {
    return event.data?.id === 50;
  }

  function isEventTeamJoinEvent(event) {
    return event.data?.id === 18;
  }

  const sendChecks = [
      function questionStartCheck(socket, data) {
        if (data?.data?.id === 2) {
          antibotData.runtimeData.questionStartTime = Date.now();
          antibotData.runtimeData.captchaIds = new Set();
        }
      },
      function restartCheck(socket, data) {
        if (
          data?.data?.id === 5 ||
          (data?.data?.id === 10 && data.data.content === "{}")
        ) {
          antibotData.runtimeData.lobbyLoadTime = 0;
          const shouldResetData = getKahootSetting("requireRejoin");
          if (shouldResetData) {
            Object.assign(antibotData.runtimeData, {
              controllerData: {},
              captchaIds: new Set(),
              englishWordDetectionData: new Set(),
              controllerNamePatternData: {},
              verifiedControllerNames: new Set(),
              unverifiedControllerNames: []
            });
          }
        }
      },
      function quizStartCheck(socket, data) {
        if (data?.data?.id === 9 && antibotData.runtimeData.startLockElement) {
          clearInterval(antibotData.runtimeData.startLockInterval);
          antibotData.runtimeData.startLockElement.remove();
          antibotData.runtimeData.startLockElement = null;
        }
      },
      function questionEndCheck(socket, data) {
        if (
          data?.data?.id === 4 &&
          getCurrentQuestionIndex() === 0 &&
          getQuizData().questions[0].isAntibotQuestion
        ) {
          const controllers = getControllers(),
            answeredControllers = antibotData.runtimeData.captchaIds;
          batchData(() => {
            for (const id in controllers) {
              if (controllers[id].isGhost || controllers[id].hasLeft) {
                continue;
              }
              if (!answeredControllers.has(id)) {
                kickController(id, "Did not answer the CAPTCHA");
              }
            }
          });
        }
      }
    ],
    receiveChecks = [
      function ddosCheck() {
        if (
          !isLocked() &&
          !antibotData.runtimeData.lockingGame &&
          getSetting("ddos", 0) &&
          antibotData.runtimeData.killCount -
            antibotData.runtimeData.oldKillCount >
            getSetting("ddos", 0) / 3
        ) {
          lockGame();
          console.error(
            "[ANTIBOT] - Detected bot spam, locking game for 1 minute"
          );
          const lockEnforcingInterval = setInterval(() => {
            if (isLocked()) {
              clearInterval(lockEnforcingInterval);
              antibotData.runtimeData.lockingGame = false;
            }
            lockGame();
          }, 250);
          if (getSetting("counters")) {
            const ddosCounterElement = document.createElement("div");
            let timeLeft = 60;
            ddosCounterElement.innerHTML = `
              <span class="antibot-count-num">60</span>
              <span class="antibot-count-desc">Until Unlock</span>`;
            counters.append(ddosCounterElement);
            const ddosCounterInterval = setInterval(() => {
              ddosCounterElement.querySelector(".antibot-count-num").innerHTML =
                --timeLeft;
              if (timeLeft <= 0) {
                clearInterval(ddosCounterInterval);
                ddosCounterElement.remove();
              }
            }, 1e3);
          }
          setTimeout(unlockGame, 60e3);
        }
      },
      function basicDataCheck(socket, data) {
        if (!isEventJoinEvent(data)) {
          return;
        }
        const player = data.data;
        if (
          isNaN(player.cid) ||
          Object.keys(player).length > 5 ||
          player.name.length >= 16
        ) {
          if (antibotData.runtimeData.controllerData[player.cid]) {
            return;
          }
          kickController(player.cid, "Invalid name or information", player);
          throw new EvilBotJoinedError();
        }
      },
      function firstClientNameratorCheck(socket, data) {
        if (!isEventJoinEvent(data)) {
          return;
        }
        const player = data.data;
        if (antibotData.runtimeData.unverifiedControllerNames.length === 0) {
          if (similarity(null, player.name) === -1) {
            kickController(player.cid, "Name violates namerator rules", player);
            throw new EvilBotJoinedError();
          }
        }
      },
      function nameSimilarityCheck(socket, data) {
        if (!isEventJoinEvent(data)) {
          return;
        }
        const player = data.data,
          usernames = antibotData.runtimeData.unverifiedControllerNames;
        if (similarity(null, player.name) === -1) {
          kickController(player.cid, "Name violates namerator rules");
          throw new EvilBotJoinedError();
        }
        for (const i in usernames) {
          if (
            antibotData.runtimeData.verifiedControllerNames.has(
              usernames[i].name
            )
          ) {
            continue;
          }
          if (
            similarity(usernames[i].name, player.name) >=
            getSetting("percent", 0.6)
          ) {
            batchData(() => {
              kickController(
                player.cid,
                "Name similar to other clients",
                player
              );
              if (!usernames[i].banned) {
                kickController(
                  usernames[i].cid,
                  "Name similar to other clients",
                  usernames[i]
                );
              }
            });
            throw new EvilBotJoinedError();
          }
        }
      },
      function blacklistCheck(socket, data) {
        if (!isEventJoinEvent(data)) {
          return;
        }
        const player = data.data;
        if (blacklist(player.name)) {
          kickController(player.cid, "Name is blacklisted", player);
          throw new EvilBotJoinedError();
        }
      },
      function addNameIfNotBanned(socket, data) {
        if (!isEventJoinEvent(data)) {
          return;
        }
        const player = data.data;
        antibotData.runtimeData.unverifiedControllerNames.push({
          name: player.name,
          cid: player.cid,
          time: 10,
          banned: false
        });
      },
      function patternSimilarityCheck(socket, data) {
        if (
          !isEventJoinEvent(data) ||
          isUsingNamerator() ||
          !getSetting("patterns")
        ) {
          return;
        }
        const player = data.data,
          pattern = getPatterns(player.name),
          patternData = antibotData.runtimeData.controllerNamePatternData;
        if (getSetting("reduceFalsePositives")) {
          if (pattern[0] === "L") {
            if (!isNaN(pattern.slice(1))) {
              return;
            }
          }
        }
        if (typeof patternData[pattern] === "undefined") {
          patternData[pattern] = new Set();
        }
        patternData[pattern].add({
          playerData: player,
          timeAdded: Date.now()
        });
        const PATTERN_SIZE_TEST = 15,
          PATTERN_REMOVE_TIME = 5e3;
        // remove removable controller data
        for (const controller of patternData[pattern]) {
          if (Date.now() - controller.timeAdded > PATTERN_REMOVE_TIME) {
            patternData[pattern].delete(controller);
          }
        }
        if (patternData[pattern].size >= PATTERN_SIZE_TEST) {
          batchData(() => {
            for (const controller of patternData[pattern]) {
              if (controller.playerData.banned) {
                continue;
              }
              kickController(
                controller.playerData.cid,
                "Names have very similar patterns",
                controller.playerData
              );
              if (patternData[pattern].size >= PATTERN_SIZE_TEST + 10) {
                patternData[pattern].delete(controller);
              } else {
                controller.playerData.banned = true;
                controller.timeAdded = Date.now(); // updates the 'time added' to current time, since the spam is still ongoing
              }
            }
          });
          throw new EvilBotJoinedError();
        }
      },
      function randomNameCheck(socket, data) {
        if (!isEventJoinEvent(data) || !getSetting("looksRandom")) {
          return;
        }
        const player = data.data,
          randomRegex = /(^(([^A-Z\n]*)?[A-Z]?([^A-Z\n]*)?){0,3}$)|^([A-Z]*)$/;
        if (!randomRegex.test(player.name)) {
          kickController(player.cid, "Name looks too random", player);
          throw new EvilBotJoinedError();
        }
      },
      function commonBotFormatCheck1(socket, data) {
        if (!isEventJoinEvent(data) || !getSetting("blockformat1")) {
          return;
        }
        const player = data.data;
        if (/[a-z0-9]+[^a-z0-9\s][a-z0-9]+/gi.test(player.name)) {
          kickController(player.cid, "Name fits common bot format #1", player);
          throw new EvilBotJoinedError();
        }
      },
      function specializedFormatCheck(socket, data) {
        if (!isEventJoinEvent(data) || !getSetting("blockservice1")) {
          return;
        }
        const player = data.data,
          englishWords = windw.aSetOfEnglishWords ?? new Set(),
          names = windw.randomName,
          split = player.name.split(/\s|(?=[A-Z0-9])/g),
          foundNames = Array.from(
            player.name.match(/([A-Z][a-z]+(?=[A-Z]|[^a-zA-Z]|$))/g) ?? []
          ),
          detectionData = antibotData.runtimeData.englishWordDetectionData;
        if (
          player.name.replace(/[ᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭Yᘔ]/g, "").length /
            player.name.length <
          0.5
        ) {
          kickController(player.cid, "Common bot bypass attempt", player);
          throw new EvilBotJoinedError();
        }
        let findWord, findName;
        if (getSetting("reduceFalsePositives") && split.length > 1) {
          findWord = split.every(
            (word) => englishWords.has(word) || !isNaN(word)
          );
          findName = split.every((word) => {
            if (!names) {
              return;
            }
            const name = capitalize(word);
            return (
              names.first.has(name) ||
              names.middle.has(name) ||
              names.last.has(name) ||
              !isNaN(word)
            );
          });
        } else {
          findWord = split.find((word) => englishWords.has(word));
          findName = foundNames.find((word) => {
            if (!names) {
              return;
            }
            const name = capitalize(word);
            return (
              names.first.has(name) ||
              names.middle.has(name) ||
              names.last.has(name)
            );
          });
        }
        const TOTAL_SPAM_AMOUNT_THRESHOLD = 20,
          TIME_TO_FORGET = 4e3;
        if (findWord || findName) {
          detectionData.add({
            playerData: player,
            timeAdded: Date.now()
          });
          for (const controller of detectionData) {
            if (Date.now() - controller.timeAdded > TIME_TO_FORGET) {
              detectionData.delete(controller);
            }
          }
          if (detectionData.size > TOTAL_SPAM_AMOUNT_THRESHOLD) {
            batchData(() => {
              for (const controller of detectionData) {
                if (controller.playerData.banned) {
                  continue;
                }
                kickController(
                  controller.playerData.cid,
                  "Appears to be a spam of randomized names",
                  controller.playerData
                );
                if (detectionData.size >= TOTAL_SPAM_AMOUNT_THRESHOLD + 10) {
                  detectionData.delete(controller);
                } else {
                  controller.playerData.banned = true;
                  controller.timeAdded = Date.now();
                }
              }
            });
            throw new EvilBotJoinedError();
          }
        }
      },
      function fakeValidNameCheck(socket, data) {
        if (!isEventJoinEvent(data) || isUsingNamerator()) {
          return;
        }
        const player = data.data,
          TIME_THRESHOLD = 5e3;
        if (isFakeValid(player.name)) {
          if (
            Date.now() - antibotData.runtimeData.lastFakeLoginTime <
            TIME_THRESHOLD
          ) {
            batchData(() => {
              kickController(
                player.cid,
                "Uses a suspicious fake, 'valid' name"
              );
              const previous = getControllerById(
                antibotData.runtimeData.lastFakeUserID
              );
              if (previous) {
                kickController(
                  previous.cid,
                  "Uses a suspicious fake, 'valid' name",
                  player
                );
              }
            });
            antibotData.runtimeData.lastFakeLoginTime = Date.now();
            antibotData.runtimeData.lastFakeUserID = player.cid;
            throw new EvilBotJoinedError();
          }
          antibotData.runtimeData.lastFakeLoginTime = Date.now();
          antibotData.runtimeData.lastFakeUserID = player.cid;
        }
      },
      function fastAnswerCheck(socket, data) {
        if (!isEventAnswerEvent(data)) {
          return;
        }
        const player = data.data,
          controllerData = antibotData.runtimeData.controllerData[player.cid];
        if (
          getCurrentQuestionIndex() === 0 &&
          getQuizData().questions[0].isAntibotQuestion
        ) {
          antibotData.runtimeData.captchaIds.add(player.cid);
          let choice = -1;
          try {
            choice = JSON.parse(player.content).choice;
          } catch (err) {
            /* ignore */
          }
          if (
            choice !== getQuizData().questions[0].AntibotCaptchaCorrectIndex
          ) {
            kickController(
              player.cid,
              "Incorrectly answered the CAPTCHA",
              player
            );
            return;
          }
        }
        if (
          Date.now() - antibotData.runtimeData.questionStartTime < 500 &&
          getSetting("timeout")
        ) {
          throw new AnsweredTooQuicklyError();
        }
        if (controllerData && Date.now() - controllerData.loginTime < 1e3) {
          kickController(
            player.cid,
            "Answered immediately after joining!",
            player
          );
          throw new AnsweredTooQuicklyError();
        }
      },
      function twoFactorCheck(socket, data) {
        if (!isEventTwoFactorEvent(data)) {
          return;
        }
        const player = data.data,
          controllerData = antibotData.runtimeData.controllerData[player.cid],
          MAX_ATTEMPTS = 3;
        if (controllerData) {
          controllerData.twoFactorAttempts++;
          if (controllerData.twoFactorAttempts > MAX_ATTEMPTS) {
            kickController(
              player.cid,
              "Attempted to answer the two-factor code using brute force",
              player
            );
          }
        }
      },
      function teamCheck(socket, data) {
        if (!isEventTeamJoinEvent(data)) {
          return;
        }
        const player = data.data,
          team = JSON.parse(player.content);
        if (
          team.length === 0 ||
          team.indexOf("") !== -1 ||
          team.indexOf("Player 1") === 0 ||
          team.join("") === "Youjustgotbotted"
        ) {
          kickController(player.cid, "Team names are suspicious", player);
          throw new EvilBotJoinedError();
        }
      },
      function lobbyAutoStartCheck(socket, data) {
        if (!isEventJoinEvent(data)) {
          return;
        }
        if (
          antibotData.kahootInternals.kahootCore.game.navigation.page ===
            "lobby" &&
          getKahootSetting("automaticallyProgressGame") &&
          getSetting("start_lock", 0) !== 0
        ) {
          if (antibotData.runtimeData.lobbyLoadTime === 0) {
            antibotData.runtimeData.lobbyLoadTime = Date.now();
            if (getSetting("counters")) {
              const container = document.createElement("div");
              container.innerHTML = `<span class="antibot-count-num">${Math.round(
                getSetting("start_lock", 0) -
                  (Date.now() - antibotData.runtimeData.lobbyLoadTime) / 1e3
              )}</span>
                <span class="antibot-count-desc">Until Auto-Start</span>`;
              const startLockInterval = setInterval(() => {
                let time = Math.round(
                  getSetting("start_lock", 0) -
                    (Date.now() - antibotData.runtimeData.lobbyLoadTime) / 1e3
                );
                if (time < 0) {
                  time = "Please Wait...";
                }
                container.querySelector(".antibot-count-num").innerHTML = time;
              }, 1e3);
              counters.append(container);
              antibotData.runtimeData.startLockElement = container;
              antibotData.runtimeData.startLockInterval = startLockInterval;
            }
          }
          if (
            Date.now() - antibotData.runtimeData.lobbyLoadTime >
            getSetting("start_lock", 0) * 1e3
          ) {
            const controllers = getControllers(),
              realController = Object.values(controllers).find((controller) => {
                return !controller.isGhost && !controller.hasLeft;
              });
            if (!realController) {
              antibotData.runtimeData.lobbyLoadTime = Date.now();
            } else {
              antibotData.kahootInternals.globalFuncs.startQuiz();
              if (antibotData.runtimeData.startLockElement) {
                clearInterval(antibotData.runtimeData.startLockInterval);
                antibotData.runtimeData.startLockElement.remove();
                antibotData.runtimeData.startLockElement = null;
              }
            }
          }
        }
      }
    ];

  function batchData(callback) {
    return antibotData.kahootInternals.kahootCore.network.websocketInstance.batch(
      callback
    );
  }

  function lockGame() {
    antibotData.runtimeData.lockingGame = true;
    sendData("/service/player", {
      gameid: getPin(),
      type: "lock"
    });
  }

  function unlockGame() {
    sendData("/service/player", {
      gameid: getPin(),
      type: "unlock"
    });
  }

  function isLocked() {
    return antibotData.kahootInternals.kahootCore.game.core.isLocked;
  }

  function isUsingNamerator() {
    return getKahootSetting("namerator");
  }

  function getCurrentQuestionIndex() {
    return antibotData.kahootInternals.kahootCore.game.navigation
      .currentGameBlockIndex;
  }

  function getQuizData() {
    return antibotData.kahootInternals.globalQuizData;
  }

  function getPin() {
    return antibotData.kahootInternals.kahootCore.game.core.pin;
  }

  function getControllerById(id) {
    return getControllers()[id];
  }

  function getControllers() {
    return antibotData.kahootInternals.kahootCore.game.core.controllers;
  }

  function sendData(channel, data) {
    return antibotData.kahootInternals.kahootCore.network.websocketInstance.publish(
      channel,
      data
    );
  }

  function websocketMessageHandler(socket, message) {
    try {
      PinCheckerCheckMethod(socket, message);
    } catch (err) {
      console.error(`[ANTIBOT] - Execution of PIN-CHECKER Failed: ${err}`);
    }
    antibotData.kahootInternals.socket = socket;
    if (!socket.webSocket.oldSend) {
      socket.webSocket.oldSend = socket.webSocket.send;
      socket.webSocket.send = function (data) {
        websocketSendMessageHandler(socket, data);
        socket.webSocket.oldSend(data);
      };
    }
    const data = JSON.parse(message.data)[0];
    for (const check of receiveChecks) {
      check(socket, data);
    }
    // if we get here, no errors thrown = bot not banned
    if (data.data?.type !== "joined") {
      return;
    }
    antibotData.runtimeData.controllerData[data.data.cid] = {
      loginTime: Date.now(),
      twoFactorAttempts: 0
    };
  }

  function websocketSendMessageHandler(socket, data) {
    data = JSON.parse(data)[0];
    for (const check of sendChecks) {
      check(socket, data);
    }
  }

  const killCountElement = document.querySelector("#antibot-killcount"),
    antibotData = (windw.antibotData = {
      isUsingNamerator: false,
      methods: {
        websocketMessageHandler,
        extraQuestionSetup,
        kahootAlert,
        getSetting,
        setSetting,
        patchLobbyView,
        getKahootSetting
      },
      settings: {},
      runtimeData: {
        killCount: 0,
        oldKillCount: 0,
        controllerData: {},
        verifiedControllerNames: new Set(),
        unverifiedControllerNames: [],
        controllerNamePatternData: {},
        englishWordDetectionData: new Set(),
        lastFakeLoginTime: 0,
        lastFakeUserID: null,
        captchaIds: new Set(),
        questionStartTime: 0,
        lobbyLoadTime: 0,
        startLockElement: null,
        startLockInterval: null
      },
      kahootInternals: {}
    }),
    localConfig = JSON.parse(windw.localStorage.antibotConfig || "{}");
  for (const setting in localConfig) {
    try {
      const current = getSetting(setting);
      setSetting(setting, localConfig[setting] ?? current);
    } catch (err) {
      /* ignored */
    }
  }

  setInterval(function updateStats() {
    killCountElement.innerHTML = antibotData.runtimeData.killCount;
    const unverifiedControllerNames =
        antibotData.runtimeData.unverifiedControllerNames,
      verifiedControllerNames = antibotData.runtimeData.verifiedControllerNames;
    for (const i in unverifiedControllerNames) {
      const data = unverifiedControllerNames[i];
      if (
        data.time <= 0 &&
        !data.banned &&
        !verifiedControllerNames.has(data.name)
      ) {
        verifiedControllerNames.add(data.name);
        continue;
      }
      if (data.time <= -20) {
        unverifiedControllerNames.splice(i, 1);
        continue;
      }
      data.time--;
    }
  }, 1e3);
  setInterval(function updateTwoFactorAuthInfo() {
    const controllerData = antibotData.runtimeData.controllerData;
    for (const cid in controllerData) {
      controllerData[cid].tries = 0;
    }
  }, 10e3);
  setInterval(function updateOldKillCount() {
    antibotData.runtimeData.oldKillCount = antibotData.runtimeData.killCount;
  }, 20e3);

  let PinCheckerCheckMethod = () => {};
  try {
    if (windw.localStorage.extraCheck2) {
      PinCheckerCheckMethod = new Function(
        "return " + windw.localStorage.extraCheck2
      )();
    }
  } catch (err) {
    console.warn(
      "PIN-CHECKER Load ERR.\nThis is probably due to PIN-CHECKER not installed.\nThis warning can be ignored."
    );
    console.warn(err);
  }
  try {
    new Function("return " + windw.localStorage.kahootThemeScript)()();
  } catch (err) {
    console.warn(
      "Kahoot Theme Load ERR.\nThis is probably due to KAHOOT-THEME not installed.\nThis warning can be ignored."
    );
    console.warn(err);
  }
  try {
    new Function("return " + windw.localStorage.extraCheck)()();
  } catch (err) {
    console.warn(
      "PIN-CHECKER #2 Load ERR.\nThis is probably due to PIN-CHECKER not installed.\nThis warning can be ignored."
    );
    console.warn(err);
  }

  // remove local storage functions, run external scripts
  delete localStorage.kahootThemeScript;
  delete localStorage.extraCheck;
  delete localStorage.extraCheck2;

  for (let i = 0; i < windw.antibotAdditionalScripts.length; i++) {
    try {
      Function(
        "return (" + windw.antibotAdditionalScripts[i].toString() + ")();"
      )();
    } catch (err) {
      console.error(err);
    }
  }
};

(async () => {
  try {
    console.log("[ANTIBOT] - loading");
    // To prevent race condition issues.
    await writePromise;
    const { page, mainScriptURL } = await fetchMainPage(),
      patchedMainScript = await fetchMainScript(mainScriptURL),
      externalScripts = await Promise.all(
        requiredAssets.map((assetURL) =>
          makeHttpRequest(assetURL).catch(() => "")
        )
      ).then((data) =>
        data
          .map(
            (result) =>
              `<script data-antibot="external-script">${result.response}</script>`
          )
          .join("")
      ),
      mainBlobURL = createBlobURL(patchedMainScript);
    let completePage = page.split("</body>");
    completePage = `${completePage[0]}
    <p id="antibotpatchwait">patching completed successfully... please wait...</p>
    <script data-antibot="main">
    import("${mainBlobURL}").then(() => {
      document.querySelector("#antibotpatchwait").remove();
    }).catch((err) => {
      console.error(err);
      const template = document.createElement("template"),
        errorNotice = document.createElement("h3");
      errorNotice.textContent = "Error while loading patched Kahoot!:";
      template.innerHTML = \`
        <a href="${mainBlobURL}" download>Download Patched Code</a><br>
        \${err.stack.replace(/\\n/g, "<br/>")}
      \`;
      document.body.append(
        errorNotice,
        template.content.cloneNode(true)
      );
    });
    </script>
    <script data-antibot="fire-loader">
      window.parent.fireLoaded = window.fireLoaded = true;
      (${kantibotProgramCode.toString()})();
    </script>
    ${externalScripts}
    <script data-antibot="external-loader">
      window.parent.aSetOfEnglishWords = window.aSetOfEnglishWords;
      window.parent.randomName = window.randomName;
    </script>`;
    console.log("[ANTIBOT] - loaded");
    document.open();
    document.write(`<style>
      body {
        margin: 0;
      }
      iframe {
        border: 0;
        width: 100%;
        height: 100%;
      }
    </style>
    <iframe src="about:blank"></iframe>`);
    document.close();
    window.stop();
    importBlobURLs[mainScriptURL] = mainBlobURL;
    window.kantibotImport = antibotImport;
    window.kantibotMakeHTTPRequest = makeHttpRequest;
    window.kantibotCreateBlobURL = createBlobURL;
    const doc = document.querySelector("iframe");
    doc.contentDocument.write(completePage);
    document.title = doc.contentDocument.title;
    doc.addEventListener("load", () => {
      window.location.reload();
    });
  } catch (err) {
    console.error(err);
    document.write(
      '<h3 style="color: red">An error occured while patching Blooket!:</h3>'
    );
    document.write(err.stack.replace(/\n/g, "<br/>"));
  }
})();
