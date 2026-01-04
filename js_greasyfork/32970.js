// ==UserScript==
// @name         淘宝众筹自动抢购
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  淘宝众筹自动下单代码，可以将即将放量的众筹项目显示为可点击，点击后即开始进入抢购，其中为提高抢购成功率，默认会将抢购的ID存到cookie中
// @author       Nick Zhang
// @match        https://izhongchou.taobao.com/order/confirm_order.htm*
// @match        https://izhongchou.taobao.com/dreamdetail.htm*
// @match        http://err.taobao.com/error*.html
// @match        https://www.taobao.com/home/wait.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32970/%E6%B7%98%E5%AE%9D%E4%BC%97%E7%AD%B9%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/32970/%E6%B7%98%E5%AE%9D%E4%BC%97%E7%AD%B9%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==

(function() {
    var setCookie = function(name, value, opts){
        if(!name || !value){
            return;
        }
        var cookie = name + '=' + value;
        for(var key in opts){
            cookie +=';' + key + '=' + opts[key];
        }
        document.cookie = cookie;
    },
        getCookie = function(name){
            var result;
            try{
                document.cookie.split(' ').forEach(function(cookie){
                    cookie = cookie.replace(/\;$/,'').split('=');
                    if(cookie[0] == name){
                        result = cookie[1];
                    }
                });
            }catch(e){
            }
            return result;
        },
        getId = function(){
            var id = '';
            try{
                id = window.location.search.match(/itemId\=(\d{1,})/)[1];
            }catch(e){}
            if(!id){
                id = getCookie('tbzcid');
            }
            if(id){
                setCookie('tbzcid', id, {
                    domain : '.taobao.com',
                    path : '/'
                });
            }
            return id;
        },
        createEvent = function(eventName, ofsx, ofsy) {
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(
                eventName , true , false , null ,
                0 , 0 , 0 , ofsx, ofsy, false, false , false, false, 0, null
            );
            return evt;
        },
        moveCode = function(obj, box){
            var boxRect = box.getBoundingClientRect();
            var move = createEvent('mousemove', boxRect.left + obj.offsetLeft + box.clientWidth, boxRect.top + obj.offsetTop - 10),
                down = createEvent('mousedown', boxRect.left + obj.offsetLeft, boxRect.top + obj.offsetTop),
                up = createEvent('mouseup');
            obj.dispatchEvent(down);
            document.dispatchEvent(move);
            obj.dispatchEvent(up);
        };

    if(window.location.href.indexOf('https://izhongchou.taobao.com/dreamdetail.htm') < 0){
        var id = getId();
        var timer;
        //下单页面
        setTimeout(function(){
            var submit = document.querySelectorAll('#J_submitForm'),
                checkboxs = document.querySelectorAll('div.opt-anony input[type=checkbox]');
            if(submit.length && checkboxs.length){
                checkboxs = Array.prototype.slice.call(checkboxs);
                checkboxs.forEach(function(checkbox){
                    checkbox.checked = true;
                });
                var submitFn = function(){
                    window.scrollTo(0,document.body.scrollHeight);
                    if(timer){
                        clearInterval(timer);
                    }
                    var codeBox = document.querySelector('.nc_wrapper');
                    codeObj = document.querySelector('.nc_iconfont');
                    if(codeBox){
                        moveCode(codeObj, codeBox);
                        setTimeout(function(){
                            timer = setInterval(function(){
                                if(document.querySelectorAll('.btn_ok').length > 0){
                                    submit[0].click();
                                } else{
                                    if(document.querySelectorAll('.nc-lang-cnt a').length > 0){
                                        document.querySelectorAll('.nc-lang-cnt a')[0].click();
                                        setTimeout(submitFn, 1500);
                                    } else{
                                        if(document.querySelectorAll('.imgCaptcha_text input').length > 0){
                                            document.querySelectorAll('.imgCaptcha_text input')[0].focus();
                                            document.querySelectorAll('.imgCaptcha_text input')[0].focus();
                                        }
                                    }
                                }
                            }, 500);
                        }, 1500);
                    } else{
                        submit[0].click();
                    }
                };
                submitFn();
            } else {
                setTimeout(function(){
                    if(!!id){
                        window.location.href = 'https://izhongchou.taobao.com/order/confirm_order.htm?itemId=' + id;
                    } else{
                        window.location.reload();
                    }
                },1500);
            }
        },1500);
    } else {
        //详情页面
        setTimeout(function(){
            if(document.querySelector('.reserve-btn') && document.querySelector('.reserve-btn').textContent == '筹款结束') return;
            var items = document.querySelectorAll('.repay');
            var hasFoundCommingItem = false;
            items = Array.prototype.slice.call(items);
            items.forEach(function(item){
                var id = '#'+item.getAttribute('id');
                if(document.querySelectorAll(id + ' .buy-num > em > span').length && document.querySelectorAll(id + ' .buy-num > em > span')[0].textContent > 0){
                    hasFoundCommingItem = true;
                    var link = document.querySelector(id + ' .repay-buy');
                    if(link.getAttribute('class').indexOf('repay-cannotbuy') > -1){
                        link.setAttribute('class', 'repay-buy');
                        link.innerText = '即将开始，点我开抢';
                        link.setAttribute('target','new');
                        link.setAttribute('href','https://izhongchou.taobao.com/order/confirm_order.htm?itemId=' + item.getAttribute('id').replace('repay-',''));
                    }
                }
            });
            if(!hasFoundCommingItem){
                console.warn('还没有发现即将开始抢购的众筹，即将刷新页面获取最新数据');
                setTimeout(function(){
                    window.location.reload();
                }, 2000);
            } else{
                console.info('已经找到即将开始的众筹项目，看页面点击吧');
            }
        },1000);
    }
})();