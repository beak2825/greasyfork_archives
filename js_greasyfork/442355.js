// ==UserScript==
// @name         VNDB优先原文和中文化
// @namespace    http://tampermonkey.net/
// @version      5.0.1
// @description  优先显示原文(title->value),以及中文化(mainMap[value]->value)
// @author       aotmd
// @match        https://vndb.org/*
// @noframes
// @license      GPL-3.0
// @run-at       document-body
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @compatible   chrome Tampermonkey
// @require      https://greasyfork.org/scripts/445990-vndbtranslatorlib/code/VNDBTranslatorLib_.js?version=1315038
// @downloadURL https://update.greasyfork.org/scripts/442355/VNDB%E4%BC%98%E5%85%88%E5%8E%9F%E6%96%87%E5%92%8C%E4%B8%AD%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/442355/VNDB%E4%BC%98%E5%85%88%E5%8E%9F%E6%96%87%E5%92%8C%E4%B8%AD%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==
/**-----------------------------业务逻辑部分[420行]----------------------------------*/
let setting = {
    /**
     * 若已在个人中心设置显示原语言且没有勾选罗马化,则无需进行提示对调,即设置此项为false.
     * 不登录则无法设置,则此项应为true.
     */
    提示对调:true,
    /**
     * 贡献翻译用.
     * 也会翻译不在当前页面生效的局部翻译(影响性能,耗时增加).
     * 控制台功能函数:
     * exportUntranslated()导出未翻译的原文,
     * showOtherLog():降序显示统计信息
     * delOtherLog():重置统计信息
     * */
    开发者模式:false,
};
/** ---------------------------map处理---------------------------*/
(function () {
    let pathname = window.location.pathname;
    otherPageRules.forEach((item) => {
        //当regular是正则才执行
        if (item.regular && item.regular instanceof RegExp) {
            if (item.regular.test(pathname)) {
                //添加到主map,若存在重复项则覆盖主map
                Object.assign(mainMap, item.map);
                //添加titleMap
                Object.assign(titleMap, item.titleMap);
                //添加特殊map
                Object.assign(specialMap, item.specialMap);
                console.log(item.name + ',规则匹配:' + pathname + '->' + item.regular);
            }
        }
    });
    /*object转Map, 正则new效率原因,先new出来*/
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
/*todo 性能分析*/
(function () {
    性能分析 = {
        "0标题": ["总时间", "(调用/修改)次数"],
        "提示对调": [0, 0],
        "字典翻译": {
            "总时间": 0,
            "提示部分": 0,
            "主要内容": 0,
            "正则部分": 0
        },
        "去重函数": [0, 0],
        "递归": [0, 0],/*因为递归的原因,会出现重复计算时间,且计算性能的语句损失的性能,会算入原文化与字典翻译部分*/
        "调试开发":{
            "总时间": 0,/*开发部分因为涉及加log,所以总时间也就图一乐*/
            "提示部分": 0,
            "主要内容": 0,
            "正则部分": 0
        },
    };
})();
/** ---------------------------函数准备---------------------------*/
const 递归 = (function 闭包() {
    /**
     * 递归处理到每个节点
     * @param el   要处理的节点
     * @param func 调用的函数
     */
    function 主控(el, func) {
        const nodeList = el.childNodes;
        /*先处理自己*/
        统一处理(el, false, func);
        for (let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i];
            统一处理(node, true, func);
        }
    }

    /**
     * 捕获指定节点,属性和属性内容,并执行指定函数.
     * @param el  要处理的节点
     * @param recursion 是否递归
     * @param func 调用的函数
     */
    function 统一处理(el, recursion, func) {
        if (el.nodeType === 1) {
            //为元素则递归
            if (recursion) {
                主控(el, func);
            }
            // let startTime = performance.now();
            let attribute, value;
            //为input且类型不为隐藏类型,且不是搜索框
            if (el.nodeName === 'INPUT' && el.type !== 'hidden' && el.id !== 'q') {
                value = el.getAttribute('value');
                if (value !== null && value.trim().length !== 0) {
                    attribute = 'value';
                } else {
                    value = el.getAttribute('placeholder');
                    attribute = 'placeholder';
                }
            } else if (el.nodeName === 'TEXTAREA') {
                value = el.getAttribute('placeholder');
                attribute = 'placeholder';
            } else {
                //title属性放在最后,与前两个非互斥条件,优先级最低.
                value = el.getAttribute('title');
                attribute = 'title';
            }
            // 性能分析.递归[0]+=performance.now()-startTime;
            // 性能分析.递归[1]++;
            // 判断值不为空.
            if (!value || !value.length) return;
            func(el, attribute, value);
        } else if (el.nodeType === 3) {
            // 性能分析.递归[1]++;
            if (!el.nodeValue || !el.nodeValue.length) return;
            //为文本节点则处理数据
            func(el, 'Text', el.nodeValue);
        }
    }
    return 主控;
})();

// if(typeof recordsList === 'undefined') recordsList = [];
if(typeof observerMap === 'undefined') observerMap = new Map();
/**
 * 修改后的函数,在触发事件后会对其他相同config的obs排队依次触发,节流100.
 * dom修改事件,包括属性,内容,节点修改
 * @param document 侦听对象
 * @param func  执行函数,可选参数(records),表示更改的节点
 * @param config 侦听的配置
 */
function dom修改事件( document, func ,config = {attributes: true, childList: true, characterData: true, subtree: true}) {
    // config.attributeFilter=["title","value","placeholder"];
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    //将配置对象序列化为字符串,做为key.
    const serializedConfig=JSON.stringify(Object.entries(config).sort());
    const observer = new MutationObserver( function(records) {
        // 从recordedMutations数组中移除重复项
        let recordsArr = removeDuplicates(records);
        // recordsList.push(...recordsArr);
        let observers = observerMap.get( serializedConfig ) || [];
        // 在每次变化前暂停相同 config 的所有观察器实例
        observers.forEach( obs => obs.observer.disconnect() );
        // 对拥有相同观察器实例的文档执行各自的函数
        observers.forEach( obs => {try {obs.func(recordsArr); } catch ( e ) {console.error( '执行错误' ); } } );
        // 在执行完毕后重新启用相同 config 的所有观察器实例
        observers.forEach( obs => obs.observer.observe( document, config ) );
        // 清空记录的修改
        recordsArr = [];
    } );

    // 将观察器实例和对应的函数添加到对应 config 的数组中
    let observers = observerMap.get( serializedConfig ) || [];
    observers.push( {observer, func } );
    observerMap.set( serializedConfig, observers );

    // 开启侦听
    observer.observe( document, config );
    /**
     * 从后面开始去重,并保留靠后的元素.
     * @param arr
     * @returns {*}
     */
    function removeDuplicates( arr ) {
        let startTime = performance.now();
        let temp=arr.reduceRight( ( unique, item ) => {
            // 检查当前元素是否已存在于结果数组中，如果不存在，则将其添加到数组中
            if ( !unique.some( i => (compareNodesRecursively(i, item))) ) {
                unique.push( item ); // 将不重复的元素添加到结果数组中
            }
            return unique;
        }, [] );
        性能分析.去重函数[0]+=performance.now()-startTime;
        性能分析.去重函数[1]++;
        return temp;
    }
    function compareNodesRecursively(node1, node2) {
        // 比较当前节点
        if (
            //node1.type === node2.type &&
            node1.target === node2.target
            //node1.attributeName === node2.attributeName
        ) {
            return true; // 如果当前节点匹配，返回true
        }
        if (!node1.childNodes)return false;
        if (node1.innerHTML.length < node2.target.innerHTML.length)return false;
        // 递归比较子节点
        return node1.childNodes.some(childNode1 => compareNodesRecursively(childNode1, node2));
    }
}
/** ----------------------------END----------------------------*/
const 已翻译标记 = ' \t\n';
(function () {
    /*立即执行*/
    if (setting.提示对调){
        console.time('初始提示对调,时间');
        递归(document.body, 提示对调);
        console.timeEnd('初始提示对调,时间');
    }
    console.time('初始字典翻译,时间');
    递归(document.body, 字典翻译);
    console.timeEnd('初始字典翻译,时间');
    /*当body发生变化时执行*/
    dom修改事件(document.body, (records) => {
        if (setting.提示对调) {
            console.time('提示对调,时间');
            let startTime = performance.now();
            for (let i = 0, len = records.length; i < len; i++) {
                递归(records[i].target, 提示对调);
            }
            性能分析.提示对调[0] += performance.now() - startTime;
            console.timeEnd('提示对调,时间');
        }
        console.time('字典翻译,时间');
        let startTime = performance.now();
        for (let i = 0, len = records.length; i < len; i++) {
            递归(records[i].target, 字典翻译);
        }
        性能分析.字典翻译.总时间 += performance.now() - startTime;
        console.timeEnd('字典翻译,时间');
    });

    /**
     * 显示的部分不含中文或日文
     * 且不应只有符号和纯数字(标签链接浏览器页vn匹配)
     * 且交换的部分含中文或日文
     * 且value没有对应翻译值
     * 且title没有翻译过[通过查找' \t\n'标记判断]
     * @param title
     * @param value
     * @returns {boolean}
     */
    function 内容判定(title, value) {
        return title
            && !含中文或日文(value)
            && !/^[\u0000-@]+$/.test(value)
            && 含中文或日文(title)
            && !mainMap[value]
            && title.indexOf(已翻译标记)===-1;
    }
    /**
     * 将有价值的title提示对调到文本中直接显示
     * @param node 文档节点
     * @param attribute 要修改的属性
     * @param value 要修改的属性的原值
     */
    function 提示对调(node, attribute, value) {
        // if (!value || !value.trim()) return;
        if(attribute==='title') return;
        value = value.trim();

        if (attribute === 'Text') {
            const title = node.parentNode.getAttribute("title");
            if (内容判定(title, value)) {
                性能分析.提示对调[1]++;
                node.parentNode.setAttribute("title", value);
                node.nodeValue = title;
                // console.log(value+'->'+title)
            }else {
                //父父级内容交换,影响性能,作用于
                //为搜索结果的大预览图进行原文化替换,#maincontent > form > div.mainbox.charbgrid > a
                const title = node.parentNode.parentNode?node.parentNode.parentNode.getAttribute("title"):null;
                if (内容判定(title, value)){
                    性能分析 .提示对调[1]++;
                    node.parentNode.parentNode.setAttribute("title", value);
                    node.nodeValue = title;
                    // console.log(value+'->'+title)
                }

            }
        }/* else {
            let title = node.getAttribute("title");
            if (内容判定(title, value)) {
                性能分析.提示对调[1]++;
                //若为通常节点则正常设置属性
                node.setAttribute('title', value);
                node.setAttribute(attribute, title);
                // console.log(value+'->'+title)
            }
        }*/
    }


    /**
     * 检测是否包含中文或日文.
     * @param text 文本
     * @returns {boolean} 结果
     */
    function 含中文或日文(text) {
        return /[\u4E00-\u9FA5ぁ-んァ-ヶ]+/.test(text);
    }

    /**
     * 修改文本内容,并将修改前的内容追加到title提示
     * @param node 待修改节点
     * @param attribute 待修改节点的节点属性(节点或文字属性)
     * @param value 修改前的值
     * @param newValue 修改后的值
     */
    function 内容修改(node, attribute, value, newValue) {
        if (attribute === 'Text') {
            //若为文本节点则追加父节点title属性,若已有title属性且不等于翻译原值,则追加title
            const title = node.parentNode.getAttribute('title');
            if (title && title.trim() !== value) {
                node.parentNode.setAttribute('title', title + ' ' + value);
            } else {
                node.parentNode.setAttribute('title', value);
            }
            node.nodeValue = newValue;
        } else {
            //若为通常节点则正常设置属性
            node.setAttribute('title', value);
            node.setAttribute(attribute, newValue)
        }
    }

    /**
     * 翻译文本内容
     * @param node 文档节点
     * @param attribute 要修改的属性
     * @param value 要修改的属性的原值
     */
    function 字典翻译(node, attribute, value) {
        // if (!value || !value.trim()) return;
        value = value.trim();
        /** titleMap翻译,处理完不再继续*/
        if (attribute==='title'){
            let flag = true;
            /*判断子节点文本(只判断一层),若文本为中文日文或匹配mainMap(即已被翻译过)或与title的值相等,则不执行后续操作*/
            let list = node.childNodes;
            for (let i = 0, len = list.length; i < len; ++i) {
                const element = list[i];
                const nodeValue = element.nodeValue;
                if (element.nodeType === 3 && (含中文或日文(nodeValue) || mainMap[nodeValue] || value === nodeValue)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                /*有翻译则加上*/
                if (titleMap[value]) {
                    性能分析.字典翻译.提示部分++;
                    //this.temp[0].push(value, titleMap[value]);
                    node.title = titleMap[value] + 已翻译标记 + value;
                } else if (mainMap[node.title]) {
                    性能分析.字典翻译.提示部分++;
                    //this.temp[1].push(value, mainMap[value]);
                    node.title = mainMap[value] + 已翻译标记 + value;
                }
            }
            return;
        }
        /** mainMap翻译*/
        if (mainMap[value]) {
            性能分析.字典翻译.主要内容++;
            内容修改(node,attribute,value,mainMap[value]);
            return;
        }

        /** specialMap正则翻译*/
        for (let key of specialMap.keys()) {
            /*正则匹配*/
            if (!key.test(value)) {
                continue;
            }
            /*--正则替换部分--*/
            const mv = specialMap.get(key);
            let newValue = value.replace(key, mv);

            let newValueArray = newValue.split('%%');
            const 循环替换检测 = newValueArray.length !== 1 && newValueArray.length % 2 === 1;
            if (!循环替换检测){
                性能分析.字典翻译.正则部分++;
                内容修改(node, attribute, value, newValue);
                // console.log(value+'->'+newValue);
                /*替换后结束遍历,不再找其他匹配的正则*/
                break;
            }
            /*---循环替换部分---*/
            let flag = false;
            /*如果替换的值没有中文,则设置flag为true,假定不执行替换*/
            if (!/[\u4E00-\u9FA5]+/.test(mv)) {
                flag = true;
            }
            for (let i = 1; i < newValueArray.length; i += 2) {
                let item = newValueArray[i];
                /*如果带@@@@(则先转小写)*/
                const low = item.split('@@');
                if (low.length === 3) {
                    newValueArray[i] = low[0] + low[1].toLowerCase() + low[2];
                }
                /*找翻译*/
                if (mainMap[item]) {
                    newValueArray[i] = mainMap[item];
                    /*若找到翻译,则重新置flag为false*/
                    flag = false;
                }
            }
            if (flag) {/*如果替换式没有中文,且需要循环替换,而替换后还是没有中文,则跳过修改*/
                continue;
            }
            /*合并*/
            newValue = newValueArray.join('');
            性能分析.字典翻译.正则部分++;
            内容修改(node, attribute, value, newValue);
            // console.log(value+'->'+newValue);
            /*替换后结束遍历,不再找其他匹配的正则*/
            break;
        }
    }
})();

/**-----------------------------开发用函数部分[400行]----------------------------------*/
/** 开启后通过控制台调用函数即可*/
if (setting.开发者模式) {
    /**
     * 条件:1<长度<300
     * 且没有中文、日文
     * 且不应只有符号和纯数字
     * @param value 待判定的文本
     * @returns {boolean|boolean}
     */
    function 文本筛选(value) {
        return 1 < value.length && value.length < 300
            && !/[\u4E00-\u9FA5ぁ-んァ-ヶ]+/.test(value)
            && !/^[\u0000-@]+$/.test(value);
    }
    /**
     * 检测是否包含中文或日文.
     * @param text 文本
     * @returns {boolean} 结果
     */
    function 含中文或日文(text) {
        return /[\u4E00-\u9FA5ぁ-んァ-ヶ]+/.test(text);
    }
    /**
     * todo 注意!exportMap已弃用
     * 导出新的已被翻译的内容到控制台显示
     * <br>手动在网页上改文本,注意:
     * <br>先在要翻译的文本中间写入翻译后的内容,然后用del和backspace删除前后的原内容(不然会出现问题)
     * <br>要开启编辑模式,则使用以下代码:
     * <br>document.body.contentEditable='true';
     * <br>document.designMode='on';
     */
    exportMap = function () {
        let addMap = {};
        递归(document.body, 数据处理);
        /*导出到控制台处理*/
        console.log(JSON.stringify(addMap));
        function 数据处理(node, attribute, value) {
            // if (!value || !value.trim()) return;
            value = value.trim();
            //如果没有在map中找到翻译,则继续执行,否则中断
            if (mainMap[value]!==undefined) {return;}
            //是中文、不是日文
            if (/[\u4E00-\u9FA5]+/.test(value) &&
                !/[ぁ-んァ-ヶ]+/.test(value)) {
                if (attribute === 'Text') {
                    node = node.parentNode;
                }
                const title = node.getAttribute('title');
                //如果title没有翻译,则记录
                if (title && mainMap[title]===undefined) {
                    addMap[title] = value;
                }
            }
        }
    };

    /**
     * todo exportUntranslated常用,用来导出需要翻译的内容.
     * <br>用来导出未翻译的提示文本和普通文本,map->控制台
     * <br>若出现新元素,请手动通过控制台重新调用
     * <br>若干扰项太多,可以通过DevTools删除干扰元素,再重新调用
     * */
    exportUntranslated = () => {
        //清空
        /*** 记录所有满足文本筛选条件的未翻译文本内容<br>缺点为找不到上下文*/
        noMap = {};
        /*** 记录所有满足文本筛选条件的未翻译提示信息<br>缺点为找不到上下文*/
        noTitleMap={};

        递归(document.body, 数据处理);

        console.log('无翻译的文本:');
        console.log(JSON.stringify(noMap));
        console.log('无翻译的提示:');
        console.log(JSON.stringify(noTitleMap));

        function 数据处理(node, attribute, value) {
            // if (!value || !value.trim()) return;
            value = value.trim();
            //没有在map中找到翻译,则继续执行(因为title也会通过mainMap翻译所以都判断)
            if (mainMap[value] !== undefined) { return;}
            //通过文本筛选,则继续执行
            if (!文本筛选(value)) { return; }

            //如果不是title则只执行普通文本逻辑
            if (attribute !=='title'){
                //一致化处理,若是文本节点则得到父节点
                if (attribute === 'Text') {
                    node = node.parentNode;
                }
                const title = node.getAttribute('title');
                if (title === null || mainMap[title] === undefined){
                    //添加到无翻译的普通文本
                    noMap[value] = value.toLowerCase();
                }
                return;
            }

            //--------提示文本逻辑----------
            if(titleMap[value]!==undefined){ return; }

            //下同字典翻译函数title部分
            let flag = true;
            /*判断子节点文本(只判断一层),若文本为中文日文或匹配mainMap(即已被翻译过)或与title的值相等,则不执行后续操作*/
            let list = node.childNodes;
            for (let i = 0, len = list.length; i < len; ++i) {
                const element = list[i];
                const nodeValue = element.nodeValue;
                if (element.nodeType === 3 && (含中文或日文(nodeValue) || mainMap[nodeValue] || value === nodeValue)) {
                    flag = false;
                    break;
                }
            }
            if (flag){
                /*添加到无翻译提示信息*/
                noTitleMap[value] = value.toLowerCase();
            }
        }
    };
    /*立即执行*/
    exportUntranslated();

    /**
     * todo otherLog常用,用来统计其他页面规则的生效情况.
     * 用来查找可以被提升的不在当前页面生效的局部翻译(自动计数并翻译)
     * 可用命令:
     * showOtherLog():降序显示统计信息
     * delOtherLog():重置统计信息
     * */
    (function() {
        let otherMap = {};
        let otherTitleMap={};
        let otherSpecialMap = {};
        /** ---------------------------map处理---------------------------*/
        (function() {
            /*将其他没有生效的map合起来*/
            let pathname = window.location.pathname;
            otherPageRules.forEach((item) => {
                if (item.regular !== undefined && item.regular instanceof RegExp) {
                    //不匹配则合并
                    if (!item.regular.test(pathname)) {
                        Object.assign(otherMap, item.map);
                        Object.assign(otherTitleMap, item.titleMap);
                        Object.assign(otherSpecialMap, item.specialMap);
                    }
                }
            });
            /*object转Map, 正则new效率原因,先new出来*/
            let tempMap = new Map();
            let k = Object.getOwnPropertyNames(otherSpecialMap);
            for (let i = 0, len = k.length; i < len; i++) {
                try {
                    tempMap.set(new RegExp(k[i]), otherSpecialMap[k[i]]);
                } catch (e) {
                    console.log('"' + k[i] + '"不是一个合法正则表达式');
                }
            }
            otherSpecialMap = tempMap;
        })();
        /** ----------------------------END----------------------------*/

        /** -----------------------otherLog相关函数---------------------------*/
        let otherLog = GM_getValue('otherLog') || {};

        /**
         * 清空otherLog统计内容,重新开始统计.
         */
        delOtherLog=function(){
            GM_deleteValue('otherLog');
            otherLog={};
        };
        /**
         * 按降序显示otherLog数组
         * 先输出一份原内容,再输出一份格式化内容.
         */
        showOtherLog = function () {
            let propertyNames = Object.getOwnPropertyNames(otherLog);
            let otherLogList = [];
            /*Object转数组*/
            for (let i = 0, len = propertyNames.length; i < len; i++) {
                const element = propertyNames[i];
                otherLogList.push([element, ...otherLog[element]]);
            }
            /*排序*/
            otherLogList.sort(function (obj1, obj2) {
                return obj2[3] - obj1[3];
            });
            /*输出原内容*/
            console.log(otherLogList);

            /*输出控制台*/
            let sb = '原内容\t现内容\t匹配时机\t计数\n';
            for (let i = 0, len = otherLogList.length; i < len; i++) {
                sb += otherLogList[i].join('\t') + '\n'
            }
            console.log(sb)
        };

        /**
         * 保存otherLog内容
         * 输出otherLog内容
         * 输出对应的records
         */
        function saveOtherLog(records){
            /*若不相等则更新并输出*/
            if (JSON.stringify(otherLog) !== JSON.stringify(GM_getValue('otherLog') || {})) {
                GM_setValue('otherLog', otherLog);
                console.log(otherLog);
                console.log(records);
            }
        }
        /**
         * 统计不在当前页面生效,但可以匹配的普通翻译与正则
         * 用以将局部map升级到主map
         * @param value 原值
         * @param newValue 新值
         * @param matchDescription 匹配时机说明
         */
        function addOtherLog(value, newValue,matchDescription) {
            if (otherLog[value] === undefined) {
                otherLog[value] = [newValue,matchDescription,1];
            } else {
                let item = otherLog[value];
                item[2]++;

                /*添加并去重*/
                let temp=item[0].split('$$');
                temp.push(newValue);
                item[0] = [...new Set(temp)].join('$$');

                temp = item[1].split('$$');
                temp.push(matchDescription);
                item[1] = [...new Set(temp)].join('$$');
            }
        }
        /** ----------------------------END----------------------------*/

        /*立即执行*/
        console.time('初始其他规则,调试');
        递归(document.body, 未生效规则匹配测试);
        console.timeEnd('初始其他规则,调试');
        /*当body发生变化时执行*/
        dom修改事件(document.body, (records) => {
            let startTime = performance.now();
            console.time('其他规则,调试');
            for (let i = 0, len = records.length; i < len; i++) {
                递归(records[i].target, 未生效规则匹配测试);
            }
            console.timeEnd('其他规则,调试');
            性能分析.调试开发.总时间 += performance.now() - startTime;
            saveOtherLog(records);
        });
        /**
         * 修改文本内容,并将修改前的内容追加到title提示
         * @param node 待修改节点
         * @param attribute 待修改节点的节点属性(节点或文字属性)
         * @param value 修改前的值
         * @param newValue 修改后的值
         *  @returns {string} 修改的类型
         */
        function 内容修改(node, attribute, value, newValue) {
            if (attribute === 'Text') {
                //若为文本节点则追加父节点title属性,若已有title属性且不等于翻译原值,则追加title
                const title = node.parentNode.getAttribute('title');
                if (title && title.trim() !== value) {
                    node.parentNode.setAttribute('title', title + ' ' + value);
                } else {
                    node.parentNode.setAttribute('title', value);
                }
                node.nodeValue = newValue;
                return 'Text';
            } else {
                //若为通常节点则正常设置属性
                node.setAttribute('title', value);
                node.setAttribute(attribute, newValue);
                return  '节点';
            }
        }
        function 未生效规则匹配测试(node, attribute, value) {
            // if (!value || !value.trim()) return;
            value = value.trim();
            /*不被mainMap和specialMap匹配*/
            /*由于执行顺序的原因,该判断基本没有意义*/
            if (mainMap[value] !== undefined) {
                return;
            }
            /*因为正则涉及匹配可能太广,所以不排除*/
            // for (let key of specialMap.keys()) {
            //     if (key.test(value)) {
            //         return;
            //     }
            // }

            if (!文本筛选(value)) {
                return;
            }

            /** titleMap翻译*/
            if (attribute==='title'){
                //下类似字典翻译函数title部分
                let flag = true;
                /*判断子节点文本(只判断一层),若文本为中文日文或匹配mainMap(即已被翻译过)或与title的值相等,则不执行后续操作*/
                /*或匹配otherMap*/
                let list = node.childNodes;
                for (let i = 0, len = list.length; i < len; ++i) {
                    const element = list[i];
                    const nodeValue = element.nodeValue;
                    if (element.nodeType === 3 && (含中文或日文(nodeValue) ||
                        mainMap[nodeValue] || value === nodeValue||
                        otherMap[nodeValue])
                    ) {
                        flag = false;
                        break;
                    }
                }
                if (flag){
                    /*有翻译则加上*/
                    if (otherTitleMap[value]) {
                        性能分析.调试开发.提示部分++;
                        node.title=otherTitleMap[value]+已翻译标记+value;
                        addOtherLog(value, otherTitleMap[value], 'Title:otherTitleMap匹配');
                    }else if (otherMap[value]){
                        性能分析.调试开发.提示部分++;
                        node.title=otherMap[value]+已翻译标记+value;
                        addOtherLog(value, otherMap[value], 'Title:otherMap匹配');
                    }
                }
                return;
            }

            /** mainMap翻译*/
            if (otherMap[value]) {
                性能分析.调试开发.主要内容++;
                const text=内容修改(node,attribute,value,otherMap[value]);
                addOtherLog(value, otherMap[value], 'Main:otherMap匹配,'+text);
                return;
            }
            /** specialMap正则翻译*/
            for (let key of otherSpecialMap.keys()) {
                /*正则匹配*/
                if (!key.test(value)) {
                    continue;
                }
                let info = 'Special:specialMap匹配,正则:' + key + ',';
                /*--正则替换部分--*/
                const mv = otherSpecialMap.get(key);
                let newValue = value.replace(key, mv);

                let newValueArray = newValue.split('%%');
                const 循环替换检测 = newValueArray.length !== 1 && newValueArray.length % 2 === 1;
                if (!循环替换检测){
                    性能分析.调试开发.正则部分++;
                    const text=内容修改(node, attribute, value, newValue);
                    addOtherLog(value, newValue, info+text);
                    /*替换后结束遍历,不再找其他匹配的正则*/
                    break;
                }
                /*---循环替换部分---*/
                let flag = false;
                /*如果替换的值没有中文,则设置flag为true,假定不执行替换*/
                if (!/[\u4E00-\u9FA5]+/.test(mv)) {
                    flag = true;
                }
                for (let i = 1; i < newValueArray.length; i += 2) {
                    let item = newValueArray[i];
                    /*如果带@@@@(则先转小写)*/
                    const low = item.split('@@');
                    if (low.length === 3) {
                        newValueArray[i] = low[0] + low[1].toLowerCase() + low[2];
                    }
                    /*匹配otherMap*/
                    if (otherMap[item]) {
                        newValueArray[i] = otherMap[item];
                        info += '在otherMap找到%%%%(额外匹配),';
                        /*若找到map,则重新置flag为false*/
                        flag = false;
                    }else if (mainMap[item]) {
                        /*匹配mainMap*/
                        newValueArray[i] = mainMap[item];
                        info += '在mainMap找到%%%%(额外匹配),';
                        /*若找到map,则重新置flag为false*/
                        flag = false;
                    }
                }
                if (flag) {/*如果替换式没有中文,且需要循环替换,而替换后还是没有中文,则跳过修改*/
                    continue;
                }
                /*合并*/
                newValue = newValueArray.join('');
                性能分析.调试开发.正则部分++;
                const text=内容修改(node, attribute, value, newValue);
                addOtherLog(value, newValue, info+text);
                // console.log(value + '->' + newValue);
                /*替换后结束遍历*/
                break;
            }
        }
    })();
}
