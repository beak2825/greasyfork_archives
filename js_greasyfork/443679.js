// ==UserScript==
// @name         江苏省司法鉴定行政平台登录助手
// @namespace    http://tampermonkey.net/
// @version      0.5
// @require https://cdn.staticfile.org/sweetalert/2.1.2/sweetalert.min.js
// @description  江苏省司法鉴定行政平台登录助手，简化登录！
// @author       LYS
// @match        */sfjd/loginOrg.html
// @icon        none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443679/%E6%B1%9F%E8%8B%8F%E7%9C%81%E5%8F%B8%E6%B3%95%E9%89%B4%E5%AE%9A%E8%A1%8C%E6%94%BF%E5%B9%B3%E5%8F%B0%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/443679/%E6%B1%9F%E8%8B%8F%E7%9C%81%E5%8F%B8%E6%B3%95%E9%89%B4%E5%AE%9A%E8%A1%8C%E6%94%BF%E5%B9%B3%E5%8F%B0%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
 var css = '<style>\
@import url("https://fonts.googleapis.com/css?family=Inconsolata:700");\
* {\
margin: 0;\
padding: 0;\
box-sizing: border-box;\
}\
\
html, body {\
width: 100%;\
height: 100%;\
}\
\
body {\
background: #252525;\
}\
\
.container {\
position:fixed;\
top:50px;\
right:5px;\
bottom: 0;\
width: 350px;\
height:400px;\
}\
.container .search {\
position: absolute;\
margin: auto;\
top: 0px;\
right: 0;\
bottom: 0;\
left: 0;\
width: 80px;\
height: 80px;\
background: crimson;\
border-radius: 50%;\
transition: all 1s;\
z-index: 4;\
box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.4);\
}\
.container .search:hover {\
cursor: pointer;\
}\
.container .search::before {\
content: "";\
position: absolute;\
margin: auto;\
top: 22px;\
right: 0;\
bottom: 0;\
left: 22px;\
width: 12px;\
height: 2px;\
background: white;\
transform: rotate(45deg);\
transition: all .5s;\
}\
.container .search::after {\
content: "";\
position: absolute;\
margin: auto;\
top: -5px;\
right: 0;\
bottom: 0;\
left: -5px;\
width: 25px;\
height: 25px;\
border-radius: 50%;\
border: 2px solid white;\
transition: all .5s;\
}\
.container input {\
font-family: \'Inconsolata\', monospace;\
position: absolute;\
margin: auto;\
top: 0;\
right: 0;\
bottom: 0;\
left: 0;\
width: 50px;\
height: 50px;\
outline: none;\
border: none;\
background: crimson;\
color: white;\
text-shadow: 0 0 10px crimson;\
padding: 0 80px 0 20px;\
border-radius: 30px;\
box-shadow: 0 0 25px 0 crimson, 0 20px 25px 0 rgba(0, 0, 0, 0.2);\
transition: all 1s;\
opacity: 0;\
z-index: 5;\
font-weight: bolder;\
letter-spacing: 0.1em;\
}\
.container input:hover {\
cursor: pointer;\
}\
.container input:focus {\
width: 300px;\
opacity: 1;\
cursor: text;\
}\
.container input:focus ~ .search {\
right: -250px;\
background: #151515;\
z-index: 6;\
}\
.container input:focus ~ .search::before {\
top: 0;\
left: 0;\
width: 25px;\
}\
.container input:focus ~ .search::after {\
top: 0;\
left: 0;\
width: 25px;\
height: 2px;\
border: none;\
background: white;\
border-radius: 0%;\
transform: rotate(-45deg);\
}\
.container input::placeholder {\
color: white;\
opacity: 0.5;\
font-weight: bolder;\
}\
.box{margin: 40px 0;position: relative;}\
.change-type {\
min-width: 40px;\
min-height: 160px;\
position: absolute;\
z-index: 99;\
left: 0;\
top: 0;\
display: flex;\
}\
\
.change-type .type-left {\
width: 0;\
background: #fff;\
height: 100%;\
box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);\
border-bottom-right-radius: 5px;\
overflow: hidden;\
transition: width 0.4s;\
-moz-transition: width 0.4s;\
-webkit-transition: width 0.4s;\
-o-transition: width 0.4s;\
}\
.change-type .showListType {\
width: 130px;\
transition: width 0.4s;\
-moz-transition: width 0.4s;\
-webkit-transition: width 0.4s;\
-o-transition: width 0.4s;\
}\
.change-type .type-left ul li {\
line-height: 40px;\
height: 40px;\
text-align: left;\
width: 100%;\
position: relative;\
cursor: pointer;\
}\
.change-type .type-left ul li a {\
display: block;\
height: 100%;\
position: absolute;\
left: 0;\
top: 0;\
z-index: 9;\
padding-left: 15px;\
overflow: hidden;\
width: calc(100% - 17px);\
color: #333;\
font-size: 14px;\
border-left: 2px solid #26778d; /*#26778d  00ba97 */\
}\
.change-type .type-left ul li span {\
display: block;\
position: absolute;\
width: 0;\
height: 100%;\
left: 0;\
top: 0;\
z-index: 8;\
overflow: hidden;\
transition: width 0.5s;\
-moz-transition: width 0.5s;\
-webkit-transition: width 0.5s;\
-o-transition: width 0.5s;\
}\
.change-type .type-left ul li:hover span {\
transition: width 0.5s;\
-moz-transition: width 0.5s;\
-webkit-transition: width 0.5s;\
-o-transition: width 0.5s;\
}\
.type-left ul li:nth-child(1):hover span,\
.type-left ul li:nth-child(1).active span,\
.type-left ul li:nth-child(8):hover span,\
.type-left ul li:nth-child(8).active span {\
background: #ad1457;\
width: 100%;\
box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.5);\
}\
.type-left ul li:nth-child(1):hover a,\
.type-left ul li:nth-child(1).active a,\
.type-left ul li:nth-child(8):hover a,\
.type-left ul li:nth-child(8).active a {\
border-left: 2px solid #ad1457;\
color: #fff;\
}\
.type-left ul li:nth-child(2):hover span,\
.type-left ul li:nth-child(2).active span,\
.type-left ul li:nth-child(9):hover span,\
.type-left ul li:nth-child(9).active span {\
background: #1976d2;\
width: 100%;\
box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.5);\
}\
.type-left ul li:nth-child(2):hover a,\
.type-left ul li:nth-child(2).active a,\
.type-left ul li:nth-child(9):hover a,\
.type-left ul li:nth-child(9).active a {\
border-left: 2px solid #1976d2;\
color: #fff;\
}\
.type-left ul li:nth-child(3):hover span,\
.type-left ul li:nth-child(3).active span,\
.type-left ul li:nth-child(10):hover span,\
.type-left ul li:nth-child(10).active span {\
background: #ef5350;\
width: 100%;\
box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.5);\
}\
.type-left ul li:nth-child(3):hover a,\
.type-left ul li:nth-child(3).active a,\
.type-left ul li:nth-child(10):hover a,\
.type-left ul li:nth-child(10).active a {\
border-left: 2px solid #ef5350;\
color: #fff;\
}\
.type-left ul li:nth-child(4):hover span,\
.type-left ul li:nth-child(4).active span,\
.type-left ul li:nth-child(11):hover span,\
.type-left ul li:nth-child(11).active span {\
background: #e91e63;\
width: 100%;\
box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.5);\
}\
.type-left ul li:nth-child(4):hover a,\
.type-left ul li:nth-child(4).active a,\
.type-left ul li:nth-child(11):hover a,\
.type-left ul li:nth-child(11).active a {\
border-left: 2px solid #e91e63;\
color: #fff;\
}/* DaTouWang URL: www.datouwang.com */\
.type-left ul li:nth-child(5):hover span,\
.type-left ul li:nth-child(5).active span,\
.type-left ul li:nth-child(12):hover span,\
.type-left ul li:nth-child(12).active span {\
background: #8e24aa;\
width: 100%;\
box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.5);\
}\
.type-left ul li:nth-child(5):hover a,\
.type-left ul li:nth-child(5).active a,\
.type-left ul li:nth-child(12):hover a,\
.type-left ul li:nth-child(12).active a {\
border-left: 2px solid #8e24aa;\
color: #fff;\
}\
.type-left ul li:nth-child(6):hover span,\
.type-left ul li:nth-child(6).active span,\
.type-left ul li:nth-child(13):hover span,\
.type-left ul li:nth-child(13).active span {\
background: #64b5f6;\
width: 100%;\
box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.5);\
}\
.type-left ul li:nth-child(6):hover a,\
.type-left ul li:nth-child(6).active a,\
.type-left ul li:nth-child(13):hover a,\
.type-left ul li:nth-child(13).active a {\
border-left: 2px solid #64b5f6;\
color: #fff;\
}\
.type-left ul li:nth-child(7):hover span,\
.type-left ul li:nth-child(7).active span,\
.type-left ul li:nth-child(14):hover span,\
.type-left ul li:nth-child(14).active span {\
background: #388e3c;\
width: 100%;\
box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.5);\
}\
.type-left ul li:nth-child(7):hover a,\
.type-left ul li:nth-child(7).active a,\
.type-left ul li:nth-child(14):hover a,\
.type-left ul li:nth-child(14).active a {\
border-left: 2px solid #388e3c;\
color: #fff;\
}\
\
.change-type .type-right {\
width: 40px;\
background: #62778d;\
height: 150px;\
overflow: hidden;\
box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.5);\
border-top-right-radius: 5px;\
border-bottom-right-radius: 5px;\
display: table;\
}\
.change-type .type-right p {\
text-align: center;\
padding: 0 5px;\
color: #fff;\
display: table-cell;\
vertical-align: middle;\
cursor: pointer;\
line-height: 20px;\
}\
</style>'


