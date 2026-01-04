// ==UserScript==
// @name         DonderNote小助手
// @namespace    http://tenseiwu.online/
// @version      1.1.1
// @description  a helper for DonderNote
// @author       TenseiWu
// @match        https://hatahata.outsystemscloud.com/DonderNote*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=outsystemscloud.com
// @supportURL   tenseiwu@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/496079/DonderNote%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496079/DonderNote%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



(function() {
    'use strict';
    initHelper(0)
})();

// ---------------------------------------可以根据需要自行编辑曲目列表（只要曲名跟DonderNote对上即可）---------------------------------

const 十星国行缺失曲目 = [
    "彁（裏）",
    "Central Dogma Pt.1（裏）",
    "Destination 2F29",
    "23時54分、陽の旅路へのプレリュード（裏）",
    "ラ・モレーナ・クモナイ（裏）",
    "彁（表）",
    "CUT! into the FUTURE（裏）",
    "Lδchesis（裏）",
    "Nosferatu（裏）",
    "ouroboros -twin stroke of the end-",
    "GORI × GORI × SafaRI（裏）",
    "ON SAY GO SAY（裏）",
    "カルメン組曲 一番終曲（裏）",
    "23時54分、陽の旅路へのプレリュード（表）",
    "GERBERA",
    "Xevel",
    "テトラリュトモスフォビア",
    "絡繰廻廊",
    "鼓立あおはる学園校歌",
    "Altale（裏）",
    "怒槌",
    "CUT! into the FUTURE（表）",
    "極圏",
    "ヘイラ（裏）",
    "ヘイラ（にじさんじVer.）（裏）",
    "Re：End of a Dream（裏）",
    "六本の薔薇と采の歌（裏）",
    "Kill My Fortune（裏）",
    "Scarlet Lance",
    "Destr0yer（裏）",
    "ドドドドドンだフル！（裏）",
    "Illusion Flare",
    "共奏鼓祭（裏）",
    "Chronomia",
    "六華の舞",
    "Central Dogma Pt.1（表）",
    "ミュージック・リボルバー（裏）",
    "アキバ20XX",
    "オーバード（裏）",
    "詩謳兎揺蕩兎",
    "!!!チルノのパーフェクトさんすうタイム!!!",
    "モノクロームユートピア",
    "めためた☆ゆにば～すっ！（裏）",
    "MEGALOVANIA（裏）",
    "Unwelcome School (MRM REMIX)（裏）",
    "転生〈TENSEI〉-喜与志が待つ強者-（裏）",
    "濃紅（にじさんじVer.）",
    "きゅうくらりん（裏）",
    "電脳幻夜の星言詠",
    "とける（表）",
    "とける（裏）",
    "†††カオスタイム the DARK†††",
    "キャラメル・ジャンキヰ",
    "SAVAGE DELIGHT",
    "GIGALODOON（表）",
    "GIGALODOON（裏）",
    "ココドコ？多分ドッカ島！（裏）"
]

const 九星国行缺失曲目 = [
    "シン・ゾンビ[達人]",
    "アサルト BGM1（裏）",
    "スカーレット警察のゲットーパトロール24時（裏）",
    "女神な世界 Ⅰ",
    "Where is the Target?",
    "もりのくまさん（裏）",
    "PAC‐MAN CHAMPIONSHIP EDITION 2",
    "華振舞",
    "Abandoned Temple Final 2nd",
    "Asteroid",
    "ゲラゲラと笑うな",
    "白日夢、霧雨に溶けて",
    "SHOGYO MUJO[達人]",
    "ファミコンメドレー",
    "Comona",
    "妖怪ウォッチ2 元祖／本家／真打",
    "希望へのメロディー（裏）",
    "Pixel Galaxy",
    "愛×愛ホイッスル（カレーメシ公式曲）",
    "ねこくじら（裏）",
    "TD -28619029byte remix-",
    "最果の魔法使い",
    "Crystal Hail",
    "デザートde焼肉（サハラ編）",
    "百鬼夜行[玄人]",
    "ソードバトラーズ（裏）",
    "Space-Time Emergency",
    "スプラトゥーン2メドレー（裏）",
    "Extreme MGG★★★（裏）",
    "SHOGYO MUJO[玄人]",
    "Garakuta Doll Play【双打】",
    "Nosferatu",
    "絶望へのトッカータ",
    "Unwelcome School (MRM REMIX)",
    "Extreme MGG★★★【双打】",
    "百鬼夜行[達人]",
    "GO GET'EM!",
    "LOVE戦!!（裏）",
    "ルカルカ★ナイトフィーバー（裏）",
    "泥の分際で私だけの大切を奪おうだなんて",
    "KARMA(Tatsujin Mix)",
    "ミックスナッツ（裏）",
    "うまぴょい伝説（裏）",
    "AtoZ,I leave toZ",
    "Lδchesis",
    "SHOGYO MUJO[普通]",
    "勇者（裏）",
    "ヘイラ",
    "【双打】Many wow bang!",
    "Brain Power",
    "スリケンランナー",
    "SAMURAI ROCKET（裏）",
    "NAKED GLOW",
    "マサカリブレイド",
    "百鬼夜行[普通]",
    "KAGEKIYO【双打】",
    "TOKIMEKI エスカレート（裏）",
    "【双打】Many wow bang!（裏）",
    "conflict",
    "RAINBOW★SKY",
    "【双打】紅",
    "シン・ゾンビ[普通]",
    "Tulip（裏）",
    "エール・エクス・マキナ！",
    "フォニイ（裏）",
    "リンダは今日も絶好調（裏）",
    "ラッスンゴレライ（裏）",
    "ミツボシ☆☆★（裏）",
    "リヒト（裏）",
    "Fallen Angel",
    "華蕾夢ミル狂詩曲～魂ノ導～（裏）",
    "ラビットホール",
    "Heat Haze Shadow 2",
    "絆ノ奇跡（裏）",
    "Rat A Tat!!!（裏）",
    "ラ・カンパネラ（裏）",
    "マリオネットピュア（にじさんじVer.）",
    "CYBERgenicALICE（にじさんじVer.）",
    "風魔モジュール6768（裏）",
    "トンデ・ミテ",
    "サラえる",
    "エンジェルドリーム（にじさんじVer.）（裏）",
    "ヘイラ（にじさんじVer.）",
    "いっそこのままで（にじさんじVer.）",
    "who are you? who are you?（裏）",
    "雲の彼方の大地の風"
]
// ----------------------------------------------------------------------------

