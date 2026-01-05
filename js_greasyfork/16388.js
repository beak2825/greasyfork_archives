// ==UserScript==
// @name AC-从Google Baidu Bing搜索结果中屏蔽卡饭教程
// @namespace BlockKafanTopicinGoogle
// @include /^https?\:\/\/encrypted.google.[^\/]+/
// @include /^https?\:\/\/www.google.[^\/]+/
// @include        http://www.baidu.com/*
// @include        https://www.baidu.com/*
// @include /^https?\:\/\/[\w]+.bing.[^\/]+/
// @include /^https?\:\/\/www.haosou.com+/
// @include /^https?\:\/\/www.youdao.com/
// @include /^https?:\/\/www.sogou.com/
// @icon    https://coding.net/u/zb227/p/zbImg/git/raw/master/img0/icon.jpg
// @author       AC
// @version 0.3.0
// @description 从Google Baidu Bing Haosou Youdao搜索结果中屏蔽'卡饭教程'
// @grant none

// @downloadURL https://update.greasyfork.org/scripts/16388/AC-%E4%BB%8EGoogle%20Baidu%20Bing%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E5%8D%A1%E9%A5%AD%E6%95%99%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/16388/AC-%E4%BB%8EGoogle%20Baidu%20Bing%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E5%8D%A1%E9%A5%AD%E6%95%99%E7%A8%8B.meta.js
// ==/UserScript==
//===================================================特殊规则处理=======================================================
/***用于干掉某些不属于普通规则的模块，可以自己仿照格式添加**/
//var sepcStr1_USELESS=new Array("待删除目的URL", "待删除网址的class", "待删除网址对应最终块的class");
var sepcStr1=new Array("rj.baidu.com","c-showurl", "result-op c-container"); //百度软件推广
tryto_del_specificEle(sepcStr1[0], sepcStr1[1], sepcStr1[2], sepcStr1[3]);

