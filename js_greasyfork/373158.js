// ==UserScript==
// @id            SCR__WF_MARKET_MONITOR
// @name          WF Market Monitor
// @version       0.9
// @namespace     NerV_Scripts
// @description   Мониторинг цен на предметы в WF Market.
// @author        NerV
// @grant         GM_info
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_xmlhttpRequest
// @grant         GM_openInTab
// @grant         GM_notification
// @connect       warframe.market
// @connect       api.warframe.market
// @include       file:///*/ScriptPage.html?wf-market-monitor
// @include       about:blank?wf-market-monitor
// @run-at        document-end
// @noframe
// @downloadURL https://update.greasyfork.org/scripts/373158/WF%20Market%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/373158/WF%20Market%20Monitor.meta.js
// ==/UserScript==


"use strict"



const IS_USE_DEFAULT_SETTINGS = true;

const $SETTINGS = {
	autostart: false,
	ordersUpdateTime: 5,
	statisticUpdateTime: 60,
	audioAlert: true,
	repeatAudioAlert: 30,
	pricesFilterType: 'median',
	pricesFilterDeviation: 0.5,
	userMessageTemplate: '/w ${USERNAME}$ Hi. I want to ${TRADE_ACTION}$ ${ITEM_MARKET_NAME}$ for ${PRICE}$pl. (Order info from WF Market)'
};

var $ITEMS = null;



function $MAIN$ ( ) {
	document.title = $win_title;
	if (!LoadStorageData()) { return; };
	if (!BuildInterface()) { return; }
	audioAlert = new Audio($RESOURCE_ALERT_AUDIO);
	ordersUpdateTime = $SETTINGS.ordersUpdateTime * 60000;
	nUpdateTimeInput.value = $SETTINGS.ordersUpdateTime;
	
	$ITEMS.forEach(CreateListItem);
	UpdateAllItemsData('statistic');
	statisticTimer = setInterval(UpdateAllItemsData.bind($self_ctx, 'statistic'), $SETTINGS.statisticUpdateTime * 60000);
	
	window.addEventListener('visibilitychange', Event_OnVisibleChange, false);
	// window.onunload = Event_OnUnload;
	
	if ($SETTINGS.autostart) { StatusMarkerClick(); }
	
	$RESOURCE_PAGE_HTML = null;
	$RESOURCE_PAGE_CSS = null;
	$RESOURCE_ALERT_AUDIO = null;
}



// ============================================================================

const $self_ctx = this;

const $win_title = 'WF Market Monitor [' + GM_info.script.version + ']';

const $market_basic          = 'https://warframe.market';
const $market_api_basic      = 'https://api.warframe.market';
const $item_url              = $market_basic + '/items/';
const $item_image_url        = $market_basic + '/static/assets/icons/en/';
const $item_orders_url       = $market_api_basic + '/v1/items/${ITEM_ID}$/orders';
const $item_statistic_url    = $market_api_basic + '/v1/items/${ITEM_ID}$/statistics';
const $user_profile          = $market_basic + '/profile/';


var nFavicon = null,
    nItemsList = null,
	nAlertItemsList = null,
    nDarkFrame = null,
    nItemDataWindow = null,
    nUpdateTimeInput = null,
    nStatusMarker = null,
    nItemDataForm = null;

var listItems = [ ];

var ordersUpdateTime = 300000,
    ordersUpdateTimer = null,
    lastUpdateTime = 0;

var statisticTimer = null;

var ordersFilterFunction = null;

var audioAlert = null,
    audioTimer = null;

var notificationOn = false;



function LoadStorageData ( ) {
	let settings = GM_getValue('WFMM_SCRIPT_SETTINGS', null),
	    items = GM_getValue('WFMM_ITEMS_LIST', null);
	if (!IS_USE_DEFAULT_SETTINGS && settings) {
		try { settings = JSON.parse(settings); }
		catch (e) { ShowMessage('error', 'Не удалось загрузить настройки.', 'LOAD_STORAGE_ERROR__SETTINGS', settings, e); return false; }
		let prop = null;
		for (prop in settings) if (settings.hasOwnProperty(prop)) {
			$SETTINGS[prop] = settings[prop];
		}
	}
	if (items) {
		try { items = JSON.parse(items); }
		catch (e) { ShowMessage('error', 'Не удалось загрузить список предметов.', 'LOAD_STORAGE_ERROR__ITEMS', items, e); return false; }
		$ITEMS = items;
	} else { $ITEMS = [ ]; }
	return true;
}

function SaveStorageData ( type ) {
	let textData = null;
	if (type === 'all' || type === 'items') {
		try {
			if ($ITEMS.length > 0) {
				textData = JSON.stringify($ITEMS);
				GM_setValue('WFMM_ITEMS_LIST', textData);
			} else {
				GM_deleteValue('WFMM_ITEMS_LIST');
			}
		} catch (e) { ShowMessage('error', 'Не удалось сохранить список предметов.', 'SAVE_STORAGE_ERROR__ITEMS', textData, e); return false; }
	}
	if (type === 'all' || type === 'settings') {
		try {
			textData = JSON.stringify($SETTINGS);
			GM_setValue('WFMM_SCRIPT_SETTINGS', textData);
		} catch (e) { ShowMessage('error', 'Не удалось сохранить настройки.', 'SAVE_STORAGE_ERROR__SETTINGS', textData, e); return false; }
	}
	return true;
}


function BuildInterface ( ) {
	let head = document.querySelector('head');
	if (!head) { ShowMessage('error', 'Не удалось построить интерфейс.'); return false; }
	let styleNode = document.createElement('style');
	styleNode.type = 'text/css';
	styleNode.innerText = $RESOURCE_PAGE_CSS;
	head.appendChild(styleNode);
	
	nFavicon = document.createElement('link');
	nFavicon.id = 'pageFavicon';
	nFavicon.rel = 'shortcut icon';
	nFavicon.href = $RESOURCE_FAVICON;
	head.appendChild(nFavicon);
	
	document.body.innerHTML = $RESOURCE_PAGE_HTML;
	
	nItemsList = document.getElementById('ItemsList');
	nAlertItemsList = document.getElementById('AlertItemsList');
	nDarkFrame = document.getElementById('DarkFrame');
	nItemDataWindow = document.getElementById('ItemDataWindow');
	
	nUpdateTimeInput = document.getElementById('CP_UpdateTimeInput');
	nStatusMarker = document.getElementById('CP_StatusMarker');
	nItemDataForm = document.getElementById('ID_Form');
	
	document.getElementById('CP_AddNewItemBtn').addEventListener('click', ShowItemDataWindow, false);
	nUpdateTimeInput.addEventListener('keypress', UpdateTimeInputKeyPress, false);
	document.getElementById('CP_UpdateTimeSetBtn').addEventListener('click', UpdateTimeSetBtnClick, false);
	document.getElementById('CP_ForceUpdateBtn').addEventListener('click', ForceUpdateBtnClick, false);
	nStatusMarker.addEventListener('click', StatusMarkerClick, false);
	document.getElementById('ID_AcceptBtn').addEventListener('click', EditItem, false);
	document.getElementById('ID_CancelBtn').addEventListener('click', HideItemDataWindow, false);
	nAlertItemsList.addEventListener('dblclick', AlertItemsListDblClick, false);
	
	return true;
}


function UpdateTimeInputKeyPress ( e ) {
	if (e.keyCode == 13) { UpdateTimeSetBtnClick(null); }
}

function UpdateTimeSetBtnClick ( e ) {
	let time = nUpdateTimeInput.valueAsNumber;
	if (isNaN(time)) { ShowMessage('error', 'Необходимо целое число.', 'SET_TIME_ERROR', nUpdateTimeInput.value); return; }
	if (time < 1) { ShowMessage('error', 'Время должно быть не меньше минуты.', 'SET_TIME_ERROR', time); return; }
	$SETTINGS.ordersUpdateTime = time; SaveStorageData('settings');
	ordersUpdateTime = time * 60000;
	if (ordersUpdateTimer) { ForceUpdateBtnClick(null); }
}

function ForceUpdateBtnClick ( e ) {
	let isActive = ordersUpdateTimer;
	clearInterval(ordersUpdateTimer);
	UpdateAllItemsData('orders');
	if (isActive) { ordersUpdateTimer = setInterval(UpdateAllItemsData.bind($self_ctx, 'orders'), ordersUpdateTime); }
}

function StatusMarkerClick ( e ) {
	if (ordersUpdateTimer) {
		clearInterval(ordersUpdateTimer); ordersUpdateTimer = null;
		nStatusMarker.classList.remove('cp-statusmarker-on');
		nStatusMarker.classList.add('cp-statusmarker-off');
		nStatusMarker.title = 'Запустить автообновление';
	} else {
		if (listItems.length === 0) { return; }
		if (Date.now() - lastUpdateTime > ordersUpdateTime) { UpdateAllItemsData('orders'); }
		ordersUpdateTimer = setInterval(UpdateAllItemsData.bind($self_ctx, 'orders'), ordersUpdateTime);
		nStatusMarker.classList.remove('cp-statusmarker-off');
		nStatusMarker.classList.add('cp-statusmarker-on');
		nStatusMarker.title = 'Остановить автообновление';
	}
}


function CreateNewItem ( mainItemData, objResponse ) {
	if (objResponse.status !== 200) {
		nItemDataWindow.classList.remove('e-hidden');
		ShowMessage('error', 'Не удалось получить данные для "' + mainItemData.id + '".',
					'CREATE_ITEM__GET_DATA_ERROR', mainItemData, objResponse);
		return;
	}
	
	let $var_1 = objResponse.responseText;
	let reProp = /<meta property="og:.*?" content=".*?">/ig;
	if (!reProp.test($var_1)) {
		nItemDataWindow.classList.remove('e-hidden');
		ShowMessage('error', 'Не удалось получить список свойств предмета для "' + mainItemData.id + '".',
					'CREATE_ITEM__GET_PROPSLIST_ERROR', mainItemData, objResponse);
		return;
	}
	let rePropsResult = $var_1.match(reProp);
	reProp = /<meta property="og:(.*?)" content="(.*?)">/i;
	let i = 0, l = rePropsResult.length;
	for (; i < l; i++) {
		$var_1 = null;
		$var_1 = reProp.exec(rePropsResult[i]);
		switch ($var_1[1]) {
			case 'title':
					$var_1[2] = $var_1[2].replace(' - Buy and sell orders', '');
					mainItemData.mn = $var_1[2];
					if (mainItemData.nm ===  mainItemData.mn) { delete mainItemData.nm; }
				break;
			case 'image': mainItemData.mi = $var_1[2].replace($item_image_url, ''); break;
		}
	}
	
	if (mainItemData.mn === '' || mainItemData.mi === '') {
		nItemDataWindow.classList.remove('e-hidden');
		ShowMessage('error', 'Не удалось получить свойства предмета для "' + mainItemData.id + '".',
					'CREATE_ITEM__GET_PROP_ERROR', mainItemData, objResponse, rePropsResult);
		return;
	}
	
	InsertInArray($ITEMS, mainItemData, 'id');
	SaveStorageData('items');
	mainItemData = CreateListItem(mainItemData);
	
	if (ordersUpdateTimer) {
		new Promise ( (( res, rej ) => { UpdateItemDataXHR('statistic', mainItemData, res); }) )
			.then( (( ) => { UpdateItemDataXHR('orders', mainItemData); }) );
	} else { UpdateItemDataXHR('statistic', mainItemData); }
	
	HideItemDataWindow();
}

