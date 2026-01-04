// ==UserScript==
// @name         NGA原神心海动图
// @namespace    https://greasyfork.org/zh-CN/scripts/440329-nga%E5%8E%9F%E7%A5%9Eac%E5%A8%98%E8%A1%A8%E6%83%85
// @version      1.0.1
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将 小鱼点点点@米游社 制作的原神心海表情加入到NGA表情列表中
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
// @downloadURL https://update.greasyfork.org/scripts/470967/NGA%E5%8E%9F%E7%A5%9E%E5%BF%83%E6%B5%B7%E5%8A%A8%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/470967/NGA%E5%8E%9F%E7%A5%9E%E5%BF%83%E6%B5%B7%E5%8A%A8%E5%9B%BE.meta.js
// ==/UserScript==

//原作者发布地址：https://www.miyoushe.com/ys/article/31455741
//此脚本发布地址：https://bbs.nga.cn/read.php?tid=37028264
//本脚本由间桐咕哒子@NGA（http://bbs.ngacn.cc/read.php?tid=11275553）上修改而来
//原作者地址：https://greasyfork.org/zh-CN/scripts/28491
//原作者链接：https://greasyfork.org/zh-CN/users/102500-aglandy

(function(){
    function init($){
        let demoNGAKokomi = commonui.kokomiNGA = {
            data: [
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-2eu5Z1oT1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-ac81Z1lT1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-fkqaZ1nT1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-5wwoZ23T1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-pnkZ1rT1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-3mimZ1yT1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-b0sZ23T1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-gvzvZ20T1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-8m7jZ23T1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-43keZ22T1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-a8i6Z22T1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-j0arZ1tT1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-fktbZ20T1kS74-2v.gif',
                'https://img.nga.178.com/attachments/mon_202307/16/axsgQ2s-kk42Z22T1kS74-2v.gif',
                // NGA原神ac娘的地址
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoNGAKokomi.data, function(i, picURL){
                        imgs.append('<img height="60px" src="' + picURL + '" onclick="postfunc.addText(\'[img]' + picURL + '[/img]\');postfunc.selectSmilesw._.hide()" style="margin:5px"/>');
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
                $('[title="插入表情"]:not([Kokomi])').attr('Kokomi', 1).bind('click.kokomiNGAAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("心海表情包")))').append('<button class="block_txt_big">心海表情包</button>').find(':contains("心海表情包")').bind('click.kokomiNGABtn', demoNGAKokomi.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoNGAKokomi.addBtn();
            })
        };

        demoNGAKokomi.addBtn();

        demoNGAKokomi.putInBtn.observe($('body')[0], {
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
