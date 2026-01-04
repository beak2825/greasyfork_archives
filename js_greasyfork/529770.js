// ==UserScript==
// @name         show-starling-key
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Seller Center
// @author       @liuzexi
// @include      *://magellan-boe-*.bytedance.net/*
// @include      *://seller-*.tiktok.com/*
// @include      *://seller-id.tokopedia.com/*
// @include      *://seller.eu.tiktokglobalshop.com/*
// @include      *://seller.us.tiktokglobalshop.com/*
// @include      *://seller.tiktokglobalshop.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bytedance.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529770/show-starling-key.user.js
// @updateURL https://update.greasyfork.org/scripts/529770/show-starling-key.meta.js
// ==/UserScript==

function proxyMethod(originObject, methodName, proxyedMethod) {
  const proxyedObject = new Proxy(originObject, {
    get(target, prop, receiver) {
      if (methodName.includes(prop)) {
        return proxyedMethod;
      }
      return Reflect.get(...arguments);
    },
  });
  return proxyedObject;
}

https: (function () {
  "use strict";
  function start() {
    const React = Garfish.externals["react"];
    const reactI18n = Garfish.externals["@jupiter/plugin-runtime/i18n"];
    const ReactDOM = Garfish.externals["react-dom"];
    const ArcoDesign = Garfish.externals["@arco-design/web-react"];

    const storageKey = "dev_i18n_mode";

    const MODE = {
      DEFAULT: "0",
      SHOW_KEY: "1",
      SHOW_TITLE: "2",
    };

    function App() {
      const [mode, setMode] = React.useState(
        localStorage.getItem(storageKey) || MODE.DEFAULT
      );

      const returnKey = function (key, ...args) {
        const currentMode = localStorage.getItem(storageKey);

        if (currentMode === MODE.DEFAULT) {
          return reactI18n.i18n.t(key, ...args);
        } else if (currentMode === MODE.SHOW_KEY) {
          return key;
        } else {
          const comp = React.createElement(
            "span",
            { title: key },
            reactI18n.i18n.t(key, ...args)
          );
          comp.split = () => {
            return reactI18n.i18n.t(key, ...args).split();
          };
          return comp;
        }
      };

      React.useEffect(() => {
        const cachedMode = localStorage.getItem(storageKey);
        if (cachedMode !== mode) {
          localStorage.setItem(storageKey, mode);
        }
        reactI18n.i18n.changeLanguage(reactI18n.i18n.language);
      }, [mode]);

      function proxyI18n() {
        const proxyModule = new Proxy(reactI18n, {
          get(target, prop, receiver) {
            if (prop === "useTranslation") {
              const originalMethod = target[prop];
              return function (...args) {
                const result = originalMethod.apply(target, args);
                return proxyMethod(result, ["0", "t"], returnKey);
              };
            }
            if (prop === "i18n") {
              const originalI18n = target[prop];
              return proxyMethod(originalI18n, ["t"], returnKey);
            }
            return Reflect.get(...arguments);
          },
        });
        Garfish.externals["@jupiter/plugin-runtime/i18n"] = proxyModule;
      }
      React.useEffect(() => {
        proxyI18n();
        return () => {
          Garfish.externals["@jupiter/plugin-runtime/i18n"] = reactI18n;
        };
      }, []);

      return React.createElement(
        "div",
        {
          style: {
            position: "fixed",
            top: "3px",
            left: "120px",
            zIndex: 99999999,
          },
        },
        React.createElement(
          ArcoDesign.Badge,
          {
            dot: true,
            count: 1,
          },
          React.createElement(
            "div",
            {
              style: {
                padding: "4px",
                borderRadius: "4px",
                backgroundColor: "var(--color-neutral-4)",
              },
            },

            React.createElement(
              ArcoDesign.Radio.Group,
              {
                type: "button",
                size: "small",
                value: mode,
                onChange(v) {
                  setMode(v);
                },
              },
              React.createElement(
                ArcoDesign.Radio,
                { value: MODE.DEFAULT },
                "OFF"
              ),
              React.createElement(
                ArcoDesign.Radio,
                { value: MODE.SHOW_KEY },
                "Show Key"
              ),
              React.createElement(
                ArcoDesign.Tooltip,
                {
                  content:
                    "Hovering over text to show starlingKey. (It may cause the page to crash or display abnormally)",
                },
                React.createElement(
                  ArcoDesign.Radio,
                  { value: MODE.SHOW_TITLE },
                  "Hover"
                )
              )
            ),
            React.createElement(
              "div",
              { className: "text-body-s-regular text-neutral-text3" },
              "Please read ",
              React.createElement(
                "a",
                {
                  href: "https://bytedance.larkoffice.com/wiki/KtXowoakxiL1LQkoh8scpXfHnNf",
                  target: "_blank",
                  style: { color: "rgb(var(--theme-arco-primary-6))" },
                },
                "the doc."
              )
            )
          )
        )
      );
    }

    function renderToPage() {
      const container = document.createElement("div");
      document.body.appendChild(container);
      ReactDOM.render(React.createElement(App), container);
    }

    renderToPage();
  }

  Promise.resolve().then(() => {
    start();
  });
})();
