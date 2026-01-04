// ==UserScript==
// @name         好评助手插件
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  批量打开与批量备注按钮
// @author       Ted
// @match        http://pingfen.dadaowl.cn/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @require      https://greasyfork.org/scripts/26454-jquery-cookie/code/jQuery%20Cookie.js?version=169689
// @require      https://greasyfork.org/scripts/27104-filesaver/code/FileSaver.js?version=173518
// @downloadURL https://update.greasyfork.org/scripts/374105/%E5%A5%BD%E8%AF%84%E5%8A%A9%E6%89%8B%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/374105/%E5%A5%BD%E8%AF%84%E5%8A%A9%E6%89%8B%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

$('head').append('<script type="text/javascript" src="/js/languages/jquery.validationEngine-zh_CN.js"></script><script type="text/javascript" src="/js/jquery.validationEngine.js"></script>')
//获取cookie信息
function listCookies() {
    var theCookies = document.cookie.split(';');
    var cookie_dict = {};
    for (var i = 1 ; i <= theCookies.length; i++) {
		var key_name = theCookies[i-1].split('=')[0];
		var the_value = theCookies[i-1].split('=')[1];
        cookie_dict[key_name.replace(/ /g,'')] = encodeURIComponent(the_value).toString();
    }
    return cookie_dict;
};
var default_text = "美女小姐姐在吗，您在咱店购买的产品还满意吧，现在点亮星星可以跟溦信客服weifen131400领取奖励，而且会不定期给老顾客免费送衣衣哦！！";
waitForKeyElements ("ul.fl.doucx", send_msg, false, '#hideframe');
function send_msg(jNode){
	jNode.append('<span id= "_btn_send" class="sui-btn btn-primary"  href="javascript:void(0)">单页发送</span> <li>发送短语：<input id="_send_text" type="text" name="send_text" value="'+default_text+'"></li>');
	var iframe = document.getElementById('hideframe');
	var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
	$('#_btn_send',innerDoc).click(function (){
		var send_msg_text = $('#_send_text',innerDoc).val();
		var confirm_text = confirm('警告！是否确认发送消息\n【'+ send_msg_text +'】\n给本页顾客？');
        if(confirm_text){

			var reg =  /\'(.*)\'\,/;
			var customers =[];
			var str_cookie = listCookies();
			if (!('JSESSIONID' in str_cookie)){
				alert('请锁定Cookie后刷新重试！')
				return
			};
			//获取子账号名
			var name_account = $('ul.sui-nav.pull-right.nav-links li').eq(0).find('span').eq(0).text();
			//获取base_info
			$('tr.memberTr.odd',innerDoc).each(function(i,dom_obj){
				flag_color = $(this).find('td').eq(-3).find('div').eq(0).find('img').attr('src');
				memo_text = $(this).find('td').eq(-3).find('div').eq(0).text();
				if ( flag_color == "../images/op_memo_0.png" && memo_text== " "){
				var one_customer = {};
				one_customer['wangwang'] = $(this).attr('buyernick');
				var tid_oid_str = $(this).find('td').eq(-2).find('textarea').attr('onblur');
				var matches = tid_oid_str.match(reg);
				var tid_oid_list = matches[1].split(/', '/);
				one_customer['oid'] = tid_oid_list[0];
				one_customer['tid'] = tid_oid_list[1];
				customers.push(one_customer);
				};
			});
			var base_dict = {};
			base_dict.send_msg_text = send_msg_text;
			base_dict.cookies = str_cookie;
			base_dict.name_account = name_account;
			base_dict.customers = customers;
			var base_str = JSON.stringify(base_dict).replace(/"/g, "'");
            var d = new Date();
            var hr = d.getHours();
            var min = d.getMinutes();
            var seconds =d.getSeconds();
            if (min < 10) {
                min = "0" + min;
            }
            var date = d.getDate();
            var month = d.getMonth()+1;
            var year = d.getFullYear();
            var date_time = year + '-' + month +'-'+ date + '_'+ hr + min + seconds;
            var file_name = "base_dict"+ "_"+ date_time + ".txt";
            var blob = new Blob([base_str], {type: "text/plain;charset=utf-8"});
			saveAs(blob , file_name);
            setTimeout(function(){
                window.location.href = 'pysend:' + file_name;
            },5000);
		};
	});
};