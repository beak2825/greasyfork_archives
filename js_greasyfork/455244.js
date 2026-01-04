// ==UserScript==
// @name         NGA蔚蓝档案表情包
// @namespace    https://greasyfork.org/zh-CN/scripts/440329-nga%E5%8E%9F%E7%A5%9Eac%E5%A8%98%E8%A1%A8%E6%83%85
// @version      2.0
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将 Ballance平衡球 制作的汉化BA表情加入到表情列表中
// @author       WLXC
// @include       /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @match        *://ngabbs.com/*
// @match        *://g.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://ngacn.cc/*
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/455244/NGA%E8%94%9A%E8%93%9D%E6%A1%A3%E6%A1%88%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/455244/NGA%E8%94%9A%E8%93%9D%E6%A1%A3%E6%A1%88%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

//原作者发布地址：https://bbs.nga.cn/read.php?tid=30739380
//此脚本发布地址：https://bbs.nga.cn/read.php?tid=30740157
//本脚本由间桐咕哒子@NGA（http://bbs.ngacn.cc/read.php?tid=11275553）及原神版表情包上修改而来~
//原作者地址：https://greasyfork.org/zh-CN/scripts/28491-nga-ac%E5%A8%98%E8%A1%A8%E6%83%85fgo%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92-by-%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90-nga
//原作者链接：https://greasyfork.org/zh-CN/users/102500-aglandy

(function(){
    function init($){
        let demoNGABA = commonui.acBANGA = {
            data: [
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-fwhhKiToS2s-39.png',//锌
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-kqaKjToS2s-2s.png',//亚子
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-6setKjToS2s-2s.png',//亚丝娜
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-cut7KjToS2s-3h.png',//修女
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-ixnjKiToS2s-2s.png',//小夏
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-4iyfKiToS2s-2s.png',//小狐狸
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-bcqlKjToS2s-2s.png',//若藻
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-hxmoKjToS2s-2s.png',//琴里
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-2rv2KiToS2s-36.png',//女仆
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-94tnKnToS2s-2s.png',//尼禄
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-g34iKkToS2s-39.png',//莲实
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-1ju1KjToS2s-2s.png',//谢谢
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-8hhtKiToS2s-2s.png',//黑猫
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-f7ihKfT8S2s-2s.png',//和香
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-h4dKhToS2s-2s.png',//汉堡
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-6r9aKgT8S2s-2s.png',//风香
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-d396KkToS2s-2s.png',//菲娜
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-kb9KfT8S2s-2s.png',//巴
                'https://img.nga.178.com/attachments/mon_202211/21/-10yuu8Q187-6kxbKgT8S2s-2s.png',//nonomi
                // NGA蔚蓝档案表情包的地址
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoNGABA.data, function(i, picURL){
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
                $('[title="插入表情"]:not([ac-BA])').attr('ac-BA', 1).bind('click.acBANGAAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("蔚蓝档案表情包")))').append('<button class="block_txt_big">蔚蓝档案表情包</button>').find(':contains("蔚蓝档案表情包")').bind('click.acBANGABtn', demoNGABA.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoNGABA.addBtn();
            })
        };

        demoNGABA.addBtn();

        demoNGABA.putInBtn.observe($('body')[0], {
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