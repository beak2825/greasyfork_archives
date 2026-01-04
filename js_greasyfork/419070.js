// ==UserScript==
// @name         某高校教务系统修复
// @namespace    http://210.34.112.93:8088/
// @version      0.1
// @description  Fixxx
// @author       CrazyCoder
// @match        http://210.34.112.93:8088/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_log
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/419070/%E6%9F%90%E9%AB%98%E6%A0%A1%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/419070/%E6%9F%90%E9%AB%98%E6%A0%A1%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
function polyFill() {
    class ActiveXObject extends XMLHttpRequest {
        constructor(shit) {
            super()
        }
    }
    window.ActiveXObject = ActiveXObject
    document.__getElementById = document.getElementById
    document.getElementById = function(arg) {
        let metA = document.__getElementById(arg)
        if(!metA) {
            metA = document.getElementsByTagName(arg)[0]
        }
        if(!metA) {
            if(arg == 'subSysMenuSelectID') {
                return {
                    value: 'td0'
                }
            }
        }
        return metA;
    }
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
        var dialog = document.body.appendChild(document.createElement('dialog'));
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
    XMLDocument.prototype.selectNodes = function (xpath) {
        let rets = []
        let results =  document.evaluate(xpath, this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let val;
        while(val = results.iterateNext()) {
            rets.push(val)
        }
        return rets;
    }
    Object.defineProperty(Attr.prototype, "text", {
        get: function () {
            return this.textContent
        }
    })
}
document.head.appendChild(document.createElement('script')).innerHTML = polyFill.toString().replace(/^function.*{|}$/g, '');
(function () {
    'use strict';
    GM_addStyle ( `
    .mainIframeClass {
        WIDTH: 100%;HEIGHT: ${document.body.offsetHeight - 137}px; !important
    }
    ` );
})();