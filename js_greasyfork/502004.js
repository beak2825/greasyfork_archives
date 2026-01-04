// ==UserScript==
// @name         Super  Infinity duo BETA
// @version      2.0.4
// @author       Taix
// @namespace    http://tampermonkey.net/
// @description  [Basic Version] Automatically get free Super Duolingo Family Link!! (Note: Currently in beta)
// @match        https://*.duolingo.com/*
// @grant        none
// @icon         https://d35aaqx5ub95lt.cloudfront.net/vendor/a0ee30fa22ca3d00e9e5db913b1965b5.svg
// @downloadURL https://update.greasyfork.org/scripts/502004/Super%20%20Infinity%20duo%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/502004/Super%20%20Infinity%20duo%20BETA.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
function addStyles(styles) {
    var styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}
 
var containerDivStyles = `
    #containerDiv {
        position: fixed;
        bottom: 77.5px;
        left: 26px;
        z-index: 9999;
        animation: bounce 1s infinite;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
`;
 
var verifyButtonStyles = `
    #verifyButton {
        background-color: #37B9F7;
        border: none;
        color: white;
        width: 247px;
        height: 50px;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 17px;
        font-weight: bold;
        border-radius: 20px;
        cursor: pointer;
        box-shadow: 0 4px #0190CD;
        line-height: 35px;
        vertical-align: middle;
    }
    #verifyButton:hover {
        background-color: #5CCBFF;
        box-shadow: 0 4px #0190CD;
    }
    #verifyButton:active {
        transform: translateY(2px);
        box-shadow: 0 0px #0190CD;
    }
`;
 
var getCodeButtonStyles = `
    #getCodeButton {
        background-color: #80D21A;
        border: none;
        color: white;
        width: 247px;
        height: 50px;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 17px;
        font-weight: bold;
        border-radius: 20px;
        cursor: pointer;
        box-shadow: 0 4px #84BE2E;
        line-height: 35px;
        vertical-align: middle;
    }
    #getCodeButton:hover {
        background-color: #95ef1f;
        box-shadow: 0 4px #84BE2E;
    }
    #getCodeButton:active {
        transform: translateY(2px);
        box-shadow: 0 0px #84BE2E;
    }
`;
 
var getSuperButtonStyles = `
    #getSuperButton {
        background-color: #37B9F7;
        border: none;
        color: white;
        width: 247px;
        height: 50px;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 17px;
        font-weight: bold;
        border-radius: 20px;
        cursor: pointer;
        box-shadow: 0 4px #0190CD;
        line-height: 35px;
        vertical-align: middle;
    }
    #getSuperButton:hover {
        background-color: #5CCBFF;
        box-shadow: 0 4px #0190CD;
    }
    #getSuperButton:active {
        transform: translateY(2px);
        box-shadow: 0 0px #0190CD;
    }
`;
 
var rectangleDivStyles = `
    #rectangleDiv {
        position: relative;
        width: 270px;
        height: 250px;
        background-color: rgba(0, 4, 55, 0.0);
        border-radius: 25px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 10px;
        border: 2.5px dotted #00b3c1;
        box-shadow: #00b3c1;
        backdrop-filter: blur(20px);
    }
    #titleContainer {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    #vipEvent {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        width: 80px;
        height: 28px;
        border: 2.3px solid #009feb;
        border-radius: 9px;
        color: #009feb;
        font-size: 16px;
        font-weight: bold;
        padding: 5px;
        background-color: #FFEDF0;
    }
    #vipEvent img {
        width: 22px;
        height: auto;
    }
    #vipEvent span {
        font-size: 14px;
    }
    #additionalText {
        color: #FFFFFF;
        font-weight: bold;
        font-size: 20px;
        text-align: left;
        margin-top: 10px;
    }
`;
 
var buttonStyles = `
    rectangleDivbutton {
        padding: 10px 20px;
        border-radius: 4px;
        width: 247px;
        height: 50px;
        cursor: pointer;
        animation: bounce 1s infinite;
    }
`;
 
function createFroXButton() {
    var wrapperDiv = document.createElement('div');
    wrapperDiv.style.position = 'fixed';
    wrapperDiv.style.top = '50%';
    wrapperDiv.style.right = '0.4%';
    wrapperDiv.style.transform = 'translate(0, -50%)';
    wrapperDiv.style.textAlign = 'center';
    wrapperDiv.style.zIndex = '9999';
 
    var froXButton = document.createElement('div');
    froXButton.id = 'froXButton';
    froXButton.style.backgroundImage = 'url("https://static.wixstatic.com/media/05f621_b2c22f9917ce4748bf0eae0142335496~mv2.png/v1/fill/w_50,h_50,al_c,q_85,enc_auto/05f621_b2c22f9917ce4748bf0eae0142335496~mv2.png")';
    froXButton.style.backgroundSize = '35px';
    froXButton.style.backgroundRepeat = 'no-repeat';
    froXButton.style.backgroundPosition = 'center';
    froXButton.style.backgroundColor = '#37B9F7';
    froXButton.style.width = '45px';
    froXButton.style.height = '45px';
    froXButton.style.borderRadius = '50%';
    froXButton.style.border = '2.8px solid #004d80';
    froXButton.style.cursor = 'pointer';
    froXButton.style.transition = 'transform 0.2s, box-shadow 0.2s';
    froXButton.style.backdropFilter = 'blur(20px)';
 
    froXButton.addEventListener('click', function() {
        var containerDiv = document.getElementById('containerDiv');
        if (containerDiv.style.display === 'none' || containerDiv.style.display === '') {
            containerDiv.style.display = 'block';
            froXButton.style.backgroundImage = 'url("https://static.wixstatic.com/media/05f621_b2c22f9917ce4748bf0eae0142335496~mv2.png/v1/fill/w_50,h_50,al_c,q_85,enc_auto/05f621_b2c22f9917ce4748bf0eae0142335496~mv2.png")';
        } else {
            containerDiv.style.display = 'none';
            froXButton.style.backgroundImage = 'url("https://static.wixstatic.com/media/05f621_694337e332e04ae1924e8e76bc8aabd0~mv2.png/v1/fill/w_50,h_50,al_c,q_85,enc_auto/05f621_694337e332e04ae1924e8e76bc8aabd0~mv2.png")';
        }
    });
 
    wrapperDiv.appendChild(froXButton);
    document.body.appendChild(wrapperDiv);
 
    var style = document.createElement('style');
    document.head.appendChild(style);
}
 
