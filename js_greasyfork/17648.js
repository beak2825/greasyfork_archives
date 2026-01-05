// ==UserScript==
// @name        5sing助手
// @namespace   heroesm
// @description 5sing功能增强
// @include     http://5sing.kugou.com/*
// @include     http://fc.5sing.com/*
// @include     http://static.5sing.kugou.com/???*
// @version     1.1.2.5
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/17648/5sing%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/17648/5sing%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function main(){
    //compatible with nonstrict mode
    "use strict";
    function SongIndex(id){
        this.id = id;
    }
    SongIndex.prototype = {
        get song(){return wsingHelper.mSongs[this.id];},
        set song(x){wsingHelper.mSongs[this.id] = x;}
    };
    var wsingHelper = {
        aIndex: [],
        mSongs: {},
        aJSON: [],
        aJSON2: [],
        nList: 0,
        player: {
            pos: 1,// 1,2,3,4 correspond to top-left, top-right, bottom-right, bottom-left corner
            audio: {},
            volume: 1,
            repeat: false,
            playing: 0,
            autoplay: '0',
            sequence: false,
            shortcut1: 's',
            shortcut2: 'd',
            shortcut3: 'f',
            shortcut4: 'g',
            control: '1',
            volfix: '0'
        },
        container: {},
        prepare: prepare,
        jsonpp: jsonpp,
        checkSetting: checkSetting,
        jsonp: jsonp,
        adjust: adjust,
        fix: fix,
        search: search,
        createOption: createOption,
        confirmOption: confirmOption,
        resetOption: resetOption,
        preventAutoplay: preventAutoplay,
        setSongCookies: setSongCookies,
        exportList: exportList,
        importList: importList,
        coin: coin,
        searchSong: searchSong,
        fetchMore: fetchMore,
        fetchToEnd: fetchToEnd,
        loadSong: loadSong,
        createList: createList,
        buildMy: buildMy,
        setUpUI: setUpUI,
        init: init,
        notify: notify
    };
    var locked = false;
    var ended = false;
    var sHeadIndex = '';

    function prepare(){
        Document.prototype.$ = Document.prototype.querySelector;
        Element.prototype.$ = Element.prototype.querySelector;
        Document.prototype.$$ = Document.prototype.querySelectorAll;
        Element.prototype.$$ = Element.prototype.querySelectorAll;
    }

    function jsonp(sUrl, success){
        var Result, sCallback;
        sCallback = 'callback_' + (new Date()).getTime();
        function callback(Res){
            document.head.removeChild(script);
            eval('delete window.'+ sCallback);
            success(Res);
            //Result = Res;
        }
        window[sCallback] = callback;
        sUrl+= (/\?/.test(sUrl) ? '&' : '?');
        sUrl+= 'jsoncallback=' + sCallback + '&_=' + (new Date()).getTime();
        var script = document.createElement('script');
        script.src = sUrl;
        /*script.onload = function(){
            success(Result);
            document.head.removeChild(script);
            eval('delete window.'+ sCallback);
        }*/
        document.head.appendChild(script);
    }


    // implement jsonp with promise, not in use
    function jsonpp(sUrl){
        var p = new Promise(function(resolve,reject){
            var sCallback;
            sCallback = 'callback_' + (new Date()).getTime();
            window[sCallback] = callback;
            sUrl+= (/\?/.test(sUrl) ? '&' : '?');
            sUrl+= 'jsoncallback=' + sCallback + '&_=' + (new Date()).getTime();
            var script = document.createElement('script');
            script.src = sUrl;
            function callback(Res){
                resolve(Res);
                document.head.removeChild(script);
                eval('delete window.'+ sCallback);
            }
            //script.onload = function(){resolve(Result);}
            document.head.appendChild(script);
        });
        return p;
    }

    function notify(sText, nTime){
        clearTimeout(notify.timeout);
        var notifier = wsingHelper.container.notifier;
        notifier.textContent = '提示：' + sText;
        notifier.style.display = 'unset';
        if(typeof nTime == 'number'){
            notify.timeout = setTimeout(function(){
                notifier.style.display = 'none';
                notifier.textContent = '提示：';
            }, nTime);
        }
    }


    function keyHandle1(e){
        //run before initialization of the main panel
        if((!/input|textarea/.test(e.target.tagName.toLowerCase()) || /checkbox|submit/.test(e.target.type)) && e.altKey === false && e.ctrlKey === false){
            var key = wsingHelper.player.shortcut1;
            if(key && ((e.key && e.key.toLowerCase() == key) || e.code == 'Key' +  key.toUpperCase())){
                document.$('#helper_toggle').click();
            }
        }
    }

    function keyHandle2(e){
        //run after initialization of the main panel
        if((!/input|textarea/.test(e.target.tagName.toLowerCase()) || /checkbox|submit/.test(e.target.type)) && e.altKey === false && e.ctrlKey === false){
            var key;
            if((key = wsingHelper.player.shortcut2) && ((e.key && e.key.toLowerCase() == key) || e.code == 'Key' +  key.toUpperCase())){
                document.$('#helper_set').click();
            }
            else if((key = wsingHelper.player.shortcut3) && ((e.key && e.key.toLowerCase() == key) || e.code == 'Key' +  key.toUpperCase())){
                wsingHelper.player.audio.paused? wsingHelper.player.audio.play() : wsingHelper.player.audio.pause();
            }
            else if((key = wsingHelper.player.shortcut4) && (e.key && e.key.toLowerCase() == key) || e.code == 'Key' + key.toUpperCase()){
                try{
                    document.$('.helper_more').click();
                }catch(e){console.log(e);}
            }
            else if(wsingHelper.player.control == '1'){
                //play previous song
                if((key = 'h') && (e.key && e.key.toLowerCase() == key) || e.code == 'Key' + key.toUpperCase()){
                    wsingHelper.loadSong(wsingHelper.player.playing - 1);
                }
                //increase volume
                else if((key = 'j') && (e.key && e.key.toLowerCase() == key) || e.code == 'Key' + key.toUpperCase()){
                    wsingHelper.player.audio.volume = (wsingHelper.player.audio.volume - 0.1) >= 0 ? wsingHelper.player.audio.volume - 0.1 : 0;
                }
                //decrease volume
                else if((key = 'k') && (e.key && e.key.toLowerCase() == key) || e.code == 'Key' + key.toUpperCase()){
                    wsingHelper.player.audio.volume = (wsingHelper.player.audio.volume + 0.1) <= 1 ? wsingHelper.player.audio.volume + 0.1 : 1;
                }
                //play next song
                else if((key = 'l') && (e.key && e.key.toLowerCase() == key) || e.code == 'Key' + key.toUpperCase()){
                    wsingHelper.loadSong(wsingHelper.player.playing + 1);
                }
            }
        }
    }

    function adjust(sScheme,node,nVer,nHor){
        function changePos(node,t,r,b,l){
            for(var i = 1; i< arguments.length; i++){
                if(typeof arguments[i] != 'number')
                    arguments[i] = 'unset';
                else
                    arguments[i]+= 'px';
                //in strict mode, modification in array variable "arguments" will not be reflected in the named real arguments
                node.style.top = arguments[1];
                node.style.right = arguments[2];
                node.style.bottom = arguments[3];
                node.style.left = arguments[4];
            }
        }
        switch(sScheme){
            case '1':
                changePos(node,nVer,'','',nHor);
                break;
            case '2':
                changePos(node,nVer,nHor,'','');
                break;
            case '3':
                changePos(node,'',nHor,nVer,'');
                break;
            case '4':
                changePos(node,'','',nVer,nHor);
                break;
        }
    }
    
    function getSongSrc(Song){
        var url = 'http://service.5sing.kugou.com/song/getsongurl?songid=' + Song.id + '&songtype=' + Song.type + '&from=web&version=6.6.72'
        jsonp(url, function(res){
            var rawSong = res
            try{
                Song.src = rawSong['data']['squrl']
                notify('成功获取歌曲地址', 3000);
            }catch(e){console.log(e);}
        });
    }

    function fix(Song){
        notify('地址错误，尝试更新地址……');
        getSongSrc(Song)
        //var xhr = new XMLHttpRequest();
        //xhr.timeout = 10000;
        //xhr.ontimeout = xhr.onerror = function(e){
        //    notify('地址更新失败', 3000);
        //};
        //xhr.onload = function(e){
        //    var data = xhr.response;
        //    data = /ticket["']\s*:\s*(["'])(.+)\1/.exec(data)[2];
        //    data = JSON.parse(atob(data));
        //    Song.src = data.file;
        //    if(wsingHelper.aIndex[wsingHelper.player.playing].song == Song){
        //        var audio = wsingHelper.player.audio;
        //        if(audio.src == Song.src){
        //            notify('歌曲地址无效', 3000);
        //        }
        //        else{
        //            audio.src = Song.src;
        //            audio.load();
        //            audio.play();
        //            notify('地址更新成功', 3000);
        //        }
        //    }
        //};
        //xhr.open('get', 'http://5sing.kugou.com/' + Song.type + '/' + Song.id + '.html');
        //xhr.send();
    }

    function search(sKey, sSite, sType){
        var sURI = encodeURIComponent( (sType?sType:'') + sKey +' site:5sing.kugou.com');
        if(sSite== 'google')
            window.open('https://www.google.com/search?q='+ sURI);
        else if(sSite== 'baidu')
            window.open('https://www.baidu.com/s?wd='+ sURI);
    }

    function createOption(divSet){
        var sHtml = [
            '<div id="helper_fun">',
            '<h3>功能区</h3>',
            '<div id="helper_fun_goo" title="使用google在5sing中搜索，按回车直接搜索全部"><p class="helper_left">谷歌搜索：</p><input type="text" class="helper_left"><button class="helper_left">全部</button><button class="helper_left">标题</button></div>',
            '<div id="helper_fun_bai" title="使用baidu在5sing中搜索，按回车直接搜索全部"><p class="helper_left">百度搜索：</p><input type="text" class="helper_left"><button class="helper_left">全部</button><button class="helper_left">标题</button></div>',
            '<div>',
            '<button id="helper_fun_reload" class="helper_left" title="尝试重新载入当前原生5sing页面中播放的歌曲，在页面歌曲无法顺利缓冲的情况下使用">重载歌曲</button>',
            '<button id="helper_fun_load" class="helper_left" title="尝试将所有可以继续加载的歌曲读取到当前列表中">获取全部</button>',
            '<button id="helper_fun_export" class="helper_right" title="将当前列表中的歌曲ID以纯文本形式导出，可复制到剪贴板中保存">导出歌曲</button>',
            '<button id="helper_fun_import" class="helper_right" title="以纯文本形式导入歌曲ID到当前列表中，可从剪贴板中粘贴，歌曲是远程载入，可能要花上几秒">导入歌曲</button>',
            '</div>',
            '</div>',
            '<div id="helper_opt">',
            '<h3>设置区</h3>',
            '<div><ul class="helper_left">',
            '    <li title="是否允许5sing本身的自动播放行为，在打开新网页时生效">自动播放：<select id="helper_opt_autoplay">',
            '        <option value="0" selected>禁止</option>',
            '        <option value="1">允许</option>',
            '    </select></li>',
            '    <li title="设置插件开关和主面板放置于网页的哪个角落">插件位置：<select id="helper_opt_pos" value="1">',
            '        <option value="1">左上</option>',
            '        <option value="2">右上</option>',
            '        <option value="3">右下</option>',
            '        <option value="4">左下</option>',
            '    </select></li>',
            '    <li title="可为0到1之间的小数，设置默认音量，与在主面板直接调节音量等效">音量设置：<input type="text" id="helper_opt_vol" value="1"></li>',
            '    <li title="可为一位小写字母或数字，在窗口中按下此键可开关主面板，与点击开关按钮等效">面板开关：<input type="text" id="helper_opt_sho" value="s"></li>',
            '    <li title="可为一位小写字母或数字，在插件启动后按下此键可开关设置面板，与点击主面板中的功能设置按钮等效">功能设置：<input type="text" id="helper_opt_set" value="d"></li>',
            '    <li title="可为一位小写字母或数字，在插件启动后按下此键可控制当前音乐的播放、暂停，与点击播放器按钮等效">播放暂停：<input type="text" id="helper_opt_pla" value="f"></li>',
            '</ul>',
            '<ul class="helper_left">',
            '    <li title="是否使用热键hjkl进行播放控制，若使用，h为播放上一首，j为减小音量，k为增大音量，l为播放下一首">播放控制：<select id="helper_opt_control">',
            '            <option value="0">关闭</option>',
            '            <option value="1" selected>开启</option>',
            '    </select></li>',
            '    <li title="是否尝试修复firefox浏览器中插件播放器音量在显示/隐藏操作后错误地显示为最大的问题，其他浏览器用户可无视此选项">音量修复：<select id="helper_opt_volfix">',
            '            <option value="0" selected>关闭</option>',
            '            <option value="1" >开启</option>',
            '    </select></li>',
            '    <li title="可为一位小写字母或数字，在窗口中按下此键会尝试载入更多歌曲（可用时），与点击歌曲列表中的相应区域等效">获取更多：<input type="text" id="helper_opt_get" value="g"></li>',
            '</ul>',
            '<div class="helper_about helper_left">',
            '    <p>项目主页：<a href="https://github.com/heroesm/5singHelper">5singHelper</a>',
            '    <br /></p>',
            '    <p>问题反馈：<a href="https://greasyfork.org/zh-CN/scripts/17648-5sing%E5%8A%A9%E6%89%8B/feedback">5sing助手</a></p>',
            '</div>',
            '</div>',
            '<div class="helper_left"><p>※ 鼠标悬停在项目上可查看说明</p></div>',
            '<div class="helper_right">',
            '    <button id="helper_opt_con" title="确认并保存设置的更改">确认</button>',
            '    <button id="helper_opt_can" title="放弃设置的更改">取消</button>',
            '    <button id="helper_opt_cle" title="清除插件在localStorage中存储的所有设置信息，刷新后生效">清除本地设置</button>',
            '</div>'
        ].join('\n');
        divSet.innerHTML = sHtml;
        var t1, t2;
        t1 = divSet.$('#helper_fun_goo');
        t1.$$('button')[0].onclick = function(e){
            var sKey = t1.$('input').value;
            search(sKey,'google');
        };
        t1.$$('button')[1].onclick = function(e){
            var sKey = t1.$('input').value;
            search(sKey,'google','intitle:');
        };
        t1.addEventListener('keydown',function(e){
            if(e.key == 'Enter' || e.code == 'Enter')
                t1.$('button').onclick();
        });
        t2 = divSet.$('#helper_fun_bai');
        t2.$$('button')[0].onclick = function(e){
            var sKey = t2.$('input').value;
            search(sKey,'baidu');
        };
        t2.$$('button')[1].onclick = function(e){
            var sKey = t2.$('input').value;
            search(sKey,'baidu','intitle:');
        };
        t2.addEventListener('keydown',function(e){
            if(e.key== 'Enter' || e.code == 'Enter')
                t2.$('button').onclick();
        });
        divSet.$('#helper_fun_reload').onclick = function(){
            try{
                window.$wsp.htmlMediaElement.load();
                window.$wsp.htmlMediaElement.dispatchEvent(new Event('pause'));
            }catch(e){console.log(e);}
        };
        divSet.$('#helper_fun_load').onclick = function(){
            window.wsingHelper.fetchToEnd();
        }
        divSet.$('#helper_fun_export').onclick = exportList;
        divSet.$('#helper_fun_import').onclick = importList;
        divSet.$('#helper_opt_con').onclick = function(){
            confirmOption(divSet);
            wsingHelper.container.$('#helper_set').onclick();
        };
        divSet.$('#helper_opt_can').onclick = function(){
            wsingHelper.container.$('#helper_set').onclick();
        };
        divSet.$('#helper_opt_cle').onclick = function(){
            for(var i = 0,t; i < localStorage.length;i++){
                t = localStorage.key(i);
                if(t.indexOf('helper_') === 0){
                    localStorage.removeItem(t);
                    i--;
                }
            }
        };
        return divSet;
    }

    function checkSetting(){
        var t;
        t = localStorage.helper_pos;
        if(/^[1234]$/.test(t))
            wsingHelper.player.pos = t;
        t = localStorage.helper_shortcut1;
        if(/^[a-z0-9]$/.test(t))
            wsingHelper.player.shortcut1 = t;
        t = localStorage.helper_shortcut2;
        if(/^[a-z0-9]$/.test(t))
            wsingHelper.player.shortcut2 = t;
        t = localStorage.helper_shortcut3;
        if(/^[a-z0-9]$/.test(t))
            wsingHelper.player.shortcut3 = t;
        t = localStorage.helper_shortcut4;
        if(/^[a-z0-9]$/.test(t))
            wsingHelper.player.shortcut4 = t;
        t = localStorage.helper_play;
        if(/^[01][01]$/.test(t)){
            wsingHelper.player.repeat = (t.charAt(0) === '1');
            wsingHelper.player.sequence = (t.charAt(1) === '1');
        }
        t = localStorage.helper_autoplay;
        if(/^[01]$/.test(t))
            wsingHelper.player.autoplay = t;
        t = parseFloat(localStorage.helper_volume);
        if( t>= 0 && t<= 1){
            wsingHelper.player.volume = t;
        }
        t = localStorage.helper_control;
        if(/^[01]$/.test(t))
            wsingHelper.player.control = t;
        t = localStorage.helper_volfix;
        if(/^[01]$/.test(t))
            wsingHelper.player.volfix = t;
    }

    function confirmOption(divSet){
        var t;
        t = divSet.$('#helper_opt_autoplay').value;
        if(/^[01]$/.test(t)) localStorage.helper_autoplay = t;
        t = divSet.$('#helper_opt_pos').value;
        var a = wsingHelper.container, b = document.$('#helper_toggle');
        if(/^[1234]$/.test(t)){
            adjust(t,a,60,50);
            adjust(t,b,100,10);
            localStorage.helper_pos = t;
        }
        t = divSet.$('#helper_opt_sho').value;
        if(/^[a-z0-9]$/.test(t)) localStorage.helper_shortcut1 = wsingHelper.player.shortcut1 = t;
        t = divSet.$('#helper_opt_set').value;
        if(/^[a-z0-9]$/.test(t)) localStorage.helper_shortcut2 = wsingHelper.player.shortcut2 = t;
        t = divSet.$('#helper_opt_pla').value;
        if(/^[a-z0-9]$/.test(t)) localStorage.helper_shortcut3 = wsingHelper.player.shortcut3 = t;
        t = divSet.$('#helper_opt_get').value;
        if(/^[a-z0-9]$/.test(t)) localStorage.helper_shortcut4 = wsingHelper.player.shortcut4 = t;
        t = parseFloat(divSet.$('#helper_opt_vol').value);
        if( t>= 0 && t<= 1){
            wsingHelper.player.audio.volume = t;
            localStorage.helper_volume = t.toFixed(2) + '';
        }
        t = divSet.$('#helper_opt_control').value;
        if(/^[01]$/.test(t)) localStorage.helper_control = wsingHelper.player.control = t;
        t = divSet.$('#helper_opt_volfix').value;
        if(/^[01]$/.test(t)) localStorage.helper_volfix = wsingHelper.player.volfix = t;
    }

    function resetOption(divSet){
        checkSetting();
        var t;
        t = divSet.$('#helper_opt_autoplay');
        t.value = wsingHelper.player.autoplay;
        t = divSet.$('#helper_opt_pos');
        t.value = wsingHelper.player.pos;
        t = divSet.$('#helper_opt_sho');
        t.value = wsingHelper.player.shortcut1;
        t = divSet.$('#helper_opt_set');
        t.value = wsingHelper.player.shortcut2;
        t = divSet.$('#helper_opt_pla');
        t.value = wsingHelper.player.shortcut3;
        t = divSet.$('#helper_opt_get');
        t.value = wsingHelper.player.shortcut4;
        t = divSet.$('#helper_opt_vol');
        t.value = wsingHelper.player.volume;
        t = divSet.$('#helper_opt_control');
        t.value = wsingHelper.player.control;
        t = divSet.$('#helper_opt_volfix');
        t.value = wsingHelper.player.volfix;
    }

    function preventAutoplay(){
        if(Object.prototype.watch){
            window.watch('$wsp',function(id,oldval,newval){
                if(Boolean(newval.htmlMediaElement)){
                    newval.htmlMediaElement.autoplay = false;
                    Object.defineProperty(newval.htmlMediaElement,'autoplay',{
                        get: function(){return false;},
                        configurable: true
                    });
                    newval.htmlMediaElement.addEventListener('canplay',function(e){
                        e.stopImmediatePropagation();
                    },true);
                }
                else{
                    newval.watch('htmlMediaElement',function(id,oldval2,newval2){
                        if(newval2 instanceof Audio){
                            newval2.autoplay = false;
                            Object.defineProperty(newval2,'autoplay',{
                                get: function(){return false;},
                                configurable: true
                            });
                            newval2.addEventListener('canplay',function(e){
                                e.stopImmediatePropagation();
                            },true);
                        }
                        newval.unwatch('htmlMediaElement');   //moving this sentence into end of the upper inner if block means watching constantly ,rather than watching once;
                        return newval2;
                    });
                }
                window.unwatch('$wsp');                       //moving this sentence into end of the upper inner if block means watching constantly ,rather than watching once;
                return newval;
            });
        }
        else{
            var value1 = undefined;
            Object.defineProperty(window,'$wsp',{
                set: function(newval){
                    if(Boolean(newval.htmlMediaElement)){
                        newval.htmlMediaElement.autoplay = false;
                        Object.defineProperty(newval.htmlMediaElement,'autoplay',{
                            get: function(){return false;},
                            configurable: true
                        });
                        newval.htmlMediaElement.addEventListener('canplay',function(e){
                            e.stopImmediatePropagation();
                        },true);
                    }
                    else{
                        var value2 = undefined;
                        Object.defineProperty(newval,'htmlMediaElement',{
                            set: function(newval2){
                                if(newval2 instanceof Audio){
                                    newval2.autoplay = false;
                                    Object.defineProperty(newval2,'autoplay',{
                                        get: function(){return false;},
                                        configurable: true
                                    });
                                    newval2.addEventListener('canplay',function(e){
                                        e.stopImmediatePropagation();
                                    },true);
                                }
                                delete newval.htmlMediaElement;    //
                                newval.htmlMediaElement = newval2; //moving these two sentences into end of the upper inner if block means watching (via the setter way) constantly ,rather than watching once;
                                value2 = newval2;
                            },
                            get: function(){ return value2;},
                            configurable: true
                        });
                    }
                    delete window.$wsp;   //
                    window.$wsp = newval; //moving these two sentences into end of the upper inner if block means watching (via the setter way) constantly ,rather than watching once;
                    value1 = newval;
                },
                get: function(){ return value1;},
                configurable :true
            });
        }
        window.addEventListener('load', function(){
            if(window.$wsp && window.$wsp.htmlMediaElement) {
                window.$wsp.htmlMediaElement.dispatchEvent(new Event('pause'));
                var t = document.querySelector('.wsp_c_play');
                if(t){
                    setTimeout(function resend(){
                        if(t.style.display== 'none' && window.$wsp.htmlMediaElement.paused === true){
                            window.$wsp.htmlMediaElement.dispatchEvent(new Event('pause'));
                            setTimeout(resend,100);
                        }
                    },100);
                }
            }
        });
        //prevent undispatched load event owing to lagging resource loading
        setTimeout(function(){
            if(!window.$wsp) return;
            window.$wsp.htmlMediaElement.dispatchEvent(new Event('pause'));
        },5000);
        // a new playing mechanism in 5sing will detect the 'h5' capability by testing the presence of global variable Worker; if Worker present, it will create autoplaying audio element which is hard to stop by external script; if not, it shall roll back to elder mechanism.
        window.Worker = undefined;
    }

    function setSongCookies(sSongs){
        var iframe = document.createElement('iframe');
        iframe.src = 'http://static.5sing.kugou.com/???' + sSongs;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.onload = function(){
            //iframe.remove();
            //document.body.removeChild(iframe);
        };
    }

    function exportList(){
        var sOut = '';
        for(var i = 0; i< wsingHelper.aIndex.length; i++){
            sOut+= '$'+ wsingHelper.aIndex[i].song.type + '$' + wsingHelper.aIndex[i].song.id;
        }
        prompt('请复制下面输入框中的字符串以保存歌曲信息:\n\n', sOut.substring(1));
    }

    function importList(){
        var sIn = prompt('请将此前导出的歌曲信息粘贴入下面的输入框:\n\n');
        var aIndex = sIn.match(/(yc|fc|bz)\$\d+/ig);
        wsingHelper.aIndex = [];
        for (var i=0; i<aIndex.length; i++){
            wsingHelper.aIndex.push(new SongIndex(aIndex[i]));
        }
        !!aIndex && jsonp('http://service.5sing.kugou.com/song/find?songinfo=' + sIn, function(res){
            wsingHelper.aJSON = res;
            for (var i = 0, Song; i < wsingHelper.aJSON.length; i++) {
                Song = wsingHelper.aJSON[i];
                var song = {
                    id: Song.id,
                    src: Song.sign,
                    type: Song.songtype,
                    space: 'http://5sing.kugou.com/' + Song.userid,
                    singer: Song.nickname,
                    avatar: Song.avatar,
                    songName: Song.songname,
                    description: ''
                };
                var sIndex = song.type + '$' + song.id;
                wsingHelper.mSongs[sIndex] = song;
            }
            wsingHelper.container.olSong && createList(wsingHelper.container.olSong);
        });
    }

    function coin(sName, sClass, sID, sStyle,sHtml) {
        var node = document.createElement(sName);
        sClass ? node.className = sClass : '';
        sID ? node.id = sID : '';
        sStyle ? node.style = sStyle : '';
        sHtml ? node.innerHTML = sHtml : '';
        return node;
    }

    function loadSong(nIndex){
        if(nIndex< 0 || nIndex>= wsingHelper.aIndex.length){
            if(wsingHelper.player.repeat === false)
                return false;
            else 
                nIndex = (nIndex < 0 ? wsingHelper.aIndex.length - 1 : 0);
        }
        try{
            var li = wsingHelper.container.olSong.children[wsingHelper.player.playing];
            li.className = li.className.replace(/ ?helper_player_playing/g,'');
        }catch(e){console.log(e);}
        wsingHelper.player.audio.src = wsingHelper.aIndex[nIndex].song.src;
        wsingHelper.player.audio.load();
        wsingHelper.player.audio.play();
        wsingHelper.player.playing = nIndex;
        wsingHelper.container.olSong.children[nIndex].className+= ' helper_player_playing';
        var info = wsingHelper.container.$('.helper_info'), song = wsingHelper.aIndex[nIndex].song;
        info.innerHTML = [
            '<h3 class="helper_song"><a href="http://5sing.kugou.com/' + song.type + '/'+ song.id +'.html">'+ song.songName +'</a></h3>',
            '<h3 class="helper_singer"><a href="'+ song.space +'">'+ song.singer +'</a></h3>',
            '<a href="'+ song.space +'" class="helper_avatar helper_right helper_clearR"><img src="'+ song.avatar +'" alt="avatar"></a>',
            '<div class="helper_description helper_clearL">'+ song.description +'</div>'
        ].join('\n');
        if(wsingHelper.player.audio.src.slice(-4) == '.wma'){
            notify('不支持的wma格式', 3000);
            wsingHelper.container.$('.helper_description').innerHTML = '错误：不支持播放wma格式文件';
            return false;
        }
        else{
            return true;
        }
    }

    function createList(ol){
        var newol = coin('ol','helper_songlist','helper_songlist');
        function click(e){
            e.preventDefault();
            wsingHelper.loadSong(e.currentTarget.index);
        }
        for(var i = 0, li; i<wsingHelper.aIndex.length; i++){
            var t = wsingHelper.aIndex[i].song;
            if (!t) break
            li = coin('li');
            li.innerHTML= [
                '<a href="'+ t.src +'">',
                '    <p class="helper_song">'+ t.songName + '</p>',
                '    <p class="helper_singer">'+ t.singer + '</p>',
                '</a>\n'
            ].join('\n');
            li.index = i;
            li.onclick = click;
            newol.appendChild(li);
        }
        //create checkbox list alongside songs list
        var olCheck = coin('ol','helper_checklist','helper_checklist');
        wsingHelper.container.aCheck = wsingHelper.container.aCheck || [];
        for(var i = 0, li, input, checked; i< newol.childElementCount; i++){
            li = wsingHelper.coin('li');
            try{
                checked = wsingHelper.container.aCheck[i].checked;
            }catch(e){checked = false;}
            wsingHelper.container.aCheck[i] = input = coin('input');
            input.type = 'checkbox';
            input.checked = checked;
            li.appendChild(input);
            olCheck.appendChild(li);
        }
        wsingHelper.container.aCheck = wsingHelper.container.aCheck.slice(0, i);
        if(newol.childElementCount > 0){
            var liMore = coin('li','helper_more','','','尝试远程载入更多歌曲');
            liMore.onclick = function(){
                fetchMore(this);
            };
            newol.appendChild(liMore);
        }
        if(wsingHelper.container.olSong) wsingHelper.container.olSong.parentNode.replaceChild(newol, wsingHelper.container.olSong);
        if(wsingHelper.container.olCheck) wsingHelper.container.olCheck.parentNode.replaceChild(olCheck, wsingHelper.container.olCheck);
        wsingHelper.container.olSong = newol;
        wsingHelper.container.olCheck = olCheck;
        try{
            wsingHelper.aIndex[wsingHelper.player.playing].song.src == wsingHelper.player.audio.src?
                (newol.children[wsingHelper.player.playing].className+= ' helper_player_playing') : (wsingHelper.player.playing= -1);
        }catch(e){}
        return {ol1: olCheck, ol2: newol};
    }

    function searchSong() {
        notify('载入中……');
        wsingHelper.aIndex = [];
        wsingHelper.mSongs = {};
        ended = false;
        var t;
        if(window.location.href.indexOf('://5sing.kugou.com/my/')!== -1){
            //in personal center
            wsingHelper.nList = 0;
            fetchInCenter({});
        }
        else if(window.location.href.indexOf('://5sing.kugou.com/fm/m')!== -1){
            //in independent playing page, using JSONP to load songs information remotely
            var  a1 = [], aIndex=[], sIndex, sTip;
            a1 = document.$('.playlist').$$('a.btn-view')
            for(var i = 0; i< a1.length; i++){
                sTip = a1[i].href.match(/(fc|yc|bz)\/\d+/)[0].replace('/','$');
                if(sTip != sIndex){
                    sIndex = sTip
                    aIndex.push(sIndex);
                    wsingHelper.aIndex.push(new SongIndex(sIndex));
                }
            }
            jsonp('http://service.5sing.kugou.com/song/find?songinfo=' + aIndex.join('$'), function(res){
                wsingHelper.aJSON = res;
                for (var i = 0, Song; i < wsingHelper.aJSON.length; i++) {
                    Song = wsingHelper.aJSON[i];
                    var song = {
                        id: Song.id,
                        src: Song.sign,
                        type: Song.songtype,
                        space: 'http://5sing.kugou.com/' + Song.userid,
                        singer: Song.nickname,
                        avatar: Song.avatar,
                        songName: Song.songname,
                        description: ''
                    };
                    var sIndex = song.type + '$' + song.id;
                    wsingHelper.mSongs[sIndex] = song;
                }
                wsingHelper.container.olSong && createList(wsingHelper.container.olSong);
                notify('载入完成', 3000);
            });
        }
        else if(/:\/\/5sing\.kugou\.com\/\w+\/[a-z]+(?:\/\d+)\.html/.test(window.location.href)){
            //in singer space, using JSONP to load songs information remotely
            var  a1= [], aIndex= [], sHref;
            a1 = document.$('.song_list, .per_list').$$('a[href^="http"][href$="html"]');
            for(var i = 0; i< a1.length; i++){
                if(a1[i].href!= sHref){
                    sHref = a1[i].href;
                    var sIndex = sHref.match(/(fc|yc|bz)\/\d+/)[0].replace('/','$');
                    aIndex.push(sIndex);
                    wsingHelper.aIndex.push(new SongIndex(sIndex));
                }
            }
            jsonp('http://service.5sing.kugou.com/song/find?songinfo=' + aIndex.join('$'), function(res){
                wsingHelper.aJSON = res;
                for (var i = 0, Song; i < wsingHelper.aJSON.length; i++) {
                    Song = wsingHelper.aJSON[i];
                    var song = {
                        id: Song.id,
                        src: Song.sign,
                        type: Song.songtype,
                        space: 'http://5sing.kugou.com/' + Song.userid,
                        singer: Song.nickname,
                        avatar: Song.avatar,
                        songName: Song.songname,
                        description: ''
                    };
                    var sIndex = song.type + '$' + song.id;
                    wsingHelper.mSongs[sIndex] = song;
                }
                wsingHelper.container.olSong && createList(wsingHelper.container.olSong);
                notify('载入完成', 3000);
            });
        }
        else if(/:\/\/5sing\.kugou\.com\/(?:yc|fc|bz)\/\d+\.html/.test(window.location.href)){
            //in song page
            var Song = JSON.parse(atob(window.globals.ticket || window.pageOptions.ticket));
            var song = {
                id: Song.songID,
                src: Song.file,
                type: Song.songType,
                space: 'http://5sing.kugou.com/' + Song.singerID,
                singer: Song.singer || document.$('.user').$('a').title,
                avatar: Song.avatar || document.$('.user').$('img').src,
                songName: Song.songName,
                description: (t = document.$('.lrc_info_clip'))? t.children[0].innerHTML: (t = document.$('.pl_lianxu'))? t.innerHTML: '未找到描述'
            };
            getSongSrc(song)
            song.description = song.description.replace(/<img.+?>/g, '');
            var sIndex = song.type + '$' + song.id;
            wsingHelper.mSongs[sIndex] = song;
            wsingHelper.aIndex.push(new SongIndex(sIndex));
            notify('载入完成', 3000);
        }
        else if(/:\/\/5sing\.kugou\.com\/\w+(\/default\.html|\/)?(#|$)/.test(window.location.href)){
            //in the main page of singer space, using 5sing api to search song in order of time
            var t = prompt('请用一位数字输入要远程载入的歌曲种类， 1 为原创， 2 为翻唱， 3 为伴奏');
            try{
                t = parseInt(t.match(/^\s*[123]\s*/));
                fetchMore({}, 999999999, t);
            }catch(e){
                console.log(e);
                notify('载入被取消');
            }
        }
        else if(/:\/\/5sing\.kugou\.com\/m\/detail\/(?:yc|fc|bz)-\d+.*\.html/.test(window.location.href) ||
               /:\/\/5sing\.kugou\.com\/m\/Song\/detail\/(?:yc|fc|bz)\/\d+(\.html)?/i.test(window.location.href)){
            //in mobile page
            var song = {
                id: window.pageConfig.songId,
                src: undefined,
                type: window.pageConfig.songType,
                space: 'http://5sing.kugou.com/' + window.pageConfig.singerId,
                singer: document.$('p.singer').textContent,
                avatar: document.$('.cd-box img').src,
                songName: document.$('p.song').textContent,
                description: ''
            };
            getSongSrc(song)
            var sIndex = song.type + '$' + song.id;
            wsingHelper.mSongs[sIndex] = song;
            wsingHelper.aIndex.push(new SongIndex(sIndex));
            notify('载入完成', 3000);
        }
        else{
            console.log('未支持本页面');
            notify('未支持本页面', 3000);
        }
    }

    function fetchInSpaceP(node, songId, songKind){
        //use jsonp via promise, not in use
        locked = true;
        node.innerHTML = '载入中……';
        notify('载入中……');
        var LastSong = (wsingHelper.aIndex[wsingHelper.aIndex.length-1] || {}).song || {},
            id = songId || LastSong.id,
            type = songKind || (LastSong.type == 'yc'? 1 : LastSong.type == 'fc'? 2: 3);
        if (!id) return;
        sHeadIndex = type + '$' + id; // function as jsonp lock
        jsonpp('http://service.5sing.kugou.com/song/songListBySongId?songId=' + id +'&songKind='+ type + '&userId=' + window.OwnerUserID + '&isPrev=1&isNext=0')
        .then(function(res){
            var sIndex = type + '$' + id;
            if (sIndex != sHeadIndex)
                // prevent duplicate jsonp execution
                return;
            else
                // right jsonp, continue execution and reset the jsonp lock to prevent other jsonp from execution
                sHeadIndex = '';
            var aJSON2 = wsingHelper.aJSON2 = res;
            if(aJSON2.length === 0){
                locked = false;
                ended = true;
                return Promise.reject(1);
            }
            else {
                var aIndex= [], sIndex;
                for(var i = 0; i< aJSON2.length; i++){
                    var sIndex = aJSON2[i].songType + '$' + aJSON2[i].id;
                    aIndex.push(sIndex);
                    wsingHelper.aIndex.push(new SongIndex(sIndex));
                }
                return jsonpp('http://service.5sing.kugou.com/song/find?songinfo=' + aIndex.join('$'));
            }
        })
        .then(function(res){
            wsingHelper.aJSON = res;
            for (var i = 0, Song; i < wsingHelper.aJSON.length; i++) {
                Song = wsingHelper.aJSON[i];
                var song = {
                    id: Song.id,
                    src: Song.sign,
                    type: Song.songtype,
                    space: 'http://5sing.kugou.com/' + Song.userid,
                    singer: Song.nickname,
                    avatar: Song.avatar,
                    songName: Song.songname,
                    description: ''
                };
                var sIndex = song.type + '$' + song.id;
                wsingHelper.mSong[sIndex] = song;
            }
            createList(wsingHelper.container.olSong);
            locked = false;
            notify('载入完成', 3000);
        })
        .catch(function(err){
            node.innerHTML= (err== 1? '已到达结尾': '载入失败，点击重试' + err);
            notify(node.innerHTML, 3000);
        });
        setTimeout(function(){
            if(locked) node.innerHTML= '载入中……点击重试';
            locked = false;
        },3000);
    }

    function fetchInSpace(node, songId, songKind){
        locked = true;
        node.innerHTML= '载入中……';
        notify('载入中……');
        var LastSong = (wsingHelper.aIndex[wsingHelper.aIndex.length-1] || {}).song || {},
            id = songId || LastSong.id,
            type = songKind || (LastSong.type== 'yc'? 1 : LastSong.type == 'fc'? 2: 3);
        if (!id) return;
        sHeadIndex = type + '$' + id; // function as jsonp lock
        //use jsonp via normal callback approach
        jsonp('http://service.5sing.kugou.com/song/songListBySongId?songId=' + id +'&songKind='+ type + '&userId=' + window.OwnerUserID + '&isPrev=1&isNext=0', function(res){
            var sIndex = type + '$' + id;
            if (sIndex != sHeadIndex)
                // prevent duplicate jsonp execution
                return;
            else
                // right jsonp, continue execution and reset the jsonp lock to prevent other jsonp from execution
                sHeadIndex = '';
            var aJSON2 = wsingHelper.aJSON2 = res;
            if(aJSON2.length === 0){
                locked = false;
                notify('已到达结尾', 3000);
                node.innerHTML= '已到达结尾';
                ended = true;
            }
            else{
                var aIndex= [];
                for(var i = 0; i< aJSON2.length; i++){
                    var sIndex = aJSON2[i].songType + '$' + aJSON2[i].id;
                    aIndex.push(sIndex);
                    wsingHelper.aIndex.push(new SongIndex(sIndex));
                }
                jsonp('http://service.5sing.kugou.com/song/find?songinfo=' + aIndex.join('$'),function(res){
                    wsingHelper.aJSON = res;
                    if(res.length === 0){
                        locked = false;
                        notify('出现错误，歌曲不存在', 3000);
                        node.innerHTML= '出现错误，歌曲不存在';
                    }
                    else{
                        for (var i = 0, Song; i < wsingHelper.aJSON.length; i++) {
                            Song = wsingHelper.aJSON[i];
                            var song = {
                                id: Song.id,
                                src: Song.sign,
                                type: Song.songtype,
                                space: 'http://5sing.kugou.com/' + Song.userid,
                                singer: Song.nickname,
                                avatar: Song.avatar,
                                songName: Song.songname,
                                description: ''
                            };
                            var sIndex = song.type + '$' + song.id;
                            wsingHelper.mSongs[sIndex] = song;
                        }
                        createList(wsingHelper.container.olSong);
                        locked = false;
                        notify('载入完成', 3000);
                    }
                });
            }
        });
        setTimeout(function(){
            if(locked) node.innerHTML= '载入中……点击重试';
            locked = false;
        },3000);
    }

    function fetchInCenter(node){
        locked = true;
        node.innerHTML= '载入中……';
        notify('载入中……');
        var nList = wsingHelper.nList + 1,
            url= '/my/handler/message?ts=' + (new Date()).getTime(),
            xhr = new XMLHttpRequest();
        xhr.onload = function(e){
            if (nList != wsingHelper.nList + 1){
                return;
            }
            var aData = JSON.parse(xhr.response).Data, i, n;
            if(aData.length === 0){
                node.innerHTML= '已到达结尾';
                notify('已到达结尾', 3000);
                ended = true;
                locked = false;
            }
            else{
                // search in existed songs list to prevent repeat
                //for(i = 0; i< aData.length; i++){
                //    if(aData[i].Category == 1){
                //        for(n = 0; n< wsingHelper.aIndex.length; n++){
                //            if(aData[i].BelongId === wsingHelper.aIndex[n].id) break;
                //        }
                //        break;
                //    }
                //}
                for(var Song, i=0; i < aData.length; i++) {
                    if(aData[i].Category == 1){
                        Song = JSON.parse(aData[i].Content);
                        var song = {
                            id: aData[i].BelongId,
                            src: Song.FileName,
                            type: Song.SongType == 1? 'yc': Song.SongType == 2? 'fc': Song.SongType == 3? 'bz':'',
                            space: 'http://5sing.kugou.com/' + aData[i].SrcUser.NewUserID,
                            singer: aData[i].SrcUser.NickName,
                            avatar: aData[i].SrcUser.Img,
                            songName: Song.SongName,
                            description: Song.Content? Song.Content.replace(/\[(img)\].*?\[\/(\1)\]/,''): ''
                        };
                        if (!!song.type){
                            var sIndex = song.type + '$' + song.id;
                            wsingHelper.aIndex.push(new SongIndex(sIndex));
                            wsingHelper.mSongs[sIndex] = song;
                        }
                    }
                }
                wsingHelper.container.olSong && wsingHelper.createList(wsingHelper.container.olSong);
                console.log('completed',nList, wsingHelper.nList);
                wsingHelper.nList = nList;
                notify('载入完成', 3000);
                locked = false;
            }
        };
        xhr.onerror = function(){
            node.innerHTML= '载入失败，点击重试';
            notify('载入失败', 3000);
            locked = false;
        };
        xhr.ontimeout = function(){
            node.innerHTML= '载入超时，点击重试';
            notify('载入超时', 3000);
            locked = false;
        };
        xhr.open('get', url + '&page=' + nList + '&group=-1');
        xhr.timeout = 15000;
        xhr.send();
    }

    function fetchMore(node, songId, songKind){
        if (locked) return;
        //in personal center
        if(window.location.href.indexOf('://5sing.kugou.com/my/')!== -1){
            fetchInCenter(node);
        }
        //in singer space
        else if(/:\/\/5sing\.kugou\.com\/\w+\/[a-z]+\/(\d+)\.html/.test(window.location.href)){
            fetchInSpace(node, songId, songKind);
            //fetchInSpaceP(node, songId, songKind);
        }
        //try searching all songs of the singer in the main page of singer space
        else if(/:\/\/5sing\.kugou\.com\/\w+(\/default\.html|\/)?(#|$)/.test(window.location.href)){
            fetchInSpace(node, songId, songKind);
            //fetchInSpaceP(node, songId, songKind);
        }
        else{
            node.innerHTML= '当前页面没有可以继续载入的歌曲';
            ended = true;
        }
    }

    function fetchToEnd(){
        var nInterval;
        var node = window.document.$('.helper_more');
        function doFetch(){
            fetchMore(node);
            if (ended) window.clearInterval(nInterval);
        }
        nInterval = window.setInterval(doFetch, 3000);
        notify('将尝试载入全部歌曲信息...')
    }

    function buildMy(){
        var divMain = wsingHelper.container = coin('div', 'helper_container', 'helper_container');
        var divBanner = coin('div','helper_banner');
        var button1 = coin('button','helper_left','','','上一首'), 
            button2 = coin('button','helper_right','','','下一首'), 
            button3 = coin('button','helper_right','','','重载列表'), 
            button4 = coin('button','helper_left','','','循环播放'),
            button5 = coin('button','helper_left','','','列表播放'),
            button6 = coin('button','helper_right','helper_set','','功能设置'),
            divInfo = coin('div','helper_info helper_clear'),
            divSet = coin('div','helper_setting','helper_setting');
        divSet.style.display= 'none';
        divSet.isInit = false;
        button1.onclick = function(e){
            wsingHelper.loadSong(wsingHelper.player.playing - 1);
        };
        button2.onclick = function(e){
            wsingHelper.loadSong(wsingHelper.player.playing + 1);
        };
        button3.onclick = function(e){
            wsingHelper.searchSong();
            wsingHelper.createList(wsingHelper.container.olSong);
        };
        button4.onclick = function(e){
            wsingHelper.player.repeat= !wsingHelper.player.repeat;
            localStorage.helper_play= (wsingHelper.player.repeat?'1':'0') + (wsingHelper.player.sequence? '1' : '0');
            this.className= (wsingHelper.player.repeat? this.className + ' helper_selected' : this.className.replace(/ ?helper_selected/g,''));
        };
        button4.className= (wsingHelper.player.repeat? button4.className + ' helper_selected' : button4.className.replace(/ ?helper_selected/g,''));
        button5.onclick = function(e){
            wsingHelper.player.sequence= !wsingHelper.player.sequence;
            localStorage.helper_play= (wsingHelper.player.repeat? '1' : '0') + (wsingHelper.player.sequence? '1' : '0');
            this.className= (wsingHelper.player.sequence? this.className + ' helper_selected' : this.className.replace(/ ?helper_selected/g,''));
        };
        button5.className= (wsingHelper.player.sequence? button5.className + ' helper_selected' : button5.className.replace(/ ?helper_selected/g,''));
        button6.onclick = function(e){
            if(divSet.isInit === false){
                createOption(divSet);
                resetOption(divSet);
                divSet.isInit = true;
            }
            if(divSet.style.display == 'none'){
                resetOption(divSet);
                divSet.style.display= 'block';
                this.className+= ' helper_selected';
            }
            else{
                divSet.style.display= 'none';
                this.className = this.className.replace(/ ?helper_selected/g,'');
            }
        };
        var divBottom = coin('div','helper_bottom helper_clear');
        var button7 = coin('button','helper_left','','','全选');
        var button8 = coin('button','helper_left','','','撤销');
        var button9 = coin('button','helper_right helper_send','helper_send','','在独立播放页中播放');
        var button10 = coin('button','helper_right','','','查看下载地址');
        button7.onclick = function(e){
            for( var i = 0; i< wsingHelper.container.aCheck.length; i++){
                wsingHelper.container.aCheck[i].checked = true;
            }
        };
        button8.onclick = function(e){
            for( var i = 0; i< wsingHelper.container.aCheck.length; i++){
                wsingHelper.container.aCheck[i].checked = false;
            }
        };
        button9.onclick = function(e){
            var sSongs= '{"data":"',aTemp= [];
            for( var i = 0; i< wsingHelper.container.aCheck.length; i++){
                if( wsingHelper.container.aCheck[i].checked === true){
                    aTemp.push( wsingHelper.aIndex[i].song.type + '$' + wsingHelper.aIndex[i].song.id);
                }
            }
            sSongs+= aTemp.join('$') + '","type":0,"playNow":false}';
            wsingHelper.setSongCookies(sSongs);
            try{
                var time = parseInt(window.globals.cookies.get("fmPageTime"));
                if(isNaN(time)){
                    window.open("/fm/m/");
                }
            }catch(e){
                console.log(e)
                window.open("/fm/m/");
            }
        };
        button10.onclick = function(e){
            var div1 = wsingHelper.container.$('.helper_prompt');
            if(!div1){
                var aSongs= [];
                for( var i = 0; i< wsingHelper.container.aCheck.length; i++){
                    if( wsingHelper.container.aCheck[i].checked === true){
                        aSongs.push(wsingHelper.aIndex[i].song);
                    }
                }
                div1 = coin('div','helper_prompt','helper_temp');
                var ol1 = coin('ol'),
                    ol2 = coin('ol');
                for( var i = 0; i< aSongs.length; i++){
                    var li1 = coin('li','','','',aSongs[i].songName),
                        li2 = coin('li','','','','<a href="'+ aSongs[i].src +'">'+ aSongs[i].src +'</a>');
                    ol1.appendChild(li1);
                    ol2.appendChild(li2);
                }
                ol1.appendChild(coin('li','helper_holder','','',' '));
                ol2.appendChild(coin('li','helper_holder','','',' '));
                div1.appendChild(ol1);
                div1.appendChild(ol2);
                wsingHelper.container.children[2].appendChild(div1);
            }
            else
                div1.parentNode.removeChild(div1);
        };
        var notifier = wsingHelper.container.notifier = coin('div', 'helper_notifier', 'helper_notifier', '', '提示');
        try{
            wsingHelper.searchSong();
        }catch(e){console.log(e);}
        var divList = coin('div','helper_list'),
            divPlayer = coin('div','helper_player helper_clear');
        var Ol = createList();
        var audio = coin('audio','helper_audio','helper_audio');
        wsingHelper.player.audio = audio;
        audio.autoplay = false;
        audio.controls = true;
        wsingHelper.player.audio.volume = wsingHelper.player.volume;
        audio.addEventListener('ended',function(e){
            if( wsingHelper.player.sequence){
                loadSong(wsingHelper.player.playing + 1);
            }
            else if(wsingHelper.player.repeat){
                wsingHelper.player.audio.play();
            }
        });
        audio.addEventListener('volumechange',function(e){
            localStorage.helper_volume = wsingHelper.player.audio.volume.toFixed(2) + '';
        });
        audio.addEventListener('error', function(e){
            if(wsingHelper.player.audio.src.slice(-4) != '.wma'){
               wsingHelper.fix(wsingHelper.aIndex[wsingHelper.player.playing].song);
            }
        });
        var t = localStorage.helper_pos;
        if(/^[1234]$/.test(t))
            adjust(t,divMain,60,50);
        window.addEventListener('keydown',keyHandle2);
        divPlayer.appendChild(audio);
        divBanner.appendChild(button1);
        divBanner.appendChild(button2);
        divBanner.appendChild(button3);
        divBanner.appendChild(button4);
        divBanner.appendChild(button5);
        divBanner.appendChild(button6);
        divBanner.appendChild(divInfo);
        divBottom.appendChild(button7);
        divBottom.appendChild(button8);
        divBottom.appendChild(button9);
        divBottom.appendChild(button10);
        divList.appendChild(Ol.ol1);
        divList.appendChild(Ol.ol2);
        divMain.appendChild(divSet);
        divMain.appendChild(divBanner);
        divMain.appendChild(divList);
        divMain.appendChild(divBottom);
        divMain.appendChild(divPlayer);
        divMain.appendChild(notifier);
        document.body.appendChild(divMain);
    }

    function setUpUI() {
        try{
            document.head.removeChild(document.$('#helper_style'));
            document.body.removeChild(document.$('#helper_container'));
            document.body.removeChild(document.$('#helper_toggle'));
        }
        catch(e){}

        var style = coin('style',false,'helper_style');
        style.innerHTML = [
            '.helper_toggle {position: fixed; top: 100px; left: 10px; background: rgba(98, 183, 102, 0.5); width: 28px; height: 28px; border-radius: 14px;z-index: 99999}',
            '.helper_toggle *{top: 0px; right: 0px; bottom: 0px; left: 0px; margin: 4px; border-radius: 10px; position: absolute; background: white}',
            '.helper_toggle.helper_activate {background: rgba(98, 183, 102, 1); box-shadow: 0px 0px 3px #aaa;}',
            '.helper_container {position: fixed; z-index: 99999; top: 60px; left: 50px; background: white; border: 1px solid; overflow: visible; font: 12px/1.5 "Microsoft Yahei",Tahoma,Helvetica,Arial,sans-serif; color: black; text-align: left;}',
            '.helper_container * {color: black !important; overflow: visible; visibility: unset}',
            '.helper_container body, form, p, ol, ul, p, h1, h2, h3, h4, li, dt, dd, dl, li {padding: 0px; margin: 0px}',
            '.helper_container button {background: white; border-radius: 3px; border: #6C0 solid 1px; margin: 2px; cursor: pointer; box-shadow: 1px 1px 0px #aaa;}',
            '.helper_container button.helper_selected {background-color: #6c0;}',            
            '.helper_container ol,ul {white-space: nowrap; list-style: none;}',
            '.helper_container img {box-shadow: 0px 0px 2px #888; max-width: 200px; max-height: 200px}',
            '.helper_container .helper_banner {overflow: hidden; background: white; position: relative; z-index: 1}',
            '.helper_container .helper_banner .helper_info {padding: 0px 5px; width: 440px; min-width: 420px; height: 100px; overflow: auto; resize: both; border-bottom: solid 1px;}',
            '.helper_container .helper_banner .helper_info .helper_description {white-space: pre-line; padding: 3px}',
            '.helper_container .helper_banner .helper_info a {border: none; margin: 4px; font-weight: normal; font-size: medium;}',
            '.helper_container .helper_banner .helper_info a img {width: 60px; height: 60px}',
            '.helper_container .helper_setting {position: absolute; z-index: 10; top: 25px; left: 0px; right: 0px; bottom: 35px; background: white; border: none; overflow: auto; text-align: initial;}',
            '.helper_container .helper_setting * {margin: 3px;}',
            '.helper_container .helper_setting div {padding: 2px; overflow: auto}',
            '.helper_container .helper_setting #helper_opt ul {padding-right: 50px}',
            '.helper_container .helper_setting #helper_opt ul li {max-width: 40%; height: 28px}',
            '.helper_container .helper_setting #helper_opt input {width: 60px; height: 20px}',
            '.helper_container .helper_setting .helper_about {overflow: hidden}',
            '.helper_container .helper_setting .helper_about>* {visibility: hidden; margin: 0}',
            '.helper_container .helper_setting .helper_about:hover>* {visibility: visible}',
            '.helper_song {float: left;}',
            '.helper_singer {float: right;}',
            '.helper_list {height: 300px; min-width: 400px; padding: 5px; overflow: auto; resize: vertical}',
            '.helper_list li {padding: 5px; height: 20px;}',
            '.helper_list .helper_songlist li:nth-child(odd) {background: #EEEEEE}',
            '.helper_list .helper_songlist li:nth-child(even) {background: #FFFFFF}',
            '.helper_list .helper_songlist li.helper_player_playing {background: #96E977;}',
            '.helper_list .helper_songlist li.helper_more {text-align: center;}',
            '.helper_list .helper_songlist li>* {display: block; overflow: hidden; height: 100%;}',
            '.helper_checklist {float: left; z-index: 2;}',
            '.helper_checklist input {margin: 3px;}',
            '.helper_player {position: relative; padding-top:8px;display: block}',
            '.helper_player audio {display: block; width: 100%}',
            '.helper_prompt {position: absolute; overflow: auto; top: 2px; right: 20px; bottom: 80px; left: 2px; z-index:10; background: white; max-height: 100%; border: solid 1px;}',
            '.helper_prompt ol {border: 1px; overflow: auto; min-height: 100%}',
            '.helper_prompt ol:nth-child(1) {float: left; width: 35%}',
            '.helper_prompt ol:nth-child(2) {overflow: auto; padding-left: 10px; border-left: solid 1px}',
            '.helper_notifier {font-size: medium; position: fixed; top: 0px; left: 0px; display: none; background: rgba(0, 0, 0, 0.5); color: white !important; padding: 2px 8px; white-space: pre}',
            '.helper_left {float: left} .helper_right {float: right} .helper_clear {clear: both} .helper_clearL {clear: left} .helper_clearR {clear: right}'
        ].join('\n');
        document.head.appendChild(style);
        if(window.location.href.indexOf('://5sing.kugou.com/')!== -1){
            var divToggle = coin('div','helper_toggle','helper_toggle');
            divToggle.onclick = function(e){
                e.preventDefault();
                var container = document.$('.helper_container');
                if(!container)
                    buildMy();
                else{
                    container.style.display= (container.style.display == 'none' ?'':'none');            
                    if(wsingHelper.player.volfix == '1'){
                        // a workaround to bypass the mistaken volume indicating in firefox when change the css 'display'
                        var t = wsingHelper.player.audio.volume;
                        wsingHelper.player.audio.volume = 1;
                        wsingHelper.player.audio.volume = t;
                    }
                }
                divToggle.className += ' helper_activate';
            };
            divToggle.innerHTML= '<a href="###面板开关"></a>';
            checkSetting();
            window.addEventListener('keydown',keyHandle1);
            var t = localStorage.helper_pos;
            if(/^[1234]$/.test(t))
                adjust(t,divToggle,100,10);
            document.body.appendChild(divToggle);
        }
    }

    function init(){
        if(location.href.indexOf('://static.5sing.kugou.com/???') !== -1) {
            //modify cookies in static.5sing.kugou.com by operating in a new iframe
            var data = decodeURIComponent(location.href.match(/\?\?\?(.+)$/)[1])
            console.log('transfered', data)
            localStorage.setItem('fmPage_Add',decodeURIComponent(data));
            //console.log(localStorage);
            return;
        }
        console.log('helper start');
        try{
            Object.defineProperty(navigator, 'plugins', {
                get: function () {return {length: 0};}
            });
        }catch(e){console.log(e);}
        prepare();
        if(localStorage.helper_autoplay !== '1'){
            preventAutoplay();
        }
        document.addEventListener('DOMContentLoaded',setUpUI);
        console.log('helper end');
    }

    init();
    window.wsingHelper = wsingHelper;
}

try{
    main();
}catch(e){console.log(e);}

// three way to run the script with debug ability.
//var script = document.createElement('script');script.innerHTML = '(' + main.toString() + ')()';document.head.appendChild(script);
//var script = document.createElement('script');script.innerHTML = 'eval(decodeURI("' + encodeURI('debugger;' + main.toString()) + 'main();"))';document.head.appendChild(script);
//var script = document.createElement('script');script.src = 'data:text/javascript;base64,' + btoa('debugger;' + main.toString() + 'main();');document.head.appendChild(script);
