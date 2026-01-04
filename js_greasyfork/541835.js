// ==UserScript==
// @name          MIX PTerClub Torrent Checker 先行版
// @namespace     http://tampermonkey.net/
// @version       1.0.21 // 保持原始版本号，因为这只是日志添加
// @description   Have fun!
// @author        PTerClub-Helpers
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @connect       greasyfork.org
// @connect       www.imdb.com
// @match         https://pterclub.com/details.php?id=*
// @icon          https://pterclub.com/favicon.ico
// @license       MIT
// @link         https://greasyfork.org/zh-CN/scripts/522651-pterclub-torrent-checker-%E5%85%88%E8%A1%8C%E7%89%88
// @downloadURL https://update.greasyfork.org/scripts/541835/MIX%20PTerClub%20Torrent%20Checker%20%E5%85%88%E8%A1%8C%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/541835/MIX%20PTerClub%20Torrent%20Checker%20%E5%85%88%E8%A1%8C%E7%89%88.meta.js
// ==/UserScript==
/*
处理正则错误
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义所有特殊字符，$&表示正则匹配到的内容
}

// 示例用法
const str = "Hello+World*";
const pattern = "+World*";
const escapedPattern = escapeRegExp(pattern); // 转义为 "\+World\*"
const regex = new RegExp(escapedPattern);
const result = str.match(regex); // 正确匹配 "+World*"

---
### MIX升级日志：PTerClub Torrent Checker
- **脚本元数据更新：** 更改了脚本名称，更新了版本号、下载/更新链接，并增加了连接 IMDb.com 的权限。
- **IMDb信息整合：** 新增了从 IMDb 页面抓取并显示影片发行日期和别名的功能。
- **制作组检测优化：** 改进了制作组的识别逻辑，并能在悬浮窗中显示制作组类型。
- **标题检查改进：** 修复了视频编码检查逻辑，新增了对主标题缺少音频编码的提示，并优化了分辨率缺失提示的样式。
- **文件列表检查：** 调整了多余文件检查逻辑，允许白名单制作组包含特定辅助文件。
- **音轨语言标签提醒：** 大陆、台湾、香港的提醒系统，提示更醒目。
- **界面优化：** 微调了悬浮窗样式，使其显示更美观。

---

1.0.21: 增加多余文件 pad 的判断
1.0.20: 调整标题 WEB-DL 的错误判断方式，删除 REMUX 的推测，增加标题括号的检测、 3D 影片模式的重复识别，添加音乐标题的简单匹配但不判断
1.0.19: 调整简介地区的获取逻辑，修正 gifyu 海报的判断、添加标题扩展名等、DVD REMUX 的判断，完善 audio channels 的判断，更新地区（后续更新不再说明）
1.0.18: 调整留言、国粤语标签的判断逻辑、多余文件后缀展示
1.0.17: 增加 HDCTV Info 的解析，增加 BDInfo 码率为 0 的 errorpush，没有 MediaInfo 也提供其它信息的判断，修正留言判断逻辑
1.0.16: 增加标题匹配、增加首图为 gifyu 图床的判断、增加 NGB Info 的解析，增改地区划分；修正标题中多余点的判断、多余文件的判断、简介片名获取、制作组的获取、部分修正地区识别错误的问题；有 Helper 意见的种子不初审
1.0.15: 修正 粤语 识别错误。
1.0.14: 修正 channel 识别错误。
1.0.13: 尝试解析 CHD 的 Info。修正一些已知的问题。
1.0.10-12: 调整白名单组的判断
1.0.9: 修正音频通道错误的判断
1.0.8: 调整版本号，添加更新检测
1.0.7.0113: 修正 2.05.1 错误未能识别的问题。
1.0.6.0106: 添加新的字幕识别（中上英下等），添加部分白名单组，添加 MiniBD 的判断逻辑，添加了 AV1 的判断逻辑。增加没有 DV 的错误判定提示。修正类型错误判断为电影等的 bug，修正 OPUS 编码判断错误的问题，修正重复种子提示突破天际的问题。
*/
(function () {
    'use strict';
    var error = [];
    //用户排除列表
    //var list = [];
   // 整合后的制作组列表
const groups = {
    white: ['CMCT', 'CMCTV', 'EPiC', 'FRDS', 'CHD', 'WiKi', 'HDH', 'HDHTV', 'HDHWEB', 'LHD', 'OurBits', 'MTeam', 'DBTV', 'HDChina', 'PuTao', 'Dream', 'TLF', 'QHstudIo', 'OPS', 'PbK'],
    official: ['AdBlue', 'AREY', 'BdC', 'BMDru', 'CatEDU', 'c0kE', 'doraemon', 'JKCT', 'KMX', 'Lislander', 'RO', 'Telesto', 'XPcl', 'ZTR', 'PTerWEB'],
    special: ['-FFans@leon', '-DIY@LeagueHD', '-WGXC@HDFans']
};
// ===================================================================
//  AKA和抓取制作组功能函数
// ===================================================================

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRegex(type) {
    return new RegExp(`\\b(?:@|[-])(${groups[type].map(g => escapeRegExp(g)).join('|')})\\b`, 'i');
}

const whiteListGroupRegex = buildRegex('white');
const officialGroupRegex = buildRegex('official');
const specialGroupRegex = new RegExp(`\\b(${groups.special.map(g => escapeRegExp(g)).join('|')})\\b`, 'i');

function detectGroup(titleEl) {
    if (!titleEl) return null;
    let rawTitle = '';
    for (let i = 0; i < titleEl.childNodes.length && !rawTitle; i++) {
        const node = titleEl.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            rawTitle = node.textContent.trim();
        }
    }
    if (!rawTitle) return null;
    const matchedOfficial = rawTitle.match(officialGroupRegex);
    const matchedWhite = rawTitle.match(whiteListGroupRegex);
    const matchedSpecial = rawTitle.match(specialGroupRegex);
    if (matchedOfficial) return { type: 'official', name: matchedOfficial[1] };
    if (matchedWhite) return { type: 'white', name: matchedWhite[1] };
    if (matchedSpecial) return { type: 'white', name: matchedSpecial[1] };
    return null;
}

// ===================================================================
//  从脚本B移植的功能函数 (修正版 - 解决时序问题)
// ===================================================================
function fetchAndDisplayImdbInfo(imdbId, groupInfoHTML) {
    const url = `https://www.imdb.com/title/${imdbId}/releaseinfo/`;
    // 注意：我们不再在这里获取 imdbContainer

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
            // *** 关键修改 ***
            // 我们把获取容器的动作，从函数开头移到了这里
            // 因为当这段代码执行时，悬浮窗和“正在加载”的提示已经确定无疑地显示在页面上了
            const imdbContainer = document.getElementById('imdb-helper-container');
            if (!imdbContainer) {
                console.error('[IMDb助手] 错误: 在填充数据时，无法找到ID为 imdb-helper-container 的容器。');
                return; // 如果找不到容器，直接退出，防止报错
            }

            if (response.status !== 200) {
                imdbContainer.innerHTML = '<hr><strong style="color: #d93025;">[IMDb助手] 错误: 获取IMDb页面失败。</strong>';
                return;
            }
            const docText = response.responseText;
            const match = docText.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
            if (!match || !match[1]) {
                imdbContainer.innerHTML = '<hr><strong style="color: #d93025;">[IMDb助手] 错误: 无法解析页面数据。</strong>';
                return;
            }

            try {
                const data = JSON.parse(match[1]);
                const categories = data.props?.pageProps?.contentData?.categories;
                if (!categories) throw new Error("无法在页面数据中找到 'categories' 结构。");

                let firstReleaseDate = null;
                let akaList = [];

                categories.forEach(category => {
                    if (category.id === 'akas' && category.section?.items) {
                        category.section.items.forEach(item => {
                            akaList.push({ country: item.rowTitle || 'N/A', title: item.listContent?.[0]?.text || 'N/A' });
                        });
                    }
                    if (category.id === 'releases' && !firstReleaseDate && category.section?.items?.[0]) {
                        const item = category.section.items[0];
                        firstReleaseDate = { country: item.rowTitle || 'N/A', date: item.listContent?.[0]?.text || 'N/A' };
                    }
                });

                let combinedHTML = '<hr style="border-top: 1px dashed #aaa; margin: 12px 0;">';
                if (groupInfoHTML) {
                    combinedHTML += groupInfoHTML;
                }

                if (firstReleaseDate) {
                    if (groupInfoHTML) combinedHTML += `<hr style="border: none; border-top: 1px solid #eee; margin: 8px 0;">`;
                    combinedHTML += `
                        <div style="margin-bottom: 8px;">
                            <span style="font-weight: bold;">首个发行日期:</span><br>
                            🌎 ${firstReleaseDate.country}: <strong>${firstReleaseDate.date}</strong>
                        </div>
                    `;
                }

                if (akaList.length > 0) {
                    if (groupInfoHTML || firstReleaseDate) combinedHTML += `<hr style="border: none; border-top: 1px solid #eee; margin: 8px 0;">`;
                    const originalTitleIndex = akaList.findIndex(item => item.country === '(original title)');
                    if (originalTitleIndex > -1) {
                        const [originalTitle] = akaList.splice(originalTitleIndex, 1);
                        akaList.unshift(originalTitle);
                    }
      combinedHTML += `
                <div>
                    <a href="${url}" target="_blank" style="text-decoration: none; color: #333; font-weight: bold;"
                       onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">别名 (AKA): 🔗</a>
                    <ul style="margin: 0 !important; padding: 5px 0 !important; list-style: none !important; background: #FFF; border-radius: 4px;">
                            ${akaList.map(entry => `
                                <li style="padding: 3px 5px 3px 0; margin: 0; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${entry.country}: ${entry.title}">
                                    🌐 ${entry.country}: <strong>${entry.title}</strong>
                                </li>
                            `).join('')}
                        </ul>
                    </div>`;
                }

                if (!groupInfoHTML && !firstReleaseDate && akaList.length === 0) {
                    imdbContainer.innerHTML = '<hr><strong style="color: orange;">[IMDb助手] 未找到任何发行日期或AKA信息。</strong>';
                } else {
                    imdbContainer.innerHTML = combinedHTML;
                }
            } catch (e) {
                console.error('[IMDb助手] 解析数据时出错:', e);
                imdbContainer.innerHTML = '<hr><strong style="color: #d93025;">[IMDb助手] 错误: 解析IMDb页面数据失败。</strong>';
            }
        },
        onerror: function (error) {
            // *** 关键修改 ***
            // 同样地，在处理网络错误时，也要先获取容器
            const imdbContainer = document.getElementById('imdb-helper-container');
            if (!imdbContainer) {
                 console.error('[IMDb助手] 错误: 在显示网络错误时，无法找到ID为 imdb-helper-container 的容器。');
                 return;
            }
            console.error('[IMDb助手] 网络请求错误:', error);
            imdbContainer.innerHTML = '<hr><strong style="color: #d93025;">[IMDb助手] 错误: 网络请求IMDb页面失败。</strong>';
        }
    });
}
// ===================================================================
//  AKA和抓取制作组功能函数结束
// ===================================================================

    //页面提醒元素
    var icons = [' <img src="https://s9.gifyu.com/images/SUUsH.png" title="待修改"> ', ' <img src="https://s9.gifyu.com/images/SUUsx.png" title="还没有审核"> ', ' <img src="https://s9.gifyu.com/images/SUUsK.png" title="已通过审核"> ', ' <img src="https://i.ibb.co/W25pttZ/add.png" title="需要添加"> '];

    var h1 = document.getElementById('top');
    var span_correct;

