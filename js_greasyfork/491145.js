// ==UserScript==
// @name         Twitter Alternative Share URL
// @namespace    https://github.com/btcode23
// @version      0.5.2
// @description  Adds a button to share a tweet with an alternative URL to the "X" link
// @author       btcode23
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png

// @downloadURL https://update.greasyfork.org/scripts/491145/Twitter%20Alternative%20Share%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/491145/Twitter%20Alternative%20Share%20URL.meta.js
// ==/UserScript==

const baseXUrl = 'https://fixvx.com';

if (GM_getValue('ALT_X_URL') == undefined) {
    GM_setValue('ALT_X_URL', baseXUrl);
}

const svg = '<path d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005M8 5.00005V7H16V5.00005M8 5.00005V4.70711C8 4.25435 8.17986 3.82014 8.5 3.5C8.82014 3.17986 9.25435 3 9.70711 3H14.2929C14.7456 3 15.1799 3.17986 15.5 3.5C15.8201 3.82014 16 4.25435 16 4.70711V5.00005M12 11V17M12 17L10 15M12 17L14 15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>';

function displayConfirmation() {
    const layers = document.getElementById('layers');

    let confirmation = document.getElementById('confirmCopyAltLink');
    if (!confirmation) {
        confirmation = document.createElement('div');
        confirmation.id = 'confirmCopyAltLink';
        confirmation.style.cssText = 'position: fixed; bottom: 10px; left: 0; right: 0; margin-left: auto; margin-right: auto; width: 100px; height: 40px;' +
            'background-color: rgba(29, 161, 242, 0.9); border-radius: 5px;'
        confirmation.innerHTML = '<p style="line-height: 40px; margin: 0; padding: auto; vertical-align: middle; text-align: center; font-weight: bold;">Copied</p>';
        layers.append(confirmation);
    }

    // show confirmation and then fade out
    confirmation.style.opacity = '1';
    confirmation.style.visibility = 'visible';
    confirmation.style.transition = '';
    setTimeout(function() {
        confirmation.style.opacity = '0';
        confirmation.style.visibility = 'hidden';
        confirmation.style.transition = '1s';
    }, 1000);
}

function copyAlternativeTwitterUrl(tweet) {
    // the part of the tweet with time seems to give the path to the tweet
    let tweetPath = tweet.querySelector('a:has(time)').getAttribute('href');

    // new share URL
    let newUrl = GM_getValue('ALT_X_URL') + tweetPath;

    navigator.clipboard.writeText(newUrl);
    displayConfirmation();
}

function designButton(tweet) {
    let otherIcon = tweet.querySelector('button[aria-label="Share post"]').parentElement.parentElement;

    const newIcon = otherIcon.cloneNode(true);
    newIcon.classList.add('custom-copy-icon');
    otherIcon.parentElement.insertBefore(newIcon, otherIcon.sibling);

    newIcon.querySelector('svg').innerHTML = svg; // add clipboard svg
    const icon = newIcon.querySelector('svg');
    icon.querySelector('path').style.fill = 'none';
    const computedStyleIcon = getComputedStyle(otherIcon.querySelector('svg'));
    const iconOriginalColor = computedStyleIcon.color;
    icon.querySelector('path').style.stroke = iconOriginalColor; // set color to same as other icon

    const computedContainerStyle = getComputedStyle(otherIcon);
    newIcon.style.display = computedContainerStyle.display;
    newIcon.style.width = computedContainerStyle.width;
    newIcon.style.height = computedContainerStyle.height;
    newIcon.style.marginLeft = (parseFloat(computedContainerStyle.width) * 0.3) + "px";

    const backgroundElement = icon.previousElementSibling;

    // highlight icon when mouseover event using twitter blue color
    // should look the same as the other icons
    newIcon.addEventListener('mouseover', function() {
        backgroundElement.style.backgroundColor = 'rgba(29, 161, 242, 0.1)';
        newIcon.querySelector('path').style.stroke = 'rgba(29, 161, 242, 1)';
    });

    // return to original style when mouseleave event
    newIcon.addEventListener('mouseleave', function() {
        backgroundElement.style.backgroundColor = '';
        newIcon.querySelector('path').style.stroke = iconOriginalColor;
    });

    // copy link using alternative domain
    newIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        copyAlternativeTwitterUrl(tweet);
    });
}

