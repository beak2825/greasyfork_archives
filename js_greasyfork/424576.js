// ==UserScript==
// @name         解决哈工程查成绩网站在现代浏览器上显示不出来具体成绩对话框的问题
// @namespace    https://github.com/Lifeni
// @version      0.0.2
// @description  只是一个 `window.showModalDialog()` 和 `<dialog>` 的 Polyfill
// @author       Lifeni
// @match        http*://*.hrbeu.edu.cn/*
// @require      https://unpkg.com/dialog-polyfill@0.5.6/dist/dialog-polyfill.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424576/%E8%A7%A3%E5%86%B3%E5%93%88%E5%B7%A5%E7%A8%8B%E6%9F%A5%E6%88%90%E7%BB%A9%E7%BD%91%E7%AB%99%E5%9C%A8%E7%8E%B0%E4%BB%A3%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8A%E6%98%BE%E7%A4%BA%E4%B8%8D%E5%87%BA%E6%9D%A5%E5%85%B7%E4%BD%93%E6%88%90%E7%BB%A9%E5%AF%B9%E8%AF%9D%E6%A1%86%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/424576/%E8%A7%A3%E5%86%B3%E5%93%88%E5%B7%A5%E7%A8%8B%E6%9F%A5%E6%88%90%E7%BB%A9%E7%BD%91%E7%AB%99%E5%9C%A8%E7%8E%B0%E4%BB%A3%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8A%E6%98%BE%E7%A4%BA%E4%B8%8D%E5%87%BA%E6%9D%A5%E5%85%B7%E4%BD%93%E6%88%90%E7%BB%A9%E5%AF%B9%E8%AF%9D%E6%A1%86%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

// 这只是一个 window.showModalDialog() 和 <dialog> 的 Polyfill
// 查成绩页面用到了 window.showModalDialog() 这个方法，
// 但是这个方法在现代的浏览器中已经不用了，
// 所以点击成绩的时候就加载不出来那个对话框，
// 因此只要添加一个“腻子脚本（Polyfill）”，把这个方法补上就行。

// 另外，在 Firefox 浏览器上，<dialog> 这个标签已经被删除了，
// 但是上面的腻子脚本用到了这个标签，
// 所以还要添加 <dialog> 的腻子脚本。

// **注意** 右上角的才是关闭按钮。

// 引用的两个腻子脚本分别是
// https://github.com/niutech/showModalDialog
// https://github.com/GoogleChrome/dialog-polyfill

(function () {
    window.spawn = window.spawn || function(gen) {
        function continuer(verb, arg) {
            var result;
            try {
                result = generator[verb](arg);
            } catch (err) {
                return Promise.reject(err);
            }
            if (result.done) {
                return result.value;
            } else {
                return Promise.resolve(result.value).then(onFulfilled, onRejected);
            }
        }
        var generator = gen();
        var onFulfilled = continuer.bind(continuer, 'next');
        var onRejected = continuer.bind(continuer, 'throw');
        return onFulfilled();
    };

    window.showModalDialog = window.showModalDialog || function(url, arg, opt) {
        url = url || ''; //URL of a dialog
        arg = arg || null; //arguments to a dialog
        opt = opt || 'dialogWidth:300px;dialogHeight:200px'; //options: dialogTop;dialogLeft;dialogWidth;dialogHeight or CSS styles
        var caller = showModalDialog.caller.toString();

        // <dialog> 的 Polyfill 需要先注册一下
        var el = document.createElement('dialog');
        var dialog = document.body.appendChild(el);
        dialogPolyfill.registerDialog(el);

        dialog.setAttribute('style', opt.replace(/dialog/gi, ''));
        dialog.innerHTML = '<a href="#" id="dialog-close" style="position: absolute; top: 0; right: 5px; font-size: 20px; color: #000; text-decoration: none; outline: none;">&times;</a><iframe id="dialog-body" src="' + url + '" style="border: 0; width: 100%; height: 100%;"></iframe>';
        document.getElementById('dialog-body').contentWindow.dialogArguments = arg;
        document.getElementById('dialog-close').addEventListener('click', function(e) {
            e.preventDefault();
            dialog.close();
        });
        dialog.showModal();
        //if using yield or async/await
        if(caller.indexOf('yield') >= 0 || caller.indexOf('await') >= 0) {
            return new Promise(function(resolve, reject) {
                dialog.addEventListener('close', function() {
                    var returnValue = document.getElementById('dialog-body').contentWindow.returnValue;
                    document.body.removeChild(dialog);
                    resolve(returnValue);
                });
            });
        }
        //if using eval
        var isNext = false;
        var nextStmts = caller.split('\n').filter(function(stmt) {
            if(isNext || stmt.indexOf('showModalDialog(') >= 0)
                return isNext = true;
            return false;
        });
        dialog.addEventListener('close', function() {
            var returnValue = document.getElementById('dialog-body').contentWindow.returnValue;
            document.body.removeChild(dialog);
            nextStmts[0] = nextStmts[0].replace(/(window\.)?showModalDialog\(.*\)/g, JSON.stringify(returnValue));
            eval('{\n' + nextStmts.join('\n'));
        });
        throw 'Execution stopped until showModalDialog is closed';
    };
})();
