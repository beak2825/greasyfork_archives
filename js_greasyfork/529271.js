// ==UserScript==
// @name         UBits-torrent-assistant
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  UBits Club种子审核助手
// @author       leonc
// @match        *://ubits.club/details.php?id=*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529271/UBits-torrent-assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/529271/UBits-torrent-assistant.meta.js
// ==/UserScript==
// 提取 Mediainfo 中所有有效的 <b>Videos:</b> 区块（仅原盘类型使用）
function getVideoSections() {
    const baseMediainfo = $('#base-mediainfo'); // 使用正确的容器ID
    return baseMediainfo.find('b:contains("Videos:")').map(function() {
        // 向上查找三级父元素（与成功提取.txt相同的定位逻辑）
        const parentElement = $(this).parents().eq(2);
        if (parentElement.length && parentElement.text().includes('Videos:')) {
            // 统一处理空格和换行
            const text = parentElement.text().replace(/\s+/g, ' ').trim();
            return text;
        }
        return null;
    }).get().filter(Boolean); // 过滤无效项
}

// 提取 Mediainfo 中所有有效的 <b>Audios:</b> 区块（仅原盘类型使用）
function getAudioSections() {
    const baseMediainfo = $('#base-mediainfo'); // 使用正确的容器ID
    return baseMediainfo.find('b:contains("Audios:")').map(function() {
        // 向上查找三级父元素（与成功提取.txt相同的定位逻辑）
        const parentElement = $(this).parents().eq(2);
        if (parentElement.length && parentElement.text().includes('Audios:')) {
            // 统一处理空格和换行
            const text = parentElement.text().replace(/\s+/g, ' ').trim();
            return text;
        }
        return null;
    }).get().filter(Boolean); // 过滤无效项
}

// 提取网页中 <tr id="subtitle"> 内的 Subtitles 信息（原盘类型优先使用）
function getSubtitleText() {
    const subtitleTr = $('#subtitle'); // 通过 id 精准定位
    if (subtitleTr.length) {
        // 提取 <b>Subtitles: </b> 后的文本，忽略表格等无关内容
        const subtitleText = subtitleTr.text().replace(/\s+Subtitles:\s+/, '').trim();
        return subtitleText;
    }
    return '';
}


