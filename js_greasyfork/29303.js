// ==UserScript==
// @id              SCR__SPECIAL_FACEAPP
// @name            Special-FaceApp
// @version         1.2.7
// @namespace       NerV_Scripts
// @author          NerV
// @description     Использование нейросети FaceApp (www.faceapp.com) из браузера.
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @grant           GM_info
// @updareURL       https://greasyfork.org/scripts/29303-special-faceapp/code/Special-FaceApp.user.js
// @include         about:blank?faceapp
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/29303/Special-FaceApp.user.js
// @updateURL https://update.greasyfork.org/scripts/29303/Special-FaceApp.meta.js
// ==/UserScript==



// INTERFACE -------------------------------------------------------------------------------------

var dropZone = null;
var popupWindow = null; var popupWindowTitle = null; var popupWindowBody = null;
var mainForm = null; var fileTabber = null;
var localFile = null; var sourcedFile = null; var linkFile = null;
var sourcedFileLabel = null;
var mainButton = null;
var messageElement = null; var messageTimer = null;
var imagesContainer = null; var imagesItemsContainer = null;


function BuildInterfaceModel ( ) {
	dropZone = document.getElementById('dropZone');
	popupWindow = document.getElementById('popupWindow');
	popupWindowTitle = document.getElementById('popupWindowHeader');
	popupWindowBody = document.getElementById('popupWindowBody');
	mainForm = document.getElementById('mainForm');
	fileTabber = document.getElementById('fileTabber');
	localFile = document.getElementById('localFile');
	sourcedFile = document.getElementById('sourcedFile');
	sourcedFileLabel = document.getElementById('sourcedFileLabel');
	linkFile = document.getElementById('linkFile');
	mainButton = document.getElementById('mainButton');
	messageElement = document.getElementById('messageElement');
	imagesContainer = document.getElementById('imagesContainer');
	imagesItemsContainer = document.getElementById('imagesItemsContainer');
	
	window.onresize = OnWindowResize;
	document.ondragover = OnDragOver;
	document.ondragleave = OnDragLeave;
	document.ondrop = OnDragDrop;
	document.ondragend = OnDragEnd;
	document.onpaste = OnPaste;
	
	dropZone.onclick = (function ( e ) { StopEvent(e); dropZone.style.display = "none"; return false; });
	document.getElementById('popupWindowButtons').onclick = HidePopup;
	mainButton.onclick = OnClick_MainButton;
	document.getElementById('imagesContainerHeader').onclick = OnClick_ImagesContainerButton;
	imagesItemsContainer.onclick = OnClick_ImageButton;
	imagesItemsContainer.ondragstart = StopEvent;
	document.getElementById('sourcedFileClearButton').onclick = OnClick_SourcedFileClearButton;
	document.getElementById('tabberTabsHeaders').onclick = OnClick_Tab;
}


function StopEvent ( objEvent ) { objEvent.stopPropagation(); objEvent.preventDefault(); return false; }


function AddResultImage ( imgData, imgURL, imgFilter, imgCode ) {
	imgFilter = imgFilter.toUpperCase();
	var imgBox = document.createElement('div');
	imgBox.className = 'result_image_box';
	imgBox.innerHTML = resultImageHeaderHTML.replace("$TITLE$", imgFilter);
	var imgElement = document.createElement('img');
	imgElement.onload = OnResultImageComplete;
	imgElement.className = 'result_image_img';
	imgElement.alt = imgFilter;
	imgElement.title = imgFilter;
	imgElement.dataset.url = imgURL;
	imgElement.dataset.filter = imgFilter;
	imgElement.dataset.code = imgCode;
	imgElement.src = imgData;
	imgBox.appendChild(imgElement);
	imagesItemsContainer.appendChild(imgBox);
	imagesItemsContainer.dataset.imagesCount = parseInt(imagesItemsContainer.dataset.imagesCount) + 1;
	imagesContainer.className = 'outer_container images_container_filled';
}

function OnResultImageComplete ( objEvent ) {
	if (this.parentNode.className === 'result_image_box') {
		this.parentNode.style.width = (this.naturalWidth + 6) + "px";
		this.alt = this.alt + " (" + this.naturalWidth + "x" +  this.naturalHeight + ")";
		this.title = this.alt;
	}
} 

function RemoveResultImage ( ptrElement ) {
	if (ptrElement === undefined || ptrElement === null) { return; }
	var imagesCount = parseInt(imagesItemsContainer.dataset.imagesCount);
	if (imagesCount > 1 ) {
		imagesItemsContainer.removeChild(ptrElement);
		imagesItemsContainer.dataset.imagesCount = imagesCount - 1;
	} else { ClearImagesContainer(); }
	
}

function ClearImagesContainer ( ) {
	imagesItemsContainer.innerHTML = "";
	imagesItemsContainer.dataset.imagesCount = 0;
	imagesContainer.className = 'outer_container images_container_empty';
}


function ChangeMainButtonState ( newState ) {
	if (newState === undefined) { newState = !(parseInt(mainButton.dataset.inProcessing) === 1); }
	if (newState) {
		mainButton.dataset.inProcessing = 1;
		mainButton.innerHTML = "Отмена";
	} else {
		mainButton.dataset.inProcessing = 0;
		mainButton.innerHTML = "Запуск";
	}
}


function ShowSourcedFileBox ( sourceType, changeTab ) {
	if (sourceType === undefined) { sourceType = typeFileSource; }
	switch (sourceType) {
		case 0: sourcedFileLabel.innerHTML = "[ SELECTED FILE ]"; break;
		case 1: sourcedFileLabel.innerHTML = "[ DRAG&DROP FILE ]"; break;
		case 2: sourcedFileLabel.innerHTML = "[ CLIPBOARD FILE ]"; break;
		case 3: sourcedFileLabel.innerHTML = "[ LINK FILE ]"; break;
		case 4: sourcedFileLabel.innerHTML = "[ RESULT IMAGE ]"; break;
		case 5: sourcedFileLabel.innerHTML = "[ BASE64 FILE ]"; break;
		default: sourcedFileLabel.innerHTML = "[ UNKNOWN ]"; break;
	}
	sourcedFile.title = ORIGINAL_FILE.name;
	localFile.style.display = "none";
	sourcedFile.style.display = "block";
	if (changeTab) { OnClick_Tab(1); }
}


