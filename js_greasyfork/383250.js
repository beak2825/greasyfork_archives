// ==UserScript==
// @name         JAV老司机-完全体-改-适配移动端
// @namespace    https://sleazyfork.org/zh-CN/users/23795-xmlspy
// @version      1.1.4
// @description  针对原先的bug进行修改-------JAV老司机神器,支持javlibrary.com、javbus.com、avio.pw、avso.pw等老司机站点。拥有JAV高清预览大图，JAV列表无限滚动自动加载，合成“挊”的自动获取JAV磁链接，一键自动115离线下载，优化成高效浏览的页面排版。增加在线播放及视频预览
// @author      felix-sleazy 感谢 Hobby

// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js
// @require      http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @resource     icon http://geekdream.com/image/115helper_icon_001.jpg

// @include     http*://*javlibrary.com/*
// @include     http*://*p26y.com/*
// @include     http*://*u29k.com/*
// @include     http://*.d28k.com/*
// @include     http://*.v27f.com/*

// @include     https://www.javbus.com/*
// @include     https://www.javbus2.com/*
// @include     https://www.javbus3.com/*
// @include     https://www.javbus5.com/*
// @include     https://www.javbus7.com/*
// @include     https://www.javbus.me/*
// @include     http*://www.javbus.com/*
// @include     http*://www.seedmm.in/*
// @include     http*://www.seedmm.us/*
// @include     http*://www.busjav.us/*
// @include     http*://www.dmmbus.us/*

// @include     http*://*avmo.pw/*
// @include     http*://*avio.pw/*
// @include     http*://*avso.pw/*
// @include     http*://*avxo.pw/*

// @include     http://115.com/*

// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_getResourceURL

// @connect      blogjav.net
// @connect      pixhost.to
// @connect      115.com
// @connect      btso.pw
// @connect      btdb.to
// @connect      ja14b.com

// @copyright    hobby 2016-12-18

// 大陆用户推荐Chrome + Tampermonkey（必须扩展） + XX-Net(代理) + Proxy SwitchyOmega（扩展）的环境下配合使用。
// v1.1.2 添加javbus相关的地址
// v1.1.1 解决javbus主页面鼠标导致有时候图片空白问题; 解决javbus详情页面不现实演员
// v1.1.0 在车牌号右边添加复制按钮
// v1.0.2 add www.k25m.com address

