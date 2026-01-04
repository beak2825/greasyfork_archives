// ==UserScript==
// @name         指数转换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Just for myself
// @author       You
// @match        https://sycm.taobao.com/mc/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376090/%E6%8C%87%E6%95%B0%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/376090/%E6%8C%87%E6%95%B0%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function GMaddStyle(cssText){
        let cssa = document.createElement('style');
        cssa.textContent = cssText;
        let doc = document.head || document.documentElement;
        doc.appendChild(cssa);
    }
    GMaddStyle(`
#mychange{
	float:right;
	height:26px;
	line-height:26px;
	margin-top:13px;
	width:50px;
	background:#2062e6;
	color:#fff;
	margin-right:10px;
	text-align:center;
	cursor:pointer;
}
#mychange:hover{
	background:#3c77ef;
}
#mychange:active{
	background:#2062e6;
}
.myzhi{
	color:#b400ff;
}
    `);

const p1 = 5.2496E-43;
const p2 = -2.0083E-37;
const p3 = 3.2811E-32;
const p4 = -3.0047E-27;
const p5 = 1.7074E-22;
const p6 = -6.3315E-18;
const p7 = 1.5881E-13;
const p8 = -0.0000000028878;
const p9 = 0.000078775;
const p10 = 0.10539;
const p11 = -23.654;

const A1 = -0.0046515;
const A2 = 0.0075016;
const A3 = 0.042955;
const A4 = -0.10187;
const A5 = 0.013199;
const A6 = -0.040853;
const A7 = 0.84974;
const A8 = -5.0416;
const A9 = 111.44;
const A10 = 645.68;
const A11 = 769.1;

const mu1 = 2670;
const sigma1 = 1349.6;

const B1 = 0.000037684;
const B2 = -0.0014182;
const B3 = 0.010455;
const B4 = -0.039072;
const B5 = 0.1279;
const B6 = -0.5435;
const B7 = 2.9064;
const B8 = -21.738;
const B9 = 720.3;
const B10 = 4907.1;
const B11 = 7136.7;

const mu2 = 10016;
const sigma2 = 4029.6;

const C1 = -12.452;
const C2 = -8.1478;
const C3 = 85.972;
const C4 = 55.396;
const C5 = -195.48;
const C6 = -113.67;
const C7 = 175.9;
const C8 = 37.031;
const C9 = 2511.9;
const C10 = 26957;
const C11 = 62172;

const mu3 = 35000;
const sigma3 = 8677.6;

const D1 = 21.92;
const D2 = 9.7412;
const D3 = -194.36;
const D4 = -50.726;
const D5 = 624.46;
const D6 = 61.782;
const D7 = -847.67;
const D8 = -76.1;
const D9 = 6568.3;
const D10 = 81132;
const D11 = 237710;

const mu4 = 75000;
const sigma4 = 14451;

const E1 = 0.00021205;
const E2 = -0.0002959;
const E3 = 0.00070742;
const E4 = -0.016036;
const E5 = 0.13952;
const E6 = -1.2975;
const E7 = 14.995;
const E8 = -255.1;
const E9 = 21480;
const E10 = 280320;
const E11 = 815490;

const mu5 = 150000;
const sigma5 = 28885;

const F1 = 0.00036646;
const F2 = -0.00010914;
const F3 = -0.0023614;
const F4 = -0.00038871;
const F5 = 0.021073;
const F6 = -0.24807;
const F7 = 4.778;
const F8 = -137.21;
const F9 = 19559;
const F10 = 421720;
const F11 = 2034500;

const mu6 = 250000;
const sigma6 = 28885;

const G1 = -0.00070238;
const G2 = -0.00015136;
const G3 = 0.0048127;
const G4 = 0.00060825;
const G5 = -0.0076859;
const G6 = -0.083909;
const G7 = 2.2752;
const G8 = -91.547;
const G9 = 18400;
const G10 = 552860;
const G11 = 3723800;

const mu7 = 350000;
const sigma7 = 28885;

