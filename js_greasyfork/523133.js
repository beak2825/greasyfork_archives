// ==UserScript==
// @name         Highlighter
// @namespace    http://tampermonkey.net/
// @version      2025-01-07
// @description  Goes through column of values and highlights cells that match regex
// @author       GreatFireDragon
// @require      https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/10.5.23/jsrsasign-all-min.js
// @match        https://docs.google.com/spreadsheets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://marker.to
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      oauth2.googleapis.com
// @connect      sheets.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/523133/Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/523133/Highlighter.meta.js
// ==/UserScript==

const SERVICE_ACCOUNT_EMAIL = "qwerty123@gfd-gpt.iam.gserviceaccount.com";
const SERVICE_ACCOUNT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCcjJuqGITp5sXz\nhD3jBt+Hnx5owEf+vMaVjllVnggl//vebwOIwfFZKF9lyAPZbQQijHsJIqsxS7rL\n+Ir4oaysmlycV3jbqChhzM+FmpslpAVZl8EqOQOJSW+S9qmCjU7rsLBbJOX8/hn6\nZQZnnj0fJk71TtTrjpPzU6030LykjXQbFyBwNs4ddauewkljsCaV0vtlBKnPyYs+\nu/H4s1E29Dj5h3s/Mnxv/ciIT3doL4nkkCuBLENECISifNsuV0JXLA/zaoGRDIr4\nrnD+FAkXB3+nokgwA0eKVDHPI0TbbxfuvJkW+4NUYbYiKfvrDDbspM1xS3i6jcHa\n2PqFZSvpAgMBAAECggEAJdgr7WO+Bdle8y5903se4GdL76DEBsXV7+OYnwT0DVOj\nrLMDlLTlxlrnLPC8VXxwKnXxbFTwM5uODa8I0XAsERHD35uZwOgW0wWzCSZF6USM\ncosoDC/6Nd8F1O5CLihA8uMkzvPNkWpQF2MCuFvdhME7BzxGZqdyBrmsvzh70f9r\nSKfrtUIDr/1RU6iufNdxguBEcpK1x/j5im8PBO5hqkPZQA9PGPhwlGK1guWOZeUU\nSM+lF9aW4vqPOFzGSz/3q+H2prm88hQwpP5ICIXHbRIrvw3XhwWlb6EVb2j9+wNN\nmGzQiZLgInPPyWzxC/EdHQOHPbGHCUa1ZqS5D2oofQKBgQDMoK/UbD0vaZh9DBfU\nwQ3AJFiwnz/m01zTBu5F3q4wNhCrPEtqU/cpNehwyjTvkyDi/Z6kCskyl6qveiM1\nixsAvH95YOtt+WfYFSCZBCQD2MrMDegXib2fuC0+sOpox7T9jlNXN5ZxUY4E9JJx\nNFw1d9Vk4+Mn+yvoYOMgoGeBbwKBgQDD2fIb9QRJFA5IXMLBdfUDXrigZjhzgdmO\nKrSN91I2NY62gjsPzKasdQ60B809TTyi5YXNNgx50vIqO9JCkbL5dWsfCUmthY9L\nDREM+sPDVbSyrQLYfZkjsB0j8PSArybKtAJHibtMED1Izl+9HTHfARJ+nxKQ+yQE\nFLFT10TMJwKBgCwJiM2WXbSObRq8N4S551OqfsvD+eSbKCbiHvU6bxJBEGVJnJFN\ncKuVxmg/nBTS/Qjcu/9hstsIeNs61cj4Ht+RsX1VtlT8j7SZF2LW2Ulapoozk/c8\n1WpCILqVKF1UXUcUEit68w2AF6hJWhqywgVfvLTxtjksfM6Ny1OCMcRRAoGACwlE\nAFlNNYUAzQkVHGu2M8tpofhApBmkFcPIStut8UoRUa2DAH/qwHsUKgbqhNLOYOuI\nH6k1CMRfSwv17DRjnnUEZUpTsYh+K59/33heAarZtNvU9jgVohIxgi34ySuVhwSf\nwEI9oKqlmW2vrWtwvP1FeociN7M/M0+rMmtGAC8CgYAeMZ5CjHFcVCecJMV2Qn7m\nL6W3xgY312Deb2K6u/rk+UH8sWJg7KK/f4QIz9Gxx1r2RN4b4ow74yj++KSvHfJp\nL+MBPE6D4YMLbkXhIGFSq0KczDGWelByaBAogcKTR182OSPPtW4KCJjY5+7by8Ci\nhozkEmLKPaMAQPIExrVPHQ==\n-----END PRIVATE KEY-----\n";

