// ==UserScript==
// @name         文本通杀屏蔽工具
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  将带有指定词的文本整段屏蔽
// @author       aotmd
// @include      /.*/
// @license MIT
// @run-at document-body
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/461161/%E6%96%87%E6%9C%AC%E9%80%9A%E6%9D%80%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/461161/%E6%96%87%E6%9C%AC%E9%80%9A%E6%9D%80%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
let console = { ...window.console };
console.time=()=>{};
console.timeEnd=()=>{};
/**-----------------------------用户自定义部分[50行]----------------------------------*/
let setting={
    //设置屏蔽样式,[true|false],true为开启,false为关闭:
    黑幕遮罩:false,
    打码屏蔽:true,
    //鼠标移到目标上后持续指定毫秒后再移出则取消屏蔽.
    屏蔽恢复时间:1500,
    //黑幕遮罩启用后,右上角有黑幕开关进行开关,是否记忆开关状态
    记忆黑幕开关状态:false,
};
 
/*通用主文本屏蔽词,作用在全局,示例:let mainArray = ["砖家建议","震惊",];*/
let mainArray = [];
/**
 * title屏蔽词
 * @type Array
 */
let titleArray=[];
/** 特殊全局map,用以替换变动的文本节点[正则],
 * value出现的%%$1%%为需要继续屏蔽值
 * vlaue出现的%%@@$1@@%%将$1转小写,然后继续屏蔽值
 * */
let specialMap = {
    /*转小写再匹配map,范围太广不使用*/
    // "^([a-zA-Z -]+)$":"%%@@$1@@%%",
    // /** 游戏详情页,评分统计 /v\d+ */
    // "^(\\d+) vote[s]? total, average ([\\d.]+) \\(([a-zA-Z -]+)\\)$": "总共$1票, 平均分$2 (%%$3%%)",
    // /** 讨论  */
    // "^discussions \\((\\d+)\\)$": "讨论 ($1)",
    //
    // /**上移->个人页相关 评分说明(下拉列表,选择分数时)*/
    // "^(\\d+) \\(([a-zA-Z -]+)\\)$": "$1 (%%$2%%)",
};
 
 
/*额外map,作用在指定页面*/
let otherPageRules = [
    {
        name:'绯月',
        regular:/bbs\.kfpromax\.com/i,
        Array:["答辩","难蚌","自嗨","垃圾","精日"],
        titleArray:[],
        specialMap:{},
    },
    {
        name:'百度百科女装屏蔽实例',
        regular:/baike.baidu.com\/item\/%E5%A5%B3%E8%A3%85/i,
        Array:["女装",],
        titleArray:["女装",],
        specialMap:{},
    },
    {
        name:'bilibili',
        regular:/bilibili\.com/i,
        Array:["震惊","一小伙","毕业","停播","抑郁","玉玉","流量密码","贵物","答辩","难蚌","自嗨","垃圾","精日","吃饱了","抽象"],
        titleArray:["震惊","一小伙","毕业"],
        specialMap:{},
    },
    {
        name:'bgm',
        /*要屏蔽的页面,使用正则匹配*/
        regular:/bgm\.tv/i,
        /*屏蔽的词的数组*/
        Array:["小丑","答辩","粪作","垃圾"],
        /*屏蔽的title的词的数组*/
        titleArray:[],
        /*正则匹配要屏蔽的词的map*/
        specialMap:{},
        },
    {
        name:'规则说明',
        /*要屏蔽的页面,使用正则匹配*/
        regular:/.*/i,
        /*屏蔽的词的数组*/
        Array:[],
        /*屏蔽的title的词的数组*/
        titleArray:[],
        /*正则匹配要屏蔽的词的map*/
        specialMap:{},
    },
];
/**-----------------------------用户自定义部分结束----------------------------------*/
 
 
/**-----------------------------业务逻辑部分[450行]----------------------------------*/
/** ---------------------------map处理---------------------------*/
let href = window.location.href;
otherPageRules.forEach((item) => {
    //当regular是正则才执行
    if (item.regular !== undefined && item.regular instanceof RegExp) {
        if (item.regular.test(href)) {
            //添加到主map,若存在重复项则覆盖主map
            mainArray=mainArray.concat(item.Array);
            //添加特殊map
            Object.assign(specialMap, item.specialMap);
            //添加titleMap
            titleArray=titleArray.concat(item.titleArray);
            console.log(item.name + ',规则匹配:' + href + '->' + item.regular);
        }
    }
});
//去重
mainArray=Array.from(new Set(mainArray));
titleArray=Array.from(new Set(titleArray));
 
