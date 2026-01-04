// ==UserScript==
// @name         Web漫画アンテナ 既読対応
// @namespace
// @description マイリストのページで既読漫画の背景色を変えます
// @version      0.17
// @author       kiyo
// @match        https://webcomics.jp/mylist
// @match        https://webcomics.jp/mylist*
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/397210/Web%E6%BC%AB%E7%94%BB%E3%82%A2%E3%83%B3%E3%83%86%E3%83%8A%20%E6%97%A2%E8%AA%AD%E5%AF%BE%E5%BF%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/397210/Web%E6%BC%AB%E7%94%BB%E3%82%A2%E3%83%B3%E3%83%86%E3%83%8A%20%E6%97%A2%E8%AA%AD%E5%AF%BE%E5%BF%9C.meta.js
// ==/UserScript==

(function() {
    const myStorage = JSON.parse(localStorage._supportRead || "{}");
    const readColor= "#c5c5c6";
    const nowDate = new Date();

    const timeToMsec = (num, unit) => {
        // サイト内の時間表示が切り上げなので-1しておく(24時に更新した作品が時間により日付が前後してしまうのを回避)
        num = num - 1;
        switch (unit) {
            case "時間前":
                return num * 60 * 60 * 1000;
            case "分前":
                return num * 60 * 1000;
            case "秒前":
                return num * 1000;
            default:
                console.error(`timeToMsec Error: ${num}${unit}`);
        }
    }
    const dateToStr = (year, month, day) => `${year}${("0"+month).slice(-2)}${("0"+day).slice(-2)}`;
    const calcAgoDate = (nowDate, num, unit) => {
        let ago = timeToMsec(parseInt(num), unit);
        //console.log(ago, num, unit);
        const agoDate = new Date(nowDate - ago);
        const year = agoDate.getFullYear();
        const month = agoDate.getMonth() + 1;
        const day = agoDate.getDate();
        return dateToStr(year, month, day);
    }

    const e = {
        entry: document.querySelectorAll(".entry"),
        thumb: document.querySelectorAll(".entry > .entry-thumb > a > img"),
        date: document.querySelectorAll(".entry > .entry-date"),
        title: document.querySelectorAll(".entry > .entry-title > [href]")
    };

    //function test(){console.log(this.i +","+ this.mangaId +","+ this.date);};
    function handleEvent(){
        const {i, mangaId, date} = this;
        e.entry[i].style.background = readColor;
        // 重複チェック＆追加
        if (!(mangaId in myStorage)) {
            myStorage[mangaId] = [date];
        } else if (!(myStorage[mangaId].some(val => val === date))) {
            myStorage[mangaId].push(date);
        }
        // 10MB(10485760文字)以上になったら先頭から削除
        if (JSON.stringify(myStorage).length > 10485760) myStorage[mangaId].shift();
        // localStorageに入れる
        localStorage._supportRead = JSON.stringify(myStorage);
    }

    for (let i = 0, len = e.entry.length; i < len; i++) {
        const mangaId = e.thumb[i].src.split("/").slice(-1)[0].replace(".jpg", "");
        // 24時間以内の更新だと表記が変わる
        const dateText = e.date[i].textContent;
        const date = /^\d+時間前|^\d+分前|^\d+秒前/.test(dateText)
        ? calcAgoDate(nowDate, dateText.match(/^\d+/)[0], dateText.match(/時間前|分前|秒前/)[0]) : dateText.replace(/\//g, "");
        if (mangaId in myStorage && myStorage[mangaId].some(val => val === date)) e.entry[i].style.background = readColor;

        e.title[i].addEventListener("click", {i, mangaId, date, handleEvent});
        e.title[i].addEventListener("auxclick", {i, mangaId, date, handleEvent});
        if (e.entry[i].querySelector(".entry-text > [href]")) {
            e.entry[i].querySelector(".entry-text > [href]").addEventListener("click", {i, mangaId, date, handleEvent});
            e.entry[i].querySelector(".entry-text > [href]").addEventListener("auxclick", {i, mangaId, date, handleEvent});
        }
    }
})();