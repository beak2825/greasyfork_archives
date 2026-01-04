// ==UserScript==
// @name         广商形势与政策，可挂后台，自动切换专题
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @description  进入个人学习界面后选择好要挂的专题以及时长，即可开始挂课
// @author       Lai
// @match        http://xsyzc.gzcc.cn/*
// @license           AGPL License
// @grant        none
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/425371/%E5%B9%BF%E5%95%86%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96%EF%BC%8C%E5%8F%AF%E6%8C%82%E5%90%8E%E5%8F%B0%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%93%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/425371/%E5%B9%BF%E5%95%86%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96%EF%BC%8C%E5%8F%AF%E6%8C%82%E5%90%8E%E5%8F%B0%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%93%E9%A2%98.meta.js
// ==/UserScript==
            function x_y() {
            var x = Math.random() * 1000;
            var y = Math.random() * 1000;
            x = parseInt(x).toString();
            y = parseInt(y).toString();
            $("#xID").attr("value", x);
            $("#yID").attr("value", y);
            setTimeout(() => {
                x_y()
            }, 5000)
        }
        function win111(){
            var a = [];
            var b = [];
            for (var i = 1; i < 6; i++) {
                var n = "q" + i;
                var q = document.getElementsByName(n);
                if(q[0].checked){
                    a.push(parseInt(q[0].value));
                    b.push(parseFloat(q[1].value));
                }
            }
            fun(0,a,b);
        }
        function fun(n, p, q) {
            var xx = document.querySelectorAll(".nav-item .dropdown-menu li a");
            xx[p[n]].click();
            setTimeout(function () {
                $('#win').window('close');
                fun(n++, p, q);
            }, q[n++] * 60 * 1000);
            setTimeout(() => {
                x_y()
            }, 5000)
        }

        const info = $("        <div id = 'fa'\n" +
            "            style='\n" +
            "                width: 380px;\n" +
            "                height: 300px;\n" +
            "                border-radius: 19px;\n" +
            "                position: absolute;\n" +
            "                right: 500px;\n" +
            "                bottom: 310px;\n" +
            "                background:rgb(237, 248, 187);\n" +
            "                text-align: center;\n" +
            "            '\n" +
            "        >\n" +
            "            <div id='zi'>\n"+
            "            <p>受网络影响，建议输入时长比预期时长多0.5~1分钟</p>\n" +
            "            全部填充：<input name=q0 type='text' style='width: 50px'><button type='button' class='clean'style='border-radius: 8px; background-color:rgb(221, 241, 129);'>清空</button><button class='full'style='border-radius: 8px; background-color:rgb(221, 241, 129);'>确定</button><br>\n" +
            "            专题1<input name=q1 type='checkbox' value='0'>时长:(分钟)<input name=q1 type='text'><button type='button' class='clean'style='border-radius: 8px; background-color:rgb(221, 241, 129);'>清空</button><br>\n" +
            "            专题2<input name=q2 type='checkbox' value='2'>时长:(分钟)<input name=q2 type='text'><button type='button' class='clean'style='border-radius: 8px; background-color:rgb(221, 241, 129);'>清空</button><br>\n" +
            "            专题3<input name=q3 type='checkbox' value='4'>时长:(分钟)<input name=q3 type='text'><button type='button' class='clean'style='border-radius: 8px; background-color:rgb(221, 241, 129);'>清空</button><br>\n" +
            "            专题4<input name=q4 type='checkbox' value='6'>时长:(分钟)<input name=q4 type='text'><button type='button' class='clean'style='border-radius: 8px; background-color:rgb(221, 241, 129);'>清空</button><br>\n" +
            "            专题5<input name=q5 type='checkbox' value='8'>时长:(分钟)<input name=q5 type='text'><button type='button' class='clean'style='border-radius: 8px; background-color:rgb(221, 241, 129);'>清空</button><br>\n" +
            "            按住可拖拽 <button id='btn' style='border-radius: 8px; background-color:rgb(221, 241, 129);'>开始挂课</button> 双击可缩小\n" +
            "            </div>\n"+
            "            <div id='zizi' style='display: none; line-height: 40px;'>双击\n"+
            "            </div>\n"+
            "        </div>")
        $("html").append(info)
        $("#btn").click(() => {
            win111();
        })
        document.getElementById("zi").addEventListener('click',function(e){
        var item = e.target;
        if(e.target.className == "clean"){
            var lists = Array.from(document.querySelectorAll(".clean"));
            clean("q"+lists.indexOf(item))
        }
        if(e.target.className == "full"){
            full()
        }
})

        function clean(e) {
            if(e == "q0"){
                document.getElementsByName(e)[0].value = ''
            }
            document.getElementsByName(e)[0].checked = false
            document.getElementsByName(e)[1].value = ''
        }
        function full(){
            for(var i = 1;i < 6;i++){
                document.getElementsByName("q"+i)[0].checked = true
                document.getElementsByName("q"+i)[1].value = document.getElementsByName("q0")[0].value
            }
        }

    var fa = document.getElementById("fa");
    var zi = document.getElementById("zi");
    var zizi = document.getElementById("zizi");

    function dragFunc(id) {
        var Drag = document.getElementById(id);
        Drag.onmousedown = function (event) {
            var ev = event || window.event;
            event.stopPropagation();
            var disX = ev.clientX - Drag.offsetLeft;
            var disY = ev.clientY - Drag.offsetTop;
            document.onmousemove = function (event) {
                var ev = event || window.event;
                Drag.style.left = ev.clientX - disX + "px";
                Drag.style.top = ev.clientY - disY + "px";
                Drag.style.cursor = "move";
            };
        };
        Drag.onmouseup = function () {
            document.onmousemove = null;
            this.style.cursor = "default";
        };
    };
    dragFunc("fa")

    var tp = true;
    fa.ondblclick = function () {
        // 缩小
        if (tp) {
            fa.style.width = 40 + "px";
            fa.style.height = 40 + "px";

            zi.style.display = "none"
            zizi.style.display = "block"
            tp = !tp;
        } else { //放大
            fa.style.width = 380+"px";
            fa.style.height = 300 + "px";
            zizi.style.display = "none"
            zi.style.display = "block"
            tp = !tp;
        }
    }