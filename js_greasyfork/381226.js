// ==UserScript==
// @name         自动填写报价内容
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  诗情装饰，滚!
// @author       TeemorJoy
// @match        http://www.cqshiqing.com/
// @match        http://www.cqshiqing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381226/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8A%A5%E4%BB%B7%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/381226/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8A%A5%E4%BB%B7%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var names = ["苍波松", "小薇", "倩倩", "刚哥", "江平", "江蓉", "少伟", "思图", "罗一伟", "康王", "爷爷",
			"孙子", "井空", "结衣","成功" ];
	var address = ["解放碑", "江北", "渝北", "南岸", "渝中区", "北碚", "合川", "大学城", "南坪", "巴南区",
			"九龙坡区", "鱼嘴镇", "永川", "涪陵", "垫江", "你心里" ];
	var tel = ["13131055255", "15802369091", "17316782240", "13243572614", "13110101314",
			"18996226800", "13983930586", "18083011110", "13399858994","18623592555",
			"15845201314", "13310226766", "18965321401", "13584214501",
			"18812457801","15252052101" ];
	var house = [ "二居室", "三居室", "四居室", "五居室", "别墅", "平层", "复式" ];
	var area = [ "70-100", "100-120", "120-140", "140-160", "160-180",
			"180-200", "200以上" ];

	sub();
    subS();
	listenEnter();

	function listenEnter() {
		var yzm = $("input[name=yzm]");
		yzm.keyup(function(event) {
			if (event.keyCode == 13) {
				if (yzm.val().length < 4) {
					yzm.siblings("img").click();
				}
			}
		});
	}
	function sub() {

		$(".quick_top a").click();
		$("input[name=yzm]").focus();
		$("input[name=name]").val(rand(names));
		$("input[name=phone]").val(rand(tel));
		$("input[name=address]").val(rand(address));
		$("select[name=house]").val(rand(house));
		$("select[name=acreage]").val(rand(area));
		$(".regbutton").click();
	}
	
	function subS() {

		$(".quick_top a").click();
		$("input[name=yzmS]").focus();
		$("input[name=nameS]").val(rand(names));
		$("input[name=phoneS]").val(rand(tel));
		$("input[name=addressS]").val(rand(address));
		$("select[name=houseS]").val(rand(house));
		$("select[name=acreageS]").val(rand(area));
		$(".p_offer_button").click();
	}
	
	function rand(ary) {
		var n = Math.floor((Math.random() * ary.length));
		return ary[n];
	}
})();