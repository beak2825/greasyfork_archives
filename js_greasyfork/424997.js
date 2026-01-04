// ==UserScript==
// @name         DiepGrid
// @namespace    https://diep.io
// @version      1.0
// @description  Do you want to replace those lame boring grid tiles with something much more interesting? Well, you've come to the right place!
// @author       Binary
// @match        https://diep.io/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424997/DiepGrid.user.js
// @updateURL https://update.greasyfork.org/scripts/424997/DiepGrid.meta.js
// ==/UserScript==

var hotkey_activate_sequence = function(event) { // CTRL + B
    if (event.ctrlKey && !event.altKey && !event.shiftKey && event.code === 'KeyB' && !event.repeat) {
        event.preventDefault();
        return true;
    }
};

var localStorage_key = 'diepgrid_preferences';
var version = window.GM_info ? window.GM_info.script.version : 'error, update tampermonkey';

var presets = [{
    name: 'Default',
    imageUrl: ''
},{
    name: 'Awesome Face',
    imageUrl: 'https://i.imgur.com/Q801K1i.jpg'
},{
    name: 'Minecraft grass texture',
    imageUrl: 'https://i.imgur.com/SohhFGz.jpg'
},{ // the following is credited to https://imgur.com/gallery/rJaJaAq
    name: 'Pixel water texture',
    imageUrl: 'https://i.imgur.com/5e8VUmY.png'
},{
    name: 'Pixel wood texture',
    imageUrl: 'https://i.imgur.com/619IWye.png'
},{
    name: 'Pixel brick texture',
    imageUrl: 'https://i.imgur.com/7o2h985.png'
},{
    name: 'Pixel lava texture',
    imageUrl: 'https://i.imgur.com/M5VKiE7.png'
},{
    name: 'Pixel glass texture',
    imageUrl: 'https://i.imgur.com/vDcA87H.png'
},{
    name: 'Pixel bedrock texture',
    imageUrl: 'https://i.imgur.com/a359ele.png'
},{
    name: 'Find out yourself',
    imageUrl: 'https://i.imgur.com/dGhAuvh.png'
}];

var storageSettings;
try{
    storageSettings = JSON.parse(window.localStorage.getItem(localStorage_key));
}catch(e){storageSettings = {}}
if(!(storageSettings instanceof Object)) storageSettings = {};
var booleanOrDefault = function(key, defaultValue){
    if(typeof storageSettings[key] === 'boolean') return storageSettings[key];
    return defaultValue;
};
var stringOrDefault = function(key, defaultValue){
    if(typeof storageSettings[key] === 'string') return storageSettings[key];
    return defaultValue;
};
var settings = {
    enableOnLoad: booleanOrDefault('enableOnLoad', true),
    imageUrl: stringOrDefault('imageUrl', '')
};
function saveSettings() {
    window.localStorage.setItem(localStorage_key, JSON.stringify(settings));
}

var wrapper = document.createElement('div');
wrapper.style.position = 'fixed';
wrapper.style.backgroundColor = '#a3ceb6';
wrapper.style.padding = '10px';
wrapper.style.left = '0px';
wrapper.style.right = '0px';
wrapper.style.bottom = '0px';
wrapper.style.overflowY = 'auto';
wrapper.style.overflowX = 'hidden';
wrapper.style.fontFamily = 'Ubuntu';
wrapper.style.display = 'none';

var versionHeader = document.createElement('p');
versionHeader.style.margin = '0px';
versionHeader.style.fontSize = '12px';
versionHeader.style.position = 'absolute';
versionHeader.style.right = '10px';
versionHeader.textContent = 'Version: ' + version;
wrapper.appendChild(versionHeader);

var hotkeyTip = document.createElement('p');
hotkeyTip.style.margin = '0px';
hotkeyTip.style.fontSize = '12px';
hotkeyTip.style.position = 'absolute';
hotkeyTip.textContent = 'Press CTRL + B to activate';
wrapper.appendChild(hotkeyTip);

var heading = document.createElement('h1');
heading.textContent = 'DiepGrid';
heading.style.color = '#096f2d';
wrapper.appendChild(heading);

var addParagraph = (text, fontSize = '14px') => {
    var paragraph = document.createElement('p');
    paragraph.textContent = text;
    paragraph.style.fontSize = fontSize;
    wrapper.appendChild(paragraph);
};

