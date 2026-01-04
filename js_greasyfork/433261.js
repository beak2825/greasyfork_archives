// ==UserScript==
// @name         优雅的滚动条
// @namespace    https://greasyfork.org/zh-CN/users/690564-%E5%9C%A8%E5%90%8C%E4%B8%80%E6%97%B6%E7%A9%BA%E7%9B%B8%E9%81%87
// @version      1.0.0
// @description  使Windows浏览器滚动条更优雅
// @author       在同一时空相遇 y17870181601@163.com
// @license      MIT
// @include      *://*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFIElEQVR4nO3bT47URhTA4Vej2TM3CTegkRBkmRvkClwABCgLlnMEjpBlEiQYbkBuwh7NOAsgwMC86X8uV7m+b9e2W36bn+x2u0qwqPv/vLhXpnLxs31TmTZvHz59V3kkvnGy9ADQMoFAQiCQEAgkBAIJgUBCIJAQCCQEAgmBQEIgkBAIJAQCCYFAQiCQEAgkBAIJgUBCIJAQCCQEAgmBQEIgkBAIJAQCidOlB4DM/b9e/FJKeTZNcRYRUUpcvHn05Hmt87uC0KwHr1/eiVJeRcRvpcSmlNhExLPN33/8XmsGgdCkB69f3rm8+nhRIu5e31fi6rzWHAKhOVkcERElylmtWQRCU26LIyJimuKi1jx+pNOMreKI6UNEPK41kysITdg6jik2b399+m+tuQTC4lqNI0IgLKzlOCIEwoJajyNCICykhzgiBMICeokjQiBU1lMcEQKhot7iiBAIlfQYR4RAqKDXOCIEwsx6jiNCIMyo9zgiBMJM1hBHhECYwVriiBAIR7amOCIEwhGtLY4IgXAka4wjQiAcwVrjiBAIB1pzHBEC4QBrjyNCIOxphDgiBMIeRokjQiDsaKQ4IgTCDkaLI0IgbGnEOCIEwhZGjSNCINxi5DgiBEJi9DgiBMINxPGJQPiBOL4SCN8Rx/cEwv/E8SOBEBHiuIlAEEdCIIMTR04gAxPH7QQyKHFsRyADEsf2BDIYcexGIAMRx+4EMghx7EcgAxDH/gSycuI4jEBWTByHE8hKieM4BLJC4jgegayMOI5LICsijuMTyEqIYx4CWQFxzEcgnRPHvATSMXHMTyCdEkcdAumQOOoRSGfEUZdAOiKO+gTSCXEsQyAdEMdyBNI4cSzrdOkBSFxNZ5dFHEsSSMtKeVUizm7aLY75ucVqWIkijoUJpEPiqEcgnRFHXeX+Py/uLT3EyKarcvekxPm2x19N8bicTO/nnImvTstULpYeYmSl7Hb8SYnzmHb8EntziwUJgUBCIJAQCCQEAonTqUybpYcYxtV09un1kZv/If/+cI90l+Z5YSXbvJV73VSmzduHT9/NORc5t1gV7BMHbRDIzMTRN4HMSBz9E8hMtl0JeDXF45pzsRsLpmawyzLZcjKdebeqXa4gR2YN+boI5IjEsT4CORJxrJNAjkAc6yWQA4lj3QRyAHGsn0D2JI4xCGQP4hiHQHYkjrEIZAfiGI9AtiSOMQlkC+IYl0BuIY6xCSQhDgRyA3EQIZCfEgdfCOQacfAtgXxDHFwnkM/Ewc8IJMTBzYYPRBxkhg5EHNxm2EDEwTaGDEQcbGu4QMTBLoYKRBzsaphAxME+hghEHOxr9YGIg0OsOhBxcKjVBiIOjmGVgYiDY1ldIOLgmFYViDg4ttUEIg7msIpAxMFcug9EHMyp60DEwdy6DUQc1NBlIOKglu4CEQc1dRWIOKitm0DEwRK6CEQcLKX5QMTBkpoORBwsrdlAxEELmgxEHLSiuUDEQUuaCkQctKaZQMRBi5oIRBy0avFAxEHLFg1EHLRusUDEQQ8WCUQc9KJ6IOKgJ1UDEQe9qRaIOOhRtUAuLz/+KQ56Uy2QUmJz0z5x0KpqgUwxfbhxuzhoVL0rSJTz69vEQeuqBfLm0ZPnEfHsy+cp4r04aN1pzZN9juR5zXPCIRZ/WRFaJhBICAQSAoGEQCAhEEgIBBICgYRAICEQSAgEEgKBhEAgIRBICAQSAoGEQCAhEEgIBBICgYRAICEQSAgEEgKBhEAg8R+CSFTHUUbE3wAAAABJRU5ErkJggg==
// @grant        GM_addStyle
// @note         灵感: https://github.com/the1812/Bilibili-Evolved
// @downloadURL https://update.greasyfork.org/scripts/433261/%E4%BC%98%E9%9B%85%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/433261/%E4%BC%98%E9%9B%85%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var setting = {
        'enable': !navigator.platform.toLowerCase().includes('mac'),
        'width': '10px',
        'color': '#aaa',
        'color_hover': '#999',
        'background_color': 'rgb(244, 244, 244)',
        'background_color_hover': 'rgb(244, 244, 244)',
        'radius': '5px',
        'transition': '.5s'
    }

    if (setting.enable) {
        document.documentElement.classList.toggle('Meet_you_elegant_scrollbar', true);
        GM_addStyle(`
            html.Meet_you_elegant_scrollbar,
            html.Meet_you_elegant_scrollbar * {
                scrollbar-color: ${setting.color} ${setting.background_color};
                scrollbar-width: thin;
            }

            /* 滚动条滑块 */
            ::-webkit-scrollbar-thumb {
                height: ${setting.width};
                width: ${setting.width};
                background-color: ${setting.color} !important;
                border-radius: ${setting.radius} !important;
                transition: ${setting.transition} !important;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: ${setting.color_hover} !important;
            }

            /* 滚动条背景 */
            ::-webkit-scrollbar,
            ::-webkit-scrollbar-track {
                height: ${setting.width};
                width: ${setting.width};
                background-color: ${setting.background_color} !important;
                transition: ${setting.transition} !important;
            }
            ::-webkit-scrollbar:hover,
            ::-webkit-scrollbar-track:hover {
                background-color: ${setting.background_color_hover} !important;
            }

            /* 横纵滑条交汇处 */
            ::-webkit-resizer,
            ::-webkit-scrollbar-corner {
                background-color: ${setting.background_color} !important;
            }
        `);
    }
})();