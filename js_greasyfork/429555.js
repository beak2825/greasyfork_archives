// ==UserScript==
// @name         美波七海表情2.0
// @namespace    http://tampermonkey.net/
// @match       *://bbs.nga.cn/thread.php?*
// @match       *://bbs.nga.cn/read.php?*
// @match       *://bbs.nga.cn/post.php?*
// @match       *://ngabbs.com/thread.php?*
// @match       *://ngabbs.com/read.php?*
// @match       *://ngabbs.com/post.php?*
// @match       *://nga.178.com/thread.php?*
// @match       *://nga.178.com/read.php?*
// @match       *://nga.178.com/post.php?*
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @description  用于在NGA发送美波七海的表情包
// @version 0.0.6
// @downloadURL https://update.greasyfork.org/scripts/429555/%E7%BE%8E%E6%B3%A2%E4%B8%83%E6%B5%B7%E8%A1%A8%E6%83%8520.user.js
// @updateURL https://update.greasyfork.org/scripts/429555/%E7%BE%8E%E6%B3%A2%E4%B8%83%E6%B5%B7%E8%A1%A8%E6%83%8520.meta.js
// ==/UserScript==

(function () {

    function init($) {

        let a = commonui.minami2 = {
            data: [
                './mon_202107/18/-zue37Q2o-2b0fK18ToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-1bt3K1bToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-64tK11ToS4i-4i.png',
                './mon_202107/19/-zue37Q2o-isnxK1nT1kS4i-4i.png',
                './mon_202107/19/-zue37Q2o-7hw0K1oT1kS4i-4i.png',
                './mon_202107/18/-zue37Q2o-ckaeK17ToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-bj7rK17ToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-bgh9KzToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-diceKyToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-b2pjKzToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-1hjiK11ToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-9xlyKyToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-8j6KzToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-848K13ToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-dyq2KzToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-l3tyK10ToS4i-4i.png',
                './mon_202107/18/-zue37Q2o-3gzvK11ToS4i-4i.png',
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
                $('[title="插入表情"]:not([美波七海2])').attr('美波七海2', 1).bind('click.minami2', function () {
                    setTimeout(function () {
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("美波七海2")))').append('<button class="block_txt_big">美波七海2</button>').find(':contains("美波七海2")').bind('click.minami2', a.f)
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