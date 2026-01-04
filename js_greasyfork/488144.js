/* 
    Aluk Query Library
    (c)2023-2024 Flutas,All rights,Reserved.
    (Powered by Xbodw)

    Linense MIT
*/
(function() {
  /**
 * @param {*} s - Selector
 * @param {*} [m] - Mode
 * @param {*} [e] - The base object
 */
window.aluk = function(s, m, e) {
    return new querylist(s, m, e);
}

var al = {
    fn: {
        request: (o, method) => {
            if (!o) {
                o = { promise: false, url: '' }
            }
            if (o.jsonp) {
                return new Promise((resolve) => {
                    var script = document.createElement('script');
                    let url = new URL(o.url);
                    let param = url.searchParams;
                    let callback = aluk.generateRandomFunctionName();
                    if (!(param.get('callback'))) {
                        param.set('callback', callback);
                    }
                    script.src = url.href;
                    window[callback] = function (data) {
                        delete window[callback];
                        document.body.removeChild(script);
                        resolve(data);
                    };
                    document.body.appendChild(script);
                });
            }
            return new Promise((resolve, reject) => {
                if (o.promise) {
                    fetch(o.url, {
                        method: method || 'GET',
                        headers: o.headers,
                        body: o.body,
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                } else {
                    var xhr = new XMLHttpRequest();
                    xhr.open(method || 'GET', o.url);
                    if (o.headers) {
                        for (var header in o.headers) {
                            xhr.setRequestHeader(header, o.headers[header]);
                        }
                    }
                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.response);
                        } else {
                            reject(xhr.statusText);
                        }
                    };
                    xhr.onerror = () => {
                        reject(xhr.statusText);
                    };
                    xhr.send(o.body);
                }
            });
        }
    }
}
aluk.version = '1.5.1';
aluk.language = 'zh-cn';

aluk.generateRandomFunctionName = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 10;
    let randomFunctionName = 'aluk';
    for (let i = 0; i < length; i++) {
        randomFunctionName += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomFunctionName;
}

/**
 * @param {*} s - Selector
 * @param {*} [m] - Mode
 * @param {*} [e] - The base object
 */
function querylist(s, m = {}, e = document) {
    var ce;

    if (s == '' || s == undefined) {
        ce = '';
        return;
    }
    if (typeof (s) == 'string' && aluk.checkHtml(s) === false) {
        try {
            ce = e.querySelectorAll(s);
        } catch (ex) {
            ce = e;
            throw new Error("Failed to execute aluk(s,m,e): selector is undefined or Query Failed")
        }

    } else {
        if (typeof (s) == 'number') {
            ce = '';
        } else {
            if (typeof (s) == 'object') {
                ce = new Array(s);
            } else {
                if (aluk.checkHtml(s) === true) {
                    ce = new Array(aluk.htmlToElement(s));
                }
            }
        }
    }
    if (m.shadowroot == true) {
        ce = Array.from(ce).reduce((acc, curr) => {
            acc.push(curr);
            if (curr.shadowRoot) {
                let shadowRootElements = curr.shadowRoot.querySelectorAll('*');
                acc.push(...shadowRootElements);
                shadowRootElements.forEach(element => {
                    let nestedShadowRootElements = queryShadowRoots(element);
                    acc.push(...nestedShadowRootElements);
                });
            }
            return acc;
        }, []);

    }
    if (ce.length > 1) {
        ce.forEach(element => {
            this.push(element);
        });
    } else {
        if (ce.length > 0) {
            this.push(ce[0]);
        }
    }

    this.NormalResult = document;
}


function queryShadowRoots(element) {
    if (element.shadowRoot) {
        let elements = element.shadowRoot.querySelectorAll('*');
        let result = Array.from(elements);
        elements.forEach(el => {
            let nestedShadowRootElements = queryShadowRoots(el);
            result.push(...nestedShadowRootElements);
        });
        return result;
    } else {
        return [];
    }
}

/*
function querylist(s,m = {},e = document) {
    var ce;
    if (s == '' || s == undefined) {
        ce = '';
        return;
    }
    if (typeof (s) == 'string' && aluk.checkHtml(s) === false) {
        try {
            ce = e.querySelectorAll(s);
        } catch(ex) {
            ce = e;
            throw new Error("Failed to execute aluk(s,m,e): selector is undefined or Query Failed")
        }
        
    } else {
        if (typeof (s) == 'number') {
            ce = '';
        } else {
            if (typeof (s) == 'object') {
                ce = new Array(s);
            } else {
                if (aluk.checkHtml(s) === true) {
                    ce = new Array(aluk.htmlToElement(s));
                }
            }
        }
    }
    if(m.shadowroot == true) {
        ce = [];
        
    }
    if (ce.length > 1) {
        ce.forEach(element => {
            this.push(element);
        });
    } else {
        if (ce.length > 0) {
            this.push(ce[0]);
        }
    }
    
    this.NormalResult = document;
}
*/

querylist.prototype = new Array();

querylist.prototype.createChildElement = function (index, options) {
    if (typeof (options) != 'object') {
        if (aluk.language != 'zh-cn') {
            throw new Error('Element Options Type Must as the Object');
        } else {
            throw new Error('Element选项必须是Object');
        }
    }
    if (options.ElementType == undefined) {
        if (aluk.language != 'zh-cn') {
            throw new Error('Element name not specified or empty')
        } else {
            throw new Error('Element类型不能为空');
        }


    }
    if (options.ElementType == '') {
        if (aluk.language != 'zh-cn') {
            throw new Error('Element name not specified or empty')
        } else {
            throw new Error('Element类型不能为空');
        }
    }
    var result = document.createElement(options.ElementType);
    if (options.Class == undefined) {

    } else {
        result.classList.value += options.Class;
    }
    if (options.id == undefined) {

    } else {
        result.id = options.id;
    }
    if (options.innerHTML == undefined) {

    } else {
        result.innerHTML = options.innerHTML;
    }
    this[index].appendChild(result);
    return Promise.resolve(this[index]);
}

aluk.objectToCss = function (o, m = {}) {
    return Object.entries(o)
        .map(([key, value]) => `${key}: ${value};`)
    //.join('\n');
}

querylist.prototype.SetCss = function (index, cssList) {

    if (typeof (index) == 'object') {
        var csst = aluk.objectToCss(index);
        var cssaddcount = 0;
        this.forEach((e) => {
            e.style.cssText = '';
            csst.forEach(h => {
                e.style.cssText += h;
                cssaddcount++;
            })
        })
        return cssaddcount;
    }
    if (index > this.length - 1) {
        throw new Error('Index超出了预期范围');
    } else if (index == undefined || index == null) {
        throw new Error('Index为空或不存在');
    }
    if (typeof (cssList) != 'object') {
        throw new Error('Css列表必须为Object');
    }
    var csst = aluk.objectToCss(cssList);
    this[index].style.cssText = '';
    var cssaddcount = 0;
    csst.forEach(h => {
        this[index].style.cssText += h;
        cssaddcount++;
    })
    return cssaddcount;
}

querylist.prototype.AppendorMoveto = function (index, index2, appender) {
    var append;
    if (appender instanceof querylist) {
        if (index > appender.length - 1) {
            throw new Error('Index超出了预期范围');
        } else if (index == undefined || index == null) {
            throw new Error('Index为空或不存在: 如果使用aluk querylist对象代替Element,那么请指定Index');
        }
        append = appender[index];
    } else {
        if (!aluk.isHtmlElement(appender)) {
            throw new Error('请指定html元素或者aluk querylist对象');
        }
        append = appender;
    }
    if (index2 > this.length - 1) {
        throw new Error('Index2超出了预期范围');
    } else if (index2 == undefined || index2 == null) {
        throw new Error('Index2为空或不存在: 选择第几项来插入到appender的' + index2 + '项', '那么请指定Index2');
    }
    append.appendChild(this[index]);
}

querylist.prototype.RemoveX = function () {
    let count = 0;
    this.forEach(s => {
        s.remove();
        count++;
    })
    return count;
}

querylist.prototype.continue = function (s) {
    if (s == undefined || s == '') {
        if (aluk.language != 'zh-cn') {
            throw new Error('Your Selector was empty or undefined,please.');
        } else {
            throw new Error('您的选择器为空或未定义');
        }
    }
    var newe = [];

    for (var i = 0; i < this.length; i++) {
        var m = aluk(s,{},this[i]);
        newe.push(m);
    }
    var n = new querylist('<null>');
    n.shift();
    newe.forEach(y => {
        y.forEach(z => {
            n.push(z)
        })
    })
    n.NormalResult = n[0];
    return n;
}

querylist.prototype.gsval = function (text) {
    if (text == undefined) {
        var result = [];
        this.forEach(e => {
            result.push(e.value)
        })
        return result;
    } else {
        this.forEach(e => {
            e.value = text;
        })
    }
}

querylist.prototype.gstext = function (text) {
    if (text == undefined) {
        var result = [];
        this.forEach(e => {
            result.push(e.innerText)
        })
        return result;
    } else {
        this.forEach(e => {
            e.innerText = text;
        })
    }
}

querylist.prototype.newclicke = function (call) {
    if (call == undefined || typeof call != 'function') {
        throw new Error('函数为空');
    }
    this.forEach(ef => {
        ef.addEventListener('click', function (e) {
            call(e);
        })
    })
}

querylist.prototype.Prep = function (call) {
    var events = ['addEventListener'];
var getEvent = function (index) {
    index = index - 0;
    var eventName = events[index];
    return eventName;
};
document[getEvent(0)]('DOMContentLoaded', function (event) {
    call(event);
});
}

querylist.prototype.event = (o,s,t) => {
    if(typeof (o) == 'number') {
        if(this.length > 0) {
            this[o].addEventListener(s,t);
        } else {
            throw new Error('Failed to event(o,s,t): Beyond the bounds of an array')
        }
    } else {
        if(this.length > 1) {
            this.forEach(element => {
                element.addEventListener(o,s);
            })
        } else {
            if(this.length > 0) {
                this[0].addEventListener(o,s);
            }
        }
    }
}

querylist.prototype.hide = (i) => {
    if(typeof(i) == 'undefined') {
        if(this.length > 1) {
            this.forEach(e => {
                e.SetCss({'display' : 'none'});
            })
        } else {
            this[0].SetCss({'display' : 'none'});
        }
    } else {
        this[i].SetCss({'display' : 'none'});
    }
}

querylist.prototype.show = (i) => {
    if(typeof(i) == 'undefined') {
        if(this.length > 1) {
            this.forEach(e => {
                e.SetCss({'display' : ''});
            })
        } else {
            this[0].SetCss({'display' : ''});
        }
    } else {
        this[i].SetCss({'display' : ''});
    }
}

aluk.isHtmlElement = (variable) => {
    return variable instanceof Element || variable instanceof HTMLElement;
}

aluk.createElementX = (options) => {
    if (typeof (options) != 'object') {
        if (aluk.language != 'zh-cn') {
            throw new Error('Element Options Type Must as the Object');
        } else {
            throw new Error('Element选项必须是Object');
        }
    }
    if (options.ElementType == undefined) {
        if (aluk.language != 'zh-cn') {
            throw new Error('Element name not specified or empty')
        } else {
            throw new Error('Element类型不能为空');
        }


    }
    if (options.ElementType == '') {
        if (aluk.language != 'zh-cn') {
            throw new Error('Element name not specified or empty')
        } else {
            throw new Error('Element类型不能为空');
        }
    }
    var result = document.createElement(options.ElementType);
    if (options.Class == undefined) {

    } else {
        result.classList.value += options.Class;
    }
    if (options.id == undefined) {

    } else {
        result.id = options.id;
    }
    if (options.innerHTML == undefined) {

    } else {
        result.innerHTML = options.innerHTML;
    }
    return aluk(result);
}

aluk.htmlEscape = (htmlStr) => {
    return htmlStr.replace(/<|>|"|&/g, match => {
        switch (match) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case '&':
                return '&amp;';
        }
    })
}
aluk.htmlUnescape = (html) => {
    return html.replace(/&lt;|&gt;|&quot;|&amp;/g, match => {
        switch (match) {
            case '&lt;':
                return '<';
            case '&gt;':
                return '>';
            case '&quot;':
                return '"';
            case '&amp;':
                return '&';
        }
    })
}


