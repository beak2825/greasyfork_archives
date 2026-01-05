// ==UserScript==
// @name        SG Train Tool
// @namespace   https://greasyfork.org/users/34380
// @include     https://www.steamgifts.com/giveaways/new
// @include     https://www.steamgifts.com/giveaways/created
// @include     https://www.steamgifts.com/user/*
// @version     20180126
// @supportURL  http://steamcn.com/t257535-1-1
// @run-at      document-idle
// @grant       GM_setValue
// @grant       GM_getValue
// @description 保存模板，便捷创建赠送。选择赠送，转换成论坛码。编辑描述，快速创建火车。
// @downloadURL https://update.greasyfork.org/scripts/28359/SG%20Train%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/28359/SG%20Train%20Tool.meta.js
// ==/UserScript==

//只工作在/giveaways/new第一页
if ($(".form__edit-button").length == 0 && document.URL == "https://www.steamgifts.com/giveaways/new") {
	//Style
	$("body").prepend(`<style>
		.sgtt-btn {
			display: block;
			margin: 5px 5px 0px 0px;
			padding: 3px 15px;
			border-radius: 4px;
			border-style: solid;
			border-width: 1px;
			cursor: pointer;
		}
		.sgtt-btn:hover {
		    background-color: rgba(0, 0, 0, 0.1);
		}
		#options-list {
			position: fixed;
			display:flex;
			flex-direction:	column;
			overflow-x: hidden;
			overflow-y: auto;
			top: 50px;
			right: 5px;
			width: 220px;
		}
		.option-game {
			white-space:nowrap;
			text-overflow: ellipsis;
			color: #21262f;
		}
		.option-game:hover {
			white-space:inherit;
			text-overflow: inherit;
		}
		.is-created {
			text-decoration:line-through;
			color: #6b7a8c;
		}
	</style>`);

	$(".page__outer-wrap").prepend(`
		<div id="options-list" style="">
			<div>未加载</div>
		</div>
	`);

	$(".page__heading").after(`
		<div id="sgtt" style="display: flex">
			<div class="sgtt-btn" id="status">未加载</div>
			<div class="sgtt-btn" id="save">保存模板</div>
			<div class="sgtt-btn" id="gktextarea-edit">编辑选项</div>
		</div>
		<textarea id="gktextarea" class="is-hidden" style="margin: 5px 0px 0px 0px;"></textarea>
	`);

	let is_enabled = GM_getValue("sgtt_is_enabled", false);

	//读取保存的模板4-8项
	const start_time = GM_getValue("sgtt_start_time", "");
	const end_time = GM_getValue("sgtt_end_time", "");
	const region = GM_getValue("sgtt_region", "0");
	const country_item = GM_getValue("sgtt_country_item", "");
	const whitelist = GM_getValue("sgtt_whitelist", "");
	const group_string = GM_getValue("sgtt_group_string", "");
	const who_can_enter = GM_getValue("sgtt_who_can_enter", "");
	const contributor_level = GM_getValue("sgtt_contributor_level", "0");
	const description = GM_getValue("sgtt_description", "");

	//读取保存的文本区域，生成右侧游戏名选项列表
	let is_hidden = true;
	$("#gktextarea").val(GM_getValue("sgtt_gks_string", ""));
	let orders_string = GM_getValue("sgtt_orders_string", "");
	let order_end = GM_getValue("sgtt_order_end", "");
	setTimeout(function() {
		toOptioinList($("#gktextarea").val(), orders_string);
	}, 1);

	$("#status").click(function() {
		is_enabled = !is_enabled;
		statusCheck();
		GM_setValue("sgtt_is_enabled", is_enabled);
	});

	$("#save").click(function() {
		templateSave();
	});

	$("#gktextarea-edit").click(function() {
		is_hidden = !is_hidden;
		if (is_hidden == false) {
			$("#gktextarea-edit").text("生成选项");
			$("#gktextarea").removeClass("is-hidden");
		} else {
			$("#gktextarea-edit").text("编辑选项");
			$("#gktextarea").addClass("is-hidden");
			orders_string = "";
			order_end = "";
			toOptioinList($("#gktextarea").val(), orders_string);
			GM_setValue("sgtt_gks_string", $("#gktextarea").val());
		}
	});

	function statusCheck() {
		if (is_enabled == true) {
			templateFill();
			listResize();
			$("#status").text("已启用");
			$("#status").css("background-image", "linear-gradient(rgb(202, 238, 167) 0%, rgb(180, 223, 138) 50%, rgb(154, 201, 106) 100%)");
			$("#options-list").removeClass("is-hidden");
		} else {
			$("#status").text("已停用");
			$("#status").css("background-image", "");
			$("#options-list").addClass("is-hidden");
		}
	}

	function templateFill() {
		//填写2,4-8项
		$('div[data-checkbox-value="key"]').trigger("click");
		$('input[name="start_time"]').val(start_time);
		$('input[name="end_time"]').val(end_time);
		$('div[data-checkbox-value="' + region + '"]').trigger("click");
		const countries = country_item.split(" ");
		countries.forEach(function(value) {
			$('div[data-input="country_item_string"] > div[data-item-id="' + value + '"]').trigger("click");
		});

		$('div[data-checkbox-value="' + who_can_enter + '"]').trigger("click");
		if (whitelist == "1") {
			$('div[data-whitelist="1"]').trigger("click");
		}
		const groups = group_string.split(" ");
		groups.forEach(function(value) {
			$('div[data-input="group_item_string"] > div[data-item-id="' + value + '"]').trigger("click");
		});

		if (contributor_level > 0) {
			$('input[name=contributor_level]').val(contributor_level);
			$('.ui-slider-range').width(contributor_level + '0%');
			$('.ui-slider-handle').css('left', contributor_level + '0%');
			$('input[name=contributor_level]').next('div').find('span').text('level ' + contributor_level);
			$(".form__input-description--level").removeClass("is-hidden");
			$(".form__input-description--no-level").addClass("is-hidden");
		}

		$('textarea[name="description"]').val(description);
	}

	function templateSave() {
		GM_setValue("sgtt_start_time", $('input[name="start_time"]').val());
		GM_setValue("sgtt_end_time", $('input[name="end_time"]').val());
		GM_setValue("sgtt_region", $('input[name="region_restricted"]').val());
		GM_setValue("sgtt_country_item", $('input[name="country_item_string"]').val());
		GM_setValue("sgtt_whitelist", $('input[name="whitelist"]').val());
		GM_setValue("sgtt_group_string", $('input[name="group_item_string"]').val());
		GM_setValue("sgtt_who_can_enter", $('input[name="who_can_enter"]').val());
		GM_setValue("sgtt_contributor_level", $('input[name="contributor_level"]').val());
		GM_setValue("sgtt_description", $('textarea[name="description"]').val());
	}

	//右侧游戏名选项列表
	function toOptioinList(gks_str, orders_str) {
		$("#options-list").empty();

		const gks = gks_str.split("\n\n");
		let orders = [];
		if (orders_str.length == 0) {
			for (let i = 0; i < gks.length; i++) {
				orders[i] = i;
			}
			order_end = orders.length - 1;
			GM_setValue("sgtt_orders_string", orders.join(","));
			GM_setValue("sgtt_order_end", order_end);
		} else {
			orders = orders_str.split(",");
		}

		const games = [];
		const keys = [];
		gks.forEach(function(value, i) {
			games[i] = value.substring(0, value.indexOf("\n"));
			keys[i] = value.substring(value.indexOf("\n") + 1);
			toOption(games[i], i, orders[i]);
		});

		$(".option-game").each(function() {
			if ($(this).css("order") > orders.length - 1) {
				$(this).addClass("is-created");
			}
		});

		$(document).on("click", ".option-game", function() {
			$(this).addClass("is-selected").siblings().removeClass("is-selected");
			const id = $(this).attr("checkbox-id");
			$(".js__autocomplete-name").val(games[id]);
			$('textarea[name="key_string"]').val(keys[id]);
			$.post("https://www.steamgifts.com/ajax.php", {
				search_query: games[id],
				page_number: "1",
				do: "autocomplete_game"
			}, function(data) {
				$(".js__autocomplete-data").html(data.html);
				$(".js__autocomplete-data").removeClass("is-hidden");
			}, "json");
		});

		$(".js__submit-form").click(function() {
			const id = $(".option-game.is-selected").attr("checkbox-id");
			orders[id] = order_end + 1;
			GM_setValue("sgtt_orders_string", orders.join(","));
			GM_setValue("sgtt_order_end", order_end + 1);
		});
	}

	function toOption(game, id, order) {
		$("#options-list").append(` \
			<div class="form__checkbox option-game" checkbox-id="` + id + `" style="order:` + order + `">
				<i class="form__checkbox__default fa fa-circle-o"></i>
				<i class="form__checkbox__hover fa fa-circle"></i>
				<i class="form__checkbox__selected fa fa-check-circle"></i> ` + game + `
			</div>
		`);
	}

	setTimeout(statusCheck, 1);
	window.onresize = listResize;

	function listResize() {
		$("#options-list").css("max-height", $(window).height() - 70 + "px");
		if ($(window).width() > 1310) {
			//pag__inner-wrap +5px options-list +5px scrollbar, 1310=5+220+5+850+5+220+5
			const set_right = ($(window).width() - 850) / 2 - 225;
			$("#options-list").css("right", set_right + "px");
		} else {
			$("#options-list").css("right", "5px");
		}
	}
}

