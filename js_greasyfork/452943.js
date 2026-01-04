// ==UserScript==
// @name         zcdzwms
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  ZCDZWMS的工具——切换ou
// @author       ZhangJian
// @match        https://wms.zcdzyl.com/cmst/view/index.html
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452943/zcdzwms.user.js
// @updateURL https://update.greasyfork.org/scripts/452943/zcdzwms.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ul_tag = $(".kit-layout-admin > div.layui-header>ul");
    var toggle_btn_seprate = '<li class="layui-nav-item">&nbsp;&nbsp;&nbsp;|</li>';
    if (ul_tag) {
        ul_tag.append(toggle_btn_seprate);
    }

    var toggle_btn_html = '<li class="layui-nav-item li-toggle-ou">';
    toggle_btn_html += '<a href="javascript:void(0);">';
    toggle_btn_html += '<span>ou切换</span>';
    toggle_btn_html += '<span class="layui-nav-more"></span>';
    toggle_btn_html += '</a>';
    toggle_btn_html += '<dl class="layui-nav-child layui-anim layui-anim-upbit toggle-ou" style="height:600px;overflow-y:scroll">';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="11" class="a-changeOU"><i class="a-changeOU fa fa-address-card-o" aria-hidden="true"></i><span>无锡</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="12" class="a-changeOU"><span>西宁库</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="21" class="a-changeOU"><span>洛阳</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="22" class="a-changeOU"><span>洛阳分</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="23" class="a-changeOU"><span>巩义</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="23" class="a-changeOU"><span>工程物流</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="24" class="a-changeOU"><span>工程物流(南昌)</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="31" class="a-changeOU"><span>东北有色</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="32" class="a-changeOU"><span>东北有色中心仓</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="41" class="a-changeOU"><span>晟世照邦</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="42" class="a-changeOU"><span>晟世照邦三水西</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="43" class="a-changeOU"><span>晟世照邦广州有色仓</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="44" class="a-changeOU"><span>晟世照邦黄埔保盈仓</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="45" class="a-changeOU"><span>黄埔保金保税仓</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="51" class="a-changeOU"><span>成都天一本库</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="52" class="a-changeOU"><span>成都天一</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="53" class="a-changeOU"><span>成都天二</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="54" class="a-changeOU"><span>成都双流</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="55" class="a-changeOU"><span>云南分王家营库</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="56" class="a-changeOU"><span>云南分金马库</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="57" class="a-changeOU"><span>云南分万达库</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="61" class="a-changeOU"><span>天津分</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="62" class="a-changeOU"><span>天津陆通</span></a></dd>';
    toggle_btn_html += '<dd><a href="javascript:void(0);" name="63" class="a-changeOU"><span>天津陆通邹平</span></a></dd>';
	toggle_btn_html += '<dd><a href="javascript:void(0);" name="71" class="a-changeOU"><span>河北</span></a></dd>';
    toggle_btn_html += '</dl>';
    toggle_btn_html += ' </li>';
    //将以上拼接的html代码插入到网页里的ul标签中
    if (ul_tag) {
        ul_tag.append(toggle_btn_html);
    }

    function Toast(msg,duration){
        duration=isNaN(duration)?3000:duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(m) }, d * 1000);
        }, duration);
    }

    $(function () {
        var showDD = false;
        $('.li-toggle-ou').on('click', function() {
            showDD = !showDD;
        if(showDD)
            $(".toggle-ou").addClass("layui-show");
        else
            $(".toggle-ou").removeClass("layui-show");
        });

        $(".a-changeOU").on("click", function(e){
           var f = e.currentTarget.attributes.name.value;
           console.log(f);
           switch(f){
               case '11':
                   $("#ouName").html("中储发展股份有限公司无锡物流中心");
                   sessionStorage.setItem("ouName","中储发展股份有限公司无锡物流中心");
                   sessionStorage.setItem("ouid","1000001217");
                   sessionStorage.setItem("ouId","1000001217");
                   Toast('切换成功',2000);
                   break;
			   case '12':
                   $("#ouName").html("无锡中储物流有限公司青海分公司");
                   sessionStorage.setItem("ouName","无锡中储物流有限公司青海分公司");
                   sessionStorage.setItem("ouid","1000022334");
                   sessionStorage.setItem("ouId","1000022334");
                   Toast('切换成功',2000);
                   break;
               case '21':
                   $("#ouName").html("中储洛阳物流有限公司");
                   sessionStorage.setItem("ouName","中储洛阳物流有限公司");
                   sessionStorage.setItem("ouid","1000015123");
                   sessionStorage.setItem("ouId","1000015123");
                   Toast('切换成功',2000);
                   break;
			   case '22':
                   $("#ouName").html("中储发展股份有限公司洛阳分公司");
                   sessionStorage.setItem("ouName","中储发展股份有限公司洛阳分公司");
                   sessionStorage.setItem("ouid","1000015754");
                   sessionStorage.setItem("ouId","1000015754");
                   Toast('切换成功',2000);
                   break;
               case '23':
                   $("#ouName").html("中储发展股份有限公司巩义分公司");
                   sessionStorage.setItem("ouName","中储发展股份有限公司巩义分公司");
                   sessionStorage.setItem("ouid","1000005330");
                   sessionStorage.setItem("ouId","1000005330");
                   Toast('切换成功',2000);
                   break;
               case '23':
                   $("#ouName").html("中储工程物流有限公司河南分公司");
                   sessionStorage.setItem("ouName","中储工程物流有限公司河南分公司");
                   sessionStorage.setItem("ouid","1000007371");
                   sessionStorage.setItem("ouId","1000007371");
                   Toast('切换成功',2000);
                   break;
               case '24':
                   $("#ouName").html("中储工程物流有限公司河南分公司（南昌仓库）");
                   sessionStorage.setItem("ouName","中储工程物流有限公司河南分公司（南昌仓库）");
                   sessionStorage.setItem("ouid","1000012594");
                   sessionStorage.setItem("ouId","1000012594");
                   Toast('切换成功',2000);
                   break;
               case '31':
                   $("#ouName").html("中储（沈阳）东北有色金属市场有限公司");
                   sessionStorage.setItem("ouName","中储（沈阳）东北有色金属市场有限公司");
                   sessionStorage.setItem("ouid","1000008242");
                   sessionStorage.setItem("ouId","1000008242");
                   Toast('切换成功',2000);
                   break;
               case '32':
                   $("#ouName").html("中储（沈阳）东北有色金属市场有限公司于洪中心仓");
                   sessionStorage.setItem("ouName","中储（沈阳）东北有色金属市场有限公司于洪中心仓");
                   sessionStorage.setItem("ouid","1000014033");
                   sessionStorage.setItem("ouId","1000014033");
                   Toast('切换成功',2000);
                   break;
               case '41':
                   $("#ouName").html("广东中储晟世照邦物流有限公司");
                   sessionStorage.setItem("ouName","广东中储晟世照邦物流有限公司");
                   sessionStorage.setItem("ouid","1000007910");
                   sessionStorage.setItem("ouId","1000007910");
                   Toast('切换成功',2000);
                   break;
               case '42':
                   $("#ouName").html("广东中储晟世照邦物流有限公司（三水西仓库）");
                   sessionStorage.setItem("ouName","广东中储晟世照邦物流有限公司（三水西仓库）");
                   sessionStorage.setItem("ouid","1000010386");
                   sessionStorage.setItem("ouId","1000010386");
                   Toast('切换成功',2000);
                   break;
			   case '43':
                   $("#ouName").html("广东中储晟世照邦物流有限公司广州有色仓");
                   sessionStorage.setItem("ouName","广东中储晟世照邦物流有限公司广州有色仓");
                   sessionStorage.setItem("ouid","1000015436");
                   sessionStorage.setItem("ouId","1000015436");
                   Toast('切换成功',2000);
                   break;
			   case '44':
                   $("#ouName").html("广东中储晟世照邦物流有限公司黄埔保盈仓");
                   sessionStorage.setItem("ouName","广东中储晟世照邦物流有限公司黄埔保盈仓");
                   sessionStorage.setItem("ouid","1000022179");
                   sessionStorage.setItem("ouId","1000022179");
                   Toast('切换成功',2000);
                   break;
			   case '45':
                   $("#ouName").html("中国物资储运广州有限公司保税分公司黄埔保金保税仓");
                   sessionStorage.setItem("ouName","中国物资储运广州有限公司保税分公司黄埔保金保税仓");
                   sessionStorage.setItem("ouid","1000022209");
                   sessionStorage.setItem("ouId","1000022209");
                   Toast('切换成功',2000);
                   break;
               case '51':
                   $("#ouName").html("中储发展股份有限公司成都天一分公司（本库）");
                   sessionStorage.setItem("ouName","中储发展股份有限公司成都天一分公司");
                   sessionStorage.setItem("ouid","1000014732");
                   sessionStorage.setItem("ouId","1000014732");
                   Toast('切换成功',2000);
                   break;
               case '52':
                   $("#ouName").html("中储发展股份有限公司成都天一分公司");
                   sessionStorage.setItem("ouName","中储发展股份有限公司成都天一分公司");
                   sessionStorage.setItem("ouid","1000012053");
                   sessionStorage.setItem("ouId","1000012053");
                   Toast('切换成功',2000);
                   break;
               case '53':
                   $("#ouName").html("中储发展股份有限公司成都天二分公司");
                   sessionStorage.setItem("ouName","中储发展股份有限公司成都天二分公司");
                   sessionStorage.setItem("ouid","1000012054");
                   sessionStorage.setItem("ouId","1000012054");
                   Toast('切换成功',2000);
                   break;
               case '54':
                   $("#ouName").html("成都中储发展物流有限责任公司");
                   sessionStorage.setItem("ouName","成都中储发展物流有限责任公司");
                   sessionStorage.setItem("ouid","1000014606");
                   sessionStorage.setItem("ouId","1000014606");
                   Toast('切换成功',2000);
                   break;
			   case '55':
                   $("#ouName").html("中储发展股份有限公司云南分公司-王家营库");
                   sessionStorage.setItem("ouName","中储发展股份有限公司云南分公司");
                   sessionStorage.setItem("ouid","1000017715");
                   sessionStorage.setItem("ouId","1000017715");
                   Toast('切换成功',2000);
                   break;
			   case '56':
                   $("#ouName").html("中储发展股份有限公司云南分公司-金马库");
                   sessionStorage.setItem("ouName","中储发展股份有限公司云南分公司");
                   sessionStorage.setItem("ouid","1000018340");
                   sessionStorage.setItem("ouId","1000018340");
                   Toast('切换成功',2000);
                   break;
			   case '57':
                   $("#ouName").html("中储发展股份有限公司云南分公司（万达库）");
                   sessionStorage.setItem("ouName","中储发展股份有限公司云南分公司（万达库）");
                   sessionStorage.setItem("ouid","1000019814");
                   sessionStorage.setItem("ouId","1000019814");
                   Toast('切换成功',2000);
                   break;
               case '61':
                   $("#ouName").html("中储发展股份有限公司天津分公司");
                   sessionStorage.setItem("ouName","中储发展股份有限公司天津分公司");
                   sessionStorage.setItem("ouid","1000015774");
                   sessionStorage.setItem("ouId","1000015774");
                   Toast('切换成功',2000);
                   break;
			   case '62':
                   $("#ouName").html("天津中储陆通物流有限公司");
                   sessionStorage.setItem("ouName","天津中储陆通物流有限公司");
                   sessionStorage.setItem("ouid","1000007463");
                   sessionStorage.setItem("ouId","1000007463");
                   Toast('切换成功',2000);
                   break;
               case '63':
                   $("#ouName").html("天津中储陆通物流有限公司邹平库");
                   sessionStorage.setItem("ouName","天津中储陆通物流有限公司邹平库");
                   sessionStorage.setItem("ouid","1000011666");
                   sessionStorage.setItem("ouId","1000011666");
                   Toast('切换成功',2000);
                   break;
			   case '71':
				   $("#ouName").html("河北中储物流有限公司");
                   sessionStorage.setItem("ouName","河北中储物流有限公司");
                   sessionStorage.setItem("ouid","1000019335");
                   sessionStorage.setItem("ouId","1000019335");
                   Toast('切换成功',2000);
                   break;
           }
        })
    });
})();