/* --------------------------------------------------------------------------
 *  GLOBALS
 * -------------------------------------------------------------------------- */
let configInitialized = false;
let configInstance = null;

/**
 * Converts a 1-based column index (A=1, B=2, etc.) to a letter-based column name.
 * (E.g., 1 -> 'A', 2 -> 'B', 27 -> 'AA', ...)
 */
function columnNumberToLetter(number) {
    let column = '';
    while (number > 0) {
        const modulo = (number - 1) % 26;
        column = String.fromCharCode(65 + modulo) + column;
        number = Math.floor((number - modulo) / 26);
    }
    return column;
}

/**
 * Converts a letter-based column (e.g. 'A', 'B', 'Z', 'AA') to a 1-based number.
 */
function columnLetterToNumber(letter) {
    return [...letter.toUpperCase()].reduce(
        (sum, char) => sum * 26 + (char.charCodeAt(0) - 64),
        0
    );
}

/**
 * Returns the spreadsheet's ID from the URL.
 */
function getCurrentSpreadsheetId() {
    const match = window.location.href.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

/**
 * Get a JWT bearer token for the service account.
 * Similar to your original script’s approach.
 */
function getServiceAccountAccessToken() {
    return new Promise((resolve, reject) => {
        if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PRIVATE_KEY) {
            return reject('SERVICE_ACCOUNT_EMAIL / SERVICE_ACCOUNT_PRIVATE_KEY is empty.');
        }
        const now = Math.floor(Date.now() / 1000);
        const jwtHeader = { alg: 'RS256', typ: 'JWT' };
        const jwtClaimSet = {
            iss: SERVICE_ACCOUNT_EMAIL,
            scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now
        };

        try {
            const sJWS = KJUR.jws.JWS.sign(
                null,
                JSON.stringify(jwtHeader),
                JSON.stringify(jwtClaimSet),
                SERVICE_ACCOUNT_PRIVATE_KEY
            );

            const formData = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='
                + encodeURIComponent(sJWS);

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://oauth2.googleapis.com/token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: formData,
                onload: (res) => {
                    if (res.status === 200) {
                        const data = JSON.parse(res.responseText);
                        resolve(data.access_token);
                    } else {
                        reject(`Error getting access token: ${res.status} ${res.statusText}`);
                    }
                },
                onerror: () => reject('Network error while getting access token.')
            });
        } catch (e) {
            reject('Error signing JWT: ' + e);
        }
    });
}

/**
 * List spreadsheets accessible by the service account.
 * This uses the Drive v3 API to list files of type "spreadsheet".
 * Service account must have the 'drive.readonly' or similar scope.
 */
function listAccessibleSpreadsheets(accessToken) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.googleapis.com/drive/v3/files'
               + '?q=mimeType%3D%27application%2Fvnd.google-apps.spreadsheet%27'
               + '&fields=files(id%2Cname)',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            onload: (res) => {
                if (res.status === 200) {
                    const data = JSON.parse(res.responseText);
                    const files = data.files || [];
                    resolve(files);
                } else {
                    reject(`Error listing spreadsheets: ${res.status} ${res.statusText}`);
                }
            },
            onerror: () => reject('Network error while listing spreadsheets.')
        });
    });
}

/**
 * Gets the metadata of a particular spreadsheet (to find sheet IDs, names, etc).
 */
function getSpreadsheetMetadata(spreadsheetId, accessToken) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
            headers: { 'Authorization': `Bearer ${accessToken}` },
            onload: (res) => {
                if (res.status === 200) {
                    resolve(JSON.parse(res.responseText));
                } else {
                    reject(`Error fetching spreadsheet metadata: ${res.status} ${res.statusText}`);
                }
            },
            onerror: () => reject('Network error while fetching spreadsheet metadata.')
        });
    });
}

/**
 * Reads values from the given range in the spreadsheet.
 */
function readSheetValues(spreadsheetId, range, accessToken) {
    return new Promise((resolve, reject) => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { 'Authorization': `Bearer ${accessToken}` },
            onload: (res) => {
                if (res.status === 200) {
                    const obj = JSON.parse(res.responseText);
                    resolve(obj.values || []);
                } else {
                    reject(`Error reading data: ${res.status} ${res.statusText}`);
                }
            },
            onerror: () => reject('Network error while reading data.')
        });
    });
}

