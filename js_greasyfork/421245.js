// ==UserScript==
// @name         猴楼问卷
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://cover-corp.com/contact
// @grant        none
// @run-at        document-body
// @downloadURL https://update.greasyfork.org/scripts/421245/%E7%8C%B4%E6%A5%BC%E9%97%AE%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/421245/%E7%8C%B4%E6%A5%BC%E9%97%AE%E5%8D%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const despData = [
    // `動物園の動物は何でああ生気がないのだろう。`,
    // `それに比べて、野生動物のはつらつとした美しさ`,
    // `何がその差を生み出すのか。動物園の動物は安全な檻の中で暮らしている`,
    // `外敵が侵入してくる心配もないし、自分で危険を冒して、えさを探しに出かける必要もない`,
    // `一方、野生動物は常に、死と隣りあわせで生きている。そのため、適度な緊張感と注意力を保っていなければならない。`,
    // `そのことが野生動物をはつらつとさせているのだ。動物園の動物は安全性と引き換えに、生気を失ってしまっている。`,
    // `文明の檻の中で暮らしている私たちも、動物園の動物に似ている。`
  ]
  const jpchars = ["あ","ぃ","い","ぅ","う","ぇ","え","ぉ","お","か","が","き","ぎ","く","ぐ","け","げ","こ","ご","さ","ざ","し","じ","す","ず","せ","ぜ","そ","ぞ","た","だ","ち","ぢ","っ","つ","づ","て","で","と","ど","な","に","ぬ","ね","の","は","ば","ぱ","ひ","び","ぴ","ふ","ぶ","ぷ","へ","べ","ぺ","ほ","ぼ","ぽ","ま","み","む","め","も","ゃ","や","ゅ","ゆ","ょ","よ","ら","り","る","れ","ろ","ゎ","わ","ゐ","ゑ","を","ん","ゔ","ゕ","ゖ","゗","゘","゙","゚","゛","゜","ゝ","ゞ","ゟ","゠","ァ","ア","ィ","イ","ゥ","ウ","ェ","エ","ォ","オ","カ","ガ","キ","ギ","ク","グ","ケ","ゲ","コ","ゴ","サ","ザ","シ","ジ","ス","ズ","セ","ゼ","ソ","ゾ","タ","ダ","チ","ヂ","ッ","ツ","ヅ","テ","デ","ト","ド","ナ","ニ","ヌ","ネ","ノ","ハ","バ","パ","ヒ","ビ","ピ","フ","ブ","プ","ヘ","ベ","ペ","ホ","ボ","ポ","マ","ミ","ム","メ","モ","ャ","ヤ","ュ","ユ","ョ","ヨ","ラ","リ","ル","レ","ロ","ヮ","ワ","ヰ","ヱ","ヲ","ン","ヴ","ヵ","ヶ","ヷ","ヸ","ヹ"]
  const enchars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  const Enchars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  const pchars = [" "]
  const numchars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

  function createRandomStr(length,...chars){
    const data = [].concat(...chars)
    let result = ""
    for(let i = 0; i < length; i++){
      result += data[parseInt(Math.random()*data.length)]
    }
    return result
  }
  // [s,e)
  function random(s,e){
    return parseInt(s+Math.random()*(e-s))
  }

  function createChannelURL(){
    return `https://www.youtube.com/channel/UCS9uQI${createRandomStr(7,enchars,Enchars,numchars)}-${createRandomStr(16,enchars,Enchars,numchars)}`
  }
  
  const nameInput = document.querySelector("#wpforms-1187-field_1")
  const emailInput = document.querySelector("#wpforms-1187-field_2")
  const titleInput = document.querySelector("#wpforms-1187-field_3")
  const despInput = document.querySelector("#wpforms-1187-field_4")
  const lang = Math.random()*10>5?true:false
  nameInput.value = createRandomStr(random(5,10),lang?jpchars:enchars)
  emailInput.value = `${createRandomStr(random(5,10),enchars)}@gmail.com`
  // titleInput.value = Math.random()*10>5?`アカウントがブロックされました`:createRandomStr(random(4,12),lang?jpchars:[...enchars,...pchars])
  titleInput.value = 'BANされた可能性のあるチャンネルURL'
  if(despData.length>0){
    despInput.value = despData[random(0,despData.length)]
  }else{
    despInput.value = Math.random()*10>5?createChannelURL():`${createRandomStr(random(40,80),lang?jpchars:[...enchars,...pchars])}\n\n\n${createChannelURL()}`
  }
  // Your code here...
})();