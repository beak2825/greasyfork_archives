// ==UserScript==
// @name            Userscript1
// @namespace       https://greasyfork.org/zh-CN
// @author          xn
// @description     None
// @include         *.f12key.xyz*
// @icon            https://fw.f12key.xyz/img/favicon.ico
// @version         0.1
// @downloadURL https://update.greasyfork.org/scripts/436711/Userscript1.user.js
// @updateURL https://update.greasyfork.org/scripts/436711/Userscript1.meta.js
// ==/UserScript==
// xidig.wam,fdwyc.wam,nxyyc.wam,bogym.wam,5tiig.wam,m3zxw.wam,ltai.wam,.f3i.wam,wfby.wam,qjfxy.wam,xnfhy.wam,j3zxw.wam
// m3zxw.wam,fdwyc.wam,nxyyc.wam,bogym.wam,.f3i.wam,ltai.wam,wfby.wam,qjfxy.wam,xnfhy.wam,j3zxw.wam
(function() {
    'use strict';
    const i18n = new Map([
//        ['xidig.wam', '二期1号'],
        ['fdwyc.wam', '二期2号'],
        ['nxyyc.wam', '二期3号'],
        ['bogym.wam', '二期4号'],
//        ['5tiig.wam', '二期5号(何俊)'],
        ['m3zxw.wam', '二期1号'],
        ['ltai.wam', '远强(三期)'],
        ['.f3i.wam', '远强(一期)'],
        ['wfby.wam', '林垦'],
        ['qjfxy.wam', '远煌'],
        ['xnfhy.wam', '湛辉'],
        ['j3zxw.wam', '涂总'],
        ['FISHING BOAT', '渔船'],
        ['CHAINSAW', '电锯'],
        ['MINING EXCAVATOR','挖掘机'],
        ['BRONZE MEMBER', '铜牌会员'],
        ['SILVER MEMBER', '银牌会员'],
    ])

    start()
    setInterval(start,10000);

    function start(){
        console.clear();
        replaceText(document.body)
        const bodyObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
            })
        })
        bodyObserver.observe(document.body, { childList: true, subtree: true })
    }

    function replaceText(node) {
      nodeForEach(node).forEach(htmlnode => {
        i18n.forEach((value, index) => {
          const textReg = new RegExp(index, 'g')
          if (htmlnode instanceof Text && htmlnode.nodeValue.includes(index))
            htmlnode.nodeValue = htmlnode.nodeValue.replace(textReg, value)
          else if (htmlnode instanceof HTMLInputElement && htmlnode.value.includes(index))
            htmlnode.value = htmlnode.value.replace(textReg, value)
        })
      })
    }

    function nodeForEach(node) {
      const list = []
      if (node.childNodes.length === 0) list.push(node)
      else {
        node.childNodes.forEach(child => {
          if (child.childNodes.length === 0) list.push(child)
          else list.push(...nodeForEach(child))
        })
      }
      return list
    }

var counter = 1000;
var myFunction = function(){
    clearInterval(interval);
    interval = setInterval(myFunction, counter);
    var timeToEnd = document.querySelector(".badge.ssm.mr-2.red.darken-4");
    if (timeToEnd) {
        console.info("farmersworld:时间到了!");

        if(window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function(status) {

                var options = {
                    body: '时间到了!时间到了!时间到了!时间到了!时间到了!时间到了!时间到了!时间到了!时间到了!时间到了!时间到了!时间到了!时间到了!时间到了!',
                    silent: true
                }
                var notification = new Notification('农民世界', options);
            });
        }

        counter = 20000;
    } else {
        console.info("farmersworld:None");
        counter = 5000;
    }
}
var interval = setInterval(myFunction, counter);
})();