function DeleteItem ( listItemData ) {
	let index = -1;
	if (listItemData.alerted) {
		nAlertItemsList.removeChild(listItemData.containerNode);
		if (nAlertItemsList.children.length === 0) { NotificationStop(); }
	} else {
		nItemsList.removeChild(listItemData.containerNode);
		if (listItems.length === 0) { nItemsList.classList.add('e-hidden'); }
	}
	index = $ITEMS.indexOf(listItemData.mainItemData);
	if (index > -1) { $ITEMS.splice(index, 1); }
	index = listItems.indexOf(listItemData);
	if (index > -1) { listItems.splice(index, 1); }
	SaveStorageData('items');
}

function EditItem ( ) {
	let mainItemData = null;
	let itemId = nItemDataForm.iSign.value.trim(), 
	    itemName = nItemDataForm.iName.value.trim(),
		itemRank = nItemDataForm.iRank.valueAsNumber,
	    itemSellLimit = nItemDataForm.iSellLimit.valueAsNumber,
		itemBuylLimit = nItemDataForm.iBuyLimit.valueAsNumber;
	
	if (isNaN(itemSellLimit)) { itemSellLimit = 0; }
	if (isNaN(itemBuylLimit)) { itemBuylLimit = 0; }
	
	if (nItemDataForm['_editItem_']) {   // edit
		let listItemData = nItemDataForm['_editItem_'];
		mainItemData = listItemData.mainItemData;
		let lastName = mainItemData.nm,
		    lastIndex = listItems.indexOf(listItemData);
		if (itemName !== '' && itemName !== mainItemData.mn) { mainItemData.nm = itemName; }
		else { delete mainItemData.nm; }
		if (!isNaN(itemRank) ) {mainItemData.rk = itemRank; }
		else { delete mainItemData.rk; }
		mainItemData.sl = itemSellLimit;
		mainItemData.bl = itemBuylLimit;
		nItemDataForm['_editItem_'].updateMainData();
		if (lastName !== mainItemData.nm) {
			SortListItems('nm');
			if (!listItemData.alerted) {
				InsertListItem(listItemData);
			}
		}
		HideItemDataWindow();
		SaveStorageData('items');
		return;
	}
	
	if (!itemId || itemId === '') { ShowMessage('error', 'Не указано ID или URL предмета.', 'EDIT_ITEM_DATA_ERROR', itemId); return; }
	if (itemId.indexOf($item_url) > -1) { itemId = itemId.replace($item_url, '').replace('/', ''); }
	
	mainItemData = {   // create
		id: itemId, nm: itemName, rk: 0,
		sl: itemSellLimit, bl: itemBuylLimit,
		mn: '', mi: '' 
	};
	if (!isNaN(itemRank)) {
		mainItemData.rk = itemRank;
	} else { delete mainItemData.rk; }
	if (itemName === '') { delete mainItemData.nm; }
	nItemDataWindow.classList.add('e-hidden');
	
	let cbFunc = CreateNewItem.bind($self_ctx, mainItemData);
	GM_xmlhttpRequest({
		method: 'GET',
		url: $item_url + itemId, responseType: 'text',
		onload: cbFunc, onerror: cbFunc, onabort: cbFunc, ontimeout: cbFunc
	});
}


function ShowItemDataWindow ( listItemData ) {
	if (listItemData && listItemData instanceof TListItem) {
		nItemDataForm['_editItem_'] = listItemData;
		nItemDataForm.iSign.value = listItemData.id;
		nItemDataForm.iSign.disabled = true;
		if (listItemData.mainItemData.nm) { nItemDataForm.iName.value = listItemData.mainItemData.nm; }
		if (typeof(listItemData.mainItemData.rk) !== 'undefined') { nItemDataForm.iRank.value = listItemData.mainItemData.rk; }
		nItemDataForm.iSellLimit.value = listItemData.mainItemData.sl;
		nItemDataForm.iBuyLimit.value = listItemData.mainItemData.bl;
	}
	nDarkFrame.classList.remove('e-hidden');
	nItemDataWindow.classList.remove('e-hidden');
}

function HideItemDataWindow ( ) {
	nItemDataWindow.classList.toggle('e-hidden', true);
	nDarkFrame.classList.add('e-hidden');
	nItemDataForm['_editItem_'] = null;
	nItemDataForm.iSign.disabled = false;
	nItemDataForm.reset();
}


function CreateListItem ( mainItemData ) {
	let $var = ((mainItemData.nm)? mainItemData.nm : mainItemData.mn);
	if (mainItemData.rk) { $var += '   [' + mainItemData.rk + ']' }
	let node = document.createElement('div');
	node.id = 'ITEM__' + mainItemData.id;
	node.className = 'li-listitem flx-row';
	node.innerHTML = $RESOURCE_ITEM_HTML
						.replace('${ITEM_IMAGE}$', mainItemData.mi)
						.replace('${ITEM_NAME}$', $var)
						.replace('${ITEM_MARKET_NAME}$', mainItemData.mn)
						.replace('${SELL_LIMIT}$', ((mainItemData.sl)? mainItemData.sl : '-'))
						.replace('${BUY_LIMIT}$', ((mainItemData.bl)? mainItemData.bl : '-'));
	node.addEventListener('mouseup', ListItemMouseUp, false);
	node.addEventListener('contextmenu', ListItemMouseContext, false);
	node.querySelector('.li-actions').addEventListener('click', ListItemActionBtnClick, false);
	
	let listItemData = new TListItem(mainItemData, node);
	$var = InsertInArray(listItems, listItemData, 'nm');
	InsertListItem(listItemData, $var);
	node['_listData_'] = listItemData;
	nItemsList.classList.remove('e-hidden');
	return listItemData;
}

function InsertListItem ( listItemData, index = -1 ) {
	if (index === -1) { index = listItems.indexOf(listItemData); }
	let ll = listItems.length;
	if (index === ll - 1) { nItemsList.appendChild(listItemData.containerNode); return index; }
	for (index += 1; index < ll; index++) {
		if (!listItems[index].alerted) {
			nItemsList.insertBefore(listItemData.containerNode, listItems[index].containerNode);
			return index;
		}
	}
	nItemsList.appendChild(listItemData.containerNode);
	return index - 1;
}

function SortListItems ( prop ) {
	let sortFunc = null;
	switch (prop) {
		case 'id': case 'nm': 
				sortFunc = (( a, b ) => {
					if (a[prop] > b[prop]) { return 1; }
					if (a[prop] < b[prop]) { return -1; }
					return 0;
				} );
			break;
	}
	listItems.sort(sortFunc);
}

function ListItemMouseUp ( e ) {
	if (e.button !== 2) { return true; }
	let listItemData = this['_listData_'],
	    act = e.originalTarget.getAttribute('d-act');
	switch (act) {
		case 'edit_data': ShowItemDataWindow(listItemData); break;
		case 'open_market': GM_openInTab($item_url + listItemData.id); break;
		case 'open_user':
				act = listItemData.getUserData(e.originalTarget.getAttribute('d-param'), 'name');
				if (act) { GM_openInTab($user_profile + act); }
			break;
		default: return true;
	}
	e.preventDefault(); e.stopPropagation();
	return false;
}

function ListItemMouseContext ( e ) {
	e.preventDefault(); e.stopPropagation();
	return false;
}

function ListItemActionBtnClick ( e ) {
	let listItemData = this.parentNode['_listData_'],
	    act = e.originalTarget.getAttribute('d-act');
	switch (act) {
		case 'update': UpdateItemDataXHR('orders', listItemData); break;
		case 'edit': ShowItemDataWindow(listItemData); break;
		case 'delete':
				if (confirm('Удалить предмет из списка? Действие необратимо.\nПредмет - ID: ' + listItemData.id + '   Name: ' + listItemData.nm)) {
					DeleteItem(listItemData);
				}
			break;
		default: return true;
	}
	e.preventDefault(); e.stopPropagation();
	return false;
}


function AlertItemsListDblClick ( e ) {
	let target = e.originalTarget,
	    listItemData = null;
	while (!target.classList.contains('li-listitem')) { target = target.parentNode; }
	listItemData = target['_listData_'];
	InsertListItem(listItemData);
	listItemData.alerted = false;
	if (nAlertItemsList.children.length === 0) { NotificationStop(); }
}


function UpdateAllItemsData ( dataType ) {
	let length = listItems.length; if (length === 0) { return; }
	let index = -1;
	
	let promiseThenCb = (( answer ) => {
		index++; if (index >= length) { nStatusMarker.classList.remove('cp-statusmarker-proc'); promiseThenCb = null; return; }
		return new Promise (
			(( res, rej ) => { UpdateItemDataXHR(dataType, listItems[index], res); })
		).then(promiseThenCb);
	});
	
	nStatusMarker.classList.add('cp-statusmarker-proc');
	promiseThenCb(null);
}


function UpdateItemDataXHR ( dataType, listItemData, promiseResolve ) {
	let cbFunc = UpdateItemDataRes.bind($self_ctx, dataType, listItemData, promiseResolve);
	GM_xmlhttpRequest({
		method: 'GET',
		url: ((dataType === 'orders')? $item_orders_url : $item_statistic_url).replace('${ITEM_ID}$', listItemData.id),
		headers: {
			'Host': 'api.warframe.market',
			'Origin': $market_basic,
			'platform': 'pc',
			'language': 'en'
		},
		responseType: 'json',
		onload: cbFunc, onerror: cbFunc, onabort: cbFunc, ontimeout: cbFunc
	});
}

function UpdateItemDataRes ( dataType, listItemData, promiseResolve, objResponse ) {
	// console.debug(',UpdateItemDataSuccess', objResponse);
	if (!promiseResolve) { promiseResolve = Empty; }
	if (objResponse.status !== 200 || !objResponse.response) {
		ShowMessage('error', 'Не удалось получить данные "' + dataType + '" для "' + listItemData.nm + '".',
					'UPDATE_DATA_RESPONSE_ERROR__STATUS', dataType, listItemData, objResponse);
		promiseResolve(false); return;
	}
	if (typeof(objResponse.response['payload']) === 'undefined') {
		ShowMessage('error', 'Не удалось получить данные "' + dataType + '" для "' + listItemData.nm + '".',
					'UPDATE_DATA_RESPONSE_ERROR__PROPERTY', dataType, listItemData, objResponse);
		promiseResolve(false); return;
	}
	if (dataType === 'orders') { ParseItemOrders(listItemData, objResponse.response['payload']['orders']); }
	else if (dataType === 'statistic') { ParseItemStatistic(listItemData, objResponse.response['payload']); }
	promiseResolve(true); 
}

