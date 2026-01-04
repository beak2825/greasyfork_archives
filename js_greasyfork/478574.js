// ==UserScript==
// @name         打印插件-保存PDF-配合调试模式打印网页任意区块-打印指定区块插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  理论可以适配所有网页。只要对应区块已经加载完毕，该区块即可被打印或另存为PDF。使用说明，初始代码只添加了百度系列网页的支持可在“// @match        https://www.baidu.com/*”行后添加自己想用的网站。感谢用户zhihu的“文库下载器|百度网盘直链解析下载|全网VIP视频解析无广告播放，全网独创自由选择自动解析接口|短视频无水印下载|更多功能持续更新中”以及github用户lemoncool。
// @author       zdtiio
// @license MIT
// @match        https://*.baidu.com/*
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478574/%E6%89%93%E5%8D%B0%E6%8F%92%E4%BB%B6-%E4%BF%9D%E5%AD%98PDF-%E9%85%8D%E5%90%88%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F%E6%89%93%E5%8D%B0%E7%BD%91%E9%A1%B5%E4%BB%BB%E6%84%8F%E5%8C%BA%E5%9D%97-%E6%89%93%E5%8D%B0%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9D%97%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/478574/%E6%89%93%E5%8D%B0%E6%8F%92%E4%BB%B6-%E4%BF%9D%E5%AD%98PDF-%E9%85%8D%E5%90%88%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F%E6%89%93%E5%8D%B0%E7%BD%91%E9%A1%B5%E4%BB%BB%E6%84%8F%E5%8C%BA%E5%9D%97-%E6%89%93%E5%8D%B0%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9D%97%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Your code here...
    const functions = {
        bdwk: function () {
            const btnhtml = `<div id="bdbox" style="box-shadow: 0 0 6px 3px #00000038;z-index: 99999997;bottom: 100px;position: fixed;right: 50px;background: #fff;padding: 0 20px;border-radius: 5px;"><div>使用方法：</div><div>1.F12进入调试模式</div><div>2.找到待打印区域的div</div><div>3.将待打印区域的div的id设置为如下id，或在文本框中输入对应id</div><div>待打印区块id：<input id="toprintid" value="print"/></div><div id="bdprint" style="text-align: center;font-size: 14px;padding: 8px 15px;background: #54be99;color: #fff;margin: 10px 0;border-radius: 3px;">打印区块</div></div>`;
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            document.querySelector("#bdprint").onclick = (event) => {
                let idValue = document.getElementById("toprintid").value;
                // 调用
                Print('#'+idValue, {});
            }
        }
    }
    functions.bdwk()
    // window.print()


    // print.js脚本
    // https://github.com/lemoncool/print-demo/blob/main/src/utils/print2.js
    /* @Print.js
     * DH (http://denghao.me)
     * 2017-7-14
     */
    (function (window, document) {
        let Print = function (dom, options) {
            if (!(this instanceof Print)) return new Print(dom, options);

            this.options = this.extend({
                noPrint: '.no-print',
                onStart: function () {},
                onEnd: function () {}
            }, options);

            if ((typeof dom) === "string") {
                this.dom = document.querySelector(dom);
            } else {
                this.dom = dom;
            }

            this.init();
        };
        Print.prototype = {
            init: function () {
                let content = this.getStyle() + this.getHtml();
                this.writeIframe(content);
            },
            extend: function (obj, obj2) {
                for (let k in obj2) {
                    obj[k] = obj2[k];
                }
                return obj;
            },

            getStyle: function () {
                let str = "",
                    styles = document.querySelectorAll('style,link');
                for (let i = 0; i < styles.length; i++) {
                    str += styles[i].outerHTML;
                }
                str += "<style>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + "{display:none;}</style>";

                return str;
            },

            getHtml: function () {
                let inputs = document.querySelectorAll('input');
                let textareas = document.querySelectorAll('textarea');
                let selects = document.querySelectorAll('select');

                for (let k in inputs) {
                    if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
                        if (inputs[k].checked == true) {
                            inputs[k].setAttribute('checked', "checked")
                        } else {
                            inputs[k].removeAttribute('checked')
                        }
                    } else if (inputs[k].type == "text") {
                        inputs[k].setAttribute('value', inputs[k].value)
                    }
                }

                for (let k2 in textareas) {
                    if (textareas[k2].type == 'textarea') {
                        textareas[k2].innerHTML = textareas[k2].value
                    }
                }

                for (let k3 in selects) {
                    if (selects[k3].type == 'select-one') {
                        let child = selects[k3].children;
                        for (let i in child) {
                            if (child[i].tagName == 'OPTION') {
                                if (child[i].selected == true) {
                                    child[i].setAttribute('selected', "selected")
                                } else {
                                    child[i].removeAttribute('selected')
                                }
                            }
                        }
                    }
                }

                return this.dom.outerHTML;
            },

            writeIframe: function (content) {
                let w, doc, iframe = document.createElement('iframe'),
                    f = document.body.appendChild(iframe);
                iframe.id = "myIframe";
                iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";

                w = f.contentWindow || f.contentDocument;
                doc = f.contentDocument || f.contentWindow.document;
                doc.open();
                doc.write(content);
                doc.close();
                this.toPrint(w, function () {
                    document.body.removeChild(iframe)
                });
            },

            toPrint: function (w, cb) {
                let _this = this;
                w.onload = function () {
                    try {
                        setTimeout(function () {
                            w.focus();
                            typeof _this.options.onStart === 'function' && _this.options.onStart();
                            if (!w.document.execCommand('print', false, null)) {
                                w.print();
                            }
                            typeof _this.options.onEnd === 'function' && _this.options.onEnd();
                            w.close();
                            cb && cb()
                        });
                    } catch (err) {
                        console.log('err', err);
                    }
                }
            }
        };
        window.Print = Print;
    }(window, document));
})();