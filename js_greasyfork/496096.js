// ==UserScript==
// @name         Quora Blocker
// @namespace    https://kapifrost.github.io/
// @version      1.0
// @description  improvements to quora
// @author       kapifrost
// @match        https://www.quora.com/*
// @match        http://www.quora.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quora.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/496096/Quora%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/496096/Quora%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let css = `
		div.dom_annotate_multifeed_bundle_AdBundle,
		div.q-box.qu-cursor--pointer.qu-pb--small.dom_annotate_google_ad,
		div.q-box.dom_annotate_ad_promoted_answer,
		div.q-box.dom_annotate_ad_image_ad,
        div.q-box.spacing_log_question_page_ad,
        div.q-box.dom_annotate_related_questions,
        div.q-flex.qu-alignItems--center.qu-py--small.qu-justifyContent--space-between {
			display: none !important;
		}
    `;
    let style = document.createElement('style');
    style.innerHTML = css;

    const config = {
        lang: {
            qbTurnOff: 'Turn Off QB',
            qbTurnOn: 'Turn On QB',
        },
        displayNone: [],
        enabled: true,
        changeState(b) {
            console.log('changestate', b);
            config.enabled = b;
            if (b) { // turned on
                document.head.appendChild(style);
                config.displayNone.forEach(e => {
                    e.style.display = 'none';
                });
            } else { // turned off
                document.head.removeChild(style);
                config.displayNone.forEach(e => {
                    e.style.removeProperty('display');
                });
            }
        },
        selector: {
            relatedTag: 'div.q-inlineFlex.qu-px--tiny.qu-color--gray.qu-borderRadius--small.qu-whiteSpace--nowrap.qu-alignItems--center',
            relatedBox: 'div.q-text.qu-dynamicFontSize--regular.qu-medium.qu-color--gray_dark.qu-passColorToLinks',
        }
    };
    window.config = config;

    document.addEventListener("DOMContentLoaded", function() {
        setTimeout(function() {
            if (findMainInterval !== -1) {
                clearInterval(findMainInterval);
            };
        }, 1500);
        let findMainInterval = setInterval(function() {
            let main = document.querySelector('div.q-box.puppeteer_test_question_main')?.children[0]?.children[0]?.children[1];
            let adsSidebar = document.querySelector('div.q-box.puppeteer_test_question_main')?.children[0]?.children[1];
            if (adsSidebar) {
                main.parentElement.style.width = 'auto';
                config.displayNone.push(adsSidebar);
            }
            if (main) {
                /*[...main.children].forEach((f) => {
                    let related = f.querySelectorAll(config.selector.relatedTag);
                    if (related.length > 0) {
                        config.displayNone.push(f);
                        return;
                    };
                });*/
                const mainObserver = new MutationObserver((mutationsList, observer) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            Array.from(mutation.addedNodes).forEach((f) => {
                                let related = f.querySelectorAll(config.selector.relatedTag);
                                if (related.length > 0) {
                                    config.displayNone.push(f);
                                    config.changeState(config.enabled);
                                    return;
                                };
                            });
                        }
                    }
                });
                setInterval(function() {
                    [...main.children].forEach((f) => {
                        if (f.querySelector(config.selector.relatedBox)) {
                            config.displayNone.push(f);
                            config.changeState(config.enabled);
                            return;
                        };
                        let related = f.querySelectorAll(config.selector.relatedTag);
                        if (related.length > 0 && !config.displayNone.includes(f)) {
                            console.log(f);
                            config.displayNone.push(f);
                            config.changeState(config.enabled);
                            return;
                        };
                    });
                }, 500)
                mainObserver.observe(main, { childList: true, subtree: true });
                clearInterval(findMainInterval);
                findMainInterval = -1;
                config.changeState(config.enabled);
            } else {
                let homeMain = document.querySelector('div#mainContent')?.parentElement;
                console.log(homeMain);
                if (homeMain) {
                    homeMain.children[1].style.width = 'auto';
                    homeMain.children[1].style.removeProperty('flex-shrink');
                    config.displayNone.push(homeMain.children[2]);
                    config.changeState(config.enabled);
                }
            }
        })

        config.changeState(true);
    });

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                Array.from(mutation.addedNodes).forEach((e) => {
                    switch (e?.tagName?.toLowerCase()) {
                        case 'div':
                            {
                                switch(e.className) {
                                    case 'q-box':
                                        {
                                            if (e.style.boxSizing === 'border-box') {
                                                let qPlus = e.querySelector && e.querySelector('button.q-click-wrapper.qu-active--textDecoration--none.qu-focus--textDecoration--none.qu-mx--small.qu-borderRadius--pill.qu-alignItems--center.qu-justifyContent--center.qu-whiteSpace--nowrap.qu-userSelect--none.qu-display--inline-flex.qu-tapHighlight--white.qu-textAlign--center.qu-cursor--pointer.qu-hover--textDecoration--none.qu-hover--bg--darken');
                                                if (qPlus) {
                                                    //console.log(e);
                                                    let qPlusReact = Object.keys(qPlus).find(k => k.startsWith('__reactProps'));
                                                    document.addEventListener("DOMContentLoaded", function() {
                                                        qPlus[qPlusReact].onClick = function() {
                                                            console.log('click')
                                                            config.changeState(!config.enabled);
                                                            qPlus.innerText = config.enabled ? config.lang.qbTurnOff : config.lang.qbTurnOn;
                                                        };
                                                    });
                                                    qPlus[qPlusReact].onKeyDown = function() {
                                                        //console.log('onKeyDown')
                                                    };
                                                    qPlus.innerText = config.lang.qbTurnOff;
                                                }
                                            }
                                            break;
                                        }
                                };
                                break;
                            }
                    }
                });
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });
})();