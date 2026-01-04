// ==UserScript==
// @name         Query Grouper for Google Sheets
// @namespace    querygrouper
// @version      1.1.4
// @description  Группировка запросов по URL и дополнительные сравнения.
// @author       GreatFireDragon
// @match        https://docs.google.com/spreadsheets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      googleapis.com
// @require      https://update.greasyfork.org/scripts/38445/251319/MonkeyConfig.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/10.5.23/jsrsasign-all-min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517315/Query%20Grouper%20for%20Google%20Sheets.user.js
// @updateURL https://update.greasyfork.org/scripts/517315/Query%20Grouper%20for%20Google%20Sheets.meta.js
// ==/UserScript==

/* ===========================   Service Account Credentials   =========================== */
const SERVICE_ACCOUNT_EMAIL = 'batch-articles-ds@batch-articles-ds.iam.gserviceaccount.com';
const SERVICE_ACCOUNT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmfeThbSJxHimY\nfR3c2YVIl2I/9JZINq12RaQiIavrdLorFfTxqzYJ1fk7akwqk4mc+qigipjdrrxs\nR81Of4tK9k1GKVDjGIYizHsln4fgQv56qHJU1rcd/hd2ILrt2bpHH7/RMpflpf34\nJq3Jw8CezXtKCFdxd+Oav4DroLTJluNjdFFv7b/S9zfkD26KGDL8jJ4m3UTDAm7L\nFCV1qIvG/+OLnXDbGW4dncN7G2PnnLTlS0OIxnTM19OGiHGtSyF12dqZ6BqiJAKy\nVsmBS71ljaM2sKVAQ8cgDnCN/5w5k7kGjFaKfrbaZBZUb18rAJPrhjoK/DRrHm15\nfbWkoA8nAgMBAAECggEADfEc6YOqDq7n7M0NYyET+DA1GgXxT7rEa9MJG5KWQvFT\nZahBCru7mrdAV6lfF3GjZHHZDRiOFII9ZRPeLWSg1XYqomVzUJENKnzVEyF4z17M\n0JiqelBApVJRxKKZBLHm123hMjN6ZNCxo8YZZ3vs9V9fo6NvLyFK/fprYU/j072c\nVX+7c/QTcylz7km9twurvTh0733t2x+f4nMvKztRJmfDSpHTQsbsZRIfnNc7Ws81\nySFChPvblthyHqqFV6t6QJx9tZD2qzbZ9OxBUmiXUxg40QrZrGHgjCNDkZFUOj4n\nBvFnypLh3eF1uaI4+icrf3qAVYuVcFWzjFWbIP4hgQKBgQDUt4lCfFbw4roBP2aC\nRjEuvXu1cx9/f/boSDdURYdNFD061uscx36XVY08CX3wwR4jXYCLtdkG1RAViQg4\nMRwi/JgboMiPrOxzPryEETosXRA+aDG8NxSRM+tzrsMKerDkpda5fNhuX4jNQ0OW\n9NnhGzVMoQpba6McxjiKVMOupQKBgQDIXnsPhqSkzg0dpwHs+ZNLe1M77FSoemST\nGjrITj3GdGWomNe/Vk1Bsn1HTjeQKbu97Diion1zEPfWSckuMARcsmlhlSxoDrV0\nCJWAdlLKtCw7Uy0OwzwKufP7J2eWbisqt6PCjwR9b4GN9e51iP1ipL9lky9IZTZ4\nKYOD0gqI2wKBgHlIuItfB9dK/tEtTA5lZS+IPFvl6wSweqBQZLO4/P821f6Rgfaj\nzIsO7XtY0iUOh1eUvXFrWvXpT8Vnn3cikS9lpHjEQPaimyLOl4AZrniTC2r5z7nI\nEgMEfnA0KeL0t5127SpPg7vS3tZiTsxoiT4vXEF35MbhZVxHrP86e2Q9AoGBALIT\n9n84BUBLuTBva7C3p4dgVftd8WfDT3vFxhScJR8p9+e935G4G/WVsu4awBsqXCdR\nuIwiqigIHpye+2RHXLkd/7awo8Tfvbkgn+6KOs7ZDq6zH8qNDeHinsrKnK//vfG7\nQJn8DduFrLkEqChh1gFDtq+J/m3zNlPZYX9Yv/AdAoGAecZuVUhb9gJ4Q3v6O5C3\nLYtGrST72aub7zwjSeCDoMXzeayspVeBs2PNAAoRnlbpbfH6Vb48sTRegL7MBEXd\nxtXGdZsT5R28t1BR39Pn17i5ft7uq5GwDkFUje/xMmmgvzoxG7ydldD1TZB4uiKw\njm7tPKlp6T2WKSNw94b63mM=\n-----END PRIVATE KEY-----\n"

