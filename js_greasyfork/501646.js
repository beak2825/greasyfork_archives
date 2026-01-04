/* 当前版本：v1.1 */
/**
 * 重叠匹配度
 * @author: zhuangjie
 * @date: 2024-07-23
 */
function overlapMatchingDegreeForObjectArray(keyword = "", objArr = [], fun = (obj) => [], {sort = "desc", onlyHasScope = false, scopeForObjArrContainer} = {}) {
    const scopeForData = objArr.map(item => overlapMatchingDegree(keyword, fun(item), sort));
    // scope与 objArr 同步排序
    sortAndSync(scopeForData, objArr, sort);
    
    if (Array.isArray(scopeForObjArrContainer)) {
        scopeForObjArrContainer.push(...scopeForData);
    }

    return onlyHasScope ? objArr.filter((_, index) => scopeForData[index] !== 0) : objArr;
}
/**
 * 计算匹配度外层封装工具
 * @param {string} keyword - 匹配字符串1
 * @param {Object | Arrayy} topicWeighs - 匹配字符串2与它的权重
 * @returns {number} 匹配度分数
 */
function overlapMatchingDegree(keyword, topicWeighs = {}, sort = "desc") {
    if (Array.isArray(topicWeighs)) {
        const weightMultiplier = sort === "desc" ? 1 : -1;
        topicWeighs = Object.fromEntries(topicWeighs.reverse().map((topic, index) => [topic, (index + 1) * weightMultiplier]));
    }
    return Object.keys(topicWeighs).reduce((totalScore, topic) => {
        const currentScore = topicWeighs[topic];
        const overlapLengthBlocksMap = findOverlapBlocks(keyword, topic);
        return totalScore + Object.entries(overlapLengthBlocksMap).reduce((sum, [length, blocks]) => {
            return sum + blocks.length * Math.pow(currentScore, Number(length));
        }, 0);
    }, 0);
}
/**
 * 查找重叠匹配块（入口函数）
 * @param {*} str1 
 * @param {*} str2 
 * @returns 返回重叠块 如：{"2": ["好用","推荐"],"3": ["好用推荐"]}
 * 算法核心思想：
 * -----------------------------------------------------
 * sumatrapdf*          | sumatrapdf*      | sumatrapdf*
 *           pdf-       |          pdf-    |         pdf-
 * ------------------------------------------------------
 */
function findOverlapBlocks(str1 = "", str2 = "") {
    const alignmentHub = {};
    const str1Len = str1.length;
    const str2Len = str2.length;
    const minLen = Math.min(str1Len, str2Len);

    for (let offset = 1 - str2Len; offset < str1Len; offset++) {
        const start = Math.max(0, offset);
        const end = Math.min(str1Len, str2Len + offset);
        const overlapStr1 = str1.slice(start, end);
        const overlapStr2 = str2.slice(start - offset, end - offset);

        const alignmentContent = alignment(overlapStr1, overlapStr2);
        for (const [len, blocks] of Object.entries(alignmentContent)) {
            alignmentHub[len] = alignmentHub[len] ? [...new Set([...alignmentHub[len], ...blocks])] : blocks;
        }
    }
    return alignmentHub;
}
// 对齐
function alignment(str1 = "", str2 = "") {
    const overlappingBlocks = {};
    let currentBlock = "";

    for (let i = str1.length - 1; i >= 0; i--) {
        if (str1[i] === str2[i]) {
            currentBlock = str1[i] + currentBlock;
        } else if (currentBlock.length > 0) {
            const len = currentBlock.length;
            overlappingBlocks[len] = overlappingBlocks[len] || [];
            if (!overlappingBlocks[len].includes(currentBlock)) {
                overlappingBlocks[len].push(currentBlock);
            }
            currentBlock = "";
        }
    }
    if (currentBlock.length > 0) {
        const len = currentBlock.length;
        overlappingBlocks[len] = overlappingBlocks[len] || [];
        if (!overlappingBlocks[len].includes(currentBlock)) {
            overlappingBlocks[len].push(currentBlock);
        }
    }

    return overlappingBlocks;
}
// 【同步排序算法】
function sortAndSync(arr1, arr2, order = 'desc') {
    const compare = order === 'asc' ? (a, b) => a - b : (a, b) => b - a;
    arr1.map((v, i) => [v, arr2[i]])
        .sort((a, b) => compare(a[0], b[0]))
        .forEach(([v, o], i) => {
            arr1[i] = v;
            arr2[i] = o;
        });
}


// 【算法测试1】
//  console.log("-- 算法测试开始 --")
//  console.log(findOverlapBlocks("[推荐]sumatrapdf非常好用","pdf 推荐"))
//  console.log("-- 算法测试结束 --")

// 【算法测试2】
// console.log("匹配度：", overlapMatchingDegree("好用的pdf工具", { "sumatrapdf": 10, "小而好用的pdf阅读器": 8, "https://www.sumatrapdfreader.org/downloadafter": 3 }));
