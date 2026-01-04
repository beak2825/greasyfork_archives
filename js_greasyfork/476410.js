// ==UserScript==
// @name         dlsite网站漫画爬取
// @license      MIT
// @match        https://play.dlsite.com/csr/viewer/*
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  啊实打实大师
// @author       You
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.1.0/jszip.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.1.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js

// @match        https://www.runoob.com/jquery/jquery-tutorial.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=runoob.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476410/dlsite%E7%BD%91%E7%AB%99%E6%BC%AB%E7%94%BB%E7%88%AC%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/476410/dlsite%E7%BD%91%E7%AB%99%E6%BC%AB%E7%94%BB%E7%88%AC%E5%8F%96.meta.js
// ==/UserScript==
var elmGetter = function() {
    const win = window.unsafeWindow || document.defaultView || window;
    const doc = win.document;
    const listeners = new WeakMap();
    let mode = 'css';
    let $;
    const elProto = win.Element.prototype;
    const matches = elProto.matches ||
        elProto.matchesSelector ||
        elProto.webkitMatchesSelector || 
        elProto.mozMatchesSelector ||
        elProto.oMatchesSelector;
    const MutationObs = win.MutationObserver ||
        win.WebkitMutationObserver ||
        win.MozMutationObserver;
    function addObserver(target, callback) {
        const observer = new MutationObs(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    callback(mutation.target);
                    if (observer.canceled) return;
                }
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) callback(node);
                    if (observer.canceled) return;
                }
            }
        });
        observer.canceled = false;
        observer.observe(target, {childList: true, subtree: true, attributes: true});
        return () => {
            observer.canceled = true;
            observer.disconnect();
        };
    }
    function addFilter(target, filter) {
        let listener = listeners.get(target);
        if (!listener) {
            listener = {
                filters: new Set(),
                remove: addObserver(target, el => listener.filters.forEach(f => f(el)))
            };
            listeners.set(target, listener);
        }
        listener.filters.add(filter);
    }
    function removeFilter(target, filter) {
        const listener = listeners.get(target);
        if (!listener) return;
        listener.filters.delete(filter);
        if (!listener.filters.size) {
            listener.remove();
            listeners.delete(target);
        }
    }
    function query(all, selector, parent, includeParent, curMode) {
        switch (curMode) {
            case 'css':
                const checkParent = includeParent && matches.call(parent, selector);
                if (all) {
                    const queryAll = parent.querySelectorAll(selector);
                    return checkParent ? [parent, ...queryAll] : [...queryAll];
                }
                return checkParent ? parent : parent.querySelector(selector);
            case 'jquery':
                let jNodes = $(includeParent ? parent : []);
                jNodes = jNodes.add([...parent.querySelectorAll('*')]).filter(selector);
                if (all) return $.map(jNodes, el => $(el));
                return jNodes.length ? $(jNodes.get(0)) : null;
            case 'xpath':
                const ownerDoc = parent.ownerDocument || parent;
                selector += '/self::*';
                if (all) {
                    const xPathResult = ownerDoc.evaluate(selector, parent, null, 7, null);
                    const result = [];
                    for (let i = 0; i < xPathResult.snapshotLength; i++) {
                        result.push(xPathResult.snapshotItem(i));
                    }
                    return result;
                }
                return ownerDoc.evaluate(selector, parent, null, 9, null).singleNodeValue;
        }
    }
    function isJquery(jq) {
        return jq && jq.fn && typeof jq.fn.jquery === 'string';
    }
    function getOne(selector, parent, timeout) {
        const curMode = mode;
        return new Promise(resolve => {
            const node = query(false, selector, parent, false, curMode);
            if (node) return resolve(node);
            let timer;
            const filter = el => {
                const node = query(false, selector, el, true, curMode);
                if (node) {
                    removeFilter(parent, filter);
                    timer && clearTimeout(timer);
                    resolve(node);
                }
            };
            addFilter(parent, filter);
            if (timeout > 0) {
                timer = setTimeout(() => {
                    removeFilter(parent, filter);
                    resolve(null);
                }, timeout);
            }
        });
    }
    return {
        get currentSelector() {
            return mode;
        },
        get(selector, ...args) {
            let parent = typeof args[0] !== 'number' && args.shift() || doc;
            if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
            const timeout = args[0] || 0;
            if (Array.isArray(selector)) {
                return Promise.all(selector.map(s => getOne(s, parent, timeout)));
            }
            return getOne(selector, parent, timeout);
        },
        each(selector, ...args) {
            let parent = typeof args[0] !== 'function' && args.shift() || doc;
            if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
            const callback = args[0];
            const curMode = mode;
            const refs = new WeakSet();
            for (const node of query(true, selector, parent, false, curMode)) {
                refs.add(curMode === 'jquery' ? node.get(0) : node);
                if (callback(node, false) === false) return;
            }
            const filter = el => {
                for (const node of query(true, selector, el, true, curMode)) {
                    const _el = curMode === 'jquery' ? node.get(0) : node;
                    if (refs.has(_el)) break;
                    refs.add(_el);
                    if (callback(node, true) === false) {
                        return removeFilter(parent, filter);
                    }
                }
            };
            addFilter(parent, filter);
        },
        create(domString, ...args) {
            const returnList = typeof args[0] === 'boolean' && args.shift();
            const parent = args[0];
            const template = doc.createElement('template');
            template.innerHTML = domString;
            const node = template.content.firstElementChild;
            if (!node) return null;
            parent ? parent.appendChild(node) : node.remove();
            if (returnList) {
                const list = {};
                node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
                list[0] = node;
                return list;
            }
            return node;
        },
        selector(desc) {
            switch (true) {
                case isJquery(desc):
                    $ = desc;
                    return mode = 'jquery';
                case !desc || typeof desc.toLowerCase !== 'function':
                    return mode = 'css';
                case desc.toLowerCase() === 'jquery':
                    for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
                        if (isJquery(jq)) {
                            $ = jq;
                            break;
                        };
                    }
                    return mode = $ ? 'jquery' : 'css';
                case desc.toLowerCase() === 'xpath':
                    return mode = 'xpath';
                default:
                    return mode = 'css';
            }
        }
    };
}();

