// ==UserScript==
// @name         DiepShadow
// @namespace    https://diep.io
// @version      1.0
// @description  Press CTRL + I to activate. Create cool glow or 3D effects using this tool.
// @author       Binary
// @match        https://diep.io/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/412510/DiepShadow.user.js
// @updateURL https://update.greasyfork.org/scripts/412510/DiepShadow.meta.js
// ==/UserScript==

var hotkey_activate_sequence = function(event) { // CTRL + I
    if (event.ctrlKey && !event.altKey && !event.shiftKey && event.code === 'KeyI' && !event.repeat) {
        event.preventDefault();
        return true;
    }
};

var localStorage_key = 'diepshadow_preferences';
var version = window.GM_info ? window.GM_info.script.version : 'error, update tampermonkey';

var presets = [{
    name: 'Default',
    description: 'Resets everything to 0',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowStrength: 0,
    shadowColor: 'rgb(0,0,0)'
},{
    name: 'Diep.io 3D',
    description: '"Realistic" shadows that make Diep look 3D (not recommended for dark themes).',
    shadowBlur: 10,
    shadowOffsetX: 10,
    shadowOffsetY: 8,
    shadowStrength: 0.8,
    shadowColor: 'rgb(0,0,0)'
},{
    name: 'Underglow theme',
    description: 'Vroom! Vroom! Look at my new custom installed underglow! Increase Shadow Strength to "turn up the brightness."',
    shadowBlur: 10,
    shadowOffsetX: 10,
    shadowOffsetY: 8,
    shadowStrength: 0.8,
    shadowColor: 'rgb(255,255,255)'
},{
    name: 'Pop art theme',
    description: 'Black shadows that imitate the style of pop art.',
    shadowBlur: 0,
    shadowOffsetX: 10,
    shadowOffsetY: 8,
    shadowStrength: 1,
    shadowColor: 'rgb(0,0,0)'
},{
    name: 'Retro vibes',
    description: 'Purple + pop art = retro vibe. Demo of custom shadow colors. ' + 
    'Even more pog would be combining this with Diep.Style\'s 80s theme.',
    shadowBlur: 0,
    shadowOffsetX: 10,
    shadowOffsetY: 8,
    shadowStrength: 1,
    shadowColor: 'rgb(101,33,186)'
},{
    name: 'Pop art underglow theme',
    description: 'Super cool when combined with Diep.Style\'s dark theme.',
    shadowBlur: 0,
    shadowOffsetX: 10,
    shadowOffsetY: 8,
    shadowStrength: 1,
    shadowColor: 'rgb(255,255,255)'
},{
    name: 'Haze theme',
    description: 'Hazy shadows that look like fog. ' + 
    'Won\'t have much effect on Diep.Style dark themes.',
    shadowBlur: 25,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowStrength: 0.75,
    shadowColor: 'rgb(0,0,0)'
},{
    name: 'White glow theme',
    description: 'This is best used with Diep.Style\'s dark themes.',
    shadowBlur: 25,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowStrength: 0.75,
    shadowColor: 'rgb(255,255,255)'
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
var numberOrDefault = function(key, defaultValue){
    if(typeof storageSettings[key] === 'number' && !isNaN(storageSettings[key])) return storageSettings[key];
    return defaultValue;
};
var settings = {
    enableShadow: booleanOrDefault('enableShadow', true),
    enableSaving: booleanOrDefault('enableSaving', true),
    shadowBlur: numberOrDefault('shadowBlur', 0),
    shadowOffsetX: numberOrDefault('shadowOffsetX', 0),
    shadowOffsetY: numberOrDefault('shadowOffsetY', 0),
    shadowStrength: numberOrDefault('shadowStrength', 0),
    shadowColor: typeof storageSettings.shadowColor === 'string' ? storageSettings.shadowColor : 'rgb(0,0,0)'
};

var wrapper = document.createElement('div');
wrapper.style.position = 'fixed';
wrapper.style.backgroundColor = '#a3bfce';
wrapper.style.padding = '10px';
wrapper.style.top = '0px';
wrapper.style.right = '0px';
wrapper.style.bottom = '0px';
wrapper.style.overflowY = 'auto';
wrapper.style.overflowX = 'hidden';
wrapper.style.fontFamily = 'Ubuntu';
wrapper.style.display = 'none';

var checkbox_inputs = {};
var addCheckboxInput = function(displayText, name) {
    checkbox_inputs[name] = document.createElement('input');
    var enableShadowLabel = document.createElement('label');
    var enableShadowText = document.createTextNode(displayText);
    checkbox_inputs[name].type = 'checkbox';
    checkbox_inputs[name].checked = settings[name];
    enableShadowLabel.style.display = 'block';
    enableShadowLabel.style.width = 'fit-content';
    enableShadowLabel.appendChild(checkbox_inputs[name]);
    enableShadowLabel.appendChild(enableShadowText);
    wrapper.appendChild(enableShadowLabel);

    checkbox_inputs[name].addEventListener('change', function() {
        settings[name] = checkbox_inputs[name].checked;
        updateContext();
        saveSettings(true);
    });
};
var sliders = {};
var addSliderInput = function(displayText, name, min, max, step) {
    var slider = document.createElement('input');
    slider.type = 'range';
    slider.style.verticalAlign = 'middle';
    slider.style.width = '250px';
    slider.style.transform = 'none'; // reset Diep.Style's global style
    slider.min = min;
    slider.max = max;
    slider.step = step;
    var label = document.createElement('label');
    var displayTextSpan = document.createElement('span');
    var displayValueSpan = document.createElement('span');
    label.style.display = 'block';
    label.style.width = 'fit-content';

    displayTextSpan.style.width = '140px';
    displayTextSpan.style.display = 'inline-block';
    displayTextSpan.textContent = displayText;

    displayValueSpan.style.width = '30px';
    displayValueSpan.style.display = 'inline-block';
    displayValueSpan.style.textAlign = 'center';

    label.appendChild(displayTextSpan);
    label.appendChild(displayValueSpan);
    label.appendChild(slider);
    wrapper.appendChild(label);

    // addonchange useless, don't know why I implemented it. I guess this is for
    // ease of use in case future updates
    sliders[name] = {
        addonchange: function(callback) {
            var listener = function() {
                displayValueSpan.textContent = slider.value;
                callback(parseFloat(slider.value));
            };
            slider.addEventListener('change', listener);
            slider.addEventListener('input', listener);
        },
        setValue: function(newValue) {
            slider.value = newValue;
            displayValueSpan.textContent = newValue;
            slider.dispatchEvent(new window.Event('input', { bubbles: true }));
        }
    };
    sliders[name].setValue(settings[name]);
    sliders[name].addonchange(function(newValue) {
        settings[name] = newValue;
        updateContext();
        saveSettings();
    });
};
var colors = {};
var addColorInput = function(displayText, name) {
    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.verticalAlign = 'middle';
    var label = document.createElement('label');
    var displayTextSpan = document.createElement('span');
    label.style.display = 'block';
    label.style.width = 'fit-content';

    displayTextSpan.style.width = '170px';
    displayTextSpan.style.display = 'inline-block';
    displayTextSpan.textContent = displayText;

    label.appendChild(displayTextSpan);
    label.appendChild(colorInput);
    wrapper.appendChild(label);

    // addonchange useless, don't know why I implemented it. I guess this is for
    // ease of use in case future updates
    colors[name] = {
        addonchange: function(callback) {
            var listener = function() {
                callback(hexToRgb(colorInput.value));
            };
            colorInput.addEventListener('change', listener);
            colorInput.addEventListener('input', listener);
        },
        setValue: function(newValue) {
            colorInput.value = newValue;
            colorInput.dispatchEvent(new window.Event('input', { bubbles: true }));
        }
    };
    colors[name].setValue(rgbToHex(settings[name]));
    colors[name].addonchange(function(newValue) {
        settings[name] = newValue;
        updateContext();
        saveSettings();
    });
};
var addPreset = function(eachPreset){
    var presetWrap = document.createElement('div');
    var name = document.createElement('p');
    var description = document.createElement('p');
    var demo_lighttheme = document.createElement('p');
    var demo_darktheme = document.createElement('p');
    var btn = document.createElement('p');
    
    presetWrap.style.marginTop = '20px';
    presetWrap.style.borderTop = '2px solid black';
    
    name.textContent = 'Preset name: ' + eachPreset.name;
    name.style.width = '440px';
    name.style.margin = '5px 0px';
    
    description.textContent = 'Preset description: ' + eachPreset.description;
    description.style.width = '440px';
    description.style.margin = '5px 0px';
    
    var applyThemeToDemo = function(element){
        element.style.textShadow =
            eachPreset.shadowOffsetX + 'px ' +
            eachPreset.shadowOffsetY + 'px ' +
            eachPreset.shadowBlur + 'px ' +
            eachPreset.shadowColor.replace('rgb(', 'rgba(').replace(')', ',' + eachPreset.shadowStrength + ')');
        element.style.padding = '0px 20px 5px 7px';
        element.style.display = 'inline-block';
        element.style.borderRadius = '8px';
        element.style.margin = '0px';
        element.style.fontSize = '40px';
        element.style.webkitTextStrokeWidth = '3px';
    };
    
    applyThemeToDemo(demo_lighttheme);
    demo_lighttheme.textContent = '\u2B24';
    demo_lighttheme.style.backgroundColor = '#cdcdcd'; // color of default diep map
    demo_lighttheme.style.webkitTextStrokeColor = '#0084a6'; // color of diep tank outline
    demo_lighttheme.style.color = '#00b1de';  // color of diep tank body
    
    applyThemeToDemo(demo_darktheme);
    demo_darktheme.textContent = '\u2B24';//#00bbfd
    demo_darktheme.style.backgroundColor = 'black';
    demo_darktheme.style.webkitTextStrokeColor = '#0084a6'; // color of Diep.Style dark theme's diep tank outline
    demo_darktheme.style.color = 'black';  // color of Diep.Style dark theme's diep tank body
    demo_darktheme.style.marginLeft = '5px';
    
    btn.style.marginTop = '5px';
    btn.style.width = 'fit-content';
    btn.style.cursor = 'pointer';
    btn.style.color = '#004981';
    btn.textContent = 'Load preset';
    
    presetWrap.appendChild(name);
    presetWrap.appendChild(description);
    presetWrap.appendChild(demo_lighttheme);
    presetWrap.appendChild(demo_darktheme);
    presetWrap.appendChild(btn);
    
    wrapper.appendChild(presetWrap);
    
    btn.addEventListener('click', function() {
        sliders['shadowBlur'].setValue(eachPreset.shadowBlur);
        sliders['shadowOffsetX'].setValue(eachPreset.shadowOffsetX);
        sliders['shadowOffsetY'].setValue(eachPreset.shadowOffsetY);
        sliders['shadowStrength'].setValue(eachPreset.shadowStrength);
        colors['shadowColor'].setValue(rgbToHex(eachPreset.shadowColor));
        updateContext();
        saveSettings();
    });
};
var addSeparator = function(height, parentElement = wrapper) {
    var separator = document.createElement('div');
    separator.style.height = height + 'px';
    parentElement.appendChild(separator);
};

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
hotkeyTip.textContent = 'Press CTRL + i to activate';
wrapper.appendChild(hotkeyTip);

var heading = document.createElement('h1');
heading.textContent = 'DiepShadow';
heading.style.filter = 'drop-shadow(5px 0px 2px black)'; // drop shadow on the title just because. :^)
heading.style.color = 'white';
wrapper.appendChild(heading);

var warning = document.createElement('p');
warning.style.color = '#bb1e1e';
warning.appendChild(document.createTextNode('Warning: canvas\'s shadowBlur function is very CPU heavy.'));
addSeparator(0, warning);
warning.appendChild(document.createTextNode('Do not use if your computer is a turtle'));
wrapper.appendChild(warning);

addCheckboxInput('Enable DiepShadow', 'enableShadow');
addCheckboxInput('Enable saving', 'enableSaving');

addSeparator(16);

addSliderInput('Shadow Radius: ', 'shadowBlur', 0, 200, 1);
addSliderInput('Shadow X Offset: ', 'shadowOffsetX', -50, 50, 1);
addSliderInput('Shadow Y Offset: ', 'shadowOffsetY', -50, 50, 1);
addSliderInput('Shadow Strength: ', 'shadowStrength', 0, 1, 0.01);
addColorInput('Shadow Color: ', 'shadowColor');

var darkDemoNotice = document.createElement('p');
darkDemoNotice.textContent = 'Note: Dark mode colors are taken from Diep.Style';
wrapper.appendChild(darkDemoNotice);

presets.forEach(addPreset);

document.body.appendChild(wrapper);

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



var ctx = document.getElementById('canvas').getContext('2d');
// windowresize erases these settings, so make sure to apply them on every
// window resize event
function updateContext() {
    if (!settings.enableShadow) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'rgba(0,0,0,0)';
        return;
    }
    ctx.shadowBlur = settings.shadowBlur;
    ctx.shadowColor = settings.shadowColor
        .replace('rgb(', 'rgba(')
        .replace(')', ',' + settings.shadowStrength + ')');
    ctx.shadowOffsetX = settings.shadowOffsetX;
    ctx.shadowOffsetY = settings.shadowOffsetY;
}

function saveSettings(bypass) {
    if (!settings.enableSaving && !bypass) return;
    window.localStorage.setItem(localStorage_key, JSON.stringify(settings));
}

window.addEventListener('resize', updateContext);
updateContext();



// misc functions

// credit to https://stackoverflow.com/a/5624139/6850723
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    // return result ? {
    //     r: parseInt(result[1], 16),
    //     g: parseInt(result[2], 16),
    //     b: parseInt(result[3], 16)
    // } : null;
    return `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})`;
}
function componentToHex(c) {
    var hex = parseInt(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    // return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    var rgbsplit = rgb.split('rgb(')[1].replace(')', '').split(',');
    return "#" + componentToHex(rgbsplit[0]) + componentToHex(rgbsplit[1]) + componentToHex(rgbsplit[2]);
}