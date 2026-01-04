// ==UserScript==
// @name         一键添加阿里云共享到AList
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  方便快捷的一键添加阿里云共享到AList
// @author       chaos
// @match        https://www.aliyundrive.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyundrive.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @resource     http://i.stack.imgur.com/FhHRx.gif
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460279/%E4%B8%80%E9%94%AE%E6%B7%BB%E5%8A%A0%E9%98%BF%E9%87%8C%E4%BA%91%E5%85%B1%E4%BA%AB%E5%88%B0AList.user.js
// @updateURL https://update.greasyfork.org/scripts/460279/%E4%B8%80%E9%94%AE%E6%B7%BB%E5%8A%A0%E9%98%BF%E9%87%8C%E4%BA%91%E5%85%B1%E4%BA%AB%E5%88%B0AList.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

/*
https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

// todo: cache AList auth token

(async function() {
    'use strict';
    console.log('start user script...')

    // Your code here...
    injectStyleFile('https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css')
    injectStyle(`
.alist-config {
    display: none;
}
.alist-config lable,input {
    display: block;
    width: 100%;
}
.saveToAList {
    cursor: pointer;
    color: var(--basic_white);
    background-color: rgb(185, 158, 29);
    border-radius: 10px;
    margin: 0px 5px;
    padding: 1px 10px;
    height: 36px;
    font-size: 14px;
    line-height: 1.5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.share-name {
    color: red;
}
.xhr-progress {
    display:    none;
    position:   fixed;
    z-index:    1000;
    top:        0;
    left:       0;
    height:     100%;
    width:      100%;
    background: rgba( 255, 255, 255, .8 )
                url('http://i.stack.imgur.com/FhHRx.gif')
                50% 50%
                no-repeat;
}
body.loading .xhr-progress {
    overflow: hidden;
    display: block;
}
    `)
    const config = await loadAListConfig()
    console.log('AList config', config)
    createConfigModal(config)
    createAddToAListResultModal()
    createXhrProgressModal()

    waitForKeyElements('div[class^="info-wrapper--"]', $node => {
        console.log( "DOM document change!", $node )
        const addedEleClass = 'saveToAList'
        $node.after('<div id="saveToAList" class="'+addedEleClass+'">保存到AList</div><div id="configAList" class="'+addedEleClass+'">配置AList</div>')

        const $saveToAList = $('#saveToAList')
        const $configAList = $('#configAList')

        const $dialog = $('.alist-config').dialog({
            title: '配置AList',
            autoOpen: false,
            modal: true,
            position: {my: "center", at: "center", of: $configAList},
            buttons: {
                "保存配置": function() {
                    saveAListConfig()
                    $dialog.dialog('close')
                },
                '取消': function() {
                    $dialog.dialog('close')
                }
            },
        })

        $saveToAList.click(function(){
            console.log($(this))
            getAliyunShareInfo()
            //addAliyunShareToAList()
        })

        $configAList.css({
            'background-color': '#3e3e3e',
        })
        $configAList.click(function(){
            console.log($(this))
            $dialog.dialog('open')
        })
    })


    /*
      function defines here
     */

    function createConfigModal(config) {
        const html = `
<div class='alist-config'>
	<label for="url">
		AList网址
		<input type="text" name="url" id="url" value="${config.url}">
	</label>
	<label for="username">
		用户名
		<input type="username" name="username" id="username" value="${config.username}">
	</label>
	<label for="password">
		密码
		<input type="text" name="password" id="password" value="${config.password}">
	</label>
    <label for="token">
		阿里云刷新token
		<input type="text" name="token" id="token" value="${config.token}">
	</label>
</div>
        `
        $('body').append(html)
    }

    function createXhrProgressModal() {
        const html = `
<div class='xhr-progress'>
</div>
        `
        $('body').append(html)
    }

    function createAddToAListResultModal() {
        const html = `
<div class='alist-add-result'>
	<p>添加<span class='share-name'>共享</span>到AList成功
</div>
        `
        $('body').append(html)
    }

    function injectScriptFile(path) {
        const s = document.createElement('script')
        s.type = 'text/javascript'
        s.src = path
        $('body').append(s)
    }

    function injectScript(code) {
        const s = document.createElement('script')
        s.type = 'text/javascript'
        s.textContent = code
        $('body').append(s)
    }

    function injectStyleFile(path) {
        const s = document.createElement('link')
        s.rel = 'stylesheet'
        s.href = path
        $('head').append(s)
    }

    function injectStyle(code) {
        const s = document.createElement('style')
        s.textContent = code
        $('head').append(s)
    }

    async function saveAListConfig() {
        console.log('save alist config')
        const url = $('#url').val()
        const username = $('#username').val()
        const password = $('#password').val()
        config.url = url
        config.username = username
        config.password = password
        delete config.ok
        await GM.setValue('config', JSON.stringify(config))
    }

    function valideteString(s) {
        return s != undefined && s.length > 0
    }

    async function loadAListConfig() {
        const configString = await GM.getValue('config', '{}')
        let config = JSON.parse(configString)
        if (valideteString(config.url) && valideteString(config.username) && valideteString(config.password) && valideteString(config.token)) {
            config.ok = true
        } else {
            console.log('config not set')
            config = {
                url: 'http://localhost:5244',
                username: 'admin',
                password: '',
                token: '',
                ok: false,
            }
        }
        return config
    }

    function onProgress(response, req) {
        console.log('onprogress', req, response)
        if (response.lengthComputable) {
            console.log(`${req}: ${response.loaded}/${response.total}`)
            if (response.loaded < response.total) {
                //$("body").addClass('loading')
            } else {
                //$("body").removeClass('loading')
            }
        }
    }

    function getAliyunShareInfo() {
        const shareUrl = location.href
        const regex = /https:\/\/www.aliyundrive.com\/s\/([^/]+)/
        const m = shareUrl.match(regex)

        if (m) {
            const shareId = m[1]
            // get aliyundrive share token
            const requestData = {
                share_id: shareId,
                share_pwd: '',
            }
            $("body").addClass('loading')
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.aliyundrive.com/v2/share_link/get_share_token',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    $("body").removeClass('loading')
                    //console.log(response.responseText)
                    const tokenObj = JSON.parse(response.responseText)
                    console.log('1. get aliyundrive share token', tokenObj)
                    // get share info for AList
                    const requestData = {
                        share_id: shareId,
                        limit: 20,
                        order_by: 'name',
                        order_direction: 'DESC',
                        parent_file_id: 'root',
                        image_url_process: 'image/resize,w_1920/format,jpeg/interlace,1',
                        image_thumbnail_process: 'image/resize,w_256/format,jpeg',
                        video_thumbnail_process: 'video/snapshot,t_1000,f_jpg,ar_auto,w_256',
                    }
                    $("body").addClass('loading')
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://api.aliyundrive.com/adrive/v2/file/list_by_share',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-share-token': tokenObj.share_token,
                        },
                        data: JSON.stringify(requestData),
                        onload: function(response) {
                            $("body").removeClass('loading')
                            //console.log(response.responseText)
                            const shareInfoObj = JSON.parse(response.responseText)
                            console.log('2. list aliyundrive share', shareInfoObj)
                            const shareInfo = {
                                shareId: shareId,
                                root: 'root',
                                name: `阿里云共享${Date.now()}`,
                            }
                            if (shareInfoObj.items.length === 1) {
                                shareInfo.root = shareInfoObj.items[0].file_id
                                shareInfo.name = shareInfoObj.items[0].name
                            }
                            // add share to AList
                            console.log(shareInfo)
                            addAliyunShareToAList(shareInfo)
                        },
                        onprogress: function(response) {onProgress(response, 1)},
                    })
                },
                onprogress: function(response) {onProgress(response, 2)},
            })
        }
    }

    function addAliyunShareToAList(shareInfo) {
        if (!valideteString(shareInfo.shareId) || !valideteString(shareInfo.root) || !valideteString(shareInfo.name)) {
            console.log('shareInfo not complete', shareInfo)
            return
        }
        const requestData = {
            username: config.username,
            password: config.password,
            otp_code: '',
        }
        $("body").addClass('loading')
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${config.url}/api/auth/login`,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: JSON.stringify(requestData),
            onload: function(response) {
                $("body").removeClass('loading')
                //console.log(response.responseText)
                const tokenObj = JSON.parse(response.responseText)
                console.log('3. get AList login token', tokenObj)
                if (tokenObj.code !== 200) {
                    alert('AList用户名或密码配置不正确，请重新配置')
                    return
                }
                const additionData = {
                    refresh_token: config.token,
                    share_id: shareInfo.shareId,
                    share_pwd: '',
                    root_folder_id: shareInfo.root,
                    order_by: '',
                    order_direction: '',
                }
                const requestData = {
                    driver: 'AliyundriveShare',
                    mount_path: shareInfo.name,
                    extract_folder: '',
                    remark: '',
                    order: 0,
                    cache_expiration: 30,
                    down_proxy_url: '',
                    web_proxy: false,
                    webdav_policy: '302_redirect',
                    addition: JSON.stringify(additionData),
                }
                $("body").addClass('loading')
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.url}/api/admin/storage/create`,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': tokenObj.data.token,
                    },
                    data: JSON.stringify(requestData),
                    onload: function(response) {
                        $("body").removeClass('loading')
                        //console.log(response.responseText)
                        const resObj = JSON.parse(response.responseText)
                        console.log('4. create AList storage', resObj)
                        if (resObj.code !== 200) {
                            alert(`添加失败：${resObj.message}`)
                        } else {
                            $('.share-name').text(shareInfo.name)
                            $('.alist-add-result').dialog({
                                buttons: {
                                    '查看AList': function() {
                                        $(this).dialog("close")
                                        GM.openInTab(`${config.url}/${shareInfo.name}`, false)
                                    },
                                    '取消': function() {
                                        $(this).dialog("close")
                                    }
                                }
                            });
                        }
                    },
                    onprogress: function(response) {onProgress(response, 3)},
                })
            },
            onprogress: function(response) {onProgress(response, 4)},
        })
    }
})();