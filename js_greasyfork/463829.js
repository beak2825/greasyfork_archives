/**
 * 过滤的通用模板
 * @param targets 选择对象
 * @param forFunction (target) => 遍历选择对象的元素
 */
 function filterTemplate(targets, forFunction) {
    let indexs = [];
    targets.each((index, element) => {
        if (forFunction($(element))) {
            indexs.push(index);
        }
    });
    if (indexs.length == 0) {
        return;
    }
    for (const i of indexs) {
        targets[i].remove();
    }
}
 
/**
 * 文本模糊匹配的过滤模板
 * @param targets 选择对象
 * @param textSelector 文本对象的选择器
 * @param texts 文本过滤关键词
 */
function textFilter(target, textSelector, textKeys) {
    let text = target.find(textSelector).text();
    for (const textKey of textKeys) {
        if (text.indexOf(textKey) != -1) {
            return true;
        }
    }
    return false;
}
 
/**
 * 文本精准相等过滤模板
 * @param target 选择对象
 * @param textSelector 文本对象的选择器
 * @param keySet 过滤关键词
 */
function keyFilter(target, textSelector, keySet) {
    if (null == keySet || 0 == keySet.length) {
        return;
    }
    let title = target.find(textSelector).text();
    return keySet.has(title);
}
 
/**
 * 设置,如果第一次失败则开启一个定时任务设置直到成功
 * @param selector 位置的文本
 * @param func 具体设置的方法
 */
function doWithInterval(selector, func) {
    let position = $(selector);
    if (position.length != 0) {
        func(position);
        return;
    }
    let timerTask = setInterval(function () {
        position = $(selector);
        if (position.length != 0) {
            func(position);
            clearInterval(timerTask);
        }
    }, 500);
}