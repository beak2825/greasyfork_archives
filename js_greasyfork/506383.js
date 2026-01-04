// ==UserScript==
// @name         笔记内容质量正式脚本-做答案
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  笔记内容质量
// @author       Nex
// @match        *
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/506383/%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%E8%B4%A8%E9%87%8F%E6%AD%A3%E5%BC%8F%E8%84%9A%E6%9C%AC-%E5%81%9A%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/506383/%E7%AC%94%E8%AE%B0%E5%86%85%E5%AE%B9%E8%B4%A8%E9%87%8F%E6%AD%A3%E5%BC%8F%E8%84%9A%E6%9C%AC-%E5%81%9A%E7%AD%94%E6%A1%88.meta.js
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
				
				<br>
				<button class="button zdy" id='btn09' >查询一次</button>
				<button class="button zdy" id='btn10' >下一题</button>
				<br>
				<button class="button zdy" id='btn40' >-1-抓取错误</button>
				<button class="button zdy" id='btn41' >-1-抓取失败</button>

				<button class="button zdy" id='btn36' >-1-列表页</button>
				<button class="button zdy" id='btn37' >-1-空白页</button>
				<button class="button zdy" id='btn38' >-1-验证页</button>
				<button class="button zdy" id='btn39' >-1-乱码</button>
				<button class="button zdy" id='btn26' >-1-其他</button>
				<button class="button zdy" id='btn44' >-1-正文&ocr</button>
				<br>
				<button class="button zdy" id='btn01' >0文不对题</button>
				<button class="button zdy" id='btn02' >0广告</button>
				<button class="button zdy" id='btn03' >0文本质量差</button>
				<button class="button zdy" id='btn13' >0死 链</button>
				
				<button class="button zdy" id='btn11' >0</button>
				
				<button class="button zdy" id='btn14' >0多图质量差</button>
				<button class="button zdy" id='btn15' >0图片质量差-单图类</button>
				<button class="button zdy" id='btn16' >0封图质量差-视频</button>
				<button class="button zdy" id='btn17' >0图片不相关-单图类</button>
				<button class="button zdy" id='btn18' >0图片不相关-多图类</button>
				<button class="button zdy" id='btn19' >0封图不相关-视频</button>
				<br>
				<button class="button zdy" id='btn04' >1文不对题</button>
				<button class="button zdy" id='btn05' >1广告</button>
				<button class="button zdy" id='btn06' >1文本质量差</button>
				<button class="button zdy" id='btn12' >1</button>
				
				<button class="button zdy" id='btn20' >1多图质量差</button>
				<button class="button zdy" id='btn21' >1图片质量差-单图类</button>
				<button class="button zdy" id='btn22' >1封图质量差-视频</button>
				<button class="button zdy" id='btn23' >1图片不相关-单图类</button>
				<button class="button zdy" id='btn24' >1图片不相关-多图类</button>
				<button class="button zdy" id='btn25' >1封图不相关-视频</button>
				<br>
				<button class="button zdy" id='btn07' >2正常情况</button>
				
				<button class="button zdy" id='btn27' >2文不对题</button>
				<button class="button zdy" id='btn28' >2广告</button>
				<button class="button zdy" id='btn29' >2文本质量差</button>
				<button class="button zdy" id='btn30' >2多图质量差</button>
				<button class="button zdy" id='btn31' >2图片质量差-单图类</button>
				<button class="button zdy" id='btn32' >2封图质量差-视频</button>
				<button class="button zdy" id='btn33' >2图片不相关-单图类</button>
				<button class="button zdy" id='btn34' >2图片不相关-多图类</button>
				<button class="button zdy" id='btn35' >2封图不相关-视频</button>
				<button class="button zdy" id='btn42' >2依赖图片获取主要内容</button>
				
				<br>
				<button class="button zdy" id='btn08' >3完美情况</button>
				<button class="button zdy" id='btn43' >3依赖图片获</button>
				<button class="button zdy" id='btn99' >链接</button>

			   	`);


		$(".zdy").width(80)
		$(".zdy").height(45)
		$(".zdy").css("outline", "1px solid #000")

		setTimeout(() => {
			find();
		}, 400)

		setTimeout(() => {
			//location.reload();
		}, 45000)
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
						$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')")
							.eq(0)
							.click()
						setTimeout(() => {
							$('.ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains("' +
								data01
								.remark + '")').eq(0).click()
						}, 300)
					}
					if (data01.score === "1") {
						$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')")
							.eq(1)
							.click()
						setTimeout(() => {
							$('.ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains("' +
								data01
								.remark + '")').eq(0).click()
						}, 300)
					}
					if (data01.score === "2") {
						$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')")
							.eq(0)
							.click()
						setTimeout(() => {
							$('.ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains("' +
								data01
								.remark + '")').eq(0).click()
						}, 300)
					}
					if (data01.score === "3") {
						$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('3')")
							.eq(0)
							.click()
					}
					if (data01.score === "-1") {
						$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('-1')")
							.eq(0)
							.click()
						setTimeout(() => {
							$('.ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains("' +
								data01
								.remark + '")').eq(0).click()
						}, 300)
					}


					setTimeout(() => {
						//$("#btn10").click()
					}, 2000)
				}
			});
		}
		
		$("#btn99").click(() => {
			
			console.log($('a:contains("点击跳转")').eq(0))
		})
		
		// id='btn01' >0文不对题
		$("#btn01").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "文不对题";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('文不对题')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
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

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('广 告')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
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

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('死 链')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn03' >0文本质量差
		$("#btn03").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "文本质量差";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('文本质量差')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				//$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
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
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')")
				.eq(1)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('文不对题')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
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

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')")
				.eq(1)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('广 告')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// id='btn06' >1文本质量差
		$("#btn06").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "文本质量差";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')")
				.eq(1)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('文本质量差')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
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
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()

			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
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
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('3')").eq(0)
				.click()

			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
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
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()

			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
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
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(1)
				.click()

			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// <button class="button zdy" id='btn14' >0图片质量差-多图类</button>
		$("#btn14").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "图片质量差-多图类";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片质量差-多图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// <button class="button zdy" id='btn15' >0图片质量差-单图类</button>
		$("#btn15").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "图片质量差-单图类";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片质量差-单图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})


		// <button class="button zdy" id='btn16' >0封图质量差-视频</button>
		$("#btn16").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "封图质量差-视频";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('封图质量差-视频')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// <button class="button zdy" id='btn17' >0图片不相关-单图类</button>
		$("#btn17").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "图片不相关-单图类";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片不相关-单图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// <button class="button zdy" id='btn18' >0图片不相关-多图类</button>
		$("#btn18").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "图片不相关-多图类";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片不相关-多图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn19' >0封图不相关-视频</button>
		$("#btn19").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "封图不相关-视频";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('0')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('封图不相关-视频')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// <button class="button zdy" id='btn20' >1图片质量差-多图类</button>
		$("#btn20").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "图片质量差-多图类";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(1)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片质量差-多图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn21' >1图片质量差-单图类</button>
		$("#btn21").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "图片质量差-单图类";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(1)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片质量差-单图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn22' >1封图质量差-视频</button>
		$("#btn22").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "封图质量差-视频";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(1)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('封图质量差-视频')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn23' >1图片不相关-单图类</button>
		$("#btn23").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "图片不相关-单图类";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(1)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片不相关-单图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn24' >1图片不相关-多图类</button>
		$("#btn24").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "图片不相关-多图类";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(1)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片不相关-多图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn25' >1封图不相关-视频</button>
		$("#btn25").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "封图不相关-视频";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('1')").eq(1)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('封图不相关-视频')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// <button class="button zdy" id='btn26' >-1-其他</button>
		$("#btn26").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "-1";
			remark = "其 他";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('-1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('其 他')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		// <button class="button zdy" id='btn36' >-1-列表页</button>
		$("#btn36").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "-1";
			remark = "列表页";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('-1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('列表页')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn37' >-1-空白页</button>
		$("#btn37").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "-1";
			remark = "空白页";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('-1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('空白页')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn38' >-1-验证页</button>
		$("#btn38").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "-1";
			remark = "验证页";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('-1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('验证页')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn39' >-1-乱码</button>
		$("#btn39").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "-1";
			remark = "乱 码";
			save();

			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('-1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('乱 码')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		
		// <button class="button zdy" id='btn40' >-1-抓取错误</button>
		$("#btn40").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "-1";
			remark = "抓取错误";
			save();
		
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('-1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('抓取错误')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		
		// <button class="button zdy" id='btn41' >-1-抓取失败</button>
		$("#btn41").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "-1";
			remark = "抓取失败";
			save();
		
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('-1')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('抓取失败')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		
			// <button class="button zdy" id='btn44' >-1-正文&ocr与落地页不一致</button>
			$("#btn44").click(() => {
				clearBaseInfo();
				getBaseInfo();
				score = "-1";
				remark = "正文&ocr与落地页不一致";
				save();
			
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('-1')").eq(0)
					.click()
				setTimeout(() => {
					$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('正文&ocr与落地页不一致')")
						.eq(0).click()
				}, 300)
				setTimeout(() => {
					$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
				}, 1000)
				setTimeout(() => {
					location.reload();
				}, 2000)
			})

		// <button class="button zdy" id='btn27' >2文不对题</button>
		$("#btn27").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "文不对题";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('文不对题')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn28' >2广告</button>
		$("#btn28").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "广 告";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('广 告')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn29' >2文本质量差</button>
		$("#btn29").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "文本质量差";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('文本质量差')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn30' >2图片质量差-多图类</button>
		$("#btn30").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "图片质量差-多图类";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片质量差-多图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn31' >2图片质量差-单图类</button>
		$("#btn31").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "图片质量差-单图类";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片质量差-单图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn32' >2封图质量差-视频</button>
		$("#btn32").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "封图质量差-视频";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('封图质量差-视频')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn33' >2图片不相关-单图类</button>
		$("#btn33").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "图片不相关-单图类";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片不相关-单图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn34' >2图片不相关-多图类</button>
		$("#btn34").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "图片不相关-多图类";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('图片不相关-多图类')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn35' >2封图不相关-视频</button>
		$("#btn35").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "封图不相关-视频";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('封图不相关-视频')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn42' >2依赖图片获取主要内容信息</button>
		$("#btn42").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			remark = "依赖图片获取主要内容信息";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('2')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('依赖图片获取主要内容信息')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 1000)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})
		// <button class="button zdy" id='btn43' >3依赖图片获取主要内容信息</button>
		$("#btn43").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "3";
			remark = "依赖图片获取主要内容信息";
			save();
			$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('3')").eq(0)
				.click()
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-default.ant-btn-sm.tag-button:contains('依赖图片获取主要内容信息')")
					.eq(0).click()
			}, 300)
			setTimeout(() => {
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
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
				$(".ant-btn.css-1x0dypw.ant-btn-sm:contains('下一题')").eq(0).click()
			}, 200)
			setTimeout(() => {
				location.reload();
			}, 2000)
		})

		//设置提醒时间
		// setInterval(()=>{
		// 	t++;
		// 	$(".xl-text-content-item-label").html("本题做题时间统计:" + t + "秒")
		// },1000)
	}, 1000)




	//这里不能写


})()