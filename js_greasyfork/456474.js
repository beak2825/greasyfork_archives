// ==UserScript==
// @name         Tik Tok Marketplace
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Try to get tik toker page information
// @author       Ken Kwok
// @match        *://creatormarketplace.tiktok.com/*
// @match        */admin/tiktok-creators*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.1/jquery.toast.min.js
// @require      http://code.jquery.com/ui/1.9.2/jquery-ui.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456474/Tik%20Tok%20Marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/456474/Tik%20Tok%20Marketplace.meta.js
// ==/UserScript==

//====== small ui =====//
//====config====//
const StorageKey = "tiktok_automation";
const DefaultUIPositionTop = 10;
const DefaultUIPositionLeft = 10;
let checkBodyInterval,
    isAutoScan,
    currentPage=0,
    totalAuthors=0,
    currentAuthor=0,
    currentAuthorName = '',
    responseData = [],
    accessor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText'),
    apiUrls = {},
    targetServiceMethods = [
        'CreatorProfileDemographics',
        'CreatorProfileRecentVideosPerformance',
        'CreatorProfilePerformanceTrends',
        'CreatorProfileCoreMetrics',
        'AuthorInfoForAdvertiser'
    ],
    dev = false,
    startGetList = true,
    admin = dev ? 'https://local.cloudbreakr.io:8443/admin/tiktok-creators/' : 'https://laravel-uat.cloudbreakr.com/admin/tiktok-creators/',
    DefaultDelay = 1000,
    sendReadyTimeout,
    detailCloseTimeout,
    startGetListTimeout,
    messageInterval,
    crawlInterval,
    dataToSave,
    currentId,
    authors = [];
//====config====//

class StorageManager
{
    Initialize()
    {
        this._data = {};
        let data = GM_getValue(StorageKey, "{}");
        this._data = JSON.parse(data);
    }

    OnLeave()
    {
        let data = JSON.stringify(this._data);
        GM_setValue(StorageKey, data);
    }

    Get(key, defaultValue)
    {
        if(this._data[key] == undefined)
            this._data[key] = defaultValue;

        return this._data[key];
    }

    Set(key, value)
    {
        this._data[key] = value;
    }
}

class UIManager
{
    Initialize()
    {
        this._ZIndex = 1000000;
        this._top = _StorageManager.Get("top", DefaultUIPositionTop);
        this._left = _StorageManager.Get("left", DefaultUIPositionLeft);
        this.UpdateZIndex();
        isAutoScan = _StorageManager.Get("IsAutoScan", true)

        clearInterval(checkBodyInterval);
        checkBodyInterval = setInterval(()=>{
            clearInterval(checkBodyInterval);
            this.CreateMainWindow();
            this.CreateControlButton();
        }, 3000);
    }

    OnLeave()
    {
        _StorageManager.Set("top", this._top);
        _StorageManager.Set("left", this._left);
        _StorageManager.Set("IsAutoScan", $("#IsAutoScan").attr('checked') == 'checked');
    }

    UpdateZIndex()
    {
        $("div").each((index, obj) => {
            let _current = parseInt($(obj).css("zIndex"), 10);

            if(isNaN(_current) == false && _current > this._ZIndex) {
                this._ZIndex = _current + 1;
            }
        });
    }

    CreateMainWindow()
    {
        $('body').append('<div id = "MainWindow" class = "ui-widget-header">Tiktok Automation</div>');

        $("#MainWindow").css("position", "absolute");
        $("#MainWindow").css("top", this._top + "px");
        $("#MainWindow").css("left", this._left + "px");
        $("#MainWindow").css("z-index", this._ZIndex);
        $("#MainWindow").css("background", "#ecebeb");
        $("#MainWindow").css("border", 1 + "px solid #333");
        $("#MainWindow").css("border-radius", 5 + "px");
        $("#MainWindow").css("height", "auto");
        $("#MainWindow").css("width", 280);
        $("#MainWindow").css("margin", "0px auto");
        $("#MainWindow").draggable();
        $("#MainWindow").mouseup((event) => {
            this._top = parseInt($("#MainWindow").css("top")) - $(unsafeWindow).scrollTop();
            this._left = parseInt($("#MainWindow").css("left"));
        });

        $(unsafeWindow).scroll((event) => {
            let topValue = $(unsafeWindow).scrollTop();
            $("#MainWindow").css("top", (topValue + this._top) + "px");
        });
    }

