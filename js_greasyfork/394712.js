// ==UserScript==
// @name         Yahoo!路線情報の検索結果をGoogleカレンダーに登録するユーザースクリプト
// @version      0.3
// @description  Yahoo!路線情報の検索結果を、Googleカレンダーに登録するリンクを作成するユーザースクリプトです。ルート全体を一つの予定として登録するのではなく、乗り換えごとに別々の予定として登録します。登録の際、列車名を予定のタイトル、列車の出発・到着時刻を予定の開始・終了時刻、出発駅を予定の場所、発着番線を予定の説明欄に記載します。徒歩は登録しません。深夜バスなど日を跨ぐルートにも対応しています。
// @author       fukuchan
// @include      https://transit.yahoo.co.jp/search/*
// @namespace https://greasyfork.org/users/432749
// @downloadURL https://update.greasyfork.org/scripts/394712/Yahoo%21%E8%B7%AF%E7%B7%9A%E6%83%85%E5%A0%B1%E3%81%AE%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%82%92Google%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E3%81%AB%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/394712/Yahoo%21%E8%B7%AF%E7%B7%9A%E6%83%85%E5%A0%B1%E3%81%AE%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%82%92Google%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E3%81%AB%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

const subscribe = event => {
    // ルート情報の親要素を取得
    const detail = event.target.closest("div[id*=route], section[id*=route]");

    // 時刻の各要素に年月日情報を追加する
    const searchTime = document.querySelector(".navSearchTime .time, .navSearchTime .date");
    const dateNumbers = searchTime.textContent.match(/(\d+)年(\d+)月(\d+)日/);
    const times = detail.querySelectorAll(".time li");
    let previousDate = new Date(dateNumbers[1], dateNumbers[2] - 1, dateNumbers[3]); // ひとつ前の時刻
    for (let time of times) {
        const timeNumbers = time.textContent.match(/(\d+):(\d+)/);
        const currentDate = new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate(), timeNumbers[1], timeNumbers[2]);

        // ひとつ前の時刻より巻き戻っているように見えたら、日を跨いでるので1日加算
        while (currentDate < previousDate) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
        previousDate = currentDate;

        time.dataset.date = currentDate.toISOString().replace(/(-|:|(\.\d+))/g, "");
    }

    // 各駅と、その駅間の要素を取得
    const stations = detail.querySelectorAll(".station");
    const accesses = detail.querySelectorAll(".access");
    for (let i = 0; i < accesses.length; i++) {
        const origin = stations[i]; // 出発駅の要素
        const destination = stations[i + 1]; // 到着駅の要素
        const access = accesses[i]; // 駅間の要素

        // 歩きの場合は飛ばす
        if (access.matches(".walk")) {
            continue;
        }

        // 出発駅
        const location = origin.querySelector("dl>dt>a").textContent;

        // 列車名
        const transport = access.querySelector(".transport div");
        const text = transport.textContent.replace(/(\n|\[.*\])/g, "");

        // 発着番線・短縮URL
        const platform = access.querySelector(".platform");
        const shortUrl = detail.querySelector(".shortUrl");
        const details = [platform?.textContent, shortUrl.value].filter(str => str).join("\n");

        // 出発・到着時刻
        const departureTime = origin.querySelector(".time li:last-child");
        const arrivalTime = destination.querySelector(".time li:first-child");
        const dates = departureTime.dataset.date + "/" + arrivalTime.dataset.date;

        // GoogleカレンダーのURL生成
        const url = new URL("https://www.google.com/calendar/event?action=TEMPLATE");
        url.searchParams.append("location", location);
        url.searchParams.append("text", text);
        url.searchParams.append("details", details);
        url.searchParams.append("dates", dates);

        // URLを開く
        window.open(url.href);
    }
}

// 「時刻なし」で検索している場合は何もしない
const type = new URLSearchParams(window.location.search).get("type");
if (type == 5) {
    return;
}

// 既存の「カレンダーに登録」ボタンを取得し、隣に新しいボタンを追加する処理を1秒おきに10回試行する
let i = 0;
const intervalId = setInterval(() => {
    i++;
    const calLinks = document.querySelectorAll(".shareCal, a[data-cl-params*='addcal']");

    if (i === 10 || calLinks.length > 0) {
        clearInterval(intervalId);
    }

    for (let yahooCalLink of calLinks) {
        // 「Googleカレンダーに登録」ボタンを作成
        const li = document.createElement("li");
        const icon = document.createElement("span");
        icon.className = "icnCal";
        const googleCalLink = document.createElement("a");

        // ボタンにイベントを設定
        googleCalLink.href = "javascript:void(0);";
        googleCalLink.addEventListener("click", subscribe);

        // ボタンの文言変更
        googleCalLink.textContent = "Googleカレンダーに登録";
        yahooCalLink.textContent = "Yahoo!カレンダーに登録";

        // ボタンをDOMに追加
        li.append(icon, googleCalLink);
        yahooCalLink.closest("ul").appendChild(li);
    }
}, 1000);
