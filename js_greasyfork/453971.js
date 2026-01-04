// ==UserScript==
// @name         劲爆后台
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  劲爆后台-简化操作
// @author       Chi
// @match        http://api.gmyou.top:88/*?sdk=*
// @match        http://jinbao.gmsy.im:88/game/gback.html?game_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gmsy.im
// @grant        unsafeWindow
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453971/%E5%8A%B2%E7%88%86%E5%90%8E%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/453971/%E5%8A%B2%E7%88%86%E5%90%8E%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var all_List = {}
    var scrollTop = 0
    var up = 0
    var clock = 0
    var c_List = {
        e: "",
        func: "",
        List: []
    }
    var b_List = []

    for (const i of document.getElementsByTagName("select")) {
        if (i.id != "uid") {
            all_List[i.id] = {
                e: "",
                func: "",
                List: []
            }
            all_List[i.id].e = i;
            for (const j of i.children) {
                if (j['value'] && j['value'] != "00")
                    all_List[i.id].List.push({
                        value: j['value'],
                        label: j['label']
                    })
            }

            i.options.length = 0
        }
    }
    let t = 0
    for (let index = 0; index < document.getElementsByTagName("button").length; index++) {
        const e = document.getElementsByTagName("button")[index];
        if (e.id) {
            let i = 0
            for (const key in all_List) {
                if (i == t)
                    all_List[key].func = (e.onclick + "").split("\n")[1]
                else
                    i++

            }
            t++
        }
    }
    render()

    function render() {
        var div_a = document.createElement("div");
        var div_b = document.createElement("div");
        var div_c = document.createElement("div");
        var div_d = document.createElement("div");
        var div_e = document.createElement("div");
        var div_f = document.createElement("div");
        var div_g = document.createElement("div");
        var input_a = document.createElement("input");
        var input_b = document.createElement("input");
        var input_c = document.createElement("input");
        var input_d = document.createElement("input");
        div_a.setAttribute("style", "overflow-x:hidden !important;height: calc(100vh - 138px);overflow: scroll;");
        div_b.setAttribute("style", "width: 100%;height: 100%;");
        div_c.setAttribute("style", "overflow:hidden !important;opacity:0.9;width: 100vw;height: 100%;overflow: scroll;position: fixed;right: 0px;top: 0%;background-color: #fffcf7;z-index: 9999;border: 1px solid rgb(233, 234, 236);border-radius: 4px;");
        div_d.setAttribute("style", "width: 100%;height: 50px;display:flex;");
        div_f.setAttribute("style", "width: 60px;height: 74px;overflow: hidden;position: fixed;right: 10px;top: 10%;padding: 4px;background-color: #0093E9;z-index: 9999;border: 1px solid rgb(233, 234, 236);border-radius: 4px;justify-content: center;align-items: center;display: flex;");
        div_e.style.display = "flex"
        div_g.style.display = "flex"
        input_a.className = "form-control"
        input_a.placeholder = "输入物品名"
        input_b.className = "form-control"
        input_b.placeholder = "输入发送数量"
        input_c.className = "form-control"
        input_c.placeholder = "输入发送次数"
        input_d.className = "form-control"
        input_d.placeholder = "输入发送延迟(s)"
        input_a.style.margin = "5px "
        input_b.style.margin = "5px "
        input_c.style.margin = "5px "
        input_d.style.margin = "5px "
        input_b.id = "my_num"
        input_c.id = "my_times"
        input_d.id = "my_delay"
        input_b.type="number"
        input_c.type="number"
        input_d.type="number"
        input_b.value = "1"
        input_c.value = "1"
        input_d.value = "5"
        div_f.innerText = "开关"
        div_f.style.color = "white"
        div_c.style.display = "none"
        div_f.onclick = () => {
            if (document.location.host == "jinbao.gmsy.im:88") {
                document.location.href = document.getElementsByTagName('iframe')[0].src
            } else {
                if (div_c.style.display == "none") {
                    div_c.style.display = "block"
                    document.body.style.overflow = "hidden"
                } else {
                    div_c.style.display = "none"
                    document.body.style.overflow = "scroll"
                }
            }
        }

        input_a.oninput = e => {
            var key = input_a.value
            c_List.List = b_List.filter(i => {
                if (i.label.indexOf(key) != -1)
                    return true
                else
                    return false
            })
            render_list(div_b, c_List.List.slice(up, up + 30))
        }


        div_c.appendChild(div_d)
        div_c.appendChild(div_e)
        div_c.appendChild(div_g)
        div_c.appendChild(div_a)
        div_a.appendChild(div_b)
        document.body.appendChild(div_c)
        document.body.appendChild(div_f)
        div_e.appendChild(input_a)
        div_e.appendChild(input_b)
        div_g.appendChild(input_c)
        div_g.appendChild(input_d)
        var t = 1;
        for (const key in all_List) {
            var b = document.createElement("button")
            b.innerText = "【" + t + "】"
            t++
            b.style.height = "40px"
            b.style.flex = 1
            b.style.margin = "5px"
            b.style.backgroundColor = "#d9534f"
            b.style.border = "none"
            b.style.color = "white"
            b.style.padding = "0 10px"
            b.style.borderRadius = "2px"
            b.onclick = () => {

                clearInterval(clock)
                scrollTop = up = 0
                c_List = JSON.parse(JSON.stringify(all_List[key]))
                b_List = JSON.parse(JSON.stringify(all_List[key].List))
                render_list(div_b, c_List.List.slice(up, up + 30))
            }
            div_d.appendChild(b)
        }

        div_a.onscroll = (e) => {
            scrollTop = div_a.scrollTop
            up = parseInt(scrollTop / 40)
            div_b.style.paddingTop = up * 40 + "px"
            div_b.style.paddingBottom = (c_List.length - up) * 40 + "px"
            render_list(div_b, c_List.List.slice(up, up + 30))
        }

        render_list(div_b, c_List.List.slice(up, up + 30))

    }

    function render_list(div_b, List) {
        div_b.innerHTML = ""
        div_b.style.paddingTop = up * 40 + "px"
        div_b.style.paddingBottom = (c_List.List.length - up) * 40 + "px"
        for (const i of List) {
            var d = document.createElement("div");
            d.setAttribute("style", "padding:10px;height:40px;cursor:pointer;")
            d.innerText = i['label']
            d.onclick = () => {
                clearInterval(clock)
                var my_times = document.getElementById("my_times").value ? parseInt(document.getElementById("my_times").value) : 1
                var num = 0
                var delay=document.getElementById("my_delay").value?parseInt(document.getElementById("my_delay").value):5
                if (c_List.func == "charge()")
                    charge(i)
                else if (c_List.func == "jinbi()")
                    jinbi(i)
                else if (c_List.func == "bangy()")
                    bangy(i)
                else if (c_List.func == "send_pet()")
                    send_pet(i)
                else if (c_List.func == "mail()")
                    mail(i)
                num++

                if (num == my_times)
                    return

                clock = setInterval(_ => {
                    if (c_List.func == "charge()")
                        charge(i)
                    else if (c_List.func == "jinbi()")
                        jinbi(i)
                    else if (c_List.func == "bangy()")
                        bangy(i)
                    else if (c_List.func == "send_pet()")
                        send_pet(i)
                    else if (c_List.func == "mail()")
                        mail(i)
                    num++

                    if (num == my_times)
                        clearInterval(clock)
                }, delay*1000)
            }

            div_b.appendChild(d)
        }
    }

    function charge(i) {
        var uid = $('#uid').val();
        var chargenum = i['value'];
        if (uid == '') {
            layer.msg('请选择授权信息');
            return false;
        }
        if (chargenum == '') {
            layer.msg('充值数量不可为空');
            return false;
        }
        if (chargenum < 1 || chargenum > 999999999) {
            layer.msg('充值数量:1-999999999');
            return false;
        }
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        });
        $.post("user/query.php?sdk=" + $('#sdk').val(), {
                type: 'pay',
                uid: uid,
                num: chargenum
            },
            function (data) {
                layer.msg(data);
            });
    }

    function jinbi(i) {
        var uid = $('#uid').val();
        var chargenum = i['value']
        if (uid == '') {
            layer.msg('请选择授权信息');
            return false;
        }
        if (chargenum == '') {
            layer.msg('充值数量不可为空');
            return false;
        }
        if (chargenum < 1 || chargenum > 999999) {
            layer.msg('充值数量:1-999999');
            return false;
        }
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        });
        $.post("user/query.php?sdk=" + $('#sdk').val(), {
                type: 'jinbi',
                uid: uid,
                num: chargenum
            },
            function (data) {
                layer.msg(data);
            });
        document.getElementById("jinbi").disabled = true;
        jb();
    }

    function bangy(i) {
        var uid = $('#uid').val();
        var chargenum = i['value'];
        if (uid == '') {
            layer.msg('请选择授权信息');
            return false;
        }
        if (chargenum == '') {
            layer.msg('充值数量不可为空');
            return false;
        }
        if (chargenum < 1 || chargenum > 999999) {
            layer.msg('充值数量:1-999999');
            return false;
        }
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        });
        $.post("user/query.php?sdk=" + $('#sdk').val(), {
                type: 'bangy',
                uid: uid,
                num: chargenum
            },
            function (data) {
                layer.msg(data);
            });
        document.getElementById("bangy").disabled = true;
        by();
    }

    function send_pet(i) {
        var uid = $('#uid').val();
        var item = i['value'];
        var num = document.getElementById("my_num").value ? document.getElementById("my_num").value : 1
        if (uid == '') {
            layer.msg('请选择账号');
            return false;
        }
        if (item == '') {
            layer.msg('请选择物品');
            return false;
        }
        if (num < 1 || num > 99999) {
            layer.msg('附件数量:1-99999');
            return false;
        }
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        });
        $.post("user/query.php?sdk=" + $('#sdk').val(), {
                type: 'pet',
                uid: uid,
                item: item,
                num: num
            },
            function (data) {
                layer.msg(data);
            });
        document.getElementById("send_pet").disabled = true;
        cw();
    }

    function mail(i) {
        var uid = $('#uid').val();
        var rname = $('#rname').val();
        var item = i['value']
        var num = document.getElementById("my_num").value ? document.getElementById("my_num").value : 1
        if (uid == '') {
            layer.msg('请选择账号');
            return false;
        }
        if (rname == '') {
            layer.msg('请输入角色名');
            return false;
        }
        if (item == '') {
            layer.msg('请选择物品');
            return false;
        }
        if (num < 1 || num > 999999) {
            layer.msg('附件数量:1-999999');
            return false;
        }
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
        });
        $.post("user/query.php?sdk=" + $('#sdk').val(), {
                type: 'mail',
                uid: uid,
                num: num,
                item: item,
                rname: rname
            },
            function (data) {
                layer.msg(data);
            });
    }
})();