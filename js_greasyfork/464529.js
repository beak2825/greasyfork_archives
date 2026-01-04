// ==UserScript==
// @name         onDomChange
// @namespace    http://bbs.91wc.net/?onDomChange
// @version      0.1.2
// @description  Dom变化监听
// @author       Wilson
// ==/UserScript==
 
function onDomChange(el, callback, config) {
    // 观察器的配置（需要观察什么变动）
    config = config || { attributes: true, childList: true, subtree: true };
    // 当观察到变动时执行的回调函数
    const handler = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            callback(observer, mutation);
        }
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(handler);

    // 以上述配置开始观察目标节点
    el = typeof el === 'string' ? document.querySelector(el) : el;
    observer.observe(el, config);

    //再次开始观察，通常用于先停止监听处理后再监听的场景，防止死循环
    observer.observeAgain = function(ele, cfg){
        observer.observe(ele || el, cfg || config);
    }

    // 之后，可停止观察
    //observer.disconnect();

    return observer;
}

//使用示例：
//说明：childList是子元素，subtree是后代元素
//onDomChange(el, (observer, mutation) => {
    //your code

    //if (mutation.type === 'childList'){
        //do something
    //}
    //if(observer) observer.disconnect();
    //observer.observeAgain();
//}, {childList: true});