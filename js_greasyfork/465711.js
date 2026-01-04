// ==UserScript==
// @name         FPGA-Plus
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  为 [FPGA Online](https://fpgaol.ustc.edu.cn/) 提供的更多功能
// @author       PRO
// @license      gpl-3.0
// @match        *://fpgaol.ustc.edu.cn/*
// @match        http://202.38.79.134:*/*
// @grant        none
// @icon         https://fpgaol.ustc.edu.cn/favicon.ico
// @require      https://greasyfork.org/scripts/462234-message/code/Message.js?version=1192786
// @downloadURL https://update.greasyfork.org/scripts/465711/FPGA-Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/465711/FPGA-Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let name = "FPGA-Plus";
    window.QMSG_GLOBALS = {
        DEFAULTS: {
            showClose:true,
            timeout: 2000
        }
    }
    let toast = (s, error=false) => {
        if (error) {
            Qmsg.error(`[${name}] ${s}`);
            console.error(`[${name}] ${s}`);
        } else {
            Qmsg.success(`[${name}] ${s}`);
            console.log(`[${name}] ${s}`);
        }
    };
    if (window.location.hostname == 'fpgaol.ustc.edu.cn') { // Main page
        let navbar = document.querySelector(".navbar-nav");
        if (!navbar) return;
        let last = navbar.querySelector("form");
        if (!last) return;
        // Auto navigate to acquired board
        let acquired = document.querySelector("table.table.table-striped > tbody > tr:nth-child(4) > td > a");
        if (acquired.attributes.href.value != "None") {
            acquired.click();
        }
        // Copy parts
        let parts = "xc7a100tcsg324-1";
        let hint = document.createElement("li");
        hint.classList.add("nav-item");
        navbar.insertBefore(hint, last);
        let link = document.createElement("a");
        link.classList.add("nav-link");
        link.text = parts;
        link.title = "Click to copy";
        link.href = "javascript:void(0);";
        link.addEventListener("click", (e) => {
            navigator.clipboard.writeText(parts);
            toast("Copied!");
        });
        hint.appendChild(link);
        return;
    } // Dev page
    // Visual improvements
    let rsp = document.getElementById("responsetext");
    let upload = document.getElementById("upload-button");
    upload.addEventListener("click", (e)=>{
        rsp.textContent = "Waiting...";
    });
    // Default upload
    let default_input = document.getElementById("bitstream");
    let customed = document.getElementById("file-select");
    default_input.style.borderStyle = "dashed";
    default_input.style.borderRadius = "0.5em";
    default_input.style.padding = "0.5em";
    default_input.style.background = "#a9a9a966";
    default_input.attributes.removeNamedItem("hidden");
    customed.parentNode.replaceChild(default_input, customed);
    // Remove unused
    document.querySelector("body > div:nth-child(2) > div > div > form > div.row > div:nth-child(2)").remove();
    // Led value
    //   Pre-process
    let val = 0;
    let panel = document.querySelector(".col-5.colmodule");
    panel.insertAdjacentHTML('afterbegin', '<div class="container"><span id="info" style="padding: inherit;">Bin: 0b00000000; Hex: 0x00; Dec (unsigned): 0</span></div>');
    //   Functions
    function checkbox_patch(checkbox) {
        // Check out https://github.com/PRO-2684/gadgets/blob/main/checkbox_patch/ if you're interested in this part
        const { get, set } = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked');
        Object.defineProperty(checkbox, 'checked', {
            get() {
                return get.call(this);
            },
            set(newVal) {
                let ret = set.call(this, newVal);
                this.dispatchEvent(new Event("change"));
                return ret;
            }
        });
    }
    function get_bit(n) {
        return (val >> n) & 1;
    }
    function set_bit(n, b) {
        if (b) {
          val |= (1 << n);
        } else {
          val &= ~(1 << n);
        }
    }
    function update() {
        let bin_str = '0b' + val.toString(2).padStart(8, '0');
        let hex_str = '0x' + val.toString(16).padStart(2, '0');
        let dec_str = val.toString();
        let res = `Bin: ${bin_str}; Hex: ${hex_str}; Dec (unsigned): ${dec_str}`;
        info.textContent = res;
    }
    //   Setup listeners & init
    for (let i = 0; i <= 7; i++) {
        let led = document.getElementById(`led${i}`);
        set_bit(i, led.checked);
        checkbox_patch(led);
        led.addEventListener("change", (e) => {
            set_bit(i, led.checked);
            update();
        });
    }
    update();
})();