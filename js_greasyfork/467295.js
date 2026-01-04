// ==UserScript==
// @name                ChatGPT学习通作业考试助手
// @version             2.9.1
// @description         本脚本【纯ChatGPT回复答案】 原作者:Ne-21【🥇操作简单】ChatGPT学习通助手，安装即可使用；推荐使用作业、考试自动答题【✨版本特性】版本特性:无题库数据库,全采用ChatGPT回复答案
// @match               *://*.chaoxing.com/*
// @connect             911285.xyz
// @connect             gptjs.808860.xyz
// @run-at              document-end
// @grant               unsafeWindow
// @grant               GM_xmlhttpRequest
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_info
// @grant               GM_getResourceText
// @require             https://greasyfork.org/scripts/445293/code/TyprMd5.js
// @require             https://unpkg.com/sweetalert2@11.1.0/dist/sweetalert2.all.min.js
// @require             https://unpkg.com/jquery@3.7.1/dist/jquery.js
// @resource            Table https://www.forestpolice.org/ttf/2.0/table.json
// @icon                data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2Utd2lkdGg9IjEuNSIgY2xhc3M9ImgtNiB3LTYiIHJvbGU9ImltZyI+PHRpdGxlPkNoYXRHUFQ8L3RpdGxlPjx0ZXh0IHg9Ii05OTk5IiB5PSItOTk5OSI+Q2hhdEdQVDwvdGV4dD48cGF0aCBkPSJNMzcuNTMyNCAxNi44NzA3QzM3Ljk4MDggMTUuNTI0MSAzOC4xMzYzIDE0LjA5NzQgMzcuOTg4NiAxMi42ODU5QzM3Ljg0MDkgMTEuMjc0NCAzNy4zOTM0IDkuOTEwNzYgMzYuNjc2IDguNjg2MjJDMzUuNjEyNiA2LjgzNDA0IDMzLjk4ODIgNS4zNjc2IDMyLjAzNzMgNC40OTg1QzMwLjA4NjQgMy42Mjk0MSAyNy45MDk4IDMuNDAyNTkgMjUuODIxNSAzLjg1MDc4QzI0Ljg3OTYgMi43ODkzIDIzLjcyMTkgMS45NDEyNSAyMi40MjU3IDEuMzYzNDFDMjEuMTI5NSAwLjc4NTU3NSAxOS43MjQ5IDAuNDkxMjY5IDE4LjMwNTggMC41MDAxOTdDMTYuMTcwOCAwLjQ5NTA0NCAxNC4wODkzIDEuMTY4MDMgMTIuMzYxNCAyLjQyMjE0QzEwLjYzMzUgMy42NzYyNCA5LjM0ODUzIDUuNDQ2NjYgOC42OTE3IDcuNDc4MTVDNy4zMDA4NSA3Ljc2Mjg2IDUuOTg2ODYgOC4zNDE0IDQuODM3NyA5LjE3NTA1QzMuNjg4NTQgMTAuMDA4NyAyLjczMDczIDExLjA3ODIgMi4wMjgzOSAxMi4zMTJDMC45NTY0NjQgMTQuMTU5MSAwLjQ5ODkwNSAxNi4yOTg4IDAuNzIxNjk4IDE4LjQyMjhDMC45NDQ0OTIgMjAuNTQ2NyAxLjgzNjEyIDIyLjU0NDkgMy4yNjggMjQuMTI5M0MyLjgxOTY2IDI1LjQ3NTkgMi42NjQxMyAyNi45MDI2IDIuODExODIgMjguMzE0MUMyLjk1OTUxIDI5LjcyNTYgMy40MDcwMSAzMS4wODkyIDQuMTI0MzcgMzIuMzEzOEM1LjE4NzkxIDM0LjE2NTkgNi44MTIzIDM1LjYzMjIgOC43NjMyMSAzNi41MDEzQzEwLjcxNDEgMzcuMzcwNCAxMi44OTA3IDM3LjU5NzMgMTQuOTc4OSAzNy4xNDkyQzE1LjkyMDggMzguMjEwNyAxNy4wNzg2IDM5LjA1ODcgMTguMzc0NyAzOS42MzY2QzE5LjY3MDkgNDAuMjE0NCAyMS4wNzU1IDQwLjUwODcgMjIuNDk0NiA0MC40OTk4QzI0LjYzMDcgNDAuNTA1NCAyNi43MTMzIDM5LjgzMjEgMjguNDQxOCAzOC41NzcyQzMwLjE3MDQgMzcuMzIyMyAzMS40NTU2IDM1LjU1MDYgMzIuMTExOSAzMy41MTc5QzMzLjUwMjcgMzMuMjMzMiAzNC44MTY3IDMyLjY1NDcgMzUuOTY1OSAzMS44MjFDMzcuMTE1IDMwLjk4NzQgMzguMDcyOCAyOS45MTc4IDM4Ljc3NTIgMjguNjg0QzM5Ljg0NTggMjYuODM3MSA0MC4zMDIzIDI0LjY5NzkgNDAuMDc4OSAyMi41NzQ4QzM5Ljg1NTYgMjAuNDUxNyAzOC45NjM5IDE4LjQ1NDQgMzcuNTMyNCAxNi44NzA3Wk0yMi40OTc4IDM3Ljg4NDlDMjAuNzQ0MyAzNy44ODc0IDE5LjA0NTkgMzcuMjczMyAxNy42OTk0IDM2LjE1MDFDMTcuNzYwMSAzNi4xMTcgMTcuODY2NiAzNi4wNTg2IDE3LjkzNiAzNi4wMTYxTDI1LjkwMDQgMzEuNDE1NkMyNi4xMDAzIDMxLjMwMTkgMjYuMjY2MyAzMS4xMzcgMjYuMzgxMyAzMC45Mzc4QzI2LjQ5NjQgMzAuNzM4NiAyNi41NTYzIDMwLjUxMjQgMjYuNTU0OSAzMC4yODI1VjE5LjA1NDJMMjkuOTIxMyAyMC45OThDMjkuOTM4OSAyMS4wMDY4IDI5Ljk1NDEgMjEuMDE5OCAyOS45NjU2IDIxLjAzNTlDMjkuOTc3IDIxLjA1MiAyOS45ODQyIDIxLjA3MDcgMjkuOTg2NyAyMS4wOTAyVjMwLjM4ODlDMjkuOTg0MiAzMi4zNzUgMjkuMTk0NiAzNC4yNzkxIDI3Ljc5MDkgMzUuNjg0MUMyNi4zODcyIDM3LjA4OTIgMjQuNDgzOCAzNy44ODA2IDIyLjQ5NzggMzcuODg0OVpNNi4zOTIyNyAzMS4wMDY0QzUuNTEzOTcgMjkuNDg4OCA1LjE5NzQyIDI3LjcxMDcgNS40OTgwNCAyNS45ODMyQzUuNTU3MTggMjYuMDE4NyA1LjY2MDQ4IDI2LjA4MTggNS43MzQ2MSAyNi4xMjQ0TDEzLjY5OSAzMC43MjQ4QzEzLjg5NzUgMzAuODQwOCAxNC4xMjMzIDMwLjkwMiAxNC4zNTMyIDMwLjkwMkMxNC41ODMgMzAuOTAyIDE0LjgwODggMzAuODQwOCAxNS4wMDczIDMwLjcyNDhMMjQuNzMxIDI1LjExMDNWMjguOTk3OUMyNC43MzIxIDI5LjAxNzcgMjQuNzI4MyAyOS4wMzc2IDI0LjcxOTkgMjkuMDU1NkMyNC43MTE1IDI5LjA3MzYgMjQuNjk4OCAyOS4wODkzIDI0LjY4MjkgMjkuMTAxMkwxNi42MzE3IDMzLjc0OTdDMTQuOTA5NiAzNC43NDE2IDEyLjg2NDMgMzUuMDA5NyAxMC45NDQ3IDM0LjQ5NTRDOS4wMjUwNiAzMy45ODExIDcuMzg3ODUgMzIuNzI2MyA2LjM5MjI3IDMxLjAwNjRaTTQuMjk3MDcgMTMuNjE5NEM1LjE3MTU2IDEyLjA5OTggNi41NTI3OSAxMC45MzY0IDguMTk4ODUgMTAuMzMyN0M4LjE5ODg1IDEwLjQwMTMgOC4xOTQ5MSAxMC41MjI4IDguMTk0OTEgMTAuNjA3MVYxOS44MDhDOC4xOTM1MSAyMC4wMzc4IDguMjUzMzQgMjAuMjYzOCA4LjM2ODIzIDIwLjQ2MjlDOC40ODMxMiAyMC42NjE5IDguNjQ4OTMgMjAuODI2NyA4Ljg0ODYzIDIwLjk0MDRMMTguNTcyMyAyNi41NTQyTDE1LjIwNiAyOC40OTc5QzE1LjE4OTQgMjguNTA4OSAxNS4xNzAzIDI4LjUxNTUgMTUuMTUwNSAyOC41MTczQzE1LjEzMDcgMjguNTE5MSAxNS4xMTA3IDI4LjUxNiAxNS4wOTI0IDI4LjUwODJMNy4wNDA0NiAyMy44NTU3QzUuMzIxMzUgMjIuODYwMSA0LjA2NzE2IDIxLjIyMzUgMy41NTI4OSAxOS4zMDQ2QzMuMDM4NjIgMTcuMzg1OCAzLjMwNjI0IDE1LjM0MTMgNC4yOTcwNyAxMy42MTk0Wk0zMS45NTUgMjAuMDU1NkwyMi4yMzEyIDE0LjQ0MTFMMjUuNTk3NiAxMi40OTgxQzI1LjYxNDIgMTIuNDg3MiAyNS42MzMzIDEyLjQ4MDUgMjUuNjUzMSAxMi40Nzg3QzI1LjY3MjkgMTIuNDc2OSAyNS42OTI4IDEyLjQ4MDEgMjUuNzExMSAxMi40ODc5TDMzLjc2MzEgMTcuMTM2NEMzNC45OTY3IDE3Ljg0OSAzNi4wMDE3IDE4Ljg5ODIgMzYuNjYwNiAyMC4xNjEzQzM3LjMxOTQgMjEuNDI0NCAzNy42MDQ3IDIyLjg0OSAzNy40ODMyIDI0LjI2ODRDMzcuMzYxNyAyNS42ODc4IDM2LjgzODIgMjcuMDQzMiAzNS45NzQzIDI4LjE3NTlDMzUuMTEwMyAyOS4zMDg2IDMzLjk0MTUgMzAuMTcxNyAzMi42MDQ3IDMwLjY2NDFDMzIuNjA0NyAzMC41OTQ3IDMyLjYwNDcgMzAuNDczMyAzMi42MDQ3IDMwLjM4ODlWMjEuMTg4QzMyLjYwNjYgMjAuOTU4NiAzMi41NDc0IDIwLjczMjggMzIuNDMzMiAyMC41MzM4QzMyLjMxOSAyMC4zMzQ4IDMyLjE1NCAyMC4xNjk4IDMxLjk1NSAyMC4wNTU2Wk0zNS4zMDU1IDE1LjAxMjhDMzUuMjQ2NCAxNC45NzY1IDM1LjE0MzEgMTQuOTE0MiAzNS4wNjkgMTQuODcxN0wyNy4xMDQ1IDEwLjI3MTJDMjYuOTA2IDEwLjE1NTQgMjYuNjgwMyAxMC4wOTQzIDI2LjQ1MDQgMTAuMDk0M0MyNi4yMjA2IDEwLjA5NDMgMjUuOTk0OCAxMC4xNTU0IDI1Ljc5NjMgMTAuMjcxMkwxNi4wNzI2IDE1Ljg4NThWMTEuOTk4MkMxNi4wNzE1IDExLjk3ODMgMTYuMDc1MyAxMS45NTg1IDE2LjA4MzcgMTEuOTQwNUMxNi4wOTIxIDExLjkyMjUgMTYuMTA0OCAxMS45MDY4IDE2LjEyMDcgMTEuODk0OUwyNC4xNzE5IDcuMjUwMjVDMjUuNDA1MyA2LjUzOTAzIDI2LjgxNTggNi4xOTM3NiAyOC4yMzgzIDYuMjU0ODJDMjkuNjYwOCA2LjMxNTg5IDMxLjAzNjQgNi43ODA3NyAzMi4yMDQ0IDcuNTk1MDhDMzMuMzcyMyA4LjQwOTM5IDM0LjI4NDIgOS41Mzk0NSAzNC44MzM0IDEwLjg1MzFDMzUuMzgyNiAxMi4xNjY3IDM1LjU0NjQgMTMuNjA5NSAzNS4zMDU1IDE1LjAxMjhaTTE0LjI0MjQgMjEuOTQxOUwxMC44NzUyIDE5Ljk5ODFDMTAuODU3NiAxOS45ODkzIDEwLjg0MjMgMTkuOTc2MyAxMC44MzA5IDE5Ljk2MDJDMTAuODE5NSAxOS45NDQxIDEwLjgxMjIgMTkuOTI1NCAxMC44MDk4IDE5LjkwNThWMTAuNjA3MUMxMC44MTA3IDkuMTgyOTUgMTEuMjE3MyA3Ljc4ODQ4IDExLjk4MTkgNi41ODY5NkMxMi43NDY2IDUuMzg1NDQgMTMuODM3NyA0LjQyNjU5IDE1LjEyNzUgMy44MjI2NEMxNi40MTczIDMuMjE4NjkgMTcuODUyNCAyLjk5NDY0IDE5LjI2NDkgMy4xNzY3QzIwLjY3NzUgMy4zNTg3NiAyMi4wMDg5IDMuOTM5NDEgMjMuMTAzNCA0Ljg1MDY3QzIzLjA0MjcgNC44ODM3OSAyMi45MzcgNC45NDIxNSAyMi44NjY4IDQuOTg0NzNMMTQuOTAyNCA5LjU4NTE3QzE0LjcwMjUgOS42OTg3OCAxNC41MzY2IDkuODYzNTYgMTQuNDIxNSAxMC4wNjI2QzE0LjMwNjUgMTAuMjYxNiAxNC4yNDY2IDEwLjQ4NzcgMTQuMjQ3OSAxMC43MTc1TDE0LjI0MjQgMjEuOTQxOVpNMTYuMDcxIDE3Ljk5OTFMMjAuNDAxOCAxNS40OTc4TDI0LjczMjUgMTcuOTk3NVYyMi45OTg1TDIwLjQwMTggMjUuNDk4M0wxNi4wNzEgMjIuOTk4NVYxNy45OTkxWiIgZmlsbD0iY3VycmVudENvbG9yIj48L3BhdGg+PC9zdmc+
// @homepage            https://scriptcat.org/script-show-page/1027
// @namespace https://greasyfork.org/users/943543
// @downloadURL https://update.greasyfork.org/scripts/511585/ChatGPT%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/511585/ChatGPT%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


