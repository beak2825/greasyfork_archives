// ==UserScript==
// @name        FA Instant Nuker
// @namespace   Violentmonkey Scripts
// @match       *://*.furaffinity.net/*
// @require     https://update.greasyfork.org/scripts/525666/1549449/Furaffinity-Prototype-Extensions.js
// @require     https://update.greasyfork.org/scripts/483952/1672922/Furaffinity-Request-Helper.js
// @require     https://update.greasyfork.org/scripts/485827/1549457/Furaffinity-Match-List.js
// @require     https://update.greasyfork.org/scripts/475041/1617223/Furaffinity-Custom-Settings.js
// @grant       GM_info
// @version     1.0.8
// @author      Midori Dragon
// @description Adds nuke buttons to instantly nuke all submissions or messages
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/527752-fa-instant-nuker
// @supportURL  https://greasyfork.org/scripts/527752-fa-instant-nuker/feedback
// @downloadURL https://update.greasyfork.org/scripts/527752/FA%20Instant%20Nuker.user.js
// @updateURL https://update.greasyfork.org/scripts/527752/FA%20Instant%20Nuker.meta.js
// ==/UserScript==
// jshint esversion: 8
(() => {
    "use strict";
    var __webpack_require__ = {};
    __webpack_require__.d = (exports, definition) => {
        for (var key in definition) {
            if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                Object.defineProperty(exports, key, {
                    enumerable: true,
                    get: definition[key]
                });
            }
        }
    };
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    __webpack_require__.d({}, {
        uL: () => requestHelper,
        j_: () => selectNukeIconSetting
    });
    var NukeIconOptions;
    !function(NukeIconOptions) {
        NukeIconOptions.Red = "red";
        NukeIconOptions.White = "white";
    }(NukeIconOptions || (NukeIconOptions = {}));
    var MessageType;
    !function(MessageType) {
        MessageType[MessageType.None = 0] = "None";
        MessageType[MessageType.Watches = 1] = "Watches";
        MessageType[MessageType.JournalComments = 2] = "JournalComments";
        MessageType[MessageType.Shouts = 3] = "Shouts";
        MessageType[MessageType.Favorites = 4] = "Favorites";
        MessageType[MessageType.Journals = 5] = "Journals";
        MessageType[MessageType.Submission = 6] = "Submission";
        MessageType[MessageType.All = 7] = "All";
    }(MessageType || (MessageType = {}));
    class WhiteNukeSVG {
        static get Svg() {
            return '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M9.912 8.531 7.121 3.877a.501.501 0 0 0-.704-.166 9.982 9.982 0 0 0-4.396 7.604.505.505 0 0 0 .497.528l5.421.09a4.042 4.042 0 0 1 1.973-3.402zm8.109-4.51a.504.504 0 0 0-.729.151L14.499 8.83a4.03 4.03 0 0 1 1.546 3.112l5.419-.09a.507.507 0 0 0 .499-.53 9.986 9.986 0 0 0-3.942-7.301zm-4.067 11.511a4.015 4.015 0 0 1-1.962.526 4.016 4.016 0 0 1-1.963-.526l-2.642 4.755a.5.5 0 0 0 .207.692A9.948 9.948 0 0 0 11.992 22a9.94 9.94 0 0 0 4.396-1.021.5.5 0 0 0 .207-.692l-2.641-4.755z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        }
    }
    var __awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class NukeButton {
        constructor(messageType) {
            this.messageType = messageType;
            this.nukeButton = document.createElement("button");
            this.nukeButton.type = "button";
            this.nukeButton.classList.add("button", "standard", "nuke");
            if (selectNukeIconSetting.value === NukeIconOptions.Red) {
                const nukeIcon = document.createElement("div");
                nukeIcon.classList.add("in-button-icon", "sprite-nuke");
                nukeIcon.style.margin = "0px";
                this.nukeButton.appendChild(nukeIcon);
            } else if (selectNukeIconSetting.value === NukeIconOptions.White) {
                this.nukeButton.innerHTML = WhiteNukeSVG.Svg;
            }
            this.nukeButton.addEventListener("click", () => {
                this.nuke();
            });
        }
        nuke() {
            return __awaiter(this, void 0, void 0, function*() {
                switch (this.messageType) {
                  case MessageType.Watches:
                    yield requestHelper.PersonalUserRequests.MessageRequests.NewMessages.Watches.nukeMessages();
                    break;

                  case MessageType.JournalComments:
                    yield requestHelper.PersonalUserRequests.MessageRequests.NewMessages.JournalComments.nukeMessages();
                    break;

                  case MessageType.Shouts:
                    yield requestHelper.PersonalUserRequests.MessageRequests.NewMessages.Shouts.nukeMessages();
                    break;

                  case MessageType.Favorites:
                    yield requestHelper.PersonalUserRequests.MessageRequests.NewMessages.Favorites.nukeMessages();
                    break;

                  case MessageType.Journals:
                    yield requestHelper.PersonalUserRequests.MessageRequests.NewMessages.Journals.nukeMessages();
                    break;

                  case MessageType.Submission:
                    yield requestHelper.PersonalUserRequests.MessageRequests.NewSubmissions.nukeSubmissions();
                }
                location.reload();
            });
        }
    }
    class MessageNuker {
        constructor() {
            const messagesForm = document.getElementById("messages-form");
            const messageSections = null === messagesForm || void 0 === messagesForm ? void 0 : messagesForm.querySelectorAll('section[class="section_container"][id*="messages-"]');
            if (null != messageSections) {
                for (const section of Array.from(messageSections)) {
                    const sectionType = this.getSectionTypeFromElement(section);
                    if (sectionType === MessageType.None) {
                        continue;
                    }
                    const nukeButton = new NukeButton(sectionType);
                    const sectionControls = section.querySelector('div[class*="section_controls"]');
                    if (sectionControls) {
                        sectionControls.appendChild(nukeButton.nukeButton);
                    }
                }
            }
        }
        getSectionTypeFromElement(section) {
            switch (section.id.trimStart("messages-")) {
              default:
                return MessageType.None;

              case "watches":
                return MessageType.Watches;

              case "comments-journal":
                return MessageType.JournalComments;

              case "shouts":
                return MessageType.Shouts;

              case "favorites":
                return MessageType.Favorites;

              case "journals":
                return MessageType.Journals;
            }
        }
    }
    class SubmissionNuker {
        constructor() {
            const standardPage = document.getElementById("standardpage");
            const actionsSection = null === standardPage || void 0 === standardPage ? void 0 : standardPage.querySelectorAll('section[class*="actions-section"]');
            if (null != actionsSection) {
                for (const section of Array.from(actionsSection)) {
                    const sectionOptions = section.querySelector('div[class*="section-options"]');
                    if (null == sectionOptions) {
                        continue;
                    }
                    const nukeButton = new NukeButton(MessageType.Submission);
                    sectionOptions.appendChild(nukeButton.nukeButton);
                }
            }
        }
    }
    const customSettings = new window.FACustomSettings("Furaffinity Features Settings", "FA Instant Nuker Settings");
    const selectNukeIconSetting = customSettings.newSetting(window.FASettingType.Option, "Select Nuke Icon");
    selectNukeIconSetting.description = "Select the Nuke Icon to use for the Nuke Button.";
    selectNukeIconSetting.options = {
        [NukeIconOptions.Red]: "Red Nuke Icon",
        [NukeIconOptions.White]: "White Nuke Icon"
    };
    selectNukeIconSetting.defaultValue = NukeIconOptions.Red;
    customSettings.loadSettings();
    const requestHelper = new window.FARequestHelper(2);
    if (customSettings.isFeatureEnabled) {
        const matchListSubmissions = new window.FAMatchList(customSettings);
        matchListSubmissions.matches = [ "msg/submissions" ];
        matchListSubmissions.runInIFrame = false;
        if (matchListSubmissions.hasMatch) {
            new SubmissionNuker;
        }
        const matchListMessages = new window.FAMatchList(customSettings);
        matchListMessages.matches = [ "msg/others" ];
        matchListMessages.runInIFrame = false;
        if (matchListMessages.hasMatch) {
            new MessageNuker;
        }
    }
})();