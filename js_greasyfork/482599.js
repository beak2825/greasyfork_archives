(function ($) {
	"use strict";
	$.fn.smartTable = function (options) {
		var defaults = {
			// true|false
			filterOn: true,
			// true|false
			sortingOn: true,
			// true|false
			hideColumnOn: true,
			// null|html
			sortAscHtml: '<span></span>',
			// null|html
			sortDescHtml: '<span></span>',
			// null|html
			hideColumnHtml: 'x',
			// null|className
			zebraClass: 'zebra-odd-bg',
			// int (0 to disable pagination)
			paginationPerPage: 10
		};

		var settings = $.extend({}, defaults, options);
		var $tbody;

		return this.each(function () {
			var $table = $(this);
			var $thead = $('thead', $table);
			$tbody = $('tbody', $table);
			function pageClick(i, $link) {
				return function() {
					$('.st-nav-link').removeClass('active');
					var page = $link.data('idx');
					var start = page * settings.paginationPerPage;
					var end = start + settings.paginationPerPage;
					$('tr', $tbody).each(function (tix, tr) {
						var $tr = $(this);
						if (tix < start || tix >= end) {
							$tr.addClass('st-hide');
						} else {
							$tr.removeClass('st-hide');
						}
					});
					$link.addClass('active');
				};
			}
			if (!$thead.length || !$tbody.length) {
				window.console.error('I don\'t like tables without thead and tbody');
				return;
			}
			var $trs = $('tr', $thead);
			var $headers = $trs.first();
			var td_th = $('th', $headers).length ? 'th' : 'td';
			var $rows_orig = $('tr', $tbody);
			var $insert_after = $headers;
			// filter
			if (settings.filterOn) {
				var $filter = $('<tr></tr>').addClass('st-filter-row');
				var $inputs = [];
				var type = 'string';
				$(td_th, $headers).each(function (idx, th) {
					var $th = $(this);
					$inputs[idx] = $('<input>');
					$inputs[idx].data('idx', idx);
					$inputs[idx].width($th.width());
					if ($th.hasClass('st-number')) {
						$inputs[idx].attr('type', 'number');
					} else {
						$inputs[idx].attr('type', 'text');
						type = 'string';
					}
					$inputs[idx].keyup(function () {
						var $rows = $('tr', $tbody);
						var $iev = $(this);
						var idx = parseInt($iev.data('idx'));
						var search = $iev.val();
						for (var i = 0, l = $rows.length; i < l; i++) {
							var $tr = $($rows[i]);
							var search_text = $('td:eq(' + idx + ')', $tr).text().toLowerCase();
							if (search.length && $iev.attr('type') === 'text' && search_text.indexOf(search) < 0) {
								$tr.addClass('st-hide');
							} else if (search.length && $iev.attr('type') === 'number' && search_text != search) {
								$tr.addClass('st-hide');
							} else {
								$tr.removeClass('st-hide');
							}
						}
						paginate();
					});
					$('<td></td>').append($inputs[idx]).appendTo($filter);
				});
				$filter.insertAfter($insert_after);
				$insert_after = $filter;
			}
			// buttons
			var $sort_rows = $rows_orig.clone();
			if (settings.sortingOn || settings.hideColumnOn) {
				var $buttons = $('<tr></tr>').addClass('st-buttons-row');
				$(td_th, $headers).each(function (idx, th) {
					var $th = $(this);
					var is_number = $th.hasClass('st-number');
					var is_money = $th.hasClass('st-money');
					var $btn_td = $('<td></td>');
					if (settings.sortingOn) {
						// sort ascending
						var $sort_asc = $('<span></span>').addClass('st-btn st-sort-btn st-sort-asc').html(settings.sortAscHtml);
						$sort_asc.click(function () {
							$('.st-sort-btn').removeClass('active');
							$(this).addClass('active');
							$sort_rows.sort(function (a, b) {
								var text_a = $($('td:eq(' + idx + ')', a)[0]).text();
								var text_b = $($('td:eq(' + idx + ')', b)[0]).text();
								if (is_number) {
									text_a = parseFloat(text_a);
									text_b = parseFloat(text_b);
								} else if (is_money) {
									text_a = parseFloat(text_a.replace(/[^\d\.\-]/g, ''));
									text_b = parseFloat(text_b.replace(/[^\d\.\-]/g, ''));
								}
								if (text_a === text_b) {
									return 0;
								} else {
									return (text_a > text_b ? 1 : -1);
								}
							});
							$('tr', $tbody).remove();
							$tbody.append($sort_rows);
						});
						// sort descending
						var $sort_desc = $('<span></span>').addClass('st-btn st-sort-btn st-sort-desc').html(settings.sortDescHtml);
						$sort_desc.click(function () {
							$('.st-sort-btn').removeClass('active');
							$(this).addClass('active');
							$sort_rows.sort(function (a, b) {
								var text_a = $($('td:eq(' + idx + ')', a)[0]).text();
								var text_b = $($('td:eq(' + idx + ')', b)[0]).text();
								if (is_number) {
									text_a = parseFloat(text_a);
									text_b = parseFloat(text_b);
								} else if (is_money) {
									text_a = parseFloat(text_a.replace(/[^\d\.\-]/g, ''));
									text_b = parseFloat(text_b.replace(/[^\d\.\-]/g, ''));
								}
								if (text_a === text_b) {
									return 0;
								} else {
									return (text_a < text_b ? 1 : -1);
								}
							});
							$('tr', $tbody).remove();
							$tbody.append($sort_rows);
						});
						$btn_td.append($sort_asc).append($sort_desc);
					}
					// hide columns
					if (settings.hideColumnOn) {
						var $hide_col = $('<span></span>').addClass('st-btn st-close').html(settings.hideColumnHtml);
						$hide_col.click(function () {
							$('tr', $table).each(function () {
								$($('td:eq(' + idx + '), th:eq(' + idx + ')', $(this))[0]).addClass('st-hide st-hide-col');
							});
							// update table rows
							$trs = $('tr', $thead);
							$rows_orig = $('tr', $tbody);
							$sort_rows = $rows_orig.clone();
							$headers = $trs.first();
						});
						$btn_td.append($hide_col);
					}

					$btn_td.appendTo($buttons);
				});
				$buttons.insertAfter($insert_after);
				$insert_after = $buttons;
			}
			// zebra
			if (settings.zebraClass !== null) {
				$('tr:nth-child(odd)', $tbody).addClass(settings.zebraClass);
			}
			// pagination
			function paginate() {
				if (settings.paginationPerPage > 0) {
					var $nav_bar = $('.st-nav-bar');
					if ($nav_bar.length) {
						$nav_bar.html('');
					}
					var page = 0;
					var total = $('tr:not(.st-hide)', $tbody).length;
					var page_count = Math.floor(total / settings.paginationPerPage);
					if (page_count > 0) {
						var $link1 = null;
						if (!$nav_bar.length) {
							$nav_bar = $('<td></td>').addClass('st-nav-bar').attr('colspan', $(td_th, $headers).length);
						}
						for (var i = 0; i < page_count; i++) {
							var $link = $('<span></span>').data('idx', i).addClass('st-nav-link').html(i + 1);
							$link.on('click', pageClick(i, $link));
							if ($link1 === null) {
								$link1 = $link;
							}
							$link.appendTo($nav_bar);
						}
						var $nav_bar_row = $('.st-nav-bar-row');
						if (!$nav_bar_row.length) {
							$nav_bar_row = $('<tr></tr>').addClass('st-nav-bar-row');
						}
						$nav_bar_row.append($nav_bar);
						//$nav_bar_row.insertAfter($insert_after);
						//$insert_after = $nav_bar_row;
						var $tfoot = $('tfoot', $table);
						if (!$tfoot.length) {
							$tfoot = $('<tfoot></tfoot>');
						}
						$tfoot.append($nav_bar_row);
						$tfoot.insertAfter($tbody);
						$link1.click();
					}
				}
			}
			paginate();
		});
	};

}(jQuery));