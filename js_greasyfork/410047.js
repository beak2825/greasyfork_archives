// ==UserScript==
// @name         FB Post Screenshot [JZers]
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Take Screenshots of Facebook Posts
// @author       You
// @run-at   document-idle
// @grant    GM_addStyle
// @require https://greasyfork.org/scripts/12228-setmutationhandler/code/setMutationHandler.js?version=175122
// @match    https://www.facebook.com/*
// @match    https://*.facebook.com/*
// @match    http://www.facebook.com/*
// @match    http://*.facebook.com/*
// @downloadURL https://update.greasyfork.org/scripts/410047/FB%20Post%20Screenshot%20%5BJZers%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/410047/FB%20Post%20Screenshot%20%5BJZers%5D.meta.js
// ==/UserScript==

let i = 0;

let feed, post, post_header, post_menu, save_screenshot_button;

function revealHREFs() {
    setMutationHandler({
        target: document,
        selector: '.b1v8xokw',
        handler: nodes => nodes.forEach(node => {
            var event1 = new MouseEvent('pointerover', {bubbles: true});
            node.dispatchEvent(event1);

        })

    })
} revealHREFs();

function pollPosts() {
    setMutationHandler({
        target: document,
        selector: '.pybr56ya.btwxx1t3.j83agx80.ll8tlv6m',
        handler: nodes => nodes.forEach(node => {
            if(!node.parentNode.innerText.includes('SCR')) {
                node.setAttribute('style','border-top:2px solid #404040;');
                node.insertAdjacentHTML('beforebegin','<span class="save_screenshot" style="background:#303135;border-top:0;border-left:1px solid #222;border-right:0;border-bottom:0;border-radius:2px;color:#bbb;display:inline-block;width:auto;height:24px;padding-left:10px;padding-right:12px;line-height:18px;font-size:14px;position:relative;left:410px">Screenshot</span>');

                node.previousSibling.addEventListener("click", function(){
                    this.toggleText = function () {
                        if (this.style.color == 'rgb(187, 187, 187)') {
                            this.style.color = 'rgb(255, 187, 187)';
                        } else {
                            this.style.color = 'rgb(187, 187, 187)';
                        }

                    };
                    this.toggleText();
                    //alert(this.className);
                    setTimeout( function() {
                        node.previousSibling.style.color = 'rgb(100, 255, 100)';
                    },4000);
                    setTimeout( function() {
                        node.previousSibling.style.color = 'rgb(187, 187, 187)';
                    },10000);

                    var permalink = event.target.nextSibling.childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
                    /*.replace(/([^?]+)(\?.*)?/, '$1?comment_id=1');*/

                    let post_window = window.open(
                        permalink,
                        's',
                        'width=600, height=600, left=237, top=270, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no'
                    );
                    if (!permalink) {return;}
                });
            }
        })
    })
} pollPosts();

if(document.readyState === 'complete') {
    var interval = setInterval(function() {

        if(document.querySelector('.gile2uim')) {
            feed = document.querySelector('.gile2uim');
            post = feed.querySelector('.du4w35lb.k4urcfbm.l9j0dhe7.sjgh65i0');
            post_header = post.querySelector('.pybr56ya.btwxx1t3.j83agx80.ll8tlv6m');
            post_menu = post_header.childNodes[2].childNodes[0];
            console.log('Feed:',feed,'\nPost:',post,'\nPost Header:',post_header,'\nPost Menu:',post_menu);
            save_screenshot_button = post_header.previousSibling;
            console.log('Screenshot Button:',save_screenshot_button);
            clearInterval(interval);
        } i++; if(i==5) {
            console.log('Loading Elements ...'+i);
        }
    }, 1000);
}
