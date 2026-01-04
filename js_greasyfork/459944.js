// ==UserScript==
// @name         加多重buff的广告拦截脚本
// @author        ChatGPT
// @description  去广告脚本，可能有误杀，可以在脚本菜单禁用当前域名拦截
// @version       12.9
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @match         *://*/*
// @exclude *://dash.immersivetranslate.com/*
// @exclude *://www.kimi.com/*
// @exclude *://metaso.cn/*
// @exclude *://*.123pan.com/*
// @exclude *://*.123pan.cn/*
// @exclude *://*.123684.com/*
// @exclude *://*.123865.com/*
// @exclude *://*.123952.com/*
// @exclude *://*.123912.com/*
// @exclude *://grok.com/*
// @exclude *://www.colamanhua.com/*
// @exclude *://*.bing.com/*
// @exclude *://*.iqiyi.com/*
// @exclude *://*.qq.com/*
// @exclude *://*.v.qq.com/*
// @exclude *://*.sohu.com/*
// @exclude *://*.mgtv.com/*
// @exclude *://*.ifeng.com/*
// @exclude *://*.pptv.com/*
// @exclude *://*.sina.com.cn/*
// @exclude *://*.56.com/*
// @exclude *://*.cntv.cn/*
// @exclude *://*.tudou.com/*
// @exclude *://*.baofeng.com/*
// @exclude *://*.le.com/*
// @exclude *://*.pps.tv/*
// @exclude *://*.www.fun.tv/*
// @exclude *://*.baidu.com/*
// @exclude *://*.meipai.com/*
// @exclude *://*.ku6.com/*
// @exclude *://*.v1.cn/*
// @exclude *://*.baomihua.com/*
// @exclude *://*.wasu.cn/*
// @exclude *://*.aipai.com/*
// @exclude *://*.tvsou.com/*
// @exclude *://*.6.cn/*
// @exclude *://*.zhiyin.cn/*
// @exclude *://*.1905.com/*
// @exclude *://*.kankan.com/*
// @exclude *://*.douyu.com/*
// @exclude *://*.huya.com/*
// @exclude *://*.longzhu.com/*
// @exclude *://*.yy.com/*
// @exclude *://*.hao123.com/*
// @exclude *://*.kugou.com/*
// @exclude *://*.9xiu.com/*
// @exclude *://*.huomao.com/*
// @exclude *://*.yizhibo.com/*
// @exclude *://*.weibo.com/*
// @exclude *://*.vmovier.com/*
// @exclude *://*.bale.cn/*
// @exclude *://*.cuctv.com/*
// @exclude *://*.people.com.cn/*
// @exclude *://*.cctv.com/*
// @exclude *://*.jstv.com/*
// @exclude *://*.brtn.cn/*
// @exclude *://*.zjstv.com/*
// @exclude *://*.iqilu.com/*
// @exclude *://*.gdtv.com.cn/*
// @exclude *://*.ahtv.cn/*
// @exclude *://*.tvb.com/*
// @exclude *://*.tvmao.com/*
// @exclude *://*.douban.com/*
// @exclude *://*.mtime.com/*
// @exclude *://*.163.com/*
// @exclude *://*.bilibili.com/*
// @exclude *://*.www.gov.cn/*
// @exclude *://*.kumi.cn/*
// @exclude *://*.61.com/*
// @exclude *://*.u17.com/*
// @exclude *://*.stnn.cc/*
// @exclude *://*.huanqiu.com/*
// @exclude *://*.cankaoxiaoxi.com/*
// @exclude *://*.takungpao.com/*
// @exclude *://*.thepaper.cn/*
// @exclude *://*.xinhuanet.com/*
// @exclude *://*.chinanews.com/*
// @exclude *://*.southcn.com/*
// @exclude *://*.wenming.cn/*
// @exclude *://*.81.cn/*
// @exclude *://*.china.com/*
// @exclude *://*.cnr.cn/*
// @exclude *://*.cri.cn/*
// @exclude *://*.youth.cn/*
// @exclude *://*.71.cn/*
// @exclude *://*.qdaily.com/*
// @exclude *://*.k618.cn/*
// @exclude *://*.infzm.com/*
// @exclude *://*.legaldaily.com.cn/*
// @exclude *://*.cyol.net/*
// @exclude *://*.bjnews.com.cn/*
// @exclude *://*.wenweipo.com/*
// @exclude *://*.12371.cn/*
// @exclude *://*.gmw.cn/*
// @exclude *://*.hsw.cn/*
// @exclude *://*.dahe.cn/*
// @exclude *://*.nfcmag.com/*
// @exclude *://*.chinadaily.com.cn/*
// @exclude *://*.gxnews.com.cn/*
// @exclude *://*.xfrb.com.cn/*
// @exclude *://*.ycwb.com/*
// @exclude *://*.sxrb.com/*
// @exclude *://*.dbw.cn/*
// @exclude *://*.fjsen.com/*
// @exclude *://*.dzwww.com/*
// @exclude *://*.cnhubei.com/*
// @exclude *://*.oeeee.com/*
// @exclude *://*.cqnews.net/*
// @exclude *://*.inewsweek.cn/*
// @exclude *://*.yangtse.com/*
// @exclude *://*.lifeweek.com.cn/*
// @exclude *://*.kankanews.com/*
// @exclude *://*.cpd.com.cn/*
// @exclude *://*.haiwainet.cn/*
// @exclude *://*.banyuetan.org/*
// @exclude *://*.cnautonews.com/*
// @exclude *://*.yidianzixun.com/*
// @exclude *://*.sinovision.net/*
// @exclude *://*.un.org/*
// @exclude *://*.cnn.com/*
// @exclude *://*.tianya.cn/*
// @exclude *://*.crntt.com/*
// @exclude *://*.tiexue.net/*
// @exclude *://*.kdnet.net/*
// @exclude *://*.m4.cn/*
// @exclude *://*.ifengweekly.com/*
// @exclude *://*.guancha.cn/*
// @exclude *://*.aisixiang.com/*
// @exclude *://*.qidian.com/*
// @exclude *://*.faloo.com/*
// @exclude *://*.readnovel.com/*
// @exclude *://*.hongxiu.com/*
// @exclude *://*.xxsy.net/*
// @exclude *://*.fmx.cn/*
// @exclude *://*.xs8.cn/*
// @exclude *://*.jjwxc.net/*
// @exclude *://*.zongheng.com/*
// @exclude *://*.kanshu.com/*
// @exclude *://*.zhulang.com/*
// @exclude *://*.19lou.com/*
// @exclude *://*.17k.com/*
// @exclude *://*.3gsc.com.cn/*
// @exclude *://*.heiyan.com/*
// @exclude *://*.qdmm.com/*
// @exclude *://*.hongshu.com/*
// @exclude *://*.motie.com/*
// @exclude *://*.kujiang.com/*
// @exclude *://*.shuhai.com/*
// @exclude *://*.xiang5.com/*
// @exclude *://*.hbooker.com/*
// @exclude *://*.lkong.net/*
// @exclude *://*.txtbook.com.cn/*
// @exclude *://*.ximalaya.com/*
// @exclude *://*.lrts.me/*
// @exclude *://*.qingting.fm/*
// @exclude *://*.tingbook.com/*
// @exclude *://*.zhihu.com/*
// @exclude *://*.nlc.cn/*
// @exclude *://*.docin.com/*
// @exclude *://*.storychina.cn/*
// @exclude *://*.duokan.com/*
// @exclude *://*.jianshu.com/*
// @exclude *://*.dangdang.com/*
// @exclude *://*.migu.cn/*
// @exclude *://*.amazon.cn/*
// @exclude *://*.newsmth.net/*
// @exclude *://*.voc.com.cn/*
// @exclude *://*.mop.com/*
// @exclude *://*.xici.net/*
// @exclude *://*.news.cn/*
// @exclude *://*.oneniceapp.com/*
// @exclude *://*.hupu.com/*
// @exclude *://*.taobao.com/*
// @exclude *://*.renren.com/*
// @exclude *://*.kaixin001.com/*
// @exclude *://*.muyewx.com/*
// @exclude *://*.renhe.cn/*
// @exclude *://*.blogchina.com/*
// @exclude *://*.trueme.net/*
// @exclude *://*.bokee.com/*
// @exclude *://*.hexun.com/*
// @exclude *://*.cnblogs.com/*
// @exclude *://*.cnstock.com/*
// @exclude *://*.eastmoney.com/*
// @exclude *://*.lofter.com/*
// @exclude *://*.baike.com/*
// @exclude *://*.duitang.com/*
// @exclude *://*.guokr.com/*
// @exclude *://*.360doc.com/*
// @exclude *://*.qiushibaike.com/*
// @exclude *://*.paidai.com/*
// @exclude *://*.hualongxiang.com/*
// @exclude *://*.rednet.cn/*
// @exclude *://*.xmfish.com/*
// @exclude *://*.liba.com/*
// @exclude *://*.hefei.cc/*
// @exclude *://*.cnnb.com/*
// @exclude *://*.qingdaonews.com/*
// @exclude *://*.taihe.com/*
// @exclude *://*.kuwo.cn/*
// @exclude *://*.1ting.com/*
// @exclude *://*.9ku.com/*
// @exclude *://*.9sky.com/*
// @exclude *://*.yue365.com/*
// @exclude *://*.xiami.com/*
// @exclude *://*.vvvdj.com/*
// @exclude *://*.5ydj.com/*
// @exclude *://*.dj97.com/*
// @exclude *://*.ik123.com/*
// @exclude *://*.djye.com/*
// @exclude *://*.y2002.com/*
// @exclude *://*.yinyuetai.com/*
// @exclude *://*.letv.com/*
// @exclude *://*.guqu.net/*
// @exclude *://*.changba.com/*
// @exclude *://*.a8.com/*
// @exclude *://*.mvbox.cn/*
// @exclude *://*.tan8.com/*
// @exclude *://*.musicool.cn/*
// @exclude *://*.ccshao.com/*
// @exclude *://*.besgold.com/*
// @exclude *://*.moofeel.com/*
// @exclude *://*.douban.fm/*
// @exclude *://*.kaolafm.com/*
// @exclude *://*.zol.com.cn/*
// @exclude *://*.pconline.com.cn/*
// @exclude *://*.pcpop.com/*
// @exclude *://*.imobile.com.cn/*
// @exclude *://*.cnmo.com/*
// @exclude *://*.it168.com/*
// @exclude *://*.gfan.com/*
// @exclude *://*.feng.com/*
// @exclude *://*.xiaomi.cn/*
// @exclude *://*.ip138.com/*
// @exclude *://*.10086.cn/*
// @exclude *://*.10010.com/*
// @exclude *://*.win001.com.cn/*
// @exclude *://*.qimao.com/*
// @exclude *://*.ciweimao.com/*
// @exclude *://*.sina.cn/*
// @exclude *://*.zhangyue.com/*
// @exclude *://*.shuqi.com/*
// @exclude *://*.tadu.com/*
// @exclude *://*.luochu.com/*
// @exclude *://*.360.cn/*
// @exclude *://*.qwsy.com/*
// @exclude *://*.cmread.com/*
// @exclude *://*.ruochu.com/*
// @exclude *://*.luochen.com/*
// @exclude *://*.3g.cn/*
// @exclude *://*.shucong.com/*
// @exclude *://*.qrxs.cn/*
// @exclude *://*.10000read.com/*
// @exclude *://*.tiandizw.com/*
// @exclude *://*.qingoo.cn/*
// @exclude *://*.zhangwen.cn/*
// @exclude *://*.xmkanshu.com/*
// @exclude *://*.hnquxing.com/*
// @exclude *://*.51changdu.cn/*
// @exclude *://*.mingqingxiaoshuo.com/*
// @exclude *://*.china.com.cn/*
// @exclude *://*.jcrb.com/*
// @exclude *://*.cfi.cn/*
// @exclude *://*.cyol.com/*
// @exclude *://*.chnews.net/*
// @exclude *://*.cngold.org/*
// @exclude *://*.anhuinews.cc/*
// @exclude *://*.huxiu.com/*
// @exclude *://*.winshang.com/*
// @exclude *://*.eastday.com/*
// @exclude *://*.leju.com/*
// @exclude *://*.10jqka.com.cn/*
// @exclude *://*.fx678.com/*
// @exclude *://*.m.fun.tv/*
// @exclude *://*.acfun.cn/*
// @exclude *://*.znds.com/*
// @exclude *://*.km.com/*
// @exclude *://*.huajiao.com/*
// @exclude *://*.zhibo8.cc/*
// @exclude *://*.kanman.com/*
// @exclude *://*.dongmanmanhua.cn/*
// @exclude *://*.mkzhan.com/*
// @exclude *://*.manhuatai.com/*
// @exclude *://*.kuaikanmanhua.com/*
// @exclude *://*.dm5.com/*
// @exclude *://*.iyouman.com/*
// @exclude *://*.manhuadao.cn/*
// @exclude *://*.shenmantang.com/*
// @exclude *://*.manmanapp.com/*
// @exclude *://*.kumanhua.net/*
// @exclude *://*.xinmanhua.net/*
// @exclude *://*.bymanhua.com/*
// @exclude *://*.kaimanhua.com/*
// @exclude *://*.isamanhua.com/*
// @exclude *://*.sfacg.com/*
// @exclude *://*.myfcomic.com/*
// @exclude *://*.shenglifubang.cn/*
// @exclude *://*.soudongman.com/*
// @exclude *://*.qiremanhua.com/*
// @exclude *://*.buka.cn/*
// @exclude *://*.taomanhua.com/*
// @exclude *://*.yizhikan.com/*
// @exclude *://*.zymk.cn/*
// @exclude *://*.chjak.cn/*
// @exclude *://*.ixigua.com/*
// @exclude *://*.diyidan.com/*
// @exclude *://*.1kkk.com/*
// @exclude *://*.4399dmw.com/*
// @exclude *://*.manmankan.com/*
// @exclude *://*.17173.com/*
// @exclude *://*.78dm.net/*
// @exclude *://*.manben.com/*
// @exclude *://*.gdtv.cn/*
// @exclude *://*.m1905.com/*
// @exclude *://*.lcread.com/*
// @exclude *://*.sxcnw.net/*
// @exclude *://*.lingyun5.com/*
// @exclude *://*.laikan.com/*
// @exclude *://*.ihuaben.com/*
// @exclude *://*.4yt.net/*
// @exclude *://*.bayueju.com/*
// @exclude *://*.zuitang.com/*
// @exclude *://*.iyunyue.com/*
// @exclude *://*.fbook.net/*
// @exclude *://*.so.com/*
// @exclude *://*.nipic.com/*
// @exclude *://*.npc.gov.cn/*
// @exclude *://*.ltaaa.com/*
// @exclude *://*.zuowen.com/*
// @exclude *://*.rain8.com/*
// @exclude *://*.pingshu8.com/*
// @exclude *://*.yymp3.com/*
// @exclude *://*.5nd.com/*
// @exclude *://*.mtv123.com/*
// @exclude *://*.yy8844.cn/*
// @exclude *://*.djkk.com/*
// @exclude *://*.ce.cn/*
// @exclude *://*.cac.gov.cn/*
// @exclude *://*.chinanews.com.cn/*
// @exclude *://*.dayoo.com/*
// @exclude *://*.shenchuang.com/*
// @exclude *://*.cqwb.com.cn/*
// @exclude *://*.sznews.com/*
// @exclude *://*.zjol.com.cn/*
// @exclude *://*.sh.cn/*
// @exclude *://*.xilu.com/*
// @exclude *://*.miercn.com/*
// @exclude *://*.nba.com/*
// @exclude *://*.yicai.com/*
// @exclude *://*.caixin.com/*
// @exclude *://*.zgjrjw.com/*
// @exclude *://*.eeo.com.cn/*
// @exclude *://*.nbd.com.cn/*
// @exclude *://*.guandian.cn/*
// @exclude *://*.chinavalue.net/*
// @exclude *://*.chinaventure.com.cn/*
// @exclude *://*.ebusinessreview.cn/*
// @exclude *://*.iceo.com.cn/*
// @exclude *://*.jjckb.cn/*
// @exclude *://*.cb.com.cn/*
// @exclude *://*.dmkb.net/*
// @exclude *://*.iheima.com/*
// @exclude *://*.titan24.com/*
// @exclude *://*.sport.gov.cn/*
// @exclude *://*.cba.net.cn/*
// @exclude *://*.thecfa.cn/*
// @exclude *://*.lottery.gov.cn/*
// @exclude *://*.nowscore.com/*
// @exclude *://*.7m.cn/*
// @exclude *://*.leisu.com/*
// @exclude *://*.gooooal.com/*
// @run-at        document-start
// @namespace     https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/459944/%E5%8A%A0%E5%A4%9A%E9%87%8Dbuff%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459944/%E5%8A%A0%E5%A4%9A%E9%87%8Dbuff%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前网站URL，并根据其生成一个唯一的存储键
    var storageKey = window.location.hostname;

    // 根据存储键获取已保存的设置（如果存在）
    var isEnabled = GM_getValue(storageKey, true);

    // 获取禁用的网站列表
    var disabledSites = GM_getValue('disabledSites', '').split('\n').filter(Boolean);

    // 显示浮态层编辑界面
    function showEditDialog() {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#ffffff';
        dialog.style.padding = '20px';
        dialog.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        dialog.style.borderRadius = '8px';
        dialog.style.zIndex = '10000';
        dialog.style.fontFamily = 'Arial, sans-serif';
        dialog.style.width = '400px';
        dialog.style.maxWidth = '90%';

        const title = document.createElement('h3');
        title.textContent = '编辑禁用的网站列表';
        title.style.marginTop = '0';
        title.style.fontSize = '18px';
        title.style.color = '#333';
        dialog.appendChild(title);

        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '200px';
        textarea.style.padding = '10px';
        textarea.style.border = '1px solid #ddd';
        textarea.style.borderRadius = '4px';
        textarea.style.fontSize = '14px';
        textarea.style.marginBottom = '10px';
        textarea.style.boxSizing = 'border-box';
        textarea.style.resize = 'vertical';
        textarea.value = disabledSites.join('\n');

        // 添加提示文本
        const placeholderText = '请输入要禁用的网站域名，每行一个。\n例如：\nexample.com\nanotherexample.com';
        if (!textarea.value) {
            textarea.value = placeholderText;
            textarea.style.color = '#888'; // 提示文本颜色
        }

        // 当用户开始输入时，清除提示文本
        textarea.addEventListener('focus', function () {
            if (textarea.value === placeholderText) {
                textarea.value = '';
                textarea.style.color = '#333'; // 正常文本颜色
            }
        });

        // 当用户离开输入框且未输入内容时，恢复提示文本
        textarea.addEventListener('blur', function () {
            if (textarea.value.trim() === '') {
                textarea.value = placeholderText;
                textarea.style.color = '#888'; // 提示文本颜色
            }
        });

        dialog.appendChild(textarea);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.padding = '8px 16px';
        saveButton.style.backgroundColor = '#007bff';
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontSize = '14px';
        saveButton.onclick = function () {
            disabledSites = textarea.value.split('\n').filter(Boolean);
            GM_setValue('disabledSites', disabledSites.join('\n'));
            document.body.removeChild(dialog);
        };
        buttonContainer.appendChild(saveButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.backgroundColor = '#6c757d';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontSize = '14px';
        cancelButton.onclick = function () {
            document.body.removeChild(dialog);
        };
        buttonContainer.appendChild(cancelButton);

        dialog.appendChild(buttonContainer);

        document.body.appendChild(dialog);
    }

    function showAlert() {
        (function () {
            var g_times = 0,
                itids = [],
                timer;

            function myfun() {
                //隐藏元素
                itids.push(
                    setTimeout(function () {
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
                setTimeout(function () {
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
##body#reader-m-fix IMG[src*='.gif'][style='width:100%;height:100%']
##[href*='baidugg123.cc']
##.guding312
##[src$='anyhosthub-480x90.gif']
##[href^='https://www.jumbobag.cn']
##body#nr_body #appss
##body#nr_body [onclick='goAppHtml();']
##[style='display: block; width: 100%; height: 125px; background-size: 100% 100%;']
##DIV[style='position: absolute; inset: 0px; background: rgba(0, 0, 0, 0);']
##DIV[class][id][style$='px; background-size: 400px 127px !important;']
##[onclick*='fjbglfrv.com']
##[style='z-index: 2147483647; width: 100%;height: auto;left: 0;right: 0;margin: auto;']
##DIV[style='position:relative !important;padding:0px !important;margin:0px !important;width:100% !important;overflow:hidden !important;font-size:0px !important;line-height:0px !important;']
##DIV.theme-hope-content.ads-container
##[href*='amu6v.com']
##.vp-project-home > .ads-container
##A.gotoclick[adv_id]
##[onclick='goAppHtml();']
##.ads-bg.ads-bg-home
###kp-hid-sport-m.fed-part-layout.fed-back-whits.fed-hide-md.uk-alert
###bc_dp_m
##DIV#playlistbtn[style='padding: 10px;']
##DIV#appss[style='padding:15px;']
##body.conch-adjust-fix #component
##IFRAME[src^='/Banner/index.html'][allowfullscreen='true']
##div#notice_container > div.event-notice > div.modal
##[style^='display: block; z-index: 2147483646; width: 17px; ']
##[style^='display: block; z-index: 2147483646; width: 10%;']
##[src^='https://369x520.com']
##[href*='3400.org']
##.cpcad
##[style$='width:9.6vw;height:6.40625vw;background: #000;opacity:0.01;']
##body#read.read > a.appguide-wrap
##[onclick*='m.kanshuapp.net']
##.read-container [onclick='goAppHtml();']
##[src*="tif"][style="width:100%;height:120px"],[src*="tif"][onerror="this.style.display=\'none\'"]`;

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

        // 常量定义
        const FAKE_PLATFORM = 'Mac';

        // 创建一个代理对象，用于拦截 navigator 的属性访问
        const createSpoofNavigator = () => {
            return new Proxy(navigator, {
                get(target, prop) {
                    if (prop === 'platform') {
                        return FAKE_PLATFORM;
                    }
                    return typeof target[prop] === 'function'
                        ? target[prop].bind(target)
                        : target[prop];
                },

                getOwnPropertyDescriptor(target, prop) {
                    if (prop === 'platform') {
                        return {
                            value: FAKE_PLATFORM,
                            writable: false,
                            configurable: true,
                            enumerable: true,
                        };
                    }
                    return Object.getOwnPropertyDescriptor(target, prop);
                },
            });
        };

        // 修改 navigator.platform 属性
        const modifyNavigatorPlatform = () => {
            try {
                if (Object.getOwnPropertyDescriptor(navigator, 'platform')) {
                    navigator.__defineGetter__('platform', () => FAKE_PLATFORM);
                } else {
                    Object.defineProperty(navigator, 'platform', {
                        get: () => FAKE_PLATFORM,
                        configurable: true,
                        enumerable: true,
                    });
                }
            } catch (e) {
                console.warn('Failed to modify navigator.platform:', e);
            }
        };

        // 修改 window.navigator 和 Navigator.prototype
        const modifyWindowNavigator = (spoofNavigator) => {
            try {
                Object.defineProperty(window, 'navigator', {
                    value: spoofNavigator,
                    writable: false,
                    configurable: true,
                });

                Object.defineProperty(Navigator.prototype, 'platform', {
                    get: () => FAKE_PLATFORM,
                    configurable: true,
                    enumerable: true,
                });
            } catch (e) {
                console.warn('Failed to modify window.navigator:', e);
            }
        };

        // 修改 String.prototype.indexOf 方法
        const modifyStringIndexOf = () => {
            const originalIndexOf = String.prototype.indexOf;
            String.prototype.indexOf = function (searchString) {
                if (this === FAKE_PLATFORM) {
                    if (searchString === 'Win' || searchString === 'Linux' || searchString === 'X11') {
                        return -1;
                    }
                    if (searchString === 'Mac') {
                        return 0;
                    }
                }
                return originalIndexOf.apply(this, arguments);
            };
        };

        // 主函数：执行所有修改
        const main = () => {
            const spoofNavigator = createSpoofNavigator();
            modifyNavigatorPlatform();
            modifyWindowNavigator(spoofNavigator);
            modifyStringIndexOf();

            // 冻结 navigator 对象，防止进一步修改
            Object.freeze(window.navigator);

            // 确保在 DOM 加载前生效
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    Object.defineProperty(window, 'navigator', {
                        value: spoofNavigator,
                        writable: false,
                    });
                });
            }
        };

        // 执行主函数
        main();
    }

    // 根据保存的设置来启用或禁用弹出提示框功能
    if (isEnabled && !disabledSites.includes(window.location.hostname)) {
        showAlert();
    }

    // 创建油猴菜单项，在菜单中添加“启用”和“禁用”选项
    GM_registerMenuCommand(isEnabled ? '禁用buff拦截' : '启用buff拦截', function () {
        isEnabled = !isEnabled;
        GM_setValue(storageKey, isEnabled);
        if (isEnabled) {
            showAlert();
        }
    });

    // 创建油猴菜单项，用于编辑禁用的网站列表
    GM_registerMenuCommand('编辑禁用的网站列表', showEditDialog);
})();