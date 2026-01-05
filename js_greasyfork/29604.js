// ==UserScript==
// @name         AutoSpeak
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Automatic input!
// @author       kizj
// @include      http://www.douyu.com/t/*
// @include      https://www.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29604/AutoSpeak.user.js
// @updateURL https://update.greasyfork.org/scripts/29604/AutoSpeak.meta.js
// ==/UserScript==

(function() {
    var sourceTxt=$('.cs-textarea');
    var sourceBtn=$('.b-btn');

    if(sourceTxt.length!==0){
        $('body').append(`
            <div class="autobox">
                <div class="tt">

                    <div class="zoom">一</div>
                </div>
                <div class="autospeak">
                    <h3>自动喊话</h3>
                    <div class="btnbox row">
                        <div class="explain">自动喊话开关：</div>
                        <div class="btn">
                            <div class="swh"></div>
                        </div>
                        <div style="clear:both;"></div>
                    </div>
                    <div class="txt1 row">当前自动喊话功能已关闭！</div>
                    <div class="timebox row">
                        <div class="explain">自动喊话间隔：</div>
                        <input class="timein" type="text" value="2"/>
                        <div style="clear:both;"></div>
                    </div>
                </div>
            </div>
        `);

        var autoBox = $('.autobox');
        var autoTT = $('.autobox .tt');
        var autoZoom = $('.autobox .zoom');
        var autoSpeak = $('.autobox>.autospeak');
        var autoH3=$('.autobox h3');
        var autoBtnBox = $('.autobox .btnbox');
        var autoEpn=$('.autobox .explain');
        var autoBtn=$('.autobox .btn');
        var autoSwh=$('.autobox .swh');
        var txt1=$('.autobox .txt1');
        var timeIn=$('.autobox .timein');
        
        //颜色主题
        var skintt='#999';//标题栏
        var skinbg='#fff';//背景颜色
        var skinbd='1px solid #999';//边框
        var skinn3='#999';//h3标签的文字颜色
        var skinfn='#000';//其他文字的颜色
        var skinswh='#999';//开关的颜色
        var skinsc='#666';//开关关闭状态的底色
        var skinso='#0d4';//开关打开状态的底色
        var skinZoom='#f00';


        autoBox.css({
            // 'width': '100%',
            // 'height': '100px',
            'background': skinbg,
            'position': 'fixed',
            'border':skinbd,
            // 'left': '0',
            'bottom': '0',
            'font-family':'"Microsoft YaHei", simsun, Arial, sans-serif',
            'z-index': '99999999999',
            // 'padding':'20px',
        });
        autoTT.css({
            'background': skintt,
            'font-size':'14px',
            'height':'20px',
            'line-height':'20px',
            'cursor':'move',
            
        });
        autoZoom.css({
            'height':'20px',
            'width':'20px',
            'line-height':'20px',
            'text-align':'center',
            'float':'right',
            'padding':'0 10px', 
            'cursor':'pointer',
        });

        autoSpeak.css({
            // 'width': '100%',
            'border':skinbd,
            'padding':'20px',
            'position':'relative',
            'margin':'15px',
        });

        autoH3.css({
            'font-size': '16px',
            'line-height':'16px',
            'position':'absolute',
            'left':'5px',
            'top':'-8px',
            'background':skinbg,
            'color':skinn3,
            'font-weight':'normal',
        });

        $('.autobox .row').css({
            'font-size': '12px',
            'line-height': '12px',
            'color': skinfn,
            'height':'20px',
            'margin':'5px 0',
        });

        autoEpn.css({
            'float':'left',
            'font-size':'14px',
            'line-heigt':'14px',
            'padding':'3px 0',
            'margin-right':'10px',
        });

        var swhSize=20;
        var btnSize=swhSize*2;
        var otherLeft=btnSize-swhSize;

        var btnWid=btnSize;
        var btnHei=swhSize;

        var swhWid=swhSize;
        var swhHei=swhSize;

        autoBtn.css({
            'float':'right',
            'width':btnWid,
            'height':btnHei,
            'background':skinsc,
            'position':'relative',
            'cursor':'pointer',
        });

        autoSwh.css({
            'width':swhWid,
            'height':swhHei,
            'background':skinswh,
            'position':'absolute',
            'left':'0',

        });

        txt1.css({
            'font-size':'12px',
            'line-height':'20px',
            'text-align':'center',
        });

        timeIn.css({
            'width':'30px',
        });

        // var boxLeft=null;
        
        // $(window).on('resize load',function(){
        //         boxLeft=($(window).width()-autoBox.width())/2;
        //     autoBox.css('left',boxLeft);
        // });

        boxBTM=autoBox.height()-autoTT.height();
        var boxSta=0

        autoZoom.mouseover(function(){
            autoZoom.css('background',skinZoom);
        });

        autoZoom.mouseout(function(){
            autoZoom.css('background','');
        });

        //拖拽;
        var _move=false;
        var disX=0;
        // var disY=0;

        autoTT.mousedown(function(e){
            _move=true;
            disX=e.pageX-parseInt(autoBox.css('left'));
            // disY=e.pageY-parseInt(autoBox.css('top'));
        })
        $(document).mousemove(function(e){
            if(_move){
                var x=e.pageX-disX;
                // var y=e.pageY-disY;
                // autoBox.css({'left':x,'top':y});
                autoBox.css('left',x);
                return false;
            }
        }).mouseup(function(e){
            _move=false;
        });



        autoZoom.click(function(){
            if(boxSta===0){
                autoBox.animate({'bottom':-boxBTM},function(){
                    autoZoom.text('口');
                    boxSta=1;
                });
            }
            if(boxSta===1){
                autoBox.animate({'bottom':0},function(){
                    autoZoom.text('一');
                    boxSta=0;
                });
            }
            
        });

        var state=0;
        var neirong=null;
        var timer=null;
        var autoTime=null;
        var shuchu=null;

        autoBtn.click(function(){
            if(state===0){
                autoSwh.animate({'left':otherLeft},function(){
                    autoBtn.css('background',skinso);
                    state=1;
                    neirong=sourceTxt.val();
                    if(neirong===''){
                        txt1.text('需要输入喊话的内容！');
                        autoSwh.animate({'left':'0'},function(){
                            autoBtn.css('background',skinsc);
                            state=0;
                            clearInterval(timer);
                        });
                    }
                    else{
                        autoTime=timeIn.val()*1000;
                        timer = setInterval(speak, autoTime);
                        txt1.text('当前自动喊话功能已开启！');
                    }
                });
            }
            if(state===1){
                autoSwh.animate({'left':'0'},function(){
                    autoBtn.css('background',skinsc);
                    state=0;
                    clearInterval(timer);
                    txt1.text('当前自动喊话功能已关闭！');
                });
            }
        });

        function speak(){
            if(shuchu===neirong){
                shuchu = neirong + '.';
            }
            else{
                shuchu = neirong;
            }
            sourceTxt.val(shuchu);
            sourceBtn.click();
        }
    }
    // Your code here...
})();