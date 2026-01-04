// ==UserScript==
// @name        qchook
// @namespace   qchook
// @match       *://*/*
// @grant       none
// @version     1.2
// @author      cthousand
// @description 2023/11/15 14:17:13
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535757/qchook.user.js
// @updateURL https://update.greasyfork.org/scripts/535757/qchook.meta.js
// ==/UserScript==
window.yqvm = {
    "toolsFunc": {},//功能函数相关，插件
    "memory": {}, // 内存
    'hook': {},
    'proxy': {}
}
yqvm.debug_array = [] //用于debugger
yqvm.memory.symbolProxy = Symbol("proxy");// 独一无二的属性, 标记是否已代理
yqvm.memory.symbolData = Symbol("data");// 用来保存当前对象上的原型属性
yqvm.memory.symbolToString = Symbol("toString");// 用来保存当前对象上的原型属性
yqvm.memory.symbolRawFatherObj = Symbol('fatherObj')//用于更改apply行为内部this指向到原生对象,而非Proxy对象
yqvm.memory.symbolRawSelfObj = Symbol('selfObj')//用于更改construct行为内部this指向到原生对象,而非Proxy对象
yqvm.memory.symbolObjName = Symbol('name')//用于表示被创建的元素名称,方便在内存中通过此属性精准定位到
yqvm.memory.symbolRawName = Symbol('rawName')//用于表示被创建的元素名称,方便在内存中通过此属性精准定位到

// 函数native化
!function () {
    const $toString = Function.prototype.toString;
    const myToString = function () {
        return typeof this === 'function' && this[yqvm.memory.symbolToString] || $toString.call(this);
    }

    function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
        });
    }

    delete Function.prototype.toString;
    set_native(Function.prototype, "toString", myToString);
    set_native(Function.prototype.toString, yqvm.memory.symbolToString, "function toString() { [native code] }");
    yqvm.toolsFunc.setNative = function (func, funcname) {
        set_native(func, yqvm.memory.symbolToString, `function ${funcname || func.name || ''}() { [native code] }`);
    }
}();
// 函数重命名
yqvm.toolsFunc.reNameFunc = function reNameFunc(func, name) {
    Object.defineProperty(func, "name", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: name
    });
}
// hook 插件
yqvm.toolsFunc.hook = function hook(func, funcInfo, isDebug, onEnter, onLeave, isExec) {
    // func ： 原函数，需要hook的函数
    // funcInfo: 是一个对象，objName，funcName属性
    // isDebug: 布尔类型, 是否进行调试，关键点定位，回溯调用栈
    // onEnter：函数， 原函数执行前执行的函数，改原函数入参，或者输出入参
    // onLeave： 函数，原函数执行完之后执行的函数，改原函数的返回值，或者输出原函数的返回值
    // isExec ： 布尔， 是否执行原函数，比如无限debuuger函数
    if (typeof func !== 'function') {
        return func;
    }
    if (funcInfo === undefined) {
        funcInfo = {};
        funcInfo.objName = "globalThis";
        funcInfo.funcName = func.name || '';
    }
    if (isDebug === undefined) {
        isDebug = false;
    }
    if (!onEnter) {
        onEnter = function (obj) {
            yqvm.log(`{hook|${funcInfo.objName}[${funcInfo.funcName}]正在调用，参数是${JSON.stringify(obj.args)}}`);
        }
    }
    if (!onLeave) {
        onLeave = function (obj) {
            yqvm.log(`{hook|${funcInfo.objName}[${funcInfo.funcName}]正在调用，返回值是[${obj.result}}]`);
        }
    }
    if (isExec === undefined) {
        isExec = true;
    }
    // 替换的函数
    let hookFunc = function () {
        if (isDebug) {
            debugger;
        }
        let obj = {};
        obj.funcInfo = funcInfo
        obj.args = [];
        for (let i = 0; i < arguments.length; i++) {
            obj.args[i] = arguments[i];
        }
        // 原函数执行前
        onEnter.call(this, obj); // onEnter(obj);
        // 原函数正在执行
        let result;
        if (isExec) {
            result = func.apply(this, obj.args);
        }
        obj.result = result;
        // 原函数执行后
        onLeave.call(this, obj); // onLeave(obj);
        // 返回结果
        return obj.result;
    }
    // hook 后的函数进行native
    yqvm.toolsFunc.setNative(hookFunc, funcInfo.funcName);
    yqvm.toolsFunc.reNameFunc(hookFunc, funcInfo.funcName);
    return hookFunc;
}
//自定义log
yqvm.log = yqvm.toolsFunc.hook(
    console.log,
    undefined,
    false,
    function () { },
    function () { },
    true
);
// hook 对象的属性，本质是替换属性描述符
yqvm.toolsFunc.hookObj = function hookObj(obj, objName, propName, isDebug, onEnter, onLeave, isExec) {
    // obj :需要hook的对象
    // objName: hook对象的名字
    // propName： 需要hook的对象属性名
    // isDubug: 是否需要debugger
    let oldDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
    let newDescriptor = {};
    if (!oldDescriptor.configurable) { // 如果是不可配置的，直接返回
        return;
    }
    // 必须有的属性描述
    newDescriptor.configurable = true;
    newDescriptor.enumerable = oldDescriptor.enumerable;
    if (oldDescriptor.hasOwnProperty("writable")) {
        newDescriptor.writable = oldDescriptor.writable;
    }
    if (oldDescriptor.hasOwnProperty("value")) {
        let value = oldDescriptor.value;
        if (typeof value !== "function") {
            return;
        }
        let funcInfo = {
            "objName": objName,
            "funcName": propName
        }
        newDescriptor.value = yqvm.toolsFunc.hook(value, funcInfo, isDebug, onEnter, onLeave, isExec);
    }
    if (oldDescriptor.hasOwnProperty("get")) {
        let get = oldDescriptor.get;
        let funcInfo = {
            "objName": objName,
            "funcName": `get ${propName}`
        }
        newDescriptor.get = yqvm.toolsFunc.hook(get, funcInfo, isDebug, onEnter, onLeave, isExec);
    }
    if (oldDescriptor.hasOwnProperty("set")) {
        let set = oldDescriptor.set;
        let funcInfo = {
            "objName": objName,
            "funcName": `set ${propName}`
        }
        newDescriptor.set = yqvm.toolsFunc.hook(set, funcInfo, isDebug, onEnter, onLeave, isExec);
    }
    Object.defineProperty(obj, propName, newDescriptor);
}