/*********************************自定义配置区******************************************************** */
var setting = {
    showBox: 1,     // 显示脚本浮窗，0为关闭，1为开启，不建议关闭
    maskImg: 1,     // 显示皮卡丘，0为关闭，1为开启，默认开启，无实质作用，只是为了减少睿智问题

    task: 0,        // 只处理任务点任务，0为关闭，1为开启

    video: 1,       // 处理视频，0为关闭，1为开启
    audio: 1,       // 处理音频，0为关闭，1为开启
    rate: 1,        // 视频/音频倍速，0为秒过，1为正常速率，最高16倍
    review: 0,      // 复习模式，0为关闭，1为开启可以补挂视频时长

    work: 1,        // 测验自动处理，0为关闭，1为开启，开启将会处理测验，关闭会跳过测验
    time: 2500,     // 答题时间间隔，默认5s=5000
    sub: 0,         // 测验自动提交，0为关闭,1为开启，当没答案时测验将不会提交，如需提交请设置force：1
    force: 0,       // 测验强制提交，0为关闭，1为开启，开启此功能将会强制提交测验（无论作答与否）
    share: 0,       // 自动收录答案，0为关闭，1为开启，推荐开启，会在相应页面自动收录答案
    decrypt: 1,     // 字体解密，0为关闭，1为开启，推荐开启，方法来自wyn665817大佬

    examTurn: 0,     // 考试自动跳转下一题，0为关闭，1为开启
    examTurnTime: 0, // 考试自动跳转下一题随机间隔时间(3-7s)之间，0为关闭，1为开启
    goodStudent: 1,  // 好学生模式,不自动选择答案,仅将单选题和多选题的ABCD加粗
    alterTitle: 1,  //修改题目,将AI回复的答案插入题目中,不建议关闭,AI回复不能完全匹配答案,题目显示答案供手动选择

    autoLogin: 0,   // 自动登录，0为关闭，1为开启，开启此功能请配置登陆配置项
    phone: '',      // 登录配置项：登录手机号/超星号
    password: ''    // 登录配置项：登录密码
}
/************************************************************************************************** */
/*
                  _    _                    _   _              ___  __
     /\          | |  | |                  | \ | |            |__ \/_ |
    /  \   _   _ | |_ | |__    ___   _ __  |  \| |  ___  ______  ) || |
   / /\ \ | | | || __|| '_ \  / _ \ | '__| | . ` | / _ \|______|/ / | |
  / ____ \| |_| || |_ | | | || (_) || |    | |\  ||  __/       / /_ | |
 /_/    \_\\__,_| \__||_| |_| \___/ |_|    |_| \_| \___|      |____||_|

  TG：https://t.me/+REKHQoWVJh45MDg1   Date：20240914

*/
/************************************************************************************************** */


var _w = unsafeWindow,
    _l = location,
    _d = _w.document,
    $ = _w.jQuery || top.jQuery,
    md5 = md5 || window.md5,
    UE = _w.UE,
    Swal = Swal || window.Swal;

// 多域名候选及自动测速选择
var HOST_CANDIDATES = [
    "https://911285.xyz",
    "https://gptjs.808860.xyz"
    // 如需新增域名，请在此处追加，例如："https://your.new.domain"
];

// 读取缓存的域名与时间戳
var _cachedHost = localStorage.getItem('GPTJsSetting.hostSelected');
var _cachedAt = parseInt(localStorage.getItem('GPTJsSetting.hostSelectedAt') || '0');
// 初始 _host：优先使用缓存，否则使用第一个候选
var _host = _cachedHost || HOST_CANDIDATES[0];

function pingHost(host) {
    return new Promise(function (resolve, reject) {
        var startAt = Date.now();
        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: host + '/api/v1/tips?ts=' + startAt,
                timeout: 5000,
                onload: function () { resolve(Date.now() - startAt); },
                onerror: function () { reject(new Error('error')); },
                ontimeout: function () { reject(new Error('timeout')); }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function selectFastestHost() {
    var tests = HOST_CANDIDATES.map(function (h) {
        return pingHost(h).then(function (ms) { return { host: h, ms: ms }; })
            .catch(function () { return { host: h, ms: Number.POSITIVE_INFINITY }; });
    });
    Promise.all(tests).then(function (results) {
        results.sort(function (a, b) { return a.ms - b.ms; });
        var fastest = results[0];
        if (fastest && fastest.ms !== Number.POSITIVE_INFINITY && fastest.host !== _host) {
            _host = fastest.host;
            localStorage.setItem('GPTJsSetting.hostSelected', _host);
            localStorage.setItem('GPTJsSetting.hostSelectedAt', String(Date.now()));
            try { console.log('[GPTJs] 切换到更快域名:', _host, '延迟', fastest.ms + 'ms'); } catch (_) {}
        } else if (fastest && fastest.ms !== Number.POSITIVE_INFINITY) {
            // 更新缓存时间戳
            localStorage.setItem('GPTJsSetting.hostSelected', _host);
            localStorage.setItem('GPTJsSetting.hostSelectedAt', String(Date.now()));
        }
    });
}

// 首次加载：若缓存超过2小时则优先测速，否则后台复测
try {
    var twoHours = 2 * 60 * 60 * 1000;
    if (!(_cachedAt && (Date.now() - _cachedAt) < twoHours)) {
        selectFastestHost();
    } else {
        // 使用缓存的同时后台复测，必要时自动切换
        setTimeout(selectFastestHost, 0);
    }
} catch (_) {
    // 发生异常不影响脚本主流程
}

var _mlist, _defaults, _domList, $subBtn, $saveBtn, $frame_c;
var reportUrlChange = 0;


window.onload = function () {
    if (localStorage.getItem('GPTJsSetting.showBox') == 'hide') {
        $('#ne-21box').css('display', 'none');
        $('#ne-21box').css('opacity', '0');
    } else {
        $('#ne-21box').css('display', 'block');
        $('#ne-21box').css('opacity', '1');
    }

    //监听模型改变
    // 获取<select>元素
    const selectElement = $('#modelSelect');
    // 添加change事件监听器
    selectElement.on('change', function () {
        // 获取选定的值
        const selectedModel = selectElement.val();
        // 将选定的值存储到localStorage中
        localStorage.setItem('GPTJsSetting.model', selectedModel);
    });
    // 从localStorage中获取上次选定的模型并设置为<select>的默认值
    const lastSelectedModel = localStorage.getItem('GPTJsSetting.model');
    if (lastSelectedModel) {
        selectElement.val(lastSelectedModel);
    }
};

// F9显示隐藏界面按键事件监听
$(document).keydown(function (e) {
    if (e.keyCode == 120 && $('#ne-21notice')[0] != undefined) {
        // 切换显示状态并更新 localStorage 的值
        if (localStorage.getItem('GPTJsSetting.showBox') == 'hide') {
            $('#ne-21box').css('display', show = 'block');
            $('#ne-21box').css('opacity', '1');
            localStorage.setItem('GPTJsSetting.showBox', 'show');
            logger('F9显隐界面');
        } else {
            $('#ne-21box').css('display', show = 'none');
            localStorage.setItem('GPTJsSetting.showBox', 'hide');
        }
    }
});


$('.navshow').find('a:contains(体验新版)')[0] ? $('.navshow').find('a:contains(体验新版)')[0].click() : '';

setting.decrypt ? decryptFont() : '';

if (_l.hostname == 'i.mooc.chaoxing.com' || _l.hostname == "i.chaoxing.com") {
    // showTips();
} else if (_l.pathname == '/login' && setting.autoLogin) {
    showBox()
    setTimeout(() => { autoLogin() }, 3000)
} else if (_l.pathname.includes('/mycourse/studentstudy')) {
    showBox()
    $('#ne-21log', window.parent.document).html('初始化完毕！')
} else if (_l.pathname.includes('/knowledge/cards')) {
    var params = getTaskParams()
    if (params == null || params == '$mArg' || $.parseJSON(params)['attachments'].length <= 0) {
        logger('无任务点可处理，即将跳转页面', 'red')
        toNext()
    } else {
        setTimeout(() => {
            top.checkJob ? top.checkJob = () => false : true
            _domList = []
            _mlist = $.parseJSON(params)['attachments']
            _defaults = $.parseJSON(params)['defaults']
            $.each($('.wrap .ans-cc .ans-attach-ct'), (i, t) => {
                _domList.push($(t).find('iframe'))
            })
            missonStart()
        }, 3000)
    }
} else if (_l.pathname.includes('/exam/test/reVersionTestStartNew')) {
    showBox()
    setTimeout(() => { missonExam() }, 3000)
} else if (_l.pathname.includes('/exam/test/reVersionPaperMarkContentNew')) {
    setting.share && (() => {
        showBox()
        // setTimeout(() => { uploadExam() }, 3000)
    })()
} else if (_l.pathname.includes('/mooc2/work/dowork')) {
    showBox()
    setTimeout(() => { missonHomeWork() }, 3000)
} else if (_l.pathname.includes('/mooc2/work/view')) {
    setting.share && (() => {
        showBox()
        // setTimeout(() => { uploadHomeWork() }, 3000)
    })()
} else if (_l.pathname.includes('/work/phone/doHomeWork')) {
    _oldal = _w.alert
    _w.alert = function (msg) {
        if (msg == '保存成功') {
            return;
        }
        return _oldal(msg)
    }
    _oldcf = _w.confirm
    _w.confirm = function (msg) {
        if (msg.includes('确认提交') || msg.includes('未做完')) {
            return true
        }
        return _oldcf(msg)
    }
} else if (_l.pathname.includes('/mooc2/exam/exam-list')) {
    // Swal.fire('ChatGPT学习通助手提示', '注意：请谨慎使用脚本考试，开始考试之前请确保该账号已激活脚本。', 'info')
} else if (_l.pathname == '/mycourse/stu') {
    checkBrowser()
} else {
    // console.log(_l.pathname)
}

function checkBrowser() {
    var userAgent = navigator.userAgent
    if (userAgent.indexOf('Chrome') == -1 || GM_info.scriptHandler != 'ScriptCat') {
        // Swal.fire('您使用的不是推荐运行环境(edge、谷歌浏览器+ScriptCat)，脚本运行可能会发生问题.')
    }
}

function http2https(url) {
    _url = url.replace(/^http:/, 'https:')
    return _url
}

function parseUrlParams() {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    let _p = {}
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        _p[pair[0]] = pair[1]
    }
    return _p
}

function showTips() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: _host + '/api/v1/tips',
        timeout: 5000,
        onload: function (xhr) {
            if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                var _msg = obj.data.msg;
                //Swal.fire('ChatGPT学习通助手提示', _msg, 'info');
            }
        },
        ontimeout: function () {
            var _msg = "链接不到云端服务器，可能是您使用的脚本版本过低，请尽快更新，最新脚本更新发布官";
            //Swal.fire('ChatGPT学习通助手提示', _msg, 'info');
        }
    });
}

function sleep(time) {
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while (true) {
        if (new Date().getTime() > endTime) {
            return;
        }
    }
}
// 更多设置
var moreSettingsBtn = document.getElementById('moreSettingsBtn');
var moreSettings = document.getElementById('moreSettings');
var userInfo = document.getElementById('userInfo');
var isSettingsVisible = false;

moreSettingsBtn.addEventListener('click', function () {
    userInfo.style.display = isSettingsVisible ? 'block' : 'none';
    moreSettings.style.display = isSettingsVisible ? 'none' : 'block';
    moreSettingsBtn.textContent = isSettingsVisible ? '设置' : '返回';
    isSettingsVisible = !isSettingsVisible;
});

// 循环添加事件监听器
['sub', 'force', 'examTurn', 'goodStudent', 'alterTitle'].forEach(function (settingId) {
    var checkbox = document.getElementById('GPTJsSetting.' + settingId);
    checkbox.addEventListener('change', updateLocalStorage);
    checkbox.checked = localStorage.getItem('GPTJsSetting.' + settingId) === 'true';
    // 检查本地存储修改题目是否为空，如果为空，则设置默认值为true
    if (localStorage.getItem('GPTJsSetting.' + 'alterTitle') === null) {
        localStorage.setItem('GPTJsSetting.' + 'alterTitle', 'true');
    }
});
// 更新本地存储
function updateLocalStorage(event) {
    var checkbox = event.target;
    localStorage.setItem(checkbox.id, checkbox.checked);
}
function showBox() {
    //公告&充值
    if (setting.showBox && top.document.querySelector('#ne-21notice') == undefined) {
        var box_html = `<div id="ne-21box" style="box-shadow: 0px 0px 4px #0e8de252;backdrop-filter: blur(1px); opacity: 0;width: 330px; position: fixed; top: 5%; right: 20%; z-index: 99999; overflow-x: auto; display: block;border-radius: 3px;">
        <div style="display: flex;justify-content: space-between;margin: 0 5%;" title="按F9键即可恢复面板"><h3 style="text-align: center;">ChatGPT学习通助手</h3><h3 id="ne-21close" style="color: red;">[F9显隐面板]</h3></div>
        <div id="ne-21notice" style="border-top: 1px solid #000;margin: 4px 1px;overflow: hidden;"></div>
        <div id="userInfo" style="margin: 4px 0px;overflow: hidden;"></div>
        <div id="moreSettings" style="display: none; margin: 8px 0;">
            <input type="checkbox" id="GPTJsSetting.sub"> <label for="GPTJsSetting.sub">测验自动提交</label>
            <input type="checkbox" id="GPTJsSetting.force"> <label for="GPTJsSetting.force">测验强制提交</label>
            <input type="checkbox" id="GPTJsSetting.examTurn"> <label for="GPTJsSetting.examTurn">考试自动跳转</label>
            <p></p>
            <input type="checkbox" id="GPTJsSetting.goodStudent"> <label for="GPTJsSetting.goodStudent">答案加粗不选择</label>
            <input type="checkbox" id="GPTJsSetting.alterTitle" checked> <label for="GPTJsSetting.alterTitle">答案插入题目后</label>
        </div>
        <div id="ne-21log" style="max-height:100px;"></div>
    </div>`;
        $(box_html).appendTo('body');
        $('#ne-21close').click(function () {
            let show = $('#ne-21box').css('display');
            $('#ne-21box').css('display', show == 'block' ? 'none' : 'block');
        })
    } else {
        $('#ne-21log', window.parent.document).html('')
    }
    let _u = getCk('_uid') || getCk('UID')
    $('#ne-21notice').html(`<div>
    <div>当前学习通账号UID:`+ _u + `</div>
    <a target="_blank" href="`+ _host + `?uid=` + _u + `"><button
            style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color: #56CABF; border: none;"
            onmouseover="this.style.backgroundColor='#45a049'" onmouseout="this.style.backgroundColor='#4CAF50'"
            onmousedown="this.style.backgroundColor='#3e8e41'"
            onmouseup="this.style.backgroundColor='#45a049'">积分充值(CDK充值)</button></a>
    <select style="border: 1px solid gray;border-radius: 4px;padding: 3px;font-size: 10px;" id="modelSelect">
        <option value="GPT-3.5">GPT-4.1(普通模型|低价)</option>
        <option value="ERNIE-Bot-4.0">GPT-5(最新模型)</option>
        <option value="GPT-4">DeepSeek-R1(思考|推荐)</option>
        <option value="GPT-4-All">DeepSeek-R1(联网|高价)</option>
    </select><button id="moreSettingsBtn"
        style="display: inline-block; padding: 4px 8px; font-size: 10px; border-radius: 4px; text-align: center; text-decoration: none; cursor: pointer; transition: background-color 0.3s ease; color: #fff; background-color: #4CAF50; border: none;transform: translateX(5px);">设置</button>
</div>`);
    //公告
    GM_xmlhttpRequest({
        method: 'GET',
        url: _host + '/api/v1/auth?uid=' + _u + '&v=' + GM_info['script']['version'],
        timeout: 10000,
        onload: function (xhr) {
            if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                var notice = obj.data.notice;
                var score = obj.data.score;
                $('#userInfo').html(notice + "积分余额:" + score);
                if (obj.data.models) {
                    var selectedValue = $('#modelSelect').val();
                    $('#modelSelect').html(obj.data.models);
                    $('#modelSelect').val(selectedValue);
                }
            }
        },
        ontimeout: function () {
            $('#userInfo').html("欢迎使用，获取服务器公告超时！");
        }
    });
}

