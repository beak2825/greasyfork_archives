// ==UserScript==
// @name         表单填写助手
// @namespace    无
// @version      0.3
// @description  开发者工具，用于填写页面表单内容
// @author       zyz
// @include      *localhost*
// @include      *127.0.0.1*
// @include      *192.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387072/%E8%A1%A8%E5%8D%95%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387072/%E8%A1%A8%E5%8D%95%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var delayTime = 200;//延迟初始化时间
    setTimeout(function () {
        if (!$) {
            return;
        }
        var handleMove = function (dv, btn, callback) {
            //获取元素
            var x = 0;
            var y = 0;
            var l = 0;
            var t = 0;
            var isDown = false;
            //鼠标事件
            btn.mousedown(function (e) {
                //获取x坐标和y坐标
                x = e.screenX;
                y = e.screenY;

                //获取左部和顶部的偏移量
                var p = dv.position();
                l = p.left;
                t = p.top;
                //开关打开
                isDown = true;

                callback('mousedown');
            }).mouseup(function (e) {
                //开关关闭
                isDown = false;

                callback('mouseup');
            });

            //鼠标移动
            $(window).mousemove(function (e) {
                if (isDown === false) {
                    return;
                }
                //获取x和y
                var nx = e.screenX;
                var ny = e.screenY;
                //计算移动后的左偏移量和顶部的偏移量
                var nl = nx - (x - l);
                var nt = ny - (y - t);

                nl = nl < 0 ? 0 : nl;
                nt = nt < 0 ? 0 : nt;

                dv.css('left', nl + 'px');
                dv.css('top', nt + 'px');

                callback('mousemove');
            });
        };

        var html = '<div id="_inputHelper" style="background-color: rgba(0,0,0,0.7);position:fixed;left: 0;top: 0;z-index: 999999;">\n' +
            '    <span id="_switch" style="color: lightgrey;font-size: 8px;cursor: move;">\n' +
            '        <svg t="1562036220852" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1101" width="16" height="16"><path d="M810.666667 846.122667C810.666667 847.189333 811.690667 853.333333 810.837333 853.333333L216.832 853.333333C216.021333 853.333333 213.333333 847.36 213.333333 846.421333L213.333333 298.666667l298.666667 0L512 213.333333 128 213.333333l0 69.632 0 563.456L128 938.666667l768 0 0-92.245333L896 512l-85.333333 0L810.666667 846.122667z" p-id="1102" fill="#cdcdcd"></path><path d="M298.666667 768l199.296 0 388.437333-392.192-194.176-187.946667L298.666667 576.725333 298.666667 768zM384 612.266667l308.906667-305.578667 71.509333 70.272L462.464 682.666667 384 682.666667 384 612.266667z" p-id="1103" fill="#cdcdcd"></path><path d="M737.30967 148.768717l60.1344-60.544 181.93472 180.703872-60.1344 60.544-181.93472-180.703872Z" p-id="1104" fill="#cdcdcd"></path></svg>\n' +
            '    </span>\n' +
            '    <div id="_content" style="padding: 5px;display: none;">\n' +
            '        <span style="color: lightgrey;">选择器：</span>\n' +
            '        <br>\n' +
            '        <textarea id="_selector" style="width: 400px !important;margin-top: 5px !important;resize: both !important;" placeholder="选择器" rows="3">input:not(":hidden"):not(".hide"):not(":disabled"):not("[readonly]"):not("[type=\'file\']"):not("[type=\'radio\']"):not("[type=\'checkbox\']"),textarea:not(":hidden"):not(".hide"):not(":disabled"):not("[readonly]")</textarea>\n' +
            '        <br>\n' +
            '        <span style="color: lightgrey;">随机内容长度：</span><span style="color: lightgrey;" title="为空或“0”时使用自定义内容，如果目标是number类型的input，该值为最大值">【?】</span>\n' +
            '        <br>\n' +
            '        <input id="_randomLen" style="width: 400px !important;margin-top: 5px !important;" type="number" placeholder="随机内容长度，为空或“0”时使用下面输入内容" value="32">\n' +
            '        <br>\n' +
            '        <span style="color: lightgrey;">随机内容样本：</span>\n' +
            '        <br>\n' +
            '        <textarea id="_randomText" style="width: 400px !important;margin-top: 5px !important;resize: both !important;" placeholder="随机内容样本" rows="3">-_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890</textarea>\n' +
            '        <br>\n' +
            '        <span style="color: lightgrey;">自定义内容：</span>\n' +
            '        <br>\n' +
            '        <textarea id="_text" style="width: 400px !important;margin-top: 5px !important;resize: both !important;" placeholder="自定义内容" rows="3">测试内容</textarea>\n' +
            '        <br>\n' +
            '        <span style="color: lightgrey;">Tab的选择器，不为空时自动切换Tab并设值：</span>\n' +
            '        <br>\n' +
            '        <input id="_autoTab" style="width: 400px !important;margin-top: 5px !important;" placeholder="Tab的选择器，不为空时自动切换Tab并设值" value="ul.nav-tabs a[data-toggle=\'tab\']">\n' +
            '        <br>\n' +
            '        <span style="color: lightgrey;">Tab切换时设值延时（单位：ms）：</span><span style="color: lightgrey;" title="默认500/5，说明：每500ms切换一次标签，切换标签触发后500/5ms后设值">【?】</span>\n' +
            '        <br>\n' +
            '        <input id="_autoTabDelay" style="width: 400px !important;margin-top: 5px !important;" placeholder="Tab的选择器，不为空时自动切换Tab并设值" value="500/5">\n' +
            '        <br>\n' +
            '        <button id="_update">设置</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label style="color: lightgrey;"><input id="_ignoreNotEmpty" type="checkbox" checked="checked">&nbsp;&nbsp;忽略非空目标</label>\n' +
            '    </div>\n' +
            '</div>';
        $('body').append(html);

        var dv = $('#_inputHelper');
        dv.find('#_content').on('show.toggle', function () {
            var content = $('#_content');
            if (content.is(':hidden')) {
                content.show();
            } else {
                content.hide();
            }
        });

        handleMove(dv, dv.find('#_switch'), function (type) {
        });

        var swF = function () {
            $('#_content').trigger('show.toggle');
        };
        dv.on('mouseover mouseout', swF);

        var getNumber = function (valStr, def) {
            var len;
            try {
                len = parseInt(valStr);
            } catch (e) {
            }
            return isNaN(len) ? def : len;
        };

        var updateVal = function () {
            var randomLen;
            try {
                randomLen = parseInt(dv.find('#_randomLen').val());
            } catch (e) {
                randomLen = 0;
            }
            var text = dv.find('#_text').val();
            $(dv.find('#_selector').val()).each(function () {
                var target = $(this);
                if (target.closest('#_inputHelper').length > 0) {
                    return true;
                }

                var oldVal = target.val();
                if (oldVal && $('#_ignoreNotEmpty').is(':checked')) {
                    return true;
                }

                var content;
                if (randomLen > 0) {
                    var getLen = function (valStr) {
                        var len = getNumber(valStr, randomLen);
                        return len > randomLen ? randomLen : len;
                    };
                    if (target.is('input') && target.attr('type') === 'number') {
                        content = randomNum(getLen(target.attr('max'))).toString();
                    } else {
                        content = randomString(getLen(target.attr('maxlength')));
                    }
                } else {
                    content = text;
                }
                if (target.is('input')) {
                    target.val(content);
                } else {
                    target.html(content);
                }
            });
        };
        dv.find('#_update').on('click', function () {
            var tabs = $($('#_autoTab').val());
            if (tabs.length > 0) {
                var delayDef = 500;
                var perDef = 5;
                var delayStr = $('#_autoTabDelay').val();
                if (!delayStr || delayStr.indexOf('/') === -1) {
                    delayStr = delayDef + '/' + perDef;
                }

                delayStr = delayStr.split('/');

                var delay = getNumber(delayStr[0], delayDef);
                var per = getNumber(delayStr[1], perDef);

                tabs.each(function (index) {
                    var tab = $(this);
                    setTimeout(function () {
                        tab.tab('show');
                        setTimeout(function () {
                            updateVal();
                        }, delay / per);
                    }, index * delay);
                });
            } else {
                updateVal();
            }
        });

        function randomString(len) {
            len = len || 32;
            var $chars = $('#_randomText').val();
            var maxPos = $chars.length;
            var pwd = '';
            if (maxPos > 0) {
                for (var i = 0; i < len; i++) {
                    pwd += $chars.charAt(randomNum(0, maxPos));
                }
            }
            return pwd;
        }

        function randomNum(minNum, maxNum) {
            switch (arguments.length) {
                case 1:
                    return parseInt(Math.random() * minNum + 1, 10);
                case 2:
                    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                default:
                    return 0;
            }
        }
    }, delayTime);
})();