// ==UserScript==
// @name         あぷにアップ
// @description  書き込み欄にあぷ/あぷ小へのアップロードボタンを追加します。
// @version      1.0.2
// @match        *://*.2chan.net/*
// @icon         https://www.2chan.net/favicon.ico
// @namespace    https://greasyfork.org/users/809755
// @grant        GM_xmlhttpRequest
// @connect      2chan.net
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/438685/%E3%81%82%E3%81%B7%E3%81%AB%E3%82%A2%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/438685/%E3%81%82%E3%81%B7%E3%81%AB%E3%82%A2%E3%83%83%E3%83%97.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function () {
    'use strict';
    /*
    setup(); // ふたクロのクリップボードからアップロード機能がONだとバグるっぽいので保留
    /*/
    setTimeout(setup, 2000); // Firefox + 赤福sp で競合しないようにちょっと待つ
    //*/
})();

function setup() {
    const tbody = document.querySelector('#ftbl tbody') || document.querySelector('#akahuku_posttable tbody');
    if (!tbody) {
        return;
    }
    var tr = document.createElement('tr');
    tr.innerHTML = '<td class="ftdc"><b>あぷ</b></td><td><label style="font-size:10px;"><input type="file" id="upup" size="35"><br>ファイル選択後に「OK」を押すとアップロードが始まります</label></td>';
    tbody.appendChild(tr);
    document.querySelector('#upup').addEventListener('change', upload);
}

function upload() {
    const files = document.querySelector('#upup');
    if (!files.files[0]) {
        return;
    }

    const file = files.files[0];
    const filename = file.name;
    const filesize = file.size;
    const pass = document.getElementsByName('pwd')[0].value.slice(0, 10) || '5463';

    const MAX_FILE_SIZE_UP = 10000000;
    const MAX_FILE_SIZE_UP2 = 3000000;
    const SERVER_INFO = {
        "up": { "name": "あぷ", "limit": MAX_FILE_SIZE_UP },
        "up2": { "name": "あぷ小", "limit": MAX_FILE_SIZE_UP2 },
    };

    const server = filesize <= MAX_FILE_SIZE_UP2 ? "up2" : (filesize <= MAX_FILE_SIZE_UP ? "up" : "tooBig");

    if (server === "tooBig") {
        clear();
        alert(`${filesize} バイトの ${filename} はアップロードできません。
${MAX_FILE_SIZE_UP} バイトがファイルサイズの上限です。`);
        return;
    }

    if (!window.confirm(`${filename} を ${SERVER_INFO[server]['name']} にアップロードします\n削除キー:${pass}`)) {
        clear();
        alert(`${filename} のアップロードを中止しました`);
        return;
    }

    const formdata = new FormData();
    const com = uuidv4();

    formdata.set('up', file);
    formdata.set('MAX_FILE_SIZE', SERVER_INFO[server]['limit']);
    formdata.set('mode', 'reg');
    formdata.set('com', com);
    formdata.set('pass', pass);
    GM_xmlhttpRequest({
        method: "POST",
        url: `https://dec.2chan.net/${server}/up.php`,
        data: formdata,
        headers: {
            "Origin": "https://dec.2chan.net",
            "Referer": `https://dec.2chan.net/${server}/up.htm`,
        },
        onload: async function (response) {
            const errorText = response.responseText.match(/<font color=red size=5><b>([^<]+?)</);
            if (errorText) {
                alert(`アップロードに失敗しました。エラー内容: ${errorText[1]}`);
                clear();
                return;
            }
            const uploaded = await getFilename(com, server);
            // console.log(`filename: ${filename}`);
            if (uploaded === "not found") {
                alert('エラー: アップロードされたファイルが見つかりませんでした');
            } else if (uploaded !== "error") {
                const textarea = document.querySelector('#ftxa');
                textarea.value = (textarea.value.trim() === "" ? "" : `${textarea.value.trim()}\n`) + uploaded;
            } else {
                alert('エラー: 想定されていないエラーが発生しました');
            }
            clear();
        },
        onerror: function (error) {
            alert('エラー: 想定されていないエラーが発生しました');
        }
    });
}

function getFilename(key, server) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://dec.2chan.net/${server}/up.htm`,
            onload: function (response) {
                const res = response.responseText;
                const reg = new RegExp(`>([^>]+?)</a></td><td class="fco">${key}`);
                const found = res.match(reg);
                // console.log(found);
                if (found) {
                    resolve(found[1]);
                }
                reject("not found");
            },
            onerror: function (error) {
                reject("error");
            }
        });
    });
}

function clear() {
    document.querySelector('#upup').value = '';
}

// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid/2117523#2117523
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}