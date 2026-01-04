// ==UserScript==
// @name         NGA原神官方表情
// @namespace    https://greasyfork.org/zh-CN/scripts/471800
// @version      1.0.4
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将米游社的原神表情加入到NGA表情列表中
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
// @downloadURL https://update.greasyfork.org/scripts/471800/NGA%E5%8E%9F%E7%A5%9E%E5%AE%98%E6%96%B9%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/471800/NGA%E5%8E%9F%E7%A5%9E%E5%AE%98%E6%96%B9%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

//此脚本发布地址：https://bbs.nga.cn/read.php?tid=37154882
//本脚本由间桐咕哒子@NGA（http://bbs.ngacn.cc/read.php?tid=11275553）上修改而来
//原作者地址：https://greasyfork.org/zh-CN/scripts/28491
//原作者链接：https://greasyfork.org/zh-CN/users/102500-aglandy

(function(){
    function init($){
        let demoGenshinOfficalv1 = commonui.GenshinOffical = {
            data: [
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4fgsK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gwn9K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8igaKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kvyjKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-bdjfKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2xt1KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-fnhjKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-awvpKwToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2bw2KyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kznzK13ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-bxloKsToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-k3vKzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8wrpK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-l5keK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-80oyK12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kae8KcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-b911K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-212tKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-avnnKxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4w3oKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hv0wK8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-45s5KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gbfaKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7128K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-j7uhK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-a4z1KpToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-38yfKyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-fpq8KyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-6snnK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-157jK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-dfofK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-haz7KfToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8f35KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-lbw1K7ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-fb57KcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-6955KcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-j4w6KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-dd5cKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-55o6KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-iq0qKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-al1bKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-221vKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-el55K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-6t49KcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-efl1KdToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-n8lKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8ansK18ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gx79K8ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8e34K15ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-3g0KwToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-chg0K13ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-6cxlK12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-jccjKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-efazKqToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-534mK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-k3q8K8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-b55rKxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1zbaK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-e71yK8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-517mKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hfbuK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7zfeK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-31wkK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-fzdxK12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-71gnK14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-k1xjK8ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-bgzcK7ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1sljKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-j0dbK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-9g3nK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1q38K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-dazlK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kucK8ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8koxK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-khaoK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-b9qkKtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1lnxK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-bmtjKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4r8rK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hpkeKxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8742KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-h0pkKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7jmiK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ju02KqToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-b91hK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1okkKwToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-dc9dKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4gdeKvToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-krj7KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-c4wqKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-3utiKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-cct0KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-3035KcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-boifKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-j6zlKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-aosxKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-jumiK14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-bu7hK17ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4eyiK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gq6cK10ToS40-40.png',
                // NGA原神官方表情的地址
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoGenshinOfficalv1.data, function(i, picURL){
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
                $('[title="插入表情"]:not([GenshinOfficalv1])').attr('GenshinOfficalv1', 1).bind('click.GenshinOfficalAddBtnv1', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("原神表情包(v1)")))').append('<button class="block_txt_big">原神表情包(v1)</button>').find(':contains("原神表情包(v1)")').bind('click.GenshinOfficalBtnv1', demoGenshinOfficalv1.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoGenshinOfficalv1.addBtn();
            })
        };
        let demoGenshinOfficalv2 = commonui.GenshinOffical = {
            data: [
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-3nahK19ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gla4K7ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-841tKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-jz1nKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7bkzKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ji3iK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-blf8K12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2fn8K10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hry3K11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8q00KpToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gfhfKmToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7xkkKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-iz5hKnToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-536rKlToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-h8c7KmToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4nciKoToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hau3KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-908fK12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8u5KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-9mwfKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-5sdK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8xj5KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-v3K7ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-cbpmK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kb3eK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-54soK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-i1irK13ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-9uf8K12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-xgoK14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-dlzxK12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4cktKzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-go98K8ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-85s9KdToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1zuKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ijwzKdToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-acacKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1zdqKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-e80qKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-5bgtKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hosdK8ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-cre4K9ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-3j9hKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gnxyKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-boe6K8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2ngaKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-et8zKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-6kjtK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-j7r8KcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-a3ibKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-rvjKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-cvrrKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-3r0cKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kolhKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-cv6oKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4h4KyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-chf4KzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-39tuK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-fop0K15ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7am7KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kjpnKxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-bvc2KzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2232KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-a131KtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-i5sqKyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4f7sKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-c8guK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-37g0KxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gh4jKwToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-73p9KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-k0r8KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-awcgKxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2g01KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-herwKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-84udK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-18c8KwToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-e8d9KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7l9KzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7ouyKyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-jqn5KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-adlmK8ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-xyrK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-g8ccKuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-9j2pKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gjvKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ckufK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-l22rKaToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-6yhcK9ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-jkhxK8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-c0l0K11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kxwoK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ckjwKuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4gaqKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hh2cKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-98bwKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-g17KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-daxvKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-42h6K8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-k3rqKtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-d9m0KwToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4u7pK1bToS40-40.png',
                // NGA原神官方表情的地址
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoGenshinOfficalv2.data, function(i, picURL){
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
                $('[title="插入表情"]:not([GenshinOfficalv2])').attr('GenshinOfficalv2', 1).bind('click.GenshinOfficalAddBtnv2', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("原神表情包(v2)")))').append('<button class="block_txt_big">原神表情包(v2)</button>').find(':contains("原神表情包(v2)")').bind('click.GenshinOfficalBtnv2', demoGenshinOfficalv2.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoGenshinOfficalv2.addBtn();
            })
        };
        let demoGenshinOfficalv3 = commonui.GenshinOffical = {
            data: [
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-diu7KqToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4pycKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-d59eKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4505KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gl85KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7svnK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-3ffK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-82dvK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-fyxjKvToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ctsvKzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7wk4KzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-lbbbK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-de9wK12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-50kqK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-dylsKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-928aKyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ao2K11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-cys0K13ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-536uKxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-fkcgK12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1zjhKuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-fk2eK12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-a5y8K13ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1cwsKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-a1wqK15ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-is5cKeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-9mkmKeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hq3vKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8bu3KcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-jrykK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-aotvKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-jbecKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-5o2pKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-dlh5KdToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4h7sKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ch9bKqToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-k99oKpToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ct1uKrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kpmdKvToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ci4kKnToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-6nvpKrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-k93gK14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-bhmxK14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2s57KmToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-jm9zK14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-by8zK17ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-334oKfToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-fqe1KeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-928kKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-48qKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-dz8wKuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-4ugiKsToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ir3mKtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-9na1KtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-lpiKxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-cvo3KvToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-3veqKtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gs74KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8ffcKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-33cbKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ffodKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-696dKuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-iiz3K13ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-9ip5KzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-occKuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-e7yeK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-5ks0K10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hl6uKuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-axdhKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2k6kKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ais2K8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-6ogpKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-jlcyKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-b7k4K8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2ad5K14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-e5b6KyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-57qdKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1slyK14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ab7jKwToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ia5qK8ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8xywKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-gw55KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8hkhKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-lcklKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-cby4K11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-5x0mK14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-iz48K12ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-byvvK18ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-303rK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-ge13K15ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-7cy7K10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-1cghKzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-dtxrK16ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-5gy3KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hq6bKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-9cf0KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-2wq4KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-hotcKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-8jwjKsToS40-40.png',
'https://img.nga.178.com/attachments/mon_202307/27/-11c8ltQ2s-kwahKbToS40-40.png',
                // NGA原神官方表情的地址
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoGenshinOfficalv3.data, function(i, picURL){
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
                $('[title="插入表情"]:not([GenshinOfficalv3])').attr('GenshinOfficalv3', 1).bind('click.GenshinOfficalAddBtnv3', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("原神表情包(v3)")))').append('<button class="block_txt_big">原神表情包(v3)</button>').find(':contains("原神表情包(v3)")').bind('click.GenshinOfficalBtnv3', demoGenshinOfficalv3.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoGenshinOfficalv3.addBtn();
            })
        };
        let demoGenshinOfficalv4 = commonui.GenshinOffical = {
            data: [
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-9nk8KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-nfqKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7y98KfToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-jn3zKeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-9h5xKeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8goKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-bl2kK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-1qc5KfToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-dd7eKeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-3hkfKeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-jyzrKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-5gv0K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-grjdKeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6ox7KeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-i9l0KeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-4leiKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-bkwjKnToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-1efmKmToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8ansKnToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-ju6qKnToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-59j1KoToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-c2zgKqToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-leziKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6u8wKtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-dyvbKtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-40qjKsToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-fm1wKvToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8v41KtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-kl0lK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-bqj2KtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-1w8oKvToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-eab8KrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6s8hKrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-j8s8KtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-cczaKrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-5vp5KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-hmlpK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-9aifKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-l2kaKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-beifKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-2kn7KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-f241KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-5mjiKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-jfapZ1fT3cSrd-rd.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-fyryKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-66fhK15ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-hy3aKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-830jK17ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-kmiyKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-ari1K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-2mdrKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-eezpK10ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-4nhwK13ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-idopKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-94dlK8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-khwzK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-aufcK14ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-5acvK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-gsswKyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6t29KzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-id78KzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8iqlK1gToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-tb8KyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-cdduKzToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6d2qK9ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-hy3iKuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-832yK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-jo7vKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-9skmKrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-ld4tKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-bifqKsToS40-40.png',

                // NGA原神官方表情的地址
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoGenshinOfficalv4.data, function(i, picURL){
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
                $('[title="插入表情"]:not([GenshinOfficalv4])').attr('GenshinOfficalv4', 1).bind('click.GenshinOfficalAddBtnv4', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("原神表情包(v4)")))').append('<button class="block_txt_big">原神表情包(v4)</button>').find(':contains("原神表情包(v4)")').bind('click.GenshinOfficalBtnv4', demoGenshinOfficalv4.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoGenshinOfficalv4.addBtn();
            })
        };
        let demoGenshinOfficalv5 = commonui.GenshinOffical = {
            data: [
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-5780KyToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-gvstK15ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-70weK18ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-ilbjK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8q45KdToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-kb6pK11ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-ibyfK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-9bb3KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-yn8KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-ddqqKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-3igjK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-ev7vK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-62e5KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-hg95K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8gisKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-5bbaK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-h2kvKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8bedKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-kunlKxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-b9z5K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-1m9vK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-g047KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-64vuK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-hx2aK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-an3hKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-znjK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-dfc8KbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-3sznKcToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-hpvbKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8xuiKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-87bKdToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-czkgKtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-3e7eKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-hrcaKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8z3aKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-2e1oK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-iaj5KoToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-4zj9KqToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-fx8KsToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-23hdKtToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-2d2iKrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7k2nKrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-am8yK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-ayl4KnToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7pq2KrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6ln0KnToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6rh8K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-8100KuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-ewjvK8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7escK8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-26xmKxToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6h24KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6gwsK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-b967K8ToS4g-4g.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-a7k7KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7mxmKdToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7kq2KrToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7lkmKuToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-bdyfKmToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7917KeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-9srbKeToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-77euKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-2k9rK9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-bogaKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7teoKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-1tldKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-687hKbToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-7n71KaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-begnKaToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-73x5K9ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-2mgkK7ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-6jl0K8ToS40-40.png',
'https://img.nga.178.com/attachments/mon_202308/06/-11c8ltQ2s-bvz7K8ToS40-40.png',
                // NGA原神官方表情的地址
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoGenshinOfficalv5.data, function(i, picURL){
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
                $('[title="插入表情"]:not([GenshinOfficalv5])').attr('GenshinOfficalv5', 1).bind('click.GenshinOfficalAddBtnv5', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("原神表情包(v5)")))').append('<button class="block_txt_big">原神表情包(v5)</button>').find(':contains("原神表情包(v5)")').bind('click.GenshinOfficalBtnv5', demoGenshinOfficalv5.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoGenshinOfficalv5.addBtn();
            })
        };

        demoGenshinOfficalv1.addBtn();

        demoGenshinOfficalv1.putInBtn.observe($('body')[0], {
            subtree: true,
            childList: true,
        });
        demoGenshinOfficalv2.addBtn();

        demoGenshinOfficalv2.putInBtn.observe($('body')[0], {
            subtree: true,
            childList: true,
        });
        demoGenshinOfficalv3.addBtn();

        demoGenshinOfficalv3.putInBtn.observe($('body')[0], {
            subtree: true,
            childList: true,
        });
        demoGenshinOfficalv4.addBtn();

        demoGenshinOfficalv4.putInBtn.observe($('body')[0], {
            subtree: true,
            childList: true,
        });
        demoGenshinOfficalv5.addBtn();

        demoGenshinOfficalv5.putInBtn.observe($('body')[0], {
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
