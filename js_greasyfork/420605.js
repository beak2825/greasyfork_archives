// ==UserScript==
// @name         Pixiv tag bookmark
// @namespace    http://tampermonkey.net/
// @version      2025-04-28
// @description  Pixivの作品ページにタグありのブックマーク機能を追加します
// @author       y_kahou
// @match        https://www.pixiv.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @noframes
// @license      MIT
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/419955-y-method/code/y_method.js?version=983062
// @downloadURL https://update.greasyfork.org/scripts/420605/Pixiv%20tag%20bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/420605/Pixiv%20tag%20bookmark.meta.js
// ==/UserScript==

var syncFlag = false;
var artId, oldId;
const __CSS__ = `
:root {
    --bookmarked-color: rgb(255, 64, 96);
    --checked-color: #5596e6;
}
.selectable:hover {
    background-color: rgb(50, 73, 90);
    color: white;
    cursor: pointer;
}
.selectable.selected {
    background-color: rgb(85, 150, 230);
    color: white;
}
/* 自分用タグ */
#mytag ul {
    list-style: none;
    padding: 0;
    margin: 0 0 5px 0;
    max-width: 600px;
    overflow: hidden;
    transition: 300ms ease-in-out;
}
#mytag li {
    display: inline-block;
    margin-right: 5px;
    line-height: 1.5;
}
#mytag span {
    padding: 2px;
    user-select: none;
}
.o0, .o10 {
    color: rgb(103, 164, 209);
}
.o30, .o50, .o100 {
    color: rgb(132, 162, 183);
    font-weight: bold;
}
.o30  { font-size: 16px; }
.o50  { font-size: 18px; }
.o100 { font-size: 22px; }


/* ブクマボタン */
#tb-submit {
    display: inline-block;
    background: none;
    outline: none;
    border: solid 1.5px var(--checked-color);
    border-radius: 4px;
    cursor: pointer;
    transition: 500ms;
}
#tb-submit::before {
    content: '選択したタグでお気に入り';
    display: inline-block;
    position: relative;
    transform: translateY(40%);
    color: var(--checked-color);
}
#tb-submit.already {
    border-color: var(--bookmarked-color);
}
#tb-submit.already::before {
    content: 'お気に入りタグを編集';
    color: var(--bookmarked-color);
}
#tb-submit.already path {
    fill: #dfdfdf;
}
#tb-submit.already path {
    fill: var(--bookmarked-color);
}
label#tb-secret {
    display: inline-block;
    user-select: none;
    position: relative;
    top: 6px;
    left: 22px;
    cursor: pointer;
}
/* タグテキスト */
#tb-text {
color: black;
    width: 92%;
    height: 1.5em;
    text-indent: 0.5em;
    margin-bottom: 5px;
    background-color: white;
    border: solid 1px gray;
}
#tb-cnt {
    margin-left: 5px;
}
#tb-cnt:after {
    content: '/10';
}

#tb-setting {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
}
#tb-setting #back {
    z-index: 1;
    position: absolute;
    background-color: #dcdcdc99;
    width: 100%;
    height: 100%;
}
#tb-setting #modal {
    z-index: 2;
    position: relative;
    width: 530px;
    height: 600px;
    background: lightgray;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    top: 50px;
    left: 50vw;
    transform: translateX(-50%);
    border-radius: 10px;
    box-shadow: 3px 3px 7px black;
}
#tb-setting :not(textarea) {
    color: black;
    font-size: 18px;
}
#tb-setting textarea {
    height: 160px;
    width: 270px;
    margin-bottom: 3em;
}
`;


(function() {
    'use strict';
    addStyle('tagbookmark', __CSS__);
    
    
    GM_registerMenuCommand('setting', async function() {
        let root = document.querySelector('#__next')
        if (root.querySelector('#tb-setting'))
            return
        
        let stg = document.createElement('div')
        stg.id = 'tb-setting'
        stg.innerHTML = '<div id="back"></div>'
        + '<div id="modal">'
        + '<p>あったら最初からチェック済みにするタグ</p>'
        + '<textarea id="tb-always"></textarea>'
        + '<p>自動的に非公開チェックするタグ</p>'
        + '<textarea id="tb-secret"></textarea>'
        + '<br><label><input id="tb-hide" type="checkbox">非公開のみのタグを表示しない</label>'
        + '<br><br><button>保存</button>'
        + '</div>'
        stg.querySelector('#back').addEventListener('click', e => { stg.outerHTML='' })
        stg.querySelector('#tb-always').value = (GM_getValue('always') || []).join(' ')
        stg.querySelector('#tb-secret').value = (GM_getValue('secret') || []).join(' ')
        stg.querySelector('#tb-hide').checked = !!GM_getValue('hide')
        stg.querySelector('button').addEventListener('click', e => {
            let toArr = selector => {
                let arr = stg.querySelector(selector).value.replace(/( |　|\r\n|\r|\n)/g, ' ').split(' ')
                return Array.from(new Set(arr))
            }
            GM_setValue('always', toArr('#tb-always'))
            GM_setValue('secret', toArr('#tb-secret'))
            GM_setValue('hide', stg.querySelector('#tb-hide').checked)
            alert('保存しました')
        })
        root.appendChild(stg)
    })
    
    
    console.log('Pixiv tag bookmark');
    // 最初の一回
    addMytag();
    
    new MutationObserver(addMytag)
    .observe(document.body, { childList: true, subtree: true ,attributes: true, characterData:true })
})();


