// ==UserScript==
// @name         ZeroGPT check reviews
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @author       GreatFireDragon
// @description  Process data in Google Sheets using ZeroGPT API and write back the results
// @match        https://docs.google.com/spreadsheets/*
// @require      https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/10.5.23/jsrsasign-all-min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.zerogpt.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      oauth2.googleapis.com
// @connect      sheets.googleapis.com
// @connect      api.zerogpt.com
// @downloadURL https://update.greasyfork.org/scripts/519470/ZeroGPT%20check%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/519470/ZeroGPT%20check%20reviews.meta.js
// ==/UserScript==

// Fill in these constants with your service account credentials and ZeroGPT API key
const SERVICE_ACCOUNT_EMAIL = 'batch-articles-ds@batch-articles-ds.iam.gserviceaccount.com';
const SERVICE_ACCOUNT_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmfeThbSJxHimY\nfR3c2YVIl2I/9JZINq12RaQiIavrdLorFfTxqzYJ1fk7akwqk4mc+qigipjdrrxs\nR81Of4tK9k1GKVDjGIYizHsln4fgQv56qHJU1rcd/hd2ILrt2bpHH7/RMpflpf34\nJq3Jw8CezXtKCFdxd+Oav4DroLTJluNjdFFv7b/S9zfkD26KGDL8jJ4m3UTDAm7L\nFCV1qIvG/+OLnXDbGW4dncN7G2PnnLTlS0OIxnTM19OGiHGtSyF12dqZ6BqiJAKy\nVsmBS71ljaM2sKVAQ8cgDnCN/5w5k7kGjFaKfrbaZBZUb18rAJPrhjoK/DRrHm15\nfbWkoA8nAgMBAAECggEADfEc6YOqDq7n7M0NYyET+DA1GgXxT7rEa9MJG5KWQvFT\nZahBCru7mrdAV6lfF3GjZHHZDRiOFII9ZRPeLWSg1XYqomVzUJENKnzVEyF4z17M\n0JiqelBApVJRxKKZBLHm123hMjN6ZNCxo8YZZ3vs9V9fo6NvLyFK/fprYU/j072c\nVX+7c/QTcylz7km9twurvTh0733t2x+f4nMvKztRJmfDSpHTQsbsZRIfnNc7Ws81\nySFChPvblthyHqqFV6t6QJx9tZD2qzbZ9OxBUmiXUxg40QrZrGHgjCNDkZFUOj4n\nBvFnypLh3eF1uaI4+icrf3qAVYuVcFWzjFWbIP4hgQKBgQDUt4lCfFbw4roBP2aC\nRjEuvXu1cx9/f/boSDdURYdNFD061uscx36XVY08CX3wwR4jXYCLtdkG1RAViQg4\nMRwi/JgboMiPrOxzPryEETosXRA+aDG8NxSRM+tzrsMKerDkpda5fNhuX4jNQ0OW\n9NnhGzVMoQpba6McxjiKVMOupQKBgQDIXnsPhqSkzg0dpwHs+ZNLe1M77FSoemST\nGjrITj3GdGWomNe/Vk1Bsn1HTjeQKbu97Diion1zEPfWSckuMARcsmlhlSxoDrV0\nCJWAdlLKtCw7Uy0OwzwKufP7J2eWbisqt6PCjwR9b4GN9e51iP1ipL9lky9IZTZ4\nKYOD0gqI2wKBgHlIuItfB9dK/tEtTA5lZS+IPFvl6wSweqBQZLO4/P821f6Rgfaj\nzIsO7XtY0iUOh1eUvXFrWvXpT8Vnn3cikS9lpHjEQPaimyLOl4AZrniTC2r5z7nI\nEgMEfnA0KeL0t5127SpPg7vS3tZiTsxoiT4vXEF35MbhZVxHrP86e2Q9AoGBALIT\n9n84BUBLuTBva7C3p4dgVftd8WfDT3vFxhScJR8p9+e935G4G/WVsu4awBsqXCdR\nuIwiqigIHpye+2RHXLkd/7awo8Tfvbkgn+6KOs7ZDq6zH8qNDeHinsrKnK//vfG7\nQJn8DduFrLkEqChh1gFDtq+J/m3zNlPZYX9Yv/AdAoGAecZuVUhb9gJ4Q3v6O5C3\nLYtGrST72aub7zwjSeCDoMXzeayspVeBs2PNAAoRnlbpbfH6Vb48sTRegL7MBEXd\nxtXGdZsT5R28t1BR39Pn17i5ft7uq5GwDkFUje/xMmmgvzoxG7ydldD1TZB4uiKw\njm7tPKlp6T2WKSNw94b63mM=\n-----END PRIVATE KEY-----\n';


