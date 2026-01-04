// ==UserScript==
// @name         Tuxun 图寻 自定义背景
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  图寻背景更换
// @author       H_M
// @match        https://tuxun.fun/*
// @grant        none
// @license MIT
// @run-at       document-end
// @icon         https://s2.loli.net/2024/03/25/iVejH6XvB4MyfNd.png
// @exclude      https://tuxun.fun/replay-pano?*
// @downloadURL https://update.greasyfork.org/scripts/490798/Tuxun%20%E5%9B%BE%E5%AF%BB%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/490798/Tuxun%20%E5%9B%BE%E5%AF%BB%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const backgroundImageKey = 'customBackgroundImageUrls';
    var interval;

function createButton() {

    var button = document.createElement('div');
    button.style = buttonStyle();

    var buttonImageContainer = document.createElement('div');
    buttonImageContainer.style = 'width: 60px; height: 60px; border-radius: 50%; overflow: hidden; transition: transform 0.3s, filter 0.3s;';

    var buttonImage = document.createElement('img');
    buttonImage.src = 'https://s2.loli.net/2024/03/25/iVejH6XvB4MyfNd.png';
    buttonImage.style = 'width: 100%; height: 100%; border-radius: 50%;';

    buttonImageContainer.appendChild(buttonImage);
    button.appendChild(buttonImageContainer);

    button.onmouseover = function() {
        buttonImageContainer.style.transform = 'scale(1.25)';
        buttonImageContainer.style.filter = 'blur(3px)';
    };

    button.onmouseout = function() {
        buttonImageContainer.style.transform = 'scale(1)';
        buttonImageContainer.style.filter = 'none';
    };

    button.onclick = showPopup;

    document.body.appendChild(button);
}

    function buttonStyle() {
        return 'position: fixed; bottom: 20px; right: 35px; opacity: 0.5; z-index: 1000;';
    }
function createDeveloperPopup() {
    var devPopup = document.createElement('div');
    devPopup.id = 'developerPopup';
    devPopup.style = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background-color: black; background-image: url("https://s2.loli.net/2024/01/17/4nqsveVoH8A1mTB.png"); background-repeat: repeat; background-size: 50px 50px; color: #fbab07; border-radius: 50px; font-size: 20px; text-align: center; z-index: 1001; text-shadow: 2px 2px black; font-weight: bold;';
    devPopup.innerHTML = '<b>Developer lemures. Any questions please contact </b>';

    var discordButton = document.createElement('button');
    discordButton.textContent = 'QQ';
    discordButton.style = 'margin-top: 10px; padding: 5px 10px; background-color: #fbab07; color: black; border-radius: 20px; font-weight: bold;';
    discordButton.onclick = function() {
        window.open('tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=3242936329&website=www.oicqzone.com', '_blank');
    };

    devPopup.appendChild(discordButton);
    document.body.appendChild(devPopup);

    setTimeout(function() {
        devPopup.style.display = 'none';
    }, 0);
}


