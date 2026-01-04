// ==UserScript==
// @name         笔记内容质量考试脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  笔记内容质量
// @author       Nex
// @match        *
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/505823/%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%E8%B4%A8%E9%87%8F%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/505823/%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%E8%B4%A8%E9%87%8F%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var url;
	var name = "Nex";
	var dateTime;
	var remark;
	var score;
	var t = 0;

	setTimeout(() => {
		$(".xl-tag-info > form > div:last").after(`
				<br>
				<button class="button zdy" id='btn01' >0文不对题</button>
				<button class="button zdy" id='btn02' >0广告</button>
				<button class="button zdy" id='btn03' >0图片类问题</button>
				<button class="button zdy" id='btn13' >0死 链</button>
				<button class="button zdy" id='btn11' >0</button>
				<br>
				<button class="button zdy" id='btn04' >1文不对题</button>
				<button class="button zdy" id='btn05' >1广告</button>
				<button class="button zdy" id='btn06' >1图片类问题</button>
				<button class="button zdy" id='btn12' >1</button>
				<br>
				<button class="button zdy" id='btn07' >2正常情况</button>
				<button class="button zdy" id='btn08' >3完美情况</button>
				<br>
				<button class="button zdy" id='btn09' >查询一次</button>
				<button class="button zdy" id='btn10' >下一题</button>
				<br>
			   	`);
		$(".title:contains('文档质量打分')").eq(0).after(`
		<button class="button zdy" id='btn22' >下一题</button>
				<a id="daan">本题答案</a>
				`)

		$(".zdy").width(100)
		$(".zdy").height(50)
		$(".zdy").css("outline", "1px solid #000")

		setTimeout(() => {
			find();
		}, 2000)

		// setTimeout(() => {
		// 	location.reload();
		// }, 30000)
		/**
		 * 获取基础信息
		 */
		function getBaseInfo() {

			//网址并md5加密
			url = md5($("#myIframe").eq(0).attr("src"))
			console.log("网址:" + $("#myIframe").eq(0).attr("src"))
			//时间
			dateTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
			console.log("做题时间:" + dateTime)

		}

		/**
		 * 清除基础信息
		 */
		function clearBaseInfo() {
			//网址
			url = null;
			//时间
			dateTime = null;
			//分数
			score = null;
			//备注
			remark = null;

			$("#daan").html('')
		}

		/**
		 * 保存
		 */
		function save() {
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:9018/insert',
				nocache: true,
				data: `url=${url}&score=${score}&name=${name}&remark=${remark}&dateTime=${dateTime}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
		}

		/**
		 * 查询
		 */
		function find() {
			console.log("查询一次")
			clearBaseInfo();
			getBaseInfo();
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:9018/find',
				nocache: true,
				responseType: "json",
				data: `url=${url}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					let data01 = JSON.parse(res.response.res)
					console.log(data01)
					let str = "本题答案:" + data01.score + ";备注:" + data01.remark +
						";其他备注:" + data01.num + ";做题人:" + data01.name +
						";做题时间:" +
						data01.dateTime;
					$("#daan").html(str)

					if (data01.score === "0") {
						$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('0')")
							.eq(0)
							.click()
						setTimeout(() => {
							$('.ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains("' +
								data01
								.remark + '")').eq(0).click()
						}, 300)
					}
					if (data01.score === "1") {
						$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('1')")
							.eq(0)
							.click()
						setTimeout(() => {
							$('.ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains("' +
								data01
								.remark + '")').eq(0).click()
						}, 300)
					}
					if (data01.score === "2") {
						$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('2')")
							.eq(0)
							.click()
					}
					if (data01.score === "3") {
						$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('3')")
							.eq(0)
							.click()
					}


					setTimeout(() => {
						$("#btn10").click()
					}, 20000)
				}
			});
		}

		// id='btn01' >0文不对题
		$("#btn01").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "文不对题";
			save();
			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('文不对题')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn02' >0广告
		$("#btn02").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "广 告";
			save();

			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('广 告')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		
		// id='btn13' >0死链
		$("#btn13").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "死 链";
			save();
		
			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('死 链')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn03' >0图片类问题
		$("#btn03").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "图片类问题";
			save();

			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('图片类问题')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn04' >1文不对题
		$("#btn04").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "文不对题";
			save();
			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('文不对题')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn05' >1广告
		$("#btn05").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "广 告";
			save();

			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('广 告')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn06' >1图片类问题
		$("#btn06").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "图片类问题";
			save();

			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('图片类问题')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn07' >2
		$("#btn07").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			save();
			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()

			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn08' >3
		$("#btn08").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "3";
			save();
			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('3')").eq(0)
				.click()

			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		
		// id='btn11' >0
		$("#btn11").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			save();
			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
		
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		
		// id='btn12' >1
		$("#btn12").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			save();
			$(".ant-btn.css-1uq9j6g.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(0)
				.click()
		
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn09' >查询一下
		$("#btn09").click(() => {
			find()
		})


		Date.prototype.Format = function(fmt) {
			var o = {
				"M+": this.getMonth() + 1, //月份
				"d+": this.getDate(), //日
				"H+": this.getHours(), //小4时
				"m+": this.getMinutes(), //分
				"s+": this.getSeconds(), //秒
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度
				"S": this.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 -
				RegExp.$1
				.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1
					.length == 1) ? (o[
					k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}

		// $(document).keydown((event) => {
		// 	if (event.keyCode === 49) {
		// 		//1 排版
		// 		$('#btn12').click();
		// 	}
		// 	if (event.keyCode === 50) {
		// 		//2
		// 		$('#btn19').click();
		// 	}
		// 	if (event.keyCode === 51) {
		// 		//1首页模糊
		// 		$('#btn15').click();
		// 	}
		//           if (event.keyCode === 192) {
		// 		//1 首页排版
		// 		$('#btn14').click();
		// 	}
		//           if (event.keyCode === 52) {
		// 		//1  模糊
		// 		$('#btn13').click();
		// 	}
		// 	// if (event.keyCode === 32) {
		// 	// 	//空格    0分
		// 	// 	$('#btn01').click();
		// 	// }

		// })
		// id='btn10' >下一题
		$("#btn10").click(() => {
			setTimeout(() => {
				$(".ant-btn.css-1uq9j6g.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 200)
			setTimeout(() => {
				location.reload();
			}, 1000)
		})

		//设置提醒时间
		// setInterval(()=>{
		// 	t++;
		// 	$(".xl-text-content-item-label").html("本题做题时间统计:" + t + "秒")
		// },1000)
	}, 1000)




	//这里不能写


})()