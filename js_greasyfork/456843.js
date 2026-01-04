// ==UserScript==
// @name         diep_Shortcut
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       tariteur
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// ==/UserScript==
(() => {
    const _window = 'undefined' == typeof unsafeWindow ? window : unsafeWindow;
    if (_window.diep_Shortcut) return;
 
    //diepAPI start
    var diep_Shortcut;
    /******/ (() => {
        // webpackBootstrap
        /******/ 'use strict';
        /******/ // The require scope
        /******/ var __webpack_require__ = {};
        /******/
        /************************************************************************/
        /******/ /* webpack/runtime/define property getters */
        /******/ (() => {
            /******/ // define getter functions for harmony exports
            /******/ __webpack_require__.d = (exports, definition) => {
                /******/ for (var key in definition) {
                    /******/ if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                        /******/ Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                        /******/
                    }
                    /******/
                }
                /******/
            };
            /******/
        })();
        /******/
        /******/ /* webpack/runtime/hasOwnProperty shorthand */
        /******/ (() => {
            /******/ __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
            /******/
        })();
        /******/
        /******/ /* webpack/runtime/make namespace object */
        /******/ (() => {
            /******/ // define __esModule on exports
            /******/ __webpack_require__.r = (exports) => {
                /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                    /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                    /******/
                }
                /******/ Object.defineProperty(exports, '__esModule', { value: true });
                /******/
            };
            /******/
        })();
        /******/
        /************************************************************************/
        var __webpack_exports__ = {};
        // ESM COMPAT FLAG
        __webpack_require__.r(__webpack_exports__);
 
        // EXPORTS
        __webpack_require__.d(__webpack_exports__, {
            core: () => /* reexport */ core_namespaceObject,
        });
 
        // NAMESPACE OBJECT: ./src/core/index.ts
        var core_namespaceObject = {};
        __webpack_require__.r(core_namespaceObject);
        __webpack_require__.d(core_namespaceObject, {
            Canvas: () => Canvas,
        });
 
            class CANVAS {
            GUI_create(id, Class, text, x, y,width, height, color, border, fontSize, callback, ONOFF) {
                // Créer l'élément de l'interface graphique
                const guiElement = document.createElement('d-button');
                guiElement.id = id;
                guiElement.classList.add(Class);
                guiElement.innerHTML = text;
                guiElement.style.bottom = x;
                guiElement.style.left = y;
                guiElement.border = border;
                guiElement.style.fontSize = fontSize+"vw";
                guiElement.bg = color;
                guiElement.textBorder = fontSize;
                guiElement.textalign = 'center';
                guiElement.style.position = 'fixed';
                guiElement.style.width = width+"vw";
                guiElement.style.height = height+"vh";
 
                guiElement.addEventListener('click', callback);
                // Append the GUI element to the body of the document
                document.body.appendChild(guiElement);
            }
            GUI_create_Modal(id, Class, x, y, width, height, color, borderColor) {
                // Créer l'élément de l'interface graphique
                const guiElement = document.createElement('div');
                guiElement.id = id;
                guiElement.classList.add(Class);
                guiElement.style.width = width;
                guiElement.style.height = height;
                guiElement.style.backgroundColor = color;
                guiElement.style.position = 'absolute';
                guiElement.style.left = x;
                guiElement.style.top = y;
                guiElement.style.padding = '12px';
                guiElement.style.borderRadius = '10px';
                guiElement.style.border = `2px solid ${borderColor}`;
                guiElement.style.zIndex = 20;
                guiElement.style.animation = '0.2s cubic-bezier(0.25, 1, 0.5, 1) 0s 1 normal none running modal-intro';
                // Append the GUI element to the body of the document
                document.body.appendChild(guiElement);
            }
            GUI_input_bar(id, className, placeholder, x, y, width, height, color, border, fontSize, callback) {
                // Créer l'élément de l'interface graphique
                const guiElement = document.createElement("input");
 
                guiElement.id = id;
                guiElement.classList.add(className);
                guiElement.placeholder = placeholder;
                guiElement.style.top = x;
                guiElement.style.left = y;
                guiElement.style.border = border;
                guiElement.style.marginLeft = "2%";
                guiElement.style.color = color;
                guiElement.style.fontSize = fontSize + "vw";
                guiElement.style.textAlign = "center";
                guiElement.style.position = "fixed";
                guiElement.style.width = width + "vw";
                guiElement.style.height = height + "vh";
 
                guiElement.addEventListener("keydown", (e) => {
                e.stopPropagation();
                if (e.code === "Enter" && document.activeElement === guiElement) {
                   callback()
                }
                });
                // Append the GUI element to the body of the document
                document.body.appendChild(guiElement);
            }
            GUI_create_slider(id, Class, min, max, step, value, x, y, width, height, callback) {
                // Créer l'élément de l'interface graphique
                const guiElement = document.createElement('input');
                guiElement.id = id;
                guiElement.classList.add(Class);
                guiElement.type = "range";
                guiElement.min = min;
                guiElement.max = max;
                guiElement.step = step;
                guiElement.value = value;
 
                guiElement.style.top = x;
                guiElement.style.left = y;
                guiElement.style.width = width+"vw";
                guiElement.style.height = height+"vh";
                guiElement.style.position = 'absolute';
 
                guiElement.addEventListener('input', callback);
                // Append the GUI element to the body of the document
                document.body.appendChild(guiElement);
            }
            Text_create(id, Class, x, y, text) {
                // Créer un élément de texte en HTML
                let textNode = document.createElement('div');
                textNode.innerHTML = text;
                textNode.id = id;
                textNode.classList.add(Class);
                // Appliquer les styles pour positionner le texte sur le canvas
                textNode.style.position = 'absolute';
                textNode.style.left = x + '%';
                textNode.style.top = y + '%';
                textNode.style.zIndex = 30;
 
                // Appliquer l'effet de text-shadow en CSS
                textNode.style.textShadow = 'black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh';
 
                // Ajouter l'élément de texte à la page
                document.body.appendChild(textNode);
            }
            GUI_changeName(id, text) {
                const element = document.getElementById(id);
                element.innerHTML = text;
            }
            GUI_hide_or_show(type, id_class, truefalse) {
                if (type === "id") {
                  const element = document.getElementById(id_class);
                  if (truefalse == undefined) {
                    if (element.style.display === 'none') {
                      element.style.display = 'block';
                    } else {
                      element.style.display = 'none';
                    }
                  } else if (truefalse == true) {
                    element.style.display = 'block';
                  } else if (truefalse == false) {
                    element.style.display = 'none';
                  }
                } else if (type === "class") {
                  const elements = document.querySelectorAll("."+id_class);
                  for (const element of elements) {
                    if (truefalse == undefined) {
                      if (element.style.display === 'none') {
                        element.style.display = 'block';
                      } else {
                        element.style.display = 'none';
                      }
                    } else if (truefalse == true) {
                      element.style.display = 'block';
                    } else if (truefalse == false) {
                      element.style.display = 'none';
                    }
                  }
                } else if (type === "delete") {
                  let elements;
                  if (type === "id") {
                    const element = document.getElementById(id_class);
                    if (element) {
                      element.parentNode.removeChild(element);
                    }
                  } else if (type === "class") {
                    elements = document.getElementsByClassName(id_class);
                    while (elements.length > 0) {
                      elements[0].parentNode.removeChild(elements[0]);
                    }
                  }
                }
             }
             GUI_delete(type, id_class) {
               let elements;
               if (type === "id") {
                 const element = document.getElementById(id_class);
                if (element) {
                  element.parentNode.removeChild(element);
                }
                } else if (type === "class") {
                  elements = document.getElementsByClassName(id_class);
                  while (elements.length > 0) {
                  elements[0].parentNode.removeChild(elements[0]);
                   }
                  }
                }
//            drawText(canvasType , x, y, text1, text2, color, size, visibility, StrokeStyle, strokeStyleColor) {
//                 canvasType.save();
//                 canvasType.textAlign = "center"
//                 canvasType.font = `${size}px Ubuntu`;
//                 canvasType.fillStyle = color;
//                 canvasType.globalAlpha = visibility;
//                 canvasType.fillText(text1, x, y)
//                 if (StrokeStyle) {
//                 canvasType.strokeStyle = strokeStyleColor;
//                 canvasType.strokeText(text1, x, y);
//                 }
//                 canvasType.restore();
//             }
//             drawLine(canvasType, xy, XY, color, visibility) {
//                 canvasType.save();
//                 canvasType.fillStyle = color;
//                 canvasType.globalAlpha = visibility;
//                 canvasType.beginPath();
//                 canvasType.moveTo(xy.x, xy.y);
//                 canvasType.lineTo(XY.x, XY.y);
//                 canvasType.stroke();
//                 canvasType.restore();
//             }
 
//             drawPoint(canvasType, xy, radius, color, visibility, StrokeStyle, strokeStyleColor, strokeStyleSize) {
//                 canvasType.save();
//                 canvasType.fillStyle = color;
//                 canvasType.globalAlpha = visibility;
//                 canvasType.beginPath();
//                 canvasType.arc(xy.x, xy.y, radius, 0, 2 * Math.PI);
//                 canvasType.fill();
//                 if (StrokeStyle) {
//                 canvasType.lineWidth = strokeStyleSize;
//                 canvasType.strokeStyle = strokeStyleColor;
//                 canvasType.stroke();
//                 }
//                 canvasType.restore();
//             }
 
//             drawSquar(canvasType, x1, y1, x2, y2, size, color, visibility, StrokeStyle, strokeStyleColor, strokeStyleSize) {
//                 canvasType.save();
//                 canvasType.fillStyle = color;
//                 canvasType.globalAlpha = visibility;
//                 canvasType.fillRect(x1, y1, x2 - x1, y2 - y1);
//                 if (StrokeStyle) {
//                 canvasType.lineWidth = strokeStyleSize;
//                 canvasType.strokeStyle = strokeStyleColor;
//                 canvasType.stroke();
//                 }
//                 canvasType.restore();
//             }
        }
        const Canvas = new CANVAS(); // CONCATENATED MODULE: ./src/tools/index.ts // CONCATENATED MODULE: ./src/types/index.ts // CONCATENATED MODULE: ./src/index.ts
 
        // const shortcut = new Shortcut();
        diep_Shortcut = __webpack_exports__;
        /******/
    })();
    //diepAPI end
 
    _window.diep_Shortcut = diep_Shortcut;
})();