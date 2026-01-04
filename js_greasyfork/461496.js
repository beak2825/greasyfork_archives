// ==UserScript==
// @name        steam_package
// @description steam package
// @license     MIT
// @namespace   http://tampermonkey.net/
// @include     https://help.steampowered.com/*/wizard/HelpWithGameIssue/*appid=*
// @include     https://help.steampowered.com/*/wizard/HelpWithGame/*appid=*
// @version     2024.08.06.1
// @run-at      doument-end
// @require     http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @connect     store.steampowered.com
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/461496/steam_package.user.js
// @updateURL https://update.greasyfork.org/scripts/461496/steam_package.meta.js
// ==/UserScript==

var m = /appid=(\d+)/.exec(document.URL);
var app = m[1];

    if($('#d').length == 0){
        $('.help_purchase_detail_box:last').after('<div id="d"></div>');
        $('#d').append('<div><a href="javascript:void(0);" onclick="addman();">ADDMAN</a></div>');
        $('#d').append('<div><a href="javascript:void(0);" onclick="rmman();">REMOVE</a></div>');
        $('#d').append('<div><a href="javascript:void(0);" onclick="reman();">RESTORE</a></div>');
        $('#d').append('<div id="c"></div><br>');
        $('#d').append('<div id="a"></div>');
    }
    addM1($("a[href*='issueid=123']"));
    addM2($("#packageid"));

// 观察器的配置（需要观察什么变动）
const config = {
    attributes: true, // 开启监听属性
    childList: true, // 开启监听子节点
    subtree: true // 开启监听子节点下面的所有节点
};

// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
            var n = mutation.addedNodes[0];
            if (n.className == 'wizard_content_wrapper') {
                if($('#d').length == 0){
                    $('.help_purchase_detail_box:last').after('<div id="d"></div>');
                    $('#d').append('<div><a href="javascript:void(0);" onclick="addman();">ADDMAN</a></div>');
                    $('#d').append('<div><a href="javascript:void(0);" onclick="rmman();">REMOVE</a></div>');
                    $('#d').append('<div><a href="javascript:void(0);" onclick="reman();">RESTORE</a></div>');
                    $('#d').append('<div id="c"></div><br>');
                    $('#d').append('<div id="a"></div>');
                }
                addM1($(n).find("a[href*='issueid=123']"));
                addM2($(n).find("#packageid"));
            }
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe($('#wizard_contents')[0], config);

function addM1(a)
{
    a.each(function() {
        m = /chosenpackage=(\d+)/.exec($(this).attr('href'));
        if (m) {
            var sub = m[1];
            var t = $(this).text();
            $('#a').append(`<p><b style="color:#5eafde;font-weight:bold;">${sub}</b>&nbsp;${t}`);
            $('#a').append(`<p><a href="javascript:void(0);" onclick="restore(${sub}, &#39;&#35;${sub}&#39;);"><span style="color:green;font-weight:bold;">ADD</span></a>&nbsp;<a href="javascript:void(0);" onclick="remove(${sub}, &#39;&#35;${sub}&#39;);"><span style="color:red;font-weight:bold;">RMV</span></a>&nbsp;<span id="${sub}"></span></p>`);
        }
    });
}

function addM2(a)
{
    a.each(function() {
        var sub = $(this).val();
        $('#a').append(`<p><b style="color:#5eafde;font-weight:bold;">${sub}</b>`);
        $('#a').append(`<p><a href="javascript:void(0);" onclick="restore(${sub}, &#39;&#35;${sub}&#39;);"><span style="color:green;font-weight:bold;">ADD</span></a>&nbsp;<a href="javascript:void(0);" onclick="remove(${sub}, &#39;&#35;${sub}&#39;);"><span style="color:red;font-weight:bold;">RMV</span></a>&nbsp;<span id="${sub}"></span></p>`);
    });
}

function pageFullyLoaded () {

}

unsafeWindow.remove = function(a, b){
    $(b).empty();
    $.ajax({
        url: '/en/wizard/AjaxDoPackageRemove',
        type: "POST",
        dataType : 'json',
        data: {
            packageid: a,
            appid: app,
            sessionid: g_sessionID,
            wizard_ajax: 1
        },
        success: function( data, status, xhr ){
            if (data.success){
                $(b).append(data.hash);
            } else {
                $(b).append(data.errorMsg);
            }
        },
        fail: function( data, status, xhr ){
            $(b).append(status);
        }
    });
}

unsafeWindow.restore = function(a, b){
    $(b).empty();
    $.ajax({
        url: '/en/wizard/AjaxDoPackageRestore',
        type: "POST",
        dataType : 'json',
        data: {
            packageid: a,
            appid: app,
            sessionid: g_sessionID,
            wizard_ajax: 1
        },
        success: function( data, status, xhr ){
            if (data.success){
                $(b).append(data.hash);
            } else {
                $(b).append(data.errorMsg);
            }
        },
        fail: function( data, status, xhr ){
            $(b).append(status);
        }
    });
}

unsafeWindow.addman = function() {
    $('#c').empty();
    var sub = prompt( 'Enter Free subID to add to account:' );
    if ( sub !== null ) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://store.steampowered.com/account/?l=english",
            onload: function(response) {
                var m = /g_sessionID = "([0-9a-f]+)";/.exec(response.responseText);
                if (m){
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "https://store.steampowered.com/checkout/addfreelicense",
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            "Origin": "https://store.steampowered.com",
                            "Sec-Fetch-Site": "same-origin",
                            "Accept": "text/plain, */*",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        data: `action=add_to_cart&sessionid=${m[1]}&subid=${sub}`,
                        onload: function(response) {
                            var r = $(response.responseText).find('.add_free_content_success_area p:first,.error');
                            if (r.length > 0)
                                $('#c').append($(r).text());
                        },
                        onerror:  function(response) {
                            $('#c').append(response.statusText);
                        },
                        ontimeout:  function(response) {
                            $('#c').append(response.statusText);
                        },
                    });
                }
                else {
                    $('#c').append("no match id");
                }
            },
            onerror:  function(response) {
                $('#c').append(response.statusText);
            },
            ontimeout:  function(response) {
                $('#c').append(response.statusText);
            },
        });
    }
}

unsafeWindow.rmman = function() {
    var sub = prompt( 'Enter subID that you want to remove:' );
    if ( sub !== null ) {
        remove(sub, '#c');
    }
}

unsafeWindow.reman = function() {
    var sub = prompt( 'Enter subID that you want to restore:' );
    if ( sub !== null ) {
        restore(sub, '#c');
    }
}