//===================================================普通规则变量定义=======================================================
/*
变量x用于baidu-google-bing-haosou-youdao
就是网址的黑名单的意思~~，--不显示该名单中的网址
*/
var x=new Array(
	"kafan.cn/topic",
	"www.kafan.cn › 卡饭教程",
	"001nlp.com",
  "005202.com",
  "01-800.cn",
  "01happy.com",
  "0730ce.com",
  "0769sn.cc",
  "0987655.com",
  "100795.vhost123.cloudvhost.net",
  "100tiao1.net",
  "100tobuy.com.cn",
  "100z100.net",
  "1024baidu.com",
  "111cn.net",
  "114dir.net",
  "114mi.com",
  "117w.com",
  "11x.cc",
  "120du.net",
  "120zhishi.com",
  "123456.black",
  "125135.com",
  "1314so.com",
  "133seo.com",
  "1388.website",
  "150cha.com",
  "15300.cn",
  "15meili.com",
  "161506.com",
  "163620.com",
  "168676.com",
  "16css.com",
  "1921681-1.com",
  "1load.cn",
  "1ygx.com",
  "2051.com.cn",
  "227610.com",
  "228769.net",
  "23vw.cn",
  "258369.cn",
  "25yi.com",
  "2845.com",
  "28im.com",
  "2goo.info",
  "2wd.cc",
  "30zhe.com",
  "3389.us",
  "33lc.com",
  "360.52-so.com",
  "360.mengangel.com",
  "360du.net.cn",
  "360nso.com",
  "366312.net",
  "3699119.blog.163.com",
  "3987.com",
  "3dfczm.com",
  "3e4e.org",
  "3ggood.com",
  "3v4.net",
  "400839.com",
  "49ps.com",
  "4byte.cn",
  "51jb.0510office.com",
  "51wangpan.top",
  "52-so.com",
  "520bdy.com",
  "520so.cc",
  "52wenmi.com",
  "52yiyi.cc",
  "54.soimagess.com",
  "54shabi.cn",
  "55so.cn",
  "57zhuan.cn",
  "57zhuanjie.com",
  "5863web.com",
  "5ajcw.cn",
  "5eso.com",
  "5u.com.cn",
  "600496.com.cn",
  "6040.cc",
  "60lw.com",
  "64so.com",
  "661x.com",
  "68idc.cn",
  "68lj.com",
  "6sit.com",
  "6zhen.cn",
  "70ulzb.cn",
  "71top.com",
  "7xdown.com",
  "80.cm",
  "8090jpt.com",
  "875903.com",
  "879b.com",
  "8ll.com",
  "8myy.com",
  "909s.com",
  "91096762.k201.opensrs.cn",
  "91porn.it",
  "933bt.com",
  "98563.vhost121.cloudvhost.net",
  "98sky.com",
  "999kaopu.com",
  "99answer.top",
  "99bike.net",
  "9lporn.me",
  "9u7u.com",
  "abcpb.com",
  "ablanxue.com",
  "aceek.com",
  "agg.me",
  "ahkaoshi.cn",
  "ahlinux.com",
  "aibing.cc",
  "aichengxu.com",
  "aimei.39ic.com",
  "aimeiso.com",
  "aipeicai.com",
  "aipian520.com",
  "airbanx.com",
  "aitaoniu.com",
  "aiuxian.com",
  "aliog.com",
  "alk-kart.com.cn",
  "alliedjeep.com",
  "android100.org",
  "angiefans.com",
  "anqunzhi.com",
  "anxia.com",
  "ask.wo.he.cn",
  "ask3.cn",
  "audit-server.com",
  "avnvxing.org",
  "aws.impress.pw",
  "b.fengniaoweidai.com",
  "baidu.com-jn.hospital120.net",
  "baidu.com.cloud.search.hnqlx.com",
  "baidu.com.jinanwanhou.com",
  "baidu.com.s.2fjc5sedmhi5enihkmsurq7smzl5kzvwx2aehaa8ollo7miojqwlkkzobt0w2.e6b885e5bfae899d.zhulhua.com.cn",
  "baidu.com.se",
  "baidu.ee",
  "baidu.fileso.com",
  "baiduwangpan.cn",
  "baiduxuexiao.com",
  "baiduyun.57fx.cn",
  "baiiab.com",
  "baijas.com",
  "basoso.com",
  "bbs-people.com",
  "bbs.kafan.cn",
  "bbtdy.com",
  "bcty365.com",
  "bdsola.com",
  "beijingspa.cn",
  "bianceng.cn",
  "bigbaidu.com",
  "bkjia.com",
  "blog.5ibc.net",
  "blog.haohtml.com",
  "blog.jiecaoba.cn",
  "bohuashuinuan.com",
  "boyunjian.com",
  "bt.xj.cn",
  "btwmb.com",
  "bubuko.com",
  "bwwxx.cn",
  "bxsou.com",
  "byadd.com",
  "c.biancheng.net",
  "carlebaby.com",
  "cashibu.com",
  "cfied.cn",
  "cha.dehuifu.com",
  "chagzh.com",
  "chaoyue.link",
  "chaxinyu8.com",
  "chenglongsc.com",
  "chengxuyuans.com",
  "chinadmd.com",
  "chunjing.meixiaqu.com",
  "cn.18dao.net",
  "cn.honggebang.net",
  "cnchangtai.net",
  "cnd8.com",
  "cnmaizhu.com",
  "cnsckd.cn",
  "cocboso.com",
  "codeceo.com",
  "codes51.com",
  "codex.wiki",
  "codingwhy.com",
  "computer.uoh.edu.cn",
  "coolshang.cn",
  "cqb5.com",
  "cr173.com",
  "crxz.com",
  "csdn123.com",
  "cuishilin.com",
  "cy-hl.com",
  "cyw800.com",
  "d.jcwcn.com",
  "d1s.cc",
  "d1s.top",
  "dainifei.info",
  "dajia918.com",
  "daolibai.cn",
  "dasheyin.com.nerdydata.com",
  "dayun123.com",
  "devexception.com",
  "dileer.com",
  "dioop.com",
  "diskdown.com",
  "diyad.cn",
  "doc.wendoc.com",
  "doczj.com",
  "dongbeijiaozi.com",
  "doo.me",
  "doov.net",
  "doudouxitong.net",
  "dovone.com",
  "downbai.com",
  "dswenxue.org",
  "duyidu.com",
  "dy1991.com",
  "dzc4.com",
  "eabe.cn",
  "ejoyi.com",
  "ekpai.com",
  "eooele.com",
  "eqisou.net",
  "express.ruanko.com",
  "eyaoshuo.com",
  "eywwk.cn",
  "eyygo.com",
  "fa-ck.com",
  "faceye.net",
  "fanli7.net",
  "fastso.cn",
  "feakf.cn",
  "feed.hjue.me",
  "ff0512.com",
  "findapk.cn",
  "fksou.com",
  "flmh.pw",
  "fouzun.com",
  "fslyle.com",
  "fullteque.cn",
  "fx114.net",
  "fzcp168.com",
  "fzlmu.cc",
  "g28284606.edtx.cn",
  "gaojisousuo.com",
  "gdetc.com",
  "gdxlzm.com",
  "geyi.org",
  "gfsoso.33dir.com",
  "gfsoso.hk",
  "gfsousou.cn",
  "ggss.cc",
  "go.sma.so",
  "goo.wallpai.com",
  "goodxyx.com",
  "google.580168.com",
  "google.ciliba.net",
  "google.qiaqin.com",
  "google.searching.cc",
  "google.wotaimei.com",
  "gretikaow002.blog.com",
  "gudll.com",
  "gufen.haoii123.com",
  "gufen138.com",
  "guge.pro",
  "gugel.cn",
  "guiquanz.me",
  "gukong.com",
  "gupcn.com",
  "gzcjzx.net",
  "half-price.cc",
  "hang12.com",
  "hanqiuxue20140227d.kaacc.net",
  "hao123.0554.us",
  "haodingjx.com",
  "haosou.searching.cc",
  "hbdotop.com",
  "hcpj.co",
  "heishubao.com",
  "helplib.com",
  "henshiyong.com",
  "hesooo.com",
  "hgw023.com",
  "hhnvtu.org",
  "hicode.cn",
  "hitsword.com",
  "hnttl.com",
  "hoosoo.cc",
  "hotsou.com.cn",
  "howzhi.com",
  "hozz.cn",
  "ht1987.com",
  "httpy.net",
  "hunwu.com.cn",
  "huoduan.com",
  "huoduan.esy.es",
  "hwrjsj.cn",
  "ibaiying.com",
  "ibrother.com.cn",
  "idce.cc",
  "idcweb.com.cn",
  "ieasynet.net",
  "ijiuwen.com",
  "image.haosou.com",
  "ios.pianshen.com",
  "ipgea.net",
  "isuzhi.org",
  "it.uedbetvip.cc",
  "it.zhaozhao.info",
  "it165.net",
  "it300.com",
  "itdqs.com",
  "ithao123.cn",
  "itlab.idcquan.com",
  "itmop.com",
  "itnose.net",
  "itoedr.blog.163.com",
  "itopenpro.com",
  "ittribalwo.com",
  "izlax.cn",
  "java.9sssd.com",
  "java.freesion.com",
  "javacourse.cn",
  "javalearns.com",
  "jb51.net",
  "jbbo8.com",
  "jblm.com.cn",
  "jbxue.com",
  "jeepshoe.org",
  "jegqin.cn",
  "jfocus.net",
  "jhxdr.cn",
  "jiancool.com",
  "jiariwo.com",
  "jimengli.com",
  "jingqumy.com",
  "jisusousuo.com",
  "jixuti.com",
  "jiyudeng.buguangdeng.com",
  "jpstone.bokee.com",
  "js.funet8.com",
  "jscvh.cn",
  "jsfoot.com",
  "jskt.cn",
  "ju.outofmemory.cn",
  "junbqiang.com",
  "juziso.com",
  "jz5u.com",
  "jzhrb.com.cn",
  "kafan.cn",
  "kaitianqi.com",
  "kan117.com",
  "kaopu.so",
  "kedao.org",
  "kj659.com",
  "kk4k.com",
  "klian.com",
  "klz8.cc",
  "kmdyhdf.com",
  "kpzyw.cn",
  "kscity.com.cn",
  "kttcn.com",
  "ku68.cn",
  "kuaidichaxun.com.cn",
  "kuaiso.com",
  "kuaiso.hk",
  "kuangcha.org",
  "kw115.com",
  "kxsla.org",
  "kxwo.com",
  "ledlh.cn",
  "lesou.us",
  "lianshulou.org",
  "lolsoso.com",
  "lpyia.cn",
  "luxuries.press",
  "lxway.com",
  "lxway.net",
  "lzf2012.usa10.sethost.cn",
  "m.1688albb.com",
  "m.189.so",
  "m.890z.com",
  "m.baidu.seo-taiwan.com",
  "m.dayun123.com",
  "m.dgso.cn",
  "m.dibao6668.cn",
  "m.fungi.com.cn",
  "m.gfsoso.slmbio.com",
  "m.google.580168.com",
  "m.gufen138.com",
  "m.gufensoso.cn",
  "m.ithao123.cn",
  "m.lcshi.com",
  "m.lvelue.com",
  "m.so.inewya.com",
  "m.so.jusoso.com",
  "m.so.ku5w.com",
  "m.so.xiaohuihui.net",
  "m.tonglecheng8.com",
  "m.ukso.xyz",
  "m.wangpan.wallpai.com",
  "m.wangye.wallpai.com",
  "m.xh-hy.com",
  "m.xiaoyao123.com.cn",
  "m.xixibaike.com",
  "m.xue163.com",
  "m.yq169.net",
  "m.zgxue.com",
  "mail.cfanz.cn",
  "makaidong.com",
  "mamicode.com",
  "mamisou.cn",
  "mandizhaoya.com",
  "mcbbc.net",
  "mecode.com.cn",
  "meilefu.com",
  "mianfeiwendang.com",
  "miaoyin.org",
  "mifagao.com",
  "millowner29.rssing.com",
  "mnaaa.com",
  "mnyouxun.org",
  "mobile.haoyifu.net.cn",
  "moemo.net",
  "mongolian.cn",
  "motoyi.com",
  "mrxn.net",
  "mttt.com.cn",
  "mu2.cc",
  "myexception.cn",
  "narkive.com",
  "nb.zol.com.cn",
  "nbdpx.com",
  "nbpc120.com",
  "nd8sh.askyou002.cn",
  "niudin.com",
  "njayang.com",
  "nmg.zhunkua.com",
  "nupto.cn",
  "odooqo.cn",
  "okacademic.com",
  "old.miiti.com",
  "opengg.me",
  "ophome.cn",
  "outofmemory.cn",
  "padady.com",
  "pan.52-so.com",
  "pan.basoso.com",
  "pan.haoii123.com",
  "pan.searching.cc",
  "panduoduo.net",
  "pansoeasy.com",
  "pansoso.com",
  "pansousuo.com",
  "paosf.com",
  "pfan.cn",
  "phsou.com",
  "pihen.cn",
  "pk898.net",
  "pla8.com",
  "pmsou.com",
  "popular8.com",
  "ppp.idongnong.com",
  "programfan.com",
  "programgo.com",
  "psvtrucking.com",
  "python.digitser.net",
  "qi-che.com",
  "qiaozuibajy.com",
  "qinglvming.cn",
  "qixuanwang.org",
  "qq.80topic.cn",
  "qqso.soem.cn",
  "qtth.com",
  "qubian.cn",
  "quweiji.com",
  "rain-clear.com",
  "rayfile.com",
  "rbxlp.com",
  "rdyey.com.cn",
  "renrensou.com",
  "renwuttt.org",
  "rjzxx.com",
  "romhome.com",
  "rtys.cc",
  "s.69su.com",
  "s.965u.com",
  "s.cdnjs.net",
  "s.daozhou.net",
  "s.elikeme.cn",
  "s.woso.cn",
  "s.yixueziyuan.com",
  "s900f.com",
  "sdbeta.com",
  "se8.me",
  "search.isoftlink.com",
  "search.qm120.com",
  "searchba.com",
  "seebuu.com",
  "senlinso.com",
  "seojq.com",
  "seoxxw.com",
  "seqin.com",
  "sf-56.com",
  "sf120.top",
  "shandongkeruier.cn",
  "shiguche88.com",
  "shikezhi.com",
  "shipingzhong.cn",
  "shoujikz.com",
  "shuhaiwuya.com",
  "sijitao.net",
  "sj55.org",
  "slightbox.net",
  "sma.so",
  "so.02ee.com",
  "so.0531s.com",
  "so.137919.com",
  "so.168wdw.com",
  "so.1799n.com",
  "so.225la.com",
  "so.365vsh.com",
  "so.501i.com",
  "so.58q8.com",
  "so.596web.com",
  "so.a2018.info",
  "so.alc360.com",
  "so.awuer.com",
  "so.baoqiuw.com",
  "so.bobuwan.com",
  "so.ciliba.com",
  "so.cnima.cn",
  "so.cokcn.cn",
  "so.cyweb.cn",
  "so.damingweb.com",
  "so.dedeadmin.com",
  "so.dupan123.com",
  "so.edczg.cn",
  "so.gqak.com",
  "so.guangmin.net",
  "so.hao136.com",
  "so.haowen.org",
  "so.huoduan.net",
  "so.iliema.com",
  "so.kb263.com",
  "so.kj659.com",
  "so.ku5w.com",
  "so.kuuyue.com",
  "so.nshidai.net",
  "so.oachee.com",
  "so.qinhui88.com",
  "so.qlinyi.com",
  "so.qzrs.pw",
  "so.sanlou.net",
  "so.searcheasy.net",
  "so.shenboshazhu.com",
  "so.shenbosiwangbs.com",
  "so.szjiutian.cn",
  "so.taoisms.org",
  "so.ttywx.com",
  "so.v3v4.com",
  "so.vjiangyin.net",
  "so.wanji.cc",
  "so.weixindaohang.wang",
  "so.woe.cc",
  "so.xiaohuihui.net",
  "so.xinwentoutiaowang.com",
  "so.xionglaoshi.com",
  "so.xy123.cc",
  "so.yesehui.com",
  "so.yuanon.com",
  "so.yunfei89.com",
  "so.yunleba.com",
  "so.zanhuangwang.com",
  "soba123.com",
  "soba8.com",
  "sobaigu.com",
  "sodocs.net",
  "soft.zdnet.com.cn",
  "sogou.com",
  "soimagess.com",
  "sopanpan.com",
  "soshow.com",
  "soso.io",
  "soso.mu",
  "sosuow.com",
  "sou.jinpaiyun.com",
  "sou.lzyjf.com",
  "sou.sfe8.com",
  "sou.wjdl.cn",
  "sounimei.cc",
  "soupan.org",
  "souwangpan.cn",
  "souzhuang.cn",
  "sprat.cn",
  "ss.dafantianlianmeng.cn",
  "sscwfa.com",
  "ssdao.tk",
  "sszjy.com",
  "stoooo.com",
  "sudishu.org",
  "sunjingya.me",
  "supmen.com",
  "sushangwang.com",
  "suso.ren",
  "susoba.com",
  "susuzhi.com",
  "suusoo.com",
  "tamabc.com",
  "tanginns.com",
  "tangqiang.org",
  "tanshuju.org",
  "tc.chinawin.net",
  "tceic.com",
  "tebaidu.com",
  "tech.huweishen.com",
  "teyoujia.com",
  "th7.cn",
  "tingwenlou.org",
  "tmeishi.com",
  "tmjd.27mai.com",
  "tooqo.com",
  "topbester.com",
  "topsou.com.cn",
  "tqcto.com",
  "tsns.xyz",
  "tuanew.com",
  "tuboshu.net",
  "tw.kuaiso.com",
  "tz365.cn",
  "u2g.cn",
  "udpwork.com",
  "ukso.xyz",
  "unjeep.com",
  "usdbus.com",
  "uusousuo.com",
  "uzzf.com",
  "v-kaifu.sf120.top",
  "verydemo.com",
  "veryhuo.com",
  "verypan.com",
  "vmrpb.cn",
  "vtslm.cn",
  "wangpange.com",
  "wanzi138.com",
  "wap.howsou.com",
  "wap2.fppll.net",
  "wapiknow.baidu.cn",
  "waxiaoshuo.com",
  "wbj0110.iteye.com",
  "wccwcc.com",
  "webtag123.com",
  "weibo.zhaock.org",
  "weidaohang.org",
  "wenshushu.com",
  "wenshuw.com",
  "wensoo.com",
  "wikioi.com",
  "wjiale.com",
  "wjxfpf.com",
  "woa.ren",
  "woaiyungou.com.cn",
  "wrsou.com",
  "wuz2015.com",
  "ww.kl50.com",
  "ww88982com.com",
  "wwwbb.top",
  "wylb318.com",
  "wz8k.com",
  "wzss.alai.net",
  "xguwan.com",
  "xiao3.me",
  "xiaoyanba.com",
  "xilinjie.com",
  "xingzuo.gaojiq.cn",
  "xinhuanli.com",
  "xiudianba.com",
  "xker.com",
  "xue163.com",
  "xuebuyuan.com",
  "xuii.cn",
  "xxbar.net",
  "xyun.org",
  "xyzu.tk",
  "xz.jisuanjiwang.cn",
  "ycooo.cn",
  "ygsou.com",
  "yhsou.com",
  "yidiansousuo.com",
  "yidu99.com",
  "yiibai.com",
  "yijiaer.org",
  "yinq.com",
  "yooso.org",
  "yooyso.com",
  "youmeiyoga.com.cn",
  "yqiey.cn",
  "yuersou.com",
  "yunkuaijie.com",
  "yunso.cn",
  "yunso.me",
  "yunzujia.com",
  "ywxun.org",
  "yx.sogou.com",
  "yxad.com",
  "yytlzx.com.cn",
  "yzcn.in",
  "z7z8m.hw100.net",
  "zanlele.com",
  "zdsou.com",
  "zgxdx.com",
  "zhainvshu.org",
  "zhangkong.so",
  "zhaolvsi.com",
  "zhaoyuan.cn",
  "zhengzhou.ezhiol.com",
  "zhichengclub.com",
  "zhidao.wallpai.com",
  "zhidao.yxad.com",
  "zhishizhan.net",
  "zhiso.org",
  "zhizhusou.com",
  "zhuzao88.com",
  "ziliao1.com",
  "ziqian.net",
  "zlda.com",
  "zli.me",
  "zlmz.tk",
  "zonghe.17xie.com",
  "zx1234.cn",
  "zy669.com",
  "zybzyb1.blog.163.com"
);