const DEFAULT_OVERLAP_THRESHOLD = 4;
const START_ROW = 2;
const SPRTR = ";";

function initializeConfig(sheetNames) {
    const columns = Array.from({ length: 13 }, (_, i) => String.fromCharCode(65 + i));
    window.cfg = new MonkeyConfig({
        title: 'Config',
        menuCommand: false,
        params: {
            sheetName: { type: 'select', choices: sheetNames, default: sheetNames[0] || 'Sheet1', label: 'Лист' },
            queryColumn: { type: 'select', choices: columns, default: 'A', label: 'Ключевые фразы' },
            urlsColumn: { type: 'select', choices: columns, default: 'B', label: 'Собранные ТОП-N URL' },
            frequencyColumn: { type: 'select', choices: ['None', ...columns], default: 'C', label: 'Частота WS' },
            grp1Column: { type: 'select', choices: ['None', ...columns], default: 'None', label: 'Группы grp1' },
            compareColumn: { type: 'select', choices: ['None', ...columns], default: 'D', label: 'Сравнить со столбцом' },
            overlapThreshold: { type: 'select', default: DEFAULT_OVERLAP_THRESHOLD, choices: ['1','2','3','4','5','6','7','8','9','10'], label: 'Порог пересечения' }
        }
    });
}

function showConfig() {
    const spreadsheetId = getSpreadsheetId();
    if (!spreadsheetId) return;
    getSheetNames(spreadsheetId)
        .then(sheetNames => { initializeConfig(sheetNames); window.cfg.open(); })
        .catch(() => { initializeConfig([]); window.cfg.open(); });
}

getServiceAccountAccessToken().then(token => {
    window.SERVICE_ACCOUNT_ACCESS_TOKEN = token;
    const spreadsheetId = getSpreadsheetId();
    if (spreadsheetId) {
        getSheetNames(spreadsheetId)
            .then(sheetNames => { initializeConfig(sheetNames); })
            .catch(() => { initializeConfig([]); });
    } else {
        console.error('No Spreadsheet ID');
    }
    GM_registerMenuCommand('Config', showConfig);
    GM_registerMenuCommand('Сгруппировать', () => runQueryGrouper(main));
    GM_registerMenuCommand('Сравнить grp1', () => runQueryGrouper(mainWithGrp1));
    GM_registerMenuCommand('Сравнить два столбца', () => runQueryGrouper(mainCompare));
}).catch(e => console.error('Error obtaining access token:', e));

function runQueryGrouper(fn) { getDataAndProcess(fn); }

function getDataAndProcess(fn) {
    const spreadsheetId = getSpreadsheetId();
    if (!spreadsheetId) { console.error('No Spreadsheet ID'); return; }
    fn(spreadsheetId);
}

function main(spreadsheetId) {
    const c = getConfig();
    getLastRow(spreadsheetId, c.sheetName, c.queryColumn).then(end => {
        Promise.all([
            readData(spreadsheetId, getRange(c.sheetName, c.queryColumn, START_ROW, end)),
            readData(spreadsheetId, getRange(c.sheetName, c.urlsColumn, START_ROW, end)),
            readData(spreadsheetId, getRange(c.sheetName, c.frequencyColumn, START_ROW, end))
        ]).then(([queries, urls, freq]) => {
            findEmptyColumns(spreadsheetId, c.sheetName, [c.queryColumn, c.urlsColumn, c.frequencyColumn], end, 3).then(outCol => {
                writeHeaders(spreadsheetId, c.sheetName, outCol, ['Главный кластер', 'Подкластер', 'Пересечений']).then(() => {
                    const groups = groupQueries(queries, urls, freq, c.overlapThreshold);
                    const gd = prepareGroupData(groups);
                    writeGroupsToSheet(spreadsheetId, gd, c.sheetName, outCol).then(() => console.log('Data processing complete.'));
                });
            });
        }).catch(err => console.error('Error processing data:', err));
    });
}

