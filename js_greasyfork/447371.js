
let isDebug = true;
let os = function () {
    var ua = navigator.userAgent, //获取浏览器UA
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    };
}();
function Get(link) {
    return new Promise(function (resolve) {
        $.get(link, data => {
            resolve(data);
        });
    });
}
//日志
function log() {
    if (isDebug) {
        console.log.apply(this, arguments);
    }
};
function err() {
    if (isDebug) {
        console.error.apply(this, arguments);
    }
}
function addStyle(statement = null, href = null) {
    let mountElement = document.getElementsByTagName('head')[0];
    if (mountElement) {
        let style = null;
        if (href !== null) {
            style = document.createElement('link');
            style.setAttribute('href', href);
            style.setAttribute('rel', 'stylesheet');
        } else if (statement !== null) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = statement;
        }
        return new Promise((resolve, reject) => {
            try {
                mountElement.appendChild(style);
                style.onerror = (e) => reject(e);
                style.onload = () => {
                    resolve();
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    return null;
}
function addScript(statement = null, src = null, isModule = false) {
    let mountElement = document.getElementsByTagName('head')[0];
    if (mountElement) {
        let script = document.createElement("script");
        if (src !== null) {
            script.src = src;
        } else if (statement !== null) {
            script.textContent = statement;
            if (isModule) script.type = "module";
        }
        return new Promise((resolve, reject) => {
            try {
                mountElement.appendChild(script);
                script.onerror = (e) => reject(e);
                script.onload = () => {
                    resolve();
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    return null;
}
//判断变量是否为空  空返回TRUE 否则返回 FALSE
function isEmpty(param){
    if(param){
        var param_type = typeof(param);
        if(param_type == 'object'){
            //要判断的是【对象】或【数组】或【null】等
            if(typeof(param.length) == 'undefined'){
                if(JSON.stringify(param) == "{}"){
                    return true;//空值，空对象
                }
            }else if(param.length == 0){
                return true;//空值，空数组
            }
        }else if(param_type == 'string'){
            //如果要过滤空格等字符
            var new_param = param.trim();
            if(new_param.length == 0){
                //空值，例如:带有空格的字符串" "。
                return true;
            }
        }else if(param_type == 'boolean'){
            if(!param){
                return true;
            }
        }else if(param_type== 'number'){
            if(!param){
                return true;
            }
        }
        return false;//非空值
    }else{
        //空值,例如：
        //(1)null
        //(2)可能使用了js的内置的名称，例如：var name=[],这个打印类型是字符串类型。
        //(3)空字符串''、""。
        //(4)数字0、00等，如果可以只输入0，则需要另外判断。
        return true;
    }
}
//自定义过滤函数
function trimSpace(array) {
    for (var i = 0; i < array.length; i++) {
        //这里为过滤的值
        if (array[i] == "" || array[i] == null || typeof (array[i]) == "undefined") {
            array.splice(i, 1);
            i = i - 1;
        }
    }
    return array;
}