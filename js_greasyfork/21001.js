// ==UserScript==
// @name         信息提醒音~提醒您~您有信息哟(ฅ´ω`ฅ)
// @namespace    https://greasyfork.org/users/51104
// @version      1.0.5.20160628
// @author       lliwhx
// @description  收到信息会播放自定义的提醒音效
// @homepage     http://weibo.com/lliwhx
// @include      *weibo.com*
// @include      http://bbs.66rpg.com*
// @include      http://tieba.baidu.com*
// @include      http://mail.qq.com*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// @noframes     true
// @compatible   chrome
// @copyright    Copyright (c) 2016 lliwhx
// @license      The MIT License (MIT)
// @downloadURL https://update.greasyfork.org/scripts/21001/%E4%BF%A1%E6%81%AF%E6%8F%90%E9%86%92%E9%9F%B3~%E6%8F%90%E9%86%92%E6%82%A8~%E6%82%A8%E6%9C%89%E4%BF%A1%E6%81%AF%E5%93%9F%28%E0%B8%85%C2%B4%CF%89%60%E0%B8%85%29.user.js
// @updateURL https://update.greasyfork.org/scripts/21001/%E4%BF%A1%E6%81%AF%E6%8F%90%E9%86%92%E9%9F%B3~%E6%8F%90%E9%86%92%E6%82%A8~%E6%82%A8%E6%9C%89%E4%BF%A1%E6%81%AF%E5%93%9F%28%E0%B8%85%C2%B4%CF%89%60%E0%B8%85%29.meta.js
// ==/UserScript==

