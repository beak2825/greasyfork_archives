// ==UserScript==
// @license      MIT
// @name         SpringSunday-Quike-Complete
// @namespace    https://springsunday.net/
// @version      1.9.19
// @description  解析豆瓣信息生成副标题
// @author       许仙
// @include     http*://springsunday.net/upload.php*
// @include     http*://springsunday.net/edit.php*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_xmlhttpRequest
// @connect      movie.douban.com
// @downloadURL https://update.greasyfork.org/scripts/406696/SpringSunday-Quike-Complete.user.js
// @updateURL https://update.greasyfork.org/scripts/406696/SpringSunday-Quike-Complete.meta.js
// ==/UserScript==
'use strict';
function checkWordsInName(name, a) {
  // 将 name 和 a 都转换为小写，以避免大小写问题
  name = name.toLowerCase();
  a = a.toLowerCase();
  // 切割字符串 a 为单词数组
  const wordsInA = a.split(' ');

  // 遍历切割后的单词数组，检查每个单词是否都在 name 中出现
  for (const word of wordsInA) {
    if (name.indexOf(word) === -1) {
      return false;
    }
  }
  return true;
}

$('#url').css('width', 'calc(100% - 70px)');
$('#url').after('<input type="button" id="douban_btn" class="btn" style="width: 60px" value="解析">');

