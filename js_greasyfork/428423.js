// ==UserScript==
// @name     Facebook (Insert View Post Button)
// @match    https://www.facebook.com/*
// @match    http://www.facebook.com/*
// @icon     https://www.google.com/s2/favicons?domain=facebook.com
// @run-at   document-start
// @grant    GM_addStyle
// @author   JZersche (Free Release)
// @require  https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @version 1.02
// @namespace https://greasyfork.org/users/95175
// @description
// @description Inserts a View Post button when browsing photos on Facebook — e.g. Navigates away from the standard theater view
// @downloadURL https://update.greasyfork.org/scripts/428423/Facebook%20%28Insert%20View%20Post%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428423/Facebook%20%28Insert%20View%20Post%20Button%29.meta.js
// ==/UserScript==

let i = 0;

setMutationHandler({
    target: document,
    selector: '.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d3f4x2em.fe6kdd0r.mau55g9w.c8b282yb.iv3no6db.gfeo3gy3.a3bd9o3v.knj5qynh.oo9gr5id',
    handler: nodes => nodes.forEach(node => {
        setTimeout(function(){
            try{if(window.location.href.match(/facebook\.com\/photo\/\?fbid\=\d+\&set\=a\.\d+/)[0] && i == 0) {
                let p1 = node.children[0].children[0].children[0].children[0].children[0].href.match(/com\/\w+/)[0].substring(4);
                let p2 = node.children[0].children[0].children[0].children[0].children[0].href.substring(25).replace('?__tn__=-UC*F','');
                console.log(p1);
                console.log(p2);


                if(p1.length !== p2.length) {var pagename = p2}
                if(!pagename) {pagename = document.getElementsByClassName('aahdfvyu')[1].children[0].children[0].children[0].href.match(/facebook\.com\/\S+\?/)[0].replace('facebook.com/','').replace('?','')}
                let albumid = window.location.href.match(/\d+/g)[1];
                let postid = window.location.href.match(/\d+/g)[0];
                var j = 1;
                nodes[j].setAttribute('style','border:1px solid #f000;');
                if(nodes[j].parentNode.classList == 'ecm0bbzt e5nlhep0 a8c37x1j') {j = 0;}

                nodes[j].insertAdjacentHTML('afterend',`
                <div class="viewpost" style="background: #000; width: 67px; text-align: center; border-radius: 4px; margin-top: 6px; border: 1px solid #fff; line-height: 14px;font-size: 14px; padding: 3px;">\
                <span style="color:#fff;font-weight:600;font-family:inherit;"><a style="text-decoration:none;" href="https://www.facebook.com/`+pagename+`/posts/`+postid+`">View Post</a></span></div>`);
                i = 1;
            }}catch(e){}
            try{if(window.location.href.match(/facebook\.com\/photo\/\?fbid\=\d+\&set\=pb\.\d+\.\-\d+\.\./)[0] && i == 0) {
                console.log('B');
                nodes[1].setAttribute('style','border:1px dashed #f000;');
                i = 1;
            }}catch(e){}
            try{if(window.location.href.match(/facebook\.com\/\d+\/photos\/a\.\d+\/\d+/)[0] && i == 0) {
                console.log('C');
                nodes[2].setAttribute('style','border:1px solid #0f00;');
                i = 1;
            }}catch(e){}
            try{if(window.location.href.match(/facebook\.com\/photo\.php\?fbid\=\d+\&set\=pb\.\d+\.\-\d+\.\.\&type\=3/)[0] && i == 0) {
                console.log('D');
                nodes[2].setAttribute('style','border:1px solid #00f0;');
                i = 1;
            }}catch(e){}
            try{if(window.location.href.match(/facebook\.com\/\w+.+\/photos\/a\.\d+\/\d+/)[0] && i == 0) {
                console.log('E');
                console.log(node);

                if(window.location.href.match(/https:\/\/www\.facebook\.com\/\w+.+\/photos/)[0].replace('https://www.facebook.com/','').replace('/photos','')){
                    var pagename = window.location.href.match(/https:\/\/www\.facebook\.com\/\w+.+\/photos/)[0].replace('https://www.facebook.com/','').replace('/photos','');
                }

                let albumid = window.location.href.match(/\d+/g)[0];
                let postid = window.location.href.match(/\d+/g)[1];

                node.setAttribute('style','border:1px solid #f0f0;');
                if(node.parentNode.classList === 'a8nywdso j7796vcc rz4wbd8a l29c1vbm' || node.parentNode.classList === 'j7796vcc') {alert(node.parentNode.classList)};
                node.insertAdjacentHTML('afterend',`
                <div class="viewpost" style="background: #000; width: 67px; text-align: center; border-radius: 4px; margin-top: 6px; border: 1px solid #fff; line-height: 14px;font-size: 14px; padding: 3px;">\
                <span style="color:#fff;font-weight:600;font-family:inherit;"><a style="text-decoration:none;" href="https://www.facebook.com/`+pagename+`/posts/`+postid+`">View Post</a></span></div>`);
                i = 1;
            }}catch(e){}


        },5000)
    })
})