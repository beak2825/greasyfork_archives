// ==UserScript==
// @name         feederチャット - 乱魔くん語変換スクリプト
// @author       {0:乱魔くん超大好き}誘い
// @namespace    https://www.x-feeder.info/
// @version      0.5
// @description  入力した文章を乱魔語に変換するボタンを[投稿]の近くにに追加します。
// @match        http*://*.x-feeder.info/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383092/feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%20-%20%E4%B9%B1%E9%AD%94%E3%81%8F%E3%82%93%E8%AA%9E%E5%A4%89%E6%8F%9B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/383092/feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%20-%20%E4%B9%B1%E9%AD%94%E3%81%8F%E3%82%93%E8%AA%9E%E5%A4%89%E6%8F%9B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==
(() => {
  'use strict';
    const toZENKAKU = (value) => {
        if (!value) return value;
        return String(value).replace(/[!-~]/g, (all) => {
            return String.fromCharCode(all.charCodeAt(0) + 0xFEE0);
        });
    };
    const data_str = "僕,オレ/好き,しゅき・・・/くそ,甘い！/？,何　何だ/うるさい,うるさいぞ!/遅い,遅いよ・・・遅すぎるよ・・・/落ち,フン・・・/放置,ほっとく/じゃま,邪魔だ！/無視,ほっとけ/ヴァニ,ばに/だね,だぜィ/君,お前/がんば,フン・・・/楽しくない,甘いな・・・/やったのか,やったな・・・/やったな,お前・・・やったな！/許す,今回は別にいいぜ・・・/だめ,やるな/うん,そうだな/だろ,そうだろ/思う,思うぜ・・・/かなあ,・・・？/やば,悪霊退散悪霊退散悪霊退散悪霊退散悪霊退散悪霊退散どーまんせーまんどーまんせーまんどーまんせーまん！/相棒,ばに/作業,働いておこう/つまらん,甘いな・・・/むかつく,ああ・・・イライラする・・・/うざ,・・・・/いや,違うぜ/すご,へぇ・・・やるもんだな・・・/上手,・・・・/あ,・・・・・！/誰,誰だ/自分,オレ/友達,友/こら,おい！/知らない,知らん/駄目,できないぞ/駄目だ,あぁ・・・/です,だな";
    const data_set = data_str.split("/");
    const Data = [];
    for(const str of data_set) {
        const array = str.split(",");
        Data.push({
            keyword:new RegExp(array[0],"g"),
            answer:array[1]
        });
    }
    const Replace = (str) => {
        let result = str;
        for(const s of Data){
            result = result.replace(s.keyword,s.answer);
        }
        return result;
	}
    const translate = (_str)=>{
        return Replace(toZENKAKU(_str))
        .replace(/そうだよ/g,"そうだ")
        .replace(/やべぇ/g,"あぁ・・・")
        .replace(/やば/g,"・・・")
        .replace(/クビだ/g,"クビだ！！！！！！！")
        .replace(/大草原/g,"ク・・・ククク・・・")
        .replace(/草/g,"うん・・・")
        .replace(/ファッ/g,"ヴっ・・・")
        .replace(/やったぜ/g,"フン・・・")
        .replace(/ぜ/g,"ぜィ");
    };
    const main = () => {
        const elm =  $('#' + activeForm);
        elm.val(translate(elm.val()));
        $('#post_btn').focus();
    };
    $('<button>',{text:"乱魔くん語"}).click(main).prependTo($('#post_btn').parent());
})();