function mainWithGrp1(spreadsheetId) {
    const c = getConfig();
    if (c.grp1Column === 'None') { alert('Установите "Группы grp1" в конфиге.'); return; }
    getLastRow(spreadsheetId, c.sheetName, c.queryColumn).then(end => {
        Promise.all([
            readData(spreadsheetId, getRange(c.sheetName, c.queryColumn, START_ROW, end)),
            readData(spreadsheetId, getRange(c.sheetName, c.urlsColumn, START_ROW, end)),
            c.grp1Column !== 'None' ? readData(spreadsheetId, getRange(c.sheetName, c.grp1Column, START_ROW, end)) : Promise.resolve([]),
            c.frequencyColumn !== 'None' ? readData(spreadsheetId, getRange(c.sheetName, c.frequencyColumn, START_ROW, end)) : Promise.resolve([])
        ]).then(([queries, urls, grp1s, freq]) => {
            const used = [c.queryColumn, c.urlsColumn];
            if (c.frequencyColumn !== 'None') used.push(c.frequencyColumn);
            if (c.grp1Column !== 'None') used.push(c.grp1Column);
            findEmptyColumns(spreadsheetId, c.sheetName, used, end, 2).then(outCol => {
                writeHeaders(spreadsheetId, c.sheetName, outCol, ['Ключ','Пересечений']).then(() => {
                    const res = processDataWithGrp1({ queries, urls, grp1s, freq }, c.overlapThreshold);
                    writeDataWithOverlap(spreadsheetId, res, c.sheetName, outCol).then(() => console.log('Data processing complete.'));
                });
            });
        }).catch(err => console.error('Error processing data:', err));
    });
}

function mainCompare(spreadsheetId) {
    const c = getConfig();
    getLastRow(spreadsheetId, c.sheetName, c.urlsColumn).then(end => {
        Promise.all([
            readData(spreadsheetId, getRange(c.sheetName, c.urlsColumn, START_ROW, end)),
            readData(spreadsheetId, getRange(c.sheetName, c.compareColumn, START_ROW, end))
        ]).then(([urls, cmp]) => {
            findEmptyColumns(spreadsheetId, c.sheetName, [c.urlsColumn, c.compareColumn], end, 1).then(outCol => {
                writeHeaders(spreadsheetId, c.sheetName, outCol, ['Пересечений']).then(() => {
                    const cr = compareTwoColumns(urls, cmp, c.overlapThreshold);
                    writeCompareDataToSheet(spreadsheetId, cr, c.sheetName, outCol).then(() => console.log('Data processing complete.'));
                });
            });
        }).catch(err => console.error('Error processing data:', err));
    });
}

function getConfig() {
    return {
        sheetName: cfg.get('sheetName').trim(),
        queryColumn: cfg.get('queryColumn').toUpperCase(),
        urlsColumn: cfg.get('urlsColumn').toUpperCase(),
        frequencyColumn: cfg.get('frequencyColumn') !== 'None' ? cfg.get('frequencyColumn').toUpperCase() : 'None',
        grp1Column: cfg.get('grp1Column') !== 'None' ? cfg.get('grp1Column').toUpperCase() : 'None',
        compareColumn: cfg.get('compareColumn').toUpperCase(),
        overlapThreshold: parseInt(cfg.get('overlapThreshold'), 10)
    };
}