function ShowPopup ( winTitle, bodyHTML, onSuccess, onCancel ) {
	window["_callbackPopupOnSuccess"] = onSuccess || function () {};
	window["_callbackPopupOnCancel"] = onCancel || function () {};
	popupWindowTitle.innerHTML = winTitle;
	popupWindowBody.innerHTML = bodyHTML;
	popupWindow.style.display = "block";
	if (popupWindow.offsetWidth < window.innerWidth - 10) { popupWindow.style.left = (Math.round(window.innerWidth / 2) - Math.round(popupWindow.offsetWidth) / 2) + "px"; }
	if (popupWindow.offsetHeight < window.innerHeight - 10) { popupWindow.style.top = (Math.round(window.innerHeight / 2) - Math.round(popupWindow.offsetHeight) / 2) + "px"; }
	popupWindow.style.visibility = "visible";
}

function HidePopup ( objEvent ) {
	if (objEvent.target.id === 'popupWindowButtons') { return StopEvent(objEvent); }
	popupWindow.style.visibility = "hidden";
	popupWindow.style.display = "none";
	if (objEvent.target.id === 'popupWindowOkBtn') { window["_callbackPopupOnSuccess"](true); } else { window["_callbackPopupOnCancel"](false); }
	window["_callbackPopupOnSuccess"] = null; window["_callbackPopupOnCancel"] = null;
	return StopEvent(objEvent);
}


function ShowMessage ( messageText, isErrorType, showTime ) {
	if (messageText === "") { HideMessage(); return; }
	messageElement.innerHTML = messageText;
	if (isErrorType !== undefined && isErrorType) { messageElement.className = "error_message"; } else  { messageElement.className = "info_message"; }
	if (showTime !== undefined) {
		if (messageTimer !== null) { clearTimeout(messageTimer); messageTimer = null; }
		messageTimer = setTimeout(HideMessage, showTime);
	}
}

function HideMessage ( ) {
	messageElement.className = "olded_message";
	clearTimeout(messageTimer); messageTimer = null;
}


function OnWindowResize ( objEvent ) {
	dropZone.style.height = window.innerHeight;
	dropZone.style.paddingTop = (Math.ceil(window.innerHeight / 2) - 16) + "px";
	popupWindow.style.maxHeight = (window.innerHeight - 5) + "px";
	if (popupWindow.style.display === "block") {
		if (popupWindow.offsetWidth < window.innerWidth - 10) { popupWindow.style.left = (Math.round(window.innerWidth / 2) - Math.round(popupWindow.offsetWidth) / 2) + "px"; }
		if (popupWindow.offsetHeight < window.innerHeight - 10) { popupWindow.style.top = (Math.round(window.innerHeight / 2) - Math.round(popupWindow.offsetHeight) / 2) + "px"; }
	}
}


function OnClick_MainButton ( objEvent ) {
	if (parseInt(mainButton.dataset.inProcessing) === 0) {
		if (parseInt(fileTabber.dataset.selectedTab) === 1) {
			if (typeFileSource === 0) {
				if (localFile.files.length === 0) { ShowMessage("ERROR: Не выбран файл изображения.", true, 5000); return true; }
			} else {
				if (ORIGINAL_FILE === null) {
					OnClick_SourcedFileClearButton();
					ShowMessage("ERROR: Не выбран файл изображения.", true, 5000);
					return true;
				}
			}
		} else {
			if (linkFile.value === "") { ShowMessage("ERROR: Не указан URL изображения.", true, 5000); return true; }
		}
		var i = 0; 
		for (; i < mainForm.filterItem.length; i++) { if (mainForm.filterItem[i].checked) break;  }
		if (i === mainForm.filterItem.length) { ShowMessage("ERROR: Не выбраны желаемые фильтры.", true, 5000); return true; }
		if (StartProcess()) { ChangeMainButtonState(); }
	} else {
		AbortRequests();
	}
	return true;
}


function OnClick_ImagesContainerButton ( objEvent ) {
	if (objEvent.target.className.indexOf('images_container_button') === -1) { return StopEvent(objEvent); }
	var btnElement = objEvent.target;
	switch (btnElement.dataset.action) {
		case "clear": ClearImagesContainer(); break;
		case "combine": 
					if (parseInt(imagesItemsContainer.dataset.imagesCount) < 2) { return StopEvent(objEvent); }
					ShowPopup("Настройки склейки", combineSettingsFormHTML, GetCombineResultsSettings);
				break;
		default: break;
	}
	return StopEvent(objEvent);
}

function OnClick_ImageButton ( objEvent ) {
	if (objEvent.target.className.indexOf('result_image_button') === -1) { return StopEvent(objEvent); }
	var btnElement = objEvent.target;
	switch (btnElement.dataset.action) {
		case "remove": RemoveResultImage(btnElement.parentNode.parentNode.parentNode); break;
		case "select": 
				var imageElement = btnElement.parentNode.parentNode.parentNode.getElementsByTagName('img')[0];
				if (reBase64Data.test(imageElement.src)) {
					var b64File = Base64DataToFile(imageElement.src, "ResultImage_" + imageElement.dataset.filter + ".jpg", "image/jpeg");
					if (b64File === null) { ShowMessage("ERROR: Не удалось сформировать файл для отправки.", true, 5000); return StopEvent(objEvent); }
					ORIGINAL_FILE = b64File;  typeFileSource = 4; ShowSourcedFileBox(4, true);
					ShowMessage("Сформирован файл для отправки.", false, 3000);
				} else {
					linkFile.value = imageElement.src; OnClick_Tab(2);
					ShowMessage("Получена ссылка на изображение.", false, 3000);
				}
				break;
		case "share": ShowMessage("Функция ещё не реализована.", false, 3000); break;
		default: break;
	}
	return StopEvent(objEvent);
}


function OnDragOver ( objEvent ) { dropZone.style.display = "block"; objEvent.preventDefault(); return false; }
function OnDragLeave ( objEvent ) { dropZone.style.display = "none"; objEvent.preventDefault(); return false; }

