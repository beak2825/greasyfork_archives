// ==UserScript==
// @name         pdawiki论坛隐藏贴快捷回复
// @namespace    mudan_cn
// @version      0.25
// @description:zh-cn  pdawiki论坛快捷回复
// @author       mudan_cn
// @match    *://www.pdawiki.com/forum/*
// @match    *://pdawiki.com/forum/*
// @grant        none
// @description pdawiki论坛快捷回复
// @downloadURL https://update.greasyfork.org/scripts/37576/pdawiki%E8%AE%BA%E5%9D%9B%E9%9A%90%E8%97%8F%E8%B4%B4%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/37576/pdawiki%E8%AE%BA%E5%9D%9B%E9%9A%90%E8%97%8F%E8%B4%B4%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
var d=document,msg = ['感谢楼主制作和分享',
    ''
];		//回复的句子，有需要还可以自己添加。
var mo = new MutationObserver(function(rec){
    rec.map(function(){
        if((txt=append_parent.querySelector('textarea'))){
            txt.value=msg[Math.floor(Math.random()*msg.length)];
            mo.disconnect();
        }
    });
});
[].forEach.call(d.querySelectorAll('.locked'), function(e){
    if(/^(?:.*隐藏)(?:.*回复).*$/.test(e.innerText)){
        mo.observe(append_parent,{'childList':true, 'subtree':true});
        e.querySelector('a').click();
    }
});
[].forEach.call(d.querySelectorAll('.jammer'),function(e){//新增去除干扰字符
    e.parentNode.removeChild(e);
});

var enemy=[196625,147948,166050,117321,202629],
    auth=["\u5927\u50bb\u903c","\u6211\u5988\u6b7b\u4e86","\u8349\u6211\u5988\u4e2a\u903c"];
enemy=enemy.map(function(e){
    return '.pi>.authi>a[href*="'+e+'"]';
}).join(',');
[].forEach.call(d.querySelectorAll(enemy),function(e){
    e.innerText=auth[Math.floor(Math.random()*auth.length)];}
);