/* ===========================   Global Variables   ============================ */
const ALL_DATA_FIELDS = [
    'sentences', 'isHuman', 'additional_feedback', 'h', 'hi',
    'textWords', 'aiWords', 'fakePercentage', 'specialIndexes',
    'specialSentences', 'originalParagraph', 'feedback',
    'input_text', 'detected_language'
];
const SPREADSHEET_ID = getSpreadsheetId();
let configInitialized = false;
let configInstance = null;

/* ===========================   Helper Functions   ============================ */
function getSpreadsheetId() {
    const match = window.location.href.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

function getNextColumn(column, steps = 1) {
    return columnNumberToLetter(columnLetterToNumber(column) + steps);
}

function columnLetterToNumber(letter) {
    return [...letter.toUpperCase()].reduce((sum, char) => sum * 26 + (char.charCodeAt(0) - 64), 0);
}

function columnNumberToLetter(number) {
    let column = '';
    while (number > 0) {
        const modulo = (number - 1) % 26;
        column = String.fromCharCode(65 + modulo) + column;
        number = Math.floor((number - modulo) / 26);
    }
    return column;
}

/* ===========================   Service Account Authentication   ============================ */
function getServiceAccountAccessToken() {
    return new Promise((resolve, reject) => {
        const now = Math.floor(Date.now() / 1000);
        const jwtHeader = { alg: 'RS256', typ: 'JWT' };
        const jwtClaimSet = {
            iss: SERVICE_ACCOUNT_EMAIL,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now
        };
        try {
            const sJWS = KJUR.jws.JWS.sign(null, JSON.stringify(jwtHeader), JSON.stringify(jwtClaimSet), SERVICE_ACCOUNT_PRIVATE_KEY);
            const formData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${encodeURIComponent(sJWS)}`;
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://oauth2.googleapis.com/token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: formData,
                onload: res => {
                    if (res.status === 200) {
                        const data = JSON.parse(res.responseText);
                        resolve(data.access_token);
                    } else {
                        reject(`Error getting access token: ${res.status} ${res.statusText}`);
                    }
                },
                onerror: () => reject('Network error while getting access token.')
            });
        } catch {
            reject('Error signing JWT.');
        }
    });
}

/* ===========================   Google Sheets API Functions   ============================ */
function readData(spreadsheetId, range) {
    return new Promise((resolve, reject) => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { 'Authorization': `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            onload: res => {
                if (res.status === 200) {
                    const data = JSON.parse(res.responseText).values || [];
                    resolve(data);
                } else {
                    reject(`Error reading data: ${res.status} ${res.statusText}`);
                }
            },
            onerror: () => reject('Network error while reading data.')
        });
    });
}