$('#douban_btn').click(function() {
    var name = $('input[name="name"]').val();
    const doubanId = $('#url').val().match(/douban\.com\/subject\/(\d+)/)[1];
    var eptext;
    if (name.indexOf('WEB-DL') >= 0) {
        var eptextmatch =  name.match(/Complete|EP?\d+(-EP?\d+)?|S\d{2}E?P?\d+(-S\d{2}E?P?\d+)?/);
        if (eptextmatch && eptextmatch.length > 0) {
            eptext = eptextmatch[0];
        }
    }
    console.log(eptext);

    var is1080p = 0;
    if (name.indexOf('.1080p.') >= 0 || name.indexOf('.1080P.') >= 0) {
        is1080p = 1;
    }

    var is4K = 0;
    if (name.indexOf('.4K.') >= 0 || name.indexOf('.2160p.') >= 0 || name.indexOf('.2160P.') >= 0 || name.indexOf('.4k.') >= 0) {
        is4K = 1;
    }

    var ishdr10 = 0;
    if (name.indexOf('.HDR10.') >= 0) {
        ishdr10 = 1;
    }

    var ishdr10p = 0;
    if (name.indexOf('.HDR10+.') >= 0) {
        ishdr10p = 1;
    }

    var isHLG = 0;
    if (name.indexOf('.HLG.') >= 0) {
        isHLG = 1;
    }

    var isHDRVivid = 0;
    if (name.indexOf('.HDR.Vivid') >= 0) {
        isHDRVivid = 1;
    }
    var isDV = 0;
    if (name.indexOf('.Dolby.Vision.') >= 0) {
        isDV = 1;
    }

    var fps_group = name.match(/\.(\d+)Fps\./i);
    var fps;
    if (fps_group && fps_group.length > 1) {
        fps = fps_group[1];
    }

    if (!doubanId)
        return;

    var title = '', director = '', casts = '';
    var ep;

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://movie.douban.com/subject/' + doubanId + '/',
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        onload: function(response) {
            var html = $.parseHTML(response.responseText);

            var douban_title = $(html).find('#content h1 span[property="v:itemreviewed"]').text().split(' ')[0].trim();
            console.log(douban_title);
            var douban_directors = [];
            $(html).find('#info span.attrs a[rel="v:directedBy"]').each(function () {
                douban_directors.push($(this).text());
            });

            var douban_actors = [];
            $(html).find('#info span.attrs a[rel="v:starring"]').each(function () {
                douban_actors.push($(this).text());
            });

            var isshow = 0;
            var isdoc = 0;
            var isani = 0;
            var iscomplete = eptext == undefined || eptext == '' || eptext.indexOf('Complete') >= 0;

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

            console.log(result);

            if (type == '电视剧') {
                var douban_episodes_count = result[2][0];
                if (iscomplete) {
                    if (isshow) {
                        ep = "全" +douban_episodes_count + "期";
                    } else {
                        ep = "全" +douban_episodes_count + "集";
                    }
                } else {
                    var episodes = eptext.replace(/S\d+/g, "").replace(/Ep/g, "").replace(/E/g, "").replace(/\./g, "");
                    if (isshow) {
                        ep = "第" +episodes + "期";
                    } else {
                        ep = "第" +episodes + "集";
                    }
                }
            }

            title = douban_title;
            var othernames = [];
            if (/tt\d+/g.test(result[result.length - 1][0])) {
                othernames = result[result.length - 2];
            } else {
                othernames = result[result.length - 1];
            }
            $(othernames).each(function(index, element) {
                if (index < 4 && !/\d+分钟/.test(element) && !checkWordsInName(name,element) && element != '汉语普通话') {
                    title += '/';
                    title += element;
                }
            })

            if (douban_directors) {
                $(douban_directors).each(function(index, element) {
                    if (index != 0)
                        director += ' ';
                    director += element;
                })
            }
            if (douban_actors) {
                $(douban_actors).each(function(index, element) {
                    if (type == '电视剧') {
                        if (index < 4) {
                            if (index != 0)
                                casts += ' ';
                            casts += element;
                        }
                    } else {
                        if (index < 2) {
                            if (index != 0)
                                casts += ' ';
                            casts += element;
                        }
                    }
                })
            }


            var country = result[0][0];

            // 地区判定
            if (country == '中国大陆') {
                $('select[name="source_sel"]').val(1);
            } else if (country == '中国香港') {
                $('select[name="source_sel"]').val(2);
            } else if (country == '中国台湾') {
                $('select[name="source_sel"]').val(3);
            } else if (country == '印度') {
                $('select[name="source_sel"]').val(7);
            }  else if (country == '日本') {
                $('select[name="source_sel"]').val(5);
            } else if (country == '韩国') {
                $('select[name="source_sel"]').val(6);
            } else if (country == '泰国') {
                $('select[name="source_sel"]').val(9);
            } else if (country == '美国' || country == '英国' || country == '法国' || country == '德国' || country == '西德' || country == '波兰' || country == '意大利' || country == '西班牙'
                           || country == '加拿大' || country == '爱尔兰' || country == '瑞典' || country == '巴西' || country == '丹麦' || country == '奥地利') {
                $('select[name="source_sel"]').val(4);
            } else if (country == '苏联' || country == '俄罗斯') {
                $('select[name="source_sel"]').val(8);
            } else {
                $('select[name="source_sel"]').val(99);
            }

            // 发布组选择
            if (name.indexOf('CMCTV') >= 0) {
                $('select[name="team_sel"]').val(9);
                $('input[name="exclusive"]').prop('checked', true);
                $('input[name="uplver"]').prop('checked', true);
                $('input[name="internal"]').prop('checked', true);
            } else if (name.indexOf('CMCTA') >= 0) {
                $('select[name="team_sel"]').val(8);
                $('input[name="internal"]').prop('checked', true);
            } else if (name.indexOf('CMCT') >= 0) {
                $('select[name="team_sel"]').val(1);
                $('input[name="internal"]').prop('checked', true);
            } else {
                $('select[name="team_sel"]').val(0);
            }

            if (type == '电视剧') {
                if (isshow) {
                    $('select[name="type"]').val(505);
                } else if (isdoc) {
                    $('select[name="type"]').val(503);
                } else {
                    $('select[name="type"]').val(502);
                }
            } else {
                if (isdoc) {
                    $('select[name="type"]').val(503);
                } else {
                    $('select[name="type"]').val(501);
                }
            }

            if (type == '电视剧') {
                // 是否合集
                if (iscomplete) {
                    $('input[name="pack"]').prop('checked', true);
                } else {
                    $('input[name="pack"]').prop('checked', false);
                }

                if (country == '中国大陆') {
                    $('input[name="small_descr"]').val(title + ' | ' + ep + ' | 导演: ' + director + ' | 主演: ' + casts + ' [国语/中字]');
                    $('input[name="subtitlezh"]').prop('checked', true);
                } else {
                    $('input[name="small_descr"]').val(title + ' | ' + ep + ' | 导演: ' + director + ' | 主演: ' + casts);
                }
            } else {
                if (country.indexOf('中国') >= 0) {
                    $('input[name="small_descr"]').val(title + ' | 导演: ' + director + ' | 主演: ' + casts + ' [国语/中字]');
                    $('input[name="subtitlezh"]').prop('checked', true);
                } else {
                    $('input[name="small_descr"]').val(title + ' | 导演: ' + director + ' | 主演: ' + casts);
                }
            }

            if (isani) {
                $('input[name="animation"]').prop('checked', true);
            }

            if (is1080p) {
                if (fps) {
                    var text = ' [';
                    text += fps + 'FPS';
                    if (ishdr10) {
                    text += ' HDR10版]';
                    }else if (ishdr10p) {
                        text += ' HDR10+版]';
                    }else if (isHLG) {
                        text += ' HLG版]';
                    }else{
                        text += '版]';
                    }
                } else {
                    text = ' ';
                    if (ishdr10) {
                        text += '[HDR10版]';
                    }
                    if (ishdr10p) {
                        text += '[HDR10+版]';
                    }
                    if (isHLG) {
                        text += '[HLG版]';
                    }
                }
                $('input[name="small_descr"]').val($('input[name="small_descr"]').val() + text);
            }

            if (is4K) {
                text = ' [4K';
                if (fps) {
                    text += fps + 'FPS';
                }
                if (ishdr10) {
                    text += ' HDR10';
                }
                if (ishdr10p) {
                    text += ' HDR10+';
                }
                if (isHLG) {
                    text += ' HLG';
                }
                if (name.indexOf('.HQ.') >= 0) {
                    text += ' HQ';
                }
                if (name.indexOf('.EDR.') >= 0) {
                    text += '高码';
                }
                text += '版]'
                $('input[name="small_descr"]').val($('input[name="small_descr"]').val() + text);
            }

            if (isHDRVivid) {
                $('input[name="small_descr"]').val($('input[name="small_descr"]').val() + ' *菁彩HDR*');
            }

            if (isDV) {
                $('input[name="small_descr"]').val($('input[name="small_descr"]').val() + ' *杜比视界*');
            }
        }
    });
});