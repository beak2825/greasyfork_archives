// ==UserScript==
// @name         自动提醒工具
// @version      0.0.1.13
// @description  nyan
// @author       mofumofu
// @match        *.tg333.net/targetList.php
// @match        *.tg333.net/fifa_targetList.php
// @run-at       document-end
// @grant        none
// @namespace undefined
// @downloadURL https://update.greasyfork.org/scripts/369462/%E8%87%AA%E5%8A%A8%E6%8F%90%E9%86%92%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/369462/%E8%87%AA%E5%8A%A8%E6%8F%90%E9%86%92%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    var looptime=5000;//延迟时间，1000为1秒
    //cookie
    var CookieFn=new function(){
        var s=this;
        s.get=function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		    if(arr=document.cookie.match(reg))
		    return unescape(arr[2]);
		    else
		    return null;
        };
        s.set=function(name,value){
            var Days = 30;
		    var exp = new Date();
		    exp.setTime(exp.getTime() + Days*24*60*60*1000);
		    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        };
        s.del=function(name){
            var exp = new Date();
		    exp.setTime(exp.getTime() - 1);
		    var cval=s.get(name);
		    if(cval!=null)
		    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        };
        s.init=function(){};
    };
    //列表3-3信息
    var ShowleftdataFn=new function(){
        var s=this;
        s.checkarr=[];
        s.readarr=[];
        s.getdata1=function(arr,i){
                if(i<s.arr.length-1){
            $.post('ac_targetList.php',{
                gameid:arr[0],
                ga12:arr[1],
                gametime:arr[2],
                noCache:''
            }).then(function(data){
                var con=$('<div></div>');
                con.html(data);
                con.find('.market_whole_cell.table_left').eq(0).find('.cell_43').each(function(){
                    if($(this).text().indexOf('3 - 3')>=0){
                        var man=$('<div class="data33" style=" height: 30px; line-height: 30px; padding-left: 10px; background-color: #fff200; font-weight: bold;"></div>');
                        man.html($(this).siblings('.cell_45').html());
                        var clickt=man.find('.btn_order button').attr('onclick');
                        man.find('.btn_order').remove();
                        var m=man.text().replace(/\n/g,'').replace(/\t/g,'');
                        man.html($(this).text()+'&emsp;'+m+'<button style="float: right; height: 30px; border:none; color:#ffffff; background-color: #ff3838; cursor: pointer;" onclick="'+clickt+'">下注</button>');
                        s.ele.eq(s.arr[i]).find('.data33').remove();
                        s.ele.eq(s.arr[i]).append(man);
                    };
                });
                i++;
                s.loop(i);
            });
                }else{
                   console.log('结束');
                    console.log(GetquotadataFn.quotaView);
                };
         };
         s.getdata=function(arr,callback){
            $.post('ac_targetList.php',{
                gameid:arr[0],
                ga12:arr[1],
                gametime:arr[2],
                noCache:''
            }).then(function(data){
                var con=$('<div></div>');
                con.html(data);
                con.find('.market_whole_cell.table_left').eq(0).find('.cell_43').each(function(){
                    if($(this).text().indexOf('3 - 3')>=0){
                        var man=$('<div></div>');
                        man.html($(this).siblings('.cell_45').html());
                        var clickt=man.find('.btn_order button').attr('onclick');
                        man.find('.btn_order').remove();
                        var m=man.text().replace(/\n/g,'').replace(/\t/g,'');
                        var pon=$('<div></div>');
                        pon.html($(this).siblings('.cell_44').html());
                        var p=pon.text();
                        callback(m,p,clickt);
                    };
                });
            });
        };
        s.loop=function(i){
            var inp='[]';
            var cl=s.ele.eq(s.arr[i]).find('.game_wrap').attr('onclick');
            cl=cl.replace(/, /g,',').replace(/\'/g,'"').replace(/\( /g,'(').replace(/ \)/g,')');
            inp='['+cl.substring(cl.indexOf('(')+1,cl.length-1)+']';
            //s.getdata(JSON.parse(inp),i);
        };
        s.show1=function(){
            s.arr=[];
            s.ele=$('.content_block_left_wrap .market_game_list').children('.market_game');
            s.ele.each(function(i,value){
                var tit=$(this).find('.game_category').text().match(/【.+?】/);
                if(tit[0]=='【友谊赛】'){
                    s.arr.push(i);
                };
            });
            s.loop(0);
        };
        s.open=function(){
            s.readcheck(0);
            s.openflag=setInterval(function(){
                console.log(s.checkarr);
                s.readcheck(0);
            },10000);
        };
        s.close=function(){
            clearInterval(s.openflag);
        };
        s.show=function(ele,callback){
            var inp='[]';
            var cl=ele[0].find('.game_wrap').attr('onclick');
            cl=cl.replace(/, /g,',').replace(/\'/g,'"').replace(/\( /g,'(').replace(/ \)/g,')');
            inp='['+cl.substring(cl.indexOf('(')+1,cl.length-1)+']';
            s.getdata(JSON.parse(inp),function(count,pon,clickt){
                //相同列表循环
                $.each(ele,function(i,$ele){
                    $ele.find('.g0').hide();
                    $ele.find('.g1').remove();
                    $ele.find('.g2').remove();
                    if(count==''||count=='无'){
                        count='无';
                    }else{
                        var orderarr='['+clickt.substring(13,clickt.length-2)+']';
                        orderarr=orderarr.replace(/, /g,',');
                        orderarr=orderarr.replace(/\'/g,'"');
                    };
                    $ele.find('.data33').append('<div class="g1" style="display: block; color: #ffffff; background-color: #0be881; font-weight: bold;">&emsp;3-3&emsp;<span class="pon">'+pon+'</span>&emsp;<span class="count">'+count+'</span><button class="close" style=" float: right; height: 30px; padding: 0 5px; font-size: 14px; color: #ffffff; border: none; background-color: #f53b57; font-weight: normal; opacity: 1;">取消</button></div>');
                });
                OrderFn.order(count,clickt,function(){
                try{
                    callback();
                }catch(e){
                    s.checkarr.push(JSON.parse(inp)[0]);
                    var a=[];
                    var j={};
                    $.each(s.checkarr,function(i,value){
                        j[value]='';
                    });
                    $.each(j,function(key,value){
                        a.push(key);
                    });
                    console.log(a);
                    s.checkarr=a;
                    CookieFn.set('checkarr',JSON.stringify(s.checkarr));
                };
                });
           });
        };
        s.active=function(ele){
            var inp='[]';
            var cl=ele.find('.game_wrap').attr('onclick');
            cl=cl.replace(/, /g,',').replace(/\'/g,'"').replace(/\( /g,'(').replace(/ \)/g,')');
            inp='['+cl.substring(cl.indexOf('(')+1,cl.length-1)+']';
            ele.find('.g0').hide();
            ele.find('.g2').remove();
            ele.find('.data33').append('<div class="g2" style="display: block; color: #ffffff; background-color: #0be881; font-weight: bold;">&emsp;3-3&emsp;<span class="count">已选择</span><button class="close" style=" float: right; height: 30px; padding: 0 5px; font-size: 14px; color: #ffffff; border: none; background-color: #f53b57; font-weight: normal; opacity: 1;">取消</button></div>');
            s.checkarr.push(JSON.parse(inp)[0]);
            var a=[];
                    var j={};
                    $.each(s.checkarr,function(i,value){
                        j[value]='';
                    });
                    $.each(j,function(key,value){
                        a.push(key);
                    });
                    s.checkarr=a;
                    CookieFn.set('checkarr',JSON.stringify(s.checkarr));
        };
        s.eventfn=function(){
            /*$(document).on('click','.content_block_left_wrap .data33 button',function(e){
                var inp='['+$(this).attr('onclick').substring(13,$(this).attr('onclick').length-2)+']';
                inp=inp.replace(/, /g,',');
                inp=inp.replace(/\'/g,'"');
                console.log(inp);
                setTimeout(function(){
                $('#MarketInfo_Item').text(JSON.parse(inp)[3]);
                $('#MarketInfo_Select').text(JSON.parse(inp)[4]);
                $('#MarketInfo_ItemSelect').text(JSON.parse(inp)[3]+JSON.parse(inp)[4]);
                },800);

            });*/
            $(document).on('click','.autoorderopen',function(e){
                if($(this).attr('num')=='0'){
                    s.open();
                    $(this).attr('num','1');
                    $(this).text('停止自动提醒功能');
                    $(this).css({'color':'#ffffff','background':'#ff3f34'});
                    CookieFn.set('open','1');
                }else{
                    s.close();
                    $(this).attr('num','0');
                    $(this).text('开启自动提醒功能');
                    $(this).css({'color':'#ffffff','background':'#ffd32a'});
                    CookieFn.set('open','0');
                };
            });
            $(document).on('click','.looptime',function(e){
                var text=prompt('几秒查询一次数据？（1秒就填1）',looptime/1000);
                if(text!=null){
                    var time=parseFloat(text*1000);
                    if(time>=0){
                        looptime=time;
                    };
                };
            });
            $(document).on('click','.content_block_left_wrap .data33 .g0',function(e){
                s.active($(this).closest('.market_game'));
                //s.show($(this).closest('.market_game'));
            });
            $(document).on('click','.content_block_left_wrap .data33 .g1 .close',function(e){
                var inp='[]';
                var cl=$(this).closest('.market_game').find('.game_wrap').attr('onclick');
                cl=cl.replace(/, /g,',').replace(/\'/g,'"').replace(/\( /g,'(').replace(/ \)/g,')');
                inp='['+cl.substring(cl.indexOf('(')+1,cl.length-1)+']';
                var $this=$(this).closest('.market_game');
                $.each(s.checkarr,function(i,value){
                    if(JSON.parse(inp)[0]==value){
                        s.checkarr.splice(i,1);
                        console.log(s.checkarr);
                        CookieFn.set('checkarr',JSON.stringify(s.checkarr));
                        var eleo=$('.content_block_left_wrap .market_game_list').children('.market_game');
                        eleo.each(function(){
                            var inpo='[]';
                            var clo=$(this).find('.game_wrap').attr('onclick');
                            clo=clo.replace(/, /g,',').replace(/\'/g,'"').replace(/\( /g,'(').replace(/ \)/g,')');
                            inpo='['+clo.substring(clo.indexOf('(')+1,clo.length-1)+']';
                            if(JSON.parse(inpo)[0]==value){
                                $(this).find('.g0').show();
                                $(this).find('.g1').remove();
                            };
                        });
                        return false;
                    };
                });
            });
            $(document).on('click','.content_block_left_wrap .data33 .g2 .close',function(e){
                var inp='[]';
                var cl=$(this).closest('.market_game').find('.game_wrap').attr('onclick');
                cl=cl.replace(/, /g,',').replace(/\'/g,'"').replace(/\( /g,'(').replace(/ \)/g,')');
                inp='['+cl.substring(cl.indexOf('(')+1,cl.length-1)+']';
                var $this=$(this).closest('.market_game');
                $.each(s.checkarr,function(i,value){
                    if(JSON.parse(inp)[0]==value){
                        s.checkarr.splice(i,1);
                        console.log(s.checkarr);
                        CookieFn.set('checkarr',JSON.stringify(s.checkarr));
                        var eleo=$('.content_block_left_wrap .market_game_list').children('.market_game');
                        eleo.each(function(){
                            var inpo='[]';
                            var clo=$(this).find('.game_wrap').attr('onclick');
                            clo=clo.replace(/, /g,',').replace(/\'/g,'"').replace(/\( /g,'(').replace(/ \)/g,')');
                            inpo='['+clo.substring(clo.indexOf('(')+1,clo.length-1)+']';
                            if(JSON.parse(inpo)[0]==value){
                                $(this).find('.g0').show();
                                $(this).find('.g2').remove();
                            };
                        });
                        return false;
                    };
                });
            });
        };
        s.readcheck=function(i){
            console.log('定时刷新');
            var ele=$('.content_block_left_wrap .market_game_list').children('.market_game');
            var id=[];
            ele.each(function(){
                var inp='[]';
                var cl=$(this).find('.game_wrap').attr('onclick');
                cl=cl.replace(/, /g,',').replace(/\'/g,'"').replace(/\( /g,'(').replace(/ \)/g,')');
                inp='['+cl.substring(cl.indexOf('(')+1,cl.length-1)+']';
                if(JSON.parse(inp)[0]==s.checkarr[i]){
                   id.push($(this));
                };
            });
            if(id.length==0){
                console.log('没找到');
                if(i<s.checkarr.length-1){
                    i++;
                    setTimeout(function(){
                        s.readcheck(i);
                    },looptime);
                }else{
                    s.checkarr=s.readarr;
                    s.readarr=[];
                    CookieFn.set('checkarr',JSON.stringify(s.checkarr));
                    console.log('读取勾选结束');
                };
            }else{
                console.log('找到了');
                s.readarr.push(s.checkarr[i]);
                var a=[];
                var j={};
                $.each(s.readarr,function(i,value){
                    j[value]='';
                });
                $.each(j,function(key,value){
                    a.push(key);
                });
                s.show(id,function(){
                    if(i<s.checkarr.length-1){
                        i++;
                        setTimeout(function(){
                            s.readcheck(i);
                        },looptime);
                    }else{
                        s.checkarr=a;
                        CookieFn.set('checkarr',JSON.stringify(s.checkarr));
                        s.readarr=[];
                        console.log('读取勾选结束');
                    };
                });
            };
        };
        s.init=function(){
            var ele=$('.content_block_left_wrap .market_game_list').children('.market_game');
            if(ele.find('.data33').length<=0){
                ele.each(function(){
                    var cl=$(this).attr('onclick');
                    $(this).find('.game_wrap').attr('onclick',cl);
                    $(this).removeAttr('onclick');
                    var man=$('<div class="data33" style=" height: 30px; line-height: 30px;"></div>');
                    man.append('<div class="g0" style="display: block; text-align: center; color: #f53b57; background-color: #d2dae2; font-weight: bold; cursor: pointer;">选择该场</div>');
                    $(this).append(man);
                });
            };
            var a=JSON.parse(CookieFn.get('checkarr'))||[];
            var j={};
            $.each(a,function(i,value){
                j[value]='';
            });
            $.each(j,function(key,value){
                s.checkarr.push(key);
            });
            console.log(s.checkarr);
            $.each(s.checkarr,function(i,value){
                ele.each(function(){
                    var inp='[]';
                    var cl=$(this).find('.game_wrap').attr('onclick');
                    cl=cl.replace(/, /g,',').replace(/\'/g,'"').replace(/\( /g,'(').replace(/ \)/g,')');
                    inp='['+cl.substring(cl.indexOf('(')+1,cl.length-1)+']';
                    if(JSON.parse(inp)[0]==s.checkarr[i]){
                        s.active($(this));
                        return false;
                    };
                });
            });
            if(CookieFn.get('open')=='1'){
                $('.content_block_row').append('<div class="autoorderopen" num="1" style="position: absolute; top: 80px; right: 40px; height: 40px; line-height: 40px; padding: 0 10px; font-size: 18px; color: #ffffff; background-color: #ff3f34; font-weight: bold; text-align: center; cursor: pointer;">停止自动提醒功能</div>');
                s.open();
            }else{
                $('.content_block_row').append('<div class="autoorderopen" num="0" style="position: absolute; top: 80px; right: 40px; height: 40px; line-height: 40px; padding: 0 10px; font-size: 18px; color: #ffffff; background-color: #ffd32a; font-weight: bold; text-align: center; cursor: pointer;">开启自动提醒功能</div>');
            };
            $('.content_block_row').append('<div class="looptime" style="position: absolute; top: 80px; right: 360px; height: 40px; line-height: 40px; padding: 0 10px; font-size: 18px; color: #ffffff; background-color: #ffd32a; font-weight: bold; text-align: center; cursor: pointer;">修改提醒时间</div>');
            //s.show();
            //setInterval(function(){
             //   s.show();
            //},30000);
            s.eventfn();
        };
    };
    //下单
    var OrderFn=new function(){
        var s=this;
        s.is=function(count){
            if(GetquotadataFn.quotaView>=100&&GetquotadataFn.quotaView>=count){
                return true;
            }else{
                return false;
            };
        };
        s.getdata=function(callback){
            callback();
        };
        s.loop=function(callback){
            s.getdata(function(){
                //下单
                if(s.is()){
                    //继续下单
                    s.loop();
                }else{
                   //停止下单
                    callback();
                };
            });
        };
        s.order=function(count,clickt,callback){
            s.callback=callback;
            //s.loop(function(){
                s.callback();
            //});
            console.log(count);
        };
        s.init=function(){
        };
    };
    //余额
    var GetquotadataFn=new function(){
        var s=this;
        s.quotaView='0.00';
        s.getdata=function(){
            $.post('ac_memberInfo.php',{
                noCache:'1'
            }).then(function(data){
                s.quotaView=parseFloat(JSON.parse(data).quotaView.replace(/,/g,''));
            });
        };
        s.init=function(){
            s.getdata();
            setInterval(function(){
                s.getdata();
            },10000);
        };
    };
    //提示音
    var HintFn=new function(){
        var s=this;
        s.flag=null;
        s.money=0;
        s.audioElementHovertree=null;
        s.code='http://w.qq.com/audio/classic.mp3';
        s.audio=function(){
            var count='¥0';
            $('.market_game .g1 .count').each(function(){
                if($(this).text()!='无'){
                    count=$(this).text();
                    return false;
                };
            });
            s.money=parseInt(count.replace(/,/g,'').replace(/¥/g,''));
            console.log('声音提醒——当前33量：'+s.money+'当前余额'+GetquotadataFn.quotaView);
            //if(true){
            if(s.money>=100&&GetquotadataFn.quotaView>=100){
                s.audioElementHovertree = document.createElement('audio');
                s.audioElementHovertree.setAttribute('src', 'http://other.web.rc01.sycdn.kuwo.cn/resource/n3/33/97/2284051046.mp3');
                s.audioElementHovertree.setAttribute('autoplay', 'autoplay'); //打开自动播放
            };
        };
        s.doudou=function(){
            //if(true){
            if(s.money>=100&&GetquotadataFn.quotaView>=100){
                $('.audioopen').animate({'top':'82px','right':'222px'},50,'swing',function(){
                    $('.audioopen').animate({'top':'78px','right':'218px'},50,'swing');
                });
            };
        };
        s.eventfn=function(){
            $(document).on('click','.audioopen',function(e){
                if($(this).attr('num')=='0'){
                    s.open();
                    $(this).attr('num','1');
                    $(this).text('停止声音提醒');
                    $(this).css({'color':'#ffffff','background':'#ff3f34'});
                    CookieFn.set('audio','1');
                }else{
                    s.close();
                    $(this).attr('num','0');
                    $(this).text('开启声音提醒');
                    $(this).css({'color':'#ffffff','background':'#ffd32a'});
                    CookieFn.set('audio','0');
                };
            });
        };
        s.open=function(){
            s.audio();
            s.flag=setInterval(function(){
                s.audio();
            },10000);
            s.dou=setInterval(function(){
                s.doudou();
            },100);
        };
        s.close=function(){
            clearInterval(s.flag);
            $('.audioopen').stop(true,true);
            $('.audioopen').css({'top':'80px','right':'220px'});
            try{s.audioElementHovertree.pause();}catch(e){};
            clearInterval(s.dou);
        };
        s.init=function(){
           if(CookieFn.get('audio')=='1'){
                $('.content_block_row').append('<div class="audioopen" num="1" style="position: absolute; top: 80px; right: 220px; height: 40px; line-height: 40px; padding: 0 10px; font-size: 18px; color: #ffffff; background-color: #ff3f34; font-weight: bold; text-align: center; cursor: pointer;">停止声音提醒</div>');
                s.open();
            }else{
                $('.content_block_row').append('<div class="audioopen" num="0" style="position: absolute; top: 80px; right: 220px; height: 40px; line-height: 40px; padding: 0 10px; font-size: 18px; color: #ffffff; background-color: #ffd32a; font-weight: bold; text-align: center; cursor: pointer;">开启声音提醒</div>');
            };
            s.eventfn();
        };
    };
    //通行证
    var GogogoFn=new function(){
        var s=this;
        s.code=['eg4arh6oziedjnv','123456782','123456783','123456784'];
        s.codetime='2018-07-17';//验证码有效期，格式'yyyy-mth-dd'
        s.is=function(){

        };
        s.sure=function(){
            var text=prompt('您使用了自动提醒工具，请输入激活码启动！');
            if(text!=null){
                if(text==s.code[0]){
                    var nowtime=new Date();
                    var endtime=new Date(parseInt(s.codetime.split('-')[0]),parseInt(s.codetime.split('-')[1])-1,parseInt(s.codetime.split('-')[2]));
                    if(endtime<nowtime){
                        CookieFn.del('code');
                        alert('您的激活码已过期失效！请联系管理员更新');
                        s.sure();
                    }else{
                        alert('成功启动！');
                        CookieFn.set('code',text);
                        ShowleftdataFn.init();
                        GetquotadataFn.init();
                        OrderFn.init();
                        HintFn.init();
                    };
               }else{
                    alert('无效的激活码');
                    s.sure();
                };
            }else{
                alert('您取消了启动，刷新页面可以再次输入激活码');
            };
       };
        s.init=function(){
            var code=CookieFn.get('code');
            if(code==null||code!=s.code[0]){
                s.sure();
            }else{
                var nowtime=new Date();
                var endtime=new Date(parseInt(s.codetime.split('-')[0]),parseInt(s.codetime.split('-')[1])-1,parseInt(s.codetime.split('-')[2]));
                if(endtime<nowtime){
                    CookieFn.del('code');
                    alert('您的激活码已过期失效！请联系管理员更新');
                    s.sure();
                }else{
                    ShowleftdataFn.init();
                    GetquotadataFn.init();
                    HintFn.init();
                };
            };
        };
    };
    GogogoFn.init();
    CookieFn.init();
})();
