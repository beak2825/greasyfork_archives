// ==UserScript==
// @name         Sky News AutoPlay Disabler
// @namespace    https://www.gideonpyzer.com/
// @version      0.1
// @description  This script prevents the Sky News website from auto-playing (often unrelated) videos after the current one has ended. BBC News provide a toggle, but Sky News doesn't. Until they introduce one, this workaround is for my own sanity.
// @author       Gideon Pyzer
// @match        https://news.sky.com/*
// @downloadURL https://update.greasyfork.org/scripts/37914/Sky%20News%20AutoPlay%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/37914/Sky%20News%20AutoPlay%20Disabler.meta.js
// ==/UserScript==

(() => {
    const playingScreenSelector = '.oo-playing-screen';
    const mediaContainer = document.querySelector('.sdc-article-video__media-container');

    const preventShowNext = () => {
        let controllerComponent;
        const playingScreen = document.querySelector(playingScreenSelector);
        if (playingScreen && playingScreen._reactInternalComponent) {
            const {children} = playingScreen._reactInternalComponent._currentElement.props;
            children.some(child => controllerComponent = child && child.props && child.props.controller || undefined);

            if (controllerComponent && controllerComponent.state && controllerComponent.state.config) {
                controllerComponent.state.config.upNext.showUpNext = false;
                controllerComponent.state.config.discoveryScreen.showCountDownTimerOnEndScreen = false;
            }
        }
    };

    const obs = new MutationObserver((mutations, observer) => {
        mutations.forEach(mutation => {
            const {addedNodes} = mutation;
            addedNodes.forEach(node => {
                if (node.classList && node.classList.contains(playingScreenSelector.substring(1))) {
                    setTimeout(preventShowNext, 500);
                }
            });
        });
    });

    if (mediaContainer) {
        obs.observe(mediaContainer, {
            childList: true,
            subtree: true
        });
    }
})();