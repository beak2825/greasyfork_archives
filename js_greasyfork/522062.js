// ==UserScript==
// @name         dr_RoomuserView Googleクローム対応版
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  デュラチャ　ユーザー情報拡張表示
// @author       You
// @match        https://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/522062/dr_RoomuserView%20Google%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%A0%E5%AF%BE%E5%BF%9C%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/522062/dr_RoomuserView%20Google%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%A0%E5%AF%BE%E5%BF%9C%E7%89%88.meta.js
// ==/UserScript==

class RoomuserView {
    constructor() {
        this.json = null;
        this.tsv = '';
    }

    ui() {
        // 元々のチャット画面を左寄せにして、右側にスペースを作る
        const eDivBody = document.querySelector('#body');
        eDivBody.style.margin = 0;
        eDivBody.style.marginLeft = '10px';

        // 情報表示画面作成

        // コンテナ用要素
        const body2 = $('<div></div>', {
            id: 'body2',
            css: {
                position: 'absolute',
                top: 120,
                left: 620,
                width: 800,
                height: 3000,
                border: 'solid #222 1px'
            }
        }).appendTo(document.body);

        // 更新ボタン
        const btnUpdateUsers = $('<button></button>', {
            id: 'btnUpdateUsers',
            text: 'ユーザーリスト更新',
            css: {
                width: 150
            }
        }).on('click', () => {
            console.log('json取得中...');
            this.send();
        }).appendTo(body2);

        // 保存ボタン
        const saveUserList = $('<a></a>', {
            id: 'aSaveUserList',
            text: 'saveUserList'
        }).on('click', () => {
            console.log('save?');
            this.userListSave();
        }).appendTo(body2);

        // ユーザーリストを表示する要素
        $(body2).append('<ul id="userList"></ul>');
    }

    send() {
        $('#btnUpdateUsers').text('更新中...');
        $.ajax({
            type: 'POST',
            url: 'https://drrrkari.com/ajax.php',
            dataType: 'json',
            timeout: 12000,
            context: this,
            success: this.success,
            error: function (e) {
                console.log('ERROR!', e);
                $('#btnUpdateUsers').text('更新失敗 :p');
            }
        });
    }

    success(json, status, xhr) {
        $('#btnUpdateUsers').text('ユーザーリスト更新');
        this.json = json;
        this.displayUserlist(json);
    }

    displayUserlist(json) {
        console.log('json取得完了', json.talks);
        $('#userList').empty();

        // 入室者数分繰り返す
        for (const key in json.users) {
            const userJson = json.users[key];

            // 表示用データの作成
            const iconUrl = `https://drrrkari.com/css/icon_${userJson.icon}.png`;
            userJson.trip = userJson.trip === undefined ? '' : userJson.trip;
            userJson.encip = !userJson.encip ? 'host: ' + json.hostip : userJson.encip;

            const date = this.toDateString(userJson.update, '/');
            const time = this.toTimeString(userJson.update, ':');
            const update = date + ' ' + time;

            // 入室者の情報を表示する
            $('#userList').append(`
                <li class="userBox" style="overflow:hidden; line-height:1.2; margin-top:10px">
                    <img src="${iconUrl}" width="30px" style="float:left; margin:5px;">
                    <div class="userParam" style="float:left">
                        <p class="userName" style="color:lime; display:inline-block; width:250px;">${userJson.name}</p>
                        <p class="userTrip" style="color:cyan; display:inline-block; width:100px">${userJson.trip}</p>
                        <p class="userUpdate">${update}</p>
                        <p class="userEncip" style="color:yellow; width:500px;">${userJson.encip}</p>
                        <p class="userId">${userJson.id}</p>
                    </div>
                </li>
            `);

            // 保存時のデータを作成
            this.tsv +=
                userJson.icon + '\t' +
                userJson.name + '\t' +
                userJson.trip + '\t' +
                userJson.id + '\t' +
                userJson.encip + '\n';
        }
    }

    userListSave() {
        const date = this.toDateString(this.json.update, '-');
        const time = this.toTimeString(this.json.update, null);
        const filename = 'userlist_' + date + '_' + time + '_' + this.json.name + '.txt';

        const data = this.tsv;

        const blob = new Blob([data], { "type": "text/plain" });
        const a = document.getElementById('aSaveUserList');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);

        console.log('save', filename);
    }

    toDateString(unixtime, separator) {
        const t = new Date(unixtime * 1000);
        const y = t.getFullYear();
        const m = ('00' + (t.getMonth() + 1)).slice(-2);
        const d = ('00' + t.getDate()).slice(-2);
        return separator === null ? y + m + d : y + separator + m + separator + d;
    }

    toTimeString(unixtime, separator) {
        const t = new Date(unixtime * 1000);
        const h = ('00' + t.getHours()).slice(-2);
        const m = ('00' + t.getMinutes()).slice(-2);
        const s = ('00' + t.getSeconds()).slice(-2);
        return separator === null ? h + m + s : h + separator + m + separator + s;
    }
}

const ruv = new RoomuserView();
ruv.ui();
ruv.send();
setInterval(() => ruv.send(), 20000);
