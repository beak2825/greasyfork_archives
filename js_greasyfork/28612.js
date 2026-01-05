// ==UserScript==
// @name         NGA Re-collapse Button
// @namespace    https://greasyfork.org/zh-CN/scripts/28612-nga-re-collapse-button
// @version      1.2.0.20180312
// @icon         http://bbs.nga.cn/favicon.ico
// @description  NGA 折叠内容展开后可再次收起
// @author       AgLandy
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @downloadURL https://update.greasyfork.org/scripts/28612/NGA%20Re-collapse%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/28612/NGA%20Re-collapse%20Button.meta.js
// ==/UserScript==

//发布地址：http://bbs.ngacn.cc/read.php?tid=11313839

(function(){

    function init($){

        let r = commonui.reCollapseButton = {
            f: function(e, c, n){
                if(r.timer != undefined){
                    clearTimeout(r.timer);
                    delete r.timer;
                }
                let b = e.target,
                    dB = $(b).parent(),
                    dC = dB.next();
                if(dC.html() == ''){
                    $(b).html('-');
                    dC.css({'overflow-y':'hidden','transition':'all 0.5s ease-in-out','-o-transition':'all 0.5s ease-in-out','-moz-transition':'all 0.5s ease-in-out','-webkit-transition':'all 0.5s ease-in-out','-ms-transition':'all 0.5s ease-in-out','max-height':'0px','opacity':'0'});
                    dB.css('background', __COLOR.border2);
                    let t = $.now();
                    r.mo[t] = new MutationObserver(function(){
                        setTimeout(function(){
                            $('<div />').append(dC.contents()).appendTo(dC);
                            dC.css({'max-height':(dC.children().outerHeight(true) + 'px'),'opacity':'1'});
                            r.timer = setTimeout(function(){
                                dC.css({'max-height':'none'});
                                delete r.timer;
                            }, 500);
                            r.mo[t].disconnect();
                            delete r.mo[t];
                        },100);
                    });
                    r.mo[t].observe(dC[0], {
                        childList: true,
                        subtree: true,
                    });
                    ubbcode.collapse.load(dC[0], c, n);
                    return;
                }
                if($(b).html() == '+'){
                    $(b).html('-');
                    dB.css('background', __COLOR.border2);
                    dC.children().css('display', '');
                    dC.css({'max-height':(dC.children().outerHeight(true) + 'px'),'opacity':'1'});
                    r.timer = setTimeout(function(){
                        dC.css({'max-height':'none'});
                        delete r.timer;
                    }, 500);
                }
                else{
                    $(b).html('+');
                    dB.css('background', '');
                    dC.css('max-height', (dC.children().outerHeight(true) + 'px'));
                    setTimeout(function(){
                        dC.css({'max-height':'0px','opacity':'0'});
                    }, 10);
                    r.timer = setTimeout(function(){
                        dC.children().css('display', 'none');
                        delete r.timer;
                    }, 510);
                }
            },
            r: function(){
                $('.collapse_btn button[onclick^="t"]').each(function(i, b){
                    b = $(b);
                    b.attr('onclick', b.attr('onclick').replace(/^t.+,"/, 'commonui.reCollapseButton.f(event,"'));
                    b.css({width:'1.2em', height:'1.2em', padding:'0', outline:'none', 'font-family':'Serif', 'line-height':'1.1em'});
                });
            },
            mo: {
                body : new MutationObserver(function(){
                    r.r();
                })
            }
        };

        r.r();

        r.mo.body.observe($('body')[0], {
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