aluk.appendHTMLX = (appender, element, options) => {
    if (appender == undefined) {
        if (aluk.language != 'zh-cn') {
            throw new Error('AppendElement name not specified or empty')
        } else {
            throw new Error('追加者Element类型不能为空');
        }
    }
    if (element == undefined) {
        if (aluk.language != 'zh-cn') {
            throw new Error('Append HTML not specified or empty')
        } else {
            throw new Error('追加的HTML不能为空');
        }
    }
    if (typeof (options) != 'boolean') {
        if (options != undefined) {
            if (aluk.language != 'zh-cn') {
                throw new Error('Options not specified or empty')
            } else {
                throw new Error('选项为空或不存在');
            }
        }
    }
    let fixr = element.innerHTML;
    let fixed = fixr;
    if (options) {
        fixed = aluk.htmlEscape(fixr);
    }
    appender.innerHTML += fixed;
    return Promise.resolve(appender.innerHTML);
}

aluk.checkHtml = (htmlStr) => {

    var reg = /<[a-z][\s\S]*>/i;

    return reg.test(htmlStr);

}
aluk.htmlToElement = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.firstChild;
}

aluk.WebUrlToBase64 = function (url, callback) {
    var methods = [
    'send',
    'responseType',
    'onload'
];
var getMethod = function (index) {
    index = index - 0;
    var methodName = methods[index];
    return methodName;
};
var xhr = new XMLHttpRequest();
xhr[getMethod(2)] = function () {
    var fileReader = new FileReader();
    fileReader.onloadend = function () {
        callback(fileReader.result);
    };
    fileReader.readAsDataURL(xhr.response);
};
xhr.open('GET', url);
xhr[getMethod(1)] = 'blob';
xhr[getMethod(0)]();
}



