// ==UserScript==
// @name         Hddolby-Torrent-Assistant
// @namespace    http://tampermonkey.net/
// @version      1.1.9
// @description  杜比审种助手
// @author       Kesa
// @match        http*://www.hddolby.com/details.php*
// @icon         https://www.hddolby.com/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467002/Hddolby-Torrent-Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/467002/Hddolby-Torrent-Assistant.meta.js
// ==/UserScript==

/**
 * Edit by Kesa Gisen
 * 需求:
 * 1. 主标题不能含有中文
 * 2. 未选择/错误选择媒介
 * 3. 未选择/错误选择音视频编码
 * 4. 未选择/错误选择分辨率 (主标题有4K 或者 2160p 两个东西, 算一个判断)
 * 5. 不搞制作组检测了 (一开始的需求是: 未选择/错误选择制作组)
 * 6. 是否有在做种
 * 7. 把检测结果直接填写在种子评论区吗
 */

(function () {
    'use strict';

    /**种子分类 */
    const cat_constant = {
        401: 'Movies电影',
        402: 'TV Series电视剧',
        403: 'TV Shows综艺',
        404: 'Documentaries纪录片',
        405: 'Animations动漫',
        406: 'Music Videos',
        407: 'Sports体育',
        408: 'HQ Audio音乐',
        409: 'Others其他',
        410: 'Games游戏',
        411: 'Study学习',
    };

    /**媒介类型 */
    const type_constant = {
        1: 'UHD',
        2: 'Blu-ray',
        3: 'Remux',
        4: 'HD DVD',
        5: 'HDTV',
        6: 'WEB-DL',
        7: 'Webrip',
        8: 'DVD',
        9: 'CD',
        10: 'Encode',
        11: 'Other',
        12: 'FEED',
    };

    /**视频编码类型 */
    const encode_constant = {
        1: 'H.264/AVC',
        2: 'H.265/HEVC',
        5: 'VC-1',
        6: 'MPEG-2',
        7: 'Other',
        11: 'AV1',
        12: 'VP9',
        13: 'H.266/VVC',
        14: 'AVS3',
        15: 'AVS+',
        16: 'AVS2',
    };

    /**音频编码类型 */
    const audio_constant = {
        1: 'DTS-HD MA',
        2: 'TrueHD',
        3: 'LPCM',
        4: 'DTS',
        5: 'DD/AC3',
        6: 'AAC',
        7: 'FLAC',
        8: 'APE',
        9: 'WAV',
        10: 'MP3',
        11: 'M4A',
        12: 'Other',
        13: 'Opus',
        14: 'DDP/EAC3',
        15: 'DTS-X',
        16: 'AV3A',
        17: 'AVSA',
        18: 'MPEG',
    };

    /**分辨率 */
    const resolution_constant = {
        1: '2160p/4K',
        2: '1080p',
        3: '1080i',
        4: '720p',
        5: 'Others',
        6: '4320/8K',
    };

    /**制作组 */
    const group_constant = {
        1: 'Dream',
        2: 'MTeam',
        3: 'PTHome',
        4: 'WiKi',
        5: 'CHD',
        6: 'CMCT',
        7: 'FRDS',
        8: 'Other',
        9: 'HDo',
        10: 'DBTV',
        11: 'beAst',
        12: 'QHstudIo',
        13: 'CornerMV',
    }

    $ = jQuery;

    // 1. FIXME: 从标题筛选信息------------------------------------------
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

    // medium
    if (title_lowercase.indexOf("remux") !== -1) {
        // remux 优先级最高
        title_type = 3;
    }
    else if (title_lowercase.indexOf("x264") !== -1
        || title_lowercase.indexOf("x265") !== -1
    ) {
        // x265 x264 优先级次之
        title_type = 10;
        title_resolution = 5;
    }
    else if (title_lowercase.indexOf("hdtv") !== -1) {
        // uhdtv 也还是 hdtv, 故放在 uhd 之前
        title_type = 5;
    }
    else if (title_lowercase.indexOf("uhd") !== -1) {
        title_type = 1;
    }
    else if (title_lowercase.indexOf("hddvd") !== -1
        || title_lowercase.indexOf("hd dvd") !== -1) {
        title_type = 4;
    }
    else if (title_lowercase.indexOf("web-dl") !== -1
        || title_lowercase.indexOf("webdl") !== -1
        || title_lowercase.indexOf("web") !== -1
    ) {
        title_type = 6;
    }
    else if (
        (title_lowercase.indexOf("bluray") != -1 || title_lowercase.indexOf("blu-ray") != -1)
        &&
        (title_lowercase.indexOf("hevc") != -1 || title_lowercase.indexOf("avc") != -1)
    ) {
        // 同时存在 bluray 和 hevc/avc 则为 bluray
        title_type = 2;
    }
    else if (title_lowercase.indexOf("webrip") !== -1) {
        title_type = 7;
    }
    else if (title_lowercase.indexOf("dvd") !== -1) {
        title_type = 8;
        title_resolution = 5;
    }
    else if (title_lowercase.indexOf("cd") !== -1) {
        title_type = 9;
    }
    else if (title_lowercase.indexOf("feed") !== -1) {
        title_type = 12;
    }
    else {
        console.warn('Kesa审种脚本: 未检测到已有媒介类型');
        title_warn_no += 1;
    }

    // codec
    if (title_lowercase.indexOf("x264") !== -1
        || title_lowercase.indexOf("h264") !== -1
        || title_lowercase.indexOf("h.264") !== -1
        || title_lowercase.indexOf("avc") !== -1
    ) {
        title_encode = 1;
    }
    else if (title_lowercase.indexOf("x265") !== -1
        || title_lowercase.indexOf("h265") !== -1
        || title_lowercase.indexOf("h.265") !== -1
        || title_lowercase.indexOf("hevc") !== -1
    ) {
        title_encode = 2;
    }
    else if (title_lowercase.indexOf("vc-1") !== -1
        || title_lowercase.indexOf("vc1") !== -1
    ) {
        title_encode = 5;
    }
    else if (title_lowercase.indexOf("mpeg2") !== -1
        || title_lowercase.indexOf("mpeg-2") !== -1
    ) {
        title_encode = 6;
    }
    else if (title_lowercase.indexOf("av1") !== -1) {
        title_encode = 11;
    }
    else if (title_lowercase.indexOf("vp9") !== -1) {
        title_encode = 12;
    }
    else if (title_lowercase.indexOf("h266") !== -1
        || title_lowercase.indexOf("vvc") !== -1
    ) {
        title_encode = 13;
    }
    else if (title_lowercase.indexOf("avs3") !== -1) {
        title_encode = 14;
    }
    else if (title_lowercase.indexOf("avs+") !== -1) {
        title_encode = 15;
    }
    else if (title_lowercase.indexOf("avs2") !== -1) {
        title_encode = 16;
    }
    else {
        console.warn('Kesa审种脚本: 未检测到已有视频编码类型');
        title_warn_no += 2;
    }

    // audiocodec
    if (title_lowercase.indexOf("dts-hd") !== -1
        || title_lowercase.indexOf("dtshd") !== -1
    ) {
        title_audio = 1;
    }
    else if (title_lowercase.indexOf("dts-x") !== -1 || title_lowercase.indexOf("dts:x") !== -1) {
        title_audio = 15;
    }
    else if (title_lowercase.indexOf("truehd") !== -1) {
        title_audio = 2;
    }
    else if (title_lowercase.indexOf("lpcm") !== -1
        || title_lowercase.indexOf("pcm") !== -1
    ) {
        title_audio = 3;
    }
    else if (title_lowercase.indexOf("dts") !== -1) {
        title_audio = 4;
    }
    // eac3 判断前置于 ac3
    else if (title_lowercase.indexOf("ddp") !== -1
        || title_lowercase.indexOf("eac3") !== -1
        || title_lowercase.indexOf("dd+") !== -1
    ) {
        title_audio = 14;
    }
    else if (title_lowercase.indexOf("ac3") !== -1
        || title_lowercase.indexOf("ac-3") !== -1
        || title_lowercase.indexOf("dd1") !== -1
        || title_lowercase.indexOf("dd2") !== -1
        || title_lowercase.indexOf("dd5") !== -1
        || title_lowercase.indexOf("dd.2") !== -1
        || title_lowercase.indexOf("dd 5.1") !== -1
        || title_lowercase.indexOf("dd.5") !== -1
    ) {
        title_audio = 5;
    }
    else if (title_lowercase.indexOf("aac") !== -1) {
        title_audio = 6;
    }
    else if (title_lowercase.indexOf("flac") !== -1) {
        title_audio = 7;
    }
    else if (title_lowercase.indexOf("av3a") !== -1) {
        title_audio = 16;
    }
    else if (title_lowercase.indexOf("avsa") !== -1) {
        title_audio = 17;
    }
    else if (title_lowercase.indexOf("mpeg") !== -1) {
        title_audio = 18;
    }
    else {
        console.warn('Kesa审种脚本: 未检测到已有音频编码类型');
        title_warn_no += 4;
    }

    // resolution
    if (title_lowercase.indexOf("4320p") !== -1
        || title_lowercase.indexOf("8k") !== -1) {
        title_resolution = 6;
    }
    else if (title_lowercase.indexOf("2160p") !== -1
        || title_lowercase.indexOf("uhd") !== -1
        || title_lowercase.indexOf("4k") !== -1) {
        title_resolution = 1;
    }
    else if (title_lowercase.indexOf("1080p") !== -1) {
        title_resolution = 2;
    }
    else if (title_lowercase.indexOf("1080i") !== -1) {
        title_resolution = 3;
    }
    else if (title_lowercase.indexOf("720p") !== -1) {
        title_resolution = 4;
    }
    else {
        console.warn('Kesa审种脚本: 未检测到已有分辨率类型');
        title_warn_no += 8;
    }


    if (title_lowercase.indexOf('complete') !== -1) {
        title_is_complete = true;
    }

    // FIXME: 2. 从种子表单筛选信息------------------------------------------
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
    // 初始化变量，设置默认值
    let fixtd, mediainfo = false, mediainfo_short;
    let tmdb, tmdb_VideoName;
    let screenshots = false;

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
                            if (word.includes(type_constant[key])) {
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
                            if (word.includes(audio_constant[key])) {
                                audio = Number(key);
                                break;
                            }
                        }
                    }
                    // 防重复处理
                    if (word.includes('DTS-HD MA')) audio = 1;
                    if (word.includes('DTS-X')) audio = 15;
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

        if (td.text() == ('TMDb信息')) {
            tmdb_VideoName = td.parent().children().last().text().split('上映时间：')[0].split('影片名称：')[1];
            console.log('TMDb影片名称: ', tmdb_VideoName);
            tmdb_VideoName = tmdb_VideoName.split(' ')[0].replace(/[`:_.~～!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g, '');
            if (!subtitle.match(tmdb_VideoName)) {
                tmdb = 1;
            }
        }
        
        // 检查MediaInfo信息是否存在，如果不存在则显示提示
        if (td.text() == 'MediaInfo信息' || td.text() == 'MediaInfo') {
            let mediainfoContent = td.parent().children().last().text().trim();
            if (mediainfoContent !== '' && mediainfoContent.length > 0) {
                mediainfo = true;
            }
        }
        
        // 检查截图信息是否存在 - 尝试多种可能的选择器
        if (td.find('a[href*="screenshots"]').length > 0) {
            let screenshotsText = td.find('span.nowrap').text() || td.text();
            // 检查是否包含截图数量信息
            const match = screenshotsText.match(/\((\d+)张\)/) || screenshotsText.match(/(\d+)张/);
            if (match && parseInt(match[1]) > 0) {
                screenshots = true;
            }
        } else if (td.text().includes('截图') || td.text().includes('截圖')) {
            // 备选方案：直接查找包含"截图"文本的行
            let screenshotsText = td.parent().children().last().text();
            if (screenshotsText.includes('张') || screenshotsText.includes('张') || screenshotsText.length > 5) {
                screenshots = true;
            }
        }
    }

    // 记录检测结果到控制台，便于调试
    console.log('------检测结果----------------------:');
    console.log('MediaInfo检测结果:', mediainfo);
    console.log('截图检测结果:', screenshots);
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
        (title_warn_no & 8) === 8 ||
        (tmdb == 1)) {
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
        if (tmdb == 1) $('#assistant-tooltips-warn').append('TMDb影片名称与副标题不匹配，请审种人员确认TMDb信息是否正确<br>');
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
        $('#assistant-tooltips').append('主标题包含中文或中文字符<br>');
        error = true;
    }

    if (!subtitle) {
        $('#assistant-tooltips').append('副标题为空<br>');
        error = true;
    }

    if (!cat) {
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

    if (!tmdb_VideoName) {
        $('#assistant-tooltips').append('未设置TMDb信息,请查看WIKI教程： https://wiki.orcinusorca.org/zh/TMDB/GetTMDBlink <br>');
        error = true;
    }
    
    // 检查MediaInfo信息是否存在，如果不存在则显示提示
    if (mediainfo === false) {
        $('#assistant-tooltips').append('未填写MediaInfo<br>');
        error = true;
    }
    
    // 检查截图信息是否存在，如果不存在则显示提示
    if (screenshots === false) {
        $('#assistant-tooltips').append('未添加截图<br>');
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

})();