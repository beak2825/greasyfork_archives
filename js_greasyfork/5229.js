// ==UserScript==
// @name        tdu_labo_grouping
// @namespace   tdu
// @include     /https?://www\.mlab\.im\.dendai\.ac\.jp/bthesis2015/StudentDeploy\.jsp$/
// @include     /https?://www\.mlab\.im\.dendai\.ac\.jp/bthesis2015/StudentDeploy\.jsp\?displayOrder=/
// @description 配置希望状況を見やすくします
// @version     1.4
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5229/tdu_labo_grouping.user.js
// @updateURL https://update.greasyfork.org/scripts/5229/tdu_labo_grouping.meta.js
// ==/UserScript==

$(function() {
    var $info = null;
    var curren_group = "";
    var num = 0;
//http://www.mlab.im.dendai.ac.jp/bthesis/bachelor/rss.xml
//https://www.mlab.im.dendai.ac.jp/bthesis/bachelor/rss.xml
//    var filename = '';
//    httpObj = new XMLHttpRequest();
//    httpObj.open('GET',filename,true);
//    httpObj.send(null);
//    httpObj.onreadystatechange = function(){
//        if ( (httpObj.readyState == 4) && (httpObj.status == 200) ){
//            console.log(httpObj.responseText);
//        }
//    }

    var hopelist = [];
    var m = location.href.match(/displayOrder=(.)/);
    var mode = m[1] ? m[1] : 0;
    $.ajax({
        url: 'https://www.mlab.im.dendai.ac.jp/bthesis/bachelor/rss.xml',
        type: 'get',
        dataType: 'xml',
        timeout: 5000,
        success: function(xml, status) {
            if (status === 'success') {
                var row = 0;
                var data = [];
                var nodeName;
                // item の数だけ取得
                $(xml).find('item').each(function() {
                    // 初期化
                    data[row] = {};
                    // 子要素を取得
                    $(this).children().each(function() {
                        // 要素名
                        nodeName = $(this)[0].nodeName;
                        // 初期化
                        data[row][nodeName] = {};
                        // 属性を取得
                        attributes = $(this)[0].attributes;
                        for (var i in attributes) {
                            // 属性名 = 値
                            data[row][nodeName][attributes[i].name] = attributes[i].value;
                        }
                        // コンテンツ
                        data[row][nodeName]['text'] = $(this).text();
                    });
                    row++;
                });
                var regex = /\((.*)\) さんが、「(.*)研究室.*」に登録/;
                for (i in data) {
                    var res = data[i].title.text.match(regex);
                    if (hopelist[res[1]]) {
                        hopelist[res[1]].unshift(res[2]);
                    } else {
                        hopelist[res[1]] = [res[2]];
                    }
                }
            }

            $trs = $('.entry_table tr');
            $head = $trs.splice(0, 1);
            $($head[0]).append('<th>闇</th>');
            $trs.each(function() {
                var name = $(this).children(':nth-child(3)').html();
                // 切れ目
                if (mode != 2 && curren_group != name) {
                    if ($info) {
                        $info.html(to_info_text(curren_group, num, mode));
                        $(this).prev().children('td').css("border-bottom", "dotted 2px");
                    }
                    $(this).before('<tr class="labo-title"><td colspan="4"></td></tr>');
                    $info = $(this).prev();
                    num = 0;
                    curren_group = name;
                }
                var uid = $(this).children(':nth-child(1)').html();
                $(this).append('<td class="yami">' + hopelist[uid].join('>') + '</td>');
                console.log(hopelist[uid]);
                num++;
            });
            $('.yami').css('font-size', '10px');
            $info.html(to_info_text(curren_group, num, mode));
            $(this).prev().children('td').css("border-bottom", "dotted 2px");
        },
        error: function() {
            $('body').prepend('<p style="color: red;">! LaboGroupingをonにするにはhttpsで接続する必要があります !</p>');
        }
    });
});

function to_info_text(name, num, mode) {
    num_max = "竜田 山田 柿崎 森本 森谷".indexOf(name) == -1 ? 12 : 2;
    if (mode == 0) {
        var lib = {'星野': 12, '絹川': 8, '佐々木': 12, '小山': 12, '矢島': 11, '斎藤': 12, '小坂': 8, '中島': 8, '高橋': 12, '鉄谷': 12, '川澄': 4, '増田': 5, '岩井': 11, '竜田': 2, '山田': 2, '柿崎': 2, '森本': 2, '森谷': 2};
        return name + "研: (" + num + "/" + (num_max - lib[name]) + " [" + num_max + "])";
    }
    return name + "研: (" + num + "/" + num_max + ")";
}

