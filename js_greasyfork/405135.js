// ==UserScript==
// @name         哔哩哔哩(b站)播放页美化
// @namespace    http://tampermonkey.net/
// @version      2025.4.17
// @description  播放页显示UID和注册时间，显示屏蔽设定和高级弹幕选项
// @author       AN drew
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @match        https://www.bilibili.com/cinema/*
// @match        https://www.bilibili.com/documentary/*
// @match        https://www.bilibili.com/tv/*
// @match        https://www.bilibili.com/variety/*
// @match        https://member.bilibili.com/*
// @require      https://lib.baomitu.com/jquery/3.6.3/jquery.min.js
// @require      https://lib.baomitu.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/405135/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28b%E7%AB%99%29%E6%92%AD%E6%94%BE%E9%A1%B5%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/405135/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28b%E7%AB%99%29%E6%92%AD%E6%94%BE%E9%A1%B5%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

var openbarrage=0;

function v()
{

    var uid = $.cookie("DedeUserID")
    if($.cookie('registration_id')==undefined)
        $.cookie('registration_id', uid, { expires: 365, path: "/", domain: "bilibili.com" });

    if(window.location.href.indexOf("https://member.bilibili.com/x2/creative/h5/calendar/event?ts=0") > -1) //注册信息
    {
        var timer = setInterval(function(){
            if($("pre").length>0)
            {
                var str =$("pre").html()
                var json=JSON.parse(str);
                var unix =json['data']['pfs']['profile']['jointime']

                var theday=new Date(unix*1000);
                var ly = parseInt(theday.getFullYear());
                var lm = parseInt(1+theday.getMonth());
                var ld = parseInt(theday.getDate());
                clearInterval(timer)

                if($.cookie('registration_days')==undefined || $.cookie('registration_id')!=uid)
                {
                    $.cookie('registration_days', ly+"-"+lm+"-"+ld, { expires: 365, path: "/", domain: "bilibili.com" });
                    $.cookie('registration_id', uid, { expires: 365, path: "/", domain: "bilibili.com" });
                }
            }
        },100)
        }
    else if(window.location.href.indexOf("bangumi") > -1) //番剧
    {
        var t0 = setInterval(function(){
            if($(".coin-info").length > 0)
            {
                var coininfo = $(".coin-info").find("span").text()
                if(coininfo != "--")
                {
                    $(".coin-info").find("span").attr("style","width:85px")
                    $(".coin-info").find("span").text("投币 "+coininfo)
                    $(".coin-info").attr("style","margin-right:20px")
                    clearInterval(t0)
                }
            }
        },100)
        }

    var u ='<span><span id="uid">&nbsp;UID:&nbsp;</span><span id="id">xxx&nbsp;</span></span>'
    var $uid =$(u)
    $uid.css({"background":"#7CD4F2",
              "color":"white",
              "font-size":"10px",
              "margin-right":"30px",
              "padding":"1px 1px 1px 1px",
              "width": "28px",
              "height": "14px"})
    var t ='<span><span id="registration-time"><a href="https://member.bilibili.com/x2/creative/h5/calendar/event?ts=0" target="_blank" style="color:#00A1D6;text-decoration: underline">查看注册天数</a></span><span id="time"></span></span>'
    var $time=$(t)
    $time.css({"font-size":"10px",
               "margin-left":"20px",
               "padding":"1px 1px 1px 1px",
               "width": "56px",
               "height": "14px"})

    var t2 ='<span><span id="registration-time">&nbsp;注册时间:&nbsp;</span><span id="time">xxxx-xx-xx</span></span>'
    var $time2=$(t2)
    $time2.css({"background":"#6DC781",
                "color":"white",
                "font-size":"10px",
                "margin-left":"20px",
                "padding":"1px 1px 1px 1px",
                "width": "56px",
                "height": "14px"})

    setInterval(function(){

        if($('.bili-header .header-avatar-wrap').length > 0 && $('.bili-avatar').length > 0) //新版avatar
        {
            $('.bili-avatar').hover(function () {
                if ($('.myinfo').length == 0) {
                    var $div = $('.coins-item').clone(true);
                    $div.empty();
                    $div.attr('class', 'myinfo');
                    $div.css({ 'vertical-align': 'top', 'margin': '5px 0px 5px 0px' });
                    $div.append($uid);
                    let $time22=$time2.clone();
                    $time22.css('margin-left','5px');
                    if ($.cookie('registration_days') != null && $.cookie('registration_id') == uid) {
                        $div.append($time22);
                        $('.coins-item').before($div);
                        $('#time').text($.cookie('registration_days') + '\u00a0');
                    }
                    else {
                        $div.append($time);
                        $('.coins-item').before($div);
                    }
                    if (uid != undefined) { $('#id').text(uid + ' '); }
                }
            });
        }
        else
        {
            if($(".mini-avatar").length>0)
            {
                $(".mini-avatar").hover(function(){
                    if($(".myinfo").length==0)
                    {
                        var $div = $(".coins").clone(true)
                        $div.empty()
                        $div.attr("class","myinfo")
                        $div.css({"vertical-align":"top","margin-top":"5px"})
                        $div.append($uid)
                        if($.cookie("registration_days")!=undefined && $.cookie('registration_id')==uid)
                        {
                            $div.append($time2)
                            $(".level-content").before($div)
                            $("#time").text($.cookie("registration_days")+'\u00a0')
                        }
                        else
                        {
                            $div.append($time)
                            $(".level-content").before($div)
                        }
                        if(uid!=undefined)
                            $("#id").text(uid+" ")
                    }
                })
            }
        }
    },1000)


    //AV、BV互转原理来自知乎：https://www.zhihu.com/question/381784377/answer/1099438784
    //最新的BV转AV方法来自GreasyFork：https://greasyfork.org/zh-CN/scripts/398499
    //最新的AV转BV方法来自Github：https://github.com/Colerar/abv


    /*
    var table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
    var tr = {};
    for (var i = 0; i < 58; ++i) {
        tr[table[i]] = i;
    }

    var s = [11,10,3,8,4,6];
    var xor = 177451812;
    var add = 8728348608;

    const dec = (() => {
        const charset = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
        const bvReg = new RegExp(`^[Bb][Vv]1[${charset}]{9}$`);
        const base = BigInt(charset.length);
        const table = {};
        for (let i = 0; i < charset.length; i++) table[charset[i]] = i;
        const xor = 23442827791579n;
        const rangeLeft = 1n;
        const rangeRight = 2n ** 51n;

        //@param {string} bv

        return bv => {
            if (!bvReg.test(bv)) {
                throw new Error(`Unexpected bv: ${bv}`);
            }

            const chars = bv.split('');
            [chars[3], chars[9]] = [chars[9], chars[3]];
            [chars[4], chars[7]] = [chars[7], chars[4]];

            let result = 0n;
            for (let i = 3; i < 12; i++) {
                result = result * base + BigInt(table[chars[i]]);
            }
            if (result < rangeRight || result >= rangeRight * 2n) {
                throw new RangeError(`Unexpected av result: ${result}`);
            }
            result = result % rangeRight ^ xor;
            if (result < rangeLeft) {
                throw new RangeError(`Unexpected av result: ${result}`);
            }

            return 'av'+result;
        };
    })();


    function av2bv(x)
    {
        if(x.length<15)
        {
            if(x.length>=10)
            {
                x-=2147483648;
            }
            x=(x^xor)+add;
            let r=['B','V',1, , ,4, ,1, ,7, , ];
            for (var i = 0; i < 6; i++)
            {
                r[s[i]]=table[parseInt(x/58**i)%58];
            }
            return r.join("");
        }
    }
    */

    const XOR_CODE = 23442827791579n;
    const MASK_CODE = 2251799813685247n; // 0x1FFFFFFFFFFFFFn
    const MAX_AID = 1n << 51n;
    const MIN_AID = 1n;
    const BASE = 58;
    const BV_LEN = 12;
    const PREFIX = "BV1";

    const ALPHABET = [
        'F', 'c', 'w', 'A', 'P', 'N', 'K', 'T', 'M', 'u', 'g', '3',
        'G', 'V', '5', 'L', 'j', '7', 'E', 'J', 'n', 'H', 'p', 'W',
        's', 'x', '4', 't', 'b', '8', 'h', 'a', 'Y', 'e', 'v', 'i',
        'q', 'B', 'z', '6', 'r', 'k', 'C', 'y', '1', '2', 'm', 'U',
        'S', 'D', 'Q', 'X', '9', 'R', 'd', 'o', 'Z', 'f'
    ];

    const revMap = {
        'F': 0, 'c': 1, 'w': 2, 'A': 3, 'P': 4, 'N': 5, 'K': 6, 'T': 7, 'M': 8,
        'u': 9, 'g': 10, '3': 11, 'G': 12, 'V': 13, '5': 14, 'L': 15, 'j': 16, '7': 17,
        'E': 18, 'J': 19, 'n': 20, 'H': 21, 'p': 22, 'W': 23, 's': 24, 'x': 25, '4': 26,
        't': 27, 'b': 28, '8': 29, 'h': 30, 'a': 31, 'Y': 32, 'e': 33, 'v': 34, 'i': 35,
        'q': 36, 'B': 37, 'z': 38, '6': 39, 'r': 40, 'k': 41, 'C': 42, 'y': 43, '1': 44,
        '2': 45, 'm': 46, 'U': 47, 'S': 48, 'D': 49, 'Q': 50, 'X': 51, '9': 52, 'R': 53,
        'd': 54, 'o': 55, 'Z': 56, 'f': 57
    };

    class BvError extends Error {
        constructor(message) {
            super(message);
            this.name = 'BvError';
        }
    }

    function av2bv(avid) {
        const av = BigInt(avid);
        if (av < MIN_AID) {
            throw new BvError(`Av ${av} is smaller than ${MIN_AID}`);
        }
        if (av >= MAX_AID) {
            throw new BvError(`Av ${av} is bigger than ${MAX_AID}`);
        }

        let bytes = Array.from('BV1000000000');
        let bv_idx = BV_LEN - 1;
        let tmp = (MAX_AID | av) ^ XOR_CODE;

        while (tmp !== 0n) {
            const table_idx = tmp % 58n;
            bytes[bv_idx] = ALPHABET[Number(table_idx)];
            tmp /= 58n;
            bv_idx -= 1;
        }

        [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
        [bytes[4], bytes[7]] = [bytes[7], bytes[4]];

        return bytes.join('');
    }

    function bv2av(bvid) {
        if (typeof bvid !== 'string') {
            throw new BvError('Bvid must be a string');
        }
        if (bvid.length === 0) {
            throw new BvError('Bv is empty');
        }
        if (bvid.length !== BV_LEN) {
            throw new BvError(bvid.length < BV_LEN ? 'Bv is too small' : 'Bv is too big');
        }
        if (!/^[\x00-\x7F]*$/.test(bvid)) {
            throw new BvError('Bv with unicode char');
        }
        const prefix = bvid.substring(0, 3);
        if (!prefix.match(/^BV1/i)) {
            throw new BvError('Bv prefix should be ignore-cased `BV1`');
        }

        const bvArr = bvid.split('');
        [bvArr[3], bvArr[9]] = [bvArr[9], bvArr[3]];
        [bvArr[4], bvArr[7]] = [bvArr[7], bvArr[4]];

        let tmp = 0n;
        for (let i = 3; i < BV_LEN; i++) {
            const c = bvArr[i];
            const idx = revMap[c];
            if (idx === undefined) {
                throw new BvError(`Bv is invalid, with invalid char code ${c}`);
            }
            tmp = tmp * 58n + BigInt(idx);
        }

        const binLen = tmp.toString(2).length;
        if (binLen !== 52) {
            throw new BvError(binLen > 52 ? 'Bv is too big' : 'Bv is too small');
        }

        const avid = (tmp & MASK_CODE) ^ XOR_CODE;
        if (avid < MIN_AID) {
            throw new BvError('Bv is too small');
        }

        return 'av'+Number(avid);
    }

    setInterval(function(){
        let $ids=$('<div style="margin: 10px 0px;"></div>');
        let av,bv;
        if(window.location.pathname.indexOf("BV") > -1 || window.location.pathname.indexOf("bv") > -1)
        {
            let pathname=window.location.pathname;
            if(pathname.indexOf("BV")>-1)
                bv=pathname.substring(window.location.pathname.lastIndexOf("/BV")+1).replace("/","");
            else
                bv=pathname.substring(window.location.pathname.lastIndexOf("/bv")+1).replace("/","");

            //转换为av
            av = bv2av(bv);

            if($("#avid").length==0)
            {
                var $avid = $("<span id='avid'></span>");
                $avid.attr("style","background: #FB7299; color: white; font-size: 13px; vertical-align:middle; margin-left:0px; padding: 5px; border-radius:5px; ")
                $avid.text(av)
                $avid.click(function(){
                    GM_setClipboard($('#avid').text(),'text');
                    alert('av号已复制')
                })
                if($('.honor.item').length>0 || $('.video-argue.item').length>0)
                {
                    $('.video-info-container').addClass('higher');
                    $ids.append($avid)
                    $('.video-info-meta').after($ids)
                }
                else
                {
                    $('.video-info-detail-list').append($avid)
                }
            }
            else
            {
                if($('#avid').text()!=av)
                {
                    $('#avid').text(av)
                }
            }


            if($("#bvid").length==0)
            {
                var $bvid = $("<span id='bvid'></span>");
                $bvid.attr("style","background: #00A1D6; color: white; font-size: 13px; vertical-align:middle; margin-left:10px; padding: 5px; border-radius:5px; ")
                $bvid.text(bv)
                $bvid.click(function(){
                    GM_setClipboard($('#bvid').text(),'text');
                    alert('bv号已复制')
                })
                if($('.honor.item').length>0 || $('.video-argue.item').length>0)
                {
                    $('.video-info-container').addClass('higher');
                    $ids.append($bvid)
                    $('.video-info-meta').after($ids)
                }
                else
                {
                    $('.video-info-detail-list').append($bvid)
                }
            }
            else
            {
                if($('#bvid').text()!=bv)
                {
                    $('#bvid').text(bv)
                }
            }
        }
        else if(window.location.pathname.indexOf("av") > -1)
        {
            av=window.location.pathname.substring(window.location.pathname.lastIndexOf("/av")+1).replace("/","");

            //转换为bv
            bv = av2bv(av.substring(2));

            if($("#avid").length==0)
            {
                let $avid = $("<span id='avid'></span>");
                $avid.attr("style","background: #FB7299; color: white; font-size: 13px; vertical-align:middle; margin-left:0px; padding: 5px; border-radius:5px; ")
                $avid.text(av)
                $avid.click(function(){
                    GM_setClipboard($('#avid').text(),'text');
                    alert('av号已复制')
                })
                if($('.honor.item').length>0 || $('.video-argue.item').length>0)
                {
                    $('.video-info-container').addClass('higher');
                    $ids.append($avid)
                    $('.video-info-meta').after($ids)
                }
                else
                {
                    $('.video-info-detail-list').append($avid)
                }
            }
            else
            {
                if($('#avid').text()!=av)
                {
                    $('#avid').text(av)
                }
            }

            if(bv!=undefined)
            {
                if($("#bvid").length==0)
                {
                    let $bvid = $("<span id='bvid'></span>");
                    $bvid.attr("style","background: #00A1D6; color: white; font-size: 13px; vertical-align:middle; margin-left:10px; padding: 5px; border-radius:5px; ")
                    $bvid.text(bv)
                    $bvid.click(function(){
                        GM_setClipboard($('#bvid').text(),'text');
                        alert('bv号已复制')
                    })
                    if($('.honor.item').length>0 || $('.video-argue.item').length>0)
                    {
                        $('.video-info-container').addClass('higher');
                        $ids.append($bvid)
                        $('.video-info-meta').after($ids)
                    }
                    else
                    {
                        $('.video-info-detail-list').append($bvid)
                    }
                }
                else
                {
                    if($('#bvid').text()!=bv)
                    {
                        $('#bvid').text(bv)
                    }
                }
            }
        }

        $(".nav-search-keyword").attr("placeholder"," ");
        $(".user-card-m").each(function(){
            if($(this).find(".uuid").length==0)
            {
                var $uuid = $("<span class='uuid'></span>");
                $uuid.attr("style","background: rgb(124, 212, 242); color: white; font-size: 12px; vertical-align:middle; margin-right:180px; padding-left:4px; padding-right:4px; border-radius:4px; font-weight:normal;")
                let url=$(this).find(".card-user-name").attr("href");
                if(url!= undefined)
                {
                    $uuid.text("  UID: "+url.substring(url.lastIndexOf("/")+1)+"  ")
                    $(this).find('.card-social-info').before($uuid)
                }
            }
        })
        $(".user-card-m-exp").each(function(){
            if($(this).find(".uuid").length==0)
            {
                var $uuid = $("<span class='uuid'></span>");
                $uuid.attr("style","background: rgb(124, 212, 242); color: white; font-size: 12px; vertical-align:middle; margin-right:180px; padding-left:4px; padding-right:4px; border-radius:4px; font-weight:normal;")
                let url=$(this).find(".card-user-name").attr("href");
                if(url!= undefined)
                {
                    $uuid.text("  UID: "+url.substring(url.lastIndexOf("/")+1)+"  ")
                    $(this).find('.card-social-info').before($uuid)
                }
            }
        })
        $(".user-card").each(function(){
            if($(this).find(".uuid").length==0)
            {
                var $uuid = $("<span class='uuid'></span>");
                $uuid.attr("style","background: rgb(124, 212, 242); color: white; font-size: 12px; vertical-align:middle; margin-right:180px; padding-left:4px; padding-right:4px; border-radius:4px; font-weight:normal;")
                let url=$(this).find(".card-user-name").attr("href");
                if(url!= undefined)
                {
                    $uuid.text("  UID: "+url.substring(url.lastIndexOf("/")+1)+"  ")
                    $(this).find('.card-social-info').before($uuid)
                }
            }
        })
    },1)

    setInterval(function(){
        if($(".toggle-btn").text().indexOf("展开更多") > -1)
            $(".toggle-btn").click();
        $(".ops span").attr("style","margin-right:25px"); //按钮间距
        $(".appeal-text").attr("style","margin-right:5px"); //稿件投诉
        $(".note-btn").attr("style","margin-right:0px"); //记笔记
        $(".share-pos").attr("style","width:520px"); //分享框

        if($(".ops .like").length > 0)
        {
            var liketext = $(".ops .like").contents().eq(-1).get(0).textContent
            if(liketext.indexOf("点赞")==-1)
                $(".ops .like").contents().eq(-1).get(0).textContent="点赞 "+liketext
        }

        if($(".ops .collect").length > 0)
        {
            var collecttext = $(".ops .collect").contents().eq(-1).get(0).nodeValue
            if(collecttext.indexOf("收藏")==-1)
                $(".ops .collect").contents().eq(-1).get(0).nodeValue="收藏 "+collecttext
        }

        if($(".ops .coin").length > 0)
        {
            var cointext = $(".ops .coin").contents().eq(-1).get(0).textContent
            if(cointext.indexOf("投币")==-1)
                $(".ops .coin").contents().eq(-1).get(0).textContent="投币 "+cointext
        }

        if($(".ops .share").length > 0)
        {
            var sharetext = $(".ops .share").contents().eq(1).get(0).nodeValue
            if(sharetext.indexOf("分享")==-1)
                $(".ops .share").contents().eq(1).get(0).nodeValue="分享 "+sharetext
        }


        $(".toolbar-left > span:not(:last-of-type)").attr("style","margin-right:25px"); //按钮间距
        $(".manuscript-report").attr("style","margin-right:5px"); //稿件投诉
        $('.video-toolbar-v1 .toolbar-left > span .info-text ').attr("style","overflow:visible!important"); //文本不省略

        if($(".toolbar-left .like .info-text").length > 0)
        {
            let new_liketext = $(".toolbar-left .like .info-text").text();
            if(new_liketext.indexOf("点赞")==-1)
                $(".toolbar-left .like .info-text").text("点赞 "+new_liketext);
        }

        if($(".toolbar-left .collect .info-text").length > 0)
        {
            let new_collecttext = $(".toolbar-left .collect .info-text").text();
            if(new_collecttext.indexOf("收藏")==-1)
                $(".toolbar-left .collect .info-text").text("收藏 "+new_collecttext);
        }

        if($(".toolbar-left .coin .info-text").length > 0)
        {
            let new_cointext = $(".toolbar-left .coin .info-text").text();
            if(new_cointext.indexOf("投币")==-1)
                $(".toolbar-left .coin .info-text").text("投币 "+new_cointext);
        }

        if($(".toolbar-left .share .info-text").length > 0)
        {
            let new_sharetext = $(".toolbar-left .share .info-text").text();
            if(new_sharetext.indexOf("分享")==-1)
                $(".toolbar-left .share .info-text").text("分享 "+new_sharetext);
        }


    },1000)


    setInterval(function(){
        if($("#activity_vote").length>0)
        {
            $("#activity_vote").hide()
        }
        $(".video-page-game-card").hide()
    },10)


    setInterval(function(){
        if($(".pop-live.report-wrap-module.report-scroll-module").length>0)
        {
            $(".pop-live.report-wrap-module.report-scroll-module").hide()
        }
    },500)

    var timer1=setInterval(function(){
        if($(".members-info__header").find(".btn").length>0 && $(".members-info__header").find(".btn").text().indexOf("展开") > -1)
        {
            $(".members-info__header").find(".btn").click()
            clearInterval(timer1)
        }
    },500)

    if(openbarrage==1)
    {
        var timer2=setInterval(function(){
            if($(".bui-collapse-arrow-text").length>0 && $(".bui-collapse-arrow-text").text().indexOf("展开") > -1)
            {
                $(".bui-collapse-arrow-text").click()
                clearInterval(timer2)
            }
        },500)
        }

    var timer3=setInterval(function(){
        if($(".bpx-player-filter").length>0 )
        {
            $(".bpx-player-filter").find(".bui-dropdown-icon").hide()
            $(".bpx-player-filter").find(".bui-dropdown-display").append($('<span class="bui-dropdown-name" style="margin-left:10px">屏蔽设定</span>'))
            $(".bpx-player-filter").find(".bui-dropdown-display").append($('<span class="bui-dropdown-name" style="margin-left:10px">高级弹幕</span>'))
            $(".bui-dropdown-name").css({"height":"35px","border-bottom": "none","text-decoration":"none", "z-index":"1000"})
            $(".bpx-player-filter span:first-child").addClass("on")
            $(".bpx-player-filter span:first-child").css({"border-bottom": "2px solid #32AAFF"})
            $(".bui-dropdown-name").hover(function(){
                $(this).addClass("hover")
                $(this).css({"height":"35px","border-bottom": "2px solid #32AAFF","text-decoration":"none"})
            },function(){
                $(this).removeClass("hover")
                if(!$(this).hasClass("on"))
                    $(this).css({"height":"35px","border-bottom": "none","text-decoration":"none"})
            })

            $(".bui-collapse-body").on('toggle',function(){
                return false;
            })

            $(".bui-dropdown-name").eq(0).click(function(){
                event.preventDefault()
                event.stopPropagation();
                return false
            })

            $(".bui-dropdown-name").eq(1).click(function(){
                event.preventDefault()
                event.stopPropagation();
                $(".bui-dropdown-name").fadeOut(300)

                var text = $(this).text()
                $(".bui-dropdown-items").children().each(function(){
                    if($(this).text() == text)
                        $(this).click()
                })
                $(".bui-dropdown-name").fadeIn(300)
                //$(".bui-dropdown-items").hide()
                $(".bui-dropdown-name").removeClass("on")
                $('.bui-dropdown-name').eq(0).addClass("on")

                if($(".arrow-icon").length > 0)
                {
                    setTimeout(function(){
                        $(".svgicon-r").click()
                    },500);
                }
                else if($(".bui-collapse-arrow-text").text().indexOf("展开") > -1)
                {
                    $(".bui-collapse-arrow-text").click()
                }

                //$("#danmukuBox").attr("style","height: 493px;")
                return false
            })
            $(".bui-dropdown-name").eq(2).click(function(){
                event.preventDefault()
                event.stopPropagation();
                $(".bui-dropdown-name").fadeOut(300)
                var text = $(this).text()
                $(".bui-dropdown-items").children().each(function(){
                    if($(this).text() == text)
                        $(this).click()
                })
                $(".bui-dropdown-name").fadeIn(300)
                //$(".bui-dropdown-items").hide()
                $(".bui-dropdown-name").removeClass("on")
                $('.bui-dropdown-name').eq(0).addClass("on")

                if($(".arrow-icon").length > 0)
                {
                    setTimeout(function(){
                        $(".svgicon-r").click()
                    },500);
                }
                else if($(".bui-collapse-arrow-text").text().indexOf("展开") > -1)
                {
                    $(".bui-collapse-arrow-text").click()
                }

                //$("#danmukuBox").attr("style","height: 493px;")
                return false;
            })
            setInterval(function(){

                if($(".bui-collapse-arrow-text").text().indexOf("收起") > -1)
                    $("#danmukuBox").attr("style","height: auto;")


                $(".bui-dropdown-display").each(function(){
                    if($(this).children().eq(0).text().indexOf("弹幕列表") > -1)
                    {
                        if($(this).children().eq(2).text().indexOf("屏蔽设定") == -1)
                            $(this).children().eq(2).text("屏蔽设定")
                        if($(this).children().eq(3).text().indexOf("高级弹幕") == -1)
                            $(this).children().eq(3).text("高级弹幕")
                    }
                    else if($(this).children().eq(0).text().indexOf("屏蔽设定") > -1)
                    {
                        if($(this).children().eq(2).text().indexOf("弹幕列表") == -1)
                            $(this).children().eq(2).text("弹幕列表")
                        if($(this).children().eq(3).text().indexOf("高级弹幕") == -1)
                            $(this).children().eq(3).text("高级弹幕")
                    }
                    else if($(this).children().eq(0).text().indexOf("高级弹幕") > -1)
                    {
                        if($(this).children().eq(2).text().indexOf("弹幕列表") == -1)
                            $(this).children().eq(2).text("弹幕列表")
                        if($(this).children().eq(3).text().indexOf("屏蔽设定") == -1)
                            $(this).children().eq(3).text("屏蔽设定")
                    }

                })

                $(".bui-dropdown-name").each(function(){
                    if($(this).hasClass("on") || $(this).hasClass("hover"))
                        $(this).css({"border-bottom": "2px solid #32AAFF"})
                    else
                        $(this).css({"border-bottom": "none"})
                })

            },300)
            clearInterval(timer3)
        }
    },100)

    setInterval(function(){
        $("#bannerAd").remove();
        $(".gg-floor-module").hide()
        $("#slide_ad").hide()
        $(".video-ad-creative-card").hide()
        $('.ad-report').hide()
        $(".bilibili-player-video-danmaku-setting-left-block-title").attr("style","color:#FF0000; font-weight:bold")

        var ban ='<img class="ban" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/'+
            'PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBo'+
            'aWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTkxNjkyMzAyOTAzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0i'+
            'MCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4'+
            'NjkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxk'+
            'ZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvbnQtZmFjZSB7IGZvbnQtZmFtaWx5OiBlbGVtZW50LWljb25zOyBzcmM6'+
            'IHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL2ZvbnRzL2VsZW1lbnQt'+
            'aWNvbnMud29mZiIpIGZvcm1hdCgid29mZiIpLCB1cmwoImNocm9tZS1leHRlbnNpb246Ly9iYmFraG5tZmtqZW5mYmhqZGRk'+
            'aXBjZWZuaHBpa2piai9mb250cy9lbGVtZW50LWljb25zLnR0ZiAiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48'+
            'L2RlZnM+PHBhdGggZD0iTTUxMiAwYTUxMiA1MTIgMCAxIDAgNTEyIDUxMiA1MTIgNTEyIDAgMCAwLTUxMi01MTJ6IG0zODQg'+
            'NTEyYTM4NCAzODQgMCAwIDEtNzEuMDQgMjIyLjA4TDI4OS45MiAxOTkuMDRBMzg0IDM4NCAwIDAgMSA4OTYgNTEyek0xMjgg'+
            'NTEyYTM4NCAzODQgMCAwIDEgNzEuMDQtMjIyLjA4bDUzNS4wNCA1MzUuMDRBMzg0IDM4NCAwIDAgMSAxMjggNTEyeiIgZmls'+
            'bD0iI0ZGMDAwMCIgcC1pZD0iMjg3MCI+PC9wYXRoPjwvc3ZnPg==">'
        var $ban = $(ban)
        $ban.css({"position":"absolute", "top":"17px", "left":"18px", "height":"10px", "width":"10px"})
        $(".bilibili-player-block-filter-type.disabled").find("svg").after($ban)
    },100)

}


(function() {
    'use strict';
    /*
    var css = '.player-auxiliary-area .bpx-player-filter:not(.bpx-player-filter-playlist){display:block!important}'+
        '.player-auxiliary-area .bui-dropdown-name.on{padding-bottom:3px}'+
        '.player-auxiliary-area .bui-dropdown-name:hover{padding-bottom:3px}'+
        '.user-card-m .info .user{margin-bottom:0px!important}'+
        '.user-card-m-exp .user-info-wrapper .info .user{margin-bottom:0px!important}'+
        '.user-card .info .user{margin-bottom:0px!important}';
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    }
    else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    */

    GM_addStyle(`.video-info-detail-list.video-info-detail-content{overflow:visible}
    .video-info-container.higher{height:128px!important}
    `)

    var timer = setInterval(function(){
        if(window.jQuery)
        {
            clearInterval(timer)
            setTimeout(function(){
                v();
            },5000)
        }
    },100)
    })();