// ==UserScript==
// @name         硕鼠一键视频解析
// @version      1.1
// @author       猫不理
// @namespace    https://www.flvcd.com/index.htm
// @license      MIT
// @description  调用硕鼠网站解析网页中的视频，支持解析国内各类主流视频网站、综合网站、教育网站、MV音频网站、网络电视台、游戏网站、体育网站以及部分国外视频网站的视频，支持网站列表截至2023.05.14
// @match        *://tv.sohu.com/v/*
// @match        *://www.letv.com/ptv/vplay/*
// @match        *://www.ku6.com/video/detail?id=*
// @match        *://www.56.com/*/*
// @match        *://c.m.163.com/news/v/*
// @match        *://share.tangdou.com/h5/play?vid=*
// @match        *://weibo.com/tv/show/*
// @match        *://www.miaopai.com/show/*
// @match        *://www.meipai.com/media/*
// @match        *://m.eyepetizer.net/u1/*
// @match        *://www.ixigua.com/*
// @match        *://www.bilibili.com/video/*
// @match        *://haokan.baidu.com//v?vid=*
// @match        *://krcom.cn/*/episodes/*
// @match        *://www.pearvideo.com/video_*
// @match        *://v.douyin.com/*/*
// @match        *://www.365yg.com/group/*
// @match        *://video.mtime.com/*/*
// @match        *://www.boosj.com/*.html
// @match        *://movie.douban.com/trailer/*
// @match        *://www.news.cn/*/*
// @match        *://www.v1.cn/video/*
// @match        *://v.tom.com/*/*
// @match        *://video.baomihua.com/*/*
// @match        *://www.ouou.com/article/index/id/*/cid/*
// @match        *://finance.ce.cn/*/*
// @match        *://www.cuctv.com/*/*
// @match        *://art.china.cn/shipin/*
// @match        *://www.kankanews.com/*/*
// @match        *://www.pinshan.com/*/*
// @match        *://apiapp.people.cn/*/*
// @match        *://www.yicai.com/video/*
// @match        *://www.jiemian.com/video/*
// @match        *://www.huxiu.com/article/*
// @match        *://www.yizhibo.com/l/*
// @match        *://www.zhihu.com/zvideo/*
// @match        *://www.zhanqi.tv/v2/videos/*
// @match        *://v.autohome.com.cn/*
// @match        *://wx.vzan.com/live/*
// @match        *://live.ddeliveu.com/live/*
// @match        *://zj.cztv.live/live/page/*
// @match        *://www.huajiao.com/l/*
// @match        *://mparticle.uc.cn/video.html?*
// @match        *://www.skypixel.com/videos/*
// @match        *://bbs.mihoyo.com/ys/article/*
// @match        *://www.yy.com/sv/*
// @match        *://www.koushare.com/video/videodetail/*
// @match        *://www.wasu.cn/Play/show/id/*
// @match        *://art.sclsje.com/share/detail/video_out.html?*
// @match        *://mp.weixin.qq.com/s?*
// @match        *://roadshow.eastmoney.com/luyan/*
// @match        *://www.docuchina.cn/*/*
// @match        *://video.mct.gov.cn/v.html?id=*
// @match        *://tieba.baidu.com/p/*
// @match        *://yidumen.cn/chatroom/*/*
// @match        *://www.360kuai.com/*
// @match        *://tv.81.cn/*/*
// @match        *://wap.che.360.cn/share/h5/detail/*
// @match        *://www.ntv.cn/*/*
// @match        *://video.caixin.com/*/*
// @match        *://roadshow.sseinfo.com/roadshowIndex.do?id=*
// @match        *://live.baidu.com/m/media/pclive/pchome/live.html?room_id=*
// @match        *://www.fuyinfm.com/content/view/movid/*
// @match        *://rs.p5w.net/html/*
// @match        *://www.pdnews.cn/video/*
// @match        *://www.cantonfair.org.cn/zh-CN/eventShows/*
// @match        *://www.zaobao.com/*/*
// @match        *://www.chinanews.com.cn/*/*
// @match        *://www.yangtse.com/content/*
// @match        *://www.lontv.cn/index.php?*
// @match        *://www.dongchedi.com/video/*
// @match        *://tv.southcn.com/*/*
// @match        *://yn.chinadaily.com.cn/*/*
// @match        *://www.qlwb.com.cn/videoDetail/*
// @match        *://www.jingju.com/video_detail.php?id=*
// @match        *://baijiahao.baidu.com/s?id=*
// @match        *://m.dianping.com/smallvideo/*
// @match        *://v.ccdi.gov.cn/*/*
// @match        *://open.163.com/newview/movie/free?pid=*
// @match        *://www.zxx.edu.cn/syncClassroom/classActivity?activityId=*
// @match        *://new.hbeducloud.com/course/*
// @match        *://v.ucas.ac.cn/course/*
// @match        *://www.centv.cn/*/p/*
// @match        *://www.xuexi.cn/lgpage/detail/index.html?id=*
// @match        *://lv.ulikecam.com/*/*
// @match        *://www.wkzj.com/shared/*
// @match        *://zy.szedu.cn/*/*
// @match        *://mskzkt.jse.edu.cn/*/*
// @match        *://www.ahedu.cn/course/video.html?id=*
// @match        *://e.dxy.cn/broadcast/live/id/*/replay
// @match        *://v.91360.com/lectures/*
// @match        *://www.houdask.com/site/hd/resources/views/free/play.html?id=*
// @match        *://www.dangjian.cn/shouye/shipinxinwen/*
// @match        *://hezhibo.migucloud.com/watch/*
// @match        *://live.yanxiu.com/lv2/program/*/detail
// @match        *://www.scedu.com.cn/ThirdPortalService/html/indexNew/index.html#/detailVideo?as_id=*
// @match        *://mooc1.chaoxing.com/nodedetailcontroller/visitnodedetail?courseId=*
// @match        *://yun.ercmedia.cn/gswsd/index.php?p=*
// @match        *://youzy.cn/learn/classrooms/detail1?packId=*
// @match        *://h5.dingtalk.com/group-live-share/index.htm?*
// @match        *://meeting.tencent.com/v2/cloud-record/share?id=*
// @match        *://zhibo.chaoxing.com/*
// @match        *://www.wookey.cn/mkzt?id=*
// @match        *://www.wupen.org/lectures/1?lesson=*
// @match        *://web.guangdianyun.tv/live/*
// @match        *://www.leleketang.com/cr/stage.php?id=*
// @match        *://www.manamana.net/video/detail?id=*
// @match        *://video.pku.edu.cn/videos.html*
// @match        *://m.inmuu.com/v1/live/news/*
// @match        *://www.yinyuetai.com/play?id=*
// @match        *://www.1ting.com/album_*
// @match        *://y.qq.com/n/ryqq/*/*
// @match        *://www.kugou.com/*/*
// @match        *://music.163.com/#/*
// @match        *://www.beva.com/page/videoPlayer?albumId=*
// @match        *://www.ximalaya.com/album/*
// @match        *://kuwo.cn/*/*
// @match        *://www.hqgq.com/video/show/*
// @match        *://qishui.douyin.com/s/*
// @match        *://www.qtfm.cn/channels/*/programs/*
// @match        *://tv.cctv.com/*/*
// @match        *://news.cctv.com/*/*
// @match        *://www.cutv.com/v2/*
// @match        *://v.ifeng.com/c/*
// @match        *://v.jstv.com/a/*
// @match        *://www.zjstv.com/zcloud/video/*
// @match        *://v.iqilu.com/*/*
// @match        *://item.btime.com/*
// @match        *://tv.cztv.com/vplay/*
// @match        *://www.gztv.com/video/videoIndex.html?uuid=*
// @match        *://www.xmtv.cn/*/*
// @match        *://pc.yun.jxntv.cn/*/*
// @match        *://headline.fjtv.net/*/*
// @match        *://gdtv.cn/tv/*
// @match        *://www.sjzjx.gov.cn/col/*
// @match        *://live.ipanda.com/*/*
// @match        *://tv.hoolo.tv/*/*
// @match        *://news.cgtn.com/*/*
// @match        *://www.hebtv.com/*/*
// @match        *://live.nbwbwx.com/live/*
// @match        *://www.gzstv.com/v/*
// @match        *://www.csztv.com/doc/*
// @match        *://vod.gxtv.cn/video/videoShow_*
// @match        *://www.js7tv.cn/video/*
// @match        *://www.sxrtv.com/live*
// @match        *://zmt-m.hljtv.com/video_details.html?*
// @match        *://www.hljtv.com/*/*
// @match        *://news.hbtv.com.cn/p/*
// @match        *://kscgc.sctv-tf.com/*/*
// @match        *://17173.tv.sohu.com/v/*
// @match        *://v.4399pk.com/*/video_*
// @match        *://v.huya.com/play/*
// @match        *://v.douyu.com/show/*
// @match        *://m.dongqiudi.com/article/*
// @match        *://v.zhibo.tv/detail/headerline/*
// @match        *://www.zhibo8.cc/*/*
// @match        *://www.formula1.com/*/*
// @match        *://www3.nhk.or.jp/*/*
// @icon         https://www.flvcd.com/b30.gif
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/466446/%E7%A1%95%E9%BC%A0%E4%B8%80%E9%94%AE%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/466446/%E7%A1%95%E9%BC%A0%E4%B8%80%E9%94%AE%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isMenuOpen = false;

    function setButtonStyle(button) {
        button.style.position = 'fixed';
        button.style.left = '10px';
        button.style.transform = 'translateY(-50%)';
        button.style.zIndex = '9999';
        button.style.opacity = '0.7';
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        button.style.borderRadius = '15px';
        button.style.color = 'white';
        button.style.padding = '5px';
    }

    function toggleMenu() {
        if (!isMenuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    }

    function openMenu() {
        if (!isMenuOpen) {
            isMenuOpen = true;
            document.body.appendChild(updateButton);
        }
    }

    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            if (updateButton && updateButton.parentNode) {
                updateButton.parentNode.removeChild(updateButton);
            }
        }
    }

    function checkForUpdates() {
        const crv = GM_info.script.version;
        let updateUrl = GM_info.scriptUpdateURL || GM_info.script.updateURL || GM_info.script.downloadURL;
        updateUrl = `${updateUrl}?t=${Date.now()}`;
        fetch(updateUrl, {
            cache: 'no-cache'
        }).then((response) => {
            response.text().then((data) => {
                const m = data.match(/@version\s+(\S+)/);
                const ltv = m && m[1];
                if (ltv && verInt(ltv) > verInt(crv)) {
                    GM_openInTab(updateUrl, { active: true });
                } else {
                    updateButton.textContent = '暂无更新';
                    setTimeout(function() {
                        closeMenu();
                        updateButton.textContent = '检查更新';
                    }, 3000);
                }
            });
        }).catch(e => console.log(e));
    };

    const verInt = function(vs) {
        const vl = vs.split('.');
        let vi = 0;
        for (let i = 0; i < vl.length && i < 3; i++) {
            vi += parseInt(vl[i]) * (1000 ** (2 - i));
        }
        return vi;
    };

    var button = document.createElement('button');
    button.textContent = '一键解析';
    button.style.top = '50%';
    setButtonStyle(button);

    button.addEventListener('click', function() {
        var currentUrl = encodeURIComponent(window.location.href);
        var searchUrl = 'https://www.flvcd.com/parse.php?kw=' + currentUrl;
        GM_openInTab(searchUrl, { active: true });
    });

    button.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        toggleMenu();
    });

    var updateButton = document.createElement('button');
    updateButton.textContent = '检查更新';
    updateButton.style.top = 'calc(50% + 40px)';
    setButtonStyle(updateButton);

    updateButton.addEventListener('click', function() {
        checkForUpdates();
    });

    updateButton.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        closeMenu();
    });

    document.body.appendChild(button);
})();
