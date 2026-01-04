// ==UserScript==
// @name         文档质量重启脚本新平台抄答案版本
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  文档质量
// @author       Nex
// @match        *
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/492670/%E6%96%87%E6%A1%A3%E8%B4%A8%E9%87%8F%E9%87%8D%E5%90%AF%E8%84%9A%E6%9C%AC%E6%96%B0%E5%B9%B3%E5%8F%B0%E6%8A%84%E7%AD%94%E6%A1%88%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/492670/%E6%96%87%E6%A1%A3%E8%B4%A8%E9%87%8F%E9%87%8D%E5%90%AF%E8%84%9A%E6%9C%AC%E6%96%B0%E5%B9%B3%E5%8F%B0%E6%8A%84%E7%AD%94%E6%A1%88%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var url;
	var num;
	var name = "Nex";
	var dateTime;
	var remark;
	var score;
	var t = 0;

	setTimeout(() => {
		$(".xl-tag-info > form > div:last").after(`
				<br>
				<button class="button zdy" id='btn01' >0排版质量</button>
				<button class="button zdy" id='btn02' >0模糊问题</button>
				<button class="button zdy" id='btn03' >0题文不符</button>
				<button class="button zdy" id='btn04' >0首页排版</button>
				<button class="button zdy" id='btn05' >0首页模糊</button>
				<button class="button zdy" id='btn06' >0内容缺失</button>
				<button class="button zdy" id='btn07' >0乱码问题</button>
				<button class="button zdy" id='btn08' >0水印问题</button>
				<button class="button zdy" id='btn09' >0广告问题</button>
				<button class="button zdy" id='btn10' >0采集问题</button>
				<button class="button zdy" id='btn11' >0其他问题</button>
				<br>
				<button class="button zdy" id='btn12' >1排版质量</button>
				<button class="button zdy" id='btn13' >1模糊问题</button>
				<button class="button zdy" id='btn14' >1首页排版</button>
				<button class="button zdy" id='btn15' >1首页模糊</button>
				<button class="button zdy" id='btn16' >1乱码问题</button>
				<button class="button zdy" id='btn17' >1其他问题</button>
				<br>
				<button class="button zdy" id='btn19' >2正常情况</button>
				<button class="button zdy" id='btn20' >3完美情况</button>
				<button class="button zdy" id='btn21' >4废弃情况</button>
			   	`);
		$(".title:contains('文档质量打分')").eq(0).after(`
		<button class="button zdy" id='btn22' >下一题</button>
				<a id="daan">本题答案</a>
				`)

		$(".zdy").width(80)
		$(".zdy").height(35)
		$(".zdy").css("outline", "1px solid #000")

		setTimeout(() => {
			find();
		}, 2000)

		setTimeout(() => {
			location.reload();
		}, 30000)
		/**
		 * 获取基础信息
		 */
		function getBaseInfo() {

			//网址并md5加密
			url = md5($(".xl-text-content-item-text > a").eq(0).attr("href"))
			console.log("网址:" + $(".xl-text-content-item-text > a").eq(0).attr("href"))
			//时间
			dateTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
			console.log("做题时间:" + dateTime)

		}

		/**
		 * 清除基础信息
		 */
		function clearBaseInfo() {
			//序号
			num = "";
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
				url: 'http://121.41.113.195:9017/insert',
				nocache: true,
				data: `url=${url}&num=${num}&score=${score}&name=${name}&remark=${remark}&dateTime=${dateTime}`,
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
				url: 'http://121.41.113.195:9017/find',
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

					if(data01.score === "0"){
						$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
						$('.ant-btn.css-17seli4.ant-btn-sm.tag-button:contains("'+data01.remark+'")').eq(0).click()
						if(data01.remark === "其 他"){
							setTimeout(()=>{
								$(".ant-input.ant-input-sm.css-17seli4").eq(0).val(data01.num)
							},1000)
						}
					}
					if(data01.score === "1"){
						$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('1')").eq(0).click()
						$('.ant-btn.css-17seli4.ant-btn-sm.tag-button:contains("'+data01.remark+'")').eq(0).click()
						if(data01.remark === "其 他"){
							setTimeout(()=>{
								$(".ant-input.ant-input-sm.css-17seli4").eq(0).val(data01.num)
							},1000)
						}
					}
					if(data01.score === "2"){
						$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('2')").eq(0).click()
					}
					if(data01.score === "3"){
						$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('3')").eq(0).click()
					}
					if(data01.score === "废 弃"){
						$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('废 弃')").eq(0).click()
					}

					setTimeout(()=>{
						$("#btn22").click()
					},7000)
				}
			});
		}
		// id='btn01' >0排版质量
		$("#btn01").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "排版质量";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('排版质量')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})

		// id='btn02' >0模糊问题
		$("#btn02").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "模 糊";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('模 糊')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn03' >0题文不符
		$("#btn03").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "题文不符";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('题文不符')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// ant-btn css-17seli4 ant-btn-default ant-btn-sm tag-button
		// id='btn04' >0首页排版
		$("#btn04").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "首页排版";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('首页排版质量')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn05' >0首页模糊
		$("#btn05").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "首页模糊";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('首页模糊')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn06' >0内容缺失
		$("#btn06").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "内容缺失";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('内容缺失')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn07' >0乱码问题
		$("#btn07").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "乱 码";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('乱 码')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn08' >0水印问题
		$("#btn08").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "水 印";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('水 印')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn09' >0广告问题
		$("#btn09").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "广 告";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('广 告')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn10' >0采集问题
		$("#btn10").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "采 集";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('采 集')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn11' >0其他问题
		$("#btn11").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "0";
			remark = "其 他";
			num = $(".ant-input.ant-input-sm.css-17seli4").eq(0).html()
			console.log($(".ant-input.ant-input-sm.css-17seli4").eq(1).html())
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('0')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('其 他')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})

		// id='btn12' >1排版质量
		$("#btn12").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "排版质量";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('1')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('排版质量')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn13' >1模糊问题
		$("#btn13").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "模 糊";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('1')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('模 糊')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn14' >1首页排版
		$("#btn14").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "首页排版";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('1')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('首页排版')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn15' >1首页模糊
		$("#btn15").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "首页模糊";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('1')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('首页模糊')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn16' >1乱码问题
		$("#btn16").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "乱 码";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('1')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('乱 码')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn17' >1其他问题
		$("#btn17").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "1";
			remark = "其 他";
			num = $(".ant-input.ant-input-sm.css-17seli4").eq(0).html()
			console.log($(".ant-input.ant-input-sm.css-17seli4").eq(1).html())
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('1')").eq(0).click()
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('其 他')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})

		// id='btn19' >2正常情况
		$("#btn19").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "2";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('2')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn20' >3完美情况
		$("#btn20").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "3";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('3')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})
		// id='btn21' >4废弃情况
		$("#btn21").click(() => {
			clearBaseInfo();
			getBaseInfo();
			score = "废 弃";
			save();
			$(".ant-btn.css-17seli4.ant-btn-sm.tag-button:contains('废 弃')").eq(0).click()

			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},1000)
			setTimeout(()=>{
				location.reload();
			},2000)
		})

		// id='btn22' >下一题
		$("#btn22").click(() => {
			setTimeout(()=>{
				$(".ant-btn.css-17seli4.ant-btn-sm:contains('下一题')").eq(0).click()
			},200)
			setTimeout(()=>{
				location.reload();
			},1000)
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

		$(document).keydown((event) => {
			if (event.keyCode === 49) {
				//1 排版
				$('#btn12').click();
			}
			if (event.keyCode === 50) {
				//2
				$('#btn19').click();
			}
			if (event.keyCode === 51) {
				//1首页模糊
				$('#btn15').click();
			}
            if (event.keyCode === 192) {
				//1 首页排版
				$('#btn14').click();
			}
            if (event.keyCode === 52) {
				//1  模糊
				$('#btn13').click();
			}
			// if (event.keyCode === 32) {
			// 	//空格    0分
			// 	$('#btn01').click();
			// }

		})


				//设置提醒时间
				setInterval(()=>{
					t++;
					$(".xl-text-content-item-label").html("本题做题时间统计:" + t + "秒")
				},1000)
	}, 1000)




	//这里不能写


})()