function logger(str, color) {
    var _time = new Date().toLocaleTimeString()
    $('#ne-21log', window.parent.document).prepend('<hr><p style="color: ' + color + ';">[' + _time + ']' + str + '</p>')
}

function getStr(str, start, end) {
    let res = str.match(new RegExp(`${start}(.*?)${end}`))
    return res ? res[1] : null
}

function getTaskParams() {
    try {
        var _iframeScripts = _d.scripts,
            _p = null;
        for (let i = 0; i < _iframeScripts.length; i++) {
            if (_iframeScripts[i].innerHTML.indexOf('mArg = "";') != -1 && _iframeScripts[i].innerHTML.indexOf('==UserScript==') == -1) {
                _p = getStr(_iframeScripts[i].innerHTML.replace(/\s/g, ""), 'try{mArg=', ';}catch');
                return _p
            }
        }
        return _p
    } catch (e) {
        return null
    }

}

function getCk(name) {
    return document.cookie.match(`[;\s+]?${name}=([^;]*)`)?.pop();
}


function autoLogin() {
    logger('用户已设置自动登录', 'green')
    if (setting.phone.length <= 0 || setting.password.length <= 0) {
        logger('用户未设置登录信息', 'red')
        return
    }
    setTimeout(() => {
        $('#phone').val(setting.phone)
        $('#pwd').val(setting.password)
        $('#loginBtn').click()
    }, 3000)
}

function toNext() {
    refreshCourseList().then((res) => {
        if (setting.review || !setting.work) {
            setTimeout(() => {
                $('#ne-21log', window.parent.document).html('')
                if (top.document.querySelector('#mainid > .prev_next.next') == undefined) {
                    top.document.querySelector('#prevNextFocusNext').click();
                    return
                }
                top.document.querySelector('#mainid > .prev_next.next').click();
            }, 5000)
            return
        }
        let _t = []
        $.each($(res).find('li'), (_, t) => {
            let curid = $(t).find('.posCatalog_select').attr('id'),
                status = $(t).find('.prevHoverTips').text(),
                name = $(t).find('.posCatalog_name').attr('title');
            if (curid.indexOf('cur') != -1) {
                _t.push({ 'curid': curid, 'status': status, 'name': name })
            }
        })

        let _curChaterId = $('#coursetree', window.parent.document).find('.posCatalog_active').attr('id')
        let _curIndex = _t.findIndex((item) => item['curid'] == _curChaterId)
        for (_curIndex; _curIndex < _t.length - 1; _curIndex++) {
            if (_t[_curIndex]['status'].indexOf('待完成') != -1) {
                let c_tabs = top.document.querySelectorAll('#prev_tab li')
                let c_active_tab = top.document.querySelector('#prev_tab li.active')
                if (c_tabs && c_active_tab) {
                    let c_active_tab_id = c_active_tab.getAttribute("id").replace(/dct/, '')
                    if (c_active_tab_id != c_tabs.length) {
                        setTimeout(() => {
                            $('#ne-21log', window.parent.document).html('')
                            if (top.document.querySelector('#mainid > .prev_next.next') == undefined) {
                                top.document.querySelector('#prevNextFocusNext').click();
                                return
                            }
                            top.document.querySelector('#mainid > .prev_next.next').click();
                        }, 5000)
                        return
                    }
                }
            }
            let t = _t[_curIndex + 1]
            if (t['status'].indexOf('待完成') != -1) {
                setTimeout(() => {
                    $('#ne-21log', window.parent.document).html('')
                    if (top.document.querySelector('#mainid > .prev_next.next') == undefined) {
                        top.document.querySelector('#prevNextFocusNext').click();
                        return
                    }
                    top.document.querySelector('#mainid > .prev_next.next').click();
                    showBox()
                }, 5000)
                return
            } else if (t['status'].indexOf('闯关') != -1) {
                logger('当前为闯关模式，存在未完成任务点，脚本已暂停运行，请手动完成并点击下一章节', 'red')
                return
            } else if (t['status'].indexOf('开放') != -1) {
                logger('章节未开放', 'red')
                return
            } else {
                //  console.log(t)
            }
        }
        logger('此课程处理完毕', 'green')
        return
    })
}

function missonStart() {
    showBox()
    if (_mlist.length <= 0) {
        logger('此页面任务处理完毕，准备跳转页面', 'green')
        return toNext()
    }
    let _type = _mlist[0]['type'],
        _dom = _domList[0],
        _task = _mlist[0];
    if (_type == undefined) {
        _type = _mlist[0]['property']["module"]
    }
    switch (_type) {
        case "video":
            if (_mlist[0]['property']['module'] == 'insertvideo') {
                logger('开始处理视频', 'purple')
                missonVideo(_dom, _task)
                break
            } else if (_mlist[0]['property']['module'] == 'insertaudio') {
                logger('开始处理音频', 'purple')
                missonAudio(_dom, _task)
                break
            } else {
                logger('未知类型任务，请联系作者，跳过', 'red')
                switchMission()
                break
            }
        case "workid":
            logger('开始处理测验', 'purple')
            missonWork(_dom, _task)
            break
        case "document":
            logger('开始处理文档', 'purple')
            missonDoucument(_dom, _task)
            break
        case "read":
            logger('开始处理阅读', 'purple')
            missonRead(_dom, _task)
            break
        case "insertbook":
            logger('开始处理读书', 'purple')
            missonBook(_dom, _task)
            break
        default:
            let GarbageTasks = ['insertimage']
            if (GarbageTasks.indexOf(_type) != -1) {
                logger('发现无需处理任务，跳过。', 'red')
                switchMission()
            } else {
                logger('暂不支持处理此类型:' + _type + '，跳过。', 'red')
                switchMission()
            }

    }
}


function missonAudio(dom, obj) {
    if (!setting.audio) {
        logger('用户设置不处理音频任务，准备开始下一个任务。', 'red')
        setTimeout(() => { switchMission() }, 3000)
        return
    }
    let isDo;
    if (setting.task) {
        logger("当前只处理任务点任务", 'red')
        if (obj['jobid'] == undefined ? false : true) {
            isDo = true
        } else {
            isDo = false
        }
    } else {
        logger("当前默认处理所有任务（包括非任务点任务）", 'red')
        isDo = true
    }
    if (isDo) {
        let classId = _defaults['clazzId'],
            userId = _defaults['userid'],
            fid = _defaults['fid'],
            reportUrl = _defaults['reportUrl'],
            isPassed = obj['isPassed'],
            otherInfo = obj['otherInfo'],
            jobId = obj['property']['_jobid'],
            name = obj['property']['name'],
            objectId = obj['property']['objectid'];
        if (setting.maskImg) {
            let ifs = $(dom).attr('style');
            $(dom).contents().find('body').find('.main').attr('style', 'visibility:hidden;')
            $(dom).contents().find('body').prepend('<img src="https://pic.521daigua.cn/bg.jpg!/format/webp" style="' + ifs + 'display:block;width:100%;"/>')
        }
        if (!setting.review && isPassed == true) {
            logger('音频：' + name + '检测已完成，准备处理下一个任务', 'green')
            switchMission()
            return
        } else if (setting.review) {
            logger('已开启复习模式，开始处理音频：' + name, 'pink')
        }
        $.ajax({
            url: _l.protocol + '//' + _l.host + "/ananas/status/" + objectId + '?k=' + fid + '&flag=normal&_dc=' + String(Math.round(new Date())),
            type: "GET",
            success: function (res) {
                try {
                    let duration = res['duration'],
                        dtoken = res['dtoken'],
                        clipTime = '0_' + duration,
                        playingTime = 0,
                        isdrag = 3;
                    var _rt = 0.9;
                    if (setting.rate == 0) {
                        logger('已开启音频秒过，99.9%会导致进度重置、挂科等问题。', 'red')
                        logger('已开启音频秒过，请等待5秒！！！', 'red')
                    } else if (setting.rate > 1 && setting.rate <= 16) {
                        logger('已开启音频倍速，当前倍速：' + setting.rate + ',99.9%会导致进度重置、挂科等问题。', 'red')
                        logger('已开启音频倍速，进度40秒更新一次，请等待！', 'red')
                    } else if (setting.rate > 16) {
                        setting.rate = 1
                        logger('超过允许设置的最大倍数，已重置为1倍速。', 'red')
                    } else {
                        logger("音频进度每隔40秒更新一次，请等待耐心等待...", 'blue')
                    }
                    logger("音频：" + name + "开始播放")
                    updateAudio(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt).then((status) => {
                        switch (status) {
                            case 1:
                                logger("音频：" + name + "已播放" + String((playingTime / duration) * 100).slice(0, 4) + '%', 'purple')
                                isdrag = 0
                                break
                            case 3:
                                _rt = 1
                                break
                            default:
                                console.log(status)
                        }
                    })
                    let _loop = setInterval(() => {
                        playingTime += 40 * setting.rate
                        if (playingTime >= duration || setting.rate == 0) {
                            clearInterval(_loop)
                            playingTime = duration
                            isdrag = 4
                        } else if (rt = 1 && playingTime == 40 * setting.rate) {
                            isdrag = 3
                        } else {
                            isdrag = 0
                        }
                        updateAudio(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt).then((status) => {
                            switch (status) {
                                case 0:
                                    playingTime -= 40
                                    break
                                case 1:
                                    logger("音频：" + name + "已播放" + String((playingTime / duration) * 100).slice(0, 4) + '%', 'purple')
                                    break
                                case 2:
                                    clearInterval(_loop)
                                    logger("音频：" + name + "检测播放完毕，准备处理下一个任务。", 'green')
                                    switchMission()
                                    break
                                case 3:
                                    playingTime -= 40
                                    _rt = Number(_rt) == 1 ? 0.9 : 1
                                    break
                                default:
                                    console.log(status)
                            }
                        })
                    }, setting.rate == 0 ? 5000 : 40000)
                } catch (e) {
                    logger('发生错误：' + e, 'red')
                }
            }
        });
    } else {
        logger('用户设置只处理属于任务点的任务，准备处理下一个任务', 'green')
        switchMission()
        return
    }
}

function missonVideo(dom, obj) {
    if (!setting.video) {
        logger('用户设置不处理视频任务，准备开始下一个任务。', 'red');
        return setTimeout(switchMission, 3000);
    }

    const { isPassed, otherInfo, property } = obj;
    const { _jobid: jobId, name, objectid: objectId } = property;

    if (!setting.review && isPassed === true) {
        logger(`视频：${name} 检测已完成，准备处理下一个任务`, 'green');
        return switchMission();
    }

    // 使用传入的 dom 参数查找相关的 iframe，而不是搜索整个文档
    let target = dom.length > 0 ? dom[0] : null;
    let mediaType = 'video'; // 默认为视频

    if (!target) {
        logger('未找到视频 iframe，3 秒后重试……', 'orange');
        return setTimeout(() => missonVideo(dom, obj), 3000);
    }

    logger(`处理视频：${name}，正在解析`);
    let executed = false;
    const doc = target.contentDocument || target.contentWindow.document;

    const intervalId = setInterval(() => {
        // 先尝试查找视频，如果没有则尝试查找音频
        let media = doc.querySelector('video');
        if (!media) {
            media = doc.querySelector('audio');
            mediaType = 'audio';
        }

        if (media && !executed) {
            executed = true;
            clearInterval(intervalId);

            logger(`${name} - ${mediaType} 播放成功，开始控制播放`);
            media.pause();
            media.muted = true;
            media.playbackRate = setting.rate > 1 ? setting.rate : 1;
            media.play();

            // 防止暂停的通用恢复函数
            const resume = () => {
                if (media.paused) {
                    media.play();
                }
            };

            media.addEventListener('pause', resume);
            if (mediaType === 'video' && media.parentElement) {
                media.parentElement.addEventListener('mouseleave', resume);
            }

            media.addEventListener('ended', () => {
                logger(`${name} - ${mediaType} 已播放完成`);
                media.removeEventListener('pause', resume);
                clearInterval(intervalId);
                setTimeout(switchMission, 1000);
            });
        }
    }, 2500);
}




function missonBook(dom, obj) {
    if (setting.task) {
        if (obj['jobid'] == undefined) {
            logger("当前只处理任务点任务,跳过", 'red')
            switchMission()
            return
        }
    }
    let jobId = obj['property']['jobid'],
        name = obj['property']['bookname'],
        jtoken = obj['jtoken'],
        knowledgeId = _defaults['knowledgeid'],
        courseId = _defaults['courseid'],
        clazzId = _defaults['clazzId'];
    if (obj['job'] == undefined) {
        logger('读书：' + name + '检测已完成，准备执行下一个任务。', 'green')
        switchMission()
        return
    }
    $.ajax({
        url: _l.protocol + "//" + _l.host + '/ananas/job?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                logger('读书：' + name + res.msg + ',准备执行下一个任务。', 'green')
            } else {
                logger('读书：' + name + '处理异常,跳过。', 'red')
            }
            switchMission()
            return
        },
    })
}

function missonLive(dom, obj) {

}

function missonDoucument(dom, obj) {
    if (setting.task) {
        if (obj['jobid'] == undefined) {
            logger("当前只处理任务点任务,跳过", 'red')
            switchMission()
            return
        }
    }
    let jobId = obj['property']['jobid'],
        name = obj['property']['name'],
        jtoken = obj['jtoken'],
        knowledgeId = _defaults['knowledgeid'],
        courseId = _defaults['courseid'],
        clazzId = _defaults['clazzId'];
    if (obj['job'] == undefined) {
        logger('文档：' + name + '检测已完成，准备执行下一个任务。', 'green')
        switchMission()
        return
    }
    $.ajax({
        url: _l.protocol + "//" + _l.host + '/ananas/job/document?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                logger('文档：' + name + res.msg + ',准备执行下一个任务。', 'green')
            } else {
                logger('文档：' + name + '处理异常,跳过。', 'red')
            }
            switchMission()
            return
        },
    })

}

