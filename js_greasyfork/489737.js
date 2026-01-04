// ==UserScript==
// @name        Xing job search helper
// @namespace   xing.com
// @version     2024-07-11_8
// @description Xing Helper for Anton
// @author      Anton
// @match       https://www.xing.com/jobs/*search?*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=xing.com
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/489737/Xing%20job%20search%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/489737/Xing%20job%20search%20helper.meta.js
// ==/UserScript==

(function() {
    console.log("Xing job search helper");

    'use strict';

    var SettingsPopup = {
        addStyles: function() {
            // Check if the styles already exist in the document
            var styles = document.querySelector('#popup-styles');
            if (!styles) {
                // Create the styles for the popup
                styles = document.createElement('style');
                styles.id = 'popup-styles';
                styles.innerHTML =
                    '#checkbox-div-wrapper { text-align: left; width: 100%; user-select: none; }' +
                    '#popup-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 999; }' +
                    '#textarea-div-wrapper { display: flex; justify-content: space-between; }' +
                    '#popup { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid black; z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: space-between; }' +
                    '#left-textarea-div { margin-right: 5px; }' +
                    '#left-textarea-caption { margin-bottom: 5px; }' +
                    '#left-textarea { width: 100%; min-width: 300px; height: 300px; margin-top: 5px; }' +
                    '#right-textarea-div { margin-left: 5px; }' +
                    '#right-textarea-caption { margin-bottom: 5px; }' +
                    '#right-textarea { width: 100%; min-width: 300px; height: 300px; margin-top: 5px; }' +
                    '#buttons-div { display: flex; justify-content: flex-end; }' +
                    '#ok-button { margin-right: 10px; }';

                // Append the styles to the document
                document.head.appendChild(styles);
            }
        },

        _getHtml: function() {
            return `
<div id="textarea-div-wrapper">
    <div id="left-textarea-div">
        <div id="left-textarea-caption">Banned companies</div>
        <textarea id="left-textarea">` + CompanyBans.companyBans.join("\n") + `</textarea>
    </div>
    <div id="right-textarea-div">
        <div id="right-textarea-caption">Autohide words</div>
        <textarea id="right-textarea">` + HiddenJobs.hiddenWords.join("\n") + `</textarea>
    </div>
</div>
<div id="checkbox-div-wrapper">
    <label for="hide_info_checkbox"><input type="checkbox" id="hide_info_checkbox" name="hide_info_checkbox" ` + (Settings.isTotalHide() ? 'checked' : '') + `> Totally hide companies and words</label>
</div>
<div id="buttons-div">
    <button id="ok-button">OK</button>
    <button id="cancel-button">Cancel</button>
</div>`;
        },

        show: function(callback) {
            // Create the shaded background div
            var background = document.createElement('div');
            background.id = 'popup-background';

            // Create the popup div
            var popup = document.createElement('div');
            popup.id = 'popup';
            popup.innerHTML = this._getHtml();

            // Add event listeners to the buttons
            var okButton = popup.querySelector('#ok-button');
            var cancelButton = popup.querySelector('#cancel-button');
            var leftTextarea = popup.querySelector('#left-textarea');
            var rightTextarea = popup.querySelector('#right-textarea');
            var hide_info_checkbox = popup.querySelector('#hide_info_checkbox');

            var closePopup = () => {
                document.body.removeChild(popup);
                document.body.removeChild(background);
                // Re-enable scrolling of the body element
                document.body.style.overflow = '';
            }

            okButton.onclick = function() {
                callback(leftTextarea.value, rightTextarea.value);
                Settings.setTotalHide(hide_info_checkbox.checked);
                closePopup()
            };

            cancelButton.onclick = closePopup;

            // Disable scrolling of the body element
            document.body.style.overflow = 'hidden';
            // Append the popup and background to the document
            document.body.appendChild(background);
            document.body.appendChild(popup);
        },

        init: function() {
            this.addStyles();
        }
    };

    function arraysIntersect(arr1, arr2) {
        // Convert both arrays to sets for efficient lookups
        const set1 = new Set(arr1);
        const set2 = new Set(arr2);

        // Check if the intersection of the sets is not empty
        return set1.size > 0 && set2.size > 0 && [...set1].some(element => set2.has(element));
    }

    var Settings = {
        localStorageSettingsName: 'myXingSettings',
        totallyHideCompaniesAndWords: true,

        load: function() {
            const settingsObjStr = localStorage.getItem(this.localStorageSettingsName);
            var settingsObj = JSON.parse(settingsObjStr) || {};

            this.totallyHideCompaniesAndWords = settingsObj.totallyHideCompaniesAndWords || false;

            console.log("Settings loaded:", settingsObj);
            this.updateVisibility();
        },

        save: function() {
            var settings = {
                totallyHideCompaniesAndWords: this.totallyHideCompaniesAndWords
            };
            localStorage.setItem(this.localStorageSettingsName, JSON.stringify(settings));
            console.log("Settings saved:", settings);
            this.updateVisibility();
        },

        setTotalHide: function(newValue) {
            if (newValue != this.totallyHideCompaniesAndWords) {
                this.totallyHideCompaniesAndWords = newValue;
                this.save();
            }
        },

        updateVisibility: function() {
            var app = document.querySelector('#app');
            if (this.totallyHideCompaniesAndWords) {
                app.classList.add('my-xing-totally-hide');
            } else {
                app.classList.remove('my-xing-totally-hide');
            }
        },

        isTotalHide: function() {
            return this.totallyHideCompaniesAndWords;
        },

        init: function() {
            this.load();
        }
    };

    var HiddenJobs = {
        localStorageVarName: 'myXingJobArray',
        myArray: [],
        localStorageHiddenWordsName: 'myXingWordsArray',
        hiddenWords: [],

        load: function() {
            const myArrayString = localStorage.getItem(this.localStorageVarName);
            this.myArray = JSON.parse(myArrayString) || [];

            const wordsString = localStorage.getItem(this.localStorageHiddenWordsName);
            this.hiddenWords = JSON.parse(wordsString);
            if (this.hiddenWords == null) this.hiddenWords = [];

            console.log('Loaded:', this.myArray, this.hiddenWords);
        },

        save: function() {
            console.log('Saving:', this.myArray, this.hiddenWords);

            localStorage.setItem(this.localStorageVarName, JSON.stringify(this.myArray));
            localStorage.setItem(this.localStorageHiddenWordsName, JSON.stringify(this.hiddenWords));
        },

        isHidden: function(jobid) {
            return this.myArray.includes(jobid);
        },

        removeJobFromHidden: function(jobid) {
            const index = this.myArray.indexOf(jobid);
            if (index !== -1) {
                this.myArray.splice(index, 1);
            }
            this.save();
        },

        toggleHide: function(node, jobid) {
            if (this._ishiding) return;
            this._ishiding = true;
            if (this.isHidden(jobid)) {
                this.removeJobFromHidden(jobid);
                this.setVisible(node, jobid);
                this._ishiding = false;
            } else {
                this.myArray.push(jobid);
                this.save();
                setTimeout(() => {
                    HiddenJobs.updateHiddenState(node, jobid);
                    this._ishiding = false;
                }, 100);
            }
        },

        setHidden: function(node, jobid, jobIsHiddenAuto) {
            node.parentNode.classList.add('my-xing-hidden-node');
            if (!!jobIsHiddenAuto) {
                node.parentNode.classList.add('my-xing-autohide');
            }
        },

        setVisible: function(node, jobid) {
            node.parentNode.classList.remove('my-xing-hidden-node');
            node.parentNode.classList.remove('my-xing-autohide');
        },

        setHiddenWords: function(newHiddenWords) {
            this.hiddenWords = newHiddenWords;
            this.save();

            var nodes = findNodes();
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var jobid = node.getAttribute('jobid');
                if (!!jobid) {
                    this.updateHiddenState(node, jobid);
                }
            }
        },

        isHiddenByAuto: function(jobTitle) {
            var jobIsHiddenAuto = this.hiddenWords.some(function(word) {
                var escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var regex = new RegExp(`(^|[^\\w#])${escapedWord}([^\\w#]|$)`, 'm');
                return regex.test(jobTitle);
            });

            //console.log('Job title:', jobTitle, (jobIsHiddenAuto ? 'AUTO HIDDEN' : ''));
            return jobIsHiddenAuto;
        },

        updateHiddenState: function(node, jobid) {
            var jobTitle = node.querySelector('[data-cy=job-teaser-list-title]').innerText;
            var jobIsHiddenAuto = this.isHiddenByAuto(jobTitle);
            var jobIsSaved = !!(node.querySelector('button[data-cy=bookmark-action-button-filled]'));
            var jobIsHidden = this.isHidden(jobid);

            var companyNames = Array.from(node.querySelectorAll('[data-xds=BodyCopy]')).map(n => n.innerText);
            var isBanned = CompanyBans.isCompanyBanned(companyNames);

            if ((jobIsHidden || jobIsHiddenAuto) && !jobIsSaved && !isBanned) {
                if (jobIsHidden && jobIsHiddenAuto) {
                    this.removeJobFromHidden(jobid);
                }
                this.setHidden(node, jobid, jobIsHiddenAuto);
            } else {
                this.setVisible(node, jobid);
            }
        },

        addHideButton: function(node, jobid) {
            // add button
            var btn = node.querySelector('button');
            // Clone the button and change the onclick attribute
            var newBtn = btn.cloneNode(true); // Clone the button with its child nodes
            newBtn.setAttribute('jobid', jobid);
            newBtn.jobid = jobid;
            newBtn.onclick = function(event) {
                event.stopPropagation();
                HiddenJobs.toggleHide(node, jobid);
                return false;
            };
            newBtn.classList.add('my-xing-hide-button');

            // Remove the <svg> element from the copied button
            var svg = newBtn.querySelector('svg');
            if (svg) {
                svg.parentNode.remove();
            }
            // change caption
            var span = newBtn.querySelector('span');
            if (span) {
                span.innerText = 'Hide';
            }
            // Insert the new button after the original button
            btn.parentNode.insertAdjacentElement('afterend', newBtn);
        },

        init: function() {
            this.load();
        }
    };

    var CompanyBans = {
        localStorageBansName: 'myXingJobBans',
        companyBans: [],

        load: function() {
            const myArrayString = localStorage.getItem(this.localStorageBansName);
            this.companyBans = JSON.parse(myArrayString) || [];
            console.log('Loaded:', this.companyBans);
        },

        save: function() {
            console.log('Saving:', this.companyBans);
            localStorage.setItem(this.localStorageBansName, JSON.stringify(this.companyBans));
        },

        isCompanyBanned: function(companyNames) {
            return arraysIntersect(this.companyBans, companyNames);
        },

        setBanned: function(node) {
            node.style.display = 'none';
        },

        setUnbanned: function(node) {
            node.style.display = null;
        },

        setBansArray: function(newBans) {
            this.companyBans = newBans;
            this.save();

            var nodes = findNodes();
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                this.updateBannedState(node);
            }
        },

        updateBannedState: function(node) {
            var companyNames = Array.from(node.querySelectorAll('[data-xds=BodyCopy]')).map(n => n.innerText);
            var isBanned = this.isCompanyBanned(companyNames);
            if (isBanned) {
                this.setBanned(node);

                var jobid = node.getAttribute('jobid');
                if (!!jobid && HiddenJobs.isHidden(jobid)) {
                    console.log("Removing hidden from", jobid, "because company ban");
                    HiddenJobs.toggleHide(node, jobid); // remove job if all company is banned
                }
            } else {
                this.setUnbanned(node);
            }
        },

        init: function() {
            this.load();
        }
    };

    function processNode(node, jobid) {
        node.setAttribute('jobid', jobid);

        HiddenJobs.addHideButton(node, jobid);

        // restore state
        CompanyBans.updateBannedState(node);
        HiddenJobs.updateHiddenState(node, jobid);
    }

    function processNodes(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (!node.getAttribute('jobid')) {
                var url = node.href;
                const matches = url.match(/(?<=\S+)\d+(?=\?)/);
                const jobid = matches ? matches[0] : null;
                processNode(node, jobid);
            }
        }
    }

    var isInitializing = false;

    function findNodes() {
        var nodes_v1 = document.querySelectorAll('section>ul li>article>a');
        var nodes_v2 = document.querySelectorAll('main>ul li>article>a');
        var nodes = nodes_v1.length == 0 ? nodes_v2 : nodes_v1;
        return nodes;
    }

    function initNodes() {
        isInitializing = true;
        var nodes = findNodes();
        if (nodes.length == 0) {
            setTimeout(initNodes, 100);
        } else {
            isInitializing = false;
            //console.log('Found', nodes.length, 'nodes');
            processNodes(nodes);
            setTimeout(initNodes, 1000); // rescan every 1 second
        }
    }

    function isInit() {
        return document.querySelector('a[jobid]') != null;
    }

    var initInterval;

    function initTopBar() {
        var topBar = document.querySelector('div[data-qa=top-bar-container]');
        if (!!topBar) {
            if (!document.getElementById('top-bar-options-button')) {
                var newDiv = document.createElement('div');
                newDiv.id = 'top-bar-options-button';
                newDiv.textContent = "Options";
                newDiv.classList.add("my-xing-toolbar-button");
                newDiv.onclick = function() {
                    SettingsPopup.show(function(newBansStr, newHiddenWordsStr) {
                        var newBans = newBansStr.split('\n').filter(function(item) {
                            return item.trim() !== '';
                        });
                        CompanyBans.setBansArray(newBans);

                        var newWords = newHiddenWordsStr.split('\n').filter(function(item) {
                            return item.trim() !== '';
                        });
                        HiddenJobs.setHiddenWords(newWords);
                    });
                };
                topBar.appendChild(newDiv);
            }
        }
        //console.log(topBar);
    }

    function isFreshJob(el) {
        var jobIsVisible = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        var jobIsSaved = !!(el.querySelector('button[data-cy=bookmark-action-button-filled]'));
        return jobIsVisible && !jobIsSaved;
    }

    function waitForLoadingToFinish(buttonLoadMore) {
        return new Promise(resolve => {
            const intervalId = setInterval(() => {
                const loadingIndicator = buttonLoadMore.querySelector('[class^=dot-loading-indicator-styles__DotLoadingIndicator]');
                if (!loadingIndicator) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 100);
        });
    }

    function hasVisibleJobs() {
        var allJobs = document.querySelectorAll('a[jobid]');
        var hasVisibleJobIds = Array.from(allJobs).some(isFreshJob);
        return hasVisibleJobIds;
    }

    function waitAllNodesUpdated() {
        return new Promise(resolve => {
            const intervalId = setInterval(() => {
                var nodes = findNodes();
                var hasFreshNodes = Array.from(nodes).some(n => !n.getAttribute('jobid'));
                if (!hasFreshNodes) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 100);
        });
    }

    function nowToStr() {
        return (new Date()).toLocaleTimeString();
    }

    async function oneLoadMoreIteration(buttonLoadMore) {
        var hasVisibleJobIds = hasVisibleJobs();
        var buttonIsLoading = !!(buttonLoadMore.querySelector('[class^=dot-loading-indicator-styles__DotLoadingIndicator]'));
        //console.log("Has new:", hasVisibleJobIds ? "YES" : "no");
        if (!buttonIsLoading && !hasVisibleJobIds) {
            console.log(nowToStr(), "Clicking on load more...");
            buttonLoadMore.click();
            await waitForLoadingToFinish(buttonLoadMore);
            console.log(nowToStr(), "Loading finished");
            await waitAllNodesUpdated();
            console.log(nowToStr(), "Nodes updated");
        }
    }

    async function loadAllJobs(buttonLoadMore) {
        let hasVisibleJobIds = hasVisibleJobs();
        while (!hasVisibleJobIds) {
            await oneLoadMoreIteration(buttonLoadMore);
            hasVisibleJobIds = hasVisibleJobs();
        }
    }

    function initBottomBar() {
        if (!document.getElementById('load-all-xing-button')) {
            var bottomBar = document.querySelector('[class^=lazy-loader__ConfinedContainer]');
            var buttonLoadMore = bottomBar.querySelector('button');
            var buttonIsLoading = !!(buttonLoadMore.querySelector('[class^=dot-loading-indicator-styles__DotLoadingIndicator]'));

            var newDiv = document.createElement('div');
            newDiv.id = 'load-all-xing-button';
            newDiv.classList.add("my-xing-toolbar-button");
            newDiv.textContent = "Load all";
            newDiv.onclick = async function() {
                await loadAllJobs(buttonLoadMore);
            };
            bottomBar.appendChild(newDiv);
        }
    }

    function init() {
        const css =
`
.my-xing-hide-button {
  border: 1px solid transparent;
  &:hover {
    border: 1px solid blue;
  }
}
.my-xing-hidden-node {
  opacity: 0.2;
  height: 120px;
  overflow: hidden;
}
.my-xing-autohide {
  background: rgba(255, 200, 200, 0.6);
  border-radius: 16px;
}
.my-xing-totally-hide .my-xing-hidden-node,
.my-xing-totally-hide .my-xing-autohide {
  display: none;
}
.my-xing-toolbar-button {
  border: 1px solid black;
  padding: 8px 4px;
  cursor: pointer;
  &:hover {
    border: 1px solid blue;
  }
}
a:has(button[data-cy=bookmark-action-button-filled]) {
  background: rgba(200, 255, 200, 0.3);
  border-radius: 16px;
}
`;

        // Inject the CSS using GM_addStyle
        GM_addStyle(css);

        if (!isInit() && !isInitializing) {
            Settings.init();
            SettingsPopup.init();
            HiddenJobs.init();
            CompanyBans.init();
            initTopBar();
            initBottomBar();
            console.log('searching nodes...');
            initNodes();
            clearInterval(initInterval);
        }
    }

    console.log('INIT...');
    initInterval = setInterval(init, 200);

})();