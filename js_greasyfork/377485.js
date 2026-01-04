// ==UserScript==
// @name         Hi-history
// @namespace    http://tampermonkey.net/
// @version      1.46
// @description  获取网站浏览历史
// @author       chillybird
// @match        http://*/*
// @match        https://*/*
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/377485/Hi-history.user.js
// @updateURL https://update.greasyfork.org/scripts/377485/Hi-history.meta.js
// ==/UserScript==

addEventListener('DOMContentLoaded', function () {
    (function () {
        'use strict';
        if (self.frameElement && self.frameElement.tagName == "IFRAME") {
            return;
        };
        if (window.frames.length != parent.frames.length) {
            return;
        };
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        let pos_x;
        let pos_y;

        var currentDomain = new URL(window.location.href).hostname;
        document.addEventListener("click", function (e) {
            var target = e.target;
            while (target && !target.href) {
                target = target.parentElement;
            }
            if (target) {
                e.preventDefault();
                var linkDomain = new URL(target.href).hostname;
                if (linkDomain) {
                    if (linkDomain === currentDomain) {
                        window.location = target.href;
                    } else {
                        window.open(target.href);
                    }
                }
            }
        });

        var tab_flag = true; //是否已经弹出面板
        var last_mark = 0;//当前url在列表中的位置
        var i = NaN;
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e.keyCode == 66 && e.altKey) {
                if (tab_flag) {
                    showMarkbook();
                } else {
                    document.getElementsByClassName("exit_his")[0].click();
                }
                tab_flag = !tab_flag;
            }
            if (e.keyCode == 66 && e.ctrlKey) {//ctrl+B复制当前网址
                document.getElementsByClassName('s_item_bnt')[last_mark - 1].children[0].click();
            }

        }
        //创建样式
        var dom = document.createElement('style'),
            dom_body = document.getElementsByTagName('body')[0];

        dom.innerHTML = "#markBook #slider {margin: 0px 30px;width: 160px;background-size: 98% 3px;background: linear-gradient(to left, rgb(249, 118, 118) 0%, rgb(255, 255, 255) 100%);outline: none;-webkit-appearance: none;height: 3px;}#markBook input[type='range']::-webkit-slider-thumb {width: 10px;height: 10px;border-radius: 50%;background-color: rgb(249, 118, 118);box-shadow: 0 0 2px rgba(0, 0, 0, 0.3),0 3px 5px rgba(0, 0, 0, 0.2);cursor: pointer;-webkit-appearance: none;border: 0;}#markBook a:link{color:#0366d6;}#markBook{box-sizing:border-box;box-shadow:1px 1px 2px 1px #0000005c;position:fixed;z-index:9999999999;border-radius:5px;background-color:cornsilk;box-sizing:border-box;width:220px;}.bookNav{ user-select:none;background-color:#fbfbfb !important;    border-bottom:1px solid #a0a0a04a !important;overflow:hidden;/*border-radius:5px;*/}.del_mark{position:absolute;bottom:0px;left:0px;}.bookNav,.del_mark{width:100%;height:28px;line-height:28px;/*position:absolute;bottom:0px;*/background-color:lightgray;font-size:16px;color:#A9A9A9;/*border:1px solid #000000;*/}.hismark_history{width:70px;line-height:28px;box-sizing:border-box;display:inline;height:28px;text-align:center;font-size:14px;color:#000;cursor:pointer;}.exit_his{width:100%;color:#fca273;height:28px;line-height:28px;text-align:center;box-sizing:border-box;cursor:pointer;}.exit_his:hover{background-color:#808080a3;color:rgb(239, 233, 232);}.history_notice{height:280px;width:190px;line-height:40px;}.history_tab{padding:10px 0px 0px 10px;display:block;box-sizing:border-box;padding-bottom:5px;width:250px;}.hismark_del{float:right;width:80px;height:28px;line-height:28px;font-size:12px;text-align:center;color:#000;cursor:pointer}.hismark_del:hover{color:red;}.s_item>a:hover {color:#428bca !important;}.s_item{width:190px;height:40px;position:relative;text-align:left;border-bottom:2px dashed #BEBEBE;padding-left:5px;line-height:40px;}.s_item a{text-decoration:none;font-size:14px;width:185px;position: absolute; top: 50%; transform: translate(0, -50%);display:inline-block;float:left;overflow:hidden; white-space:nowrap;text-overflow:ellipsis;}.m_hismark{overflow:hidden;width:220px;}.s_item_bnt{position:absolute;top:10px; right:0px;font-size:14px;float:right;width:45px;height:20px;cursor:pointer;display:none;color:rgb(250, 128, 114);text-align:center;box-sizing:border-box;}.i_item_bnt{width:100%;height:20px;line-height:20px;box-sizing:border-box;float:left;}.i_item_bnt:last-child{border-left:2px solid rgb(250, 128, 114);}.his_alert{color:#42b983;font-size:18px;font-weight:bold;position:fixed;z-index:144469;animation:mymove 1200ms linear; -webkit-animation:mymove 1200ms linear;}@keyframes mymove{from {top:100px;left:50%;opacity:1;transform:translateX(-50%);}to {top:60px;left:50%;opacity:0;transform:translateX(-50%);display:none;}}@-webkit-keyframes mymove{from {top:100px;left:50%;opacity:1;transform:translateX(-50%);}to {top:60px;left:50%;opacity:0;transform:translateX(-50%);display:none;}}";
        dom_body.appendChild(dom);

        //创建标签
        dom = document.createElement('div');
        dom.id = "markBook";
        var str = "<div class='bookNav'><div class='exit_his'>Hi-history</div></div><div class='m_hismark'>";//    color:#fca273;    background-color:#fbfbfb;

        //获取浏览记录
        if (!sessionStorage) {
            str += "<div class='history_notice'>浏览器不支持sessionStorage！</div>";
        } else {
            // console.log('first record!');
            if (his_item_length() < 1) {
                //建立第一条记录
                sessionStorage.setItem('url_1', location.href);
                sessionStorage.setItem('url_1_name', (document.getElementsByTagName('title')[0]).innerHTML.split(' ').join('-'));
                str += "<div class='history_tab'><div class='s_item'><a title=" + sessionStorage.getItem('url_' + i + '_name') + " href=" + sessionStorage.getItem('url_1') + ">1:" + sessionStorage.getItem('url_1_name') + "</a><div class='s_item_bnt'><div class='i_item_bnt'rgb(250, 128, 114)>复制</div></div><textarea class='s_copy' style='height:0px;width:0px;opacity:0;margin:0px;padding:0px;'>content</textarea></div></div>";
            } else {
                // console.log('continue!');
                history_tab1();
            }
        }
        //创建按钮
        var slider_val = sessionStorage.getItem("sliderVal");
        console.log("opacity", slider_val);
        if (!slider_val) {
            slider_val = 1;
        }
        str += "</div><input type='range' min='0' max='1' step='0.01' id='slider' value='" + slider_val + "'><a  style='width:220px;height:40px;line-height:40px;display:block;color:#8e959a;font-size:14px;text-align:center;overflow:hidden;border-bottom:none;white-space:pre-wrap; text-overflow:ellipsis;' href=" + location.href.slice(0, location.href.indexOf(location.host)) + location.host + ">" + location.href.slice(0, location.href.indexOf(location.host)) + location.host + "</a></div>";
        dom.innerHTML = str;
        dom_body.appendChild(dom);

        var markBook = document.getElementById('markBook');
        var dragPoint = document.getElementsByClassName('bookNav')[0];
        var exit_bnt = document.getElementsByClassName('exit_his')[0];
        markBook.style.opacity = slider_val;
        markBook.style.userSelect = "none";


        hismark_init();

        // 透明度滑动条
        var slider = document.getElementById("slider");
        slider.oninput = function () {
            markBook.style.opacity = this.value;
            sessionStorage.setItem("sliderVal", this.value);
        }

        exit_bnt.onclick = function () {
            hideMarkbook();
        };

        dragPoint.addEventListener("mousedown", (event) => {
            //document.body.style.userSelect = "none";
            //markBook.style.transition = "none";
            initialX = event.clientX - xOffset;
            initialY = event.clientY - yOffset;

            console.log("on", initialX, initialY);
        });

        dragPoint.addEventListener("mouseup", () => {
            // 恢复动画
            //element.style.userSelect = "text";
            //markBook.style.transition = "all 400ms";
            console.log("up");
        });

        // 拖放元素
        dragPoint.addEventListener("dragstart", (event) => {
            // 设置元素的透明度（可选）
            markBook.style.opacity = "0.5";
            console.log("dragstart");
        });

        dragPoint.addEventListener("dragend", (event) => {
            // 恢复元素的透明度（可选
            markBook.style.opacity = slider.getAttribute("value");

            var left_pos = parseInt(extract_numder(markBook.style.left)[0]);
            var top_pos = parseInt(extract_numder(markBook.style.top)[0]);

            if (markBook.style.transform) {
                var trans_pos = extract_numder(markBook.style.transform);
                left_pos = left_pos + parseInt(trans_pos[1]);
                top_pos = top_pos + parseInt(trans_pos[2]);
            }

            if (left_pos < 0 && top_pos < 0) {
                console.log("dragover1", left_pos, top_pos, xOffset, yOffset);

                xOffset = xOffset - left_pos;
                yOffset = yOffset - top_pos;
                left_pos = 0;
                top_pos = 0;
            }

            if (left_pos < 0) {
                console.log("dragover2", left_pos, top_pos, xOffset, yOffset);

                xOffset = xOffset - left_pos;
                left_pos = 0;
            }

            if (top_pos < 0) {
                console.log("dragover3", left_pos, top_pos, xOffset, yOffset);

                yOffset = yOffset - top_pos;
                top_pos = 0;
            }
            setTranslate(xOffset, yOffset, markBook);

            sessionStorage.setItem("elementX", left_pos);
            sessionStorage.setItem("elementY", top_pos);
            console.log("save", left_pos, top_pos);
            console.log("dragend", xOffset, yOffset);

        });

        dragPoint.addEventListener("dragover", (event) => {
            event.preventDefault();
            xOffset = event.clientX - initialX;
            yOffset = event.clientY - initialY;

            setTranslate(xOffset, yOffset, markBook);

            // console.log("dragover", event.clientX, event.clientY, initialX, initialY, xOffset, yOffset);

        });

        add_item_bnt();

        function showMarkbook() {
            markBook.style.left = "0px";
            var W_height = document.documentElement.clientHeight;
            var scroll_height = document.documentElement.clientHeight - 90;
            var object_height = markBook.clientHeight;
            var scroll_tab = document.getElementsByClassName("history_tab");
            var m_hismark = document.getElementsByClassName("m_hismark")[0];
            if ((object_height + 40) > W_height) {
                scroll_tab[0].style.height = scroll_height + "px";
                scroll_tab[0].style.overflow = "scroll";
                scroll_tab[0].style.overflowX = "hidden";
                m_hismark.style.height = scroll_height + "px";
            }
        };

        function hideMarkbook() {
            markBook.style.left = "-220px";
            markBook.style.top = "0px";
            markBook.style.transform = "none";
            xOffset = 0;
            yOffset = 0;
            sessionStorage.setItem("elementX", 0);
            sessionStorage.setItem("elementY", 0);
        };

        // 设置元素的位置
        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }

        function extract_numder(str) {
            var numbers = str.match(/-?\d+/g);
            return numbers;
        }

        function copy_alert(text) {
            var dom = document.createElement('div'),
                dom_body = document.getElementsByTagName('body')[0];
            // 判断网址是否复制成功
            dom.classList.add('his_alert');
            dom.innerHTML = text;
            dom_body.appendChild(dom);
        }

        function copyText(text) {
            var textarea = document.createElement("textarea"); // 创建一个文本域元素
            textarea.value = text; // 将文本内容放入文本域
            document.body.appendChild(textarea); // 将文本域添加到网页中
            textarea.select(); // 选中文本域中的文本
            var success = document.execCommand("copy"); // 执行复制命令
            document.body.removeChild(textarea); // 将文本域从网页中移除
            if (success) {
                copy_alert("复制成功");
            } else {
                copy_alert("复制失败");
            }
        }

        function hismark_init() {
            if (top != window) {
                console.log("Not a top window!");
                return;
            }
            // 初始化位置
            pos_x = sessionStorage.getItem("elementX") | 0;
            pos_y = sessionStorage.getItem("elementY") | 0;
            markBook = document.getElementById('markBook');
            if (pos_x != 0 || pos_y != 0) {
                markBook.style.left = `${pos_x}px`;
                markBook.style.top = `${pos_y}px`;
            } else {
                markBook.style.left = "-220px";
                markBook.style.top = "0px";
            }
            //markBook.style.transition = "all 400ms";
            console.log("initail pos:", pos_x, pos_y);
            //setTranslate(pos_x, pos_y, document.getElementById('markBook'));
        }
        function history_tab1() {
            str += "<div class='history_tab'>";
            var url_name = 'url_' + (his_item_length() + 1);

            if (find_history(window.location.href)) {
                sessionStorage.setItem(url_name, window.location.href);
                sessionStorage.setItem(url_name + '_name', (document.getElementsByTagName('title')[0]).innerHTML.split(' ').join('-'));
            }

            for (var i = 1; i <= his_item_length(); i++) {
                if (sessionStorage.getItem('url_' + i) !== null) {
                    if (sessionStorage.getItem('url_' + i + '_name') === null) {
                        sessionStorage.setItem('url_' + i + '_name', 'note' + i);
                    }
                    str += "<div class='s_item'><a title=" + sessionStorage.getItem('url_' + i + '_name') + " href=" + sessionStorage.getItem('url_' + i) + ">" + i + ":" + sessionStorage.getItem('url_' + i + '_name') + "</a><div class='s_item_bnt'><div class='i_item_bnt'rgb(250, 128, 114)>复制</div></div><textarea class='s_copy' style='height:0px;width:0px;opacity:0;margin:0px;padding:0px;'>content</textarea></div>";
                }
            }
            str += "</div>";
        }

        function extractBaseUrl(url) {
            // 使用URL对象来解析给定的URL
            const parsedUrl = new URL(url);

            // 返回不包含查询参数的基础URL
            return `${parsedUrl.origin}${parsedUrl.pathname}`;
        }

        function find_history(his_url) {
            var baseUrl = extractBaseUrl(his_url);
            for (var i = 1; ; i++) {
                var storedUrl = sessionStorage.getItem('url_' + i);
                if (!storedUrl) break;
                if (extractBaseUrl(storedUrl) === baseUrl) return false;
            }
            return true;
        }

        function his_item_length() {
            var len = 0;
            for (var i = 1; i <= sessionStorage.length; i++) {
                if (sessionStorage.getItem('url_' + i) !== null)
                    len = len + 1;
            }
            return len;
        }

        function his_mark(his_url, last_mark) {
            var historyTab = document.getElementsByClassName("history_tab")[0].children;
            var his_index = null;

            for (var i = 1; i <= sessionStorage.length; i++) {
                var storedUrl = sessionStorage.getItem('url_' + i);
                if (extractBaseUrl(storedUrl) === his_url) {
                    his_index = i;
                    break;
                }
            }

            if (last_mark !== 0 && last_mark !== his_index && historyTab[last_mark - 1]) {
                historyTab[last_mark - 1].style.borderBottom = "2px dashed #BEBEBE";
            }

            if (his_index !== null && historyTab[his_index - 1]) {
                historyTab[his_index - 1].style.borderBottom = "2px solid #FA8072";

            }

            return his_index;
        }

        // 检查url是否发生改变，使用框架时，嵌套路由得改变，不引起页面得刷新
        var win_url = location.href;
        setInterval(function () {
            if (win_url !== location.href) {
                var url_name = 'url_' + (his_item_length() + 1);
                if (find_history(location.href)) {
                    sessionStorage.setItem(url_name, window.location.href);
                    sessionStorage.setItem(url_name + '_name', (document.getElementsByTagName('title')[0]).innerHTML);
                    var ele = document.createElement('div');
                    ele.className = "s_item";
                    ele.innerHTML = "<a href=" + sessionStorage.getItem(url_name) + ">" + (his_item_length()) + ":" + sessionStorage.getItem(url_name + '_name') + "</a><div class='s_item_bnt'><div class='i_item_bnt'rgb(250, 128, 114)>复制</div></div><textarea class='s_copy' style='height:0px;width:0px;opacity:0;margin:0px;padding:0px;'>content</textarea>";
                    document.getElementsByClassName("history_tab")[0].appendChild(ele);
                    add_item_bnt();
                }
                win_url = location.href;
            }
            his_mark(extractBaseUrl(location.href));
        }, 3000);

        setInterval(function() {
            window.addEventListener('mousemove', function(event) {
                var mouseX = event.clientX;
                var mouseY = event.clientY;

                if (mouseX > event.clientX + 20) {
                    return;
                }

                if(mouseX < 5 && mouseY < markBook.clientHeight) {
                    showMarkbook();
                    return;
                }

                if (!(mouseX < markBook.clientWidth + 5 && mouseY < markBook.clientHeight + 5)) {
                    hideMarkbook();
                }
            });
        }, 500);

        function add_item_bnt() {
            //删除与复制按钮
            var s_item = document.getElementsByClassName('s_item');
            var s_item_bnt = document.getElementsByClassName('s_item_bnt');
            var s_copy = document.getElementsByClassName('s_copy');
            for (var i = 0; i < s_item.length; i++) {
                (function (i) {
                    s_item[i].onmouseover = function () {
                        s_item_bnt[i].style.display = "block";
                        s_item[i].children[0].style.width = 140 + 'px';
                    };
                    s_item[i].onmouseout = function () {
                        s_item_bnt[i].style.display = "none";
                        s_item[i].children[0].style.width = 185 + 'px';
                    };

                    s_item_bnt[i].children[0].onclick = function () {
                        copyText("[" + sessionStorage.getItem('url_' + (i + 1) + '_name') + "](" + sessionStorage.getItem('url_' + (i + 1)) + ")");
                    };
                })(i);
            }
        }
    })();
}, false);
