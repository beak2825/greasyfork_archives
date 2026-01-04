// ==UserScript==
// @name         NGA闪耀色彩表情包
// @namespace    http://tampermonkey.net/
// @description  将sc line 表情添加至NGA网页端。表情原图来自官方LINE表情，有条件请支持官方 https://store.line.me/stickershop/product/14662/zh-Hans  https://store.line.me/stickershop/product/18813/zh-Hans
// @version      1.0.1
// @match        *://bbs.ngacn.cc/*.php*
// @match        *://ngabbs.com/*.php*
// @match        *://nga.178.com/*.php*
// @match        *://bbs.nga.cn/*.php*
// @license      MIT License
// @author       AgLandy (modified by darwintree)
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @downloadURL https://update.greasyfork.org/scripts/422363/NGA%E9%97%AA%E8%80%80%E8%89%B2%E5%BD%A9%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/422363/NGA%E9%97%AA%E8%80%80%E8%89%B2%E5%BD%A9%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

// original script from AgLandy (https://greasyfork.org/zh-CN/scripts/28491-nga-ac%E5%A8%98%E8%A1%A8%E6%83%85fgo%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92-by-%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90-nga/code)
// 本脚本框架代码来自于 https://ngabbs.com/read.php?tid=11275553
// 本脚本发布地址：https://nga.178.com/read.php?tid=25705042
// 表情原图来自官方LINE表情，有条件请支持官方 https://store.line.me/stickershop/product/14662/zh-Hans  https://store.line.me/stickershop/product/18813/zh-Hans

(function () {

    function init($) {

        let a = commonui.sc = {
            data: [
                './mon_202102/27/-77rdlQj09-9h6dKcT8S2x-2g.png', './mon_202102/27/-77rdlQj09-brf3KhT8S2s-2g.png', './mon_202102/27/-77rdlQj09-ki6tKhT8S2s-2g.png', './mon_202102/27/-77rdlQj09-77piKeT8S2i-2g.png', './mon_202102/27/-77rdlQj09-fpreKiToS2x-2g.png', './mon_202102/27/-77rdlQj09-3cqxKiToS2x-2g.png', './mon_202102/27/-77rdlQj09-d9fpKmToS2x-2g.png', './mon_202102/27/-77rdlQj09-19pdKhToS2x-2g.png', './mon_202102/27/-77rdlQj09-ac3aKjToS2x-2g.png', './mon_202102/27/-77rdlQj09-jeogKlToS2x-2g.png', './mon_202102/27/-77rdlQj09-7q85KiToS2x-2g.png', './mon_202102/27/-77rdlQj09-4c9wKkToS2x-2g.png', './mon_202102/27/-77rdlQj09-68hvKjToS2x-2g.png', './mon_202102/27/-77rdlQj09-3l0vKkToS2x-2g.png', './mon_202102/27/-77rdlQj09-3pnhKlToS2x-2g.png', './mon_202102/27/-77rdlQj09-58edKiToS2x-2g.png', './mon_202102/27/-77rdlQj09-495sKhT8S2x-2g.png', './mon_202102/27/-77rdlQj09-4c2dKiToS2x-2g.png', './mon_202102/27/-77rdlQj09-6gulKjToS2x-2g.png', './mon_202102/27/-77rdlQj09-3p43KiToS2u-2g.png', './mon_202102/27/-77rdlQj09-48aqKhT8S2r-2g.png', './mon_202102/27/-77rdlQj09-3nsoKhT8S2u-2g.png', './mon_202102/27/-77rdlQj09-4035KhToS2k-2g.png', './mon_202102/27/-77rdlQj09-3z3uKiToS2x-2g.png', './mon_202102/27/-77rdlQj09-6armKhToS2v-2g.png', './mon_202102/27/-77rdlQj09-42wtKeT8S2o-2g.png', './mon_202102/27/-77rdlQj09-3o02KdT8S2l-2g.png', './mon_202102/27/-77rdlQj09-3gvrKdT8S2m-2g.png', './mon_202102/27/-77rdlQj09-3y0sKfT8S2w-2g.png', './mon_202102/27/-77rdlQj09-3hgrKgT8S2x-2g.png', './mon_202102/27/-77rdlQj09-68z4KgT8S2s-2g.png', './mon_202102/27/-77rdlQj09-3vizKhT8S2u-2g.png', './mon_202102/27/-77rdlQj09-5gsvKgT8S2x-2a.png', './mon_202102/27/-77rdlQj09-4d3hKgT8S2x-2b.png', './mon_202102/27/-77rdlQj09-4m0yKfT8S2s-2g.png', './mon_202102/27/-77rdlQj09-3vc1KhToS2x-29.png', './mon_202102/27/-77rdlQj09-6b6cKfT8S2q-2g.png', './mon_202102/27/-77rdlQj09-3m0hKgT8S2x-28.png', './mon_202102/27/-77rdlQj09-3j1sKgT8S2x-2g.png', './mon_202102/27/-77rdlQj09-2yxzKgT8S2x-2g.png', './mon_202102/27/-77rdlQj09-3zt7KdT8S2n-2g.png', './mon_202102/27/-77rdlQj09-3jmmKcT8S2x-2b.png', './mon_202102/27/-77rdlQj09-6iiyKeT8S2o-2g.png', './mon_202102/27/-77rdlQj09-mrjKfT8S2j-2g.png', './mon_202102/27/-77rdlQj09-a1cyKgT8S2p-2g.png', './mon_202102/27/-77rdlQj09-k37kKhToS2x-2g.png', './mon_202102/27/-77rdlQj09-82f4KgT8S2x-2c.png', `./mon_202102/27/-77rdlQj09-gdgnKhT8S2x-2g.png`
            ],
            f: function (e) {
                let t = $(e.target),
                    tmp = t.parent().next().children(),
                    imgs = tmp.eq(t.index() - 1);
                if (!imgs.children()[0]) {
                    $.each(a.data, function (i, v) {
                        imgs.append('<img src="http://img.nga.cn/attachments/' + v + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.selectSmilesw._.hide()" />');
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
                $('[title="插入表情"]:not([sc])').attr('sc', 1).bind('click.scAddBtn', function () {
                    setTimeout(function () {
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("sc")))').append('<button class="block_txt_big">sc</button>').find(':contains("sc")').bind('click.scBtn', a.f)
                            .end().next().append('<div />');
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