/*object转Map, 正则new效率原因,先new出来*/
(function () {
    let tempMap = new Map();
    let k = Object.getOwnPropertyNames(specialMap);
    for (let i = 0, len = k.length; i < len; i++) {
        try {
            tempMap.set(new RegExp(k[i]), specialMap[k[i]]);
        } catch (e) {
            console.log('"' + k[i] + '"不是一个合法正则表达式');
        }
    }
    specialMap = tempMap;
})();
/** ----------------------------END----------------------------*/
 
/**--------------------------一般函数--------------------------*/
/**
 * 判断字符串是否包含数组中至少一个元素
 * @param array
 * @param value
 * @returns {boolean|*}
 */
function 包含判断(array, value) {
    let len=array.length;
    for (let i=0;i<len;i++){
        if (value.includes(array[i])){
            return array[i];
        }
    }
    return false;
}
/**
 * 递归节点
 * @param el   要处理的节点
 * @param func 调用的函数
 */
function 递归(el, func) {
    const nodeList = el.childNodes;
    /*先处理自己*/
    数据归一化(el,false);
    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        数据归一化(node);
    }
    function 数据归一化(el,recursion=true) {
        if (el.nodeType === 1) {
            //为元素则递归
            if (recursion){
                递归(el, func);
            }
            let attribute, value, flag = false;
            //为input且类型不为隐藏类型
            if (el.nodeName === 'INPUT'&&el.type!=='hidden') {
                value = el.getAttribute('value');
                attribute = 'value';
                if (value == null || value.trim().length === 0) {
                    value = el.getAttribute('placeholder');
                    attribute = 'placeholder';
                }
                flag = true;
            } else if (el.nodeName === 'TEXTAREA') {
                value = el.getAttribute('placeholder');
                attribute = 'placeholder';
                flag = true;
            } else if (el.getAttribute('title')!==null&&
                el.getAttribute('title').length!==0) {
                /*过判断用*/
                value = 'title用过判断value值';
                attribute = 'title';
                flag = true;
            }
            if (!flag) return;
            func(el, value, attribute);
        } else if (el.nodeType === 3) {
            //为文本节点则处理数据
            func(el, el.nodeValue);
        }
    }
}
 
/** 与下方函数结合*/
let observerMap=new Map();
/**
 * 修改后的函数,在触发事件后会对其他相同效果的obs排队依次触发
 * dom修改事件,包括属性,内容,节点修改
 * @param document 侦听对象
 * @param func  执行函数,可选参数(records),表示更改的节点
 */
function dom修改事件(document,func) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;//浏览器兼容
    const config = {attributes: true, childList: true, characterData: true, subtree: true};//配置对象
    const observer = new MutationObserver(function (records,itself) {
        //进入后停止侦听
        let flag=false;
        let obsArr = [];
        let selfIndex=-1;
        let doc=-1;
        //找到当前对象对应的value,和索引,以及k
        for (let key of observerMap.keys()) {
            let t = observerMap.get(key);
            for (let i = 0; i < t.length; i++) {
                if (itself === t[i][0]) {
                    obsArr = t;
                    selfIndex=i;
                    doc=key;
                    flag = true;
                    break;
                }
            }
            if (flag) {
                break;
            }
        }
        if (selfIndex===-1){ console.error('没有找到obs的v');return;}
        /*停止与之相同config的obs*/
        for (let i=0;i<obsArr.length;i++){
            if (JSON.stringify(obsArr[i][1])===JSON.stringify(obsArr[selfIndex][1])){
                obsArr[i][0].disconnect()
            }
        }
        /*调用与之相同config的obs*/
        try {
            for (let i=0;i<obsArr.length;i++){
                if (JSON.stringify(obsArr[i][1])===JSON.stringify(obsArr[selfIndex][1])){
                    obsArr[i][2](records);
                }
            }
        }catch (e) {console.error('执行错误')}
        //启用与之相同config的obs
        for (let i=0;i<obsArr.length;i++){
            if (JSON.stringify(obsArr[i][1])===JSON.stringify(obsArr[selfIndex][1])){
                obsArr[i][0].observe(doc,obsArr[i][1]);
            }
        }
    });
    if (observerMap.get(document)!==undefined){
        let v=observerMap.get(document);
        v.push([observer,config,func]);
        observerMap.set(document,v);
    }else {
        observerMap.set(document,[[observer,config,func]]);
    }
    /*开始侦听*/
    observer.observe(document, config);
}
 
/**
 * 鼠标悬停指定时间后执行
 * @param node 元素
 * @param timeout 指定时间ms
 * @param func 执行函数.
 * @param clearEven 执行一次后移除事件.
 */
function 鼠标悬停指定时间后执行(node, timeout, func,clearEven=true) {
    let clear;
    node.addEventListener('mouseover', f1);
    node.addEventListener('mouseout', f2);
    function f1() {   // 注册移过事件处理函数
        clear = setTimeout(() => {
            func();
            if (clearEven){
                node.removeEventListener("mouseover", f1);
                node.removeEventListener("mouseout", f2);
            }
        }, timeout);
    }
    function f2() {   // 注册移出事件处理函数
        clearTimeout(clear);
    }
}
 
