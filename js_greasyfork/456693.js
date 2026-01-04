// ==UserScript==
// @name         知轩藏书显示好评
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  知轩藏书显示好评,支持www.zxcs.info和zxcs.me
// @author       Gavin
// @match        http://zxcs.me/
// @match        https://www.zxcs.info/
// @match        http://zxcs.me/sort/*
// @match        https://www.zxcs.info/sort/*
// @match        http://zxcs.me/tag*
// @match        https://www.zxcs.info/tag*
// @match        http://zxcs.me/?plugin*
// @match        https://www.zxcs.info/map.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zxcs.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456693/%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6%E6%98%BE%E7%A4%BA%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/456693/%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6%E6%98%BE%E7%A4%BA%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    let url=window.location.href;
    let list=document.querySelectorAll('.mlist ul li a');
    let urlfirst='https://www.zxcs.info';
    if(url.startsWith('http://zxcs.me/')){
        urlfirst='http://zxcs.me';
    }
    if(url.startsWith(urlfirst+'/sort/')||url.startsWith(urlfirst+'/tag')){
        list=document.querySelectorAll('dl dt a');
    }
    if(url.startsWith(urlfirst+'/?plugin')){
        list=document.querySelectorAll('tbody a');
    }
    if(url.startsWith(urlfirst+'/map.html')){
        list=document.querySelectorAll('#content a');
    }
    list.forEach(a=>{
        if(a.href.startsWith(urlfirst)){
        let b=a.href.split('/');
        let id=b[b.length-1];
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(urlfirst+"/content/plugins/cgz_xinqing/cgz_xinqing_action.php?action=show&id="+id+"&m="+Math.random(), requestOptions)
            .then(response => response.text())
            .then(result => {
            let pj = result.split(',');
            let pjstr='仙'+pj[0]+'粮'+pj[1]+'干'+pj[2]+'枯'+pj[3]+'毒'+pj[4];
            if(url.startsWith(urlfirst+'/sort/')||url.startsWith(urlfirst+'/?plugin')||url.startsWith(urlfirst+'/tag')||url.startsWith(urlfirst+'/map.html')){
                let newstr1= '&nbsp<span style="color: firebrick;"   >'+(pj[0]>500?'★仙':'仙')+pj[0]
                       +'</span><span style="color: blueviolet;">粮'+pj[1]+'</span>'
                       +'</span><span style="color: darkgoldenrod;">干'+pj[2]+'</span>'
                       +'</span><span style="color: darkslateblue;"  >枯'+pj[3]+'</span>'
                       +'</span><span style="color: darkgreen;"   >毒'+pj[4]+'</span>';
                if(url.startsWith(urlfirst+'/sort/')||url.startsWith(urlfirst+'/tag')||url.startsWith(urlfirst+'/map.html')){
                    newstr1='<br />'+newstr1;
                }
                a.innerHTML+=newstr1;
            }
            else{
                if(!a.title){
                    a.title=a.innerHTML;
                }
                let newstr='<span title="'+pjstr+'" style="color: darkgreen;">毒'+pj[4]+'</span><span style="color: firebrick;">'+(pj[0]>500?'★仙':'仙')+pj[0]+'</span>';
                a.innerHTML=a.innerHTML.replace( /\([\u4e00-\u9fa5]+\)》/,'》');
                a.innerHTML=a.innerHTML.replace('》','》'+newstr);
            }
        })
            .catch(error => console.log('error', error));
        }

    })
})();