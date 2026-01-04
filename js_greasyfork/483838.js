// ==UserScript==
// @name         Tuxun Background Image Changer with No Repeat Random
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Change the background image on each refresh to a new image from a saved gallery on Tuxun, ensuring no repeat of the last image when random function is on.
// @author       H_M
// @match        https://tuxun.fun/
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483838/Tuxun%20Background%20Image%20Changer%20with%20No%20Repeat%20Random.user.js
// @updateURL https://update.greasyfork.org/scripts/483838/Tuxun%20Background%20Image%20Changer%20with%20No%20Repeat%20Random.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const backgroundImageKey = 'customBackgroundImageUrls';
    const lastImageUrlKey = 'lastBackgroundImageUrl';
    const randomToggleKey = 'randomBackgroundToggle';
    const defaultImageUrlKey = 'defaultBackgroundImageUrl';
    var lastImageUrl = null;
    var isRandomEnabled = true;

    function createButton() {
        var changeImageButton = document.createElement('button');
        changeImageButton.textContent = 'Change Image';
        changeImageButton.style = buttonStyle();
        changeImageButton.onclick = showPopup;
        document.body.appendChild(changeImageButton);

        var toggleRandomButton = document.createElement('button');
        toggleRandomButton.textContent = `Toggle Random: ${isRandomEnabled ? 'ON' : 'OFF'}`;
        toggleRandomButton.style = buttonStyle();
        toggleRandomButton.style.right = '160px';
        toggleRandomButton.onclick = toggleRandom;
        document.body.appendChild(toggleRandomButton);
    }

    function buttonStyle() {
        return 'position: fixed; bottom: 10px; right: 35px; opacity: 0.5; z-index: 1000; border-radius: 10px;';
    }

    function toggleRandom() {
        isRandomEnabled = !isRandomEnabled;
        localStorage.setItem(randomToggleKey, isRandomEnabled);
        this.textContent = `Toggle Random: ${isRandomEnabled ? 'ON' : 'OFF'}`;
        updateGallery(document.getElementById('imageChangerPopup')); // Update gallery to show/hide default buttons
    }

    function showPopup() {
        var popup = document.getElementById('imageChangerPopup') || createPopup();
        if (popup.style.display === 'none') {
            popup.style.display = 'block';
        }
        updateGallery(popup);
    }

    function createPopup() {
        var popup = document.createElement('div');
        popup.id = 'imageChangerPopup';
        popup.style = popupStyle();
        document.body.appendChild(popup);

        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Paste URL here';
        input.style.marginRight = '10px';

        var saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = function() {
            saveUrl(input.value);
            input.value = '';
            updateGallery(popup);
        };

        var closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.style = closeButtonStyle();
        closeButton.onclick = function() {
            popup.style.display = 'none';
        };

        popup.appendChild(input);
        popup.appendChild(saveButton);
        popup.appendChild(closeButton);

        return popup;
    }

    function popupStyle() {
        return 'position: fixed; bottom: 35px; right: 35px; padding: 20px; background-color: white; border: 1px solid black; opacity: 0.9; z-index: 1000; border-radius: 10px;';
    }

    function closeButtonStyle() {
        return 'position: absolute; top: -15px; right: -15px; width: 15px; height: 15px; border-radius: 50%; opacity: 0.5; background-color: grey; color: white; border: none; cursor: pointer;';
    }

    function saveUrl(url) {
        var urls = getSavedUrls();
        if (urls.indexOf(url) === -1) {
            urls.push(url);
            localStorage.setItem(backgroundImageKey, JSON.stringify(urls));
        }
    }

    function getSavedUrls() {
        var savedUrls = localStorage.getItem(backgroundImageKey);
        return savedUrls ? JSON.parse(savedUrls) : [];
    }

    function updateGallery(popup) {
        var gallery = document.getElementById('imageGallery') || createGallery(popup);
        gallery.innerHTML = '';
        getSavedUrls().forEach(function(url) {
            var imageContainer = document.createElement('div');
            imageContainer.style = 'display: inline-block; position: relative; margin: 5px;';

            var img = document.createElement('img');
            img.src = url;
            img.style = 'height: 100px; object-fit: contain; border: 1px solid black;';
            img.onerror = function() {
                this.style.display = 'none'; // Hide image if it fails to load
            };
            img.onclick = function() {
                if (!isRandomEnabled) {
                    changeBackgroundImage(url);
                }
            };

            var setDefaultButton = document.createElement('button');
            setDefaultButton.textContent = 'Set as Default';
            setDefaultButton.style = 'margin-top: 5px; display: ' + (isRandomEnabled ? 'none' : 'inline-block') + ';';
            setDefaultButton.onclick = function() {
                setDefaultBackgroundImage(url);
            };

            var deleteButton = document.createElement('button');
            deleteButton.textContent = '✖';
            deleteButton.style = 'position: absolute; top: 0; right: 0;';
            deleteButton.onclick = function() {
                removeUrl(url);
                updateGallery(popup);
            };

            imageContainer.appendChild(img);
            if (!isRandomEnabled) {
                imageContainer.appendChild(setDefaultButton);
            }
            imageContainer.appendChild(deleteButton);
            gallery.appendChild(imageContainer);
        });
    }

    function createGallery(popup) {
        var gallery = document.createElement('div');
        gallery.id = 'imageGallery';
        popup.appendChild(gallery);
        return gallery;
    }

    function removeUrl(url) {
        var urls = getSavedUrls();
        var index = urls.indexOf(url);
        if (index !== -1) {
            urls.splice(index, 1);
            localStorage.setItem(backgroundImageKey, JSON.stringify(urls));
            updateGallery(document.getElementById('imageChangerPopup'));
        }
    }

    function changeBackgroundImage(url) {
        var container = document.querySelector('#tuxun > .container');
        if (container) {
            container.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url('${url}')`;
        }
    }

    function setDefaultBackgroundImage(url) {
        localStorage.setItem(defaultImageUrlKey, url);
        alert("Default background image set!");
    }

    function applySavedBackgroundImage() {
        if (!isRandomEnabled) {
            var defaultUrl = localStorage.getItem(defaultImageUrlKey);
            if (defaultUrl) {
                changeBackgroundImage(defaultUrl);
                return;
            }
        } else {
            var urls = getSavedUrls();
            if (urls.length > 0) {
                var urlToApply = urls.find(url => url !== lastImageUrl);
                if (urlToApply) {
                    changeBackgroundImage(urlToApply);
                    lastImageUrl = urlToApply;
                    localStorage.setItem(lastImageUrlKey, urlToApply);
                }
            }
        }
    }

    function loadToggleState() {
        const savedToggleState = localStorage.getItem(randomToggleKey);
        isRandomEnabled = savedToggleState === null ? true : savedToggleState === 'true';
    }

    function loadLastImageUrl() {
        const savedLastImageUrl = localStorage.getItem(lastImageUrlKey);
        lastImageUrl = savedLastImageUrl;
    }
    window.addEventListener('load', function() {
        loadToggleState();
        loadLastImageUrl();
        createButton();
        applySavedBackgroundImage();
    });
})();