/**--------------------------一般函数结束--------------------------*/
 
(function () {
    /*当body发生变化时执行*/
    dom修改事件(document.body, (records) => {
        console.time('屏蔽,时间');
        for (let i = 0, len = records.length; i < len; i++) {
            递归(records[i].target, 屏蔽);
        }
        console.timeEnd('屏蔽,时间');
    });
    function 屏蔽(node, value, attribute = 'Text') {
        if (value == null || value.trim().length === 0) return;
        value = value.trim();
        /** titleMap翻译*/
        if (attribute==='title'){
            if(node.nodeType === 1&&node.title){
                /*如果为节点类型,且存在title*/
                let f1=包含判断(titleArray,node.title);
                if (!!f1&&node.getAttribute('titleFlag')===null&&node.getAttribute('mainFlag')===null) {
                    node.setAttribute('titleFlag', 'true');
                    let temp=node.title;
                    node.title="屏蔽词:"+f1;
                    // 使用方法
                    鼠标悬停指定时间后执行(node, setting.屏蔽恢复时间-100,()=>{
                        node.setAttribute('title',temp);
                    });
                }
            }
            return;
        }
        /** mainMap翻译*/
        let f1=包含判断(mainArray,value);
        if (!!f1) {
            if (attribute === 'Text') {
                //若为文本节点则为父节点设置遮罩
                if (setting.黑幕遮罩){
                    node.parentNode.classList.add('maskedStatement');
                }
                if (setting.打码屏蔽){
                    if (node.parentNode.getAttribute('mainFlag')===null){
                        let temp=node.nodeValue,nodeTemp=node.parentNode;
                        node.parentNode.title="屏蔽词:"+f1;
                        node.parentNode.style.wordBreak="break-word";
                        node.nodeValue=Array(node.nodeValue.length+1).join('▇');
                        鼠标悬停指定时间后执行(node.parentNode,setting.屏蔽恢复时间,()=>{
                            nodeTemp.setAttribute('mainFlag', 'true');
                            //不知什么原因,这里有时赋值没有体现在页面上
                            node.nodeValue=temp;
                            //重新附加一个用父找子然后更改的.
                            let len=nodeTemp.childNodes.length;
                            for (let i=0;i<len;i++){
                                if (nodeTemp.childNodes[i].nodeValue&&nodeTemp.childNodes[i].nodeValue.includes('▇')){
                                    nodeTemp.childNodes[i].nodeValue=temp;
                                }
                            }
                            try{
                                nodeTemp.removeAttribute('title');
                                node.parentNode.removeAttribute('title');
                            }catch (e) {console.error(e)}
                        })
                    }
                }
            } else {
                //若为通常节点则正常设置遮罩
                if (setting.黑幕遮罩){
                    node.classList.add('maskedStatement');
                }
                if (setting.打码屏蔽){
                    if (node.getAttribute('mainFlag')===null){
                        node.setAttribute('mainFlag', 'true');
                        let temp=value;
                        node.title="屏蔽词:"+f1;
                        node.setAttribute(attribute, Array(value.length+1).join('▇'));
                        鼠标悬停指定时间后执行(node,setting.屏蔽恢复时间,()=>{
                            node.removeAttribute('title');
                            node.setAttribute(attribute,temp);
                        })
                    }
                }
            }
        }else {
            /** specialMap正则翻译*/
            //遍历specialMap,正则替换
            for (let key of specialMap.keys()) {
                /*正则匹配*/
                if (key.test(value)) {
                    /*正则替换*/
                    let newValue = value.replace(key, specialMap.get(key));
 
                    /*若有循环替换符,则进行替换*/
                    let nvs = newValue.split('%%');
 
                    /*如果map的值没有中文,且带%%%%,则设置flag为true*/
                    let flag = false;
                    if (!/[\u4E00-\u9FA5]+/.test(specialMap.get(key))
                        && nvs.length !== 1 && nvs.length % 2 === 1) {
                        flag = true;
                    }
                    if (nvs.length !== 1 && nvs.length % 2 === 1) {
                        for (let i = 1; i < nvs.length; i += 2) {
                            /*转小写*/
                            let low = nvs[i].split('@@');
                            if (low.length === 3) {
                                nvs[i] = low[1].toLowerCase();
                            }
                            /*匹配mainMap*/
                            if (!!包含判断(mainArray,nvs[i])) {
                                /*若找到map,则重新置flag为false*/
                                flag = false;
                            }
                        }
                        newValue = nvs.join('')
                    }
                    if (flag) {/*如果替换式没有中文,且%%%%也没有匹配,则跳过*/
                        continue;
                    }
                    let f1=key;
                    if (attribute === 'Text') {
                        //若为文本节点则为父节点设置遮罩
                        if (setting.黑幕遮罩){
                            node.parentNode.classList.add('maskedStatement');
                        }
                        if (setting.打码屏蔽){
                            if (node.parentNode.getAttribute('mainFlag')===null){
                                let temp=node.nodeValue,nodeTemp=node.parentNode;
                                node.parentNode.title="屏蔽词:"+f1;
                                node.parentNode.style.wordBreak="break-word";
                                node.nodeValue=Array(node.nodeValue.length+1).join('▇');
                                鼠标悬停指定时间后执行(node.parentNode,setting.屏蔽恢复时间,()=>{
                                    nodeTemp.setAttribute('mainFlag', 'true');
                                    //不知什么原因,这里有时赋值没有体现在页面上
                                    node.nodeValue=temp;
                                    //重新附加一个用父找子然后更改的.
                                    let len=nodeTemp.childNodes.length;
                                    for (let i=0;i<len;i++){
                                        if (nodeTemp.childNodes[i].nodeValue&&nodeTemp.childNodes[i].nodeValue.includes('▇')){
                                            nodeTemp.childNodes[i].nodeValue=temp;
                                        }
                                    }
                                    try{
                                        nodeTemp.removeAttribute('title');
                                        node.parentNode.removeAttribute('title');
                                    }catch (e) {console.error(e)}
                                })
                            }
                        }
                    } else {
                        //若为通常节点则正常设置遮罩
                        if (setting.黑幕遮罩){
                            node.classList.add('maskedStatement');
                        }
                        if (setting.打码屏蔽){
                            if (node.getAttribute('mainFlag')===null){
                                node.setAttribute('mainFlag', 'true');
                                let temp=value;
                                node.title="屏蔽词:"+f1;
                                node.setAttribute(attribute, Array(value.length+1).join('▇'));
                                鼠标悬停指定时间后执行(node,setting.屏蔽恢复时间,()=>{
                                    node.removeAttribute('title');
                                    node.setAttribute(attribute,temp);
                                })
                            }
                        }
                    }
                    break;
                }
            }
        }
    }
})();
 
 
/**-----------------------------黑幕控制----------------------------------*/
if (setting.黑幕遮罩) {
//屏蔽样式:
    let styleElement = addStyle(`
.maskedStatement:hover,maskedStatement:active/*, 
.maskedStatement a:hover,maskedStatement a:active, 
a .maskedStatement:hover,a maskedStatement:active */
{
    color: white!important;
    transition:color 0.3s linear;
}
.maskedStatement/*, 
.maskedStatement a, 
a .maskedStatement*/
{
    color: #252525!important;
    text-shadow: none;
    background-color: #252525!important;
}
`);
 
    let a1 = document.createElement('button');
    a1.className = "gt1 button2";
    document.body.appendChild(a1);
    let flag=true;
    if(setting.记忆黑幕开关状态) {
        if (GM_getValue('flag') !== undefined) {
            flag = GM_getValue('flag')
        } else {
            GM_setValue('flag', true);
            flag = true;
        }
    }
    if (flag) {
        a1.innerText = "关闭黑幕";
    } else {
        a1.innerText = "开启黑幕";
        styleElement.setAttribute("type", 'text');
    }
 
    a1.onclick = function () {
        flag = !flag;
        if (flag) {
            styleElement.setAttribute("type", 'text/css');
            a1.innerText = "关闭黑幕";
        } else {
            styleElement.setAttribute("type", 'text');
            a1.innerText = "开启黑幕";
        }
        if(setting.记忆黑幕开关状态) {
            GM_setValue('flag', flag);
        }
    };
    addStyle(`.gt1 {
        padding: 5px 5px;
        font-size: 14px;
        color: snow;
        position: fixed;
        border-radius: 4px;
        right: 5px;
        top: 5%;
        z-index: 999999;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 4px 2px;
        -webkit-transition-duration: 0.4s;/* Safari */
        transition-duration: 0.4s;
        cursor: pointer;
        background-color: #4CAF50;
        border: 2px solid #4CAF50;
        padding: 0px;
        font-size: 12px;
        opacity: 0.2;
        right: -40px;
    }
    .gt1:hover {
        background-color: white;
        color: black;
        font-size: 14px;
        padding: 5px 10px;
        -webkit-transition: 0.5s;
        opacity: 1;
        margin: -3px 2px;
        right: 5px;
    }
`);
 
    /**
     * 添加css样式
     * @param rules css字符串
     */
    function addStyle(rules) {
        let styleElement = document.createElement('style');
        styleElement["type"] = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
        return styleElement;
    }
}