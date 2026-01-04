// ==UserScript==
// @name         问卷星报名脚本
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  问卷星自动填写提交脚本
// @author       ZZH
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wjx.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448759/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%8A%A5%E5%90%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448759/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%8A%A5%E5%90%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function tm_now(){
             var time = new Date();
              var Y = time.getFullYear();
              var M = time.getMonth();
              M = (M+1) < 10 ? '0' + (M+1) : (M+1);  //这里月份加1的原因是因为月份是从0开始的，0-11月，加1让月份从1-12月区间。
              var d = time.getDate();
              d = d < 10 ? '0' + d : d;
              var h = time.getHours();
              h = h < 10 ? '0' + h : h;
              var m = time.getMinutes();
              m = m < 10 ? '0' + m : m;
              var s = time.getSeconds();
              s = s < 10 ? '0' + s : s;
              return Y+"-"+M+"-"+d+" "+ h + ":" + m + ":" + s;
         }
        window.onload = function () {
            var style = document.createElement('style');
            style.type = "text/css";
            style.innerHTML = ".tm_tool_btn{position:fixed;top:50px;right:50px;z-index:1000;width:40px;height:40px;border:2px solid #3485ff;border-radius:50%;cursor:pointer;background:#e0f2fe url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABDxJREFUWEfFl99rHFUUx7/nzo/dqJVqbSxtdjYJorQKKvoHGLHij4f6KxstpZktFlFRtA++VGhEkD6VIlIUkuxsUIr5KfSpUGlB8EXRp9QHQ7s7W6oSRRObJjOze4/MxtlMktnd2W3RhX2ZnXu+n3vuOd9zl/A/f+i/1jc+5z32AboY6G4C6Mo7zwsWb/kvMHjd78R8ys4mJtqF9sVR9sahapkAIjIDRt47TizvqwhxsipWKZOA2A6icTBn2oGoiQP3A5gNIGoARt55yR5MTAa7M3LuSRAe0FXthbkDtOg/N3JOfzsQ9cT9mDWAlOWeF8CPRVM/EkCkLHeYgAch5YB9KHkpgGCiN0qm3hfnKBqJbwIg5gWACnZWfycInrbc0xLYEQh25ZYfI1KOxQVIWe67BPoQ4EL47DcVoZ8B5soHgtSjDC6WTP3VqJS3AhCsZ+AIqdrZcPXXBUhq139wylvOCqDAwMsbiy4uQNx6WVcDfgauZDsudOeWuyuk5KLaLg5AXPGoGmja580AWhFfB9DKQiPnHIcQvfaglgl3QisxIp0wHEBCzm9sM/94Qj7xKQTdGUC0I74uA2uBq2bjW3Gy+mVOMlGCwBpAZ2xTf632ruV8CRIEKSfaMahIgHrmsmec9WvXvW8ZuECqNlr1dNAYAX0Mfqpdi25pGvbm2SizN13NDNE5MD+BVW8/x0SLpQ41gwxV4jhk3WnYaPGu/Mq9AmIcjD99J1yzWfoaLNP+ceidambuGXLiQsTOwM78sqFIZRyE5bANG5b7CIDvbVOnVM75AoQ7VpYWMvNvdl6LAxELYMcob9eEf+bAOvGI6WhY7mdg9AhomUKW/moG0RTgrpH5LR3K7X7BJSPFQZME9oqmvn9tgHknGPxQWdcyV/fT740gGgOcZzVddCckaGvdnZv6pGG5MyBasE19cK2dvSEQPy64molf60E0BEjnnNOSqDaK611Kqi265M4w0S/+FA15yhCInizL8sDVQ7eUoiDqAqQtd1QCPaW0thd9VK4nHgS9e4xvTcjyNMCXbFN/vQaRd46B6VkSlYHiwY7LGyEiAdKWe0oCuxOLf++be3tb7OtYd463SvKmGZgtmXr1YlsFX4XYJ1kOXMkmfw5DbAJIW+4JBh5VPLf/8uHbfmu284078jtGF940Ad+Fr3f/QrxIggeKBxM/RRqRYTkfAbRXcKW/kO0otCoeBE2NLO2Eok8Ry2/sbOK9cCaYKRWuk1oG/DkvSPmEPO4vHl4lbHfC+Wt7hpfTFVWZIuazxWziqP/Mz05ClGeLpta5OQNDrBrd5a8ALvlFdCPiQfCu4ZV7FFVMMdGM9NSPFeG8z0L02ab+cOQR7MovblM4eYaBAgGvtDvhwnWRHnN2syQ/A0+D6CKk/MPOJp6LBKimfXSll4UYudG/YY3cr2EXxF14s95rOgtullC9OP8Ab3t0P2/s4cUAAAAASUVORK5CYII=') no-repeat center center;}.tm_tool_btn:hover{background-color:#ffffff;}.tm_content{position:fixed;top:50px;right:100px;width:300px;height:550px;border:2px solid #3485ff;border-radius:4px;background-color:#ccc;padding:10px;display:none;z-index:1000;}.tm_content.active{display:block;}.tm_content > p{margin:16px 0;} .tm_content input {-webkit-appearance: auto;} #tm_btn_start {width:100px;height:40px}";
            document.getElementsByTagName('head').item(0).appendChild(style);
            var tool_btn = document.createElement('a');
            tool_btn.classList.add('tm_tool_btn');
            document.body.appendChild(tool_btn);
            var tool_content = document.createElement('div');
            tool_content.classList.add('tm_content');
            tool_content.classList.add('active');
            tool_content.innerHTML = '<p>报名地址:<input type="text"name="url"value="https://www.wjx.top/vm/YmEuIa8.aspx"/></p><p>幼儿姓名:<input type="text"name="name"value="何宸琦"/></p><p>幼儿性别:<label><input type="radio"name="sex"value="男"checked="checked">男</label><label><input type="radio"name="sex"value="女">女</label></p><p>身份证号码:<input type="text"name="id_card"value="500236201908090031"/></p><p>出生日期:<input type="text"name="sr"value="2019-08-09"/></p><p>家长姓名:<input type="text"name="pname"value="何志超"/></p><p>手机号码:<input type="text"name="phone"value="18290503358"/></p><p>家庭地址:<textarea name="addr"rows="4"style="vertical-align:text-top;">重庆市奉节县夔州街道冒峰社区飞洋世纪城7-24-2</textarea></p><p>开始时间:<input type="text"name="year"value="2022"style="width: 35px;"/>年<input type="text"name="mon"value="8"style="width: 20px;"/>月<input type="text"name="day"value="17"style="width: 20px;"/>日<input type="text"name="hour"value="9"style="width: 20px;"/>时<input type="text"name="min"value="0"style="width: 20px;"/>分</p><p>当前时间:<span id="tm_timestamp_now"></span></p><p><button id="tm_btn_start">开始</button><span id="tm_status_txt"></span></p><p id="tm_proccess_status"></p>';
            document.body.appendChild(tool_content);
            document.querySelector("#tm_timestamp_now").innerHTML = tm_now();
            setInterval(function () {
                document.querySelector("#tm_timestamp_now").innerHTML = tm_now();
            }, 1000);
            if (localStorage.getItem("tm_qp_url")) {
                document.querySelector(".tm_content [name='url']").value = localStorage.getItem("tm_qp_url")
            }
            if (localStorage.getItem("tm_qp_name")) {
                document.querySelector(".tm_content [name='name']").value = localStorage.getItem("tm_qp_name")
            }
            if (localStorage.getItem("tm_qp_sex")) {
                document.querySelectorAll(".tm_content [name='sex']").forEach(function (item) {
                    item.removeAttribute('checked')
                })
                document.querySelectorAll(".tm_content [name='sex']").forEach(function (item) {
                    if (item.value === localStorage.getItem("tm_qp_sex")) {
                        item.setAttribute('checked', 'checked')
                    }
                })
            }
            if (localStorage.getItem("tm_qp_id_card")) {
                document.querySelector(".tm_content [name='id_card']").value = localStorage.getItem("tm_qp_id_card")
            }
            if (localStorage.getItem("tm_qp_sr")) {
                document.querySelector(".tm_content [name='sr']").value = localStorage.getItem("tm_qp_sr")
            }
            if (localStorage.getItem("tm_qp_pname")) {
                document.querySelector(".tm_content [name='pname']").value = localStorage.getItem("tm_qp_pname")
            }
            if (localStorage.getItem("tm_qp_phone")) {
                document.querySelector(".tm_content [name='phone']").value = localStorage.getItem("tm_qp_phone")
            }
            if (localStorage.getItem("tm_qp_addr")) {
                document.querySelector(".tm_content [name='addr']").value = localStorage.getItem("tm_qp_addr")
            }
            if (localStorage.getItem("tm_qp_year")) {
                document.querySelector(".tm_content [name='year']").value = localStorage.getItem("tm_qp_year")
            }
            if (localStorage.getItem("tm_qp_mon")) {
                document.querySelector(".tm_content [name='mon']").value = localStorage.getItem("tm_qp_mon")
            }
            if (localStorage.getItem("tm_qp_day")) {
                document.querySelector(".tm_content [name='day']").value = localStorage.getItem("tm_qp_day")
            }
            if (localStorage.getItem("tm_qp_hour")) {
                document.querySelector(".tm_content [name='hour']").value = localStorage.getItem("tm_qp_hour")
            }
            if (localStorage.getItem("tm_qp_min")) {
                document.querySelector(".tm_content [name='min']").value = localStorage.getItem("tm_qp_min")
            }
            var start_flag =  localStorage.getItem("tm_qp_start");
            if (start_flag) {
                document.querySelector('#tm_btn_start').innerHTML = '停止';
                document.querySelector('#tm_status_txt').innerHTML = '运行中...';
                tm_main_function(true);
            }
            document.querySelector('#tm_btn_start').onclick = function () {
                if (this.innerHTML === '开始') {
                    this.innerHTML = '停止';
                    window.tm_running = false;
                    document.querySelector('#tm_status_txt').innerHTML = '运行中...';
                    tm_main_function(true);
                } else {
                    localStorage.removeItem('tm_qp_start');
                    this.innerHTML = '开始';
                    document.querySelector('#tm_status_txt').innerHTML = '';
                    tm_main_function(false);
                }
            }
            document.querySelector('.tm_tool_btn').onclick = function () {
                if (document.querySelector('.tm_content').classList.contains('active')) {
                    document.querySelector('.tm_content').classList.remove('active');
                } else {
                    document.querySelector('.tm_content').classList.add('active');
                }
            }
        };
        function tm_main_function (start) {
            if (start) {
                var url = document.querySelector(".tm_content [name='url']").value;
                if (url) {
                    localStorage.setItem("tm_qp_url", url);
                    localStorage.setItem("tm_qp_name", document.querySelector(".tm_content [name='name']").value);
                    localStorage.setItem("tm_qp_sex", document.querySelector(".tm_content [name='sex']:checked").value);
                    localStorage.setItem("tm_qp_id_card", document.querySelector(".tm_content [name='id_card']").value);
                    localStorage.setItem("tm_qp_sr", document.querySelector(".tm_content [name='sr']").value);
                    localStorage.setItem("tm_qp_pname", document.querySelector(".tm_content [name='pname']").value);
                    localStorage.setItem("tm_qp_phone", document.querySelector(".tm_content [name='phone']").value);
                    localStorage.setItem("tm_qp_addr", document.querySelector(".tm_content [name='addr']").value);
                    localStorage.setItem("tm_qp_year", document.querySelector(".tm_content [name='year']").value);
                    localStorage.setItem("tm_qp_mon", document.querySelector(".tm_content [name='mon']").value);
                    localStorage.setItem("tm_qp_day", document.querySelector(".tm_content [name='day']").value);
                    localStorage.setItem("tm_qp_hour", document.querySelector(".tm_content [name='hour']").value);
                    localStorage.setItem("tm_qp_min", document.querySelector(".tm_content [name='min']").value);
                    localStorage.setItem("tm_qp_start", true);
                    tm_mian_child_function();
                    window.tm_timer = setInterval(tm_mian_child_function, 500);
                } else {
                    alert('请填写报名地址！');
                    localStorage.removeItem('tm_qp_start');
                    document.querySelector('#tm_btn_start').innerHTML = '开始';
                    document.querySelector('#tm_status_txt').innerHTML = '';
                }
            } else {
                clearInterval(window.tm_timer);
                document.querySelector('#tm_proccess_status').innerHTML = '';
            }
        }
        function tm_mian_child_function () {
            var start_year = document.querySelector(".tm_content [name='year']").value;
            var start_mon = document.querySelector(".tm_content [name='mon']").value;
            var start_day = document.querySelector(".tm_content [name='day']").value;
            var start_hour = document.querySelector(".tm_content [name='hour']").value;
            var start_min = document.querySelector(".tm_content [name='min']").value;
            if (start_year !== '' && start_mon !== '' && start_day !== '' && start_hour !== '' && start_min !== '') {
                var target_time = new Date(start_year + '/' + start_mon + '/' + start_day + ' ' + start_hour + ':' + start_min + ':00');
                var now_time = new Date();
                if (now_time.valueOf() < target_time.valueOf()) {
                    document.querySelector('#tm_proccess_status').innerHTML = '等待开始时间...';
                } else {
                    var q1 = document.querySelector('#q1');
                    if (!q1) {
                        document.querySelector('#tm_proccess_status').innerHTML = '未找到表单元素，自动刷新页面';
                        window.location.href = document.querySelector(".tm_content [name='url']").value;
                    } else {
                        if (!window.tm_running) {
                            window.tm_running = true;
                            document.querySelector('#tm_proccess_status').innerHTML = '开始填写表单';
                            for (var i = 1; i < 10; i++) {
                                var target_div = document.querySelector('#div'+i);
                                if (target_div) {
                                    var target_label = target_div.querySelector('.field-label').innerHTML;
                                    if (target_label.indexOf('幼儿姓名') > -1) {
                                        document.querySelector('#q'+i).value = document.querySelector(".tm_content [name='name']").value;
                                    } else if (target_label.indexOf('性别') > -1) {
                                        target_div.querySelectorAll('.ui-radio').forEach(function(item) {
                                            if (item.querySelector('.label').innerHTML === document.querySelector(".tm_content [name='sex']:checked").value) {
                                                item.querySelector('.jqradio').click();
                                            }
                                        })
                                    } else if (target_label.indexOf('身份证号码') > -1) {
                                        document.querySelector('#q'+i).value = document.querySelector(".tm_content [name='id_card']").value;
                                    } else if (target_label.indexOf('家长姓名') > -1) {
                                        document.querySelector('#q'+i).value = document.querySelector(".tm_content [name='pname']").value;
                                    } else if (target_label.indexOf('手机') > -1) {
                                        document.querySelector('#q'+i).value = document.querySelector(".tm_content [name='phone']").value;
                                    } else if (target_label.indexOf('地址') > -1) {
                                        document.querySelector('#q'+i).value = document.querySelector(".tm_content [name='addr']").value;
                                    } else if (target_label.indexOf('日期') > -1) {
                                        document.querySelector('#q'+i).value = document.querySelector(".tm_content [name='sr']").value;
                                    }
                                }
                            }
                            document.querySelector('#tm_proccess_status').innerHTML = '提交表单';
                            localStorage.removeItem('tm_qp_start');
                            document.querySelector('#ctlNext').click();
                        }
                    }

                }
            } else {
                alert('开始时间填写错误!');
            }
        }
})();