(function () {
    'use strict';

    // 定义常量（与UBits实际字段匹配）
    const cat_constant = {
        401: '电影(Movie)',
        402: '电视剧(TV Series)',
        404: '纪录片(Documentaries)',
        405: '动漫(Animations)',
        403: '综艺（TV Shows）',
        409: '演唱会(Misic Videos)',
        407: '体育节目(Sports)',
        406: '音乐CD(Music CD Tracker)'
    };
    const type_constant = {
        10: '4K UHD原盘(UltraHD Blu-ray)',
        1: '蓝光原盘(Blu-ray)',
        4: '流媒体(WEB-DL)',
        3: 'REMUX',
        7: '(压制)Encode',
        2: 'HD DVD',
        5: 'HDTV',
        6: 'DVDR',
        8: 'Lossless Music',
        9: 'Track'
    };
    const encode_constant = {
        7: 'H265(HEVC/x265)',
        1: 'H264(AVC/x264)',
        11: 'AV1',
        2: 'VC-1',
        4: 'MPEG-2',
        10: 'AVS',
        3: 'Xvid',
        9: 'MPEG-4',
        5: 'Other'
    };
    const audio_constant = {
        8: 'Dolby Atmos',
        9: 'DTS:X',
        10: 'TrueHD',
        11: 'DTS-HD MA/HR',
        13: 'LPCM',
        12: 'DD+(Dolby Digital Plus)',
        14: 'DD(AC3)',
        3: 'DTS',
        6: 'AAC',
        1: 'FLAC',
        2: 'APE',
        5: 'OGG',
        4: 'MP3',
        7: 'Other'
    };
    const resolution_constant = {
        6: '4320p',
        5: '2160p',
        7: '1440p',
        1: '1080p',
        2: '1080i',
        3: '720p',
        4: 'SD'
    };

    const region_constant = {
        1: '中国大陆(China Mainland)',
        2: '中国香港/澳门(China HK/MC)',
        3: '中国台湾(China Taiwan)',
        4: '欧美(Euro/American)',
        5: '日本(Japanese)',
        6: '韩国(Korea)',
        7: '泰国(Thailand)',
        8: '印度(India)',
        9: '俄罗斯(Russia)',
        10: '东南亚(Southeast Asia)',
        11: '其它(Other)'
    };

    const group_constant = {
        1: 'UBits',
        6: 'UBWEB',
        7: 'UBTV',
        5: 'Other'
    };

    // 错误信息数组（提前声明）
    let errorMessages = [];

    // 获取页面元素信息（优化选择器）
    const titleElement = $('#top');
    const title = titleElement.contents().filter(function () {
        return this.nodeType === 3;
    }).first().text().trim();

    const subtitle = $('td:contains("副标题")').next('td').text().trim();
    const basicInfo = $('td:contains("基本信息")').next('td').text().trim();

    // 提取字段并修正正则表达式（支持字段缺失情况）
    const catMatch = basicInfo.match(/类型:(.*?)(媒介|视频编码|音频编码|分辨率|地区|制作组|$)/);
    const typeMatch = basicInfo.match(/媒介:(.*?)(视频编码|音频编码|分辨率|地区|制作组|$)/);
    const encodeMatch = basicInfo.match(/视频编码:(.*?)(音频编码|分辨率|地区|制作组|$)/);
    const audioMatch = basicInfo.match(/音频编码:(.*?)(分辨率|地区|制作组|$)/);
    const resolutionMatch = basicInfo.match(/分辨率:(.*?)(地区|制作组|$)/);
    const regionMatch = basicInfo.match(/地区:(.*?)(制作组|$)/);
    const groupMatch = basicInfo.match(/制作组:(.*)/);

    const catText = catMatch? catMatch[1].trim() : '';
    const typeText = typeMatch? typeMatch[1].trim() : '';
    const encodeText = encodeMatch? encodeMatch[1].trim() : '';
    const audioText = audioMatch? audioMatch[1].trim() : '';
    const resolutionText = resolutionMatch? resolutionMatch[1].trim() : '';
    const regionText = regionMatch? regionMatch[1].trim() : '';
    const groupText = groupMatch? groupMatch[1].trim() : '';

    // 提前初始化 type 变量
    let type = Object.keys(type_constant).find(key => type_constant[key] === typeText);

    let mediainfo = $('.nexus-media-info-raw pre').text().trim();
    let mediainfoArr = {};
    if (type!== '1' && type!== '10') {
        const arr = mediainfo.split(/[\r\n]+/);
        let parentKey = "";
        mediainfoArr = {};
        for (let i = 0; i < arr.length; i++) {
            let value = arr[i].trim();
            if (value === '') {
                continue;
            }
            let rowKeyValue = value.split(':', 2);
            rowKeyValue = $.map(rowKeyValue, function (val) {
                return val.trim();
            }).filter(Boolean);
            if (rowKeyValue.length === 1) {
                parentKey = rowKeyValue[0];
            } else if (rowKeyValue.length === 2) {
                if (parentKey === '') {
                    continue;
                }
                if (!mediainfoArr[parentKey]) {
                    mediainfoArr[parentKey] = {};
                }
                mediainfoArr[parentKey][rowKeyValue[0]] = rowKeyValue[1];
            }
        }
    }

    const imdbLink = $('a[href^="https://imdb.com/title/"]').attr('href');
    const doubanLink = $('a[href^="https://movie.douban.com/subject/"]').attr('href');
    const tags = $('td:contains("标签")').next('td').find('span').map(function () {
        return $(this).text();
    }).get();
    const screenshot = [];
    $('#kdescr img').each(function () {
        const src = $(this).attr('src');
        if (src) {
            screenshot.push(src);
        }
    });

    // 解析信息
    let cat = Object.keys(cat_constant).find(key => cat_constant[key] === catText);
    let encode = Object.keys(encode_constant).find(key => encode_constant[key] === encodeText);
    let audio = Object.keys(audio_constant).find(key => {
        const audioConstantValue = audio_constant[key];
        return audioText.includes(audioConstantValue);
    });
    let resolution = Object.keys(resolution_constant).find(key => resolution_constant[key] === resolutionText);
    let region = Object.keys(region_constant).find(key => region_constant[key] === regionText);
    let group = Object.keys(group_constant).find(key => group_constant[key] === groupText);

    // 主标题检查
    if (/[\u4e00-\u9fa5\uff01-\uff60]/.test(title)) {
        errorMessages.push('主标题包含中文字符或全角符号');
    }

    // 副标题检查
    if (!subtitle) {
        errorMessages.push('副标题为空');
    }

    // 分类检查
    if (!cat) {
        errorMessages.push('未选择分类');
    }

    // 媒介类型检查
    if (!type) {
        errorMessages.push('未选择媒介类型');
    }

    // 视频编码检查
    if (!encode) {
        errorMessages.push('未选择主视频编码');
    }

    // 音频编码检查
    if (!audio) {
        errorMessages.push('未选择主音频编码');
    }

    // 分辨率检查
    if (!resolution) {
        errorMessages.push('未选择分辨率');
    }

    // 地区检查
    if (!region) {
        errorMessages.push('未选择地区');
    }

    // 制作组检查
    if (!group) {
        errorMessages.push('未选择制作组');
    }

    // IMDb和豆瓣链接检查
    if (!imdbLink &&!doubanLink) {
        errorMessages.push('未检测到IMDb或豆瓣链接');
    }

    // Mediainfo检查
    if (type!== '1' && type!== '10' &&!mediainfo) {
        errorMessages.push('Mediainfo信息为空');1
    }

    // 标签检查
    const requiredTags = {
        '原生原盘': () => (type === '1' || type === '10') && title &&!(/(DIY|Diy|diy|DiY)/.test(title) || /(DIY|Diy|diy|DiY)/.test(subtitle)),
        'DIY': () => (type === '1' || type === '10') && title && (/(DIY|Diy|diy|DiY)/.test(title) || /(DIY|Diy|diy|DiY)/.test(subtitle)),

        '中字': () => {
            if (type === '1' || type === '10') {
                const subtitleText = getSubtitleText();
                return /(Chinese|中文|中字|简|繁)/.test(subtitleText);
            } else {
                for (let textKey in mediainfoArr) {
                    if (textKey.startsWith('Text') && mediainfoArr[textKey]) {
                        let language = mediainfoArr[textKey]['Language'];
                        let title = mediainfoArr[textKey]['Title'];
                        if (language && language.includes('Chinese') ||
                            (title && /(Chinese|中文|中字|简|繁)/.test(title))) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        '国配': () => {
            if (type === '1' || type === '10') {
                const audioSections = getAudioSections();
                // 检查音频区块中是否包含中文相关语言关键词
                //console.log('国配检查使用的区块：', audioSections);
                const hasChineseAudio = audioSections.some(section =>
                                                           /(Chinese|汉语|普通话|中文|Mandarin)/.test(section)
                                                          );
                return hasChineseAudio;
            }else {
                for (let audioKey in mediainfoArr) {
                    if (audioKey.startsWith('Audio') && mediainfoArr[audioKey]) {
                        let language = mediainfoArr[audioKey]['Language'];
                        let title = mediainfoArr[audioKey]['Title'];
                        if (/(Chinese|Mandarin)/.test(language) || title && /(Chinese|汉语|普通话|中文|Mandarin)/.test(title)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        '粤语': () => {
            if (type === '1' || type === '10') {
                const audioSections = getAudioSections();
                // 检查音频区块中是否包含粤语相关关键词
                const hasCantoneseAudio = audioSections.some(section =>
                                                             /(Cantonese|粤语)/.test(section)
                                                            );
        return hasCantoneseAudio;
            }else {
                for (let audioKey in mediainfoArr) {
                    if (audioKey.startsWith('Audio') && mediainfoArr[audioKey]) {
                        let language = mediainfoArr[audioKey]['Language'];
                        let title = mediainfoArr[audioKey]['Title'];
                        if (/(Cantonese)/.test(language) || title && /(Cantonese|粤语)/.test(title)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        '杜比视界': () => {
            if (type === '1' || type === '10') {
                const videoSections = getVideoSections();
                //console.log('杜比视界检查使用的区块：', videoSections);
                return videoSections.some(section => section.includes('HDR: Dolby Vision'));
            }else {
                for (let key in mediainfoArr) {
                    if (key.startsWith('Video') && mediainfoArr[key]['HDR format']) {
                        return mediainfoArr[key]['HDR format'].includes('Dolby Vision');
                    }
                }
            }
            return false;
        },
        'HDR10+': () => {
            if (type === '1' || type === '10') {
                const videoSections = getVideoSections();
                return videoSections.some(section => section.includes('HDR: HDR10+'));
            }else {
                for (let key in mediainfoArr) {
                    if (key.startsWith('Video') && mediainfoArr[key]['HDR format']) {
                        return mediainfoArr[key]['HDR format'].includes('HDR10+');
                    }
                }
            }
            return false;
        },
        'HDR10': () => {
            if (type === '1' || type === '10') {
                const videoSections = getVideoSections();
                return videoSections.some(section =>
                                          section.includes('HDR: HDR10') &&
                                          !section.includes('HDR: HDR10+') // 排除 HDR10+ 混淆
                                         );
            }else {
                for (let key in mediainfoArr) {
                    if (key.startsWith('Video') && mediainfoArr[key]['HDR format']) {
                        return mediainfoArr[key]['HDR format'].includes('HDR10') &&!mediainfoArr[key]['HDR format'].includes('HDR10+');
                    }
                }
            }
            return false;
        },
        'HLG': () => {
            if (type === '1' || type === '10') {
                const videoSections = getVideoSections();
                return videoSections.some(section => section.includes('HDR: HLG'));
            }else {
                for (let key in mediainfoArr) {
                    if (key.startsWith('Video') && mediainfoArr[key]['HDR format']) {
                        return mediainfoArr[key]['HDR format'].includes('HLG');
                    }
                }
            }
            return false;
        },
        '菁彩HDR': () => {
            if (type === '1' || type === '10') {
                const videoSections = getVideoSections();
                return videoSections.some(section => section.includes('HDR: HDR Vivid'));
            }else {
                for (let key in mediainfoArr) {
                    if (key.startsWith('Video') && mediainfoArr[key]['HDR format']) {
                        return mediainfoArr[key]['HDR format'].includes('HDR Vivid');
                    }
                }
            }
            return false;
        },
        '合集': () => {
            if (cat === '402' || cat === '404' || cat === '405' || cat === '403' || cat === '407' || cat === '406') {
                return title.includes('合集') || subtitle.includes('合集') || title.includes('Complete') || subtitle.includes('Complete') || /S\d{2}(?!E\d{2})/.test(title) || /S\d{2}(?!E\d{2})/.test(subtitle)
            }else
                return false;
        },
        '特效': () => {
            if (subtitle.includes('特效')) {
                return true;
            }
            if (type === '1' || type === '10') {
                const textSection = mediainfo.match(/SUBTITLES:[\s\S]*?(?=FILES:)/);
                return textSection && /特效/.test(textSection[0]);
            }
            if (type!== '1' && type!== '10') {
                for (let textKey in mediainfoArr) {
                    if (textKey.startsWith('Text') && mediainfoArr[textKey] && mediainfoArr[textKey]['Title']) {
                        if (mediainfoArr[textKey]['Title'].includes('特效')) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        '连载': () => {
            if (cat === '402' || cat === '404' || cat === '405' || cat === '403' || cat === '407' || cat === '406') {
                return /S\d+E\d+/.test(title) || /S\d+E\d+/.test(subtitle)
            } else
                return false;
        },
        '菜单修改': () => subtitle.includes('菜单修改') || subtitle.includes('修改菜单')
    };

    // 正向和反向标签检查函数
    function checkTags() {
        Object.entries(requiredTags).forEach(([tag, condition]) => {
            const shouldHaveTag = condition();
            const hasTag = tags.includes(tag);

            if (shouldHaveTag && !hasTag) {
                errorMessages.push(`缺少必要标签：${tag}`);
            } else if (!shouldHaveTag && hasTag) {
                // 新增web特殊处理逻辑
                if (tag === '中字' && title.toLowerCase().includes('web')) {
                    errorMessages.push(`勾选了标签 "中字"，请人工核对是否为中字硬字幕`);
                } else {
                    errorMessages.push(`勾选了标签 "${tag}"，但可能不满足该标签的条件`);
                }
            }
        });
    }

    checkTags();

    // 禁止标签检查（示例）
    const forbiddenTags = ['错误标签1', '错误标签2'];
    tags.forEach(tag => {
        if (forbiddenTags.includes(tag)) {
            errorMessages.push(`存在禁止标签：${tag}`);
        }
    });

    // 截图检查
    if (!title.endsWith('-UBWEB') && screenshot.length < 3) {
        errorMessages.push('截图数量少于3张');
    }

    // 显示结果
    const insertPosition = $('#top').prev();
    const commonStyle = 'display: inline-block; padding: 10px 20px; font-weight: bold; border-radius: 4px; margin: 10px 0;';
    if (errorMessages.length > 0) {
        const errorDiv = $('<div style="' + commonStyle + 'color: white; background: #FFA500; border: 1px solid #FF8C00;" id="ubits-assistant-tooltips"></div>');
        errorDiv.append('<b style="color: #222222; font-size: 1.2em; display: block; margin-bottom: 8px;">脚本初审结果</b>');
        errorDiv.append('<div style="font-size: 1.1em; line-height: 1.6;"><b>【脚本建议】</b>');
        errorMessages.forEach(msg => errorDiv.append(`<div>${msg}</div>`));
        errorDiv.append('</div>');
        insertPosition.after(errorDiv);
    } else {
        const successDiv = $('<div style="' + commonStyle + 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;" id="ubits-assistant-tooltips"></div>');
        successDiv.append('<b style="color: #222222; font-size: 1.2em; display: block; margin-bottom: 8px;">脚本初审结果</b>');
        successDiv.append('<div style="font-size: 1.1em; line-height: 1.6;"> 种子信息未检测到异常</div>');
        insertPosition.after(successDiv);
    }
})();