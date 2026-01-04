// ==UserScript==
// @name         CCF PLUS
// @namespace    http://tampermonkey.net/
// @version      0.3.8
// @description  CCF论坛浏览增强
// @author       AfAn
// @match        https://bbs.et8.net/bbs/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/397899/CCF%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/397899/CCF%20PLUS.meta.js
// ==/UserScript==   

(function() {
    'use strict';

    let CCF = {
        preload: (function() {
            function preload(selectorcfg = {}) {
                this.lock = new Lock();
                this.waiting = false
                this.baseURI = this.getBaseURI();
                this.page = (this.getQueryParam('page'))?parseInt(this.getQueryParam('page')):1;
                this.selector = {
                    next: 'a.next',
                    item: '',
                    container: '',
                    pagi: '.pagination',
                };
                Object.assign(this.selector, selectorcfg);
                this.pagegen = this.fetchSync(location.href);
                this.anchor = $(this.selector.pagi)[0];
                this._count = 0;
                this._beforeAppend = function(elems) {
                    return elems
                };
                this._append = function(container, elems) {
                    container.append(elems);
                };
                this._afterAppend = function(elems) {
                    //
                };
                this._scrollEnd = function() {
                    //
                }
                if ($(this.selector.item).length) {
                    document.addEventListener('scroll', this.scroll.bind(this));
                    // document.addEventListener('wheel', this.wheel.bind(this));
                }
            }
            preload.prototype.getQueryParam = function(name) {
                let params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
                for (let index = 0; index < params.length; index++) {
                    const element = params[index];
                    let queryString = element.split('=')
                    if (queryString[0] === name) {
                        return queryString[1]
                    }
                }
                return null;
            }
            preload.prototype.getBaseURI = function() {
                let _ = location;
                return `${_.protocol}//${_.hostname}${(_.port && `:${_.port}`)}`;
            };
            preload.prototype.getNextURL= function(href) {
                let a = document.createElement('a');
                a.href = href;
                return `${this.baseURI}${a.pathname}${a.search}`;
            };
            preload.prototype.fetchURL= function(url) {
                const fetchwithcookie = fetch(url, { credentials: 'same-origin' });
                return fetchwithcookie
                    .then(response => response.text())
                    .then(html => new DOMParser().parseFromString(html, 'text/html'))
                    .then(doc => {
                    let $doc = $(doc);
                    let href = $doc.find(this.selector.next).attr('href');
                    let nextURL = href ? this.getNextURL(href) : undefined;
                    let elems = $doc.find(this.selector.item);
                    return {
                        nextURL,
                        elems
                    };
                });
            };
            preload.prototype.fetchSync= function* (urli) {
                let url = urli;
                do {
                    yield new Promise((resolve, reject) => {
                        if (this.lock.locked) {
                            reject();
                        } else {
                            this.lock.lock();
                            resolve();
                        }
                    }).then(() => {
                        return this.fetchURL(url)
                            .then(info => {
                            url = info.nextURL;
                            return info.elems;
                        });
                    }).then(elems => {
                        this.lock.unlock();
                        return elems;
                    }).catch((err) => {
                        // Locked!
                    });
                } while (url);
            };
            preload.prototype.firstPageParse= function() {
                let href = $('body').find(this.selector.next).attr('href');
                let nextURL = href ? this.getNextURL(href) : undefined;
                this.pagegen = this.fetchSync(nextURL);
            };
            preload.prototype.appendElems= function () {
                let nextpage

                if (this._count === 0) {
                    this._count = 1
                    this.firstPageParse();
                    return;
                } else {
                    nextpage = this.pagegen.next();
                }

                if (!nextpage.done) {
                    nextpage.value.then(elems => {
                        //console.log(this._count, elems)
                        elems = this._beforeAppend(elems)
                        this._append($(this.selector.container), elems);
                        this._count += 1;
                        this.page += 1
                        this._afterAppend(elems);
                    });
                }
                return nextpage.done;
            };
            preload.prototype.end= function () {
                console.info('The End');
                document.removeEventListener('scroll', this.scroll.bind(this));
                // document.removeEventListener('wheel', this.wheel.bind(this));
                //$(this.anchor).replaceWith($(`<h1>The End</h1>`));
                this._scrollEnd()
            };
            preload.prototype.reachBottom= function(elem, limit) {
                return (elem.getBoundingClientRect().top - $(window).height()) < limit;
            };
            preload.prototype.scroll=	function() {
                if (this.waiting) {
                    return;
                }
                //console.log('scroll',this.waiting)
                this.waiting = true;
                if (this.reachBottom(this.anchor, 1000) && this.appendElems()) {
                    this.end();
                }
                setTimeout(function(preload){
                    //console.log(preload.waiting)
                    preload.waiting = false
                }, 1000, this);
            };

            // preload.prototype.wheel= function(e) {
            //     if (this.waiting) {
            //         return;
            //     }
            //     console.log('wheel',this.waiting)
            //     this.waiting = true;
            //     if (this.reachBottom(this.anchor, 1000) && this.appendElems()) {
            //         this.end();
            //     }
            //     setTimeout(function(vbb){
            //         console.log(vbb.waiting)
            //         vbb.waiting = false
            //     }, 1000, this);
            // };

            preload.prototype.setBeforeAppendCallback= function(f) {
                this._beforeAppend = f;
            };
            preload.prototype.setAppendCallback= function(f) {
                this._append = f;
            };
            preload.prototype.setAfterAppendCallback= function(f) {
                this._afterAppend = f;
            };
            preload.prototype.setScrollEndCallback= function(f) {
                this._scrollEnd = f;
            };

            return preload;
        })(),

        darkMode: (function() {
            function darkMode() {
                if (GM_getValue('darkMode', darkMode.default) === false) {
                    return;
                }

                let hour = new Date().getHours()
                //let cssHref = document.styleSheets[0].cssRules[0].href
                const theme = {
                    light: {
                        url: 'clientscript/vbulletin_css/style-2c9feb2b-00006.css',
                        styleid: "6"
                    },
                    dark: {
                        url: 'clientscript/vbulletin_css/style-52bbaa6a-00007.css',
                        styleid: "7"
                    }
                }

                if (hour <= 7 || hour >= 18) {
                    if (CCF.cookie.get('bbstyleid') == theme.dark.styleid) {
                        return;
                    }
                    console.log('switch dark theme')
                    document.styleSheets[0].deleteRule(0)
                    document.styleSheets[0].insertRule(`@import url("${theme.dark.url}")`)
                    CCF.cookie.set('bbstyleid', theme.dark.styleid, 'domain=.et8.net;path=/;')
                    return;
                } else {
                    if (CCF.cookie.get('bbstyleid') == theme.light.styleid) {
                        return;
                    }
                    console.log('switch light theme')
                    document.styleSheets[0].deleteRule(0)
                    document.styleSheets[0].insertRule(`@import url("${theme.light.url}")`)
                    CCF.cookie.set('bbstyleid', theme.light.styleid, 'domain=.et8.net;path=/;')
                    return;
                }
            }

            darkMode.default = false

            return darkMode
        })(),

        cookie: {
            set: function(name,value,more){
                var Days = 30; //此 cookie 将被保存 30 天
                var exp  = new Date();//new Date("December 31, 9998");
                exp.setTime(exp.getTime() + Days*24*60*60*1000);
                document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";"+more;
            },
            get: function(name){
                var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
                if(arr != null) return unescape(arr[2]); return null;
            },
            del: function(name){
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval=getCookie(name);
                if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
            }
        }
    }

    let CCFinit = function() {
        console.log('start')
        
        const darkModeMenu = {
            darkSwitch: GM_getValue('darkMode', CCF.darkMode.default),
            menuid: null,

            enable: function() {
                GM_setValue('darkMode', true)
                if (darkModeMenu.menuid) {
                    GM_unregisterMenuCommand(darkModeMenu.menuid)
                }
                darkModeMenu.menuid = GM_registerMenuCommand('自动暗黑模式 开', function(){
                    darkModeMenu.disable()
                })
            },
            disable: function() {
                GM_setValue('darkMode', false)
                if (darkModeMenu.menuid) {
                    GM_unregisterMenuCommand(darkModeMenu.menuid)
                }
                darkModeMenu.menuid = GM_registerMenuCommand('自动暗黑模式 关', function(){
                    darkModeMenu.enable()
                })
            },

            init: function() {
                if (darkModeMenu.darkSwitch)
                    darkModeMenu.enable()
                else
                    darkModeMenu.disable()
            },
        }

        darkModeMenu.init()

        // dark mode
        new CCF.darkMode({})

        let preload = new CCF.preload({})
        let cfg = {}
        //thread
        cfg = {
            next: 'a[rel="next"]',
            item: 'div#posts > div[align="center"]',
            container: 'div#posts',
            pagi: 'div.pagenav:last',
        }
        if (location.href.indexOf('showthread.php') > 0 && $(cfg.next).length && $(cfg.container).length) {
            preload = new CCF.preload(cfg)

            preload.setBeforeAppendCallback(function(elems) {
                elems.find('table#table1 div:first').prepend(`<span>P${this.page+1}</span>`)
                return elems
            })

            preload.setAfterAppendCallback(function(elems) {
                if ($('div#posts > div[align="center"]').length > 150) {
                    $('div#posts > div[align="center"]:lt(15)').remove()
                }
            })

            preload.setScrollEndCallback(function(){
                if ($('div#endbar').length > 0) {
                    return;
                }
                $('div#posts').append(`<div id="endbar" align="center"><div class="page" style="width:100%; text-align:left;"><div style="padding:0px 25px 0px 25px" align="center"><div class="tborder alt1" style="border: 1px solid">The End.</div></div></div></div>`)
            })
        }

        //threadlist
        cfg = {
            next: 'a[rel="next"]',
            item: 'table#threadslist > tbody:eq(1) > tr',
            container: 'table#threadslist > tbody:eq(1)',
            pagi: 'div.pagenav:last',
        }
        if (location.href.indexOf('forumdisplay.php') > 0 && $(cfg.next).length && $(cfg.container).length) {
            preload = new CCF.preload(cfg)

            preload.setBeforeAppendCallback(function(elems) {
                let t = ($("<div></div>").append(elems))
                t.find('td[id*="td_threadtitle"] div img[src*="sticky"]').parents('tr').remove()
                t.find('tr > td:eq(0):empty').parents('tr').remove()
                console.log(t.find('tr'))
                t.prepend(`<tr id="toolbar"><td class="alt2" colspan="8" style="text-align:center">P${this.page+1}</td></tr>`)
                return t.find('tr')
            })

            preload.setAfterAppendCallback(function(elems) {
                let oldIdx = ($('tr#toolbar:first').index() === 0)?$('tr#toolbar:eq(1)').index():$('tr#toolbar:first').index()
                console.log($('table#threadslist > tbody:eq(1) > tr').length, oldIdx)
                if ($('table#threadslist > tbody:eq(1) > tr').length >= 359) {
                    $('table#threadslist > tbody:eq(1) > tr:lt('+oldIdx+')').remove()
                }
            })
        }

        // search
        cfg = {
            next: 'a[rel="next"]',
            item: 'table#threadslist > tbody:eq(0) > tr',
            container: 'table#threadslist > tbody:eq(0)',
            pagi: 'div.pagenav:last',
        }
        if (location.href.indexOf('search.php') > 0 && $(cfg.next).length && $(cfg.container).length) {
            preload = new CCF.preload(cfg)

            preload.setBeforeAppendCallback(function(elems) {
                let t = $("<div></div>").append(elems)
                let tr = t.find('tr > td[id*="td_threadstatusicon"]').parents('tr') //[id*="td_threadstatusicon"]
                if (this.page == 1) {
                    $('table#threadslist > tbody:eq(0) > tr > td.tfoot').parent('tr').remove()
                }
                //console.log(tr)
                //if (tr)
                tr = $("<div></div>")
                .append(`<tr id="toolbar"><td class="alt1" align="center" colspan="10"><span class="smallfont">P${this.page+1}</span></td></tr>`)
                .append(tr)
                .children()
                return tr
            })

            preload.setAfterAppendCallback(function(elems) {
                let oldIdx = ($('tr#toolbar:first').index() === 0)?$('tr#toolbar:eq(1)').index():$('tr#toolbar:first').index()
                console.log($('table#threadslist > tbody:eq(0) > tr').length, oldIdx)
                if ($('table#threadslist > tbody:eq(0) > tr').length >= 300) {
                    $('table#threadslist > tbody:eq(0) > tr:lt('+oldIdx+')').remove()
                }
            })
        }
    }

    class Lock {
        constructor(d = false) {
            this.locked = d;
        }
        lock() {
            this.locked = true;
        }
        unlock() {
            this.locked = false;
        }
    }

    CCFinit()
})();