async function addMytag() {
    if (syncFlag) {
        return
    }
    syncFlag = true
    
    try { // イラストページ判定
        let match = location.href.match(/artworks\/(\d+)/)
        if (match == null) throw 'イラストページではない'
        
        artId = match[1]
        if (artId == oldId) throw '同じ作品'
    }
    catch(e) {
        // console.log(e);
        syncFlag = false
        return
    }
    console.log('イラスト作品なのでタグブクマ追加');
    let footer = (await repeatGetElements('figcaption footer', 500, 20))[0]
    
    // ブクマ済みならタグとか取得
    let already = document.querySelector('a[href^="/bookmark_add.php"]')
    let detail = !already ? null : await request.getArtworkData(already.href)
    let always = (GM_getValue('always') || [])
    
    // 既存タグに機能追加
    $(footer).find('li a').addClass('selectable')
    
    // wrap作成
    let wrap = document.querySelector('#tb-wrap')
    if (wrap) wrap.outerHTML = ''
    wrap = document.createElement('div')
    wrap.id = 'tb-wrap'
    
    // 自分用タグ
    let mytag = document.createElement('div')
    mytag.id = 'mytag'
    mytag.innerHTML = `<label><input type="checkbox" onchange="this.parentNode.nextElementSibling.classList.toggle('show', this.checked)"><span>自分用タグ</span></label>`
    let ul = document.createElement('ul')
    let tags = await request.getMyTags(!GM_getValue('hide'))
    for (let tag in tags) {
        let c = 'o0'
        if (tags[tag] >= 10)  c = 'o10'
        if (tags[tag] >= 30)  c = 'o30'
        if (tags[tag] >= 50)  c = 'o50'
        if (tags[tag] >= 100) c = 'o100'
        ul.innerHTML += `<li data-cnt="${tags[tag]}"><span class="selectable ${c}">${tag}</span></li>`
    }
    if (tags == null || tags.length == 0) {
        ul.innerHTML = 'ブックマークタグがありません'
    }
    mytag.appendChild(ul)
    // 高さ取得してスタイル化
    let style = document.querySelector('#tagbookmark-ul')
    if (style) style.outerHTML = ''
    document.body.appendChild(mytag)
    const mytagHeight = mytag.clientHeight
    document.body.removeChild(mytag)
    addStyle('tagbookmark-ul', `#mytag ul { height: 0; } #mytag ul.show { height: ${mytagHeight}px }`)
    wrap.appendChild(mytag)
    
    // 登録用text
    let tagText = document.createElement('input')
    tagText.id = 'tb-text'
    tagText.placeholder = '登録タグ'
    tagText.addEventListener('keyup', listener.text)
    wrap.appendChild(tagText)
    
    // タグ数
    let tagCnt = document.createElement('span')
    tagCnt.id = 'tb-cnt'
    tagCnt.textContent = '1'
    wrap.appendChild(tagCnt)
    
    // ブックマークボタン作成
    let tbm = document.createElement('button')
    tbm.id = 'tb-submit'
    if (already) {
        tbm.className = 'already'
        tbm.appendChild(already.querySelector('svg').cloneNode(true))
    } else {
        tbm.appendChild(document.querySelector('.gtm-main-bookmark svg').cloneNode(true))
    }
    tbm.addEventListener('click', listener.bookmark)
    wrap.appendChild(tbm)
    
    // 非公開チェックボックス
    let sec = document.createElement('label')
    sec.id = "tb-secret"
    sec.innerHTML = `<input type="checkbox" ${detail && detail.hide==1 ? 'checked' : ''}>非公開`
    wrap.appendChild(sec)
    
    // footer下に追加
    $(footer).after(wrap)
    
    
    // すべてのタグへの設定
    let artTags = [...footer.querySelectorAll('.selectable')], artTagsText = artTags.map(e => e.textContent)
    let myTags  = [...mytag.querySelectorAll('.selectable')]
    for (let tag of [...artTags, ...myTags]) {
        tag.addEventListener('click', listener.tag)
        let t = tag.textContent, selected
        if (detail) {
            selected = !!detail.tags.find(e => e == t)
        } else {
            selected = always.includes(t) && artTagsText.includes(t)
        }
        tag.classList.toggle('selected', selected)
    }
    tagText.value = detail ? detail.tags.join(' ') : [...footer.querySelectorAll('.selected')].map(a => a.textContent).join(' ')
    setTagcnt()
    if (!detail) setSecret()
    
    syncFlag = false;
    oldId = artId;
}