const H1 = -0.00027677;
const H2 = -0.0002077;
const H3 = 0.0018697;
const H4 = 0.0014018;
const H5 = -0.0031661;
const H6 = -0.040192;
const H7 = 1.3024;
const H8 = -67.777;
const H9 = 17584;
const H10 = 677300;
const H11 = 5854900;

const mu8 = 450000;
const sigma8 = 28885;

const I1 = 0.00015941;
const I2 = -0.000076473;
const I3 = -0.00088476;
const I4 = 0.0004344;
const I5 = 0.0021685;
const I6 = -0.020203;
const I7 = 0.8322;
const I8 = -53.365;
const I9 = 16960;
const I10 = 796800;
const I11 = 8407800;

const mu9 = 550000;
const sigma9 = 28885;

const J1 = -0.00010778;
const J2 = 0.000012337;
const J3 = 0.00061626;
const J4 = -0.00031884;
const J5 = -0.00075768;
const J6 = -0.010023;
const J7 = 0.57729;
const J8 = -43.76;
const J9 = 16459;
const J10 = 912450;
const J11 = 11368000;

const mu10 = 650000;
const sigma10 = 28885;

const K1 = -0.00033713;
const K2 = 0.0000050257;
const K3 = 0.0023101;
const K4 = 0.00026023;
const K5 = -0.0052267;
const K6 = -0.0084701;
const K7 = 0.42584;
const K8 = -36.929;
const K9 = 16042;
const K10 = 1024900;
const K11 = 14722000;

const mu11 = 750000;
const sigma11 = 28885;

const L1 = 0.00012133;
const L2 = 0.000020399;
const L3 = -0.00096036;
const L4 = -0.0000050903;
const L5 = 0.0028858;
const L6 = -0.0051247;
const L7 = 0.31639;
const L8 = -31.846;
const L9 = 15686;
const L10 = 1134700;
const L11 = 18461000;

const mu12 = 850000;
const sigma12 = 28885;

const M1 = -0.00029474;
const M2 = 0.000065201;
const M3 = 0.002286;
const M4 = -0.00033116;
const M5 = -0.0062837;
const M6 = -0.0029633;
const M7 = 0.25812;
const M8 = -27.924;
const M9 = 15376;
const M10 = 1242300;
const M11 = 22576000;

const mu13 = 950000;
const sigma13 = 28885;