function OnDragDrop ( objEvent ) {
	dropZone.style.display = "none";
	var dFile = GetTransferFile(objEvent.dataTransfer);
	if (dFile === null) { return true; } else 
	if (dFile === "") { return false; }
	ShowMessage("Получен файл изображения: " + dFile.name, false, 3000);
	ORIGINAL_FILE = dFile; typeFileSource = 1; ShowSourcedFileBox(1, true);
	
	objEvent.preventDefault();
	return false;
}

function OnDragEnd ( objEvent ) {
	var dtInt = objEvent.dataTransfer;
	if (dtInt.items) { for (var i = 0; i < dtInt.items.length; i++) { dtInt.items.remove(i); } } else { dtInt.clearData(); }
	objEvent.preventDefault();
	return false;
}


function OnPaste ( objEvent ) {
	var cbFile = GetTransferFile((objEvent.clipboardData || objEvent.originalEvent.clipboardData));
	if (cbFile === null) { return true; }  else 
	if (cbFile === "") { return false; }
	ShowMessage("Получен файл изображения: " + cbFile.name, false, 3000);
	ORIGINAL_FILE = cbFile; typeFileSource = 2; ShowSourcedFileBox(2, true);
	
	objEvent.preventDefault();
	return false;
}


function OnClick_Tab ( objEvent ) {
	var tabberTabs = null; var i = 0;
	if (typeof(objEvent) !== 'number') {
		if (objEvent.target.id === 'tabberTabsHeaders') { return true; }
		if (objEvent.target.dataset.tabNumber == fileTabber.dataset.selectedTab) { return true; }
		tabberTabs = fileTabber.getElementsByClassName('tab_header');
		if (tabberTabs === null || tabberTabs.length === 0) { return false; }
	} else {
		if (fileTabber.dataset.selectedTab == objEvent) { return true; }
		tabberTabs = fileTabber.getElementsByClassName('tab_header');
		if (tabberTabs === null || tabberTabs.length === 0) { return false; }
		objEvent = { target: tabberTabs[parseInt(objEvent) - 1] };
	}
	
	var selectedTab = tabberTabs[parseInt(fileTabber.dataset.selectedTab) - 1];
	selectedTab.className = 'tab_header';
	document.getElementById('fileTabber_Tab_' + selectedTab.dataset.tabNumber).style.display = "none";
	selectedTab = objEvent.target;
	selectedTab.className = 'tab_header selected_tab';
	document.getElementById('fileTabber_Tab_' + selectedTab.dataset.tabNumber).style.display = "table-row";
	fileTabber.dataset.selectedTab = selectedTab.dataset.tabNumber;
	return false;
}

function OnClick_SourcedFileClearButton ( objEvent ) {
	sourcedFile.style.display = "none";
	localFile.style.display = "inline-block";
	sourcedFileLabel.innerHTML = "[ UNKNOWN ]";
	sourcedFileLabel.title = "NO FILE";
	ORIGINAL_FILE = null; typeFileSource = 0;
	return false;
}


// LOGIC -------------------------------------------------------------------------------------------

var FILTERS = null;
var DEVICE_ID = "";
var ORIGINAL_FILE = null;

var typeFileSource = 0;   // 0 - input; 1 - drag&drop; 2 - clipboard; 3 - link; 4 - result image; 5 - file from base64
var oldLink = "";
var resultsCount = 0;

var transferLinksCount = 0;
var transferLinksArray = null;

var xhrHeaders = { 'User-Agent': "FaceApp/1.0.229 (Linux; Android 4.4)" };
var xhrPointers = null;

