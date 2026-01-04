// ==UserScript==
// @name         10.0.0.55 enhance
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  make 10.0.0.55 clearer and better
// @author       FKYnJYQ
// @match        http://10.0.0.55/srun_portal_pc.php?ac_id=*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/367663/100055%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/367663/100055%20enhance.meta.js
// ==/UserScript==


(function () {
    'use strict';

    $("style").remove(); {
        GM_addStyle(`
.hbtn,#button {
position: relative;
box-sizing: border-box;
display: inline-block;
overflow: hidden;
padding: 8px 20px;
margin: 0px 3px 6px;
text-align: center;
border: 2px solid rgb(255, 255, 255);
text-decoration: none;
color: rgb(255, 255, 255);
white-space: nowrap;
z-index: 0;

}


.hbtn i,#button {
padding-right: 8px;
}


.hb-border-bottom-br4 ,#button {
position: relative;
transition-duration: 0.3s;
overflow: visible;
box-sizing: border-box;
border: none;
padding: 10px 22px;

transition: box-shadow 0.3s ease-in-out;
}


.hb-border-bottom-br4::after ,#button::after{
box-sizing: border-box;
position: absolute;
width: 100%;
height: 100%;
content: "";
border: 2px solid rgb(255, 255, 255);
z-index: 2;
margin: 0px;
left: 0px;
bottom: 0px;
border-top-width: 2px;
transition: border-top-width 0.1s 0.2s, height 0.2s 0.1s, width 0.2s 0s, margin 0.2s 0s, border-bottom-width 0.2s 0s;
box-shadow: 3px 4px 6px rgba(27,31,35,0.35);
}


.hb-border-bottom-br4:hover::after ,#button:hover::after{
width: 60%;
height: 0px;
border-width: 0px 2px 4px;
margin: 0px 20%;
transition: border-top-width 0.1s 0s, height 0.2s 0.1s, width 0.2s 0.2s, margin 0.2s 0.2s, border-bottom-width 0.2s 0.2s;

opacity: 1;
}

*{
font-family: monospace, Courier, 'Courier New';
box-sizing:border-box;
text-decoration: none;
color: rgb(255, 255, 255);
white-space: nowrap;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
border: 0;
-webkit-text-fill-color: white;
background: transparent !important;
transition: background-color 5000s ease-in-out 0s;
}

@-webkit-keyframes autofill {
to {
color: #FFFFFF;
background: transparent;
}
}

input:-webkit-autofill {
-webkit-animation-name: autofill;
-webkit-animation-fill-mode: both;
}

#menu>div:hover{
    box-shadow:3px 4px 6px rgba(27,31,35,0.35);
    transition: box-shadow 0.3s ease-in-out ;
}

`);

    }

    // 2018-08-24 经测试， 在图书馆必须ac_id = 1， 故取消该功能
    // 如果ac_id=1,则重定向至8
    // function getQueryStringArgs(){
    //     var qs = (location.search.length>0?location.search.substring(1):""),
    //     args = {},
    //     items = qs.length?qs.split("&"):[],
    //     item = null,
    //     name = null,
    //     value = null,
    //     i = 0,
    //     len = items.length;

    //     for(i = 0;i<len;i++){
    //         item = items[i].split("=");
    //         name = decodeURIComponent(item[0]);
    //         value = decodeURIComponent(item[1]);
    //         if(name.length){
    //             args[name] = value;
    //         }

    //     }
    //     return args;
    // }

    // var args  = getQueryStringArgs();
    // if(args["ac_id"] == 1){
    //     location.assign('http://10.0.0.55/srun_portal_pc.php?ac_id=8&');
    // }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function padNumber(num, fill) {
        //改自：http://blog.csdn.net/aimingoo/article/details/4492592
        var len = ('' + num).length;
        return (Array(
            fill > len ? fill - len + 1 || 0 : 0
        ).join(0) + num);
    }

    function reduce(s, portion) {
        // 将rgb各减小‘portion/100’比例输出
        return '#' + padNumber(parseInt(parseInt(s.slice(1, 3), 16) * portion / 100).toString(16), 2) +
            padNumber(parseInt(parseInt(s.slice(3, 5), 16) * portion / 100).toString(16), 2) +
            padNumber(parseInt(parseInt(s.slice(5, 7), 16) * portion / 100).toString(16), 2)
    }

    function pick_color() {
        return bg_colors[getRandomInt(bg_colors.length)];
    }

    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    function sayHello(){
        var a = new Date().getHours();
        if (a>6 && a<12){
            return '早安'
        }
        else if(a>=12 && a< 15){
            return '午安'
        }
        else if(a>=15 && a<20){
            return '你好'
        }
        else if(a>=20 && a<24){
            return '晚安'
        }
        else{
            return '早点睡'
        }
    }

    var Local = {}
    Local.leftMouse = 0
    Local.username = GM_getValue("username") || "";
    Local.password = GM_getValue("password") || "";
    Local.input_text = GM_getValue("input_text") || "For Freedom";

    var bg_colors = [
        "#777FAD", "#880E4F", "#3F5195",
        "#2196A3", "#5281EA", "#0097A7", "#009688", "#71897E",
        "#C8967B", "#616161", "#607D8B", "#516B85",
        "#688D68", "#874F59", "#86CC73", "#FF8E88", "#CCBDB6", "#5F8597", "#674172", "#313953",
        "#22313F", "#336E7B", "#1E824C", "#541e24", "#4f4859","#BBBB8A",
        "#8ABBBB", "#A38ABB" , "#739A9A"
    ];
    var bg_color = pick_color();
    var bg_color_dark = reduce(bg_color,90)


    $("body").css("background-color", bg_color);
    // $(".logo").remove();
    // $(" ul.login>li:nth-child(3)>label:nth-child(2)").remove();
    // $("label.margbt").remove();
    // $("p.margbt").remove();
    // $(".float_l").remove();
    $(".footer").remove();
    // $(".navbar").remove();
    $(".a.a_demo_one, #pc_logout, #goto_services").addClass("hbtn").addClass("hb-border-bottom-br4").removeClass("a_demo_one");
    $("body").css("margin", "0");
    $("body").append($(`<div id="menu" >
<div><div><div class="hbtn hb-border-bottom-br4">
<a href="http://10.0.0.54:8800" target="_blank" >自服务</a>
</div></div></div>
<div><div><div class="hbtn hb-border-bottom-br4">
<a href="http://nsc-mis.info.bit.edu.cn/selfServicePaid" target="_blank" >在线充值</a>
</div></div></div>
<div><div><div class ="hbtn hb-border-bottom-br4">
<a > <input type="text" id="input_text"> </a>
</div></div></div>
<div><div><div class="hbtn hb-border-bottom-br4">
<a>someColor</a>
</div></div></div>
</div>`));
    $("body").append($('<div id="yingying" ><a id="ying" class="hbtn hb-border-bottom-br4" style="font-size:40px">Welcome To BIT</a></div>'));
    $("body").append($(`<div id="form" >
<form autocomplete="nope">
<div><div><div class="hbtn hb-border-bottom-br4" ><input type="edmail" name="edmail" id="GM_username" autocomplete="nope" disableautocomplete></div></div></div>
<div><div><div class="hbtn hb-border-bottom-br4" ><input type="password" name="firstname" id="GM_password" autocomplete="nope" disableautocomplete></div></div></div>
</form>
</div>`));


    // set value in GM_*

    $("#GM_username")[0].value = Local.username;
    $("#GM_password")[0].value = Local.password;
    $("#input_text")[0].value = Local.input_text;

    $("#ying").text(Local.input_text); {
        function store_value(id_name) {
            return function () {
                var strings = $("#GM_" + id_name)[0].value;
                Local[id_name] = strings;
                console.log(strings)
                GM_setValue(id_name, strings);
            }
        }
        $("#GM_username")[0].oninput = store_value('username');
        $("#GM_password")[0].oninput = store_value('password');
        $("#input_text")[0].oninput = function () {
            var strings = $("#input_text")[0].value;
            Local["input_text"] = strings;
            console.log(strings)
            GM_setValue("input_text", strings);
            console.log(2342344);
            $("#ying").text(Local.input_text);
        };

    }

    var yingying = $("#yingying");
    var login_button = document.getElementById('button');
    var logout_button = document.getElementById('pc_logout');
    document.getElementById("GM_username").onchange = function () {
        console.log('123');
        yingying.show("fast");
    };
    $("#ying").mousedown((event) => {
        // left with out ctrl
        if (event.which == 1 && !event.ctrlKey) {
            console.log(Local.username)
            $("#username")[0].value = Local.username || $("#username")[0].value;
            $("#password")[0].value = Local.password || $("#password")[0].value;
            console.log(typeof Local.username)
            login_button.click();
        }
        // left with ctrl
        else if (event.which == 1 && event.ctrlKey) {
            var menu = $("#menu>div")
            if (menu.is(":hidden")) {
                $("#menu>div").first().slideToggle("fast", function showNext() {
                    $(this).next("div").slideToggle("fast", showNext);
                });
            } else {
                $("#menu>div").last().slideToggle("fast", function showNext() {
                    $(this).prev("div").slideToggle("fast", showNext);
                });
            }

        }
        // middle
        else if (event.which == 2 || (event.which == 3 && event.ctrlKey)) {
            $("#form").toggle("slow");
        }
        // right
        else if (event.which == 3 && !event.ctrlKey) {
            $("#username")[0].value = Local.username || $("#username")[0].value;
            $("#password")[0].value = Local.password || $("#password")[0].value;
            logout_button.click();
            return false;
        }
    });
    document.getElementById("ying").oncontextmenu = ()=>{return false;};
    $("#menu>div:nth-child(4)>div").mousedown((event)=>{

        console.log(Local.leftMouse)
        if(Local.leftMouse == 10){
            $("#ying").text("上网不涉密，涉密不上网。")
        }
        else{
            Local.leftMouse++;
        }
        $("#menu>div:nth-child(4)>div a").text(sayHello());
    });
    // 注释掉此行得到完整表单
    $(".container").css("width", "auto").css("height", "auto").hide();

    $("html,body").css("height", "100%");
    $("#yingying").css({
        "height": "70px",
        "width": "100%",
        "margin": "auto",
        "line-height": "70px",
        "position": "relative",
        "top": "30%"
    });

    $("#ying,#form input").css({
        "text-shadow": "2px 4px 6px rgba(27,31,35,0.35)"
    });
    $("#menu>div:hover").css({
        "box-shadow": "0"
    });
    // $("#menu>div:hover").css({
    //     "box-shadow": "2px 2px 4px rgba(27,31,35,0.25)"
    // });
    $("#GM_username,#GM_password").css({
        "background": "transparent",
        "border": "0",
        "color": "white",
        "font-size": "20px",
        "text-align": "center"
    });
    $("#input_text").css({
        "background": "transparent",
        "border": "0",
        "font-size": "20px",
        "color": "white",
        "width": "100%",
        "height": "100%",
        "text-align": "center"
    });
    $("#form >form>div").css({
        "margin": "0",
        "width": "50%",
        "float": "left"
    });
    $("#form >form>div>div").css({
        "width": "290px",
        "margin": "auto",
        "left": "auto",
        "right": "auto"
    });

    console.log(bg_color)
    $("#menu>div").css({
        "float": "left",
        "width": "25%",
        "height": "70px",
        "background": bg_color
    }).hide();
    $("#menu>div>div").css({
        "width": "50%",
        "height": "40px",
        "margin": "auto",
        "margin-top": "15px"
    });
    $("#menu>div>div>div").css({
        "width": "100%",
        "height": "40px",
        "margin": "auto"
        // ,"overflow":"hidden" // 若使用则无阴影
    });
    $("#menu a").css({
        "height": "40px",
        "line-height": "20px",
        "width": "100%",
        "font-size": "20px",
        "overflow": "hidden"
    });
    $("#menu>div:nth-child(4) a").text(bg_color);
    $("#yingying").css("text-align", "center").hide();
    $("#menu").css({
        "height": "70px"
    });
    $("#form").toggle().css({
        "position": "relative",
        "top": "60%"
    });
    if (Local.username && Local.password) {
        $("#yingying").show("fast");
    } else {
        $("#form").toggle("slow");
    }
})();
