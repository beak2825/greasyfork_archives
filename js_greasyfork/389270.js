// ==UserScript==
// @name         翻译垃圾再利用
// @namespace    inqb.ga
// @version      0.5.0
// @description  跳转到源地址
// @author       no1xsyzy
// @match        *://*.stackexchange.com/search?q=*
// @match        *://stackoverflow.com/search?q=*
// @match        *://xbuba.com/questions/*
// @match        *://www.itranslater.com/qa/details/*
// @match        *://itranslater.com/qa/details/*
// @match        *://codeday.me/bug/*
// @match        *://www.codenong.com/*
// @match        *://codenong.com/*
// @match        *://ask.helplib.com/others/*
// @match        *://hant.ask.helplib.com/others/*
// @match        *://qa.1r1g.com/sf/ask/*
// @match        *://www.ojit.com/article/*
// @match        *://www.thinbug.com/q/*
// @match        *://*.stackovernet.xyz/cn/q/*
// @match        *://qastack.cn/*/*
// @match        *://cn.voidcc.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389270/%E7%BF%BB%E8%AF%91%E5%9E%83%E5%9C%BE%E5%86%8D%E5%88%A9%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/389270/%E7%BF%BB%E8%AF%91%E5%9E%83%E5%9C%BE%E5%86%8D%E5%88%A9%E7%94%A8.meta.js
// ==/UserScript==

const HASHTAG = "#__translate_junk_jump";

(function() {
    'use strict'

    try{
        switch(window.location.hostname.split(".").slice(-2).join(".")){ // match second-level domain
            case "stackexchange.com":
            case "stackoverflow.com":
                if ( window.location.hash === HASHTAG ){ // assure hash tag for jump indication
                    let g = document.querySelectorAll(`.search-result`)
                    if ( g.length === 1 ) { // assure only one result
                        let link = g[0].querySelector(`a.question-hyperlink`)
                        window.location.href = link.href
                    } else {
                        let searchQuery = document.querySelector(`input.s-input`).value;
                        for ( let gg of g ){
                            if ( gg.querySelector('a.question-hyperlink').getAttribute('title') === searchQuery ){
                                window.location.href = gg.querySelector('a.question-hyperlink').getAttribute("href")
                                break
                            }
                        }
                    }
                }
                break
            case "xbuba.com":
            case "ojit.com":
                window.location.href = document.querySelector(`a[href^="https://stackoverflow.com/q"]`).getAttribute("href")
                break
            case "itranslater.com":
                window.location.href = document.querySelector(`a[href^="https://stackoverflow.com:/q"]`).getAttribute("href");
                break
            case "codeday.me":
                window.location.href = document.querySelector(`span.article-es-url:nth-child(4) > a:nth-child(1)`).getAttribute("href")
                break
            case "codenong.com":
                if (window.location.pathname === "/"){
                    throw TypeError
                }
                window.location.href = "https://stackoverflow.com/q"+window.location.pathname
                break
            case "helplib.com":
                window.location.href = "https://stackoverflow.com/search?q=" + document.querySelector(`a.main_title`).getAttribute("oldtitle") + HASHTAG
                break
            case "1r1g.com":
                window.location.href = "https://stackoverflow.com/q/"+(+/\d+/.exec(window.location.pathname)[0]-31)/70
                break
            case "thinbug.com":
                window.location.href = "https://stackoverflow.com"+window.location.pathname
                break
            case "stackovernet.xyz":
                var sub = window.location.hostname.split(".")[0]
                window.location.href = `https://${sub}.stackexchange.com/search?q=` + document.querySelector(`h1`).innerHTML + HASHTAG
                break
            case "qastack.cn":
                var domain = document.querySelector(`small>a:last-child`).hostname
                window.location.href = `https://${domain}/q/${window.location.pathname.split("/")[2]}`
                break
            case "voidcc.com":
                window.location.href = document.querySelector("span.source > a").href
                break
            default:
                throw Error
        }
    }catch(e){
        console.log("unknown source")
    }
})();
