// ==UserScript==
// @name         美波七海表情
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
// @downloadURL https://update.greasyfork.org/scripts/429550/%E7%BE%8E%E6%B3%A2%E4%B8%83%E6%B5%B7%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/429550/%E7%BE%8E%E6%B3%A2%E4%B8%83%E6%B5%B7%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

(function () {

    function init($) {

        let a = commonui.minami = {
            data: [
                './mon_202107/18/-zue37Q2o-8ol8K8T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-2hc8KaT8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-lfe2K8T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-e4yyK9T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-ife8K8T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-hhhlK9T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-4yusK9T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-bqwfK8T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-ina8K8T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-7wwnK8T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-l6grK8T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-c4vaK8T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-heqcK8T8S1o-1o.png',
                './mon_202107/19/-zue37Q2o-icksK9T8S1o-1o.png',
                './mon_202107/19/-zue37Q2o-6f8bK9T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-9c40K7T8S1o-1o.png',
                './mon_202107/18/-zue37Q2o-8js8K8T8S1o-1o.png',
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
                $('[title="插入表情"]:not([美波七海])').attr('美波七海', 1).bind('click.minami', function () {
                    setTimeout(function () {
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("美波七海")))').append('<button class="block_txt_big">美波七海</button>').find(':contains("美波七海")').bind('click.minami', a.f)
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