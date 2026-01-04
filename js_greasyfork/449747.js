// ==UserScript==
// @name         You Porn 自动翻页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 you porn 网站上智能翻页 免除点击下一页的烦恼
// @author       __Kirie__
// @match        https://*.com:58002/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rgvib6a7mvfhs.com
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449747/You%20Porn%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/449747/You%20Porn%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const log = console.log;
    // judge the next page is exist or not exist
    if($('.stui-page').length == 1) {

        $('.stui-vodlist__thumb').attr('target','_blank');
        var nextpageurl = $('.stui-page').children()[$('.stui-page').children().length - 2].children[0].href;
        var pagereg = /(?<=page\/)\d(?=.html)/;
        var pagenum = parseInt(nextpageurl.match(pagereg)[0]);
        // log($('.stui-page').children()[$('.stui-page').children().length - 2].children[0].href);
        // log(pagenum);
        // log(nextpageurl.replace(/(?<=page\/)\d(?=.html)/,pagenum+1));


        var interob = new IntersectionObserver(function(e) {

            if(e[0].isIntersecting) {
                // if page button on my eye
                // log(pagenum);
                var newurl = nextpageurl.replace(/(?<=page\/)\d(?=.html)/,pagenum);
                GM_xmlhttpRequest({
                    method:'GET',
                    url:newurl,
                    onload:function(res) {
                        // log(res);
                        if(res.status == 200) {
                            var width = $('.stui-pannel_bd').width();
                            // log(width);
                            var ele = `
                                <div style="width:${width}px;height:30px;text-align:center;line-height:30px;border:solid skyblue 2px;border-radius:10px">第${pagenum}页</div>
                            `;
                            $('.stui-pannel_bd').append(ele);

                            // console.log(res.response);
                            var parse = new DOMParser();
                            var doc = parse.parseFromString(res.response,'text/html');
                            // log(doc);

                            var content = doc.querySelector('.stui-vodlist');
                            // log(content);

                            // log($(content).find('.stui-vodlist__thumb'));
                            $(content).find('.stui-vodlist__thumb').attr('target','_blank');

                            //delete three d
                            var reg3d = /.*3D.*/;
                            var label = new Array();
                            log($(content).find('.stui-vodlist__box').length);
                            for(var m = 0;m < $(content).find('.stui-vodlist__box').length;m++) {
                                // log($('.stui-vodlist__box')[m].children[0].getAttribute('title'));
                                if(reg3d.test($(content).find('.stui-vodlist__box')[m].children[0].getAttribute('title'))) {
                                    label.push(m);
                                }
                            }
                            for(var p = 0;p < label.length;p++) {
                                // log($($('.stui-vodlist__box')[label[p]]).parent());
                                $($(content).find('.stui-vodlist__box')[label[p]]).parent().addClass('willdelete');
                            }
                            $(content).find('.willdelete').remove();


                            $('.stui-pannel_bd').append(content);
                            pagenum = pagenum + 1;
                        }else {

                        }
                        
                    }
                });
                
            }else {

            }
        });
        interob.observe($('.stui-page')[0]);



        log('----------------------------------------');


    }


})();