// ==UserScript==
// @name         edu 真实信息生成
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  在页面上添加一个悬浮面板，点击按钮生成并展示虚假信息
// @author       您的名字
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510281/edu%20%E7%9C%9F%E5%AE%9E%E4%BF%A1%E6%81%AF%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/510281/edu%20%E7%9C%9F%E5%AE%9E%E4%BF%A1%E6%81%AF%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

const LOCATION_API_URL = 'https://ipapi.co/json/';
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';
const RANDOM_USER_API_URL = 'https://randomuser.me/api/';

async function getIPAndLocation(customIP) {
    const url = customIP ? `https://ipapi.co/${customIP}/json/` : LOCATION_API_URL;
    const response = await fetch(url);
    return await response.json();
}

async function getRandomAddress(lat, lon) {
    const radius = 0.01;
    const randomLat = lat + (Math.random() - 0.5) * radius;
    const randomLon = lon + (Math.random() - 0.5) * radius;
    const response = await fetch(`${NOMINATIM_API_URL}?format=json&lat=${randomLat}&lon=${randomLon}&zoom=18&addressdetails=1&accept-language=en`);
    const data = await response.json();
    return data.address;
}

function formatName(firstName, lastName, countryCode) {
    const eastAsianCountries = ['CN', 'JP', 'KR', 'VN'];
    return eastAsianCountries.includes(countryCode.toUpperCase()) ? `${lastName}${firstName}` : `${firstName} ${lastName}`;
}

async function getRandomNameAndPhone(countryCode) {
    const apiNat = convertCountryCodeToNat(countryCode);
    const response = await fetch(`${RANDOM_USER_API_URL}?nat=${apiNat}`);
    const data = await response.json();
    const user = data.results[0];
    return {
        name: formatName(user.name.first, user.name.last, countryCode),
        phone: user.phone,
        firstName: user.name.first,
        lastName: user.name.last,
        email: user.email,
        dob: user.dob.date.split('T')[0],
        gender: user.gender === 'male' ? 'M' : 'F'
    };
}

function convertCountryCodeToNat(countryCode) {
    const countryMapping = {
        'CN': 'CN', 'US': 'US', 'GB': 'GB', 'FR': 'FR', 'DE': 'DE', 'AU': 'AU',
    };
    return countryMapping[countryCode.toUpperCase()] || 'US';
}

function generateRandomSSN() {
    const area = Math.floor(Math.random() * 900) + 100;
    const group = Math.floor(Math.random() * 90) + 10;
    const serial = Math.floor(Math.random() * 9000) + 1000;
    return `${area}-${group}-${serial}`;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setValueAndTriggerEvents(elementId, value) {
    try {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = value;
            triggerEvent(elementId, 'change');
            triggerEvent(elementId, 'blur');
            await delay(100);
        } else {
            console.warn(`元素 ${elementId} 未找到`);
        }
    } catch (error) {
        console.error(`设置 ${elementId} 时出错:`, error);
    }
}

async function setCheckboxAndTriggerEvents(elementId, checked) {
    try {
        const element = document.getElementById(elementId);
        if (element) {
            element.checked = checked;
            document.getElementById(`${elementId}$chk`).value = checked ? 'Y' : 'N';
            triggerEvent(elementId, 'click');
            triggerEvent(elementId, 'change');
            await delay(100);
        } else {
            console.warn(`元素 ${elementId} 未找到`);
        }
    } catch (error) {
        console.error(`设置 ${elementId} 时出错:`, error);
    }
}

