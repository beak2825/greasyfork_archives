// ==UserScript==
// @name         sciencedirect+ieeexplore+tandfonline+springer跳转HFUT_无按钮
// @namespace    hanzhang
// @version      1.3.4
// @description  sciencedirect+ieeexplore+tandfonline跳转 HFUT
// @author       hanzhang
// @match        https://www.sciencedirect.com/*
// @match        https://ieeexplore.ieee.org/*
// @match        https://www.tandfonline.com/doi/full/*
// @match        https://www.tandfonline.com/doi/epdf/*
// @match        https://1link.springer.com/*
// @match        https://1www.springer.com/*
// @match        https://pubsonline.informs.org/doi/abs/*
// @match        https://pubsonline.informs.org/doi/full/*
// @match        https://pubsonline.informs.org/doi/epdf/*
// @match        https://onlinelibrary.wiley.com/doi/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/403707/sciencedirect%2Bieeexplore%2Btandfonline%2Bspringer%E8%B7%B3%E8%BD%ACHFUT_%E6%97%A0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/403707/sciencedirect%2Bieeexplore%2Btandfonline%2Bspringer%E8%B7%B3%E8%BD%ACHFUT_%E6%97%A0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var html_title=new Array()
    html_title[0]= "www.sciencedirect.com"
    html_title[1]= "ieeexplore.ieee.org"
    html_title[2]= "www.tandfonline.com"
    html_title[3]= "www.springer.com"
    html_title[4]= "link.springer.com"
    html_title[5]="pubsonline.informs.org"
    html_title[6]="onlinelibrary.wiley.com"
    //let link = location.href;
    let link = window.location.host
    //debugger;
    if(link==html_title[0])
    {
        link = location.href;
        link = link.replace('www.sciencedirect.com','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421e7e056d234336155700b8ca891472636a6d29e640e');
    }
    else if(link==html_title[1])
    {
         link = location.href;
         link = link.replace('ieeexplore.ieee.org','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421f9f244993f20645f6c0dc7a59d50267b1ab4a9');
    }
    else if(link==html_title[2])
    {
         link = location.href;
        var regex1 = 'https://www.tandfonline.com/doi/full/';
        var flag1 =link.search(regex1);
        if(flag1!=-1)
        {
            link = link.replace('www.tandfonline.com/doi/full/','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421e7e056d233316654780787a0915b267b559aba/doi/pdf/');
        }
        var regex2 = 'https://www.tandfonline.com/doi/epdf/';
        var flag2 =link.search(regex2);
        if(flag2!=-1)
        {
            link = link.replace('www.tandfonline.com/doi/epdf/','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421e7e056d233316654780787a0915b267b559aba/doi/pdf/');
        }
    }
    else if(link==html_title[3])
    {
         link = location.href;
         link = link.replace('www.springer.com','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421fcfe4f976923784277068ea98a1b203a54');
    }
    else if(link==html_title[4])
    {
         link = location.href;
         link = link.replace('link.springer.com','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421fcfe4f976923784277068ea98a1b203a54');
    }
    else if(link==html_title[5])
    {
        link = location.href;
        var regex3 = 'https://pubsonline.informs.org/doi/abs/';
        var flag3 =link.search(regex3);
        if(flag3!=-1)
        {
            link = link.replace('pubsonline.informs.org/doi/abs/','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421e0e2438f283e6459700dc7a596532c2720e61e4bc46e/doi/pdf/');
        }
        var regex4 = 'https://pubsonline.informs.org/doi/epdf/';
        var flag4 =link.search(regex4);
        if(flag4!=-1)
        {
            link = link.replace('pubsonline.informs.org/doi/epdf/','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421e0e2438f283e6459700dc7a596532c2720e61e4bc46e/doi/pdf/');
        }
        var regex5 = 'https://pubsonline.informs.org/doi/full/';
        var flag5 =link.search(regex5);
        if(flag5!=-1)
        {
            link = link.replace('pubsonline.informs.org/doi/full/','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421e0e2438f283e6459700dc7a596532c2720e61e4bc46e/doi/pdf/');
        }
    }
    else if(link==html_title[6])
    {
         link = location.href;
         var regex6 = 'onlinelibrary.wiley.com/doi/abs/';
        var flag6 =link.search(regex6);
        if(flag6!=-1)
        {
            link = link.replace('onlinelibrary.wiley.com/doi/abs/','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421fff94d95293564597c1a88be811b343cb55cc5e3193677/doi/pdf/');
        }
        var regex7 = 'onlinelibrary.wiley.com/doi/epdf/';
        var flag7 =link.search(regex7);
        if(flag7!=-1)
        {
            link = link.replace('onlinelibrary.wiley.com/doi/epdf/','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421fff94d95293564597c1a88be811b343cb55cc5e3193677/doi/pdf/');
        }
        var regex8 = 'onlinelibrary.wiley.com/doi/full/';
        var flag8 =link.search(regex8);
        if(flag8!=-1)
        {
            link = link.replace('onlinelibrary.wiley.com/doi/full/','webvpn.hfut.edu.cn/https/77726476706e69737468656265737421fff94d95293564597c1a88be811b343cb55cc5e3193677/doi/pdf/');
        }
    }
    GM_openInTab(link, { active: true });
})();