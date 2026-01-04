// ==UserScript==
// @name         NGA支配剧场人偶AC娘表情
// @namespace    https://greasyfork.org/zh-CN/users/916244
// @version      1.0.0
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将NGA 听风抚叶 创作的人偶表情包整合入NGA网页端表情界面
// @author       SunLong_2002
// @include       /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @match        *://ngabbs.com/*
// @match        *://g.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://ngacn.cc/*
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/445257/NGA%E6%94%AF%E9%85%8D%E5%89%A7%E5%9C%BA%E4%BA%BA%E5%81%B6AC%E5%A8%98%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/445257/NGA%E6%94%AF%E9%85%8D%E5%89%A7%E5%9C%BA%E4%BA%BA%E5%81%B6AC%E5%A8%98%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

//本脚本基于NGA 间桐咕哒子（http://bbs.ngacn.cc/read.php?tid=11275553）、NGA 吾律心尘（https://bbs.nga.cn/read.php?tid=30740157）的脚本经过部分修改而来
//表情包来源 https://ngabbs.com/read.php?tid=31887636
//原脚本链接 https://greasyfork.org/zh-CN/scripts/28491-nga-ac%E5%A8%98%E8%A1%A8%E6%83%85fgo%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92-by-%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90-nga
//脚本原作者 https://greasyfork.org/zh-CN/users/102500-aglandy
 
(function(){
    function init($){
        let demoNGARenou = commonui.acRenouNGA = {
            data: [
                'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-g8ttK5T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-fz36K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-gnvgK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-gp2fK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-3doeK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-3gz6K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-3qppK7T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-457pK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQ0-gqndK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQ0-aqayK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQ0-b6k5K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQ6f40-7fz7K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQ6f40-8kwiK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQsn40-jjplK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/13/mfQsn40-js57K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-a27pK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-ap7qK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-axo8K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-c5whK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-i3ikK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-hjj9K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-hendK7T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-dbjxK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-d8v3K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-3tldK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-3my3K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-kj39K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-cdvK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-gpnyK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-hx58K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/16/mfQjgh-fybdK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/16/mfQjgh-ihg3K5T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/16/mfQshkw-boafK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/16/mfQshkw-bnw4K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/16/mfQjgh-475wK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/16/mfQjgh-fjr0K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/16/mfQ8nc3-dmc4K6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/16/mfQ8nc3-diflK6T8S3a-3a.jpg',
                'https://img.nga.178.com/attachments/mon_202205/17/mfQnbbn-649dK6T8S3a-3a.jpg',
                // 以上对应NGA人偶AC娘的地址
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoNGARenou.data, function(i, picURL){
                        imgs.append('<img height="60px" src="' + picURL + '" onclick="postfunc.addText(\'[img]' + picURL + '[/img]\');postfunc.selectSmilesw._.hide()" />');
                    });
                $.each(bodyTom, function(i, thisK){
                    if(i == ngademo.index() - 1)
                        thisK.style.display = '';
                    else
                        thisK.style.display = 'none';
                });
                ngademo.parent().children().eq(0).html('');
            },
            addBtn: function(){
                $('[title="插入表情"]:not([ac-Renou])').attr('ac-Renou', 1).bind('click.acRenouNGAAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("剧场人偶AC娘")))').append('<button class="block_txt_big">剧场人偶AC娘</button>').find(':contains("剧场人偶AC娘")').bind('click.acRenouNGABtn', demoNGARenou.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoNGARenou.addBtn();
            })
        };
 
        demoNGARenou.addBtn();
 
        demoNGARenou.putInBtn.observe($('body')[0], {
            subtree: true,
            childList: true,
        });
    }
 
    (function check(){
        try{
            init(commonui.userScriptLoader.$);
        }
        catch(e){
            setTimeout(check, 50);
        }
    })();
 
})();
 