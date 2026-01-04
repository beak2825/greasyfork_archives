// ==UserScript==
// @name            Add Nicopedia Menu
// @namespace       Add Nicopedia Menu
// @description     ニコニコ大百科の記事右側にメニューを追加します
// @author          sotoba
// @match           https://dic.nicovideo.jp/*
// @version         1.0.1-20181103
// @homepageURL     https://github.com/SotobatoNihu/AddNicopediaMenu
// @license         MIT License
// @grant           GM.getResourceUrl
// @resource        nicoIcon   https://dic.nicovideo.jp/oekaki/22690.png
// @resource        googleIcon   https://dic.nicovideo.jp/oekaki/15633.png
// @resource        wikiIcon   https://dic.nicovideo.jp/oekaki/17668.png
// @resource        yahooIcon   https://dic.nicovideo.jp/oekaki/17680.png
// @resource        seigaIcon   https://dic.nicovideo.jp/oekaki/122809.png
// @resource        ch2Icon   https://dic.nicovideo.jp/oekaki/167179.png
// @resource        pixivIcon   https://dic.nicovideo.jp/oekaki/109891.png
// @resource        ichibaIcon   https://dic.nicovideo.jp/oekaki/30296.png
// @resource        communityIcon   https://dic.nicovideo.jp/oekaki/9203.png
// @resource        commonsIcon   https://dic.nicovideo.jp/oekaki/16255.png
// @downloadURL https://update.greasyfork.org/scripts/373835/Add%20Nicopedia%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/373835/Add%20Nicopedia%20Menu.meta.js
// ==/UserScript==

const MENUID = 'nicopedia-menu'