function initHelper(retryTimes) {


    const menu = document.querySelector('.user-info')
    if (!menu) {
        if (retryTimes > 20) {
            window.alert('助手启动失败！')
            return
        }
        window.setTimeout(() => initHelper(retryTimes + 1), 1000)
        return
    }


    const helper = document.createElement('div')
    helper.style.position = 'fixed'
    helper.style.left = '1rem'
    helper.style.top = '70vh'
    helper.style.display = 'flex'
    helper.style.flexDirection = 'column'
    helper.style.gap = '.5rem'
    document.body.appendChild(helper)

    // 删除曲修正
    const lostSong10Btn = document.createElement('button')
    lostSong10Btn.onclick = () => changeLostSongStyle(十星国行缺失曲目)
    lostSong10Btn.innerHTML = '中国版10星修正'
    helper.appendChild(lostSong10Btn)

    const lostSong9Btn = document.createElement('button')
    lostSong9Btn.onclick = () => changeLostSongStyle(九星国行缺失曲目)
    lostSong9Btn.innerHTML = '中国版9星修正'
    helper.appendChild(lostSong9Btn)

    // FC
    const fcBtn = document.createElement('button')
    fcBtn.onclick = countFC
    fcBtn.innerHTML = '统计全连数目'
    helper.appendChild(fcBtn)

    // AP
    const apBtn = document.createElement('button')
    apBtn.onclick = countAP
    apBtn.innerHTML = '统计全良数目'
    helper.appendChild(apBtn)

    const hideBtn = document.createElement('button')
    hideBtn.onclick = hide
    hideBtn.innerHTML = '隐藏'
    helper.appendChild(hideBtn)
}

function changeLostSongStyle(songList) {


    let successCount = 0
    const failSet = new Set(songList)
    const songs = document.querySelectorAll('.ListItem-TextForCommon')
    for (const song of songs) {
        let name = song?.childNodes[0]?.innerHTML
        if (name && songList.includes(name)) {
            song.style.color = '#FFF'
            song.style.backgroundColor = '#696969'
            song.classList.add('ListItem-TextForIsDelete')
            successCount++
            failSet.delete(name)
        }
    }
    window.alert(`共有删除曲 ${songList.length} 首，修正 ${successCount} 首`)
    console.log(Array.from(failSet.values()))
}

function countFC() {
    const tableBody = document.querySelector('#APListContainer')
    if (!tableBody) {
        window.alert('没有找到表格！')
        return
    }
    let fcCount = 0
    fcCount += tableBody.querySelectorAll('.ListItem-TextForFullComb')?.length
    fcCount += tableBody.querySelectorAll('.ListItem-TextForKaAri')?.length
    fcCount += tableBody.querySelectorAll('.ListItem-TextForIsAP')?.length
    window.alert('全连数：' + fcCount)
}

function countAP() {
    const tableBody = document.querySelector('#APListContainer')
    if (!tableBody) {
        window.alert('没有找到表格！')
        return
    }
    window.alert('全良数：' + tableBody.querySelectorAll('.ListItem-TextForIsAP').length)
}

function hide(event) {
    event.target.onclick = show
    event.target.innerText = '显示'
    const songs = document.querySelectorAll('.ListItem-TextForIsDelete')
    for (const song of songs) {
        song.style.display = 'none'

    }
}

function show(event) {
    event.target.onclick = hide
    event.target.innerText = '隐藏'
    const songs = document.querySelectorAll('.ListItem-TextForIsDelete')
    for (const song of songs) {
        song.style.display = 'block'

    }
}