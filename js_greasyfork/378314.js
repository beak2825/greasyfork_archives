// ==UserScript==
// @name         FUCK UGLY
// @namespace    http://www.dengquan.top
// @version      0.2
// @description  干掉那些恶心的东西
// @author       quan
// @match        https://blog.csdn.net/*/*/*/*
// @match        https://bbs.csdn.net/*/*
// @match        https://www.so.com/*
// @match        https://www.zhihu.com/*
// @match        https://www.jianshu.com/p/*
// @match        https://www.huya.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.7.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/378314/FUCK%20UGLY.user.js
// @updateURL https://update.greasyfork.org/scripts/378314/FUCK%20UGLY.meta.js
// ==/UserScript==

const site = window.location.href;
const csdnbbs = /bbs.csdn.net/
const csdnblog = /blog.csdn.net/
const so = /so.com/
const zhihu = /zhihu.com/
const jianshu = /jianshu.com/
const huya = /huya.com/

if(csdnblog.test(site)){//博客页面
    //去除展开登陆注册需求
    document.getElementById('article_content').style.height='';
    //去除展开按钮
    document.getElementsByClassName('hide-article-box')[0].style.display='none';
    //去除底部登陆注册提示
    document.getElementsByClassName('pulllog-box')[0].style.display='none';
    //去除页面中部广告
    document.getElementsByClassName('mediav_ad')[0].style.display='none';
    //去除谷歌广告
    document.getElementsByClassName('adsbygoogle')[0].style.display='none';
    //去除页面左侧侧栏广告
    document.getElementsByClassName('fourth_column')[0].style.display='none';
}else if(csdnbbs.test(site)){//论坛页面
    //模拟点击查看全部按钮
    document.getElementsByClassName('show_topic js_show_topic')[0].click();
}else if(so.test(site)){//360搜索
    //去掉右边广告推荐
    document.getElementById('side_wrap').style.display='none';
}else if(zhihu.test(site)){//知乎首页
    document.getElementsByClassName('Footer')[0].style.display='none';
    //去掉右边广告推荐
    document.getElementsByClassName('GlobalSideBar-categoryList')[0].style.display='none';

}else if(jianshu.test(site)){//简书
    document.getElementById('web-note-ad-fixed').style.display='none';
    document.getElementById('web-note-ad-1').style.display='none';
}else if(huya.test(site)){//虎牙
    //免登陆超清
    let nowIbitrate;
    const takeNowIbitrate=(notRecord)=> {
        if (document.querySelector("li[ibitrate='500']") !== null) {
            nowIbitrate = $('ul.player-videotype-list > li.on');
            changeEventRate(notRecord);
            return;
        }
        else {
            setTimeout(function () {
                takeNowIbitrate();
            }, 500);
        }
    }
    const autoChange=()=> {
        setTimeout(() => {
            if (document.querySelector('#player-login-tip-wrap') != null) {
                $('#player-login-tip-wrap').remove();
                changeRate();
                takeNowIbitrate(true);
                changeEventLine();
                return;
            }
            else {
                autoChange();
            }
        }, 500);
    }
    const changeEventRate=(notRecord)=> {
        $(".player-videotype-list li").click(function (e) {
            nowIbitrate = $(this);
            if (notRecord) {
                changeRate();
            }
        });
    }
    const changeEventLine=()=> {
        $('.player-videoline-list li').on('click', () => {
            vplayer.vcore.reqBitRate(nowIbitrate.attr("iBitRate"), true);
            changeEventRate(true);
        })
    }
    const changeRate=()=> {
        vplayer.vcore.reqBitRate(nowIbitrate.attr("iBitRate"), true);
        $('ul.player-videotype-list > li.on').removeClass('on');
        nowIbitrate.addClass('on');
        $('span.player-videotype-cur').text(nowIbitrate.text());
    }
    takeNowIbitrate(false);
    setTimeout(() => {
        autoChange();
    }, 301e3);

    //去广告
    //document.getElementById('huya-ad').style.display='none';

    //开启全屏关闭弹幕
    const clickLivePlatform=(danmu, fullscreen)=> {
        if (document.getElementById(danmu) != null) {
            document.getElementById(danmu).click();
        }
        if (document.getElementById(fullscreen) != null) {
            //document.getElementById(fullscreen).click();
        }
    }
    const applyLivePlatform=()=> {
        //document.getElementById('player-ctrl-wrap').style.display='inline';
        clickLivePlatform("player-danmu-btn", "player-fullscreen-btn")
        //document.getElementById('player-ctrl-wrap').style.display='block';
    }
    setTimeout(applyLivePlatform,1000);

}


