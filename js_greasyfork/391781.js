// ==UserScript==
// @name         ツイートから読み込みマルコフ連鎖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jquery.com/
// @grant        none
// @require      https://greasyfork.org/scripts/387509-yaju1919-library/code/yaju1919_library.js?version=741841
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://greasyfork.org/scripts/387084-readbigtextforeachline/code/readBigTextForEachLine.js?version=714202
// @require      https://greasyfork.org/scripts/387086-tinysegmenter-js/code/TinySegmenterjs.js?version=714668
// @require      https://cdnjs.cloudflare.com/ajax/libs/encoding-japanese/1.0.29/encoding.min.js
// @downloadURL https://update.greasyfork.org/scripts/391781/%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%8B%E3%82%89%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%E3%83%9E%E3%83%AB%E3%82%B3%E3%83%95%E9%80%A3%E9%8E%96.user.js
// @updateURL https://update.greasyfork.org/scripts/391781/%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%8B%E3%82%89%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%E3%83%9E%E3%83%AB%E3%82%B3%E3%83%95%E9%80%A3%E9%8E%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const yaju1919 = yaju1919_library;
    const segmenter = new TinySegmenter();
    const main_holder = $("<div>").prependTo($("body"));

    // -----------------------------------------------------------------------------

    const read_file_elm = $("<input>",{
        type: 'file',
        multiple: true
    }).change((evt)=>{
        const files = evt.target.files;
        for(const f of files) {
            readBigTextForEachLine(f, line => {
                ReadFileCallback(line);
            });
        }
    });

    // -----------------------------------------------------------------------------

    $("<button>",{text: "ファイル読み込み"}).appendTo(main_holder).click(()=>read_file_elm.click());
    $("<button>",{text: "出力"}).appendTo(main_holder).click(()=>{
        output_elm.text(markov.make());
    });
    const output_elm = $("<div>").appendTo(main_holder);

    const Measure = (()=>{ // 処理時間計測
        let readed_line = 0;
        let learned_line = 0;
        let readed_log = 0;
        const count_read = () => {readed_line++};
        const count_learn = () => {learned_line++};
        const show = () => {
            const ar = [];
            ar.push("読込済み行："+readed_line);
            const readed_sub = readed_line - readed_log;
            readed_log = readed_line;
            ar.push("読込速度[行/s]：" + readed_sub);
            ar.push("学習済み行：" + learned_line);
            return ar;
        };
        return {count_read: count_read, count_learn: count_learn, show: show};
    })();

    // -----------------------------------------------------------------------------

    let measure_log, measure_elm = $("<div>").appendTo(main_holder);
    setInterval(()=>{
        if(!measure_elm) return;
        const now = Measure.show().join('<br>');
        if(now === measure_log) return;
        measure_log = now;
        measure_elm.empty().append(now);
    },1000);

    // -----------------------------------------------------------------------------

    const ReadFileCallback = line => {
        Measure.count_read();
        const unicodeString = Encoding.convert(line, {
            to: 'UNICODE',
            from: 'UTF8',
            type: 'string' // 文字列 'string' を指定 (string で返ります)
        });
        const array = unicodeString.split(',');
        if(array.length !== 6) return;
        markov.add(array[5]);
        Measure.count_learn();
    };


    // -----------------------------------------------------------------------------

    const rand = yaju1919.rand;
    const makeMarkov = (split_func, multiple = 1) => { // マルコフ連鎖を作る
        let data = {};
        const add = text => { // データ登録
            let array = split_func(text);
            [].concat(null, array, null).forEach((v,i,a)=>{
                //break
                const next_num = i + multiple;
                if(next_num >= a.length) return;
                //prev
                let prev = '', correct = 0; // 補正値
                if(v === null){ // 始端の場合
                    prev = null;
                    correct = multiple - 1;
                }
                else {
                    for(let o = 0; o < multiple; o++) {
                        let now = a[i + o];
                        prev += now;
                    }
                }
                //next
                let next = '';
                for(let o = 0; o < multiple; o++) {
                    let now = a[i + o + multiple - correct];
                    if(!now){ // 終端のnullに触れた場合
                        if(!data[next]) data[next] = [];
                        data[next].push(null);
                        break;
                    }
                    next += now;
                }
                // finish
                if(!data[prev]) data[prev] = [];
                data[prev].push(next);
            });
        };
        const make = () => { // マルコフ連鎖でつなげた文を返す
            let result = '';
            let word = rand(data[null]);
            while(word) {
                result += word;
                word = rand(data[word]);
            }
            return result;
        };
        return {add:add,make:make};
    };
    let markov = makeMarkov(str=>segmenter.segment(str),2);

})();