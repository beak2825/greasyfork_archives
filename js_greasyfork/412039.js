// ==UserScript==
// @name         智能回复
// @namespace    http://zntx.cc/*
// @version      0.3
// @description  八神智能天下的自动回复
// @author       Yancy986244073
// @match        http://zntx.cc/*
// require      https://code.jquery.com/jquery-3.6.0.min.js
// definition   https://github.com/DefinitelyTyped/DefinitelyTyped/raw/master/types/jquery/index.d.ts
// definition   https://github.com/DefinitelyTyped/DefinitelyTyped/raw/master/types/jquery/JQuery.d.ts
// definition   https://github.com/DefinitelyTyped/DefinitelyTyped/raw/master/types/jquery/JQueryStatic.d.ts
// definition   https://github.com/DefinitelyTyped/DefinitelyTyped/raw/master/types/jquery/misc.d.ts
// definition   https://github.com/DefinitelyTyped/DefinitelyTyped/raw/master/types/jquery/legacy.d.ts

// run-at       document-start
// grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/412039/%E6%99%BA%E8%83%BD%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/412039/%E6%99%BA%E8%83%BD%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
/*function getId() {
    const str = window.location.href;
    var patt = /http:\/\/zntx.cc\/bbs-(.*?).html/;
    const n = patt.exec(str);
  
    return n?n[1]:'';
}
function getCookie(name) {
    var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
}


function sendData() {
  if (getId()){
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://zntx.cc/bbs/book_re.aspx',
        headers: { Referer: window.location.href },
        data: {
            content: '感谢分享' + new Date().getTime(),
            action: 'add',
            id: getId(),
            siteid: 956,
            lpage: 1,
            classid: 2331,
            sid: getCookie('sidzntx'),
            g: '快速回复',
        },
        onload: function (response) {
            console.log(GM_getResourceText('Referer'))
        },
    });
  }

  
}

        // const id=getId();
        // console.log('地址'+id)
        // GM_xmlhttpRequest({
        //     url:'http://zntx.cc/bbs/book_re.aspx',
        //     method:'POST',
        //     data:'content=%E6%84%9F%E8%B0%A2%E5%88%86%E4%BA%AB&action=add&id='+id+'&siteid=956&lpage=1&classid=2331&sid=0AC6A708236C3F8_A73_0542_94917_819561-2-0-0-0-0&g=%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D',
        //     headers:{
        //         'Content-Type': 'text/html; charset=utf-8',
        //         'Cookie': 'sidzntx=0AC6A708236C3F8_A73_0542_94917_819561-2-0-0-0-0; expires=Thu, 06-Apr-2023 06:29:19 GMT; path=/',
        //     'Accept': '',
        //     'Referer': 'http://zntx.cc/bbs-'+id+'.html',
        //     'Host': 'zntx.cc',
        //     'Origin': 'http://zntx.cc',
        //     },
        //     onload:function(xhr){
        //         console.log(xhr.responseText)
        //     }
        // })
console.log('==> Script start.', window.location.href)

*/
// function getId() {
//     const str = window.location.href;
//     var patt = /http:\/\/zntx.cc\/bbs-(.*?).html/;
//     const n = patt.exec(str);
//     return n?n[1]:'';
// }
// $(document).ready(function(){
// var info =$('.infoTip')
// var input =$('#content')
//     if (info && info.text() === '此处内容被隐藏，评论后才能查看。') {

//         input.val(input.text()+new Date().getTime());
//         var submit = $('.open2')[0];
//         submit.click();
//     }
//       // 返回主题
//     var back = $('.bt2')[0];
//     if (back&&back.firstChild.textContent === '返回主题') {
//         back.firstChild.click();
//     }
//     var back2 = $('.bt4')[0];
//     if (back2&&back2.children[2].textContent === '返回主题') {
//         back2.children[2].click();
//     }
// })

(function () {
    'use strict';
    //  获取是否回复
    var info = document.querySelector('.infoTip');
    var input = document.querySelector('#content');
    if (info && info.textContent === '此处内容被隐藏，评论后才能查看。') {
        input.textContent += new Date().getTime();
        var submit = document.querySelector('.open2');
        submit.click();
    }
    // 返回主题
    var back = document.querySelector('.bt2');
    if (back) {
        if (back.firstChild.textContent === '返回主题') {
            back.firstChild.click();
        }
    }
    var back2 = document.querySelector('.bt4');
    if(back2){
        if (back2.children[2].textContent === '返回主题') {
         back2.children[2].click();
        }
    }
})();