var htmlhead = $('head').html()
htmlhead = htmlhead + css
$('head').html(htmlhead)
var newdom = '<div class="container">\n  <input id="input" type="text" placeholder="Search...">\n  <div class="search"></div>\n</div>'
var newdom1 = '<div class="box">\
<div class="change-type">\
<div class="type-left" :class="showType == true ? \'showListType\':\'\'">\
<ul>\
<li class="active"><a>刘双城</a><span></span></li>\
<li class=""><a>张艳琴</a><span></span></li>\
<li class=""><a>高友祥</a><span></span></li>\
<li class=""><a>刘宁生</a><span></span></li>\
<li class=""><a>金传兵</a><span></span></li>\
<li class=""><a>李陨石</a><span></span></li>\
<li class=""><a>慕敬</a><span></span></li>\
</ul>\
</div>\
<div class="type-right">\
<p><i class="el-icon-menu"></i>LYS常用登录</p>\
</div>\
</div>\
</div>'



$("div.oubg-ligon").before(newdom, newdom1)
$('title').text("欢迎使用QS-LYS登录小助手！")
$("#loginId").val("南京东南司法鉴定中心")
$("#password ").val("51860026a")
$("#currentInputCode").val("")
$("#input").keydown(function (event) {
    if (event.keyCode == 13) {
        window.username = $("#input").val()
        lys();
    }
})