var addSeparator = function(height, parentElement = wrapper) {
    var separator = document.createElement('div');
    separator.style.height = height + 'px';
    parentElement.appendChild(separator);
};

var checkbox_inputs = {};
var addCheckboxInput = function(displayText, name) {
    checkbox_inputs[name] = document.createElement('input');
    var enableShadowLabel = document.createElement('label');
    var enableShadowText = document.createTextNode(displayText);
    checkbox_inputs[name].type = 'checkbox';
    checkbox_inputs[name].checked = settings[name];
    enableShadowLabel.style.display = 'block';
    enableShadowLabel.style.width = 'fit-content';
    enableShadowLabel.style.fontSize = '14px';
    enableShadowLabel.appendChild(checkbox_inputs[name]);
    enableShadowLabel.appendChild(enableShadowText);
    wrapper.appendChild(enableShadowLabel);

    checkbox_inputs[name].addEventListener('change', function() {
        settings[name] = checkbox_inputs[name].checked;
        saveSettings();
    });
};

addCheckboxInput('Enable DiepGrid on load', 'enableOnLoad');

addParagraph('Do you want to replace those lame boring grid tiles with something much more interesting? Well, you\'ve come to the right place!', '18px');
addParagraph('Step 1: paste in an image url. It is best that the image is a square (excess gets cut off) and be in increments of 50px (to avoid pixelation). If you don\'t have ideas for the image, I have provided a few presets.');

var input = document.createElement('input');
input.placeholder = 'enter your image url here';
input.style.width = '400px';
input.onclick = () => {
    var promptInput = prompt('for some reason, this input bar does not like receiving input. please enter it here instead', input.value);
    if (promptInput !== null) input.value = promptInput;
};
wrapper.appendChild(input);

addParagraph('Presets:');
var addPreset = (name, imageUrl) => {
    var btn = document.createElement('button');
    btn.textContent = name;
    btn.onclick = () => { input.value = imageUrl };
    wrapper.appendChild(btn);
};

presets.forEach(preset => addPreset(preset.name, preset.imageUrl));

addSeparator(15);
addParagraph('Step 2: press this button to activate the grid-replacer-machine. (note that it will get angry if you provide it with something that is not an image');

var activationBtn = document.createElement('button');
activationBtn.onclick = () => activate();
activationBtn.textContent = 'Activate the grid replacer machine';
wrapper.appendChild(activationBtn);

addSeparator(15);
addParagraph('Step 3: enjoy your quite different playing experience!');

document.body.appendChild(wrapper);

var image = null;
var pattern = null;
CanvasRenderingContext2D.prototype.createPattern = new Proxy(CanvasRenderingContext2D.prototype.createPattern, {
    apply(target, thisArg, args) {
        if (pattern) return pattern;
        else if (image) {
            var patternCanvas = document.createElement('canvas');
            patternCanvas.width = 50;
            patternCanvas.height = 50;
            var patternCtx = patternCanvas.getContext('2d');
            var squareSideLength = image.width > image.height ? image.height : image.width;
            var scaling = 50 / squareSideLength;
            patternCtx.setTransform(scaling, 0, 0, scaling, 0, 0);
            patternCtx.drawImage(image, 0, 0, squareSideLength, squareSideLength);
            args[0] = patternCanvas;
            pattern = Reflect.apply(target, thisArg, args);
            return pattern;
        }
        return Reflect.apply(target, thisArg, args);
    }
});

function activate() {
    if (!input.value) {
        image = null;
        pattern = null;
        settings.imageUrl = '';
        saveSettings();
        return;
    }
    var img = new Image();
    img.onload = () => {
        if (img.width && img.height) {
            image = img;
            pattern = null;
            settings.imageUrl = input.value;
            saveSettings();
        } else {
            alert('DiepGrid: image has to have a width and a height');
        }
    };
    img.onerror = () => alert('DiepGrid: an error occurred while loading the image');
    img.src = input.value;
}

input.value = settings.imageUrl;
if (settings.enableOnLoad) {
    activate();
}

var isDisplaying = false;
document.addEventListener('keydown', function(event) {
    if (!hotkey_activate_sequence(event)) return;
    if (isDisplaying) {
        isDisplaying = false;
        wrapper.style.display = 'none';
    }
    else {
        isDisplaying = true;
        wrapper.style.display = 'block';
    }
});
