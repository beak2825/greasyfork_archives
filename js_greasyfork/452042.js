// ==UserScript==
// @name         YouTube to niconico jumper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YouTubeの再生画面に、「その動画のタイトル + ニコニコ動画」でgoogle検索した結果へのリンクを表示するScript
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author       mel
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452042/YouTube%20to%20niconico%20jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/452042/YouTube%20to%20niconico%20jumper.meta.js
// ==/UserScript==

// 動画タイトルの上に<head>に<title> + ニコニコ動画 で検索するリンクを設置
function func() {
    'use strict';

    // 動画タイトルの取得
    let titleL = document.title
    let tit = titleL.substring(0, titleL.length - 10)

    console.log(tit)

    // YouTube検索リンクの設定
    //let url='https://www.google.com/search?q='+tit+" site:https://www.nicovideo.jp/"
    let url='https://www.google.com/search?q='+tit+" ニコニコ動画"

    // 動画タイトルのelementを取得(これの中にリンクを仕込む)
    let divContent = document.querySelector('#info-contents')
    //console.log(divContent)


    let str="ニコニコリンク"
    //divInfo.insertAdjacentHTML('beforebegin', str.link(url))

    let tag = "<a href=\"" + url + "\" style=\"font-size: 15pt\">" + str + "</a>"
    console.log(tag)
    divContent.insertAdjacentHTML('afterbegin', tag)
    //let link="<span dir=\"auto\" class=\"style-scope yt-formatted-string\">" + str.link(url) + "</span>"

    // 動画説明文の一番上にリンクを追加
    //divInsert.insertAdjacentHTML('afterbegin', link)

}

// MutationObserverで<head>内の<title>が更新されるたびにfuncを実行
function obs(){
    // 最初の1回
    func()
    var targetNode = document.querySelector("head > title");
    var observerOptions = {
        childList: true,
        attributes: true,
        subtree: true // 省略するか、false に設定すると、親ノードへの変更のみを監視する。
    }

    var observer = new MutationObserver(func);
    observer.observe(targetNode, observerOptions);
}

// 1000秒のdelayをかけてobsを実行
window.setTimeout( obs, 1000 );
//document.addEventListener('load', func)
//document.addEventListener("DOMContentLoaded", func );

