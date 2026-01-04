// ==UserScript==
// @name         有章PDF下载
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  下载有章文档
// @author       JoyofFire
// @match        https://www.ilawpress.com/assets/plugin/pdfviewer/web/viewer.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ilawpress.com
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/473551/%E6%9C%89%E7%AB%A0PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/473551/%E6%9C%89%E7%AB%A0PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';


    // 全局常量
    const DL_PDF_API = "download_pdf";
    const DL_BTN = `<button id="dl-pdf" class="extend-navbar-btn fa fa-download" title="下载PDF" style="margin-right:1.1em;color:red" onclick="${DL_PDF_API}()"><span>下载PDF</span></button>`; //`<button id="dl-pdf" class="extend-navbar-btn fa fa-download" title="下载PDF" style="position:fixed;right: 2em;color:red" onclick="${DL_PDF_API}()"><span>下载PDF</span></button>`
    const make_blob_url = get_fn_call(URL, "createObjectURL");
    const insert_html_elem = get_fn_call(Element.prototype, "insertAdjacentHTML");

    function print(...args) {
        const time = new Date().toTimeString().slice(0, 8);
        console.info(`[wk ${time}]`, ...args);
    }

    function get_fn_call(obj, fn_name) {
        const fn = obj[fn_name];
        const call = fn.call.bind(fn);
        print(`got bound ${fn_name}.call:`, call);
        return call;
    }

    /**
     * @param {string} selectors
     * @returns {HTMLElement}
     */
    function $(selectors) {
        return document.querySelector(selectors);
    }


    function add_dl_btn() {
        insert_html_elem($("#toolbarViewerRight"), "afterbegin", DL_BTN);
        print("btn added");
    }

    function on_data(data) {
        const blob = new Blob([data], { type: "application/pdf" });
        const url = make_blob_url(URL, blob);
        
        window.data = data;
        window.url = url;
        window[DL_PDF_API] = () => open(url);

        print("data:", data);
        print("url:", window.url);
    }

    function hook_then() {
        print("entered hook_then");

        const { then } = Promise.prototype;
        Promise.prototype.then = function(...args) {
            for (const [i, arg] of args.entries()) {
                if (String(arg).includes("(pdfDocument) {")) {
                    print(...args);

                    args[i] = function(doc) {
                        print("doc:", doc);
                        doc.getData().then(on_data);
                        return arg.call(this, doc);
                    };
                    break;
                }
            }
            return then.apply(this, args);
        };
    }

    function on_dom_loaded() {
        print("dom loaded");
        add_dl_btn();
    }

    function hook_fetch() {
        const myfetch = get_fn_call(window, "fetch");

        window.fetch = function(url, ...args) {
            //debugger;
            const aim = /[/]pdf[/]trybook[/][0-9]+/;
            const _url = `${url}`;
            const replaced = aim.test(_url)
                ? _url.replace("/trybook/", "/book/")
                : url;
            //debugger;
            const ret_val = myfetch(this, replaced, ...args);
            return ret_val;

            //return myfetch(this, url, ...args);
        };
        print("fetch hooked:", window.fetch);
    }

    function main() {
        print("entered main");

        document.addEventListener("DOMContentLoaded", on_dom_loaded);
        hook_fetch();
        hook_then();
    }

    main();
})();