function ParseItemOrders ( listItemData, ordersData ) {
	// console.debug('ParseItemOrders', listItemData, ordersData);
	let count = ordersData.length;
	let order = null, price = null;
	let sellCount = 0, buyCount = 0;
	let sellPrice = 999999, sellOrder = null,
		buyPrice = 0, buyOrder = null;
	let [ filterMin, filterMax ] = listItemData.getFilterPrices();
	let rkCheck = (typeof(listItemData.mainItemData.rk) !== 'undefined');
	
	if (typeof(listItemData.mainItemData.rk) === 'undefined') {
		for ( ; count--; ) {
			order = ordersData[count]; price = order['platinum'];
			if (order['order_type'] === 'sell') {
				if (price >= filterMin && price <= filterMax && price < sellPrice) {
					sellPrice = price; sellOrder = order;
				}; sellCount++;
			} else {
				if (price >= filterMin && price <= filterMax && price > buyPrice) {
					buyPrice = price; buyOrder = order;
				}; buyCount++;
			}
		}
	} else {
		let rkValue = listItemData.mainItemData.rk;
		for ( ; count--; ) {
			order = ordersData[count]; price = order['platinum'];
			if (order['order_type'] === 'sell') {
				if (rkValue === order['mod_rank'] && price >= filterMin && price <= filterMax && price < sellPrice) {
					sellPrice = price; sellOrder = order;
				}; sellCount++;
			} else {
				if (rkValue === order['mod_rank'] && price >= filterMin && price <= filterMax && price > buyPrice) {
					buyPrice = price; buyOrder = order;
				}; buyCount++;
			}
		}
	}
	
	listItemData.setOrdersCount(sellCount, buyCount);
	listItemData.setOrderData('sell', sellOrder);
	listItemData.setOrderData('buy', buyOrder);
	
	if (listItemData.mainItemData.sl && sellOrder && sellPrice <= listItemData.mainItemData.sl) { OrderNotification(listItemData, 'sell'); }
	else if (listItemData.mainItemData.bl && buyOrder && buyPrice >= listItemData.mainItemData.bl) { OrderNotification(listItemData, 'buy'); }
}

function ParseItemStatistic ( listItemData, statisticData ) {
	// console.debug('ParseItemStatistic', listItemData, statisticData);
	let statObj = null;
	if (statisticData['statistics_closed']) {
		statObj = statisticData['statistics_closed']['90days'];
		if (typeof(listItemData.mainItemData.rk) !== 'undefined') {
			let i = statObj.length, rk = listItemData.mainItemData.rk;
			for ( ; i--; ) {
				if (statObj[i]['mod_rank'] === rk) {
					listItemData.setStatisticData(statObj[i]);
					return;
				}
			}
		} else {
			if (statObj && statObj.length > 0) {
				statObj = statObj[statObj.length - 1];
				listItemData.setStatisticData(statObj);
				return;
			}
		}
		statObj = statisticData['statistics_closed']['48hours'];
		if (typeof(listItemData.mainItemData.rk) !== 'undefined') {
			let i = statObj.length, rk = listItemData.mainItemData.rk;
			for ( ; i--; ) {
				if (statObj[i] === rk) {
					listItemData.setStatisticData(statObj[i]);
					return;
				}
			}
		} else {
			if (statObj && statObj.length > 0) {
				statObj = statObj[statObj.length - 1];
				listItemData.setStatisticData(statObj);
				return;
			}
		}
		ShowMessage('error', 'Не удалось получить данные статистики для "' + listItemData.nm + '".',
					'PARSE_ITEM_STATISTIC__CLOSED', listItemData, statisticData['statistics_closed']);
		return;
	}
	if (statisticData['statistics_live']) {
		statObj = statisticData['statistics_live']['48hours'];
		if (statObj && statObj.length > 0) {
			let val1 = statObj[statObj.length - 1][$SETTINGS.pricesFilterType],
			    val2 = statObj[statObj.length - 2][$SETTINGS.pricesFilterType];
			let obj = { };
			if (val1 && val2) {
				obj[$SETTINGS.pricesFilterType] = (val1 + val2) / 2
				listItemData.setStatisticData(obj);
				return;
			} else {
				ShowMessage('error', 'Не удалось получить статистическую цену для "' + listItemData.nm + '".',
					'PARSE_ITEM_STATISTIC__LIVE90', listItemData, statObj, $SETTINGS.pricesFilterType, val1, val2);
				return;
			}
			return;
		}
		statObj = statisticData['statistics_live']['48hours'];
		if (statObj && statObj.length > 0) {
			let val1 = statObj[statObj.length - 1][$SETTINGS.pricesFilterType],
			    val2 = statObj[statObj.length - 2][$SETTINGS.pricesFilterType];
			let obj = { };
			if (val1 && val2) {
				obj[$SETTINGS.pricesFilterType] = (val1 + val2) / 2
				return;
			} else {
				ShowMessage('error', 'Не удалось получить статистическую цену для "' + listItemData.nm + '".',
					'PARSE_ITEM_STATISTIC__LIVE48', listItemData, statObj, $SETTINGS.pricesFilterType, val1, val2);
				return;
			}
			ShowMessage('error', 'Не удалось получить данные статистики для "' + listItemData.nm + '".',
					'PARSE_ITEM_STATISTIC__CLOSED', listItemData, statisticData['statistics_closed']);
			return;
		}
	} else {
		
	}
}


function OrderNotification ( listItemData, orderType ) {
	if (listItemData.alerted) { return; }
	listItemData.alerted = orderType;
	nAlertItemsList.appendChild(listItemData.containerNode);
	if ($SETTINGS.audioAlert) { audioAlert.play(); }
	if (typeof(GM_notification) !== 'undefined' && document.hidden) {
		GM_notification(
			'По позиции "' + listItemData.nm + '" найдено подходящее предложение.',
			'WF Market Monitor - Найдено предложение', $RESOURCE_FAVICON, null
		);
	}
	NotificationStart();
}

function NotificationStart ( ) {
	if (notificationOn) { return; } notificationOn = true;
	nAlertItemsList.classList.remove('e-hidden');
	window.scroll({top: 40, left: 0, behavior: 'smooth'});
	nFavicon.href = $RESOURCE_FAVICON_ALERT;
	if ($SETTINGS.audioAlert && $SETTINGS.repeatAudioAlert && !audioTimer && document.hidden) {
		audioTimer = setInterval(NotificationAudioRepeat, $SETTINGS.repeatAudioAlert * 1000);
	}
}

function NotificationStop ( ) {
	nAlertItemsList.classList.add('e-hidden');
	nFavicon.href = $RESOURCE_FAVICON;
	clearInterval(audioTimer); audioTimer = null;
	notificationOn = false;
}

function NotificationAudioRepeat ( ) {
	audioAlert.play();
}



// ============================================================================

function Empty ( v ) { return v; }

function ShowMessage ( type, message, ...params) {
	switch (type) {
		case 'info':
				if (typeof(GM_notification) !== 'undefined') {
					GM_notification( message, 'WF Market Monitor - INFO', $RESOURCE_FAVICON, null);
				}
				console.log('WF Market Monitor: ' + message);
			break;
		case 'error':
				let messagePS = ''
				if (params && params.length > 0) { messagePS = ' Дополнительные данные выведены в консоль ошибок.'; }
				console.debug('WF Market Monitor [Error]: ' + message);
				if (params && params.length > 0) { console.debug(...params); }
				if (typeof(GM_notification) !== 'undefined') {
					GM_notification(message + messagePS, 'WF Market Monitor - ERROR', $RESOURCE_FAVICON, null);
				} else { alert(message + messagePS); }
			break;
	}
}


function ParseDate ( dateStr ) {
	let dateObj = new Date(dateStr);
	let diff =  new Date().getTime() - dateObj.getTime(),
	    diffStr = '';
	if (diff > 86400000) { diffStr = Math.floor(diff / 86400000) + ' д.'; }
	else if (diff > 3600000) { diffStr = Math.floor(diff / 3600000) + ' ч.'; }
	else if (diff > 60000) { diffStr = Math.floor(diff / 60000) + ' м.'; }
	else { diffStr = 'только что'; }
	
	return {
		ts: ('' + dateObj.getDate()).padStart(2, '0') + '.' +
		    ('' + (dateObj.getMonth() + 1)).padStart(2, '0') + '.' +
			dateObj.getFullYear() + ' ' +
			('' + dateObj.getHours()).padStart(2, '0') + ':' +
			('' + dateObj.getMinutes()).padStart(2, '0') + ':' +
			('' + dateObj.getSeconds()).padStart(2, '0'),
		ds: diffStr
	}
}


function InsertInArray ( arr, item, prop ) {
	let l = arr.length;
	if (l === 0 || item[prop] > arr[l - 1][prop]) { arr.push(item); return l; }
	let i = 0, val = item[prop];
	for (; i < l; i++) {
		if (val < arr[i][prop]) {
			arr.splice(i, 0, item);
			return i;
		}
	}
	arr.push(item); return l;
}


function Event_OnVisibleChange ( ) {
	clearInterval(audioTimer); audioTimer = null;
}

function Event_OnUnload ( ) {
	SaveStorageData('all');
}



function TListItem ( mainItemData, liNode ) {
	Object.defineProperties( this, {
		'$minFilterPrice': { writable: true, value: 0 },
		'$maxFilterPrice': { writable: true, value: 0 },
		'$sellPrice': { writable: true, value: 0 },
		'$buyPrice': { writable: true, value: 0 },
		'$sellUser': { value: { id: null, name: null, status: null } },
		'$buyUser': { value: { id: null, name: null, status: null } },
		'$isAlerted': { writable: true, value: false }
	});
	Object.defineProperties( this, {
		'containerNode': { enumerable: true, value: liNode },
		'allOrdersCountNode': { enumerable: true, value: liNode.querySelector('.li-count-all') },
		'separatedOrdersCountNode': { enumerable: true, value: liNode.querySelector('.li-count-sb') },
		'allFilterNode': { enumerable: true, value: liNode.querySelector('.li-filter-all') },
		'separatedFilterNode': { enumerable: true, value: liNode.querySelector('.li-filter-sb') },
		'sellPriceNode': { enumerable: true, value: liNode.querySelector('.li-price-sell') },
		'buyPriceNode': { enumerable: true, value: liNode.querySelector('.li-price-buy') },
		'sellUserNode': { enumerable: true, value: liNode.querySelector('.li-user-sell') },
		'buyUserNode': { enumerable: true, value: liNode.querySelector('.li-user-buy') }
	});
	Object.defineProperties( this, {
		'mainItemData': { enumerable: true, value: mainItemData },
		'id': { enumerable: true, value: mainItemData.id },
		'nm': { enumerable: true, writable: true, value: ((mainItemData.nm)? mainItemData.nm : mainItemData.mn)
														+ ((mainItemData.rk)? '   [' + mainItemData.rk + ']' : '') }
	});
}

