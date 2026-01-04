// ==UserScript==
// @name         QZ5Z_OA
// @namespace    https://fly.moe/
// @version      0.1.1
// @description  Beautify qz5z.com
// @author       Fly
// @match        http://www.qz5z.com/?br=15*
// @match        http://www.qz5z.com/?br=72*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/layer/3.1.0/layer.js
// @downloadURL https://update.greasyfork.org/scripts/39451/QZ5Z_OA.user.js
// @updateURL https://update.greasyfork.org/scripts/39451/QZ5Z_OA.meta.js
// ==/UserScript==

(function () {
    main();
})();

var loadimg_html = '<style>.loader {margin: 2em auto;  border: 16px solid #f3f3f3;  border-radius: 50%;  border-top: 16px solid #3498db;  width: 120px;  height: 120px;  -webkit-animation: spin 2s linear infinite;   animation: spin 2s linear infinite;}@-webkit-keyframes spin {  0% { -webkit-transform: rotate(0deg); }  100% { -webkit-transform: rotate(360deg); }}@keyframes spin {  0% { transform: rotate(0deg); }  100% { transform: rotate(360deg); }}</style><div class="loader"></div>';

function main() {
    console.log('patched');
    jq('#table_banner > tbody > tr > td:nth-child(1) > img').attr('src', 'https://www.qz5z.ren/images/logo.png');
    GM_addStyle(`
    body {
        background: url(https://img.cdn.lwl12.com/images/2018/03/12/oloh.png);
        background-repeat: no-repeat;
        background-size: 25%;
        background-position: 100% 100%;
    }
    #topbody > tbody > tr:nth-child(1) > td {
        box-shadow: 0 0 20px rgba(0, 0, 0, .2);
        background-color: #f08ec3!important;
    }
    #mepopwin {
        z-index: 23336666!important;
    }
    #shadow {
        z-index: 23336665!important;
    }
    #popwin {
        z-index: 23336667!important;
    }
    input[type="button"] {
        display: inline-block;
        margin-bottom: 0;
        vertical-align: middle;
        font-weight: normal!important;
        text-align: center;
        white-space: nowrap;
        background-image: none!important;
        background-color: #f0f0f0!important;
        border: 1px solid transparent!important;
        border-radius: 4px!important;
        cursor: pointer;
        outline: none;
        -webkit-appearance: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-transition: background-color 300ms ease-out, border-color 300ms ease-out;
        transition: background-color 300ms ease-out, border-color 300ms ease-out;
        color: #333333;
        border-color: #f0f0f0;
    }
    input[type="button"]:hover, input[type="button"]:focus {
        background-color: #dedede!important;
        border-color: #dedede!important;
    }
    `);
}

unsafeWindow.addnewwin = function (areaid, wd, ht, wintitle, url) {
    if (jq('#ccworking_win').length > 0 && areaid == 'working_win') {
        layer.msg('请先关闭当前打开的窗口', {
            zIndex: layer.zIndex
        });
        return;
    }
    layer.open({
        type: 1,
        title: wintitle,
        maxmin: true,
        shade: false,
        id: areaid,
        area: [wd, ht],
        content: loadimg_html,
        zIndex: layer.zIndex,
        success: function (layero, index) {
            layer.setTop(layero);
            //算一些奇怪的东西
            winwidth = workarea.clientWidth;
            winheight = document.body.clientHeight;
            topwinid = areaid;
            //Ajax 加载内容
            if (url != '') {
                jq.ajax({
                    type: "GET",
                    url: url,
                    dataType: "html",
                    success: function (res) {
                        res = res.replace(/layer.closeAll\(\)/g, 'layer.closeAll("tips")');
                        jq('#' + areaid).html(res);
                        if ((url.indexOf('desktop/oaprog/') >= 0) && jq('#' + areaid).children('form').width() > jq('#cc' + areaid).width()) jq('#cc' + areaid).width(jq('#' + areaid).children('form').width() + 40);
                    }
                });
            }
            // 假装这个cc是原来的窗口，把left属性绑定到上面
            jq('#' + areaid).wrap('<div id="cc' + areaid + '"></div>');
            jq(layero).attr('cc', areaid);
            jq(layero).bind('click', function () {
                topwinid = jq(this).attr("cc");
            });
            jq('#cc' + areaid).resize(function () {
                jq(layero).css('width', jq('#cc' + areaid).width());
            });
            //jq('#cc' + areaid).css('top', jq(layero).css('top'));
            jq('#cc' + areaid).css('left', jq(layero).css('left'));
            //恢复topwin*的z-inedx
            jq('div[id^="topwin"]').css('z-index', '99999999');
            //cc被关闭时
            setInterval(function() {
                if ($('#cc' + areaid).length == 0) {
                    layer.close(index);
                }
            }, 100);
        },
        moveEnd: function (layero) {
            //jq('#cc' + areaid).css('top', jq(layero).css('top'));
            jq('#cc' + areaid).css('left', jq(layero).css('left'));
        },
        cancel: function (index, layero) {
            $(layero).unbind();
        }
    });
};

window.onload = function () {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);
};

$(document).ready(function () {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.bootcss.com/layer/3.1.0/layer.js";
    document.getElementsByTagName("head")[0].appendChild(script);
});

//监听div大小变化
(function ($, h, c) {
    var a = $([]),
        e = $.resize = $.extend($.resize, {}),
        i,
        k = "setTimeout",
        j = "resize",
        d = j + "-special-event",
        b = "delay",
        f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function () {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {
                w: l.width(),
                h: l.height()
            });
            if (a.length === 1) {
                g();
            }
        },
        teardown: function () {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i);
            }
        },
        add: function (l) {
            if (!e[f] && this[k]) {
                return false;
            }
            var n;

            function m(s, o, p) {
                var q = $(this),
                    r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments);
            }
            if ($.isFunction(l)) {
                n = l;
                return m;
            } else {
                n = l.handler;
                l.handler = m;
            }
        }
    };

    function g() {
        i = h[k](function () {
                a.each(function () {
                    var n = $(this),
                        m = n.width(),
                        l = n.height(),
                        o = $.data(this, d);
                    if (m !== o.w || l !== o.h) {
                        n.trigger(j, [o.w = m, o.h = l]);
                    }
                });
                g();
            },
            e[b]);
    }
})(jq, this);