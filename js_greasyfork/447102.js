// ==UserScript==
// @name         TweetDeck カード無効化
// @namespace    https://midra.me
// @version      1.0.0
// @description  Twitterカードを無効化するやつ
// @author       Midra
// @license      MIT
// @match        https://tweetdeck.twitter.com/
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tweetdeck.twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447102/TweetDeck%20%E3%82%AB%E3%83%BC%E3%83%89%E7%84%A1%E5%8A%B9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/447102/TweetDeck%20%E3%82%AB%E3%83%BC%E3%83%89%E7%84%A1%E5%8A%B9%E5%8C%96.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  await (() => new Promise((resolve, reject) => {
    if (window.TD !== undefined && window.TD.ready)
      resolve()
    const start = Date.now()
    const id = setInterval(() => {
      if (window.TD !== undefined && window.TD.ready)
        resolve(), clearInterval(id)
      if (Date.now() - start > 10000)
        reject(), clearInterval(id)
    }, 10)
  }))()

  const webpackSearchWord = [
    'renderCardForChirp',
    'isHorizonWebCardTypeEnabled',
  ]
  const webpackObject = ((a=[])=>{const b=Math.random().toString(36).substring(7),c={};let d=[];webpackJsonp.push([[1e3],{[b]:(a,b,{c:f,m:e})=>{Object.keys(f).forEach(a=>{c[a]=f[a].exports}),d=e}},[[b]]]);const f=a=>{const b=[];return d.forEach((d,f)=>{d.toString().includes(a)&&b.push(c[f])}),b},e={};return a.forEach(a=>{const b=f(a)[0];b&&(e[a]=b)}),e})(webpackSearchWord)
  if (Object.keys(webpackObject).length === 0) return

  const originalRenderCardForChirp = webpackObject['renderCardForChirp'].renderCardForChirp

  webpackObject['renderCardForChirp'].renderCardForChirp = function(e, t, i) {
    if (e.card !== undefined && e.card.name.match(/poll[2-4]choice_text_only/)) {
      originalRenderCardForChirp(e, t, i)
    }
  }

  webpackObject['isHorizonWebCardTypeEnabled'].isHorizonWebCardTypeEnabled = () => false
})()