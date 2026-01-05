// ==UserScript==
// @name			2015 웹 접근성 지킴이 및 멘토
// @namespace		http://your.homepage/
// @version			0.3.2
// @description		enter something useful
// @author			You
// @match			http://www.wah.or.kr/side_mento/*
// @match			http://localhost:8080/*
// @match			http://localhost/*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/11820/2015%20%EC%9B%B9%20%EC%A0%91%EA%B7%BC%EC%84%B1%20%EC%A7%80%ED%82%B4%EC%9D%B4%20%EB%B0%8F%20%EB%A9%98%ED%86%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/11820/2015%20%EC%9B%B9%20%EC%A0%91%EA%B7%BC%EC%84%B1%20%EC%A7%80%ED%82%B4%EC%9D%B4%20%EB%B0%8F%20%EB%A9%98%ED%86%A0.meta.js
// ==/UserScript==

if(typeof $ === 'undefined'){
	return;
}

(function(){
	var category,
		//stateParameter
		listType = /state=([^&]+)/g.exec(location.search.substr(1)) ? /state=([^&]+)/g.exec(location.search.substr(1))[1] : null,
		//pagesizeParameter
		//listLength = /pagesize=([^&]+)/g.exec(location.search.substr(1)) === null ? '' : /pagesize=([^&]+)/g.exec(location.search.substr(1))[1],
		listStartNo = 1158 - 1,// mininum: 0
		listEndNo = 2500,// mininum: 0
		maxListLength = listEndNo - listStartNo;

	// 사용자 정의 목록
	if(!listType){
		listType = /state2=([^&]+)/g.exec(location.search.substr(1)) ? /state2=([^&]+)/g.exec(location.search.substr(1))[1] : null;
	}

	// 파일명
	if(!listType){
		listType = /.([^\/]+)$/g.exec(location.pathname) ? /.([^\/]+)$/g.exec(location.pathname)[1] : null;
	}

	// if(parseInt(listLength) >= 100 || listLength == maxListLength){
	// 	listType = listLength;
	// }

	// if(listLength == 'custompage'){
	// 	listType = 'custompage';
	// }

	switch(listType){
		case 'D':
			category = '대기 목록';
			break;
		case 'C':
			category = '평가중 목록';
			break;
		case 'E':
			category = '평가 완료 목록';
			break;
		case 'F':
			category = '종료';
			break;
		case 'G':
			category = '반려';
			break;
		case 'custompage':
			category = '사용자 목록';
			break;
		case 'all':
			category = '모든 목록';
			break;
		// case '100':
		// 	category = '배정 목록 100개';
		// 	break;
		case 'list01.asp':
			category = '배정 목록';
			break;
		case 'list02.asp':
			category = '완료 목록';
			break;
	}

	// 목록 갯수 명 for 페이지 제목(<title>) 추가
	var getEntryLength = function(isManual){
		var defaultEntryLength = parseInt($('.listPage .num01').text()) || '';

		var manualLength = $('.searchBox + table').find('tbody tr:visible').length;
		if(isManual === true){
			return manualLength;
		}
		if($('.searchBox + table').length && defaultEntryLength < manualLength){
			return  manualLength;
		} else if($('.searchBox + table').length){
			return defaultEntryLength || manualLength;
		}
	};

	// 페이지 제목, 목록 개수 업데이트
	window.setTitle = function(isManual){
		// 홈페이지 명 for 페이지 제목(<title>) 추가
		var siteName = $('th:contains("홈페이지 명")').length ? $('th:contains("홈페이지 명")').parent('tr').find('td').text() + ' | ' : '';

		var itemLength = top.document.title.match(/^\(.[^\)]*\)/g) ? top.document.title.replace(/^\(.[^\)]*\)/g, '('+getEntryLength(isManual)+')') : getEntryLength(isManual) ? '('+getEntryLength(isManual)+')' : '';

		var titleCategory = (category ? category + ' | ' : '');
		titleCategory = top.document.title.indexOf(titleCategory) > -1 ? '' : titleCategory;

		var titleSiteName = top.document.title.indexOf(siteName) > -1 ? '' : siteName;
		var defaultTitle = top.document.title.indexOf(titleCategory) > -1 ? '' : top.document.title;
		
		if(itemLength || titleCategory || titleSiteName || defaultTitle){
			top.document.title = itemLength+titleCategory+titleSiteName+defaultTitle;
		}
		if($('.listPage .num01').length){
			$('.listPage .num01').text(getEntryLength(isManual));
		}
	};

	// 세션 유지용 새로고침(60초마다 페이지 갱신)
	if(location.href === 'http://www.wah.or.kr/side_mento/dashboard.asp'){
		top.document.title = 60;

		setInterval(function(){
			top.document.title = parseInt(top.document.title) - 1;
			if(parseInt(top.document.title) <= 0){
				location.reload();
			}
		}, 1000);
	}

	if(!$('tr:visible a[href*="view01.asp"], tr:visible a[href*="view02.asp"]').length && !category){
		return;
	}

	window.time = {};
	time.interval = {};
	time.timeout = {};

	time.timeout.ajaxReportGetInfo = 1000 * 60 * 4;
	time.timeout.ajaxReportGetBoardInfo = 1000 * 60 * 4;
	time.timeout.ajaxReportGetDetail = 1000 * 60 * 4;
	time.interval.backupUtilIframeCORSEventAdd = 10;
	//time.interval.backupObserveStart = 1000;
	time.timeout.backupQueueServerInsertDone = 10;


	window.key = {};
	key.event = {};
	key.event.down = null;

	$('body').on('keydown', function(event){
		key.event.down = event;
	}).on('keyup', function(event){
		key.event.down = null;
	});



	window.util = {};
	util.initialize = function(){
		$(document).ready(function(){
			util.initialize();
		});

		return function(){
			console.log('util.initialize');

			for(prop in this){
				if(typeof this[prop]['initialize'] === 'function'){
					this[prop]['initialize']();
				};
			}
		};
	}();

	util.tableRowHandler = {};
	util.tableRowHandler.initialize = function(){
		if(!$('#tableController').length){
			$('<div id="tableController">').prependTo('body');
		}
		if(!$('#btnTableController').length){
			$('<button type="button" id="btnTableController">table controller</button>').on('click', function(){
				if(!$('.inp_tablecontroller_head').length && !$('.inp_tablecontroller_data').length){
					$('th').parents('table').find('th:nth-child(1)').prepend($('<input type="checkbox" class="inp_tablecontroller_head">').on('click', function(){
						if($(this).prop('checked') === true){
							$(this).parents('table').find('.inp_tablecontroller_data').prop('checked', true);
						} else {
							$(this).parents('table').find('.inp_tablecontroller_data').prop('checked', false);
						}
					}))
					$('th').parents('table').find('td:nth-child(1)').prepend('<input type="checkbox" class="inp_tablecontroller_data">');

					util.inputSelectWithShiftkey.initialize();
				} else {
					$('.inp_tablecontroller_head, .inp_tablecontroller_data').remove();
				}
				if(!$('#btnDeleteSelectedRow').length){
					$('<button type="button" id="btnDeleteSelectedRow" accesskey="d">delete selected row</button>').on('click', function(){
						$('.inp_tablecontroller_data:checked').parents('tr').remove();
					}).appendTo('#tableController');
				}
			}).appendTo('#tableController');
		}
	};

	util.inputSelectWithShiftkey = {};
	util.inputSelectWithShiftkey.initialize = function(){
		var targetInput = $('input[type="checkbox"]:not(.inputSelectWithShiftkey)');

		targetInput.on('click', function(event){
			$('.inpPrevCheckExcuted').removeClass('inpPrevCheckExcuted');
			$('.inpCurrentCheckExcuted').addClass('inpPrevCheckExcuted');

			$('.inpCurrentCheckExcuted').removeClass('inpCurrentCheckExcuted');
			$(this).addClass('inpCurrentCheckExcuted');

			var inpCurrentCheckExcutedIndex = targetInput.index($('.inpCurrentCheckExcuted'));
			var inpPrevCheckExcutedIndex = targetInput.index($('.inpPrevCheckExcuted'));

			var isPressShiftKey = key.event.down ? key.event.down.keyCode === 16 : null;

			if(isPressShiftKey){
				if(inpPrevCheckExcutedIndex){
					if(inpCurrentCheckExcutedIndex > inpPrevCheckExcutedIndex){
						console.log(targetInput.slice(inpPrevCheckExcutedIndex, inpCurrentCheckExcutedIndex), inpPrevCheckExcutedIndex, inpCurrentCheckExcutedIndex)
						targetInput.slice(inpPrevCheckExcutedIndex, inpCurrentCheckExcutedIndex+1).prop('checked', $(this).prop('checked'));
					} else {
						console.log(targetInput.slice(inpCurrentCheckExcutedIndex, inpPrevCheckExcutedIndex), inpCurrentCheckExcutedIndex, inpPrevCheckExcutedIndex)
						targetInput.slice(inpCurrentCheckExcutedIndex, inpPrevCheckExcutedIndex+1).prop('checked', $(this).prop('checked'));
					}
				}
			} else {
				$('.inpPrevCheckExcuted').removeClass('inpPrevCheckExcuted');
			}
		});

		targetInput.addClass('inputSelectWithShiftkey');
	};

	util.contentBoxTableScreenShot = {};
	util.contentBoxTableScreenShot.initialize = function(){
		if(!$('#contentBoxTableScreenShot').length){
			$('<div id="contentBoxTableScreenShot">').prependTo('body');
		}
		if(!$('#btnTakecontentBoxTableScreenShot').length){
			$('<button type="button" id="btnTakecontentBoxTableScreenShot">takeContentBoxTableScreenShot</button>').on('click', function(){
				util.contentBoxTableScreenShot.save();
			}).appendTo('#contentBoxTableScreenShot');
		}
		if(!$('#btnClearContentBoxTableScreenShot').length){
			$('<button type="button" id="btnClearContentBoxTableScreenShot">X</button>').on('click', function(){
				util.contentBoxTableScreenShot.clear();
			}).appendTo('#contentBoxTableScreenShot');
		}

		for(prop in this){
			if(typeof this[prop]['initialize'] === 'function'){
				this[prop]['initialize']();
			};
		}
	};
	util.contentBoxTableScreenShot.save = function(){
		var contentBoxTableScreenShots = [];

		if(localStorage.getItem('contentBoxTableScreenShots')){
			contentBoxTableScreenShots = JSON.parse(localStorage.getItem('contentBoxTableScreenShots'));
		}

		var currentdate = new Date(); 
		var datetime = currentdate.getDate() + "/"
		+ (currentdate.getMonth()+1)  + "/" 
		+ currentdate.getFullYear() + " @ "  
		+ currentdate.getHours() + ":"  
		+ currentdate.getMinutes() + ":" 
		+ currentdate.getSeconds();

		$('#Content-box table').find('.tt_it').parents('tr').remove();
		$('#Content-box table').find('.tt_sel').parents('tr').remove();
		$('#Content-box table').find('tr:hidden').remove();

		contentBoxTableScreenShots.push({
			time: datetime,
			rows: $('#Content-box tbody tr').length,
			data: $('#Content-box table').html()
		});

		localStorage.setItem('contentBoxTableScreenShots', JSON.stringify(contentBoxTableScreenShots));

		util.contentBoxTableScreenShot.list.build();
	};
	util.contentBoxTableScreenShot.clear = function(param){
		console.log('param', param);
		if(!localStorage.getItem('contentBoxTableScreenShots')){
			alert('There\'s not screenshot.');
			return;
		}

		if(param > -1){
			if(confirm('delete selected screenshot?')){
				var contentBoxTableScreenShots = JSON.parse(localStorage.getItem('contentBoxTableScreenShots'));

				console.log('contentBoxTableScreenShots.length', contentBoxTableScreenShots.length);
				console.log('contentBoxTableScreenShots', contentBoxTableScreenShots);
				
				contentBoxTableScreenShots.splice(param-1, 1);

				console.log('contentBoxTableScreenShots.length', contentBoxTableScreenShots.length);
				console.log('contentBoxTableScreenShots', contentBoxTableScreenShots);

				localStorage.setItem('contentBoxTableScreenShots', JSON.stringify(contentBoxTableScreenShots));

				util.contentBoxTableScreenShot.list.build();
			}
		} else if(typeof param === 'undefined') {
			if(confirm('delete all screenshot?')){
				$('#selectScreenShot').empty();
				localStorage.setItem('contentBoxTableScreenShots', '');
			}
		}
	};
	util.contentBoxTableScreenShot.list = {};
	util.contentBoxTableScreenShot.list.initialize = function(){
		if(!$('#selectScreenShot').length){
			$('<select id="selectScreenShot">').on('change', function(){
				if($(this).val()){
					util.contentBoxTableScreenShot.list.save();
					$('#Content-box table').html($(this).val());

			
					// 반려게시판 링크명 변경
					$('a:contains("반려게시판")').text('게시판').attr('target', '_blank').on('click', function(event){
						window.open($(this).attr('href'), '', 'width=650, height=768, menubar=no, status=no, resizable=1, titlebar=no, toolbar=no');
						event.preventDefault();
					});


					// 배정 목록 하이라이트
					$('.BoardList01 tr').on('click', function(){
						$('.BoardList01 tr[style]').css('background-color', '');
						$(this).css('background-color', 'rgba(255, 255, 125, 0.5)');
					});				
				}
			}).appendTo($('#contentBoxTableScreenShot'));
			$('<button type="button">X</button>').on('click', function(){
				util.contentBoxTableScreenShot.clear($('#selectScreenShot').get(0).selectedIndex);
			}).appendTo($('#contentBoxTableScreenShot'));
		}
		util.contentBoxTableScreenShot.list.build();

		/*setTimeout(function(){
			if(localStorage.getItem('screenShotSelectedIndex')){
				util.contentBoxTableScreenShot.list.restore();
			}
		}, 1);*/

	};
	util.contentBoxTableScreenShot.list.save = function(){
		localStorage.setItem('screenShotSelectedIndex', $('#selectScreenShot').get(0).selectedIndex + 1);
	};
	util.contentBoxTableScreenShot.list.restore = function(){
		$('#selectScreenShot option:nth-child('+localStorage.getItem('screenShotSelectedIndex')+')').attr('selected', 'selected');
		$('#selectScreenShot option:nth-child('+localStorage.getItem('screenShotSelectedIndex')+')').prop('selected', true);
		$('#selectScreenShot').trigger('change');
	};
	util.contentBoxTableScreenShot.list.build = function(){
		$('#selectScreenShot').empty();

		if(!localStorage.getItem('contentBoxTableScreenShots')){
			console.log('There\'s not localStorage[\'contentBoxTableScreenShots\'] item.');
			return;
		}
		
		var contentBoxTableScreenShots = JSON.parse(localStorage.getItem('contentBoxTableScreenShots'));
		$('#selectScreenShot').append($('<option></option>'));
		$(contentBoxTableScreenShots).each(function(key, contentBoxTableScreenShot){
			$('#selectScreenShot').append($('<option>').val(contentBoxTableScreenShot.data).text(contentBoxTableScreenShot.time+'('+contentBoxTableScreenShot.rows+')'));
		});
	};

	util.deleteVisibleReportFromDb = {};
	util.deleteVisibleReportFromDb.initialize = function(){
		if(!$('#deleteVisibleReportFromDb').length){
			$('<button type="button" id="deleteVisibleReportFromDb">delete visible report from DB</button>').on('click', function(){
				if(!confirm('delete visible report from DB?')){
					return;
				}
				util.deleteVisibleReportFromDb.queue.clear();
				$('.deleteVisibleReportFromDbExcuted').removeClass('deleteVisibleReportFromDbExcuted');

				util.deleteVisibleReportFromDb.queue.deleteReportFromDbAjaxDone.push(function(params){
					var targetTr = params.reportUrlElement.parents('tr')
						,reportLength = parseInt(targetTr.find('.td_reportlength').text())
						,dbReportLength = parseInt(params.resultLength);

					targetTr.find('.td_reportdblength').text(dbReportLength);

					if(reportLength > dbReportLength){
						targetTr.find('.td_reportlengthcompareresult').text('reportLength > dbReportLength').addClass('diffrent');
					}

					if(reportLength < dbReportLength){
						targetTr.find('.td_reportlengthcompareresult').text('reportLength < dbReportLength').addClass('diffrent');
					}

					if(reportLength === dbReportLength){
						targetTr.find('.td_reportlengthcompareresult').text('reportLength = dbReportLength').removeClass('diffrent').addClass('same');
					}

					util.deleteVisibleReportFromDb.check();
				});

				util.deleteVisibleReportFromDb.check();
			}).prependTo('body');
		}
	};
	util.deleteVisibleReportFromDb.queue = {};
	util.deleteVisibleReportFromDb.queue.clear = function(){
		for(prop in this){
			if(typeof this[prop].length == 'number'){
				this[prop].length = 0;
			}
		}
	};
	util.deleteVisibleReportFromDb.queue.deleteReportFromDbAjaxDone = [];
	util.deleteVisibleReportFromDb.data = [];
	util.deleteVisibleReportFromDb.check = function(){
		$('a:visible:contains("보고서"):not(.deleteVisibleReportFromDbExcuted)').each(function(key, reportUrlElement){
			$(reportUrlElement).addClass('deleteVisibleReportFromDbExcuted');

			util.deleteVisibleReportFromDb.data.push($(reportUrlElement));
		});

		util.deleteVisibleReportFromDb.deleteReportFromDb();
	};
	util.deleteVisibleReportFromDb.deleteReportFromDb = function(param){
		/*
			@param: $(reportUrlElement)
		*/
		if(!param && !util.deleteVisibleReportFromDb.data.length){
			console.log('There\'s not util.deleteVisibleReportFromDb.data.length. length: ', util.deleteVisibleReportFromDb.data.length);
			return;
		}

		var reportUrlElement = param || util.deleteVisibleReportFromDb.data.shift();

		$.ajax({
			url: 'http://localhost/deletereport.php?reporturl='+encodeURIComponent(reportUrlElement.attr('href').replace('http://www.wah.or.kr/side_mento/', ''))
		}).fail(function(){
			console.log('ajax faild: util.deleteVisibleReportFromDb.getLengthFromDb')
		}).done(function(resultLength){
			if(util.deleteVisibleReportFromDb.queue.deleteReportFromDbAjaxDone.length){
				var returnResult = true;

				for(var i=0; i<util.deleteVisibleReportFromDb.queue.deleteReportFromDbAjaxDone.length; i+=1){
					var params = {
						reportUrlElement : reportUrlElement,
						resultLength : resultLength
					};
					if(util.deleteVisibleReportFromDb.queue.deleteReportFromDbAjaxDone[i](params) === false){
						returnResult = false;
					}
				}

				if(returnResult === false){
					return;
				}
			}
		});
	};

	util.compareReportLengthOfLocalAndDb = {};
	util.compareReportLengthOfLocalAndDb.initialize = function(){
		$('.compareReportLengthOfLocalAndDbCheckExcuted').removeClass('compareReportLengthOfLocalAndDbCheckExcuted');
		$('.td_reportlengthcompareresult').removeClass('diffrent').removeClass('same').text('');
		util.compareReportLengthOfLocalAndDb.queue.clear();

		if(!$('#compareAllReportLengthOfLocalAndDb').length){
			$('<button type="button" id="compareAllReportLengthOfLocalAndDb">compare All Report Length Of Local & Db</button>').on('click', function(){
				util.compareReportLengthOfLocalAndDb.initialize();

				//add col
				if(!$('.col_reportdblength').length || !$('.col_reportlengthcomepareresult').length){
					$('.col_reportlength').after('<col class="col_reportdblength" width="4%"></col><col class="col_reportlengthcomepareresult" width="12%"></col>');
				}
				//add th
				if(!$('th:contains("DB리포팅수")').length || !$('th:contains("리포팅수비교")').length){
					$('#Content-box table thead th:contains("리포팅수")').after('<th scope="col">DB<br />리포팅수</th><th scope="col">리포팅수<br />비교</th>');
				}
				//add th
				if(!$('.td_reportdblength').length || !$('.td_reportlengthcompareresult').length){
					$('.td_reportlength').after('<td class="td_reportdblength"></td><td class="td_reportlengthcompareresult"></td>');	//리포팅수
				}

				util.compareReportLengthOfLocalAndDb.queue.getLengthFromDbAjaxDone.push(function(params){
					var targetTr = params.reportUrlElement.parents('tr')
						,reportLength = parseInt(targetTr.find('.td_reportlength').text())
						,dbReportLength = parseInt(params.resultLength);

					targetTr.find('.td_reportdblength').text(dbReportLength);

					if(reportLength > dbReportLength){
						targetTr.find('.td_reportlengthcompareresult').text('reportLength > dbReportLength').addClass('diffrent');
					}

					if(reportLength < dbReportLength){
						targetTr.find('.td_reportlengthcompareresult').text('reportLength < dbReportLength').addClass('diffrent');
					}

					if(reportLength === dbReportLength){
						targetTr.find('.td_reportlengthcompareresult').text('reportLength = dbReportLength').addClass('same');
					}

					util.compareReportLengthOfLocalAndDb.check();
				});

				util.compareReportLengthOfLocalAndDb.check();
			}).prependTo('body');
		}

	};
	util.compareReportLengthOfLocalAndDb.queue = {};
	util.compareReportLengthOfLocalAndDb.queue.clear = function(){
		for(prop in this){
			if(typeof this[prop].length == 'number'){
				this[prop].length = 0;
			}
		}
	};
	util.compareReportLengthOfLocalAndDb.queue.getLengthFromDbAjaxDone = [];
	util.compareReportLengthOfLocalAndDb.data = [];
	util.compareReportLengthOfLocalAndDb.check = function(){
		$('a:contains("보고서"):not(.compareReportLengthOfLocalAndDbCheckExcuted)').each(function(key, reportUrlElement){
			$(reportUrlElement).addClass('compareReportLengthOfLocalAndDbCheckExcuted');

			util.compareReportLengthOfLocalAndDb.data.push($(reportUrlElement));
		});

		util.compareReportLengthOfLocalAndDb.getLengthFromDb();
	};
	util.compareReportLengthOfLocalAndDb.getLengthFromDb = function(param){
		$(new Array(3)).each(function(){
			/*
				@param: $(reportUrlElement)
			*/
			if(!param && !util.compareReportLengthOfLocalAndDb.data.length){
				console.log('There\'s not util.compareReportLengthOfLocalAndDb.data.length. length: ', util.compareReportLengthOfLocalAndDb.data.length);
				return;
			}

			var reportUrlElement = param || util.compareReportLengthOfLocalAndDb.data.shift();

			$.ajax({
				url: 'http://localhost/getreportlength.php?reporturl='+encodeURIComponent(reportUrlElement.attr('href').replace('http://www.wah.or.kr/side_mento/', ''))
			}).fail(function(){
				console.log('ajax faild: util.compareReportLengthOfLocalAndDb.getLengthFromDb')
			}).done(function(resultLength){
				if(util.compareReportLengthOfLocalAndDb.queue.getLengthFromDbAjaxDone.length){
					var returnResult = true;

					for(var i=0; i<util.compareReportLengthOfLocalAndDb.queue.getLengthFromDbAjaxDone.length; i+=1){
						var params = {
							reportUrlElement : reportUrlElement,
							resultLength : resultLength
						};
						if(util.compareReportLengthOfLocalAndDb.queue.getLengthFromDbAjaxDone[i](params) === false){
							returnResult = false;
						}
					}

					if(returnResult === false){
						return;
					}
				}
			});
		});
	};

	window.report = {};

	report.initialize = function(){
		$(document).ready(function(){
			report.initialize();
		});

		return function(){
			// 보고서 도구 버튼 추가
			if(!$('#btnGetReportInfo').length){
				$('<button type="button" id="btnGetReportInfo" accesskey="1">[1]get Report Info</button>').on('click', function(){
					report.queue.clear();
					report.queue.reportGetInfoFirst.push(function(){
					});
					report.queue.reportGetInfoAjaxDone.push(function(hasReport){
						report.get.info();
					});
					report.queue.reportGetDetailFirst.push(function(){
					});
					report.queue.reportGetDetailAjaxDone.push(function(){
					});

					report.get.info();
				}).prependTo('body');
			}
			if(!$('#btnGetReportInfoAndDetail').length){
				$('<button type="button" id="btnGetReportInfoAndDetail" accesskey="2">[2]get Report Info & Detail</button>').on('click', function(){
					report.queue.clear();
					report.queue.reportGetInfoFirst.push(function(){
						
					});
					report.queue.reportGetInfoAjaxDone.push(function(hasReport){
						if($('a:contains("보고서"):not(.reportGetDetailExcuted):not(.reportGetDetailFailed)').length){
							report.get.detail();
						} else {
							report.get.info();
						}
					});
					report.queue.reportGetDetailFirst.push(function(){
					});
					report.queue.reportGetDetailAjaxFailedRetryDone.push(function(){
						if($('tr:visible a[href*="view01.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed), tr:visible a[href*="view02.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed)').length){
							report.get.info();
						}
					});
					report.queue.reportGetDetailAjaxDone.push(function(){
						report.get.info();
					});

					report.get.info();
				}).prependTo('body');
			}
			if(!$('#btnGetAllVisibleReportDetail').length){
				$('<button type="button" id="btnGetAllVisibleReportDetail">get all visible Report Detail</button>').on('click', function(){
					report.queue.clear();
					//console.log('btnRetryGetFailedReportDetail: ', $('.failed .reportGetDetailFailed.reportGetDetailExcuted'));

					$('a:contains("보고서"):visible').removeClass('reportGetDetailFailed').removeClass('reportGetDetailExcuted');

					report.queue.reportGetInfoFirst.push(function(){
					});
					report.queue.reportGetInfoAjaxDone.push(function(hasReport){
					});
					report.queue.reportGetDetailFirst.push(function(){
					});
					report.queue.reportGetDetailAjaxDone.push(function(){
						report.get.detail();
					});

					report.get.detail();
				}).prependTo('body');
			}
			if(!$('#btnRetryGetFailedReportDetail').length){
				$('<button type="button" id="btnRetryGetFailedReportDetail">Retry get failed Report Info & Detail</button>').on('click', function(){
					report.queue.clear();
					//console.log('btnRetryGetFailedReportDetail: ', $('.failed .reportGetDetailFailed.reportGetDetailExcuted'));

					$('.failed .reportGetDetailFailed.reportGetDetailExcuted').removeClass('reportGetDetailFailed').removeClass('reportGetDetailExcuted');

					report.queue.reportGetInfoFirst.push(function(){
					});
					report.queue.reportGetInfoAjaxDone.push(function(hasReport){
					});
					report.queue.reportGetDetailFirst.push(function(){
					});
					report.queue.reportGetDetailAjaxDone.push(function(){
						report.get.detail();
					});

					report.get.detail();
				}).prependTo('body');
			}

			// 행 추가
			if(!$('.td_num, .td_categoryorder, .td_region, .td_homepagename, .td_reportlength, .td_reporturl, .td_homepageurl, .td_mento, .td_tester, .td_state, .td_datestart, .td_dateend').length){
				//table head
				//$('#Content-box table thead th:contains("홈페이지명")').after('<th>바로가기</th><th>홈페이지</th><th>지킴이</th>');
				$('#Content-box table thead th:contains("홈페이지명")').after('<th scope="col">리포팅수</th>\
					<th scope="col">리포트</th>\
					<!--<th scope="col">홈페이지</th>-->\
					<th scope="col">멘토</th>');
				$('#Content-box col[width="*"]').after('<col>\
					<col>\
					<!--<col>-->\
					<col>');

				//table body
				$('#Content-box table tbody tr td:nth-child(4)').each(function(key, el){
					$(el).after('<td></td>\
						<td></td>\
						<!--<td></td>-->\
						<td></td>');
				});

				//$('#Content-box col[width="*"]').after('<col width="5%"><col width="15%">');

				/**
				// tr convert to tbody > tr
				$('tr:visible a[href*="view01.asp"], tr:visible a[href*="view02.asp"]').each(function(key, el){
					var linkReport = $(el);
					var siteTable = linkReport.parents('table');
					var siteTableRow = linkReport.parents('tr');
					var siteTableTbody = $('<tbody>');
					siteTableRow.appendTo(siteTableTbody);
					siteTableTbody.appendTo(siteTable);
					
					if(key == 0){
						console.log(siteTable.find('tbody:empty'));
						siteTable.find('tbody:empty').remove();
					}

					//var $statusLoadingGallery = linkReport.after('<span class="txt_status">');

					siteTableRow.find('a').on('click', function(event){
						event.stopPropagation();
					});

					siteTableRow.on('click', function(event){
						var $siteTableRow = $(this);
						if(!$siteTableRow.find('.txt_status').hasClass('called')){
							$.ajax({
								url: linkReport.parents('td').next().find('a').attr('href'),
								dataType: 'text',
								beforeSend: function(){
									$siteTableRow.find('.txt_status').text('샘플페이지 이미지 로딩중');
									$siteTableRow.find('.txt_status').addClass('called');
								}
							}).done(function(result){
								var $result = $('<div>').html(result);

								if($result.find('#elSamplePage img').length){
									var siteGalleryRow = $('<tr class="row_sample"><td colspan="11"><div class="area_gallery"><div class="inner"></div></div></td></tr>');
									$siteTableRow.after(siteGalleryRow);

									var sampleImageArea = siteGalleryRow.find('.area_gallery .inner');

									$siteTableRow.find('.txt_status').text('샘플페이지 로딩 완료');

									$result.find('#elSamplePage img').each(function(key, el){
										var sampleImage = $(el);
										var pageContent = sampleImage.parents('li').next().find('.content');
										var pageUrl = pageContent.text().match(/페이지 URL :(.+)/g)[0].replace('페이지 URL :', '');
										var pagePathName = pageContent.text().match(/페이지 경로 :(.+)/g)[0].replace('페이지 경로 :', '');

										var sampleImageLink = $('<a href="'+pageUrl+'" target="_blank" title="새 창 열림">').append(sampleImage);

										var sampleImageLink = $('<div class="gallery"><span class="txt_path">'+pagePathName+'</span></div>').append(sampleImageLink);
										$(sampleImageLink).on('click', function(){
											$($(this).attr('href')).get(0).click();
										}).appendTo(sampleImageArea);
									});		
								} else {
									$siteTableRow.find('.txt_status').text('샘플페이지 이미지 없음');
								}
								//$(el).parents('td').replaceWith('<th scope="rowgroup" class="td_sampleimage">'+$($(el).parents('td').get(0)).html()+'</th>');			
							});
						}
						if($siteTableRow.next('.row_sample').length){
							$siteTableRow.next('.row_sample').toggle();
						}
					});
				});
				/**/

				// 모든 목록 가상 행 추가
				if(listType == 'all'){
					$('.BoardList01 tbody').empty();

					$(new Array(maxListLength)).each(function(key){
						var key = key + listStartNo + 1;
						var entry = '\
						<tr>\
							<td class="td_num first">'+key+'</td>\
							<td class="td_categoryorder"></td>\
							<td class="td_region"></td>\
							<td class="td_homepagename left"><a href="view01.asp?con_seq=7&amp;reg_seq='+key+'"></a></td>\
							<td class="td_reportlength"></td>\
							<td class="td_reporturl"><a href="#none"></a></td>\
							<!--<td class="td_homepageurl"></td>-->\
							<td class="td_mento"></td>\
							<td class="td_tester"></td>\
							<td class="td_state"></td>\
							<td class="td_datestart"></td>\
							<td class="td_dateend"></td>\
							<td class="td_board"><a href="board_list.asp?con_seq=7&amp;reg_seq='+key+'">반려게시판</a></td>\
						</tr>\
						';

						$('.BoardList01 tbody').append($(entry.replace(/\t|\n/g, '')));
					});
				}

				// 사용 목록 가상 행 추가
				if(listType == 'custompage'){
					$('.BoardList01 tbody').empty();

					$('#Title_box').before($('<input type="text" class="inp_custompage" placeholder="N, N, N">').on('keyup', function(){
						$('.BoardList01 tbody').empty();

						var nums = $(this).val().replace(' ', '').split(',');

						//console.log('nums', nums);
						//console.log('nums.length', nums.length);
						if(!nums.length || !$(this).val().length){
							return;
						}

						$(nums).each(function(key, num){
							var entry = '\
							<tr>\
								<td class="td_num first">'+num+'</td>\
								<td class="td_categoryorder"></td>\
								<td class="td_region"></td>\
								<td class="td_homepagename left"><a href="view01.asp?con_seq=7&amp;reg_seq='+num+'"></a></td>\
								<td class="td_reportlength"></td>\
								<td class="td_reporturl"><a href="#none"></a></td>\
								<!--<td class="td_homepageurl"></td>-->\
								<td class="td_mento"></td>\
								<td class="td_tester"></td>\
								<td class="td_state"></td>\
								<td class="td_datestart"></td>\
								<td class="td_dateend"></td>\
								<td class="td_board"></td>\
							</tr>\
							';

							$('.BoardList01 tbody').append($(entry.replace(/\t|\n/g, '')));
						});
					}));

					// $(new Array(maxListLength)).each(function(key){
					// 	var key = key + listStartNo + 1;
					// 	var entry = '\
					// 	<tr>\
					// 		<td class="first">'+key+'</td>\
					// 		<td></td>\
					// 		<td></td>\
					// 		<td class="left"><a href="view01.asp?con_seq=7&amp;reg_seq='+key+'"></a></td>\
					// 		<td></td>\
					// 		<td><a href="#none"></a></td>\
					// 		<td></td>\
					// 		<td></td>\
					// 		<td></td>\
					// 		<td></td>\
					// 		<td></td>\
					// 		<td></td>\
					// 	</tr>\
					// 	';

					// 	$('.BoardList01 tbody').append($(entry.replace(/\t|\n/g, '')));
					// });
				}

				// add class col
				$('#Content-box table col:not([width="*"])').attr('width', '');
				$('#Content-box table col:nth-child(1)')	.attr('class', 'col_num')			.attr('width', '4%');	//번호
				$('#Content-box table col:nth-child(2)')	.attr('class', 'col_categoryorder')	.attr('width', '4%');	//신청구분
				$('#Content-box table col:nth-child(3)')	.attr('class', 'col_region')		.attr('width', '5%');	//지역
				$('#Content-box table col:nth-child(4)')	.attr('class', 'col_homepagename')	.attr('width', '*')	;	//홈페이지명
				$('#Content-box table col:nth-child(5)')	.attr('class', 'col_reportlength')	.attr('width', '5%');	//리포팅수
				$('#Content-box table col:nth-child(6)')	.attr('class', 'col_reporturl')		.attr('width', '5%');	//바로가기
				//$('#Content-box table col:nth-child(7)')	.attr('class', 'col_homepageurl')	.attr('width', '15%');	//홈페이지
				$('#Content-box table col:nth-child(7)')	.attr('class', 'col_mento')			.attr('width', '5%');	//멘토
				$('#Content-box table col:nth-child(8)')	.attr('class', 'col_tester')		.attr('width', '20%');	//지킴이
				$('#Content-box table col:nth-child(9)')	.attr('class', 'col_state')			.attr('width', '7%');	//상태
				$('#Content-box table col:nth-child(10)')	.attr('class', 'col_datestart')		.attr('width', '8%');	//배정일
				$('#Content-box table col:nth-child(11)')	.attr('class', 'col_dateend')		.attr('width', '8%');	//완료일
				$('#Content-box table col:nth-child(12)')	.attr('class', 'col_board')			.attr('width', '16%');	//반려게시판

				// add class td
				$('#Content-box table td:nth-child(1)')		.attr('class', 'td_num');			//번호
				$('#Content-box table td:nth-child(2)')		.attr('class', 'td_categoryorder');	//신청구분
				$('#Content-box table td:nth-child(3)')		.attr('class', 'td_region');		//지역
				$('#Content-box table td:nth-child(4)')		.attr('class', 'td_homepagename');	//홈페이지명
				$('#Content-box table td:nth-child(5)')		.attr('class', 'td_reportlength');	//리포팅수
				$('#Content-box table td:nth-child(6)')		.attr('class', 'td_reporturl');		//바로가기
				//$('#Content-box table td:nth-child(7)')		.attr('class', 'td_homepageurl');	//홈페이지
				$('#Content-box table td:nth-child(7)')		.attr('class', 'td_mento');			//멘토
				$('#Content-box table td:nth-child(8)')		.attr('class', 'td_tester');		//지킴이
				$('#Content-box table td:nth-child(9)')		.attr('class', 'td_state');			//상태
				$('#Content-box table td:nth-child(10)')	.attr('class', 'td_datestart');		//배정일
				$('#Content-box table td:nth-child(11)')	.attr('class', 'td_dateend');		//완료일
				$('#Content-box table td:nth-child(12)')	.attr('class', 'td_board');		//반려게시판
			}

			//css
			if($('style:not([class])').length){
				$('style:not([class])').remove();
			}
			$('<style>\
				#Content-box table,\
				#Content-box tr,\
				#Content-box th,\
				#Content-box td {white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}\
				#Content-box tr:hover {background-color:rgba(255, 255, 125, 0.5);}\
				#Content-box table tbody th {border-left:1px solid #dcdcdc;font-weight:normal;padding-left:10px;text-indent:0;background-color:inherit;}\
				#Content-box .txt_status {color:#999;font-size:11px;margin-left:4px;}\
				#Content-box .row_sample td {padding:0;border:0 none;white-space:normal;}\
				#Content-box .row_sample .area_gallery {overflow:hidden;width:100%;border-bottom:1px solid #DCDCDC;text-align:left;font-family:"맑은 고딕";}\
				#Content-box .row_sample .inner {width:calc(100% + 1px);}\
				#Content-box .row_sample .gallery {display:inline-block;width:calc(25% - 1px);margin:0 1px 1px 0;text-align:center;vertical-align:top;}\
				#Content-box .row_sample .gallery img {width:100%;max-width:100%;}\
				#Content-box .row_sample .txt_path {display:block;text-align:center;background-color:#0f0f0f;color:#fff;padding:3px;}\
				#Content-box tr.failed {background-color:red;}\
				#Content-box tr.failed * {color:#fff;}\
				#Content-box td {padding-left:4px;padding-right:4px;}\
				/* for control(backup) */\
				#btnServerBackup {position:fixed;top:0;right:0;z-index:1001}\
				/* for multiline th */\
				.BoardList01 thead tr th {background-size:100% 100%;}\
				/* for reportLengthCompare */\
				#Content-box td.same {background-color:green;color:#fff;}\
				#Content-box td.diffrent {background-color:red;color:#fff;}\
				/* for custompage */\
				.inp_custompage {display:block;position:relative;z-index:11;width:calc(100% - 1em);height:3em;margin:3px auto -20px;box-sizing:border-box;line-height:3em;}\
				/* for 게시물 목록 */\
				#Content-box table td a[title="(새 창)마지막 반려 게시물 확인하기"] {letter-spacing:-1px;color:blue;}\
				#Content-box .td_board {text-align:left;}\
				#Content-box .td_board * {margin-right:2px;}\
				#Content-box .td_board .btn-white {padding:0;}\
			</style>').appendTo('head');
		};
	}();


	report.observe = {};
	report.observe.info = {};
	report.observe.info.add = function(){

	};

	report.observe.items = {};
	report.observe.items.add = function(){

	};

	report.get = {};
	report.get.info = function(){
		console.log('report.get.info');

		if(report.queue.reportGetInfoFirst.length){
			var returnResult = true;

			$(report.queue.reportGetInfoFirst).each(function(key, action){
				if(action() === false){
					returnResult = false;
				}
			});

			if(returnResult === false){
				return;
			}
		}

		if(!$('tr:visible a[href*="view01.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed), tr:visible a[href*="view02.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed)').length){
			console.log('기본 보고서 호출 메시지: 기본 보고서 정보를 가져올 기본 보고서 가능 링크가 없습니다.');
			return false;
		}

		var procThread		= 1,
			procRetryCount	= 1,
			procFailFunc	= function(el, siteTableRow){
				//console.log('procFailFunc');
				var retryCount = parseInt((el.data('ajax_count') || 0));

				if(retryCount >= procRetryCount){
					el.parents('tr').addClass('failed');
					el.addClass('reportGetInfoFailed');
					// if(siteTableRow.length){
					// 	siteTableRow.remove();
					// }
				} else {
					el.removeClass('reportGetInfoExcuted');
					el.data('ajax_count', retryCount + 1);
				}

				if($('tr:visible a[href*="view01.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed), tr:visible a[href*="view02.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed)').length){
					report.get.info();
				}

			};

		// 샘플 페이지 열 추가
		$('tr:visible a[href*="view01.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed), tr:visible a[href*="view02.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed)').slice(0, procThread).each(function(key, el){
			$(el).addClass('reportGetInfoExcuted');

			var linkReportInfo = $(el),
				siteTableRow = $(el).parents('tr');

			// ajax for get info
			$.ajax({
				url: linkReportInfo.attr('href'),
				dataType: 'html',
				timeout: time.timeout.ajaxReportGetInfo
			}).fail(function(){
				procFailFunc(linkReportInfo, siteTableRow);
			}).done(function(result){
				var result = $('<div>').html(result);

				// 열 정보 추가 시작

				if(listType == 'all' || listType == 'custompage'){
					var category = result.find("table th:contains('신청구분')").first().next().text();
					siteTableRow.find('.td_categoryorder').text(category);

					var region = result.find("table th:contains('지역')").first().next().text();
					siteTableRow.find('.td_region').text(region);

					var homepageName = result.find("table th:contains('홈페이지 명')").first().next().text();
					siteTableRow.find('.td_homepagename').find('a').text(homepageName);

					var dateAssign = result.find("table th:contains('지킴이 배정일')").first().next().text();
					siteTableRow.find('.td_datestart').text(dateAssign);
				}

				// 바로가기, 지킴이, URL 열
				/*
					@description reportUrl
					http://www.wah.or.kr/side_mento/rprt.asp?con_seq=7&reg_seq=1175&rpt_seq=1095

					&con_seq=7
					&reg_seq=1175
					&rpt_seq=1095
				*/
				var reportUrl = result.find('.btn-orange').length ? result.find('.btn-orange').attr('href') : '';
				siteTableRow.find('.td_reporturl').html(reportUrl ? '<a href="'+reportUrl.replace('&', '&amp;')+'" target="_blank" title="평가보고서 조회 새 창 바로가기">보고서</a>' : '');

				var homepageUrl = result.find("table th:contains('홈페이지 주소')").first().next().text();
				siteTableRow.find('.td_homepageurl').html(homepageUrl ? '<a href="'+homepageUrl+'" target="_blank">'+homepageUrl+'</a>' : '');

				var tester = result.find("table th:contains('지킴이')").first().next().text();
				var tester2 = result.find("table th:contains('지킴이 변경')").first().next().text();
				tester2 = tester2 && (tester != tester2) ? tester2 : '';
				var testers = tester2 ? '<span title="이전 지킴이: '+tester+'" style="text-decoration:underline;">'+tester2+'</span>' : tester;
				//siteTableRow.find('td').text(tester2 || tester);
				siteTableRow.find('.td_tester').html(testers);

				// 멘토 열
				var mentoList = {
					'서울1': '전현경',
					'서울2': '박미숙',
					'서울3': '류영일',
					'경기1': '김데레사',
					'경기2': '박미현',
					'충청1': '정승미',
					'충청2': '금은하',
					'경상1': '김기훈',
					'경상2': '이지성',
					'전라1': '차정현',
					'전라2': '김미선'
				};

				try {
					var region = /\((.[^\)]+)/g.exec(tester2 || tester) ? /\((.[^\)]+)/g.exec(tester2 || tester)[1].replace(/\s/g, '') : '';
				
					//var region = /\((.[^\)]+)/g.exec(tester2 || tester)[1].replace(/\s/g, '') || '';
				} catch(e) {
					console.error('report.get.info > ajax.done > region error: ', e);
				}

				var mento = region ? (typeof mentoList[region] !== 'undefined' ? mentoList[region] : '없음') : '없음';
				siteTableRow.find('.td_mento').text(region ? mento : '');

				// 열 정보 추가 끝

				// 반려건 정보 추가
				// if(!result.find('dd:contains("반려 내용이 없습니다.")').length){
				// 	linkReportInfo.before('<span class="txt_ban">(반려건)</span>');
				// }
				report.get.board();

				if(report.queue.reportGetInfoAjaxDone.length){
					var returnResult = true;

					$(report.queue.reportGetInfoAjaxDone).each(function(key, action){
						if(action() === false){
							returnResult = false;
						}
					});

					if(returnResult === false){
						return;
					}
				}
			});
		});

		// 페이지 제목, 목록 개수 업데이트
		setTitle();
	};

	//반려게시판 정보
	report.get.board = function(){
		var procThread		= 1,
			procRetryCount	= 1,
			procFailFunc	= function(el, siteTableRow){
				//console.log('procFailFunc');
				// var retryCount = parseInt((el.data('ajax_count') || 0));

				// if(retryCount >= procRetryCount){
				// 	el.parents('tr').addClass('failed');
				// 	el.addClass('reportGetInfoFailed');
				// 	// if(siteTableRow.length){
				// 	// 	siteTableRow.remove();
				// 	// }
				// } else {
				// 	el.removeClass('reportGetInfoExcuted');
				// 	el.data('ajax_count', retryCount + 1);
				// }

				// if($('tr:visible a[href*="view01.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed), tr:visible a[href*="view02.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed)').length){
				// 	report.get.info();
				// }
			};

		$('tr:visible a[href*="board_list.asp"]:not(.reportGetBoardInfoExcuted):not(.reportGetBoardInfoFailed)').slice(0, procThread).each(function(key, el){
			$(el).addClass('reportGetBoardInfoExcuted');

			// ajax for get board info
			var linkBoardInfo = $(el);

			$.ajax({
				url: linkBoardInfo.attr('href'),
				dataType: 'html',
				timeout: time.timeout.ajaxReportGetBoardInfo
			}).fail(function(){
				procFailFunc(linkBoardInfo, siteTableRow);
			}).done(function(result){
				var result = $('<div>').html(result);

				// 반려 게시물 등록
				if(result.find('a:contains("등록")').length){
					linkBoardInfo.parents('td').append($('<a href="'+result.find('a:contains("등록")').attr('href')+'" target="_blank" class="btn-white" title="(새 창)반려 게시물 등록하기">등록</a>').on('click', function(event){
						window.open($(this).attr('href'), '', 'width=650, height=768, menubar=no, status=no, resizable=1, titlebar=no, toolbar=no');
						event.preventDefault();
					}));
				}

				// 반려건 정보 추가
				if(!result.find('td:contains("데이터가 없습니다.")').length){
					linkBoardInfo.parents('td').append($('<a href="'+result.find('a[href^="board_content.asp"]').first().attr('href')+'" target="_blank" title="(새 창)마지막 반려 게시물 확인하기">최근 반려내용('+result.find('td:nth-child(3)').get(0).innerHTML+')</a>').on('click', function(event){
						window.open($(this).attr('href'), '', 'width=650, height=768, menubar=no, status=no, resizable=1, titlebar=no, toolbar=no');
						event.preventDefault();
					}));
				}

			});
			// 반려 처리
			var regSeq = /reg_seq=([0-9]+)/g.exec(linkBoardInfo.attr('href'))[1];

			linkBoardInfo.after($('<a href="banProc.asp?reg_seq='+regSeq+'&con_seq=7&rpt_seq=" target="_blank" class="btn-white" title="(새 창)반려하기">반려</a>').on('click', function(event){
				if(confirm('반려처리 하시겠습니까? 반려취소는 보고서 페이지에서 반려 취소 가능합니다.') === true){
					window.open($(this).attr('href'), '', 'width=750, height=768, menubar=no, status=no, resizable=1, titlebar=no, toolbar=no');
				}
				event.preventDefault();
			}));
		});
	};

	report.get.detail = function(){
		console.log('report.get.detail');

		if(report.queue.reportGetDetailFirst.length){
			var returnResult = true;

			$(report.queue.reportGetDetailFirst).each(function(key, action){
				if(action() === false){
					returnResult = false;
				}
			});

			if(returnResult === false){
				return;
			}
		}

		if(!$('a:contains("보고서"):not(.reportGetDetailExcuted):not(.reportGetDetailFailed)').length){
			console.log('상세 보고서 호출 메시지: 상세 보고서 정보를 가져올 상세 보고서 가능 링크가 없습니다.');
			return;
		}

		var procThread		= 1,
			procRetryCount	= 1,
			procFailFunc	= function(el){
				//console.log('procFailFunc');
				var retryCount = parseInt((el.data('ajax_count') || 0));

				if(retryCount >= procRetryCount){
					el.parents('tr').addClass('failed');
					el.addClass('reportGetDetailFailed');

					if(report.queue.reportGetDetailAjaxFailedRetryDone.length){
						var returnResult = true;

						$(report.queue.reportGetDetailAjaxFailedRetryDone).each(function(key, action){
							if(action() === false){
								returnResult = false;
							}
						});

						if(returnResult === false){
							return;
						}
					}
				} else {
					el.removeClass('reportGetDetailExcuted');
					el.data('ajax_count', retryCount + 1);
				}

				if($('a:contains("보고서"):not(.reportGetDetailExcuted):not(.reportGetDetailFailed)').length){
					report.get.detail();
				}
			};

		$('a:contains("보고서"):not(.reportGetDetailExcuted):not(.reportGetDetailFailed)').slice(0, procThread).each(function(key, el){
			$(el).addClass('reportGetDetailExcuted');

			var linkReportDetail = $(el),
				siteTableRow = $(el).parents('tr');

			var reportUrl	= linkReportDetail.attr('href'),
				mento		= siteTableRow.find('.td_mento').text(),
				tester		= siteTableRow.find('.td_tester').text();

			$.ajax({
				url: reportUrl.replace('&amp;', '&'),
				dataType: 'html',
				timeout: time.timeout.ajaxReportGetDetail
			}).fail(function(){
				procFailFunc(linkReportDetail);
			}).done(function(resultReport){
				var resultReport = $('<div>').html(resultReport);

				var resultReportItems = resultReport.find('.h2-box').nextAll('.BoardView');
				var reportItemsSize = resultReportItems.length || 0;

				siteTableRow.find('.td_reportlength').text(reportItemsSize);

				if(report.queue.reportGetDetailAjaxDone.length){
					var returnResult = true;
					/*$(report.queue.reportGetDetailAjaxDone).each(function(key, action){
						if(action() === false){
							returnResult = false;
						}
					});

					if(returnResult === false){
						return;
					}*/
					for(var i=0; i<report.queue.reportGetDetailAjaxDone.length; i+=1){
						var params = {
							reportItemsSize : reportItemsSize,
							resultReportItems : resultReportItems,
							resultReport : resultReport,
							tester : tester,
							mento : mento,
							reportUrl : reportUrl,
							siteTableRow : siteTableRow,
							linkReportDetail : linkReportDetail
						};
						if(report.queue.reportGetDetailAjaxDone[i](params) === false){
							returnResult = false;
						}
					}

					if(returnResult === false){
						return;
					}
				}
			});
		});
	};

	report.queue = {};
	report.queue.clear = function(){
		for(prop in this){
			if(typeof this[prop].length == 'number'){
				this[prop].length = 0;
			}
		}
	};
	report.queue.reportGetInfoFirst = [];
	report.queue.reportGetInfoAjaxDone = [];
	report.queue.reportGetDetailFirst = [];
	report.queue.reportGetDetailAjaxFailedRetryDone = [];
	report.queue.reportGetDetailAjaxDone = [];


	// server image convert to data image
	report.item = {};

	report.item.queue = {};
	report.item.queue.clear = function(){
		for(prop in this){
			if(typeof this[prop].length == 'number'){
				this[prop].length = 0;
			}
		}
	};
	report.item.queue.rebuildForOfflineDone = [];
	
	report.item.data = {};
	report.item.data.db = [];
	report.item.data.offlineDb = [];
	report.item.data.insert = function(){

	};

	// 리포트에 업로드 이미지가 존재하는 경우 처리
	// 리포트 페이지에서 오류 항목 내, 업로드 이미지 존재 시, DataUrl 처리. for resultReportItem 
	report.item.rebuildForOffline = function(resultReportAndParams){
		console.log('report.item.rebuildForOffline');

		if(!resultReportAndParams && !report.item.data.db.length){
			console.log('report.item.rebuildForOffline > There\'s not report.item.data.db.length.')
			return;
		}


		var resultReportAndParams = resultReportAndParams || report.item.data.db.shift();

		console.info('resultReportAndParams.resultReportItems.length/report.item.data.offlineDb.length', resultReportAndParams.resultReportItems.length+' / '+(report.item.data.offlineDb.length + 1));

		var onlineImages = $(resultReportAndParams.resultReportItem).find('img:not([src^="data:image"]):not(.onerror)');

		/*
		전라북도익산교육지원청 익산특수교육지원센터 2번째 리포트 항목 httpd 부하 우회 예외 처
		if(report.item.data.offlineDb.length == 1){
			console.log(onlineImages);
			onlineImages.length = null;
		}
		*/

		if(!onlineImages.length){
			console.info('There\'s not onlineImages.length: ', onlineImages.length);
			
			report.item.data.offlineDb.push(resultReportAndParams);

			if(report.item.queue.rebuildForOfflineDone.length){
				var returnResult = true;

				$(report.item.queue.rebuildForOfflineDone).each(function(key, action){
					if(action() === false){
						returnResult = false;
					}
				});

				if(returnResult === false){
					return;
				}
			}
		} else {
			console.log('onlineImages.length', onlineImages.length);

			var onlineImage = onlineImages.get(0);
			//console.log('onlineImage: ', onlineImage);

			var img = document.createElement('img');
			var src = onlineImage.src;

			if(src.indexOf('http') < 0){
				src = 'http://www.wah.or.kr'+src;
			}
			if(src.indexOf('http://localhost/') == 0){
				src = src.replace('http://localhost', 'http://www.wah.or.kr');
			}
			if(location.host === 'localhost'){
				src = 'http://localhost/remotegeturl.php?url='+src;
			}
			
			img.onerror = function(){
				//console.log('report.item.rebuildForOffline > img.onerror');

				var thisImg = this;
				thisImg.retryCount = this.retryCount || 0;
				
				console.log('report.get.detail > thisImg.onerror > thisImg.retryCount', thisImg.retryCount);
				
				thisImg.src = thisImg.src.replace(/(\&|\?)onerror_time=.+/g, '');
				thisImg.src = thisImg.src+(thisImg.src.indexOf('?') > -1 ? '&onerror_time=' : '?onerror_time=')+new Date();

				thisImg.retryCount += 1;
				
				if(thisImg.retryCount == 2){
					console.log('report.get.detail > thisImg.onerror > thisImg.retryCount > foruce excuted thisImg: ', thisImg);
					thisImg.onerror = null;
					thisImg.onload('error');
				}
			};
			img.onload = function(message){
				//console.log('report.item.rebuildForOffline > img.onload', img);

				if(message === 'error'){
					onlineImage.className = (img.className+' onerror').replace(/^\s|\s$/, '');
					//console.log(onlineImage)
				} else {
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');

					canvas.width = this.width;
					canvas.height = this.height;
					ctx.drawImage(this, 0, 0, this.width, this.height);

					onlineImage.src = canvas.toDataURL();
				}

				if($(resultReportAndParams.resultReportItem).find('img:not([src^="data:image"]):not(.onerror)').length){
					report.item.rebuildForOffline(resultReportAndParams);
				} else {
					//console.log('report.item.rebuildForOffline > backup.data.add');
					report.item.data.offlineDb.push(resultReportAndParams);

					if(report.item.queue.rebuildForOfflineDone.length){
						var returnResult = true;

						$(report.item.queue.rebuildForOfflineDone).each(function(key, action){
							if(action() === false){
								returnResult = false;
							}
						});

						if(returnResult === false){
							return;
						}
					}
				}
			};

			img.src = src;
		}
	};

	window.backup = {};

	backup.initialize = function(){
		$(document).ready(function(){
			backup.initialize();
		});

		return function(){
			if(!$('#btnServerBackupAutoGetInfoAndDetail').length){
				$('<button type="button" id="btnServerBackupAutoGetInfoAndDetail">Start Backup(Auto get info & detail)</button>').on('click', function(){
					report.queue.clear();
					backup.queue.clear();

					switch(backup.status){
						case 'init':
						case 'stop':
						case 'end':
							report.queue.reportGetInfoFirst.push(function(){
							});
							report.queue.reportGetInfoAjaxDone.push(function(hasReport){
								if($('a:contains("보고서"):not(.reportGetDetailExcuted):not(.reportGetDetailFailed)').length){
									report.get.detail();
								} else {
									report.get.info();
								}
							});
							report.queue.reportGetDetailFirst.push(function(){
							});
							report.queue.reportGetDetailAjaxFailedRetryDone.push(function(){
								if($('tr:visible a[href*="view01.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed), tr:visible a[href*="view02.asp"]:not(.reportGetInfoExcuted):not(.reportGetInfoFailed)').length){
									report.get.info();
								}
							});						
							report.queue.reportGetDetailAjaxDone.push(function(params){

								if(!params.resultReportItems.length){ // 오류 항목이 없는 경우
									backup.data.add(params);
								} else {
									params.resultReportItems.each(function(itemIndex, resultReportItem){
										params.resultReportItem = resultReportItem;

										var onlineImages = $(resultReportItem).find('img[src]:not([src^="data:image"])');

										if(onlineImages.length){// 업로드 이미지가 있을 경우
											var convertedImages = 0;
											onlineImages.each(function(key, image){

												var img = document.createElement('img');
												var src = image.src;
												if(src.indexOf('http') < 0){
													src = 'http://www.wah.or.kr'+src;
												}
												if(src.indexOf('http://localhost/') == 0){
													src = src.replace('http://localhost', 'http://www.wah.or.kr');
												}
												if(location.host === 'localhost'){
													src = 'http://localhost/remotegeturl.php?url='+src;
												}
												img.src = src;
												img.onerror = function(){
													//console.log('report.get.detail > img.onerror');

													var img = this;
													img.retryCount = this.retryCount || 0;
													
													console.log('report.get.detail > img.onerror > img.retryCount', img.retryCount);
													
													img.src = img.src.replace(/(\&|\?)onerror_time=.+/g, '');
													img.src = img.src+(img.src.indexOf('?') > -1 ? '&onerror_time=' : '?onerror_time=')+new Date();

													img.retryCount += 1;
													
													if(img.retryCount == 2){
														img.onerror = null;
														img.onload('error');
													}
												};
												img.onload = function(message){
													if(message !== 'error'){
														//console.log('onload', this, this.width, this.height);
														var canvas = document.createElement('canvas');
														var ctx = canvas.getContext('2d');
														canvas.width = this.width;
														canvas.height = this.height;
														ctx.drawImage(this, 0, 0, this.width, this.height);
														//console.log(canvas);
														image.src = canvas.toDataURL();
													}
													convertedImages += 1;
													if(onlineImages.length  == convertedImages){
														backup.data.add(params);
													}

												};
											});
										} else {// dataURL 이미지인 경우
											backup.data.add(params);
										}
									});
								}

								backup.start();
							});
							backup.queue.serverInsertDone.push(function(event){
								//console.log('backup.queue.serverInsertDone > event.data: ', event.data);
								if(event.origin !== "http://localhost"){
									return;
								}

								if(event.data.status === 'success'){
									backup.remove(event.data.result);
								} else {
									backup.failed(event.data.result);
								}

								if(backup.data.db.length){
									backup.insert();
								} else {
									report.get.info();
									//backup.start();
								}
							});

							report.get.info();
							//backup.start();
							break;
						case 'start':
						case 'doing':
							backup.stop();
							break;
					}
				}).prependTo('body');
			}
			if(!$('#btnServerBackupAutoGetDetail').length){
				$('<button type="button" id="btnServerBackupAutoGetDetail">Start Backup(Auto get detail)</button>').on('click', function(){
					report.queue.clear();
					backup.queue.clear();
					report.item.queue.clear();

					$('.reportGetDetailExcuted').removeClass('reportGetDetailExcuted');

					switch(backup.status){
						case 'init':
						case 'stop':
						case 'end':
							report.queue.reportGetInfoFirst.push(function(){
							});
							report.queue.reportGetInfoAjaxDone.push(function(){
							});
							report.queue.reportGetDetailFirst.push(function(){
							});
							report.queue.reportGetDetailAjaxFailedRetryDone.push(function(){
							});						
							report.queue.reportGetDetailAjaxDone.push(function(params){
								console.log('report.queue.reportGetDetailAjaxDone.push');

								if(!params.resultReportItems.length){// 오류 항목이 없는 경우
									console.log('오류 항목이 없음');

									var cloneParams = $.extend({}, params, {
										resultReportItem: ''
									});//params each 구간 중, 덮어쓰기 됨, 즉 값 연동 됨으로 복제 처리.

									report.item.data.db.push(cloneParams);
								} else {
									params.resultReportItems.each(function(itemIndex, resultReportItem){
										var cloneParams = $.extend({}, params, {
											resultReportItem: resultReportItem
										});

										report.item.data.db.push(cloneParams);
									});

								}

								report.item.rebuildForOffline();
							});
							report.item.queue.rebuildForOfflineDone.push(function(){
								if(report.item.data.db.length){
									report.item.rebuildForOffline();
								} else if(report.item.data.offlineDb.length){
									while(report.item.data.offlineDb.length){
										backup.data.add(report.item.data.offlineDb.shift());
									}
									backup.insert();
								}
							});
							backup.queue.serverInsertDone.push(function(event){
								//console.log('backup.queue.serverInsertDone > event.data: ', event.data);

								if(event.origin !== "http://localhost"){
									return;
								}

								if(event.data.status === 'success'){
									backup.remove(event.data.result);
								} else {
									backup.failed(event.data.result);
								}

								setTimeout(function(){
									if(backup.data.db.length){
										backup.insert();
									} else if(report.item.data.offlineDb.length){
										while(report.item.data.offlineDb.length){
											backup.data.add(report.item.data.offlineDb.shift());
										}
										backup.insert();
									} else if(!report.item.data.db.length) {
										report.get.detail();
									}
								}, time.timeout.backupQueueServerInsertDone);
							});

							report.get.detail();
							//backup.start();
							break;
						case 'start':
						case 'doing':
							backup.stop();
							break;
					}
				}).prependTo('body');
			}
		};
	}();

	backup.queue = {};
	backup.queue.clear = function(){
		for(prop in this){
			if(typeof this[prop].length == 'number'){
				this[prop].length = 0;
			}
		}
	};
	backup.queue.serverInsertDone = [];

	backup.util = {};

	backup.util.iframeCORS = {};
	backup.util.iframeCORS.event = {};
	backup.util.iframeCORS.data = {};
	backup.util.iframeCORS.event.add = function(param){
		/**
			@param
			param.target: iframe
			param.index: index of data
			params.done: excute after message interaction
		**/
		backup.util.iframeCORS.data[param.index] = {
			action : param.done,
			interval : setInterval(function(){
				try {
					param.target.get(0).contentWindow.postMessage(param.index, "http://localhost");
				} catch(e) {
					console.error('backup.util.iframeCORS.event.add > try catch error: ', e);
				}
			}, time.interval.backupUtilIframeCORSEventAdd)
		};

		window.addEventListener('message', param.done, false);
	};

	backup.util.iframeCORS.event.remove = function(param){
		clearInterval(backup.util.iframeCORS.data[param].interval);

		window.removeEventListener('message', backup.util.iframeCORS.data[param].action, false);
	};

	/*
		init	: initialize
		start	: started
		work	: working
		stop	: stopped
		end		: finished
	*/
	backup.status = 'init';

	backup.start = function(){
		console.log('backup.start');
		backup.status = 'start';

		backup.observe.start(function(){
			backup.insert();
		});

		//$('#btnServerBackup').text('Stop Backup');
	};

	backup.stop = function(){
		console.log('backup.stop');
		backup.status = 'stop';
		backup.observe.stop();
		//$('#btnServerBackup').text('Start Backup');
	};

	backup.remove = function(param){
		//console.log('backup.remove: @param ', param);
		// iframe, form remove
		$('.'+param).remove();
		backup.util.iframeCORS.event.remove(param);
	};

	backup.failed = function(param){
		//console.log('backup.failed: @param ', param);
		// iframe, form remove
		$('.'+param).show();
		backup.util.iframeCORS.event.remove(param);
	};

	backup.insert = function(){
		//console.log('backup.insert');

		if(!backup.data.db.length){
			console.log('backup.insert > returned. There\'s not backup.data.db.length.');
			return;
		}

		console.log('backup.insert > backup.data.db.length: ', backup.data.db.length);

		// get db info
		var dbData = backup.data.db.shift();
		var dbIndex = backup.data.index.insert = (backup.data.index.insert || 0) + 1;;

		console.log('backup.insert > dbData.homepage_name', dbData.homepage_name);

		// generate form
		var form = $('<form method="post" action="http://localhost/save.php">').prependTo('body');
		form.attr('target', 'backupTransport'+dbIndex);
		form.attr('class', 'backupTransport'+dbIndex);

		$.each(dbData, function(name, value){
			try {
				form.append('<input type="hidden" name="'+name+'" value="'+htmlspecialchars(value).replace(/^\s+|\s+$/g, '')+'">');
			} catch(e) {
				console.error('backup.insert > generate form error: ', e);
			}
		});

		// generate iframe for form target
		var iframe = $('<iframe name="backupTransport'+dbIndex+'">').prependTo('body');
		iframe.attr('name', 'backupTransport'+dbIndex);
		iframe.attr('class', 'backupTransport'+dbIndex);

		// observe onloaded of iframe
		backup.util.iframeCORS.event.add({
			target: iframe,
			index: 'backupTransport'+dbIndex,
			done: function(event){
				if(backup.queue.serverInsertDone.length){
					var returnResult = true;
					$(backup.queue.serverInsertDone).each(function(key, action){
						if(action(event) === false){
							returnResult = false;
						}
					});

					if(returnResult === false){
						return;
					}
				}
			}
		});

		// send to server
		form.trigger('submit');
	};

	backup.data = {}
	backup.data.index = {};
	backup.data.db = [];
	/**
		@params: resultReport, resultReportItem, report_url, mento, tester
	**/
	backup.data.add = function(params){// resultReportItem: item of report
		console.log('backup.data.add > params: ', params);

		// 오류 유형이 없는 경우
		var error_contents = $($(params.resultReportItem).find('th:contains("오류유형")')[0]).next().html();
		var error_type		= /<div class="mgb10">(.[^<]+)/g.exec(error_contents) ? /<div class="mgb10">(.[^<]+)/g.exec(error_contents)[1] : '';
		var error_content	= error_type ? /<\/div>([\s\S]+)/g.exec(error_contents) ? /<\/div>([\s\S]+)/g.exec(error_contents)[1] : error_contents : error_contents;

		// 샘플 페이지 경로
		var reportPageTh = params.resultReportItem ? $(params.resultReportItem).find('th:contains("페이지")').html() : '';
		var reportSamplePageInfo = params.resultReport.find('span:contains("샘플'+reportPageTh+'")').parents('div').next().html();
		var page_path = /경로 : (.+)/g.exec(reportSamplePageInfo) ? /경로 : (.+)/g.exec(reportSamplePageInfo)[1] : '';

		// set item value of form 
		var data = {
			company			: params.resultReport.find('th:contains("기관명")').next().html() || '',
			homepage_name	: params.resultReport.find('th:contains("홈페이지 명")').next().html() || '',
			homepage_url	: params.resultReport.find('th:contains("홈페이지 주소")').next().html() || '',
			due_date		: params.resultReport.find('th:contains("심사기간")').next().html() || '',
			comment			: params.resultReport.find('h2:contains("종합의견")').parent('div').next().html() || '',
			page_num		: params.resultReportItem ? $(params.resultReportItem).find('th:contains("페이지")').html() : '',
			page_name		: params.resultReportItem ? $(params.resultReportItem).find('th:contains("경로")').next().html() : '',
			page_path		: page_path || '',
			page_url		: params.resultReportItem ? $(params.resultReportItem).find('th:contains("URL")').next().html() : '',
			checklist		: params.resultReportItem ? $(params.resultReportItem).find('th:contains("검사항목")').next().html() : '',
			result			: params.resultReportItem ? $(params.resultReportItem).find('th:contains("진단결과")').next().html() : '',
			error_type		: params.resultReportItem ? error_type : '',
			error_content	: params.resultReportItem ? error_content : '',
			solution		: params.resultReportItem ? $(params.resultReportItem).find('th:contains("해결방안")').next().html() : '',
			report_url		: params.reportUrl || '',
			mento			: params.mento	|| '',
			tester			: params.tester || ''
		};

		backup.data.db.push(data);
		backup.data.index.add = (backup.data.index.add || 0) + 1;
	};

	/*backup.observe = {};
	backup.observe.start = function(action){
		console.log('backup.observe.start');

		backup.observe.interval = setInterval(function(){
			//console.log('backup.observe.start > backup.observe.interval > backup.data.db.length: ', backup.data.db.length);
			if(backup.data.db.length){
				backup.observe.stop();
				action();
			}
		}, time.interval.backupObserveStart);
	};
	backup.observe.stop = function(){
		console.log('backup.observe.stop');

		if(backup.observe.interval){
			clearInterval(backup.observe.interval);
		}
	};*/

	$(document).ajaxStop(function(){
		// $('.BoardList01 tr td:nth-child(8)').each(function(key, el){
		// 	$('a[href^="mailto"]:contains("'+$(el).text()+'"):last').parents('tr').css('background-color','yellow');
		// });

		// 개인별 마지막 1건 하이라이트
		// $.unique($('.BoardList01 tr td:nth-child(8)').map(function(){
		//   return $(this).text() || null;
		// }).sort()).each(function(key, string){
		//   $('.BoardList01 tr td:nth-child(8):contains("'+string+'")').parents('tr').css('background-color','');
		//   $('.BoardList01 tr td:nth-child(8):contains("'+string+'"):last').parents('tr').css('background-color','yellow');
		// });

		// report.get.info();

		// $('.txt_tester').each(function(key, el){
		// 	$('.txt_tester:contains("'+$(el).text()+'"):last').parents('tr').css('background-color','yellow');
		// });

		// $('a[href^="mailto"]').each(function(key, el){
		// 	$('a[href^="mailto"]:contains("'+$(el).text()+'"):last').parents('tr').css('background-color','yellow');
		// });

		/**
		// 샘플 페이지 행 추가
		if(!$('body').hasClass('customized_moreinfo')){
			$('body').addClass('customized_moreinfo');
			var listTable = $('tr:visible a[href*="view01.asp"], tr:visible a[href*="view02.asp"]').first().parents('table');
			listTable.find('tbody').first().remove();
			listTable.hide().show(); //redraw
		}
		/**/

	});

	var htmlspecialchars = function (string, quote_style, charset, double_encode) {
		//       discuss at: http://phpjs.org/functions/htmlspecialchars/
		//      original by: Mirek Slugen
		//      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//      bugfixed by: Nathan
		//      bugfixed by: Arno
		//      bugfixed by: Brett Zamir (http://brett-zamir.me)
		//      bugfixed by: Brett Zamir (http://brett-zamir.me)
		//       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//         input by: Ratheous
		//         input by: Mailfaker (http://www.weedem.fr/)
		//         input by: felix
		// reimplemented by: Brett Zamir (http://brett-zamir.me)
		//             note: charset argument not supported
		//        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
		//        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
		//        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
		//        returns 2: 'ab"c&#039;d'
		//        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false);
		//        returns 3: 'my &quot;&entity;&quot; is still here'

		var optTemp = 0,
			i = 0,
			noquotes = false;
		if (typeof quote_style === 'undefined' || quote_style === null) {
			quote_style = 2;
		}
		string = string.toString();
		if (double_encode !== false) {
			// Put this first to avoid double-encoding
			string = string.replace(/&/g, '&amp;');
		}
		string = string.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');

		var OPTS = {
			'ENT_NOQUOTES'          : 0,
			'ENT_HTML_QUOTE_SINGLE' : 1,
			'ENT_HTML_QUOTE_DOUBLE' : 2,
			'ENT_COMPAT'            : 2,
			'ENT_QUOTES'            : 3,
			'ENT_IGNORE'            : 4
		};
		if (quote_style === 0) {
			noquotes = true;
		}
		if (typeof quote_style !== 'number') {
			// Allow for a single string or an array of string flags
			quote_style = [].concat(quote_style);
			for (i = 0; i < quote_style.length; i++) {
				// Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
				if (OPTS[quote_style[i]] === 0) {
					noquotes = true;
				} else if (OPTS[quote_style[i]]) {
					optTemp = optTemp | OPTS[quote_style[i]];
				}
			}
			quote_style = optTemp;
		}
		if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
			string = string.replace(/'/g, '&#039;');
		}
		if (!noquotes) {
			string = string.replace(/"/g, '&quot;');
		}

		return string;
	};

	var ui = {};
	ui.initialize = function(){
		$(document).ready(function(){
			ui.initialize();
		});

		return function(){
			console.log('ui.initialize');
			$('<style>\
				body {background:none;}\
				#Fix-Width {background-image:url("./assets/img/top_bg.gif");background-repeat:repeat-x;}\
			</style>').appendTo('head');

			$('#Content-box').on('click', function(){
				setTitle(true);
			});

			// 분류 페이지 제목(<title>) 명 추가
			//top.document.title = (getEntryLength() ? '('+getEntryLength()+')' : '') + (category ? category + ' | ' : '') + siteName + document.title;
			setTitle();

			// 좌측 메뉴 바로가기 추가 
			if($('#status option').length){
				$('<option value="100">').insertAfter($('#pagesize option:last'));

				$('#status option').each(function(){
					if($(this).val()){
						var url = ($('#status').parents('form').attr('action') || window.location.pathname)+'?'+$('#status').val($(this).val()).parents('form').serialize();
						$('<li><a href="'+url+'">'+$(this).text()+'</a></li>').insertAfter($('#left-Menu li.on'));
					}
				}).promise().done(function(){
					$('#status').val($('#status option[selected]').val() || $('#status option:first').val())
					$('#pagesize option:last').remove();
				});
			}

			// 좌측 메뉴 모든 목록, 사용자 목록, 배정 목록 100개 추가
			$('#left-Menu a[href^="list01.asp"]').attr('href', 'list01.asp');// 15.11.9

			if($('#left-Menu a[href="list01.asp"]').length){
				var linkAssginList = $('#left-Menu a[href="list01.asp"]');
				if(!$('#left-Menu a:contains("모든 목록")').length){
					linkAssginList.parents('li').before($('<li>').append($('<a>모든 목록</a>').attr('href', linkAssginList.attr('href')+'?state2=all&pagesize='+maxListLength)));
				}
				if(!$('#left-Menu a:contains("사용자 목록")').length){
					linkAssginList.parents('li').before($('<li>').append($('<a>사용자 목록</a>').attr('href', linkAssginList.attr('href')+'?state2=custompage&pagesize=120')));
				}
				if(!$('#left-Menu a:contains("반려 목록")').length){
					linkAssginList.parents('li').after($('<li>').append($('<a>반려 목록</a>').attr('href', linkAssginList.attr('href')+'?state=G&pagesize=120')));
				}
				if(!$('#left-Menu a:contains("평가 완료")').length){
					linkAssginList.parents('li').after($('<li>').append($('<a>평가 완료 목록</a>').attr('href', linkAssginList.attr('href')+'?state=E&pagesize=120')));
				}
				if(!$('#left-Menu a:contains("평가중 목록")').length){
					linkAssginList.parents('li').after($('<li>').append($('<a>평가중 목록</a>').attr('href', linkAssginList.attr('href')+'?state=C&pagesize=120')));
				}
				if(!$('#left-Menu a:contains("대기 목록")').length){
					linkAssginList.parents('li').after($('<li>').append($('<a>대기 목록</a>').attr('href', linkAssginList.attr('href')+'?state=D&pagesize=120')));
				}
				// if(!$('#left-Menu a:contains("배정 목록 120개")').length){
				// 	linkAssginList.parents('li').after($('<li>').append($('<a>배정 목록 120개</a>').attr('href', linkAssginList.attr('href')+'?pagesize=120')));
				// }
			}

			// 좌측 메뉴  현재 메뉴 활성화
			//console.log(category);
			if(category){
				$('#left-Menu .on').removeClass('on');
				$('#left-Menu a').filter(function(){
					return $(this).text() === category;
				}).first().parents('li').addClass('on');
			}

			// 새창 설정
			//$('#left-Menu a').attr('target', '_blank');
			
			// 배정 목록 링크 목록 수 기본 설정 변경
			$('a:contains("배정 목록")').attr('href', $('a:contains("배정 목록")').attr('href')+'?pagesize=120');
			// 완료 목록 링크 목록 수 기본 설정 변경
			$('a:contains("완료 목록")').last().attr('href', $('a:contains("완료 목록")').last().attr('href')+'?pagesize=120');
			
			// 반려게시판 링크명 변경
			$('a:contains("반려게시판")').text('게시판').attr('target', '_blank').on('click', function(event){
				window.open($(this).attr('href'), '', 'width=650, height=768, menubar=no, status=no, resizable=1, titlebar=no, toolbar=no');
				event.preventDefault();
			});


			// 배정 목록 하이라이트
			$('.BoardList01 tr').on('click', function(){
				$('.BoardList01 tr[style]').css('background-color', '');
				$(this).css('background-color', 'rgba(255, 255, 125, 0.5)');
			});	
		};
	}();

})();