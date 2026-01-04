// ==UserScript==
// @name                bilibili网页视频简介中的链接可以点击
// @namespace           https://greasyfork.org/zh-CN/scripts/409881
// @version             3.2
// @description         增加bilibili网页视频简介文字的交互，部分网页链接、社交平台跳转、邮箱跳转、视频时间跳转、B站直播间跳转、微信号和群号可扫二维码录入手机、百度盘4位密码点击复制
// @description:en      black to blue!
// @author              beibeibeibei
// @match               *.bilibili.com/video/*
// @grant               GM_setClipboard
// @require             https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @require             https://cdn.jsdelivr.net/npm/kjua/dist/kjua.min.js
// @downloadURL https://update.greasyfork.org/scripts/409881/bilibili%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E7%AE%80%E4%BB%8B%E4%B8%AD%E7%9A%84%E9%93%BE%E6%8E%A5%E5%8F%AF%E4%BB%A5%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/409881/bilibili%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E7%AE%80%E4%BB%8B%E4%B8%AD%E7%9A%84%E9%93%BE%E6%8E%A5%E5%8F%AF%E4%BB%A5%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let $ = jQuery.noConflict(); // line11   https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
    let QR = kjua; //////////////// line12   https://cdn.jsdelivr.net/npm/kjua/dist/kjua.min.js


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////22到199行都是识别规则////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //可以点击
    /*  0A*/ let URLreg = /([hH][tT]{2}[pP]([sS]?):\/\/|[wW]{3}.|[wW][aA][pP].|[fF][tT][pP].|[bB]{2}[sS].|[nN][eE][wW][sS].|[bB][lL][oO][gG].)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
    function url2URL(urlstr) {
        let url = urlstr;
        if(urlstr.substring(0,4) != "http"){
            url = "https://" + urlstr;
        }
        return '<a target="_blank" href="' + url + '">' + urlstr + '</a>';
    }
    /*  0B*/ let shorturl = /(?<!https?:\/\/[a-zA-Z0-9]*)([a-zA-Z0-9]+\.)?[a-zA-Z\-]+\.(co(m)?|COM(\.CN)|net|wiki)([-\/a-zA-Z0-9\._?=&]?)+/;
    function url2URL2(url) {
        return '<a target="_blank" href="https://' + url + '">' + url + '</a>';
    }
    /*  1A*/ let BVlink = /(?<![hH][tT]{2}[pP][sS]?:\/\/www.bilibili.com\/video\/)(bv|BV)[A-Za-z0-9]{10}/;
    function BVnum2BVlink(BVnum) {
        return '<a target="_blank" href="//www.bilibili.com/video/' + BVnum + '">' + BVnum + '</a>';
    }
    /*  1B*/ let avlink = /(?<![hH][tT]{2}[pP][sS]?:\/\/www.bilibili.com\/video\/)av[0-9]+/;
    function avnum2avlink(AVnum) {
        return '<a target="_blank" href="//www.bilibili.com/video/' + AVnum + '">' + AVnum + '</a>';
    }
    /*  1C*/ let cvlink = /(?<![hH][tT]{2}[pP][sS]?:\/\/www.bilibili.com\/read\/)cv[1-9][0-9]*/;
    function cvnum2cvlink(cvnum) {
        return '<a target="_blank" href="//www.bilibili.com/read/' + cvnum + '/">' + cvnum + '</a>';
    }
    /*  1D*/ let smlink = /(?<![hH][tT]{2}[pP][sS]?:\/\/www.nicovideo.jp\/watch\/)sm[0-9]+/;
    function smnum2smlink(smnum) {
        return '<a target="_blank" href="http://acg.tv/' + smnum + '/">' + smnum + '</a>';
    }
    /*  1E*/ let bilibililivelink = /([bB]站(小号)?|哔哩哔哩|bilibili|Bilibili)(直播|房)间((房)?号(码)?)?(：|:|——)?[0-9]+|B站[0-9]+直播间|直播间就在b站！房间号：[0-9]+|直播间：B站[0-9]+|哔哩哔哩每(周(一|二|三|四|五|六|日)( )?)+直播( )?房间号( )?[0-9]+/;
    function livestr2livelink(livestr) {
        let livenum = livestr.match(/(?<=([bB]站(小号)?|哔哩哔哩|bilibili|Bilibili)(直播|房)间((房)?号(码)?)?(：|:|——)?)[0-9]+|(?<=[bB]站)[0-9]+(?=直播间)|(?<=直播间就在b站！房间号：)[0-9]+|(?<=直播间：B站)[0-9]+|(?<=哔哩哔哩每(周(一|二|三|四|五|六|日)( )?)+直播( )?房间号( )?)[0-9]+/)[0];
        return '<a target="_blank" href="https://live.bilibili.com/' + livenum + '/">' + livestr + '</a>';
    }
    /*  2A*/ let weibo1 = /((新浪)?(微|官)博(已更名为|名|ID)?|围脖)(@|＠|@ | @|：|：@|: @| \| |:|： |：        )[\-0-9A-Z_a-z\u4e00-\u9fa5]{2,30}/;
    function wbstr2wblink1(wbstr) {
        let wb = wbstr.match(/(?<=((新浪)?(微|官)博(已更名为|名|ID)?|围脖)(@|＠|@ | @|：|：@|: @| \| |:|： |：        ))[\-0-9A-Z_a-z\u4e00-\u9fa5]{2,30}/)[0];
        return '<a target="_blank" href="https://s.weibo.com/user?q=' + wb + '&amp;Refer=weibo_user">' + wbstr + '</a>';
    }
    /*  2B*/ let weibo2 = /(微博【)[\-0-9A-Z_a-z\u4e00-\u9fa5]{2,30}(】)/;
    function wbstr2wblink2(wbstr) {
        let wb = wbstr.match(/(?<=微博【)[\-0-9A-Z_a-z\u4e00-\u9fa5]{2,30}(?=】)/)[0];
        return '<a target="_blank" href="https://s.weibo.com/user?q=' + wb + '&amp;Refer=weibo_user">' + wbstr + '</a>';
    }
    /*  2C*/ let weibo3 = /(@|＠|：|：@)[\-0-9A-Z_a-z\u4e00-\u9fa5]{3,30}( 的微博)/;
    function wbstr2wblink3(wbstr) {
        let wb = wbstr.match(/(?<=(@|＠|：|：@))[\-0-9A-Z_a-z\u4e00-\u9fa5]{3,30}(?= 的微博)/)[0];
        return '<a target="_blank" href="https://s.weibo.com/user?q=' + wb + '&amp;Refer=weibo_user">' + wbstr + '</a>';
    }
    /*  3 */ let youtube = /(youtube|YouTube|Youtube|油管)(频道| ID)?[：|:| ] ?(?!快手)[\-0-9A-Z_a-z\u4e00-\u9fa5【】']+/;
    function ytb2ytblink(ytbstr) {
        let ytb = ytbstr.match(/(?<=(youtube|YouTube|Youtube|油管)(频道| ID)?[：|:| ] ?)[\u4e00-\u9fa5【】']+/)[0];
        return '<a target="_blank" href="https://www.youtube.com/results?search_query=' + ytb + '">' + ytbstr + '</a>';
    }
    //显示二维码，将字符串扫入手机
    /*  4A*/ let WeChat1 = /(联系|添加|群主|客服|工作|我的)微信：?[0-9A-Za-z\u4e00-\u9fa5]+|微信搜一搜：[0-9A-Za-z\u4e00-\u9fa5]+|微信小程序：搜索“[0-9A-Za-z\u4e00-\u9fa5]+”|WX加[0-9A-Za-z\u4e00-\u9fa5]+入群/;
    function wechat2qr1(wechatstr) {
        let wechat = wechatstr.match(/(?<=(联系|添加|群主|客服|工作|我的)微信：?)[0-9A-Za-z\u4e00-\u9fa5]+|(?<=微信搜一搜：)[0-9A-Za-z\u4e00-\u9fa5]+|(?<=微信小程序：搜索“)[0-9A-Za-z\u4e00-\u9fa5]+(?=”)|(?<=WX加)[0-9A-Za-z\u4e00-\u9fa5]+(?=入群)/)[0];
        return '<a class="qrtampermonkey" value="' + wechat + '">' + wechatstr + '</a>';
    }
    /*  4B*/ let WeChat2 = /【联系微信:[0-9A-Za-z\u4e00-\u9fa5]+，非诚勿扰】/;
    function wechat2qr2(wechatstr) {
        let wechat = wechatstr.match(/(?<=【联系微信:)[0-9A-Za-z\u4e00-\u9fa5]+(?=，非诚勿扰】)/)[0];
        return '<a class="qrtampermonkey" value="' + wechat + '">' + wechatstr + '</a>';
    }
    /*  4C*/ let WeChatOfficial1 = /(微信)?公众号(：|:|:  |-)[0-9A-Za-z\u4e00-\u9fa5]{3,30}/;
    function WeChatOfficial2qr1(WeChatOfficialstr) {
        let WeChatOfficial = WeChatOfficialstr.match(/(?<=(微信)?公众号(：|:|:  |-))[0-9A-Za-z\u4e00-\u9fa5]{3,30}/)[0];
        return '<a class="qrtampermonkey" value="' + WeChatOfficial + '">' + WeChatOfficialstr + '</a>';
    }
    /*  4D*/ let WeChatOfficial2 = /(微信)?公众号【[0-9A-Za-z\u4e00-\u9fa5]{3,30}】|(微信)?公众号（[0-9A-Za-z\u4e00-\u9fa5]{3,30}）|(微信)?公众号“[0-9A-Za-z\u4e00-\u9fa5]{3,30}”/;
    function WeChatOfficial2qr2(WeChatOfficialstr) {
        let WeChatOfficial = WeChatOfficialstr.match(/(?<=(微信)?公众号【)[0-9A-Za-z\u4e00-\u9fa5]{3,30}(?=】)|(?<=(微信)?公众号（)[0-9A-Za-z\u4e00-\u9fa5]{3,30}(?=）)|(?<=(微信)?公众号“)[0-9A-Za-z\u4e00-\u9fa5]{3,30}(?=”)/)[0];
        return '<a class="qrtampermonkey" value="' + WeChatOfficial + '">' + WeChatOfficialstr + '</a>';
    }
    /*  5 */ let qqgroup = /[qQ]?[qQ]?(交流)?群(号|号码|交流|【.{0,4}】|1|⑧|⑨|⑩)?(：|~| - |： | |:|: )[0-9]+|群(交流)?[0-9]{6,}|粉丝扣扣大本营一号：[0-9]+|加群吧 【[0-9]+】|搜索QQ群：[\u4e00-\u9fa5]+|群：『[0-9]+』/;
    function qqgroupstr2qr(qqgroupstr) {
        let qqgroupnum = qqgroupstr.match(/(?<=[qQ]?[qQ]?(交流)?群(号|号码|交流|【.{0,4}】|1|⑧|⑨|⑩)?(：|~| - |： | |:|: ))[0-9]{6,}|(?<=群(交流)?)[0-9]{6,}|(?<=粉丝扣扣大本营一号：)[0-9]+|(?<=加群吧 【)[0-9]+(?=】)|(?<=搜索QQ群：)[\u4e00-\u9fa5]+|(?<=群：『)[0-9]+(?=』)/)[0];
        return '<a class="qrtampermonkey" value="' + qqgroupnum + '">' + qqgroupstr + '</a>';
    }
    //其他
    //邮箱链接
    let mailaddress = /[0-9A-Za-z_\-]+@(qq|163|126|gmail|outlook|foxmail|aliyun|rd.netease|global-link-m|bigdongdong).com/;
    /*  6 */ let mail = RegExp(/(商务)?(合作)?(联系)?邮箱(：|:|:：| |：\n)?/.source + mailaddress.source + /|/.source + /商务/.source + mailaddress.source + /|/.source + /(zfb|來信)(：|: )/.source + mailaddress.source);
    function mailstr2mail(mailaddressstr) {
        let mail = mailaddressstr.match(RegExp(/(?<=(商务)?(合作)?(联系)?邮箱(：|:|:：| )?)/.source + mailaddress.source + /|/.source + /(?<=商务)/.source + mailaddress.source + /|/.source + /(?<=(zfb|來信)(：|: ))/.source + mailaddress.source))[0];
        return '<a href="mailto:' + mail + '">' + mailaddressstr + '</a>';
    }
    //时间跳转
    /*  7 */ let videotime1 = /(?<!(上午|下午|日|开播时间:[0-9]{2}:[0-9]{2}-|:)[0-9]?)[0-9]+:[0-9]{2}(?![0-9])(?!(:|左右开始到凌晨))/; //时间数字串，修改视频进度条 //暂时还不支持3个冒号的？？？
    function changevideotime1(time){
        let text = time.split(":");
        let value = text[0] * 60 + text[1] * 1;
        return '<a class="timetampermonkey" value="' + value + '">' + time + '</a>';
    }
    /*  8 */ let videotime2 = /(?<!(前|长按|命运)[0-9]?)([0-9]{1,2}分[0-9]{1,2}秒|[0-9]{1,2}分|[0-9]{1,2}秒)(?!神剧|忍者)/; //时间数字文字组合串，修改视频进度条
    function changevideotime2(time) {
        let timetest_m_s = time.split(/[分秒]/);
        let timetest_m = time.split(/[分]/);
        let timetest_s = time.split(/[秒]/);
        let value = 0;
        if (timetest_m_s.toString() == timetest_m.toString()) { // 例子：2分
            value = timetest_m[0] * 60;
        } else if (timetest_m_s.toString() == timetest_s.toString()) { // 例子：2秒
            value = timetest_s[0] * 1;
        } else { // 剩下的就是分秒都有 例子：1分01秒
            value = timetest_m_s[0] * 60 + timetest_m_s[1] * 1;
        }
        return '<a class="timetampermonkey" value="' + value + '">' + time + '</a>';
    }
    //密码点击复制
    /*  9 */ let four_digit_password = /密码(：|: )[0-9a-z]{4}/;
    function copy_password(text) {
        let password = text.match(/(?<=密码(：|: ))[0-9a-z]{4}/)[0];
        return '<a class="copytampermonkey" title="点击复制" value="' + password + '">' + text + '</a>';
    }
    //删除重复文字 //修复up主口吃的问题
    /* 10A*/ let repeatWORD1 = /(三连( )?|三连啊|求三连|求三连！！！|三连~|三连我！|一件三连叭~~~|三连点赞！！！！！|三连关注！|关注|求关注|求关注！！！|关注我！|评论我！|收藏( )?|不要白嫖！|不要白嫖！！！！|求求惹~|舒服了|\n\n\n|啊啊啊|给个赞吧)\1+/;
    function NOrepeat1(repeatstr) {
        repeatstr.match(new RegExp(repeatWORD1));
        return RegExp.$1;
    }
    /* 10B*/ let repeatWORD2 = /(三)\1+(连)/;
    function NOrepeat2(repeatstr) {
        repeatstr.match(new RegExp(repeatWORD2));
        return RegExp.$1 + RegExp.$2;
    }
    /* 10C*/ let repeatWORD3 = /(关)\1+(注)(?!注)/;
    function NOrepeat3(repeatstr) {
        repeatstr.match(new RegExp(repeatWORD3));
        return RegExp.$1 + RegExp.$2;
    }
    /* 10D*/ let repeatWORD4 = /(关)\1+(注)\2+/;
    function NOrepeat4(repeatstr) {
        repeatstr.match(new RegExp(repeatWORD3));
        return RegExp.$1 + RegExp.$2;
    }
    /* 10E*/ let repeatWORD5 = /(三连一定|一键三连哦|关注)(！)\2+/;
    function NOrepeat5(repeatstr) {
        repeatstr.match(new RegExp(repeatWORD3));
        return RegExp.$1 + RegExp.$2;
    }

    let R = [
        /*  0A*/[URLreg, url2URL],
        /*  0B*/[shorturl, url2URL2],
        /*  1A*/[BVlink, BVnum2BVlink],
        /*  1B*/[avlink, avnum2avlink],
        /*  1C*/[cvlink, cvnum2cvlink],
        /*  1D*/[smlink, smnum2smlink],
        /*  1E*/[bilibililivelink, livestr2livelink],
        /*  2A*/[weibo1, wbstr2wblink1],
        /*  2B*/[weibo2, wbstr2wblink2],
        /*  2C*/[weibo3, wbstr2wblink3],
        /*  3 */[youtube, ytb2ytblink],
        /*  4A*/[WeChat1, wechat2qr1],
        /*  4B*/[WeChat2, wechat2qr2],
        /*  4C*/[WeChatOfficial1, WeChatOfficial2qr1],
        /*  4D*/[WeChatOfficial2, WeChatOfficial2qr2],
        /*  5 */[qqgroup, qqgroupstr2qr],
        /*  6 */[mail, mailstr2mail],
        /*  7 */[videotime1, changevideotime1],
        /*  8 */[videotime2, changevideotime2],
        /*  9 */[four_digit_password, copy_password],
        /* 10A*/[repeatWORD1, NOrepeat1],
        /* 10B*/[repeatWORD2, NOrepeat2],
        /* 10C*/[repeatWORD3, NOrepeat3],
        /* 10D*/[repeatWORD4, NOrepeat4],
        /* 10E*/[repeatWORD5, NOrepeat5],
    ];


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////199行////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function core(text, REG) {
        function 获取正则匹配结果(文本, 正则, 处理函数, 结果组) {
            if (正则 === undefined) {
                return false;
            }
            let Reg = new RegExp(正则.source, "g");//每次都是新正则，避免lastIndex问题
            //命中正则
            let result;
            while (result = Reg.exec(文本)) {//命中一次正则，添加一个结果组
                //console.log("匹配文本为：" + result[0] + " 位置为:" + result.index + " 下次查找的起始位置：" + Reg.lastIndex);
                结果组.push([[Reg], [处理函数], result.index, Reg.lastIndex]);
            }
        }

        //准备文本
        //let text = "江南可采莲，莲叶何田田。鱼戏莲叶间。\n鱼戏莲叶东，鱼戏莲叶西，鱼戏莲叶南，鱼戏莲叶北。";
        //准备匹配结果
        let hit_array = [];
        //准备正则组
        // let REG = [
        //     [/鱼/, function a(fish) { return '白' + fish; }],
        //     [/莲/, function b(lotus) { return '青' + lotus; }],
        //     [/莲叶/, function c(lotus_leaf) { return lotus_leaf.replace('叶', '池');; }],
        //     [/戏莲叶/, function d(play_lotus_leaf) { return '游' + play_lotus_leaf.replace('戏', '游');; }],
        // ];
        //遍历正则组，输出匹配结果到hit_array //生成0列正则列、1列处理函数列、2列和3列正则命中文本的开头位置和结尾位置
        for (let i = 0; i < REG.length; i++) {
            获取正则匹配结果(text, REG[i][0], REG[i][1], hit_array);
        }
        //排序匹配结果
        hit_array = hit_array.sort(function (x, y) { return x[2] - y[2]; }); // 列：0、1、2、3

        //标记hit_array中的冲突结果并push到clash_array中//根据标记删除hit_array中的整行冲突结果 // 列：0、1、2、3和"clash"列
        let clash_array = [];
        for (let i = 0; i < hit_array.length - 1; i++) {
            if (hit_array[i][3] > hit_array[i + 1][2]) {
                if (clash_array.indexOf(hit_array[i]) == -1) {
                    clash_array.push(hit_array[i]);
                }
                if (clash_array.indexOf(hit_array[i + 1]) == -1) {
                    clash_array.push(hit_array[i + 1]);
                }
                hit_array[i].push("clash");
                hit_array[i + 1].push("clash");
            }
        }
        for (let i = hit_array.length - 1; i > -1; i--) {
            if (hit_array[i][4] == "clash") {
                hit_array.splice(i, 1);
            }
        }
        //标记并合并clash_array中的冲突结果 //删除"clash"列并添加组合命中位置列2列
        for (let i = 0; i < clash_array.length; i++) {//删除"clash"(尾部对齐)
            clash_array[i].length = 4;
        }
        for (let i = 0; i < clash_array.length; i++) {//所有数据如果与之前有冲突，则添加冲突开头数字
            for (let j = i + 1; j < clash_array.length; j++) {
                if (clash_array[i][3] > clash_array[j][2]) {
                    clash_array[j].push(clash_array[i][2]);
                }
            }
        }
        for (let i = 0; i < clash_array.length; i++) {//第一个冲突数据，添加开头数字
            if (clash_array[i].length == 4) {
                clash_array[i].push(clash_array[i][2]);
            }
        }
        for (let i = 0; i < clash_array.length; i++) {//删除多余的数字(尾部对齐)
            if (clash_array[i].length > 5) {
                clash_array[i].length = 5;
            }
        }
        if (clash_array.length > 0) {//添加结尾数字
            let max = clash_array[clash_array.length - 1][3];
            for (let i = clash_array.length - 1; i > 0; i--) {
                clash_array[i].push(max);
                if (clash_array[i][4] != clash_array[i - 1][4]) {
                    max = clash_array[i - 1][3];
                }
            }
            clash_array[0].push(max);
        }
        //合并正则 // 0、1、正则命中列替换成组合命中列2列
        for (let i = clash_array.length - 1; i > 0; i--) {
            if (clash_array[i][4] == clash_array[i - 1][4]) {
                clash_array[i - 1][0] = clash_array[i - 1][0].concat(clash_array[i][0]);
                clash_array[i - 1][1] = clash_array[i - 1][1].concat(clash_array[i][1]);
                clash_array[i - 1][2] = clash_array[i - 1][4];
                clash_array[i - 1][3] = clash_array[i - 1][5];
                clash_array.splice(i, 1);
            }
        }
        for (let i = 0; i < clash_array.length; i++) {//删除多余的数字(尾部对齐)
            clash_array[i].length = 4;
        }

        //补全其他未命中正则的普通字符串位置 //0、1、2、3
        let result_array = hit_array.concat(clash_array).sort(function (x, y) { return x[2] - y[2]; });
        if (result_array.length == 0) {
            result_array = [[[], [], 0, text.length]];
        } else {
            if (result_array[0][2] != 0) {//补开头
                result_array.unshift([[], [], 0, result_array[0][2]]);
            }
            for (let i = result_array.length - 2; i > -1; i--) {//补中间
                if (result_array[i][3] != result_array[i + 1][2]) {
                    result_array.splice(i + 1, 0, [[], [], result_array[i][3], result_array[i + 1][2]]);
                }
            }
            if (result_array[result_array.length - 1][3] != text.length) {//补结尾
                result_array.push([[], [], result_array[result_array.length - 1][3], text.length]);
            }
        }
        //添加处理后的文本，索引4 // 0、1、2、3、4
        for (let i = 0; i < result_array.length; i++) {
            let subtext = text.substring(result_array[i][2], result_array[i][3]);
            if (result_array[i][0].length == 0) {
                result_array[i].push([subtext]);
            } else if (result_array[i][0].length == 1) {
                result_array[i].push([result_array[i][1][0](subtext)]);
            } else {
                let str_array = [];
                for (let j = 0; j < result_array[i][0].length; j++) {
                    let index1 = result_array[i][2];
                    let index2 = subtext.match(new RegExp(result_array[i][0][j].source)).index + index1;
                    let index3 = subtext.match(new RegExp(result_array[i][0][j].source))[0].length + index2;
                    let index4 = result_array[i][3];
                    str_array.push(text.substring(index1, index2) + result_array[i][1][j](subtext.match(new RegExp(result_array[i][0][j].source))[0]) + text.substring(index3, index4));
                }
                result_array[i].push(str_array);
            }

        }
        //添加处理前的文本，索引5 // 0、1、2、3、4、5
        for (let i = 0; i < result_array.length; i++) {
            result_array[i].push(text.substring(result_array[i][2], result_array[i][3]));
        }
        //文本处理结果
        let final_text = "";
        for (let i = 0; i < result_array.length; i++) {
            if (result_array[i][0].length <= 1) {
                final_text = final_text + result_array[i][4][0];
            } else {
                final_text = final_text + '<a class="clashresulttampermonkey" title="正则冲突，点击显示多个处理结果" showbool="false" value="' + i + '">' + result_array[i][5] + '</a>';
            }
        }
        //打印结果
        // console.log("//hit_array");
        // console.table(hit_array);
        // console.log("//clash_array");
        // console.table(clash_array);
        // console.log("//result_array");
        // console.table(result_array);
        // console.log("//final_text");
        // console.log(final_text);
        return [result_array, final_text];
    }

    function main() {
        //获取原简介内容
        let text = $("#v_desc > div.desc-info").text();
        let core_result = core(text,R);
        let result_array = core_result[0];
        let infotampermonkey = core_result[1];

        //添加a标签的颜色样式和鼠标悬浮颜色样式
        let infotampermonkeystyle =
            "<style>" +
            ".video-desc .infotampermonkey a {color: #00a1d6}" +
            ".video-desc .infotampermonkey a:hover {color: #f25d8e}" +
            "</style>";

        //准备一个div用于存放二维码图片
        let qrcode_div = '<div id="qrcodetampermonkey" style="border: 1px solid rgb(0, 161, 214); border-radius: 4px; z-index: 1001; position: absolute; top: 0px; left: -300px;"></div>';

        //准备一个div用于存放冲突的选项
        let clash_div = '<div id="clashtampermonkey" style="border: 1px solid rgb(0, 161, 214); border-radius: 4px; padding: 4px; background-color: rgba(255, 255, 255, 1); z-index: 1001; position: absolute; top: 0px; left: -300px;"></div>';

        //在旧简介div后添加一个新的简介div
        if ($("#v_desc > div.desc-infotampermonkey").length == 0) {
            $("#v_desc > div.desc-info").after('<div class="infotampermonkey" style="white-space: pre-line; overflow: hidden;">' + infotampermonkeystyle + qrcode_div + clash_div + infotampermonkey + '</div>');
        }

        //隐藏旧简介div
        //$("#v_desc > div.desc-info").hide(); //使用hide()用导致"展开更多"按钮消失
        //$("#v_desc > div.desc-info").css("height",0);//重新设置高度也会导致"展开更多"按钮消失
        $("#v_desc > div.desc-info").css({"position":"absolute","top":"-9999px","left":"-9999px"});
        //新简介使用和旧简介一样的元素高度
        $("#v_desc > div.desc-infotampermonkey").css("height", $("#v_desc > div.desc-info").css("height"));
        $("#v_desc > div.desc-infotampermonkey").css("width", $("#v_desc > div.desc-info").css("width"));

        //给需要显示二维码的元素添加鼠标悬浮显示二维码的效果
        $(".qrtampermonkey").hover(function () {
            let qrtext = $(this).attr("value");
            $("#qrcodetampermonkey").append(QR({ text: qrtext, fill: '#00a1d6', size: 100, ecLevel: 'L', rounded: 40 }));
            $("#qrcodetampermonkey").css({ "top": $(this).position().top + $(this).height(), "left": $(this).position().left + $(this).width() });
            $("#qrcodetampermonkey").show();
        }, function () {
            $("#qrcodetampermonkey").hide();
            $("#qrcodetampermonkey").empty();
        });

        //给需要修改视频时间的元素添加点击事件
        $(document).on("click", ".timetampermonkey", function () {
            let time = $(this).attr("value");
            $("video")[0].currentTime = time;
        });

        //给需要触发复制的元素添加点击事件
        $(document).on("click", ".copytampermonkey", function () {
            let copy_text = $(this).attr("value");
            GM_setClipboard(copy_text);

            $(this).after('<a id="alert_after_copy" style="color:black;">（已复制）</a>');
            setTimeout(function () {
                $("#alert_after_copy").remove();
            }, 2500)
        });

        //给需要触发冲突的元素添加点击事件
        $(document).on("click", ".clashresulttampermonkey", function () {
            let index = $(this).attr("value");
            let clash_array = result_array[index];
            if($(this).attr("showbool")=="false"){
                $(this).attr("showbool","true");
                for(let i=0;i<clash_array[0].length;i++){
                    $("#clashtampermonkey").append(clash_array[4][i] + "<br>");
                }
                $("#clashtampermonkey").css({ "top": $(this).position().top + $(this).height(), "left": $(this).position().left + $(this).width() });
                $("#clashtampermonkey").show();
            }else if($(this).attr("showbool")=="true"){
                $(this).attr("showbool","false");
                $("#clashtampermonkey").hide();
                $("#clashtampermonkey").empty();
            }
        });
    }

    function debounce(fn, delay) {
        delay = delay || 10;
        let handle;
        return function (e) {
            clearTimeout(handle);
            handle = setTimeout(() => {
                fn(e);
            }, delay);
        }
    }



    $(document).on("DOMNodeInserted", "#v_desc > div.desc-info", debounce(main));
    //给"展开更多"、"收起"按钮添加点击事件，让按钮可以像控制旧简介div高度一样控制新简介div高度
    let flag = true;//显示"展开更多"就是true，默认就是true
    $(document).on("click", "#v_desc > div.btn", function () {
        if (flag) {
            $("#v_desc > div.desc-infotampermonkey").css("height", "auto");
            flag = false;
        } else {
            $("#v_desc > div.desc-infotampermonkey").css("height", "63px");
            flag = true;
        }
    });

    //点击其他位置时关闭冲突弹窗
    $(document).click(function(){
        if (event.target.className !== "clashresulttampermonkey") {
            $(".clashresulttampermonkey").attr("showbool","false");
            $("#clashtampermonkey").hide();
            $("#clashtampermonkey").empty();
        }
    });



})();

//搜索框占行
//搜索...:                                                                       □ .* □ Aa   查找下一个   查找上一个   关闭