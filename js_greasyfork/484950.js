// ==UserScript==
// @name         HDKylin 管理组专用脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  HDKylin管理组专用脚本
// @author       HDKylin
// @match        *://*.hdkyl.in/web/torrent-approval-page?torrent_id=*
// @match        *://*.hdkyl.in/details.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.hdkyl.in
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484950/HDKylin%20%E7%AE%A1%E7%90%86%E7%BB%84%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/484950/HDKylin%20%E7%AE%A1%E7%90%86%E7%BB%84%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义参数
    var fontsize = "9pt"; //一键通过按钮的字体大小
    var timeout = 1000;    // 弹出页内鼠标点击间隔，单位毫秒，设置越小点击越快，但是对网络要求更高

    // 添加悬浮按钮到页面
    function addApproveLink() {
        var tdlist = $('#outer').find('td');
        var text;
        for (var i = 0; i < tdlist.length; i ++) {
            var td = $(tdlist[i]);

            if (td.text() == '行为') {
                var elements = td.parent().children().last();
                var isFoundReviewLink = false;
                elements.contents().each(function() {
                    // console.log(this.textContent);
                    if (isFoundReviewLink) {
                        $(this).before(' | <a href="javascript:;" id="approvelink" class="small"><b><font><svg t="1655224943277" class="icon" viewBox="0 0 1397 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="45530" width="16" height="16"><path d="M1396.363636 121.018182c0 0-223.418182 74.472727-484.072727 372.363636-242.036364 269.963636-297.890909 381.672727-390.981818 530.618182C512 1014.690909 372.363636 744.727273 0 549.236364l195.490909-186.181818c0 0 176.872727 121.018182 297.890909 344.436364 0 0 307.2-474.763636 902.981818-707.490909L1396.363636 121.018182 1396.363636 121.018182zM1396.363636 121.018182" p-id="45531" fill="#8BC34A"></path></svg><svg t="1655224943277" class="icon" viewBox="0 0 1397 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="45530" width="16" height="16"><path d="M1396.363636 121.018182c0 0-223.418182 74.472727-484.072727 372.363636-242.036364 269.963636-297.890909 381.672727-390.981818 530.618182C512 1014.690909 372.363636 744.727273 0 549.236364l195.490909-186.181818c0 0 176.872727 121.018182 297.890909 344.436364 0 0 307.2-474.763636 902.981818-707.490909L1396.363636 121.018182 1396.363636 121.018182zM1396.363636 121.018182" p-id="45531" fill="#8BC34A"></path></svg>&nbsp;一键通过</font></b></a>'); // Add new hyperlink and separator
                        var actionLink = document.querySelector('#approvelink');
                        actionLink.style.fontSize = fontsize;
                        // 添加鼠标悬停事件来改变文字颜色
                        actionLink.addEventListener('mouseover', function() {
                            actionLink.style.color = 'red'; // 鼠标悬停时文字颜色变为红色
                        });
                        actionLink.addEventListener('mouseout', function() {
                            actionLink.style.color = 'black'; // 鼠标离开时文字颜色变回黑色
                        });
                        actionLink.addEventListener('click', function(event) {
                            event.preventDefault(); // 阻止超链接的默认行为
                            // 设置标记以供新页面使用
                            GM_setValue('autoCheckAndConfirm', true);
                            // 找到并点击指定按钮
                            var specifiedButton = document.querySelector('#approval'); // 替换为实际的按钮选择器
                            if (specifiedButton) {
                                specifiedButton.click();
                            }
                        });
                        return false; // Exit the loop
                    }

                    if (this.textContent.includes('审核')) { // Check for text nodes containing the separator
                        console.log("找到审核按钮");
                        isFoundReviewLink = true;
                    }
                });
            }
        }
    }

    // 主页面操作
    if (/https:\/\/.*\.hdkyl\.in\/details\.php\?id=.*/.test(window.location.href)) {
        addApproveLink();
    }

    // 新页面的操作
    if (/https:\/\/.*\.hdkyl\.in\/web\/torrent-approval-page\?torrent_id=.*/.test(window.location.href)) {
        // 使用延迟来等待页面可能的异步加载
        setTimeout(function() {
            if (GM_getValue('autoCheckAndConfirm', false)) {
                var radioButton = document.querySelector("body > div.form-comments > form > div:nth-child(3) > div > div:nth-child(4) > div").click();
                if (radioButton) {
                    radioButton.checked = true;
                }

                var confirmButton = document.querySelector("body > div.form-comments > form > div:nth-child(5) > div > button:nth-child(1)");
                if (confirmButton) {
                    confirmButton.click();
                }

                // 完成操作后，清除标记
                GM_setValue('autoCheckAndConfirm', false);
            }
        }, timeout); // 可能需要根据实际情况调整延迟时间
    }
})();


