// ==UserScript==
// @name               geezer-hmdyp
// @namespace          aidacafe
// @version            1.1.1
// @author             1shin
// @description:zh-CN  算算你给完美爆了多少金币。
// @description:en-US  Calculate how much did you paid for PerfectWorldGame.
// @license            MIT License
// @icon               https://api.iconify.design/cryptocurrency-color:btc.svg
// @match              https://i.laohu.com/billing/chargeDetailRecord*
// @match              https://id.wanmei.com/billing/chargeDetailRecord*
// @require            https://registry.npmmirror.com/preact/10.19.3/files/dist/preact.min.js
// @require            https://registry.npmmirror.com/write-excel-file/1.4.30/files/bundle/write-excel-file.min.js
// @grant              GM_addStyle
// @contributionURL    https://github.com/AidaCafe/geezer-hmdyp
// @description Calculate how much did you paid for PerfectWorldGame.
// @downloadURL https://update.greasyfork.org/scripts/484683/geezer-hmdyp.user.js
// @updateURL https://update.greasyfork.org/scripts/484683/geezer-hmdyp.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(' .calcBtnGroup{display:inline-flex;max-width:max-content;max-height:max-content;border:2px solid #ff6960;border-radius:8px}.calcBtnGroup button{border:none;padding:8px;color:#ff6960;background-color:transparent}.calcBtnGroup button svg{vertical-align:middle}.calcBtnGroup button:hover{background-color:#ff6960;color:#f0f8ff}.calcBtnGroup button:last-child{border-right:none}.calcBtnGroup button:not(:last-child){border-right:2px solid #ff6960}.reportTriggerBtn{display:relative;border:2px solid #ff6960;color:#ff6960;background-color:#fff;border-radius:8px;padding:8px}.reportTriggerBtn svg{vertical-align:middle}.reportPanel{display:flex;position:absolute;border-radius:12px;background-color:#fefefe;box-shadow:2px 2px 5px #bfbfbf;padding:42px 32px;right:3px;top:170px;flex-direction:row;max-height:max-content}.reportPanel_hide{display:none}.reportPanelData{flex-direction:row}.reportPanelStats{margin-left:20px;min-width:180px}.statsPanel{position:absolute;border-radius:8px;background-color:#fefefe;box-shadow:2px 2px 5px #bfbfbf;padding:12px 24px;bottom:16px;right:16px}.statsPanel li{line-height:1.6}.floatingButtons{position:absolute;max-width:max-content;top:16px;right:16px}.floatingButtons button{margin-left:8px;padding:8px;border:none;border-radius:8px;background-color:#fefefe;box-shadow:2px 2px 5px #bfbfbf}.reportTable{overflow:scroll;max-height:320px;max-width:455px;background-color:transparent}.reportTable th,.reportTable td{padding:2px 18px;border-top-width:0;border-left-width:0;white-space:nowrap}.reportTable td{border-bottom:1px solid #424242}.reportTable th:nth-last-child(1),.reportTable th:nth-last-child(2),.reportTable td:nth-last-child(1),.reportTable td:nth-last-child(2){text-align:center;padding:4px}.reportTable thead{position:sticky;top:0;background-color:#fefefea1;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:0 .5px 8px #bfbfbf}.dateTimeRange{display:flex;max-width:max-content;border:2px solid gray;border-radius:8px;padding:12px}.dateTimeRange input[type=datetime-local]{border:none;background-color:transparent}.dateTimeRange input[type=datetime-local]:first-child:after{content:"~";padding-left:12px;padding-right:12px}.hmdyp{display:inline-flex;flex-direction:row}.hmdyp>*{margin-left:8px} ');