//网址节点的最近父节点 百度、必应、谷歌、好搜、有道--->用来尽可能的保证不卡死浏览器
var dir_fatherName = new Array(
"f13", //百度
"b_attribution", //必应
"f kv _SWb", //谷歌
"res-linkinfo", //好搜
"result-footer", //有道
"fb", //搜狗
"title"
); 
//网址节点的最终父节点-一一对应
var end_fatherName = new Array(
"result c-container ", //百度
"b_algo", //必应
"g", //谷歌
"res-list", //好搜
"rnw default", //有道
"rb", //搜狗
"result"
); 
var map={};
initMap();

//===================================================主入口=======================================================

mo = new MutationObserver(function(allmutations) {
//alert();
    blockKafanBaidu();
});
var targets = document.body;
mo.observe(targets, {'childList': true,'characterData':true,'subtree': true});

//document.addEventListener('DOMNodeInserted',blockKafanBaidu,false);
function blockKafanBaidu() {
    var isBaidu = (location.href.indexOf('.baidu.com') > -1);
    var isDisConnectMe = (location.href.indexOf('.disconnect.me') > -1);
    var citeList;
    if(isBaidu){
        citeList = document.getElementsByClassName('c-showurl');  //之前取的是g，但这个标签在google中是最大的标签，导致谷歌页面卡住，所以先判断是baidu站点
        deal(citeList)
    }else if(isDisConnectMe){
        citeList = document.getElementsByClassName('title');
        deal_DisConnectMe(citeList);
    }else{
        citeList = document.getElementsByTagName('cite');  // 其他的几个搜索貌似都是以cite为TAG的
        deal(citeList)
    }
}

