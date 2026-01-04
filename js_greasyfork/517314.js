// ==UserScript==
// @name         Coolakov + Google Sheets
// @namespace    querygrouper
// @version      1.0.7
// @description  Парсит кулакова и достает топ-10 выдачи по каждому запросу. Парсит разбивку, что позволяет отправлять в 10 раз меньше реквестов чем по обычному most_pomoted.
// @author       GreatFireDragon
// @match        https://docs.google.com/spreadsheets/d/*
// @match        https://docs.google.com/spreadsheets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      googleapis.com
// @connect      coolakov.ru
// @require      https://update.greasyfork.org/scripts/38445/251319/MonkeyConfig.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/10.5.23/jsrsasign-all-min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517314/Coolakov%20%2B%20Google%20Sheets.user.js
// @updateURL https://update.greasyfork.org/scripts/517314/Coolakov%20%2B%20Google%20Sheets.meta.js
// ==/UserScript==

/* ===========================   Service Account Credentials   =========================== */
const SERVICE_ACCOUNT_EMAIL = 'batch-articles-ds@batch-articles-ds.iam.gserviceaccount.com';
const SERVICE_ACCOUNT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmfeThbSJxHimY\nfR3c2YVIl2I/9JZINq12RaQiIavrdLorFfTxqzYJ1fk7akwqk4mc+qigipjdrrxs\nR81Of4tK9k1GKVDjGIYizHsln4fgQv56qHJU1rcd/hd2ILrt2bpHH7/RMpflpf34\nJq3Jw8CezXtKCFdxd+Oav4DroLTJluNjdFFv7b/S9zfkD26KGDL8jJ4m3UTDAm7L\nFCV1qIvG/+OLnXDbGW4dncN7G2PnnLTlS0OIxnTM19OGiHGtSyF12dqZ6BqiJAKy\nVsmBS71ljaM2sKVAQ8cgDnCN/5w5k7kGjFaKfrbaZBZUb18rAJPrhjoK/DRrHm15\nfbWkoA8nAgMBAAECggEADfEc6YOqDq7n7M0NYyET+DA1GgXxT7rEa9MJG5KWQvFT\nZahBCru7mrdAV6lfF3GjZHHZDRiOFII9ZRPeLWSg1XYqomVzUJENKnzVEyF4z17M\n0JiqelBApVJRxKKZBLHm123hMjN6ZNCxo8YZZ3vs9V9fo6NvLyFK/fprYU/j072c\nVX+7c/QTcylz7km9twurvTh0733t2x+f4nMvKztRJmfDSpHTQsbsZRIfnNc7Ws81\nySFChPvblthyHqqFV6t6QJx9tZD2qzbZ9OxBUmiXUxg40QrZrGHgjCNDkZFUOj4n\nBvFnypLh3eF1uaI4+icrf3qAVYuVcFWzjFWbIP4hgQKBgQDUt4lCfFbw4roBP2aC\nRjEuvXu1cx9/f/boSDdURYdNFD061uscx36XVY08CX3wwR4jXYCLtdkG1RAViQg4\nMRwi/JgboMiPrOxzPryEETosXRA+aDG8NxSRM+tzrsMKerDkpda5fNhuX4jNQ0OW\n9NnhGzVMoQpba6McxjiKVMOupQKBgQDIXnsPhqSkzg0dpwHs+ZNLe1M77FSoemST\nGjrITj3GdGWomNe/Vk1Bsn1HTjeQKbu97Diion1zEPfWSckuMARcsmlhlSxoDrV0\nCJWAdlLKtCw7Uy0OwzwKufP7J2eWbisqt6PCjwR9b4GN9e51iP1ipL9lky9IZTZ4\nKYOD0gqI2wKBgHlIuItfB9dK/tEtTA5lZS+IPFvl6wSweqBQZLO4/P821f6Rgfaj\nzIsO7XtY0iUOh1eUvXFrWvXpT8Vnn3cikS9lpHjEQPaimyLOl4AZrniTC2r5z7nI\nEgMEfnA0KeL0t5127SpPg7vS3tZiTsxoiT4vXEF35MbhZVxHrP86e2Q9AoGBALIT\n9n84BUBLuTBva7C3p4dgVftd8WfDT3vFxhScJR8p9+e935G4G/WVsu4awBsqXCdR\nuIwiqigIHpye+2RHXLkd/7awo8Tfvbkgn+6KOs7ZDq6zH8qNDeHinsrKnK//vfG7\nQJn8DduFrLkEqChh1gFDtq+J/m3zNlPZYX9Yv/AdAoGAecZuVUhb9gJ4Q3v6O5C3\nLYtGrST72aub7zwjSeCDoMXzeayspVeBs2PNAAoRnlbpbfH6Vb48sTRegL7MBEXd\nxtXGdZsT5R28t1BR39Pn17i5ft7uq5GwDkFUje/xMmmgvzoxG7ydldD1TZB4uiKw\njm7tPKlp6T2WKSNw94b63mM=\n-----END PRIVATE KEY-----\n"

