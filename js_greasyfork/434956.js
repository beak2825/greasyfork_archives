// ==UserScript==
// @name 抖音网页版优化
// @description 抖音网页版推荐、直播优化，网页全屏，全黑，自动按浏览器窗口调整大小
// @namespace https://space.bilibili.com/482343
// @author 古海沉舟
// @license 古海沉舟
// @version 1.14.14
// @match https://www.douyin.com/*
// @include https://*.douyin.com/*
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/howler/2.2.3/howler.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/434956/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/434956/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 全局变量
var zz = ['', '', '', '', '', '', '', ''];
var zzb = ['', '', '', '', '', '', '', ''];
var lastindex = 0,
    livecount = 0,
    h = '',
    h0 = '',
    sortdone = 0,
    wt = 0,
    wt2 = 0,
    ct = 0,
    bs = null,
    liveheight = null;
var islog = 1,
    isred = 1,
    ispayhide = 0,
    ismirror = 0,
    deletecount = 0,
    haspagefullscreen = 0;
var zzx = GM_getValue('zz', []);
var zzy = GM_getValue('zzb', []);
var colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

// 函数定义
function toObj(arr) {
    var obj = {};
    for (var temp in arr) {
        obj[arr[temp]] = true;
    }
    return obj;
}

function toArr(obj) {
    var arr = [];
    for (var temp in obj) {
        arr.push(temp);
    }
    return arr;
}

function together(a, b) {
    for (var temp = 0; temp < b.length; temp++) {
        if (b[temp] && b[temp] !== 'null' && b[temp].length < 40) {
            a.push(b[temp].toLowerCase());
        }
    }
}

function getUniq(arr) {
    return toArr(toObj(arr));
}

function cc(color, args) {
    var total = '';
    for (var i = 1; i < arguments.length; i++) {
        total += arguments[i];
    }
    console.log(colors[color] + total + colors.reset);
}

function keydown(event) {
    if (event.keyCode === 109 || event.keyCode === 189) { // 按 - 或小键盘 -
        pagefullscreen();
    } else if (event.keyCode === 187 || event.keyCode === 106) { // 按 = 或小键盘 *
        payhide();
    } else if (event.keyCode === 111 || event.keyCode === 191) { // 按 / 或小键盘 /
        videomirror();
    } else if (event.keyCode === 105) { // 按小键盘 9
        isred = 1 - isred;
    }
}

