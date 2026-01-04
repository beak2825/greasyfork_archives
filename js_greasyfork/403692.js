// ==UserScript==
// @name         Zero dev
// @namespace    https://tildoshnaya.com/
// @version      0.1
// @description  description
// @author       Тильдошная
// @match        https://tilda.cc/page/*
// @match        https://tilda.cc/zero/*
// @downloadURL https://update.greasyfork.org/scripts/403692/Zero%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/403692/Zero%20dev.meta.js
// ==/UserScript==

var fonts = ["Open Sans Condensed", "Roboto Slab"];
$("body").append('<link href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:ital,wght@0,300;0,700;1,300&display=swap" rel="stylesheet">')
$("body").append('<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">')


let _body = document.querySelector("body");
const iframeObserver = new MutationObserver((mutationsList) => {
	for (let mutation of mutationsList) {
		if (mutation.type === "childList") {
			let openIframe = [].slice.call(_body.children)
				.map((node) => node.outerHTML)
				.filter((s) => s.indexOf(`<iframe class="t396__iframe" src=`) === 0 ? true : false);

			if (openIframe.length === 1) iframeListener();
		}
	}
});
iframeObserver.observe(_body, {
	childList: true
});

function iframeListener() {
	setTimeout(() => {
		let iframe = $("iframe.t396__iframe");
		let content = iframe.contents();
		if (typeof iframe.eq(0)[0] !== "undefined") {
			var iframeWindow = iframe.eq(0)[0].contentWindow;
			content.on("keyup keydown click", () => {
				// if (content.find(".tn-elem.tn-elem__selected").length == 1 && content.find("#group-editor").length === 0) {

					var iframeDoc2 = content;

					// singleItem
					if ($(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").length == 1) {


						// Смена шрифтов
						if ($(iframeDoc2).find("#font_select").length == 0) {
							// $(iframeDoc2).find(".tn-settings").prepend("<select id='font_select'></select><img id='font_select_reset' src='img/tn-close.png' style='height: 16px; margin-left: 7px; margin-bottom: -3px;'>");
							$(iframeDoc2).find("[data-control-field='fontfamily']").parents("table.sui-panel__table").after("<table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontfamily-custom' data-control-value='Circe'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Other fonts</label></td><td style='width:100%;'><div class='sui-select'><select id='font_select' class='sui-input sui-select' name='fontfamily-custom'></select></div></td></tr></tbody></table></div></td></tr></tbody></table>");
							for (var i = 0; i < fonts.length; i++) {
								$(iframeDoc2).find("#font_select").append("<option value='" + fonts[i] + "'>" + fonts[i] + "</option>");
							}
						}

						$(iframeDoc2).find("#font_select").change(function(){
							$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible) .tn-atom").css("font-family", '"' + $(this).val() + '"')
						})

						$(iframeDoc2).find("#font_select_reset").click(function(){
							$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible) .tn-atom").css("font-family", 'inherit')
						})
						// /Смена шрифтов


						// Код чтобы при вводе в поле, ничего не изменялось на холсте
						setTimeout(function(){
							$(iframeDoc2).find(".tn-right-box input").each(function(){
								this.onfocus = function(){
									$('.t396__iframe').get(0).contentWindow.tn_flag_settings_ui_focus = true;
								}
								this.onblur = function() {
									$('.t396__iframe').get(0).contentWindow.tn_flag_settings_ui_focus = false;
								}
							})

							$(iframeDoc2).find("select").each(function(){
								this.onfocus = function(){
									$('.t396__iframe').get(0).contentWindow.tn_flag_settings_ui_focus = true;
								}
								this.onblur = function() {
									$('.t396__iframe').get(0).contentWindow.tn_flag_settings_ui_focus = false;
								}
							})

						}, 500)
						// / Код чтобы при вводе в поле, ничего не изменялось на холсте
					}
					// /singleItem






					// multipleItems
					if ($(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").length > 1) {
						setTimeout(function(){
							// Смена шрифтов
							if ($(iframeDoc2).find("#font_select").length == 0) {
								// $(iframeDoc2).find(".tn-settings").prepend("<select id='font_select'></select><img id='font_select_reset' src='img/tn-close.png' style='height: 16px; margin-left: 7px; margin-bottom: -3px;'>");
								$(iframeDoc2).find("[data-control-field='fontfamily']").parents("table.sui-panel__table").after("<table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontfamily-custom' data-control-value='Circe'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Other fonts</label></td><td style='width:100%;'><div class='sui-select'><select id='font_select' class='sui-input sui-select' name='fontfamily-custom'></select></div></td></tr></tbody></table></div></td></tr></tbody></table>");
								for (var i = 0; i < fonts.length; i++) {
									$(iframeDoc2).find("#font_select").append("<option value='" + fonts[i] + "'>" + fonts[i] + "</option>");
								}
							}

							$(iframeDoc2).find("#font_select").change(function(){
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible) .tn-atom").css("font-family", '"' + $(this).val() + '"')
							})

							$(iframeDoc2).find("#font_select_reset").click(function(){
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible) .tn-atom").css("font-family", 'inherit')
							})
							// /Смена шрифтов
						}, 10)



						// Код чтобы при вводе в поле, ничего не изменялось на холсте
						setTimeout(function(){
							$(iframeDoc2).find(".tn-right-box input").each(function(){
								this.onfocus = function(){
									$('.t396__iframe').get(0).contentWindow.tn_flag_settings_ui_focus = true;
								}
								this.onblur = function() {
									$('.t396__iframe').get(0).contentWindow.tn_flag_settings_ui_focus = false;
								}
							})

							$(iframeDoc2).find("select").each(function(){
								this.onfocus = function(){
									$('.t396__iframe').get(0).contentWindow.tn_flag_settings_ui_focus = true;
								}
								this.onblur = function() {
									$('.t396__iframe').get(0).contentWindow.tn_flag_settings_ui_focus = false;
								}
							})

						}, 500)
						// / Код чтобы при вводе в поле, ничего не изменялось на холсте

					}
					// multipleItems

				// multipleItems














































				// }
			});
		}
	}, 1500);
}