Object.defineProperties( TListItem.prototype, {
	'alerted': {
		enumerable: true,
		get: function ( ) { return (!!this.$isAlerted); },
		set: function ( val ) {
			if (val) {
				this.containerNode.classList.add('li-alertmark-' + val);
				this.$isAlerted = val;
			} else {
				this.containerNode.classList.remove('li-alertmark-' + this.$isAlerted);
				this.$isAlerted = false;
			}
		}
	},
	
	'getUserData': {
		enumerable: true,
		value: function ( type, param ) {
			let usetData = this['$' + type + 'User']
			if (param) { return usetData[param]; }
			return { id: usetData.id, name: usetData.name, status: null };
		}
	},
	'getFilterPrices': {
		enumerable: true,
		value: function ( ) {
			return [
				((this.$minFilterPrice)? this.$minFilterPrice : 0),
				((this.$maxFilterPrice)? this.$maxFilterPrice : 999999)
			];
		}
	},
	
	'setOrdersCount': {
		enumerable: true,
		value: function ( sc, bc ) {
			this.allOrdersCountNode.innerText = sc + bc;
			this.separatedOrdersCountNode.innerText = sc + ' / ' + bc;
		}
	},
	'setStatisticData': {
		enumerable: true,
		value: function ( so ) {
			let midPrice = so[$SETTINGS.pricesFilterType];
			if (!midPrice) {
				ShowMessage('error', 'Не удалось получить статистическую цену для "' + this.nm + '".',
					'SET_STATISTIC_DATA_LISTEN_ITEM', this, so, $SETTINGS.pricesFilterType);
				this.$minFilterPrice = 0; this.$maxFilterPrice = 0;
				this.allFilterNode.innerText = '-'; this.separatedFilterNode.innerText = '-'; 
				return;
			}
			let priceDeviation = $SETTINGS.pricesFilterDeviation;
			this.$minFilterPrice = Math.floor(midPrice - (midPrice * priceDeviation));
			this.$maxFilterPrice = Math.ceil(midPrice + (midPrice * priceDeviation));
			this.allFilterNode.innerText = Math.round(midPrice);
			this.separatedFilterNode.innerText = this.$minFilterPrice + ' / ' + this.$maxFilterPrice;
		}
	},
	'setOrderData': {
		enumerable: true,
		value: function ( type, order ) {
			// console.debug(order);
			let node = null, propName = null;
			if (order === null) {
				propName = '$' + type + 'User';
				node = this[type + 'UserNode'];
				this['$' + type + 'Price'] = 0;
				this[propName].id = null; this[propName].name = null; this[propName].status = null;
				node = this[type + 'PriceNode'];
				node.innerText = '-'; node.title = '[НЕТ ДАННЫХ]';
				node = this[type + 'UserNode'];
				node.innerText = '-'; node.title = '[НЕТ ДАННЫХ]';
				return;
			}
			
			let parsedDate = ParseDate(order['last_update']);
			node = this[type + 'PriceNode'];
			this['$' + type + 'Price'] = order['platinum'];
			node.innerText = order['platinum'];
			node.title = ((type === 'sell')? 'Наименьшая цена продажи' : 'Наибольшая цена покупки')
							+ '\nЛот создан: ' + parsedDate.ts + ' (' + parsedDate.ds + ')'
							+ '\nРегион лота: ' + order['region'];
			
			order = order['user']; propName = '$' + type + 'User'; node = this[type + 'UserNode'];
			parsedDate = ParseDate(order['last_seen'])
			this[propName].id = order['id']; this[propName].name = order['ingame_name']; this[propName].status = order['status'];
			node.innerText = order['ingame_name'];
			node.title = 'Игровой ник ' + ((type === 'sell')? 'продавца' : 'покупателя')
							+ '\nСтатус: ' + order['status']
							+ '\nПоследний онлайн: ' + parsedDate.ts + ' (' + parsedDate.ds + ')'
							+ '\nРегион: ' + order['region']
							+ '\nMarketID: ' + order['id'];
		}
	},
	'updateMainData': {
		enumerable: true,
		value: function ( ) {
			let node = this.containerNode;
			let mainData = this.mainItemData;
			this.nm = ((mainData.nm)? mainData.nm : mainData.mn) + ((mainData.rk)? '   [' + mainData.rk + ']' : '');
			node.querySelector('.li-limit-sell').innerText = ((mainData.sl)? mainData.sl : '-');
			node.querySelector('.li-limit-buy').innerText = ((mainData.bl)? mainData.bl : '-');
			node.querySelector('.li-name').innerText = this.nm;
		}
	},
});



// ============================================================================

var $RESOURCE_PAGE_HTML = '' +
	'<div id="ControlPanel" class="main-container">' +
		'<button id="CP_AddNewItemBtn">Добавить предмет</button>' +
		'<div class="cp-separator">&nbsp;</div>' +
		'<div class="cp-subcontainer">' +
			'<span>Таймер (мин):</span>' +
			'<input id="CP_UpdateTimeInput" min="1" value="5" type="number">' +
			'<div id="CP_UpdateTimeSetBtn" class="custom-btn icon-ok" title="Применить">&nbsp;</div>' +
		'</div>' +
		'<div class="cp-separator">&nbsp;</div>' +
		'<div class="cp-subcontainer">' +
			'<div id="CP_ForceUpdateBtn" class="custom-btn icon-refresh" title="Обновить принудительно">&nbsp;</div>' +
			'<div id="CP_StatusMarker" class="cp-statusmarker-off" title="Запустить автообновление">&nbsp;</div>' +
		'</div>' +
	'</div>' +
	'<div id="AlertItemsList" class="main-container e-hidden"></div>' +
	'<div id="ItemsList" class="main-container e-hidden"></div>' +
	'<div id="DarkFrame" class="e-hidden">&nbsp;</div>' +
	'<div id="ItemDataWindow" class="sub-window e-hidden">' +
		'<div class="sw-title">Данные предмета</div>' +
		'<div class="sw-body">' +
			'<form id="ID_Form" action="">' +
				'<div class="sw-param flx-row">' +
					'<span class="sw-param-name">URL или ID:</span>' +
					'<input class="sw-param-input" name="iSign" type="text" title="Ссылка на страницу предмета в маркете или его ID.\nОбязательное поле.\nПример: ' + $item_url + 'rhino_prime_set\nПример: rhino_prime_set">' +
				'</div>' +
				'<div class="sw-param flx-row">' +
					'<span class="sw-param-name">Ранг мода:</span>' +
					'<input class="sw-param-input" name="iRank" min="0" type="number" title="">' +
				'</div>' +
				'<div class="sw-param flx-row">' +
					'<span class="sw-param-name">Название:</span>' +
					'<input class="sw-param-input" name="iName" type="text" title="Название для отображения в списке.\nНеобязательное поле. При пустом поле будет использовано название предмета с маркета.\nПример: сет рино">' +
				'</div>' +
				'<div class="sw-param flx-row">' +
					'<span class="sw-param-name">Уведомления:</span>' +
					'<input class="sw-param-input" name="iSellLimit" min="0" placeholder="WTS (<=)" type="number" title="Порог цены предмета в лотах продажи для срабатывания уведомлений. Уведомление будет показано если цена лота будет меньше или равна указанному значению.\nНеобязательное поле. Пустое поле или 0 отключают уведомления по лотам продажи для этого предмета.">' +
					'<input class="sw-param-input" name="iBuyLimit" min="0" placeholder="WTB (>=)" type="number" title="Порог цены предмета в лотах покупки для срабатывания уведомлений. Уведомление будет показано если цена лота будет больше или равна указанному значению.\nНеобязательное поле. Пустое поле или 0 отключают уведомления по лотам покупки для этого предмета.">' +
				'</div>' +
			'</form>' +
		'</div>' +
		'<div class="sw-buttons flx-row">' +
			'<button id="ID_AcceptBtn">Принять</button>' +
			'<button id="ID_CancelBtn">Отмена</button>' +
		'</div>' +
	'</div>';


const $RESOURCE_ITEM_HTML = '' +
	'<div class="li-actions">' +
		'<div class="li-action-upd li-action-btn custom-btn icon-refresh" d-act="update" title="Обновить">&nbsp;</div>' +
		'<div class="li-action-edt li-action-btn custom-btn icon-edit" d-act="edit" title="Редактировать">&nbsp;</div>' +
		'<div class="li-action-del li-action-btn custom-btn icon-delete" d-act="delete" title="Удалить">&nbsp;</div>' +
	'</div>' +
	'<div class="li-limits li-column">' +
		'<div class="li-limit-sell li-cell li-top-line e-hovered" d-act="edit_data" title="Порог уведомления по цене продажи">${SELL_LIMIT}$</div>' +
		'<div class="li-limit-buy li-cell e-hovered" d-act="edit_data" title="Порог уведомления по цене покупки">${BUY_LIMIT}$</div>' +
	'</div>' +
	'<div class="li-image li-cell" style="background-image: url(\'https://warframe.market/static/assets/icons/en/${ITEM_IMAGE}$\');" d-act="open_market">&nbsp;</div>' +
	'<div class="li-name li-cell" d-act="open_market" title="${ITEM_MARKET_NAME}$">${ITEM_NAME}$</div>' +
	'<div class="li-counts li-column">' +
		'<div class="li-count-all li-cell li-top-line" title="Общее количество лотов">-</div>' +
		'<div class="li-count-sb li-cell" title="Количество лотов: Продажа / Покупка">- / -</div>' +
	'</div>' +
	'<div class="li-filters li-column">' +
		'<div class="li-filter-all li-cell li-top-line" title="Среднее значение фильтра для цен">-</div>' +
		'<div class="li-filter-sb li-cell" title="Min / Max значения фильтра для цен">-</div>' +
	'</div>' +
	'<div class="li-prices li-column">' +
		'<div class="li-price-sell li-cell li-top-line e-hovered" d-act="open_user" d-param="sell" title="[НЕТ ДАННЫХ]">-</div>' +
		'<div class="li-price-buy li-cell e-hovered" d-act="open_user" d-param="buy" title="[НЕТ ДАННЫХ]">-</div>' +
	'</div>' +
	'<div class="li-users li-column">' +
		'<div class="li-user-sell li-cell li-top-line e-hovered" d-act="open_user" d-param="sell" title="[НЕТ ДАННЫХ]">-</div>' +
		'<div class="li-user-buy li-cell e-hovered" d-act="open_user" d-param="buy" title="[НЕТ ДАННЫХ]">-</div>' +
	'</div>';

	
