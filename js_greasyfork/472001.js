// ==UserScript==
// @name        歌詞取得[py]
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  ボタンおして歌詞取得
// @author       You
// @match        https://typing-tube.net/movie/show*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-auth.js
// @require      https://www.gstatic.com/firebasejs/7.2.1/firebase-database.js
// @downloadURL https://update.greasyfork.org/scripts/472001/%E6%AD%8C%E8%A9%9E%E5%8F%96%E5%BE%97%5Bpy%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/472001/%E6%AD%8C%E8%A9%9E%E5%8F%96%E5%BE%97%5Bpy%5D.meta.js
// ==/UserScript==

let lyricsFB_flg = false;
let lyricsFB;
document.querySelector("#btn_container > p").insertAdjacentHTML('beforeend', `<input type="button" id="btn" value="歌詞取得">`);
btn.addEventListener('click',()=>{
setTimeout(()=>{
    let lrc_JSON = {};
    lrc_JSON.lrc = {};
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
    //よみが入っていればlrc_JSONに追加
    if(lyrics_array[i][2] != ''){lrc_JSON.lrc[Object.keys(lrc_JSON.lrc).length] = lrc_str}
}


    if(lyricsFB_flg == false){
        lyricsFB_flg = true;
            const firebaseConfig = {
        apiKey: "AIzaSyAPfs5se_rMAYdXwugByDoyZLQ4UEgHvho",
        databaseURL: "https://test-d1b06-default-rtdb.firebaseio.com/",
};
    lyricsFB = firebase.initializeApp(firebaseConfig);
    lyricsFB.database().ref().update(lrc_JSON);
    }else{
    lyricsFB.database().ref().update(lrc_JSON);
    }

    },300)
})