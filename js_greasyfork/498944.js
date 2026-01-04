//怎麼用？
//先去下載 篡改猴測試版
//https://chromew ebstore.google.com/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4%E6%B8%AC%E8%A9%A6%E7%89%88/gcalenpjmijncebpfijmoaglllgpjagf
//接著把這個腳本載入就完成啦～

// ==UserScript==
// @name         DC - 更改WorkSpace選擇
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更漂亮更方便的WorkSpace選擇頁面
// @author       ＪＯＨＮＡＴＨＡＮ
// @match        *://*/auth/workspace-select*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @require      https://unpkg.com/@master/css@1.37.8/index.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.js

// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_cookie
// @resource     masterNormal https://cdn.master.co/normal.css
// @resource     jqueryToast https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css
// @resource     semanticUI https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css
// @downloadURL https://update.greasyfork.org/scripts/498944/DC%20-%20%E6%9B%B4%E6%94%B9WorkSpace%E9%81%B8%E6%93%87.user.js
// @updateURL https://update.greasyfork.org/scripts/498944/DC%20-%20%E6%9B%B4%E6%94%B9WorkSpace%E9%81%B8%E6%93%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sid = "";
    GM_cookie('list', { name: 'sid' }, function(cookies, error) {
        console.log(cookies)
        const cookie = cookies[0]?.value
        sid = cookie
        $('#sidCopy').data( { "copy": sid } );
        console.log('sid', sid)
    });

    const masterNormal = GM_getResourceText("masterNormal");
    const jqueryToast = GM_getResourceText("jqueryToast");
    const semanticUI = GM_getResourceText("semanticUI");
    const isiFrame = window.location.search.includes("?iframe")


    GM_addStyle(`${masterNormal}
    ${jqueryToast}
    ${semanticUI}
    `);

    // HTML 解碼函數
    function htmlDecode(input) {
        var e = document.createElement('textarea');
        e.innerHTML = input;
        // handle case where input is encoded multiple times
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    // 提取 ObjectId 中的時間戳
    function extractTimestampFromObjectId(objectId) {
        return parseInt(objectId.substring(0, 8), 16);
    }

    // 找到網頁中的所有註釋
    var comments = [];
    $('*').contents().each(function() {
        if (this.nodeType === 8) { // 8 表示註釋節點
            comments.push(this.nodeValue);
        }
    });

    // 遍歷所有註釋，並嘗試解析 JSON 格式的註釋
    var jsonArray = [];
    comments.forEach(function(comment) {
        try {
            // 先解碼再解析
            var decodedComment = htmlDecode(comment);
            var jsonData = JSON.parse(decodedComment);
            if (Array.isArray(jsonData)) {
                jsonArray.push(...jsonData); // 展開數組並添加到 jsonArray
            } else {
                jsonArray.push(jsonData);
            }
        } catch (e) {
            // 無法解析為 JSON，忽略該註釋
        }
    });

    // 如果找到特定註釋，進行解析
    if (jsonArray && jsonArray.length) {
        try {

            function createThemeTemplate(tenant, accordion = false){
                const data = accordion ? tenant.themeList.slice(1) : tenant.themeList.slice(0, 1);
                return `${data.map((theme, index) => {
                    const switchUrl = `/auth/workspace-select?workspaceId=${tenant.workspaceId}&themeId=${theme._id}`
                            return `
                            <li class="p:8 px:12${theme.selected ? ' bg:yellow-90 r:5' : ''}${index !== 0 && accordion ? ' transition hidden' : ' active visible'}">
                                <h3 class="f:14 m:0!" title="${theme.description}">${theme.name}</h3>
                                <ul class="mt:4 flex gap:3 f:white_a f:white_a:hover font:bold">
                                    <li><a class="ui blue button tiny switch goUrl backStage" href="/pages" data-href="${switchUrl}" target="_blank">後台</a></li>
                                    <li><a class="ui green button tiny switch" href="#" data-href="${switchUrl}">切換</a></li>
                                   <li>
                                      <div class="ui dropdown">
                                        <div class="text ui button tiny font:bold">更多 <i class="dropdown icon font-family:Dropdown! m:0!"></i></div>
                                        <div class="menu">
                                          <a class="item switch goUrl hidden! dropdownBackStage" href="/pages" data-href="${switchUrl}">後台</a>
                                          <a class="item switch goUrl" href="/swagger" data-href="${switchUrl}">前往 Swagger</a>
                                          <a class="item copy" href="#" data-copy="${tenant.workspaceId}">複製 WorkspaceId</a>
                                          <a class="item copy" href="#" data-copy="${theme._id}">複製 ThemeId</a>
                                          <a class="item switch goUrl" href="/api/v1/config/workspaces?id=${tenant.workspaceId}" data-href="${switchUrl}">前往 Workspace API</a>
                                          <a class="item switch goUrl" href="/api/v1/config/themes?id=${theme._id}" data-href="${switchUrl}">前往 Theme API</a>
                                        </div>
                                      </div>
                                    </li>
                                </ul>
                              </li>
                            `}).join('')}`
            }

            // 創建模板函數
            function createTenantTemplate(tenant) {
                return `
                    <div class="tenant">
                        <h2 class="f:16 mb:5!"><a href="//${tenant.domain}" target="_blank">${tenant.name}</a></h2>
                        <ul class="mt:5 ml:3">
                            ${createThemeTemplate(tenant)}
                        </ul>
                        ${tenant.themeList.length > 1 ? `<div class="ui accordion">
                          <div class="title f:bold f:14! ml:10"><i class="dropdown icon"></i>更多 Themes</div>
                          <ul class="content mt:5 ml:3">
                              ${createThemeTemplate(tenant, true)}
                          </ul>
                        </div>`: ''}
                    </div>
                    <div class="ui divider"></div>
                `;
            }

            jsonArray.sort((a, b) => extractTimestampFromObjectId(a.workspaceId) - extractTimestampFromObjectId(b.workspaceId));

            // 創建HTML內容
            var htmlContent = jsonArray.map(createTenantTemplate).join('');
            const sidCopy = `<a id="sidCopy" href="#" class="copy ml:5 bg:red-60 f:white font:12 p:5|6 r:3 font:bold text:center d:inline-block f:white:hover" data-copy="">複製sid</a>`
            const ulChildren = $('body > ul').children().detach();
            const tenantContainer = $('<div id="old-tenant-container" class="hidden"></div>').append(ulChildren);
            $('body > ul').prepend(`<div id="tenant-container" class="flex flex:col p:6 mt:4">${htmlContent}</div>`);
            $('body > ul').append(tenantContainer);
            $('h3 span').append(sidCopy);
            $('body').addClass('m:10');
            $('h3').addClass('f:14');
            $('.ui.dropdown').dropdown({
                action: 'hide',
                on: 'hover'
            });
            if (isiFrame) $('h3, .backStage').hide(), $('.dropdownBackStage').removeClass('hidden!'), $('.ui.divider').addClass('my:5!');
            $('.ui.accordion').accordion();
            changeTitle();

            // 綁定AJAX切換功能
            $('#tenant-container').on('click', 'a.switch', function(e) {
                const classList = e.currentTarget.classList;
                e.preventDefault();
                const url = $(this).data('href');
                const goUrl = $(this).attr('href');
                $.get(url, function(response) {
                    toast(`切換成功`, 'success');
                    if (classList.contains('goUrl')) {
                        window.open(goUrl)
                    }
                    window.location.reload();
                    //alert('切換成功');
                }).fail(function() {
                    toast(`切換失敗`, 'error');
                    if (classList.contains('goUrl')) {
                        window.open(goUrl)
                    }
                    window.location.reload();
                    //alert('切換失敗');
                });
            });

            // 綁定複製功能
            $('body').on('click', 'a.copy', function(e) {
                e.preventDefault();
                var text = $(this).data('copy');
                var tempInput = $('<input>');
                $('body').append(tempInput);
                tempInput.val(text).select();
                document.execCommand('copy');
                tempInput.remove();
                toast(`複製成功: ${text}`, 'success')
            });

        } catch (e) {
            console.error('Failed to parse JSON from comment:', e);
        }
    } else {
        console.log('Specific comment not found.');
    }

    function toast(text, icon = 'info'){
        $.toast({
            text,
            icon,
            showHideTransition: 'fade', // fade, slide or plain
            allowToastClose: true, // Boolean value true or false
            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'center',  // Text alignment i.e. left, right or center
            loader: false,  // Whether to show loader or not. True by default
            loaderBg: '#9EC600',  // Background color of the toast loader

        });
    }
    function changeTitle() {
        var hostname = window.location.hostname;
        var titlePrefix = '';

        if (hostname === 'localhost') {
            titlePrefix = '(Local) ';
        } else if (hostname === 'design.qa.91dev.tw') {
            titlePrefix = '(QA) ';
        } else if (hostname === 'design.91app.com') {
            titlePrefix = '(Prod) ';
        }

        if (titlePrefix) {
            document.title = titlePrefix + document.title;
        }
    }
})();