///////////////////////////////////////////////
///// Вспомогательные функции зеро блока///////
///////////////////////////////////////////////
function tooltips() {
	$('.t396__iframe').get(0).contentWindow.tn_tooltip_update();
}

function render() {
	$('.t396__iframe').get(0).contentWindow.elem__selected__offsetMove(0, -100);
	$('.t396__iframe').get(0).contentWindow.elem__selected__offsetMove(0, 100);
}


function resolution(iframeDoc2) {
	var elem = $(iframeDoc2).find(".tn-res-item_active");
	if (elem.hasClass("tn-res-1200")) {
		return 1200;
	}
	if (elem.hasClass("tn-res-960")) {
		return 960;
	}
	if (elem.hasClass("tn-res-640")) {
		return 640;
	}
	if (elem.hasClass("tn-res-480")) {
		return 480;
	}
	if (elem.hasClass("tn-res-320")) {
		return 320;
	}
}

// Получить значение координаты
function getElemFieldTop(iframeDoc2, elem) {
	switch (resolution(iframeDoc2)) {
		case 320:
			return Number(elem.attr("data-field-top-res-320-value") ||
						  elem.attr("data-field-top-res-480-value") ||
						  elem.attr("data-field-top-res-640-value") ||
						  elem.attr("data-field-top-res-960-value") ||
						  elem.attr("data-field-top-value"));
		break;
		case 480:
			return Number(elem.attr("data-field-top-res-480-value") ||
						  elem.attr("data-field-top-res-640-value") ||
						  elem.attr("data-field-top-res-960-value") ||
						  elem.attr("data-field-top-value"));
		break;
		case 640:
			return Number(elem.attr("data-field-top-res-640-value") ||
						  elem.attr("data-field-top-res-960-value") ||
						  elem.attr("data-field-top-value"));
		break;
		case 960:
			return Number(elem.attr("data-field-top-res-960-value") ||
						  elem.attr("data-field-top-value"));
		break;
		case 1200:
			return Number(elem.attr("data-field-top-value"));
		break;
		default:
			alert("Возникла ошибка в getElemFieldTop");
		break;
	}
}

