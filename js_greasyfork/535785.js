// ==UserScript==
// @name         OB 种审脚本
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  脚本
// @license MIT
// @author       You
// @match        https://pt.ourhelp.club/details.php?*
// @match        https://ourbits.club/details.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourbits.club
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535785/OB%20%E7%A7%8D%E5%AE%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/535785/OB%20%E7%A7%8D%E5%AE%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('h1').before('<div style="display: inline-block; padding: 10px 30px; color: white; background: red; font-weight: bold;" id="assistant-tooltips"></div>');

    var cat_constant = {
        401: 'Movies',
        402: 'Movies-3D',
        419:'Concert',
        412:'TV-Episode',
        405:'TV-Pack',
        413:'TV-Show',
        410:'Documentary',
        411:'Animation',
        415:'Sports',
        414:'Music-Video',
        416:'Music'
    };
    var type_constant = {
        0:'请选择',
        12:'UHD Blu-ray',
        1:'FHD Blu-ray',
        3:'Remux',
        7:'Encode',
        9:'WEB-DL',
        5:'HDTV',
        2:'DVD',
        8:'CD'
    };

    var encode_constant = {
        0:'请选择',
        12:'H.264',
        14:'HEVC',
        15:'MPEG-2',
        16:'VC-1',
        17:'Xvid',
        19:'AV1',
        18:'Other'
    };

    var audio_constant = {
        0:'请选择',
        14:'Atmos',
        21:'DTS X',
        1:'DTS-HDMA',
        2:'TrueHD',
        4:'DTS',
        5:'LPCM',
        13:'FLAC',
        12:'APE',
        7:'AAC',
        6:'AC3',
        11:'WAV',
        32:'MPEG',
        33:'OPUS'
    };

    var resolution_constant = {
        0:'请选择',
        4:'SD',
        3:'720p',
        2:'1080i',
        1:'1080p',
        5:'2160p',
        99: ' 未检测到分辨率 '
    };

    var area_constant = {
        0:'请选择',
        1:'CN(中国大陆)',
        2:'US/EU(欧美)',
        3:'HK/TW(港台)',
        4:'JP(日)',
        5:'KR(韩)',
        6:'OT(其他)'
    }

    var group_constant = {
        0:'请选择',
        41:'原创/原抓'
    }

    var title = $('#top').contents().filter(function() {
        return this.nodeType === 3; // 只获取文本节点
    }).first().text().trim();
    console.log(title)
    //===============主标题info==============
    var title_type, title_encode, title_audio, title_resolution, title_group, title_is_complete;

    // 格式
    if(/\s(?:dvdrip|tvrip|bdrip|webrip)|(?:\s(?:dvd|dvd\s)|\s(?:bluray|blu-ray)|\sweb\s).*\sx26[45]/i.test(title)){
        title_type = 7
    } else if (/remux/i.test(title)) {
        title_type = 3;
    }else if (/(Blu-?Ray).*(UHD|2160p)|(UHD|2160p).*(Blu-?Ray)/i.test(title)) {
        title_type = 12;
    }else if (/Blu-?Ray/i.test(title)) {
        title_type = 1;
    } else if (/(\sweb-dl|\swebdl|\sweb\s)/i.test(title)) {
        title_type = 9;
    } else if (/(\shdtv|\shdtv\s)/i.test(title)) {
        title_type = 5;
    } else if (/(\sdvd|\sdvd\s)/i.test(title)) {
        title_type = 2;
    }
    // codec
    if (/(\sx265|\sh265|\sh\.265|\shevc)/i.test(title)) {
        title_encode = 14;
    } else if (/(\sx264|\sh264|\sh\.264|\savc)/i.test(title)) {
        title_encode = 12;
    } else if (/(\svc-1|\svc1)/i.test(title)) {
        title_encode = 16;
    } else if (/(mpeg2|mpeg-2)/i.test(title)) {
        title_encode = 15;
    }else if (/av1/i.test(title)) {
        title_encode = 19;
    }
    console.log(/atmos/i.test(title))
    // audiocodec
    if (/FLAC/i.test(title)) {
        title_audio = 13;
    } else if (/LPCM/i.test(title)) {
        title_audio = 5;
    } else if (/\struehd|\sddp|\sdd\+|\se-ac-3|\seac3/i.test(title) && /atmos/i.test(title)) {
        title_audio = 14;
    } else if (/ DDP| DD\+|E-?AC-?3/i.test(title)) {
        title_audio = 6;
    } else if (/ DD| AC3/i.test(title)) {
        title_audio = 6;
    } else if (/dts-hdma|dts-hd ma/i.test(title)) {
        title_audio = 1;
    } else if (/dts:x|dts-x|dts: x|dtsx/i.test(title)) {
        title_audio = 21;
    }  else if (/dts-hd|dts hd/i.test(title)) {
        title_audio = 10;
    } else if (/truehd/i.test(title)) {
        title_audio = 2;
    } else if (/ DTS/i.test(title)) {
        title_audio = 4;
    } else if (/AAC/i.test(title)) {
        title_audio = 7;
    } else if (/ape/i.test(title)) {
        title_audio = 12;
    } else if (/wav/i.test(title)) {
        title_audio = 11;
    } else if (/mp3/i.test(title)) {
        title_audio = 32;
    } else if (/ OPUS/i.test(title)) {
        title_audio = 33;
    }
    console.log("title_audio"+title_audio)
    // standard
    if (!/remastered/i.test(title) && (/\s2160p/i.test(title) || (/\suhd/i.test(title) && !/\s1080p/i.test(title)) || /\s4k\s/i.test(title))) {
        title_resolution = 5;
    } else if (/\s1080p/i.test(title)) {
        title_resolution = 1;
    } else if (/\s1080i/i.test(title)) {
        title_resolution = 2;
    } else if (/\s720p/i.test(title)) {
        title_resolution = 3;
    } else {
        title_resolution = 99;
    }
    if (/complete/i.test(title)) {
        title_is_complete = true;
    }

    console.log('title_type:', title_type, 'title_encode:', title_encode, 'title_audio:', title_audio, 'title_resolution:', title_resolution, 'title_group:', title_group, 'title_is_complete:', title_is_complete);
    //=======标签检查===========
    // 检查并输出DIY标签
    var isgy,iszz,isdiy;
    if (document.querySelector('span.tag.tag-diy')) {
        isdiy = true;
    }
    // 检查并输出国语标签
    if (document.querySelector('span.tag.tag-gy')) {
        isgy = true;
    }
    // 检查并输出中字标签
    if (document.querySelector('span.tag.tag-zz')) {
        iszz = true;
    }

    //===============基础信息=================
    const tr = document.querySelector('tr:has(b[data-clas-id])');
    if (!tr) return;

    // 定义并初始化变量
    let cat, type, encode, audio, resolution, area, group,subtitle;
    subtitle=$('td.rowhead:contains("副标题")').first().next('td').text();

    // 处理所有带有 data-clas-id 的 b 元素
    tr.querySelectorAll('b[data-clas-id]').forEach(b => {
        const clasId = b.getAttribute('data-clas-id');
        const text = b.textContent.trim().replace(/[:：]\s*$/, '');
        const nextText = b.nextSibling?.textContent.trim() || '';

        // 根据 data-clas 属性赋值给对应的变量
        switch (b.getAttribute('data-clas')) {
            case 'cat': cat = clasId; break;
            case 'medium': type = clasId; break;
            case 'codec': encode = clasId; break;
            case 'audiocodec': audio = clasId; break;
            case 'standard': resolution = clasId; break;
            case 'processing': area = clasId; break;
            case 'team': group = clasId; break;
        }

        console.log(`data-clas-id: ${clasId}, 类型: ${text}, 值: ${nextText}`);
    });
    console.log('变量值:', {cat, type, encode, audio, resolution, area, group,subtitle});
    // 豆瓣信息获取=======================
    function fetchDoubanInfo(attempt = 1) {
        // 1. 检查 kdouban 是否存在
        const kdouban = document.getElementById('kdouban');
        if (!kdouban) {
            console.log('未找到 div#kdouban，停止重试');
            return; // 直接结束，不重试
        }

        // 2. 获取豆瓣 URL
        const link = kdouban.querySelector('a[href^="https://movie.douban.com/subject"]');
        const doubanurl = link ? link.href : null;

        // 3. 获取 doubannew2 内容
        const doubannew2 = kdouban.querySelector('.doubannew2');
        if (!doubannew2) {
            console.log('未找到 .doubannew2 元素，2秒后重试...');
            if (attempt < 3) { // 最多重试3次
                setTimeout(() => fetchDoubanInfo(attempt + 1), 2000);
            } else {
                console.log('已达到最大重试次数，放弃获取豆瓣信息');
            }
            return;
        }

        // 4. 处理并输出数据
        const textContent = doubannew2.textContent;
        const formattedText = textContent.split('\n')
        .map(line => line.trim())
        .filter(line => line) // 移除空行（可选）
        .join('\n');

        console.log('豆瓣URL:', doubanurl);
        console.log(formattedText);
    }

    // 初始调用
    fetchDoubanInfo();

    //判断=========================
    let error = false;
    if (/[\uFF00-\uFFEF]/.test(title)) {
        $('#assistant-tooltips').append('请将主标题中的全角符号更换为半角符号。<br/>');
        error = true;
    }
    if (/[\u4e00-\u9fa5\uff01-\uff60]+/.test(title)&&!/至尊宝/.test(title) ) {
        $('#assistant-tooltips').append('主标题包含中文或中文字符<br/>');
        error = true;
    }
    if(/(-|@)(FGT|FRDS)/i.test(title)){
        $('#assistant-tooltips').append('主标题包含禁发小组，请检查<br/>');
        error = true;
    }
    if (!subtitle) {
        $('#assistant-tooltips').append('副标题为空<br/>');
        error = true;
    }

    if (!cat) {
        $('#assistant-tooltips').append('未选择分类<br/>');
        error = true;
    }
    if (!type) {
        $('#assistant-tooltips').append('未选择格式<br/>');
        error = true;
    } else {
        if (title_type && title_type != type) {
            $('#assistant-tooltips').append("标题检测格式为" + type_constant[title_type] + "，选择格式为" + type_constant[type] + '<br/>');
            error = true;
        }
    }
    console.log(type,title_type)
    if (!encode) {
        $('#assistant-tooltips').append('未选择主视频编码<br/>');
        error = true;
    } else {
        if (title_encode && title_encode != encode) {
            $('#assistant-tooltips').append("标题检测视频编码为" + encode_constant[title_encode] + "，选择视频编码为" + encode_constant[encode] + '<br/>');
            error = true;
        } else if (encode == 99 && group != 8) {
            $('#assistant-tooltips').append('视频编码选择为 other，请人工检查<br/>');
            error = true;
        }
    }
    if (!audio) {
        $('#assistant-tooltips').append('未选择主音频编码<br/>');
        error = true;
    } else {
        if (title_audio && title_audio != audio) {
            $('#assistant-tooltips').append("标题检测音频编码为" + audio_constant[title_audio] + "，选择音频编码为" + audio_constant[audio] + '<br/>');
            error = true;
        } else if (audio == 99) {
            $('#assistant-tooltips').append('音频编码选择为 other，请人工检查<br/>');
            error = true;
        }
    }
    if (!resolution && title_group != 8) {
        $('#assistant-tooltips').append('未选择分辨率<br/>');
        error = true;
    } else {
        if (title_resolution && title_resolution != resolution) {
            $('#assistant-tooltips').append("标题检测分辨率为" + resolution_constant[title_resolution] + "，选择分辨率为" + resolution_constant[resolution] + '<br/>');
            error = true;
        }
    }
    if (!area && title_group !== 8) {
        $('#assistant-tooltips').append('未选择地区<br/>');
        error = true;
    }
    if(/第?\s?[0-9]{1,4}-[0-9]{1,4}\s?(集|话|期)/.test(title)||/第?\s?[0-9]{1,4}\s?(集|话|期)/.test(title) && cat.match(/412/)){
        $('#assistant-tooltips').append('非合集类型影片，选择合集类型<br/>');
        error = true;
    }
    if ((title_is_complete || /[集期]全|全\s*?[\d一二三四五六七八九十百千]*\s*?[集期]|合集/i.test(subtitle)) && !cat.match(/405|411|410|413|415/)) {
        $('#assistant-tooltips').append('合集类型影片，未选择合集类型<br/>');
        error = true;
    }
    if(/国语|普通话|国配|台配|Mandarin/.test(subtitle) && !isgy){
        $('#assistant-tooltips').append('缺少国语标签<br/>');
        error = true;
    }
    if(/中字|简繁/.test(subtitle) && !iszz){
        $('#assistant-tooltips').append('缺少中字标签<br/>');
        error = true;
    }
    if((/DIY/.test(subtitle) || /DIY/.test(title)) && !isdiy){
        $('#assistant-tooltips').append('主副标题检测到 DIY 字符，请检查是否有 DIY 标签<br/>');
        error = true;
    }
    if (!title_audio){
        $('#assistant-tooltips').append('标题未检测到音频编码，请检查<br/>');
        error = true;
    }
    if (!title_resolution){
        $('#assistant-tooltips').append('标题未检测到分辨率，请检查<br/>');
        error = true;
    }
    if (!title_encode){
        $('#assistant-tooltips').append('标题未检测到视频编码，请检查<br/>');
        error = true;
    }

    //============判断图片==============
    // 配置常量
    const CONFIG = {
        //黑名单
        initialBlacklist: ['https://www.hddolby.com/pic/MoreScreenshot.png'],
        //防盗链图床
        errorPatterns: [/tu\.totheglory\.im/],
        tooltipDuration: 1500
    };

    // 状态管理
    let savedUrls = GM_getValue('savedUrls', []);
    let blacklist = [...new Set([...CONFIG.initialBlacklist, ...savedUrls])];

    // 工具函数
    const showTooltip = (msg, el) => {
        const tooltip = document.createElement('div');
        tooltip.textContent = msg;
        Object.assign(tooltip.style, {
            position: 'absolute', background: 'rgba(0,0,0,0.7)', color: 'white',
            padding: '5px 10px', borderRadius: '4px', zIndex: '9999', fontSize: '14px',
            left: `${el.getBoundingClientRect().left + window.scrollX}px`,
            top: `${el.getBoundingClientRect().top + window.scrollY - 30}px`
        });
        document.body.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), CONFIG.tooltipDuration);
    };

    // 黑名单操作
    const toggleUrl = (url, img) => {
        const index = savedUrls.indexOf(url);
        index === -1 ? savedUrls.push(url) : savedUrls.splice(index, 1);
        GM_setValue('savedUrls', savedUrls);
        blacklist = [...new Set([...CONFIG.initialBlacklist, ...savedUrls])];
        showTooltip(index === -1 ? '已保存到黑名单' : '已从黑名单移除', img);
    };

    // 图片处理
    const handleImageClick = e => {
        if (e.ctrlKey) {
            e.preventDefault();
            const url = e.target.src || e.target.href || e.target.dataset.src || e.target.currentSrc;
            url && toggleUrl(url, e.target);
        }
    };

    // 初始化图片监听
    const initImages = () => document.querySelectorAll('img').forEach(img =>
                                                                      img.addEventListener('click', handleImageClick)
                                                                     );

    // 动态加载监听
    new MutationObserver(initImages).observe(document.body, {childList: true, subtree: true});

    // 图片验证
    const kdescrDiv = document.getElementById("kdescr");
    if (kdescrDiv) {
        const validCount = [...kdescrDiv.getElementsByTagName("img")].filter(img =>
                                                                             !blacklist.some(b => img.src.includes(b)) &&
                                                                             !CONFIG.errorPatterns.some(p => p.test(img.src))
                                                                            ).length;
        validCount < 4 && ($('#assistant-tooltips').append('图片数量小于 4（含海报）<br>'), error = true);
    }

    const doubaninfo = document.querySelector('.doubannew2 .doubaninfo');

    //========豆瓣判断============
    if (doubaninfo) {
        // 获取页面上第一个class为doubannew2的元素
        const doubaninfo = document.querySelector('.doubannew2 .doubaninfo');

        /**
         * 在doubaninfo内容中查找指定参数对应的值
         * @param {string} param 要查找的参数，如"◎类　　型"
         * @returns {string} 返回对应的值，已去除首尾空格
         */
        function findDouban(param) {
            if (!doubaninfo) return '';

            // 获取doubaninfo的HTML内容
            const htmlContent = doubaninfo.innerHTML;

            // 创建正则表达式匹配模式
            // 匹配格式如：◎类　　别　喜剧 / 动作 / 科幻<br>
            const pattern = new RegExp(`${param}[　 ]+([^<]+)`);
            const match = htmlContent.match(pattern);

            if (match && match[1]) {
                // 返回匹配到的值并去除首尾空格
                return match[1].trim();
            }

            return '';
        }

        var douban_area = [], douban_cat;
        var isshow, isdoc, isani;

        var douban_genres = findDouban('◎类　　别')
        if (douban_genres.includes('真人秀')) {
            isshow = 1;
        }
        if (douban_genres.includes('纪录片')) {
            isdoc = 1;
        }
        if (douban_genres.includes('动画')) {
            isani = true;
        }
        var douban_type = findDouban('◎类　　型').split(" / ")[0];
        var country = findDouban('◎产　　地').split(/\s*\/\s*|\s+/);
        var language = findDouban('◎语　　言');
        const areaMappings = [
            { areas: ['中国', '中国大陆'], value: 1 },
            { areas: ['香港', '中国香港','台湾', '中国台湾'], value: 3 },
            { areas: ['日本'], value: 4 },
            { areas: ['韩国'], value: 5 },
            { areas: ['阿尔巴尼亚', '爱尔兰', '爱沙尼亚', '安道尔', '奥地利', '白俄罗斯', '保加利亚',
                      '北马其顿', '比利时', '冰岛', '波黑', '波兰', '丹麦', '德国', '法国',
                      '梵蒂冈', '芬兰', '荷兰', '黑山', '捷克', '克罗地亚', '拉脱维亚', '立陶宛',
                      '列支敦士登', '卢森堡', '罗马尼亚', '马耳他', '摩尔多瓦', '摩纳哥', '挪威',
                      '葡萄牙', '瑞典', '瑞士', '塞尔维亚', '塞浦路斯', '圣马力诺', '斯洛伐克',
                      '斯洛文尼亚', '乌克兰', '西班牙', '希腊', '匈牙利', '意大利', '英国',
                      '安提瓜和巴布达', '巴巴多斯', '巴哈马', '巴拿马', '伯利兹', '多米尼加', '多米尼克',
                      '格林纳达', '哥斯达黎加', '古巴', '海地', '洪都拉斯', '加拿大', '美国', '墨西哥',
                      '尼加拉瓜', '萨尔瓦多', '圣基茨和尼维斯', '圣卢西亚', '圣文森特和格林纳丁斯',
                      '特立尼达和多巴哥', '危地马拉', '牙买加', '阿根廷', '巴拉圭', '巴西', '秘鲁',
                      '玻利维亚', '厄瓜多尔', '哥伦比亚', '圭亚那', '苏里南', '委内瑞拉', '乌拉圭',
                      '智利', '捷克斯洛伐克','澳大利亚','西德','新西兰'], value: 2 }
        ];
        // 遍历映射表并检查 country 是否包含任何指定地区
        areaMappings.forEach(mapping => {
            if (mapping.areas.some(element => country.includes(element))) {
                douban_area.push(mapping.value);
            }
        });

        // 如果 douban_area 为空，则添加 99
        if (douban_area.length === 0) {
            douban_area.push(6);
        }

        if(isani){
            douban_cat = 411;
        }else if (isshow) {
            douban_cat = 413;
        } else if (isdoc) {
            douban_cat = 410;
        } else if(findDouban('◎集　　数')>1){
            douban_cat = [412,405];
        }else{
            douban_cat = 401
        }

        if (!isgy && !language.includes("普通话")) {
            $('#editor-tooltips').append('包含有普通话配音，需使用「国配」标签<br/>');
        }
        if (cat && douban_cat && Array.isArray(douban_cat) ? douban_cat.includes(cat) : douban_cat === cat) {
            $('#assistant-tooltips').append("豆瓣检测分类为" + cat_constant[douban_cat] + "，选择分类为" + cat_constant[cat] + '<br/>');
            error = true;
        }
        console.log(area,douban_area)
        if (area && douban_area && !douban_area.includes(parseInt(area))) {
            $('#assistant-tooltips').append("豆瓣检测地区为" + area_constant[douban_area[0]] + "，选择地区为" + area_constant[area] + '<br/>');
            error = true;
        }
        if(findDouban('◎上映日期') == ''){
            $('#editor-tooltips').append('豆瓣未检测到年份，请检查<br/>');
        }else if(title.match(/\.(18[8-9][0-9]|19[0-9]{2}|200[0-9]|201[0-9]|202[0-9]|2030)\./) && findDouban('◎上映日期').match(/^(\d{4})/)[1] != title.match(/\.(18[8-9][0-9]|19[0-9]{2}|200[0-9]|201[0-9]|202[0-9]|2030)\./)[1]){
            $('#editor-tooltips').append('豆瓣与标题年份不匹配，请检查<br/>');
        }
    }

    //========结束===============
    if (error) {
        $('#assistant-tooltips').css('background', 'red');
    } else {
        $('#assistant-tooltips').append('此种子未检测到异常');
        $('#assistant-tooltips').css('background', 'green');
    }
})();
