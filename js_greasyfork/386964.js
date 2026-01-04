// ==UserScript==
// @name         GitLab Merge Checker
// @namespace    http://git.jd.com/
// @version      0.3
// @description  GitLab Merge Checker 京东云CDN内部用
// @author       XieZhida
// @match        http://git.jd.com/*/merge_requests/*
// @match        https://git.jd.com/*/merge_requests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386964/GitLab%20Merge%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/386964/GitLab%20Merge%20Checker.meta.js
// ==/UserScript==

function check_merge(){
    if(document.getElementsByClassName('award-control-text').length==0){
        return
    }

    // 判断有没有 cr_exempt label 
    let label_pass = false ;
    for(let i = 0; i < document.getElementsByClassName('label').length; i++){
        if(document.getElementsByClassName('label')[i].innerText != 'cr_exempt'){
            label_pass = true;
            break;
        }
    }

    if(document.getElementsByClassName('award-control-text')[0].innerText==0 && !label_pass){
        // 没有点赞 且 没有cr_exempt label
        if (document.getElementsByClassName('accept-merge-request').length>0){
            document.getElementsByClassName('accept-merge-request')[0].disabled='disabled';
        }
    }else{
        // 有点赞
        if (document.getElementsByClassName('accept-merge-request').length>0){
            document.getElementsByClassName('accept-merge-request')[0].disabled='';
        }
    }
}
check_merge();
window.setInterval(check_merge,100);
