// ==UserScript==
// @name         NGA赞踩
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  查看赞踩比
// @author       WLXC
// @license      MIT
// @match        *://bbs.ngacn.cc/read.php*
// @match        *://bbs.nga.cn/read.php*
// @match        *://nga.178.com/read.php*
// @match        *://ngabbs.com/read.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454527/NGA%E8%B5%9E%E8%B8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/454527/NGA%E8%B5%9E%E8%B8%A9.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
(function() {
    for (var key in commonui.postArg.data){
        var ll = document.getElementById('postcontentandsubject'+key);
        if(ll===null)
        {ll= document.getElementById('postcommentcontentandsubject'+key);}
        if(ll===null){
            ll= document.getElementById('postcomment_'+key);
        }
        var il = ll.getElementsByClassName('white');
        for (var i = 0; i < il.length; i++){
            if(il[i].getAttribute('title') == '反对'){
                var span = document.createElement('span');
                span.innerHTML='&nbsp;&nbsp;&nbsp;赞:'+commonui.postArg.data[key].score+'&nbsp;/&nbsp;踩:'+commonui.postArg.data[key].score_2;
                span.classList.add('white');
                span.title='只能在有对应版面的权限才能看到这个点踩数';
                var par=il[i].parentNode;
                par.appendChild(span,il[i]);
                console.log(commonui.postArg);
            }
        }
    }
})();