// ==UserScript==
// @name         SpringSunday-Quik-Quote
// @namespace    https://springsunday.net/
// @version      1.6.2
// @description  快速引用一个种子发布种子
// @author       许仙
// @include     http*://springsunday.net/details.php*
// @include     http*://springsunday.net/upload.php*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406651/SpringSunday-Quik-Quote.user.js
// @updateURL https://update.greasyfork.org/scripts/406651/SpringSunday-Quik-Quote.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var New_descr = decodeURI(location.href);
    console.log(New_descr);
    if (New_descr.match(/http(s*):\/\/.*\/details.php.*/i)) {
        var title = $('#top').text();
        var exclusive = 0;
        if (title.indexOf('禁转') >= 0) {
            exclusive = 1;
        }
        title = title.replace('禁转', '').replace("[2X免费]", "").replace("[免费]", "").replace("[50%]", "").replace("[30%]", "").replace("[2X 50%]", "").replace("[2X]", "").replace(/\(限时\d+.*\)/g, "").trim();

        var description = $('.extra-text').text();
        if (description) {
            description = description.trim();
        }

        var subtitle, cat, type = 99, encode = 99, audio = 99, resolution, area = 99, group, anonymous;
        var poster;
        var fixtd, douban, imdb, mediainfo, tags;

        var tdlist = $('#outer table:first').find('td');
        for (var i = 0; i < tdlist.length; i++) {
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

            if (td.text() == '基本信息') {
                var text = td.parent().children().last().text();
                // 类型
                if (text.indexOf('Movies(电影)') >= 0) {
                    cat = 501;
                } else if (text.indexOf('TV Series(剧集)') >= 0) {
                    cat = 502;
                } else if (text.indexOf('Docs(纪录)') >= 0) {
                    cat = 503;
                } else if (text.indexOf('Animations(动画)') >= 0) {
                    cat = 504;
                } else if (text.indexOf('TV Shows(综艺)') >= 0) {
                    cat = 505;
                } else if (text.indexOf('Sports(体育)') >= 0) {
                    cat = 506;
                } else if (text.indexOf('MV(音乐视频)') >= 0) {
                    cat = 507;
                } else if (text.indexOf('Music(音乐)') >= 0) {
                    cat = 508;
                } else if (text.indexOf('类型: Others(其他)')  >= 0) {
                    cat = 509;
                }

                // 格式
                if (text.indexOf('Blu-ray') >= 0) {
                    type = 1;
                } else if (text.indexOf('Remux') >= 0) {
                    type = 4;
                } else if (text.indexOf('MiniBD') >= 0) {
                    type = 2;
                } else if (text.indexOf('BDRip') >= 0) {
                    type = 6;
                } else if (text.indexOf('WEB-DL') >= 0) {
                    type = 7;
                } else if (text.indexOf('WEBRip') >= 0) {
                    type = 8;
                } else if (text.indexOf('HDTV') >= 0) {
                    type = 5;
                } else if (text.indexOf('TVRip') >= 0) {
                    type = 9;
                } else if (text.indexOf('DVDRip') >= 0) {
                    type = 10;
                } else if (text.indexOf('DVD') >= 0) {
                    type = 3;
                } else if (text.indexOf('CD') >= 0) {
                    type = 11;
                } else if (text.indexOf('格式: Other')  >= 0) {
                    type = 99;
                }

                // 视频编码
                if (text.indexOf('H.265/HEVC') >= 0) {
                    encode = 1;
                } else if (text.indexOf('H.264/AVC') >= 0) {
                    encode = 2;
                } else if (text.indexOf('VC-1') >= 0) {
                    encode = 3;
                } else if (text.indexOf('MPEG-2') >= 0) {
                    encode = 4;
                } else if (text.indexOf('主视频编码: Other')  >= 0) {
                    encode = 99;
                }

                // 音频编码
                if (text.indexOf('DTS-HD') >= 0) {
                    audio = 1;
                } else if (text.indexOf('DTS') >= 0) {
                    audio = 3;
                } else if (text.indexOf('TrueHD') >= 0) {
                    audio = 2;
                } else if (text.indexOf('LPCM') >= 0) {
                    audio = 6;
                } else if (text.indexOf('AC-3') >= 0) {
                    audio = 4;
                } else if (text.indexOf('AAC') >= 0) {
                    audio = 5;
                } else if (text.indexOf('FLAC') >= 0) {
                    audio = 7;
                } else if (text.indexOf('APE') >= 0) {
                    audio = 8;
                } else if (text.indexOf('WAV') >= 0) {
                    audio = 9;
                } else if (text.indexOf('MP3') >= 0) {
                    audio = 10;
                } else if (text.indexOf('主音频编码: Other') >= 0) {
                    audio = 99;
                }

                // 分辨率
                if (text.indexOf('UHD') >= 0) {
                    resolution = 1;
                } else if (text.indexOf('1080p') >= 0) {
                    resolution = 2;
                } else if (text.indexOf('1080i') >= 0) {
                    resolution = 3;
                } else if (text.indexOf('720p') >= 0) {
                    resolution = 4;
                } else if (text.indexOf('SD') >= 0) {
                    resolution = 5;
                }

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
                } else if (text.indexOf('地区: Other(其他)') >= 0) {
                    area = 99;
                }

                // 发布组
                if (text.indexOf('CMCTV') >= 0) {
                    group = 9;
                } else if (text.indexOf('CMCTA') >= 0) {
                    group = 8;
                } else if (text.indexOf('CMCT') >= 0) {
                    group = 1;
                } else if (text.indexOf('DIY') >= 0) {
                    group = 3;
                } else if (text.indexOf('Oldboys') >= 0) {
                    group = 2;
                } else if (text.indexOf('驻站小组') >= 0) {
                    group = 7;
                } else if (text.indexOf('驻站个人') >= 0) {
                    group = 6;
                } else if (text.indexOf('GTR') >= 0) {
                    group = 12;
                }
            }

            if (td.text().trim() == '行为') {
                fixtd = td.parent().children().last();
            }

            if (td.text().trim() == '海报') {
                poster = $('#kposter').children().attr('src');
            }

            if (td.text().trim() == '标签') {
                var text = td.parent().children().last().text();
                if (text !== undefined && text.trim().length > 0) {
                    tags = text.split(/\s+/).join(',');
                }
            }
        }

        $('td.douban_info .title .name a').each(function (index, element) {
            if ($(element).attr('href').indexOf('douban') >= 0) {
                douban = $(element).attr('title');
            }
            if ($(element).attr('href').indexOf('imdb') >= 0) {
                imdb = $(element).attr('title');
            }
        });

        mediainfo = $('.mediainfo-raw .codemain').text();

        var screenshot = '';
        $('.screenshots-container img').each(function (index, element) {
            var src = $(element).attr('src');
            if (src != undefined) {
                if (index != 0) {
                    screenshot += '\n';
                }
                screenshot += src.trim();
            }
        });

        var param = encodeURI('#title_' + title + '#exclusive_' + exclusive + '#description_' + description + '#subtitle_' + subtitle + '#anonymous_' + anonymous + '#cat_' + cat + '#type_' + type + '#encode_' + encode
            + '#audio_' + audio + '#resolution_' + resolution + '#area_' + area + '#group_' + group + '#poster_' + poster + '#douban_' + douban + '#imdb_' + imdb
            + '#mediainfo_' + mediainfo + '#screenshot_' + screenshot + '#tags_' + tags);

        $(fixtd).append(
            ' | <a href="upload.php' + param + '" title="点击引用种子" target="_blank"><b>引用种子</b></a>'
        );
    } else {
        if (New_descr.indexOf('#') >= 0) {
            var title = New_descr.slice(New_descr.search('#title_') + 7, New_descr.search('#exclusive_'));
            var exclusive = New_descr.slice(New_descr.search('#exclusive_') + 11, New_descr.search('#description_'));
            var description = New_descr.slice(New_descr.search('#description_') + 13, New_descr.search('#subtitle_'));
            var subtitle = New_descr.slice(New_descr.search('#subtitle_') + 10, New_descr.search('#anonymous_'));
            var anonymous = New_descr.slice(New_descr.search('#anonymous_') + 11, New_descr.search('#cat_'));
            var cat = New_descr.slice(New_descr.search('#cat_') + 5, New_descr.search('#type_'));
            var type = New_descr.slice(New_descr.search('#type_') + 6, New_descr.search('#encode_'));
            var encode = New_descr.slice(New_descr.search('#encode_') + 8, New_descr.search('#audio_'));
            var audio = New_descr.slice(New_descr.search('#audio_') + 7, New_descr.search('#resolution_'));
            var resolution = New_descr.slice(New_descr.search('#resolution_') + 12, New_descr.search('#area_'));
            var area = New_descr.slice(New_descr.search('#area_') + 6, New_descr.search('#group_'));
            var group = New_descr.slice(New_descr.search('#group_') + 7, New_descr.search('#poster_'));
            var poster = New_descr.slice(New_descr.search('#poster_') + 8, New_descr.search('#douban_'));
            var douban = New_descr.slice(New_descr.search('#douban_') + 8, New_descr.search('#imdb_'));
            var imdb = New_descr.slice(New_descr.search('#imdb_') + 6, New_descr.search('#mediainfo_'));
            var mediainfo = New_descr.slice(New_descr.search('#mediainfo_') + 11, New_descr.search('#screenshot_'));
            var screenshot = New_descr.slice(New_descr.search('#screenshot_') + 12, New_descr.search('#tags_'));
            var tags = New_descr.slice(New_descr.search('#tags_') + 6);

            if (poster != 'undefined' && poster.indexOf('https://images.weserv.nl/?url=') >= 0) {
                poster = poster.replace("https://images.weserv.nl/?url=", "");
            }

            if (cat != 'undefined') $('#browsecat').val(cat);
            if (type != 'undefined') $('select[name="medium_sel"]').val(type);
            if (encode != 'undefined') $('select[name="codec_sel"]').val(encode);
            if (audio != 'undefined') $('select[name="audiocodec_sel"]').val(audio);
            if (resolution != 'undefined') $('select[name="standard_sel"]').val(resolution);
            if (area != 'undefined') $('select[name="source_sel"]').val(area);
            if (title != 'undefined') $('#name').val(title);
            if (subtitle != 'undefined') $('#small_descr').val(subtitle);
            if (douban != '' && douban != undefined && douban != 'undefined' && douban != null) {
                $('#url').val('https://movie.douban.com/subject/' + douban + "/");
            } else if (imdb != '' && imdb != undefined && imdb != 'undefined' && imdb != null) {
                $('#url').val('https://www.imdb.com/title/tt' + imdb + "/");
            }
            if (poster != 'undefined') $('#url_poster').val(poster);
            if (screenshot != 'undefined') $('#url_vimages').val(screenshot);
            if (mediainfo != 'undefined') $('#Media_BDInfo').val(mediainfo);
            if (description != 'undefined') $('#descr').val(description);
            if (group != 'undefined') $('select[name="team_sel"]').val(group);
            if (anonymous == '1') {
                $('input[name="uplver"]').prop("checked", true);
            }

            if (tags.indexOf('官方') >= 0) {
                $('input[name="internal"]').prop("checked", true);
            }
            if (tags.indexOf('驻站') >= 0) {
                $('input[name="selfrelease"]').prop("checked", true);
            }
            if (tags.indexOf('动画') >= 0) {
                $('input[name="animation"]').prop("checked", true);
            }
            if (tags.indexOf('禁转') >= 0) {
                $('input[name="exclusive"]').prop("checked", true);
            }
            if (tags.indexOf('合集') >= 0) {
                $('input[name="pack"]').prop("checked", true);
            }
            if (tags.indexOf('原生') >= 0) {
                $('input[name="untouched"]').prop("checked", true);
            }
            if (tags.indexOf('自购') >= 0) {
                $('input[name="selfpurchase"]').prop("checked", true);
            }
            if (tags.indexOf('国配') >= 0) {
                $('input[name="mandarin"]').prop("checked", true);
            }
            if (tags.indexOf('中字') >= 0) {
                $('input[name="subtitlezh"]').prop("checked", true);
            }
            if (tags.indexOf('特效') >= 0) {
                $('input[name="subtitlesp"]').prop("checked", true);
            }
            if (tags.indexOf('自译') >= 0) {
                $('input[name="selfcompile"]').prop("checked", true);
            }
            if (tags.indexOf('DoVi') >= 0) {
                $('input[name="dovi"]').prop("checked", true);
            }
            if (tags.indexOf('HDR10') >= 0) {
                $('input[name="hdr10"]').prop("checked", true);
            }
            if (tags.indexOf('HDR10+') >= 0) {
                $('input[name="hdr10plus"]').prop("checked", true);
            }
            if (tags.indexOf('菁彩HDR') >= 0) {
                $('input[name="hdrvivid"]').prop("checked", true);
            }
            if (tags.indexOf('HLG') >= 0) {
                $('input[name="hlg"]').prop("checked", true);
            }
            if (tags.indexOf('CC') >= 0) {
                $('input[name="cc"]').prop("checked", true);
            }
            if (tags.indexOf('3D') >= 0) {
                $('input[name="3d"]').prop("checked", true);
            }
            if (tags.indexOf('已取代') >= 0) {
                $('input[name="superseded"]').prop("checked", true);
            }
            if (tags.indexOf('应求') >= 0) {
                $('input[name="request"]').prop("checked", true);
            }
            if (tags.indexOf('活动') >= 0) {
                $('input[name="contest"]').prop("checked", true);
            }
        }
    }
})();