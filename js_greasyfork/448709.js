// ==UserScript==
// @name         BYRBT Autofill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  One click to fill information.
// @author       t3x4
// @license      MIT
// @match        https://byr.pt/*
// @icon         https://byr.pt/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448709/BYRBT%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/448709/BYRBT%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.match(/(upload|edit)\.php/)){
        var input_1 = $("<input>");
        input_1.attr({
            "type":"button",
            "name":"autoFill",
            "value":"复制简介到Bangumi输入框, 然后click",
            "style":"font-size: 11px; margin-right: 3px",
        });
        $('#compose input[name="bgmtv_url"]').after(input_1);

        input_1.click(function(){
            var text = $('#compose input[name="bgmtv_url"]')[0].value;
            if (text.match("◎")){
                $("input[name='url']").val(text.match(/(?<=IMDb\s*链接\s\s+).*?(?=\s◎)/));
                $("input[name='dburl']").val(text.match(/(?<=豆瓣链接\s).*?(?=\s◎)/));
            }

            //Film
            if(window.location.href.match(/408/)){
                if(text.match(/产\s*地\s*中国大陆/)){
                     $("input[name='movie_cname']").val(text.match(/(?<=片\s*名\s).*?(?=◎)/));
                 }
                 else{
                     $("input[name='movie_cname']").val(text.match(/(?<=译\s*名\s).*?(?=◎)/));
                 }
                var movie_cname = $('#compose input[name="movie_cname"]')[0].value.replace(/\s*/g,"");
                $("input[name='movie_cname']").val(movie_cname);

                $("input[name='small_descr']").val(text.match(/导\s*演\s.*?(?=\/)/));
                var small_descr = $('#compose input[name="small_descr"]')[0].value.replace(/导\s*演\s*/g,"导演: ");
                $("input[name='small_descr']").val(small_descr);

                $("input[name='movie_country']").val(text.match(/(?<=产\s*地\s).*?(?=◎)/));
                var movie_country = $('#compose input[name="movie_country"]')[0].value.replace(/\s*/g,"");
                $("input[name='movie_country']").val(movie_country);

                $("input[name='movie_type']").val(text.match(/(?<=类\s*别\s).*?(?=◎)/));
                var movie_type = $('#compose input[name="movie_type"]')[0].value.replace(/\s*/g,"");
                $("input[name='movie_type']").val(movie_type);
            }

            //TV Series
            if(window.location.href.match(/401/)){
                var country = text.match(/(?<=产\s*地\s).*?(?=\/)/).toString();

                if (country.match('大陆')){
                    $("input[name='tv_type']").val("大陆");
                }
                else if (country.match('香港|台湾')){
                    $("input[name='tv_type']").val("港台");
                }
                else if (country.match('日本|韩国')){
                    $("input[name='tv_type']").val("日韩");
                }
                else if (country.match('美国|加拿大|法国|荷兰|比利时|卢森堡|瑞士|列支敦斯登|奥地利|\
                                        摩纳哥|德国|波兰|匈牙利|斯洛伐克|捷克|保加利亚|罗马尼亚|俄罗斯|\
                                        乌克兰|白俄罗斯|摩尔多瓦|英国|丹麦|挪威|冰岛|芬兰|瑞典|立陶宛|\
                                        拉脱维亚|爱沙尼亚|爱尔兰|葡萄牙|西班牙|希腊|意大利|梵蒂冈|安道尔|\
                                        北马其顿|圣马力诺|马尔他|斯洛维尼亚|克罗地亚|波黑|蒙特内哥罗|\
                                        塞尔维亚|阿尔巴尼亚')){
                    $("input[name='tv_type']").val("欧美");
                }
                else{
                    $("input[name='tv_type']").val("其他");
                }

                if(text.match(/产\s*地\s*中国大陆/)){
                     $("input[name='cname']").val(text.match(/(?<=片\s*名\s).*?(?=◎)/));
                 }
                 else{
                     $("input[name='cname']").val(text.match(/(?<=译\s*名\s).*?(?=◎)/));
                 }
                var cname = $('#compose input[name="cname"]')[0].value.replace(/\s*/g,"");
                $("input[name='cname']").val(cname.split('/')[0]);

                $("input[name='tv_filetype']").val("MKV");
                $("input[name='tv_season']").val("S0?");
                $("input[name='small_descr']").val("全?集");
            }

            $("input[name='bgmtv_url']").val("");
        });
    }
})();