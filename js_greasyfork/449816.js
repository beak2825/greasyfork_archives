// ==UserScript==
// @name         爱恋动漫BT下载快速获取磁链 只需双击特征码即可
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  爱恋脚本快速获取磁链 只需要双击特征码即可
// @author       __Kirie__
// @match        https://www.kisssub.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kisssub.org
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449816/%E7%88%B1%E6%81%8B%E5%8A%A8%E6%BC%ABBT%E4%B8%8B%E8%BD%BD%E5%BF%AB%E9%80%9F%E8%8E%B7%E5%8F%96%E7%A3%81%E9%93%BE%20%E5%8F%AA%E9%9C%80%E5%8F%8C%E5%87%BB%E7%89%B9%E5%BE%81%E7%A0%81%E5%8D%B3%E5%8F%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/449816/%E7%88%B1%E6%81%8B%E5%8A%A8%E6%BC%ABBT%E4%B8%8B%E8%BD%BD%E5%BF%AB%E9%80%9F%E8%8E%B7%E5%8F%96%E7%A3%81%E9%93%BE%20%E5%8F%AA%E9%9C%80%E5%8F%8C%E5%87%BB%E7%89%B9%E5%BE%81%E7%A0%81%E5%8D%B3%E5%8F%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const log = console.log;

    $(document).ready(function() {

        $('.gg_canvas-hidden').hide();
        GM_addStyle(`
            .magnet:hover {
                color:black;
            }
        `);

        // console.log($('#data_list')[0]);
        if($('#data_list')[0] != undefined) {
            // console.log($('#data_list').children().length);
            // console.log($('#listTable .tcat').children());
            var cat_tr = $('#listTable .tcat').children();

            var nele = `<th axis="string" style="color:black;cursor:pointer;">磁链</th>`;
            $(cat_tr).append(nele);


            for(var i = 0;i < $('#data_list').children().length;i++) {

                var tr = $('#data_list').children()[i];
                var tr_a = $($(tr).children()[2]).children()[0];
                var tr_a_href = $(tr_a).attr('href');
                // console.log(tr_a_href);
                var tr_a_href_magnet = tr_a_href.match(/(?<=show-).*(?=.html)/);
                var ele = `<td><a href="magnet:?xt=urn:btih:${tr_a_href_magnet}">下载</a></td>`;
                $($('#data_list').children()[i]).append(ele);
            }
        }


        $('#text_hash_id').on('dblclick',function() {
            var oldtext = $('#text_hash_id').text();

            var fcreg = /(?<=特征码：).*/;
            var fcode = oldtext.match(fcreg);
            // log(fcode);
            if(fcode != null) {
                var dot = '.';
                var n = 0;
                var dotL = '';
                var mytimer = setInterval(function(){
                    dotL = multiStr(dot,n);
                    $('#text_hash_id').text(`，正在查询磁链请稍等一会儿 马上就好${dotL}`);
                    n = (n+1)%7;
                },200);
                
                fc(fcode[0]).then(function(value){
                    clearInterval(mytimer);
                    $('#text_hash_id').html(`&nbsp;&nbsp;，磁链🐎：<a class="magnet" href="${value}">${value}</a>`);
                    console.log($('#text_hash_id')[0]);
                    
                });
            }
        });

    });


    function multiStr(singleStr,times) {
        var temp = singleStr;
        if(times == 0) {
            singleStr = '';
        }else if (times == 1) {
            singleStr = temp;
        }else {
            for(var i = 1;i < times;i++) {
                singleStr = singleStr + temp;
            }
        }
        return singleStr;
    }

    async function fc(featureCode) {
        var newurl = 'https://www.kisssub.org/search.php?keyword=' + featureCode;
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: newurl,
                onload: function (res) {
                    if (res.status == 200) {
                        var parse = new DOMParser();
                        var doc = parse.parseFromString(res.response, 'text/html');
                        var btm = doc.querySelector('#btm');
                        var magnet = $(btm).find('.main').find('.content').text();
                        magnet = magnet.match(/.*(?=\s（)/);
                        resolve(magnet);
                        // log($(btm).find('.main').find('.content').text());
                    } else {
                        // log(res);
                    }
                },
                onerror: function (err) {
                    log(err);
                }
            });
        });


    }


    // fc('093d790ad7bd1f2340dc7dd6b39e3cab06539978').then(function(value) {log('success');log(value);});

})();