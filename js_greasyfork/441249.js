(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (global = global || self, factory(global.bleu = {}));
}(this, function (exports) {
    'use strict';
    var swalForInfo = function (satitle, satime, saposition) {
        return Swal.fire({
            title: satitle,
            position: saposition,
            showConfirmButton: false,
            timer: satime,
            customClass: {
                title: 'bleu_sa_title_min',
                popup: 'bleu_sa_popup_min'
            }
        })
    }
    var swalForUI = function (title, html, width) {
        return swal.fire({
            title: title,
            html: html,
            width: width,
            showConfirmButton: false,
            showCloseButton: true,
            allowOutsideClick: false,
            footer: ' ',
            customClass: {
                title: 'bleu_sa_title',
                popup: 'bleu_sa_popup',
                closeButton: 'bleu_sa_close',
                htmlContainer: 'bleu_sa_container',
                footer: 'bleu_sa_footer'
            },
        })
    }
    var bleuXHR = function (TYPE, URL, DATA, HEADER, rtype) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: TYPE,
                timeout: 2000,
                headers: HEADER,
                url: URL,
                data: DATA,
                responseType: rtype || "json",
                onload: function (res) {
                    resolve(res.response || res.responseText || res);
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        })
    }
    var addCssStyle = function (cssStyle) {
        if (cssStyle === undefined || cssStyle === null) cssStyle = '';
        let initStyle = `
                .bleu_sa_close {width: 30px;height: 30px;font-size: 30px;}
                .bleu_sa_title {font-size: 25px;}
                .bleu_sa_container{margin: 0;font-size: 20px;}
                .bleu_sa_popup {padding: 0 0 0;}
                .bleu_sa_footer{margin: 0;padding-top: 20px;}
                .bleu_sa_title_min{font-size: 20px !important;padding: 0;}
                .bleu_sa_popup_min{padding: 0 0 0;width: auto;}
                `
        let style = document.createElement('style');
        style.innerHTML = initStyle + cssStyle;
        document.querySelector('head').appendChild(style);
    }
    var sleep =function (ms){
        return new Promise((resolve)=>setTimeout(resolve,ms));
    }
    exports.swalInfo = swalForInfo;
    exports.swalUI = swalForUI;
    exports.XHR = bleuXHR;
    exports.addCssStyle = addCssStyle;
    exports.sleep = sleep;

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

}));