// ==UserScript==
// @name         NGA 超天酱表情包
// @namespace    http://tampermonkey.net/
// @description  将超天酱表情添加至NGA网页端
// @version      1.0.0
// @match        *://ngabbs.com/*.php*
// @match        *://nga.178.com/*.php*
// @match        *://bbs.nga.cn/*.php*
// @license      MIT
// @author       AgLandy, Chigusa0w0
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @downloadURL https://update.greasyfork.org/scripts/439073/NGA%20%E8%B6%85%E5%A4%A9%E9%85%B1%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/439073/NGA%20%E8%B6%85%E5%A4%A9%E9%85%B1%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

// SPDX-License-Identifier: MIT
// Copyright (c) 2021 AgLandy
// Copyright (c) 2022 Chigusa0w0

// 本脚本基于以下脚本二次开发 https://greasyfork.org/zh-CN/scripts/28491
// 本脚本的图像素材来自于 https://ngabbs.com/read.php?tid=30413509
// 欢迎购买游戏本体来一起†升天† https://store.steampowered.com/app/1451940/NEEDY_STREAMER_OVERLOAD/

(function () {

    function init($) {

        let a = commonui.nso = {
            data: [
                './mon_202201/24/-zue37Q2p-cat1K1bToS5m-5p.gif',
                './mon_202201/24/-zue37Q2p-l4c7K1nT1kS5m-5p.gif',
                './mon_202201/24/-zue37Q2p-8m41K1zT1kS5m-5p.gif',
                './mon_202201/24/-zue37Q2p-h56wKnToS5m-5p.gif',
                './mon_202201/24/-zue37Q2p-3vafK1bToS5m-5p.gif',
                './mon_202201/24/-zue37Q2p-df38K1nT1kS5m-5p.gif',
                './mon_202201/24/-zue37Q2p-f4alK1kToS5m-5p.gif',
                './mon_202201/24/-zue37Q2p-bx0kKmToS5m-5p.gif',
            ],
            f: function (e) {
                let t = $(e.target),
                    tmp = t.parent().next().children(),
                    imgs = tmp.eq(t.index() - 1);
                if (!imgs.children()[0]) {
                    $.each(a.data, function (i, v) {
                        imgs.append('<img src="http://img.nga.178.com/attachments/' + v + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.selectSmilesw._.hide()" />');
                    });
                }
                $.each(tmp, function (i, d) {
                    if (i == t.index() - 1) {
                        d.style.display = '';
                    } else {
                        d.style.display = 'none';
                    }
                });
                t.parent().children().eq(0).html('');
            },
            r: function () {
                $('[title="插入表情"]:not([nso])').attr('nso', 1).bind('click.nsoAddBtn', function () {
                    setTimeout(function () {
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button[name^="nso_sticker"]))')
                            .append('<button class="block_txt_big" name="nso_sticker_gif">超天酱</button>')
                            .find('[name^="nso_sticker"]')
                            .bind('click.nsoBtn', a.f)
                            .end().next()
                            .append('<div />');
                    }, 100);
                });
            },
            mo: new MutationObserver(function () {
                a.r();
            })
        };

        a.r();

        a.mo.observe($('body')[0], {
            childList: true,
            subtree: true,
        });

    }

    (function check() {
        try {
            init(commonui.userScriptLoader.$);
        } catch (e) {
            setTimeout(check, 50);
        }
    })();

})();