//只工作在已创建和用户首页
const site = window.location.href.match(/www\.steamgifts\.com\/giveaways\/created/) || window.location.href.match(/www\.steamgifts\.com\/user\/.+/);
if (site != null) {
	//style
	$("head").append(`<style>
		.sgtt-btn {
			display: inline-block;
			margin: 5px 5px 0px 0px;
			padding: 3px 15px;
			border-radius: 4px;
			border-style: solid;
			border-width: 1px;
			cursor: pointer;
		}
		.sgtt-btn:hover {
		    background-color: rgba(0, 0, 0, 0.1);
		}
		.table__row-outer-wrap:hover, .giveaway__row-outer-wrap:hover {
			background-color: rgba(0, 0, 0, 0.2);
		}
		.is-selected-ga {
		    background-color: rgba(0, 0, 0, 0.2);
		}
		#display-area {
			position: fixed;
			padding: 5px;
			z-index: 1;
			top: 55px;
			background-color: rgba(0, 0, 0, 0.2);
		}
		#code-area {
			resize: both!important;
			overflow-y: auto!important;
		}
		#preview-area {
			background-color: #FFFFFF;
			overflow-y: auto!important;
			height: 100%!important;
		}
		.des-input {
			display: flex;
			width: 206px;
			margin: 5px 0px 0px 0px;
		}
	`);

	$(".sidebar").append(`
		<div>
			<div style="display: flex; flex-wrap: wrap; width: 206px;">
				<div class="sgtt-btn" id="sort-by-default">默认排序</div>
				<div class="sgtt-btn" id="sort-by-name">名称排序</div>
				<div class="sgtt-btn" id="sort-by-level">等级排序</div>
				<div class="sgtt-btn" id="hide-o-display" value="hide">点击显示</div>
				<div class="sgtt-btn" id="none-o-all" value="none">全选</div>
				<div class="sgtt-btn" id="code-o-preview" value="code">点击预览</div>
				<div style="flex-basis:100%;">
					<div class="sgtt-btn" id="send-key">Send所选赠送</div>
				</div>
				<div class="sgtt-btn" id="train-step-one">准备车厢</div>
				<div class="sgtt-btn" id="train-step-two">衔接车厢</div>
			</div>
			<textarea class="des-input" id="des-main">这里输入描述内容，下方输入框作文字替换。\n这是第<Number>节车厢\n前一个<Previous>   下一个<Next></textarea>
			<input class="des-input" id="des-previous" value="Previous"></input>
			<input class="des-input" id="des-next" value="Next"></input>
			<div id="display-area" class="is-hidden">
				<textarea class="is-hidden" id="code-area"></textarea>
				<div class="is-hidden" id="preview-area"></div>
			</div>
		</div>
	`);

	const gas = [];
	let ga_start;
	let ga_end;

	$(".widget-container").on("click", ".table__row-outer-wrap, .giveaway__row-outer-wrap", function(e) {
		$(this).toggleClass("is-selected-ga");
		if (e.shiftKey == 1) {
			ga_start = ga_end;
			ga_end = $(this).attr("ga-ord");
			if (ga_start > ga_end) {
				[ga_start, ga_end] = [ga_end, ga_start];
			}
			for (let i = ga_start; i <= ga_end; i++) {
				$(".table__row-outer-wrap[ga-ord=" + i + "], .giveaway__row-outer-wrap[ga-ord=" + i + "]").addClass("is-selected-ga");
			}
		} else {
			ga_end = $(this).attr("ga-ord");
		}
	});

	$("#sort-by-default").click(function() {
		const selected_gas = getSelectedGiveawayOrd();
		selected_gas.sort(function(a, b) {
			return a.id - b.id;
		});
		toBBcode(selected_gas, false);
	});
	$("#sort-by-name").click(function() {
		const selected_gas = getSelectedGiveawayOrd();
		selected_gas.sort(function(a, b) {
			return a.game.localeCompare(b.game);
		});
		toBBcode(selected_gas, false);
	});
	$("#sort-by-level").click(function() {
		const selected_gas = getSelectedGiveawayOrd();
		selected_gas.sort(function(a, b) {
			return a.level - b.level;
		});
		toBBcode(selected_gas, true);
	});

	$("#hide-o-display").click(function() {
		if ($(this).attr("value") == "hide") {
			$(this).attr("value", "display");
			$(this).text("点击隐藏");
			$("#display-area").removeClass("is-hidden");
		} else {
			$(this).attr("value", "hide");
			$(this).text("点击显示");
			$("#display-area").addClass("is-hidden");
		}
	});
	$("#none-o-all").click(function() {
		if ($(this).attr("value") == "none") {
			$(this).attr("value", "all");
			$(this).text("全否");
			$(".table__row-outer-wrap").find(".table__column--width-fill > p:nth-child(2):contains('remaining'), .table__column--width-fill > p:nth-child(2):contains('Begins')").parentsUntil($(".table__row-outer-wrap").parent(), ".table__row-outer-wrap").addClass("is-selected-ga");
			$(".giveaway__row-outer-wrap").find(".giveaway__columns > div:nth-child(1):contains('remaining'), .giveaway__columns > div:nth-child(1):contains('Begins')").parentsUntil($(".giveaway__row-outer-wrap").parent(), ".giveaway__row-outer-wrap").addClass("is-selected-ga");
		} else {
			$(this).attr("value", "none");
			$(this).text("全选");
			$(".table__row-outer-wrap, .giveaway__row-outer-wrap").removeClass("is-selected-ga");
		}
	});
	$("#code-o-preview").click(function() {
		if ($(this).attr("value") == "code") {
			$(this).attr("value", "preview");
			$(this).text("点击编辑");
			previewBBcode();
		} else {
			$(this).attr("value", "code");
			$(this).text("点击预览");
			$("#code-area").removeClass("is-hidden");
			$("#preview-area").addClass("is-hidden");
		}
	});

	$("#send-key").click(function() {
		if (window.confirm('将自动发送所选赠送的key\n' + name + '\n是否确定？')) {
			$(".is-selected-ga").each(function() {
				$("#send-key").css("background-image", "inherit");
				const link = $(this).find(".table__column__heading, .giveaway__heading__name").attr("href").match(/\/giveaway\/([a-zA-Z0-9]{5})\/([a-zA-Z0-9-]*)/);
				$.get("https://www.steamgifts.com" + link[0] + "/winners", function(data) {
					$(data).find(".table__row-outer-wrap").each(function() {
						const winner_id = $(this).find("input[name=winner_id]").val();
						$.post("https://www.steamgifts.com/ajax.php", {
							xsrf_token: token,
							action: "1",
							do: "sent_feedback",
							winner_id: winner_id
						});
					});
				}).done(function() {
					$("#send-key").css("background-image", "linear-gradient(rgb(202, 238, 167) 0%, rgb(180, 223, 138) 50%, rgb(154, 201, 106) 100%)");
				});
			});
		}
	});

	$("#train-step-one").click(function() {
		getGiveawayIdArray();
	});
	$("#train-step-two").click(function() {
		for (let i = 0; i < links.length; i++) {
			editDescription(giveaway_ids[i], links[i - 1] || "", links[i + 1] || "");
		}
	});

	//准备各giveaway数据
	addGiveawayId();

	function addGiveawayId() {
		if (gas.length == $(".table__row-outer-wrap[ga-ord], .giveaway__row-outer-wrap[ga-ord]").length) {
			$("#hide-o-display").css("background-image", "linear-gradient(rgb(202, 238, 167) 0%, rgb(180, 223, 138) 50%, rgb(154, 201, 106) 100%)");
		} else {
			$("#hide-o-display").css("background-image", "inherit");
		}
		if ($(".table__row-outer-wrap:not([ga-ord]), .giveaway__row-outer-wrap:not([ga-ord])").length > 0) {
			$(".table__row-outer-wrap:not([ga-ord]), .giveaway__row-outer-wrap:not([ga-ord])").each(function() {
				const link = $(this).find(".table__column__heading, .giveaway__heading__name").attr("href").match(/\/giveaway\/([a-zA-Z0-9]{5})\/([a-zA-Z0-9-]*)/);
				getGiveawayData($(".table__row-outer-wrap[ga-ord], .giveaway__row-outer-wrap[ga-ord]").length, link);
				$(this).attr("ga-ord", $(".table__row-outer-wrap[ga-ord], .giveaway__row-outer-wrap[ga-ord]").length);
			});
		}
		setTimeout(addGiveawayId, 2000);
	}

	function getGiveawayData(id, link_ga) {
		$.get("https://www.steamgifts.com" + link_ga[0], function(data) {
			const game = $(data).find(".featured__heading__medium").text();
			const link_store = $(data).find(".global__image-outer-wrap--game-large").attr("href");
			const level = $(data).find(".featured__column--contributor-level").text().replace("Level ", "").replace("+", "") || 0;
			const code = link_ga[1];
			gas[id] = {
				id: id,
				link_ga: link_ga,
				game: game,
				link_store: link_store,
				level: level
			};
		});
	}

	function getSelectedGiveawayOrd() {
		const selected = [];
		$(".is-selected-ga").each(function() {
			selected.push(gas[$(this).attr("ga-ord")]);
		});
		return selected;
	}

	function toBBcode(sel_gas, is_level) {
		const code_stores = [];
		const code_gas_img = [];
		const code_gas_txt = [];
		sel_gas.forEach(function(value, i) {
			code_stores[i] = "[url=" + value.link_store + "]" + value.game + "[/url]";
		});

		sel_gas.forEach(function(value, i) {
			code_gas_img[i] = "[url=https://www.steamgifts.com" + value.link_ga[0] + "][img]https://www.steamgifts.com" + value.link_ga[0] + "/signature.png[/img][/url]";
		});
		sel_gas.forEach(function(value, i) {
			code_gas_txt[i] = "[url=https://www.steamgifts.com" + value.link_ga[0] + "]" + value.link_ga[2] + "[/url]";
		});
		if (is_level == true) {
			sel_gas.forEach(function(value, i) {
				code_gas_img[i] = "LV" + value.level + ": " + code_gas_img[i];
			});
		}
		const bbcode = code_stores.join("\n") + "\n\n" + code_gas_img.join("\n") + "\n\n" +  code_gas_txt.join("\n");
		$("#code-area").val(bbcode).css("height", (code_stores.length + 1) * 36 + "px");
		$("#code-area").removeClass("is-hidden");
		$("#preview-area").addClass("is-hidden");
	}

	function previewBBcode() {
		$("#preview-area").empty();
		const bbcode_preview = $("#code-area").val().replace(/\[url=([:/.a-zA-Z0-9-]+)\]/g, "<a target=\"_blank\" href=\"$1\">")
			.replace(/\[img\]([:/.a-zA-Z0-9-]+)\[\/img\]/g, "<img src=\"$1\"></img>")
			.replace(/\[\/url\]/g, "<\/a>")
			.replace(/\n/g, "<br />");
		$("#preview-area").prepend(bbcode_preview);
		$("#preview-area").removeClass("is-hidden");
		$("#code-area").addClass("is-hidden");
	}

	//创建火车
	const token = $('input[name="xsrf_token"]').val();
	let giveaway_ids;
	let links;

	function getGiveawayIdArray() {
		$("#train-step-one, #train-step-two").css("background-image", "inherit");
		giveaway_ids = [];
		links = $("#code-area").val().replace(/.*(\/giveaway\/[a-zA-Z0-9]{5}\/[a-zA-Z0-9-]*).*/g, "$1").split("\n");
		for (let i = 0; i < links.length; i++) {
			getGiveawayId(i, links[i]);
		}

		function checkOrdinal() {
			const t = setTimeout(checkOrdinal, 1000);
			if (giveaway_ids.length == links.length) {
				giveaway_ids.sort(function(a, b) {
					return a.ordinal - b.ordinal;
				});
				$("#train-step-one").css("background-image", "linear-gradient(rgb(202, 238, 167) 0%, rgb(180, 223, 138) 50%, rgb(154, 201, 106) 100%)");
				clearTimeout(t);
			}
		}

		function getGiveawayId(ord, link) {
			$.get("https://www.steamgifts.com" + link, function(data) {
				const id = $(data).find('input[name="giveaway_id"]').val();
				giveaway_ids.push({
					ordinal: ord,
					giveaway_id: id
				});
			});
		}
		checkOrdinal();
	}

	function editDescription(ga, link_pre, link_next) {
		$("#train-step-two").css("background-image", "inherit");
		const main = $("#des-main").val();
		const previous = $("#des-previous").val();
		const next = $("#des-next").val();
		const des = main.replace("<Number>", ga.ordinal + 1)
			.replace("<Previous>", link_pre.length == 0 ? "" : "[" + previous + "](https://www.steamgifts.com" + link_pre + ")")
			.replace("<Next>", link_next.length == 0 ? "" : "[" + next + "](https://www.steamgifts.com" + link_next + ")");

		$.post("https://www.steamgifts.com/ajax.php", {
			xsrf_token: token,
			do: "edit_giveaway_description",
			giveaway_id: ga.giveaway_id,
			description: des
		}).done(function() {
			$("#train-step-two").css("background-image", "linear-gradient(rgb(202, 238, 167) 0%, rgb(180, 223, 138) 50%, rgb(154, 201, 106) 100%)");
		});
	}

	areaResize();
	window.onresize = areaResize;

	function areaResize() {
		const set_left = $(".page__heading").offset().left - 15;
		const set_width = $(".page__heading").width() + 15;
		const set_height = $(window).height() - 55 - 25;
		$("#display-area").css("left", set_left + "px");
		$("#code-area, #preview-area").css("width", set_width + "px");
		$("#code-area, #preview-area").css("max-height", set_height + "px");
	}
}