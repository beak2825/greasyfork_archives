// ==UserScript==
// @name         wallhaven-layout
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  wallhaven layout
// @author       You
// @match        https://wallhaven.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wallhaven.cc
// @require      https://cdnjs.cloudflare.com/ajax/libs/decimal.js/9.0.0/decimal.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493167/wallhaven-layout.user.js
// @updateURL https://update.greasyfork.org/scripts/493167/wallhaven-layout.meta.js
// ==/UserScript==

// import Decimal from "decimal.js";

(function () {
    "use strict";

    let width = document.querySelector("#thumbs")?.clientWidth - 20;
    const load = () => {
        getWallpaper();
        const thumbs = document.querySelector("#thumbs");

        const observerOptions = {
            childList: true, // 观察目标子节点的变化，是否有添加或者删除
            attributes: false, // 观察属性变动
            subtree: false, // 观察后代节点，默认为 false
        };
        if (!thumbs) return;
        const observer = new MutationObserver((mutations) => {
            getWallpaper();
        });
        observer.observe(thumbs, observerOptions);
        const resize = () => {
            console.log(
                "object :>> ",
                document.querySelector("#thumbs")?.clientWidth
            );
            width = document.querySelector("#thumbs")?.clientWidth - 20;
            getWallpaper();
        };
        window.addEventListener("resize", resize);
        window.onunload = () => {
            observer.disconnect();
            window.removeEventListener("resize", resize);
        };
    };
    function calcImageRow({ list, height, w, clientWidth, gap = 0 }) {
        let grid = [
            {
                height: new Decimal(height),
                list: [],
                notFull: false,
            },
        ];
        let currentRowIndex = 0;
        list.forEach((i) => {
            const currentRow = grid[currentRowIndex];
            const totalWidth = currentRow.list.reduce((acc, cur) => {
                const width = new Decimal(currentRow.height).mul(cur.ratio);
                return acc.add(width);
            }, new Decimal(0));
            /** 剩余宽度 */
            const remainWidth = new Decimal(clientWidth).sub(totalWidth);
            if (remainWidth.lt(w)) {
                currentRowIndex++;
                grid.push({
                    height: new Decimal(height),
                    list: [i],
                    notFull: false,
                });
            } else {
                currentRow.list.push(i);
            }
        });

        grid.forEach((row) => {
            const totalWidth = row.list.reduce((acc, cur) => {
                const width = new Decimal(row.height).mul(cur.ratio);
                return acc.add(width);
            }, new Decimal(0));
            const totalRatio = row.list.reduce((acc, cur) => {
                return acc.add(cur.ratio);
            }, new Decimal(0));
            const gapWidth = new Decimal(row.list.length + 1).mul(gap);

            if (!totalWidth.plus(200).lt(clientWidth)) {
                row.height = new Decimal(clientWidth).sub(gapWidth).div(totalRatio);
            } else {
                row.height = new Decimal(clientWidth).sub(gapWidth).div(totalRatio);
                row.notFull = true;
            }
        });
        return grid;
    }

    const getWallpaper = () => {
        console.log("width :>> ", width);
        const pages = document.querySelectorAll(".thumb-listing-page");

        const pagesInfo = Array.from(pages).map((page) => {
            page.style.textAlign = "left";
            page.style.padding = 0;
            page.style.paddingLeft = 10 + "px";
            page.style.paddingBottom = 4 + "em";
            page.style.height = page.scrollHeight + "px";
            const imageDoms = page.querySelectorAll(".thumb-listing-page ul li");

            return Array.from(imageDoms).map((imageDom) => {
                const [w, h] =
                      imageDom
                .querySelector(".thumb-info .wall-res")
                ?.textContent?.split(" x ") ?? [];

                return {
                    url: imageDom.querySelector("img")?.dataset.src,
                    ratio: Number(new Decimal(w).div(h).toFixed(2)),
                    width: Number(w),
                    height: Number(h),
                    source: imageDom,
                    id: imageDom.querySelector("figure")?.dataset.wallpaperId,
                };
            });
        });

        const grids = pagesInfo.map((page, index) => {
            return calcImageRow({
                list: page,
                height: 300,
                w: 0,
                clientWidth: width,
                gap: 10,
            });
        });
        console.log(grids, pagesInfo);
        grids.forEach((grid) => {
            grid.forEach((row, rowIndex) => {
                row.list.forEach((image, index) => {
                    const { source: _source, height } = image;
                    const source = _source.querySelector("figure");
                    _source.style.verticalAlign = "top";

                    source.style.margin = 0;
                    source.style.marginRight = 10 + "px";
                    source.style.marginBottom = 10 + "px";

                    if (row.notFull && rowIndex === grid.length - 1) {
                        console.log("image :>> ", image, new Decimal(image.ratio).gt(1));

                        source.style.height = 300 + "px";
                        source.style.width = new Decimal(image.ratio).mul(300) + "px";
                    } else {
                        source.style.width = `${row.height.mul(image.ratio)}px`;
                        source.style.height = `${row.height}px`;
                    }
                    source.querySelector("img").style.height = `100%`;
                    source.querySelector("img").style.width = `100%`;
                });
            });
        });

        Array.from(document.querySelectorAll(".thumb-listing-page")).forEach(
            (e) => {
                const ulH = e.querySelector("ul").scrollHeight;
                console.log("ulH :>> ", ulH);
                e.style.marginTop = -e.style.scrollHeight - ulH + "px";
            }
        );
    };

    window.addEventListener("load", load);

    // Your code here...
})();
