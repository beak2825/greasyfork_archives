// ==UserScript==
// @name         否定の生成
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://tokuken2020.github.io/bot/
// @match        https://tokuken2020.github.io/bot/*
// @match        http://worddrow.net/*
// @require      https://greasyfork.org/scripts/387509-yaju1919-library/code/yaju1919_library.js?version=755144
// @require      https://greasyfork.org/scripts/387086-tinysegmenter-js/code/TinySegmenterjs.js?version=714668
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/393621/%E5%90%A6%E5%AE%9A%E3%81%AE%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/393621/%E5%90%A6%E5%AE%9A%E3%81%AE%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var segmenter = new TinySegmenter();
    const yaju1919 = yaju1919_library;
    var sleep_flag = false;
    function getRev(word, callback, lastFlag){
        if(sleep_flag) return;
        yaju1919.get("http://worddrow.net/searchReverse?keyword="+word+"&",{
            success: r => {
                if(sleep_flag) return;
                var dom_parser = new DOMParser();
                const docs = dom_parser.parseFromString(r,"text/html");
                const elm = docs.querySelector(".base_word");
                if(elm) {
                    const base = elm.innerText;
                    if(base === word) {
                        sleep_flag = true;
                        const rev = docs.querySelector(".reverse_word").innerText;
                        return callback(rev);
                    }
                }
                if(lastFlag){
                    callback(sleep_flag ? null : lastFlag);
                    sleep_flag = false;
                }
            },
            fail: m => console.error(m)
        });
    }
    function objection(str,callback){
        segmenter.segment(str).filter(v=>{
            return ((
              exclude.indexOf(v) === -1 // 除外リストに一致しなかったなら
            ) && (
              !/^[^一-龠々〆ヵヶ]$/.test(v) // 漢字以外の一文字なら
            ))}).map((word, i, a) => {
            console.log(word, i, a)
            getRev(word, rev => {
                console.log(word,rev);
                callback(str.replace(word, rev));
            }, i === a.length - 1 ? str : null);
        });
    }
    yaju1919.win.objection = objection;
    yaju1919.win.s = s => segmenter.segment(s);
    const JOSHI = [
        "から","より","やら","なり","だの","ばかり","まで",
        "だけ","ほど","くらい","ぐらい","など","がてら","なぞ","なんぞ",
        "かり","ずつ","のみ","きり","こそ","でも","しか","さえ","ても",
        "でも","けれど","けれども","のに","ので","から","ながら","たり",
        "つつ","ところで","まま","ものの","とも","しん","かい","のに",
        "やら","ものか","こと","てよ","ことよ","もの","かしら","たら"
    ];
    const JODOSHI = [
        "げす","さす","させる","じゃ","せる","そうだ","たい","だす","だら",
        "だろう","ちゃう","です","てる","とき","とく","どす","なく","のだ",
        "はる","ひん","べし","へん","まい","ます","やす","やん","やんす",
        "よう","ようだ","らしい","られる","れる","んす","んず","んだ","んとす",
    ];
    const exclude = JOSHI.concat(JODOSHI);
})();