    CreateControlButton()
    {
        $("#MainWindow").append("<div><input type=\"checkbox\" id=\"IsAutoScan\"><label for='IsAutoScan'>Auto Scan list</label><div>");
        $("#IsAutoScan").off('click').on('click', function(){
            isAutoScan = $("#IsAutoScan").attr('checked') == 'checked';
        });
        if(_StorageManager.Get("IsAutoScan", true))
        {
            $("#IsAutoScan").attr('checked','checked')
        }
        else
        {
            $("#IsAutoScan").removeAttr("checked");
        }
        $("#MainWindow").append("<div class='scan-list-counter' id='scan-list-counter'>Page: " + currentPage + ", Author: " + currentAuthorName + " (" + currentAuthor +" / " + totalAuthors + ")<div>");
    }
}

unsafeWindow.Init = async function()
{
    unsafeWindow._StorageManager = new StorageManager();
    unsafeWindow._UIManager = new UIManager();

    unsafeWindow._StorageManager.Initialize();
    unsafeWindow._UIManager.Initialize();
}
unsafeWindow.Init().catch(console.error);

unsafeWindow.onunload = (async function() {
    unsafeWindow._UIManager.OnLeave();
    unsafeWindow._StorageManager.OnLeave();
});
//====== small ui =====//

//====== main code ======//

function injectStylesheet(url)
{
    $('head').append('<link rel="stylesheet" href="'+url+'" type="text/css" />');
}

function toastMessage(message)
{
    $.toast({
        text: message,
        heading: 'Tiktok Data Script', // Optional heading to be shown on the toast
        loader: true,
        loaderBg: '#9EC600',
        showHideTransition: 'slide', // fade, slide or plain
        allowToastClose: true, // Boolean value true or false
        hideAfter: 5000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
        stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
        position: 'top-right',
        bgColor: '#444444',
        textColor: '#eeeeee'
    });
}

function checkUrl($urlPattern)
{
    let currentLocation = window.location.href;
    var matches = currentLocation.match($urlPattern);
    if(matches != null)
    {
        return true;
    }
}

async function adminPageAction()
{
    if(checkUrl(/admin\/tiktok-creators\/\?author_id=[0-9]+/))
    {
        let currentUrl = window.location.href,
            authorId = await currentUrl.match(/\/tiktok-creators\/\?author_id=([0-9]+)/)[1],
            currentId = currentUrl.match(/admin\/tiktok-creators\/\?author_id=[0-9]+/)[1],
            dataToSave = await GM_getValue('tiktok_data_' + authorId);
        if(dataToSave.trim().length > 0)
        {
            await $('#data').val(dataToSave);
            await sleep(3000);
            $('#ajaxSubmit').click();
        }
        else
        {
            GM_setValue('tiktok_message_' + currentId, 'Empty data, please check with the developer');
            if(jsonObj.response.close)
            {
                let win = window.open("","_self");
                setTimeout(()=>win.close(), 100);
            }
        }
    }
}

