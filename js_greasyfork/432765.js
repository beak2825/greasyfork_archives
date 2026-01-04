// ==UserScript==
// @name         学习平台自动答题插件
// @namespace    https://www.zyglz.com/
// @version      2.01
// @description  dj平台自动答题插件
// @author       zyglz
// @match        https://dj.cnpc/*
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/@supabase/supabase-js@1.0.3/dist/umd/supabase.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/432765/%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/432765/%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function () {

	var debug = true; // 调试开关
	var test_list = []; //题库
	var test_add = []; //需要增加的题目
	var useAllTest = true; //全数据库查询
	var test_AllList = []; //数据库所有试题
	//var url="https://dj.cnpc/#/homePage/newLearn/testPaper/549547662134865648/1/666";
	var testBeginStr = 'https://dj.cnpc/#/homePage/newLearn/testPaper/';
	var timers = [];
	var exam_id = ''; //试卷id
	var exam_name = ''; //试卷名称
	var exam_code = ''; //试卷编码
	var settings = {}; //系统设置
	var userId = 1; //用户id
	var userToken = '327FEE1EE3425990A466A0780AECF5876FCD4A3B6A8EDCD8107BC9A98F68956D'; //用户token
	var GetExamList_url = 'http://api.demo.com/Exam/GetExamList'; //获取所有试卷数据列表
	var GetExamInfoByCode_url = 'http://api.demo.com/Exam/GetExamInfoByCode'; //通过试卷编码examcode获取试卷数据信息
	var GetTestInfo_url = 'http://api.demo.com/Test/GetTestInfo'; //通过试卷编码examcode获取全部试题数据
	var AddTest_url = 'http://api.demo.com/Test/AddArray'; //新增试题信息
	var AddExam_url = 'http://api.demo.com/Exam/AddArray'; //新增试卷信息

	var maxPost = 900; //单次请求数据长度限值
	var responseData = []; //请求的到的数据存储

	//var settings = GMgetValue("Settings");
	if (JSON.stringify(settings) === "{}") {
		//alert("请通过左边按钮进行设置，默认为全部自动！！");
		settings = {
			autoAnswer: {
				value: false,
				name: "自动答题"
			},
			creteExam: {
				value: false,
				name: "创建试卷"
			},
			createTest: {
				value: true,
				name: "更新试库"
			},
			autoSubmit: {
				value: true,
				name: "自动提交"
			},
			tiquTest: {
				value: false,
				name: "手动入库"
			},
		}
	}

	GMsetValue("Settings", settings);

	// msg('settings.autoAnswer：'+settings.autoAnswer.value,1);

	function GetApiData(Api_url, _data = [], UserLoginInfo = false) {
		return new Promise(function (resolve, reject) {
			msg('GM_xmlhttpRequest( ' + Api_url + ' )网络请求中，请稍后........');
			var data_str = ''
			if (UserLoginInfo) {
				data_str = 'user_id=' + userId + '&token=' + userToken;
			}
			for (var key in _data) {
				if (data_str == '') {
					data_str = key + '=' + _data[key];
				} else {
					data_str = data_str + '&' + key + '=' + _data[key];
				}
			}
			if (data_str != '') {
				Api_url = Api_url + '?' + data_str;
			}
			GM_xmlhttpRequest({
				method: 'GET',
				url: Api_url,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 QIHU 360SE',
					'Accept': 'text/html, application/xhtml+xml, */*',
				},
				//context:'aaa',
				synchronous: true,
				onload: function (res) {
					if (res.status === 200) {
						//console.log(JSON.stringify(res.response));
						responseData = JSON.parse(res.response);
						//console.log(responseData);
						resolve(responseData);
					} else {
						console.log('失败');
						console.log(res);
						reject(res);
					}
				},
				onerror: function (err) {
					console.log('error');
					console.log(err);
					reject(err);
				}
			});
		});
	}

	function PostApiData(Api_url, _data = [], UserLoginInfo = false) {
		return new Promise(function (resolve, reject) {
			msg('GM_xmlhttpRequest( ' + Api_url + ' )网络请求中，请稍后........');
			let formData = new FormData();
			if (UserLoginInfo) {
				formData.append("user_id", userId);
				formData.append("token", userToken);
			}
			for (var key in _data) {
				formData.append(key, _data[key]);
			}
			GM_xmlhttpRequest({
				method: 'POST',
				url: Api_url,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 QIHU 360SE',
					'Accept': 'text/html, application/xhtml+xml, */*',
				},
				//context:'aaa',
				data: formData,
				synchronous: true,
				onload: function (res) {
					if (res.status === 200) {
						//console.log(JSON.stringify(res.response));
						responseData = JSON.parse(res.response);
						//console.log(responseData);
						resolve(responseData);
					} else {
						console.log('失败');
						console.log(res);
						reject(res);
					}
				},
				onerror: function (err) {
					console.log('error');
					console.log(err);
					reject(err);
				}
			});
		});
	}

	//网页页面检查
	async function tabCheck() {
		var url = window.location.href;
		if (url.startsWith(testBeginStr)) {
			var nameSpan = document.querySelector("#container_zzt > div > div._headers > span");
			if (nameSpan) {
				exam_name = nameSpan.innerText;
			};
			exam_code = await GetExamCode(url);
			//检测是否有答题计时文本
			var test_timer = document.querySelector("#countDownBar > div");
			if (test_timer) {
				msg('考试界面：' + exam_name);
				test_list = []; //题库
				test_add = []; //需要增加的题目
				return 'kaoshi';
			} else {
				msg('非考试界面：' + exam_name);
				return 'chengji';
			};
		} else {
			msg('操作错误！当前非答题界面！');
			return false;
		};
	}

	async function doAnswer() {
		if (settings.autoAnswer.value == true) {
			var jiemian = await tabCheck();
			if (jiemian == 'kaoshi') {
				if (exam_code) {
					var _data = [];
					_data["exam_code"] = exam_code;
					let result = await GetApiData(GetExamInfoByCode_url, _data);
					//msg("访问开始");		
					if (result.ret == 200 && result.length != 0 && typeof (result) != 'undefined') {
						try {
							if (typeof (result.data.length) == 'undefined' && result.msg == '') {
								msg('数据库无该试卷信息！exam_code：' + exam_code, 1);
							} else {
								var exam_info = result.data[0];
								exam_name = exam_info.name;
								msg('试卷("' + exam_name + '")的信息如下:', 1);
								console.log(exam_info);
								exam_id = exam_info.id;
								var exam_status = exam_info.status;
								var _data1 = [];
								if (exam_info.status == 2) {
									_data1["exam_id"] = exam_id;
								}
								let test_result = await GetApiData(GetTestInfo_url, _data1);
								if (test_result.ret == 200 && test_result.length != 0 && typeof (test_result) != 'undefined') {
									try {
										if (test_result.data == false && test_result.msg == '') {
											msg('该试卷还没有添加试题！code：' + exam_code, 1);
										} else {
											test_list = test_result.data['profile'];
											console.log(test_list);
											await dati();
										}
									} catch (err) {
										console.log(err);
									}
								} else if (test_result.ret != 200) {
									msg('GM_xmlhttpRequest( ' + GetTestInfo_url + ' )\t，' + responseData.msg);
									return false;
								}
							}
						} catch (err) {
							console.log(err);
						}
					} else if (result.ret != 200) {
						msg('GM_xmlhttpRequest( ' + GetExamInfoByCode_url + ' )\t，' + responseData.msg);
						return false;
					}
				} else {
					msg('试卷编码错误,答题结束！code：' + exam_code, 1);
				}
			} else {
				msg('当前页面非答题界面,答题结束！', 1);
			};
		};
		GMsetValue("Settings", settings.autoAnswer.value = false);
	}

	async function add_Exam() {
		var jiemian = await tabCheck();
		if (jiemian != false) {
			if (settings.creteExam.value == true) {
				if (exam_code != '' && exam_name != '') {
					var _data = [];
					_data["exam_code"] = exam_code;
					let result = await GetApiData(GetExamInfoByCode_url, _data);
					//msg("访问开始");		
					if (result.ret == 200 && result.length != 0 && typeof (result) != 'undefined') {
						try {
							if (typeof (result.data.length) == 'undefined' && result.msg == '') {
								let new_exam = {
									'item': 'TRXF',
									'name': exam_name,
									'value': exam_code,
									'status': 1,
									'createtime': Math.ceil((new Date().getTime()) / 1000),
									'updatetime': Math.ceil((new Date().getTime()) / 1000),
								};
								var _data1 = [];
								_data1["datas"] = JSON.stringify(new_exam);
								let result = await PostApiData(AddExam_url, _data1);
								msg('新试卷(' + exam_name + ')增加完毕,信息如下', 1);
								console.log(result);
							} else {
								msg(exam_name + '(' + exam_code + ')-该试卷已存在！', 1);
							}
						} catch (err) {
							msg('试卷创建失败(' + exam_name + ')(' + exam_code + ')', 1);
							console.log(err);
						}
					}
				} else {
					msg('试卷创建失败(' + exam_name + ')(' + exam_code + ')', 1);
				}
			}
		} else {
			msg('试卷创建失败！当前页面非试题界面！');
		};
		GMsetValue("Settings", settings.creteExam.value = false);
	}

	//获取href中试卷的编码exam_code
	async function GetExamCode(url) {
		let regx = /(testPaper\/=?)(\S*)\/.\//;
		let result = url.match(regx);
		if (result) {
			let code = result[2];
			msg('方法(GetExamCode):获取url中试卷编码(exam_code:' + code + ')');
			return code;
		} else {
			msg('方法(GetExamCode):获取url中试卷编码失败！！');
		};
	}

	async function dati() {
		msg("开始答单选题", 1)
		await danxuanti();
		await sleep(5000);

		msg("开始答多选题", 1)
		await duoxuanti();
		await sleep(5000);

		msg("开始答判断题", 1)
		await panduanti();
		await sleep(5000);

		msg("开始答填空题", 1)
		await tiankongti();
		await sleep(5000);

		if (settings.autoSubmit.value == true) {
			msg("开始提交试卷", 1)
			let tijiao = document.querySelector("#group1_zhangzhitao > div > button");
			if (tijiao) {
				tijiao.click();
				await sleep(3000);
				let queding = document.querySelector("#container_zzt > div > div:nth-child(7) > div > div.el-dialog__footer > span > button:nth-child(1)")
				if (queding) {
					queding.click();
					await sleep(3000);
					let ok_button = document.querySelector("#container_zzt > div > div:nth-child(10) > div > div.el-dialog__footer > span > button");
					if (ok_button) {
						ok_button.click();
						await sleep(3000);
					};
				};
			};

			await sleep(5000);
			var result = await add_Test();
			if (result) {
				msg('试题数据库已经更新完成,数据如下', 1);
				console.log(JSON.stringify(result));
			}
		};
		msg("本试卷做答完毕，谢谢使用！", 1);
	}

	async function add_Test() {
		if (settings.createTest.value == true && test_add.length != 0) {
			var answer = await tiqudaan();
			//msg("方法(add_Test)：待完善答案的题目列表：",1)
			console.log(JSON.stringify(test_add));
			if (answer.length != 0) {
				for (var i = 0; i < test_add.length; i++) {
					let da = search_answer(answer, test_add[i]["title"]);
					if (da) {
						test_add[i]["answer"] = da;
						test_add[i]['createtime'] = Math.ceil((new Date().getTime()) / 1000);
						test_add[i]['updatetime'] = Math.ceil((new Date().getTime()) / 1000);
					} else {
						test_add.splice(i, 1);
					}
				}
				answer = [];
				msg("方法(add_Test)：完善增加试题数据数据库如下：", 1)
				console.log(test_add);
				var _data = [];
				_data["datas"] = JSON.stringify(test_add);
				let result = await PostApiData(AddTest_url, _data);
				return result;
			}
		}
	}

	//手工提取成绩界面的答题结果并添加至数据库
	async function tiqu_Test() {
		if (settings.tiquTest.value == true) {
			var jiemian = await tabCheck();
			if (jiemian == 'chengji') {
				var answer = await tiqudaan();
				if (answer.length != 0) {
					msg("方法(tiqu_Test):手工提取试题结果并全部入数据库")
					//console.log(JSON.stringify(answer));
					console.log(answer);
					var _data = [];
					_data["datas"] = JSON.stringify(answer);
					let result = await PostApiData(AddTest_url, _data);
					console.log(result);
				} else {
					msg('入库失败，未提取到任何试题信息！')
				}
			} else {
				msg('试题信息提取失败！当前非成绩界面！');
			}
		}
		GMsetValue("Settings", settings.tiquTest.value = false);
	}

	//从题库中通过title 查找answer
	function search_answer(tiku, timu) {
		if (timu != "") {
			timu = timu.replace(/[?]/g, "[?]");
			timu = timu.replace(/[(]/g, "[(]");
			timu = timu.replace(/[)]/g, "[)]");
			for (var i in tiku) {
				var reg = RegExp(timu);
				if (reg.exec(tiku[i]["title"])) {
					return tiku[i]["answer"];
				}
			}
		}
	}

	//自动做单选题
	async function danxuanti() {
		let danxuan = document.querySelectorAll("#group1_zhangzhitao > form > div:nth-child(1) > div > div > div > div");
		if (danxuan) {
			for (var i = 0; i < danxuan.length; i++) {
				let tm = danxuan[i].querySelector("label").innerText;
				let nn = tm.search("、") + 1;
				tm = tm.slice(nn);
				msg("单选题目:" + tm);
				let options = danxuan[i].querySelector("div").innerText;
				let da = search_answer(test_list, tm);
				if (!da) {
					let temp = {
						'exam_id': exam_id,
						'type': 1,
						"title": tm,
						'options': options,
						"status": 1,
						"keywords": '',
					}
					test_add.push(temp);
					if (useAllTest == true) {
						let da1 = search_answer(test_AllList, tm);
						da = da1;
					}
				};

				msg("单选答案:" + da);
				if (da) {
					let xx = danxuan[i].querySelectorAll("div.grid-content > label"); //选项
					for (var j = 0; j < xx.length; j++) {
						if (da == xx[j].innerText) { //防止出现字符串包含情况：da.search(xx[j].innerText) != -1
							msg("答案选择:" + xx[j].innerText);
							xx[j].click();
							await sleep(500);
						};
					};
				} else {
					let xx = danxuan[i].querySelectorAll("div.grid-content > label");
					msg("该题未找到正确答案，将默认选择第一个选项", 1);
					xx[0].click();
					await sleep(500);
				};
				await delay();
			};
		};
	}

	async function duoxuanti() {
		let duoxuan = document.querySelectorAll("#group1_zhangzhitao > form > div:nth-child(2) > div > div > div > div");
		if (duoxuan) {
			for (var i = 0; i < duoxuan.length; i++) {
				let tm = duoxuan[i].querySelector("label.title").innerText;
				let nn = tm.search("、") + 1;
				tm = tm.slice(nn);
				msg("多选题目：" + tm);
				let options = duoxuan[i].querySelector("div").innerText;
				let da = search_answer(test_list, tm);
				msg("多选答案：" + da);
				if (!da) {
					let temp = {
						'exam_id': exam_id,
						'type': 2,
						"title": tm,
						'options': options,
						"status": 1,
						"keywords": '',
					}
					test_add.push(temp);
					if (useAllTest == true) {
						let da1 = search_answer(test_AllList, tm);
						da = da1;
					}
				};
				if (da) {
					let xx = duoxuan[i].querySelectorAll("div.grid-content > label"); //选项
					for (var j = 0; j < xx.length; j++) {
						if (da.search(xx[j].innerText) != -1) {
							console.log("答案选择：" + xx[j].innerText);
							xx[j].click();
							await sleep(500);
						};
					};
				} else {
					let xx = duoxuan[i].querySelectorAll("div.grid-content > label"); //选项
					msg("该题未找到正确答案，将默认选择第一个选项", 1);
					xx[0].click();
					await sleep(500);
				};
				await delay();
			};
		};
	}


	async function panduanti() {
		let panduan = document.querySelectorAll("#group1_zhangzhitao > form > div:nth-child(3) > div > div > div > div");
		if (panduan) {
			for (var i = 0; i < panduan.length; i++) {
				let tm = panduan[i].querySelector("label.title").innerText;
				let nn = tm.search("、") + 1;
				tm = tm.slice(nn);
				msg("判断题目：" + tm);
				let options = panduan[i].querySelector("div").innerText;
				let da = search_answer(test_list, tm);
				msg("判断答案：" + da);
				if (!da) {
					let temp = {
						'exam_id': exam_id,
						'type': 3,
						"title": tm,
						'options': options,
						"status": 1,
						"keywords": '',
					}
					test_add.push(temp);
					if (useAllTest == true) {
						let da1 = search_answer(test_AllList, tm);
						da = da1;
					}
				};
				if (da) {
					let xx = panduan[i].querySelectorAll("div.grid-content > label"); //选项
					for (var j = 0; j < xx.length; j++) {
						if (da.search(xx[j].innerText) != -1) {
							xx[j].click();
							msg("答案选择：" + xx[j].innerText);
							await sleep(500);
						};
					};
				} else {
					let xx = panduan[i].querySelectorAll("div.grid-content > label"); //选项
					msg("该题未找到正确答案，将默认选择第一个选项", 1);
					xx[0].click();
					await sleep(500);
				};
				await delay();
			};
		};
	}

	//填空题
	async function tiankongti() {
		var mevent = new Event('input', {
			bubbles: true
		});
		let tiankong = document.querySelectorAll("#group1_zhangzhitao > form > div:nth-child(4) > div > div > div > div");
		if (tiankong) {
			for (var i = 0; i < tiankong.length; i++) {
				let tm = tiankong[i].querySelector("div > div.el-col.el-col-24 > span:nth-child(2) > span.font_style_line").innerText + tiankong[i].querySelector("div > div.el-col.el-col-24 > span:nth-child(3) > span.font_style_line").innerText;
				//let nn=tm.search("、")+1;
				//tm=tm.slice(nn);
				msg("判断题目：" + tm);
				//let options=tiankong[i].querySelector("div:nth-child(5) > span:nth-child(2)").innerText;
				let da = search_answer(test_list, tm);
				msg("判断答案：" + da);
				if (!da) {
					let temp = {
						'exam_id': exam_id,
						'type': 3,
						"title": tm,
						"status": 1,
						"keywords": '',
					}
					test_add.push(temp);
					if (useAllTest == true) {
						let da1 = search_answer(test_AllList, tm);
						da = da1;
					}
				};
				if (da) {
					let xx = tiankong[i].querySelector("div > div.el-col.el-col-24 > span:nth-child(2) > span.fillSpan > div > input"); //选项
					xx.setAttribute("value", da);
					xx.dispatchEvent(mevent);
					//xx.click();
					//xx.value=da;
					await sleep(500);
					// for (var j = 0; j < xx.length; j++) {
					// 	if (da.search(xx[j].innerText) != -1) {
					// 		xx[j].click();
					// 		msg("答案选择："+xx[j].innerText);
					// 		await sleep(500);
					// 	};
					// };
				} else {
					msg("该题未找到正确答案", 1);
					await sleep(500);
				};
				await delay();
			};
		};
	}

	//提取答案
	async function tiqudaan() {
		var tkda = [];
		let danxuan = document.querySelectorAll("#group1_zhangzhitao > form > div:nth-child(1) > div > div > div > div");
		if (danxuan) {
			for (var i = 0; i < danxuan.length; i++) {
				let tm = danxuan[i].querySelector("label").innerText;
				let mm = tm.search("、") + 1;
				tm = tm.slice(mm);
				let options = danxuan[i].querySelector("div").innerText;
				let da = danxuan[i].querySelector("label.el-radio.item-choise-green").innerText;
				let a = {
					'exam_id': exam_id,
					'title': tm,
					'keywords': '',
					'options': options,
					'answer': da,
					'type': 1,
					'status': 1,
					'createtime': Math.ceil((new Date().getTime()) / 1000),
					'updatetime': Math.ceil((new Date().getTime()) / 1000),
				};
				tkda.push(a);
			};

		};
		let duoxuan = document.querySelectorAll("#group1_zhangzhitao > form > div:nth-child(2) > div > div > div > div");
		if (duoxuan) {
			for (var k = 0; k < duoxuan.length; k++) {
				let tm = duoxuan[k].querySelector("label.title").innerText;
				let nn = tm.search("、") + 1;
				tm = tm.slice(nn);
				let options = duoxuan[k].querySelector("div").innerText;
				let xx = duoxuan[k].querySelectorAll("label.el-checkbox.item-choise-green");
				let da = "";
				if (xx) {
					for (var j = 0; j < xx.length; j++) {
						da = da + xx[j].innerText;
					};
				};
				let b = {
					'exam_id': exam_id,
					'title': tm,
					'keywords': '',
					'options': options,
					'answer': da,
					'type': 2,
					'status': 1,
					'createtime': Math.ceil((new Date().getTime()) / 1000),
					'updatetime': Math.ceil((new Date().getTime()) / 1000),
				}
				tkda.push(b);
			};
		};
		let panduan = document.querySelectorAll("#group1_zhangzhitao > form > div:nth-child(3) > div > div > div > div");
		if (panduan) {
			for (var m = 0; m < panduan.length; m++) {
				let tm = panduan[m].querySelector("label.title").innerText;
				let jj = tm.search("、") + 1;
				tm = tm.slice(jj);
				let options = panduan[m].querySelector("div").innerText;
				let da = panduan[m].querySelector("label.el-radio.item-choise-green").innerText;
				let c = {
					'exam_id': exam_id,
					'title': tm,
					'keywords': '',
					'options': options,
					'answer': da,
					'type': 3,
					'status': 1,
					'createtime': Math.ceil((new Date().getTime()) / 1000),
					'updatetime': Math.ceil((new Date().getTime()) / 1000),
				};
				tkda.push(c);
			};
		};

		let tiankong = document.querySelectorAll("#group1_zhangzhitao > form > div.el-form-item.is-error.is-required > div > div:nth-child(1) > div > div");
		if (tiankong) {
			for (var n = 0; n < tiankong.length; n++) {
				let tm = tiankong[n].querySelector("span.font_style_line").innerText + tiankong[n].querySelector("span:nth-child(3) >span.font_style_line").innerText;
				//let jj=tm.search("、")+1;
				//tm=tm.slice(jj);
				let options = tiankong[n].querySelector("div:nth-child(5) > span:nth-child(2)").innerText;
				let da = tiankong[n].querySelector("div:nth-child(4) > span:nth-child(2)").innerText;
				let d = {
					'exam_id': exam_id,
					'title': tm,
					'keywords': '',
					'options': options,
					'answer': da,
					'type': 4,
					'status': 1,
					'createtime': Math.ceil((new Date().getTime()) / 1000),
					'updatetime': Math.ceil((new Date().getTime()) / 1000),
				};
				tkda.push(d);
			};
		};

		if (tkda.length != 0) {
			console.log("^^^^^^^^^^^^^^^^^题库信息采集^^^^^^^^^^^^^^^^^")
			let abc = JSON.stringify(tkda);
			console.log(abc);
			console.log("^^^^^^^^^^^^^^^^^题库信息采集^^^^^^^^^^^^^^^^^")
		}
		return eval(tkda);
	}

	// 加菜单====================================================================
	function addStyle(cssText) {
		let a = document.createElement('style');
		a.textContent = cssText;
		let doc = document.head || document.documentElement;
		doc.appendChild(a);
	}

	function GMgetValue(name, defaultValue) {
		return GM_getValue(name, defaultValue)
	}

	function GMsetValue(name, value) {
		GM_setValue(name, value)
	}

	//提示信息格式化：tp=0调试信息，tp=1程序正常输出信息
	function msg(content, tp = 0) {
		let day2 = new Date();
		let time1 = day2.getTime();
		let log_time = format_time(time1);
		if (debug == true || tp == 1) {
			console.log(">>>>>>>>>>>>> " + log_time + ": " + content);
		}
	}

	//时间格式化，输出：11:02:02
	function format_time(t) {
		let dd = new Date(t);
		let hours = "00" + dd.getHours();
		let minutes = "00" + dd.getMinutes();
		let seconds = "00" + dd.getSeconds();
		return hours.slice(-2) + ":" + minutes.slice(-2) + ":" + seconds.slice(-2);
	}

	//时间随机函数
	function suiji(start, end) {
		return Math.round(Math.random() * (end - start) + start);
	}

	function sleep(ms) {
		//console.log(timers)
		timers.map(timer => {
			clearTimeout(timer)
		})
		timers = []
		return new Promise((resolve) => {
			var timer = setTimeout(resolve, ms)
			//console.log(timers)
		});
	}

	//题目之间间隔时间
	async function delay() {
		await sleep((Math.random() * 5 + 1) * 1000);
	}

	/**
	 * 主界面 组件
	 */
	const comMain = {
		template: `<div id="crackVIPSet" ref="crackVIPSet" :style="styleTop">
		<div id="nav">
		<button >☑</button>
		</div>
		<div id="list">
		<div style="position:relative;top:0px;">
		<b v-for="(key,index) in Object.keys(settings)" :key="index">
		<label>
		<input v-model="settings[key].value" @change="changeSetting(key)" type="checkbox">
		<span>{{settings[key].name}}</span>
		</label>
		</b>
		</div>
		</div>
		</div>`,
		data() {
			return {
				settings: settings,
				nav: 'settings',
				topOffset: 50,
			}
		},
		components: {},
		methods: {
			changeSetting(name) {
				GMsetValue("Settings", this.settings);
				if (name == 'autoAnswer') {
					msg('settings.autoAnswer：' + settings.autoAnswer.value);
					doAnswer();
				} else if (name == 'creteExam') {
					msg('settings.creteExam:' + settings.creteExam.value);
					add_Exam();
				} else if (name == 'createTest') {
					msg('settings.createTest:' + settings.createTest.value);
					add_Test();
				} else if (name == 'autoSubmit') {
					msg('settings.autoSubmit:' + settings.autoSubmit.value);
				} else if (name == 'tiquTest') {
					msg('settings.tiquTest:' + settings.tiquTest.value);
					tiqu_Test();
				} else if (name == 'tiaoshi') {
					msg('settings.tiaoshi:' + settings.tiaoshi.value);
					tiaoshi();
				}
			},
		},
		computed: {
			styleTop() {
				return `top:${this.topOffset}px;`;
			}
		},
		mounted: function () {}
	};
	/**
	 * 主界面 CSS
	 */
	addStyle(`
		body{padding:0;margin:0}
		/*
		#crackVIPSet input[type=checkbox], input[type=checkbox]{display:none}
		#crackVIPSet input[type=checkbox] + span:before,input[type=checkbox] + span:before{content:'☒';margin-right:5px}
		#crackVIPSet input[type=checkbox]:checked + span:before, input[type=checkbox]:checked + span:before{content:'☑';margin-right:5px}
		*/
		#crackVIPSet{z-index:999999;position:fixed;display:grid;grid-template-columns:30px 150px;width:30px;height:150px;overflow:hidden;padding:5px 0 5px 0;opacity:0.4;font-size:12px}
		#crackVIPSet button{cursor:pointer}
		#crackVIPSet:hover{width:180px;height:450px;padding:5px 5px 5px 0;opacity:1}
		#crackVIPSet #nav {display:grid;grid-auto-rows:50px 50px 200px;grid-row-gap:5px}
		#crackVIPSet #nav [name=startStudy]:active{cursor:move}
		#crackVIPSet #nav button{background:yellow;color:red;font-size:20px;padding:0;border:0;cursor:pointer;border-radius:0 5px 5px 0}
		#crackVIPSet #list{overflow:auto;margin-left:2px}
		#crackVIPSet #list b{display:block;cursor:pointer;color:#3a3a3a;font-weight:normal;font-size:14px;padding:5px;background-color:#ffff00cc;border-bottom:1px dashed #3a3a3a}
		#crackVIPSet #list b:before{content:attr(data-icon);padding-right:5px}
		#crackVIPSet #list b:first-child{border-radius:5px 5px 0 0}
		#crackVIPSet #list b:last-child{border-radius:0 0 5px 5px}
		#crackVIPSet #list b:hover{background-color:#3a3a3a;color:white}
		`);
	Vue.prototype.$tele = new Vue();
	let crackApp = document.createElement("div");
	crackApp.id = "crackVIPSet";
	document.body.appendChild(crackApp);
	new Vue({
		el: "#crackVIPSet",
		render: h => h(comMain)
	});

	// Your code here...
})();