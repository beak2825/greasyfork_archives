// ==UserScript==
// @name         Crowdin Translate Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script to help translating
// @author       Ricardo Henrique (Avenue Code)
// @contributor  Eduardo Mendes (Avenue Code)
// @require      https://code.jquery.com/jquery-3.3.1.js
// @match        https://crowdin.com/translate/codeorg/*
// @downloadURL https://update.greasyfork.org/scripts/379916/Crowdin%20Translate%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/379916/Crowdin%20Translate%20Script.meta.js
// ==/UserScript==

// Please DO NOT SHARE THIS TOKEN and DO NOT post anywhere, I generated it only for this API and our usage.
const apiKey = "AIzaSyA6tXeIJorbmb4IToQAIM3tRKXUdd92MyU";

// Set endpoints
const endpoints = {
    translate: "",
    detect: "detect",
    languages: "languages"
};

$(() => {
    setTimeout(initializeScript, 2000);
    let translationObj = {};

    // Popuplate source and target language dropdowns
    //getLanguages();
    $(document)
    // Bind translate function to translate button (#translation_text_container .editor-pane-title)
        .on("click", "#translateAcLink", () => {
        translationObj = {
            sourceLang: "en",
            targetLang: "pt",
            textToTranslate: $("#source_phrase_container .singular").text()
        };

        if (translationObj.targetLang !== null) {
            translate(translationObj);
        } else {
            alert("Please select a target language");
        }
    })
    // Bind detect function to detect button
        .on("click", "button.detect", () => {
        translationObj = {
            textToTranslate: $("textarea").val()
        };

        detect(translationObj);
    });
});

const initializeScript = () => {
    mountFeatureIcon();
    makeUsabilityChanges();
}

// Translate
const translate = (data) => {
    makeApiRequest(endpoints.translate, data, "GET", false);
};

const mountFeatureIcon = () => {
    const style = "margin-right: 15px; margin-left: -3px;";
    const loadingIcon = "https://loading.io/spinners/blocks/index.rotating-squares-preloader-gif.gif";
    const translateIcon = "https://png.icons8.com/google-translate/4fa250";
    const imgLoadingAjax = `<img class="featureIcons" style="display: none; ${style}" id="linkLoadingAjax" src="${loadingIcon}" alt="Loading" height="35" width="35">`;
    const imgTranslateButton = `<img src="${translateIcon}" alt="Translate" height="35" width="35"></a>`;
    const htmlLink = `<a class="featureIcons" id="translateAcLink" href="#" style="${style}">${imgTranslateButton}`;

    $("#suggest_translation").before(htmlLink).before(imgLoadingAjax);
};

// Abstract API request function
const makeApiRequest = (endpoint, data, type, authNeeded) => {
    let url = "https://www.googleapis.com/language/translate/v2/" + endpoint;
    url += "?key=" + apiKey;
    url += "&format=text";

    // If not listing languages, send text to translate
    if (endpoint !== endpoints.languages) {
        url += "&q=" + encodeURI(data.textToTranslate);
    }

    // If translating, send target and source languages
    if (endpoint === endpoints.translate) {
        url += "&target=" + data.targetLang;
        url += "&source=" + data.sourceLang;
    }

    $.ajax({
        url: url,
        //type: type || "GET",
        type: "POST",
        data: data ? JSON.stringify(data) : "",
        dataType: "json",
        beforeSend: toggleFeatureIcons,
        success: onRequestSuccess,
        complete: toggleFeatureIcons,
        error: errorAlert,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    });
};

const toggleFeatureIcons = () => {
    $('.featureIcons').toggle();
};

const onRequestSuccess = (resp) => {
    $("#translation").val(resp.data.translations[0].translatedText).focus();
    $("#suggest_translation").prop(`disabled`, false);
};

const errorAlert = (error) => {
    alert("Error During Google API Call");
};

const makeUsabilityChanges = () =>{
    //applyShortcut();

    const $toolBarElement = $('#prev_translation').parent();
    $toolBarElement.removeClass('pull-left').addClass('pull-right');
};

const applyShortcut = () => {
    $(document).keydown(triggerTranslateOnAltPress);
};

const triggerTranslateOnAltPress = (e) => {
    if (e.keyCode == 18) {
        //evt.preventDefault();
        eventFire(document.getElementById('translateAcLink'), 'click')
    }
};

const eventFire = (el, etype) => {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        const evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
};

// Detect language
const detect = (data) => {
    makeApiRequest(endpoints.detect, data, "GET", false).success((resp) => {
        const source = resp.data.detections[0][0].language;
        const conf = resp.data.detections[0][0].confidence.toFixed(2) * 100;

        $(".source-lang option")
            .filter(() => { $(this).val() === source }) //To select Blue
            .prop("selected", true);

        $.when(getLanguageNames).then((data) => { $("p.target").text(`${data[source]} with ${conf}% confidence`); });
        $("h2.translation-heading").hide();
        $("h2.detection-heading, p").show();
    });
};

// Get languages
const getLanguages = () => {
    makeApiRequest(endpoints.languages, null, "GET", false).success(createLanguagesList);
};

const createLanguagesList = (resp) => {
    $.when(getLanguageNames).then(buildLangList);
};

// Convert country code to country name
const getLanguageNames = () => {
    return $.getJSON("https://api.myjson.com/bins/155kj1");
};

const buildLangList = (resp) => {
    $.each(resp.data.languages, displayLangOption);
};

const displayLangOption = (obj) => {
    $(".source-lang, .target-lang").append(
        '<option value="' +
        obj.language +
        '">' +
        data[obj.language] +
        "</option>"
    );
};

const buildHtmlInText = (tagName, tagContent, tagClasses, tagOthers) => {
    return `<${tagName} class="${returnIfVal(tagClasses)}" ${returnIfVal(tagOthers)}>${returnIfVal(tagContent)}</${tagName}>`;
};

const returnIfVal = (prop) => {
    return prop ? prop : "";
};

const selectText = (node) => {
    node = document.getElementById(node);

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
};

const buildAndAddCssClassInDOM = (className, classProperties) => {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.cssClass { color: #F00; }';
    style.innerHTML = `.${className} { ${classProperties} }`;
    document.getElementsByTagName('head')[0].appendChild(style);
};

/* Useful

    //eventFire(document.getElementById('gtx-trans'), 'click');
    document.querySelector('#source_phrase_container .singular').textContent;
    document.querySelector('#translation').value = "aaaa";
    //setTimeout(function(){ console.log(document.querySelector('.gtx-body')); }, 7000);
*/

