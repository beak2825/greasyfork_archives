// ==UserScript==
// @name         QuicklyReply-PTer (Touch Screen Ver.)
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  faster!
// @author       PTerClub-Helpers
// @connect      greasyfork.org
// @match        http*://pterclub.com/details.php*
// @match        https://pterclub.com/torrents.php?*
// @icon         https://pterclub.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @link         https://greasyfork.org/zh-CN/scripts/523607-quicklyreply-pter-touch-screen-ver
// @downloadURL https://update.greasyfork.org/scripts/523607/QuicklyReply-PTer%20%28Touch%20Screen%20Ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523607/QuicklyReply-PTer%20%28Touch%20Screen%20Ver%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.location.href.includes("/details.php")) {

        var checks = document.getElementsByClassName('commentcheckbox');
        var checkValues = '';
        var areaComment = document.querySelectorAll('textarea[name="body"]')[0];
        function addComment() {
            checkValues = ''
            for (var i = 0; i < checks.length; i++) {
                if (checks[i].checked) {
                    console.log(checks[i].value);
                    checkValues += checks[i].value;
                    checkValues += '\n';
                }
            }
            if (areaComment.childNodes[0] != undefined){
                areaComment.childNodes[0].remove();
            }
            areaComment.value = checkValues;
            window.scrollTo(0, document.documentElement.scrollHeight);
        }

        function comment() {
            var button = document.querySelector('input#qr');
            button.click();
        }

        function checkboxReset() {
            for (var i = 0; i < checks.length; i++) {
                var check = checks[i];
                // 需要保留选中的值
                var keepValues = [
                    "[b]你好，请参考站内类似资源，修正以下问题：[/b]",
                    "[b]请尽快按照提示/要求完成修改，[color=red]修改完成请及时举报自己的种子[/color]，说明已修改完成。[/b]"
                ];

                // 只有当值 **不在** keepValues 列表中时，才取消勾选
                if (check.checked && !keepValues.some(value => check.value.includes(value))) {
                    check.checked = false;
                }
            }

            if (areaComment.childNodes[0] !== undefined) {
                areaComment.childNodes[0].remove();
            }
            areaComment.value = '';
        }


        // 添加防抖的状态保存（在原有hideAndSeek函数中修改）
        let saveTimer;
        function hideAndSeek() {
            const s = document.querySelector('#ReplyBox');
            s.style.display = s.style.display === 'none' ? 'block' : 'none';

            // 防抖保存（300ms内只保存一次）
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => {
                GM_setValue('replyBoxState', s.style.display);
            }, 300);
        }

        function needModification() {
            var r = document.getElementById('radio_need_edit');
            r.checked = true;
            r.parentElement.firstChild.click();
        }

        function torrentChecked() {
            var r = document.getElementById('radio_checked');
            r.checked = true;
            r.parentElement.firstChild.click();
        }

        //$('label').remove('aside-menu')
        //$('#faq-btn').remove()
        var x = document.createElement('div');
        x.style = "position: fixed; right: 0; bottom: 0; opacity: 1; z-index: 90";

        var b = document.createElement('div');

        //版本检查
        if (typeof GM_getValue === 'function') {
            // 从 `@downloadURL` 或 `@updateURL` 中提取脚本 ID
            const scriptUrl = GM_info.scriptMetaStr.match(/@downloadURL\s+(.*)/)[1];
            const scriptIdMatch = scriptUrl.match(/\/scripts\/(\d+)/);
            const scriptId = scriptIdMatch ? scriptIdMatch[1] : null;

            if (scriptId) {
                console.log(`自动获取的脚本 ID: ${scriptId}`);

                // 示例：使用脚本 ID 进行版本检查
                const currentVersion = GM_info.script.version;

                // 获取当前时间戳（单位：毫秒）
                const now = Date.now();

                // 获取上次检查的时间戳（默认值为 0）
                const lastCheckTime = GM_getValue('lastCheckTime', 0);

                // 检查是否超过10分钟（600000 毫秒）
                if (now - lastCheckTime > 600000) {
                    console.log('超过十分钟未检查版本，开始检查...');

                    // 调用 Greasy Fork API 获取脚本信息
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://greasyfork.org/scripts/${scriptId}.json`,
                        onload: function (response) {
                            if (response.status === 200) {
                                const scriptData = JSON.parse(response.responseText);

                                // 获取最新版本号
                                const latestVersion = scriptData.version;
                                console.log(`当前版本: ${currentVersion}`);
                                console.log(`最新版本: ${latestVersion}`);

                                // 比较版本号
                                if (currentVersion !== latestVersion) {
                                    b.insertAdjacentHTML("afterbegin", "<br><b>检测到新版本，请更新。</b><br>");
                                } else {
                                    console.log('脚本已是最新版本。');
                                }

                                // 更新检查时间戳
                                GM_setValue('lastCheckTime', now);
                            } else {
                                console.error('无法获取脚本信息。');
                            }
                        },
                        onerror: function () {
                            console.error('请求 Greasy Fork API 失败。');
                        },
                    });
                } else {
                    console.log(`未超过十分钟，无需检查版本。（${Math.floor((600000 - (now - lastCheckTime)) / 60000)} 分钟后再检查）`);
                }
            } else {
                console.error('无法自动获取脚本 ID，请检查脚本的 @downloadURL 或 @updateURL 是否正确。');
            }
        }


        b.innerHTML += '<input type="button" id="acb6" value="留言"/>';
        b.innerHTML += '<br>---------------------------------------------------------<br>';
        b.innerHTML += '<input type="button" id="acb1" value="添加评论"/>';
        b.innerHTML += '<input type="button" id="acb2" value="重置选项并清除评论"/>';
        b.innerHTML += '<input type="button" id="acb3" value="展开/收起"/>';
        b.innerHTML += '<br>---------------------------------------------------------';

        var a = document.createElement('div');
        a.id = 'ReplyBox';
        a.style.maxHeight = '500px';
        a.style.maxWidth = '300px';
        a.style.overflow = 'auto';

        // 同步状态加载（立即应用存储状态）
        a.style.display = GM_getValue('replyBoxState', 'block'); // ✅ 立即应用存储状态

        // 异步视觉优化（延迟透明渐变动画）
        requestAnimationFrame(() => {
            a.style.opacity = '1';
            a.style.transition = 'opacity 0.3s ease'; // 添加过渡动画
        });


        a.innerHTML += '<input type="button" id="acb4" value="未通过"/>';
        a.innerHTML += '<input type="button" id="acb5" value="通过"/>';

        a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" checked="checked" value="[b]你好，请参考站内类似资源，修正以下问题：[/b]"/><a class="commentcheckbox" href=javascript:void(0)>需要修正</a>';
        a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[b]以下问题本次已帮忙修正，后续请多留意，谢谢：[/b]"/><a class="commentcheckbox" href=javascript:void(0)>已代修改</a><br>';
        var table = document.querySelectorAll(' td#outer > table ')[0];
        var category;
        for (var i = 0; i < table.rows.length; i++) {
            if (table.rows[i].cells[0].textContent == '基本信息' && table.rows[i].cells[1].textContent.match(/质量/)) {
                category = table.rows[i].cells[1].textContent.match(/类型.*/)[0].trim();
                break;
            }
        }
        if (category.match(/电影|电视剧|动画|综艺|演出|纪录片|体育/)) {
            a.innerHTML += '-----------标题-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" id="title_rules_break" style="cursor: pointer;" value="[*] 标题不符合 PTerClub 资源命名规范。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>0day 标题</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 主标题片名需要修正"/><a class="commentcheckbox" href=javascript:void(0)>修正片名</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 主标题分辨率需要修正"/><a class="commentcheckbox" href=javascript:void(0)>修正分辨率</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 主标题音频编码需要修正"/><a class="commentcheckbox" href=javascript:void(0)>修正音轨</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题里的“.”需要用空格替代（5.1、7.1 等中的点除外）。"/><a class="commentcheckbox" href=javascript:void(0)>标题删点</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题不能有中文，需要删除。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>标题删中文</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题里的括号“()”需要用空格替代。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>标题删括号</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请按照 IMDb 或海报片名将标题里[b][color=red]片名[/color][/b]原有的英文标点符号补回。"/><a class="commentcheckbox" href=javascript:void(0)>片名补点</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题 5.1、7.1 等中的“.”需要补回。"/><a class="commentcheckbox" href=javascript:void(0)>通道补点</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请查看 Info，正确填写标题的视频编码。对于 Blu-ray Discs 及其 REMUX，填写 AVC 或 HEVC；对于 WEB-DL 和 HDTV，如有 x264 或 x265 字样，填写 x264 或 x265，否则填写 H.264 或 H.265；对于 Encode，填写 x264 或 x265。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#.E8.A7.86.E9.A2.91.2F.E9.9F.B3.E9.A2.91_.E7.BC.96.E7.A0.81]上传规则 - 视频/音频 编码[/url]"/><a class="commentcheckbox" href=javascript:void(0)>视频编码写法不正确</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题 TrueHD 7.1 -> TrueHD 7.1 Atmos"/><a class="commentcheckbox" href=javascript:void(0)>标题 TrueHD 7.1 -> TrueHD 7.1 Atmos</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 未完结剧集请在主标题季数 Sxx 后添加集数 Exx"/><a class="commentcheckbox" href=javascript:void(0)>未完结剧集</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 完结剧集请删除主标题中的集数"/><a class="commentcheckbox" href=javascript:void(0)>完结剧集</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 副标题需要用中文写上名称和简单介绍。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>中文副标题</a><br>';
            a.innerHTML += '-----------标签-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 国语资源，需要勾选“国语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>勾选国语</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 没有国语音轨，不要勾选“国语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选国语</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 粤语资源，需要勾选“粤语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>勾选粤语</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 没有粤语音轨，不要勾选“粤语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选粤语</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 资源含有中文字幕，需要勾选“中字”标签。"/><a class="commentcheckbox" href=javascript:void(0)>勾选中字</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 资料没显示有中文字幕，不要勾选“中字”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选中字</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 发种人上传了外挂中文字幕后，[b][color=red]需要[/color][/b]勾选“中字”标签。"/><a class="commentcheckbox" href=javascript:void(0)>外挂中字</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 截图无法确认是否有中字，请更换带中字字幕的截图。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url]"/><a class="commentcheckbox" href=javascript:void(0)>更换中字截图</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 资料没显示有英文字幕，不要勾选“英字”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选英字</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请更换带中字的截图，并勾选“中字”标签。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url]"/><a class="commentcheckbox" href=javascript:void(0)>截图和中字</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] DIY 原盘（Custom Disc），需要勾选“DIY”标签。"/><a class="commentcheckbox" href=javascript:void(0)>勾选 DIY</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] DIY 标签仅限 DIY 原盘（Custom Disc）使用，不要勾选“DIY 原盘”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选 DIY</a><br>';
            a.innerHTML += '-----------基本信息-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 所有动画资源（包括动画电影和电视剧等），类型需要选择 Animation。"/><a class="commentcheckbox" href=javascript:void(0)>动画</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是电影，类型需要选择 Movie。"/><a class="commentcheckbox" href=javascript:void(0)>电影</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是电视剧，类型需要选择 TV Series。"/><a class="commentcheckbox" href=javascript:void(0)>电视剧</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是综艺，类型需要选择 TV Show。"/><a class="commentcheckbox" href=javascript:void(0)>综艺</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是纪录片，类型需要选择 Documentary。"/><a class="commentcheckbox" href=javascript:void(0)>纪录片</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 只有单独一首的音乐短片才选择 MV，演唱会或话剧等需要选择 Stage Performance。"/><a class="commentcheckbox" href=javascript:void(0)>舞台演出</a><br>';
            a.innerHTML += '<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 Remux 资源，质量需要选择 Remux。"/><a class="commentcheckbox" href=javascript:void(0)>Remux</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是压制资源，质量需要选择 Encode。"/><a class="commentcheckbox" href=javascript:void(0)>压制</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是网络资源，质量需要选择 WEB-DL。"/><a class="commentcheckbox" href=javascript:void(0)>WEB-DL</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 TV 录制资源，质量需要选择 HDTV。"/><a class="commentcheckbox" href=javascript:void(0)>HDTV</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 1080p 原盘资源，质量需要选择 BD Discs。"/><a class="commentcheckbox" href=javascript:void(0)>蓝光原盘</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 2160p 原盘资源，质量需要选择 UHD Discs。"/><a class="commentcheckbox" href=javascript:void(0)>4K 蓝光原盘</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 DVD 资源，质量需要选择 DVD Discs。"/><a class="commentcheckbox" href=javascript:void(0)>DVD 原盘</a><br>';
            a.innerHTML += '<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择欧美（Western）。"/><a class="commentcheckbox" href=javascript:void(0)>欧美</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择大陆（Mainland, CHN）。"/><a class="commentcheckbox" href=javascript:void(0)>大陆</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择香港（HKG, CHN）。"/><a class="commentcheckbox" href=javascript:void(0)>香港</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择台湾（TWN, CHN）。"/><a class="commentcheckbox" href=javascript:void(0)>台湾</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择韩国（KOR）。"/><a class="commentcheckbox" href=javascript:void(0)>韩国</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择日本（JPN）。"/><a class="commentcheckbox" href=javascript:void(0)>日本</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择印度（IND）。"/><a class="commentcheckbox" href=javascript:void(0)>印度</a><br>';
            a.innerHTML += '-----------链接-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 需要补上 IMDb 链接，链接需要填写在编辑页上面的栏目里。\n　　请前往 https://movie.douban.com/ 或 https://www.imdb.com/ 查找对应的链接"/><a class="commentcheckbox" href=javascript:void(0)>IMDb 链接</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 需要补上豆瓣链接，链接需要填写在编辑页上面的栏目里。\n　　请前往 https://movie.douban.com/ 查找对应的链接"/><a class="commentcheckbox" href=javascript:void(0)>豆瓣链接</a><br>';
            a.innerHTML += '-----------作者制作说明-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 作者制作说明需要用 quote 引用代码括着。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>作者制作说明</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 删除免责声明。"/><a class="commentcheckbox" href=javascript:void(0)>删除免责声明</a><br>';
            a.innerHTML += '-----------内容-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 海报缺失或显示错误，需要补图。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补海报</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请使用 PTgen 或其他工具生成规范的种子介绍，具体请参考以下教程：[url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=5197]种子简介生成工具汇总[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补简介</a><br>';
            a.innerHTML += '-----------Info-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 按来源质量，需要补上 BDInfo 或 MediaInfo，并使用 hide=BDInfo 或 hide=MediaInfo 引用。\n　　Info 获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4178]关于视频参数（Info）的获取[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补 MediaInfo/BDInfo</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 基于 DVD 原盘结构，需要 IFO 和 VOB 文件的 MediaInfo，才能展现出一个 DVD 原盘的质量和概况。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种#DVD原盘获取mediainfo特别说明]从零开始：如何发种 - DVD 原盘获取 MediaInfo 特别说明[/url]"/><a class="commentcheckbox" href=javascript:void(0)>DVD 的 Info</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 需要补上完整的 MediaInfo，并使用 hide=MediaInfo 引用。\n　　Info 获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4178]关于视频参数（Info）的获取[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补完整的 MediaInfo</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] Info 需要用 BBCode 代码括着。对于 General Infomation，使用 quote 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>quote</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] Info 需要用 BBCode 代码括着。对于 MediaInfo，使用 hide=MediaInfo 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>hide=MediaInfo</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] Info 需要用 BBCode 代码括着。对于 BDInfo，使用 hide=BDInfo 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>hide=BDInfo</a><br>';
            a.innerHTML += '-----------截图-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请删除无法显示的图片。"/><a class="commentcheckbox" href=javascript:void(0)>无法显示的图</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 截图显示错误，需要补图；如无法补图，请删除无法显示的图片。\n　　截图方法，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4310]关于视频截图的简要教程[/url]\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补截图</a><br>';
            a.innerHTML += '-----------修正-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 种子简介请按照“海报 - 资源简介 - Info 信息 - 截图”的顺序进行。"/><a class="commentcheckbox" href=javascript:void(0)>内容顺序</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 检查 BBCode，修正错误的代码，删除多余的代码。\n　　[url=https://pterclub.com/tags.php]点击此处进入 BBCode 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>修正 BBCode</a><br>';
            a.innerHTML += '-----------其他-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请参考发种流程进行学习并修改。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种]从零开始：如何发种[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=22&topicid=3642]How to fill out the Upload Page[/url]"/><a class="commentcheckbox" href=javascript:void(0)>发种不规范</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] "/><a class="commentcheckbox" href=javascript:void(0)>其他</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 种子将大体按发布顺序审核，请勿催审。如果不确定种子是否符合规范，请不要发布后举报种子，可发到候选由 Helper 手动通过候选。[url=https://wiki.pterclub.com/wiki/用户分享率及等级说明]用户分享率及等级说明[/url]"/><a class="commentcheckbox" href=javascript:void(0)>催审要求</a><br>';
            a.innerHTML += `<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" checked="checked" value="[b]请尽快按照提示/要求完成修改，[color=red]修改完成请及时举报自己的种子[/color]，说明已修改完成。[/b]
（若有疑问欢迎引用该评论联系 Helper，请勿无视修改意见，否则会被删种，多次无视可能会被警告或者禁止上传权限）
（欢迎使用本站的 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=13370]种子审核脚本[/url] 自查修正，有助于提高审核通过率，强烈推荐）
"/><a class="commentcheckbox" href=javascript:void(0)>需要修正</a>`;
        } else if (category.match(/音乐短片/)) {
            a.innerHTML += '-----------标题-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题不符合 PTerClub 资源命名规范。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>0day 标题</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题歌名部分需按“歌手名 - 歌曲名”格式填写，注意“-”两侧各有 1 个空格。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>标题缺少空格</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 主标题歌名需要修正"/><a class="commentcheckbox" href=javascript:void(0)>修正片名</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 主标题分辨率需要修正"/><a class="commentcheckbox" href=javascript:void(0)>修正分辨率</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 主标题音频编码需要修正"/><a class="commentcheckbox" href=javascript:void(0)>修正音轨</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题里的“.”需要用空格替代（5.1、7.1 等中的点除外）。"/><a class="commentcheckbox" href=javascript:void(0)>标题删点</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题不能有中文，需要删除。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>标题删中文</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题里的括号“()”需要用空格替代。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>标题删括号</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请参照海报将标题里[b][color=red]歌名[/color][/b]原有的英文标点符号补回。"/><a class="commentcheckbox" href=javascript:void(0)>片名补点</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题 5.1、7.1 等中的“.”需要补回。"/><a class="commentcheckbox" href=javascript:void(0)>通道补点</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请正确填写标题的视频编码。对于 MV，填写 AVC 或 HEVC。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#.E8.A7.86.E9.A2.91.2F.E9.9F.B3.E9.A2.91_.E7.BC.96.E7.A0.81]上传规则 - 视频/音频 编码[/url]"/><a class="commentcheckbox" href=javascript:void(0)>视频编码写法不正确</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 副标题需要用中文写上名称和简单介绍。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>中文副标题</a><br>';
            a.innerHTML += '-----------标签-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 国语资源，需要勾选“国语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>勾选国语</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 没有国语音轨，不要勾选“国语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选国语</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 粤语资源，需要勾选“粤语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>勾选粤语</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 没有粤语音轨，不要勾选“粤语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选粤语</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 资源含有中文字幕，需要勾选“中字”标签。"/><a class="commentcheckbox" href=javascript:void(0)>勾选中字</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 资料没显示有中文字幕，不要勾选“中字”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选中字</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 资料没显示有英文字幕，不要勾选“英字”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选英字</a><br>';
            a.innerHTML += '-----------基本信息-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 Remux 资源，质量需要选择 Remux。"/><a class="commentcheckbox" href=javascript:void(0)>Remux</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是压制资源，质量需要选择 Encode。"/><a class="commentcheckbox" href=javascript:void(0)>压制</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是网络资源，质量需要选择 WEB-DL。"/><a class="commentcheckbox" href=javascript:void(0)>WEB-DL</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 TV 录制资源，质量需要选择 HDTV。"/><a class="commentcheckbox" href=javascript:void(0)>HDTV</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 1080p 原盘资源，质量需要选择 BD Discs。"/><a class="commentcheckbox" href=javascript:void(0)>蓝光原盘</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 2160p 原盘资源，质量需要选择 UHD Discs。"/><a class="commentcheckbox" href=javascript:void(0)>4K 蓝光原盘</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 这是 DVD 资源，质量需要选择 DVD Discs。"/><a class="commentcheckbox" href=javascript:void(0)>DVD 原盘</a><br>';
            a.innerHTML += '<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择欧美（Western）。"/><a class="commentcheckbox" href=javascript:void(0)>欧美</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择大陆（Mainland, CHN）。"/><a class="commentcheckbox" href=javascript:void(0)>大陆</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择香港（HKG, CHN）。"/><a class="commentcheckbox" href=javascript:void(0)>香港</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择台湾（TWN, CHN）。"/><a class="commentcheckbox" href=javascript:void(0)>台湾</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择韩国（KOR）。"/><a class="commentcheckbox" href=javascript:void(0)>韩国</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择日本（JPN）。"/><a class="commentcheckbox" href=javascript:void(0)>日本</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择印度（IND）。"/><a class="commentcheckbox" href=javascript:void(0)>印度</a><br>';
            a.innerHTML += '-----------内容-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 海报缺失或显示错误，需要补图。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补海报</a><br>';
            a.innerHTML += '-----------Info-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 按来源质量，需要补上 BDInfo 或 MediaInfo，并使用 hide=BDInfo 或 hide=MediaInfo 引用。\n　　Info 获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4178]关于视频参数（Info）的获取[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补 MediaInfo/BDInfo</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 基于 DVD 原盘结构，需要 IFO 和 VOB 文件的 MediaInfo，才能展现出一个 DVD 原盘的质量和概况。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种#DVD原盘获取mediainfo特别说明]从零开始：如何发种 - DVD 原盘获取 MediaInfo 特别说明[/url]"/><a class="commentcheckbox" href=javascript:void(0)>DVD 的 Info</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 需要补上完整的 MediaInfo，并使用 hide=MediaInfo 引用。\n　　Info 获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4178]关于视频参数（Info）的获取[/url] "/><a class="commentcheckbox" href=javascript:void(0)>补完整的 MediaInfo</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] Info 需要用 BBCode 代码括着。对于 General Infomation，使用 quote 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>quote</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] Info 需要用 BBCode 代码括着。对于 MediaInfo，使用 hide=MediaInfo 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url]\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>hide=MediaInfo</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] Info 需要用 BBCode 代码括着。对于 BDInfo，使用 hide=BDInfo 代码。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&topicid=4178&page=p32903#pid32903]点击此处进入 quote 代码相关介绍[/url])\n　　[url=https://pterclub.com/tags.php#quote_one]点击此处进入专属 hide 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>hide=BDInfo</a><br>';
            a.innerHTML += '-----------截图-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请删除无法显示的图片。"/><a class="commentcheckbox" href=javascript:void(0)>无法显示的图</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 截图显示错误，需要补图；如无法补图，请删除无法显示的图片。\n　　截图方法，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=4310]关于视频截图的简要教程[/url]\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补截图</a><br>';
            a.innerHTML += '-----------修正-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 种子简介请按照“海报 - 资源简介 - Info 信息 - 截图”的顺序进行。"/><a class="commentcheckbox" href=javascript:void(0)>内容顺序</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 检查 BBCode，修正错误的代码，删除多余的代码。\n　　[url=https://pterclub.com/tags.php]点击此处进入 BBCode 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>修正 BBCode</a><br>';
            a.innerHTML += '-----------其他-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请参考发种流程进行学习并修改。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种]从零开始：如何发种[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=22&topicid=3642]How to fill out the Upload Page[/url]"/><a class="commentcheckbox" href=javascript:void(0)>发种不规范</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] "/><a class="commentcheckbox" href=javascript:void(0)>其他</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 种子将大体按发布顺序审核，请勿催审。如果不确定种子是否符合规范，请不要发布后举报种子，可发到候选由 Helper 手动通过候选。\n　　[url=https://wiki.pterclub.com/wiki/用户分享率及等级说明]用户分享率及等级说明[/url]"/><a class="commentcheckbox" href=javascript:void(0)>催审要求</a><br>';
            a.innerHTML += `<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" checked="checked" value="[b]请尽快按照提示/要求完成修改，[color=red]修改完成请及时举报自己的种子[/color]，说明已修改完成。[/b]
（若有疑问欢迎引用该评论联系 Helper，请勿无视修改意见，否则会被删种，多次无视可能会被警告或者禁止上传权限）
"/><a class="commentcheckbox" href=javascript:void(0)>需要修正</a>`;
        } else if (category.match(/Music/)) {
            a.innerHTML += '-----------标题-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题不符合 PTerClub 资源命名规范。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>0day 标题</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 主副标题需要使用“-”分隔信息，具体为“歌手 - 歌曲名”和“年份 - 格式”，注意“-”两边各需要 1 个空格。\n　　[url=https://wiki.pterclub.com/wiki/上传规则（含标题命名及内容编辑指南）#对帖子标题的要求]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>标题缺少空格</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 主标题采样位深需要修正"/><a class="commentcheckbox" href=javascript:void(0)>修正采样位深</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 主标题采样频率需要修正"/><a class="commentcheckbox" href=javascript:void(0)>修正采样频率</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题里的“.”需要用空格替代（44.1kHz 等中的点除外）。"/><a class="commentcheckbox" href=javascript:void(0)>标题删点</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题里的括号“()”需要用空格替代。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>标题删括号</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请参照海报将标题里[b][color=red]歌名[/color][/b]原有的英文标点符号补回。"/><a class="commentcheckbox" href=javascript:void(0)>歌名补点</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 标题 5.1、7.1 等中的“.”需要补回。"/><a class="commentcheckbox" href=javascript:void(0)>通道补点</a><br>';
            //下一条需要讨论修订
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 副标题需要用中文写上名称和简单介绍。\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=1&topicid=53]点击此处进入 PTerClub 资源命名规范[/url]"/><a class="commentcheckbox" href=javascript:void(0)>中文副标题</a><br>';
            a.innerHTML += '-----------标签-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 国语资源，需要勾选“国语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>勾选国语</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 非国语资源，不要勾选“国语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选国语</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 粤语资源，需要勾选“粤语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>勾选粤语</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 非粤语资源，不要勾选“粤语”标签。"/><a class="commentcheckbox" href=javascript:void(0)>不勾选粤语</a><br>';
            a.innerHTML += '-----------基本信息-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 音乐文件格式为 FLAC，质量需要选择 FLAC。"/><a class="commentcheckbox" href=javascript:void(0)>FLAC</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 音乐文件格式为 WAV，质量需要选择 WAV。"/><a class="commentcheckbox" href=javascript:void(0)>WAV</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 音乐文件格式为 ISO，质量需要选择 ISO。"/><a class="commentcheckbox" href=javascript:void(0)>ISO</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 音乐文件格式非 FLAC、WAV、ISO，质量需要选择 Other。"/><a class="commentcheckbox" href=javascript:void(0)>Other</a><br>';
            a.innerHTML += '<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择欧美（Western）。"/><a class="commentcheckbox" href=javascript:void(0)>欧美</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择大陆（Mainland, CHN）。"/><a class="commentcheckbox" href=javascript:void(0)>大陆</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择香港（HKG, CHN）。"/><a class="commentcheckbox" href=javascript:void(0)>香港</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择台湾（TWN, CHN）。"/><a class="commentcheckbox" href=javascript:void(0)>台湾</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择韩国（KOR）。"/><a class="commentcheckbox" href=javascript:void(0)>韩国</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择日本（JPN）。"/><a class="commentcheckbox" href=javascript:void(0)>日本</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 地区需要选择印度（IND）。"/><a class="commentcheckbox" href=javascript:void(0)>印度</a><br>';
            a.innerHTML += '-----------链接-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 删除 IMDb 链接（需要将简介中的链接一并删除）。"/><a class="commentcheckbox" href=javascript:void(0)>删除 IMDb 链接</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 删除豆瓣链接（需要将简介中的链接一并删除）。"/><a class="commentcheckbox" href=javascript:void(0)>删除豆瓣链接</a><br>';
            a.innerHTML += '-----------内容-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 海报缺失或显示错误，需要补图。\n　　图床使用，请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=2&topicid=2865]手把手教你贴图[/url] 和 [url=https://wiki.pterclub.com/wiki/图床]图床[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补海报</a><br>';
            a.innerHTML += '-----------Info-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 需要补上 Log 或频谱图。\n　　频谱图获取请参考 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=25&topicid=3537]频谱图制作教程[/url] 和 [url=https://pterclub.com/forums.php?action=viewtopic&forumid=25&topicid=3914]最简频谱图制作教程[/url]"/><a class="commentcheckbox" href=javascript:void(0)>补 Log 或频谱图</a><br>';
            a.innerHTML += '-----------截图-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请删除无法显示的图片。"/><a class="commentcheckbox" href=javascript:void(0)>无法显示的图</a><br>';
            a.innerHTML += '-----------修正-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 种子简介请按照“海报 - 资源简介 - Info 信息 - 截图”的顺序进行。"/><a class="commentcheckbox" href=javascript:void(0)>内容顺序</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 检查 BBCode，修正错误的代码，删除多余的代码。\n　　[url=https://pterclub.com/tags.php]点击此处进入 BBCode 代码相关介绍[/url]"/><a class="commentcheckbox" href=javascript:void(0)>修正 BBCode</a><br>';
            a.innerHTML += '-----------其他-----------<br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 请参考发种流程进行学习并修改。\n　　[url=https://wiki.pterclub.com/wiki/从零开始：如何发种]从零开始：如何发种[/url]\n　　[url=https://pterclub.com/forums.php?action=viewtopic&forumid=22&topicid=3642]How to fill out the Upload Page[/url]"/><a class="commentcheckbox" href=javascript:void(0)>发种不规范</a>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] "/><a class="commentcheckbox" href=javascript:void(0)>其他</a><br>';
            a.innerHTML += '<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" value="[*] 种子将大体按发布顺序审核，请勿催审。如果不确定种子是否符合规范，请不要发布后举报种子，可发到候选由 Helper 手动通过候选。\n　　[url=https://wiki.pterclub.com/wiki/用户分享率及等级说明]用户分享率及等级说明[/url]"/><a class="commentcheckbox" href=javascript:void(0)>催审要求</a><br>';
            a.innerHTML += `<input type="checkbox" class="commentcheckbox" style="cursor: pointer;" checked="checked" value="[b]请尽快按照提示/要求完成修改，[color=red]修改完成请及时举报自己的种子[/color]，说明已修改完成。[/b]
（若有疑问欢迎引用该评论联系 Helper，请勿无视修改意见，否则会被删种，多次无视可能会被警告或者禁止上传权限）
"/><a class="commentcheckbox" href=javascript:void(0)>需要修正</a>`;
        }
        x.appendChild(b);
        x.appendChild(a);
        document.body.appendChild(x);

        document.getElementById('acb1').onclick = addComment;
        document.getElementById('acb2').onclick = checkboxReset;
        document.getElementById('acb3').onclick = hideAndSeek;
        document.getElementById('acb4').onclick = needModification;
        document.getElementById('acb5').onclick = torrentChecked;
        document.getElementById('acb6').onclick = comment;
        var ahref = document.querySelectorAll('a.commentcheckbox');
        for (let i = 0; i < ahref.length; i++) {
            ahref[i].onclick = function () {
                this.previousSibling.checked = !this.previousSibling.checked;
            }
        }

        table = document.getElementById('bookmark0').parentNode.parentNode.parentNode;
        for (let i = 0; i < table.rows.length; i++) {
            if (table.rows[i].cells[0].textContent == '猫粮奖励') {
                table.rows[i].remove();
                i--;
            } else if (table.rows[i].cells[0].textContent == '感谢者') {
                table.rows[i].remove();
            }
        }
    }


    // 种子名过滤
    if (window.location.href.includes("/torrents.php")) {

        // 正则表达式匹配集数
        const regex = /(第\s?[0-9]{1,4}(?!季)\s?(集|话|期)|第\s?[0-9]{1,4}-[0-9]{1,4}(?!季)\s?(集|话|期))/;

        // 正则表达式匹配 [Checked by .*]
        const checkedRegex = /\[Checked by .*?\]/;

        // 遍历所有符合条件的链接
        document.querySelectorAll('a[href^="details.php?id="]').forEach(link => {
            const href = link.getAttribute('href');
            if (!/^details\.php\?id=\d+$/.test(href)) return; // 验证链接格式

            const span = link.closest('div')?.parentElement?.querySelectorAll('div')[1]?.querySelector('span');
            if (!span) return;

            let spanText = span.innerHTML.trim(); // 获取 span HTML 内容

            // 如果匹配集数，则变绿
            if (regex.test(spanText)) {
                link.style.color = 'green';
                console.log(`链接变绿: ${spanText}`);
            }

            // 如果匹配 [Checked by .*]，则变深蓝色加粗
            if (checkedRegex.test(spanText)) {
                span.innerHTML = spanText.replace(checkedRegex, match => `<span style="color: darkblue; font-weight: bold;">${match}</span>`);
            }

            // 查找到目标 td 并获取其文本内容（简化为一行）
            const targetTd = link.closest('table')?.closest('td')?.parentElement?.children?.[Array.from(link.closest('table').closest('td').parentElement.children).indexOf(link.closest('table').closest('td')) + 2];
            const targetText = targetTd?.querySelector('span')?.textContent.trim();

            if (targetText) {
                console.log('目标 TD 文本:', targetText); // 打印目标 TD 的文本内容

                // 如果 targetText 不包含 “分”，将对应 td 的底色变成绿色
                if (targetText.includes('分')) {
                    targetTd.style.backgroundColor = 'green'; // 设置底色为绿色
                }
            }
        });

    }
})();
