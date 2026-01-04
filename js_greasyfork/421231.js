// ==UserScript==
// @name         点餐提醒机
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  今天，饿了么还是美团？
// @author       KZ
// @match        https://ssa.jd.com/sso/login?ReturnUrl=https%3A%2F%2Fbabel.m.jd.com%2Factive%2FbabelCommon%2Findex.html%23%2F
// @match        https://ssa.jd.com/sso/login?ReturnUrl=%2F%2Fbetah5.m.jd.com%2Factive%2FbabelCommon%2Findex.html%23%2F
// @match        http://ssa.jd.com/sso/login?ReturnUrl=%2F%2Fbetah5.m.jd.com%2Factive%2FbabelCommon%2Findex.html%23%2F
// @include      https://ssa.jd.com/sso/login?ReturnUrl=https%3A%2F%2Fbabel.m.jd.com
// @include      http://ssa.jd.com/sso/login?ReturnUrl=http%3A%2F%2Fbetah5.m.jd.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421231/%E7%82%B9%E9%A4%90%E6%8F%90%E9%86%92%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/421231/%E7%82%B9%E9%A4%90%E6%8F%90%E9%86%92%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const userSetting = localStorage.getItem('autoDF') || 'clickAndOpen'

    $(document).ready(function(){
        const loginWrap = $(".login_pop_inner.login_withpc")

        loginWrap.css({
            height: '400px'
        })

        const map = ["🍎","🥞","🍱","🍰","🍲","🍜","🍔","🍟","🥐", "🍭"]
        let idx = Math.floor(Math.random()*10)

        const button = $("<button></button>").text(`通天塔提醒您：别忘了点餐~${map[idx]}`)

        button.css({
            background: "#08ce96",
            width: "100%",
            "border-radius": "6px",
            color: "#fff",
            "font-size": "15px",
            "line-height": "40px",
            "transition": "all .3s",
            cursor: "pointer",
            outline: "0",
            border: "0"
        })

        button.click(function(){
            window.open('http://monitor.m.jd.com/tools/dinner/index')
        })

        button.hover(function(){
            button.css("background", "#9e12d4")
        }, function(){
            button.css("background", "#08ce96")
        })

        // 插入button
        loginWrap.append(button)


        $.get("//wthrcdn.etouch.cn/weather_mini?city=" + encodeURIComponent("上海"), function(res) {
            var obj = JSON.parse(res);
            var smg = obj.data.forecast;
            for(var s of smg) {
              var date = s.date;
              var high = s.high;
              var fengli = s.fengli;
              var low = s.low;
              var fengxiang = s.fengxiang;
              var type = s.type;
              var p = document.createElement("p");
              p.innerHTML = date + "<br>上海今日天气：" + type + "<br>"
              + high + "<br>" + low;
           }

            loginWrap.css({
                height: '450px'
            })

           loginWrap.append(p)
        })
    });

})();