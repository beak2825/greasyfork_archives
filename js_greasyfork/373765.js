// ==UserScript==
// @name 我自用斗鱼插件
// @namespace Unmht
// @match *://*.douyu.com/*
// @exclude *://*.douyu.com/
// @description       我自己用的,用于屏蔽斗鱼网页上的不想见的东西
// @author            unmht
// @run-at            document-end
// @grant             unsafeWindow
// @grant             GM_setClipboard
// @require           https://code.jquery.com/jquery-3.4.0.min.js
// @homepage          https://greasyfork.org/zh-CN/scripts/373765
// @version 0.0.7
// @downloadURL https://update.greasyfork.org/scripts/373765/%E6%88%91%E8%87%AA%E7%94%A8%E6%96%97%E9%B1%BC%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/373765/%E6%88%91%E8%87%AA%E7%94%A8%E6%96%97%E9%B1%BC%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
function AC_addStyle(css, className, addToTarget, isReload) { // 添加CSS代码，不考虑文本载入时间，带有className
    var tout = setInterval(function() {
        var addImmediately = false;
        var addTo = (document.head || document.body || document.documentElement || document);
        if (typeof(addToTarget) == "undefined") addImmediately = true;
        else addToTarget = addToTarget;
        isReload = isReload || false; // 默认是非加载型
        if (addImmediately || document.querySelector(addToTarget) !== null) {
            clearInterval(tout);
            // 如果true 强行覆盖，不管有没有--先删除
            // 如果false，不覆盖，但是如果有的话，要退出，不存在则新增--无需删除
            if (isReload === true) {
                safeRemove("." + className);
            } else if (isReload === false && document.querySelector("." + className) !== null) {
                // 节点存在 && 不准备覆盖
                return;
            }
            var cssNode = document.createElement("style");
            if (className !== null) cssNode.className = className;
            cssNode.setAttribute("type", "text/css")
            cssNode.innerHTML = css;
            try {
                if (addImmediately === true) {
                    addTo.appendChild(cssNode);
                } else {
                    document.querySelector(addToTarget).appendChild(cssNode);
                }
            } catch (e) {
                console.log(e.message);
            }
        }
    }, 20);
}

function change_css(css, stylename) {
    try {
        AC_addStyle(css, stylename);
    } catch (e) {};
}

function hidecss(codelist, stylename) {
    var cs = codelist.join(",")
    cs = cs + '{height:0px!important;width:0px!important;display:none!important;z-index:-1!important;}';
    change_css(cs, stylename);
};

function delayremove(codelist, dl) {
    var cs = codelist.join(',');
    try {
        setTimeout(function() {
            var rc = $(cs);
            rc.css("cssText", 'width:0 !important;height:0 !important;display:none !important;');
            rc.remove();
            var _pss = $('div[class^=video-container]');
            if (_pss != null & _pss.parentElement != null) {
                for (var i in _pss.parentElement.children) {
                    if (i == _pss) {
                        console.log('find video-container');
                        console.log(_pss);
                        console.log(_pss.parentNode);
                    }
                }
            } else {
                console.log(_pss);
                console.log(_pss.parent().children().not('div[class^=vidoe-container]').css("cssText", 'width:0 !important;height:0 !important;display:none !important;'));
                console.log('cont find video-container');
            }
        }, dl);
    } catch (e) {
        console.warn('error', e, 'delayremove');
    } finally {
        if (dl < 10000) {
            setTimeout(function() {
                delayremove(codelist, dl * 2);
            }, dl * 2);
        }
    }
}

function adj(dl) {
    console.log('adj');
    var s = $('div.forground');
    if (s == null || s.length == 0) {
        s = document.createElement('div');
        s.className = 'forground';
        window.document.body.appendChild(s);
        s.style.position = "fixed";
        s.style.zIndex = "200";
        s.style.backgroundColor = "#000000";
        s.style.width = "100%";
        s.style.height = "100%";
        s.style.top = "60px";
        s.style.left = "0px";
        s.style.verticalAlign = 'center';
    }
    var kid = document.body.getElementsByClassName('layout-Main');
    console.log("adjaaaa", kid.length);
    try {
        if (kid.length != 0) {
            kid = kid[0];
            if (kid.nodeName == 'DIV') {
                kid.style.position = "fixed";
                kid.style.zIndex = "201";
                var wh = parseInt(window.innerHeight / 2);
                var ww = parseInt(window.innerWidth / 2);
                var kh = parseInt(kid.offsetHeight / 2);
                var kw = parseInt(kid.offsetWidth / 2);
                var rate = parseFloat((ww - 20) / kw);
                console.log(wh, ww, kh, kw, rate);
                kid.style.left = (ww - kw).toString() + "px";
                kid.style.top = parseInt((wh - kh + 100) * rate).toString() + "px";
                kid.style.transform = 'scale(' + rate + ',' + rate + ')';
                console.log(kid.style.left, kid.style.top, kid.style.transform, kid.offsetHeight, kid.offsetWidth);


            }
            if (kid.nodeName == 'MAIN') {

                kid.style.position = "fixed";
                kid.style.zIndex = "201";
                kid.style.paddingLeft = "5px";
                kid.style.paddingRight = "5px";
                // var wh = parseInt(window.innerHeight / 2);
                // var ww = parseInt(window.innerWidth / 2);
                // var kh = parseInt(kid.offsetHeight / 2);
                // var kw = parseInt(kid.offsetWidth / 2);
                // var rateW = parseFloat((ww) / kw);
                // var rateH = parseFloat((wh) / kh);
                // var rate = parseFloat(rateW > rateH ? rateH : rateW).toString();
                // console.log(wh, ww, kh, kw, rate);
                // kid.style.left = (ww - kw).toString() + "px";
                // kid.style.top = (wh - kh + 60).toString() + "px";
                // kid.style.transform = 'scale(' + rate + ',' + rate + ')';
                // console.log(kid.style.left, kid.style.top, kid.style.transform,kid.offsetHeight,kid.offsetWidth );           


            }

        } else {
            // setTimeout(function() { adj(dl); }, dl);
        }
    } catch (error) {
        console.log("adj", error, $('.layout-Main'));
        setTimeout(function() { adj(dl); }, dl);
    }
}