aluk.ajax = (o) => {
    return new al.fn.ajax(o, o.method);
}

aluk.encodeX = (code, key = 0) => {
    var keys;
    if (key == undefined) {
        keys = '0';
    } else {
        keys = key;
    }
    var codeb;
    if (typeof code == 'object') {
        codeb = JSON.stringify(code)
    } else {
        codeb = code;
    }
    var codea = window.btoa(window.encodeURI(codeb));
    var lista = [];
    for (var i = 0; i < codea.length; i++) {
        var asciic = escape(codea.charCodeAt(i) + key).replace(/\%u/g, '/u');
        lista.push(asciic);
    } return lista;
}


aluk.decodeX = (code, key = 0) => {
    if (!Array.isArray(code)) { return }
    var keys;
    if (key == undefined) {
        keys = '0';
    } else {
        keys = key;
    }
    var result = '';
    var resultb = '';
    code.forEach(e => {
        var sh = unescape(String.fromCharCode(e - key)).replace(/\/u/g, '%u');
        resultb += sh;
    })
    result = window.decodeURI(window.atob(resultb));
    return result;
}
Terminal = function (output) {
    if (!aluk.isHtmlElement(output)) {
        return this;
    }
    this.Resultelement = output;
}

TerminalAPI = function () { return this; };

