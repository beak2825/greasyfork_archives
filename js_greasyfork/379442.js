// ==UserScript==
// @name         淘宝试用算概率
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Just for myself
// @author       You
// @match        https://try.taobao.com/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379442/%E6%B7%98%E5%AE%9D%E8%AF%95%E7%94%A8%E7%AE%97%E6%A6%82%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/379442/%E6%B7%98%E5%AE%9D%E8%AF%95%E7%94%A8%E7%AE%97%E6%A6%82%E7%8E%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styleStr = `
#myTryButtom{
	width:130px;
	height:50px;
	border-radius:8px;
	background:#fc0;
	cursor:pointer;
	box-shadow:4px 4px 10px rgba(92, 51, 153, 0.2);
	font-family:'Fredoka One','Arial Black';
	z-index:100;
	position:relative;
}
#myTryButtom:hover{
	background:#ffd83c;
}
#myTryButtom:active{
	background:#fc0;
	box-shadow:2px 2px 5px rgba(92, 51, 153,0.1);
}
.myTryBB{
	position:fixed;
	bottom:50px;
	right:2px;
	user-select: none;
	z-index:10000;
	text-align:center;
}
.mylucklistLK a{
	color:#000;
	text-decoration:none;
}
.mylucklistDK:hover{
	color:#d90000;
	background: linear-gradient(to bottom, #fc0 0%,#fff 6%, #fff 94%,#fc0 100%);
}
.mytrynBN{
	font-size:13px;
	line-height:24px;
	position:absolute;
	margin-left:10px;
}
.myTryNPButtom{
	float:left;
	width:55px;
	height:26px;
	border-radius:0px 0px 5px 5px;
	background:#7a49c4;
	color: #fff;
	cursor:pointer;
	box-shadow:4px 4px 10px rgba(92, 51, 153, 0.2);
	margin-right:1px;
	font-family:'Fredoka One','Arial Black';
}
.myTryNPButtom:hover{
	height:28px;
	line-height:26px;
}
.myTryNPButtom:active{
	height:26px;
	line-height:24px;
	box-shadow:2px 2px 5px rgba(92, 51, 153,0.1);
}
#iamsolucky0{
	color: #000;
	font-size:20px;
	line-height:50px;
}
#iamsolucky1{
	font-size:20px;
	color:#a00000;
	float:left;
	margin:11px 10px 0 0;
	width:70px;
	text-align:right;
}
#iamsolucky2{
	float:left;
	font-size:16px;
	text-align:right;
	margin:15px 0px 0 0;
	width:40px;
}
.myPercent{
	position: absolute;
	top: 24px;
	right: 15px;
	font-size:20px;
	font-family:'Fredoka One','Arial Black';
	color:#999;
}
.myRed100{
	color:#d90000!important;
	animation-name: breath100;
	animation-duration: 1s;
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
}
.myRed50{
	color:#d90000!important;
}
.myRed10{
	color:#f60!important;
}
.myRed1{
	color:#7a49c4!important;
}
.myRed01{
	color:#666!important;
}
@-webkit-keyframes breath100 {
	from {
		text-shadow:0px 0px 18px rgba(122, 73, 196, .5);
	}
	50%  {
		text-shadow:0px 0px 0px rgba(122, 73, 196, .0);
	}
	to   {
		text-shadow:0px 0px 18px rgba(122, 73, 196, .5);
	}
}
.daykuangB{
	position: absolute;
	top: 64px;
	right: 15px;
}
.daykuangC{
	position: absolute;
	top: 36px;
	left: 140px;
}
.daykuang0{
	height:10px;
	width:10px;
	float:left;
	margin-right:1px;
	background:#ccc;
}
.daykuang1{
	height:10px;
	width:10px;
	float:left;
	margin-right:1px;
	background:#f60;
}
.mylucklistLK{
	height:671px;
	width:108px;
	background:rgba(255, 255, 255, 0.95);
	padding:3px 0 3px 5px;
	border:1px solid #fc0;
	border-radius:10px 10px 0 0;
	margin-left:7px;
	box-shadow:0px 0px 10px rgba(92, 51, 153, 0.2);
}
.mylucklistDK{
	width:103px;
	height:44px;
	border-bottom:1px solid #fc0;
}
.lucklist01{
	width:40px;
	height:40px;
	float:left;
}
.lucklist01 img{
	width:40px;
	height:40px;
	margin-top:2px;
}
.lucklist02{
	height:40px;
	text-align:right;
	line-height:33px;
	font-family:'Fredoka One','Arial Black';
}
.lucklist03{
	width:105px;
	text-align:right;
	position:absolute;
	margin-top:-15px;
	color:#555;
	font-family: 'tahoma', 'arial', "Hiragino Sans GB", '宋体', 'sans-serif';
	text-shadow: -1px -1px 0px #FFF,-1px 1px 0px #FFF,1px -1px 0px #FFF,1px 1px 0px #FFF,-2px -2px 0px #FFF,-2px 2px 0px #FFF,2px -2px 0px #FFF,2px 2px 0px #FFF;
}
.myclose{
	position:relative;
	float:left;
	width:13px;
	height:13px;
	background-image:url('//gdp.alicdn.com/tps/i3/T1vEi4XnhyXXXm0Pva-454-340.png');
	background-position-x:-250px;
	background-position-y:-131px;
	margin-top:-38px;
	margin-left:93px;
	cursor:pointer;
}
.myclose:hover{
	background-position-x:-270px;
}
.myAddButton{
	position:absolute;
	background:#ccc;
	width:40px;
	height:40px;
	line-height:43px;
	text-align:center;
	color:#fff;
	z-index:100;
	right:34px;
	top:84px;
}
.myAddButton:hover{
	background:#f60;
}
.mylineline{
	width:113px;
	height:13px;
	margin-left:7px;
	background:#7a49c4;
	color:#fff;
	line-height:13px;
	cursor:pointer;
	border:1px solid #fc0;
}
.mlineA{
	letter-spacing:3px;
}
.mlineA:hover{
	letter-spacing:0px;
}
.mlineA:active{
	letter-spacing:3px;
}
.mydisplay{
	display:none;
}
.myAutoRun{
	background:#7a49c4;
	width:30px;
	height:30px;
	position:absolute;
	z-index:10;
	cursor:pointer;
	margin-top:-40px;
	margin-left:-10px;
	text-align:center;
	color:#fff;
	line-height:32px;
	border-radius:5px 0px 0px 5px;
	font-family:'Fredoka One','Arial Black';
}
.myAutoRun:hover{
	margin-left:-30px;
}
.myAutoRun:active{
	margin-left:-28px;
}
.mypo{
	background:#7a49c4;
	width:10px;
	height:10px;
	border-radius:5px;
	position:absolute;
	cursor:pointer;
	top:5px;
	left:116px;
}
.mypo:hover{
	background:#a00000;
	box-shadow:inset 2px 2px 3px rgba(0, 0, 0, 0.5);
}
#myinput{
	width:45px;
	height:25px;
	font-size:16px;
	margin-top:8px;
	margin-left:20px;
	font-family:'Fredoka One','Arial Black';
	text-align:right;
	padding:4px;
	float:left;
	border-radius:10px;
	border:1px solid #fc0;
}
.myms{
	font-size:20px;
	float:left;
	margin-top:10px;
	margin-left:5px;
}
.myNumber{
	position: absolute;
	top: 10px;
	left: 140px;
	font-size:20px;
	font-family:'Fredoka One','Arial Black';
	color:#999;
}
#dubhe-app{
    display:none;
}
    `;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styleStr;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);

    //----------------------------------------------------------------------------------------------------------------------------
    var reZhengzhe0 = /(?<=：)\d+/;
    var reZhengzhe1 = /\d/;
    var reZhengzhe2 = /(?<=- )\d+-\d+-\d+/;
    var ysTime = 700;
    var mylucky_percnet,mylucky_href,mylucky_title_l,mylucky_src,mylucky_title_s;
    var myatrun;
    var currentUrl = window.location.href;
    var reTK01 = /\/#p\=/;
    var reTK02 = /https\:\/\/try\.taobao\.com\/item\.htm/;
    //--------------------------------------------------------------------------------
    if(currentUrl=='https://try.taobao.com/'||reTK01.test(currentUrl)){
        $('body').append('<div class="myTryBB"><div id="myTryButtom"><div class="mypo"></div><div id="iamsolucky0">Lucky!</div></div><div class="myAutoRun">Go</div><div class="mytrynBN"><div id="myTryBprev" class="myTryNPButtom">prev</div><div id="myTryBnext" class="myTryNPButtom">next</div></div></div>');
        $('body').on('click','#myTryButtom',function(){
            clearInterval(myatrun);//stop auto run
            if($('#myinput').length>0){
                ysTime=$('#myinput').val().replace(/[^0-9]/ig, "");
                if(ysTime<100){
                    ysTime=100;
                }
            }
            if($('.mylucklistLK').length<=0){
                drawKuang();
            }
            printPercent(0);
            getLuckWOW();
        });
        $('body').on('click','#myTryBprev',function(){
            $('.pg-prev').click();
            setTimeout(function (){
                printPercent(0);
                getLuckWOW();
            }, ysTime);
        });
        $('body').on('click','#myTryBnext',function(){
            $('.pg-next').click();
            setTimeout(function (){
                printPercent(0);
                getLuckWOW();
            }, ysTime);
        });
        $('body').on('mouseenter', '.mylucklistDK',function(){//绑定鼠标进入事件
            if($(this).text()!=''){
                $(this).append('<div class="myclose"></div>');
            }
        });
        $('body').on('mouseleave', '.mylucklistDK',function(){//绑定鼠标划出事件
            $(this).children('.myclose').remove();
        });
        $('body').on('click','.myclose',function(){
            $(this).parent().remove();
            $('.mylucklistLK').append('<div class="mylucklistDK"><a target="_blank"><div class="lucklist01"<img></div><div class="lucklist02"></div><div class="lucklist03"></div></a></div>');
            getLuckWOW();
        });
        $('body').on('mouseenter', '.tb-try-ra-item-link',function(){
            $(this).find('.tb-try-labeled-item.type-flexible.info').append('<div class="myAddButton">Add</div>');
        });
        $('body').on('mouseleave', '.tb-try-ra-item-link',function(){
            $(this).find('.myAddButton').remove();
        });
        $('body').on('click','.myAddButton',function(){
            var man = '';
            var piece = '';
            var percent = '';
            if($('.mylucklistDK').eq(14).text()==''){
                piece = $(this).parent().children('div').eq(0).children('span').eq(1).text();
                man = $(this).parent().children('div').eq(1).children('span').eq(1).text();
                percent = commafyback(piece) / commafyback(man) * 1000;
            }
            myPaixv($(this).parent(),percent);
            getLuckWOW();
            return false;//JS阻止事件冒泡，及不触发外面a链接
        });
        $('body').on('click','.mylineline',function(){
                if($('.mylucklistLK').attr('class')=='mylucklistLK'){
                    $('.mylucklistLK').addClass('mydisplay');
                }else{
                    $('.mylucklistLK').removeClass('mydisplay');
                }
        });
        $('body').on('click','.myAutoRun',function(){
            $('.pg-next').prev().click();
            if($('.mylucklistLK').length<=0){
                drawKuang();
            }
            setTimeout(function (){
                printPercent(1);
                getLuckWOW();
            }, ysTime);
            setTimeout(function (){
                myatrun = setInterval(myATR,ysTime);
            }, ysTime+ysTime);
        });
        $('body').on('click','.mypo',function(){
            $('#myTryButtom').html('<input id="myinput" type="text" value="'+ysTime+'"><div class="myms">ms</div><div class="mypo"></div>');
            return false;
        });
        $('body').on('click','#myinput',function(){
            return false;
        });
    }
    if(reTK02.test(currentUrl)){
        myPT();
    }
    function myPT() {
        var daykki = new Array(7);
        var man = $('.J_TbTry_ApplierCount').eq(0).text();
        var piece = $('.total').text();
        var percent = commafyback(piece) / commafyback(man) * 1000;
        $('.info-bd').append('<div class="myNumber">'+percent.toFixed(2)+' ‰</div>');
        if(percent>100){
            $('.myNumber').addClass('myRed100');
        }else if(percent>50){
            $('.myNumber').addClass('myRed50');
        }else if(percent>10){
            $('.myNumber').addClass('myRed10');
        }else if(percent>1){
            $('.myNumber').addClass('myRed1');
        }else if(percent>0.1){
            $('.myNumber').addClass('myRed01');
        }
        setTimeout(function (){
            var ddaydd = $('.tb-try-ra-countdown').children('em').eq(0).text() * 1;
            switch(ddaydd){
                case 0:
                daykki = [1,1,1,1,1,1,1];
                break;
                case 1:
                daykki = [1,1,1,1,1,1,0];
                break;
                case 2:
                daykki = [1,1,1,1,1,0,0];
                break;
                case 3:
                daykki = [1,1,1,1,0,0,0];
                break;
                case 4:
                daykki = [1,1,1,0,0,0,0];
                break;
                case 5:
                daykki = [1,1,0,0,0,0,0];
                break;
                case 6:
                daykki = [1,0,0,0,0,0,0];
                break;
                default:
                daykki = [0,0,0,0,0,0,0];
                break;
            }
            $('.info-bd').append('<div class="daykuangC"><div class="daykuang'+daykki[0]+'"></div><div class="daykuang'+daykki[1]+'"></div><div class="daykuang'+daykki[2]+'"></div><div class="daykuang'+daykki[3]+'"></div><div class="daykuang'+daykki[4]+'"></div><div class="daykuang'+daykki[5]+'"></div><div class="daykuang'+daykki[6]+'"></div></div>');
        }, 700);
    }
    function commafyback(num){
        num = num + '';
        var x = num.split(',');
        return parseFloat(x.join(""));
    }
    function getLuckWOW(){
        var lucksum = 1;
        var lucksum_one = 0;
        var lyper = new Array();
        var lyper_F = new Array();
        var i = 0;
        $('.lucklist02').each(function(){
          var lastpercent = $(this).text();
          lyper[i] = lastpercent.substr(0,lastpercent.length-1);
            //console.log(lyper[i]);//值为1000分之：20
            lucksum = lucksum * (1-lyper[i]/1000);
            i++;
        });
        //最少中一个
        for(var j=0;j<i;j++){
            lyper_F[j] = lucksum * lyper[j]/1000 / (1-lyper[j]/1000);
            lucksum_one = lucksum_one + lyper_F[j];
            //console.log(j,lyper[j]/1000,lyper_F[j],lucksum_one);
        }
        lucksum_one = 1 - lucksum_one - lucksum;
        $('#myTryButtom').html('<div class="mypo"></div><div id="iamsolucky1">'+((1-lucksum)*100).toFixed(1)+'%</div><div id="iamsolucky2">'+(lucksum_one*100).toFixed(1)+'%</div>');
    }
    function printPercent(yn_auto){
        $('.myPercent').remove();
        $('.daykuangB').remove();
        $('.tb-try-labeled-item.type-flexible.info').each(function(){
            var man = '';
            var piece = '';
            var percent = '';
            var dday1 = '';
            var dday2 = new Date();
            var ddaydd = '';
            var daykki = new Array(7);
            piece = $(this).children('div').eq(0).children('span').eq(1).text();
            if(piece==''){
                piece = $(this).children('div').eq(0).text().match(reZhengzhe0);
            }
            man = $(this).children('div').eq(1).children('span').eq(1).text();
            if(man==''){
                man = $(this).children('div').eq(1).text().replace(/[^0-9]/ig, "");
            }
            percent = commafyback(piece) / commafyback(man) * 1000;
            if(percent>100){
                $(this).append('<div class="myPercent myRed100">'+ percent.toFixed(2) +' ‰</div>');
            }else if(percent>50){
                $(this).append('<div class="myPercent myRed50">'+ percent.toFixed(2) +' ‰</div>');
            }else if(percent>10){
                $(this).append('<div class="myPercent myRed10">'+ percent.toFixed(2) +' ‰</div>');
            }else if(percent>1){
                $(this).append('<div class="myPercent myRed1">'+ percent.toFixed(2) +' ‰</div>');
            }else if(percent>0.1){
                $(this).append('<div class="myPercent myRed01">'+ percent.toFixed(2) +' ‰</div>');
            }else{
                $(this).append('<div class="myPercent">'+ percent.toFixed(2) +' ‰</div>');
            }
            dday1 = $(this).children('div').eq(2).text().match(reZhengzhe2);
            //console.log(dday1,dday2);
            dday1 = Date.parse(new Date(dday1));
            dday2.toLocaleDateString();
            dday2 = Date.parse(new Date(dday2));
            ddaydd = Math.abs(Math.floor((dday2 - dday1)/1000/3600/24));
            //console.log(commafyback(piece),commafyback(man),percent.toFixed(6));
            //console.log(dday1,dday2,ddaydd);
            switch(ddaydd){
                case 0:
                daykki = [1,1,1,1,1,1,1];
                if(yn_auto==1){
                    myPaixv($(this),percent);
                }
                break;
                case 1:
                daykki = [1,1,1,1,1,1,0];
                break;
                case 2:
                daykki = [1,1,1,1,1,0,0];
                break;
                case 3:
                daykki = [1,1,1,1,0,0,0];
                break;
                case 4:
                daykki = [1,1,1,0,0,0,0];
                break;
                case 5:
                daykki = [1,1,0,0,0,0,0];
                break;
                case 6:
                daykki = [1,0,0,0,0,0,0];
                break;
                default:
                daykki = [0,0,0,0,0,0,0];
                break;
            }
            $(this).append('<div class="daykuangB"><div class="daykuang'+daykki[0]+'"></div><div class="daykuang'+daykki[1]+'"></div><div class="daykuang'+daykki[2]+'"></div><div class="daykuang'+daykki[3]+'"></div><div class="daykuang'+daykki[4]+'"></div><div class="daykuang'+daykki[5]+'"></div><div class="daykuang'+daykki[6]+'"></div></div>');
        });
    }
    function drawKuang(){
        $('.myTryBB').prepend('<div class="mylucklistLK"></div><div class="mylineline mlineA">- - - - -</div>');
        for(var i=0;i<15;i++){
            $('.mylucklistLK').prepend('<div class="mylucklistDK"><a target="_blank"><div class="lucklist01"<img></div><div class="lucklist02"></div><div class="lucklist03"></div></a></div>');
        }
    }
    //入栈排序,Object = .tb-try-labeled-item.type-flexible.info
    function myPaixv($myObject,percent){
        var lastpercent = $('.lucklist02').eq(14).text();
        var mypatt_1= /\/item\.htm\?/;
        var mypatt_2= /id\=\d+/;
        lastpercent = lastpercent.substr(0,lastpercent.length-1);
        //console.log(percent,lastpercent);
        if(percent > lastpercent){
            mylucky_percnet = percent.toFixed(2);
            mylucky_href = $myObject.parent().parent().parent().attr('href');
            mylucky_href = mypatt_1.exec(mylucky_href)+mypatt_2.exec(mylucky_href);
            mylucky_title_l = $myObject.prev().text();
            mylucky_src = $myObject.parent().prev().children('img').eq(0).attr('src');
            mylucky_title_s = $.fixedWidth($myObject.prev().text(),14);
            //console.log(mylucky_title_l);
            var aai = 0;//重复标记，0不重复
            $('.lucklist02').each(function(){
                //console.log($(this).parent().parent().attr('href'));
                if(mylucky_href == $(this).parent().attr('href')){
                    aai = 1;
                    return false;
                }
            });
            if(aai==0){
                $('.lucklist02').each(function(){
                    if(mylucky_percnet>$(this).text().replace(/[^0-9]/ig, "")/100){
                        var $trTemp0 = $('<div class="mylucklistDK"><a href="'+ mylucky_href +'" target="_blank" title="'+ mylucky_title_l +'"><div class="lucklist01"><img src="'+ mylucky_src +'"></div><div class="lucklist02">'+ mylucky_percnet +'‰</div><div class="lucklist03">'+ mylucky_title_s +'</div></a></div>');
                        $(this).parent().parent().before($trTemp0);
                        $('.mylucklistDK').eq(15).remove();
                        return false;
                    }
                });
            }
        }
    }
    //auto run
    function myATR(){
        $('.pg-prev').click();
        setTimeout(function (){
            printPercent(1);
            getLuckWOW();
            if($('.tb-try-ra-item-link').eq(0).find('.daykuangB').children('div').eq(6).attr('class')!='daykuang1'){
                clearInterval(myatrun);
            }
        }, ysTime);
    }
    //缩短标题--------------------------------------------------------------------------
    $.extend($,{
        fixedWidth:function(str,length,char){
            str=str.toString();
            if(!char) char="";
            var num=length-lengthB(str);
            if(num<0){
                str=substringB(str,length-lengthB(char))+char;
            }
            return str;
            function substringB(str,length){
                var num=0,len=str.length,tenp="";
                if(len){
                    for(var i=0;i<len;i++){
                        if(num>length) break;
                        if(str.charCodeAt(i)>255){
                            num+=2;
                            tenp+=str.charAt(i);
                        }else{
                            num++;
                            tenp+=str.charAt(i);
                        }
                    }
                    return tenp;
                }else{
                    return null;
                }
            }
            function lengthB(str){
                var num=0,len=str.length;
                if(len){
                    for(var i=0;i<len;i++){
                        if(str.charCodeAt(i)>255){
                            num+=2;
                        }else{
                            num++;
                        }
                    }
                    return num;
                }else{
                    return 0;
                }
            }
        }
    });
    //--------------------------------------------------------------------------------
})();