function getElemFieldLeft(iframeDoc2, elem) {
	switch (resolution(iframeDoc2)) {
		case 320:
			return Number(elem.attr("data-field-left-res-320-value") ||
						  elem.attr("data-field-left-res-480-value") ||
						  elem.attr("data-field-left-res-640-value") ||
						  elem.attr("data-field-left-res-960-value") ||
						  elem.attr("data-field-left-value"));
		break;
		case 480:
			return Number(elem.attr("data-field-left-res-480-value") ||
						  elem.attr("data-field-left-res-640-value") ||
						  elem.attr("data-field-left-res-960-value") ||
						  elem.attr("data-field-left-value"));
		break;
		case 640:
			return Number(elem.attr("data-field-left-res-640-value") ||
						  elem.attr("data-field-left-res-960-value") ||
						  elem.attr("data-field-left-value"));
		break;
		case 960:
			return Number(elem.attr("data-field-left-res-960-value") ||
						  elem.attr("data-field-left-value"));
		break;
		case 1200:
			return Number(elem.attr("data-field-left-value"));
		break;
		default:
			alert("Возникла ошибка в getElemFieldLeft");
		break;
	}
}

// Задать элементу координату
function setElemFieldTop(iframeDoc2, elem, pos) {
	switch (resolution(iframeDoc2)) {
		case 320:
			elem.attr("data-field-top-res-320-value", pos);
		break;
		case 480:
			elem.attr("data-field-top-res-480-value", pos);
		break;
		case 640:
			elem.attr("data-field-top-res-640-value", pos);
		break;
		case 960:
			elem.attr("data-field-top-res-960-value", pos);
		break;
		case 1200:
			elem.attr("data-field-top-value", pos);
		break;
	}
}

function setElemFieldLeft(iframeDoc2, elem, pos) {
	switch (resolution(iframeDoc2)) {
		case 320:
			elem.attr("data-field-left-res-320-value", pos);
		break;
		case 480:
			elem.attr("data-field-left-res-480-value", pos);
		break;
		case 640:
			elem.attr("data-field-left-res-640-value", pos);
		break;
		case 960:
			elem.attr("data-field-left-res-960-value", pos);
		break;
		case 1200:
			elem.attr("data-field-left-value", pos);
		break;
	}
}


// Узнать на какой оси объект
function getElemAxisX(iframeDoc2, elem) {
	switch (resolution(iframeDoc2)) {
		case 320:
			return elem.attr("data-field-axisx-res-320-value") ||
				   elem.attr("data-field-axisx-res-480-value") ||
				   elem.attr("data-field-axisx-res-640-value") ||
				   elem.attr("data-field-axisx-res-960-value") ||
				   elem.attr("data-field-axisx-value");
		break;
		case 480:
			return elem.attr("data-field-axisx-res-480-value") ||
				   elem.attr("data-field-axisx-res-640-value") ||
				   elem.attr("data-field-axisx-res-960-value") ||
				   elem.attr("data-field-axisx-value");
		break;
		case 640:
			return elem.attr("data-field-axisx-res-640-value") ||
				   elem.attr("data-field-axisx-res-960-value") ||
				   elem.attr("data-field-axisx-value");
		break;
		case 960:
			return elem.attr("data-field-axisx-res-960-value") ||
				   elem.attr("data-field-axisx-value");
		break;
		case 1200:
			return elem.attr("data-field-axisx-value");
		break;
	}
}


