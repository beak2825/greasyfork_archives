// ==UserScript==
// @name         デュララチャット　自動挨拶（バージョン1.9）
// @namespace    https://greasyfork.org/ja/users/735907-cauliflower-carrot/durara-chat-auto-greeting
// @version      1.9
// @description  デュラチャで使えるかもしれないbot
// @author       aoi
// @match        http://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501301/%E3%83%87%E3%83%A5%E3%83%A9%E3%83%A9%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E3%80%80%E8%87%AA%E5%8B%95%E6%8C%A8%E6%8B%B6%EF%BC%88%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B319%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/501301/%E3%83%87%E3%83%A5%E3%83%A9%E3%83%A9%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E3%80%80%E8%87%AA%E5%8B%95%E6%8C%A8%E6%8B%B6%EF%BC%88%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B319%EF%BC%89.meta.js
// ==/UserScript==

var mainSwitch = 1;
document.dyurachaJSbot = 1;

var whitelist = []; // ホワイトリスト
var blockname = []; // 禁止ハンネ
var bannedwords = []; // NGワード（全て半角）

var version = "dyurachaJSbot v1.9";
var siteUrl = 'http://drrrkari.com';
var botstart = new Date().getTime();
var lastId;
var userGreetingTimestamps = {}; // ユーザーごとの挨拶時刻を記録

var data = JSON.parse('{"textProcess":{"input":["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん","が","ぎ","ぐ","げ","ご","じ","ず","ぜ","ぞ","だ","で","ど","ば","び","ぶ","べ","ぼ","ぁ","ぃ","ぅ","ぇ","ぉ","ゃ","ゅ","ょ","ぱ","ぴ","ぷ","ぺ","ぽ","ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン","ガ","ギ","グ","ゲ","ゴ","ジ","ズ","ゼ","ゾ","ダ","デ","ド","バ","ビ","ブ","ベ","ボ","ァ","ィ","ゥ","ェ","ォ","ャ","ュ","ョ","パ","ピ","プ","ペ","ポ","0","１","２","３","４","５","６","７","８","９","／","？"],"output":["ｱ","ｲ","ｳ","ｴ","ｵ","ｶ","ｷ","ｸ","ｹ","ｺ","ｻ","ｼ","ｽ","ｾ","ｿ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾊ","ﾋ","ﾌ","ﾍ","ﾎ","ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ｦ","ﾝ","ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ﾀﾞ","ﾃﾞ","ﾄﾞ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ｧ","ｨ","ｩ","ｪ","ｫ","ｬ","ｭ","ｮ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ","ｱ","ｲ","ｳ","ｴ","ｵ","ｶ","ｷ","ｸ","ｹ","ｺ","ｻ","ｼ","ｽ","ｾ","ｿ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾊ","ﾋ","ﾌ","ﾍ","ﾎ","ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ｦ","ﾝ","ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ﾀﾞ","ﾃﾞ","ﾄﾞ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ｧ","ｩ","ｪ","ｫ","ｬ","ｭ","ｮ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ","0","1","2","3","4","5","6","7","8","9","/","?"]}}');

function log(msg) {
    console.log(msg);
}

function checkhelper(input) {
    for (let i = 0; i < data.textProcess.input.length; i++) {
        input = input.replaceAll(data.textProcess.input[i], data.textProcess.output[i]);
    }
    return input;
}

function getGreetingText() {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 4 && hours < 12) {
        return "おはよう %hn プログラムに興味有るけど英語が難しいと思う人向け なでしこ日本語ベースプログラム言語https://nadeshikolinuxos.web.fc2.com";
    } else if (hours >= 12 && hours < 18) {
        return "こんにちは %hn プログラムに興味有るけど英語が難しいと思う人向け なでしこ日本語ベースプログラム言語https://nadeshikolinuxos.web.fc2.com";
    } else {
        return "こんばんは %hn プログラムに興味有るけど英語が難しいと思う人向け なでしこ日本語ベースプログラム言語https://nadeshikolinuxos.web.fc2.com";
    }
}

function sendGreeting(userName) {
    const greetingMessage = getGreetingText().replace('%hn', userName);
    document.getElementsByName('message')[0].value = greetingMessage;
    document.getElementsByName('post')[1].click();
    console.log("Sent greeting:", greetingMessage); // デバッグ用
}

function getdata() {
    try {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let resp = xmlhttp.responseText.replaceAll('\'', '\'').replaceAll('\'', '\'');
                roomDataObj = JSON.parse(resp);
                talks = roomDataObj.talks;
                users = roomDataObj.users;
            }
        };
        xmlhttp.open('POST', siteUrl + '/ajax.php', true);
        xmlhttp.send();
    } catch (error) {
        console.warn('Unable to fetch data from server');
    }
}

function kickMember(name) {
    $.post(siteUrl + '/room/', { 'ban_user': name });
}

function checkMembers() {
    for (let i = 0; i < 5000; i++) {
        if (i >= users.length) break;
        for (let j = 0; j < blockname.length; j++) {
            if (users[i].name.includes(blockname[j])) {
                kickMember(users[i].id);
                log(users[i].name + ' is kicked\nreason: banned handle name');
                return 1;
            }
        }
    }
    return 0;
}

function main() {
    if (document.dyurachaJSbot === 0) return;

    getdata(); // Fetch data from chat server
    if (!talks || talks.length === 0) return;

    if (lastId === talks[talks.length - 1].id) return;
    lastId = talks[talks.length - 1].id;

    if (talks[talks.length - 1].uid === '0') {
        if (talks[talks.length - 1].type === 'enter') {
            let currentTime = new Date().getTime();
            let userName = talks[talks.length - 1].name;

            if (whitelist.includes(userName)) return;

            // Check if the user has re-entered within 1 minute
            if (userGreetingTimestamps[userName] && (currentTime - userGreetingTimestamps[userName] < 60000)) {
                console.log(`${userName} is re-entering too quickly. Waiting 1 minute before sending a greeting.`);
                return;
            }

            sendGreeting(userName);
            userGreetingTimestamps[userName] = currentTime; // Record the time of greeting
            return;
        }
    }

    for (let i = 0; i < bannedwords.length; i++) {
        if (checkhelper(talks[talks.length - 1].message).includes(bannedwords[i])) {
            kickMember(talks[talks.length - 1].uid);
        }
    }

    if (talks.length >= 3 &&
        talks[talks.length - 1].uid === talks[talks.length - 2].uid &&
        talks[talks.length - 2].uid === talks[talks.length - 3].uid &&
        talks[talks.length - 1].time - talks[talks.length - 2].time <= 0.5 &&
        talks[talks.length - 2].time - talks[talks.length - 3].time <= 0.5) {
        kickMember(talks[talks.length - 1].uid);
    }
}

var running = false;
if (!running) {
    window.setInterval(main, 2000);
    running = true; // To avoid double run
} else {
    console.error('The bot is already running');
    alert('The bot is not started since it is already running');
}
