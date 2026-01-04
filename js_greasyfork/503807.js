// ==UserScript==
// @name         pretendo-cemu-files-gen
// @namespace    https://github.com/CorySanin
// @version      1.1
// @description  Generate account files for Cemu in order to access Pretendo
// @author       Cory Sanin
// @match        *://pretendo.network/account
// @require      https://raw.githubusercontent.com/pwasystem/zip/d0bbf615/zip.js#sha256=365e2abbc948a2ce0d876e227db05efc294f7e25e37cf43786c5689d49c0cdd8
// @license      Unlicense
// @icon         https://pretendo.network/assets/images/icons/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/503807/pretendo-cemu-files-gen.user.js
// @updateURL https://update.greasyfork.org/scripts/503807/pretendo-cemu-files-gen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // #region DOM elements
    function createButton(onClick) {
        let inner = document.createTextNode('Download account files');
        let outer = document.createElement('p');
        outer.classList.add('caption');
        outer.appendChild(inner);
        inner = outer;
        outer = document.createElement('a');
        outer.href = '#';
        outer.id = 'download-cemu-files';
        outer.classList.add('button', 'secondary');
        outer.appendChild(inner);
        document.querySelector('.account-sidebar .buttons').appendChild(outer);
        outer.addEventListener('click', onClick);
        return outer;
    }

    function createModal(onClick) {
        const parent = document.querySelector('div.main-body');
        let inner = document.createTextNode('Download account files');
        let outer = document.createElement('h1');
        let container = document.createElement('div');
        container.classList.add('modal');
        outer.appendChild(inner);
        outer.classList.add('title');
        container.appendChild(outer);
        inner = document.createTextNode('Enter your Pretendo password and click download to save your account files for Cemu. Note that this password is only sent to Pretendo. If unsure, please close this prompt.');
        outer = document.createElement('p');
        outer.appendChild(inner);
        outer.classList.add('modal-caption');
        container.appendChild(outer);
        inner = document.createElement('input');
        inner.name = 'password';
        inner.id = 'password';
        inner.type = 'password';
        inner.placeholder = 'password'
        container.appendChild(inner);
        outer = document.createElement('div');
        outer.classList.add('modal-button-wrapper');
        container.appendChild(outer);
        inner = document.createElement('button');
        inner.appendChild(document.createTextNode('Confirm'));
        inner.classList.add('button', 'primary', 'confirm');
        inner.id = 'onlineFilesConfirmButton';
        inner.addEventListener('click', onClick);
        outer.appendChild(inner);
        inner = document.createElement('button');
        inner.appendChild(document.createTextNode('Cancel'));
        inner.classList.add('button', 'cancel');
        inner.id = 'onlineFilesCloseButton';
        outer.appendChild(inner);
        outer = document.createElement('div');
        outer.appendChild(container);
        outer.id = 'onlinefiles';
        outer.classList.add('modal-wrapper', 'hidden');
        inner.addEventListener('click', (ev) => {
            ev.preventDefault();
            outer.classList.add('hidden');
        });
        parent.appendChild(outer);
        return outer;
    }
    // #endregion

    
    // #region helper functions

    // Not gonna lie, I used ChatGPT to translate the NodeJS hash algorithm to browser JS
    async function nintendoPasswordHash(password, pid) {
        // Create a buffer of 4 bytes for the pid in little-endian format
        const pidBuffer = new Uint8Array(4);
        new DataView(pidBuffer.buffer).setUint32(0, pid, true); // true for little-endian

        // Convert the password to a Uint8Array
        const passwordBuffer = new TextEncoder().encode(password);

        // Create the constant buffer
        const constantBuffer = new Uint8Array([0x02, 0x65, 0x43, 0x46]);

        // Concatenate the buffers
        const unpacked = new Uint8Array(pidBuffer.length + constantBuffer.length + passwordBuffer.length);
        unpacked.set(pidBuffer, 0);
        unpacked.set(constantBuffer, pidBuffer.length);
        unpacked.set(passwordBuffer, pidBuffer.length + constantBuffer.length);

        // Hash the unpacked data using SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', unpacked);

        // Convert the hash buffer to a hexadecimal string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashed = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashed;
    }

    function base64Hex(str) {
        const binaryString = atob(str);
        let hexString = '';
        for (let i = 0; i < binaryString.length; i++) {
            const hex = binaryString.charCodeAt(i).toString(16);
            hexString += (hex.length === 1 ? '0' + hex : hex);
        }
        return hexString;
    }

    function nameToHex(nameStr) {
        // Create a buffer with a fixed size of 0x16
        const buffer = new Uint8Array(0x16);

        let arr = []
        for (let i = 0; i < nameStr.length; i++){
            let ch = nameStr.charCodeAt(i);
            arr.push((ch & 0xFF00) >>> 8);
            arr.push(ch & 0xFF);
        }

        // Copy the swapped data into the buffer
        buffer.set(arr.slice(0, 0x16));

        // Convert the buffer to a hexadecimal string
        const hexString = Array.from(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('');

        return hexString;
    }

    // https://stackoverflow.com/a/8809472/11210376
    function generateUUID() { 
        let s;
        var d = new Date().getTime(); //Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        s = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return s;
    }
    // #endregion

    // #region plugin logic
    // This is the section to survey 👀
    const modal = createModal(async (ev) => {
        ev.preventDefault();
        modal.classList.add('hidden');
        const passwordTxt = modal.querySelector('#password');
        const password = passwordTxt.value;
        passwordTxt.value = '';

        const tokenType = document.cookie.split('; ').find(row => row.startsWith('token_type=')).split('=')[1];
        const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token=')).split('=')[1];

        try {
            const resp = await fetch('https://api.pretendo.cc/v1/user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${tokenType} ${decodeURIComponent(accessToken)}`
                },
                body: JSON.stringify({
                    environment: 'prod' // might not work for other environments
                })
            });
            const json = await resp.json();
            if (!json.error) {
                const account = json;
                const hashedPassword = await nintendoPasswordHash(password, account.pid);

                let accountDat = 'AccountInstance_00000000\n';
                accountDat += 'PersistentId=80000001\n';
                accountDat += 'TransferableIdBase=0\n';
                accountDat += `Uuid=${generateUUID().replace(/-/g, '')}\n`;
                accountDat += `MiiData=${base64Hex(account.mii.data)}\n`;
                accountDat += `MiiName=${nameToHex(account.mii.name)}\n`;
                accountDat += `AccountId=${account.username}\n`;
                accountDat += 'BirthYear=0\n';
                accountDat += 'BirthMonth=0\n';
                accountDat += 'BirthDay=0\n';
                accountDat += 'Gender=0\n';
                accountDat += `EmailAddress=${account.email.address}\n`;
                accountDat += 'Country=0\n';
                accountDat += 'SimpleAddressId=0\n';
                accountDat += `PrincipalId=${account.pid.toString(16)}\n`;
                accountDat += 'IsPasswordCacheEnabled=1\n';
                accountDat += `AccountPasswordCache=${hashedPassword}`;

                const z = new Zip('mlc01');
                z.str2zip('account.dat', accountDat, 'usr/save/system/act/80000001/');
                z.makeZip();
            }
            else {
                console.log(json.error);
                alert('Failed to get account data');
            }
        }
        catch (error) {
            console.log(error);
            alert('Failed to get account data');
        }
    });

    createButton((ev) => {
        ev.preventDefault();
        modal.classList.remove('hidden');
        modal.querySelector('#password').focus();
    });
    // #endregion
})();