const BATCH_SIZE = 10;

function initializeConfig(sheetNames) {
    const columns = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    const sheets = sheetNames.length > 0 ? sheetNames : ['Sheet1'];
    window.cfg = new MonkeyConfig({
        title: 'Config', menuCommand: false, params: {
            sheetName: { type: 'select', choices: sheets, default: sheets[0], label: 'Лист (обновите страницу если нет нужного)' },
            dataColumn: { type: 'select', choices: columns, default: 'A', label: 'Ключевые фразы' },
            parallelBatches: { type: 'select', choices: ['1', '2', '3', '4', '5', '6'], default: '1', label: 'Распараллелить процесс (осторожно)' },
            region: { type: 'number', default: 213, label: 'Регион' }
        }, onSave: () => console.log('Configuration saved.')
    });
}

function showConfig() {
    const spreadsheetId = getSpreadsheetId();
    if (!spreadsheetId) return console.error('No Spreadsheet ID.');
    getSheetNames(spreadsheetId)
        .then(sheetNames => { initializeConfig(sheetNames); window.cfg.open(); })
        .catch(e => { console.error(e); initializeConfig([]); window.cfg.open(); });
}

getServiceAccountAccessToken().then(token => {
    window.SERVICE_ACCOUNT_ACCESS_TOKEN = token;
    const spreadsheetId = getSpreadsheetId();
    if (spreadsheetId) {
        getSheetNames(spreadsheetId)
            .then(sheetNames => { initializeConfig(sheetNames); })
            .catch(e => { console.error(e); initializeConfig([]); });
    } else {
        console.error('No Spreadsheet ID');
    }
    GM_registerMenuCommand('Config', showConfig);
    GM_registerMenuCommand('Run', main);
}).catch(e => console.error('Error obtaining access token:', e));

function main() {
    const spreadsheetId = getSpreadsheetId();
    if (!spreadsheetId) return console.error('No Spreadsheet ID found.');
    const sheetName = cfg.get('sheetName').trim(), dataColumn = cfg.get('dataColumn').toUpperCase(), startRow = 2, parallelBatches = parseInt(cfg.get('parallelBatches'), 10) || 1;

    getLastRow(spreadsheetId, sheetName, dataColumn).then(actualEndRow => {
        const outputColumn = getNextColumn(dataColumn);
        const dataRange = `${sheetName}!${dataColumn}${startRow}:${dataColumn}${actualEndRow}`;
        const linksRange = `${sheetName}!${outputColumn}${startRow}:${outputColumn}${actualEndRow}`;

        writeDataWithRetry(spreadsheetId, `${sheetName}!${outputColumn}1`, [['Собираю...']])
            .then(() => Promise.all([readData(spreadsheetId, dataRange), readData(spreadsheetId, linksRange)]))
            .then(([queries, links]) => processBatches(queries, links, startRow, outputColumn, sheetName, spreadsheetId, parallelBatches))
            .catch(e => console.error('Error processing data:', e));
    });
}

function getSpreadsheetId() { return window.location.href.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1] || null; }
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function getLastRow(spreadsheetId, sheetName, column) { return readData(spreadsheetId, `${sheetName}!${column}:${column}`).then(values => values.length); }
function columnLetterToNumber(letter) { return [...letter].reduce((n, c) => n * 26 + (c.charCodeAt(0) - 64), 0); }
function columnNumberToLetter(number) { return number > 0 ? columnNumberToLetter(Math.floor((number - 1) / 26)) + String.fromCharCode(((number - 1) % 26) + 65) : ''; }
function getNextColumn(col, steps = 1) { return columnNumberToLetter(columnLetterToNumber(col) + steps); }