/*
 * The MIT License (MIT)
 * Copyright (c) 2016 lliwhx
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

window.setTimeout(function(){
    var TIPS = {
        _domNode:'',
        _domText:'',
        _mp3Music:'',
        _options:'',

        init:function(){
            var _host = (location.host).split('.')[1];
            var _host0 = (location.host).split('.')[0];
            switch (_host) {
                case 'weibo': //判断网站
                    this._domNode = document.querySelector('[node-type=msg]'); //不同网站，不同提醒位置
                    this._domText = function(){return !TIPS._domNode.childNodes[1];};
                    this.domFunction('weibo'); //准备状态的条件(信息提醒在当前页面或没有提醒信息)
                    break;

                case '66rpg':
                    this._domNode = document.getElementById('myprompt').firstChild;
                    this._domText = function(){return TIPS._domNode.nodeValue=='提醒';};
                    this.domFunction('66rpg','提醒');
                    break;

                case 'baidu':
                    this._domNode = document.querySelector('.u_menu_wrap.u_news_wrap.j_news').firstChild.firstChild;
                    this._domText = function(){return TIPS._domNode.nodeValue=='0';};
                    this.domFunction('tieba','0');
                    break;

                case 'qq':
                    this._domNode = document;
                    this._domText = function(){return document.getElementById('folder_1').firstChild.nodeValue=='收件箱';};
                    this.domFunction('qq','收件箱',1);
                    break;

                case 'com':
                    switch (_host0) {
                        case 'weibo':
                            this._domNode = document.querySelector('[node-type=msg]');
                            this._domText = function(){return !TIPS._domNode.childNodes[1];};
                            this.domFunction('weibo');
                            break;
                    }
                    break;
            }
        },

        domFunction:function (n,t,c){
            //创建一个可播放MP3
            this._mp3Music = new Audio('http://getmp3.site/download/5590B08C-C9C8C24C-5D7C638B-D2D76761-7764477A-37504870-7151676D-70330040/Overwatch+Genji+Ultimate+Voice+%E3%80%8C%E9%BE%8D%E7%A5%9E%E3%81%AE%E5%89%A3%E3%82%92%E5%96%B0%E3%82%89%E3%81%88%E3%82%A7%E3%82%A7%E3%83%BC%E3%83%83%EF%BC%81%EF%BC%81%E3%80%8D%20-%20(getmp3.site)%2064kbps.mp3'); 
            this._mp3Music.currentTime = 0.0; //设置MP3开始播放的时间，单位：秒，1秒的浮动范围0.01~0.55
            this._mp3Music.volume = 1.0; //必须是介于 0.0 与 1.0 之间的数字，代表百分比的音量
            this._mp3Music.addEventListener('timeupdate', function() {
                if (TIPS._mp3Music.currentTime >= 999999) { //设置MP3结束时间。如果要求播放完MP3，请将该值设置大于MP3的播放时间，比如999999
                    TIPS._mp3Music.pause();
                    TIPS._mp3Music.currentTime = 0.0; //同上，设置为播放MP3的时间
                    GM_setValue(n,1); //1代表无需播放，之后再有提醒也不会播放
                }
                if(TIPS._mp3Music.paused===true){
                    TIPS._mp3Music.currentTime = 0.0;
                    GM_setValue(n,1);
                }
            });

            GM_addValueChangeListener(n, function(name, old_value, new_value, remote) { //判断是否播放歌曲
                console.log(new_value);
                if(new_value==2){ //初始化后判断当前状态
                    if(remote){ //如果存在已经加载好的页面，则刷回状态
                        GM_setValue(n,old_value);
                        return false;
                    }
                    setTimeout(function(){ //，如果没有加载好的页面，延迟判断，避免出现同时刷新页面的情况
                        if(GM_getValue(n)==2){
                            if(TIPS._domText()){
                                GM_setValue(n,false);
                            }else{
                                GM_setValue(n,true);
                            }
                        }},500);
                }
                if(new_value ==1&&!TIPS._mp3Music.paused||new_value===false){ //停止事件只能在正在播放且新的事件为1时执行，或新事件为false则直接停止
                    TIPS._mp3Music.pause();
                    TIPS._mp3Music.currentTime = 0.0;
                }
                if(!remote&&(old_value === false||old_value === 2)&&new_value===true){ //播放事件来源于本页面，且旧事件必须是false或2，且新事件为true
                    TIPS._mp3Music.play();
                    GM_setValue(n,0); //0代表正在播放，防止了其他页面再播放
                }
            });

            document.addEventListener('visibilitychange',function(){ //监视选项卡激活状态
                if(document.visibilityState  == 'visible'&&GM_getValue(n) === 0)
                    GM_setValue(n,1);
            });

            var observer = new MutationObserver(function(mutations){ //监视节点变化，执行不同动作
                mutations.forEach(function(mutation) {
                    if(mutation.type == 'childList'){
                        if(c){
                            if(TIPS._domText()){
                                GM_setValue(n,false);
                                return false;
                            }else{
                                if(document.hidden)
                                    GM_setValue(n,true);
                                else
                                    GM_setValue(n,1);
                                return false;
                            }
                        }
                        if(mutation.removedNodes.length !== 0){
                            GM_setValue(n,false);
                            return false;
                        }
                        if(document.hidden) //只有选项卡没激活才能播放
                            GM_setValue(n,true);
                        else
                            GM_setValue(n,1); //否则直接跳到播放完的状态
                        return false;
                    }
                    if(mutation.target.data === t){ //只有清空了提醒才能进行下一次的播放
                        GM_setValue(n,false); //false表示可以进行播放
                        return false;
                    }
                    if(mutation.oldValue === t){
                        console.log(88);
                        if(document.hidden)
                            GM_setValue(n,true);
                        else
                            GM_setValue(n,1);
                    }
                });
            });

            if(!c){
                this._options ={ //配置监视选项:
                    childList:true,
                    characterData:true,
                    characterDataOldValue:true
                };
            }else{
                this._options ={ //配置监视选项:
                    childList:true,
                    characterData:true,
                    characterDataOldValue:true,
                    subtree:true
                };
            }

            observer.observe(this._domNode,this._options); //传入目标节点和监视选项

            GM_setValue(n,2); //初始化事件
        }
    };
    TIPS.init();
},1000);