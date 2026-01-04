// ==UserScript==
// @name         HDKylin-Review-Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  HDKylin Review
// @author       7oomy
// @match        *://*.hdkyl.in/torrents.php?*
// @match        *://*/details.php*
// @icon         https://www.hdkyl.in/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493233/HDKylin-Review-Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/493233/HDKylin-Review-Assistant.meta.js
// ==/UserScript==

function checkImageLink(imageUrl) {
    // 创建一个新的Image对象
    var img = new Image();

    // 加载图片成功时执行的函数
    img.onload = function() {
        console.log('图片加载成功，可以正常展示。');
        // 在这里可以执行其他操作，比如将图片添加到DOM中
    };

    // 加载图片失败时执行的函数
    img.onerror = function() {
        console.log('图片加载失败，无法正常展示。');
        // 在这里可以处理错误情况，比如显示一个备用图片或错误消息
    };

    // 设置图片源，开始加载图片
    img.src = imageUrl;
}

(function() {
    'use strict';

    // 自定义参数
    var review_info_position = 2;  // 错误提示信息位置：1:页面最上方，2:主标题正下方，3:主标题正上方
    var fontsize = "9pt";          // 一键通过按钮的字体大小
    var timeout = 200;             // 弹出页内鼠标点击间隔，单位毫秒，设置越小点击越快，但是对网络要求更高
    var biggerbuttonsize = "40pt"; // 放大的按钮大小
    var autoback = 0;              // 一键通过后返回上一页面

    let biggerbutton = GM_getValue("biggerbutton");
    let autoclose = GM_getValue("autoclose");
    let add_link_before_img = GM_getValue("add_link_before_img");

    registerMenuCommand();
    // 注册脚本菜单
    function registerMenuCommand() {
        GM_registerMenuCommand(`${ GM_getValue("biggerbutton", false) ? '✅':'❌'} 审核按钮放大`, function(){
            biggerbutton = !biggerbutton;
            GM_setValue("biggerbutton", biggerbutton);
            location.reload();
        });

        GM_registerMenuCommand(`${ GM_getValue("autoclose", true) ? '✅':'❌'} 自动关闭页面`, function(){
            autoclose = !autoclose;
            GM_setValue("autoclose", autoclose);
            location.reload();
        });

        GM_registerMenuCommand(`${ GM_getValue("add_link_before_img", false) ? '✅':'❌'} 打开图片链接`, function(){
            add_link_before_img = !add_link_before_img;
            GM_setValue("add_link_before_img", add_link_before_img);
            location.reload();
        });
    }

    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    if (isMobile){
        biggerbuttonsize = "120pt";
        autoclose = 0;
        autoback = 1;
    }

    var cat_constant = {
        401: 'Movies/电影',
        402: 'TV Series/电视剧',
        420: 'TV Shows/综艺',
        404: 'Record Education/纪录教育',
        405: 'Animations/动漫',
        406: 'Music Videos/音乐视频',
        407: 'Sports/体育运动',
        408: 'HQ Audio/音乐',
        409: 'Misc/其他',
        411: 'software/软件',
        412: 'Game/游戏',
        413: 'Ebook/电子书',
        416: 'Comic(漫画)',
        419: 'Study/学习',
        418: 'Picture(图片)',
        421: ' Playlet/短剧'
    };

    var type_constant = {
        25: 'Blu-ray(原盘)',
        27: 'DVD(原盘)',
        30: 'Remux',
        28: 'HDTV',
        29: 'Encode',
        33: 'CD',
        31: 'WEB-DL',
        24: 'UHD Blu-ray',
        32: 'Track',
        34: 'Other'
    };

    var encode_constant = {
        1: 'H.264/AVC',
        2: 'VC-1',
        4: 'MPEG-2/MPEG-4',
        5: 'Other',
        3: 'Xvid',
        6: 'H.265/HEVC',
        7: 'AV1'
    };

    var audio_constant = {
        1: 'FLAC',
        12: 'APE',
        3: 'DTS',
        4: 'MP3',
        6: 'AAC',
        7: 'Other',
        8: 'DTS-HD MA',
        9: 'TrueHD',
        10: 'LPCM',
        11: 'DD/AC3',
        13: 'WAV',
        14: 'M4A',
        15: 'TrueHD Atmos',
        16: 'DTS:X',
        17: 'DDP/E-AC3'
    };

    var resolution_constant = {
        1: '1080p/1080i',
        3: '720p/720i',
        8: '480p/480i',
        6: '4K/2160p/2160i',
        7: '8K/4320p/4320i',
        9: 'Other'
    };

    var area_constant = {
    }

    var group_constant = {
        9: 'GodDramas',
        10: 'CatEDU',
        6: 'HDK',
        7: 'HDKWeb',
        8: 'HDKGame',
        1: 'HDKMV',
        2: 'HDKTV',
        3: 'HDKDIY',
        5: 'Other'

    }

    const brief = $("#kdescr").text().toLowerCase();           // 获取简介
    const containsIMDbLink = brief.includes("imdb.com");       // 检查内容是否包含 imdb.com 链接
    const containsDoubanLink = brief.includes("douban.com");   // 检查内容是否包含 douban.com 链接
    const containsTMDBLink = brief.includes("themoviedb.org"); // 检查内容是否包含 themoviedb.org 链接

    // console.log(brief);

    var dbUrl; // 是否包含影片链接
    if (containsIMDbLink || containsDoubanLink || containsTMDBLink) {
        dbUrl = true;
        // console.log("内容中包含 IMDb 或 Douban 链接");
    } else {
        dbUrl = false;
        // console.log("内容中不包含 IMDb 或 Douban 链接");
    }

    var isBriefContainsInfo = false;  //是否包含Mediainfo
    if (brief.includes("general") && brief.includes("video") && brief.includes("audio")) {
        isBriefContainsInfo = true;
        // console.log("简介中包含Mediainfo");
    }
    // 中文详细info
    if (brief.includes("概览") && brief.includes("视频") && brief.includes("音频")) {
        isBriefContainsInfo = true;
        // console.log("简介中包含Mediainfo");
    }
    if (brief.includes("disc info") || brief.includes("disc size") || brief.includes(".release.info") || brief.includes("general information")) {
        isBriefContainsInfo = true;
    }
    // 杜比官种
    if (brief.includes("nfo信息")) {
        isBriefContainsInfo = true;
    }
    // frds官种
    if (brief.includes("release date") && brief.includes("source")) {
        isBriefContainsInfo = true;
    }
    if (brief.includes("release.name") || brief.includes("release.size")) {
        isBriefContainsInfo = true;
    }
    // CMCT/HDCTV官种
    if ((brief.includes("文件名") || brief.includes("文件名称")) && (brief.includes("体　积")||brief.includes("体　　积"))) {
        isBriefContainsInfo = true;
    }
    // HDChina官种
    if (brief.includes("source type") || brief.includes("video bitrate")) {
        isBriefContainsInfo = true;
    }

    var isBriefContainsForbidReseed = false;  //是否包含禁止转载
    if (brief.includes("禁止转载")) {
        isBriefContainsForbidReseed = true;
    }

    var isBriefContainsMovieBrief = true;
    if (!(brief.replace(/\s/g,'').includes("片名") || brief.replace(/\s/g,'').includes("译名") || brief.replace(/\s/g,'').includes("名")|| brief.replace(/\s/g,'').includes("演")|| brief.replace(/\s/g,'').includes("主持人") || brief.replace(/\s/g,'').includes("简") || brief.replace(/\s/g,'').includes("国家"))) {
        isBriefContainsMovieBrief = false;
        console.log(brief.replace(/\s/g,'').includes);
    }


    var title = $('#top').text();  // 主标题
    var exclusive = 0;
    if (title.indexOf('禁转') >= 0) {
        exclusive = 1;
    }
    title = title.replace(/禁转|\((已审|冻结|待定)\)|\[(免费|50%|2X免费|30%|2X 50%)\]|\(限时\d+.*\)|\[2X\]|\[(推荐|热门|经典|已审)\]/g, '').trim();
    title = title.replace(/剩余时间.*/g,'').trim();
    title = title.replace("(禁止)",'').trim();
    // console.log(title);
    var title_lowercase = title.toLowerCase();

    var officialSeed = 0; //官组种子
    var godDramaSeed = 0; //驻站短剧组种子
    var officialMusicSeed = 0; //官组音乐种子
    if(title_lowercase.includes("HDK")) {
        officialSeed = 1;
        //console.log("官种");
    }
    if(title_lowercase.includes("goddramas")) {
        godDramaSeed = 1;
        //console.log("短剧种");
    }
    if(title_lowercase.includes("HDKMV")) {
        officialMusicSeed = 1;
        //console.log("MV官种");
    }

    // console.log("title_lowercase:"+title_lowercase);
    var title_type, title_encode, title_audio, title_resolution, title_group, title_is_complete, title_is_episode, title_x265, title_x264;

    // 媒介
        if(title_lowercase.includes("WEB-DL") || title_lowercase.includes("webdl")){
        title_type = 31;
    } else if (title_lowercase.includes("REMUX")) {
        title_type = 30;
    } else if (title_lowercase.includes("remux")) {
        title_type = 30;
    } else if (title_lowercase.includes("webrip") || title_lowercase.includes("web-rip") || title_lowercase.includes("dvdrip") || title_lowercase.includes("bdrip")) {
        title_type = 29;
    } else if (title_lowercase.includes("webrip") || title_lowercase.includes("web-rip") || title_lowercase.includes("DVD(原盘)") || title_lowercase.includes("bdrip")) {
        title_type = 27;
    } else if (title_lowercase.includes("HDTV")) {
        title_type = 28;
    }
console.log("title_type",title_type);
    // 视频编码
    if(title_lowercase.includes("264") || title_lowercase.includes("avc")){
        title_encode = 1;
    } else if (title_lowercase.includes("265") || title_lowercase.includes("hevc")) {
        title_encode = 6;
    } else if (title_lowercase.includes("vc") || title_lowercase.includes("vc-1")) {
        title_encode = 2;
    } else if (title_lowercase.includes("mpeg2") || title_lowercase.includes("mpeg-2")) {
        title_encode = 4;
    } else if (title_lowercase.includes("av1") || title_lowercase.includes("av-1")) {
        title_encode = 12;
    }
    //console.log("title_encode:"+title_encode);

    // 音频 可能有多个音频，选择与标题不一致，跳过
    if (title_lowercase.includes("flac")) {
        title_audio = 1;
    } else if (title_lowercase.includes("lpcm")) {
        title_audio = 10;
    }else if (title_lowercase.includes("lpcm")) {
        title_audio = 10;
    }else if (title_lowercase.includes("truehd atmos") || title_lowercase.includes("truehdatmos") || title_lowercase.includes("atoms truehd") || title_lowercase.includes("atomstruehd")) {
        title_audio = 15;
    } else if (title_lowercase.includes("ddp") || title_lowercase.includes("ddp/e-ac3") || title_lowercase.includes(" dd+") || title.search(/e-?ac-?3/) != -1) {
        title_audio = 17;
    } else if (title_lowercase.includes("aac")) {
        title_audio = 6;
    } else if (title_lowercase.includes("ac3") || title_lowercase.includes("dd/ac3")) {
        title_audio = 11;

    }else if (title_lowercase.includes("truehd") && title_lowercase.includes("atmos")) {
        title_audio = 15;
    }else if (title_lowercase.includes("truehd")) {
        title_audio = 9;
    } else if (title_lowercase.includes("dts-hd ma") || title_lowercase.includes("dts-hdma")) {
        title_audio = 8;
    } else if (title_lowercase.includes("dts:x")|| title_lowercase.includes("dts: x")) {
        title_audio = 16;
    } else if (title_lowercase.includes("dts") && !title_lowercase.includes("dts-x") ) {
        title_audio = 3;
    }
  console.log("title_audio:"+title_audio);
    // 分辨率
    if(title_lowercase.includes("1080p") || title_lowercase.includes("1080i")){
        title_resolution = 1;
    } else if (title_lowercase.includes("720p") || title_lowercase.includes("720i")) {
        title_resolution = 3;
    } else if (title_lowercase.includes("480p") || title_lowercase.includes("480i")) {
        title_resolution = 8;
    } else if (title_lowercase.includes("4k") || title_lowercase.includes("2160p") || title_lowercase.includes("2160i")) {
        title_resolution = 6;
    } else if (title_lowercase.includes("8k") || title_lowercase.includes("4320p") || title_lowercase.includes("4320i")) {
        title_resolution = 7;
    }

    if (title_lowercase.includes("complete")) {
        title_is_complete = true;
    }

    // if (title_lowercase.match(/s\d+e\d+/i) || title_lowercase.match(/ep\d+/i)) {
    if (title_lowercase.match(/s\d+e\d+/i)) {
    // if (title_lowercase.match(/s\d+e\d+/i)) {
        title_is_episode = true;
        // console.log("===============================当前为分集");
    }

    if (title_lowercase.includes("x265")) {
        title_x265 = true;
    }
    if (title_lowercase.includes("x264")) {
        title_x264 = true;
    }




    // 检测标题是否包含不被信任的制作组
    const keywords = [
        "fgt", "hao4k", "mp4ba", "rarbg", "gpthd",
        "seeweb", "dreamhd", "blacktv", "xiaomi",
        "huawei", "momohd", "ddhdtv", "nukehd",
        "tagweb", "sonyhd", "minihd", "bitstv",
        "-alt", "rarbg", "mp4ba", "fgt", "hao4k",
        "batweb", "dbd-raws","xunlei",
        "zerotv","lelvetv"
    ];

    function containsKeyword(text) {
        const lowerCaseText = text.toLowerCase();
        for (let keyword of keywords) {
            if (lowerCaseText.includes(keyword)) {
                return true;
            }
        }

        return false;
    }

    var is_untrusted_group = false;
    if(containsKeyword(title_lowercase)) {
        is_untrusted_group = true;
    }

    var subtitle, cat, type, encode, audio, resolution, area, group, anonymous, is_complete,category;
    var poster;
    var fixtd, douban, imdb, mediainfo, mediainfo_short,mediainfo_err;
    var isGroupSelected = false;     //是否选择了制作组
    var isReseedProhibited = false;  //是否选择了禁转标签
    var isOfficialSeedLabel = false; //是否选择了官种标签
    var isIceSeedLabel = false;      //是否选择了官种标签
    var isMediainfoEmpty = false;    //Mediainfo栏内容是否为空
    var isEpisode = false;           //电视剧是否为分集
    var isTagAudioChinese = false;   //标签是否选择国语
    var isTagTextChinese = false;    //标签是否选择中字
    var isTagTextEnglish = false;    //标签是否选择英字
    var isTagResident = false;       //标签是否选择驻站
    var isTagBigTorrent = false;     //标签是否选择大包
    var isBiggerThan1T = false;      //种子体积是否大于1T
    var isAudioChinese = false;
    var isTextChinese = false;
    var isTextEnglish = false;
    var mi_x265 = false;
    var mi_x264 = false;
    var isSubtitleAnime = false;     //副标题是是否包含动画

    var tdlist = $('#outer').find('td');
    for (var i = 0; i < tdlist.length; i ++) {
        var td = $(tdlist[i]);
        if (td.text() == '副标题' || td.text() == '副標題') {
            subtitle = td.parent().children().last().text();
            if (subtitle.includes("动画")) {
                isSubtitleAnime = true;
            }
        }

        if (td.text() == '添加') {
            var text = td.parent().children().last().text();
            if (text.indexOf('匿名') >= 0) {
                anonymous = 1;
            }
        }

        if (td.text() == '标签') {
            var text = td.parent().children().last().text();
            // console.log('标签: '+text);
            if(text.includes("禁转")){
                isReseedProhibited = true;
                // console.log("已选择禁转标签");
            }
            if(text.includes("官方")){
                isOfficialSeedLabel = true;
                // console.log("已选择官方标签");
            }
            if(text.includes("麒麟火")){
                isIceSeedLabel = true;
                // console.log("已选择麒麟火种标签");
            }
            if(text.includes("驻站")){
                isTagResident = true;
                // console.log("已选择驻站标签");
            }
            if(text.includes("分集")){
                isEpisode = true;
                // console.log("已选择官方标签");
            }
            if(text.includes("国语")){
                isTagAudioChinese = true;
                // console.log("已选择官方标签");
            }
            if(text.includes("中字")){
                isTagTextChinese = true;
                // console.log("已选择官方标签");
            }
            if(text.includes("英字")){
                isTagTextEnglish = true;
                // console.log("已选择官方标签");
            }
            if(text.includes("大包")){
                isTagBigTorrent = true;
                // console.log("已选择大包标签");
            }
            if (text.indexOf('完结') >= 0) {
                is_complete = true;
            }
        }


        if (td.text() == '基本信息') {
            var text = td.parent().children().last().text();
            if(text.includes("制作组")){
                isGroupSelected = true;
                //console.log("已选择制作组");
            }
            if(text.includes("TB")){
                isBiggerThan1T = true;
                //console.log("种子体积大于1T");
            }
            // console.log(text)
            // 类型
            if (text.indexOf('Movies/电影') >= 0) {
                cat = 401;
            } else if (text.indexOf('TV Series/电视剧') >= 0) {
                cat = 402;
            } else if (text.indexOf('Study/学习') >= 0) {
                cat = 419;
            } else if (text.indexOf('TV Shows/综艺') >= 0) {
                cat = 420;
            } else if (text.indexOf('Record Education/纪录教育') >= 0) {
                cat = 404;
            } else if (text.indexOf('Animations/动漫') >= 0) {
                cat = 405;
            } else if (text.indexOf('Music Videos/音乐视频') >= 0) {
                cat = 406;
            } else if (text.indexOf('Sports/体育运动') >= 0) {
                cat = 407;
            } else if (text.indexOf('HQ Audio/音乐') >= 0) {
                cat = 408;
            } else if (text.indexOf('Misc/其他') >= 0) {
                cat = 409;
            } else if (text.indexOf('software/软件') >= 0) {
                cat = 411;
            } else if (text.indexOf('Game/游戏') >= 0) {
                cat = 412;
            } else if (text.indexOf('Ebook/电子书') >= 0) {
                cat = 413;
            } else if (text.indexOf('Playlet/短剧') >= 0) {
                cat = 421;
            }
            // console.log("cat:"+cat);

            // 格式
            if (text.indexOf('UHD Blu-ray') >= 0) {
                type = 24;
            } else if (text.indexOf('DVD(原盘)') >= 0) {
                type = 27;
            } else if (text.indexOf('REMUX') >= 0) {
                type = 30;
            } else if (text.indexOf('HDTV') >= 0) {
                type = 28;
            } else if (text.indexOf('Encode') >= 0) {
                type = 29;
            } else if (text.indexOf('CD') >= 0) {
                type = 33;
            } else if (text.indexOf('WEB-DL') >= 0) {
                type = 31;
            } else if (text.indexOf('Blu-ray(原盘)') >= 0) {
                type = 25;
            } else if (text.indexOf('Track') >= 0) {
                type = 32;
            } else if (text.indexOf('媒介: Other') >= 0) {
                type = 34;
            }
            // console.log("type:"+type);
            // 视频编码
            if (text.indexOf('H.265/HEVC')  >= 0) {
                encode = 6;
            } else if (text.indexOf('H.264/AVC')  >= 0) {
                encode = 1;
            } else if (text.indexOf('VC-1')  >= 0) {
                encode = 2;
            } else if (text.indexOf('Xvid')  >= 0) {
                encode = 3;
            } else if (text.indexOf('MPEG-2/MPEG-4')  >= 0) {
                encode = 4;
            } else if (text.indexOf('AV1')  >= 0) {
                encode = 7;
            }else if (text.indexOf('编码: Other')  >= 0) {
                encode = 5;
            }
            // console.log("encode:"+encode);
            //console.log("audio:"+audio);
            // 音频编码
            if (text.indexOf('DTS-HD MA') >= 0) {
                audio = 8;
            } else if (text.indexOf('DTS:X') >= 0) {
                audio = 16;
            }else if (text.indexOf('DTS') >= 0) {
                audio = 3;
            } else if (text.indexOf('TrueHD Atmos') >= 0) {
                audio = 15;
            } else if (text.indexOf('TrueHD') >= 0) {
                audio = 9;
            } else if (text.indexOf('LPCM') >= 0) {
                audio = 10;
            } else if (text.indexOf('DD/AC3') >= 0) {
                audio = 11;
            } else if (text.indexOf('AAC') >= 0) {
                audio = 6;
            } else if (text.indexOf('FLAC') >= 0) {
                audio = 1;
            } else if (text.indexOf('APE') >= 0) {
                audio = 12;
            } else if (text.indexOf('WAV') >= 0) {
                audio = 13;
            } else if (text.indexOf('MP3') >= 0) {
                audio = 4;
            } else if (text.indexOf('M4A') >= 0) {
                audio = 14;
            } else if (text.indexOf('DDP/E-AC3') >= 0) {
                audio = 17;
            } else if (text.indexOf('音频编码: Other') >= 0) {
                audio = 7;
            }
            // console.log("audio:"+audio);
            // 分辨率
            if (text.indexOf('4K/2160p/2160i') >= 0) {
                resolution = 6;
            } else if (text.indexOf('8K/4320p/4320i') >= 0) {
                resolution = 7;
            } else if (text.indexOf('1080p/1080i') >= 0) {
                resolution = 1;
            } else if (text.indexOf('720p/720i') >= 0) {
                resolution = 3;
            } else if (text.indexOf('480p/480i') >= 0) {
                resolution = 8;
            } else if (text.indexOf('分辨率: Other') >= 0) {
                resolution = 8;
            }
            // console.log("resolution:"+resolution);
            // 地区
            if (text.indexOf('CN/中国') >= 0) {
                area = 15;
            } else if (text.indexOf('HK/香港') >= 0) {
                area = 16;
            } else if (text.indexOf('TW/台湾') >= 0) {
                area = 17;
            } else if (text.indexOf('US/美国') >= 0) {
                area = 18;
            } else if (text.indexOf('JPN/日本') >= 0) {
                area = 19;
            } else if (text.indexOf('Kr/韩国') >= 0) {
                area = 20;
            } else if (text.indexOf('GB/英国') >= 0) {
                area = 21;
            } else if (text.indexOf('FR/法国') >= 0) {
                area = 22;
            } else if (text.indexOf('DE/德国') >= 0) {
                area = 23;
            } else if (text.indexOf('AU/澳大利亚') >= 0) {
                area = 24;
            } else if (text.indexOf('IN/印度') >= 0) {
                area = 25;
            } else if (text.indexOf('ES/西班牙') >= 0) {
                area = 26;
            } else if (text.indexOf('IE/爱尔兰') >= 0) {
                area = 27;
            } else if (text.indexOf('BE/比利时') >= 0) {
                area = 28;
            } else if (text.indexOf('IT/意大利') >= 0) {
                area = 29;
            } else if (text.indexOf('RU/俄罗斯') >= 0) {
                area = 30;
            }else if (text.indexOf('CA/加拿大') >= 0) {
                area = 31;
            }else if (text.indexOf('BR/巴西') >= 0) {
                area = 32;
            }else if (text.indexOf('SE/瑞典') >= 0) {
                area = 33;
            }else if (text.indexOf('DK/丹麦') >= 0) {
                area = 34;
            } else if (text.indexOf('TH/泰国') >= 0) {
                area = 35;
            } else if (text.indexOf('地区: Other(其他)') >= 0) {
                area = 14;
            }
            if (text.indexOf('GodDramas') >= 0) {
                category = 9;
            } else if (text.indexOf('CatEDU') >= 0) {
                category = 10;
            } else if (text.indexOf('HDK') >= 0) {
                category = 6;
            } else if (text.indexOf('HDKWeb') >= 0) {
                category = 7;
            } else if (text.indexOf('HDKGame') >= 0) {
                category = 8;
            } else if (text.indexOf('HDKMV') >= 0) {
                category = 1;
            } else if (text.indexOf('HDKTV') >= 0) {
                category = 2;
            } else if (text.indexOf('HDKDIY') >= 0) {
                category = 3;
            } else if (text.indexOf('制作组: Other') >= 0) {
                category = 5;
            }
            // console.log("category:"+category)
        }

        if (td.text() == '行为') {
            fixtd = td.parent().children().last();
        }

        if (td.text().trim() == '海报') {
            poster = $('#kposter').children().attr('src');
        }
        /* if (td.text().trim() == "IMDb信息") {
            if (td.parent().last().find("a").text() == "这里"){
                var fullUrl = new URL(href, window.location.origin).toString();
                td.parent().find("a").attr("href",fullUrl);
                let href = td.parent().last().find("a").attr("href").trim();
                td.parent().last().find("a").click();
            }
        }*/
        if (td.text() == "MediaInfo"){
            //$(this).find("")
            let md = td.parent().children().last();
            if(md.text()==""){
                isMediainfoEmpty = true;
                //console.log("MediaInfo栏为空");
            }
            //console.log(md.text())
            //console.log(md.children('div').length)
            //console.log(md.children('table').length)
            if (md.children('div').length>0) {
                mediainfo_short = md.text().replace(/\s+/g, '');
                mediainfo = md.text().replace(/\s+/g, '');
            } else if  (md.children('table').length>0) {
                mediainfo_short = md.children().children().children().eq(0).text().replace(/\s+/g, '');
                mediainfo = md.children().children().children().eq(1).text().replace(/\s+/g, '');
            }
            //临时 if ((containsBBCode(mediainfo) || containsBBCode(mediainfo_short)) && mediainfo_short === mediainfo){
            //     mediainfo_err = "MediaInfo中含有bbcode"
            // }

            // 根据 Mediainfo 判断标签选择
            // console.log("===========================mediainfo:"+mediainfo);
            const audioMatch = mediainfo.match(/Audio.*?Language:(\w+)/);
            const audioLanguage = audioMatch ? audioMatch[1] : 'Not found';
            // console.log(`The language of the audio is: ${audioLanguage}`);
            if (!audioLanguage.includes("Text") && (audioLanguage.includes("Chinese") || audioLanguage.includes("Mandarin"))){
                isAudioChinese = true;
            }

            const textMatches = mediainfo.match(/Text.*?Language:(\w+)/g) || [];
            const textLanguages = textMatches.map(text => {
                const match = text.match(/Language:(\w+)/);
                return match ? match[1] : 'Not found';
            });
            var textLanguage = textLanguages.join(',')
            // console.log(`The languages of the text are: ${textLanguage}`);
            if (textLanguage.includes("Chinese")){
                isTextChinese = true;
            }
            if (textLanguage.includes("English")){
                isTextEnglish = true;
            }
            if (mediainfo.includes("x264")){
                mi_x264 = true;
            }
            if (mediainfo.includes("x265")){
                mi_x265 = true;
            }
            // alert(isAudioChinese.toString() + isTextChinese.toString() + isTextEnglish.toString());
        }
    }

    function containsBBCode(str) {
        // 创建一个正则表达式来匹配 [/b]、[/color] 等结束标签
        const regex = /\[\/(b|color|i|u|img)\]/;

        // 使用正则表达式的 test 方法来检查字符串
        return regex.test(str);
    }

    let imdbUrl = $('#kimdb a').attr("href")
    /* if (imdbText.indexOf('douban') >= 0) {
        douban = $(element).attr('title');
    } */
    // console.log(imdbUrl)
    /* if (imdbText.indexOf('imdb') >= 0) {
        imdb = $(element).attr('title');
    } */

    var screenshot = '';
    var pngCount = 0;
    var imgCount = 0;
    var isBriefContainsInfoImg = false;  //是否包含冗余的影片参数图片
    $('#kdescr img').each(function(index, element) {
        var src = $(element).attr('src');
        if(src != undefined) {
            if (index != 0) {
                screenshot += '\n';
            }
            screenshot += src.trim();
            if (src.includes("img.pterclub.com/images/2024/01/10/49401952f8353abd4246023bff8de2cc.png") || src.includes("Mediainfo.png")) {
                isBriefContainsInfoImg = true;
            }
        }
        if (src.indexOf('.png') >= 0) {
            pngCount++;
        }
        imgCount++;
    });

    let error = false;
    let warning = false;

    switch(review_info_position) {
        case 1:
            $('#outer').prepend('<div style="display: inline-block; padding: 10px 30px; color: black; background: #ffdd59; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips-warning"></div><br>');
            $('#outer').prepend('<div style="display: inline-block; padding: 10px 30px; color: white; background: #F44336; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips"></div><br>');
            break;
        case 2:
            $('#top').after('<div style="display: inline-block; padding: 10px 30px; color: white; background: #F44336; font-weight: bold; border-radius: 5px; margin: 0px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips"></div><br><div style="display: inline-block; padding: 10px 30px; color: black; background: #ffdd59; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips-warning"></div><br>');
            break;
        case 3:
            $('#top').before('<div style="display: inline-block; padding: 10px 30px; color: white; background: #F44336; font-weight: bold; border-radius: 5px; margin: 0px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips"></div><br><div style="display: inline-block; padding: 10px 30px; color: black; background: #ffdd59; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips-warning"></div><br>');
            break;
        default:
            $('#top').after('<div style="display: inline-block; padding: 10px 30px; color: white; background: #F44336; font-weight: bold; border-radius: 5px; margin: 0px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips"></div><br><div style="display: inline-block; padding: 10px 30px; color: black; background: #ffdd59; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips-warning"></div><br>');
    }

    $('#assistant-tooltips').append('【错误】: ');
    $('#assistant-tooltips-warning').append('【警告】: ');

    /* if (/\s+/.test(title)) {
        $('#assistant-tooltips').append('主标题包含空格<br>');
        error = true;
    } */
    if(/[^\x00-\xff]+/g.test(title) && !title.includes('￡') && !title.includes('™') && !/[\u2161-\u2169]/g.test(title) && !title.includes('Ⅰ') && !title.includes('白自在') && !title.includes('至尊宝')) {
        $('#assistant-tooltips').append('主标题包含中文或中文字符<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }
    if (!subtitle) {
        $('#assistant-tooltips').append('副标题为空<br>');
        error = true;
  setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if (isSubtitleAnime && cat !== 405) {
        $('#assistant-tooltips').append('类型未选择Anime(动漫)<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }
    if (!cat) {
        $('#assistant-tooltips').append('未选择分类<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }
    if (!type) {
        $('#assistant-tooltips').append('未选择媒介<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    } else {
        // console.log("标题检测格式为" + type_constant[title_type] + "，选择格式为" + type_constant[type]);
        if (title_type && title_type !== type ) {
            $('#assistant-tooltips').append("标题检测媒介为" + type_constant[title_type] + "，选择媒介为" + type_constant[type] + '<br>');
            error = true;
          setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);

        }
    }
    if (!encode) {
        $('#assistant-tooltips').append('未选择主视频编码<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    } else {
        if (title_encode && title_encode !== encode) {
            // console.log("标题检测视频编码为" + encode_constant[title_encode] + "，选择视频编码为" + encode_constant[encode]);
            $('#assistant-tooltips').append("标题检测视频编码为" + encode_constant[title_encode] + "，选择视频编码为" + encode_constant[encode] + '<br>');
            error = true;
          setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
        }
    }
    if (!audio) {
        $('#assistant-tooltips').append('未选择主音频编码<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    } else {
        if (title_audio && title_audio !== audio) {
            console.log("标题检测音频编码为" + audio_constant[title_audio] + "，选择音频编码为" + audio_constant[audio]);
            // $('#assistant-tooltips-warning').append("标题检测音频编码为" + audio_constant[title_audio] + "，选择音频编码为" + audio_constant[audio] + '<br>');
            // warning = true;
            $('#assistant-tooltips').append("标题检测音频编码为" + audio_constant[title_audio] + "，选择音频编码为" + audio_constant[audio] + '<br>');
            error = true;
          setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
        }
    }
    if (!resolution) {
        $('#assistant-tooltips').append('未选择分辨率<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    } else {
        if (title_resolution && title_resolution !== resolution) {
            $('#assistant-tooltips').append("标题检测分辨率为" + resolution_constant[title_resolution] + "，选择分辨率为" + resolution_constant[resolution] + '<br>');
            error = true;
          setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
        }
    }

    if ((resolution === 8 ||resolution === 4 || title_resolution === 4) && !(godDramaSeed || officialSeed)){
         $('#assistant-tooltips-warning').append("请检查是否有更高清的资源<br>");
         warning = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if (title_is_complete && !is_complete && (cat === 402 || cat === 403 || cat === 404)) {
        $('#assistant-tooltips-warning').append("完结剧集请添加完结标签<br>");
         warning = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

//     if (!dbUrl && cat !==421) {
//         $('#assistant-tooltips').append('简介中未检测到IMDb或豆瓣链接<br>');
//         error = true;
//       setTimeout(function() {let button = document.querySelector('#approval1111');
// button.click();
// }, 500);
//     }

    if(mediainfo_short === mediainfo && officialSeed == true) {
        $('#assistant-tooltips').append('媒体信息未解析<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }
    if(mediainfo_short === mediainfo && officialSeed == false) {
        // $('#assistant-tooltips-warning').append('媒体信息未解析<br>');
        // warning = true;
    }

    if(mediainfo_err) {
        $('#assistant-tooltips').append(mediainfo_err).append('<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if (officialSeed && !isGroupSelected) {
        $('#assistant-tooltips').append('未选择制作组<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

//     if(is_untrusted_group) {
//         $('#assistant-tooltips-warning').append('检测为疑似未信任制作组发布的资源<br>');
//         warning = true;
//       setTimeout(function() {let button = document.querySelector('#approval1111');
// button.click();
// }, 500);
//     }

    if (godDramaSeed && !isReseedProhibited && isBriefContainsForbidReseed) {
        $('#assistant-tooltips').append('未选择禁转标签<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if (godDramaSeed && cat !== 421) {
        $('#assistant-tooltips').append('未选择短剧类型<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if (godDramaSeed && !isTagResident) {
        $('#assistant-tooltips').append('未选择驻站标签<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if (isBriefContainsInfoImg) {
        $('#assistant-tooltips-warning').append('请删除多余的影片参数/媒体信息图片<br>');
        warning = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if (!officialSeed && isOfficialSeedLabel) {
        $('#assistant-tooltips').append('非官种不可选择官方标签<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if (officialSeed && !isOfficialSeedLabel) {
        $('#assistant-tooltips').append('官种未选择官方标签<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if ((officialSeed || godDramaSeed) && !isIceSeedLabel) {
        $('#assistant-tooltips').append('未选择麒麟火标签<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

//     if (!isEpisode && title_is_episode) {
//         $('#assistant-tooltips').append('未选择分集标签<br>');
//         error = true;
//     setTimeout(function() {let button = document.querySelector('#approval1111');
// button.click();
// }, 500);
//     }

    if (isMediainfoEmpty == true) {
        $('#assistant-tooltips').append('请补充Mediainfo信息<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if(!isBriefContainsMovieBrief) {
        $('#assistant-tooltips').append('未填写影片简介<br>');
        // $('#assistant-tooltips').html($('#assistant-tooltips').html().replace('简介中未检测到IMDb或豆瓣链接<br>', ''));
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);

    }

//     if(isAudioChinese && !isTagAudioChinese) {
//         $('#assistant-tooltips').append('未选择国语标签<br>');
//         error = true;
//     }
//     if(isTextChinese && !isTagTextChinese) {
//         $('#assistant-tooltips-warning').append('未选择中字标签<br>');
//         warning = true;
//       setTimeout(function() {let button = document.querySelector('#approval1111');
// button.click();
// }, 500);
//     }
//     if(isTextEnglish && !isTagTextEnglish) {
//         $('#assistant-tooltips-warning').append('未选择英字标签<br>');
//         warning = true;
//       setTimeout(function() {let button = document.querySelector('#approval1111');
// button.click();
// }, 500);
//     }
    if(isBiggerThan1T && !isTagBigTorrent) {
        $('#assistant-tooltips-warning').append('未选择大包标签<br>');
        warning = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }
//     if(!isBiggerThan1T && isTagBigTorrent) {
//         $('#assistant-tooltips').append('小于1T的资源无需添加大包标签<br>');
//         error = true;
//     }

    /* if (pngCount < 3) {
        $('#assistant-tooltips').append('PNG格式的图片未满3张<br>');
        error = true;
    } */
    if (imgCount < 2) {
        $('#assistant-tooltips').append('缺少海报或截图<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
      button.click();
      }, 500);
    }
//     临时if (isMediainfoEmpty) {
//         $('#assistant-tooltips').append('Mediainfo栏为空<br>');
//         error = true;
//       setTimeout(function() {let button = document.querySelector('#approval1111');
// button.click();
// }, 500);
//     }

    if(mi_x264 && !title_x264 && officialSeed && category === 6){
        $('#assistant-tooltips').append('主标题中编码应为 x264<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }
    if(mi_x265 && !title_x265 && officialSeed && category === 6){
        $('#assistant-tooltips').append('主标题中编码应为 x265<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if (officialMusicSeed) {
        $('#assistant-tooltips').empty();
        error = false;
        if (!isGroupSelected) {
            $('#assistant-tooltips').append('未选择制作组<br>');
            error = true;
          setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
        }
    }

    if (cat === 413 || cat === 418 || cat === 415 || cat === 412 || cat === 411 || cat === 408) {
        $('#assistant-tooltips').empty();
        error = false;
        $('#assistant-tooltips-warning').empty();
        warning = false;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if(cat === 411 && !title_lowercase.includes("khz")) {
        $('#assistant-tooltips').append('主标题缺少采样频率<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    if(cat === 411 && !title_lowercase.includes("bit")) {
        $('#assistant-tooltips').append('主标题缺少比特率<br>');
        error = true;
      setTimeout(function() {let button = document.querySelector('#approval1111');
button.click();
}, 500);
    }

    var isFoundReviewLink = false; // 是否有审核按钮（仅有权限人员可一键填入错误信息）
    // 添加一键通过按钮到页面
    function addApproveLink() {
        var tdlist = $('#outer').find('td');
        var text;
        for (var i = 0; i < tdlist.length; i ++) {
            var td = $(tdlist[i]);

            if (td.text() == '行为') {
                var elements = td.parent().children().last();
                elements.contents().each(function() {
                    // console.log(this.textContent);
                    if (isFoundReviewLink) {
                        $(this).before(' | <a href="javascript:;" id="approvelink" class="small"><b><font><svg t="1655224943277" class="icon" viewBox="0 0 1397 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="45530" width="16" height="16"><path d="M1396.363636 121.018182c0 0-223.418182 74.472727-484.072727 372.363636-242.036364 269.963636-297.890909 381.672727-390.981818 530.618182C512 1014.690909 372.363636 744.727273 0 549.236364l195.490909-186.181818c0 0 176.872727 121.018182 297.890909 344.436364 0 0 307.2-474.763636 902.981818-707.490909L1396.363636 121.018182 1396.363636 121.018182zM1396.363636 121.018182" p-id="45531" fill="#8BC34A"></path></svg><svg t="1655224943277" class="icon" viewBox="0 0 1397 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="45530" width="16" height="16"><path d="M1396.363636 121.018182c0 0-223.418182 74.472727-484.072727 372.363636-242.036364 269.963636-297.890909 381.672727-390.981818 530.618182C512 1014.690909 372.363636 744.727273 0 549.236364l195.490909-186.181818c0 0 176.872727 121.018182 297.890909 344.436364 0 0 307.2-474.763636 902.981818-707.490909L1396.363636 121.018182 1396.363636 121.018182zM1396.363636 121.018182" p-id="45531" fill="#8BC34A"></path></svg>&nbsp;一键通过</font></b></a>'); // Add new hyperlink and separator
                        $('#addcuruser').after(' | <a href="javascript:;" id="approvelink_foot" class="small"><b><font><svg t="1655224943277" class="icon" viewBox="0 0 1397 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="45530" width="16" height="16"><path d="M1396.363636 121.018182c0 0-223.418182 74.472727-484.072727 372.363636-242.036364 269.963636-297.890909 381.672727-390.981818 530.618182C512 1014.690909 372.363636 744.727273 0 549.236364l195.490909-186.181818c0 0 176.872727 121.018182 297.890909 344.436364 0 0 307.2-474.763636 902.981818-707.490909L1396.363636 121.018182 1396.363636 121.018182zM1396.363636 121.018182" p-id="45531" fill="#8BC34A"></path></svg><svg t="1655224943277" class="icon" viewBox="0 0 1397 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="45530" width="16" height="16"><path d="M1396.363636 121.018182c0 0-223.418182 74.472727-484.072727 372.363636-242.036364 269.963636-297.890909 381.672727-390.981818 530.618182C512 1014.690909 372.363636 744.727273 0 549.236364l195.490909-186.181818c0 0 176.872727 121.018182 297.890909 344.436364 0 0 307.2-474.763636 902.981818-707.490909L1396.363636 121.018182 1396.363636 121.018182zM1396.363636 121.018182" p-id="45531" fill="#8BC34A"></path></svg>&nbsp;一键通过</font></b></a>'); // Add new hyperlink and separator

                        var actionLink = document.querySelector('#approvelink');
                        var approvelink_foot = document.querySelector('#approvelink_foot');
                        actionLink.style.fontSize = fontsize;
                        approvelink_foot.style.fontSize = fontsize;
                        actionLink.addEventListener('click', function(event) {
                            if (error) {
                                // alert("当前种子仍有错误!");
                                GM_setValue('autoFillErrorInfo', false);
                                var popup = document.createElement('div');
                                popup.id = "popup";
                                popup.style.fontSize = "20pt";
                                popup.style.position = "fixed";
                                popup.style.top = "10%";
                                popup.style.left = "10%";
                                popup.style.transform = "translate(-50%, -50%)";
                                popup.style.backgroundColor = "rgb(234, 32, 39)";
                                popup.style.color = "white";
                                popup.style.padding = "15px";
                                popup.style.borderRadius = "10px";
                                popup.style.display = "none";
                                document.body.appendChild(popup);

                                // 弹出悬浮框提示信息
                                popup.innerText = "当前种子仍有错误!";
                                popup.style.display = "block";

                                // 1秒后隐藏悬浮框
                                setTimeout(function() {
                                    popup.style.display = "none";
                                }, 1000);
                            }
                            event.preventDefault(); // 阻止超链接的默认行为
                            // 设置标记以供新页面使用
                            GM_setValue('autoCheckAndConfirm', true);
                            if (autoclose) {
                                GM_setValue('autoClose', true);
                            }
                            if (autoback) {
                                GM_setValue('autoBack', true);
                            }
                            // 找到并点击指定按钮
                            var specifiedButton = document.querySelector('#approval1111'); // 替换为实际的按钮选择器
                            if (specifiedButton) {
                                specifiedButton.click();
                            }
                        });
                        approvelink_foot.addEventListener('click', function(event) {
                            if (error) {
                                // alert("当前种子仍有错误!");
                                GM_setValue('autoFillErrorInfo', false);
                                var popup = document.createElement('div');
                                popup.id = "popup";
                                popup.style.fontSize = "20pt";
                                popup.style.position = "fixed";
                                popup.style.top = "10%";
                                popup.style.left = "10%";
                                popup.style.transform = "translate(-50%, -50%)";
                                popup.style.backgroundColor = "rgb(234, 32, 39)";
                                popup.style.color = "white";
                                popup.style.padding = "15px";
                                popup.style.borderRadius = "10px";
                                popup.style.display = "none";
                                document.body.appendChild(popup);

                                // 弹出悬浮框提示信息
                                popup.innerText = "当前种子仍有错误!";
                                popup.style.display = "block";

                                // 1秒后隐藏悬浮框
                                setTimeout(function() {
                                    popup.style.display = "none";
                                }, 1000);
                            }
                            event.preventDefault(); // 阻止超链接的默认行为
                            // 设置标记以供新页面使用
                            GM_setValue('autoCheckAndConfirm', true);
                            if (autoclose) {
                                GM_setValue('autoClose', true);
                            }
                            if (autoback) {
                                GM_setValue('autoBack', true);
                            }
                            // 找到并点击指定按钮
                            var specifiedButton = document.querySelector('#approval1111'); // 替换为实际的按钮选择器
                            if (specifiedButton) {
                                specifiedButton.click();
                            }
                        });
                        return false; // Exit the loop
                    }

                    if (this.textContent.includes('审核')) { // Check for text nodes containing the separator
                        // console.log("找到审核按钮");
                        isFoundReviewLink = true;
                    }
                });
            }
        }
    }

//     $('#assistant-tooltips').click(function(){
//         if (error && isFoundReviewLink) {
//             GM_setValue('autoFillErrorInfo', true);
//             // console.log("errorinfo_before:"+$("#approval1111-comment").html());
//             GM_setValue('errorInfo', document.getElementById('assistant-tooltips').innerHTML);
//             // 找到并点击指定按钮
//             var specifiedButton = document.querySelector('#approval1111'); // 替换为实际的按钮选择器
//             if (specifiedButton) {
//                 specifiedButton.click();
//             }
//         } else {
//             console.log("当前种子无错误或非种审人员，点击无效");
//         }
//     });

    // 主页面操作
    if (/https:\/\/.*\.hdkyl\.in\/details\.php\?id=.*/.test(window.location.href)) {
        addApproveLink();
        //console.log("autoFillErrorInfo:"+GM_getValue('autoFillErrorInfo'));
        //console.log("autoCheckAndConfirm:"+GM_getValue('autoCheckAndConfirm'));
        if (biggerbutton) {
            if (!error && isFoundReviewLink){
                // console.log("此种子未检测到错误");
                document.querySelector('#approvelink').style.fontSize = biggerbuttonsize;
                document.querySelector('#approvelink_foot').style.fontSize = biggerbuttonsize;
            } else if ((error && isFoundReviewLink)){
                document.querySelector('#approval1111').style.fontSize = biggerbuttonsize;
            }
        }
        if (GM_getValue('autoClose', false)){
            GM_setValue('autoClose', false);
            window.close();
        }
        if (GM_getValue('autoBack', false)){
            GM_setValue('autoBack', false);
            window.history.back();
        }
    }

    // 弹出页的操作
    if (/https:\/\/.*\.hdkyl\.in\/web\/torrent-approval1111-page\?torrent_id=.*/.test(window.location.href)) {
        // 使用延迟来等待页面可能的异步加载
        setTimeout(function() {
            //console.log("autoFillErrorInfo:"+GM_getValue('autoFillErrorInfo'));
            //console.log("autoCheckAndConfirm:"+GM_getValue('autoCheckAndConfirm'));
            if (GM_getValue('autoCheckAndConfirm', false)) {
                var radioPassButton = document.querySelector("body > div.form-comments > form > div:nth-child(3) > div > div:nth-child(4) > div").click();
                if (radioPassButton) {
                    radioPassButton.checked = true;
                }

                var confirmButton = document.querySelector("body > div.form-comments > form > div:nth-child(5) > div > button:nth-child(1)");
                if (confirmButton) {
                    // 完成操作后，清除标记

                    GM_setValue('autoCheckAndConfirm', false);
                    GM_setValue('autoFillErrorInfo', false);
                    confirmButton.click();
                }
            }
            if (GM_getValue('autoFillErrorInfo', false)) {
                var radioDenyButton = document.querySelector("body > div.form-comments > form > div:nth-child(3) > div > div:nth-child(6)").click();
                if (radioDenyButton) {
                    radioDenyButton.checked = true;
                }
                var errorInfo = GM_getValue('errorInfo', "");
                // console.log("errorInfo: "+errorInfo);
                errorInfo = errorInfo.replace("【错误】: ", "");
                // 临时errorInfo = errorInfo.replace("MediaInfo中含有bbcode", "请将MediaInfo中多余的标签删除，例如：[b][color=royalblue]******[/color][/b]");
                errorInfo = errorInfo.replace("简介中包含Mediainfo", "请删去简介中的MediaInfo");
                errorInfo = errorInfo.replace("媒体信息未解析", '<span>请使用通过MediaInfo或者PotPlayer获取的正确的mediainfo信息，具体方法详见<a href="https://www.hdkyl.in/forums.php?action=viewtopic&topicid=9" style="color:#E57373;font-size:10pt" target="_blank"> 发种教程 </a></span><br>');
                errorInfo = errorInfo.replace("简介中未检测到IMDb或豆瓣链接", "请补充imdb/豆瓣链接");
                errorInfo = errorInfo.replace("副标题为空", "请补充副标题");
                // console.log("errorInfo: "+errorInfo);
                $("#approval1111-comment").text(errorInfo);
                 let button = document.querySelector('#tijiao');
                 button.click();
                 GM_setValue('autoClose', true);

                // 完成操作后，清除标记
                // GM_setValue('autoFillErrorInfo', false);
                // GM_setValue('errorInfo', "");
            }
        }, timeout); // 可能需要根据实际情况调整延迟时间
    }

    // 快捷键 ctrl+e 一键通过
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F4') {
            if(!error){
                let button = document.querySelector('#approvelink');
                button.click();
            }
            else {
                let button = document.querySelector('#approval1111');
                button.click();
            }
        }
        if (e.key === 'F3') {
            window.close();
        }
    });

    // 种子存在错误便设置变量
    if (error && isFoundReviewLink) {
        GM_setValue('autoFillErrorInfo', true);
        GM_setValue('errorInfo', document.getElementById('assistant-tooltips').innerHTML);
    } else if (!error) {
        GM_setValue('autoFillErrorInfo', false);
        // GM_setValue('errorInfo', "");
    }

    if (add_link_before_img && isFoundReviewLink) {
        // 查找ID为kdescr的元素内的所有<img>元素
        var images = document.querySelectorAll('#kdescr img');

        // 遍历这些图片
        images.forEach(function(img) {
            // 获取每个图片的源链接（src属性）
            var src = img.getAttribute('src');

            // 创建一个新的<a>元素
            var link = document.createElement('a');
            // 设置<a>元素的href属性为图片的链接
            link.setAttribute('href', src);
            // 设置<a>标签的目标为新标签页打开
            link.setAttribute('target', '_blank');
            // 插入文字或说明到<a>标签中，如果需要
            link.textContent = '打开图片链接 ( 种审用 )';

            // 创建一个新的<br>元素用于分行
            var breakLine1 = document.createElement('br');
            // 将<br>元素插入到<a>元素后面
            img.parentNode.insertBefore(breakLine1, img);
            // 将<a>元素插入到图片元素前面
            img.parentNode.insertBefore(link, img);
            // link.style.color = '#EA2027';
            // 创建一个新的<br>元素用于分行
            var breakLine2 = document.createElement('br');
            // 将<br>元素插入到<a>元素后面
            img.parentNode.insertBefore(breakLine2, img);
        });


//         $('img').click(function(event) {
//             // 阻止默认的点击行为
//             event.preventDefault();
//             // 获取图片链接
//             var imageSrc = $(this).attr('src');
//             // 打开图片链接
//             window.open(imageSrc, '_blank');
//         });
//         // 为所有 <img> 元素添加鼠标移入事件监听器
//         $('img').mouseenter(function() {
//             // 将鼠标样式设置为手型
//             $(this).css('cursor', 'pointer');
//         });

//         // 为所有 <img> 元素添加鼠标移出事件监听器
//         $('img').mouseleave(function() {
//             // 将鼠标样式恢复默认
//             $(this).css('cursor', 'auto');
//         });
    }

    //console.log("============================error:"+error+"isFoundReviewLink:"+isFoundReviewLink);
    //console.log("============================autoFillErrorInfo:"+GM_getValue('autoFillErrorInfo')+"errorInfo:"+GM_getValue('errorInfo'));


    if (error) {
        $('#assistant-tooltips').css('background', '#EA2027');
    } else {
        $('#assistant-tooltips').empty();
        $('#assistant-tooltips').append('此种子未检测到错误');
         setTimeout(function() {
         let button = document.querySelector('#approvelink');
         button.click();
         },500);
        setTimeout(function() {
          GM_setValue('autoClose', true);
         },2000);

        $('#assistant-tooltips').css('background', '#8BC34A');
    }
    if (!warning) {
        $('#assistant-tooltips-warning').hide();
    }

    if (!error && warning) {
        $('#assistant-tooltips').hide();
    }
    // $('#assistant-tooltips-warning').hide();
    // console.log("warning:"+warning);



})();