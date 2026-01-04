// ==UserScript==
// @name         Live-comments unblock
// @name:ru-RU   Разблокировать лайв комментарии
// @namespace    Violentmonkey Scripts
// @match        https://tjournal.ru/*
// @match        https://dtf.ru/*
// @match        https://vc.ru/*
// @version      0.7
// @author       Dmitry
// @description  Live-comments unblock. Thanks to https://greasyfork.org/en/scripts/19993-ru-adlist-js-fixes
// @description:ru-RU  Разблокировать лайв комментарии. Способ взят из https://greasyfork.org/en/scripts/19993-ru-adlist-js-fixes
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/430061/Live-comments%20unblock.user.js
// @updateURL https://update.greasyfork.org/scripts/430061/Live-comments%20unblock.meta.js
// ==/UserScript==
(function () {
    'use strict';
    
    const win = (unsafeWindow || window),
      regex = /e\.isShowBanner/,
      regex2 = /function\((.*?)\){/,
      _bindCall = fun => Function.prototype.call.bind(fun),
      _toString = _bindCall(Function.prototype.toString);
    var isPatched = false;

    function wrapPush(webpack) {
        console.log('wrapPush define');
        let _push = webpack.push.bind(webpack);
        Object.defineProperty(webpack, 'push', {
            get() {
                return _push;
            },
            set(vl) {
                _push = new Proxy(vl, {
                    apply(fun, that, args) {
                        wrapper: {
                            if(isPatched)
                                break wrapper;
                            if (!(args[0]instanceof Array))
                                break wrapper;
                            let funs = args[0][1];
                            if (!(funs instanceof Object && !(funs instanceof Array)))
                                break wrapper;
                            //const noopFunc = (name, text) => () => console.log(`Skip webpack ${name}`, text);
                            let funstr;
                            for (let name in funs) {
                                if(isPatched)
                                    break;
                                if (typeof funs[name] !== 'function')
                                    continue;
                                funstr = _toString(funs[name]);
                                if (regex.test(funstr)) {
                                    isPatched = true;
                                    console.log('find', name);
                                    //console.log('code', funstr);
                                    let a = funstr.match(regex2);
                                    funs[name].a = a[1];
                                    funs[name].c = funstr.replace(regex, 'false').replace(a[0], 'console.log(\'patched ¯\_(ツ)_/¯\');').slice(0, -1);
                                    const handler = {
                                        apply(fun, that, args) {                                        
                                            return Reflect.apply(new Function(fun.a.split(","), fun.c), that, args);
                                        }
                                    }
                                    funs[name] = new Proxy(funs[name], handler);
                                }
                            }
                        }
                        return Reflect.apply(fun, that, args);
                    }
                });
                return true;
            }
        });
        return webpack;
    }

    let _webpackJsonp = wrapPush([]);
    Object.defineProperty(win, 'webpackJsonp', {
        get() {
            return _webpackJsonp;
        },
        set(vl) {
            if (vl === _webpackJsonp)
                return;
            _webpackJsonp = wrapPush(vl);
        }
    });
})();