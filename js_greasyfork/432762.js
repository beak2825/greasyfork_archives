// ==UserScript==
// @name 白云味の棉花糖解析辅助脚本
// @description 脚本功能目前有：给“解析脚本”添加自定义接口（需要配合白云味の棉花糖解析脚本才有效果）。
// @author 白云味の棉花糖
// @version 0.1
// @match *://v.youku.com/v_show/id_*
// @match *://v.qq.com/x/cover/*
// @match *://v.qq.com/*/p/topic/*
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
// @namespace https://greasyfork.org/zh-CN/users/675587
// @downloadURL https://update.greasyfork.org/scripts/432762/%E7%99%BD%E4%BA%91%E5%91%B3%E3%81%AE%E6%A3%89%E8%8A%B1%E7%B3%96%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/432762/%E7%99%BD%E4%BA%91%E5%91%B3%E3%81%AE%E6%A3%89%E8%8A%B1%E7%B3%96%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function(){'use strict';if(self!=top){return false;}else{if(document.querySelector("\u0044\u0061\u006e\u0079\u81ea\u5b9a\u4e49\u63a5\u53e3")==null){document.head.appendChild(document.createElement("\u0044\u0061\u006e\u0079\u81ea\u5b9a\u4e49\u63a5\u53e3"));if(location.href.match(/^https?:\/\/(?:v(?:-wb)?\.youku\.com\/v_show\/id_|m\.youku\.com\/.+?\/id_|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/cover|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com\/.*?(?:[cv]id=|cover\/)|w(?:ww)?\.mgtv\.com\/(?:b|act)\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[awv]_|kszt\/)|tw\.iqiyi\.com\/v_|m\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|film\.sohu\.com\/album\/|m\.tv\.sohu\.com\/(?:v|phone_play_film\?aid=)|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|v\.pptv\.com\/show\/|m\.pptv\.com\/show\/|vip\.1905\.com\/play\/|www\.bilibili\.com\/bangumi\/play\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/bangumi\/|m\.acfun\.cn\/v\/)/)&&!(location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/(?:a_|kszt\/)/)&&document.title.match(new RegExp("在线观看")))&&!(location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/v_/)&&document.title.match(new RegExp("名师课堂")))){let zdyjkb=[
/* ** 根据以下格式，自己添加接口** */
{name:"淘影j",url:"https://www.vodjx.top/api/?key=XSQzk8KFK1I7FfPK5X&url=",json:"222",jj:"1",title:"此为json" }, 
{name:"淘影j",url:"https://svip.zny91.com/api/?key=Ch5ISkIKwp7nySjHwG&url=",json:"222",jj:"1",title:"此为json" },  
{name:"️json4",url:"https://www.vodjx.top/api/?key=XSQzk8KFK117FfPK5X8&urI=",json:"1",title:"此为json"},
{name:"json",url:"https://www.vodjx.top/api/?key=XSQzk8KFK117FfPK5X8&urI=",bfq:"https://api.jx.yh0523.cn/api/pgjx-1/dp.php?url=",json:"1",jj:"1",title:"此为json"},
{name:"json1",url:"https://json.xiongmiao888.cn/?url="},
{name:"测试1",url:"https://www.ddayh.com/jiexi/?url="},
{name:"测试2",url:"https://m.kuo2.cn/?url="},
{name:"爱解析",url:"https://jiexi.t7g.cn/?url="},
{name:"117",url:"https://1.api.80tvs.cn/?url="},
{name:"118",url:"https://1.bodada.cc/m3u8.php?url="},
{name:"119",url:"https://9kjx.com/?url="},
{name:"120",url:"https://aikan-tv.com/qy.php?url="},
{name:"121",url:"https://aikan-tv.com/tong.php?url="},
{name:"122",url:"https://ak.vipsli.com/ak/index.php?url="},
{name:"123",url:"https://api.52jiexi.top/?url="},
{name:"124",url:"https://api.78sy.cn/?url="},
{name:"125",url:"https://api.8bjx.cn/?url="},
{name:"126",url:"https://api.927jx.com/vip/?url="},
{name:"127",url:"https://api.baiyug.vip/index.php?url="},
{name:"128",url:"https://api.bbbbbb.me/jx/?url="},
{name:"129",url:"https://api.flvsp.com/?url="},
{name:"130",url:"https://api.jhdyw.vip/?url="},
{name:"131",url:"https://api.jhys.top/?url="},
{name:"132",url:"https://api.lhh.la/vip/?url="},
{name:"133",url:"https://api.lnwu.net/?url="},
{name:"134",url:"https://api.pangujiexi.com/player.php?url="},
{name:"135",url:"https://api.sigujx.com/?url="},
{name:"136",url:"https://api.sigujx.com/jx/?url="},
{name:"137",url:"https://api.smq1.com/?url="},
{name:"138",url:"https://api.steak517.top/?url="},
{name:"139",url:"https://api.sumingys.com/index.php?url="},
{name:"140",url:"https://api.tv920.com/vip/?url="},
{name:"141",url:"https://api.xumiaojx.com/index/?url="},
{name:"142",url:"https://api.xxctzy.com/leduoplayer/index.php?type=urlencode&url="},
{name:"143",url:"https://api.yueliangjx.com/?url="},
{name:"144",url:"https://buaon.xyz/?url="},
{name:"145",url:"https://cdn.yangju.vip/k/?url="},
{name:"146",url:"https://cdn.zyc888.top/?url="},
{name:"147",url:"https://chenluo2.chenluo.org/chenluocs1/?url="},
{name:"148",url:"https://cn.bjbanshan.cn/jx.php?url="},
{name:"149",url:"https://danmu.8old.cn/vip/?url="},
{name:"151",url:"https://dmjx.m3u8.tv/?url="},
{name:"154",url:"https://jiexi.8b5q.cn/player/jx.php?url="},
{name:"156",url:"https://jiexi.cjt521.com/?url="},
{name:"157",url:"https://jiexi.us/?url="},
{name:"158",url:"https://jiexi8.com/vip/index.php?url="},
{name:"159",url:"https://jqaaa.com/jx.php?url="},
{name:"160",url:"https://jsap.attakids.com/?url="},
{name:"161",url:"https://jx.000180.top/jx/?url="},
{name:"162",url:"https://jx.0135790.xyz/?url="},
{name:"163",url:"https://jx.0135790.xyz/dao/?url="},
{name:"164",url:"https://jx.116kan.com/?url="},
{name:"165",url:"https://jx.18mv.club/18mv.php?url="},
{name:"166",url:"https://jx.19jx.vip/?url="},
{name:"167",url:"https://jx.1ff1.cn/?url="},
{name:"168",url:"https://jx.4080jx.cc/?url="},
{name:"169",url:"https://jx.4kdv.com/?url="},
{name:"170",url:"https://jx.598110.com/index.php?url="},
{name:"171",url:"https://jx.618g.com/?url="},
{name:"172",url:"https://jx.973973.xyz/?url="},
{name:"173",url:"https://jx.ap2p.cn/?url="},
{name:"174",url:"https://jx.bwcxy.com/?v="},
{name:"175",url:"https://jx.dj6u.com/?url="},
{name:"176",url:"https://jx.dy-jx.com/?url="},
{name:"177",url:"https://jx.ejiafarm.com/dy.php?url="},
{name:"178",url:"https://jx.elwtc.com/vip/?url="},
{name:"179",url:"https://jx.ergan.top/?url="},
{name:"180",url:"https://jx.f41.cc/?url="},
{name:"181",url:"https://jx.fo97.cn/?url="},
{name:"182",url:"https://jx.hezeshi.net/ce/jlexi.php?url="},
{name:"183",url:"https://jx.idc126.net/jx/?url="},
{name:"184",url:"https://jx.ivito.cn/?url="},
{name:"185",url:"https://jx.jiubojx.com/vip.php?url="},
{name:"186",url:"https://jx.jjlrc.com/player/?url="},
{name:"187",url:"https://jx.kingtail.xyz/?url="},
{name:"188",url:"https://jx.km58.top/jx/?url="},
{name:"189",url:"https://jx.kt111.top/jx/mf/?url="},
{name:"190",url:"https://jx.lfeifei.cn/?url="},
{name:"191",url:"https://jx.m3u8.tv/jiexi/?url="},
{name:"192",url:"https://jx.mmkv.cn/tv.php?url="},
{name:"193",url:"https://jx.mw0.cc/?url="},
{name:"194",url:"https://jx.ns360.cn//qq/zonh2.php?url="},
{name:"195",url:"https://jx.quanmingjiexi.com/?url="},
{name:"196",url:"https://jx.rdhk.net/?v="},
{name:"197",url:"https://jx.wfy4.com/?url="},
{name:"198",url:"https://jx.wslmf.com/?url="},
{name:"199",url:"https://jx.wzslw.cn/?url="},
{name:"200",url:"https://jx.yimo520.com/?url="},
{name:"201",url:"https://jx.youyitv.com/?url="},
{name:"203",url:"https://jx13.omiys.com/?url="},
{name:"204",url:"https://lecurl.cn/?url="},
{name:"205",url:"https://m2090.com/?url="},
{name:"208",url:"https://okjx.cc/?url="},
{name:"211",url:"https://qian.wkfile.com/m3u8.php?url="},
{name:"221",url:"https://www.1717yun.com/jx/ty.php?url="},
{name:"222",url:"https://www.2692222.com/?url="},
{name:"223",url:"https://www.2ajx.com/vip.php?url="},
{name:"224",url:"https://www.33tn.cn/?url="},
{name:"227",url:"https://www.8090g.cn/?url="},
{name:"228",url:"https://www.91jxs.com/jiexi/?url="},
{name:"229",url:"https://www.administratorw.com/video.php?url="},
{name:"230",url:"https://www.ckmov.vip/api.php?url="},
{name:"231",url:"https://www.h8jx.com/jiexi.php?url="},
{name:"232",url:"https://www.hyxuanit.com/jx/?url="},
{name:"236",url:"https://www.kpezp.cn/jlexi.php?url="},
{name:"239",url:"https://www.nxflv.com/?url="},
{name:"240",url:"https://www.playm3u8.cn/jiexi.php?url="},
{name:"241",url:"https://www.qianyicp.com/jiexi/index.php?url="},
{name:"243",url:"https://www.xymav.com/?url="},
{name:"245",url:"https://z1.m1907.cn/?jx="},
{name:"253",url:"https://www.wocao.xyz/index.php?url="},
{name:"254",url:"https://660e.com/?url="},
{name:"283",url:"https://api.653520.top/vip/?url="},
{name:"289",url:"https://jx.iztyy.com/svip/?url="},
{name:"314",url:"https://www.kpezp.cn/jlexi.php?url="},
{name:"321",url:"https://cdn.yangju.vip/k/?url="},
{name:"328",url:"https://z1.m1907.cn/?jx="},
{name:"349",url:"https://jx.ivito.cn/?url="},
{name:"670",url:"https://video.isyour.love/Search/SearchJx?t=1632044144000&id="},
{name:"674",url:"https://jiexi.cjt521.com/?url="},
{name:"675",url:"https://wy.cjt521.com/?url="},
{name:"676",url:"https://jiexi2.cjt521.com/m3u8/?url="},
{name:"677",url:"https://jx.19jx.vip/?url="},
{name:"680",url:"https://jsap.ahfuqi.net/?url="},
{name:"685",url:"https://jiexi.us/?url="},
{name:"687",url:"https://jiexi.8b5q.cn/player/jx.php?url="},
{name:"698",url:"https://api.yatongle.com/?url="},
{name:"700",url:"https://api.qianhaijishi.net/?url="},
{name:"702",url:"https://api.leduotv.com/wp-api/ifr.php?vid="},
{name:"706",url:"https://api.1dior.cn/analysis/123/index.php?uid=1428&my=afkruDFIYZ&url="},
{name:"636",url:"https://vip.laobandq.com/jiexi.php?url="},
{name:"637",url:"https://vip.mpos.ren/v/?url="},
{name:"638",url:"https://vip.parwix.com:4433/player/?url="},
{name:"640",url:"https://www.1717yun.com/jx/ty.php?url="},
{name:"641",url:"https://www.33tn.cn/?url="},
{name:"643",url:"https://www.8090g.cn/?url="},
{name:"645",url:"https://www.ckmov.com/?url="},
{name:"646",url:"https://www.ckmov.vip/api.php?url="},
{name:"647",url:"https://www.ckplayer.vip/jiexi/?url="},
{name:"649",url:"https://www.gai4.com/?url="},
{name:"653",url:"https://www.ikukk.com/?ac=0&url="},
{name:"654",url:"https://www.ikukk.com/?ac=1&url="},
{name:"655",url:"https://www.ikukk.com/?ac=2&url="},
{name:"658",url:"https://www.kpezp.cn/jlexi.php?url="},
{name:"659",url:"https://www.nxflv.com/?url="},
{name:"660",url:"https://www.pangujiexi.cc/jiexi.php?url="},
{name:"661",url:"https://www.playm3u8.cn/jiexi.php?url="},
{name:"662",url:"https://www.qianyicp.com/jiexi/index.php?url="},
{name:"666",url:"https://z1.m1907.cn/?jx="},
{name:"667",url:"https://jx.xmflv.com/?url="},
{name:"573",url:"https://api.jiexi.la/?url="},
{name:"574",url:"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
{name:"581",url:"https://api.vodjx.top/?url="},
{name:"582",url:"https://api.yueliangjx.com/?url="},
{name:"583",url:"https://bd.bdjxfw.com/?url="},
{name:"4kan",url:"https://v.ojbkjx.com/?url=",vip:"&next=//www.4kan.tv",jj:"1"},
{name:"589",url:"https://go.yh0523.cn/y.cy?url="},
{name:"591",url:"https://jiexi.janan.net/jiexi/?url="},
{name:"594",url:"https://jx.116kan.com/?url="},
{name:"598",url:"https://jx.618g.com/?url="},
{name:"600",url:"https://jx.99yyw.com/99/?url="},
{name:"601",url:"https://jx.ap2p.cn/?url="},
{name:"604",url:"https://jx.ergan.top/?url="},
{name:"607",url:"https://jx.ivito.cn/?url="},
{name:"608",url:"https://jx.lache.me/cc/?url="},
{name:"609",url:"https://jx.m3u8.tv/jiexi/?url="},
{name:"610",url:"https://jx.mw0.cc/?url="},
{name:"613",url:"https://jx.rdhk.net/?v="},
{name:"618",url:"https://jx.xiaolangyun.com/?url="},
{name:"620",url:"https://jx.yingxiangbao.cn/vip.php?url="},
{name:"624",url:"https://okjx.cc/?url="},
{name:"632",url:"https://vip.bljiex.com/?v="},
{name:"633",url:"https://vip.cjys.top/?url="},
{name:"561",url:"https://17kyun.com/api.php?url="},
{name:"562",url:"https://660e.com/?url="},
{name:"564",url:"https://api.0xu.cc/?url="},
{name:"501",url:"https://jx.jiubojx.com/vip.php?url="},
{name:"365",url:"https://www.sonimei.cn/?url="},
{name:"369",url:"http://api.tvznn.cn//svip//?url="},
{name:"15",url:"http://www.wmxz.wang/video.php?url="},
{name:"43",url:"http://api.xdiaosi.com/?url="},
{name:"44",url:"http://api.xfsub.com/index.php?url="},
{name:"47",url:"http://api.yueliangjx.com/?url="},
{name:"54",url:"http://bf.0135790.xyz/player/?url="},
{name:"110",url:"http://www.sfsft.com/admin.php?url="},
{name:"101",url:"http://www.2692222.com/?url="},
{name:"103",url:"http://www.2ajx.com/vip.php?url="},
{name:"105",url:"http://www.82190555.com/index/qqvod.php?url="},
{name:"112",url:"http://www.zuijuba.com/dp/?url="},
{name:"263",url:"http://17kyun.com/api.php?url="},
{name:"266",url:"http://czjx8.com/?url="},
{name:"267",url:"http://tv.wandhi.com/go.html?url="},
{name:"268",url:"http://okjx.cc/?url="},
{name:"275",url:"http://jx.52a.ink/?url="}, 
{name:"290",url:"http://jx.iztyy.com/svip/?url="},
{name:"316",url:"http://www.33tn.cn/?url="},
{name:"341",url:"http://www.1717yun.com/jx/ty.php?url="},
{name:"348",url:"http://www.wmxz.wang/video.php?url="},
{name:"354",url:"http://511xy.cc/jx?url="},
{name:"355",url:"http://www.82190555.com/video.php?url="},
{name:"356",url:"http://api.lexinys.com//vip//?url=%22"},
{name:"357",url:"http://jx.wfxzzx.cn/?url-="},
{name:"360",url:"http://z1.m1907.cn/?jx="},
{name:"15",url:"http://www.wmxz.wang/video.php?url="},
{name:"43",url:"http://api.xdiaosi.com/?url="},
{name:"44",url:"http://api.xfsub.com/index.php?url="},
{name:"47",url:"http://api.yueliangjx.com/?url="},
{name:"54",url:"http://bf.0135790.xyz/player/?url="},
{name:"110",url:"http://www.sfsft.com/admin.php?url="},
{name:"101",url:"http://www.2692222.com/?url="},
{name:"103",url:"http://www.2ajx.com/vip.php?url="},
{name:"105",url:"http://www.82190555.com/index/qqvod.php?url="},
{name:"112",url:"http://www.zuijuba.com/dp/?url="},  
{name:"668",url:"http://www.qianyicp.com/jiexi/index.php?url="},
{name:"669",url:"http://egwang186.gitee.io/?url="},
{name:"709",url:"http://www.wocao.xyz/index.php?url="},
{name:"710",url:"http://www.wanxun.vip/jiexi/?url="},
{name:"711",url:"http://www.pangujiexi.com/jiexi/?url="},
{name:"714",url:"http://www.jx4k.com/k.php?url="},
{name:"716",url:"http://www.ikukk.com/?url="},
{name:"717",url:"http://www.freeget.org/jx.php?url="},
{name:"719",url:"http://vip.wandhi.com/?v="},
{name:"722",url:"http://jx.xiaolangyun.com/?url="},
{name:"723",url:"http://jx.x-99.cn/api.php?id="},
{name:"724",url:"http://jx.sujx.top/jiexi.php/?url="},
{name:"725",url:"http://jx.rdhk.net/?v="},
{name:"726",url:"http://jx.quanmingjiexi.com/?url="},
{name:"729",url:"http://jx.ivito.cn/?url="},
{name:"730",url:"http://jx.hao-zsj.cn/vip/?url="},
{name:"731",url:"http://jx.973973.xyz/?url="},
{name:"kuai",url:"http://api.jhdyw.vip/?url="},
{name:"kuai1",url:"http://api.13tv.top/jiexi/?url="},
{name:"542",url:"http://okjx.cc/?url="},
{name:"544",url:"http://vip.kubear.cn/player.php?url="},
{name:"546",url:"http://www.97zxkan.com/jiexi/97zxkanapi.php?url="},
{name:"551",url:"http://www.bavei.com/vip3/?url="},
{name:"552",url:"http://www.sfsft.com/admin.php?url="},
{name:"554",url:"http://www.wmxz.wang/video.php?url="},
{name:"510",url:"http://api.bbbbbb.me/vip/?url="},
{name:"511",url:"http://api.bbbbbb.me/yun/?url="},
{name:"512",url:"http://api.lequgirl.com/?url="},
{name:"513",url:"http://api.nepian.com/ckparse/?url="},
{name:"514",url:"http://api.uuyingshi.com/?url="},
{name:"515",url:"http://api.wlzhan.com/sudu/?url="},
{name:"516",url:"http://api.xiuyao.me/jx/?url="},
{name:"517",url:"http://api.zihu.tv/zihuyun/ie.php?url="},
{name:"518",url:"http://app.baiyug.cn:2019/vip/index.php?url="},
{name:"519",url:"http://beaacc.com/api.php?url="},
{name:"520",url:"http://dm.nitian.info/?url="},
{name:"521",url:"http://dp.nitian.info/?url="},
{name:"522",url:"http://dy.ijvba.com/yznew/index.php?url="},
{name:"523",url:"http://dy.jiuli8.com/jiuli8/?url="},
{name:"524",url:"http://dy.jiuli8.com/yunparse/index.php?url="},
{name:"525",url:"http://jiexi.071811.cc/jx.php?url="},
{name:"526",url:"http://jqaaa.com/jx.php?url="},
{name:"527",url:"http://jx.598110.com/?url="},
{name:"528",url:"http://jx.598110.com/duo/index.php?url="},
{name:"529",url:"http://jx.598110.com/index.php?url="},
{name:"530",url:"http://jx.598110.com/zuida.php?url="},
{name:"503",url:"http://60jx.com/?url="},
{name:"504",url:"http://admin.vodjx.top/json.php?url="},
{name:"505",url:"http://admin.vodjx.top/json2.php?url="},























];localStorage.setItem('Dany自定义接口',JSON.stringify(zdyjkb));}}else{return false;}}})();

