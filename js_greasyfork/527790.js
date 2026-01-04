// ==UserScript==
// @name         NGA NIKKE官方社区表情包
// @version      1.1
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将 官方社区表情 加入到表情列表中
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @grant        none
// @license      MIT License
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js

// @namespace https://greasyfork.org/users/1437933
// @downloadURL https://update.greasyfork.org/scripts/527790/NGA%20NIKKE%E5%AE%98%E6%96%B9%E7%A4%BE%E5%8C%BA%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/527790/NGA%20NIKKE%E5%AE%98%E6%96%B9%E7%A4%BE%E5%8C%BA%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

//原脚本发布地址：http://bbs.ngacn.cc/read.php?tid=11275553

(function(){

    function init($){

        let a = commonui.acNK = {
            data: [
                './mon_202502/21/axszQ2v-4tm6Z14T3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-gycoZoT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-5lbcZxT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-fwbrZuT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-4pz5ZeT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-ed9tZ14T3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-2ythZ12T3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-d44wZeT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-17hrZdT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-au5gZdT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-l9xxK2iT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-cf33ZmT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-185sK1vT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-cgroZjT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-wu2ZkT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-awz5ZgT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-ie1ZeT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-a9fqZdT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-k72jZeT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-9fhiZvT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-kivoZ1hT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-a65sZ1bT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-21usZmT3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-2b2nZ17T3cSdw-dw.gif',
                './mon_202502/21/axszQ2v-c6izZeT1kSdw-dw.gif',
                './mon_202502/21/axszQ2v-15hxZ1hT3cSdw-dw.gif',
                './mon_202502/23/axszQ2v-dk3uKiToS40-40.png',
                './mon_202502/23/axszQ2v-l0qKxToS40-40.png',
                './mon_202502/23/axszQ2v-8g7pKlToS40-40.png',
                './mon_202502/23/axszQ2v-hr9rKqToS40-40.png',
                './mon_202502/23/axszQ2v-5lmwKnToS40-40.png',
                './mon_202502/21/axszQ2v-c9quZfT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-eji5ZcT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-2gh8ZfT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-bvagZdT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-1gv8ZdT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-baxcZdT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-k5e9ZdT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-85lhZgT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-hiqxZcT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-4irpK2nT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-d6ksK2qT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-6rnZeT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-8u2wZiT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-k9hnZgT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-7dhnZdT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-h09tZcT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-41ojZdT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-cq1tZeT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-l9ccZeT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-93hvZcT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-hoieZeT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-4t32ZeT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-dhm1ZdT1kS8w-8w.png',
                './mon_202502/23/axszQ2v-qfhZhT1kS8w-8w.png',
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
                $('[title="插入表情"]:not([ac-nk])').attr('ac-nk', 1).bind('click.acNKAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("NIKKE妮姬")))').append('<button class="block_txt_big">NIKKE妮姬</button>').find(':contains("NIKKE妮姬")').bind('click.acNKBtn', a.f)
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



