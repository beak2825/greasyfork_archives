/* eslint-disable */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.mzLibMenu = factory());
})(this, (function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = "/** mturco/context-menu: A small JavaScript library for adding context menus to any HTML element **/\n/** https://github.com/mturco/context-menu **/\n.mzLibMenu {\n  list-style: none;\n  display: none;\n  max-width: 250px;\n  min-width: 125px;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  padding: 2px 0;\n}\n.mzLibMenu--theme-default {\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);\n  font-size: 13px;\n  outline: 0;\n}\n.mzLibMenu--theme-default .mzLibMenu-item {\n  padding: 6px 12px;\n}\n.mzLibMenu--theme-default .mzLibMenu-item:hover,\n.mzLibMenu--theme-default .mzLibMenu-item:focus {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.mzLibMenu--theme-default .mzLibMenu-item:focus {\n  outline: 0;\n}\n.mzLibMenu--theme-default .mzLibMenu-divider {\n  background-color: rgba(0, 0, 0, 0.15);\n}\n.mzLibMenu.is-open {\n  display: block;\n}\n.mzLibMenu-item {\n  cursor: pointer;\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.mzLibMenu-divider {\n  height: 1px;\n  margin: 4px 0;\n}\n";
  styleInject(css_248z);

  // mturco/context-menu: A small JavaScript library for adding context menus to any HTML element
  // https://github.com/mturco/context-menu

  // Fires custom event on given element
  function emit(el, type, data = {}) {
    const event = new CustomEvent(type, {
      detail: data,
    });
    el.dispatchEvent(event);
  }

  class mzLibMenu {
    constructor({
      items = [],
      options = {
        className: "",
        minimalStyling: false,
      },
    }) {
      this.items = [...items, {
        name: "关闭（close）",
        fn(cls) {
          cls.hide();
        },
      }];
      this.options = options;
      this.create();
    }

    // Creates DOM elements, sets up event listeners
    create() {
      // Create the menu
      this.menu = document.createElement("ul");
      this.menu.className = "mzLibMenu";
      // Create the menu items
      this.items.forEach((item, index) => {
        const li = document.createElement("li");

        if (!("name" in item)) {
          // Insert a divider
          li.className = "mzLibMenu-divider";
        } else {
          li.className = "mzLibMenu-item";
          li.innerHTML = item.name;
          li.setAttribute("data-ItemIndex", index);
          li.addEventListener("click", this.select.bind(this, li));
        }
        this.menu.appendChild(li);
      });
      //
      if (!this.options.minimalStyling) {
        this.menu.classList.add("mzLibMenu--theme-default");
      }
      if (this.options.className) {
        this.options.className
          .split(" ")
          .forEach(cls => this.menu.classList.add(cls));
      }

      // Add root element to the <body>
      document.body.appendChild(this.menu);

      // 创建后绑定事件
      this.on("created", () => {
        // console.log(this.menu);
        const $menu = this.menu;
        // ctrl + m
        document.addEventListener("keydown", function (e) {
          if (e.ctrlKey && e.key === "m") {
            $menu.classList.toggle("is-open");
          }
        });
      });

      emit(this.menu, "created");
    }

    // Selects the given item and calls its handler
    select(item) {
      const itemId = item.getAttribute("data-ItemIndex");
      if (this.items[itemId]) {
        this.items[itemId].fn(this);
      }
      this.hide();
      emit(this.menu, "itemselected");
    }

    // hides the menu
    hide() {
      this.menu.classList.remove("is-open");
      emit(this.menu, "hidden");
    }

    // Convenience method for adding an event listener
    on(type, fn) {
      this.menu.addEventListener(type, fn);
    }

    // Convenience method for removing an event listener
    off(type, fn) {
      this.menu.removeEventListener(type, fn);
    }
  }

  return mzLibMenu;

}));
