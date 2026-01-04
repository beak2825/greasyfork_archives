// ==UserScript==
// @name         NGA User Script Loader
// @namespace    https://greasyfork.org/zh-CN/scripts/39014-nga-user-script-loader
// @version      0.1.0.20200528
// @icon         http://bbs.nga.cn/favicon.ico
// @description  NGA User Script Loader 实现两个功能：1.在页面未加载 jQuery 时加载 jQuery ；2.在点击“加载上一页/下一页”按钮后重新运行用户脚本（需脚本自身配合）。
// @author       AgLandy
// @include      /^https?:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/
// @grant        none
// ==/UserScript==

(function(){

    if(!window.commonui)
        commonui = {};

    setTimeout(function(){

        try{
            if(commonui.userScriptLoader.$)
                return;
        }
        catch(e){
            let init = function($){
                let usl = commonui.userScriptLoader = {
                    $: $,
                    userScriptData: {},
                    f:function(){
                        $.each(usl.userScriptData, function(k, v){
                            v();
                        });
                    },
                    mo: new MutationObserver(function(){
                        setTimeout(usl.f, 500);
                        usl.moDC();
                    }),
                    moOB: function(e){
                        if(e.target.nodeName != 'A')
                            return;
                        usl.mo.observe($('div#mc')[0], {
                            childList: true,
                            subtree: true,
                        });
                    },
                    moDC: function(){
                        usl.mo.disconnect();
                    },
                    lS: (function(s){
                        if(!!s){
                            try{
                                s.testkey = 'testvalue';
                                s.removeItem('testkey');
                                return true;
                            }
                            catch(e){
                                return false;
                            }
                        }
                        else
                            return false;
                    })(window.localStorage)
                };
                setTimeout(function(){
                    if(commonui.htmlLoader)
                        commonui.htmlLoader.runScript = function(ss, i, f){
                            if(!i)
                                i = 0;
                            for(; i < ss.length; i++){
                                if(__SCRIPTS.loading){
                                    console.log('wait load ' + __SCRIPTS.loading)
                                    var alto = setTimeout(function(){
                                        var z = '';
                                        for(var k in __SCRIPTS.lg)
                                            if(__SCRIPTS.lg[k] && k == 'https://bdtj.tagtic.cn/bi-sdk.1.2.1.js')
                                                z += k + '\n';
                                        if(z){
                                            z += '加载缓慢 可尝试检查网络连接或关闭广告屏蔽';
                                            console.log(z);
                                            commonui.errorAlert(z);
                                        }
                                    }, 5000);
                                    return __SCRIPTS.wload(function(){
                                        console.log('wait load ok');
                                        clearTimeout(alto);
                                        commonui.htmlLoader.runScript(ss, i, f);
                                    });
                                }
                                commonui.eval.call(window, ss[i]);
                            }
                            if(f)
                                f();
                            usl.f();
                        };
                    else
                        document.addEventListener('click', usl.moOB, true);
                }, 1000);
            };
            if(document.getElementById('ngaUSL'))
                return;
            if(typeof jQuery == 'undefined'){
                let s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js';
                s.id = 'ngaUSL';
                s.onload = s.onreadystatechange = function(){
                    if(!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState){
                        init(jQuery.noConflict());
                        this.onload = this.onreadystatechange = null;
                    }
                };
                document.head.appendChild(s);
            }
            else
                init(jQuery);
        }

    }, Math.floor(Math.random() * 1000));

})();