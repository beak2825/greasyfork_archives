// ==UserScript==
// @name         爱心点击特效
// @version      0.2.0.5
// @description  给所有打开的页面添加爱心点击特效
// @author       在同一时空相遇 y17870181601@163.com
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/690564-%E5%9C%A8%E5%90%8C%E4%B8%80%E6%97%B6%E7%A9%BA%E7%9B%B8%E9%81%87
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFIElEQVR4nO3bT47URhTA4Vej2TM3CTegkRBkmRvkClwABCgLlnMEjpBlEiQYbkBuwh7NOAsgwMC86X8uV7m+b9e2W36bn+x2u0qwqPv/vLhXpnLxs31TmTZvHz59V3kkvnGy9ADQMoFAQiCQEAgkBAIJgUBCIJAQCCQEAgmBQEIgkBAIJAQCCYFAQiCQEAgkBAIJgUBCIJAQCCQEAgmBQEIgkBAIJAQCidOlB4DM/b9e/FJKeTZNcRYRUUpcvHn05Hmt87uC0KwHr1/eiVJeRcRvpcSmlNhExLPN33/8XmsGgdCkB69f3rm8+nhRIu5e31fi6rzWHAKhOVkcERElylmtWQRCU26LIyJimuKi1jx+pNOMreKI6UNEPK41kysITdg6jik2b399+m+tuQTC4lqNI0IgLKzlOCIEwoJajyNCICykhzgiBMICeokjQiBU1lMcEQKhot7iiBAIlfQYR4RAqKDXOCIEwsx6jiNCIMyo9zgiBMJM1hBHhECYwVriiBAIR7amOCIEwhGtLY4IgXAka4wjQiAcwVrjiBAIB1pzHBEC4QBrjyNCIOxphDgiBMIeRokjQiDsaKQ4IgTCDkaLI0IgbGnEOCIEwhZGjSNCINxi5DgiBEJi9DgiBMINxPGJQPiBOL4SCN8Rx/cEwv/E8SOBEBHiuIlAEEdCIIMTR04gAxPH7QQyKHFsRyADEsf2BDIYcexGIAMRx+4EMghx7EcgAxDH/gSycuI4jEBWTByHE8hKieM4BLJC4jgegayMOI5LICsijuMTyEqIYx4CWQFxzEcgnRPHvATSMXHMTyCdEkcdAumQOOoRSGfEUZdAOiKO+gTSCXEsQyAdEMdyBNI4cSzrdOkBSFxNZ5dFHEsSSMtKeVUizm7aLY75ucVqWIkijoUJpEPiqEcgnRFHXeX+Py/uLT3EyKarcvekxPm2x19N8bicTO/nnImvTstULpYeYmSl7Hb8SYnzmHb8EntziwUJgUBCIJAQCCQEAonTqUybpYcYxtV09un1kZv/If/+cI90l+Z5YSXbvJV73VSmzduHT9/NORc5t1gV7BMHbRDIzMTRN4HMSBz9E8hMtl0JeDXF45pzsRsLpmawyzLZcjKdebeqXa4gR2YN+boI5IjEsT4CORJxrJNAjkAc6yWQA4lj3QRyAHGsn0D2JI4xCGQP4hiHQHYkjrEIZAfiGI9AtiSOMQlkC+IYl0BuIY6xCSQhDgRyA3EQIZCfEgdfCOQacfAtgXxDHFwnkM/Ewc8IJMTBzYYPRBxkhg5EHNxm2EDEwTaGDEQcbGu4QMTBLoYKRBzsaphAxME+hghEHOxr9YGIg0OsOhBxcKjVBiIOjmGVgYiDY1ldIOLgmFYViDg4ttUEIg7msIpAxMFcug9EHMyp60DEwdy6DUQc1NBlIOKglu4CEQc1dRWIOKitm0DEwRK6CEQcLKX5QMTBkpoORBwsrdlAxEELmgxEHLSiuUDEQUuaCkQctKaZQMRBi5oIRBy0avFAxEHLFg1EHLRusUDEQQ8WCUQc9KJ6IOKgJ1UDEQe9qRaIOOhRtUAuLz/+KQ56Uy2QUmJz0z5x0KpqgUwxfbhxuzhoVL0rSJTz69vEQeuqBfLm0ZPnEfHsy+cp4r04aN1pzZN9juR5zXPCIRZ/WRFaJhBICAQSAoGEQCAhEEgIBBICgYRAICEQSAgEEgKBhEAgIRBICAQSAoGEQCAhEEgIBBICgYRAICEQSAgEEgKBhEAg8R+CSFTHUUbE3wAAAABJRU5ErkJggg==
// @include      *://*
// @grant        GM_addStyle
// @run-at       document-body
// @note         V0.2.0.5(2020-11-06): 添加开源许可声明
// @note         V0.2.0.4(2020-11-06): 增加body最小高度样式，避免在短页面中部分区域无法生效
// @note         V0.2.0.3(2020-10-01): 代码优化
// @note         V0.2.0.2(2020-09-30): 代码优化
// @note         V0.2.0.1(2020-09-27): 设置样式初始值，避免受页面内其他css样式污染
// @note         V0.2(2020-09-26): 改进为油猴脚本，将css爱心修改为svg爱心，svg来自iconfont @shuaidaipeng(https://www.iconfont.cn/user/detail?uid=5244011)
// @note         V0.1(2020-01-27): 初始版本，需要引用页面使用，使用css生成爱心
// @downloadURL https://update.greasyfork.org/scripts/412006/%E7%88%B1%E5%BF%83%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/412006/%E7%88%B1%E5%BF%83%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function main () {
    const s = 30, // 爱心大小，可修改，单位：px
          body = document.body;

    function Meet_you_clickResult (e){
        const x = e.clientX,
              y = e.clientY,
              r = Math.floor(Math.random() * 127) + 127,
              g = Math.floor(Math.random() * 127) + 127,
              b = Math.floor(Math.random() * 127) + 127,
              svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
              path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.setAttribute('class', 'Meet_you_clickResult');
        svg.setAttribute('style',
                         'left: ' + (x - s / 2) + 'px;' +
                         'top: ' + (y - s / 2) + 'px;' +
                         'width: ' + s + 'px;' +
                         'height: ' + s + 'px;'
                        );
        svg.setAttribute('viewBox', '0 0 1169 1024');
        path.setAttribute('d', 'M1045.333 117.333C919.467-6.4 716.8-10.667 584.533 106.667 452.267-10.667 249.6-6.4 123.733 117.333c-128 128-130.133 337.067-2.133 467.2l4.267 4.267 384 384c40.533 40.533 106.666 42.667 149.333 2.133l2.133-2.133 384-384c128-128 130.134-337.067 4.267-465.067-2.133-4.266-2.133-4.266-4.267-6.4z');
        path.setAttribute('fill', 'rgb(' + r + ', ' + g + ', ' + b + ')');
        svg.appendChild(path);
        body.appendChild(svg);
        setTimeout(() => {
            body.removeChild(svg);
        }, 800);
    }
    document.body.addEventListener('mousedown', Meet_you_clickResult);
    GM_addStyle(`
        html { height: 100%; }
        body { min-height: 100%; }
        .Meet_you_clickResult {
            position: fixed;
            user-select: none;
            pointer-events: none;
            z-index: 1000;
            animation: Meet_you_clickResult 0.8s ease-in forwards;
        }
        .Meet_you_clickResult,
        .Meet_you_clickResult * {
            background: transparent;
            border: unset;
            padding: unset;
            margin: unset;
            box-sizing: unset;
            opacity: 1;
            transform: unset;
            font-size: unset;
        }
        @keyframes Meet_you_clickResult{
            0%{
                opacity: 1;
            }
            30%{
                opacity: 1;
            }
            100%{
                transform: translateY(-100px);
                opacity: 0;
            }
        }
    `);
}());
