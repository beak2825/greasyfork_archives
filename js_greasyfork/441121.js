// ==UserScript==
// @name         划词弹图标栏工具 Mi
// @version      1.3.3
// @namespace    http://tampermonkey.net/
// @description  划词分别弹图标栏，1链接打开，2划词超过30字符自动复制，3划词搜索，4打开常用网站，5文本框粘贴全选，6页首页尾关闭标签页工具，7鼠标移入文本框自动聚焦
// @author       lyscop
// @icon         https://i.imgur.com/sAp6pEe.jpg
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        window.close
// @grant        GM_setValue
// @grant        GM_getValue
// @grant	 GM_setClipboard
// @grant	 GM_info
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://greasyfork.org/scripts/421598-%E4%B8%8A%E4%B8%80%E9%A1%B5/code/%E4%B8%8A%E4%B8%80%E9%A1%B5.js?version=1023903
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/441121/%E5%88%92%E8%AF%8D%E5%BC%B9%E5%9B%BE%E6%A0%87%E6%A0%8F%E5%B7%A5%E5%85%B7%20Mi.user.js
// @updateURL https://update.greasyfork.org/scripts/441121/%E5%88%92%E8%AF%8D%E5%BC%B9%E5%9B%BE%E6%A0%87%E6%A0%8F%E5%B7%A5%E5%85%B7%20Mi.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    var keyword = {
        beforePopup: function (popup, a) {
            var text = window.getSelection().toString().trim();
            GM_setValue('search', text);
            popup(text, a);
        },
        beforeCustom: function (custom) {
            var text = GM_getValue('search');
            GM_setValue('search', '');
            custom(text);
        },
 
    };
    GM_deleteValue('');
    GM_deleteValue('open');
 
    var iconsData = {
        iconArraya: [
            {
                name: 'Open',
                image:'https://i.ibb.co/vxp3BJB/TWYjpqg.png',
                host: [''],
                popup: function (text, a) {
                    if(text.indexOf("http://")==0||text.indexOf("https://")==0||text.indexOf("chrome://")==0||text.indexOf("edge://")==0)
                    {
                        try {
                            if(GM_openInTab(text, { loadInBackground: true, insert: true, setParent :true })){
                                //success info
                                Hide();
                                count(a);
                                console.log("doSomethingOk");
                            } else{
                                //fail info
                                console.log("doSomethingNotOk");
                            }
                        } catch (error) {
                            return GM_openInTab(text, { loadInBackground: true, insert: true, setParent :true });
                        }
                    }
                    else
                    {
                        try {
                            if(GM_openInTab("http://"+text, { loadInBackground: true, insert: true, setParent :true })){
                                //success info
                                Hide();
                                count(a);
                                console.log("doSomethingOk");
                            } else{
                                //fail info
                                console.log("doSomethingNotOk");
                            }
                        } catch (error) {
                            return GM_openInTab("http://"+text, { loadInBackground: true, insert: true, setParent :true });
                        }
                    }
                },
                custom: function (text) {}
            }
        ],
        iconArrayb: [
        {
            name: '复制',
            image: 'https://i.ibb.co/nPT0yN9/icons8-copy-96-2.png',
            host: [''],
            popup: function (selText, a) {
                if (selText == null) {
                    selText = document.defaultView.getSelection().toString();
 
                }
 
                try {
                    if(document.execCommand('copy', false, null)){
                         //success info
                        Hide();
                        count(a);
                        console.log("doSomethingOk");
                    } else{
                        //fail info
                        console.log("doSomethingNotOk");
                    }
                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand('copy', false, null);
                }
            },
            custom: function (text) {}
        }
        ],
        //划词搜索
        iconArrayc: {
            Arraya: [
                {
                    name: '百度搜索',
                    image: 'https://i.ibb.co/R9HMTyR/1-5.png',
                    host: ['www.baidu.com'],
                    popup: function (text, a) {
                        open('https://www.baidu.com/s?wd=' + encodeURIComponent(text));
                        count(a);
                    },
                    custom: function (text) {}
 
                }
            ],
            Arrayb: [
                {
                    name: 'Google搜索',
                    image: 'https://i.ibb.co/fxpm6Wc/image.png',
                    host: ['www.google.co.jp'],
                    popup: function (text, a) {
                        open('https://www.google.com/search?q=' + encodeURIComponent(text));
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayc: [
                {
                    name: '必应搜索',
                    image: 'data:image/png;base64,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',
                    host: ['www.cn.bing.com'],
                    popup: function (text, a) {
                        open('https://www.bing.com/search?q=' + encodeURIComponent(text));
                        count(a);
                    },
                   custom: function (text) {}
                }
            ],
            Arrayd: [
                {
                    name: '百度翻译',
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAUsSURBVEhLxVdpbFRlFJ2YiFCRpSJQEDUxLijESGLcEiMxGDVxC4mJifhDEiEmKjGgqChaECibsiiKUimLFOLSFgSKsmglti7IIkgEClhDKyoW5s1bZt6b4znfm9dOh2moUuNNzmTmW+75vnvPve9NDBlrPBVgzFoPg+YkUDjdQp8ZiU6BfMnnmCoPjVaQYQMMcdmOJGLj4ygotjqVNIJ8yrc4xGWIG+OBGci34b+AuBTd2FiGQKfJXXDhdMHKIPyduyYftK7XNAs9XssfPXGJM3ZJnpxqs8Z6crMcyJF+C/ouaC6av2Cqhe4ZdKPjy19P4JZ3bRTNTJg12b7lQ5yxXFKhNx1fMS+BRz9yMXGThwc+cDCATopmJXDVfIJzQxbaGLbIxs0kGF7q4K5lDu5d4eBBrl3CPB78M8C49S4GcI/8ZfsXZyx7IIJuMKLMRv2JtBHCxp9TuJJkA+mkdEcK6/ansOGAj/I9Kazn3EZ+rz6QQvVBHwf+aFVuk5XGyFUOepMoN1XtEt+x1Ma+46GTyp9S5pbdpyZMBEpqPDP+4d4Uo+LgsQoXI8sdPL3ewzGKVdbspLH4uyRuZUT6zOggcRTqUQz1s9Ue7mf4dFuNd1VZTIrj7W+SaGgOcM9yG7GJFvoxFat2pwyp66dR8mUS/WdaOH/K6aRCC7Em5TiCRNP1VQvnvhJuztaCxNWH6+tPBOZmc7cnUfZDSOrzwvNrPSMgRS7akwtDLFKVTdEsnbwtioiLGKrCzLpoYwEPM5hC+4W3jghTQRoL65LmoLGXwwNL1YXGfx5iTQ5ZYMPy0jhKRwZ/BThEZR5jsT9R5ZobR5t1k9iLcTy8xoHnG96MpdFwMo2KfT5e2uzhvpUOrubhCqbEDUc2uSHuxcHBC3T6NHY1Bth5LMCepgCn3FDVkz4nMcMbEV7PMqo50spYvNXDzK/CVhiZxzyf5P44L6N0qK6VvjbEUYdSwfcrCSfUBFb/GObthU2u6TjD3rKx+VBIeIQRmUCFX8NI1TX4GPWxixsX2y17Imsm+UOrWVI8uDjaEEfk2cIaNJsqZZ3Knqt2TeOYV5vEk+tcDJzDDkXhSeF9SyyzRraW9R2bEGdu4xjBhvLG10ncucw2HS07VW2IsyHyS6nK8qwb9+TmLlR4lwyhxHUev/el8CLbUu/j9lIbo1nX41jTQxkNVUUuqdBhYuVYRJO3eLBNOpX/UAPt2e4mH7ctaZvbCP+I2KSB3Wv8Rg+PV7E3U7UjljpmjaxsJ0M9ngKcGA9BIeqhcVY31pjqUc1DQlOoVad6CBjj5VfsSnG/ZUroujdtIza1zIupF+3/VznuwRzL2VOfuqZ8irexhNiz1TAi2/+7j/e+T+IT9vDtRwMcpvKPx9MYXenSbzuqzkY+4u683fD3bdSydHaxxr/91UfNUR9b68M1sr2/BZjN9jmbNT3tC4/1H0IPElVJdtttl/gyEq+JiD8Lc6zwqr7lRGXUjb/7ZcopzVAvqmOOmVspX5AYhdxeL7RPPLe1jp9no9DGKMeaFxT+a1kykS2juM6ZfLqC8yEvsUj6s4vdvdzBMxs83ESRhN2tdY2+q/8O5ZtIZBVsIB0mzg1BBI2rN6tZqA5zy8EQ89Y3vBMSbzvs4xHmUunIXpcP8p33Za8jELH2DWS+9RSS4pX3M/nSvHnZa+/1tiOIyNWLw+fumf2IS/8qYubl+v94oVd+Wv7CGNnn33A2kE/5FkfLXxjzSdObxthKj+2tc8nlSz7H0LduGhrwN1fH/x1DJk9SAAAAAElFTkSuQmCC',
                    host: ['fanyi.baidu.com'],
                    popup: function (text, a) {
                        open('https://fanyi.baidu.com/?aldtype=85&keyfrom=alading#auto/zh/' + encodeURIComponent(text));
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arraye:[
                {
                    name: '微博搜索',
                    image: 'https://i.ibb.co/VC2HfBF/bnmabu2sfk4kus4dv6obkriqne-082bc03f376b8c0ffd7eff29bd9816871587215670-5-1-1.png',
                    host: ['s.weibo.com'],
                    popup: function (text, a) {
                        open('https://s.weibo.com/weibo/' + encodeURIComponent(text), null, 800, screen.height);
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
 
            Arrayf: [
                {
                    name: '知乎',
                    image:'https://i.ibb.co/PQ5xM2R/2-1.png',
                    host: ['www.zhihu.com'],
                    popup: function (text, a) {
                        open('https://www.zhihu.com/search?type=content&q=' + encodeURIComponent(text), null, 800, screen.height);
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayg: [
                {
                    name: '豆瓣电影',
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMBQTFRFAAAAJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NJY3NjZqR9AAAAEB0Uk5TAB9cZlJN/8wIJTUaS5UwgN/T1dfzagsVv5BIQFDP4MrO8o7jrPu7iC4Qt/ERcPlhAYPrabHhN3v49Pr22qSZeqkWK+0AAACGSURBVHicY2DAAIxMzAjAAhRgZUMC7EABDk4uBOAG6eHhRQA+kAA/m4CgEAgIi7CxQgRExcDGi0vgFJCUkgYBGVmYgBy7PAgoKEIEpJWUFfmBQEVVTV0DrFdTS1sHSOnq6XNAHG9gaGQMpExMzcBccyEhZQtLoDOsrG2EbIECTHZIwB7T8wBnLQ8Enf/6ngAAAABJRU5ErkJggg==',
                    host: ['www.douban.com'],
                    popup: function (text, a) {
                        open('https://search.douban.com/movie/subject_search?search_text=' + encodeURIComponent(text) + '&cat=1002', null, 800, screen.height);
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayh: [
                {
                    name: '豆瓣图书',
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMBQTFRFAAAAWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEpWkEp08JwzQAAAEB0Uk5TAB9cZlJN/8wIJTUaS5UwgN/T1dfzagsVv5BIQFDP4MrO8o7jrPu7iC4Qt/ERcPlhAYPrabHhN3v49Pr22qSZeqkWK+0AAACGSURBVHicY2DAAIxMzAjAAhRgZUMC7EABDk4uBOAG6eHhRQA+kAA/m4CgEAgIi7CxQgRExcDGi0vgFJCUkgYBGVmYgBy7PAgoKEIEpJWUFfmBQEVVTV0DrFdTS1sHSOnq6XNAHG9gaGQMpExMzcBccyEhZQtLoDOsrG2EbIECTHZIwB7T8wBnLQ8Enf/6ngAAAABJRU5ErkJggg==',
                    host: ['www.douban.com'],
                    popup: function (text, a) {
                        open('https://search.douban.com/book/subject_search?search_text=' + encodeURIComponent(text) + '&cat=1001', null, 800, screen.height);
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayi: [
                {
                    name: '52pojie',
                    image: 'https://mycroftproject.com/installos.php/96871/52pojie.cn.png',
                    host: ['zhannei.baidu.com'],
                    popup: function (text, a) {
                        open('http://zhannei.baidu.com/cse/site?q=' + encodeURIComponent(text) + '&click=1&cc=52pojie.cn', null, 800, screen.height);
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayj: [
                {
                    name: 'chrome网上应用商店',
                    image: 'https://i.ibb.co/kxj5RXP/v7JqRKd.png',
                    host: ['chrome.google.com'],
                    popup: function (text, a) {
                        open('https://chrome.google.com/webstore/search/' + encodeURIComponent(text) + '?utm_source=chrome-ntp-icon');
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
        },
        //打开网站
        iconArrayd: {
            Arraya: [
                {
                    name: '百度',
                    image: 'https://i.ibb.co/Gt7S5c5/djjii6V.png',
                    host: ['www.baidu.com'],
                    popup: function (text, a) {
                        open('https://www.baidu.com');
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayb: [
                {
                    name: 'Greasyfork',
                    image: 'data:image/png;base64,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',
                    host: ['greasyfork.org'],
                    popup: function (text, a) {
                        open('https://greasyfork.org/');
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayc: [
                {
                    name: 'Github',
                    image: 'data:image/png;base64,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',
                    host: ['github.com'],
                    popup: function (text, a) {
                        open('https://github.com');
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayd: [
                {
                    name: '历史',
                    image: 'https://i.ibb.co/3zdGrsw/3-3.png',
                    host: [''],
                    popup: function (text, a) {
                        open('chrome://history/');
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arraye: [
                {
                    name: '下载',
                    image: 'https://i.ibb.co/t2nY9c8/2-1.png',
                    host: [''],
                    popup: function (text, a) {
                        open('chrome://downloads/');
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
        },
        //点击粘贴
        iconArraye: {
            Arraya: [
                {
                    name: '空格',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
 
                        try {
 
                            if(document.execCommand("insertText", "false", " ")){
                                //success info
                                Hide();
                                count(a);
                                console.log("doSomethingOk");
                            } else{
                                //fail info
                                console.log("doSomethingNotOk");
                            }
                        } catch (error) {
                            return document.execCommand("insertText", "false", " ");
                        }
                    },
                    custom: function (text) {}
                }
            ],
            Arrayb: [
                {
                    name: '退格',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        try {
                            if(document.execCommand("Delete", "false", null)){
                                //success info
                                Hide();
                                count(a);
                                console.log("doSomethingOk");
                            } else{
                                //fail info
                                console.log("doSomethingNotOk");
                            }
                        } catch (error) {
                            return document.execCommand("Delete", "false", null);
                        }
                    },
                    custom: function (text) {}
                }
            ],
            Arrayc: [
                {
                    name: '粘贴',
                    image: 'data:image/png;base64,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Uf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOUP/1jk//9Y5P//WOT//1jU//9Y1P//WNT//SfU8tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9ZBT//WQU//1kFP/9ZBT//WQU//1kFP/9ZBT//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1j1H/9Y5Q//WOUP/1jlD/9Y5P//WOT//1jk//9Y1P//WNT//yiEnvAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWQVP/1kFT/9ZBU//WQVP/1kFT/9ZBU//WQU//1kFP/9ZBT//WQU//1kFP/9ZBS//WQUv/1kFL/9Y9S//WPUv/1j1L/9Y9S//WPUf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOT//1jk//9Y5P//WOT//1jU//5oRNhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD1kFT/9ZBU//WQVP/1kFT/9ZBU//WQVP/1kFT/9ZBT//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1jlD/9Y5Q//WOUP/1jlD/9Y5P//WOT//1jk//9Y1P/9mAUygAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9ZBU//WQVP/1kFT/9ZBU//WQVP/1kFT/9ZBU//WQVP/1kFP/9ZBT//WQU//1kFP/9ZBS//WQUv/1kFL/9Y9S//WPUv/1j1L/9Y9R//WPUf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOT//1jk//9Y5P/+2GTOkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWRVf/1kVX/9ZFV//WRVf/1kVX/9ZBU//WQVP/1kFT/9ZBU//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1jlD/9Y5Q//WOUP/1jk//9Y5P//WOT//ph059AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxkFPi9ZFV//WRVf/1kVX/9ZFV//WRVf/1kFT/9ZBU//WQVP/1kFP/9ZBT//WQU//1kFP/9ZBS//WQUv/1kFL/9Y9S//WPUv/1j1L/9Y9R//WPUf/1j1H/9Y5Q//WOUP/1jlD/9Y5P//WOT//1jk//2oBTIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8pJad/WRVf/1kVX/9ZFV//WRVf/1kVX/9ZFV//WQVP/1kFT/9ZBU//WQU//1kFP/9ZBT//WQUv/1kFL/9ZBS//WPUv/1j1L/9Y9S//WPUf/1j1H/9Y9R//WOUP/1jlD/9Y5Q//WOT//1jk//841O4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN+fgAj0kVPZ9ZFV//WRVf/1kVX/9ZFV//WRVf/1kFT/9ZBU//WQVP/1kFP/9ZBT//WQU//1kFL/9ZBS//WQUv/1j1L/9Y9S//WPUv/1j1H/9Y9R//WPUf/1jlD/9Y5Q//WOUP/1jk//9Y5P/++LUHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA35+ACPKUXHrwkFHk9ZFV//WRVf/1kVX/9ZBV//WQVf/1kFX/9ZBU//WQVP/1kFT/9ZBT//WQU//1kFP/9Y9S//WPUv/1j1L/9Y9S//WPUv/1j1L/9Y5R//WOUf/1jlH/9Y5Q//WOUP/0kFkXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    host: [''],
                    popup: function (text, a) {
                        text = document.defaultView.getSelection().toString();
                        try {
                            if(window.navigator.clipboard.readText()
                               .then(text => {
                                document.execCommand("insertText", "false", text);
                            })
                               .catch(err => {
                                console.error('Failed to read clipboard contents: ', err);
                            })){
                                //success info
                                Hide();
                                count(a);
                                console.log("doSomethingOk");
                            } else{
                                //fail info
                                console.log("doSomethingNotOk");
                            }
                        } catch (error) {
                            return document.execCommand("insertText", "false", text);
                        }
                    },
                    custom: function (text) {}
                }
            ],
            Arrayd: [
                {
                    name: '全选',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        try {
                            if(document.execCommand("selectAll", "false", null)){
                                //success info
                                Hide();
                                count(a);
                                console.log("doSomethingOk");
                            } else{
                                //fail info
                                console.log("doSomethingNotOk");
                            }
                        } catch (error) {
                            return document.execCommand("selectAll", "false", null);
                        }
                    },
                    custom: function (text) {}
                }
            ],
        },
        //打开工具
        iconArrayf: {
            Arraya: [
                {
                    name: '页首',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        window.scrollTo(0,0);
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayb: [
                {
                    name: '页尾',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        window.scrollTo(0,document.body.scrollHeight);
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayc: [
                {
                    name: '刷新',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        location.reload();
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayd: [
                {
                    name: '后退',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        window.history.back();
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arraye: [
                {
                    name: '前进',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        window.history.forward();
                        count(a);
 
                    },
                    custom: function (text) {}
                }
            ],
            Arrayf: [
                {
                    name: '关闭标签页',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        window.setTimeout(function(){window.close();},150);
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayg: [
                {
                    name: '上一页',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        previouspage();
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
            Arrayh: [
                {
                    name: '下一页',
                    image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
                    host: [''],
                    popup: function (text, a) {
                        nextpage();
                        count(a);
                    },
                    custom: function (text) {}
                }
            ],
        },
        iconArrayg: {
            Arraya: [
                {
                    name: '已复制',
                    image:'data:image/png;base64,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',
//                    image: 'https://i.imgur.com/xayTjSV.png',
                    host: [''],
                    popup: function (selText, a) {
 
                    },
                    custom: function (text) {}
                }
            ],
 
        },
        hostCustomMap: {}
 
    }
 
 
    let keysa = Object.keys(iconsData) // ['iconArraya', 'iconArrayb', 'iconArrayc','iconArrayd','iconArraye','iconArrayf','iconArrayg', 'hostCustomMap']
    let keysb = Object.keys(iconsData) // ['iconArraya', 'iconArrayb', 'iconArrayc','iconArrayd','iconArraye','iconArrayf', 'iconArrayg','hostCustomMap']
 
    keysa.splice(2,6) // [ 'iconArraya, 'iconArrayb']
    keysb.splice(0,2) // [ 'iconArrayc', 'iconArrayd','iconArraye','iconArrayf','iconArrayg','hostCustomMap']
    keysb.splice(5,1) // [ 'iconArrayc''iconArrayd','iconArraye','iconArrayf','iconArrayg']
 
    keysa.forEach(function(value1,index1) {
        iconsData[value1].forEach(function (value2,index2) {
 
            value2.host.forEach(function(host) {
                iconsData.hostCustomMap[host] = value2.custom
            });
        })
    });
 
    keysb.forEach(function(value1) {
        Object.keys(iconsData[value1]).forEach(function (value2,index2) {
            iconsData[value1][value2].forEach(function (value3,index3) {
                value3.host.forEach(function(host){
                    iconsData.hostCustomMap[host] = value3.custom
                });
            });
        });
    });
 
    var text = GM_getValue('search');
    if (text && window.location.host in iconsData.hostCustomMap) {
        keyword.beforeCustom(iconsData.hostCustomMap[window.location.host]);
    }
 
 
    var iconObjecta = ['icona', 'iconb','iconc', 'icond', 'icone', 'iconf','icong'];
    var iconArraya = Object.fromEntries(iconObjecta.map(key => [key, document.createElement('div')]));
 
    const seta = function(i,j,o){
        i.setAttribute('src', o.image);
        i.setAttribute('alt', o.name);
        i.setAttribute('title', o.name);
        if(j === 0){
 
            i.addEventListener('mouseover', function () {
                keyword.beforePopup(o.popup, o.name);
            });
 
        } else if (j === 1){
            i.addEventListener('mouseup', function () {
                keyword.beforePopup(o.popup, o.name);
            });
        }
        i.setAttribute('style', '' +
                       'cursor:pointer!important;' +
                       'display:inline-block!important;' +
                       'width:22px!important;' +//图标尺寸设置
                       'height:22px!important;' +//图标尺寸设置
                       'border:0!important;' +
                       'background-color:rgba(255,255,255,0.3)!important;' +//透明度
                       'padding:0!important;' +
                       'margin:0!important;' +
                       'margin-right:3px!important;' +//图标间距
                       '');
    }
 
    //遍历元素
    keysa.forEach(function(value1,index1) {
//        console.log('index1a',index1)
        iconsData[value1].forEach(function (obj) {
            //遍历图标数组
            Object.values(iconArraya).forEach(function(keyc,index3) {
                var img = document.createElement('img');
 
                if(index3 === index1){
                    seta(img,0,obj);
                    keyc.appendChild(img);
 
                }
            });
        });
    });
 
    //遍历元素
    keysb.forEach(function(value1,index1) {
 
        Object.keys(iconsData[value1]).forEach(function (value2,index2) {
            iconsData[value1][value2].forEach(function (obj,index3) {
                Object.values(iconArraya).forEach(function(keyc,index4) {
                    var img = document.createElement('img');
                    if(index4 == index1 + 2){
                        if(index4 === 2 || index4 === 3)
                            seta(img,1,obj);
                         else
                            seta(img,0,obj);
                        keyc.appendChild(img);
 
                    }
                });
            });
        });
    });
    const setb = function(s){
        s.setAttribute('style', '' +
                       'display:none!important;' +
                       'position:absolute!important;' +
                       'padding:0!important;' +
                       'margin:0!important;' +
                       'font-size:13px!important;' +
                       'text-align:left!important;' +
                       'border:0!important;' +
                       'background:transparent!important;' +
                       'z-index:2147483647!important;' +
                       '');
    }
 
 
    Object.values(iconArraya).forEach(function(value){
        setb(value);
    });
 
 
    Object.values(iconArraya).forEach(function(key){
        document.documentElement.appendChild(key);
    });
 
 
 
    document.addEventListener('mousedown', function (e) {
        Object.values(iconArraya).forEach(function(value, index) {
            if (e.target == value || (e.target.parentNode && e.target.parentNode == value)) {
                e.preventDefault();
            }
        });
 
    });
 
    document.addEventListener("selectionchange", function () {
        if (!window.getSelection().toString().trim()) {
            Object.values(iconArraya).forEach(function(value, index) {
                value.style.display = 'none';
            });
 
        }
    });
    let ev = null;
    var timer;
    const style = function(e,h,obj){
        obj.style.top = e.pageY +40 + 'px';
        if(h === 0){
            if(e.pageX -70<10)
                obj.style.left='10px';
            else
                obj.style.left = e.pageX -70 + 'px';//设置文字下方距离
        } else if(h === 1){
            if(e.pageX -70<10)
                obj.style.left='10px';
            else
                obj.style.left = e.pageX +180 + 'px'; //设置文字下方距离，每增加一个划词搜索图标，此处增加25-30px
        }  else if (h === 2){
            if(e.pageX -70<10)
                obj.style.left='10px';
            else
                obj.style.left = e.pageX +5 + 'px';
        } else if(h === 5){
            obj.style.top = e.pageY +10 + 'px';
            if(e.pageX -70<10)
                obj.style.left='10px';
            else
                obj.style.left = e.pageX +30 + 'px'
        }
        fadeIn(obj);
        clearTimeout(timer);
        timer = window.setTimeout(TimeOutHide, 6000);
        return ismouseenter = false;
    };
 
    document.addEventListener('mouseup', function (e) {
        Object.values(iconArraya).forEach(function(value, index) {
            if (e.target == value || (e.target.parentNode && e.target.parentNode == value)) {
                e.preventDefault();
                return;
            }
        });
 
        ev = e;
 
        var text = window.getSelection().toString().trim();
        var url = text.match(/^(?=.*Chrome:).*$|^(?=.*Edge:).*$|(https?:\/\/(\w[\w-]*\.)+[A-Za-z]{2,4}(?!\w)(:\d+)?(\/([\x21-\x7e]*[\w\/=])?)?|(\w[\w-]*\.)+(com|cn|org|net|info|tv|cc|gov|edu)(?!\w)(:\d+)?(\/([\x21-\x7e]*[\w\/=])?)?)/i);
        var cvalue=text.replace(/\r\n/g,"\n");
        var sarr=cvalue.split("");
        var len_total=sarr.length;
        var r={
            "wd":0,//中英文字数
            "nwd":0,//英数词数
            "kwd":0,//日文假名
            "krd":0,//韩文字
            "nb":0,//数字词数
            "c":0,//字符数
            "cb":0,//非空格字符
            "r":0,//回车
            "en":0,//英文字母数
            "cn":0,//中文字数
            "bl":0//非回车空格
        };
        var words=cvalue.match(/\w+([’\']\w+)?/g)||[];//含撇号（如I'm）的单词视为一个词
        var numbers=cvalue.match(/\b\d+(\.\d+)?\b/g)||[];//含小数点的数字视为一个词
        var cnwords=cvalue.match(/[\u4e00-\u9fa5]/g)||[];//统一中文字范围
        var kanawds=cvalue.match(/[\u3040-\u30ff]/g)||[];//日文假名范围
        var krwords=cvalue.match(/[\uac00-\ud7af]/g)||[]; //韩文字范围
        r.nwd=words.length;
        r.nb=numbers.length;
        r.cn=cnwords.length;
        r.kwd=kanawds.length;
        r.krd=krwords.length;
        for(var i=0;i<len_total;i++){
            r.c++;
            switch(true){
                case /[a-zA-Z]/.test(sarr[i]):
                    r.en++;
                    break;
                case /\S/.test(sarr[i]):
                    r.cb++;
                    break;
                case /\s/.test(sarr[i]):
                    if(sarr[i]=="\n"||sarr[i]=="\r"){
                        r.r++;
                    }else{
                        r.bl++;
                    }
            }
        }
        r.wd=r.nwd+r.cn+r.kwd+r.krd;
 
        Object.values(iconArraya).forEach(function(value, index) {
            if (url && r.bl == 0 && r.cn == 0 && text.indexOf("，") == -1 && text.indexOf(",") == -1) {
 
                if(index === 0){
                    style(e,2,value);
                }
 
            } else if (r.wd >= 30 | r.cn >= 30 | (r.nwd-r.nb) >= 30) {
 
                if(index === 1){
                    //style(e,value);
                    document.execCommand('copy', false, null);
 
                    console.log('Copied')
                } else if (index === 6){
                    style(e,5,value);
                    timer = window.setTimeout(TimeOutHide, 300);
                }
 
            } else if (!text) {
                value.style.display = 'none';
 
            } else if(text && value.style.display == 'none'){
                if(index === 1){
                    style(e,1,value);
                } else if(index === 2 ){
                    style(e,0,value);
                }
            }
        });
    });
 
    //*******************************打开网站**********************************
    //Alt+I
 
    let mouseEvent = null;
 
    document.addEventListener('mousemove', event => {
        mouseEvent = event;
    });
 
    document.addEventListener('keydown',function(event) {
 
        var keynum;
        if(window.event) // IE
            keynum = event.keyCode;
        else if(event.which) // Netscape/Firefox/Opera
            keynum = event.which;
 
        if(document.activeElement.tagName.toLowerCase() !== 'iframe'){
              if(keynum==73&&event.altKey){
                  Object.values(iconArraya).forEach(function(value, index) {
                      if(index === 3){
                          style(mouseEvent,0,value);
//                          console.log('index'+index)
                      }
                  });
              }
        }
    });
 
 
    //*******************************点击粘贴**********************************
 
    // 鼠标事件
    document.addEventListener('mouseup', function (e) {
        Object.values(iconArraya).forEach(function(value, index) {
            if (e.target == value || (e.target.parentNode && e.target.parentNode == value)) {
                e.preventDefault();
                return;
            }
        });
        var text = window.getSelection().toString().trim();
 
 
        if (!text && e.target.localName !=='img' &&
            (((document.activeElement.tagName.toLowerCase() === 'input' || document.activeElement.tagName === 'TEXTAREA') &&
              (e.target.type === 'text' || e.target.type === 'url'|| e.target.type === 'textarea')) ||
             (document.activeElement.tagName.toLowerCase() === 'en-note' && e.target.localName.toLowerCase() !== 'en-note'))){
 
            Object.values(iconArraya).forEach(function(value, index) {
                if(index === 4){
//                    style(e,0,value);
//                    console.log('index'+index)
                }
            });
            console.log("show");
        }
    });
 
    //*******************************打开工具**********************************
    //Alt+A、双击鼠标左键
 
    document.addEventListener('keydown',function(event){
        var keynum;
        if(window.event) // IE
            keynum = event.keyCode;
        else if(event.which) // Netscape/Firefox/Opera
            keynum = event.which;
 
        if(document.activeElement.tagName.toLowerCase() !== 'iframe'){
              if(keynum==65&&event.altKey){
                  Object.values(iconArraya).forEach(function(value, index) {
                      if(index === 5){
                          style(mouseEvent,0,value);
                          console.log('index'+index)
                      }
                  });
              }
        }
    });
 
    //双击左键
    document.addEventListener('dblclick', function (e) {
        Object.values(iconArraya).forEach(function(value, index) {
            if(index === 5){
                style(e,0,value);
//                console.log('index'+index)
            }
        });
    });
 
 
    document.addEventListener('mousedown', function (event) {
        if (event.detail > 1) {
            event.preventDefault();
        }
    }, false);
 
    //*******************************恢复和关闭图标栏*********************************
    //Alt+B恢复图标栏 Alt+C关闭图标栏
    document.addEventListener('keydown',function(event){
        var keynum;
        if(window.event) // IE
            keynum = event.keyCode;
        else if(event.which) // Netscape/Firefox/Opera
            keynum = event.which;
 
        if(document.activeElement.tagName.toLowerCase() !== 'iframe'){
              if(keynum==66&&event.altKey){
                  Object.values(iconArraya).forEach(function(value, index) {
                          if(index === 1){
                              style(ev,1,value);
 
                          } else if(index === 2 ){
                              style(ev,0,value);
                          }
 
                  });
              }
            if(keynum==67&&event.altKey){
                    Hide();
            }
        }
    });
 
 
    //*******************************自动聚焦*********************************
 
    document.addEventListener('mouseover', function (e) {
 
        if (e.target.selectionStart === e.target.selectionEnd &&
            (e.target.type !== 'checkbox' && e.target.type !== 'submit'
             && e.target.type !== 'radio' && e.target.type !== 'number'
             && e.target.type !== 'button' && e.target.type !== 'file') &&
            ((e.target.localName ==='input' || e.target.localName ==='textarea')))
            {
                //e.target.focus();
                if(e.target.value){
                    e.target.selectionStart = e.target.value.length;
                    e.target.selectionEnd = e.target.value.length;
                }
            }
    });
 
 
    document.addEventListener('mouseout', function (e) {
 
        var timer = setTimeout(function () {
//            e.target.blur();
        }, 6000)
        document.addEventListener('mouseover', function (e) {
            if(e.target.localName ==='input' || e.target.localName ==='textarea'){
                clearTimeout(timer);
 
            }
        });
 
    });
 
    document.addEventListener('keydown',function(event) {
 
        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;
        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }
        //ALT+H
        if(keynum==72&&event.altKey){
 
            let searchBar = document.querySelector("input[name=wd],input[type=text],input[autocomplete],input[type=search]")
            searchBar.focus();
            if(searchBar.value){
                searchBar.selectionStart = searchBar.value.length;
                searchBar.selectionEnd = searchBar.value.length;
                searchBar.click();
            }
        }
    });
    document.addEventListener('keydown',function(event) {
 
        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;
        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }
        //ALT+J
        if(keynum==74&&event.altKey){
 
            let searchBar = document.querySelector("textarea")
 
            searchBar.focus();
            if(searchBar.value){
                searchBar.selectionStart = searchBar.value.length;
                searchBar.selectionEnd = searchBar.value.length;
                searchBar.click();
            }
        }
    });
 
    document.addEventListener('keydown',function(event) {
 
        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;
        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }
        //ALT+K
        if(keynum==75&&event.altKey){
            let searchBar = document.querySelector("input[name=wd],input[type=text],input[autocomplete],input[type=search]");
            let ele = document.querySelector("div");
            if(searchBar)
                searchBar.blur();
            ele.click();
        }
    });
 
    document.addEventListener('keydown',function(event) {
 
        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;
        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }
        //ALT+L
        if(keynum==76&&event.altKey){
            let searchBar = document.querySelector("textarea");
            let ele = document.querySelector("div");
            if(searchBar)
                searchBar.blur();
            ele.click();
        }
    });
 
 
    //*******************************统计次数**********************************
    //Alt+u
    document.addEventListener('keydown',event => {
        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;
        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }
        if(keynum==85&&event.altKey){
 
/*            let allValue = GM_listValues();
            allValue.splice(0,1);
            allValue.forEach(function(value) {
                console.log(value);
                Object.keys(GM_getValue(value)).forEach(function(v) {
                    console.log(v + ":" + GM_getValue(value)[v]);
                });
            });
*/
            let allValue = GM_listValues();
            let val = [];
            allValue.forEach(function(value,index) {
                val.push(GM_getValue(value));
            });
            val.forEach(function(value,index) {
                if(typeof(val[index]) == 'string'){
                    val.splice(index, 1); //去掉search
//                    console.log(index);
                }
            });
            val.sort(compare( "times"));
            console.log("图标统计数据：");
            console.log(val);
        }
    });
 
    function compare( propertyName) {
        return function( object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            if (value1 < value2) {
                return 1;
            } else if (value1 > value2) {
                return - 1;
            } else {
                return 0;
            }
        }
    }
 
 
    var TimeOutHide, Hide;
    var ismouseenter = false;
 
    TimeOutHide = function () {
        if (ismouseenter == false) {
            Object.values(iconArraya).forEach(function(value, index) {
                return fadeOut(value);
            });
 
            console.log("doSomethingOk");
        }
    };
    Hide = function (){
        Object.values(iconArraya).forEach(function(value, index) {
            return fadeOut(value);
        });
    };
 
    Object.values(iconArraya).forEach(function(value, index) {
 
        value.onmouseenter = function(e){
 
            console.log("ismouseenter");
 
            if(timer){ //定时器
                clearTimeout(timer);
            }
        }
            return ismouseenter = true;
    });
 
    Object.values(iconArraya).forEach(function(value, index) {
        value.onmouseleave = function(){
 
            console.log("ismouseleave");
 
            if(timer){ //定时器
                clearTimeout(timer);
            }
//            timer = window.setTimeout(function(){fadeOut(value);}, 6000);
            timer = window.setTimeout(TimeOutHide, 6000);
            return ismouseenter = false;
        }
    });
 
    //鼠标滚动
    document.addEventListener('scroll', function(e){
 
        Object.values(iconArraya).forEach(function(value, index) {
            return fadeOut(value);
        });
    });
 
    //渐出
 
    function fadeOut(el){
        el.style.opacity = 1;
 
        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }
 
    //渐入
 
    function fadeIn(el, display){
        el.style.opacity = 0;
        el.style.display = "block";
 
        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }
 
    //存储次数和日期
    function count(a) {
        let d = new Date();
        let TimeDateFormatText = '[Year]/[Month]/[Day] [Hour]:[Minute]:[Second]';
        let timetext = TimeDateFormatText.replace(/\[YEAR\]/gi, d.getFullYear().toString()).replace(/\[MONTH\]/gi, ('0' +(d.getMonth()+1).toString()).slice(-2)).replace(/\[DAY\]/gi, ('0' +d.getDate().toString()).slice(-2)).replace(/\[HOUR\]/gi, ('0' +d.getHours().toString()).slice(-2)).replace(/\[MINUTE\]/gi, ('0' +d.getMinutes().toString()).slice(-2)).replace(/\[SECOND\]/gi, ('0' +d.getSeconds().toString()).slice(-2));
        if(GM_getValue(a)){
            GM_setValue(a, {
                'name':a,
                'times': GM_getValue(a).times + 1,
                'date': timetext
            });
        }else{
            GM_setValue(a, {
                'name':a,
                'times': 1,
                'date': timetext
            });
        }
//        console.log(a + ":" + GM_getValue(a).times + "times" + "\n" + GM_getValue(a).date);
        console.log(a + ":" + GM_getValue(a).times + "times\0" + GM_getValue(a).date);
    }
 
    /**触发事件*/
    function tiggerEvent(el, type) {
        if ('createEvent' in document) {// modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);// event.initEvent(type, bubbles, cancelable);
            el.dispatchEvent(e);
        } else {// IE 8
            e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }
    }
 
    //在新标签页中打开
/*    function open(url) {
        // 这里
//        icon.style.display='none';
                var win;
            win = window.open(url);
        if (window.focus) {
            win.focus();
        }
       return win;
    }
*/
//这里后台打开标签页
    function open(url) {
         try {
            if(GM_openInTab(url, { loadInBackground: true, insert: true, setParent :true })){
                //success info
               Hide();
               console.log("doSomethingOk");
               } else{
               //fail info
               console.log("doSomethingNotOk");
               }
          } catch (error) {
               return GM_openInTab(url, { loadInBackground: true, insert: true, setParent :true });
          }
    }
 
})();