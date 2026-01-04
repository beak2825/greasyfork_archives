// ==UserScript==
// @name         翻译
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to translate the world!
// @author       su
// @match        http://*/*
// @include      https://*/*
// @grant        GM_xmlhttpRequest
// @connect      fy.iciba.com
// @connect      api.ai.qq.com
// @connect      translate.google.cn
// @require      http://cdn.bootcss.com/blueimp-md5/1.1.0/js/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/389226/%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/389226/%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
(function() {
    //金山词霸翻译接口
    const cibaUrl = "http://fy.iciba.com/ajax.php?a=fy";
    //css样式
    const style = {
            'ballStyle': 'position: absolute;z-index: 102;top: 2px;right: 2px;width: 44px;height: 22px;border-radius: 11px;display: flex;align-items: center;border: solid 1px rgba(255, 255, 255, 0.5);background-color: darkgray;cursor: pointer;',
            'traStyle': 'position: absolute;z-index: 101;top: 0;right: 0;width: 100%;border-radius: 6px;font: 13px/normal Arial, Helvetica;box-shadow: 0 0 0 1px rgba(0, 0, 0, .05), 0 2px 3px 0 rgba(0, 0, 0, .1);visibility: hidden;',
            'selectStyle': 'width: 60%;margin-top: 3px;border: 1px solid #ececec;height: 28px;border-radius: 2px;color: #666;',
            'textareaStyle': 'height: 96px;top: 40px;width: 100%;font-weight: normal;font-family: "Roboto", Sans-Serif;outline: none;-webkit-appearance: none;white-space: pre-wrap;word-wrap: break-word;z-index: 2;background: transparent;border-width: 0;',
            'dTextStyle': 'height: auto;min-height: 120px;padding: 30px 20px 12px 20px;overflow: hidden;'
        }
        //下拉框
    const select = '<option value="en" selected>英语</option><option value="zh-CN">简体中文</option><option value="ar">阿拉伯语</option><option value="et">爱沙尼亚语</option><option value="bg">保加利亚语</option><option value="is">冰岛语</option><option value="pl">波兰语</option><option value="bs-Latn">波斯尼亚语(拉丁语)</option><option value="fa">波斯语</option><option value="da">丹麦语</option><option value="de">德语</option><option value="ru">俄语</option><option value="fr">法语</option><option value="zh-TW">繁体中文</option><option value="fil">菲律宾语</option><option value="fj">斐济语</option><option value="fi">芬兰语</option><option value="ht">海地克里奥尔语</option><option value="ko">韩语</option><option value="nl">荷兰语</option><option value="ca">加泰罗尼亚语</option><option value="cs">捷克语</option><option value="otq">克雷塔罗奥托米语</option><option value="tlh">克林贡语</option><option value="hr">克罗地亚语</option><option value="lv">拉脱维亚语</option><option value="lt">立陶宛语</option><option value="ro">罗马尼亚语</option><option value="mg">马达加斯加语</option><option value="mt">马耳他语</option><option value="ms">马来语(拉丁语)</option><option value="bn-BD">孟加拉语</option><option value="mww">苗语</option><option value="af">南非荷兰语</option><option value="pt">葡萄牙语</option><option value="ja">日语</option><option value="sv">瑞典语</option><option value="sm">萨摩亚语</option><option value="sr-Latn">塞尔维亚语(拉丁语)</option><option value="sr-Cyrl">塞尔维亚语(西里尔文)</option><option value="no">书面挪威语</option><option value="sk">斯洛伐克语</option><option value="sl">斯洛文尼亚语</option><option value="sw">斯瓦希里语</option><option value="ty">塔希提语</option><option value="te">泰卢固语</option><option value="ta">泰米尔语</option><option value="th">泰语</option><option value="tr">土耳其语</option><option value="cy">威尔士语</option><option value="ur">乌尔都语</option><option value="uk">乌克兰语</option><option value="es">西班牙语</option><option value="he">希伯来语</option><option value="el">希腊语</option><option value="hu">匈牙利语</option><option value="it">意大利语</option><option value="hi">印地语</option><option value="id">印度尼西亚语</option><option value="yua">尤卡坦玛雅语</option><option value="vi">越南语</option>';

    function Main_Su() {
        this.main_s = null;
        this.ball = null;
        this.tra = null;
        this.ori_select = null;
        this.tra_select = null;
        this.ori_text = null;
        this.tra_text = null;
        //控制翻译框显示
        this.hide = true;
        //控制拖放
        this.mouseBeginX;
        this.mouseBeginY;
        this.diffX;
        this.diffY;
        this.isMouseDown = false;
    }
    Main_Su.prototype.mouseDown = function(e) {
        this.isMouseDown = true;
        this.mouseBeginX = e.clientX;
        this.mouseBeginY = e.clientY;
        var elmX = this.main_s.offsetLeft;
        var elmY = this.main_s.offsetTop;
        var elmWidth = this.main_s.offsetWidth;
        var elmHeight = this.main_s.offsetHeight;
        this.diffX = this.mouseBeginX - elmX;
        this.diffY = this.mouseBeginY - elmY;
    }
    Main_Su.prototype.mouseMove = function(e) {
        if (!this.isMouseDown) {
            return;
        }
        var newMouseX = e.clientX;
        var newMouseY = e.clientY;
        var newElmLeft = newMouseX - this.diffX;
        var newElmTop = newMouseY - this.diffY;
        this.moveElm(this.main_s, newElmTop, newElmLeft)
    }
    Main_Su.prototype.moveElm = function(elm, top, left) {
        elm.style.top = top + 'px';
        elm.style.left = left + 'px';
    }
    Main_Su.prototype.mouseUp = function(e) {
            console.log('mouseUp');
            this.isMouseDown = false;
        }
        /**
         * 设置下拉框选中
         */
    Main_Su.prototype.setSelectChecked = function(select, checkValue) {
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value == checkValue) {
                select.options[i].selected = true;
                break;
            }
        }
    };
    /**
     * 创建小球
     */
    Main_Su.prototype.createBall = function() {
            this.ball = document.createElement('div');
            this.ball.setAttribute('id', 'ball');
            this.ball.setAttribute('style', style.ballStyle);
            var cir = document.createElement('div');
            cir.setAttribute('id', 'cir');
            cir.setAttribute('style', 'margin-left: 2px;width: 18px;height: 18px;border-radius: 50%;background-color: #fff;transition: transform .2s linear');
            this.ball.appendChild(cir);
            return this.ball;
        }
        /**
         * 翻译结果的语言选择下拉框
         */
    Main_Su.prototype.createOriSelect = function() {
            this.ori_select = document.createElement('select');
            this.ori_select.setAttribute('id', "ori_select");
            this.ori_select.setAttribute('style', style.selectStyle);
            this.ori_select.innerHTML = select;
            //设置默认选择
            this.setSelectChecked(this.ori_select, 'zh-CN');
            return this.ori_select;
        }
        /**
         * 需要翻译文本的语言选择下拉框
         */
    Main_Su.prototype.createTraSelect = function() {
            this.tra_select = document.createElement('select');
            this.tra_select.setAttribute('id', "tra_select");
            this.tra_select.setAttribute('style', style.selectStyle);
            this.tra_select.innerHTML = select;
            //设置默认选择
            this.setSelectChecked(this.tra_select, 'en');
            return this.tra_select;
        }
        /**
         * 需要翻译文本的语言输入框
         */
    Main_Su.prototype.createOriText = function() {
            this.ori_text = document.createElement('textarea');
            this.ori_text.setAttribute('id', 'ori_text');
            this.ori_text.setAttribute('style', style.textareaStyle);
            this.ori_text.setAttribute('placeholder', '输入文本');
            //阻止事件冒泡
            this.ori_text.onmousedown = function(e) {
                e.stopPropagation();
            };
            return this.ori_text;
        }
        /**
         * 翻译结果的语言输入框
         */
    Main_Su.prototype.createTraText = function() {
            this.tra_text = document.createElement('textarea');
            this.tra_text.setAttribute('id', 'tra_text');
            this.tra_text.setAttribute('style', style.textareaStyle);
            this.tra_text.setAttribute('placeholder', '输入文本');
            //阻止事件冒泡
            this.tra_text.onmousedown = function(e) {
                e.stopPropagation();
            };
            return this.tra_text;
        }
        /**
         * 控制翻译面板的隐藏
         */
    Main_Su.prototype.hideTra = function() {
            tra.style.height = 0;
            tra.style.transform = 'translate(100%,0)';
            ball.style.visibility = 'visible'
        }
        /**
         * 创建列
         */
    Main_Su.prototype.createOriTd = function() {
            var oriTd = document.createElement('td');
            oriTd.setAttribute('id', 'oriTd');
            oriTd.setAttribute('style', 'border-right: 1px solid #ececec;background-color: #fff;width: 50%;');
            var div = document.createElement('div');
            var div_s = document.createElement('div');
            var div_t = document.createElement('div');
            div_s.setAttribute('style', 'margin: 10px 8px 0 16px;height: 40px;');
            div_t.setAttribute('style', style.dTextStyle);
            //创建添加下拉框跟输入框
            this.createOriSelect();
            div_s.appendChild(this.ori_select);
            this.createOriText();
            div_t.appendChild(this.ori_text);
            div.appendChild(div_s);
            div.appendChild(div_t);
            oriTd.appendChild(div);
            return oriTd;
        }
        /**
         * 创建列
         */
    Main_Su.prototype.createTraTd = function() {
            var traTd = document.createElement('td');
            traTd.setAttribute('id', 'traTd');
            traTd.setAttribute('style', 'width: 50%;background: #f9f9f9;');
            var div = document.createElement('div');
            var div_s = document.createElement('div');
            var div_t = document.createElement('div');
            div_s.setAttribute('style', 'margin: 10px 8px 0 16px;height: 40px;');
            div_t.setAttribute('style', style.dTextStyle);
            this.createTraSelect();
            div_s.appendChild(this.tra_select);
            this.createTraText();
            div_t.appendChild(this.tra_text);
            div.appendChild(div_s);
            div.appendChild(div_t);
            traTd.appendChild(div);
            return traTd;
        }
        /**
         * 创建翻译框
         */
    Main_Su.prototype.createTra = function() {
            this.tra = document.createElement('div');
            this.tra.setAttribute('id', 'tra');
            this.tra.setAttribute('style', style.traStyle)
            var table = document.createElement('table');
            table.setAttribute('style', "width: 100%");
            var tr = document.createElement('tr');
            tr.appendChild(this.createOriTd());
            tr.appendChild(this.createTraTd());
            table.appendChild(tr);
            this.tra.appendChild(table);
            return this.tra;
        }
        /**
         * 创建翻译主面板
         */
    Main_Su.prototype.createMain = function() {
            this.main_s = document.createElement('div');
            this.createBall();
            this.createTra();

            this.main_s.setAttribute('id', 'main_s');
            this.main_s.setAttribute('style', 'position: fixed;top: 100px;right: 0;width: 30%;');
            this.main_s.appendChild(this.ball);
            this.main_s.appendChild(this.tra);
            return this.main_s;
        }
        /**
         * ajax 跨域访问公共方法
         * @param {*} url
         * @param {*} method
         * @param {*} data
         */
    Main_Su.prototype.ajaxFun = function(url, header, method, data) {
            if (!!!method)
                method = 'GET';
            GM_xmlhttpRequest({
                method: method,
                url: url,
                data: data,
                header: header,
                onload: function(res) {
                    if (JSON.parse(res.response)[0][0][0]) {
                        tra_text.value = JSON.parse(res.response)[0][0][0];
                        tra_text.style.color = 'black'
                    }
                },
                onloadstart: function(res) {
                    tra_text.value = "正在翻译..."
                    tra_text.style.color = 'grey'
                },
                onerror: function(res) {
                    console.log("连接失败:" + res);
                }
            });
        }
        /**
         * 判断语种：只能判断中英韩日语
         * @param {} text 
         */
    Main_Su.prototype.judgeLanguage = function(text) {
            if (new RegExp('[\\u4e00-\\u9fa5]').test(text)) {
                return 'zh-CN'
            } else if (new RegExp('[\\x3130-\\x318F]').test(text)) {
                return 'ko'
            } else if (new RegExp('[\\u0800-\\u4e00]').test(text)) {
                return 'ja'
            } else if (new RegExp('[A-Za-z]').test(text)) {
                return 'en'
            } else {
                return 'default'
            }
        }
        /**
         * 翻译
         *  @param {是否关闭自动检测语种} isAuto 
         */
    Main_Su.prototype.translate = function(closeAuto) {
        var from = this.ori_select.value;
        //判断翻译文本的语种
        if (!closeAuto) {
            from = this.judgeLanguage(this.ori_text.value) == 'default' ? from : this.judgeLanguage(this.ori_text.value);
            this.setSelectChecked(this.ori_select, from);
        }
        var to = this.tra_select.value;
        this.ajaxFun(Translations.googleFun(from, to, this.ori_text.value), {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Host": "translate.google.cn"
        });
    }

    /** 
     * 添加绑定事件
     */
    Main_Su.prototype.rigisterEvent = function() {
        this.ball.addEventListener('click', function(e) {
            if (!(e.clientX - this.mouseBeginX == 0) || !(e.clientY - this.mouseBeginY == 0)) return;
            this.hide = !this.hide;
            if (this.hide) {
                this.ball.style.backgroundColor = "darkgray";
                document.getElementById("cir").style.transform = "translate(0,0)";
                this.tra.style.visibility = "hidden"
            } else {
                this.ball.style.backgroundColor = "dodgerblue";
                document.getElementById("cir").style.transform = "translate(22px,0)";
                this.tra.style.visibility = "visible"
            }
        }.bind(this))
        this.ori_text.addEventListener('input', function() {
            this.translate(false);
        }.bind(this));
        this.ori_select.addEventListener('change',
            function() {
                this.translate(true);
            }.bind(this));
        this.tra_select.addEventListener('change', this.translate.bind(this));
        this.ball.addEventListener('mousedown', this.mouseDown.bind(this));
        this.tra.addEventListener('mousedown', this.mouseDown.bind(this));
        document.addEventListener('mousemove', this.mouseMove.bind(this));
        document.addEventListener('mouseup', this.mouseUp.bind(this));
    }
    const Translations = {
            /**
             * 金山词霸翻译
             * @param {需要翻译文本的语言} f
             * @param {翻译结果的语言} t
             * @param {翻译原文} w
             */
            cibaFun: function(f, t, w) {
                var url = cibaUrl + "&f=" + f + "&t=" + t + "&w=" + w;
                return url;
            },
            /**
             * 
             * @param {需要翻译文本的语言} sl 
             * @param {翻译结果的语言} tl 
             * @param {翻译原文} q 
             */
            googleFun: function(sl, tl, q) {
                function sq(a) {
                    return function() {
                        return a
                    }
                }

                function tq(q, b) {
                    for (var c = 0; c < b.length - 2; c += 3) {
                        var d = b.charAt(c + 2);
                        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
                        d = "+" == b.charAt(c + 1) ? q >>> d : q << d;
                        q = "+" == b.charAt(c) ? q + d & 4294967295 : q ^ d
                    }
                    return q
                }
                /**
                 * 计算tk值
                 * @param {你要翻译的内容} q 
                 * @param {tkk的值} uq 
                 */
                function vq(q, uq = '422388.3876711001') {
                    if (null !== uq)
                        var b = uq;
                    else {
                        b = sq('T');
                        var c = sq('K');
                        b = [b(), c()];
                        b = (uq = window[b.join(c())] || "") || ""
                    }
                    var d = sq('t');
                    c = sq('k');
                    d = [d(), c()];
                    c = "&" + d.join("") + "=";
                    d = b.split(".");
                    b = Number(d[0]) || 0;
                    for (var e = [], f = 0, g = 0; g < q.length; g++) {
                        var l = q.charCodeAt(g);
                        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < q.length && 56320 == (q.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (q.charCodeAt(++g) & 1023),
                                    e[f++] = l >> 18 | 240,
                                    e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
                                e[f++] = l >> 6 & 63 | 128),
                            e[f++] = l & 63 | 128)
                    }
                    q = b;
                    for (f = 0; f < e.length; f++) {
                        q += e[f],
                            q = tq(q, "+-a^+6");
                    }
                    q = tq(q, "+-3^+b+-f");
                    q ^= Number(d[1]) || 0;
                    0 > q && (q = (q & 2147483647) + 2147483648);
                    q %= 1000000;
                    return c + (q.toString() + "." + (q ^ b))
                }
                window.TTK = '422388.3876711001';
                var tk = vq(q);
                var url = "https://translate.google.cn/translate_a/single?client=webapp&sl=" + sl + "&tl=" + tl + "&hl=" + sl + "&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=gt&otf=1&ssel=0&tsel=0&kc=3&tk=" + tk + "&q=" + encodeURIComponent(q);
                return url;
            }
        }
        //判断当前窗口是否为最顶层窗口，是则创建
    if (window.top == window.self) {
        var main = new Main_Su();
        main.createMain();
        main.rigisterEvent();
        document.body.appendChild(main.main_s);
    }
})()