function showPopup() {
    createDeveloperPopup();

    setTimeout(function() {
        var popup = document.getElementById('imageChangerPopup') || createPopup(this);
        if (popup.style.display === 'none') {
            popup.style.display = 'block';
        }
        updateGallery(popup);
    }.bind(this), 0);
}
function createPopup() {
    var popup = document.createElement('div');
    popup.id = 'imageChangerPopup';
    popup.style = 'position: absolute; bottom: 90px; right: 60px; padding: 20px; background-color: rgba(0, 0, 0, 0.7); color: white; border-radius: 10px; display: flex; flex-direction: column; align-items: flex-start;';

    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Paste URL or Select';
    input.style = 'flex-grow: 1; margin-right: 10px; border: none; border-bottom: 1px solid white; outline: none; color: white; background-color: transparent;';

    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style = 'background-color: white; color: black; border-radius: 10px; font-weight: bold; font-size: 12px; padding: 5px 10px; border: none; transition: font-size 0.2s;';

    saveButton.onmouseover = function() {
        //saveButton.style.fontSize = '14px';
    };

    saveButton.onmouseout = function() {
        saveButton.style.fontSize = '12px';
    };

    var closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.style = 'position: absolute; top: -10px; right: -10px; width: 20px; height: 20px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.8); color: white; border: none; cursor: pointer;';
    closeButton.onclick = function() {
        popup.style.display = 'none';
    };

    input.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    input.addEventListener('drop', function(event) {
        event.preventDefault();
        handleDrop(event, popup);
    });

    var selectButton = document.createElement('button');
    selectButton.textContent = 'Select';
    selectButton.style = 'background-color: white; color: black; border-radius: 10px; font-weight: bold; font-size: 12px; padding: 5px 10px; border: none; transition: font-size 0.2s;';
    selectButton.onmouseover = function() {
        //selectButton.style.fontSize = '14px';
    };
    selectButton.onmouseout = function() {
        selectButton.style.fontSize = '12px';
    };

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    selectButton.onclick = function() {
        fileInput.click();
    };

    fileInput.onchange = function() {
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var url = e.target.result;
                saveUrl(url);
                updateGallery(popup);
            };
            reader.readAsDataURL(file);
        }
    };

    var actionsContainer = document.createElement('div');
    actionsContainer.style = 'display: flex; align-items: center; gap: 10px;';
    actionsContainer.appendChild(input);
    actionsContainer.appendChild(saveButton);
    actionsContainer.appendChild(selectButton);

    popup.appendChild(actionsContainer);
    popup.appendChild(fileInput);
    popup.appendChild(closeButton);

    document.body.appendChild(popup);

    return popup;
}

    function handleDrop(event, popup) {
        var files = event.dataTransfer.files;
        if (files.length > 0) {
            var file = files[0];
            if (file.type.startsWith('image/')) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var url = e.target.result;
                    saveUrl(url);
                    updateGallery(popup);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please drop an image file.');
        }
    }
}

function popupStyle() {
    return `
        position: fixed;
        bottom: px;
        right: 35px;
        padding: 20px;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid white;
        opacity: 0.9;
        z-index: 1000;
        border-radius: 10px;
    `;
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
        img.style = 'max-height: 80px; width: auto; object-fit: contain; border-radius: 8px;';

        img.onclick = function() {
            changeBackgroundImage(url);
        };

var deleteButton = document.createElement('button');
deleteButton.textContent = '✖';
deleteButton.style = 'position: absolute; top: 0px; right: 0; width: 20px; height: 20px; background-color: rgba(0, 0, 0, 0.3); border: none; border-radius: 50%; color: white; cursor: pointer; backdrop-filter: blur(3px);';
deleteButton.onclick = function() {
    removeUrl(url);
    updateGallery(popup);
};


        imageContainer.appendChild(img);
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
    }
}

function changeBackgroundImage(url) {
    clearInterval(interval);

    var selectors = ['#tuxun > .container', '.dailyChallengeContainer___udY4u', '.wrapper___cSTyt', '.game_container', '.game-container', '.wrapper___eX3bc','.wrapper___hODf7','.wrapper___Z2FVq','.partyWrapper___TwyLT'];

    selectors.forEach(function (selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.style.backgroundColor = 'transparent';

            element.style.background = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url('${url}')`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundAttachment = 'fixed';
            element.style.backgroundPosition = 'center';
            element.style.backgroundRepeat = 'no-repeat';
        }
    });
}

    window.addEventListener('load', function() {
        createButton();
        applySavedBackgroundImage();
    });

    function applySavedBackgroundImage() {
        const urls = getSavedUrls();
        if (urls.length > 0) {
            const randomIndex = Math.floor(Math.random() * urls.length);
            const selectedUrl = urls[randomIndex];

            interval = setInterval(function() {
                changeBackgroundImage(selectedUrl);
            }, 300);

        }
    }
})();
