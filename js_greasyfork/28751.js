// ==UserScript==
// @name           Iwara Extension Script
// @name:en        Iwara Extension Script
// @namespace      https://greasyfork.org/ja/users/115273-conn
// @description    Like数とLike率をバー表示 ＆ NG機能と強調機能 ＆ タイトル簡略化
// @description:en Adding Like bars, Like Ratio bars, BlackList, and FavList, Simplify titles
// @include        http://ecchi.iwara.tv/*
// @include        https://ecchi.iwara.tv/*
// @include        http://www.iwara.tv/*
// @include        https://www.iwara.tv/*
// @version        1.9
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/28751/Iwara%20Extension%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/28751/Iwara%20Extension%20Script.meta.js
// ==/UserScript==

//// パラメータ設定 ////

// ↓ リストのバー表示まわり
var likebaropacity = '0.8'; // Likeバーと枠の透明度。0(実質バー表示オフ)～1(通常)
var ratiotextopacity = '1.0'; // Like率テキストの透明度。0(実質数値表示オフ)～1(通常)
var ratiobaropacity = '0.5'; // Like率バーの透明度。0(実質バー表示オフ)～1(通常)
var borderthickness = '5'; // 枠の太さ。単位ピクセル。0なら枠なし
var borderopacity = '0.8'; // 枠の透明度。0(不可視)～1(通常)
var likemax = 200; // Likeバーのカンスト上限
var ratiomax = 3.0; // Like率バーのカンスト上限。単位パーセント

// ↓ NG表示設定
var NGopacity = '0.3'; // NGしたやつの透明度。0(完全非表示)～1(実質NGオフ)
var NGdispstat = true; // NGしたやつもバー表示する？
var showNGword = true; // ヒットしたNGワードを表示する？

// ↓ 強調表示設定
var emRGB = 'ffff77';  // 強調したやつの背景色。rrggbb。'ffffff' (白背景)なら実質強調オフ
var showEMword = true; // ヒットした強調ワードを表示する？

// ↓ 静画用設定
var doforimage = true; // 静画もする？
var likemaxi = 50; // 静画ページでのLikeバーのカンスト上限
var ratiomaxi = 4.0; // 静画ページでのLike率バーのカンスト上限。単位パーセント

// ↓ タイトル用設定
var listitlelength = 100; // 一覧に表示するタイトルの最大文字数（半角相当）。これ以上は省略される。だいたい28文字で2行
var titlearrangeatwatchpage = true; // 個別動画・静画視聴ページタイトルを変更する？ ※ 「(YYYY-MM-DD)[USERNAME] S-TITLE」に変更。ファイル名に使えない文字は全角置換

// ↓ NGワード。ほおりこめー
var NGWords = [
  'わたしがNGワードだ',
  'こんなふうにシングルクォートで囲って、最後にカンマを忘れずに',
  'NG索敵範囲は該当箇所のHTMLソース全てです',
  'タイトルも投稿者名も含みます',
  '↓とりあえず作者をNGに入れてみるテスト↓',
  'conn',
  '↑できれば外してくれると嬉しいかも…↑',
  /こうやってシングルクォートの代わりにスラッシュを使うと、正規表現もできます/,
  'このへんの説明、理解したら消しちゃってくださいね',
  'この最後の行だけはカンマ無しで'
];

// ↓ 強調ワード。大好き
var EMWords = [
  'わたしが強調ワードだ',
  'NGワードと同様です',
  '好きな投稿者やモデルを登録すると良いんじゃないかな',
  'やっぱりこの最後の行もカンマ無しで'
];

// ↓ グローバル設定が機能しない時用のデフォルト設定
var GMmode = 2; // モード (0:OFF、1:ON(赤)、2:ON(緑))
var GMdoNG = true; // NG機能使う？
var GMdoEM = true; // 強調機能使う？
var GMdoRatio = true; // LIKE率表示する？
var GMdoStitle = true; // タイトル簡略化する？

//// ！ここから開発用！ ////

var dummy = null;
var origelems = [];
var origbar = '';

// サブ関数、HTMLエスケープ //
function htmlsafestr (instr) {
    var str = instr;
    if(typeof str !== 'string') return str;
    str = str.replace(/^>/,'');
    str = str.replace(/<$/,'');
    return str.replace(/[&'`"<>\/\\]/g, function(match) {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
            '\/': '&#47;',
            '\\': '&#x5c;',
        }[match];
    });
}