var reImgTypeHeader = /Content-Type:\simage\/([a-z\.\-\+]+)\b/i;
var reFileName = /[^:<>"'?\/\*\+\|\\]+\.[^:<>"'?\/\*\+\|\\]{3,5}$/i;
var reImgTypeLink = /\.(jpe?g|png|gif|bmp)/i;
var reLinkFileName = /\/(.+\..{3,5})$/i;
var reCode = /\/photos\/(.*?)\//i;
var reFilter = /\/filters\/(.*?)\?/i;
var reBase64Data = /^data:(.*?);base64,/i;



function GenerateDeviceID ( ) {
	DEVICE_ID = "";
	var idLength = Math.floor(Math.random() * 24) + 8;
	var strLitters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
	for (var i = 0; i < idLength; i++) { DEVICE_ID += strLitters.charAt(Math.floor(Math.random() * 53)); }
	ShowMessage("Текущий DEVICE_ID: " + DEVICE_ID, false, 3000);
}


function GetTransferFile ( dtInt ) {
	var dFile = null;
	var i = 0; var l = dtInt.items.length;
	if (dtInt.items) {
		for (i = 0; i < l; i++) {
			if (dtInt.items[i].kind === "file" || dtInt.items[i].type === "application/x-moz-file") {
				dFile = dtInt.items[i].getAsFile();
				if (dFile.type.indexOf("image") !== -1) break;
				dFile = null;
			}
		}
		if (dFile === null) {
			var objURLS = { 'application/x-moz-file-promise-url': [], 'text/x-moz-url': [] };
			for (i = 0; i < l; i++) {
				if (dtInt.items[i].type === "application/x-moz-file-promise-url") {
					objURLS['application/x-moz-file-promise-url'].push(dtInt.items[i]);
				} else if (dtInt.items[i].type === "text/x-moz-url") {
					objURLS['text/x-moz-url'].push(dtInt.items[i]);
				}
			}
			if (objURLS['application/x-moz-file-promise-url'].length !== 0) {
				transferLinksCount = objURLS['application/x-moz-file-promise-url'].length; transferLinksArray = [];
				objURLS['application/x-moz-file-promise-url'].forEach(function (aItem, aIndex, aPtr) { aItem.getAsString(GetTransferLink); });
				dFile = "";
			} else 
			if (objURLS['text/x-moz-url'].length !== 0) {
				transferLinksCount = objURLS['text/x-moz-url'].length; transferLinksArray = [];
				objURLS['text/x-moz-url'].forEach(function (aItem, aIndex, aPtr) { aItem.getAsString(GetTransferLink); });
				dFile = "";
			}
		}
	} else {
		for (i = 0; i < l; i++) {
			if (dtInt.files[i].type.indexOf("image") !== -1) { dFile = dtInt.files[i]; }
		}
	}
	return dFile;
}

function GetTransferLink ( urlString ) {
	if (transferLinksArray.indexOf(urlString) == -1) { transferLinksArray.push(urlString); }
	if (transferLinksCount == 1) {
		for (var i = 0; i < transferLinksArray.length; i++) {
			if (reImgTypeLink.test(transferLinksArray[i]) || reBase64Data.test(transferLinksArray[i])) {
				linkFile.value = transferLinksArray[i];
				ShowMessage("Получена ссылка на изображение.", false, 3000);
				OnClick_Tab(2); break;
			}
		}
	}
	transferLinksCount--;
}


function Base64DataToFile ( b64Data, fileName, fileType ) {
	if (b64Data === undefined || b64Data === "") { return null; }
	if (reBase64Data.test(b64Data)) {
		if (fileType === undefined) { fileType = reBase64Data.exec(b64Data)[1]; }
		b64Data = b64Data.replace(reBase64Data, "");
	}
	if (fileName === undefined) {
		fileName = fileType.substring(fileType.indexOf("/") + 1);
		fileName = "USFA_Base64DataFile." + fileName;
		if (!reFileName.test(fileName)) { fileName = "USFA_Base64DataFile.b64f"; }
	}
	try { b64Data = atob(b64Data); } catch (e) { return null; }  // base64 string -> byte string
	var byteArray = new Array(b64Data.length);
	for (var i = 0; i < b64Data.length; i++) { byteArray[i] = b64Data.charCodeAt(i); }
	return new File([(new Uint8Array(byteArray))], fileName, {type: fileType});
}


function ShowOriginalFile ( ) {
	if (!mainForm.showOriginal.checked) { return; }
	var fileReader  = new FileReader();
	fileReader.onloadend = function ( ) {
		if (this.error) { 
		ShowMessage("ERROR: Не удалось загрузить оригинал.", true, 5000); return; }
		AddResultImage(this.result, "$", "original", "-");
	};
	fileReader.readAsDataURL(ORIGINAL_FILE);
}


function StartProcess () {
	if (parseInt(fileTabber.dataset.selectedTab) === 1) {
		if (ORIGINAL_FILE === null) {
			if (localFile.files[0].type.indexOf("image")) { ShowMessage("ERROR: Выбранный файл не является изображением.", true, 5000); return false; }
			ORIGINAL_FILE = localFile.files[0];
		} else {
			if (typeFileSource === 0 && ORIGINAL_FILE.name !== localFile.files[0].name) {
				ORIGINAL_FILE = localFile.files[0]; 
			}
		}
		UploadImageFile(ORIGINAL_FILE);
	} else {
		if (linkFile.value === oldLink && typeFileSource == 3 && ORIGINAL_FILE !== null) {
			UploadImageFile(ORIGINAL_FILE);
		} else {
			if (!reBase64Data.test(linkFile.value)) {
				LoadLinkedImage(linkFile.value);
			} else {
				if (reBase64Data.exec(linkFile.value)[1].indexOf("image") !== 0) { ShowMessage("ERROR: Указанный тип base64 данных не является изображением.", true, 5000); return false;}
				var b64File = Base64DataToFile(linkFile.value);
				if (b64File === null) { ShowMessage("ERROR: Не удалось сформировать файл из base64-строки.", true, 5000); return false; }
				ORIGINAL_FILE = b64File; oldLink = linkFile.value; 
				typeFileSource = 5; oldLink = linkFile.value;
				ShowSourcedFileBox(5, false);
				UploadImageFile(ORIGINAL_FILE);
			}
		}
	}
	return true;
}


function LoadLinkedImage ( reqURL ) {
	xhrPointers = GM_xmlhttpRequest({
		url: reqURL,
		method: "GET",
		// headers: xhrHeaders,
		responseType: "arraybuffer",
		onload: OnLoadLinkedImage,
		onerror: OnRequestError,
		onabort: OnRequestAbort
	});
	ShowMessage("Получение изображения...");
}

function OnLoadLinkedImage ( objResponse ) {
	var imgType = "";
	if (reImgTypeHeader.test(objResponse.responseHeaders)) {
		imgType = reImgTypeHeader.exec(objResponse.responseHeaders)[1];
	} else {
		if (reImgTypeLink.test(objResponse.finalUrl)) {
			imgType = reImgTypeLink.exec(objResponse.finalUrl)[1];
			imgType = imgType.replace("jpg", "jpeg");
		} else {
			ShowMessage("ERROR: Не удалось определить тип файла.", true, 5000);
			ClearData(false); return;
		}
	}
	var fileName = "USFA_LinkedImageFile." + imgType;
	var splitedLink = objResponse.finalUrl.split("?");
	splitedLink[0] = decodeURIComponent(splitedLink[0]);
	if (reFileName.test(splitedLink[0])) {
		fileName = reFileName.exec(splitedLink[0]);
	} else {
		if (splitedLink.length !== 0) {
			splitedLink = splitedLink[1].split(/&?.+?=/);
			for (var i = 0; i < splitedLink.length; i++) {
				if (reFileName.test(decodeURIComponent(splitedLink[i])))
					{ fileName = reFileName.exec(splitedLink[0])[1]; break; }
			}
		}
	}
	ORIGINAL_FILE = new File([objResponse.response], fileName, {type: "image/" + imgType});
	typeFileSource = 3; oldLink = objResponse.finalUrl;
	ShowSourcedFileBox(3, false);
	UploadImageFile(ORIGINAL_FILE);
}


function UploadImageFile ( ptrFile ) {
	if (ptrFile === undefined || ptrFile === null) { ShowMessage("ERROR: Некорректные данные для отправки.", true, 5000); return; }
	
	if (mainForm.removeOldResults.checked) { ClearImagesContainer(); }
	if (mainForm.newDeviceId.checked) { GenerateDeviceID(); }
	FILTERS = []; resultsCount = 0;
	for (var i = 0; i < mainForm.filterItem.length; i++)
		{ if (mainForm.filterItem[i].checked) { FILTERS.push(mainForm.filterItem[i].value); } }
	
	var imageData = new FormData();
	xhrHeaders['X-FaceApp-DeviceID'] = DEVICE_ID;
	imageData.append("file", ptrFile);
	xhrPointers = GM_xmlhttpRequest({
			url: "https://node-01.faceapp.io/api/v2.3/photos",
			method: "POST",
			headers: xhrHeaders,
			data: imageData,
			responseType: "json",
			onload: OnUploadImage,
			onerror: OnRequestError,
			onabort: OnRequestAbort
		});
	ShowMessage("Отправка файла...");
	if (mainForm.showOriginal.checked) { ShowOriginalFile(); }
}

function OnUploadImage ( objResponse ) {
	var respJSON = objResponse.response;
	if (respJSON["err"] !== undefined) {
		ShowMessage("ERROR: " + respJSON["err"]["code"] + ".   DESCRIPTION: " + respJSON["err"]["desc"], true, 5000); 
		ClearData(false); return; 
	}
	xhrPointers = { xhrCount: 0 };
	for (i = 0; i < FILTERS.length; i++) {
		xhrPointers[FILTERS[i]] = GM_xmlhttpRequest({
				url: "https://node-01.faceapp.io/api/v2.3/photos/" + respJSON["code"] + "/filters/" + FILTERS[i] + 
							"?cropped=" + ((mainForm.croppedImage.checked)? "1" : "0"),
				method: "GET",
				headers: xhrHeaders,
				responseType: "arraybuffer",
				onload: OnLoadResultImage,
				onerror: OnRequestError,
				onabort: OnRequestAbort
			});
		xhrPointers.xhrCount += 1;
	}
	ShowMessage("Загрузка результатов...");
}

function OnLoadResultImage ( objResponse ) {
	if (objResponse.responseHeaders.indexOf("X-FaceApp-ErrorCode") !== -1) { OnRequestError(objResponse); return; }
	
	var filterName = ((reFilter.test(objResponse.finalUrl))? reFilter.exec(objResponse.finalUrl)[1] : "UNKNOWN");
	var imageCode = ((reCode.test(objResponse.finalUrl))? reCode.exec(objResponse.finalUrl)[1] : "-");
	var rawString = String.fromCharCode.apply(null, (new Uint8Array(objResponse.response)));
	AddResultImage("data:image/jpeg;base64," +  btoa(rawString), objResponse.finalUrl, filterName, imageCode);
	resultsCount++; xhrPointers.xhrCount--;
	if (xhrPointers.xhrCount === 0) { ClearData(false); ShowMessage("Результаты загружены. Количество: " + resultsCount, false, 3000); }
}


function GetCombineResultsSettings ( ) {
	var settingsForm = document.getElementById('combineSettingsForm');
	CombineResultsImages({
		formType: parseInt(settingsForm.formType.value),
		columsCount: parseInt(settingsForm.columsCount.value),
		scaleSize: ((settingsForm.isNeedScale.checked)? parseInt(settingsForm.scaleSize.value) : 0),
		bgColor: settingsForm.bgColor.value,
		fontColor: settingsForm.txtColor.value,
		fontSize: 14,
		isAddOriginal: settingsForm.isAddOriginal.checked,
		isRemoveOld: settingsForm.isRemoveOld.checked
	});
}

function CombineResultsImages ( objSettings ) {
	var allImages = document.getElementsByClassName('result_image_img');
	if (allImages === null || allImages.length < 2) {  ShowMessage("ERROR: Недостаточно изображений для объединения.", true, 5000); return; }
	var combineImages = []; var imgCount = 0;
	var imgIndex = 0;
	var xSize = 0; var ySize = 0;
	var maxWidth = 0; var maxHeight = 0;
	var iModifier = 0;
	for (; imgIndex < allImages.length; imgIndex++) {
		if (allImages[imgIndex].dataset.filter === "COMBINED") { continue; }
		if (allImages[imgIndex].dataset.filter === "ORIGINAL" && !objSettings.isAddOriginal) { continue; }
		xSize = allImages[imgIndex].naturalWidth;
		ySize = allImages[imgIndex].naturalHeight;
		if (objSettings.scaleSize !== 0) {
			if (xSize > ySize) {
				if (xSize > objSettings.scaleSize) {
					iModifier = objSettings.scaleSize / xSize;
					xSize = objSettings.scaleSize;
					ySize = Math.floor(ySize * iModifier);
				}
			} else
			if (xSize < ySize) {
				if (ySize > objSettings.scaleSize) {
					iModifier = objSettings.scaleSize / ySize;
					ySize = objSettings.scaleSize;
					xSize = Math.floor(xSize * iModifier);
				}
			} else {
				if (xSize > objSettings.scaleSize) {
					xSize = objSettings.scaleSize;
					ySize = objSettings.scaleSize;
				}
			}
		}
		combineImages.push({ img: allImages[imgIndex], width: xSize, height: ySize });
		if (xSize > maxWidth) { maxWidth = xSize; }
		if (ySize > maxHeight) { maxHeight = ySize; }
		imgCount++;
	}
	if (imgCount < 2) {  ShowMessage("ERROR: Недостаточно изображений для объединения.", true, 5000); return; }
	
	if (objSettings.formType === 3) {
		if (objSettings.columsCount >= imgCount) { objSettings.formType = 1; } else
		if (objSettings.columsCount === 1) { objSettings.formType = 2; } else
		if (objSettings.columsCount === 0) {
			for (imgIndex = 2; imgIndex < imgCount; imgIndex++) {
				iModifier = imgCount / imgIndex;
				if (iModifier < imgIndex + 1) {
					if (iModifier == imgIndex) break;
					if (iModifier - Math.floor(iModifier) >= 0.5) break;
				}
			}
			objSettings.columsCount = imgIndex;
		}
	}
	
	switch (objSettings.formType) {
		case 1: 
				for (xSize = 0, imgIndex = 0; imgIndex < imgCount; imgIndex++) { xSize += combineImages[imgIndex].width; }
				xSize = xSize + (2 * (imgCount - 1));
				ySize = maxHeight + objSettings.fontSize + 4;
			break;
		case 2:
				for (ySize = 0, imgIndex = 0; imgIndex < imgCount; imgIndex++) { ySize += combineImages[imgIndex].height; }
				xSize = maxWidth;
				ySize = ySize + ((objSettings.fontSize + 4) * imgCount);
			break;
		case 3: 
				xSize = (maxWidth * objSettings.columsCount) + (2 * (objSettings.columsCount - 1));
				ySize = (maxHeight + objSettings.fontSize + 4) * Math.ceil(imgCount / objSettings.columsCount);
			break;
	}
	
	var canvasElement = document.createElement('canvas');
	canvasElement.width = xSize;
	canvasElement.height = ySize;
	var canvasContext = canvasElement.getContext('2d');
	canvasContext.fillStyle = objSettings.bgColor;
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);
	canvasContext.font = "normal normal 900 " + objSettings.fontSize + "px 'Courier New', monospace";
	canvasContext.fillStyle = objSettings.fontColor;
	canvasContext.textBaseline = "middle"; canvasContext.textAlign = "center"; 
	
	var xCoord = 0; var yCoord = 0;
	var xShift = 0; var yShift = 0;
	xSize = Math.floor(maxWidth / 2);
	ySize = Math.floor(objSettings.fontSize / 2) + 2;
	iModifier = objSettings.fontSize + 4;
	switch (objSettings.formType) {
		case 1:
				yCoord = iModifier;
				for (imgIndex = 0; imgIndex < imgCount; imgIndex++) {
					canvasContext.fillText(combineImages[imgIndex].img.dataset.filter, xCoord + Math.floor(combineImages[imgIndex].width / 2), ySize, combineImages[imgIndex].width);
					if (combineImages[imgIndex].height < maxHeight) { yShift = Math.floor((maxHeight - combineImages[imgIndex].height) / 2); }
					canvasContext.drawImage(combineImages[imgIndex].img, xCoord, yCoord + yShift, combineImages[imgIndex].width, combineImages[imgIndex].height);
					xCoord += combineImages[imgIndex].width + 2; yShift = 0;
				}
			break;
		case 2: 
				for (imgIndex = 0; imgIndex < imgCount; imgIndex++) {
					canvasContext.fillText(combineImages[imgIndex].img.dataset.filter, xCoord + xSize, yCoord + ySize, maxWidth); yCoord += iModifier;
					if (combineImages[imgIndex].width < maxWidth) { xShift = Math.floor((maxWidth - combineImages[imgIndex].width) / 2); }
					canvasContext.drawImage(combineImages[imgIndex].img, xShift, yCoord, combineImages[imgIndex].width, combineImages[imgIndex].height);
					yCoord += combineImages[imgIndex].height; xShift = 0;
				}
			break;
		case 3:
				imgIndex = 0; var l = 0; var c = 0;
				var lc = Math.floor(imgCount / objSettings.columsCount);
				for (l = 0; l < lc; l++) {
					xCoord = 0; yCoord = (maxHeight + iModifier) * l;
					for (c = 0; c < objSettings.columsCount; c++) {
						canvasContext.fillText(combineImages[imgIndex].img.dataset.filter, xCoord + xSize, yCoord + ySize, maxWidth);
						if (combineImages[imgIndex].width < maxWidth) { xShift = Math.floor((maxWidth - combineImages[imgIndex].width) / 2); }
						if (combineImages[imgIndex].height < maxHeight) { yShift = Math.floor((maxHeight - combineImages[imgIndex].height) / 2); }
						canvasContext.drawImage(combineImages[imgIndex].img, xCoord + xShift, yCoord + yShift + iModifier, combineImages[imgIndex].width, combineImages[imgIndex].height);
						xCoord += maxWidth + 2; xShift = 0; yShift = 0; imgIndex++;
					}
				}
				xCoord = Math.floor(canvasElement.width / 2) - Math.floor((maxWidth * (imgCount % objSettings.columsCount)) / 2);
				yCoord = (maxHeight + iModifier) * lc;
				for (; imgIndex < imgCount; imgIndex++) {
					canvasContext.fillText(combineImages[imgIndex].img.dataset.filter, xCoord + xSize, yCoord + ySize, maxWidth);
					if (combineImages[imgIndex].width < maxWidth) { xShift = Math.floor((maxWidth - combineImages[imgIndex].width) / 2); }
					if (combineImages[imgIndex].height < maxHeight) { yShift = Math.floor((maxHeight - combineImages[imgIndex].height) / 2); }
					canvasContext.drawImage(combineImages[imgIndex].img, xCoord + xShift, yCoord + yShift + iModifier, combineImages[imgIndex].width, combineImages[imgIndex].height);
					xCoord += maxWidth + 2; xShift = 0; yShift = 0;
				}
			break;
	}
	if (objSettings.isRemoveOld) { ClearImagesContainer();	}
	AddResultImage(canvasElement.toDataURL(), "$", "combined", "-");
}


