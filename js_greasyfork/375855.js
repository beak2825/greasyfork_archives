
// ==UserScript==
// @name     イザマシティマップ
// @version  0.1
// @namespace ibara_izamap
// @description 騒乱イバラシティのシティマップにハザマのマップを合成表示する。
// @match http://lisge.com/ib/map.php*
// @run-at document-idle
// @grant    GM_getValue
// @grant    GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/375855/%E3%82%A4%E3%82%B6%E3%83%9E%E3%82%B7%E3%83%86%E3%82%A3%E3%83%9E%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/375855/%E3%82%A4%E3%82%B6%E3%83%9E%E3%82%B7%E3%83%86%E3%82%A3%E3%83%9E%E3%83%83%E3%83%97.meta.js
// ==/UserScript==

// onload
var $ = unsafeWindow.jQuery;
var __IZAMA_ENABLE__ = GM_getValue('enable', true);

// beforeunload
window.addEventListener('beforeunload', function(){GM_setValue( 'enable', __IZAMA_ENABLE__ )});

$(function() {

    var __BLEND_MAP__; // {ImageData}合成画像データ
    var __ORIGIN_MAP__; // {string}イバラマップ画像url文字列

    // チェックボックス変更時イベント
    $('body').on('change','#izamap-enable', function() {
        __IZAMA_ENABLE__ = $(this).prop('checked');
        swap_map(__IZAMA_ENABLE__);
    });

    // 設定窓を追加
    $('body').append( box_html(__IZAMA_ENABLE__) );

    // 初回RUN
    if (__IZAMA_ENABLE__) {swap_map(__IZAMA_ENABLE__)};

// 以下 function ===========================================================

    // マップを書き換え
    // {boolean}flag : 書き換えモード true:イザマップ, false:イバラマップ
    function swap_map(flag) {
        var jQmap_pos = getMapPos();
        if (flag) {
            //// イザマップに書き換え
            // 元のマップデータがなければ保存
            if (__ORIGIN_MAP__ == undefined) {
                __ORIGIN_MAP__ = jQmap_pos.css('background-image');
            }

            // 描画用canvas作成
            jQmap_pos.before( canvas_html(jQmap_pos.width(), jQmap_pos.height()) );

            // 描画
            drow_izamap(jQmap_pos.prev());
        }else{
            // イバラマップに戻す
            jQmap_pos.next().css('background-image',__ORIGIN_MAP__);
            jQmap_pos.remove();
        }
    }

    // イザマップ描画
    // {jQuery}target : 描画対象
    function drow_izamap(target) {
        var width = target.width(), height = target.height();
        // 作業用canvasの作成
        $('body').append( tmp_camvas_html(width, height) );
        var ctx_tmp1 = $('#izamap-tmp1')[0].getContext('2d');
        var ctx_tmp2 = $('#izamap-tmp2')[0].getContext('2d');

        // 画像ファイルの読み込み
        Promise.all( [ loadimg(__ORIGIN_MAP__.slice(5,-2)), loadimg(hasamap_url(__ORIGIN_MAP__)) ] )
            .then( function ( imgs ) {
            if (imgs[1]) {
                ctx_tmp1.drawImage(imgs[0],0,0)
                ctx_tmp2.drawImage(imgs[1],0,0)

                // 画像データ取得
                var tmp1 = ctx_tmp1.getImageData(0,0,width, height);
                var tmp2 = ctx_tmp2.getImageData(0,0,width, height);
                target[0].getContext('2d').putImageData(tmp1,0,0);
                target[0].getContext('2d').putImageData(tmp2,0,0);

                // αブレンド
                __BLEND_MAP__ = alphaBlend(tmp1,tmp2,160);

                // 合成したマップを描画
                target[0].getContext('2d').putImageData(__BLEND_MAP__,0,0);
            }else{
                target[0].getContext('2d').drawImage(imgs[0],0,0);
            }

            //元のマップ消去
            target.next().css('background-image', '');
        });
    }

    // マップ領域を取得
    // return jQueryオブジェクト
    function getMapPos() {
        var jQmap_pos;
        if ( window.location.search == '' ) {
            // 全体マップ
            jQmap_pos = $('div.MXM').children(':eq(3)');
        } else {
            // 区マップ
            jQmap_pos = $('div.MXM').children(':eq(3)').children(':eq(8)');
        }
        return jQmap_pos;
    }

    //イバラマップ画像urlをハザママップurlに変更
    // {string}ibaramap: p/map{n}bg.png   : n in 1..16   OR   p/citymap.png
    // return    p/hazamap{n}.png : n in 1..16   OR   p/hazamap.png
    function hasamap_url (ibaramap) {
        // 全体マップの場合
        if (ibaramap.match(/p\/citymap\.png/)) {
            return 'http://lisge.com/ib/p/hazamap.png';
        }

        // 区マップの場合
        var find = ibaramap.match(/p\/map(\d+)bg\.png/);
        if (find !== null) {
            return 'http://lisge.com/ib/p/hazamap' + find[1] + '.png';
        } else {
            // 想定外エラー
        }
    }

// 以下 sub_function ===========================================================

    // 画像のαブレンド
    // {ImageData}src
    // {ImageData}dst
    // {floot}a, 透過率; 0 <= a <= 255; default 128
    function alphaBlend(src, dst, a) {
        a || (a = 128);
        a = a/255;
        for (var i=0,l=src.data.length/4;i<l;i++) {
            var offset = i*4;
            dst.data[offset + 0] = dst.data[offset + 0] * (1-a) + src.data[offset + 0] * a;
            dst.data[offset + 1] = dst.data[offset + 1] * (1-a) + src.data[offset + 1] * a;
            dst.data[offset + 2] = dst.data[offset + 2] * (1-a) + src.data[offset + 2] * a;
            dst.data[offset + 3] = dst.data[offset + 3] * (1-a) + src.data[offset + 3] * a;
        }
        return dst;
    }

    function loadimg (src) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (e) => {
                resolve(null);
            };
            img.src = src;
        });
    };

    function box_html(flag) {return '<p style="position: fixed; bottom:2%; left:2%; background: #ccc; border:solid 2px; padding:10px; color: #000">ハザマを合成する<input id="izamap-enable" type="checkbox" '+ (flag ? 'checked' : '') +'></p>';}
    function canvas_html(x,y) {return '<canvas id="izamap-canvas" width="' + x + '" height="' + y + '" style="position:absolute;'+canvas_pos(x)+' margin:0; padding:0;"></canvas>';}
    function tmp_camvas_html(x,y) {return '<canvas id="izamap-tmp1" width="' + x + '" height="' + y + '" style="display:none;"></canvas><canvas id="izamap-tmp2" width="' + x + '" height="' + y + '" style="display:none;"></canvas>';}
    function canvas_pos(x) {return (x=='800' ? 'left:85px; ' : 'left:25px; top:25px;')}
});