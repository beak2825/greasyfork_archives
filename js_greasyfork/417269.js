// ==UserScript==
// @name         广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @update       2025.8.4
// @description  自用，屏蔽一些网站的广告，如果也符合你的需求就下载吧(=・ω・=) 具体屏蔽列表看简介，不需要的屏蔽可以注释掉。
// @author       charghet
// @run-at document-body
// @license GPL
// @match http*://www.yhdmp.net/*
// @match http*://api.xiaomingming.org/cloud/mp6.php*
// @match http*://www.bilibili.com/
// @match http*://live.bilibili.com/*
// @match http*://www.bilibili.com/video/*
// @match http*://t.bilibili.com/
// @match http*://www.baidu.com/
// @match http*://fanyi.baidu.com/*
// @match http*://forum.xda-developers.com/*
// @match http*://www.btnull.nu/*
// @downloadURL https://update.greasyfork.org/scripts/417269/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/417269/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

//屏蔽列表
  //樱花动漫
  var imomoe = RegExp("http.*://www.yhdmp.net/.*");
  var imomoe2 = RegExp("http.*://api.xiaomingming.org/cloud/mp6.php.*");
  //哔哩哔哩
  var bilibili = RegExp("http.*://www.bilibili.com/$");
  var bilibili2 = RegExp("http.*://live.bilibili.com/.*");
  var bilibili3 = RegExp("http.*://www.bilibili.com/video/.*");
  var bilibili4 = RegExp("http.*://t.bilibili.com/$");
  //百度首页
  var baidu = RegExp("http.*://www.baidu.com/$");
  //百度翻译
  var baidufanyi = RegExp("http.*://fanyi.baidu.com/.*");
  //XDA
  var xda = RegExp("http.*://forum.xda-developers.com/.*");
  //btnull
  var btnull = RegExp("http.*://www.btnull.nu/.*");
  var s = '';

