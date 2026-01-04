// ==UserScript==
// @name         rgbaColor > colorName
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  lanhu css rgba color > color name
// @author       You
// @match        https://lanhuapp.com/web/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395220/rgbaColor%20%3E%20colorName.user.js
// @updateURL https://update.greasyfork.org/scripts/395220/rgbaColor%20%3E%20colorName.meta.js
// ==/UserScript==

(function () {
    const NAME_COLOR_MAP = {
        fc0: "#2b68ff",
        fc1: "#2c2c2c",
        fc2: "#575e7b",
        fc3: "#7d8299",
        fc4: "#bfc1cb",
        fc5: "#dadce5",
        fc6: "#f1f2f4",
        fc7: "#f7f7fb",
        fc8: "#ffffff",
        fc9: "#eef3ff",
        fc10: "#ea5d5d",
        fc11: "#d6daee",
        fc12: "#242533",
        fc13: "#475177",
        borderColor: "#dadce5",
        cellDownColor: "#f1f2f4",
        listSelectedColor: "#f7f7fb",
        cellSelectedColor: "#eef3ff",
        errColor: "#ea5d5d",
        shadowColor: "#d6daee",
        shadeColor: "rgba(36,37,51,0.7)",
    };


    function objectFlip(obj) {
        const ret = {};
        Object.keys(obj).forEach(key => {
            ret[obj[key]] = key;
        });
        return ret;
    }


    const COLOR_NAME_MAP = objectFlip(NAME_COLOR_MAP)

    function RGBAToHex(rgba) {
        let sep = rgba.indexOf(",") > -1 ? "," : " ";
        rgba = rgba.substr(5).split(")")[0].split(sep);

        // Strip the slash if using space-separated syntax
        if (rgba.indexOf("/") > -1)
            rgba.splice(3, 1);

        for (let R in rgba) {
            let r = rgba[R];
            if (r.indexOf("%") > -1) {
                let p = r.substr(0, r.length - 1) / 100;

                if (R < 3) {
                    rgba[R] = Math.round(p * 255);
                } else {
                    rgba[R] = p;
                }
            }
        }
        let r = (+rgba[0]).toString(16),
            g = (+rgba[1]).toString(16),
            b = (+rgba[2]).toString(16),
            a = Math.round(+rgba[3] * 255).toString(16);

        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        if (a.length == 1)
            a = "0" + a;

        return "#" + r + g + b;
    }


    function insertTransBtn(btn) {
        let copyCodeDadNode = document.querySelector(".code_detail > .subtitle")
        copyCodeDadNode.append(btn)
        btn.addEventListener('click', () => {
            const input = document.createElement('input');
            document.body.appendChild(input);
            let newCSS = transfColor()
            input.setAttribute('value', newCSS);
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                console.log('复制成功');
            }
            document.body.removeChild(input);
        })
    }
    function transfColor() {
        let cssNode = document.querySelector(".language-css")

        const cssReg = /rgba\([\d,\.]*\)/g
        let cssText = cssNode.innerText
        let newCSSText = cssText.replace(cssReg, (match) => {
            if (COLOR_NAME_MAP.hasOwnProperty(match)) {
                return '@' + match
            } else {
                let colorName = COLOR_NAME_MAP[RGBAToHex(match)]
                return colorName ? '@' + colorName : match
            }
        })
        return newCSSText
    }

    function app() {
        // Select the node that will be observed for mutations
        var targetNode = document.body

        // Options for the observer (which mutations to observe)
        var config = { attributes: true, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        var callback = function (mutationsList) {
            let copyCodeNode = document.getElementById("copy_code")
            let btn = document.createElement("span")
            btn.innerText = "复制转化CSS"
            btn.style.cursor = "pointer"
            btn.id = "copy_code_new"
            let hasNewBtn = document.getElementById("copy_code_new")
            if (copyCodeNode && !hasNewBtn) {
                insertTransBtn(btn)
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Later, you can stop observing
        // observer.disconnect();
    }

    app()
})()