(function() {
    'use strict';
    var cat_constant = {
        401: 'Movies/电影',
        402: 'TV Series/电视剧',
        421: 'Playlet/短剧',
        408: 'HQ Audio/音乐',
        404: 'Record Education/纪录教育',
        419: 'Study/学习',
        405: 'Animations/动漫',
        407: 'Sports/体育运动',
        406: 'Music Videos/音乐视频',
        411: 'software/软件',
        412: 'Game/游戏',
        413: 'Ebook/电子书',
        420: 'TV Shows/综艺',
        409: 'Misc/其他'
    };

    var type_constant = {
        23: 'RemuxUHD Blu-ray',
        24: 'UHD Blu-ray/DIY',
        25: 'Blu-ray(原盘)',
        26: 'Blu-ray/DIY',
        27: 'DVD(原盘)',
        28: 'HDTV',
        29: 'Encode',
        30: 'REMUX',
        31: 'WEB-DL',
        32: 'Track',
        33: 'CD',
        34: 'Other'

    };

    var encode_constant = {
        6: 'H.265/HEVC',
        1: 'H.264/AVC',
        2: 'VC-1',
        3: 'Xvid',
        4: 'MPEG-2/MPEG-4',
        5: 'Other'
    };

    var audio_constant = {
        8: 'DTS-HD MA',
        9: 'TrueHD',
        10: 'LPCM',
        11: 'DD/AC3',
        12: 'APE',
        13: 'WAV',
        14: 'M4A',
        1: 'FLAC',
        3: 'DTS',
        4: 'MP3',
        5: 'OGG',
        6: 'AAC',
        7: 'Other'
    };

    var resolution_constant = {
        7: '8K',
        6: '4K',
        1: '1080p',
        2: '1080i',
        3: '720p',
        8: '480P',
        4: 'SD'
    };

    var area_constant = {
    }

    var group_constant = {
        6: 'HDKylin',
        7: 'HDKylinWeb',
        8: 'HDKylinGame',
        1: 'HDKylinMV',
        2: 'HDKylinTV',
        3: 'HDKylinDIY',
        5: 'Other'

    }

    const brief = $("#kdescr").text().toLowerCase(); // 获取元素的文本内容
    const containsIMDbLink = brief.includes("imdb.com"); // 检查内容是否包含 imdb.com 链接
    const containsDoubanLink = brief.includes("douban.com"); // 检查内容是否包含 douban.com 链接

    var dbUrl; // 是否包含影片链接
    if (containsIMDbLink || containsDoubanLink) {
        dbUrl = true;
        // console.log("内容中包含 IMDb 或 Douban 链接");
    } else {
        dbUrl = false;
        // console.log("内容中不包含 IMDb 或 Douban 链接");
    }

    var isBriefContainsInfo = false;  //是否包含Mediainfo
    // 英文详细info
    if (brief.includes("general") && brief.includes("video") && brief.includes("audio")) {
        isBriefContainsInfo = true;
        // console.log("简介中包含Mediainfo");
    }
    // 中文详细info
    if (brief.includes("概览") && brief.includes("视频") && brief.includes("音频")) {
        isBriefContainsInfo = true;
        // console.log("简介中包含Mediainfo");
    }
    if (brief.includes("disc info") || brief.includes(".release.info") || brief.includes("general information")) {
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

    var title = $('#top').text();
    var exclusive = 0;
    if (title.indexOf('禁转') >= 0) {
        exclusive = 1;
    }
    title = title.replace(/禁转|\((已审|冻结|待定)\)|\[(免费|50%|2X免费|30%|2X 50%)\]|\(限时\d+.*\)|\[2X\]|\[(推荐|热门|经典|已审)\]/g, '').trim();
    title = title.replace(/剩余时间.*/g,'').trim();
    title = title.replace("(禁止)",'').trim();
    console.log(title);

    var officialSeed = 0; //官组种子
    var godDramaSeed = 0; //驻站短剧组种子
    var officialMusicSeed = 0; //官组音乐种子
    if(title.includes("HDKylin") ||title.includes("HDK") || title.includes("HDKylinWeb") || title.includes("HDKylinGame") || title.includes("HDKylinMV")|| title.includes("HDKylinTV")|| title.includes("HDKylinDIY")) {
        officialSeed = 1;
        //console.log("官种");
    }
    if(title.includes("GodDramas")) {
        godDramaSeed = 1;
        //console.log("短剧种");
    }
    if(title.includes("AGSVMUS")) {
        officialMusicSeed = 1;
        //console.log("音乐官种");
    }

    var title_lowercase = title.toLowerCase();
    console.log("title_lowercase:"+title_lowercase);
    var title_type, title_encode, title_audio, title_resolution, title_group, title_is_complete;

    // 媒介
    if(title_lowercase.includes("web-dl") || title_lowercase.includes("webdl")){
        title_type = 10;
    } else if (title_lowercase.includes("hdtv")) {
        title_type = 5;
    } else if (title_lowercase.includes("remux")) {
        title_type = 3;
    } else if ((title_lowercase.includes("blu-ray") || title_lowercase.includes("bluray") || title_lowercase.includes("uhd blu-ray") || title_lowercase.includes("uhd bluray")) && (title_lowercase.includes("x265") || title_lowercase.includes("x264"))) {
        title_type = 7;
    } else if (title_lowercase.includes("webrip") || title_lowercase.includes("dvdrip") || title_lowercase.includes("bdrip")) {
        title_type = 7;
    }

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
    } else if (title_lowercase.includes("ddp") || title_lowercase.includes("dd+")) {
        title_audio = 19;
    } else if (title_lowercase.includes("aac")) {
        title_audio = 6;
    } else if (title_lowercase.includes("ac3")) {
        title_audio = 11;
    }

    // 分辨率
    if(title_lowercase.includes("1080p") || title_lowercase.includes("1080i")){
        title_resolution = 1;
    } else if (title_lowercase.includes("720p") || title_lowercase.includes("720i")) {
        title_resolution = 3;
    } else if (title_lowercase.includes("480p") || title_lowercase.includes("480i")) {
        title_resolution = 4;
    } else if (title_lowercase.includes("4k") || title_lowercase.includes("2160p") || title_lowercase.includes("2160i") || title_lowercase.includes("uhd")) {
        title_resolution = 6;
    } else if (title_lowercase.includes("8k") || title_lowercase.includes("4320p") || title_lowercase.includes("4320i")) {
        title_resolution = 11;
    }

    var subtitle, cat, type, encode, audio, resolution, area, group, anonymous, is_complete,category;
    var poster;
    var fixtd, douban, imdb, mediainfo, mediainfo_short,mediainfo_err;
    var isGroupSelected = false; //是否选择了制作组
    var isReseedProhibited = false; //是否选择了禁转标签
    var isOfficialSeedLabel = false; //是否选择了官种标签
    var isMediainfoEmpty = false; //Mediainfo栏内容是否为空

    var tdlist = $('#outer').find('td');
    for (var i = 0; i < tdlist.length; i ++) {
        var td = $(tdlist[i]);
        if (td.text() == '副标题' || td.text() == '副標題') {
            subtitle = td.parent().children().last().text();
        }

        if (td.text() == '添加') {
            var text = td.parent().children().last().text();
            if (text.indexOf('匿名') >= 0) {
                anonymous = 1;
            }
        }

        if (td.text() == '标签') {
            var text = td.parent().children().last().text();
            //console.log('标签: '+text);
            if(text.includes("禁转")){
                isReseedProhibited = true;
                //console.log("已选择禁转标签");
            }
            if(text.includes("官方")){
                isOfficialSeedLabel = true;
                console.log("已选择官方标签");
            }
        }


        if (td.text() == '基本信息') {
            var text = td.parent().children().last().text();
            if(text.includes("制作组")){
                isGroupSelected = true;
                //console.log("已选择制作组");
            }
            console.log(text)
            // 类型
            if (text.indexOf('Movie') >= 0) {
                cat = 401;
            } else if (text.indexOf('TV Series') >= 0) {
                cat = 402;
            } else if (text.indexOf('TV Shows') >= 0) {
                cat = 403;
            } else if (text.indexOf('Documentaries') >= 0) {
                cat = 404;
            } else if (text.indexOf('Anime') >= 0) {
                cat = 405;
            } else if (text.indexOf('MV') >= 0) {
                cat = 406;
            } else if (text.indexOf('Sports') >= 0) {
                cat = 407;
            } else if (text.indexOf('Audio') >= 0) {
                cat = 408;
            } else if (text.indexOf('Misc') >= 0) {
                cat = 409;
            } else if (text.indexOf('Music') >= 0) {
                cat = 411;
            } else if (text.indexOf('Software') >= 0) {
                cat = 412;
            } else if (text.indexOf('Game') >= 0) {
                cat = 413;
            } else if (text.indexOf('E-Book') >= 0) {
                cat = 415;
            } else if (text.indexOf('Comic') >= 0) {
                cat = 416;
            } else if (text.indexOf('Education') >= 0) {
                cat = 417;
            } else if (text.indexOf('Picture') >= 0) {
                cat = 418;
            } else if (text.indexOf('Playlet') >= 0) {
                cat = 419;
            }
            if (text.indexOf('[合集]') >= 0) {
                is_complete = true;
            }
            console.log("cat:"+cat);

            // 格式
            if (text.indexOf('Blu-ray') >= 0) {
                type = 1;
            } else if (text.indexOf('DVD') >= 0) {
                type = 2;
            } else if (text.indexOf('Remux') >= 0) {
                type = 3;
            } else if (text.indexOf('HDTV') >= 0) {
                type = 5;
            } else if (text.indexOf('Encode') >= 0) {
                type = 7;
            } else if (text.indexOf('CD') >= 0) {
                type = 8;
            } else if (text.indexOf('WEB-DL') >= 0) {
                type = 10;
            } else if (text.indexOf('UHD Blu-ray') >= 0) {
                type = 11;
            } else if (text.indexOf('Track') >= 0) {
                type = 12;
            } else if (text.indexOf('媒介: Other') >= 0) {
                type = 13;
            }
            console.log("type:"+type);
            // 视频编码
            if (text.indexOf('H.265/HEVC')  >= 0) {
                encode = 6;
            } else if (text.indexOf('H.264/AVC')  >= 0) {
                encode = 1;
            } else if (text.indexOf('VC-1')  >= 0) {
                encode = 2;
            } else if (text.indexOf('MPEG-2')  >= 0) {
                encode = 4;
            } else if (text.indexOf('AV1')  >= 0) {
                encode = 12;
            }else if (text.indexOf('编码: Other')  >= 0) {
                encode = 5;
            }
            console.log("encode:"+encode);
            //console.log("audio:"+audio);
            // 音频编码
            if (text.indexOf('DTS-HD MA') >= 0) {
                audio = 8;
            } else if (text.indexOf('DTS') >= 0) {
                audio = 3;
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
                audio = 2;
            } else if (text.indexOf('WAV') >= 0) {
                audio = 15;
            } else if (text.indexOf('MP3') >= 0) {
                audio = 4;
            } else if (text.indexOf('M4A') >= 0) {
                audio = 16;
            } else if (text.indexOf('DTS:X') >= 0) {
                audio = 18;
            } else if (text.indexOf('TrueHD Atmos') >= 0) {
                audio = 17;
            } else if (text.indexOf('DDP/E-AC3') >= 0) {
                audio = 19;
            } else if (text.indexOf('音频编码: Other') >= 0) {
                audio = 7;
            }
            console.log("audio:"+audio);
            // 分辨率
            if (text.indexOf('8K') >= 0) {
                resolution = 7;
            } else if (text.indexOf('4K') >= 0) {
                resolution = 6;
            } else if (text.indexOf('1080p') >= 0) {
                resolution = 1;
            } else if (text.indexOf('1080i') >= 0) {
                resolution = 2;
            } else if (text.indexOf('720p') >= 0) {
                resolution = 3;
            } else if (text.indexOf('480P') >= 0) {
                resolution = 8;
            } else if (text.indexOf('SD') >= 0) {
                resolution = 4;
            } else if (text.indexOf('分辨率: Other') >= 0) {
                resolution = 4;
            }
            console.log("resolution:"+resolution);
            // 地区
            if (text.indexOf('Mainland(大陆)') >= 0) {
                area = 1;
            } else if (text.indexOf('Hongkong(香港)') >= 0) {
                area = 2;
            } else if (text.indexOf('Taiwan(台湾)') >= 0) {
                area = 3;
            } else if (text.indexOf('West(欧美)') >= 0) {
                area = 4;
            } else if (text.indexOf('Japan(日本)') >= 0) {
                area = 5;
            } else if (text.indexOf('Korea(韩国)') >= 0) {
                area = 6;
            } else if (text.indexOf('India(印度)') >= 0) {
                area = 7;
            } else if (text.indexOf('Russia(俄国)') >= 0) {
                area = 8;
            } else if (text.indexOf('Thailand(泰国)') >= 0) {
                area = 9;
            } else if (text.indexOf('地区: Other(其他)') >= 0) {
                area = 99;
            }
            if (text.indexOf('HDKylin') >= 0) {
                category = 6;
            } else if (text.indexOf('HDKylinWeb') >= 0) {
                category = 7;
            } else if (text.indexOf('HDKylinGame') >= 0) {
                category = 8;
            } else if (text.indexOf('HDKylinMV') >= 0) {
                category = 1;
            } else if (text.indexOf('HDKylinTV') >= 0) {
                category = 2;
             } else if (text.indexOf('HDKylinDIY') >= 0) {
                category = 3;
            } else if (text.indexOf('制作组: Other') >= 0) {
                category = 5;
            }
            console.log("category:"+category)
        }

        if (td.text() == '副标题' || td.text() == '副標題') {
            subtitle = td.parent().children().last().text();
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
            if ((containsBBCode(mediainfo) || containsBBCode(mediainfo_short)) && mediainfo_short === mediainfo){
                mediainfo_err = "MediaInfo中含有bbcode"
            }
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
    $('#kdescr img').each(function(index, element) {
        var src = $(element).attr('src');
        if(src != undefined) {
            if (index != 0) {
                screenshot += '\n';
            }
            screenshot += src.trim();
        }
        if (src.indexOf('.png') >= 0) {
            pngCount++;
        }
        imgCount++;
    });

    let error = false;
    let warning = false;
    $('#outer').prepend('<div style="display: inline-block; padding: 10px 30px; color: black; background: #ffdd59; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips-warning"></div><br>');
    $('#outer').prepend('<div style="display: inline-block; padding: 10px 30px; color: white; background: #F44336; font-weight: bold; border-radius: 5px; margin: 4px"; display: block; position: fixed;bottom: 0;right: 0;box-shadow: 0 0 10px rgba(0,0,0,0.5); id="assistant-tooltips"></div><br>');
    /* if (/\s+/.test(title)) {
        $('#assistant-tooltips').append('主标题包含空格<br/>');
        error = true;
    } */
    if(/[^\x00-\xff]+/g.test(title) && !title.includes('￡')) {
        $('#assistant-tooltips').append('主标题包含中文或中文字符<br/>');
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
        $('#assistant-tooltips').append('未选择媒介<br/>');
        error = true;
    } else {
        // console.log("标题检测格式为" + type_constant[title_type] + "，选择格式为" + type_constant[type]);
        if (title_type && title_type !== type) {
            $('#assistant-tooltips').append("标题检测媒介为" + type_constant[title_type] + "，选择媒介为" + type_constant[type] + '<br/>');
            error = true;
        }
    }
    if (!encode) {
        $('#assistant-tooltips').append('未选择主视频编码<br/>');
        error = true;
    } else {
        if (title_encode && title_encode !== encode) {
            console.log("标题检测视频编码为" + encode_constant[title_encode] + "，选择视频编码为" + encode_constant[encode]);
            $('#assistant-tooltips').append("标题检测视频编码为" + encode_constant[title_encode] + "，选择视频编码为" + encode_constant[encode] + '<br/>');
            error = true;
        }
    }
    if (!audio) {
        $('#assistant-tooltips').append('未选择主音频编码<br/>');
        error = true;
    } else {
        if (title_audio && title_audio !== audio) {
            console.log("标题检测音频编码为" + audio_constant[title_audio] + "，选择音频编码为" + audio_constant[audio]);
            $('#assistant-tooltips-warning').append("标题检测音频编码为" + audio_constant[title_audio] + "，选择音频编码为" + audio_constant[audio] + '<br/>');
            warning = true;
        }
    }
    if (!resolution) {
        $('#assistant-tooltips').append('未选择分辨率<br/>');
        error = true;
    } else {
        if (title_resolution && title_resolution !== resolution) {
            $('#assistant-tooltips').append("标题检测分辨率为" + resolution_constant[title_resolution] + "，选择分辨率为" + resolution_constant[resolution] + '<br/>');
            error = true;
        }
    }

    if (!dbUrl && !godDramaSeed) {
        $('#assistant-tooltips').append('未检测到IMDb或豆瓣链接<br/>');
        error = true;
    }

    if(mediainfo_short === mediainfo && officialSeed == true) {
        // $('#assistant-tooltips').append('媒体信息未解析<br/>');
        error = true;
    }
    if(mediainfo_short === mediainfo && officialSeed == false) {
        // $('#assistant-tooltips-warning').append('媒体信息未解析<br/>');
        // warning = true;
    }

    if(mediainfo_err) {
        $('#assistant-tooltips').append(mediainfo_err).append('<br/>');
        error = true;
    }

    if (officialSeed && !isGroupSelected) {
        $('#assistant-tooltips').append('未选择制作组<br/>');
        error = true;
    }

    if (godDramaSeed && !isReseedProhibited) {
        $('#assistant-tooltips').append('未选择禁转标签<br/>');
        error = true;
    }

    if (!officialSeed && isOfficialSeedLabel) {
        $('#assistant-tooltips').append('非官种不可选择官方标签<br/>');
        console.log('officialSeed ::: '+ officialSeed)
        error = true;
    }

    if (isBriefContainsInfo) {
        $('#assistant-tooltips').append('简介中包含Mediainfo<br/>');
        error = true;
    }

    /* if (pngCount < 3) {
        $('#assistant-tooltips').append('PNG格式的图片未满3张<br/>');
        error = true;
    } */
    if (imgCount < 2) {
        $('#assistant-tooltips').append('缺少海报或截图<br/>');
        error = true;
    }
    if (isMediainfoEmpty) {
        $('#assistant-tooltips').append('Mediainfo栏为空<br/>');
        error = true;
    }

    if (officialMusicSeed) {
        $('#assistant-tooltips').empty();
        error = false;
        if (!isGroupSelected) {
            $('#assistant-tooltips').append('未选择制作组<br/>');
            error = true;
        }
    }

    var douban_area, douban_cat;
    if (douban) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://movie.douban.com/subject/' + douban + '/',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function(response) {
                var html = $.parseHTML(response.responseText);

                var isshow, isdoc, isani;
                var douban_genres = $(html).find('#info span[property="v:genre"]');
                if (douban_genres) {
                    $(douban_genres).each(function(index, element) {
                        if ($(element).text() == '真人秀') {
                            isshow = 1;
                        }
                        if ($(element).text() == '纪录片') {
                            isdoc = 1;
                        }
                        if ($(element).text() == '动画') {
                            isani = 1;
                        }
                    })
                }

                var type = null;
                var comm_condition = $(html).find('div span.rec a').eq(0);
                if (comm_condition) {
                    type = $(comm_condition).attr('data-type');
                }

                var res = $(html).find('#info').contents()
                    .filter(function() {
                        return this.nodeType == 3;
                    }).text();

                var result = [];
                var array = res.split('\n');
                for (var i = 0; i < array.length; i++) {
                    if (array[i] != '') {
                        var subarray = array[i].split('/');
                        var subresult = [];
                        for (var j = 0; j < subarray.length; j++) {
                            if (subarray[j].trim() != '') {
                                subresult.push(subarray[j].trim());
                            }
                        }
                        if (subresult.length > 0) {
                            result.push(subresult);
                        }
                    }
                }

                var country = result[0][0];
                console.log('country ' + country);

                // 地区判定

                if (country == '中国大陆') {
                    douban_area = 1;
                } else if (country == '中国香港') {
                    douban_area = 2;
                } else if (country == '中国台湾') {
                    douban_area = 3;
                } else if (country == '印度') {
                    douban_area = 7;
                }  else if (country == '日本') {
                    douban_area = 5;
                } else if (country == '韩国') {
                    douban_area = 6;
                } else if (country == '泰国') {
                    douban_area = 9;
                } else if (country == '美国' || country == '英国' || country == '法国' || country == '德国' || country == '西德' || country == '波兰' || country == '意大利' || country == '西班牙'
                           || country == '加拿大' || country == '爱尔兰' || country == '瑞典' || country == '巴西' || country == '丹麦' || country == '奥地利') {
                    douban_area = 4;
                } else if (country == '苏联' || country == '俄罗斯') {
                    douban_area = 8;
                } else {
                    douban_area = 99;
                }

                if (type == '电视剧') {
                    if (isshow) {
                        douban_cat = 505;
                    } else if (isdoc) {
                        douban_cat = 503;
                    } else if (isani) {
                        douban_cat = 504;
                    } else {
                        douban_cat = 502;
                    }
                } else {
                    if (isdoc) {
                        douban_cat = 503;
                    } else if (isani) {
                        douban_cat = 504;
                    } else {
                        douban_cat = 501;
                    }
                }

                if (cat && douban_cat && douban_cat >= 501 && douban_cat <= 505 && douban_cat !== cat) {
                    $('#assistant-tooltips').append("豆瓣检测分类为" + cat_constant[douban_cat] + "，选择分类为" + cat_constant[cat] + '<br/>');
                    error = true;
                }

                if (area && douban_area && douban_area !== area) {
                    $('#assistant-tooltips').append("豆瓣检测地区为" + area_constant[douban_area] + "，选择地区为" + area_constant[area] + '<br/>');
                    error = true;
                }

                if (error) {
                    $('#assistant-tooltips').css('background', 'red');
                } else {
                    $('#assistant-tooltips').append('此种子未检测到异常');
                    $('#assistant-tooltips').css('background', 'green');
                }
            }
        });
    } else {
        if (error) {
            $('#assistant-tooltips').css('background', '#EA2027');
        } else {
            $('#assistant-tooltips').append('此种子未检测到异常');
            $('#assistant-tooltips').css('background', '#8BC34A');
        }
        if (!warning) {
            $('#assistant-tooltips-warning').hide();
        }
        // $('#assistant-tooltips-warning').hide();
        console.log("warning:"+warning);
    }


})();


