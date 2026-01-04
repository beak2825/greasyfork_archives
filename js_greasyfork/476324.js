// ==UserScript==
// @name                Web选择
// @name:en             Web Select
// @name:zh-TW          Web捕獲
// @namespace           http://howardzhangdqs.eu.org/
// @source              https://github.com/Howardzhangdqs/web-select
// @version             0.2.4
// @description         由于Web选择太好用，微软就把他砍掉了。本脚本实现了Web选择的部分功能。按下Alt+S即可选择文本。
// @description:en      Due to the ease with which the "web select" was used, Microsoft cut it off. This script implements some functions of "web select". Press Alt+S to select text.
// @description:zh-TW   由於Web選擇功能非常實用，微軟就將它砍掉了。本腳本實現了Web選擇的部分功能。按下Alt+S即可選擇文本。
// @author              HowardZhangdqs
// @match               *://*/*
// @license             MIT
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABsUExURf///xYWFgMDAw4ODgICAh8fHw4ODQAAAA8PD9LS0gEBAR4eHgcHBwoKCgUFBQgICCAgICgoKCwsLB0dHSQkJCYmJvv7+vr6+ZiYlyMjIhwcHJaWlBsbGxgYGAYGBnV2dfz9/BAQEHR0cw0NDWBB0hYAAAFaSURBVFjD7VbZkoMgEARBwNvNsfed///HAJoUq3Ga1a0tH+ynQXragWmtYWzDelEopXzQmgu+/Jorxe9gOtceNjI6gF2X14hC0ic8MZYPBIJwGqonlSzIsHhkkQpu/xlVqKa3D3b7QJ+RLqHAlyRIisICaqkAXYE9YYKMAijYaTGU/0dWu+4+eL9DcjOm1J1DZZQP2jFF6qtARBvNiJK65FxK+TlTwOWnfXyaIZDZB9UvnHhT4HWpQLoJ/KGANcUH/h98EwJzvsSVCST6HiUMKT8EWtyFguyCWdrGxQJHLKCRkYDCzv2+yC644cCY7r78eCOEEd2aC+OHjh3lg2CIGI44TTh8TBupZx0nRxyBnFi4xGYw4rxc1uVKv4U9JGW0M96xeQiFHLoPnNLNtm+LrknTFWIBrgGhQm/oBoSUfAF9S1IjIKdUIF9iO5FF8ChL7it5EzVnG1aMM5cYFmmzQuXPAAAAAElFTkSuQmCC
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/476324/Web%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/476324/Web%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(() => {
    var UnselectedBoxStyle = {
        border: "1px solid #fff",
        outline: "1px dashed #000",
        outlineOffset: "-1px",
        zIndex: "99999",
    };
    var SelectedBoxStyle = {
        border: "1px solid #fff",
        outline: "1px solid #000",
        outlineOffset: "0",
        zIndex: "99999",
    };
    var SelectBoxStyle = {
        position: "fixed",
        outline: "3px dashed white",
        zIndex: "99999",
    };
    var addStylesheetRules = function (dom, decls) {
        if (dom instanceof HTMLElement) dom = [dom];
        for (var i in decls) {
            for (var _i = 0, dom_1 = dom; _i < dom_1.length; _i++) {
                var j = dom_1[_i];
                j.style[i] = decls[i];
            }
        }
    };

    var makeButton = function (top, left) {
        var button = document.createElement("button");
        button.innerText = "Web选择";
        button.style.position = "fixed";
        if (top) button.style.top = "".concat(top, "px");
        else button.style.bottom = "10px";
        if (left) button.style.left = "".concat(left, "px");
        else button.style.right = "10px";
        button.style.zIndex = "99999";
        button.style.padding = "10px";
        button.style.borderRadius = "10px";
        button.style.background = "#fff";
        button.style.color = "#000";
        button.style.border = "1px solid #000";
        button.style.cursor = "pointer";

        document.body.appendChild(button);
        return button;
    };

    var getElementsPosition = function () {
        var elements = [];
        var allElements = document.querySelectorAll("*");
        allElements.forEach(function (element) {
            var _a = element.getBoundingClientRect(),
                top = _a.top,
                left = _a.left,
                width = _a.width,
                height = _a.height;
            if (top && left && width && height && element.innerText)
                elements.push({
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                    text: element.innerText,
                    src: element,
                });
        });
        return elements;
    };

    var makeDiv = function (_a) {
        var top = _a.top,
            left = _a.left,
            width = _a.width,
            height = _a.height,
            text = _a.text,
            src = _a.src;
        var div = document.createElement("div");
        div.style.position = "fixed";
        div.style.top = "".concat(top, "px");
        div.style.left = "".concat(left, "px");
        div.style.width = "".concat(width, "px");
        div.style.height = "".concat(height, "px");
        addStylesheetRules(div, UnselectedBoxStyle);
        div.style.zIndex = "99999";
        document.body.appendChild(div);
        return {
            top: top,
            left: left,
            width: width,
            height: height,
            text: text,
            el: div,
            src: src,
        };
    };

    var dragSelect = function (allBoxes) {
        return new Promise(function (resolve, reject) {
            var div = document.createElement("div");
            addStylesheetRules(div, SelectBoxStyle);
            document.body.appendChild(div);
            var mask = [];
            var selectedBox = {
                _p1: [0, 0],
                _p2: [0, 0],
                set p1(val) {
                    this._p1[0] = Math.floor(val[0]);
                    this._p1[1] = Math.floor(val[1]);
                    this.runwatch();
                },
                set p2(val) {
                    this._p2[0] = Math.floor(val[0]);
                    this._p2[1] = Math.floor(val[1]);
                    this.runwatch();
                },
                get p1() {
                    return this._p1;
                },
                get p2() {
                    return this._p2;
                },
                get top() {
                    return Math.min(this._p1[0], this._p2[0]);
                },
                get left() {
                    return Math.min(this._p1[1], this._p2[1]);
                },
                get width() {
                    return Math.abs(this._p1[1] - this._p2[1]);
                },
                get height() {
                    return Math.abs(this._p1[0] - this._p2[0]);
                },
                watchfn: [],
                watch: function (callback) {
                    this.watchfn.push(callback);
                },
                unwatch: function (callback) {
                    this.watchfn = this.watchfn.filter(function (fn) {
                        return fn !== callback;
                    });
                },
                runwatch: function () {
                    for (var _i = 0, _a = this.watchfn; _i < _a.length; _i++) {
                        var fn = _a[_i];
                        fn(this);
                    }
                },
            };

            var makeMask = function () {
                var mask1 = document.createElement("div");
                var mask2 = document.createElement("div");
                var mask3 = document.createElement("div");
                var mask4 = document.createElement("div");
                addStylesheetRules([mask1, mask2, mask3, mask4], {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    background: "#0007",
                    zIndex: "99997",
                });
                selectedBox.watch(function () {
                    addStylesheetRules(mask1, {
                        top: "0",
                        left: "0",
                        width: "".concat(selectedBox.left, "px"),
                        height: "100%",
                    });
                    addStylesheetRules(mask2, {
                        top: "0",
                        left: "".concat(selectedBox.left, "px"),
                        width: "".concat(selectedBox.width, "px"),
                        height: "".concat(selectedBox.top, "px"),
                    });
                    addStylesheetRules(mask3, {
                        top: "".concat(
                            selectedBox.top + selectedBox.height,
                            "px",
                        ),
                        left: "".concat(selectedBox.left, "px"),
                        width: "".concat(selectedBox.width, "px"),
                        height: "calc(100% - ".concat(
                            selectedBox.top + selectedBox.height,
                            "px)",
                        ),
                    });
                    addStylesheetRules(mask4, {
                        top: "0px",
                        left: "".concat(
                            selectedBox.left + selectedBox.width,
                            "px",
                        ),
                        width: "calc(100% - ".concat(
                            selectedBox.left + selectedBox.width,
                            "px)",
                        ),
                        height: "100vh",
                    });
                });
                document.body.appendChild(mask1);
                document.body.appendChild(mask2);
                document.body.appendChild(mask3);
                document.body.appendChild(mask4);
                return [mask1, mask2, mask3, mask4];
            };
            var mouseDown = function (e) {
                e.preventDefault();

                mask.push.apply(mask, makeMask());
                div.style.display = "block";
                selectedBox.p1 = [e.clientY, e.clientX];
                selectedBox.p2 = [e.clientY, e.clientX];
                div.style.top = "".concat(selectedBox.top, "px");
                div.style.left = "".concat(selectedBox.left, "px");
                div.style.width = "0";
                div.style.height = "0";
                document.addEventListener("mousemove", mouseMove);
                document.addEventListener("mouseup", mouseUp);
            };
            var getSelectedElements = function () {
                return allBoxes.filter(function (el) {
                    if (
                        el.left < selectedBox.left ||
                        el.top < selectedBox.top ||
                        el.left + el.width >
                            selectedBox.left + selectedBox.width ||
                        el.top + el.height >
                            selectedBox.top + selectedBox.height
                    ) {
                        return false;
                    }
                    return true;
                });
            };
            var mouseMove = function (e) {
                e.preventDefault();
                selectedBox.p2 = [e.clientY, e.clientX];
                div.style.top = "".concat(selectedBox.top, "px");
                div.style.left = "".concat(selectedBox.left, "px");
                div.style.width = "".concat(selectedBox.width, "px");
                div.style.height = "".concat(selectedBox.height, "px");
                var selectedElements = getSelectedElements();
                for (
                    var _i = 0, allBoxes_1 = allBoxes;
                    _i < allBoxes_1.length;
                    _i++
                ) {
                    var el = allBoxes_1[_i];
                    if (selectedElements.includes(el)) {
                        addStylesheetRules(el.el, SelectedBoxStyle);
                    } else {
                        addStylesheetRules(el.el, UnselectedBoxStyle);
                    }
                }
                console.log(
                    selectedElements
                        .sort(function (a, b) {
                            return b.left - a.left;
                        })
                        .sort(function (a, b) {
                            return b.top - a.top;
                        }),
                );
            };
            var mouseUp = function (e) {
                document.removeEventListener("mousemove", mouseMove);
                document.removeEventListener("mouseup", mouseUp);
                document.removeEventListener("mousedown", mouseDown);
                div.remove();
                for (var _i = 0, mask_1 = mask; _i < mask_1.length; _i++) {
                    var i = mask_1[_i];
                    i.remove();
                }
                addStylesheetRules(document.body, { pointerEvents: "" });
                resolve({
                    top: parseInt(div.style.top),
                    left: parseInt(div.style.left),
                    width: parseInt(div.style.width),
                    height: parseInt(div.style.height),
                    el: getSelectedElements(),
                });
            };
            document.addEventListener("mousedown", mouseDown);
            document.addEventListener("mouseup", mouseUp);
            addStylesheetRules(document.body, { pointerEvents: "none" });
        });
    };

    var isChild = function (parent, child) {
        var node = child.parentNode;
        while (node !== null) {
            if (node === parent) return true;
            node = node.parentNode;
        }
        return false;
    };

    var __awaiter =
        (undefined && undefined.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
            function adopt(value) {
                return value instanceof P
                    ? value
                    : new P(function (resolve) {
                          resolve(value);
                      });
            }
            return new (P || (P = Promise))(function (resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator["throw"](value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done
                        ? resolve(result.value)
                        : adopt(result.value).then(fulfilled, rejected);
                }
                step(
                    (generator = generator.apply(
                        thisArg,
                        _arguments || [],
                    )).next(),
                );
            });
        };
    var __generator =
        (undefined && undefined.__generator) ||
        function (thisArg, body) {
            var _ = {
                    label: 0,
                    sent: function () {
                        if (t[0] & 1) throw t[1];
                        return t[1];
                    },
                    trys: [],
                    ops: [],
                },
                f,
                y,
                t,
                g;
            return (
                (g = { next: verb(0), throw: verb(1), return: verb(2) }),
                typeof Symbol === "function" &&
                    (g[Symbol.iterator] = function () {
                        return this;
                    }),
                g
            );
            function verb(n) {
                return function (v) {
                    return step([n, v]);
                };
            }
            function step(op) {
                if (f) throw new TypeError("Generator is already executing.");
                while ((g && ((g = 0), op[0] && (_ = 0)), _))
                    try {
                        if (
                            ((f = 1),
                            y &&
                                (t =
                                    op[0] & 2
                                        ? y["return"]
                                        : op[0]
                                          ? y["throw"] ||
                                            ((t = y["return"]) && t.call(y), 0)
                                          : y.next) &&
                                !(t = t.call(y, op[1])).done)
                        )
                            return t;
                        if (((y = 0), t)) op = [op[0] & 2, t.value];
                        switch (op[0]) {
                            case 0:
                            case 1:
                                t = op;
                                break;
                            case 4:
                                _.label++;
                                return { value: op[1], done: false };
                            case 5:
                                _.label++;
                                y = op[1];
                                op = [0];
                                continue;
                            case 7:
                                op = _.ops.pop();
                                _.trys.pop();
                                continue;
                            default:
                                if (
                                    !((t = _.trys),
                                    (t = t.length > 0 && t[t.length - 1])) &&
                                    (op[0] === 6 || op[0] === 2)
                                ) {
                                    _ = 0;
                                    continue;
                                }
                                if (
                                    op[0] === 3 &&
                                    (!t || (op[1] > t[0] && op[1] < t[3]))
                                ) {
                                    _.label = op[1];
                                    break;
                                }
                                if (op[0] === 6 && _.label < t[1]) {
                                    _.label = t[1];
                                    t = op;
                                    break;
                                }
                                if (t && _.label < t[2]) {
                                    _.label = t[2];
                                    _.ops.push(op);
                                    break;
                                }
                                if (t[2]) _.ops.pop();
                                _.trys.pop();
                                continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) {
                        op = [6, e];
                        y = 0;
                    } finally {
                        f = t = 0;
                    }
                if (op[0] & 5) throw op[1];
                return { value: op[0] ? op[1] : void 0, done: true };
            }
        };

    var main = function () {
        return __awaiter(void 0, void 0, void 0, function () {
            var mask,
                quit,
                ElementPositions,
                allBoxes,
                _i,
                ElementPositions_1,
                position,
                selectedBox,
                _a,
                allBoxes_1,
                div,
                filtered;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mask = document.createElement("div");
                        addStylesheetRules(mask, {
                            position: "fixed",
                            top: "0",
                            left: "0",
                            inlineSize: "100%",
                            blockSize: "100%",
                            zIndex: "99998",
                            background: "#0007",
                        });
                        quit = function () {};
                        ElementPositions = getElementsPosition();
                        console.log(ElementPositions);
                        allBoxes = [];
                        for (
                            _i = 0, ElementPositions_1 = ElementPositions;
                            _i < ElementPositions_1.length;
                            _i++
                        ) {
                            position = ElementPositions_1[_i];
                            allBoxes.push(makeDiv(position));
                        }
                        return [4, dragSelect(allBoxes)];
                    case 1:
                        selectedBox = _b.sent();
                        for (
                            _a = 0, allBoxes_1 = allBoxes;
                            _a < allBoxes_1.length;
                            _a++
                        ) {
                            div = allBoxes_1[_a];
                            div.el.remove();
                        }
                        filtered = selectedBox.el
                            .filter(function (val, index, arr) {
                                console.log(val, index, arr);
                                for (
                                    var _i = 0, arr_1 = arr;
                                    _i < arr_1.length;
                                    _i++
                                ) {
                                    var i = arr_1[_i];
                                    if (isChild(i.src, val.src)) return false;
                                }
                                return true;
                            })
                            .sort(function (a, b) {
                                return a.left - b.left;
                            })
                            .sort(function (a, b) {
                                return a.top - b.top;
                            });
                        console.log(
                            filtered.map(function (el) {
                                return el.text;
                            }),
                        );
                        navigator.clipboard.writeText(
                            filtered
                                .map(function (el) {
                                    return el.text;
                                })
                                .join("\n\n"),
                        );
                        return [2];
                }
            });
        });
    };

    window.addEventListener("keydown", function (e) {
        if (e.key === "s" && e.altKey && !e.ctrlKey && !e.shiftKey) main();
    });
})();
