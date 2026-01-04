// ==UserScript==
// @name         Aud-Torrent-Assistant
// @namespace    http://tampermonkey.net/
// @version      1.0.9.6
// @description  观众种审助手
// @author       Shawson
// @match        http*://audiences.me/details.php*
// @icon         https://audiences.me/favicon.ico
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519646/Aud-Torrent-Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/519646/Aud-Torrent-Assistant.meta.js
// ==/UserScript==

/**
 * Edit by Shawson（改自Kesa的hdd种审脚本）
 * 需求:
 * 1. 主标题不能含有中文
 * 2. 未选择/错误选择媒介
 * 3. 未选择/错误选择音视频编码
 * 4. 未选择/错误选择分辨率 (主标题有4K 或者 2160p 两个东西, 算一个判断)
 * 5. 是否有在做种
 * 6. 把检测结果直接填写在种子评论区吗
 * 7. 放大基本信息字体
 * 8. 放大mediainfo中的关键字
 * 9. 识别不信任制作组
 */

(function () {
    'use strict';

    /**种子分类 */
    const cat_constant = {
        401: '电影',
        402: '剧集',
        403: '综艺',
        404: '有声书',
        405: '电子书',
        406: '纪录片',
        407: '体育',
        408: '音乐',
        409: '其他',
        410: '游戏',
        412: '学习',
    };

    /**媒介类型 */
    const type_constant = {
        12: 'UHD Blu-ray 原盘',
        13: 'UHD Blu-ray DIY',
        1: 'Blu-ray 原盘',
        14: 'Blu-ray DIY',
        3: 'REMUX',
        15: 'Encode',
        5: 'HDTV',
        10: 'WEB-DL',
        2: 'DVD 原盘',
        8: 'CD',
        9: 'Track',
        11: 'Other',
    };


    /**视频编码类型 */
    const encode_constant = {
        6: 'H.265(HEVC)',
        1: 'H.264(AVC)',
        2: 'VC-1',
        4: 'MPEG-2',
        7: 'AV1',
        5: 'Other',
    };

    /**音频编码类型 */
    const audio_constant = {
        25: 'DTS:X',
        26: 'TrueHD Atmos',
        19: 'DTS-HD MA',
        20: 'TrueHD',
        21: 'LPCM',
        3: 'DTS',
        18: 'DD/AC3',
        27: 'OPUS',
        6: 'AAC',
        1: 'FLAC',
        2: 'APE',
        22: 'WAV',
        23: 'MP3',
        24: 'M4A',
        7: 'Other',
    };

    /**分辨率 */
    const resolution_constant = {
        10: '8K',
        5: '4K',
        1: '1080p',
        2: '1080i',
        3: '720p',
        4: 'SD',
        11: 'None',
    };

    /**制作组 */
    const group_constant = {
        19: 'Audies',
        21: 'ADE',
        20: 'ADWeb',
        23: 'ADAudio',
        24: 'ADeBook',
        25: 'ADMusic',
        5: 'Other',
    }


    $ = jQuery;

    // 1. FIXME: 从标题筛选信息------------------------------------------------------------
    let title = $('#top').text();
    console.log('原始title: ', title);

    title = title
        // .replace('禁转', '')
        .replace("[免费]", "")
        .replace("[2X免费]", "")
        .replace("[2xfree]", "")
        .replace("[50%]", "")
        // .replace("[30%]", "")
        // .replace("[2X 50%]", "")
        // .replace("[2X]", "")
        // .replace("(待定)", "")
        // .replace("(冻结)", "")
        .replace(/剩余时间.*$/, "")
        .trim();
    console.log('过滤后title: ', title);

    let title_lowercase = title.toLowerCase();

    /**标题_媒介类型 */
    let title_type;
    /**标题_视频编码 */
    let title_encode;
    /**标题_音频编码 */
    let title_audio;
    /**标题_分辨率 */
    let title_resolution;
    /**标题_制作组 */
    let title_group;
    /**标题_不晓得 */
    let title_is_complete;
    /**标题_未检测到警告 (NOTE: 使用位运算标记) */
    let title_warn_no = 0;

if (title_lowercase.indexOf("remux") !== -1) {
    // REMUX 优先级最高
    title_type = 3;
} else if ((title_lowercase.indexOf("uhd blu-ray") !== -1 || title_lowercase.indexOf("uhd bluray") !== -1) && title_lowercase.indexOf("diy") !== -1) {
    // UHD Blu-ray DIY
    title_type = 13;
} else if ((title_lowercase.indexOf("uhd blu-ray") !== -1 || title_lowercase.indexOf("uhd bluray") !== -1) && (title_lowercase.indexOf("x264") !== -1 || title_lowercase.indexOf("x265") !== -1)) {
    // UHD Blu-ray + x264/x265
    title_type = 15;  // Encode
    if (title_lowercase.indexOf("x264") !== -1) {
        title_resolution = 1;  // H.264(AVC)
    } else if (title_lowercase.indexOf("x265") !== -1) {
        title_resolution = 6;  // H.265(HEVC)
    }
} else if (title_lowercase.indexOf("uhd blu-ray") !== -1 || title_lowercase.indexOf("uhd bluray") !== -1) {
    // UHD Blu-ray 原盘
    title_type = 12;
} else if ((title_lowercase.indexOf("blu-ray") !== -1 || title_lowercase.indexOf("bluray") !== -1) && title_lowercase.indexOf("diy") !== -1) {
    // Blu-ray DIY
    title_type = 14;
} else if ((title_lowercase.indexOf("blu-ray") !== -1 || title_lowercase.indexOf("bluray") !== -1) && (title_lowercase.indexOf("x264") !== -1 || title_lowercase.indexOf("x265") !== -1)) {
    // Blu-ray + x264/x265
    title_type = 15;  // Encode
    if (title_lowercase.indexOf("x264") !== -1) {
        title_resolution = 1;  // H.264(AVC)
    } else if (title_lowercase.indexOf("x265") !== -1) {
        title_resolution = 6;  // H.265(HEVC)
    }
} else if (title_lowercase.indexOf("blu-ray") !== -1 || title_lowercase.indexOf("bluray") !== -1) {
    title_type = 1;  // Blu-ray 原盘
} else if (title_lowercase.indexOf("webrip") !== -1 || title_lowercase.indexOf("web-rip") !== -1 || title_lowercase.indexOf("dvdrip") !== -1 || title_lowercase.indexOf("bdrip") !== -1) {
    // x264 x265 优先级次之
    title_type = 15;  // Encode
} else if (title_lowercase.indexOf("hdtv") !== -1) {
    // HDTV 放在 UHD 之前
    title_type = 5;
} else if (title_lowercase.indexOf("hddvd") !== -1 || title_lowercase.indexOf("hd dvd") !== -1) {
    title_type = 2;  // DVD 原盘
} else if (title_lowercase.indexOf("web-dl") !== -1 || title_lowercase.indexOf("webdl") !== -1 || title_lowercase.indexOf("web") !== -1) {
    title_type = 10;  // WEB-DL
} else if (title_lowercase.indexOf("webrip") !== -1) {
    title_type = 7;  // WEB-DL
} else if (title_lowercase.indexOf("dvd") !== -1) {
    title_type = 2;  // DVD 原盘
    title_resolution = 4;  // MPEG-2
} else if (title_lowercase.indexOf("cd") !== -1) {
    title_type = 8;  // CD
} else {
    console.warn('未检测到已有媒介类型');
    title_warn_no += 1;
}

// 定义和初始化副标题
let subtitle_lowercase = ""; // 副标题初始化

// 查找副标题
document.querySelectorAll('.rowhead.nowrap').forEach(function(rowheadElement) {
    if (rowheadElement.textContent.includes("副标题")) {
        let rowfollowElement = rowheadElement.nextElementSibling;
        if (rowfollowElement && rowfollowElement.classList.contains('rowfollow')) {
            subtitle_lowercase = rowfollowElement.textContent.toLowerCase();
            console.log('副标题: ', subtitle_lowercase);
        } else {
            console.warn('未找到副标题 .rowhead.nowrap 元素后面的 .rowfollow 元素');
        }
    }
});

// 检查主标题和副标题的组合
if ((title_lowercase.indexOf("uhd blu-ray") !== -1 || title_lowercase.indexOf("uhd bluray") !== -1) && subtitle_lowercase.indexOf("diy") !== -1) {
    title_type = 13;
    console.warn('检测到 UHD Blu-ray 和 DIY 组合，媒介类型设置为 13');
}
else if ((title_lowercase.indexOf("blu-ray") !== -1 || title_lowercase.indexOf("bluray") !== -1) && subtitle_lowercase.indexOf("diy") !== -1) {
    title_type = 14;
    console.warn('检测到 UHD Blu-ray 和 DIY 组合，媒介类型设置为 13');
}

   // codec
if (title_lowercase.indexOf("x264") !== -1
    || title_lowercase.indexOf("h264") !== -1
    || title_lowercase.indexOf("h 264") !== -1
    || title_lowercase.indexOf("h.264") !== -1
    || title_lowercase.indexOf("avc") !== -1
) {
    title_encode = 1;  // H.264(AVC)
} else if (title_lowercase.indexOf("x265") !== -1
    || title_lowercase.indexOf("h265") !== -1
    || title_lowercase.indexOf("h 265") !== -1
    || title_lowercase.indexOf("h.265") !== -1
    || title_lowercase.indexOf("hevc") !== -1
) {
    title_encode = 6;  // H.265(HEVC)
} else if (title_lowercase.indexOf("vc-1") !== -1
    || title_lowercase.indexOf("vc1") !== -1
) {
    title_encode = 2;  // VC-1
} else if (title_lowercase.indexOf("mpeg2") !== -1
    || title_lowercase.indexOf("mpeg-2") !== -1
) {
    title_encode = 4;  // MPEG-2
} else if (title_lowercase.indexOf("av1") !== -1) {
    title_encode = 7;  // AV1
} else {
    title_encode = 5;  // Other
    console.warn('未检测到已有视频编码类型');
    title_warn_no += 2;
}


// audiocodec
if (title_lowercase.indexOf("dts-hd ma") !== -1 || title_lowercase.indexOf("dtshd") !== -1) {
    title_audio = 19;  // DTS-HD MA
} else if (title_lowercase.indexOf("dts-x") !== -1 || title_lowercase.indexOf("dts:x") !== -1) {
    title_audio = 25;  // DTS:X
} else if (title_lowercase.indexOf("truehd atmos") !== -1 || title_lowercase.indexOf("truehd 7.1 atmos") !== -1  || title_lowercase.indexOf("atmos truehd 7.1") !== -1
          || title_lowercase.indexOf("atmos truehd7.1") !== -1 || title_lowercase.indexOf("truehd 7.1") !== -1 || title_lowercase.indexOf("truehd7.1") !== -1) {
    title_audio = 26;  // TrueHD Atmos
} else if (title_lowercase.indexOf("truehd") !== -1) {
    title_audio = 20;  // TrueHD
} else if (title_lowercase.indexOf("lpcm") !== -1 || title_lowercase.indexOf("pcm") !== -1) {
    title_audio = 21;  // LPCM
} else if (title_lowercase.indexOf("dts") !== -1) {
    title_audio = 3;  // DTS
} else if (title_lowercase.indexOf("ddp") !== -1 || title_lowercase.indexOf("eac3") !== -1 || title_lowercase.indexOf("dd+") !== -1 || title_lowercase.indexOf("dd") !== -1) {
    title_audio = 18;  // DD/AC3 (E-AC-3)
} else if (title_lowercase.indexOf("ac3") !== -1 || title_lowercase.indexOf("ac-3") !== -1 || title_lowercase.indexOf("dd1") !== -1 || title_lowercase.indexOf("dd2") !== -1 || title_lowercase.indexOf("dd5") !== -1 || title_lowercase.indexOf("dd.2") !== -1 || title_lowercase.indexOf("dd 5.1") !== -1 || title_lowercase.indexOf("dd.5") !== -1) {
    title_audio = 18;  // DD/AC3
} else if (title_lowercase.indexOf("aac") !== -1) {
    title_audio = 6;  // AAC
} else if (title_lowercase.indexOf("flac") !== -1) {
    title_audio = 1;  // FLAC
} else if (title_lowercase.indexOf("opus") !== -1) {
    title_audio = 27;  // OPUS
} else if (title_lowercase.indexOf("ape") !== -1) {
    title_audio = 2;  // APE
} else if (title_lowercase.indexOf("wav") !== -1) {
    title_audio = 22;  // WAV
} else if (title_lowercase.indexOf("mp3") !== -1) {
    title_audio = 23;  // MP3
} else if (title_lowercase.indexOf("m4a") !== -1) {
    title_audio = 24;  // M4A
} else {
    title_audio = 7;  // Other
    console.warn('未检测到已有音频编码类型');
    title_warn_no += 4;
}


// resolution
if (title_lowercase.indexOf("4320p") !== -1 || title_lowercase.indexOf("8k") !== -1) {
    title_resolution = 10;  // 8K
} else if (title_lowercase.indexOf("2160p") !== -1 || title_lowercase.indexOf("uhd") !== -1 || title_lowercase.indexOf("4k") !== -1) {
    title_resolution = 5;  // 4K
} else if (title_lowercase.indexOf("1080p") !== -1) {
    title_resolution = 1;  // 1080p
} else if (title_lowercase.indexOf("1080i") !== -1) {
    title_resolution = 2;  // 1080i
} else if (title_lowercase.indexOf("720p") !== -1) {
    title_resolution = 3;  // 720p
} else if (title_lowercase.indexOf("sd") !== -1 || title_lowercase.indexOf("480i") !== -1 || title_lowercase.indexOf("480p") !== -1) {
    title_resolution = 4;  // SD
} else {
    title_resolution = 11;  // None
    console.warn('未检测到已有分辨率类型');
    title_warn_no += 8;
}



    if (title_lowercase.indexOf('complete') !== -1) {
        title_is_complete = true;
    }

    // FIXME: 2. 从种子表单筛选信息------------------------------------------------------------
    let subtitle;
    /**表单_种子种类 */
    let cat;
    /**表单_媒介类型 */
    let type;
    /**表单_视频编码 */
    let encode;
    /**表单_音频编码 */
    let audio;
    /**表单_分辨率 */
    let resolution;
    let area;
    let group;
    let anonymous;
    let is_complete;

    /**做种人数 */
    let seeders;

    let poster;
    let fixtd, mediainfo, mediainfo_short;

    let tdlist = $('#outer td.rowhead');
    for (let i = 0; i < tdlist.length; i++) {
        let td = $(tdlist[i]);
        if (td.text() == '副标题' || td.text() == '副標題') {
            subtitle = td.parent().children().last().text();
        }

        if (td.text() == '下载') {
            let text = td.parent().children().last().text();
            if (text.indexOf('匿名') >= 0) {
                anonymous = 1;
            }
        }

        if (td.text() == '基本信息') {
            console.log('------表单信息初步解析----------------------:');
            let form_info = td.parent().children().last().text();
            console.log(`基本信息单行: ${form_info}`);
            const separated = form_info.split('   ');
            console.log('基本信息多行:\n', separated.join('\n'));

            //大小：16.46 GB
            //类型: Animations动漫
            //媒介: WebDL
            //编码: H.264/AVC
            //音频编码: DDP/EAC3
            //分辨率: 1080p

            for (const word of separated) {
                if (word.includes('类型')) {
                    // 种子分区
                    for (const key in cat_constant) {
                        if (Object.hasOwnProperty.call(cat_constant, key)) {
                            if (word.includes(cat_constant[key])) {
                                cat = Number(key);
                                break;
                            }
                        }
                    }
                }
                if (word.includes('媒介')) {
                    // 媒介类型
                    for (const key in type_constant) {
                        if (Object.hasOwnProperty.call(type_constant, key)) {
                            if (word.includes('UHD Blu-ray DIY')) {
                                type = 13; // UHD Blu-ray DIY
                                break;
                            } else if (word.includes('UHD Blu-ray')) {
                                type = 12; // UHD Blu-ray 原盘
                                break;
                            } else if (word.includes(type_constant[key])) {
                                type = Number(key);
                                break;
                            }
                        }
                    }
                    // 防重复处理
                    if (word.includes('HD DVD')) type = 4;
                }

                // NOTE: 修复bug, 编码和音频编码之前是有重合的, 加了一个防止重合产生
                if (word.includes('编码') && !word.includes('音频编码')) {
                    // 视频编码
                    for (const key in encode_constant) {
                        if (Object.hasOwnProperty.call(encode_constant, key)) {
                            if (word.includes(encode_constant[key])) {
                                encode = Number(key);
                                break;
                            }
                        }
                    }
                }
                if (word.includes('音频编码')) {
                    // 音频编码
                    for (const key in audio_constant) {
                        if (Object.hasOwnProperty.call(audio_constant, key)) {
                            if (word.includes('TrueHD Atmos')) {
                                audio = 26; // 确保优先识别 TrueHD Atmos
                                break;
                            } else if (word.includes('DTS:X')) {
                                audio = 25; // DTS:X
                                break;
                            } else if (word.includes(audio_constant[key])) {
                                audio = Number(key);
                                break;
                            }
                        }
                    }
                    // 防重复处理
                    if (word.includes('DTS-HD MA')) audio = 19;
                }

                if (word.includes('分辨率')) {
                    // 分辨率
                    for (const key in resolution_constant) {
                        if (Object.hasOwnProperty.call(resolution_constant, key)) {
                            if (word.includes(resolution_constant[key])) {
                                resolution = Number(key);
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (td.text().includes('同伴')) {
            seeders = Number(td.parent().children().last().text().replace(/个做种者.*$/, ''));
        }
    }

    console.log('------标题信息解析----------------------:');
    console.log('小写标题: ', title_lowercase);
    console.log(`媒介类型: ${type_constant[title_type]}: ${title_type}
视频编码: ${encode_constant[title_encode]}: ${title_encode}
音频编码: ${audio_constant[title_audio]}: ${title_audio}
分辨率: ${resolution_constant[title_resolution]}: ${title_resolution}`);

    console.log('------表单信息最终解析----------------------:');
    console.log('副标题: ', subtitle);
    console.log('类型: ', cat_constant[cat], cat);
    console.log(`媒介类型: ${type_constant[type]}: ${type}
视频编码: ${encode_constant[encode]}: ${encode}
音频编码: ${audio_constant[audio]}: ${audio}
分辨率: ${resolution_constant[resolution]}: ${resolution}
做种人数: ${seeders}`);

    // 3. FIXME: 校验信息------------------------------------------------------------
    /**提醒框 dom */
    let warn = false;
    if ((title_warn_no & 1) === 1 ||
        (title_warn_no & 2) === 2 ||
        (title_warn_no & 4) === 4 ||
        (title_warn_no & 8) === 8)
    {
        warn = true
    }

    if (warn) {
        const warnDom = `
        <div
            id="assistant-tooltips-warn"
            style="
                display: inline-block;
                padding: 10px 30px;
                color: white;
                background: orange;
                font-weight: bold;"
        >
        </div>`;
        $('#outer').prepend(warnDom);
        if ((title_warn_no & 1) === 1) $('#assistant-tooltips-warn').append('未检测到已有媒介类型<br>');
        if ((title_warn_no & 2) === 2) $('#assistant-tooltips-warn').append('未检测到已有视频编码类型<br>');
        if ((title_warn_no & 4) === 4) $('#assistant-tooltips-warn').append('未检测到已有音频编码类型<br>');
        if ((title_warn_no & 8) === 8) $('#assistant-tooltips-warn').append('未检测到已有分辨率类型<br>');
    }

    /**错误提醒框 dom */
    const errorDom = `
    <div
        id="assistant-tooltips"
        style="
            display: inline-block;
            padding: 10px 30px;
            color: white;
            background: red;
            font-weight: bold;"
    >
    </div>`;

    /**错误 boolean */
    let error = false;
    $('#outer').prepend(errorDom);

    if (/[^\x00-\xff]+/g.test(title)) {
        // 检查标题中是否包含中文或中文字符
        var match = title.match(/[^\x00-\xff]+/g);
        // 将匹配到的中文或中文字符打印出来
        $('#assistant-tooltips').append(`主标题包含中文或中文字符: ${match.join(' ')}<br>`);
        error = true;
    }

    if (!subtitle) {
        $('#assistant-tooltips').append('副标题为空<br>');
        error = true;
    }

    if (!cat) {title_type
        $('#assistant-tooltips').append('未选择分类<br>');
        error = true;
    }

    if (!type) {
        $('#assistant-tooltips').append('未选择媒介类型<br>');
        error = true;
    } else {
        if (title_type && title_type !== type) {
            $('#assistant-tooltips').append("标题检测格式为" + type_constant[title_type] + "，选择格式为" + type_constant[type] + '<br>');
            error = true;
        }
    }

    if (!encode) {
        $('#assistant-tooltips').append('未选择主视频编码<br>');
        error = true;
    } else {
        if (title_encode && title_encode !== encode) {
            $('#assistant-tooltips').append("标题检测视频编码为" + encode_constant[title_encode] + "，选择视频编码为" + encode_constant[encode] + '<br>');
            error = true;
        }
    }

    if (!audio) {
        $('#assistant-tooltips').append('未选择主音频编码<br>');
        error = true;
    } else {
        if (title_audio && title_audio !== audio) {
            $('#assistant-tooltips').append("标题检测音频编码为" + audio_constant[title_audio] + "，选择音频编码为" + audio_constant[audio] + '<br>');
            error = true;
        }
    }

    if (!resolution) {
        $('#assistant-tooltips').append('未选择分辨率<br>');
        error = true;
    } else {
        if (title_resolution && title_resolution !== resolution) {
            $('#assistant-tooltips').append("标题检测分辨率为" + resolution_constant[title_resolution] + "，选择分辨率为" + resolution_constant[resolution] + '<br>');
            error = true;
        }
    }

    if (seeders == 0) {
        $('#assistant-tooltips').append('做种人数为0，请做种<br>');
        error = true;
    }

    // 不信的制作组关键词数组
var untrustworthyKeywords = [
    "fgt", "hao4k", "mp4ba", "rarbg", "gpthd",
    "seeweb", "dreamhd", "blacktv", "xiaomi",
    "huawei", "momohd", "ddhdtv", "nukehd",
    "tagweb", "sonyhd", "minihd", "bitstv",
    "-alt", "rarbg", "mp4ba", "fgt", "hao4k",
    "batweb", "dbd-raws", "xunlei", "gamehd",
    "zerotv", "lelvetv", "bestweb", "enttv", "hottv"
];
var untrustworthyKeywords1 = [
    "CTRLWEB", "CTRLHD"
];

// 检查是否包含任何不信的制作组关键词 (从 title_lowercase 判断)
var foundKeyword = untrustworthyKeywords.find(function(keyword) {
    return title_lowercase.includes(keyword);
});

// 检查是否包含任何不信的制作组关键词1 (从 title 判断)
var foundKeyword1 = untrustworthyKeywords1.find(function(keyword) {
    return title.includes(keyword);
});

// 提示信息
if (foundKeyword) {
    // 获取在标题中保持大小写的实际关键词
    var regex = new RegExp(foundKeyword, 'i');
    var actualKeyword = title.match(regex)[0];
    $('#assistant-tooltips').append(`<span>${actualKeyword} 为不可信的制作组</span><br>`);
    error = true;
}

if (foundKeyword1) {
    // 获取在标题中保持大小写的实际关键词
    var regex1 = new RegExp(foundKeyword1, 'i');
    var actualKeyword1 = title.match(regex1)[0];
    $('#assistant-tooltips').append(`<span>${actualKeyword1} 为不可信的制作组</span><br>`);
    error = true;
}

    if (error) {
        $('#assistant-tooltips').css('background', 'red');
    } else {
        $('#assistant-tooltips').append('此种子未检测到异常');
        $('#assistant-tooltips').css('background', 'green');
    }

    // 4. FIXME: 设置一个按钮, 在评论区显示检测结果------------------------------------------------------------
    // 创建一个新的按钮元素
    const btn_copy2comment = $('<button id="btn_copy2comment">复制检测结果到评论区</button>')
        .on('click', function () {
            // 复制文字过去
            const list = $('#assistant-tooltips').html().trim().split('<br>')
            let output = ""
            for (const line of list) {
                if (line != "") {
                    output += line
                }
                if (line != list[list.length]) {
                    output += '\n'
                }
            }
            $('textarea[name="body"]').text(output)

            // 页面跳转
            const offsetTop = $('textarea[name="body"]').offset().top;
            $('html, body').animate({ scrollTop: offsetTop }, 500);
        });

    // 在目标元素之后插入新按钮
    $('#assistant-tooltips').after(btn_copy2comment).after('<br>');
    btn_copy2comment.after('<br>')


    // 放大基本信息
    // 查找所有包含"基本信息"文本的 .rowhead.nowrap 元素
    var rowheadElements = document.querySelectorAll('.rowhead.nowrap');

    rowheadElements.forEach(function(rowheadElement) {
        if (rowheadElement.textContent.includes("基本信息")) {
            // 查找该元素后面的 .rowfollow 元素
            var rowfollowElement = rowheadElement.nextElementSibling;
            if (rowfollowElement && rowfollowElement.classList.contains('rowfollow')) {
                // 设置初始字体大小
                rowheadElement.style.fontSize = '16px';
                rowfollowElement.style.fontSize = '16px';
            } else {
                console.warn('未找到基本信息 .rowhead.nowrap 元素后面的 .rowfollow 元素');
            }
        }
    });

    // 放大简介中的关键词
    // 查找所有包含"简介"文本的 .rowhead.nowrap 元素
    var rowheadElementsIntro = document.querySelectorAll('.rowhead.nowrap');

    rowheadElementsIntro.forEach(function(rowheadElement) {
        if (rowheadElement.textContent.includes("简介")) {
            var rowfollowElement = rowheadElement.nextElementSibling;
            if (rowfollowElement && rowfollowElement.classList.contains('rowfollow')) {
                // 查找 class="show" 的内容
                var showElements = rowfollowElement.querySelectorAll('.show, .codemain');

                showElements.forEach(function(showElement) {
                    // 需要加粗放大的关键词数组
                    var keywords = [
                        "Chinese", "Cantonese", "Mandarin", "Scan type", "Interlaced", "Progressive", "480i","720p", "1080p", "1080i", "2160p","4320p",
                        "DTS-HD Master Audio","DTS-HD MA","TrueHD Atmos", "Dolby TrueHD/Atmos", "DTS:X", "DTS", "TrueHD", "OPUS", "LPCM", "AAC", "FLAC", "APE", "WAV", "MP3", "M4A","E-AC-3",
                        "Dolby Vision", "HDR10\\+", "HDR10", "HEVC", "x265", "H.265", "AVC", "x264", "H.264", "VC-1", "MPEG-2", "MPEG", "Version 2", "AV1",
                        "简中", "繁中", "简体中文", "繁体中文", "简英", "繁英", "粤语","粤", "国语"
                    ];

                    // 获取 showElement 的 HTML 内容
                    var contentHtml = showElement.innerHTML;

                    // 遍历关键词并加粗放大
                    keywords.forEach(function(keyword) {
                        var regex = new RegExp(`(${keyword})`, 'gi');
                        if (!(contentHtml.includes("MPEG-4") && keyword.toLowerCase() === "mpeg") &&
                            !(contentHtml.match(/AVC(?:[cs1])/i) && keyword.toLowerCase() === "avc")) {
                            contentHtml = contentHtml.replace(regex, '<strong style="font-size: larger;">$1</strong>');
                        }
                    });

                    // 更新 showElement 的 HTML 内容
                    showElement.innerHTML = contentHtml;
                });
            } else {
                console.warn('未找到简介 .rowhead.nowrap 元素后面的 .rowfollow 元素');
            }
        }
    });

// “其他版本”自动折叠
    var otherVersions = document.getElementById('kothercopy');
    if (otherVersions) {
        if (otherVersions.style.display !== 'none') {
            klappe_news('othercopy');
        }
    } else {
        console.warn('未找到折叠按钮');
    }
})();