// サブ関数、ファイル名に使えない文字を全角に変更 //
function filenamesafestr (instr) {
    var str = instr;
    if(typeof str !== 'string') return str;
    str = str.replace(/&amp;/g,'＆');
    return str.replace(/[\\\/&'`"<>:\*\?\|]/g, function(match) {
        return {
            '\\': '￥',
            '\/': '／',
            '&': '＆',
            "'": '’',
            '`': '´',
            '"': '”',
            '<': '＜',
            '>': '＞',
            ':': '：',
            '\*': '＊',
            '\?': '？',
            '\|': '｜',
        }[match];
    });
}

// サブ関数、タイトルからお馴染みの記載を削除 //
function simplifystr (instr) {
    var str = instr;
    if(typeof str !== 'string') return str;
    str = str.replace(/　/g,' '); // 全角空白
    str = str.replace(/[mMＭ]{2}[dDＤ]/g,''); // 「MMD」等
    str = str.replace(/[ \-]*[rRＲ] ?\-? ?[1１][5５8８]/g,''); // 「R-18」等
    str = str.replace(/[ \-]*[1１][5５8８] ?\-? ?[rRＲ]/g,''); // 「18R」等
    str = str.replace(/[0-9]{2,}[fF][pP][sS]/g,''); // 「60fps」等
    str = str.replace(/[0-9]{3,}[pPｐＰ]/g,''); // 「1080p」等
    str = str.replace(/Full\-HD/g,''); // Full-HD
    str = str.replace(/紳士向け/g,''); // 紳士向け
    str = str.replace(/紳士動画/g,''); // 紳士動画
    str = str.replace(/&[a-z0-9#]+;([a-z0-9#]+);/g,'&$1;'); // エスケープ文字エラー修正
    str = str.replace(/([\[\(「【＜])[ _\/]/g,'$1'); // 括弧内先頭空白削除
    str = str.replace(/[ _\/]([\]\)」】＞])/g,'$1'); // 括弧内末尾空白削除
    str = str.replace(/\[[ \-_\/:：,]*\]/g,''); // 削除後の残った[]
    str = str.replace(/\([ \-_\/:：,]*\)/g,''); // 削除後の残った()
    str = str.replace(/【[ \-_\/:：,]*】/g,''); // 削除後の残った【】
    str = str.replace(/「[ \-_\/:：,]*」/g,''); // 削除後の残った「」
    str = str.replace(/（[ \-_\/:：,]*）/g,''); // 削除後の残った（）
    str = str.replace(/＜[ \-_\/:：,]*＞/g,''); // 削除後の残った＜＞
    str = str.replace(/^[ _\/]+/g,''); // 先頭の空白
    str = str.replace(/[ _\/]+$/g,''); // 末尾の空白
    str = str.replace(/[ ]{2,}/g,' '); // 2個以上の空白
    return str;
}

// サブ関数、文字列から指定された長さ以上を省略 //
function trimstr (instr,maxlen) {
    var twobytelen = 1.3; // 2バイト文字の幅の倍率
    var str = instr;
    if(typeof str !== 'string') return str;
    var i = 0;
    var char = '';
    var charue = '';
    var count = 0;
    var trimidx = str.length;
    var isover = false;
    var isescaping = false;
    for (i = 0; i < str.length ; i++) {
        char = str.charAt(i);
        if (char == '&'){
            isescaping = true;
        } else if (char == ';') {
            isescaping = false;
        }
        if (!isescaping) {
            charue = escape(char);
            if (charue.length < 4) {
                count++;
            } else {
                count+=twobytelen;
            }
            if (count > maxlen) {
                trimidx = i;
                isover = true;
                i = str.length;
            }
        }
    }
    if (isover) {
        str = str.substr(0,trimidx);
        str += '...';
    }
    return str;
}

// サブ関数、文字列をクリップボードへコピー //
function copytext(string){
    var temp = document.createElement('textarea');

    temp.value = string;
    temp.selectionStart = 0;
    temp.selectionEnd = temp.value.length;

    var s = temp.style;
    s.position = 'fixed';
    s.left = '-100%';

    document.body.appendChild(temp);
    temp.focus();
    var result = document.execCommand('copy');
    temp.blur();
    document.body.removeChild(temp);
    // true なら実行できている falseなら失敗か対応していないか
    return result;
}

//// 動画一覧ページ用 ////
function listmanip () {

    // 初期化
    var likes = null;
    var disps = null;
    var likebarstr = '';
    var ratiobarstr = '';
    var dispnum = 0;
    var likenum = 0;
    var ratio = 0;
    var likewidth = 0;
    var ratiowidth = 0;
    var likenR = 0;
    var rationB = 0;
    var likeRGB = '255,0,0';
    var ratioRGBA = '0,0,255,1';
    var dummy,dummy2 = null;
    var elem = '';
    var nghit = false;
    var ngword = '';
    var emword = '';
    var elems = null;
    var title = '';
    var titleshort = '';
    var author = '';
    var switchstr = '';
    var i,j = 0;

    // グローバル設定読み込み
    if(typeof(GM_getValue) === 'function'){
        elem = GM_getValue('mode');
        if (isNaN(elem)) {
            GM_setValue('mode', GMmode);
        }else {
            GMmode = elem;
        }
        elem = GM_getValue('doNG');
        if (elem === null) {
            GM_setValue('doNG', GMdoNG);
        }else {
            GMdoNG = elem;
        }
        elem = GM_getValue('doEM');
        if (elem === null) {
            GM_setValue('doEM', GMdoEM);
        }else {
            GMdoEM = elem;
        }
        elem = GM_getValue('doRatio');
        if (elem === null) {
            GM_setValue('doRatio', GMdoRatio);
        }else {
            GMdoRatio = elem;
        }
        elem = GM_getValue('doStitle');
        if (elem === null) {
            GM_setValue('doStitle', GMdoStitle);
        }else {
            GMdoStitle = elem;
        }
    }

    // スイッチ
    elems = document.body.getElementsByClassName('menu nav nav-pills pull-left');
    if(elems.length > 0) {
        if(origbar === ''){
            origbar = elems[0].innerHTML;
        }
        switchstr = '$&<li class="leaf"><button type="button" id="exttoggle"';
        if (GMmode === 0) {
            switchstr += '>Ext Off<\/botton><\/li>\n';
        } else if (GMmode === 1) {
            switchstr += ' style="background-color:#ee0000;color:white">Ext On (Red)';
        } else {
            switchstr += ' style="background-color:#00dd00;color:white">Ext On (Green)';
        }
        switchstr += '<\/botton><\/li>\n';
        if (GMmode > 0) {
            switchstr += '<li class="leaf"><button type="button" id="ngtoggle"';
            if (GMdoNG) {
                switchstr += ' style="background-color:#ee0000;color:white"';
            }
            switchstr += '>NG<\/botton><\/li>\n';
            switchstr += '<li class="leaf"><button type="button" id="emtoggle"';
            if (GMdoEM) {
                switchstr += ' style="background-color:#00bb00;color:white"';
            }
            switchstr += '>EM<\/botton><\/li>\n';
            switchstr += '<li class="leaf"><button type="button" id="ratiotoggle"';
            if (GMdoRatio) {
                switchstr += ' style="background-color:#0000ff;color:white"';
            }
            switchstr += '>Ratio<\/botton><\/li>\n';
            switchstr += '<li class="leaf"><button type="button" id="stitletoggle"';
            if (GMdoStitle) {
                switchstr += ' style="background-color:#a52a2a;color:white"';
            }
            switchstr += '>S-Title<\/botton><\/li>\n';
        }
        elem = origbar.replace(/\n<li title=""><a href="\/forum" title="">フォーラム<\/a><\/li>\n/, switchstr);
        elems[0].innerHTML = elem;
    }

    // スイッチ押された時
    if (typeof(GM_setValue) === 'function'){
        elems = document.getElementById('exttoggle');
        if (elems !== null) {
            elems.onclick = function () {
                if (GMmode > 1) { GMmode = 0;} else {GMmode++;}
                GM_setValue('mode',GMmode);
                listmanip();
            };
        }
        elems = document.getElementById('ngtoggle');
        if (elems !== null) {
            elems.onclick = function () {
                GMdoNG  = !GMdoNG;
                GM_setValue('doNG',GMdoNG);
                listmanip();
            };
        }
        elems = document.getElementById('emtoggle');
        if (elems !== null) {
            elems.onclick = function () {
                GMdoEM  = !GMdoEM;
                GM_setValue('doEM',GMdoEM);
                listmanip();
            };
        }
        elems = document.getElementById('ratiotoggle');
        if (elems !== null) {
            elems.onclick = function () {
                GMdoRatio  = !GMdoRatio;
                GM_setValue('doRatio',GMdoRatio);
                listmanip();
            };
        }
        elems = document.getElementById('stitletoggle');
        if (elems !== null) {
            elems.onclick = function () {
                GMdoStitle  = !GMdoStitle;
                GM_setValue('doStitle',GMdoStitle);
                listmanip();
            };
        }
    } else {
        elems[0].innerHTML += '<li class="leaf" title="Your environments don\'t allow GM_ functions. Please switch the setting on the script code directly." style="color:red">* Can\'t Switch<\/li>\n';
    }

    // 動画リスト取得
    elems = document.body.getElementsByClassName('node node-video node-teaser node-teaser clearfix');

    // 各エントリ初期化
    if (typeof(origelems[0]) === 'undefined') {
        for (i = 0; i < elems.length; i++) {
            origelems[i] = elems[i].innerHTML;
        }
    } else {
        for (i = 0; i < elems.length; i++) {
            elems[i].innerHTML = origelems[i];
            elems[i].removeAttribute('style');
        }
    }

    // 設定オフ時引き返す
    if (GMmode === 0) {
        return;
    }

    // 各エントリ操作
    for (i = 0; i < elems.length; i++) {
        elem = elems[i].innerHTML;

        // タイトル取得
        dummy = elem.match(/<img src=".+ title="([^"]+)".+>/);
        if (dummy !== null) {
            title = dummy[1];
            if (GMdoStitle) {title = simplifystr(title);}
            title = trimstr(title,listitlelength);
        } else {
            dummy = elem.match(/<h3 class="title"><a href=".*">(.*)<\/a><\/h3>/);
            if (dummy !== null) {
                title = dummy[1];
                if (GMdoStitle) {title = simplifystr(title);}
            } else {
                title = '';
            }
        }

        // 作者取得
        dummy = elem.match(/class="username">(.*)<\/a>/);
        if (dummy !== null) {
            author = dummy[1];
        } else {
            author = '';
        }

        // NG機能
        nghit = false;
        if (GMdoNG) {
            for (j = 0; j < NGWords.length; j++) {
                dummy = elem.match(NGWords[j]);
                if (dummy !== null) {
                    ngword = htmlsafestr(dummy[0]);
                    title = title.replace(ngword,'<span style="background-color:orangered;color:white">'+ngword+'<\/span>');
                    author = author.replace(ngword,'<span style="background-color:orangered;color:white">'+ngword+'<\/span>');
                    elems[i].setAttribute('style','opacity:' + NGopacity);
                    if (showNGword) {
                        elem = elem.replace(/(<\/div>\n)(\n\t+<\/div>)/,'$1<br><div class="left-icon likes-icon" style="color:red; background:rgba(255,255,255,0.5)"> NG:'+ngword+'<\/div>\n$2');
                    }
                    nghit = true;
                    j = NGWords.length;
                }
            }
        }

        // 強調機能
        if (GMdoEM) {
            for (j = 0; j < EMWords.length; j++) {
                dummy = elem.match(EMWords[j]);
                if (dummy !== null) {
                    emword = dummy[0];
                    title = title.replace(emword,'<span style="background-color:#aaffaa">'+emword+'<\/span>');
                    author = author.replace(emword,'<span style="background-color:#aaffaa">'+emword+'<\/span>');
                    elems[i].setAttribute('style','background-color:#' + emRGB);
                    if (showEMword) {
                        elem = elem.replace(/(<\/div>\n)(\n\t+<\/div>)/,'$1<br><div class="left-icon likes-icon" style="color:green; background:rgba(255,255,255,0.5)"> EM:'+emword+'<\/div>\n$2');
                    }
                    j = EMWords.length;
                }
            }
        }

        elem = elem.replace(/(<h3 class="title"><a href=".*">).+(<\/a><\/h3>)/,'$1'+title+'$2');
        elem = elem.replace(/(class="username">).*(<\/a>)/,'$1'+author+'$2');

        // バー表示機能
        if (NGdispstat || !nghit) {
            likes = elem.match(/heart\"><\/i> (\d+)/);
            disps = elem.match(/open\"><\/i> ([0-9\.]+)k/);
            if (disps !== null) {
                dispnum = parseFloat(disps[1]) * 1000;
            } else {
                disps = elem.match(/open\"><\/i> ([0-9]+)/);
                dispnum = parseFloat(disps[1]);
            }
            if (likes !== null) {
                likenum = parseInt(likes[1]);
                likewidth = Math.min(Math.floor(likenum * 70 / likemax + 40), 110);
                likenR = 255 - Math.min(Math.floor(likenum * 205 / likemax + 50), 255);
                if (GMmode === 1) {
                    likeRGB = '255,' + likenR.toString()+ ',' + likenR.toString(); // red
                } else {
                    likeRGB = likenR.toString()+ ',240,' + likenR.toString(); // green
                }
                likebarstr = 'right-icon likes-icon" align="right" style="width:' + likewidth.toString() + 'px; background-color:rgba\(' + likeRGB + ',' + likebaropacity + '\)"';
                elem = elem.replace(/right-icon likes-icon\"/, likebarstr);
                // Like率
                if (GMdoRatio) {
                    ratio = 100 * likenum / dispnum;
                    ratiowidth = Math.min(Math.floor(ratio * 70 / ratiomax + 40), 110);
                    rationB = 255 - Math.min(Math.floor(ratio * 205 / ratiomax + 50), 255);
                    ratioRGBA = rationB.toString()+ ',' + rationB.toString() + ',255,' + ratiobaropacity;
                    ratiobarstr = '$&<br>\n\t\t\t<div class="right-icon likes-icon" align="right" style="width:' + ratiowidth.toString() + 'px; background:rgba\(' + ratioRGBA + '\)"><span style="opacity:' + ratiotextopacity + '">' + (ratio.toFixed(1)).toString() + '%</span></div>';
                    elem = elem.replace(/open.*div>/, ratiobarstr);
                }
                elem = elem.replace(/height=\"150\"/, 'height="150" style="border:solid ' + borderthickness + 'px rgba\(' + likeRGB + ',' + borderopacity + '\)"');
            }
        }
        elems[i].innerHTML = elem;
    }

    // 静画エントリ用
    if (doforimage) {
        elems = document.body.getElementsByClassName('node node-image node-teaser node-teaser clearfix');
        for (i = 0; i < elems.length; i++) {
            elem = elems[i].innerHTML;

            // タイトル取得
            dummy = elem.match(/<h3 class="title"><a href=".*">(.*)<\/a><\/h3>/);
            if (dummy !== null) {
                title = dummy[1];
                if (GMdoStitle) {title = simplifystr(title);}
            } else {
                title = '';
            }

            // 作者取得
            dummy = elem.match(/class="username">(.*)<\/a>/);
            if (dummy !== null) {
                author = dummy[1];
            } else {
                author = '';
            }

            // NG機能
            nghit = false;
            if (GMdoNG) {
                for (j = 0; j < NGWords.length; j++) {
                    dummy = elem.match(NGWords[j]);
                    if (dummy !== null) {
                        ngword = htmlsafestr(dummy[0]);
                        title = title.replace(ngword,'<span style="background-color:orangered;color:white">'+ngword+'<\/span>');
                        author = author.replace(ngword,'<span style="background-color:orangered;color:white">'+ngword+'<\/span>');
                        elems[i].setAttribute('style','opacity:' + NGopacity);
                        if (showNGword) {
                            elem = elem.replace(/(<\/div>\n)(\t+<\/div>)/,'$1<br><div class="left-icon likes-icon" style="color:red; background:rgba(255,255,255,0.5)"> NG:'+NGWords[j]+'<\/div>\n$2');
                        }
                        nghit = true;
                        j = NGWords.length;
                    }
                }
            }

            // 強調機能
            if (GMdoEM) {
                for (j = 0; j < EMWords.length; j++) {
                    dummy = null;
                    dummy = elem.match(EMWords[j]);
                    if (dummy !== null) {
                        emword = dummy[0];
                        title = title.replace(emword,'<span style="background-color:#aaffaa">'+emword+'<\/span>');
                        author = author.replace(emword,'<span style="background-color:#aaffaa">'+emword+'<\/span>');
                        elems[i].setAttribute('style','background-color:#' + emRGB);
                        if (showEMword) {
                            elem = elem.replace(/(<\/div>\n)(\t+<\/div>)/,'$1<br><div class="left-icon likes-icon" style="color:green; background:rgba(255,255,255,0.5)"> EM:'+EMWords[j]+'<\/div>\n$2');
                        }
                        j = EMWords.length;
                    }
                }
            }

            elem = elem.replace(/(<h3 class="title"><a href=".*">).*(<\/a><\/h3>)/,'$1'+title+'$2');
            elem = elem.replace(/(class="username">).*(<\/a>)/,'$1'+author+'$2');

            // バー表示機能
            if (NGdispstat || !nghit) {
                likes = elem.match(/heart\"><\/i> (\d+)/);
                disps = elem.match(/open\"><\/i> ([0-9\.]+)k/);
                if (disps !== null) {
                    dispnum = parseFloat(disps[1]) * 1000;
                } else {
                    disps = elem.match(/open\"><\/i> ([0-9]+)/);
                    dispnum = parseFloat(disps[1]);
                }
                if (likes !== null) {
                    likenum = parseInt(likes[1]);
                    likewidth = Math.min(Math.floor(likenum * 70 / likemaxi + 40), 110);
                    likenR = 255 - Math.min(Math.floor(likenum * 205 / likemaxi + 50), 255);
                    if (GMmode === 1) {
                        likeRGB = '255,' + likenR.toString()+ ',' + likenR.toString(); // red
                    } else {
                        likeRGB = likenR.toString()+ ',240,' + likenR.toString(); // green
                    }
                    likebarstr = 'right-icon likes-icon" align="right" style="width:' + likewidth.toString() + 'px; background-color:rgba\(' + likeRGB + ',' + likebaropacity + '\)"';
                    elem = elem.replace(/right-icon likes-icon\"/, likebarstr);
                    // Like率
                    if (GMdoRatio) {
                        ratio = 100 * likenum / dispnum;
                        ratiowidth = Math.min(Math.floor(ratio * 70 / ratiomax + 40), 110);
                        rationB = 255 - Math.min(Math.floor(ratio * 205 / ratiomax + 50), 255);
                        ratioRGBA = rationB.toString()+ ',' + rationB.toString() + ',255,' + ratiobaropacity;
                        ratiobarstr = '$&<br>\n\t\t\t<div class="right-icon likes-icon" align="right" style="width:' + ratiowidth.toString() + 'px; background:rgba\(' + ratioRGBA + '\)"><span style="opacity:' + ratiotextopacity + '">' + (ratio.toFixed(1)).toString() + '%</span></div>';
                        elem = elem.replace(/open.*div>/, ratiobarstr);
                    }
                    elem = elem.replace(/height=\"150\"/, 'height="150" style="border:solid ' + borderthickness + 'px rgba\(' + likeRGB + ',' + borderopacity + '\)"');
                }
            }
            elems[i].innerHTML = elem;
        }
    }
}

//// 視聴ページ用 ////
function watchpagemanip(type) {
    // タイトル変更
    if (titlearrangeatwatchpage) {
        var dummy = document.body.getElementsByClassName('node-info');
        if (dummy !== null) {
            var nodeinfo = dummy[0].innerHTML;
            dummy = nodeinfo.match(/<h1 class="title">(.*)<\/h1>/);
            var title = dummy[1];
            // タイトル簡略化
            if(typeof(GM_getValue) === 'function'){
                GMdoStitle = GM_getValue('doStitle');
            }
            if (GMdoStitle) {title = simplifystr(title);}
            // 作者名取得
            dummy = nodeinfo.match(/class="username">(.*)<\/a>/);
            var username = dummy[1];
            // 日付取得
            var datestamp = nodeinfo.match(/20[0-9]{2}-[0-9]{2}-[0-9]{2}/);
            // ファイル名に使える感じに整形
            var newtitle = '\('+datestamp+'\)['+username+'] '+title;
            newtitle = filenamesafestr(newtitle);

            // 以下のコメントアウト部分は作者の自分用楽ちん保存カスタマイズ。他の人が幸せになれるかは知らぬい
            /*
            // NGヒットした作品はファイル名に"(NG)"を追加する
            for (j = 0; j < NGWords.length; j++) {
                dummy = newtitle.match(NGWords[j]);
                if (dummy !== null) {
                    newtitle += ' (NG)';
                    j = NGWords.length;
                }
            }
            // ファイル名末尾に_360pを追加
            newtitle += '_360p';
            // 「ダウンロード」ボタンを押すと同時にクリップボードに整形ファイル名をコピー
            document.getElementById('download-button').onclick = function () {
                copytext(newtitle);
            };
            */

            document.title = newtitle; // タイトル変更
        }
    }
}

//// メイン関数 ////
function main() {
    var currenturl = location.href;
    dummy = currenturl.match(/\.iwara\.tv\/videos\//);
    if (dummy !== null) { // 動画視聴ページ
        watchpagemanip('video');
    } else {
        dummy = currenturl.match(/\.iwara\.tv\/images\//);
        if (dummy !== null) { // 静画視聴ページ
            watchpagemanip('image');
        } else { // その他
            listmanip();
        }
    }
}

//// ここから生スクリプト ////
main();
