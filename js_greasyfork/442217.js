// ==UserScript==
// @namespace fm1223

// @name 北森内部自用

// @author fm1223

// @description 北森内部专用

// @homepageURL https://cat7373.github.io/remove-web-limits/
// @supportURL https://greasyfork.org/zh-CN/scripts/28497

// @icon https://www.italent.cn/italent.ico

// @version 0.0.14
// @license LGPLv3

// @include *.italent.*/*
// @include *.italent-dev.*/*
// @include *.developer.italent.*/*
// @include *.developer.italent-dev.*/*
// @include *://ops.beisen-inc.com/*
// @include *://qa.ops.beisencorp.com/*
// @include *://*/*

// @connect eemm.me
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @grant GM_setClipboard
// @grant GM_registerMenuCommand
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant unsafeWindow
// @run-at document-idle
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/clipboard@2.0.10/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/442217/%E5%8C%97%E6%A3%AE%E5%86%85%E9%83%A8%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/442217/%E5%8C%97%E6%A3%AE%E5%86%85%E9%83%A8%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var currentHost = window.location.host
    console.log(currentHost)
    var italentHost = ['www.italent.cn','www.italent-dev.cn', 'www.italent.link']
    var sandBoxHost = ['developer.italent-dev.cn','developer.italent.cn']
    var logHost = ['ops.beisen-inc.com', 'qa.ops.beisencorp.com']
    var hosts = { italent: italentHost, log: logHost,sandBox:sandBoxHost }

    if (contain(hosts, currentHost)) {
        setTimeout(onload, 1000)
    }

    function onload() {
        if (italentHost.indexOf(currentHost) != -1) {
            italent()
        }
        if (logHost.indexOf(currentHost) != -1) {
            logTools()
        }
        if (sandBoxHost.indexOf(currentHost) != -1) {
            sandBox()
        }

    }

    function sandBox(){
        if (typeof BSGlobal === 'undefined') return
        let tanentId = BSGlobal.tenantInfo.Id
        let tenantName = BSGlobal.tenantInfo.Name
        if($('.company-name').length > 0){
            $('.company-name').before(`<span class="company-name " style="cursor:pointer;color: green;"><b  data-clipboard-text="${tanentId}"  class="company-name-italentId">${tanentId}</b></span>`)
            addClipboard('.company-name-italentId')
        }
        if($('.custom-header-left').length > 0){
            $('.user-info').before(`<span style="color: green;font-size: 14px;"><b>${tenantName}</b><b data-clipboard-text="${tanentId}" style="padding-left: 10px;cursor:pointer;"class="user-info-italentid">${tanentId}</b></span>`)
            addClipboard('.user-info-italentid')
        }

    }

    function italent() {
        //ux-new-menu__Header menu class name
        //Tenant__Name tenant clsss name
        //Header__GlobalNavigationButton 导航class name

        if (typeof iTalentGlobal === 'undefined') return
        if ($('.Tenant__Name').length == 0) {
            $('.Header__GlobalNavigationButton').after(`<div class="Tenant__Name">
    <div class="Tenant__Name-name">${iTalentGlobal.tenantInfo.abbreviation}</div>
</div>`);
        }
        $('.Tenant__Name').after(`<div class="Tenant__Name">
    <div class="Tenant__Name-name" style="cursor:pointer;" data-clipboard-text="${iTalentGlobal.tenantInfo.tenantId}">
        ${iTalentGlobal.tenantInfo.tenantId}</div>
</div>`);
        addTanentDic(iTalentGlobal.tenantInfo.tenantId,iTalentGlobal.tenantInfo.abbreviation)
        addClipboard('.Tenant__Name-name')
    }

    function logTools() {
        //$('#TenantID').val(100741)
        //$('#AppName').val('openapi.italent.cn.sso')
        //$('button[data-id="AppName"]').children().eq(0).text('openapi.italent.cn.sso')
        if(window.location.pathname == '/OpsAdmin/errortracker/DebugExceptionCounts'){
            appendHtmlByAppName()
            appendHtmlByTenant()
            appendHtmlByMessage()
        }
    }

    $('#search').on('click', function () {
        addItem('projects', $('#AppName').val())
        appendHtmlByAppName()
        addItem('tenantids', $('#TenantID').val())
        appendHtmlByTenant()
        //addItem('messages', $('#Message').val())
        //appendHtmlByMessage()
    })

    function appendHtmlByMessage() {
        $('#quick_start_messages').remove()
        var temp = GMgetValue('messages', [])
        if (temp.length == 0) return
        var html = spliceUL(temp, 'messages-item')
        $('body').append(`<div id="quick_start_messages"
    style="position: absolute;top: 320px;left: 879px;z-index: 9999;cursor: pointer;transition: width .5s;max-width:900px;overflow-x: auto;white-space: nowrap;">
    ${html}</div>`)
    }

    function appendHtmlByTenant() {
        $('#quick_start_tenantid').remove()
        var temp = GMgetValue('tenantids', [])
        if (temp.length == 0) return
        var html = spliceUL(temp, 'tenantids-item')
        $('body').append(`<div id="quick_start_tenantid"
    style="position: absolute;top: 60px;left: 280px;z-index: 9999;cursor: pointer;transition: width .5s;max-width:1400px;overflow-x: auto;;white-space: nowrap;">
    ${html}</div>`)
    }

    function appendHtmlByAppName() {
        $('#quick_start_appname').remove()
        var temp = GMgetValue('projects', [])
        if (temp.length == 0) return
        var html = spliceUL(temp, 'projects-item')
        $('body').append(`<div id="quick_start_appname"
    style="position: absolute;top: 10px;left: 280px;z-index: 9999;cursor: pointer;transition: width .5s;max-width:1400px;overflow-x: auto;;white-space: nowrap;">
    ${html}</div>`)
    }

    function spliceUL(liArr, classname) {
        if (liArr.length == 0) return ''
        return `<ul style="display: flex;list-style: none;margin: 0;padding: 0;">${spliceLI(liArr, classname)}</ul>`
    }

    function spliceLI(arr, classname) {
        arr.sort(function (x, y) {
            return y.count - x.count
        })
        let html = ''
        for (let i = 0; i < arr.length; i++) {
            html += `<li class='${classname}' style="padding: 2px 10px;
        margin: 5px 10px;
        border: 1px #2e9cf991 solid;
        border-radius: 5px;
        background-color: rgba(46, 156, 255, .05);
        color: #2e9cff;
        display: flex;"><div class="${classname}-text" data-name='${arr[i].name}' style="overflow: hidden;text-overflow:ellipsis;">${getTanentItem(arr[i].name)}</div><a class="${classname}-remove" data-name='${arr[i].name}' style='margin-left: 10px;font-weight: 900;'>╳</a></li>`
        }
        return html
    }

    $(document).on('click', '.projects-item-remove', function (e) {
        var name = $(e.target).data('name')
        removeItem('projects', name)
        appendHtmlByAppName()
    })

    $(document).on('click', '.projects-item-text', function (e) {
            var name = $(e.target).data('name')
            $('#AppName').val(name)
            $('button[data-id="AppName"]').children().eq(0).text(name)
    })

    $(document).on('click', '.tenantids-item-remove', function (e) {
        var name = $(e.target).data('name')
        removeItem('tenantids', name)
        appendHtmlByTenant()
    })

    $(document).on('click', '.tenantids-item-text', function (e) {
            var name = $(e.target).data('name')
            $('#TenantID').val(name)
    })

    $(document).on('click', '.messages-item-remove', function (e) {
        var name = $(e.target).data('name')
        removeItem('messages', name)
        appendHtmlByMessage()
    })

    $(document).on('click', '.messages-item-text', function (e) {
            var name = $(e.target).data('name')
            $('#Message').val(name)
    })


    function addItem(key, name) {
        if (!name) return
        var res = GMgetValue(key, [])

        var obj = res.filter((el, index) => {
            return el.name === name
        })
        log(obj)
        if (!obj || obj.length === 0) {
            res.unshift({ id: s4(), name: name, count: 1 })
        } else {
            obj[0].count++
        }
        GMsetValue(key, res)
    }

    function removeItem(key, name) {
        var res = GMgetValue(key, [])

        let index = -1;
        res.map((el, i) => {
            if (el.name == name) index = i
        })

        if (index >= 0) {
            res.splice(index, 1)
        }
        GMsetValue(key, res)
    }

    function GMgetValue(key, defaults,appendCurHostByKey=true) {
        key = appendCurHostByKey ? `${currentHost}_${key}`:key
        return GM_getValue(key, defaults)
    }
    function GMsetValue(key, val,appendCurHostByKey=true) {
        key = appendCurHostByKey ? `${currentHost}_${key}`:key
        return GM_setValue(key, val)
    }

    function contain(hosts, key) {
        let result = false;
        let keys = Object.keys(hosts)
        for (let i = 0; i < keys.length; i++) { if (hosts[keys[i]].indexOf(key) != -1) { result = true } } return result;
    }

    function addTanentDic(key,name){
        var dic = GM_getValue('tanent_dic',{})
        let keys = Object.keys(dic)
        if(keys.indexOf(key)==-1){
            dic[key] = {tenantid:key,name:name,createtime:new Date().toJSON()}
        }
        GM_setValue('tanent_dic',dic)
    }

    function getTanentItem(key){
        var dic = GM_getValue('tanent_dic',{})
        let keys = Object.keys(dic)
        if(keys.indexOf(key)==-1){
            return key
        }
        return `${dic[key].name}|${key}`
    }
    //需要在选择器对应的html元素中添加 data-clipboard-text="${需要复制的值}"
    function addClipboard(selector){
        // 2、实例化（参数内是要触发事件源对象元素）
        var clipboard = new ClipboardJS(selector);
        // 4、注意的是，可以直接使用on来绑定，而不是jquery的里面的on哦。绑定成功的函数
        clipboard.on('success', function (e) {
            console.info(e.text);
            e.clearSelection();
        }, 'error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        })
    }

    function s4() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); }

    function log(log) { console.log(log) }
})();
