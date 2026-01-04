// ==UserScript==
// @name         NGA-阴阳师表情
// @namespace    https://greasyfork.org/zh-CN/scripts/383182-nga-%E9%98%B4%E9%98%B3%E5%B8%88%E8%A1%A8%E6%83%85
// @version      2.0
// @icon         https://img.nga.178.com/attachments/mon_201905/17/eyQ5-fylnK4T8S1o-1o.gif
// @description  将阴阳师表情加入到表情列表中
// @author       秃头鼠
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @downloadURL https://update.greasyfork.org/scripts/383182/NGA-%E9%98%B4%E9%98%B3%E5%B8%88%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/383182/NGA-%E9%98%B4%E9%98%B3%E5%B8%88%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==
//此脚本发布地址：https://bbs.nga.cn/read.php?tid=17276982&_ff=538

(function(){

    function init($){

        let a = commonui.acmea = {
            data: [
                './mon_201905/17/eyQ5-fylnK4T8S1o-1o.gif',
                './mon_201905/18/eyQ5-7ryvKwToS2s-2e.gif',
                './mon_201905/18/eyQ5-f0nwKiToS30-2a.gif',
                './mon_201905/19/eyQ5-br64K7T8S3c-1t.gif',
                './mon_201905/19/eyQ5-4sjfK5T8S1l-1k.gif',
                './mon_201905/22/eyQ5-2lkyK7T8S2l-1t.gif',
                './mon_201905/22/eyQ5-khrzK1rToS2m-2j.gif',
                './mon_201904/28/-7Q5-af1dK14T3cSjn-jn.jpg.medium.jpg',
                './mon_201905/22/eyQ5-f4hrXcZ3fT3cSei-ei.gif',


            ],
            f: function(e){
                let n = $(e.target).next();
                if(n.children()[0])
                    return;
                $.each(a.data, function(i, v){
                    n.append('<img height="60px" src="http://img.ngacn.cc/attachments/' + v + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.dialog.w._.hide()" />');
                });
            },
            r: function(){
                $('[title="插入表情"]:not([ac-yys])').attr('ac-yys', 1).bind('click.acyysAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3:has(button[name="0"]):not(:has(button[name="acyys"]))').append('<button name="acyys">阴阳师表情</button><div></div>').find('[name="acyys"]').bind('click.acyysBtn', a.f);
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