const zp1 = 8.4292E-32;
const zp2 = -1.4919E-27;
const zp3 = 1.1083E-23;
const zp4 = -4.4828E-20;
const zp5 = 1.07E-16;
const zp6 = -1.5212E-13;
const zp7 = 0.00000000012318;
const zp8 = -0.000000063939;
const zp9 = 0.00012665;
const zp10 = -0.0015385;
const zp11 = 0.0863;

    $('body').on('click',function(){
        if($('#mychange').attr('id')!='mychange'){
            $('.oui-card-header').append('<div id="mychange">转换</div>');
        }
    });
    $('body').on('click','#mychange',function(){
        var a = 0;
        $('.myzhi').remove();
        //交易指数
        $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-tradeIndex .alife-dt-card-common-table-sortable-value').each(function(){
            var $t = $(this);
            var $h = $t.parent().parent().prev().prev().find('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-uvIndex');
            if($h.length > 0){
                var ab = commafyback($h.find('.alife-dt-card-common-table-sortable-value').text());
                ab = commafyback(zh_ty(ab));
                a = commafyback($t.text());
                a = commafyback(zh_jiaoyi(a));
                ab = a / ab;
                $(this).before('<span class="myzhi">'+ ab.toFixed(2) + ' / ' + a +' / </span>');
            }else{
                a = commafyback($t.text());
                a = zh_jiaoyi(a);
                $(this).before('<span class="myzhi">'+ a + ' / </span>');
            }
        });
        //流量指数
        $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-uvIndex .alife-dt-card-common-table-sortable-value').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //搜索人气
        $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-seIpvUvHits .alife-dt-card-common-table-sortable-value').each(function(){
            var $t = $(this);
            var $h = $t.parent().parent().prev().find('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-uvIndex');
            if($h.length > 0){
                var ab = commafyback($h.find('.alife-dt-card-common-table-sortable-value').text());
                ab = commafyback(zh_ty(ab));
                a = commafyback($t.text());
                a = commafyback(zh_ty(a));
                ab = Math.round(a / ab * 100);
                $(this).before('<span class="myzhi">'+ ab + '% / ' + a +' / </span>');
            }else{
                a = commafyback($(this).text());
                a = zh_ty(a);
                $(this).before('<span class="myzhi">'+ a +' / </span>');
            }
        });
        //收藏人气
        $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-cltHits .alife-dt-card-common-table-sortable-value').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //加购人气
        $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-cartHits .alife-dt-card-common-table-sortable-value').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //点击人气
        $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-clickHits .alife-dt-card-common-table-sortable-value').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //点击热度
        $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-clickHot .alife-dt-card-common-table-sortable-value').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //搜索热度
        $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-sePvIndex .alife-dt-card-common-table-sortable-value').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //支付转化指数
        $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-payRateIndex .alife-dt-card-common-table-sortable-value').each(function(){
            a = $(this).text();
            a = parseFloat(a.replace(',',''));
            a = zh_zfzh(a);
            $(this).before('<span class="myzhi">'+ a +'% / </span>');
        });
        //竞品分析-流量指数
        $('.alife-one-design-sycm-indexes-trend-index-item-selectable.alife-one-design-sycm-indexes-trend-index-item-uvIndex .oui-pull-right.oui-index-cell-subIndex-value .oui-num').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //竞品分析-交易指数
        $('.alife-one-design-sycm-indexes-trend-index-item-selectable.alife-one-design-sycm-indexes-trend-index-item-tradeIndex .oui-pull-right.oui-index-cell-subIndex-value .oui-num').each(function(){
            a = commafyback($(this).text());
            a = zh_jiaoyi(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //竞品分析-搜索人气
        $('.alife-one-design-sycm-indexes-trend-index-item-selectable.alife-one-design-sycm-indexes-trend-index-item-seIpvUvHits .oui-pull-right.oui-index-cell-subIndex-value .oui-num').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //竞品分析-收藏人气
        $('.alife-one-design-sycm-indexes-trend-index-item-selectable.alife-one-design-sycm-indexes-trend-index-item-cltHits .oui-pull-right.oui-index-cell-subIndex-value .oui-num').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //竞品分析-加购人气
        $('.alife-one-design-sycm-indexes-trend-index-item-selectable.alife-one-design-sycm-indexes-trend-index-item-cartHits .oui-pull-right.oui-index-cell-subIndex-value .oui-num').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //竞品分析-成交关键词-加购人气
        if(window.location.href.substring(0,34)=='https://sycm.taobao.com/mc/ci/item'){
            $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-tradeIndex').find('span').each(function(){
                a = $(this).text();
                if(a!=''){
                    a = commafyback(a);
                    a = zh_ty(a);
                    $(this).before('<span class="myzhi">'+ a +' / </span>');
                }
            });
        }
        //竞店分析-Top商品榜-热销-交易指数
        if(window.location.href.substring(0,34)=='https://sycm.taobao.com/mc/ci/shop'){
            $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-tradeIndex').each(function(){
                $(this).find('span').eq(0).each(function(){
                    a = $(this).text();
                    if(a!=''){
                        a = commafyback(a);
                        a = zh_jiaoyi(a);
                        $(this).before('<span class="myzhi">'+ a +' / </span>');
                    }
                });
            });
        }
        //竞店分析-Top商品榜-流量-流量指数
        if(window.location.href.substring(0,34)=='https://sycm.taobao.com/mc/ci/shop'){
            $('.alife-dt-card-common-table-sortable-td.alife-dt-card-common-table-uvIndex').each(function(){
                $(this).find('span').eq(0).each(function(){
                    a = $(this).text();
                    if(a!=''){
                        a = commafyback(a);
                        a = zh_ty(a);
                        $(this).before('<span class="myzhi">'+ a +' / </span>');
                    }
                });
            });
        }
        //竞店分析-客群指数
        $('.alife-one-design-sycm-indexes-trend-index-item-selectable.alife-one-design-sycm-indexes-trend-index-item-payByrCntIndex .oui-pull-right.oui-index-cell-subIndex-value .oui-num').each(function(){
            a = commafyback($(this).text());
            a = zh_ty(a);
            $(this).before('<span class="myzhi">'+ a +' / </span>');
        });
        //竞品分析-支付转化指数
        $('.alife-one-design-sycm-indexes-trend-index-item-selectable.alife-one-design-sycm-indexes-trend-index-item-payRateIndex .oui-pull-right.oui-index-cell-subIndex-value .oui-num').each(function(){
            a = $(this).text();
            a = parseFloat(a.replace(',',''));
            a = zh_zfzh(a);
            $(this).before('<span class="myzhi">'+ a +'% / </span>');
        });
    });
    function commafyback(num){
        var x = num.split(',');
        return parseFloat(x.join(""));
    }
    function commafy(num){
        num = Math.round(num) +"";
        var re = /(-?\d+)(\d{3})/;
        while(re.test(num)){
            num = num.replace(re,"$1,$2");
        }
        return num;
    }
    //交易指数
    function zh_jiaoyi(a){
        var z;
        if(a > 99 && a <= 5000){
            z = (a - mu1) / sigma1;
            z = A1 * Math.pow(z,10) + A2 * Math.pow(z,9) + A3 *Math.pow(z,8) + A4 * Math.pow(z,7) + A5 * Math.pow(z,6) + A6 * Math.pow(z,5) + A7 * Math.pow(z,4) + A8 * Math.pow(z,3) + A9 * Math.pow(z,2) + A10 * z + A11
        }else if(a > 5000 && a <= 20000){
            z = (a - mu2) / sigma2;
            z = B1 * Math.pow(z,10) + B2 * Math.pow(z,9) + B3 *Math.pow(z,8) + B4 * Math.pow(z,7) + B5 * Math.pow(z,6) + B6 * Math.pow(z,5) + B7 * Math.pow(z,4) + B8 * Math.pow(z,3) + B9 * Math.pow(z,2) + B10 * z + B11;
        }else if(a > 20000 && a <= 50000){
            z = (a - mu3) / sigma3;
            z = C1 * Math.pow(z,10) + C2 * Math.pow(z,9) + C3 *Math.pow(z,8) + C4 * Math.pow(z,7) + C5 * Math.pow(z,6) + C6 * Math.pow(z,5) + C7 * Math.pow(z,4) + C8 * Math.pow(z,3) + C9 * Math.pow(z,2) + C10 * z + C11;
        }else if(a > 50000 && a <= 100000){
            z = (a - mu4) / sigma4;
            z = D1 * Math.pow(z,10) + D2 * Math.pow(z,9) + D3 *Math.pow(z,8) + D4 * Math.pow(z,7) + D5 * Math.pow(z,6) + D6 * Math.pow(z,5) + D7 * Math.pow(z,4) + D8 * Math.pow(z,3) + D9 * Math.pow(z,2) + D10 * z + D11;
        }else if(a > 100000 && a <= 200000){
            z = (a - mu5) / sigma5;
            z = E1 * Math.pow(z,10) + E2 * Math.pow(z,9) + E3 *Math.pow(z,8) + E4 * Math.pow(z,7) + E5 * Math.pow(z,6) + E6 * Math.pow(z,5) + E7 * Math.pow(z,4) + E8 * Math.pow(z,3) + E9 * Math.pow(z,2) + E10 * z + E11;
        }else if(a > 200000 && a <= 300000){
            z = (a - mu6) / sigma6;
            z = F1 * Math.pow(z,10) + F2 * Math.pow(z,9) + F3 *Math.pow(z,8) + F4 * Math.pow(z,7) + F5 * Math.pow(z,6) + F6 * Math.pow(z,5) + F7 * Math.pow(z,4) + F8 * Math.pow(z,3) + F9 * Math.pow(z,2) + F10 * z + F11;
        }else if(a > 300000 && a <= 400000){
            z = (a - mu7) / sigma7;
            z = G1 * Math.pow(z,10) + G2 * Math.pow(z,9) + G3 *Math.pow(z,8) + G4 * Math.pow(z,7) + G5 * Math.pow(z,6) + G6 * Math.pow(z,5) + G7 * Math.pow(z,4) + G8 * Math.pow(z,3) + G9 * Math.pow(z,2) + G10 * z + G11;
        }else if(a > 400000 && a <= 500000){
            z = (a - mu8) / sigma8;
            z = H1 * Math.pow(z,10) + H2 * Math.pow(z,9) + H3 *Math.pow(z,8) + H4 * Math.pow(z,7) + H5 * Math.pow(z,6) + H6 * Math.pow(z,5) + H7 * Math.pow(z,4) + H8 * Math.pow(z,3) + H9 * Math.pow(z,2) + H10 * z + H11;
        }else if(a > 500000 && a <= 600000){
            z = (a - mu9) / sigma9;
            z = I1 * Math.pow(z,10) + I2 * Math.pow(z,9) + I3 *Math.pow(z,8) + I4 * Math.pow(z,7) + I5 * Math.pow(z,6) + I6 * Math.pow(z,5) + I7 * Math.pow(z,4) + I8 * Math.pow(z,3) + I9 * Math.pow(z,2) + I10 * z + I11;
        }else if(a > 600000 && a <= 700000){
            z = (a - mu10) / sigma10;
            z = J1 * Math.pow(z,10) + J2 * Math.pow(z,9) + J3 *Math.pow(z,8) + J4 * Math.pow(z,7) + J5 * Math.pow(z,6) + J6 * Math.pow(z,5) + J7 * Math.pow(z,4) + J8 * Math.pow(z,3) + J9 * Math.pow(z,2) + J10 * z + J11;
        }else if(a > 700000 && a <= 800000){
            z = (a - mu11) / sigma11;
            z = K1 * Math.pow(z,10) + K2 * Math.pow(z,9) + K3 *Math.pow(z,8) + K4 * Math.pow(z,7) + K5 * Math.pow(z,6) + K6 * Math.pow(z,5) + K7 * Math.pow(z,4) + K8 * Math.pow(z,3) + K9 * Math.pow(z,2) + K10 * z + K11;
        }else if(a > 800000 && a <= 900000){
            z = (a - mu12) / sigma12;
            z = L1 * Math.pow(z,10) + L2 * Math.pow(z,9) + L3 *Math.pow(z,8) + L4 * Math.pow(z,7) + L5 * Math.pow(z,6) + L6 * Math.pow(z,5) + L7 * Math.pow(z,4) + L8 * Math.pow(z,3) + L9 * Math.pow(z,2) + L10 * z + L11;
        }else if(a > 900000 && a <= 1000000){
            z = (a - mu13) / sigma13;
            z = M1 * Math.pow(z,10) + M2 * Math.pow(z,9) + M3 *Math.pow(z,8) + M4 * Math.pow(z,7) + M5 * Math.pow(z,6) + M6 * Math.pow(z,5) + M7 * Math.pow(z,4) + M8 * Math.pow(z,3) + M9 * Math.pow(z,2) + M10 * z + M11;
        }else{
            z = 1;
        }
        return commafy(z);
    }
    //同样公式
    function zh_ty(a){
        var z;
        if(a > 99 && a <= 5000){
            z = (a - mu1) / sigma1;
            z = A1 * Math.pow(z,10) + A2 * Math.pow(z,9) + A3 *Math.pow(z,8) + A4 * Math.pow(z,7) + A5 * Math.pow(z,6) + A6 * Math.pow(z,5) + A7 * Math.pow(z,4) + A8 * Math.pow(z,3) + A9 * Math.pow(z,2) + A10 * z + A11
        }else if(a > 5000 && a <= 20000){
            z = (a - mu2) / sigma2;
            z = B1 * Math.pow(z,10) + B2 * Math.pow(z,9) + B3 *Math.pow(z,8) + B4 * Math.pow(z,7) + B5 * Math.pow(z,6) + B6 * Math.pow(z,5) + B7 * Math.pow(z,4) + B8 * Math.pow(z,3) + B9 * Math.pow(z,2) + B10 * z + B11;
        }else if(a > 20000 && a <= 50000){
            z = (a - mu3) / sigma3;
            z = C1 * Math.pow(z,10) + C2 * Math.pow(z,9) + C3 *Math.pow(z,8) + C4 * Math.pow(z,7) + C5 * Math.pow(z,6) + C6 * Math.pow(z,5) + C7 * Math.pow(z,4) + C8 * Math.pow(z,3) + C9 * Math.pow(z,2) + C10 * z + C11;
        }else if(a > 50000 && a <= 100000){
            z = (a - mu4) / sigma4;
            z = D1 * Math.pow(z,10) + D2 * Math.pow(z,9) + D3 *Math.pow(z,8) + D4 * Math.pow(z,7) + D5 * Math.pow(z,6) + D6 * Math.pow(z,5) + D7 * Math.pow(z,4) + D8 * Math.pow(z,3) + D9 * Math.pow(z,2) + D10 * z + D11;
        }else if(a > 100000 && a <= 200000){
            z = (a - mu5) / sigma5;
            z = E1 * Math.pow(z,10) + E2 * Math.pow(z,9) + E3 *Math.pow(z,8) + E4 * Math.pow(z,7) + E5 * Math.pow(z,6) + E6 * Math.pow(z,5) + E7 * Math.pow(z,4) + E8 * Math.pow(z,3) + E9 * Math.pow(z,2) + E10 * z + E11;
        }else if(a > 200000 && a <= 300000){
            z = (a - mu6) / sigma6;
            z = F1 * Math.pow(z,10) + F2 * Math.pow(z,9) + F3 *Math.pow(z,8) + F4 * Math.pow(z,7) + F5 * Math.pow(z,6) + F6 * Math.pow(z,5) + F7 * Math.pow(z,4) + F8 * Math.pow(z,3) + F9 * Math.pow(z,2) + F10 * z + F11;
        }else if(a > 300000 && a <= 400000){
            z = (a - mu7) / sigma7;
            z = G1 * Math.pow(z,10) + G2 * Math.pow(z,9) + G3 *Math.pow(z,8) + G4 * Math.pow(z,7) + G5 * Math.pow(z,6) + G6 * Math.pow(z,5) + G7 * Math.pow(z,4) + G8 * Math.pow(z,3) + G9 * Math.pow(z,2) + G10 * z + G11;
        }else if(a > 400000 && a <= 500000){
            z = (a - mu8) / sigma8;
            z = H1 * Math.pow(z,10) + H2 * Math.pow(z,9) + H3 *Math.pow(z,8) + H4 * Math.pow(z,7) + H5 * Math.pow(z,6) + H6 * Math.pow(z,5) + H7 * Math.pow(z,4) + H8 * Math.pow(z,3) + H9 * Math.pow(z,2) + H10 * z + H11;
        }else if(a > 500000 && a <= 600000){
            z = (a - mu9) / sigma9;
            z = I1 * Math.pow(z,10) + I2 * Math.pow(z,9) + I3 *Math.pow(z,8) + I4 * Math.pow(z,7) + I5 * Math.pow(z,6) + I6 * Math.pow(z,5) + I7 * Math.pow(z,4) + I8 * Math.pow(z,3) + I9 * Math.pow(z,2) + I10 * z + I11;
        }else{
            z = 1;
        }
        return commafy(z);
    }
    //支付转化指数
    function zh_zfzh(a){
        var z;
        if(a>0 && a<3718){
            z = (zp1 * Math.pow(a,10) + zp2 * Math.pow(a,9) + zp3 * Math.pow(a,8) + zp4 * Math.pow(a,7) + zp5 * Math.pow(a,6) + zp6 * Math.pow(a,5) + zp7 * Math.pow(a,4) + zp8 *Math.pow(a,3) + zp9 * Math.pow(a,2) + zp10 * a + zp11) / 10
            return z.toFixed(2);
        }else{
            return '>100';
        }
    }
})();