function OnRequestError ( objResponse ) {
	ShowMessage("ERROR: REQ_ERROR_" + objResponse.status + ".   DESCRIPTION: " + objResponse.statusText, true, 5000);
	if (xhrPointers.xhrCount !== undefined) {
		var filterName = ((reFilter.test(objResponse.finalUrl))? filterName = reFilter.exec(objResponse.finalUrl)[1] : "UNKNOWN");
		if (xhrPointers[filterName] !== undefined) {xhrPointers[filterName] = undefined; }
		xhrPointers.xhrCount--; if (xhrPointers.xhrCount === 0) { ClearData(false); }
	}
}

function OnRequestAbort ( objResponse ) {
	ShowMessage("REQUEST ABORTED", false, 3000);
}


function AbortRequests ( ) {
	if (xhrPointers === null) { return; }
	if (xhrPointers.xhrCount === undefined) {
		try { xhrPointers.abort(); } catch(e) { }
	} else {
		var xhrItem = null;
		for (xhrItem in xhrPointers) {
			if (xhrPointers.hasOwnProperty(xhrItem) && xhrItem !== "xhrCount" && xhrPointers[xhrItem] !== undefined ) {
				try { xhrPointers[xhrItem].abort(); } catch(e) { }
			}
		}
	}
	ClearData(false);
}

