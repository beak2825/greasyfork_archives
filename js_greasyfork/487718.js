// ==UserScript==
// @name         图寻复盘mode
// @namespace    https://tuxun.fun/
// @version      4.4
// @description  多功能转换图寻复盘链接成谷歌链接，显示地点位置信息和拍摄时间，原作者lemures
// @match        https://tuxun.fun/replay?gameId=*
// @match        https://tuxun.fun/replay-pano?gameId=*&round=*
// @icon         https://s2.loli.net/2024/05/29/laZyuemTzKt3O5s.png
// @author       Rylleon
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @copyright    Rylleon
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/487718/%E5%9B%BE%E5%AF%BB%E5%A4%8D%E7%9B%98mode.user.js
// @updateURL https://update.greasyfork.org/scripts/487718/%E5%9B%BE%E5%AF%BB%E5%A4%8D%E7%9B%98mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle(`
    #coordinates-container {
        position: fixed;
        top: 100px;
        left: 10px;
        padding: 10px;
        border-radius: 20px !important;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        width: 160px;
    }

    #coordinates-container button {
        cursor: pointer;
        width: 100% !important;
        font-weight: bold !important;
        border: 8px solid #000000 !important;
        text-align: left !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
        backdrop-filter: blur(10px);
        margin-bottom: 5px;
        border-radius: 4px;
        background-color: #000000 !important;
        color: #A0A0A0 !important;
    };

    #conversion-mode {
        font-family: Arial, sans-serif !important;
        color: #000000 !important;
        text-shadow: -1px -1px 0 #A0A0A0, 1px -1px 0 #A0A0A0, -1px 1px 0 #A0A0A0, 1px 1px 0 #A0A0A0 !important;
        margin-bottom: 5px !important;
    }

    .link-button {
        background: none!important;
        border: none;
        padding: 0!important;
        color: #FFCC00 !important;
        text-decoration: underline;
        cursor: pointer;
    }

    .link-button:hover {
        color: #FFCC00 !important;
    }
`);
    const container = document.createElement('div');
    container.id = 'coordinates-container';
    document.body.appendChild(container);

    const conversionModeLabel = document.createElement('div');
    conversionModeLabel.id = 'conversion-mode';
    conversionModeLabel.textContent = 'Conversion Mode';
    container.appendChild(conversionModeLabel);


    const openButton = document.createElement('button');
    openButton.textContent = 'Open in Google Map';
    container.appendChild(openButton);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy to Clipboard';
    container.appendChild(copyButton);

    let currentLink = '';
    openButton.onclick = () => window.open(currentLink, '_blank');
    copyButton.onclick = () => {
        GM_setClipboard(currentLink, 'text');
        alert('Link copied to clipboard');
    };


const areaButton = document.createElement('button');
areaButton.textContent = 'Area';
container.appendChild(areaButton);

const streetButton = document.createElement('button');
streetButton.textContent = 'Street';
container.appendChild(streetButton);

const timeButton = document.createElement('button');
timeButton.textContent = 'Time';
container.appendChild(timeButton);

let globalTimeInfo = null;
let globalAreaInfo = null;
let globalStreetInfo = null;

function updateButtonContent() {
    areaButton.textContent = globalAreaInfo ? `${globalAreaInfo}` : 'Area';
    streetButton.textContent = globalStreetInfo ? `${globalStreetInfo}` : 'Street';
    timeButton.textContent = globalTimeInfo ? `${globalTimeInfo}` : 'Time';
}


setInterval(updateButtonContent, 1000);
    var realSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.send = function(value) {
    this.addEventListener('load', function() {
        if (this._url && this._url.includes('https://tuxun.fun/api/v0/tuxun/mapProxy/getGooglePanoInfoPost')) {
            const responseText = this.responseText;

            const coordinatePattern = /\[\[null,null,(-?\d+\.\d+),(-?\d+\.\d+)\],\[\d+\.\d+\],\[\d+\.\d+,\d+\.\d+,\d+\.\d+\]\]|\[\s*null,\s*null,\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\s*\]/;
            const coordinateMatches = coordinatePattern.exec(responseText);
            if (coordinateMatches) {
                const latitude = coordinateMatches[1] || coordinateMatches[3];
                const longitude = coordinateMatches[2] || coordinateMatches[4];
                if (latitude && longitude) {
                    currentLink = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;
                }
            }

            const countryPattern = /,\s*"([A-Z]{2})"\s*\],null,\[/;
const countryMatches = countryPattern.exec(responseText);
let countryCode = countryMatches ? countryMatches[1] : '未知国家';

const areaPattern = /\[\[\s*"([^"]+)",\s*"[a-z]{2}"\s*\],\s*\["([^"]+)",\s*"zh"\s*\]\]/;
const areaMatches = areaPattern.exec(responseText);
if (areaMatches && areaMatches.length >= 3) {
    globalAreaInfo = `${countryCode}, ${areaMatches[2]}`;
}


            const fullAddressPattern = /\[\s*null,\s*null,\s*\[\s*\["([^"]+)",\s*"[a-z]{2}"\s*\]\]/;
const addressMatches = fullAddressPattern.exec(responseText);

if (addressMatches && addressMatches.length > 1) {
    globalStreetInfo = addressMatches[1];
} else {
    globalStreetInfo = '未知地址';
}

            const timePattern = /\[\d+,\d+,\d+,null,null,\[null,null,"launch",\[\d+\]\],null,\[(\d{4}),(\d{1,2})\]\]/;
            const timeMatches = timePattern.exec(responseText);
            if (timeMatches) {
                globalTimeInfo = `${timeMatches[1]}年${timeMatches[2]}月`;
            } else {
                globalTimeInfo = '未知时间';
            }
        }
    }, false);

    realSend.call(this, value);
};

    XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        this.realOpen(method, url, async, user, pass);
    };
    //map
    window.addEventListener('popstate', function(event) {
    const container = document.getElementById('coordinates-container');
    if (container) {
        container.remove();
    }
});

})();
