// ==UserScript==
// @name       tieba_old_posts_remind
// @version    0.71beta
// @description  贴吧坟贴提醒（脚本版）修改自：http://tieba.baidu.com/p/1748230170 原扩展作者864907600cc，修改者h573980998 自定义by绯色起源
// @include     http://tieba.baidu.com/p/*
// @copyright  2012+, You
// @grant    GM_addStyle
// @run-at document-end
// @namespace https://greasyfork.org/users/54
// @downloadURL https://update.greasyfork.org/scripts/19775/tieba_old_posts_remind.user.js
// @updateURL https://update.greasyfork.org/scripts/19775/tieba_old_posts_remind.meta.js
// ==/UserScript==
/*
原扩展作者864907600cc甩锅强行让我背锅，这锅我不背不背BY绯色起源
fix_reason:http://tieba.baidu.com/p/4546401325
fix_example:http://tieba.baidu.com/p/2645045901

// @include     http://tieba.baidu.com/f* 移除	
// @include     http://tieba.baidu.com/i* 移除
// @homepage    https://greasyfork.org/scripts/367/ 移除
license by http://bangumi.ga/
安全检验合格，准予出厂！2016-05-18
 */
//小白型功能选择
ReplySafe = 1; //小黑屋远离我模式：坟贴的所有回复框和按钮，神来一句不显示，1为开启，0为关闭

//==========================function start
var bac = false;
var check;
var get_title_name = document.title.split('_');
addcss();
window.onload = ft_cr;
/////////////插入设置界面
function ft_cr() {
	var cx = document.createElement('li');
	cx.id = 'this_ft';

	var this_ft_txt;
	document.getElementsByClassName('u_ddl_con_top')[1].getElementsByTagName('ul')[0].appendChild(cx);
	if (get_title_name.length > 1) {
		var tc = pd_this_ft_t();
		this_ft_txt = '该吧坟帖判定为<input id="ft_time" name="ft_time" type="text" style="border:1px solid gray;font-size:10px;" size="3"title="当值改变时保存\n为空时清除对此吧的设置" value="' + tc + '">天';
	} else {
		this_ft_txt = '默认坟帖判定为<input id="ft_time" name="ft_time" type="text" style="border:1px solid gray;font-size:10px;" size="3"title="当值改变时保存\n且不能为空"value="' + ((localStorage.getItem('this_ft_ba_time') != null) ? localStorage.getItem('this_ft_ba_time') : 30) + '">天';
	}
	cx.innerHTML = '<div style="padding: 2px 0px 4px 4px;">' + this_ft_txt + '</div>';
	//change
	document.getElementById('ft_time').addEventListener("change", function () {
		ft_set(this.value)
	});
}
function ft_set(ft_va) {
	if (/^[0-9]*$/.test(ft_va)) {
		if (get_title_name.length > 1) {
			var find_n = true;
			var bxxx = get_title_name.slice(-2)[0].split('吧')[0];
			if (localStorage.getItem('this_ft_ba')) {
				var bas = localStorage.getItem('this_ft_ba').split(';');
				for (var i = 0; i <= bas.length - 1; i++) {
					var baa = bas[i].split(',');
					if (baa[0] == bxxx) {
						if (ft_va == "")
							bas[i] = "";
						else
							bas[i] = bxxx + "," + ft_va;
						localStorage.setItem('this_ft_ba', bas.join(";").replace(/\;;/g, ';'));
						find_n = false;
						break;
					}
				}
			}
			if (find_n) {
				if (localStorage.getItem('this_ft_ba'))
					localStorage.setItem('this_ft_ba', (localStorage.getItem('this_ft_ba') + ";" + bxxx + "," + ft_va).replace(/\;;/g, ';'));
				else
					localStorage.setItem('this_ft_ba', bxxx + "," + ft_va);
			}
			run("保存设置成功", 5000);
		} else {
			if (ft_va) {
				localStorage.setItem('this_ft_ba_time', ft_va);
				run("保存设置成功", 5000);
			} else
				run("默认坟帖判定天数不能为空", 5000);
		}
	} else
		run("字符不合法! 坟贴标准必须是数字", 5000);
}
////////////判断是否有设置
//var bac=false;
function pd_this_ft_t() {
	bac = false;
	var bat = (localStorage.getItem('this_ft_ba_time') != null) ? localStorage.getItem('this_ft_ba_time') : 30;
	var ba = get_title_name.slice(-2)[0].split('吧')[0];
	if (localStorage.getItem('this_ft_ba')) {
		var bas = localStorage.getItem('this_ft_ba').split(';');
		for (var i = 0; i <= bas.length - 1; i++) {
			var baa = bas[i].split(',');
			if (baa[0] == ba) {
				bat = baa[1];
				bac = true;
				break;
			}
		}
	}
	return bat;
}