createFroXButton();
 
var nounDevXStyles = `
#NOUNDEVX {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 20px;
    background-color: rgb(217 138 138 / 50%) 0px 0px 0px 5px;
    border-radius: 18px;
    border: 2px solid #37B9F7;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    color: #37B9F7;
    backdrop-filter: blur(20px);
}
`;
 
addStyles(containerDivStyles);
addStyles(rectangleDivStyles);
addStyles(buttonStyles);
addStyles(verifyButtonStyles);
addStyles(getCodeButtonStyles);
addStyles(getSuperButtonStyles);
addStyles(nounDevXStyles);
 
var containerDiv = document.createElement('div');
containerDiv.id = 'containerDiv';
 
var rectangleDiv = document.createElement('div');
rectangleDiv.id = 'rectangleDiv';
 
var titleContainer = document.createElement('div');
titleContainer.id = 'titleContainer';
 
var title = document.createElement('strong');
title.style.fontWeight = 'bold';
title.style.fontSize = '20px';
title.style.display = 'flex';
title.style.alignItems = 'center';
 
var typeSpan = document.createElement('span');
typeSpan.style.color = '#009feb';
typeSpan.textContent = '  Type: ';
typeSpan.style.textAlign = 'left';
 
var superDuolingoSpan = document.createElement('span');
superDuolingoSpan.style.color = '#397b11';
superDuolingoSpan.textContent = ' ';
superDuolingoSpan.style.fontSize = '20px';
superDuolingoSpan.style.textAlign = 'left';
 
var darkModeSpan = document.createElement('span');
darkModeSpan.style.color = '#397b11';
darkModeSpan.style.fontSize = '10px';
darkModeSpan.textContent = '';
 
superDuolingoSpan.appendChild(darkModeSpan);
title.appendChild(typeSpan);
title.appendChild(superDuolingoSpan);
titleContainer.appendChild(title);
 
var vipEventDiv = document.createElement('div');
vipEventDiv.id = 'vipEvent';
 
var crownImg = document.createElement('img');
crownImg.src = 'https://autoduolingo.click/assets/client/crown.ndx';
crownImg.alt = 'Crown';
 
var vipEventSpan = document.createElement('span');
vipEventSpan.textContent = 'BASIC';
 
vipEventDiv.appendChild(crownImg);
vipEventDiv.appendChild(vipEventSpan);
titleContainer.appendChild(vipEventDiv);
rectangleDiv.appendChild(titleContainer);
document.body.appendChild(rectangleDiv);
 
var additionalText = document.createElement('strong');
additionalText.style.fontWeight = 'bold';
additionalText.style.fontSize = '22px';
additionalText.style.display = 'block';
 
rectangleDiv.appendChild(additionalText);
 
var verifyButton = document.createElement('button');
verifyButton.id = 'verifyButton';
verifyButton.textContent = 'HƯỚNG DẪN CẬP NHẬT';
verifyButton.style.marginTop = '-12px';
rectangleDiv.appendChild(verifyButton);
 
var getCodeButton = document.createElement('button');
getCodeButton.id = 'getCodeButton';
getCodeButton.textContent = 'CẬP NHẬT LÊN BẢN VIP';
rectangleDiv.appendChild(getCodeButton);
 
var getSuperButton = document.createElement('button');
getSuperButton.id = 'getSuperButton';
getSuperButton.textContent = 'BÁO CÁO SỰ CỐ';
rectangleDiv.appendChild(getSuperButton);
 
containerDiv.appendChild(rectangleDiv);
 
var nounDevX = document.createElement('div');
nounDevX.id = 'NOUNDEVX';
nounDevX.textContent = 'FrozeX - SuperDuo';
 
containerDiv.appendChild(nounDevX);
document.body.appendChild(containerDiv);
 
toggleGetSuperButton(true);
 
var froXButton = document.getElementById('froXButton');
var versionText = document.getElementById('VersionText');
 
verifyButton.addEventListener('mouseenter', function() {
    verifyButton.style.backgroundColor = '#5CCBFF';
});
verifyButton.addEventListener('mouseleave', function() {
    verifyButton.style.backgroundColor = '#37B9F7';
});
 
getCodeButton.addEventListener('mouseenter', function() {
    getCodeButton.style.backgroundColor = '#95ef1f';
});
getCodeButton.addEventListener('mouseleave', function() {
    getCodeButton.style.backgroundColor = '#80D21A';
});
 
getSuperButton.addEventListener('mouseenter', function() {
    getSuperButton.style.backgroundColor = '#5CCBFF';
});
getSuperButton.addEventListener('mouseleave', function() {
    getSuperButton.style.backgroundColor = '#37B9F7';
});
 
function toggleGetSuperButton(disable) {
    var getSuperButton = document.getElementById('getSuperButton');
    getSuperButton.disabled = disable;
}
 
})();