// ==UserScript==
// @name          Google Apps Script Editor Styler
// @description   Style the Google Apps Script Editor
// @namespace     https://github.io/oshliaer
// @domain        script.google.com
// @include       https://script.google.com/d/*
// @include       https://script.google.com/macros/d/*
// @include       https://script.google.com/a/*/d/*
// @include       https://script.google.com/macros/a/*/d/*
// @author        +AlexanderIvanov
// @developer     +AlexanderIvanov
// @version       2017.2.28
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @icon          https://ssl.gstatic.com/images/icons/product/script_chrome_only-256.png
// @screenshot    https://gist.githubusercontent.com/oshliaer/518246959a67699ff8fb414ad6c7aa3d/raw/googleappsscripteditorstyler.screenshot.png
// @license       WTFPL; http://www.wtfpl.net/txt/copying
// @downloadURL https://update.greasyfork.org/scripts/27628/Google%20Apps%20Script%20Editor%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/27628/Google%20Apps%20Script%20Editor%20Styler.meta.js
// ==/UserScript==

//var GOGLEFONTSCOLLECTION = ['Roboto', 'Droid Sans Mono', 'Ubuntu Mono'];

var userFontSettings = GM_getValue('userFontSettings', {
    fontFamily: 'default'
});

//console.log('userFontSettings', userFontSettings);

if(userFontSettings.fontFamily !== 'default'){
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css?family=' + userFontSettings.fontFamily;
    document.head.appendChild(link);
}

var style = '' +

    //Autocomplete padding items
    '*,html{font-family: ' + userFontSettings.fontFamily + ' !important;}' +

    //Autocomplete padding items
    '.gwt-Label.item{padding-top:2px !important; padding-bottom:2px !important;}' +

    //Autocomplete padding invert active
    '.gwt-Label.item.selected{background-color:black !important;color:white !important;}' +

    // modal-dialog log
    '.script-logging-dialog{min-width:1000px !important; min-height:700px !important;}' +

    //Settings panel
    'div.tm_settings{position:absolute;bottom:0;right:0;opacity:0.3;z-index:9999;background:#000;color:#fff}';

GM_addStyle(style);

window.addEventListener("load", function load(event){
    var newElement = document.createElement('div');
    var docsTitleInner = document.getElementById('docs-titlebar');
    var typeOfLocation = getTypeOfLocation(window.location.href);
    newElement.innerHTML = typeOfLocation.name;
    newElement.setAttribute('style', 'text-align: center');
    docsTitleInner.appendChild(newElement);

    var settingsDiv = document.createElement('div');
    settingsDiv.className = 'tm_settings';

    var formSettingsDiv = document.createElement('div');
    formSettingsDiv.className = 'tm_form_settings';
    formSettingsDiv.style.display = 'none';

    var toggleButton = document.createElement('button');
    toggleButton.innerHTML = '_';
    toggleButton.addEventListener('click', function(){
        if(formSettingsDiv.style.display === 'none'){
            formSettingsDiv.style.display = 'block';
            toggleButton.innerHTML = 'X';
        }else{
            formSettingsDiv.style.display = 'none';
            toggleButton.innerHTML = '_';
        }
    });

    var fontInput = document.createElement('input');
    fontInput.value = userFontSettings.fontFamily;

    var reloadButton = document.createElement('button');
    reloadButton.innerHTML = 'ok';
    reloadButton.addEventListener('click', function(){
        GM_setValue('userFontSettings', {
            fontFamily: fontInput.value
        });
        location.reload();
    });

    formSettingsDiv.appendChild(fontInput);
    formSettingsDiv.appendChild(reloadButton);
    settingsDiv.appendChild(toggleButton);
    settingsDiv.appendChild(formSettingsDiv);
    document.body.appendChild(settingsDiv);

},false);

function getTypeOfLocation(href){
    var types = [
        {mask: '^https:\/\/script\.google\.com\/a\/.*?\/macros\/d\/.*$', name: 'BOUND SCRIPT / GSUITE', color: ''},
        {mask: '^https:\/\/script\.google\.com\/a\/.*?\/d\/.*$', name: 'STANDALONE SCRIPT / GSUITE', color: ''},
        {mask: '^https:\/\/script\.google\.com\/macros\/d\/.*$', name: 'BOUND SCRIPT', color: ''},
        {mask: '^https:\/\/script\.google\.com\/d\/.*$', name: 'STANDALONE SCRIPT', color: ''},
    ];
    for(var i = 0; i < types.length; i++){
        var patt = new RegExp(types[i].mask);
        if(patt.test(href, 'i'))
            return types[i];
    }
    return {
        mask: '',
        name:'',
        color: ''
    };
}