function livesort() {
    var livea = '#douyin-right-container > div.parent-route-container.route-scroll-container.LhqxgEn_ > div.tR7Ulcih > div > div.e3ffUpdr > ul.HK1P5LMm.NpyoaYHH';
    var lul = '#douyin-right-container > div.IhmVuo1S > div.r4Wnbr_N > div > div.Ec9GGINx > ul.ZjlWDwyg';
    if ($(lul).length < 1) {
        lul = '#douyin-right-container > div.parent-route-container.route-scroll-container.h5AVrOfS > div.jRsgdw_0 > div > div.Cts4MhxF > ul.QTHs3MFv.zzJBL64E';

    }

    if (deletecount < 1) {
        $(livea + ' > li, #douyin-right-container > div.parent-route-container.route-scroll-container > div > div > div > ul > li').each(function() {
            if ($(this).text().indexOf('个作品未看') > -1) {
                deletecount++;
                cc('blue', '删除作品未看', $(this)[0]);
                $(this).hide();
            }
        });
        $('#douyin-right-container > div.parent-route-container.route-scroll-container > div > div > div > div').each(function() {
            if ($(this).text().indexOf('精选关注人') > -1) {
                deletecount++;
                cc('blue', '精选关注人', $(this)[0]);
                $(this).hide();
            }
        });
        $('#douyin-right-container > div.jRsgdw_0 > div > div.Cts4MhxF').children(':not(ul:first-of-type)').each(function() {
            deletecount++;
            cc('blue', '删除非直播', $(this)[0]);
            $(this).hide();
        });
    }

    if ($(lul).html() == h || sortdone == 1) {
        return;
    }

    livecount = $(lul + ' > li').length;
    if (livecount > 0) {

        cc('blue', '当前直播个数：', livecount);
        var h1 = '', h2 = '', h3 = '', h4 = '', ho = '';
        $(lul + ' > li:not([fi])').each(function() {
            $(this).attr('fi', '1');
            var find = 0;
            var fl = $(this).find('a').attr('href') || $(this).children('div.frvzAIi8').children('a').attr('href');
            if (!fl) return;
            var oh = $(this)[0].outerHTML;

            for (var x = 0; x < zz.length; x++) {
                if (zz[x] && fl.indexOf(zz[x]) > -1) {
                    find = 1;
                    if (oh.indexOf('福袋') > 0 || oh.indexOf('红包') > 0) {
                        h1 = oh+h1;
                    } else {
                        h1 += oh;
                    }
                    break;
                }
            }
            if (find) return;

            for (x = 0; x < zzb.length; x++) {
                if (zzb[x] && fl.indexOf(zzb[x]) > -1) {
                    find = 1;
                    if (oh.indexOf('福袋') > 0 || oh.indexOf('红包') > 0) {
                        h2 = oh+h2;
                    } else {
                        h2 += oh;
                    }
                    break;
                }
            }
            if (find) return;

            if (oh.indexOf('福袋') > 0) {
                h3 += oh;
            } else if (oh.indexOf('红包') > 0) {
                h4 += oh;
            } else {
                ho += oh;
            }
        });

        h = h1 + h2 + h3 + h4 + ho;
        if (h) {
            cc('blue', '重新排序后');
            cc('blue', h);
            sortdone = 1;
            cc('blue', '排序次数：', sortdone);
            //$(lul).html(h);


            // 创建新容器
            var newContainer = $('<ul>', {
                id: 'new-live-container'
            });

            // 复制样式
            var lulDisplay = $(lul).css('display') && $(lul).css('display') !== 'none' ? $(lul).css('display') : 'block';
            newContainer.css($(lul).css([
                'position', 'top', 'left', 'right', 'bottom', 'margin', 'padding', 'border', 'width', 'height', 'display',
                'background', 'color', 'font', 'text-align', 'overflow', 'z-index'
            ]));
            newContainer.css('display', lulDisplay);

            // 复制类名
            newContainer.addClass($(lul).attr('class'));

            // 设置新内容
            newContainer.html(h);

            // 插入新容器
            $(lul).before(newContainer);
            $(lul).parent().children().not('#new-live-container').hide();
            // 隐藏原容器
            //$(lul).hide();

        }
    } else if (h0!='') {
        $('#douyin-right-container').html(h0);
        return;
    }

    livecount = $(lul + ' > li').length;
    if (livecount > 0 && lastindex === 0) {
        h0 = $('#douyin-right-container').html();
        cc('blue', '停止，直播个数', livecount);
        clearInterval(liveheight);
        lastindex = 1;
    }
}

