// ==UserScript==
// @name         TemuMmsPropertyEditor
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  快速完善Temu的商品的缺失属性
// @author       Vace
// @license      MIT
// @match        https://seller.kuajingmaihuo.com/goods/product/list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/sweetalert/2.1.2/sweetalert.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/520906/TemuMmsPropertyEditor.user.js
// @updateURL https://update.greasyfork.org/scripts/520906/TemuMmsPropertyEditor.meta.js
// ==/UserScript==

(function() {
  function e() {
    var e;
    return !!(i = document.querySelector(".show-property-edit-drawer_container__3hhJI")) && (e = t(i.querySelector("form")), l = e.return.return, _ = function e(t, r) {
      if (!t) return null;
      var n = t.memoizedProps || [];
      var o = new Set(Object.keys(n));
      return r.every(function(e) {
        return o.has(e)
      }) ? t : e(t.return, r)
    }(l, ["data", "initTotal", "currentNum"]), v = _.return, !!_) && (t(i.querySelector(".Spn_nested_5-113-0")).return, f || ((f = document.createElement("div")).style.display = "flex", f.style.justifyContent = "center", f.style.marginTop = "20px", f.style.padding = "10px", f.style.gap = "10px"), n(), r(), !0)
  }

  function t(e) {
    return e[Object.keys(e).find(function(e) {
      return e.startsWith("__reactFiber$")
    })]
  }

  function r() {
    f.innerHTML = "", i.appendChild(f);
    var e = document.createElement("button");
    e.textContent = "保存属性线索", e.className = "BTN_outerWrapper_5-113-0 BTN_gray_5-113-0 BTN_medium_5-113-0 BTN_outerWrapperBtn_5-113-0", e.onclick = function() {
      var e, t, r;
      e = C.category, t = function() {
        var t = C.form;
        return t.getFields().map(function(e) {
          return {
            name: e,
            value: t.getFieldValue(e)
          }
        })
      }(), r = "0_@VACE_".concat(e.catId), t = JSON.stringify({
        values: t,
        category: e
      }), localStorage.setItem(r, t), c("提示", "属性线索已保存。", "success")
    }, (p = document.createElement("button")).textContent = s ? "停止运行" : "自动运行", p.className = "BTN_outerWrapper_5-113-0 BTN_primary_5-113-0 BTN_medium_5-113-0 BTN_outerWrapperBtn_5-113-0", p.onclick = function() {
      s ? (u(), p.textContent = "开启自动提交") : (a(), p.textContent = "停止自动提交")
    }, f.appendChild(e), f.appendChild(p)
  }

  function n() {
    var e, t = C.category,
      r = C.form,
      t = "0_@VACE_".concat(t.catId),
      t = localStorage.getItem(t);
    return !!t && (e = (t = JSON.parse(t)).values, t.category, !!Array.isArray(e)) && (e.forEach(function(e) {
      var t = e.name,
        e = e.value;
      r.setFieldValue(t, e)
    }), !0)
  }

  function o() {
    n() ? setTimeout(function() {
      var e = C.form.getErrors();
      Object.keys(e).length ? console.error("Errors:", e) : (m = !0, C.form.submit().then(function() {
        d = C.product.productId
      }).finally(function() {
        m = !1
      }))
    }, 300) : (u(), c("提示", "未找到分类 ".concat(C.category.catName, " 的线索数据，请先手动保存一次，再重新点击开始。"), "warning"))
  }

  function a() {
    s = !0, clearInterval(g), g = setInterval(function() {
      C.loading || C.product.productId !== d && (e(), o())
    }, 1e3), r()
  }

  function u() {
    s = !1, clearInterval(g), r()
  }
  var c, i, l, d, s, m, f, p, g, _, v, y, N, C;
  c = window.swal, m = s = !1, v = _ = g = p = f = d = l = i = null, y = "memoizedProps", N = "memoizedState", C = {
    get form() {
      var e;
      return null == (e = l) || null == (e = e[y]) ? void 0 : e.value
    },
    get product() {
      var e;
      return null == (e = _) || null == (e = e[N]) ? void 0 : e[N]
    },
    get ctrl() {
      var e;
      return null == (e = v) || null == (e = e[y]) ? void 0 : e.value.form
    },
    get category() {
      for (var e, t = (null == (e = C.product) ? void 0 : e.categories) || [], r = 10; 0 < r; r--)
        if (t["cat".concat(r)]) return t["cat".concat(r)];
      return null
    },
    get loading() {
      return m || !!i.querySelector(".Spn_spinning_5-113-0")
    }
  }, GM_registerMenuCommand("启动自动任务", function() {
    e() ? s ? c("提示", "自动任务已经在运行中，请勿重复操作。", "warning") : a() : c("提示", "未找到属性编辑区域，请先进入商品编辑页。", "warning")
  }), GM_registerMenuCommand("停止自动任务", function() {
    u(), c("提示", "自动任务已停止。", "info")
  })
})();