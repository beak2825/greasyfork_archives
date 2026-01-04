// ==UserScript==
// @name   加多重buff的广告拦截脚本(二改)
// @author ChatGPT
// @description 去广告脚本，可能有误杀，可以在脚本菜单禁用当前域名拦截，二改，优化了标识符替换。
// @version 12.4
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @match *://*/*
// @exclude *://*.10000read.com/*
// @exclude *://*.10010.com/*
// @exclude *://*.10086.cn/*
// @exclude *://*.10jqka.com.cn/*
// @exclude *://*.12371.cn/*
// @exclude *://*.163.com/*
// @exclude *://*.17173.com/*
// @exclude *://*.17k.com/*
// @exclude *://*.1905.com/*
// @exclude *://*.19lou.com/*
// @exclude *://*.1kkk.com/*
// @exclude *://*.1ting.com/*
// @exclude *://*.360.cn/*
// @exclude *://*.360doc.com/*
// @exclude *://*.3g.cn/*
// @exclude *://*.3gsc.com.cn/*
// @exclude *://*.4399dmw.com/*
// @exclude *://*.4yt.net/*
// @exclude *://*.51changdu.cn/*
// @exclude *://*.56.com/*
// @exclude *://*.5nd.com/*
// @exclude *://*.5ydj.com/*
// @exclude *://*.6.cn/*
// @exclude *://*.61.com/*
// @exclude *://*.71.cn/*
// @exclude *://*.78dm.net/*
// @exclude *://*.7m.cn/*
// @exclude *://*.81.cn/*
// @exclude *://*.9ku.com/*
// @exclude *://*.9sky.com/*
// @exclude *://*.9xiu.com/*
// @exclude *://*.a8.com/*
// @exclude *://*.acfun.cn/*
// @exclude *://*.ahtv.cn/*
// @exclude *://*.aipai.com/*
// @exclude *://*.aisixiang.com/*
// @exclude *://*.amazon.cn/*
// @exclude *://*.anhuinews.cc/*
// @exclude *://*.baidu.com/*
// @exclude *://*.baike.com/*
// @exclude *://*.bale.cn/*
// @exclude *://*.banyuetan.org/*
// @exclude *://*.baofeng.com/*
// @exclude *://*.baomihua.com/*
// @exclude *://*.bayueju.com/*
// @exclude *://*.besgold.com/*
// @exclude *://*.bilibili.com/*
// @exclude *://*.bing.com/*
// @exclude *://*.bjnews.com.cn/*
// @exclude *://*.blogchina.com/*
// @exclude *://*.bokee.com/*
// @exclude *://*.brtn.cn/*
// @exclude *://*.buka.cn/*
// @exclude *://*.bymanhua.com/*
// @exclude *://*.cac.gov.cn/*
// @exclude *://*.caixin.com/*
// @exclude *://*.cankaoxiaoxi.com/*
// @exclude *://*.cb.com.cn/*
// @exclude *://*.cba.net.cn/*
// @exclude *://*.ccshao.com/*
// @exclude *://*.cctv.com/*
// @exclude *://*.ce.cn/*
// @exclude *://*.cfi.cn/*
// @exclude *://*.changba.com/*
// @exclude *://*.china.com.cn/*
// @exclude *://*.china.com/*
// @exclude *://*.chinadaily.com.cn/*
// @exclude *://*.chinanews.com.cn/*
// @exclude *://*.chinanews.com/*
// @exclude *://*.chinavalue.net/*
// @exclude *://*.chinaventure.com.cn/*
// @exclude *://*.chjak.cn/*
// @exclude *://*.chnews.net/*
// @exclude *://*.ciweimao.com/*
// @exclude *://*.cmread.com/*
// @exclude *://*.cnautonews.com/*
// @exclude *://*.cnblogs.com/*
// @exclude *://*.cngold.org/*
// @exclude *://*.cnhubei.com/*
// @exclude *://*.cnmo.com/*
// @exclude *://*.cnn.com/*
// @exclude *://*.cnnb.com/*
// @exclude *://*.cnr.cn/*
// @exclude *://*.cnstock.com/*
// @exclude *://*.cntv.cn/*
// @exclude *://*.cpd.com.cn/*
// @exclude *://*.cqnews.net/*
// @exclude *://*.cqwb.com.cn/*
// @exclude *://*.cri.cn/*
// @exclude *://*.crntt.com/*
// @exclude *://*.cuctv.com/*
// @exclude *://*.cyol.com/*
// @exclude *://*.cyol.net/*
// @exclude *://*.dahe.cn/*
// @exclude *://*.dangdang.com/*
// @exclude *://*.dayoo.com/*
// @exclude *://*.dbw.cn/*
// @exclude *://*.diyidan.com/*
// @exclude *://*.dj97.com/*
// @exclude *://*.djkk.com/*
// @exclude *://*.djye.com/*
// @exclude *://*.dm5.com/*
// @exclude *://*.dmkb.net/*
// @exclude *://*.docin.com/*
// @exclude *://*.dongmanmanhua.cn/*
// @exclude *://*.douban.com/*
// @exclude *://*.douban.fm/*
// @exclude *://*.douyu.com/*
// @exclude *://*.duitang.com/*
// @exclude *://*.duokan.com/*
// @exclude *://*.dzwww.com/*
// @exclude *://*.eastday.com/*
// @exclude *://*.eastmoney.com/*
// @exclude *://*.ebusinessreview.cn/*
// @exclude *://*.eeo.com.cn/*
// @exclude *://*.faloo.com/*
// @exclude *://*.fbook.net/*
// @exclude *://*.feng.com/*
// @exclude *://*.fjsen.com/*
// @exclude *://*.fmx.cn/*
// @exclude *://*.fx678.com/*
// @exclude *://*.gdtv.cn/*
// @exclude *://*.gdtv.com.cn/*
// @exclude *://*.gfan.com/*
// @exclude *://*.github.com/*
// @exclude *://*.gmw.cn/*
// @exclude *://*.google.*/*
// @exclude *://*.gooooal.com/*
// @exclude *://*.guancha.cn/*
// @exclude *://*.guandian.cn/*
// @exclude *://*.guokr.com/*
// @exclude *://*.guqu.net/*
// @exclude *://*.gxnews.com.cn/*
// @exclude *://*.haiwainet.cn/*
// @exclude *://*.hao123.com/*
// @exclude *://*.hbooker.com/*
// @exclude *://*.hefei.cc/*
// @exclude *://*.heiyan.com/*
// @exclude *://*.hexun.com/*
// @exclude *://*.hnquxing.com/*
// @exclude *://*.hongshu.com/*
// @exclude *://*.hongxiu.com/*
// @exclude *://*.hsw.cn/*
// @exclude *://*.huajiao.com/*
// @exclude *://*.hualongxiang.com/*
// @exclude *://*.huanqiu.com/*
// @exclude *://*.huomao.com/*
// @exclude *://*.hupu.com/*
// @exclude *://*.huxiu.com/*
// @exclude *://*.huya.com/*
// @exclude *://*.iceo.com.cn/*
// @exclude *://*.ifeng.com/*
// @exclude *://*.ifengweekly.com/*
// @exclude *://*.iheima.com/*
// @exclude *://*.ihuaben.com/*
// @exclude *://*.ik123.com/*
// @exclude *://*.imobile.com.cn/*
// @exclude *://*.inewsweek.cn/*
// @exclude *://*.infzm.com/*
// @exclude *://*.ip138.com/*
// @exclude *://*.iqilu.com/*
// @exclude *://*.iqiyi.com/*
// @exclude *://*.isamanhua.com/*
// @exclude *://*.it168.com/*
// @exclude *://*.ixigua.com/*
// @exclude *://*.iyouman.com/*
// @exclude *://*.iyunyue.com/*
// @exclude *://*.jcrb.com/*
// @exclude *://*.jianshu.com/*
// @exclude *://*.jjckb.cn/*
// @exclude *://*.jjwxc.net/*
// @exclude *://*.jstv.com/*
// @exclude *://*.k618.cn/*
// @exclude *://*.kaimanhua.com/*
// @exclude *://*.kaixin001.com/*
// @exclude *://*.kankan.com/*
// @exclude *://*.kankanews.com/*
// @exclude *://*.kanman.com/*
// @exclude *://*.kanshu.com/*
// @exclude *://*.kaolafm.com/*
// @exclude *://*.kdnet.net/*
// @exclude *://*.km.com/*
// @exclude *://*.ku6.com/*
// @exclude *://*.kuaikanmanhua.com/*
// @exclude *://*.kugou.com/*
// @exclude *://*.kujiang.com/*
// @exclude *://*.kumanhua.net/*
// @exclude *://*.kumi.cn/*
// @exclude *://*.kuwo.cn/*
// @exclude *://*.laikan.com/*
// @exclude *://*.lcread.com/*
// @exclude *://*.le.com/*
// @exclude *://*.legaldaily.com.cn/*
// @exclude *://*.leisu.com/*
// @exclude *://*.leju.com/*
// @exclude *://*.letv.com/*
// @exclude *://*.liba.com/*
// @exclude *://*.lifeweek.com.cn/*
// @exclude *://*.lingyun5.com/*
// @exclude *://*.lkong.net/*
// @exclude *://*.lofter.com/*
// @exclude *://*.longzhu.com/*
// @exclude *://*.lottery.gov.cn/*
// @exclude *://*.lrts.me/*
// @exclude *://*.ltaaa.com/*
// @exclude *://*.luochen.com/*
// @exclude *://*.luochu.com/*
// @exclude *://*.m.fun.tv/*
// @exclude *://*.m1905.com/*
// @exclude *://*.m4.cn/*
// @exclude *://*.manben.com/*
// @exclude *://*.manhuadao.cn/*
// @exclude *://*.manhuatai.com/*
// @exclude *://*.manmanapp.com/*
// @exclude *://*.manmankan.com/*
// @exclude *://*.meipai.com/*
// @exclude *://*.mgtv.com/*
// @exclude *://*.miercn.com/*
// @exclude *://*.migu.cn/*
// @exclude *://*.mingqingxiaoshuo.com/*
// @exclude *://*.mkzhan.com/*
// @exclude *://*.moofeel.com/*
// @exclude *://*.mop.com/*
// @exclude *://*.motie.com/*
// @exclude *://*.mtime.com/*
// @exclude *://*.mtv123.com/*
// @exclude *://*.musicool.cn/*
// @exclude *://*.muyewx.com/*
// @exclude *://*.mvbox.cn/*
// @exclude *://*.myfcomic.com/*
// @exclude *://*.nba.com/*
// @exclude *://*.nbd.com.cn/*
// @exclude *://*.news.cn/*
// @exclude *://*.newsmth.net/*
// @exclude *://*.nfcmag.com/*
// @exclude *://*.nipic.com/*
// @exclude *://*.nlc.cn/*
// @exclude *://*.nowscore.com/*
// @exclude *://*.npc.gov.cn/*
// @exclude *://*.oeeee.com/*
// @exclude *://*.oneniceapp.com/*
// @exclude *://*.paidai.com/*
// @exclude *://*.pconline.com.cn/*
// @exclude *://*.pcpop.com/*
// @exclude *://*.people.com.cn/*
// @exclude *://*.pingshu8.com/*
// @exclude *://*.pps.tv/*
// @exclude *://*.pptv.com/*
// @exclude *://*.qdaily.com/*
// @exclude *://*.qdmm.com/*
// @exclude *://*.qidian.com/*
// @exclude *://*.qimao.com/*
// @exclude *://*.qingdaonews.com/*
// @exclude *://*.qingoo.cn/*
// @exclude *://*.qingting.fm/*
// @exclude *://*.qiremanhua.com/*
// @exclude *://*.qiushibaike.com/*
// @exclude *://*.qq.com/*
// @exclude *://*.qrxs.cn/*
// @exclude *://*.qwsy.com/*
// @exclude *://*.rain8.com/*
// @exclude *://*.readnovel.com/*
// @exclude *://*.rednet.cn/*
// @exclude *://*.renhe.cn/*
// @exclude *://*.renren.com/*
// @exclude *://*.ruochu.com/*
// @exclude *://*.sfacg.com/*
// @exclude *://*.sh.cn/*
// @exclude *://*.shenchuang.com/*
// @exclude *://*.shenglifubang.cn/*
// @exclude *://*.shenmantang.com/*
// @exclude *://*.shucong.com/*
// @exclude *://*.shuhai.com/*
// @exclude *://*.shuqi.com/*
// @exclude *://*.sina.cn/*
// @exclude *://*.sina.com.cn/*
// @exclude *://*.sinovision.net/*
// @exclude *://*.so.com/*
// @exclude *://*.sohu.com/*
// @exclude *://*.soudongman.com/*
// @exclude *://*.southcn.com/*
// @exclude *://*.sport.gov.cn/*
// @exclude *://*.stnn.cc/*
// @exclude *://*.storychina.cn/*
// @exclude *://*.sxcnw.net/*
// @exclude *://*.sxrb.com/*
// @exclude *://*.sznews.com/*
// @exclude *://*.tadu.com/*
// @exclude *://*.taihe.com/*
// @exclude *://*.takungpao.com/*
// @exclude *://*.tan8.com/*
// @exclude *://*.taobao.com/*
// @exclude *://*.taomanhua.com/*
// @exclude *://*.thecfa.cn/*
// @exclude *://*.thepaper.cn/*
// @exclude *://*.tiandizw.com/*
// @exclude *://*.tianya.cn/*
// @exclude *://*.tiexue.net/*
// @exclude *://*.tingbook.com/*
// @exclude *://*.titan24.com/*
// @exclude *://*.trueme.net/*
// @exclude *://*.tudou.com/*
// @exclude *://*.tvb.com/*
// @exclude *://*.tvmao.com/*
// @exclude *://*.tvsou.com/*
// @exclude *://*.txtbook.com.cn/*
// @exclude *://*.u17.com/*
// @exclude *://*.un.org/*
// @exclude *://*.v.qq.com/*
// @exclude *://*.v1.cn/*
// @exclude *://*.vmovier.com/*
// @exclude *://*.voc.com.cn/*
// @exclude *://*.vvvdj.com/*
// @exclude *://*.wasu.cn/*
// @exclude *://*.weibo.com/*
// @exclude *://*.wenming.cn/*
// @exclude *://*.wenweipo.com/*
// @exclude *://*.win001.com.cn/*
// @exclude *://*.winshang.com/*
// @exclude *://*.www.fun.tv/*
// @exclude *://*.www.gov.cn/*
// @exclude *://*.xfrb.com.cn/*
// @exclude *://*.xiami.com/*
// @exclude *://*.xiang5.com/*
// @exclude *://*.xiaomi.cn/*
// @exclude *://*.xici.net/*
// @exclude *://*.xilu.com/*
// @exclude *://*.ximalaya.com/*
// @exclude *://*.xinhuanet.com/*
// @exclude *://*.xinmanhua.net/*
// @exclude *://*.xmfish.com/*
// @exclude *://*.xmkanshu.com/*
// @exclude *://*.xs8.cn/*
// @exclude *://*.xxsy.net/*
// @exclude *://*.y2002.com/*
// @exclude *://*.yangtse.com/*
// @exclude *://*.ycwb.com/*
// @exclude *://*.yicai.com/*
// @exclude *://*.yidianzixun.com/*
// @exclude *://*.yinyuetai.com/*
// @exclude *://*.yizhibo.com/*
// @exclude *://*.yizhikan.com/*
// @exclude *://*.youth.cn/*
// @exclude *://*.yue365.com/*
// @exclude *://*.yy.com/*
// @exclude *://*.yy8844.cn/*
// @exclude *://*.yymp3.com/*
// @exclude *://*.zgjrjw.com/*
// @exclude *://*.zhangwen.cn/*
// @exclude *://*.zhangyue.com/*
// @exclude *://*.zhibo8.cc/*
// @exclude *://*.zhihu.com/*
// @exclude *://*.zhiyin.cn/*
// @exclude *://*.zhulang.com/*
// @exclude *://*.zjol.com.cn/*
// @exclude *://*.zjstv.com/*
// @exclude *://*.znds.com/*
// @exclude *://*.zol.com.cn/*
// @exclude *://*.zongheng.com/*
// @exclude *://*.zuitang.com/*
// @exclude *://*.zuowen.com/*
// @exclude *://*.zymk.cn/*
// @exclude *://github.com/*
// @exclude *://greasyfork.org/*
// @exclude *://rebang.today/*
// @exclude *://scriptcat.org/*
// @exclude *://twitter.com/*
// @exclude *://www.colamanhua.com/*
// @exclude *://x.com/*
// @run-at     document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/530149/%E5%8A%A0%E5%A4%9A%E9%87%8Dbuff%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E8%84%9A%E6%9C%AC%28%E4%BA%8C%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530149/%E5%8A%A0%E5%A4%9A%E9%87%8Dbuff%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E8%84%9A%E6%9C%AC%28%E4%BA%8C%E6%94%B9%29.meta.js
// ==/UserScript==

