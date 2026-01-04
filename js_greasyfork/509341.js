// ==UserScript==
// @name         垃圾 Coze 卡的要屎
// @namespace    https://github.com/Ocyss
// @version      2024-09-19
// @description  依托
// @author       Ocyss_04
// @run-at       document-start
// @match        https://www.coze.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coze.cn
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/509341/%E5%9E%83%E5%9C%BE%20Coze%20%E5%8D%A1%E7%9A%84%E8%A6%81%E5%B1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/509341/%E5%9E%83%E5%9C%BE%20Coze%20%E5%8D%A1%E7%9A%84%E8%A6%81%E5%B1%8E.meta.js
// ==/UserScript==

function cleanup(elem, typs) {
  const removeListener = (t) => {
    if (!typs || typs.includes(typeof t === "string" ? t.slice(2) : t.typ)) {
      elem[t] = null;
      elem.removeEventListener?.(
        typeof t === "string" ? t.slice(2) : t.typ,
        t.fn,
        t.opt
      );
      console.log(
        "已移除监听器:",
        elem.nodeName,
        typeof t === "string" ? t.slice(2) : t.typ
      );
    }
  };

  Object.keys(elem)
    .filter((t) => t.startsWith("on"))
    .forEach(removeListener);
  (elem.all_handlers || []).forEach(removeListener);
}

(function () {
  // https://www.cnblogs.com/bxmm/p/18029900
  if (EventTarget.prototype.original_addEventListener == null) {
    EventTarget.prototype.original_addEventListener =
      EventTarget.prototype.addEventListener;
    function addEventListener_hook(typ, fn, opt) {
      // if (
      //   this.classList &&
      //   this.classList.contains("gedit-playground") &&
      //   (typ === "scroll" ||
      //     typ === "mousemove" ||
      //     typ === "mousedown" ||
      //     typ == "wheel")
      // ) {
      //   console.log("跳过添加事件监听器", this, typ);
      //   return;
      // }
      // console.log("--- add event listener", this.nodeName, typ);
      this.all_handlers = this.all_handlers || [];
      this.all_handlers.push({ typ, fn, opt });
      this.original_addEventListener(typ, fn, opt);
    }
    EventTarget.prototype.addEventListener = addEventListener_hook;
  }
  unsafeWindow.cleanup = cleanup;
  unsafeWindow.sbcoze = function sbcoze() {
    console.log("sbcoze start");
    const a = qe(".gedit-playground");
    const b = qe(".gedit-playground .gedit-playground-pipeline");

    // 清空 a 元素的事件监听器
    cleanup(a, ["scroll", "mousemove", "mousedown", "wheel"]);

    // 添加鼠标按下事件监听器
    a.addEventListener("mousedown", function (startEvent) {
      let startX = startEvent.clientX;
      let startY = startEvent.clientY;
      let startTop = parseInt(window.getComputedStyle(b).top);
      let startLeft = parseInt(window.getComputedStyle(b).left);

      // 添加鼠标移动事件监听器
      function mouseMoveHandler(moveEvent) {
        let deltaX = moveEvent.clientX - startX;
        let deltaY = moveEvent.clientY - startY;

        // 更新 b 元素的位置
        b.style.top = startTop + deltaY + "px";
        b.style.left = startLeft + deltaX + "px";
      }

      // 添加鼠标松开事件监听器
      function mouseUpHandler() {
        // 移除鼠标移动和松开事件监听器
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      }

      // 添加鼠标移动和松开事件监听器
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    });

    // 添加鼠标滚轮事件监听器
    a.addEventListener("wheel", function (event) {
      // 阻止默认滚动行为
      event.preventDefault();

      // 获取当前缩放比例
      let currentScale = parseFloat(
        b.style.transform.replace("scale(", "").replace(")", "") || 1
      );

      // 根据滚轮方向调整缩放比例
      if (event.deltaY < 0) {
        // 向上滚动，放大
        currentScale *= 1.1;
      } else {
        // 向下滚动，缩小
        currentScale /= 1.1;
      }

      // 限制缩放范围，例如在0.01到50之间
      currentScale = Math.max(0.01, Math.min(currentScale, 50));

      // 应用新的缩放比例
      b.style.transform = `scale(${currentScale})`;
    });
  };
})();
