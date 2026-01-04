// ==UserScript==
// @name         stcn屏蔽特定用户
// @namespace    acngamer.com
// @version      0.33
// @description  本脚本用于屏蔽stcn指定用户的主题以及回复
// @author       DL9412
// @match        https://keylol.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372305/stcn%E5%B1%8F%E8%94%BD%E7%89%B9%E5%AE%9A%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/372305/stcn%E5%B1%8F%E8%94%BD%E7%89%B9%E5%AE%9A%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const jq = window.jQuery;
    //重写ajax添加监听
    function ajaxEventTrigger(event) {
        var ajaxEvent = new CustomEvent(event, { detail: this });
        window.dispatchEvent(ajaxEvent);
    }
    var oldXHR = window.XMLHttpRequest;
    function newXHR() {
        var realXHR = new oldXHR();
        realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
        realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
        realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
        realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
        realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
        realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
        realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
        realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
        return realXHR;
    }
    window.XMLHttpRequest = newXHR;

    window.addEventListener('ajaxReadyStateChange', function (e) {
        if(e.detail.readyState == 4){
            setTimeout(function(){hideuser();},1000)
        }
    });
    window.addEventListener('ajaxAbort', function (e) {
    });

    var blacklist = JSON.parse(localStorage.ublocklist || '[]');

    //此处填写stcn用户uid，单人格式为[xxxxx]，多人格式为[xxxxxx,xxxxxx]
    var uid=[];
    uid = new Array(...(new Set([...blacklist,...uid])))
    localStorage.ublocklist = JSON.stringify(uid);
    var hidetitle=1;
    var hidereply=1;
    hideuser();
    if(/^\/suid-\d+$/.test(location.pathname))
        manageuser();
    function hideuser(){
        console.info('hidestart');
        var type=0;
        var bd = document.getElementById('nv_forum');
        if(!bd)
            return;
        if(bd.className == 'pg_forumdisplay'){
            type = 0;
        }else if(bd.className == 'pg_viewthread'){
            type = 1;
        }else if(bd.className == 'pg_index'){
            type = 2;
        }else if(bd.className == 'pg_guide'){
            type = 3;
        }
        var hide = 0;
        if(type == 0 && hidetitle == 1){
            for(let i=0;i<uid.length;i++){
                let nowuid = uid[i];
                let reg = new RegExp("uid="+nowuid,'g');
                let replylist = document.getElementsByClassName('by-author');
                for(let j=0;j<replylist.length;j++){
                    let author = replylist[j].getElementsByClassName('threadlist-blue-text');
                    if(author[0].href.search(reg)!= -1){
                        replylist[j].parentNode.style.display = 'none';
                        hide++;
                    }
                }
            }
        }else if(type == 1 && hidereply == 1){
            let replylist = document.getElementsByClassName('xw1');
            for(let m=0;m<uid.length;m++){
                let nowuid = uid[m];
                let reg = new RegExp("suid-"+nowuid,'g');
                for(let n=0;n<replylist.length;n++){
                    if(!replylist[n].href)
                        continue;
                    if(replylist[n].href.search(reg)!= -1){
                        jq(replylist[n]).parents('table').hide();
                        hide++;
                    }
                }
            }
            jq('body').append('<style>.addToBlockList{float:right;margin-right:20px;font-size:18px;line-height:18px;font-weight:bold;cursor:pointer}</style>');
            jq(document).off('click','.addToBlockList');
            jq(document).on('click','.addToBlockList',function(){
                let adduid = jq(this).attr('uid');
                let adduname = jq(this).attr('uname');
                uid.push(adduid);
                localStorage.ublocklist = JSON.stringify(uid);
                jq(this).parents('table').hide();
            })
            for(let n=0;n<replylist.length;n++){
                if(!replylist[n].href)
                    continue;
                if(replylist[n].parentNode.getElementsByClassName('addToBlockList').length > 0)
                    continue;
                let sp = document.createElement("span");
                let adduidstr = replylist[n].href.match(/suid-\d{6}/)[0];
                let adduid = adduidstr.replace('suid-','');
                let adduname = replylist[n].innerText;
                replylist[n].parentNode.appendChild(sp);
                sp.innerText = '+';
                sp.className = 'addToBlockList';
                sp.setAttribute("uid",adduid);
                sp.setAttribute("uname",adduname);
                sp.setAttribute("title",'添加用户'+adduname+'至黑名单');
            }
        }else if(type == 2 && hidetitle == 1){
            for(let x=0;x<uid.length;x++){
                let nowuid = uid[x];
                let reg = new RegExp("suid-"+nowuid,'g');
                let replylist = document.getElementsByTagName('em');
                for(let z=0;z<replylist.length;z++){
                    let ema = replylist[z].getElementsByTagName('a');
                    if(ema.length>0){
                        if(ema[0].href.search(reg)!= -1){
                            replylist[z].parentNode.style.display = 'none';
                            hide++;
                        }
                    }
                }
            }
        }else if(type == 3 && hidetitle == 1){
            for(let m=0;m<uid.length;m++){
                let nowuid = uid[m];
                let reg = new RegExp("suid-"+nowuid,'gi');
                let replylist = document.getElementsByTagName('tbody');
                for(let n=0;n<replylist.length;n++){
                    if(!replylist[n].id)
                        continue;
                    let taguser = replylist[n].getElementsByTagName('cite')[0].getElementsByTagName('a')[0];
                    if(taguser.href.search(reg)!= -1){
                        replylist[n].style.display = 'none';
                        hide++;
                    }
                }
            }
        }
        console.info('共隐藏'+hide+'条主题/回复')
    }
    function manageuser(){
        jq('#manageblock').remove();
        jq('#wp').after('<div id="manageblock" class="wp cl"></div>');
        jq('#wp').after('<style>#manageblock{padding:10px 0;background:white;margin-top:20px}.blockline{line-height:30px;height:30px;border-bottom:1px solid #ccc;width:50%;float:left;box-sizing:border-box;padding:0 30px}.blockline:nth-of-type(2n+1){border-left:1px solid #ccc}.blockline:hover{background:#ececec}.blockline a{line-height:30px;font-size:16px;text-decoration:none}.blockline span{cursor:pointer;font-size:18px;float:right}.blockline:nth-last-of-type(2),.blockline:nth-last-of-type(1){border-bottom: none;}</style>');
        jq('#manageblock').append('<div style="height:30px;line-height:30px;font-size:16px;padding-left:20px;padding-bottom:10px;font-weight:bold;">屏蔽管理</div>');
        uid.forEach(ele=>{
            var str = '<div class="blockline"><a href="https://steamcn.com/suid-'+ele+'" target="_blank" class="blockuser">'+ele+'</a><span class="removeblock" uid="'+ele+'">X</span></div>'
            jq('#manageblock').append(str);
        })
        jq(document).off('click','.removeblock');
        jq(document).on('click','.removeblock',function(){
            let buid = jq(this).attr('uid');
            let tmp = new Set(uid);
            tmp.delete(buid);
            uid = new Array(...tmp);
            localStorage.ublocklist = JSON.stringify(uid);
            manageuser();
        })
    }
})();