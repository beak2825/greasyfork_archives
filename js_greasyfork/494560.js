// ==UserScript==
// @name         SpringSunday-Torrent-Assistant 测试版
// @namespace    http://tampermonkey.net/
// @version      1.2.123
// @description  春天审种助手
// @author       SSD
// @include      http*://springsunday.net/details.php*
// @include      http*://springsunday.net/torrents.php*
// @include      http*://springsunday.net/offers.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      greasyfork.org
// @connect      movie.douban.com
// @connect      cmct.xyz
// @connect      static.hdcmct.org
// @connect      gifyu.com
// @connect      imgbox.com
// @connect      pixhost.to
// @connect      ptpimg.me
// @connect      ibb.pics
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494560/SpringSunday-Torrent-Assistant%20%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/494560/SpringSunday-Torrent-Assistant%20%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //种审判断
    //=====================================
    var isEditor, isTest;
    if (GM_info.script.name === "SpringSunday-Torrent-Assistant 测试版") {
        isEditor = GM_getValue('isEditor', true);
    } else {
        isEditor = GM_getValue('isEditor', false);
    }
    if (GM_info.script.name === "SpringSunday-Torrent-Assistant 测试版") {
        isTest = true;
    }
    if (window.location.href.includes("/details.php")) {

        $('#outer').prepend('<div style="display: inline-block; padding: 10px 30px; color: white; background: red; font-weight: bold;" id="assistant-tooltips"></div>');

        // 查找目标div
        var targetDiv = document.querySelector('#assistant-tooltips');
        if (targetDiv) {
            // 创建多选框和标签
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'editorModeCheckbox';
            checkbox.checked = isEditor;

            var label = document.createElement('label');
            label.htmlFor = 'editorModeCheckbox';
            label.textContent = '种审模式';

            // 创建包含多选框和标签的新div
            var containerDiv = document.createElement('div');
            containerDiv.style.cssText = 'display: inline-block; margin-left: 20px; vertical-align: top;';
            containerDiv.appendChild(checkbox);
            containerDiv.appendChild(label);

            // 创建换行元素并插入
            var breakElement = document.createElement('br');
            targetDiv.parentNode.insertBefore(breakElement, targetDiv.nextSibling);
            targetDiv.parentNode.insertBefore(containerDiv, breakElement.nextSibling);

            // 添加事件监听器来更新isEditor变量、存储状态并刷新页面
            checkbox.addEventListener('change', function () {
                GM_setValue('isEditor', this.checked);
                window.location.reload();  // 刷新页面
            });
        }
        if (isEditor) {
            $('#assistant-tooltips').after('<br/><div style="display: inline-block; padding: 10px 30px; color: white; background: DarkSlateGray; font-weight: bold;" id="editor-tooltips"></div>');
        }


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

            // 检查是否超过一小时（600000 毫秒）
            if (now - lastCheckTime > 900000) {
                console.log('超过十五分钟未检查版本，开始检查...');

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
                                $('#editor-tooltips').append('发现最新版本，请更新。<br>');
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


        var cat_constant = {
            501: 'Movies(电影)',
            502: 'TV Series(剧集)',
            503: 'Docs(纪录)',
            505: 'TV Shows(综艺)',
            506: 'Sports(体育)',
            507: 'MV(音乐视频)',
            508: 'Music(音乐)',
            509: 'Others(其他类型)'
        };
        var type_constant = {
            1: 'Blu-ray',
            2: 'MiniBD',
            3: 'DVD',
            4: 'Remux',
            5: 'HDTV',
            6: 'BDRip',
            7: 'WEB-DL',
            8: 'WEBRip',
            9: 'TVRip',
            10: 'DVDRip',
            11: 'CD',
            99: 'Other'
        };

        var encode_constant = {
            1: 'H.265/HEVC',
            2: 'H.264/AVC',
            3: 'VC-1',
            4: 'MPEG-2',
            5: 'AV1',
            99: 'Other'
        };

        var audio_constant = {
            1: 'DTS-HD',
            2: 'TrueHD',
            3: 'DTS',
            4: 'AC-3',
            5: 'AAC',
            6: 'LPCM',
            7: 'FLAC',
            8: 'APE',
            9: 'WAV',
            10: 'MP3',
            11: 'E-AC-3',
            12: 'OUPS',
            99: 'Other'
        };

        var resolution_constant = {
            1: '2160p',
            2: '1080p',
            3: '1080i',
            4: '720p',
            5: 'SD',
            99: ' 未检测到分辨率 '
        };

        var area_constant = {
            1: 'Mainland(大陆)',
            2: 'Hongkong(香港)',
            3: 'Taiwan(台湾)',
            4: 'West(欧美)',
            5: 'Japan(日本)',
            6: 'Korea(韩国)',
            7: 'India(印度)',
            8: 'Russia(俄国)',
            9: 'Thailand(泰国)',
            99: 'Other(其他地区)'
        }

        var group_constant = {
            1: 'CMCT',
            8: 'CMCTA',
            9: 'CMCTV',
            3: 'DIY',
            6: '个人原创',
        }

        var title = $('#torrent-name').text();
        var exclusive = 0;
        if (title.indexOf('禁转') >= 0) {
            exclusive = 1;
        }
        title = title.trim();
        console.log(title);

        var title_lowercase = title.toLowerCase();
        var title_type, title_encode, title_audio, title_resolution, title_group, title_is_complete;

        // 格式
        if (/\.minibd/.test(title_lowercase)) {
            title_type = 2;
        } else if (/\.remux/.test(title_lowercase)) {
            title_type = 4;
        } else if (/\.bdrip/.test(title_lowercase) || (/(\.bluray|\.blu-ray)/.test(title_lowercase) && /(\.x26[45])|\.av1/.test(title_lowercase))) {
            title_type = 6;
        } else if (/(\.bluray|\.blu-ray)/.test(title_lowercase)) {
            title_type = 1;
        } else if (/\.webrip/.test(title_lowercase) || (/\.web\./.test(title_lowercase) && /\.x26[45]/.test(title_lowercase))) {
            title_type = 8;
        } else if (/(\.web-dl|\.webdl|\.web\.)/.test(title_lowercase)) {
            title_type = 7;
        } else if (/\.tvrip/.test(title_lowercase)) {
            title_type = 9;
        } else if (/(\.hdtv|\.hdtv\.)/.test(title_lowercase)) {
            title_type = 5;
        } else if (/\.dvdrip/.test(title_lowercase) || ((/(\.dvd|\.dvd\.)/.test(title_lowercase)) && /\.x26[45]/.test(title_lowercase))) {
            title_type = 10;
        } else if (/(\.dvd|\.dvd\.)/.test(title_lowercase)) {
            title_type = 3;
        }
        // codec
        if (/(\.x265|\.h265|\.h\.265|\.hevc)/.test(title_lowercase)) {
            title_encode = 1;
        } else if (/(\.x264|\.h264|\.h\.264|\.avc)/.test(title_lowercase)) {
            title_encode = 2;
        } else if (/(\.vc-1|\.vc1)/.test(title_lowercase)) {
            title_encode = 3;
        } else if (/(mpeg2|mpeg-2)/.test(title_lowercase)) {
            title_encode = 4;
        } else if (/(\.av1)/.test(title_lowercase)) {
            title_encode = 5;
        }

        // audiocodec
        if (/\.(dts-hd|dtshd|dts-x|dts:x|dts\.x\.)/.test(title_lowercase)) {
            title_audio = 1;
        } else if (/\.truehd/.test(title_lowercase)) {
            title_audio = 2;
        } else if (/\.lpcm|\.pcm/.test(title_lowercase)) {
            title_audio = 6;
        } else if (/\.dts/.test(title_lowercase)) {
            title_audio = 3;
        } else if (/\.ddp|\.dd\+|\.e-ac-3|\.eac3/.test(title_lowercase)) {
            title_audio = 11;
        } else if (/\.ac3|\.ac-3|\.dd2|\.dd5|\.dd\.2|\.dd\.5/.test(title_lowercase)) {
            title_audio = 4;
        } else if (/\.aac/.test(title_lowercase)) {
            title_audio = 5;
        } else if (/\.flac/.test(title_lowercase)) {
            title_audio = 7;
        } else if (/\.opus/.test(title_lowercase)) {
            title_audio = 12;
        } else if (/\.av3a/.test(title_lowercase)) {
            title_audio = 13;
        }
        console.log("title_audio" + title_audio)
        // standard
        if (!/remastered/.test(title_lowercase) && (/\.2160p/.test(title_lowercase) || (/\.uhd/.test(title_lowercase) && !/\.1080p/.test(title_lowercase)) || /\.4k\./.test(title_lowercase))) {
            title_resolution = 1;
        } else if (/\.1080p/.test(title_lowercase)) {
            title_resolution = 2;
        } else if (/\.1080i/.test(title_lowercase)) {
            title_resolution = 3;
        } else if (/\.720p/.test(title_lowercase)) {
            title_resolution = 4;
        } else {
            title_resolution = 99;
        }
        if (/complete/.test(title_lowercase)) {
            title_is_complete = true;
        }
        // 发布组选择
        if (/cmctv/.test(title_lowercase)) {
            title_group = 9;
        } else if (/cmcta/.test(title_lowercase)) {
            title_group = 8;
        } else if (/cmct/.test(title_lowercase)) {
            title_group = 1;
        }
        console.log('title_type:', title_type, 'title_encode:', title_encode, 'title_audio:', title_audio, 'title_resolution:', title_resolution, 'title_group:', title_group, 'title_is_complete:', title_is_complete);


        var subtitle, cat, type, encode, audio, resolution, area, group, anonymous;
        var poster;
        var fixtd, douban, imdb, mediainfo_title, mediainfo_s, torrent_extra, douban_raw, havedouban, haveimdb;
        var sub_chinese, audio_chinese, is_complete, is_chinese, is_dovi, is_hdr10, is_hdr10p, is_hlg, is_hdr_vivid,
            is_c_dub, is_bd, is_cc, is_anime, is_contest, is_selfrelease, is_internal, is_request, externalSubtitles, embeddedSubtitles;
        var tdlist = $('#outer table:first').find('td');

        // Mediainfo 信息
        let mediainfoElement = document.querySelector('.mediainfo-short .codemain');
        if (mediainfoElement) {
            mediainfo_s = mediainfoElement.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();
        } else {
            $('#assistant-tooltips').append('无「MediaInfo」信息，请检查<br/>');
            mediainfo_s = '   '
        }
        console.log(mediainfo_s)
        mediainfo_title = $('.mediainfo-raw .codemain').text();
        for (var i = 0; i < tdlist.length; i++) {
            var td = $(tdlist[i]);

            if (td.text() === '副标题' || td.text() === '副標題') {
                subtitle = td.parent().children().last().text();
            }

            if (td.text() === '添加') {
                let text = td.parent().children().last().text();
                if (text.indexOf('匿名') >= 0) {
                    anonymous = 1;
                }
            }

            if (td.text() === '基本信息') {

                var catText = $('span[title="类型"]').text();
                var typeText = $('span[title="格式"]').text();
                var encodeText = $('span[title="视频编码"]').text();
                var audioText = $('span[title="音频编码"]').text();
                var resolutionText = $('span[title="分辨率"]').text();
                var areaText = $('span[title="地区"]').text();
                var authorText = $('span[title="制作组"]').text();
                console.log(catText + typeText + encodeText + audioText + resolutionText + areaText + authorText)

                // 类型
                if (/Movies\(电影\)/.test(catText)) {
                    cat = 501;
                } else if (/TV Series\(剧集\)/.test(catText)) {
                    cat = 502;
                } else if (/Docs\(纪录\)/.test(catText)) {
                    cat = 503;
                } else if (/TV Shows\(综艺\)/.test(catText)) {
                    cat = 505;
                } else if (/Sports\(体育\)/.test(catText)) {
                    cat = 506;
                } else if (/MV\(音乐视频\)/.test(catText)) {
                    cat = 507;
                } else if (/Music\(音乐\)/.test(catText)) {
                    cat = 508;
                } else if (/Other\(其他类型\)/.test(catText)) {
                    cat = 509;
                }

                // 地区
                if (/Mainland\(大陆\)/.test(areaText)) {
                    area = 1;
                } else if (/Hongkong\(香港\)/.test(areaText)) {
                    area = 2;
                } else if (/Taiwan\(台湾\)/.test(areaText)) {
                    area = 3;
                } else if (/West\(欧美\)/.test(areaText)) {
                    area = 4;
                } else if (/Japan\(日本\)/.test(areaText)) {
                    area = 5;
                } else if (/Korea\(韩国\)/.test(areaText)) {
                    area = 6;
                } else if (/India\(印度\)/.test(areaText)) {
                    area = 7;
                } else if (/Russia\(俄国\)/.test(areaText)) {
                    area = 8;
                } else if (/Thailand\(泰国\)/.test(areaText)) {
                    area = 9;
                } else if (/Other\(其他地区\)/.test(areaText)) {
                    area = 99;
                }

                // 格式
                if (/Blu-ray/.test(typeText)) {
                    type = 1;
                } else if (/Remux/.test(typeText)) {
                    type = 4;
                } else if (/MiniBD/.test(typeText)) {
                    type = 2;
                } else if (/BDRip/.test(typeText)) {
                    type = 6;
                } else if (/WEB-DL/.test(typeText)) {
                    type = 7;
                } else if (/WEBRip/.test(typeText)) {
                    type = 8;
                } else if (/HDTV/.test(typeText)) {
                    type = 5;
                } else if (/TVRip/.test(typeText)) {
                    type = 9;
                } else if (/DVDRip/.test(typeText)) {
                    type = 10;
                } else if (/DVD/.test(typeText)) {
                    type = 3;
                } else if (/CD/.test(typeText)) {
                    type = 11;
                } else if (/Other/.test(typeText)) {
                    type = 99;
                }

                // 视频编码
                if (/H\.265\/HEVC/.test(encodeText)) {
                    encode = 1;
                } else if (/H\.264\/AVC/.test(encodeText)) {
                    encode = 2;
                } else if (/VC-1/.test(encodeText)) {
                    encode = 3;
                } else if (/MPEG-2/.test(encodeText)) {
                    encode = 4;
                } else if (/AV1/.test(encodeText)) {
                    encode = 5;
                } else if (/Other/.test(encodeText)) {
                    encode = 99;
                }

                // 音频编码
                if (/DTS-HD/.test(audioText)) {
                    audio = 1;
                } else if (/DTS/.test(audioText)) {
                    audio = 3;
                } else if (/TrueHD/.test(audioText)) {
                    audio = 2;
                } else if (/LPCM/.test(audioText)) {
                    audio = 6;
                } else if (/E-AC-3/.test(audioText)) {
                    audio = 11;
                } else if (/AC-3/.test(audioText)) {
                    audio = 4;
                } else if (/AAC/.test(audioText)) {
                    audio = 5;
                } else if (/FLAC/.test(audioText)) {
                    audio = 7;
                } else if (/APE/.test(audioText)) {
                    audio = 8;
                } else if (/WAV/.test(audioText)) {
                    audio = 9;
                } else if (/MP3/.test(audioText)) {
                    audio = 10;
                } else if (/OPUS/.test(audioText)) {
                    audio = 12;
                } else if (/AV3A/.test(audioText)) {
                    audio = 13;
                } else if (/Other/.test(audioText)) {
                    audio = 99;
                }

                // 视频分辨率
                if (/2160p/.test(resolutionText)) {
                    resolution = 1;
                } else if (/1080p/.test(resolutionText)) {
                    resolution = 2;
                } else if (/1080i/.test(resolutionText)) {
                    resolution = 3;
                } else if (/720p/.test(resolutionText)) {
                    resolution = 4;
                } else if (/SD/.test(resolutionText)) {
                    resolution = 5;
                } else if (/Other/.test(resolutionText)) {
                    resolution = 99;
                }

                // 制作组
                if (/CMCTV/.test(authorText)) {
                    group = 9;
                } else if (/CMCTA/.test(authorText)) {
                    group = 8;
                } else if (/CMCT/.test(authorText)) {
                    group = 1;
                } else if (/DIY/.test(authorText)) {
                    group = 3;
                } else if (/个人原创/.test(authorText)) {
                    group = 6;
                }
                console.log('cat:', cat, 'type:', type, 'encode:', encode, 'audio:', audio, 'resolution:', resolution, 'area:', area, 'group:', group);

            }

            if (td.text() === '行为') {
                fixtd = td.parent().children().last();
            }

            if (td.text().trim() === '海报') {
                poster = $('#kposter').children().attr('src');
            }

            if (td.text() === '标签') {
                let text = td.parent().children().last().text();

                // 使用正则表达式进行匹配
                if (/合集/.test(text)) {
                    is_complete = true;
                }
                if (/中字/.test(text)) {
                    is_chinese = true;
                }
                if (/HDR10\+/.test(text)) {
                    is_hdr10p = true;
                }
                if (/HDR10(?!\+)/.test(text)) {
                    is_hdr10 = true;
                }
                if (/DoVi/.test(text)) {
                    is_dovi = true;
                }
                if (/HLG/.test(text)) {
                    is_hlg = true;
                }
                if (/菁彩HDR/.test(text)) {
                    is_hdr_vivid = true;
                }
                if (/国配/.test(text)) {
                    is_c_dub = true;
                }
                if (/原生/.test(text)) {
                    is_bd = true;
                }
                if (/cc/.test(text)) {
                    is_cc = true;
                }
                if (/动画/.test(text)) {
                    is_anime = true;
                }
                if (/活动/.test(text)) {
                    is_contest = true;
                }
                if (/驻站/.test(text)) {
                    is_selfrelease = true;
                }
                if (/官方/.test(text)) {
                    is_internal = true;
                }
                if (/应求/.test(text)) {
                    is_request = true;
                }
            }
            if (td.text().trim() === '附加信息') {
                torrent_extra = $('.extra-text').html();
            }
            if (td.text() === '字幕') {
                var lastChild = td.parent().children().last();
                var img = lastChild.find('div img[title="简体中文"], div img[title="繁體中文"]');
                // 查找 lastChild 内的第一个超链接并获取其文本内容
                var firstLinkText = lastChild.find('a:first').text();
                // 检查文本内容是否包含"chs"或"cht"
                let sub = firstLinkText.includes('chs') || firstLinkText.includes('cht');
                if (img.length > 0 || sub) {
                    externalSubtitles = true;
                }
                if (/字\s*幕(.|\n)*?Chinese/i.test(mediainfo_s) || /字\s*幕(.|\n)*?Mandarin/i.test(mediainfo_s) || /Subtitle:\s*?Chinese/i.test(mediainfo_s) || /字\s*幕(.|\n)*?简体中文/i.test(mediainfo_s) || /字\s*幕(.|\n)*?繁体中文/i.test(mediainfo_s) || /字\s*幕(.|\n)*?简体中字/i.test(mediainfo_s) || /字\s*幕(.|\n)*?繁体中字/i.test(mediainfo_s)) {
                    embeddedSubtitles = true;
                }
                if (embeddedSubtitles || externalSubtitles) {
                    sub_chinese = true;
                } else {
                    sub_chinese = false;
                }
            }
            if (td.text().trim().startsWith('豆瓣')) {
                havedouban = true
                douban_raw = td.parent().children().last();
            }
            if (td.text().trim().startsWith('IMDb')) {
                haveimdb = true
            }
        }


        // 豆瓣
        $('td.douban_info .title .name a').each(function (index, element) {
            if ($(element).attr('href').indexOf('douban') >= 0) {
                douban = $(element).attr('title');
            }
            if ($(element).attr('href').indexOf('imdb') >= 0) {
                imdb = $(element).attr('title');
            }
        });
        // 中文音轨识别
        if ((/音\s频:(?:(?!字\s幕).|\n)*?(?:chinese|mandarin)/i.test(mediainfo_s) && type !== 1) || (/Audio:\s?(?:Chinese|Mandarin)/i.test(mediainfo_s) && type === 1)) {
            audio_chinese = true;
        }
        var screenshot = '';
        var pngCount = 0, jpgCount = 0;
        $('.screenshots-container img').each(function (index, element) {
            var src = $(element).attr('src');
            if (src !== undefined) {
                if (index !== 0) {
                    screenshot += '\n';
                }
                screenshot += src.trim();
            }
            if (src.indexOf('.png') >= 0) {
                pngCount++;
            }
            if (src.indexOf('.jpg') >= 0 || src.indexOf('.jpeg') >= 0) {
                jpgCount++;
            }
        });


        //==============================
        let error = false;
        if (/\s+/.test(title)) {
            $('#assistant-tooltips').append('主标题包含空格<br/>');
            error = true;
        }
        if (/[\uFF00-\uFFEF]/.test(title)) {
            $('#assistant-tooltips').append('请将主标题中的全角符号更换为半角符号。<br/>');
            error = true;
        }
        if (/[\u4e00-\u9fa5\uff01-\uff60]+/.test(title)) {
            $('#assistant-tooltips').append('主标题包含中文或中文字符<br/>');
            error = true;
        }
        if (/(-|@)(CTRLHD|SmY|FZHD)/.test(title_lowercase)) {
            $('#assistant-tooltips').append('主标题包含禁发小组，请检查<br/>');
            error = true;
        }
        if (/(-|@)(FGT|ZAX|Ubits|UBWEB|NSBC|BATWEB|GPTHD|DreamHD|BlackTV|CatWEB|Xiaomi|Huawei|MOMOWEB|DDHDTV|SeeWeb|TagWeb|SonyHD|MiniHD|BitsTV|ALT|NukeHD|ZeroTV|HotTV|EntTV|GameHD|SeeHD|VeryPSP|DWR|XLMV|XJCTV|Mp4Ba|GodDramas|FRDS|BeiTai|Ying|VCB-Studio|toothless|YTS\.MX|BMDru|ParkHD|Xunlei|BestWEB|TBMaxUB|13city)/i.test(title_lowercase)) {
            $('#assistant-tooltips').append('主标题包含禁发小组，请检查<br/>');
            error = true;
        }
        if (/-(.*?@)?(Eleph|HDH|HDS(?!TV)|HDHome|HDSky|HDSWEB|Dream(?!Ru)|DYZ-Movie)(@|$)/i.test(title_lowercase)) {
            $('#assistant-tooltips').append('主标题包含不受信小组，请检查<br/>');
            error = true;
        }
        if (/(Dream(?!Ru))$/i.test(title_lowercase) && [6, 8, 9, 10].includes(type)) {
            $('#assistant-tooltips').append('主标题包含不受信小组，请检查<br/>');
            error = true;
        }
        if (!subtitle) {
            $('#assistant-tooltips').append('副标题为空<br/>');
            error = true;
        }
        if (/[【】]/.test(subtitle)) {
            $('#assistant-tooltips').append('副标题包含【】，请修改为 []<br/>');
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
            if (title_type && title_type !== type) {
                $('#assistant-tooltips').append("标题检测格式为" + type_constant[title_type] + "，选择格式为" + type_constant[type] + '<br/>');
                error = true;
            }
        }
        if (!encode) {
            $('#assistant-tooltips').append('未选择主视频编码<br/>');
            error = true;
        } else {
            if (title_encode && title_encode !== encode) {
                $('#assistant-tooltips').append("标题检测视频编码为" + encode_constant[title_encode] + "，选择视频编码为" + encode_constant[encode] + '<br/>');
                error = true;
            } else if (encode === 99 && group !== 8) {
                $('#assistant-tooltips').append('视频编码选择为 other，请人工检查<br/>');
                error = true;
            }
        }
        if (!audio) {
            $('#assistant-tooltips').append('未选择主音频编码<br/>');
            error = true;
        } else {
            if (title_audio && title_audio !== audio) {
                $('#assistant-tooltips').append("标题检测音频编码为" + audio_constant[title_audio] + "，选择音频编码为" + audio_constant[audio] + '<br/>');
                error = true;
            } else if (audio === 99) {
                $('#assistant-tooltips').append('音频编码选择为 other，请人工检查<br/>');
                error = true;
            }
        }
        if (!resolution && title_group !== 8) {
            $('#assistant-tooltips').append('未选择分辨率<br/>');
            error = true;
        } else {
            if (title_resolution && title_resolution !== resolution) {
                $('#assistant-tooltips').append("标题检测分辨率为" + resolution_constant[title_resolution] + "，选择分辨率为" + resolution_constant[resolution] + '<br/>');
                error = true;
            }
        }
        if (/tu\.totheglory\.im/.test(poster)) {
            $('#assistant-tooltips').append('海报使用防盗链图床，请更换或留空<br/>');
            error = true;
        }
        if (/論壇|论坛|公众号|微信/i.test(mediainfo_title)) {
            $('#assistant-tooltips').append('请检查「MediaInfo」内信息是否含有广告，请确认资源来源是否可信<br/>');
            error = true;
        }
        if (!area && title_group !== 8) {
            $('#assistant-tooltips').append('未选择地区<br/>');
            error = true;
        }
        if (type === 1 && $('.mediainfo-short .codetop').text() === 'MediaInfo') {
            $('#assistant-tooltips').append('Blu-ray 媒体信息请使用 BDInfo<br/>');
            error = true;
        }
        if (!douban && !imdb && title_group !== 8) {
            $('#assistant-tooltips').append('未检测到豆瓣或 IMDb 链接<br/>');
            error = true;
        }
        if (!douban && imdb) {
            $('#assistant-tooltips').append('未优先使用豆瓣链接<br/>');
            error = true;
        }
        if ($('#peercount > b:first').text() === '0个做种者') {
            $('#assistant-tooltips').append('请先做种，再等待审核<br/>');
            error = true;
        }
        if ((type === 6 || type === 4 || type === 7 || type === 8 || type === 9 || type === 10) && $('.mediainfo-short .codemain').text().replace(/\s+/g, '') === $('.mediainfo-raw .codemain').text().replace(/\s+/g, '')) {
            $('#assistant-tooltips').append('媒体信息未解析<br/>');
            error = true;
        }
        if (type == 7 && (resolution == 4 || resolution == 5)) {
            $('#assistant-tooltips').append('禁发：低于 1080p 分辨率的 WEB-DL 资源<br/>');
        }
        // 标签
        console.log(title_is_complete)
        if (type !== 1 && is_bd) {
            $('#assistant-tooltips').append('非原盘请勿选择「原生」标签<br/>');
            error = true;
        }
        if ((title_is_complete || /[集期]全|全\s*?[\d一二三四五六七八九十百千]*\s*?[集期]|合集/i.test(subtitle)) && !is_complete) {
            $('#assistant-tooltips').append('未选择「合集」标签<br/>');
            error = true;
        }
        if (sub_chinese && !is_chinese) {
            $('#assistant-tooltips').append('未选择「中字」标签<br/>');
            error = true;
        }
        if (/^(?!Encoding).*Dolby Vision/im.test(mediainfo_title) && !is_dovi) {
            $('#assistant-tooltips').append('未选择「DoVi」标签<br/>');
            error = true;
        }
        if (!/^(?!Encoding).*Dolby Vision/im.test(mediainfo_title) && is_dovi) {
            $('#assistant-tooltips').append('选择「DoVi」标签，未识别到「DoVi」<br/>');
            error = true;
        }
        if (/^(?!Encoding).*HDR10\+/im.test(mediainfo_title) && !is_hdr10p) {
            $('#assistant-tooltips').append('未选择「HDR10+」标签<br/>');
            error = true;
        }
        if (!/^(?!Encoding).*HDR10\+/im.test(mediainfo_title) && is_hdr10p) {
            $('#assistant-tooltips').append('选择「HDR10+」标签，未识别到「HDR10+」<br/>');
            error = true;
        }
        if (/^(?!Encoding).*HDR10/im.test(mediainfo_title) && !/^(?!Encode).*HDR10\+/im.test(mediainfo_title) && !is_hdr10) {
            $('#assistant-tooltips').append('未选择「HDR10」标签<br/>');
            error = true;
        }
        if (!/^(?!Encoding).*HDR10/im.test(mediainfo_title) && is_hdr10) {
            $('#assistant-tooltips').append('选择「HDR10」标签，未识别到「HDR10」<br/>');
            error = true;
        }
        if (is_hdr10 && is_hdr10p) {
            $('#assistant-tooltips').append('请勿同时选择「HDR10」与「HDR10+」标签<br/>');
            error = true;
        }
        if (/^(?!Encoding).*HLG/im.test(mediainfo_title) && !is_hlg) {
            $('#assistant-tooltips').append('未选择「HLG」标签<br/>');
            error = true;
        }
        if (!/^(?!Encoding).*HLG/im.test(mediainfo_title) && is_hlg) {
            $('#assistant-tooltips').append('选择「HLG」标签，未识别到「HLG」<br/>');
            error = true;
        }
        if (/^(?!Encoding).*HDR Vivid/im.test(mediainfo_title) && !is_hdr_vivid) {
            $('#assistant-tooltips').append('未选择「菁彩 HDR」标签<br/>');
            error = true;
        }
        if (!/^(?!Encoding).*HDR Vivid/im.test(mediainfo_title) && is_hdr_vivid) {
            $('#assistant-tooltips').append('选择「菁彩 HDR」标签，未识别到「菁彩 HDR」<br/>');
            error = true;
        }
        if (is_contest && !is_chinese) {
            $('#assistant-tooltips').append('选择「活动」标签，未识别到「中字」<br/>');
            error = true;
        }
        if (is_contest && type !== 7) {
            $('#assistant-tooltips').append('选择「活动」标签，未识别到「WEB-DL」<br/>');
            error = true;
        }
        if ((/◎/i.test(torrent_extra)) && !$('span[title="制作组"]').length > 0) {
            $('#assistant-tooltips').append('请移除附加信息中除致谢、制作信息以外的内容。<br/>');
            error = true;
        }
        if (mediainfo_s.length < 50) {
            error = true;
            if (type === 1 || type === 3) {
                $('#assistant-tooltips').append('媒体信息格式错误，请使用「BDInfo」重新获取完整的英文信息<br/>');
            } else {
                $('#assistant-tooltips').append('媒体信息格式错误，请使用「Mediainfo」重新获取完整的英文信息<br/>');
            }
        }

        if (title_group && !group) {
            $('#assistant-tooltips').append('未选择制作组' + group_constant[title_group] + '<br/>');
            error = true;
        }

        let isWhiteList = ((area === 1 && /-(.*?@)?(PterWEB|CatEDU|CMCTV|HHWEB|OurBits)(@|$)/i.test(title_lowercase)) || ((type === 5 || type === 7) && resolution === 1 && (is_hdr10 || is_hdr10p || is_hdr_vivid || is_dovi)))

        if (pngCount < 3 && !isWhiteList) {
            $('#assistant-tooltips').append('PNG 格式的图片未满 3 张<br/>');
            error = true;
        } else if ((pngCount + jpgCount) < 3) {
            $('#assistant-tooltips').append('图片未满 3 张<br/>');
            error = true;
        }

        const pichost_list = [
            'cmct.xyz',
            "static.ssdforum.org",
            'static.hdcmct.org',
            'gifyu.com',
            'imgbox.com',
            'pixhost.to',
            'ptpimg.me',
            'ssdforum.org'
        ];

        const shot = document.querySelector('section.screenshots-container');
        let shot_imgs;
        if (shot) {
            shot_imgs = Array.from(shot.querySelectorAll('img')).map(el => el.src);
        } else {
            $('#assistant-tooltips').append('无图片信息<br/>');
        }

        $(document).ready(function () {
            // =======================================================
            // 海报变成悬浮在海报行左侧的小图片
            // =======================================================
            // 1. 找到包含“海报”文字的单元格
            var $posterLabelTd = $('td.rowhead').filter(function () {
                return $(this).text().trim().includes('海报');
            });

            // 2. 获取海报图片地址
            var imgSrc = $('#kposter img').attr('src');

            // 3. 如果找到了单元格和图片，就开始创建
            if ($posterLabelTd.length > 0 && imgSrc) {
                // 设置单元格为相对定位，作为定位基准
                $posterLabelTd.css('position', 'relative');

                // 创建悬浮图片
                var $floatingPoster = $('<img>').attr('src', imgSrc).css({
                    'width': '100px',       // 宽度 100
                    'height': 'auto',       // 高度自适应
                    'position': 'absolute', // 绝对定位
                    'right': '100%',        // 100% 表示推到单元格的最左侧外部
                    'top': '0',             // 顶部对齐
                    'margin-right': '10px'  // 与文字保持一点距离
                });

                // 将图片添加到单元格中
                $posterLabelTd.append($floatingPoster);

                // 隐藏用（暂时不开）
                // $('#kposter').hide();
            }

            // =======================================================
            // [结束] 海报修改结束
            // =======================================================

            let wrongPicList = [];
            if (shot_imgs && shot_imgs.length) {
                shot_imgs.forEach(imgSrc => {
                    // 检查是否是 pixhost.to 的链接
                    if (imgSrc.includes('pixhost.to')) {
                        // 检查是否符合正确的格式 (img*.pixhost.to/images/...)
                        if (!imgSrc.match(/^https?:\/\/img\d+\.pixhost\.to\/images\//)) {
                            wrongPicList.push(imgSrc);
                            $('#assistant-tooltips').append('Pixhost 图床链接格式错误，请使用正确的图片直链<br/>');
                        }
                    } else {
                        // 对其他图床的检查
                        let valid = pichost_list.some(site => imgSrc.includes(site));
                        if (!valid) {
                            wrongPicList.push(imgSrc);
                        }
                    }
                });

                if (wrongPicList.length) {
                    $('#assistant-tooltips').append('请使用规则白名单内的图床<br/>');
                    error = true;
                }
            }
        });

        // =================================
        // 种审用（检测较为激进，需配合人工判断）
        // =================================
        if (isEditor) {
            $('#editor-tooltips').append('↓以下检测需配合人工判断，误报率较高↓<br/>');
            if (/(?<!hd)\.ma\./i.test(title_lowercase) && type === 7) {
                $('#editor-tooltips').append('单独槽位：Movies Anywhere<br/>');
            }
            if (/\.nf\./i.test(title_lowercase) && type === 7 && resolution === 1) {
                $('#editor-tooltips').append('单独槽位：Netflix 2160P<br/>');
            }
            if (/-(.*?@)?(Nest|n!ck|lancertony|vandoge)(@|$)/i.test(title_lowercase)) {
                $('#editor-tooltips').append('Dupe 参考：优质字幕小组<br/>');
            }
            if (/-Breeze@Sunny/i.test(title_lowercase)) {
                $('#editor-tooltips').append('Dupe 参考：优质字幕小组<br/>');
            }
            if (/-(.*?@)?(Pter|CiNEPHiLES|FraMeSToR|BLURANiUM|ZQ|ZoroSenpai|hallowed|MainFrame)(@|$)/i.test(title_lowercase)) {
                $('#editor-tooltips').append('Dupe 参考：优质小组，必需保留附加信息否则不允许发布<br/>');
            }
            if (type == 4) {
                $('#editor-tooltips').append('Dupe 参考：REMUX 类资源必需保留附加信息否则不允许发布<br/>');
            }
            if (is_anime && type === 7 && cat == 502) {
                $('#editor-tooltips').append(`Dupe参考：平台优先级（二次元）：CR = B-Global 2160p > B-Global 1080p > AMZN > Other<br/>`);
            } else {
                if (title_lowercase.match(/\.(DSNP|Disney\+|MAX|AMZN|Amazon)\./i) && type === 7 && resolution === 1) {
                    $('#editor-tooltips').append(`Dupe参考：2160p 高优先级源 ${title_lowercase.match(/\.(DSNP|Disney\+|MAX|AMZN|Amazon)\./i)[0]}<br/>`);
                }
                if (title_lowercase.match(/\.(DSNP|Disney\+|MAX|AMZN|Amazon|CR)\./i) && type === 7 && resolution === 2) {
                    $('#editor-tooltips').append(`Dupe参考：1080P 高优先级源 ${title_lowercase.match(/\.(DSNP|Disney\+|MAX|AMZN|Amazon|CR)\./i)[0]}<br/>`);
                }
                if (title_lowercase.match(/\.(Paramount\+|PMTP|iTunes|HBO\.Max|HMax)\./i) && type === 7 && resolution === 1) {
                    $('#editor-tooltips').append(`Dupe参考：2160p 次高优先级源 ${title_lowercase.match(/\.(Paramount\+|PMTP|iTunes|HBO\.Max|HMax)\./i)[0]}<br/>`);
                }
                if (title.match(/\.iT\./) && type === 7 && resolution === 1) {
                    $('#editor-tooltips').append(`Dupe参考：2160p 次高优先级源 ${title.match(/\.iT\./)[0]}<br/>`);
                }
                if (title_lowercase.match(/\.(Netflix|NF|HBO\.Max|HMax)\./i) && type === 7 && resolution === 2) {
                    $('#editor-tooltips').append(`标题检测：1080P 次高优先级源 ${title_lowercase.match(/\.(Netflix|NF|HBO\.Max|HMax)\./i)[0]}<br/>`);
                }
                if (title_lowercase.match(/\.(Mytvs|MyVideo|Hami|Mytvsuper)\./i)) {
                    $('#editor-tooltips').append(`Dupe参考：低优先级源 ${title_lowercase.match(/\.(Mytvs|MyVideo|Hami|Mytvsuper)\./i)[0]}<br/>`);
                }
            }
            if (/HDR\sformat.*dvhe\.05/i.test(mediainfo_title)) {
                $('#editor-tooltips').append('DUPE参考：Dolby Vision P5（不含 HDR10 数据）<br/>');
            }
            if (/HDR\sformat.*dvhe\.08/i.test(mediainfo_title) || /HDR\sformat.*dvhe\.07/i.test(mediainfo_title)) {
                $('#editor-tooltips').append('DUPE参考：Dolby Vision P7 or P8（含 HDR10 数据）<br/>');
            }
            if (externalSubtitles && !embeddedSubtitles) {
                $('#editor-tooltips').append('Dupe参考：外挂字幕优先级低于内置字幕<br/>');
            }
            if (/HDR\sformat.*dvhe\.07/i.test(mediainfo_title) && (type == 6 || type == 8)) {
                $('#editor-tooltips').append('禁发：DV P7 压制兼容性过低<br/>');
            }
            if (cat == 502 && is_bd && is_anime) {
                $('#editor-tooltips').append('禁发：剧集形式 TV / OVA 番剧的原盘，仅允许剧场版/电影的原盘<br/>');
            }
            if (cat == 508) {
                $('#editor-tooltips').append('除官组驻站外，禁止发布音乐类，但可发布演唱会，且演唱会分类为 MV<br/>');
            }
            const rating = parseFloat(document.querySelector('.douban_info .number')?.textContent);
            if (rating !== undefined && rating < 4 && area == 1) {
                $('#editor-tooltips').append('中性：国产豆瓣低分（需人工刷新豆瓣信息，并排除一个月内未出分新片）<br/>');
            }
            if (/第\s*?[\d一二三四五六七八九十百千]*(?:-\d+)?\s*?[集期]/i.test(subtitle) && !is_complete && (cat === 502 || cat === 503 || cat === 505) && (type === 5 || type === 7)) {
                $('#editor-tooltips').append('中性：识别到单集，无需审核<br/>');
            }
            if (/第\s*?[\d一二三四五六七八九十百千]*(?:-\d+)?\s*?[集期]/i.test(subtitle) && is_complete && (cat === 502 || cat === 503 || cat === 505) && (type === 5 || type === 7)) {
                $('#editor-tooltips').append('疑似单集，请检查是否为合集<br/>');
            }
            if (!is_chinese && cat !== 501 && type === 7) {
                $('#editor-tooltips').append('中性：除电影外，无「中字」的 WEB 资源<br/>');
            }
            if (!is_chinese && type === 4) {
                $('#editor-tooltips').append('中性：无「中字」的 Remux 资源<br/>');
            }
            if (!is_chinese && cat !== 501 && is_anime && [6, 7, 8, 9, 10].includes(type)) {
                $('#editor-tooltips').append('中性：除电影外，无「中字」的 动漫 资源<br/>');
            }
            if (!is_chinese && cat === 502 && type === 1) {
                $('#editor-tooltips').append('中性：无「中字」的 Blu-Ray 剧集<br/>');
            }
            if (/时　长:\s(10|[1-9])min/.test(mediainfo_s)) {
                $('#editor-tooltips').append('中性：疑似短剧，时长低于 10 分钟<br/>')
            }
            if (!/已审/.test(document.querySelector('h1').innerText) && is_request) {
                $('#editor-tooltips').append('「应求」标签需提供对应的悬赏链接，并检查是否候选区内有重复资源，遵循先来后到原则<br/>');
            }
            if (/(-|@)(.*PAD)/i.test(title_lowercase) || /\.(PAD|IPAD)\./i.test(title_lowercase)) {
                $('#editor-tooltips').append('可替代：主标题包含 PAD，请检查<br/>');
            }
            if (/(?<!\d)0 kbps/.test(mediainfo_s)) {
                $('#editor-tooltips').append('Info 内检测到 0 kbps，请检查<br/>');
            }
            if (/-(.*?@)?(52pt)(@|$)/i.test(title_lowercase) && is_bd) {
                $('#editor-tooltips').append('52pt 作品 疑似 Remux,请检查是否为「原生」原盘<br/>');
            }
            if (!douban && title_group !== 8 && area == 99) {
                $('#editor-tooltips').append('地区为 Other 且无豆瓣链接，请人工核对<br/>');
            }
            if (!title_lowercase.match(/\.(18[8-9][0-9]|19[0-9]{2}|200[0-9]|201[0-9]|202[0-9]|2030)\./)) {
                $('#editor-tooltips').append('标题未检测到年份，请检查<br/>');
            }
            if (!title_audio) {
                $('#editor-tooltips').append('标题未检测到音频编码，请检查<br/>');
            }
            if (!title_resolution) {
                $('#editor-tooltips').append('标题未检测到分辨率，请检查<br/>');
            }
            if (!title_encode) {
                $('#editor-tooltips').append('标题未检测到视频编码，请检查<br/>');
            }
            if (type === 6 && (resolution === 5 || resolution === 99)) {
                $('#editor-tooltips').append('不允许的资源：低于 720P 的 BDRip<br/>');
            }
            if (/(https?:\/\/)([\w\-]+(\.[\w\-]+)+)(:\d+)?(\/[^\s]*)?/i.test(mediainfo_title)) {
                $('#editor-tooltips').append('检测到「Mediainfo」含有网址，请检查<br/>');
            }
            if (/^\s*(概览|概要)/i.test(mediainfo_title)) {
                $('#editor-tooltips').append('检测到「中文Mediainfo」，请重新扫描<br/>');
            }
            if (/\.(BDMV|BDISO|BDBOX|DVDISO)\./i.test(title_lowercase)) {
                $('#editor-tooltips').append(`主标题检测到 ${title.match(/\.(BDMV|BDISO|BDBOX|DVDISO)\./i)[0]} ，BDMV、BDISO、BDBOX 替换为 Blu-ray，DVDISO 替换为 DVD。<br/>`);
            }
            if (/\.(hdr|hdr10)\./i.test(title_lowercase) && !/ST\s2086|ST\s2094|HDR\sVivid/i.test(mediainfo_title) && !/Transfer\scharacteristics\s*:\s(HLG|PQ)/i.test(mediainfo_title) && $('.mediainfo-short .codetop').text() === 'MediaInfo') {
                $('#editor-tooltips').append('主标题检测到HDR，未识别到「HDR」相关元数据，请重新扫描 Mediainfo<br/>');
            }
            if (/\.(Criterion|CC)\./i.test(title_lowercase) || /CC标准收藏版|CC收藏版|CC版|CC(?!TV)/i.test(subtitle) && !is_cc) {
                $('#editor-tooltips').append('主副标题识别到「CC」相关字符，请检查是否有「CC」标签<br/>');
            }
            if (!/^[\u4E00-\u9FFF]{1,8}/i.test(subtitle)) {
                $('#editor-tooltips').append('请检查副标题开头是否包含中文译名，如果无中文译名则无需包含。<br/>');
            }
            if (/\.(2in1)\./i.test(title_lowercase)) {
                $('#editor-tooltips').append('主标题识别到「2in1」相关字符，请检查「BDinfo」是否齐全<br/>');
            }
            if (/DTS-HDMA/i.test(title_lowercase)) {
                $('#editor-tooltips').append('主标题识别到「DTS-HDMA」相关字符，请检查标点是否正确<br/>');
            }
            if (/\.\./i.test(title_lowercase)) {
                $('#editor-tooltips').append('主标题识别到「..」相关字符，请检查标点是否正确<br/>');
            }
            if (/版原盘/i.test(subtitle) && !is_bd && !/DIY/i.test(subtitle)) {
                $('#editor-tooltips').append('副标题识别到「原盘」相关字符，请检查是否有「原生」标签<br/>');
            }
            if (!audio_chinese && is_c_dub) {
                $('#editor-tooltips').append('未包含有普通话配音的影片，禁止使用「国配」标签<br/>');
            }
            if (type != 1 && !/^(?!Encoding).*Dolby Vision/im.test(mediainfo_title) && /\.(DV)\./i.test(title_lowercase)) {
                $('#editor-tooltips').append('标题含有 DV，未在 Mediainfo 内检测到杜比视界<br/>');
            }
            if (/SUBtitleS:/.test(mediainfo_title)) {
                $('#editor-tooltips').append('识别到「SUBtitleS:」相关字符，请检查BDInfo<br/>');
            }
            if ((mediainfo_title.match(/(?<!\S)[ ]{2,}(?!\S)/g) || []).length < 30 && type != 1) {
                $('#editor-tooltips').append('识别到「mediainfo」空格字符过少，请检查排版是否正确<br/>');
            }
            if (type === 1 && /\.HK\./i.test(title_lowercase)) {
                $('#editor-tooltips').append('检测到区号为「HK」，港版原盘应使用「HKG」<br/>');
            }
            if (type === 1 && !is_bd && /\.CHN\./i.test(title_lowercase) && /DIY/i.test(subtitle)) {
                $('#editor-tooltips').append('不接受发行地为中国大陆的蓝光原盘的 DIY<br/>');
            }
            if (!sub_chinese && is_chinese) {
                $('#editor-tooltips').append('选择「中字」标签，未识别到中文字幕，请检查<br/>');
            }
            //            if (/(FLUX|HHWEB|HHCLUB|DIY|海外).*字幕|(字幕|后缀|取自).*(FLUX|HHWEB|HHCLUB|海外)/i.test(torrent_extra) && type === 7) {
            //                $('#editor-tooltips').append('添加字幕后修改原视频后缀的「WEB-DL」资源，此类资源应保留原组名后缀<br/>');
            //            }
            if (/Progressive/i.test(mediainfo_title) && resolution === 3) {
                $('#editor-tooltips').append('扫描方式为 Progressive，分辨率为 1080i<br/>');
            }
            if (/Video:.*1080i/i.test(mediainfo_title) && resolution === 2) {
                $('#editor-tooltips').append('分辨率为 1080i，标题为 1080p<br/>');
            }
            if (/Size: 0/i.test(mediainfo_s) && type === 1) {
                $('#editor-tooltips').append('BDINFO：Size: 0，请人工检查<br/>');
            }
            if ($('.mediainfo-short .codetop').text() === 'BDInfo' && /(?:^.+?:\s.+\n\s*\n){2,}/mi.test(mediainfo_title)) {
                $('#editor-tooltips').append('检测到带多行空格的BDinfo，请人工检查<br/>');
            }
            if ((/\.DVDRip/i.test(title_lowercase) || type === 10) && resolution !== 5) {
                $('#editor-tooltips').append('DVDRip 非 SD 分辨率，请检查是否为超分辨率<br/>');
            }
            if (/(\b(https?|ftp|file):\/\/(?!www\.blu-ray\.com|ptpimg\.me|slow\.pics)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig.test(torrent_extra)) {
                $('#editor-tooltips').append('请移除附加信息中的网址。<br/>');
            }
            if (is_contest) {
                const getRating = (platform) => {
                    const selector = {
                        douban: 'img[src*="douban.png"]',
                        imdb: 'img[src*="imdb.png"]'
                    }[platform];
                    const td = document.querySelector(`td.douban_info ${selector}`);
                    if (!td) return '未找到';
                    const rating = td.closest('header')
                        .querySelector('.rating > .number:not(.votes)')
                        ?.textContent?.trim();
                    return rating || '未找到';
                };
                $('#editor-tooltips').append(`检测到活动标签，请检查评分。<br/>豆瓣:${getRating('douban')} IMDB:${getRating('imdb')}<br/>`);
            }
            //允许发布的版本
            if (type === 6 || type === 8 || type === 9 || type === 10) {
                if (resolution === 1 && encode !== 1) {
                    $('#editor-tooltips').append('Encode 分辨率为2160P，只接受x265编码版本<br/>');
                }
                if (!is_anime && resolution === 2 && !(is_dovi || is_hdr10 || is_hdr10p || is_hlg || is_hdr_vivid) && encode !== 2) {
                    $('#editor-tooltips').append('Encode 分辨率为1080P且为SDR，只接受X264编码版本<br/>');
                }
                if (is_anime && area !== 5 && resolution === 2 && !(is_dovi || is_hdr10 || is_hdr10p || is_hlg || is_hdr_vivid) && encode !== 2) {
                    $('#editor-tooltips').append('Encode 分辨率为 1080P 且为 SDR，仅日本二维动画接受X265编码版本<br/>');
                }
                if (resolution === 2 && (is_dovi || is_hdr10 || is_hdr10p || is_hlg || is_hdr_vivid) && !(/\.uhd\./i.test(title_lowercase) && is_anime && is_chinese && !embeddedSubtitles)) {
                    $('#editor-tooltips').append('禁止发布：Encode 分辨率为1080P 且带 HDR 的版本（使用 UHD 原盘制作的日本二次元动漫，且非外挂中字的可以发布）<br/>');
                }
                if (!is_anime && ((/\.x264\./i.test(title_lowercase) && /\.10bit\./i.test(title_lowercase)) || (/Bit\s+depth\s*:\s*10\s+bits/i.test(mediainfo_title) && /Writing\s+library\s*:\s*x264/i.test(mediainfo_title)))) {
                    $('#editor-tooltips').append('禁止发布：Encode x264 10bit 硬件兼容性较差<br/>');
                }
            }
            if (is_anime === true && cat === 502 && is_bd) {
                $('#editor-tooltips').append('禁止发布：分集形式 TV / OVA 番剧的原盘(不论单集还是合集)，仅允许剧场版/电影的原盘<br/>');
            }
            if (
                (/^(?:Format).*?(DTS-HD|TrueHD|DTS:X|LPCM|Format\s+:\s+PCM\s+Format settings\s+:\s+Little\s+\/\s+Signed)/im.test(mediainfo_title) ||
                    audio === 1 ||
                    audio === 2 ||
                    audio === 6) &&
                (resolution === 2 ||
                    resolution === 3 ||
                    resolution === 4 ||
                    resolution === 5) &&
                (type === 6 || type === 8 || type === 9 || type === 10)
            ) {
                $("#editor-tooltips").append("可替代：音频臃肿<br/>");
            }
            if (audio === 6 && (type === 6 || type === 8 || type === 9 || type === 10)) {
                $("#editor-tooltips").append("可替代：音频臃肿 使用 PCM 音轨 的 Encode<br/>");
            }
            if (!sub_chinese && !is_bd) {
                //$('#editor-tooltips').append('可替代：无中字或硬字幕，不含国语音轨及中文字幕且无外挂中文字幕的资源将会被标记<br/>');
            }
            if (/(BHDStudio)$/i.test(title_lowercase) && [1].includes(type)) {
                $('#editor-tooltips').append('可替代：质量较差的视频<br/>');
            }

            if (type != 1 && type != 3 && type != 99) {
                const match = mediainfo_s.match(/文件名: (.*)/);
                if (match && match[1]) {
                    document.querySelector('h1').insertAdjacentHTML('beforeend', `<br><span style="color: darkgray; font-size: 1rem;">${match[1]}</span>`);
                } else {
                    document.querySelector('h1').insertAdjacentHTML('beforeend', `<br><span style="color: red; font-size: 1rem;">未找到文件名信息</span>`);
                    $('#editor-tooltips').append('Mediainfo 未找到文件名信息<br/>');
                }
            } else if (type == 1) {
                // 先尝试匹配 Disc Title:，如果为空则匹配 Disc Label:
                const matchTitle = mediainfo_title.match(/Disc\sTitle:\s*(.*)/);
                const matchLabel = !matchTitle ? mediainfo_title.match(/Disc\sLabel:\s*(.*)/) : null;
                // 获取最终结果（优先取 Title，没有则取 Label）
                const discInfo = matchTitle ? matchTitle[1] : (matchLabel ? matchLabel[1] : null);

                if (discInfo) {
                    document.querySelector('h1').insertAdjacentHTML('beforeend', `<br><span style="color: darkgray; font-size: 1rem;">${discInfo}</span>`);
                } else {
                    $('#editor-tooltips').append('BDInfo 未找到Disc Title或Disc Label信息<br/>');
                }
            }

        }

        //豆瓣判断
        // 函数：获取对应豆瓣内容
        function findDouban(searchText) {
            var result = null; // 存储找到的结果

            // 遍历所有的.peer元素
            douban_raw.find('.peer').each(function () {
                // 获取当前.peer元素中的.text-title和.text-content
                var textTitle = $(this).find('.text-title').text().trim();
                var textContent = $(this).find('.text-content').text().trim(); // 使用.html()以保留内部HTML结构，如链接

                // 检查.text-title是否包含搜索的文本
                if (textTitle.includes(searchText)) {
                    result = textContent;
                    return false; // 找到匹配后退出循环
                }
            });

            return result; // 返回结果，如果没有找到匹配项，则为null
        }


        // 豆瓣判断
        var douban_area = [], douban_cat;
        var isshow, isdoc, isani;

        if (douban) {

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
                { areas: ['香港', '中国香港'], value: 2 },
                { areas: ['台湾', '中国台湾'], value: 3 },
                { areas: ['印度'], value: 7 },
                { areas: ['日本'], value: 5 },
                { areas: ['韩国'], value: 6 },
                { areas: ['泰国'], value: 9 },
                {
                    areas: ['阿尔巴尼亚', '爱尔兰', '爱沙尼亚', '安道尔', '奥地利', '白俄罗斯', '保加利亚',
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
                        '智利', '捷克斯洛伐克', '澳大利亚', '西德', '新西兰'], value: 4
                },
                { areas: ['苏联', '俄罗斯'], value: 8 }
            ];
            // 遍历映射表并检查 country 是否包含任何指定地区
            areaMappings.forEach(mapping => {
                if (mapping.areas.some(element => country.includes(element))) {
                    douban_area.push(mapping.value);
                }
            });

            // 如果 douban_area 为空，则添加 99
            if (douban_area.length === 0) {
                douban_area.push(99);
            }

            if (douban_type === '电视剧') {
                if (isshow) {
                    douban_cat = 505;
                } else if (isdoc) {
                    douban_cat = 503;
                } else {
                    douban_cat = 502;
                }
            } else {
                if (isdoc) {
                    douban_cat = 503;
                } else {
                    douban_cat = 501;
                }
            }
            if (language && is_c_dub && language.includes("普通话") && !language.includes("粤语")) {
                $('#editor-tooltips').append('豆瓣信息中原始语言含有普通话的资源，不可使用「国配」标签。<br/>');
            }
            if (language && audio_chinese && !is_c_dub && !language.includes("普通话")) {
                $('#editor-tooltips').append('外语片或粤语片包含有普通话配音，需使用「国配」标签<br/>');
            }
            if (language && audio_chinese && !is_c_dub && language.includes("粤语")) {
                $('#editor-tooltips').append('种审人工检查第一语言是否为粤语，原始语言为粤语的影片如包含有普通话配音，需使用「国配」标签<br/>');
            }
            if (!language) {
                $('#editor-tooltips').append('豆瓣信息未检测到语言，请检查配音及豆瓣信息<br/>');
            }
            if (cat && douban_cat && douban_cat >= 501 && douban_cat <= 505 && douban_cat !== cat) {
                $('#assistant-tooltips').append("豆瓣检测分类为" + cat_constant[douban_cat] + "，选择分类为" + cat_constant[cat] + '<br/>');
                error = true;
            }
            if (area && douban_area && !douban_area.includes(area)) {
                $('#assistant-tooltips').append("豆瓣检测地区为" + area_constant[douban_area[0]] + "，选择地区为" + area_constant[area] + '<br/>');
                error = true;
            }
            if (isani && !is_anime) {
                $('#assistant-tooltips').append('豆瓣检测「动画」类别，未选择「动画」标签<br/>');
                error = true;
            }
            let year = document.querySelector('td:has(img[alt="douban"]) .title .year')?.textContent.trim();
            if (!year || year === "0") {
                year = findDouban('◎上映日期').match(/^(\d{4})/)?.[1];
            }
            if (!year || year === "") {
                $('#editor-tooltips').append('豆瓣未检测到年份，请检查<br/>');
            } else if (title_lowercase.match(/\.(18[8-9][0-9]|19[0-9]{2}|200[0-9]|201[0-9]|202[0-9]|2030)\./) &&
                year !== title_lowercase.match(/\.(18[8-9][0-9]|19[0-9]{2}|200[0-9]|201[0-9]|202[0-9]|2030)\./)[1]) {
                $('#editor-tooltips').append('豆瓣与标题年份不匹配，请检查<br/>');
            }
            if (!isani && is_anime) {
                $('#assistant-tooltips').append('选择「动画」标签，豆瓣未识别到「动画」类别<br/>');
                error = true;
            }
            //显示结果
            if (error) {
                $('#assistant-tooltips').css('background', 'red');
            } else {
                $('#assistant-tooltips').append('此种子未检测到异常');
                $('#assistant-tooltips').css('background', 'green');
            }
        }

    }

    // ===========================================
    // BBCODE 一键复制
    // ===========================================
    if (window.location.href.includes("/details.php?")) {


        $(document).ready(function () {
            // 通用函数：添加复制按钮
            function addCopyButton(targetElement, buttonText, contentGetter, errorText) {
                if (targetElement.length === 0) {
                    console.log(`Tampermonkey: 未找到目标元素，无法添加"${buttonText}"按钮。`);
                    return;
                }

                const button = $(`<br><button>${buttonText}</button>`).css({
                    'margin-left': '5px',
                    'cursor': 'pointer',
                    'padding': '2px 5px',
                    'font-family': 'Helvetica Neue, Helvetica, Arial, "苹方-简", "PingFang SC", "微软雅黑", "Microsoft Yahei", "微軟正黑體", "Microsoft JhengHei", "冬青黑体", "Hiragino Sans GB", "思源黑体", "Noto Sans SC", "文泉驿正黑", "WenQuanYi Zen Hei", sans-serif'
                });
                const lineBreak = $('<br>');

                targetElement.after(lineBreak).after(button);

                button.on('click', function () {
                    try {
                        const content = contentGetter();
                        if (content === null || content === '') {
                            button.text(errorText || '未找到内容');
                            console.error(`点击时未找到目标内容: ${buttonText}`);
                            setTimeout(() => { button.text(buttonText); }, 2000);
                            return;
                        }

                        navigator.clipboard.writeText(content).then(() => {
                            button.text('✓ 复制成功');
                            setTimeout(() => { button.text(buttonText); }, 2000);
                        }).catch(err => {
                            button.text('复制失败');
                            console.error(`复制失败: ${buttonText}`, err);
                            setTimeout(() => { button.text(buttonText); }, 2000);
                        });
                    } catch (err) {
                        button.text('操作出错');
                        console.error(`操作出错: ${buttonText}`, err);
                        setTimeout(() => { button.text(buttonText); }, 2000);
                    }
                });
            }

            // --- 按钮1: 复制媒体信息 ---
            const targetLink1 = $("td.rowhead.nowrap a span:contains('媒体信息')").parent('a');
            addCopyButton(
                targetLink1,
                '复制媒体信息',
                () => {
                    const codemainDiv = $("div.mediainfo-raw div.codemain");
                    return codemainDiv.length > 0 ? codemainDiv.text().trim() : null;
                },
                '未找到媒体信息'
            );

            // --- 按钮2: 复制附加信息 ---
            const targetTd2 = $("td.rowhead.nowrap span.nowrap:contains('附加信息')").closest('td');
            const targetLink2 = targetTd2.find("a:contains('附加信息')");
            addCopyButton(
                targetLink2,
                '复制附加信息',
                () => {
                    const preElement = $("#torrent-extra-text-bbcode");
                    return preElement.length > 0 ? preElement.text().trim() : null;
                },
                '未找到附加信息'
            );

            // --- 按钮3: 复制截图URL ---
            const targetLink3 = $("td.rowhead.nowrap a span:contains('截图信息')").parent('a');
            addCopyButton(
                targetLink3,
                '复制截图URL',
                () => {
                    const screenshotImages = $("section.screenshots-container img");
                    if (screenshotImages.length === 0) return null;

                    const urls = [];
                    screenshotImages.each(function () {
                        urls.push($(this).attr('src'));
                    });
                    return urls.join('');
                },
                '未找到截图'
            );
        });
    }
    // ---------------------------------------------------
    // 只有种审需要下面的功能捏
    // ---------------------------------------------------
    if (isEditor) {
        // ===========================================
        // 3. << 鼠标停在加载完成的图片上显示大小和类型 >>
        // 对种子详情的图片信息进行审核
        // ===========================================
        if (window.location.href.includes("/details.php")) {
            $('#editor-tooltips').append(`图片检查中<br>`);
            var imgNum;
            if (!authorText.replace(/\s+/g, '')) {
                imgNum = 1;
            } else {
                imgNum = 2;
            }

            var resolutionRegex = /分辨率:\s*(\d+)\s*x\s*(\d+)(?:\s*\(([\d\.]+):1\))?/;
            var bdResolutionRegex = /Video:.*?\/\s*(\d{3,4})[pi]\s*\//i; // 匹配 BDInfo 中的 1080p, 2160p 等
            var match = mediainfo_s.match(resolutionRegex);
            var bdMatch = mediainfo_s.match(bdResolutionRegex);
            var cWidth, cHeight, amznWidth;

            if (match) {
                cWidth = parseInt(match[1], 10);
                cHeight = parseInt(match[2], 10);
                if (match[3]) {
                    amznWidth = Math.round(cHeight * parseFloat(match[3]));
                }
            } else if (bdMatch) {
                const resText = bdMatch[1];
                if (resText === '1080') {
                    cWidth = 1920;
                    cHeight = 1080;
                } else if (resText === '2160') {
                    cWidth = 3840;
                    cHeight = 2160;
                }
            } else if ($('.mediainfo-short .codetop').text() === 'MediaInfo' || type === 1) {
                $('#editor-tooltips').append("未找到分辨率信息<br>");
            }
            if (/Original height/i.test(mediainfo_title)) {
                $('#editor-tooltips').append('检测到Original height，请人工辅助判断<br>');
            }
            var error_img = false;

            const images = document.querySelectorAll('section[data-group="screenshots"] img[loading="lazy"][alt="screenshot image"], section[data-group="screenshots"] img[loading="lazy"][alt="image"]');
            let completedImages = 0;

            images.forEach((img, index) => {
                const imgExtension = img.src.split('.').pop().split(/\#|\?/)[0].toLowerCase();

                if (imgExtension === 'gif') {
                    console.log(`跳过 GIF 图片：${img.src}`);
                    completedImages++;
                    if (completedImages === images.length) {
                        $('#editor-tooltips').html($('#editor-tooltips').html().replace('图片检查中<br>', ''));
                        console.log("gif 图片检查完成");
                    }
                    return;
                }

                fetchImageDetails(img, (details) => {
                    displayImageDetails(img, details);
                    if (index >= imgNum - 1) {
                        checkImageResolution(details, $('span[title="分辨率"]').text(), index + 1);
                    }
                    completedImages++;
                    if (completedImages === images.length) {
                        $('#editor-tooltips').html($('#editor-tooltips').html().replace('图片检查中<br>', ''));
                        console.log("图片检查完成");
                    }
                });
            });

            function fetchImageDetails(img, callback) {

                if (img.src.includes('ptpimg.me')) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: img.src,
                        responseType: 'blob',
                        onload: function (response) {
                            const blob = response.response;
                            const image = new Image();
                            image.onload = function () {
                                const details = {
                                    fileSize: `${(blob.size / 1024).toFixed(2)} KB`,
                                    resolution: `${this.width} x ${this.height}`,
                                    fileType: img.src.split('.').pop().split(/\#|\?/)[0]
                                };
                                callback(details);
                            };
                            image.src = URL.createObjectURL(blob);
                        }
                    });
                } else {
                    GM_xmlhttpRequest({
                        method: "HEAD",
                        url: img.src,
                        onload: function (response) {
                            const size = response.responseHeaders.match(/Content-Length:\s?(\d+)/i);
                            const fileSize = size ? `${(size[1] / 1024).toFixed(2)} KB` : "未知大小";
                            const image = new Image();
                            image.onload = function () {
                                const details = {
                                    fileSize,
                                    resolution: `${this.width} x ${this.height}`,
                                    fileType: img.src.split('.').pop().split(/\#|\?/)[0]
                                };
                                callback(details);
                            };
                            image.src = img.src;
                        }
                    });
                }
            }

            function checkImageResolution(details, expectedResolution, imgNum) {
                const { width, height } = parseResolution(details.resolution);
                let pswitch;
                let is_amzn = /amzn/i.test(title_lowercase)
                if (type != 1) {
                    let widthInvalid = width !== cWidth;
                    if (is_amzn && amznWidth) {
                        widthInvalid = width !== cWidth && width !== amznWidth;
                    }

                    if (height !== cHeight || widthInvalid) {
                        if (!error_img) {
                            const isDVDType = type === 10 || type === 3 || (type === 4 && /dvd/i.test(title_lowercase));
                            if (isDVDType) {
                                const message = `DVD请人工确认截图分辨率，Mediainfo 高度为${cHeight} 宽度为${cWidth}<br>` +
                                    `可能的正确截图宽度为 高度大于480时：${Math.floor(cWidth / 45 * 64)} 或 ${Math.floor(cWidth / 15 * 16)} ` +
                                    `高度小等于480时：${Math.floor(cWidth / 9 * 8)} 或 ${Math.floor(cWidth / 27 * 32)}<br>`;
                                $('#editor-tooltips').append(message);
                                error_img = true;
                            } else {
                                const resolutionMessage = `第${imgNum}张图片，Mediainfo 分辨率${cWidth}x${cHeight}：截图分辨率${width}x${height}<br>`;
                                $('#editor-tooltips').append(resolutionMessage);
                                pswitch = true;
                            }
                        }
                    }
                }

                let size = parseFloat(details.fileSize.match(/[\d\.]+/)[0]);
                if ((is_dovi || is_hlg || is_hdr_vivid || is_hdr10p || is_hdr10) && size < 1800) {
                    $('#editor-tooltips').append(`HDR影片，第${imgNum}张图片，截图体积低于1800KB：体积为${details.fileSize}<br>`);
                } else if (resolution === 1 && size < 1800) {
                    $('#editor-tooltips').append(`2160p影片，第${imgNum}张图片，截图体积低于1800KB：体积为${details.fileSize}<br>`);
                } else if ((resolution === 2 || resolution === 3) && size < 1000) {
                    $('#editor-tooltips').append(`1080p影片，第${imgNum}张图片，截图体积低于1000KB：体积为${details.fileSize}<br>`);
                }

                if (!pswitch && !error_img && type !== 10) {
                    // Blu-ray (type 1) 特殊逻辑
                    if (type === 1) {
                        if (resolution === 1 || resolution === 2 || resolution === 3) {
                            const is1080 = resolution === 2 || resolution === 3;
                            const is2160 = resolution === 1;
                            const standardWidth = is2160 ? 3840 : 1920;
                            const standardHeight = is2160 ? 2160 : 1080;

                            if (width !== standardWidth || height !== standardHeight) {
                                $('#editor-tooltips').append(`第${imgNum}张图片，Blu-ray 截图未按 16:9 标准。实际：${width}x${height}，标准：${standardWidth}x${standardHeight}<br>`);
                                error_img = true;
                            }
                        } else {
                            // 低于 1080p 的 Blu-ray
                            if (!error_img) {
                                $('#editor-tooltips').append(`第${imgNum}张图片，Blu-ray 分辨率特殊，需人工检查：${width}x${height}<br>`);
                                error_img = true;
                            }
                        }
                    } else {
                        // 非原盘逻辑 (Encode/WEB/etc)
                        switch (expectedResolution) {
                            case '2160p':
                                if ((height < 2120 || height > 2160) && (width < 3800 || width > 3840)) {
                                    $('#editor-tooltips').append(`第${imgNum}张图片，截图分辨率不符合 2160p 标准：实际高度为${height} 宽度${width}<br>`);
                                    error_img = true;
                                }
                                break;
                            case '1080p':
                            case '1080i':
                                if ((height < 1040 || height > 1080) && (width < 1880 || width > 1920)) {
                                    $('#editor-tooltips').append(`第${imgNum}张图片，截图分辨率不符合 1080p/1080i 标准：实际高度为${height} 宽度${width}<br>`);
                                    error_img = true;
                                }
                                break;
                            case '720p':
                                if ((height < 680 || height > 720) && (width !== 1280)) {
                                    $('#editor-tooltips').append(`第${imgNum}张图片，截图分辨率不符合 720p 标准：实际高度为${height} 宽度${width}<br>`);
                                    error_img = true;
                                }
                                break;
                            default:
                                $('#editor-tooltips').append(`第${imgNum}张图片，未定义对分辨率${expectedResolution}的检查规则<br>`);
                                error_img = true;
                        }
                    }
                }
            }


            function displayImageDetails(img, details) {
                const infoBox = document.createElement('div');
                infoBox.style.position = 'absolute';
                infoBox.style.padding = '5px';
                infoBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                infoBox.style.color = 'white';
                infoBox.style.fontSize = '12px';
                infoBox.style.visibility = 'hidden';
                infoBox.style.zIndex = '1000';
                document.body.appendChild(infoBox);

                if (isTest) {
                    const domain = img.src.match(/:\/\/(.[^/]+)/)[1];
                    const mainDomain = domain.split('.').slice(-2).join('.');
                    infoBox.textContent = `大小：${details.fileSize}, 分辨率：${details.resolution}, 类型：${details.fileType}, 图床：${mainDomain}`;
                } else {
                    infoBox.textContent = `大小：${details.fileSize}, 分辨率：${details.resolution}, 类型：${details.fileType}`;
                }

                img.addEventListener('mouseover', () => {
                    updatePosition(img, infoBox);
                    infoBox.style.visibility = 'visible';
                });
                img.addEventListener('mouseout', () => {
                    infoBox.style.visibility = 'hidden';
                });
            }

            function updatePosition(img, infoBox) {
                const rect = img.getBoundingClientRect();
                infoBox.style.top = `${window.scrollY + rect.top - infoBox.offsetHeight - 5}px`;
                infoBox.style.left = `${window.scrollX + rect.left + (rect.width - infoBox.offsetWidth) / 2}px`;
            }

            function parseResolution(resolution) {
                const [width, height] = resolution.split(' x ').map(Number);
                return { width, height };
            }
        }

        // ===========================================
        // 调用函数，移动包含特定文本“相关资源”的tr到表格顶端
        // ===========================================
        function updateRowAndToggleImage(searchText) {
            // 获取页面中所有的tr元素
            const trElements = document.querySelectorAll('tr');

            // 遍历所有tr元素
            trElements.forEach(tr => {
                // 在当前tr中查找所有td元素
                const tdElements = tr.querySelectorAll('td.rowhead.nowrap');


                // 遍历这些td元素
                tdElements.forEach(td => {
                    // 检查td元素的文本内容是否为searchText（传入的参数）
                    if (td.textContent.trim() === searchText) {

                        // 获取这个tr的父表格
                        const table = tr.closest('table');
                        if (table) {
                            // 将这个tr移动到表格的最顶端
                            table.insertBefore(tr, table.firstChild);
                        }

                    }

                });
            });
        }

        if (window.location.href.includes("/details.php?")) {
            updateRowAndToggleImage("相关资源");
        }
    }


    // ===========================================
    // 2. << 添加隐藏已审按钮和 torrents.php 页面下的功能 >>
    // ===========================================
    // 使用 async function 以便在函数内部使用 await
    async function enhanceTorrentsPage() {
        let buttonTop = 10; // 初始按钮位置
        const buttonSpacing = 30; // 按钮间隔

        // ===== 新增代码：状态管理 =====
        const HIDE_MATCHES_STATE_KEY = 'hideMatchesState'; // 用于存储状态的键
        const HIDE_REVIEWED_STATE_KEY = 'hideReviewedState'; // 隐藏已审状态键
        const HIDE_OLD_STATE_KEY = 'hideOldState'; // 隐藏老种状态键
        // 使用 await 异步获取存储的状态，默认为 false (不隐藏)
        let isMatchesHidden = await GM_getValue(HIDE_MATCHES_STATE_KEY, false);
        let isReviewedHidden = await GM_getValue(HIDE_REVIEWED_STATE_KEY, false);
        let isOldHidden = await GM_getValue(HIDE_OLD_STATE_KEY, false);
        // =============================

        // 按钮引用，方便后续修改文本
        let hideMatchesButton, hideReviewedButton, hideOldButton;

        // 按钮配置
        const buttons = [
            { id: 'hideReviewed', text: '隐藏已审', action: toggleHideReviewedState },
            { id: 'hideOld', text: '隐藏老种', action: toggleHideOldState },
            {
                text: '显示所有', action: () => {
                    jQuery('table.torrents tr').show();
                    // 点击"显示所有"时，重置所有隐藏状态
                    if (isMatchesHidden || isReviewedHidden || isOldHidden) {
                        isMatchesHidden = false;
                        isReviewedHidden = false;
                        isOldHidden = false;
                        GM_setValue(HIDE_MATCHES_STATE_KEY, false);
                        GM_setValue(HIDE_REVIEWED_STATE_KEY, false);
                        GM_setValue(HIDE_OLD_STATE_KEY, false);
                        // 更新所有按钮文本
                        updateHideMatchesButtonText();
                        updateHideReviewedButtonText();
                        updateHideOldButtonText();
                    }
                    changeFrozenRowsStyle(); // 重新应用样式
                }
            },
            { id: 'hideMatches', text: '隐藏匹配项', action: toggleHideMatchesState },
            { text: '隐藏非匹配项', action: () => toggleVisibility(false) },
            { text: '选中复选框', action: () => jQuery('table.torrents input[type="checkbox"]:visible').prop('checked', true) },
            { text: window.location.search.includes('neutral=1') ? '隐藏中性' : '显示中性', action: () => toggleParam('neutral') },
            { text: window.location.search.includes('trumpable=1') ? '隐藏可替代' : '显示可替代', action: () => toggleParam('trumpable') }
        ];
        if (isTest) {
            buttons.push({ text: '导出种子列表', action: exportList })// 新增导出按钮)
        }

        // 创建按钮和输入框
        buttons.forEach(btn => {
            const button = createButton(btn.text, btn.action);
            // 保存特定按钮的引用
            if (btn.id === 'hideMatches') {
                hideMatchesButton = button;
            } else if (btn.id === 'hideReviewed') {
                hideReviewedButton = button;
            } else if (btn.id === 'hideOld') {
                hideOldButton = button;
            }
        });

        const mainInput = createInput('匹配标题', 'savedMainRegex');
        const subtitleInput = createInput('匹配副标题', 'savedSubtitleRegex');

        // ===== 新增代码：核心功能实现 =====

        // 根据输入框内容隐藏匹配的行
        function applyHideMatches() {
            const mainRegexValue = mainInput.value;
            const subtitleRegexValue = subtitleInput.value;

            // 如果两个输入框都为空，则不执行任何操作
            if (!mainRegexValue && !subtitleRegexValue) {
                console.log('匹配内容为空，不执行隐藏。');
                return;
            }

            const mainRegex = new RegExp(mainRegexValue, 'i');
            const subtitleRegex = new RegExp(subtitleRegexValue, 'i');
            const rows = jQuery('table.torrents tr');

            rows.each(function (index) {
                if (index === 0 || index === rows.length - 1) return; // 跳过表头和表尾

                const title = jQuery(this).find('div.torrent-title a[title]').attr('title') || '';
                const subtitle = jQuery(this).find('div.torrent-smalldescr span:last').text() || '';
                let isMatch = false;

                // 如果主标题输入框有值，则优先匹配主标题
                if (mainRegexValue) {
                    isMatch = mainRegex.test(title);
                }
                // 如果主标题不匹配且副标题输入框有值，则匹配副标题
                if (!isMatch && subtitleRegexValue) {
                    isMatch = subtitleRegex.test(subtitle);
                }

                if (isMatch) {
                    jQuery(this).hide();
                }
            });
        }

        // 更新按钮文本
        function updateHideMatchesButtonText() {
            if (hideMatchesButton) {
                hideMatchesButton.textContent = isMatchesHidden ? '取消隐藏匹配项' : '隐藏匹配项';
            }
        }

        function updateHideReviewedButtonText() {
            if (hideReviewedButton) {
                hideReviewedButton.textContent = isReviewedHidden ? '取消隐藏已审' : '隐藏已审';
            }
        }

        function updateHideOldButtonText() {
            if (hideOldButton) {
                hideOldButton.textContent = isOldHidden ? '取消隐藏老种' : '隐藏老种';
            }
        }

        // 切换隐藏状态、保存并执行
        async function toggleHideMatchesState() {
            // 切换状态
            isMatchesHidden = !isMatchesHidden;
            // 保存新状态
            await GM_setValue(HIDE_MATCHES_STATE_KEY, isMatchesHidden);
            // 更新按钮文本
            updateHideMatchesButtonText();

            if (isMatchesHidden) {
                // 如果是隐藏状态，执行隐藏
                applyHideMatches();
            } else {
                // 如果是取消隐藏状态，显示所有行
                jQuery('table.torrents tr').show();
                // 重新应用其他隐藏状态
                if (isReviewedHidden) applyHideReviewed();
                if (isOldHidden) applyHideOld();
                changeFrozenRowsStyle(); // 重新应用其他样式规则
            }
        }

        // 切换隐藏已审状态
        async function toggleHideReviewedState() {
            isReviewedHidden = !isReviewedHidden;
            await GM_setValue(HIDE_REVIEWED_STATE_KEY, isReviewedHidden);
            updateHideReviewedButtonText();

            if (isReviewedHidden) {
                applyHideReviewed();
            } else {
                jQuery('table.torrents tr').show();
                // 重新应用其他隐藏状态
                if (isMatchesHidden) applyHideMatches();
                if (isOldHidden) applyHideOld();
                changeFrozenRowsStyle();
            }
        }

        // 切换隐藏老种状态
        async function toggleHideOldState() {
            isOldHidden = !isOldHidden;
            await GM_setValue(HIDE_OLD_STATE_KEY, isOldHidden);
            updateHideOldButtonText();

            if (isOldHidden) {
                applyHideOld();
            } else {
                jQuery('table.torrents tr').show();
                // 重新应用其他隐藏状态
                if (isMatchesHidden) applyHideMatches();
                if (isReviewedHidden) applyHideReviewed();
                changeFrozenRowsStyle();
            }
        }

        // =======================================

        // 新增导出函数
        function exportList() {
            const items = [];
            const rows = jQuery('table.torrents tr:visible');

            rows.each(function (index) {
                if (index === 0 || index === rows.length - 1) return;

                const titleLink = jQuery(this).find('div.torrent-title a[title]');
                const title = titleLink.attr('title');
                const href = titleLink.attr('href');
                const subtitle = jQuery(this).find('div.torrent-smalldescr span:last').text().trim();

                if (title && href) {
                    items.push({
                        title: title,
                        link: href.startsWith('http') ? href : 'https://springsunday.net/' + href,
                        subtitle: subtitle
                    });
                }
            });

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>导出列表</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .subtitle { color: #666; font-size: 0.9em; margin-top: 4px; }
    </style>
</head>
<body>
    <h1>导出列表</h1>
    <table>
        <tbody>
            ${items.map(item => `
                <tr>
                    <td>
                        <a href="${item.link}" target="_blank">${item.title}</a>
                        <div class="subtitle">${item.subtitle}</div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <p>共 ${items.length} 个项目</p>
</body>
</html>
        `;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '导出列表.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function changeFrozenRowsStyle() {
            // 更改包含冻结图标的行的样式
            jQuery('span.bi.bi-info.torrent-icon[title="冻结"]').each(function () {
                const row = jQuery(this).closest('tr');
                row.find('div.torrent-title a').css('color', 'blue');
            });
            jQuery('a[href="?cat=502"], a[href="?cat=503"], a[href="?cat=505"]').each(function () {
                const parentTd = jQuery(this).closest('td');
                const nextTd = parentTd.next('td');
                const hasPackLink = nextTd.find('table tbody a[href="/torrents.php?pack=1"], a[href="/torrents.php?untouched=1"]').length > 0;
                const descrText = nextTd.find('table tbody div.torrent-smalldescr').text();
                const regex = /第\s*?[\d一二三四五六七八九十百千]*(?:-\d+)?\s*?[集期]/;
                const matches = regex.test(descrText);
                if (!hasPackLink && matches) {
                    const row = jQuery(this).closest('tr');
                    const titleLink = row.find('div.torrent-title a');
                    if (titleLink.css('color') !== 'blue' && window.location.href.includes("/torrents.php")) {
                        titleLink.css('color', 'darkgoldenrod');
                    }
                }
            });
            jQuery('td.rowfollow').each(function () {
                if (jQuery(this).find('span.red').text().trim() === '0') {
                    const row = jQuery(this).closest('tr');
                    const titleLink = row.find('div.torrent-title a');
                    const currentColor = titleLink.css('color');
                    if (currentColor !== 'blue' && currentColor !== 'darkgoldenrod') {
                        titleLink.css('color', 'darkred');
                    }
                }
            });
        }

        // 在页面加载后立即调用
        changeFrozenRowsStyle();

        function applyHideReviewed() {
            jQuery('span.bi.bi-check2.torrent-icon, span.bi.bi-heart-fill.torrent-icon, span.bi.bi-fire.torrent-icon, span.bi.bi-award-fill.torrent-icon').closest('table').closest('tr').hide();
            changeFrozenRowsStyle();
        }

        function applyHideOld() {
            jQuery('td.rowfollow.nowrap').each(function () {
                if (jQuery(this).text().includes('月')) {
                    jQuery(this).closest('tr').hide();
                }
            });
            changeFrozenRowsStyle();
        }

        function toggleParam(param) {
            const url = new URL(window.location);
            const currentValue = url.searchParams.get(param) === '1' ? '2' : '1';
            url.searchParams.set(param, currentValue);
            window.location.href = url.toString();
        }

        function toggleVisibility(match) {
            const mainRegex = new RegExp(mainInput.value, 'i');
            const subtitleRegex = new RegExp(subtitleInput.value, 'i');
            const rows = jQuery('table.torrents tr:visible');
            rows.each(function (index) {
                if (index === 0) return;
                if (index === rows.length - 1) return;

                const title = jQuery(this).find('div.torrent-title a[title]').attr('title');
                const subtitle = jQuery(this).find('div.torrent-smalldescr span:last').text();
                const regexToUse = mainInput.value ? mainRegex : subtitleRegex;
                const textToMatch = mainInput.value ? title : subtitle;
                const shouldHide = match ? regexToUse.test(textToMatch) : !regexToUse.test(textToMatch);
                jQuery(this).toggle(!shouldHide);
            });
        }

        function createButton(text, onClickFunction) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `position:fixed;top:${buttonTop}px;right:10px;z-index:1000;`;
            document.body.appendChild(button);
            button.onclick = onClickFunction;
            buttonTop += buttonSpacing;
            return button; // 返回按钮元素以便引用
        }

        function createInput(placeholder, localStorageKey) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = placeholder;
            input.style.cssText = `position:fixed;top:${buttonTop}px;right:10px;z-index:1000;width:120px;`;
            document.body.appendChild(input);
            input.value = localStorage.getItem(localStorageKey) || '';
            input.addEventListener('input', () => {
                localStorage.setItem(localStorageKey, input.value);
            });
            buttonTop += buttonSpacing;
            return input;
        }

        // ===== 新增代码：页面加载时执行检查 =====
        // 更新所有按钮的初始文本
        updateHideMatchesButtonText();
        updateHideReviewedButtonText();
        updateHideOldButtonText();

        // 如果记录的状态是"隐藏"，则在页面加载完成后自动执行隐藏
        if (isMatchesHidden) {
            console.log('页面加载，根据保存的状态自动隐藏匹配项。');
            applyHideMatches();
        }
        if (isReviewedHidden) {
            console.log('页面加载，根据保存的状态自动隐藏已审种子。');
            applyHideReviewed();
        }
        if (isOldHidden) {
            console.log('页面加载，根据保存的状态自动隐藏老种。');
            applyHideOld();
        }
        // =====================================
    }

    if ((window.location.href.includes("/torrents.php") || window.location.href.includes("offers.php")) && isTest) {
        enhanceTorrentsPage();
    }

    // ===========================================
    // 4. << 快速添加回复的修改意见 >>
    // 快速添加 对应问题/标准回答 的答复
    // ===========================================

    if (window.location.href.includes("/details.php") && isTest) {
        // 确保页面加载完成后执行
        $('#outer>div.main, #outer>table.main, #outer>div.main~table, #outer>table.main~table').css('width', 'auto');

        $(document).ready(function () {
            const target = $('td.rowhead.nowrap a[href="javascript: klappe_news(\'related\')"]');
            if (target.length > 0) {
                const button = $('<br><button>显示副标题</button>');
                target.after(button);
                let shown = false; // 状态标记
                let originalHtml = []; // 存储原始 HTML
                $('#krelated table tr').each(function (index) {
                    originalHtml[index] = $(this).html(); // 初始化时保存原始内容
                });
                button.on('click', function () {
                    $('#krelated table tr').each(function (index) {
                        if (!shown) {
                            // 显示副标题：取消注释
                            let html = originalHtml[index].replace(/<!--\s*(.*?)\s*-->/g, '$1');
                            $(this).html(html);
                            button.text('隐藏副标题');
                        } else {
                            // 恢复原状：恢复原始 HTML
                            $(this).html(originalHtml[index]);
                            button.text('显示副标题');
                        }
                    });
                    shown = !shown;
                });
            }
        });

        const comments = [
            "「主标题」请参考资源规则中的主标题规则，并参考豆瓣或者 imdb 的影片名，重新命名主标题",
            "「海报」海报未正确显示，请删除海报栏链接或更换。",
            "「截图」截图规格错误，请参考资源规则，重新截取 png 格式原图",
            "「截图」截图内容必须包含影视正片有效信息，片头片尾不视为有效信息，请补充或更换截图。",
            "「截图」请补充至少一张带中字的截图",
            "「截图」请删除截图栏中的无关图片。",
            "「制作信息」请补充制作信息等相关内容。",
            "「附加信息」WEB-DL 无需在附加信息中附加 NFO，请删除相关信息。",
            "「附加信息」请移除附加信息中除致谢、制作信息(包括音视频及字幕来源、处理方式等)以外的内容。",
            "「附加信息」请正确使用附加信息中的引用框，格式为：[quote]内容[/quote]",
            "「附加信息」无豆瓣或 IMDB 链接时，请在附加信息中补充剧情简介。",
            "「MediaInfo」请使用 MediaInfo 扫描完整的英文版媒体信息 [url=https://springsunday.net/forums.php?action=viewtopic&forumid=16&topicid=14319] 教程 [/url] [url=https://mediaarea.net/MediaInfoOnline] 在线版 [/url]",
            "「BDInfo」多合一或多剪辑版本的原盘需扫描每个影片文件的 BDinfo 并放入附加信息内，需使用折叠标签[spoiler][/spoiler]。",
            "「截图」截图或图床链接使用错误，请参考截图及图床教程 [url=https://springsunday.net/forums.php?action=viewtopic&forumid=10&topicid=18105#pid389691] 教程 [/url] , 如该方法获取截图分辨率错误，右键视频->图像截取->按调整后的比例保存（取消勾选该选项，其余播放器同理）。",
            "「标签」请参考本帖，添加合适的标签。[url=https://wiki.hdcmct.org/zh/Rule/%E4%B8%8A%E4%BC%A0%E8%A7%84%E5%88%99#%E6%A0%87%E7%AD%BE] 参考 [/url]",
            "「脚本」现在我们提供一个春天种子检查 [url=https://springsunday.net/forums.php?action=viewtopic&forumid=16&topicid=16773] 脚本 [/url]，方便用户自检常见的种子信息不规范问题，提高发种效率。",
            "「代为修正」[b]以上问题本次已帮忙修正，后续请多留意，谢谢[/b]",
        ];

        // 预设的默认设置
        const defaultComments = [
            "「原生标签」Untouch 原盘指正式出版未经过二次制作的影碟，包括 Blu-ray 和 DVD。",
            "「特效标签」字幕包含有位移、变色、动态等特殊效果。简单的颜色、字体处理不被视为特效。使用特效标签的种子要求至少提供 2 张特效截图，且必须截取剧情相关部分的特效，无分辨率和格式要求，且不计入 3 张截图的基本要求。请补充相应截图或移除标签。",
            "「已取代标签」Trump 资源必须先于候选区发布，主动「举报/反馈」种子并说明 Trump（附带对应链接），附带 Trump 理由可更好的审核。",
            "「合集标签」剧集、纪录、动画等资源的整季打包。详见资源规则的 [url=https://wiki.hdcmct.org/zh/Rule/%E4%B8%8A%E4%BC%A0%E8%A7%84%E5%88%99#%E5%90%88%E9%9B%86%E6%89%93%E5%8C%85%E8%A7%84%E5%88%99] 合集打包规则 [/url]",
            "「中字标签」资源包含有中文字幕。以下情形均可使用中字标签：内封/外挂/上传简繁字幕、内封/外挂/上传双语字幕、中文硬字幕。",
            "「国配标签」外语片或粤语片包含有普通话配音（包括台湾普通话配音），豆瓣信息中原始语言含有普通话的资源不可使用该标签。",
            "「CC 标签」原盘或压制的来源是 CC 标准收藏碟。",
            "「自购标签」自购/自抓请选择，如转载请删除相关内容。",
        ];

        // 初始化 UI
        function initializeUI() {
            const textarea = $('textarea[name="body"]');
            const selectHTML = buildSelectOptions(comments);
            textarea.after(selectHTML);
            setupEventListeners(textarea);
            createLeftTextarea(); // 添加左侧textarea初始化
        }

        function createLeftTextarea() {
            const tbody = $('#compose').closest('tbody');
            if (tbody.length) {
                const table = tbody.closest('table');
                table.css('position', 'relative');

                // 获取quickcommentselect的位置和高度
                const quickSelect = $('#quickcommentselect');
                const quickSelectHeight = quickSelect.height(); // 获取内部高度
                const quickSelectTop = quickSelect.position().top;
                const tbodyPosition = tbody.position();
                const tbodyHeight = tbody.outerHeight();

                // 计算上方框可用的剩余高度
                const totalAvailableHeight = tbodyHeight - 90; // 减去输入框和按钮的高度
                const remainingHeight = totalAvailableHeight - quickSelectHeight;

                // 创建容器div
                const containerDiv = $('<div></div>').css({
                    position: 'absolute',
                    top: tbodyPosition.top + 'px',
                    left: (tbodyPosition.left - 315) + 'px',
                    width: '300px'
                });

                // 创建上方select（用于自定义内容）
                const customSelect = $('<select multiple="multiple"></select>').css({
                    width: '100%',
                    height: remainingHeight + 'px',
                    border: '1px solid #ccc',
                    marginBottom: '10px'
                });

                // 创建下方select（用于默认设置）
                const defaultSelect = $('<select multiple="multiple"></select>').css({
                    width: '100%',
                    height: quickSelectHeight + 'px',
                    border: '1px solid #ccc'
                });

                // 创建自定义输入框
                const customInput = $('<input type="text" placeholder="输入自定义内容后回车，ALT+左键选中">').css({
                    width: '96%',
                    marginTop: '5px',
                    padding: '5px',
                    border: '1px solid #ccc'
                });

                // 按钮容器
                const buttonContainer = $('<div></div>').css({
                    display: 'flex',
                    gap: '5px',
                    marginTop: '5px'
                });

                // 添加按钮
                const addButton = $('<button>添加</button>').css({
                    flex: '1',
                    padding: '5px'
                });

                // 删除选中按钮
                const deleteButton = $('<button>删除选中</button>').css({
                    flex: '1',
                    padding: '5px'
                });

                // 加载评论列表
                function loadComments() {
                    customSelect.empty();
                    defaultSelect.empty();

                    // 添加默认评论到下方select
                    defaultComments.forEach((comment, index) => {
                        defaultSelect.append(
                            $('<option></option>')
                                .text(comment)
                                .val('default_' + index)
                                .css('background-color', '#f0f0f0')
                                .addClass('default-item')
                        );
                    });

                    // 添加自定义评论到上方select
                    const customComments = GM_getValue('customComments', []);
                    customComments.forEach((comment, index) => {
                        customSelect.append(
                            $('<option></option>')
                                .text(comment)
                                .val('custom_' + index)
                                .addClass('custom-item')
                        );
                    });
                }

                // 设置点击事件处理程序 (Select选择逻辑)
                [customSelect, defaultSelect].forEach(select => {
                    select.on('click', function (e) {
                        const option = $(e.target);
                        if (!option.is('option')) return;
                        if (!e.altKey) {
                            // 普通点击：添加到文本框
                            const textarea = $('textarea[name="body"]');
                            let currentText = textarea.val();
                            const textToAdd = option.text();
                            currentText += (currentText ? '\n' : '') + '● ' + textToAdd;
                            textarea.val(currentText);
                            // 取消选中状态
                            option.prop('selected', false);
                        }
                    });
                    select.on('mousedown', function (e) {
                        if (e.altKey) {
                            e.preventDefault();
                            const option = $(e.target);
                            if (!option.is('option')) return;
                            if (option.hasClass('custom-item')) {
                                option.prop('selected', !option.prop('selected'));
                            }
                        }
                    });
                });

                // 逻辑处理函数：添加自定义内容
                function addCustomContent() {
                    const customText = customInput.val().trim();
                    if (customText) {
                        const customComments = GM_getValue('customComments', []);
                        if (!customComments.includes(customText)) {
                            customComments.push(customText);
                            GM_setValue('customComments', customComments);
                            loadComments();
                        }
                        customInput.val('');
                    }
                }

                // --- 新增逻辑：键盘监听 (Alt键切换按钮文字) ---
                $(document).on('keydown keyup', function (e) {
                    // 仅当按钮存在时执行
                    if (addButton && deleteButton) {
                        if (e.altKey) {
                            addButton.text('导出到剪贴板');
                            deleteButton.text('从剪贴板导入');
                        } else {
                            addButton.text('添加');
                            deleteButton.text('删除选中');
                        }
                    }
                });

                customInput.keypress(function (e) {
                    if (e.which === 13) {
                        addCustomContent();
                    }
                });

                // --- 修改：添加按钮点击事件 ---
                addButton.click(function (e) {
                    if (e.altKey) {
                        // ALT按下：导出逻辑
                        const customComments = GM_getValue('customComments', []);
                        const jsonStr = JSON.stringify(customComments);
                        navigator.clipboard.writeText(jsonStr).then(() => {
                            alert(`已将 ${customComments.length} 条自定义回复导出到剪贴板！`);
                        }).catch(err => {
                            alert('导出失败，请确保页面拥有访问剪贴板的权限。');
                            console.error(err);
                        });
                    } else {
                        // 普通点击：添加逻辑
                        addCustomContent();
                    }
                });

                // --- 修改：删除按钮点击事件 ---
                deleteButton.click(function (e) {
                    if (e.altKey) {
                        // ALT按下：导入逻辑
                        navigator.clipboard.readText().then(text => {
                            try {
                                const importedData = JSON.parse(text);
                                if (Array.isArray(importedData)) {
                                    const currentComments = GM_getValue('customComments', []);
                                    let addCount = 0;
                                    importedData.forEach(item => {
                                        // 简单的去重合并
                                        if (item && typeof item === 'string' && !currentComments.includes(item)) {
                                            currentComments.push(item);
                                            addCount++;
                                        }
                                    });
                                    GM_setValue('customComments', currentComments);
                                    loadComments(); // 刷新列表
                                    alert(`成功导入 ${addCount} 条新回复！(已自动过滤重复项)`);
                                } else {
                                    alert('剪贴板内容不是有效的列表数组格式。');
                                }
                            } catch (err) {
                                alert('导入失败：剪贴板内容不是有效的 JSON 数据。');
                            }
                        }).catch(err => {
                            alert('无法读取剪贴板，请检查浏览器权限。');
                        });
                    } else {
                        // 普通点击：删除逻辑
                        const selectedOptions = customSelect.find('option.custom-item:selected');
                        if (selectedOptions.length > 0) {
                            const customComments = GM_getValue('customComments', []);
                            const textsToDelete = selectedOptions.map(function () {
                                return $(this).text();
                            }).get();
                            const newCustomComments = customComments.filter(comment => !textsToDelete.includes(comment));
                            GM_setValue('customComments', newCustomComments);
                            loadComments();
                        }
                    }
                });

                // 初始加载
                loadComments();

                // 组装容器
                buttonContainer.append(addButton, deleteButton);
                containerDiv.append(customSelect, defaultSelect, customInput, buttonContainer);
                table.append(containerDiv);
            }
        }

        // 创建监控选择框
        function createMonitoringSelect() {
            const table = $('#compose').closest('table');
            if (table.length) {
                table.css('position', 'relative');
                const firstTextarea = table.find('textarea').first();
                const quickCommentSelect = $('#quickcommentselect'); // 获取 quickcommentselect 选择框
                if (firstTextarea.length && quickCommentSelect.length) {
                    const quickCommentOffset = quickCommentSelect.offset(); // 获取 quickcommentselect 的绝对位置
                    const tableOffset = table.offset(); // 获取 table 的绝对位置
                    const monitoringSelect = $('<select id="monitoringSelect" multiple="multiple" style="width: 300px; height: 330px; position: absolute;"></select>');
                    monitoringSelect.css({
                        top: (quickCommentOffset.top - tableOffset.top) + 'px', // 计算相对 table 的 top
                        left: (firstTextarea.position().left + firstTextarea.outerWidth() + 15) + 'px' // 仍然放在 textarea 右侧
                    });
                    table.append(monitoringSelect);
                    updateMonitoringSelect();
                    setInterval(updateMonitoringSelect, 2000);
                    monitoringSelect.change(function () {
                        const selectedText = $(this).find('option:selected').text();
                        const textarea = $('textarea[name="body"]');
                        textarea.val(textarea.val() + (textarea.val() ? '\n' : '') + selectedText);
                        formatTextareaInput(textarea);
                    });
                }
            }
        }

        // 更新监控选择框的内容
        function updateMonitoringSelect() {
            const assistantContent = $('#assistant-tooltips').html() || '';
            const editorContent = $('#editor-tooltips').html() || '';
            const combinedContent = assistantContent + '<br>' + editorContent;
            const monitoringSelect = $('#monitoringSelect');
            if (monitoringSelect.data('content') !== combinedContent) {
                monitoringSelect.data('content', combinedContent);
                monitoringSelect.empty();
                const lines = combinedContent.split(/<br\s*\/?>/gi);
                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine && !trimmedLine.includes('此种子未检测到异常')) {
                        monitoringSelect.append($('<option></option>').text(trimmedLine));
                    }
                });
            }
        }

        // 构建下拉选择 HTML
        function buildSelectOptions(comments) {
            let options = comments.map((comment, index) =>
                `<option class="quickcomment" id="quickcomment${index}" value="${index}">${comment}</option>`
            ).join('');
            return `<div align="center"><select id="quickcommentselect" multiple="multiple" style="width: 450px; height: 360px; margin-top: 5px; margin-bottom: 5px">${options}</select></div>`;
        }

        // 设置事件监听器
        function setupEventListeners(textarea) {
            $('#quickcommentselect').change(() => {
                const selectedValues = $('#quickcommentselect').val() || [];
                // 检查是否选择了“代为修正”
                const selectedTexts = selectedValues.map(value => $(`#quickcomment${value}`).text());
                const hasCorrectionText = selectedTexts.some(text => text.includes("「代为修正」[b]以上问题本次已帮忙修正"));
                if (hasCorrectionText) {
                    // 自动取消勾选举报/反馈复选框，但不触发 GM_setValue
                    $('#sendRequestCheckbox').prop('checked', false);
                    $('#addTextCheckbox').prop('checked', false);
                }
                handleSelectChange(textarea);
            });
            textarea.on('input', () => formatTextareaInput(textarea));
            $('#qr').after('<input type="checkbox" id="addTextCheckbox" style="margin-left: 10px;"/><label for="addTextCheckbox">完成修改后请「举报/反馈」种子，谢谢</label>');
            $('#qr').after('<input type="checkbox" id="sendRequestCheckbox" style="margin-left: 20px;"/><label for="sendRequestCheckbox">冻结</label>');
            $('#qr').click((event) => handleQRClick(event, textarea));
            $('#addTextCheckbox').prop('checked', GM_getValue('addTextChecked', true));
            $('#sendRequestCheckbox').prop('checked', GM_getValue('sendRequestChecked', true));
            $('#addTextCheckbox').change(function () {
                GM_setValue('addTextChecked', $(this).is(':checked'));
            });
            $('#sendRequestCheckbox').change(function () {
                GM_setValue('sendRequestChecked', $(this).is(':checked'));
            });
        }

        // 处理下拉选择变更
        function handleSelectChange(textarea) {
            let selectedValues = $('#quickcommentselect').val();
            let currentText = textarea.val();
            let lastLineIsEmpty = currentText === '' || currentText.endsWith('\n');
            selectedValues.forEach(value => {
                let textToAdd = $(`#quickcomment${value}`).text();
                // 检查是否是“代为修正”那条
                if (textToAdd.includes("「代为修正」") && textToAdd.includes("已帮忙修正")) {
                    $('#addTextCheckbox').prop('checked', false);  // 🔧取消选中但不保存
                }
                // 移除开头的「」部分
                textToAdd = textToAdd.replace(/^「[^」]*」/, '').trim();
                textarea.val(`${currentText}${lastLineIsEmpty ? '' : '\n'}● ${textToAdd}`);
                currentText = textarea.val();
            });
        }

        // 格式化文本区域输入
        function formatTextareaInput(textarea) {
            let lines = textarea.val().split('\n');
            let transformedLines = lines.map(line =>
                line.trim() !== '' && !line.trim().startsWith('●') ? `● ${line}` : line
            );
            textarea.val(transformedLines.join('\n'));
        }

        // 处理点击事件
        function handleQRClick(event, textarea) {
            event.preventDefault();
            const tid = new URLSearchParams(window.location.search).get('id');
            var url = "https://springsunday.net/admin.php?action=freezeoffer";
            var data = "tid=" + tid;
            if ($('#sendRequestCheckbox').is(':checked')) {
                sendRequest(url, data);
            }
            if ($('#addTextCheckbox').is(':checked')) {
                let currentText = textarea.val();
                let additionalText = "\n\n完成修改后请「举报/反馈」种子，谢谢 [em28]";
                if (!currentText.endsWith(additionalText)) {
                    textarea.val(`${currentText}${additionalText}`);
                }
            }
            setTimeout(() => {
                document.getElementById('compose').submit();
            }, 1000);
        }

        // 通用发送请求的函数
        function sendRequest(url, data) {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: data
            });
        }

        // 初始化
        initializeUI();
        createMonitoringSelect();
    }

    //===================文件对比妙妙小工具===============

    if (window.location.href.includes("/details.php") && isTest) {
        (function () {
            'use strict';

            // 简化样式
            GM_addStyle(`
        .filelist-btn {
            margin-left: 5px;
            padding: 2px 5px;
            cursor: pointer;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-size: 12px;
        }
        .filelist-popup {
            position: fixed;
            background: white;
            border: 1px solid #ddd;
            padding: 10px;
            z-index: 9999;
            max-width: 80%;
            max-height: 60vh;
            overflow: auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: monospace;
        }
        .filelist-added {
            color: green;
        }
        .filelist-removed {
            color: red;
        }
        .filelist-changed {
            color: blue;
        }
        .size-diff {
            background-color: #ffeb3b;
            padding: 0 2px;
            border-radius: 2px;
        }
    `);

            // 创建悬浮窗
            const popup = document.createElement('div');
            popup.className = 'filelist-popup';
            popup.style.display = 'none';
            document.body.appendChild(popup);

            // 主点击监听
            document.addEventListener('click', function (e) {
                // 检测文件列表按钮点击
                const btn = e.target.closest('a[role="button"]');
                if (btn) {
                    setTimeout(handleFilelist, 1000);
                    return;
                }

                // 处理保存按钮
                if (e.target.classList.contains('filelist-save')) {
                    const list = extractFileList();
                    if (list) {
                        GM_setValue('saved_filelist', list);
                        alert('已保存当前文件列表');
                    }
                    return;
                }

                // 处理对比按钮
                if (e.target.classList.contains('filelist-compare')) {
                    const current = extractFileList();
                    const saved = GM_getValue('saved_filelist', '');
                    showComparison(current, saved, e.target);
                    return;
                }

                // 点击其他地方关闭弹窗
                if (!e.target.closest('.filelist-popup')) {
                    popup.style.display = 'none';
                }
            });

            // 处理文件列表
            function handleFilelist() {
                const td = document.querySelector('td:has(div.filelist)');
                if (!td) return;

                // 添加按钮（如果尚未添加）
                if (!td.querySelector('.filelist-btn')) {
                    const btnContainer = document.createElement('span');
                    btnContainer.innerHTML = `
                <button class="filelist-btn filelist-save">保存文件列表</button>
                <button class="filelist-btn filelist-compare">对比保存的文件列表</button>
            `;
                    td.appendChild(btnContainer);
                }
            }

            // 提取文件列表
            function extractFileList() {
                const container = document.querySelector('div.filelist');
                if (!container) return null;

                const result = [];
                const extract = (node, path = '') => {
                    const items = node.querySelectorAll('li.filelist-node');
                    items.forEach(item => {
                        const name = item.querySelector('.filelist-filename')?.textContent?.trim() || '';
                        const size = item.querySelector('.filelist-size')?.textContent?.trim() || '';
                        const fullPath = path ? `${path}/${name}` : name;

                        if (item.classList.contains('dir')) {
                            extract(item, fullPath);
                        } else {
                            result.push({
                                path: fullPath,
                                size: size
                            });
                        }
                    });
                };

                extract(container);
                return JSON.stringify(result); // 保存为JSON格式
            }

            // 显示对比结果
            function showComparison(current, saved, anchor) {
                if (!saved) {
                    popup.innerHTML = '<div>没有已保存的文件列表</div>';
                    showPopup(anchor);
                    return;
                }

                try {
                    const currentFiles = current ? JSON.parse(current) : [];
                    const savedFiles = JSON.parse(saved);

                    const currentMap = new Map(currentFiles.map(f => [f.path, f.size]));
                    const savedMap = new Map(savedFiles.map(f => [f.path, f.size]));

                    const allPaths = new Set([...currentMap.keys(), ...savedMap.keys()]);
                    const diff = [];

                    for (const path of allPaths) {
                        const currentSize = currentMap.get(path);
                        const savedSize = savedMap.get(path);

                        if (!currentMap.has(path)) {
                            // 文件被删除
                            diff.push(`<div class="filelist-removed">- ${path} ${savedSize}</div>`);
                        } else if (!savedMap.has(path)) {
                            // 文件被删除
                            diff.push(`<div class="filelist-removed">- ${path} ${savedSize}</div>`);
                        } else if (!savedMap.has(path)) {
                            // 文件是新增的
                            diff.push(`<div class="filelist-added">+ ${path} ${currentSize}</div>`);
                        } else if (currentSize !== savedSize) {
                            // 文件名相同但体积不同
                            diff.push(`
                        <div class="filelist-changed">
                            ${path}
                            <span class="size-diff">${savedSize} → ${currentSize}</span>
                        </div>
                    `);
                        }
                    }
                    popup.innerHTML = diff.length ? diff.join('') : '<div>没有差异</div>';
                    showPopup(anchor);
                } catch (e) {
                    popup.innerHTML = '<div>对比出错: ' + e.message + '</div>';
                    showPopup(anchor);
                }
            }
            // 显示弹窗
            function showPopup(anchor) {
                const rect = anchor.getBoundingClientRect();
                popup.style.left = `${rect.left}px`;
                popup.style.top = `${rect.bottom + 5}px`;
                popup.style.display = 'block';
            }
        })();
    }
})();