function videomirror() {
    ismirror = 1 - ismirror;
    let playerVideo = document.querySelector('#PlayerLayout > div > div > div > div > video');

    if (!playerVideo) {
        playerVideo = document.querySelector('video');
    }
    if (!playerVideo) {
        cc('yellow', '未找到指定视频元素');
        return
    }

    if (ismirror) {
        cc('red', '开启垂直镜像');
        var wdstyle = document.createElement('style');
        wdstyle.classList.add('videomirror');

        if (playerVideo) {
            // 获取原始的内联样式
            const inlineTransform = playerVideo.style.transform;

            // 创建保留现有transform的新样式
            if (inlineTransform) {
                wdstyle.innerHTML = `
                video {
                    transform: ${inlineTransform} rotateY(180deg) !important;
                    -webkit-transform: ${inlineTransform} rotateY(180deg) !important;
                    -moz-transform: ${inlineTransform} rotateY(180deg) !important;
                }
                `;
            } else {
                // 如果没有内联样式，使用计算样式
                const computedStyle = window.getComputedStyle(playerVideo);
                const existingTransform = computedStyle.getPropertyValue('transform');

                wdstyle.innerHTML = `
                video {
                    transform: ${existingTransform !== 'none' ? existingTransform : ''} rotateY(180deg) !important;
                    -webkit-transform: ${existingTransform !== 'none' ? existingTransform : ''} rotateY(180deg) !important;
                    -moz-transform: ${existingTransform !== 'none' ? existingTransform : ''} rotateY(180deg) !important;
                }
                `;
            }
        } else {
            // 处理普通视频元素
            wdstyle.innerHTML = `
            video {
                transform: rotateY(180deg) !important;
                -webkit-transform: rotateY(180deg) !important;
                -moz-transform: rotateY(180deg) !important;
            }
            `;
        }

        document.body.appendChild(wdstyle);
    } else {
        cc('green', '关闭垂直镜像');
        $('style.videomirror').remove();
    }
}
function payhide() {
    ispayhide = 1 - ispayhide;
    if (ispayhide) {
        cc('red', '隐藏支付');
        var wdstyle = document.createElement('style');
        wdstyle.classList.add('payhide');
        wdstyle.innerHTML = `div.aqK_4_5U,#BottomLayout { display: none !important; }`;
        document.body.appendChild(wdstyle);
    } else {
        cc('green', '显示支付');
        $('style.payhide').remove();
    }
}

function pagefullscreen() {
    var is = 0;
    $('#sliderVideo xg-icon.xgplayer-page-full-screen > div.xgplayer-icon').each(function() {
        haspagefullscreen = 1;
        $(this).click();
        is = 1;
    });

    if (!is) {
        $('xg-controls xg-icon > div > div:nth-child(2)').each(function() {
            if ($(this).parent().text().indexOf('网页全屏') < 0) return;
            haspagefullscreen = 1;
            $(this).click();
            is = 1;
        });
    }

    if (!is) {
        $('div[data-e2e="living-container"] xg-icon > div > div').each(function() {
            if ($(this).parent().text().indexOf('网页全屏') < 0) return;
            haspagefullscreen = 1;
            $(this).click();
        });
    }
}

function filtergift() {
    $('div.webcast-chatroom___item.webcast-chatroom___enter-done:not([fi]), xg-danmu > div:not([fi])').each(function() {
        $(this).attr('fi', '1');
        var currentDate = new Date();
        var currentTime = currentDate.toLocaleString();
        var text = $(this).text();
        if (text.indexOf('送出') > -1 || text.indexOf('送给') > -1 || text.indexOf('为主播加了') > -1) {
            cc('white', text.replace(/\n/g, ' ').replace(/\s\s/g, ' ') + ' ' + currentTime);
            $(this).hide();
        } else if (
            text.indexOf('想听') > -1 ||
            text.indexOf('刚刚升级至') > -1 ||
            text.indexOf('成为在线观众TOP') > -1 ||
            text.indexOf('推荐直播给') > -1 ||
            text.indexOf('成功冠名了') > -1 ||
            text.indexOf('恭喜主播成功点亮了') > -1
        ) {
            $(this).hide();
        }
    });
}


function performance_trick() {
    if (bs) return bs.play();
    bs = new Howl({
        src: [
            'http://adventure.land/sounds/loops/empty_loop_for_js_performance.ogg',
            'http://adventure.land/sounds/loops/empty_loop_for_js_performance.wav'
        ],
        volume: 0.5,
        autoplay: true,
        loop: true
    });
}