function readData(spreadsheetId, range) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET', url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
            headers: { Authorization: `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            onload: r => r.status === 200 ? resolve(JSON.parse(r.responseText).values || []) : reject(`Error reading: ${r.status} ${r.statusText}`),
            onerror: () => reject('Network error.')
        });
    });
}


const RETRY_DELAY_SEC = 5;
function writeDataWithRetry(spreadsheetId, range, values, attempt = 1) {
    const MAX_ATTEMPTS = 2;
    return writeData(spreadsheetId, range, values).catch(async error => {
        if (error.startsWith('Error writing: 400') && attempt < MAX_ATTEMPTS) {
            console.warn(`Write error 400. Attempting to insert new column. ${attempt}/${MAX_ATTEMPTS}`);
            const sheetName = range.split('!')[0], columnLetter = range.match(/!([A-Z]+)\d+/)[1];
            const newColumn = getNextColumn(columnLetter);
            await insertColumn(spreadsheetId, sheetName, newColumn);
            return writeDataWithRetry(spreadsheetId, range, values, attempt + 1);
        } else if (error.startsWith('Error writing: 429') && attempt < MAX_ATTEMPTS) {
            console.warn(`Write error 429. Waiting ${RETRY_DELAY_SEC}s. Attempt ${attempt}/${MAX_ATTEMPTS}`);
            await sleep(RETRY_DELAY_SEC * 1000);
            return writeDataWithRetry(spreadsheetId, range, values, attempt + 1);
        } else throw error;
    });
}

function writeData(spreadsheetId, range, values) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'PUT', url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            data: JSON.stringify({ values }),
            onload: r => r.status === 200 ? resolve() : reject(`Error writing: ${r.status} ${r.statusText}`),
            onerror: () => reject('Network error.')
        });
    });
}

function insertColumn(spreadsheetId, sheetName, columnLetter) {
    return getSheetId(spreadsheetId, sheetName).then(sheetId => {
        const columnNumber = columnLetterToNumber(columnLetter);
        const requests = [{ insertDimension: { range: { sheetId, dimension: 'COLUMNS', startIndex: columnNumber - 1, endIndex: columnNumber }, inheritFromBefore: false } }];
        return batchUpdate(spreadsheetId, requests);
    });
}

function getSheetId(spreadsheetId, sheetName) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET', url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`,
            headers: { Authorization: `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            onload: r => {
                if (r.status === 200) {
                    const res = JSON.parse(r.responseText);
                    const sheet = res.sheets.find(s => s.properties.title === sheetName);
                    sheet ? resolve(sheet.properties.sheetId) : reject(`Sheet "${sheetName}" not found.`);
                } else reject(`Error fetching sheet ID: ${r.status}`);
            },
            onerror: () => reject('Network error fetching sheet ID.')
        });
    });
}

function batchUpdate(spreadsheetId, requests) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST', url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            data: JSON.stringify({ requests }),
            onload: r => r.status === 200 ? resolve() : reject(`Batch update error: ${r.status}`),
            onerror: () => reject('Network error during batch update.')
        });
    });
}


function getSheetNames(spreadsheetId) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET', url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(title))`,
            headers: { Authorization: `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            onload: r => {
                if (r.status === 200) {
                    const res = JSON.parse(r.responseText);
                    resolve(res.sheets.map(s => s.properties.title));
                } else reject(`Error getting sheet names: ${r.status}`);
            },
            onerror: () => reject('Network error getting sheet names.')
        });
    });
}

function getServiceAccountAccessToken() {
    return new Promise((resolve, reject) => {
        const now = Math.floor(Date.now() / 1000);
        const sHeader = JSON.stringify({ alg: 'RS256', typ: 'JWT' });
        const sClaim = JSON.stringify({ iss: SERVICE_ACCOUNT_EMAIL, scope: 'https://www.googleapis.com/auth/spreadsheets', aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now });
        try {
            const sJWS = KJUR.jws.JWS.sign(null, sHeader, sClaim, SERVICE_ACCOUNT_PRIVATE_KEY);
            GM_xmlhttpRequest({
                method: 'POST', url: 'https://oauth2.googleapis.com/token', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${encodeURIComponent(sJWS)}`,
                onload: r => r.status === 200 ? resolve(JSON.parse(r.responseText).access_token) : reject(`Error token: ${r.status}`),
                onerror: () => reject('Network error token.')
            });
        } catch (e) { reject('Error signing JWT.'); }
    });
}

