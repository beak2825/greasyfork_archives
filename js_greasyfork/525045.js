// ==UserScript==
// @name         知乎专栏免登录查看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将 zhuanlan.zhihu.com 重定向到 zhuanlan.fxzhihu.com，以实现免登录查看知乎专栏。重定向后的页面自带净化圣体，仅展示文章。
// @author       Object Shadow
// @match        *://zhuanlan.zhihu.com/*
// @grant        none
// @license      MIT
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ZQBg/2cAv/9lAP7/ZgD//2YA//9mAf//ZgD//2YA//9mAP//ZgD//2YA//9mAP//ZgD//2YA//9mAf7/ZgH//2YB//9lAP//ZgD//2YB/v9nAP7/agH//2sA//9sAe7/bwC//3EAXwAAAAAAAAAAAAAAAAAAAAD/YAAQ/2YAz/9lAP7/ZgD//2YA//9lAP7/ZgD//2YA//9mAP//ZgD//2YB/v9lAf7/ZgH//2UA//9mAf7/ZgH//2YA//9mAP//ZgH//2YA//9nAf//aAD//2kA//9rAP//bAD//24A//9wAP//cQD+/3QAv/9wABAAAAAAAAAAAP9lAb//ZQH+/2YA//9mAP//ZgH//2YA//9mAP//ZgD//2YA//9mAP//ZgD//2YA//9mAP//ZwH//2YA//9mAf7/ZgD//2YA//9mAP//ZwD//2gA/v9qAP//bAD//2wB/v9uAP//cAD//3IA//9zAP//dQD//3cAzwAAAAD/ZgBf/2YA//9mAP//ZgH+/2YA//9mAP//ZgH//2YA//9lAP7/ZgH//2YB/v9lAP7/ZgD//2UB/v9lAP7/ZgH+/2UB/v9mAP//ZgH//2cA//9pAP//agD//2wA//9uAP//bwD//3AA//9xAf7/dAD//3UA//92AP//eAH//3kAX/9nAL//ZQD//2YB//9mAP//ZgD//2YA//9mAP//ZgD//2UA/v9lAP7/ZgD//2YA//9mAf//ZgD//2YA//9mAP//ZgH//2cB//9nAP//aQD//2sA//9sAP//bgH//28B/v9wAP7/cgH//3MA//91AP7/dgD//3gA//95AP7/ewC//2YB7v9mAf//ZgD//2UA/v9mAf//jUD//59g//+MQP//ZgD//2UA/v9lAf7/ZgH//2YA//9lAP7/ZgD//2UA/v9mAf7/aAD//2kA//9rAP//bAH+/20A/v9vAP//cQH+/3MA//9zAf7/dQD+/3YA//95AP//egD//3sB/v99Af//ZgD//2YB/v9lAP//ZgD//2UA/v+gYP//9e/////////Yv///eSD+/2YA//9mAP//ZgH//2UA/v9mAf//xaD//2gA//9qAf//awD//2wB/v/JoP//lED//3EA//9zAP//dAD//3YB//93AP//eAD+/3oA//97AP//fQH+/38A//9lAP7/ZgH//2YA//9mAP//ZgD//2YA//+CMP//9e/////////s3///ZgD//2YB/v9lAP7/ZgD//6lw////////cxD//2wA//9tAP//bgD///bv////////wpD//30R//91Af7/eAD//3kA//96AP7/fAH//30B/v+AAf//gAD//2YA//9mAP7/ZgD//2YA//9mAP//ZgD//2YA//+fYP////////////+zgP7/ZQH+/2YA//96If//9e////////9+IP//pGD//////////////////////////////////////////////////3wA/v9+Af//gAD//4AA/v+CAP7/ZQD+/2YA//9mAf//ZgH//2UA//9mAf//ZgH+/2YA///FoP///////+zf//95IP//ZwD//9m/////////2r///20B//+lYP//////////////////l0D//9Wv////////////////////////fgD//4AB//+AAf7/ggD+/4QB//9mAP//ZgD//2YA//9mAP//ZgD//2YA//9mAf//ZgH+/3gh/v///////////6Fg//+scP7///////bv//+AIP7/bwD+/6Zg////////3L///3UA//92Af7/eAD//3oA//+LIP////////////+AAP//gQH+/4IB/v+EAP//hQD//2YA//9mAP//ZQD+/2YB//9nAf//ZgD//2UB/v9mAP//ZgD//8ag////////2r///+zf////////rnD//3AA//9xAP//p2D////////dv///dwD+/3kA//95Af7/fAD//40h/v///////////4IA//+DAP//hQD//4YA//+IAP//ZgH+/2YA//9mAP//ZgD//2YA//9mAf//ZQD+/2YA//9nAP//jkD+///////27///fyD//8CQ//9wAP//cQH+/3MA//+oYP///////96///95AP//egD+/3wB//9+Af//jyD/////////////gwD//4UA//+HAf//iAH//4kA//9mAf7/ZgD//2YA//9mAP//ZgH//2YA//9mAP//ZgD+/2gB/v9qAP//9u////////+JMf7/cAH//3EA//9zAP//dAH+/6lg////////3r///3sB//99Af//fQD+/38A//+RIf7///////////+FAf//hwH//4gB/v+KAP//igH+/2YB//9mAf7/ZgH+/2YA//9mAf//cBD//3oh/v97IP7/fSD//34g///kz////////51Q//9xAf7/cwD//3UA//92AP//q2H+///////ev///fQD//34A//9/AP//gAH+/5Ig/////////////4cA//+JAf//iQD+/4sA/v+NAf7/ZgD//2YB//9mAf7/ZgD//2YB/v+9kP///////////////////////////////////////////////////////+7f//+tYP7//////9+///9+Af//gAH+/4EA//+DAP//lCD/////////////iQH//4oB//+MAf//jgH//48A//9mAP//ZgH//2YB/v9mAP//aAD//3wg///av///7N///+3f///t3///9u/////////37///7t///+7f///v3///zp///61g////////37///4AB//+BAP//gwD//4QA/v+VIP////////////+LAf//jAD//44B//+PAP//kQD+/2YB//9mAP//ZwD//2kA//9pAP//awD//20B//9uAP7/cAD//3EA//+5gP///////8uf//93AP//eQH//3oA/v97AP//rmD////////gv///ggD//4MB/v+FAP//hgH+/5ch/v///////////4wA/v+OAP//jwD//5EA//+TAf7/ZgD//2cA//9pAf//agD//2wA//9tAP//bwD//3AA//9yAP//cwD//7mA////////zJ///3kA//97Af//fAD//34A//+vYP///////+C///+EAP//hQD//4cA//+HAf7/mCD/////////////jwD//5AA/v+RAf//kwH+/5QA//9nAP//aQH//2oB/v9sAf7/bQD//5tQ//+vcP7/ehH+/3QB//91AP//uoD////////Nn///ewD//3wB/v9+AP//gAD//7Bh////////4L///4UA//+HAP7/iAD//4oB/v+aIP////////////+QAP//kgD//5MA//+UAP//lwD+/2kA//9qAP//bAD//20A//9vAP//lED////////u3///hyD//3cB//+8gP///////86f//98AP//fgD//4AA//+BAP//sWD////////gv///iAH//4kA//+KAP//jAH//5sg/////////////5IB//+TAf//lQD//5cB/v+YAP//agD+/20B//9uAf//cAH//3EA//9yAP//3L/////////DkP//eAH+/7yA////////z5///34A//+AAf//gQD//4MB/v+yYP///////+G///+JAf//igD//4wA//+OAP//nSD/////////////lAH//5UA//+XAf7/mAD//5oA//9sAf7/bgH+/3AA//9xAP//cwD//3QA/v+pYP////////fv///ev///79/////////37///37///9+////fv///s2D//7Nh////////9+///+G////jv///47///+O////jv/////////////+VAP//lwD+/5gA//+aAP//mwD//24A//9wAP//cQD//3MA/v91AP//dgD//4gg//////////////////////////////////////////////////+0YP//tGD//////////////////////////////////////////////////5gA/v+ZAf//mgD//5wA//+eAf//cQD//3EB/v9zAP//dQD//3YA//94AP//eQH+/9av////////x5D//6BA/v+hQP//oUD//6NA/v+kQP//pUD//4kB//+REf//qUD//6pA//+rQP//rED//61A//+uQP//r0D//7BA//+yQP//mQD//5sA/v+cAf//ngD+/58A//9yAP//dAH//3UA//92AP//eAH+/3kA/v97Af//rWD////////nz///gQD//4IA//+FAf//hgH//4cA/v+JAP//igD+/4wA//+NAP//jwD//5AA//+SAf7/kwD//5YB/v+WAP//mAD//5oA/v+bAP//nQH//54A/v+fAP//oQD//3QA//91Af//dwD//3gA//96Af//ewD//30A//9/AP//t3D///fv//+TIP7/hAD//4UA//+HAP//iAD+/4sA//+MAf//jQD//48A//+RAf//kgH//5QA//+VAP//lwH+/5gB/v+aAP//mwH//50B//+eAP//oAD+/6EA//+jAO//dwG//3cA//95AP//egH+/3sA//99AP//fwD//4AA//+CAf//hAD//4UA//+GAP7/hwH+/4kA//+LAf7/jAD//44B/v+PAP//kQH+/5MA//+VAf7/lQD//5cA//+YAP//mgD//5wB//+dAP//nwH//6AA//+iAf//owH//6QAv/94AGD/eQH//3oA//98Af//fgH//4AA//+AAP//ggH//4MA//+FAP7/hgH//4gA//+KAP//iwH//40A//+OAP//kAD//5EA//+TAP//lQD//5YB/v+XAP//mQD//5sA/v+cAf7/nQH//58A//+gAP//ogH//6MA//+lAP//pgBfAAAAAP96Ac//fAD//34B/v+AAf//gQD//4IB//+DAf7/hgH//4YA/v+IAf7/igH+/4sB/v+NAP//jgD+/5AA/v+RAP//kwD+/5UA//+XAP7/lwD//5kA//+aAP//nAD//54B/v+fAP//oQD//6IB//+kAf7/pQD//6cAvwAAAAAAAAAA/4AAEP99AL//gAH+/4EA//+DAP//hAH+/4UA//+HAf//iQH//4oA//+LAP//jQH+/44A//+QAP//kgH+/5QA/v+UAP//lgD//5gA//+ZAP//mwD//5wA//+dAP//nwH//6EB//+iAf//owD//6UA//+nAM//nwAQAAAAAAAAAAAAAAAAAAAAAP+BAF//gwC//4QA7/+FAP7/hwD//4kB/v+KAP//jAD//40A//+QAf7/kAD//5IB//+UAf//lQD//5cA//+YAP//mgH+/5sA//+dAf7/ngD//58A//+hAP//owH//6QA//+lAL//pgBfAAAAAAAAAAAAAAAA4AAAB4AAAAGAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAeAAAAc=
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525045/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/525045/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的主机名
    const hostname = window.location.hostname;

    // 检查主机名是否为 zhuanlan.zhihu.com
    if (hostname === 'zhuanlan.zhihu.com') {
        // 获取当前页面的链接
        const currentUrl = window.location.href;

        // 构建 URL 对象
        const url = new URL(currentUrl);

        // 将 URL 对象中的主机名改为 zhuanlan.fxzhihu.com
        url.hostname = 'zhuanlan.fxzhihu.com';

        // 将当前页面指向 URL 对象解析得到的字符串
        window.location.href = url.toString();
    }
})();