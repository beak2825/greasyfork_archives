// ==UserScript==
// @name                jpmarumaru 羅馬拼音歌詞
// @namespace           Anong0u0
// @version             1.1.5
// @description         讓 marumaru 日文歌詞能以羅馬拼音形式出現
// @author              Anong0u0
// @match               *://www.marumaru-x.com/japanese-song/play-*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=marumaru-x.com
// @grant               GM_xmlhttpRequest
// @grant               GM_registerMenuCommand
// @grant               GM.setValue
// @grant               GM_getValue
// @grant               GM_deleteValue
// @grant               GM_listValues
// @connect             raw.githubusercontent.com
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/472905/jpmarumaru%20%E7%BE%85%E9%A6%AC%E6%8B%BC%E9%9F%B3%E6%AD%8C%E8%A9%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/472905/jpmarumaru%20%E7%BE%85%E9%A6%AC%E6%8B%BC%E9%9F%B3%E6%AD%8C%E8%A9%9E.meta.js
// ==/UserScript==

const delay = (ms = 0) => new Promise((r)=>{setTimeout(r, ms)});
(async ()=>
{
    while(typeof $player === 'undefined') await delay(10);
    while($player?.lyrics?.length === 0) await delay(10);

    const use_split = GM_getValue("use_split", true), songID = document.URL.split("/").pop();

    String.prototype.replaceRegex = function(k, v) { return this.replace(new RegExp(k, "gm"), v) }
    const ROMAJI_KANA_ARR = "xtsu=っ|ッ,shi=し|シ,chi=ち|チ,tsu=つ|ツ,ka=か|カ,ki=き|キ,ku=く|ク,ke=け|ケ,ko=こ|コ,ga=が|ガ,gi=ぎ|ギ,gu=ぐ|グ,ge=げ|ゲ,go=ご|ゴ,sa=さ|サ,su=す|ス,se=せ|セ,so=そ|ソ,za=ざ|ザ,ji=じ|ジ,zu=ず|ズ,ze=ぜ|ゼ,zo=ぞ|ゾ,ta=た|タ,te=て|テ,to=と|ト,da=だ|ダ,dzi=ぢ|ヂ,dzu=づ|ヅ,de=で|デ,do=ど|ド,na=な|ナ,ni=に|ニ,nu=ぬ|ヌ,ne=ね|ネ,no=の|ノ,ha=は|ハ,hi=ひ|ヒ,fu=ふ|フ,he=へ|ヘ,ho=ほ|ホ,pa=ぱ|パ,pi=ぴ|ピ,pu=ぷ|プ,pe=ぺ|ペ,po=ぽ|ポ,ba=ば|バ,bi=び|ビ,bu=ぶ|ブ,be=べ|ベ,bo=ぼ|ボ,ma=ま|マ,mi=み|ミ,mu=む|ム,me=め|メ,mo=も|モ,ra=ら|ラ,ri=り|リ,ru=る|ル,re=れ|レ,ro=ろ|ロ,wa=わ|ワ,wi=ゐ|ヰ,we=ゑ|ヱ,wo=を|ヲ,va=ゔぁ|ヴァ,vi=ゔぃ|ヴィ,ve=ゔぇ|ヴェ,vo=ゔぉ|ヴォ,vu=ゔ|ヴ,n=ん|ン,xa=ぁ|ァ,xi=ぃ|ィ,xu=ぅ|ゥ,xe=ぇ|ェ,xo=ぉ|ォ,xya=ゃ|ャ,xyu=ゅ|ュ,xyo=ょ|ョ,ya=や|ヤ,yu=ゆ|ユ,yo=よ|ヨ,a=あ|ア,i=い|イ,u=う|ウ,e=え|エ,o=お|オ,h=っ|ッ,-=ー".split(",").map((e) => e.split("="))
    const KANA_REPLACE_ARR = "fux([aieo])=f$1,ixy=y,(s|c)hy=$1h,dzu=zu,(dz|j)y?=j,xtsu([rtpsdfghjkbm])=$1$1,xtsuc=tc,x=~".split(",").map((e) => e.split("="))
    String.prototype.toRomaji = function()
    {
        let kana = this
        kana = kana.replace(/([んン])([あいうえおやゆよアイウエオヤユヨ])/gm, "$1'$2")

        ROMAJI_KANA_ARR.forEach((arr) => { kana = kana.replaceRegex(arr[1], arr[0]) })

        KANA_REPLACE_ARR.forEach((arr) => { kana = kana.replaceRegex(arr[0], arr[1]) })
        return kana
    }
    Node.prototype.getKanaLyrics = function()
    {
        const temp = this.cloneNode(true)
        temp.querySelectorAll("rb").forEach(e => e.remove())
        return temp.innerText
    }
    String.prototype.getKanaLyrics = function()
    {
        const div = document.createElement("div")
        div.innerHTML = this
        return div.getKanaLyrics()
    }
    Node.prototype.getNormalLyrics = function()
    {
        const temp = this.cloneNode(true)
        temp.querySelectorAll(":is(rt,rtc,.ateji)").forEach(e => e.remove())
        return temp.innerText
    }
    String.prototype.getNormalLyrics = function()
    {
        const div = document.createElement("div")
        div.innerHTML = this
        return div.getNormalLyrics()
    }

    const css = document.createElement("style")
    css.innerHTML = `
#caption-style-2 .mr-lyrics.font-jp1[lang=ja] {display: block; padding-top:10px}
#caption-style-2 .mr-lyrics-display-2 {padding-top: 5px}`
    document.body.append(css)

    let lyricsSplited = GM_getValue(songID, {})

    const lyricsStore = {},
          lyrics1 = document.querySelector("#caption-style-1 .mr-lyrics-1"),
          lyrics2 = document.querySelector("#caption-style-1 .mr-lyrics-2"),
          romaji1 = [document.createElement("div"), document.createElement("div")],
          romaji2 = [document.createElement("div"), document.createElement("div")],
          lyricsNormal2Kana = {},
          lyricsKana2Ateji = {}
    $player.lyrics.forEach((e)=>
    {
        lyricsKana2Ateji[e.kana] = e.ateji.getKanaLyrics()
        lyricsNormal2Kana[e.normal] = e.kana
    })
    lyrics1.insertAdjacentElement("afterend", romaji1[0])
    lyrics2.insertAdjacentElement("afterend", romaji2[0])
    document.querySelector("#caption-style-2 .mr-lyrics-1").insertAdjacentElement("afterend", romaji1[1])
    document.querySelector("#caption-style-2 .mr-lyrics-2").insertAdjacentElement("afterend", romaji2[1])

    new MutationObserver((e) =>
    {
        e.forEach((ele) =>
        {
            if (ele.type == "attributes")
            {
                romaji1.forEach((e)=>{e.style.color = lyrics1.style.color})
                romaji2.forEach((e)=>{e.style.color = lyrics2.style.color})
            }
            else if (ele.addedNodes.length != 0 && ele.target.className.match(/mr-lyrics-\d/))
            {
                ele = ele.target
                if (lyricsStore[ele.className] == ele.innerText) return;
                lyricsStore[ele.className] = ele.innerText

                let ly = ele.getNormalLyrics()
                if (ly in lyricsNormal2Kana) ly = lyricsNormal2Kana[ly]
                const rmj = (use_split ? lyricsSplited[ly] : lyricsKana2Ateji[ly]).toRomaji();

                if (ele.className.includes("mr-lyrics-1")) romaji1.forEach((e)=>{e.innerText = rmj})
                else romaji2.forEach((e)=>{e.innerText = rmj})
            }
        })
    }).observe(document.querySelector("div#caption-style-1"),
    {
        subtree: true,
        childList: true,
        attributes: true
    })



    GM_registerMenuCommand(`${use_split?"關閉":"開啟"}日文分詞`, ()=>
    {
        GM.setValue("use_split", !use_split).then(async ()=>
        {
            if(use_split && confirm(`已關閉日文分詞，是否刪除分詞字典與分詞快取?`))
            {
                indexedDB.deleteDatabase("naist-jdic");
                GM_listValues().forEach((e)=>GM_deleteValue(e))
                await GM.setValue("use_split", false)
            }
            location.reload()
        })
    })
    if (!use_split) return;

    const tip = document.createElement("span")
    tip.style = "position: absolute;left: 8rem;"
    document.querySelector("#mr-toolbar > .d-sm-block").insertAdjacentElement("afterend", tip)
    document.querySelector("#mr-toolbar").style["align-items"] = "center"


    const requests = ({ method, url, data = null, headers = {}, type = "stream" }) => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: headers,
                responseType: type,
                overrideMimeType: "text/javascript",
                data: data,
                onload: resolve
            });
        });
    };

    const UNKNOWN_DEFINITION = [
        { name: 'DEFAULT', invoke: false, regexp: '' }, // 0
        { name: 'SPACE', invoke: true, regexp: '\\s+' }, // 1
        { name: 'KANJI', invoke: false, regexp: '[\u{2e80}-\u{2fdf}々〇〻\u{3400}-\u{4dbf}\u{4e00}-\u{9fff}\u{f900}-\u{faff}\u{20000}-\u{2ffff}]{1,2}' }, // 2
        { name: 'SYMBOL', invoke: true, regexp: '[!-/:-@[-`{-~¡-¿À-ȶḀ-ỹ！-／：-＠［-｀｛-･￠-\u{ffef}\u{2000}-\u{206f}₠-⅏←-⥿⨀-\u{2bff}\u{3000}-\u{303f}㈀-㏿︰-﹫]+' }, // 3
        { name: 'NUMERIC', invoke: true, regexp: '[0-9０-９⁰-\u{209f}⅐-\u{218f}]+' }, // 4
        { name: 'ALPHA', invoke: true, regexp: '[A-Za-zＡ-Ｚａ-ｚ]+' }, // 5
        { name: 'HIRAGANA', invoke: false, regexp: '[ぁ-ゟー]{1,4}' }, // 6
        { name: 'KATAKANA', invoke: true, regexp: '[ァ-ヿㇰ-ㇿｦ-ﾝﾞﾟ]+' }, // 7
        { name: 'KANJINUMERIC', invoke: true, regexp: '[〇一二三四五六七八九十百千万億兆京]+' }, // 8
        { name: 'GREEK', invoke: true, regexp: '[ʹ-ϻ]+' }, // 9
        { name: 'CYRILLIC', invoke: true, regexp: '[Ѐ-ӹԀ-ԏ]+' }, // 10
    ];

    const Halfwidth2Fullwidth = (str) => {
        if (!str) return '';
        let result = [];
        for (let s of str) {
            let p = s.codePointAt(0);
            if (0x0020 < p && p < 0x007f) {
                result.push(String.fromCharCode(p + 65248));
            } else {
                result.push(s);
            }
        }
        return result.join('');
    }
    const BOS = {
        word: '\x02',
        id: 0,
        cost: 0,
        start: 0,
        end: 1,
    };
    const EOS = {
        word: '\x03',
        id: 0,
        cost: 0,
    };
    class Path extends Array {
        constructor(length) {
            super();
            this.length = length || 0;
            this.cost = 0;
        }
        format() {
            const cost = this.cost;
            const newPath = Path.from(this.slice(1, this.length - 1));
            newPath.cost = cost;
            return newPath;
        }
        static from(arraylike) {
            const length = arraylike.length;
            const path = new Path(length)
            for (let i = 0; i < length; i++) path[i] = arraylike[i];
            return path;
        }
    }
    const mtx = [];
    class Lattice {
        constructor(input) {
            this.input = [...input];
        }
        lookup(unkDic) {
            let chars = this.input;
            const CHAR_LENGTH = chars.length;
            return new Promise((resolve, reject) => {
                indexedDB.open("naist-jdic").onsuccess = e => {
                    let db = e.target.result, dic;
                    try {
                        dic = db.transaction(['dictionary'], 'readonly').objectStore('dictionary').index('index');
                    } catch (e) {
                        db.close();
                        indexedDB.deleteDatabase("naist-jdic");
                        reject("找不到字典");
                    }
                    let targets = [], promises = [];
                    for (let i = 0; i < CHAR_LENGTH; i++) {
                        for (let j = i; j < CHAR_LENGTH; j++) {
                            promises.push(new Promise((resolve, reject) => {
                                let targetKey = chars.slice(i, j + 1).join('');
                                let req = dic.openCursor(Halfwidth2Fullwidth(targetKey));
                                req.onsuccess = e => {
                                    let cursor = e.target.result;
                                    if (cursor) {
                                        cursor.value.start = i + 1;
                                        cursor.value.end = j + 2;
                                        targets.push(cursor.value);
                                        cursor.continue();
                                    } else {
                                        // Skip DEFAULT (k=0)
                                        for (let k = 1; k < unkDic.length; k++) {
                                            if (new RegExp('^' + unkDic[k].regexp + '$', 'u').test(targetKey)) {
                                                targets.push({
                                                    word: targetKey,
                                                    id: unkDic[k].id,
                                                    cost: unkDic[k].cost,
                                                    pos: unkDic[k].pos,
                                                    start: i + 1,
                                                    end: j + 2,
                                                    note: k && '未知語'
                                                    || targetKey === '\n' && '改行'
                                                    || targetKey === '\t' && 'タブ'
                                                    || '空白'
                                                });
                                            }
                                        }
                                        resolve();
                                    }
                                };
                                req.onerror = e => reject(e);
                            }));
                        }
                    }
                    Promise.all(promises).then(() => {
                        targets.push(Object.assign({}, BOS), Object.assign({}, EOS, {
                            start: CHAR_LENGTH + 1,
                            end: CHAR_LENGTH + 2,
                        }));
                        this.words = targets.sort((a, b) => {
                            return a.start - b.start || a.end - b.end;
                        });
                        resolve(this.words);
                    }, reject).then(() => db.close());
                };
            });
        }
        tokenize() {
            let words = this.words;
            let len = words.length;
            let mCosts = new Array(len).fill().map(() => new Array(len));
            return new Promise((resolve, reject) => {
                let promises = [];
                indexedDB.open("naist-jdic").onsuccess = e => {
                    let db = e.target.result;
                    let matrix = db.transaction(['matrix'], 'readonly').objectStore('matrix');
                    for (let y = 0; y < len; y++) {
                        let rightId = words[y].id;
                        promises.push(new Promise((resolve, reject) => {
                            if (mtx[rightId]) {
                                resolve();
                            } else {
                                let req = matrix.get(rightId);
                                req.onsuccess = e => {
                                    let result = e.target.result;
                                    if (result) {
                                        mtx[rightId] = e.target.result.left;
                                        resolve();
                                    } else {
                                        reject("找不到matrix");
                                    }
                                };
                                req.onerror = e => reject(e);
                            }
                        }).then(() => {
                            for (let x = 0; x < len; x++) {
                                let leftId = words[x].id;
                                mCosts[y][x] = words[x].end === words[y].start ? mtx[rightId][leftId] : Infinity;
                            }
                        }));
                    }
                    Promise.all(promises).then(() => {
                        let vertex = new Array(len).fill().map(() => ({
                            cost: Infinity,
                            next: -1,
                            visited: false,
                        }));
                        vertex[len - 1] = {
                            cost: words[len - 1].cost, // 0
                            next: len,
                            visited: false,
                        };
                        while (true) {
                            let min = Infinity;
                            for (let i = 0; i < len; i++) {
                                if (!vertex[i].visited && vertex[i].cost < min) min = vertex[i].cost;
                            }
                            if (min === Infinity) break;
                            for (let y = 0; y < len; y++) {
                                if (vertex[y].cost === min) {
                                    for (let x = 0; x < len; x++) {
                                        let sum = mCosts[y][x] + words[y].cost + min;
                                        if (sum < vertex[x].cost) {
                                            vertex[x].cost = sum;
                                            vertex[x].next = y;
                                        }
                                    }
                                    vertex[y].visited = true;
                                }
                            }
                        }
                        let index = 0, path = new Path();
                        path.cost = vertex[index].cost;
                        while (index < len) {
                            let word = words[index];
                            if (word) {
                                path.push(word);
                                index = vertex[index].next;

                            } else {
                                reject("找不到word");
                                break;
                            }
                        }
                        resolve(path.format());
                    }).catch(e => reject(e));
                };
            });
        }
    }
    const Katakana2Hiragana = (str) => {
        if (!str) return '';
        let result = [];
        for (let s of str) {
            let p = s.codePointAt(0);
            if (0x30a0 < p && p < 0x30f5) {
                result.push(String.fromCharCode(p - 96));
            } else {
                result.push(s);
            }
        }
        return result.join('');
    }

    const buf = await requests({ method: "get", url: "https://raw.githubusercontent.com/Anong0u0/MeCabJS/master/naist-jdic.unknown.bin", type: "arraybuffer" })
    const array = new Uint16Array(buf.response);
    const unkDicAll = new Array(array.length / 4);
    for (let i = 0; i < unkDicAll.length; i++) {
        unkDicAll[i] = Object.assign({}, UNKNOWN_DEFINITION[array[i * 4 + 0]], {
            id: array[i * 4 + 1],
            cost: array[i * 4 + 2],
            pos: array[i * 4 + 3],
        });
    }
    const unkDicNormal = unkDicAll.filter(v => v.invoke);
    delete buf
    delete array

    String.prototype.mecabSplit = function() {
        return new Promise(r => {
            const lattice = new Lattice(this)
            new Promise((resolve, reject) => {
                lattice.lookup(unkDicNormal || [])
                    .then(() => lattice.tokenize(), e => reject(e))
                    .then(v => resolve(v), () => lattice.lookup(unkDicAll || []))
                    .then(() => lattice.tokenize())
                    .then(v => resolve(v))
                    .catch(e => reject(e));
            }).then(v => {
                const s = Katakana2Hiragana(v.map((e) => e.pron || e.orth || e.word).join(" ")).replace(/ 、 /g, "、").replace(/ -/g, "-")
                r(s)
            }).catch(()=>{r(String(this))})
        })
    };

    const splitLyrics = async () =>
    {
        const total = Object.keys(lyricsKana2Ateji).length
        lyricsSplited = GM_getValue(songID, {})
        let now = 0
        for(const kana in lyricsKana2Ateji)
        {
            now++
            const ateji = lyricsKana2Ateji[kana]
            if(ateji in lyricsSplited) continue
            lyricsSplited[kana] = await ateji.mecabSplit()
            tip.innerText = `分詞中(${now}/${total})...`
            GM.setValue(songID, lyricsSplited)
        }
        tip.remove()
    }
    if(GM_getValue("naist-jdic_init")) splitLyrics();

    if (!GM_getValue("naist-jdic_init", false)) {
        tip.innerText = `下載字典中...`

        const workerContent = `
    self.onmessage = e => {
    importScripts(e.data.gunzip);
    Promise.all([
        new Promise((resolve) => {
            fetch(e.data.bin).then(res => res.arrayBuffer()).then(buffer => {
                let u8array = new Zlib.Gunzip(new Uint8Array(buffer)).decompress();
                resolve(new Int16Array(u8array.buffer));
            });
        }),
        new Promise((resolve) => {
            fetch(e.data.tsv).then(res => res.arrayBuffer()).then(buffer => {
                let u8array = new Zlib.Gunzip(new Uint8Array(buffer)).decompress();
                resolve(new TextDecoder().decode(u8array).split('\\n'));
            });
        }),
    ]).then(values => {
        const openReq = indexedDB.open("naist-jdic");
        openReq.onupgradeneeded = e => {
            const db = e.target.result;
            db.createObjectStore('matrix', { keyPath: 'right' });
            db.createObjectStore('dictionary', { autoIncrement: true }).createIndex('index', 'word');
        };
        openReq.onsuccess = e => {
            const db = e.target.result;
            const tx = db.transaction(['matrix', 'dictionary'], 'readwrite');
            tx.oncomplete = e => {
                self.postMessage({ state: 'done' });
                self.close();
            };
            tx.onerror = e => {
                throw tx.error;
            };
            tx.onabort = tx.onerror;

            const matrix = tx.objectStore('matrix');
            const bin = values[0];
            const SizeX = bin[0] >>> 0, SizeY = bin[1] >>> 0;

            const dictionary = tx.objectStore('dictionary');
            const words = values[1];
            const SizeWords = words.length;

            const SumSize = SizeY + SizeWords,
                one = (SumSize*.01).toFixed(0);
            for (let i = 0; i < SizeY; i++) {
                const start = 2 + i * SizeY;
                const req = matrix.put({
                    right: i,
                    left: [...bin.subarray(start, start + SizeX)],
                });
                req.onsuccess = e => {if(i%one==0) self.postMessage({ state: 'processing', total: SumSize, now: i })}
            }

            for (let j = 0; j < SizeWords; j++) {
                const c = words[j].split('\\t');
                let token = {
                    word: c[0],
                    id: Number(c[1]),
                    cost: Number(c[2]),
                    pos: Number(c[3]),
                };
                if (c[4]) token.cjg = [ c[4], c[5] ];
                if (c[6]) token.base = c[6];
                if (c[7]) token.orth = c[7];
                if (c[8]) token.pron = c[8];
                const req = dictionary.put(token);
                req.onsuccess = e => {if((SizeY+j)%one==0) self.postMessage({ state: 'processing', total: SumSize, now: (SizeY+j) })}
            }
        };
        openReq.onerror = e => {throw 'データベースに接続できません';};
    }).catch(e => {
        self.postMessage({ state: 'error' });
        self.close();
    });
    }
    `
        const worker = new Worker(URL.createObjectURL(new Blob([workerContent], { type: 'text/javascript' })));

        const bin = URL.createObjectURL((await requests({ method: "get", url: "https://raw.githubusercontent.com/Anong0u0/MeCabJS/master/naist-jdic.matrix.bin.gz", type: "blob" })).response),
            tsv = URL.createObjectURL((await requests({ method: "get", url: "https://raw.githubusercontent.com/Anong0u0/MeCabJS/master/naist-jdic.min.tsv.gz", type: "blob" })).response),
            gunzip = URL.createObjectURL((await requests({ method: "get", url: "https://raw.githubusercontent.com/Anong0u0/MeCabJS/master/gunzip.min.js", type: "blob" })).response)

        let tipMsg = null;
        worker.onmessage = e => {
            e = e.data
            if(e.state == "processing")
            {
                const t = `整理字典中(${(e.now/e.total*100).toFixed(0)}%)...`
                if(tipMsg == t) return
                tipMsg = t
                tip.innerText = t
                return;
            }
            worker.terminate();
            if (e.state === 'done') {
                GM.setValue("naist-jdic_init", true)
                splitLyrics();
            }
            else if (e.state === 'error')
            {
                tip.innerText = `字典整理出錯`
                alert("羅馬拼音腳本執行錯誤");
            }
            delete bin
            delete tsv
            delete gunzip
        };
        worker.onerror = (e) => {
            console.log(e);
            tip.innerText = `字典整理出錯`
            alert("羅馬拼音腳本執行錯誤");
            worker.terminate()
        }
        worker.postMessage({ bin, tsv, gunzip });
    }
})()