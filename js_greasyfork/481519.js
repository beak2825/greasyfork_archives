// ==UserScript==
// @name         1207query_title恶劣正式标注版抄包
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  1127query_title恶劣正式标注版
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/481519/1207query_title%E6%81%B6%E5%8A%A3%E6%AD%A3%E5%BC%8F%E6%A0%87%E6%B3%A8%E7%89%88%E6%8A%84%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/481519/1207query_title%E6%81%B6%E5%8A%A3%E6%AD%A3%E5%BC%8F%E6%A0%87%E6%B3%A8%E7%89%88%E6%8A%84%E5%8C%85.meta.js
// ==/UserScript==

(function() {
	'use strict';

	setTimeout(() => {
		var query;
		var score;
		var count;
		var queryNum; //题目编号
		var porn = -1; //色情  默认为-1  表示不为色情
		var respondent = "Nex";
		var date;
		var data;
		$('.question_card___2lZG6').eq(0).append(`<br>
		<button id='btn011'>查询本题</button>
		<button id='btn012'>不恶劣</button>
		<button id='btn013'>恶劣</button>
		<button id='btn014'>普通抛弃</button>
		<button id='btn015'>色情抛弃</button>
		<button id='btnFindAll'>一键查询</button>
		<button id='commit'>提交下一题</button>
		`);
		$('.question_card___2lZG6').eq(1).append(`<br>
		<button id='btn021'>查询本题</button>
		<button id='btn022'>不恶劣</button>
		<button id='btn023'>恶劣</button>
		<button id='btn024'>普通抛弃</button>
		<button id='btn025'>色情抛弃</button>
		`);
		$('.question_card___2lZG6').eq(2).append(`<br>
		<button id='btn031'>查询本题</button>
		<button id='btn032'>不恶劣</button>
		<button id='btn033'>恶劣</button>
		<button id='btn034'>普通抛弃</button>
		<button id='btn035'>色情抛弃</button>
		`);
		$('.question_card___2lZG6').eq(3).append(`<br>
		<button id='btn041'>查询本题</button>
		<button id='btn042'>不恶劣</button>
		<button id='btn043'>恶劣</button>
		<button id='btn044'>普通抛弃</button>
		<button id='btn045'>色情抛弃</button>
		`);
		$('.question_card___2lZG6').eq(4).append(`<br>
		<button id='btn051'>查询本题</button>
		<button id='btn052'>不恶劣</button>
		<button id='btn053'>恶劣</button>
		<button id='btn054'>普通抛弃</button>
		<button id='btn055'>色情抛弃</button>
		`);
		$('.question_card___2lZG6').eq(5).append(`<br>
		<button id='btn061'>查询本题</button>
		<button id='btn062'>不恶劣</button>
		<button id='btn063'>恶劣</button>
		<button id='btn064'>普通抛弃</button>
		<button id='btn065'>色情抛弃</button>
		`);
		$('.question_card___2lZG6').eq(6).append(`<br>
		<button id='btn071'>查询本题</button>
		<button id='btn072'>不恶劣</button>
		<button id='btn073'>恶劣</button>
		<button id='btn074'>普通抛弃</button>
		<button id='btn075'>色情抛弃</button>
		`);
		$('.question_card___2lZG6').eq(7).append(`<br>
		<button id='btn081'>查询本题</button>
		<button id='btn082'>不恶劣</button>
		<button id='btn083'>恶劣</button>
		<button id='btn084'>普通抛弃</button>
		<button id='btn085'>色情抛弃</button>
		`);
		$('.question_card___2lZG6').eq(8).append(`<br>
		<button id='btn091'>查询本题</button>
		<button id='btn092'>不恶劣</button>
		<button id='btn093'>恶劣</button>
		<button id='btn094'>普通抛弃</button>
		<button id='btn095'>色情抛弃</button>
		`);
		$('.question_card___2lZG6').eq(9).append(`<br>
		<button id='btn101'>查询本题</button>
		<button id='btn102'>不恶劣</button>
		<button id='btn103'>恶劣</button>
		<button id='btn104'>普通抛弃</button>
		<button id='btn105'>色情抛弃</button>
		`);

		Date.prototype.Format = function(fmt) {
			var o = {
				"M+": this.getMonth() + 1, //月份
				"d+": this.getDate(), //日
				"H+": this.getHours(), //小时
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

		/**
		 * 不恶劣情况
		 */
		//第1题
		$("#btn012").click(() => {
			queryNum = 1;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第2题
		$("#btn022").click(() => {
			queryNum = 2;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第3题
		$("#btn032").click(() => {
			queryNum = 3;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第4题
		$("#btn042").click(() => {
			queryNum = 4;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第5题
		$("#btn052").click(() => {
			queryNum = 5;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第6题
		$("#btn062").click(() => {
			queryNum = 6;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第7题
		$("#btn072").click(() => {
			queryNum = 7;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第8题
		$("#btn082").click(() => {
			queryNum = 8;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第9题
		$("#btn092").click(() => {
			queryNum = 9;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第10题
		$("#btn102").click(() => {
			queryNum = 10;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=1&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})




		/**
		 * 恶劣情况
		 */
		//第1题
		$("#btn013").click(() => {
			queryNum = 1;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第2题
		$("#btn023").click(() => {
			queryNum = 2;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第3题
		$("#btn033").click(() => {
			queryNum = 3;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第4题
		$("#btn043").click(() => {
			queryNum = 4;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第5题
		$("#btn053").click(() => {
			queryNum = 5;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第6题
		$("#btn063").click(() => {
			queryNum = 6;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第7题
		$("#btn073").click(() => {
			queryNum = 7;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第8题
		$("#btn083").click(() => {
			queryNum = 8;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第9题
		$("#btn093").click(() => {
			queryNum = 9;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第10题
		$("#btn103").click(() => {
			queryNum = 10;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=2&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})







		/**
		 * 普通抛弃情况
		 */
		//第1题
		$("#btn014").click(() => {
			queryNum = 1;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第2题
		$("#btn024").click(() => {
			queryNum = 2;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第3题
		$("#btn034").click(() => {
			queryNum = 3;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第4题
		$("#btn044").click(() => {
			queryNum = 4;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第5题
		$("#btn054").click(() => {
			queryNum = 5;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第6题
		$("#btn064").click(() => {
			queryNum = 6;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第7题
		$("#btn074").click(() => {
			queryNum = 7;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第8题
		$("#btn084").click(() => {
			queryNum = 8;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第9题
		$("#btn094").click(() => {
			queryNum = 9;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})
		//第10题
		$("#btn104").click(() => {
			queryNum = 10;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=3&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 4).click();
			}, 200)
		})




		/**
		 * 色情抛弃情况
		 */
		//第1题
		$("#btn015").click(() => {
			queryNum = 1;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})
		//第2题
		$("#btn025").click(() => {
			queryNum = 2;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})
		//第3题
		$("#btn035").click(() => {
			queryNum = 3;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})
		//第4题
		$("#btn045").click(() => {
			queryNum = 4;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})
		//第5题
		$("#btn055").click(() => {
			queryNum = 5;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})
		//第6题
		$("#btn065").click(() => {
			queryNum = 6;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})
		//第7题
		$("#btn075").click(() => {
			queryNum = 7;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})
		//第8题
		$("#btn085").click(() => {
			queryNum = 8;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})
		//第9题
		$("#btn095").click(() => {
			queryNum = 9;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})
		//第10题
		$("#btn105").click(() => {
			queryNum = 10;
			date = new Date().Format("yyyy-MM-dd HH:mm:ss");
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/insert',
				nocache: true,
				data: `query=${query}&score=4&porn=1&date=${date}&respondent=${respondent}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
			setTimeout(() => {
				$('.ant-radio-input').eq((queryNum - 1) * 5 + 3).click();
			}, 200)
		})



		/**
		 * 查询
		 */
		//第1题
		$("#btn011").click(() => {
			queryNum = 1;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})
		//第2题
		$("#btn021").click(() => {
			queryNum = 2;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})
		//第3题
		$("#btn031").click(() => {
			queryNum = 3;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})
		//第4题
		$("#btn041").click(() => {
			queryNum = 4;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})
		//第5题
		$("#btn051").click(() => {
			queryNum = 5;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})
		//第6题
		$("#btn061").click(() => {
			queryNum = 6;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})
		//第7题
		$("#btn071").click(() => {
			queryNum = 7;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})
		//第8题
		$("#btn081").click(() => {
			queryNum = 8;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})
		//第9题
		$("#btn091").click(() => {
			queryNum = 9;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})
		//第10题
		$("#btn101").click(() => {
			queryNum = 10;
			query = $(".title_key___T6Yvm").eq((queryNum - 1) * 4).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 1).html() + $(
				".title_key___T6Yvm").eq((queryNum - 1) * 4 + 2).html()
			console.log(query)
			query = md5(query);
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8893/find',
				nocache: true,
				responseType: "json",
				data: `query=${query}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(res) {
					console.log(res.response.res)
					data = JSON.parse(res.response.res)
					console.log()
					if (data.score == 1) {
						$('.ant-radio-input').eq((queryNum - 1) * 5).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 2) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 1).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 3) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 4)
								.click();
						}, 200)
					}
					if (data.score == 4) {
						$('.ant-radio-input').eq((queryNum - 1) * 5 + 2).click();
						setTimeout(() => {
							$('.ant-radio-input').eq((queryNum - 1) * 5 + 3)
								.click();
						}, 200)
					}
				}
			});
		})



		setInterval(() => {
			$("#btnFindAll").click()
		}, (Math.floor(Math.random() * 5 + 5) + Math.ceil(Math.random() * 10) /
			10) * 1000 * 7)



		//一键查询
		$("#btnFindAll").click(function() {
			$("#btn011").click();
			setTimeout(() => {
				$("#btn021").click();
			}, 1000)
			setTimeout(() => {
				$("#btn031").click();
			}, 3000)
			setTimeout(() => {
				$("#btn041").click();
			}, 5000)
			setTimeout(() => {
				$("#btn051").click();
			}, 7000)
			setTimeout(() => {
				$("#btn061").click();
			}, 9000)
			setTimeout(() => {
				$("#btn071").click();
			}, 11000)
			setTimeout(() => {
				$("#btn081").click();
			}, 13000)
			setTimeout(() => {
				$("#btn091").click();
			}, 15000)
			setTimeout(() => {
				$("#btn101").click();
			}, 17000)


			setTimeout(() => {
				$(".ant-btn.ant-btn-primary").click()
			}, 25000)
		})


		$(document).keydown((event) => {
			//空格
			if (event.keyCode === 32) {
				$(".ant-btn.ant-btn-primary").click();
			}
		})

		$(".ant-btn.ant-btn-primary").click(() => {
			setTimeout(() => {
				location.reload();
			}, 1000)

		})


		$("#commit").click(() => {
			$(".ant-btn.ant-btn-primary").click();
		})

		//query
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(0).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(0).text();
			window.open(url, '_blank');
		})
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(1).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(1).text();
			window.open(url, '_blank');
		})
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(2).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(2).text();
			window.open(url, '_blank');
		})
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(3).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(3).text();
			window.open(url, '_blank');
		})
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(4).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(4).text();
			window.open(url, '_blank');
		})
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(5).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(5).text();
			window.open(url, '_blank');
		})
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(6).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(6).text();
			window.open(url, '_blank');
		})
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(7).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(7).text();
			window.open(url, '_blank');
		})
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(8).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(8).text();
			window.open(url, '_blank');
		})
		$(".ant-col.ant-col-21.title_key___T6Yvm").eq(9).click(() => {
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + $(
				".ant-col.ant-col-21.title_key___T6Yvm").eq(9).text();
			window.open(url, '_blank');
		})
		//title
		$(".title_key___T6Yvm").eq(1).click(() => {
			let str = $(".title_key___T6Yvm").eq(1).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})
		$(".title_key___T6Yvm").eq(5).click(() => {
			let str = $(".title_key___T6Yvm").eq(5).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})
		$(".title_key___T6Yvm").eq(9).click(() => {
			let str = $(".title_key___T6Yvm").eq(9).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})
		$(".title_key___T6Yvm").eq(13).click(() => {
			let str = $(".title_key___T6Yvm").eq(13).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})
		$(".title_key___T6Yvm").eq(17).click(() => {
			let str = $(".title_key___T6Yvm").eq(17).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})
		$(".title_key___T6Yvm").eq(21).click(() => {
			let str = $(".title_key___T6Yvm").eq(21).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})
		$(".title_key___T6Yvm").eq(25).click(() => {
			let str = $(".title_key___T6Yvm").eq(25).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})
		$(".title_key___T6Yvm").eq(29).click(() => {
			let str = $(".title_key___T6Yvm").eq(29).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})
		$(".title_key___T6Yvm").eq(33).click(() => {
			let str = $(".title_key___T6Yvm").eq(33).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})
		$(".title_key___T6Yvm").eq(37).click(() => {
			let str = $(".title_key___T6Yvm").eq(37).text();
			str = str.replace(/<em>/g, "");
			str = str.replace(/<\/em>/g, "");
			let url = 'http://discover.sm.cn/2/#/auxiliary/engine_diff?q=' + str;
			window.open(url, '_blank');
		})

	}, 3000)
	//下面不能写代码




})();