// ==UserScript==
// @name         K Portail Tools
// @namespace    http://preventimmo.fr/
// @version      0.24
// @description  Debug tools for portail application
// @author       You
// @include      /^https?:\/\/portail-.*\.preventimmo\.fr(?:\:\d+)?\/.*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadUrl  https://bitbucket.org/kinaxia/portail/src/tampermonkey/utils/tampermonkey.js
// @require      https://code.jquery.com/jquery-3.6.0.js
// @require      https://code.jquery.com/ui/1.13.0/jquery-ui.js
// @license      GNU gplv3
// @grant        GM.xmlHttpRequest
// @connect      preventimmo.fr
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/435546/K%20Portail%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/435546/K%20Portail%20Tools.meta.js
// ==/UserScript==


function loadHtml2Canvas() {
    // Add jQuery
    var GM_JQ = document.createElement('script');
    GM_JQ.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    GM_JQ.type = 'text/javascript';
    GM_JQ.id = 'html2canvas-lyz';
    document.getElementsByTagName('head')[0].appendChild(GM_JQ);
}

loadHtml2Canvas();

$("head").append (
  '<link '
  + 'href="https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css" '
  + 'rel="stylesheet" type="text/css">'
);

(function() {
    'use strict';

    let maxTries = 20;

    const interval = setInterval(() => {
        if (maxTries-- <= 0 || init()){
            clearInterval(interval);}
    }, 500);
})();

function init() {
    if(this.hasOwnProperty('__KPORTAIL__') && __KPORTAIL__?.version && $('#q-app').length) {
        addToolsDiv();
        return true;
    }
    return false;
}

function addToolsDiv() {
    const daDiv = document.createElement('div');
    daDiv.id = 'PortailToolbox';
    const versionBlock = getChangelogLink();
    daDiv.appendChild(versionBlock.title);
    daDiv.appendChild(versionBlock.content);

    const toolsBlock = getTools();
    $(versionBlock).accordion({active: false, collapsible: true});
    versionBlock.content.appendChild(toolsBlock.title);
    versionBlock.content.appendChild(toolsBlock.content);

    daDiv.style = 'width: fit-content; whitesapce: nowrap;position:absolute;top: 20px; left: 20px;z-index: 9999;f ont-size: 10px; font-family: "AvenirLTStd-Roman",Arial,sans-serif';
    document.body.appendChild(daDiv);

    const target =  $('.q-header').length ? '.q-header': '#q-app .flex-center .text-h2';

    try {
        const $acc = $(daDiv);
        $acc
          .accordion({active: false, collapsible: true})
          .draggable()
          .position({
              my: "center center",
              at: "center",
              of: target});
    } catch {}
}

function getChangelogLink(version = __KPORTAIL__.version) {
    const title = document.createElement('h3');
    const content = document.createElement('ul');

    title.innerText = `🧰 ${version}`;
    const href = `https://bitbucket.org/kinaxia/portail/src/v${version}/CHANGELOG.md`;
    content.innerHTML = `<li><a href="${href}" target="_blank">📜 changelog</a></li>`;

    const vBack = getBackendVersion();
    content.innerHTML += `<li><a href="${vBack.href}" target="_blank">🛎 back: ${vBack.text}</li>`;

    return {title, content};
}

function getBackendVersion() {
    const subdomain = window.location.host.split('.')[0].replace('portail-', '');
    const backUrl = subdomain === 'dev' ? 'https://portail-dev.preventimmo.fr:3000': 'https://portail-' + subdomain + '-back.preventimmo.fr';
    return {text: $.ajax({ url : backUrl + '/api/status',  async : false  }).responseJSON.version, href: backUrl + '/api/status'};
}

function getTools(version = __KPORTAIL__.version) {
    const title = document.createElement('h3');
    const content = document.createElement('ul');

    title.innerText = 'Tools';
    const genapiLi = document.createElement('li');
    genapiLi.innerHTML = '<a>💾 Simuler genapi</a>';
    $(genapiLi).click(getGenapiAuth);

    const bugLi = document.createElement('li');
    bugLi.innerHTML = '<a>🪳 Report a bug</a>';
    $(bugLi).click(reportIssue);

    const avmNextLi = document.createElement('li');
    avmNextLi.innerHTML = '<a>⏭ AVM next</a>';
    $(avmNextLi).click(loadAvmNext);

    const georisquesLi = document.createElement('li');
    georisquesLi.innerHTML = '<a>☢️ georisques v1</a>';
    $(georisquesLi).click(loadGeorisques);

    const georisquesOrderLi = document.createElement('li');
    georisquesOrderLi.innerHTML = '<a>☢️ georisques v2</a>';
    $(georisquesOrderLi).click(loadGeorisquesOrder);

    const urbaLi = document.createElement('li');
    urbaLi.innerHTML = '<a>🏘 urba</a>';
    $(urbaLi).click(loadUrba);

    const welcomeLi = document.createElement('li');
    welcomeLi.innerHTML = '<a>🏠 landing page</a>';
    $(welcomeLi).click(goToWelcome);

    const hiddenContentLi = document.createElement('li');
    hiddenContentLi.innerHTML = '<a>👀 hidden content</a>';
    $(hiddenContentLi).click(showHiddenContent);

    content.appendChild(genapiLi);
    content.appendChild(bugLi);
    content.appendChild(avmNextLi);
    content.appendChild(georisquesLi);
    content.appendChild(georisquesOrderLi);
    content.appendChild(urbaLi);
    content.appendChild(welcomeLi);
    content.appendChild(hiddenContentLi);
    return {title, content};
}

async function getGenapiAuth() {
    const url = await __KPORTAIL__.scripts.authGenapi();
    if(url) {
        window.open(url);
    }
}

function loadAvmNext() {
    window.location.replace(window.location.origin + '/avm-next');
}

function loadGeorisques() {
    window.location.replace(window.location.origin + '/georisques-v1');
}

function loadGeorisquesOrder() {
    window.location.replace(window.location.origin + '/georisques-order');
}

function loadUrba() {
    window.location.replace(window.location.origin + '/urba');
}

function goToWelcome() {
    window.open(document.location.origin + '/welcome');
}

function showHiddenContent() {
    Array.from(document.querySelectorAll(".k-tb-db")).forEach(el => el.style.display = 'inline');
}

const capture = async () => {
    return html2canvas(document.body, {ignoreElements: (el) => el.id === 'PortailToolbox'});
};

async function reportIssue() {
    capture().then((canvas) =>
    {
        function copyToClipboard(blob) {
            navigator.clipboard.write([new ClipboardItem({'image/png': blob})]).then(() => {
                const description = `h5. Description :
_action that triggered the bug, previous actions, any useful information..._

h5. Infos utiles :
+Utilisateur connecté+:
+version+: ${__KPORTAIL__.version}
+url+: ${document.location.href}
+browser+: ${navigator.userAgent}
+screnshot+: _should be in your clipboard, create issue then replace this text by pasting clipboard content here_
    `;

                const url = `https://kinaxia.atlassian.net/secure/CreateIssueDetails!init.jspa?pid=10073&issuetype=10103&description=${encodeURIComponent(description)}`;
                if(url) {
                    window.open(url);
                }
            });

        };
        canvas.toBlob(copyToClipboard);
//        const base64image = canvas.toDataURL("image/png");
//         window.location.href = base64image;


    });

}
