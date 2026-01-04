// ==UserScript==
// @name        护眼脚本
// @namespace   http：//www.houhongwei.xyz
// @description 修改网页背景色，让网页背景色偏白的部分变成乡土黄、豆沙绿，浅色灰还有淡橄榄，更加护眼。默认护眼色是乡土黄。
// @icon        http://d.lanrentuku.com/down/png/1406/40xiaodongwu/tropical-fish.png
// @include     http*
// @include     ftp*
// @version     1.2
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/499660/%E6%8A%A4%E7%9C%BC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/499660/%E6%8A%A4%E7%9C%BC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

//当网页的背景颜色的rgb值分别大于Gr1,Gg1,Gb1时此脚本将把颜色改成目标颜色color
var Gr1 = 242; //RGB中的R值
var Gg1 = 242; //RGB中的G值
var Gb1 = 242; //RGB中的B值

//**********以下代码用户无需修改***********//
var Gr, Gg, Gb; //全局变量记录当前标签的rgb值,用于比较

//以下函数用于分解获取的"rgb(255, 255, 255)"格式的rgb
function FGrgb(Grgb) {
    Grgb = Grgb.replace(/[rgba\(\)]/g, '');
    var kaisi = Grgb.split(",");
    if (kaisi < 3) return;
    Gr = parseInt(kaisi[0]);
    Gg = parseInt(kaisi[1]);
    Gb = parseInt(kaisi[2]);
    //alert(Gr+"|"+Gb+"|"+Gg);
}


function changeAllElementsColor(color) {
    var Lcolor = ""; //用于记录网页中获取的背景颜色
    //获取并修改所有标签的背景颜色
    var alltags = document.getElementsByTagName("*");
    var len = alltags.length;
    for (var i = 0; i < len; i++) {

        if (alltags[i].style.backgroundColor == color) {
            continue;
        }

        Lcolor = document.defaultView.getComputedStyle(alltags[i], "").getPropertyValue("background-Color");
        FGrgb(Lcolor);
        if (Gr > Gr1 && Gg > Gg1 && Gb > Gb1) {
            alltags[i].style.backgroundColor = color;
        }
    }
}

function fixAutoPage() {
    var _bodyHeight = document.body.clientHeight;
    // 创建观察者对象
    var observer = new window.MutationObserver(function(mutations) {
        if (mutations[0].addedNodes) {
            if (document.body.clientHeight > _bodyHeight) {

                // console.log("--------addedNodes---------");

                setTimeout(function() {
                    changeAllElementsColor();
                }, 200);

                _bodyHeight = document.body.clientHeight;
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

function changeColor(colorValue) {
    var color = "#F6F4EC"; //改变后的背景颜色
    var Lcolor = ""; //用于记录网页中获取的背景颜色
    //获取并修改body的背景颜色.
    if (colorValue == "yellow")
    {
        color = "#F6F4EC";
        //alert("Yellow");
    }
    else if (colorValue == "green")
    {
        color = "#CCE8CF";
        //alert("Green");
    }
    else if (colorValue == "grey")
    {
        color = "#F2F2F2";
        //alert("Grey");
    }
    else if (colorValue == "olive")
    {
        color = "#E1E6D7";
    }

    try {
        Lcolor = document.defaultView.getComputedStyle(document.body, "").getPropertyValue("background-Color");
    } catch (e) {
        return;
    }

    FGrgb(Lcolor);

    if ((Gr > Gr1 && Gg > Gg1 && Gb > Gb1) || Lcolor == "transparent" || Gr == 0 && Gg == 0 && Gb == 0) //transparent表示透明
    {
        document.body.style.backgroundColor = color;
    }

    changeAllElementsColor(color);

    fixAutoPage();
}

function changeColorYellow() {
    changeColor("yellow");
    GM_setValue("colorValue", "yellow");
}

function changeColorGreen() {
    changeColor("green");
    GM_setValue("colorValue", "green");
}

function changeColorGrey() {
    changeColor("grey");
    GM_setValue("colorValue", "grey");
}

function changeColorOlive() {
    changeColor("olive");
    GM_setValue("colorValue", "olive");
}


GM_registerMenuCommand("乡土黄", changeColorYellow, 'y');
GM_registerMenuCommand("豆沙绿", changeColorGreen, 'g');
GM_registerMenuCommand("浅色灰", changeColorGrey, 'r');
GM_registerMenuCommand("淡橄榄", changeColorOlive, 'o');


var colorValue = GM_getValue("colorValue", "none");

if (colorValue == "none")
{
    colorValue = "yellow";
    GM_setValue("colorValue", colorValue);

}

changeColor(colorValue);