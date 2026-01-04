// ==UserScript==
// @name         掘金一键收藏
// @namespace    https://gist.github.com/KnIfER
// @version      0.1
// @description  右击收藏按钮一键收藏，左键单击仍为多文件夹。通过菜单设置一键收藏到哪些文件夹！
// @author       You
// @match        *://juejin.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/472978/%E6%8E%98%E9%87%91%E4%B8%80%E9%94%AE%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/472978/%E6%8E%98%E9%87%91%E4%B8%80%E9%94%AE%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function gc(c, d) {
        return (d||document).getElementsByClassName(c)[0];
    }

    function gcp(c, d) {
        var p = d||document;
        while(p) {
            if(p.classList && p.classList.contains(c)) return p;
            p = p.parentNode;
        }
        return p;
    }

    function gcs(c, d) {
        return (d||document).getElementsByClassName(c);
    }

    function stop(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function match(text, matcher, stEd) {
        matcher = matcher.split(';');
        for(var i=0;i<matcher.length;i++){
            var m = matcher[i].trim(), ln=m.length;
            if(ln>0) {
                if(ln==1) {
                    if(m=='*') return 1;
                    if(m=='^' && (stEd&1)) return 1;
                    if(m=='v' && (stEd&2)) return 1;
                }
                if(text.includes(m)) return 1;
            }
        }
    }


    var matchers = '默认';
    if(typeof GM_getValue != undefined) {
        matchers = GM_getValue('fav_folders', matchers);
    }

    GM_registerMenuCommand('选择收藏夹', function(){
        var tmp = prompt("请输入收藏夹名称，用分号分隔。特殊：^匹配顶部,v匹配底部,*匹配全部", matchers);
        if(tmp && tmp.trim().length>0) {
            matchers = tmp;
            GM_setValue('fav_folders', matchers)
        }
    });
    GM_registerMenuCommand('⭐ 查看收藏夹', function(){
        gc('avatar-wrapper').click();
        setTimeout(function(){
            var ud = gc('user-detail').innerHTML;
            var idx = ud.indexOf('/user/');
            var uid = ud.slice(idx+6, ud.indexOf('\"', idx));
            console.log('uid', uid);
            GM_openInTab(`https://juejin.cn/user/${uid}/collections`, false);
        }, 350);
    });

    document.addEventListener('contextmenu', (e)=>{
        console.log(e.target);


        var tpc = 'panel-btn', tBtn = e.target, cc=5;
        while(tBtn && cc-->0) {
            if(tBtn.classList.contains(tpc)) break;
            tBtn = tBtn.parentNode;
        }


        if(tBtn.classList.contains(tpc)) {
            console.log('found', tBtn);
            if(gc('icon-collect', tBtn)) {
                console.log('检测到右击收藏按钮');
                tBtn.click();
                stop(e);
                setTimeout(function(){
                    var dlg = gc('modal-wrap');
                    var checks = gcs('checkbox-icon byte-checkbox__wrapper', dlg);
                    console.log('检测到右击收藏按钮', gcp(checks[0]));
                    var chosen = 0;
                    for(var i=0,ln=checks.length;i<ln;i++){
                        var ck = checks[i];
                        var stEd=0;
                        if(i==0) stEd|=1;
                        if(i==ln-1) stEd|=2;
                        if(match(gcp('list-item', ck).innerText, matchers, stEd)) {
                            console.log('点击checkbox', ck);
                            ck.click();
                            chosen = 1;
                        }
                    }
                    if(!chosen) checks[0].click();
                    setTimeout(function(){
                        gc('confirm-btn', dlg).click();
                    }, 200);
                }, 500);
            }

        }

    });



    // Your code here...
})();