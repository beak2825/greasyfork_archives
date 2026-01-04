// ==UserScript==
// @name         ニコニコ(Re:仮)大百科リンク追加
// @namespace    http://tampermonkey.net/
// @version      2024-06-19
// @description  ニコニコ動画（Re:仮）のタグに大百科リンクを追加します。転送先は魚拓（WaybackMachine）です
// @author       BlackApple
// @match        https://www.nicovideo.jp/watch_tmp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498358/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%28Re%3A%E4%BB%AE%29%E5%A4%A7%E7%99%BE%E7%A7%91%E3%83%AA%E3%83%B3%E3%82%AF%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/498358/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%28Re%3A%E4%BB%AE%29%E5%A4%A7%E7%99%BE%E7%A7%91%E3%83%AA%E3%83%B3%E3%82%AF%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

// アイコンを作成する
function createIcon(){
    const anchorElement = document.createElement('a');
    anchorElement.textContent='百';
    anchorElement.style.backgroundColor = '#900';//  背景色を赤に設定
    anchorElement.style.color = 'white';//          文字色を白に設定
    anchorElement.style.borderRadius = '50%';//     角を丸くする
    anchorElement.style.fontSize = '0.75em'//       文字を小さくする
    anchorElement.style.textAlign = 'center'//      横方向中央揃えに設定
    anchorElement.style.verticalAlign = 'middle'//  縦方向中央揃えに設定
    anchorElement.style.width = '2em'//             幅を設定
    anchorElement.style.height = '2em'//            高さを設定
    anchorElement.style.display = 'inline';//
    anchorElement.style.marginLeft = '0.5em'//      タグテキストとの間に余白を作成
    anchorElement.style.marginRight = '-0.2em'//    タグとの間の余白を削減
    anchorElement.style.userSelect = 'none'//       ユーザ選択無効化
    anchorElement.target="_blank"//               新規タブで開く
    return anchorElement
}

(function() {
    // ロード直後ではタグが見えないので、雑に待機してから実行
    setTimeout(() => {
        'use strict';
        console.log('大百科リンク追加 Start === version: 2024-06-19')
        // タイトルに挿入する
        const title = document.querySelector('.fs_18px')
        const titleAnchorElement = createIcon()
        const videoId = location.href.match(/sm\d+|nm\d+/)[0]
        titleAnchorElement.href= "https://web.archive.org/web/20240000000000*/http://dic.nicovideo.jp/v/" + encodeURIComponent(videoId)
        title.appendChild(titleAnchorElement)

        // タグっぽい形をした要素全てに対して実行する
        const tags = document.querySelectorAll('.rounded_10000px')
        tags.forEach((x) => {
            // タグテキストを保持
            const tagText = x.innerText
            const hasID = tagText.match(/sm\d+|nm\d+/)
            if(hasID !== null){
                const linkElement = createIcon()
                linkElement.style.backgroundColor = '#ccc'
                linkElement.textContent='～';
                linkElement.href="https://www.nicovideo.jp/watch_tmp/" + hasID[0]
                x.appendChild(linkElement)
            }

            // アイコン
            // リンク
            const anchorElement = createIcon()
            anchorElement.href= "https://web.archive.org/web/20240000000000*/http://dic.nicovideo.jp/a/" + encodeURIComponent(tagText)
            // 作成した要素に挿入
            x.appendChild(anchorElement)
        })
        console.log('大百科リンク追加 End')
    }, 1000)
})();