$('.type-right').click(function () {
    $(this).prev('.type-left').toggleClass('showListType')

});
$('.type-left ul li').click(function () {
    $(this).addClass('active').siblings('li').removeClass('active')
    window.username = $(this).text()
    lys();
})







function lys() {
    var PD = false
    for (var i = 0; i < jdr.length; i++) {
        if (jdr[i][0] == window.username) {
            $("#loginId").val(jdr[i][1])
            $("#loginId").css({
                "color": "#dc143c",
                "font-size": "20px"
            })
            $("#password ").val(jdr[i][2])
            $("#password").css({
                "color": "#dc143c",
                "font-size": "20px"
            })
            $("#currentInputCode").css({
                "color": "#dc143c",
                "font-size": "20px"
            })
            PD = true
            return;
        }
    }
    if (PD == false) alert("LYS助手提醒：未找到数据，请注意核查信息!")
}
var jdr = [
    ["张淑兰", "320103391217026", "51860026a"],
    ["毕巧根", "320705194408111015", "51860026a"],
    ["张洪贵", "320106196106302812", "51860026a"],
    ["宋涌法", "320204194803282013", "51860026a"],
    ["吉荣生", "320902195105052018", "51860026a"],
    ["陈平圣", "320106196309012030", "51860026a"],
    ["李齐红", "320111197708094024", "51860026a+"],
    ["汤士忠", "320107195505283438", "51860026a"],
    ["顾建兴", "320106195708142030", "51860026a"],
    ["潘明", "320106195109062012", "51860026a"],
    ["宋正权", "320723196711230131", "51860026a"],
    ["姚仲青", "320104196304050035", "51860026a"],
    ["樊一石", "320106193602070439", "51860026a"],
    ["徐宁", "320103195404050269", "51860026a"],
    ["高友祥", "320830195110110016", "51860026a"],
    ["朱有能", "320124194910013230", "51860026a"],
    ["王竟", "320102198208214614", "51860026a"],
    ["邢晓娟", "340505198212140042", "51860026a"],
    ["张艳琴", "320102195612163245", "51860026a"],
    ["李国林", "130321198311103132", "51860026a"],
    ["孙建兰", "22062119830228112x", "51860026a"],
    ["赵维英", "320106196101093249", "51860026a"],
    ["叶伟", "320106195707152018", "51860026a"],
    ["王军", "320721197003102659", "51860026a"],
    ["方如平", "32010419511125001x", "51860026a"],
    ["黄松明", "320106196607120451", "51860026a"],
    ["楼跃", "320106195901120810", "51860026a"],
    ["吴玉新", "320106196301080477", "51860026a"],
    ["陆维举", "320830196311299016", "51860026a"],
    ["陈炳海", "320402193910270417", "51860026a"],
    ["沈仁祥", "320402194110081030", "51860026a"],
    ["王俊", "320911198512115717", "51860026a"],
    ["刘双城", "130926198407282256", "51860026a"],
    ["梁夏萍", "440681198706084760", "51860026a"],
    ["刘芳", "340702198606272023", "51860026a"],
    ["金传兵", "321084198702241511", "51860026a"],
    ["赵武生", "320106195409290412", "51860026a"],
    ["邱云亮", "420104197001201690", "51860026a"],
    ["沈晓林", "510212196910091639", "51860026a"],
    ["周玉倩", "320107198701052649", "51860026a"],
    ["何伟", "342622198703262953", "51860026a"],
    ["刘宁生", "32010619570709281X", "51860026a"],
    ["章国娟", "320682198903038148", "51860026a"],
    ["胡雪峰", "320324197902080016", "51860026a"],
    ["潘信明", "320121197310200918", "51860026a"],
    ["张乐屏", "321102195706162471", "51860026a"],
    ["李陨石", "342626199412104154", "51860026a+"],
    ["慕敬", "341224199204021324", "51860026a+"]
]


    })();