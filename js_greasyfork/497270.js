/*!
 * hp-shared v1.13.1
 * (c) 2022 hp
 * Released under the MIT License.
 */
/*
 * 打包时间：2024-09-11 09:10:15
 * rollup 打包配置：{"format":"iife","sourcemap":"inline"}
 */
// ==UserScript==
// @name         hp-shared
// @version      1.13.1
// @description  基础库
// @license      MIT
// @author       hp
// @namespace    https://github.com/Feawaris/hp-shared
// @match        *://*/*
// @require      https://unpkg.com/hp-shared/dist/browser/index.umd.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497270/hp-shared.user.js
// @updateURL https://update.greasyfork.org/scripts/497270/hp-shared.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 1.UserScript 注释在 rollup.config 中配置
    // 2.对象全局挂载
    const { hpShared } = globalThis;
    const { _console, _Object, _Math, _Date } = hpShared;
    for (const [key, value] of Object.entries(hpShared)) {
        if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
            try {
                globalThis[key] = value;
            }
            catch (e) {
                _console.error(key, key in globalThis);
            }
        }
    }
    // 3.常用全局挂载
    // _Math
    for (const key of _Object.keys(_Math, { includeExtend: true, includeNotEnumerable: true })) {
        globalThis[key] = _Math[key];
    }
    const pi = Math.PI;
    const π = Math.PI;
    const e = Math.E;
    const oo = Infinity;
    _Object.assign(globalThis, {
        pi, π, e, oo,
    });
    // _Date
    _Object.assign(globalThis, {
        get now() {
            return new _Date();
        },
    });

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtdGFtcGVybW9ua2V5LmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgtYnJvd3Nlci10YW1wZXJtb25rZXkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gMS5Vc2VyU2NyaXB0IOazqOmHiuWcqCByb2xsdXAuY29uZmlnIOS4remFjee9rlxuLy8gMi7lr7nosaHlhajlsYDmjILovb1cbmNvbnN0IHsgaHBTaGFyZWQgfSA9IGdsb2JhbFRoaXM7XG5jb25zdCB7IF9jb25zb2xlLCBfT2JqZWN0LCBfTWF0aCwgX0RhdGUgfSA9IGhwU2hhcmVkO1xuZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoaHBTaGFyZWQpKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgfHwgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGdsb2JhbFRoaXNba2V5XSA9IHZhbHVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIF9jb25zb2xlLmVycm9yKGtleSwga2V5IGluIGdsb2JhbFRoaXMpO1xuICAgIH1cbiAgfVxufVxuLy8gMy7luLjnlKjlhajlsYDmjILovb1cbi8vIF9NYXRoXG5mb3IgKGNvbnN0IGtleSBvZiBfT2JqZWN0LmtleXMoX01hdGgsIHsgaW5jbHVkZUV4dGVuZDogdHJ1ZSwgaW5jbHVkZU5vdEVudW1lcmFibGU6IHRydWUgfSkpIHtcbiAgZ2xvYmFsVGhpc1trZXldID0gX01hdGhba2V5XTtcbn1cbmNvbnN0IHBpID0gTWF0aC5QSTtcbmNvbnN0IM+AID0gTWF0aC5QSTtcbmNvbnN0IGUgPSBNYXRoLkU7XG5jb25zdCBvbyA9IEluZmluaXR5O1xuX09iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywge1xuICBwaSwgz4AsIGUsIG9vLFxufSk7XG4vLyBfRGF0ZVxuX09iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywge1xuICBnZXQgbm93KCkge1xuICAgIHJldHVybiBuZXcgX0RhdGUoKTtcbiAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUE7SUFDQTtJQUNBLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxVQUFVLENBQUM7SUFDaEMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLFFBQVEsQ0FBQztJQUNyRCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUNuRCxJQUFBLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxLQUFLLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLEVBQUU7SUFDaEYsUUFBQSxJQUFJO0lBQ0YsWUFBQSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2FBQ3pCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDO2FBQ3hDO1NBQ0Y7SUFDSCxDQUFDO0lBQ0Q7SUFDQTtJQUNBLEtBQUssTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7UUFDMUYsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNuQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2xCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDakIsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0lBQ3pCLElBQUEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNiLENBQUEsQ0FBQyxDQUFDO0lBQ0g7SUFDQSxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtJQUN6QixJQUFBLElBQUksR0FBRyxHQUFBO1lBQ0wsT0FBTyxJQUFJLEtBQUssRUFBRSxDQUFDO1NBQ3BCO0lBQ0YsQ0FBQSxDQUFDOzs7Ozs7In0=
