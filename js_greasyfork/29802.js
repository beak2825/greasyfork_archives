// ==UserScript==
// @name         Downbooru
// @name:en      Downbooru
// @namespace    https://greasyfork.org/ja/scripts/29802-downbooru
// @version      2.2.2
// @description  danbooruに画像をダウンロードするボタンを追加する。画像にはタグ(XP Keywords)が付与される。Picasa3と相性がいい。
// @description  PNGはExifが無いためJPGに変換。サイズの大きい画像は縮小される。
// @description:en donwloads an image added tags from danbooru
// @author       You
// @match        *danbooru.donmai.us
// @match        *danbooru.donmai.us/posts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29802/Downbooru.user.js
// @updateURL https://update.greasyfork.org/scripts/29802/Downbooru.meta.js
// ==/UserScript==

//参考:canvas https://blog.agektmr.com/2013/09/canvas-png-blob.html
//参考:deferred http://hamalog.tumblr.com/post/5159447047/jquerydeferredって何
//参考:http://qiita.com/geek_duck/items/2db28daa9e27df9b861d
//参考:http://qiita.com/zaru/items/878b892e4debf03785e3 JavaScriptやjQueryでイベントを削除して再登録する方法

//HideButtonの親を取得→タグ、画像ソース、ID取得
//LargeButtonの親を取得→タグ、画像ソース、ID取得
(function () {
    //ページ読み込んですぐと、
    setHideButton();
    setLargeButton();

    //スクロールするたびに要素を探して追加する。
    window.onscroll = (function () {
        setHideButton();
        setLargeButton();
    });

    //サムネイルにのせるためのボタンを設置する。
    function setHideButton() {
        var button_parent = getHideBParent();

        for (var i = 0; i < button_parent.length; i++) {
            //ボタンが既についていることを示す目印をつける
            $(button_parent[i]).attr('have-button', 'true');
            
            var button = createHideButton($(button_parent[i]));
            button.css({
                'background-color': '#A85',
                '-moz-border-radius': 2,
                '-webkit-border-radius': 2,
                'border-radius': 2,
                'border-style': 'none',
                'font-weight': 'bold',
                'position': 'absolute',
                'right': 0,
                'bottom': 0,
                'opacity': 0.4,
                'width': '2em',
                'height': '2em'
            });

            button.hover(function () {
                $(this).css({'opacity': 0.6, 'font-size': '1.214em'});
            }, function () {
                $(this).css({'opacity': 0.4, 'font-size': '1em'});
            });

            button[0].addEventListener("click", function () {
                var button = $(this);

                button[0].removeEventListener("click", arguments.callee, false);
                button.unbind('mouseenter').unbind('mouseleave');
                button.text('...').css({'opacity': 0.8, 'font-size': '1em'});

                var src = button.attr('data-file-url');
                var tags = button.attr('data-tags').split(' ');
                var file = button.attr('data-id');

                downloadImageWithTags(src, tags, file).then(function () {
                    button.text('✔').css({
                        'background-color': '#FFF',
                        'color': '#A85',
                        'border-style': 'solid',
                        'border-width': 'midium',
                        'border-color': '#A85'
                    });
                });
            }, false);

            $(button_parent[i]).append(button);
        }
    }

    //参考:http://qiita.com/piyohiko/items/a84648599eba7697675f Javascriptのswitch文で正規表現を使う
    function getHideBParent() {
        //have-buttonはボタンがついていることを示す目印
        var parent = $('article[data-id]:not([have-button])');
        return parent;
    }

    function createHideButton(parent) {
        var button = $('<button>').text('DL')
                .attr({
                    'data-tags': parent.attr('data-tags'),
                    'data-file-url': parent.attr('data-file-url'),
                    'data-id': "danbooru" + parent.attr('data-id') + ".jpg"
                });
        return button;
    }

    function setLargeButton() {
        var button_parent = getLargeBParent();

        for (var i = 0; i < button_parent.length; i++) {
            if (!$(button_parent[i]).find('button')[0]) {
                var button = createLargeButton($(button_parent[i]));
                button.css({
                    'background-color': '#A85',
                    'border-style': 'solid',
                    'border-width': 'midium',
                    'border-color': '#000',
                    'font-weight': 'bold',
                    'width': 85,
                    'height': 22
                });

                button.hover(function () {
                    $(this).css({'color': '#FFF'});
                }, function () {
                    $(this).css({'color': '#000'});
                });

                button[0].addEventListener("click", function () {
                    var button = $(this);

                    button[0].removeEventListener("click", arguments.callee, false);
                    button.unbind('mouseenter').unbind('mouseleave');
                    button.text('.....').css({'color': '#000'});

                    var src = button.attr('data-file-url');
                    var tags = button.attr('data-tags').split(' ');
                    var file = button.attr('data-id');

                    downloadImageWithTags(src, tags, file).then(function () {
                        button.text('Complete!').css({'background-color': '#FFF', 'color': '#A85', 'border-color': '#A85'});
                    });
                }, false);

                $(button_parent[i]).append(button);
            }
        }
    }

    function getLargeBParent() {
        parent = $('section[data-id]');
        return parent;
    }

    function createLargeButton(parent) {
        var button = $('<button>').text('Download')
                .attr({
                    'data-tags': parent.attr('data-tags'),
                    'data-file-url': parent.attr('data-file-url'),
                    'data-id': "danbooru" + parent.attr('data-id') + ".jpg"
                });
        return button;
    }

    function downloadImageWithTags(src, tags, name) {
        var dfd = new $.Deferred();
        var exif = createExif(tags);
        getImgDataurl(src).then(function (dataurl) {
            var blob = insertExif(exif, dataurl);
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = name;
            a.click();
            dfd.resolve();
        });
        return dfd.promise();
    }

    function getImgDataurl(url) {
        var dfd = new $.Deferred();
        var img = new Image();
        img.src = url;
        var canvas = document.createElement('canvas');
        img.onload = function () {
            canvas.setAttribute('width', img.width);
            canvas.setAttribute('height', img.height);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var jpg_src = canvas.toDataURL('image/jpeg');
            if (jpg_src.split(',')[1]) {
                dfd.resolve(jpg_src);
            } else {
                var wid;
                var hei;
                wid = 850;
                hei = 850 * img.height / img.width;
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, wid, hei);
                jpg_src = canvas.toDataURL('image/jpeg');
                dfd.resolve(jpg_src);
            }
        };
        return dfd.promise();
    }

    function createExif(list) {
        var bim = "50686f746f73686f7020332e30003842494d040400000000";
        var hex_list = [];
        for (var i = 0; i < list.length; i++) {
            hex_list[i] = strToHex(list[i]);
        }

        var tags = "1c021900" + tagLength(hex_list[0]) + hex_list[0] + "1c020000020004";
        for (var i = 1; i < hex_list.length; i++) {
            tags = tags + "1c021900" + tagLength(hex_list[i]) + hex_list[i];
        }
        tags = wholeTagLength(tags) + tags;
        //XX XX [BIM] [TAGS]
        var seg_len = (2 + bim.length / 2 + tags.length / 2).toString(16);
        if (seg_len.length > 4) {
            console.log("タグのデータ量が限界を超えました");
            return;
        }
        seg_len = "000" + seg_len;
        seg_len = seg_len.slice(-4);
        var exif = "ffed" + seg_len + bim + tags;
        return exif;
    }

    function insertExif(exif, dataurl) {
        var bin = atob(dataurl.split(",")[1]);
        var buffer = new Uint8Array(bin.length + exif.length / 2);
        for (var i = 0; i < 20; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        for (var bf_i = 20, ex_j = 0; ex_j < exif.length / 2; bf_i++,
                ex_j++) {
            buffer[bf_i] = parseInt(exif.slice(ex_j * 2, ex_j * 2 + 2), 16);
        }
        for (var bf_i = 20 + exif.length / 2, bin_j = 20; bin_j < bin.length; bf_i++,
                bin_j++) {
            buffer[bf_i] = bin.charCodeAt(bin_j);
        }
        var blob = new Blob([buffer.buffer], {
            type: 'image/jpeg'
        });
        return blob;
    }

//引数はhexで
    function tagLength(str) {
        var len = (str.length / 2).toString(16);
        len = ("0" + len).slice(-2);
        return len;
    }

//引数はhexで
    function wholeTagLength(str) {
        var len = (str.length / 2).toString(16);
        len = ("000" + len).slice(-4);
        return len;
    }

    function strToHex(str) {
        var hex = "";
        for (var i = 0; i < str.length; i++) {
            hex = hex + str.charCodeAt(i).toString(16);
        }
        return hex;
    }

    function strToU8(str) {
        var buffer = new Uint8Array(str.length);
        for (var i = 0; i < buffer.length; i++) {
            buffer[i] = str.charCodeAt(i);
        }
        return buffer;
    }

    function hexToU8(str) {
        var buffer = new Uint8Array(str.length / 2);
        for (var i = 0; i < buffer.length; i++) {
            buffer[i] = parseInt(str.slice(i * 2, i * 2 + 2), 16);
        }
        return buffer;
    }

//テスト用 16進数文字列をアルファベットに変換する
    function hexToChar(str) {
        var char = "";
        for (var i = 0; i < str.length / 2; i++) {
//4a→74→J
            char = char + String.fromCharCode(parseInt(str.slice(i * 2, i * 2 + 2), 16));
        }
        return char;
    }
}
)();