function getLinksBatch(inputTexts, attempt = 1) {
    const MAX_RETRIES = 2, RETRY_DELAY = 1500, regionValue = parseInt(window.cfg.get('region'), 10) || 213;
    let queries = [...inputTexts], dummy = false;
    if (queries.length === 1) { queries.push(queries[0] + 'q'); dummy = true; }

    const formData = new FormData();
    formData.append('myurl', 'handler.php');
    formData.append('delay', '3000');
    formData.append('idquery', Date.now().toString());
    formData.append('regions', regionValue.toString());
    formData.append('keys', queries.join('\n'));
    formData.append('stage', '15');
    formData.append('table_type', '1');
    formData.append('deep', '20');

    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: 'POST', url: 'https://coolakov.ru/tools/razbivka/handler.php', data: formData, responseType: 'text',
            onload: r => {
                if (r.status !== 200) {
                    return attempt < MAX_RETRIES ? setTimeout(() => getLinksBatch(inputTexts, attempt + 1).then(resolve), RETRY_DELAY) : resolve([]);
                }
                try {
                    const data = parseResponse(r.responseText);
                    resolve(dummy ? data.filter(d => d.query !== inputTexts[0] + 'q') : data);
                } catch (e) {
                    console.error('Error parsing response:', e);
                    attempt < MAX_RETRIES ? setTimeout(() => getLinksBatch(inputTexts, attempt + 1).then(resolve), RETRY_DELAY) : resolve([]);
                }
            },
            onerror: () => attempt < MAX_RETRIES ? setTimeout(() => getLinksBatch(inputTexts, attempt + 1).then(resolve), RETRY_DELAY) : resolve([])
        });
    });
}

function parseResponse(responseText) {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    return [...doc.querySelectorAll('#myTable tbody tr')]
        .map(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return null;
            const queryElement = cells[1].querySelector('.wMax40vw');
            if (!queryElement) return null;
            const query = queryElement.textContent.trim();
            if (!query) return null;
            const competitors = [...cells[3].querySelectorAll('a')].map(a => a.href.replace(/\s/g, '+'));
            return { query, competitors };
        })
        .filter(Boolean);
}

async function processBatches(queries, links, startRow, outputColumn, sheetName, spreadsheetId, parallelBatches) {
    const toFetch = queries.map((q, i) => ({ query: q[0] || '', row: startRow + i })).filter((item, i) => (links[i] || []).length === 0 || links[i].every(cell => !cell || !cell.trim()));
    const totalToFetch = toFetch.length, batches = [];
    for (let i = 0; i < toFetch.length; i += BATCH_SIZE) batches.push(toFetch.slice(i, i + BATCH_SIZE));

    let processed = 0, index = 0;
    while (index < batches.length) {
        const promises = [];
        for (let i = 0; i < parallelBatches && index + i < batches.length; i++) {
            promises.push(processBatch(batches[index + i], outputColumn, sheetName, spreadsheetId, count => {
                processed += count;
                const percent = ((processed / totalToFetch) * 100).toFixed(2);
                writeDataWithRetry(spreadsheetId, `${sheetName}!${outputColumn}1`, [[`...${percent}%`]]).catch(e => console.error('Error updating header:', e));
            }));
        }
        await Promise.all(promises);
        index += parallelBatches;
    }
}

async function processBatch(batch, outputColumn, sheetName, spreadsheetId, updateProgress) {
    const batchQueries = batch.map(b => b.query), batchRows = batch.map(b => b.row);
    let dummy = false;
    if (batchQueries.length === 1) { batchQueries.push(batchQueries[0] + 'q'); dummy = true; }
    try {
        const results = await getLinksBatch(batchQueries);
        if (results.length === 0) console.warn('NO LINKS', results);

        const map = new Map(results.map(r => [r.query, r.competitors]));
        const dataToWrite = batch.map((b, i) => (dummy && i === 1 ? [''] : [(map.get(batchQueries[i]) || []).join(';')]));
        const range = `${sheetName}!${outputColumn}${batchRows[0]}:${outputColumn}${batchRows[batch.length - 1]}`;
        await writeDataWithRetry(spreadsheetId, range, dataToWrite);

        if (updateProgress) updateProgress(dataToWrite.length);
    } catch (e) {
        console.error(`Error processing batch rows ${batchRows.join(', ')}: ${e}`);
    }
}