/**
 * Batch updates for cell formatting (repeatCell).
 */
function batchUpdateSpreadsheet(spreadsheetId, requests, accessToken) {
    return new Promise((resolve, reject) => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
        GM_xmlhttpRequest({
            method: 'POST',
            url,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ requests }),
            onload: (res) => {
                if (res.status === 200) {
                    resolve();
                } else {
                    reject(`Error updating spreadsheet: ${res.status} ${res.statusText}`);
                }
            },
            onerror: () => reject('Network error while updating spreadsheet.')
        });
    });
}

/**
 * Convert hex color (#RRGGBB) to Google Sheets color object: { red, green, blue }
 * Values must be in range 0..1
 */
function hexToRgbObject(hex) {
    if (!hex || !/^#([0-9A-Fa-f]{6})$/.test(hex)) {
        // default to black if not a valid color
        return { red: 0, green: 0, blue: 0 };
    }
    const stripped = hex.replace('#', '');
    const r = parseInt(stripped.substring(0, 2), 16) / 255;
    const g = parseInt(stripped.substring(2, 4), 16) / 255;
    const b = parseInt(stripped.substring(4, 6), 16) / 255;
    return { red: r, green: g, blue: b };
}

/**
 * Initialize the MonkeyConfig configuration UI.
 */
function initializeConfig(spreadsheetChoices) {
    if (configInitialized) return;

    // If we have a list of spreadsheets, create a select input.
    // Else, default to blank and let user type in manually if needed.
    const spreadsheetParam = spreadsheetChoices.length
        ? { type: 'select', choices: spreadsheetChoices, default: spreadsheetChoices[0], label: 'Spreadsheet' }
        : { type: 'text', default: '', label: 'Spreadsheet ID or name' };

    configInstance = new MonkeyConfig({
        title: 'Highlighter Config',
        menuCommand: true,
        params: {
            selectedSpreadsheet: spreadsheetParam,
            sheetName: { type: 'text', default: 'Sheet1', label: 'Sheet name to parse' },
            columnLetter: { type: 'select', choices: [
                'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
            ], default: 'A', label: 'Column (A-Z)' },
            stopRow: { type: 'number', default: 0, label: 'Row to stop (0 = until end)' },
            regexPattern: { type: 'text', default: 'foo', label: 'Regex pattern' },
            fontColor: { type: 'text', default: '#000000', label: 'Font color (#RRGGBB)' },
            bgColor: { type: 'text', default: '#FFFF00', label: 'Background color (#RRGGBB)' },
            bold: { type: 'checkbox', default: false, label: 'Bold?' },
            italic: { type: 'checkbox', default: false, label: 'Cursive/Italic?' }
        }
    });
    configInitialized = true;
}

/**
 * Main logic:
 * 1) read column
 * 2) test each cell with the regex
 * 3) if match, apply formatting
 */
