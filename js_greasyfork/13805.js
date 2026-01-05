// ==UserScript==
// @name         评论才是本体!
// @namespace    org.jixun.acfun.comment.screenshot
// @version      1.0.2
// @description  Acfun 复制小剧场
// @author       Jixun
// @include      http://www.acfun.tv/a/ac*
// @include      http://www.acfun.tv/v/ac*
// @require      https://greasyfork.org/scripts/2599/code/gm2-port-v104.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/13805/%E8%AF%84%E8%AE%BA%E6%89%8D%E6%98%AF%E6%9C%AC%E4%BD%93%21.user.js
// @updateURL https://update.greasyfork.org/scripts/13805/%E8%AF%84%E8%AE%BA%E6%89%8D%E6%98%AF%E6%9C%AC%E4%BD%93%21.meta.js
// ==/UserScript==

/* globals unsafeWindow, unsafeExec, GM_xmlhttpRequest, html2canvas */
/* jshint browser:true, devel: true, newcap: false */

/* jshint -W097 */
'use strict';

var w = unsafeWindow;
w.GM_PROXY = true;
var PROXY_STR = 'jixun://ACFUN_IMG_PROXY_' + (+new Date());
var FLAG_DEBUG = false;

console.info('评论才是本体! VM 入口 -->');
addEventListener('DOMContentLoaded', function () {
    // Inject html2canvas (with some custom fix)
    var sPaint = document.createElement('script');
    sPaint.src = 'https://greasyfork.org/scripts/13980/code/html2canvas.js?version=87728';
    document.head.appendChild(sPaint);

    // Inject loader :D
    unsafeExec(loader, PROXY_STR, FLAG_DEBUG);

    document.addEventListener(PROXY_STR, function (e) {
        if (e.detail.src.indexOf('http://cdn.aixifan.com/dotnet/') === 0) {
            if (FLAG_DEBUG) console.info('CROS: 抓取圖片 %s', e.detail.src);

            // Code taken from: 
            // http://stackoverflow.com/a/8781262
            // By: Brock Adams
            GM_xmlhttpRequest({
                method: 'GET',
                url: e.detail.src,
                overrideMimeType: 'text/plain; charset=x-user-defined',
                onload: function (r) {
                    var parts = e.detail.callback.split('.');
                    var fn = unsafeWindow;
                    var scope;
                    for (var i = 0; i < parts.length; i++) {
                        scope = fn;
                        fn = fn[parts[i]];
                    }
                    
                    // 自带的 btoa 会报错
                    fn.call(scope, {
                        type: 'image/png',
                        content: customBase64Encode (r.responseText)
                    });
                }
            });
        }
    }, false);
}, false);

// Code taken from: 
// http://stackoverflow.com/a/8781262
// By: Brock Adams
function customBase64Encode (inputStr) {
    var
        bbLen               = 3,
        enCharLen           = 4,
        inpLen              = inputStr.length,
        inx                 = 0,
        jnx,
        keyStr              = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        output              = "",
        paddingBytes        = 0;
    var
        bytebuffer          = new Array (bbLen),
        encodedCharIndexes  = new Array (enCharLen);

    while (inx < inpLen) {
        for (jnx = 0;  jnx < bbLen;  ++jnx) {
            if (inx < inpLen)
                bytebuffer[jnx] = inputStr.charCodeAt (inx++) & 0xff;
            else
                bytebuffer[jnx] = 0;
        }

        encodedCharIndexes[0] = bytebuffer[0] >> 2;
        encodedCharIndexes[1] = ( (bytebuffer[0] & 0x3) << 4)   |  (bytebuffer[1] >> 4);
        encodedCharIndexes[2] = ( (bytebuffer[1] & 0x0f) << 2)  |  (bytebuffer[2] >> 6);
        encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

        paddingBytes          = inx - (inpLen - 1);
        switch (paddingBytes) {
            case 1:
                encodedCharIndexes[3] = 64;
                break;
            case 2:
                encodedCharIndexes[3] = 64;
                encodedCharIndexes[2] = 64;
                break;
            default:
                break;
        }

        for (jnx = 0;  jnx < enCharLen;  ++jnx)
            output += keyStr.charAt ( encodedCharIndexes[jnx] );
    }
    return output;
}

function loader(PROXY_STR, FLAG_DEBUG) {
    var w = window;

    var bac = w.document.body.appendChild;
    w.document.body.appendChild = function (node) {
        if (node.tagName == 'SCRIPT') {
            var src = node.getAttribute('src');
            if (src.indexOf(PROXY_STR) === 0) {
                var m = src.match(/url=(.+?)&callback=([\w.]+)/);
                document.dispatchEvent(new CustomEvent(PROXY_STR, {
                    detail: {
                        src: decodeURIComponent(m[1]),
                        callback: m[2]
                    }
                }));

                node.setAttribute("type", "text/do-nothing");
            }
        }
        return bac.apply(this, arguments);
    };

    console.info('评论才是本体! 截图工具已载入 @jixun');

    var $ = w.$;
    $(function () {
        $('#area-comment')
            .on('mouseover', over)
            .on('mouseout',  out);

        var $space, $prevCanvas = {};
        var $screenshot = $('<span title="图片准备中..">[ 小剧场? ]</span>').css({
            position: 'absolute',
            right: '1em',
            top: '1em',
            zIndex: '999',
            color: '#aaa',
        });

        var $holder = $('<span>').css({
            overflow: 'hidden',
            opacity: 0.3,
            position: 'absolute'
        }).appendTo($screenshot);

        if (!FLAG_DEBUG) {
            $holder.css({
                top: 0,
                left: 0,
                height: '100%',
                width: '100%'
            });
        }

        var $doneShot = false;

        $screenshot.mouseenter(function (e) {
            e.preventDefault();
            e.stopPropagation();

            if ($doneShot) return ;

            // 生成当前图层 :D
            $screenshot.hide();
            html2canvas($space[0], {
                onrendered: function (canvas) {
                    canvas.title = '图片就绪 :D';
                    $doneShot = true;
                    if ($prevCanvas.length) $prevCanvas.remove();
                    $prevCanvas = $(canvas);

                    /*
                    // 打上我们的小广告 :D
                    var ctx = canvas.getContext('2d');
                    ctx.textAlign = 'right';
                    ctx.fillStyle = '#777';
                    ctx.fillText('@评论才是本体', canvas.width - 10, 20);
                    ctx.fillText('AcFun 小剧场截图工具 by Jixun', canvas.width - 10, 34);
                    */

                    $holder.append(canvas);
                    // document.body.appendChild(canvas);
                    $screenshot.show();
                },

                logging: FLAG_DEBUG,
                proxy: PROXY_STR
            });
        });

        function over (e) {
            var $new_space = find_space(e);
            if ($new_space) {
                if (!$space || !$new_space[0].isEqualNode($space[0])) {
                    $space = $new_space;

                    $space.find('.content-comment').each(function () {
                        this.innerHTML = this.innerHTML.replace(/\n/g, '<br>');
                    });

                    $space.find('img').css('display', 'inline');

                    $doneShot = false;
                    if ($prevCanvas.length) $prevCanvas.remove();
                    $screenshot.appendTo($space);
                }
            }
        }

        function out (e) {
            // TODO: ??
        }

        function find_space(e) {
            var $el = $(e.target);
            if ($el.parent().attr('id') == 'area-comment-inner')
                return $el;

            var $pn = $el.parents('.item-comment-quote:last');
            if ($pn.length)
                return $pn;

        }
    });
}
