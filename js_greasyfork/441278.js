// ==UserScript==
// @name         GithubPlusPlus
// @name:zh-CN   GithubPlusPlus - 好用的GitHub助手
// @name:en      GithubPlusPlus
// @version      0.5.2
// @author       HackPig520
// @description  高速下载 Git Release、Raw、Code(ZIP) 等文件
// @description:zh-CN  高速下载 Git Release、Raw、Code(ZIP) 等文件
// @description:en  High-speed download of Git Release, Raw, Code(ZIP) and other files.
// @match        *://github.com/*
// @match        *://hub.fastgit.xyz/*
// @match        *://hub.fastgit.org/*
// @match        *://github.com.cnpmjs.org/*
// @icon         https://github.githubassets.com/images/icons/emoji/octocat.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @resource     gpp_css https://gitee.com/Botme/UserScript/raw/master/index.css
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        window.onurlchange
// @license      WTFPL
// @run-at       document-end
// @namespace    https://greasyfork.org/scripts/441278
// @supportURL   https://gitee.com/botme/UserScript/issues
// @homepageURL  https://gitee.com/Botme/UserScript
// @downloadURL https://update.greasyfork.org/scripts/441278/GithubPlusPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/441278/GithubPlusPlus.meta.js
// ==/UserScript==
(function () {
    var clone = true; //克隆相关
    var depth = true; //自动添加'--depth 1'参数，有助于提高Clone速度
    var hide = true;
    /*--lang--*/
    var lang = {
        set: '设置',
        enableClone: '启用克隆',
        highSpeedClone: '提高克隆速度',
        copyOK: '复制成功',
        question: '常见问题',
        qqGroup: '交流群',
        feedback: '反馈',
        reward: '打赏',
        redReward: '红包',
        thank: '感谢',
    };

    var location = window.location.href; //当前页面地址
    /////////////////////
    var mirror_list = [
        "https://hub.fastgit.xyz",//日本 - 大陆失效 - 请先阅读：https://doc.fastgit.org/zh-cn/tos.html
        "https://hellotools.eu.org/github.com",//CloudFlare - 正常
        "https://gh.xiu.workers.dev/https://github.com",//CloudFlare - 正常
        "https://ghgo.feizhuqwq.workers.dev/https://github.com",//CloudFlare - 正常
    ]
    var mirror_url1 = "https://e.3331868032.workers.dev/github.com"; //CloudFlare - 正常
    var mirror_url2 = "https://e.rete.gq/github.com"; //CloudFlare - 正常
    var mirror_url3 = "https://e.hellotools.eu.org/github.com"; //CloudFlare - 正常
    var mirror_url4 = "https://reteserver.ml/github.com"; //CloudFlare - 正常
    var mirror_url5 = "https://e.mc-serve.cf/github.com"; //CloudFlare - 正常
    /////////////////////
    var download_url1 = "https://download.fastgit.org"; //美国 - 正常
    var download_url2 = "https://gh.ddlc.top/https://github.com"; //美国 - 正常
    var download_url3 = "https://git.yumenaka.net/https://github.com"; //美国 - 正常
    var str1 = ""; //定义空

    if (clone) {
        str1 += "git clone "; //前缀
        if (depth) {
            str1 += "--depth=1 "; //自动添加'--depth 1'参数
        }
    }

    var a = location.split("/"); //以'/'分割
    var b = a[5] === "wiki" ? ".wiki" : ""; //Wiki
    var str2 = "/" + a[3] + "/" + a[4] + b + ".git"; //拼接 Git Clone 链接
    // var clone_utl = str1 + mirror_list[0] +str2;
    var clone_utl1 = str1 + mirror_url1 + str2; //Clone1链接拼接
    var clone_utl2 = str1 + mirror_url2 + str2; //Clone2链接拼接
    var clone_utl3 = str1 + mirror_url3 + str2; //Clone3链接拼接
    var clone_utl4 = str1 + mirror_url4 + str2; //Clone4链接拼接
    var str3 = window.location.pathname;
    var web_url1 = mirror_url1 + str3; //Web1链接拼接
    var web_url2 = mirror_url2 + str3; //Web2链接拼接
    var web_url3 = mirror_url3 + str3; //Web3链接拼接
    var web_url4 = mirror_url4 + str3; //Web4链接拼接
    // 镜像面板代码
    var info = `
        <div class="user-ment">
        <button class="btn btn-primary" type="button" id="mirror-btn">镜像网址</button>
        <div class="collapse multi-collapse" id="collapse">
            <div class="user-card user-card-body">
                <div class="user-alert user-alert-warning" role="alert">clone、depth命令的插入可手动编辑代码关闭</div>
                <div class="user-alert user-alert-danger" role="alert">镜像地址请不要登陆自己的账户，造成损失作者和镜像网站管理员均概不负责</div>
                <div class="user-input-group user-mb-3">
                    <div class="user-input-group-prepend"><span class="user-input-group-text" id="inputGroup-sizing-default">快速克隆1:</span></div>
                    <input id="clone_case_1" type="text" value="${clone_utl1}" data-autoselect="" class="user-form-control" aria-label="将此存储库克隆到 ${clone_utl1}" readonly aria-describedby="inputGroup-sizing-default">
                    <div class="user-input-group-append">
                        <button class="btn btn-outline-secondary" type="button" id="button-copy1" data-container="body" data-toggle="popover" data-placement="bottom" data-content="复制成功">复制</button>
                    </div>
                    <button class="btn btn-outline-secondary" type="button" id="quickView1" href="${web_url1}" class="btn">快速浏览1</button>
                </div>
                <div class="user-input-group user-mb-3">
                    <div class="user-input-group-prepend">
                        <span class="user-input-group-text" id="inputGroup-sizing-default">快速克隆2:</span>
                    </div>
                    <input id="clone_case_2" type="text" value="${clone_utl2}" data-autoselect="" class="user-form-control" aria-label="将此存储库克隆到 ${clone_utl2}" readonly aria-describedby="inputGroup-sizing-default">
                    <div class="user-input-group-append">
                        <button class="btn btn-outline-secondary" type="button" id="button-copy2" data-container="body" data-toggle="popover" data-placement="bottom" data-content="复制成功">复制</button>
                    </div>
                    <button class="btn btn-outline-secondary" type="button" id="quickView2" class="btn">快速浏览2</button>
                </div>
                <div class="user-input-group user-mb-3">
                    <button type="button" id="quickView3" class="btn">快速浏览3</button>
                </div>
                <div class="user-input-group user-mb-3">
                    <button type="button" id="quickView4" class="btn">快速浏览4</button>
                </div>
            </div>
        </div>
    </div>`;

    // 菜单数字图标
    function menu_num(num) {
        return ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][num]
    }
    $(".repository-content").prepend(info);
    $(".Box.Box--condensed").each(function () {
        // 修改源代码下载栏样式
        $(this).find(".d-block.py-1.py-md-2.Box-body.px-2").addClass("d-flex flex-justify-between")
        // 修改文件大小对齐方式
        $(".pl-2.color-text-secondary.flex-shrink-0").css({ "display": "flex", "flex-grow": 1, "justify-content": "flex-end" })
        $(this).find(".d-flex.Box-body").each(function () {
            var href = $(this).children("a").attr("href");
            var url1 = download_url1 + href;
            var url2 = mirror_url3 + href;
            var div1 = `<div class="user_download" style="display: flex;justify-content: flex-end;margin-left:9px"><div><a style="padding:4px;"  class="btn user-btn-link"  href="${url1}" rel="nofollow">快速下载1</a></div><div><a style="padding:4px"   class="btn user-btn-link" href="${url2}" rel="nofollow">快速下载2(推荐)</a></div></div>`
            $(this).append(div1);
        });
    });
    // Fast Download下载按钮
    $(".dropdown-menu .list-style-none li:last").each(function () {
        var url1 = mirror_url3 + "/" + a[3] + "/" + a[4] + "/archive/master.zip";
        var span1 = `<li class="Box-row Box-row--hover-gray p-0"><a class="d-flex flex-items-center text-gray-dark text-bold no-underline p-3" rel="nofollow" href="${url1}">Fast Download ZIP</a></li>`;
        $(this).after(span1);
    });
    // 复制按钮
    $("#button-copy1").on("click", function () {
        GM_setClipboard($("#clone_case_1").val())
        alert(lang.copyOK)
    })
    $("#button-copy2").on("click", function () {
        GM_setClipboard($("#clone_case_2").val())
        alert(lang.copyOK)
    })
    // 页面跳转
    $("#quickView1").on("click", function () {
        window.location.href = web_url1
    });
    $("#quickView2").on("click", function () {
        window.location.href = web_url2
    })
    $("#quickView3").on("click", function () {
        window.location.href = web_url3
    })
    $("#quickView4").on("click", function () {
        window.location.href = web_url4
    })
    // 隐藏面板
    $("#mirror-btn").on("click", function () {
        if (!hide) {
            $("#collapse").hide();
        } else {
            $("#collapse").show();
        }
        hide = !hide;
    })
    function mirrorBtnEvent() {
        if (!GM_getValue('mirror')) {
            $("#collapse").hide()
        } else {
            $("#collapse").show();
        }
    }
    function menuHideMirrorCollapse() {
        GM_setValue('mirror', !GM_getValue('mirror'))
        mirrorBtnEvent()
        console.log(GM_getValue('mirror'))
    }
    function init() {
        mirrorBtnEvent()
    }
    // 注册菜单
    GM_registerMenuCommand(`[🔔Hide & Show Mirror DashBoard]`, menuHideMirrorCollapse)
    GM_registerMenuCommand(`[📢$(lang.feedback)]`, function () { window.GM_openInTab('https://gitee.com/Botme/UserScript/issues', { active: true, insert: true, setParent: true }); })
    // 初始化面板
    init()
    GM_addStyle(GM_getResourceText("gpp_css"));
})();