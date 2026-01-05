// ==UserScript==
// @name        Jimu Assistance
// @namespace     http://tampermonkey.net/
// @version      0.5
// @description    Jimu expires assistance
// @author       zgldh
// @match        https://box.jimu.com/Account/CreditAssign/Owned
// @match        https://box.jimu.com/CreditAssign/Init/*
// @grant        none
// 1. 本插件仅提供逾期数据显示，使用者自行甄别数据真假。
// 2. 本插件不对数据的及时性和真实性负责。不对使用者做出的任何投资决断负责。
// 如您无法接受以上两点，请立即卸载此脚本。
// @downloadURL https://update.greasyfork.org/scripts/27588/Jimu%20Assistance.user.js
// @updateURL https://update.greasyfork.org/scripts/27588/Jimu%20Assistance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var titles = null;
    var eventAttached = false;

    runTimer();

    function runTimer()
    {
        var timer = setInterval(function(){
            if(typeof(window.$)== 'function')
            {
                titles = $('#ownedListContainer tr td.title,.table.table-responsive tr td');
                if(titles.length>=1 && titles.text() !== '正在加载中')
                {
                    clearInterval(timer);
                    start();

                    if(eventAttached === false)
                    {
                        attachEvent();
                        eventAttached = true;
                    }
                }
            }
        },1000);
    }

    function start()
    {
        var projectNumbers = [];
        $('#ownedListContainer tr').css('position','relative');
        titles.css('position','relative');
        titles.each(function(index){
            var title = $(this);
            var projectNumber = getProjectNumber(title.find('span a').text().trim());
            if(projectNumber)
            {                
                projectNumbers.push(projectNumber);
                var expiresDiv = $('<div class="project-'+projectNumber+' expires-assistance">Loading...</div>');
                expiresDiv.css({
                    position: 'relative',
                    width: '100%'
                });
                title.append(expiresDiv);
            }
        });

        $.get('https://jimu-assistance.zgldh.com/expires?'+encodeProjectNumbers(projectNumbers))
            .then(function(results){
            for(var index in projectNumbers)
            {
                var projectNumber = projectNumbers[index];
                setupProjectExpires(projectNumber,results[projectNumber]);
            }
        });
    }

    function getProjectNumber(str)
    {
        var pattern = /.*\s([\d-]*)/;
        var result = pattern.exec(str);
        if(result && result.length>=2)
        {
            return result[1];
        }
        return null;
    }

    function encodeProjectNumbers(projectNumbers)
    {
        $.unique(projectNumbers);
        var numbers = [].concat(projectNumbers);
        for(var index in numbers)
        {
            numbers[index] = 'n[]='+numbers[index];
        }
        var str = numbers.join('&');
        return str;
    }

    function setupProjectExpires(projectNumber, expires)
    {
        var expiresDiv = $('.project-'+projectNumber).empty();
        if(!expires || expires.length === 0)
        {
            expiresDiv.append('<span style="color: green">没有逾期记录</span>');
            return true;
        }
        expires.sort((a,b)=>a>b);
        var expireSpan = null;
        var expireDate = null;
        for(var index in expires)
        {
            expireDate = expires[index];
            expireSpan = $('<span class="expire-date" title="'+expireDate+'"></span>');
            expireSpan.css({
                display: 'inline-block',
                width: '20px',
                height: '20px',
                background: 'red',
                color: 'white',
                'border-radius': '10px',
                'margin-right': '5px'
            });
            expiresDiv.append(expireSpan);
        }
        if(expireSpan)
        {
            expireSpan.text(expireDate).css({
                'font-size': '12px',
                'padding': '0 5px',
                'width': 'auto'
            });
            var def = ( new Date() - Date.parse(expireDate)) / 1000 / 60 / 60 / 24  ;
            if(def >= 60)
            {
                expiresDiv.find('.expire-date').css({
                    background: 'green'
                });
            }
        }
    }

    function attachEvent()
    {
        ajaxSend(window.XMLHttpRequest, function(method, url, data){
            if(url.indexOf('/Account/CreditAssign/OwnedInvest') !== -1)
            {
                runTimer();
            }
        });
    }

    function ajaxSend(objectOfXMLHttpRequest, callback) {
        // http://stackoverflow.com/questions/3596583/javascript-detect-an-ajax-event
        if(!callback){
            return;
        }

        var s_ajaxListener = {};
        s_ajaxListener.tempOpen = objectOfXMLHttpRequest.prototype.open;
        s_ajaxListener.tempSend = objectOfXMLHttpRequest.prototype.send;
        s_ajaxListener.callback = function () {
            // this.method :the ajax method used
            // this.url :the url of the requested script (including query string, if any) (urlencoded)
            // this.data :the data sent, if any ex: foo=bar&a=b (urlencoded)
            callback(this.method, this.url, this.data);
        };

        objectOfXMLHttpRequest.prototype.open = function(a,b) {
            if (!a)  a='';
            if (!b)  b='';
            s_ajaxListener.tempOpen.apply(this, arguments);
            s_ajaxListener.method = a;
            s_ajaxListener.url = b;
            if (a.toLowerCase() == 'get') {
                s_ajaxListener.data = b.split('?');
                s_ajaxListener.data = s_ajaxListener.data[1];
            }
        };

        objectOfXMLHttpRequest.prototype.send = function(a,b) {
            if (!a) var a='';
            if (!b) var b='';
            s_ajaxListener.tempSend.apply(this, arguments);
            if(s_ajaxListener.method.toLowerCase() == 'post') {
                s_ajaxListener.data = a;
            }
            s_ajaxListener.callback();
        };
    }

})();
