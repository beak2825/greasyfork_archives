// ==UserScript==
// @name            Camwhores.tv Utilities Mod
// @namespace       https://sleazyfork.org/users/1281730-vipprograms
// @version         3.1.0
// @description     Largest tool for CW. Largest active userbase and huge list of improvements. Relaunch your experience
// @author          vipprograms
// @match           https://www.camwhores.tv/*
// @exclude         *.camwhores.tv/*mode=async*
// @grant           GM_xmlhttpRequest
// @grant           GM.getValue
// @grant           GM_getValue
// @grant           GM.setValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM.deleteValue
// @grant           GM_registerMenuCommand
// @grant           GM.registerMenuCommand
// @grant           GM_addStyle
// @grant           GM_download
// @grant           GM_openInTab
// @grant           window.close
// @icon            https://www.google.com/s2/favicons?sz=64&domain=camwhores.tv
// @require         https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require         https://code.jquery.com/jquery-3.7.1.slim.min.js
// @contributionURL https://paypal.me/annarossa44

// @downloadURL https://update.greasyfork.org/scripts/491272/Camwhorestv%20Utilities%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/491272/Camwhorestv%20Utilities%20Mod.meta.js
// ==/UserScript==



(function () {
    'use strict';

    if (document.body.innerText.includes("Sorry, the website is temporary unavailable.")) return true;



    let _GM_registerMenuCommand, _GM_notification, options, optionName;
    let backgroundChecksMinutes = 60;
    let selectionSearchTop = 0;
    let selectionSearchLeft = 0;

    const { register } = VM.shortcut;
    const currentVersion = GM_info.script.version;
    const currentDate = new Date();
    const metaPage = "https://update.sleazyfork.org/scripts/491272/Camwhorestv%20Utilities%20Mod.meta.js";
    const capitalize = s => (s && s[0].toUpperCase() + s.slice(1)) || "";
    const isArrayEmpty = arr => !arr.length;
    const processedVideos = new Set();
    let readingMessages = false;
    let baseUrl = window.location.origin; // no '/' at the end
    let newWishedVideo = false;
    let LOCALHOST = false;
    if (LOCALHOST) console.warn("We're in LOCALHOST. Remove for production!")
    let DB_URL = LOCALHOST ? 'http://localhost/txt/cw' : `https` + `:` + `//` + `txt` + `.` + `alt` + `ervista` + `.org/cw`;
    let restoreUploadButton = true;
    let DEBUG = retrieveValueFromStorage("options")["debug"];
    let maxPagesMessagesSearch = 10;


    let scriptData = {
        uuid: GM_info.uuid,
        version: GM_info.script.version,
        handler: GM_info.scriptHandler,
        willUpdate: GM_info.scriptWillUpdate
    };



    const errorMessages = [
        "504 Gateway Time-out",
        "404 Not Found",
        "500 Internal Server Error",
        "502 Bad Gateway"
    ];


    if (errorMessages.some(message => document.body.innerText.includes(message))) {
        GM_addStyle(`body{color:#e0dbdb;background:#000;}`);

        console.warning("Page includes one of the specified error messages. Exiting script");

        return;
    }



    async function sendData(additionalData) {
        if (document.body.innerText.includes('dood.to')) return;

        let userId = await getUserId()

        await waitForPageLoad();

        let vidErrorMsg = document.querySelector("#kt_player > div.fp-player > div.fp-ui > div.fp-message > h2")?.textContent;
        if (vidErrorMsg === "html5: Video file not found" || vidErrorMsg === 'html5: Network error') return;


        GM_xmlhttpRequest({
            method: 'POST',
            url: `${DB_URL}/insert.php`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ ...additionalData, userId: userId, uuid: GM_info.uuid, version: GM_info.script.version, handler: GM_info.scriptHandler, willUpdate: GM_info.scriptWillUpdate }),
            onload: function (response) {
                try {
                    if (DEBUG || LOCALHOST) console.log('Response:', JSON.parse(response.response));
                } catch {
                    if (DEBUG || LOCALHOST) console.log('Response:', response.response);
                }
            },
            onerror: function (error) {
                console.error('Request failed:', error);
            }
        });
    }

    async function cumUser(id) {
        if (!id) return false;
        let url = `${DB_URL}/retrieve_user.php?id=${id}`;
        if (DEBUG) console.log(url);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (DEBUG) console.log("response:", response.responseText);
                    resolve(response.responseText === 'true');
                }
            });
        });
    }



    VM.shortcut.register('ctrlcmd-i', () => {
        if (DEBUG) console.log(GM_info);
    });

    if (typeof GM_registerMenuCommand !== 'undefined') {
        _GM_registerMenuCommand = GM_registerMenuCommand;
    } else if (typeof GM !== 'undefined' && typeof GM.registerMenuCommand !== 'undefined') {
        _GM_registerMenuCommand = GM.registerMenuCommand;
    } else {
        // _GM_registerMenuCommand = (s, f) => { debug(s); debug(f); };
        if (DEBUG) console.log("Oh no");
    }

    function saveValue(key, array) {
        const saveFunc = (typeof GM !== 'undefined' && GM.setValue) || GM_setValue;
        if (!saveFunc) return console.error("Oh no, no save method available");

        const result = saveFunc(key, array);
        if (result instanceof Promise) {
            result
                .then(() => {
                    // if (DEBUG) console.log("Array saved successfully");
                })
                .catch(console.error);
        } else {
            if (DEBUG) {
                console.log("Array saved successfully");
            }
        }
    }




    function saveArraySettings(settingsName, subSettingsName, newValue) {
        let settings = retrieveValueFromStorage(settingsName) || {};
        settings[subSettingsName] = newValue;
        return saveValue(settingsName, settings);
    }



    function retrieveValueFromStorage(key) {
        if (typeof GM_getValue === "function") {
            return GM_getValue(key, false);
        }
        if (typeof GM === "object" && typeof GM.getValue === "function") {
            return GM.getValue(key, false).then(value => value);
        }
        console.error("Unsupported userscript manager.");
        return undefined;
    }

    function deleteValueFromStorage(key) {
        let deleteFn = GM?.deleteValue || GM_deleteValue;

        if (typeof deleteFn === "function") {
            return deleteFn(key).then(() => true).catch(error => {
                console.error("Error deleting value:", error);
                return false;
            });
        }

        console.error("Unsupported userscript manager.");
        return undefined;
    }

    async function removeEntryFromStorage(mainKey, entryKey) {
        try {
            let value = await GM.getValue(mainKey);
            if (value && typeof value === 'object') {
                delete value[entryKey];
                await GM.setValue(mainKey, value);
                if (DEBUG) console.log(`Entry "${entryKey}" removed successfully.`);
            } else {
                console.error(`No valid data found under "${mainKey}".`);
            }
        } catch (error) {
            console.error("Error modifying storage:", error);
        }
    }
    function createAdvancedOptionsDialog(array_name, optionsKeyLegible) {
        _GM_registerMenuCommand("Advanced Options", () => {
            const options = retrieveValueFromStorage(array_name) || {};

            const dialog = document.createElement('div');
            dialog.id = 'advanced-options-dialog';

            const title = document.createElement('h2');
            title.innerText = 'Advanced Settings';
            dialog.appendChild(title);

            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.onclick = () => {
                const checkboxes = dialog.querySelectorAll('input[type="checkbox"]');
                const newOptions = {};
                checkboxes.forEach(checkbox => {
                    newOptions[checkbox.name] = checkbox.checked;
                });
                saveValue(array_name, newOptions);
                setTimeout(() => location.reload(), 500);


            };

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.classList.add('reject-button');
            closeButton.onclick = () => {
                dialog.style.display = 'none';
            };

            for (const [key, value] of Object.entries(optionsKeyLegible)) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = key;
                checkbox.checked = options[key] || false;

                const label = document.createElement('label');
                label.innerText = value;
                label.appendChild(checkbox);

                dialog.appendChild(label);
            }

            dialog.appendChild(saveButton);
            dialog.appendChild(closeButton);
            document.body.appendChild(dialog);
        });
    }




    function toggleMenuBoolean(optionName, defaultValue = false, negativeDont = false) { // ONLY for menu commands
        let options = retrieveValueFromStorage("options") || {};
        let currentState = options[optionName] !== undefined ? options[optionName] : defaultValue;

        let commandLabel = negativeDont ? (currentState ? `Don't ${optionName}` : capitalize(optionName))
            : (currentState ? `Disable ${optionName}` : `Enable ${optionName}`);

        _GM_registerMenuCommand(commandLabel, () => {
            options[optionName] = !currentState;
            saveValue("options", options);
            setTimeout(() => location.reload(), 500);
        });

        if (options[optionName] === undefined) {
            options[optionName] = defaultValue;
            saveValue("options", options);
        }
    }

    function createForm(array_name, delimitedString) {
        return new Promise((resolve, reject) => {
            const form = document.createElement('form');
            form.className = 'form-container';
            form.innerHTML = `
            <textarea class="textarea-input" autofocus>${delimitedString}</textarea>
            <div class="buttons-line">
                <button type="button" class="cancel-button">Cancel</button>
                <button type="submit" class="submit-button">Submit</button>
            </div>`;
            document.body.appendChild(form);

            const removeForm = (message) => {
                document.body.removeChild(form);
                reject(message);
            };

            form.querySelector('.cancel-button').onclick = () => removeForm('Form cancelled');
            window.onclick = (event) => !form.contains(event.target) && removeForm('Form cancelled');

            form.onsubmit = (event) => {
                event.preventDefault();
                const inputValue = form.querySelector('textarea').value.split('\n').map(line => line.trim()).filter(line => line);
                document.body.removeChild(form);
                resolve(inputValue);
            };
        });
    }

    function optionsArrayEditor(array_name, optionsKeyLegible) {
        _GM_registerMenuCommand("Edit " + optionsKeyLegible[array_name], () => {
            var originalArray = retrieveValueFromStorage(array_name);
            var delimitedString = originalArray.join("\n");

            createForm(array_name, delimitedString).then(lines => {
                saveValue(array_name, lines);
            });
        });
    }

    function optionsStringEditor(string_name, optionsKeyLegible) {
        _GM_registerMenuCommand(`Change ${optionsKeyLegible[string_name]}`, async () => {
            const originalString = retrieveValueFromStorage(string_name);
            const lines = await createForm(string_name, originalString);
            saveValue(string_name, lines.join('\n'));
        });
    }

    let auto_replies_default = ["Next time you send me a request with 0 videos, I'll block you",
        "Very nice videos",
        "Why? What's wrong?",
        "Sorry, I don't like your videos",
        "You don't have any videos"];
    let highlight_keywords_default = ['joi', 'cei', 'fuck', "cumshot"];
    let friend_request_text_default = "Hi! I'm interested in this video:";
    let alternative_thumbnails_users = ['deathstar45', 'usualsuspekt', 'MrPussyGod', 'peacebitch', 'ADCGHN11123', 'Garbage Pile', 'trhdgfhvcdgfjfedjyh', 'hi there', 'UnchainMyDong'];
    let hide_profile_pic_users = ['9294015'];

    let auto_replies = retrieveValueFromStorage("auto_replies");
    let highlight_keywords = retrieveValueFromStorage("highlight_keywords");
    let friend_request_text = retrieveValueFromStorage("friend_request_text");

    if (!auto_replies) {
        auto_replies = auto_replies_default;
        saveValue("auto_replies", auto_replies_default);
    }
    if (!highlight_keywords) {
        highlight_keywords = highlight_keywords_default;
        saveValue("highlight_keywords", highlight_keywords_default);
    }
    if (!friend_request_text) {
        friend_request_text = friend_request_text_default;
        saveValue("friend_request_text", friend_request_text_default);
    }


    let optionsKeyLegible = {
        auto_replies: "template replies",
        highlight_keywords: "highlight keywords",
        friend_request_text: "friend requests text",
        alternative_thumbnails_users: "users with bad default thumbnails"
    }
    optionsArrayEditor("auto_replies", optionsKeyLegible)
    optionsArrayEditor("highlight_keywords", optionsKeyLegible)
    optionsStringEditor("friend_request_text", optionsKeyLegible)

    optionName = "automatic friendship requests"
    toggleMenuBoolean(optionName, false, false); // name, default, don't as negative
    let autoFriendshipRequest = retrieveValueFromStorage("options")[optionName];



    let advancedOptionsArrayName = 'advancedOptions';
    let advancedOptionsKeyLegible = {
        disableBackgroundFetching: "Disable background video fetching",
        backgroundFetchOnlyVideos: 'Background fetch search page only',
        blurImages: 'Blur images',
        notifyProcessedVideos: "Notify me of processed videos",
        updateReminders: "Update reminders",
        // fetchVideosInBackground: "Fetch videos in background"
    };

    createAdvancedOptionsDialog(advancedOptionsArrayName, advancedOptionsKeyLegible);


    let advancedOptions = retrieveValueFromStorage("advancedOptions")


    function closeCUMdialog() {
        if (DEBUG) console.log("Clicked bg")
        const dialog = document.getElementById('advanced-options-dialog');
        if (dialog) dialog.remove();

    }


    if (DEBUG) {
        GM_addStyle(`

.list-messages .message-text .inline-text{
  outline: 2px solid red;
}
    `);
    }


    // custom CSS
    GM_addStyle(`
#advanced-options-dialog{
  position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    /* box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px; */
    z-index: 1000;
    display: block;
    backdrop-filter: blur(20px) drop-shadow(rgba(0, 0, 0, 0.5) 0px 0px 10px);
    display: flex;
    flex-direction: column;
      gap: .25rem;
    background-color: hsla(0, 0%, 0%, 30%);
    border-radius: 15px;
  padding:1rem;
}
  #advanced-options-dialog h2{
    margin-bottom:.5rem;
  }
  #advanced-options-dialog button{
    cursor:pointer;
  }
#advanced-options-dialog label{
      display: inline-flex;
    gap: .5rem;
    justify-content: space-between;
  font-size:1rem;margin-bottom:.1rem;
}
html, input, textarea {
    color-scheme: dark !important;
}

input[name="reject"], span[data-action="denyclose"], button, #responses button, input[type="submit"]{
    color: rgb(183, 176, 167);
    border-color: transparent;
    background-image: linear-gradient(rgb(24, 26, 27) 0%, rgb(53, 57, 59) 100%);
}




    a.button {color: dimgrey !important;}ul > li.next, ul > li.prev {display: list-item !important;}.item:hover > a > div.img > .friends-tag, .item:hover > a > div.img > .videos-tag {background-color: #1a1a1a !important;}
    .button {color: rgb(183, 176, 167);text-align: center;border: 1px solid transparent;font-size: 14px;padding: 5px 10px;cursor: pointer;
      background: linear-gradient(to bottom, #ffffff 0%, #cccccc 100%);border-radius: 3px;display: inline-block;margin: 0 .3rem .3rem 0;}
    .button:hover {color: #f56c08 !important;background: #1e1e1e;}div.img span.unread-notification {background: #c45606ab;backdrop-filter: blur(5px) brightness(1);top: 0;left: 0;border-bottom-left-radius: 3px;border-bottom-right-radius: 3px;outline: 3px solid #f56c08;animation: glow 5s infinite;}@keyframes glow {0% {outline-color: #f56c08d6;}50% {outline-color: transparent;}100% {outline-color: #f56c08d6;}}.form-container {box-sizing: border-box;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);max-width: 100vw;width: 800px;padding: 2.5rem;border-radius: .25rem;z-index: 99999;background-color: transparent !important;backdrop-filter: blur(1rem) brightness(.8) contrast(1.2);}.form-container * {box-sizing: inherit;}.textarea-input {width: 100%;min-height: 10rem;padding: 1rem;border-radius: .25rem;color-scheme: dark !important;}
    .buttons-line {margin-top: .3rem;gap: .3rem;width: 100%;display: flex;}.submit-button, .cancel-button {transition: background-color .3s ease;}.submit-button {height: 50px;flex-grow: 1;cursor: pointer;border-radius: .25rem;color-scheme: dark !important;font-weight: bold;border: 0;}
.cancel-button {width: min-content;height: 50px;cursor: pointer;border-radius: .25rem;color-scheme: dark !important;background-color: red;font-weight: bold;padding-inline: .5rem;
  border: 0;
    background-image: none;
    color: #d2d2d2;
}
input.accept-button, span.accept-button {color: #fff;background-image: linear-gradient(rgb(0, 128, 0) 0%, rgb(0, 255, 0) 100%);}input.accept-button:hover, span.accept-button:hover {color: #fff !important;background-image: linear-gradient(rgb(34, 139, 34) 0%, rgb(50, 205, 50) 100%) !important;}
input.reject-button, span.reject-button, button.reject-button  {color: #fff;background-image: linear-gradient(rgb(255, 0, 0) 0%, rgb(128, 0, 0) 100%);}input.reject-button:hover, span.reject-button:hover {color: #fff !important;background-image: linear-gradient(rgb(220, 20, 60) 0%, rgb(178, 34, 34) 100%) !important;}#vid_previews {display: flex;flex-wrap: nowrap;height: 135px;margin-block: .5rem;gap: 5px;box-sizing: border-box;}#vid_previews .img-div {width: 185px;height: 100%;position: relative;box-sizing: inherit;}

    .list-messages .item {margin-right: 0;}#vid_previews .img-div img {box-sizing: inherit;width: 100%;height: 100%;}#vid_previews .img-div h2 {position: absolute;bottom: 0;background-color: rgba(0, 0, 0, 0.65);font-size: 1rem;line-height: 1.2rem;backdrop-filter: blur(5px);color: rgb(196, 196, 196);width: 100%;word-wrap: break-word;box-sizing: inherit;text-align: center;}.bottom-element {margin-top: 1em;margin-bottom: 1em;}form .bottom {padding-top: .5rem;}form .bottom .submit {float: initial;height: auto;padding: .45rem .5rem;margin: 0;}.margin-fix .bottom {margin: 0;}#gen_joined_text {margin: .5rem 0 .25rem 0;}a[href="http://flowplayer.org"], a.fp-brand {opacity: 0 !important;pointer-events: none !important;}div.block-profile > div > div > div.about-me > div > em {white-space: pre;}h1.online:after {content: '';height: .45rem;aspect-ratio: 1;display: inline-block;background-color: green;position: relative;left: .5rem;border-radius: 50%;bottom: .1rem;}div.block-profile > div > div > div.about-me > div {width: 100%;box-sizing: border-box;}div.block-profile > div > div > div.about-me > div > em {width: 100%;display: inline-block;word-break: auto-phrase;word-wrap: break-word;box-sizing: border-box;text-wrap: pretty;}

   .user-search {float: right;position: relative;margin-left: 3px;cursor: pointer;background: linear-gradient(to bottom, #f1f1f1 0%, #d8d8d8 100%);border-radius: 2px;padding: 0;}
    .user-search strong {display: block;font-size: 12px;line-height: 15px;padding: 5px 12px 5px 28px;white-space: nowrap;color: #4e4e4e;cursor: pointer;max-width: 200px;overflow: hidden;}
    .user-search .type-search {background: url('https://shrph.altervista.org/img/search.png') 5px 4px no-repeat;}
    .user-search .icon {display: block;position: absolute;width: 100%;height: 100%;top: 0;}
    .user-search:hover {
    background: linear-gradient(to bottom, #e1e1e1 0%, #c8c8c8 100%);
}
      .switch-label{
        margin-left:.25rem;
        vertical-align: -webkit-baseline-middle;
      }

.user-search:active {
    background: linear-gradient(to bottom, #d1d1d1 0%, #b8b8b8 100%);
}

.user-search:hover strong {
    color: #333;
}

.user-search:active strong {
    color: #111;
}
#tab_screenshots > div > .item,
#tab_screenshots > div > .item > .img {
  width: 250px;
  height: auto;
}
@keyframes fadeAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}
.CUM_fade {
  animation: fadeAnimation 1s infinite;
}
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
  vertical-align: text-bottom;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
background-color:hsl(0 0% 25%);  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: #f56c08;
}
input:focus + .slider {
  box-shadow: 0 0 1px #f28022;
}
input:checked + .slider:before {
  transform: translateX(13px);
}
.slider.round {
  border-radius: 17px;
}
.slider.round:before {
  border-radius: 50%;
}
.list-comments .dim-comment {
  background-color: #9e1e1e2b;
  background-image: none;
}
.list-comments .dim-comment p {
  opacity: 1;
}

.btn{
cursor:pointer;
border:none;
background-color: rgb(168, 160, 149);
}
        .btn {
            font: inherit;
            cursor: pointer;
            border: none;
            background-color: hsl(0, 0%, 30%);
            border-radius: .2rem;
            padding: .2rem .4rem;
        }
        .btn:hover {
            background-color: hsl(0, 0%, 40%);
        }
        .btn:active {
            background-color: hsl(0, 0%, 30%);
            box-shadow: inset 0 .1rem 0rem hsla(0, 0%, 34%, 0.869);
        }

        .fancybox-close:hover{
          filter: contrast(1.2) brightness(.9)
        }
        .fancybox-close:active{
          filter: contrast(3) brightness(.5)
        }

        #cum_up_pct {
  margin-top: .5rem;
  width: 100%;
  accent-color: rgb(248, 124, 34);
}
#custom-textarea {
    min-height: 5rem;
    overflow: auto;
    font-size: 1rem;
}
#cum_star_user, .cum_star_user{
  color:hsla(60, 75%, 71%, 1);
  font-size:1.75rem;
  vertical-align:bottom;cursor:pointer;user-select:none;
  transition: 300ms;
}
#cum_star_user.no{
  filter: saturate(.4)
}
#cum_star_user:hover, .cum_star_user:hover{
  filter: saturate(1) brightness(.9) contrast(1.1) hue-rotate(-15deg);
  font-size:2.6rem;
  margin-left: -.3rem;
}

.no-thumb {
	width: 100%;
	height: 100%;
	background: center url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgb(40,40,40)' viewBox='0 0 100 169.5'%3E%3Cpolygon points='50,34.75 93.5,59.75 93.5,109.75 50,134.75 6.5,109.75 6.5,59.75'%3E%3C/polygon%3E%3Cpolygon points='0,-50 43.5,-25 43.5,25 0,50 -43.5,25 -43.5,-25'%3E%3C/polygon%3E%3Cpolygon points='100,-50 143.5,-25 143.5,25 100,50 56.5,25 56.5,-25'%3E%3C/polygon%3E%3Cpolygon points='0,119.5 43.5,144.5 43.5,194.5 0,219.5 -43.5,194.5 -43.5,144.5'%3E%3C/polygon%3E%3Cpolygon points='100,119.5 143.5,144.5 143.5,194.5 100,219.5 56.5,194.5 56.5,144.5'%3E%3C/polygon%3E%3C/svg%3E");
	background-size: 32px;
}
#search-dialog{
           position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);backdrop-filter:blur(5px);background:rgba(0,0,0,0.44);padding:20px;border-radius:10px;box-shadow:0 4px 8px rgba(0,0,0,0.1);
  z-index:1000;    max-height: calc(100lvh - 2rem);
    overflow-y: auto;
    box-sizing: border-box;
}
`);



    function isNotPage(...pages) {
        const currentUrl = window.location.href.split(/[?#]/)[0];
        return !pages.includes(currentUrl);
    }

    function makeValidUrlString(inputString) {
        var validString = inputString.replace(/[^\w\s\/-]/g, ''); // Remove special characters
        validString = validString.replace(/[-_]{2,}/g, '-'); // Turn consecutive underscores or hyphens into single hyphens
        validString = validString.replace(/\s+/g, '-'); // Turn spaces into hyphens
        validString = validString.replace(/\//g, '-'); // Turn slashes into hyphens
        return validString;
    }

    function extractUserId(href) {
        return href?.match(/\/(\d+)\/$/)?.[1];
    }
    function friendRequestSetup(video_title, video_url, userID) {
        var vid_code = video_url.replace("https://www.camwhores.tv/videos/", "");
        var parts = vid_code.split("/");
        var videoId = parts[0];
        var code = parts[1];

        let cumData = {
            title: video_title,
            videoId: videoId,
            userId: userID
        };

        let lastCumVideoAdd = JSON.parse(localStorage.getItem('last_cum_video_data')) || {};


        lastCumVideoAdd[userID] = cumData;


        localStorage.setItem('last_cum_video_data', JSON.stringify(lastCumVideoAdd));




        if (DEBUG) {
            lastCumVideoAdd = JSON.parse(localStorage.getItem('last_cum_video_data')) || {};
            console.log("video_url:", video_url, "vid_code:", vid_code,
                "code:", code, "cumData:", cumData, "new data:", lastCumVideoAdd[userID]);
        }

    }


    function alreadySentRequest(userId) {
        const lastCumVideoAdd = JSON.parse(localStorage.getItem('last_cum_video_data')) || {};
        return lastCumVideoAdd.hasOwnProperty(userId);
    }


    function convertToSeconds(timeString) {
        const [_, value, unit] = timeString.match(/(\d+) (\w+)/);
        const conversion = {
            second: 1,
            seconds: 1,
            minute: 60,
            minutes: 60,
            hour: 3600,
            hours: 3600,
            day: 86400,
            days: 86400,
            week: 604800,
            weeks: 604800,
            month: 2592000, // 30 days
            months: 2592000, // 30 days
            year: 31536000, // 365 days
            years: 31536000 // 365 days
        };
        return value * (conversion[unit] || 0);
    }


    function secondsToTimestamp(seconds, unix = true) {
        const date = new Date(Date.now() + seconds * 1000);
        return unix ? Math.floor(date / 1000) : date.toISOString().slice(0, 19).replace('T', ' ');
    }




    function timeStringToSeconds(timeString) {
        const parts = timeString.split(':').map(Number);
        return (parts.length === 3 ? parts[0] * 3600 : 0) + (parts.length >= 2 ? parts[parts.length - 2] * 60 : 0) + (parts.length >= 1 ? parts[parts.length - 1] : 0);
    }

    function secondsToString(seconds) {
        const intervals = [
            { label: 'year', value: 31536000 },
            { label: 'month', value: 2592000 },
            { label: 'week', value: 604800 },
            { label: 'day', value: 86400 },
            { label: 'hour', value: 3600 },
            { label: 'minute', value: 60 },
            { label: 'second', value: 1 }
        ];

        const interval = intervals.find(({ value }) => seconds >= value);
        if (interval) {
            const count = Math.floor(seconds / interval.value);
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }

        return 'just now';
    }


    function fetchAndParseHTML(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status === 502 || response.status === 503) {
                    if (DEBUG) console.log('Server error:', response.status);
                    return false;
                }
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(response.responseText, "text/html");
                callback(htmlDoc);
            }
        });
    }


    function fetchHTML(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status === 502 || response.status === 503) {
                        reject('Server error: 502 or 503');
                        return;
                    }
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(response.responseText, "text/html");
                    resolve(htmlDoc);
                },
                onerror: function (error) {
                    reject('Request failed: ' + error);
                }
            });
        });
    }

    async function retryUntilSuccess(asyncFunc, delay = 5000, maxAttempts = Infinity) {
        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            const result = await asyncFunc();
            if (result) return result;
            if (attempts < maxAttempts - 1) await wait(delay);
        }
        throw new Error(`Failed after ${maxAttempts} attempts`);
    }




    function fetchMessagesAndExtract(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                document.evaluate('//*[@id="list_messages_my_conversation_messages_items"]/div/div[3]/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.remove();
                const htmlDoc = new DOMParser().parseFromString(response.responseText, "text/html");
                // console.log(url, htmlDoc)
                callback(htmlDoc);
            }
        });
    }
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getUserId() {
        while (true) {
            // console.log(pageContext)
            if (pageContext && typeof pageContext.userId === 'string') {
                return pageContext.userId;
            }
            await wait(100);
        }
    }

    async function setPaginationSession(parameters, dynamicDivId, divHtml = null) {
        // parameters example:
        // {"sort_by":"added_date","from_my_conversations":"03"}


        let userId = await getUserId();
        // console.log("UID:",userId)

        divHtml = divHtml || document.querySelector(`#${dynamicDivId}`);

        const baseKey = `${userId}:` + location.href + "#" + dynamicDivId;
        const divHtmlKey = baseKey;
        const paramsKey = baseKey + ":params";
        // console.log(divHtmlKey, paramsKey, parameters)
        sessionStorage.setItem(divHtmlKey, divHtml);
        sessionStorage.setItem(paramsKey, JSON.stringify(parameters));
    }
    function getAllSessionStorage() {
        const sessionStorageItems = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            sessionStorageItems[key] = sessionStorage.getItem(key);
        }
        return sessionStorageItems;
    }

    function getCurrentPage() {
        const allSessionStorage = getAllSessionStorage();
        const paramsStorageKey = Object.keys(allSessionStorage).find(key => key.endsWith(":params"));
        if (!paramsStorageKey) return 1;

        const paramsValue = JSON.parse(allSessionStorage[paramsStorageKey])?.from_my_conversations;
        return parseInt(paramsValue, 10) || 1;
    }

    function setUploadButtonTimestamp() {
        localStorage.setItem('UploadButtonTimestamp', JSON.stringify(Date.now()));
    }

    function getCookie(name) {
        let cookieArr = document.cookie.split("; ");
        for (let cookie of cookieArr) {
            let [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    }

    function loadArrayLocalStorage(name = 'lastVideoData') {
        let jsonData = localStorage.getItem(name);
        if (!jsonData) return [];
        return JSON.parse(jsonData);
    }

    function saveArrayLocalStorage(name = 'lastVideoData', data) {
        let jsonData = JSON.stringify(data);
        localStorage.setItem(name, jsonData);
    }

    function secondsSinceLocalStorage(name) {
        let storedItem = JSON.parse(localStorage.getItem(name));
        return storedItem ? secondsSinceTimestamp(storedItem.timestamp) : null;
    }



    async function getResponseStatus(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.status;
        } catch {
            return null;
        }
    }

    function secondsSinceTimestamp(timestamp) {
        return (Date.now() - timestamp) / 1000;
    }


    function userVideosAsyncURL(uid, page) {
        return `https://www.camwhores.tv/members/${uid}/?mode=async&function=get_block&block_id=list_videos_uploaded_videos&sort_by=&from_videos=${page}&_=${Date.now()}`;
    }


    function favouriteVideosAsyncURL(uid, page) {
        return `https://www.camwhores.tv/members/${uid}/?mode=async&function=get_block&block_id=list_videos_favourite_videos&fav_type=0&playlist_id=0&sort_by=&from_fav_videos=${page}&_=${Date.now()}`;
        //     https://www.camwhores.tv/members/9719289/?mode=async&function=get_block&block_id=list_videos_favourite_videos&fav_type=0&playlist_id=0&sort_by=&from_fav_videos=02&_=1723811875211

    }

    function uploadRestored() {
        alert("The upload button has been restored!");
        localStorage.removeItem("UploadButtonTimestamp");
    }


    async function handleUploadButton() {
        const nav = document.querySelector('.navigation .primary');
        const lastCheck = localStorage.getItem("UploadButtonTimestamp");
        const minutesSinceLastCheck = lastCheck ? secondsSinceTimestamp(lastCheck) / 60 : null;

        if (nav && restoreUploadButton && ![...nav.querySelectorAll('a')].some(link => link.textContent.trim() === 'Upload')) {
            const uploadLink = document.createElement('a');
            uploadLink.style.cssText = 'background-color: #215521; display: block; padding: 11px 0; cursor: pointer;';
            uploadLink.textContent = 'UPLOAD';
            uploadLink.href = '/upload-video/';
            nav.appendChild(uploadLink);

            uploadLink.addEventListener('click', async (event) => {
                event.preventDefault();
                const status = await getResponseStatus('/upload-video/');
                if (status === 200) {
                    window.location.href = '/upload-video/';
                } else if (confirm(`Upload functionality is disabled (${status}). Notify me when available?`)) {
                    setUploadButtonTimestamp();
                }
            });

            if (lastCheck && minutesSinceLastCheck > 30) {
                const status = await getResponseStatus('/upload-video/');
                status === 200 ? uploadRestored() : (console.log(`Upload button still unavailable. Last check ${Math.floor(minutesSinceLastCheck)} minutes ago`), setUploadButtonTimestamp());
            }
        } else if (lastCheck) {
            uploadRestored();
        }
    }

    handleUploadButton();



    if (window.location.href.endsWith("?action=reject_add_to_friends_done") ||
        window.location.href.endsWith("?action=confirm_add_to_friends_done")) {

        const urlOfUser = document.querySelector('#list_messages_my_conversation_messages > div.headline > h2 > a:nth-child(2)');
        const username = urlOfUser.innerHTML.trim();
        const userID = urlOfUser.getAttribute('href').match(/\/(\d+)\//)[1];

        const storedData = JSON.parse(localStorage.getItem('closedWindow'));
        if (storedData) {
            const { uid, timestamp } = storedData;
            if (secondsSinceTimestamp(timestamp) < 30 && userID === uid) {
                if (DEBUG) console.log(`Less than 30 seconds have passed since window closed. User ID: ${uid}`);
                window.close();
            }
        }
    }




    function showSearchPercentage(percentage, selector = '#list_videos_uploaded_videos_pagination') {
        let vidPagination = document.querySelector(selector);
        if (!vidPagination) return;

        let progressBar = document.querySelector('#cum_up_pct');

        if (!progressBar) {
            progressBar = document.createElement('progress');
            progressBar.id = 'cum_up_pct';
            progressBar.max = 100;
            progressBar.value = 0;
            vidPagination.insertAdjacentElement('afterend', progressBar);
        }

        requestAnimationFrame(timestamp => {
            updateProgressBar(timestamp, progressBar, percentage, performance.now());
        });
    }

    function updateProgressBar(timestamp, progressBar, targetPercentage, startTime) {
        if (targetPercentage >= 100) {
            progressBar.remove();
            return;
        }
        let elapsed = (timestamp - startTime) / 500; // 500ms transition duration
        let progress = Math.min(elapsed, 1);
        progressBar.value = progressBar.value + (targetPercentage - progressBar.value) * progress;
        if (progress < 1) {
            requestAnimationFrame(ts => updateProgressBar(ts, progressBar, targetPercentage, startTime));
        }
    }



    if (window.location.href == "https://www.camwhores.tv/my/messages/") {

        function oldestUnreadMessagesPage(newHighest = null, emptyPage = null) {

            if (![newHighest, emptyPage].every(v => v === null || typeof v === 'number'))
                throw new Error("Arguments must be numbers or null");

            let stored = parseInt(localStorage.getItem("oldestUnreadMessagesPage"));
            if (isNaN(stored)) stored = null;

            if (newHighest === null && emptyPage === null) return stored;

            if (newHighest !== null && (stored === null || newHighest > stored)) {
                if (DEBUG) console.log("Saving new highest unread page:", newHighest);
                localStorage.setItem("oldestUnreadMessagesPage", newHighest);
            }
            if (emptyPage !== null && stored === emptyPage) localStorage.removeItem("oldestUnreadMessagesPage");

            return parseInt(localStorage.getItem("oldestUnreadMessagesPage")) || 0;
        }



        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible' && !readingMessages) {
                loadListDynamically('list_members_my_conversations', myMessagesAsyncURL(getCurrentPage()), getCurrentPage(), () => processThumnailMsgPreviews(true))
            }
        });


        function myMessagesAsyncURL(pageInt = 1) {
            const utcTimestamp = new Date().getTime();
            return `https://www.camwhores.tv/my/messages/?mode=async&function=get_block&block_id=list_members_my_conversations&sort_by=added_date&from_my_conversations=${pageInt}&_=${utcTimestamp}`;
        }

        function toggleCursorWait(enable) {
            enable ? document.head.insertAdjacentHTML('beforeend', '<style id="customCursorStyle">*{cursor:wait !important}</style>') : document.getElementById('customCursorStyle')?.remove();
        }

        function listAjaxEnabler(listId) {
            let buttons = document.querySelectorAll(`#${listId} li.page a, #${listId} li.next a, #${listId} li.prev a, #${listId} li.first a, #${listId} li.last a`);
            buttons.forEach(button => {
                let page = parseInt(button.getAttribute('data-parameters').split(':')[2]);

                button.addEventListener('click', function (event) {
                    event.preventDefault();
                    toggleCursorWait(true)
                    buttons.forEach(button => button.style.filter = 'brightness(0.5)');

                    loadListDynamically(listId, myMessagesAsyncURL(page), page, () => processThumnailMsgPreviews(true))
                        .finally(() => {
                            toggleCursorWait(false)
                            buttons.forEach(button => button.style.filter = 'brightness(1)');
                        });
                });
            });
        }

        async function loadListDynamically(listId, url, page, callback = null) {
            listId = listId.replace('_pagination', '');
            let dynamicList = document.querySelector(`#${listId}`);
            let currentPage = parseInt(dynamicList.querySelector(`li.page-current span`).textContent);

            let htmlDoc = await fetchHTML(url);
            htmlDoc = htmlDoc.querySelector('#' + listId);
            let htmlString = htmlDoc.innerHTML;
            dynamicList.innerHTML = htmlString;

            let parameters = { "sort_by": "added_date", "from_my_conversations": page.toString().padStart(2, '0') };
            setPaginationSession(parameters, listId, htmlString);

            document.querySelectorAll('img.lazy-load[data-original]').forEach(img => {
                img.setAttribute('src', img.getAttribute('data-original'));
            });
            if (typeof callback === 'function') callback();

            listAjaxEnabler(listId);

            if (listId === 'list_members_my_conversations') {
                const hasUnreadNotification = !!htmlDoc.querySelector('span.unread-notification');
                oldestUnreadMessagesPage(hasUnreadNotification ? page : null, hasUnreadNotification ? null : page);
            }



            return htmlString;
        }



        async function getConversationsWithUnreadStatus(pageN) {
            const htmlDoc = await retryUntilSuccess(() => fetchHTML(myMessagesAsyncURL(pageN)), 5000);
            const conversations = [];
            const items = htmlDoc.querySelectorAll("#list_members_my_conversations_items .item");
            let thereIsUnread = false;

            items.forEach(item => {
                const name = item.querySelector('a').getAttribute('title');
                const href = item.querySelector('a').getAttribute('href');
                const unread = item.classList.contains('unread');
                if (unread) thereIsUnread = true;
                conversations.push({ name, unread, href });
            });

            oldestUnreadMessagesPage(thereIsUnread ? pageN : null, thereIsUnread ? null : pageN);
            return conversations;
        }



        async function hasUnreadMessage(currentPage) {
            const data = await getConversationsWithUnreadStatus(currentPage);
            return data.some(message => message.unread);
        }


        async function lastUnreadPage(startFrom = null, lastPage = Infinity) {
            let currentPage = startFrom ? startFrom : 1;
            let hasUnread = false;
            let lastUnreadPage = 0;
            let pagesChecked = 0;

            // console.log("Checking from", currentPage, "to", startFrom + maxPagesMessagesSearch)

            while (pagesChecked < maxPagesMessagesSearch) {
                if (currentPage > lastPage) break;

                const data = await getConversationsWithUnreadStatus(currentPage);
                hasUnread = data.some(message => message.unread);

                // console.log("hasUnread:", hasUnread, "currentPage:",currentPage)

                if (hasUnread) lastUnreadPage = currentPage;

                showSearchPercentage((pagesChecked / maxPagesMessagesSearch) * 100, '#list_members_my_conversations .headline');
                pagesChecked++;
                currentPage++;
                hasUnread = false;
                await sleep(5);
            }

            showSearchPercentage(100, '#list_members_my_conversations .headline');
            oldestUnreadMessagesPage(lastUnreadPage);
            // console.log("Returning", lastUnreadPage)
            return lastUnreadPage;
        }


        async function checkAndFixMessages() {
            const currentPage = getCurrentPage();
            const data = await getConversationsWithUnreadStatus(currentPage);

            let hasNewElements = false;

            data.forEach(item => {
                let userID = extractUserId(item.href)

                const userItem = document.querySelector(`#list_members_my_conversations_items > div.item > a[href="https://www.camwhores.tv/my/messages/${userID}/"]`);
                if (userItem) {
                    const unreadNotification = userItem.querySelector('div.img .unread-notification');
                    if (unreadNotification && !item.unread) {
                        unreadNotification.remove();
                        if (DEBUG) console.log("Message with", item.name, "was read");
                    }
                } else {
                    hasNewElements = true;
                }
            });

            if (hasNewElements && !readingMessages) {
                location.reload();
            }
        }




        GM_addStyle(`
#list_members_my_conversations_items div > a{
  overflow:hidden;
}
#list_members_my_conversations_items div > a > div.img > a.open-profile{
  position: absolute;
  top:50%;
  right:-.5rem;
  transform: translateY(-50%);
  opacity:0;
  transition: .4s;
  font-size:1.75rem;
  pointer-events: none;
  padding:1rem .4rem;
}
#list_members_my_conversations_items div > a > div.img > .open-profile{
  filter: sepia(1) hue-rotate(330deg) saturate(2) brightness(1.1);
  transition: .2s;


}
#list_members_my_conversations_items div > a > div.img > .open-profile:hover{
  filter:sepia(.9) hue-rotate(320deg) saturate(1.8) brightness(.9) contrast(1.1)
}

#list_members_my_conversations_items div > a > div.img:hover > a.open-profile{
  opacity:1;
  pointer-events: all;
}

#list_members_my_conversations_items div > a > div.img img{
  transform: scale(1);
  transform-origin: center;
  transition: .3s;
}
#list_members_my_conversations_items div > a > div.img:hover img{
  filter: blur(10px) brightness(.8) contrast(1.1);
  transform: scale(1.1);
}
#list_members_my_conversations_items div > a > div.img span.no-thumb{
  transition: opacity 1s
}
#list_members_my_conversations_items div > a > div.img:hover span.no-thumb{
  opacity:.5;
  transition: opacity .4s;
}
`);



        async function processThumnailMsgPreviews(force = false) {
            // console.log("processThumnailMsgPreviews()")
            const items = document.querySelectorAll('#list_members_my_conversations_items .item');
            if (!items.length) return;

            for (const item of items) {
                if (!force && item?.dataset.processed === 'true') return;

                const thumbnailText = item.querySelector('strong.title')?.textContent.trim();
                if (!thumbnailText) continue;

                const messageURL = item.querySelector('a');
                const contentContainer = messageURL?.querySelector('div.img');
                const href = messageURL?.getAttribute('href');
                const userId = href?.match(/\/(\d+)\/$/)?.[1];
                if (!userId) continue;

                const htmlDoc = await fetchHTML(`https://www.camwhores.tv/members/${userId}/`);
                // console.log("fetched",userId);

                const infoMessage = htmlDoc.querySelector('.info-message');
                if (infoMessage?.textContent.includes("is in your friends list.")) {
                    let divElement = Object.assign(document.createElement('div'), {
                        className: "friends-tag",
                        textContent: "Friends ✅",
                        style: `position:absolute;top:0;right:0;background-color:#414141;border-bottom-left-radius:3px;color:white;padding:3px 5px;`
                    });
                    contentContainer?.appendChild(divElement);
                }

                let bottomLeftCorner = Object.assign(document.createElement('div'), {
                    style: `position:absolute;bottom:0;left:0;color:white;font-size:1rem;padding:.5rem .25rem;`
                });
                contentContainer?.appendChild(bottomLeftCorner);



                if (infoMessage?.textContent.includes("wants to be your friend.")) {
                    let divElement = Object.assign(document.createElement('span'), {
                        textContent: `👀`,
                        title: "Wants to be your friend!"
                    });
                    bottomLeftCorner?.appendChild(divElement);
                }

                let starredUser = retrieveValueFromStorage("favourite_users")[userId]?.friends;
                if (starredUser) {
                    let star = Object.assign(document.createElement('span'), {
                        textContent: '★',
                        title: 'Starred user',
                        className: 'cum_star_user',
                        style: `font-size:1.5rem;margin:0`
                    });
                    bottomLeftCorner?.appendChild(star);
                }




                let openProfile = Object.assign(document.createElement('a'), {
                    className: "open-profile",
                    textContent: '👤',
                    title: `Open ${thumbnailText}'s profile`,
                    href: `/members/${userId}/`
                });
                contentContainer?.appendChild(openProfile);


                let videoNumber = htmlDoc.querySelector('#list_videos_uploaded_videos div.headline h2')?.textContent.match(/\(([^)]+)\)/)?.[1] || 0;
                let divElement = Object.assign(document.createElement('div'), {
                    className: "videos-tag",
                    textContent: videoNumber,
                    style: `position:absolute;bottom:0;right:0;background-color:CadetBlue;color:white;padding:3px 5px;border-top-left-radius:3px;`
                });
                if (videoNumber === 0) divElement.style.backgroundColor = 'hsla(0deg, 51.63%, 30%, 50%)';
                contentContainer?.appendChild(divElement);


                item.dataset.processed = 'true';
            }
            return true;
        }






        async function addButtonEventListener() {
            document.addEventListener('click', function (event) {
                var target = event.target;
                if (target && target.matches('a[data-action="ajax"]')) {

                    var h2Element = document.querySelector('#list_members_my_conversations div.headline h2');
                    const initialText = h2Element.textContent.trim();

                    const checkChangeInterval = setInterval(function () {
                        h2Element = document.querySelector('#list_members_my_conversations div.headline h2');
                        const currentText = h2Element.textContent.trim();

                        if (currentText !== initialText) {
                            clearInterval(checkChangeInterval);
                            processThumnailMsgPreviews();
                        }
                    }, 100);
                }
            });
        }

        setTimeout(function () {
            var thumbnailsProcessed = processThumnailMsgPreviews();
            if (!thumbnailsProcessed) {
                if (DEBUG) console.warn("Processing thumbnails failed. Retrying in 1000 milliseconds.");
                setTimeout(function () {
                    processThumnailMsgPreviews(); // Retry processing thumbnails
                }, 1000);
            }
            addButtonEventListener();
        }, 1000);

        setInterval(function () {
            processThumnailMsgPreviews()
        }, 5000);

        setInterval(function () {
            addButtons()
        }, 500);


        async function addButtons() {
            const h2Element = document.querySelector('#list_members_my_conversations .headline h2');
            if (!h2Element) {
                if (DEBUG) console.log('h2Element not found');
                return;
            }

            if (!document.getElementById('refreshIcon')) {
                const refreshIcon = document.createElement('span');
                refreshIcon.id = 'refreshIcon';
                refreshIcon.innerHTML = '&#8635;';
                refreshIcon.title = 'Refresh Utilities Mod';
                refreshIcon.style = 'cursor:pointer;margin-left:10px;';
                refreshIcon.addEventListener('click', () => {
                    loadListDynamically('list_members_my_conversations', myMessagesAsyncURL(getCurrentPage()), getCurrentPage(), () => processThumnailMsgPreviews(true))
                });
                h2Element.appendChild(refreshIcon);
            }

            if (!document.getElementById('lastUnreadButton')) {
                let title = `Go to oldest unread page`;

                let lastUnreadButton = document.createElement('a');
                lastUnreadButton.id = 'lastUnreadButton';
                lastUnreadButton.innerHTML = '⏭';
                lastUnreadButton.style = 'cursor:pointer;margin-left:10px;text-decoration:none;';
                lastUnreadButton.addEventListener('click', async () => {

                    lastUnreadButton.classList.add('CUM_fade');
                    readingMessages = true;
                    let hasUnread;

                    let currentPage = getCurrentPage();
                    let oldestUnreadPage = 0;
                    let savedUnreadPage = oldestUnreadMessagesPage();


                    if (savedUnreadPage > currentPage) {
                        let data = await getConversationsWithUnreadStatus(savedUnreadPage);
                        hasUnread = data.some(message => message.unread);

                        oldestUnreadPage = hasUnread ? savedUnreadPage : 0;


                    }


                    if (oldestUnreadPage <= 0) {

                        // console.log(" if(!oldestUnreadPage) oldestUnreadPage"+oldestUnreadPage)


                        let startFrom = currentPage;
                        startFrom += 1;
                        let lastPageElement = document.querySelector("#list_members_my_conversations_pagination > div > ul > li.last a");
                        let lastPage = !!lastPageElement ? parseInt(lastPageElement.getAttribute('href').match(/\/(\d+)\/$/)?.[1], 10) : 1;





                        oldestUnreadPage = await lastUnreadPage(currentPage, lastPage);


                        // if((oldestUnreadPage === 0 || oldestUnreadPage <= currentPage)){
                        //   console.log("I would enter the while loop because oldestUnreadPage",oldestUnreadPage, "===",0,"or (oldestUnreadPage <= currentPage)", oldestUnreadPage, "<=" ,currentPage)
                        // }


                        while (oldestUnreadPage === 0 || oldestUnreadPage <= currentPage) {
                            startFrom += 10;

                            if (startFrom >= lastPage) break;

                            console.log("Checking pages", startFrom, "-", startFrom + maxPagesMessagesSearch, "Last page:", lastPage)
                            oldestUnreadPage = await lastUnreadPage(startFrom, lastPage);
                        }


                    }


                    // console.log("oldestUnreadPage", oldestUnreadPage)
                    lastUnreadButton.classList.remove('CUM_fade');
                    readingMessages = false;


                    loadListDynamically(
                        'list_members_my_conversations',
                        myMessagesAsyncURL(oldestUnreadPage),
                        oldestUnreadPage,
                        () => processThumnailMsgPreviews(true)
                    );






                });

                lastUnreadButton.title = title;
                h2Element.appendChild(lastUnreadButton);
            }



        }
        addButtons()
    }

    if (window.location.href.startsWith("https://www.camwhores.tv/my/messages/") && window.location.href !== "https://www.camwhores.tv/my/messages/") {

        function updateButtonStyle(button, state) {
            button?.classList.add(state ? "accept-button" : "reject-button");
        }

        let textarea = document.querySelector("#send_message_message");
        let urlOfUser = document.querySelector('#list_messages_my_conversation_messages > div.headline > h2 > a:nth-child(2)')
        let username = urlOfUser.innerHTML.trim();
        let userID = urlOfUser.getAttribute('href').match(/\/(\d+)\//)[1];
        let confirmButton = document.querySelector('input[name="confirm"]');
        let rejectButton = document.querySelector('input[name="reject"]');
        let buttonsParent = confirmButton ? confirmButton.parentElement : null;
        let confirmClose = null
        let denyClose = null
        let submitForm = document.querySelector('input.submit');
        let editButtons = document.querySelectorAll('.item .editable');

        if (sessionStorage.getItem('go_to_uploaded_videos') === 'true') {
            sessionStorage.removeItem('go_to_uploaded_videos');
            if (history.length === 1) window.location.href = `/members/${userID}/#list_videos_my_uploaded_videos`;
        }
        if (sessionStorage.getItem('return_to_messages') === 'true') {
            sessionStorage.removeItem('return_to_messages');
            if (window.history.length) window.location.href = `/my/messages/`;
            //send_done

        }

        confirmButton?.addEventListener('click', () => sessionStorage.setItem('go_to_uploaded_videos', 'true'));
        rejectButton?.addEventListener('click', () => sessionStorage.setItem('return_to_messages', 'true'));



        let debugTextarea = false;
        debugTextarea ? textarea.placeholder = "OLD, original" : textarea.style.display = "none";

        let divTextarea = document.createElement('div');
        divTextarea.classList.add("textarea");
        divTextarea.id = 'custom-textarea';
        divTextarea.contentEditable = true;
        textarea.parentNode.insertBefore(divTextarea, textarea.nextSibling);

        //         function copyContentToTextarea() {
        //             const content = Array.from(divTextarea.childNodes).map(node => {
        //                 if (node.nodeType === 3) return node.textContent; // Handles plain text
        //                 if (node.tagName === 'IMG') return node.alt;
        //                 if (node.tagName === 'DIV') return '\n' + node.textContent;
        //                 if (node.tagName === 'BR') return '\n';
        //                 return '';
        //             }).join('').trim();

        //             textarea.value = content;
        //         }

        function copyContentToTextarea() {
            const content = Array.from(divTextarea.childNodes).map(node => {
                if (node.nodeType === 3) return node.textContent;
                if (node.tagName === 'IMG') return node.alt;
                if (node.tagName === 'DIV') return '\n' + node.textContent;
                if (node.tagName === 'BR') return '\n';
                return node.textContent || '';
            }).join('').trim();

            textarea.value = content;
        }



        editButtons.forEach(element => {
            element.addEventListener('click', function () {
                console.log("textarea content:", textarea.value);
                setTimeout(() => {
                    const formattedContent = textarea.value.replace(/\n/g, '<br>');
                    divTextarea.innerHTML = formattedContent;
                }, 0);
            });
        });



        divTextarea.oninput = copyContentToTextarea;
        submitForm?.addEventListener('click', () => divTextarea.innerHTML = '');



        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                console.log("Ctrl+Enter pressed");
                document.querySelector('#send_message_form').submit();
            }
        });



        document.querySelectorAll('.smileys-bar img').forEach(img =>
            img.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                divTextarea.appendChild(Object.assign(img.cloneNode(true), { style: { cursor: "auto" } }));
                copyContentToTextarea();
            }
        );


        document.querySelectorAll('span.inline-text, span.original-text').forEach(function (span) {
            let lineText = span.textContent.trim();
            if (lineText.includes('##')) {
                let index = lineText.lastIndexOf(':');
                let videoText = lineText.substring(0, index).trim();
                let videoInfo = lineText.substring(index + 1).trim().replace('##', '');


                let parts = videoInfo.split("\n");
                let videoCode = parts[0];
                let videoID = parts[1];
                let url = 'https://www.camwhores.tv/videos/' + videoID + "/" + makeValidUrlString(videoCode) + '/';

                if (DEBUG) {
                    console.log('Video Text:', videoText);
                    console.log('Video Code:', videoCode);
                    console.log('Video ID:', videoID);
                    console.log('URL:', url);
                }

                fetch(url)
                    .then(response => {
                        if (response.ok) {
                            span.innerHTML = videoText + `<a href="` + url + '" class="toggle-button" style="display:inline-block">' + videoCode + '</a>';
                        } else if (response.status === 404) {
                            console.log("URL is 404");
                        } else {
                            console.error("Error:", response.status);
                        }
                    })
                    .catch(error => console.error("Error:", error));

            }
        });

        function updateStar(starEmoji) {
            let userData = retrieveValueFromStorage("favourite_users")[userID];

            starEmoji.textContent = userData?.friends ? '★' : '☆';
            starEmoji.classList.toggle('no', !userData?.friends);

            starEmoji.title = userData?.friends ? 'Remove star' : 'Add star';

            starEmoji.onmouseover = () => {
                starEmoji.textContent = starEmoji.textContent === '★' ? '☆' : '★';
            };
            starEmoji.onmouseout = () => {
                starEmoji.textContent = userData?.friends ? '★' : '☆';
            };
        }


        function starListener(starEmoji) {
            starEmoji.addEventListener('click', () => {
                let oldData = retrieveValueFromStorage("favourite_users");
                // console.log(oldData)

                let friends = oldData?.[userID]?.friends || false;
                let firstAdd = oldData?.[userID]?.firstAdd || null;

                let data = {
                    update: Date.now(),
                    id: userID,
                    friends: !friends,
                    firstAdd: firstAdd || Date.now()
                };
                saveArraySettings("favourite_users", userID, data);
                updateStar(starEmoji);

            });
        }
        function addStarButton() {
            let titleHeadline = document.querySelector('#list_messages_my_conversation_messages .headline h2');

            let starEmoji = document.querySelector('#cum_star_user');
            if (!!starEmoji) return;

            starEmoji = document.createElement('span');
            starEmoji.id = 'cum_star_user';

            updateStar(starEmoji);
            starListener(starEmoji);

            titleHeadline.appendChild(starEmoji);
        }

        addStarButton()






        function andClosePage() {
            localStorage.setItem('closedWindow', JSON.stringify({ uid: userID, timestamp: Date.now() }));
            window.close();
        }

        function addCloseButtonsListeners(confirmButton, rejectButton) {
            if (!confirmButton) return {};

            const createButton = (text, action) => {
                const btn = document.createElement('span');
                btn.className = 'submit button';
                btn.textContent = text;
                btn.addEventListener('click', event => {
                    event.preventDefault();
                    action();
                    andClosePage();
                });
                return btn;
            };

            const buttonsParent = confirmButton.parentElement;
            const confirmClose = createButton('Confirm & Close', () => confirmButton.click());
            const denyClose = createButton('Deny & Close', () => rejectButton.click());
            denyClose.setAttribute('data-action', 'denyclose')

            buttonsParent.append(confirmClose, ' ', denyClose);
            confirmButton.style.width = `${confirmClose.offsetWidth}px`;
            rejectButton.style.width = `${denyClose.offsetWidth}px`;

            return { confirmClose, denyClose };
        }



        function encodeHTML(str) {
            return str.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function updateMessageDOM(htmlDoc, confirmClose, denyClose) {
            // console.log(htmlDoc)
            const twoYearsSeconds = 60 * 60 * 24 * 365 * 2;
            var titleText = htmlDoc.querySelector('#list_videos_uploaded_videos > div:nth-child(1) > h2')?.textContent.trim();
            var lastUploadTime = htmlDoc.querySelector('#list_videos_uploaded_videos_items > div.item > a > div.wrap > div.added > em')?.textContent.trim();

            var joinedDateText = htmlDoc.querySelector('div.block-profile > div.profile-list > div.margin-fix > div.column > div:nth-child(3) > em')?.textContent.trim();
            var lastLogin = htmlDoc.querySelector('div.block-profile > div.profile-list > div.margin-fix > div.last-login > div.item')?.textContent.trim();
            let secondsSinceOnline = convertToSeconds(lastLogin);
            let recentlyOnline = secondsSinceOnline <= 300;
            // let recentlyOnline = true;
            const headlineH2 = document.querySelector('#list_messages_my_conversation_messages .headline h2');
            // console.log("recentlyOnline:", recentlyOnline);
            var recentlyUploaded = false;
            // console.log("Has focus:", document.hasFocus(), "titleText:", titleText)

            let userDescription = htmlDoc.querySelector("body > div.container > div.content > div > div.main-container-user > div.block-profile > div > div > div.about-me > div > em")?.textContent.trim();

            if (!document.hasFocus() && !titleText) {
                denyClose.click()
                window.close();
            }

            if (lastUploadTime) {
                let lastUploadTimeSeconds = convertToSeconds(lastUploadTime);
                recentlyUploaded = lastUploadTimeSeconds < twoYearsSeconds;
            }

            if (recentlyOnline) {
                GM_addStyle(`.list-messages .item.new .added:after {
                  background-color: green;
                }`);

                document.querySelector("#list_messages_my_conversation_messages_items > div.item.new > div.added").textContent += " (online)";
                headlineH2.innerHTML += " (online)"

            }

            if (titleText) { // THERE ARE VIDEOS
                var extractedTitle = titleText.match(/\(([^)]+)\)/);
                if (extractedTitle && extractedTitle.length >= 1) {
                    // THERE ARE VIDEOS

                    if (recentlyUploaded) {
                        updateButtonStyle(confirmButton, true);
                        updateButtonStyle(confirmClose, true);
                    } else {
                        updateButtonStyle(rejectButton, false);
                        updateButtonStyle(denyClose, false);
                    }

                    var generatedTextDiv = document.createElement('div');
                    generatedTextDiv.id = 'gen_joined_text';
                    let encodedDescription = encodeHTML(userDescription);
                    let aboutUserSection = encodedDescription !== 'no info'
                        ? `<br><br><b>About user:</b><div style="white-space:pre-wrap">${encodedDescription}</div>`
                        : '';

                    generatedTextDiv.innerHTML = `<div>
                                                    ${extractedTitle[1]} videos, last ${lastUploadTime}<br>Joined ${joinedDateText}
                                                    ${aboutUserSection}
                                                  </div>`;

                    var messageDiv = document.querySelector('#list_messages_my_conversation_messages_items > div > div:nth-child(3)');
                    if (messageDiv) {
                        messageDiv.appendChild(generatedTextDiv);
                    }
                } else {
                    if (extractedTitle) console.log("extractedTitle:", extractedTitle)
                }


                if (confirmClose) {
                    let imgData = [];
                    for (let i = 1; i <= 5; i++) {
                        let xpath = `//*[@id="list_videos_uploaded_videos_items"]/div[${i}]/a/div[@class="img"]/img`;
                        let img = htmlDoc.evaluate(xpath, htmlDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        if (img) {
                            let parentAnchor = img.parentNode.parentNode;
                            imgData.push({ src: img.getAttribute('data-original'), alt: img.alt, url: parentAnchor.getAttribute('href') });
                        }
                    }
                    let vidPreviewsDiv = document.createElement("div");
                    vidPreviewsDiv.id = "vid_previews";
                    if (!isArrayEmpty(imgData)) {
                        imgData.forEach(data => {
                            let imgDiv = document.createElement("div");
                            imgDiv.classList.add("img-div");
                            let imgLink = document.createElement("a"); // New line
                            imgLink.href = data.url + "?please_check_friend"; // New line
                            let img = document.createElement("img");
                            img.src = data.src;
                            img.alt = data.alt;
                            img.title = data.alt;
                            let title = document.createElement("h2");
                            title.textContent = data.alt;
                            imgLink.appendChild(img);
                            imgDiv.appendChild(imgLink);
                            imgDiv.appendChild(title);

                            vidPreviewsDiv.appendChild(imgDiv);
                        });

                        buttonsParent.appendChild(vidPreviewsDiv);
                    }

                }


            } else {
                // THERE ARE NO VIDEOS
                console.log('No videos? Title: ' + titleText + ", content: " + lastUploadTime);
                updateButtonStyle(rejectButton, false);
                updateButtonStyle(denyClose, false);

                var messageDiv = document.querySelector('#list_messages_my_conversation_messages_items > div > div:nth-child(3)');
                if (messageDiv) {
                    var generatedTextDiv = document.createElement('div');
                    generatedTextDiv.id = 'gen_joined_text';
                    generatedTextDiv.innerHTML = `Joined ${joinedDateText}<br><b>No videos</b>`;
                    messageDiv.appendChild(generatedTextDiv);

                }
            }

        }


        const bottomDiv = document.querySelector("#send_message_form > div > div.bottom");
        const responsesDiv = document.createElement("div");
        responsesDiv.id = "responses";
        responsesDiv.style.marginTop = "1rem";
        bottomDiv.insertAdjacentElement('afterend', responsesDiv);

        auto_replies.forEach(string => {
            const button = document.createElement("button");
            button.textContent = string;
            button.className = "button";
            button.style.padding = ".25rem .5rem";
            button.addEventListener("click", e => {
                e.preventDefault();
                textarea.value += textarea.value.trim() ? `\n${string}` : string;
                document.querySelector('#send_message_form').submit();
            });
            responsesDiv.appendChild(button);
        });

        var messageLink = document.evaluate('//*[@id="list_messages_my_conversation_messages_items"]/div/div[1]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        if (messageLink && messageLink.singleNodeValue) {
            var messageUrl = messageLink.singleNodeValue.href;

            const parentElement = document.evaluate('//*[@id="list_messages_my_conversation_messages_items"]/div/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const img = document.createElement('img');
            img.src = 'https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg'; // loading spinner
            img.style.height = "32px";
            img.style.width = "32px";
            parentElement.appendChild(img);
            fetchMessagesAndExtract(messageUrl, function (htmlDoc) {
                var closeButtons = addCloseButtonsListeners(confirmButton, rejectButton);
                var confirmClose = closeButtons.confirmClose;
                var denyClose = closeButtons.denyClose;
                updateMessageDOM(htmlDoc, confirmClose, denyClose);

            });
        }


        // AESTHETIC CHANGE
        var bottomElement = document.evaluate('//*[@id="list_messages_my_conversation_messages_items"]/div/div[3]/form/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (bottomElement && bottomElement.singleNodeValue) {
            bottomElement.classList.add('bottom-element');
            bottomElement.singleNodeValue.style.marginTop = "1em";
            bottomElement.singleNodeValue.style.marginBottom = "1em";
            bottomElement.singleNodeValue.style.outline = "2px solid red";
            bottomElement.singleNodeValue.classList.remove("bottom");
        }



        document.querySelectorAll('.message-text').forEach(div => {
            if (div.textContent.includes('has denied your invitation.')) {
                div.parentElement.style.backgroundColor = '#8b4949'; // Red shade
            } else if (div.textContent.includes('has confirmed your invitation')) {
                div.parentElement.style.backgroundColor = '#4a7c59'; // Green shade
            }
        });


    }

    if (isNotPage("https://www.camwhores.tv/my/videos/", "https://www.camwhores.tv/my/")) {


        function getPrivateVideos() {
            const private_videos = [];

            const videoElements = document.querySelectorAll('.item.private');

            videoElements.forEach(video => {
                let parentDiv = video.parentElement;
                if (
                    parentDiv.tagName === 'DIV' &&
                    parentDiv.id !== 'list_albums_albums_list_search_result_items' &&
                    !video.hasAttribute('data-bg-checked')
                ) {
                    video.setAttribute('data-bg-checked', 'true');
                    // video.style.outline ="3px solid purple"
                    private_videos.push(video);
                }
            });

            return private_videos;
        }

        async function checkVideoPage(url) {
            try {
                let asyncURL = url + '?mode=async&function=get_block&block_id=video_view_video_view&_=' + Date.now();

                const htmlDoc = await retryUntilSuccess(() => fetchHTML(asyncURL), 5000);

                let message = htmlDoc.querySelector('.message');
                let isByFriend = !!message && message.innerText.includes('This video is a private video');

                let usernameElement = htmlDoc.querySelector('#tab_video_info .block-user .username a');
                let username = !!usernameElement ? usernameElement.innerText.trim() : '';
                let userUrl = usernameElement ? usernameElement.href : '';

                let userID = extractUserId(userUrl);

                return { byFriend: isByFriend, userID: userID, username: username };

            } catch (error) {
                console.error('Error checking video page:', error);
                return { byFriend: false, userID: null };
            }
        }

        function updateImageSrc(image) {
            const src = image?.src;
            if (src?.endsWith('1.jpg')) image.src = src.replace('1.jpg', '5.jpg');
        }

        async function applyStyleToPrivateVideos() {
            if (advancedOptions['disableBackgroundFetching']) {
                if (DEBUG) console.log("Returning earlier because advanced disableBackgroundFetching =", advancedOptions['disableBackgroundFetching'])
                return;
            }

            if (advancedOptions['backgroundFetchOnlyVideos'] && !/\/(tags|search)\//.test(window.location.href)) {
                console.log("Returning because of advanced setting backgroundFetchOnlyVideos");
                return;
            }

            while (document.hidden) {
                await sleep(250);
            }

            for (const video of getPrivateVideos()) {
                const videoA = video.querySelector('a');

                const img = videoA.querySelector('div > img');
                const link = videoA.href;

                if (!link) continue;

                const { byFriend, userID, username } = await checkVideoPage(link);

                if (alternative_thumbnails_users.includes(username)) updateImageSrc(img);

                if (!byFriend) {
                    stylePrivateVideo(videoA, img);
                    continue;
                }

                await handleFriendRequest(videoA, userID, username, img, link);
            }
        }

        function stylePrivateVideo(video, img) {
            video.style.outline = 'green solid 2px';
            const linePrivate = video.querySelector('.line-private');
            if (linePrivate) linePrivate.style.display = 'none';

            if (img) img.style.opacity = '1';
        }

        async function handleFriendRequest(video, userID, username, img, link) {
            const linePrivate = video.querySelector('.line-private > span');
            linePrivate.textContent += ' ❌';

            if (!linePrivate || alreadySentRequest(userID)) return;

            const addFriend = createFriendRequestLink(userID);
            addFriend.addEventListener('mousedown', e => {
                e.stopImmediatePropagation();
                friendRequestSetup(video.querySelector('strong.title').textContent.trim(), link, userID);
            });

            video.querySelector('.img').appendChild(addFriend);

        }

        function createFriendRequestLink(usernameID) {
            const addFriend = document.createElement('a');
            Object.assign(addFriend, {
                textContent: '➕',
                title: 'Friend request',
                href: `https://www.camwhores.tv/members/${usernameID}/#friends`,
                style: 'z-index: 10; position: absolute; bottom: 20px; right: 0; font-size: 1rem; padding: 5px 2.5px; background-color: hsla(0, 0%, 0%, 0.7);'
            });
            return addFriend;
        }

        function highlightKeywords() {
            document.querySelectorAll('.title').forEach(title => {
                highlight_keywords.forEach(keyword => {
                    title.innerHTML = title.innerHTML.replace(new RegExp(keyword, 'gi'), '<span style="color: hsl(120deg 90% 70%);">$&</span>');
                });
            });
        }

        applyStyleToPrivateVideos();
        highlightKeywords();

        setTimeout(() => {
            let lastRun = 0;

            const videosObserver = new MutationObserver(() => {
                const now = Date.now();
                if (now - lastRun >= 500) {
                    lastRun = now;
                    applyStyleToPrivateVideos();
                    highlightKeywords();
                }
            });

            videosObserver.observe(document.body, { childList: true, subtree: true });
        }, 1000);




    }

    if (window.location.href.startsWith("https://www.camwhores.tv/members/")) {
        const userId = window.location.href.split('/').slice(-2, -1)[0];
        const userVideosH2 = document.querySelector('#list_videos_uploaded_videos .headline h2');
        const userDescription = document.querySelector("div.block-profile > div.profile-list > div > div.about-me > div > em");
        const lastLogin = document.querySelector('div.block-profile > div.profile-list > div.margin-fix > div.last-login > div.item')?.textContent.trim();
        const h1 = document.querySelector("h1");
        const country = document.querySelector('div.block-profile > div.profile-list > div.margin-fix > div.column > div:nth-child(1) > em');
        const countryName = country.textContent.trim();
        const countryCode = contryCodesArray()[countryName] || [];
        const parent = document.querySelector('div.block-profile > div.profile-list > div.margin-fix > div.column > div:nth-child(1)');
        const recentlyOnline = convertToSeconds(lastLogin) <= 300;




if (!document.querySelector('#CUM_messages')) {
    let sendMessage = document.querySelector('a[data-action="message"]');
    let newButton = document.createElement('a');
    newButton.id = 'CUM_messages';
    newButton.href = `/my/messages/${userId}/`;
    newButton.className = sendMessage.className;
    newButton.innerHTML = '<span>💬</span>';
    sendMessage.parentNode.insertBefore(newButton, sendMessage.nextSibling.nextSibling);
}





        function numberBetweenParenthesis(text) {
            return text?.match(/\((\d+)\)/)?.[1] ?? null;
        }

        function getRoundedTotalPages(h2) {
            const total = numberBetweenParenthesis(h2?.textContent);
            return total ? Math.ceil(total / 5) : null;
        }

        function addListInfo(selector = '#list_videos_uploaded_videos .headline h2') {
            let listTitle = document.querySelector(selector);
            if (!listTitle) {

                return;
            }
            if (listTitle.textContent.includes("/") || listTitle.textContent.includes("pages")) return;

            let roundedPages = getRoundedTotalPages(listTitle);
            if (!roundedPages) return;

            if (listTitle.innerHTML.includes("Page")) listTitle.innerHTML = listTitle.innerHTML.trim() + ` / ${roundedPages}`;
            if (!listTitle.innerHTML.includes("Page")) listTitle.innerHTML = listTitle.innerHTML.trim() + `, in ${roundedPages} pages`;

        }


        function addSearchButton(listId = 'list_videos_uploaded_videos', asyncURL = userVideosAsyncURL) {
            const searchSelector = `#cum_${listId}_search`;
            if (document.querySelector(searchSelector)) return;

            const sortElement = document.querySelector(`#${listId} > div.headline > div.sort`);
            if (!sortElement) return;

            const existingButton = document.querySelector(searchSelector);
            if (!!existingButton) return;

            const searchButton = document.createElement('div');
            searchButton.className = 'user-search';
            searchButton.innerHTML = '<strong>Search videos</strong><span class="icon type-search"></span>';
            searchButton.id = searchSelector.substring(1); // Remove the # for the ID
            searchButton.addEventListener('click', () => searchDialog(listId, asyncURL));
            sortElement.parentNode.insertBefore(searchButton, sortElement);


        }

        function searchDialog(listId, asyncURL) {
            if (document.querySelector('#search-dialog')) return;

            let searchHighlights = retrieveValueFromStorage("highlights_search") || [];

            let dialog = document.createElement('div');
            dialog.id = "search-dialog";
            dialog.innerHTML = `
                    <div class="fancybox-item fancybox-close" style="position:absolute;top:5px;right:5px;"></div>
                <form style="padding-top:10px" id="cum_form_query">
                    <input type="text" autofocus placeholder="Search... 🔍" style="margin-right:5px;padding:5px;">
                    <button class="btn" type="submit" style="padding:5px;box-sizing:border-box;height:30px;cursor:pointer;">Search</button>
                </form>
                <hr style="margin-top:10px;border:none;height:1px;background-color:rgb(58, 63, 65);">
                <button class="btn" id="cum_search_all" type="button" style="display:block;padding:5px;box-sizing:border-box;height:30px;cursor:pointer;width:100%;margin-top:5px;"
                        title="${highlight_keywords.join(", ")}">📚 Search <strong>every</strong> highlight word</button>
                    <button class="btn" id="cum_search_checkbox" type="button" style="display:block;padding:5px;box-sizing:border-box;height:30px;cursor:pointer;width:100%;margin-top:10px">⬇️ Search selected</button>
                <form style="padding-top:10px" id="cum_form_checkbox">
                    ${highlight_keywords.map((keyword, index) => `
                        <label>
                            <input type="checkbox" name="${keyword}" style="padding:5px;" ${searchHighlights.includes(keyword) ? 'checked' : ''}>
                            ${keyword}
                        </label>
                    `).join('')}

                </form>
            `;

            document.body.insertBefore(dialog, document.body.firstChild);

            dialog.querySelector('#cum_search_checkbox').addEventListener('click', e => {
                e.preventDefault();

                let selectedKeywords = Array.from(dialog.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(checkbox => checkbox.name);

                saveValue("highlights_search", selectedKeywords)
                displayResults(selectedKeywords, listId, asyncURL);

                document.body.removeChild(dialog);
            });




            dialog.querySelector('#cum_form_query').addEventListener('submit', e => {
                e.preventDefault();
                let input = dialog.querySelector('input').value;
                if (input) displayResults(input, listId, asyncURL);
                document.body.removeChild(dialog);
            });
            dialog.querySelector('#cum_search_all').addEventListener('click', e => {
                e.preventDefault();
                displayResults("", listId, asyncURL);
                document.body.removeChild(dialog);
            });
            dialog.querySelector('.fancybox-close').addEventListener('click', e => {
                e.preventDefault();
                document.body.removeChild(dialog);
            });
        }



        async function displayResults(query, listId, asyncURL) {
            try {
                const resultList = document.createElement('div');
                // resultList.id = 'cum_search_results'; // ???????? change
                resultList.className = "list-videos";


                let results = await videoSearch(userId, query, asyncURL, listId);

                resultList.innerHTML = `<div class="headline" style="padding:15px 5px 7px 5px;"><h2>Search results</h2></div>`;

                await sleep(250)

                if (DEBUG) console.log(results);

                if (DEBUG) console.log(Array.isArray(results));
                if (!results.length) {
                    resultList.textContent = "No results found";
                    resultList.style.marginTop = "1rem";

                } else {
                    resultList.innerHTML += results.map(video => `
                    <div class="item" style="margin-left:11px;">
                        <a href="${video.url}" title="${video.title}">
                            <div class="img"><img class="thumb lazy-load" src="${video.imgSrc}" alt="${video.title}" width="180" height="135"></div>
                            <strong class="title">${video.title}</strong>
                            <div class="wrap"><div class="duration">${video.duration}</div></div>
                        </a>
                    </div>`).join('');
                }

                const existingResult = document.querySelector(`#${listId} + .list-videos`);
                if (existingResult) existingResult.replaceWith(resultList);
                else document.querySelector("#" + listId).insertAdjacentElement('afterend', resultList);
            } catch (error) {
                console.error("Error:", error);
            }
            // console.log("Finished ")
        }


        async function getSearchTerms(query) {
            return Array.isArray(query)
                ? query.map(q => q.toLowerCase())
                : query
                    ? [query.toLowerCase()]
                    : highlight_keywords.map(k => k.toLowerCase());
        }

        function extractVideoDetails(video) {
            let title = video.querySelector('a').getAttribute('title');
            let url = video.querySelector('a').getAttribute('href');
            let imgSrc = video.querySelector('img').getAttribute('data-original');
            let duration = video.querySelector('.duration').textContent.trim();
            let isPrivate = video.classList.contains('private');
            return { title, private: isPrivate, url, imgSrc, duration };
        }

        function filterVideosBySearchTerms(videoDetails, searchTerms) {
            const titleInLowerCase = videoDetails.title.toLowerCase();

            const isMatchFound = searchTerms.some(searchTerm => {
                const searchTermInLowerCase = searchTerm.toLowerCase();

                // console.log(`Checking if "${searchTerm}" is in the title '${titleInLowerCase}': ${titleInLowerCase.includes(searchTermInLowerCase)}`);

                return titleInLowerCase.includes(searchTermInLowerCase);
            });

            return isMatchFound;
        }


        function getVideoDetailsFromHTML(videos, searchTerms, resultArray) {
            videos.forEach(video => {
                let videoDetails = extractVideoDetails(video);
                if (filterVideosBySearchTerms(videoDetails, searchTerms)) {
                    resultArray.push(videoDetails);
                }
            });
        }


        async function fetchVideosFromPage(userId, pageInt, asyncURL, listId, searchTerms, resultArray) {
            let nextFivePages = asyncURL(userId, pageInt);
            // console.log("nextFivePages:", nextFivePages);

            let success = false;
            while (!success) {
                try {
                    let htmlDoc = await fetchHTML(nextFivePages);  // Await fetchHTML without a callback

                    let videos = htmlDoc.querySelectorAll(`#${listId} div.item`);

                    getVideoDetailsFromHTML(videos, searchTerms, resultArray);
                    success = true;  // Only set success to true if parsing and extraction succeed

                } catch (error) {
                    console.log("Error fetching HTML:", error);
                    await sleep(5000);  // Retry after delay
                }
            }
        }



        async function videoSearch(userId, query, asyncURL, listId) {
            let searchTerms = await getSearchTerms(query);

            let videosH2 = document.querySelector(`#${listId} .headline h2`);
            let totalVideoPages = getRoundedTotalPages(videosH2);
            let approxTotalVideos = totalVideoPages * 5;
            let timeout = approxTotalVideos > 500 ? approxTotalVideos / 5 : 75;

            if (totalVideoPages === null) {
                console.error("ERROR in totalVideoPages:", totalVideoPages);
                return null;
            }

            let resultArray = [];
            for (let pageInt = 1; pageInt <= totalVideoPages; pageInt++) {
                let percentage = pageInt / totalVideoPages * 100;
                showSearchPercentage(percentage, `#${listId}_pagination`);

                await sleep(timeout); // Proper delay between each request
                await fetchVideosFromPage(userId, pageInt, asyncURL, listId, searchTerms, resultArray);
            }

            return resultArray;
        }






        if (recentlyOnline) {
            h1.textContent += " (online)";
            h1.className = "online";
        }
        userDescription.textContent = userDescription.textContent.trim();

        if (countryCode && countryName !== "no info") {
            country.remove();
            const img = document.createElement('img');
            img.src = `https://flagcdn.com/${countryCode}.svg`;
            img.width = 35;
            img.alt = countryName;
            img.title = countryName;
            img.style.cssText = "position:absolute;top:50%;transform:translateY(-50%);left:4rem;";
            parent.appendChild(img);
            parent.style.position = "relative";
        }

        new MutationObserver(() => {
            addSearchButton('list_videos_uploaded_videos', userVideosAsyncURL);
            addSearchButton('list_videos_favourite_videos', favouriteVideosAsyncURL);

            addListInfo('#list_videos_uploaded_videos .headline h2');
            addListInfo('#list_videos_favourite_videos .headline h2');
            addListInfo('#list_members_friends .headline h2');
        }).observe(document.body, { childList: true, subtree: true });


        if (window.location.href.endsWith("#friends") && !window.location.href.includes("add_to_friends_done")) {
            var userVideoData, lastCumTitle, lastVidCode, lastUserID;
            let addButton = document.querySelector('a[href="#friends"][data-action="add_to_friends"]');
            let textarea = document.getElementById('add_to_friends_message');
            let userId = window.location.href.split('/').slice(-2, -1)[0];
            let confirmButton = document.querySelector('input[name="confirm"]');


            let retrievedData = JSON.parse(localStorage.getItem('last_cum_video_data')) || {};
            if (DEBUG) console.log("uid:", userId, retrievedData[userId])
            if (retrievedData[userId]) {
                userVideoData = retrievedData[userId];
                lastCumTitle = userVideoData.title;
                lastVidCode = userVideoData.videoId;
                lastUserID = userVideoData.userId;
            } else {
                if (DEBUG) console.log("No data found for this user.");
            }


            let pageTitle = document.title;
            let username = pageTitle.replace("'s Page", "");
            if (textarea !== null
                && !addButton.classList.contains('done')
                // && username !== lastAutoFriend
                && lastCumTitle !== null
                && addButton !== null) {

                friend_request_text = friend_request_text.trim();
                friend_request_text += friend_request_text.endsWith(':') ? '' : ':';

                textarea.value = "";
                textarea.value += friend_request_text + " " + lastCumTitle + "\n##" + lastVidCode;

                // addButton.click();
                document.querySelector('input[type="submit"].submit[value="Invite"]').click();  // final submit button
            }


            // console.log(confirmButton)
            // if(confirmButton) confirmButton.click();

            console.log("addButton", addButton)
            if (addButton.classList.contains('done') && history.length === 1) {
                window.close();
            }
            // console.log("Should add?")
        }


        else if (window.location.href.includes("add_to_friends_done")) {
            let addButton = document.querySelector('a[href="#friends"][data-action="add_to_friends"]');
            if (addButton && !addButton.classList.contains('done')) {
                addButton.classList.add('done');
            }
            if (history.length === 1 || !document.hasFocus()) window.close();
        }

        async function ornateCumUser(id) {
            while (document.visibilityState !== 'visible') {
                await sleep(250);
            }
            let userExists = await cumUser(id);
            if (!userExists) return;

            h1.innerHTML += ` <span title="CUM user" style="cursor:default">👑</span>`;
        }
        ornateCumUser(userId);


    }





    function selectionSearch() {
        document.querySelector('.headline h1').addEventListener('mouseup', () => {
            const selection = window.getSelection().toString();
            const searchAnchor = document.querySelector('#searchAnchor');

            if (!selection) return searchAnchor?.remove();

            if (!searchAnchor) {
                const { top, right } = window.getSelection().getRangeAt(0).getBoundingClientRect();
                const anchor = document.createElement('a');
                anchor.id = 'searchAnchor';
                anchor.href = `/search/${encodeURIComponent(selection)}/`;
                // anchor.target = '_blank';
                anchor.style.position = 'absolute';
                anchor.style.top = `${top + selectionSearchTop}px`;
                anchor.style.left = `${right + selectionSearchLeft}px`;
                anchor.innerHTML = '<button>Search</button>';
                document.body.appendChild(anchor);
            }
        });
    }












    if (window.location.href.startsWith("https://www.camwhores.tv/videos/")) {

        if (document.body.textContent.includes('The video you’re trying to view has been taken down in compliance with a DMCA')) return;

        selectionSearch();

        let privateVideoMessage = document.querySelector('body > div.container > div.content > div.block-video > div.video-holder > div.player > div > div > span') ||
            document.querySelector('body > div.container > div.content > div.block-album > div.album-holder > div.images > span.message');
        let uploader = document.querySelector('#tab_video_info > div > div.block-user > div.username > a');
        let uploaderHref = uploader.href;

        let headline = document.querySelector("body > div.container > div.content > div.headline");
        let h1 = headline.querySelector("h1");
        let title = h1.innerText;

        let uploaderId = extractUserId(uploaderHref);
        let alreadySentFriendshipRequest = alreadySentRequest(uploaderId);
        let stringDuration = document.querySelector("#tab_video_info > div > div.info > div:nth-child(1) > span:nth-child(1) > em").textContent.trim();
        let views = document.querySelector("#tab_video_info > div > div.info > div:nth-child(1) > span:nth-child(2) > em").textContent.trim();
        let submitted = document.querySelector("#tab_video_info > div > div.info > div:nth-child(1) > span:nth-child(3) > em").textContent.trim();


        let description = document.querySelector("#tab_video_info > div > div.info > div:nth-child(2) > em")?.textContent.trim() || '';


        let categories = Array.from(document.querySelectorAll("#tab_video_info > div > div.info > div:nth-child(3) a")).map(el => el.innerText.trim()).join(",");
        let tags = Array.from(document.querySelectorAll("#tab_video_info > div > div.info > div:nth-child(4) a")).map(el => el.innerText.trim()).join(",");
        let models = Array.from(document.querySelectorAll("#tab_video_info > div > div.info > div:nth-child(5) a")).map(el => el.innerText.trim()).join(",");
        let rating = document.querySelector("div.video-info > div > div.info-buttons > div.rating-container > div > span.scale-holder > span").getAttribute('data-rating') || null;

        let screenshot = document.querySelector("#tab_screenshots > div.block-screenshots > a:nth-child(1) > img") || document.querySelector("#tab_screenshots > div > span:nth-child(1) > img");
        let screenshotSrc = screenshot?.getAttribute('src');
        let screenshotDataSrc = screenshot?.getAttribute('data-original');
        let screenshotUrl = screenshotSrc?.includes('https') ? screenshotSrc : screenshotDataSrc?.includes('https') ? screenshotDataSrc : null;
        let screenshotId = extractScreenshotId(screenshotUrl);




        let titleReplacements = { '3': 'e', '@': 'a', '1': 'i', '0': 'o', '$': 's', '7': 't', '4': 'a', '5': 's', '6': 'g', '!': 'i' };
        let specialCharReplacements = { 'İ': 'I', 'ı': 'i', 'ş': 's', 'ç': 'c', 'ğ': 'g', 'ö': 'o', 'ü': 'u', 'æ': 'ae', 'œ': 'oe', 'ñ': 'n', 'ß': 'B' };

        // function decodeTitle(title) {
        //     return title.normalize('NFD')
        //         .replace(/[\u0300-\u036f]/g, '')
        //         .replace(/[^\w\s]|[0-9]/g, char => specialCharReplacements[char] || titleReplacements[char] || char)
        //         .replace(/\s+/g, ' ');
        // }
        function decodeTitle(title) {
            const titleReplacements = {
                '@': 'a', '$': 's', '!': 'i', 'Γ': 's'  // Add more replacements as needed
            };

            const specialCharReplacements = {
                'α': 'a', 'β': 'b', 'γ': 'y', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'n', 'θ': 'o', 'ι': 'i', 'κ': 'k',
                'λ': 'a', 'μ': 'u', 'ν': 'v', 'n': 'n', 'ο': 'o', 'π': 'n', 'ρ': 'p', 'σ': 'o', 'τ': 't', 'υ': 'u',
                'φ': 'o', 'χ': 'X', 'ψ': 'u', 'ω': 'w', 'Α': 'A', 'Β': 'B', 'Γ': 'r', 'Δ': 'A', 'Ε': 'E', 'Ζ': 'Z',
                'Η': 'H', 'Θ': 'O', 'Ι': 'I', 'Κ': 'K', 'Λ': 'A', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'E', 'Ο': 'O', 'Π': 'N',
                'Ρ': 'R', 'Σ': 'E', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'O', 'Χ': 'X', 'Ψ': 'Y', 'Ω': 'O', 'ß': 'B', 'ß': 'B'
            };

            return title.replace(/[0-9@!$]/g, char => titleReplacements[char] || char)
                .replace(/[^\w\s]/g, char => specialCharReplacements[char] || char) // Replace special chars
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace('avaion', 'Avalon')
                .replace(/\s+/g, ' ')
            // .toLowerCase();
        }







        let decodedTitle = decodeTitle(title);

        if (decodedTitle !== title) {
            let label = document.createElement('label');
            label.classList.add('switch-label');


            label.innerHTML = `<div class="switch"><input type="checkbox" class="toggle" id="decodeTitle"><span class="slider round"></span></div> Decode title`;
            headline.appendChild(label);

            let toggle = label.querySelector(`#decodeTitle`);
            toggle.addEventListener('change', function () {
                if (this.checked) {
                    h1.innerText = decodedTitle;
                } else {
                    h1.innerText = title;

                }
            });

        }


        if (history.length === 1) {
            let close = document.createElement('button');
            close.innerText = "Close";
            close.style.float = "right";
            close.style.userSelect = "none";
            close.style.cursor = "pointer";
            close.onclick = function () {
                window.close();
            };
            headline.appendChild(close);


        }



        function extractScreenshotId(url) {
            const regex = /(\d+\/\d+)/;
            return url.match(regex)[0];
        }


        sendData({
            video: {
                uploader: uploaderId,
                title: title,
                videoId: extractVideoId(window.location.href),
                duration: timeStringToSeconds(stringDuration),
                views: parseInt(views.replace(/\s+/g, '')),
                submitted: secondsToTimestamp(-1 * convertToSeconds(submitted), false),
                description: description,
                categories: categories || null,
                tags: tags || null,
                models: models || null,
                rating: +parseFloat(rating).toFixed(4) || null,
                thumbnail: screenshotId
            }
        });


        if (privateVideoMessage) {
            fetch(uploaderHref)
                .then(response => response.text())
                .then(html => {
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const infoMsg = doc.querySelector('.info-message');
                    const headline = document.querySelector('body > div.container > div.content > div.headline > h1');
                    const isFriends = infoMsg?.textContent.includes("is in your friends list.");
                    const isPending = window.location.href.includes("please_check_friend");

                    if (isFriends) {
                        privateVideoMessage.textContent = "You're already friends! Reloading in 4 seconds";
                        setTimeout(() => location.reload(), 4000);
                    } else if (isPending) {
                        privateVideoMessage.innerHTML += "<br><br>Friendship confirmed? Reloading in 4 seconds";
                        setTimeout(() => location.reload(), 4000);
                    } else if (!!headline) {
                        if (alreadySentFriendshipRequest && history.length === 1 && !document.hasFocus()) {
                            window.close();
                            return;
                        }

                        if (!alreadySentFriendshipRequest && autoFriendshipRequest && (history.length === 1 || !document.hasFocus())) {
                            window.location.href = `${privateVideoMessage.querySelector('a').href}#friends`;
                            return;
                        }

                        friendRequestSetup(headline.textContent.trim(), window.location.href, uploaderId);
                        let alreadySentString = alreadySentFriendshipRequest ? ` (Already sent)` : ``;
                        privateVideoMessage.innerHTML += `<br><a class="button" href="${privateVideoMessage.querySelector('a').href}#friends" style="display:inline-block;">Send request${alreadySentString}</a>`;

                    }
                    let blockedSS = document.querySelectorAll('.block-screenshots .item.private');
                    blockedSS.forEach(ss => {
                        const img = ss.querySelector('img');
                        if (img) {
                            let fullImg = img.dataset.original.replace('/videos_screenshots/', '/videos_sources/').replace('/180x135/', '/screenshots/');
                            img.src = fullImg;
                            img.style.width = "auto";
                            ss.replaceWith(Object.assign(document.createElement('a'), {
                                innerHTML: ss.innerHTML,
                                href: fullImg,
                                className: 'item',
                                rel: 'screenshots',
                                'data-fancybox-type': 'image'
                            }));
                        }
                    });
                })
                .catch(console.error);
        }



        function waitForElementExists(parent, selector) {
            return new Promise(resolve => {
                new MutationObserver((_, observer) => {
                    const el = parent.querySelector(selector);
                    if (el) {
                        resolve(el);
                        observer.disconnect();
                    }
                }).observe(parent, { childList: true, subtree: true });
            });
        }

        function addDownloadLink(video) {
            if (document.getElementById('downloadVideoLink')) return;
            const url = video.getAttribute('src');
            const name = `${document.querySelector('.headline').innerText}.mp4`;
            document.querySelector('div.video-holder > div.video-info > div > div.info-buttons > div.tabs-menu > ul')
                .insertAdjacentHTML('afterbegin', `<li><a id="downloadVideoLink" class="toggle-button" href="${url}" download="${name}">Download</a></li>`);
        }

        waitForElementExists(document.body, 'video').then(addDownloadLink).catch(console.error);

        function addTimestampsToVideo(timestamps) {
            var tabScreenshots = document.getElementById('tab_screenshots');
            var timestampsDiv = document.getElementById('timestamps');
            if (timestampsDiv) return;
            // Check if #tab_screenshots exists

            // Check if #timestamps exists inside #tab_screenshots
            timestampsDiv = document.createElement('div');
            timestampsDiv.id = 'timestamps';
            timestampsDiv.style = 'display:flex;gap:0.2rem;align-items:center;justify-content:center;margin-top:.5rem;';
            tabScreenshots.appendChild(timestampsDiv);


            timestamps.forEach(function (timestamp, index) {
                var formattedTimestamp = formatTimeFromSeconds(timestamp);

                // Create button for timestampsDiv
                var button1 = document.createElement('button');
                button1.textContent = formattedTimestamp;
                button1.classList.add('btn');
                button1.addEventListener('click', function () {
                    flowplayer().seek(timestamp);
                });
                timestampsDiv.appendChild(button1);

                var screenshotLinks = document.querySelectorAll('.block-screenshots a[rel="screenshots"]');
                if (screenshotLinks[index]) {
                    var button2 = document.createElement('button');
                    button2.textContent = formattedTimestamp;
                    button2.style.position = 'absolute';
                    button2.classList.add('btn');
                    button2.addEventListener('click', function () {
                        event.preventDefault();
                        event.stopPropagation();
                        flowplayer().seek(timestamp);
                        if (DEBUG) console.log("Going to", formattedTimestamp);
                    });
                    screenshotLinks[index].style.position = 'relative';
                    screenshotLinks[index].appendChild(button2);
                }
            });



        }
        function waitForVideoDuration(intervalMs) {
            const percentages = [25, 40, 59.75, 79];
            const firstTimestamp = 14;

            function checkDuration() {
                const player = typeof flowplayer === 'function' ? flowplayer() : null;

                if (player && player.video && typeof player.video.duration === 'number') {
                    flowplayer().seek("4");

                    const videoDuration = player.video.duration;

                    const calculatedPercentages = percentages.map(percent => (percent / 100) * videoDuration);

                    // console.log("Video Duration:", videoDuration);
                    // console.log("Calculated Percentages:", calculatedPercentages);

                    const timestamps = [firstTimestamp, ...calculatedPercentages];
                    addTimestampsToVideo(timestamps);

                } else {
                    setTimeout(checkDuration, intervalMs);
                }
            }

            checkDuration();
        }


        // Helper function to format time from seconds to mm:ss
        function formatTimeFromSeconds(seconds) {
            var date = new Date(null);
            date.setSeconds(seconds);
            return date.toISOString().substr(14, 5);
        }

        waitForVideoDuration(500);

        document.addEventListener('visibilitychange', function () {
            if (document.getElementById('tab_screenshots')) return;
            if (document.visibilityState === 'visible') {
                if (DEBUG) console.log("retrying timestamps")
                waitForVideoDuration(500);
            }
        });



        async function videoDoubleClickFullscreen() {
            await waitForPageLoad();
            if (!document.querySelector('#kt_player')) return;
            document.querySelector('#kt_player').addEventListener('dblclick', function (event) {
                flowplayer().fullscreen()
            });
        }
        videoDoubleClickFullscreen()

    }

    if (window.location.href.startsWith("https://www.camwhores.tv/playlists/") && window.location.href !== "https://www.camwhores.tv/playlists/") {
        const h1Element = document.querySelector('h1');
        const playlistItem = document.querySelector('#playlist_view_playlist_view_items a');
        h1Element.textContent = playlistItem.querySelector('.title').textContent.trim();

        h1Element.parentElement.insertAdjacentHTML('beforeend', `<a class="button" style="padding: 5px 5px 0 5px;" href="${playlistItem.href}">Open video</a>`);

        document.addEventListener('click', e => {
            const clickedItem = e.target.closest('#playlist_view_playlist_view_items a');
            if (clickedItem) {
                h1Element.textContent = clickedItem.querySelector('.title').textContent.trim();
                document.querySelector('.button').href = clickedItem.href;
            }
        });
    }

    if (window.location.href.startsWith("https://www.camwhores.tv/edit-video/")) {
        document.querySelector('.section-title.expand[data-expand-id="tab_screenshots"]').click();
        document.querySelectorAll("#tab_screenshots > div > div:nth-child(-n+5) > div.item-control > div.item-control-holder").forEach(el =>
            el.addEventListener('click', () => {
                document.querySelector('input.submit[value="Save"]').click();
                if (history.length === 1) window.close();
            })
        );
    }

    if (window.location.href === "https://www.camwhores.tv/my/") {
        const profileCSS = document.createElement('style');
        profileCSS.className = "profile-css";
        profileCSS.textContent = `
        #edit_profile_about_me{height:225px;}
        strong.popup-title,span.selection [role="combobox"]{display:none;}
        body > div.fancybox-overlay.fancybox-overlay-fixed > div{top:0 !important;height:100svh !important;}
        body > div.fancybox-overlay.fancybox-overlay-fixed,body > div.fancybox-overlay.fancybox-overlay-fixed > *{box-sizing:border-box;}
        div.fancybox-inner{height:100% !important;width:max-content !important;}
        .fancybox-close{top:9px !important;}
    `;
        document.head.appendChild(profileCSS);
    }

    if (window.location.href === "https://www.camwhores.tv/" || window.location.href === "https://www.camwhores.tv") {
        const listVideos = document.querySelector("body > div.container > div.list_videos > div");
        const headline = document.querySelector("body > div.container > div.content > div.main-content > div.headline");
        const latestVideoUpSeconds = convertToSeconds(document.querySelector("#list_videos_featured_videos_items div.added").innerText);
        const latestStoredUpSeconds = parseInt(localStorage.getItem("cum_last_featuredVideoUpDate"));
        const showFeaturedVids = retrieveValueFromStorage("options")["cum_show_top"];
        const thereIsANewerVideo = latestVideoUpSeconds < latestStoredUpSeconds;

        const hideFtVideos = show => {
            listVideos.style.display = show ? 'block' : 'none';
            headline.style.paddingTop = show ? '20px' : '10px';
            if (!show) localStorage.setItem("cum_last_featuredVideoUpDate", latestVideoUpSeconds);
            document.querySelector("#🆕")?.style.setProperty("display", "none");
        };

        hideFtVideos(showFeaturedVids);

        document.querySelector("body > div.container > div.list_videos").insertAdjacentHTML('afterbegin', `
      <label class="switch" title="Top videos" id="cum_switch_top">
        <input type="checkbox" id="cum_show_top" ${showFeaturedVids ? 'checked' : ''}>
        <span class="slider round"></span>
      </label>
    `);

        document.querySelector('#cum_show_top').addEventListener('change', function () {
            hideFtVideos(this.checked);
            saveArraySettings("options", "cum_show_top", this.checked);
        });

        if (!showFeaturedVids && thereIsANewerVideo) {
            document.querySelector("body > div.container > div.list_videos").insertAdjacentHTML('beforeend', `
            <span id="🆕" style="font-size:1.5rem;vertical-align:middle;"> 🆕</span>
        `);
        }
    }


    function extractVideoId(url) {
        if (!url) return console.error("url:", url)
        const parts = url.split('/');
        return parts[4] + '/' + parts[5].replace(/\/$/, '');
    }

    function currentSearchTerm(param = 'search') {
        const pathSegment = window.location.pathname.split(`/${param}/`)[1]?.split('/')[0].trim();
        if (!pathSegment) return null;

        return param === 'tags'
            ? pathSegment.replace(/-/g, '_').toLowerCase()
            : pathSegment.replace(/%20|-/g, ' ').replace(/\s+/g, ' ').toLowerCase();
    }



    function extractLatestVideoId(dom = document) {
        let latestVid = dom.querySelector("#list_videos_videos_list_search_result_items > div > a");
        if (!latestVid) return null;
        return extractVideoId(latestVid.href)
    }


    function updateLatestVideo(searchTerm = null, videoId = extractLatestVideoId()) {
        if (!searchTerm) searchTerm = currentSearchTerm();
        if (!searchTerm) return;

        if (DEBUG) console.log("updateLatestVideo. searchTerm:", searchTerm, "videoId:", videoId);

        let data = {
            timestamp: Date.now(),
            id: videoId
        };

        return saveArraySettings("auto_search", searchTerm, data);
    }
    function removeFromWishlist(searchTerm) {
        let newWishlistVideos = loadArrayLocalStorage('newWishlistVideos');
        let updatedWishlist = newWishlistVideos.filter(video => video.query !== searchTerm);
        if (updatedWishlist.length !== newWishlistVideos.length) saveArrayLocalStorage('newWishlistVideos', updatedWishlist);
    }

    function addDeleteFromWishlistBtn(searchTerm, addToWishListBtn) {
        let deleteFromWishList = document.createElement('button');
        deleteFromWishList.textContent = 'Remove';
        deleteFromWishList.id = 'deleteFromWishList';
        deleteFromWishList.classList.add('btn');
        deleteFromWishList.style = "transform:translate(5px, 3px);margin-left:5px;"
        deleteFromWishList.addEventListener('click', () => {

            (async () => {
                const mainKey = "auto_search";
                const entryKey = searchTerm;

                await removeEntryFromStorage(mainKey, entryKey);

                // let updatedValue = await GM.getValue(mainKey);
                // console.log("Updated value:", updatedValue);
            })();


            deleteFromWishList.textContent = 'Done';
            deleteFromWishList.disabled = true;
            addToWishListBtn.textContent = 'Add to Wish List';
            addToWishListBtn.disabled = false;
            deleteFromWishList.remove()


        });
        document.querySelector('#add-to-wish-list')?.insertAdjacentElement('afterend', deleteFromWishList); //
    }


    if (window.location.pathname.startsWith('/tags/')) {
        let tag = currentSearchTerm('tags');
        let addToWishListBtn = document.querySelector('search-tag');

        if (!addToWishListBtn) {
            addToWishListBtn = document.createElement('button');
            addToWishListBtn.textContent = 'Search tag';
            addToWishListBtn.id = 'search-tag';
            addToWishListBtn.classList.add('btn');
            addToWishListBtn.style = "transform:translate(5px, 3px);cursor:pointer"
            addToWishListBtn.addEventListener('click', () => {
                updateLatestVideo();

                window.location.href = `/search/${tag}/`
                addToWishListBtn.disabled = true;
            });

            document.querySelector('h1')?.insertAdjacentElement('afterend', addToWishListBtn);
        }
    }

    if (window.location.pathname.startsWith('/search/')) {
        let searchTerm = currentSearchTerm();
        let addToWishListBtn = document.createElement('button');
        addToWishListBtn.textContent = 'Add to Wish List';
        addToWishListBtn.id = 'add-to-wish-list';
        addToWishListBtn.classList.add('btn');
        addToWishListBtn.style = "transform:translate(5px, 3px);cursor:pointer"
        addToWishListBtn.addEventListener('click', () => {
            updateLatestVideo();

            addToWishListBtn.textContent = 'Done!';
            addToWishListBtn.disabled = true;
            addDeleteFromWishlistBtn(searchTerm, addToWishListBtn);
            // console.log("did we add?")

        });

        document.querySelector('h1')?.insertAdjacentElement('afterend', addToWishListBtn);

        let searchInStorage = retrieveValueFromStorage("auto_search")[searchTerm];
        if (searchInStorage) {
            updateLatestVideo()
            addToWishListBtn.disabled = true;

            addDeleteFromWishlistBtn(searchTerm, addToWishListBtn);
        }

        removeFromWishlist(searchTerm)




    }

    let searchBox = document.querySelector(`div.search`);
    if (!!searchBox) {

        let cumSearchDiv = document.createElement('div');
        cumSearchDiv.id = 'CUM_search_bg';
        cumSearchDiv.onclick = closeCUMdialog;
        document.body.appendChild(cumSearchDiv);

        searchBox.innerHTML += `<label class="switch-label">
        <div class="switch">
          <input type="checkbox" id="cum_search_checkbox">
          <span class="slider round"></span>
          </div> CUM search</label>`;


        let cumSearch = document.querySelector('#cum_search_checkbox');
        let searchForm = document.querySelector('#search_form');
        let searchButton = searchForm.querySelector('.search-button');

        searchButton.addEventListener('click', () => {
            // console.log(cumSearch.checked, )
            event.preventDefault();
            let textInput = searchForm.querySelector('input[name="q"]');
            let inputValue = textInput.value.trim();
            if (cumSearch.checked) {
                buildCUMSearch(inputValue);
            } else {
                window.location.href = `/search/${inputValue}/`
            }
        });

        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            let textInput = searchForm.querySelector('input[name="q"]');
            let inputValue = textInput.value.trim();
            if (cumSearch.checked) {
                buildCUMSearch(inputValue);
            } else {
                window.location.href = `/search/${inputValue}/`
            }
        });

        // buildCUMSearch()
        async function buildCUMSearch(query = '', page = 1) {
            // console.log("searching:",query)
            cumSearchDiv.style.opacity = '1';
            cumSearchDiv.style.pointerEvents = 'revert';
            document.querySelector('body').style.overflow = 'hidden'
            document.querySelector('html').style.overflow = 'hidden'
            // console.log(cumSearchDiv)


            let searchURL = `${DB_URL}/search.php?q=${query}&p=${page}`;
            // console.log(searchURL)
            let content = await fetchHTML(searchURL);
            // console.log(content)
            content = content.querySelector('#cum_search_results');
            cumSearchDiv.innerHTML = content.outerHTML;

            let box = document.querySelector('#cum_search_results .box');
            box.innerHTML += `<div id="close_cum_search" class="fancybox-item fancybox-close" style="position:absolute;top:-10px;right:-10px;scale:1.25;"></div>`;
            box.style.position = 'relative';
            box.style.overflow = 'visible';

            document.querySelectorAll('a[data-action="cum-search"]').forEach(function (element) {
                element.addEventListener('click', function (event) {
                    event.preventDefault();
                    const page = this.getAttribute('data-page') || 1;
                    const query = this.getAttribute('data-query') || '';
                    buildCUMSearch(query, page);
                    document.getElementById('cum_search_results').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            });
            document.querySelector('#close_cum_search').addEventListener('click', function (event) {
                closeCUMSearch();
            });

            VM.shortcut.register('right', () => {
                document.querySelector("#list_videos_uploaded_videos_pagination > div > ul > li.next > a")?.click();
            });
            VM.shortcut.register('left', () => {
                document.querySelector("#list_videos_uploaded_videos_pagination > div > ul > li.prev > a")?.click();
            });
            VM.shortcut.register('esc', () => {
                closeCUMSearch();
            });

            let totalVideos = await fetchHTML(`${DB_URL}/scripts/total-videos.php`);
            let totalVideosInt = parseInt(totalVideos.body.textContent);
            let previousTotal = parseInt(localStorage.getItem('previousTotalVideos')) || 0;
            let difference = totalVideosInt - previousTotal;
            localStorage.setItem('previousTotalVideos', totalVideosInt);
            let newStuff = difference > 0 ? `(+${difference})` : '';
            document.querySelector('#cum_search_results').insertAdjacentHTML('beforeend', `<div style="margin-top:.5rem">Serving a total of ${totalVideosInt} indexed videos ${newStuff}</div>`);


        }


        function closeCUMSearch() {
            let bg = document.querySelector('#CUM_search_bg');
            if (!bg) return;
            bg.style.opacity = 0;
            bg.style.pointerEvents = 'none';
            document.querySelector('body').style.overflow = 'auto';
            document.querySelector('html').style.overflow = 'auto';


        }












        GM_addStyle(`
.block-video .playlist .pagination .first, .block-video .playlist .pagination .last, .block-video .playlist .pagination .page, .block-video .playlist .pagination .jump{
  display:block}
#CUM_search_bg{
  box-sizing: border-box;
  height: 100lvh;
  width: 100%;
  padding:2rem 5rem 5rem;
  background: hsla(0, 0%, 0%, 20%);
  backdrop-filter: blur(20px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 1s;
  position:absolute;
  top:0;left:0;
  z-index:11;
  overflow-y: auto;
}


    div.search label{
      user-select: none;
      cursor: pointer;
      display: inline-block;
      padding:.25rem;
      margin-left:-.25rem;
      font-size:inherit;
      transition: color .5s;
    }
div.search label input[type="checkbox"]{
      vertical-align: text-top;
      accent-color:#f56c08;
  margin-right:.1rem;

}
div.search label:has(input[type="checkbox"]:not(:checked)){
  color: hsl(36.52deg 10.04% 55.1%);
}
    div.search label:hover,
    div.search label:has(label input[type="checkbox"]:hover),
    div.search label:hover:has(input[type="checkbox"]:not(:checked)){
      color: hsl(36.52deg 50% 80.1%);


    }
`)

    }


    async function autoSearch(query, videoId) {
        return new Promise((resolve) => {
            fetchAndParseHTML(`${baseUrl}/search/${encodeURIComponent(query)}/`, function (htmlDoc) {
                let extractedVideoId = extractLatestVideoId(htmlDoc);

                updateLatestVideo(query, extractedVideoId);
                resolve(extractedVideoId);

            });
        });
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForPageLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }


    async function processAutoSearches() {
        const LOCK_KEY = "autoSearchLock";
        const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

        const now = Date.now();
        const lock = JSON.parse(localStorage.getItem(LOCK_KEY));

        if (lock && (now - lock.timestamp) < LOCK_DURATION) return; // Another tab is processing

        localStorage.setItem(LOCK_KEY, JSON.stringify({ timestamp: now })); // Acquire lock

        const autoSearches = retrieveValueFromStorage("auto_search");
        let newWishlistVideos = loadArrayLocalStorage('newWishlistVideos');

        for (const query in autoSearches) {
            const { timestamp, id } = autoSearches[query];
            if ((now - timestamp) / (1000 * 60) <= backgroundChecksMinutes) continue;

            const newVideoId = await autoSearch(query, id);
            if (newVideoId === id) continue;

            const index = newWishlistVideos.findIndex(video => video.query === query);
            const videoEntry = { query, videoId: newVideoId, timestamp: now };

            if (index !== -1) {
                newWishlistVideos[index] = videoEntry;
            } else {
                newWishlistVideos.push(videoEntry);
            }

            saveArrayLocalStorage('newWishlistVideos', newWishlistVideos);
            if (DEBUG) console.log(`%cNew video found for ${query}`, 'color: #b7e892;');
            lateralAutoSearches();
            newWishedVideo = true;
            newVideoIndicator(newWishedVideo);
            await sleep(1000);
        }

        localStorage.removeItem(LOCK_KEY); // Release lock
    }




    processAutoSearches();
    lateralAutoSearches();
    newVideoIndicator(newWishedVideo);

    function newVideoIndicator(presence) {
        const container = document.querySelector('.cum_nav .trigger');
        if (!container) return;
        const id = 'new-video-indicator';
        const indicator = document.getElementById(id);
        presence && !indicator ? container.insertAdjacentHTML('beforeend', `<span id="${id}" style="font-size:1.5rem">🆕</span>`) :
            !presence && indicator && indicator.remove();
    }


    function lateralAutoSearches() {
        document.querySelector('.cum_nav')?.remove()
        let newWishlistVideos = loadArrayLocalStorage('newWishlistVideos');
        if (isArrayEmpty(newWishlistVideos)) return;

        let navHtml = `
        <div class="cum_nav">
            <ul class="list-items">
                ${newWishlistVideos.map(video => {
            let text = video.query;
            let truncatedText = text.length > 100 ? text.slice(0, 100) + '…' : text;
            let title = secondsToString(secondsSinceTimestamp(video.timestamp));
            return `<li><a href="/search/${video.query}/" title="${title}">${truncatedText}</a></li>`;
        }).join('')}
              </ul>
            <button title="Click to pin me!" class="trigger">WISH LIST</button>
        </div>`;

        let mostRecentTimestamp = Math.max(...newWishlistVideos.map(video => video.timestamp));
        let autoSearchMenuAge = parseInt(localStorage.getItem('cum_auto_search_menu_age'), 10);
        document.body.insertAdjacentHTML('afterbegin', navHtml);

        if (mostRecentTimestamp > autoSearchMenuAge) {
            newWishedVideo = true;

            newVideoIndicator(newWishedVideo);
        }







        document.querySelector('.trigger').onclick = function () {
            document.querySelector('.cum_nav').classList.toggle('show');
            document.querySelector('.list-items').classList.toggle('show');
            localStorage.setItem('cum_auto_search_menu_age', Date.now());

        };




        GM_addStyle(`
:root{
  --cum-nav-w: 6.5rem;
  --cum-nav-h: 3rem;
  --cum-border-r: .5rem;
}
.trigger {
    color: #ffffff;
    font-family: system-ui, Arial;
    font-weight: 500;
    border: none;
    background: rgba(0, 0, 0, 0.5);
    width: var(--cum-nav-w);
    height: var(--cum-nav-h);
    display: flex;
    cursor: pointer;
    transition: background 0.3s;
    border-radius: var(--cum-border-r) 0 0 var(--cum-border-r);
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
}
.trigger:hover{
  color: #0BB3E2;
}

.cum_nav {
  opacity:.7;
  box-sizing: border-box;
  list-style: none;
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%) ;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.list-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(200%);
  transition: transform 0.3s ease;
  position: relative;
  text-align:center;
  gap:1px;
}
.list-items li a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-decoration: none; /* Optional: Remove underline */
  padding: .5rem;
  text-transform: uppercase;
  word-break: break-word;

}
.list-items li {
  background: rgba(0, 0, 0, 0.5);
  width: var(--cum-nav-w);
  height: var(--cum-nav-h);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  font-family: system-ui;
    font-weight: 500;

}
.list-items li:first-child {
  border-radius: var(--cum-border-r) 0 0 0;

}
.list-items li:last-child {
  border-radius: 0 0 0 var(--cum-border-r);

}


.cum_nav.show {
  transform: translateY(-50%) translateX(-50%);
  opacity:1;
}

.cum_nav:not(.show):hover {
  transform: translateY(-50%) translateX(-50%);
  opacity:1;
}

div[style="text-align:center;font-size:15px;margin:10px auto; padding: 10px;"]{
  display: none;
}


p:has(a[href="https://war.ukraine.ua/support-ukraine/"]) {
  display: none;
}

`);
    }




    function myVideosAsyncURL(pageInt) {
        return `https://www.camwhores.tv/my/videos/?mode=async&function=get_block&block_id=list_videos_my_uploaded_videos&sort_by=&from_my_videos=${pageInt}&_=${Date.now()}`;
    }

    function pagesLastProcessedVideo(page, callback) {
        fetchAndParseHTML(myVideosAsyncURL(page), doc => {
            const items = doc.querySelectorAll("#list_videos_my_uploaded_videos_items > form > div.item.private");
            const idx = Array.from(items).reverse().findIndex(item => item.classList.contains('processing'));

            const checkbox = items[items.length - 1 - idx]?.querySelector(".item-control-holder .toggle-button input[type='checkbox']");
            callback(checkbox ? checkbox.value : false);
        });
    }

    async function lastProcessedVideoID(callback) {
        let found = false;
        const promises = Array.from({ length: 3 }, (_, page) =>
            new Promise(resolve => pagesLastProcessedVideo(page + 1, value => {
                if (value) found = true;
                resolve(value);
            }))
        );

        const results = await Promise.all(promises);
        callback(results.find(value => value) || false);
    }

    function loadLastVideoData() {
        return JSON.parse(localStorage.getItem('lastVideoData') || '[]') || [null, null];
    }

    function lastVideoDataAge(refreshMinutes = 30) {
        const [, timestamp] = loadLastVideoData();
        return timestamp ? secondsSinceTimestamp(timestamp) : refreshMinutes * 60 + 1;
    }

    function saveLastVideoID(callback) {
        lastProcessedVideoID(currentID => {
            localStorage.setItem('lastVideoData', JSON.stringify([currentID, Date.now()]));
            callback(loadLastVideoData()[0], currentID);
            if (DEBUG) console.log(`Last ID: ${loadLastVideoData()[0]}\nCurrent ID: ${currentID} (https://www.camwhores.tv/edit-video/${currentID}/)`);
        });
    }

    function alertNewVideo(newID) {
        if (confirm("A new video of yours has been published.\nGo to My Videos?")) {
            window.location.href = "/my/videos/";
        }
    }

    function updateLastVideoData(minutes = backgroundChecksMinutes) {
        const waitTime = minutes * 60;
        const ageOfCheck = lastVideoDataAge(backgroundChecksMinutes);
        if (ageOfCheck <= waitTime) return

        saveLastVideoID((lastID, newID) => {
            if (newID && lastID && lastID !== newID) {
                alertNewVideo(newID);
            } else {
                if (DEBUG) console.log("No new videos were published");
            }
        });

    }




    advancedOptions["notifyProcessedVideos"] && updateLastVideoData(backgroundChecksMinutes);


    function contryCodesArray() { return { "Andorra": "ad", "United Arab Emirates": "ae", "Afghanistan": "af", "Antigua and Barbuda": "ag", "Anguilla": "ai", "Albania": "al", "Armenia": "am", "Angola": "ao", "Antarctica": "aq", "Argentina": "ar", "American Samoa": "as", "Austria": "at", "Australia": "au", "Aruba": "aw", "Åland Islands": "ax", "Azerbaijan": "az", "Bosnia and Herzegovina": "ba", "Barbados": "bb", "Bangladesh": "bd", "Belgium": "be", "Burkina Faso": "bf", "Bulgaria": "bg", "Bahrain": "bh", "Burundi": "bi", "Benin": "bj", "Saint Barthélemy": "bl", "Bermuda": "bm", "Brunei": "bn", "Bolivia": "bo", "Caribbean Netherlands": "bq", "Brazil": "br", "Bahamas": "bs", "Bhutan": "bt", "Bouvet Island": "bv", "Botswana": "bw", "Belarus": "by", "Belize": "bz", "Canada": "ca", "Cocos (Keeling) Islands": "cc", "DR Congo": "cd", "Central African Republic": "cf", "Republic of the Congo": "cg", "Switzerland": "ch", "Côte d'Ivoire (Ivory Coast)": "ci", "Cook Islands": "ck", "Chile": "cl", "Cameroon": "cm", "China": "cn", "Colombia": "co", "Costa Rica": "cr", "Cuba": "cu", "Cape Verde": "cv", "Curaçao": "cw", "Christmas Island": "cx", "Cyprus": "cy", "Czechia": "cz", "Germany": "de", "Djibouti": "dj", "Denmark": "dk", "Dominica": "dm", "Dominican Republic": "do", "Algeria": "dz", "Ecuador": "ec", "Estonia": "ee", "Egypt": "eg", "Western Sahara": "eh", "Eritrea": "er", "Spain": "es", "Ethiopia": "et", "European Union": "eu", "Finland": "fi", "Fiji": "fj", "Falkland Islands": "fk", "Micronesia": "fm", "Faroe Islands": "fo", "France": "fr", "Gabon": "ga", "United Kingdom": "gb", "England": "gb-eng", "Northern Ireland": "gb-nir", "Scotland": "gb-sct", "Wales": "gb-wls", "Grenada": "gd", "Georgia": "ge", "French Guiana": "gf", "Guernsey": "gg", "Ghana": "gh", "Gibraltar": "gi", "Greenland": "gl", "Gambia": "gm", "Guinea": "gn", "Guadeloupe": "gp", "Equatorial Guinea": "gq", "Greece": "gr", "South Georgia": "gs", "Guatemala": "gt", "Guam": "gu", "Guinea-Bissau": "gw", "Guyana": "gy", "Hong Kong": "hk", "Heard Island and McDonald Islands": "hm", "Honduras": "hn", "Croatia": "hr", "Haiti": "ht", "Hungary": "hu", "Indonesia": "id", "Ireland": "ie", "Israel": "il", "Isle of Man": "im", "India": "in", "British Indian Ocean Territory": "io", "Iraq": "iq", "Iran": "ir", "Iceland": "is", "Italy": "it", "Jersey": "je", "Jamaica": "jm", "Jordan": "jo", "Japan": "jp", "Kenya": "ke", "Kyrgyzstan": "kg", "Cambodia": "kh", "Kiribati": "ki", "Comoros": "km", "Saint Kitts and Nevis": "kn", "North Korea": "kp", "Korea, Republic of": "kr", "Kuwait": "kw", "Cayman Islands": "ky", "Kazakhstan": "kz", "Laos": "la", "Lebanon": "lb", "Saint Lucia": "lc", "Liechtenstein": "li", "Sri Lanka": "lk", "Liberia": "lr", "Lesotho": "ls", "Lithuania": "lt", "Luxembourg": "lu", "Latvia": "lv", "Libya": "ly", "Morocco": "ma", "Monaco": "mc", "Moldova": "md", "Montenegro": "me", "Saint Martin": "mf", "Madagascar": "mg", "Marshall Islands": "mh", "North Macedonia": "mk", "Mali": "ml", "Myanmar": "mm", "Mongolia": "mn", "Macau": "mo", "Northern Mariana Islands": "mp", "Martinique": "mq", "Mauritania": "mr", "Montserrat": "ms", "Malta": "mt", "Mauritius": "mu", "Maldives": "mv", "Malawi": "mw", "Mexico": "mx", "Malaysia": "my", "Mozambique": "mz", "Namibia": "na", "New Caledonia": "nc", "Niger": "ne", "Norfolk Island": "nf", "Nigeria": "ng", "Nicaragua": "ni", "Netherlands": "nl", "Norway": "no", "Nepal": "np", "Nauru": "nr", "Niue": "nu", "New Zealand": "nz", "Oman": "om", "Panama": "pa", "Peru": "pe", "French Polynesia": "pf", "Papua New Guinea": "pg", "Philippines": "ph", "Pakistan": "pk", "Poland": "pl", "Saint Pierre and Miquelon": "pm", "Pitcairn Islands": "pn", "Puerto Rico": "pr", "Palestine": "ps", "Portugal": "pt", "Palau": "pw", "Paraguay": "py", "Qatar": "qa", "Réunion": "re", "Romania": "ro", "Serbia": "rs", "Russian Federation": "ru", "Rwanda": "rw", "Saudi Arabia": "sa", "Solomon Islands": "sb", "Seychelles": "sc", "Sudan": "sd", "Sweden": "se", "Singapore": "sg", "Saint Helena, Ascension and Tristan da Cunha": "sh", "Slovenia": "si", "Svalbard and Jan Mayen": "sj", "Slovakia": "sk", "Sierra Leone": "sl", "San Marino": "sm", "Senegal": "sn", "Somalia": "so", "Suriname": "sr", "South Sudan": "ss", "São Tomé and Príncipe": "st", "El Salvador": "sv", "Sint Maarten": "sx", "Syria": "sy", "Eswatini (Swaziland)": "sz", "Turks and Caicos Islands": "tc", "Chad": "td", "French Southern and Antarctic Lands": "tf", "Togo": "tg", "Thailand": "th", "Tajikistan": "tj", "Tokelau": "tk", "Timor-Leste": "tl", "Turkmenistan": "tm", "Tunisia": "tn", "Tonga": "to", "Turkey": "tr", "Trinidad and Tobago": "tt", "Tuvalu": "tv", "Taiwan": "tw", "Tanzania": "tz", "Ukraine": "ua", "Uganda": "ug", "United States Minor Outlying Islands": "um", "United Nations": "un", "United States": "us", "Uruguay": "uy", "Uzbekistan": "uz", "Holy See (Vatican City State)": "va", "Saint Vincent and the Grenadines": "vc", "Venezuela": "ve", "Virgin Islands, British": "vg", "United States Virgin Islands": "vi", "Vietnam": "vn", "Vanuatu": "vu", "Wallis and Futuna": "wf", "Samoa": "ws", "Kosovo": "xk", "Yemen": "ye", "Mayotte": "yt", "South Africa": "za", "Zambia": "zm", "Zimbabwe": "zw" } }

    async function updateAlert() {
        const lastCheck = await retrieveValueFromStorage('lastVersionCheckDate');
        const lastVersionCheckDate = lastCheck ? new Date(lastCheck) : currentDate;
        if (currentDate - lastVersionCheckDate < 7 * 24 * 60 * 60 * 1000) return;

        await saveValue('lastVersionCheckDate', currentDate.toString());
        const htmlDoc = await fetchHTML(metaPage);
        const metaContent = htmlDoc.body.textContent;
        const metaVersionMatch = metaContent.match(/@version\s+([^\s]+)/);
        if (!metaVersionMatch) return;
        const latestVersion = metaVersionMatch[1];
        // console.log(latestVersion)
        if (latestVersion !== scriptData.version) {
            if (confirm('A new version of the CUM userscript is available.\nPlease allow automatic updates or update it manually.\nOpen in new tab?')) {
                GM_openInTab("https://sleazyfork.org/en/scripts/491272-camwhores-tv-utilities-mod");
            }
        }


    }

    advancedOptions['updateReminders'] && updateAlert();



    advancedOptions["blurImages"] &&
        GM_addStyle(`
        img:not(.smileys-bar img),div.logo a{
            filter: blur(20px);
            transition: filter 0s;
        }
        img:not(.smileys-bar img):hover,div.logo:hover a{
            filter: blur(0px);
            transition: filter .3s;
        }

        a.avatar{
            overflow:hidden;
        }


    `);




})();