function missonRead(dom, obj) {
    if (setting.task) {
        if (obj['jobid'] == undefined) {
            logger("当前只处理任务点任务,跳过", 'red')
            switchMission()
            return
        }
    }
    let jobId = obj['property']['jobid'],
        name = obj['property']['title'],
        jtoken = obj['jtoken'],
        knowledgeId = _defaults['knowledgeid'],
        courseId = _defaults['courseid'],
        clazzId = _defaults['clazzId'];
    if (obj['job'] == undefined) {
        logger('阅读：' + name + ',检测已完成，准备执行下一个任务。', 'green')
        switchMission()
        return
    }
    $.ajax({
        url: _l.protocol + '//' + _l.host + '/ananas/job/readv2?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                logger('阅读：' + name + res.msg + ',准备执行下一个任务。', 'green')
            } else {
                logger('阅读：' + name + '处理异常,跳过。', 'red')
            }
            switchMission()
            return
        }
    })
}

function missonWork(dom, obj) {
    if (!setting.work) {
        logger('用户设置不自动处理测验，准备处理下一个任务', 'green')
        switchMission()
        return
    }
    let isDo;
    if (setting.task) {
        logger("当前只处理任务点任务", 'red')
        if (obj['jobid'] == undefined ? false : true) {
            isDo = true
        } else {
            isDo = false
        }
    } else {
        logger("当前默认处理所有任务（包括非任务点任务）", 'red')
        isDo = true
    }
    if (isDo) {
        if (obj['jobid'] !== undefined) {
            var phoneWeb = _l.protocol + '//' + _l.host + '/work/phone/work?workId=' + obj['jobid'].replace('work-', '') + '&courseId=' + _defaults['courseid'] + '&clazzId=' + _defaults['clazzId'] + '&knowledgeId=' + _defaults['knowledgeid'] + '&jobId=' + obj['jobid'] + '&enc=' + obj['enc']
            // setTimeout(() => { startDoCyWork(0, dom) }, 3000)
            setTimeout(() => { startDoPhoneCyWork(0, dom, phoneWeb) }, 3000)
        } else {
            setTimeout(() => { startDoCyWork(0, dom) }, 3000)
        }
        // } else if (!GM_getValue('cando')) {
        //     logger('存在未完成任务点，脚本已暂停执行，请手动处理后刷新网页。', 'red')
        //     return
    } else {
        logger('用户设置只处理属于任务点的任务，准备处理下一个任务', 'green')
        switchMission()
        return
    }
}

function doPhoneWork($dom) {
    let $cy = $dom.find('.Wrappadding form')
    $subBtn = $cy.find('.zquestions .zsubmit .btn-ok-bottom')
    $okBtn = $dom.find('#okBtn')
    $saveBtn = $cy.find('.zquestions .zsubmit .btn-save')
    let TimuList = $cy.find('.zquestions .Py-mian1')
    startDoPhoneTimu(0, TimuList)
}

function startDoPhoneTimu(index, TimuList) {
    if (index == TimuList.length) {
        if (localStorage.getItem('GPTJsSetting.sub') === 'true') {
            logger('测验处理完成，准备自动提交。', 'green')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $okBtn.click()
                    logger('提交成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { switchMission() }, 3000)
                }, 3000)
            }, 5000)
        } else if (localStorage.getItem('GPTJsSetting.force') === 'true') {
            logger('测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。', 'red')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $okBtn.click()
                    logger('提交成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { switchMission() }, 3000)
                }, 3000)
            }, 5000)
        } else {
            logger('测验处理完成，存在无答案题目或用户设置不自动提交，自动保存！', 'green')
            setTimeout(() => {
                $saveBtn.click()
                setTimeout(() => {
                    logger('保存成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { switchMission() }, 3000)
                }, 3000)
            }, 5000)
        }
        return
    }
    let questionFull = $(TimuList[index]).find('.Py-m1-title').html()
    let _question = tidyQuestion(questionFull).replace(/.*?\[.*?题\]\s*\n\s*/, '').trim()
    let typeName = questionFull.match(/.*?\[(.*?)]|$/)[1];
    let _type = ({ 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4, 选择题: 5 })[typeName]
    let _a = []
    let _answerTmpArr
    var check_answer_flag = 0;

    // 如果题型不在预设类型中，根据DOM结构自动识别题型
    if (_type === undefined) {
        logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');

        // 检查选项列表特征
        let singleChoiceList = $(TimuList[index]).find('.answerList.singleChoice li');
        let multiChoiceList = $(TimuList[index]).find('.answerList.multiChoice li');

        if (singleChoiceList && singleChoiceList.length > 0) {
            _type = 0; // 单选题
            logger('自动识别为单选题', 'green');
        } else if (multiChoiceList && multiChoiceList.length > 0) {
            _type = 1; // 多选题
            logger('自动识别为多选题', 'green');
        } else {
            // 检查是否为填空题
            let tkList = $(TimuList[index]).find('.blankList2 input');
            if (tkList && tkList.length > 0) {
                _type = 2; // 填空题
                logger('自动识别为填空题', 'green');
            } else {
                // 判断题等其他情况
                let panduanList = $(TimuList[index]).find('.answerList.panduan li');
                if (panduanList && panduanList.length > 0) {
                    _type = 3; // 判断题
                    logger('自动识别为判断题', 'green');
                } else {
                    // 检查是否为简答题或材料题
                    let textareaList = $(TimuList[index]).find('textarea');
                    let editorList = $(TimuList[index]).find('.edui-editor');

                    if ((textareaList && textareaList.length > 0) || (editorList && editorList.length > 0)) {
                        _type = 4; // 简答题
                        logger('自动识别为简答题或材料题', 'green');
                    }
                }
            }
        }
    }

    switch (_type) {
        case 0:
            //遍历选项列表
            _answerTmpArr = $(TimuList[index]).find('.answerList.singleChoice li')
            var mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");

            _question = "单选题:" + _question + '\n' + mergedAnswers
            //判断题目是否已作答
            for (var i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).attr('aria-label')) {
                    logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                    check_answer_flag = 1;
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30)
                    break
                }
            }
            if (check_answer_flag == 0) {
                getAnswer(_type, _question).then((agrs) => {
                    _answerTmpArr = $(TimuList[index]).find('.answerList.singleChoice li')
                    $.each(_answerTmpArr, (i, t) => {
                        _a.push(tidyStr($(t).html()).replace(/^[A-Z]\s*\n\s*/, '').trim())
                    })
                    let _i = _a.findIndex((item) => item == agrs)
                    if (_i == -1) {
                        logger('AI无法完美匹配正确答案,请手动选择，跳过此题', 'red')
                        // setting.sub = 0
                        localStorage.setItem('GPTJsSetting.sub', false)
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    } else {
                        $(_answerTmpArr[_i]).click()
                        logger('自动答题成功，准备切换下一题', 'green')
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                })
            }
            break
        case 1:
            //遍历选项列表
            _answerTmpArr = $(TimuList[index]).find('.answerList.multiChoice li')
            var mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = "多选题:" + _question + '\n' + mergedAnswers
            //判断题目是否已作答
            for (var i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).attr('aria-label')) {
                    logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                    check_answer_flag = 1;
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30)
                    break
                }
            }
            if (check_answer_flag == 0) {
                getAnswer(_type, _question).then((agrs) => {
                    if (agrs == '暂无答案') {
                        logger('AI无法完美匹配正确答案,请手动选择，跳过此题', 'red')
                        // setting.sub = 0
                        localStorage.setItem('GPTJsSetting.sub', false)
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    } else {
                        _answerTmpArr = $(TimuList[index]).find('.answerList.multiChoice li')
                        $.each(_answerTmpArr, (i, t) => {
                            let _tt = tidyStr($(t).html()).replace(/^[A-Z]\s*\n\s*/, '').trim()
                            if (agrs.indexOf(_tt) != -1) {
                                setTimeout(() => { $(_answerTmpArr[i]).click() }, 300)
                            }
                        })
                        let check = 0
                        setTimeout(() => {
                            $.each(_answerTmpArr, (i, t) => {
                                if ($(t).attr('class').indexOf('cur') != -1) {
                                    check = 1
                                }
                            })
                            if (check) {
                                logger('自动答题成功，准备切换下一题', 'green')
                            } else {
                                logger('未能正确选择答案，请手动选择，跳过此题', 'red')
                                // setting.sub = 0
                                localStorage.setItem('GPTJsSetting.sub', false)
                            }
                            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                        }, 1000)
                    }
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                })
            }
            break
        case 2:
            let tkList = $(TimuList[index]).find('.blankList2 input')
            if ($(tkList).val() !== null) {
                logger("此题已作答,跳过", "green");
                setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30);
                break
            }
            getAnswer(_type, _question).then((agrs) => {
                if (agrs == '暂无答案') {
                    logger('AI无法完美匹配正确答案,请手动选择，跳过此题', 'red')
                    // setting.sub = 0
                    localStorage.setItem('GPTJsSetting.sub', false)
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    return
                }
                let answers = agrs.split('#')
                let tkList = $(TimuList[index]).find('.blankList2 input')
                $.each(tkList, (i, t) => {
                    setTimeout(() => { $(t).val(answers[i]) }, 200)
                })
                setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                }
            })
            break
        case 3:
            _question = "判断题(只回答正确或错误):" + _question
            getAnswer(_type, _question).then((agrs) => {
                if (agrs == '暂无答案') {
                    logger('AI无法完美匹配正确答案,请手动选择，跳过此题', 'red')
                    // setting.sub = 0
                    localStorage.setItem('GPTJsSetting.sub', false)
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                } else {
                    let _true = '正确|是|对|√|T|ri'
                    _answerTmpArr = $(TimuList[index]).find('.answerList.panduan li')
                    if (_true.indexOf(agrs) != -1) {
                        $.each(_answerTmpArr, (i, t) => {
                            if ($(t).attr('val-param') == 'true') {
                                $(t).click()
                            }
                        })
                    } else {
                        $.each(_answerTmpArr, (i, t) => {
                            if ($(t).attr('val-param') == 'false') {
                                $(t).click()
                            }
                        })
                    }
                    logger('自动答题成功，准备切换下一题', 'green')
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                }
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                }
            })
            break
        // case 4:
        //     getAnswer(_type, _question).then((agrs) => {
        //         if (agrs == '暂无答案') {
        //             logger('AI无法完美匹配正确答案,请手动选择，跳过此题', 'red')
        //             setting.sub = 0
        //             setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
        //             return
        //         }
        //         let answers = agrs.split('#')
        //         let tkList = document.querySelector(".ans-cc").lastChild
        //         logger("tk"+tkList.text());
        //         logger($('.ans-cc').find('p')[0].text());
        //         logger(UE.getEditor(tkList).getContent())

        //         $.each(tkList, (i, t) => {
        //             // setTimeout(() => { $(t).val(answers[i]) }, 200)
        //             setTimeout(() => { UE.getEditor($(tkList)).setContent(answers[i]) }, 200)
        //         })
        //         setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
        //     }).catch((agrs) => {
        //         if (agrs['c'] == 0) {
        //             setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
        //         }
        //     })
        //     break
        case 4: // 简答题或材料题
            _question = "简答题或材料题:" + _question

            // 查找可能的编辑器区域
            let editorTextareas = $(TimuList[index]).find('textarea[name^="answerEditor"]');
            let normalTextareas = $(TimuList[index]).find('textarea');
            let richEditors = $(TimuList[index]).find('.edui-editor');

            // 检查是否已作答
            let isAnswered = false;

            // 如果找到了材料题特有的编辑器
            if (editorTextareas && editorTextareas.length > 0) {
                let editorId = $(editorTextareas[0]).attr('id');
                if (editorId && typeof UE !== 'undefined' && UE.getEditor(editorId)) {
                    // 检查是否已作答
                    if (UE.getEditor(editorId).getContent() !== '') {
                        logger(index + 1 + '此题已作答，准备切换下一题', 'green');
                        isAnswered = true;
                    } else {
                        getAnswer(_type, _question).then((agrs) => {
                            if (agrs == '暂无答案') {
                                logger('AI无法匹配答案，请手动完成', 'red');
                                localStorage.setItem('GPTJsSetting.sub', false);
                            } else {
                                setTimeout(() => { UE.getEditor(editorId).setContent(agrs) }, 300);
                                logger('材料题自动答题成功，准备切换下一题', 'green');
                            }
                            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
                        }).catch((agrs) => {
                            if (agrs['c'] == 0) {
                                setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
                            }
                        });
                    }
                } else {
                    logger('找到材料题编辑器但无法获取编辑器实例，尝试其他方法', 'yellow');
                }
            }
            // 处理普通文本框
            else if (normalTextareas && normalTextareas.length > 0 && !isAnswered) {
                // 检查是否已作答
                if ($(normalTextareas[0]).val() !== '') {
                    logger(index + 1 + '此题已作答，准备切换下一题', 'green');
                    isAnswered = true;
                } else {
                    getAnswer(_type, _question).then((agrs) => {
                        if (agrs == '暂无答案') {
                            logger('AI无法匹配答案，请手动完成', 'red');
                            localStorage.setItem('GPTJsSetting.sub', false);
                        } else {
                            $(normalTextareas[0]).val(agrs);
                            logger('简答题自动答题成功，准备切换下一题', 'green');
                        }
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
                    }).catch((agrs) => {
                        if (agrs['c'] == 0) {
                            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
                        }
                    });
                }
            }
            // 如果有富文本编辑器但没有特定的textarea
            else if (richEditors && richEditors.length > 0 && !isAnswered) {
                // 尝试在页面中查找编辑器ID
                let editorScripts = $('script:contains("UE.getEditor")');
                let foundEditorId = false;

                if (editorScripts && editorScripts.length > 0) {
                    // 尝试从脚本中提取编辑器ID
                    let scriptContent = editorScripts.text();
                    let matches = scriptContent.match(/UE\.getEditor\(['"](.*?)['"]/);
                    if (matches && matches.length > 1) {
                        let editorId = matches[1];
                        logger('从脚本中发现编辑器ID: ' + editorId, 'green');
                        foundEditorId = true;

                        if (typeof UE !== 'undefined' && UE.getEditor(editorId)) {
                            // 检查是否已作答
                            if (UE.getEditor(editorId).getContent() !== '') {
                                logger(index + 1 + '此题已作答，准备切换下一题', 'green');
                            } else {
                                getAnswer(_type, _question).then((agrs) => {
                                    if (agrs == '暂无答案') {
                                        logger('AI无法匹配答案，请手动完成', 'red');
                                        localStorage.setItem('GPTJsSetting.sub', false);
                                    } else {
                                        setTimeout(() => { UE.getEditor(editorId).setContent(agrs) }, 300);
                                        logger('使用脚本找到的编辑器ID回答成功', 'green');
                                    }
                                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
                                }).catch((agrs) => {
                                    if (agrs['c'] == 0) {
                                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
                                    }
                                });
                            }
                        }
                    }
                }

                if (!foundEditorId) {
                    logger('无法找到编辑器ID，请手动完成', 'red');
                    localStorage.setItem('GPTJsSetting.sub', false);
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
                }
            }
            // 如果以上方法都失败
            else if (!isAnswered) {
                logger('无法找到文本输入区域，请手动完成', 'red');
                localStorage.setItem('GPTJsSetting.sub', false);
                setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
            } else {
                setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time);
            }
            break
        case 5:
            getAnswer(_type, _question).then((agrs) => {
                // setting.sub = 0
                localStorage.setItem('GPTJsSetting.sub', false)
                logger('此类型题目无法区分单/多选，请手动选择答案', 'red')
                setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                }
            })
            break
        default:
            logger('暂不支持处理此类型题目：' + questionFull.match(/.*?\[(.*?)]|$/)[1] + ',跳过！请手动作答。', 'red')
            // setting.sub = 0
            localStorage.setItem('GPTJsSetting.sub', false)
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            break
    }
}

