// ==UserScript==
// @name         复制便利化
// @namespace    http://tampermonkey.net/
// @version      2024-05-14
// @description  简单复制类目
// @author       You
// @match https://kengine.alibaba-inc.com/kengine/asset_detail
// @license MIT
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/494911/%E5%A4%8D%E5%88%B6%E4%BE%BF%E5%88%A9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/494911/%E5%A4%8D%E5%88%B6%E4%BE%BF%E5%88%A9%E5%8C%96.meta.js
// ==/UserScript==

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const c = console.log;
let get = 0;
let tree = $('.category-tree>ul');

function debounce(func, delay) {
  let timeoutId;

  return function() {
    const context = this;
    const args = arguments;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

const hashMap = {};
let lastCat = null;

const forEle = (doms,fn)=>{
   if(!doms || !doms.length) return;
   for(let i=0;i<doms.length; i++){
     const v = doms[i];
     fn(v,i);
  }
}

const addLabel = (path)=>{
  let head = hashMap;
  path.forEach(i =>{
    if(head[i]){
       head = head[i];
    } else {
       head[i] = {};
    }
  });
  return head;
}

const init = ()=>{
 if(get) return;
 tree = $('.category-tree>ul');
     if(tree) {
     get =1
 }
 else {
     return;
 }
 //c(tree,tree.children ,'tree');
 const arr = tree.children;

 for(let i=0;i<arr.length; i++){
     const v = arr[i];
     hashMap[arr[i].childNodes[0].getAttribute('aria-label')] = {};
 }

    // 创建一个 MutationObserver 实例，并指定回调函数
    var observer = new MutationObserver(function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length>0) {
                //console.log('子节点发生变化');
                // c(mutation,mutation.addedNodes,mutation.addedNodes[0],222);
                const add = mutation.addedNodes? mutation.addedNodes[0] : [];
                forEle(add.children, (v)=>{
                    const path = v.getAttribute('labelpath').split(';')
                    if(v.tagName === 'LI'){
                      addLabel([...path, v.innerText])
                      lastCat = addLabel(path);
                    } else {
                      addLabel(path);
                    }
                  // c(v.getAttribute('parentkey'), v.childNodes[0].getAttribute('aria-label'))
                });
              c(hashMap);
              GM_setClipboard(JSON.stringify(hashMap), "text");
            }
        }
    });

    // 配置观察选项（可选）
    var config = { attributes: false, childList: true, subtree: true };

    // 用 MutationObserver 对目标节点进行观察
    observer.observe(tree, config);

    var checkTable = debounce(()=>{
        const table = $('.next-table-body tbody');
        const navText = $('.BrandInfoMessage').innerText;
        if(navText.indexOf('类目路径：')>-1){
            const path = $('.BrandInfoMessage').innerText.replace('类目路径：','').split('\n')[0].split('->');
            const leaf = addLabel(path);
            forEle(table.children, v =>{
              const item = {
                name: v.children[1].innerText,
                attrOrigin: v.children[2].innerText,
                attrTag: v.children[3].innerText,
                customRankingDecisionFactors: v.children[4].innerText,
                rankingOriginalCategoryAttributes: v.children[5].innerText,
                numberStructuredSKUs: v.children[6].innerText,
                structuredSKUCoverage: v.children[7].innerText,
                propertyAlias: v.children[8].innerText,
                normalizedAttributeName: v.children[9].innerText,
              };
                leaf['$$CAT_ATTR'] = leaf['$$CAT_ATTR']?[...leaf['$$CAT_ATTR'], item]:[item];
            });
            // c(leaf,hashMap);
        }
        else if(navText.indexOf('品牌名称：')>-1){
            const brand = navText.replace('品牌名称：','').split('；')[0];
            const thisBrand = lastCat[brand];
            if(thisBrand){
                // c('找到对应品牌目录', brand)
            } else {
                alset('未找到目录，写入出错')
            }
            forEle(table.children, v =>{
              const item = {
                name: v.children[0].innerText,
                attrOrigin: v.children[1].innerText,
                attributeClassification: v.children[2].innerText,
                totalNumberSKU: v.children[3].innerText,
                numberSKUsWithExistingAttributeValues: v.children[4].innerText,
                SKUCoverage: v.children[5].innerText,
                numberDifferentAttributeValues: v.children[6].innerText,
              };
                thisBrand['$$BRAND_ATTR'] = thisBrand['$$BRAND_ATTR']?[...thisBrand['$$BRAND_ATTR'], item]:[item];
            });

            // c('品牌结果',thisBrand);
            // c('当前分类',lastCat)

        }
        c(hashMap);
        GM_setClipboard(JSON.stringify(hashMap), "text");

    },1000);

    var attObserver = new MutationObserver(function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if(mutation.type === 'childList'){
                checkTable();
            }
        }
    });

    attObserver.observe($('.epoch-layout-inner'), config);


}
setInterval(init,3000);






