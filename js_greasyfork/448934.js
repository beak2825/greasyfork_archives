// ==UserScript==
// @name         YouPorn (老司机懂的)广告网页去除&收藏功能
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Youporn 收藏功能去广告 看到喜欢的直接收藏 随时跳转 
// @author       __Kirie__
// @match        https://*.com:58002/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448934/YouPorn%20%28%E8%80%81%E5%8F%B8%E6%9C%BA%E6%87%82%E7%9A%84%29%E5%B9%BF%E5%91%8A%E7%BD%91%E9%A1%B5%E5%8E%BB%E9%99%A4%E6%94%B6%E8%97%8F%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/448934/YouPorn%20%28%E8%80%81%E5%8F%B8%E6%9C%BA%E6%87%82%E7%9A%84%29%E5%B9%BF%E5%91%8A%E7%BD%91%E9%A1%B5%E5%8E%BB%E9%99%A4%E6%94%B6%E8%97%8F%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var shorturl = 'bmt17.com';
    const log = console.log;

    function isInArray(str,array) {
        var n = false;
        for(var i = 0;i < array.length;i++) {
            if(str == array[i].path) {
                n = true;
            }
            if(i == array.length - 1) {
                return n;
            }
        }
    }

    function deleteStrInArray(str,array) {
        for(var j = 0;j < array.length;j++) {
            if(str == array[j].path) {
                array.splice(j,1);
                return array;
            }
        }
    }

    function getUrlSymbol(...rest) {
        var url = window.location.href;
        if(rest.length == 1) {
            url = rest[0];
        }
        var reg = /(?<=\/\/).*(?=.com)/;
        return url.match(reg)[0];
    }

    $(document).ready(function () {

        log(getUrlSymbol());
        log($('.stui-pannel-box .title').text());
        log(GM_getValue('url'));
        //url初始化
        if(GM_getValue('url') == undefined) {
            var fakedata = new Array();
            fakedata.push({
                'title':'fake',
                'path':'fakepath'
            });
            GM_setValue('url',fakedata);
        }
        //恢复不同域名的收藏
        if(GM_getValue('url').length >= 2 && getUrlSymbol(GM_getValue('url')[1].path) != getUrlSymbol()) {
            log('recovering..,')
            var replacehref = new Array();
            replacehref = GM_getValue('url');
            for(var c = 1;c < replacehref.length;c++) {
                var newpath = replacehref[c].path.replace(/(?<=\/\/).*(?=.com)/,getUrlSymbol());
                replacehref[c].path = newpath;
            }
            GM_setValue('url',replacehref);
            log('recovered!')
        }
        //广告去除
        
        let hengfu = document.querySelector('#hengfu_pc_vod_shang');
        if(hengfu != null) {
            // log(hengfu);
            hengfu.remove();
        }
                
            
       
        //去除 xs_url mh_url 必定存在
        $('#xs_url').remove();
        $('#mh_url').remove();

        //引入样式
        GM_addStyle('.collectboxwrap a:hover {color:red;} .collectboxwrap {width:300px;height:20px;font-size:5px;text-align:left;line-height:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}');
        GM_addStyle('.collectbox {width:300px;height:1200px;background-color:#ebf0d9;position:fixed;opacity:0.9;top:200px;left:30px;display:none;}');
        //生成收藏按钮 和 取消收藏按钮
        function createCollectOrNocollect() {

            if(isInArray(window.location.href,GM_getValue('url'))) {
                //取消收藏
                var p2 = document.querySelector('#p1');
                var a1 = document.createElement('a');
                $(a1).addClass('nocollect');
                a1.innerHTML = '取消收藏';
                a1.style.fontSize = '25px';
                a1.style.color = 'red';
                p2.appendChild(a1);
            }else {
                //收藏
                var p1 = document.querySelector('#p1');
                var a = document.createElement('a');
                $(a).addClass('collect');
                a.innerHTML = '收藏';
                a.style.fontSize = '25px';
                a.style.color = 'red';
                $(p1).append(a);
            }

        }
        createCollectOrNocollect();
        if(isInArray(window.location.href,GM_getValue('url'))) {
            nocollectEvent();
        }else {
            collectEvent();
        }


        //为 未来 收藏和取消收藏元素  绑定事件
        function collectEvent() {
            $('.collect').on('mouseover',function() {
                this.style.color = 'skyblue';
                this.style.cursor = 'pointer';
            });
            $('.collect').on('mouseleave',function() {
                this.style.color = 'red';
                this.style.cursor = 'default';
            });
            $('.collect').on('click',function() {
                var arr = GM_getValue('url');
                arr.push({
                    'title':$('.stui-pannel-box .title').text(),
                    'path':window.location.href
                });
                GM_setValue('url',arr);
                alert('\n收藏成功!');

                $(this).off('mouseover');
                $(this).off('mouseleave');
                $(this).off('click');
                $(this).remove();
                createCollectOrNocollect();
                nocollectEvent();
                createCollectboxwrap();
            });
        }
        function nocollectEvent() {
            $('.nocollect').on('mouseover',function() {
                this.style.color = 'skyblue';
                this.style.cursor = 'pointer';
            });
            $('.nocollect').on('mouseleave',function() {
                this.style.color = 'red';
                this.style.cursor = 'default';
            });
            $('.nocollect').on('click',function() {
                var ar = GM_getValue('url');
                ar = deleteStrInArray(window.location.href,ar);
                GM_setValue('url',ar);
                alert('\n取消收藏成功!');

                $(this).off('mouseover');
                $(this).off('mouseleave');
                $(this).off('click');
                $(this).remove();
                createCollectOrNocollect();
                collectEvent();
                createCollectboxwrap();
            });
        }

        //生成收藏夹
        var menu = document.querySelector('.stui-header__menu');
        var favorites = '<li><a id="favorites">收藏夹</a></li>';
        $(menu).append(favorites);
        $('#favorites').on('mouseover',function() {
            this.style.color = 'skyblue';
            this.style.cursor = 'pointer';
        });
        $('#favorites').on('mouseleave',function() {
            this.style.color = 'white';
        });

        //生成收藏夹框
        var collectbox = '<div class="collectbox"><a href="https://n8bz4hoxy6g51ib.com:58002/index.php/vod/play/id/122073/sid/1/nid/1.html">https://n8bz4hoxy6g51ib.com:58002/index.php/vod/play/id/122073/sid/1/nid/1.html</a></div>';
        $('body').append(collectbox);
        


        //生成收藏夹数据
        function createCollectboxwrap() {
            var collectList = new Array();
            collectList = GM_getValue('url');
            $('.collectbox').children().remove();
            // alert(collectList);
            $('.collectbox').css({
                'height':(collectList.length-1) * 20 + 'px'
            });
            if(collectList.length >= 38) {
                $('.collectbox').css({
                    position:'absolute'
                });
            }else {
                $('.collectbox').css({
                    position:'fixed'
                });
            }
            if(collectList.length == 1) {
                alert('\n您并没有收藏任何影片！\n快去收藏吧！');
            }else {
                for(var k = 0;k < collectList.length;k++) {
                    var ele = '<div class="collectboxwrap"><a href='+collectList[k].path+'>'+collectList[k].title+'</a></div>';
                    //排除第一条数据 fakedata
                    if(collectList[k].title == 'fake') {

                    }else {
                        $('.collectbox').append(ele);
                    }
                }
            }
            
        }
        //为 收藏夹 绑定事件
        var isDisplay = 0;
        $('#favorites').on('click',function() {
            if(isDisplay == 0) {
                createCollectboxwrap();
                
                $('.collectbox').css({
                    'display':'block'
                });

                isDisplay = 1;
            }else {
                createCollectboxwrap();

                $('.collectbox').css({
                    'display':'none'
                });

                isDisplay = 0;
            }

        });

        //去除3d        
        var reg3d = /.*3D.*/;
        var label = new Array();
        log($('.stui-vodlist__box').length);
        for(var m = 0;m < $('.stui-vodlist__box').length;m++) {
            // log($('.stui-vodlist__box')[m].children[0].getAttribute('title'));
            if(reg3d.test($('.stui-vodlist__box')[m].children[0].getAttribute('title'))) {
                label.push(m);
            }
        }
        for(var p = 0;p < label.length;p++) {
            // log($($('.stui-vodlist__box')[label[p]]).parent());
            $($('.stui-vodlist__box')[label[p]]).parent().addClass('willdelete');
        }
        $('.willdelete').remove();








    });


    



})();