var $RESOURCE_PAGE_CSS = '' +
	'body { \n' +
	'	margin: 0px; padding: 1px; \n' +
	'	font-family: "Times New Roman", sans-serif; \n' +
	'	font-size: 16px; \n' +
	'} \n' +
	'body * { box-sizing: border-box; } \n' +
	'form { width: 100%; border: none; padding: 0px; margin: 0px; } \n' +
	
	'.flx-row { display: flex; flex-flow: row nowrap; } \n' +
	'.flx-col { display: flex; flex-flow: column wrap; } \n' +
	
	'.main-container { \n' +
	'	margin: 5px 1px; \n' +
	'	padding: 2px 3px; \n' +
	'	border: 2px solid #000000; \n' +
	'} \n' +
	
	'.custom-btn { \n' +
	'	min-width: 1.3em; \n' +
	'	margin: 1px; padding: 0px; \n' +
	'	border: 1px solid #000000; \n' +
	'	background-size: contain; \n' +
	'	background-repeat: no-repeat; \n' +
	'	background-position: center; \n' +
	'	-moz-user-select: none; \n' +
	'	cursor: default; \n' +
	'} \n' +
	'.custom-btn:hover { \n' +
	'	border-color: #8888FF !important; \n' +
	'	background-color: #DDEDFF !important; \n' +
	'} \n' +
	'.custom-btn:active { \n' +
	'	border-color: #000000 !important; \n' +
	'	background-color: #AAAAFF !important; \n' +
	'} \n' +
	
	
	'#ControlPanel { \n' +
	'	display: flex; \n' +
	'	flex-flow: row nowrap; \n' +
	'	justify-content: center; \n' +
	'	align-items: stretch; \n' +
	'	margin-top: 1px; \n' +
	'} \n' +
	'#CP_UpdateTimeInput { \n' +
	'	width: 60px; \n' +
	'	margin: 1px 3px 1px 5px; \n' +
	'} \n' +
	'#CP_StatusMarker { \n' +
	'	width: 50px; \n' +
	'	margin: 0px 0px 0px 3px; \n' +
	'	border: 1px solid #000000; \n' +
	'	-moz-user-select: none; \n' +
	'	cursor: default; \n' +
	'} \n' +
	'.cp-statusmarker-off { background-color: #FF0000; } \n' +
	'.cp-statusmarker-on { background-color: #00AA00; } \n' +
	'.cp-statusmarker-proc { background-color: #FFFF00 !important; } \n' +
	
	'#ControlPanel .custom-btn { \n' +
	'	width: 22px; \n' +
	'	border-color: transparent; \n' +
	'} \n' +
	'#ControlPanel span { align-self: center; } \n' +
	'.cp-separator { flex-grow: 1; } \n' +
	'.cp-subcontainer { \n' +
	'	display: flex; \n' +
	'	flex-flow: row nowrap; \n' +
	'	align-items: stretch; \n' +
	'} \n' +
	
	
	'#ItemsList { \n' +
	'	border-color: #000000; \n' +
	'	background-color: #FFFFFF; \n' +
	'} \n' +
	
	'#AlertItemsList { \n' +
	'	border-color: #00AA00; \n' +
	'	background-color: #AAFFAA; \n' +
	'} \n' +
	
	
	'.li-listitem { \n' +
	'	margin-top: 2px; padding: 0px; \n' +
	'	border: 2px solid #000000; \n' +
	'	background: #FFFFFF none no-repeat; \n' +
	'	cursor: default; \n' +
	'} \n' +
	'.li-listitem:first-child { \n' +
	'	margin-top: 0px !important; \n' +
	'} \n' +
	
	'.li-column { \n' +
	'	display: flex; \n' +
	'	flex-direction: column; \n' +
	'	align-content: stretch; \n' +
	'	align-items: stretch; \n' +
	'	border-width: 0px; \n' +
	'} \n' +
	'.li-cell { \n' +
	'	margin: 0px; padding: 1px 3px; \n' +
	'	border-width: 1px; \n' +
	'	border-style: solid; \n' +
	'	border-color: transparent #AAAAAA; \n' +
	'} \n' +
	'.li-top-line { \n' +
	'	padding-bottom: 2px; \n' +
	'	border-bottom-color: #AAAAAA; \n' +
	'} \n' +
	
	'.li-actions { \n' +
	'	display: flex; flex-wrap: wrap; \n' +
	'	justify-content: flex-end; \n' +
	'	align-items: center; \n' +
	'	min-width: 50px; flex-basis: 50px; \n' +
	'	border-right: 1px solid #AAAAAA; \n' +
	'} \n' +
	'.li-limits { \n' +
	'	min-width: 50px; \n' +
	'	flex-basis: 60px; \n' +
	'	text-align: right; \n' +
	'	border-right: 1px solid #AAAAAA; \n' +
	'} \n' +
	'.li-counts { \n' +
	'	min-width: 90px; \n' +
	'	flex-basis: 110px; \n' +
	'	text-align: center; \n' +
	'} \n' +
	'.li-filters { \n' +
	'	min-width: 90px; \n' +
	'	flex-basis: 110px; \n' +
	'	text-align: center; \n' +
	'} \n' +
	'.li-prices { \n' +
	'	min-width: 50px; \n' +
	'	flex-basis: 70px; \n' +
	'	font-weight: 900; \n' +
	'	text-align: right; \n' +
	'} \n' +
	'.li-users { \n' +
	'	min-width: 170px; \n' +
	'	flex-basis: 200px; \n' +
	'	text-align: center; \n' +
	'} \n' +
	
	'.li-action-btn { \n' +
	'	flex-basis: 22px; \n' +
	'	margin: 1px; \n' +
	'	border: 1px solid #000000; \n' +
	'	cursor: default; \n' +
	'} \n' +
	'.li-image { \n' +
	'	min-width: 50px; \n' +
	'	width: 50px; \n' +
	'	margin: 0px 0px 0px 20px; \n' +
	'	padding: 0px; \n' +
	'	border-width: 0px; \n' +
	'	background-size: contain; \n' +
	'	background-repeat: no-repeat; \n' +
	'	background-position: center; \n' +
	'	-moz-user-select: none; \n' +
	'	cursor: default; \n' +
	'}  \n' +
	'.li-name { \n' +
	'	min-width: 300px; \n' +
	'	flex-grow: 1; \n' +
	'	padding: 0.8em 10px 3px 30px; \n' +
	'	border-width: 0px 1px 0px 0px; \n' +
	'	text-align: left; \n' +
	'	font-size: 18px; font-weight: 900; \n' +
	'} \n' +
	
	'.li-prices * { \n' +
	'	border-right-width: 0px; \n' +
	'} \n' +
	
	'#AlertItemsList .li-alertmark-sell .li-limit-sell, ' +
	'#AlertItemsList .li-alertmark-sell .li-price-sell, ' +
	'#AlertItemsList .li-alertmark-sell .li-user-sell, ' +
	'#AlertItemsList .li-alertmark-buy .li-limit-buy, ' +
	'#AlertItemsList .li-alertmark-buy .li-price-buy, ' +
	'#AlertItemsList .li-alertmark-buy .li-user-buy { \n' +
	'	border-color: #00AA00; \n' +
	'	background-color: #AAFFAA; \n' +
	'} \n' +
	
	
	'#DarkFrame { \n' +
	'	position: absolute; \n' +
	'	left: 0px; top: 0px; \n' +
	'	width: 100%; height: 100%; \n' +
	'	border: none; margin: 0px; \n' +
	'	background: rgba(0, 0, 0, 0.9) none no-repeat; \n' +
	'	z-index: 999; \n' +
	'} \n' +
	
	'.sub-window { \n' +
	'	width: 500px; \n' +
	'	position: fixed; \n' +
	'	left: calc(50% - 250px); top: 50px; \n' +
	'	border: 2px solid #000000; \n' +
	'	padding: 0px; margin: 0px; \n' +
	'	background: #FFFFFF none no-repeat; \n' +
	'	z-index: 1000; \n' +
	'} \n' +
	'.sw-title { \n' +
	'	text-align: center; \n' +
	'	background: #666666 none no-repeat; \n' +
	'	color: #FFFFFF; \n' +
	'	padding: 2px 5px; \n' +
	'	border-bottom: 2px solid #000000; \n' +
	'	font-weight: 900; \n' +
	'	font-size: 18px; \n' +
	'} \n' +
	'.sw-body { \n' +
	'	margin: 0px; \n' +
	'	padding: 7px 5px; \n' +
	'} \n' +
	'.sw-buttons { \n' +
	'	margin: 0px; \n' +
	'	padding: 0px 5px 3px 5px; \n' +
	'} \n' +
	'.sw-buttons button { \n' +
	'	flex-grow: 1; \n' +
	'	margin: 0px; \n' +
	'} \n' +
	'.sw-param { \n' +
	'	align-items: flex-end; \n' +
	'	margin: 2px 0px; padding: 0px; \n' +
	'} \n' +
	'.sw-param-name { margin-right: 3px; } \n' +
	'.sw-param-input { flex-grow: 1; margin-left: 3px; } \n' +
	'.sw-param-short { flex-grow: 0; } \n' +
	
	'#ItemDataWindow .sw-param-name { flex-basis: 100px; } \n' +
	
	'.e-hidden { display: none !important; } \n' +
	'.e-hovered:hover { background-color: #DDEDFF !important; } \n' +
	'.e-actived:active { background-color: #FF8888 !important; } \n' +
	
	
	'.icon-ok { \n' +
	'	background-image: url("data:image/png;base64,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"); \n' +
	'} \n' +
	'.icon-refresh { \n' +
	'	background-image: url("data:image/png;base64,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"); \n' +
	'} \n' +
	'.icon-edit { \n' +
	'	background-image: url("data:image/png;base64,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"); \n' +
	'} \n' +
	'.icon-delete { \n' +
	'	background-image: url("data:image/png;base64,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"); \n' +
	'}';