(function (preact, writeXlsxFile) {
  'use strict';

  var f$1 = 0;
  function u$1(e2, t2, n, o2, i2, u2) {
    var a2, c2, p = {};
    for (c2 in t2)
      "ref" == c2 ? a2 = t2[c2] : p[c2] = t2[c2];
    var l2 = { type: e2, props: p, key: n, ref: a2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --f$1, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a2 = e2.defaultProps))
      for (c2 in a2)
        void 0 === p[c2] && (p[c2] = a2[c2]);
    return preact.options.vnode && preact.options.vnode(l2), l2;
  }
  function SvgSpinners180RingWithBg(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "currentColor",
              d: "M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z",
              opacity: ".25"
            }
          ),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "currentColor",
              d: "M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z",
              children: /* @__PURE__ */ u$1(
                "animateTransform",
                {
                  attributeName: "transform",
                  dur: "0.75s",
                  repeatCount: "indefinite",
                  type: "rotate",
                  values: "0 12 12;360 12 12"
                }
              )
            }
          )
        ]
      }
    );
  }
  function CryptocurrencyColorBtc(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 32 32",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1("g", { fill: "none", fillRule: "evenodd", children: [
            /* @__PURE__ */ u$1("circle", { cx: "16", cy: "16", r: "16", fill: "#F7931A" }),
            /* @__PURE__ */ u$1(
              "path",
              {
                fill: "#FFF",
                fillRule: "nonzero",
                d: "M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84l-1.728-.43l-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009l-2.384-.595l-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045l-1.13 4.532c-.086.212-.303.531-.793.41c.018.025-1.256-.313-1.256-.313l-.858 1.978l2.25.561c.418.105.828.215 1.231.318l-.715 2.872l1.727.43l.708-2.84c.472.127.93.245 1.378.357l-.706 2.828l1.728.43l.715-2.866c2.948.558 5.164.333 6.097-2.333c.752-2.146-.037-3.385-1.588-4.192c1.13-.26 1.98-1.003 2.207-2.538m-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11m.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733"
              }
            )
          ] })
        ]
      }
    );
  }
  function RiLineChartLine(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "currentColor",
              d: "M5 3v16h16v2H3V3zm15.293 3.293l1.414 1.414L16 13.414l-3-2.999l-4.293 4.292l-1.414-1.414L13 7.586l3 2.999z"
            }
          )
        ]
      }
    );
  }
  function RiSettingsLine(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "currentColor",
              d: "m12 1l9.5 5.5v11L12 23l-9.5-5.5v-11zm0 2.311L4.5 7.653v8.694l7.5 4.342l7.5-4.342V7.653zM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8m0-2a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
            }
          )
        ]
      }
    );
  }
  function RiWechatPayFill(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "#22ac38",
              d: "M9.271 14.669a.661.661 0 0 1-.88-.269l-.043-.095l-1.818-3.998a.473.473 0 0 1 0-.146a.327.327 0 0 1 .335-.327a.305.305 0 0 1 .196.066l2.18 1.527a.988.988 0 0 0 .546.167a.894.894 0 0 0 .342-.066l10.047-4.5a10.73 10.73 0 0 0-8.171-3.526C6.479 3.502 2 7.232 2 11.87a7.83 7.83 0 0 0 3.46 6.296a.662.662 0 0 1 .24.727l-.45 1.701a.945.945 0 0 0-.051.24a.327.327 0 0 0 .334.334a.416.416 0 0 0 .19-.058l2.18-1.265c.16-.098.343-.151.53-.152c.1 0 .198.014.292.043c1.062.3 2.16.452 3.264.45c5.525 0 10.011-3.729 10.011-8.33a7.228 7.228 0 0 0-1.098-3.883L9.351 14.625z"
            }
          )
        ]
      }
    );
  }
  function RiAlipayFill(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "#027aff",
              d: "M21.422 15.358c-3.83-1.153-6.055-1.84-6.678-2.062a12.41 12.41 0 0 0 1.32-3.32H12.8V8.872h4v-.68h-4V6.344h-1.536c-.28 0-.312.248-.312.248v1.592H7.2v.68h3.752v1.104H7.88v.616h6.224a10.972 10.972 0 0 1-.888 2.176c-1.408-.464-2.192-.784-3.912-.944c-3.256-.312-4.008 1.48-4.128 2.576C5 16.064 6.48 17.424 8.688 17.424s3.68-1.024 5.08-2.72c1.167.558 3.338 1.525 6.514 2.902A9.99 9.99 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10a9.983 9.983 0 0 1-.578 3.358m-12.99 1.01c-2.336 0-2.704-1.48-2.584-2.096c.12-.616.8-1.416 2.104-1.416c1.496 0 2.832.384 4.44 1.16c-1.136 1.48-2.52 2.352-3.96 2.352"
            }
          )
        ]
      }
    );
  }
  function RiCheckboxCircleFill(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "#81c784",
              d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-.997-6l7.07-7.071l-1.413-1.414l-5.657 5.657l-2.829-2.829l-1.414 1.414z"
            }
          )
        ]
      }
    );
  }
  function RiErrorWarningFill(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "#e57373",
              d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-1-7v2h2v-2zm0-8v6h2V7z"
            }
          )
        ]
      }
    );
  }
  function RiQuestionFill(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "currentColor",
              d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-1-7v2h2v-2zm2-1.645A3.502 3.502 0 0 0 12 6.5a3.501 3.501 0 0 0-3.433 2.813l1.962.393A1.5 1.5 0 1 1 12 11.5a1 1 0 0 0-1 1V14h2z"
            }
          )
        ]
      }
    );
  }
  function TablerTableDown(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "none",
              stroke: "currentColor",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: "M12.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7.5M3 10h18M10 3v18m9-5v6m3-3l-3 3l-3-3"
            }
          )
        ]
      }
    );
  }
  function RiRefreshLine(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: [
          props.title && /* @__PURE__ */ u$1("title", { children: props.title }),
          /* @__PURE__ */ u$1(
            "path",
            {
              fill: "currentColor",
              d: "M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772z"
            }
          )
        ]
      }
    );
  }
  function RiAppStoreLine(props) {
    return /* @__PURE__ */ u$1(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
        ...props,
        children: /* @__PURE__ */ u$1(
          "path",
          {
            fill: "currentColor",
            d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16M8.823 15.343l-.79 1.37a.823.823 0 1 1-1.428-.822l.589-1.016q.989-.307 1.629.468M13.21 8.66l2.423 4.194h2.141a.82.82 0 0 1 .823.822a.82.82 0 0 1-.823.823h-1.19l.803 1.391a.824.824 0 0 1-1.427.823l-3.04-5.266c-.69-1.19-.198-2.383.29-2.787m.278-3.044c.395.226.528.73.302 1.125l-3.528 6.109h2.553c.826 0 1.29.972.931 1.645h-7.48a.82.82 0 0 1-.822-.823a.82.82 0 0 1 .822-.822h2.097l2.685-4.653l-.838-1.456a.824.824 0 0 1 1.427-.823l.359.633l.367-.633a.823.823 0 0 1 1.125-.302"
          }
        )
      }
    );
  }
  const CalcButton = (props) => {
    let childs = preact.toChildArray(props.children);
    if (props.isLoading) {
      if (childs.length > 0 && preact.isValidElement(childs[0])) {
        childs = [/* @__PURE__ */ u$1(SvgSpinners180RingWithBg, {})];
      } else {
        childs.unshift(/* @__PURE__ */ u$1(SvgSpinners180RingWithBg, {}));
      }
    }
    return /* @__PURE__ */ u$1("button", { type: props.type ?? "button", ...props, children: childs });
  };
  CalcButton.Group = (props) => {
    return /* @__PURE__ */ u$1("div", { className: "calcBtnGroup", ...props });
  };
  const PaymentMethod = ({ method }) => {
    switch (method) {
      case "支付宝":
      case "支付宝扫码":
        return /* @__PURE__ */ u$1(RiAlipayFill, { title: "支付宝" });
      case "微信":
      case "微信扫码":
        return /* @__PURE__ */ u$1(RiWechatPayFill, { title: "微信支付" });
      case "苹果IAP":
        return /* @__PURE__ */ u$1(RiAppStoreLine, { title: "苹果IAP" });
      default:
        return /* @__PURE__ */ u$1(RiQuestionFill, { title: method });
    }
  };
  const ReportTable = (props) => {
    var _a;
    return /* @__PURE__ */ u$1("div", { className: "reportTable", children: /* @__PURE__ */ u$1("table", { children: [
      /* @__PURE__ */ u$1("thead", { children: /* @__PURE__ */ u$1("tr", { children: [
        /* @__PURE__ */ u$1("th", { children: "时间" }),
        /* @__PURE__ */ u$1("th", { children: "游戏" }),
        /* @__PURE__ */ u$1("th", { children: "订单号" }),
        /* @__PURE__ */ u$1("th", { children: "价格" }),
        /* @__PURE__ */ u$1("th", { children: "支付状态" })
      ] }) }),
      /* @__PURE__ */ u$1("tbody", { children: (_a = props.data) == null ? void 0 : _a.map((charge) => /* @__PURE__ */ u$1("tr", { children: [
        /* @__PURE__ */ u$1("td", { children: charge.time }),
        /* @__PURE__ */ u$1("td", { children: charge.game }),
        /* @__PURE__ */ u$1("td", { children: charge.orderId }),
        /* @__PURE__ */ u$1("td", { children: charge.price }),
        /* @__PURE__ */ u$1("td", { children: [
          /* @__PURE__ */ u$1(PaymentMethod, { method: charge.paymentMethod }),
          " ",
          charge.status ? /* @__PURE__ */ u$1(RiCheckboxCircleFill, {}) : /* @__PURE__ */ u$1(RiErrorWarningFill, {})
        ] })
      ] }, charge.orderId)) })
    ] }) });
  };
  var t, r, u, i, o = 0, f = [], c = [], e = preact.options.__b, a = preact.options.__r, v = preact.options.diffed, l = preact.options.__c, m = preact.options.unmount;
  function d(t2, u2) {
    preact.options.__h && preact.options.__h(r, t2, o || u2), o = 0;
    var i2 = r.__H || (r.__H = { __: [], __h: [] });
    return t2 >= i2.__.length && i2.__.push({ __V: c }), i2.__[t2];
  }
  function h(n) {
    return o = 1, s(B, n);
  }
  function s(n, u2, i2) {
    var o2 = d(t++, 2);
    if (o2.t = n, !o2.__c && (o2.__ = [i2 ? i2(u2) : B(void 0, u2), function(n2) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n2);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r, !r.u)) {
      var f2 = function(n2, t2, r2) {
        if (!o2.__c.__H)
          return true;
        var u3 = o2.__c.__H.__.filter(function(n3) {
          return n3.__c;
        });
        if (u3.every(function(n3) {
          return !n3.__N;
        }))
          return !c2 || c2.call(this, n2, t2, r2);
        var i3 = false;
        return u3.forEach(function(n3) {
          if (n3.__N) {
            var t3 = n3.__[0];
            n3.__ = n3.__N, n3.__N = void 0, t3 !== n3.__[0] && (i3 = true);
          }
        }), !(!i3 && o2.__c.props === n2) && (!c2 || c2.call(this, n2, t2, r2));
      };
      r.u = true;
      var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
      r.componentWillUpdate = function(n2, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n2, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n2, t2, r2);
      }, r.shouldComponentUpdate = f2;
    }
    return o2.__N || o2.__;
  }
  function b() {
    for (var t2; t2 = f.shift(); )
      if (t2.__P && t2.__H)
        try {
          t2.__H.__h.forEach(k), t2.__H.__h.forEach(w), t2.__H.__h = [];
        } catch (r2) {
          t2.__H.__h = [], preact.options.__e(r2, t2.__v);
        }
  }
  preact.options.__b = function(n) {
    r = null, e && e(n);
  }, preact.options.__r = function(n) {
    a && a(n), t = 0;
    var i2 = (r = n.__c).__H;
    i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n2) {
      n2.__N && (n2.__ = n2.__N), n2.__V = c, n2.__N = n2.i = void 0;
    })) : (i2.__h.forEach(k), i2.__h.forEach(w), i2.__h = [], t = 0)), u = r;
  }, preact.options.diffed = function(t2) {
    v && v(t2);
    var o2 = t2.__c;
    o2 && o2.__H && (o2.__H.__h.length && (1 !== f.push(o2) && i === preact.options.requestAnimationFrame || ((i = preact.options.requestAnimationFrame) || j)(b)), o2.__H.__.forEach(function(n) {
      n.i && (n.__H = n.i), n.__V !== c && (n.__ = n.__V), n.i = void 0, n.__V = c;
    })), u = r = null;
  }, preact.options.__c = function(t2, r2) {
    r2.some(function(t3) {
      try {
        t3.__h.forEach(k), t3.__h = t3.__h.filter(function(n) {
          return !n.__ || w(n);
        });
      } catch (u2) {
        r2.some(function(n) {
          n.__h && (n.__h = []);
        }), r2 = [], preact.options.__e(u2, t3.__v);
      }
    }), l && l(t2, r2);
  }, preact.options.unmount = function(t2) {
    m && m(t2);
    var r2, u2 = t2.__c;
    u2 && u2.__H && (u2.__H.__.forEach(function(n) {
      try {
        k(n);
      } catch (n2) {
        r2 = n2;
      }
    }), u2.__H = void 0, r2 && preact.options.__e(r2, u2.__v));
  };
  var g = "function" == typeof requestAnimationFrame;
  function j(n) {
    var t2, r2 = function() {
      clearTimeout(u2), g && cancelAnimationFrame(t2), setTimeout(n);
    }, u2 = setTimeout(r2, 100);
    g && (t2 = requestAnimationFrame(r2));
  }
  function k(n) {
    var t2 = r, u2 = n.__c;
    "function" == typeof u2 && (n.__c = void 0, u2()), r = t2;
  }
  function w(n) {
    var t2 = r;
    n.__c = n.__(), r = t2;
  }
  function B(n, t2) {
    return "function" == typeof t2 ? t2(n) : t2;
  }
  const DateTimeRangePicker = (props) => {
    const [timeStart, setTimeStart] = h(props.start ?? /* @__PURE__ */ new Date());
    const [timeEnd, setTimeEnd] = h(props.end ?? /* @__PURE__ */ new Date());
    return /* @__PURE__ */ u$1("div", { className: "dateTimeRange", children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "datetime-local",
          max: props.end && (timeEnd < props.end ? timeEnd : props.end).toISOString().slice(0, -8),
          value: timeStart.toISOString().slice(0, -8),
          onChange: (e2) => setTimeStart(new Date(e2.target.value))
        }
      ),
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "datetime-local",
          min: props.start && (timeStart > props.start ? timeStart : props.start).toISOString().slice(0, -8),
          value: timeEnd.toISOString().slice(0, -8),
          onChange: (e2) => setTimeEnd(new Date(e2.target.value))
        }
      )
    ] });
  };
  const ReportForm = (props) => {
    var _a, _b;
    const [isShow, setShowState] = h(false);
    const handleXlsx = () => {
      const schema = [
        {
          column: "时间",
          type: String,
          width: 16.8,
          value: (c2) => c2.time
        },
        {
          column: "游戏",
          type: String,
          width: 10,
          value: (c2) => c2.game
        },
        {
          column: "订单号",
          type: Number,
          width: 10,
          value: (c2) => c2.orderId
        },
        {
          column: "价格",
          type: Number,
          value: (c2) => c2.price
        },
        {
          column: "支付方式",
          type: String,
          value: (c2) => c2.paymentMethod
        },
        {
          column: "支付状态",
          type: Boolean,
          value: (c2) => c2.status
        }
      ];
      if (props.data) {
        writeXlsxFile(props.data, { schema, fileName: `PW_ChargeAnalysis-${Date.now()}.xlsx` });
      }
    };
    return /* @__PURE__ */ u$1(preact.Fragment, { children: [
      /* @__PURE__ */ u$1(
        "button",
        {
          title: "显示报表",
          type: "button",
          className: "reportTriggerBtn",
          onClick: () => {
            setShowState(!isShow);
          },
          children: /* @__PURE__ */ u$1(RiLineChartLine, {})
        }
      ),
      /* @__PURE__ */ u$1("div", { className: `reportPanel${isShow ? "" : "_hide"}`, children: [
        /* @__PURE__ */ u$1("div", { className: "reportPanelData", children: [
          /* @__PURE__ */ u$1(DateTimeRangePicker, { start: /* @__PURE__ */ new Date("2023-12-1") }),
          /* @__PURE__ */ u$1(ReportTable, { data: props.data })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "reportPanelStats", children: /* @__PURE__ */ u$1("h1", { children: "Title" }) }),
        /* @__PURE__ */ u$1("div", { className: "statsPanel", children: /* @__PURE__ */ u$1("ul", { children: [
          /* @__PURE__ */ u$1("li", { children: [
            /* @__PURE__ */ u$1("strong", { children: "总计: " }),
            (_a = props.data) == null ? void 0 : _a.reduce((j2, k2) => j2 + k2.price, 0)
          ] }),
          /* @__PURE__ */ u$1("li", { children: [
            /* @__PURE__ */ u$1("strong", { children: "最贵一笔: " }),
            (_b = props.data) == null ? void 0 : _b.reduce(
              (max, item) => item.price > max ? item.price : max,
              0
            )
          ] })
        ] }) }),
        /* @__PURE__ */ u$1("div", { className: "floatingButtons", children: [
          /* @__PURE__ */ u$1("button", { type: "button", title: "刷新", children: /* @__PURE__ */ u$1(RiRefreshLine, {}) }),
          /* @__PURE__ */ u$1("button", { type: "button", title: "下载表格", onClick: handleXlsx, children: /* @__PURE__ */ u$1(TablerTableDown, {}) }),
          /* @__PURE__ */ u$1("button", { type: "button", title: "打开设置", children: /* @__PURE__ */ u$1(RiSettingsLine, {}) })
        ] })
      ] })
    ] });
  };
  function App() {
    var _a, _b, _c;
    const lastPage = parseInt(
      (_c = (_b = (_a = document.querySelector(".fansPage.mt30")) == null ? void 0 : _a.lastChild) == null ? void 0 : _b.previousSibling) == null ? void 0 : _c.textContent
    );
    const [data, setData] = h([]);
    const [loadingState, setLoadingState] = h(false);
    const fetchChargeHist = async () => {
      try {
        const fetchPromises = Array.from({ length: lastPage }, async (_, i2) => {
          const response = await fetch(
            `https://${window.location.host}/billing/chargeDetailRecord/-1/-1/1/${i2 + 1}`,
            { credentials: "include" }
          );
          if (!response.ok) {
            throw new Error(`请求数据出错: ${response.statusText}`);
          }
          const responseText = await response.text();
          const doc = new DOMParser().parseFromString(responseText, "text/html");
          const paidHistTable = Array.from(
            doc.querySelectorAll(
              "#mainWrap > div > div.fr.w705 > div.t.f12.mt30 > table > tbody tr"
            )
          );
          let currentPrice = 0;
          paidHistTable.forEach((row) => {
            const [time, game, orderIdStr, priceStr, paymentMethod, statusText] = Array.from(row.querySelectorAll("td")).map(
              (td) => {
                var _a2;
                return (_a2 = td.textContent) == null ? void 0 : _a2.trim();
              }
            );
            const orderId = parseInt(orderIdStr);
            const price = parseInt(priceStr.slice(1));
            const status = statusText === "付款成功" ? true : false;
            data.push({ time, game, orderId, price, paymentMethod, status });
            currentPrice += price;
          });
          console.log(`第${i2 + 1}页 爆了 ${currentPrice} 金币`);
        });
        await Promise.all(fetchPromises);
      } catch (error) {
        console.error("请求数据出错:", error);
        throw error;
      }
    };
    return /* @__PURE__ */ u$1("div", { className: "hmdyp", children: [
      /* @__PURE__ */ u$1(CalcButton.Group, { children: [
        /* @__PURE__ */ u$1(
          CalcButton,
          {
            title: "简单计算",
            onClick: async () => {
              if (data.length === 0) {
                setLoadingState(true);
                fetchChargeHist().then(() => console.log(data)).then(() => setLoadingState(false));
              } else {
                console.log(data);
              }
            },
            isLoading: loadingState,
            children: /* @__PURE__ */ u$1(CryptocurrencyColorBtc, {})
          }
        ),
        /* @__PURE__ */ u$1(CalcButton, { isLoading: loadingState, children: "金币爆几何？" })
      ] }),
      data.length ? /* @__PURE__ */ u$1(ReportForm, { data }) : void 0
    ] });
  }
  const serPayBox = document.querySelector(".serPayBox.f12.cl");
  const calcMain = document.createElement("div");
  serPayBox == null ? void 0 : serPayBox.appendChild(calcMain);
  preact.render(/* @__PURE__ */ u$1(App, {}), calcMain);

})(preact, writeXlsxFile);