// ==UserScript==
// @name        歌詞取得→うぇざたい
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  ボタンおして歌詞取得その2
// @author       You
// @match        https://typing-tube.net/movie/scroll*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-auth.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-database.js
// @downloadURL https://update.greasyfork.org/scripts/501352/%E6%AD%8C%E8%A9%9E%E5%8F%96%E5%BE%97%E2%86%92%E3%81%86%E3%81%87%E3%81%96%E3%81%9F%E3%81%84.user.js
// @updateURL https://update.greasyfork.org/scripts/501352/%E6%AD%8C%E8%A9%9E%E5%8F%96%E5%BE%97%E2%86%92%E3%81%86%E3%81%87%E3%81%96%E3%81%9F%E3%81%84.meta.js
// ==/UserScript==


const addBtn = () => {
    document.querySelector('.twitter.btn').parentElement.insertAdjacentHTML('beforeend', `<input type="button" id="getLyricsBtn" value="歌詞取得→うぇざたい">`);
}

(async () => {

    function getlyrics() {
        let lrc_arr = [];
        for (let i in lyrics_array) {
            let lrc_str = lyrics_array[i][1];
            let lrc_yomi = lyrics_array[i][2];

            // HTML特殊文字コード削除
            lrc_str = lrc_str.replace(/&.*?;/g, "");
            // ルビタグ内<rt>タグの平仮名削除
            lrc_str = lrc_str.replace(/<rt>.*?<\/rt>/g, "");
            // HTMLタグ削除
            lrc_str = lrc_str.replace(/(<([^>]+)>)/gi, '');
            // 不要な文字列削除
            lrc_str = lrc_str.replace('__________________________', "");

            // 歌詞と読みが両方ある場合に両方追加
            if (lrc_str && lrc_yomi) {
                lrc_arr.push(lrc_str);
                lrc_arr.push(lrc_yomi);
            }
        }

        // 最後の1行を削除　今回はendが入らないので不要


        let lrc_str = lrc_arr.filter(Boolean).join("\n");

        // ファイル名を生成（"Typing Tube "を削除）
        let fileName = document.title.replace(/^Typing Tube /, '') + '.txt';

        // ファイルを作成してダウンロード
        const blob = new Blob([lrc_str], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        document.getElementById('getLyricsBtn').value = 'ダウンロード済み';
    }

    await addBtn();
    document.getElementById('getLyricsBtn').addEventListener('click', getlyrics);
})();