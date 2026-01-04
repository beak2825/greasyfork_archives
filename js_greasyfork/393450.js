// ==UserScript==
// @name         TwitterBlockReasonReminder
// @namespace    https://fazerog02.github.io
// @version      1.0.0
// @description  twitterでブロックした理由を書き残せる何か
// @author       fazerog02
// @match        https://twitter.com/settings/blocked/all
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/393450/TwitterBlockReasonReminder.user.js
// @updateURL https://update.greasyfork.org/scripts/393450/TwitterBlockReasonReminder.meta.js
// ==/UserScript==

function init(){
    // ブロックされたユーザーのアカウント情報の要素を取得
    let blocked_user_panels = document.querySelector("div[aria-label='タイムライン: ブロックしているアカウント']").children[0].children[0].children;

    // なぜか最後に空のパネルがあるので一回少なく回す
    for(let i = 0; i < blocked_user_panels.length-1; i++){
        // ブロックされたユーザーのtwitter idを取得
        let blocked_user_id = blocked_user_panels[i].getElementsByClassName("css-901oao css-bfa6kz r-1re7ezh r-18u37iz r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-qvutc0")[0].children[0].innerText;
        // ブロックされたユーザーのブロックされた理由を取得
        let blocked_reason = GM_getValue(blocked_user_id, "");

        // 囲いのdiv，理由の入力欄，保存ボタンを生成
        let wrapper_div = document.createElement("div");
        let reason_textarea = document.createElement("textarea");
        let change_button = document.createElement("button");
        // 囲いのdiv，理由の入力欄，保存ボタンを反映
        wrapper_div.appendChild(reason_textarea);
        wrapper_div.appendChild(change_button);
        blocked_user_panels[i].appendChild(wrapper_div);

        // 入力欄に理由を表示させる
        reason_textarea.value = blocked_reason;
        // 入力欄とボタンを大きくする
        reason_textarea.style.width = "95%";
        change_button.style.width = "95%";
        // 入力欄の後は改行されるようにする
        reason_textarea.style.display = "block";
        // ボタンの文字を'保存にする'
        change_button.innerText = "保存";
        // ボタンを押したら理由をtwitter idに紐づけて保存する
        change_button.onclick = function(){
            GM_setValue(blocked_user_id, reason_textarea.value);
        };
    }
}

window.onload = function(){
    // ブロックされたユーザーは遅延読み込みされるので1500ms待ってから実行する
    let timeout = setTimeout(init, 1500);
};