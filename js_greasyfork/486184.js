// ==UserScript==
// @name         ZeroWidth-Shuiyuan
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Simple Steganography with Zero Width Space
// @author       infinitesima1
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/486184/ZeroWidth-Shuiyuan.user.js
// @updateURL https://update.greasyfork.org/scripts/486184/ZeroWidth-Shuiyuan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ch = [0x200b, 0x200c, 0x200d, 0x2060].map(x=>String.fromCharCode(x))

    const input = document.createElement("textarea")
    input.placeholder = "隐写内容"
    input.style.marginTop = "8px"
    input.style.height = "64px"
    input.style.width = "100%"

    function encode(str){
        return str.split("").map(x => x.charCodeAt(0)).map(v => {
            let s = ""
            for(let i = 0; i < 8; i++){
                s = ch[v & 3] + s
                v = v >>> 2
            }
            return s
        }).join("")
    }

    function decode(str){
        const prob = str.split("").filter(x => ch.includes(x))
        if(prob.length > 7){
            let s = ""
            let t = 0
            for(let i = 0; i + 7 < prob.length; i += 8){
                for(let j = 0; j < 8; j++){
                    t = (t << 2) | ch.indexOf(prob[i + j])
                }
                s += String.fromCharCode(t)
                t = 0
            }
            return s
        }else{
            return ""
        }
    }

    function filter(str){
        return str.split("").filter(x => !ch.includes(x)).join("")
    }

    window.addEventListener("load", () => {
        const required = window.require("discourse/models/rest")
        required.default.prototype.beforeCreate = function(props){
            props.raw = filter(props.raw) + encode(input.value)
            input.value = ""
        }
        required.default.prototype.beforeUpdate = function(props){
            props.raw = filter(props.raw) + encode(input.value)
            input.value = ""
        }
    })

    const mo = new MutationObserver(records => {
        const target = records.find(e => e.addedNodes[0]?.className === "d-editor-textarea-column")
        if(target){
            const node = target.addedNodes[0]
            node.appendChild(input)
            console.log("inserted")
            const textarea = node.getElementsByClassName("d-editor-input")?.[0]
            if(textarea && textarea.value){
                const decoded = decode(textarea.value)
                if(decoded){
                    input.value = decoded
                    textarea.value = filter(textarea.value)
                }
            }
        }
        Array.from(document.body.getElementsByClassName("cooked"))
        .filter(e => !String(e.className).includes("decoded"))
        .forEach(e => {
            const decoded = decode(e.innerText)
            if(decoded){
                const div = document.createElement("div")
                div.innerText = decoded
                div.style.background = "var(--tertiary-low)"
                div.style.boxShadow = "var(--tertiary-medium) -5px 0 0"
                div.style.marginLeft = "5px"
                div.style.padding = "12px"
                e.appendChild(div)
            }
            e.className += " decoded"
        })
    })

    mo.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: false
    })
})();