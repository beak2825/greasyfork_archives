// ==UserScript==
// @name       xinyurc
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  获取人员信息
// @author       You
// @require     https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js
// @match       https://www.xinyurc.com/resume/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449034/xinyurc.user.js
// @updateURL https://update.greasyfork.org/scripts/449034/xinyurc.meta.js
// ==/UserScript==

(function() {


	var url = 'https://h.kingdom.net.cn/';
	$("head").append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css">');

	var resume_id = window.location.pathname.replace("/resume/","").replace(".html","");;

	var btn = '<div style="padding:8px 12px;background:#177ae0;color:#fff;display:inline-block;font-size:14px;margin-left:20px;cursor: pointer;" id="record">获取</div>';
	var detail = '';
	if (resume_id) {
		$.post(url+'/api/home/index/search',{resume_id:resume_id},function(res){
			if (res.code == 1) {
				detail = '<a href="https://h.kingdom.net.cn/admin/member/detail/id/'+res.data.id+'" target="_blank" style="padding:8px 12px;background:#177ae0;color:#fff;display:inline-block;font-size:14px;margin-left:20px;cursor: pointer;" id="detail">详情</a>';
				btn = '<div style="padding:8px 12px;background:#177ae0;color:#fff;display:inline-block;font-size:14px;margin-left:20px;cursor: pointer;" id="record">已获取</div>';
			}
		})
	}

	setTimeout(function(){
		if (detail) {
			$('.information_name').after(detail);
		}
		$('.information_name').after(btn);

		var avatar = $('.information_img img').attr('src');
		var name = $('.information_name').text();
		var txt = [];
		$.each($('.more_hover .item_text1'),function(k,v){
			txt.push($(v).text())
		})
		var time = $('.margin_right').text().replace('更新：',"");
		var sex = $('.information_job span').eq(0).text();
		var age = $('.information_job span').eq(1).text();
		var grade = $('.information_job span').eq(2).text();
		var exp = $('.information_job span').eq(3).text();
		var apply_job = $('.intention_item .intention_item_text1').eq(0).text().split(' ')[1];
		var apply_industry = ''
		var apply_salary = $('.intention_item .intention_item_text2').eq(0).text().split('，')[0].replace(/\s/g,"");
		var apply_status = $('.title_item2 span').text();
		var tag = [];
		var mobile = '';
		var email = '';
		var weixin = '';
		var qq = '';
		var intention = '';
		var evaluate = '';
		var edu = [];
		var job = [];
		var train = [];
		var project = [];
		var certificate = [];
		var language = [];
		var pic = [];
		$.each($('.tag_list li'),function(k,v){
			tag.push($(v).text())
		})
		evaluate = $('.synopsis').text().replace(/\s/g,"");
		if ($('.contact_list_box').length > 0) {
			mobile = $('.contact_list_box .contact_item').eq(0).text().replace("手机：","").replace(/\s/g,"");
			weixin = $('.contact_list_box .contact_item').eq(1).text().replace("微信：","").replace(/\s/g,"");
			email = $('.contact_list_box .contact_item').eq(2).text().replace("邮箱：","").replace(/\s/g,"");
			qq = $('.contact_list_box .contact_item').eq(3).text().replace("QQ：","").replace(/\s/g,"");
		}
		if ($('.educate_wrapper .school').length > 0) {
			var edus = $('.educate_wrapper .school');
			$.each(edus,function(k,v){
				var date = $(v).find('.school_text span').text().replace(/\s/g,"");
				var data1 = $(v).find('.school_text').text().replace(/\s/g,"").replace(date,"");
				var data2 = $(v).find('.school_text2').text().replace(/\s/g,"").split('，');
				var param = {
					time:date,
					info:data2[0]+'|'+data1+'|'+data2[1],
				}
				edu.push(param);
			})
		}
		if ($('.work_wrapper').eq(0).length > 0) {
			var jobs = $('.work_wrapper').eq(0).find('.item');
			$.each(jobs,function(k,v){
				var date = $(v).find('.school_text span').text().replace(/\s/g,"");
				var data1 = $(v).find('.school_text').text().replace(/\s/g,"").replace(date,"");
				var data2 = $(v).find('.post_text').text().replace(/\s/g,"");
				var data3 = $(v).find('.demand_con').text();
				var param = {
					time:date,
					info:data2+'|'+data1+'工作职责：'+data3,
				}
				job.push(param);
			})
		}
		if ($('.work_wrapper').eq(1).length > 0) {
			var projects = $('.work_wrapper').eq(1).find('.item');
			$.each(projects,function(k,v){
				var date = $(v).find('.school_text span').text().replace(/\s/g,"");
				var data1 = $(v).find('.school_text').text().replace(/\s/g,"").replace(date,"");
				var data2 = $(v).find('.post_text').text().replace(/\s/g,"");
				var data3 = $(v).find('.demand_con').text();
				var param = {
					time:date,
					info:data2+'|'+data1+'项目描述：'+data3,
				}
				project.push(param);
			})
		}
		if ($('.certificate_wrapper .certificate_list li').length > 0) {
			var cers = $('.certificate_wrapper .certificate_list li');
			$.each(cers,function(k,v){
				var param = $(v).text().replace(/\s/g,"");
				certificate.push(param);
			})
		}
		// if ($('.items .language').length > 0) {
		// 	var languages = $('.items .language .lang');
		// 	$.each(languages,function(k,v){
		// 		var param = $(v).text().replace(/\s/g,"");
		// 		language.push(param);
		// 	})
		// }
		// if ($('.items .pic').length > 0) {
		// 	var pics = $('.items .pic .pli');
		// 	$.each(pics,function(k,v){
		// 		var param = {
		// 			title:$(v).attr('title'),
		// 			src:$(v).find('a').data('src')
		// 		}
		// 		pic.push(param);
		// 	})
		// }

		var param = {
			resume_id:resume_id,
			name:name,
			sex:sex,
			age:age,
			grade:grade,
			exp:exp,
			apply_job:apply_job,
			apply_industry:apply_industry,
			apply_salary:apply_salary,
			apply_status:apply_status,
			time:time,
			avatar:avatar,
			txt:txt,
			tag:tag,
			intention:intention,
			mobile:mobile,
			email:email,
			weixin:weixin,
			qq:qq,
			evaluate:evaluate,
			edu:edu,
			job:job,
			project:project,
			certificate:certificate,
			language:language,
			pic:pic,
		}

		$('body').on('click', '#record', function(){
			$.post(url+'/api/home/index/record',param,function(res){
				layer.msg('获取成功');
				$('#record').text('已获取');
				if ($('#detail').length == 0) {
					detail = '<a href="https://h.kingdom.net.cn/admin/member/detail/id/'+res.data.id+'" target="_blank" style="padding:8px 12px;background:#177ae0;color:#fff;display:inline-block;font-size:14px;margin-left:20px;cursor: pointer;" id="detail">详情</a>';
					$('.information_name').after(detail);
				}
			})
		})
	},1000)

})();