function ClearData ( ) {
	if (xhrPointers !== null) {
		var xhrItem = null;
		if (xhrPointers.xhrCount !== undefined) {
			for (xhrItem in xhrPointers) {
				if (xhrPointers.hasOwnProperty(xhrItem) ) {
					delete xhrPointers[xhrItem]; xhrPointers[xhrItem] = undefined;
				}
			}
		}
		xhrPointers = null;
	}
	FILTERS = null;
	ChangeMainButtonState(false);
}



// MAIN --------------------------------------------------------------------------------------------

var resultImageHeaderHTML = "" +
	"<div class='result_image_header'>" +
		"<div class='result_image_title title_text'>$TITLE$</div>" +
		"<div class='result_image_buttons'>" +
			"<div class='action_button result_image_button' data-action='select' title='Выбрать для отправки'>#</div>" +
			// "<div class='action_button result_image_button' data-action='share' title='Поделиться'>@</div>" +
			"<div class='action_button result_image_button' data-action='remove' title='Удалить'>x</div>" +
		"</div>" +
	"</div>";

var combineSettingsFormHTML = "" +
	"<form id='combineSettingsForm' action='/' method='POST' enctype='multipart/form-data'>" +
		"Вид: <select name='formType' form='combineSettingsForm' onchange='document.getElementById(\"ctccc\").style.visibility = ((this.value === \"3\")? \"visible\" : \"hidden\"); return true;'>" +
			"<option value=1 selected>Горизонтальная линия</option>" +
			"<option value=2>Вертикальная линия</option>" +
			"<option value=3>Плитка</option>" +
		"<select>" +
		"<span id='ctccc' style='visibility: hidden;'>&nbsp;&nbsp;&nbsp;Колонок <input type='number' name='columsCount' min=0 value=2></span><br>" +
		"<input name='isNeedScale' type='checkbox' class='first_cb' id='cb_csi' checked onclick='document.getElementById(\"combineScaleSize\").disabled = !this.checked; return true;'>" +
			"<label for='cb_csi'>Масштабировать изображения если сторона больше</label> <input type='number' name='scaleSize' id='combineScaleSize' value=400> пикселей<br>" +
		"Цвет фона: <input type='color' name='bgColor' value='#FFFFFF'>&nbsp;&nbsp;&nbsp;" +
		"Цвет текста: <input type='color' name='txtColor' value='#000000'><br>" +
		"<input name='isAddOriginal' type='checkbox' class='first_cb' id='cb_croi'><label for='cb_croi'>Включить оригинал</label>" +
		"<input name='isRemoveOld' type='checkbox' id='cb_croi' checked><label for='cb_croi'>Удалить склеенные изображения</label>" +
	"</form>";