function startDoPhoneCyWork(index, doms, phoneWeb) {
    if (index == doms.length) {
        logger('此页面全部测验已处理完毕！准备进行下一项任务')
        setTimeout(missonStart, 5000)
        return
    }
    logger('等待测验框架加载...', 'purple')
    getElement($(doms[index]).contents()[0], 'iframe').then(element => {
        let workIframe = element
        if (workIframe.length == 0) {
            setTimeout(() => { startDoPhoneCyWork(index, doms) }, 5000)
        }
        // let workStatus = $(workIframe).contents().find('.CeYan .ZyTop h3 span:nth-child(1)').text().trim()
        let workStatus = $(workIframe).contents().find('.newTestCon .newTestTitle .testTit_status').text().trim()
        // console.log(workStatus)
        if (!workStatus) {
            _domList.splice(0, 1)
            setTimeout(missonStart, 2000)
            return
        }
        if (setting.share && workStatus.indexOf("已完成") != -1) {
            // logger('测验：' + (index + 1) + ',检测到此测验已完成,准备收录答案。', 'green')
            // setTimeout(() => { upLoadWork(index, doms, workIframe) }, 2000)
        } else if (workStatus.indexOf("待做") != -1 || workStatus.indexOf("待完成") != -1 || workStatus.indexOf("未达到及格线") != -1) {
            logger('测验：' + (index + 1) + ',准备处理此测验...', 'purple')
            $(workIframe).attr('src', phoneWeb)
            getElement($(doms[index]).contents()[0], 'iframe[src="' + phoneWeb + '"]').then((element) => {
                setTimeout(() => { doPhoneWork($(element).contents()) }, 3000)
            })
        } else if (workStatus.indexOf('待批阅') != -1) {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',测验待批阅,跳过', 'red')
            setTimeout(() => { startDoPhoneCyWork(index + 1, doms, phoneWeb) }, 5000)
        } else {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',未知状态或用户选择不收录答案,跳过', 'red')
            setTimeout(() => { startDoPhoneCyWork(index + 1, doms, phoneWeb) }, 5000)
        }
    })
}

function startDoCyWork(index, doms) {
    if (index == doms.length) {
        logger('此页面全部测验已处理完毕！准备进行下一项任务')
        setTimeout(missonStart, 5000)
        return
    }
    logger('等待测验框架加载...', 'purple')
    getElement($(doms[index]).contents()[0], 'iframe').then(element => {
        let workIframe = element
        if (workIframe.length == 0) {
            setTimeout(() => { startDoCyWork(index, doms) }, 5000)
        }
        let workStatus = $(workIframe).contents().find(".newTestCon .newTestTitle .testTit_status").text().trim()
        if (!workStatus) {
            _domList.splice(0, 1)
            setTimeout(missonStart, 2000)
            return
        }
        if (setting.share && workStatus.indexOf("已完成") != -1) {
            // logger('测验：' + (index + 1) + ',检测到此测验已完成,准备收录答案。', 'green')
            // setTimeout(() => { upLoadWork(index, doms, workIframe) }, 2000)
        } else if (workStatus.indexOf("待做") != -1 || workStatus.indexOf("待完成") != -1) {
            logger('测验：' + (index + 1) + ',准备处理此测验...', 'purple')
            setTimeout(() => { doWork(index, doms, workIframe) }, 5000)
        } else if (workStatus.indexOf('待批阅') != -1) {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',测验待批阅,跳过', 'red')
            setTimeout(() => { startDoCyWork(index + 1, doms) }, 5000)
        } else {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',未知状态或用户选择不收录答案,跳过', 'red')
            setTimeout(() => { startDoCyWork(index + 1, doms) }, 5000)
        }
    })
}



function getElement(parent, selector, timeout = 0) {
    /**
     * Author   cxxjackie
     * From     https://bbs.tampermonkey.net.cn
     */
    return new Promise(resolve => {
        let result = parent.querySelector(selector);
        if (result) return resolve(result);
        let timer;
        const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
        if (mutationObserver) {
            const observer = new mutationObserver(mutations => {
                for (let mutation of mutations) {
                    for (let addedNode of mutation.addedNodes) {
                        if (addedNode instanceof Element) {
                            result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
                            if (result) {
                                observer.disconnect();
                                timer && clearTimeout(timer);
                                return resolve(result);
                            }
                        }
                    }
                }
            });
            observer.observe(parent, {
                childList: true,
                subtree: true
            });
            if (timeout > 0) {
                timer = setTimeout(() => {
                    observer.disconnect();
                    return resolve(null);
                }, timeout);
            }
        } else {
            const listener = e => {
                if (e.target instanceof Element) {
                    result = e.target.matches(selector) ? e.target : e.target.querySelector(selector);
                    if (result) {
                        parent.removeEventListener('DOMNodeInserted', listener, true);
                        timer && clearTimeout(timer);
                        return resolve(result);
                    }
                }
            };
            parent.addEventListener('DOMNodeInserted', listener, true);
            if (timeout > 0) {
                timer = setTimeout(() => {
                    parent.removeEventListener('DOMNodeInserted', listener, true);
                    return resolve(null);
                }, timeout);
            }
        }
    });
}

function missonHomeWork() {
    logger('开始处理作业', 'green')
    let $_homeworktable = $('.mark_table').find('form')
    let TimuList = $_homeworktable.find('.questionLi')
    doHomeWork(0, TimuList)
}

function doHomeWork(index, TiMuList) {
    if (index == TiMuList.length) {
        logger('作业题目已全部完成', 'green')
        return
    }

    let typeName = $(TiMuList[index]).attr('typename');
    let _type = ({ 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4, 写作题: 5, 翻译题: 6 })[typeName]
    let _questionFull = $(TiMuList[index]).find('.mark_name').html()
    let _question = tidyQuestion(_questionFull).replace(/^[(].*?[)]/, '').trim()
    let _a = []
    let _answerTmpArr, _textareaList
    var check_answer_flag = 0;

    // 如果题型不在预设类型中，根据DOM结构自动识别题型
    if (_type === undefined) {
        logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');

        // 检查是否有选择题特征
        _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p');
        if (_answerTmpArr && _answerTmpArr.length > 0) {
            _type = 0; // 假定为单选题
            // 再检查是否可能是多选题
            let hasMultipleChoices = false;
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).parent().find('input[type="checkbox"]').length > 0) {
                    hasMultipleChoices = true;
                    break;
                }
            }
            if (hasMultipleChoices) {
                _type = 1; // 多选题
                logger('自动识别为多选题', 'green');
            } else {
                logger('自动识别为单选题', 'green');
            }
        }
        // 检查是否有文本输入框特征
        else {
            _textareaList = $(TiMuList[index]).find('.stem_answer').find('.divText textarea, .eidtDiv textarea, .divText .edui-editor');
            if (_textareaList && _textareaList.length > 0) {
                _type = 4; // 简答题
                logger('自动识别为简答题', 'green');
            }
        }
    }

    switch (_type) {
        case 0:
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')

            //遍历选项列表
            var mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = "单选题:" + _question + '\n' + mergedAnswers
            //判断题目是否已作答
            for (var i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).parent().find('span').attr('class').indexOf('check_answer') == -1) {
                    //没有被选择
                } else {
                    logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                    check_answer_flag = 1;
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30)
                    break
                }
            }
            if (check_answer_flag == 0) {
                getAnswer(_type, _question).then((agrs) => {
                    $.each(_answerTmpArr, (i, t) => {
                        _a.push(tidyStr($(t).html()))
                    })
                    let _i = _a.findIndex((item) => item == agrs)

                    if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                        //修改题目将答案插入
                        let timuele = $(TiMuList[index]).find('.mark_name')
                        // logger("timuele题目标签:"+timuele.html())
                        timuele.html(timuele.html() + "<p></p>" + agrs)
                    }
                    if (_i == -1) {
                        logger('AI无法完美匹配正确答案,请手动选择，跳过此题', 'red')
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                    } else {
                        setTimeout(() => {
                            let check = $(_answerTmpArr[_i]).parent().find('span').attr('class')
                            if (check.indexOf('check_answer') == -1) {
                                $(_answerTmpArr[_i]).parent().click()
                            }
                            logger('自动答题成功，准备切换下一题', 'green')
                            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                        }, 300)
                    }
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                    }
                })
            }
            break

        case 1:
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
            //遍历选项列表
            var mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = "多选题:" + _question + '\n' + mergedAnswers
            //判断题目是否已作答
            for (var i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).parent().find('span').attr('class').indexOf('check_answer') == -1) {
                    //没有被选择
                } else {
                    logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                    check_answer_flag = 1;
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30)
                    break
                }
            }
            if (check_answer_flag == 0) {
                getAnswer(_type, _question).then((agrs) => {
                    if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                        //修改题目将答案插入
                        let timuele = $(TiMuList[index]).find('.mark_name')
                        // logger("timuele题目标签:"+timuele.html())
                        timuele.html(timuele.html() + "<p></p>" + agrs)
                    }
                    $.each(_answerTmpArr, (i, t) => {
                        if (agrs.indexOf(tidyStr($(t).html())) != -1) {
                            setTimeout(() => {
                                let check = $(_answerTmpArr[i]).parent().find('span').attr('class')
                                if (check.indexOf('check_answer_dx') == -1) {
                                    $(_answerTmpArr[i]).parent().click()
                                }
                            }, 300)
                        }
                    })
                    logger('自动答题成功，准备切换下一题', 'green')
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                    }
                })
            }
            break
        case 2:
            _question = "填空题,用\"|\"分割多个答案:" + _question;
            _textareaList = $(TiMuList[index]).find('.stem_answer').find('.Answer .divText .textDIV textarea');
            // 判断题目是否已作答
            let _id = $(_textareaList).attr('id');
            if (UE.getEditor(_id).getContent() !== '') {
                logger(index + 1 + '此题已作答，准备切换下一题', 'green');
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30);
            } else {
                getAnswer(_type, _question).then((agrs) => {
                    $.each(_textareaList, (i, t) => {
                        let _currentId = $(t).attr('id'); // 使用不同的变量名保存当前文本框的ID
                        if (UE.getEditor(_currentId).getContent() === '') {
                            let _answerTmpArr = agrs.split('|');
                            setTimeout(() => { UE.getEditor(_currentId).setContent(_answerTmpArr[i]) }, 300);
                        }
                    });
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                    logger('自动答题成功，准备切换下一题', 'green');
                });
            }
            break;

        case 3:
            let _true = '正确|是|对|√|T|ri'
            let _false = '错误|否|错|×|F|wr'
            let _i = 0
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
            _question = "判断题(只回答正确或错误):" + _question + '\n' + _answerTmpArr.text()
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            })
            //判断题目是否已作答
            for (var i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).parent().find('span').attr('class').indexOf('check_answer') == -1) {
                    //没有被选择
                } else {
                    logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                    check_answer_flag = 1;
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30)
                    break
                }
            }
            if (check_answer_flag == 0) {
                getAnswer(_type, _question).then((agrs) => {
                    if (_true.indexOf(agrs) != -1) {
                        _i = _a.findIndex((item) => _true.indexOf(item) != -1)
                    } else if (_false.indexOf(agrs) != -1) {
                        _i = _a.findIndex((item) => _false.indexOf(item) != -1)
                    } else {
                        logger('答案匹配出错，准备切换下一题', 'green')
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                        return
                    }
                    setTimeout(() => {
                        let check = $(_answerTmpArr[_i]).parent().find('span').attr('class')
                        if (check.indexOf('check_answer') == -1) {
                            $(_answerTmpArr[_i]).parent().click()
                        }
                    }, 300)
                    logger('自动答题成功，准备切换下一题', 'green')
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                    }
                })
            }
            break
        case 4:
            _question = "用50字简要回答:" + _question
            // 尝试查找所有可能的输入区域
            let normalTextareas = $(TiMuList[index]).find('.stem_answer').find('.eidtDiv textarea');
            let ueditorContainers = $(TiMuList[index]).find('.stem_answer').find('.divText .edui-editor');

            // 处理普通文本框
            if (normalTextareas && normalTextareas.length > 0) {
                // 判断题目是否已作答
                $.each(normalTextareas, (i, t) => {
                    let _id = $(t).attr('id'); // 获取当前文本框的ID
                    if (UE.getEditor(_id).getContent() !== '') {
                        logger(index + 1 + '此题已作答，准备切换下一题', 'green');
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30);
                    } else {
                        getAnswer(_type, _question).then((agrs) => {
                            setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
                            logger('自动答题成功，准备切换下一题', 'green');
                            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                        }).catch((agrs) => {
                            if (agrs['c'] == 0) {
                                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                            }
                        });
                    }
                });
            }
            // 处理材料题的富文本编辑器
            else if (ueditorContainers && ueditorContainers.length > 0) {
                // 查找编辑器ID
                let editorId = $(TiMuList[index]).find('.stem_answer textarea[name^="answerEditor"]').attr('id');
                if (editorId) {
                    logger('检测到材料题编辑器ID: ' + editorId, 'green');
                    // 检查是否已作答
                    if (UE.getEditor(editorId).getContent() !== '') {
                        logger(index + 1 + '此题已作答，准备切换下一题', 'green');
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30);
                    } else {
                        getAnswer(_type, _question).then((agrs) => {
                            setTimeout(() => { UE.getEditor(editorId).setContent(agrs) }, 300);
                            logger('自动答题成功，准备切换下一题', 'green');
                            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                        }).catch((agrs) => {
                            if (agrs['c'] == 0) {
                                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                            }
                        });
                    }
                } else {
                    logger('无法找到编辑器ID，跳过此题', 'red');
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                }
            } else {
                logger('未找到有效的文本输入区域，跳过此题', 'red');
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
            }
            break;
        case 5:
            _answerEle = $_ansdom.find('.subEditor textarea')
            jdt = "用英文根据题目进行写作:" + _question
            $.each(_answerEle, (i, t) => {
                getAnswer(_qType, jdt).then((agrs) => {
                    let _id = $(t).attr('name')
                    setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
                });
            });
            break
        case 6:
            _answerEle = $_ansdom.find('.subEditor textarea')
            jdt = "中文英文翻译题:" + _question
            $.each(_answerEle, (i, t) => {
                getAnswer(_qType, jdt).then((agrs) => {
                    let _id = $(t).attr('name')
                    setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
                });
            });
            break
        default:
            if (_type === undefined) {
                logger('无法识别题型：' + typeName + '，跳过此题', 'red')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
            } else {
                // 尝试获取文本输入区域
                _textareaList = $(TiMuList[index]).find('.stem_answer').find('textarea, .divText textarea, .eidtDiv textarea, .divText .edui-editor');
                if (_textareaList && _textareaList.length > 0) {
                    logger('检测到文本输入区域，尝试回答', 'green');
                    jdt = "未知题型 请根据问题回答:" + _question

                    // 检查是否有富文本编辑器特有的textarea
                    let editorTextareas = $(TiMuList[index]).find('.stem_answer textarea[name^="answerEditor"]');
                    if (editorTextareas && editorTextareas.length > 0) {
                        // 使用富文本编辑器ID
                        let editorId = $(editorTextareas[0]).attr('id');
                        if (editorId) {
                            getAnswer(4, jdt).then((agrs) => {
                                setTimeout(() => { UE.getEditor(editorId).setContent(agrs) }, 300);
                                logger('使用富文本编辑器ID回答成功，准备切换下一题', 'green');
                                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                            }).catch((agrs) => {
                                if (agrs['c'] == 0) {
                                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                                }
                            });
                        } else {
                            logger('找到富文本编辑器但无法获取ID，改用普通方法', 'yellow');
                            // 如果没有ID，退回到常规处理
                            normalTextareaProcess();
                        }
                    } else {
                        // 处理普通文本输入区域
                        normalTextareaProcess();
                    }

                    // 处理普通文本区域的函数
                    function normalTextareaProcess() {
                        $.each(_textareaList, (i, t) => {
                            let _id = $(t).attr('id') || $(t).attr('name');
                            getAnswer(4, jdt).then((agrs) => {
                                setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
                                logger('自动答题成功，准备切换下一题', 'green');
                                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                            }).catch((agrs) => {
                                if (agrs['c'] == 0) {
                                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                                }
                            });
                        });
                    }
                } else {
                    logger('无法处理此题型：' + typeName + '，跳过此题', 'red');
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                }
            }
    }
}

