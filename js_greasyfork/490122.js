// ==UserScript==
// @name         CPS Count
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  -
// @author       2k09__
// @match        *://sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490122/CPS%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/490122/CPS%20Count.meta.js
// ==/UserScript==

(function anonymous() {
    const Cps = {}
 
    Cps.log = console.log
 
    Cps.count = 0
 
    Cps.reduce = function() {
        this.count -= 1
 
        this.element.setText(this.count)
    }
 
    Cps.increase = function() {
        this.count += 1
 
        this.element.setText(this.count)
    }
 
    Cps.sleep = function() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000)
        })
    }
 
    Cps.createElement = function() {
        this.element = document.createElement("div")
 
        this.element.setText = (count) => {
            const countNum = parseInt(count)
 
            if (countNum < 0) {
                count = 0
 
                Cps.log("bug...")
            }
 
            this.element.textContent = `Cps: ${count}`
        }
 
        this.element.setText(0)
 
        this.style = this.element.style
 
        this.element.classList.add("text-shadowed-3")
 
        this.style.position = "absolute"
        this.style.top = "20px"
 
        this.style.width = "100%"
 
        this.style.pointerEvents = "none"
 
        this.style.textAlign = "left"
        this.style.color = "blue"
        this.style.fontSize = "20px"
 
        document.body.appendChild(this.element)
    }
 
    Cps.createElement()
 
    Cps.update = async function() {
        this.increase()
        await this.sleep()
        this.reduce()
    }
 
    document.addEventListener("mousedown", () => {
        Cps.update()
    })
 
    Cps.spaceActive = false
 
    document.addEventListener("keydown", (event) => {
        if (event.code !== "Space" || Cps.spaceActive) {
            return void 0
        }
 
        Cps.update()
        Cps.spaceActive = true
    })
 
    document.addEventListener("keyup", (event) => {
        if (event.code !== "Space") {
            return void 0
        }
 
        Cps.spaceActive = false
    })
})()
 
document.getElementById("hat-menu").style.background = "rgba(0,0,0,0)";
(function() {var css = [
"#hat-menu {",
    "height: 700px;",
    "width: 500px;",
"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}
})();