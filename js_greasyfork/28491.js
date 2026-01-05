// ==UserScript==
// @name         NGA AC娘表情FGO化补完计划 by 间桐咕哒子@NGA
// @namespace    https://greasyfork.org/zh-CN/scripts/28491-nga-ac%E5%A8%98%E8%A1%A8%E6%83%85fgo%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92-by-%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90-nga
// @version      1.1.1.20210915
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将 间桐咕哒子@NGA 制作的FGO化AC娘表情加入到表情列表中
// @author       AgLandy
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/28491/NGA%20AC%E5%A8%98%E8%A1%A8%E6%83%85FGO%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92%20by%20%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90%40NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/28491/NGA%20AC%E5%A8%98%E8%A1%A8%E6%83%85FGO%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92%20by%20%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90%40NGA.meta.js
// ==/UserScript==

//原作者发布地址：http://bbs.ngacn.cc/read.php?tid=11266795
//此脚本发布地址：http://bbs.ngacn.cc/read.php?tid=11275553

(function(){

    function init($){

        let a = commonui.acFGO = {
            data: [
                './mon_201704/07/f0Q2g-fqdeKjT8S1o-1o.png',
                './mon_201704/07/f0Q2g-5yirKnToS20-1o.png',
                './mon_201704/07/f0Q2g-a858KlT8S1o-1o.png',
                './mon_201704/07/f0Q2g-blbKkT8S1o-1o.png',
                './mon_201704/07/f0Q2g-bifsKmT8S1o-1o.png',
                './mon_201704/07/f0Q2g-1tqoKmT8S1o-1o.png',
                './mon_201704/07/f0Q2g-cd8aKmToS1t-1o.png',
                './mon_201704/07/f0Q2g-h9zkKkT8S1o-1o.png',
                './mon_201704/07/f0Q2g-61o0KlT8S1o-1o.png',
                './mon_201704/07/f0Q2g-g84mKjT8S1o-1o.png',
                './mon_201704/07/f0Q2g-45peKjT8S1o-1o.png',
                './mon_201704/07/f0Q2g-ewd1KjT8S1o-1o.png',
                './mon_201704/07/f0Q2g-1ptdKkT8S1o-1o.png',
                './mon_201704/07/f0Q2g-bankKkToS1r-1o.png',
                './mon_201704/07/f0Q2g-1b5jKlT8S1o-1o.png',
                './mon_201704/07/f0Q2g-ap47KmT8S1o-1o.png',
                './mon_201704/07/f0Q2g-tc4KkT8S1o-1o.png',
                './mon_201704/07/f0Q2g-c9g0KjT8S1o-1o.png',
                './mon_201704/07/f0Q2g-223aKkT8S1o-1o.png',
                './mon_201704/07/f0Q2g-czogKnToS1v-1o.png',
                './mon_201704/07/f0Q2g-3y4KjT8S1o-1o.png',
                './mon_201704/07/f0Q2g-g3hpKoToS21-1o.png',
                './mon_201704/07/f0Q2g-a4aKkToS1x-1o.png',
                './mon_201704/07/f0Q2g-7kgtKmToS1x-1o.png',
                './mon_201704/07/f0Q2g-fk7dKmToS22-1o.png',
                './mon_201704/07/f0Q2g-33wKnToS27-1o.png',
                './mon_201704/07/f0Q2g-k65oKmToS1u-1o.png',
                './mon_201704/07/f0Q2g-670oKjT8S1o-1o.png',
                './mon_201704/07/f0Q2g-h3rwKkT8S1o-1o.png',
                './mon_201704/07/f0Q2g-36a8KjT8S1o-1o.png',
                './mon_201704/07/f0Q2g-h0ocKnToS1v-1o.png',
                './mon_201704/07/f0Q2g-9jdoKoToS1u-1o.png',
                './mon_201704/07/f0Q2g-l0a5KnToS1u-1o.png',
                './mon_201704/07/f0Q2g-b1e5KmToS1v-1o.png',
                './mon_201704/07/f0Q2g-lbx3KkT8S1o-1o.png',
                './mon_201704/07/f0Q2g-b301KlT8S1o-1o.png',
                './mon_201704/07/f0Q2g-ot3KkT8S1o-1o.png',
                './mon_201704/07/f0Q2g-8m75KmT8S1o-1o.png',
                './mon_201704/07/f0Q2g-gp60KmT8S1o-1o.png',
            ],
            f: function(e){
                let t = $(e.target),
                    tmp = t.parent().next().children(),
                    imgs = tmp.eq(t.index() - 1);
                if(!imgs.children()[0])
                    $.each(a.data, function(i, v){
                        imgs.append('<img height="60px" src="http://img.nga.178.com/attachments/' + v + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.selectSmilesw._.hide()" />');
                    });
                $.each(tmp, function(i, d){
                    if(i == t.index() - 1)
                        d.style.display = '';
                    else
                        d.style.display = 'none';
                });
                t.parent().children().eq(0).html('');
            },
            r: function(){
                $('[title="插入表情"]:not([ac-fgo])').attr('ac-fgo', 1).bind('click.acFgoAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("AC娘FGO化")))').append('<button class="block_txt_big">AC娘FGO化</button>').find(':contains("AC娘FGO化")').bind('click.acFgoBtn', a.f)
                            .end().next().append('<div />');
                    },100);
                });
            },
            mo: new MutationObserver(function(){
                a.r();
            })
        };

        a.r();

        a.mo.observe($('body')[0], {
            childList: true,
            subtree: true,
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