var API = undefined;
var consolebak = undefined;
function InTerminal(e) {
    consolebak = console.log;
    console.log = function (e) { return e; };
    API = new TerminalAPI();
    API.InvertHTMLinit = function () {
        aluk.createElementX({
            ElementType: "style",
            id: "InvertHTMLStyleSheet",
            innerHTML: "*.invert {filter: invert(100%);}"
        }).AppendorMoveto(0, 0, document.head);
    }
    API.Invert = function () {
        aluk('*').forEach(e => {
            e.classList.add('invert');
        })
    }
    API.Revert = function () {
        aluk('*').forEach(e => {
            e.classList.remove('invert');
        })
    }
}
Terminal.prototype = new Object();
Terminal.prototype.command = function (command) {
    InTerminal('');
    var t = '<br>' + eval(command) + '<br>';
    this.Resultelement.innerHTML += t;
    API = undefined;
    console.log = consolebak;
}

function Alarm(construct, title) {
    this.onalarmisdiscard = null; // 初始化 onalarmisdiscard 事件为 null
    this.obj = construct;
    this.title = '提示';
    if (title != undefined) {
        this.title = title;
    }
}

// 定义 show 函数
Alarm.prototype.show = function () {
    // 创建提示框元素
    var alarmBox = document.createElement('div');
    alarmBox.className = 'alarm-box';
    alarmBox.innerHTML = '<h4 id="alarm-title">' + this.title + '</h4><span id="alarm-text">' + this.obj + '</span>';
    // 创建关闭按钮元素
    var closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerText = '×';
    alarmBox.appendChild(closeButton);
    var styleElement = document.createElement('style');
    styleElement.classList.add('alarmbox-style');
    var cssCode = `
    .alarm-box {
        position: fixed;
        top: 20px;
        left: 0px;
        right: 0px;
        width: 300px;
        height: 500px
        margin: auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        overflow: auto; /* 添加滚动条 */
      }
      
      .alarm-box .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        color: #888;
      }

      .alarm-box>* {
        font-family: "Microsoft YaHei Ui Light",ui-sans-serif,system-ui,Segoe UI;
        font-size: 95%;
        max-width: fix-content;
      }
      
      .alarm-box .close-button:hover {
        color: #000;
      }
`;
    styleElement.appendChild(document.createTextNode(cssCode));
    document.head.appendChild(styleElement);
    document.body.appendChild(alarmBox);
    closeButton.onclick = 'this.parentNode.removeChild(this)';
    closeButton.addEventListener('click', async function () {
        await aluk('.alarmbox-style').RemoveX();
        await closeButton.parentElement.remove();
        if (this.onalarmisdiscard) {
            this.onalarmisdiscard();
        }
    }.bind(this));
};

    return aluk;
})();