function getElemAxisY(iframeDoc2, elem) {
	switch (resolution(iframeDoc2)) {
		case 320:
			return elem.attr("data-field-axisy-res-320-value") ||
				   elem.attr("data-field-axisy-res-480-value") ||
				   elem.attr("data-field-axisy-res-640-value") ||
				   elem.attr("data-field-axisy-res-960-value") ||
				   elem.attr("data-field-axisy-value");
		break;
		case 480:
			return elem.attr("data-field-axisy-res-480-value") ||
				   elem.attr("data-field-axisy-res-640-value") ||
				   elem.attr("data-field-axisy-res-960-value") ||
				   elem.attr("data-field-axisy-value");
		break;
		case 640:
			return elem.attr("data-field-axisy-res-640-value") ||
				   elem.attr("data-field-axisy-res-960-value") ||
				   elem.attr("data-field-axisy-value");
		break;
		case 960:
			return elem.attr("data-field-axisy-res-960-value") ||
				   elem.attr("data-field-axisy-value");
		break;
		case 1200:
			return elem.attr("data-field-axisy-value");
		break;
	}
}


function getElemContainer(iframeDoc2, elem) {
	switch (resolution(iframeDoc2)) {
		case 320:
			return elem.attr("data-field-container-res-320-value") ||
				   elem.attr("data-field-container-res-480-value") ||
				   elem.attr("data-field-container-res-640-value") ||
				   elem.attr("data-field-container-res-960-value") ||
				   elem.attr("data-field-container-value");
		break;
		case 480:
			return elem.attr("data-field-container-res-480-value") ||
				   elem.attr("data-field-container-res-640-value") ||
				   elem.attr("data-field-container-res-960-value") ||
				   elem.attr("data-field-container-value");
		break;
		case 640:
			return elem.attr("data-field-container-res-640-value") ||
				   elem.attr("data-field-container-res-960-value") ||
				   elem.attr("data-field-container-value");
		break;
		case 960:
			return elem.attr("data-field-container-res-960-value") ||
				   elem.attr("data-field-container-value");
		break;
		case 1200:
			return elem.attr("data-field-container-value");
		break;
	}
}


// можно было использовать getElemAxisY и вышло бы компактнее
function getUnifyX(iframeDoc2, elem) {
	switch (resolution(iframeDoc2)) {
		case 320:
			if (getElemContainer(iframeDoc2, elem) == "window") {
				// WINDOW
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem);

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 160 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 320 - Number(elem.get(0).offsetWidth);
				}
			} else {
				// GRID
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem);

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 160 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 320 - Number(elem.get(0).offsetWidth);
				}
			}
		break;
		case 480:
			if (getElemContainer(iframeDoc2, elem) == "window") {
				// WINDOW
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem);

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 240 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 480 - Number(elem.get(0).offsetWidth);
				}
			} else {
				// GRID
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem);

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 240 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 480 - Number(elem.get(0).offsetWidth);
				}
			}
		break;
		case 640:
			if (getElemContainer(iframeDoc2, elem) == "window") {
				// WINDOW
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem);

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 320 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 640 - Number(elem.get(0).offsetWidth);
				}
			} else {
				// GRID
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem);

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 320 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 640 - Number(elem.get(0).offsetWidth);
				}
			}
		break;
		case 960:
			if (getElemContainer(iframeDoc2, elem) == "window") {
				// WINDOW
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem) - 32;

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 480 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 992 - Number(elem.get(0).offsetWidth);
				}
			} else {
				// GRID
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem);

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 480 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 960 - Number(elem.get(0).offsetWidth);
				}
			}
		break;
		case 1200:
			if (getElemContainer(iframeDoc2, elem) == "window") {
				// WINDOW
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem) - 100;

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 600 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 1300 - Number(elem.get(0).offsetWidth);
				}
			} else {
				// GRID
				if (getElemAxisX(iframeDoc2, elem) == "left") {
					return getElemFieldLeft(iframeDoc2, elem);

				} else if (getElemAxisX(iframeDoc2, elem) == "center") {
					return Math.floor(getElemFieldLeft(iframeDoc2, elem) + 600 - (Number(elem.get(0).offsetWidth) / 2));

				} else if (getElemAxisX(iframeDoc2, elem) == "right") {
					return getElemFieldLeft(iframeDoc2, elem) + 1200 - Number(elem.get(0).offsetWidth);
				}
			}
		break;
		default:
			alert("Возникла ошибка в getUnifyX");
		break;
	}
}