function writeData(spreadsheetId, range, values) {
    return new Promise((resolve, reject) => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;
        GM_xmlhttpRequest({
            method: 'PUT',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}`
            },
            data: JSON.stringify({ values }),
            onload: res => {
                if (res.status === 200) {
                    resolve();
                } else {
                    reject(`Error writing data: ${res.status} ${res.statusText}`);
                }
            },
            onerror: () => reject('Network error while writing data.')
        });
    });
}

function writeBatch(updates) {
    if (!updates.length) return Promise.resolve();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchUpdate`;
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}`
            },
            data: JSON.stringify({ valueInputOption: 'RAW', data: updates }),
            onload: res => {
                if (res.status === 200) {
                    resolve();
                } else {
                    reject(`Error writing data: ${res.status} ${res.statusText}`);
                }
            },
            onerror: () => reject('Network error while writing data.')
        });
    });
}

function getLastRow(sheetName, column) {
    const range = `${sheetName}!${column}:${column}`;
    return readData(SPREADSHEET_ID, range).then(values => values.length);
}

function getSheetNames() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { 'Authorization': `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            onload: res => {
                if (res.status === 200) {
                    const sheets = JSON.parse(res.responseText).sheets || [];
                    const sheetNames = sheets.map(sheet => sheet.properties.title);
                    resolve(sheetNames);
                } else {
                    reject(`Error fetching sheet names: ${res.status} ${res.statusText}`);
                }
            },
            onerror: () => reject('Network error while fetching sheet names.')
        });
    });
}

/* ===========================   Main Execution Functions   ============================ */
function readSheetData() {
    const sheetName = configInstance.get('sheetName');
    const dataColumn = configInstance.get('dataColumn');
    const startRow = parseInt(configInstance.get('startRow'), 10);
    const endRow = parseInt(configInstance.get('endRow'), 10) || null;
    const lastRowPromise = endRow ? Promise.resolve(endRow) : getLastRow(sheetName, dataColumn);

    return lastRowPromise.then(endRow => {
        const range = `${sheetName}!${dataColumn}${startRow}:${dataColumn}${endRow}`;
        return readData(SPREADSHEET_ID, range);
    });
}

function writeHeaders(dataFields) {
    const sheetName = configInstance.get('sheetName');
    const outputColumn = configInstance.get('outputColumn');
    const endCol = getNextColumn(outputColumn, dataFields.length - 1);
    const headerRange = `${sheetName}!${outputColumn}1:${endCol}1`;
    return writeData(SPREADSHEET_ID, headerRange, [dataFields]);
}

async function processRow(review, attempt = 1) {
    if (!review || !review.trim()) return { error: 'Empty review' };

    const MAX_RETRIES = 3;

    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.zerogpt.com/api/detect/detectText',
            headers: {
                'ApiKey': configInstance.get('ZERO_GPT_API_KEY'),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ input_text: review }),
            onload: res => {
                if (res.status >= 200 && res.status < 300) {
                    const resData = JSON.parse(res.responseText);
                    if (resData.success) {
                        const dataField = resData.data || {};

                        // Ensure isHuman and fakePercentage are numbers without special chars
                        ['isHuman', 'fakePercentage'].forEach(field => {
                            if (dataField[field]) {
                                let numStr = String(dataField[field]).replace(/[^\d.-]/g, '');
                                let num = parseFloat(numStr);
                                dataField[field] = isNaN(num) ? '' : num;
                            }
                        });

                        const result = ALL_DATA_FIELDS.map(field => {
                            if (field === 'isHuman' || field === 'fakePercentage') {
                                return dataField[field] !== undefined ? dataField[field] : '';
                            }
                            return Array.isArray(dataField[field]) ? dataField[field].join(', ') : String(dataField[field] || '');
                        });
                        resolve(result);
                    } else {
                        if (attempt < MAX_RETRIES) {
                            console.warn(`Attempt ${attempt} failed: ${resData.message}. Retrying in 2 seconds...`);
                            setTimeout(() => processRow(review, attempt + 1).then(resolve), 2000);
                        } else {
                            resolve({ error: resData.message || 'API error' });
                        }
                    }
                } else {
                    if (attempt < MAX_RETRIES) {
                        console.warn(`HTTP error ${res.status}. Retrying in 2 seconds...`);
                        setTimeout(() => processRow(review, attempt + 1).then(resolve), 2000);
                    } else {
                        resolve({ error: `HTTP ${res.status}: ${res.statusText}` });
                    }
                }
            },
            onerror: () => {
                if (attempt < MAX_RETRIES) {
                    console.warn(`Network error. Retrying in 2 seconds...`);
                    setTimeout(() => processRow(review, attempt + 1).then(resolve), 2000);
                } else {
                    resolve({ error: 'Network error' });
                }
            }
        });
    });
}

