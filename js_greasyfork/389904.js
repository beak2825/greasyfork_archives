// ==UserScript==
// @name         BuaaGsmisTool
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  查看选课系统的班级容量, 修复已选课无法查看详情bug
// @author       wang0.618@qq.com
// @match        http://gsmis.buaa.edu.cn/qdwebpages/index.html*
// @match        https://gsmis.e.buaa.edu.cn/qdwebpages/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389904/BuaaGsmisTool.user.js
// @updateURL https://update.greasyfork.org/scripts/389904/BuaaGsmisTool.meta.js
// ==/UserScript==

(function () {
    'use strict';
        var css = ".Course-name h3 { z-index: 100;}",
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    
    // https://dmitripavlutin.com/catch-the-xmlhttp-request-in-plain-javascript/
    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send;

    function openReplacement(method, url, async, user, password) {
        this._url = url;
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        if (this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;
        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {
        var resp = this._onreadystatechange.apply(this, arguments);

        var that = this;
        setTimeout(function () {

            if (that.readyState === 4 && that.status === 200 && that._url.startsWith('/api/yuXuanKeApiController.do?findKcxxList')) {
                var res = JSON.parse(that.responseText);

                var courses = document.getElementsByClassName('Course-name');
                //console.log(courses);
                for (var i = 0; i < courses.length; i++) {
                    var info = res['attributes']['kclb'][i];
                    var curr = courses[i];
                    var p = curr.getElementsByTagName('p');
                    if(p[0].innerText.indexOf(info['kch'])===-1){
                        console.warn("BuaaGsmisTool脚本遇到错误，无法找到当前课程的可选人数",info['kch'],p[0].innerText);
                    }else{
                        for(var idx in p)
                            if(p[idx].innerText.indexOf('已预选')!==-1){
                                p[idx].innerText = '已预选/总：' + info['dqyxrs'] + '/' + info['kxrs'];
                                break;
                            }
                    }
                }
            }
        }, 200);

        return resp;
    }

    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;
})();