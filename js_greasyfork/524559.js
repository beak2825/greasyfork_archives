// ==UserScript==
// @name         dr_RoomuserView2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  デュラチャ　ユーザー情報拡張表示
// @author       You
// @match        http://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @downloadURL https://update.greasyfork.org/scripts/524559/dr_RoomuserView2.user.js
// @updateURL https://update.greasyfork.org/scripts/524559/dr_RoomuserView2.meta.js
// ==/UserScript==

class RoomuserView{
    constructor(){
        this.json = null;
        this.tsv = '';
    }

    ui(){
        // 元々のチャット画面を左寄せにして、右側にスペースを作る
        var eDivBody = document.querySelector('#body');
        eDivBody.style.margin = 0;
        eDivBody.style.marginLeft = '10px';

        // 情報表示画面作成

        // コンテナ用要素
        var body2 = $('<div></div>', {
            id: 'body2',
            css:{
                position: 'absolute', top: 140, left: 620,
                width: 800, height: 3000,
                border: 'solid #222 1px'
            }
        }).appendTo(document.body);

        // ユーザーリストを表示する要素
        $(body2).append('<ul id="userList"></ul>');
    }

    send(){
        $.ajax({
            type: 'POST',
            url: 'http://drrrkari.com/ajax.php',
            dataType: 'json',
            timeout: 12000,
            context: this,
            success: this.success,
            error: function(e){
                console.log('ERROR!', e);
            }
        });
    }

    success(json, status, xhr){
        this.json = json;
        this.displayUserlist(json);
    }

    displayUserlist(json){
        console.log('json取得完了', json.talks);
        $('#userList').empty();

        // 入室者数分繰り返す
        for(var key in json.users){
            var userJson = json.users[key];

            // 表示用データの作成
            var iconUrl = `http://drrrkari.com/css/icon_${userJson.icon}.png`;
            userJson.trip = (userJson.trip === undefined)? '': userJson.trip;
            userJson.encip = (!userJson.encip)? 'host: '+json.hostip: userJson.encip;

            var date = this.toDateString(userJson.update, '/');
            var time = this.toTimeString(userJson.update, ':');
            var update = date + ' ' + time;

            // 入室者の情報を表示する
            $('#userList').append(`
                <li class="userBox" style="overflow:hidden; line-height:1.2; margin-top:10px">
                    <img src="${iconUrl}" width="30px" style="float:left; margin:5px;">
                    <div class="userParam" style="float:left">
                        <p class="userName" style="color:lime; display:inline-block; width:250px;">${userJson.name}</p>
                        <p class="userTrip" style="color:cyan; display:inline-block; width:100px;">${userJson.trip}</p>
                        <p class="userUpdate">${update}</p>
                        <p class="userEncip" style="color:yellow; width:500px;">${userJson.encip}</p>
                        <p class="userId">${userJson.id}</p>
                    </div>
                </li>
            `);

            // 保存時のデータを作成
            this.tsv +=
                userJson.icon +'\t'+
                userJson.name +'\t'+
                userJson.trip +'\t'+
                userJson.id +'\t'+
                userJson.encip +'\n';
        }
    }

    // unixtimeの年月日部分を読める形式で返す
    toDateString(unixtime, separator){
        var t = new Date(unixtime * 1000);
        var y = t.getFullYear();
        var m = ('00' + (t.getMonth() + 1)).slice(-2);
        var d = ('00' + t.getDate()).slice(-2);
        if(separator === null){
            return y + m + d; // yyyyddmm 区切り記号無し
        } else {
            return y + separator + m + separator + d;
        }
    }

    // unixtimeの時刻部分を読める形式で返す
    toTimeString(unixtime, separator){
        var t = new Date(unixtime * 1000);
        var h = ('00' + t.getHours()).slice(-2);
        var m = ('00' + t.getMinutes()).slice(-2);
        var s = ('00' + t.getSeconds()).slice(-2);
        if(separator === null){
            return h + m + s; // hhmmss 区切り記号無し
        } else {
            return h + separator + m + separator + s;
        }
    }
}

const ruv = new RoomuserView();
ruv.ui();

// イベントリスナーでユーザー入室、退室、切断を監視
$(document).on('DOMNodeInserted', '#talks', function(){
    var newContent = $(this).find('.talk.system').last().text();
    if(newContent.includes('が入室しました') || newContent.includes('が退室しました') || newContent.includes('接続が切れました')){
        ruv.send();
    }
});

// 初回読み込み時にリストを更新
$(document).ready(function() {
    ruv.send();
});