const $RESOURCE_FAVICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABNmlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjarY6xSsNQFEDPi6LiUCsEcXB4kygotupgxqQtRRCs1SHJ1qShSmkSXl7VfoSjWwcXd7/AyVFwUPwC/0Bx6uAQIYODCJ7p3MPlcsGo2HWnYZRhEGvVbjrS9Xw5+8QMUwDQCbPUbrUOAOIkjvjB5ysC4HnTrjsN/sZ8mCoNTIDtbpSFICpA/0KnGsQYMIN+qkHcAaY6addAPAClXu4vQCnI/Q0oKdfzQXwAZs/1fDDmADPIfQUwdXSpAWpJOlJnvVMtq5ZlSbubBJE8HmU6GmRyPw4TlSaqo6MukP8HwGK+2G46cq1qWXvr/DOu58vc3o8QgFh6LFpBOFTn3yqMnd/n4sZ4GQ5vYXpStN0ruNmAheuirVahvAX34y/Axk/96FpPYgAAACBjSFJNAAB6JQAAgIMAAPn/AACA6AAAUggAARVYAAA6lwAAF2/XWh+QAAAHY0lEQVR42sSXa0yU6RXHf+/MOwwDgkUGQRjAheEindigEsVNNemmYdaaXmjXy268RJo2UGk7SW3aRqJf7Id2NSIJfq5UTFXQYI3jhquX/TIUsoTqxlWGKMplBsGBuV9OP4izpWrX1W73JG9ynnPec87/nPO8530eBfgUSOfroWkVyAKWvo51cnIyIoLP53tdADoNEH5d69zcXPLy8t6kAmHNm1jv27ePmpqaN+6DC5Av+1RXV0s4HJZIJCLV1dXyOj4WYn95ADabTUKhkDyjUCgkNpvtqwdQUFAg7e3t8jJqb2+XgoKCrwZATU2NTE1NLQrY3Nwszc3Ni2RTU1NSU1PzvwOQlpYmra2tz2V74sQJURRFFEWRxsbG5/Stra2Slpb2ZgBMJpMMDAwsctzf3y9VVVUCiNFolPT0dAGkqqpK+vv7F707MDAgubm5/x1Aamqqy2g0LlKoqirl5eXicDjizqanp8Vms4ler4+/19TUJE1NTfG1Xq8Xm80m09PTcTuHwyHl5eWiquqiGEajUVJTU10YDAbXkSNH5Pjx49LQ0CAtLS3idDoXZWK326WoqGhRZU6dOhXXt7S0iMlkiuvNZrPY7fZFPpxOp7S0tEhDQ4McP35cjhw5IgaD4WkL9uzZIyIiwWBQRESGhoZkfHw83stn6LVardTX14vL5RIRkZ6eHunp6REREZfLJfX19aLVauNVPH36tIiIjI+Py9DQkIiIBAIBERHZu3fv53tg+/btEovFxGq1SnZ2tgBy4cIFGRsbk6SkpHhWvb298YxOnjwpOp1OVFWVkydPxuV9fX1iNpsFkKSkJBkbG5OLFy8KINnZ2WK1WiUWi8mOHTsEcGkAVq1ahaIouN1uMjIy2LVrN+np6fT2dOPz+cjLy6Ozs5PNmzdz9epVKioqqK2tZcuWLWzdupXa2loqKiqw2+1s2rSJrq4uCgoK8Pl82O120tLS2L17NxkZGbjdbhRFobS09PNRfO3aNfF6vZKSkiJms1k8Ho/87dw5qdr6fQHin1ldXZ0AYkjQyeHDh2Vubk7m5ubk4MGD8f7X1dWJiEjD738ngBw9elQ6OztlZmZGzGazpKSkiNfrlZs3bz5tgdFodAUCAWlraxNA1q5dKyOf3ZGk/BJZ9sOfiz5BJ2fPnpXGxsZ4kG//+AOxX/67fO9dq1itVrl//74MDw9LSUnJ06H1/nZZt7tells/kNUWi2g1GhkZGZF169YJIOfPn5dwOCw5OTkuzYYNG9Dr9XR0dACwceNGHj9+TDgaJSU9g8z0dFr/2sKVi20k5JaQtfcPjGSX8/5fPuLyR93Y7XYsFgvXr1/nYtt5EjVw5p8P8ZS8jZqVz9DwMDERZmdnqaysBKCjowNVVamsrERNSEgA4OHDhwCUl5fT3d1FeN5LKBRifHyCyY/7Mf1gH1mlBpbcvsGtXjupFe+w8tcf4r7SgueWg9raWn60ax+5dX/EM/OYkT/9gsiTaQBEhK6uLtasWQPAo0ePABgfH0ft6+sjEolQXFxMZ2cno6OjJOsTIBqFcBBD6TrS3nmPseuXCA3doOKbpSRoNXgcXQSct8ja9ksMb5UR8XroS8jH23WB4G3Hc//8WCyG0+kEoKysjImJCRwOB1q/3//baDSatH//ftrb2+nu7mbtmnLuzwcILs1kqeseSaOfsGTqHjO+IN7iSnJqGvA5bxN85OSJowt1ZRkkJlPp/QzdpJOpGQ9Z2+rRGZJRPS5MplzKyso4evQomZmZHDt2jEOHDjE4OOhTFoaBcefOnVgsFoaHh3FNTODSpTK5vBguNVNk+RaP0/JwJ6az8lcfEpy4z3T3ObRJKYw2/obVBXmsXVNOOBxhaC6G3/ozlm2wcv/QTtIfDJFlysXj8ZCZmYnFYmFwcBC73Q7gVp+V6MyZMxQWFqIoCqacHEKhILGgn3ljARM/OYh+uQn9jUvEwiFi/nkkGmXFe/vRLlvBkitNjMxHuLVkJQmr8sld/11CczMkJ+opLTITRENWVhYzMzO0tbVx586deGviABITEzlw4AB3797lk8EBVEUlGvCxtOI7GN9+F++ng8QiYRBhYWcR9c2zZGUxtzMsZG3bT46qMvvxZaJ+LzERDAYDb2UvIzFlKU6nk5ycHPLz8xkZGSESiSwGEAgEsNlsrF+/noDfz6RvHk3hiqcZBwMLI+B5iga8pKzIIzW3EN+94ThAnU7H6IMH/PmsHaPRSGFhIZOTk4yOji6yV/994ff76e3tBUCfV8I3NK9yaFaQaASJvOB0rygAuN1u3G73C61fGkGj0fxfrkbqFyeoQdGqKBotaF6dR1HiFXhtABKNEJ2bJeR6SGh6gsis+4v5mac8ikLEM/MKDVyYA/+pMOSXYvppA/O3/4GaugyJhIkF/WiTUpBo5CmfnLIgDyzwESQUQGNYAkBkfpbgwxEe9154WXy3Asy+6HKqSUgkqWg1ipqARMOAgqLRILHoIl5RFFAW5IqC8owHNDo9Ue8c3juDLwPwRPm6r+f/GgAeCiDQjZIymwAAAABJRU5ErkJggg==';

