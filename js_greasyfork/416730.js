// ==UserScript==
// @name         S1麻将脸表情 for NGA
// @namespace    https://greasyfork.org/zh-CN/users/558480-tomoemami
// @version      1.1
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将S1麻将脸表情加入到表情列表中
// @author       TomoeMami
// @include       /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @match        *://ngabbs.com/*
// @match        *://g.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://ngacn.cc/*
// @match        *://bbs.nga.cn/*
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/416730/S1%E9%BA%BB%E5%B0%86%E8%84%B8%E8%A1%A8%E6%83%85%20for%20NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/416730/S1%E9%BA%BB%E5%B0%86%E8%84%B8%E8%A1%A8%E6%83%85%20for%20NGA.meta.js
// ==/UserScript==

//本脚本由间桐咕哒子@NGA（http://bbs.ngacn.cc/read.php?tid=11275553）上修改而来~
//原作者地址：https://greasyfork.org/zh-CN/scripts/28491-nga-ac%E5%A8%98%E8%A1%A8%E6%83%85fgo%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92-by-%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90-nga
//原作者链接：https://greasyfork.org/zh-CN/users/102500-aglandy

(function(){
    function init($){
        let demoNGAS1 = commonui.S1NGA = {
            data: [
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-azizK2S1j-10.gif',
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-t4K0Sw-x.png',
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-5drlK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-ar9wK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-73lK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-5huwK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-asncK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-ghg1K1Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-gyv9K0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/05/-zue37Q5-bj1lK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-aefyK8T8S18-18.gif',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-g2b4K5T8S16-u.gif',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-lbcgK2S1j-12.gif',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-54g6K0S12-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-agizK0Sw-y.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-fsjhK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-l8nK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-5t8bK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-b3r5K1Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-gm29K1Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-r4oK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-67uvK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-biafK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-gwozK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-12tpK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-6g74K1S10-x.gif',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-c18jK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-hl9uK1Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-1ocxK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-772mK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-d6uvK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-injlK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-2kenK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-7w3iK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-dc86K0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-im7bK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-2jy8K0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-7vbxK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-d8nmK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-ihgtK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-2xyyK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-85krK2S10-w.gif',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-do95K0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-iwwpK0Sw-w.png',
                'https://img.nga.178.com/attachments/mon_201906/07/-zue37Q5-2vs0K0Sw-w.png'
                // 表情链接
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoNGAS1.data, function(i, picURL){
                        imgs.append('<img src="' + picURL + '" onclick="postfunc.addText(\'[img]' + picURL + '[/img]\');postfunc.selectSmilesw._.hide()" />');
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
                $('[title="插入表情"]:not([ac-S1])').attr('ac-S1', 1).bind('click.S1NGAAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("S1麻将脸")))').append('<button class="block_txt_big">S1麻将脸</button>').find(':contains("S1麻将脸")').bind('click.S1NGABtn', demoNGAS1.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoNGAS1.addBtn();
            })
        };

        demoNGAS1.addBtn();

        demoNGAS1.putInBtn.observe($('body')[0], {
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