// ==UserScript==
// @name         用滚轮切换幻灯片
// @version      0.0.1
// @include      https://www.mcbbs.net/*
// @author       xmdhs
// @description  用滚轮切换幻灯片。
// @namespace https://xmdhs.top
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/426095/%E7%94%A8%E6%BB%9A%E8%BD%AE%E5%88%87%E6%8D%A2%E5%B9%BB%E7%81%AF%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/426095/%E7%94%A8%E6%BB%9A%E8%BD%AE%E5%88%87%E6%8D%A2%E5%B9%BB%E7%81%AF%E7%89%87.meta.js
// ==/UserScript==

(() => {
    let window = unsafeWindow || window
    let updateInterval = null;
    const alignItem = function (target, itemW) {
        let sL = target.scrollLeft;
        let oW = target.offsetWidth;
        let offset = Math.floor((sL + oW / 2) / itemW);
        let bL = sL + oW / 2 - offset * itemW;
        offset += Math.abs(bL) > Math.abs(bL - itemW) ? 1 : 0;
        animateProp(target, {
            "duration": 250,
            "value": offset * itemW - oW / 2,
            "propName": "scrollLeft"
        });
    }

    const animateProp = function (target, opt) {
        let aObj = document.createElement("a");
        aObj.setAttribute("style", "position: fixed; visibility: hidden; opactiy: 0;left: 0px;");
        aObj.style.transitionDuration = opt.duration.toString() + "ms";
        document.body.append(aObj);
        void aObj.offsetLeft;
        let targetVal = opt.value - target[opt.propName];
        aObj.style.left = targetVal.toString() + "px";
        let run = 0;
        aObj.runner = setInterval(function () {
            target[opt.propName] += aObj.offsetLeft - run;
            run = aObj.offsetLeft;
            if (aObj.offsetLeft == targetVal) {
                clearInterval(aObj.runner);
                if (typeof opt.callback == "function") {
                    opt.callback();
                }
                aObj.remove();
            }
        }, 10);
    }

    let ctrlBtn = function (target, itemW, left) {
        animateProp(target, {
            "duration": 250,
            "value": target.scrollLeft + (left ? itemW : -itemW),
            "propName": "scrollLeft"
        });
    }

    function setTx(obj, x, op, sc) {
        let oS = obj.style;
        oS.opacity = op;
        oS.transform = "translateX(" + x + "px) scale(" + sc + ")";
    }

    function recalcItem(e, layer, items) {
        let itemW = items[0].offsetWidth;
        let layerW = layer.offsetWidth;
        if (layer.scrollLeft < (itemW * 3 - layerW / 2)) {
            e.preventDefault();
            layer.inOpearting = true;
            layer.scrollLeft = itemW * (items.length - 1) - (layerW / 2);
        } else if (layer.scrollLeft > (itemW * (items.length - 1) - (layerW / 2))) {
            e.preventDefault();
            layer.inOpearting = true;
            layer.scrollLeft = itemW * 3 - (layerW / 2);
        }
        let index = Math.floor((layer.scrollLeft + (layerW / 2)) / itemW) - 1;
        let base = layer.scrollLeft + (layerW / 2);
        let offset = Math.max(0, Math.min(1, Math.abs(base - itemW * (index + 1)) / itemW));
        let cItem = items[index];
        setTx(cItem, ((base - itemW * (index + 1)) > 0 ? 1 : -1) * 100 * offset, 0.5 * (2 - offset), 1 - 0.4 * offset);
        setTx(cItem.nextElementSibling, -100 * (1 - offset), 0.5 * (1 + offset), 0.6 + 0.4 * offset);
        setTx(cItem.previousElementSibling, 100 * (1 - offset), 0.5 * (1 + offset), 0.6 + 0.4 * offset);
    }

    const initAlbum = function () {
        let albums = document.querySelectorAll(".album_wrapper");
        for (let album of albums) {
            let layer = album.querySelector(".album_layer");
            layer.parentNode.replaceChild(layer.cloneNode(true), layer)
            layer = album.querySelector(".album_layer");
            let items = layer.querySelectorAll(".album_item");
            let lBtn = album.querySelector(".album_ctrl.left");
            let rBtn = album.querySelector(".album_ctrl.right");
            for (let i of album.querySelectorAll(".album_layer > *:not(.album_item)")) {
                i.remove();
            }
            if (items.length == 0) { continue; }
            if (items.length > 1) {
                // "ph" for placeholders
                let ph = [items[0], items[1], items[items.length - 1], items[items.length - 2]];
                for (let index in ph) {
                    ph[index] = ph[index].cloneNode(true);
                    ph[index].classList.add("placeholder");
                }
                layer.prepend(ph[3], ph[2]);
                layer.append(ph[0], ph[1]);
            } else {

            }
            items = [...layer.querySelectorAll(".album_item")];
            album.setAttribute("initiated", "true");
            layer.addEventListener('scroll', function (e) {
                if (layer.inOpearting == true) { layer.inOpearting = false; return; }
                clearTimeout(layer.alignTimer);
                layer.alignTimer = setTimeout(function () {
                    alignItem(layer, items[0].offsetWidth);
                }, 300);
                recalcItem(e, layer, items);
            });
            layer.scrollLeft = 3 * items[0].offsetWidth - layer.offsetWidth / 2;
            lBtn.parentNode.replaceChild(lBtn.cloneNode(true), lBtn)
            rBtn.parentNode.replaceChild(rBtn.cloneNode(true), rBtn)
            lBtn = album.querySelector(".album_ctrl.left");
            rBtn = album.querySelector(".album_ctrl.right");
            lBtn.addEventListener("click", function () { ctrlBtn(layer, items[0].offsetWidth, false) });
            rBtn.addEventListener("click", function () { ctrlBtn(layer, items[0].offsetWidth, true) });

        }
    }


    window.addEventListener("load", () => {
        initAlbum();
        document.querySelectorAll(".album_layer").forEach((v) => {
            v.addEventListener('mousewheel', (e) => {
                console.log(e)
                let t = false;
                if (e.deltaY > 0) {
                    t = true
                }
                for (const c of e.path) {
                    if (c["className"] == "album_wrapper") {
                        if (t) {
                            c.children[2].click()
                        } else {
                            c.children[0].click()
                        }
                    }
                }
                e.preventDefault()
            }, { passive: false })
        })
    })
})();