((function () {
	// HTML ---
	document.body.innerHTML = 
		"<center>" +
			"<div id='dropZone' class='title_text' style='display: none;'>Drop Zone</div>" +
			"<div id='popupWindow' style='visibility: hidden; display: none; max-height: " + (window.innerHeight - 10) + "px;'>" +
				"<div id='popupWindowHeader' class='title_text'>&nbsp;</div>" +
				"<div id='popupWindowBody'>&nbsp;</div>" +
				"<div id='popupWindowButtons'>" +
					"<button id='popupWindowOkBtn'>ОК</button>" +
					"<button id='popupWindowCancelBtn'>Отмена</button>" +
				"</div>" +
			"</div>" +
			"<div id='formContainer' class='outer_container'>" +
				"<form id='mainForm' action='/' method='POST' enctype='multipart/form-data'>" +
					"<table id='fileTabber' class='tabber' data-selected-tab=1>" +
						"<tr id='tabberTabsHeaders' class='title_text'>" +
							"<td class='tab_header selected_tab' style='border-right: none;' data-tab-number=1>&nbsp;Файл&nbsp;</td>" +
							"<td class='tab_header' style='border-left: none;' data-tab-number=2>Ссылка</td>" +
						"</tr>" +
						"<tr id='fileTabber_Tab_1' class='tab_body' style='display: table-row;' data-tab-number=1><td colspan='2' class='tab_content'>" +
							"<input type='file' name='localFile' id='localFile' placeholder='Файл изображения...'>" +
							"<div id='sourcedFile' style='display: none;'>" +
								"<div id='sourcedFileLabel'>[ UNKNOWN ]</div>" +
								"<div id='sourcedFileClearButton' class='action_button' title='Очистить'>x</div>" +
							"</div>" +
						"</td></tr>" +
						"<tr id='fileTabber_Tab_2' class='tab_body' style='display: none;' data-tab-number=2><td colspan='2' class='tab_content'>" +
							"<input type='text' name='linkFile' id='linkFile' placeholder='Cсылка на изображение...'>" +
						"</td></tr>" +
					"</table>" +
					"<div class='inner_container'>" +
						"<input name='filterItem' type='checkbox' class='first_cb' value='smile' id='cb_fi1' checked><label for='cb_fi1'>SMILE</label>" +
						"<input name='filterItem' type='checkbox' value='smile_2' id='cb_fi2' checked><label for='cb_fi2'>SMILE_2</label>" +
						"<input name='filterItem' type='checkbox' value='hot' id='cb_fi3' checked><label for='cb_fi3'>HOT</label>" +
						"<input name='filterItem' type='checkbox' value='old' id='cb_fi4' checked><label for='cb_fi4'>OLD</label>" +
						"<input name='filterItem' type='checkbox' value='young' id='cb_fi5' checked><label for='cb_fi5'>YOUNG</label>" +
						"<input name='filterItem' type='checkbox' value='male' id='cb_fi6' checked><label for='cb_fi6'>MALE</label>" +
						"<input name='filterItem' type='checkbox' value='female' id='cb_fi7' checked><label for='cb_fi7'>FEMALE</label>" +
					"</div>" +
					"<div class='inner_container'>" +
						"<input name='newDeviceId' type='checkbox' class='first_cb' id='cb_nd'><label for='cb_nd'>Новый DEVICE_ID</label>" +
						"<input name='croppedImage' type='checkbox' id='cb_ci' checked><label for='cb_ci'>Обрезка по лицу</label><br>" +
						"<input name='showOriginal' type='checkbox' class='first_cb' id='cb_ho'><label for='cb_ho'>Показывать оригинал</label>" +
						"<input name='removeOldResults' type='checkbox' id='cb_dr' checked><label for='cb_dr'>Удалить предыдущие результаты</label>" +
					"</div>" +
				"</form>" +
				"<button id='mainButton' data-in-processing=0>Запуск</button>" +
			"</div>" +
			"<div id='messageContainer' class='outer_container'>" +
				"<div id='messageElement'>&nbsp;</div>" +
			"</div>" +
			"<div id='imagesContainer' class='outer_container images_container_empty'>" +
				"<div id='imagesContainerHeader'>" +
					"<div class='action_button images_container_button' data-action='combine' title='Объединить все изображения в одно'>+</div>" +
					"<div class='action_button images_container_button' data-action='clear' title='Удалить изображения'>x</div>" +
				"</div>" +
				"<div id='imagesItemsContainer' data-images-count=0></div>" +
			"</div>" +
		"</center>";
	
	// CSS ---
	GM_addStyle(
		"body { margin: 0px; padding: 0px; text-align: center; }\n" +
		"body * { box-sizing: border-box; }\n" +
		".outer_container { width: 99%; max-width: 99%; margin-bottom: 10px; padding: 3px; text-align: center; }\n" +
		".inner_container { width: 100%; margin: 7px 0px 0px 0px; padding: 0px; text-align: center; }\n" +
		".title_text { font-family: 'Courier New', monospace; font-weight: bold; text-transform: uppercase; }\n" +
		".action_button { display: inline-block; text-align: center; " +
						"border: 1px solid #000000; padding: 1px; " +
						"background: #EEEEEE none no-repeat; cursor: default; " +
						"font-family: 'Lucida Console', monospace; text-transform: uppercase; }\n" +
		".action_button:hover { border-color: #FF0000; background-color: #FFAAAA; }\n" +
		
		"#formContainer { width: 700px !important; }\n" +
		"#mainForm { width: 100%; margin: 0px 0px 7px 0px; padding: 0px; border: none; }\n" +
						
		"#dropZone { width: 100%; height: " + window.innerHeight + "px; position: fixed; z-index: 9999; " +
					"border: 10px dashed #FFFFFF; margin: 0px; padding: " + (Math.ceil(window.innerHeight / 2) - 16) + "px 5px 10px 5px; " +
					"font-size: 32px; text-align: center; " +
					"background: rgba(0, 0, 0, 0.5); color: #FFFFFF; " +
					"border: 10px dashed #FFFFFF; }\n" +
					
		"#popupWindow { min-width: 300px; max-width: 99%; min-height: 80px; position: fixed; z-index: 9998; " +
					"margin: 0px; padding: 0px; border: 1px solid #000000; " +
					"background: #FFFFFF none no-repeat; color: #000000; }\n" +
		"#popupWindowHeader { width:100%; height: 20px; padding: 1px 3px; text align: left; " +
					"margin: 0px; padding: 1px; border: 1px solid #000000; border-bottom-width: 2px; " +
					"background: #AAAAAA none no-repeat; color: #FFFFFF; " +
					"font-size: 14px; }\n" +
		"#popupWindowBody { width: 100%; margin: 0px; padding: 5px 3px; text-align: left; }\n" +
		"#popupWindowButtons { width: 100%; height: 26px; text-align: center; margin: 0px; padding: 1px; }\n" +
		"#popupWindowOkBtn, #popupWindowCancelBtn { width: 50%; height: 24px; margin: 0px; }\n" +

		"#fileTabber { width: 100%; margin: 0px 0px 0px 0px; /*border-collapse: collapse; */ }\n" +
		".tab_content { padding: 7px 0px 0px 0px; }\n" +
		".tab_header { text-align: center; border: 2px solid #AAAAAA; font-size: 14px; cursor: default; }\n" +
		".tab_header:not(.selected_tab) { background: #EEEEEE none no-repeat; color: #AAAAAA; font-weight: normal !important; }\n" +
		".tab_header.selected_tab { background: #FFFFFF none no-repeat; border-color : #000000 !important; color: #000000; font-weight: bold; " +
							"border-bottom: none !important; " +
							"border-left: 2px solid #000000 !important; " +
							"border-right: 2px solid #000000 !important; }\n" +

		"#localFile, #linkFile, #sourcedFile { width: 100%; height: 24px; }\n" +
		"#sourcedFile { border: 1px inset #000000; text-align: center; }\n" +
		"#sourcedFileLabel { display: inline-block; font-size: 16px; }\n" +
		"#sourcedFileClearButton { float: right; width: 20px; height: 20px; margin: 1px; font-size: 16px; line-height: -2.0; }\n" +
		"input[type='checkbox'] { margin: 0px 3px 0px 15px; }\n" +
		".first_cb { margin-left: 0px !important; }\n" +
		"#mainButton { width: 100%; }\n" +
		
		"#messageElement { display: inline-block; min-width: 700px;  max-width: 100%; border: 3px solid #FFFFFF; padding: 3px 5px; }\n" +
		".olded_message { background-color: #EEEEEE !important; border-color: #AAAAAA !important; color: #AAAAAA !important; }\n" +
		".info_message  { background-color: #AAAAFF !important; border-color: #0000FF !important; }\n" +
		".error_message { background-color: #FFAAAA !important; border-color: #FF0000 !important; }\n" +
		
		"#imagesContainer { border-top: 1px solid #000000; }\n" +
		"#imagesContainer.images_container_empty { visibility: hidden }\n" +
		"#imagesContainerHeader { width: 100%; height: 22px; margin: 0px 0px 5px 0px; padding: 0px; border: none; text-align: right; }\n" +
		".images_container_button {width: 20px; height: 20px; margin: 0px 0px 0px 1px; font-size: 16px; }\n" +
		
		".result_image_box { display: inline-block; max-width: 100%; margin: 1px; padding: 2px; border: 1px solid #000000; overflow: visible; }\n" +
		".result_image_header { width: 100%; height: 20px; min-width: 150px; margin: 0px; padding: 0px 0px 0px 5px; text-align: left; }\n" +
		".result_image_title { display: inline-block; text-align: right; font-size: 14px; }\n" +
		".result_image_buttons { display: inline-block; float: right; text-align: left; }\n" +
		".result_image_button { width: 18px; height: 18px; font-size: 14px; }\n" +
		".result_image_img { max-width: 100%; margin: 0px; }\n" +
		
		"#combineSettingsForm select { width: 300px; margin-bottom: 5px; }\n" +
		"#combineSettingsForm input[type='number'] { width: 50px; }\n" +
		"#combineSettingsForm input[type='color'] { width: 30px; padding: 1px; }"
	);
	
	
	BuildInterfaceModel();
	document.title = "FaceApp Script (ver. " + GM_info.script.version + ")";
	GenerateDeviceID();
})());