(function() {
 'use strict';

 // 获取当前网站URL，并根据其生成一个唯一的存储键
 var storageKey = window.location.hostname;

 // 根据存储键获取已保存的设置（如果存在）
 var isEnabled = GM_getValue(storageKey, true);

 function showAlert() {
 (function() {
 var g_times = 0,
 itids = [],
 timer;

 function myfun() {
 //隐藏元素
 itids.push(
 setTimeout(function() {
var styleTag = document.createElement('style');
styleTag.innerHTML = `
  .hidden-element {
    display: none !important;
    visibility: hidden;
    opacity: 0;
    z-index: -999;
    width: 0;
    height: 0;
    pointer-events: none;
    position: absolute;
    left: -9999px;
    top: -9999px;
  }
`;
document.head.appendChild(styleTag);

var elements = document.querySelectorAll("[style^='left'],[style^='visibility:visible;padding:0;margin:0;-webkit-appearance:none;position:absolute !important;left:0px;top:-'],[style*='background-size: 400px 127px !important;'],[style*='background-size: 470px 149px !important;'],[style*='position: fixed; left: 0px; transform: none; top: 0px; z-index: '],[style$='width:100vw;display:block;'],[style*='width: 100vw; position: fixed;'],[style$='important;'],p[class],ul *,UL,H2,body.clearfix *,[style^='display: block; z-index: '],[style^='background-image: url('],body#read.read *,.adsbygoogle[referrerpolicy],[style='height: 125px;'],[style^='display: block;'],[style='height: 125.002px;'],[classname],[ontouchstar],[style='height: 125px;'],[style='height: 125.002px;'],[style$='display: block;'],[class*='_'][id*='_'],[style='height:0px;'],[style*='background: url'],[style*='width: 100vw; top:']");
for (var i = 0; i < elements.length; i++) {
  var zIndex = parseInt(elements[i].style.zIndex);
  if (zIndex > 600) {
    elements[i].classList.add('hidden-element');
  }
}
 }, 350)
 );

 if (g_times >= 6) {
 window.clearInterval(timer);
 }
 g_times++;
 }
 itids.push(
 setTimeout(function() {
 //主循环计时器
 timer = setInterval(myfun, 500);
 itids.push(timer);
 myfun();
 }, 500)
 );
 })();
//通用规则
// 假定的输入字符串，分为三部分
const input1 = `##DIV[data-text-ad]
###bottom_ads.hl_bottom_ads
##A[href*='jialu6699h.vip']
##DIV.adj
##[style*='px; top: 0px; left: 0px; animation: 1.5s ease 0.2s infinite normal none running shakegwegs; z-index:']
##A[href*='youqu.buzz']
##A[href^='https://tv2356.cc']
##DIV[class$='_ad_wrap']
##DIV[class^='ads_border_']
##body > A[ontouchstart='this.click();'][href]
##div[id*='cat_'][id*='_ad']
##IMG[alt^='kaiybet']
##DIV.myui-content__acc[style='position: relative;padding: 0 10px']
##[style^='bottom: 0px; width: 100%; height: 50vw; position: fixed; left: 0px; right: 0px; margin: 0px; background: url("https://']
##[href='/aga2/1661087']
##[href^='http://jg.awaliwa.com/']
##.player_pic_link > [src*='/player.gif']
##div.close-player_pic[onclick="document.getElementById('player_pic').style.display='none'"]
##[href^='https://jincai.sohu.com/']
##[href*='sohu.com/hy-op']
##[href='/jump.html']
##[href='/ad.html']
##DIV._42701c0173
##DIV._4e544f1dde
##div.m0auto div.s_h,div.m0auto div.s_h + *
##secion#ly LI[role='group'],secion#ly > H2
##div.play_boxbg div[class$='_acmsd']
##DIV.bot-per-context[data-width='728'][data-height='90']
##DIV.fixed-bottom.d-block.d-sm-none.movies_ad
##DIV.col-4.col-sm-2.col-xl-2.px-1.px-sm-2.pb-3.pt-3.pt-sm-0.d-block.d-sm-none
##[href*='.lookxmh3']
##[href='https://dpurl.cn/HifSTUtz']
##[href^="openapp.jdmobile://virtual?params="]
##[onclick*="trackEvent', 'ad"]
##[src^='https://ae01.alicdn.com/'][alt='歪歪漫画']
##UL[style='margin: 0px; padding: 0px; font-size: 0px; display: flex;']
###topNavad
###bottomNavad
##.ff-ads
##.ssr1
##.ad_img
##body.conch-hasone section > span > video
##div.stui-pannel__bd > #t-img-box
##P[style$='transparent !important; font-size: 0px !important; text-indent: -10000px !important; height: 125px !important;']
##DIV[style^='width:100%;height:100%;line-height: 100%;overflow:hidden; margin:auto;border:1px #']
##[src$='/dibu.adadadad']
##.ayx[style="position: fixed;bottom: -10px;right:0;z-index:999;width:250px"]
##[href*="/entry/register/?i_code="]
##[style$='auto;text-align: center;line-height: initial;margin-bottom: 10px;margin-left: 20px;margin-right: 20px;']
##[style$="both;margin: auto;text-align: center;line-height: initial;margin-bottom: 10px;"]
##DIV#mhbottom_ad_box
##[href^='https://w5979.com:']
##[href^='https://dc.vvsmse72']
##oxk
##body > a[id*='hudie_']
##div.synopsisArea > a[id*='hudie_']
##div.recommend > a[id*='hudie_']
##div.poi-row a > IMG[width='100%'][height='auto'][src]
##div.row > div[id] > ul > li.cpn > a
##SPAN[style$='font-size: 6vw; color:#fff; text-align: center; transform: rotate(-90deg);']
##div.page.player > div.main > div.content > div.module.module-player > div.module-main > div.player-box > div.player-rm.rm-list > a > img
##IMG[src*='/gg/'][src$='180.gif'][src*='800']
##[onclick="window.open('http://682kg.com/')"]
##[href^='https://www.00285164.com']
##[href^='https://97749516.com/']
##[href^='https://www.00426740.com']
##[href^='https://tz.kefuyuming.vip/']
##[href^='https://gougew.lanzoub.com/']
##[href='/ad/bfy.html']
##[href='/my/gd.html']
##[style^="pointer-events: none;background-image:url('https://33789.qqqwww987.site"],[style^='z-index: 2147483647; height: 123px; ']
###ad-header-mobile-contener
###downapp1
##[data^='/banners/pr_advertising_ads_banner']
##[src^='/banners/pr_advertising_ads_banner']
##body > DIV[class][style='top: 132px;']
##body > DIV[style*='height: 33px'][style*='132px !important;']
##body > DIV[style='display: block; width: 100%; height: 132px;']
##[href^='https://www.qlspx.com:']
##[href^="https://9996867.com"]
##[href="/ad/007.html"]
###ad-index.position-relative
##[src^='https://l.bt5v.com/v.php']
##div.container > div.row div.yalayi_box
##center > [href^='https://docs.qq.com/doc'][target='_blank']
##A[href='/hth.html']
##[alt="要恰饭的嘛"]
##img#hth[onclick^="window.open"]
##[onclick*='https://i.opiwb.com:']
##[href='https://click.aliyun.com/m/1000332699/']
##[src^='https://qwe0231141.bj.bcebos.com/']
##.gr_slide_car_inner
##.__isboostOverContent
##IMG[referrerpolicy='no-referrer'][style='box-sizing: border-box;height:calc(10vh); width:100%;padding: 0px 15px 10px 15px;']
##.C1U,.C1M,.C2L,.C2R
##[src^='/Uploads/ad/'][src$='.gif'][alt='广告']
##img#hth[onclick$="hth.html')"]
##A[onclick$='()'][target='_top'][style*='.gif) no-repeat;background-size:100% 100%;']
##body#nr_body.nr_all.c_nr > div[class] > DIV[style='height:90px;width:100%;']
##IMG[src$='.dl'][style='width:100% !important;height:90px'][onclick]
##A[style='width: 100%;height: 150px;z-index:1000;position: absolute;display:block;top: 0px;'][onclick$=';this.style.display="none";']
##[src^='https://play.cdn6.buzz/js/']
##[href='https://www.aiwajbh.com/mh.php']
##div#reader-scroll.acgn-reader-chapter.v>div>center>strong>button
##[onclick^="window.location.href='https://apps.apple.com/cn/app/%E9%80%9F%E9%98%85%E5%B0%8F%E8%AF%B4"]
##.fed-part-advs.fed-text-center.fed-font-xvi
##A[href^='http'][style^='display:block;left:0;right:0;position:fixed;border-left:']
###hongbao20201217
###whYuTlxF
###t4>a
##[href^='https://kcc.qrjxween.com/cc/']
##.zozoads
##[src='http://m.guangzhoubingqing.com/88888.jpg']
###bl_mobile_float[style='height: 152px;']
###sOIcquIT
##[src^='/MDassets/images/']
##DIV.ec-ad.tim-box
##DIV.box-width.ec-ad
##[class^="chapter_"] > .baiduCenter
##[href*="/?channelCode="] > [referrerpolicy='no-referrer']
##[href^='http://mm.alameinv.com/']
##[onclick='gourl()'][src^='/images/bfq/']
##[onclick="window.open('https://docs.qq.com/doc/DZGtmWUxpamJGTnNY');"]
###coupletBox
##.advertise
##[href^='https://xcc.'][href*='cn/']
##a.gggg[href^="https"]
###adDisabledBtn
###Page-1[stroke='none'][fill='none'][fill-rule='evenodd']
###header_global_ad
##DIV#bl_mobile_float
##[href^='https://iluluweb.club']
##.width.imgs_1
##[href^='https://jd.dangbei.com/']
##[href^='https://dt.mydrivers.com/b.ashx']
##.bottom-pic,.col-pd.mb10
##.mi_btcon.ad
##.fc_foot
##SPAN#VuMk2.IgpuN2
##[href^='https://fcc.hxaxfcc.cn/']
##SPAN[style^="position: fixed; bottom: 30vh; z-index: 2147483647; right: 0px; margin-right: 6vw; padding: 0px; text-decoration: none; background-color: red; width: 7vw; height: 7vw; border-radius: 7vw; font-size: 6vw; color:"]
##SPAN#qdSZ2
##div[class^="is_"] > a > img[referrerpolicy="no-referrer"][src*="hdslb.com"]
##[alt='ACG里番']
##[alt='52bl']
##[alt='西瓜社']
##VIDEO[loop='true'][muted='true'][autoplay='true'][playsinline='true'][preload='auto']
##[href^="https://lantianyong"]
##[href='http://ky53362.com/']
##[href^='https://js.xiaobaofei.com']
##[href^='https://tz.jingjiezhenkong.com']
##[href^='http://j6597v.hjlego.com']
##[href^='https://xxx.nunxun.com']
##div.row.col5.clearfix:nth-of-type(2) > dl:nth-of-type(1)
##[at*='尼斯人注册送']
##DIV.ads.ads_w
##body#nr_body a[href*="/?utm_source="]
##[style*='width:9.6vw;height:8.5vw;background:#000;opacity:0.01;']
##IMG[url][onclick='window.open(this.url)'][src$='.gif'][width='100%']
##body.active > div.myui-panel > DIV#home_slide
##IMG[referrerpolicy='no-referrer'][src$='.gif'][width='100%']
##div.page.player > div.main > div.content > div.module.module-player DIV[style='width:100%;height:180px']
##div.page.view > div.main > div.content > DIV[style='width:100%;height:100px']
##div.homepage > div.main > div.content > DIV[style='width:100%;height:180px']
##div.main div.content div[id].is_mb a[id] img[id]
##[src='/images/c_l.png']
##A[href^='http://h5.shangjinssp.com/sjprom'][style='display:block;']
##.clearfix > a > IMG[referrerpolicy='no-referrer'][src]:not([style='display: block;'])
##A[target='_blank'][href*='/auth/register?code=']
##[href='/my/dp.html']
##A[href='http://8hgpro.vip/']
##A[href='http://95710.vip']
##A[href^='http://www.kyty1119.com']
##A[href='http://kkyty29.cc/']
##[href*='.xacg.info/']
##[style='box-sizing: border-box; position: relative; left: 0px; z-index: 912944; text-indent: -10em;']
##body#nr_body.nr_all.c_nr > section[id]
##A[href^='https://chmjmff.com/']
##div.container > IFRAME[align][width][src][border][height]
##A[href^='https://d1-dm.online/go/']
##DIV.appdownload_ad
##A[href^='https://yongle008.com']
##DIV#bfad
##DIV.hidden-lg[style='position: absolute;bottom: 0px;z-index: 10;']
##A[href^='https://js.pico4pro.com']
##IMG[alt='155.fun']
##div#detail.selector-zero > div > DIV[style]
##DIV.ad-area.ad-area-fix-bottom
##div.ad-area > [href]
##center > a > IMG[alt$='到期']
##body#nr_body font > [id]
##IMG.cupfox[src$='gif']
##[href^='https://luodi.aitaokeji.top/']
##[poster^='https://dingbu.bj.bcebos.com/']
##[src^='https://dingbu.bj.bcebos.com/']
##IMG[onclick='golh()'][src$='.gif']
##div.callApp_fl_btn.an
###ad-1,#ad-2,#ad-3,#ad-4,#ad-5,#ad-6,#ad-7
##[src='https://pnm.hpvitycz.cn/00.jpg']
###mobile-index > div[id^="ins"]
###mobile-index > div#vodbm
##[onclick*='www.l4lui.com'],.col-12.position-relative>b
##.theme-dark > .ayx > a
##DIV.ad_js
##A[href='http://x5123.cc/']
##a > IMG[src$='.gif'][wapsrc][style^='width: 100%']
##a > I.gg-icon
##ul > li > A[href$='_list.html']
##div.bf_qy DIV.copy_div_btn
##DIV#advertisings.advertising
##A[href^='http://cszb420.tinawd81.com/']
##ul.content-list > li.content-tb
##div.video-box > div.hf > a
##body > h1 > strong > title > a
##UL.myui-extra.clearfix
##A[href^='https://www.nonstopclub.xyz']
##A[href^='https://js.iconiclee.com']
##[alt='ad']
##A[href*='zbkrv.com']
##div.container > DIV.t-img-box
##A[href='/?'][target='_blank']
##DIV#video-player-ads-wrap
##div.flex-1.order-first > DIV.under_player
##DIV[style*='.xyz/gif/']
##DIV.module-adslist
##DIV.JS_mid_ad
##IFRAME[src^='https://mydisplay.ctfile.com/popview.php']
##div[id$='ad1'][class^='text'],div[id$='ad2'][class^='text'],div[id$='ad3'][class^='text'],div[id$='ad4'][class^='text'],div[id$='ad5'][class^='text'],div[id$='ad6'][class^='text']
##span > A[href='###']
##IMG[style='width: 100%;'][src^='https://ad.']
##A[href='http://k023055.com']
##DIV#bannerCtrl.source_container.swiper-wrapper
##IMG[src*='.xyz/tupian/'][src$='/h5.gif']
##[href^='https://65564535.com']
##div.ad-frame-container
##iframe.ad-frame
##DIV#tads
##body > DIV[class][style='top: 133px;']
##DIV[style*='display: block; width: 100%; left: 0px; position: fixed; z-index:'][style*='height: 25px; top: 133px;']
##body > DIV[style='display: block; width: 100%; height: 133px;']
##DIV[style*='height: 33.25px; top:'][style*='background-size: 400px 133px !important;']
##DIV.footer-appload.js-footer-appload
##BODY > DIV.ggcontainer
##body > DIV[class][style^='bottom: '][style$='vw; display: block;']
##body > [id][style*='width:100%'][style*='min-height:120px']
##DIV.col-lg-3.col-md-3.col-sm-4.col-12.item.p-0.px-1
##DIV#links.links.my-1.row[style='font-size:20px']
##[class$="_main_outstream"][style="right: 0px;"]
##DIV#div1.div-relative[style='display:block;']
##[href^='https://analytics.woozooo.com/jump.php?url=']
##[href^='https://ccs.holor0803.cn']
##[href$='/ads.aspx']
##div.post_list_ajax > A[target='_blank']
##body.bg_xin > A[href*='com:'][target='_blank']
##DIV.index_adpic
##[onclick*='pypyj.com']
##DIV.div_adhost
##DIV.stui-player__item.clearfix > img[url]
##[style*='width: 100% !important; margin: 0px !important; padding: 0px !important; display: flex !'] *
##[style='width:100%;height:auto;min-height:120px;position:relative;display:block;']
##div.row > DIV.md-r-panel
##A.toptxt[target='_blank']
##SPAN.closebox1,SPAN.closebox2,SPAN.closebox3,SPAN.closebox4
##A[target='_blank'] > IMG[width='100%'][src*='.gif']
##body.chapter > div.container div.slide-baidu *
##ASIDE[id^='custom_html-']
##DIV.code-block[style='margin: 8px 0; clear: both;']
##DIV[style^='position: fixed; bottom: 50%; z-index: 19999 !important; ']
##DIV[class*='id_ads__']
##DIV#recommend-float.player-recommend-float > a
##body.page.player > DIV.shortcuts-mobile-overlay
##body.page.player > div.popup.popup-tips.popup-icon.open
##div.player-rm.rm-two.rm-list > a
##A[href='/statics/js/ky-a.html']
##DIV[class*='home'][class*='Ads']
##div[class*='bookid_ads']
##div[id] > div[style*='z-index: 2147483647; width: 100vw; background: url']
##div#content.content div[id] > DIV[style*='z-index: 2147483647']
##div#apage.apage > div > ul > li > a
##div.module-list-right-title-wrap > div.normal-title-wrap > div > a
##div#beijing.article_content.layui-clear > div.left > div > a
##ul#page-list.layui-clear.page-wz > ul > li:not([class])
##body.no_overflow strong
##DIV[style='position: fixed; bottom: 0px; left: 0px; width: 100%; height: 5.85rem; z-index: 99999;']
##A[href*='//v.wanfumei.net']
##IMG[src='/js/imgs/taote.jpg']
###imgad
##IMG[src*='//img4.qv1.ru/data/game/']
##IMG[src*='/ds3/ssmh/']
##IMG[src='/adBanner']
##div.slide-baidu IMG[src='/images/aw1.gif']
##div#gmright
##[style='top: 0vw; display: block;']
##[style='top: 8.2vw; display: block;']
##[style='top: 16.4vw; display: block;']
##[style='top: 24.6vw; display: block;']
##DIV[style*='animation: 1s ease 0.2s infinite normal none running shakegwegs; z-index:'][style*='background: url']
##INS.adsbygoogle
##body#nr_body div.fixed ~ *
##[style='width: 100%; height: auto; position: fixed; left: 0px; top: 0px; z-index: 2147483647;']
##[style='width: 100%; height: 123.75px;']
##A[href*='/adjump/?']
##IMG[alt='五一特惠']
##[ad_dot_url]
##DIV#pos_nei_content
##[src*='zdmbl.xyz']
##I.fa.fa-close
##IMG#diads
##[style='display: block; width: 100%; left: 0px; position: fixed; z-index: 2147483646; height: 49px; bottom: 132px;']
##body.fed-min-width.website-read > [style='bottom: 132px;']
##center > div.hengfu
##DIV.ad-content
##div.layout-box a > IMG[src*='.gif']
##div.stui-player.col-pd DIV[style='text-align:center']
##div#hengfu_wap_vod_xia > a
##div.maomi-content A[href='/baidu/index.html']
##section > SPAN[style='display: block; clear: both; overflow: hidden;']
##[style^='position: fixed; bottom: 20%; z-index: 19999 !important; ']
##div.mobile > div.content IMG[src*='.gif']
##[style*='width: 100% !important; margin: 0px !important; padding: 0px !important; display: flex !']
##body#nr_body.nr_all.c_nr > div > div[id][class] > [href]
##[style='text-align: center; margin: 40px 0; color: blue; font-size: larger;']
##[style*='line-height: 115px; left: 0px; z-index: 0; width: 100vw; background: url']
##DIV[style='position: fixed; line-height: 100vh; width: 100vw; top: 0px; left: 0px;']
##[style='width: 100%;height:660px;z-index:2147483647;position:fixed;display:block;bottom:0px;']
##IMG[src^='http://socos.gitee.io/ss/poster'][alt][style='width: 100%;']
##IMG[src*='qmfcybwbf']
##[href*='.top/?token=']
##div.appad
##[src^="https://img.sobot.com/chatres/"][title="sb"]
##[style='z-index: 99999; text-indent: -10em;position: relative; left: 0px;box-sizing: border-box;']
##a[href^="/ad.html?url="]
##html.wap [style='left: 40%;']
##body > DIV[style='bottom: 130px;']
##[style^='position: fixed; z-index: 2147483616; width: 10%; height: 32.5px;']
##body#wrapper A[ontouchstart='this.click();']
##DIV.row.no-gutters.m-0
##DIV#top-ads
##[style*='width: 100vw; background: url'][style$='no-repeat; position: fixed;'][style*='0px 0px / 100vw ']
##A#floating-banner
##[style$='display:block;width:9.6vw;height:8.5vw;background: #000;opacity:0.01;']
##DIV.loc_banner.only-app
##div.swiper-slide > A[rel='nofollow noopenner']
##div#liveline > l,div#liveline > ll
##DIV.duilian[style*='z-index: 9999; top: 0px; ']
##div#header-wrapper.header_b > div#header
##a[href^="https://91keep.tv"]
##DIV#bottom-ads
##section.wrap > section.f0
##DIV#googleads-popup.popup.visible
##DIV[style='clear: both; position: relative; width: 396px; height: 130px;']
##[style*='display: block; width: 100%; left: 0px; position: fixed; z-index: 2147'][style*='bottom: 132px;']
##div#nr_body.nr_all.c_nr div.show-app2
##[style^='position: fixed; color: transparent; line-height: 100vh; width: 100vw; z-index: '][style*='; top: 0px; left: 0px;']
##a[href*=".com?s="]
##div.my-ad > a
##div#playlistbtn > A[href='/ht.html']
##INS[status='done'] A.external
##body > div#bottommob.bottommob
##DIV#xfb_lbox.zoomout_transition.zoomout
##A[href^='https://icrwt696.com']
##A[href^='https://k.izret.com']
##div.am-gallery-item > a
##div.poi-row IMG[width='950'][height='300'][style='max-width:100%;height:auto']
##div.inn-content-reseter > a > IMG[decoding='async'][loading='lazy']
##DIV[style*='!important; color: transparent !important; font-size: 0px !important; text-indent: -10000px !important; line-height: 0px !important; height: 150px !important;']
##div#page-back DIV.container.clearfix div > A > IMG[src]
##section.global_video_bottom_dbtc
##A[href^='https://www.ids20.co']
##A[href^='https://www.pcjx365.com']
##IMG[style='height:120px;width:100%;'][src*='/sucai/']
##DIV[style^='box-sizing: border-box; position: relative; left: 0px; z-index: 214748']
##A > IMG[alt][src*='resources/images/']
##A[rel='nofollow noopener'][href*='/game/xr/?attributionId=']
##DIV.bot-per.visible-xs.visible-sm *
##div.maomi-content > SECTION.section.section-banner
##DIV[style='width: 100%;background-color: black;color: white;padding: 15px 0;']
##IMG.lazyload[src='/statics/img/load.gif']
##[src^='https://immmg.owowqrf.cn']
##A[href^='https://v.frthv.com']
##A[href*='-fghgdf.com']
##A[href*='-fghhjj.com']
###mobile-ad.hidden-md
##.scaled-juicyads
##DIV.div_sticky2.hidden-lg
##DIV.bottom-ad.hidden-lg
##[href^='https://uod217.com/']
##DIV[style*='px; bottom: 0px; left: 0px; animation: 1.5s ease 0.2s infinite normal none running shakegwegs; z-index:']
##IMG[src*='tupian.guanggao']
##A[href='/iwagbwfiwehaeyh/']
##[href^='https://down.erperweima.top/']
##IMG[src^='https://dzfzfv.xyz/']
##body#read.read DIV[style$=' width: 100vw; position: relative;']
##IMG[src$='tywheying/vv2-960x80.gif']
##DIV[style='background-color: rgb(249, 249, 249); display: flex; align-items: center; justify-content: center;']
##[src^='data:image/png;base64,iVBORw0KGgoAAAANSU'][style*='position: fixed; z-index: 2000000000; width: 30px; bottom:']
##DIV[allowtransparency='true'][scrolling='no']
##DIV.advertisingConfiguration
##[src='/static/ads.png']
##ul.thread_detail_ads
##[style='position:relative !important;padding:0px !important;margin:0px !important;line-height:1 !important;']
##DIV.swiper2.swiper-initialized.swiper-horizontal
##[src^='/static/resources/lp.php'][style^='max-width: 100%; transform-origin: left top;']
##DIV[style^='display: block; aspect-ratio: 728 / 90; background-image: url("/static/resources/lp.php']
##[style$=' 0% 0% / 100% no-repeat; height: 130px; width: 100%; position: relative;']
##IMG[src*='qimanwu_wap/static/adimages/']
##div#main.main.read_page [id^="set_adds"]
##div.container.ff-bg > div.row.ff-row.slide
##P[style*='!important; color: transparent !important; font-size: 0px !important; text-indent: -10000px !important;']
##DIV[style*='px; top: 0px; left: 0px; z-index: '][style*='http']
##DIV[style='position: fixed; color: transparent; line-height: 100vh; width: 100vw; z-index: 288; top: 0px; left: 0px;']
##[href^='https://mtyshi.com/']
##A[href*='exuvu.com']
##A[href*='xzzkx.com']
##DIV#wwads
##DIV[style$='display:block;width:9.6vw;height:7.96875vw;background:#000;opacity:0.01;']
##A[href*='ds2f1sd31g.vip']
##IMG.playVideo-checkin-img
##DIV.playVideo-centerAd
##[href*='anrvl.com']
##[href*='zthbe.com']
##IMG[onclick='godown()'][src$='gif']
##IMG[src='https://tanju.vip/wapxiezi.png']
##[href*='snnrb.com']
##A.wrapper_bg_c.hidden-xs
##[class][style*='px; top: 0px; left: 0px; z-index'][style$='width: 100vw; position: fixed;']
##[class][style*='px; top: 0px; left: 0px; z-index'][style$='width: 100vw; position: relative;']
##[class][style*='px; bottom: 0px; left: 0px; z-index'][style$='width: 100vw; position: fixed;']
##[href*='slkdnlkfnskl.com']
##.globalPadding
##.adwap
##[href^='https://31jrx5y7.com/']
##[href*='pojuko.buzz']
##[src^='https://kykqss.xyz']
##[rel='nofollow'][href^='/book/baidu_verify_code']
##DIV[style$='display:block;width:9.6vw;height:7.96875vw;background: #000;opacity:0.01;']
##DIV[style='position: fixed; left: 0px; bottom: 0px; width: 100%; height: 120px; z-index: 2147483647 !important;']
##A[href*='jdbfknsbkldns.com']
##a[href*='html?channelCode'] > IMG[src*='.gif'][width='100%']
##A[href*='com:'] > IMG[src],A[href*='cc:'] > IMG[src]
##div#h2_player_prevideo > A[href][target='_blank']
##body#reader-m-fix IMG[src*='.gif'][style='width:100%;height:100%']`;

const input2 = `##div#h2_player_prevideo > A[href][target='_blank'],body#reader-m-fix IMG[src*='.gif'][style='width:100%;height:100%'],img#hth[onclick$="hth.html')"],#imgad,div#gmright,[style='top: 0vw; display: block;'],[src*='zdmbl.xyz'],I.fa.fa-close,IMG#diads,div.layout-box a > IMG[src*='.gif'],div#hengfu_wap_vod_xia > a,div.mobile > div.content IMG[src*='.gif'],div.poi-row IMG[width='950'][height='300'][style='max-width:100%;height:auto'],body.viewbody div[id][class][style='height: 123.75px;'],[style*='px; top: 0px; left: 0px; z-index'][style$='width: 100vw; position: relative;'][style*='px; top: 0px; left: 0px; z-index'][style$='width: 100vw; position: relative;'],[style*='background-size: 400px 127px !important;'],[style*='background-size: 470px 149px !important;'],[style$='vw;background: #000;opacity:0.01;'],[style$='0% 0% / 100% no-repeat; height: 140px; width: 100%; position: relative;'],IMG[class][style='pointer-events: none;'][width='100%'],[style$='background:#000;opacity:0.01;'],[style$='overflow:hidden !important;font-size:0px !important;line-height:0px !important;'],[style$='background-size: 400px 125px !important;'],[style='position: fixed; line-height: 600vh; width: 100vw; top: 0px; left: 0px;'],[style='text-align: left;max-height: 150px;overflow: hidden;'],[style*='px; bottom: 0px; left: 0px; z-index'][style$='width: 100vw; position: fixed;'],[style*='background-size: 400px 112.64px !important;'],DIV[id][style='height: 125px;']`;


// 函数用来处理单个输入字符串并添加样式
function addCustomStyle(input) {
  // 移除前两个字符 ('##')，拼接它们为CSS选择器
  const selector = input.split('\n').map(line => line.slice(2)).join(',');

  // 定义CSS规则
  const cssRule = `${selector} {display: none !important;visibility: hidden; opacity: 0; z-index: -999; width: 0; height: 0; pointer-events: none; position: absolute; left: -9999px; top: -9999px;}`;

  // 如果 GM_addStyle 函数存在，则应用样式
  if (typeof GM_addStyle === 'function') {
    GM_addStyle(cssRule);
  } else {
    console.error('GM_addStyle is not available. Ensure you are running this script in a userscript manager environment like Tampermonkey or Greasemonkey.');
  }
}

// 对每一个输入执行函数
addCustomStyle(input1);  // 为第一部分的选择器应用样式
addCustomStyle(input2);  // 为第二部分的选择器应用样式

        (function() {
            const FAKE_PLATFORM = 'Mac';
            const spoofNavigator = new Proxy(navigator, {
                get(target, prop) {
                    return prop === 'platform' ? FAKE_PLATFORM : Reflect.get(target, prop);
                },
                getOwnPropertyDescriptor(target, prop) {
                    if (prop === 'platform') {
                        return {
                            value: FAKE_PLATFORM,
                            writable: false,
                            configurable: true,
                            enumerable: true
                        };
                    }
                    return Object.getOwnPropertyDescriptor(target, prop);
                }
            });
            try {
                const descriptor = Object.getOwnPropertyDescriptor(navigator, 'platform');
                if (descriptor?.configurable) {
                    Object.defineProperty(navigator, 'platform', {
                        get: () => FAKE_PLATFORM,
                        configurable: true,
                        enumerable: true
                    });
                } else if (navigator.__defineGetter__) {
                    navigator.__defineGetter__('platform', () => FAKE_PLATFORM);
                }
                Object.defineProperty(window, 'navigator', {
                    value: spoofNavigator,
                    writable: false,
                    configurable: true
                });
                const protoDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'platform');
                if (protoDescriptor?.configurable) {
                    Object.defineProperty(Navigator.prototype, 'platform', {
                        get: () => FAKE_PLATFORM,
                        configurable: true,
                        enumerable: true
                    });
                }
                const originalIndexOf = String.prototype.indexOf;
                String.prototype.indexOf = function(searchString) {
                    if (this === FAKE_PLATFORM) {
                        if (searchString === 'Win' || searchString === 'Linux' || searchString === 'X11') return -1;
                        if (searchString === 'Mac') return 0;
                    }
                    return originalIndexOf.call(this, searchString);
                };

            } catch (e) {
                console.warn('Platform spoofing fallback:', e);
                window.navigator = spoofNavigator;
            }
            Object.freeze(window.navigator);
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    if (navigator.platform !== FAKE_PLATFORM) {
                        Object.defineProperty(window, 'navigator', {
                            value: spoofNavigator,
                            writable: false,
                            configurable: true
                        });
                        Object.freeze(window.navigator);
                    }
                }, {
                    once: true
                });
            }
        })();
 }

 // 根据保存的设置来启用或禁用弹出提示框功能
 if (isEnabled) {
 showAlert();
 }

 // 创建油猴菜单项，在菜单中添加“启用”和“禁用”选项
 GM_registerMenuCommand(isEnabled ? '禁用buff拦截' : '启用buff拦截', function() {
 isEnabled = !isEnabled;
 GM_setValue(storageKey, isEnabled);
 if (isEnabled) {
 showAlert();
 }
 });
})();