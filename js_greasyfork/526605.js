// ==UserScript==
// @name         Chiphell简易渐变字功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简易渐变字功能
// @author       楪蘭楓
// @match        *://*.chiphell.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/526605/Chiphell%E7%AE%80%E6%98%93%E6%B8%90%E5%8F%98%E5%AD%97%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/526605/Chiphell%E7%AE%80%E6%98%93%E6%B8%90%E5%8F%98%E5%AD%97%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 颜色
    var color = ['#fc00ff', '#00dbde'];

    var startColor = GM_getValue('startColor') || color[0];
    var endColor = GM_getValue('endColor') || color[1];

    // 前后缀
    var prefix = '[size=3][b]';
    var suffix = '[/b][/size]';

    // 固定回复框
    var btn = document.createElement('input');
    btn.setAttribute('type', 'button');
    btn.setAttribute('class', 'pn pnc vm');
    btn.setAttribute('value', '渐变字');
    btn.setAttribute('style', 'font-weight: 700;padding: 0 10px;');
    btn.addEventListener('click', function() {
        modMsg('fastpostmessage');
    }, false);

    // 悬浮回复框
    var btn_float = document.createElement('input');
    btn_float.setAttribute('type', 'button');
    btn_float.setAttribute('class', 'pn pnc vm');
    btn_float.setAttribute('value', '渐变字');
    btn_float.setAttribute('style', 'font-weight: 700;padding: 0 10px;');
    btn_float.addEventListener('click', function() {
        modMsg('postmessage');
    }, false);

    // 手机端
    var btn_mobile = document.createElement('input');
    btn_mobile.setAttribute('type', 'button');
    btn_mobile.setAttribute('class', 'button2');
    btn_mobile.setAttribute('value', '渐变字');
    btn_mobile.setAttribute('style', 'position: absolute;right: 55px;');
    btn_mobile.addEventListener('click', function() {
        modMsg('fastpostmessage');
    }, false);
    var btn_mobile_reply = document.createElement('input');
    btn_mobile_reply.setAttribute('type', 'button');
    btn_mobile_reply.setAttribute('class', 'btn_pn');
    btn_mobile_reply.setAttribute('value', '渐变字');
    btn_mobile_reply.setAttribute('style', 'margin-bottom: 8px;');
    btn_mobile_reply.addEventListener('click', function() {
        modMsg('needmessage');
    }, false);

    // 添加按钮
    setInterval(function() {
        var pnpost = document.getElementsByClassName('pnpost')[0];
        if (pnpost && pnpost.tagName === 'P') {
            pnpost.prepend(btn);
        }
        document.getElementById('moreconf') && document.getElementById('moreconf').prepend(btn_float);
        if (document.getElementsByClassName('tshuz_mfacebtn')[0]) {
            document.getElementById('fastpostform').prepend(btn_mobile);
            document.getElementById('fastpostmessage').setAttribute('style', 'width: calc(100% - 180px)!important;margin-right: 0;');
            document.getElementsByClassName('tshuz_mfacebtn')[0].setAttribute('style', 'margin-right: 58px;');
        }
        document.getElementsByClassName('postsendbtn')[0] && document.getElementsByClassName('postsendbtn')[0].prepend(btn_mobile_reply);
    },1000);

    // 文本替换
    function modMsg(id) {
        var msg = document.getElementById(id);
        msg.value = prefix + ConvertGrantWord(msg.value) + suffix;

    }

    // 渐变字功能 作者：软妹币玩家、美豆
    var parseColor = function(hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function(s) {
            return 0x11 * parseInt(s, 16);
        }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function(s) {
            return parseInt(s, 16);
        })
    };

    // zero-pad 1 digit to 2
    var pad = function(s) {
        return (s.length === 1) ? '0' + s: s;
    };

    var gradientColors = function(start, end, steps, gamma) {
        var i, j, ms, me, output = [],
            so = [];
        if (steps === 1) {
            output.push(start);
            return output;
        }
        gamma = gamma || 1;
        var normalize = function(channel) {
            return Math.pow(channel / 255, gamma);
        };
        start = parseColor(start).map(normalize);
        end = parseColor(end).map(normalize);
        for (i = 0; i < steps; i++) {
            ms = i / (steps - 1);
            me = 1 - ms;
            for (j = 0; j < 3; j++) {
                so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
            }
            output.push('#' + so.join(''));
        }
        return output;
    };

    function ConvertGrantWord(str) {
        var sub = parseInt(str.length / (color.length - 1));
        var arr = [];
        for (var i = 0; i < color.length - 1; i++) {
            if (i !== color.length - 2) {
                arr = arr.concat(gradientColors(color[i], color[i + 1], sub));
            } else {
                arr = arr.concat(gradientColors(color[i], color[i + 1], str.length - sub * i));
            }
        }
        var result = '';
        for (var j = 0; j < str.length; j++) {
            result += "[color=" + arr[j].replace('8964','8963') + "]" + str[j] + "[/color]"
        }
        return result;
    }

    var div = document.createElement('div');
    div.setAttribute('style', 'padding: 0 3px;');

    var a = document.createElement('a');
    a.setAttribute('id', editorid + '_gradient');
    a.setAttribute('title', '添加渐变文字');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('style', 'background: transparent  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU5N0RGNDc1QTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU5N0RGNDc2QTI1MDExRUE5Nzg1RUY1Q0Q3NTZDQkM5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTk3REY0NzNBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTk3REY0NzRBMjUwMTFFQTk3ODVFRjVDRDc1NkNCQzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5C+Sk1AAAEBklEQVR42syUbUxbVRjH//f2tvSdl0AHrWM0bBRw2hYI4As0YrItDujYYHWbkeAGJn5QEp0BY2Ji9MOyQBaa+PJhM8YpjZrwYTCdTifNtlRBtmyZrkKRVZjQDixtb6GF9njuzZj0+z54kufee16e3/0/z3nOYQgheJiNxcNugkLB3jWfwDPq5+gIM0gfYSV0R9pRiRfVFhgyS7EdhcgTHBhqJW1Afp3Q+0BYy6qKDjGP7BI5D4BthsMwsIWnj3QcJmcHPyMVlTVBJdij5aqtKMsxi0DdRjycnj5UXx9ytBLX4OfEajEHIVH3CpwHIS8sz2M+NWcrKi6CaXsp3njz1dziOuvAb/xfL8siEkioNJISl6qwftfddfTAgTbH89hRUorsTEUuklGr+K8NoJJTQo6Mv6ORaPHMzAxkkgy8092jHEg5P3Jfcbffz7ewg9ret3rKK6yVWF1NQFgbTyQFxL004PpaAjxifJSPil7+O3dg0BvQuK8RhaatT7AMB4Zw0CgVePwxM5aWlrCysgKj0YhgMCAgQmnA6/x419O1thKT0QQJy8JisSArKwtNzU1YXFxEMpkES8dTqRT8fj9qa2sRDofh8XjQ1GTHhe9/qkkD3sPSx7uaG2DZaYVGqxEd4vE4+vv74XA4oFAoUFBQgEAggPr6ehHkdrtRVVUFk6kUsdX1hrSyoW255+1eMhcKkbvhMJny+cie3buFCeKj3zRE0t3dTYaHh8nY2BjJ0mqJiprQbnq9ZJ/dHhE43OaSlDIscqkqqYTD0LXruHbjBjo6OsTQ5XI5RkdHYTab6WaswrBtG1r27gUiUWhpKpL3VW0GZmarFJBd8QC+aVibG3H7z2n4vX+A53lxE1wuF/R6PSYmJjB89Sr0k1PAgBOFzzYgo2CLOu3oFUL7zZhnAtPxGFBpBSuVQFDc0tICp9OJvr4+MZcjIyOw2Wy4fPEiZMYipMrLcPnXccx5veG0HL6vO4g8Tuqyv/RC/NbsLKGqxPy0trYSnU5H8vPzxTfdGJKTk0N+8XjE+aFLP5AtOm2UBvuewGE2bptTB4/hx9uXcO7m9M+vvX68urOjHdFoFLFYDHyMF4+whGXEMY1GA11eHpbDIXR2dmHKN98jNdSdSMx+9x8wi+ZvZSWOBCGeTK2mBgxD6ywCqgoqlZp2KZKVgqdrJCyHtbU4dU7EF+aDnRJ93ZfKAmM8PH56c9nIqASaV1azg3Zute7fT86c+YQ89WS1MPkVtXaNVkdOnvqQvNJ9nI5JqakqkKGHYqcd2upjSC8bOYWl1ik3e5JJ5TXP+ANffHv+fFkwuCgUwySnfvRTTpGUj14YOhla/ocqpu7yot/BMVgLLiApi4gY5n9/Y/8rwACYitOak/ly8QAAAABJRU5ErkJggg==) no-repeat 0 0;width: 20px;height: 20px;float: left;border: 1px solid #fcfcfc;overflow: hidden;');
    //a.innerText = "渐变字";
    div.appendChild(a);
    document.getElementById(editorid + "_controls").appendChild(div);
    a.addEventListener('click', function () {
        showEditorMenu2();
        //doane();
    }, false);

    function showEditorMenu2() {
        var ctrlid = editorid + '_gradient';
        var menutype = 'menu';
        var menupos = '43!';
        var menu = document.createElement('div');
        menu.id = ctrlid + '_menu';
        menu.style.display = 'none';
        menu.className = 'p_pof upf';
        menu.style.width = '270px';
        s = '<div class="p_opt cl"><span class="y" style="margin:-10px -10px 0 0"><a onclick="hideMenu();return false;" class="flbc" href="javascript:;">关闭</a></span><div>' + '请输入要插入的渐变字：<br /><textarea id="' + ctrlid + '_param_1" style="width: 98%" cols="50" rows="5" class="txtarea"></textarea>' + '</div><div style="width: 50%; display: inline-block;">起始色：<input id="' + ctrlid + '_start_color" type="color" value="' + startColor + '"></div><div style="width: 50%; display: inline-block;">终止色：<input id="' + ctrlid + '_end_color" type="color" value="' + endColor + '"></div><div class="pns mtn"><button type="submit" id="' + ctrlid + '_submit" class="pn pnc"><strong>提交</strong></button></div></div>';
        menu.innerHTML = s;
        $(editorid + '_editortoolbar').appendChild(menu);
        showMenu({
            'ctrlid': ctrlid,
            'mtype': menutype,
            'evt': 'click',
            'duration': 3,
            'cache': 0,
            'drag': 1,
            'pos': menupos
        });

        try {
            if ($(ctrlid + '_param_1')) {
                $(ctrlid + '_param_1').focus();
            }
        } catch (e) { }
        var objs = menu.getElementsByTagName('*');
        for (var i = 0; i < objs.length; i++) {
            _attachEvent(objs[i], 'keydown',
                         function (e) {
                var obj = e.target;
                if ((obj.type == 'text' && e.keyCode == 13) || (obj.type == 'textarea' && e.ctrlKey && e.keyCode == 13)) {
                    if ($(ctrlid + '_submit') && tag != 'image') $(ctrlid + '_submit').click();
                    doane(e);
                } else if (e.keyCode == 27) {
                    hideMenu();
                    doane(e);
                }
            });
        }
        if ($(ctrlid + '_submit')) $(ctrlid + '_submit').onclick = function () {
            checkFocus();
            if (!str) {
                str = '';
                var first = $(ctrlid + '_param_1').value;
                var str = prefix + ConvertGrantWord(first) + suffix;
                var txt = getSel();
                //insertText((opentag + str + closetag), strlen(opentag), strlen(closetag), true, sel);
                insertText(str, str.length, 0, false , txt);
                switchEditor(0);
                switchEditor(1);
                hideMenu();

            }
        }
        if ($(ctrlid + '_start_color')) $(ctrlid + '_start_color').onchange = function () {
            startColor = this.value;
            GM_setValue('startColor', startColor);
        }
        if ($(ctrlid + '_end_color')) $(ctrlid + '_end_color').onchange = function () {
            endColor = this.value;
            GM_setValue('endColor', endColor);
        }
    }
})();