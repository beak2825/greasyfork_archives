// ==UserScript==
// @name         淘宝辅助+【分类显文字 + 分类价格表 + 等】PriceList_Plus
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  just for myself
// @author       pealpool
// @include      *://detail.tmall.*
// @include      *://item.taobao.*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/378310/%E6%B7%98%E5%AE%9D%E8%BE%85%E5%8A%A9%2B%E3%80%90%E5%88%86%E7%B1%BB%E6%98%BE%E6%96%87%E5%AD%97%20%2B%20%E5%88%86%E7%B1%BB%E4%BB%B7%E6%A0%BC%E8%A1%A8%20%2B%20%E7%AD%89%E3%80%91PriceList_Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/378310/%E6%B7%98%E5%AE%9D%E8%BE%85%E5%8A%A9%2B%E3%80%90%E5%88%86%E7%B1%BB%E6%98%BE%E6%96%87%E5%AD%97%20%2B%20%E5%88%86%E7%B1%BB%E4%BB%B7%E6%A0%BC%E8%A1%A8%20%2B%20%E7%AD%89%E3%80%91PriceList_Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
//css----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var styleStr = `
/*复制网址功能css----------------------------------------------------------------------------------------------------------------------------*/
.mycopyK_00{
line-height:15px;
text-align:center;
position:absolute;
right:1px;
cursor:pointer;
}
.mycopyK_01{
float:left;
color:#fff;
background:#ff4400;
width:15px;
height:15px;
}
.mycopyK_02{
float:left;
color:#fff;
background:#ff8e1b;
width:25px;
height:15px;
}
.mycopyK_03{
float:left;
color:#fff;
background:#ff4400;
width:15px;
height:15px;
}
.mycopyK_01:hover,
.mycopyK_02:hover,
.mycopyK_03:hover{
opacity:0.7;
}
.mycopyK_01:active,
.mycopyK_02:active,
.mycopyK_03:active{
opacity:1;
}
/*PriceListCss--------------------------------------------------------------------------------------------------------------------------------*/
#mybigtable00{
	position: absolute;
	background:#f6f5f5;
	z-index:99999;
	top:90px;
	opacity:1;
	transition: background 450ms cubic-bezier(0.01, 0.48, 0.47, 0.99) 0ms;
	box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
	border: 1px solid #ff4400;
}
#mybigtable00:hover{
	background:#ff4400;
	box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
}
#mybigtable01{
	height:20px;
	background:#ff4400;
	cursor:move;
	user-select: none;
	transition: all 450ms cubic-bezier(0.01, 0.48, 0.47, 0.99) 0ms;
}
#mybigtable01:hover{
	background:#ff8e1b;
}
.no-select {
    user-select: none;
}
#myclose{
	width:13px;
	height:13px;
	margin-top:3px;
	margin-right:3px;
	float:right;
	background-image:url('https://gdp.alicdn.com/tps/i3/T1vEi4XnhyXXXm0Pva-454-340.png');
	background-position-x:-250px;
	background-position-y:-131px;
	cursor:pointer;
}
#myclose:hover{
	background-position-x:-270px;
}
#myTableK{
	border: 1px solid #ccc;
	margin:4px;
	color: #333;
}
#myTableK td {
	border: 1px solid #e7e7e7;
	padding: 0px 10px;
	height:18px;
}
#myTableK thead{
	font-weight:bolder;
	background:#e7e7e7;
}
#myTableK_b tr:hover{
	background:#fff;
	color:#ff4400;
}
#myTableK_b{
	background:#f6f5f5;
}
#myOPB{
	width:12px;
	height:30px;
	text-align:center;
	line-height:30px;
	position:absolute;
	top:8px;
	left:-12px;
	cursor:pointer;
	background-color:#ccc;
	box-shadow:0px 0px 3px #999 inset;
	color:#fff;
	text-shadow:2px 2px 2px rgba(0, 0, 0, 0.4);
	transition: all 250ms cubic-bezier(0.01, 0.48, 0.47, 0.99) 0ms;
}
#myOPB:hover{
	width:30px;
	left:-30px;
	background-color:#ff8e1b;
	box-shadow:0px 0px 5px #ff4400 inset;
	background-position-x:-1px;
}
#myOPB:active{
	-webkit-filter:brightness(0.9);
}
.mygege01{
	position:absolute;
   width: 57px;
   height: 0px;
   border-color: #ff8e1b transparent transparent transparent;
   border-style: solid solid solid none;
   border-width: 19px 10px 0px 0px;
}
.mygege02,
.mygege03,
.mygege04{
	position:absolute;
	background:#ff8e1b;
	height:19px;
	width:5px;
	transform:skew(-30deg);
}
.mygege02{
	margin-left:68px;
}
.mygege03{
	margin-left:79px;
}
.mygege04{
	margin-left:90px;
}
.mygege00{
	position:absolute;
	color:#fff;
	margin-left:3px;
	text-shadow:2px 2px 5px rgba(0, 0, 0, 0.1);
}
#myTableK_b tr td div{
	width: 38px!important;
    height: 38px!important;
}
/*阿里妈妈搜索功能--------------------------------------------------------------------------------------------------------------------------------*/
.myaltm{
    border: 1px solid #FF0036;
    height: 38px;
    width:38px;
    line-height: 38px;
    text-align: center;
    font-size: 16px;
    float:left;
    margin-left:9px;
    cursor:pointer;
    background-image:url(https://pub.alimama.com/favicon.ico);
    background-repeat: no-repeat;
    background-size:contain;
}
.myaltb{
    border: 1px solid #F40;
    border-radius: 2px;
    height: 38px;
    width:38px;
    line-height: 38px;
    text-align: center;
    font-size: 16px;
    float:left;
    margin-left:9px;
    cursor:pointer;
    background-image:url(https://pub.alimama.com/favicon.ico);
    background-repeat: no-repeat;
    background-size:contain;
}
.myaltm:hover,
.myaltb:hover{
    filter:contrast(1.8);
}
`;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styleStr;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);


//颜色分类显字功能----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var mySMMbuttomMark = 0;
    $("dt:contains('颜色')").attr("id","mySMMbuttom");
    $("#mySMMbuttom").css("cursor","pointer").attr("title","切换显示");
    $("#mySMMbuttom").on("click",function(){
        if($("ul[data-property='颜色分类']").length > 0){
            console.log("颜色分类");
            var mythis = $("ul[data-property='颜色分类']");
        }
        if($("ul[data-property='颜色']").length > 0){
            console.log("颜色");
            mythis = $("ul[data-property='颜色']");
        }
        if(mySMMbuttomMark==0){
            mythis.children("li").each(function(){
                if($(this).attr("class")!="tb-txt" && $(this).attr("class")!="tb-txt tb-selected"){
                    if($(this).attr("class")=="tb-selected"){
                        $(this).attr("class","mySMMCss tb-txt tb-selected");
                    }
                    else if($(this).attr("class")=="tb-out-of-stock"){
                        $(this).attr("class","mySMMCss tb-txt tb-out-of-stock");
                    }
                    else{
                        $(this).attr("class","mySMMCss tb-txt");
                    }
                    $(this).children("a").css("background-position","left");
                    $(this).children("a").children("span").css("text-indent","40px");
                }
            });
            mySMMbuttomMark=1;
        }
        else
        {
            mythis.children("li").each(function(){
                if($(this).attr("class")=="mySMMCss tb-txt" || $(this).attr("class")=="mySMMCss tb-txt tb-selected" || $(this).attr("class")=="mySMMCss tb-txt tb-out-of-stock"){
                    if($(this).attr("class")=="mySMMCss tb-txt tb-selected"){
                        $(this).attr("class","tb-selected");
                    }
                    else if($(this).attr("class")=="mySMMCss tb-txt tb-out-of-stock"){
                        $(this).attr("class","tb-out-of-stock");
                    }
                    else{
                        $(this).attr("class","");
                    }
                    $(this).children("a").css("background-position","center");
                    $(this).children("a").children("span").css("text-indent","-9999em");
                }
            });
            mySMMbuttomMark=0;
        }
    });
    $("#mySMMbuttom").hover(function(){
        $("#mySMMbuttom").css("color","red");
    },function(){
        $("#mySMMbuttom").css("color","#838383");
    });

//复制网址功能----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var mypatt_1= /id\=\d{10,12}/;
    var mypatt_2= /.*\/item\.htm\?/;
    $(".tb-main-title").after("<div class='mycopyK_00'><div class='mycopyK_01'>I</div><div class='mycopyK_02'>S</div><div class='mycopyK_03'>T</div></div>");
    $(".tb-detail-hd h1").after("<div class='mycopyK_00'><div class='mycopyK_01'>I</div><div class='mycopyK_02'>S</div><div class='mycopyK_03'>T</div></div>");
    $("body").on("click",".mycopyK_01",function(){
        var mymyurl_1 = mypatt_1.exec(window.location.href);
        mymyurl_1 = mymyurl_1.toString().substr(3);
        console.log(mymyurl_1);
        if($("body").find("#copyYC").attr("id")!="copyYC"){
            $("body").append("<div id='copyYC'></div>");
        }
        let oInput = document.createElement('input');
        oInput.value = mymyurl_1;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").remove();
    });
    $("body").on("click",".mycopyK_02",function(){
        var mymyurl_1 = mypatt_1.exec(window.location.href);
        var mymyurl_2 = mypatt_2.exec(window.location.href);
        // console.log(mymyurl_1);
        if($("body").find("#copyYC").attr("id")!="copyYC"){
            $("body").append("<div id='copyYC'></div>");
        }
        let oInput = document.createElement('input');
        oInput.value = mymyurl_2 + mymyurl_1;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").remove();
    });
    $("body").on("click",".mycopyK_03",function(){
        var mymyurl_1 = mypatt_1.exec(window.location.href);
        var mymyurl_2 = mypatt_2.exec(window.location.href);
        var mymyurl_3 = "";
        if(mymyurl_2 == "https://detail.tmall.com/item.htm?"){
            mymyurl_3 = $.trim($(".tb-detail-hd").children("h1").text());
        }else if(mymyurl_2 == "https://item.taobao.com/item.htm?"){
            mymyurl_3 = $.trim($(".tb-main-title").text());
        }
        mymyurl_1 = mymyurl_3 + "\n" + mymyurl_2 + mymyurl_1;
        console.log(mymyurl_1);
        if($("body").find("#copyYC").attr("id")!="copyYC"){
            $("body").append("<div id='copyYC'></div>");
        }
        let oInput = document.createElement('input');
        oInput.value = mymyurl_1;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").remove();
    });
//PriceList功能--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//my:天猫有折扣，mn:天猫无折扣，by:淘宝有折扣，bn:淘宝无折扣。
    var myTorC = 'my';
    if($('.J_TSaleProp').length!=0){
        $('.tm-fcs-panel').append('<div id="myOPB">$</div>');
        $('.tb-meta').append('<div id="myOPB">$</div>');
    }
    //tmall
    $('#myOPB').hover(function(){
        var mytcssname = $('#J_PromoPrice').attr('class');
        switch(mytcssname){
            case "tb-detail-price tb-promo-price tb-clear tb-hidden":
                myTorC = 'bn';
                break;
            case "tb-detail-price tb-promo-price tb-clear":
                myTorC = 'by';
                break;
            case "tm-promo-panel":
                myTorC = 'mn';
                break;
            case "tm-promo-panel tm-promo-cur":
                myTorC = 'my';
                break;
        }
    },function(){
    });
    $("body").on("click","#myOPB",function(){
        myOutputTable();
        if($('#myTableK_b').html()==''){
            myCatchDate();
        }
    });
    //---------

    function myCatchDate(){
        var a = $('.J_TSaleProp').length;
        var myPrice = new Array();
        var i = new Array();
        var z = 0;
        var m1,m2,m3,m4;
        var $trTemp0 = $("<tr></tr>");
        $('.J_TSaleProp .tb-selected').click();
        switch(a){
            case 1:
                $trTemp0.append('<td>图片</td>');
                for(var k=0;k<a;k++){
                    var $mythisaa = $('.J_TSaleProp').eq(k);
                    i[k] = $mythisaa.find('li').length;
                    console.log(i[k]);
                    $trTemp0.append('<td>'+ $mythisaa.attr('data-property') +'</td>');
                }
                //取消默认选中
                if($mythisaa.find('li').attr('class')=='tb-selected'){
                    $(this).click();
                }
                $trTemp0.append('<td>价格</td>');
                $trTemp0.appendTo("#myTableK_h");
                for(m1=0;m1<i[0];m1++){
                    var $trTemp1 = $("<tr></tr>");
                    $('.J_TSaleProp').eq(0).find('li a span').eq(m1).click();
                    myPrice[z] = $('.J_TSaleProp').eq(0).find('li a span').eq(m1).parent().attr('style');
                    myPrice[z] = '<div style="'+ myPrice[z] + '"></div>';
                    $trTemp1.append('<td>'+ myPrice[z] +'</td>');
                    z++;
                    myPrice[z] = $('.J_TSaleProp').eq(0).find('li a span').eq(m1).text();
                    $trTemp1.append('<td>'+ myPrice[z] +'</td>');
                    z++;
                    switch(myTorC){
                        case 'my':
                            myPrice[z] = $('.tm-promo-price .tm-price').text();
                            break;
                        case 'mn':
                            myPrice[z] = $('.tm-price').text();
                            break;
                        case 'by':
                            myPrice[z] = $('#J_PromoPriceNum').text();
                            break;
                        case 'bn':
                            myPrice[z] = $('.tb-rmb-num').text();
                            break;
                    }
                    $trTemp1.append('<td>'+ myPrice[z] +'</td>');
                    z++;
                    $trTemp1.appendTo("#myTableK_b");
                }
                break;
            case 2:
                for(k=0;k<a;k++){
                    $mythisaa = $('.J_TSaleProp').eq(k);
                    i[k] = $mythisaa.find('li').length;
                    console.log(i[k]);
                }
                $trTemp0.append('<td></td>');
                for(m1=0;m1<i[0];m1++){
                    myPrice[z] = $('.J_TSaleProp').eq(0).find('li a span').eq(m1).text();
                    $trTemp0.append('<td>'+ myPrice[z] +'</td>');
                    console.log(myPrice[z]);
                    z++;
                }
                $trTemp0.appendTo("#myTableK_h");
                for(m2=0;m2<i[1];m2++){
                    $trTemp1 = $("<tr></tr>");
                    myPrice[z] = $('.J_TSaleProp').eq(1).find('li a span').eq(m2).text();
                    $trTemp1.append('<td>'+ myPrice[z] +'</td>');
                    z++;
                    for(m1=0;m1<i[0];m1++){
                        $trTemp1.append('<td></td>');
                    }
                    $trTemp1.appendTo("#myTableK_b");
                }

                var myoj = 1;
                var ttd = 1;//行列指针
                for(m1=0;m1<i[0];m1++){
                    var myRowspan01 = 0;
                    var ttr = 0;//行列指针
                    $('.J_TSaleProp').eq(0).find('li a span').eq(m1).click();
                    for(m2=0;m2<i[1];m2++){
                        if($('.J_TSaleProp').eq(1).find('li').eq(m2).hasClass('tb-out-of-stock')){
                            //$('#myTableK_b tr').eq(ttr).find('td').eq(ttd).attr('text','');
                            ttr++;
                        }else{
                            $('.J_TSaleProp').eq(1).find('li a span').eq(m2).click();
                            switch(myTorC){
                                case 'my':
                                    myPrice[z] = $('.tm-promo-price .tm-price').text();
                                    break;
                                case 'mn':
                                    myPrice[z] = $('.tm-price').text();
                                    break;
                                case 'by':
                                    myPrice[z] = $('#J_PromoPriceNum').text();
                                    break;
                                case 'bn':
                                    myPrice[z] = $('.tb-rmb-num').text();
                                    break;
                            }
                            $('#myTableK_b tr').eq(ttr).find('td').eq(ttd).text(myPrice[z]);
                            z++;
                            ttr++;
                            myoj++;
                        }
                        if(m2+1==i[1]){
                            $('.J_TSaleProp').eq(1).find('li a span').eq(m2).click();
                        }
                    }
                    ttd++;
                    $('.J_TSaleProp').eq(1).find('li.tb-selected a span').click();
                    //$('#myRp'+ m1).attr('rowspan',myoj-1);
                    myoj = 1;
                }
/*
                var myoj = 1;
                for(m1=0;m1<i[0];m1++){
                    var myRowspan01 = 0;
                    $('.J_TSaleProp').eq(0).find('li a span').eq(m1).click();
                    myPrice[z] = $('.J_TSaleProp').eq(0).find('li a span').eq(m1).text();
                    z++;
                    for(m2=0;m2<i[1];m2++){
                        $trTemp1 = $("<tr></tr>");
                        if($('.J_TSaleProp').eq(1).find('li').eq(m2).hasClass('tb-out-of-stock')){
                        }else{
                            if(myRowspan01 == 0){
                                $trTemp1.append('<td id="myRp'+ m1 +'">'+ myPrice[z-1] +'</td>');
                                myRowspan01 = 1;
                            }
                            $('.J_TSaleProp').eq(1).find('li a span').eq(m2).click();
                            myPrice[z] = $('.J_TSaleProp').eq(1).find('li a span').eq(m2).text();
                            $trTemp1.append('<td>'+ myPrice[z] +'</td>');
                            z++;
                            switch(myTorC){
                                case 'my':
                                    myPrice[z] = $('.tm-promo-price .tm-price').text();
                                    break;
                                case 'mn':
                                    myPrice[z] = $('.tm-price').text();
                                    break;
                                case 'by':
                                    myPrice[z] = $('#J_PromoPriceNum').text();
                                    break;
                                case 'bn':
                                    myPrice[z] = $('.tb-rmb-num').text();
                                    break;
                            }
                            $trTemp1.append('<td>'+ myPrice[z] +'</td>');
                            z++;
                            $trTemp1.appendTo("#myTableK_b");
                            myoj++;
                        }
                        if(m2+1==i[1]){
                            $('.J_TSaleProp').eq(1).find('li a span').eq(m2).click();
                        }
                    }
                    $('.J_TSaleProp').eq(1).find('li.tb-selected a span').click();
                    $('#myRp'+ m1).attr('rowspan',myoj-1);
                    myoj = 1;
                }
*/
                break;
            case 3:
                for(k=0;k<a;k++){
                    $mythisaa = $('.J_TSaleProp').eq(k);
                    i[k] = $mythisaa.find('li').length;
                    console.log(i[k]);
                    $trTemp0.append('<td>'+ $mythisaa.attr('data-property') +'</td>');
                }
                //取消默认选中
                if($mythisaa.find('li').attr('class')=='tb-selected'){
                    $(this).click();
                }
                $trTemp0.append('<td>价格</td>');
                $trTemp0.appendTo("#myTableK_h");
                myoj = 1;
                for(m1=0;m1<i[0];m1++){
                    myRowspan01 = 0;
                    $('.J_TSaleProp').eq(0).find('li a span').eq(m1).click();
                    myPrice[z] = $('.J_TSaleProp').eq(0).find('li a span').eq(m1).text();
                    z++;
                    for(m2=0;m2<i[1];m2++){
                        $trTemp1 = $("<tr></tr>");
                        var myRowspan02 = 0;
                        if(myRowspan01 == 0){
                            $trTemp1.append('<td id="myRp1'+ m1 +'">'+ myPrice[z-1] +'</td>');
                            myRowspan01 = 1;
                        }
                        if($('.J_TSaleProp').eq(1).find('li').eq(m2).hasClass('tb-out-of-stock')){
                        }else{
                            $('.J_TSaleProp').eq(1).find('li a span').eq(m2).click();
                            myPrice[z] = $('.J_TSaleProp').eq(1).find('li a span').eq(m2).text();
                            z++;
                            for(m3=0;m3<i[2];m3++){
                                if($('.J_TSaleProp').eq(2).find('li').eq(m3).hasClass('tb-out-of-stock')){
                                }else{
                                    if(myRowspan02 == 0){
                                        $trTemp1.append('<td id="myRp2'+ m2 +'">'+ myPrice[z-1] +'</td>');
                                        myRowspan02 = 1;
                                    }
                                    $('.J_TSaleProp').eq(2).find('li a span').eq(m3).click();
                                    myPrice[z] = $('.J_TSaleProp').eq(2).find('li a span').eq(m3).text();
                                    $trTemp1.append('<td>'+ myPrice[z] +'</td>');
                                    z++;
                                    switch(myTorC){
                                        case 'my':
                                            myPrice[z] = $('.tm-promo-price .tm-price').text();
                                            break;
                                        case 'mn':
                                            myPrice[z] = $('.tm-price').text();
                                            break;
                                        case 'by':
                                            myPrice[z] = $('#J_PromoPriceNum').text();
                                            break;
                                        case 'bn':
                                            myPrice[z] = $('.tb-rmb-num').text();
                                            break;
                                    }
                                    $trTemp1.append('<td>'+ myPrice[z] +'</td>');
                                    z++;
                                    $trTemp1.appendTo("#myTableK_b");
                                    myoj++;
                                    $trTemp1 = $("<tr></tr>");
                                }
                                if(m3+1==i[2]){
                                    $('.J_TSaleProp').eq(2).find('li a span').eq(m3).click();
                                }
                            }
                            $('.J_TSaleProp').eq(2).find('li.tb-selected a span').click();
                            $('#myRp2'+ m2).attr('rowspan',myoj-1);
                            myoj = 1;
                        }
                    }
                    $('#myRp1'+ m1).attr('rowspan',myoj-1);
                    myoj = 1;
                }
                break;
            case 4:
                for(k=0;k<a;k++){
                    $mythisaa = $('.J_TSaleProp').eq(k);
                    i[k] = $mythisaa.find('li').length;
                    console.log(i[k]);
                    $trTemp0.append('<td>'+ $mythisaa.attr('data-property') +'</td>');
                }
                //取消默认选中
                if($mythisaa.find('li').attr('class')=='tb-selected'){
                    $(this).click();
                }
                $trTemp0.append('<td>价格</td>');
                $trTemp0.appendTo("#myTableK_h");
                myoj = 1;
                for(m1=0;m1<i[0];m1++){
                    myRowspan01 = 0;
                    $('.J_TSaleProp').eq(0).find('li a span').eq(m1).click();
                    myPrice[z] = $('.J_TSaleProp').eq(0).find('li a span').eq(m1).text();
                    z++;
                    for(m2=0;m2<i[1];m2++){
                        if($('.J_TSaleProp').eq(1).find('li').eq(m2).hasClass('tb-out-of-stock')){
                        }else{
                            $('.J_TSaleProp').eq(1).find('li a span').eq(m2).click();
                            myPrice[z] = $('.J_TSaleProp').eq(1).find('li a span').eq(m2).text();
                            z++;
                            for(m3=0;m3<i[2];m3++){
                                if($('.J_TSaleProp').eq(2).find('li').eq(m3).hasClass('tb-out-of-stock')){
                                }else{
                                    $('.J_TSaleProp').eq(2).find('li a span').eq(m3).click();
                                    myPrice[z] = $('.J_TSaleProp').eq(2).find('li a span').eq(m3).text();
                                    z++;
                                    for(m4=0;m4<i[3];m4++){
                                        $trTemp1 = $("<tr></tr>");
                                        if($('.J_TSaleProp').eq(3).find('li').eq(m4).hasClass('tb-out-of-stock')){
                                        }else{
                                            $('.J_TSaleProp').eq(3).find('li a span').eq(m4).click();
                                            myPrice[z] = $('.J_TSaleProp').eq(3).find('li a span').eq(m4).text();
                                            z++;
                                            switch(myTorC){
                                                case 'my':
                                                    myPrice[z] = $('.tm-promo-price .tm-price').text();
                                                    break;
                                                case 'mn':
                                                    myPrice[z] = $('.tm-price').text();
                                                    break;
                                                case 'by':
                                                    myPrice[z] = $('#J_PromoPriceNum').text();
                                                    break;
                                                case 'bn':
                                                    myPrice[z] = $('.tb-rmb-num').text();
                                                    break;
                                            }
                                            z++;
                                        }
                                        if(m4+1==i[3]){
                                            $('.J_TSaleProp').eq(3).find('li a span').eq(m4).click();
                                        }
                                    }
                                    $('.J_TSaleProp').eq(3).find('li.tb-selected a span').click();
                                }
                            }
                        }
                    }
                }
                break;
        }
        console.log(myPrice);
        var myminminaaa = parseInt($('#myTableK').css('width'))+1;
        $('#myTableK').css('min-width',myminminaaa);
        //console.log($('#myTableK').css('min-width'));
    }
    function myOutputTable(){
        if($('#mybigtable00').length == 0){
            $('#J_StrPriceModBox').after('<div id="mybigtable00"><div id="mybigtable01"><div class="mygege01"></div><div class="mygege02"></div><div class="mygege03"></div><div class="mygege04"></div><div class="mygege00">Price List</div><div id="myclose"></div></div><div id="mybigtable02"><table id="myTableK"><thead id="myTableK_h"></thead><tbody id="myTableK_b"></tbody></table></div></div>');
        }else{
            mycloseTable();
        }
    }
    function mycloseTable(){
        if($('#mybigtable00').css('display')=='block'){
            //console.log('block');
            $('#mybigtable00').css('display','none');
            $('#mybigtable00').css('top','90px');
            $('#mybigtable00').css('left','0px');
        }else if($('#mybigtable00').css('display')=='none'){
            //console.log('display');
            $('#mybigtable00').css('display','block');
        }
    }
    $("body").on("click","#myclose",function(){
        mycloseTable();
    });
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
    $("body").on("mousedown","#mybigtable01",function(e){
        var positionDiv = $(this).parent().offset();
        var distenceX = e.pageX - positionDiv.left;
        var distenceY = e.pageY - positionDiv.top;
        document.body.classList.add('no-select');
        $('#mybigtable00').css('opacity','0.98');
        $(document).mousemove(function(e) {
            var myoX,myoY;
            if(myTorC == 'by' || myTorC == 'bn'){
                myoX = $('.tb-meta').offset().left;
                myoY = $('.tb-meta').offset().top;
            }else if(myTorC == 'my' || myTorC == 'mn'){
                myoX = $('.tm-fcs-panel').offset().left;
                myoY = $('.tm-fcs-panel').offset().top;
            }
            var x = e.pageX - distenceX - myoX;
            var y = e.pageY - distenceY - myoY;
            if (x < - myoX) {
                x = - myoX;
            } else if (x > $(document).width() - $("#mybigtable00").outerWidth(true)) {
                x = $(document).width() - $("#mybigtable00").outerWidth(true);
            }
            if (y < - myoY + 263) {
                y = - myoY + 263;
            } else if (y > $(document).height() - $("#mybigtable00").outerHeight(true)) {
                y = $(document).height() - $("#mybigtable00").outerHeight(true);
            }
            $("#mybigtable00").css({
                left: x + "px",
                top: y + "px"
            });
            //console.log('m:mybigtable00:',x,y);
        });
        $(document).mouseup(function() {
            $(document).off("mousemove");
            document.body.classList.remove('no-select');
            $('#mybigtable00').css('opacity','1');
        });
    });
//阿里妈妈搜索功能-------------------------------------------------------------------------------------------------
    $('.tb-action.tm-clear').append('<div class="myaltm" id="myAlbuttom"></div>');
    $('#J_juValid').append('<div class="myaltb" id="myAlbuttom"></div>');
    $('body').on('click','#myAlbuttom',function(){
        var mymyurl_1 = mypatt_1.exec(window.location.href);
        var mymyurl_2 = mypatt_2.exec(window.location.href);
        openNewWindow(mymyurl_2 + mymyurl_1);
    });
    function openNewWindow(webstr) {
        let a = $("<a href='https://pub.alimama.com/promo/search/index.htm?q="+ webstr +"' target='_blank'></a>").get(0);
        let e = document.createEvent('MouseEvents');
        e.initEvent( 'click', true, true );
        a.dispatchEvent(e);
    }
})();