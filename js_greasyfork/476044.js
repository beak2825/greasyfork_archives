// ==UserScript==
// @name        简历筛选
// @namespace   Violentmonkey Scripts
// @match       https://www.zhipin.com/*
// @match       https://www.zhipin.com/web/chat/recommend/web/frame/recommend/*
// @grant       none
// @version     1.0
// @author      zwj
// @license     MIT
// @description 2023/9/19 16:09:18
// @resource css https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/css/layui.min.css
// @require     https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/layui/2.8.17/layui.min.js
// @downloadURL https://update.greasyfork.org/scripts/476044/%E7%AE%80%E5%8E%86%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/476044/%E7%AE%80%E5%8E%86%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==
(function() {
	var name = "",
		schoolName = "";
	// console.log($('#main').find('.job-title').text(),2);
	//加载样式
	function GMaddStyle(css) {
		var myStyle = document.createElement('style');
		myStyle.textContent = css;
		var doc = document.head || document.documentElement;
		doc.appendChild(myStyle);
	};
	const html = `<div id="hrContent">
		<div class="title">人事系统数据对比</div>
		<div class="userInfo">
		</div>
	</div>`;
	const htmlCss = `
		#hrContent{width:400px;min-height:200px;background:#fff;box-shadow: 0px 0px 20px 0 rgb(0 0 0 / 20%);border-radius:10px;position:fixed;top:70px;right:70px;z-index:99999;}
		#hrContent .title{font-size:20px;font-weight:700;padding:10px 20px;border-bottom:1px solid #ddd;cursor:move;}
		#hrContent .userInfo{line-height:28px;padding:10px 20px;font-weight:500;max-height:400px;overflow-y:auto;}
	`;
	// $("iframe[name='recommendFrame']").contents().find("body").append(html);
	if (window.self === top.window) {
		$('body').append(html);
		GMaddStyle(htmlCss);

		$('#hrContent>.title').on('mousedown', function(e) { //鼠标按下
			let clickX = e.pageX - $('#hrContent>.title').offset().left;
			let clickY = e.pageY - $('#hrContent>.title').offset().top;
			$(document).on('mousemove', (e) => { //鼠标移动
				let left = e.clientX - clickX; //计算元素left值
				let top = e.clientY - clickY; //计算元素top值
				top = suan(top, 0, $(document).innerHeight() - $('#hrContent').height()) //调用封装的方法
				left = suan(left, 0, $(document).innerWidth() - $('#hrContent').width()) //调用封装的方法
				$('#hrContent').css({ //给盒子设置坐标
					left,
					top
				})
				e.preventDefault();
			})
			$(document).on('mouseup', (e) => { //鼠标抬起
				$(document).off('mousemove') //移除鼠标移动事件
			})
		})

		function suan(o, min, max) { //重复封装
			o < min ? o = min : o > max ? o = max : '' //限制出界
			return o
		}

		function getInterviewInfo(n, s) {
			$.ajax({
				url: `https://hrm.netpowerapps.com/hrm/api/interview/sameNameCheck`,
				type: 'get',
				data: {
					name: n,
					school: s
				},
				success: function(res) {
					let html = '';
					html = `<div>
							匹配结果：<span class="matching" style="color:${res.matchType==1?'#67C23A':(res.matchType==2?'#E6A23C':'#F56C6C')}">${res.matchType==1?'完全匹配':(res.matchType==2?'疑似匹配':'库中无相似简历')}</span>
              <span style="margin-left:20px;">匹配条数：${res.data?res.data.length:0}条</span>
							${
							  res.data?res.data.map(item=>{
								return `<br>
								  姓名：<span class="name">${item.name||''}</span><br>
								  学校：<span class="schoolName">${item.schoolName||''}</span><br>
								  最新邀约人：<span class="actualHiring">${item.actualHiring||''}</span><br>
								  面试日期时间：<span class="interviewDate">${item.interviewDate||''}</span><br>
								  岗位名称：<span class="position">${item.position||''}</span>
								  <div>沟通内容:</div><div class="communicationContent" style="white-space: pre-line;">${item.communicationContent||''}</div></div>
								`;
							  }).join(''):''
							}
						  </div>
						`;
					$('#hrContent .userInfo').html(html);
				},
				error: function() {
					$('#hrContent .userInfo').html(
						`<div style="font-size:18px;color:#F56C6C;">${res.msg||'请求错误！请联系管理员'}</div>`
					);
				}
			})

		}

		var name = "";
		var schoolName = "";
		var matchingInterval = intervalInit();

		function intervalInit() {
			return setInterval(function() {
				let iframeDom = '',
					defHref = window.location.href;
				let viewHrem = ['https://www.zhipin.com/web/chat/recommend',
					'https://www.zhipin.com/web/chat/interaction',
					'https://www.zhipin.com/web/chat/index'
				]
				if (viewHrem.includes(defHref)) {
					$('#hrContent').show();
					switch (defHref) {
						case 'https://www.zhipin.com/web/chat/recommend':
							iframeDom = $("iframe[name='recommendFrame']").contents().find("body").find(
								'.dialog-wrap.dialog-recommend-resume');
							break;
						case 'https://www.zhipin.com/web/chat/interaction':
							iframeDom = $("iframe[name='interactionFrame']").contents().find("body").find(
								'.dialog-wrap.dialog-recommend-resume');
							break;
						case 'https://www.zhipin.com/web/chat/index':
							iframeDom = $(".dialog-wrap.active").find(".boss-dialog__body");
							break;
					}
				} else {
					name = '', schoolName = '';
					$('#hrContent').hide();
					return false;
				}
				if (iframeDom.length > 0) {
					let n = iframeDom.find('.name>.geek-name').text();
					let s = iframeDom.find('.school-info>.name>b:eq(0)').text();
					if (name != n || schoolName != s) {
						name = n;
						schoolName = s;
						getInterviewInfo(n, s)
					}
				} else {
					name = '', schoolName = '';
					$('#hrContent .userInfo').html('');
				}
			}, 1000);
		}

	}
})(jQuery)