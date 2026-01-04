// ==UserScript==
// @name 切换搜索
// @match *://*/*
// @grant none
// @description 切换搜索引擎
// @version 0.0.1.20200318045341
// @namespace https://greasyfork.org/users/392382
// @downloadURL https://update.greasyfork.org/scripts/398133/%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/398133/%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
 var ssyq=["baidu.com","bing.com","dogedoge.com","quark.sm.cn"],
     type = -1;
    for (var i = 0; i < ssyq.length; i++) {
        if (ssyq[i] && location.hostname.indexOf(ssyq[i]) >= 0) {
            type = i;
            break;
        }
    }
  
  if (type==-1){
    return;
    } 
  var key;
 if (type==0)
key = (location.search.indexOf("wd=") >= 0) ? "wd" : "word";
else key="q";
var tmp = location.href.split(key + "=", 2);
    if (tmp.length <= 1) {
        return;
    }
    var tmp2 = tmp[1];
    tmp = tmp2.split("&", 2);
    key = tmp[0];

　　var openBtn = document.createElement("div");
		openBtn.id = "openBtn";
　　		openBtn.setAttribute("style","font-size:4vw !important;width:30vw !important;height:10vw !important;line-height:10vw !important;text-align:center !important;background:url(https://sm.bdimg.com/static/wiseindex/img/screen_icon_new.png) !important;box-shadow:0px 1px 10px rgba(0,0,0,0.5) !important;color:#fff !important;position:fixed !important;bottom:10vh !important;left:5vw !important;z-index:999999 !important;border-radius:1vw !important;display:block !important;");
		document.body.appendChild(openBtn);
		openBtn.onclick = function () {
  if (type!==0){ window.open("https://www.baidu.com/s?wd="+key,"_blank");
  }else{
window.open("https://"+ssyq[type]+"/?q="+key,"_blank");
    }}

　　　　