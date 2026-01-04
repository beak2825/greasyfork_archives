// ==UserScript==
// @name         北大党课平台
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  跳过视频播放
// @author       ActionSafe
// @grant        none
// @include      *http://jjfz.pku.edu.cn/jjfz/lesson/play*
// @downloadURL https://update.greasyfork.org/scripts/382089/%E5%8C%97%E5%A4%A7%E5%85%9A%E8%AF%BE%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/382089/%E5%8C%97%E5%A4%A7%E5%85%9A%E8%AF%BE%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

"use strict";


(function () {
    //变量区
    let btn_css = ".myBtn{\n" +
    "            padding: 17px 32px;\n" +
    "            cursor: pointer;\n" +
    "            text-decoration: none;\n" +
    "            border: none;\n" +
    "            background-color: #00a1d6;\n" +
    "            color: #fff;\n" +
    "            display: inline-block;\n" +
    "            text-align: center;\n" +
    "            position: absolute;\n" +
    "            left: 0px;\n" +
    "            z-index: 999;\n" +
    "        }";
    //静态方法
    function addCSS(css) {
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
    }

    function createBtn(parent)
    {
        let btn = document.createElement("div");
        btn.innerText = "结束课程";
        btn.setAttribute("class","myBtn");
        parent.appendChild(btn);
        return btn;
    }

    function getInfo() {
        let reg_rID = /r_id=(\d+)/;
        let reg_vID = /v_id=(\d+)/;
        let red_cID = /lesson_id=(\d+)/;
        let url = window.location.href;
        let lesson_url = document.getElementsByClassName("video_goback")[0].getAttribute("href");
        let resource_id = reg_rID.exec(url);
        let video_id = reg_vID.exec(url);
        let lesson_id = red_cID.exec(lesson_url);
        return {
            'url':url,
            'lesson_url':lesson_url,
            'resource_id':resource_id[1],
            'video_id':video_id[1],
            'lesson_id':lesson_id[1]
        }
    }
    //原生的结束方法
    function ajax(event) {
        let info = getInfo();
        $.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            url: "/jjfz/lesson/resource_record",
            data: {
                resource_id: info['resource_id'],
                video_id: info['video_id'],
                lesson_id: info['lesson_id'],
                _xsrf: $(":input[name='_xsrf']").val()
            },
            success: function (data) {
                flag = false;
                if (Number(data.code) == 1) {
                    public_alert(1, ["我知道了"], '<i class="iconfont">&#xe633;</i><p>当前视频播放完毕！</p><p></p>', 'public_cont1', function () {
                        $(".public_close").click(); //此为关闭方法
                        window.location.reload();
                    });
                    $(".public_cont").css("left", "40%");
                }
            }
        });
    }

    (function init() {
        addCSS(btn_css);
        createBtn(document.getElementsByTagName("body")[0]).addEventListener('click',ajax);
    })()
})();



