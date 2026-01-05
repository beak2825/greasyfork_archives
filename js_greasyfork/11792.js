// ==UserScript==
// @name         Adventure of Chaos helper
// @namespace    http://www.x4code.com
// @version      1.6
// @author       Manro
// @match        http://cdn1.x4code.com/game/*
// @match        http://cdn2.x4code.com/game/*
// @match        http://cdn3.x4code.com/game/*
// @match        http://cdn4.x4code.com/game/*
// @match        http://cdn5.x4code.com/game/*
// @match        http://cdn6.x4code.com/game/*
// @match        http://www.x4code.com/game/*
// @match        http://112.74.129.222/game/*
// @grant		 none
// @description  helper for AOC
// @downloadURL https://update.greasyfork.org/scripts/11792/Adventure%20of%20Chaos%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/11792/Adventure%20of%20Chaos%20helper.meta.js
// ==/UserScript==



//impl script
!function(a){"use strict";var b=function(a,c){var d=/[^\w\-\.:]/.test(a)?new Function(b.arg+",tmpl","var _e=tmpl.encode"+b.helper+",_s='"+a.replace(b.regexp,b.func)+"';return _s;"):b.cache[a]=b.cache[a]||b(b.load(a));return c?d(c,b):function(a){return d(a,b)}};b.cache={},b.load=function(a){return document.getElementById(a).innerHTML},b.regexp=/([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g,b.func=function(a,b,c,d,e,f){return b?{"\n":"\\n","\r":"\\r","	":"\\t"," ":" "}[b]||"\\"+b:c?"="===c?"'+_e("+d+")+'":"'+("+d+"==null?'':"+d+")+'":e?"';":f?"_s+='":void 0},b.encReg=/[<>&"'\x00]/g,b.encMap={"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"},b.encode=function(a){return(null==a?"":""+a).replace(b.encReg,function(a){return b.encMap[a]||""})},b.arg="o",b.helper=",print=function(s,e){_s+=e?(s==null?'':s):_e(s);},include=function(s,d){_s+=tmpl(s,d);}","function"==typeof define&&define.amd?define(function(){return b}):a.tmpl=b}(this);


(function($) {
	$.fn.tips = function(options) {
		var opts = $.extend({}, $.fn.showinfo.defaults, options);
		if ($("#ToolsTip").size() == 0) $('<div id="ToolsTip"></div>').hide().appendTo('body');
		var $ToolsTip = $("#ToolsTip");
		this.bind('mouseover mousemove mouseout', function(event) {
			var TarData = $(this).attr('title') || $(this).data('title');
			$(this).removeAttr('title');
			$(this).data('title',TarData);
			switch (event.type){
				case 'mousemove':
					var top  = event.pageY + 12,
						left = event.pageX + 12;
					if ($ToolsTip.innerHeight() + top + 12 > $(document).height()) top = $(document).height() - $ToolsTip.innerHeight() - 20;
					$ToolsTip.css({top: top,  left: left}).show();
				case 'mouseover':
					$ToolsTip.html(TarData);
				break;
				case 'mouseout':
					$ToolsTip.removeClass().removeData().empty().hide();
				break;
				}
		});
	}

	$.fn.showinfo = function(options) {
		var opts = $.extend({}, $.fn.showinfo.defaults, options);
		if ($("#InfoTip").size() == 0) {
			$('<div id="InfoTip"></div>').hide().appendTo('body');
		}
		if ($('[infotip]').size() == 0) {
			$('<div id="InfoTip" infotip></div>').hide().appendTo('body');
		}
		var $InfoTip = $("#InfoTip");
		var $InfoTip2 = $('[infotip]').css({
			'position': 'absolute',
			'z-index': '10000',
			'border-radius': '4px',
			'border-width': '3px',
			'border-style': 'ridge',
			'min-width': '160px',
			'max-width': '200px',
			'padding': '5px 10px'
		});


		this.bind('mouseover mouseout mousemove', function(event) {
    		var equips = $('#equips button').map(function(index, elem) {
			    return $(elem).data('info');
		    });
			var TarData = $(this).data('info');


			var showCompare = this.tagName != 'BUTTON';
			var compareData = null;
			var tarType = TarData.type.substr(0,1);
			for (var i = 0; i < equips.length; i++) {
				var equip = equips[i];
				if (equip.type.substr(0,1) == tarType) {
					compareData =equip;
					break;
				}
			}
			

			var showid = '_';
			if (TarData.eid) showid += TarData.eid+"_";
			if (TarData.tid) showid += TarData.tid;
			switch (event.type){
				case 'mousemove':
					var top  = event.pageY + 12,
						left = event.pageX + 12;
					if ($InfoTip.innerHeight() + top + 12 > $(document).height()) top = $(document).height() - $InfoTip.innerHeight() - 12;
					if ($InfoTip.innerWidth() + left + 12 > $(document).width()) left = event.pageX - $InfoTip.innerWidth() - 12;
					$InfoTip.css({top: top,  left: left}).show();
					if (showCompare && compareData) {
						$InfoTip2.css({top: top,  left: left+$InfoTip.innerWidth()+ 5}).show();
					}
					if ($InfoTip.data('show') == showid) { return false; }
					$InfoTip.data('show',showid);
				case 'mouseover':
					// console.log(TarData.pz);
					$InfoTip.addClass('pz'+TarData.epz);
					var TipData = $.fn.showinfo.ext(TarData,showCompare&&compareData?compareData:null);
					$InfoTip.html(TipData);

					if (showCompare) {
						$InfoTip2.addClass('pz'+compareData.epz);
						var TipData2 = $.fn.showinfo.ext(compareData);
						$InfoTip2.html(TipData2);  
					}
				break;
				case 'mouseout':
					$InfoTip.removeClass().removeData().empty().hide();
					$InfoTip2.removeClass().removeData().empty().hide();
				break;
			}
		});
	}
	$.fn.showinfo.ext = function(v,compare) {
		var rtHtml =  v.lv > 0 ? "<span class='lv'>Lv："+v.lv+"</span>":"";
		rtHtml += "<h3>"+v.name;
		if (v.qlv > 0) { rtHtml += " +"+v.qlv; };
		rtHtml += "</h3>";
		var info = v.info ? $.parseJSON(v.info) : {};
		var addinfo = v.addinfo ? $.parseJSON(v.addinfo) : {};
		var compreAddinfo = null;
		if (compare) {
		   compreAddinfo = compare.addinfo ? $.parseJSON(compare.addinfo) : null;  
		 } 
		var colorkey = [];
		if (Object.keys(addinfo).length){
			for(var key in addinfo){
				if(info.hasOwnProperty(key)) {
					info[key] = info[key] + addinfo[key];
					colorkey[key] = 1;
				}
			}
		}
		rtHtml += "<p>";
		if (v.rank != 0 && v.rank) rtHtml += "["+$.fn.showinfo.rankstr(v.rank)+"] ";
		rtHtml += '['+$.fn.showinfo.typestr(v.type)+'] ';
		if (v.job != 0) rtHtml += "["+$.fn.showinfo.jobstr(v.job)+"]";
		rtHtml += "</p>";
		if (info.att_min+info.att_max > 0) {
			rtHtml += "攻击力：<b>";
			rtHtml += colorkey.att_min ? "<i>"+info.att_min+"</i> - " : info.att_min + " - ";
			rtHtml += colorkey.att_max ? "<i>"+info.att_max+"</i></b>" : info.att_max+"</b>";
		};
		if (info.att_min) { delete info.att_min; }
		if (info.att_max) { delete info.att_max; }
		// console.log(info.length);
		if (Object.keys(info).length){
			rtHtml += "<ul class='info'>";
			for(var key in info){
				// console.log(key+' : '+info[key]);
				var tags = $.fn.showinfo.extinfo(key);
				rtHtml += "<li>"+tags[0]+"：<b>";
				rtHtml += colorkey[key] ? "<i>"+info[key]+tags[1]+"</i></b></li>" : info[key]+tags[1]+"</b></li>";
			}
			rtHtml += "</ul>"
		}
		if (Object.keys(addinfo).length){
			rtHtml += "<ul class='addinfo'>[附加属性]";
			for(var key in addinfo){
				// console.log(key+' : '+info[key]);
				var tags = $.fn.showinfo.extinfo(key);
				var compareString = '';
				if (compreAddinfo && compreAddinfo.hasOwnProperty(key)) {
				    compareString = parseInt(addinfo[key]) - parseInt(compreAddinfo[key]);
				}
				rtHtml += "<li>"+tags[0]+"："+addinfo[key]+tags[1]+"<span class='pull-right'>"+compareString+"</span></li>";
			}
			rtHtml += "</ul>"
		}
		rtHtml += v.num ? "<p>数量："+v.num+"</p>" : "";
		rtHtml += v.about ? "<p><q>"+v.about+"</q></p>" : "";
		// if (v.eid) { rtHtml += "<p>"+v.eid+"</p>" };
		return rtHtml;
	}
	$.fn.showinfo.extinfo = function(key){
		var data = {
			'hp'         : 	['生命值',''],
			'pow'        : 	['强度',''],
			'dex'        : 	['敏捷',''],
			'con'        : 	['体质',''],
			'att_min'    : 	['最小攻击',''],
			'att_max'    : 	['最大攻击',''],
			'def'        : 	['防御',''],
			'eva'        : 	['闪避机率',' %'],
			'arm'        : 	['护甲',''],
			'dmgeff'     : 	['伤害减免',' %'],
			'hit'        : 	['命中机率',' %'],
			'cri'        : 	['暴击机率',' %'],
			'cridmg'     : 	['暴击伤害',' %'],
			'rec'        : 	['恢复',' %'],
			'add_hp'     : 	['生命值',' %'],
			'add_att'    : 	['攻击力',' %'],
			'add_def'    : 	['防御增强',' %'],
			'add_eva'    : 	['闪避机率',' %'],
			'add_arm'    : 	['护甲增强',' %'],
			'add_dmgeff' : 	['伤害减免',' %'],
			'add_hit'    : 	['命中机率',' %'],
			'add_cri'    : 	['暴击机率',' %'],
			'add_cridmg' : 	['暴击伤害',' %'],
			'add_rec'   : 	['恢复',' %'],
		};
		return data[key];
	}
	$.fn.showinfo.typestr = function(type){
		var data = {
			"_1"  : "普通武器",
			"_2"  : "普通防具",
			"_3"  : "戒指",
			"_4"  : "护符",
			"_5"  : "材料",
			"_11" : "剑",
			"_12" : "匕首",
			"_13" : "锤",
			"_14" : "弓",
			"_15" : "弩",
			"_16" : "斧",
			"_17" : "法杖",
			"_18" : "魔杖",
			"_19" : "权杖",
			"_21" : "轻甲",
			"_22" : "中甲",
			"_23" : "重甲",
			"_50" : "材料"
		};
		return data['_'+type];
	}
	$.fn.showinfo.rankstr = function(type){ // 难度装备
		var data = {
			"_0" : "",
			"_1" : "困难",
			"_2" : "专家",
			"_3" : "大师",
			"_4" : "苦痛I",
			"_5" : "苦痛II",
			"_6" : "苦痛III",
			"_7" : "苦痛IV",
			"_8" : "苦痛V",
			"_9" : "苦痛VI"
		};
		return data['_'+type];
	}
	$.fn.showinfo.jobstr = function(jid){
		var data = {
		'_0'   : '冒险者',
		'_1'   : '护卫',	'_2'   : '信徒',	'_3'   : '学徒',
		'_11'  : '骑士',	'_12'  : '斗士',	'_21'  : '牧师',	'_22' : '魔法师',	'_31' : '斥候',	'_32' : '猎人',
		'_111' : '领主',	'_112' : '至尊骑士','_121' : '战狂',	'_122' : '圣武士',
		'_211' : '主教',	'_212' : '贤者',	'_221' : '巫师',	'_222' : '先知',
		'_311' : '刺客',	'_312' : '侠盗',	'_321' : '游侠',	'_322' : '神射手'
		};
		return data['_'+jid];
	}
	// 插件的defaults
	$.fn.showinfo.defaults = {
	};

// 闭包结束
})(jQuery);


window.showmain = function(type){
	$('.col-main > div').hide();
	if (type == 'fight') {
		showleft('rolestats');
		$('.window-fight').show();
		var fixheight = $('#enemys').innerHeight() > $('#friends').innerHeight() ?
			$('#enemys').innerHeight() : $('#friends').innerHeight();
		$('.battlelog').height(476 - fixheight);
	}else{
		$('.window-other').empty().append('<span class="boxloading"><img src="src/image/load2.gif" /> <br />载入中...</span>').show();
		$.get('box/'+type, function(result) {
			$('.window-other').empty().html(result);
			$('*[title]').tips();
			if (type == 'item') {
			    attachItemEnhance('#bag');
			}
		});

	}
};
var junkTypes = [1,2,14,16,18];
window.showtype = function(fatherbox,type) {
	$(fatherbox+' .showtype button').removeClass('active');
	$(fatherbox+' .showtype button').eq(type).addClass('active');
	if ($(fatherbox+' .items label').size() == 0) { return false; };
	$(fatherbox+' .items label').hide();
	if (type == 0) {
		$(fatherbox+' .items label').show();
	}else if(type == 5){
		$(fatherbox+' .items label').each(function() {
			if( parseInt($(this).data('type').toString().substr(0,1)) >= 5 ) $(this).show();
		});
	}else if(type == 6){
		var jopitem = check_job_equip();
		// console.log(jopitem);
		if (!jopitem) return false;
		$(fatherbox+' .items label').each(function() {
			// console.log(jopitem.indexOf($(this).data('type')));
			if( jopitem.indexOf($(this).data('type')) >= 0 ) $(this).show();
		});
	}else if(type == 7){
		$(fatherbox+' .items label').each(function() {
			var type = $(this).data('type');
			if (type !='50') {
			    if ($(this).data('pz') < 4) {
			        $(this).show();
			    }else if(junkTypes.indexOf(type) != -1){
			    	$(this).show();
			    }
			    
			    
			}

		});
	}else{
		$(fatherbox+' .items label').each(function() {
			if( $(this).data('type').toString().substr(0,1) == type ) $(this).show();
		});
	}
};

// 排列
window.relist = function relist(fatherbox,type){
	$(fatherbox+' .relist button').removeClass('active');
	$(fatherbox+' .relist button').eq(type).addClass('active');
	if ($(fatherbox+' .items label').size() == 0) { return false; };
	var lists = [];
	$(fatherbox+' .items label').each(function(index, el) {
		var info = $(el).data('info');
		if (!info.rank) {
		    info.rank = '-1';
		}
		lists.push([$(el).data('lv'),$(el).data('pz'),info.rank,$(el)]);
	});
	lists.sort(function (a,b){return b[type] - a[type];});
	$(fatherbox+' .items').empty();
	for(var i in lists){
		$(fatherbox+' .items').append(lists[i][3]);
	}
	$('.box-checkbox, .equip').showinfo();
}

function attachItemEnhance (id) {
	$(id+' .showtype').append('<button onclick="showtype(\''+id+'\',7);" class="btn btn-primary btn-xs" title="显示蓝色及以下,普通装备,弓,魔杖,斧">垃圾</button>');
	$(id+' .relist').append('<button onclick="relist(\''+id+'\',2);" class="btn btn-default btn-xs">难度</button>');
}

//仓库功能;
window.usebank = function(type) {
	if ($('#bank').hasClass('hidden')) {
		$('#bank').removeClass('hidden');
		$('#bag').css('height','49%');
		$('#bag .items').css('height','160');
		$('#bank').empty().append('<span class="boxloading"><img src="src/image/load2.gif" /> <br />载入中...</span>').show();
		$.get(base_url+'box/bank', function(data) {
			$('#bank').html(data);
			attachItemEnhance('#bank');
			bankfun(type);
			$('*[title]').tips();
			$('.box-checkbox, .equip').showinfo();
		});
	}else{
		bankfun(type);
	}
};

/************************ fight ********************/
window.battlesetup = function() {
	showmain('fight');
	if (window.battenow) {
		window.battenow = false;
		$('input[name=btype]').removeAttr('disabled');
		$('#battlebtn').removeClass('btn-danger').addClass('btn-primary').addClass('disabled');
		var Num  = 15;
		$('#battlebtn').text('[ '+Num+' ]');
		var timer = setInterval(function() {
			Num --;
			$('#battlebtn').text('[ '+Num+' ]').addClass('disabled');
			if (Num <= 0) {
				clearInterval(timer);
				$('#battlebtn').text('开始战斗').removeClass('disabled');
			};
		}, 1000);
	}else{
		BattleInfo.init();
		window.battenow = true;
		battle();
		$('#battlebtn').removeClass('btn-primary').addClass('btn-danger').addClass('disabled');
		var Num  = 15;
		$('#battlebtn').text('[ '+Num+' ]');
		var timer = setInterval(function() {
			Num --;
			$('#battlebtn').text('[ '+Num+' ]').addClass('disabled');
			if (Num <= 0) {
				clearInterval(timer);
				$('#battlebtn').text('停止战斗').removeClass('disabled');
				if (!window.battenow) $('#battlebtn').text('开始战斗').removeClass('btn-danger').addClass('btn-primary');
			}
		}, 1000);
	}
};
window.battle = function(){
	//保存自动出售设置
	if(window.localStorage){
		localStorage["s11"] = $('#autosell1').prop("checked") ? 1 : 0;
		localStorage["s22"] = $('#autosell2').prop("checked") ? 1 : 0;
		localStorage["s33"] = $('#autosell3').prop("checked") ? 1 : 0;
		localStorage["bty"] = $('#battletype input:checked').val();
	}
	if (!battenow) return false;
	var autosell1 = $('#autosell1').prop('checked') ? 1 : 0;
	var autosell2 = $('#autosell2').prop('checked') ? 1 : 0;
	var autosell3 = $('#autosell3').prop('checked') ? 1 : 0;
	var fighttype = $('#battletype input:checked').val();
	$.ajax({
		url      : base_url+'fight/battle',
		data     : {'t':fighttype,'s1':autosell1,'s2':autosell2,'s3':autosell3},
		type     : "POST",
		dataType : 'text',
		timeout  : 3000,
		success:function(data){
			if (data=='非法请求') {
				setTimeout(function(){ battle(); }, 2000);
			}else{
				checkBattle(data);
				BattleInfo.resolve(data);
			}
		},
		complete : function(XMLHttpRequest,status){
			var error = '';
			if (status=='timeout') {
				error = '连接服务器超时..';
			}else if (status == 'error') {
				error = '服务器暂时无响应..';
			}else if (status == 'success') {
				game_err = 0;
			}
			if (error) {
				game_err ++;
				// if (game_err > 50) window.location.reload();
				viewLog({text:'<span class="text-red">'+error+'</span>'},5000,function(){ battle(); });
			};
		}
	});
}

window.BattleInfo = {
	data:{},
	init:function() {
		this.data = {
			startTime: new Date(),
			winCount:0,
			battleCount:0,
			teamInfo:{}
		};
		var $container = $('<div id="battleInfoContainer"><div class="tableContainer"></div><span>战斗统计</span></div>').appendTo('body');

	},
	resolve:function(data) {
		var gamelog = $.parseJSON(data);
		if ($.isArray(gamelog.p)) {
			console.log('123213213'+gamelog.p);
		    for (var i = 0; i < gamelog.p.length; i++) {
		    	var role = gamelog.p[i];
		    	if (!this.data.teamInfo['p'+i]) {
		    	    this.data.teamInfo['p'+i] = this.getNewRole();
		    	}
		    	this.data.teamInfo['p'+i].lv= role.lv;
		    	this.data.teamInfo['p'+i].name= role.n;
		    }
		}

		if (gamelog.exp && $.isArray(gamelog.exp)) {
		    for (var j = 0; j < gamelog.exp.length; j++) {
		    	var expObj = gamelog.exp[j];
	    	    this.data.teamInfo[expObj[0]].exp += expObj[1];
		    }
		}
		if (gamelog.gold && $.isArray(gamelog.gold)) {
		    for (var k = 0; k < gamelog.gold.length; k++) {
		    	var goldObj = gamelog.gold[k];
	    	    this.data.teamInfo[goldObj[0]].gold += goldObj[1];
		    }
		}
		if (gamelog.log) {
			this.data.battleCount ++;
		    for (var l = 0; l < gamelog.log.length; l++) {
		    	var tempLog = gamelog.log[l];
		    	if (tempLog[0].indexOf('p') != -1) {
		    		var pid = tempLog[0];
		    	    var skillName = SDATA['_'+tempLog[1]].n;
		    	    this.data.teamInfo[pid].skillCount +=1;
		    	    if (this.data.teamInfo[pid].skills[skillName]) {
		    	        this.data.teamInfo[pid].skills[skillName] +=1;
		    	    }else{
		    	    	this.data.teamInfo[pid].skills[skillName] = 1;
		    	    }

		    	    if (tempLog[2] && $.isArray(tempLog)) {
		    	        for (var m = 0; m < tempLog[2].length; m++) {
		    	        	var hitLog = tempLog[2][m];
		    	        	if ($.isArray(hitLog) && hitLog[2].length >0) {
		    	        	    this.data.teamInfo[pid].hitCount++;
		    	        	    var hitInfos = hitLog[2].split('|');
		    	        	    if (hitInfos[0] == '1') {
		    	        	        this.data.teamInfo[pid].rightHitCount ++;
		    	        	    }
		    	        	    if (hitInfos[1] == '1') {
		    	        	        this.data.teamInfo[pid].criCount ++;
		    	        	    }
		    	        	}
		    	        }
		    	    }


		    	}
		    }
		}
		if (gamelog.flag == 'win') {
		    this.data.winCount++;
		}
		this.render();
	},
	render:function() {
		$("#battleInfoContainer .tableContainer").html(tmpl(this.template,[this.data]));
	},
	getNewRole: function() {
		return {
			name:'',
			lv:'',
			exp:0,
			gold:0,
			skills:{},
			skillCount: 0,
			hitCount:0,
			rightHitCount:0,
			criCount:0,
		};
	},
	toFix: function(value) {
	    return value.toFixed(2);
	},
	valuePerHour: function(value, startTime) {
	    var factor = 60 * 60 / (new Date() - startTime) * 1000;
	    return (value * factor).toFixed(2);
	},
	template:'{% for(var i=0; i<o.length;i++){ %}'+
			'<table border="1" style="border-collapse:collapse">'+
			'<tr>'+
			'<td>开始时间:</td>'+
			'<td>{%=o[i].startTime.toLocaleString()%}</td>'+
			'</tr>'+
			'<tr>'+
			'<td>持续时间:</td>'+
			'<td>{%=BattleInfo.toFix((new Date() - o[i].startTime)/1000) %} 秒</td>'+
			'</tr>'+
			'<tr>'+
			'<td>胜场|总场|胜率</td>'+
			'<td>{%=o[i].winCount%}|{%=o[i].battleCount%}|{%=BattleInfo.toFix(o[i].winCount/o[i].battleCount*100)%}%</td>'+
			'</tr>'+
			'{% for(var k in o[i].teamInfo) { var role = o[i].teamInfo[k];%}'+
			'<tr>'+
			'<td colspan="2">'+
			'<table border="0" width="100%" style="border-collapse:collapse;">'+
			'<tr>'+
			'<td>角色名:</td>'+
			'<td>{%=role.name%}</td>'+
			'</tr>'+
			'</tr>'+
			'<td>Lv:</td>'+
			'<td>{%=role.lv%}</td>'+
			'</tr>'+
			'<tr>'+
			'<td>获得经验:</td>'+
			'<td>{%=role.exp%}</td>'+
			'</tr>'+
			'</tr>'+
			'<td>经验/小时:</td>'+
			'<td>{%=BattleInfo.valuePerHour(role.exp,o[i].startTime)%}</td>'+
			'</tr>'+
			'<tr>'+
			'<td>获得gold:</td>'+
			'<td>{%=role.gold%}</td>'+
			'</tr>'+
			'</tr>'+
			'<td>gold/小时:</td>'+
			'<td>{%=BattleInfo.valuePerHour(role.gold,o[i].startTime)%}</td>'+
			'</tr>'+
			'<tr>'+
			'<td>命中率:</td>'+
			'<td>{%=BattleInfo.toFix(role.rightHitCount/role.hitCount*100)%}%</td>'+
			'</tr>'+
			'</tr>'+
			'<td>暴击率:</td>'+
			'<td>{%=BattleInfo.toFix(role.criCount/role.hitCount*100)%}%</td>'+
			'</tr>'+
			'<tr>'+
			'<td>技能:</td>'+
			'<td>'+
			'{% var skills = role.skills;%}'+
			'<table width="100%" style="border-collapse:collapse;">'+
			'{% for(var j in skills){ %}'+
			'<tr>'+
			'<td>'+
			'{%=j%}'+
			'</td>'+
			'<td>'+
			'{%=skills[j]%} ({%=BattleInfo.toFix(skills[j]/role.skillCount*100)%}%)'+
			'</td>'+
			'</tr>'+
			'{% } %}'+
			'</table>'+
			'</td>'+
			'</tr>'+
			'</table>'+
			'</td>'+
			'</tr>'+
			'{% }%}'+
			'</table>'+
			'{% } %}',

};

//styles
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}



addGlobalStyle("\
	#battleInfoContainer{\
		position:absolute;\
		top:0;\
		left:0;\
		z-index:100;\
		padding:10px;\
		background-color:#fff;\
		transform: translate(-100%,0);\
		transition: 300ms;\
	}\
	#battleInfoContainer:hover{\
		transform: translate(0,0);\
	}\
	#battleInfoContainer span{\
		color:#fff;\
		background-color:#049fd9;\
		position: absolute;\
		top: 0px;\
		padding:5px 0px;\
		width:20px;\
		right: -20px;\
		text-align:center;\
		display:inline-block;\
	}\
	.gamewindow{\
		width:1000px;\
	}\
");