/**
 * 改自KamePT一键认领, 原网址: https://greasyfork.org/zh-CN/scripts/434757-烧包一键认领
 */

(function () {
  'use strict';

  // Your code here...
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time)).catch((e) => { console.log(e); });
  }

  window.onload = function () {
    var rows = document.querySelectorAll("tr");//tr表行元素，获取所有表行
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].childElementCount == 2 && rows[i].cells[0].innerText == "当前做种") {//如果该表行只有两个子元素且第一个子元素的内部文本为“当前做种”
        var idClaim = document.getElementById("claimAllTorrents");//获取所有ID为的claimAllTorrents的元素
        if (idClaim == null) {//如果为空，则创建一键认领按钮
          const dom = document.createElement('div')
          dom.innerHTML = '<a id="claimAllTorrents" href="javascript:void(0);" onclick="window.manualClaimTorrents();" style="margin-left:10px;font-weight:bold;color:red" title="认领全部当前做种（运行后无法停止，强制停止可关闭页面）">一键认领</a>';
          rows[i].cells[1].prepend(dom)
          break;
        }
      }
    }
  }

  unsafeWindow.manualClaimTorrents = async function () {
    const _raw_list = Array.from(document.querySelectorAll("button[data-action='addClaim']"));
    const list = _raw_list.filter(el => el.style.display != 'none');//获取所有a元素
    console.log(list);
    if (list.length == 0) {
      alert('未检测到已做种种子或已经全部认领\n请打开当前做种列表, 若列表没有种子您无法认领!\n若您已经全部认领请无视!')
      return
    }

    var msg = "确定要认领本页全部种子吗？\n\n严正警告: \n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负! \n点击后请等待至弹窗, 种子越多越要等捏O(∩_∩)O(每个种子访问间隔500ms)\n贝极星佬可爱捏";
    if (confirm(msg) == true) {//提示选择确认
      var maxClaim = 1000;
      var result = await unsafeWindow.ClassificationClaimTorrents(list, maxClaim);
      var total = result.total;
      var success = result.success;
      alert(`共计${total}个种子，本次成功认领${success}个。`);
    }
  }

  unsafeWindow.ClassificationClaimTorrents = async function (element, maxClaim) {
    var total = 0, success = 0;

    for (const el of element) {
      if (success >= maxClaim) {
        alert("最多只能认领1000个种子！");
        break;
      }

      total += 1

      const claimId = el.dataset.torrent_id
      if (claimId > 0) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.hdkyl.in/ajax.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('action=addClaim&params%5Btorrent_id%5D=' + claimId);
      }

      xhr.onload = function () {
        if (xhr.status == 200) {
          // response 就是你要的东西
          var response = xhr.responseText
          el.style.background = 'lime';
          el.innerText = '成功';

          // console.log(response)

          success += 1;
        }
      }

      await sleep(500);
    }
    return {
      total: total,
      success: success
    }
  }
})();