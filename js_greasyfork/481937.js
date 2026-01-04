// ==UserScript==
// @name VIRTA::Mass Create Units
// @description Оптовое создание юнитов.
// @namespace virtonomica
// @author SAQOT
// @version 1.8
// @include https://virtonomica.ru/*/main/unit/create/*
// @include https://virtonomica.ru/*/main/unit/create/*#confirm-modal
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/481937/VIRTA%3A%3AMass%20Create%20Units.user.js
// @updateURL https://update.greasyfork.org/scripts/481937/VIRTA%3A%3AMass%20Create%20Units.meta.js
// ==/UserScript==

/* global $, unsafeWindow, UnitCreateWizard */

let run = function () {
	let win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
	
	// ==================================================
	let ver = '1.8';
	
	function consoleEcho(text, isRrror = false) {
		const bg = isRrror === true ? '#af1a00' : '#3897c7'
		console.log(`\n %c VIRTA::MCU / ${ver} %c ${text} \n\n`, 'color: #FFFFFF; background: #030307; padding:5px 0;', `color: #FFFFFF; background: ${bg}; padding:5px 0;`);
	}
	
	consoleEcho('Оптовое создание юнитов');
	// ==================================================
	
	// ==================================================
	function getUserID() {
		const svHref = window.location.href;
		const matches = svHref.match(/\/(\w+)\/main\/unit\/create\/(\d+)/);
		return matches[2];
	}
	
	const userID = getUserID();
	if (!userID) {
		consoleEcho('userID не определен', true);
		return;
	}
	
	let LIMIT = 1000;
	let IS_PAUSE = false;
	let LOOP_X = 0;
	let LOOP_ALL = 0;
	let $LOOP_BLOCK = null;
	let $LOOP_ICON = null;
	let $LOOP_INFO = null;
	let $MODAL_BTNS = null;
	let $MODAL_INPS = null;
	let DATA_ = {
		"method"  : "POST",
		"base_url": "/api/",
		"token"   : null,
		"id"      : userID,
		"kind"    : null,
		"name"    : null,
		"args"    : {
			"produce_id" : 0,
			"city_id"    : null,
			"size"       : null,
			"district_id": 0,
		},
	};
	let data = Object.assign({}, DATA_);
	
	// ==================================================
	
	function waitForElement(callback) {
		let time = 0;
		let poops = setInterval(function () {
			
			let el = document.getElementById('confirm-modal');
			if (el) {
				const $elModal = $(el);
				if ($elModal.is(':visible') === true) {
					clearInterval(poops);
					callback($elModal);
				}
				
			}
			time += 200;
		}, 200);
	}
	
	waitForElement(initMassCreate);
	
	function initMassCreate($modal) {
		// отслеживаем закрытие окна, что бы запустить мониторинг открытия
		$modal.on('hidden.bs.modal', function (e) {
			setTimeout(function () {
				waitForElement(initMassCreate);
			}, 500);
		})
		
		
		// ---------------------------
		const $modalFooter = $modal.find('.modal-footer');

		const $modifedMass = $modal.find('.modifed-mass')
		if (!$modifedMass.length) {
			$modal.find('.modal-body').append('' +
				'<div class="row">' +
				'   <div class="col-sm-12 unit-cnt" style="margin-top: 10px;">' +
				'       <span class="margin-5-left">Количество юнитов:</span>' +
				'       <span class="pull-right width20"><input class="form-control" id="unit-cnt" type="number" value="1"></span>' +
				'       <span class="pull-right width40 mass-actions">' +
				'           <span class="badge badge-success badge-roundless pull-right mono" style="margin: 0 10px; line-height: 23px !important; height: 28px; padding: 3px 10px;">' +
				'           	<span class="mass-icon" >⏸</span>' +
				'           	<span class="mass-info" style="margin-left: 10px;"></span>' +
				'           </span>' +
				'       </span>' +
				'   </div>' +
				'</div>');
			
			$modalFooter.append('<button type="button" class="btn btn-danger btn-sm btn-circle btn-build-mass">Создать несколько</button>');
		}
		
		const $strName = $('<div></div>');
		//$strName.addClass('pull-left');
		
		const $inpName = $modal.find('#unit-name');
		const inpNameVal = $inpName.val();
       /* Изменить имя
        const first = ($('div[class="col-sm-5 unit-geo"]').children())[0].firstChild.data
        const second = ($('div[class="col-sm-5 unit-geo"]').children())[(($('div[class="col-sm-5 unit-geo"]').children()).length)-2].firstChild.data.trim();
        const inpNameValNew = `Ювел Остатки ${first}${second} `;
        */
        const inpNameValNew = `${inpNameVal} {num}`;
		$inpName.val(inpNameValNew);
		
		$inpName.after($strName);
		eventModifeName($strName, inpNameValNew);
		
		$inpName.on('change paste keyup', function () {
			eventModifeName($strName, this.value);
		});
		
		
		
		

		
		
		const $btm = $modal.find('.btn-build-mass');
		$LOOP_BLOCK = $modal.find('.mass-actions');
		$LOOP_BLOCK.hide();
		$LOOP_ICON = $LOOP_BLOCK.find('.mass-icon');
		$LOOP_INFO = $LOOP_BLOCK.find('.mass-info');
		
		$MODAL_BTNS = $modalFooter.find('button');
		$MODAL_INPS = $modal.find('input');
		
		const $unitCnt = $('input#unit-cnt');
		
		$unitCnt.on('keyup', function () {
			const cnt = parseInt($(this).val());
			if (cnt > 0) {
				$btm.removeClass('disabled');
				$btm.html(`Создать несколько (${cnt})`);
			} else {
				$btm.addClass('disabled');
				$btm.html(`Создать несколько`);
			}
			
			if (cnt > LIMIT) {
				$btm.addClass('disabled');
				$btm.html(`Максимум ${LIMIT} можно`);
			}
		});
		
		$btm.on('click', function (e) {
			e.preventDefault();
			if ($btm.hasClass('disabled')) {
				return;
			}
			data['name'] = $('input#unit-name').val();
			
			LOOP_ALL = parseInt($unitCnt.val());
			LOOP_X = 0;
			loopStart();
		});
		
		
		$LOOP_BLOCK.on('click', function (e) {
			e.preventDefault();
			if (LOOP_ALL) {
				const isPause = !IS_PAUSE;
				loopPause(isPause);
				if (!isPause) {
					loopStart();
				}
			}
			
			
		});
	}
	
	
	function loopStart() {
		loopPause(false);
		$LOOP_BLOCK.show();
		$MODAL_BTNS.addClass('disabled');
		$MODAL_INPS.addClass('disabled');
		
		$.ajax({
			async      : true,
			type       : 'GET',
			url        : 'https://virtonomica.ru/api/?app=system&action=token&format=json&base_url=/api/',
			crossDomain: true,
			xhrFields  : {
				withCredentials: true,
			},
			global     : false,
			dataType   : "json",
			success    : function (res) {
				data['token'] = res;
				loopSend();
			},
			error      : function (a, b, c) {
				console.error(a, b, c);
			},
		});
	}
	
	function loopPause(isPause) {
		IS_PAUSE = isPause;
		if (IS_PAUSE) {
			$LOOP_ICON.html('⏸');
		} else {
			$LOOP_ICON.html('⏵');
		}
	}
	
	function loopEnd() {
		$LOOP_ICON.html('');
		$LOOP_INFO.html(`Создано юнитов: ${LOOP_X}`);
		LOOP_X = 0;
		LOOP_ALL = 0;
		$MODAL_BTNS.removeClass('disabled');
		$MODAL_INPS.removeClass('disabled');
	}
	
	function eventModifeName($strName, inpNameVal) {
		const inpNameValNew = inpNameVal.replace(/{num}/gi, '1');
		
		$strName.html(`<span class="small text-muted">Название при создании:</span></br><span class="prew-mass">${inpNameValNew}</span>`)
	}
	
	function loopSend() {
		if (IS_PAUSE === true) {
			return;
		}
		
		if (LOOP_ALL <= LOOP_X) {
			loopEnd();
			return;
		}
		LOOP_X++;
		$LOOP_INFO.html(`Выполняем ${LOOP_X}/${LOOP_ALL}`);
		const data_ = Object.assign({}, data);
		
		data_.name = data_.name.replace(/{num}/gi, LOOP_X);
		
		data_.kind = UnitCreateWizard.get('unittype').kind;
		data_.args = {
			produce_id : UnitCreateWizard.get('produce').id ? UnitCreateWizard.get('produce').id : 0,
			city_id    : UnitCreateWizard.get('city').id,
			size       : UnitCreateWizard.get('size').size,
			district_id: UnitCreateWizard.get('district') ? UnitCreateWizard.get('district').id : 0,
		};
		console.log(data_);
		
		$.ajax({
			async      : true,
			type       : 'POST',
			url        : 'https://virtonomica.ru/api/?action=company/build&app=adapter_vrt',
			crossDomain: true,
			xhrFields  : {
				withCredentials: true,
			},
			data       : data_,
			global     : false,
			dataType   : "json",
			success    : function () {
				setTimeout(function () {
					loopSend();
				}, 1000);
			},
			error      : function (a, b, c) {
				console.error(a, b, c);
			},
		});
		
		
	}
	
	let sheet = document.createElement('style')
	sheet.innerHTML = `
        .prew-mass  {
           display: block;
           background-color: #FDECC9;
           padding: 3px 6px;
           font-size: 11px;
        }
        `;
	document.body.appendChild(sheet);
}

if (window.top === window) {
	let script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
}