// Proxy
yqvm.toolsFunc.proxy = function proxy(obj, objName) {
    // obj: 原始对象
    // objName: 原始对象的名字
    // 代理前需要注意,一些configuable为false的对象不可被代理,需要滤过
    let RawFatherObj
    if (Object.hasOwnProperty.call(obj, yqvm.memory.symbolRawFatherObj)) {
        RawFatherObj = obj[yqvm.memory.symbolRawFatherObj]
    } else {
        RawFatherObj = void 0
    }
    let RawName = Object.hasOwnProperty.call(obj, yqvm.memory.symbolRawName) && obj[yqvm.memory.symbolRawName]
    let propertyDes = RawFatherObj && Object.getOwnPropertyDescriptor(RawFatherObj, RawName)
    let configurable = propertyDes && propertyDes['configurable']
    if (configurable === false && !Object.hasOwnProperty.call(RawFatherObj, yqvm.memory.symbolToString)) { //构造函数默认prototype是不可配置的,这里用双层确认以过滤出内置对象
        return obj
    }
    if (!yqvm.config.proxy) {
        return obj;
    }
    if (Object.hasOwnProperty.call(obj, yqvm.memory.symbolProxy)) {
        return obj[yqvm.memory.symbolProxy]
    }
    let handler = {
        get: function (target, prop, receiver) {// 三个参数
            let result;
            // if(prop==='href'){debugger}
            try {//防止报错
                result = Reflect.get(target, prop, receiver);
                //拦截
                if (objName === 'document' && prop === 'all') {
                    yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],该对象为防typeof检测不设代理}`);
                    // debugger
                    return result
                }
                if (yqvm.toolsFunc.filterProxyProp(prop)) {
                    return result; //Proxy对象白名单
                }
                let type = yqvm.toolsFunc.getType(result);
                if (result instanceof Object) {
                    yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
                    //将原生父对象(相对于result)的地址存到result的symbol属性中,方便在apply行为中更改this指向
                    Object.defineProperty(result, yqvm.memory.symbolRawFatherObj, {
                        configurable: true,
                        enumerable: false,
                        writable: true,
                        value: target
                    })
                    //将原生对象地址存到result的symbol属性中,方便在construct行为中更改this指向
                    Object.defineProperty(result, yqvm.memory.symbolRawSelfObj, {
                        configurable: true,
                        enumerable: false,
                        writable: true,
                        value: result
                    })
                    //将对象名字存到result的symbol属性中,在过滤不可配置属性时(Object.hasOwnProperty)作为prop字符串
                    Object.defineProperty(result, yqvm.memory.symbolRawName, {
                        configurable: true,
                        enumerable: false,
                        writable: true,
                        value: prop
                    })
                    // 递归代理
                    result = yqvm.toolsFunc.proxy(result, `${objName}.${prop.toString()}`);
                } else if (typeof result === "symbol") {
                    yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],ret:[${result.toString()}]}`);
                } else {
                    yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],ret:[${result}]}`);
                }

            } catch (e) {
                yqvm.log(`{get|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
            }
            return result;
        },
        set: function (target, prop, value, receiver) {
            let result;
            try {
                result = Reflect.set(target, prop, value, receiver);
                if (yqvm.toolsFunc.filterProxyProp(prop)) {
                    return result; //Proxy对象白名单
                }
                let type = yqvm.toolsFunc.getType(value);
                if (value instanceof Object) {
                    yqvm.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
                } else if (typeof value === "symbol") {
                    yqvm.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],value:[${value.toString()}]}`);
                } else {
                    yqvm.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],value:[${value}]}`);
                }
            } catch (e) {
                yqvm.log(`{set|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
            }
            return result;
        },
        // getOwnPropertyDescriptor: function (target, prop) {
        //     let result;// undefined, 描述符对象
        //     try {
        //         result = Reflect.getOwnPropertyDescriptor(target, prop);
        //         let type = yqvm.toolsFunc.getType(result);
        //         //过滤一些不希望输出的日志，如SymbolProxy,SymbolDate
        //         if (!yqvm.toolsFunc.filterLogProxyProp(prop)) {
        //             yqvm.log(`{getOwnPropertyDescriptor|obj:[${objName}] -> prop:[${prop.toString()}],type:[${type}]}`);
        //         }
        //         // if(typeof result !== "undefined"){
        //         //     result = yqvm.toolsFunc.proxy(result, `${objName}.${prop.toString()}.PropertyDescriptor`);
        //         // }
        //     } catch (e) {
        //         yqvm.log(`{getOwnPropertyDescriptor|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
        //     }
        //     return result;
        // },
        // defineProperty: function (target, prop, descriptor) {
        //     let result;
        //     try {
        //         //将this执行原生对象
        //         //target=target[yqvm.memory.symbolRawFatherObj]
        //         result = Reflect.defineProperty(target, prop, descriptor);
        //         //过滤一些不希望输出的日志，如SymbolProxy,SymbolDate
        //         if (!yqvm.toolsFunc.filterLogProxyProp(prop)) {
        //             yqvm.log(`{defineProperty|obj:[${objName}] -> prop:[${prop.toString()}]}`);
        //         }

        //     } catch (e) {
        //         debugger
        //         yqvm.log(`{defineProperty|obj:[${objName}] -> prop:[${prop.toString()}],error:[${e.message}]}`);
        //     }
        //     return result;
        // },
        apply: function (target, thisArg, argumentsList) {
            // target: 函数对象
            // thisArg: 调用函数的this指针
            // argumentsList: 数组， 函数的入参组成的一个列表
            // debug
            let result;
            try {
                // if(argumentsList.indexOf('iframe')!==-1){debugger}
                //特殊函数过滤（不可被执行）
                // if(['URL'].indexOf(objName)!==-1){
                //     return yqvm.toolsFunc.throwError("TypeError", "Failed to construct 'URL': 1 argument required, but only 0 present.")
                // }
                result = Reflect.apply(target, thisArg, argumentsList);
                let type = yqvm.toolsFunc.getType(result);
                if (result instanceof Object) {
                    let result_objName = `${objName}_obj${yqvm.memory.globalVar.id++}`
                    result = yqvm.toolsFunc.proxy(result, result_objName) //让function返回的对象也自动套上代理
                    yqvm.log(`{apply|function:[${objName}], args:[${argumentsList}], type:[${type}]}`);
                } else if (typeof result === "symbol") {
                    yqvm.log(`{apply|function:[${objName}], args:[${argumentsList}], result:[${result.toString()}]}`);
                } else {
                    yqvm.log(`{apply|function:[${objName}], args:[${argumentsList}], result:[${result}]}`);
                }
            } catch (e) {
                yqvm.log(`{apply|function:[${objName}],error:[${e.message}]}`);
                if (e[yqvm.memory.symbolError]) {
                    yqvm.toolsFunc.throwError(e['name'], e['message'])
                }
            }
            return result;
        },
        construct: function (target, argArray, newTarget) {
            // target: 函数对象
            // argArray： 参数列表
            // newTarget：代理对象
            let result;
            try {
                result = Reflect.construct(target, argArray, newTarget);
                let type = yqvm.toolsFunc.getType(result);
                yqvm.log(`{construct|function:[${objName}], argArray:[${argArray}] , type:[${type}]}`);
            } catch (e) {
                yqvm.log(`{construct|function:[${objName}],error:[${e.message}]}`);
            }
            return result;

        },
        deleteProperty: function (target, propKey) {
            let result = Reflect.deleteProperty(target, propKey);
            yqvm.log(`{deleteProperty|obj:[${objName}] -> prop:[${propKey.toString()}], result:[${result}]}`);
            return result;
        },
        // has: function (target, propKey) { // in 操作符
        //     let result = Reflect.has(target, propKey);
        //     if (!yqvm.toolsFunc.filterLogProxyProp(propKey)) {
        //         yqvm.log(`{has|obj:[${objName}] -> prop:[${propKey.toString()}], result:[${result}]}`);
        //     }
        //     return result;
        // },
        // ownKeys: function (target) {
        //     let result = Reflect.ownKeys(target);
        //     yqvm.log(`{ownKeys|obj:[${objName}]}`);
        //     return result
        // },
        // getPrototypeOf: function (target) {
        //     let result = Reflect.getPrototypeOf(target);
        //     yqvm.log(`{getPrototypeOf|obj:[${objName}]}`);
        //     return result;
        // },
        // setPrototypeOf: function (target, proto) {
        //     let result = Reflect.setPrototypeOf(target, proto);
        //     yqvm.log(`{setPrototypeOf|obj:[${objName}]}`);
        //     return result;
        // },
        // preventExtensions: function (target) {
        //     let result = Reflect.preventExtensions(target, proto);
        //     yqvm.log(`{preventExtensions|obj:[${objName}]}`);
        //     return result;
        // },
        // isExtensible: function (target) {
        //     let result = Reflect.isExtensible(target, proto);
        //     yqvm.log(`{isExtensible|obj:[${objName}]}`);
        //     return result;
        // }
    };
    let proxyObj = new Proxy(obj, handler);
    //防止重复代理，导致代理被用嵌套对比的方式检测出来
    Object.defineProperty(obj, yqvm.memory.symbolProxy, {
        configurable: true,
        enumerable: false,
        writable: false,
        value: proxyObj
    })
    return proxyObj
}

//hook方法写在下面
//hook cookie
yqvm.hook.Document_cookie = function (isDebug, args) {
    let onEnter = function (obj) {
        yqvm.log(`{hook|${obj.funcInfo.objName}[${obj.funcInfo.funcName}]正在调用，参数是${JSON.stringify(obj.args)}}`);
        if (obj.funcInfo.funcName === 'set cookie' && obj.args[0].indexOf(args) !== -1 && isDebug) {
            debugger
        }
    }
    yqvm.toolsFunc.hookObj(Document.prototype, 'Document.prototype', 'cookie', false, onEnter, undefined, true)
}
//hook xhr_open
yqvm.hook.XMLHttpRequest_open = function (isDebug, args) {
    let onEnter = function (obj) {
        yqvm.log(`{hook|${obj.funcInfo.objName}[${obj.funcInfo.funcName}]正在调用，参数是${JSON.stringify(obj.args)}}`);
        if (obj.args[1].indexOf(args) !== -1 && isDebug) {
            debugger
        }
    }
    yqvm.toolsFunc.hookObj(XMLHttpRequest.prototype, 'XMLHttpRequest.prototype', 'open', false, onEnter, undefined, true)
}
//hook xhr_send
yqvm.hook.XMLHttpRequest_send = function (isDebug, data) {
    let onEnter = function (obj) {
        yqvm.log(`{hook|${obj.funcInfo.objName}[${obj.funcInfo.funcName}]正在调用，参数是${JSON.stringify(obj.args)}}`);
        if (obj.args[0] && obj.args[0].indexOf(data) !== -1 && isDebug) {
            debugger
        }
    }
    yqvm.toolsFunc.hookObj(XMLHttpRequest.prototype, 'XMLHttpRequest.prototype', 'send', false, onEnter, undefined, true)
}
//hook XMLHttpRequest.prototype.onreadystatechange
yqvm.hook.XMLHttpRequest_onreadystatechange = function (isDebug) {
    let onEnter = function (obj) {
        yqvm.log(`{hook|${obj.funcInfo.objName}[${obj.funcInfo.funcName}]正在调用`);
        if (this.responseURL.indexOf("batchexecute?rpcids=M0CRd") != -1 && this.readyState === 4 && isDebug) {
            debugger
        }
    }
    yqvm.toolsFunc.hookObj(XMLHttpRequest.prototype, 'XMLHttpRequest.prototype', 'onreadystatechange', false, onEnter, undefined, true)

}
//hook XMLHttpRequest.prototype.responseText
yqvm.hook.XMLHttpRequest_responseText = function (isDebug) {
    let onEnter = function (obj) {
        yqvm.log(`{hook|${obj.funcInfo.objName}[${obj.funcInfo.funcName}]正在调用`);
        if (this.responseURL.indexOf("batchexecute?rpcids=M0CRd") != -1 && this.readyState === 4 && this.response.indexOf("g04aAb") != -1 && isDebug) {
            debugger
        }
    }
    yqvm.toolsFunc.hookObj(XMLHttpRequest.prototype, 'XMLHttpRequest.prototype', 'responseText', false, onEnter, undefined, true)

}

//hook HTMLCanvasElement.prototype.toDataURL
yqvm.hook.HTMLCanvasElement_toDataURL = function (isDebug) {
    let onLeave = function (obj) {
        yqvm.log(`{hook|${obj.funcInfo.objName}[${obj.funcInfo.funcName}]正在调用|result:[${obj.result}]`);
        if (isDebug) {
            debugger
        }
    }
    yqvm.toolsFunc.hookObj(HTMLCanvasElement.prototype, 'HTMLCanvasElement.prototype', 'toDataURL', false, undefined, onLeave, true)

}


//hook window_open
yqvm.hook.window_open = function (isDebug,args) {
    let onEnter = function (obj) {
        yqvm.log(`{hook|${obj.funcInfo.objName}[${obj.funcInfo.funcName}]正在调用，参数是${JSON.stringify(obj.args)}}`);
        if (obj.args[0].indexOf(args) !== -1 && isDebug) {
            yqvm.log(obj.args[0]);
            debugger
        }
    }
    yqvm.toolsFunc.hookObj(window, 'window', 'open', false, onEnter, undefined, true)

}


//hook window_close
yqvm.hook.window_close = function (isDebug) {
    yqvm.toolsFunc.hookObj(window, 'window', 'open', isDebug, undefined, undefined, true)
}

//hook window_close
yqvm.hook.window_close = function (isDebug) {
    yqvm.toolsFunc.hookObj(window, 'window', 'open', isDebug, undefined, undefined, true)
}

//hook window_btoa
yqvm.hook.window_btoa = function (isDebug,args) {
      let onLeave = function (obj) {
        yqvm.log(`{hook|${obj.funcInfo.objName}[${obj.funcInfo.funcName}]正在调用|result:[${obj.result}]`);
        if (obj.result.indesOf(args)!==-1 && isDebug) {
            debugger
        }
    }
    yqvm.toolsFunc.hookObj(window, 'window', 'btoa', false, undefined, undefined, true)
}

//hook window_atob
yqvm.hook.window_atob = function (isDebug,args) {
    let onEnter = function (obj) {
        yqvm.log(`{hook|${obj.funcInfo.objName}[${obj.funcInfo.funcName}]正在调用，参数是${JSON.stringify(obj.args)}}`);
        if (obj.args[0].indexOf(args) !== -1 && isDebug) {
            debugger
        }
    }
    yqvm.toolsFunc.hookObj(window, 'window', 'atob', false, undefined, undefined, true)
}


// yqvm.hook.XMLHttpRequest_send(true,'ua')
yqvm.hook.Document_cookie(true,"EqLJ0qhYnviOGCTm")