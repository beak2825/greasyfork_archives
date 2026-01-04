// ==UserScript==
// @name         MSPFA extras
// @namespace    http://tampermonkey.net/
// @version      1.15.7
// @description  Adds custom quality of life features to MSPFA.
// @author       seymour schlong
// @icon         https://github.com/SeymourSchlong/mspfaextras/blob/main/assets/ico.png?raw=true
// @icon64       https://github.com/SeymourSchlong/mspfaextras/blob/main/assets/ico.png?raw=true
// @match        https://mspfa.com/
// @match        https://mspfa.com/?*
// @match        https://mspfa.com/*/
// @match        https://mspfa.com/*/?*
// @match        https://mspfa.com/my/*
// @match        https://mspfa.com/random/
// @exclude      https://mspfa.com/js/*
// @exclude      https://mspfa.com/css/*
// @exclude      https://mspfa.com/rss/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396798/MSPFA%20extras.user.js
// @updateURL https://update.greasyfork.org/scripts/396798/MSPFA%20extras.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentVersion = "1.15.7";

    let settings = {};
    let drafts = {};
    let debug = false;
    let pageLoaded = false;

    // These are the default settings and whenever the script is updated, defaults are saved automatically.
    const defaultSettings = {
        autospoiler: false,
        style: 0,
        styleURL: "",
        night: false,
        pixelFix: false,
        intro: false,
        commandScroll: false,
        preload: true,
        navStick: false,
        spoilerValues: {},
        blocklist: [],
        autoDupeClean: false,
        autoCleanRead: -1,
        autoCleanUnread: -1,
        hidden: [],
        hideMessage: false,
        disableTextareaSelect: false,
        autosave: false,
        adventureSorting: 0,
        showFavs: false,
        newButtons: false,
        replaceFace: false,
        bookmarks: {},
        bookmarksEnabled: true,
        wideCode: false,
        shortcuts: {},
        colours: {},
        timestamp: false,
        timestamp24h: false
    }

    // Saves the options data for the script.
    const saveSettings = () => {
        localStorage.mspfaextra = JSON.stringify(settings);
        if (debug) {
            console.log('Settings:');
            console.log(settings);
        }
    };

    // Saves the data for drafts
    const saveDrafts = (data) => {
        localStorage.mspfadrafts = JSON.stringify(data);
        if (debug) {
            console.log('Drafts:');
            console.log(data);
        }
    };

    const loadDrafts = () => {
        if (localStorage.mspfadrafts) {
            drafts = JSON.parse(localStorage.mspfadrafts);
        }
    }
    loadDrafts();

    const loadSettings = () => {
        if (localStorage.mspfaextra) {
            Object.assign(settings, JSON.parse(localStorage.mspfaextra));
        }
    }

    // Load any previous settings from localStorage
    if (localStorage.mspfaextra) {
        Object.assign(settings, JSON.parse(localStorage.mspfaextra));

        // Get draft data from settings
        if (typeof settings.drafts === "object") {
            if (Object.keys(settings.drafts).length > 0 && Object.keys(drafts).length === 0) {
                drafts = settings.drafts;
            }
        }
        saveDrafts(drafts);
    }

    // If any settings are undefined, re-set to their default state. (For older users when new things get stored)
    const checkSettings = () => {
        const defaultSettingsKeys = Object.keys(defaultSettings);
        for (let i = 0; i < defaultSettingsKeys.length; i++) {
            if (typeof settings[defaultSettingsKeys[i]] === "undefined") {
                settings[defaultSettingsKeys[i]] = defaultSettings[defaultSettingsKeys[i]];
            }
        }
        saveSettings();
    }

    checkSettings();

    // A general function that allows for waiting until a certain element appears on the page.
    const pageLoad = (fn, length) => {
        const interval = setInterval(() => {
            if (fn()) clearInterval(interval);
        }, length ? length*1000 : 500);
    }

    const createElement = (type, attributes) => {
        const elm = document.createElement(type);
        return Object.assign(elm, attributes);
    }

    const textNode = (text) => {
        return document.createTextNode(text);
    }

    // Reload the page if error page appears
    if (document.querySelector('#cf-wrapper') || document.querySelector('address')) {
        window.location.reload();
    }
    window.addEventListener("load", () => {
        // Wait a minute, then refresh the page
        if (document.body.textContent === "Your client is sending data to MSPFA too quickly. Wait a moment before continuing.") {
            setTimeout(() => {
                window.location.reload();
            }, 60000);
        }

        pageLoaded = true;
    });

    // Stop working if MSPFA.BBC does not exist. This should ideally only occur once the new site is released so as not to break anything.
    if (window.MSPFA && window.MSPFA.BBC) {
        console.log(`MSPFA extras script v${currentVersion} by seymour schlong`);

        /**
        * https://github.com/GrantGryczan/MSPFA/projects/1?fullscreen=true
        * Github to-do completion list (and other stuff too) - mm/dd/yy
        *
        * https://github.com/GrantGryczan/MSPFA/issues/26 - Dropdown menu                   - 02/23/2020
        * https://github.com/GrantGryczan/MSPFA/issues/18 - MSPFA themes                    - 02/23/2020
        * https://github.com/GrantGryczan/MSPFA/issues/32 - Adventure creation dates        - 02/23/2020
        * https://github.com/GrantGryczan/MSPFA/issues/32 - User creation dates             - 02/23/2020
        * https://github.com/GrantGryczan/MSPFA/issues/40 - Turn certain buttons into links - 07/21/2020
        * https://github.com/GrantGryczan/MSPFA/issues/41 - Word and character count        - 07/21/2020
        * https://github.com/GrantGryczan/MSPFA/issues/57 - Default spoiler values          - 08/07/2020
        * https://github.com/GrantGryczan/MSPFA/issues/62 - Buttonless spoilers             - 08/07/2020
        * https://github.com/GrantGryczan/MSPFA/issues/52 - Hash URLs                       - 08/08/2020
        *                                                 - Page drafts                     - 08/08/2020
        *                                                 - Edit pages button               - 08/08/2020
        *                                                 - Image preloading                - 08/20/2020
        * https://github.com/GrantGryczan/MSPFA/issues/19 - Manage game saves               - 08/22/2020
        * https://github.com/GrantGryczan/MSPFA/issues/38 - User search page                - 11/02/2020
        *                                                 - Sticky nav bar                  - 01/23/2021
        *                                                 - Keyboard shortcuts              - 02/05/2021
        *                                                 - Exporting your adventures       - 10/03/2020
        *                                                 - Blocking users                  - 11/17/2021
        *                                                 - Hiding adventures locally       - 01/11/2022
        *                                                 - Customizable homepage           - 02/12/2022
        *                                                 - Autosaving                      - 03/07/2022
        *                                                 - My Adventures Sorting           - 03/07/2022
        *                                                 - Show fav count in My Adventures - 03/07/2022
        *                                                 - Bookmarking multiple pages      - 04/19/2022
        *
        * Extension to-do... maybe...
        *
        * If trying to save a page and any other save button is not disabled, ask the user if they would rather Save All instead, or prompt to disable update notifications.
        *     When adding a new page, store it in an array and if that array length is > 1 when someone tries to save, prompt them to press Save All?
        */

        // Encases an element within a link
        const addLink = (elm, url, target) => {
            const link = document.createElement('a');
            link.href = url;
            link.draggable = false;
            if (elm.parentNode) elm.parentNode.insertBefore(link, elm);
            if (target) link.target = target;
            link.appendChild(elm);
            return link;
        };

        // Easy br element
        const newBr = () => {
            return document.createElement('br');
        }

        // Add multiple children to an element easily
        const addChildren = (elm, children) => {
            children.forEach(c => {
                elm.appendChild(c);
            });

            return elm;
        }

        const clearListeners = (elm) => {
            let clone = elm.cloneNode(1);
            elm.parentNode.replaceChild(clone, elm);
            return clone;
        }

        // Make creating label elements easier
        const createLabel = (text, id) => {
            const newLabel = document.createElement('label');
            newLabel.textContent = text;
            newLabel.setAttribute('for', id);
            return newLabel;
        }

        const getDateString = (time, spliceSection = 3) => {
            return new Date(time).toString().split(' ').splice(1, spliceSection).join(' ');
        }

        // Function that turns a date into relative time
        const getRelativeTime = (time) => {
            let timeDiff = new Date() - time;
            const futureTime = timeDiff < 0;
            timeDiff = Math.abs(timeDiff);
            let unitValue = 12*30*24*60*60*1000;
            let unitPassed;
            let unit = 'unit';

            const values = [1, 12, 30, 24, 60, 60];
            const units = ['year', 'month', 'day', 'hour', 'minute', 'second'];

            for (let i = 0; i < values.length; i++) {
                unitValue /= values[i];
                unitPassed = Math.floor(timeDiff / (unitValue));
                unit = units[i];

                if (unitPassed) break;
            }
            unitPassed = Math.abs(unitPassed);
            if (futureTime) {
                return `In ${unitPassed} ${unit}${unitPassed === 1 ? '' : 's'}`;
            }
            return `${unitPassed} ${unit}${unitPassed === 1 ? '' : 's'} ago`;
        }

        if (GM_info && GM_info.scriptHandler !== "Tampermonkey" && !settings.warned) {
            alert(`It appears that you're running the MSPFA extras script with ${GM_info.scriptHandler}.\nUnfortunately, this script cannot run at its full potential because of that.\nTry switching to Tampermonkey if you want to use more of the features!\n(this message will only appear once.)`);
            settings.warned = true;
            saveSettings();
        }

        // Enable the sticky nav bar (scrolls with you)
        if (settings.navStick) {
            pageLoad(() => {
                const formIDs = {
                    '/stories/': '#explore',
                    '/my/profile/': '#editprofile',
                    '/my/settings/': '#editsettings',
                    '/my/stories/info/': '#editstory',
                    '/my/stories/pages/': '#editpages',
                    '/my/messages/new/': '#newmessage'
                }

                const nav = document.querySelector('nav');
                if (nav) {
                    if (location.pathname === '/' && location.search && params.s || location.pathname === '/preview/') {
                        const slide = document.querySelector('#slide');
                        slide.parentNode.insertBefore(nav, slide.parentNode.firstChild);
                    } else {
                        const parentDiv = document.createElement('div');
                        if (document.querySelector('#livetoolbar')) {
                            return; // Don't run the sticky nav script if the live editor is enabled
                        }

                        parentDiv.appendChild(nav);
                        document.querySelectorAll('.alert').forEach(banner => {
                            parentDiv.appendChild(banner);
                        });

                        if (formIDs[location.pathname]) {
                            const container = document.querySelector(formIDs[location.pathname]);
                            container.parentNode.insertBefore(parentDiv, container);
                            parentDiv.appendChild(container);
                        } else {
                            const containers = document.querySelectorAll('#main > table.container');

                            containers[0].parentNode.insertBefore(parentDiv, containers[0]);
                            document.querySelectorAll('.banner').forEach(b => {
                                parentDiv.appendChild(b);
                            });
                            containers.forEach(c => {
                                parentDiv.appendChild(c);
                            });

                            const groupshot = document.querySelector('#groupShotContainer');
                            if (groupshot) {
                                containers[0].parentNode.insertBefore(groupshot, containers[0]);
                            }

                            if (settings.carouselBanners) {
                                const frontPageBanners = document.querySelectorAll('.banner');
                                if (frontPageBanners[2]) {
                                    const bannerContainer = createElement('div', { id: 'mspfae-carousel-container', style: 'max-height: 180px;overflow: hidden;' });
                                    const movingPart = createElement('div', { id: 'mspfae-carousel-inner', style: 'transform: translateY(-90px);' });
                                    bannerContainer.appendChild(movingPart);

                                    frontPageBanners[0].parentNode.insertBefore(bannerContainer, frontPageBanners[0]);
                                    frontPageBanners.forEach(b => {
                                        movingPart.appendChild(b);
                                    });

                                    const randomizedNumber = Math.floor(Math.random() * frontPageBanners.length);

                                    console.log(randomizedNumber);

                                    for (let i = 0; i < randomizedNumber; i++) {
                                        movingPart.appendChild(frontPageBanners[i]);
                                    }

                                    bannerContainer.appendChild(createElement('style', { textContent: '#mspfae-carousel-inner:not(.notransition) {transition: 0.75s cubic-bezier(0.5, 0, 0.5, 1);}' }));

                                    let step = 0.5;

                                    const carouselInterval = setInterval(() => {
                                        step += 0.5;
                                        if (!(step % 1)) {
                                            movingPart.classList.add('notransition');
                                            movingPart.appendChild(movingPart.firstChild);
                                            movingPart.style.transform = 'translateY(0px)';
                                        } else {
                                            movingPart.classList.remove('notransition');
                                            movingPart.style.transform = 'translateY(-90px)';
                                        }
                                    }, 4000);
                                }
                            }
                        }
                    }
                    nav.className = 'nav-sticky';
                    return true;
                }
            });
        }

        // Scrolls you to where you need to be
        const hashSearch = location.href.replace(location.origin + location.pathname, '').replace(location.search, '');
        if (hashSearch !== '' && location.href !== "/my/stories/pages/") {
            pageLoad(() => {
                const idElement = document.querySelector(hashSearch);
                if (idElement) {
                    const selected = document.querySelector(hashSearch);
                    selected.scrollIntoView();
                    selected.style.outline = '3px solid black';
                    selected.style.transition = '0.5s';
                    pageLoad(() => {
                        if (pageLoaded) {
                            selected.style.outline = '0px solid black';
                        }
                    });

                    return true;
                }
            }, 1);
        }

        // Ripped shamelessly right from mspfa lol (URL search parameters -- story ID, page num, etc.)
        let rawParams;
        if (location.href.indexOf("#") != -1) {
            rawParams = location.href.slice(0, location.href.indexOf("#"));
        } else {
            rawParams = location.href;
        }
        if (rawParams.indexOf("?") != -1) {
            rawParams = rawParams.slice(rawParams.indexOf("?") + 1).split("&");
        } else {
            rawParams = [];
        }
        const params = {};
        for (let i = 0; i < rawParams.length; i++) {
            try {
                const p = rawParams[i].split("=");
                params[p[0]] = decodeURIComponent(p[1]);
            } catch (err) {}
        }

        // Show the URL params if in "debug" mode
        if (debug) {
            console.log('URL parameters:');
            console.log(params);
        }

        // Replace MSPFA header and fancy title to link to the custom homepage instead
        if (settings.replaceFace) {
            const mspfalogo = document.querySelector('header .mspfalogo');
            if (mspfalogo) mspfalogo.parentNode.href = '/?s=36596&p=8';
            const flashyTitle = document.querySelector('#flashytitle');
            if (flashyTitle) flashyTitle.parentNode.href = '/?s=36596&p=8';
        }

        // Delete any unchanged spoiler values
        if (location.pathname !== "/my/stories/pages/") {
            // Go through spoiler values and remove any that aren't unique
            Object.keys(settings.spoilerValues).forEach(adventure => {
                const values = settings.spoilerValues[adventure];
                if (values.open === "Show" && values.close === "Hide" || !values.open && !values.close) {
                    delete settings.spoilerValues[adventure];
                }
            });
        }

        const styles = [
            { name: 'Standard', link: '' },
            { name: 'Low Contrast', link: '/css/theme1.css' },
            { name: 'Light', link: '/css/theme2.css' },
            { name: 'Dark', link: 'https://file.garden/W1K6HZQ1fV1iP3Sq/mspfa/themes/dark.css' },
            { name: 'Felt', link: '/css/theme4.css' },
            { name: 'Trickster', link: '/css/theme5.css' },
            { name: 'Custom', link: '' },
        ];

        const createDropdown = (parent, isExplore) => {
            const dropDiv = createElement('div', { className: 'dropdown', style: 'display: inline-block;' });

            const dropContent = createElement('div', { className: 'dropdown-content', style: 'display: none;' });

            dropDiv.addEventListener('mouseenter', evt => {
                dropContent.style.display = 'block';
                dropContent.style.color = getComputedStyle(parent).color;
                dropContent.style.backgroundImage = getComputedStyle(parent.parentNode.parentNode).backgroundImage;

                dropContent.querySelectorAll('a').forEach(link => {
                    link.style.color = getComputedStyle(parent).color;
                    link.style.fontSize = getComputedStyle(parent, 'after').fontSize;
                });
            });

            if (!isExplore) {
                dropDiv.addEventListener('mouseleave', evt => {
                    dropContent.style.display = 'none';
                });
            }

            parent.parentNode.insertBefore(dropDiv, parent);
            dropDiv.appendChild(parent);
            dropDiv.appendChild(dropContent);
            return [dropDiv, dropContent];
        }

        const msgDupeList = {};
        if (localStorage.mspfaeMessageDupes) {
            Object.assign(msgDupeList, JSON.parse(localStorage.mspfaeMessageDupes));
        }

        const messageCleanup = () => {
            let msgCount;
            let readOrDeleted = 0;
            let dupeList = {};

            window.MSPFA.request(1, {
                do: "allmsgs"
            }, (m) => {
                msgCount = m.s.length;

                // Sort the messages by date sent instead of by ID.
                m.s.sort((a, b) => a.d - b.d);

                // Remove update counters from memory if the message has been deleted.
                const msgIdList = m.s.map(msgs => msgs.i);
                Object.keys(msgDupeList).forEach(key => {
                    if (msgIdList.indexOf(+key) === -1) {
                        delete msgDupeList[key];
                    }
                });

                m.s.forEach(msg => {
                    const deleted = {};

                    const deleteMessage = (id, reason, message) => {
                        if (!deleted[reason]) deleted[reason] = [];
                        deleted[reason].push(message);

                        window.MSPFA.request(1, {
                            do: "deletemsg",
                            m: id
                        }, () => {
                            //if (!deleted[reason]) deleted[reason] = [];
                            //deleted[reason].push(message);
                            //console.log('Deleted a' + reason + '.\nView message:');
                            //console.log([message]);
                        });
                    }

                    if (msg.r) {
                        readOrDeleted++;

                        if (settings.autoCleanRead > -1) {
                            if (msg.f === '-1' && msg.s.toLowerCase().startsWith("new update: ")) {
                                if (new Date() - msg.d > (1000 * 60 * 60 * 24) * settings.autoCleanRead) {
                                    deleteMessage(msg.i, 'old_read', msg);
                                }
                            }
                        }
                    } else {
                        if (settings.autoCleanUnread > -1) {
                            if (msg.f === '-1' && msg.s.toLowerCase().startsWith("new update: ")) {
                                if (new Date() - msg.d > (1000 * 60 * 60 * 24) * settings.autoCleanUnread) {
                                    deleteMessage(msg.i, 'old_read', msg);
                                }
                            }
                        }
                        if (settings.blocklist.indexOf(msg.f) !== -1) {
                            deleteMessage(msg.i, 'blocked', msg);
                            readOrDeleted++;
                        }
                        if (settings.autoDupeClean) {
                            if (msg.f === '-1' && msg.s.toLowerCase().startsWith("new update: ")) {
                                const storyId = /\[url=\/\?s=(\d+?)&p=(?:\d+?)\]/.exec(msg.b)[1];
                                const pageBounds = /Pages? (?:(\d{1,})-)?(\d{1,})/.exec(msg.b);
                                // If there is no entry in the dupe list...
                                if (!dupeList[storyId]) {
                                    dupeList[storyId] = msg.i;
                                    // If there is no entry in the stored message list...
                                    if (!msgDupeList[msg.i]) {
                                        msgDupeList[msg.i] = +pageBounds[2];
                                    }
                                } else {
                                    deleteMessage(msg.i, 'dupe_update', msg);
                                    // Store the highest number between the current index vs the current stored number.
                                    msgDupeList[dupeList[storyId]] = Math.max(+msgDupeList[dupeList[storyId]], +pageBounds[2]);
                                    readOrDeleted++;
                                }
                            }
                        }
                    }

                    if (Object.keys(deleted).length > 0) {
                        console.log("List of recently deleted messages:");
                        console.log(deleted);
                    }
                });

                // save the missed page count here.
                localStorage.mspfaeMessageDupes = JSON.stringify(msgDupeList);

                const notifBubble = document.querySelector('#notification');
                notifBubble.style.display = (msgCount - readOrDeleted) > 0 ? '' : 'none';
                notifBubble.textContent = msgCount - readOrDeleted;

                if (location.pathname === "/my/") {
                    document.querySelector('#messages').textContent = `Messages${msgCount - readOrDeleted === 0 ? '' : ` (${msgCount - readOrDeleted})`}`;
                }
            });
        }

        const mspfaHomeLink = document.querySelector('nav a[href="/"]');
        if (mspfaHomeLink) {
            const dropContent = createDropdown(mspfaHomeLink)[1];

            if (settings.replaceFace) {
                mspfaHomeLink.href = '/?s=36596&p=8';
                dropContent.appendChild(createElement('a', { textContent: 'Default Homepage', href: '/?d=1' }));
            } else {
                dropContent.appendChild(createElement('a', { textContent: 'Custom Homepage', href: '/?s=36596&p=8' }));
            }
        }

        // "MY MSPFA" dropdown
        const myLink = document.querySelector('nav a[href="/my/"]');
        if (myLink) {
            const dropContent = createDropdown(myLink)[1];
            const dData = [
                {elm: null, text: 'Messages', link: '/my/messages/'},
                {elm: null, text: 'My Adventures', link: '/my/stories/'},
                {elm: null, text: 'My Favourites', link: '/favs/?u='},
                {elm: null, text: 'My Profile', link: '/user/?u='},
                {elm: null, text: 'Settings', link: '/my/settings/'},
            ];

            for (let i = 0; i < dData.length; i++) {
                dData[i].elm = createElement('a', { textContent: dData[i].text, href: dData[i].link });
                dropContent.appendChild(dData[i].elm);
                if (i === 2 || i === 3) dData[i].elm.style.display = 'none';
            }

            // Append "My Profile" to the dropdown list if you're signed in
            if (window.MSPFA.me.n) {
                dData[2].elm.href += window.MSPFA.me.i;
                dData[3].elm.href += window.MSPFA.me.i;
                dData[2].elm.style.display = dData[3].elm.style.display = '';

                if (!location.pathname.startsWith("/my/messages/") && (settings.blocklist.length !== 0 || settings.autoDupeClean || settings.autoCleanRead !== -1 || settings.autoCleanUnread !== -1)) {
                    const notificationBubble = document.querySelector('#notification');
                    setTimeout(() => {
                        messageCleanup();
                    }, 1000);
                    setInterval(() => {
                        if (notificationBubble.style === '') {
                            messageCleanup();
                        }
                    }, 30000);
                }
            }
        }

        // "RANDOM" dropdown
        //* disabled since heroku suckin balls!
        const randomLink = document.querySelector('nav a[href="/random/"]');
        if (randomLink) {

            (async () => {
                return;
                const newLink = createElement('a', { textContent: 'Recent ongoing', href: await fetch(`https://mspfa-extras-random.vercel.app/api/random/`).then(e => e.text()) });

                if (!newLink.href.includes('?s=1&')) {
                    // Thank you @MadCreativity 🙏
                    const dropContent = createDropdown(randomLink)[1];
                    dropContent.appendChild(newLink);
                }
            })();
        }

        // "EXPLORE" dropdown
        const exploreLink = document.querySelector('nav a[href="/stories/"');
        if (exploreLink) {
            const dropdown = createDropdown(exploreLink, true);
            const dropDiv = dropdown[0];
            const dropContent = dropdown[1];

            const exploreInput = createElement('input', { type: 'text', placeholder: 'Search...', id: 'dropdown-explore' });

            addChildren(dropContent, [
                createElement('a', {textContent: 'Advanced Search', href: '/?s=36596&p=3'}),
                createElement('a', {textContent: 'User Search', href: '/?s=36596&p=7'}),
                exploreInput
            ]);

            exploreInput.addEventListener('keydown', ke => {
                if (ke.code === 'Enter') {
                    const searchLink = `/?s=36596&p=3`;
                    localStorage.customsearchfor = JSON.stringify({ name: exploreInput.value });
                    if (ke.altKey || ke.ctrlKey) {
                        window.open(searchLink, '_blank').focus();
                    } else {
                        location.href = searchLink;
                    }
                    return;
                }
            });
            const exploreInputFn = () => {
                if (document.activeElement !== exploreInput) {
                    dropContent.style.display = 'none';
                }
            }
            dropDiv.addEventListener('mouseleave', exploreInputFn);
            document.body.addEventListener('click', exploreInputFn);
        }

        document.querySelector('header .mspfalogo').parentNode.draggable = false;
        addLink(document.querySelector('footer .mspfalogo'), 'javascript://');

        // Message that shows when you first get the script
        const showIntroDialog = () => {
            const msg = window.MSPFA.parseBBCode('Hi! Thanks for installing this script!\n\nBe sure to check the [url=https://greasyfork.org/en/scripts/396798-mspfa-extras#additional-info]GreasyFork[/url] page to see a full list of features, and don\'t forget to check out your [url=https://mspfa.com/my/settings/#extraSettings]settings[/url] page to tweak things to how you want.\n\nIf you have any suggestions, or you find a bug, please be sure to let me know on Discord at [url=discord://discordapp.com/users/277928549866799125]@seymourschlong[/url].\n\n[size=12]This dialog will only appear once. To view it again, click "View Script Message" at the bottom of the site.[/size]');
            window.MSPFA.dialog("MSPFA extras v" + currentVersion, msg, ["Okay"]);
        }

        // Check if show intro dialog has displayed
        if (!settings.intro) {
            pageLoad(() => {
                if (window.MSPFA) {
                    showIntroDialog();
                    settings.intro = true;
                    saveSettings();
                    return true;
                }
            });
        }

        const setTitle = (t, s) => {
            document.title = t + (s ? " - MS Paint Fan Adventures" : "");
        }

        const details = document.querySelector('#details');

        // Add 'link' at the bottom to show the intro dialog again
        const introLink = createElement('a', { textContent: 'View Script Message', href: 'javascript://' });
        introLink.addEventListener('click', showIntroDialog);
        details.appendChild(introLink);

        // Theme stuff
        const theme = createElement('link', { id: 'theme', type: 'text/css', rel: 'stylesheet' });
        const updateTheme = (src) => {
            theme.href = src;
        }
        if (!document.querySelector('#theme')) {
            document.querySelector('head').appendChild(theme);
            if (settings.night) {
                updateTheme(styles[3].link);
            } else {
                updateTheme(settings.style == styles.length - 1 ? settings.styleURL : styles[settings.style].link);
            }
        }

        const pixelText = () => {
            return settings.pixelFix ? 'body { image-rendering: pixelated; image-rendering: -moz-crisp-edges; } .cellicon, #groupShotContainer { image-rendering: initial !important; image-rendering: -webkit-optimize-contrast !important; }' : '';
        }

        // Dropdown menu and pixelated scaling
        document.querySelector('head').appendChild(createElement('link', { id: 'script-css', type: 'text/css', rel: 'stylesheet', href: 'https://seymourschlong.github.io/mspfaextras/mspfae.css' }));

        // new icons
        if (settings.newButtons) {
            document.querySelector('head').appendChild(createElement('link', { id: 'button-css', type: 'text/css', rel: 'stylesheet', href: 'https://seymourschlong.github.io/mspfaextras/buttonreplacement.css' }));
        }

        const extraStyle = document.createElement('style');
        if (!document.querySelector('#extra-style')) {
            extraStyle.id = 'extra-style';
            extraStyle.textContent = pixelText();
            document.querySelector('head').appendChild(extraStyle);
        }

        let nightSwitch = [];

        // Enabling night mode.
        document.querySelector('footer .mspfalogo').addEventListener('click', evt => {
            settings.night = !settings.night;
            saveSettings();

            for (let i = 0; i < nightSwitch.length; i++) {
                clearTimeout(nightSwitch[i]);
            }
            nightSwitch = [];

            // Transition to make it feel nicer on the eyes
            extraStyle.textContent = pixelText();
            extraStyle.textContent = pixelText() + ' *{transition:1.5s;}';

            if (settings.night) {
                updateTheme(styles[3].link);
            } else {
                updateTheme(settings.style == styles.length - 1 ? settings.styleURL : styles[settings.style].link);
            }

            nightSwitch.push(setTimeout(() => {
                extraStyle.textContent = pixelText();
            }, 1500));
        });

        // Enable keyboard controls for some dialog boxes (enter/esc to accept/close)
        const dialog = document.querySelector('#dialog');
        const dialogTitle = dialog.querySelector('div.major');
        document.addEventListener('keydown', evt => {
            if (/*settings.dialogKeys && */!dialog.textContent.includes('BBCode')) {
                if (dialog.style.display === '' && (evt.code === 'Enter' || evt.code === "Escape")) {
                    let buttons = dialog.querySelectorAll('button');
                    if (buttons.length === 1) {
                        buttons[0].click();
                    } else if (buttons.length === 2) {
                        if (["Okay", "Yes"].indexOf(buttons[0].textContent) !== -1 && evt.code === "Enter") {
                            buttons[0].click();
                        }
                    }
                    if (["Cancel", "Close", "No"].indexOf(buttons[buttons.length - 1].textContent) !== -1 && evt.code === "Escape") {
                        buttons[buttons.length - 1].click();
                    }
                }
            }
        });

        const dialogOnOpen = [];
        const dialogOnClose = [];

        const dialogObserver = new MutationObserver((muts) => {
            muts.forEach(mutation => {
                if (mutation.type === 'childList') {
                    if (mutation.target.textContent === '') {
                        dialogOnClose.forEach(fn => {
                            if (fn) fn(dialogTitle, dialog);
                        });
                    } else {
                        dialogOnOpen.forEach(fn => {
                            if (fn) fn(dialogTitle, dialog);
                        });
                    }
                }
            });
        });
        dialogObserver.observe(dialogTitle, { childList: true });

        if (location.pathname.includes('//')) {
            location.href = location.pathname.replace(/\/\//g, '/') + location.search;
        }

        if (location.pathname === "/" || location.pathname === "/preview/") {
            if (location.search && params.s) {
                if (params.n && params.s === "36596" && params.p === "3") {
                    pageLoad(() => {
                        const storyTitle = document.querySelector('#storytitle');
                        if (storyTitle) {
                            storyTitle.value = params.n;
                            document.querySelector('input[value="Search!"]').click();
                            return true;
                        }
                    });
                }

                // Remove the current theme if the adventure has CSS (to prevent conflicts);
                if (settings.style > 0) {
                    pageLoad(() => {
                        if (window.MSPFA) {
                            if (window.MSPFA.story && window.MSPFA.story.y && (window.MSPFA.story.y.toLowerCase().includes('import') || window.MSPFA.story.y.includes('{'))) {
                                if (!settings.night) updateTheme('');
                                return true;
                            }
                        }
                        if (pageLoaded) return true;
                    });
                }

                const excludedElements = ['audio', 'video', 'iframe'];
                const getPreloadImages = (code) => {
                    let e = document.createElement("span");
                    e.innerHTML = code.replace(window.MSPFA.BBC[17][0], window.MSPFA.BBC[17][1]).replace(window.MSPFA.BBC[18][0], window.MSPFA.BBC[18][1]);
                    let images = e.querySelectorAll("img");
                    for (let t of excludedElements) {
                        e.querySelectorAll(t).forEach(elm => elm.parentNode.removeChild(elm));
                    }
                    e = '';
                    return images;
                }

                // Preload adjacent pages
                const preloadImages = document.createElement('div');
                preloadImages.id = 'preload';
                preloadImages.style.display = 'none';
                document.querySelector('#container').appendChild(preloadImages);

                // Automatic saving
                let maxPage = params.p;
                if (settings.autosave) {
                    if (window.MSPFA.me.g) {
                        maxPage = window.MSPFA.me.g[window.MSPFA.story.i] || 0;
                    }
                }

                const timestampSpan = createElement('span', { style: 'font-size: 10px; font-weight: normal;' });
                const stampContainer = createElement('div', { style: 'float: right;' });
                stampContainer.appendChild(timestampSpan);
                document.querySelector('#gamelinks').insertAdjacentElement('afterEnd', stampContainer);

                const leadZero = (number, count = 2) => {
                    return number.toString().padStart(2, "0");
                }

                const addTimestamp = (p) => {
                    const date = new Date(window.MSPFA.story.p[p-1].d);
                    let pageTime = (date.getHours() % 12 ? leadZero(date.getHours() % 12) : 12) + ':' + leadZero(date.getMinutes()) + ' ' + (date.getHours() >= 12 ? 'PM' : 'AM')
                    if (settings.timestamp24h) {
                        pageTime = (leadZero(date.getHours())) + ':' + leadZero(date.getMinutes());
                    }
                    const pageDate = [leadZero(date.getMonth() + 1), leadZero(date.getDate()), date.getFullYear()].join('/');
                    timestampSpan.textContent = [pageDate, pageTime].join(', ');
                    timestampSpan.title = getRelativeTime(date);
                }

                // spoiler opening, image preloads, autosaving, and timestamps
                window.MSPFA.slide.push((p) => {
                    if (settings.preload) {
                        preloadImages.innerHTML = '';
                        if (window.MSPFA.story.p[p-2]) {
                            getPreloadImages(window.MSPFA.story.p[p-2].b).forEach(image => {
                                preloadImages.appendChild(image);
                            });
                        }
                        if (window.MSPFA.story.p[p]) {
                            getPreloadImages(window.MSPFA.story.p[p].b).forEach(image => {
                                preloadImages.appendChild(image);
                            });
                        }
                    }

                    if (settings.autospoiler) document.querySelectorAll('#content .spoiler:not(.open):not(.ignoreAuto) > div:first-child > input').forEach(sb => sb.click());

                    // Game autosaving
                    if (settings.autosave) {
                        if (window.MSPFA.me.g) {
                            if (p > maxPage) {
                                maxPage = p;
                                window.MSPFA.request(1, {
                                    do: "game",
                                    s: window.MSPFA.story.i,
                                    p: maxPage,
                                    g: "save"
                                });
                            }
                        }
                    }

                    if (settings.timestamp && location.pathname !== "/preview/") {
                        addTimestamp(p);
                    }
                });

                // Scroll up to the nav bar when changing page so you don't have to scroll down as much =)
                if (settings.commandScroll) {
                    let heightTop = document.querySelector('header').getBoundingClientRect().height;
                    let temp = -2; // To prevent moving the page down when loading it for the first time
                    window.MSPFA.slide.push((p) => {
                        if (temp < 0) {
                            temp++;
                        } else {
                            window.scroll(0, heightTop);
                            heightTop = document.querySelector('header').getBoundingClientRect().height;
                        }
                    });
                }

                // Show creation date
                pageLoad(() => {
                    const infoTd = document.querySelector('#infobox tr td:nth-child(2)');
                    const dateSpan = createElement('span', { id: 'escript-dates' });
                    if (infoTd) {
                        const lastPageUpdate = window.MSPFA.story.p[window.MSPFA.story.p.length-1].d;

                        addChildren(dateSpan, [
                            createElement('span', { textContent: 'Creation date: ' + getDateString(window.MSPFA.story.d), title: getRelativeTime(window.MSPFA.story.d) }),
                            newBr(),
                            createElement('span', { textContent: 'Last update: ' + getDateString(lastPageUpdate), title: getRelativeTime(lastPageUpdate) })
                        ]);
                        infoTd.appendChild(dateSpan);
                        return true;
                    }
                });

                // Hash scrolling and opening infobox or commmentbox
                if (['#infobox', '#commentbox', '#newcomment', '#latestpages'].indexOf(hashSearch) !== -1) {
                    pageLoad(() => {
                        if (document.querySelector(hashSearch)) {
                            if (hashSearch === '#infobox') {
                                document.querySelector('input[data-open="Show Adventure Info"]').click();
                            } else if (hashSearch === '#commentbox' || hashSearch === '#newcomment') {
                                document.querySelector('input[data-open="Show Comments"]').click();
                            } else if (hashSearch === '#latestpages') {
                                document.querySelector('input[data-open="Show Adventure Info"]').click();
                                document.querySelector('input[data-open="Show Latest Pages"]').click();
                            }
                            return true;
                        }
                    });
                }

                if (settings.bookmarksEnabled) {
                    // Add bookmark to nav
                    const bookmarkNav = createElement('a', { textContent: 'Bookmark', style: 'color: #2cff4b;', href: 'javascript:void(0)' });
                    const searchNav = document.querySelector('nav a[href^="/search/"]');
                    searchNav.insertAdjacentElement('afterend', bookmarkNav);
                    searchNav.parentNode.insertBefore(textNode(' '), searchNav.nextSibling);
                    searchNav.insertAdjacentElement('afterend', document.querySelector('.vbar').cloneNode(1));
                    searchNav.parentNode.insertBefore(textNode(' '), searchNav.nextSibling);

                    // Create bookmark dropdown
                    createDropdown(bookmarkNav)[1].appendChild(createElement('a', { textContent: 'View Bookmarks', href: '/?s=36596&p=10' }));

                    bookmarkNav.addEventListener('click', () => {
                        loadSettings();
                        if (!settings.bookmarks[params.s]) {
                            settings.bookmarks[params.s] = [];
                        }
                        if (settings.bookmarks[params.s].indexOf(window.MSPFA.p) === -1) {
                            settings.bookmarks[params.s].push(window.MSPFA.p);
                        }
                        settings.bookmarks[params.s] = settings.bookmarks[params.s].sort((a, b) => a-b);
                        saveSettings();
                    });
                }

                // Turn buttons into links
                const pageButton = createElement('button', { className: 'pages edit major', type: 'button', title: 'Edit Pages' });
                const pageLink = addLink(pageButton, `/my/stories/pages/?s=${params.s}&p=${params.p}`);

                // Edit pages button & button link
                pageLoad(() => {
                    const infoButton = document.querySelector('.edit.major');
                    if (infoButton) {
                        if (window.MSPFA.me.i) {
                            // Change notify and favourite titles to make sense
                            document.querySelector('.notify.major').title = 'Toggle Notifications';
                            const favButton = document.querySelector('.fav.major');
                            let fav = favButton.className.includes(' lit');
                            const changeTitle = () => {
                                if (fav) {
                                    favButton.title = 'Unfavorite';
                                } else {
                                    favButton.title = 'Favorite';
                                }
                            }
                            changeTitle();
                            favButton.addEventListener('click', () => {
                                fav = !fav;
                                changeTitle();
                            });

                            infoButton.title = "Edit Info";
                            infoButton.parentNode.insertBefore(pageLink, infoButton);
                            infoButton.parentNode.insertBefore(textNode(' '), infoButton);
                            addLink(infoButton, `/my/stories/info/?s=${params.s}`);
                            pageButton.style.display = document.querySelector('.edit.major:not(.pages)').style.display;

                            // Change change page link when switching pages
                            window.MSPFA.slide.push(p => {
                                const newSearch = location.search.split('&p=');
                                pageLink.href = `/my/stories/pages/?s=${params.s}&p=${newSearch[1].split('#')[0]}`;
                            });
                        }

                        window.addEventListener('load', () => {
                            addLink(clearListeners(document.querySelector('.rss.major')), `/rss/?s=${params.s}`);
                        });
                        return true;
                    }
                });

                // Add "Reply" button next to comment gear
                setInterval(() => {
                    if (document.querySelector('#commentbox > .spoiler.open')) {
                        document.querySelectorAll('.gear').forEach(gear => {
                            if (!gear.parentNode.querySelector('.reply')) {
                                const replyDiv = document.createElement('div');
                                replyDiv.className = 'reply';
                                gear.insertAdjacentElement('afterEnd', replyDiv);
                                gear.insertAdjacentHTML('afterEnd', '<span style="float: right"> </span>');
                                const userID = gear.parentNode.parentNode.classList[2].replace('u', '');

                                replyDiv.addEventListener('click', () => {
                                    const commentBox = document.querySelector('#commentbox textarea');
                                    commentBox.value = `[user]${userID}[/user], ${commentBox.value}`;
                                    commentBox.focus();
                                    commentBox.parentNode.scrollIntoView();
                                });
                            }
                        });
                    }
                }, 500);

                // Turn tags into links
                pageLoad(() => {
                    const infoTd = document.querySelector('#infobox tr td:nth-child(2)');
                    if (infoTd) {
                        const tagsTextNode = document.querySelector('#infobox').querySelector('input[readonly]').previousSibling.previousSibling.previousSibling;

                        const tagList = document.createElement('span');
                        tagList.textContent = 'Tags: ';
                        tagList.id = 'adventure-tags';

                        if (window.MSPFA.story.t.length) {
                            window.MSPFA.story.t.forEach(tag => {
                                const tagLink = document.createElement('a');
                                tagLink.textContent = tag;
                                tagLink.href = '/?s=36596&p=3';
                                tagLink.target = '_blank';
                                tagLink.addEventListener('mouseup', (evt) => {
                                    if (evt.button <= 1) {
                                        localStorage.customsearchfor = JSON.stringify({"tags":[tag]});
                                    }
                                });
                                tagList.appendChild(tagLink);
                                tagList.appendChild(document.createTextNode(', '));
                            });
                            tagList.removeChild(tagList.lastChild);
                        } else {
                            tagList.textContent = 'No tags';
                        }

                        tagsTextNode.parentNode.insertBefore(tagList, tagsTextNode);
                        tagsTextNode.parentNode.removeChild(tagsTextNode);

                        return true;
                    }
                });
            } else if (!settings.replaceFace || (location.search && params.d) || (location.search && params.b)) {
                // do nothing
            } else {
                location.href = "/?s=36596&p=8";
            }
        }
        else if (location.pathname === "/my/") {
            const editStories = document.querySelector('#editstories');
            editStories.classList.remove('alt');
            const parent = editStories.parentNode;
            const viewSaves = createElement('a', { id: 'viewsaves', className: 'major', textContent: 'View Adventure Saves' });
            const viewBookmarks = createElement('a', { id: 'viewsaves', className: 'major', textContent: 'View Bookmarks' });

            addChildren(parent, [viewSaves, newBr(), newBr()]);

            if (settings.bookmarksEnabled) {
                addChildren(parent, [viewBookmarks, newBr(), newBr()]);
            }

            if (window.MSPFA && window.MSPFA.me && window.MSPFA.me.i) {
                viewSaves.href = `/?s=36596&p=6`;
                viewBookmarks.href = `/?s=36596&p=10`;
                return true;
            }

            const messages = document.querySelector('#messages');

            pageLoad(() => {
                if (messages.textContent.includes('(')) {
                    setTitle(document.title + messages.textContent.toLowerCase().replace('messages', ''));
                    return true;
                }
            });
        }
        else if (location.pathname === "/my/settings/") { // Custom settings
            setTitle("My Settings", 1);

            const saveButton = document.querySelector('#savesettings');

            const table = document.querySelector("#editsettings tbody");

            table.insertRow(table.childElementCount - 1).appendChild(createElement('th', { id: 'extraSettings', textContent: 'Extra Settings' }));

            const localMsg = window.MSPFA.parseBBCode('Because this is an extension, any data saved is only [b]locally[/b] on this device.<br>Don\'t forget to [b]save[/b] when you\'ve finished making changes!<br>Click on the <input value="?" class="major" type="button" disabled style="padding: 0"> boxes for descriptions.');
            const settingsTd = table.insertRow(table.childElementCount - 1).insertCell();
            const plusTable = document.createElement('table');
            const plusTbody = plusTable.createTBody();
            addChildren(settingsTd, [localMsg, newBr(), newBr(), plusTable]);

            plusTable.style = "text-align: center;";

            // Create checkbox
            const createCheckbox = (text, desc, name) => {
                const optionTr = plusTbody.insertRow(plusTbody.childNodes.length);
                const optionTextTd = optionTr.insertCell();
                const optionLabel = createLabel(text, name);
                const optionInputTd = optionTr.insertCell();
                const optionInput = createElement('input', { type: 'checkbox', checked: settings[name], id: name });

                const tipButton = createElement('input', { className: 'major', value: '?', style: 'padding: 0', type: 'button', title: 'What does enabling this do?' });
                tipButton.addEventListener('click', () => {
                    window.MSPFA.dialog('What does enabling this do?', window.MSPFA.parseBBCode(desc), ["Close"]);
                });

                addChildren(optionInputTd, [optionInput, textNode(' '), tipButton]);
                optionTextTd.appendChild(optionLabel);

                optionInput.addEventListener('change', () => {
                    settings[name] = optionInput.checked;
                });
            }

            createCheckbox("Bookmarking pages:", 'Adds a BOOKMARK link to the nav bar which allows you to save a page for later reference. Also adds a link in My MSPFA to view bookmarks.', 'bookmarksEnabled');
            createCheckbox("Automatically open spoilers:", 'This will automatically open any spoiler when you change pages without any interaction necessary.', 'autospoiler');
            createCheckbox("Preload images for the pages immediately before and after:", 'The pages directly before and after the one you\'re on will be loaded, saving time loading images and making the experience more seamless.', 'preload');
            createCheckbox("Display page timestamps:", 'Displays the uploaded timestamp for the current page you\'re viewing. You can hover over the text to get a relative timestamp instead.', 'timestamp');
            createCheckbox("Use 24 hour time:", 'When possible, displays timestamps in 24 hour time instead of 12.', 'timestamp24h');
            createCheckbox("Replace icon buttons with new icons:", 'Replaces the gray text icon buttons with colourful ones used in the new site.<br><br>[i]May be incompatible with some adventure CSS.[/i]', 'newButtons');
            createCheckbox("Replace the MSPFA Homepage with the Custom Homepage:", 'Instead of linking to the official MSPFA home page, going to mspfa.com will redirect you to the Custom Homepage. You can still visit the default homepage via dropdown.', 'replaceFace');
            createCheckbox("Scroll back up to the nav bar when switching page:", 'When going back and forth pages, scroll back up to the nav bar\'s position so you don\'t have to scroll up each time.', 'commandScroll');
            createCheckbox("Makes the nav bar sticky, and scrolls with you:", 'Scrolling down the page will always show the nav bar.<br>[i]Note: This feature may end up being a bit buggy at times. If any errors occur, please let me know so I can fix them ASAP.[/i]', 'navStick');
            createCheckbox("Show favourite counts in My Adventures:", 'In the My Adventures page, each adventure will have their favourite count displayed to its right.', 'showFavs');
            createCheckbox("Disable selecting CSS/JS text on focus in adventure info:", 'While in the adventure info page, removes the feature that selects all text in the CSS or JS box when it\'s focused.', 'disableTextareaSelect');
            createCheckbox("Wide CSS/JS edit boxes in adventure info:", 'While in the adventure info page, makes the textareas for the CSS and JS boxes very wide to reduce text-wrapping.', 'wideCode');
            createCheckbox("On the front page, makes the anniversary banners cycle:", 'Enabling this will change the front page\'s anniversary banners to a cycling version, showing two banners at most at a time.', 'carouselBanners');
            createCheckbox("Change pixel scaling to nearest neighbour:", 'Makes images scale up or down using nearest neighbour to prevent making the images fuzzy when zooming in, or on monitors with upscaling. This is disabled for images with the .cellicon class.', 'pixelFix');
            createCheckbox("Automatically save game:", 'Automatically saves your game when you flip to a new page.', 'autosave');

            const cssTr = plusTbody.insertRow();
            const cssTextTd = cssTr.insertCell().appendChild(textNode('Change style:'));
            const cssSelectTd = cssTr.insertCell();
            const cssSelect = document.createElement('select');
            cssSelectTd.appendChild(cssSelect);

            const customTr = plusTbody.insertRow();
            const customTextTd = customTr.insertCell().appendChild(textNode('Custom CSS URL:'));
            const customCssTd = customTr.insertCell();
            const customCssInput = createElement('input', { style: 'width: 99px;', value: settings.styleURL });
            customCssTd.appendChild(customCssInput);

            styles.forEach(o => cssSelect.appendChild(new Option(o.name, o.name)));

            cssSelect.selectedIndex = settings.style;

            const draftButton = createElement('input', { value: 'Manage Drafts', className: 'major', type: 'button' });
            const spoilerButton = createElement('input', { value: 'Manage Spoilers', className: 'major', type: 'button' });
            const blockedButton = createElement('input', { value: 'Blocked Users', className: 'major', type: 'button' });
            const buttonSpan = addChildren(document.createElement('span'), [draftButton, textNode(' '), spoilerButton, textNode(' '), blockedButton]);
            settingsTd.appendChild(buttonSpan);

            blockedButton.addEventListener('click', () => {
                let blockLinks = [];
                settings.blocklist.forEach(blocked => {
                    blockLinks.push(`<a href="/user/?u=${blocked}">${blocked}</a>`);
                });
                const blockedSpan = window.MSPFA.parseBBCode(`This is a list of your blocked users. Messages sent from these users will be automatically deleted.\n\nBlocked users:\n${blockLinks.join('\n')}`);
                const idInputSpan = window.MSPFA.parseBBCode('Enter the user\'s ID: <input type="text" style="width: 22ch">');

                window.MSPFA.dialog('Blocked Users', blockedSpan, ['Add user', 'Remove user', 'Close'], (output, form) => {
                    let errorMsg;
                    if (output === "Add user") {
                        setTimeout(() => {
                            window.MSPFA.dialog('Blocked Users: Add', idInputSpan, ['Add user', 'Cancel'], (output, form) => {
                                const newUser = idInputSpan.querySelector('input').value.trim().replace(/\D/g, '');
                                if (output === "Add user") {
                                    if (window.MSPFA.me.i === newUser) {
                                        errorMsg = 'You cannot block yourself!';
                                    } else if (settings.blocklist.indexOf(newUser) !== -1) {
                                        errorMsg = 'This user\'s already blocked!';
                                    } else if (newUser.length !== 21) {
                                        errorMsg = 'Invalid user ID';
                                    } else {
                                        settings.blocklist.push(newUser);
                                        saveSettings();
                                    }
                                }
                            });
                        }, 1);
                    } else if (output === "Remove user") {
                        setTimeout(() => {
                            window.MSPFA.dialog('Blocked Users: Remove', idInputSpan, ['Remove user', 'Cancel'], (output, form) => {
                                const newUser = idInputSpan.querySelector('input').value.trim().replace(/\D/g, '');
                                if (output === "Remove user") {
                                    if (settings.blocklist.indexOf(newUser) === -1) {
                                        errorMsg = 'This user\'s not blocked!';
                                    } else if (newUser.length !== 21) {
                                        errorMsg = 'Invalid user ID';
                                    } else {
                                        settings.blocklist.splice(settings.blocklist.indexOf(newUser), 1);
                                        saveSettings();
                                    }
                                }
                            });
                        }, 1);
                    }
                    if (errorMsg) {
                        setTimeout(() => {
                            window.MSPFA.dialog('Blocked Users: Error', window.MSPFA.parseBBCode(errorMsg), ['Okay']);
                        }, 1);
                    }
                });
            });

            const draftMsg = window.MSPFA.parseBBCode('Here you can manage the drafts that you have saved for your adventure(s).\n');
            const listTable = document.createElement('table');
            listTable.id = 'draft-table';
            const listTbody = listTable.createTBody();

            const draftsEmpty = () => {
                loadDrafts();
                let empty = true;
                Object.keys(drafts).forEach(adv => {
                    if (empty) {
                        const length = typeof drafts[adv].cachedTitle === "undefined" ? 0 : 1;
                        if (Object.keys(drafts[adv]).length > length) {
                            empty = false;
                        }
                    }
                });
                return empty;
            }

            setInterval(() => {
                draftButton.disabled = draftsEmpty();
            }, 1000);

            draftButton.addEventListener('click', () => {
                draftMsg.appendChild(listTable);
                listTbody.innerHTML = '';
                loadDrafts();

                const addAdv = (story, name) => {
                    const storyTr = listTbody.insertRow();
                    const titleLink = createElement('a', { className: 'major', href: `/my/stories/pages/?s=${story}&click=d`, textContent: name, target: '_blank' });
                    storyTr.insertCell().appendChild(titleLink);
                    const deleteButton = createElement('input', { className: 'major', type: 'button', value: 'Delete' });
                    storyTr.insertCell().appendChild(deleteButton);

                    deleteButton.addEventListener('click', () => {
                        setTimeout(() => {
                            window.MSPFA.dialog('Delete adventure draft?', textNode('Are you really sure?\nThis action cannot be undone!'), ["Yes", "No"], (output, form) => {
                                if (output === "Yes") {
                                    loadDrafts();
                                    drafts[story] = {};

                                    if (settings.drafts && settings.drafts[story]) {
                                        delete settings.drafts[story];
                                        saveSettings();
                                    }

                                    saveDrafts(drafts);

                                    setTimeout(() => {
                                        draftButton.click();
                                    }, 1);

                                    if (draftsEmpty) {
                                        draftButton.disabled = true;
                                    }
                                }
                            });
                        }, 1);
                    });
                }

                Object.keys(drafts).forEach(adv => {
                    const length = typeof drafts[adv].cachedTitle === "undefined" ? 0 : 1;
                    if (Object.keys(drafts[adv]).length > length) {
                        if (!!length) {
                            addAdv(adv, drafts[adv].cachedTitle);
                        }
                        else {
                            window.MSPFA.request(0, {
                                do: "story",
                                s: adv,
                                noPages: true
                            }, story => {
                                if (typeof story !== "undefined") {
                                    addAdv(adv, story.n);
                                }
                            });
                        }
                    }
                });

                window.MSPFA.dialog('Manage Drafts', draftMsg, ["Delete All", "Close"], (output, form) => {
                    if (output === "Delete All") {
                        setTimeout(() => {
                            window.MSPFA.dialog('Delete all Drafts?', textNode('Are you really sure?\nThis action cannot be undone!'), ["Yes", "No"], (output, form) => {
                                if (output === "Yes") {
                                    Object.keys(drafts).forEach(adv => {
                                        drafts[adv] = {};
                                    });
                                    saveDrafts(drafts);

                                    if (typeof settings.drafts !== "undefined") {
                                        delete settings.drafts;
                                        saveSettings();
                                    }

                                    draftButton.disabled = true;
                                }
                            });
                        }, 1);
                    }
                });
            });

            if (Object.keys(settings.spoilerValues).length === 0) {
                spoilerButton.disabled = true;
            }

            const spoilerMsg = window.MSPFA.parseBBCode('Here you can manage the spoiler values that you have set for your adventure(s).\nClick on an adventure\'s title to see the values.\n');

            spoilerButton.addEventListener('click', () => {
                spoilerMsg.appendChild(listTable);
                listTbody.innerHTML = '';
                Object.keys(settings.spoilerValues).forEach(adv => {
                    window.MSPFA.request(0, {
                        do: "story",
                        s: adv,
                        noPages: true
                    }, story => {
                        if (typeof story !== "undefined") {
                            const storyTr = listTbody.insertRow(listTable.rows);
                            const titleLink = createElement('a', { className: 'major', href: `/my/stories/pages/?s=${adv}&click=s`, textContent: story.n, target: '_blank' });
                            storyTr.insertCell().appendChild(titleLink);
                            const deleteButton = createElement('input', { className: 'major', type: 'button', value: 'Delete' });
                            storyTr.insertCell().appendChild(deleteButton);

                            deleteButton.addEventListener('click', () => {
                                setTimeout(() => {
                                    window.MSPFA.dialog('Delete adventure spoilers?', textNode('Are you really sure?\nThis action cannot be undone!'), ["Yes", "No"], (output, form) => {
                                        if (output === "Yes") {
                                            delete settings.spoilerValues[adv];
                                            saveSettings();

                                            setTimeout(() => {
                                                spoilerButton.click();
                                            }, 1);

                                            if (Object.keys(settings.spoilerValues).length === 0) {
                                                spoilerButton.disabled = true;
                                            }
                                        }
                                    });
                                }, 1);
                            });
                        }
                    });
                });
                window.MSPFA.dialog('Manage Spoiler Values', spoilerMsg, ["Delete All", "Close"], (output, form) => {
                    if (output === "Delete All") {
                        setTimeout(() => {
                            window.MSPFA.dialog('Delete all Spoiler Values?', 'Are you sure you want to delete all spoiler values?\nThis action cannot be undone!', ["Yes", "No"], (output, form) => {
                                if (output === "Yes") {
                                    settings.spoilerValues = {};
                                    saveSettings();
                                    spoilerButton.disabled = true;
                                }
                            });
                        }, 1);
                    }
                });
            });

            // Add event listeners
            plusTbody.querySelectorAll('input, select').forEach(elm => {
                elm.addEventListener("change", () => {
                    saveButton.disabled = false;
                });
            });

            saveButton.addEventListener('mouseup', () => {
                settings.style = cssSelect.selectedIndex;
                settings.styleURL = customCssInput.value;

                settings.night = false;
                saveSettings();

                updateTheme(settings.style == styles.length - 1 ? settings.styleURL : styles[settings.style].link);

                extraStyle.textContent = pixelText() + ' *{transition:1s}';

                extraStyle.textContent = pixelText();
                setTimeout(() => {
                    extraStyle.textContent = pixelText();
                }, 1000);
            });
        }
        else if (location.pathname === "/my/messages/") { // New buttons
            setTitle("My Messages", 1);

            const messagesTable = document.querySelector('#messages');

            // Select all read messages button.
            const selRead = createElement('input', { value: 'Select Read', className: 'major', type: 'button' });

            // On click, select all messages with the style attribute indicating it as read.
            selRead.addEventListener('mouseup', () => {
                document.querySelectorAll('td[style="border-left: 8px solid rgb(221, 221, 221);"] > input').forEach((m) => m.click());
            });

            // Select duplicate message (multiple update notifications).
            const selDupe = createElement('input', { value: 'Select Same', className: 'major', type: 'button', style: 'margin-top: 6px' });

            selDupe.addEventListener('mouseup', () => {
                const temp = document.querySelectorAll('#messages > tr');
                const msgs = [];
                for (let i = temp.length - 1; i >= 0; i--) {
                    msgs.push(temp[i]);
                }
                const msgIds = [];
                msgs.forEach((msg) => {
                    if (/^new update: /.test(msg.querySelector('a.major').textContent.toLowerCase())) {
                        const id = /https:\/\/mspfa.com\/\?s=(\d{1,})&p=(?:\d{1,})$/.exec(msg.querySelector('.spoiler a').href)[1];
                        if (msgIds.indexOf(id) === -1) {
                            if (msg.querySelector('td').style.cssText !== "border-left: 8px solid rgb(221, 221, 221);") {
                                msgIds.push(id);
                            }
                        } else {
                            msg.querySelector('input').click();
                        }
                    }
                });
            });

            // Select duplicate message (multiple update notifications).
            const msgManagement = createElement('input', { value: 'Auto Management', className: 'major', type: 'button', style: 'margin-top: 6px' });

            msgManagement.addEventListener('click', () => {
                loadSettings();

                const dupeMsg = createElement('input', {type: 'checkbox', checked: settings.autoDupeClean});
                const dupeMsgLabel = createElement('label');
                const readMsg = createElement('input', {type: 'checkbox', checked: settings.autoCleanRead > -1});
                const unreadMsg = createElement('input', {type: 'checkbox', checked: settings.autoCleanUnread > -1});

                const readMsgVal = createElement('input', {type: 'number', min: '-1', style: 'width: 6ch', value: settings.autoCleanRead === -1 ? 1 : settings.autoCleanRead });
                const unreadMsgVal = createElement('input', {type: 'number', min: '-1', style: 'width: 6ch', value: settings.autoCleanUnread === -1 ? 30 : settings.autoCleanUnread });

                const mgmtContainer = createElement('div');
                addChildren(mgmtContainer, [
                    textNode('Automatically delete...'),
                    newBr(), newBr(),
                    dupeMsgLabel,
                    newBr(), newBr(),
                    readMsg,
                    textNode(' read updates older than '),
                    readMsgVal,
                    textNode(' days.'),
                    newBr(), newBr(),
                    unreadMsg,
                    textNode(' unread updates older than '),
                    unreadMsgVal,
                    textNode(' days.')
                ]);

                dupeMsgLabel.appendChild(dupeMsg);
                dupeMsgLabel.appendChild(textNode(' duplicate update notifications'));

                window.MSPFA.dialog('Auto Management', mgmtContainer, ["Save", "Cancel"], (output, form) => {
                    if (output === "Save") {
                        settings.autoDupeClean = dupeMsg.checked;
                        settings.autoCleanRead = readMsg.checked ? readMsgVal.value : -1;
                        settings.autoCleanUnread = unreadMsg.checked ? unreadMsgVal.value : -1;

                        saveSettings();
                    }
                });
            });

            const filterContainer = createElement('div', { id: 'filter-container' } );
            const filters = [
                { enabled: false, class: '.msg-update', name: 'Updates' },
                { enabled: false, class: '.msg-comment', name: 'Comments/Mentions' },
                { enabled: false, class: '.msg-pm', name: 'Private Messages' }
            ];
            const filterStyle = createElement('style');
            const updateFilter = () => {
                const disabled = filters.filter(filter => !filter.enabled);

                if (disabled.length === 3) {
                    filterStyle.textContent = ``;
                    return;
                }
                filterStyle.textContent = `${disabled.map(filter => filter.class).join(', ')} { display: none; }`;
            }
            filters.forEach(filter => {
                const label = createElement('label');
                const button = createElement('input', { type: 'checkbox' });
                button.addEventListener('input', () => {
                    filter.enabled = button.checked;
                    updateFilter();
                });
                addChildren(filterContainer, [
                    addChildren(label, [
                        button,
                        textNode(' ' + filter.name)
                    ]),
                    textNode(' ')
                ]);
            });

            // Add buttons to the page.
            const del = document.querySelector('#deletemsgs');
            addChildren(del.parentNode, [
                selRead,
                textNode(' '),
                selDupe,
                textNode(' '),
                del,
                newBr(),
                msgManagement,
                newBr(),
                filterContainer,
                filterStyle
            ]);

            const addNoMessagesImage = () => {
                if (messagesTable.textContent.startsWith('No new messages')) {
                    messagesTable.parentNode.width = '100%';
                    const noMessageImg = createElement('img', {src: "https://mspfae.linkh.at/no-messages"});
                    const msgTd = messagesTable.querySelector('td');
                    msgTd.textContent = '';
                    msgTd.style = 'text-align: center; font-weight: bold;';
                    addChildren(msgTd, [noMessageImg, newBr(), textNode('No new messages.'), newBr(), newBr()]);

                    // Disable some buttons if there are no messages.
                    selDupe.disabled = true;
                }
            }

            const loading = document.querySelector('#loading');
            del.addEventListener('click', () => {
                setTimeout(() => {
                    document.querySelector('#dialog button[data-value="Yes"]').addEventListener('click', () => {
                        pageLoad(() => {
                            if (loading.classList.contains('active')) return;

                            addNoMessagesImage();
                            return true;
                        });
                    });
                },1);
            });

            // Click the green cube to open the update/comment in a new tab, and mark notification as read.
            pageLoad(() => {
                if (messagesTable.childNodes.length > 0) {

                    if (messagesTable.textContent.startsWith('No new messages')) {
                        addNoMessagesImage();
                        return true;
                    }
                    messagesTable.childNodes.forEach(node => {
                        node.querySelector('.cellicon').style = 'margin-left: 0px !important;';
                        const checkbox = node.querySelector('input[type="checkbox"]');
                        const titleLink = node.querySelector('a.major');
                        checkbox.parentNode.classList.add('messageCheckbox');
                        checkbox.parentNode.addEventListener('click', evt => {
                            if (evt.target !== checkbox) {
                                checkbox.click();
                            }
                        });

                        let link;
                        if (node.textContent.toLowerCase().includes('new update:') && node.textContent.includes('MS Paint Fan Adventures')) {
                            link = addLink(node.querySelector('.cellicon'), node.querySelector('.spoiler a').href);
                            // Append page count to message title
                            const pages = /Pages? (\d{1,})-?(\d{0,})/.exec(node.querySelector('.spoiler span').textContent);
                            const leftPageBound = +pages[1];
                            let rightPageBound = +pages[2];

                            const msgId = node.id.slice(1);
                            if (msgDupeList[msgId]) {
                                rightPageBound = Math.max(rightPageBound, +msgDupeList[msgId]);
                            }

                            const pageCount = (rightPageBound ? rightPageBound - leftPageBound + 1 : 1);

                            const pageCountLink = createElement('a', { innerHTML: ` (${pageCount}&nbsp;page${pageCount > 1 ? 's' : ''})` });
                            titleLink.appendChild(pageCountLink);
                            node.classList.add('msg-update');
                        }
                        else if ((node.textContent.toLowerCase().includes('new comment on ') || node.textContent.toLowerCase().includes('you were tagged on ')) && node.textContent.includes('MS Paint Fan Adventures')) {
                            // Append page number to message title
                            link = addLink(node.querySelector('.cellicon'), node.querySelectorAll('.spoiler a')[1].href + '#commentbox');
                            titleLink.textContent += ` (page ${/(?:.*?)&p=(\d{1,})(?:.*?)/.exec(link.href)[1]})`;
                            node.querySelector('.cellicon').src = 'https://raw.githubusercontent.com/SeymourSchlong/mspfaextras/main/assets/comment.png';
                            if (node.textContent.includes('You were tagged on ')) {
                                node.querySelector('.cellicon').src = 'https://raw.githubusercontent.com/SeymourSchlong/mspfaextras/main/assets/mention.png';
                            }
                            node.classList.add('msg-comment');
                        }
                        else {
                            link = addLink(node.querySelector('.cellicon'), node.querySelector('a.major').href);
                            node.classList.add('msg-pm');
                        }

                        link.addEventListener('mouseup', (evt) => {
                            if (evt.button >= 2) return;
                            const spoiler = node.querySelector('.spoiler');
                            const button = spoiler.querySelector('input');
                            spoiler.className = 'spoiler closed';
                            button.click();
                            button.click();
                        });
                    });
                    return true;
                }
            });
            pageLoad(() => {
                if (messagesTable.childNodes.length > 0) {
                    if (messagesTable.textContent.startsWith('No new messages')) {
                        return true;
                    }
                    window.MSPFA.request(0, {
                        do: 'favs',
                        u: window.MSPFA.me.i
                    }, (stories) => {
                        messagesTable.childNodes.forEach((msg) => {
                            if (/^new update: /.test(msg.querySelector('a.major').textContent.toLowerCase())) {
                                const id = /https:\/\/mspfa.com\/\?s=(\d{1,})&p=(?:\d{1,})$/.exec(msg.querySelector('.spoiler a').href)[1];
                                const icon = stories.find(s => s.i == id)?.o || `/images/wat/random.njs?cb=${id%4}`;
                                if (icon) {
                                    msg.querySelector('.cellicon').src = icon;
                                }
                            }
                        });
                    });
                    return true;
                }
            });
        }
        else if (location.pathname === "/my/messages/view/" && location.search) {
            addLink(document.querySelector('#allmsgs'), '/my/messages/');

            // Add date/time to page
            const subject = document.querySelector('#subject');

            pageLoad(() => {
                if (subject.textContent !== '') {
                    window.MSPFA.request(1, {
                        do: 'readmsg',
                        m: params.m
                    }, (m) => {
                        if (m) {
                            const timeText = createElement('span');
                            timeText.textContent = 'Sent ' + getRelativeTime(m.d);
                            timeText.title = getDateString(m.d, 4);
                            subject.parentNode.appendChild(timeText);
                        }
                    });

                    return true;
                }
            });
        }
        else if (location.pathname === "/my/messages/new/" && location.search) { // Auto-fill user when linked from a user page
            const recipientInput = document.querySelector('#addrecipient');
            recipientInput.value = params.u;

            pageLoad(() => {
                const recipientButton = document.querySelector('#addrecipientbtn');
                if (recipientButton) {
                    recipientButton.click();
                    if (recipientInput.value === "") { // If the button press doesn't work
                        return true;
                    }
                }
            });
        }
        else if (location.pathname === "/my/stories/") {
            setTitle("My Stories", 1);

            // Set this to true to allow sorting by Pages and Creation
            const uselessSorting = false;

            let hidden = true;
            const hiddenStyle = createElement('style', {textContent: '.hidden { display: none; }'});
            document.body.appendChild(hiddenStyle);

            const sortButton = createElement('input', {value: `Sort By: ${['Favourites', 'Update', 'Pages', 'Creation'][settings.adventureSorting || 0]}`, className: 'major', type: 'button', style: 'margin-bottom: 1ch;' });
            const myAdvs = [];

            const sort = () => {
                if (settings.adventureSorting === 0) {
                    // Sort by Favourites
                    myAdvs.sort((a, b) => (b.f.length+b.g.length) - (a.f.length+a.g.length));
                } else if (settings.adventureSorting === 1) {
                    // Sort by Update
                    myAdvs.sort((a, b) => b.u - a.u);
                } else if (settings.adventureSorting === 2) {
                    // Sort by Pages
                    myAdvs.sort((a, b) => b.p - a.p);
                } else {
                    // Sort by Creation
                    myAdvs.sort((a, b) => b.d - a.d);
                }

                myAdvs.forEach(story => {
                    story.element.parentNode.appendChild(story.element);
                });
            }

            sortButton.addEventListener('click', () => {
                loadSettings();
                settings.adventureSorting++;
                settings.adventureSorting %= (uselessSorting ? 4 : 2);
                saveSettings();

                sort();

                sortButton.value = `Sort By: ${['Favourites', 'Update', 'Pages', 'Creation'][settings.adventureSorting || 0]}`;
            });

            const toggleButton = createElement('input', {value: 'Show Hidden Adventures', className: 'major', type: 'button', style: 'margin-left: 1ch;' });

            toggleButton.addEventListener('click', () => {
                if (hidden) {
                    hidden = false;
                    hiddenStyle.textContent = '';
                    toggleButton.value = 'Hide Hidden Adventures';
                } else {
                    hidden = true;
                    hiddenStyle.textContent = '.hidden { display: none; }';
                    toggleButton.value = 'Show Hidden Adventures';
                }
            });

            // Add links to buttons
            pageLoad(() => {
                const adventures = document.querySelectorAll('#stories tr');
                if (adventures.length > 0) {
                    //document.querySelector('#stories').parentNode.parentNode.appendChild(toggleButton);
                    document.querySelector('#stories').parentNode.insertAdjacentElement('beforebegin', sortButton);
                    document.querySelector('#stories').parentNode.insertAdjacentElement('beforebegin', toggleButton);

                    if (settings.hidden.length === 0) {
                        toggleButton.style.display = 'none';
                    }

                    /* get adventure stuffs */
                    window.MSPFA.request(0, {
                        do: "editor",
                        u: window.MSPFA.me.i
                    }, (s) => {
                        s.forEach(story => {
                            myAdvs.push(story);
                        });

                        adventures.forEach(story => {
                            const storyTitle = story.querySelector('a.major');
                            const favSpan = createElement('span', { style: 'transform: translateX(-3px); float: right;' });
                            const favHeart = createElement('img', { src: 'https://raw.githubusercontent.com/SeymourSchlong/mspfaextras/main/assets/heart.png', style: 'float: right;' });

                            let adv;
                            if (storyTitle.href) {
                                adv = myAdvs.find(story => story.i == /\/\?s=(\d{1,})&/.exec(storyTitle.href)[1])
                            } else {
                                adv = myAdvs.find(story => story.n === storyTitle.textContent);
                            }
                            adv.element = story;

                            if (settings.showFavs) {

                                favSpan.textContent = adv.f.length + adv.g.length;

                                storyTitle.parentNode.style = 'width: 100%; padding-right: 10px;';

                                storyTitle.insertAdjacentElement('afterEnd', favSpan);
                                storyTitle.insertAdjacentElement('afterEnd', favHeart);
                            }
                        });

                        sort();
                    });

                    adventures.forEach(story => {
                        const buttons = story.querySelectorAll('input.major');
                        let id = story.querySelector('a').href.replace('https://mspfa.com/?s=', '').replace('&p=1', '');

                        if (id) {
                            const hideButton = createElement('input', {value: 'Hide', className: 'major', type: 'button'});

                            hideButton.addEventListener('click', () => {
                                loadSettings();

                                if (!settings.hideMessage) {
                                    settings.hideMessage = true;
                                    window.MSPFA.dialog("Hiding Adventures", window.MSPFA.parseBBCode(`Before you use this, you should know that this [b][i]does not hide your adventures from other people[/i][/b].\n\nIt only hides it in the story viewer for you so you can hide ones you don't want to see/need to.\n\nTo unhide an adventure, click the button to show all hidden at the bottom, the click Unhide.\n\nThis dialog will not show again.`), ["Okay"]);
                                }

                                if (settings.hidden.indexOf(id) === -1) {
                                    settings.hidden.push(id);
                                    hideButton.value = 'Unhide';
                                    hideButton.parentNode.parentNode.className = 'hidden';
                                } else {
                                    settings.hidden.splice(settings.hidden.indexOf(id), 1);
                                    hideButton.value = 'Hide';
                                    hideButton.parentNode.parentNode.className = 'not-hidden';
                                }

                                toggleButton.style.display = settings.hidden.length ? '' : 'none';

                                saveSettings();
                            });

                            buttons[1].insertAdjacentElement('afterend', hideButton);
                            hideButton.parentNode.insertBefore(textNode(" "), hideButton);

                            if (settings.hidden.indexOf(id) === -1) {
                                hideButton.value = 'Hide';
                                hideButton.parentNode.parentNode.className = 'not-hidden';
                            } else {
                                hideButton.value = 'Unhide';
                                hideButton.parentNode.parentNode.className = 'hidden';
                            }

                            addLink(buttons[0], `/my/stories/info/?s=${id}`);
                            addLink(buttons[1], `/my/stories/pages/?s=${id}`);
                            addLink(story.querySelector('img'), `/?s=${id}&p=1`);
                        }
                    });
                    return true;
                }
            });

            // Add user guides
            const guides = ["A Guide To Uploading Your Comic To MSPFA", "MSPFA Etiquette", "Fanventure Guide for Dummies", "CSS Guide", "HTML and CSS Things", ];
            const links = ["https://docs.google.com/document/d/17QI6Cv_BMbr8l06RrRzysoRjASJ-ruWioEtVZfzvBzU/edit?usp=sharing", "/?s=27631", "/?s=29299", "/?s=21099", "/?s=23711"];
            const authors = ["Farfrom Tile", "Radical Dude 42", "nzar", "MadCreativity", "seymour schlong"];

            const parentTd = document.querySelector('.container > tbody > tr:last-child > td');
            const guideTable = createElement('table', { style: 'width: 100%; text-align: center;' });
            const guideTbody = guideTable.createTBody();
            parentTd.querySelector('span').textContent = "Unofficial Guides";

            parentTd.appendChild(guideTable);

            for (let i = 0; i < guides.length; i++) {
                const guideTr = guideTbody.insertRow();
                const guideTd = guideTr.insertCell();
                const guideLink = createElement('a', { href: links[i], textContent: guides[i], className: 'major' });
                addChildren(guideTd, [
                    guideLink,
                    newBr(),
                    textNode('by '+authors[i]),
                    newBr(),
                    newBr()
                ]);
            }
        }
        else if (location.pathname === "/my/stories/info/" && location.search) {
            // Button links
            addLink(document.querySelector('#userfavs'), `/readers/?s=${params.s}`);
            addLink(document.querySelector('#editpages'), `/my/stories/pages/?s=${params.s}`);

            if (settings.disableTextareaSelect) {
                document.querySelectorAll('textarea[onfocus="this.select();"]').forEach(textarea => {
                    textarea.onfocus = '';
                });
            }

            // Reorder some elements under Icons to be more sensible
            const bannerInput = document.querySelector('input[name="storybanner"]');
            bannerInput.parentNode.style.paddingLeft = '130px';
            const bannerPrev = document.querySelector(`a[href="/?b=${params.s}`);
            bannerPrev.parentNode.insertBefore(bannerPrev, bannerInput.nextSibling);

            bannerInput.parentNode.removeChild(document.querySelector('#storyicon').nextSibling);

            pageLoad(() => {
                const title = document.querySelector('#storyname').textContent;

                if (title !== 'Add a new adventure!') {
                    setTitle('Info - ' + title);

                    // Move the CSS and JS boxes to a wider row because i hate reading scrunched-ass code
                    if (settings.wideCode) {
                        const codeHeader = createElement('tr');
                        const codeRow = createElement('tr');
                        const codeHeaderCell = document.querySelector('tr[style="text-align: left;"] + tr td:nth-child(2)');
                        const codeContentCell = document.querySelector('td[style="padding-left: 130px;"] + td');
                        codeHeaderCell.colSpan = 2;
                        codeContentCell.colSpan = 2;
                        codeHeader.appendChild(codeHeaderCell);
                        codeRow.appendChild(codeContentCell);

                        const iconCell = document.querySelector('td[style="padding-left: 130px;"]');
                        iconCell.parentNode.insertAdjacentElement('afterend', codeRow);
                        iconCell.parentNode.insertAdjacentElement('afterend', codeHeader);

                        iconCell.colSpan = 2;
                        document.querySelector('tr[style="text-align: left;"] + tr td:nth-child(1)').colSpan = 2;

                        codeContentCell.querySelectorAll('textarea').forEach(t => {
                            t.removeAttribute('cols');
                            t.setAttribute('rows', 15);
                            t.style.width = '90%';
                        });

                        iconCell.style.paddingLeft = 'calc(50% - 150px/2)';
                    }

                    return true;
                }
            });

            if (params.s !== 'new') {
                const exportButton = createElement('input', { className: 'major', value: 'Export', type: 'button', style: 'margin-top: 6px' });

                // Download adventure data
                const downloadDataButton = createElement('input', { className: 'major', value: 'JSON Format', type: 'button', style: 'margin-top: 6px' });
                const downloadDataLink = document.createElement('a');
                downloadDataLink.setAttribute('download', `${params.s}.json`);

                // Download adventure data
                const downloadButton = createElement('input', { className: 'major', value: 'HTML Format', type: 'button', style: 'margin-top: 6px' });
                const downloadLink = document.createElement('a');
                downloadLink.setAttribute('download', `${params.s}.html`);

                const exportCSSinput = createElement('input', { type: 'checkbox', checked: 'true' });
                const exportCSSlabel = createElement('label');
                exportCSSlabel.appendChild(exportCSSinput);
                exportCSSlabel.appendChild(textNode(' Include CSS in HTML export?'));

                downloadLink.appendChild(downloadButton);
                downloadDataLink.appendChild(downloadDataButton);

                const exportContent = window.MSPFA.parseBBCode("Here you can export your adventure in a viewable HTML file for archival.\nHTML export doesn't download any resources, but retains the urls given.\n");

                addChildren(exportContent, [newBr(), exportCSSlabel, newBr(), newBr(), downloadLink , textNode(' '), downloadDataLink]);
                addChildren(document.querySelector('#savestory').parentNode, [newBr(), exportButton]);

                let story;
                let pageHTML;
                let pageHTMLnoCSS;
                let cleanCSS;

                exportCSSinput.addEventListener('change', () => {
                    if (exportCSSinput.checked) {
                        downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pageHTML));
                    } else {
                        downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pageHTMLnoCSS));
                    }
                });

                const generateHTML = (s) => {
                    let pageStyle = `.pagenum{font-family:Courier New;font-size:12px;float:right;margin-top:-30px}#jumpto{top:0;position:sticky;width:940px;text-align:center;background-color:#eeeeee;border-bottom:1px solid #535353;padding:5px 0}.vbar{margin:auto 0.5ch}body{margin:0;font-family:"courier", "monospace";font-size:12px;overflow-y:scroll;background-color:#535353;color:#000000}#main{width:940px;margin:0 auto;padding:0 5px 5px;background-color:#c6c6c6}nav{font-family:"arial";font-weight:bold;font-size:x-small;text-align:center;height:15px;padding:2px;text-transform:uppercase;background-color:#000000;color:#ffffff}nav *{vertical-align:middle}nav .heart{display:inline-block;width:16px;height:16px;margin:0 6px;padding:0 !important;background-image:url("https://mspfa.com/images/candyheart.png");background-repeat:no-repeat;background-position:center}iframe{border:none}.umcontainer{height:102px}.um{float:right;width:728px;height:100%}.mspfalogo{width:208px;height:102px;float:left;background-repeat:no-repeat;background-position:center;border-right:4px solid #b8b8b8;background-color:#eeeeee}header .mspfalogo{background-image:url("https://mspfa.com/images/VorkedLarfleeze.gif")}#dialog,table{word-break:break-word;word-wrap:break-word}table.container{border-collapse:collapse;margin:0 -5px;text-align:center;width:950px;border:5px solid #c6c6c6;background-color:#eeeeee}table.container > tbody > tr{height:0}table.container > tbody > tr > td,table.container > tbody > tr > th{padding:4px;vertical-align:top;height:0;border:5px solid #c6c6c6}table.container.alt{width:870px;margin:0 35px;font-size:16px}table.container.alt > tbody > tr > td{border-width:20px}#dialog a[href],.username,.usertag,table.container.alt a[href]{font-weight:bold;text-decoration:none;color:#5caedf}table.container.alt2{width:834px;margin:18px 53px;font-size:16px}table.container.alt2 > tbody > tr > td,table.container.alt2 > tbody > tr > th{border-width:2px}table.container.alt2 > tbody > tr > th{font-weight:bold}table.container.alt2 > tbody > tr > td{padding:10px}table.container.alt2 img{max-width:100%}table.container.alt3 table{text-align:left;width:90%;margin:0 auto}table.container.alt3 table > tbody > tr > td{padding:10px}.major:not(h1,h2,h3,h4,h5,h6){font-size:16px}.major{font-weight:bold;font-family:"Press Start 2P";color:#aaaaaa;text-shadow:0 2px #777777}tr.unlit{opacity:0.5}tr.lit .major{color:#00d747;text-shadow:0 2px #009500}h1.major,h2.major,h3.major,h4.major,h5.major,h6.major{margin:8px 0;color:#cccccc;text-shadow:0 2px #888888;text-transform:uppercase;letter-spacing:2px}h1.major.alt,h2.major.alt,h3.major.alt,h4.major.alt,h5.major.alt,h6.major.alt{letter-spacing:10px}.major.alt{color:#cdcdcd;text-shadow:0 2px #a1a1a1}a.major{text-decoration:none}a.major[href]{color:#5caedf;text-shadow:0 2px #2a6b7d}a.major.alt[href]{color:#8297f8 !important}button{line-height:1.5}button,input.major[type="button"],input.major[type="submit"],input.major[type="reset"]{padding:8px 12px;outline:none;border-width:2px;border-style:solid;border-radius:0;border-color:#dddddd #898989 #898989 #dddddd;background-color:#eeeeee}button:focus,input.major[type="button"]:focus,input.major[type="submit"]:focus,input.major[type="reset"]:focus{outline:1px solid #a5a5ff}button:enabled:active,input.major[type="button"]:enabled:active,input.major[type="submit"]:enabled:active,input.major[type="reset"]:enabled:active{border-color:#898989 #dddddd #dddddd #898989}button,input.major[type="button"],input.major[type="submit"],input.major[type="reset"]{background-color:#eeeeee}button:disabled,input.major[type="button"]:disabled,input.major[type="submit"]:disabled,input.major[type="reset"]:disabled{background-color:#cccccc}textarea{resize:none}.spoiler{border:1px dashed gray;padding:1px}.spoiler > div:last-child{margin:12px 5%;padding:3px;text-align:left}.spoiler.closed > div:last-child{display:none}#container{font-weight:bold;font-size:14px}#slide{display:table;width:600px;max-width:940px;margin:7px auto 23px;padding:0 25px;word-wrap:break-word;word-break:break-word;background-color:#eeeeee}#command{text-align:center;font-size:xx-large;padding:14px 0}#content{text-align:center;margin-bottom:14px}#content > span > br:first-child{display:none}#content img{max-width:940px}#content canvas.major,#content iframe.major,#content img.major,#content object.major,#content ruffle-object.major,#content video.major{margin:0 -25px}#commentbox > .spoiler .spoiler img,#slide .spoiler img{max-width:100%}#foot,#latestpages{font-family:"Verdana", "Arial", "Helvetica", "sans-serif"}#links{margin-top:31px;font-weight:normal;font-size:x-large}#links > div::before{content:"> "}#info{margin-bottom:8px;font-size:16px;font-weight:normal;text-align:center}#info > span > .spoiler,#latestpages > span > .spoiler{border:none}#info > span > .spoiler.open{background-color:#eeeeee}#info > span > .spoiler > div:first-child > input,#latestpages > span > .spoiler > div:first-child > input{font-size:10px;padding:0}#info > span > .spoiler > div:last-child > table > tbody > tr > td{vertical-align:top}#infobox > .spoiler > div:last-child > table{width:100%}`;
                    cleanCSS = s.y.replace(/\n/g, ' ').replace(/\"/g, '"').replace(/url\(('|")?\//g, "url($1https://www.mspfa.com/");

                    // Head
                    let webPage = `<!DOCTYPE html><html><head><title>${s.n}</title><link rel="icon" href="${s.o}"><link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet"><style>${pageStyle}</style><style>/*sey-css*/</style></head><seybreak><seybreak><body><div id="main"><header><div class="umcontainer"><a href="#"><div class="mspfalogo"></div></a><div class="um"></div></div><nav><a href="#" style="color: #ffffff;">MSPFA Home</a><span class="vbar">|</span><a href="#" target="_blank" style="color: #ffffff;">MSPA</a><div class="heart"></div><a href="#" style="color: #76d8ff;">Explore</a><span class="vbar">|</span><a href="#" style="color: #76d8ff;">Random</a><span class="vbar">|</span><a href="#" style="color: #76d8ff;">Statistics</a><div class="heart"></div><a href="#" style="color: #2cff4b;">Log</a><span class="vbar">|</span><a href="#" style="color: #2cff4b;">Search</a><div class="heart"></div><a href="#" style="color: #fffa36;">My MSPFA</a><span class="vbar">|</span><a href="#" style="color: #fffa36;">Discord</a><div class="heart"></div><a href="#" style="color: #ffbc3e;">Contact</a><span class="vbar">|</span><a href="#" style="color: #ffbc3e;">Donate</a></nav></header><div id="container"><div id="jumpto"><div><span>Jump to page: </span><input type="number" style="width: 7ch;"> <input type="button" value="Go!"></div></div>`;

                    // Info
                    webPage += `<br><div id="info"><span id="infobox"><div class="spoiler closed"><div style="text-align: center;"><input type="button" value="Show Adventure Info" data-open="Show Adventure Info" data-close="Hide Adventure Info"></div><div><table><tbody><tr><td style="width: 158px;"><img id="storyicon" height="150" width="150" src="${s.o ? s.o : 'https://mspfa.com/images/wat/random.njs'}" style="margin-right: 6px;"></td><td><span class="major" style="font-size: 20px;">${s.n}</span>     <br>Author: <a href="${s.w}">${s.a}</a><!--<br>Mirrored by: <span>Editorlist...</span>--><br>${s.t.length > 0 ? 'Tags: ' + s.t.join(", ") : 'No tags'}<br>ID: <input readonly="" size="5" value="${s.i}""><br></td></tr><tr><td colspan="2" style="max-width: 575px; width: 575px; height: 22px;">${window.MSPFA.parseBBCode(s.r).outerHTML}</td></tr></tbody></table></div></div></span></div><seybreak><seybreak>`;

                    // Pages
                    for (let i = 0; i < s.p.length; i++) {
                        webPage += `<div id="page-${i+1}"><div id="slide"><seybreak><div id="command">${window.MSPFA.parseBBCode(s.p[i].c).outerHTML}</div><seybreak><div id="content">${window.MSPFA.parseBBCode(s.p[i].b).outerHTML.replace(/autoplay/g, 'au­toplay').replace(/src/g, 'media-src')}</div><seybreak><div id="foot"><div id="links">`;
                        for (let j = 0; j < s.p[i].n.length; j++) {
                            let nextPage = s.p[i].n[j];
                            if (s.p[nextPage-1]) {
                                webPage += `<div><a goto="${nextPage}" href="javascript://">${window.MSPFA.parseBBCode(s.p[nextPage-1].c).outerHTML.replace(/src/g, 'media-src')}</a></div>`;
                            }
                        }
                        webPage += `</div><br><span class="pagenum">${i+1}</span></div></div></div><seybreak><seybreak>`;
                    }

                    // Script
                    webPage += '</div></div><script>var imgs=document.querySelectorAll("img, video, iframe, canvas, object");var slidee=document.querySelector("#slide");var pad=getComputedStyle(slidee);if(pad){pad=parseFloat(pad.paddingLeft)+parseFloat(pad.paddingRight)}else{pad=50}var loadImg=function(){if(this.offsetWidth+pad<slidee.offsetWidth){this.classList.remove("major")}};for(var i=0;i<imgs.length;i+=1){imgs[i].classList.add("major");imgs[i].addEventListener("load",loadImg);imgs[i].addEventListener("error",loadImg)}var toggleSpoiler=function(){if(this.parentNode.parentNode.classList.contains("closed")){this.value=this.getAttribute("data-close");this.parentNode.parentNode.classList.remove("closed");this.parentNode.parentNode.classList.add("open")}else if(this.parentNode.parentNode.classList.contains("open")){this.value=this.getAttribute("data-open");this.parentNode.parentNode.classList.remove("open");this.parentNode.parentNode.classList.add("closed")}};document.querySelectorAll(".spoiler > div:first-child > input").forEach(spoiler=>{spoiler.addEventListener("click",toggleSpoiler)});document.addEventListener("keydown",evt=>{if(evt.key==="ArrowLeft"){goToPage(currentPage-1)}else if(evt.key==="ArrowRight"){goToPage(currentPage+1)}else if(evt.key==="Control"){document.querySelectorAll(`#page-${ currentPage } .spoiler > div:first-child > input[type=button]`).forEach(button=>{button.click()})}});var jumpto=document.querySelector("#jumpto");var goToPage=function(p){document.querySelector(`#page-${ p }`).scrollIntoView();window.scrollBy(0,-34);reloadMedia(p)};var reloadMedia=function(p){document.querySelectorAll(`#page-${ p } *[media-src]`).forEach(media=>{media.setAttribute("src",media.getAttribute("media-src"))})};jumpto.querySelector(`input[type="button"]`).addEventListener("click",()=>{goToPage(jumpto.querySelector("input").value)});jumpto.querySelector(`input[type="number"]`).addEventListener("keydown",evt=>{if(evt.key==="Enter"){goToPage(jumpto.querySelector("input").value)}});document.querySelectorAll("#links a[goto]").forEach(link=>{link.addEventListener("click",()=>{goToPage(link.getAttribute("goto"))})});var pages=document.querySelectorAll("#slide");var currentPage=1;document.addEventListener("scroll",()=>{for(let i=0;i<pages.length;i+=1){if(pages[i].offsetTop<window.scrollY+40){currentPage=i+1}else{break}}document.querySelectorAll(`#page-${currentPage-2}, #page-${currentPage-1}, #page-${ currentPage }, #page-${currentPage+1}, #page-${currentPage+2}`).forEach(page=>{page.querySelectorAll("*[media-src]").forEach(media=>{if(!media.getAttribute("src")||page.id===`page-${currentPage-1}`){media.setAttribute("src",media.getAttribute("media-src"))}})})});</script></body></html>';

                    webPage = webPage.replace(/<seybreak>/g, `
`);
                    return webPage;
                }

                exportButton.addEventListener('click', () => {
                    downloadDataLink.setAttribute('download', `${story.n} (${story.i}).json`);
                    downloadLink.setAttribute('download', `${story.n} (${story.i}).html`);

                    if (!pageHTML) {
                        pageHTMLnoCSS = generateHTML(story);
                        pageHTML = pageHTMLnoCSS.replace('<style>/*sey-css*/</style>', `<style>${cleanCSS}</style>`);
                        downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pageHTML));
                        downloadDataLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(story, null, 4)));
                    }

                    window.MSPFA.dialog('Export', exportContent, ["Close"]);
                });

                window.MSPFA.request(0, {
                    do: "story",
                    s: params.s
                }, (s) => {
                    if (s) {
                        story = s;

                        delete story.f;
                        delete story.g;

                        // Display week of anniversary banner
                        const now = new Date();
                        const ann = new Date(s.d);
                        ann.setFullYear(now.getFullYear());

                        if (now > +ann + 7*24*60*60*1000) {
                            ann.setFullYear(now.getFullYear() + 1);
                        }

                        const end = new Date(+ann + 7*24*60*60*1000);

                        const staText = createElement('span', { textContent: ann.toDateString().slice(4, 10), title: getRelativeTime(ann) });
                        const endText = createElement('span', { textContent: end.toDateString().slice(4, 10), title: getRelativeTime(end) });
                        bannerInput.parentNode.insertBefore(endText, bannerInput.nextSibling.nextSibling);
                        bannerInput.parentNode.insertBefore(textNode(' - '), bannerInput.nextSibling.nextSibling);
                        bannerInput.parentNode.insertBefore(staText, bannerInput.nextSibling.nextSibling);
                        bannerInput.parentNode.insertBefore(newBr(), bannerInput.nextSibling.nextSibling);
                    }
                });
            }
        }
        else if (location.pathname === "/my/stories/pages/" && location.search) {
            if (params.p) {
                pageLoad(() => {
                    const selected = document.querySelector(`#p${params.p}`);
                    if (selected) {
                        selected.style = '';
                        selected.scrollIntoView();
                        selected.style.outline = '5px solid #000f';
                        selected.style.transition = '0.5s';
                        pageLoad(() => {
                            if (pageLoaded) {
                                selected.style.outline = '5px solid #0000';
                            }
                        });

                        return true;
                    }
                }, 1);
            }

            const adventureID = params.s;

            const bbtoolbar = document.querySelector('#bbtoolbar');

            const notifyLabel = createLabel('Notify readers of new pages during this editing session: ', 'notifyreaders');
            const notifyButton = document.querySelector('#notifyreaders');
            notifyButton.previousSibling.textContent = '';
            notifyButton.parentNode.insertBefore(notifyLabel, notifyButton);

            if (!drafts[adventureID]) {
                drafts[adventureID] = {};
                saveDrafts(drafts);
            }

            // Add key combos for bolding, underlining, italicizing, quick colours, and drafts. More can be added in the future.
            document.body.addEventListener('keydown', ke => {
                const elm = document.activeElement;
                if (elm.nodeName === "TEXTAREA") {
                    let form = elm.parentNode.parentNode.parentNode.parentNode.parentNode;
                    if (elm.name === 'body') {
                        if (ke.key === "b" && ke.ctrlKey && !ke.shiftKey && !ke.altKey) {
                            ke.preventDefault();
                            bbtoolbar.querySelector("input[data-tag='b']").click();
                        } else if (ke.key === "i" && ke.ctrlKey && !ke.shiftKey && !ke.altKey) {
                            ke.preventDefault();
                            bbtoolbar.querySelector("input[data-tag='i']").click();
                        } else if (ke.key === "u" && ke.ctrlKey && !ke.shiftKey && !ke.altKey) {
                            ke.preventDefault();
                            bbtoolbar.querySelector("input[data-tag='u']").click();
                        } else if (ke.key === "c" && ke.ctrlKey && !ke.shiftKey && ke.altKey) {
                            ke.preventDefault();
                            bbtoolbar.querySelector("input[data-tag='color']").click();
                            document.querySelector('#dialog button').click();
                        } else if (ke.key === "d" && ke.ctrlKey && !ke.shiftKey && !ke.altKey) {
                            if (form.id !== "newpage") {
                                ke.preventDefault();
                                form.querySelector('.draft').click();
                            }
                        } else if (ke.key === "k" && ke.ctrlKey) {
                            ke.preventDefault();
                            bbtoolbar.querySelector("input[data-tag='link']").click();
                        } else if (ke.key === 'Enter') {
                            if (settings.shortcuts[params.s]) {
                                let longestShortcut = 0;

                                settings.shortcuts[params.s].forEach(shortcut => {
                                    longestShortcut = Math.max(longestShortcut, shortcut.name.length);
                                });

                                longestShortcut++;

                                if (longestShortcut > 0) {
                                    const backread = elm.value.slice(Math.max(elm.selectionStart - longestShortcut, 0), elm.selectionStart);

                                    let shortcut;

                                    settings.shortcuts[params.s].forEach(s => {
                                        if (s.name.length > 0) {
                                            if (backread.endsWith('$' + s.name)) {
                                                shortcut = s;
                                                return;
                                            }
                                        }
                                    });

                                    if (shortcut) {
                                        let start = elm.selectionStart;
                                        let end = elm.selectionEnd;
                                        const offset = 1 + shortcut.name.length;

                                        elm.value = elm.value.slice(0, elm.selectionStart - shortcut.name.length - 1) + elm.value.slice(elm.selectionStart);

                                        shortcut.start = shortcut.start.replace(/\\n/g, '\n');
                                        shortcut.end = shortcut.end.replace(/\\n/g, '\n');
                                        start -= offset;
                                        end -= offset;

                                        elm.value = elm.value.slice(0, start) + shortcut.start + elm.value.slice(start, end) + shortcut.end + elm.value.slice(end);
                                        elm.selectionStart = start + shortcut.start.length;
                                        elm.selectionEnd = end + shortcut.start.length;
                                        ke.preventDefault();
                                    }
                                }
                            }
                        }
                    }
                } else if (elm.nodeName === "INPUT" && elm.name === 'cmd') {

                }
            });

            pageLoad(() => {
                const title = document.querySelector('#storyname').textContent;

                if (title !== '-') {
                    drafts[adventureID].cachedTitle = title;
                    saveDrafts(drafts);

                    setTitle('Pages - ' + title);

                    return true;
                }
            });

            // Button links
            addLink(document.querySelector('#editinfo'), `/my/stories/info/?s=${adventureID}`);

            // Default spoiler values
            const replaceButton = document.querySelector('#replaceall');
            const spoilerButton = createElement('input', { className: 'major', value: 'Default Spoilers', type: 'button'});
            replaceButton.parentNode.insertBefore(spoilerButton, replaceButton);

            if (!settings.spoilerValues[adventureID]) {
                settings.spoilerValues[adventureID] = {
                    open: 'Show',
                    close: 'Hide'
                }
            }

            spoilerButton.addEventListener('click', evt => {
                const spoilerSpan = document.createElement('span');
                const spoilerOpen = document.createElement('input');
                const spoilerClose = document.createElement('input');
                addChildren(spoilerSpan, [
                    textNode('Open button text:'),
                    newBr(),
                    spoilerOpen,
                    newBr(), newBr(),
                    textNode('Close button text:'),
                    newBr(),
                    spoilerClose
                ]);

                spoilerOpen.value = settings.spoilerValues[adventureID].open;
                spoilerClose.value = settings.spoilerValues[adventureID].close;

                window.MSPFA.dialog('Default Spoiler Values', spoilerSpan, ['Save', 'Cancel'], (output, form) => {
                    if (output === 'Save') {
                        settings.spoilerValues[adventureID].open = spoilerOpen.value === '' ? 'Show' : spoilerOpen.value;
                        settings.spoilerValues[adventureID].close = spoilerClose.value === '' ? 'Hide' : spoilerClose.value;
                        if (settings.spoilerValues[adventureID].open === 'Show' && settings.spoilerValues[adventureID].close === 'Hide') {
                            delete settings.spoilerValues[adventureID];
                        }
                        saveSettings();
                    }
                });
            });

            document.querySelector('input[title="Spoiler"]').addEventListener('click', evt => {
                document.querySelector('#dialog input[name="open"]').value = document.querySelector('#dialog input[name="open"]').placeholder = settings.spoilerValues[adventureID].open;
                document.querySelector('#dialog input[name="close"]').value = document.querySelector('#dialog input[name="close"]').placeholder = settings.spoilerValues[adventureID].close;
            });

            // Custom text shortcuts
            const shortcutButton = createElement('input', { className: 'major', value: 'Text Shortcuts', type: 'button'});
            replaceButton.parentNode.insertBefore(textNode(' '), replaceButton);
            replaceButton.parentNode.insertBefore(shortcutButton, replaceButton);
            replaceButton.parentNode.insertBefore(newBr(), replaceButton);
            replaceButton.parentNode.insertBefore(newBr(), replaceButton);

            shortcutButton.addEventListener('click', () => {
                loadSettings();

                const shortcutContent = createElement('span');
                const shortcutTable = shortcutContent.appendChild(createElement('table', { style: 'width: 100%' })).appendChild(createElement('tbody'));
                const shortcutHeader = shortcutTable.appendChild(createElement('tr'));
                shortcutHeader.appendChild(createElement('th', { textContent: 'Shortcut Name' }));
                shortcutHeader.appendChild(createElement('th', { textContent: 'Autofill Start' }));
                shortcutHeader.appendChild(createElement('th', { textContent: 'Autofill End' }));

                const addNewRow = (autofill) => {
                    const newRow = shortcutTable.appendChild(createElement('tr'));
                    newRow.appendChild(createElement('td')).appendChild(createElement('input', { type: 'text', value: autofill ? autofill.name : '', placeholder: 'shortcut' })).addEventListener('keydown', evt => {
                        setTimeout(() => {
                            evt.target.value = evt.target.value.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
                        }, 1);
                    });
                    newRow.appendChild(createElement('td')).appendChild(createElement('input', { type: 'text', value: autofill ? autofill.start : '', placeholder: '[spoiler]' }));
                    newRow.appendChild(createElement('td')).appendChild(createElement('input', { type: 'text', value: autofill ? autofill.end : '', placeholder: '[/spoiler]' }));
                    const addDelButton = newRow.appendChild(createElement('td')).appendChild(createElement('input', { type: 'button', value: autofill ? 'x' : '+', className: 'major', style: 'padding: 0;' }));
                    addDelButton.addEventListener('click', () => {
                        if (addDelButton.value === '+') {
                            addNewRow();
                            addDelButton.value = 'x';
                        } else {
                            shortcutTable.removeChild(newRow);
                        }
                    });
                }

                if (settings.shortcuts[params.s]) {
                    settings.shortcuts[params.s].forEach(shortcut => {
                        addNewRow(shortcut);
                    });
                }

                addNewRow();

                shortcutContent.appendChild(newBr());

                const explanation = shortcutContent.appendChild(createElement('span', { textContent: 'Shortcuts are performed by typing "$" followed by the shortcut name.', style: 'font-size: 12px;' }));

                window.MSPFA.dialog('Text Shortcuts', shortcutContent, ['Save', 'Cancel'], (output, form) => {
                    if (output === 'Save') {
                        loadSettings();

                        if (!settings.shortcuts[params.s]) {
                            settings.shortcuts[params.s] = [];
                        }

                        const shortcutList = [];
                        const shortcutInputs = Array.from(shortcutTable.querySelectorAll('tr:not(:last-child) > td > input[type="text"]')).map(a => a.value);
                        for (let i = 0; i < shortcutInputs.length; i++) {
                            shortcutList.push({
                                name: shortcutInputs[i],
                                start: shortcutInputs[++i],
                                end: shortcutInputs[++i]
                            });
                        }

                        settings.shortcuts[params.s] = shortcutList;

                        saveSettings();
                    }
                });
            });

            // --- Custom BBToolbar buttons
            // Buttonless spoilers
            const flashButton = document.querySelector('input[title=Flash]');
            const newSpoilerButton = createElement('input', { title: 'Buttonless Spoiler', type: 'button', style: 'background-position: -66px -88px;' });
            newSpoilerButton.setAttribute('data-tag', 'Buttonless Spoiler');

            newSpoilerButton.addEventListener('click', evt => {
                const bbe = bbtoolbar.parentNode.querySelector('textarea');
                if (bbe) {
                    bbe.focus();
                    const start = bbe.selectionStart;
                    const end = bbe.selectionEnd;
                    bbe.value = bbe.value.slice(0, start) + '<div class="spoiler"><div>' + bbe.value.slice(start, end) + '</div></div>' + bbe.value.slice(end);
                    bbe.selectionStart = start + 26;
                    bbe.selectionEnd = end + 26;
                }
            });

            flashButton.parentNode.insertBefore(newSpoilerButton, flashButton);

            // Audio button
            const audioButton = createElement('input', { title: 'Audio Player', type: 'button', style: 'background-position: -22px -110px' });

            audioButton.addEventListener('click', evt => {
                const bbe = document.querySelector('#bbtoolbar').parentNode.querySelector('textarea');
                if (bbe) {
                    const msg = window.MSPFA.parseBBCode('Audio URL:<br>');
                    const audioInput = createElement('input', { type: 'url', name: 'audio-url', required: true });
                    const autoplayButton = createElement('input', { type: 'checkbox', id: 'autoplay', checked: true });
                    const loopButton = createElement('input', { type: 'checkbox', id: 'loop', checked: true });
                    const controlsButton = createElement('input', { type: 'checkbox', id: 'controls', checked: false });

                    addChildren(msg, [
                        audioInput,
                        newBr(),
                        createLabel('Autoplay: ', 'autoplay'),
                        autoplayButton,
                        newBr(),
                        createLabel('Loop: ', 'loop'),
                        loopButton,
                        newBr(),
                        createLabel('Show controls: ', 'controls'),
                        controlsButton,
                        newBr()
                    ]);

                    window.MSPFA.dialog("Audio Player", msg, ["Okay", "Cancel"], (output, form) => {
                        if (output == "Okay") {
                            const start = bbe.selectionStart;
                            const end = bbe.selectionEnd;
                            const properties = `"${autoplayButton.checked ? ' autoplay' : ''}${loopButton.checked ? ' loop' : ''}${controlsButton.checked ? ' controls' : ''}`;
                            bbe.value = bbe.value.slice(0, start) + '<audio src="' + audioInput.value + properties +'></audio>' + bbe.value.slice(start);
                            bbe.selectionStart = start + properties.length + audioInput.value.length + 13;
                            bbe.selectionEnd = end + properties.length + audioInput.value.length + 13;
                        }

                    });

                    audioInput.select();
                }
            });

            flashButton.insertAdjacentElement('afterEnd', audioButton);

            // YouTube button
            const youtubeButton = createElement('input', { title: 'YouTube Video', type: 'button', style: 'background-position: 0px -110px' });

            youtubeButton.addEventListener('click', evt => {
                const bbe = document.querySelector('#bbtoolbar').parentNode.querySelector('textarea');
                if (bbe) {
                    const msg = window.MSPFA.parseBBCode('Video URL:<br>');
                    const videoUrl = createElement('input', { type: 'url', name: 'youtube', required: true });
                    const autoplayButton = createElement('input', { type: 'checkbox', id: 'autoplay', checked: true });
                    const controlsButton = createElement('input', { type: 'checkbox', id: 'controls', checked: true });
                    const fullscreenButton = createElement('input', { type: 'checkbox', id: 'fullscreen', checked: true });

                    const widthInput = createElement('input', { type: 'number', required: true, value: 650, style: 'width: 5em' });
                    const heightInput = createElement('input', { type: 'number', required: true, value: 450, style: 'width: 5em' });

                    addChildren(msg, [
                        videoUrl,
                        newBr(),
                        createLabel('Autoplay: ', 'autoplay'),
                        autoplayButton,
                        newBr(),
                        createLabel('Show controls: ', 'controls'),
                        controlsButton,
                        newBr(),
                        createLabel('Allow fullscreen: ', 'fullscreen'),
                        fullscreenButton,
                        newBr(),
                        textNode('Embed size: '),
                        widthInput,
                        textNode('x'),
                        heightInput
                    ]);

                    window.MSPFA.dialog("YouTube Embed", msg, ["Okay", "Cancel"], (output, form) => {
                        if (output == "Okay") {
                            let videoID = videoUrl.value.split('/');
                            videoID = videoID[videoID.length-1].replace('watch?v=', '').split('&')[0];

                            const start = bbe.selectionStart;
                            const end = bbe.selectionEnd;
                            const iframeContent = `<iframe width="${widthInput.value}" height="${heightInput.value}" src="https://www.youtube.com/embed/${videoID}?autoplay=${+autoplayButton.checked}&controls=${+controlsButton.checked}" frameborder="0" allow="accelerometer; ${autoplayButton.checked ? 'autoplay; ' : ''}encrypted-media;"${fullscreenButton.checked ? ' allowfullscreen' : ''}></iframe>`;
                            bbe.value = bbe.value.slice(0, start) + iframeContent + bbe.value.slice(start);
                            bbe.selectionStart = start + iframeContent + 13;
                            bbe.selectionEnd = end + iframeContent + 13;
                        }
                    });

                    videoUrl.select();
                }
            });

            flashButton.insertAdjacentElement('afterEnd', youtubeButton);
            flashButton.insertAdjacentText('afterEnd', ' ');

            // Get preview link
            const getPreviewLink = (form) => {
                const page = parseInt(form.querySelector('a.major').textContent.replace('Page ', ''));
                return "/preview/?s=" + params.s + "&p=" + page + "&d=" + encodeURIComponent(JSON.stringify({
                    p: page,
                    c: form.querySelector('input[name=cmd]').value,
                    b: form.querySelector('textarea[name=body]').value,
                    n: form.querySelector('input[name=next]').value,
                    k: !form.querySelector('input[name=usekeys]').checked
                }));
            }

            //todo maybe use getPreviewLink and clearListeners on the preview buttons to enable use as links again

            // -- Drafts --
            const addDraftPagesButton = document.createElement('input');

            // Accessing draft text
            const accessDraftsButton = createElement('input', { className: 'major', value: 'Saved Drafts', type: 'button' });
            replaceButton.parentNode.insertBefore(accessDraftsButton, replaceButton);
            accessDraftsButton.parentNode.insertBefore(textNode(' '), replaceButton);

            accessDraftsButton.addEventListener('click', () => {
                loadDrafts();

                const draftDialog = window.MSPFA.parseBBCode('Use the textbox below to copy out the data and save to a file somewhere else, or click the download button below.\nYou can also paste in data to replace the current drafts to ones stored there.');
                const draftInputTextarea = document.createElement('textarea');
                draftInputTextarea.placeholder = 'Paste your draft data here';
                draftInputTextarea.style = 'width: 100%; box-sizing: border-box; resize: vertical;';

                const downloadLink = document.createElement('a');
                downloadLink.textContent = 'Download drafts';
                downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(drafts[adventureID], null, 4)));
                downloadLink.setAttribute('download', `${adventureID}.json`);

                draftInputTextarea.rows = 8;
                addChildren(draftDialog, [
                    newBr(), newBr(),
                    draftInputTextarea,
                    newBr(), newBr(),
                    downloadLink
                ]);

                setTimeout(() => {
                    draftInputTextarea.focus();
                    draftInputTextarea.selectionStart = 0;
                    draftInputTextarea.selectionEnd = 0;
                    draftInputTextarea.scrollTop = 0;
                }, 1);

                draftInputTextarea.value = JSON.stringify(drafts[adventureID], null, 4);

                window.MSPFA.dialog('Saved Drafts', draftDialog, ["Load Draft", "Cancel"], (output, form) => {
                    if (output === "Load Draft") {
                        if (draftInputTextarea.value === '') {
                            setTimeout(() => {
                                window.MSPFA.dialog('Saved Drafts', window.MSPFA.parseBBCode('Are you sure you want to delete this adventure\'s draft data?\nMake sure you have it saved somewhere!'), ["Delete", "Cancel"], (output, form) => {
                                    if (output === "Delete") {
                                        loadDrafts();
                                        drafts[adventureID] = {};

                                        if (settings.drafts && settings.drafts[adventureID]) {
                                            delete settings.drafts[adventureID];
                                            saveSettings();
                                        }

                                        saveDrafts(drafts);
                                    }
                                });
                            }, 1);
                        } else if (draftInputTextarea.value !== JSON.stringify(drafts[adventureID], null, 4)) {
                            setTimeout(() => {
                                window.MSPFA.dialog('Saved Drafts', window.MSPFA.parseBBCode('Are you sure you want to load this draft data?\nAll previous draft data for this adventure will be lost!'), ["Load", "Cancel"], (output, form) => {
                                    if (output === "Load") {
                                        let newData = {};
                                        try { // Just in case the data given is invalid.
                                            newData = JSON.parse(draftInputTextarea.value);
                                        } catch (err) {
                                            console.error(err);
                                            setTimeout(() => {
                                                window.MSPFA.dialog('Error', window.MSPFA.parseBBCode('The entered data is invalid.'), ["Okay"]);
                                            }, 1);
                                            return;
                                        }

                                        loadDrafts();
                                        drafts[adventureID] = newData;
                                        saveDrafts(drafts);
                                    }
                                });
                            }, 1);
                        }
                    }
                });
            });

            replaceButton.parentNode.insertBefore(addDraftPagesButton, replaceButton);
            addDraftPagesButton.parentNode.insertBefore(newBr(), replaceButton);
            addDraftPagesButton.parentNode.insertBefore(newBr(), replaceButton);

            Object.assign(addDraftPagesButton, { className: 'major', value: 'Add Draft Pages', type: 'button' });
            addDraftPagesButton.addEventListener('click', () => {
                const newPageForm = document.querySelector('#newpage');
                const maxDraftsAllowed = 15;
                let currentPage = 1;
                let pageAmount = 0;
                if (newPageForm.nextSibling.nodeName !== '#text') {
                    currentPage = parseInt(newPageForm.nextSibling.id.replace('p', ''))+1;
                }
                for (let i = currentPage; drafts[adventureID][i] && pageAmount < maxDraftsAllowed; i++) {
                    pageAmount++;
                }

                let rangeStr = `s ${currentPage}-${currentPage+pageAmount-1}`;
                if (currentPage === currentPage+pageAmount-1) rangeStr = ` ${currentPage}`;

                if (pageAmount > 0) {
                    window.MSPFA.dialog("Drafts: Add New Pages", window.MSPFA.parseBBCode(`This will add the pages with draft data from page${rangeStr}.<br>[i][center](you are only allowed ${maxDraftsAllowed} at once)[/center][/i]`), ["Okay", "Cancel"], (output, form) => {
                        if (output === "Okay") {
                            for (let i = currentPage; drafts[adventureID][i] && i < currentPage+maxDraftsAllowed; i++) {
                                newPageForm.querySelector('input[name=cmd]').value = drafts[adventureID][i].command;
                                newPageForm.querySelector('textarea[name=body]').value = drafts[adventureID][i].pageContent;
                                if (drafts[adventureID][i].next) newPageForm.querySelector('input[name=next]').value = drafts[adventureID][i].next;

                                newPageForm.querySelector('input[name=save]').click();
                            }

                            // Here, you should check if it's possible to add other draft pages, and if not, disable the element.
                        }
                    });
                } else {
                    window.MSPFA.dialog("Drafts: Add New Pages", window.MSPFA.parseBBCode(`Even though you may have drafts saved, they cannot be added, since they can only fill pages that have not been added in the page editor.\n\nIf you wish you load a draft for a pre-existing page, you can click the [Draft] button, then [Load].`), ["Okay"]);
                }
            });

            const addMovePageButton = createElement('input', { className: 'major', value: 'Move Page', type: 'button' });
            replaceButton.parentNode.insertBefore(addMovePageButton, replaceButton);
            replaceButton.parentNode.insertBefore(textNode(' '), replaceButton);

            const movePageError = () => {
                setTimeout(() => {
                    window.MSPFA.dialog("Move Page: Invalid Input", window.MSPFA.parseBBCode("One or more of the page numbers were invalid."), ["Okay"]);
                },1);
            }

            addMovePageButton.addEventListener('click', () => {
                const movePageContent = window.MSPFA.parseBBCode(`Move page <input required type="number" min="1" step="1" style="width: 4em" id="startPage"> to its new position <select></select> the current page <input required type="number" min="1" step="1" style="width: 4em" id="endPage">\n\n[i]Note: This is not recommended for stories with branching paths. You need to manually change pages with different Next Page(s) values.\nThis is also a WIP and may not function accurately.[/i]`);

                const startPageInput = movePageContent.querySelector('#startPage');
                const endPageInput = movePageContent.querySelector('#endPage');

                const posSelect = movePageContent.querySelector('select');
                ["before", "after"].forEach(o => {
                    const option = document.createElement('option');
                    option.textContent = o;
                    option.value = o;
                    posSelect.appendChild(option);
                });

                window.MSPFA.dialog("Move Page", movePageContent, ["Okay", "Cancel"], (output, form) => {
                    if (output === "Okay") {
                        const currentPages = document.querySelectorAll('#storypages form:not(#newpage)').length;

                        if (+startPageInput.value && +endPageInput.value) {
                            const startValue = Math.floor(+startPageInput.value);
                            const endValue = Math.floor(+endPageInput.value);
                            const finalValue = endValue + posSelect.selectedIndex;
                            const movingDirection = finalValue > startValue ? 1 : 0;

                            if (startValue > 0 && startValue <= currentPages && endValue > 0 && endValue <= currentPages && startValue !== endValue && startValue !== finalValue && finalValue <= currentPages) {
                                setTimeout(() => {
                                    window.MSPFA.dialog("Move Page: Confirmation", window.MSPFA.parseBBCode(`Are you sure you want to move page ${startValue} to become page ${finalValue}, shifting all pages inbetween in the process?`), ["Okay", "Cancel"], (output, form) => {
                                        if (output === "Okay") {
                                            for (let i = startValue; i !== finalValue; i += [-1, 1][movingDirection]) {
                                                document.querySelector(`#p${i} input[name="move${['down', 'up'][movingDirection]}"]`).click();
                                            }

                                            setTimeout(() => {
                                                window.MSPFA.dialog("Move Page: Notice", window.MSPFA.parseBBCode("Don't forget to press [b]save all[/b] to save the changes, and if you have any branching paths, update the Next Page(s)."), ["Okay"]);
                                            },1);
                                        }
                                    });
                                }, 1);
                            } else {
                                movePageError();
                            }
                        } else {
                            movePageError();
                        }
                    }
                });
            });

            // Draft stuff
            const showDraftDialog = (pageNum) => {
                loadDrafts();

                const msg = document.createElement('span');
                const commandInput = createElement('input', { style: 'width: 100%; box-sizing: border-box;', readOnly: true, });
                const bodyInput = createElement('textarea', { style: 'width: 100%; box-sizing: border-box; resize: vertical;', readOnly: true, rows: 8 });
                const nextPageInput = createElement('input', { style: 'width: 100%; box-sizing: border-box;', readOnly: true, });

                addChildren(msg, [
                    textNode('Command:'),
                    newBr(),
                    commandInput,
                    newBr(), newBr(),
                    textNode('Body:'),
                    bodyInput,
                    newBr(), newBr(),
                    textNode('Next page(s):'),
                    newBr(),
                    nextPageInput
                ]);

                const pageElement = document.querySelector(`#p${pageNum}`);

                let shownMessage = msg;
                let optionButtons = [];

                const commandElement = pageElement.querySelector('input[name="cmd"]');
                const pageContentElement = pageElement.querySelector('textarea[name="body"]');
                const nextPagesElement = pageElement.querySelector('input[name="next"]');

                if (typeof drafts[adventureID][pageNum] === "undefined") {
                    shownMessage = textNode('There is no draft saved for this page.');
                    optionButtons = ["Save New", "Close"];
                } else {
                    commandInput.value = drafts[adventureID][pageNum].command;
                    bodyInput.textContent = drafts[adventureID][pageNum].pageContent;
                    nextPageInput.value = drafts[adventureID][pageNum].next ? drafts[adventureID][pageNum].next : parseInt(pageNum)+1;
                    optionButtons = ["Save New", "Load", "Delete", "Close"];
                }

                window.MSPFA.dialog(`Page ${pageNum} Draft`, shownMessage, optionButtons, (output, form) => {
                    if (output === "Save New") {
                        if (typeof drafts[adventureID][pageNum] === "undefined") {
                            loadDrafts();
                            drafts[adventureID][pageNum] = {
                                command: commandElement.value,
                                pageContent: pageContentElement.value,
                                next: nextPagesElement.value
                            }
                            saveDrafts(drafts);
                        } else {
                            setTimeout(() => {
                                window.MSPFA.dialog('Overwrite current draft?', textNode('Doing this will overwrite your current draft with what is currently written in the page box. Are you sure?'), ["Yes", "No"], (output, form) => {
                                    if (output === "Yes") {
                                        loadDrafts();
                                        drafts[adventureID][pageNum] = {
                                            command: commandElement.value,
                                            pageContent: pageContentElement.value,
                                            next: nextPagesElement.value
                                        }
                                        saveDrafts(drafts);
                                    }
                                });
                            }, 1);
                        }
                    } else if (output === "Load") {
                        if (pageContentElement.value === '' && (commandElement.value === '' || commandElement.value === document.querySelector('#defaultcmd').value)) {
                            commandElement.value = drafts[adventureID][pageNum].command;
                            pageContentElement.value = drafts[adventureID][pageNum].pageContent;
                            if (drafts[adventureID][pageNum].next) nextPagesElement.value = drafts[adventureID][pageNum].next;
                            pageElement.querySelector('input[value="Save"]').disabled = false;
                        } else {
                            setTimeout(() => {
                                window.MSPFA.dialog('Overwrite current page?', textNode('Doing this will overwrite the page\'s content with what is currently written in the draft. Are you sure?'), ["Yes", "No"], (output, form) => {
                                    if (output === "Yes") {
                                        commandElement.value = drafts[adventureID][pageNum].command;
                                        pageContentElement.value = drafts[adventureID][pageNum].pageContent;
                                        if (drafts[adventureID][pageNum].next) nextPagesElement.value = drafts[adventureID][pageNum].next;
                                        pageElement.querySelector('input[value="Save"]').disabled = false;
                                    }
                                });
                            }, 1);
                        }
                    } else if (output === "Delete") {
                        setTimeout(() => {
                            window.MSPFA.dialog('Delete this draft?', textNode('This action is irreversable! Are you sure?'), ["Yes", "No"], (output, form) => {
                                if (output === "Yes") {
                                    loadDrafts();
                                    delete drafts[adventureID][pageNum];

                                    if (settings.drafts && settings.drafts[adventureID] && settings.drafts[adventureID][pageNum]) {
                                        delete settings.drafts[adventureID][pageNum];
                                        saveSettings();
                                    }

                                    saveDrafts(drafts);
                                }
                            });
                        }, 1);
                    }
                });
            }

            const createDraftButton = (form) => {
                const draftButton = createElement('input', { className: 'major draft', type: 'button', value: 'Draft' });
                draftButton.addEventListener('click', () => {
                    showDraftDialog(form.id.replace('p', ''));
                });
                return draftButton;
            }

            // Wait for the page to load completely before doing anything in regards to pages
            pageLoad(() => {
                let allPages = document.querySelectorAll('#storypages form:not(#newpage)');
                if (allPages.length !== 0) {
                    allPages.forEach(form => {
                        const prevButton = form.querySelector('input[name="preview"]');
                        prevButton.parentNode.insertBefore(createDraftButton(form), prevButton);
                        prevButton.parentNode.insertBefore(textNode(' '), prevButton);

                        // Preview
                        /*
                        const previewButton = form.querySelector('input[value=Preview]');
                        const previewLink = addLink(previewButton, getPreviewLink(form), '_blank');
                        previewButton.addEventListener('mousedown', () => {
                            previewLink.href = getPreviewLink(form);
                        });
                        previewButton.parentNode.appendChild(previewButton.cloneNode());
                        previewButton.parentNode.removeChild(previewButton);
                        */

                        // "Enable keyboard shortcuts" label
                        const shortcutCheck = form.querySelector('input[type="checkbox"]');
                        shortcutCheck.previousSibling.textContent = '';
                        shortcutCheck.id = `key-${form.id}`;
                        shortcutCheck.parentNode.insertBefore(createLabel('Enable keyboard shortcuts: ', shortcutCheck.id), shortcutCheck);
                    });
                    document.querySelector('input[value="Add"]').addEventListener('click', () => {
                        allPages = document.querySelectorAll('#storypages form:not(#newpage)');
                        const form = document.querySelector(`#p${allPages.length}`);
                        const prevButton = form.querySelector('input[name="preview"]');
                        const draftButton = createDraftButton(form);
                        prevButton.parentNode.insertBefore(draftButton, prevButton);
                        prevButton.parentNode.insertBefore(textNode(' '), prevButton);

                        /*draftButton.click();
                        dialog.querySelector('button').click();
                        setTimeout(() => {
                            dialog.querySelectorAll('button').forEach(button => {
                                if (button.textContent === 'No') button.click();
                            });
                        }, 1);*/
                        // Preview link
                        /*
                        const previewButton = form.querySelector('input[value=Preview]');
                        const previewLink = addLink(previewButton, getPreviewLink(form), '_blank');
                        previewButton.addEventListener('mousedown', () => {
                            previewLink.href = getPreviewLink(form);
                        });
                        previewLink.appendChild(previewButton.cloneNode());
                        previewLink.removeChild(previewButton);
                        */

                        // "Enable keyboard shortcuts" label
                        const shortcutCheck = form.querySelector('input[type="checkbox"]');
                        shortcutCheck.previousSibling.textContent = '';
                        shortcutCheck.id = `key-${form.id}`;
                        shortcutCheck.parentNode.insertBefore(createLabel('Enable keyboard shortcuts: ', shortcutCheck.id), shortcutCheck);
                    });
                    const newForm = document.querySelector('#newpage');
                    {
                        // "Enable keyboard shortcuts" label
                        const shortcutCheck = newForm.querySelector('input[type="checkbox"]');
                        shortcutCheck.previousSibling.textContent = '';
                        shortcutCheck.id = `key-${newForm.id}`;
                        shortcutCheck.parentNode.insertBefore(createLabel('Enable keyboard shortcuts: ', shortcutCheck.id), shortcutCheck);
                    }
                    /*
                    const newPreviewButton = newForm.querySelector('input[value=Preview]');
                    const newPreviewLink = addLink(newPreviewButton, getPreviewLink(newForm), '_blank');
                    newPreviewButton.addEventListener('mousedown', () => {
                        newPreviewLink.href = getPreviewLink(newForm);
                    });
                    newPreviewLink.appendChild(newPreviewButton.cloneNode());
                    newPreviewLink.removeChild(newPreviewButton);
                    */




                    const pageTables = [];
                    const storyPages = document.querySelectorAll('#storypages form:not(#newpage)');

                    const checkTableVisibility = () => {
                        storyPages.forEach(page => {
                            if (page.style.display === "none" && page.getElementsByTagName('table').length > 0) {
                                page.removeChild(page._table);
                            }
                        });
                    }
                    const loadAllPages = () => {
                        storyPages.forEach(page => {
                            page.appendChild(page._table);
                        });
                    }

                    const pageObserver = new MutationObserver((muts) => {
                        muts.forEach(mutation => {
                            if (mutation.type === 'attributes') {
                                if (mutation.target.style.display === "none") {
                                    mutation.target.removeChild(mutation.target._table);
                                } else {
                                    mutation.target.appendChild(mutation.target._table);
                                }
                            }
                        });
                    });

                    storyPages.forEach(page => {
                        pageObserver.observe(page, { attributes: true });
                        page._table = page.getElementsByTagName('table')[0];
                    });

                    checkTableVisibility();

                    // dialog on open (if dialog name is Move Pages or Find and Replace then load all of the pages back up)
                    dialogOnOpen.push((dialogTitle) => {
                        const whiteList = ['Move Page', 'Find and Replace']; //, 'BBCode: Color', 'BBCode: Background'
                        if (whiteList.indexOf(dialogTitle.textContent) !== -1) {
                            loadAllPages();
                        }
                    });
                    // dialog on close (unload all hidden pages)
                    dialogOnClose.push(() => {
                        const removeElementsAgain = () => {
                            setTimeout(() => {
                                if (dialogTitle.textContent === '') {
                                    checkTableVisibility();
                                } else {
                                    removeElementsAgain();
                                }
                            }, 500);
                        }
                        removeElementsAgain();
                    });

                    return true;
                }
            });

            if (params.click) {
                if (params.click === 's') {
                    spoilerButton.click();
                } else if (params.click === 'd') {
                    accessDraftsButton.click();
                }
            }

            // Focus on select dropdown when choosing font
            document.querySelector('#bbtoolbar input[data-tag=font]').addEventListener('click', () => {
                setTimeout(() => {
                    document.querySelector('#dialog select').focus();
                }, 1);
            });

            // Revamped colour menu
            const colourButtons = [
                clearListeners(document.querySelector('#bbtoolbar input[data-tag=color]')),
                clearListeners(document.querySelector('#bbtoolbar input[data-tag=background]'))
            ];

            if (!settings.colours[params.s]) {
                settings.colours[params.s] = [{list: []}];
                saveSettings();
            }

            const colourMenu = createElement('span', { style: 'display: flex; flex-wrap: wrap; justify-content: center; font-weight: bold; width: 480px;' });
            const colourList = createElement('span', { id: 'coloursContainer' });
            const editColours = createElement('input', { type: 'button', className: 'major pencil iconbutton' });

            addChildren(colourMenu, [
                addChildren(createElement('span'), [
                    textNode("This Adventure's Saved Colors "),
                    editColours,
                    textNode(":"),
                ]),
                newBr(),
                newBr(),
                colourList
            ]);

            let lastIndex = 0;
            let lastcategoryindex = -1;

            const hexToHSL = (hex) => {
                const [r, g, b] = hex.match(/\w{2}/g).map(c => parseInt(c, 16) / 255);
                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                let h = 0, s = 0, l = (max + min) / 2, d = max - min;

                if (d) {
                    s = d / (1 - Math.abs(2 * l - 1));
                    switch (max) {
                        case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
                        case g: h = ((b - r) / d + 2) * 60; break;
                        case b: h = ((r - g) / d + 4) * 60; break;
                    }
                }

                return { h: Math.round(h), s: +s.toFixed(2) * 100, l: Math.max(0, +l.toFixed(2) * 100 + 10), d: Math.max(0, +l.toFixed(2) * 100 - 10) };
            }

            const createColourButton = (colour, picker = false) => {
                const button = createElement('input', { type: picker ? 'color' : 'button', className: 'major iconbutton colourbutton' });
                const hsl = hexToHSL(colour.hex);
                const hslA = `HSL(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
                const hslB = `HSL(${hsl.h}, ${hsl.s}%, ${hsl.d}%)`;
                button.style = `--colour: #${colour.hex}; --colourA: ${hslA}; --colourB: ${hslB};`;
                button.dataset.colour = colour.hex;
                if (picker) button.value = '#'+colour.hex;
                return button;
            }

            editColours.addEventListener('click', () => {
                setTimeout(() => {
                    loadSettings();
                    const tempColours = settings.colours[params.s];

                    const container = createElement('div', { id: 'categoryandcolourlist' });
                    const parent = createElement('span');

                    const newCategoryButton = createElement('input', { type: 'button', className: 'major iconbutton add' });
                    const newColourButton = createElement('input', { type: 'button', className: 'major iconbutton add' });

                    addChildren(parent, [
                        addChildren(createElement('span'), [
                            newColourButton,
                            textNode(' Add new color')
                        ]),
                        newBr(),
                        addChildren(createElement('span'), [
                            newCategoryButton,
                            textNode(' Add new category')
                        ]),
                        newBr(),
                        newBr(),
                        container
                    ]);

                    const createCategory = (category) => {
                        const categoryContainer = createElement('span', { className: 'editcolourcontainer' });
                        const categoryColours = createElement('span', { className: 'editcolourscontainer' });
                        const categorySpan = createElement('span', { className: 'editcolourcategory' });
                        const categoryName = category.name ? createElement('input', { type: 'text', value: category.name }) : textNode('(No Group)');

                        if (category.name) {
                            const categoryMoveUp = createElement('input', { type: 'button', className: 'major iconbutton move-up', title: 'Move Category Up' });
                            const categoryMoveDown = createElement('input', { type: 'button', className: 'major iconbutton move-down', title: 'Move Category Down' });
                            const categoryDelete = createElement('input', { type: 'button', className: 'major iconbutton remove', title: 'Delete Category' });
                            categoryMoveUp.addEventListener('click', () => {
                                // move category up
                                const index = Array.from(container.childNodes).indexOf(categoryContainer);
                                if (!index) return;
                                container.insertBefore(categoryContainer, categoryContainer.previousElementSibling);
                                tempColours.splice(index-1, 0, tempColours.splice(index, 1)[0]);
                            });
                            categoryMoveDown.addEventListener('click', () => {
                                // move catregory down
                                const index = Array.from(container.childNodes).indexOf(categoryContainer);
                                if (index === Array.from(container.childNodes).length - 2) return;
                                categoryContainer.nextElementSibling.insertAdjacentElement('afterend', categoryContainer);
                                tempColours.splice(index+1, 0, tempColours.splice(index, 1)[0]);
                            });
                            categoryDelete.addEventListener('click', () => {
                                // delete category
                                const index = Array.from(container.childNodes).indexOf(categoryContainer);
                                if (tempColours[index].name === undefined) return;
                                tempColours.splice(index, 1);
                                container.removeChild(categoryContainer);
                            });

                            addChildren(categorySpan, [
                                categoryMoveUp,
                                categoryMoveDown,
                                categoryName,
                                categoryDelete,
                                textNode(':')
                            ]);
                        } else {
                            addChildren(categorySpan, [
                                categoryName,
                                textNode(':')
                            ]);
                            categorySpan.id="nogroup";
                        }

                        categoryName.addEventListener('input', () => {
                            category.name = categoryName.value || 'New Category';
                        });

                        addChildren(categorySpan, [
                        ]);

                        addChildren(categoryContainer, [
                            categorySpan,
                            categoryColours
                        ]);

                        return { container: categoryContainer, colours: categoryColours, span: categorySpan };
                    }

                    const createColour = (colour) => {
                        const colourSpan = createElement('span', { className: 'editcolourcategory' });

                        const colourMoveUp = createElement('input', { type: 'button', className: 'major iconbutton move-up', title: 'Move Color Up' });
                        const colourMoveDown = createElement('input', { type: 'button', className: 'major iconbutton move-down', title: 'Move Color Down' });
                        const colourDelete = createElement('input', { type: 'button', className: 'major iconbutton remove', title: 'Delete Color' });
                        const colourInput = createColourButton(colour, true);
                        const colourName = createElement('input', { type: 'text', value: colour.name });

                        colourMoveUp.addEventListener('click', (evt) => {
                            // move colour up
                            const parentindex = Array.from(container.childNodes).indexOf(colourSpan.parentNode.parentNode);
                            const index = Array.from(colourSpan.parentNode.childNodes).indexOf(colourSpan);
                            if ((index === 0 || evt.ctrlKey) && parentindex === 0) return;

                            if (index === 0 || evt.ctrlKey) {
                                tempColours[parentindex-1].list.push(colour);
                                tempColours[parentindex].list.splice(index, 1);

                                // move the colourSpan element into the new category
                                Array.from(container.childNodes)[parentindex-1].getElementsByClassName('editcolourscontainer')[0].appendChild(colourSpan);
                                return;
                            }

                            // move the colourSpan up, and swap places
                            colourSpan.parentNode.insertBefore(colourSpan, colourSpan.previousElementSibling);
                            //tempColours.splice(index-1, 0, tempColours.splice(index, 1)[0]);
                            tempColours[parentindex].list.splice(index-1, 0, tempColours[parentindex].list.splice(index, 1)[0]);
                        });
                        colourMoveDown.addEventListener('click', (evt) => {
                            // move colour down
                            const parentindex = Array.from(container.childNodes).indexOf(colourSpan.parentNode.parentNode);
                            const index = Array.from(colourSpan.parentNode.childNodes).indexOf(colourSpan);
                            const colourMax = Array.from(colourSpan.parentNode.childNodes).length;
                            const parentMax = Array.from(container.childNodes).length;

                            console.log(index, colourMax, parentindex, parentMax);

                            if ((index === colourMax - 1 || evt.ctrlKey) && parentindex === parentMax - 1) return;

                            if (index === colourMax - 1 || evt.ctrlKey) {
                                tempColours[parentindex+1].list.unshift(colour);
                                tempColours[parentindex].list.splice(index, 1);

                                const parent = Array.from(container.childNodes)[parentindex+1].getElementsByClassName('editcolourscontainer')[0];

                                // move the colourSpan element into the new category
                                parent.insertBefore(colourSpan, parent.firstElementChild);
                                return;
                            }

                            // move the colourSpan down, and swap places
                            colourSpan.nextElementSibling.insertAdjacentElement('afterend', colourSpan);
                            tempColours[parentindex].list.splice(index+1, 0, tempColours[parentindex].list.splice(index, 1)[0]);
                        });
                        colourDelete.addEventListener('click', () => {
                            // delete colour
                            const parentindex = Array.from(container.childNodes).indexOf(colourSpan.parentNode.parentNode);
                            const index = Array.from(colourSpan.parentNode.childNodes).indexOf(colourSpan);
                            tempColours[parentindex].list.splice(index, 1);
                            colourSpan.parentNode.removeChild(colourSpan);
                        });
                        colourInput.addEventListener('change', () => {
                            colour.hex = colourInput.value.replace('#', '');
                        });
                        colourName.addEventListener('change', () => {
                            colour.name = colourName.value || 'Untitled';
                        });
                        addChildren(colourSpan, [
                            colourMoveUp,
                            colourMoveDown,
                            colourInput,
                            colourName,
                            colourDelete,
                        ]);

                        return colourSpan;
                    }

                    newCategoryButton.addEventListener('click', () => {
                        tempColours.unshift({ name: 'New Category', list: [] });

                        container.insertBefore(createCategory(tempColours[0]).container, container.firstChild);
                    });

                    newColourButton.addEventListener('click', () => {
                        tempColours[tempColours.length-1].list.push({ hex: '000000', name: 'New Color' });

                        const span = createColour(tempColours[tempColours.length-1].list[tempColours[tempColours.length-1].list.length - 1], true);
                        container.querySelector('#nogroup + .editcolourscontainer').appendChild(span);
                    });

                    tempColours.forEach(category => {
                        const categorycontainer = createCategory(category);

                        container.appendChild(categorycontainer.container);

                        category.list.forEach(colour => {
                            const colourSpan = createColour(colour);

                            categorycontainer.colours.appendChild(colourSpan);
                        });
                    });

                    window.MSPFA.dialog('Edit Colors', parent, ["Save", "Cancel"], (output, form) => {
                        if (output === "Save") {
                            loadSettings();
                            settings.colours[params.s] = tempColours;
                            saveSettings();
                        }

                        setTimeout(() => { colourButtons[lastIndex].click(); }, 1);
                    });
                });
            });

            const fillColourList = () => {
                loadSettings();

                colourList.innerHTML = '';
                settings.colours[params.s].forEach(category => {
                    if (!category.list.length) return;

                    const categorySpan = createElement('span', { textContent: (category.name || "(No Group)") + ': ', className: 'colourcategory'});
                    colourList.appendChild(categorySpan);

                    const coloursSpan = createElement('span', { className: 'colourSpan' });
                    category.list.forEach(colour => {
                        const button = createColourButton(colour);
                        button.title = `${colour.name} (#${colour.hex})`;

                        button.addEventListener('click', () => {
                            dialog.querySelector('input[type="text"]').value = '#' + colour.hex;
                            dialog.querySelector('button.major[data-value="Okay"]').click();
                        });

                        coloursSpan.appendChild(button);
                    });
                    colourList.appendChild(coloursSpan);

                    colourList.appendChild(newBr());
                });
            }

            colourButtons.forEach((button, i) => {
                let prevColour;
                button.addEventListener('click', () => {
                    const bbe = document.querySelector('#bbtoolbar').parentNode.querySelector('textarea');

                    // Create fake duplicate of original colour dialog
                    const fakeBody = createElement("span");
                    const colourInput = createElement("input", { name: "color", type: "color" });
                    const colourCodeInput = createElement("input", { name: "code", type: "text", size: "8" });
                    addChildren(fakeBody, [ colourInput, textNode(" "), colourCodeInput ]);

                    colourInput.addEventListener("input", () => {
                        colourCodeInput.value = colourInput.value;
                    });
                    colourCodeInput.addEventListener("input", () => {
                        colourInput.value = colourCodeInput.value;
                    });

                    console.log(prevColour);

                    window.MSPFA.dialog(`BBCode: ${button.title}`, fakeBody, ["Okay", "Cancel"], (output, form) => {
                        if (output === "Okay") {

                            bbe.focus();
                            var start = bbe.selectionStart;
                            var end = bbe.selectionEnd;
                            var pre = `[${button.dataset.tag}=` + colourCodeInput.value.toLowerCase() + "]";
                            bbe.value =
                                bbe.value.slice(0, start) +
                                pre +
                                bbe.value.slice(start, end) +
                                `[/${button.dataset.tag}]` +
                                bbe.value.slice(end);
                            bbe.selectionStart = start + pre.length;
                            bbe.selectionEnd = end + pre.length;

                            prevColour = inputs[1].value;
                        }
                    });


                    // other colour code (shouldn't need to be touched)
                    lastIndex = +(button.dataset.tag === "background");

                    const inputs = document.querySelectorAll('#dialog input');
                    setTimeout(() => { inputs[1].select(); }, 1);

                    if (prevColour) {
                        inputs[0].value = prevColour;
                        inputs[1].value = prevColour;
                    }
                    else {
                        setTimeout(() => {
                            const cButtons = [...document.querySelectorAll('#dialog .colourbutton')];
                            if (!cButtons.length) return;
                            let c = '#' + cButtons[Math.floor(Math.random() * cButtons.length)].dataset.colour;
                            inputs[0].value = c;
                            inputs[1].value = c;
                        }, 1);
                    }

                    const saveButton = createElement('input', { type: 'button', value: 'Save Color' });

                    saveButton.addEventListener('click', () => {
                        const container = createElement('span');
                        const nameInput = createElement('input', { type: 'text' });
                        const categoryDropdown = createElement('select');

                        settings.colours[params.s].forEach(category => {
                            const option = createElement('option', { textContent: category.name || '(No Group)' });
                            if (lastcategoryindex !== -1) {
                                if (category === settings.colours[params.s][lastcategoryindex]) {
                                     option.selected = 'selected';
                                }
                            }
                            else if (!category.name) option.selected = 'selected';
                            categoryDropdown.appendChild(option);
                        });

                        addChildren(container, [
                            textNode('Color: '),
                            inputs[0],
                            textNode(' '),
                            inputs[1],
                            newBr(),
                            newBr(),
                            textNode('Name: '),
                            nameInput,
                            newBr(),
                            newBr(),
                            textNode('Category: '),
                            categoryDropdown
                        ]);

                        setTimeout(() => {
                            window.MSPFA.dialog('Add New Color', container, ["Save", "Back"], (output, form) => {
                                if (output === "Save") {
                                    loadSettings();

                                    lastcategoryindex = categoryDropdown.selectedIndex;
                                    settings.colours[params.s][categoryDropdown.selectedIndex].list.push({ hex: inputs[0].value.replace('#', ''), name: nameInput.value });

                                    saveSettings();
                                }
                                prevColour = inputs[0].value;
                                setTimeout(() => { button.click(); }, 1);
                            });
                        }, 1);
                    });

                    const parent = inputs[0].parentNode
                    parent.innerHTML = '';
                    addChildren(parent, [
                        textNode('Color: '),
                        inputs[0],
                        textNode(' '),
                        inputs[1],
                        textNode(' '),
                        saveButton,
                        newBr(),
                        newBr(),
                        colourMenu
                    ]);

                    fillColourList();
                });
            });
        }
        else if (location.pathname === "/my/profile/") {
            // Nothing yet
        }
        else if (location.pathname === "/user/" && params.u) {
            // Button links
            pageLoad(() => {
                const msgButton = document.querySelector('#sendmsg');
                if (msgButton) {
                    addLink(msgButton, `/my/messages/new/?u=${params.u}`);
                    addLink(document.querySelector('#favstories'), `/favs/?u=${params.u}`);
                    clearListeners(msgButton);
                    return true;
                }
            });

            // Add extra user stats
            pageLoad(() => {
                if (window.MSPFA) {
                    const activityHeart = document.querySelector('#userstatus > img');
                    activityHeart.src = `https://raw.githubusercontent.com/SeymourSchlong/mspfaextras/main/assets/${activityHeart.src.includes('gray') ? 'grayheart' : 'heartbeat'}.png`;

                    const stats = document.querySelector('#userinfo table');

                    const joinTr = stats.insertRow(1);
                    joinTr.insertCell(0).appendChild(textNode("Account created:"));
                    const joinTime = joinTr.insertCell(1).appendChild(createElement('b', { textContent: 'Loading...' }));

                    const advCountTr = stats.insertRow(2);
                    advCountTr.insertCell(0).appendChild(textNode("Adventures created:"));
                    const advCountText = advCountTr.insertCell(1).appendChild(createElement('b', { textContent: 'Loading...' }));

                    const lastOnline = document.querySelector('#userlast');

                    // Show user creation date
                    window.MSPFA.request(0, {
                        do: "user",
                        u: params.u
                    }, user => {
                        if (typeof user !== "undefined") {
                            joinTime.textContent = getDateString(user.d, 4);
                            joinTime.title = getRelativeTime(user.d);
                            lastOnline.title = getRelativeTime(user.u);
                        }

                        // Show created adventures
                        window.MSPFA.request(0, {
                            do: "editor",
                            u: params.u
                        }, s => {
                            if (typeof s !== "undefined") {
                                advCountText.textContent = s.length;
                            }

                            // Show favourites
                            if (document.querySelector('#favstories').style.display !== 'none') {
                                const favCountTr = stats.insertRow(3);
                                favCountTr.insertCell(0).appendChild(textNode("Adventures favorited:"));
                                const favCountText = favCountTr.insertCell(1).appendChild(createElement('b', { textContent: 'Loading...' }));
                                window.MSPFA.request(0, {
                                    do: "favs",
                                    u: params.u
                                }, s => {
                                    if (typeof s !== "undefined") {
                                        favCountText.textContent = s.length;
                                    }
                                });
                            }
                        });
                    });

                    if (window.MSPFA.me.n) {
                        if (params.u !== window.MSPFA.me.i) {
                            const userBlocked = settings.blocklist.indexOf(params.u) !== -1;
                            const blockButton = createElement('input', { className: 'major', type: 'button', value: (userBlocked ? 'Unblock' : 'Block') });

                            const parentContainer = document.querySelector('#favstories').parentNode.parentNode;
                            addChildren(parentContainer, [textNode(' '), blockButton]);

                            blockButton.addEventListener('click', () => {
                                if (userBlocked) {
                                    window.MSPFA.dialog('Unblock?', textNode('Are you sure you want to unblock this user?'), ["Unblock", "Cancel"], (output, form) => {
                                        if (output === "Unblock") {
                                            settings.blocklist.splice(settings.blocklist.indexOf(params.u), 1);
                                            saveSettings();
                                            blockButton.value = 'Block';
                                        }
                                    });
                                } else {
                                    window.MSPFA.dialog('Block?', textNode('Are you sure you want to block this user? All messages received from this user will be automatically deleted.'), ["Block", "Cancel"], (output, form) => {
                                        if (output === "Block") {
                                            settings.blocklist.push(params.u);
                                            saveSettings();
                                            blockButton.value = 'Unblock';
                                        }
                                    });
                                }
                            });
                        }
                    }

                    return true;
                }
            });
        }
        else if (location.pathname === "/favs/" && location.search) {
            setTitle(`Favs - ${document.title}`);
            const toggleButton = createElement('input', { className: "major", type: "button", value: "Hide Muted Adventures", title: 'Cycle through muted/unmuted adventures' });
            const buttonRow = document.querySelector('table.container.alt').insertRow(2);

            let stories = [];
            // Button links
            pageLoad(() => {
                stories = document.querySelectorAll('#stories tr');
                let favCount = 0;

                if (stories.length > 0) {
                    if (stories[0].textContent === 'This user has no favorite adventures.') {
                        const storiesTable = document.querySelector('#stories');
                        storiesTable.parentNode.width = "100%";
                        const noFavImg = createElement('img', {src: "https://mspfae.linkh.at/no-favs"});
                        const msgTd = storiesTable.querySelector('td');
                        msgTd.textContent = '';
                        msgTd.style = 'text-align: center; font-weight: bold;';
                        addChildren(msgTd, [
                            newBr(),
                            noFavImg,
                            newBr(), newBr(),
                            textNode('This user has no favorite adventures.'),
                            newBr(), newBr()
                        ]);
                        return true;
                    } else {
                        if (window.MSPFA && window.MSPFA.me) {
                            if (window.MSPFA.me.i === params.u) {
                                buttonRow.insertCell(0).appendChild(toggleButton);
                            }
                        }

                        stories.forEach(story => {
                            favCount++;
                            const id = story.querySelector('a').href.replace('https://mspfa.com/', '');
                            if (window.MSPFA.me.i) {
                                addLink(story.querySelector('.edit.major'), `/my/stories/info/${id}`);
                            }
                            addLink(story.querySelector('.rss.major'), `/rss/${id}`);
                        });

                        // Fav count
                        const username = document.querySelector('#username');
                        addChildren(username.parentNode, [newBr(), newBr(), textNode(`Favourited adventures: ${favCount}`)]);

                        return true;
                    }
                }
                if (pageLoaded) return true;
            });

            let type = 0;

            toggleButton.addEventListener('click', () => {
                type++;
                type %= 3;

                stories.forEach(story => {
                    const unmuted = story.querySelector('.notify').className.includes(' lit');
                    story.style.display = '';
                    if (type === 2 && unmuted || type === 1 && !unmuted) {
                        story.style.display = 'none';
                    }
                });

                if (type === 0) {
                    // show all
                    toggleButton.value = 'Hide Muted Adventures';
                }
                else if (type === 1) {
                    // hide muted
                    toggleButton.value = 'Hide Unmuted Adventures';
                }
                else {
                    // only muted
                    toggleButton.value = 'Show All Adventures';
                }
            });
        }
        else if (location.pathname === "/search/" && location.search) {
            // Character and word statistics
            const statParentTr = document.querySelector('#pages').parentNode.parentNode.insertRow(2);
            const statTable = statParentTr.insertCell().appendChild(document.createElement('table'));
            const statTbody = statTable.createTBody();
            const statTr = statTbody.insertRow();
            const charCount = statTr.insertCell();
            const wordCount = statTr.insertCell();
            const pageTr = statTbody.insertRow();
            const charCount2 = pageTr.insertCell();
            const wordCount2 = pageTr.insertCell();

            const statHeaderTr = statTbody.insertRow(0);
            const statHeader = createElement('th', { textContent: 'Statistics may not be entirely accurate.' });
            statHeader.colSpan = '2';

            statHeaderTr.appendChild(statHeader);

            statTable.style.width = "100%";

            charCount.textContent = "Character count: loading...";
            wordCount.textContent = "Word count: loading...";
            charCount2.textContent = "Characters/page: loading...";
            wordCount2.textContent = "Words/page: loading...";

            pageLoad(() => {
                if (document.querySelector('#pages br')) {
                    const bbc = window.MSPFA.BBC.slice();
                    bbc.splice(0, 3);

                    window.MSPFA.request(0, {
                        do: "story",
                        s: params.s
                    }, story => {
                        if (typeof story !== "undefined") {
                            const cleanse = (text) => {
                                return text
                                    .replace(/\n/g, ' ')
                                    .replace(/&nbsp;/g, ' ')
                                    .replace(/<\/?.+?>/g, '')
                                    .replace(bbc[0][0], '$1')
                                    .replace(bbc[1][0], '$1')
                                    .replace(bbc[2][0], '$1')
                                    .replace(bbc[3][0], '$1')
                                    .replace(bbc[4][0], '$2')
                                    .replace(bbc[5][0], '$3')
                                    .replace(bbc[6][0], '$3')
                                    .replace(bbc[7][0], '$3')
                                    .replace(bbc[8][0], '$3')
                                    .replace(bbc[9][0], '$3')
                                    .replace(bbc[10][0], '$2')
                                    .replace(bbc[11][0], '$1')
                                    .replace(bbc[12][0], '$3')
                                    .replace(bbc[13][0], '$3')
                                    .replace(bbc[14][0], '')
                                    .replace(bbc[15][0], '')
                                    .replace(bbc[16][0], '$1')
                                    .replace(bbc[17][0], '$5')
                                    .replace(bbc[18][0], '$5')
                                    .replace(bbc[19][0], '')
                                    .replace(bbc[20][0], '')
                                    .trim();
                            }

                            const pageContent = [];
                            let storyText = '';
                            story.p.forEach(p => {
                                storyText += cleanse(p.c)
                                storyText += ' '
                                storyText += cleanse(p.b)
                                storyText += ' '
                            });
                            storyText.trim();

                            const splitText = storyText.split(/\s+/g);
                            while (splitText[0] == '𝅳𝅳𝅳𝅳𝅳𝅳𝅳𝅳𝅳𝅳') splitText.shift();
                            while (splitText[splitText.length - 1] == '𝅳𝅳𝅳𝅳𝅳𝅳𝅳𝅳𝅳𝅳') splitText.pop();
                            wordCount.textContent = `Word count: ${splitText.length}`;
                            charCount.textContent = `Character count: ${storyText.replace(/\s+/g, '').length}`;
                            wordCount2.textContent = `Words/page: ${Math.round((splitText.length / story.p.length) * 100) / 100}`;
                            charCount2.textContent = `Characters/page: ${Math.round((storyText.replace(/\s+/g, '').length / story.p.length) * 100) / 100}`;
                        }
                    });
                    return true;
                }
            });
        }
        else if (location.pathname === "/stories/" && location.search) {

            const searchButton = document.querySelector('#doit');

            // Let you press "Enter" to search while the tags textarea is selected
            document.querySelector('textarea[name=tags]').addEventListener('keydown', evt => {
                if (evt.key === "Enter") {
                    evt.preventDefault();
                    searchButton.click();
                }
            });

            // Add a button to hide adventures with a tag
            const tagHide = createElement('input', { id: 'taghide', value: '-', className: 'major', type: 'button', style: 'padding: 0;', title: 'Hide Tag' });

            const tagAdd = document.querySelector('#tagadd');
            tagAdd.parentNode.insertBefore(tagHide, tagAdd.nextSibling);
            tagAdd.parentNode.insertBefore(textNode(' '), tagAdd.nextSibling);

            const tagselect = document.querySelector('#tagselect');
            const taglist = document.querySelector('textarea[name=tags]');
            tagHide.addEventListener('click', () => {
                let tags = [];
                if(taglist.value) {
                    tags = taglist.value.split(",");
                }
                if(tagselect.value && tags.indexOf('-'+tagselect.value) == -1) {
                    tags.push('-'+tagselect.value);
                }
                taglist.value = tags.join(",");
                tagselect.options[0].selected = true;
            });

            // Add titles on hover to the [?] and [+] buttons
            document.querySelector('#taghelp').title = 'Tip';
            tagAdd.title = 'Add Tag';

            // Click text to check/uncheck boxes
            ['Ongoing', 'Complete', 'Inactive'].forEach(t => {
                const check = document.querySelector(`input[name="${t.toLowerCase()}"]`);
                check.nextSibling.textContent = '';
                const label = createElement('label', { textContent: ` ${t} ` });
                check.parentNode.insertBefore(label, check.nextSibling);
                label.insertBefore(check, label.firstChild);
            });
            const resultAmount = document.createElement('span');
            searchButton.parentNode.appendChild(resultAmount);

            pageLoad(() => {
                if (window.MSPFA) {
                    window.MSPFA.request(0, {
                        do: "stories",
                        n: params.n,
                        t: params.t,
                        h: params.h,
                        o: params.o,
                        p: params.p,
                        m: 50000
                    }, (s) => {
                        resultAmount.textContent = `Number of results: ${s.length}`;
                        return true;
                    });
                    return true;
                }
            },1);

            pageLoad(() => {
                const stories = document.querySelector('#stories');
                if (stories.childNodes.length > 0) {
                    if (params.load && stories.childNodes.length === 1) {
                        stories.querySelector('a').click();
                    }

                    stories.querySelectorAll('tr').forEach(story => {
                        const storyID = story.querySelector('a.major').href.split('&')[0].replace(/\D/g, '');
                        addLink(story.querySelector('.rss'), `/rss/?s=${storyID}`);

                        if (window.MSPFA.me.i) {
                            addLink(story.querySelector('.edit.major'), `/my/stories/info/?s=${storyID}`);
                        }
                    });
                    return true;
                }
                if (pageLoaded) return true;
            });
        }
        else if (location.pathname === "/terms/") {
            const termsImg = createElement('img', { src: 'https://mspfae.linkh.at/terms', style: 'margin: auto;display: block;' });
            const td = document.querySelector('td[style="padding: 16px; text-align: left; font-size: 18px;"]');
            td.insertBefore(newBr(), td.firstChild);
            td.insertBefore(termsImg, td.firstChild);
        }
        else if (location.pathname === "/readers/" && params.s) {
            pageLoad(() => {
                const userlist = document.querySelector('#users');
                if (userlist.childNodes.length > 0) {
                    window.MSPFA.request(0, {
                        do: 'story',
                        s: params.s,
                        noPages: true
                    }, (s) => {
                        const hidden = (s.f.length + s.g.length) - userlist.childNodes.length;
                        if (hidden) {
                            const randomText = [
                                'prefer to keep their favourites private!',
                                'shall not be named.',
                                'like to keep secrets.',
                                'have not been named yet!',
                                'are undercover.'
                            ];

                            const newRow = userlist.insertRow();
                            newRow.insertCell();
                            newRow.insertCell().textContent = `...and ${hidden} user${hidden === 1 ? '' : 's'} who ` + randomText[Math.floor(Math.random() * randomText.length)];
                        }
                    });
                    return true;
                }
            });
        }
        else if (location.pathname === "/achievements/" && params.u) {
            const achievementTable = document.querySelector('#alist').parentNode;
            const globalLink = createElement('a', { href: '/?s=41081&p=15', textContent: 'View Global Achievement Statistics' });
            globalLink.style = '';
            achievementTable.parentNode.insertBefore(globalLink, achievementTable);
        }
    }
})();