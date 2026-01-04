// ==UserScript==
// @name         Unlimited MAL Ignore list
// @namespace    http://tampermonkey.net/
// @version      0.89
// @description  Ignore an unlimited amount of users. Comes with custom settings: delete the entire post, replace the content of the message with a custom message, replace or delete the avatar, and keep or delete the signature.
// @author       Only_Brad
// @author       ShaggyZE
// @match        https://myanimelist.net/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/374971/Unlimited%20MAL%20Ignore%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/374971/Unlimited%20MAL%20Ignore%20list.meta.js
// ==/UserScript==

(function() {
    const FORUM_OPTIONS = "editprofile.php?go=forumoptions";
    const POSTS_URL = "forum/?topicid";
    const LAST_POST_URL = "forum";
    const TOPICS_URL = "forum/?board";
    const TOPICS_SEARCH_URL = "forum/search?";
    const CLUB_TOPICS_URL_1 = "clubs.php";
    const CLUB_TOPICS_URL_2 = "forum/?clubid";
    const PROFILE_URL = "profile";
    const COMTOCOM_URL = "comtocom.php";
    const COMMENTS_URL = "comments.php";
    const BLACKLIST_URL = "https://myanimelist.net/blacklist";

    const BLACKLIST_KEY = "ignore-list";
    const SETTINGS_KEY = "ignore-list-settings";

    const YOU_SELECTOR = ".header-profile-link";
    const POST_USERS_SELECTOR = ".profile";
    const TOPIC_USERS_SELECTOR = ".forum_postusername a";
    const MESSAGE_SELECTOR = ".content [id^=message]";
    const QUOTE_SELECTOR = ".quotetext";
    const AVATAR_SELECTOR = ".forum-icon";
    const USER_PROFILE_SELECTOR = "[href^='/profile']";
    const USER_INFO_SELECTOR = "[id^=messageuser]";
    const USERINFO_SELECTOR = ".username";
    const USERINFO_SELECTOR1 = ".userstatus";
    const USERINFO_SELECTOR2 = ".userinfo.joined";
    const USERINFO_SELECTOR3 = ".userinfo.posts";
    const USERINFO_SELECTOR4 = ".custom-forum-title";
    const USERINFO_SELECTOR5 = ".modified";
    const USERINFO_SELECTOR6 = ".icon-team-title";
    const SIGNATURE_SELECTOR = ".sig";
    const FORUM_MESSAGE_SELECTOR = "[id^=msg]";
    const FORUM_MSG_NAME_SELECTOR = ".username a";
    const LAST_POST_LIST_CONTAINER_SELECTOR = "li.clearfix";
    const LAST_POST_LIST_USER_SELECTOR = "span.date a[href*='/profile/']";
    const LAST_POST_LIST_AVATAR_SELECTOR = LAST_POST_LIST_CONTAINER_SELECTOR + " > a[href*='/profile/']";
    const LAST_POST_TABLE_CONTAINER_SELECTOR = "td.forum_boardrow1[align='right'][width='130']";
    const LAST_POST_TABLE_USER_SELECTOR = "a[href*='/profile/']";
    const FORUM_QUOTE_NAME_SELECTOR = ".quotetext > strong > a";
    const FORUM_REPLY_NAME_SELECTOR = ".js-replyto-target";
    const REPLIED_CONTAINER_SELECTOR = ".replied.show";
    const FORUM_ACTION_BAR_SELECTOR = "[id^=postEditButtons]";
    const PROFILE_MSG_SELECTOR = "[id^=comBox]";
    const PROFILE_MSG_NAME_SELECTOR = ".text a.fw-b";
    const PROFILE_MSG_AVATAR_SELECTOR = ".image";
    const PROFILE_MSG_TEXT_SELECTOR = ".text .comment-text";
    const PROFILE_MSG_ACTION_BAR_SELECTOR = ".text > div.pb8 > a";
    const COMTOCOM_SELECTOR = "[id^=comBox]";
    const COMTOCOM_NAME_SELECTOR = ".dark_text a";
    const COMTOCOM_AVATAR_SELECTOR = ".picSurround a";
    const COMTOCOM_TEXT_SELECTOR = "[id^=comtext]";
    const COMTOCOM_ACTION_BAR_SELECTOR = ".dark_text a";

    const IGNORE = 0;
    const REPLACE = 1;
    const DO_NOTHING = 2;

    let blacklist;
    let settings;

    const MIGRATION_COMPLETE_KEY = 'ignore-list-migration-complete';

    const defaultSettings = {
        replaceUsername: false,
        replaceAvatar: true,
        replaceProfileAvatar: false,
        removeSignatures: true,
        removeUserinfo: true,
        lastpostMode: REPLACE,
        quoteMode: IGNORE,
        replyMode: IGNORE,
        postMode: REPLACE,
        profileMsgMode: IGNORE,
        removeTopics: true,
        UnBlacklistUsername: false,
        removeUnBlacklist: false,
        customLastPost: "removed-user",
        customQuote: "",
        customReply: "",
        customPost: "",
        customAvatar: "",
        customProfileMsg: "",
        customProfileAvatar: "",
        specificCustomLastPost: {},
        specificCustomQuote: {},
        specificCustomReply: {},
        specificCustomPost: {},
        specificCustomProfileMsg: {}
    };

    GM_registerMenuCommand("Backup Settings to localStorage", backupToLocalStorage);

    //routing
    if (window.location.href.includes(FORUM_OPTIONS)) {
        AddBlacklistLink();
    } else if (window.location.href.includes(POSTS_URL)) {
        handlePosts();
        handleQuotes();
        handleReplies();
    } else if (
        window.location.href.includes(TOPICS_URL) ||
        window.location.href.includes(TOPICS_SEARCH_URL) ||
        window.location.href.includes(CLUB_TOPICS_URL_1) ||
        window.location.href.includes(CLUB_TOPICS_URL_2)
    ) {
        handleTopics();
        handleLastPost();
    } else if (window.location.href.includes(PROFILE_URL)) {
        handleProfileMsgs();
    } else if (window.location.href.includes(COMTOCOM_URL)) {
        handleComToCom();
    } else if (window.location.href.includes(COMMENTS_URL)) {
        handleComToCom();
    } else if (window.location.href === BLACKLIST_URL) {
        handleBlacklist();
    } else if (window.location.href.includes(LAST_POST_URL)) {
        handleLastPost();
        if (settings.replaceAvatar) replaceAvatar();
    }

    //GM_addStyle equivalent that works on firefox
    function addStyle(css) {
        const style = document.getElementById("addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        style.innerHTML += css;
    }

    // --- Function to create a temporary message box ---
    function showTemporaryMessage(message, duration = 3000) {
        // Remove any existing message boxes first
        const existingMessageBox = document.getElementById('gm_backup_message');
        if (existingMessageBox) {
            existingMessageBox.remove();
        }

        // Create the message box element
        const messageBox = document.createElement('div');
        messageBox.id = 'gm_backup_message';
        messageBox.textContent = message;
        messageBox.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background-color: #4CAF50; /* Green background */
            color: white;
            border-radius: 5px;
            z-index: 10000; /* High z-index to be on top */
            opacity: 0.9;
            font-family: sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // Append to the body
        document.body.appendChild(messageBox);

        // Remove the message box after the specified duration
        setTimeout(() => {
            messageBox.remove();
        }, duration);
    }


    // --- Function to perform the backup to localStorage ---
    function backupToLocalStorage() {
        try {
            // Retrieve the current data from GM_setValue
            // Use the default values in case GM_getValue returns null, although
            // if your script is running, settings/blacklist should be populated.
            // Retrieving directly from GM_getValue ensures we get the saved state,
            // not just the current in-memory state if it hasn't been saved yet.
            const currentSettingsJson = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
            const currentBlacklistJson = GM_getValue(BLACKLIST_KEY, '[]');

            // Save the data to localStorage
            localStorage.setItem(SETTINGS_KEY, currentSettingsJson);
            localStorage.setItem(BLACKLIST_KEY, currentBlacklistJson);

            console.log('Settings and Blacklist backed up to localStorage.');
            showTemporaryMessage('Backup to localStorage complete!');

        } catch (e) {
            console.error('Error during backup to localStorage:', e);
            showTemporaryMessage('Backup failed!', 5000); // Show error message longer
        }
    }

    // loadBlackList function now handles migration for BOTH blacklist and settings
    function loadBlackList() {
        const isMigrationComplete = GM_getValue(MIGRATION_COMPLETE_KEY, false);
        let loadedBlacklist; // Temporary variable for blacklist data
        let loadedSettings; // Temporary variable for settings data

        if (!isMigrationComplete) {
            // Migration not complete, check localStorage for BOTH keys
            const localStorageBlacklist = localStorage.getItem(BLACKLIST_KEY);
            const localStorageSettings = localStorage.getItem(SETTINGS_KEY);

            if (localStorageBlacklist !== null || localStorageSettings !== null) {
                // Data found in localStorage for at least one item, attempt migration
                console.log('localStorage data found, attempting migration for both blacklist and settings to GM_setValue...');

                // --- Handle Blacklist Migration ---
                if (localStorageBlacklist !== null) {
                    try {
                        loadedBlacklist = JSON.parse(localStorageBlacklist);
                         // Ensure it's an array before saving
                        if (!Array.isArray(loadedBlacklist)) {
                            console.warn('localStorage blacklist is not an array, resetting to empty array.');
                            loadedBlacklist = [];
                        }
                        GM_setValue(BLACKLIST_KEY, JSON.stringify(loadedBlacklist));
                        console.log('Blacklist migrated from localStorage.');
                    } catch (e) {
                        console.error('Error parsing localStorage blacklist during migration.', e);
                        // On error, load from GM_setValue instead for this run
                        const gmBlacklist = GM_getValue(BLACKLIST_KEY, '[]');
                        loadedBlacklist = JSON.parse(gmBlacklist);
                        console.log('Blacklist loaded from GM_setValue due to localStorage parse error.');
                    }
                } else {
                     // No blacklist in localStorage, load from GM_setValue
                     const gmBlacklist = GM_getValue(BLACKLIST_KEY, '[]');
                     loadedBlacklist = JSON.parse(gmBlacklist);
                     // Ensure it's an array even if loading from GM failed initially
                    if (!Array.isArray(loadedBlacklist)) {
                        console.warn('Blacklist loaded from GM_setValue is not an array, resetting to empty array.');
                        loadedBlacklist = [];
                    }
                     console.log('Blacklist not found in localStorage, loaded from GM_setValue.');
                }

                // --- Handle Settings Migration ---
                if (localStorageSettings !== null) {
                    try {
                        loadedSettings = JSON.parse(localStorageSettings);
                        GM_setValue(SETTINGS_KEY, JSON.stringify(loadedSettings));
                        console.log('Settings migrated from localStorage.');
                    } catch (e) {
                        console.error('Error parsing localStorage settings during migration.', e);
                        // On error, load from GM_setValue instead for this run
                        const gmSettings = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
                        loadedSettings = JSON.parse(gmSettings);
                         console.log('Settings loaded from GM_setValue due to localStorage parse error.');
                    }
                } else {
                     // No settings in localStorage, load from GM_setValue
                     const gmSettings = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
                     loadedSettings = JSON.parse(gmSettings);
                     console.log('Settings not found in localStorage, loaded from GM_setValue.');
                }

                // *** Set the migration complete flag in GM_setValue AFTER attempting both migrations ***
                GM_setValue(MIGRATION_COMPLETE_KEY, true);
                console.log('Migration to GM_setValue marked as complete.');

            } else {
                // No data found in localStorage for either key, perform standard load from GM_setValue
                console.log('No localStorage data found for migration. Loading both from GM_setValue...');
                const gmBlacklist = GM_getValue(BLACKLIST_KEY, '[]');
                loadedBlacklist = JSON.parse(gmBlacklist);
                 // Ensure blacklist is an array
                if (!Array.isArray(loadedBlacklist)) {
                    console.warn('Blacklist loaded from GM_setValue is not an array, resetting to empty array.');
                    loadedBlacklist = [];
                    GM_setValue(BLACKLIST_KEY, '[]'); // Save the corrected default
                }

                const gmSettings = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
                loadedSettings = JSON.parse(gmSettings);
            }

        } else {
            // Migration is complete, load BOTH directly from GM_setValue
            console.log('Migration complete. Loading blacklist and settings directly from GM_setValue...');
            const gmBlacklist = GM_getValue(BLACKLIST_KEY, '[]');
            loadedBlacklist = JSON.parse(gmBlacklist);
             // Ensure blacklist is an array
            if (!Array.isArray(loadedBlacklist)) {
                console.warn('Blacklist loaded from GM_setValue is not an array, resetting to empty array.');
                loadedBlacklist = [];
                GM_setValue(BLACKLIST_KEY, '[]'); // Save the corrected default
            }

            const gmSettings = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
            loadedSettings = JSON.parse(gmSettings);
        }

        // Assign the loaded data to the script's variables after the entire loading process
        blacklist = loadedBlacklist;
        settings = loadedSettings;


        // Ensure nested objects and missing properties exist for settings
        // This handles cases where loaded data might be from an older version or parsed poorly
        let settingsChangedAfterLoad = false;
         if (!settings.specificCustomLastPost) { settings.specificCustomLastPost = {}; settingsChangedAfterLoad = true; }
        if (!settings.specificCustomQuote) { settings.specificCustomQuote = {}; settingsChangedAfterLoad = true; }
        if (!settings.specificCustomReply) { settings.specificCustomReply = {}; settingsChangedAfterLoad = true; }
        if (!settings.specificCustomPost) { settings.specificCustomPost = {}; settingsChangedAfterLoad = true; }
        if (!settings.specificCustomProfileMsg) { settings.specificCustomProfileMsg = {}; settingsChangedAfterLoad = true; }

         for (const key in defaultSettings) {
            if (Object.prototype.hasOwnProperty.call(defaultSettings, key)) {
                if (typeof defaultSettings[key] === 'object' && defaultSettings[key] !== null && !Array.isArray(defaultSettings[key])) {
                     continue; // Skip specificCustom objects
                }
                if (settings[key] === undefined) {
                    settings[key] = defaultSettings[key];
                    settingsChangedAfterLoad = true;
                    console.log(`Settings: Added missing key "${key}" with default value after load.`);
                }
            }
        }

         // Save the potentially updated settings back to GM_setValue if defaults were added
        if (settingsChangedAfterLoad) {
            GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
            console.log('Settings updated with missing defaults and saved to GM_setValue.');
        }

        // Note: The migration complete flag is handled earlier in this function.
        // Blacklist is assigned directly above and doesn't need a separate save for defaults
        // unless it failed parsing and was reset to []. That save happens inside the checks.
    }

    // loadSettings function now only loads from GM_setValue
    function loadSettings() {
         // In this revised approach, loadBlackList handles the initial loading
         // and migration for both settings and blacklist on the first run.
         // loadSettings should now assume that initial loading has occurred (or will
         // occur via loadBlackList if loadSettings is somehow called first on a fresh run).
         // It simply loads the current state of settings from GM_setValue.

        console.log('Loading settings from GM_setValue...');
        const gmSettings = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
        settings = JSON.parse(gmSettings);

        // Ensure nested objects and missing properties exist for settings
        let settingsChanged = false;
         if (!settings.specificCustomLastPost) { settings.specificCustomLastPost = {}; settingsChanged = true; }
        if (!settings.specificCustomQuote) { settings.specificCustomQuote = {}; settingsChanged = true; }
        if (!settings.specificCustomReply) { settings.specificCustomReply = {}; settingsChanged = true; }
        if (!settings.specificCustomPost) { settings.specificCustomPost = {}; settingsChanged = true; }
        if (!settings.specificCustomProfileMsg) { settings.specificCustomProfileMsg = {}; settingsChanged = true; }

         for (const key in defaultSettings) {
            if (Object.prototype.hasOwnProperty.call(defaultSettings, key)) {
                if (typeof defaultSettings[key] === 'object' && defaultSettings[key] !== null && !Array.isArray(defaultSettings[key])) {
                     continue;
                }
                if (settings[key] === undefined) {
                    settings[key] = defaultSettings[key];
                    settingsChanged = true;
                    console.log(`Settings: Added missing key "${key}" with default value.`);
                }
            }
        }

        // Save the potentially updated settings back to GM_setValue if defaults were added
        if (settingsChanged) {
            GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
            console.log('Settings updated with missing defaults and saved to GM_setValue.');
        }
    }


    // saveBlackList remains the same, always saving to GM_setValue
    function saveBlackList() {
        GM_setValue(BLACKLIST_KEY, JSON.stringify(blacklist));
    }

    // saveSetting remains the same, always saving to GM_setValue
    function saveSetting(key, value) {
        // Update the in-memory settings object first
        if (typeof key === "object") {
            if (settings[key.key] && typeof settings[key.key] === 'object') {
                 settings[key.key][key.subkey] = value;
            } else {
                 console.error(`Attempted to set subkey on non-object settings property: ${key.key}`);
            }
        } else {
            settings[key] = value;
        }
        // Save the entire updated settings object to GM_setValue
        GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
    }
    function AddBlacklistLink() {
        //wip
    }

    //functions called by the routers
    function handlePosts() {
        loadBlackList();
        loadSettings();
        addPostsBlackListButtons();

        switch (settings.postMode) {
            case IGNORE:
                ignorePosts();
                return;
            case REPLACE:
                replacePosts();
                break;
            case DO_NOTHING:
                break;
            default:
                saveSetting("postMode", REPLACE);
                replacePosts();
                break;
        }


        if (settings.replaceAvatar) replaceAvatar();
        if (settings.removeSignatures) removeSignatures();
        if (settings.removeUserinfo) removeUserinfo();
        if (settings.replaceUsername) replaceUsername();
    }

    function handleLastPost() {
        loadBlackList();
        loadSettings();

        switch (settings.lastpostMode) {
            case IGNORE:
                ignoreLastPost();
                return;
            case REPLACE:
                replaceLastPost();
                break;
            case DO_NOTHING:
                break;
            default:
                saveSetting("lastpostMode", IGNORE);
                ignoreLastPost();
                break;
        }
    }

    function handleQuotes() {
        loadBlackList();
        loadSettings();

        switch (settings.quoteMode) {
            case IGNORE:
                ignoreQuotes();
                return;
            case REPLACE:
                replaceQuotes();
                break;
            case DO_NOTHING:
                break;
            default:
                saveSetting("quoteMode", IGNORE);
                ignoreQuotes();
                break;
        }
    }

    function handleReplies() {
        loadBlackList();
        loadSettings();

        switch (settings.replyMode) {
            case IGNORE:
                ignoreReplies();
                return;
            case REPLACE:
                replaceReplies();
                break;
            case DO_NOTHING:
                break;
            default:
                saveSetting("replyMode", IGNORE);
                ignoreReplies();
                break;
        }
    }

    function handleTopics() {
        loadBlackList();
        loadSettings();
        if (settings.removeTopics) {
            ignoreTopics();
        }
    }

    function handleProfileMsgs() {
        loadBlackList();
        loadSettings();
        addProfileMsgBlackListButtons();

        switch (settings.profileMsgMode) {
            case IGNORE:
                ignoreProfileMsgs();
                return;
            case REPLACE:
                replaceProfileMsg();
                break;
            case DO_NOTHING:
                break;
            default:
                saveSetting("profileMsgMode", IGNORE);
                ignoreProfileMsgs();
                break;
        }

        if (settings.replaceProfileAvatar) replaceProfileAvatar();
    }

    function handleComToCom() {
        loadBlackList();
        loadSettings();
        addComToComBlackListButtons();

        switch (settings.profileMsgMode) {
            case IGNORE:
                ignoreComToCom();
                return;
            case REPLACE:
                replaceComToCom();
                break;
            case DO_NOTHING:
                break;
            default:
                saveSetting("profileMsgMode", IGNORE);
                ignoreComToCom();
                break;
        }

        if (settings.replaceProfileAvatar) replaceComToComAvatar();
    }

    function handleBlacklist() {
        loadBlackList();
        loadSettings();

        document.title = "Blacklist - MyAnimeList.net";

        //remove the 404 stuff
        document.querySelector("h1").textContent = "Ignore List";
        document.querySelector(".error404").remove();

        //CSS
        addStyle(".flex{display:flex;gap:20px;margin-top:10px;}.user{display:flex;margin:10px}.name{margin-right:20px}.name{border-bottom:solid #000 1px}.name[contenteditable]{min-width:100px;border-bottom:solid #000 1px}.name[contenteditable]:focus{border:none;outline:solid red 5px}.page-common #content{display:flex;justify-content:center;}.settings{display:flex;gap:25px;}.settings>*{padding: 25px;}.customPost{width:100% !important;}.select-users{font-size:1rem;padding:10px;font-weight:bold;}");

        //HTML for the blacklist
        document.getElementById("content").innerHTML =
            `<div data-blacklist class="black-list"></div>
        <div data-add-user class="add-user">
            <div data-user class="user">
                <div data-name class="name" contenteditable="true" onclick="this.focus()"></div>
                <button data-add class="add">Add</div>
            </div>
        </div>`

        //HTML for the settings
        const settings = document.createElement("div");
        settings.innerHTML = `
            <h2>Settings</h2>
            <form>
                <div class="settings">
                    <div class="posts">
                        <h3>Posts</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="posts" id="doNothingPosts" data-clickable-setting="doNothingPosts">
                            <label class="form-check-label" for="doNothingPosts">
                                Do nothing
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="posts" id="hidePosts" data-clickable-setting="hidePosts">
                            <label class="form-check-label" for="hidePosts">
                                Hide posts
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="posts" id="replacePosts" data-clickable-setting="replacePosts">
                            <label class="form-check-label" for="replacePosts">
                                Replace posts with a custom message
                            </label>
                        </div>
                        <textarea class="form-control customPost" name="customPost" id="customPost" data-text-setting="customPost"></textarea>
                    </div>
                    <div class="posts-extra">
                        <h3>Posts extra options</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="replaceUsername" id="replaceUsername" data-clickable-setting="replaceUsername">
                            <label class="form-check-label" for="replaceUsername">
                                Replace user name with a custom name
                            </label>
                            <input class="form-control" type="text" name="customUsername" id="customUsername" data-text-setting="customUsername" placeholder="removed-user">
                            <br>
                            <small>Leave it empty to remove the username</small>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="replaceAvatar" id="replaceAvatar" data-clickable-setting="replaceAvatar">
                            <label class="form-check-label" for="replaceAvatar">
                                Replace avatars with a custom avatar
                            </label>
                            <input class="form-control" type="text" name="customAvatar" id="customAvatar" data-text-setting="customAvatar">
                            <br>
                            <small>Leave it empty to remove the avatar</small>
                        </div>
                        <div class="form-check" style="margin-top: 10px;">
                            <input class="form-check-input" type="checkbox" name="removeSignatures" id="removeSignatures" data-clickable-setting="removeSignatures">
                            <label class="form-check-label" for="removeSignatures">
                                Hide the signature
                            </label>
                        </div>
                        <div class="form-check" style="margin-top: 10px;">
                            <input class="form-check-input" type="checkbox" name="removeUserinfo" id="removeUserinfo" data-clickable-setting="removeUserinfo">
                            <label class="form-check-label" for="removeUserinfo">
                                Hide user info
                            </label>
                        </div>
                        <small style="margin-top: 20px; display: block;"><strong>These settings have no effect if the Posts setting is set to "Hide Posts"</strong></small>
                    </div>
                    <div class="quotes">
                        <h3>Quotes</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="quotes" id="doNothingQuotes" data-clickable-setting="doNothingQuotes">
                            <label class="form-check-label" for="doNothingQuotes">
                                Do nothing
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="quotes" id="hideQuotes" data-clickable-setting="hideQuotes">
                            <label class="form-check-label" for="hideQuotes">
                                Hide quotes
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="quotes" id="replaceQuotes" data-clickable-setting="replaceQuotes">
                            <label class="form-check-label" for="replaceQuotes">
                                Replace quotes with a custom message
                            </label>
                        </div>
                        <textarea class="form-control customPost" name="customQuote" id="customQuote" data-text-setting="customQuote"></textarea>
                    </div>
                    <div class="replies">
                        <h3>Replies</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="replies" id="doNothingReplies" data-clickable-setting="doNothingReplies">
                            <label class="form-check-label" for="doNothingReplies">
                                Do nothing
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="replies" id="hideReplies" data-clickable-setting="hideReplies">
                            <label class="form-check-label" for="hideReplies">
                                Hide replies
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="replies" id="replaceReplies" data-clickable-setting="replaceReplies">
                            <label class="form-check-label" for="replaceReplies">
                                Replace replies with a custom message
                            </label>
                        </div>
                        <textarea class="form-control customPost" name="customReply" id="customReply" data-text-setting="customReply"></textarea>
                    </div>
                </div>
                <div class="settings">
                    <div class="topics">
                        <h3>Topics</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="removeTopics" id="removeTopics" data-clickable-setting="removeTopics">
                            <label class="form-check-label" for="removeTopics">
                                Hide user created topics
                            </label>
                        </div>
                    </div>
                    <div class="lastpost">
                        <h3>Last Post</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="lastpost" id="doNothingLastPost" data-clickable-setting="doNothingLastPost">
                            <label class="form-check-label" for="doNothingLastPost">
                                Do nothing
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="lastpost" id="hideLastPost" data-clickable-setting="hideLastPost">
                            <label class="form-check-label" for="hideLastPost">
                                Hide last posts
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="lastpost" id="replaceLastPost" data-clickable-setting="replaceLastPost">
                            <label class="form-check-label" for="replaceLastPost">
                                Replace user name with a custom name
                            </label>
                            <br>
                            <input class="form-control" type="text" name="customLastPost" id="customLastPost" data-text-setting="customLastPost" placeholder="removed-user">
                            <br>
                            <small>Leave it empty to remove the username</small>
                        </div>
                    </div>
                </div>
                <div class="settings">
                    <div class="profile-messages">
                        <h3>Profile messages</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="profileMsgs" id="doNothingProfileMsgs" data-clickable-setting="doNothingProfileMsgs">
                            <label class="form-check-label" for="doNothingProfileMsgs">
                                Do nothing
                            </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="profileMsgs" id="hideProfileMsgs" data-clickable-setting="hideProfileMsgs">
                        <label class="form-check-label" for="hideProfileMsgs">
                            Hide profile messages
                        </label>
                    </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="profileMsgs" id="replaceProfileMsgs" data-clickable-setting="replaceProfileMsgs">
                            <label class="form-check-label" for="replaceProfileMsgs">
                                Replace profile messages with a custom message
                            </label>
                        </div>
                        <textarea class="form-control customPost" name="customProfileMsg" id="customProfileMsg" data-text-setting="customProfileMsg"></textarea>
                    </div>
                    <div class="profile-messages-extra">
                        <h3>Profile messages extra options</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="replaceProfileUsername" id="replaceProfileUsername" data-clickable-setting="replaceProfileUsername">
                            <label class="form-check-label" for="replaceProfileUsername">
                                Replace profile user with a custom name
                            </label>
                            <br>
                            <input class="form-control" type="text" name="customProfileUsername" id="customProfileUsername" data-text-setting="customProfileUsername" placeholder="removed-user">
                            <br>
                            <small>Leave it empty to remove the avatar</small>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="replaceProfileAvatar" id="replaceProfileAvatar" data-clickable-setting="replaceProfileAvatar">
                            <label class="form-check-label" for="replaceProfileAvatar">
                                Replace profile message avatar with a custom avatar
                            </label>
                            <br>
                            <input class="form-control" type="text" name="customProfileAvatar" id="customProfileAvatar" data-text-setting="customProfileAvatar">
                            <br>
                            <small>Leave it empty to remove the avatar</small>
                        </div>
                        <small style="margin-top: 20px; display: block;"><strong>These settings have no effect if the Profile Messages setting is set to "Hide profile messages"</strong></small>
                    </div>
                    <div class="unblacklist">
                        <h3>UnBlacklist</h3>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="UnBlacklistUsername" id="UnBlacklistUsername" data-clickable-setting="UnBlacklistUsername">
                            <label class="form-check-label" for="UnBlacklistUsername">
                                Show user name when hovering<br>on UnBlacklist buttons/links
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="removeUnBlacklist" id="removeUnBlacklist" data-clickable-setting="removeUnBlacklist">
                            <label class="form-check-label" for="removeUnBlacklist">
                                Hide UnBlacklist buttons/links
                            </label>
                        </div>
                        <small style="margin-top: 20px; display: block;"><strong>These settings have no effect if the Posts setting<br>is set to "Hide Posts" or Profile Messages setting<br>is set to "Hide profile messages"</strong></small>
                    </div>
                </div>
                <select name="users" class="select-users" data-select-users></select>
                <div class="flex">
                    <div class="form-check">
                        <label class="form-check-label" for="specificCustomPost">
                            Replace this user's posts with a specific custom message
                        </label>
                        <textarea class="form-control customPost" name="specificCustomPost" id="specificCustomPost" data-text-setting="specificCustomPost"></textarea>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" for="specificCustomLastPost">
                            Replace the last posts username with a specific custom message
                        </label>
                        <textarea class="form-control customPost" name="specificCustomLastPost" id="specificCustomLastPost" data-text-setting="specificCustomLastPost" placeholder="type a user name like removed-user"></textarea>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" for="specificCustomProfileMsg">
                            Replace this user's profile messages with a custom message
                        </label>
                        <textarea class="form-control customPost" name="specificCustomProfileMsg" id="specificCustomProfileMsg" data-text-setting="specificCustomProfileMsg"></textarea>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" for="specificCustomQuote">
                            Replace this user's quotes with a specific custom message
                        </label>
                        <textarea class="form-control customPost" name="specificCustomQuote" id="specificCustomQuote" data-text-setting="specificCustomQuote"></textarea>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" for="specificCustomReply">
                            Replace this user's replies with a specific custom message
                        </label>
                        <textarea class="form-control customPost" name="specificCustomReply" id="specificCustomReply" data-text-setting="specificCustomReply"></textarea>
                    </div>
                </div>
            </form>`;

        document.getElementById("content").insertAdjacentElement("afterend", settings);

        startEventListeners();
        loadSettingsIntoInputs();
    }

    function clickedSetting(e) {
        const input = e.target;
        switch (input.dataset.clickableSetting) {
             case "doNothingLastPost":
                saveSetting("lastpostMode", DO_NOTHING);
                break;
            case "hideLastPost":
                saveSetting("lastpostMode", IGNORE);
                break;
            case "replaceLastPost":
                saveSetting("lastpostMode", REPLACE);
                break;
            case "doNothingQuotes":
                saveSetting("quoteMode", DO_NOTHING);
                break;
            case "hideQuotes":
                saveSetting("quoteMode", IGNORE);
                break;
            case "replaceQuotes":
                saveSetting("quoteMode", REPLACE);
                break;
            case "doNothingReplies":
                saveSetting("replyMode", DO_NOTHING);
                break;
            case "hideReplies":
                saveSetting("replyMode", IGNORE);
                break;
            case "replaceReplies":
                saveSetting("replyMode", REPLACE);
                break;
            case "doNothingPosts":
                saveSetting("postMode", DO_NOTHING);
                break;
            case "hidePosts":
                saveSetting("postMode", IGNORE);
                break;
            case "replacePosts":
                saveSetting("postMode", REPLACE);
                break;
            case "replaceUsername":
                saveSetting("replaceUsername", input.checked);
                break;
            case "replaceAvatar":
                saveSetting("replaceAvatar", input.checked);
                break;
            case "removeTopics":
                saveSetting("removeTopics", input.checked);
                break;
            case "UnBlacklistUsername":
                saveSetting("UnBlacklistUsername", input.checked);
                break;
            case "removeUnBlacklist":
                saveSetting("removeUnBlacklist", input.checked);
                break;
            case "removeSignatures":
                saveSetting("removeSignatures", input.checked);
                break;
            case "removeUserinfo":
                saveSetting("removeUserinfo", input.checked);
                break;
            case "doNothingProfileMsgs":
                saveSetting("profileMsgMode", DO_NOTHING);
                break;
            case "hideProfileMsgs":
                saveSetting("profileMsgMode", IGNORE);
                break;
            case "replaceProfileMsgs":
                saveSetting("profileMsgMode", REPLACE);
                break;
            case "replaceProfileAvatar":
                saveSetting("replaceProfileAvatar", input.checked);
                break;
            default:
                return;
        }
    }

    function textSetting(e) {
        const input = e.target;
        switch (input.dataset.textSetting) {
              case "customLastPost":
                saveSetting("customLastPost", input.value);
                break;
             case "customQuote":
                saveSetting("customQuote", input.value);
                break;
             case "customReply":
                saveSetting("customReply", input.value);
                break;
            case "customPost":
                saveSetting("customPost", input.value);
                break;
            case "customUsername":
                saveSetting("customUsername", input.value);
                break;
            case "customAvatar":
                saveSetting("customAvatar", input.value);
                break;
            case "customProfileMsg":
                saveSetting("customProfileMsg", input.value);
                break;
            case "customProfileAvatar":
                saveSetting("customProfileAvatar", input.value);
                break;
            case "specificCustomProfileMsg":
                {
                    const selectedUser = document.querySelector("[data-select-users]").value;
                    saveSetting({ key: "specificCustomProfileMsg", subkey: selectedUser }, input.value);
                    break;
                }
            case "specificCustomPost":
                {
                    const selectedUser = document.querySelector("[data-select-users]").value;
                    saveSetting({ key: "specificCustomPost", subkey: selectedUser }, input.value);
                    break;
                }
            case "specificCustomQuote":
                {
                    const selectedUser = document.querySelector("[data-select-users]").value;
                    saveSetting({ key: "specificCustomQuote", subkey: selectedUser }, input.value);
                    break;
                }
            case "specificCustomReply":
                {
                    const selectedUser = document.querySelector("[data-select-users]").value;
                    saveSetting({ key: "specificCustomReply", subkey: selectedUser }, input.value);
                    break;
                }
            case "specificCustomLastPost":
                {
                    const selectedUser = document.querySelector("[data-select-users]").value;
                    saveSetting({ key: "specificCustomLastPost", subkey: selectedUser }, input.value);
                    break;
                }
            default:
                return;
        }
    }

    function startEventListeners() {
        document.querySelector("[data-add]").addEventListener("click", addNode);
        document.querySelectorAll("[data-clickable-setting]").forEach(clickable => {
            clickable.addEventListener("click", clickedSetting);
        });
        document.querySelectorAll("[data-text-setting]").forEach(text => {
            text.addEventListener("input", textSetting);
        });
        document.querySelector("[data-select-users]").addEventListener("change", loadSpecificMessages)
        blacklist.forEach(createNode);
        blacklist.forEach(addUserToSelect);
    }

    function loadSettingsIntoInputs() {
        switch (settings.lastpostMode) {
            case DO_NOTHING:
                document.getElementById("doNothingLastPost").checked = true;
                break;
            case IGNORE:
                document.getElementById("hideLastPost").checked = true;
                break;
            case REPLACE:
                document.getElementById("replaceLastPost").checked = true;
                break;
            default:
                document.getElementById("hideLastPost").checked = true;
                saveSetting("lastpostMode", IGNORE);
                break;
        }

        switch (settings.quoteMode) {
            case DO_NOTHING:
                document.getElementById("doNothingQuotes").checked = true;
                break;
            case IGNORE:
                document.getElementById("hideQuotes").checked = true;
                break;
            case REPLACE:
                document.getElementById("replaceQuotes").checked = true;
                break;
            default:
                document.getElementById("hideQuotes").checked = true;
                saveSetting("quoteMode", IGNORE);
                break;
        }

        switch (settings.replyMode) {
            case DO_NOTHING:
                document.getElementById("doNothingReplies").checked = true;
                break;
            case IGNORE:
                document.getElementById("hideReplies").checked = true;
                break;
            case REPLACE:
                document.getElementById("replaceReplies").checked = true;
                break;
            default:
                document.getElementById("hideReplies").checked = true;
                saveSetting("replyMode", IGNORE);
                break;
        }

        switch (settings.postMode) {
            case DO_NOTHING:
                document.getElementById("doNothingPosts").checked = true;
                break;
            case IGNORE:
                document.getElementById("hidePosts").checked = true;
                break;
            case REPLACE:
                document.getElementById("replacePosts").checked = true;
                break;
            default:
                document.getElementById("hidePosts").checked = true;
                saveSetting("postMode", IGNORE);
                break;
        }

        switch (settings.profileMsgMode) {
            case DO_NOTHING:
                document.getElementById("doNothingProfileMsgs").checked = true;
                break;
            case IGNORE:
                document.getElementById("hideProfileMsgs").checked = true;
                break;
            case REPLACE:
                document.getElementById("replaceProfileMsgs").checked = true;
                break;
            default:
                document.getElementById("hideProfileMsgs").checked = true;
                saveSetting("profileMsgMode", IGNORE);
                break;
        }

        if (settings.removeTopics) {
            document.getElementById("removeTopics").checked = true;
        }
        if (settings.UnBlacklistUsername) {
            document.getElementById("UnBlacklistUsername").checked = true;
        }
        if (settings.removeUnBlacklist) {
            document.getElementById("removeUnBlacklist").checked = true;
        }
        if (settings.removeSignatures) {
            document.getElementById("removeSignatures").checked = true;
        }
        if (settings.removeUserinfo) {
            document.getElementById("removeUserinfo").checked = true;
        }
        if (settings.replaceUsername) {
            document.getElementById("replaceUsername").checked = true;
        }
        if (settings.replaceAvatar) {
            document.getElementById("replaceAvatar").checked = true;
        }
        if (settings.replaceProfileAvatar) {
            document.getElementById("replaceProfileAvatar").checked = true;
        }

        document.getElementById("customLastPost").value = settings.customLastPost || "";
        document.getElementById("customQuote").value = settings.customQuote || "";
        document.getElementById("customReply").value = settings.customReply || "";
        document.getElementById("customPost").value = settings.customPost || "";
        document.getElementById("customUsername").value = settings.customUsername || "";
        document.getElementById("customAvatar").value = settings.customAvatar || "";
        document.getElementById("customProfileMsg").value = settings.customProfileMsg || "";
        document.getElementById("customProfileAvatar").value = settings.customProfileAvatar || "";

        document.querySelector("[data-select-users]").dispatchEvent(new Event("change"));
    }

    function alterLastPost(action) {
        const listItems = document.querySelectorAll(LAST_POST_LIST_CONTAINER_SELECTOR);
        const tableCells = document.querySelectorAll(LAST_POST_TABLE_CONTAINER_SELECTOR);
        const allLastPostElements = [...listItems, ...tableCells];
        allLastPostElements.forEach((item, index) => {
            let usernameElement = null;
            let user = null;
            if (item.matches(LAST_POST_LIST_CONTAINER_SELECTOR)) {
                usernameElement = item.querySelector(LAST_POST_LIST_USER_SELECTOR);
            } else if (item.matches(LAST_POST_TABLE_CONTAINER_SELECTOR)) {
                usernameElement = item.querySelector(LAST_POST_TABLE_USER_SELECTOR);
            } else {
                return;
            }
            if (!usernameElement) return;
            user = usernameElement.textContent.trim();
            if (!blacklist.includes(user)) return;
            action(item, user, usernameElement);
        });
    }

    function alterQuotes(action) {
        document.querySelectorAll(QUOTE_SELECTOR).forEach(quotes => {
            if (quotes.querySelector(FORUM_QUOTE_NAME_SELECTOR) == null) return;
            const quoteuser = quotes.querySelector(FORUM_QUOTE_NAME_SELECTOR).textContent;
            let user = quoteuser.replace(' said:','');
            if (!blacklist.includes(user)) return;
            let quote = quotes;
            action(quote, user);
        });
    }

    function alterReplies(action) {
        document.querySelectorAll(REPLIED_CONTAINER_SELECTOR).forEach(replyContainer => {
            const usernameElement = replyContainer.querySelector(FORUM_REPLY_NAME_SELECTOR);
            if (!usernameElement) return;
            const fullText = usernameElement.textContent;
            const usernameMatch = fullText.match(/^Reply to (.+)/);
            let user = null;
            if (usernameMatch && usernameMatch[1]) {
                user = usernameMatch[1].trim();
            }
            if (!blacklist.includes(user)) return;
            action(replyContainer, user);
        });
    }

    function alterPosts(action) {
        document.querySelectorAll(POST_USERS_SELECTOR).forEach(user => {
            if (!blacklist.includes(user.querySelector(FORUM_MSG_NAME_SELECTOR).textContent)) return;
            let post = user.parentNode;
            //for (let i = 0; i < 4; i++) {
                //post = post.parentNode;
            //}
            action(post, user);
        });
    }

    function alterProfileMessages(action) {
        document.querySelectorAll(PROFILE_MSG_SELECTOR).forEach(profileMessage => {
            const username = profileMessage.querySelector(PROFILE_MSG_NAME_SELECTOR).textContent;
            if (!blacklist.includes(username)) return;
            action(profileMessage, username);
        });
    }

    function alterComToCom(action) {
        document.querySelectorAll(COMTOCOM_SELECTOR).forEach(comMessage => {
            const username = comMessage.querySelector(COMTOCOM_NAME_SELECTOR).textContent;
            if (!blacklist.includes(username)) return;
            action(comMessage, username);
        });
    }

    function ignoreLastPost() {
        alterLastPost(lastPostItem => {
            lastPostItem.style.display = "none";
        });
    }

    function replaceLastPost() {
        alterLastPost((lastPostItem, user, usernameElement) => {
            const specificCustomLastPost = settings.specificCustomLastPost ? settings.specificCustomLastPost[user] : null;
            const replacementHTML = specificCustomLastPost ? specificCustomLastPost : (settings.customLastPost || "");
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = replacementHTML;
            const fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }
            const parent = usernameElement.parentNode;
            if (parent) {
                parent.replaceChild(fragment, usernameElement);
            }
        });
    }

    function ignoreQuotes() {
        alterQuotes(quote => {
            quote.style.display = "none";
            //post.previousElementSibling.style.display = "none";
        });
    }

    function replaceQuotes() {
        alterQuotes((quote, user) => {
            const specificCustomQuote = settings.specificCustomQuote[user];
            quote.innerHTML = specificCustomQuote ? specificCustomQuote : settings.customQuote;
        });
    }

    function ignoreReplies() {
        alterReplies(replyContainer => {
            replyContainer.style.display = "none";
        });
    }

    function replaceReplies() {
        alterReplies((replyContainer, user) => {
            const specificCustomReply = settings.specificCustomReply ? settings.specificCustomReply[user] : null;
            replyContainer.innerHTML = specificCustomReply ? specificCustomReply : (settings.customReply || "");
        });
    }

    function ignorePosts() {
        alterPosts(post => {
            post.style.display = "none";
            post.previousElementSibling.style.display = "none";
        });
    }

    function replacePosts() {
        alterPosts((post, user) => {
            const username = user.querySelector(FORUM_MSG_NAME_SELECTOR).textContent;
            const specificCustomPost = settings.specificCustomPost[username];
            post.querySelector(MESSAGE_SELECTOR).innerHTML = specificCustomPost ? specificCustomPost : settings.customPost;
        });
    }

    function replaceProfileMsg() {
        alterProfileMessages((profileMessage, username) => {
            const specificCustomProfileMsg = settings.specificCustomProfileMsg[username];
            profileMessage.querySelector(PROFILE_MSG_TEXT_SELECTOR).innerHTML = specificCustomProfileMsg ? specificCustomProfileMsg : settings.customProfileMsg;
        });
    }

    function replaceComToCom() {
        alterComToCom((comMessage, username) => {
            const specificCustomProfileMsg = settings.specificCustomProfileMsg[username];
            comMessage.querySelector(COMTOCOM_TEXT_SELECTOR).innerHTML = specificCustomProfileMsg ? specificCustomProfileMsg : settings.customProfileMsg;
        });
    }

    function ignoreTopics() {
        document.querySelectorAll(TOPIC_USERS_SELECTOR).forEach(user => {
            if (!blacklist.includes(user.textContent)) return;
            user.closest("tr").style.display = "none";
        });
    }
    function ignoreProfileMsgs() {
        alterProfileMessages(profileMessage => {
            profileMessage.style.display = "none";
        });
    }

    function ignoreComToCom() {
        alterComToCom(comMessage => {
            comMessage.style.display = "none";
        });
    }

    function replaceUsername() {
        alterPosts((post, user) => {
            user.querySelector(FORUM_MSG_NAME_SELECTOR).innerHTML = `<a href="${user.querySelector(USER_PROFILE_SELECTOR).href}">${settings.customUsername}</a>`;
        });
    }

    function alterLastPostAvatars(action) {
        document.querySelectorAll(LAST_POST_LIST_AVATAR_SELECTOR).forEach(avatarLink => {
            const userMatch = avatarLink.href.split('/').pop();
            if (userMatch && blacklist.includes(userMatch)) {
                action(avatarLink, userMatch);
            }
        });
    }

    function replaceAvatar() {
        alterPosts((post, userElement) => {
            const avatar = userElement.querySelector(AVATAR_SELECTOR);
            if (!avatar) {
                if (settings.customAvatar === "") return;
                const newAvatarLink = document.createElement("a");
                const profileLinkElement = userElement.querySelector(USER_PROFILE_SELECTOR);
                if (profileLinkElement) {
                   newAvatarLink.href = profileLinkElement.href;
                } else {
                   newAvatarLink.href = "#";
                }
                newAvatarLink.className = "forum-icon";
                newAvatarLink.innerHTML = `
                    <img class=" lazyloaded" data-src="${settings.customAvatar}" vspace="2" border="0" src="${settings.customAvatar}" width="100" height="125">`;
                const userInfoElement = userElement.querySelector(USER_INFO_SELECTOR);
                if (userInfoElement) {
                    userInfoElement.insertAdjacentElement('afterend', newAvatarLink);
                } else {
                     userElement.appendChild(newAvatarLink);
                }
            } else {
                if (settings.customAvatar === "") {
                    avatar.style.display = "none";
                    return;
                }
                const img = avatar.querySelector("img");
                if (img) {
                    img.src = settings.customAvatar;
                    img.setAttribute("data-src", settings.customAvatar);
                    img.setAttribute("width", 100);
                    img.setAttribute("height", 125);
                }
            }
        });
        alterLastPostAvatars((avatarLink, user) => {
            if (settings.customAvatar === "") {
                avatarLink.style.display = "none";
                return;
            }
            const img = avatarLink.querySelector("img");
            if (img) {
                img.src = settings.customAvatar;
                img.setAttribute("data-src", settings.customAvatar);
                img.setAttribute("width", 20);
                img.setAttribute("height", 25);
            } else {
                if (settings.customAvatar !== "") {
                     const replacementImg = document.createElement('img');
                     replacementImg.src = settings.customAvatar;
                     replacementImg.setAttribute("data-src", settings.customAvatar);
                     replacementImg.setAttribute("width", 20);
                     replacementImg.setAttribute("height", 25);
                     const parent = avatarLink.parentNode;
                     if (parent) {
                         parent.replaceChild(replacementImg, avatarLink);
                     }
                }
            }
        });
    }

    function replaceProfileAvatar() {
        alterProfileMessages(profileMessage => {
            const avatar = profileMessage.querySelector(PROFILE_MSG_AVATAR_SELECTOR);

            if (settings.customProfileAvatar === "") {
                avatar.style.display = "none";
                return;
            }

            const img = avatar.querySelector("img");
            img.src = settings.customProfileAvatar;
            img.setAttribute("data-src", settings.customProfileAvatar);
        });
    }

    function replaceComToComAvatar() {
        alterComToCom(comMessage => {
            const avatar = comMessage.querySelector(COMTOCOM_AVATAR_SELECTOR);

            if (settings.customProfileAvatar === "") {
                avatar.style.display = "none";
                return;
            }

            const img = avatar.querySelector("img");
            img.src = settings.customProfileAvatar;
            img.setAttribute("data-src", settings.customProfileAvatar);
        });
    }

    function removeSignatures() {
        alterPosts(post => {
            const signature = post.querySelector(SIGNATURE_SELECTOR);
            if (!signature) return;
            signature.style.display = "none";
        });
    }

    function removeUserinfo() {
        alterPosts(post => {
            const userinfo = post.querySelector(USERINFO_SELECTOR);
            if (!userinfo) return;
            userinfo.style.display = "none";
            const userinfo1 = post.querySelector(USERINFO_SELECTOR1);
            if (!userinfo1) return;
            userinfo1.style.display = "none";
            const userinfo2 = post.querySelector(USERINFO_SELECTOR2);
            if (!userinfo2) return;
            userinfo2.style.display = "none";
            const userinfo3 = post.querySelector(USERINFO_SELECTOR3);
            if (!userinfo3) return;
            userinfo3.style.display = "none";
            const userinfo4 = post.querySelector(USERINFO_SELECTOR4);
            if (userinfo4) {
                userinfo4.style.display = "none";
            }
            const userinfo5 = post.querySelector(USERINFO_SELECTOR5);
            if (userinfo5) {
                userinfo5.style.display = "none";
            }
            const userinfo6 = post.querySelector(USERINFO_SELECTOR6);
            if (userinfo6) {
                userinfo6.style.display = "none";
            }
        });
    }
    function addPostsBlackListButtons() {
        document.querySelectorAll(FORUM_MESSAGE_SELECTOR).forEach(forumMessage => {
            const actionBar = forumMessage.querySelector(FORUM_ACTION_BAR_SELECTOR);
            const username = forumMessage.querySelector(FORUM_MSG_NAME_SELECTOR).textContent;
            if (!blacklist.includes(username)) {
                addBlackListButton(actionBar, username);
            } else {
                addUnBlackListButton(actionBar, username);
            }
        });
    }

    function addProfileMsgBlackListButtons() {
        document.querySelectorAll(PROFILE_MSG_SELECTOR).forEach(profileMessage => {
            let actionBar = profileMessage.querySelector(PROFILE_MSG_ACTION_BAR_SELECTOR);
            const username = profileMessage.querySelector(PROFILE_MSG_NAME_SELECTOR).textContent;

            //this happens when you are looking at someone elses profile, create the actionBar.
            if (!actionBar) {
                actionBar = document.createElement("div");
                actionBar.className = "postActions ar mt4";
                profileMessage.querySelector(PROFILE_MSG_TEXT_SELECTOR).insertAdjacentElement("afterend", actionBar);
            }

            if (!blacklist.includes(username)) {
                addBlackListLink(actionBar, username, " | ");
            } else {
                addUnBlackListLink(actionBar, username, " | ");
            }
        });
    }

    function addComToComBlackListButtons() {
        document.querySelectorAll(COMTOCOM_SELECTOR).forEach(comMessage => {
            let actionBar = comMessage.querySelector(COMTOCOM_ACTION_BAR_SELECTOR);
            const username = comMessage.querySelector(COMTOCOM_NAME_SELECTOR).textContent;

            //this happens when you manually enter the url of com-to-com between 2 users other than you.
            if (!actionBar) {
                const actionBarContainer = document.createElement("div");
                actionBarContainer.style.marginTop = "10px";
                actionBar = document.createElement("small");
                actionBarContainer.appendChild(actionBar);
                comMessage.querySelector(COMTOCOM_TEXT_SELECTOR).insertAdjacentElement("afterend", actionBarContainer);
            }

            if (!blacklist.includes(username)) {
                addBlackListLink(actionBar, username, " | ");
            } else {
                addUnBlackListLink(actionBar, username, " | ");
            }
        });
    }

    function addBlackListLink(actionBar, username, separator) {
        const you = document.querySelector(YOU_SELECTOR).textContent;
        if (username == you) return
        const a = document.createElement("a");
        a.href = "javascript:void(0)";
        a.textContent = "Blacklist User";
        a.dataset.username = username;
        a.onclick = blacklistUser;

        actionBar.after(a);

        if (separator) {
            actionBar.after(document.createTextNode(separator));
        }
    }

    function addUnBlackListLink(actionBar, username, separator) {
        if (settings.removeUnBlacklist) return;
        const a = document.createElement("a");
        a.href = "javascript:void(0)";
        a.textContent = "UnBlacklist User";
        if (settings.UnBlacklistUsername) a.title = username;
        a.dataset.username = username;
        a.onclick = blacklistUser;

        actionBar.after(a);

        if (separator) {
            actionBar.after(document.createTextNode(separator));
        }
    }

    function addBlackListButton(actionBar, username, separator) {
        const you = document.querySelector(YOU_SELECTOR).textContent;
        if (username == you) return
        const a = document.createElement("button");
        a.href = "javascript:void(0)";
        a.textContent = "Blacklist User";
        a.classList.add("mal-btn");
        a.classList.add("secondary");
        a.classList.add("small");
        a.classList.add("outline");
        a.classList.add("noborder");
        a.dataset.username = username;
        a.onclick = blacklistUser;

        if (actionBar.childElementCount > 0 && separator) {
            actionBar.prepend(document.createTextNode(separator));
        }
        actionBar.prepend(a);
    }

    function addUnBlackListButton(actionBar, username, separator) {
        if (settings.removeUnBlacklist) return;
        const a = document.createElement("button");
        a.href = "javascript:void(0)";
        a.textContent = "UnBlacklist User";
        a.classList.add("mal-btn");
        a.classList.add("secondary");
        a.classList.add("small");
        a.classList.add("outline");
        a.classList.add("noborder");
        if (settings.UnBlacklistUsername) a.title = username;
        a.dataset.username = username;
        a.onclick = blacklistUser;

        if (actionBar.childElementCount > 0 && separator) {
            actionBar.prepend(document.createTextNode(separator));
        }
        actionBar.prepend(a);
    }

    function blacklistUser(e) {
        const username = e.target.dataset.username;

        if (blacklist.includes(username)) {
            removeUser(username);
            window.location.reload();
        } else {
            addUser(username);
            window.location.reload();
        }
    }

    //Add a user to the blacklist
    function addUser(username) {
        blacklist.push(username);
        saveBlackList();
    }

    //Remove a user from the blacklist if it's there
    function removeUser(userName) {
        blacklist = blacklist.filter(name => userName !== name);
        saveBlackList();
    }

    //remove the user node from the html code and then update the localStorage
    function removeNode(e) {
        const row = e.target.parentNode;
        const name = row.querySelector("[data-name]").textContent;
        row.remove();
        removeUser(name);
        removeUserFromSelect(name);
    }

    //modify the user node from the html code and then update the localStorage
    function saveNode(e) {
        const newName = e.target.textContent;
        const previousName = e.target.dataset.previousName;

        previousName && removeUser(previousName);

        if (newName !== "") {
            addUser(newName);
            e.target.dataset.previousName = newName;
        } else {
            e.target.parentNode.remove();
        }
    }

    //add a new user node to the html code and then update the localStorage
    function addNode(e) {
        const node = e.target.parentNode;
        const usernameNode = node.querySelector("[data-name]");
        const username = usernameNode.textContent;
        usernameNode.textContent = "";

        if (!blacklist.includes(username)) {
            createNode(username);
            addUser(username);
            addUserToSelect(username);
        }
    }

    //create the user node then add it to the html code
    function createNode(username) {
        const newUser = document.createElement("div");
        newUser.setAttribute("data-user", "");
        newUser.className = "user";
        newUser.innerHTML = `<div data-name class="name" contenteditable="true" onclick="this.focus()" data-previous-name="${username}">${username}</div>
        <button data-remove class="remove">Remove</button>`;
        newUser.querySelector("[data-name]").addEventListener("focusout", saveNode);
        newUser.querySelector("[data-remove]").addEventListener("click", removeNode);
        document.querySelector("[data-blacklist]").append(newUser);
    }

    //add the users inside the user select element
    function addUserToSelect(username) {
        const selectUser = document.querySelector("[data-select-users]");
        const option = document.createElement("option");
        option.value = option.textContent = username;
        selectUser.appendChild(option);
    }

    //remove the user from the select list
    function removeUserFromSelect(username) {
        const userOption = document.querySelector(`[data-select-users] [value="${username}"]`);
        if (userOption) userOption.remove();
    }

    //load a custom post and custom profile message of a specific blacklisted user into the 2 text areas designated for these inputs
    function loadSpecificMessages(e) {
        const userCustomLastPost = settings.specificCustomLastPost[e.target.value];
        const userCustomQuote = settings.specificCustomQuote[e.target.value];
        const userCustomReply = settings.specificCustomReply[e.target.value];
        const userCustomPost = settings.specificCustomPost[e.target.value];
        const userCustomProfileMsg = settings.specificCustomProfileMsg[e.target.value];
        const customLastPost = document.getElementById("specificCustomLastPost");
        const customQuote = document.getElementById("specificCustomQuote");
        const customReply = document.getElementById("specificCustomReply");
        const customPost = document.getElementById("specificCustomPost");
        const customProfileMsg = document.getElementById("specificCustomProfileMsg");
        customLastPost.value = userCustomLastPost ? userCustomLastPost : "";
        customQuote.value = userCustomQuote ? userCustomQuote : "";
        customReply.value = userCustomReply ? userCustomReply : "";
        customPost.value = userCustomPost ? userCustomPost : "";
        customProfileMsg.value = userCustomProfileMsg ? userCustomProfileMsg : "";
    }
})();