var a = document.createElement('div');
a.id = 'CheckBox';
a.style = "font-size: 12px; max-height: 1080px; max-width: 300px; opacity: 1; overflow: auto; display: block; position: fixed; left: 14%; top: 22%; z-index: 9999; background-color: white; padding: 10px; border-radius: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #ddd;";
a.innerHTML = '<div style="font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px; font-size: 14px; color: #333;">Torrent Checker</div>';
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

            // 检查是否超过一小时（3600000 毫秒）
            if (now - lastCheckTime > 3600000) {
                console.log('超过一小时未检查版本，开始检查...');

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
                                a.innerHTML += `<span style="color: orange">检测到新版本，请更新。</span><br>`;
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
                console.log(`未超过一小时，无需检查版本。（${Math.floor((3600000 - (now - lastCheckTime)) / 60000)} 分钟后再检查）`);
            }
        } else {
            console.error('无法自动获取脚本 ID，请检查脚本的 @downloadURL 或 @updateURL 是否正确。');
        }
    }
    //Info 初始化
    const TORRENT_INFO = {
        titleinfo: {
            origin: '',
            logo: '',
            name: '',
            season: '',
            chapter1: '-1',
            chapter2: '',
            year: '',
            resolution: '',
            source: '',
            remux: false,
            vcodec: '',
            bitdepth: '',
            fps: '',
            hdr: '',
            dv: false,
            acodec: '',
            channels: '',
            aobject: '',
            group: '',
            freeinfo: '',
            minibd: false,
            format3d: '',
        },
        tableinfo: {
            torrentfilename: '',
            subtitle: '',
            chapter1: '-1',
            chapter2: '',
            size: '',
            category: '',
            zhiliang: '',
            area: '',
            files: 1,
            imdburl: '',
            doubanurl: '',
            tags: '',
            hasChineseExternalsubtitles: '',
            hasEnglishExternalsubtitles: '',
            hasTagMandarin: false,
            hasTagCantonese: false,
            hasTagChineseSubtitles: false,
            hasTagEnglishSubtitles: false,
            hasTagDIY: false,
            imageHostBlacklist:false
        },
        descrinfo: {
            moviename: '',
            imdburl: '',
            doubanurl: '',
            area: '',
            lang: '',
            chapters: '',
            category: '', //已废弃
            categorys: '',
            publishdate: ''
        },
        mediainfo: {
            full: '',
            filesize: '',
            video: {
                format: '',
                bitrates: '',
                hdr: '',
                dv: false,
                fps: '',
                width: '',
                height: '',
                bitdepth: '',
                scantype: '',
                codec: '',
            },
            audios: {},
            audio_lang: 0,
            subtitles: {},
            hasMandarin: false,
            hasCantonese: false,
            hasChineseSubtitles: false,
            hasEnglishSubtitles: false,
            standard: ''
        },
        bdinfo: {
            full: '',
            DIY: false,
            video: {
                format: '',
                bitrates: '1 kbps',
                hdr: '',
                dv: false,
                resolution: '',
            },
            video_dv: '0 kbps',
            audios: {},
            subtitles: []
        },
        results: {
            title: '',
            season: '',
            chapter1: '-1',
            chapter2: '',
            files: 1,
            resolution: '',
            source: '',
            remux: false,
            vcodec: '',
            hdr: '',
            dv: false,
            acodec: '',
            channels: '',
            aobject: '',
            group: '',
            dupe: false,
            subtitle: '',
            category: '',
            zhiliang: '',
            standard: ''
        },
    }

    var match;
    var splitflag;

    //获取：tableinfo（帖子内容的表格）
    //table = document.getElementById('bookmark0').parentNode.parentNode.parentNode;//1.0.3.0602 以前
    var table = document.querySelectorAll(' td#outer > table ')[0];
    for (var i = 0; i < table.rows.length; i++) {
        //console.log(`table.rows[${i}].cells[0] is ${table.rows[i].cells[0].textContent}`);
        if (table.rows[i].cells[0].textContent == '下载') {
            //console.log(table.rows[i].cells[0])
            //获取种子文件名
            var torrentfilename = table.rows[i].cells[1].firstChild.textContent;
            TORRENT_INFO.tableinfo.torrentfilename = torrentfilename.match(/(?<=\[PTer\]\.).*?(?=\.torrent)/)[0];
            //用户排除
//            var elements = table.rows[i].cells[1].querySelectorAll('a');
//             for (let j = 0; j < elements.length; j++) {
//                 if (elements[j].href.match(/userdetails/i)) {
//                     var uploader = elements[j].textContent;
//                     if (list.includes(uploader)) {
//                         console.log('被排除的用户');
//                         return;
//                     } else {
//                         console.log(uploader);
//                     }
//                 }
//             }
        } else if (table.rows[i].cells[0].textContent == '副标题') {
            //获取副标题
            TORRENT_INFO.tableinfo.subtitle = table.rows[i].cells[1].textContent;
            if (TORRENT_INFO.tableinfo.subtitle.match(/((全|共)\s?[0-9]{1,4}\s?(集|话|期)|[0-9]{1,4}\s?(集|话|期)全)/)) {
                TORRENT_INFO.tableinfo.chapter1 = '';
                TORRENT_INFO.tableinfo.chapter2 = TORRENT_INFO.tableinfo.subtitle.match(/((全|共)\s?[0-9]{1,4}\s?(集|话|期)|[0-9]{1,4}\s?(集|话|期)全)/)[0].replace(/(全|共|集|话|期)/g, '').trim();
            } else if (TORRENT_INFO.tableinfo.subtitle.match(/第?\s?[0-9]{1,4}-[0-9]{1,4}\s?(集|话|期)/)) {
                let chapterArr = TORRENT_INFO.tableinfo.subtitle.match(/第?\s?[0-9]{1,4}-[0-9]{1,4}\s?(集|话|期)/)[0].replace(/(第|集|话|期)/g, '').split('-');
                TORRENT_INFO.tableinfo.chapter1 = chapterArr[0].trim();
                TORRENT_INFO.tableinfo.chapter2 = chapterArr[1].trim();
                error.push("不审核单集")
            } else if (TORRENT_INFO.tableinfo.subtitle.match(/第?\s?[0-9]{1,4}\s?(集|话|期)/)) {
                TORRENT_INFO.tableinfo.chapter2 = TORRENT_INFO.tableinfo.subtitle.match(/第?\s?[0-9]{1,4}\s?(集|话|期)/)[0].replace(/(第|集|话|期)/g, '').trim();
                error.push("不审核单集")
            }
        } else if (table.rows[i].cells[0].textContent == '类别与标签') {
            //获取标签
            if (TORRENT_INFO.tableinfo.tags == '') {
                TORRENT_INFO.tableinfo.tags = table.rows[i].cells[1].textContent.trim();
                if (TORRENT_INFO.tableinfo.tags.match(/国语/)) {
                    TORRENT_INFO.tableinfo.hasTagMandarin = true;
                }
                if (TORRENT_INFO.tableinfo.tags.match(/粤语/)) {
                    TORRENT_INFO.tableinfo.hasTagCantonese = true;
                }
                if (TORRENT_INFO.tableinfo.tags.match(/中字/)) {
                    TORRENT_INFO.tableinfo.hasTagChineseSubtitles = true;
                }
                if (TORRENT_INFO.tableinfo.tags.match(/英字/)) {
                    TORRENT_INFO.tableinfo.hasTagEnglishSubtitles = true;
                }
                if (TORRENT_INFO.tableinfo.tags.match(/DIY原盘/)) {
                    TORRENT_INFO.tableinfo.hasTagDIY = true;
                }
            }
        } else if (table.rows[i].cells[0].textContent == '基本信息') {
            //获取基本信息
            var info = table.rows[i].cells[1].textContent;
            if (info.match(/地区.*/)) {
                TORRENT_INFO.tableinfo.area = info.match(/地区.*/)[0].trim();
                info = info.replace(TORRENT_INFO.tableinfo.area, '');
            }
            if (info.match(/质量.*/)) {
                TORRENT_INFO.tableinfo.zhiliang = info.match(/质量.*/)[0].replace('Remux', 'REMUX').trim();
                info = info.replace(TORRENT_INFO.tableinfo.zhiliang, '');
                TORRENT_INFO.tableinfo.zhiliang = TORRENT_INFO.tableinfo.zhiliang.replace('质量: ', '');
            }
            if (info.match(/类型.*/)) {
                TORRENT_INFO.tableinfo.category = info.match(/类型.*/)[0].trim();
                info = info.replace(TORRENT_INFO.tableinfo.category, '');
            }
            if (info.match(/大小.*/)) {
                TORRENT_INFO.tableinfo.size = info.match(/大小.*/)[0].replace('大小：', '').trim();
            }
        } else if (table.rows[i].cells[0].textContent == 'IMDb链接') {
            //获取 IMDb 链接
            TORRENT_INFO.tableinfo.imdburl = table.rows[i].cells[1].textContent.trim();
        } else if (table.rows[i].cells[0].textContent == '豆瓣链接') {
            //获取豆瓣链接
            TORRENT_INFO.tableinfo.doubanurl = table.rows[i].cells[1].textContent.trim();
        } else if (table.rows[i].cells[0].textContent == '字幕') {
            //获取外挂字幕信息
            if(table.rows[i].cells[1].querySelector('img[src="pic/flag/hongkong.gif"], img[src="pic/flag/china.gif"]') !== null){
                TORRENT_INFO.tableinfo.hasChineseExternalsubtitles = '外挂中字';
                //console.log("检测到外挂中文字幕");
            }
            if(table.rows[i].cells[1].querySelector('img[src="pic/flag/uk.gif"]')){
                TORRENT_INFO.tableinfo.hasEnglishExternalsubtitles = '外挂英字';
                //console.log("检测到外挂英文字幕");
            } else if(!table.rows[i].cells[1].textContent.includes("该种子暂无字幕")){
                //console.log("无外挂字幕");
            }
        } else if (table.rows[i].cells[0].textContent.match('简介')) {
            //获取：descrinfo（帖子正文）
            var descr = table.rows[i].cells[1].firstChild.textContent;
            var descr_rows = descr.split('\n');
            // var htmlContent = table.rows[i].cells[1].firstChild.innerHTML

            //图床匹配
            let regexList = [
                 /^(http|https):\/\/.*imgur\.com\/.*\.(jpg|png|gif)$/, // 正则1
                /^(http|https):\/\/.*loli\.net\/.*\.(jpg|png|gif)$/, // 正则2
                /^(http|https):\/\/ibb\.co\/.*\.(jpg|png|gif)$/, // 正则3
                /^(http|https):\/\/.*ax1x\.com\/.*\.(jpg|png|gif)$/, // 正则4
                /^(http|https):\/\/.*picgd\.com\/.*\.(jpg|png|gif)$/, // 正则5
                /^(http|https):\/\/p\.sda1\.dev\/.*\.(jpg|png|gif)$/, // 正则6
                /^(http|https):\/\/i\.duan\.red\/.*\.(jpg|png|gif)$/, // 正则7
                /^(http|https):\/\/.*z4a\.net\/.*\.(jpg|png|gif)$/, // 正则8
                /^(http|https):\/\/gifyu\.com\/.*\.(jpg|png|gif)$/, // 正则9
            ];
            let matchedLinks = Array.from(table.rows[i].cells[1].firstChild.querySelectorAll("img"))
            .map(img => img.src)
            .filter(src => {
                let isMatch = regexList.some(regex => regex.test(src)); // 检查是否匹配任意正则
                if (isMatch) TORRENT_INFO.tableinfo.imageHostBlacklist = true; // 如果匹配成功，设置 A = true
                return isMatch;
            });
/*
            //首图 gifyu 图床判断
            let firstimg = document.querySelector(' #kdescr > img ');
            if (firstimg) {
                if (firstimg.src.match(/gifyu/i)) {
                    a.innerHTML += '<span style="color: red">第一张图片不能是 gifyu 图床</span><br>';
                    error.push("第一张图片不能是 gifyu 图床");
                }
            }
*/

/*// --- 新增代码：[检测并高亮首张图片是否加载失败 V2.2] ---
// --- 开始：首图失效检测 ---
if (firstimg) {
    // 定义一个处理错误的函数，方便复用
    const handleImageError = () => {
        // 在悬浮窗中添加警告
        a.innerHTML += '<br><span style="color: red; font-weight: bold;">警告：第一张海报图加载失败！</span><br>';
        // 为失效图片添加红色边框以高亮
        firstimg.style.border = '2px solid red';
        // 在错误数组中记录
        error.push("第一张海报图加载失败");
    };

    // 为首图添加 onerror 事件处理器，处理异步加载失败的情况
    firstimg.onerror = handleImageError;

    // 补充检查：如果图片在脚本运行前已经加载失败 (e.g. 缓存了错误状态)
    // 则其 complete 属性为 true，但 naturalWidth 会是 0
    if (firstimg.complete && firstimg.naturalWidth === 0) {
        // 手动触发一次错误处理逻辑
        handleImageError();
    }
}
// --- 结束：首图失效检测 ---*/

            descr_rows.forEach((r) => {
                //console.log(r);
                var match;
                if (r.match(/.*(片.*?名|名.*?字).*/)) {//'　'
                    match = r.match(/.*(片.*?名|名.*?字)/);
                    TORRENT_INFO.descrinfo.moviename = TORRENT_INFO.descrinfo.moviename + '/' + r.replace(match[0], '').replace(/\*/g, '0').trim();
                } else if (r.match(/.*(译.*?名|又.*?名|别.*?名).*/)) {
                    match = r.match(/.*(译.*?名|又.*?名|别.*?名)/);
                    TORRENT_INFO.descrinfo.moviename = TORRENT_INFO.descrinfo.moviename + '/' + r.replace(match[0], '').replace(/\*/g, '0').trim();
                } else if (r.match(/(http|https):\/\/www\.imdb\.com\/title\/tt[0-9]{0,8}/)) { //https://www.imdb.com/title/tt11873134/
                    TORRENT_INFO.descrinfo.imdburl = 'http:\/\/' + r.match(/www\.imdb\.com\/title\/tt[0-9]{0,8}/)[0].trim();
                } else if (r.match(/douban\.com\/subject\/[0-9]{0,8}/)) {
                    TORRENT_INFO.descrinfo.doubanurl = 'https:\/\/movie\.' + r.match(/douban\.com\/subject\/[0-9]{0,8}/)[0].trim();
                } else if (r.match(/(制\s*片|产\s*地|国\s*家|地\s*区)/) && !r.match(/(制\s*片\s*人|压.*制.*片.*源)/) && TORRENT_INFO.descrinfo.area == '') {
                    match = r.match(/.*(制\s*片|产\s*地|国\s*家|地\s*区)/);
                    r = r.replace(match[0], '').replace('中国香港', '香港').replace('中国台湾', '台湾').trim();
                    //console.log(r);
                    //console.log(`r length is ${r.trim().length}`);
                    if (r.length < 30) {
                        TORRENT_INFO.descrinfo.area = r;
                    }
                } else if (r.match(/.*语.*言.*/) && TORRENT_INFO.descrinfo.lang == '') {
                    match = r.match(/.*语.*言/);
                    TORRENT_INFO.descrinfo.lang = r.replace(match[0], '').trim();
                } else if (r.match(/.*集.*数.*/) && TORRENT_INFO.descrinfo.chapters == '') {
                    match = r.match(/.*集.*数/);
                    TORRENT_INFO.descrinfo.chapters = r.replace(match[0], '').trim();
                    //console.log(TORRENT_INFO.descrinfo.chapters);
                    if (!TORRENT_INFO.descrinfo.chapters.match(/^[0-9]{1,4}$/)) {
                        TORRENT_INFO.descrinfo.chapters = '';
                    }
                    //                 } else if (r.match(/.*单集片长.*/) && TORRENT_INFO.descrinfo.chapters == '') {
                    //                     TORRENT_INFO.descrinfo.chapters = '0';
                    //                } else if (r.match(/.*(类.*型|类.*别).*/) && (TORRENT_INFO.descrinfo.category == '' || TORRENT_INFO.descrinfo.category == '电影') && !r.match(/我们的TG/) && !r.match(/原创抓取/)) {
                    //                     match = r.match(/.*(类.*型|类.*别)/);
                    //                     TORRENT_INFO.descrinfo.category = r.replace(match[0], '').trim();
                    //                     if (TORRENT_INFO.descrinfo.category.match(/纪录片/)) {
                    //                         TORRENT_INFO.descrinfo.category = '纪录片';
                    //                     } else if (TORRENT_INFO.descrinfo.category.match(/动画/)) {
                    //                         TORRENT_INFO.descrinfo.category = '动画';
                    //                     } else if (TORRENT_INFO.descrinfo.category.match(/真人秀/)) {
                    //                         TORRENT_INFO.descrinfo.category = '综艺';
                    //                     } else if (TORRENT_INFO.descrinfo.category.match(/(4K|HDR)/i)) {
                    //                         TORRENT_INFO.descrinfo.category = '';
                    //                     }
                } else if (r.match(/.*(类.*型|类.*别).*/)) {
                    match = r.match(/.*(类.*型|类.*别)/);
                    TORRENT_INFO.descrinfo.categorys += r.replace(match[0], '').trim() + ' ';
                } else if (r.match(/(首\s*映|上映日期|年\s*代|年\s*份)/) && TORRENT_INFO.descrinfo.publishdate == '') {
                    match = r.match(/(首\s*映|上映日期|年\s*代|年\s*份)/);
                    TORRENT_INFO.descrinfo.publishdate = r.replace(match[0], '').trim();
                    if (TORRENT_INFO.descrinfo.publishdate.match(/[1-2][0-9]{3}/)) {
                        TORRENT_INFO.descrinfo.publishdate = TORRENT_INFO.descrinfo.publishdate.match(/[1-2][0-9]{3}/)[0];
                        //console.log(`年份为 ${TORRENT_INFO.descrinfo.publishdate}`);
                    } else {
                        TORRENT_INFO.descrinfo.publishdate = '';
                    }
                }
            })
        }
    }
    //获取 MediaInfo
    var codehides = document.getElementsByClassName('hide');
    var quote = document.getElementsByTagName('fieldset');
    var mediainfo = '';
    var bdinfo = '';
    var infosp;
    if (codehides) {
        for (let i = 0; i < codehides.length; i++) {
            if (codehides[i].textContent.match(/(General|概览|概要)\s*(ID|Complete\sname|完整名称|File\sname|Unique\sID|唯一ID|CompleteName)/i) ) {
                //if (codehides[i].textContent.replace(/This release.*\n/i, '').trim().match(/^(General|概览)/i) && !codehides[i].textContent.match(/General Information/i)) {
                mediainfo = codehides[i].textContent;
                if (codehides[i].getElementsByTagName('img').length != 0 || mediainfo.match(/\[img\][\S\s]*?\[\/img\]/i)) {
                    a.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
                }
                break;
            } else if (bdinfo == '' && (codehides[i].textContent.trim().match(/Disc.Title:/i) || codehides[i].textContent.trim().match(/Disc.Label:/i) || codehides[i].textContent.trim().match(/DISC.INFO:/i))) {//放宽了对 BDInfo 格式的要求
                bdinfo = codehides[i].textContent;
                if (codehides[i].getElementsByTagName('img').length != 0 || bdinfo.match(/\[img\][\S\s]*?\[\/img\]/i)) {
                    a.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
                }
            }
        }
    }
    if (quote && !mediainfo && !bdinfo) {
        //console.log('quote');
        for (let i = 0; i < quote.length; i++) {
            let quotet = quote[i].textContent.replace('引用', '').trim();
            if (quotet.match(/(General|概览|概要)\s*(ID|Complete\sname|完整名称|File\sname|Unique\sID|唯一ID|CompleteName)/i)) {
                mediainfo = quotet.replace(/This release.*\n/i, '');
                if (quote[i].getElementsByTagName('img').length != 0 || mediainfo.match(/\[img\][\S\s]*?\[\/img\]/i)) {
                    a.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
                }
                break;
            } else if (quotet.match(/(★★★★★ General Information ★★★★★)\n\n(Complete name)/i)) {//非标准 MediaInfo
                //console.log('非标准 MediaInfo');
                mediainfo = quotet;
                if (quote[i].getElementsByTagName('img').length != 0 || mediainfo.match(/\[img\][\S\s]*?\[\/img\]/i)) {
                    a.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
                }
                break;
            } else if (quotet.match(/^(Disc\sTitle|Disc\sLabel|DISC\sINFO|QUICK SUMMARY):/i)) {
                if (bdinfo == '') {
                    bdinfo = quotet;
                    if (quote[i].getElementsByTagName('img').length != 0 || bdinfo.match(/\[img\][\S\s]*?\[\/img\]/i)) {
                        a.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
                    }
                }
            } else if (!infosp && (quotet.match(/(General\sInformation|参.*数.*:|★General★|★概述★|文件名称.*iNT-TLF|中上英下|\[RELEASE INFORMATION\]|MNHD-FRDS|mUHD-FRDS|cXcY@FRDS|QHstudIo小组作品NFO信息|\.Release\.Info|【出品小组】|Release\sGroup:\sBMDru|【制作团队】.*(NGB|HDCTV))/i) || (quotet.match(/Video/i) && quotet.match(/Audio/i) && quotet.match(/Subtitle/i)))) {
                infosp = quotet;
                if (quote[i].getElementsByTagName('img').length != 0 || infosp.match(/\[img\][\S\s]*?\[\/img\]/i)) {
                    a.innerHTML += '<span style="color: red">Info 中含有图片</span><br>';
                }
                //console.log(infosp);
            }
        }
    }
    if (mediainfo) {
        TORRENT_INFO.mediainfo.full = mediainfo.replace(/\u2002/g, ' ');
        mediainfo = TORRENT_INFO.mediainfo.full.replace('Audio Video Interleave', '').replace(/[\s\S]*?General/i, '').replace(/(?<=Video) \#[1-9]\n/ig, '\n').replace(/(?<=Audio) \#[1-9]\n/ig, '\n').replace(/(?<=Text) \#[1-9]\n/ig, '\n');
        //console.log(mediainfo.match(/Menu.*\n00:00:00\.000[\S\s]*$/i)[0]);
        mediainfo = mediainfo.replace(/(Menu|菜单).*\n00:00:00\.000[\S\s]*$/i, '');
        //console.log(mediainfo);
        let stream;
        //General
        match = mediainfo.match(/[\s\S]*?(?=((Video|视频).*\nID|(Audio|音频).*\nID|(Text|文本).*\nID|$))/ig)[0];
        if (match.match(/(File size|文件大小).*(?=\n)/i)) {
            TORRENT_INFO.mediainfo.filesize = match.match(/(File size|文件大小).*(?=\n)/i)[0];
        }
        mediainfo = mediainfo.replace(match, '');
        //Video
        match = mediainfo.match(/(Video|视频)[\s\S]*?(?=(\n(Video|视频).*\nID|\n(Audio|音频).*\nID|\n(Text|文本).*\nID|$))/ig);
        //console.log(`video ${match}`);
        if (match) {
            stream = match[0];
            mediainfo = mediainfo.replace(stream, '');
            if (stream.match(/(Format|格式).*/i)) {
                mediainfo = mediainfo.replace(stream, '');
            } else {
                stream = match[1];
                mediainfo = mediainfo.replace(stream, '');
            }
            if (stream.match(/(Format|格式).*/i)) {
                TORRENT_INFO.mediainfo.video.format = stream.match(/(Format|格式).*/i)[0];
                if (TORRENT_INFO.mediainfo.video.format.match(/MPEG/) && stream.match(/Format version.*Version 2/)) {
                    TORRENT_INFO.mediainfo.video.format = 'MPEG-2';
                } else if (TORRENT_INFO.mediainfo.video.format.match(/AV1/)) {
                    TORRENT_INFO.mediainfo.video.format = 'AV1';
                }
            }
            if (stream.match(/HDR (format|格式).*/i)) {
                let hdr_format = stream.match(/HDR (format|格式).*/i)[0];
                if (hdr_format.match(/Dolby Vision/i)) {
                    TORRENT_INFO.mediainfo.video.dv = true;
                    TORRENT_INFO.results.dv = true;
                }
                //                 if (hdr_format.match(/HDR/i)) {
                //                     TORRENT_INFO.mediainfo.video.hdr = true;
                //                     TORRENT_INFO.results.hdr = true;
                //                 }
                //                 if (hdr_format.match(/HDR/i)) {
                //                     TORRENT_INFO.mediainfo.video.hdr = true;
                //                     TORRENT_INFO.results.hdr = true;
                //                 }
                if (hdr_format.match(/HDR10\+/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = 'HDR10+';
                    TORRENT_INFO.results.hdr = 'HDR10+';
                } else if (hdr_format.match(/HDR\sVivid/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = 'HDR Vivid';
                    TORRENT_INFO.results.hdr = 'HDR Vivid';
                } else if (hdr_format.match(/HDR10/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                    TORRENT_INFO.results.hdr = 'HDR10';
                }
            } else if (stream.match(/(Transfer characteristics|Transfer_characteristics_Original).*PQ.*/i)) {
                TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                TORRENT_INFO.results.hdr = 'HDR10';
            }
            if (stream.match(/(Transfer characteristics|Transfer_characteristics_Original).*HLG.*/i)) {
                TORRENT_INFO.mediainfo.video.hdr = 'HLG';
                TORRENT_INFO.results.hdr = 'HLG';
            }
            if (stream.match(/(Bit rate).*/i)) {
                TORRENT_INFO.mediainfo.video.bitrates = stream.match(/(Bit rate).*/i)[0].replace(/\s/g, '');
                if (TORRENT_INFO.mediainfo.video.bitrates.match(/Mb/i)) {
                    TORRENT_INFO.mediainfo.video.bitrates = parseFloat(TORRENT_INFO.mediainfo.video.bitrates.replace(/Bitrate:/i, '').replace(/Mb\/s/i, '')) * 1024;
                } else if (TORRENT_INFO.mediainfo.video.bitrates.match(/kb/i)) {
                    TORRENT_INFO.mediainfo.video.bitrates = parseInt(TORRENT_INFO.mediainfo.video.bitrates.replace(/Bitrate:/i, '').replace(/kb\/s/i, ''));
                }
            }
            if (stream.match(/Frame rate.*FPS\n/i)) {
                if (stream.match(/Frame rate.*23.976.*FPS\n/i)) {
                    TORRENT_INFO.mediainfo.video.fps = '24FPS';
                } else if (stream.match(/Frame rate.*24.975.*FPS\n/i)) {
                    TORRENT_INFO.mediainfo.video.fps = '25FPS';
                } else if (stream.match(/Frame rate.*29.970.*FPS\n/i)) {
                    TORRENT_INFO.mediainfo.video.fps = '30FPS';
                } else if (stream.match(/Frame rate.*59.*FPS\n/i)) {
                    TORRENT_INFO.mediainfo.video.fps = '60FPS';
                } else if (stream.match(/Frame rate.*119.*FPS\n/i)) {
                    TORRENT_INFO.mediainfo.video.fps = '120FPS';
                } else {
                    TORRENT_INFO.mediainfo.video.fps = stream.match(/Frame rate.*FPS(?=\n)/i)[0].replace(/\s/g, '').replace(/\.000/g, '').match(/[0-9]{2,3}FPS/i)[0];
                }
            }
            if (stream.match(/(Width|宽度).*/i)) {
                TORRENT_INFO.mediainfo.video.width = parseInt(stream.match(/(Width|宽度).*/i)[0].replace(/\s/g, '').match(/[0-9]{3,4}(?=(pixels|像素))/i)[0]);
            }
            if (stream.match(/(Height|高度).*/i)) {
                TORRENT_INFO.mediainfo.video.height = parseInt(stream.match(/(Height|高度).*/i)[0].replace(/\s/g, '').match(/[0-9]{3,4}(?=(pixels|像素))/i)[0]);
            }
            if (stream.match(/(Bit depth|位深).*10 (bits|位)\s*\n/i)) {
                //Bit depth : 10 bits
                TORRENT_INFO.mediainfo.video.bitdepth = '10';
            } else if (stream.match(/(Bit depth|位深).*8 (bits|位)\s*\n/i)) {
                //Bit depth : 8 bits
                TORRENT_INFO.mediainfo.video.bitdepth = '8';
            }
            if (stream.match(/(Scan type|扫描类型|扫描方式).*/i)) {
                TORRENT_INFO.mediainfo.video.scantype = stream.match(/(?<=(Scan type|扫描类型|扫描方式)[\s]*: ).*/i)[0];
            }
            if (stream.match(/(Writing library|编码函数库).*/i)) {
                TORRENT_INFO.mediainfo.video.codec = stream.match(/(Writing library|编码函数库).*/i)[0];
                if (TORRENT_INFO.mediainfo.video.codec.match(/x264/)) {
                    TORRENT_INFO.mediainfo.video.codec = 'x264';
                } else if (TORRENT_INFO.mediainfo.video.codec.match(/x265/)) {
                    TORRENT_INFO.mediainfo.video.codec = 'x265';
                } else if (TORRENT_INFO.mediainfo.video.codec.match(/XviD/)) {
                    TORRENT_INFO.mediainfo.video.codec = 'XviD';
                } else if (TORRENT_INFO.mediainfo.video.codec.match(/DivX/)) {
                    TORRENT_INFO.mediainfo.video.codec = 'DivX';
                } else {
                    console.log(TORRENT_INFO.mediainfo.video.codec);
                }
            } else {
                console.log(`Writing library 识别：
            宽松匹配：${stream.match(/Writing library.*(?=\n)/i)}
            严格匹配：${stream.match(/Writing library(.|\n)*(?=audio)/i)}`);
            }
            if (stream.match(/Standard.*NTSC/i)) {
                TORRENT_INFO.mediainfo.standard = 'NTSC';
            } else if (stream.match(/Standard.*PAL/i)) {
                TORRENT_INFO.mediainfo.standard = 'PAL';
            }
        }
        //console.log(mediainfo);
        //Audios
        match = mediainfo.match(/\n(Audio|音频).*\n[\s\S]*?(?=(\n(Audio|音频).*\nID|\n(Text|文本).*\nID|$))/ig);
        for (let i = 1; match; i++) {
            stream = match[0].trim();
            //console.log(stream);
            mediainfo = mediainfo.replace(stream, '');
            let audioTitle = 0;
            let audioLang = 0;
            let audioAdd = 0;
            var audio_x = {
                format: '',
                channels: '',
                object: '',
                title: '',
                lang: '',
            };
            if (stream.match(/(Format|格式).*/)) {
                audio_x.format = stream.match(/(Format|格式).*/)[0];
                if (audio_x.format.match(/MLP FBA 16-ch/)) {
                    audio_x.format = 'TrueHD';
                    audio_x.object = 'Atmos';
                } else if (audio_x.format.match(/DTS XLL X/)) {
                    audio_x.format = 'DTS:X';
                    audio_x.channels = '7.1';
                } else if (audio_x.format.match(/MLP FBA/)) {
                    audio_x.format = 'TrueHD';
                } else if (audio_x.format.match(/(DTS XLL|DTS ES XLL|DTS ES XXCH XLL|DTS 96\/24 XLL)/)) {
                    audio_x.format = 'DTS-HD MA';
                } else if (audio_x.format.match(/(DTS XBR)/)) {
                    audio_x.format = 'DTS-HD HR';
                } else if (audio_x.format.match(/PCM/)) {
                    audio_x.format = 'LPCM';
                } else if (audio_x.format.match(/FLAC/)) {
                    audio_x.format = 'FLAC';
                } else if (audio_x.format.match(/DTS LBR/)) {
                    audio_x.format = 'DTSE';
                } else if (audio_x.format.match(/Opus/)) {
                    audio_x.format = 'Opus';
                } else if (audio_x.format.match(/AAC/)) {
                    audio_x.format = 'AAC';
                } else if (audio_x.format.match(/DTS/)) {
                    audio_x.format = 'DTS';
                } else if (audio_x.format.match(/E-AC-3 JOC/)) {
                    audio_x.format = 'DDP';
                    audio_x.object = 'Atmos';
                } else if (audio_x.format.match(/E-AC-3/)) {
                    audio_x.format = 'DDP';
                } else if (audio_x.format.match(/AC-3/)) {
                    audio_x.format = 'DD';
                } else if (audio_x.format.match(/MPEG Audio/)) {
                    audio_x.format = 'MPEG';
                }
            }
            if (audio_x.format == 'MPEG' && stream.match(/Format profile.*Layer 2/)) {
                audio_x.format = 'MP2';
            } else if (audio_x.format == 'MPEG' && stream.match(/Format profile.*Layer 3/)) {
                audio_x.format = 'MP3';
            }
            //console.log(`audio match ${stream.match(/(Channel layout|ChannelLayout_Original|声道布局).*/i)}`);
            if (stream.match(/(Channel layout|ChannelLayout_Original|声道布局).*/i) && audio_x.channels == '') {
                let channel_layout = stream.match(/(?<=(Channel layout|ChannelLayout_Original|声道布局)).*/i)[0];
                let channels = 0;
                if (channel_layout.match(/LFE/i)) {
                    channels += 0.1;
                    channel_layout = channel_layout.replace(channel_layout.match(/LFE/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/Lss?/i)) {
                    channels += 1;
                    channel_layout = channel_layout.replace(channel_layout.match(/Lss?/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/Lrs?/i)) {
                    channels += 1;
                    channel_layout = channel_layout.replace(channel_layout.match(/Lrs?/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/Rss?/i)) {
                    channels += 1;
                    channel_layout = channel_layout.replace(channel_layout.match(/Rss?/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/Rrs?/i)) {
                    channels += 1;
                    channel_layout = channel_layout.replace(channel_layout.match(/Rrs?/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/Cb/i)) {
                    channels += 1;
                    channel_layout = channel_layout.replace(channel_layout.match(/Cb/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/Lb/i)) {
                    channels += 1;
                    channel_layout = channel_layout.replace(channel_layout.match(/Lb/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/Rb/i)) {
                    channels += 1;
                    channel_layout = channel_layout.replace(channel_layout.match(/Rb/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/(C|M)s?/i)) {
                    channels += 1;
                    channel_layout = channel_layout.replace(channel_layout.match(/C/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/L/i)) {
                    channels += 1;
                    channel_layout = channel_layout.replace(channel_layout.match(/L/i), '');
                    //console.log(channel_layout);
                }
                if (channel_layout.match(/R/i)) {
                    channels += 1;
                }
                audio_x.channels = channels.toFixed(1).toString();
                //console.log('Channel layout');
            } else if (stream.match(/Channel positions.*Front: L C R, Side: L R, Back: L R, LFE/i)) {
                audio_x.channels = '7.1';
            } else if (stream.match(/Channel positions.*Front: L C R, Side: L R, LFE/i)) {
                audio_x.channels = '5.1';
            } else if (stream.match(/Channel positions.*Front: L C R, Back: C/i)) {
                audio_x.channels = '4.0';
            } else if (stream.match(/Channel\(s\).*6\schannels/i)) {
                audio_x.channels = '5.1';
            } else if (stream.match(/Channel\(s\).*[12].*/i)) {
                audio_x.channels = stream.match(/Channel\(s\).*[12].*/i)[0].match(/[12]/)[0] + '.0';
            }
            //判断音轨语言
            if (stream.match(/Title.*/)) {
                TORRENT_INFO.mediainfo.video.audio_lang += 1;
                audio_x.title = stream.match(/Title.*/)[0];
                if (audio_x.title.match(/(国语|普通话|国配|台配|Mandarin)/)) {
                    audioTitle = 1;
                }
                if (audio_x.title.match(/(粤语|粵語|粤配|Cantonese|Contonese)/)) {
                    audioTitle = 3;
                }
            } else {
                audio_x.title = null;
            }
            if (stream.match(/(Language|语言).*/)) {
                TORRENT_INFO.mediainfo.video.audio_lang += 1;
                audio_x.lang = stream.match(/(Language|语言).*/)[0];
                if (audio_x.lang.match(/(Chinese|Mandarin)/i)) {
                    audioLang = 5;
                }
                if (audio_x.lang.match(/(Cantonese)/i)) {
                    audioLang = 9;
                }
            } else {
                audio_x.lang = null;
            }
            audioAdd = audioTitle + audioLang;
            //console.log(`audioAdd ${audioAdd}`);
            if (audioAdd == 1) {
                TORRENT_INFO.mediainfo.hasMandarin = true;
            } else if (audioAdd == 3) {
                TORRENT_INFO.mediainfo.hasCantonese = true;
            } else if (audioAdd == 6) {
                TORRENT_INFO.mediainfo.hasMandarin = true;
            } else if (audioAdd == 12) {
                TORRENT_INFO.mediainfo.hasCantonese = true;
            } else if (audioAdd == 5) {
                TORRENT_INFO.mediainfo.hasMandarin = true;
            } else if (audioAdd == 9 || audioAdd == 8) {
                TORRENT_INFO.mediainfo.hasCantonese = true;
            }
            let key = 'audio' + i;
            TORRENT_INFO.mediainfo.audios[key] = audio_x;
            match = mediainfo.match(/\n(Audio|音频).*\n[\s\S]*?(?=(\n(Audio|音频).*\nID|\n(Text|文本).*\nID|$))/ig);
        }
        //console.log(mediainfo);
        //Subtitles
        match = mediainfo.match(/\n(Text|文本).*\n[\s\S]*?(?=(\n(Text|文本).*\nID|$))/ig);
        for (let i = 1; match; i++) {
            stream = match[0].trim();
            //console.log(stream);
            mediainfo = mediainfo.replace(stream, '');
            /*             let textTitleCHN = 0;
            let textTitleENG = 0;
            let textLang = 0;
            let textAdd = 0; */
            var text_x = {
                title: '',
                lang: '',
            };
            if (stream.match(/(Language|语言).*(Chinese|Mandarin)/i)) {
                TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                if (stream.match(/Title.*(cht&eng|中英|chs&eng)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
            }
            if (stream.match(/(Language|语言).*English/i)) {
                TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
            }
            if (stream.match(/Title.*(中上.下|.下中上|简.双语|繁.双语)/i)) {
                TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
            }
            let key = 'text' + i;
            TORRENT_INFO.mediainfo.subtitles[key] = text_x;
            match = mediainfo.match(/\n(Text|文本).*\n[\s\S]*?(?=(\n(Text|文本).*\nID|$))/ig);
        }
    }
    if (bdinfo && !mediainfo) {
        bdinfo = bdinfo.replace(/\u2002/g, ' ');
        //console.log(bdinfo);
        TORRENT_INFO.bdinfo.full = bdinfo;
        if (TORRENT_INFO.tableinfo.subtitle.match(/DIY/i)) {
            TORRENT_INFO.bdinfo.DIY = true;
        }
        let ai = 1;
        let si = 1;
        //Video
        var bdinfo_rows = [];
        bdinfo.split('\n').forEach( (r) => { if (r.match(/ kbps/)) { bdinfo_rows.push(r); } } );
        bdinfo_rows.forEach((r) => {
            //console.log(r);
            if (r.match(/Video/) && TORRENT_INFO.bdinfo.video.format == '') {
                //format
                if (r.match('AVC')) {TORRENT_INFO.bdinfo.video.format = 'AVC';}
                else if (r.match('HEVC')) {TORRENT_INFO.bdinfo.video.format = 'HEVC';}
                else if (r.match('VC-1')) {TORRENT_INFO.bdinfo.video.format = 'VC-1';}
                else if (r.match('MPEG-2')) {TORRENT_INFO.bdinfo.video.format = 'MPEG-2';}
                //bitrates
                if (r.match(/[0-9]{1,5} kbps/)) {
                    TORRENT_INFO.bdinfo.video.bitrates = r.match(/[0-9]{1,5} kbps/)[0];
                }
                //resolution
                if (r.match(/[1-2][0-9]{3}(p|i)/)) {
                    TORRENT_INFO.bdinfo.video.resolution = r.match(/[1-2][0-9]{3}(p|i)/)[0];
                }
                //HDR
                if (r.match(/HDR10\+/)) {
                    TORRENT_INFO.bdinfo.video.hdr = 'HDR10+';
                    TORRENT_INFO.results.hdr = 'HDR10+';
                } else if (r.match(/HDR/)) {
                    TORRENT_INFO.bdinfo.video.hdr = 'HDR';
                    TORRENT_INFO.results.hdr = 'HDR';
                }
            }
            else if (r.match(/Video/) && r.match(/Dolby Vision/)) {
                //DV
                if (r.match(/[0-9]{1,5} kbps/)) {
                    TORRENT_INFO.bdinfo.video_dv = r.match(/[0-9]{1,5} kbps/)[0];
                }
                TORRENT_INFO.bdinfo.video.dv = true;
                TORRENT_INFO.results.dv = true;
            }
            //Subtitles
            else if (r.match(/(Subtitle|Presentation Graphics)/)) {
                if (r.match('Chinese')) {
                    TORRENT_INFO.bdinfo.subtitles.push('Mandarin');
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match('English') || r.match('英')) {
                    TORRENT_INFO.bdinfo.subtitles.push('English');
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                TORRENT_INFO.bdinfo.subtitles.push('有字幕');
            }
            //Audios
            else if (r.match(/(Audio|kHz)/)) {
                var audio_x = {
                    format: '',
                    channels: '',
                    lang: '',
                    object: '',
                };
                //format
                if (r.match(/Dolby TrueHD\/Atmos Audio/)) {
                    audio_x.format = 'TrueHD';
                    audio_x.channels = '7.1';
                    audio_x.object = 'Atmos'
                } else if (r.match(/Dolby TrueHD Audio/)) {
                    audio_x.format = 'TrueHD';
                } else if (r.match(/DTS-HD Master Audio/)) {
                    audio_x.format = 'DTS-HD MA';
                } else if (r.match(/DTS-HD High-Res/)) {
                    audio_x.format = 'DTS-HD HR';
                } else if (r.match(/DTS/)) {
                    audio_x.format = 'DTS';
                } else if (r.match(/Dolby Digital Plus Audio/)) {
                    audio_x.format = 'DDP';
                } else if (r.match(/Dolby Digital Audio/)) {
                    audio_x.format = 'DD';
                } else if (r.match(/LPCM Audio/)) {
                    audio_x.format = 'LPCM';
                } else {
                    audio_x.format = 'Unknown';
                }
                //channels
                if (r.match(/[1-7]\.[0-1]( |-ES )\//) && audio_x.channels == '') {
                    audio_x.channels = r.match(/[1-7]\.[0-1]( |-ES )\//)[0].replace('-ES', '').replace(' /', '');
                }
                //language
                if (r.match('Chinese')) {
                    audio_x.lang = 'Mandarin';
                    TORRENT_INFO.mediainfo.hasMandarin = true;
                } else if (r.match('Cantonese')) {
                    audio_x.lang = 'Cantonese';
                    TORRENT_INFO.mediainfo.hasCantonese = true;
                }
                let key = 'audio' + ai;
                ai++;
                TORRENT_INFO.bdinfo.audios[key] = audio_x;
            }
        })
    }

    //获取 titleinfo
    var title = document.getElementById('top');
    //分离主标题和免费信息
    TORRENT_INFO.titleinfo.origin = title.firstChild.textContent.trim();
    TORRENT_INFO.titleinfo.freeinfo = title.textContent.replace(TORRENT_INFO.titleinfo.origin, '');
    TORRENT_INFO.results.title = TORRENT_INFO.titleinfo.origin;
    //获取台标
    if (TORRENT_INFO.results.title.match(/^(CCTV4K|CHC|CWJDTV)/i)) {
        match = TORRENT_INFO.results.title.match(/^(CCTV4K|CHC|CWJDTV)/i);
        TORRENT_INFO.titleinfo.logo = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Logo##');
    } else if (TORRENT_INFO.results.title.match(/^Jade/i) && TORRENT_INFO.tableinfo.hasTagCantonese == true) {
        match = TORRENT_INFO.results.title.match(/^Jade/i);
        TORRENT_INFO.titleinfo.logo = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Logo##');
    }
    //获取：标题 REMUX 信息
    if (TORRENT_INFO.results.title.match(/REMUX/i)) {
        TORRENT_INFO.titleinfo.remux = true;
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(TORRENT_INFO.results.title.match(/REMUX/i)[0], '##REMUX##');
    }
    //获取：标题媒介1
    if (TORRENT_INFO.results.title.match(/Blu-?ray/i)) {
        match = TORRENT_INFO.results.title.match(/Blu-?ray/i);
        TORRENT_INFO.titleinfo.source = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
        TORRENT_INFO.results.source = 'Blu-ray';
        //获取：标题媒介2
    } else if (TORRENT_INFO.results.title.match(/WEBRip/i)) {
        match = TORRENT_INFO.results.title.match(/WEBRip/i);
        TORRENT_INFO.titleinfo.source = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
        TORRENT_INFO.results.source = 'WEBRip';
        //获取标题媒介3
    } else if (TORRENT_INFO.results.title.match(/WEB-?D?L?/i)) {//删除了对“WEB”和“WEBDL”的匹配
        match = TORRENT_INFO.results.title.match(/WEB-?D?L?/i);
        TORRENT_INFO.titleinfo.source = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
        TORRENT_INFO.results.source = 'WEB-DL';
        //获取标题媒介4
    } else if (TORRENT_INFO.results.title.match(/HDTVRip/i)) {
        match = TORRENT_INFO.results.title.match(/HDTVRip/i);
        TORRENT_INFO.titleinfo.source = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
        TORRENT_INFO.results.source = 'HDTVRip';
        //获取标题媒介5
    } else if (TORRENT_INFO.results.title.match(/U?HDTV/i)) {
        match = TORRENT_INFO.results.title.match(/U?HDTV/i);
        TORRENT_INFO.titleinfo.source = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
        TORRENT_INFO.results.source = 'HDTV';
        //获取标题媒介6
    } else if (TORRENT_INFO.results.title.match(/DVDRip/i)) {
        match = TORRENT_INFO.results.title.match(/DVDRip/i);
        TORRENT_INFO.titleinfo.source = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
        TORRENT_INFO.results.source = 'DVDRip';
        //获取标题媒介7
    } else if (TORRENT_INFO.results.title.match(/DVD[59]?/i) && TORRENT_INFO.results.title.match(/(PAL|NTSC)/i)) {
        match = TORRENT_INFO.results.title.match(/DVD[59]?/i);
        TORRENT_INFO.titleinfo.source = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
        TORRENT_INFO.results.source = 'DVD';
        match = TORRENT_INFO.results.title.match(/(PAL|NTSC)/i);
        TORRENT_INFO.titleinfo.standard = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Standard##');
    } else if (TORRENT_INFO.results.title.match(/DVD[59]?/i) && TORRENT_INFO.titleinfo.remux) {
        match = TORRENT_INFO.results.title.match(/DVD[59]?/i);
        TORRENT_INFO.titleinfo.source = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Source##');
        TORRENT_INFO.results.source = 'DVD';
    }
    //获取标题视频编码
    if (TORRENT_INFO.results.title.match(/(HEVC|AVC|x264|x265|H(\.|\s)?264|H(\.|\s)?265|Xvid|VC-?1|MPEG-?2|AV1|VP9)/i)) {
        match = TORRENT_INFO.results.title.match(/(HEVC|AVC|x264|x265|H(\.|\s)?264|H(\.|\s)?265|Xvid|VC-?1|MPEG-?2|AV1|VP9)/i);
        TORRENT_INFO.titleinfo.vcodec = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Vcodec##');
    }
//     if (TORRENT_INFO.results.source != 'DVDRip') {
        //获取标题视频分辨率1
        if (TORRENT_INFO.results.title.match(/(480p|576p|720p|1080p|2160p|4320p)/i)) {
            match = TORRENT_INFO.results.title.match(/(480p|576p|720p|1080p|2160p|4320p)/i);
            TORRENT_INFO.titleinfo.resolution = match[0].trim();
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Resolution##');
            //获取标题视频分辨率2
        } else if (TORRENT_INFO.results.title.match(/8K/i)) {
            match = TORRENT_INFO.results.title.match(/8K/i);
            TORRENT_INFO.titleinfo.resolution = '4320p';
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Resolution##');
            //获取标题视频分辨率3
        } else if (TORRENT_INFO.results.title.match(/4K/i)) {
            match = TORRENT_INFO.results.title.match(/4K/i);
            TORRENT_INFO.titleinfo.resolution = '2160p';
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Resolution##');
            //获取标题视频分辨率3
        } else if (TORRENT_INFO.results.title.match(/480i|576i|1080i/i)) {
            match = TORRENT_INFO.results.title.match(/480i|576i|1080i/i);
            TORRENT_INFO.titleinfo.resolution = match[0].trim();
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Resolution##');
        }
//     } else {
//         //获取 DVDRip 标题视频分辨率1
//         if (TORRENT_INFO.results.title.match(/(480p|576p|720p|1080p)/i)) {
//             match = TORRENT_INFO.results.title.match(/(480p|576p|720p|1080p)/i);
//             TORRENT_INFO.titleinfo.resolution = match[0].trim();
//             TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Resolution##');
//         }
//     }
    //获取标题音频对象1
    if (TORRENT_INFO.results.title.match(/(Atmos|DDPA)/i)) {
        TORRENT_INFO.titleinfo.aobject = 'Atmos';
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(/Atmos/i, '##Atmos##').replace(/DDPA/i, 'DDP##Atmos##');
    }
    //title = TORRENT_INFO.titleinfo.origin.replace('-HDC', '');
    //获取前置：标题拆分
    //console.log(`TORRENT_INFO.titleinfo.origin ${TORRENT_INFO.titleinfo.origin}`);
    if (TORRENT_INFO.titleinfo.source != '') {
        title = TORRENT_INFO.titleinfo.origin.replace(TORRENT_INFO.titleinfo.source, '##Source##').split('##Source##');
        title[1] = TORRENT_INFO.titleinfo.origin.replace(title[0], '').replace(TORRENT_INFO.titleinfo.source, '').replace(TORRENT_INFO.titleinfo.resolution, '').replace('Remux', '').replace(TORRENT_INFO.titleinfo.vcodec, '');//剩下制作组、音频编码、音频通道、HDR 信息、HQ 等
        title[0] = title[0].replace(TORRENT_INFO.titleinfo.resolution, '').replace('Remux', '').replace(TORRENT_INFO.titleinfo.vcodec, '');//剩下片名、年份、季数、集数、剪辑版本、Hybrid 等
    } else if (TORRENT_INFO.titleinfo.resolution != '') {
        title = TORRENT_INFO.titleinfo.origin.replace(TORRENT_INFO.titleinfo.resolution, '##Resolution##').split('##Resolution##');
        title[1] = TORRENT_INFO.titleinfo.origin.replace(title[0], '').replace(TORRENT_INFO.titleinfo.resolution, '').replace(TORRENT_INFO.titleinfo.source, '').replace('Remux', '').replace(TORRENT_INFO.titleinfo.vcodec, '');//剩下片名、年份、季数、集数、剪辑版本、Hybrid 等
        title[0] = title[0].replace(TORRENT_INFO.titleinfo.source, '').replace('Remux', '').replace(TORRENT_INFO.titleinfo.vcodec, '');//剩下制作组、音频通道、HDR 信息、HQ 等
    }
    if (title[0] && title[1]) {
        //console.log(`title[0] is ${title[0]}`);
        //console.log(`title[1] is ${title[1]}`);
        //获取标题音频编码1
        if (title[1].match(/(DTS(-|\s|\.)?HD.?MA|DTS(-|\s\.)?HD.?HR|DD\+|DDP|LPCM|DTS.?X|MP2|EAC-?3|FLAC|TrueHD|AAC|OPUS)/ig)) {
            match = title[1].match(/(DTS(-|\s|\.)?HD.?MA|DTS(-|\s\.)?HD.?HR|DD\+|DDP|LPCM|DTS.?X|MP2|EAC-?3|FLAC|TrueHD|AAC|OPUS)/ig);
            TORRENT_INFO.titleinfo.acodec = match[0].replace('.', ' ').trim();
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Acodec##');
            title[1] = title[1].replace(match[0], '');
            //获取标题音频编码2
        } else if (title[1].match(/(DTS|DD|PCM|AC-?3)/ig)) {
            match = title[1].match(/(DTS|DD|PCM|AC-?3)/ig);
            TORRENT_INFO.titleinfo.acodec = match[0].trim();
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Acodec##');
            title[1] = title[1].replace(match[0], '');
        }
        //获取标题音频通道
        if (title[1].match(/[1-7]\.[0-1]/ig)) {
            match = title[1].match(/[1-7]\.[0-1]/ig);
            TORRENT_INFO.titleinfo.channels = match[0].trim();
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Channels##');
            title[1] = title[1].replace(match[0], '');
        }
        //获取标题制作组
        if (title[1].match(/￡.*(-|@)FRDS/i)) {
            TORRENT_INFO.titleinfo.group = title[1].match(/￡.*(-|@)FRDS/i)[0].trim();
        } else {
            try {
                let groups = title[1].split('-');
                //console.log(`group length is ${groups.length}`);
                if (groups.length > 1) {
                    TORRENT_INFO.titleinfo.group += groups[1].trim();
                }
                for (let i = 2; i < groups.length; i++) {
                    TORRENT_INFO.titleinfo.group += '-';
                    TORRENT_INFO.titleinfo.group += groups[i].trim();
                }
                if (TORRENT_INFO.titleinfo.group == '') {
                    TORRENT_INFO.titleinfo.group = title[1].split('@')[1].trim();
                }
                TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(TORRENT_INFO.titleinfo.group, '##Group##')
            } catch (e) {
                //console.log('无制作组');
            }
        }
        //获取季数
        if (title[0].match(/S[0-2][0-9]/i)) {
            match = title[0].match(/S[0-2][0-9]/i);
            TORRENT_INFO.titleinfo.season = match[0];
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Season##');
            title[0] = title[0].replace(match[0], '');
        }
        //获取集数
        if (title[0].match(/E[0-9]{1,4}-E?[0-9]{1,4}/)) {
            match = title[0].match(/E[0-9]{1,4}-E?[0-9]{1,4}/);
            let chapterArr = match[0].replaceAll('E', '').split('-');
            TORRENT_INFO.titleinfo.chapter1 = chapterArr[0];
            TORRENT_INFO.titleinfo.chapter2 = chapterArr[1];
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Chapters##');
            title[0] = title[0].replace(match[0], '');
        } else if (title[0].match(/E[0-9]{1,4}/)) {
            match = title[0].match(/E[0-9]{1,4}/);
            TORRENT_INFO.titleinfo.chapter1 = '-1';
            TORRENT_INFO.titleinfo.chapter2 = match[0].replaceAll('E', '');
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##Chapters##');
            title[0] = title[0].replace(match[0], '');
        } else {
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace('##Season##', '##Season####Chapters##');
        }
        //获取片名和年份
        //console.log(TORRENT_INFO.results.title);
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(/\*/g, '0');
        TORRENT_INFO.titleinfo.name = TORRENT_INFO.results.title.replace('##Logo##', '').split('##', 1)[0].trim();//先获取一个片名
        if (TORRENT_INFO.descrinfo.moviename.match(TORRENT_INFO.titleinfo.name)) {
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(TORRENT_INFO.titleinfo.name, '##Name##');//如果直接匹配，说明主标题没有年份可以获取或在季数后面
            match = TORRENT_INFO.results.title.match(/[1-2][0-9]{3}/g);
            if (match) {
                TORRENT_INFO.titleinfo.year = match[0];
                TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(TORRENT_INFO.titleinfo.year, '##Year##');
            }
        } else if (title[0].match(/[1-2][0-9]{3}/g)) {//否则先获取年份再获取片名
            match = title[0].match(/[1-2][0-9]{3}/g);
            TORRENT_INFO.titleinfo.year = match[match.length - 1];
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(TORRENT_INFO.titleinfo.year, '##Year##');
            TORRENT_INFO.titleinfo.name = TORRENT_INFO.results.title.replace('##Logo##', '').split('##', 1)[0].trim();
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(TORRENT_INFO.titleinfo.name, '##Name##');
        } else {
            TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(TORRENT_INFO.titleinfo.name, '##Name##');//说明主标题没有年份可以获取
        }
    }
    //    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(TORRENT_INFO.titleinfo.name, '##Name##');
    //获取标题 FPS
    if (TORRENT_INFO.results.title.match(/[0-9]{2,3}FPS/i)) {
        match = TORRENT_INFO.results.title.match(/[0-9]{2,3}FPS/i)
        TORRENT_INFO.titleinfo.fps = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##FPS##');
    }
    //获取标题 HDR
    if (TORRENT_INFO.results.title.match(/HDR10(\+|P)/i)) {
        match = TORRENT_INFO.results.title.match(/HDR10(\+|P)/i);
        TORRENT_INFO.titleinfo.hdr = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##HDR##');
    } else if (TORRENT_INFO.results.title.match(/HDR.Vivid/i)) {
        match = TORRENT_INFO.results.title.match(/HDR.Vivid/i);
        TORRENT_INFO.titleinfo.hdr = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##HDR##');
    } else if (TORRENT_INFO.results.title.match(/HDR(10)?/i)) {
        match = TORRENT_INFO.results.title.match(/HDR(10)?/i);
        TORRENT_INFO.titleinfo.hdr = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##HDR##');
    } else if (TORRENT_INFO.results.title.match(/HLG/i)) {
        TORRENT_INFO.titleinfo.hdr = 'HLG';
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace('HLG', '##HDR##');
    }
    //获取标题 DV
    if (TORRENT_INFO.results.title.match(/(DV|DoVi|Dolby Vision)/i)) {
        match = TORRENT_INFO.results.title.match(/(DV|DoVi|Dolby Vision)/i);
        TORRENT_INFO.titleinfo.dv = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##DoVi##');
    }
    //获取 10bit
    if (TORRENT_INFO.results.title.match(/10bits?/i)) {
        match = TORRENT_INFO.results.title.match(/10bits?/i);
        TORRENT_INFO.titleinfo.bitdepth = match[0];
        TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace(match[0], '##BitDepth##');
    }
    TORRENT_INFO.results.title = TORRENT_INFO.results.title.replace('##Name####', '##Name## ##');
    //获取 MiniBD
    if (TORRENT_INFO.results.title.match(/MiniBD/)) {
        TORRENT_INFO.titleinfo.minibd = true;
    }
    //获取 3D HOU/HSBS
    if (TORRENT_INFO.results.title.match(/HOU|HSBS/)) {
        TORRENT_INFO.titleinfo.format3d = TORRENT_INFO.results.title.match(/HOU|HSBS/)[0];
    }

    //获取解析 Info
    if (infosp && !mediainfo && !bdinfo) {
        infosp = infosp.replace(/\u2002/g, ' ');
        if (infosp.match(/(参.*数.*:|中上英下).*/i)) {//CMCT
            console.log('CMCT');
            if (infosp.match(/帧.*率.*23.976.*/)) {
                TORRENT_INFO.mediainfo.video.fps = '24FPS';
            }
            if (infosp.match(/(分辨率|视频尺寸).*/i)) {
                match = infosp.match(/(分辨率|视频尺寸).*/i);
                if (match[0].match('x')) {
                    match = match[0].split('x');
                } else if (match[0].match(/\*/)) {
                    match = match[0].split(/\*/);
                }
                TORRENT_INFO.mediainfo.video.width = parseInt(match[0].match(/[0-9]{3,4}/)[0]);
                TORRENT_INFO.mediainfo.video.height = parseInt(match[1].match(/[0-9]{3,4}/)[0]);
            }
            if (infosp.match(/视.*频.*/)) {
                match = infosp.match(/视.*频.*/);
                if (match[0].match(/x264/i)) {
                    TORRENT_INFO.mediainfo.video.format = 'AVC';
                    TORRENT_INFO.mediainfo.video.codec = 'x264';
                } else if (match[0].match(/x265/i)) {
                    TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    TORRENT_INFO.mediainfo.video.codec = 'x265';
                }
                if (match[0].match(/HDR10/)) {
                    TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                    TORRENT_INFO.results.hdr = 'HDR10';
                }
                if (match[0].match(/DoVi/)) {
                    TORRENT_INFO.mediainfo.video.dv = true;
                    TORRENT_INFO.results.dv = true;
                }
                if (match[0].match(/10\sbits/)) {
                    TORRENT_INFO.mediainfo.video.bitdepth = '10bit';
                }
            }
            if (infosp.match(/(?<=音.*频[\s\S]*)字.*幕.*/)) {
                match = infosp.match(/(?<=音.*频[\s\S]*)字.*幕[\s\S]*/)[0].split('\n');
                infosp = infosp.replace(infosp.match(/(?<=音.*频[\s\S]*)字.*幕[\s\S]*$/)[0], '');
                match.forEach((r) => {
                    if (r.match(/(Chinese|中文|中上英下|简体)/i)) {
                        TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                    }
                    if (r.match(/(English|英文|中上英下)/i)) {
                        TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                    }
                })
            }
            if (infosp.match(/音.*频.*/)) {
                match = infosp.match(/音.*频[\s\S]*$/)[0].split('\n');
                //console.log(match);
                for (let i = 0; i < match.length; i++) {
                    if (match[i] == '' || match[i].match(/压.*制/)) {
                        break;
                    }
                    let audio_x = {
                        format: '',
                        channels: '',
                        object: '',
                    };
                    if (match[i].match(/(Chinese|国语|国配|中文)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    if (match[i].match(/(Cantonese|粤语|粤配)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    }
                    if (match[i].match(/TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (match[i].match(/DTS-X/i)) {
                        audio_x.format = 'DTS:X';
                    } else if (match[i].match(/DTS-HD MA/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (match[i].match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (match[i].match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (match[i].match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (match[i].match(/(EAC3|DDP)/i)) {
                        audio_x.format = 'DDP';
                    } else if (match[i].match(/(AC3|DD)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (match[i].match(/[1-7]\.[01]/)) {
                        audio_x.channels = match[i].match(/[1-7]\.[01]/)[0];
                    }
                    let key = 'audio' + (i + 1);
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            }
        } else if (infosp.match(/Release\sGroup:\sBMDru/i)) {//BMDru
            console.log('BMDru');
            match = infosp.split('\n');
            let i = 0;
            let audio_x = {
                format: '',
                channels: '',
                object: '',
            };
            match.forEach((r) => {
                if (r.match(/x264/i)) {
                    TORRENT_INFO.mediainfo.video.format = 'AVC';
                    TORRENT_INFO.mediainfo.video.codec = 'x264';
                } else if (r.match(/x265/i)) {
                    TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    TORRENT_INFO.mediainfo.video.codec = 'x265';
                }
                //                 if (infosp.match(/位.*深.*/)) {
                //                     TORRENT_INFO.mediainfo.video.bitdepth = '10';
                //                 }
                if (r.match(/resolution.*/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                }
                //                 if (r.match(/HDR.Format.*HDR10/i)) {
                //                     TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                //                 }
                if (r.match(/Language.*Mandarin/i)) {
                    TORRENT_INFO.mediainfo.hasMandarin = true;
                }
                if (r.match(/Language.*Cantonese/i)) {
                    TORRENT_INFO.mediainfo.hasCantonese = true;
                }
                if (r.match(/Subtitle\(s\).*(Chs|Cht)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/Subtitle\(s\).*(Eng)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                if (r.match(/KHz.*bits.*-ch/i)) {
                    i++;
                    if (r.match(/TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS-HD MA/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/(E-AC-3|Dolby Digital Plus)/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/(AC-3|AC3)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (r.match(/-ch/i)) {
                        if (r.match(/[3-8]-ch/)) {
                            audio_x.channels = (parseFloat(r.match(/[3-8](?=-ch)/)[0]) - 1 + 0.1).toString();
                        } else if (r.match(/[12]-ch/)) {
                            audio_x.channels = r.match(/[12](?=-ch)/)[0] + '.0';
                        }
                    }
                    let key = 'audio' + i;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            })
        } else if (infosp.match(/文件名称.*iNT-TLF/i)) {//iNT-TLF
            console.log('iNT-TLF');
            match = infosp.split('\n');
            let i = 0;
            let audio_x = {
                format: '',
                channels: '',
                object: '',
            };
            match.forEach((r) => {
                if (r.match(/x264参数/i)) {
                    TORRENT_INFO.mediainfo.video.format = 'AVC';
                    TORRENT_INFO.mediainfo.video.codec = 'x264';
                } else if (r.match(/x265参数/i)) {
                    TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    TORRENT_INFO.mediainfo.video.codec = 'x265';
                }
                if (infosp.match(/位.*深.*/)) {
                    TORRENT_INFO.mediainfo.video.bitdepth = '10';
                }
                if (r.match(/视频尺寸.*/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                }
                if (r.match(/HDR.Format.*HDR10/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(Chinese|Simplified|Traditional|中文|中上英下|简体|CHS|CHT|zh)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(English|英文|ENG)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                if (r.match(/音频编码.*/i)) {
                    i++;
                    if (r.match(/TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS-HD MA/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/(E-AC-3|Dolby Digital Plus)/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/AC-3/i)) {
                        audio_x.format = 'DD';
                    }
                }
                if (r.match(/音轨声道.*/i)) {
                    if (r.match(/[3-8] 声道/)) {
                        audio_x.channels = (parseFloat(r.match(/[1-6](?= 声道)/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12] 声道/)) {
                        audio_x.channels = r.match(/[1-6](?= 声道)/)[0] + '.0';
                    }
                }
                if (r.match(/音轨信息.*/i)) {
                    let key = 'audio' + i;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
                //                 if (r.match(/(音.*轨|Audio.*:).*/i)) {
                //                     console.log(r);
                //                     let audio_x = {
                //                         format: '',
                //                         channels: '',
                //                         object: '',
                //                     };
                //                     if (r.match(/(Chinese|Mandarin|国语)/i)) {
                //                         TORRENT_INFO.mediainfo.hasMandarin = true;
                //                     }
                //                     if (r.match(/(Cantonese|粤语)/i)) {
                //                         TORRENT_INFO.mediainfo.hasCantonese = true;
                //                     }
                //                     if (r.match(/TrueHD/i)) {
                //                         audio_x.format = 'TrueHD';
                //                     } else if (r.match(/DTS-HD MA/i)) {
                //                         audio_x.format = 'DTS-HD MA';
                //                     } else if (r.match(/FLAC/i)) {
                //                         audio_x.format = 'FLAC';
                //                     } else if (r.match(/DTS/i)) {
                //                         audio_x.format = 'DTS';
                //                     } else if (r.match(/AAC/i)) {
                //                         audio_x.format = 'AAC';
                //                     } else if (r.match(/(E-AC-3|Dolby Digital Plus)/i)) {
                //                         audio_x.format = 'DDP';
                //                     } else if (r.match(/(AC3|DD|Dolby Digital)/i)) {
                //                         audio_x.format = 'DD';
                //                     }
                //                     if (r.match(/Atmos/i)) {
                //                         audio_x.object = 'Atmos';
                //                     }
                //                     r = r.replace(/(?<=channels).*/i, '');
                //                     console.log(r);
                //                     if (r.match(/[1-7]\.[01]/)) {
                //                         audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                //                     } else if (r.match(/[3-8] channels/)) {
                //                         audio_x.channels = (parseFloat(r.match(/[1-6](?= channels)/)[0]) - 1 + 0.1).toString();
                //                     } else if (r.match(/[12] channels/)) {
                //                         audio_x.channels = r.match(/[1-6](?= channels)/)[0] + '.0';
                //                     }
                //                     let key = 'audio' + i;
                //                     i++;
                //                     TORRENT_INFO.mediainfo.audios[key] = audio_x;
                //                 }
            })
        } else if (infosp.match(/(★General★|★概述★)/i) && infosp.match(/Ubits/i)) {//Ubits
            console.log('Ubits');
            match = infosp.split('\n');
            let i = 0;
            let audio_x = {
                format: '',
                channels: '',
                object: '',
            };
            match.forEach((r) => {
                if (r.match(/(RESOLUTION|分 辨 率).*:/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                } else if (r.match(/(Codec|视频编码).*:/i)) {
                    if (r.match(/AVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x264';
                    } else if (r.match(/HEVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x265';
                    }
                    if (r.match(/Main\s?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                } else if (r.match(/(HDR format|HDR格式).*:/i)) {
                    console.log(r);
                    if (r.match(/Dolby Vision/i)) {
                        TORRENT_INFO.mediainfo.video.dv = true;
                    }
                    if (r.match(/HDR10/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                        TORRENT_INFO.results.hdr = 'HDR10';
                    }
                } else if (r.match(/(Bit rate|比 特 率).*s:/i)) {
                    TORRENT_INFO.mediainfo.video.bitrates = parseFloat(r.match(/(?<=:).*(?=(Mb|kb)\/s)/)[0].replace(' ', ''));
                } else if (r.match(/(★Audio★|★音频参数★)/i)) {
                    i++;
                } else if (r.match(/(Format|音频编码).*:/i)) {
                    if (r.match(/MLP FBA 16-ch/i)) {
                        audio_x.format = 'TrueHD';
                        audio_x.object = 'Atmos';
                    } else if (r.match(/TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/(DTS XLL|DTS ES XLL)/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/PCM/i)) {
                        audio_x.format = 'LPCM';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/(E-AC-3|Dolby Digital Plus)/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/AC-3/i)) {
                        audio_x.format = 'DD';
                    }
                } else if (r.match(/(Channels|声.*道).*:/i)) {
                    if (r.match(/[3-8]/)) {
                        audio_x.channels = (parseFloat(r.match(/[3-8]/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12]/)) {
                        audio_x.channels = r.match(/[12]/)[0] + '.0';
                    }
                } else if (r.match(/(Channels|声.*道).*:/i)) {
                    if (r.match(/[3-8]/)) {
                        audio_x.channels = (parseFloat(r.match(/[3-8]/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12]/)) {
                        audio_x.channels = r.match(/[12]/)[0] + '.0';
                    }
                } else if (r.match(/(Language|语言).*:/i) && (!r.match(/PGS/i) || r.match(audio_x.format))) {
                    if (r.match(/(Cantonese|粤语)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    } else if (r.match(/(Chinese|国语)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    let key = 'audio' + i;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                } else if (r.match(/(Language|字.*幕)/i)) {
                    console.log(r);
                    if (r.match(/(Chinese|中)/i)) {
                        TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                    }
                    if (r.match(/(English|英)/i)) {
                        TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                    }
                }
            })
        } else if (infosp.match(/General\sInformation/i)) {
            console.log('HHWEB CHDWEB HDS ADWEB OurTV PbK');
            match = infosp.split('\n');
            let i = 1;
            match.forEach((r) => {
                if (r.match(/(帧.*率|Frame.?Rate).*/i)) {
                    console.log(r);
                    if (r.match(/(帧.*率|Frame.?Rate).*23.*/i)) {
                        TORRENT_INFO.mediainfo.video.fps = '24FPS';
                    } else if (r.match(/(帧.*率|Frame.?Rate).*24.*/i)) {
                        TORRENT_INFO.mediainfo.video.fps = '24FPS';
                    } else if (r.match(/(帧.*率|Frame.?Rate).*25.*/i)) {
                        TORRENT_INFO.mediainfo.video.fps = '25FPS';
                    } else if (r.match(/(帧.*率|Frame.?Rate).*59.*/i)) {
                        TORRENT_INFO.mediainfo.video.fps = '60FPS';
                    } else if (r.match(/(帧.*率|Frame.?Rate).*119.*/i)) {
                        TORRENT_INFO.mediainfo.video.fps = '120FPS';
                    } else {
                        TORRENT_INFO.mediainfo.video.fps = r.match(/[0-9]{2,3}(?=\.)/)[0] + 'FPS';
                    }
                }
                if (r.match(/(分.*辨.*率|RESOLUTION.*:).*/i)) {
                    r = r.replace(/\s/g, '');
                    console.log(r);
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                }
                if (r.match(/(视频信息|VIDEO.CODEC).*/i) && !TORRENT_INFO.titleinfo.group.match(/ADWeb/i) && !TORRENT_INFO.titleinfo.group.match(/OurTV/i)) {
                    if (r.match(/x264/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x264';
                    } else if (r.match(/x265/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x265';
                    } else if (r.match(/HEVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    } else if (r.match(/AVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                    } else if (r.match(/MPEG-2/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'MPEG-2';
                    }
                    if (r.match(/Dolby Vision/i)) {
                        TORRENT_INFO.mediainfo.video.dv = true;
                    }
                    if (r.match(/Main\s?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                    if (r.match(/HDR10\+/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10+';
                        TORRENT_INFO.results.hdr = 'HDR10+';
                    } else if (r.match(/HDR\sVivid/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR Vivid';
                        TORRENT_INFO.results.hdr = 'HDR Vivid';
                    } else if (r.match(/HDR10/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                        TORRENT_INFO.results.hdr = 'HDR10';
                    }
                }
                if (r.match(/(HDR.Format|HDR\siNFO).*/i)) {
                    if (r.match(/HDR10\+/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10+';
                        TORRENT_INFO.results.hdr = 'HDR10+';
                    } else if (r.match(/HDR Vivid/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR Vivid';
                        TORRENT_INFO.results.hdr = 'HDR Vivid';
                    } else if (r.match(/HDR10/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                        TORRENT_INFO.results.hdr = 'HDR10';
                    }
                    if (r.match(/Dolby Vision/i)) {
                        TORRENT_INFO.mediainfo.video.dv = true;
                    }
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(Chinese|Simplified|Traditional|中文|中上英下|简体|CHS|CHT|zh)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(\[en\]|English|英|ENG)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                if (r.match(/(音.*轨|Audio.*:).*/i)) {
                    r = r.replace('(', '').replace(')', '');
                    console.log(r);
                    let audio_x = {
                        format: '',
                        channels: '',
                        object: '',
                    };
                    if (r.match(/(Cantonese|粤|粵)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    } else if (r.match(/(Chinese|Mandarin|国语|普通话)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    if (r.match(/TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS-HD MA/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/PCM/i)) {
                        audio_x.format = 'LPCM';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/(E-AC-3|Dolby Digital Plus|AC3\+|DDP)/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/(AC3|AC-3|DD|Dolby Digital)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (r.match(/Atmos/i)) {
                        audio_x.object = 'Atmos';
                    }
                    r = r.replace(/(?<=channels).*/i, '').replace(/kb\/s/i, '');
                    if (r.match(/[1-7]\.[01]/)) {
                        audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                    } else if (r.match(/[3-8]\s?channels/)) {
                        audio_x.channels = (parseFloat(r.match(/[3-8](?=\s?channels)/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12]\s?channels/)) {
                        audio_x.channels = r.match(/[12](?=\s?channels)/)[0] + '.0';
                    }
                    let key = 'audio' + i;
                    i++;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            })
        } else if (infosp.match(/\[RELEASE INFORMATION\]/i)) {
            console.log('beAst BeiTai');
            match = infosp.split('\n');
            let i = 1;
            match.forEach((r) => {
                if (r.match(/帧.*率.*23.976.*/)) {
                    TORRENT_INFO.mediainfo.video.fps = '24FPS';
                }
                if (r.match(/(分.*辨.*率|RESOLUTION).*/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                    if (TORRENT_INFO.mediainfo.video.width > 3000) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                    }
                }
                if (r.match(/(视频信息|VIDEO.CODEC).*/i)) {
                    if (r.match(/x264/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x264';
                    } else if (r.match(/x265/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x265';
                    } else if (r.match(/HEVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    }
                    if (r.match(/Main ?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                }
                if (r.match(/(视频信息|VIDEO.CODEC).*/i)) {
                    if (r.match(/x264/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x264';
                    } else if (r.match(/x265/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x265';
                    } else if (r.match(/HEVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    }
                    if (r.match(/Main ?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                }
                if (r.match(/HDR.*Dolby Vision/i)) {
                    TORRENT_INFO.mediainfo.video.dv = true;
                }
                if (r.match(/(字.*幕|Subtitle).*(Chs|Cht|简)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/(字.*幕|Subtitle).*(Eng|英)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                if (r.match(/Audio.*kbps.*/i)) {
                    console.log(r);
                    let audio_x = {
                        format: '',
                        channels: '',
                        object: '',
                    };
                    if (r.match(/(Mandarin|国语)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    if (r.match(/(Cantonese|粤语)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    }
                    if (r.match(/TrueHD.*Atmos/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS:X Master Audio/i)) {
                        audio_x.format = 'DTS:X';
                    } else if (r.match(/DTS-HD Master Audio/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/E-AC-3/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/(AC3|DD|Dolby Digital Audio)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (r.match(/Atmos/i)) {
                        audio_x.object = 'Atmos';
                    }
                    if (r.match(/[1-7]\.[01]/)) {
                        audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                    } else if (r.match(/[1-6] channels/)) {
                        audio_x.channels = (parseFloat(r.match(/[1-6](?= channels)/)[0]) - 1 + 0.1).toString();
                    }
                    let key = 'audio' + i;
                    i++;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            })
        } else if (infosp.match(/FRDS/i)) {//
            console.log('MNHD-FRDS mUHD-FRDS cXcY@FRDS(MNHD-FRDS|mUHD-FRDS|cXcY@FRDS)');
            match = infosp.split('\n');
            let i = 1;
            match.forEach((r) => {
                if (r.match(/帧.*率.*23.976.*/)) {
                    TORRENT_INFO.mediainfo.video.fps = '24FPS';
                }
                if (r.match(/(分.*辨.*率|RESOLUTION).*/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                }
                if (r.match(/ViDEO BiTRATE.*/i)) {
                    if (r.match(/x264/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x264';
                    } else if (r.match(/x265/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x265';
                    } else if (r.match(/HEVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    } else if (r.match(/AVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                    }
                    if (r.match(/Dolby Vision/i)) {
                        TORRENT_INFO.mediainfo.video.dv = true;
                    }
                    if (r.match(/HDR10/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                    }
                    if (r.match(/Main\s?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                }
                if (r.match(/HDR.Format.*HDR10\+?/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = true;
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(Chinese|中文|中上英下|简体|CHS|CHT|zh)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(English|英文|ENG)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                if (r.match(/(音.*轨|Audio.*:).*/i)) {
                    console.log(r);
                    let audio_x = {
                        format: '',
                        channels: '',
                        object: '',
                    };
                    if (r.match(/(Chinese|Mandarin|国语)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    if (r.match(/(Cantonese|粤语)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    }
                    if (r.match(/Dolby TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS-HD MA/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/(E-AC3|Dolby Digital Plus|DDP)/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/(AC3|DD|Dolby Digital)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (r.match(/Atmos/i)) {
                        audio_x.object = 'Atmos';
                    }
                    if (r.match(/[1-7]\.[01]/)) {
                        audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                    } else if (r.match(/[3-8] channels/)) {
                        audio_x.channels = (parseFloat(r.match(/[3-8](?= channels)/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12] channels/)) {
                        audio_x.channels = r.match(/[1-6](?= channels)/)[0] + '.0';
                    }
                    let key = 'audio' + i;
                    i++;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            })
        } else if (infosp.match(/(QHstudIo小组作品NFO信息|【出品小组】)/i)) {
            console.log('QHstudIo');
            match = infosp.split('\n');
            let i = 1;
            match.forEach((r) => {
                if (r.match(/视频帧率.*23/)) {
                    TORRENT_INFO.mediainfo.video.fps = '24FPS';
                } else if (r.match(/视频帧率.*29/)) {
                    TORRENT_INFO.mediainfo.video.fps = '30FPS';
                } else if (r.match(/视频帧率.*59/)) {
                    TORRENT_INFO.mediainfo.video.fps = '60FPS';
                } else if (r.match(/视频帧率/)) {
                    TORRENT_INFO.mediainfo.video.fps = r.match(/[0-9]{2,3}(?=\.)/i)[0] + 'FPS';
                }
                if (r.match(/视频像素/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                }
                if (r.match(/视频编码/i)) {
                    if (r.match(/HEVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    } else if (r.match(/AVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                    }
                    if (r.match('Main 10')) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                    if (r.match(/Dolby Vision/i)) {
                        TORRENT_INFO.mediainfo.video.dv = true;
                    }
                    if (r.match(/HDR\sVivid/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR Vivid';
                        TORRENT_INFO.results.hdr = 'HDR Vivid';
                    } else if (r.match(/HDR10/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                        TORRENT_INFO.results.hdr = 'HDR10';
                    } else if (r.match(/HLG/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HLG';
                        TORRENT_INFO.results.hdr = 'HLG';
                    }
                }
                if (r.match(/视频比特.*10/i)) {
                    TORRENT_INFO.mediainfo.video.bitdepth = '10';
                }
                if (r.match(/HDR.Format.*HDR10\+?/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = true;
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(Chinese|中文|中上英下|简体|CHS|CHT|zh)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(English|英文|ENG)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                if (r.match(/音频编码/i)) {
                    r = r.replace(/,.*kHz,/, '');
                    console.log(r);
                    let audio_x = {
                        format: '',
                        channels: '',
                        object: '',
                    };
                    if (r.match(/(国语|普通话|zh)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    if (r.match(/(Cantonese|粤语|yue)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    }
                    if (r.match(/Dolby TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS-HD MA/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS Express/i)) {
                        audio_x.format = 'DTSE';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/(E-AC-3|Dolby Digital Plus)/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/(AC3|DD|Dolby Digital)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (r.match(/Atmos/i)) {
                        audio_x.object = 'Atmos';
                    }
                    r = r.replace(/(\.0)?.kb\/s/i, '');
                    if (r.match(/[1-7]\.[01]/)) {
                        audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                    } else if (r.match(/[3-8]\schannel\(s\)/)) {//6 channel(s)
                        audio_x.channels = (parseFloat(r.match(/[3-8](?=\schannel\(s\))/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12]\schannel\(s\)/)) {
                        audio_x.channels = r.match(/[1-6](?=\schannel\(s\))/)[0] + '.0';
                    }
                    let key = 'audio' + i;
                    i++;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            })
        } else if (infosp.match(/【制作团队】.*(NGB|HDCTV)/i)) {
            console.log('NGB HDCTV');
            match = infosp.split('\n');
            let i = 1;
            match.forEach((r) => {
                if (r.match(/【帧.*?率】.*23/)) {
                    TORRENT_INFO.mediainfo.video.fps = '24FPS';
                } else if (r.match(/【帧.*?率】.*29/)) {
                    TORRENT_INFO.mediainfo.video.fps = '30FPS';
                } else if (r.match(/【帧.*?率】.*59/)) {
                    TORRENT_INFO.mediainfo.video.fps = '60FPS';
                } else if (r.match(/【帧.*?率】/)) {
                    TORRENT_INFO.mediainfo.video.fps = r.match(/[0-9]{2,3}(?=\.)/i)[0] + 'FPS';
                }
                if (r.match(/【视频尺寸】/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                    TORRENT_INFO.mediainfo.video.scantype = r.match(/p|i/);
                }
                if (r.match(/【视频编码】/i)) {
                    if (r.match(/HEVC|H.265/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    } else if (r.match(/AVC|H.264/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                    }
                    if (r.match('Main 10')) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                    if (r.match(/Dolby Vision/i)) {
                        TORRENT_INFO.mediainfo.video.dv = true;
                    }
                    if (r.match(/HDR\sVivid/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR Vivid';
                        TORRENT_INFO.results.hdr = 'HDR Vivid';
                    } else if (r.match(/HDR10/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                        TORRENT_INFO.results.hdr = 'HDR10';
                    } else if (r.match(/HLG/i)) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HLG';
                        TORRENT_INFO.results.hdr = 'HLG';
                    }
                }
                if (r.match(/HDR.Format.*HDR10\+?/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = true;
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(Chinese|中文|中上英下|简体|CHS|CHT|zh)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/(字.*幕|Subtitle)s?.*(English|英文|ENG)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                if (r.match(/【音频编码】/i)) {
                    console.log(r);
                    let audio_x = {
                        format: '',
                        channels: '',
                        object: '',
                    };
                    if (r.match(/(国语|普通话|zh)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    if (r.match(/(Cantonese|粤语|yue)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    }
                    if (r.match(/Dolby TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS-HD MA/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS Express/i)) {
                        audio_x.format = 'DTSE';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/(E-AC-3|Dolby Digital Plus)/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/(AC3|DD|Dolby Digital)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (r.match(/Atmos/i)) {
                        audio_x.object = 'Atmos';
                    }
                    r = r.replace(/(\.0)?.kb\/s/i, '');
                    if (r.match(/[1-7]\.[01]/)) {
                        audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                    } else if (r.match(/[3-8]\schannel\(s\)/)) {//6 channel(s)
                        audio_x.channels = (parseFloat(r.match(/[3-8](?=\schannel\(s\))/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12]\schannel\(s\)/)) {
                        audio_x.channels = r.match(/[1-6](?=\schannel\(s\))/)[0] + '.0';
                    }
                    let key = 'audio' + i;
                    i++;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            })
        } else if (infosp.match(/\.Release\.Info/i)) {
            console.log('HDH WiKi PTH');
            match = infosp.split('\n');
            let i = 1;
            match.forEach((r) => {
                if (r.match(/帧.*率.*23.976.*/)) {
                    TORRENT_INFO.mediainfo.video.fps = '24FPS';
                }
                if (r.match(/(分.*辨.*率|RESOLUTION).*/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                    if (TORRENT_INFO.mediainfo.video.width > 3000) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                    }
                }
                if (r.match(/(视频信息|VIDEO.CODEC|ViDEO BiTRATE).*/i)) {//HDH:ViDEO BiTRATE
                    if (r.match(/x264/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x264';
                    } else if (r.match(/x265/i) && TORRENT_INFO.titleinfo.group == 'HDH' && TORRENT_INFO.titleinfo.remux == true) {
                        //console.log('HDH x265')
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    } else if (r.match(/x265/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x265';
                    } else if (r.match(/AVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                    } else if (r.match(/HEVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    }
                    if (r.match(/Main ?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                }
                if (r.match(/HDR.*Dolby Vision/i)) {
                    TORRENT_INFO.mediainfo.video.dv = true;
                }
                if (r.match(/HDR.*HDR10\+/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = 'HDR10+';
                    TORRENT_INFO.results.hdr = 'HDR10+';
                } else if (r.match(/HDR.*HDR10/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                    TORRENT_INFO.results.hdr = 'HDR10';
                }
                if (r.match(/(字.*幕|Subtitle).*(Chinese|CHS|CHT|简体|简中)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/(字.*幕|Subtitle).*(English|英|eng)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                if (r.match(/Audio.*(kbps|Mbps).*/i)) {
                    console.log(r);
                    let audio_x = {
                        format: '',
                        channels: '',
                        object: '',
                    };
                    if (r.match(/(Cantonese|粤语|粤配)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    } else if (r.match(/(Mandarin|国语|Chinese)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    if (r.match(/TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS:X Master Audio/i)) {
                        audio_x.format = 'DTS:X';
                    } else if (r.match(/DTS-HD ?(Master Audio|MA)/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/E-AC-3/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/(AC3|DD|Dolby Digital Audio)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (r.match(/Atmos/i)) {
                        audio_x.object = 'Atmos';
                    }
                    if (r.match(/[1-7]\.[01]/)) {
                        audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                    } else if (r.match(/[3-8] channels/)) {
                        audio_x.channels = (parseFloat(r.match(/[3-8](?= channels)/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12] channels/)) {
                        audio_x.channels = r.match(/[1-6](?= channels)/)[0] + '.0';
                    }
                    let key = 'audio' + i;
                    i++;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            })
        } else if (infosp.match(/ENCODER.*@.?CHD/i)) {//CHD
            console.log('CHD');
            match = infosp.split('\n');
            let i = 1;
            match.forEach((r) => {
                if (r.match(/(分.*辨.*率|RESOLUTION).*/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                }
                if (r.match(/(视频信息|VIDEO.CODEC|ViDEO BiTRATE).*/i)) {//HDH:ViDEO BiTRATE
                    if (r.match(/x264/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x264';
                    } else if (r.match(/x265/i) && TORRENT_INFO.titleinfo.group == 'HDH' && TORRENT_INFO.titleinfo.remux == true) {
                        //console.log('HDH x265')
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    } else if (r.match(/x265/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x265';
                    } else if (r.match(/AVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                    } else if (r.match(/HEVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    }
                    if (r.match(/Main ?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                }
                if (r.match(/HDR.*Dolby Vision/i)) {
                    TORRENT_INFO.mediainfo.video.dv = true;
                }
                if (r.match(/HDR.*HDR10\+/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = 'HDR10+';
                    TORRENT_INFO.results.hdr = 'HDR10+';
                } else if (r.match(/HDR.*HDR10/i)) {
                    TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                    TORRENT_INFO.results.hdr = 'HDR10';
                }
                if (r.match(/(字.*幕|Subtitle).*(Chinese|CHS|CHT)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/(字.*幕|Subtitle).*(English|英|eng)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                if (r.match(/Audio.*kb\/s.*/i)) {
                    console.log(r);
                    let audio_x = {
                        format: '',
                        channels: '',
                        object: '',
                    };
                    if (r.match(/(Cantonese|粤语|粤配)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    } else if (r.match(/(Mandarin|国语|Chinese)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    if (r.match(/TrueHD.*Atmos/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS:X Master Audio/i)) {
                        audio_x.format = 'DTS:X';
                    } else if (r.match(/DTS-HD ?(Master Audio|MA)/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/E-AC-3/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/(AC3|DD|Dolby Digital Audio)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (r.match(/Atmos/i)) {
                        audio_x.object = 'Atmos';
                    }
                    if (r.match(/[1-7]\.[01]/)) {
                        audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                    } else if (r.match(/[3-8] channels/)) {
                        audio_x.channels = (parseFloat(r.match(/[3-8](?= channels)/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12] channels/)) {
                        audio_x.channels = r.match(/[1-6](?= channels)/)[0] + '.0';
                    }
                    let key = 'audio' + i;
                    i++;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            })
        } else if (infosp.match(/Video/i) && infosp.match(/Audio/i) && infosp.match(/Subtitle/i)) {//其他尝试性解析 DBTV CHD PuTao
            console.log('其他尝试性解析');
            match = infosp.split('\n');
            let i = 1;
            match.forEach((r) => {
                if (r.match(/帧.*率.*23.976.*/)) {
                    TORRENT_INFO.mediainfo.video.fps = '24FPS';
                }
                if (r.match(/(分.*辨.*率|RESOLUTION).*/i)) {
                    match = r.match(/[0-9]{3,4}/g);
                    TORRENT_INFO.mediainfo.video.width = parseInt(match[0]);
                    TORRENT_INFO.mediainfo.video.height = parseInt(match[1]);
                    if (TORRENT_INFO.mediainfo.video.width > 3000) {
                        TORRENT_INFO.mediainfo.video.hdr = 'HDR10';
                    }
                }
                if (r.match(/(视频信息|VIDEO.CODEC).*/i)) {
                    if (r.match(/x264/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x264';
                    } else if (r.match(/x265/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x265';
                    } else if (r.match(/HEVC/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                    }
                    if (r.match(/Main ?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                }
                //尝试1
                if (r.match(/ViDEO.BiTRATE.*/i)) {
                    if (r.match(/x264/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'AVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x264';
                    } else if (r.match(/x265/i)) {
                        TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        TORRENT_INFO.mediainfo.video.codec = 'x265';
                    } else if (r.match(/HEVC/i)) {
                        if (TORRENT_INFO.titleinfo.group.match(/DBTV/)) {
                            TORRENT_INFO.mediainfo.video.format = '';
                        } else {
                            TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        }
                    }
                    if (r.match(/Main ?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                } else if (r.match(/Video.*at.*/i)) {
                    TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    if (r.match(/HEVC/i)) {
                        if (TORRENT_INFO.titleinfo.group.match(/DBTV/)) {
                            TORRENT_INFO.mediainfo.video.format = '';
                        } else {
                            TORRENT_INFO.mediainfo.video.format = 'HEVC';
                        }
                    } else if (r.match(/AVC/i)) {
                        if (TORRENT_INFO.titleinfo.group.match(/DBTV/)) {
                            TORRENT_INFO.mediainfo.video.format = '';
                        } else {
                            TORRENT_INFO.mediainfo.video.format = 'AVC';
                        }
                    }
                    if (r.match(/(Mb|kb)\/s/i)) {
                        TORRENT_INFO.mediainfo.video.bitrates = parseFloat(r.match(/(?<=at ).*(?= (Mb|kb)\/s)/i)[0]) * 1024;
                    }
                    if (r.match(/Main ?10/i)) {
                        TORRENT_INFO.mediainfo.video.bitdepth = '10';
                    }
                }
                if (r.match(/HDR.*Dolby Vision/i)) {
                    TORRENT_INFO.mediainfo.video.dv = true;
                } else if (/x265\s\[info\]:.*Dolby Vision/) {
                    TORRENT_INFO.mediainfo.video.dv = true;
                }
                if (r.match(/(字.*幕|Subtitles?).*(Chinese|CHS|CHT|zh|chi)/i)) {
                    TORRENT_INFO.mediainfo.hasChineseSubtitles = true;
                }
                if (r.match(/(字.*幕|Subtitles?).*(English|英|eng|PGS\/en)/i)) {
                    TORRENT_INFO.mediainfo.hasEnglishSubtitles = true;
                }
                //                 if (r.match(/Audio.*(kbps|Mbps).*/i)) {
                //                     console.log(r);
                //                     let audio_x = {
                //                         format: '',
                //                         channels: '',
                //                         object: '',
                //                     };
                //                     if (r.match(/(Mandarin|国语|Chinese)/i)) {
                //                         TORRENT_INFO.mediainfo.hasMandarin = true;
                //                     }
                //                     if (r.match(/(Cantonese|粤语)/i)) {
                //                         TORRENT_INFO.mediainfo.hasCantonese = true;
                //                     }
                //                     if (r.match(/TrueHD/i)) {
                //                         audio_x.format = 'TrueHD';
                //                     } else if (r.match(/DTS:X Master Audio/i)) {
                //                         audio_x.format = 'DTS:X';
                //                     } else if (r.match(/DTS-HD (Master Audio|MA)/i)) {
                //                         audio_x.format = 'DTS-HD MA';
                //                     } else if (r.match(/FLAC/i)) {
                //                         audio_x.format = 'FLAC';
                //                     } else if (r.match(/DTS/i)) {
                //                         audio_x.format = 'DTS';
                //                     } else if (r.match(/AAC/i)) {
                //                         audio_x.format = 'AAC';
                //                     } else if (r.match(/E-AC-3/i)) {
                //                         audio_x.format = 'DDP';
                //                     } else if (r.match(/(AC3|DD|Dolby Digital Audio)/i)) {
                //                         audio_x.format = 'DD';
                //                     }
                //                     if (r.match(/Atmos/i)) {
                //                         audio_x.object = 'Atmos';
                //                     }
                //                     if (audio_x.object = 'Atmos') {
                //                         audio_x.channels = '7.1';
                //                     } else if (r.match(/[1-7]\.[01]/)) {
                //                         audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                //                     } else if (r.match(/[1-6] channels/)) {
                //                         audio_x.channels = (parseFloat(r.match(/[1-6](?= channels)/)[0]) - 1 + 0.1).toString();
                //                     }
                //                     let key = 'audio' + i;
                //                     i++;
                //                     TORRENT_INFO.mediainfo.audios[key] = audio_x;
                //                 }
                //尝试2
                if (r.match(/Audio.*/i)) {
                    r = r.replace('(', '').replace(')', '')
                    console.log(r);
                    let audio_x = {
                        format: '',
                        channels: '',
                        object: '',
                    };
                    if (r.match(/(Mandarin|国语|Chinese)/i)) {
                        TORRENT_INFO.mediainfo.hasMandarin = true;
                    }
                    if (r.match(/(Cantonese|粤语)/i)) {
                        TORRENT_INFO.mediainfo.hasCantonese = true;
                    }
                    if (r.match(/MLP FBA 16-ch/i)) {
                        audio_x.format = 'TrueHD';
                        audio_x.object = 'Atmos';
                    } else if (r.match(/TrueHD/i)) {
                        audio_x.format = 'TrueHD';
                    } else if (r.match(/DTS:X Master Audio/i)) {
                        audio_x.format = 'DTS:X';
                    } else if (r.match(/DTS-HD\s?(Master Audio|MA)/i) || r.match(/DTS\sXLL/i)) {
                        audio_x.format = 'DTS-HD MA';
                    } else if (r.match(/PCM/i)) {
                        audio_x.format = 'LPCM';
                    } else if (r.match(/FLAC/i)) {
                        audio_x.format = 'FLAC';
                    } else if (r.match(/DTS/i)) {
                        audio_x.format = 'DTS';
                    } else if (r.match(/AAC/i)) {
                        audio_x.format = 'AAC';
                    } else if (r.match(/E-AC-?3 JOC/i) || r.match(/Dolby Digital Plus with Dolby Atmos/i)) {
                        audio_x.format = 'DDP';
                        audio_x.object = 'Atmos';
                    } else if (r.match(/(E-AC-?3|Dolby Digital Plus)/i)) {
                        audio_x.format = 'DDP';
                    } else if (r.match(/(AC-?3|DD|Dolby Digital)/i)) {
                        audio_x.format = 'DD';
                    }
                    if (r.match(/Atmos/i)) {
                        audio_x.object = 'Atmos';
                    }
                    if (audio_x.object == 'Atmos' && audio_x.format == 'TrueHD') {
                        audio_x.channels = '7.1';
                    } else if (r.match(/[1-7]\.[01]/)) {
                        audio_x.channels = r.match(/[1-7]\.[01]/)[0];
                    } else if (r.match(/[3-8] channels/)) {
                        audio_x.channels = (parseFloat(r.match(/[3-8](?= channels)/)[0]) - 1 + 0.1).toString();
                    } else if (r.match(/[12] channels/)) {
                        audio_x.channels = r.match(/[12](?= channels)/)[0] + '.0';
                    }
                    let key = 'audio' + i;
                    i++;
                    TORRENT_INFO.mediainfo.audios[key] = audio_x;
                }
            })
        }
    }

    //逻辑：重要检查
    //逻辑：MediaInfo 检查
    if (TORRENT_INFO.bdinfo.full != '' && TORRENT_INFO.mediainfo.full == '') {
        //逻辑：标题媒介检查
        if (TORRENT_INFO.titleinfo.minibd) {
            //console.log('质量为 Encode');
            TORRENT_INFO.results.zhiliang = 'Encode';
        } else if (TORRENT_INFO.bdinfo.video.resolution == '2160p') {
            //console.log('质量为 UHD Discs');
            TORRENT_INFO.results.zhiliang = 'UHD';
            TORRENT_INFO.results.source = 'Blu-ray';
        } else if (TORRENT_INFO.bdinfo.video.resolution.match(/1080/)) {
            //console.log('质量为 BD Discs');
            TORRENT_INFO.results.zhiliang = 'BD';
            TORRENT_INFO.results.source = 'Blu-ray';
        } else {
            console.log('BDInfo 质量为 Unknown');
        }
        //逻辑：分辨率检查
        TORRENT_INFO.results.resolution = TORRENT_INFO.bdinfo.video.resolution;
        //逻辑：视频编码检查
        if (TORRENT_INFO.results.zhiliang == 'Encode') {
            if (TORRENT_INFO.bdinfo.video.format.match(/AVC/)) {
                //console.log('视频编码为 x264');
                TORRENT_INFO.results.vcodec = 'x264';
            } else if (TORRENT_INFO.bdinfo.video.format.match(/HEVC/)) {
                //console.log('视频编码为 x265');
                TORRENT_INFO.results.vcodec = 'x265';
            }
        } else {
            TORRENT_INFO.results.vcodec = TORRENT_INFO.bdinfo.video.format;
        }
        //逻辑：音频编码检查
    } else if (TORRENT_INFO.mediainfo.full != '' || infosp) {
        //逻辑：标题媒介检查
        if (TORRENT_INFO.titleinfo.remux) {
            //console.log('质量为 REMUX');
            TORRENT_INFO.results.zhiliang = 'REMUX';
        } else if (TORRENT_INFO.results.source == 'Blu-ray' && (TORRENT_INFO.mediainfo.video.codec.match(/(x264|x265)/i) || TORRENT_INFO.mediainfo.video.format == 'AV1')) {//TORRENT_INFO.titleinfo.source.match(/(Blu-?ray|DVD)/i)
//             if (false) {
//                 console.log('质量为 REMUX');
//                 TORRENT_INFO.results.zhiliang = 'REMUX';
//             } else {
                //console.log('质量为 Encode');
                TORRENT_INFO.results.zhiliang = 'Encode';
//            }
        } else if (TORRENT_INFO.results.source == 'Blu-ray' && TORRENT_INFO.titleinfo.group.match(/(FRDS|beAst|WScode|Dream|WiKi|CMCT|ANK-Raws|TLF|HDH$|HDS$)/i)) {//TORRENT_INFO.titleinfo.source.match(/(Blu-?ray|DVD)/i)
//             if (TORRENT_INFO.mediainfo.video.bitrates > 50000 && TORRENT_INFO.results.resolution > 1080) {
//                 console.log('质量可能为 REMUX');
//                 TORRENT_INFO.results.zhiliang = 'REMUX';
//             } else if (TORRENT_INFO.mediainfo.video.bitrates > 15600 && TORRENT_INFO.results.resolution <= 1080) {
//                 console.log('质量可能为 REMUX');
//                 TORRENT_INFO.results.zhiliang = 'REMUX';
//             } else {
                //console.log('质量为 Encode');
                TORRENT_INFO.results.zhiliang = 'Encode';
//            }
        } else if (TORRENT_INFO.results.source == 'WEB-DL' && TORRENT_INFO.titleinfo.group.match(/(FRDS)/i)) {//TORRENT_INFO.titleinfo.source.match(/(Blu-?ray|DVD)/i)
            //console.log('质量为 Encode');
            TORRENT_INFO.results.zhiliang = 'Encode';
        } else if (TORRENT_INFO.results.source == 'WEB-DL') {//TORRENT_INFO.titleinfo.source.match(/(Blu-?ray|DVD)/i)
            //console.log('质量为 WEB-DL');
            TORRENT_INFO.results.zhiliang = 'WEB-DL';
        } else if (TORRENT_INFO.results.source == 'WEBRip') {//TORRENT_INFO.titleinfo.source.match(/(Blu-?ray|DVD)/i)
            //console.log('质量为 Encode');
            TORRENT_INFO.results.zhiliang = 'Encode';
        } else if (TORRENT_INFO.results.source == 'HDTVRip') {//TORRENT_INFO.titleinfo.source.match(/(Blu-?ray|DVD)/i)
            //console.log('质量为 Encode');
            TORRENT_INFO.results.zhiliang = 'Encode';
        } else if (TORRENT_INFO.results.source == 'HDTV') {//TORRENT_INFO.titleinfo.source.match(/(Blu-?ray|DVD)/i)
            //console.log('质量为 HDTV');
            TORRENT_INFO.results.zhiliang = 'HDTV';
        } else if (TORRENT_INFO.results.source == 'DVDRip' || (TORRENT_INFO.mediainfo.video.codec.match(/(Xvid|DivX)/i))) {//TORRENT_INFO.titleinfo.source.match(/(Blu-?ray|DVD)/i)
            //console.log('质量为 Encode');
            TORRENT_INFO.results.zhiliang = 'Encode';
        } else if (TORRENT_INFO.results.source == 'DVD') {//TORRENT_INFO.titleinfo.source.match(/(Blu-?ray|DVD)/i)
            //console.log('质量为 DVD');
            TORRENT_INFO.results.zhiliang = 'DVD';
        } else {
            console.log('MediaInfo 质量为 Unknown');
        }
        //逻辑：视频编码检查
        if (TORRENT_INFO.mediainfo.video.format == 'MPEG-2') {
            //console.log('视频编码为 MPEG2');
            TORRENT_INFO.results.vcodec = 'MPEG-2';
        } else if (TORRENT_INFO.mediainfo.video.codec == 'XviD') {
            //console.log('视频编码为 XviD');
            TORRENT_INFO.results.vcodec = 'XviD';
        } else if (TORRENT_INFO.mediainfo.video.format.match(/AV1/)) {
            //console.log('视频编码为 AV1');
            TORRENT_INFO.results.vcodec = 'AV1';
        } else if (TORRENT_INFO.mediainfo.video.format.match(/VP9/i)) {
            //console.log('视频编码为 VP9');
            TORRENT_INFO.results.vcodec = 'VP9';
        } else if (TORRENT_INFO.mediainfo.video.format.match(/VC-1/)) {
            //console.log('视频编码为 VC-1');
            TORRENT_INFO.results.vcodec = 'VC-1';
        } else if (TORRENT_INFO.results.zhiliang == 'REMUX') {
            if (TORRENT_INFO.mediainfo.video.format.match(/AVC/)) {
                //console.log('视频编码为 AVC');
                TORRENT_INFO.results.vcodec = 'AVC';
            } else if (TORRENT_INFO.mediainfo.video.format.match(/HEVC/)) {
                //console.log('视频编码为 HEVC');
                TORRENT_INFO.results.vcodec = 'HEVC';
            } else if (TORRENT_INFO.mediainfo.video.format.match(/VC-1/)) {
                //console.log('视频编码为 VC-1');
                TORRENT_INFO.results.vcodec = 'VC-1';
            }
        } else if (TORRENT_INFO.results.zhiliang == 'Encode') {
            if (TORRENT_INFO.mediainfo.video.format.match(/AVC/) || TORRENT_INFO.mediainfo.video.codec.match(/x264/)) {
                //console.log('视频编码为 x264');
                TORRENT_INFO.results.vcodec = 'x264';
            } else if (TORRENT_INFO.mediainfo.video.format.match(/HEVC/) || TORRENT_INFO.mediainfo.video.codec.match(/x265/)) {
                //console.log('视频编码为 x265');
                TORRENT_INFO.results.vcodec = 'x265';
            }
        } else if (TORRENT_INFO.mediainfo.video.codec.match(/(x264|x265|Xvid)/i)) {
            //console.log(`视频编码为 ${TORRENT_INFO.mediainfo.video.codec}`);
            TORRENT_INFO.results.vcodec = TORRENT_INFO.mediainfo.video.codec;
        } else if (TORRENT_INFO.mediainfo.video.format.match(/AVC/)) {
            //console.log('视频编码为 H264');
            TORRENT_INFO.results.vcodec = 'H264';
        } else if (TORRENT_INFO.mediainfo.video.format.match(/HEVC/)) {
            //console.log('视频编码为 H265');
            TORRENT_INFO.results.vcodec = 'H265';
        } else if (false) {//(TORRENT_INFO.mediainfo.video.format.match(/MPEG/)) {
            //console.log('视频编码为 MPEG2');
            TORRENT_INFO.results.vcodec = 'MPEG-2';
        } else {
            error.push( `MediaInfo 视频编码为 ${TORRENT_INFO.mediainfo.video.format}`)
            console.log(`MediaInfo 视频编码为 ${TORRENT_INFO.mediainfo.video.format}`);
        }
        //逻辑：音频编码检查
        //逻辑：分辨率检查
        var minusresult = TORRENT_INFO.mediainfo.video.width - TORRENT_INFO.mediainfo.video.height;
        //console.log(minusresult);
        if (TORRENT_INFO.mediainfo.video.width < TORRENT_INFO.mediainfo.video.height) {
            minusresult = 0 - minusresult;
            console.log(`竖屏短剧宽小于高 ${minusresult}`);
        }
        //         if (TORRENT_INFO.mediainfo.video.height == 1080 && (TORRENT_INFO.mediainfo.video.scantype == 'Interlaced' || TORRENT_INFO.mediainfo.video.scantype == 'MBAFF')) {
        //             console.log('分辨率为 1080i');
        //             TORRENT_INFO.results.resolution = '1080i';
        //         } else if (minusresult > (4096 - 1592)) {
        //             console.log('分辨率为 4320p');
        //             TORRENT_INFO.results.resolution = '4320p';
        //         } else if (minusresult > (1920 - 696) || (TORRENT_INFO.mediainfo.video.width > TORRENT_INFO.mediainfo.video.height && TORRENT_INFO.mediainfo.video.height == 2160)) {
        //             console.log('分辨率为 2160p');
        //             TORRENT_INFO.results.resolution = '2160p';
        //         } else if (minusresult > (1280 - 528) || (TORRENT_INFO.mediainfo.video.width > TORRENT_INFO.mediainfo.video.height && TORRENT_INFO.mediainfo.video.height == 1080)) {
        //             console.log('分辨率为 1080p');
        //             TORRENT_INFO.results.resolution = '1080p';
        //         } else if (minusresult > (1024 - 520) || (TORRENT_INFO.mediainfo.video.width > 1260 && TORRENT_INFO.mediainfo.video.width <= 1280) || TORRENT_INFO.mediainfo.video.height == 720) {
        //             console.log('分辨率为 720p');
        //             TORRENT_INFO.results.resolution = '720p';
        //         } else if (TORRENT_INFO.mediainfo.video.height > 480 && TORRENT_INFO.mediainfo.video.height <= 576) {
        //             console.log('分辨率为 576p');
        //             TORRENT_INFO.results.resolution = '576p';
        //         } else if (TORRENT_INFO.mediainfo.video.height > 350 && TORRENT_INFO.mediainfo.video.height <= 480) {
        //             console.log('分辨率为 480p');
        //             TORRENT_INFO.results.resolution = '480p';
        //         } else {
        //             console.log(`MediaInfo 分辨率为 ${TORRENT_INFO.titleinfo.resolution}?`);
        //         }
        if (minusresult > (4096 - 1248)) {
            //console.log('分辨率为 4320p');
            TORRENT_INFO.results.resolution = '4320';
        } else if (minusresult > (1920 - 672) || (TORRENT_INFO.mediainfo.video.width > TORRENT_INFO.mediainfo.video.height && TORRENT_INFO.mediainfo.video.height == 2160)) {
            //console.log('分辨率为 2160p');
            TORRENT_INFO.results.resolution = '2160';
        } else if (minusresult > (1280 - 480) || (TORRENT_INFO.mediainfo.video.width > TORRENT_INFO.mediainfo.video.height && TORRENT_INFO.mediainfo.video.height == 1080)) {
            //console.log('分辨率为 1080');
            TORRENT_INFO.results.resolution = '1080';
        } else if (minusresult > (1024 - 520) || (TORRENT_INFO.mediainfo.video.width > 1260 && TORRENT_INFO.mediainfo.video.width <= 1280) || TORRENT_INFO.mediainfo.video.height == 720) {
            //console.log('分辨率为 720p');
            TORRENT_INFO.results.resolution = '720';
        } else if (TORRENT_INFO.mediainfo.video.height > 480 && TORRENT_INFO.mediainfo.video.height <= 576) {
            //console.log('分辨率为 576p');
            TORRENT_INFO.results.resolution = '576';
        } else if (TORRENT_INFO.mediainfo.video.height > 350 && TORRENT_INFO.mediainfo.video.height <= 480) {
            //console.log('分辨率为 480p');
            TORRENT_INFO.results.resolution = '480';
        } else {
            //console.log(`MediaInfo 分辨率为 ${TORRENT_INFO.titleinfo.resolution}?`);
        }
        if (TORRENT_INFO.mediainfo.full != '' && TORRENT_INFO.results.resolution != '') {
            if (TORRENT_INFO.mediainfo.video.scantype.match(/(Interlaced|MBAFF|隔行扫描)/i)) {
                TORRENT_INFO.results.resolution += 'i';
            } else {
                TORRENT_INFO.results.resolution += 'p';
            }
        } else if (TORRENT_INFO.results.resolution != '') {
            if (TORRENT_INFO.results.source == 'HDTV' && TORRENT_INFO.results.resolution != '2160') {
                TORRENT_INFO.results.resolution += 'i';
            } else {
                TORRENT_INFO.results.resolution += 'p';
            }
        }
    }
    //逻辑：类型
    //     if (TORRENT_INFO.descrinfo.category == '纪录片') {
    //         TORRENT_INFO.results.category = '纪录片';
    //     } else if (TORRENT_INFO.tableinfo.subtitle.match('演唱会')) {
    //         TORRENT_INFO.results.category = '舞台演出';
    //     } else if (TORRENT_INFO.descrinfo.category == '动画') {
    //         TORRENT_INFO.results.category = '动画';
    //     } else if (TORRENT_INFO.descrinfo.category == '综艺') {
    //         TORRENT_INFO.results.category = '综艺';
    //     } else if (TORRENT_INFO.descrinfo.chapters != '' || TORRENT_INFO.tableinfo.subtitle.match(/短剧/) || TORRENT_INFO.tableinfo.chapter2 != '') {
    //         TORRENT_INFO.results.category = '电视剧';
    //     } else if (TORRENT_INFO.descrinfo.category != '') {
    //         TORRENT_INFO.results.category = '电影';
    //     }
    if (TORRENT_INFO.descrinfo.categorys.indexOf('纪录片') != -1) {
        TORRENT_INFO.results.category = '纪录片';
    } else if (TORRENT_INFO.tableinfo.subtitle.match('演唱会')) {
        TORRENT_INFO.results.category = '舞台演出';
    } else if (TORRENT_INFO.descrinfo.categorys.indexOf('动画') != -1) {
        TORRENT_INFO.results.category = '动画';
    } else if (TORRENT_INFO.descrinfo.categorys.indexOf('综艺') != -1 || TORRENT_INFO.descrinfo.categorys.indexOf('真人秀') != -1 || TORRENT_INFO.descrinfo.categorys.indexOf('脱口秀') != -1) {
        TORRENT_INFO.results.category = '综艺';
    } else if (TORRENT_INFO.descrinfo.chapters != '' || TORRENT_INFO.tableinfo.subtitle.match(/短剧/) || TORRENT_INFO.tableinfo.chapter2 != '') {
        TORRENT_INFO.results.category = '电视剧';
    } else {
        TORRENT_INFO.results.category = '电影';
    }
    //逻辑：季数
    if (TORRENT_INFO.titleinfo.season != '') {
        if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(1|一)\s?季/)) {
            TORRENT_INFO.results.season = 'S01';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(2|二)\s?季/)) {
            TORRENT_INFO.results.season = 'S02';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(3|三)\s?季/)) {
            TORRENT_INFO.results.season = 'S03';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(4|四)\s?季/)) {
            TORRENT_INFO.results.season = 'S04';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(5|五)\s?季/)) {
            TORRENT_INFO.results.season = 'S05';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(6|六)\s?季/)) {
            TORRENT_INFO.results.season = 'S06';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(7|七)\s?季/)) {
            TORRENT_INFO.results.season = 'S07';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(8|八)\s?季/)) {
            TORRENT_INFO.results.season = 'S08';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?0?(9|九)\s?季/)) {
            TORRENT_INFO.results.season = 'S09';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(10|十)\s?季/)) {
            TORRENT_INFO.results.season = 'S10';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(11|十一)\s?季/)) {
            TORRENT_INFO.results.season = 'S11';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(12|十二)\s?季/)) {
            TORRENT_INFO.results.season = 'S12';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(13|十三)\s?季/)) {
            TORRENT_INFO.results.season = 'S13';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(14|十四)\s?季/)) {
            TORRENT_INFO.results.season = 'S14';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(15|十五)\s?季/)) {
            TORRENT_INFO.results.season = 'S15';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(16|十六)\s?季/)) {
            TORRENT_INFO.results.season = 'S16';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(17|十七)\s?季/)) {
            TORRENT_INFO.results.season = 'S17';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(18|十八)\s?季/)) {
            TORRENT_INFO.results.season = 'S18';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(19|十九)\s?季/)) {
            TORRENT_INFO.results.season = 'S19';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(20|二十)\s?季/)) {
            TORRENT_INFO.results.season = 'S20';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(21|二十一)\s?季/)) {
            TORRENT_INFO.results.season = 'S21';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(22|二十二)\s?季/)) {
            TORRENT_INFO.results.season = 'S22';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(23|二十三)\s?季/)) {
            TORRENT_INFO.results.season = 'S23';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(24|二十四)\s?季/)) {
            TORRENT_INFO.results.season = 'S24';
        } else if (TORRENT_INFO.tableinfo.subtitle.match(/第\s?(25|二十五)\s?季/)) {
            TORRENT_INFO.results.season = 'S25';
        } else {
            TORRENT_INFO.results.season = 'S01';
        }
    }

    //逻辑：文件
    var filelist;
    jQuery.ajax({
        async: false,
        type: "get",
        url: window.location.href.replace('details', 'viewfilelist'),
        datatype: 'json',
        success: function (data) {
            filelist = data;
        }
    });
    //console.log(filelist);
    let filelistArr = filelist.split('<tr>');
    TORRENT_INFO.results.files = filelistArr.length - 2;
    let errorFileNum = 0;
    let fileTypes = [];
    if (TORRENT_INFO.results.category == '动画' || TORRENT_INFO.titleinfo.minibd) {
    } else if (TORRENT_INFO.results.zhiliang.match(/(BD|UHD)/)) {
        for (let i = 2; i < filelistArr.length; i++) {
            let fileTemp = filelistArr[i];
            let num1 = fileTemp.indexOf('>');
            fileTemp = fileTemp.slice(num1 + 1);
            let num2 = fileTemp.indexOf('</');
            fileTemp = fileTemp.slice(0, num2);
            let fileLastDotNum = fileTemp.lastIndexOf('.');
            let fileType = fileTemp.slice(fileLastDotNum);
            // if (fileType.match(/\.mkv|\.mp4|\.nfo|\.txt|\.srt/ig)) {
            //     errorFileNum += 1;
            //     fileTypes.push(fileType);
            // } else {
            // }
            if (filelistArr[i].match(/\/dbmv\/stream|\/dbmv\/clipinf|\/dbmv\/playlist|\/bdmv\/backup\/clipinf|\/bdmv\/backup\/playlist/ig)) {
                if (fileType.match(/\.clpi|\.mpls|\.m2ts/ig)) {
                } else {
                    errorFileNum += 1;
                    fileTypes.push(fileType);
                }
            }
        }
    } else if (TORRENT_INFO.results.zhiliang == 'DVD') {
        for (let i = 2; i < filelistArr.length; i++) {
            let num1 = filelistArr[i].indexOf('>');
            filelistArr[i] = filelistArr[i].slice(num1 + 1);
            let num2 = filelistArr[i].indexOf('</');
            filelistArr[i] = filelistArr[i].slice(0, num2);
            let fileLastDotNum = filelistArr[i].lastIndexOf('.');
            let fileType = filelistArr[i].slice(fileLastDotNum);
            if (fileType.match(/\.vob|\.iso|\.ifo|\.bup/ig)) {
            } else {
                errorFileNum += 1;
                fileTypes.push(fileType);
            }
        }
    } else {
        for (let i = 2; i < filelistArr.length; i++) {
            let num1 = filelistArr[i].indexOf('>');
            filelistArr[i] = filelistArr[i].slice(num1 + 1);
            let num2 = filelistArr[i].indexOf('</');
            filelistArr[i] = filelistArr[i].slice(0, num2);
            let fileLastDotNum = filelistArr[i].lastIndexOf('.');
            let fileType = filelistArr[i].slice(fileLastDotNum);
            if (fileType.match(/\.mkv|\.mp4|\.vob|\.m2ts|\.ts|\.avi|\.mov|\.nfo|\.md5/ig)) {//|\.ass|\.srt|\.md5|\.nfo
            } else {
                errorFileNum += 1;
                fileTypes.push(fileType);
            }
        }
    }
    //逻辑：集数
    if (TORRENT_INFO.titleinfo.minibd) {
    } else if (TORRENT_INFO.tableinfo.chapter2 == '') {
        TORRENT_INFO.results.chapter2 = TORRENT_INFO.descrinfo.chapters;
    } else {
        TORRENT_INFO.results.chapter1 = TORRENT_INFO.tableinfo.chapter1;
        TORRENT_INFO.results.chapter2 = TORRENT_INFO.tableinfo.chapter2;
    }
    console.log(TORRENT_INFO);

    //页面提醒
    span_correct = '<br><span>' + TORRENT_INFO.results.title + '</span>';
    span_correct = span_correct.replace('##Logo##', TORRENT_INFO.titleinfo.logo);
    //预处理
    span_correct = span_correct.replace(/HQ/i, '<span style="color: white">HQ</span>').replace(/EDR/i, '<span style="color: white">EDR</span>')
    match = span_correct.match(/[2-9]?Audios?/i);
    if (match) {
        span_correct = span_correct.replace(/[2-9]?Audios?/i, `<span style="color: white">${match[0]}</span>`);
    }
    if (TORRENT_INFO.titleinfo.origin.match(/.*?bit.*khz/i)) {
        span_correct = '<br>歌手 - 歌曲名 发行年份 - 格式 位深 频率 - 制作组';
    } else {
        if (TORRENT_INFO.results.source == '') {
            a.innerHTML += '<span class="title_rules_break" style="color: red">主标题缺少来源</span><br>';
            error.push("主标题缺少来源");
        }
        // --- 新增代码：[增加主标题缺少音频编码的检查 V2.1.3] ---
        if (TORRENT_INFO.titleinfo.acodec == '') {
            a.innerHTML += '<span style="color: red">主标题缺少音频编码</span><br>';
            error.push("主标题缺少音频编码");
        }
        // --- 新增代码：[修正视频编码检查逻辑，应检查标题而非MediaInfo分析结果 V2.1.2] ---
        if (TORRENT_INFO.titleinfo.vcodec == '') {
            a.innerHTML += '<span class="title_rules_break" style="color: red">主标题缺少视频编码</span><br>';
            error.push("主标题缺少视频编码");
        }
        if (TORRENT_INFO.titleinfo.resolution == '' && TORRENT_INFO.results.source != 'DVDRip') {
           a.innerHTML += '<span class="title_rules_break" style="color: red">主标题缺少分辨率</span><br>';
            error.push("主标题缺少分辨率");
        }
        for (let i = 0; i < table.rows.length; i++) {
            if (table.rows[i].cells[0].textContent == '类别与标签' && !table.rows[i].cells[1].textContent.match(/\(.*\)/)) {
                var as = table.rows[i].cells[1].getElementsByTagName('img');
                var imgs = [];
                //以下循环引起页面崩溃（图片长度问题？）：https://pterclub.com/details.php?id=458971
                if (as.length == 3) {
                    while (as.length > 0) {
                        imgs.push(as[0].cloneNode());
                        as[0].parentNode.remove();
                    }
                } else if (as.length == 4) {
                    while (as.length > 1) {
                        imgs.push(as[0].cloneNode());
                        as[0].parentNode.remove();
                    }
                }
                //判断：类型
                table.rows[i].cells[1].append(imgs[0]);
                if (TORRENT_INFO.tableinfo.category.match(TORRENT_INFO.results.category) && TORRENT_INFO.results.category != '') {
                    a.innerHTML += '<span>必有 1：类型选择正确</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                    //https://pterclub.com/pic/checked.png
                } else if (TORRENT_INFO.results.category == '') {
                    a.innerHTML += '<span style="color: orange">必有 1：类型未判断</span><br>';
                    error.push("必有 1：类型未判断")
                    table.rows[i].cells[1].innerHTML += icons[1];
                    //https://pterclub.com/pic/questionmark.png
                } else {
                    a.innerHTML += `<span style="color: red">必有 1：类型选择错误，类型应为 ${TORRENT_INFO.results.category}</span><br>`;
                    if(!TORRENT_INFO.titleinfo.group.match(/CatEDU/i)){
                        error.push( `必有 1：类型选择错误，类型应为 ${TORRENT_INFO.results.category}`)
                    }
                    table.rows[i].cells[1].innerHTML += icons[0];
                    table.rows[i].cells[1].innerHTML += `<font size="3"><b><span style="color: red" id="Category"> ${TORRENT_INFO.results.category} </span></b></font>`;
                    //https://pterclub.com/pic/close.png
                }
                //判断：质量
                table.rows[i].cells[1].append(imgs[1]);
                if (TORRENT_INFO.tableinfo.zhiliang.match(TORRENT_INFO.results.zhiliang) && TORRENT_INFO.results.zhiliang != '') {
                    a.innerHTML += '<span>必有 2：质量选择正确</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                } else if (TORRENT_INFO.results.zhiliang == '') {
                    a.innerHTML += '<span style="color: orange">必有 2：质量未判断</span><br>';
                    error.push("必有 2：质量未判断")
                    table.rows[i].cells[1].innerHTML += icons[1];
                } else {
                    a.innerHTML += `<span style="color: red">必有 2：质量选择错误，应为 ${TORRENT_INFO.results.zhiliang}</span><br>`;
                    error.push("必有 2：质量选择错误")
                    table.rows[i].cells[1].innerHTML += icons[0];
                    table.rows[i].cells[1].innerHTML += `<font size="3"><b><span style="color: red" id="Quality"> ${TORRENT_INFO.results.zhiliang} </span></b></font>`;
                }
                //判断：地区
                table.rows[i].cells[1].append(imgs[2]);
                if (TORRENT_INFO.tableinfo.area.match(/大陆/) && TORRENT_INFO.descrinfo.area.match(/(大陆|中国)/)) {
                    a.innerHTML += '<span>必有 3：地区一致，为中国大陆</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                } else if (TORRENT_INFO.tableinfo.area.match(/香港/) && TORRENT_INFO.descrinfo.area.match(/香港/)) {
                    a.innerHTML += '<span>必有 3：地区一致，为香港</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                } else if (TORRENT_INFO.tableinfo.area.match(/台湾/) && TORRENT_INFO.descrinfo.area.match(/台湾/)) {
                    a.innerHTML += '<span>必有 3：地区一致，为台湾</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                } else if (TORRENT_INFO.tableinfo.area.match(/欧美/) && TORRENT_INFO.descrinfo.area.trim().match(/(俄罗斯|土耳其|阿尔巴尼亚|爱尔兰|爱沙尼亚|安道尔|奥地利|白俄罗斯|保加利亚|北马其顿|比利时|冰岛|波黑|波兰|丹麦|德国|法国|梵蒂冈|芬兰|荷兰|黑山|捷克|克罗地亚|拉脱维亚|立陶宛|列支敦士登|卢森堡|罗马尼亚|马耳他|摩尔多瓦|摩纳哥|挪威|葡萄牙|瑞典|瑞士|塞尔维亚|塞浦路斯|圣马力诺|斯洛伐克|斯洛文尼亚|乌克兰|西班牙|希腊|匈牙利|意大利|英国|安提瓜和巴布达|巴巴多斯|巴哈马|巴拿马|伯利兹|多米尼加|多米尼克|格林纳达|哥斯达黎加|古巴|海地|洪都拉斯|加拿大|美国|墨西哥|尼加拉瓜|萨尔瓦多|圣基茨和尼维斯|圣卢西亚|圣文森特和格林纳丁斯|特立尼达和多巴哥|危地马拉|牙买加|阿根廷|巴拉圭|巴西|秘鲁|玻利维亚|厄瓜多尔|哥伦比亚|圭亚那|苏里南|委内瑞拉|乌拉圭|智利|捷克斯洛伐克|澳大利亚|西德|新西兰)/)) {
                    a.innerHTML += '<span>必有 3：地区一致，为欧美</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                } else if (TORRENT_INFO.tableinfo.area.match(/日本/) && TORRENT_INFO.descrinfo.area.match(/日本/)) {
                    a.innerHTML += '<span>必有 3：地区一致，为日本</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                } else if (TORRENT_INFO.tableinfo.area.match(/韩国/) && TORRENT_INFO.descrinfo.area.match(/韩国/)) {
                    a.innerHTML += '<span>必有 3：地区一致，为韩国</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                } else if (TORRENT_INFO.tableinfo.area.match(/印度/) && TORRENT_INFO.descrinfo.area.match(/印度/)) {
                    a.innerHTML += '<span>必有 3：地区一致，为印度</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                } else if (TORRENT_INFO.tableinfo.area.match(/其它/) && TORRENT_INFO.descrinfo.area.match(/(阿联酋|约旦|尼日利亚|阿富汗|柬埔寨|刚果|黎巴嫩|菲律宾|泰国|苏联|南非|埃及|马来西亚|印度尼西亚|以色列|伊朗|古巴|新加坡|越南|老挝|巴基斯坦|巴勒斯坦|蒙古)/)) {
                    a.innerHTML += '<span>必有 3：地区一致，为 Other</span><br>';
                    table.rows[i].cells[1].innerHTML += icons[2];
                } else if (TORRENT_INFO.descrinfo.area != '') {
                    a.innerHTML += `<span style="color: red">必有 3：地区不一致，应为 ${TORRENT_INFO.descrinfo.area}</span><br>`;
                    error.push(`必有 3：地区不一致，应为 ${TORRENT_INFO.descrinfo.area}`)
                    table.rows[i].cells[1].innerHTML += icons[0];
                    table.rows[i].cells[1].innerHTML += `<font size="3"><b><span style="color: red"> ${TORRENT_INFO.descrinfo.area} </span></b></font>`;
                } else {
                    a.innerHTML += '<span style="color: orange">必有 3：地区未判断</span><br>';
                    error.push(`必有 3：地区未判断`)
                    table.rows[i].cells[1].innerHTML += icons[1];
                }
                //     if (a.childNodes.length != 6) {
                //         a.innerHTML += '<span style="color: red">缺少必有项目</span><br>';
                //         console.log(a);
                //     }
                table.rows[i].cells[1].firstChild.remove();
                as = table.rows[i].cells[1].getElementsByTagName('a');
                for (let j = 0; j < as.length; j++) {
                    table.rows[i].cells[1].append(as[0]);
                }
                //     for (let i = 0; i < 50; i++) {
                //         if (table.rows[2].cells[1].firstChild.tagName == 'TEXT') {
                //             table.rows[2].cells[1].firstChild.remove();
                //         } else if (table.rows[2].cells[1].firstChild.tagName == 'A') {
                //             table.rows[2].cells[1].append(table.rows[2].cells[1].firstChild);
                //                 if (table.rows[2].cells[1].firstChild.tagName == 'Text')

                //     }
            }
        }
        //判断：显著错误
        if (TORRENT_INFO.titleinfo.origin.replace(TORRENT_INFO.titleinfo.group, '').match(/(BDRip|BDMV|[^\x00-\xff])/i)) {
            console.log(TORRENT_INFO.titleinfo.origin.replace(TORRENT_INFO.titleinfo.group, '').match(/(BDRip|BDMV|[^\x00-\xff])/i));
            a.innerHTML += '<span style="color: red" class="title_rules_break">如有：主标题不符合命名规范（其他）</span><br>';
            error.push(`如有：主标题不符合命名规范（其他）`);
        } else if (TORRENT_INFO.results.title.match(/\./)) {
            a.innerHTML += '<span style="color: red">如有：标题中有多余的点需要删除</span><br>';
            error.push(`如有：标题中有多余的点需要删除`);
        } else if (TORRENT_INFO.titleinfo.origin.match(/2\.05\.1/)) {
            a.innerHTML += '<span style="color: red">如有：音频通道错误</span><br>';
            error.push(`如有：音频通道错误`);
        } else if (TORRENT_INFO.titleinfo.format == 'TrueHD' && TORRENT_INFO.titleinfo.channels != '7.1' && TORRENT_INFO.titleinfo.aobject == 'Atmos') {
            a.innerHTML += '<span style="color: red">如有：音频对象错误</span><br>';
            error.push(`如有：音频对象错误`);
        } else if (TORRENT_INFO.titleinfo.group.match(/\s/)) {
            a.innerHTML += '<span style="color: red">如有：标题中有扩展名等需要删除</span><br>';
            error.push(`如有：标题中有扩展名等需要删除`);
        } else if (TORRENT_INFO.results.title.match(/\(.*?\)/)) {
            a.innerHTML += '<span style="color: red">如有：标题中有多余括号需要删除</span><br>';
            error.push(`如有：标题中有多余括号需要删除`);
        }
        //判断：MediaInfo 检查
        if (TORRENT_INFO.mediainfo.full == '' && TORRENT_INFO.bdinfo.full == '' && !infosp) {
            //MediaInfo、BDInfo、infosp 都为空
            //a.innerHTML += '<br><font size="2"><b><span style="color: red">缺少 MediaInfo 或 BDInfo</span></b><font><br><br>';
            span_correct = span_correct.replace('##Resolution##', TORRENT_INFO.titleinfo.resolution);
            span_correct = span_correct.replace('##Vcodec##', TORRENT_INFO.titleinfo.vcodec);
            span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
            span_correct = span_correct.replace('##Channels##', TORRENT_INFO.titleinfo.channels);
            span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
            span_correct = span_correct.replace('##Group##', TORRENT_INFO.titleinfo.group);
            //span_correct = span_correct + TORRENT_INFO.titleinfo.freeinfo;
            //span_correct += '<br><span style="color: red">缺少 MediaInfo 或 BDInfo</span>';
            span_correct = '<br><span style="color: red">缺少 MediaInfo 或 BDInfo</span>';
            error.push(`缺少 MediaInfo 或 BDInfo`)
        } else if (TORRENT_INFO.mediainfo.full != '' || infosp) {
            if (TORRENT_INFO.mediainfo.full == '' && infosp) {
                a.innerHTML += `<br><span style="color: orange">如有：通过 ${TORRENT_INFO.titleinfo.group} 的解析 Info 进行分析</span><br>`;
            }
            //判断：分辨率
            if (TORRENT_INFO.titleinfo.resolution == TORRENT_INFO.results.resolution) {
                span_correct = span_correct.replace('##Resolution##', `<span style="color: #00FF00">${TORRENT_INFO.results.resolution}</span>`);
            } else if (TORRENT_INFO.results.resolution == '') {
                span_correct = span_correct.replace('##Resolution##', `<span style="color: orange">${TORRENT_INFO.titleinfo.resolution}</span>`);
            } else {
                span_correct = span_correct.replace('##Resolution##', `<span style="color: red">${TORRENT_INFO.results.resolution}</span>`);
                if(!(TORRENT_INFO.titleinfo.group.match(/TLF/) && TORRENT_INFO.titleinfo.origin.match(/MiniSD/))){
                    error.push(`红色标题//判断：分辨率`)
                }
            }
            //判断：视频编码
            if (TORRENT_INFO.titleinfo.vcodec == TORRENT_INFO.results.vcodec) {
                span_correct = span_correct.replace('##Vcodec##', `<span style="color: #00FF00">${TORRENT_INFO.results.vcodec}</span>`);
            } else if (TORRENT_INFO.titleinfo.vcodec.match(/(H.?264|H.?265)/i)) {
                match = TORRENT_INFO.titleinfo.vcodec.match(/(H.?264|H.?265)/i)[0];
                if (match.replace('.', '') == TORRENT_INFO.results.vcodec) {
                    span_correct = span_correct.replace('##Vcodec##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.vcodec}</span>`);
                } else if (match.replace(' ', '') == TORRENT_INFO.results.vcodec) {
                    span_correct = span_correct.replace('##Vcodec##', `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`);
                    error.push(`红色标题//判断：视频编码`)
                } else if (TORRENT_INFO.results.vcodec == '') {
                    span_correct = span_correct.replace('##Vcodec##', `<span style="color: orange">${TORRENT_INFO.titleinfo.vcodec}</span>`);
                } else {
                    span_correct = span_correct.replace('##Vcodec##', `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`);
                    error.push(`红色标题//判断：视频编码`)
                }
            } else if (TORRENT_INFO.results.vcodec == 'MPEG-2') {
                if (TORRENT_INFO.titleinfo.vcodec.match(/MPEG-?2/i)) {
                    span_correct = span_correct.replace('##Vcodec##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.vcodec}</span>`);
                } else {
                    span_correct = span_correct.replace('##Vcodec##', `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`);
                    error.push(`红色标题//判断：视频编码`)
                }
            } else if (TORRENT_INFO.results.zhiliang == '' || TORRENT_INFO.mediainfo.video.format == '') {
                span_correct = span_correct.replace('##Vcodec##', `<span style="color: orange">${TORRENT_INFO.titleinfo.vcodec}</span>`);
            } else {
                span_correct = span_correct.replace('##Vcodec##', `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`);
                error.push(`红色标题//判断：视频编码`)
            }
            //判断：音频编码
            if (Object.keys(TORRENT_INFO.mediainfo.audios).length == 1) {
                //对象
                if (TORRENT_INFO.mediainfo.audios.audio1.object == 'Atmos' && TORRENT_INFO.titleinfo.aobject == 'Atmos') {
                    span_correct = span_correct.replace('##Atmos##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.aobject}</span>`);
                } else if (TORRENT_INFO.mediainfo.audios.audio1.object == 'Atmos' && TORRENT_INFO.titleinfo.aobject == '') {
                    span_correct = span_correct.replace('##Acodec##', '##Acodec## ##Atmos## ').replace('##Atmos##', '<span style="color: red">Atmos</span>');
                } else {
                    span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
                }
                //编码
                if (TORRENT_INFO.mediainfo.audios.audio1.format.toLowerCase() == TORRENT_INFO.titleinfo.acodec.replace('EAC3', 'DDP').replace('DD+', 'DDP').toLowerCase()) {
                    span_correct = span_correct.replace('##Acodec##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.acodec}</span>`);
                } else if (TORRENT_INFO.mediainfo.audios.audio1.format == TORRENT_INFO.titleinfo.acodec.replace(/AC-?3/i, 'DD')) {
                    span_correct = span_correct.replace('##Acodec##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.acodec}</span>`);
                } else if (TORRENT_INFO.mediainfo.audios.audio1.format != '') {
                    span_correct = span_correct.replace('##Acodec##', `<span style="color: red">${TORRENT_INFO.mediainfo.audios.audio1.format}</span>`);
                    error.push(`红色主标题//编码`)
                } else {
                    span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
                }
                //通道
                if (TORRENT_INFO.mediainfo.audios.audio1.channels == TORRENT_INFO.titleinfo.channels) {
                    span_correct = span_correct.replace('##Channels##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.channels}</span>`);
                } else if (TORRENT_INFO.titleinfo.channels != '') {
                    span_correct = span_correct.replace('##Channels##', `<span style="color: red">${TORRENT_INFO.mediainfo.audios.audio1.channels}</span>`);
                    error.push(`红色主标题//通道`)
                    //span_correct = span_correct.replace('##Channels##', TORRENT_INFO.titleinfo.channels);
                }
            } else {
                //console.log(Object.keys(TORRENT_INFO.mediainfo.audios).length);
                span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
                span_correct = span_correct.replace('##Channels##', TORRENT_INFO.titleinfo.channels);
                span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
            }
            span_correct = span_correct.replace('##Group##', TORRENT_INFO.titleinfo.group);

            span_correct = span_correct + TORRENT_INFO.titleinfo.freeinfo;
        } else if (TORRENT_INFO.bdinfo.full != '') {
            //判断：分辨率
            if (TORRENT_INFO.titleinfo.resolution == TORRENT_INFO.results.resolution) {
                span_correct = span_correct.replace('##Resolution##', `<span style="color: #00FF00">${TORRENT_INFO.results.resolution}</span>`);
            } else {
                span_correct = span_correct.replace('##Resolution##', `<span style="color: red">${TORRENT_INFO.results.resolution}</span>`);
                error.push(`红色主标题//判断：分辨率`)
            }
            //判断：视频编码
            if (TORRENT_INFO.titleinfo.vcodec == TORRENT_INFO.results.vcodec) {
                span_correct = span_correct.replace('##Vcodec##', `<span style="color: #00FF00">${TORRENT_INFO.results.vcodec}</span>`);
            } else {
                span_correct = span_correct.replace('##Vcodec##', `<span style="color: red">${TORRENT_INFO.results.vcodec}</span>`);
                error.push(`红色主标题//判断：视频编码`)
            }
            //判断：音频编码
            //console.log(Object.keys(TORRENT_INFO.bdinfo.audios).length);
            if (Object.keys(TORRENT_INFO.bdinfo.audios).length == 1) {
                if (TORRENT_INFO.bdinfo.audios.audio1.object == 'Atmos' && TORRENT_INFO.titleinfo.aobject == 'Atmos') {
                    span_correct = span_correct.replace('##Atmos##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.aobject}</span>`);
                } else if (TORRENT_INFO.bdinfo.audios.audio1.object == 'Atmos' && TORRENT_INFO.titleinfo.aobject == '') {
                    span_correct = span_correct.replace('##Acodec##', '##Acodec## ##Atmos##').replace('##Atmos##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.aobject}</span>`);
                } else {
                    span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
                }
                if (TORRENT_INFO.bdinfo.audios.audio1.format == TORRENT_INFO.titleinfo.acodec.replace('EAC3', 'DDP').replace('DD+', 'DDP')) {
                    span_correct = span_correct.replace('##Acodec##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.acodec}</span>`);
                } else if (TORRENT_INFO.bdinfo.audios.audio1.format == TORRENT_INFO.titleinfo.acodec.replace('AC3', 'DD')) {
                    span_correct = span_correct.replace('##Acodec##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.acodec}</span>`);
                } else if (TORRENT_INFO.bdinfo.audios.audio1.format != '') {
                    span_correct = span_correct.replace('##Acodec##', `<span style="color: red">${TORRENT_INFO.bdinfo.audios.audio1.format}</span>`);
                    error.push(`红色主标题//判断：音频编码`)
                } else {
                    span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
                }
                if (TORRENT_INFO.bdinfo.audios.audio1.channels == TORRENT_INFO.titleinfo.channels) {
                    span_correct = span_correct.replace('##Channels##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.channels}</span>`);
                } else if (TORRENT_INFO.titleinfo.channels != '') {
                    span_correct = span_correct.replace('##Channels##', `<span style="color: red">${TORRENT_INFO.bdinfo.audios.audio1.channels}</span>`);
                    error.push(`红色主标题//判断：音频编码`)
                    //span_correct = span_correct.replace('##Channels##', TORRENT_INFO.titleinfo.channels);
                }
            } else {
                span_correct = span_correct.replace('##Acodec##', TORRENT_INFO.titleinfo.acodec);
                span_correct = span_correct.replace('##Channels##', TORRENT_INFO.titleinfo.channels);
                span_correct = span_correct.replace('##Atmos##', TORRENT_INFO.titleinfo.aobject);
            }
            span_correct = span_correct.replace('##Group##', TORRENT_INFO.titleinfo.group);
            span_correct = span_correct.replace('DDPAtmos', 'DDPA');
            span_correct = span_correct + TORRENT_INFO.titleinfo.freeinfo;
        }
        //判断 DVD 制式
        if (TORRENT_INFO.mediainfo.standard == TORRENT_INFO.titleinfo.standard && TORRENT_INFO.mediainfo.standard != '') {
            span_correct = span_correct.replace('##Standard##', `<span style="color: #00FF00">${TORRENT_INFO.mediainfo.standard}</span>`);
        } else {
            span_correct = span_correct.replace('##Standard##', `<span style="color: red">${TORRENT_INFO.mediainfo.standard}</span>`);
            if(TORRENT_INFO.mediainfo.standard && TORRENT_INFO.mediainfo.standard != ''){
            }
        }
        //判断：标题片名
        match = TORRENT_INFO.descrinfo.moviename.replace(/\+/g, '@@').toLowerCase().match(TORRENT_INFO.titleinfo.name.replace(/\+/g, '@@').toLowerCase());
        if (match && TORRENT_INFO.titleinfo.name.toLowerCase() != '') {
            span_correct = span_correct.replace('##Name##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.name}</span>`);
        } else if (TORRENT_INFO.titleinfo.name.toLowerCase() != '') {
            span_correct = span_correct.replace('##Name##', `<span style="color: orange">${TORRENT_INFO.titleinfo.name}</span>`);
        } else {
            span_correct = span_correct.replace('##Name##', '');
            a.innerHTML += '<span style="color: red" class="title_rules_break">如有：主标题不符合命名规范（片名）</span><br>';
            error.push(`如有：主标题不符合命名规范（片名）`)
        }
        //判断：标题年份
        if (TORRENT_INFO.results.category == '电影' && TORRENT_INFO.titleinfo.year == '') {
            a.innerHTML += '<span style="color: red" class="title_rules_break">如有：标题缺少年份</span><br>';
            error.push(`如有：标题缺少年份`)
        } else if (Math.abs(parseInt(TORRENT_INFO.titleinfo.year) - parseInt(TORRENT_INFO.descrinfo.publishdate)) <= 1 && TORRENT_INFO.descrinfo.publishdate != '') {
            span_correct = span_correct.replace('##Year##', `<span style="color: #00FF00">${TORRENT_INFO.descrinfo.publishdate}</span>`);
        } else if (TORRENT_INFO.descrinfo.publishdate == '') {
            span_correct = span_correct.replace('##Year##', `<span style="color: orange">${TORRENT_INFO.titleinfo.year}</span>`);
        } else {
            span_correct = span_correct.replace('##Year##', `<span style="color: red">${TORRENT_INFO.descrinfo.publishdate}</span>`);
            if(TORRENT_INFO.results.category != '电视剧' && TORRENT_INFO.results.category != '综艺'){
                error.push(`红色主标题//判断：标题年份`)
            }
        }
        //判断：标题季数
        if (TORRENT_INFO.titleinfo.season == TORRENT_INFO.results.season) {
            span_correct = span_correct.replace('##Season##', `<span style="color: #00FF00">${TORRENT_INFO.results.season}</span>`);
        } else {
            span_correct = span_correct.replace('##Season##', `<span style="color: red">${TORRENT_INFO.results.season}</span>`);
            error.push(`红色主标题//判断：标题季数`)
        }
        //判断：年份季数至少含一个
        if (TORRENT_INFO.titleinfo.year == '' && TORRENT_INFO.titleinfo.season == '') {
            a.innerHTML += '<span style="color: red" class="title_rules_break">如有：主标题不符合命名规范（季数）</span><br>';
            error.push(`如有：主标题不符合命名规范（季数）`)
        }
        //判断：标题集数
        if (TORRENT_INFO.tableinfo.chapter1 == '-1' && TORRENT_INFO.tableinfo.chapter2 != '') {
            if (parseInt(TORRENT_INFO.titleinfo.chapter1) == parseInt(TORRENT_INFO.tableinfo.chapter1) && parseInt(TORRENT_INFO.titleinfo.chapter2) == parseInt(TORRENT_INFO.tableinfo.chapter2)) {
                span_correct = span_correct.replace('##Chapters##', `<span style="color: #00FF00">E${TORRENT_INFO.titleinfo.chapter2}</span>`);
            } else {
                span_correct = span_correct.replace('##Chapters##', `<span style="color: red">E${TORRENT_INFO.results.chapter2}</span>`);
                error.push(`红色主标题//判断：标题集数`)
            }
        } else if (TORRENT_INFO.tableinfo.chapter1 != '-1' && TORRENT_INFO.tableinfo.chapter1 != '') {
            if (parseInt(TORRENT_INFO.titleinfo.chapter1) == parseInt(TORRENT_INFO.tableinfo.chapter1) && parseInt(TORRENT_INFO.titleinfo.chapter2) == parseInt(TORRENT_INFO.tableinfo.chapter2)) {
                span_correct = span_correct.replace('##Chapters##', `<span style="color: #00FF00">E${TORRENT_INFO.titleinfo.chapter1}-E${TORRENT_INFO.titleinfo.chapter2}</span>`);
            } else {
                span_correct = span_correct.replace('##Chapters##', `<span style="color: red">E${TORRENT_INFO.results.chapter1}-E${TORRENT_INFO.results.chapter2}</span>`);
                error.push(`红色主标题//判断：标题集数`)
            }
        } else {
            span_correct = span_correct.replace('##Chapters##', '');
        }
        //判断：标题媒介
        //span_correct = span_correct.replace('##Source##', TORRENT_INFO.titleinfo.source);
        if (TORRENT_INFO.results.zhiliang == 'WEB-DL' && TORRENT_INFO.titleinfo.source != TORRENT_INFO.results.zhiliang) {
            span_correct = span_correct.replace('##Source##', `<span style="color: red">${TORRENT_INFO.results.zhiliang}</span>`);
            error.push(`红色主标题//判断：标题媒介`);
        }
        if (TORRENT_INFO.results.zhiliang == TORRENT_INFO.results.source) {
            span_correct = span_correct.replace('##Source##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`);
        } else if (TORRENT_INFO.results.zhiliang == 'Encode' && TORRENT_INFO.results.source == 'DVDRip') {
            span_correct = span_correct.replace('##Source##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`);
        } else if ((TORRENT_INFO.results.zhiliang == 'BD' || TORRENT_INFO.results.zhiliang == 'UHD' || TORRENT_INFO.results.zhiliang == 'REMUX' || TORRENT_INFO.results.zhiliang == 'Encode') && TORRENT_INFO.results.source == 'Blu-ray') {
            span_correct = span_correct.replace('##Source##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`);
        } else if ((TORRENT_INFO.results.zhiliang == 'DVD' || TORRENT_INFO.results.zhiliang == 'REMUX' || TORRENT_INFO.results.zhiliang == 'Encode') && TORRENT_INFO.results.source == 'DVD') {
            span_correct = span_correct.replace('##Source##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`);
        } else if (TORRENT_INFO.results.zhiliang == 'Encode' && TORRENT_INFO.results.source == 'HDTVRip') {
            span_correct = span_correct.replace('##Source##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`);
        } else if (TORRENT_INFO.results.zhiliang == 'Encode' && TORRENT_INFO.results.source == 'WEBRip') {
            span_correct = span_correct.replace('##Source##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`);
        } else if (TORRENT_INFO.results.zhiliang == 'Encode' && TORRENT_INFO.results.source == 'WEB-DL' && TORRENT_INFO.titleinfo.group.match(/FRDS/)) {
            span_correct = span_correct.replace('##Source##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.source}</span>`);
        }  else if (TORRENT_INFO.results.zhiliang == '') {
            span_correct = span_correct.replace('##Source##', `<span style="color: orange">${TORRENT_INFO.results.source}</span>`);
        } else {
            //console.log(TORRENT_INFO.titleinfo.group.match(/FRDS/));
            span_correct = span_correct.replace('##Source##', `<span style="color: red">${TORRENT_INFO.results.source}</span>`);
            error.push(`红色主标题//判断：标题媒介`);
        }
        //判断：标题 REMUX
        if ((TORRENT_INFO.results.source == 'Blu-ray' || TORRENT_INFO.results.source == 'DVD') && TORRENT_INFO.results.zhiliang == 'REMUX') {
            span_correct = span_correct.replace('##REMUX##', '<span style="color: #00FF00">REMUX</span>');
        } else {
            span_correct = span_correct.replace('##REMUX##', 'REMUX');
        }
        //判断：标题 FPS
        match = TORRENT_INFO.titleinfo.fps.toLowerCase();
        if (TORRENT_INFO.mediainfo.video.fps.toLowerCase() == match) {
            span_correct = span_correct.replace('##FPS##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.fps}</span>`);
        } else {
            span_correct = span_correct.replace('##FPS##', `<span style="color: red">${TORRENT_INFO.mediainfo.video.fps}</span>`);
            if(TORRENT_INFO.mediainfo.video.fps && TORRENT_INFO.mediainfo.video.fps != '24FPS'&& TORRENT_INFO.mediainfo.video.fps != '25FPS'&& TORRENT_INFO.mediainfo.video.fps != '30FPS'){
                // error.push(`${TORRENT_INFO.mediainfo.video.fps}`)
            }
        }
        //判断：HDR
        //console.log(TORRENT_INFO.results.hdr);
        //console.log(TORRENT_INFO.titleinfo.hdr);

        if (TORRENT_INFO.titleinfo.hdr != '') {
            if (TORRENT_INFO.results.hdr.match(TORRENT_INFO.titleinfo.hdr.replace('HDR10','HDR').replace('P', '+'))) {
                span_correct = span_correct.replace('##HDR##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.hdr}</span>`);
            } else if (TORRENT_INFO.results.hdr != 'Unknown') {
                span_correct = span_correct.replace('##HDR##', `<span style="color: red">${TORRENT_INFO.results.hdr}</span>`);
                error.push(`红色主标题//判断：HDR`)
            } else if (TORRENT_INFO.results.hdr == 'Unknown') {
                span_correct = span_correct.replace('##HDR##', `<span style="color: orange">${TORRENT_INFO.titleinfo.hdr}</span>`);
            } else {
                span_correct = span_correct.replace('##HDR##', '');
            }
        }
        //     if ((TORRENT_INFO.mediainfo.video.hdr == true || TORRENT_INFO.bdinfo.video.hdr == true) && TORRENT_INFO.titleinfo.hdr != '') {
        //         span_correct = span_correct.replace('##HDR##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.hdr}</span>`);
        //     } else if ((TORRENT_INFO.mediainfo.video.hdr == false || TORRENT_INFO.bdinfo.video.hdr == false) && TORRENT_INFO.titleinfo.group.match(/FRDS/i)) {
        //         span_correct = span_correct.replace('##HDR##', `<span style="color: orange">${TORRENT_INFO.titleinfo.hdr}</span>`);
        //     } else if ((TORRENT_INFO.mediainfo.video.hdr == false || TORRENT_INFO.bdinfo.video.hdr == false) && TORRENT_INFO.titleinfo.hdr != '') {
        //         span_correct = span_correct.replace('##HDR##', '');
        //     }
        span_correct = span_correct.replace('##HDR##', '??');
        //判断：DV
        if ((TORRENT_INFO.mediainfo.video.dv == true || TORRENT_INFO.bdinfo.video.dv == true) && TORRENT_INFO.titleinfo.dv != '') {
            span_correct = span_correct.replace('##DoVi##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.dv}</span>`);
        } else if ((TORRENT_INFO.mediainfo.video.dv == false || TORRENT_INFO.bdinfo.video.dv == false) && TORRENT_INFO.titleinfo.dv != '') {
            span_correct = span_correct.replace('##DoVi##', '');
            error.push(`缺少 DV 信息`);
        }
        span_correct = span_correct.replace('##DoVi##', '??');
        //判断：10 Bits
        if (TORRENT_INFO.titleinfo.bitdepth.match(TORRENT_INFO.mediainfo.video.bitdepth) && TORRENT_INFO.mediainfo.video.bitdepth != '') {
            span_correct = span_correct.replace('##BitDepth##', `<span style="color: #00FF00">${TORRENT_INFO.titleinfo.bitdepth}</span>`);
        } else if (TORRENT_INFO.mediainfo.video.bitdepth == '') {
            span_correct = span_correct.replace('##BitDepth##', `<span style="color: orange">${TORRENT_INFO.titleinfo.bitdepth}</span>`);
        }
// --- V10 新增的智能音轨语言标签提醒系统 v1.2.0 ---
// 该系统基于“事实优先，地区推测”的原则，提供更精准的标签建议。
       // --- 音频语言标签最终判断逻辑 (最终优化版) ---
        const { mediainfo, tableinfo, descrinfo } = TORRENT_INFO;
        // --- 提取“事实”与“推测”所需变量 ---
        const hasMandarinFact = mediainfo.hasMandarin;
        const hasCantoneseFact = mediainfo.hasCantonese;
        const hasMandarinTag = tableinfo.hasTagMandarin;
        const hasCantoneseTag = tableinfo.hasTagCantonese;

        const isChina = descrinfo.area.match(/(大陆|中国)/) || tableinfo.area.match(/大陆/);
        const isTaiwan = descrinfo.area.match(/台湾/) || tableinfo.area.match(/台湾/);
        const isHongKong = descrinfo.area.match(/香港/) || tableinfo.area.match(/香港/);

        // --- 规则【最高优先级】：大陆地区的特殊要求 ---
        // 此规则独立于其他判断，且只处理国语
        if (isChina && !hasMandarinTag) {
            a.innerHTML += '<span style="color: blue">建议勾选【国语】标签。</span><br>';
        }

        // --- 粤语判断逻辑块 ---
        if (hasCantoneseTag && !hasCantoneseFact) {
            // 【蓝色警告】标签与事实冲突
            a.innerHTML += '<span style="color: blue">请检查【粤语】标签是否误选。</span><br>';
            error.push('粤语标签可能误选');
        } else if (hasCantoneseFact && !hasCantoneseTag) {
            // 【蓝色提示】事实证明漏标
            a.innerHTML += '<span style="color: blue">检测到粤语音轨，但未勾选标签。</span><br>';
        }

        // --- 国语判断逻辑块 (独立于粤语判断) ---
        // 只有在未被“大陆最高优先级”规则处理时，才进入此逻辑块
        if (!(isChina && !hasMandarinTag)) {
            if (hasMandarinTag && !hasMandarinFact) {
                // 【蓝色警告】标签与事实冲突
                if (!isChina) { // 对大陆地区豁免红色警告
                     a.innerHTML += '<span style="color: blue">请检查【国语】标签是否误选。</span><br>';
                    error.push('国语标签可能误选');
                }
            } else if (hasMandarinFact && !hasMandarinTag) {
                // 【蓝色提示】事实证明漏标
                 a.innerHTML += '<span style="color: blue">检测到国语音轨，但未勾选标签。</span><br>';
            }
        }

        // --- 基于推测的蓝色提示 (仅在无任何事实证据时) ---
        if (!hasMandarinFact && !hasCantoneseFact) {
            if (isTaiwan && !hasMandarinTag) {
                // 台湾地区推测
                a.innerHTML += '<span style="color: blue">根据产地推测，建议勾选【国语】标签。</span><br>';
            } else if (isHongKong && !hasMandarinTag && !hasCantoneseTag) {
                // 香港地区推测
                a.innerHTML += '<span style="color: blue">根据产地推测，建议勾选【国语】/【粤语】标签。</span><br>';
            }
        }
        //判断：字幕标签
        if (Object.keys(TORRENT_INFO.mediainfo.subtitles).length == 0 && TORRENT_INFO.bdinfo.subtitles.length == 0 && TORRENT_INFO.tableinfo.hasTagChineseSubtitles == false && TORRENT_INFO.tableinfo.hasTagEnglishSubtitles == false) {//没有考虑解析 Info 获取到了字幕的情况（length = 0）
            a.innerHTML += '<span style="color: red">检查是否有字幕</span><br>';
            error.push(`检查是否有字幕`)
        } else {
            if (TORRENT_INFO.results.zhiliang != 'BD' && TORRENT_INFO.results.zhiliang != 'UHD') {
                if ((TORRENT_INFO.tableinfo.area.match(/(大陆|台湾|香港)/) || TORRENT_INFO.mediainfo.hasChineseSubtitles == true || TORRENT_INFO.tableinfo.hasChineseExternalsubtitles == '外挂中字') && TORRENT_INFO.tableinfo.hasTagChineseSubtitles == false) {
                    a.innerHTML += '<span style="color: red">缺少 中字 标签</span><br>';
                    error.push(`缺少 中字 标签`)
                } else if (!TORRENT_INFO.descrinfo.area.match(/(大陆|台湾|香港)/) && TORRENT_INFO.mediainfo.hasChineseSubtitles == false && TORRENT_INFO.tableinfo.hasChineseExternalsubtitles != '外挂中字' && TORRENT_INFO.tableinfo.hasTagChineseSubtitles == true) {
                    a.innerHTML += '<span style="color: orange">检查是否有硬中字字幕</span><br>';
                    error.push(`检查是否有硬中字字幕`)
                }
            } else {
                if ((TORRENT_INFO.mediainfo.hasChineseSubtitles == true || TORRENT_INFO.tableinfo.subtitle.match(/内嵌中字|硬中字/) || TORRENT_INFO.tableinfo.hasChineseExternalsubtitles == '外挂中字') && TORRENT_INFO.tableinfo.hasTagChineseSubtitles == false) {
                    a.innerHTML += '<span style="color: red">缺少 中字 标签</span><br>';
                    error.push(`缺少 中字 标签`)
                } else if (TORRENT_INFO.mediainfo.hasChineseSubtitles == false && TORRENT_INFO.tableinfo.hasChineseExternalsubtitles != '外挂中字'&& TORRENT_INFO.tableinfo.hasTagChineseSubtitles == true) {
                    a.innerHTML += '<span style="color: red">没有 中字</span><br>';
                    error.push(`没有 中字`)
                }
            }
            //console.log(!TORRENT_INFO.descrinfo.area.match(/(大陆|台湾|香港)/));
            if (TORRENT_INFO.mediainfo.hasEnglishSubtitles == false && TORRENT_INFO.tableinfo.hasEnglishExternalsubtitles != '外挂英字' && TORRENT_INFO.tableinfo.hasTagEnglishSubtitles == true) {
                a.innerHTML += '<span style="color: orange">检查是否有硬英字字幕</span><br>';
                error.push(`检查是否有硬英字字幕`)
            }
        }
        if (TORRENT_INFO.bdinfo.DIY == true && TORRENT_INFO.tableinfo.hasTagDIY == false) {
            a.innerHTML += '<span style="color: red" id="DIY_Y">缺少 DIY 标签</span><br>';
            error.push(`缺少 DIY 标签`)
        } else if (TORRENT_INFO.bdinfo.DIY == false && TORRENT_INFO.tableinfo.hasTagDIY == true) {
            a.innerHTML += '<span style="color: red" id="DIY_N">非 DIY 原盘</span><br>';
            error.push(`非 DIY 原盘`)
        }
        //判断：IMDb 链接
        if (TORRENT_INFO.tableinfo.imdburl == '' && !TORRENT_INFO.descrinfo.area.match(/(大陆|台湾|香港)/)) {
            a.innerHTML += '<br><span style="color: red">IMDb 链接为空</span><br>';
            if(TORRENT_INFO.tableinfo.doubanurl == ''){
                error.push(`IMDb 链接为空`)
            }
        } else if (TORRENT_INFO.tableinfo.imdburl != TORRENT_INFO.descrinfo.imdburl && TORRENT_INFO.descrinfo.imdburl != '') {
            a.innerHTML += '<br><span style="color: red">IMDb 链接不一致</span><br>';
            error.push(`IMDb 链接不一致`)
        }
        //判断：豆瓣链接
        if (TORRENT_INFO.tableinfo.doubanurl == '') {
            a.innerHTML += '<br><span style="color: red">豆瓣链接为空</span><br>';
            if(TORRENT_INFO.tableinfo.imdburl == '' && TORRENT_INFO.titleinfo.group != 'GodDramas' ){
                error.push(`豆瓣链接为空`)
            }

        } else if (TORRENT_INFO.tableinfo.doubanurl != TORRENT_INFO.descrinfo.doubanurl && TORRENT_INFO.descrinfo.doubanurl != '') {
            a.innerHTML += '<br><span style="color: red">豆瓣链接不一致</span><br>';
            error.push(`豆瓣链接不一致`)
        }
        //判断：图床
        if(TORRENT_INFO.tableinfo.imageHostBlacklist){
            a.innerHTML += '<br><span style="color: red">黑名单内的图床</span><br>';
            error.push(`黑名单内的图床`)
        }
        //判断：文件
        if (!TORRENT_INFO.results.zhiliang.match(/(BD|UHD|DVD)/i) && !TORRENT_INFO.titleinfo.group.match(/GodDramas/)) {
            if (TORRENT_INFO.results.chapter2 != '' && TORRENT_INFO.results.chapter1 != '') {
                if (TORRENT_INFO.results.chapter1 != '-1') {
                    if (TORRENT_INFO.results.files != parseInt(TORRENT_INFO.results.chapter2) - parseInt(TORRENT_INFO.results.chapter1) + 1) {
                        table.rows[4].cells[1].innerHTML += '<font size="3"><b><span style="color: red">错误的数量</font></b></font>';
                        a.innerHTML += '<br><span style="color: red">错误的文件数量</span><br>';
                        //console.log('第一种错误的文件数量');
                        error.push(`错误的文件数量`)
                    }
                } else {
                    if ((TORRENT_INFO.tableinfo.chapter2 == '' && TORRENT_INFO.results.files != parseInt(TORRENT_INFO.descrinfo.chapters))
                        || TORRENT_INFO.tableinfo.chapter2 != '' && TORRENT_INFO.results.files != 1) {
                        table.rows[4].cells[1].innerHTML += '<font size="3"><b><span style="color: red">错误的数量</font></b></font>';
                        a.innerHTML += '<br><span style="color: red">错误的文件数量</span><br>';
                        error.push(`错误的文件数量`)
                    }
                }
            } else if (TORRENT_INFO.results.chapter1 == '' && TORRENT_INFO.results.files != parseInt(TORRENT_INFO.results.chapter2)) {
                table.rows[4].cells[1].innerHTML += '<font size="3"><b><span style="color: red">错误的数量</font></b></font>';
                a.innerHTML += '<br><span style="color: red">错误的文件数量</span><br>';
                error.push(`错误的文件数量`)
            }
        }
    }
    //     if (TORRENT_INFO.results.chapter1 == '-1' && TORRENT_INFO.results.files != 1) {
    //         table.rows[4].cells[1].innerHTML += '<font size="3"><b><span style="color: red">错误的数量</font></b></font>';
    //         a.innerHTML += '<br><span style="color: red">错误的文件数量</span><br>';
    //     } else if ((TORRENT_INFO.tableinfo.chapter2 != '' && TORRENT_INFO.results.files != TORRENT_INFO.tableinfo.files)
    //         || (TORRENT_INFO.tableinfo.chapter2 == '' && TORRENT_INFO.descrinfo.chapters != '' && TORRENT_INFO.results.files != parseInt(TORRENT_INFO.descrinfo.chapters))) {
    //         table.rows[4].cells[1].innerHTML += '<font size="3"><b><span style="color: red">错误的数量</font></b></font>';
    //         a.innerHTML += '<br><span style="color: red">错误的文件数量</span><br>';
    //     }
    if (fileTypes != '') {
        a.innerHTML += `<span style="color: red">如有：包含多余文件（${[...new Set(fileTypes)].join(',')}）</span>`;
        table.rows[4].cells[1].innerHTML += `<font size="3"><b><span style="color: red">包含多余文件（${[...new Set(fileTypes)].join(',')}）</font></b></font>`;

        // 检查该制作组是否在白名单或合作组内
const isWhitelisted = groups.white.some(g => TORRENT_INFO.titleinfo.group.includes(g)) ||
                      groups.official.some(g => TORRENT_INFO.titleinfo.group.includes(g));

// 如果不是白名单/合作组，或者包含的额外文件不是允许的类型，则报错
if (!(isWhitelisted && fileTypes.every(type => type === '.jpg' || type === '.png' || type === '.txt' || type === '.ass'))) {
    error.push(`包含多余文件 ${fileTypes[0]}`);
}
    }
    //判断：重复
    table = document.getElementById('kothercopy').firstChild;
    if (table.tagName == 'TABLE') {
        let season = false;
        let dupe = false;
        for (let i = 1; i < table.rows.length; i++) {
            let otherTorrentTitle = table.rows[i].cells[1].textContent;
            let otherTorrentSize = table.rows[i].cells[2].textContent;
            if (otherTorrentSize == TORRENT_INFO.tableinfo.size && otherTorrentTitle.match(TORRENT_INFO.titleinfo.group) && otherTorrentTitle.match(TORRENT_INFO.titleinfo.format3d)) {
                table.rows[i].bgColor = '#FFC6B0';
                if (!dupe) {
                    a.innerHTML += '<br><span style="color: red">重复的种子！</span>';
                    table.parentNode.parentNode.firstChild.innerHTML += '<span style="color: red">重复！</span>';
                    error.push(`重复的种子`);
                    dupe = true;
                }
            } else if (otherTorrentSize == TORRENT_INFO.tableinfo.size && !TORRENT_INFO.titleinfo.group.match(/CatEDU/) && otherTorrentTitle.match(TORRENT_INFO.titleinfo.format3d)) {
                table.rows[i].bgColor = '#FFFABE';
                table.parentNode.parentNode.firstChild.innerHTML += '<span style="color: red">可能重复</span>';
                a.innerHTML += '<br><span style="color: red">可能重复！</span>';
            }
            if (TORRENT_INFO.results.season != '' && TORRENT_INFO.results.season != 'S01' && !season) {
                if (otherTorrentTitle.match('S01')) {
                    table.rows[i].bgColor = '#FFFABE';
                    if (!season) {
                        table.parentNode.parentNode.firstChild.innerHTML += '<span style="color: red">此种不为第一季但其他列表出现第一季！</span>';
                        season = true;
                    }
                }
            }
        }
    }
    //判断：BDInfo 码率
    if (TORRENT_INFO.bdinfo.video.bitrates.replace('kbps', '').trim() == '0') {
        a.innerHTML += '<br><span style="color: red">BDInfo 码率为 0</span><br>';
        error.push(`BDInfo 码率为 0`);
    }
    //判断：连续多个空格
    if (TORRENT_INFO.titleinfo.origin.match(/\s{2,}/g)) {
        a.innerHTML += '<br><span>主标题含连续多个空格</span><br>';
        error.push(`主标题含连续多个空格`);
    }
// ===================================================================
//  整合功能执行入口
// ===================================================================
const titleElForGroupCheck = document.getElementById('top');
const group = detectGroup(titleElForGroupCheck);
let groupInfoHTML = '';
if (group) {
    const color = group.type === 'official' ? 'green' : 'red';
    // 关键点：确保这里开头和结尾用的是反引号 ` (键盘左上角)
    groupInfoHTML = `
        <div>
            <span style="font-weight: bold;">制作组检测:</span><br>
            <span style="color:${color}; font-weight:bold">✓ ${group.type === 'official' ? '合作组' : '白名单'}：${group.name}</span>
        </div>
    `;
}

// 利用脚本A已经获取的IMDb链接
const imdbLink = TORRENT_INFO.tableinfo.imdburl || TORRENT_INFO.descrinfo.imdburl;
if (imdbLink) {
    const imdbIdMatch = imdbLink.match(/title\/(tt\d+)/);
    if (imdbIdMatch && imdbIdMatch[1]) {
        const imdbId = imdbIdMatch[1];
        // 在主悬浮窗 'a' 中添加一个用于放置IMDb信息的容器
        a.innerHTML += '<div id="imdb-helper-container"><hr style="border-top: 1px dashed #aaa; margin-top: 12px;"><i style="font-size:11px;">[IMDb助手] 正在加载数据...</i></div>';
        // 异步获取数据并填充上面的容器
        fetchAndDisplayImdbInfo(imdbId, groupInfoHTML);
    }
} else if (groupInfoHTML) {
    // 如果没有IMDb链接，但检测到了制作组，仍然显示制作组信息
    a.innerHTML += `<div id="imdb-helper-container"><hr style="border-top: 1px dashed #aaa; margin-top: 12px;">${groupInfoHTML}</div>`;
}
// ===================================================================
//  整合功能执行入口结束
// ===================================================================
    h1.innerHTML += span_correct;
    //     if (span_correct.match(/(red|orange)/i)) {
    //         h1.innerHTML += span_correct;
    //     } else if (TORRENT_INFO.mediainfo.full == '' && TORRENT_INFO.bdinfo.full == ''){
    //         h1.innerHTML += span_correct;
    //         a.innerHTML += '<span style="color: orange">主标题未检查</span>';
    //     } else {
    //         a.innerHTML += '<span>主标题片名、年份、分辨率、视频编码、音频编码正确</span>';
    //     }
    //if (TORRENT_INFO.mediainfo.full != '' || TORRENT_INFO.bdinfo.full != '' || infosp) {
        document.body.appendChild(a);
    //}
    console.log("checked", error);
    if (error.some(item => item.trim() === "不审核单集")){
        return ("不审核单集");
    } else if (document.querySelector('img[title="猫站帮帮组徽章"]') != null) {
        return ("有 Helper 意见");
    } else if (error.length === 0) {
        return ("未发现问题");
    } else {
        return error.join("\n");
    }
})();