(function() {
    const sx=650;
    const sy=0;
    let width=600;
    let height=910;
    function createCanvasToDrawImg(){
     let canvas=document.createElement("canvas");
     canvas.width=width;
     canvas.height=height;
     return canvas;
    }

    function imageBase64ToFile(name,imageBase64) {
    const arr = imageBase64.split(',');
    const binary = atob(arr[1]); // base64解码
    const mine = arr[0].match(/:(.*?);/)[1]; // 文件类型
    const array = [];

    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i)); //  Unicode 编码
    }
    const blob = new Blob([new Uint8Array(array)], {type: mine}); // Blob对象可以看做是存放二进制数据的容器；Uint8Array类型数组：8位无符号整数数组
    /**
     * blobParts： 数组类型， 数组中的每一项连接起来构成Blob对象的数据，数组中的每项元素可以是ArrayBuffer(二进制数据缓冲区), ArrayBufferView,Blob,DOMString。或其他类似对象的混合体。
     * options： 可选项，字典格式类型，可以指定如下两个属性：
         type，默认值为""，它代表了将会被放入到blob中的数组内容的MIME类型。
         endings， 默认值为"transparent"，用于指定包含行结束符\n的字符串如何被写入。 它是以下两个值中的一个： "native"，表示行结束符会被更改为适合宿主操作系统文件系统的换行符； "transparent"，表示会保持blob中保存的结束符不变。
     */
    // 转换成file对象
    const file = new File([blob],name + '.png', {type:mine});
    /**
    * filebits：ArrayBuffer，ArrayBufferView，Blob，或者 DOMString 对象的 Array — 或者任何这些对象的组合。这是 UTF-8 编码的文件内容。
    * name：文件名称，或者文件路径
    * options 可选：选项对象，包含文件的可选属性。可用的选项如下：
        type: DOMString，表示将要放到文件中的内容的 MIME 类型。默认值为 “” 。
        lastModified: 数值，表示文件最后修改时间的 Unix 时间戳（毫秒）。默认值为 Date.now()。
     */
    return blob
  }
    let count=1;
    var intervalID
    let datas=new Array();


    function download(start){
        let canvas_parent_document = document.getElementById("main_screen_layer");
        let total_page = document.getElementsByClassName("PageCount_total__3XPU7")[0].textContent;
        if(canvas_parent_document==null||total_page<=0){
            alert("等待第一个图片加载完毕再试");
            return false;
        }

        var zip = new JSZip();
        zip.file('readme.txt', '案件详情资料\n')
        var img = zip.folder('images2')
        let filename=start;
        datas.forEach(item=>{
            console.log(item)
            img.file(filename + ".jpg", item)
            filename++;
        })
        zip.generateAsync({
            type: 'blob'
        }).then(function (content) {
            console.log(1)
            // see FileSaver.js
            saveAs(content, 'images.zip')
        })
        datas.length = 0
 }


