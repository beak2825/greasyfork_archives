/// ==UserScript==
// @name         レスバくん(Feederチャット)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  眠い時、めんどくさい時にレスバトルを申し込まれた時に便利なスクリプトです。ボタンを押すだけでいつの間にかレスバトルが終わっています。また、このスクリプトは過去に作成した『相槌くん(Feederチャット)』を改造したものです。
// @author       反物質ムショクニウム
// @match       *.x-feeder.info/*/
// @exclude     *.x-feeder.info/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386072/%E3%83%AC%E3%82%B9%E3%83%90%E3%81%8F%E3%82%93%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386072/%E3%83%AC%E3%82%B9%E3%83%90%E3%81%8F%E3%82%93%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==
(() => {
  'use strict';
const getInput = () => {
  const single = $('#post_form_single');

  if (single.css('display') !== 'none') {
    return single;
  }

  return $('#post_form_multi');
};

  const list = `
「それ、あなたの感想ですよね」
「なんかデータとかあるんですか？」
「なんだろう、ウソつくのやめてもらってもいいっすか」
「はいか、いいえで答えてください」
「あなた個人の尺度で物を言わないでください」
「その発言はもはやギャグ」
「おっと長文きちゃったw悔しかったねぇwwww」
「お前が知らないだけだろにわか」
「何を根拠にwwww」
「無能」
「^^」
「君の反論苦しすぎ…^^;」
「ぐう正論」
「もう飽きた、お前の発言雑魚過ぎ」
「マジで言ってんの？wwwww」
「ぬぅ～？」
「ゲームオーバーwww」
「素直に負け認めなよwwww引き際わきまえてないやつが一番見苦しいwwww」
「アハハハハハハーwwwww」
「ノーwwwww」
「イライラで草」
「図星やねwwwww」
「悔しいか？wwwwwwww」
「子供部屋に住んでそう」
「めっちゃ早口で言ってそう」
「言ってみろや情弱www」
「あガガイのガイ」
「ハゲ」
「楽天カードしか持ってなさそう」
「ネットにしか居場所なさそう」
「必死だな」
「顔真っ赤wwww」
「言い返してみろよ無能wwwww」
「敗北を知りたい」
「なんだお前偉そうに」
「ポケモンとか好きそう」
「効いてる効いてるw」
`.match(/「.+」/g).map(v => v.slice(1, -1));
  const rand = array => array[Math.floor(Math.random() * array.length)]; // ランダムな要素を返す
  const main = () => {
    getInput().val(rand(list) + " ".repeat(Math.random * 10));
    $("#post_btn").click();
  };
  $('<button>', {
    text: "レスバくん"
  }).click(main).appendTo($('#post_btn').parent())
})();