function mainFun() {
    try {
        AC_addStyle('body{background-color:#033;width:100%!important}' +
                    
            '.Header-wrap,.Header-wrap:after,.Header-wrap:before,#mainbody{background-image:none!important;background-color:#73e7777f!important;}' +
            '.layout-Player-barrage{top:0px!important;}' +
            '#js-player-toolbar{height:0px!important;}',
            'style1');
    } catch (e) {
        console.warn(e);
    }
    var clist = [
        '.UserLevel',
        '.user-level',
        '.FansMedal',
        '.Motor',
        '.Barrage-nobleImg',
        '.RoomLevel',
        '.Barrage-noble',
        '.ChatAchievement',
        '.FollowGuide',
        '.Barrage-honor',

        '.ChatBarrageCollect',

        '.fans-rank',
        '.chat-icon-pad',
        '.status-low-enter',
        '.motorcade-icon',
        '.lol-activity',
        '.view-child',
        '#js-room-activity',
        '#js-background-holder',
        '#js-player-title',
        '.layout-Player-rankAll',
        '.layout-Player-rank',
        '.layout-Aside',
        '.layout-Bottom',
        '.BarrageBanner',
        '.TreasureWrap',
        '.Barrage-userEnter',
        '.Medal',
        '.Header-menu-icon4',
        '.Header-menu-icon3',
        '.Header-menu-icon2',
        '.Header-menu-icon1',
        '.DropPane-ad,.DropMenuList-ad',
      '.Promotion,.Task,.Game,.Header-download-wrap,.Header-broadcast-wrap',
        '.btn-group',
        '.vote-tips-pop',
        '.project-vote-wrap',
        'div.room-mes,div.layout-Player-rankAll,div.layout-Player-rank,div.layout-Player-asideAdvert',
        'div.Barrage-topFloater,div#lifter',
        'div#bc2,div#bc4,div#bc5,div#bc6,div#bc7,div#bc8,div#bc9,div#bc10,div#bc11,div#bc12,div#bc13,div#bc14,div#bc15,div#bc20,div#bc288',
        'div#js-room-activity,div.PlayerToolbar,div#js-player-guessgame,div.SignBarrage',
        'div.wm-h5-view,div.PaladinWeek-toast,div.ZoomTip',
    ];
    hidecss(clist, 'style2');
    $(function f1() {
        $("div.chat-cont").parent().children().not(".chat-cont,.chat-speak").remove();
        $("div.chat-cont").css("cssText", 'top:0 !important');
        $("#mainbody,.layout-Main").css("cssText", 'margin-left:0 !important;margin-right:0 !important;width:100% !important;height: 100%important;');
    });
    $("body").ready(function() {
        adj(3000);
        // var clist = ["div[data-component-id='view']",
        //     "div.vote-tips-pop",
        //     "div.project-vote-wrap",
        //     "div[class^='multiBitRate']",
        //     "div[class^='comment']",
        //     "div[class^='broadcastDiv']",
        //     "div.room-mes,div.layout-Player-rankAll,div.layout-Player-rank,div.layout-Player-asideAdvert",
        //     "div.Barrage-topFloater,div#lifter",
        //     "div.layout-Player-asideToggle"
        // ];
        // delayremove(clist, 3000);
    });

    hidecss([
      
        'div.layout-Player-videoProxy',
        'div.UPlayerLotteryEnter',
        'div.UPlayerLotteryEnter-close',
        'div.is-hidden',
        'div.CompetitionVictoryCarnivalCallPanel',
        'div.layout-Player-videoAbove',
        'div#player_h5_adDom',
      'div[class^=comment]',
      'div.MatchSystemTeamMedal',
      'div.layout-Player-announce',

      
    ], 'style3');
}
mainFun();