// 传入nodelist，然后查找两个列，查看是否一致，一致则删除
function deal(citeList){
    for (var index = 0; index < citeList.length; index++) {
        var element = replaceAll(citeList[index].innerHTML);
        if (checkIndexof(element)) {
            var node = citeList[index].parentNode;
            var cur_dir_fatherName = node;
            var II=0;
            if(is_dir_fatherNode(cur_dir_fatherName.className)){
                for(II = 0; II <= 5; II++){
                    node = node.parentNode;
                    console.log(node.className+" kk  "+ map[cur_dir_fatherName.className]);
                    if(isequal(node.className, map[cur_dir_fatherName.className])){
                        break;
                    }
                }
            }
            if(II <= 5)
                node.parentNode.removeChild(node);
             
        }
    }
}

function deal_DisConnectMe(citeList){
    for (var index = 0; index < citeList.length; index++) {
        var element = replaceAll(citeList[index].href);
        if (checkIndexof(element)) {
            var node = citeList[index].parentNode;
            var cur_dir_fatherName = node;
            var II=0;
            if(is_dir_fatherNode(cur_dir_fatherName.id)){
                for(II = 0; II <= 5; II++){
                    node = node.parentNode;
                    console.log(node.id+" kk  "+ map[cur_dir_fatherName.id]);
                    if(isequal(node.id, map[cur_dir_fatherName.id])){
                        break;
                    }
                }
            }
            if(II <= 5)
                node.parentNode.removeChild(node);
        }
    }
}
// 初始化Map
function initMap(){
    var length = dir_fatherName.length;
    for(var i = 0; i < length; i++){
        var a = dir_fatherName[i];
        var b = end_fatherName[i];
        map[a] = b;
    }
}
// 确认是否为最终节点
function isequal(cur_end, map_end){ 
    if(map_end == cur_end)
        return true;
    return false;
}
// 遍历Array，判断网址父节点是应该属于列表中的
function is_dir_fatherNode(node){
    var leng = dir_fatherName.length;
    for(var i = 0; i < leng; i++){
        if(node == dir_fatherName[i]){
            return true;
        }
    }
    return false;
}
/**
url_d 被删除的地址url
spec_d 被删除节点的Class名字
spec_f_d 被删除节点的总的父亲节点的Class名字
index_d 节点到父节点的层数
*/
function tryto_del_specificEle(url_d, spec_d, spec_f_d, index_d){
		//alert('删除ing '+spec_d);
		var citeList2 = document.getElementsByClassName(''+spec_d);
		for(var index = 0; index < citeList2.length; index++){
		var ele = replaceAll(citeList2[index].innerHTML);
		if((ele.indexOf(''+url_d)>-1)){
			var node = citeList2[index].parentNode;
			for(var index2 = 0; index2 <= 4; index2++){
				node = node.parentNode;
				//alert(node.className);
				if(node.className == spec_f_d){
						 break;
				}
			}
			if(index2 <= 4)
				node.parentNode.removeChild(node);
		}
	}
}
/*去掉网址中的<xxx>*/
function replaceAll(sbefore){
	var send;
	send = sbefore.replace(/<[^>]*>/g ,"");
	return send;
}
/*确认是当前例子的一个子例*/
function checkIndexof(element){
	var result = (element.indexOf(x[0]) > -1);
	for(var i = 1; i <= x.length; i++){
		//alert("check");
		result = result || (element.indexOf(x[i]) > - 1);
	}
	return result;
}