if (document.getElementsByClassName('l_post')[0]) {
	var curtime = new Date();
	//var tietime=Date.parse(JSON.parse(document.getElementsByClassName('l_post')[0].getAttribute('data-field')).content.date.replace(/-/g,"/"));
	if (JSON.parse(document.getElementsByClassName('l_post')[0].getAttribute('data-field')).content.date != undefined) {
		var tietime = (JSON.parse(document.getElementsByClassName('l_post')[0].getAttribute('data-field')).content.date).substr(0, 10); //.replace(/-/g, "/")
	} else {
		if (document.getElementsByClassName('tail-info')[2] != undefined&&document.getElementsByClassName('tail-info')[2].innerHTML.match(/20\d{2}\-[0,1][0-9]\-[0-3][0-9]/)) {
			var tietime = (document.getElementsByClassName('tail-info')[2].innerHTML).substr(0, 10); //replace(/-/g, "/")
		} else if(document.getElementsByClassName('tail-info')[3] != undefined&&document.getElementsByClassName('tail-info')[3].innerHTML.match(/20\d{2}\-[0,1][0-9]\-[0-3][0-9]/)){
			var tietime = (document.getElementsByClassName('tail-info')[3].innerHTML).substr(0, 10); //replace(/-/g, "/")
		}else{
			run('ERR1错误！无法判定该贴发帖时间！请谨慎回复。该提示框10秒后关闭', 10000);
		}
	}

	console.log(tietime);
	var tietime = new Date(tietime);
	console.log(tietime);
	if (tietime == 'Invalid Date') {
		run('ERR2错误！无法判定该贴发帖时间！请谨慎回复。该提示框10秒后关闭', 10000);
	} else {
		var x = parseInt((curtime - tietime) / 86400000);
		//加入 拆分天数为年月日
		if ((curtime.getMonth() > tietime.getMonth()) ||
			(curtime.getMonth() == tietime.getMonth() && curtime.getDate() >= tietime.getDate())) {
			year = curtime.getFullYear() - tietime.getFullYear();
		} else {
			year = curtime.getFullYear() - tietime.getFullYear() - 1;
		}
		if (curtime.getDate() >= tietime.getDate()) {
			month = (curtime.getMonth() - tietime.getMonth() + 12) % 12;
		} else {
			month = (curtime.getMonth() - tietime.getMonth() + 12 - 1) % 12;
		}
		day = (curtime.getDate() - tietime.getDate() + 31) % 31;

		var showtext = '';
		showtext += year ? year + '年' : '';
		showtext += month ? month + '个月' : '';
		showtext += day ?  + day + '天' : '';

		if (x > pd_this_ft_t()) {
			run('此贴已存在' + showtext + '(' + x + '天)，已为坟贴，脚本已经关闭回复！ㄟ(￣▽￣ㄟ)', 99999000);
			check = 1; //是坟贴
		}
	}
}else{
run('ERR3错误！无法判定该贴发帖时间！请谨慎回复。该提示框10秒后关闭', 10000);
}


function run(xmx, time) {
 	if (document.getElementById('old-thread') !== null) {
		document.getElementById('old-thread').remove();
	}
	var _ = document.createElement('div');
	_.id = 'old-thread';
	document.body.appendChild(_);
	//var text='此贴已存在'+x+'天，已为坟贴，请勿回复。ㄟ(￣▽￣ㄟ)'
	_.innerHTML = '<p>' + xmx + '</p>';
	setTimeout(function () {
		document.body.removeChild(_);
	}, time);
}

//坟贴的所有回复框和按钮不显示
function replySafe() {
	if (check == 1) { //如果是坟贴
		//alert(check);
		GM_addStyle('.j_lzl_r.p_reply,.j_lzl_p,.lzl_s_r,.poster_body.editor_wrapper,.p_reply_first{display:none!important;}'); //所有回复框和按钮不显示，这里偷下懒，不想遍历元素了
		GM_addStyle('.jiangyou,.tbui_fbar_tsukkomi,.quoteButton,.SimQuote{display:none;}'); //将大花猫的队形按钮也屏蔽,神来一句也闪吧

	}
}

//------------------------执行所需功能----------------------
if (ReplySafe == 1) {
	replySafe(); //坟贴的所有回复框和按钮不显示
}

function addcss() {
	var a = document.createElement('style');
	a.type = 'text/css';
	a.textContent = '@-webkit-keyframes  hide{from{z-index:999;opacity:1}20%{z-index:9999;opacity:1}80%{z-index:9999;opacity:1}to{z-index:99999;opacity:1}}#old-thread{width: 100%;text-align: center;color: white;font-size: 32px;top: 50%;margin-top: -59px;vertical-align: middle;position: fixed;z-index: -9999;opacity:1;-webkit-animation-name:hide;-webkit-animation-duration:9999s;animation-name: hide;animation-duration:9999s;pointer-events:none;-webkit-user-select:none;user-select:none}#old-thread p{background: rgba(255, 119, 119, .5);padding-top: 50px;padding-bottom: 50px;text-shadow: red 0 0 5px,red 0 0 5px,red 0 0 7px,red 0 0 7px,red 0 0 10px,red 0 0 10px,red 0 0 15px,red 0 0 15px;}@keyframes  hide {from{z-index:999;opacity:1}20%{z-index:9999;opacity:1}80%{z-index:9999;opacity:1}to{z-index:99999;opacity:1}}';
	document.documentElement.appendChild(a);
}