function timestampToDatetime(timestamp) {
    var dateObj = new Date(timestamp);
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1;
    var day = dateObj.getDate();
    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var seconds = dateObj.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

function addCSS() {
    var wdstyle = document.createElement('style');
    wdstyle.classList.add('optimize');
    wdstyle.innerHTML = `
    div.gNyVUu_s, .OaNxZqFU img, .iRX47Q8q img, .Ng_nLvWy img, #sliderVideo > div.Mtz1OJlG.v0tRQvoe, div > div.eVtiBTlw > img, #slideMode > div.Mtz1OJlG.v0tRQvoe > img, .Mtz1OJlG img, .DEZPWI4G img, img[alt="LiveIcon"], #sliderVideo > div > img, #dark > div.iDduYXAc, #sliderVideo > div.E7R0E__S.playerContainer.hide-animation-if-not-suport-gpu.TkocvtkE.XxlZGem2 > div.JqsBy4t7.slider-video.isVertical > div > div.nM3w4mVK.cmI2tyuz.focusPanel > div > div > div > div > img, #LeftBackgroundLayout > div.douyin-player-dynamic-background > canvas { display: none !important; }
    .gKxBg4JL { box-shadow: none !important; }
    .yP48EXrf .PzYA0Lei, ._fmQtZIm .TWYv_EXn .I7uTRbqE { text-overflow: clip !important; }
    .qdcce5kG .VFMR0HAe, :root[update-header="2"] .qlkbkha_, div.search-horizontal-new-layout, #search-content-area div.GwBBBRKQ, #douyin-right-container, #chatroom > div.c6LJxjPr.unset-border > div.kz8VfOyK.Qsns7NdQ > div.Mv2estbj, .L76SgT5E .cYSl9Ppa, html[dark] .zmXfkTZ9, #dark .zmXfkTZ9,#LeftBackgroundLayout > div.douyin-player-dynamic-background > div { background: #0000 !important; }
    .vLt8mbfQ .y8iJbHin .mMOxHVzv, .vLt8mbfQ .y8iJbHin .rrKCA47Q, div.webcast-chatroom, .BasEuG5Q ._QjzkgP3, .OaNxZqFU, .basicPlayer.xgplayer, div.aqK_4_5U, .iSgCRqVf, .aEzDlumt .KhphjUgd.lG3F75Kf.anFLc8TW, .D9gH9oLs, html[dark] .lfsfx_uh .GE_yTyVX, .Pw3CDvJ, .aEzDlumt .xKQnHfmH.anFLc8TW, .Pw3CDvJg, #search-content-area > div, .gvxFUQjb,.pzKXdjhL .Iv8zTVVY{ background: #000 !important; }
    body, .Npz7CPXj, div.webcast-chatroom .webcast-chatroom___input-container .webcast-chatroom___textarea, .CgAB9miy, .JTIGfG2P, .NQ38Bc0h .XcEg0PrM, .N_HNXA04:not(.dUiu6B8O) .iViO9oMI, .UKFpY5tW, .SxCiQ8ip .EDvjMGPs, .SxCiQ8ip .A0ewbQCI, .fpRIB_wC, div.tgMCqIjJ, div.tgMCqIjJ.isDark, .sELpHy0M.metro .lgs6xhy7 .slot-item:hover, .sELpHy0M.metro .B9p3ney8:hover, .sELpHy0M.metro .UjStUCgW ._BSUxMOF:hover, .SxCiQ8ip.V6Va18Np, .qlkbkha_, .SxMeCeGo.UdVKTDud .gjQTl671, .h9wtZ0fY.metro .wtNw_CDe:hover, .h9wtZ0fY.metro .Pg8ernIx .slot-item:hover, .h9wtZ0fY.metro .fIHFYwJt .Y4MTL_BH:hover, .SxMeCeGo .DFH1PTN6, .gjQTl671, .EexPxRCK.cc1_mSqr.Bhtzbjo2, .aEzDlumt .jscIDlNp, .aEzDlumt .jscIDlNp.anFLc8TW, #slidelist, .X5syc51M.yWR42jR6, .EexPxRCK .Rr56zkD1, .gjQTl671 .c6LJxjPr, #island_e62be > div, .Qsns7NdQ, .NhEuGG6P, .eJDcoWZ2 .nUArm8od, .Q8fbHDm7.Q3NoUU1P, .iDduYXAc, #dark,._wBqqeOM,.aEzDlumt .J0WI7mqy{ background: #111 !important; }
    .N_HNXA04:not(.dUiu6B8O) .kQ2JnIMK .n9PPTk22, .N_HNXA04 .kQ2JnIMK, .iwzpXgQ3 .oJArD0aS, .xWPMYXKp .gOSlkVoB, .Exz5X5r1, .R5ITbXfy .k5cuEeRD, .sELpHy0M.metro .lgs6xhy7 .slot-item, .sELpHy0M.metro .B9p3ney8, .sELpHy0M.metro .UjStUCgW ._BSUxMOF, .N_HNXA04 .kQ2JnIMK .YrFhKzRI, .kuew7rkS .HaiBJL6n, .h9wtZ0fY.metro .wtNw_CDe, .h9wtZ0fY.metro .Pg8ernIx .slot-item, .h9wtZ0fY.metro .fIHFYwJt .Y4MTL_BH, ._0QL2JpzH, #component-navigation, .J6zKCgYE, .Z0XYsCxp .d8cD2XWD, .MBk4_p5s .GbSnpgWT, .sBRqUw32, .XmdLH_WU .c9Poqbe4, .cjR8oGui .LGWzuUuN { background: #222 !important; }
    :root[dark] { --floating-screen-wrapper-bg: linear-gradient(180deg, #000000 68.75%, rgba(37,38,50,0) 100%); }
    div.JwGiJkkI, div.xgplayer-dynamic-bg, div.umOY7cDY, div.ruqvqPsH, footer, :root[dark] .B6M32uoI, :root[dark] .KHZgK2KB, :root[dark] .YpFJLpHw, #douyin-right-container > div.parent-route-container.route-scroll-container.LhqxgEn_ > div.tR7Ulcih > div > div.e3ffUpdr > ul > li > div > div.Ib3gyySI > a.kpteEEN8.rPSHi9Pq > div > div > img { display: none !important; }
    .L8o4Hyg1, .L8o4Hyg1 .LFbb1oon, .L8o4Hyg1 .R6NHkCAw .i4vdvOF5 { box-shadow: none !important; border-bottom: none !important; border-right: none !important; }
    .N_HNXA04:not(.JVPLvXh3) .iViO9oMI, .N_HNXA04 .HQwsRJFy, .lXuWkeYW, .lXuWkeYW .oJArD0aS { height: 60px !important; }
    .pgQgzInF.hqONwptG .Jf1GlewW.Ox89VrU5, .ckEyweZa.AmXnh1GR .QICHGW7r.RosH2lNv, .SxCiQ8ip.V6Va18Np .EDvjMGPs.FKQqfehj { height: 100% !important; }
    :root[update-header="1"] .JTIGfG2P, :root[update-header="2"] .JTIGfG2P, :root[update-header="3"] .JTIGfG2P { padding: 0 0 0 0; }
    .SxCiQ8ip .EDvjMGPs .nUwhpww3.E2QLXZIv, .SxMeCeGo .DFH1PTN6 ._uuQkdQj._J11W6D7 { padding-top: 0px !important; }
    div.immersive-player-switch-on-hide-interaction-area, #video-info-wrap, xg-inner-controls.xg-inner-controls { opacity: 0.6 !important; }
    .xgplayer-playswitch .xgplayer-playswitch-tab { opacity: 0 !important; }
    div.xgplayer-playswitch-tab:hover, div.immersive-player-switch-on-hide-interaction-area:hover, #video-info-wrap:hover, xg-inner-controls.xg-inner-controls:hover { opacity: 1 !important; }
    .mUQC4JAd .LU6dHmmD { color: #bbb; }
  `;
    document.body.appendChild(wdstyle);
}

// 初始化和调用
setTimeout(function() {
    // 初始化 zzx 和 zzy
    zzx = zzx.filter(function(itemA) { return !zzb.some(function(itemB) { return itemA === itemB; }); });
    zzy = zzy.filter(function(itemA) { return !zz.some(function(itemB) { return itemA === itemB; }); });
    together(zzx, zz);
    zzx = getUniq(zzx);
    zz = [];
    together(zz, zzx);
    GM_setValue('zz', zz);
    together(zzy, zzb);
    zzy = getUniq(zzy);
    zzb = [];
    together(zzb, zzy);
    zzb = zzb.filter(function(itemA) { return !zz.some(function(itemB) { return itemA === itemB; }); });
    GM_setValue('zzb', zzb);

    // 绑定键盘事件
    document.addEventListener('keydown', keydown, false);

    // 直播页面处理
    if (location.href.indexOf('douyin.com/follow') > -1) {
        haspagefullscreen = 1;
        var livestyle = document.createElement('style');
        livestyle.classList.add('live');
        livestyle.innerHTML = `
      .semi-avatar-additionalBorder { border: none !important; }
      .QecmPpxX .RUVTDzAp, ._dJyrFnU .gsOyYJvT, .semi-avatar-circle { border-radius: 0% !important; }
      .Jt6LO5RK .qOwBZHet .trexWhDY, .yP48EXrf .NvKO9tgN .jnhlhsXZ, .QecmPpxX .RUVTDzAp, ._dJyrFnU .gsOyYJvT { animation: none; }
      .MqFz1fuL .YI8dpeaX, .semi-avatar-animated { animation: none !important; }
      .Jt6LO5RK .qOwBZHet .y5X4PaKT, .Jt6LO5RK .qOwBZHet .o4w20gFP, div.XcEg0PrM, div.Lo8QPz5R, div.QecmPpxX.TrKWAgc9 > svg, div.QecmPpxX.TrKWAgc9 > div.X0v0tibw, div.QecmPpxX.TrKWAgc9 > div.XQ9v_nAP, ul > li > a > div > svg, ul > li > a > div > div.WDUuX4lo, ul > li > a > div > div.SDfWCx4A, #douyin-right-container > div.parent-route-container.route-scroll-container > div > div > div > div.eHY_F2xy.rc3osMc2 { display: none !important; }
      div[class="iLXEZpcn Wza3QO3S"], div.zhL4qBq2, .yP48EXrf .NvKO9tgN .Pj8z3gc4, div.WQmhtggS, div[data-e2e="recommend-guide-mask"], div.WDUuX4lo, div.SDfWCx4A, #douyin-right-container > div.jRsgdw_0 > div > div.Cts4MhxF > ul > li > div > div.frvzAIi8 > a > div > span > div > span:nth-child(2), #douyin-right-container > div.jRsgdw_0 > div > div.Cts4MhxF > ul > li > div > div.frvzAIi8 > a > div > span > div > span:nth-child(3) { display: none !important; }
    `;
        document.body.appendChild(livestyle);
        cc('blue', '直播');
        liveheight = setInterval(livesort, 500);
    }

    // 初始化全屏检查
    var firstfullscreen = setInterval(function() {
        if (haspagefullscreen) {
            clearInterval(firstfullscreen);
            return;
        }
        pagefullscreen();
    }, 1000);

    // 初始化礼物过滤
    setInterval(filtergift, 1000);

    // 初始化支付隐藏
    addCSS();
    ispayhide = 0;
    payhide();

    // 初始化清晰度设置
    var setdefinition = setInterval(function (){

        var curdefinition = '',
            highestdefinition = '',
            find = 0;
        if (location.href.indexOf('https://live.douyin.com/') > -1) {
            $('#_douyin_live_scroll_container_ xg-controls div[data-e2e="quality"]').each(function() {
                curdefinition = $(this).text();
            });
            $('#_douyin_live_scroll_container_ xg-controls div[data-e2e="quality-selector"] > div').each(function() {
                highestdefinition = $(this).text();
                if ((highestdefinition.indexOf('登录即享') > -1 && highestdefinition.indexOf('高清') < 0) || find > 0) return;
                if (highestdefinition) {
                    cc('white', '当前清晰度 ', curdefinition, ' 可选最高', highestdefinition);
                    if (highestdefinition.indexOf(curdefinition) < 0) {
                        $(this).click();
                    } else {
                        clearInterval(setdefinition);
                    }
                    find = 1;
                }
            });
        } else {
            $('xg-controls xg-icon.xgplayer-playclarity-setting > div > div.btn').each(function() {
                curdefinition = $(this).text();
            });
            $('xg-controls xg-icon.xgplayer-playclarity-setting > div > div.virtual > div').each(function() {
                highestdefinition = $(this).text();
                if ((highestdefinition.indexOf('登录即享') > -1 && highestdefinition.indexOf('清晰') < 0) || find > 0) return;
                if (highestdefinition) {
                    cc('white', '当前清晰度 ', curdefinition, ' 可选最高', highestdefinition);
                    if (highestdefinition.indexOf(curdefinition) < 0) {
                        $(this).click();
                    } else {
                        clearInterval(setdefinition);
                    }
                    find = 1;
                }
            });
        }
    }, 1000);

    // 直播页面红包/福袋处理
    if (location.href.indexOf('live.douyin.com/') > -1) {
        performance_trick();
        var lingjiang = setInterval(function (){

            if (!isred) return;
            var lofind = 0;
            var currentDate = new Date();
            var currentTime = currentDate.toLocaleString();
            var currentms = currentDate.getTime();

            $('body > div > div > div > div.elw1KV8O > div.JL05k7eS.OG51D9OO').each(function() {
                if ($(this).text().indexOf('继续播放') > -1) {
                    console.log('点击继续播放 ', $(this).text(), currentTime);
                    console.log($(this)[0]);
                    $(this).click();
                    ct = currentms;
                }
            });

            $('#login-pannel > div.login-pannel__header > div').each(function() {
                if ($(this).text().indexOf('登录即可抢红包') > -1) {
                    console.log('未登陆暂停红包 ', $(this).text(), currentTime);
                    console.log($(this)[0]);
                    islog = 0;
                } else {
                    islog = 1;
                }
            });

            if (!islog) return;

            $('#short_touch_land_redpacket_land').each(function() {
                var tt = $(this).text();
                if (tt.indexOf('一键送出') > -1) {
                    cc('green', '抢到红包 ', currentTime);
                    $(this).find('div > div.Le1F9H3f.wzo_eGOx > div.xXBYooJe.MsPOwasn > div').each(function() {
                        console.log($(this)[0]);
                        $(this).click();
                    });
                } else if (tt.indexOf('下次抓住') < 0) {
                    var ix = tt.match(/[0-9]{1,2}分[0-9]{1,2}秒后/g);
                    if (ix) {
                        ix = ix[0].split('分');
                        ix = ix[0] * 60 + parseInt(ix[1].split('秒后')[0]);
                        if (ix > 0) {
                            console.log('红包等待 ', ix, ' 秒', currentTime);
                            wt2 = currentms + ix * 1000 - 1000;
                            console.log('至', timestampToDatetime(wt2));
                        }
                        return;
                    }
                    cc('yellow', '尝试抢红包 ', currentTime);
                    $(this).find('div > div.Le1F9H3f.wzo_eGOx > div.n_SHjkN2.LQcnZAyL > div > div.LyXHvflO.cNg0AbVM').each(function() {
                        console.log($(this)[0]);
                        $(this).click();
                    });
                } else {
                    cc('red', '没抢到红包 ', currentTime);
                    $(this).find('div > div.Le1F9H3f.wzo_eGOx > div.xXBYooJe.MsPOwasn > div').each(function() {
                        console.log($(this)[0]);
                        $(this).click();
                    });
                }
            });

            $('#lottery_close_cotainer').each(function() {
                var tt = $(this).text();
                $(this).attr('fi', '1');
                lofind = 1;
                if (tt.indexOf('没抽中福袋') > -1) {
                    cc('red', '没抽中福袋 ', currentTime);
                    $(this).find('div[role="button"]').each(function() {
                        if (tt.indexOf('知道了') > -1) {
                            console.log('点击知道 ', tt, currentTime);
                            console.log($(this)[0]);
                            $(this).click();
                            ct = currentms;
                        }
                    });
                    return;
                }

                if (currentms > ct + 200 && currentms > wt + 2000) {
                    wt = currentms;
                    var ix = tt.match(/[0-9]{1,2}:[0-9]{1,2}/g);
                    if (ix) {
                        ix = ix[0].split(':');
                        ix = ix[0] * 60 + parseInt(ix[1]);
                        if (ix > 0) {
                            console.log('福袋等待 ', ix, ' 秒', currentTime);
                            wt += ix * 1000 - 1000;
                            console.log('至', timestampToDatetime(wt));
                        }
                    }

                    if (tt.indexOf('已参与') > -1) {
                        $(this).find('div > div > div.YnybGvCL,div > div > div.hJ3SHYaQ').last().each(function() {
                            if ($(this).text().length < 3) {
                                $(this).click();
                                console.log('已参与,点击关闭按钮 ', tt, currentTime);
                                console.log($(this)[0]);
                                ct = currentms;
                            }
                        });
                        return;
                    } else if (tt.indexOf('倒计时') > -1 || tt.indexOf('加载中') > -1 || tt.indexOf('一键发评论参与福袋') > -1) {
                        var canl = 0;
                        $(this).find('div[role="button"]').each(function() {
                            if (tt.indexOf('一键发评论参与福袋') > -1) {
                                console.log('点击发评论参与福袋 ', tt);
                                console.log($(this)[0]);
                                $(this).click();
                                ct = currentms;
                                canl = 1;
                            }
                            if (tt.indexOf('已参与') > -1) {
                                canl = 2;
                            }
                        });
                        if (canl === 0) {
                            console.log('该福袋需要消费，不自动领取');
                        }
                        return;
                    } else if (tt.indexOf('恭喜你') > -1) {
                        cc('green', tt, ' ', currentTime);
                        $(this).find('div > div > div.YnybGvCL,div > div > div.hJ3SHYaQ').last().each(function() {
                            if ($(this).text().length < 3) {
                                $(this).click();
                                console.log('已得奖，点击关闭按钮 ', tt, currentTime);
                                console.log($(this)[0]);
                                ct = currentms;
                            }
                        });
                    } else if (tt.indexOf('加入') < 0 && tt.indexOf('提升') < 0) {
                        cc('yellow', tt, ' ', currentTime);
                        $(this).find('div > div > div.YnybGvCL,div > div > div.hJ3SHYaQ').last().each(function() {
                            if ($(this).text().length < 3) {
                                $(this).click();
                                console.log('需升级，点击关闭按钮 ', tt, currentTime);
                                console.log($(this)[0]);
                                ct = currentms;
                            }
                        });
                    } else {
                        console.log('该福袋需要新加入粉丝团或提升等级，不自动领取');
                    }
                }
            });

            if (lofind === 0) {
                $('div.ShortTouchContainer div > pace-island div > div > x-view,div.ShortTouchContainer div >  div > div > x-view').each(function() {
                    var ttx = $(this).text();
                    if (ttx.indexOf(':') > -1 && ttx.indexOf('00:00') < 0) {
                        if (currentms - wt > 0 && currentms - ct > 60000) {
                            console.log('点击福袋 ', ttx, currentTime);
                            console.log($(this)[0]);
                            $(this).click();
                            ct = currentms;
                        }
                    } else if (ttx.length === 0) {
                        console.log('点击红包 ', ttx, currentTime);
                        console.log($(this)[0]);
                        $(this).click();
                        ct = currentms;
                    }
                });
            }
        }, 1000);
    }
}, 2000);