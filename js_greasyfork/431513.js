// ==UserScript==
// @name         百度搜索辅助
// @license MIT
// @description  本脚本功能：作用于https://www.baidu.com/*，增加一个搜索列表，可快速对列表里的站点进行搜索。本脚本永久开源，永久免费。本脚本不得被用于任何的非法用途，仅能被合法的学习和使用。
// @namespace    https://greasyfork.org/users/718683
// @author       runwithfaith
// @match        https://www.baidu.com/*

// @version 0.0.1.20230314092558
// @downloadURL https://update.greasyfork.org/scripts/431513/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/431513/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
function 添加样式(css,id='') {//植入css
    const style = document.createElement('style');
    style.type='text/css';
    id!=''?style.id = id:0;
    style.textContent = css;
    const h0 =document.querySelector('html');
    h0.insertBefore(style,h0.children[0]);
}
function 插入元素(父亲,标签,内容) {//插入元素(document.body,'标签','内容','idk','true');插入元素(document.head,'标签','内容','idk','true',1);
    const 新元素 = document.createElement(标签)
    新元素.appendChild(document.createTextNode(内容));
    let 插入位置=0;
    let 长 = arguments.length
    if (长>3) {
        if(长%2==0){//如果是偶数
            插入位置=arguments[长-1]
            长--
        }
        for(let i=3;i<长;i+=2){
            新元素.setAttribute([arguments[i]],arguments[i+1])
        }
    }
    return 父亲.insertBefore(新元素,父亲.children[插入位置])
}
添加样式(`.head_nums_cont_inner{top: 0px!important;}.my{z-index:9999;height:40px}#page{position: fixed!important;top: 50%;right: 35px;}`);
插入元素(document.head,'script',
     `
     function changer (e){
    const n = e.options[e.selectedIndex].value;
    const o = queryReplace("site");
    if ("" == n){
        ns_c({
            fm: "advTool",
            qid: bds.comm.qid,
            title: encodeURI("站内检索:" + n),
            rsv_advTool_si: encodeURI(n)
        });
        baseChangeUrl("wd=" + encodeURIComponent(o) + "&si=&ct=0")
    }
    else {
        if (!n.match(/^[\\w\\-_]+(.[\\w\\-_]+)+$/)) {
            //$(".c-tip-timerfilter-si-error").show();
            return;
        }
        //$(".c-tip-timerfilter-si-error").hide()
        ns_c({
            fm: "advTool",
            qid: bds.comm.qid,
            title: encodeURI("站内检索:" + n),
            rsv_advTool_si: encodeURI(n)
        });
        baseChangeUrl("wd=" + encodeURIComponent(o) + "&si=" + encodeURIComponent(n) + "&ct=2097152")
    }
    e.children[0].selected = true;
}
     `);

const documentFragment = document.createDocumentFragment();

const ul = document.createElement('select');
ul.setAttribute('class','my');
ul.id='myselecyor';
ul.setAttribute('onchange','changer(this)');


/*
*/
//site:tieba.baidu.com
const data = {
            ' ':'', 知乎:'zhihu.com',贴吧:'tieba.baidu.com',豆瓣:'douban.com',菜鸟教程:'runoob.com',微博:'weibo.com',百度网盘:'pan.baidu.com','developer.mozilla.org':'developer.mozilla.org',
            bilibili:'bilibili.com',吾爱破解:'52pojie.cn',stackoverflow:"stackoverflow.com",公众号:'mp.weixin.qq.com','3dm':'bbs.3dmgame.com',qzzn:'bbs.qzzn.com',博客园:'cnblogs.com','gov.cn':'gov.cn',www阮一峰:'www.ruanyifeng.com',思否:'segmentfault.com',脚本之家:'jb51.net',谷歌:'google.com',CSDN:'csdn.net',宽带山:'wap.kdslife.com',虎扑:'bbs.hupu.com',百度知道:'zhidao.baidu.com',经管之家:'bbs.pinggu.org',greasyfork:'greasyfork.org'};
const len=data.length;

for (const key in data) {
    //alert(key + '=' + data[key]);
    const li = document.createElement('option');
    li.innerText=key;
    li.value=data[key];
    documentFragment.appendChild(li);
}
ul.appendChild(documentFragment);
document.querySelector('.tools').appendChild(ul);


