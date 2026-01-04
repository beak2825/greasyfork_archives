// ==UserScript==
// @name         恋爱游戏网自动水贴
// @namespace    http://tampermonkey.net/
// @version      2021.02.11.1
// @description  打开首页，自动访问游戏页面，自动填写评论内容，自动识别验证码，自动提交
// @author       PY-DNG
// @icon         https://www.lianaiyx.com/e/data/images/info.jpg
// @include      https://www.lianaiyx.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://greasyfork.org/scripts/408740-%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%914%E4%BD%8D%E6%95%B0%E5%AD%97%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB/code/%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%914%E4%BD%8D%E6%95%B0%E5%AD%97%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB.js?version=837246
// @downloadURL https://update.greasyfork.org/scripts/408735/%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%91%E8%87%AA%E5%8A%A8%E6%B0%B4%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/408735/%E6%81%8B%E7%88%B1%E6%B8%B8%E6%88%8F%E7%BD%91%E8%87%AA%E5%8A%A8%E6%B0%B4%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 基本参数——用户可修改
    // 开发者模式开关（开——显示iframe，关——隐藏iframe）
    const developer = false;
    // 水贴的回复内容，按照格式添加/修改/删除
    // 在进行评论时，"\n"将被替换为换行，"[T]"将被替换为水贴时的时间（添加[T]可有效避免连续提交同样的内容导致的增加评论失败），"[N]"将被替换为游戏名称或攻略标题，"[Y]"将被替换为年份
    // 不要忘了每行最后的英文逗号（最后一行没有逗号）
    const COMMENTS = [
        '看起来很有意思哦，[N]\n————[T]',
        '[N]好像很有趣的样子\n————[T]',
        '我只是单纯的路过... 路过[N]\n————[T]',
        '顶顶顶\n————[T]',
        '感谢大佬的《[N]》资源\n————[T]',
        '为了积分而来的回复...\n————[T]'
    ];
    const NEW_YEAR_WISHES = [
        '[Y]新年好！新年也要水一发～\n————[T]',
        '[Y]年吉祥！\n————于[T]',
        '[Y]，恋网新年好！现在是[T]～',
    ];

    /* 说明
    1. 注意！恋爱游戏网的验证码的格式现在（2020年）是4位纯数字，我可以保证99%的识别正确率（因为在测试中我就没看到过错误），但在将来格式有可能改变（比如加入字母，或者变成6位等等），到时候可能就无法识别了，所以本人不保证对此程序长期的支持！使用本程序即代表已了解并同意本条款。
    2. 本程序仅供学习交流，禁止用于其他用途！使用本程序即代表已了解并同意本条款。
    */

    // 以下的不要随便乱动
    /** DoLog相关函数取自 Ocrosoft 的 Pixiv Previewer
     *  [GitHub]     Ocrosoft: https://github.com/Ocrosoft/
     *  [GreasyFork] Ocrosoft: https://greasyfork.org/zh-CN/users/63073
     *  [GreasyFork] Pixiv Previewer: https://greasyfork.org/zh-CN/scripts/30766
     *  [GitHub]     Pixiv Previewer: https://github.com/Ocrosoft/PixivPreviewer
     **/
    let LogLevel = {
        None: 0,
        Error: 1,
        Warning: 2,
        Info: 3,
        Elements: 4,
    };
    let g_logCount = 0;
    let g_logLevel = LogLevel.Warning;

    function DoLog(level, msgOrElement) {
        if (level <= g_logLevel) {
            let prefix = '%c';
            let param = '';

            if (level == LogLevel.Error) {
                prefix += '[Error]';
                param = 'color:#ff0000';
            } else if (level == LogLevel.Warning) {
                prefix += '[Warning]';
                param = 'color:#ffa500';
            } else if (level == LogLevel.Info) {
                prefix += '[Info]';
                param = 'color:#888888';
            } else if (level == LogLevel.Elements) {
                prefix += 'Elements';
                param = 'color:#000000';
            }

            if (level != LogLevel.Elements) {
                console.log(prefix + msgOrElement, param);
            } else {
                console.log(msgOrElement);
            }

            if (++g_logCount > 512) {
                //console.clear();
                g_logCount = 0;
            }
        }
    }

    // 回显区域
    const headLine = document.getElementsByClassName('menber')[0];
    const blank = document.createElement('a');
    let waterDisplay = document.createElement('a');
    blank.innerText = ' ';
    blank.href = 'javascript:void(0);';
    waterDisplay.href = 'javascript:void(0);';
    waterDisplay.addEventListener('click', maidWork);
    waterDisplay.style.color = 'rgb(100,100,255)';
    headLine.appendChild(blank);
    headLine.appendChild(waterDisplay);

    // 判断今日是否已经水过了
    let d = new Date();
    let fulltime = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
    if(GM_getValue('lastTime', '') === fulltime) {
        waterDisplay.innerText = '今日已水过';
        waterDisplay.style.color = 'green';
    } else {
        maidWork();
    }

    function maidWork() {
        waterDisplay.removeEventListener('click', maidWork);
        waterDisplay.innerText = '少女蓄力中...';
        // 加载网站地图页
        let sitemapPage = document.createElement('iframe');
        sitemapPage.src = 'https://www.lianaiyx.com/sitemap.html';
        if (!developer) {
            // 隐藏iframe不显示。不知道为什么不能用.style.display = 'none'，只要用了就无法正常增加评论，所以干脆迂回，把宽高和边框厚度设置为0px就好
            //sitemapPage.style.display = 'none'; //这一句不能用
            sitemapPage.width = '0px';
            sitemapPage.height = '0px';
            sitemapPage.style.borderWidth = '0px';
        } else {
            //sitemapPage.height = '500px';
            //sitemapPage.width = '800px';
        }
        sitemapPage.onload = function() {
            let count = 0;
            waterDisplay.innerText = '[i/5]少女正在搜寻目标...'.replace('i', String(count));
            const subdoc = sitemapPage.contentWindow.document;
            let commentPage;
            const cpid = 'cp';
            const cponload = function() {
                waterDisplay.innerText = '[i/5]少女已经锁定目标！'.replace('i', String(count));
                commentPage.removeEventListener('load', cponload); // 防止提交后重加载时再次触发事件重复提交
                const subdoc = commentPage.contentWindow.document;
                const title = subdoc.querySelector('.l .arcTitle .yh').innerText.replace('游戏名称：', '');
                const input = subdoc.getElementById('saytext');
                input.value = randcomment(title);
                const codeInput = subdoc.getElementById('key');
                const codeImage = subdoc.getElementById('KeyImgpl');
                const focusEvent = new Event('focus');
                DoLog(LogLevel.Info, '正在水第' + String(count) + '个：' + title);
                waterDisplay.innerText = '[i/5]少女水贴中...'.replace('i', String(count));
                // -------------- 验证码识别填写 --------------
                let codeImageOnload = function() {
                    let code = rec_image(codeImage);
                    if (code) {
                        codeInput.value = code;
                        DoLog(LogLevel.Info, '验证码：' + code);
                        codeImage.removeEventListener('load', codeImageOnload)
                        // 提交
                        subdoc.getElementById('imageField').click();
                        // 等待10秒后再接着水（恋爱游戏网限制评论时间间隔最小为10秒）
                        if (count < 5) {
                            DoLog(LogLevel.Info, '水完了，等待十秒再水下一个');
                            waterDisplay.innerText = '[i/5]少女休息中...'.replace('i', String(count));
                            setTimeout(nextPage, 10000);
                        } else {
                            waterDisplay.innerText = '[5/5]少女水贴大成功！';
                            waterDisplay.style.color = 'green';
                            waterDisplay.addEventListener('click', maidWork);
                            GM_setValue('lastTime', fulltime);
                            DoLog(LogLevel.Info, '水完了，这下是真的水完了');
                        }
                    } else {
                        DoLog(LogLevel.Warning, '识别失败，换验证码重试中...');
                        codeInput.dispatchEvent(focusEvent);
                    }
                }
                codeImage.addEventListener('load', codeImageOnload);
                codeInput.dispatchEvent(focusEvent);
            }
            let all = subdoc.querySelectorAll('td a');
            let a,
            used = [];
            let ban = '栏目 >>游戏图册|栏目 >>游戏CG/截图|栏目 >>Cosplay|栏目 >>同人图';
            nextPage();
            function nextPage() {
                a = all[randint(0, all.length)]
                if (ban.indexOf(a.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].lastChild.innerText) !== -1) {
                    DoLog(LogLevel.Warning, '随机选择：选择不合法，重新选择中...');
                    nextPage();
                    return;
                } else if (used.indexOf(a) !== -1) {
                    DoLog(LogLevel.Elements, [a, used]);
                    DoLog(LogLevel.Warning, '随机选择：选择已用过，重新选择中...');
                    nextPage();
                    return;
                } else {
                    count++;
                    used.push(a);
                    // 每次水贴都换一个iframe，确保重加载不会重复提交（因为测试的时候这个问题实在是太困扰了，干脆双重保险，在及时清除onload事件EventListener的同时，每次都换一个新的iframe用，我看你这个问题还出来不(｡･ω･｡)）
                    if (subdoc.getElementById('cp')) { // 去除可能冲突的元素和上一次水贴时用的iframe
                        subdoc.getElementById('cp').parentElement.removeChild(subdoc.getElementById('cp'))
                    }
                    if (commentPage) {
                        commentPage.id = '';
                        commentPage.src = '';
                    }
                    commentPage = subdoc.createElement('iframe');
                    commentPage.id = 'cp';
                    commentPage.src = a.href;
                    commentPage.addEventListener('load', cponload);
                    subdoc.body.appendChild(commentPage);
                    if (!developer) {
                        //commentPage.style.display = 'none';
                    } else {
                        //commentPage.height = '500px';
                        //commentPage.width = '800px';
                    }
                }
            }
        }
        document.body.appendChild(sitemapPage);
    }

    // 生成随机整数函数
    function randint(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    // 随机返回一条评论
    function randcomment(name) {
        let d = new Date();
        // 时间文本
        let timetext = convertToChinaNum(d.getFullYear()) + "年" + convertToChinaNum(d.getMonth()+1) + "月" + convertToChinaNum(d.getDate()) + "日 " + convertToChinaNum(d.getHours()) + ":" + convertToChinaNum(d.getMinutes()) + ":" + convertToChinaNum(d.getSeconds());
        // 每年的1、2月发新年祝福，其余时间发一般水贴内容
        let allCMTS = d.getMonth() <= 1 && d.getMonth() >= 0 ? NEW_YEAR_WISHES : COMMENTS;
        let comment = allCMTS[randint(0, allCMTS.length - 1)];
        comment = comment
            .replace(/\[N\]/g, name).replace(/\[T\]/g, timetext)
            .replace(/\[Y\]/g, String(1900 + d.getYear()))
            .replace(/\[M\]/g, String(d.getMonth()+1)).replace(/\[D\]/g, String(d.getDate()));
        DoLog(LogLevel.Info, '水贴内容：' + comment);
        return comment;
    }

    // 将数字（整数）转为汉字，从零到一亿亿，需要小数的可自行截取小数点后面的数字直接替换对应arr1的读法就行了
    // 来自xiao_lone的代码，原文：https://blog.csdn.net/xiao_lone/article/details/86607206
    function convertToChinaNum(num) {
        var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
        var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千','万', '十', '百', '千','亿');//可继续追加更高位转换值
        if(!num || isNaN(num)){
            return "零";
        }
        var english = num.toString().split("")
        var result = "";
        for (var i = 0; i < english.length; i++) {
            var des_i = english.length - 1 - i;//倒序排列设值
            result = arr2[i] + result;
            var arr1_index = english[des_i];
            result = arr1[arr1_index] + result;
        }
        //将【零千、零百】换成【零】 【十零】换成【十】
        result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
        //合并中间多个零为一个零
        result = result.replace(/零+/g, '零');
        //将【零亿】换成【亿】【零万】换成【万】
        result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
        //将【亿万】换成【亿】
        result = result.replace(/亿万/g, '亿');
        //移除末尾的零
        result = result.replace(/零+$/, '')
        //将【零一十】换成【零十】
        //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
        //将【一十】换成【十】
        result = result.replace(/^一十/g, '十');
        return result;
    }
})();

