// ==UserScript==
// @name         git合并提醒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gitlab 主分支合并提醒
// @author       ray
// @match        http://xxxxx/*
// @icon         https://www.google.com/s2/favicons?sz=64
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472395/git%E5%90%88%E5%B9%B6%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/472395/git%E5%90%88%E5%B9%B6%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
function run()
{
    //var merge_button = !!document.getElementsByClassName('btn accept-merge-request btn-confirm btn-md gl-button');
    var merge_button = !!document.getElementsByClassName("btn hide-collapsed btn-default btn-md gl-button")[1];
    var target_branch = !!document.getElementsByClassName("gl-text-blue-500! gl-font-monospace gl-bg-blue-50 gl-rounded-base gl-font-sm gl-px-2 gl-display-inline-block gl-text-truncate gl-max-w-26 gl-mx-2")[1];
    var target_text = '';
    if(target_branch){
        var target_branch_dom = document.getElementsByClassName("gl-text-blue-500! gl-font-monospace gl-bg-blue-50 gl-rounded-base gl-font-sm gl-px-2 gl-display-inline-block gl-text-truncate gl-max-w-26 gl-mx-2")[1];
        target_text = target_branch_dom.innerText;
        target_branch_dom.style.backgroundColor = '#fc3930';
        target_branch_dom.style.fontSize = '20px';
    }
    if(target_text == 'master' || target_text == 'main')
    {
        var message="此页面将合并 " + target_text +"!!!";
        alert(message);
    }
    console.log(target_text);
    console.log(111, merge_button);
    if(merge_button)
    {
        //var merge_button_dom = document.querySelector('.btn.accept-merge-request.btn-confirm.btn-md.gl-button');
        var merge_button_dom = document.getElementsByClassName("btn hide-collapsed btn-default btn-md gl-button")[1];
        console.log('XCXCX11CX',merge_button_dom);
        merge_button_dom.style.backgroundColor = '#fc3930';
        merge_button_dom.addEventListener('click', (a) => {
            a.preventDefault();
             if(confirm("确认合并【" + target_text + "】??")){
               return true;
            }
        });

    }
}

(function() {
    'use strict';
    setTimeout(() => {
         run();
    }, 1000)
    /*window.onload = function(){
        run();
    }*/
})();