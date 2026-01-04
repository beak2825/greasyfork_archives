// ==UserScript==
// @name        歌詞取得。
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  ボタンおして歌詞取得
// @author       You
// @match        https://typing-tube.net/movie/scroll*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462950/%E6%AD%8C%E8%A9%9E%E5%8F%96%E5%BE%97%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/462950/%E6%AD%8C%E8%A9%9E%E5%8F%96%E5%BE%97%E3%80%82.meta.js
// ==/UserScript==
const addBtn = () =>{
        document.querySelector('.twitter.btn').parentElement.insertAdjacentHTML('beforeend', `<input type="button" id="getLyricsBtn" value="歌詞取得">`);
}

(async () => {

    function getlyrics(){
        let lrc_arr = []
        for(i in lyrics_array){
            let lrc_str = lyrics_array[i][1]
            //HTML特殊文字文字コード削除
            lrc_str = lrc_str.replace(/&.*?;/g ,"")
            //ルビタグ内<rt>タグの平仮名削除
            lrc_str = lrc_str.replace(/<rt>.*?<\/rt>/g,"");
            //HTMLタグ削除
            lrc_str = lrc_str.replace(/(<([^>]+)>)/gi, '');
            //end等削除
            lrc_str = lrc_str.replace('__________________________' ,"")
            //よみが入っていればlrc_arrに追加
            if(lyrics_array[i][2] != ''){lrc_arr.push(lrc_str)}
        }
        let lrc_str = lrc_arr.filter(Boolean).join("\n")
        navigator.clipboard.writeText(lrc_str).then(()=>{
                    document.getElementById('getLyricsBtn').value = 'コピー済み'
        })
    }
    await addBtn();
    document.getElementById('getLyricsBtn').addEventListener('click',getlyrics);
})();