function getSpreadsheetId() {
    const match = window.location.href.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

function findEmptyColumns(spreadsheetId, sheetName, columns, actualEndRow, numColsNeeded) {
    const maxColNum = Math.max(...columns.filter(c => c && c !== 'None').map(c => columnToNumber(c)));
    let colNum = isFinite(maxColNum) ? (maxColNum + 1) : 1;
    const MAX_COL = 702;
    return new Promise((resolve, reject) => {
        function checkNext() {
            if (colNum + numColsNeeded - 1 > MAX_COL) return createEmptyColumns();
            const colLetters = Array.from({ length: numColsNeeded }, (_, i) => numberToColumn(colNum + i));
            const ranges = colLetters.map(col => getRange(sheetName, col, START_ROW, actualEndRow));
            Promise.all(ranges.map(range => readData(spreadsheetId, range))).then(data => {
                const isEmpty = data.every(colData => !colData || colData.every(row => !row || (row[0] || '').trim() === ''));
                if (isEmpty) resolve(colLetters[0]); else { colNum++; checkNext(); }
            }).catch(() => createEmptyColumns());
        }
        function createEmptyColumns() {
            if (colNum + numColsNeeded - 1 > MAX_COL) return reject('No empty columns available');
            const colLetters = Array.from({ length: numColsNeeded }, (_, i) => numberToColumn(colNum + i));
            const range = `${sheetName}!${colLetters[0]}${START_ROW}:${colLetters[colLetters.length - 1]}${actualEndRow}`;
            writeData(spreadsheetId, range, Array.from({ length: actualEndRow - START_ROW + 1 }, () => Array(numColsNeeded).fill('')))
                .then(() => { resolve(colLetters[0]); })
                .catch(() => reject('Unable to create columns'));
        }
        checkNext();
    });
}

function writeHeaders(spreadsheetId, sheet, startCol, headers) {
    const startColNum = columnToNumber(startCol);
    const endCol = numberToColumn(startColNum + headers.length - 1);
    const range = `${sheet}!${startCol}1:${endCol}1`;
    return writeData(spreadsheetId, range, [headers]);
}

function readData(spreadsheetId, range) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
            headers: { 'Authorization': `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            onload: r => r.status === 200 ? resolve(JSON.parse(r.responseText).values || []) : reject(`Read error: ${r.status}`),
            onerror: () => reject('Network error reading data')
        });
    });
}

function writeData(spreadsheetId, range, values) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'PUT',
            url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            data: JSON.stringify({ values }),
            onload: r => r.status === 200 ? resolve() : reject(`Write error: ${r.status}`),
            onerror: () => reject('Network error writing data')
        });
    });
}

function getLastRow(spreadsheetId, sheet, column) {
    const range = sheet ? `${sheet}!${column}:${column}` : `${column}:${column}`;
    return readData(spreadsheetId, range).then(values => values.length + START_ROW - 1);
}

function getSheetNames(spreadsheetId) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(title))`,
            headers: { 'Authorization': `Bearer ${window.SERVICE_ACCOUNT_ACCESS_TOKEN}` },
            onload: r => {
                if (r.status === 200) {
                    const res = JSON.parse(r.responseText);
                    resolve(res.sheets.map(s => s.properties.title));
                } else reject(`Sheets error: ${r.status}`);
            },
            onerror: () => reject('Network error getting sheets')
        });
    });
}

function getServiceAccountAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    const jwtHeader = { alg: 'RS256', typ: 'JWT' };
    const jwtClaim = { iss: SERVICE_ACCOUNT_EMAIL, scope: 'https://www.googleapis.com/auth/spreadsheets', aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now };
    const sJWS = KJUR.jws.JWS.sign(null, JSON.stringify(jwtHeader), JSON.stringify(jwtClaim), SERVICE_ACCOUNT_PRIVATE_KEY);
    const formData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${encodeURIComponent(sJWS)}`;
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: formData,
            onload: r => r.status === 200 ? resolve(JSON.parse(r.responseText).access_token) : reject(`Token error: ${r.status}`),
            onerror: () => reject('Network error token')
        });
    });
}


function columnToNumber(col) { return [...col].reduce((num, c) => num * 26 + (c.charCodeAt(0) - 64), 0); }
function numberToColumn(num) { return num ? numberToColumn(Math.floor((num - 1) / 26)) + String.fromCharCode((num - 1) % 26 + 65) : ''; }
function getRange(sheet, column, start, end) { return sheet ? `${sheet}!${column}${start}:${column}${end}` : `${column}${start}:${column}${end}`; }
function normalizeUrl(url) { return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/\/$/, '').toLowerCase(); }
function countOverlap(urls1, urls2) { const s = new Set(urls1); return urls2.reduce((c, u) => c + (s.has(u) ? 1 : 0), 0); }
function prepareGroupData(groups) {return groups.flatMap(g => g.members.map((m, i) => [g.main, m, g.overlaps[i]])); } // Flatten groups into rows for writing

function groupQueries(queries, urls, frequencies, threshold) {
    const norm = urls.map(r => r[0] ? r[0].split(SPRTR).map(normalizeUrl) : []); // Normalize URLs
    const data = queries.map((q, i) => ({ phrase: q[0]?.trim() || '', freq: parseInt(frequencies[i]?.[0] || 0, 10), urls: norm[i] })).filter(q => q.phrase); // Prepare data
    data.sort((a, b) => b.freq - a.freq); // Sort by frequency
    const groups = [], seen = new Set(); // To store groups and track seen queries
    data.forEach((cur, i) => {
        if (seen.has(cur.phrase)) return; // Skip if already processed
        const g = { main: cur.phrase, members: [cur.phrase], overlaps: [''] }; // Add main query and empty overlap for it
        data.slice(i + 1).forEach(other => {
            if (seen.has(other.phrase)) return; // Skip seen queries
            const ov = countOverlap(cur.urls, other.urls); // Count overlaps
            if (ov >= threshold) {
                g.members.push(other.phrase); g.overlaps.push(ov); // Add overlapping query and overlap
                seen.add(other.phrase); // Mark as seen
            }
        });
        if (g.members.length) groups.push(g); // Add group if it has members
        seen.add(cur.phrase); // Mark main query as seen
    });
    return groups; // Return the final grouped queries
}


function writeGroupsToSheet(spreadsheetId, groupData, sheet, outCol) {
    if (!groupData.length) return Promise.resolve(); // Exit if no data
    const endRow = START_ROW + groupData.length - 1;
    const mainNum = columnToNumber(outCol), memberCol = numberToColumn(mainNum + 1), overlapCol = numberToColumn(mainNum + 2);
    return writeData(spreadsheetId, `${sheet}!${outCol}${START_ROW}:${overlapCol}${endRow}`, groupData); // Write data to sheet
}

function processDataWithGrp1(d, threshold) {
    const { queries, urls, grp1s, freq } = d;
    const norm = urls.map(r => r[0] ? r[0].split(SPRTR).map(normalizeUrl) : []); // Normalize URLs
    const arr = queries.map((q, i) => ({ index: i, query: q[0]?.trim() || '', freq: freq[i]?.[0] ? parseInt(freq[i][0], 10) : 0, urls: norm[i], grp1: grp1s[i]?.[0]?.trim() || '' })).filter(o => o.query); // Prepare data
    const grpMap = {}; // Map to store groups based on grp1
    arr.forEach(o => { if (o.grp1) { grpMap[o.grp1] = grpMap[o.grp1] || []; grpMap[o.grp1].push(o); } });
    const out = Array(queries.length).fill(['', '']); // Initialize output array
    for (const group of Object.values(grpMap)) {
        if (group.length < 2) { group.forEach(g => { out[g.index] = ['', '']; }); continue; } // Skip groups with only one member
        group.sort((a, b) => b.freq - a.freq); // Sort by frequency
        const main = group[0]; // Main query is the one with highest frequency
        group.forEach((obj, i) => {
            if (i === 0) { out[obj.index] = [main.query, '-']; return; } // Set main query and no overlap
            const ov = countOverlap(main.urls, obj.urls); // Count overlap with main query
            if (ov >= threshold) { out[obj.index] = [main.query, ov]; } else { out[obj.index] = [obj.query, ov]; } // Set overlap or no overlap
        });
    }
    return out;
}

function writeDataWithOverlap(spreadsheetId, values, sheet, col) {
    if (!values.length) return Promise.resolve(); // Exit if no data
    const endRow = START_ROW + values.length - 1;
    const mainNum = columnToNumber(col), overlapCol = numberToColumn(mainNum + 1);
    return writeData(spreadsheetId, `${sheet}!${col}${START_ROW}:${overlapCol}${endRow}`, values); // Write data with overlap
}

function compareTwoColumns(urls, compareUrls, threshold) {
    const u = urls.map(r => r[0] ? r[0].split(SPRTR).map(normalizeUrl) : []); // Normalize URLs
    const c = compareUrls.map(r => r[0] ? r[0].split(SPRTR).map(normalizeUrl) : []); // Normalize compare URLs
    return u.map((uu, i) => countOverlap(uu, c[i]) >= threshold ? countOverlap(uu, c[i]) : countOverlap(uu, c[i])); // Compare and count overlaps
}

function writeCompareDataToSheet(spreadsheetId, compareData, sheet, outCol) {
    if (!compareData.length) return Promise.resolve(); // Exit if no data
    const endRow = START_ROW + compareData.length - 1;
    return writeData(spreadsheetId, `${sheet}!${outCol}${START_ROW}:${outCol}${endRow}`, compareData); // Write comparison data to sheet
}
