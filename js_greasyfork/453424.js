// ==UserScript==
// @name         yhys
// @namespace    none
// @version      0.1.04
// @description  A private script(by yya) on yhys for ccy❤️
// @author       yyaxxx
// @license      GPLv3
// @match        http*://yhys.oms.yunwms.com/*
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/453424/yhys.user.js
// @updateURL https://update.greasyfork.org/scripts/453424/yhys.meta.js
// ==/UserScript==

(() => {
    const ccode = "B220";

    let se = document.createElement('script');
    se.type = 'text/javascript';
    se.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.js";
    document.head.appendChild(se);

    function iframeQuerySelectorAll(doc, selector) {
        let ret = doc.querySelectorAll(selector);
        if (ret.length) {
            return ret;
        } else {
            for (let iframe of Object.values(doc.querySelectorAll("iframe"))) {
                console.log("iframe: ", iframe);
                ret = iframeQuerySelectorAll(iframe.contentWindow.document, selector);
                if (ret.length) return ret;
            };
            return [];
        }
    };

    function getQRCodeHTML(text) {
        let container = document.createElement('div');
        new QRCode(container, {
            text: text,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M,
            useSVG: true
        });
        container.children[0].style.width = "2cm";
        container.children[0].style.height = "2cm";
        return container.innerHTML;
    }

    function getTextWidth(text, fw, fs, fm) {
        // re-use canvas object for better performance
        const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = `${fw} ${fs} ${fm}`;
        const metrics = context.measureText(text);
        return metrics.width;
    }

    function getCssStyle(element, prop) {
        return window.getComputedStyle(element, null).getPropertyValue(prop);
    }

    function getCanvasFont(el = document.body) {
        const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
        const fontSize = getCssStyle(el, 'font-size') || '16px';
        const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
        return `${fontWeight} ${fontSize} ${fontFamily}`;
    }

    const fontFamily = "Arial,'Microsoft YaHei','PingFang SC',Helvetica,sans-serifs";
    function calcFontSize(maxWidth, maxLineHeight, text) {
        console.log(text.length);
        if (text.length >= 40) {
            const msg = "标题超过40个字符啦~";
            alert(msg);
            throw msg;
        }

        const normalWidth = 37.7952756 * (maxWidth - 0.2);
        let L = .1, R = maxLineHeight;
        for (let loop = 0; loop < 25; loop++) {
            let fs = Math.round((L + R) / 2 * 1000000) / 1000000,
                w = getTextWidth(text, "normal", `${fs}cm`, fontFamily);
            // console.log((L).toFixed(6), (R).toFixed(6), (w).toFixed(6), (w / (96 / 2.54)).toFixed(6), (fs * 1.2).toFixed(6), (fs).toFixed(6));
            if (w > normalWidth) {
                R = fs;
            } else if (w < normalWidth) {
                L = fs;
            }
        }
        return L;
    }

    function openPrintingPageOnNewTab(together) {
        console.log("clicked 大头");
        let data = Object.values(iframeQuerySelectorAll(document, "#dialogPrint > #printLabelForm > div > table > #printData > tr"));
        console.log("data: ", data);
        if (data.length) {
            if (together) {
                let html = "";
                for (let d of data) {
                    let sku = d.children[0].innerText,
                        name = d.children[1].innerText,
                        amount = parseInt(d.children[3].children[0].value),
                        text = `${ccode} ${name}`,
                        code = `${ccode}-${sku}`,
                        qrcodeHTML = getQRCodeHTML(code);
                    for (let i = 0; i < amount; ++i) {
                        html = `${html}
                            <div style="line-height: 1.2; margin: 0 auto; text-align: center; ${html.length? "page-break-before: always;": ""}">
                                <div style="font-size: ${calcFontSize(6, .5, text)}cm; font-family: ${fontFamily};">${text}</div>
                                ${qrcodeHTML}
                                <div style="font-size: 0.4166cm; font-family: ${fontFamily};">${code}</div>
                            </div>
                        `;
                    }
                }
                window.open("", "_blank").document.writeln(`<body style="width: 6cm; margin: 0 auto;">${html}</body>`);
            } else {
                for (let d of data) {
                    let html = "",
                        sku = d.children[0].innerText,
                        name = d.children[1].innerText,
                        amount = parseInt(d.children[3].children[0].value),
                        text = `${ccode} ${name}`,
                        code = `${ccode}-${sku}`,
                        qrcodeHTML = getQRCodeHTML(code);
                    for (let i = 0; i < amount; ++i) {
                        html = `${html}
                            <div style="line-height: 1.2; margin: 0 auto; text-align: center; ${html.length? "page-break-before: always;": ""}">
                                <div style="font-size: ${calcFontSize(6, .5, text)}cm; font-family: ${fontFamily};">${text}</div>
                                ${qrcodeHTML}
                                <div style="font-size: 0.4166cm; font-family: ${fontFamily};">${code}</div>
                            </div>
                        `;
                    }
                    window.open("", "_blank").document.writeln(`<body style="width: 6cm; margin: 0 auto;">${html}</body>`);
                }
            }
        } else {
            alert("(>_<) 出错啦~");
        }
    };

    window.onload = () => {
        let dialog = document.createElement('dialog'),
            separated = document.createElement('p'),
            together = document.createElement('p');
        dialog.style = "margin:auto; padding:1em; line-height:1.5; text-align:center";
        separated.innerText = "不同产品不同文件";
        together.innerText = "所有产品一个文件";
        separated.style = together.style = "background:#000; color:#fff; padding:0 6px; border-radius:3px; margin:0 0 3px; cursor: pointer;";
        separated.onclick = () => {
            openPrintingPageOnNewTab(false);
            dialog.close();
            // dialog.oncancel();
        };
        together.onclick = () => {
            openPrintingPageOnNewTab(true);
            dialog.close();
            // dialog.oncancel();
        };
        dialog.appendChild(separated);
        dialog.appendChild(together);
        document.body.appendChild(dialog);

        let open = document.createElement("a");
        open.innerText = "大头";
        open.style = "align-items:center; display: flex; padding: 1em; color: white;";
        open.onclick = () => {
            dialog.showModal();
        };
        document.querySelector("#head > div.head-right").insertAdjacentElement("afterbegin", open);
    };
})();