(function() {
    if(imomoe.test(location.href)){//樱花动漫
        //右下角屏蔽
        document.head.insertAdjacentHTML('beforeend','<style>#HMRichBox,#pop_ad,#HMCOVER_ID1{display:none !important;}</style>');
        //左右横幅屏蔽
        document.head.insertAdjacentHTML('beforeend','<style>#HMcoupletDivleft,#HMcoupletDivright{display:none !important;}</style>');
        //底部横幅
        document.head.insertAdjacentHTML('beforeend','<style>#fix_bottom_dom{display:none !important;}</style>');
        //不新建标签，直接打开链接
        document.onreadystatechange = function(){
            if(document.readyState == "interactive"){
                var list = document.getElementsByTagName('a');
                for(let i = 0;i < list.length;i++){
                    list[i].target = '_self';
                }
            }
        }
    }else if(imomoe2.test(location.href)){
        //暂停页面屏蔽
        document.head.insertAdjacentHTML('beforeend','<style>#player_pause,#adv_wrap_hh{display:none !important;}</style>');

    }else if(bilibili.test(location.href)){//哔哩哔哩
         //开头，勿注释
        s = '<style>';
        //主页横幅屏蔽
        s += 'a.banner-card.b-wrap{display:none !important;}';
        //右下角悬浮按钮广告
        s += 'div.adcard-content{display:none !important;}';
        //结尾，勿注释
        s+= '</style>';
        document.head.insertAdjacentHTML('beforeend',s);
    }else if(bilibili2.test(location.href)){//哔哩哔哩直播
        //开头，勿注释
        s = '<style>';
        //1.高能榜和大航海
        s += '#rank-list-vm{display:none !important;}';
        //2.送礼物面板
        s += '#gift-control-vm{display:none !important;}';
        //3.横幅广告
        s += 'div.flip-view{display:none !important;}';
        //4.标题右边
          //4.1 活动横条
          s += 'div.activity-gather-entry{display:none !important;}';
          //4.2 排名横幅
          s += 'div.hot-rank-wrap{display:none !important;}div.hot-not-rank{display:none !important;}';
        //5.弹幕区
          //5.1 系统提示弹幕
          s += 'div.convention-msg{display:none !important;}';
          //5.2 续费舰长提示弹幕
          s += 'div.guard-buy{display:none !important;}';
          //5.3 高能榜提示弹幕
          s += 'div.top3-notice{display:none !important;}';
          //5.4 活动积分提示弹幕
          s += 'div.lottery-gift-msg{display:none !important;}';
          //5.5 弹幕区位置调整
          s += 'div.with-penury-gift,div.chat-history-panel{height:100% !important; padding-bottom:0px !important;}div.danmaku-buffer-prompt{bottom:0px !important;}div.room-info-cntr{margin-top: 140px !important;}';
          //5.6 弹幕条
            //5.6.1 头衔
            s += 'div.title-label{display:none !important;}';
            //5.6.2 鼠标悬停显示勋章主播
            s += 'div.fansmedal-popover-wrap{display:none !important;}';
            //5.6.3 爷图标
            s += 'i.vip-icon{display:none !important;}';
            //5.6.4 vip图标
            s += 'i.medal-deco{display:none !important;}i.medal-deco.medal-guard{display:block !important;}div.fans-medal-item.medal-guard{margin-left:0px !important;}';
            //5.6.5 高能榜排名图标
            s += 'i.rank-icon{display:none !important;}';
            //5.6.6 星星
            s += 'div.chat-item{border-image-source:url() !important;}';
          //5.7 进入直播间提示弹幕
          s += 'div.important-prompt-item{display:none !important;}';
          //5.8 辣条礼物提示
          s += '#penury-gift-msg{display:none !important;}';
          //5.9 送礼物弹幕
          s += 'div.chat-item.gift-item{display:none !important;}';
          //5.10 主播热门榜提示弹幕
          s += 'div.hot-rank-msg{display:none !important;}';
          //5.11 表情包弹窗
          s += 'div.emoticons-guide-panel{display:none !important;}';
          //5.12 表情弹幕
          s += 'div.emoticons-guide-panel{display:none !important;}';
          //5.13 免费礼物提示
          s += '#brush-prompt{display:none !important;}div.chat-history-list{height:100% !important;}'
          //5.14 弹幕区圆角
          s += 'div.chat-history-panel{border-radius:10px !important;}'
          //5.15 通知弹幕
          s += 'div.common-danmuku-msg{display:none !important;}'
          //5.16 他们都在说
          s += '#combo-card{display:none !important;}'
          //5.17 主播帮玩
          s += 'div.play-together-service-card-container{display:none !important;}'
          //5.18 荣耀等级勋章
          s += 'div.wealth-medal-ctnr{display:none !important;}'
        //6. 直播logo
        s += 'div.web-player-icon-roomStatus{display:none !important;}';
        //7. 问题反馈
        s += 'div.web-player-icon-feedback{display:none !important;}';
        //8. 顶部弹幕数（他们都在说） XX×100
        s += 'div.combo{display:none !important;}';
        //9. 大弹幕
        s += 'div.mode-adv{display:none !important;}';
        //10. 主播推荐
        s += '#observerTarget{display:none !important;}';
        //11. combo弹幕
        s += 'div.bilibili-combo-danmaku-container{display:none !important;}';
        //12. 购物车提示
        s += 'div.shop-popover{display:none !important;}';
        //结尾，勿注释
        s+= '</style>';
        document.head.insertAdjacentHTML('beforeend',s);

        window.onload = function() {
            //播放器模糊阻挡（遮罩）
            var t = setInterval(() => {
                var e = document.getElementById('web-player-module-area-mask-panel');
                if (e !== null) {
                    setTimeout(()=> {
                        e.style.display = 'none';
                        clearInterval(t);
                    }, 800);
                }
            },500);
            setTimeout(() => {
                clearInterval(t);
            }, 10000);
            // 自动切换清晰度为原画
            var t2;
            var st = document.createElement('style');
            st.innerText = 'div.control-area{display:none !important;}';
            t2 = setInterval(() => {
                var player = document.getElementById("live-player");
                if (player) {
                    document.head.appendChild(st);
                    player.dispatchEvent(new Event('mousemove'));
                    var wrap = document.querySelectorAll(".quality-wrap");
                    if (wrap.length > 0) {
                        wrap[0].dispatchEvent(new Event("mouseenter"));
                        var li = document.querySelectorAll(".list-it");
                        if (li.length > 0) {
                            li[0].click();
                            player.dispatchEvent(new Event('mouseleave'));
                            if (st.parentNode) {
                                document.head.removeChild(st);
                            }
                            clearInterval(t2);
                        }
                    }
                }
            },500);
            setTimeout(() => {
                if (st.parentNode) {
                    document.head.removeChild(st);
                }
                clearInterval(t2);
            }, 3000);

            // 移除切屏事件（切屏会自动降清晰度）
            const originalAddEventListener = document.addEventListener;
            document.addEventListener = function(type, listener, options) {
                if (type === 'visibilitychange') {
                    return;
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
        };
    }else if(bilibili3.test(location.href)){//哔哩哔哩视频
        //右下角、横幅屏蔽
        document.head.insertAdjacentHTML('beforeend','<style>#bannerAd,div.slide-gg,div.vcd,#right-bottom-banner,#live_recommand_report,div.ad-floor-cover,div.ad-report{display:none !important;}</style>');
    }else if(bilibili4.test(location.href)){//哔哩哔哩动态
        //右边广告
        document.head.insertAdjacentHTML('beforeend','<style>div.bili-dyn-ads{display:none !important;}</style>');
    }else if(baidu.test(location.href)){//百度首页
        //搜索框底部新闻屏蔽
        document.head.insertAdjacentHTML('beforeend','<style>#s_mancard_main{display:none !important;}</style>');
    }else if(baidufanyi.test(location.href)){//百度翻译
        //右边和底部广告
        document.head.insertAdjacentHTML('beforeend','<style>#transOtherRight,div.spread-wrap{display:none !important;}</style>');
    }else if(xda.test(location.href)){//XDA
        document.head.insertAdjacentHTML('beforeend','<style>#adhesive_container,#ad_unit,#spot_container_content_above{display:none !important;}</style>');
    }else if(btnull.test(location.href)){//btnull
        document.head.insertAdjacentHTML('beforeend','<style>#HMcoupletDivleft,#HMcoupletDivright{display:none !important;}</style>');
    }else{
        console.log('广告屏蔽:无匹配');
    }
})();