function missonExam() {
    let $_examtable = $('.mark_table').find('.whiteDiv')
    let _questionFull = tidyStr($_examtable.find('h3.mark_name').html().trim())
    let typeName = _questionFull.match(/[(](.*?),.*?分[)]|$/)[1];
    let _qType = ({ 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4, 论述题: 4, 写作题: 5, 翻译题: 6 })[typeName]
    let _question = tidyQuestion(_questionFull.replace(/[(].*?分[)]/, '').replace(/^\s*/, ''))
    let $_ansdom = $_examtable.find('#submitTest').find('.stem_answer')
    let _answerTmpArr;
    let _a = []

    // 如果题型不在预设类型中，根据DOM结构自动识别题型
    if (_qType === undefined) {
        logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');

        // 检查是否有选择题特征
        _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p');
        if (_answerTmpArr && _answerTmpArr.length > 0) {
            _qType = 0; // 假定为单选题

            // 检查是否有多个可选项
            let multiChoiceCheck = $_ansdom.find('.clearfix.answerBg input[type="checkbox"]');
            if (multiChoiceCheck && multiChoiceCheck.length > 0) {
                _qType = 1; // 多选题
                logger('自动识别为多选题', 'green');
            } else {
                logger('自动识别为单选题', 'green');
            }
        }
        // 检查是否有文本输入框特征
        else {
            let _textareaList = $_ansdom.find('.Answer .divText .subEditor textarea, .Answer .divText .edui-editor');
            if (_textareaList && _textareaList.length > 0) {
                _qType = 4; // 简答题
                logger('自动识别为简答题', 'green');
            }
        }
    }

    switch (_qType) {
        case 0:
            _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
            //遍历选项列表
            var mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = "单选题:" + _question + '\n' + mergedAnswers
            _question = tidyQuestion(_question.replace(/[(].*?分[)]/, '').replace(/^\s*/, ''))
            // logger(_question)
            getAnswer(_qType, _question).then((agrs) => {
                $.each(_answerTmpArr, (i, t) => {
                    _a.push(tidyStr($(t).html()))
                })
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    //修改题目将答案插入
                    let timuele = $_examtable.find('h3.mark_name')
                    // logger(timuele.html())
                    timuele.html(timuele.html() + agrs)
                }

                let _i = _a.findIndex((item) => item == agrs)
                if (_i == -1) {
                    logger('AI无法完美匹配正确答案,请手动选择，跳过此题', 'red')
                    setTimeout(toNextExam, 5000)
                } else {
                    setTimeout(() => {
                        if ($(_answerTmpArr[_i]).parent().find('span').attr('class').indexOf('check_answer') == -1) {
                            //好学生模式,ABCD加粗
                            if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                                $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold');
                            } else {
                                setTimeout(() => { $(_answerTmpArr[_i]).parent().click() }, 300)
                            }
                            logger('自动答题成功，准备切换下一题', 'green')
                            toNextExam()
                        } else {
                            logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                            toNextExam()
                        }
                    }, 300)
                }
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    toNextExam()
                }
            })
            break
        case 1:
            _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
            //遍历选项列表
            var mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = "多选题:" + _question + '\n' + mergedAnswers
            getAnswer(_qType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    //修改题目将答案插入
                    let timuele = $_examtable.find('h3.mark_name')
                    // logger(timuele.html())
                    timuele.html(timuele.html() + agrs)
                }

                if ($_ansdom.find('.clearfix.answerBg span.check_answer_dx').length > 0) {
                    logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                    toNextExam()
                } else {
                    $.each(_answerTmpArr, (i, t) => {
                        if (agrs.indexOf(tidyStr($(t).html())) != -1) {
                            //好学生模式,ABCD加粗
                            if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                                $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold');
                            } else {
                                setTimeout(() => { $(_answerTmpArr[i]).parent().click() }, 300)
                            }
                        }
                    });
                    logger('自动答题成功，准备切换下一题', 'green')
                    toNextExam()
                }
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    toNextExam()
                }
            })
            break
        case 2:
            _question = "填空题,用\"|\"分割多个答案:" + _question;
            let _textareaList = $_ansdom.find('.Answer .divText .subEditor textarea')
            // logger(_textareaList)
            getAnswer(_qType, _question).then((agrs) => {
                let _answerTmpArr = agrs.split('|')
                $.each(_textareaList, (i, t) => {
                    // logger(t)
                    let _id = $(t).attr('id')
                    setTimeout(() => { UE.getEditor(_id).setContent(_answerTmpArr[i]) }, 300)
                })
                logger('自动答题成功，准备切换下一题', 'green')
                toNextExam()
            })
            break
        case 3:
            let _true = '正确|是|对|√|T|ri'
            let _false = '错误|否|错|×|F|wr'
            let _i = 0
            _question = "判断题(只回答正确或错误):" + _question;
            _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            })
            getAnswer(_qType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    //修改题目将答案插入
                    let timuele = $_examtable.find('h3.mark_name')
                    // logger(timuele.html())
                    timuele.html(timuele.html() + agrs)
                }

                if (_true.indexOf(agrs) != -1) {
                    _i = _a.findIndex((item) => _true.indexOf(item) != -1)
                } else if (_false.indexOf(agrs) != -1) {
                    _i = _a.findIndex((item) => _false.indexOf(item) != -1)
                } else {
                    logger('答案匹配出错，准备切换下一题', 'green')
                    toNextExam()
                    return
                }
                if ($(_answerTmpArr[_i]).parent().find('span').attr('class').indexOf('check_answer') == -1) {
                    //好学生模式,ABCD加粗
                    if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                        setTimeout(() => { $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold'); }, 300)
                    } else {
                        $(_answerTmpArr[_i]).parent().click()
                    }
                    logger('自动答题成功，准备切换下一题', 'green')
                    toNextExam()
                } else {
                    logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                    toNextExam()
                }
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    toNextExam()
                }
            })
            break
        case 4:
            _answerEle = $_ansdom.find('.subEditor textarea')
            jdt = "用50字简要回答:" + _question
            $.each(_answerEle, (i, t) => {
                getAnswer(_qType, jdt).then((agrs) => {
                    let _id = $(t).attr('name')
                    setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
                    toNextExam()
                });
            });
            break
        case 5:
            _answerEle = $_ansdom.find('.subEditor textarea')
            jdt = "用英文根据题目进行写作:" + _question
            $.each(_answerEle, (i, t) => {
                getAnswer(_qType, jdt).then((agrs) => {
                    let _id = $(t).attr('name')
                    setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
                    toNextExam()
                });
            });
            break
        case 6:
            _answerEle = $_ansdom.find('.subEditor textarea')
            jdt = "中文英文翻译题:" + _question
            $.each(_answerEle, (i, t) => {
                getAnswer(_qType, jdt).then((agrs) => {
                    let _id = $(t).attr('name')
                    setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300);
                    toNextExam()
                });
            });
            break
        default:
            if (_qType === undefined) {
                logger('无法识别题型：' + typeName + '，跳过此题', 'red')
                toNextExam()
            } else {
                // 尝试获取文本输入区域
                // 查找所有可能的文本输入区域
                let standardTextareas = $_ansdom.find('.Answer .divText .subEditor textarea');
                let richEditors = $_ansdom.find('.Answer .divText .edui-editor');

                // 首先检查是否有材料题特有的富文本编辑器textarea
                let editorTextareas = $_ansdom.find('textarea[name^="answerEditor"]');

                if (editorTextareas && editorTextareas.length > 0) {
                    logger('检测到材料题富文本编辑器，尝试回答', 'green');
                    let editorId = $(editorTextareas[0]).attr('id');
                    if (editorId) {
                        jdt = "材料题 请根据材料详细回答:" + _question
                        getAnswer(4, jdt).then((agrs) => {
                            setTimeout(() => { UE.getEditor(editorId).setContent(agrs) }, 300);
                            logger('材料题自动答题成功，准备切换下一题', 'green');
                            toNextExam();
                        }).catch((agrs) => {
                            if (agrs['c'] == 0) {
                                toNextExam();
                            }
                        });
                    } else {
                        logger('找到材料题编辑器但无法获取ID，尝试其他方法', 'yellow');
                        processStandardTextareas();
                    }
                }
                // 处理标准文本区域
                else if (standardTextareas && standardTextareas.length > 0) {
                    processStandardTextareas();
                }
                // 处理其他类型的富文本编辑器
                else if (richEditors && richEditors.length > 0) {
                    logger('检测到富文本编辑器，尝试查找编辑器ID', 'green');

                    // 尝试在页面中查找所有可能的编辑器ID
                    let editorScripts = $('script:contains("UE.getEditor")');
                    let editorIdMatch = null;

                    if (editorScripts && editorScripts.length > 0) {
                        // 从脚本中提取编辑器ID
                        let scriptContent = editorScripts.text();
                        let matches = scriptContent.match(/UE\.getEditor\(['"](.*?)['"]/);
                        if (matches && matches.length > 1) {
                            editorIdMatch = matches[1];
                            logger('从脚本中发现编辑器ID: ' + editorIdMatch, 'green');
                        }
                    }

                    if (editorIdMatch) {
                        jdt = "材料题 请根据材料详细回答:" + _question
                        getAnswer(4, jdt).then((agrs) => {
                            setTimeout(() => { UE.getEditor(editorIdMatch).setContent(agrs) }, 300);
                            logger('使用脚本找到的编辑器ID回答成功，准备切换下一题', 'green');
                            toNextExam();
                        }).catch((agrs) => {
                            if (agrs['c'] == 0) {
                                toNextExam();
                            }
                        });
                    } else {
                        logger('无法找到有效的编辑器ID，跳过此题', 'red');
                        toNextExam();
                    }
                }
                else {
                    logger('无法处理此题型：' + typeName + '，跳过此题', 'red');
                    toNextExam();
                }

                // 处理标准文本区域的函数
                function processStandardTextareas() {
                    logger('检测到标准文本输入区域，尝试回答', 'green');
                    jdt = "未知题型 请根据问题回答:" + _question
                    getAnswer(4, jdt).then((agrs) => {
                        $.each(standardTextareas, (i, t) => {
                            let _id = $(t).attr('id')
                            setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300)
                        })
                        logger('自动答题成功，准备切换下一题', 'green')
                        toNextExam()
                    }).catch((agrs) => {
                        if (agrs['c'] == 0) {
                            toNextExam()
                        }
                    })
                }
            }
    }
}

function toNextExam() {
    if (localStorage.getItem('GPTJsSetting.examTurn') === 'true') {
        let $_examtable = $('.mark_table').find('.whiteDiv')
        let $nextbtn = $_examtable.find('.nextDiv a.jb_btn')
        setTimeout(() => {
            $nextbtn.click()
        }, setting.examTurnTime ? 2000 + (Math.floor(Math.random() * 5 + 1) * 1000) : 2000)
    } else {
        logger('用户设置不自动跳转下一题，请手动点击', 'blue')
    }
}

