// ==UserScript==
// @name         AtCoder-Style-Changer
// @namespace    http://github.com/i-708
// @version      1.2.2
// @description  AtCoderのテーマをダークテーマに変更します
// @author       i-708
// @license      MIT
// @match        https://atcoder.jp/*
// @downloadURL https://update.greasyfork.org/scripts/429929/AtCoder-Style-Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/429929/AtCoder-Style-Changer.meta.js
// ==/UserScript==

(function () {
	const baseColor = "#c3c3c3";
	const bgColor = "black";
	const borderColor = "#d10000";

	// 順位表などの設定
	function rankingTableUpdate() {
		$("#btn-reset").css({
			color: baseColor,
			background: bgColor,
		});

		$("#input-affiliation").css({
			color: baseColor,
			background: bgColor,
		});

		$("#input-user").css("cssText", "color: #c3c3c3; background: black");

		$("#select2-standings-select-country-container").css({
			color: baseColor,
			background: bgColor,
			border: "white 1px solid",
		});

		$("#refresh, #auto-refresh").css({
			color: baseColor,
			background: bgColor,
		});

		$("#standings-panel-heading.panel-heading").css({
			color: baseColor,
			background: bgColor,
		});

		$(".btn-text").css({
			color: baseColor,
		});

		$("tr").css({
			color: baseColor,
			background: bgColor,
		});

		$("tr.info td").css({
			color: baseColor,
			background: bgColor,
		});

		$(".standings-score").css({
			color: "#4aabff",
		});

		$(".pagination.pagination-sm.mt-0.mb-1 a").css({
			color: baseColor,
			background: bgColor,
			"border-color": "",
		});

		$("li.active a").css({
			"border-color": borderColor,
		});

		$("td.standings-result.standings-perf").css({
			color: baseColor,
			background: bgColor,
		});

		$("td.standings-result.standings-rate").css({
			color: baseColor,
			background: bgColor,
		});

		$(".standings-ac").css({
			color: "#00e152",
		});

		$(".standings-result p").css({
			color: "#d8d8d8",
		});

		$(".standings-statistics td p,.standings-fa td p").css({
			color: "#d8d8d8",
		});

		$(".sort-th.no-break a").css({
			color: "#d6d6d6",
		});
	}

	// userのカラー設定
	function userColor() {
		$("head").append(
			"<style type='text/css'> .user-blue {color: #0095ff; } </style>"
		);

		$("head").append(
			"<style type='text/css'> .user-unrated {color: white; } </style>"
		);

		$("head").append(
			"<style type='text/css'> .user-brown {color: #b16c28; } </style>"
		);

		$("head").append(
			"<style type='text/css'> .user-green {color: #00ce00; } </style>"
		);

		$("head").append(
			"<style type='text/css'> .user-gray {color: #a9a9a9; } </style>"
		);

		$("head").append(
			"<style type='text/css'> .user-yellow {color: #dede01; } </style>"
		);

		$("head").append(
			"<style type='text/css'> .user-cyan {color: #00f1f1; } </style>"
		);
	}
	// 監視
	function loadObservation() {
		const loadElem = document
			.getElementById("vue-standings")
			.getElementsByClassName("loading-show")[0];
		const loadOptions = { attributes: true };
		const loadObserver = new MutationObserver(() => {
			if (!!document.getElementById("standings-tbody")) {
				rankingTableUpdate();
				standObservation();
				refreshObservation();
			}
		});
		loadObserver.observe(loadElem, loadOptions);
	}

	function standObservation() {
		const standElem = document.getElementById("standings-tbody");
		const standElemOption = {
			childList: true,
			attributes: true,
		};
		if (standElem) {
			const standObserver = new MutationObserver(rankingTableUpdate);
			standObserver.observe(standElem, standElemOption);
		}
	}

	function refreshObservation() {
		const refreshElem = document.getElementById("refresh");
		const refreshElemOptions = {
			attributes: true,
			attributeFilter: ["class"],
		};
		if (refreshElem) {
			const refreshObserver = new MutationObserver((mutationRecord) => {
				const isDisabled =
					mutationRecord[0].target.classList.contains("disabled");
				if (isDisabled) {
					rankingTableUpdate();
				}
			}).observe(refreshElem, refreshElemOptions);
		}
	}
	function resultObservation() {
		const resultElem = document.getElementsByTagName("tbody")[0];
		const resultOptions = {
			childList: true,
			attributes: true,
			subtree: true,
		};
		if (resultElem) {
			const resultObserver = new MutationObserver(rankingTableUpdate).observe(
				resultElem,
				resultOptions
			);
		}
	}

	function init() {
		//全体共通
		$("li.active a").not("ul.dropdown-menu li a").css({
			"border-color": borderColor,
			border: " #d10000 solid 1px",
		});

		// タイマー
		$("#fixed-server-timer").css({
			color: bgColor,
		});

		$("head").append(
			"<style type='text/css'> #header .header-page li.is-active a {color: #c3c3c3 !important; } </style>"
		);

		$("head").append(
			"<style type='text/css'> #header .header-lang li a:hover {color: #c3c3c3 !important; } </style>"
		);

		//ユーザーカラー
		userColor();

		// ユーザページ
		$("body").css({
			"background-color": bgColor,
			color: baseColor,
		});

		$("#main-container").css({
			"background-color": bgColor,
		});

		$("button").css({
			color: baseColor,
			"background-color": bgColor,
		});

		$(".btn.btn-default.active").css({
			"border-color": borderColor,
		});

		$("ul").css({
			color: baseColor,
			"background-color": bgColor,
		});

		$("head").append(
			"<style type='text/css'> .new-is-active {color: '#c3c3c3'; } </style>"
		);

		$(
			".glyphicon.glyphicon-resize-full, .glyphicon.glyphicon-search.black"
		).css({
			color: baseColor,
		});

		$(".form-control.input-sm").css({
			color: baseColor,
			"background-color": bgColor,
		});

		$(".header-inner").css({
			"background-color": bgColor,
			"border-bottom-color": baseColor,
		});

		$(".header-sub_page").css({
			"background-color": bgColor,
		});
		$("#footer").css({
			background: bgColor,
		});

		$(".t-inner").css({
			"background-color": bgColor,
		});

		$(".text-center.even").css({
			"background-color": bgColor,
		});

		$(".text-center.odd").css({
			"background-color": bgColor,
		});

		$("a").css({
			color: baseColor,
			"background-color": "transparent",
		});

		// コンテスト成績証
		$(".panel-body").css({
			"background-color": bgColor,
		});

		$(".panel-footer").css({
			"background-color": bgColor,
		});

		$("tr").css({
			color: baseColor,
		});

		$(".grey").css({
			color: "#f2f1f1",
		});

		$(".dark-grey").css({
			color: "#ddd",
		});

		$(".panel-primary").css({
			"border-color": borderColor,
		});

		$(".panel-primary>.panel-heading").css({
			"border-color": borderColor,
		});

		//コンテストページ
		$("tr").css({
			"background-color": bgColor,
		});

		$("#contest-nav-tabs").css({
			"background-color": bgColor,
		});

		$("li.active a").css({
			"background-color": bgColor,
		});

		$(".insert-participant-box").css({
			"background-color": bgColor,
		});

		$(".container-fluid").css({
			"background-color": bgColor,
		});

		$("#main-div").css({
			background: bgColor,
		});

		$("small.contest-duration, span.mr-2").css({
			color: baseColor,
		});

		//  問題ページ
		$("pre").css({
			color: baseColor,
			background: bgColor,
		});

		$(".btn-copy").css({
			color: baseColor,
			background: bgColor,
		});

		$("span.select2-selection.select2-selection--single").css({
			color: baseColor,
			background: bgColor,
		});

		$("span.select2-selection__rendered").css({
			color: baseColor,
			background: bgColor,
		});

        // 問題文等のボーダー付与
		$("p code").css({
			color: "#ffaa2a",
			"background-color": "transparent",
			border: "white solid 1px",
		});
        $("section ul li code").css({
			color: "#ffaa2a",
			"background-color": "transparent",
			border: "white solid 1px",
		});
        $("ol li code").css({
			color: "#ffaa2a",
			"background-color": "transparent",
			border: "white solid 1px",
		});

        // 解説ページのコードはボーダーなし
        $("pre ol li code").css({
			color: "#ffaa2a",
			"background-color": "transparent",
			border: "",
		});

		$(".alert.alert-warning.alert-dismissible.fade.in").css({
			color: "#ffbe2b",
			"background-color": bgColor,
			border: "#ffdd38 solid 1px",
		});

		/* コード画面*/
		$(".CodeMirror-scroll").css({
			"background-color": bgColor,
		});

		// カーソル
		$("head").append(
			"<style type='text/css'>.CodeMirror-cursor{border-left: 1px solid white;border-right: none;width: 0;}</style>"
		);

		// 文字色
		$("head").append(
			"<style type='text/css'>.cm-s-default .cm-builtin{color: #bb98ff}</style>"
		);

		$("head").append(
			"<style type='text/css'>.cm-s-default .cm-keyword{color: #ed72ff}</style>"
		);

		$("head").append(
			"<style type='text/css'>.cm-s-default .cm-def{color: #23c2ff}</style>"
		);

		$("head").append(
			"<style type='text/css'>.cm-s-default .cm-string{color: #ff9a5f}</style>"
		);

		$("head").append(
			"<style type='text/css'>.cm-s-default .cm-number{color: #11cb81}</style>"
		);

		$("head").append(
			"<style type='text/css'>.cm-s-default .cm-comment{color: #9e9e9e}</style>"
		);

		$(".CodeMirror-gutter").css({
			color: "white",
			"background-color": bgColor,
		});

		$("head").append(
			"<style type='text/css'>div.CodeMirror-linenumber.CodeMirror-gutter-elt{color: white}</style>"
		);

		$(".CodeMirror").css("color", "white");

		//提出結果
		$(".panel-heading").css({
			color: baseColor,
			background: bgColor,
		});

		$(".label-warning").css({
			background: "#d58617",
		});

		$(".btn.btn-link.btn-xs").css({
			color: baseColor,
			background: bgColor,
			border: "solid 1px",
		});

		//コード
		$("head").append(
			"<style type='text/css'>ol.linenums{color: #c3c3c3; background-color: #1c1b1b;}</style>"
		);
		$("head").append(
			"<style type='text/css'>ol.linenums li{background-color: black;}</style>"
		);
		$("head").append("<style type='text/css'>.com{color: #e11313;}</style>");
		$("head").append("<style type='text/css'>.str{color: #1ec91e;}</style>");
		$("head").append("<style type='text/css'>.kwd{color: #00d0ff;}</style>");
		$("head").append("<style type='text/css'>.pln{color: #dfdfdf;}</style>");
		$("head").append("<style type='text/css'>.pun{color: #ffe000;}</style>");
		$("head").append("<style type='text/css'>.lit{color: #41df00;}</style>");
		$("head").append("<style type='text/css'>.typ{color: #da01da;}</style>");
		
		// セレクター
		$("head").append(
			"<style type='text/css'>.select2-dropdown, .select2-search__field{background-color: black !important;color: #c3c3c3 !important;}</style>"
		);

		//コードテスト
		$("head").append(
			"<style type='text/css'>.table>thead>tr>td.danger, .table>tbody>tr>td.danger, .table>tfoot>tr>td.danger, .table>thead>tr>th.danger, .table>tbody>tr>th.danger, .table>tfoot>tr>th.danger, .table>thead>tr.danger>td, .table>tbody>tr.danger>td, .table>tfoot>tr.danger>td, .table>thead>tr.danger>th, .table>tbody>tr.danger>th, .table>tfoot>tr.danger>th{background-color: #a31010;　color: #c3c3c3;}</style>"
		);

		$("head").append(
			"<style type='text/css'>table.table.table-bordered tbody{color:#c3c3c3; background-color: black;}</style>"
		);

		$("head").append(
			"<style type='text/css'>table>thead>tr>td.success, .table>tbody>tr>td.success, .table>tfoot>tr>td.success, .table>thead>tr>th.success, .table>tbody>tr>th.success, .table>tfoot>tr>th.success, .table>thead>tr.success>td, .table>tbody>tr.success>td, .table>tfoot>tr.success>td, .table>thead>tr.success>th, .table>tbody>tr.success>th, .table>tfoot>tr.success>th{color:#c3c3c3; background-color: #379d0d;}</style>"
		);

		$("head").append(
			"<style type='text/css'>.btn-primary{color:#c3c3c3 !important; background-color: black !important; border-color: #d10000 !important;}</style>"
		);

        $("head").append(
			"<style type='text/css'>.btn.btn-lg.btn-default.center-block.mt-2{color:#c3c3c3 !important; background-color: black !important; border-color: #d10000 !important;}</style>"
		);

		$("textarea#input.form-control.customtest-textarea").css({
			color: "white",
			background: bgColor,
		});

		$("textarea#stdout.form-control.customtest-textarea").css({
			color: "white",
			background: bgColor,
		});

		$("textarea#stderr.form-control.customtest-textarea").css({
			color: "white",
			background: bgColor,
		});

		// Home
		$(
			"div.f-flex.f-flex_mg5.f-flex_mg0_s.f-flex_mb5_s div.f-flex4.f-flex12_s"
		).css({
			border: "solid 1px",
		});

		$("head").append(
			"<style type='text/css'>#header .header-page li a:hover{color:#c3c3c3 !important;}</style>"
		);

		$("head").append(
			"<style type='text/css'>#header .header-page li a:before{content: '';width: 0;height: 2px;position: absolute;left: 0;right: 0;bottom: 0;background-color: white !important;-webkit-transition: width .4s;transition: width .4s;}</style>"
		);

		$(".m-box_inner").css({
			"background-color": bgColor,
		});

		$(".m-box-news_post::before").css({
			"background-color": bgColor,
		});

		$("a.a-btn_bg.small").css({
			color: baseColor,
			"background-color": bgColor,
		});

		$(".panel.panel-primary").css({
			color: baseColor,
			"background-color": bgColor,
		});

		$("#keyvisual").css({
			color: baseColor,
			"background-color": bgColor,
			"background-blend-mode": "darken",
		});
		$("head").append(
			"<style type='text/css'>#keyvisual .keyvisual-inner:before{background-color:black; content: ''; display: block;position: absolute;top: 0;width: 18px;height: 400px;pointer-events: none;}</style>"
		);

		$("head").append(
			"<style type='text/css'>.m-box-news_post:before{content: '';position: absolute;left: 0;bottom: 0;width: 100%;height: 100px;background: -webkit-gradient(linear, left bottom, left top, color-stop(50%, #fff), to(rgba(255,255,255,0)));background: linear-gradient(0deg, #000 50%, rgba(255,255,255,0) 100%);}</style>"
		);

		$(".status").css({
			"background-color": "#037abf",
		});

		$(".status.status-gray").css({
			"background-color": "#717171",
		});

		$(".status.status-green").css({
			"background-color": "#317f01",
		});

		$(".a-btn_bg").css({
			border: "solid 1px",
		});

		$(".a-btn_arrow").css({
			color: baseColor,
			"background-color": bgColor,
		});

		$(".a-btn_arrow").css({
			cssText: $(".a-btn_arrow").attr("style") + "color: #c3c3c3 !important;",
		});

		//PAST
		$(".center-block").css({
			"background-color": "#d6d6d6",
		});

		//Jobs
		$(".f-flex3").css({
			border: "solid 1px",
		});

		$(".m-list-job_company").css({
			color: baseColor,
		});

		//順位表
		$("head").append(
			"<style type='text/css'>tr.info td{background-color: black !important;color: #c3c3c3 !important;}</style>"
		);

		//ランキング
		$(".form-control").css({
			color: baseColor,
			"background-color": bgColor,
		});

		//ダイアログ
		$(".modal-content").css({
			color: baseColor,
			"background-color": bgColor,
		});

		$("html body").css({
			"background-color": bgColor,
			color: baseColor,
		});

		$("html body").css("cssText", "color:#c3c3c3;background-image: none !important;background-color: black !important;");
	}

	init();

	// 監視
	if (document.URL.match("/standings")) {
		loadObservation();
	}

	if (document.URL.match("/results")) {
		resultObservation();
	}

	// 色変えコードの埋め込み
	const locationPathName = location.pathname;
	const correctLocation = location.pathname.match(/\/users\/[A-Za-z0-9_]*/);
	if (
		locationPathName == correctLocation &&
		(location.search == "" ||
			location.search == "?graph=rank" ||
			location.search == "?graph=rating")
	) {
		$("head").append(
			`<script>
				    function pixelDataChange(event) {
					    var c = document.getElementById("ratingStatus");
					    if (!c){
						    c = document.getElementById("rankStatus");
					    }
					    const canvas = c;
					    const ctx = canvas.getContext("2d");
					    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					    const data = imageData.data;
					    const oldColor = [
						    [128,128,128],
						    [128,64,0],
						    [0,128,0],
						    [0,192,192],
						    [0,0,255],
						    [192,192,0],
						    [255,128,0],
						    [255,0,0],
						    [226,83,14],
						    [192,192,192],
						    [254,195,11],
						    [132,230,255]
					    ];
					    const newColor = [
						    [201,201,201],
						    [168,85,2],
						    [2,186,2],
						    [0,192,192],
						    [24,148,255],
						    [192,192,0],
						    [255,128,0],
						    [255,0,0],
						    [226,83,14],
						    [192,192,192],
						    [254,195,11],
						    [132,230,255]
					    ];
					    let result = newColor.length;
					    let jPlus = 0;
					    if (location.search == "?graph=rank" || !!document.getElementById("rankStatus")){
						    jPlus = 8;
					    }
					    for (let i = 0, len = data.length; i < len; i += 4) {
						    for (let j = jPlus; j < oldColor.length; j += 1) {
							    if (data[i] == oldColor[j][0] && data[i + 1] == oldColor[j][1] && data[i + 2] == oldColor[j][2]) {
								    result = j;
								    break;
							    }
						    }
						    if (result < newColor.length) {
							    data[i] = newColor[result][0];
							    data[i + 1] = newColor[result][1];
							    data[i + 2] = newColor[result][2];
						    }
						    else{
							    data[i] = 255;
							    data[i + 1] = 255;
							    data[i + 2] = 255;
						    }
					    }
					    imageData.data = data;
					    ctx.putImageData(imageData, 0, 0);
				    }
			    </script>`
		);
		$(".mt-2.mb-2").append(
			`<script>
				    window.onload = function(){
					    createjs.Ticker.addEventListener("tick", pixelDataChange);
				    };
			</script>`
		);
	}
})();
