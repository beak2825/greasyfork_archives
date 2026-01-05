    // ==UserScript==
    // @name        360,百度网盘,微盘链接
    // @author      林岑影
    // @description 360,百度网盘,微盘链接自动添加访问密码
    // @namespace   
    // @icon        http://disk.yun.uc.cn/favicon.ico
    // @license     GPL version 3
    // @encoding    utf-8
    // @date        18/07/2015
    // @modified    11/13/2015
    // @include     *
    // @exclude     http://pan.baidu.com/*
    // @exclude     http://yunpan.360.cn/*
    // @exclude     http://yunpan.cn/*
    // @exclude     http://vdisk.weibo.com/*
    // @grant       unsafeWindow
    // @grant       GM_setClipboard
    // @run-at      document-end
    // @version     2.1.1
// @downloadURL https://update.greasyfork.org/scripts/12912/360%2C%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%2C%E5%BE%AE%E7%9B%98%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/12912/360%2C%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%2C%E5%BE%AE%E7%9B%98%E9%93%BE%E6%8E%A5.meta.js
    // ==/UserScript==
    //QIQI修改，最后更新时间：2015-11-9 15:32
    (function(window){
        var autoHash = function(){
            this.config = {
                domain: {
                    "baidu":"pan.baidu.com/s/",
                    "yunpan":"yunpan.cn",
                    "vdisk":"vdisk.weibo.com"
                }
            }
        };
        autoHash.prototype = {
            init: function(){
                hash.nodeInsertedlistener({target:document.body});
                document.addEventListener("DOMNodeInserted", hash.nodeInsertedlistener);
            },
            nodeInsertedlistener: function(e){
                var elem = e.target;
                if(typeof(elem) === "object"){
                    if(typeof(elem.querySelectorAll) !== "undefined"){
                        var alllink = elem.querySelectorAll("a");
                        for (var index in alllink) {
                            if(hash.buttonsFilter(alllink[index])) {
                                hash.replace(alllink[index]);
                            }
                        }
                    }
                }
            },
            buttonsFilter: function(elem) {
                var href = typeof(elem) === "object" ? elem.getAttribute("href") : "";
                if (!href){
                    return false;
                }
                if (href.indexOf("#")>-1){
                    return false;
                }
                isDomain = false;
                for (var index in hash.config.domain) {
                    if (href.indexOf(hash.config.domain[index]) > -1) {
                        isDomain = true;
                        break;
                    }
                }
                return isDomain;
            },
            replace: function(a){
                var link = a.getAttribute("href"),
                    body = document.body.innerHTML,
                    arr_body = body.split('"' + link),
                    text = arr_body[1].split('href=')[0],
                    re = /(码|问)[\s|:|：]*([a-zA-Z0-9]{4,4})([\W\s]+|$)/g,
                    r = re.exec(text);
                if (r && r[2]) {
                    a.setAttribute("href", link+"#" + r[2]);
                } else {
                    text = a.parentNode.innerText;
                    r = re.exec(text);
                    if (r && r[2]) {
                        a.setAttribute("href", link + "#" + r[2]);
                    }
                }
            }
        };
        var hash = new autoHash();
        hash.init();
    }(window));