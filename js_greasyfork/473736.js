// ==UserScript==
// @name         取色器、颜色吸取器
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  一款简单易用的颜色吸取插件，操作简单，点击“颜色吸取”按钮，成功吸取颜色后，点击“颜色值（十六进制）”即可复制使用
// @author       casee
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/473736/%E5%8F%96%E8%89%B2%E5%99%A8%E3%80%81%E9%A2%9C%E8%89%B2%E5%90%B8%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/473736/%E5%8F%96%E8%89%B2%E5%99%A8%E3%80%81%E9%A2%9C%E8%89%B2%E5%90%B8%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let popup = null
    let panel = null
    let rootElement = document.body

    function createStyle() {
        var styleObj = `
          .hover:hover {
            filter: alpha(Opacity=70);
            opacity: 0.7;
          }
        `
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = styleObj;
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    function createPanel() {
        panel = document.createElement("div")
        panel.classList.add("hover")
        panel.setAttribute("id", "start-button")
        panel.style.cssText = `
          padding: 4px;
          background: linear-gradient(45deg,#fea158,#d500f9,#4e72e3);
          color: #fff;
          border-radius: 4px;
          position: fixed;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 12px;
          line-height:14px;
          z-index: 99999;
          transform: scale(0.9);
        `
        panel.innerHTML = "颜色<br/>吸取"
        rootElement.appendChild(panel)
    }

    function showToast(message, color="rgba(0,0,0,.7)") {
        const toast = document.createElement('div');
        toast.style.cssText = `
          position: fixed;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          z-index: 20000;
          background-color: ${color};
          box-shadow: 0 0 10px 0 #bbb;
          color: #fff;
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 4px;
        `
        toast.innerText = message;
        rootElement.appendChild(toast);

        // 渐变动画效果
        const start = performance.now();
        const interval = setInterval(function() {
            const elapsed = performance.now() - start;
            const progress = elapsed / 300; // 动画持续时间为500ms

            toast.style.opacity = progress;
            toast.style.transform = `translate(-50%, -${100 - progress * 100}%)`;

            if (progress >= 1) {
                clearInterval(interval);
                setTimeout(function() {
                    rootElement.removeChild(toast);
                }, 2000);
            }
        }, 10);
    }

    function removePopup() {
        if(popup){
            rootElement.removeChild(popup)
            popup = null
        }
    }

    function textCopy(t, tip=false) {
        if (!navigator.clipboard) {
            var ele = document.createElement("input");
            ele.value = t;
            rootElement.appendChild(ele);
            ele.select();
            document.execCommand("copy");
            rootElement.removeChild(ele);
            if (document.execCommand("copy")) {
                removePopup()
                showToast(tip?"颜色吸取成功，请粘贴使用" : "复制成功")
            } else {
                showToast("操作失败")
            }
        } else {
            navigator.clipboard.writeText(t).then(function () {
                removePopup()
                showToast(tip?"颜色吸取成功，请粘贴使用" : "复制成功")
            }).catch(function () {
                showToast("操作失败")
            })
        }
    }

    function createResult(result) {
        if(popup){
            removePopup()
        }
        popup = document.createElement("div")
        popup.setAttribute("data-flag", "pop")
        popup.style.cssText = `
          position:fixed;
          top: 10%;
          left: 50%;
          opacity: 0;
          display:flex;
          align-items: center;
          transform: translateX(-50%);
          padding: 5px 5px 5px 10px;
          background: #fff;
          box-shadow: 0 0 10px 0 #aaa;
          z-index: 99999;
          border-radius: 4px;
        `
        let color = document.createElement("div")
        color.setAttribute("data-flag", "pop")
        color.style.cssText = `
          width: 16px;
          height: 16px;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          padding: 1px;
          box-sizing: border-box;
        `
        let innerColor = document.createElement("div")
        innerColor.style.cssText = `
          width: 100%;
          height: 100%;
          background: ${result.sRGBHex};
          border-radius: 2px;
        `
        color.appendChild(innerColor)
        popup.appendChild(color)

        let span = document.createElement("span")
        span.setAttribute("data-flag", "pop")
        span.classList.add("hover")
        span.textContent = result.sRGBHex.toUpperCase()
        span.style.cssText = `
          margin-left: 5px;
          font-size: 14px;
          text-decoration: underline;
          color: #0680E9;
          cursor: pointer;
        `
        span.addEventListener("click", function(){
            textCopy(result.sRGBHex.toUpperCase())
        })
        popup.appendChild(span)

        let closeBtn = document.createElement("div")
        closeBtn.style.cssText = `
         width: 20px;
         height: 20px;
         background-position: center;
         background-repeat: no-repeat;
         background-size: cover;
         margin-left: 6px;
         cursor: pointer;
         background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABGRJREFUeF7tnU9u00AYxceJcgckbgA7DoBSliVhR5TChgXiAFwAbsABQGJVtWpXqGlZQRB3KCdgwyFiI5caJajFHnv+vJn3sp6Mv/fery91YtmF0YvagYJavcQbAUAOgQAQAOQOkMtXAwgAcgfI5asBBAC5A+Ty1QACgNwBcvlqAAFA7gC5fDWAACB3gFy+GkAAkDtALl8NIADIHSCXrwYQAOQOkMtXAwgAcgfI5asBBAC5A+Ty1QACgNwBcvlqAAFA7gC5fDWAACB3gFy+GkAAkDtALl8NIADIHSCXD90Ax+frmSmLV5WpHhhj3o/H49PF/sMfyJmdXHy/tynLl6aqnpnCfC6r6vT5/NEF6sywAByvvj2tqurkH+Mux+PxAhWCq/A3m3rm+9tzF0WxWM6mp4gQQAJwS/iNf5AQ3BZ+MzQqBHAAtIQPCUFb+MgQQAFwePZ1f2SK845VCdEEXcP/C8HIzJeP91YdNXpfBgXA0Wr90VTmhYXqqBDYhl/rKkxxtpxPn1ho9LoUC4Cz9U9jzF1LxVEg6BP+ta5fB/O9O5YavS2HAuDw05e3o9HoTQ+1QSEYEL4xRfHuYDZ93UOjl7dAATDIWGOCQJDCjDakQAFQD45sMPJsNqHvfEfR940+34doNOJMLjKAa4BGFJLhSLO4CB2+AZAgyDn8P6el4K+YAcQ8dqhY4AGI9Y8hQ/hJNECMjwOW8JMCIFQTMIWfHAC+IWALP0kAfEHAGH6yALiGgDX8pAFwBUG9z02XcXU8DQvy+0PHWXotS+I08H/Khv71Xu+9cw1fRyeTDz/5BnB0itgx751lWYSfDQAOPg5sIMgm/KwACARBVuFnB4BnCLILP0sAPEGQZfjZAuAYgmzDzxoARxBkHb4AaP/fXwC0e4S5YuAXRNuisoYg+W8Cb8LPYfjN9tlCkB0AHsLPGoKsAPAYfrYQZANAgPCzhCALAAKGnx0EyQMwMPxL/RyMeRbXaaqh4df3G6oPpAtCOtmNtchF+M3NplzuheVS+zRJfgT4CMzHnu32x1+RHAA+g/K5d/yob54gKQBCBBTiGEgwJANAyGBCHis2DEkAECOQGMeMAQM8ADGDiHnsUDBAA4AQAMIMPmGABQDJeKRZXMMACQCi4YgzuYABDgBko5Fn6wsDFAApGJzCjDYwQAGgW8XaROdmLRQAR7pZtJtULXbBAkC3i7eIzs1SKAD0wAg3odrsAgVAPbgeGWMT3/C1cAB0gADyGv22swM9NMoSVj02ztKwnsshG6DRsv3gyLIsP0wmkxPUZwY2M181gR4c2RNHvS24A9ANENwNwgMKAMLQtyULAAFA7gC5fDWAACB3gFy+GkAAkDtALl8NIADIHSCXrwYQAOQOkMtXAwgAcgfI5asBBAC5A+Ty1QACgNwBcvlqAAFA7gC5fDWAACB3gFy+GkAAkDtALl8NIADIHSCXrwYQAOQOkMtXAwgAcgfI5asBBAC5A+Ty1QACgNwBcvm/Ac4TZ67pucrUAAAAAElFTkSuQmCC")
        `
        closeBtn.classList.add("hover")
        closeBtn.addEventListener("click", function() {
            removePopup()
        })
        popup.appendChild(closeBtn)
        rootElement.appendChild(popup)

        const start = performance.now();
        const interval = setInterval(function() {
            const elapsed = performance.now() - start;
            const progress = elapsed / 300; // 动画持续时间为500ms

            popup.style.opacity = progress;
            popup.style.transform = `translate(-50%, -${100 - progress * 100}%)`;

            if (progress >= 1) {
                clearInterval(interval);
            }
        }, 10);
    }

    if (window.self === window.top) { // 判断当前窗口是否处于顶层
        createStyle()
        createPanel()
        document.getElementById("start-button").addEventListener("click", () => {
            if (!window.EyeDropper) {
                return;
            }
            const eyeDropper = new window.EyeDropper();
            eyeDropper
                .open()
                .then((result) => {
                createResult(result)
                // textCopy(result.sRGBHex, true)
            })
                .catch((e) => {
            });
        });

        new MutationObserver(function(){
            var btn = window.document.getElementById("start-button")
            if(!btn) {
                rootElement.appendChild(panel)
            }
        }).observe(rootElement, {attributes: true})

        rootElement.addEventListener("click", function(e){
            if(e.target.dataset.flag !== "pop" && popup){ // 点击空白地方关闭popup
                removePopup()
            }
        })
    }
})();