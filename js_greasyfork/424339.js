// ==UserScript==
// @name     Facebook (Show URLS on Posts)
// @description Shows Full Timestamps on Facebook Posts
// @icon     https://www.google.com/s2/favicons?domain=facebook.com
// @match    https://www.facebook.com/*
// @match    https://*.facebook.com/*
// @match    http://www.facebook.com/*
// @match    http://*.facebook.com/*
// @run-at   document-start
// @grant    GM_addStyle
// @author   JZersche
// @require  https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @version 1.01
// @namespace https://greasyfork.org/users/95175
// @downloadURL https://update.greasyfork.org/scripts/424339/Facebook%20%28Show%20URLS%20on%20Posts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424339/Facebook%20%28Show%20URLS%20on%20Posts%29.meta.js
// ==/UserScript==

let event = new MouseEvent('pointerover', {'bubbles': true});

setMutationHandler({
    target: document.querySelector('.qzhwtbm6.knvmm38'),
    selector: '.oajrlxb2.gpro0wi8.b1v8xokw',
    handler: nodes => nodes.forEach(node => {
        setTimeout(function(){
            node.dispatchEvent(event);
            setTimeout(function(){
                if(node.href.length>100 && !node.outerHTML.match('tm_injection') && window.location.href.match(/facebook\.com\/\w+/) && !node.href.match(/hashtag/)) {
                    //node.parentNode.parentNode.nextSibling.innerText = ' · ';
                    console.log('node');
                    try{node.parentNode.parentNode.nextSibling.innerHTML = node.parentNode.parentNode.nextSibling.innerHTML.replace('·',''); let date = new Date(); let _time_ = date.toLocaleTimeString(); let month = date.getMonth()+1;let day = ' '+date.getDate();let year = ' '+date.getFullYear();let Hr = date.getHours(), Min = date.getMinutes(), Sec = date.getSeconds();
                        node.parentNode.parentNode.nextSibling.nextSibling.insertAdjacentHTML('afterend','<span class="additional" style="display:block;"><a href="#" class="add_button_1"><br>Archive Date: '+month+day+year+' at '+_time_+'</a></span>');
                        node.parentNode.parentNode.nextSibling.nextSibling.nextSibling.setAttribute('style','display:inline;');

                        /* Remove Second Archive Date */
                        let ArchiveDate2 = document.getElementsByClassName('d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j keod5gw0 nxhoafnm aigsh9s9 d9wwppkn fe6kdd0r mau55g9w c8b282yb mdeji52x e9vueds3 j5wam9gi knj5qynh m9osqain hzawbc8m')[1].children[0];
                        ArchiveDate2.removeChild(ArchiveDate2.children[4])

                        document.getElementsByClassName('add_button_1')[0].setAttribute('style','color:#fff!important;padding-left:2px;padding-right:2px;font-weight:600;letter-spacing:0.75px;padding-top:2px;');

                        //setTimeout(function(){ console.log(node.parentNode.parentNode.nextSibling.nextSibling.nextSibling); },1050);
                        //setTimeout(function(){ console.log(node.parentNode.parentNode.nextSibling.nextSibling.innerText); },1050);

                       }catch(e){}
                    node.href = node.href.replace(node.search,'').replace(/photos/,'posts').replace(/\/a\.\d+/,'');
                    //node.href = node.href.match(/(\d+\/)/)[0].replace('/','');
                    node.href = node.href.replace(/(\/posts\/\d+)\//,'$1');
                    node.href;
                    try{node.insertAdjacentHTML('beforeend','<br /><span class="tm_injection"> '+node.href.match(/\.com\/.+/)[0].replace('.com/','')+'</span>').replace(/photos/,'a');}catch(e){}
                    //alert(node.href);
                    //node.children[0].setAttribute('style','background-image: linear-gradient(to left, white 50%, green 60%, white 60%, blue 70%, violet 80%);-webkit-background-clip: text;');
                    //node.children[2].setAttribute('style','background-image: linear-gradient(to left, violet, blue, green, red, white);-webkit-background-clip: text;');
                }
            },222)
        },3000);
    return false})
})