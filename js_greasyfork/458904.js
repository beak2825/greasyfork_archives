// ==UserScript==
// @name        优丝库输出图片链接
// @namespace   https://greasyfork.org/users/718683
// @author      runwithfaith
// @match       https://yskhd.com/archives/*
// @require     https://greasyfork.org/scripts/435697-myutils/code/myUtils.js?version=1142271
// @description 1.必须有优丝库VIP权限才能用 2.用法点击右上角'get links'按钮即可 3.本脚本永久开源免费,仅供合法使用
// @icon         http://yskhd.com/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_notification
// @version 0.0.1.20230314091832
// @downloadURL https://update.greasyfork.org/scripts/458904/%E4%BC%98%E4%B8%9D%E5%BA%93%E8%BE%93%E5%87%BA%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/458904/%E4%BC%98%E4%B8%9D%E5%BA%93%E8%BE%93%E5%87%BA%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
my.addBtns('get links',e=>{
    const z=my.zone,title=document.title,sc=GM_setClipboard,n=GM_notification,div=my.append('div',z,'');;
    my.append('h1',div,title);
    document.querySelectorAll('[data-fancybox]').forEach((e,index)=>{
        const t=e.children[0].title || title+'-'+index,h=e.href;
        my.append('a',div,h,`href`,h,`download`,t+'.jpg');
        my.append('br',div)
    });
    sc(div.innerText)&n({
        text: '已复制',
        timeout: 3000,
    });
    document.head.remove();
    document.body.remove();
    e.target.remove()
})