function getUnifyY(iframeDoc2, elem) {
	switch (resolution(iframeDoc2)) {
		case 320:
		case 480:
		case 640:
			if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height_vh").length > 0) {
				if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "top") {
					// GRID CONTAINER ALIGN IN WINDOW
					// TOP
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /TOP
				} else if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "center") {
					// GRID CONTAINER ALIGN IN WINDOW
					// CENTER
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /CENTER
				} else if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "bottom") {
					// GRID CONTAINER ALIGN IN WINDOW
					// BOTTOM
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /BOTTOM
				} else if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "stretch") {
					// GRID CONTAINER ALIGN IN WINDOW
					// STRETCH
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height"))  - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /STRETCH
				}
			} else {
				if (getElemContainer(iframeDoc2, elem) == "window") {
					// WINDOW
						// TOP
					if (getElemAxisY(iframeDoc2, elem) == "top") {
						return getElemFieldTop(iframeDoc2, elem);

						// CENTER
					} else if (getElemAxisY(iframeDoc2, elem) == "center") {
						return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

						// BOTTOM
					} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
						return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
					}
				} else {
					// GRID
						// TOP
					if (getElemAxisY(iframeDoc2, elem) == "top") {
						return getElemFieldTop(iframeDoc2, elem);

						// CENTER
					} else if (getElemAxisY(iframeDoc2, elem) == "center") {
						return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

						// BOTTOM
					} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
						return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
					}
				}
			}
		break;
		case 960:
			if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height_vh").length > 0) {
				if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "top") {
					// GRID CONTAINER ALIGN IN WINDOW
					// TOP
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) + 25 - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) + 50 - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /TOP
				} else if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "center") {
					// GRID CONTAINER ALIGN IN WINDOW
					// CENTER
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem) - 50;

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) + 50 - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /CENTER
				} else if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "bottom") {
					// GRID CONTAINER ALIGN IN WINDOW
					// BOTTOM
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem) - 50;

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - 25 - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /BOTTOM
				} else if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "stretch") {
					// GRID CONTAINER ALIGN IN WINDOW
					// STRETCH
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height"))  - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /STRETCH
				}
			} else {
				if (getElemContainer(iframeDoc2, elem) == "window") {
					// WINDOW
						// TOP
					if (getElemAxisY(iframeDoc2, elem) == "top") {
						return getElemFieldTop(iframeDoc2, elem);

						// CENTER
					} else if (getElemAxisY(iframeDoc2, elem) == "center") {
						return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

						// BOTTOM
					} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
						return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
					}
				} else {
					// GRID
						// TOP
					if (getElemAxisY(iframeDoc2, elem) == "top") {
						return getElemFieldTop(iframeDoc2, elem);

						// CENTER
					} else if (getElemAxisY(iframeDoc2, elem) == "center") {
						return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

						// BOTTOM
					} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
						return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
					}
				}
			}
		break;
		case 1200:
			if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height_vh").length > 0) {
				if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "top") {
					// GRID CONTAINER ALIGN IN WINDOW
					// TOP
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) + 25 - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) + 50 - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /TOP
				} else if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "center") {
					// GRID CONTAINER ALIGN IN WINDOW
					// CENTER
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem) - 50;

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) + 50 - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /CENTER
				} else if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "bottom") {
					// GRID CONTAINER ALIGN IN WINDOW
					// BOTTOM
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem) - 50;

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - 25 - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /BOTTOM
				} else if ($(iframeDoc2).find(".tn-artboard").attr("data-artboard-valign") == "stretch") {
					// GRID CONTAINER ALIGN IN WINDOW
					// STRETCH
					if (getElemContainer(iframeDoc2, elem) == "window") {
						// WINDOW
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height"))  - Number(elem.get(0).offsetHeight);
						}
					} else {
						// GRID
							// TOP
						if (getElemAxisY(iframeDoc2, elem) == "top") {
							return getElemFieldTop(iframeDoc2, elem);

							// CENTER
						} else if (getElemAxisY(iframeDoc2, elem) == "center") {
							return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

							// BOTTOM
						} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
							return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
						}
					}
					// /STRETCH
				}
			} else {
				if (getElemContainer(iframeDoc2, elem) == "window") {
					// WINDOW
						// TOP
					if (getElemAxisY(iframeDoc2, elem) == "top") {
						return getElemFieldTop(iframeDoc2, elem);

						// CENTER
					} else if (getElemAxisY(iframeDoc2, elem) == "center") {
						return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

						// BOTTOM
					} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
						return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
					}
				} else {
					// GRID
						// TOP
					if (getElemAxisY(iframeDoc2, elem) == "top") {
						return getElemFieldTop(iframeDoc2, elem);

						// CENTER
					} else if (getElemAxisY(iframeDoc2, elem) == "center") {
						return Math.floor(getElemFieldTop(iframeDoc2, elem) + (Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) / 2) - (Number(elem.get(0).offsetHeight) / 2));

						// BOTTOM
					} else if (getElemAxisY(iframeDoc2, elem) == "bottom") {
						return getElemFieldTop(iframeDoc2, elem) + Number($(iframeDoc2).find(".tn-artboard").attr("data-artboard-height")) - Number(elem.get(0).offsetHeight);
					}
				}
			}

		break;
		default:
			alert("Возникла ошибка в getUnifyY");
		break;
	}
}




