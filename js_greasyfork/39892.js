// ==UserScript==
// @name         Sorting for TJU Drive
// @namespace    https://github.com/8qwe24657913
// @version      0.1
// @description  天大云盘排序，点击"文档名称 类型 大小 修改时间"四者之一可自定义排序方式
// @author       8qwe24657913
// @match        http://pan.tju.edu.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/39892/Sorting%20for%20TJU%20Drive.user.js
// @updateURL https://update.greasyfork.org/scripts/39892/Sorting%20for%20TJU%20Drive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 默认排序优先级:文档名称(正向字符串排序) > 类型/后缀名(正向字符串排序) > 大小(由小到大) > 修改时间(由新到旧)
    const sortPrecedence = [['name', false], ['type', false], ['size', false], ['modified', true]];
    const isFolder = info => info.size === -1;
    const getSuffix = info => {
        let arr = info.name.split('.');
        return arr.length > 1 ? arr[arr.length - 1] : '';
    };
    const names = [null, 'name', 'type', 'size', 'modified']; // 文档名称 类型 大小 修改时间
    const sortFns = {
        name: (a, b) => a.name.localeCompare(b.name),
        type: (a, b) => isFolder(a) ? isFolder(b) ? 0 : 1 : isFolder(b) ? -1 : getSuffix(a).localeCompare(getSuffix(b)),
        size: (a, b) => a.size - b.size,
        modified: (a, b) => a.modified - b.modified,
    };
    const css = `
.sftd-arrow::after {
border: .5em solid transparent;
width: 0;
height: 0;
display: inline-block;
content: "";
position: relative;
left: .25em;
}
.sftd-bottom-arrow::after {
border-top-color: grey;
top: .5em;
}
.sftd-top-arrow::after {
border-bottom-color: grey;
bottom: .5em;
}
`;
    (document.head || document.documentElement).appendChild(document.createElement('style')).appendChild(document.createTextNode(css));
    function toFastProperties(obj) { // https://stackoverflow.com/questions/24987896/how-does-bluebirds-util-tofastproperties-function-make-an-objects-properties
        /*jshint -W027*/
        function f() {}
        f.prototype = obj;
        //ASSERT("%HasFastProperties", true, obj);
        return f;
        eval(obj);
    }
    let list, uploader;
    Object.defineProperty(Function.prototype, 'defaultProps', { // hook react components
        set(val) {
            Object.defineProperty(this, 'defaultProps', {
                value: val,
                writable: true,
                configurable: true,
                enumerable: true
            });
            if (typeof this.prototype.updateDocs === 'function') {
                let updateDocs = this.prototype.updateDocs;
                this.prototype.updateDocs = function (docs) {
                    return updateDocs.call(list = this, docs.sort(function (a, b) {
                        for (let [pref, reverse] of sortPrecedence) {
                            let res = sortFns[pref](a, b);
                            if (res != 0) return reverse ? -res : res;
                        }
                        return 0;
                    }));
                };
                delete Function.prototype.defaultProps;
                toFastProperties(Function.prototype);
            }
        },
        configurable: true,
        enumerable: false
    });
    let last;
    document.addEventListener('click', function (e) {
        if (!list) return;
        let th = e.target.closest('th._-ShareWebUI-src-DataGrid-style-desktop---cell');
        if (!th) return;
        if (last && last !== th) last.classList.remove('sftd-arrow', 'sftd-top-arrow', 'sftd-bottom-arrow');
        last = th;
        th.classList.add('sftd-arrow');
        let reversed = th.classList.contains('sftd-top-arrow');
        if (reversed) {
            th.classList.remove('sftd-top-arrow');
            th.classList.add('sftd-bottom-arrow');
        } else {
            th.classList.remove('sftd-bottom-arrow');
            th.classList.add('sftd-top-arrow');
        }
        let name = names[[].indexOf.call(th.parentElement.children, th)],
            index = sortPrecedence.findIndex(([str]) => str === name);
        sortPrecedence.splice(index, 1);
        sortPrecedence.unshift([name, reversed]);
        list.updateDocs(list.state.docs);
    }, false);
})();
