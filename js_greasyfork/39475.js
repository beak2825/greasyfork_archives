// ==UserScript==
// @name         NGA Display Like Value
// @namespace    https://greasyfork.org/zh-CN/scripts/39475-nga-display-like-value
// @version      0.1.0.20180312
// @icon         http://bbs.nga.cn/favicon.ico
// @description  NGA 赞踩按钮显示数值，默认悬停显示，可修改为一直显示。
// @author       Aglandy
// @include      /^https?:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)\/read.+/
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @downloadURL https://update.greasyfork.org/scripts/39475/NGA%20Display%20Like%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/39475/NGA%20Display%20Like%20Value.meta.js
// ==/UserScript==

//发布地址：http://bbs.ngacn.cc/read.php?tid=13647420

(function(){

    function init(usl){

        let $ = usl.$,
            dlv = commonui.displayLikeValue = {
                init: function(){
                    let s;
                    if(localStorage.displayLikeValue)
                        s = parseInt(localStorage.displayLikeValue);
                    else{
                        s = 1;
                        localStorage.displayLikeValue = s;
                    }
                    return s;
                },
                f: function(){
                    let zc = $('a.white[title^="支持"]');

                    //还原默认
                    zc.attr('title', '支持');
                    zc.nextAll('a').attr('title', '反对');
                    zc.next().show();
                    zc.prev('span.white').remove();
                    zc.nextAll('a').next('span.white').remove();

                    //显示数值
                    if(dlv.s)
                        zc.each(function(i, a){
                            a = $(a);
                            let pA = commonui.postArg.data[a.closest('span[id^=postc]').attr('id').replace(/[a-z]+/,'')];
                            a.attr('title','支持('+ pA.score +')');
                            a.nextAll('a').attr('title','反对('+ pA.score_2 +')');
                        });
                    else{
                        zc.next().hide();
                        zc.each(function(i, a){
                            a = $(a);
                            let pA = commonui.postArg.data[a.closest('span[id^=postc]').attr('id').replace(/[a-z]+/,'')];
                            if(a.prev().attr('class') != 'white'){
                                a.before('<span class="white" />');
                                a.nextAll('a').after('<span class="white" />');
                            }
                            a.prev().html(pA.score + ' ');
                            a.nextAll('a').next().html(' ' + -pA.score_2);
                        });
                    }
                }
            };

        commonui.mainMenu.data[403] = {innerHTML: '显示赞踩数值设置',on: {event: 'click',func: function(e){
            let o = __SETTING.o = commonui.createadminwindow(),
                k = _$('/input').$0('type','checkbox','checked',0)._.on('click', function(){
                    dlv.s = this.checked ? 1 : 0;
                    localStorage.displayLikeValue = dlv.s;
                    dlv.f();
                });
            o._.addContent(null);
            o._.addTitle('显示赞踩数值设置');
            o._.addContent(
                k,
                '悬停显示',
                _$('/br')
            );
            if(dlv.s)
                k._.attr('checked', 1);
            o._.show(e);
        }},parent: 18};
        commonui.mainMenu.data[18].subKeys.push(403);

        dlv.s = usl.lS ? dlv.init() : 1;

        dlv.f();

        if(!usl.userScriptData.dlv)
            usl.userScriptData.dlv = dlv.f;

    }

    (function check(){
        try{
            if(commonui.userScriptLoader.$)
                init(commonui.userScriptLoader);
            else
                setTimeout(check, 5);
        }
        catch(e){
            setTimeout(check, 50);
        }
    })();

})();