async function generateAndFillInfo() {
    try {
        const ssnCheckbox = document.getElementById('CSU_SQA_REG_WRK_NID_FLG');
        if (ssnCheckbox) {
            ssnCheckbox.checked = true;
            document.getElementById('CSU_SQA_REG_WRK_NID_FLG$chk').value = 'Y';
        } else {
            console.warn('SSN 复选框未找到');
        }

        const ssnInput = document.getElementById('CSU_SQA_REG_WRK_SSN');
        if (ssnInput) {
            ssnInput.disabled = true;
            ssnInput.value = '';
        } else {
            console.warn('SSN 输入框未找到');
        }

        const locationData = await getIPAndLocation();
        const address = await getRandomAddress(locationData.latitude, locationData.longitude);
        const countryCode = address.country_code || locationData.country_code;
        const { name, phone, firstName, lastName, email, dob, gender } = await getRandomNameAndPhone(countryCode);

        await setValueAndTriggerEvents('EB_SSS_QKA_WORK_STATE', locationData.region_code);
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_STATE', locationData.region_code);
        await setValueAndTriggerEvents('NR_SSS_QKA_WORK_STATE', locationData.region_code);
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_NAME_PREFIX', gender === 'M' ? 'Mr' : 'Ms');
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_FIRST_NAME', firstName);
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_LAST_NAME', lastName);
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_COUNTRY', 'USA');
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_ADDRESS1', `${address.house_number || ''} ${address.road || ''}`.trim());
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_CITY', address.city || address.town || '');
        await setValueAndTriggerEvents('NR_SSS_QKA_WORK_POSTAL', address.postcode || '');
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_POSTAL', address.postcode || '');
        await setValueAndTriggerEvents('EB_SSS_QKA_WORK_POSTAL', address.postcode || '');
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_BIRTHDATE', dob);
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_SEX', gender === 'M' ? 'M' : 'F');
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_CONTACT_PHONE', phone);
        await setValueAndTriggerEvents('NR_SSS_QKA_WORK_EMAIL_ADDR', email);
        await setValueAndTriggerEvents('CSU_SQA_REG_WRK_EMAIL_ADDR', email);

        const info = `
            姓名: ${name}
            电话: ${phone}
            电子邮件: ${email}
            生日: ${dob}
            性别: ${gender === 'M' ? '男' : '女'}
            地址: ${address.house_number || ''} ${address.road || ''}, ${address.city || address.town || ''}, ${address.postcode || ''}
        `;

        document.getElementById('infoDisplay').textContent = info;
        document.getElementById('autofillButton').textContent = '重新生成';
        document.getElementById('exportButton').style.display = 'inline-block';

    } catch (error) {
        console.error('生成信息时出错:', error);
    }
}

function triggerEvent(elementId, eventType) {
    const element = document.getElementById(elementId);
    if (element) {
        if (typeof element[eventType] === 'function') {
            element[eventType]();
        }
        const event = new Event(eventType, { bubbles: true });
        element.dispatchEvent(event);
    }
}

const styles = `
    #autofillPanel {
        position: fixed;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        z-index: 10000;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        width: 250px;
        font-size: 12px;
        text-align: center;
    }
    #autofillButton, #exportButton {
        padding: 8px 12px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        width: calc(100% - 20px);
    }
    #autofillButton:hover, #exportButton:hover {
        background-color: #0056b3;
    }
    #infoDisplay {
        margin-top: 10px;
        font-size: 12px;
        white-space: pre-wrap;
        background-color: rgba(0, 0, 0, 0.05);
        padding: 5px;
        border-radius: 5px;
    }
    #closeButton {
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        font-size: 14px;
        cursor: pointer;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const panel = document.createElement('div');
panel.id = 'autofillPanel';
document.body.appendChild(panel);

const closeButton = document.createElement('button');
closeButton.id = 'closeButton';
closeButton.textContent = '×';
closeButton.onclick = () => panel.style.display = 'none';
panel.appendChild(closeButton);

const infoDisplay = document.createElement('div');
infoDisplay.id = 'infoDisplay';
panel.appendChild(infoDisplay);

const button = document.createElement('button');
button.id = 'autofillButton';
button.textContent = '生成信息并填充表单';
panel.appendChild(button);

const exportButton = document.createElement('button');
exportButton.id = 'exportButton';
exportButton.textContent = '导出信息';
exportButton.style.display = 'none';
panel.appendChild(exportButton);

button.addEventListener('click', generateAndFillInfo);

exportButton.addEventListener('click', () => {
    const info = document.getElementById('infoDisplay').textContent;
    navigator.clipboard.writeText(info).then(() => {
        alert('信息已复制到剪贴板');
    });
});

(function() {
    'use strict';
    console.log('edu 真实信息生成脚本已加载');
})();