function marketplacePageAction() {
    if(checkUrl(/\/ad#\/market/))
    {
        var thisAuthors
        crawlInterval = setInterval(function(){
            if(authors.length && startGetList)
            {
                thisAuthors = authors;
                authors = [];
                crawlList(thisAuthors);
            }
        }, 5000);
    }
}
async function sleep(ms = DefaultDelay)
{
    return new Promise(r => setTimeout(r, ms));
}

async function checkDoneFlag(messageKey)
{
    var keepLoop = true;
    while(keepLoop)
    {
        var message = GM_getValue(messageKey);
        if(message)
        {
            if(message.length > 0)
            {
                keepLoop = false;
                GM_setValue(messageKey, '');
                return new Promise(function(res, rej) {
                    res(true);
                });
            }
        }
        await sleep(3000);
    }
    return new Promise(function(res, rej) {
        rej(false);
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function crawlList(authors)
{
    startGetList = false;
    totalAuthors = authors.length;
    asyncForEach(authors, async function(row, index){
        GM_openInTab('https://creatormarketplace.tiktok.com/ad#/author/' + row.id);
        currentAuthorName = row.nick_name;
        currentAuthor = index + 1;
        if($('#scan-list-counter'))
        {
            $('#scan-list-counter').text("Page: " + currentPage + ", Author: " + currentAuthorName + " (" + currentAuthor +" / " + totalAuthors + ")");
        }
        var checkResult = await checkDoneFlag('tiktok_done_' + row.id);
        if(index + 1 == authors.length)
        {
            toastMessage('Will jump to next page soon');
            setTimeout(function(){
                $('.el-pager > .number.active + li').click();
            }, 10000);
        }
        await sleep(3000);
    });
}

Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
	get: function() {
        let requestUrl = this._url,
            responseUrl = this.responseURL,
            message;
        if(requestUrl)
        {
            if(requestUrl.includes('mon-va.byteoversea.com/monitor_browser/collect/batch/?biz_id=star_fe_i18n') && apiUrls.length != targetServiceMethods.length)
            {
                var batchData = JSON.parse(this._data);
                batchData.list.forEach(function(data){
                    if(data.ev_type != 'http')
                    {
                        return;
                    }
                    var serviceMethod = data.payload.request.headers['x-star-service-method'];
                    if(targetServiceMethods.includes(serviceMethod))
                    {
                        apiUrls[serviceMethod] = data.payload.response.timing.name;
                    }
                });
            }
            if(requestUrl.includes('/h/api/gateway/handler_get/?author_id='))
            {
                let response = this.response,
                    jsonObj = JSON.parse(response),
                    data = jsonObj.data,
                    authorId = requestUrl.match(/author_id=([0-9]+)&/)[1],
                    serviceName = requestUrl.match(/service_method=([A-Za-z0-9]+)&/)[1];
                GM_setValue('tiktok_message_' + authorId, null);
                data['type'] = serviceName;
                responseData.push(data);
                GM_setValue('tiktok_data_' + authorId, JSON.stringify({responseData}));
                clearTimeout(sendReadyTimeout);
                sendReadyTimeout = setTimeout(function(){
                    GM_openInTab(admin + '?author_id=' + authorId);
                }, 5000);
                clearInterval(messageInterval);
                messageInterval = setInterval(function(){
                    clearTimeout(detailCloseTimeout);
                    message = GM_getValue('tiktok_message_' + authorId);
                    if(message)
                    {
                        GM_setValue('tiktok_message_' + authorId, "");
                        GM_setValue('tiktok_done_' + authorId, authorId + 'Done');
                        toastMessage(message);
                        clearInterval(messageInterval);
                        let win = window.open("","_self");
                        detailCloseTimeout = setTimeout(()=>win.close(), 3000);
                    }
                }, 1000);
            }

            if(requestUrl.includes('/h/api/gateway/handler_get/?page=') && isAutoScan)
            {
                let response = this.response,
                    jsonObj = JSON.parse(response),
                    data = jsonObj.data,
                    serviceName = requestUrl.match(/service_method=([A-Za-z0-9]+)&/)[1];
                currentPage = requestUrl.match(/\?page=([0-9]+)/)[1];
                if(serviceName == "AuthorPlazaSearch" && data)
                {
                    clearTimeout(startGetListTimeout);
                    authors = authors.concat(data.authors);
                    startGetListTimeout = setTimeout(function(){
                        startGetList = true;
                    }, 5000);
                }
            }
        }
        if(responseUrl)
        {
            if(responseUrl.includes('/api/admin/tiktok-creators/save'))
            {
                let response = this.response,
                    jsonObj = JSON.parse(response),
                    message = jsonObj.response.message,
                    currentIdMatch = message.match(/ID:([0-9]+)/),
                    currentId;
                if(currentIdMatch)
                {
                    currentId = currentIdMatch[1];
                }
                if(message && currentId)
                {
                    GM_setValue('tiktok_message_' + currentId, message);
                    if(jsonObj.response.close)
                    {
                        let win = window.open("","_self");
                        setTimeout(()=>win.close(), 100);
                    }
                }
            }
        }
		return accessor.get.call(this);
	},
	set: function(str) {
		console.log('set responseText: %s', str);
		//return accessor.set.call(this, str);
	},
	configurable: true
});

(function() {
    'use strict';
    //inject jqtoast
    injectStylesheet("https://cdn.rawgit.com/kamranahmedse/jquery-toast-plugin/bd761d335919369ed5a27d1899e306df81de44b8/dist/jquery.toast.min.css");
    adminPageAction();
    marketplacePageAction();
})();