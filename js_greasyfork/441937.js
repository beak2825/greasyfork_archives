// ==UserScript==
// @name        无止境VIP解析，x浏览器，苹果Alook浏览器通用型。
// @namespace  无止境 - wuzhij.com
// @version      2.0
// @description  安卓X浏览器直接安装使用。苹果Alook浏览器使用，播放集数不对可切换桌面后刷新，解析接口失效后请自行到其他脚本内提取替换更新。
// @include *
// @author       无止境 - wuzhij.com
// @license wuzhij
// @downloadURL https://update.greasyfork.org/scripts/441937/%E6%97%A0%E6%AD%A2%E5%A2%83VIP%E8%A7%A3%E6%9E%90%EF%BC%8Cx%E6%B5%8F%E8%A7%88%E5%99%A8%EF%BC%8C%E8%8B%B9%E6%9E%9CAlook%E6%B5%8F%E8%A7%88%E5%99%A8%E9%80%9A%E7%94%A8%E5%9E%8B%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/441937/%E6%97%A0%E6%AD%A2%E5%A2%83VIP%E8%A7%A3%E6%9E%90%EF%BC%8Cx%E6%B5%8F%E8%A7%88%E5%99%A8%EF%BC%8C%E8%8B%B9%E6%9E%9CAlook%E6%B5%8F%E8%A7%88%E5%99%A8%E9%80%9A%E7%94%A8%E5%9E%8B%E3%80%82.meta.js
// ==/UserScript==

//正文开始
var o =
    '<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:transparent;margin:3.78vw 2.1vw;">&#9660</span>'


//综合解析下面的链接就是接口，替换时注意不要将""删掉

var apis = [{
        name: o + "优酷解析",
        url: "https://jx.armytea.com/jh/?url=",
        title: "综合接口"
    }, {
        name: o + "综合解析",
        url: "https://api.okjx.cc:3389/jx.php?url=",
        title: "综合接口"
    }, {
        name: o + "解析二",
        url: "https://okjx.cc/?url=",
        title: "综合接口"
    }, {
        name: o + "解析三",        
        url: "https://jx.aidouer.net/?url=",
        title: "综合接口"
    }, {
        name: o + "解析四",
        url: "https://www.mtosz.com/erzi.php?url=",
        title: "综合接口"
    }, {
        name: o + "解析五",
        url: "https://jx.iztyy.com/svip/?url=",  
        title: "综合接口"
    }, {
        name: o + "解析六",
        url: "https://jx.jsonplayer.com/player/?url=",
        title: "综合接口"
    }, {
        name: o + "解析七",
        url: "https://www.yemu.xyz/?url=",
        title: "综合接口"
    }, {
        name: o + "解析八",
        url: "https://jxdp.codermart.net/?url=",
        title: "综合接口"
    }];
//添加链接  
function createSelect(apis) {
    var myul = document.createElement("ul");
    myul.id = "myul";
    myul.setAttribute("style",
        "display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:17vh;right:6vw;z-index:99999;height:70vh;overflow:scroll;border-radius:1.26vw;");
    for (var i = 0; i < apis.length; i++) {
        var myli = document.createElement("li");
        var that = this;
        myli.setAttribute("style",
            "margin:0;padding:0;display:block;list-style:none;font-size:4.2vw;width:30.6vw;text-align:left;line-height:12.6vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;");
        (function (num) {
            myli.onclick = function () {
                window.open(apis[num].url + location.href, '_blank');
            };
            myli.ontouchstart = function () {
                this.style.cssText += "color:yellow;background:#373737;border-radius:1.26vw;";
            }
            myli.ontouchend = function () {
                this.style.cssText += "color:black;background:transparent;border-radius:0;";
            }
        })(i);
        myli.innerHTML = apis[i].name;
        myul.appendChild(myli);
    }
    document.body.appendChild(myul);
}

//唤出菜单

function createMenu() {
    var myBtn = document.createElement("div");
    myBtn.id = "myBtn";
    myBtn.innerHTML = "&#9855";
    myBtn.setAttribute("style",
     "width:10vw;height:10vw;position:fixed;bottom:10vh;right:6vw;z-index:100000;border-radius:100%;text-align:center;line-height:10vw;box-shadow:0px 1px 10px rgba(0,0,0,0.3);font-size:6vw;background:#fff;");
    myBtn.onclick = function () {
        var myul = document.getElementById("myul");
        if (myul.style.display == "none") {
            myul.style.display = "block";
            this.style.transform = "rotateZ(45deg)";
        } else {
            myul.style.display = "none";
            this.style.transform = "rotateZ(0deg)";
        }
    }
    document.body.appendChild(myBtn);
}
/*document.addEventListener("DOMContentLoaded",function () {
	createMenu();
	createSelect(apis);
});*/
//解析域名，填减时注意格式
if (location.href.match(".iqiyi.com") || location.href.match(".youku.com") || location.href.match(".le.com") ||
    location.href.match(".letv.com") || location.href.match("v.qq.com") || location.href.match("film.qq.com") || location.href.match(".tudou.com") ||
    location.href.match(".mgtv.com") || location.href.match("film.sohu.com") || location.href.match("tv.sohu.com") ||
    location.href.match(".acfun.cn") || location.href.match(".bilibili.com") || location.href.match(".pptv.com") ||
    location.href.match("vip.1905.com") || location.href.match(".yinyuetai.com") || location.href.match(".fun.tv") ||
    location.href.match("twitter.com") || location.href.match("facebook.com") || location.href.match("instagram.com") ||
    location.href.match(".56.com") || location.href.match("youtube.com") || location.href.match(".wasu.cn")) {
    createMenu();
    createSelect(apis);
}