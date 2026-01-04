// ==UserScript==
// @name         twitter media chain
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Twitterのスレッド、メディア欄を左右キーで連続して閲覧するやつ
// @author       y_kahou
// @match        https://twitter.com/*
// @exclude      https://twitter.com/i/tweetdeck
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/419806-touchactionex/code/touchActionEx.js?version=888836
// @grant        GM_addStyle
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/481867/twitter%20media%20chain.user.js
// @updateURL https://update.greasyfork.org/scripts/481867/twitter%20media%20chain.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {
    'use strict';
    
    GM_addStyle(`
    [id^=verticalGridItem] svg {
        background: black;
        border-radius: 4px;
    }
    `)
    
    const wait = (ms) => new Promise(res => setTimeout(res, ms))
    
    // メディアページ用に目印をつける
    $(document).on('click', '[id^="verticalGridItem"] a', () => {
        document.querySelector('[aria-labelledby="modal-header"]').dataset.chain = 'medialist'
    })
    
    
    let chain = async function(left, right) {
        const LEFT = left
        const RIGHT = right
        
        if (!LEFT && !RIGHT)
            return
            
        if (location.pathname.indexOf('status') == -1)
            return
        
        // ボタンが存在するときそちらのキーを押しても何もしない
        if (document.querySelector('div[aria-label="前のスライド"]') && LEFT) return
        if (document.querySelector('div[aria-label="次のスライド"]') && RIGHT) return
        
        // 現在のツイートID
        let id = location.pathname.match(/(?<=status\/)\d+/)[0]
        
        // タイムライン、スレッドの中からツイートIDでツイートを探す
        let timelines = document.querySelectorAll('div[aria-label^="タイムライン:"]:not([aria-label^="タイムライン: トレンド"])')
        let timeline = timelines[timelines.length-1]
        let datetime = timeline.querySelector(`a[href*="${id}"]`)
        
        let dist, imgs, img
        
        // メディアページ判定
        if (document.querySelector('[aria-labelledby="modal-header"]').dataset.chain == 'medialist') {
            let num = Number(datetime.closest('[role="listitem"]').id.match(/verticalGridItem-(\d+)/)[1])
            
            num += LEFT ? -1 : 1;
            
            dist = img = document.querySelector(`[id^="verticalGridItem-${num}"] a`)
            
        } else {
            
            // 次に見るツイート
            dist = datetime.closest('article').closest('div:not([class])')
            
            // 次のツイート(の画像)を探す
            // スレッドだと謎の1要素あるので5個くらい余裕を持って探す
            const N_MAX = 5
            for (let i = 0; i <= N_MAX; i++) {
                if (i == N_MAX) {
                    console.log('次/前の画像なし');
                    return
                }
                
                dist = LEFT ? dist.previousElementSibling : dist.nextElementSibling
                
                // 次のツイートDOMがツイートではない(余白とか)なら次へ
                let distDatetime = dist.querySelector('time')
                if (!distDatetime)
                    continue
                
                // IDチェックで引用ツイートを除外
                let distId = distDatetime.parentNode.getAttribute('href').match(/(?<=status\/)\d+/)[0]
                imgs = dist.querySelectorAll(`a[href*="${distId}"] [data-testid="tweetPhoto"]`)
                
                // 画像ツイートだったら探索終了
                if (imgs.length) {
                    let pn = RIGHT ? 0 : imgs.length - 1
                    img = imgs[pn]
                    break
                }
            }
        }
        
        // モーダル閉じる
        document.querySelector('[aria-labelledby="modal-header"] [role="listitem"] > div').click()
        await wait(200)
        
        // 対象のツイートまでスクロール
        dist.scrollIntoView();
        await wait(200)
        
        // 次の画像クリック
        img.click()
    }
    
    
    
    document.addEventListener('keydown', e => {
        let left = (e.keyCode == 37)
        let right = (e.keyCode == 39)
        chain(left, right)
    })
    
    addSwipeWay(document.body)
    let callback = e => {
        let left = (e.type == 'swiperight')
        let right = (e.type == 'swipeleft')
        chain(left, right)
    }
    document.body.addEventListener('swipeleft', callback)
    document.body.addEventListener('swiperight', callback)
})();