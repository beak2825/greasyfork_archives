// ==UserScript==
// @name         我只是想看圖
// @namespace    -
// @version      0.2.2
// @description  我只是想看 None 發的色圖，爲什麼推文預覽要這麼久？我不能。
// @author       LianSheng
// @include      https://kater.me/*
// @exclude      https://kater.me/api/*
// @exclude      https://kater.me/assets/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/406433/%E6%88%91%E5%8F%AA%E6%98%AF%E6%83%B3%E7%9C%8B%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406433/%E6%88%91%E5%8F%AA%E6%98%AF%E6%83%B3%E7%9C%8B%E5%9C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css = `twitter-area{display:block;padding:12px;border-radius:8px;background-color:#fffd;color:#000}.twitter-avatar{width:60px}.twitter-avatar img{width:49px;border-radius:50%}.twitter-user{user-select:none}.twitter-time,.twitter-username{padding-left:4px;opacity:.8}.twitter-content img{margin-top:8px;border-radius:8px}`;
    GM_addStyle(css);

    WaitForLoaded();

    function WaitForLoaded() {
        if (app && app.forum) {
            let PageChecker = new MutationObserver(mr => {
                let records = Object.values(mr);
                if (records.length > 1 && !(records.length == 6 && records.some(x => x.target.classList.contains("Scrubber-description"))))
                    parseData();
            });
            PageChecker.observe(document.querySelector(".App-content"), {
                "childList": true,
                "subtree": true
            });
        } else {
            setTimeout(() => WaitForLoaded(), 100);
        }
    }

    // v0.2: 提前刪除 iframe，終止原生請求。
    //       用 twitter-* 避免樣式衝突。
    //       增加推文基本資訊以及解析失敗時附上貼文連結。
    function parseData(){
        if(document.querySelectorAll("twitter-area").length == 0) {
            document.querySelectorAll("iframe[data-s9e-mediaembed=twitter]").forEach(each=>{
                let src = each.getAttribute("src");
                let id = src.match(/(\d+)$/)[1];
                let tweetData = `https://syndication.twitter.com/tweet?id=${id}`;
                each.insertAdjacentHTML("beforebegin", `<twitter-area id="tweet${id}"></twitter-area>`);
                let area = document.querySelector(`twitter-area#tweet${id}`);

                setTimeout(() => {
                    each.remove();
                }, 100);

                fetch(`https://simple-cors-anywhere.herokuapp.com/${tweetData}`).then(
                    r => r.json()
                ).then( j => {
                    let agoTime = j.created_at;
                    let agoText = timeFormat(agoTime);
                    let avatar = j.user.profile_image_url_https;
                    let name = j.user.name;
                    let username = j.user.screen_name;
                    let text = j.text.replace(/\n/g, "<br>");

                    j.entities.media.forEach(media=>{
                        text = text.replace(media.url, "");
                    });

                    let imgs = "";
                    j.photos.forEach(photo=>{
                        imgs += `<img src="${photo.url}"></img>`;
                    });

                    area.innerHTML = `
<table>
<tr>
<td class="twitter-avatar">
<img src="${avatar}"></img>
</td>
<td class="twitter-user">
<div>
<b>${name}</b>
<span class="twitter-username">@${username}</span>
<span> · </span>
<span class="twitter-time">${agoText}</span>
</div>
<div>
<span><a href="${src}">原始內嵌推文連結</a></span>
</div>
</td>
</tr>
<tr>
<td>
</td>
<td class="twitter-content">
${text}
${imgs}
</td>
</tr>
</table>
`;
                }).catch( e => {
                    area.innerHTML = `讀取錯誤！<a href="${src}">原始內嵌推文連結</a>`;
                });
            });
        }
    }

    function timeFormat(dateString) {
        let dateObj = new Date(dateString);
        let seconds = parseInt((Date.now() - dateObj.getTime()) / 1000);
        if (seconds >= 86400) {
            return dateObj.toString("M 月 d 日");
        } else if (seconds >= 3600) {
            return parseInt(seconds / 3600) + " 小時";
        } else if (seconds >= 60) {
            return parseInt(seconds / 60) + " 分鐘";
        } else {
            return seconds + " 秒前";
        }
    }
})();