const $RESOURCE_FAVICON_ALERT = 'data:image/png;base64,R0lGODlhgACAAPf/APgAAOb//8AAAP9oaNEAANNaWtxZWdgiIgBzkQCaxfHx8dZGRgApN/z8/Pc1Nf90dOY1NeHExP9eXkpKShAQEACVvv+Li/dkZGNjY/+Bgd/e3mtra8gAAP9kZFtbWzExMUNDQ+RpadoAAPX19eK6uvn5+dQUFP9kZOfn51JSUgCr2TY2NgBWcACJr7HJyf9sbIaGhoODg3x8fOF7e/9+fuMAAOQiIvR8e95SUtPT0+8AAPD8/Orz8+rq6v90dNzb2wCiz/8AAP98fPUkJN3w9u/v77e3t+Xd3QIDBP2Sks7OzrkAAMrKytbX1wCq1/8bGrCwsP9ra/+jpfSJif/V1ZGRkePj48Lm5cHCwiQkJI2NjeKurhsbG5+fn8gMDPW5ubAqKv/ExImJiX5+fqOjo/kLC+kUFKysrN6IiN3t7Xd3d9dwcL+/v9vj5PpKSvJHR/xRUfTLy/8BAMgfH906O//y8gBmgv8yMvVAQMbGxnJycvXt7f/r683S0qenp5aWlvtZWf+GhumYmN1LS5qamrq6uvJeXtupqf8XFLOxsd0uLs/e3vFSUt9CQgCz5AA2R7fc3L/NzftCQuZdXf8MC87i4tubm+s/P+tKSv9MS//i4sDe3gCfy9AtLdIEBMny8t2zs/+qqt3t8dPt7fb+/scFBbLU1P9WVf+nqOdQUP83NgCv28IDA740NMtERfGvr8js7K0AAOUDAwCu3cJTUwCy4uLW1uz39//5+dgGB/91daYAAP9HRv3j4wCm0LM+PgAfKQCx4NQ8PLW+vtjf37ILC/Dl5cLY2La0tPEFBamxsf8jIwAtOu3s7Lq4uAAQF8DJyQCs2s7Y2JiamrgEBLq/v7GxsQC76b68vMnHx66trj09PgCx3wBCVqAICQB+oJSUlERaX56ioqCgoNj4+ODOzvYaGuDp6QAsN/+yswCr1rC1tYCBgefv7/+ZmSsrK9vo6PeiopiYmOP3+KiurqqpqacDA8TExLS5ufotLZydnQUFBQC26P///wAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0ZFMDQzQzhDQ0Q1MTFFOEJDRDBGNTc0MUMzOThCNjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0ZFMDQzQzdDQ0Q1MTFFOEJDRDBGNTc0MUMzOThCNjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5kaWQ6RDc1NjlEMUVEM0NDRTgxMTlBMzdBMERBMzQyOTdCM0YiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDc1NjlEMUVEM0NDRTgxMTlBMzdBMERBMzQyOTdCM0YiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQFZAD/ACwAAAAAgACAAAAI/wAp7BtIsKDBgwgTKlzIsKHDhxAPUvBHsaLFixgzatzIsaPHjyBDatwnsqTJkyhThhyosqXLlzAxsoxJs6bNjjNv6txJMyfPlys+/Izpc6jKDRiMviyq9GSVGE1bMo0qUsYGqimnYv0oBupWk1q/clSSQ2zJsGYxUujXb2Laj2jfVuzCdpxcj3HlfmDLVujdjXnfauDbT8NfwCQPYzxDmC0UxTITQ6YIrjHfP5MrBv6qxTLhKpn9bcb6x3NjzJNHN0UCxbTlREggqzaaJYdrzzmyKJ7908OI26ZHeDjMe2dp4LdRyy1uc0UT5MibrFguWSw76Nj7sXvLHOYHJtmzM//x+7W7yzHh0/cbI9Z8yg/Z0rNDHz4b+ajuT15PP4KiAvXbUZWfSN+p1w8IFIFgoBL3DTUgSDIY2E9SFWEgoQxNPdhRFlhIONxFHkiIhW4OVqeTbwaisI1GK6BgoHAl/lSZgYm4pREF1kgIzk8aqhWfeiNc9REGv6mXjY029WjRCj0YCAUXGSERG0ZctKZeD9PdpCRFEzSgngYfZqSGkBl58IN6DUygpYkvhZheA2JMqREManCEhBglqBcmUWy2NIF6UJDIURVaeJSFNuqp2VOf76WnRAogFaEASCkokV6WMGlIwX/YKVAnSPKwRUhIanAKnQJISkUSEtvIeRIF92T/50eqHKlB2KcfUUBGdvfQKtI+rYq2qhpMMMrRB2o4UwR2TSgK0n6EBQjSBM9BV4QzanzgKlxMqBFbTlooAKmhHnQxWHhabMvRPox5doaxGCHRWXgadOGBoByloABoFPlkRT9KqLGNjUhQsAIGhCjhZXo/IBgSCOeapoHDIG0TcXYNKEEIBitQICcF26hhqRUW+aQgXwpYQRYKphpIhrqAHYfcH/BehMQ4ErKlAAo59KFByxQLe5GLOZtG5pD/ZmcFhSBtULRpKFxU1K5PE1aCsx69Y4SERjTI0QR5Vs2XH1KbqIfYbI3g9UgzukYG1a6BU3NF7xQpNq79mpgCYQu7/9ZEFURbtnZGGwRuWjMUNXkbCkcf2zdhKFRRrWuPj6uZiX/yVYIWRoSt8z1aOGw4X1hv9AE2yPVAYhaK38bG4Bdl3lgPCYpxT8slGKGF5/2UXpTsbKlp8AQgvIMkBcs2JsZHMUCHxfFsQAfDRzBYhqpFFLwDwgQd+wN872XH3pgzHSExumEdfWApcA1gmJEMj5vGoEcX94MCzBZtTZjvJlpIGPocAQ9hLKcRDMTPM87AF0ay4AzoME0jeyOMEujXmAcKzSLNI0wRfGURuvAFgBqpAnL6ULqNTKAPyOHXRi5mF45QoBmN8crlLtIulNloAlC6iP/YUqiN1AM4KNCDRv8msKKM6GF0lqkHR+bFFgv6gwvO2lRjtBE+i5yJMD2QTAo0UESLJK8fBLyIB01TAhgYqx5KHEkMeGeZFmYkgv0oAka28QPL7aN1bAHhBSmSBcuUxSIRcoYeuLeCCUTsHRo5m9sUeJF39IUjWYCbZ4SYEUfmkXsfmIAetsYei9imMfjyiZsIcwaMJM00jHyia3IQtIxsg1Mj6KJGQLA+z+TwIn10TdQu8sMKlqw6+rAMJS3CRM8gEiNWsoy0NuK0xjQuI9BqjDUqeRsVVkSRhHHjHv1xRcIwcpSeKeFaLKMBTGmEgaYpRCqXVD+23LIi32vMnvhoGZLNkJ6N+UFGTtb/gBh0oQlY8Ms7KbJDvrABXkgYAxsbU4Ix4K9f0fPlRSKkgCb0oAldiMHCWkmRyfGFPDkpKFumh5GTTegjxewHNjoygU8SRgsp7UezOoI6tjQDCvP0h22mk5gdltAfGbzVPf1RQ76kcpRsqAgD+MEPBmCEEP97KAX84BlkUAQZnqkHBykymGb4qo+jskhE+5FTf+SSMEnNW0VG1weN0EemSmWqUy9SzGO6Ug3liiEGPdOMstLzMY/oBjAsAoL+XASFbFmmRWrJlhK4ZSaWJIz7kMmXP/pjqU01q0V2mMZKWmQC/8KCOSmygrESZnkaqUdSMRuNFrAgNl6r5TTFZJlx/82kmd6MUuCMENfMksEiXOALRykSGySwAAGx4cJwK+KBdnb2IiD4gW6+wVSm4g+rbLlfRs7KF37NZIxsaYJG9sIXkl5WrkBdZnwaMFCLdIMTTI3GXMsnA7uxxZqaKS51mfqNjQS1H4NzKVueJzQuCPAyBSRMFzHrVCQ4g2J7a4CvGNCC6laXBSDJAnb5MtqKdCMaFu7GRrZBmGdSpjEoUBNL9CVRjIyRdr2dKxfGccszKfAZCKhuCxjAAPjyowLPaBphCoGRZ1SYqSwA8UP9EbguaAScbBEiS2zVmA5TpJZOjnFFuHDLvZDJuLNgKidETNz9RoPMHgHBwhRQnSQztf8Fg+1GfzkSTLZMMCMrEKbQIsS39orGVARk8EYwQKL3MnUWr8XIh5mK3I9kjs0UAUYFmOoEDFckyPlCWZ+48LgUC20DjxuBryIraosImiMUri4CMJ0RSYt5sB6BghZ0gwQ7VPcbrAYJBexmV+y1jMAsWUE3+1Hqklb2IqfOCI51PNcJwM7WSPaIW3oc30egxKXD3fVn1IoERPGFvfvkC29Njd54sSDM/BhzRfYCO388AsT8aMGS/YGE/fLDDvPmyIZ/yukBqtUfVOaLLOnGFyqSO7MX6Qa6Eb2tZkxWI0g4cjSsrRE3p3u+KKlhryuSZ76MIDGQdaZuB4zsclOEAZP/ZjTMJpCNj7CgunYo8pH5YemWRLQHMMNtPxIx1GE/JiPH0a6WKWJvOHOEHSbGCDB8XAFY++Plb3Z6S4gmD414my1hyonOP56R4D5y6P4QM8U74oG50TvH/DgzyuNbc5eQtx9+RoKphL7NiyW9ev3YEdij0faPGHfsG1m0hXFNET8jO9cZEWE/UIsRnRPQJx1nSxHwV4h+SBjs+bYImJkqdY08I+UTpwgFmGDVjSAhxxhXi5dWqhEYsmXcQ6VIwPvx84xQ1Z7nRbjoPTAlCkyAkZuvboM9wgJ8W+QeSeneRSye+ov867kXgdsPtsWU/yoHIxhImVCSvY9+lIAi2wim/zWDb2GnfgPwIBmHDPJQ7JOn3OTQtYICnFiRoP6AVlPJvkGtTO8xFErQeLUPVTAdMQAOXIANNnJuFlZ+/lBhMRcSwYUFRoAFFXF6C5hZY0I8mlQFbOBQGsEFNeQHfaIVXFAFX+QMZbcRgpYCgvInmkVvsTFzF+hURwZk+aIFiaAGRjBBE+AWLOAEF5hZKaAHajAmGDBwSwJVA/ZT/3YjGAAFppIDWpACqZJsFaEPDmNc8tWAQYheMxd62FcPZEAIZ9AMrKcbwCCDC9h8lbQBibAwGiAG/Bd7pvcOGNAFObAwPeAM7KAbVqh5CphZasiAath2WaAEjMNBXSh8IwECWv/ABkUwAg3QBOPgAYYXGSfBBSkQA/dgBUT2h/QWiF64iDR4gfImGrYxAnmiAc4iWGG3iLrHRzJgBD+gAUzQBRiwcSCRHxMhaIlBfow4iMEYhFtoMB/wAdvgF2mYWbCIcBSwSUrABmIAApm3LvCSBVtVcpk1HaK4hlzYhaXYhVECbcwIi06VAm+DAdkoNevUhPukABMgJ8WFEclmjt8YhOEYhMRVEY/gY+jVjE7FBg+HBCugBvKADHnQBEqADFXAMcrFBHO4TRkxGFbABNZwBm/jB8iADIkABUlRj6R4jzMokgtIEfJlZCMJkP4AVRogAyCgBl1gBGxwBl0wDtqQB4H/kyeKhYnHwhceQAFclgXaswFVsCMgCY4kSYiLSBH2qJL+gDN8kXT7sAKl8Vs4MTd8BnsZcZT4mJTDKI6viJQqOQZV8AFZoAUu0gQYADPjQDZ4YXZUVgIbgCQFk3vzZY/COIpg2ZT2KEtIsAHnUgXvICXvEANGgDfWmGHgwCkagAXIIIbswZUjmZeCuJRh2ZVOiWc/VAJNwARM8AeXyJMh8Q5DqAcY8HsnZ3J4GZKUyZQhmZkQ9wEgsAJm90swIZneSJn5eIGuKZb2qBMPgptKiZSteZkp+ZtrcpuqyZrMuZeviZxJUpseIZxf2ZXFyZchCZzS2RHUqZfWaZnYiZTa/6mcureaxAmez5mdyfkS3VmZ5+mcvqme0Umed9mc3wmfmAmdNRGcy/me96mPxumNsLmf24lq/fmfk4me8Sme6+kS7bmbuamg+SmfBEqfFWGeCFqSAcqAA7ooFtqbGTqcABqeXTme7HmgCeqfvLmhjNihfPKhLOqdKTqi6cmg83mi5WmfM7qiJDqSJuqgKBqhKqqhPeqNP9oSD+qVMkqkNVqiDYqkJsdjUjqlDBAbwEClU2qlWCqlJ7elPBYbXiql1XgS/BmLocEjBboRUFcBLdCmbvqmcBqncjqndFqndtqmnacSDwJ1zdinfvqngMqAmZKmGtENd3qoiJqoimp0gyh6po6KGI8aqVUkqZK6JZS6E5Z6qVqiqZQqEBHxqaAaqqI6qg9BAQEBACH5BAVkAP8ALBAAEQBgAF4AAAj/AP8JHEiwoMGDCBMqUMKmkBIFCSNKnEixosWCKAgha5LDjxYrF0OKHBkShQwjJQQWIaQGJMmXMF820PJnxIhmI/71UCMmZcyfQCUq2aCkiAYUPXJa88AkqNOnAkeoGYdCQ7sdO2416CFDT06oYGFCUZPDyjwFh9BEaPCPjYdEYeOK7LFBm1kSwjrpLcBnhBgMPeQKptglRhMiJOZMmpJkijBhe3Jg6MJ2sGWDPzA4S2OlUwh3GTIEStJpxj9CKTRcXi2wQYwqGsjNEJaERmjRaA5QgYcBRmXWg9lsuJemXOlAt0NbwDHp35kU2YAPVqBG3w8ikwbVTh56ypwvPPR4/5UudyyTUYmncA9Nw0KIRriqpTBCPiyKDfWIwVswycL621N0IkgJ7ABWH1TgsJPDKJZ0ot5/oQUSQid89OFBFwc6JRkyxBCjSAj+QRhaEo3cQEoVE/yQ4U8ljKFFH6PM0EgSIt4WyA2dUEEMBjH4tCJJ92yAzSLlHHADcjVmQEMSgzRHxgRN/TiSAnrIkwMsk6SyXXI0+OCDENxNccAX7WwwnpQhnaHHPZWAosgUYN5GQxQhzDDDGiHoomR7k8CHzwT0oWkRCh74kUMlTYYIphAhoBHGHnxQEc8aPmQA5hSKCLKDDCkEJihFWsiQzRWCvBkamDSEIEgd/bTa6hd5Cv8hhISK1BFJCvJ8OhEUHmjTRxMQgEiDrBn4gAarrrbaABonDKvLFHSYqAUIgeqK0DtijDoDHbXJKmsIcbQqULIkXKCLD+feoBsxHnxgLUIUaHZMBIoc6S0NL8xQRD8EuWpLnujqckMjk/TTBQhcvFsQEtv8wcQVWVrgrawvoPFVv/30EMILL/jQsbpkYrACEgoPxIWQx4BiA5xCfOnlCRYf1A8PM5zAMcc+pHJJP+uAkEXJ/yAxQRd5LILJJIF42fLLM1xc0C0znHIzzgfEc4seK+xTchYysAFJqVN4KTbTEB1Es9QDvHDCAANMoggf0Ezw87v7pFBPJDlAcMHYHXP/fEIIzSDEwxpov5D2CT7YcEM/MKxAwbvvwIDFJjM4EHbfU/+NAkIa27z25wMYYgMVi6Tgrq7xWhMJvVF4PHXaA5wwyRHj8jvQEZOcsHbssSMOgSH9TLNNwp+uUAUbmxiCxw2GG87287Lb8k+yA5WTO9uf6z7ABSaEcQ4GH5CMJgUbIGPKFja4/vz6sTMSQbLi/hNBKruz3fwAPryBCS70DI8mEiDQBxaO8QZG+IB9CGQECeAnLhIYwnm9k4AEJWAIM0jhFhvImpS4oIZCmEIQQ/BB/dj3OUaAgoGtOoQN7jAERJThhckogxzKkAwRQKAO0ADBO35UNz+4QAkOMEQU/6CHvd6tDRCHQGE/ZlADADjxiVAEQA1EkARSsMNxK3pHDJwBiRvkwwdD1J7uxog9B1iCFChcgw6iyEYpmqEX0pjA6epDAQ9AYRgRGMIFojDGPn4ODvkoQw3WgEJSFGCNbYSiDggQhX78AYv1WYEWCgEJ5YnQj1GIAiAcYI4nDrIBDNzBAtZISieWkpQ1yIX32iU+4JAvES7YwhD4qDsJ6C4KmRhCMgCgg15KsQBorN3MOtHLYhqzmLzUgQjc0AB6rGBurAEgIYZxDDe4gY8XuKUbzHFMX9ZgAcGcXquMMQcdlMEc5shHPhwgCTxI4p2ScEA+hiCLUGDwA1pjDQfNB//CKFzAllGAAze7WcwaCGMHBenHERYgCUBI4J8nmCAgAAEHOLihnWYYAi7YsI0drmYfEyDDMIAIBz5qcgg6qAFBC9oJHhjEFjiAA0UrSlNrWrOd8kSpBXZwxcddJgsx8KAX/XkBBySjBipNakp7idRkmGMBniJIOYThBova1KbvxAMeHOCAIQyhDGbQRBw9Oph9YEAbLsijBAJqhpQqNalIlYU58DDRAtAufv8gAR0kcVWbvqGdW80pOnXQyEcSTy5IMB42IHECB/jAAbJA6lLhWgMzOAAOhqCoGxZgC+r9w02SeINWuUpaeUJAnV61gRlouMrwCYZ8yHABKIZwgiH/IPW2uK0sXTPLiJsKoxzw+4clPFGGXCRDFshNLnJrkFzjJqOtbuhH/6AZFhAQohqbgAMLRZDbKVb2Dby15hvG6wZhvC9ZpFgDAZDK3e66l7u9TAcPNrANn4JlA2pwhinigQhztPe2IhCBGfDA2/GKdrx4GIIXkojeAqzXvRDGLQAcUAcs6DAsdauHC6SRDykG2LsikAUEAGEIRhgYD6KFgBkiKwA0wK8EtHgwd2cM4hrPWAS9tAApYgDJp2jRa0ng5YcDLAIbMKLE470EHi5xCRvkYooBJgAwk7WHVtyYyFjOMpG9CwBzaKJ0cwwKOjCguhwgwsNRFnGJMfEGJl9C/8W5yHINCNAKBSQrAtTQsp73jGMA+KAf8vBfUGaxDXBg4QpR4CUBopyLI7OZyRCAgA08wWdqLNBVaxAAlPnMaRE4kQrn8MDIgvKNDeg3AnIAgAgWTQAzrBnSko7zqvfMgVbEgQ+9sEQxFt1pTntil5logDIQBhRfhGMc0KhEJhRNAALYYBKYgLUizNDsWc+a1bPmwBxc0Qpq8Brb4L62uEVAaU/kQob2xFo+X4IOBMgAC5B4RaqbTQBFGCLaEFCEIiZN7377u98cCHiU/03wfpOb3LnIhRfMUYZ84HACZCUJOnoViUrcQYocqDcjGhHpfZtg1fQGebhZXXBxj/zanv9IecJNYIYD5EMOFmBcfWGyAjHc4wpJSHXGD5AKju/7ACYouNCHTvRmp1zluTCBCQ5wAAjcARGaaEIKVvCSeBnhGE1AhBxEIAATpIIO+gZ6LopO9rIT4OgrX7oNFAEBOrgBEQPohz4ELZKGPWwActCBAHKBCbAz3QSeIEDGBy/4whOe8IJfguIFkHHDO77xKS9F2pmu77Y3AhOZQEQY0iCyVlqEAnpAXgQoAQACsIIOdPg74APO+ta73vUEWEIxXLGGNbjCGwIQ/OsHj3alM/0AbEd9IwYxCO1mAhfrkFtIhEaGPsDiFHkXwAFSD/TV7/76rV/CL17BqgbU4RVgWIL/7mHPipR7wffAbzsdGnH5QeAAB6dABCp2oIZtrJsiWRjDqOQtBwF4AQLV5wWegH0EyAECAAZUwEBxEH67V36lgH76JnzDNwipgAOpYACGwAt3gEMpEHES4RZQIA1tcAdbtwQH0Akm4AVeUAoGGHCM94ItCIMwyAH2wGAMZAm7EIMB54Dnd4KKIIHEV4EWaAAGgAMnsAyBQApiAAJ5UBHsIAZKAAs5JwdL4AVAp4KewAo6KINb2IIcsAStsAdK1AxgIIM8uHSd8IPCMIGpIIRFOAlEOAnxpyMeIAYUES/YUAk/8ARyEHtzkIKlwAqsIACEWIiGeIiHyAGxQAsloESk//ALS2CAjMcKpXB+c9AJdLCGxOd+74cDRHiBRGiEd3AC/SAOE3BYCMEw8tAEn+ADQaADS/CApRCIg4iItmiLX/gL+4JCe8CAhEiJlpiGmsiJnviGBgCHcHiM8RcGZbINnmcQ76AHo1IOlCAHX6iCgliLt7iNh2gPJ4RCoLALhSiIlTgHwCcMC0B8nUiE7NiO7HgBqsAL/fAn1FUQdEEGrHgKQVADS8AKXiCI3BiQhxgLv9ALDNQLrRAL41iJJnCJa7gA6+iOxxiH7XgC8ncLMuABKOAjBLECYxCFXxAEVNiP1KCNSyAAJ5mSKLmSKtmSKykAu/ALX8AHrcIHX/AL4v+4ktRQjp3wGOn4fhIZlOyYgXfAB5HgASBwEPvwFm0wCncQBCKgkACZklSJklW5eFh5lYS4C95AC4IgCLTgDQpplYKogg7ZCBBZjEIplCfwBIHQDyhiXwPxAVrAiu4gkorXj1SZl3zZl375l1i5C4K5C3tJkl5wiT35k2u5lgUgh8ugCW0gMgVBPmzQBmnAC0FAALEAmJzZmZxplX8JjA7pCmlZAIsplAUgAcvgDv3gBylACAPhBxggDxoAD0fAhwKwmZ65m7zJmdRADXPgkAsAkaZ5mkFZAPD4ZyggHl/xDhvABBqQBkXwlIrYm9Z5nUtADYc5B62AjoNgmuBpAOH/OZ7iWZ4FUAAnoAqBEAD9wCs7BAUgABtWEQCBgJexcJ/4mZ/6uZ/82Z/+GQvUUAzF0Amt4AquMAi0cJ4KuqAM2qCGEH9xMA8N0AR6MAFIgA0X8gM90Aw80A5PmWorFaIiOqIEFUPpxE4VNUEquqIsKkEnwAuUsJ44YQUZqQVj4AFaoAEK0Aw9MA89cAqUEARCOqREWqRGeqRImqRFSglM+gRO+qRQGqVS+gSrGQDtgBM5oAcYMAHbsAEYkAMloABFUAS3EABxIAWhkKZquqZs2qZu+qZwuqZSMKd0Wqd2eqd0GgrGEABiOgJF4AceIAMI8wceEAM50ANj2gxFEACM/9qojvqokBqpkjqplFqplHoLifoDsqkGhJAwegAFeuABeiADpFqqpnqqqJqqqrqqrNqqrnqqaoABOJoHGCAQFEAISgAFWhADvNqrvvqrvgoDwjqsxFqsYnCsyJqsyioGxdqsxAqs0PqrYkAI92AFMLBuSIAB9/ADGvAD3voDbUAE83AOVmAFGkAE6Jqu6toGGiAK6vqu7JoG76quGnCu85qu7Hqv66oB5WoF3/qv9WoEFqqUFEAB+1Cwj3AN1/AI+7APSMANEBuxEssMJLMKFmux6rAK6qAOzLAP3+ALIBuyIYsE+7CxJnuxFkuxEruyEEuxDXuwBluwMHt/cVELNv8bDMEwC9GgAk4gEN8ABEAbtEErEE5QtNEQDbMQDDbrCALBtCviCI5QCzibs0fbs//ws0DLCVqbAFwLDP+AABUQtmIrtgJRAVzLtVo7tP9gtEg7tVHrtFABtQQxCzpbtU6gtgjACWfLtWLrtWA7tmNbtmK7twnACV4btHfLs0hLt2GBswRRtEBwt1mrt37Lt4BbAX57uWT7D5qbAGbrtXqrtZwgtEUbFkdLEEEruoXbtV9rtpqbuZpbAYLbuV5LuKKrtlDBs6gLBKqrt4VbuYR7tsAbvAkgEMQrvP+wt6F7u14LFUXbvP8gtKmrtX7Lu6J7vdV7vdcrENqrvaB7vdIgCwRhobMEwbNFe77n67Pou77qu77pu7bu+77xi74jERAAOw==';


var $RESOURCE_ALERT_AUDIO = 'data:audio/mpeg;base64,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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq//vkZA4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OKqqqqqqqqqqqqqqqqqqqqqqqqqq';

// ============================================================================

$MAIN$();