function uploadExam() {
    logger('考试答案收录功能处于bate阶段，遇到bug请及时反馈!!', 'red')
    logger('考试答案收录功能处于bate阶段，遇到bug请及时反馈!!', 'red')
    logger('开始收录考试答案', 'green')
    let TimuList = $('.mark_table .mark_item .questionLi')
    let data = []
    $.each(TimuList, (i, t) => {
        let _a = {}
        let _answer
        let _answerTmpArr, _answerList = []
        let TiMuFull = tidyQuestion($(t).find('h3').html())
        let typeName = TiMuFull.match(/[(](.*?)[)]|$/)[1].replace(/,.*?分/, '');
        let _type = ({ 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 })[typeName]
        let _question = TiMuFull.replace(/^[(].*?[)]|$/, '').trim()
        let _rightAns = $(t).find('.mark_answer').find('.colorGreen').text().replace(/正确答案[:：]/, '').trim()

        // 如果题型不在预设类型中，尝试从答案格式判断题型
        if (_type === undefined) {
            // 检查题目结构判断题型
            if (_rightAns.length > 0) {
                if (_rightAns.match(/^[A-G]$/) !== null) {
                    _type = 0; // 单选题
                } else if (_rightAns.match(/^[A-G]{2,}$/) !== null) {
                    _type = 1; // 多选题
                } else if (_rightAns === "√" || _rightAns === "×" || _rightAns === "对" || _rightAns === "错") {
                    _type = 3; // 判断题
                } else {
                    _type = 4; // 默认为简答题
                }
            }
        }

        switch (_type) {
            case 0:
                if (_rightAns.length <= 0) {
                    _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class')
                    _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text()
                    if (_isTrue == 'marking_dui' || _isZero != '0') {
                        _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/我的答案[:：]/, '').trim()
                    } else {
                        break
                    }
                }
                _answerTmpArr = $(t).find('.mark_letter li')
                $.each(_answerTmpArr, (a, b) => {
                    _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ''))
                })
                let _i = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[_rightAns]
                _answer = _answerList[_i]
                _a['question'] = _question
                _a['type'] = _type
                _a['answer'] = _answer
                data.push(_a)
                break
            case 1:
                _answer = []
                if (_rightAns.length <= 0) {
                    _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class')
                    _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text()
                    if (_isTrue == 'marking_dui' || _isTrue == 'marking_bandui' || _isZero != '0') {
                        _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/我的答案[:：]/, '').trim()
                    } else {
                        break
                    }
                }
                _answerTmpArr = $(t).find('.mark_letter li')
                $.each(_answerTmpArr, (a, b) => {
                    _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ''))
                })
                $.each(_rightAns.split(''), (c, d) => {
                    let _i = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[d]
                    _answer.push(_answerList[_i])
                })
                _a['question'] = _question
                _a['type'] = _type
                _a['answer'] = _answer.join("#")
                data.push(_a)
                break
            case 2:
                _answerTmpArr = []
                let answers = $(t).find('.mark_answer').find('.colorDeep').find('dd')
                if (_rightAns.length <= 0) {
                    $.each(answers, (i, t) => {
                        _isTrue = $(t).find('span:eq(1)').attr('class')
                        if (_isTrue == 'marking_dui') {
                            _rightAns = $(t).find('span:eq(0)').html()
                            _answerTmpArr.push(_rightAns.replace(/[(][0-9].*?[)]/, '').replace(/第.*?空:/, '').trim())
                        } else {
                            return
                        }
                    })
                    _answer = _answerTmpArr.join('#')
                } else {
                    _answer = _rightAns.replace(/\s/g, '').replace(/[(][0-9].*?[)]/g, '#').replace(/第.*?空:/g, '#').replace(/^#*/, '')
                }
                if (_answer.length != 0) {
                    _a['question'] = _question
                    _a['type'] = _type
                    _a['answer'] = _answer
                    data.push(_a)
                }
                break
            case 3:
                if (_rightAns.length <= 0) {
                    _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class')
                    _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text()
                    if (_isTrue == 'marking_dui' || _isZero != '0') {
                        _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/我的答案[:：]/, '').trim()
                    } else {
                        let _true = '正确|是|对|√|T|ri'
                        _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/我的答案[:：]/, '').trim()
                        if (_true.indexOf(_rightAns) != -1) {
                            _rightAns = '错'
                        } else {
                            _rightAns = '对'
                        }
                    }
                }
                _a['question'] = _question
                _a['type'] = _type
                _a['answer'] = _rightAns
                data.push(_a)
                break
            case 4:
                if (_rightAns.length <= 0) {
                    break
                }
                _a['question'] = _question
                _a['type'] = _type
                _a['answer'] = _rightAns
                data.push(_a)
                break
            default:
                break
        }
    })
    // setTimeout(() => { uploadAnswer(data) }, 1500)

}

function refreshCourseList() {
    let _p = parseUrlParams()
    return new Promise((resolve, reject) => {
        $.ajax({
            url: _l.protocol + '//' + _l.host + '/mycourse/studentstudycourselist?courseId=' + _p['courseid'] + '&chapterId=' + _p['knowledgeid'] + '&clazzid=' + _p['clazzid'] + '&mooc2=1',
            type: 'GET',
            dateType: 'html',
            success: function (res) {
                resolve(res)
            }
        })
    })

}

function updateAudio(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt) {
    return new Promise((resolve, reject) => {
        getEnc(classId, userId, jobId, objectId, playingTime, duration, clipTime).then((enc) => {
            if (reportUrlChange) {
                reportUrl = http2https(reportUrl)
            }
            $.ajax({
                url: reportUrl + '/' + dtoken + '?clazzId=' + classId + '&playingTime=' + playingTime + '&duration=' + duration + '&clipTime=' + clipTime + '&objectId=' + objectId + '&otherInfo=' + otherInfo + '&jobid=' + jobId + '&userid=' + userId + '&isdrag=' + isdrag + '&view=pc&enc=' + enc + '&rt=' + Number(_rt) + '&dtype=Audio&_t=' + String(Math.round(new Date())),
                type: 'GET',
                success: function (res) {
                    try {
                        if (res['isPassed']) {
                            if (setting.review && playingTime != duration) {
                                resolve(1)
                            } else {
                                resolve(2)
                            }
                        } else {
                            if (setting.rate == 0 && playingTime == duration) {
                                resolve(2)
                            } else {
                                resolve(1)
                            }
                        }
                    } catch (e) {
                        logger('发生错误：' + e, 'red')
                        resolve(0)
                    }
                },
                error: function (xhr) {
                    if (xhr.status == 403) {
                        logger('超星返回错误信息，尝试更换参数，40s后将重试，请等待...', 'red')
                        resolve(3)
                    } else {
                        reportUrlChange = 1;
                        logger('超星返回错误信息，如果持续出现，请联系作者', 'red')
                    }
                }
            })
        })
    })
}

function updateVideo(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag, _rt) {
    return new Promise((resolve, reject) => {
        getEnc(classId, userId, jobId, objectId, playingTime, duration, clipTime).then((enc) => {
            if (reportUrlChange) {
                reportUrl = http2https(reportUrl)
            }
            $.ajax({
                url: reportUrl + '/' + dtoken + '?clazzId=' + classId + '&playingTime=' + playingTime + '&duration=' + duration + '&clipTime=' + clipTime + '&objectId=' + objectId + '&otherInfo=' + otherInfo + '&jobid=' + jobId + '&userid=' + userId + '&isdrag=' + isdrag + '&view=pc&enc=' + enc + '&rt=' + Number(_rt) + '&dtype=Video&_t=' + String(Math.round(new Date())),
                type: 'GET',
                success: function (res) {
                    try {
                        if (res['isPassed']) {
                            if (setting.review && playingTime != duration) {
                                resolve(1)
                            } else {
                                resolve(2)
                            }
                        } else {
                            if (setting.rate == 0 && playingTime == duration) {
                                resolve(2)
                            } else {
                                resolve(1)
                            }
                        }
                    } catch (e) {
                        logger('发生错误：' + e, 'red')
                        resolve(0)
                    }
                },
                error: function (xhr) {
                    if (xhr.status == 403) {
                        logger('超星返回错误信息，尝试更换参数，40s后将重试，请等待...', 'red')
                        resolve(3)
                    } else {
                        reportUrlChange = 1;
                        logger('超星返回错误信息，如果持续出现，请联系作者', 'red')
                    }
                }
            })
        })
    })
}

function upLoadWork(index, doms, dom) {
    let $CyHtml = $(dom).contents().find('.CeYan')
    let TiMuList = $CyHtml.find('.TiMu')
    let data = []
    for (let i = 0; i < TiMuList.length; i++) {
        let _a = {}
        let questionFull = $(TiMuList[i]).find('.Zy_TItle.clearfix > div.clearfix').html().trim()
        let _question = tidyQuestion(questionFull)
        let _TimuType = ({ 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 })[questionFull.match(/^【(.*?)】|$/)[1]]
        _a['question'] = _question
        _a['type'] = _TimuType
        let _selfAnswerCheck = $(TiMuList[i]).find('.Py_answer.clearfix > i').attr('class')
        switch (_TimuType) {
            case 0:
                if (_selfAnswerCheck == "fr dui") {
                    let _selfAnswer = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[$(TiMuList[i]).find('.Py_answer.clearfix > span').html().trim().replace(/正确答案[:：]/, '').replace(/我的答案[:：]/, '').trim()]
                    let _answerForm = $(TiMuList[i]).find('.Zy_ulTop li')
                    let _answer = $(_answerForm[_selfAnswer]).find('a.fl').html()
                    _a['answer'] = tidyStr(_answer)
                }
                break
            case 1:
                let _answerArr = $(TiMuList[i]).find('.Py_answer.clearfix > span').html().trim().replace(/正确答案[:：]/, '').replace(/我的答案[:：]/, '').trim()
                let _answerForm = $(TiMuList[i]).find('.Zy_ulTop li')
                let _answer = []
                if (_selfAnswerCheck == "fr dui" || _selfAnswerCheck == "fr bandui") {
                    for (let i = 0; i < _answerArr.length; i++) {
                        let _answerIndex = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[_answerArr[i]]
                        _answer.push($(_answerForm[_answerIndex]).find('a.fl').html())
                    }
                } else {
                    break
                }
                _a['answer'] = tidyStr(_answer.join('#'))
                break
            case 2:
                let _TAnswerArr = $(TiMuList[i]).find('.Py_answer.clearfix .clearfix')
                let _TAnswer = []
                for (let i = 0; i < _TAnswerArr.length; i++) {
                    let item = _TAnswerArr[i];
                    if ($(item).find('i').attr('class') == 'fr dui') {
                        _TAnswer.push($(item).find('p').html().replace(/[(][0-9].*?[)]/, '').replace(/第.*?空:/, '').trim())
                    }
                }
                if (_TAnswer.length <= 0) { break }
                _a['answer'] = tidyStr(_TAnswer.join('#'))
                break
            case 3:
                if (_selfAnswerCheck == "fr dui") {
                    let _answer = $(TiMuList[i]).find('.Py_answer.clearfix > span > i').html().replace(/正确答案[:：]/, '').replace(/我的答案[:：]/, '').trim()
                    _a['answer'] = tidyStr(_answer)
                } else {
                    if ($(TiMuList[i]).find('.Py_answer.clearfix > span > i').html()) {
                        let _answer = $(TiMuList[i]).find('.Py_answer.clearfix > span > i').html().replace(/正确答案[:：]/, '').replace(/我的答案[:：]/, '').trim()
                        _a['answer'] = (tidyStr(_answer) == '√' ? 'x' : '√')
                    } else {
                        break
                    }
                }
                break
            case 4:
                break
        }
        if (_a['answer'] != undefined) {
            data.push(_a)
        } else {
            continue
        }
    }
    uploadAnswer(data).then(() => {
        _mlist.splice(0, 1)
        _domList.splice(0, 1)
        setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
    })
}


function uploadHomeWork() {
    logger('开始收录答案', 'green')
    let $_homeworktable = $('.mark_table')
    let TiMuList = $_homeworktable.find('.mark_item').find('.questionLi')
    let data = []
    $.each(TiMuList, (i, t) => {
        let _a = {}
        let _answer
        let _answerTmpArr, _answerList = []
        let TiMuFull = tidyQuestion($(t).find('h3.mark_name').html())
        let TiMuType = ({ 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 })[TiMuFull.match(/[(](.*?)[)]|$/)[1].replace(/, .*?分/, '')]
        let TiMu = TiMuFull.replace(/^[(].*?[)]|$/, '').trim()
        let _rightAns = $(t).find('.mark_answer').find('.colorGreen').text().replace(/正确答案[:：]/, '').trim()
        switch (TiMuType) {
            case 0:
                if (_rightAns.length <= 0) {
                    _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class')
                    _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text()
                    if (_isTrue == 'marking_dui' || _isZero != '0') {
                        _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/我的答案[:：]/, '').trim()
                    } else {
                        return
                    }
                }
                _answerTmpArr = $(t).find('.mark_letter li')
                $.each(_answerTmpArr, (a, b) => {
                    _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ''))
                })
                let _i = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[_rightAns]
                _answer = _answerList[_i]
                _a['question'] = TiMu
                _a['type'] = TiMuType
                _a['answer'] = _answer
                data.push(_a)
                break
            case 1:
                _answer = []
                if (_rightAns.length <= 0) {
                    _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class')
                    _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text()
                    if (_isTrue == 'marking_dui' || _isTrue == 'marking_bandui' || _isZero != '0') {
                        _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/我的答案[:：]/, '').trim()
                    } else {
                        break
                    }
                }
                _answerTmpArr = $(t).find('.mark_letter li')
                $.each(_answerTmpArr, (a, b) => {
                    _answerList.push(tidyStr($(b).html()).replace(/[A-Z].\s*/, ''))
                })
                $.each(_rightAns.split(''), (c, d) => {
                    let _i = ({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 })[d]
                    _answer.push(_answerList[_i])
                })
                _a['question'] = TiMu
                _a['type'] = TiMuType
                _a['answer'] = _answer.join("#")
                data.push(_a)
                break
            case 2:
                _answerTmpArr = []
                let answers = $(t).find('.mark_answer').find('.colorDeep').find('dd')
                if (_rightAns.length <= 0) {
                    $.each(answers, (i, t) => {
                        _isTrue = $(t).find('span:eq(1)').attr('class')
                        if (_isTrue == 'marking_dui') {
                            _rightAns = $(t).find('span:eq(0)').html()
                            _answerTmpArr.push(_rightAns.replace(/[(][0-9].*?[)]/, '').replace(/第.*?空:/, '').trim())
                        } else {
                            return
                        }
                    })
                    _answer = _answerTmpArr.join('#')
                } else {
                    _answer = _rightAns.replace(/\s/g, '').replace(/[(][0-9].*?[)]/g, '#').replace(/第.*?空:/g, '#').replace(/^#*/, '')
                }
                if (_answer.length != 0) {
                    _a['question'] = TiMu
                    _a['type'] = TiMuType
                    _a['answer'] = _answer
                    data.push(_a)
                }
                break
            case 3:
                if (_rightAns.length <= 0) {
                    _isTrue = $(t).find('.mark_answer').find('.mark_score span').attr('class')
                    _isZero = $(t).find('.mark_answer').find('.mark_score .totalScore.fr i').text()
                    if (_isTrue == 'marking_dui' || _isZero != '0') {
                        _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/我的答案[:：]/, '').trim()
                    } else {
                        let _true = '正确|是|对|√|T|ri'
                        _rightAns = $(t).find('.mark_answer').find('.colorDeep').text().replace(/我的答案[:：]/, '').trim()
                        if (_true.indexOf(_rightAns) != -1) {
                            _rightAns = '错'
                        } else {
                            _rightAns = '对'
                        }
                    }
                }
                _a['question'] = TiMu
                _a['type'] = TiMuType
                _a['answer'] = _rightAns
                data.push(_a)
                break
            case 4:
                if (_rightAns.length <= 0) {
                    break
                }
                _a['question'] = TiMu
                _a['type'] = TiMuType
                _a['answer'] = _rightAns
                data.push(_a)
                break
        }
    })
    setTimeout(() => { uploadAnswer(data) }, 1500)
}

