// ==UserScript==
// @name         Zero
// @namespace    https://tildoshnaya.com/
// @version      0.3.5.1
// @description  description
// @author       Андрей Балыбердин
// @match        https://tilda.cc/page/*
// @match        https://tilda.cc/zero/*
// @downloadURL https://update.greasyfork.org/scripts/403240/Zero.user.js
// @updateURL https://update.greasyfork.org/scripts/403240/Zero.meta.js
// ==/UserScript==

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

						// Открывающаяся панель
						if ($(iframeDoc2).find(".sui-panel__toggleContainerFields_custom").length == 0) {
							// + Изменение настроек элемента
							$(iframeDoc2).find(".sui-panel__toggleContainerFields").after("<table class='sui-panel__table sui-panel__toggleContainerFields_custom' style='margin-top:-5px; margin-bottom:-15px;'> <tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group sui-form-group__container-togler'>+ Изменение настроек элемента</div></td> </tr></tbody></table>");
							// Открывающаяся панель разметка
							$(iframeDoc2).find(".sui-panel__section-pos").after("<div class='sui-panel__section sui-panel_hidden sui-panel__section-container_custom' style='margin-top:-10px;'>	<table class='sui-panel__table sui-panel__padd_b-10'>	 <tbody><tr class='sui-panel__tr'>	  <td class='sui-panel__td'>	  <div class='sui-form-group sui-form-group__hint'>Изменение позиционирования элемента, без изменения его позиции на странице.</div>	  </td>	 </tr>	</tbody></table>	<table class='sui-panel__table sui-panel__padd_b-10'>	 <tbody><tr class='sui-panel__tr'>	  <td class='sui-panel__td'>	  <div class='sui-form-group' data-control-field='container' data-control-value='grid'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>container</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='container_custom'>  <option value='grid' selected='selected'>Grid Container</option>  <option value='window'>Window Container</option></select></div></td></tr></tbody></table></div>	  </td>	 </tr>	</tbody></table>	<table class='sui-panel__table sui-panel__padd_b-10'>	 <tbody><tr class='sui-panel__tr'>	  <td class='sui-panel__td'>	  <div class='sui-form-group' data-control-field='axisx' data-control-value='left'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Axis X<img src='img/tn-vopros.svg' class='sui-label-ask tooltip ' data-tooltip='Set the origin of axis X'></label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='axisx_custom'>  <option value='left' selected='selected'>Left</option>  <option value='center'>Center</option>  <option value='right'>Right</option></select></div></td></tr></tbody></table></div>	  </td>	 </tr>	</tbody></table>	<table class='sui-panel__table sui-panel__padd_b-10'>	 <tbody><tr class='sui-panel__tr'>	  <td class='sui-panel__td'>	  <div class='sui-form-group' data-control-field='axisy' data-control-value='top'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Axis Y<img src='img/tn-vopros.svg' class='sui-label-ask tooltip ' data-tooltip='Set the origin of axis Y'></label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='axisy_custom'>  <option value='top' selected='selected'>Top</option>  <option value='center'>Center</option>  <option value='bottom'>Bottom</option></select></div></td></tr></tbody></table></div>	  </td>	 </tr>	</tbody></table><div class='sui-btn sui-btn-dupl remove_adaptive_single' style='padding:4px 13px;'>Удалить адаптив</div></div>");
							$(iframeDoc2).find(".sui-panel__toggleContainerFields_custom").click(function(){
								$(iframeDoc2).find(".sui-panel__section-container_custom").removeClass("sui-panel_hidden");
								$(this).css({"opacity": "0", "height": "0"});
							})


							// При изменении настроек стандартно, меняется отображение в плагине
							$(iframeDoc2).find("[name='container']").on("change", function() {
								$(iframeDoc2).find("[name='container_custom']").val($(this).val());
							})
							$(iframeDoc2).find("[name='axisx']").on("change", function() {
								$(iframeDoc2).find("[name='axisx_custom']").val($(this).val());
							})
							$(iframeDoc2).find("[name='axisy']").on("change", function() {
								$(iframeDoc2).find("[name='axisy_custom']").val($(this).val());
							})


							// CONTAINER
							$(iframeDoc2).find("[name='container_custom']").on("change", function() {
								var val = $(this).val()
								var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
								switch(resolution(iframeDoc2)) {
									case 320:
										arr.each(function(i, item) {
											$(item).attr('data-field-container-res-320-value', val)
										})
									break;
									case 480:
										arr.each(function(i, item) {
											$(item).attr('data-field-container-res-480-value', val)
										})
									break;
									case 640:
										arr.each(function(i, item) {
											$(item).attr('data-field-container-res-640-value', val)
										})
									break;
									case 960:
										arr.each(function(i, item) {
											$(item).attr('data-field-container-res-960-value', val)
										})
									break;
									case 1200:
										arr.each(function(i, item) {
											$(item).attr('data-field-container-value', val)
										})
									break;
								}
								render();

								$(iframeDoc2).find("[name='container']").val(val);
							})




							// AXIS X
							$(iframeDoc2).find("[name='axisx_custom']").on("change", function() {
								var val = $(this).val()
								var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
								switch(resolution(iframeDoc2)) {
									case 320:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisx-res-320-value', val)
										})
									break;
									case 480:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisx-res-480-value', val)
										})
									break;
									case 640:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisx-res-640-value', val)
										})
									break;
									case 960:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisx-res-960-value', val)
										})
									break;
									case 1200:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisx-value', val)
										})
									break;
								}
								render();

								$(iframeDoc2).find("[name='axisx']").val(val);
							})




							// AXIS Y
							$(iframeDoc2).find("[name='axisy_custom']").on("change", function() {
								var val = $(this).val()
								var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
								switch(resolution(iframeDoc2)) {
									case 320:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisy-res-320-value', val)
										})
									break;
									case 480:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisy-res-480-value', val)
										})
									break;
									case 640:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisy-res-640-value', val)
										})
									break;
									case 960:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisy-res-960-value', val)
										})
									break;
									case 1200:
										arr.each(function(i, item) {
											$(item).attr('data-field-axisy-value', val)
										})
									break;
								}
								render();

								$(iframeDoc2).find("[name='axisy']").val(val);
							})





							// Удаление адаптива у одного элемента
							if ($(iframeDoc2).find(".remove_adaptive_single").hasClass("ac") == false) {
								$(iframeDoc2).find(".remove_adaptive_single").addClass("ac")
								$(iframeDoc2).find(".remove_adaptive_single").on("click", function() {
									var c = confirm("Убрать адаптив у этого элемента?");
									if (c) {
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										arr.each(function(i, item) {
											var item = $(item);
											item.removeAttr("data-field-axisx-res-320-value")
												.removeAttr("data-field-axisx-res-480-value")
												.removeAttr("data-field-axisx-res-640-value")
												.removeAttr("data-field-axisx-res-960-value")
												.removeAttr("data-field-axisy-res-320-value")
												.removeAttr("data-field-axisy-res-480-value")
												.removeAttr("data-field-axisy-res-640-value")
												.removeAttr("data-field-axisy-res-960-value")
												.removeAttr("data-field-left-res-320-value")
												.removeAttr("data-field-left-res-480-value")
												.removeAttr("data-field-left-res-640-value")
												.removeAttr("data-field-left-res-960-value")
												.removeAttr("data-field-top-res-320-value")
												.removeAttr("data-field-top-res-480-value")
												.removeAttr("data-field-top-res-640-value")
												.removeAttr("data-field-top-res-960-value");
										});
										$(iframeDoc2).find(".tn-res-1200").trigger("click");
									}
								})
							}
							// /Удаление адаптива у одного элемента



						}
						// /Открывающаяся панель



						// КОПИРОВАНИЕ SBS АНИМАЦИИ
						if ($(iframeDoc2).find(".sui-btn-sbs-remove").length > 0) {
							if (localStorage.anim && $(iframeDoc2).find(".sui-btn-sbs-paste"). length == 0) {
								$(iframeDoc2).find(".sui-panel__section-sbsopenbtn .sui-btn-sbs-remove").after('<div class="sui-btn sui-btn-sbs-paste" style="padding:6px 15px; margin-top: 4px; font-weight:400;">Paste</div>');
							}
							// $(".sui-panel__section-sbsopenbtn div").last().before('<div class="sui-btn sui-btn-sbs-copy" style="padding:6px 15px; margin-top: 4px; font-weight:400;">Copy</div>')
							if ($(iframeDoc2).find(".sui-btn-sbs-copy"). length == 0) {
								$(iframeDoc2).find(".sui-panel__section-sbsopenbtn .sui-btn-sbs-remove").after('<div class="sui-btn sui-btn-sbs-copy" style="padding:6px 15px; margin-top: 4px; font-weight:400;">Copy</div>');
								$(iframeDoc2).find(".sui-panel__section-sbsopenbtn .sui-btn-sbs-remove").after('<br>');
							}
						} else {
							if (localStorage.anim && $(iframeDoc2).find(".sui-btn-sbs-paste"). length == 0) {
								$(iframeDoc2).find(".sui-panel__section-sbsopenbtn div").last().before('<div class="sui-btn sui-btn-sbs-paste" style="padding:9px 15px; margin-top: 4px; font-weight:400;">Paste</div>');
							}
						}


						$(iframeDoc2).find(".sui-btn-sbs-copy").click(function(){
							var elem = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
							var data = {
								sbsevent: elem.attr("data-field-sbsevent-value"),
								sbstrg: elem.attr("data-field-sbstrg-value"),
								sbstrgofst: elem.attr("data-field-sbstrgofst-value"),
								sbsopts: elem.attr("data-field-sbsopts-value"),
								sbsloop: elem.attr("data-field-sbsloop-value"),
								i: elem.attr("data-sbs-step-i"),
							}
							localStorage.anim = JSON.stringify(data);
						})

						$(iframeDoc2).find(".sui-btn-sbs-paste").click(function(){
							var elem = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
							var data = JSON.parse(localStorage.anim);

							elem.attr("data-field-sbsevent-value", data.sbsevent);
							elem.attr("data-field-sbstrg-value", data.sbstrg);
							elem.attr("data-field-sbstrgofst-value", data.sbstrgofst);
							elem.attr("data-field-sbsopts-value", data.sbsopts);
							elem.attr("data-field-sbsloop-value", data.sbsloop);
							elem.attr("data-sbs-step-i", data.i);
						})
						// /КОПИРОВАНИЕ SBS АНИМАЦИИ





						if ($(iframeDoc2).find(".sui-slider-ls-100").length == 0) {
							$(iframeDoc2).find(".sui-panel__section.sui-panel__section-font").append("<table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='letterspacing' data-control-value='20'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>Letter spacing</label></td><td style='width:100%;min-width:50px;'><div class=''>  <input type='text' value='0' name='fontsize' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-ls-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 88.8889%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 11.1111%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table>");

								// Массовое изменение letter spacing
								$(iframeDoc2).find(".sui-slider-ls-100").slider({
									range: "max",
									min: -50,
									max: 50,
									step: 0.1,
									value: 0,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("letter-spacing", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-letterspacing-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-letterspacing-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-letterspacing-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-letterspacing-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-letterspacing-value", t.value);
												break;
											}
										})

									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("letter-spacing", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-letterspacing-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-letterspacing-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-letterspacing-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-letterspacing-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-letterspacing-value", t.value);
												break;
											}
										})

									}
								})
								$(iframeDoc2).find(".sui-slider-ls-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-ls-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение letter spacing
						}
					}
					// /singleItem






































					if ($(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").length > 1) {
						if ($(iframeDoc2).find(".tildoshnaya_modification").length == 0)
							$(iframeDoc2).find(".sui-form-group table:nth-child(2)").after("<table><tbody><tr><td class='tildoshnaya_modification'></td></tr></tbody></table>")
						$(iframeDoc2).find(".tildoshnaya_modification").attr("style", "display: flex; flex-flow: row wrap; margin-top: 10px;");
						// $(iframeDoc2).find(".tildoshnaya_modification").attr("style", "display: flex; flex-flow: row wrap; justify-content: center; margin-top: 10px;");



						// ВЫРАВНИВАНИЯ

						// Горизонтальное выравнивание с учетом ширины элемента
						if ($(iframeDoc2).find(".horizontal").length == 0) {
							$(iframeDoc2).find(".tildoshnaya_modification").append("<div class='horizontal tooltip' data-tooltip='Горизонтальное выравнивание'><img style='height: 22px;' src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMCAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggb3BhY2l0eT0iMC4yNjAwODYiIGQ9Ik03IDVIM1YxNkg3VjVaIiBzdHJva2U9ImJsYWNrIi8+CjxwYXRoIG9wYWNpdHk9IjAuMjYwMDg2IiBkPSJNMTcgNUgxM1YxNkgxN1Y1WiIgc3Ryb2tlPSJibGFjayIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwIDFMMTAgMjBMMTAgMVoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTEwIDFMMTAgMjAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiLz4KPC9zdmc+Cg=='></div>")

							$(iframeDoc2).find(".horizontal").on("click", function(){
								var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
								// Сортировка
								function elemSort(a, b) {
									a = $(a);
									b = $(b);
									if (getUnifyX(iframeDoc2, a) > getUnifyX(iframeDoc2, b)) return 1;
									if (getUnifyX(iframeDoc2, a) < getUnifyX(iframeDoc2, b)) return -1;
								}
								var arr_sort = arr.sort(elemSort);

								// Узнаем координату первого и конец последнего элемента
								var start, end;
								if (getElemAxisX(iframeDoc2, $(arr_sort[0])) == "left") {
									start = getUnifyX(iframeDoc2, $(arr_sort[0]));
								} else {
									start = getUnifyX(iframeDoc2, $(arr_sort[0])) - arr_sort[0].offsetWidth;
								}
								if (getElemAxisX(iframeDoc2, $(arr_sort[0])) == "left") {
									end = getUnifyX(iframeDoc2, $(arr_sort[arr_sort.length - 1])) + arr_sort[arr_sort.length - 1].offsetWidth;
								} else {
									end = getUnifyX(iframeDoc2, $(arr_sort[arr_sort.length - 1]));
								}
								var boxWidth = end - start;
								// Общая ширина всех элементов
								var totalWidth = 0;
								arr_sort.each(function(i, item) {
									totalWidth += item.offsetWidth;
								})

								// Расстояние между элементами
								var step = Math.round((boxWidth - totalWidth) / (arr_sort.length - 1));

								arr_sort.each(function(i, item) {
									// От первого нам нужны только координаты
									if (i == 0) {
										return true;
									}

									var elem = $(item);
									var prevElem = $(arr_sort[i - 1]);
									var current;
									if (getElemAxisX(iframeDoc2, $(arr_sort[0])) == "left") {
										current = getUnifyX(iframeDoc2, prevElem) + prevElem.get(0).offsetWidth;
									} else {
										current = getUnifyX(iframeDoc2, prevElem) + elem.get(0).offsetWidth;
									}

									var unify = getUnifyX(iframeDoc2, elem);
									var diff = unify - current;

									var leftOld = getUnifyX(iframeDoc2, elem);
									setElemFieldLeft(iframeDoc2, elem, getElemFieldLeft(iframeDoc2, elem) - diff + step);
									var leftNew = getUnifyX(iframeDoc2, elem);

									elem.css("left", (Number(elem.css("left").slice(0, -2)) - (leftOld - leftNew)) + "px");
								})
							})
						}
						// /Горизонтальное выравнивание с учетом ширины элемента





						// Вертикальное выравнивание с учетом высоты элемента
						if ($(iframeDoc2).find(".vertical").length == 0) {
							$(iframeDoc2).find(".tildoshnaya_modification").append("<div class='vertical tooltip' data-tooltip='Вертикальное выравнивание'><img style='padding-left: 17px; height: 22px;' src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIG9wYWNpdHk9IjAuMjYwMDg2IiBkPSJNMTUuNSAzTDE1LjUgNkw1LjUgNkw1LjUgM0wxNS41IDNaIiBmaWxsPSIjQzRDNEM0IiBzdHJva2U9ImJsYWNrIi8+CjxwYXRoIG9wYWNpdHk9IjAuMjYwMDg2IiBkPSJNMTUuNSAxNUwxNS41IDE4TDUuNSAxOEw1LjUgMTVMMTUuNSAxNVoiIGZpbGw9IiNDNEM0QzQiIHN0cm9rZT0iYmxhY2siLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMCAxMC41TDEgMTAuNVoiIGZpbGw9IiNDNEM0QzQiLz4KPHBhdGggZD0iTTIwIDEwLjVMMSAxMC41IiBzdHJva2U9ImJsYWNrIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjEiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMSAwLjUpIHJvdGF0ZSg5MCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K' /></div>")

							$(iframeDoc2).find(".vertical").on("click", function() {
								var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
								// Сортировка
								function elemSort(a, b) {
									a = $(a);
									b = $(b);
									if (getUnifyY(iframeDoc2, a) > getUnifyY(iframeDoc2, b)) return 1;
									if (getUnifyY(iframeDoc2, a) < getUnifyY(iframeDoc2, b)) return -1;
								}
								var arr_sort = arr.sort(elemSort);

								// Узнаем координату первого и конец последнего элемента
								var start, end;
								if (getElemAxisY(iframeDoc2, $(arr_sort[0])) == "top") {
									start = getUnifyY(iframeDoc2, $(arr_sort[0]));
								} else {
									start = getUnifyY(iframeDoc2, $(arr_sort[0])) - arr_sort[0].offsetHeight;
								}
								if (getElemAxisY(iframeDoc2, $(arr_sort[0])) == "top") {
									end = getUnifyY(iframeDoc2, $(arr_sort[arr_sort.length - 1])) + arr_sort[arr_sort.length - 1].offsetHeight;
								} else {
									end = getUnifyY(iframeDoc2, $(arr_sort[arr_sort.length - 1]));
								}
								var boxHeight = end - start;
								// Общая ширина всех элементов
								var totalHeight = 0;
								arr_sort.each(function(i, item) {
									totalHeight += item.offsetHeight;
								})

								// Расстояние между элементами
								var step = Math.round((boxHeight - totalHeight) / (arr_sort.length - 1));


								arr_sort.each(function(i, item) {
									// От первого нам нужны только координаты
									if (i == 0) {
										return true;
									}

									var elem = $(item);
									var prevElem = $(arr_sort[i - 1]);
									var current;
									if (getElemAxisY(iframeDoc2, $(arr_sort[0])) == "top") {
										current = getUnifyY(iframeDoc2, prevElem) + prevElem.get(0).offsetHeight;
									} else {
										current = getUnifyY(iframeDoc2, prevElem) + elem.get(0).offsetHeight;
									}

									var unify = getUnifyY(iframeDoc2, elem);
									var diff = unify - current;

									var topOld = getUnifyY(iframeDoc2, elem);
									setElemFieldTop(iframeDoc2, elem, getElemFieldTop(iframeDoc2, elem) - diff + step);
									var topNew = getUnifyY(iframeDoc2, elem);


									elem.css("top", (Number(elem.css("top").slice(0, -2)) - (topOld - topNew)) + "px");
								})
							})
						}
						// /Вертикальное выравнивание с учетом высоты элемента





						// Горизонтальное выравнивание с заданой шириной
						if ($(iframeDoc2).find(".horizontal2").length == 0) {
							$(iframeDoc2).find(".tildoshnaya_modification").append("<div class='horizontal2 tooltip' data-tooltip='Горизонтальное выравнивание с заданным расстоянием' style='margin-left: 70px;'><img style='padding-left: 17px; height: 22px;' src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggb3BhY2l0eT0iMC4yNjAwODYiIGQ9Ik0xNy41IDE1LjVMMTQuNSAxNS41TDE0LjUgNC41TDE3LjUgNC41TDE3LjUgMTUuNVoiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIi8+CjxwYXRoIG9wYWNpdHk9IjAuMjYwMDg2IiBkPSJNNS41IDE1LjVMMi41IDE1LjVMMi41IDQuNUw1LjUgNC41TDUuNSAxNS41WiIgZmlsbD0id2hpdGUiIHN0cm9rZT0iYmxhY2siLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy41IDEwTDYuNSAxMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMy41IDEwTDYuNSAxMCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIvPgo8L3N2Zz4K' /></div>");

							$(iframeDoc2).find(".horizontal2").on("click", function(){
								var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
								// Узнаем ширину
								var step = prompt("Укажи расстояние между блоками:");
								if (step == null || "") {
									return;
								} else {
									step = Number(step);
								}

								// Сортировка
								function elemSort(a, b) {
									a = $(a);
									b = $(b);
									if (getUnifyX(iframeDoc2, a) > getUnifyX(iframeDoc2, b)) return 1;
									if (getUnifyX(iframeDoc2, a) < getUnifyX(iframeDoc2, b)) return -1;
								}
								var arr_sort = arr.sort(elemSort);

								arr_sort.each(function(i, item) {
									// Первый элемент оставляем на месте
									if (i == 0) {
										return true;
									}

									var elem = $(item);
									var prevElem = $(arr_sort[i - 1]);
									var current;

									current = Number(getUnifyX(iframeDoc2, prevElem)) + Number(prevElem.get(0).offsetWidth);
									var unify = getUnifyX(iframeDoc2, elem);
									var diff = unify - current;

									var leftOld = getElemFieldLeft(iframeDoc2, elem);
									setElemFieldLeft(iframeDoc2, elem, getElemFieldLeft(iframeDoc2, elem) - diff + step)

									var leftNew = getElemFieldLeft(iframeDoc2, elem);

									elem.css("left", (Number(elem.css("left").slice(0, -2)) - (leftOld - leftNew)) + "px");
								})
							})
						}
						// /Горизонтальное выравнивание с заданой шириной




						// Вертикальное выравнивание с заданой высотой
						if ($(iframeDoc2).find(".vertical2").length == 0) {
							$(iframeDoc2).find(".tildoshnaya_modification").append("<div class='vertical2 tooltip' data-tooltip='Вертикальное выравнивание с заданным расстоянием'><img style='padding-left: 17px; height: 22px;' src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMCAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggb3BhY2l0eT0iMC4yNjAwODYiIGQ9Ik00LjUgMThMNC41IDE1TDE1LjUgMTVMMTUuNSAxOEw0LjUgMThaIiBmaWxsPSIjQzRDNEM0IiBzdHJva2U9ImJsYWNrIi8+CjxwYXRoIG9wYWNpdHk9IjAuMjYwMDg2IiBkPSJNNC41IDUuOTk5OTdMNC41IDIuOTk5OTdMMTUuNSAyLjk5OTk3TDE1LjUgNS45OTk5N0w0LjUgNS45OTk5N1oiIGZpbGw9IiNDNEM0QzQiIHN0cm9rZT0iYmxhY2siLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCAxNEwxMCA3WiIgZmlsbD0iI0M0QzRDNCIvPgo8cGF0aCBkPSJNMTAgMTRMMTAgNyIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIvPgo8L3N2Zz4K' /></div>");

							$(iframeDoc2).find(".vertical2").on("click", function(){
								var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
								// Узнаем высоту
								var step = prompt("Укажи расстояние между блоками:");
								if (step == null || "") {
									return;
								} else {
									step = Number(step);
								}

								// Сортировка
								function elemSort(a, b) {
									a = $(a);
									b = $(b);
									if (getUnifyY(iframeDoc2, a) > getUnifyY(iframeDoc2, b)) return 1;
									if (getUnifyY(iframeDoc2, a) < getUnifyY(iframeDoc2, b)) return -1;
								}
								var arr_sort = arr.sort(elemSort);

								arr_sort.each(function(i, item) {
									// Первый элемент оставляем на месте
									if (i == 0) {
										return true;
									}

									var elem = $(item);
									var prevElem = $(arr_sort[i - 1]);
									var current;
									current = Number(getUnifyY(iframeDoc2, prevElem)) + Number(prevElem.get(0).offsetHeight);
									var unify = getUnifyY(iframeDoc2, elem);
									var diff = unify - current;

									var topOld = getElemFieldTop(iframeDoc2, elem);
									setElemFieldTop(iframeDoc2, elem, getElemFieldTop(iframeDoc2, elem) - diff + step)
									var topNew = getElemFieldTop(iframeDoc2, elem);

									elem.css("top", (Number(elem.css("top").slice(0, -2)) - (topOld - topNew)) + "px");
								})
							})
						}
						// /Вертикальное выравнивание с заданой высотой


						// / ВЫРАВНИВАНИЯ












						// Открывающаяся панель
						if ($(iframeDoc2).find(".sui-panel__toggleContainerFields_custom").length == 0) {
							// + Изменение настроек элемента
							$(iframeDoc2).find(".sui-panel__section.sui-panel__section-align").append("<table class='sui-panel__table sui-panel__toggleContainerFields_custom' style='margin-top:-5px; margin-bottom:-15px;'> <tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group sui-form-group__container-togler'>+ Изменение настроек элементов</div></td> </tr></tbody></table>");
							// Открывающаяся панель разметка
							$(iframeDoc2).find(".sui-panel__toggleContainerFields_custom").click(function(){
								$(iframeDoc2).find(".sui-panel__section.sui-panel__section-align").after("<div class='sui-panel__section sui-panel_hidden sui-panel__section-container_custom' style='margin-top:-10px;'>	<table class='sui-panel__table sui-panel__padd_b-10'>	 <tbody><tr class='sui-panel__tr'>	  <td class='sui-panel__td'>	  <div class='sui-form-group sui-form-group__hint'>Изменение позиционирования элементов, без изменения их позиции на странице.</div>	  </td>	 </tr>	</tbody></table>	<table class='sui-panel__table sui-panel__padd_b-10'>	 <tbody><tr class='sui-panel__tr'>	  <td class='sui-panel__td'>	  <div class='sui-form-group' data-control-field='container' data-control-value='grid'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>container</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='container_custom'>  <option value='grid' selected='selected'>Grid Container</option>  <option value='window'>Window Container</option></select></div></td></tr></tbody></table></div>	  </td>	 </tr>	</tbody></table>	<table class='sui-panel__table sui-panel__padd_b-10'>	 <tbody><tr class='sui-panel__tr'>	  <td class='sui-panel__td'>	  <div class='sui-form-group' data-control-field='axisx' data-control-value='left'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Axis X<img src='img/tn-vopros.svg' class='sui-label-ask tooltip ' data-tooltip='Set the origin of axis X'></label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='axisx_custom'>  <option value='left' selected='selected'>Left</option>  <option value='center'>Center</option>  <option value='right'>Right</option></select></div></td></tr></tbody></table></div>	  </td>	 </tr>	</tbody></table>	<table class='sui-panel__table sui-panel__padd_b-10'>	 <tbody><tr class='sui-panel__tr'>	  <td class='sui-panel__td'>	  <div class='sui-form-group' data-control-field='axisy' data-control-value='top'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Axis Y<img src='img/tn-vopros.svg' class='sui-label-ask tooltip ' data-tooltip='Set the origin of axis Y'></label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='axisy_custom'>  <option value='top' selected='selected'>Top</option>  <option value='center'>Center</option>  <option value='bottom'>Bottom</option></select></div></td></tr></tbody></table></div>	  </td>	 </tr>	</tbody></table><div class='sui-btn sui-btn-dupl remove_adaptive_single' style='padding:4px 13px;'>Удалить адаптив</div></div>");
								$(iframeDoc2).find(".sui-panel__section-container_custom").removeClass("sui-panel_hidden");
								$(this).css({"opacity": "0", "height": "0"});


								// При изменении настроек стандартно, меняется отображение в плагине
								$(iframeDoc2).find("[name='container']").on("change", function() {
									$(iframeDoc2).find("[name='container_custom']").val($(this).val());
								})
								$(iframeDoc2).find("[name='axisx']").on("change", function() {
									$(iframeDoc2).find("[name='axisx_custom']").val($(this).val());
								})
								$(iframeDoc2).find("[name='axisy']").on("change", function() {
									$(iframeDoc2).find("[name='axisy_custom']").val($(this).val());
								})


								// CONTAINER
								$(iframeDoc2).find("[name='container_custom']").on("change", function() {
									var val = $(this).val()
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									switch(resolution(iframeDoc2)) {
										case 320:
											arr.each(function(i, item) {
												$(item).attr('data-field-container-res-320-value', val)
											})
										break;
										case 480:
											arr.each(function(i, item) {
												$(item).attr('data-field-container-res-480-value', val)
											})
										break;
										case 640:
											arr.each(function(i, item) {
												$(item).attr('data-field-container-res-640-value', val)
											})
										break;
										case 960:
											arr.each(function(i, item) {
												$(item).attr('data-field-container-res-960-value', val)
											})
										break;
										case 1200:
											arr.each(function(i, item) {
												$(item).attr('data-field-container-value', val)
											})
										break;
									}
									render();

									$(iframeDoc2).find("[name='container']").val(val);
								})




								// AXIS X
								$(iframeDoc2).find("[name='axisx_custom']").on("change", function() {
									var val = $(this).val()
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									switch(resolution(iframeDoc2)) {
										case 320:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisx-res-320-value', val)
											})
										break;
										case 480:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisx-res-480-value', val)
											})
										break;
										case 640:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisx-res-640-value', val)
											})
										break;
										case 960:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisx-res-960-value', val)
											})
										break;
										case 1200:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisx-value', val)
											})
										break;
									}
									render();

									$(iframeDoc2).find("[name='axisx']").val(val);
								})




								// AXIS Y
								$(iframeDoc2).find("[name='axisy_custom']").on("change", function() {
									var val = $(this).val()
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									switch(resolution(iframeDoc2)) {
										case 320:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisy-res-320-value', val)
											})
										break;
										case 480:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisy-res-480-value', val)
											})
										break;
										case 640:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisy-res-640-value', val)
											})
										break;
										case 960:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisy-res-960-value', val)
											})
										break;
										case 1200:
											arr.each(function(i, item) {
												$(item).attr('data-field-axisy-value', val)
											})
										break;
									}
									render();

									$(iframeDoc2).find("[name='axisy']").val(val);
								})






								// Удаление адаптива у нескольких элементов
								if ($(iframeDoc2).find(".remove_adaptive_single").hasClass("ac") == false) {
									$(iframeDoc2).find(".remove_adaptive_single").addClass("ac")
									$(iframeDoc2).find(".remove_adaptive_single").on("click", function() {
										var c = confirm("Убрать адаптив у этого элемента?");
										if (c) {
											var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
											arr.each(function(i, item) {
												var item = $(item);
												item.removeAttr("data-field-axisx-res-320-value")
													.removeAttr("data-field-axisx-res-480-value")
													.removeAttr("data-field-axisx-res-640-value")
													.removeAttr("data-field-axisx-res-960-value")
													.removeAttr("data-field-axisy-res-320-value")
													.removeAttr("data-field-axisy-res-480-value")
													.removeAttr("data-field-axisy-res-640-value")
													.removeAttr("data-field-axisy-res-960-value")
													.removeAttr("data-field-left-res-320-value")
													.removeAttr("data-field-left-res-480-value")
													.removeAttr("data-field-left-res-640-value")
													.removeAttr("data-field-left-res-960-value")
													.removeAttr("data-field-top-res-320-value")
													.removeAttr("data-field-top-res-480-value")
													.removeAttr("data-field-top-res-640-value")
													.removeAttr("data-field-top-res-960-value");
											});
											$(iframeDoc2).find(".tn-res-1200").trigger("click");
										}
									})
								}
								// /Удаление адаптива у нескольких элементов

							})

						}
						// /Открывающаяся панель














						var type;
						var text = 0;
						var shape = 0;
						var image = 0;
						var button = 0;
						var video = 0;
						var tooltip = 0;
						var html = 0;
						var form = 0;

						$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function(i, item){
							type = $(item).attr("data-elem-type");
							switch (type) {
								case "text":
									text++;
								break;
								case "shape":
									shape++;
								break;
								case "image":
									image++;
								break;
								case "button":
									button++;
								break;
								case "video":
									video++;
								break;
								case "tooltip":
									tooltip++;
								break;
								case "html":
									html++;
								break;
								case "form":
									form++;
								break;
							}
						})
						var elemSelectedLength = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").length;
















						// TEXT ONLY
						if (elemSelectedLength == text) {
							if ($(iframeDoc2).find(".sui-panel__section-font").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-font'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='align' data-control-value='right'><div class='sui-radio'><div class='sui-radio-div ui-controlgroup ui-controlgroup-horizontal ui-helper-clearfix' role='toolbar'><table><tbody><tr><td><input type='radio' id='left' name='align' class='ui-checkboxradio ui-helper-hidden-accessible'><label for='left' class='ui-button ui-widget ui-checkboxradio-radio-label ui-controlgroup-item ui-checkboxradio-label ui-corner-left'><span class='ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-blank'></span><span class='ui-checkboxradio-icon-space'> </span>Left</label></td><td><input type='radio' id='center' name='align' class='ui-checkboxradio ui-helper-hidden-accessible'><label for='center' class='ui-button ui-widget ui-checkboxradio-radio-label ui-checkboxradio-label ui-controlgroup-item'><span class='ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-blank'></span><span class='ui-checkboxradio-icon-space'> </span>Center</label></td><td><input type='radio' id='right' name='align' checked='checked' class='ui-checkboxradio ui-helper-hidden-accessible'><label for='right' class='ui-button ui-widget ui-checkboxradio-radio-label ui-controlgroup-item ui-checkboxradio-label ui-corner-right'><span class='ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-blank ui-state-hover'></span><span class='ui-checkboxradio-icon-space'> </span>Right</label></td></tr></tbody></table></div></div></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-value='#ffffff'><table><tbody><tr><td><label class='sui-label'>color</label></td><td style='width:100%;'><div class='sui-input-div'><input type='text' value='#ffffff' class='sui-input color' autocomplete='off' size='7'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontsize' data-control-value='20'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>size</label></td><td style='width:100%;min-width:50px;'><div class=''>	<input type='text' value='20' name='fontsize' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-fs-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 88.8889%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 11.1111%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontfamily' data-control-value='Circe'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Typeface<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Connect other fonts in <a href=&quot;/projects/settings/?projectid=1140174&quot; target=&quot;_blank&quot; style=&quot;color:#fff; text-decoration:underline; font-weight:bold;&quot;>Site&nbsp;Settings</a>. '></label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='fontfamily'><option value='Arial'>Arial</option><option value='Georgia'>Georgia</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontweight' data-control-value='400'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Weight</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='fontweight'><option value='100'>Thin</option><option value='300'>Light</option><option value='400' selected='selected'>Normal</option><option value='500'>Medium</option><option value='600'>Semi Bold</option><option value='700'>Bold</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='lineheight' data-control-value='1.55'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>spacing</label></td><td style='width:100%;min-width:50px;'><div class=''>	<input type='text' value='1.55' name='lineheight' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-lh-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 45%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 55%;'></span></div></td></tr></tbody></table></div></td><td class='sui-panel__td'><div class='sui-form-group' data-control-field='letterspacing' data-control-value='0'><table style='width:100%;'><tbody><tr><td></td><td style='width:100%;min-width:50px;'><div class=''>	<input type='text' value='0' name='letterspacing' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-ls-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");




								// Изменение выравнивания текста
								$(iframeDoc2).find("[name='align']").click(function(){
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);
									var e = $(this);
									arr.each(function(i, item){
										switch (res) {
											case 320:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-320-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-320-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-320-value", "right").css("text-align", "right");
													})
												}
											break;
											case 480:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-480-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-480-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-480-value", "right").css("text-align", "right");
													})
												}
											break;
											case 640:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-640-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-640-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-640-value", "right").css("text-align", "right");
													})
												}
											break;
											case 960:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-960-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-960-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-960-value", "right").css("text-align", "right");
													})
												}
											break;
											case 1200:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-value", "right").css("text-align", "right");
													})
												}
											break;
										}
									})
								})
								// /Изменение выравнивания текста







								// // Массовое изменение цвета текста
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;


								iframeWindow.jQuery(".color").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-color-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-color-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-color-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-color-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-color-value", color);
												break;
											}
											$(item).find(".tn-atom").css("color", color);
										})
									}
								});
								// /Массовое изменение цвета текста




								// Массовое изменение размера текста
								$(iframeDoc2).find(".sui-slider-fs-100").slider({
									range: "max",
									min: 10,
									max: 100,
									step: 1,
									value: 20,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("font-size", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-fontsize-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-fontsize-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-fontsize-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-fontsize-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-fontsize-value", t.value);
												break;
											}
										})
									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("font-size", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-fontsize-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-fontsize-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-fontsize-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-fontsize-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-fontsize-value", t.value);
												break;
											}
										})

									}
								})
								$(iframeDoc2).find(".sui-slider-fs-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-fs-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение размера текста





								// Массовое изменение шрифта
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								var headlinefont = iframeWindow.$headlinefont;
								var textfont = iframeWindow.$textfont;
								$(iframeDoc2).find("[name='fontfamily']").prepend("<option value='" + headlinefont + "'>" + headlinefont + "</option>")
								$(iframeDoc2).find("[name='fontfamily']").prepend("<option selected value='" + textfont + "'>" + textfont + "</option>")

								$(iframeDoc2).find("[name='fontfamily']").change(function(){
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-fontfamily-value", this.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").css("font-family", this.value);
								})
								// /Массовое изменение шрифта




								// Массовое изменение шрифта
								$(iframeDoc2).find("[name='fontweight']").change(function(){
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-fontweight-value", this.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").css("font-weight", this.value);
								})
								// /Массовое изменение шрифта





								// Массовое изменение высоты строки
								$(iframeDoc2).find(".sui-slider-lh-100").slider({
									range: "max",
									min: 1,
									max: 2,
									step: 0.05,
									value: 1.55,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("line-height", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-lineheight-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-lineheight-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-lineheight-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-lineheight-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-lineheight-value", t.value);
												break;
											}
										})
									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("line-height", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-lineheight-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-lineheight-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-lineheight-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-lineheight-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-lineheight-value", t.value);
												break;
											}
										})
									},

								})
								$(iframeDoc2).find(".sui-slider-lh-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-lh-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение высоты строки





								// Массовое изменение letter spacing
								$(iframeDoc2).find(".sui-slider-ls-100").slider({
									range: "max",
									min: -50,
									max: 50,
									step: 0.1,
									value: 0,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("letter-spacing", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-letterspacing-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-letterspacing-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-letterspacing-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-letterspacing-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-letterspacing-value", t.value);
												break;
											}
										})

									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("letter-spacing", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-letterspacing-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-letterspacing-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-letterspacing-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-letterspacing-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-letterspacing-value", t.value);
												break;
											}
										})

									}
								})
								$(iframeDoc2).find(".sui-slider-ls-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-ls-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение letter spacing
							}




							// /TEXT ONLY
						}


















						// SHAPE ONLY
						if (elemSelectedLength == shape) {




							if ($(iframeDoc2).find(".sui-panel__section-bgcolor").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-bgcolor'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='bgcolor' data-control-value='rgba(0,0,0,.5)'><table><tbody><tr><td><label class='sui-label'>bgcolor</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' name='bgcolor' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");




								// Массовое изменение background
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;

								iframeWindow.jQuery("[name='bgcolor']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-bgcolor-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-bgcolor-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-bgcolor-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-bgcolor-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-bgcolor-value", color);
												break;
											}
											$(item).find(".tn-atom").css("background-color", color);
										})
									}
								});
							}
							// / Массовое изменение background









							if ($(iframeDoc2).find(".sui-panel__section-border").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-border'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='bordercolor' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Border</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='' name='bordercolor' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='borderwidth' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Brdr.size</label></td><td style='width:100%;'><div class='sui-input-div'>	<input type='text' value='' name='borderwidth' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='borderradius' data-control-value=''><table><tbody><tr><td><label class='sui-label'>radius</label></td><td style='width:100%;'><div class='sui-input-div'>	<input type='text' value='' name='borderradius' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='borderstyle' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Style</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='borderstyle'><option value='solid'>Solid</option><option value='dotted'>Dotted</option><option value='dashed'>Dashed</option><option value='none'>None</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");






								// Массовое изменение border color
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='bordercolor']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-bordercolor-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-bordercolor-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-bordercolor-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-bordercolor-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-bordercolor-value", color);
												break;
											}
											$(item).find(".tn-atom").css("border-color", color);
										})
									}
								});
								// / Массовое изменение border color





								//  Массовое изменение border width
								$(iframeDoc2).find("[name='borderwidth']").change(function(){
									var width = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-borderwidth-res-320-value", width);
											break;
											case 480:
												$(item).attr("data-field-borderwidth-res-480-value", width);
											break;
											case 640:
												$(item).attr("data-field-borderwidth-res-640-value", width);
											break;
											case 960:
												$(item).attr("data-field-borderwidth-res-960-value", width);
											break;
											case 1200:
												$(item).attr("data-field-borderwidth-value", width);
											break;
										}
										$(item).find(".tn-atom").css("border-width", width);
									})
								})
								// / Массовое изменение border width




								//  Массовое изменение border radius
								$(iframeDoc2).find("[name='borderradius']").change(function(){
									var radius = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-borderradius-res-320-value", radius);
											break;
											case 480:
												$(item).attr("data-field-borderradius-res-480-value", radius);
											break;
											case 640:
												$(item).attr("data-field-borderradius-res-640-value", radius);
											break;
											case 960:
												$(item).attr("data-field-borderradius-res-960-value", radius);
											break;
											case 1200:
												$(item).attr("data-field-borderradius-value", radius);
											break;
										}
										$(item).find(".tn-atom").css("border-radius", radius + "px");
									})
								})
								// / Массовое изменение border radius




								//  Массовое изменение border style
								$(iframeDoc2).find("[name='borderstyle']").change(function(){
									var style = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-borderstyle-res-320-value", style);
											break;
											case 480:
												$(item).attr("data-field-borderstyle-res-480-value", style);
											break;
											case 640:
												$(item).attr("data-field-borderstyle-res-640-value", style);
											break;
											case 960:
												$(item).attr("data-field-borderstyle-res-960-value", style);
											break;
											case 1200:
												$(item).attr("data-field-borderstyle-value", style);
											break;
										}
										$(item).find(".tn-atom").css("border-style", style);
									})
								})
								// / Массовое изменение border style
							}






							if ($(iframeDoc2).find(".sui-panel__section-shadow").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-shadow'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowcolor' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Shadow</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='' name='shadowcolor' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowopacity' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Opacity</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='shadowopacity'><option value='1'>100%</option><option value='0.9'>90%</option><option value='0.8'>80%</option><option value='0.7'>70%</option><option value='0.6'>60%</option><option value='0.5'>50%</option><option value='0.4'>40%</option><option value='0.3'>30%</option><option value='0.2'>20%</option><option value='0.1'>10%</option><option value='0'>0%</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowx' data-control-value=''><table><tbody><tr><td><label class='sui-label'>offset x</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowx' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowy' data-control-value=''><table><tbody><tr><td><label class='sui-label'>offset y</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowy' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowblur' data-control-value=''><table><tbody><tr><td><label class='sui-label'>blur</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowblur' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowspread' data-control-value=''><table><tbody><tr><td><label class='sui-label'>spread</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowspread' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");


								// Массовое изменение shadow color
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='shadowcolor']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-shadowcolor-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-shadowcolor-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-shadowcolor-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-shadowcolor-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-shadowcolor-value", color);
												break;
											}
											$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
										})
									}
								});
								// / Массовое изменение shadow color





								//  Массовое изменение shadow opacity
								$(iframeDoc2).find("[name='shadowopacity']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowopacity-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowopacity-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowopacity-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowopacity-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowopacity-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow opacity




								//  Массовое изменение shadow x
								$(iframeDoc2).find("[name='shadowx']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowx-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowx-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowx-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowx-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowx-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow x




								//  Массовое изменение shadow y
								$(iframeDoc2).find("[name='shadowy']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowy-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowy-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowy-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowy-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowy-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow y




								//  Массовое изменение shadow blur
								$(iframeDoc2).find("[name='shadowblur']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowblur-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowblur-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowblur-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowblur-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowblur-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow blur




								//  Массовое изменение shadow spread
								$(iframeDoc2).find("[name='shadowspread']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowspread-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowspread-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowspread-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowspread-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowspread-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow spread
							}




						// /SHAPE ONLY
						}



						// IMAGE ONLY
						if (elemSelectedLength == image) {




							if ($(iframeDoc2).find(".sui-panel__section-border").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-border'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='bordercolor' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Border</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='' name='bordercolor' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='borderwidth' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Brdr.size</label></td><td style='width:100%;'><div class='sui-input-div'>	<input type='text' value='' name='borderwidth' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='borderradius' data-control-value=''><table><tbody><tr><td><label class='sui-label'>radius</label></td><td style='width:100%;'><div class='sui-input-div'>	<input type='text' value='' name='borderradius' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='borderstyle' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Style</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='borderstyle'><option value='solid'>Solid</option><option value='dotted'>Dotted</option><option value='dashed'>Dashed</option><option value='none'>None</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");







								// Массовое изменение border color
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='bordercolor']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-bordercolor-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-bordercolor-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-bordercolor-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-bordercolor-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-bordercolor-value", color);
												break;
											}
											$(item).find(".tn-atom").css("border-color", color);
										})
									}
								});
								// / Массовое изменение border color





								//  Массовое изменение border width
								$(iframeDoc2).find("[name='borderwidth']").change(function(){
									var width = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-borderwidth-res-320-value", width);
											break;
											case 480:
												$(item).attr("data-field-borderwidth-res-480-value", width);
											break;
											case 640:
												$(item).attr("data-field-borderwidth-res-640-value", width);
											break;
											case 960:
												$(item).attr("data-field-borderwidth-res-960-value", width);
											break;
											case 1200:
												$(item).attr("data-field-borderwidth-value", width);
											break;
										}
										$(item).find(".tn-atom").css("border-width", width);
									})
								})
								// / Массовое изменение border width




								//  Массовое изменение border radius
								$(iframeDoc2).find("[name='borderradius']").change(function(){
									var radius = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-borderradius-res-320-value", radius);
											break;
											case 480:
												$(item).attr("data-field-borderradius-res-480-value", radius);
											break;
											case 640:
												$(item).attr("data-field-borderradius-res-640-value", radius);
											break;
											case 960:
												$(item).attr("data-field-borderradius-res-960-value", radius);
											break;
											case 1200:
												$(item).attr("data-field-borderradius-value", radius);
											break;
										}
										$(item).find(".tn-atom").css("border-radius", radius + "px");
										$(item).find("img").css("border-radius", radius + "px");
									})
								})
								// / Массовое изменение border radius




								//  Массовое изменение border style
								$(iframeDoc2).find("[name='borderstyle']").change(function(){
									var style = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-borderstyle-res-320-value", style);
											break;
											case 480:
												$(item).attr("data-field-borderstyle-res-480-value", style);
											break;
											case 640:
												$(item).attr("data-field-borderstyle-res-640-value", style);
											break;
											case 960:
												$(item).attr("data-field-borderstyle-res-960-value", style);
											break;
											case 1200:
												$(item).attr("data-field-borderstyle-value", style);
											break;
										}
										$(item).find(".tn-atom").css("border-style", style);
									})
								})
								// / Массовое изменение border style
							}






							if ($(iframeDoc2).find(".sui-panel__section-shadow").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-shadow'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowcolor' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Shadow</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='' name='shadowcolor' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowopacity' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Opacity</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='shadowopacity'><option value='1'>100%</option><option value='0.9'>90%</option><option value='0.8'>80%</option><option value='0.7'>70%</option><option value='0.6'>60%</option><option value='0.5'>50%</option><option value='0.4'>40%</option><option value='0.3'>30%</option><option value='0.2'>20%</option><option value='0.1'>10%</option><option value='0'>0%</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowx' data-control-value=''><table><tbody><tr><td><label class='sui-label'>offset x</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowx' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowy' data-control-value=''><table><tbody><tr><td><label class='sui-label'>offset y</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowy' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowblur' data-control-value=''><table><tbody><tr><td><label class='sui-label'>blur</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowblur' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowspread' data-control-value=''><table><tbody><tr><td><label class='sui-label'>spread</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowspread' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");


								// Массовое изменение shadow color
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='shadowcolor']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-shadowcolor-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-shadowcolor-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-shadowcolor-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-shadowcolor-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-shadowcolor-value", color);
												break;
											}
											$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
										})
									}
								});
								// / Массовое изменение shadow color





								//  Массовое изменение shadow opacity
								$(iframeDoc2).find("[name='shadowopacity']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowopacity-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowopacity-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowopacity-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowopacity-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowopacity-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow opacity




								//  Массовое изменение shadow x
								$(iframeDoc2).find("[name='shadowx']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowx-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowx-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowx-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowx-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowx-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow x




								//  Массовое изменение shadow y
								$(iframeDoc2).find("[name='shadowy']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowy-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowy-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowy-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowy-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowy-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow y




								//  Массовое изменение shadow blur
								$(iframeDoc2).find("[name='shadowblur']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowblur-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowblur-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowblur-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowblur-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowblur-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow blur




								//  Массовое изменение shadow spread
								$(iframeDoc2).find("[name='shadowspread']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowspread-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowspread-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowspread-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowspread-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowspread-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow spread
							}





						// /IMAGE ONLY
						}




						// BUTTON ONLY
						if (elemSelectedLength == button) {


							if ($(iframeDoc2).find(".sui-panel__section-bgcolor").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-bgcolor'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='bgcolor' data-control-value='rgba(0,0,0,.5)'><table><tbody><tr><td><label class='sui-label'>bgcolor</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' name='bgcolor' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");


								// Массовое изменение background
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;

								iframeWindow.jQuery("[name='bgcolor']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-bgcolor-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-bgcolor-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-bgcolor-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-bgcolor-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-bgcolor-value", color);
												break;
											}
											$(item).find(".tn-atom").css("background-color", color);
										})
									}
								});
							}
							// / Массовое изменение background



							if ($(iframeDoc2).find(".sui-panel__section-font").length == 0 && resolution(iframeDoc2) == 1200) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-font'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-value='#ffffff'><table><tbody><tr><td><label class='sui-label'>color</label></td><td style='width:100%;'><div class='sui-input-div'><input type='text' value='#ffffff' class='sui-input color' autocomplete='off' size='7'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontsize' data-control-value='20'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>size</label></td><td style='width:100%;min-width:50px;'><div class=''>	<input type='text' value='20' name='fontsize' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-fs-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 88.8889%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 11.1111%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontfamily' data-control-value='Circe'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Typeface<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Connect other fonts in <a href=&quot;/projects/settings/?projectid=1140174&quot; target=&quot;_blank&quot; style=&quot;color:#fff; text-decoration:underline; font-weight:bold;&quot;>Site&nbsp;Settings</a>. '></label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='fontfamily'><option value='Arial'>Arial</option><option value='Georgia'>Georgia</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontweight' data-control-value='400'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Weight</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='fontweight'><option value='100'>Thin</option><option value='300'>Light</option><option value='400' selected='selected'>Normal</option><option value='500'>Medium</option><option value='600'>Semi Bold</option><option value='700'>Bold</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='lineheight' data-control-value='1.55'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>spacing</label></td><td style='width:100%;min-width:50px;'><div class=''>	<input type='text' value='1.55' name='lineheight' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-lh-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 45%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 55%;'></span></div></td></tr></tbody></table></div></td><td class='sui-panel__td'><div class='sui-form-group' data-control-field='letterspacing' data-control-value='0'><table style='width:100%;'><tbody><tr><td></td><td style='width:100%;min-width:50px;'><div class=''>	<input type='text' value='0' name='letterspacing' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-ls-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");



								// // Массовое изменение цвета текста
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery(".color").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-color-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-color-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-color-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-color-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-color-value", color);
												break;
											}
											$(item).find(".tn-atom").css("color", color);
										})
									}
								});
								// /Массовое изменение цвета текста




								// Массовое изменение размера текста
								$(iframeDoc2).find(".sui-slider-fs-100").slider({
									range: "max",
									min: 10,
									max: 100,
									step: 1,
									value: 20,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("font-size", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-fontsize-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-fontsize-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-fontsize-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-fontsize-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-fontsize-value", t.value);
												break;
											}
										})
									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("font-size", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-fontsize-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-fontsize-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-fontsize-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-fontsize-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-fontsize-value", t.value);
												break;
											}
										})
									}
								})
								$(iframeDoc2).find(".sui-slider-fs-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-fs-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение размера текста





								// Массовое изменение шрифта
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								var headlinefont = iframeWindow.$headlinefont;
								var textfont = iframeWindow.$textfont;
								$(iframeDoc2).find("[name='fontfamily']").prepend("<option value='" + headlinefont + "'>" + headlinefont + "</option>")
								$(iframeDoc2).find("[name='fontfamily']").prepend("<option selected value='" + textfont + "'>" + textfont + "</option>")

								$(iframeDoc2).find("[name='fontfamily']").change(function(){
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-fontfamily-value", this.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").css("font-family", this.value);
								})
								// /Массовое изменение шрифта




								// Массовое изменение шрифта
								$(iframeDoc2).find("[name='fontweight']").change(function(){
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-fontweight-value", this.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").css("font-weight", this.value);
								})
								// /Массовое изменение шрифта





								// Массовое изменение высоты строки
								$(iframeDoc2).find(".sui-slider-lh-100").slider({
									range: "max",
									min: 1,
									max: 2,
									step: 0.05,
									value: 1.55,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("line-height", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-lineheight-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-lineheight-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-lineheight-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-lineheight-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-lineheight-value", t.value);
												break;
											}
										})

									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("line-height", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-lineheight-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-lineheight-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-lineheight-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-lineheight-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-lineheight-value", t.value);
												break;
											}
										})

									}
								})
								$(iframeDoc2).find(".sui-slider-lh-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-lh-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение высоты строки





								// Массовое изменение letter spacing
								$(iframeDoc2).find(".sui-slider-ls-100").slider({
									range: "max",
									min: -50,
									max: 50,
									step: 0.1,
									value: 0,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("letter-spacing", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-letterspacing-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-letterspacing-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-letterspacing-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-letterspacing-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-letterspacing-value", t.value);
												break;
											}
										})
									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("letter-spacing", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-letterspacing-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-letterspacing-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-letterspacing-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-letterspacing-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-letterspacing-value", t.value);
												break;
											}
										})
									}
								})
								$(iframeDoc2).find(".sui-slider-ls-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-ls-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение letter spacing
							}







							if ($(iframeDoc2).find(".sui-panel__section-border").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-border'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='bordercolor' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Border</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='' name='bordercolor' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='borderwidth' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Brdr.size</label></td><td style='width:100%;'><div class='sui-input-div'>	<input type='text' value='' name='borderwidth' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='borderradius' data-control-value=''><table><tbody><tr><td><label class='sui-label'>radius</label></td><td style='width:100%;'><div class='sui-input-div'>	<input type='text' value='' name='borderradius' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='borderstyle' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Style</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='borderstyle'><option value='solid'>Solid</option><option value='dotted'>Dotted</option><option value='dashed'>Dashed</option><option value='none'>None</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");







								// Массовое изменение border color
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='bordercolor']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-bordercolor-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-bordercolor-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-bordercolor-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-bordercolor-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-bordercolor-value", color);
												break;
											}
											$(item).find(".tn-atom").css("border-color", color);
										})
									}
								});
								// / Массовое изменение border color





								//  Массовое изменение border width
								$(iframeDoc2).find("[name='borderwidth']").change(function(){
									var width = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-borderwidth-res-320-value", width);
											break;
											case 480:
												$(item).attr("data-field-borderwidth-res-480-value", width);
											break;
											case 640:
												$(item).attr("data-field-borderwidth-res-640-value", width);
											break;
											case 960:
												$(item).attr("data-field-borderwidth-res-960-value", width);
											break;
											case 1200:
												$(item).attr("data-field-borderwidth-value", width);
											break;
										}
										$(item).find(".tn-atom").css("border-width", width);
									})
								})
								// / Массовое изменение border width




								//  Массовое изменение border radius
								$(iframeDoc2).find("[name='borderradius']").change(function(){
									var radius = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-borderradius-res-320-value", radius);
											break;
											case 480:
												$(item).attr("data-field-borderradius-res-480-value", radius);
											break;
											case 640:
												$(item).attr("data-field-borderradius-res-640-value", radius);
											break;
											case 960:
												$(item).attr("data-field-borderradius-res-960-value", radius);
											break;
											case 1200:
												$(item).attr("data-field-borderradius-value", radius);
											break;
										}
										$(item).find(".tn-atom").css("border-radius", radius + "px");
									})
								})
								// / Массовое изменение border radius




								//  Массовое изменение border style
								$(iframeDoc2).find("[name='borderstyle']").change(function(){
									var style = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-borderstyle-res-320-value", style);
											break;
											case 480:
												$(item).attr("data-field-borderstyle-res-480-value", style);
											break;
											case 640:
												$(item).attr("data-field-borderstyle-res-640-value", style);
											break;
											case 960:
												$(item).attr("data-field-borderstyle-res-960-value", style);
											break;
											case 1200:
												$(item).attr("data-field-borderstyle-value", style);
											break;
										}
										$(item).find(".tn-atom").css("border-style", style);
									})
								})
								// / Массовое изменение border style
							}






							if ($(iframeDoc2).find(".sui-panel__section-shadow").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-shadow'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowcolor' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Shadow</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='' name='shadowcolor' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowopacity' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Opacity</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='shadowopacity'><option value='1'>100%</option><option value='0.9'>90%</option><option value='0.8'>80%</option><option value='0.7'>70%</option><option value='0.6'>60%</option><option value='0.5'>50%</option><option value='0.4'>40%</option><option value='0.3'>30%</option><option value='0.2'>20%</option><option value='0.1'>10%</option><option value='0'>0%</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowx' data-control-value=''><table><tbody><tr><td><label class='sui-label'>offset x</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowx' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowy' data-control-value=''><table><tbody><tr><td><label class='sui-label'>offset y</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowy' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowblur' data-control-value=''><table><tbody><tr><td><label class='sui-label'>blur</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowblur' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowspread' data-control-value=''><table><tbody><tr><td><label class='sui-label'>spread</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowspread' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");


								// Массовое изменение shadow color
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='shadowcolor']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-shadowcolor-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-shadowcolor-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-shadowcolor-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-shadowcolor-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-shadowcolor-value", color);
												break;
											}
											$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
										})
									}
								});
								// / Массовое изменение shadow color





								//  Массовое изменение shadow opacity
								$(iframeDoc2).find("[name='shadowopacity']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowopacity-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowopacity-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowopacity-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowopacity-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowopacity-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow opacity




								//  Массовое изменение shadow x
								$(iframeDoc2).find("[name='shadowx']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowx-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowx-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowx-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowx-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowx-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow x




								//  Массовое изменение shadow y
								$(iframeDoc2).find("[name='shadowy']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowy-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowy-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowy-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowy-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowy-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow y




								//  Массовое изменение shadow blur
								$(iframeDoc2).find("[name='shadowblur']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowblur-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowblur-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowblur-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowblur-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowblur-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow blur




								//  Массовое изменение shadow spread
								$(iframeDoc2).find("[name='shadowspread']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowspread-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowspread-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowspread-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowspread-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowspread-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow spread
							}











							if ($(iframeDoc2).find(".sui-panel__section-button-hover").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-button-hover'><table class='sui-panel__table sui-panel__padd_b-10'>  <tbody><tr class='sui-panel__tr'> <td class='sui-panel__td'> <div class='sui-form-group sui-form-group__hint'>Изменение параметров при наведении не отображается в редакторе</div>  </td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='bgcolorhover' data-control-value='#000000'><table><tbody><tr><td><label class='sui-label'>bgcolor on Hover</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='#000000' name='bgcolorhover' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='colorhover' data-control-value='#000000'><table><tbody><tr><td><label class='sui-label'>Color on Hover</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='#000000' name='colorhover' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='bordercolorhover' data-control-value='#000000'><table><tbody><tr><td><label class='sui-label'>Border on Hover</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='#000000' name='bordercolorhover' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='speedhover' data-control-value='0.5'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>Duration</label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0.5' name='speedhover' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-speedhover'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 50%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 50%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");



								// Массовое изменение bgcolorhover
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='bgcolorhover']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-bgcolorhover-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-bgcolorhover-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-bgcolorhover-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-bgcolorhover-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-bgcolorhover-value", color);
												break;
											}
											// $(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
										})
									}
								});
								// / Массовое изменение bgcolorhover



								// Массовое изменение colorhover
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='colorhover']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-colorhover-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-colorhover-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-colorhover-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-colorhover-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-colorhover-value", color);
												break;
											}
											// $(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
										})
									}
								});
								// / Массовое изменение colorhover



								// Массовое изменение bordercolorhover
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='bordercolorhover']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-bordercolorhover-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-bordercolorhover-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-bordercolorhover-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-bordercolorhover-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-bordercolorhover-value", color);
												break;
											}
											// $(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
										})
									}
								});
								// / Массовое изменение bordercolorhover



								// Массовое изменение speedhover
								$(iframeDoc2).find(".sui-slider-speedhover").slider({
									range: "max",
									min: 0,
									max: 1,
									step: .1,
									value: 0,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-speedhover-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-speedhover-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-speedhover-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-speedhover-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-speedhover-value", t.value);
												break;
											}
										})
									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-speedhover-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-speedhover-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-speedhover-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-speedhover-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-speedhover-value", t.value);
												break;
											}
										})
									}
								})
								$(iframeDoc2).find(".sui-slider-speedhover").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-speedhover").slider("value", $(this).val());
									}
								})
								// / Массовое изменение speedhover
							}








						}
						// /BUTTON ONLY






						// TOOLTIP ONLY
						if (elemSelectedLength == tooltip) {


							if ($(iframeDoc2).find(".sui-panel__section-font").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-font'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='align' data-control-value='right'><div class='sui-radio'><div class='sui-radio-div ui-controlgroup ui-controlgroup-horizontal ui-helper-clearfix' role='toolbar'><table><tbody><tr><td><input type='radio' id='left' name='align' class='ui-checkboxradio ui-helper-hidden-accessible'><label for='left' class='ui-button ui-widget ui-checkboxradio-radio-label ui-controlgroup-item ui-checkboxradio-label ui-corner-left'><span class='ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-blank'></span><span class='ui-checkboxradio-icon-space'> </span>Left</label></td><td><input type='radio' id='center' name='align' class='ui-checkboxradio ui-helper-hidden-accessible'><label for='center' class='ui-button ui-widget ui-checkboxradio-radio-label ui-checkboxradio-label ui-controlgroup-item'><span class='ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-blank'></span><span class='ui-checkboxradio-icon-space'> </span>Center</label></td><td><input type='radio' id='right' name='align' checked='checked' class='ui-checkboxradio ui-helper-hidden-accessible'><label for='right' class='ui-button ui-widget ui-checkboxradio-radio-label ui-controlgroup-item ui-checkboxradio-label ui-corner-right'><span class='ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-blank ui-state-hover'></span><span class='ui-checkboxradio-icon-space'> </span>Right</label></td></tr></tbody></table></div></div></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-value='#ffffff'><table><tbody><tr><td><label class='sui-label'>color</label></td><td style='width:100%;'><div class='sui-input-div'><input type='text' value='#ffffff' class='sui-input color' autocomplete='off' size='7'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontsize' data-control-value='20'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>size</label></td><td style='width:100%;min-width:50px;'><div class=''>	<input type='text' value='20' name='fontsize' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-fs-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 88.8889%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 11.1111%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontfamily' data-control-value='Circe'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Typeface<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Connect other fonts in <a href=&quot;/projects/settings/?projectid=1140174&quot; target=&quot;_blank&quot; style=&quot;color:#fff; text-decoration:underline; font-weight:bold;&quot;>Site&nbsp;Settings</a>. '></label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='fontfamily'><option value='Arial'>Arial</option><option value='Georgia'>Georgia</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='fontweight' data-control-value='400'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Weight</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='fontweight'><option value='100'>Thin</option><option value='300'>Light</option><option value='400' selected='selected'>Normal</option><option value='500'>Medium</option><option value='600'>Semi Bold</option><option value='700'>Bold</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='lineheight' data-control-value='1.55'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>spacing</label></td><td style='width:100%;min-width:50px;'><div class=''>	<input type='text' value='1.55' name='lineheight' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-lh-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 45%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 55%;'></span></div></td></tr></tbody></table></div></td><td class='sui-panel__td'><div class='sui-form-group' data-control-field='letterspacing' data-control-value='0'><table style='width:100%;'><tbody><tr><td></td><td style='width:100%;min-width:50px;'><div class=''>	<input type='text' value='0' name='letterspacing' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-ls-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");



								// Изменение выравнивания текста
								$(iframeDoc2).find("[name='align']").click(function(){
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);
									var e = $(this);
									arr.each(function(i, item){
										switch (res) {
											case 320:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-320-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-320-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-320-value", "right").css("text-align", "right");
													})
												}
											break;
											case 480:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-480-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-480-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-480-value", "right").css("text-align", "right");
													})
												}
											break;
											case 640:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-640-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-640-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-640-value", "right").css("text-align", "right");
													})
												}
											break;
											case 960:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-960-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-960-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-res-960-value", "right").css("text-align", "right");
													})
												}
											break;
											case 1200:
												if (e.attr("id") == "left") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-value", "left").css("text-align", "left");
													})
												}
												if (e.attr("id") == "center") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-value", "center").css("text-align", "center");
													})
												}
												if (e.attr("id") == "right") {
													arr.each(function(i, item){
														$(item).attr("data-field-align-value", "right").css("text-align", "right");
													})
												}
											break;
										}
									})
								})
								// /Изменение выравнивания текста







								// // Массовое изменение цвета текста
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery(".color").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-color-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-color-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-color-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-color-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-color-value", color);
												break;
											}
											$(item).find(".tn-atom").css("color", color);
											$(item).css("color", color);
										})
									}
								});
								// /Массовое изменение цвета текста




								// Массовое изменение размера текста
								$(iframeDoc2).find(".sui-slider-fs-100").slider({
									range: "max",
									min: 10,
									max: 100,
									step: 1,
									value: 20,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("font-size", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-fontsize-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-fontsize-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-fontsize-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-fontsize-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-fontsize-value", t.value);
												break;
											}
										})
									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("font-size", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-fontsize-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-fontsize-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-fontsize-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-fontsize-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-fontsize-value", t.value);
												break;
											}
										})
									}
								})
								$(iframeDoc2).find(".sui-slider-fs-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-fs-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение размера текста





								// Массовое изменение шрифта
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								var headlinefont = iframeWindow.$headlinefont;
								var textfont = iframeWindow.$textfont;
								$(iframeDoc2).find("[name='fontfamily']").prepend("<option value='" + headlinefont + "'>" + headlinefont + "</option>")
								$(iframeDoc2).find("[name='fontfamily']").prepend("<option selected value='" + textfont + "'>" + textfont + "</option>")

								$(iframeDoc2).find("[name='fontfamily']").change(function(){
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-fontfamily-value", this.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").css("font-family", this.value);
								})
								// /Массовое изменение шрифта




								// Массовое изменение шрифта
								$(iframeDoc2).find("[name='fontweight']").change(function(){
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-fontweight-value", this.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").css("font-weight", this.value);
								})
								// /Массовое изменение шрифта





								// Массовое изменение высоты строки
								$(iframeDoc2).find(".sui-slider-lh-100").slider({
									range: "max",
									min: 1,
									max: 2,
									step: 0.05,
									value: 1.55,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("line-height", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-lineheight-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-lineheight-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-lineheight-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-lineheight-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-lineheight-value", t.value);
												break;
											}
										})
									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("line-height", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-lineheight-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-lineheight-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-lineheight-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-lineheight-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-lineheight-value", t.value);
												break;
											}
										})
									}
								})
								$(iframeDoc2).find(".sui-slider-lh-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-lh-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение высоты строки





								// Массовое изменение letter spacing
								$(iframeDoc2).find(".sui-slider-ls-100").slider({
									range: "max",
									min: -50,
									max: 50,
									step: 0.1,
									value: 0,
									slide: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("letter-spacing", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-letterspacing-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-letterspacing-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-letterspacing-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-letterspacing-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-letterspacing-value", t.value);
												break;
											}
										})
									},
									change: function(e, t) {
										// Изменение значения в поле
										$(t.handle).parents("td").first().find("input").val(t.value);

										// Изменение элемента
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
											$(this).css("letter-spacing", t.value);
											var res = resolution(iframeDoc2);
											switch (res) {
												case 320:
													$(this).attr("data-field-letterspacing-res-320-value", t.value);
												break;
												case 480:
													$(this).attr("data-field-letterspacing-res-480-value", t.value);
												break;
												case 640:
													$(this).attr("data-field-letterspacing-res-640-value", t.value);
												break;
												case 960:
													$(this).attr("data-field-letterspacing-res-960-value", t.value);
												break;
												case 1200:
													$(this).attr("data-field-letterspacing-value", t.value);
												break;
											}
										})
									}
								})
								$(iframeDoc2).find(".sui-slider-ls-100").parents("td").first().find("input").on("keyup", function(e){
									if (e.keyCode == 13) {
										$(iframeDoc2).find(".sui-slider-ls-100").slider("value", $(this).val());
									}
								})
								// /Массовое изменение letter spacing
							}









							if ($(iframeDoc2).find(".sui-panel__section-shadow").length == 0) {
								$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-shadow'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowcolor' data-control-value=''><table><tbody><tr><td><label class='sui-label'>Shadow</label></td><td style='width:100%;'><div class='sui-input-div'><div class='minicolors minicolors-theme-default minicolors-position-bottom'><input type='text' value='' name='shadowcolor' class='sui-input minicolors-input' autocomplete='off' size='7'></div></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowopacity' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Opacity</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='shadowopacity'><option value='1'>100%</option><option value='0.9'>90%</option><option value='0.8'>80%</option><option value='0.7'>70%</option><option value='0.6'>60%</option><option value='0.5'>50%</option><option value='0.4'>40%</option><option value='0.3'>30%</option><option value='0.2'>20%</option><option value='0.1'>10%</option><option value='0'>0%</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowx' data-control-value=''><table><tbody><tr><td><label class='sui-label'>offset x</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowx' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowy' data-control-value=''><table><tbody><tr><td><label class='sui-label'>offset y</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowy' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowblur' data-control-value=''><table><tbody><tr><td><label class='sui-label'>blur</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowblur' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='shadowspread' data-control-value=''><table><tbody><tr><td><label class='sui-label'>spread</label></td><td style='width:100%;'><div class='sui-input-div'>  <input type='text' value='' name='shadowspread' class='sui-input' autocomplete='off'></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");


								// Массовое изменение shadow color
								// var iframe = document.getElementsByTagName('iframe')[0];
								// var iframeWindow = iframe.contentWindow;
								var iframe = $("iframe.t396__iframe");
								var iframeWindow = iframe.eq(0)[0].contentWindow;
								iframeWindow.jQuery("[name='shadowcolor']").minicolors({
									change: function(){
										var color = this.value;
										var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
										var res = resolution(iframeDoc2);

										arr.each(function(i, item){
											switch (res) {
												case 320:
													$(item).attr("data-field-shadowcolor-res-320-value", color);
												break;
												case 480:
													$(item).attr("data-field-shadowcolor-res-480-value", color);
												break;
												case 640:
													$(item).attr("data-field-shadowcolor-res-640-value", color);
												break;
												case 960:
													$(item).attr("data-field-shadowcolor-res-960-value", color);
												break;
												case 1200:
													$(item).attr("data-field-shadowcolor-value", color);
												break;
											}
											$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
										})
									}
								});
								// / Массовое изменение shadow color





								//  Массовое изменение shadow opacity
								$(iframeDoc2).find("[name='shadowopacity']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowopacity-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowopacity-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowopacity-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowopacity-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowopacity-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow opacity




								//  Массовое изменение shadow x
								$(iframeDoc2).find("[name='shadowx']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowx-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowx-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowx-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowx-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowx-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow x




								//  Массовое изменение shadow y
								$(iframeDoc2).find("[name='shadowy']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowy-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowy-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowy-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowy-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowy-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow y




								//  Массовое изменение shadow blur
								$(iframeDoc2).find("[name='shadowblur']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowblur-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowblur-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowblur-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowblur-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowblur-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow blur




								//  Массовое изменение shadow spread
								$(iframeDoc2).find("[name='shadowspread']").change(function(){
									var val = this.value;
									var arr = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
									var res = resolution(iframeDoc2);

									arr.each(function(i, item){
										switch (res) {
											case 320:
												$(item).attr("data-field-shadowspread-res-320-value", val);
											break;
											case 480:
												$(item).attr("data-field-shadowspread-res-480-value", val);
											break;
											case 640:
												$(item).attr("data-field-shadowspread-res-640-value", val);
											break;
											case 960:
												$(item).attr("data-field-shadowspread-res-960-value", val);
											break;
											case 1200:
												$(item).attr("data-field-shadowspread-value", val);
											break;
										}
										$(item).find(".tn-atom").css("box-shadow", getElemShadow(iframeDoc2, $(item)));
									})
								})
								// / Массовое изменение shadow spread
							}
						}
						// TOOLTIP ONLY


















































						// СТАНДАРТНЫЕ ФУНКЦИИ ДЛЯ НЕСКОЛЬКИХ ЭЛЕМЕНТОВ
						if ($(iframeDoc2).find(".sui-panel__section-other").length == 0) {
							$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-other'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='opacity' data-control-value='1'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>opacity</label></td><td style='width:100%;min-width:50px;'><div class=''><input type='text' value='100' name='opacity' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-100'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 0%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 100%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='rotate' data-control-value='0'><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>rotate</label></td><td style='width:100%;min-width:50px;'><div class=''><input type='text' value='0' name='rotate' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content sui-slider-360'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");



							// OPACITY
							$(iframeDoc2).find(".sui-slider-100").slider({
								range: "max",
								min: 0,
								max: 100,
								step: 1,
								value: 100,
								slide: function(e, t) {
									// Изменение значения в поле
									$(t.handle).parents("td").first().find("input").val(t.value);

									// Изменение элемента
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
										$(this).find(".tn-atom").css("opacity", t.value / 100);
										var res = resolution(iframeDoc2);
										switch (res) {
											case 320:
												$(this).attr("data-field-opacity-res-320-value", t.value / 100);
											break;
											case 480:
												$(this).attr("data-field-opacity-res-480-value", t.value / 100);
											break;
											case 640:
												$(this).attr("data-field-opacity-res-640-value", t.value / 100);
											break;
											case 960:
												$(this).attr("data-field-opacity-res-960-value", t.value / 100);
											break;
											case 1200:
												$(this).attr("data-field-opacity-value", t.value / 100);
											break;
										}
									})

								},

								change: function(e, t) {
									// Изменение значения в поле
									$(t.handle).parents("td").first().find("input").val(t.value);

									// Изменение элемента
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
										$(this).find(".tn-atom").css("opacity", t.value / 100);
										var res = resolution(iframeDoc2);
										switch (res) {
											case 320:
												$(this).attr("data-field-opacity-res-320-value", t.value / 100);
											break;
											case 480:
												$(this).attr("data-field-opacity-res-480-value", t.value / 100);
											break;
											case 640:
												$(this).attr("data-field-opacity-res-640-value", t.value / 100);
											break;
											case 960:
												$(this).attr("data-field-opacity-res-960-value", t.value / 100);
											break;
											case 1200:
												$(this).attr("data-field-opacity-value", t.value / 100);
											break;
										}
									})

								}
							})
							$(iframeDoc2).find(".sui-slider-100").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-slider-100").slider("value", $(this).val())
								}
							})
							// /OPACITY


							// ROTATE
							$(iframeDoc2).find(".sui-slider-360").slider({
								range: "max",
								min: 0,
								max: 360,
								step: 1,
								value: 0,
								slide: function(e, t) {
									// Изменение значения в поле
									$(t.handle).parents("td").first().find("input").val(t.value);

									// Изменение элемента
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
										$(this).find(".tn-atom").css("transform", "rotate(" + t.value + "deg)");
										var res = resolution(iframeDoc2);
										switch (res) {
											case 320:
												$(this).attr("data-field-rotate-res-320-value", t.value);
											break;
											case 480:
												$(this).attr("data-field-rotate-res-480-value", t.value);
											break;
											case 640:
												$(this).attr("data-field-rotate-res-640-value", t.value);
											break;
											case 960:
												$(this).attr("data-field-rotate-res-960-value", t.value);
											break;
											case 1200:
												$(this).attr("data-field-rotate-value", t.value);
											break;
										}
									})
								},
								change: function(e, t) {
									// Изменение значения в поле
									$(t.handle).parents("td").first().find("input").val(t.value);

									// Изменение элемента
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").each(function() {
										$(this).find(".tn-atom").css("transform", "rotate(" + t.value + "deg)");
										var res = resolution(iframeDoc2);
										switch (res) {
											case 320:
												$(this).attr("data-field-rotate-res-320-value", t.value);
											break;
											case 480:
												$(this).attr("data-field-rotate-res-480-value", t.value);
											break;
											case 640:
												$(this).attr("data-field-rotate-res-640-value", t.value);
											break;
											case 960:
												$(this).attr("data-field-rotate-res-960-value", t.value);
											break;
											case 1200:
												$(this).attr("data-field-rotate-value", t.value);
											break;
										}
									})
								},
							})
							$(iframeDoc2).find(".sui-slider-360").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-slider-360").slider("value", $(this).val());
								}
							})
						}
						// /ROTATE























						// Стандартная анимация
						if ($(iframeDoc2).find(".sui-panel__section-anim").length == 0) {
							$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-anim'><label class='sui-label' style='width:100%; padding-bottom:15px;padding-left:3px;'>Basic animation</label>  <table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animstyle' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Animation</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='animstyle'><option value='' selected='selected'>None</option><option value='fadein'>Fade In</option><option value='fadeinup'>Fade In Up</option><option value='fadeindown'>Fade In Down</option><option value='fadeinleft'>Fade In Left</option><option value='fadeinright'>Fade In Right</option><option value='zoomin'>Zoom In</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animduration' data-control-value='1'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Duration<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' style='padding-left:0px;' data-tooltip='Animation duration in seconds. E.g: 1 sec.'></label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0' name='animduration' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 66.6667%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 33.3333%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animdistance' data-control-value='100'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Distance<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Distance in pixels. E.g: 100 px.'></label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0' name='animdistance' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 66.6667%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 33.3333%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animscale' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Scale<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Start scale animation value in percent. E.g: 90%.'></label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0' name='animscale' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animdelay' data-control-value='0'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Delay<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Delay in seconds before starting animation. E.g: 0 sec.'></label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0' name='animdelay' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animtriggeroffset' data-control-value='0'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Trigger Offset<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Animation trigger offset in pixels<br>from bottom window border.'></label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0' name='animtriggeroffset' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='padding-bottom: 20px; display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control='animtest'><table><tbody><tr><td><label class='sui-label'>Test</label></td><td style='width:100%;'><div class='sui-btn sui-btn-anim-test-all'>Play All</div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animprx' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Parallax</label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='animprx'><option value='' selected='selected'>None</option><option value='scroll'>Scroll</option><option value='mouse'>Mouse</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='padding-bottom: 20px; display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animprxs' data-control-value='100'><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Speed, %<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Element will scroll faster or slower than page. <br>Value > 100% — faster, value < 100% — slower.'></label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='100' name='animprxs' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 66.6667%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 33.3333%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animprxdx' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>Dist X, px</label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0' name='animprxdx' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='padding-bottom: 20px; display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animprxdy' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label' style='padding-bottom:11px;'>Dist Y, px</label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0' name='animprxdy' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animfix' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Fixing<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Element will become fixed, <br>when it reaches a trigger: window top, center or bottom.'></label></td><td style='width:100%;'><div class='sui-select'><select class='sui-input sui-select' name='animfix'><option value='' selected='selected'>None</option><option value='0'>on Window Top</option><option value='0.5'>on Window Center</option><option value='1'>on Window Bottom</option></select></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='padding-bottom:20px;display:none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animfixtrgofst' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Trigger offset<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Offset helps to add some indent <br>between window border and fixed element.'></label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0' name='animfixtrgofst' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table><table class='sui-panel__table sui-panel__padd_b-10' style='display: none;'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control-field='animfixdist' data-control-value=''><table style='width:100%;'><tbody><tr><td><label class='sui-label'>Distance<img src='img/tn-vopros.svg' class='sui-label-ask tooltip tooltipstered' data-tooltip='Element will be fixed until you scroll <br>this distance. E.g: 300 px'></label></td><td style='width:100%;min-width:50px;'><div class=''> <input type='text' value='0' name='animfixdist' class='sui-input' autocomplete='off'></div><div class='sui-slider ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content'><div class='ui-slider-range ui-corner-all ui-widget-header ui-slider-range-max' style='width: 100%;'></div><span tabindex='0' class='ui-slider-handle ui-corner-all ui-state-default' style='left: 0%;'></span></div></td></tr></tbody></table></div></td></tr></tbody></table></div>");


							// ANIMATION UI
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animduration'] .ui-slider").slider({
								range: "max",
								min: 0,
								max: 3,
								step: .1,
								value: 1,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", t.value)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", t.value)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animduration'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animduration'] .ui-slider").slider("value", this.value);
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", this.value)
							})


							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animscale'] .ui-slider").slider({
								range: "max",
								min: 0,
								max: 200,
								step: 5,
								value: 90,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animscale-value", t.value / 100)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animscale-value", t.value / 100)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animscale'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animscale'] .ui-slider").slider("value", $(this).val());
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animscale-value", this.value)
							})

							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animdistance'] .ui-slider").slider({
								range: "max",
								min: 0,
								max: 300,
								step: 50,
								value: 100,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdistance-value", t.value)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdistance-value", t.value)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animdistance'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animdistance'] .ui-slider").slider("value", $(this).val());
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdistance-value", this.value)
							})

							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animdelay'] .ui-slider").slider({
								range: "max",
								min: 0,
								max: 3,
								step: .1,
								value: 0,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdelay-value", t.value)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdelay-value", t.value)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animdelay'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animdelay'] .ui-slider").slider("value", $(this).val());
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdelay-value", this.value);
							})

							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animtriggeroffset'] .ui-slider").slider({
								range: "max",
								min: 0,
								max: 500,
								step: 50,
								value: 0,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animtriggeroffset-value", t.value)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animtriggeroffset-value", t.value)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animtriggeroffset'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animtriggeroffset'] .ui-slider").slider("value", $(this).val());
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animtriggeroffset-value", this.value);
							})

							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animprxs'] .ui-slider").slider({
								range: "max",
								min: 50,
								max: 200,
								step: 10,
								value: 100,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxs-value", t.value)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxs-value", t.value)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animprxs'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animprxs'] .ui-slider").slider("value", $(this).val());
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxs-value", this.value);
							})


							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animprxdx'] .ui-slider").slider({
								range: "max",
								min: 0,
								max: 200,
								step: 10,
								value: 0,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxdx-value", t.value)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxdx-value", t.value)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animprxdx'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animprxdx'] .ui-slider").slider("value", $(this).val());
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxdx-value", this.value);
							})

							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animprxdy'] .ui-slider").slider({
								range: "max",
								min: 0,
								max: 200,
								step: 10,
								value: 0,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxdy-value", t.value)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxdy-value", t.value)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animprxdy'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animprxdy'] .ui-slider").slider("value", $(this).val());
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxdy-value", this.value);
							})

							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animfixtrgofst'] .ui-slider").slider({
								range: "max",
								min: 0,
								max: 500,
								step: 10,
								value: 0,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixtrgofst-value", t.value)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixtrgofst-value", t.value)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animfixtrgofst'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animfixtrgofst'] .ui-slider").slider("value", $(this).val());
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixtrgofst-value", this.value);
							})

							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animfixdist'] .ui-slider").slider({
								range: "max",
								min: 0,
								max: 20000,
								step: 10,
								value: 0,
								slide: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixdist-value", t.value)
								},
								change: function(e, t) {
									$(t.handle).parents("td").first().find("input").val(t.value);
									$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixdist-value", t.value)
								}
							})
							$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animfixdist'] .ui-slider").parents("td").first().find("input").on("keyup", function(e){
								if (e.keyCode == 13) {
									$(iframeDoc2).find(".sui-panel__section-anim [data-control-field='animfixdist'] .ui-slider").slider("value", $(this).val());
								}
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixdist-value", this.value);
							})















							// ANIMATION
							$(iframeDoc2).find("[name='animstyle']").change(function(){
								// Прячем все поля animation
								$(iframeDoc2).find("[name='animduration'], [name='animscale'], [name='animdistance'], [name='animdelay'], [name='animtriggeroffset'], [data-control='animtest']").parents(".sui-panel__table").hide();
								// Прячем все поля paralax
								$(iframeDoc2).find("[name='animfixtrgofst'], [name='animfixdist']").parents(".sui-panel__table").hide();
								// Прячем все поля fixing
								$(iframeDoc2).find("[name='animprxs'], [name='animprxdx'], [name='animprxdy']").parents(".sui-panel__table").hide();


								// Обнуляем значения paralax и fixing
								$(iframeDoc2).find("[name='animprx']").val("");
								$(iframeDoc2).find("[name='animfix']").val("");

								// Обнуляем все значения анимации
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");


								switch (this.value) {
									case "fadein":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animduration'], [name='animdelay'], [name='animtriggeroffset']").parents(".sui-panel__table").show();
										// Показываем anim test
										$(iframeDoc2).find("[data-control='animtest']").parents(".sui-panel__table").show();

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам fadein
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animstyle-value", "fadein");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "1");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdelay-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animtriggeroffset-value", "0");

									break;

									case "fadeinup":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animduration'],[name='animdistance'],  [name='animdelay'], [name='animtriggeroffset']").parents(".sui-panel__table").show();
										// Показываем anim test
										$(iframeDoc2).find("[data-control='animtest']").parents(".sui-panel__table").show();

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам fadeinup
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animstyle-value", "fadeinup");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "1");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdistance-value", "100");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdelay-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animtriggeroffset-value", "0");
									break;

									case "fadeindown":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animduration'],[name='animdistance'],  [name='animdelay'], [name='animtriggeroffset']").parents(".sui-panel__table").show();
										// Показываем anim test
										$(iframeDoc2).find("[data-control='animtest']").parents(".sui-panel__table").show();

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам fadeindown
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animstyle-value", "fadeindown");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "1");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdistance-value", "100");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdelay-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animtriggeroffset-value", "0");
									break;

									case "fadeinleft":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animduration'],[name='animdistance'],  [name='animdelay'], [name='animtriggeroffset']").parents(".sui-panel__table").show();
										// Показываем anim test
										$(iframeDoc2).find("[data-control='animtest']").parents(".sui-panel__table").show();

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам fadeinleft
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animstyle-value", "fadeinleft");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "1");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdistance-value", "100");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdelay-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animtriggeroffset-value", "0");

									case "fadeinright":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animduration'],[name='animdistance'],  [name='animdelay'], [name='animtriggeroffset']").parents(".sui-panel__table").show();
										// Показываем anim test
										$(iframeDoc2).find("[data-control='animtest']").parents(".sui-panel__table").show();

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам fadeinright
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animstyle-value", "fadeinright");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "1");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdistance-value", "100");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdelay-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animtriggeroffset-value", "0");
									break;
									case "zoomin":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animduration'],[name='animscale'],  [name='animdelay'], [name='animtriggeroffset']").parents(".sui-panel__table").show();
										// Показываем anim test
										$(iframeDoc2).find("[data-control='animtest']").parents(".sui-panel__table").show();

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам fadeindown
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animstyle-value", "zoomin");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "1");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animscale-value", ".9");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animdelay-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animtriggeroffset-value", "0");
									break;
								}
							})


							// PARALAX
							$(iframeDoc2).find("[name='animprx']").change(function(){

								// Прячем все поля animation
								$(iframeDoc2).find("[name='animduration'], [name='animscale'], [name='animdistance'], [name='animdelay'], [name='animtriggeroffset'], [data-control='animtest']").parents(".sui-panel__table").hide();
								// Прячем все поля paralax
								$(iframeDoc2).find("[name='animfixtrgofst'], [name='animfixdist']").parents(".sui-panel__table").hide();
								// Прячем все поля fixing
								$(iframeDoc2).find("[name='animprxs'], [name='animprxdx'], [name='animprxdy']").parents(".sui-panel__table").hide();


								// Обнуляем значения paralax и fixing
								$(iframeDoc2).find("[name='animstyle']").val("");
								$(iframeDoc2).find("[name='animfix']").val("");

								// Обнуляем все значения анимации
								$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");


								switch (this.value) {
									case "scroll":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animprxs']").parents(".sui-panel__table").show();
										// Показываем anim test

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам scroll
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprx-value", "scroll");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxs-value", "100");

									break;
									case "mouse":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animprxdx'], [name='animprxdy']").parents(".sui-panel__table").show();
										// Показываем anim test

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам mouse
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprx-value", "mouse");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxdx-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animprxdy-value", "0");
									break;
								}
							})




							// FIXING
							$(iframeDoc2).find("[name='animfix']").change(function(){
								$(iframeDoc2).find("[name='animduration'], [name='animscale'], [name='animdistance'], [name='animdelay'], [name='animtriggeroffset'], [data-control='animtest']").parents(".sui-panel__table").hide();
								$(iframeDoc2).find("[name='animfixtrgofst'], [name='animfixdist']").parents(".sui-panel__table").hide();
								$(iframeDoc2).find("[name='animprxs'], [name='animprxdx'], [name='animprxdy']").parents(".sui-panel__table").hide();

								$(iframeDoc2).find("[name='animstyle']").val("")
								$(iframeDoc2).find("[name='animprx']").val("")

								switch (this.value) {
									case "0":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animfixtrgofst'], [name='animfixdist']").parents(".sui-panel__table").show();
										// Показываем anim test

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам mouse
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfix-value", "0");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixdist-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixtrgofst-value", "0");
									break;
									case "0.5":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animfixtrgofst'], [name='animfixdist']").parents(".sui-panel__table").show();
										// Показываем anim test

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам mouse
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfix-value", "0.5");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixdist-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixtrgofst-value", "0");
									break;
									case "1":
										// Показываем нужные настройки
										$(iframeDoc2).find("[name='animfixtrgofst'], [name='animfixdist']").parents(".sui-panel__table").show();
										// Показываем anim test

										// Обнуляем все остальные настройки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animduration-value", "").attr("data-field-animdelay-value", "").attr("data-field-animdistance-value", "").attr("data-field-animscale-value", "").attr("data-field-animtriggeroffset-value", "").attr("data-field-animprx-value", "").attr("data-field-animprxs-value", "").attr("data-field-animprxdy-value", "").attr("data-field-animprxdx-value", "").attr("data-field-animfix-value", "").attr("data-field-animfixdist-value", "").attr("data-field-animfixtrgofst-value", "").attr("data-field-animstyle-value", "");

										// Устанавливаем стиль анимации выбранным элементам mouse
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfix-value", "1");


										// Выставляем нужные настройки на стандартные отметки
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixdist-value", "0");
										$(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)").attr("data-field-animfixtrgofst-value", "0");
									break;
								}
							})










							$(iframeDoc2).find(".sui-btn-anim-test-all").click(function(){
								$('.t396__iframe').get(0).contentWindow.tn_anim__playAll();
							})
						}
						// /Стандартная анимация









						// КОПИРОВАНИЕ SBS АНИМАЦИИ
						if ($(iframeDoc2).find(".sui-panel__section-sbsopenbtn").length == 0) {
							$(iframeDoc2).find(".tn-settings").append("<div class='sui-panel__section sui-panel__section-sbsopenbtn'><table class='sui-panel__table sui-panel__padd_b-10'><tbody><tr class='sui-panel__tr'><td class='sui-panel__td'><div class='sui-form-group' data-control='sbsopenbtn' data-control-value=''><table><tbody><tr><td style='width:100%;'><label class='sui-label' style='width:100%; padding-bottom:15px;'>Step by step animation</label><div class='sui-btn sui-btn-sbs-paste' style='padding:6px 15px; margin-top: 4px; font-weight:400;'>Paste</div></td></tr></tbody></table></div></td></tr></tbody></table></div>");


								// $(".sui-panel__section-sbsopenbtn div").last().before('<div class="sui-btn sui-btn-sbs-copy" style="padding:6px 15px; margin-top: 4px; font-weight:400;">Copy</div>')
								// $(iframeDoc2).find(".sui-panel__section-sbsopenbtn .sui-btn-sbs-remove").after('<div class="sui-btn sui-btn-sbs-copy" style="padding:6px 15px; margin-top: 4px; font-weight:400;">Copy</div>');



							$(iframeDoc2).find(".sui-btn-sbs-paste").click(function(){
								var elem = $(iframeDoc2).find(".tn-elem__selected:not(.tn-elem__invisible)");
								var data = JSON.parse(localStorage.anim);

								elem.attr("data-field-sbsevent-value", data.sbsevent);
								elem.attr("data-field-sbstrg-value", data.sbstrg);
								elem.attr("data-field-sbstrgofst-value", data.sbstrgofst);
								elem.attr("data-field-sbsopts-value", data.sbsopts);
								elem.attr("data-field-sbsloop-value", data.sbsloop);
								elem.attr("data-sbs-step-i", data.i);
							})
						}
						// /КОПИРОВАНИЕ SBS АНИМАЦИИ


					// /СТАНДАРТНЫЕ ФУНКЦИИ ДЛЯ НЕСКОЛЬКИХ ЭЛЕМЕНТОВ






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