const drowMenu = async (word, width) => {

    const menuElem = document.getElementById(MENUID)

    //単語の空白をアンダーバーに
    const modifyWord = word.replace(' ', '_')

    //アイコンの描画に Greasemonkeyのキャッシュ機能を使用
    Promise.all([
        await GM.getResourceUrl("nicoIcon"),
        await GM.getResourceUrl("googleIcon"),
        await GM.getResourceUrl("wikiIcon"),
        await GM.getResourceUrl("yahooIcon"),
        await GM.getResourceUrl("seigaIcon"),
        await GM.getResourceUrl("ch2Icon"),
        await GM.getResourceUrl("pixivIcon"),
        await GM.getResourceUrl("ichibaIcon"),
        await GM.getResourceUrl("communityIcon"),
        await GM.getResourceUrl("commonsIcon")
    ]).then(Icons => {
        const nicoIcon = Icons[0]
        const googleIcon = Icons[1]
        const wikiIcon = Icons[2]
        const yahooIcon = Icons[3]
        const seigaIcon = Icons[4]
        const ch2Icon = Icons[5]
        const pixivIcon = Icons[6]
        const ichibaIcon = Icons[7]
        const communityIcon = Icons[8]
        const commonsIcon = Icons[9]

        // HTMLをベタ書き（アイコンデータは埋め込み）
        menuElem.innerHTML = `
<img src="/img/l_box_t.gif" class="border" style="width: ${width}px">
<ul>
    <li>
        <a href="https://www.nicovideo.jp/search/${modifyWord}">「${modifyWord}」でキーワード検索 <img title="キーワード検索" style="vertical-align: middle;" alt="niconico" src="${nicoIcon}" width="15" height="15"></a></br>
        <a href="https://www.nicovideo.jp/tag/${modifyWord}">「${modifyWord}」でタグ検索 <img title="タグ検索" style="vertical-align: middle;" alt="niconico" src="${nicoIcon}" width="15" height="15"></a>
    <li>外部サイトで検索</br>
        <a href="http://www.google.co.jp/search?hl=ja&q=${word}"><img title="Google" style="vertical-align: middle;" alt="google" src="${googleIcon}" width="15" height="15"></a> 
        <a href="http://ja.wikipedia.org/wiki/${word}"><img title="Wikipedia" style="vertical-align: middle;" alt="Wikipedia" src="${wikiIcon}"width="15" height="15"></a>  
        <a href="http://search.yahoo.co.jp/search?ei=UTF-8&p=${word}"><img title="Yahoo! Japan" style="vertical-align: middle;" alt="Yahoo!Japan"src="${yahooIcon}"width="17" height="15"></a>  
        <a href="http://find.2ch.net/?BBS=2ch&IE=UTF-8&TYPE=TITLE&STR=${word}"> <img title="2ch" style="vertical-align: middle;" alt="2ch"src="${ch2Icon}"width="15" height="15"></a>   /
        <a href="http://seiga.nicovideo.jp/search/illust/tag/${word}"><img title="静画" style="vertical-align: middle;" alt="ニコニコ静画" src="${seigaIcon}"width="15" height="15"></a> 
        <a href="http://www.pixiv.net/search.php?s_mode=s_tag&word=${word}"><img title="pixiv" style="vertical-align: middle;" alt="Pixiv" src="${pixivIcon}" width="15" height="15"></a> 
        <a href="http://search.pipa.jp/?KWD=${word}">2じげん</a> /
        </br>
        <a href="http://ichiba.nicovideo.jp/search/az/${word}"><img title="ニコニコ市場" style="vertical-align: middle;" alt="ニコニコ市場" src="${ichibaIcon}" width="15" height="15"></a> 
        <a href="http://com.nicovideo.jp/search/${word}?mode=s"><img title="ニコニココミュニティ" style="vertical-align: middle;" alt="ニコニココミュニティ" src="${communityIcon}" width="15" height="15"></a> 
        <a href="http://www.niconicommons.jp/search/${word}"><img title="ニコニ・コモンズ" style="vertical-align: middle;" alt="ニコニ・コモンズ" src="${commonsIcon}" width="15" height="15"></a>  /
    </li>
    <li>50音全記事 
         <a href="https://dic.nicovideo.jp/m/a/a"> 単語記事 </a> / <a href="https://dic.nicovideo.jp/m/a/l"> 生放送記事 </a> 
    </li>
    <li>最近更新された 
        <a href="https://dic.nicovideo.jp/m/u/a/1-"> 単語記事 </a> / <a href="https://dic.nicovideo.jp/m/u/v/1-"> 動画記事 </a> /  <a href="https://dic.nicovideo.jp/m/u/i/1-"> 商品記事 </a>  /  
        </br>
        <a href="https://dic.nicovideo.jp/m/u/u/1-"> ユーザ記事 </a> / <a href="https://dic.nicovideo.jp/m/u/c/1-"> コミュ記事 </a> /  <a href="https://dic.nicovideo.jp/m/u/l/1-"> 生放送記事 </a>  / 
        </br> 
        <a href="https://dic.nicovideo.jp/m/n/res/1-"> 書き込み </a> / <a href="https://dic.nicovideo.jp/m/n/oekaki/1-"> お絵カキコ </a> /  <a href="https://dic.nicovideo.jp/m/n/mml/1-"> ピコカキコ </a>  /  
    </li>
    <li>
         <a id="backgroud_default" style="display: none;" href="" onClick="maincss('/nd2.css');return false;">背景をデフォルトに戻す</a>
         <a id="backgroud_mokume" style="" href="" onClick="maincss('/ndx.css');return false;">背景を木目にする</a>
     </li>
     <li>
         <a id="use_flashpico" style="display: none;" href="" onClick="pikoplayer('flash');return false;">古いピコカキコ(flash版)を使う</a>
         <a id="use_htmlpico" style="" href="" onClick="pikoplayer('html5');return false;">新しいピコカキコ(html5版)を使う</a>
     </li>
    <li>
        <a href="https://dic.nicovideo.jp/">トップ</a> / <a href="https://dic.nicovideo.jp/p/my/">マイページ</a> / <a href="https://dic.nicovideo.jp/p/logout/">ログアウト</a> 
    </li>
</ul>
 <img src="/img/r_box_b2.gif" class="menu-border">
    `

        /**
         * pikoplayerIsは大百科で通常読み込まれる関数
         * pikoplayerIsを元に「ピコカキコ××を使う」の最初の表示を切り替える
         */
        if (pikoplayerIs('flash')) {
            document.getElementById('use_flashpico').style.display = 'none'
            document.getElementById('use_htmlpico').style.display = 'block'
        } else {
            document.getElementById('use_flashpico').style.display = 'block'
            document.getElementById('use_htmlpico').style.display = 'none'
        }

        /**
         * 現在のレイアウトを元に「背景を××にする」の最初の表示を切り替える
         */
        if (document.getElementById('header').style.backgroundRepeat === null) {
            document.getElementById('backgroud_mokume').style.display = 'none'
            document.getElementById('backgroud_default').style.display = 'block'
        } else {
            document.getElementById('backgroud_mokume').style.display = 'block'
            document.getElementById('backgroud_default').style.display = 'none'
        }

        /**
         * CSSの変更を監視し
         * ヘッダーのメニューにある「背景を××にする」の表示と連動する
         */
        const target = document.getElementById("maincss_ndx");
        const observeOption = {
            attributes: true,
            attributeFilter: ['style']
        };
        const observer = new MutationObserver(mutations => {
            if (mutations[0].target.style.cssText.length > 0) {
                document.getElementById('backgroud_mokume').style.display = 'none'
                document.getElementById('backgroud_default').style.display = 'block'
            } else {
                document.getElementById('backgroud_mokume').style.display = 'block'
                document.getElementById('backgroud_default').style.display = 'none'
            }
        });
        observer.observe(target, observeOption);
    })
}


// document.addEventListener('DOMContentLoaded', function () {
window.onload = function () {
    //もしメニューがない場合は作成
    if (document.getElementById(MENUID) === null) {
        const elm = document.createElement('div')
        elm.id = MENUID
        //右ペインの他メニューにクラスを合わせる
        elm.className = 'box'
        elm.style.height = 'auto'
        //空の要素を挿入
        document.getElementById('right-column').insertAdjacentElement('afterbegin', elm)
    }
    //記事名を取得
    const word = document.getElementById('search-box').value
    //横幅を取得
    const width = document.getElementById('right-column').offsetWidth
    //メニューを表示
    drowMenu(word, width)
}
// })

