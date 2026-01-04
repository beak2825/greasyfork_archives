// ==UserScript==
// @name         More Ore - Auto Updater
// @namespace    https://syns.studio/more-ore/
// @version      1.10.3
// @description  Shows an alert when there's an update for the More Ore game, without having to refresh the page
// @author       123HD123
// @match        https://syns.studio/more-ore/
// @icon         https://syns.studio/more-ore/misc-tinyRock.22ef93dd.ico
// @require      https://greasyfork.org/scripts/444840-more-ore-notification/code/More%20Ore%20-%20Notification+.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443528/More%20Ore%20-%20Auto%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/443528/More%20Ore%20-%20Auto%20Updater.meta.js
// ==/UserScript==
(function() {
    const MOD_NAME = "Auto Updater";
    const MOD_STORAGE_DEFAULT = {
        intervals: []
    };

    window.mods = window.mods || {};

    const Logger = NotificationPlus?.notify || console.log;
    if (Object.keys(window.mods).includes(MOD_NAME))
        return Logger(
            "Warning: Mod named " + MOD_NAME + " has already been loaded",
            3
        );

    NotificationPlus?.load(MOD_NAME);

    window.mods[MOD_NAME] = window.mods[MOD_NAME] || MOD_STORAGE_DEFAULT;

    const MOD_STORAGE = window.mods[MOD_NAME];
        
    if (MOD_STORAGE.intervals != [])
        MOD_STORAGE.intervals.forEach(interval => clearInterval(interval.id));

    MOD_STORAGE.intervals = [];

    const URL = "https://syns.studio/more-ore/";
    const scriptsFileRegex = /.*".*(scripts.*.js)"/m;
    var oldScriptsFile = document.body.innerHTML.match(scriptsFileRegex)[1];

    MOD_STORAGE.intervals.push({
        id: setInterval(httpGetAsync, 5 * 60 * 1000, URL, cb),
        function: httpGetAsync,
        arguments: [URL, cb]
    });

    function cb(res) {
        NotificationPlus?.notify("Checking for updates...", 3);
        let date = new Date();
        let stamp = `[${date.toTimeString().split(" ")[0]}] `;
        console.log(stamp + "Checking for new files...");
        let scriptsFile = res.match(scriptsFileRegex)[1];
        if (scriptsFile == oldScriptsFile) return console.log(stamp + "No new files.");
        oldScriptsFile = scriptsFile;
        httpGetAsync(URL + scriptsFile, sRes => {
            let date = new Date();
            let stamp = `[${date.toTimeString().split(" ")[0]}] `;
            console.log(stamp + "Checking for updates...");
            let versionRegex = /\)?].?=.?{\s*'(.*?)':\s?{\s*'rel/;
            let version = sRes.match(versionRegex)[1].replace("\\x20", " ");
            if (document.querySelector(".version").innerText.replace("v. ", "") !== version) utils.buildModal(MOD_NAME, `<p>New version (refresh): ${version}</p>`, null, 365, true, true);
            else {
                console.log(stamp + "No updates found!");
                utils.buildModal(MOD_NAME, "<p>Possible hotfix detected<br>(small update with purely bugfixes)</p>", null, 365, true, true);
            }
        });
    }

    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        xmlHttp.setRequestHeader("Pragma", "no-cache");
        xmlHttp.setRequestHeader("Expires", "0");
        xmlHttp.send(null);
    }

    const utils = {
        buildModal: function (title, innerHTML) {
            //this.closeTopmostModal();
            var confirmMessage =
                arguments.length > 2 && void 0 != arguments[2] ?
                arguments[2] :
                'Ok',
                customWidth = arguments.length > 3 ? arguments[3] : void 0,
                center = arguments.length > 4 ? arguments[4] : void 0,
                nonBlocking = arguments.length > 5 ? arguments[5] : void 0;
            let wrapper = this.createEl('div', ['modal-wrapper']);
            if (nonBlocking) {
                wrapper.style.margin = "auto";
                wrapper.style.width = "fit-content";
                wrapper.style.height = "fit-content";
                wrapper.style.background = "transparent";
            }
            wrapper.addEventListener('click', this.closeTopmostModal);
            var modal = this.createEl('div', [
                'modal'
            ]);
            customWidth && (modal.style.width = customWidth + 'px');
            center && (modal.style.textAlign = 'center');
            var titleElement = this.createEl('h2', ['modal-title'], title);
            modal.append(titleElement);
            modal.append(this.buildCloseButton());
            var contentElement = this.createEl('div', ['modal-content']);
            contentElement.innerHTML = innerHTML;
            modal.append(contentElement);
            var actionsContainer = this.createEl('div', ['modal-actions']),
                confirmAction = this.createEl('button', ['modal-action'], confirmMessage);
            confirmAction.onclick = function () {
                this.closeTopmostModal();
            }.bind(this);
            actionsContainer.append(confirmAction);
            modal.append(actionsContainer);
            wrapper.append(modal);
            document.querySelector(".page-container").append(wrapper);
        },
        buildCloseButton: function () {
            var position =
                arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10,
              dark = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              closeBtn = this.createEl('img', ['close-btn'])
            return (
              (closeBtn.src = './images/misc-close.svg'),
              (closeBtn.style.right = position + 'px'),
              (closeBtn.style.top = position + 'px'),
              dark && (closeBtn.style.filter = 'brightness(0)'),
              closeBtn.addEventListener('click', function () {
                return t.closeTopmostModal()
              }),
              closeBtn
            )
        },
        createEl: function (tag) {
            var classes =
                arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                innerHTML =
                arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '',
                element = document.createElement(tag);
            return (
                classes.forEach(function (clazz) {
                    return element.classList.add(clazz)
                }),
                (element.innerHTML = innerHTML + ''),
                element
            );
        },
        closeTopmostModal: function (event) {
            var targetElement;
            if (event) {
                var targetEl = event.target;
                targetElement = targetEl.classList.contains('modal-wrapper') ? targetEl : null;
            } else {
                var allWrappers = document.querySelectorAll('.modal-wrapper');
                allWrappers.length > 0 && (targetElement = allWrappers[allWrappers.length - 1]);
            }
            if (targetElement) {
                targetElement.style.pointerEvents = 'none';
                new Howl({
                    src: ['./sounds/misc.wav'],
                    volume: .1 * volume
                }).play();
                var modal = targetElement.children[0];
                modal.style.animation = 'fadeOutDown .15s ease-out forwards';
                modal.addEventListener('animationend', () => targetElement.parentNode.removeChild(targetElement));
            }
        }
    };
})();