// ==UserScript==
// @name         AliExpress Price Inc Shipping
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sums price AND shipping on Aliexpress
// @author       You
// @match        https://www.aliexpress.com/item/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413001/AliExpress%20Price%20Inc%20Shipping.user.js
// @updateURL https://update.greasyfork.org/scripts/413001/AliExpress%20Price%20Inc%20Shipping.meta.js
// ==/UserScript==

(function() {
    const DOLLARSIGN = "$"
    const priceSelector = ".product-price-current .product-price-value";
    const Price = () => {
        var p = document.querySelector(priceSelector).textContent.split(DOLLARSIGN).pop()
        if (p.search('-') > -1) {
            p = p.split('-').pop().trim()
        }
        return p
    }
    const shippingSelector = ".product-shipping-price span"
    const Shipping = () => {
        const x = document.querySelector(shippingSelector);
        if (x) {
            return x.textContent.split(DOLLARSIGN).pop()
        }
        return "NaN"
    }

    var elem = SetupRender()
    waitForLoad(shippingSelector, () => {
        MainRender(elem)
        const config = {
            characterData: true,
            attributes: false,
            childList: false,
            subtree: true
        }
        const observer = new window.MutationObserver(() => (MainRender(elem) ));
        const observer2 = new window.MutationObserver(() => (MainRender(elem) ));
        observer.observe(document.querySelector(priceSelector), config);
        observer2.observe(document.querySelector(shippingSelector), config);
    })



    const displayElementSelector = ".product-price"
    function SetupRender() {
        var renderElem = document.createElement("div")
        var found = document.querySelector(".product-price") || null;
        found.appendChild(renderElem)
        cssAssign(renderElem.style, {
            display: "inline-block",
            fontSize: "24px",
            fontWeight: "700",
            marginLeft: "2em",
            verticalAlign: "middle",
        })


        return renderElem
    }

    function MainRender(renderElem) {
        console.log(Price(), Shipping())
        updatePrice()

        function updatePrice() {
            const p = parseFloat(Price())
            const s = parseFloat(Shipping())
            const total = (p + s).toString()
            const ship_elem = document.querySelector(".product-shipping-price span")
            var msg = "Uh-Oh"
            if (ship_elem && ship_elem.textContent.search("Free Shipping") > -1) {
                msg = DOLLARSIGN + p.toString()
            } else if (total.toString() != "NaN") {
                msg = `<b>∑</b>`+ DOLLARSIGN + total.slice(0, 4);
            } else {
                msg = `<b style="color:red;">Can't Ship</b>`
            }
            renderElem.innerHTML = msg
        }
    }

    function waitForLoad(query, callback) {
        var tx = Ticker().Start(() => {
            if (document.querySelector(query) != null) {
                tx.Stop()
                callback()
            }
        })
    }

    function cssAssign(o, n) {
        return Object.keys(n).map(k => (o[k] = n[k]))
    }

    // What kinda Pattern is this? Something something prototype class... I dono I code a lot of Go these days.
    function Ticker(max, timeOut, context) {
        const GUID = Math.random().toString(36).substring(2, 15)
        const defaultFunc = function() {}
        const _context = context || window;
        max = max || 0;
        timeOut = timeOut || 300;
        var self = {
            timeOut,
            "func": defaultFunc,
            count: 0,
            max
        };


        const _wrapper = function() {
            if (self.max > 0 && self.count >= max) {
                self.Stop()
            }
            self.func()
            self.count += 1
        }

        const Start = function(func) {
            self.func = func;
            var timeID = _context.setInterval(() => (self._wrapper()), self.timeOut)
            self.timeID = timeID
            return self
        }

        const Stop = function() {
            if (self.hasOwnProperty("timeID")) {
                _context.clearInterval(self.timeID)
            }
            return self

        }

        return Object.assign(self, {
            Stop,
            Start,
            _wrapper
        })
    }
})();