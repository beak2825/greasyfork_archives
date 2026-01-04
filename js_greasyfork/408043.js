// ==UserScript==
// @name         评论js
// @icon         https://gss3.bdstatic.com/84oSdTum2Q5BphGlnYG/timg?wapp&quality=80&size=b150_150&subsize=20480&cut_x=0&cut_w=0&cut_y=0&cut_h=0&sec=1369815402&srctrace&di=e246473450c11e6d3a7a7b1b9a3eabef&wh_rate=null&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2Fdbb44aed2e738bd42308f542ae8b87d6277ff99c.jpg
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Anonymous
// @match        https://www.bilibili.com/video/BV1Ai4y1G7tC*
// @description  要用脚本打败脚本
// @description  match后面可以改成其他bv号（后面一定要加星号*）
// @description  可写多行match，在不同网页刷
// @downloadURL https://update.greasyfork.org/scripts/408043/%E8%AF%84%E8%AE%BAjs.user.js
// @updateURL https://update.greasyfork.org/scripts/408043/%E8%AF%84%E8%AE%BAjs.meta.js
// ==/UserScript==
//不会油猴的可以访问以下网站
//本脚本非原创，改自https://paste.ubuntu.com/p/ctpdyhtzh9/
//本脚本仅供学习交流，因滥用引发的后果，本人不负责
//建议使用小号，防封

var inter = 180000;//延时（单位ms，建议6500以上防封）
var str = "评论js : https://paste.ubuntu.com/p/ctpdyhtzh9/\n咩2016恶行合集\n咩与塞尔达：cv3338968\n咩与东方圈：cv3889041\n咩在pvz圈：cv6994671\n咩在黑乐谱圈：cv6939408\n\n\n"; //双引号内改成评论内容（不要直接输入回车，\n是换行）
var fun = () => {
    var id = "ID:" + Math.floor(Math.random() * 9999+10000);//生成5位id防重复
    document.getElementsByClassName("ipt-txt")[0].value = id + '\n' + str;//输出评论
    document.getElementsByClassName('comment-submit')[0].click();//模拟点击发送
};
setInterval(fun, inter);//不断循环运行