function getAttr(iframeDoc2, elem, name) {
	switch (resolution(iframeDoc2)) {
		case 320:
			return elem.attr("data-field-" + name + "-res-320-value") ||
				   elem.attr("data-field-" + name + "-res-480-value") ||
				   elem.attr("data-field-" + name + "-res-640-value") ||
				   elem.attr("data-field-" + name + "-res-960-value") ||
				   elem.attr("data-field-" + name + "-value");
		break;
		case 480:
			return elem.attr("data-field-" + name + "-res-480-value") ||
				   elem.attr("data-field-" + name + "-res-640-value") ||
				   elem.attr("data-field-" + name + "-res-960-value") ||
				   elem.attr("data-field-" + name + "-value");
		break;
		case 640:
			return elem.attr("data-field-" + name + "-res-640-value") ||
				   elem.attr("data-field-" + name + "-res-960-value") ||
				   elem.attr("data-field-" + name + "-value");
		break;
		case 960:
			return elem.attr("data-field-" + name + "-res-960-value") ||
				   elem.attr("data-field-" + name + "-value");
		break;
		case 1200:
			return elem.attr("data-field-" + name + "-value");
		break;
	}
}

function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
	r: parseInt(result[1], 16),
	g: parseInt(result[2], 16),
	b: parseInt(result[3], 16)
  } : null;
}


function getElemShadow(iframeDoc2, elem) {
	var color, opacity, x, y, blur, spread;

	color = getAttr(iframeDoc2, elem, "shadowcolor");
	if (color == undefined || color == "")
		return false;
	color = hexToRgb(color);

	opacity = getAttr(iframeDoc2, elem, "shadowopacity") || 100;
	x = getAttr(iframeDoc2, elem, "shadowx") || 0;
	y = getAttr(iframeDoc2, elem, "shadowy") || 0;
	blur = getAttr(iframeDoc2, elem, "shadowblur") || 0;
	spread = getAttr(iframeDoc2, elem, "shadowspread") || 0;

	return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + opacity + ") " + x + "px " + y + "px " + blur + "px " + spread + "px";
}


// tooltips(iframeDoc2)
// resolution(iframeDoc2)
// getElemFieldTop(iframeDoc2, elem)
// getElemFieldLeft(iframeDoc2, elem)
// setElemFieldTop(iframeDoc2, elem, pos)
// setElemFieldLeft(iframeDoc2, elem, pos)
// getElemAxisX(iframeDoc2, elem)
// getElemAxisY(iframeDoc2, elem)
// getElemContainer(iframeDoc2, elem)
// getUnifyX(iframeDoc2, elem)
// getUnifyY(iframeDoc2, elem)
// getElemShadow(iframeDoc2, elem)
// getAttr(iframeDoc2, elem, name)
// hexToRgb(hex)