function print(index,total){
let targetTextClass=".TrialLimitToast_txt__6vGfv"
$(targetTextClass).text("解析下载中:"+index+"/"+total)
}

function saveFiles(total_amount,start){
        let total_page=(total_amount-start+1);

        (async function() {
             let canvas=await elmGetter.get("canvas");
             let canvas_width=canvas.getAttribute("width")
             let canvas_height=canvas.getAttribute("height")
             //跳转下一页
             canvas.click();
             //新建一个固定宽度的canvas
             let new_canvas=createCanvasToDrawImg();
             let new_canvas_context=new_canvas.getContext("2d")
             //进行裁剪，sx为(canvas_width-617）/2，sy为0，裁剪的宽高和图像宽高，均为canvas的宽高
             new_canvas_context.drawImage(canvas,(canvas_width-617)/2,0,canvas_width,canvas_height,0,0,canvas_width,canvas_height);
             //获取canvas的base64数据
             var pngUrl = new_canvas.toDataURL();
             //base64转二进制file文件
             let file=imageBase64ToFile(count,pngUrl)
             //保存当前的file类型到数组中
             datas.push(file);
             //增加计数
             print(start+count-1,total_amount)
             count++;

             //若当前计数超过总页数，则停止定时任务，开始下载数据
             if(count>total_page){
             clearInterval(intervalID)
             download(start)
             count=0;
          }


         })();

}

    function addButton(){
        let button="<div class='Header_colLeft__1Ozut'><button class='HeaderButton_btn__17uiY' type='button' id='download'><span class='HeaderButton_content__3PWA_ HeaderButton_isStartIcon__3-mFy'>下载所有图片</span></button></div>"
        $('.Header_headerInner__3YIIh').append($(button))
        $("#download").on("click",function(){
         if($(".SpreadPage_popover__2LFol").text()=="見開き表示をOFF"){
         document.getElementsByClassName("SpreadPage_btn__5WMR3")[0].click();
       }
         let current_page=parseInt($(".PageCount_current__10rgh").text());
         let total_page = parseInt(document.getElementsByClassName("PageCount_total__3XPU7")[0].textContent);
         let div="<div class='TrialLimitToast_toast__1CKw5 TrialLimitToast_isActive__qivCB' style='top: 65%'><div><p class='TrialLimitToast_txt__6vGfv'>解析下载中:"+current_page+"/"+total_page+"</p></div></div>"
         $("canvas").css("display","none")
         $(".loContainer").append($(div));
	     intervalID = setInterval(saveFiles,480,total_page,current_page);
});
}

(async function() {
      const [elm1, elm2, elm3] = await elmGetter.get(['.PageCount_total__3XPU7', 'canvas', '#main_screen_layer']);
      addButton()
})();
    'use strict';

    // Your code here...
})();