function setSecret() {
    let checked = false;
    let secret = (GM_getValue('secret') || [])
    for (let tag of $('#tb-text').val().replace('　', ' ').split(' ')) {
        if (secret.includes(tag)) {
            checked = true;
            break;
        }
    }
    $('#tb-secret input')[0].checked = checked;
}
function setTagcnt() {
    let cnt = $('#tb-text').val().replace('　', ' ').split(' ').filter(t => t != '').length
    let cntText = document.querySelector('#tb-cnt')
    cntText.textContent = cnt
    cntText.style.color = cnt > 10 ? 'red' : ''
}

const listener = {
    tag: function(e) {
        if (e.ctrlKey) return
        e.preventDefault()
        
        let tag = e.target.textContent
        let text = document.querySelector('#tb-text');
        
        // 自分AND同じ名前のタグをtoggle
        [...document.querySelectorAll('.selectable')]
        .filter(e => e.textContent == tag)
        .forEach(e => e.classList.toggle('selected'))
        
        // テキストへの変換(toggle)
        if (e.target.classList.contains('selected')) {
            text.value += (text.value ? ' ' : '') + e.target.textContent
        } else {
            text.value = text.value.replace('　', ' ').split(' ').filter(t => t != e.target.textContent).join(' ')
        }
        setTagcnt()
        setSecret()
    },
    text: function(e) {
        // テキスト変更でタグの選択も変更
        for (let tag of document.querySelectorAll('.selectable')) {
            let textTags = e.target.value.replace('　', ' ').split(' ')
            let match = textTags.includes(tag.textContent)
            tag.classList.toggle('selected', match)
        }
        setTagcnt()
        setSecret()
    },
    bookmark: async function(e) {
        let url = location.href
        let work_id = url.match(/artworks\/(\d+)$/)[1]
        let tags = document.querySelector('#tb-text').value.replace('　', ' ').split(' ')
        let comment = ''
        let hide = document.querySelector('#tb-secret input').checked ? 1 : 0
        let token = document.querySelector('#__NEXT_DATA__').textContent.match(/token\\":\\"(\w+)/)[1]

        request.addBookmark('illusts', work_id, comment, tags, hide, token)
        .then(data => {
            // 成功
            let btn = document.querySelector('#tb-submit')
            if (!btn.classList.contains('already')) {
                btn.classList.add('already')
            } else {
                // 何度も連続でクリックされないように
                alert('タグを編集しました')
            }
        })
        .catch(error => {
            // 失敗
            console.error(error)
            alert('ブックマークに失敗しました')
        })
    },
}
const request = {
    getToken: async function(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(response => response.text())
            .then(data => {
                let result = data.match(/token":"(\w+)"/)
                if (!result) reject(null)
                else resolve(result[1])
            })
        })
    },
    getMyTags: async function(marge = true) {
        console.log('pixiv側の変数 user_id: ' + dataLayer[0].user_id);
        return new Promise((resolve, reject) => {
            fetch(`https://www.pixiv.net/ajax/user/${dataLayer[0].user_id}/illusts/bookmark/tags`)
            .then(response => response.text())
            .then(data => {
                let tags = JSON.parse(data).body
                let ret = {}
                
                for (let tag of tags.public) {
                    ret[tag.tag] = tag.cnt
                }
                if (marge)
                for (let tag of tags.private) {
                    if (tag.tag in ret) 
                        ret[tag.tag] += tag.cnt;
                    else ret[tag.tag] = tag.cnt;
                }
                resolve(ret)
            })
        })
    },
    addBookmark: async function(type, work_id, comment, tags, hide, token) {
        let body = {
            comment: comment,
            tags: tags,
            restrict: (hide ? 1 : 0),
        }
        body[type == 'illusts' ? 'illust_id' : 'novel_id'] = work_id
        
        return new Promise((resolve, reject) => {
            fetch(`https://www.pixiv.net/ajax/${type}/bookmarks/add`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'x-csrf-token': token,
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) reject(data)
                else resolve(data)
            })
        })
    },
    getArtworkData: async function(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(response => response.text())
            .then(text => {
                let html = new DOMParser().parseFromString(text, "text/html")
                let detail = html.querySelector('.bookmark-detail-unit form')
                resolve({
                    comment: detail.comment.value,
                    tags: detail.tag.value.split(' '),
                    hide: detail.restrict.value
                })
            })
        })
    }
}
