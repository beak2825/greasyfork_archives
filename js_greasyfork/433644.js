// ==UserScript==
// @name 解析辅助脚本（自用）
// @description 脚本功能目前有：给“解析脚本”添加自定义接口（需要配合jxb解析脚本 822以上版本 才有效果）。
// @author 江小白
// @version 963540817
// @match *://v.youku.com/v_show/id_*
// @match *://v.qq.com/x/cover/*
// @match *://v.qq.com/variety/p/topic/*
// @match *://w.mgtv.com/b/*
// @match *://www.mgtv.com/b/*
// @match *://tw.iqiyi.com/v_*
// @match *://www.iqiyi.com/v_*
// @match *://www.iqiyi.com/a_*
// @match *://www.iqiyi.com/w_*
// @match *://www.iqiyi.com/kszt/*
// @match *://tv.sohu.com/v/*
// @match *://film.sohu.com/album/*
// @match *://www.le.com/ptv/vplay/*
// @match *://v.pptv.com/show/*
// @match *://vip.1905.com/play/*
// @match *://www.bilibili.com/bangumi/play/*
// @match *://www.acfun.cn/bangumi/*
// @match *://m.bilibili.com/bangumi/play/*
// @match *://www.acfun.cn/*/ac*
// @match *://m.youku.com/*/id_*
// @match *://m.mgtv.com/b/*
// @match *://m.pptv.com/show/*
// @match *://m.tv.sohu.com/v*
// @match *://m.tv.sohu.com/u/*
// @match *://m.tv.sohu.com/phone_play_film*
// @match *://m.le.com/vplay_*
// @match *://m.iqiyi.com/v_*
// @match *://m.v.qq.com/*
// @match *://3g.v.qq.com/*
// @match *://v.qq.com/x/page/*
// @match *://m.acfun.cn/v/*
// @grant none
// @noframes
// @run-at document-body
// @namespace https://greasyfork.org/users/823575
// @downloadURL https://update.greasyfork.org/scripts/433644/%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/433644/%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==


(function(){'use strict';if(self!=top){return false;}else{if(document.querySelector("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3")==null){document.head.appendChild(document.createElement("江小白自定义接口"));if(location.href.match(/^https?:\/\/(?:v(?:-wb)?\.youku\.com\/v_show\/id_|m\.youku\.com\/.+?\/id_|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\/|(?:3g|m)\.v\.qq\.com\/.*?(?:[cv]id=|cover\/)|w(?:ww)?\.mgtv\.com\/(?:b|act)\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[awv]_|kszt\/)|tw\.iqiyi\.com\/v_|m\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|film\.sohu\.com\/album\/|m\.tv\.sohu\.com\/(?:v|phone_play_film\?aid=)|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|v\.pptv\.com\/show\/|m\.pptv\.com\/show\/|vip\.1905\.com\/play\/|www\.bilibili\.com\/bangumi\/play\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/bangumi\/|m\.acfun\.cn\/v\/)/)&&!(location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/(?:a_|kszt\/)/)&&document.title.match(new RegExp("在线观看")))&&!(location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/v_/)&&document.title.match(new RegExp("名师课堂")))){let zdyjkb=[
/* ** 根据以下格式，自己添加接口** */
{name:"辅助脚本测试",url:"https://m.kuo2.cn/?url="},
{name:"饭团",url:"http://fantuan.wkfile.com/fantuantv.txt?963540817?url=",json:"1",title:"此为json"},
{name:"55",url:"http://jx.vipmv.co/json3/?url=",json:"1",title:"此为json"},
{name:"11",url:"http://jx.2dfj.cn/?url=",json:"222",jj:"1",title:"此为json"},
{name:"22",url:"http://v3.52dfj.cn/?url=",json:"222",jj:"1",title:"此为json"},
{name:"鲨鱼",url:"https://www.mgtv.com.favnow.com/?uid=86&token=fav&v=",json:"1",title:"此为json"},
{name:"2",url:"https://jx.pchj.net/jhys/json/i.php?url=",json:"222",jj:"1",title:"此为json"},
{name:"1",url:"http://play.bichangzw.cn/jianghu/json/?url=",json:"1",jj:"1",title:"此为json"},
{name:"江湖1",url:"http://play.bichangzw.cn/jianghu/json/?url=",json:"222",jj:"1",title:"此为json"},
{name:"江湖2",url:"https://jx.pchj.net/jhys/json/i.php?url=",json:"222",jj:"1",title:"此为json"},
{name:"vipmv",url:"http://jx.vipmv.co/json3/?url=",json:"222",json:"1",title:"此为json"},
{name:"七智",url:"https://api.exeyz.cc/api/json.php?url=",json:"222",jj:"1",zy:"1",title:"此为json"},
{name:"冷月",url:"https://v.521x5.com/jsonjmlengyue/?url=",json:"222",jj:"1",zy:"1",title:"此为json"},
{name:"6",url:"http://jx.23at.cn/json/?url=",json:"222",jj:"1",title:"此为json"},
{name: "蓝海",url: "https://cs.sviplan.cn/?url=",ys: "1",jj: "1",title: "可以自动播放下一集"},
{name:"辅助脚本BL",url:"https://vip.bljiex.com/?v="},

];localStorage.setItem('\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3',JSON.stringify(zdyjkb));}}else{return false;}}})();

QABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();