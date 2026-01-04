// ==UserScript==
// @name         NGA终焉表情包
// @namespace    https://greasyfork.org/zh-CN/scripts/458790
// @version      0.0.3
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将终焉表情包导入到NGA
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
// @downloadURL https://update.greasyfork.org/scripts/458790/NGA%E7%BB%88%E7%84%89%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/458790/NGA%E7%BB%88%E7%84%89%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

//原作者发布地址：https://bbs.nga.cn/read.php?tid=30739380
//表情包制作者为@miHoYo，版权所属米哈游科技有限公司
//本脚本由间桐咕哒子@NGA（http://bbs.ngacn.cc/read.php?tid=11275553）上修改而来~
//原作者地址：https://greasyfork.org/zh-CN/scripts/28491-nga-ac%E5%A8%98%E8%A1%A8%E6%83%85fgo%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92-by-%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90-nga
//原作者链接：https://greasyfork.org/zh-CN/users/102500-aglandy

(function(){
    function init($){
        let demoNGABBBZhongyan = commonui.acBBBZhongyanNGA = {
            data: [
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-f48dKxToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-jjyKyToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-7rs9KvToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-eovvKwToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-lafyKrToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-6x2qKtToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-dtduKuToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-l62hKzToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-6szcKuToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-ddjmKwToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-eq6iKzToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-82i7K13ToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-kcjcKxToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-go3K19ToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-74j0K10ToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-g14oKmToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-1ae1K11ToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-81i1KlToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-ffddK12ToS4i-4i.png',
                'https://img.nga.178.com/attachments/mon_202301/24/mfQ2r-tnzKxToS4i-4i.png',
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoNGABBBZhongyan.data, function(i, picURL){
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
                $('[title="插入表情"]:not([ac-BBBZhongyan])').attr('ac-BBBZhongyan', 1).bind('click.acBBBZhongyanNGAAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("NGA终焉表情包")))').append('<button class="block_txt_big">NGA终焉表情包</button>').find(':contains("NGA终焉表情包")').bind('click.acBBBZhongyanNGABtn', demoNGABBBZhongyan.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoNGABBBZhongyan.addBtn();
            })
        };

        demoNGABBBZhongyan.addBtn();

        demoNGABBBZhongyan.putInBtn.observe($('body')[0], {
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
