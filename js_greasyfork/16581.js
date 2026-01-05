// ==UserScript==
// @name          Wanikani Reorder Ultimate 2 BETA
// @namespace     https://www.wanikani.com
// @description   Learn in the order you want to.
// @version       2.0.201
// @include       *://www.wanikani.com/lesson/session*
// @include       *://www.wanikani.com/review/session*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/16581/Wanikani%20Reorder%20Ultimate%202%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/16581/Wanikani%20Reorder%20Ultimate%202%20BETA.meta.js
// ==/UserScript==
(function ($) {$.each(['hide', 'addClass'], function (i, ev) { var el = $.fn[ev]; $.fn[ev] = function () { this.trigger(ev); return el.apply(this, arguments); }; }); })(jQuery);/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 *
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
(function(e){var t,n=e();e.fn.sortable=function(r){var i=String(r);r=e.extend({connectWith:false},r);return this.each(function(){if(/^enable|disable|destroy$/.test(i)){var s=e(this).children(e(this).data("items")).attr("draggable",i=="enable");if(i=="destroy"){s.add(this).removeData("connectWith items").off("dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s")}return}var o,u,s=e(this).children(r.items);var a=e("<"+(/^ul|ol$/i.test(this.tagName)?"li":"div")+' class="sortable-placeholder">');s.find(r.handle).mousedown(function(){o=true}).mouseup(function(){o=false});e(this).data("items",r.items);n=n.add(a);if(r.connectWith){e(r.connectWith).add(this).data("connectWith",r.connectWith)}s.attr("draggable","true").on("dragstart.h5s",function(n){if(r.handle&&!o){return false}o=false;var i=n.originalEvent.dataTransfer;i.effectAllowed="move";i.setData("Text","dummy");u=(t=e(this)).addClass("sortable-dragging").index()}).on("dragend.h5s",function(){if(!t){return}t.removeClass("sortable-dragging").show();n.detach();if(u!=t.index()){t.parent().trigger("sortupdate",{item:t})}t=null}).not("a[href], img").on("selectstart.h5s",function(){this.dragDrop&&this.dragDrop();return false}).end().add([this,a]).on("dragover.h5s dragenter.h5s drop.h5s",function(i){if(!s.is(t)&&r.connectWith!==e(t).parent().data("connectWith")){return true}if(i.type=="drop"){i.stopPropagation();n.filter(":visible").after(t);t.trigger("dragend.h5s");return false}i.preventDefault();i.originalEvent.dataTransfer.dropEffect="move";if(s.is(this)){if(r.forcePlaceholderSize){a.height(t.outerHeight())}t.hide();e(this)[a.index()<e(this).index()?"after":"before"](a);n.not(a).detach()}else if(!n.is(this)&&!e(this).children(r.items).length){n.detach();e(this).append(a)}return false})})}})(jQuery);
var activeLevels = [];
var dataset = {};
var lastUpdate = new Date().getTime();
var lessonset = {
	quick: 'l',
	queue: 'l/lessonQueue',
	active: 'l/activeQueue',
	updateVisual: function() {
		$('li[data-index="0"]').click();
		var items = $.jStorage.get(dataset.queue).concat($.jStorage.get(dataset.active));
		$.jStorage.set('l/count/rad', sorter.filterType("rad", items).length);
		$.jStorage.set('l/count/kan', sorter.filterType("kan", items).length);
		$.jStorage.set('l/count/voc', sorter.filterType("voc", items).length);
	}
};
var reviewset = {
	quick: 'r',
	queue: 'reviewQueue',
	active: 'activeQueue',
	updateVisual: function() {
		var item = $.jStorage.get(dataset.active)[Math.floor(window.Math.random(true))];
		if (item) {
			$.jStorage.set('currentItem', item);
		}
		var count = $.jStorage.get(dataset.queue).length + $.jStorage.get(dataset.active).length;
		$("#available-count").html(count); // to stop the double-up bug.
	}
};
var ordered = false;
var settings = {
	data: {
		sorttypes: !0,
		sortlevels: !0,
		onebyone: !1,
		quickNext: !1,
		priority: {
			'rad': 1,
			'kan': 2,
			'voc': 3,
		},
		questionTypeMode: "0",
		typePriorityMode: "0"
	},
	load: function() {
		var a = $.jStorage.get('WKU/' + dataset.quick + '/settings');
		if (a === null) {
			settings.save();
			return settings.load();
		}
		utilities.log("Loading settings...");
		for (var s in settings.data) {
			if (a[s] !== null) settings.data[s] = a[s];
		}
		$('#types item').sort(function(a, b) {
			return sorter.getHTMLElementPriority(a) - sorter.getHTMLElementPriority(b);
		}).appendTo('#types');
		$('#sort-types').prop('checked', settings.data.sorttypes).change();
		$('#sort-levels').prop('checked', settings.data.sortlevels).change();
		$('#priority').removeClass().addClass(utilities.settingsValueToClass('priority', settings.data.typePriorityMode));
		$('#quick-next').toggleClass('active', settings.data.quickNext);
		if (dataset.quick === 'r') {
			$('#mode').prop('checked', settings.data.onebyone).change();
			$('#priority2').removeClass().addClass(utilities.settingsValueToClass('priority2', settings.data.questionTypeMode));
		}
		utilities.log(settings.data);
	},
	save: function() {
		$.jStorage.set('WKU/' + dataset.quick + '/settings', settings.data);
	}
};
var setup = {
	init: function() {
		try {
			$('div[id*="loading"]').off('hide');
			console.dlog = [];
			utilities.log("WKU Init()");
			if (!setup.update.check()) {
				setup.update.patch();
			} else {
				setup.ui.create();
			}
		} catch (err) {
			$('#supplement-info, #information').first().after('<div id="error" style="text-align:center;">An error has occurred within WaniKani Reorder Ultimate.  Please post the error below on the forum thread.<br><a href="https://www.wanikani.com/chat/api-and-third-party-apps/8471" target="_blank">https://www.wanikani.com/chat/api-and-third-party-apps/8471</a><br><br>' + err + '<br>' + err.stack + '<br><br>Logs:<br>' + console.dlog.join('<br>') + '</div>');
		}
	},
	update: {
		apply: function() {
			try {
				utilities.log("Applying UID levels");
				var queue = $.jStorage.get(dataset.active).concat($.jStorage.get(dataset.queue));
				var current = $.jStorage.get('currentItem');
				var list = $.jStorage.get('uids') || [];
				$.each(queue, function() {
					this.level = list[utilities.toUID(this)] || 0;
					if (current && utilities.toUID(this) === utilities.toUID(current)) {
						$.jStorage.set('currentItem', this);
					}
					if (activeLevels.indexOf(this.level) == -1) {
						activeLevels.push(this.level);
					}
				});
				activeLevels.sort(function(a, b) {
					return a - b;
				});
				var review = queue.splice((dataset.quick === 'r' ? 10 : $.jStorage.get('l/batchSize')));
				$.jStorage.set(dataset.active, queue);
				$.jStorage.set(dataset.queue, review);
				dataset.updateVisual();
			} catch (err) {
				$('#supplement-info, #information').first().after('<div id="error" style="text-align:center;">An error has occurred within WaniKani Reorder Ultimate.  Please post the error below on the forum thread.<br><a href="https://www.wanikani.com/chat/api-and-third-party-apps/8471" target="_blank">https://www.wanikani.com/chat/api-and-third-party-apps/8471</a><br><br>' + err + '<br>' + err.stack + '<br><br>Logs:<br>' + console.dlog.join('<br>') + '</div>');
			}
		},
		check: function() {
			try {
				utilities.log("Checking for UID updates");
				var all = $.jStorage.get(dataset.queue).concat($.jStorage.get(dataset.active));
				var list = $.jStorage.get('uids') || [];
				return list && all.every(function(ele) {
					return ele && list[utilities.toUID(ele)];
				});
			} catch (err) {
				$('#supplement-info, #information').first().after('<div id="error" style="text-align:center;">An error has occurred within WaniKani Reorder Ultimate.  Please post the error below on the forum thread.<br><a href="https://www.wanikani.com/chat/api-and-third-party-apps/8471" target="_blank">https://www.wanikani.com/chat/api-and-third-party-apps/8471</a><br><br>' + err + '<br>' + err.stack + '<br><br>Logs:<br>' + console.dlog.join('<br>') + '</div>');
			}
		},
		patch: function() {
			try {
				utilities.log("Gathering data for patch");
				var count = 0;
				var all = {};
				$('#information, #supplement-info').first().after('<div id="updateUID" style="text-align:center;">WKU::Please Wait::Currently updating UID list... <span id="id-percent">0%</span></div>');
				["radicals", "kanji", "vocabulary"].forEach(function(ele1, ind1, arr1) {
					["PLEASANT", "PAINFUL", "DEATH", "HELL", "PARADISE", "REALITY"].forEach(function(ele2, ind2, arr2) {
						$.get('https://www.wanikani.com/' + ele1 + '?difficulty=' + ele2, function(resp) {
							$('#id-percent').text(Math.round((++count / (arr1.length * arr2.length)) * 100) + "%");
							$(resp).find('section[id^=level-]').each(function() {
								var level = $(this).attr('id').replace(/[^\d]/g, "");
								$(this).find('.character-item').each(function() {
									var a = $(this).attr('id');
									a = a.substr(0, 1) + a.replace(/[^\d]/g, "");
									all[a] = level;
								});
							});
							if (count >= (arr1.length * arr2.length)) {
								$.jStorage.set('uids', all);
								utilities.log("DONE!");
								$('#updateUID').remove();
								setup.ui.create();
							}
						}).fail(function() {
							$('#supplement-info, #information').first().after('<div id="error" style="text-align:center;">WaniKani Reorder Ultimate has failed to load [' + ele2 + ' level ' + ele1 + ']<br>Please reload the page.</div>');
						});
					});
				});
			} catch (err) {
				$('#supplement-info, #information').first().after('<div id="error" style="text-align:center;">An error has occurred within WaniKani Reorder Ultimate.  Please post the error below on the forum thread.<br><a href="https://www.wanikani.com/chat/api-and-third-party-apps/8471" target="_blank">https://www.wanikani.com/chat/api-and-third-party-apps/8471</a><br><br>' + err + '<br>' + err.stack + '<br><br>Logs:<br>' + console.dlog.join('<br>') + '</div>');
			}
		}
	},
	ui: {
		create: function() {
			setup.update.apply();
			$('head').append('<link rel="stylesheet" href="https://cdn.rawgit.com/xMunch/866bd26bf87579087976/raw/126960bed6b964fb71e98cd0df54789ebdc0d1e7/style.min.css">');
			$.get('https://gist.githubusercontent.com/xMunch/a448f5999a682f114d61/raw/UI.HTML', function(data) {
				utilities.log("Creating UI...");
				var info = $('#supplement-info, #information').first();
				info.after(data);
				$('#version').text("v" + GM_info.script.version);
				if (dataset.quick === 'l') {
					$('.ui').find('#r-only').remove();
				}
				if (!setup.update.check()) {
					$('.ui-small').first().before('<div id="updateUID-failed" style="text-align:center; display:none;">Failed to update UIDs.<br>Complain here <a href="https://www.wanikani.com/chat/api-and-third-party-apps/8471" target="_blank">https://www.wanikani.com/chat/api-and-third-party-apps/8471</a><div>');
					$('#updateUID-failed').fadeIn(500).delay(7500).fadeOut(500);
				}
				$('fieldset').on('addClass', function(evt) {
					if (settings.data.quickNext) {
						setTimeout(function() {
							if ($('fieldset').hasClass('correct')) {
								$('fieldset button').click();
							}
						}, 25);
					}
				});
				$('#quick-next').click(function() {
					$(this).toggleClass('active');
					settings.data.quickNext = $(this).hasClass('active');
					settings.save();
				});
				$('#priority, #priority2').click(function(e) {
					var offset = $(this).offset();
					var x = (e.pageX - offset.left);
					var y = (e.pageY - offset.top);
					var id = $(this).attr('id');
					if (y > 50) {
						if (x < 75) {
							if (id === "priority") {
								$(this).removeClass().addClass("level-heavy");
								settings.data.typePriorityMode = "1";
								sorter.reorder();
							} else {
								$(this).removeClass().addClass("reading-heavy");
								settings.data.questionTypeMode = "1";
								utilities.forceQuestionTypeUpdate();
							}
						} else {
							if (id === "priority") {
								$(this).removeClass().addClass("type-heavy");
								settings.data.typePriorityMode = "2";
								sorter.reorder();
							} else {
								$(this).removeClass().addClass("meaning-heavy");
								settings.data.questionTypeMode = "2";
								utilities.forceQuestionTypeUpdate();
							}
						}
					} else {
						if (id === "priority") {
							$(this).removeClass().addClass("balance");
							settings.data.typePriorityMode = "0";
							sorter.reorder();
						} else {
							$(this).removeClass().addClass("balance2");
							settings.data.questionTypeMode = "0";
							utilities.forceQuestionTypeUpdate();
						}
					}
					settings.save();
				}).mousemove(function(e) {
					var offset = $(this).offset();
					var x = (e.pageX - offset.left);
					var y = (e.pageY - offset.top);
					var ele = $(this).find('#overlay');
					if (y > 50) {
						if (x < 75) {
							ele.removeClass().addClass('left');
						} else {
							ele.removeClass().addClass('right');
						}
					} else {
						ele.removeClass().addClass('top');
					}
				}).mouseleave(function(e) {
					$(this).find('#overlay').removeClass();
				});
				activeLevels.forEach(function(ele) {
					$('.ui #levels').append('<item id="level-' + ele + '">' + ele + '</item>');
				});
				$('span#reverse').click(function() {
					var parent = $(this).parents('.sortable');
					var items = parent.children('item');
					parent.append(items.get().reverse());
					sorter.reorder();
					settings.save();
				});
				$('.icon-minus, .icon-plus').click(function() {
					$('.ui, .ui-small').toggleClass('hidden');
				});
				$('#sort-types, #sort-levels').change(function() {
					$(this).parents('.sortable').find('item').toggleClass('unsorted', !this.checked);
					settings.data[$(this).attr('id').replace("-", "")] = this.checked;
					settings.save();
				});
				if (dataset.quick === 'r') {
					$('#mode').on('change', function() {
						settings.data.onebyone = this.checked;
						if (settings.data.questionTypeMode > 0) {
							utilities.forceQuestionTypeUpdate();
						}
						settings.save();
					});
					$('#option-wrap-up').click(function() {
						if ($(this).attr('class') === 'wrap-up-selected') {
							var fullQueue = $.jStorage.get(dataset.active).concat($.jStorage.get(dataset.queue));
							$.jStorage.set(dataset.active, fullQueue.splice(0, 10));
							$.jStorage.set(dataset.queue, fullQueue);
						} else {
							if (ordered) {
								sorter.reorder();
							}
						}
					});
				}
				settings.load();
				setup.ui.toggler();
				$('#reorder').click(function() {
					sorter.reorder();
				});
				$('body').on('contextmenu', '.ui', function(e) {
					e.preventDefault();
				});
				$('item').mousedown(function(event) {
					if (event.which === 3) {
						var ele = $(this).addClass('hidden');
						if (ele.attr('id')) {
							sorter.removeLevel(parseInt(ele.text()));
						} else {
							sorter.removeType(ele.attr('class'));
						}
					}
				});
				$('.sortable').sortable({
					items: ':not(div, button)'
				}).bind('sortupdate', function() {
					sorter.reorder();
					settings.save();
				});
			});
		},
		toggler: function() {
			if ($('.sortable').length) {
				var fq = $.jStorage.get(dataset.queue).concat($.jStorage.get(dataset.active));
				if (!fq.length) {
					utilities.log("There are no options available... Removing UI.");
					$('.ui').remove();
				} else {
					$('#types .radical').toggleClass('hidden', !sorter.filterType("rad", fq).length).prop('title', function() {
						var filtered = sorter.filterType("rad", fq);
						var text = "Total: " + filtered.length;
						$.each(activeLevels, function() {
							var amount = sorter.filterLevel(this, filtered).length;
							if (amount) {
								text += "\nLevel " + this + ": " + amount + "";
							}
						});
						return text;
					});
					$('#types .kanji').toggleClass('hidden', !sorter.filterType("kan", fq).length).prop('title', function() {
						var filtered = sorter.filterType("kan", fq);
						var text = "Total: " + filtered.length;
						$.each(activeLevels, function() {
							var amount = sorter.filterLevel(this, filtered).length;
							if (amount) {
								text += "\nLevel " + this + ": " + amount + "";
							}
						});
						return text;
					});
					$('#types .vocabulary').toggleClass('hidden', !sorter.filterType("voc", fq).length).prop('title', function() {
						var filtered = sorter.filterType("voc", fq);
						var text = "Total: " + filtered.length;
						$.each(activeLevels, function() {
							var amount = sorter.filterLevel(this, filtered).length;
							if (amount) {
								text += "\nLevel " + this + ": " + amount + "";
							}
						});
						return text;
					});
					activeLevels.forEach(function(level) {
						$('#level-' + level).toggleClass('hidden', !sorter.filterLevel(level, fq).length).prop('title', function() {
							var filtered = sorter.filterLevel(level, fq);
							var rad = sorter.filterType("rad", filtered).length;
							var kan = sorter.filterType("kan", filtered).length;
							var voc = sorter.filterType("voc", filtered).length;
							var text = "Total: " + filtered.length;
							if (rad) {
								text += "\nRadicals: " + rad;
							}
							if (kan) {
								text += "\nKanji: " + kan;
							}
							if (voc) {
								text += "\nVocabulary: " + voc;
							}
							return text;
						});
					});
					$('input[type="checkbox"]:disabled').removeAttr('disabled');
				}
			}
		}
	},
	listeners: function() {
		var lastCount = $.jStorage.get(dataset.active).length + $.jStorage.get(dataset.queue).length;
		$.jStorage.listenKeyChange('currentItem', function() {
			if (lastCount < ($.jStorage.get(dataset.active).length + $.jStorage.get(dataset.queue).length)) {
				lastCount = $.jStorage.get(dataset.active).length + $.jStorage.get(dataset.queue).length; // will infinitely trigger if not here.
				setup.init();
			}
			lastCount = $.jStorage.get(dataset.active).length + $.jStorage.get(dataset.queue).length;
		});
		$.jStorage.listenKeyChange('currentItem', utilities.forceQuestionTypeUpdate);
		$.jStorage.listenKeyChange(dataset.active, setup.ui.toggler);
	}
};
var sorter = {
	filterLevel: function(level, list) {
		if (!list) {
			return [];
		}
		return list.filter(function(ele, ind) {
			return ele.level == level;
		});
	},
	filterType: function(type, list) {
		if (!list) {
			return [];
		}
		return list.filter(function(ele, ind) {
			return ele[type.substr(0, 3)];
		});
	},
	getHTMLElementPriority: function(a) {
		return a.className === 'radical' ? settings.data.priority.rad : a.className === 'kanji' ? settings.data.priority.kan : settings.data.priority.voc;
	},
	getPriority: function(a) {
		return a.rad ? settings.data.priority.rad : a.kan ? settings.data.priority.kan : settings.data.priority.voc;
	},
	randomize: function(list) {
		return list.sort(function() {
			return 0.5 - window.Math.randomB();
		});
	},
	reorder: function() {
		ordered = true;
		sorter.setPriorities();
		var fullQueue = $.jStorage.get(dataset.queue).concat($.jStorage.get(dataset.active));
		fullQueue = sorter.randomize(fullQueue);
		if (parseInt(settings.data.typePriorityMode) == 1) {
			if (settings.data.sortlevels) {
				$('#levels > item').each(function() {
					var level = parseInt(this.innerHTML);
					var sorted = sorter.filterLevel(level, fullQueue);
					if (settings.data.sorttypes) {
						sorted = sorter.sortByType(sorted);
					} else {
						sorted = sorter.randomize(sorted);
					}
					fullQueue = sorter.removeLevel(level, fullQueue);
					fullQueue = fullQueue.concat(sorted);
				});
			}
		}
		if (parseInt(settings.data.typePriorityMode) == 2) {
			if (settings.data.sorttypes) {
				$('#types > item').each(function() {
					var typeFilter = sorter.filterType(this.className, fullQueue);
					if (settings.data.sortlevels) {
						$('#levels > item').each(function() {
							var level = parseInt(this.innerHTML);
							var sorted = sorter.filterLevel(level, typeFilter);
							typeFilter = sorter.removeLevel(level, typeFilter);
							typeFilter = typeFilter.concat(sorted);
						});
					} else {
						typeFilter = sorter.randomize(typeFilter);
					}
					fullQueue = sorter.removeType(this.className, fullQueue);
					fullQueue = fullQueue.concat(typeFilter);
				});
			}
		}
		$.jStorage.set(dataset.active, (dataset.quick === 'r' ? fullQueue : fullQueue.splice(0, $.jStorage.get('l/batchSize'))));
		$.jStorage.set(dataset.queue, (dataset.quick === 'r' ? [] : fullQueue));
		dataset.updateVisual();
	},
	removeLevel: function(level, list) {
		if (!list) {
			var fullQueue = sorter.removeLevel(level, $.jStorage.get(dataset.queue));
			var activeQueue = sorter.removeLevel(level, $.jStorage.get(dataset.active));
			$.jStorage.set(dataset.queue, fullQueue);
			$.jStorage.set(dataset.active, activeQueue);
			sorter.reorder();
			return;
		}
		return list.filter(function(ele, ind) {
			return ele.level != level;
		});
	},
	removeType: function(type, list) {
		if (!list) {
			var fullQueue = sorter.removeType(type, $.jStorage.get(dataset.queue));
			var activeQueue = sorter.removeType(type, $.jStorage.get(dataset.active));
			$.jStorage.set(dataset.queue, fullQueue);
			$.jStorage.set(dataset.active, activeQueue);
			sorter.reorder();
			return;
		}
		return list.filter(function(ele, ind) {
			return !ele[type.substr(0, 3)];
		});
	},
	sortByType: function(list) {
		return list.sort(function(a, b) {
			return (sorter.getPriority(a) - sorter.getPriority(b));
		});
	},
	setPriorities: function() {
		settings.data.priority.rad = $('#types .radical').index();
		settings.data.priority.kan = $('#types .kanji').index();
		settings.data.priority.voc = $('#types .vocabulary').index();
	}
};
var utilities = {
	forceQuestionTypeUpdate: function() {
		var current = $.jStorage.get("currentItem");
		if (!current) {
			return;
		}
		var type = $.jStorage.get("questionType");
		if (current.rad) {
			if (type !== "meaning") {
				$.jStorage.set("questionType", "meaning");
				$.jStorage.set("currentItem", current);
			}
			return;
		}
		var typeMethod = parseInt(settings.data.questionTypeMode);
		var data = $.jStorage.get(utilities.toUID(current));
		if (!typeMethod && (!data || (!data.mc && !data.rc))) {
			if ((new Date().getTime() - lastUpdate) > 500) {
				lastUpdate = new Date().getTime();
				var nextRandType = ["reading", "meaning"][Math.round(window.Math.randomB())];
				console.log(type, nextRandType);
				if (type != nextRandType) {
					$.jStorage.set('questionType', nextRandType);
					$.jStorage.set("currentItem", current);
				}
			}
		}
		if (typeMethod === 1) {
			if (!data || !data.rc) {
				if (type !== "reading") {
					$.jStorage.set("questionType", "reading");
					$.jStorage.set("currentItem", current);
				}
			} else {
				if (type !== "meaning") {
					$.jStorage.set("questionType", "meaning");
					$.jStorage.set("currentItem", current);
				}
			}
		}
		if (typeMethod === 2) {
			if (!data || !data.mc) {
				if (type !== "meaning") {
					$.jStorage.set("questionType", "meaning");
					$.jStorage.set("currentItem", current);
				}
			} else {
				if (type !== "reading") {
					$.jStorage.set("questionType", "reading");
					$.jStorage.set("currentItem", current);
				}
			}
		}
	},
	highestPriorityType: function() {
		return $('#types item').not('.hidden').first().attr('class');
	},
	highestPriorityLevel: function() {
		return parseInt($('#levels item').not('.hidden').first().text());
	},
	log: function(msg) {
		console.dlog.push(msg);
		console.debug(msg);
	},
	newRandom: function(fullVal) {
		if (!settings.data.onebyone && ordered) {
			var fullQueue = $.jStorage.get(dataset.active).concat($.jStorage.get(dataset.queue));
			var fullLength = fullQueue.length;
			if (settings.data.sortlevels && parseInt(settings.data.typePriorityMode) == 1) {
				fullQueue = sorter.filterLevel(utilities.highestPriorityLevel(), fullQueue);
				if (settings.data.sorttypes) {
					fullQueue = sorter.filterType(utilities.toType(fullQueue[0]), fullQueue);
				}
			}
			if (settings.data.sorttypes && parseInt(settings.data.typePriorityMode) == 2) {
				fullQueue = sorter.filterType(utilities.highestPriorityType(), fullQueue);
				if (settings.data.sortlevels) {
					fullQueue = sorter.filterLevel(fullQueue[0].level, fullQueue);
				}
			}
			return Math.floor(window.Math.randomB() * Math.min(10, fullQueue.length)) / (fullVal ? 1 : Math.max(fullLength, 1));
		}
		return settings.data.onebyone ? 0 : window.Math.randomB();
	},
	toType: function(item) {
		return (item && item.rad) ? 'rad' : item.kan ? 'kan' : 'voc' || "-1";
	},
	toUID: function(item) {
		return ((item && item.rad) ? 'r' : item.kan ? 'k' : 'v') + item.id || "-1";
	},
	settingsValueToClass: function(id, val) {
		val = parseInt(val);
		if (id === "priority") {
			switch (val) {
				case 0:
					return "balance";
				case 1:
					return "level-heavy";
				case 2:
					return "type-heavy";
			}
		} else {
			switch (val) {
				case 0:
					return "balance2";
				case 1:
					return "reading-heavy";
				case 2:
					return "meaning-heavy";
			}
		}
	}
};
$('div[id*="loading"]:visible').on('hide', function() {
	dataset = (location.pathname.match('review') ? reviewset : lessonset);
	window.Math.randomB = window.Math.random;
	if (dataset.quick === 'r') {
		window.Math.random = utilities.newRandom;
	}
	setup.init();
	setup.listeners();
});