async function processData(values) {
    const batchSize = 50;
    const selectedFields = ALL_DATA_FIELDS.filter(field => configInstance.get(field));
    if (!selectedFields.length) return console.error('No data fields selected to write.');

    await writeHeaders(selectedFields);

    for (let i = 0; i < values.length; i += batchSize) {
        const batch = values.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(async (row, idx) => {
            const rowNum = parseInt(configInstance.get('startRow'), 10) + i + idx;
            const result = await processRow(row[0]);
            const range = `${configInstance.get('sheetName')}!${configInstance.get('outputColumn')}${rowNum}:${getNextColumn(configInstance.get('outputColumn'), selectedFields.length - 1)}${rowNum}`;
            const cellValues = result.error ? [[result.error]] : [selectedFields.map(field => result[ALL_DATA_FIELDS.indexOf(field)] || '')];
            return { range, values: cellValues };
        }));

        await writeBatch(results.filter(update => update.values[0].length > 0));
        console.log(`Processed batch ${i + 1} to ${i + batch.length}`);
    }
    alert('Скрипт завершил работу.');
}

function initializeConfig(sheetNames) {
    if (configInitialized) return;

    const sheetNameParam = sheetNames && sheetNames.length > 0 ?
          { type: 'select', choices: sheetNames, default: sheetNames[0], label: 'Sheet Name' } :
    { type: 'text', default: 'Sheet1', label: 'Sheet Name' };

    configInstance = new MonkeyConfig({
        title: 'ZeroGPT Google Sheets Integration Config',
        menuCommand: true,
        params: {
            ZERO_GPT_API_KEY: { type: 'text', default: '', label: 'ZeroGPT API Key' },
            sheetName: sheetNameParam,
            dataColumn: { type: 'text', default: 'H', label: 'Data Column (e.g., H)' },
            startRow: { type: 'number', default: 2, label: 'Start Row' },
            endRow: { type: 'number', default: '', label: 'End Row (leave blank for all)' },
            outputColumn: { type: 'text', default: 'O', label: 'Output Column (e.g., O)' },
            ...Object.fromEntries(ALL_DATA_FIELDS.map(field => [field, { label: field, type: 'checkbox', default: false }]))
        }
    });
    configInitialized = true;
}

function main() {
    if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PRIVATE_KEY) {
        alert('Please fill in SERVICE_ACCOUNT_EMAIL and SERVICE_ACCOUNT_PRIVATE_KEY in the script.');
        return;
    }

    alert('Скрипт в работе. Не закрывайте вкладку пока скрипт не закончит. З.Ы. Это уведомление можно закрыть ヾ(•ω•`)o');

    getServiceAccountAccessToken().then(token => {
        window.SERVICE_ACCOUNT_ACCESS_TOKEN = token;
            if (!configInstance.get('ZERO_GPT_API_KEY')) {
                alert('Please set ZERO_GPT_API_KEY in the configuration.');
                return;
            }
            readSheetData().then(values => {
                if (!values.length) return console.log('No data found.');
                processData(values).then(() => {
                    console.log('Processing complete.');
                }).catch(err => console.error('Error processing data:', err));
            }).catch(err => console.error('Error reading data:', err));
        }).catch(err => console.error('Error obtaining access token:', err));
}

/* ===========================   Menu Command Registration   ============================ */
getServiceAccountAccessToken().then(token => {
    window.SERVICE_ACCOUNT_ACCESS_TOKEN = token;
    getSheetNames()
        .then(sheetNames => { initializeConfig(sheetNames); })
        .catch(err => { console.error(err); initializeConfig([]); });
    GM_registerMenuCommand('Run ZeroGPT Processing', main);
}).catch(err => console.error('Error obtaining access token:', err));