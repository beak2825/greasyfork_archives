// ==UserScript==
// @name        nt unofficial monitor toolbox
// @namespace   Violentmonkey Scripts
// @include      https://newtumbl.com/monitor
// @match        https://newtumbl.com/monitor
// @grant       none
// @version     0.4
// @author      openwater
// @description 14/02/2022, 14:58:55
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440025/nt%20unofficial%20monitor%20toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/440025/nt%20unofficial%20monitor%20toolbox.meta.js
// ==/UserScript==

// some functions inspired by https://github.com/EvHaus/youtube-hide-watched
(function(_undefined) {

    //strings contain the list of words we want to highlight
    //const strings = [ 'ass', 'boy', 'naked', 'sexy', 'cock', 'slut', 'ass up', 'bimbo', 'clit', 'cocks', 'cuck', 'cuckold', 'cuckquean', 'cum', 'dick', 'dick slip', 'dilf', 'ecchi', 'erotica', 'eroticfiction', 'fake tits', 'freeball', 'fuck', 'fuckable', 'fuckdoll', 'fuckmeat', 'fuck me daddy', 'fuck toy', 'group of sluts', 'heavy hangers', 'hentai', 'hucow', 'loli', 'menparts', 'milf', 'nipslip', 'nip slip', 'pussy', 'quean', 'race play', 'rape', 'reverse cuckold', 'sexual', 'shota', 'sissy', 'sket', 'slag', 'slapper', 'slut', 'wank', 'whore', 'wmbf'];
    // tags updated 14/02/2022
    const strings = ['ass up', 'bimbo', 'clit', 'cock', 'cuck', 'cum', 'dick', 'dilf', 'milf', 'tilf', 'gilf', 'ecchi', 'erotica', 'fake tits', 'freeball',

        'slut', 'himbo', 'heavy hangers', 'hucow', 'loli', 'menparts', 'nipslip', 'nip slip', 'men parts', 'pussy', 'quean', 'race play',

        'rape', 'shota', 'sissy', 'sket', 'slag', 'slapper', 'wank', 'whore', 'wmbf', 'bdsm', 'incest', 'sex', 'shit', 'fuck', 'fetish',

        'worship', 'pt', 'pedo', 'nude', 'nudity', 'nudism', 'cabron', 'puta', 'drugs', 'droga', 'jb', 'pjb', 'jailbait', 'horny', 'dom',

        'sub', 'politics', 'religion', 'bible', 'expose', 'butt', 'ass', 'crack', 'rape,', 'scat', 'perv', 'taboo', 'cp', 'furry',

        'anthro', 'micro', 'macro', 'hard on', 'boner', 'arousing', 'underage', 'bbc', 'snowbunny', 'facial', 'blow', 'nepi', '420', 'weed',

        'cocaine', 'bong', 'abdl', 'diaper', 'sims', 'degrade'
    ];

    // Enable for debugging
    const __DEV__ = false;

    const logDebug = (msg) => {
        // eslint-disable-next-line no-console
        if (__DEV__) console.log(msg);
    };

    const addStyle = function(aCss) {
        const head = document.getElementsByTagName('head')[0];
        if (head) {
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };

    //highlight style
    addStyle(`
    .NT-TAG-HIGHLIGHT{
	background-color: red;
    }
    `);

    // ===========================================================

    const findWatchedElements = function() {
        const watched = document.querySelectorAll('.post_tags ul li');

        logDebug(
            `Found ${watched.length} tags `
        );

        return watched;
    };

    const updateClassOnWatchedItems = function() {
        findWatchedElements().forEach((item, _i) => {
            var hashTag = item.textContent;
            var hashTagWithoutHash = hashTag.substring(hashTag.indexOf('#') + 1).toLowerCase();
            if (strings.indexOf(hashTagWithoutHash) !== -1) {
                logDebug('found ' + hashTagWithoutHash);
                item.classList.add('NT-TAG-HIGHLIGHT');
            };

        });
    };

    const findButtonTarget = function() {
        // Button will be injected into the main header menu
        //return document.querySelector('#container #end #buttons');
        return document.querySelector('.monitor_tools').lastChild;
    };

    // ===========================================================

    const isButtonAlreadyThere = function() {
        return document.querySelectorAll('.NT-TB-BUTTON').length > 0;
    };

    // ===========================================================

    const addButton = function() {
        logDebug('addbutton');
        if (isButtonAlreadyThere()) {
            logDebug('Button already added');
            return;
        }

        // Find button target
        const target = findButtonTarget();
        if (!target) return;

        // Generate button DOM
        const copyBlogNamebutton = document.createElement('button');
        copyBlogNamebutton.classList.add('NT-TB-BUTTON');
        copyBlogNamebutton.innerHTML = "Copy Blog Name";
        copyBlogNamebutton.title = "Copy Blog Name";

        // Attach events
        copyBlogNamebutton.addEventListener('click', () => {
            //const section = determineYoutubeSection();
            var a = document.getElementsByClassName("blog_name");
            var b = a[3].innerHTML;
            logDebug(b);
            navigator.clipboard.writeText(b);
        });

        // Insert button into DOM
        target.parentNode.insertBefore(copyBlogNamebutton, target.nextSibling);

        // Generate button DOM
        const copyPostUrlbutton = document.createElement('button');
        copyPostUrlbutton.classList.add('NT-TB-BUTTON');
        copyPostUrlbutton.innerHTML = "Copy Post URL";
        copyPostUrlbutton.title = "Copy Post URL";

        // Attach events
        copyPostUrlbutton.addEventListener('click', () => {
            var a = document.getElementsByClassName("count_holder click_select");
            var b = a[1].firstChild;
            var c = b.getAttribute('href');
            logDebug(c);
            navigator.clipboard.writeText(c);
        });

        target.parentNode.insertBefore(copyPostUrlbutton, target.nextSibling);

    };

    // ===========================================================

    const debounce = function(func, wait, immediate) {
        let timeout;
        return (...args) => {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    };

    const run = debounce((mutations) => {
        if (
            mutations && mutations.length === 1 &&
            mutations[0].target.classList.length === 1
        ) {
            // don't react if only our own button changed its state
            // to avoid running an endless loop:
            return;
        }
        logDebug('Running check for watched tags');
        updateClassOnWatchedItems();
        addButton();
    }, 250);

    // ===========================================================

    const observeDOM = (function() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        const eventListenerSupported = window.addEventListener;

        return function(obj, callback) {
            logDebug('Attaching DOM listener');

            // Invalid `obj` given
            if (!obj) return;

            if (MutationObserver) {
                const obs = new MutationObserver(((mutations, _observer) => {
                    if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
                        // eslint-disable-next-line callback-return
                        callback(mutations);
                    }
                }));

                obs.observe(obj, {
                    childList: true,
                    subtree: true
                });
            } else if (eventListenerSupported) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    }());

    // ===========================================================

    // Hijack all XHR calls
    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        this.addEventListener('readystatechange', function() {
            if (
                // Anytime more videos are fetched -- re-run script
                this.responseURL.indexOf('browse_ajax?action_continuation') > 0
            ) {
                setTimeout(() => {
                    logDebug('api call');
                    run();
                }, 0);
            }
        }, false);
        send.call(this, data);
    };


    // ===========================================================


    // ===========================================================

    logDebug('starting Newtumbl unofficial monitor toolbox');


    observeDOM(document.body, run);

    run();
}());