function addNewShareButtons() {
    let tweets = document.querySelectorAll('article[data-testid="tweet"]');

    tweets.forEach(tweet => {
        if (!tweet.querySelector('.custom-copy-icon')) {
            designButton(tweet);
        }
    });
}

(function() {
    'use strict';

    // add new share button to each loaded tweet
    const observer = new MutationObserver(addNewShareButtons);
    observer.observe(
        document.body, {
            childList: true,
            subtree: true
        });
})();

// change the alternative URL for twitter
GM_registerMenuCommand('Setting', () => config());

function config() {
    let configPopupContainer = document.getElementById('ConfigTwitterFixUrlContainer')
    if (!configPopupContainer) {
        configPopupContainer = document.createElement('div');
    }
    configPopupContainer.id = 'ConfigTwitterFixUrlContainer';
    configPopupContainer.style.cssText = 'position: fixed; width: 100%; height: 100%; left: 0; top: 0; background: rgba(51,51,51,0.7);';
    document.body.appendChild(configPopupContainer);

    const configPopup = document.createElement('form');
    configPopup.innerHTML = '<p style="text-align: center;">Twitter Fix URL Config</p>';
    configPopup.style.cssText = 'position: fixed; top: 50%; left: 50%; padding: 10px; margin-top: -150px; margin-left: -150px; width: 325px; height: 200px; background-color: black; border: 2px solid white; border-radius: 25px; color: white; font-size: 24px;  fontFamily: "Arial, sans-serif"';

    const formFontSize = 'font-size: 18px;';
    const altXUrlLabel = document.createElement('label');
    altXUrlLabel.style.cssText = formFontSize;
    altXUrlLabel.setAttribute('for', 'AltUrlTwttierFixUrl');
    altXUrlLabel.innerHTML = 'Alternative URL X :';

    const altXUrlInput = document.createElement('input');
    altXUrlInput.style.cssText = formFontSize + ' width: calc(100% - 12px); padding: 5px'
    altXUrlInput.setAttribute('type', 'text');
    altXUrlInput.setAttribute('id', 'AltUrlTwttierFixUrl');
    altXUrlInput.setAttribute('name', 'AltUrlTwttierFixUrl');
    altXUrlInput.setAttribute('value', GM_getValue('ALT_X_URL'));

    configPopup.append(altXUrlLabel);
    configPopup.append(document.createElement('br'));
    configPopup.append(altXUrlInput);

    const buttonCSS = formFontSize + ' width: 75px; height: 30px; border: 2px solid white; text-align: center; padding: 0px; border-radius: 10px; margin-left: 19px;';

    const altUrlResetButton = document.createElement('button');
    altUrlResetButton.setAttribute('type', 'button');
    altUrlResetButton.setAttribute('value', 'reset');
    altUrlResetButton.style.cssText = buttonCSS;
    altUrlResetButton.innerHTML = 'Reset';
    altUrlResetButton.addEventListener('click', function(e) {
        altXUrlInput.value = baseXUrl;
    });

    const altUrlCancelButton = document.createElement('button');
    altUrlCancelButton.setAttribute('type', 'button');
    altUrlCancelButton.setAttribute('value', 'cancel');
    altUrlCancelButton.style.cssText = buttonCSS;
    altUrlCancelButton.innerHTML = 'Cancel';
    altUrlCancelButton.addEventListener('click', function(e) {
        configPopupContainer.style.display = 'none';
    });

    const altUrlSubmitButton = document.createElement('button');
    altUrlSubmitButton.setAttribute('type', 'button');
    altUrlSubmitButton.setAttribute('value', 'submit');
    altUrlSubmitButton.style.cssText = buttonCSS;
    altUrlSubmitButton.innerHTML = 'Submit';
    altUrlSubmitButton.addEventListener('click', function(e) {
        GM_setValue('ALT_X_URL', altXUrlInput.value);
        configPopupContainer.style.display = 'none';
    });

    configPopup.append(document.createElement('br'));
    configPopup.append(document.createElement('br'));
    configPopup.appendChild(altUrlResetButton);
    configPopup.appendChild(altUrlCancelButton);
    configPopup.appendChild(altUrlSubmitButton);
    configPopupContainer.appendChild(configPopup);

    document.addEventListener('mouseup', function(e) {
        if (e.target.id == 'ConfigTwitterFixUrlContainer') {
            configPopupContainer.style.display = 'none';
        }
    });
}