async function highlightMatches() {
    const accessToken = window.SERVICE_ACCOUNT_ACCESS_TOKEN;
    const userSpreadsheet = configInstance.get('selectedSpreadsheet');
    const sheetName = configInstance.get('sheetName').trim();
    const columnLetter = configInstance.get('columnLetter');
    const stopRow = parseInt(configInstance.get('stopRow'), 10) || 0;
    const pattern = configInstance.get('regexPattern');
    const fontHex = configInstance.get('fontColor');
    const bgHex = configInstance.get('bgColor');
    const bold = configInstance.get('bold');
    const italic = configInstance.get('italic');

    // Attempt to figure out if "userSpreadsheet" is an ID or we must get it from the name.
    // For simplicity, we assume it's the actual ID if the user selected from the dropdown.
    // If you want advanced logic to match by name, you'd do an extra step here.
    const spreadsheetId = userSpreadsheet.match(/^[A-Za-z0-9-_]+$/)
        ? userSpreadsheet
        : userSpreadsheet; // If you have mapping logic from name -> ID, do it here

    // 1) We need the spreadsheet metadata to get the numeric sheetId.
    const metadata = await getSpreadsheetMetadata(spreadsheetId, accessToken);
    const sheet = (metadata.sheets || []).find(s => s.properties.title === sheetName);
    if (!sheet) {
        alert(`Sheet "${sheetName}" not found. Check config.`);
        return;
    }
    const sheetId = sheet.properties.sheetId;

    // 2) Determine the last row if stopRow = 0
    //    We'll read the entire column to find how many rows exist.
    const readRange = `${sheetName}!${columnLetter}2:${columnLetter}`; // start from row2
    const values = await readSheetValues(spreadsheetId, readRange, accessToken);

    if (!values || !values.length) {
        alert('No data found in the specified range.');
        return;
    }

    // Actually, 'values' is an array of arrays: [ [cellValue], [cellValue], ... ]
    // So the row index in the sheet starts from row 2 in this range.
    // The actual last row in the data is rowIndexInSheet = 2 + (values.length - 1).
    const actualLastRow = 2 + values.length - 1;

    // If user set a stopRow (non-zero), we clamp
    const finalLastRow = stopRow > 0 ? Math.min(stopRow, actualLastRow) : actualLastRow;

    // 3) Build requests for matched cells
    const regex = new RegExp(pattern);
    const requests = [];
    const textFormat = {
        foregroundColor: hexToRgbObject(fontHex),
        bold: bold,
        italic: italic
    };
    const backgroundColor = hexToRgbObject(bgHex);

    // We'll iterate from row = 2 up to finalLastRow
    // The array index i goes from 0..(values.length - 1).
    for (let i = 0; i < values.length; i++) {
        const rowNumber = 2 + i;  // because we started from row2
        if (rowNumber > finalLastRow) break;

        const cellValue = values[i][0] || '';
        // Test regex
        if (regex.test(cellValue)) {
            // If it matches, create a repeatCell request
            // rowNumber - 1 => zero-based index for the row
            const startRowIndex = rowNumber - 1;
            const endRowIndex = rowNumber;
            const startColumnIndex = columnLetterToNumber(columnLetter) - 1;
            const endColumnIndex = startColumnIndex + 1;

            requests.push({
                repeatCell: {
                    range: {
                        sheetId: sheetId,
                        startRowIndex,
                        endRowIndex,
                        startColumnIndex,
                        endColumnIndex
                    },
                    cell: {
                        userEnteredFormat: {
                            backgroundColor: backgroundColor,
                            textFormat: textFormat
                        }
                    },
                    fields: 'userEnteredFormat(backgroundColor,textFormat)'
                }
            });
        }
    }

    if (!requests.length) {
        alert('No matching cells found. Nothing to highlight.');
        return;
    }

    // 4) Apply formatting in a single batchUpdate
    await batchUpdateSpreadsheet(spreadsheetId, requests, accessToken);
    alert(`Formatting applied to ${requests.length} matching cell(s).`);
}

/**
 * This is the entry point when the user chooses "Run Highlighter" from the menu.
 */
async function main() {
    if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PRIVATE_KEY) {
        alert('Please fill in SERVICE_ACCOUNT_EMAIL and SERVICE_ACCOUNT_PRIVATE_KEY in the script first.');
        return;
    }

    try {
        alert('Highlighting script is running... You can close this alert, but don’t close the tab until done.');
        const accessToken = await getServiceAccountAccessToken();
        window.SERVICE_ACCOUNT_ACCESS_TOKEN = accessToken;

        await highlightMatches();
        console.log('Highlighting complete.');
    } catch (e) {
        console.error(e);
        alert('Error: ' + e);
    }
}

/**
 * On script load, we:
 * 1) get the service account token
 * 2) list accessible spreadsheets (optional, if you want a drop-down)
 * 3) initialize MonkeyConfig with that list
 * 4) register a menu command to run main()
 */
(async function initScript() {
    try {
        const accessToken = await getServiceAccountAccessToken();
        window.SERVICE_ACCOUNT_ACCESS_TOKEN = accessToken;

        // Optional: try listing spreadsheets so user can pick from them
        let files = [];
        try {
            files = await listAccessibleSpreadsheets(accessToken);
        } catch (err) {
            console.warn('Could not list spreadsheets automatically. User may input the ID manually.');
        }
        const spreadsheetChoices = files.map(f => `${f.id}`); // or f.name if you want to show name
        initializeConfig(spreadsheetChoices);

        GM_registerMenuCommand('Run Highlighter', main);
    } catch (err) {
        console.error('Error obtaining access token:', err);
    }
})();