function getEnc(a, b, c, d, e, f, g) {
    // return new Promise((resolve, reject) => {
    //     try {
    //         GM_xmlhttpRequest({
    //             url: "127.0.0.1" + "/api/v1/enc?a=" + a + '&b=' + b + '&c=' + c + '&d=' + d + '&e=' + e + '&f=' + f + '&g=' + g + '&v=' + GM_info['script']['version'],
    //             method: 'GET',
    //             timeout: 3000,
    //             headers: {
    //                 'Authorization': localStorage.getItem('netok')
    //             },
    //             onload: function (xhr) {
    //                 let res = $.parseJSON(xhr.responseText)
    //                 if (res['code'] == 200) {
    //                     enc = res['data']['ne21enc']
    //                     if (enc.length != 32) {
    //                         logger('获取enc出错！' + enc, 'red')
    //                         reject()
    //                     } else {
    //                         resolve(enc)
    //                     }
    //                 } else {
    //                     logger(res['msg'], 'red')
    //                     reject()
    //                 }
    //             }
    //         })
    //     } catch (e) {
    //         logger('获取enc出错！' + e, 'red')
    //         reject()
    //     }
    // })
}


function getAnswer(_t, _q, retryCount = 0) {
    logger('题目:' + _q, 'pink')
    return new Promise((resolve, reject) => {
        let _u = getCk('_uid') || getCk('UID')
        let requestCompleted = false;  // 标记请求是否已完成
        let longWaitTimer = null;  // 长时间等待定时器
        
        // 设置5分钟的监控定时器
        longWaitTimer = setTimeout(() => {
            if (!requestCompleted) {
                logger('请求超过5分钟未响应，正在重新发起请求...（第' + (retryCount + 1) + '次重试）', 'orange')
                requestCompleted = true;  // 标记为已完成，避免处理旧响应
                // 重新发起请求
                getAnswer(_t, _q, retryCount + 1).then(resolve).catch(reject)
            }
        }, 300000);  // 5分钟 = 300000毫秒
        
        GM_xmlhttpRequest({
            method: 'POST',
            url: _host + '/api/v1/cx?v=' + GM_info['script']['version'],
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': ''
            },
            data: 'question=' + encodeURIComponent(_q) + '&u=' + _u + '&model=' + localStorage.getItem('GPTJsSetting.model'),
            timeout: 120000,
            onload: function (xhr) {
                // 如果请求已经被标记为完成（超时重试了），则忽略此响应
                if (requestCompleted) {
                    logger('收到已超时请求的响应，已忽略', 'gray')
                    return;
                }
                
                requestCompleted = true;
                clearTimeout(longWaitTimer);  // 清除监控定时器
                
                if (xhr.status == 200) {
                    var obj = $.parseJSON(xhr.responseText) || {},
                        //正则表达式去掉句子最后一个句号
                        _answer = obj.data.answer.replace(/\。$/, '');
                    // _answer = obj.data.answer
                    // logger(_answer)
                    if (obj.code == 200 && _answer) {
                        logger("答案:" + _answer, 'purple')
                        resolve(_answer.replace(/^[A-Z]\s*\n\s*/, '').trim())
                    } else if (obj.msg && _answer != '') {
                        logger(obj.msg, 'red')
                        // setting.sub = 0
                        localStorage.setItem('GPTJsSetting.sub', false)
                        reject({ 'c': 0 })
                    } else {
                        logger('题目:' + _q + "<br />暂无答案", 'red')
                        // setting.sub = 0
                        localStorage.setItem('GPTJsSetting.sub', false)
                        reject({ 'c': 0 })
                    }
                } else if (xhr.status == 403) {
                    logger('请求过于频繁，请稍后再试', 'red')
                    reject({ 'c': 403 })
                } else if (xhr.status == 500) {
                    logger('ChatGPT官方服务器压力过大,请先保存答案后刷新重试', 'red')
                    reject({ 'c': 500 })
                } else if (xhr.status == 444) {
                    logger('IP异常，已被拉入服务器黑名单，请过几个小时再试', 'red')
                    reject({ 'c': 444 })
                } else if (xhr.status == 400) {
                    var obj = $.parseJSON(xhr.responseText) || {};
                    logger(obj.msg, 'red')
                    reject({ 'c': 400 })
                } else if (xhr.status == 222) {
                    var obj = $.parseJSON(xhr.responseText) || {};
                    logger("账户余额不足!", 'red')
                    reject({ 'c': 222 })
                } else {
                    logger('请求异常...,请先保存答案后刷新重试', 'red')
                    reject({ 'c': 555 })
                }
            },
            ontimeout: function () {
                // 如果请求已经被标记为完成（超时重试了），则忽略此超时
                if (requestCompleted) {
                    return;
                }
                
                requestCompleted = true;
                clearTimeout(longWaitTimer);  // 清除监控定时器
                
                logger('请求异常...,请先保存答案后刷新重试', 'red')
                reject({ 'c': 666 })
            }
        });
    })
}


function doWork(index, doms, dom) {
    $frame_c = $(dom).contents();
    let $CyHtml = $frame_c.find('.CeYan')
    let TiMuList = $CyHtml.find('.TiMu')
    $subBtn = $frame_c.find(".ZY_sub").find(".btnSubmit");
    $saveBtn = $frame_c.find(".ZY_sub").find(".btnSave");
    startDoWork(index, doms, 0, TiMuList)
}

function startDoWork(index, doms, c, TiMuList) {
    if (c == TiMuList.length) {
        if (localStorage.getItem('GPTJsSetting.sub') === 'true') {
            logger('测验处理完成，准备自动提交。', 'green')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $frame_c.find('#confirmSubWin > div > div > a.bluebtn').click()
                    logger('提交成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
                }, 3000)
            }, 5000)
        } else if (localStorage.getItem('GPTJsSetting.force') === 'true') {
            logger('测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。', 'red')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $frame_c.find('#confirmSubWin > div > div > a.bluebtn').click()
                    logger('提交成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
                }, 3000)
            }, 5000)
        } else {
            logger('测验处理完成，存在无答案题目或者用户设置不提交。', 'red')
        }
        return
    }
    let questionFull = $(TiMuList[c]).find('.Zy_TItle.clearfix > div').html()
    questionFull = tidyQuestion(questionFull).replace("/<span.*?>.*?</span>/", "");
    let _question = tidyQuestion(questionFull)
    let typeName = questionFull.match(/^【(.*?)】|$/)[1];
    let _TimuType = { 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3, 简答题: 4 }[typeName]
    let _a = []
    let _answerTmpArr

    // 如果题型不在预设类型中，根据DOM结构自动识别题型
    if (_TimuType === undefined) {
        logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');

        // 检查是否有选择题特征
        let choiceList = $(TiMuList[c]).find('.Zy_ulTop li');
        if (choiceList && choiceList.length > 0) {
            // 检查是否为判断题
            if (choiceList.length === 2 &&
                ($(choiceList[0]).text().includes('对') || $(choiceList[0]).text().includes('√')) &&
                ($(choiceList[1]).text().includes('错') || $(choiceList[1]).text().includes('×'))) {
                _TimuType = 3; // 判断题
                logger('自动识别为判断题', 'green');
            }
            // 检查是否为选择题
            else {
                // 默认为单选题，后续可根据页面特征判断是否为多选题
                _TimuType = 0;
                logger('自动识别为单选题', 'green');
            }
        }
        // 检查是否有填空题特征
        else {
            let fillBlankList = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1');
            if (fillBlankList && fillBlankList.length > 0) {
                _TimuType = 2; // 填空题
                logger('自动识别为填空题', 'green');
            } else {
                // 检查是否有富文本编辑器
                let editorList = $(TiMuList[c]).find('.edui-editor');
                if (editorList && editorList.length > 0) {
                    _TimuType = 4; // 简答题
                    logger('检测到富文本编辑器，识别为简答题', 'green');
                } else {
                    // 默认当作简答题处理
                    _TimuType = 4;
                    logger('无法准确判断题型，按简答题处理', 'blue');
                }
            }
        }
    }

    switch (_TimuType) {
        case 0:
            _answerTmpArr = $(TiMuList[c]).find('.Zy_ulTop li').find('a')
            //遍历选项列表
            var mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = "单选题:" + _question + '\n' + mergedAnswers
            $.each(_answerTmpArr, (i, t) => {
                _a.push(tidyStr($(t).html()))
            })
            getAnswer(_TimuType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    //修改题目将答案插入
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + agrs)
                }
                let _i = _a.findIndex((item) => item == agrs)
                if (_i == -1) {
                    logger('AI无法完美匹配正确答案,请手动选择，跳过', 'red')
                    localStorage.setItem('GPTJsSetting.sub', false)
                } else {
                    $(_answerTmpArr[_i]).parent().click();
                }
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            }).catch((agrs) => {
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            })
            break
        case 1:
            _answerTmpArr = $(TiMuList[c]).find('.Zy_ulTop li').find('a')
            //遍历选项列表
            var mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = "多选题,用\"#\"分割多个答案:" + _question + '\n' + mergedAnswers
            getAnswer(_TimuType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    //修改题目将答案插入
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + agrs)
                }
                $.each(_answerTmpArr, (i, t) => {
                    if (agrs.indexOf(tidyStr($(t).html())) != -1) {
                        $(_answerTmpArr[i]).parent().click();
                        _a.push(['A', 'B', 'C', 'D', 'E', 'F', 'G'][i])
                    }
                })
                let id = getStr($(TiMuList[c]).find('.Zy_ulTop li:nth-child(1)').attr('onclick'), 'addcheck(', ');').replace('(', '').replace(')', '')
                if (_a.length <= 0) {
                    logger('AI无法完美匹配正确答案,请手动选择，跳过', 'red')
                    // setting.sub = 0
                    localStorage.setItem('GPTJsSetting.sub', false)
                } else {
                    $(TiMuList[c]).find('.Zy_ulTop').parent().find('#answer' + id).val(_a.join(""))
                }
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            }).catch((agrs) => {
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            })
            break
        case 2:
            let _textareaList = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1')
            getAnswer(_TimuType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    //修改题目将答案插入
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + agrs)
                }
                let _answerList = agrs.split("#")
                $.each(_textareaList, (i, t) => {
                    setTimeout(() => {
                        $(t).find('#ueditor_' + i).contents().find('.view p').html(_answerList[i]);
                        $(t).find('textarea').html('<p>' + _answerList[i] + '</p>')
                    }, 300)
                })
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            }).catch((agrs) => {
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            })
            break
        case 3:
            _answerTmpArr = $(TiMuList[c]).find(".Zy_ulTop li").find("a");
            let _true = "正确|是|对|√|T|ri";
            $.each(_answerTmpArr, (i, t) => {
                _a.push(tidyStr($(t).html()));
            });
            _question = "判断题，只回答正确或错误:" + _question
            getAnswer(_TimuType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    //修改题目将答案插入
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + agrs)
                }
                agrs = _true.indexOf(agrs) != -1 ? "对" : "错";
                let _i = _a.findIndex((item) => item == agrs);
                if (_i == -1) {
                    logger("未匹配到正确答案，跳过", "red");
                    localStorage.setItem('GPTJsSetting.sub', false)
                } else {
                    $(_answerTmpArr[_i]).parent().click();
                }
                setTimeout(() => {
                    startDoWork(index, doms, c + 1, TiMuList);
                }, setting.time);
            }).catch((agrs) => {
                setTimeout(() => {
                    startDoWork(index, doms, c + 1, TiMuList);
                }, setting.time);
            });
            break;
        case 4:
            let _textareaLista = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1')
            getAnswer(_TimuType, _question).then((agrs) => {
                if (agrs == '暂无答案') {
                    // setting.sub = 0
                    localStorage.setItem('GPTJsSetting.sub', false)
                }
                let _answerList = agrs.split("#")
                $.each(_textareaLista, (i, t) => {
                    setTimeout(() => {
                        $(t).find('#ueditor_' + i).contents().find('.view p').html(_answerList[i]);
                        $(t).find('textarea').html('<p>' + _answerList[i] + '</p>')
                    }, 300)
                })
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            }).catch((agrs) => {
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            })
            break
    }
}

function uploadAnswer(a) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: _host + '/api/v1/save?v=' + GM_info['script']['version'],
            data: 'data=' + encodeURIComponent(JSON.stringify(a)),
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function (xhr) {
                try {
                    let res = $.parseJSON(xhr.responseText)
                    if (res['code'] == 200) {
                        logger('答案收录成功！！此次收录' + res['data']['total'] + '道题目，准备处理下一个任务。', 'green')
                    } else {
                        logger('答案收录失败了，请向作者反馈，准备处理下一个任务。', 'red')
                    }
                    resolve()
                } catch {
                    let res = xhr.responseText
                    if (res.indexOf('防火墙') != -1) {
                        logger('答案收录失败了，已被防火墙拦截，请联系作者手动收录。', 'red')
                    } else {
                        logger('答案收录失败了，未知错误，请向作者反馈。', 'red')
                    }
                    resolve()
                }
            }
        })
    })

}

function switchMission() {
    _mlist.splice(0, 1)
    _domList.splice(0, 1)
    setTimeout(missonStart, 5000)
}

function tidyStr(s) {
    if (s) {
        let str = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').trim().replace(/&nbsp;/g, '').replace(new RegExp("&nbsp;", ("gm")), '').replace(/^\s+/, '').replace(/\s+$/, '');
        return str
    } else {
        return null
    }
}

function tidyQuestion(s) {
    if (s) {
        let str = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/^\d+[\.、]/, '').trim().replace(/&nbsp;/g, '').replace('javascript:void(0);', '').replace(new RegExp("&nbsp;", ("gm")), '').replace(/^\s+/, '').replace(/\s+$/, '');
        return str
    } else {
        return null
    }
}


function decryptFont() {
    /**
    * Author   wyn665817
    * From     https://greasyfork.org/zh-CN/scripts/445007
    */
    var $tip = $('style:contains(font-cxsecret)');
    if (!$tip.length) return;
    var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
    font = Typr.parse(base64ToUint8Array(font))[0];
    var table = JSON.parse(GM_getResourceText('Table'));
    var match = {};
    for (var i = 19968; i < 40870; i++) {
        $tip = Typr.U.codeToGlyph(font, i);
        if (!$tip) continue;
        $tip = Typr.U.glyphToPath(font, $tip);
        $tip = md5(JSON.stringify($tip)).slice(24);
        match[i] = table[$tip];
    }
    $('.font-cxsecret').html(function (index, html) {
        $.each(match, function (key, value) {
            key = String.fromCharCode(key);
            key = new RegExp(key, 'g');
            value = String.fromCharCode(value);
            html = html.replace(key, value);
        });
        return html;
    }).removeClass('font-cxsecret');
}

function base64ToUint8Array(base64) {
    var data = window.atob(base64);
    var buffer = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
        buffer[i] = data.charCodeAt(i);
    }
    return buffer;
}