// @downloadURL https://update.greasyfork.org/scripts/383250/JAV%E8%80%81%E5%8F%B8%E6%9C%BA-%E5%AE%8C%E5%85%A8%E4%BD%93-%E6%94%B9-%E9%80%82%E9%85%8D%E7%A7%BB%E5%8A%A8%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/383250/JAV%E8%80%81%E5%8F%B8%E6%9C%BA-%E5%AE%8C%E5%85%A8%E4%BD%93-%E6%94%B9-%E9%80%82%E9%85%8D%E7%A7%BB%E5%8A%A8%E7%AB%AF.meta.js
// ==/UserScript==
/* jshint -W097 */
(function() {
	'use strict';
	var jav_userID = GM_getValue('jav_user_id', 0); //115用户ID
	//icon图标
	var icon = GM_getResourceURL('icon');

	var common = {
		parsetext: function(text) {
			var doc = null;
			try {
				doc = document.implementation.createHTMLDocument('');
				doc.documentElement.innerHTML = text;
				return doc;
			}
			catch (e) {
				alert('parse error');
			}
		},
		//判断日期是否最近两个月日期
		isLastTwoMonth: function(DateStr) {
			var now = new Date(); //当前日期
			var compDate = new Date(DateStr);
			if(now.getFullYear() == compDate.getFullYear()){
				var t = now.getMonth() - compDate.getMonth();
				if(t === 1 || t === 0){
					return true;
				}
			}
			return false;
		},
		//方法: 通用chrome通知
		notifiy:function (title, body, icon, click_url){
			var notificationDetails = {
				text: body,
				title: title,
				timeout: 10000,
				image: icon,
				onclick: function() {
					window.open(click_url);
				}
			};
			GM_notification(notificationDetails);
		},
		addAvImg:function(avid, func){
			//异步请求搜索blogjav.net的番号
			GM_xmlhttpRequest({
				method: "GET",
				//大图地址
				url: 'http://blogjav.net/?s='+avid,
				onload: function(result) {
					//console.log("时间111111:"+ new Date().getTime());
					var doc = common.parsetext(result.responseText);
					//console.log("时间222222:"+ new Date().getTime());
					let a_array = $(doc).find(".more-link");
					let a = a_array[0];
					for(let i = 0; i < a_array.length ; i ++){
						var fhd_idx = a_array[i].innerHTML.search(/FHD/);
						//debugger;
						if(fhd_idx > 0){
							a = a_array[i];
							break;
						}
					}

					if (a) {
						//异步请求调用内页详情的访问地址
						GM_xmlhttpRequest({
							method: "GET",
							//大图地址
							url: a.href,
							headers:{
								referrer:  "http://pixhost.to/" //绕过防盗图的关键
							},
							onload: function(XMLHttpRequest) {
								//console.log("时间333333:"+ new Date().getTime());
								var bodyStr = XMLHttpRequest.responseText;
								var yixieBody = bodyStr.substring(bodyStr.search(/<span id="more-(\S*)"><\/span>/),bodyStr.search(/<div class="category/));

								var img_start_idx = yixieBody.search(/"><img .*src="https*:\/\/(\S*)pixhost.to\/thumbs\//);
								//如果找到内容大图
								if( img_start_idx > 0)
								{
									var new_img_src = yixieBody.substring(yixieBody.indexOf('src',img_start_idx) + 5,yixieBody.indexOf('alt') - 2);
									var targetImgUrl = new_img_src.replace('thumbs','images').replace('//t','//img').replace('"','');

									//如果找到全高清大图优先显示全高清的
									console.log("图片地址:"+targetImgUrl);

									//创建img元素,加载目标图片地址
									//创建新img元素
									var $img = $('<img name="javRealImg" title="点击可放大缩小 (图片正常时)"></img>');
									$img.attr("src",targetImgUrl);
									$img.attr("style","float: left;cursor: pointer;");

									//将新img元素插入指定位置
									func($img);
									console.log("时间444444:"+ new Date().getTime());
								}
							},
							onerror: function(e) {
								console.log(e);
							}
						});//end  GM_xmlhttpRequest
					}
				},
				onerror: function(e) {
					console.log(e);
				}
			});//end  GM_xmlhttpRequest
		},
	};

	var main = {
		//av信息查询 类
		jav: {
			type: 0,
			re: /(avio|avmo|avso|avxo).*movie.*/,
			vid: function() {
				return $('.header')[0].nextElementSibling.innerHTML;
			},
			proc: function() {
				//insert_after('#movie-share');
				var divE = $("div[class='col-md-3 info']")[0];
				$(divE).after(main.cur_tab);
				//$(main.cur_tab).before($('#movie-share')[0]);
			}
		},
		javbus: {
			type: 0,
			re: /(javbus|seedmm|dmmbus|busjav)/,
			vid: function() {
				var a = $('.header')[0].nextElementSibling;
				return a ? a.textContent : '';
			},
			proc: function() {
				var divE = $("div[class='col-md-3 info']")[0];
				//var p = document.createElement('p');
				//p.className = 'hobby';
				//divE.parentElement.appendChild(p);
				$(divE).after(main.cur_tab);
			}
		},
		javlibrary: {
			type: 0,
			re: /(javlibrary|o23g|d28k|v27f|u29k|p26y|javli6|j8vlib|j9lib|jav11b|ja14b|13vlib).*\?v=.*/,
			vid: function() {
				return $('#video_id')[0].getElementsByClassName('text')[0].innerHTML;
			},
			proc: function() {
				//insert_after('#video_info');
				//<td style="vertical-align: top;">
				$('.socialmedia').remove();
				GM_addStyle([
					'#video_info{text-align: left;font: 14px Arial;min-width: 220px;max-width: 220px;padding: 0px 0px 0px 0px;}',
					'#video_jacket_info {width: 100%;overflow: hidden;}',//table-layout: fixed;
					'#coverimg {vertical-align: top;overflow: hidden;max-width: 50%;}',
					'#javtext {vertical-align: top;width: 220px;}',
					'#video_info td.header {width: 75px;}',
					'#video_info td.icon {width: 0px;}',
					'#content {padding-top: 0px;}',
				].join(''));

				var tdE = $("td[style='vertical-align: top;']")[0];
				tdE.id = "coverimg";
				$("td[style='vertical-align: top;']")[1].id = 'javtext';
				$('#leftmenu').remove();
				$('#rightcolumn').attr("style","margin: 0px 0px 0px 0px;width: 100%;padding: initial;");
				$(tdE.parentElement).append('<td id="hobby" style="vertical-align: top;width: 100%;"></td>');
				$('#hobby').append(main.cur_tab);

                // 添加复制车牌号的按钮
                var vidTd=$($('#video_id')[0].getElementsByClassName('text')[0]);
                var copyButton = $('<td><button>复制</button></td>');
                vidTd.after(copyButton);
                var me =this;
                copyButton.click(function(){
                    copyToClipboard(me.vid());
                });

                function copyToClipboard (text) {
                    var textArea = document.createElement("textarea");
                    textArea.style.position = 'fixed';
                    textArea.style.top = '0';
                    textArea.style.left = '0';
                    textArea.style.width = '2em';
                    textArea.style.height = '2em';
                    textArea.style.padding = '0';
                    textArea.style.border = 'none';
                    textArea.style.outline = 'none';
                    textArea.style.boxShadow = 'none';
                    textArea.style.background = 'transparent';
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();

                    try {
                        var successful = document.execCommand('copy');
                        var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
                        //alert(msg);
                    } catch (err) {
                        alert('该浏览器不支持点击复制到剪贴板');
                    }

                    document.body.removeChild(textArea);
                }  // end function copyToClipboard
			}
		},
	};

	// 挊
	var main_keys = Object.keys(main); //下面的不要出现
	main.cur_tab = null;
	main.cur_vid = '';

	// 第三方脚本调用
	var thirdparty = {
		// 挊
		offline_sites : {
			115: {
				name: '115离线',
				url: 'http://115.com/?tab=offline&mode=wangpan',
				enable: true,
			},
		},
		// 挊
		searchMagnetRun: function() {
			for (var i = 0; i < main_keys.length; i++) {
				var v = main[main_keys[i]];

				//for javlibrary
				if($("#adultwarningprompt")[0] !== null){
					//$("#adultwarningprompt input")[0].click();
				}

				if (v.re.test(location.href)) {
					if (v.type === 0) {
						try {
							main.cur_vid = v.vid();
						}
						catch (e) {
							main.cur_vid = '';
						}
						if (main.cur_vid) {
							GM_addStyle([
								'#nong-table-new{margin:10px auto;color:#666 !important;font-size:13px;text-align:center;background-color: #F2F2F2;}',
								'#nong-table-new th,#nong-table-new td{text-align: center;height:30px;background-color: #FFF;padding:0 1em 0;border: 1px solid #EFEFEF;}',
								'.jav-nong-row{text-align: center;height:30px;background-color: #FFF;padding:0 1em 0;border: 1px solid #EFEFEF;}',
								'.nong-copy{color:#08c !important;}',
								'.nong-offline{text-align: center;}',
								'#jav-nong-head a {margin-right: 5px;}',
								'.nong-offline-download{color: rgb(0, 180, 30) !important; margin-right: 4px !important;}',
								'.nong-offline-download:hover{color:red !important;}',
							].join(''));
							main.cur_tab = thirdparty.magnet_table.full();
							console.log('番号：', main.cur_vid);
							v.proc();

							// console.log(main.cur_tab)
							var t = $('#jav-nong-head')[0].firstChild;
							t.firstChild.addEventListener('change', function(e) {
								console.log(e.target.value);
								GM_setValue('search_index', e.target.value);
								var s = $('#nong-table-new')[0];
								s.parentElement.removeChild(s);
								thirdparty.searchMagnetRun();
							});

							thirdparty.search_engines.cur_engine(main.cur_vid, function(src, data) {
								if (data.length === 0) {
									$('#nong-table-new')[0].querySelectorAll('#notice')[0].textContent = 'No search result';
								}
								else {
									thirdparty.magnet_table.updata_table(src, data, 'full');
									/*display search url*/
									var y = $('#jav-nong-head th')[1].firstChild;
									y.href = thirdparty.search_engines.full_url;
								}
							});
						}
					}
					break;
				}
			}
		},
		// 挊
		search_engines : {
			switch_engine: function(i) {
				// var index = GM_getValue("search_index",0);
				GM_setValue('search_index', i);
				return i;
			},
			cur_engine: function(kw, cb) {
				var z = this[GM_getValue('search_index', 0)];
				if(!z){
					alert("search engine not found");
				}
				return z(kw, cb);
			},
			parse_error:function(a){
				alert("调用搜索引擎错误，可能需要更新，请向作者反馈。i="+ a);
			},
			full_url: '',
			0: function(kw, cb) {
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'https://btso.pw/search/' + kw,
					onload: function(result) {
						thirdparty.search_engines.full_url = result.finalUrl;
						var doc = common.parsetext(result.responseText);
						if (!doc) {
							thirdparty.search_engines.parse_error(GM_getValue('search_index'));
						}
						var data = [];
						var t = doc.getElementsByClassName('data-list')[0];
						if (t) {
							var a = t.getElementsByTagName('a');
							for (var i = 0; i < a.length; i++) {
								if (!a[i].className.match('btn')) {
									data.push({
										'title': a[i].title,
										'maglink': 'magnet:?xt=urn:btih:' + a[i].outerHTML.replace(/.*hash\//, '').replace(/" .*\n.*\n.*\n.*/, ''),
										'size': a[i].nextElementSibling.textContent,
										'src': a[i].href,
									});
								}
							}
						}
						cb(result.finalUrl, data);
					},
					onerror: function(e) {
						console.log(e);
					}
				});
			},
			1: function(kw, cb) {
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'https://btdb.to/q/' + kw + '/',
					onload: function(result) {
						thirdparty.search_engines.full_url = result.finalUrl;
						var doc = common.parsetext(result.responseText);
						if(!doc){
							thirdparty.search_engines.parse_error(GM_getValue('search_index'));
						}
						var data = [];
						var elems = doc.getElementsByClassName('item-title');
						for (var i = 0; i < elems.length; i++) {
							data.push({
								'title': elems[i].firstChild.title,
								'maglink': elems[i].nextElementSibling.firstElementChild.href,
								'size': elems[i].nextElementSibling.children[1].textContent,
								'src': 'https://btdb.to' + elems[i].firstChild.getAttribute('href'),
							});
						}
						console.log(data);
						cb(result.finalUrl, data);
					},
					onerror: function(e) {
						console.log(e);
					}
				});
			},
		},
		// 挊
		magnet_table : {
			template: {
				create_head: function() {
					var a = document.createElement('tr');
					a.className = 'jav-nong-row';
					a.id = 'jav-nong-head';
					var list = [
						'标题',
						'大小',
						'操作',
						'离线下载'
					];
					for (var i = 0; i < list.length; i++) {
						var b = this.head.cloneNode(true);
						if (i === 0) {
							var select = document.createElement("select");
							var ops = ["btio", "btdb"];
							var cur_index = GM_getValue("search_index",0);
							for (var j = 0; j < ops.length; j++) {
								var op = document.createElement("option");
								op.value = j.toString();
								op.textContent = ops[j];
								if (cur_index == j) {
									op.setAttribute("selected", "selected");
								}
								select.appendChild(op);
							}
							b.removeChild(b.firstChild);
							b.appendChild(select);
							a.appendChild(b);
							continue;
						}
						b.firstChild.textContent = list[i];
						a.appendChild(b);
					}
					// var select_box = this.create_select_box();
					// a.firstChild.appendChild(select_box);

					return a;
				},
				create_row: function(data) {
					var a = document.createElement('tr');
					a.className = 'jav-nong-row';
					a.setAttribute('maglink', data.maglink);
					var b = document.createElement('td');
					var list = [
						this.create_info(data.title, data.maglink),
						this.create_size(data.size, data.src),
						this.create_operation(data.maglink),
						this.create_offline()
					];
					for (var i = 0; i < list.length; i++) {
						var c = b.cloneNode(true);
						c.appendChild(list[i]);
						a.appendChild(c);
					}
					return a;
				},
				create_loading: function() {
					var a = document.createElement('tr');
					a.className = 'jav-nong-row';
					var p = document.createElement('p');
					p.textContent = 'Loading';
					p.id = 'notice';
					a.appendChild(p);
					return a;
				},
				create_info: function(title, maglink) {
					var a = this.info.cloneNode(true);
					a.firstChild.textContent = title.length < 20 ? title : title.substr(0, 20) + '...';
					a.firstChild.href = maglink;
					a.title = title;
					return a;
				},
				create_size: function(size, src) {
					var a = this.size.cloneNode(true);
					a.textContent = size;
					a.href = src;
					return a;
				},
				create_operation: function(maglink) {
					var a = this.operation.cloneNode(true);
					a.firstChild.href = maglink;
					return a;
				},
				create_offline: function() {    //有用 hobby
					var a = this.offline();
					a.className = 'nong-offline';
					return a;
				},
				create_select_box: function() {
					var select_box = document.createElement('select');
					select_box.id = 'nong-search-select';
					select_box.setAttribute('title', '切换搜索结果');
					var search_name = GM_getValue('search', default_search_name);
					for (var k in thirdparty.search_engines) {
						var o = document.createElement('option');
						if (k == search_name) {
							o.setAttribute('selected', 'selected');
						}
						o.setAttribute('value', k);
						o.textContent = k;
						select_box.appendChild(o);
					}
					return select_box;
				},
				head: (function() {
					var a = document.createElement('th');
					var b = document.createElement('a');
					a.appendChild(b);
					return a;
				})(),
				info: (function() {
					var a = document.createElement('div');
					var b = document.createElement('a');
					b.textContent = 'name';
					b.href = 'src';
					a.appendChild(b);
					return a;
				})(),
				size: function() {
					var a = document.createElement('a');
					a.textContent = 'size';
					return a;
				}(),
				operation: (function() {
					var a = document.createElement('div');
					var copy = document.createElement('a');
					copy.className = 'nong-copy';
					copy.textContent = '复制';
					a.appendChild(copy);
					return a;
				})(),
				offline: function() {
					var a = document.createElement('div');
					var b = document.createElement('a');
					b.className = 'nong-offline-download';
					b.target = '_blank';
					//debugger;
					for (var k in thirdparty.offline_sites) {
						if (thirdparty.offline_sites[k].enable) {
							var c = b.cloneNode(true);
							c.href = thirdparty.offline_sites[k].url;
							c.textContent = thirdparty.offline_sites[k].name;
							a.appendChild(c);
						}
					}
					return a;
				},
			},
			create_empty_table: function() {   //有用 hobby
				var a = document.createElement('table');
				a.id = 'nong-table-new';
				return a;
			},
			updata_table: function(src, data, type) {
				if (type == 'full') {
					var tab = $('#nong-table-new')[0];
					tab.removeChild(tab.querySelector("#notice").parentElement);
					for (var i = 0; i < data.length; i++) {
						tab.appendChild(thirdparty.magnet_table.template.create_row(data[i]));
					}
				}
				// else if(type =='mini'){
				// }

				this.reg_event();
			},
			full: function(src, data) {
				var tab = this.create_empty_table();
				tab.appendChild(thirdparty.magnet_table.template.create_head());
				// for (var i = 0; i < data.length; i++) {
				//     tab.appendChild(thirdparty.magnet_table.template.create_row(data[i]))
				// }
				var loading = thirdparty.magnet_table.template.create_loading();
				tab.appendChild(loading);
				return tab;
			},
			handle_event: function(event) {
				if (event.target.className == 'nong-copy') {
					event.target.innerHTML = '成功';
					GM_setClipboard(event.target.href);
					setTimeout(function() {
						event.target.innerHTML = '复制';
					}, 1000);
					event.preventDefault(); //阻止跳转
				}
				else if (event.target.className == 'nong-offline-download') {
					var maglink = event.target.parentElement.parentElement.getAttribute('maglink') || event.target.parentElement.parentElement.parentElement.getAttribute('maglink');
					GM_setValue('magnet', maglink);

					var token_url = 'http://115.com/?ct=offline&ac=space&_='; //获取115 token接口
					GM_xmlhttpRequest({
						method: 'GET',
						url: token_url + new Date().getTime(),
						onload: function (responseDetails)
						{
							if (responseDetails.responseText.indexOf('html') >= 0) {
								//未登录处理
								common.notifiy("115还没有登录",
											   '请先登录115账户后,再离线下载！',
											   icon,
											   'http://115.com/?mode=login'
											  );
								return false;
							}
							var sign115 = JSON.parse(responseDetails.response).sign;
							var time115 = JSON.parse(responseDetails.response).time;
							console.log("uid="+ jav_userID+" sign:"+sign115+" time:"+ time115);
							console.log("rsp:"+responseDetails.response);
							GM_xmlhttpRequest({
								method: 'POST',
								url: 'http://115.com/web/lixian/?ct=lixian&ac=add_task_url', //添加115离线任务接口
								headers:{
									"Content-Type":"application/x-www-form-urlencoded"
								},
								data:"url="+encodeURIComponent(maglink)+"&uid="+ jav_userID + "&sign="+sign115+"&time="+time115, //uid=1034119 ,hobby的
								onload: function (responseDetails) {
									var lxRs = JSON.parse(responseDetails.responseText); //离线结果
									if (lxRs.state) {
										//离线任务添加成功
										common.notifiy("115老司机自动开车",
													   '离线任务添加成功',
													   icon,
													   'http://115.com/?tab=offline&mode=wangpan'
													  );
									}
									else{
										//离线任务添加失败
										if(lxRs.errcode == '911'){
											lxRs.error_msg = '你的帐号使用异常，需要在线手工重新验证即可正常使用。';
										}
										common.notifiy("失败了",
													   '请重新打开115,'+lxRs.error_msg,
													   icon,
													   'http://115.com/?tab=offline&mode=wangpan'
													  );
									}
									console.log("sign:"+sign115+" time:"+ time115);
									console.log("磁链:"+maglink+" 下载结果:"+ lxRs.state+" 原因:"+lxRs.error_msg);
									console.log("rsp:"+responseDetails.response);
								}
							});
						}
					});
					event.preventDefault(); //阻止跳转
				}
			},
			reg_event: function() { // target 处理 更精准
				var list = [
					'.nong-copy',
					'.nong-offline-download'
				];
				for (var i = 0; i < list.length; i++) {
					var a = document.querySelectorAll(list[i]);
					for (var u = 0; u < a.length; u++) {
						a[u].addEventListener('click', this.handle_event, false);
					}
				}
				// var b = document.querySelectorAll('#nong-search-select')[0];
				// b.addEventListener('change', this.handle_event, false);

			},
		},
		// 登录115执行脚本，自动离线下载准备步骤
		login115Run: function(){
			jav_userID = GM_getValue('jav_user_id', 0); //115用户ID缓存
			//获取115ID
			if (jav_userID === 0) {
				if (location.host.indexOf('115.com') >= 0) {
					if (typeof (window.wrappedJSObject.user_id) != 'undefined') {
						jav_userID = window.wrappedJSObject.user_id;
						GM_setValue('jav_user_id', jav_userID);
						alert('115登陆成功！');
						return;
					}
				} else {
					//alert('请先登录115账户！');
					common.notifiy("115还没有登录",
								   '请先登录115账户后,再离线下载！',
								   icon,
								   'http://115.com/?mode=login'
								  );
					GM_setValue('jav_user_id', 0);
				}
			}

			if (location.host.indexOf('115.com') >= 0)
			{
				/*if(location.href.indexOf('#115helper') < 0)
				{
					console.log("jav老司机:115.com, 不初始化.");
					return false;
				}*/
				console.log('jav老司机:115.com,尝试获取userid.');
				jav_userID = GM_getValue('jav_user_id', 0);
				//debugger;
				if(jav_userID !== 0)
				{
					console.log("jav老司机: 115账号:"+jav_userID+",无需初始化.");
					return false;
				}
				jav_userID = $.cookie("OOFL");
				console.log("jav老司机: 115账号:"+jav_userID);
				if(!jav_userID)
				{
					console.log("jav老司机: 尚未登录115账号");
					return false;
				}else{
					console.log("jav老司机: 初始化成功");
					common.notifiy('老司机自动开车', '登陆初始化成功,赶紧上车把!', icon, "");
					GM_setValue('jav_user_id', jav_userID);
				}
				return false;
			}
		},
		// 瀑布流脚本
		waterfall:(function () {
			function waterfall(selectorcfg = {}){
				this.lock = new Lock();
				this.baseURI = this.getBaseURI();
				this.selector = {
					next: 'a.next',
					item: '',
					cont: '', //container
					pagi: '.pagination',
				};
				Object.assign(this.selector, selectorcfg);
				this.pagegen = this.fetchSync(location.href);
				this.anchor = $(this.selector.pagi)[0];
				this._count = 0;
				this._1func = function(cont, elems) {
					cont.empty().append(elems);
				};
				this._2func = function(cont, elems) {
					cont.append(elems);
				};
				this._3func = function(elems) {
				};

				if ($(this.selector.item).length) {
					document.addEventListener('scroll', this.scroll.bind(this));
					document.addEventListener('wheel', this.wheel.bind(this));
					this.appendElems(this._1func);
				}
			}
			waterfall.prototype.getBaseURI = function() {
				let _ = location;
				return `${_.protocol}//${_.hostname}${(_.port && `:${_.port}`)}`;
			};
			waterfall.prototype.getNextURL= function(href) {
				let a = document.createElement('a');
				a.href = href;
				return `${this.baseURI}${a.pathname}${a.search}`;
			};
			// 瀑布流脚本
			waterfall.prototype.fetchURL= function(url) {
				console.log(`fetchUrl = ${url}`);
                let $currentPageUrlTip = $('#currentPageUrlTip');
                let currentPageUrlTipString = '<a id="currentPageUrlTip" href="'+url+'">'+url+'</a>';
                if($currentPageUrlTip.length == 0){
                    $('#rightcolumn').append(currentPageUrlTipString);
                }else {
                    $currentPageUrlTip.replaceWith(currentPageUrlTipString);
                }

				const fetchwithcookie = fetch(url, { credentials: 'same-origin' })
                    .catch(err => {
                        console.log('fetcheUrl error::'+err);
                        $('.page_selector')[0].after('<a href="'+url+'">'+url+'</a>');
                    })
                    .then(response => {
                        if (response.status >= 200 && response.status < 300) {
                            return Promise.resolve(response)
                        } else {
                            return Promise.reject(new Error(response.statusText))
                        }
                    });
				return fetchwithcookie
					.then(response => response.text())
					.then(html => new DOMParser().parseFromString(html, 'text/html'))
					.then(doc => {
					let $doc = $(doc);
					let href = $doc.find(this.selector.next).attr('href');
					let nextURL = href ? this.getNextURL(href) : undefined;
					let elems = $doc.find(this.selector.item);
                    winonload();
					return {
						nextURL,
						elems
					};
				});
			};
			// 瀑布流脚本
			waterfall.prototype.fetchSync= function* (urli) {
				let url = urli;
				do {
					yield new Promise((resolve, reject) => {
						if (this.lock.locked) {
							reject();
						} else {
							this.lock.lock();
							resolve();
						}
					}).then(() => {
						return this.fetchURL(url)
							.then(info => {
							url = info.nextURL;
							return info.elems;
						});
					}).then(elems => {
						this.lock.unlock();
						return elems;
					}).catch((err) => {
						// Locked!
					});
				} while (url);
			};
			// 瀑布流脚本
			waterfall.prototype.appendElems= function () {
				let nextpage = this.pagegen.next();
				if (!nextpage.done) {
					nextpage.value.then(elems => {
						const cb = (this._count === 0) ? this._1func : this._2func;
						cb($(this.selector.cont), elems);
						this._count += 1;
						// hobby mod script
						this._3func(elems);
					});
				}
				return nextpage.done;
			};
			// 瀑布流脚本
			waterfall.prototype.end= function () {
				console.info('The End');
				document.removeEventListener('scroll', this.scroll.bind(this));
				document.removeEventListener('wheel', this.wheel.bind(this));
				$(this.anchor).replaceWith($(`<h1>The End</h1>`));
			};
			waterfall.prototype.reachBottom= function(elem, limit) {
				return (elem.getBoundingClientRect().top - $(window).height()) < limit;
			};

			waterfall.prototype.scroll=	function() {
				if (this.reachBottom(this.anchor, 500) && this.appendElems(this._2func)) {
					this.end();
				}
			};

			waterfall.prototype.wheel= function() {
				if (this.reachBottom(this.anchor, 1000) && this.appendElems(this._2func)) {
					this.end();
				}
			};
			waterfall.prototype.setFirstCallback= function(f) {
				this._1func = f;
			};
			waterfall.prototype.setSecondCallback= function(f) {
				this._2func = f;
			};
			waterfall.prototype.setThirdCallback= function(f) {
				this._3func = f;
			};

			return waterfall;
		})(),
		// 瀑布流脚本
		waterfallScrollInit: function (){
			var w = new thirdparty.waterfall({});
			// javbus.com、avmo.pw、avso.pw
			var $pages = $('div#waterfall div.item');
			if ($pages.length) {
				// javbus.com
				if($('a#next').length){
					w = new thirdparty.waterfall({
						next: 'a#next',
						item: 'div#waterfall div.item',
						cont: '#waterfall',
						pagi: '.pagination-lg',
					});
				}
				//avmo.pw、avso.pw
				if($('a[name="nextpage"]').length){
					w = new thirdparty.waterfall({
						next: 'a[name="nextpage"]',//nextpage
						item: 'div#waterfall div.item',
						cont: '#waterfall',
						pagi: '.pagination',
					});
				}
			}

			// javlibrary
			var $pages2 = $('div.videos div.video');
			if ($pages2.length) {
				$pages2[0].parentElement.id = "waterfall";
				w = new thirdparty.waterfall({
					next: 'a[class="page next"]',
					item: 'div.videos div.video',
					cont: '#waterfall',
					pagi: '.page_selector',
				});
			}

			w.setSecondCallback(function(cont, elems) {
				if(location.pathname.startsWith('/star/')) {
					cont.append(elems.slice(1));
				} else {
					cont.append(elems);
				}
			});

			w.setThirdCallback(function(elems) {return;
				// hobby mod script
				if(document.title.search(/JAVLibrary/) > 0 && elems){
					for(let i = 0; i < elems.length ; i ++){
						let _vid = $(elems[i]).attr("id").replace('vid_','');//vid_javlikd42y
						//console.log(`vid = ${_vid}`);
						//debugger;
						//异步请求调用内页详情的访问地址
						GM_xmlhttpRequest({
							method: "GET",
							//内页地址
							url: "http://www.o23g.com/cn/?v=" + _vid,
							onload: function(result) {
								let vid = result.finalUrl.split("=")[1];//例如：http://www.j12lib.com/cn/?v=javlikd42a
								let bodyStr = result.responseText;
								let date_idx = bodyStr.search(/"video_date" class="item"/);//<span class="score">(9.70)</span>
								let yixieBody = bodyStr.substring(date_idx,bodyStr.search(/"video_genres"/));
								let dateString = yixieBody.substring(yixieBody.indexOf('video_date') + 92,yixieBody.indexOf('video_date') + 102);
								let pingfengString = "";
								if(yixieBody.indexOf('score">') > 0){
									pingfengString = yixieBody.substring(yixieBody.indexOf('score">') + 7,yixieBody.indexOf('score">') + 14).replace('</span>','').replace('<','');
								}
								$("#vid_"+vid).children("a").append("<div class='id'style='color: red;'>"+dateString+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+pingfengString+"</div>");
								//todo
								if($("#vid_"+vid).context.URL.indexOf("bestrated") > 0 && common.isLastTwoMonth(dateString)){
									//<a href="/cn/vl_bestrated.php?delete" style="color: red;">只显示最近发行的</a>
									$("#vid_"+vid).css("background-color","lightskyblue");
									//debugger;
								}
								else if($("#vid_"+vid).context.URL.indexOf("bestrated.php?delete") > 0){
									$("#vid_"+vid).remove();
								}
                                console.log("w.setThirdCallback "+vid);
                                winonload();
							},
							onerror: function(e) {
								console.log(e);
							}
						});//end  GM_xmlhttpRequest
					}

				}
			});
			// javbus.com、avmo.pw、avso.pw 样式
			GM_addStyle([
				'#waterfall {height: initial !important;width: initial !important;display: flex;flex-direction: row;flex-wrap: wrap;}',
				'#waterfall .item.item {position: relative !important;top: initial !important;left: initial !important;float: none;flex: 20%;}',
				'#waterfall .movie-box,#waterfall .avatar-box {width: initial !important;display: flex;}',
				'#waterfall .movie-box .photo-frame {overflow: visible;}',
			].join(''));
		},

	};

	if (location.host.indexOf('115.com') >= 0)
	{
		thirdparty.login115Run();
	}

	GM_addStyle([
		'.min {width:66px;min-height: 233px;height:auto;cursor: pointer;}',
		'.container {width: 100%;float: left;}',
		'.col-md-3 {float: left;max-width: 260px;}',
		'.col-md-9 {width: inherit;}',
		'.footer {padding: 20px 0;background: #1d1a18;float: left;}',
		'#nong-table-new {margin: initial !important;important;color: #666 !important;font-size: 13px;text-align: center;background-color: #F2F2F2;float: left;}',
	].join(''));

	// 挊
	if(GM_getValue('search_index',null) === null){
		GM_setValue('search_index',0);
	}
	thirdparty.searchMagnetRun();


    var AVGLE_SEARCH_JAV_API_URL = 'https://api.avgle.com/v1/jav/';
    var page = 0;
    var limit = '?limit=2';
    var index =0;
    var a_array=[];
    $("div#waterfall").onload=function(){
        winonload();
    };
    function getPreview(avid){
        $.getJSON(AVGLE_SEARCH_JAV_API_URL + encodeURIComponent(avid) + '/' + page + limit, function (response) {
            console.log(response);
            if (response.success) {
                var videos = response.response.videos;
                if(response.response.total_videos>0){
                    var i=videos[0].preview_url.lastIndexOf('/');
                    var preview=videos[0].preview_url.substring(0,i)+"/preview.mp4";
                    var poster=videos[0].preview_url;
                    var prevideo='<video class="preview" loop="" autoplay="" width="100%" height="100%" src="'+preview+'" poster="'+poster+'" id="'+avid+'"></video>';
                    if($("a#"+avid).find("video").length===0){
                        $("a#"+avid).append(prevideo);
                        $("video#"+avid).show();
                        $("a#"+avid).find("div").hide();
                    }
                    $("video#"+avid).hover(function(){
                            $("video#"+avid).show();
                            $("video#"+avid).parent().find("div").hide();
                        },function(){
                            $("video#"+avid).hide();
                            $("video#"+avid).parent().find("div").show();
                    });
                    var perc = Math.floor((videos[0].likes / (videos[0].likes+videos[0].dislikes)) * 100);
                    var likes= '/ <date>'+perc+'%</date>';
                    $("a#"+avid).find("div.photo-info a span").append(likes);
                    console.log("Preview ["+index+"]: "+avid+" src "+preview);
                }
            }
        });
    }
    function winonload(){
        if(location.href.includes('?v=jav')){
            return;
        }
        //获取所有番号影片链接的a元素
        a_array = $("div[class='item'] a");
        for(var index=0;index<a_array.length;index++){
            var aEle = a_array[index];
            var avid = $(aEle).find("date:eq(0)").text();
            var attr = $(aEle).attr('id');

            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if (typeof attr === typeof undefined || attr === false) {
                $(aEle).attr("id",avid);
                $(aEle).find("span").parent().append('<a href="'+$(aEle).attr("href")+'"></a>');
                var span=$(aEle).find("span");
                $(aEle).find("span").remove();
                $(aEle).find("div.photo-info a").append(span);
                $(aEle).removeAttr("href");
                $(aEle).parent().attr("id",avid);
                $(aEle).find("div[class='photo-frame']").hover(function(){
				    //debugger;
                    var avid_i =$(this).parent().attr("id");
                    //console.log("enter "+avid_i);
                    //console.log($("video#"+avid_i).length===0? "Yes":"No");
                    if($("video#"+avid_i).length===0){
                        //getPreview(avid_i);
                    }else{
                        $("video#"+avid_i).show();
                        //$("video#"+avid_i).parent().find("div").hide();
                    }
                },function(){
				    //debugger;
                    var avid_i =$(this).parent().attr("id");
                    //console.log("leave "+avid_i);
                    if($("video#"+avid_i).length!==0){
                        //$("video#"+avid_i).hide();
                        $("video#"+avid_i).parent().find("div").show();
                    }
                });

            }
        }
        console.log("列表长度："+a_array.length);
    }
    window.onload=function(){
        winonload();
    };

	var AVID = "";
	//获取番号影片详情页的番号  例如：https://avmo.pw/cn/movie/5rbn
	if($('.header').length ){
		AVID = $('.header')[0].nextElementSibling.textContent;
        $.getJSON(AVGLE_SEARCH_JAV_API_URL + encodeURIComponent(AVID) + '/' + page + limit, function (response) {
            console.log(response);
            if (response.success) {
                var videos = response.response.videos;
                if(response.response.total_videos>0){
                    console.log("番号输出:"+AVID);
                    var screencap = document.querySelector('.screencap');
                    var width = screencap.getBoundingClientRect().width;
                    var iframe='<iframe width="'+ width +'" height="'+ width * 2/3 +'" src='+videos[0].embedded_url+' frameborder="0" allowfullscreen></iframe>';
                    $("a[class='bigImage']").hide();
                    $("div[class='col-md-9 screencap']").append(iframe);
                    var percentage = Math.floor((videos[0].likes / (videos[0].likes+videos[0].dislikes)) * 100);
                    var info='<div id="video_rate_percentage style="position:absolute;left:18px;display: block;font-size:10px;" text-align="left" background-color="red"">&#9829 '+percentage+'%</div>';
                    $("div[class='col-md-9 screencap']").append(info);
                }
            }
        });
		//debugger;
		//console.log("时间000000:"+ new Date().getTime());
		common.addAvImg(AVID,function ($img) {
			var divEle = $("div[class='col-md-3 info']")[0];
			if (divEle) {
				$(divEle.parentElement).append($img);
				$img.click(function(){
					$(this).toggleClass('min');
					if($(this).attr("class")){
						this.parentElement.parentElement.scrollIntoView();
					}
				});
				//$img.load(function() {
				//    console.log('load compeleted');
				//});
			}
			// http://www.javlibrary.com/cn/?v=javlilzo4e
			divEle = $("div[id='video_favorite_edit']")[0];
			if (divEle) {
				$img.attr("style","cursor: pointer;");
				$(divEle).after($img);
				$img.click(function(){
					$(this).toggleClass('min');
					if($(this).attr("class")){
						this.parentElement.parentElement.scrollIntoView();
					}
				});
			}

		});
	}

	// 瀑布流脚本
	class Lock {
		constructor(d = false) {
			this.locked = d;
		}
		lock() {
			this.locked = true;
		}
		unlock() {
			this.locked = false;
		}
	}
	// 瀑布流脚本
	thirdparty.waterfallScrollInit();

   // $("div[class='col-md-3 info'] > p:eq(-1)").hide();
    //$("div[class='col-md-3 info'] > p:eq(-2)").hide();
    //$("div[class='container'] > h4:eq(0)").hide();
    //$("div[class='row ptb30']").hide();
})();