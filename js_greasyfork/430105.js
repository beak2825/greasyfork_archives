"use strict";
// ==UserScript==
// @name         Projection Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1.13
// @description  try to take over the world!
// @author       You
// @match        https://torbjorn.xcbiaozhu.saicsdv.com/*
// @match        https://*.startask.net/*
// @icon         https://www.google.com/s2/favicons?domain=saicsdv.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430105/Projection%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/430105/Projection%20Viewer.meta.js
// ==/UserScript==
// const imageSize = { width: 2560, height: 1440 };
const keys = ["left", "right", "front", "rear"];
const mappingCache = {};
async function mappingUrl(side, imageUrl) {
    const mapping = (await (await fetch("https://echo-apps.oss-cn-beijing.aliyuncs.com/notions/chrome_extension_shangqi_viewer.json")).json());
    const apiVersion = mapping.find((s) => imageUrl.includes(s.name))?.mapping ?? 1;
    return `https://stardust-data.oss-cn-hangzhou.aliyuncs.com/projects/shangqi/lut_fisheye2bird_v${apiVersion}/${side}.txt`;
}
async function fetchMapping(imageUrl, side) {
    const url = await mappingUrl(side, imageUrl);
    if (url in mappingCache) {
        return mappingCache[url];
    }
    const response = await fetch(url);
    const mapping = (await response.json());
    const possibleSizes = [
        { width: 1200, height: 720 },
        { width: 1280, height: 720 },
        { width: 1920, height: 1536 },
    ];
    const size = possibleSizes.find((s) => mapping.length === s.width * s.height);
    if (size == null) {
        throw new Error(`这个题目映射数据有问题，请联系管理员`);
    }
    const mapper = (pos) => {
        const index = size.height * Math.floor(pos.x) + Math.floor(pos.y);
        const [x, y] = mapping[index];
        return { x, y };
    };
    mappingCache[url] = mapper;
    return mapper;
}
function getSideFromPoint(point, imageSize) {
    const x = point.x / imageSize.width;
    const y = point.y / imageSize.height;
    if (x < 0.5 && y < 0.5) {
        return "left";
    }
    if (x < 0.5 && y >= 0.5) {
        return "right";
    }
    if (x >= 0.5 && y < 0.5) {
        return "front";
    }
    return "rear";
}
const mapPoints = (side, imageSize) => (point) => {
    if (side === "left") {
        return point;
    }
    if (side === "right") {
        return {
            x: point.x,
            y: point.y - imageSize.height / 2,
        };
    }
    if (side === "front") {
        return {
            x: point.x - imageSize.width / 2,
            y: point.y,
        };
    }
    return {
        x: point.x - imageSize.width / 2,
        y: point.y - imageSize.height / 2,
    };
};
function getBirdEyeImage(attachment) {
    if (attachment.includes("/od_square/img")) {
        // https://s3-sh-prod.fin-shine.com/stardust-id-smtc/od_square/img/2020-12-14-11-12-33-00001.png
        // https://s3-sh-prod.fin-shine.com/stardust-id-smtc/od_square_bird/2020-12-14-11-12-33-00001.png
        return attachment.replace("/od_square/img", "/od_square_bird");
    }
    if (attachment.includes("/od_square_0817")) {
        // https://s3-sh-prod.fin-shine.com/stardust-id-smtc/od_square_0817/2021-05-21-11-19-19-00605.png
        // https://s3-sh-prod.fin-shine.com/stardust-id-smtc/od_square_bird_0817/2021-05-21-11-19-19-00605_front.png
        return attachment
            .replace("/od_square_", "/od_square_bird_")
            .replace(".png", "_front.png");
    }
    if (attachment.includes("/od_square_")) {
        // https://s3-sh-prod.fin-shine.com/stardust-id-smtc/od_square_0721/2021-05-21-11-19-19-00605.png
        // https://s3-sh-prod.fin-shine.com/stardust-id-smtc/od_square_bird_0721/2021-05-21-11-19-19-00605.png
        return attachment
            .replace("/od_square_", "/od_square_bird_")
            .replace(".jpg", ".png");
    }
    // https://s3-sh-prod.fin-shine.com/stardust-id-smtc/image_four_0716/origin/2021-04-13-16-38-27-02049.png
    // https://s3-sh-prod.fin-shine.com/stardust-id-smtc/image_four_0716/Bird_ml/2021-04-13-16-38-27-bird_ml.png
    return attachment.replace(/origin\/(.*)-[0-9]+\.png/, (_, match) => `Bird_ml/${match}-bird_ml.png`);
}
function getUrlAndPoints() {
    // @ts-ignore
    const store = window._annotationStore;
    if (store == null) {
        console.log("annotation store not found");
        return;
    }
    if (store.taskParams.record.attachmentType !== "IMAGE") {
        return;
    }
    if (store.annotation.mode.type !== "selected") {
        return;
    }
    const selected = store.annotation.mode.slotInstances[0];
    if (selected == null) {
        return;
    }
    if (selected.slot.type !== "point") {
        return;
    }
    if (![3, 6].includes(selected.parentChildSlots.length)) {
        return;
    }
    const imageSize = store.taskParams.record.metadata.size ||
        store.subStores.get("_default").info;
    const side = getSideFromPoint(selected.slot.point, imageSize);
    if (side == null) {
        return;
    }
    return {
        side,
        points: selected.parentChildSlots.map((s) => ({
            ...s.slot.point,
        })).map(mapPoints(side, imageSize)),
        image: getBirdEyeImage(store.taskParams.record.attachment),
        url: store.taskParams.record.attachment,
    };
}
const angle = (a, b) => {
    return Math.atan2(a.y - b.y, a.x - b.x);
};
const crossAngle = (a, b, c) => {
    const result = Math.abs(Math.round(((angle(b, a) - angle(b, c)) / Math.PI) * 180));
    if (result > 180) {
        return 360 - result;
    }
    return result;
};
const distance = (from) => (to) => {
    return Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2);
};
let svg;
async function startAdding() {
    if (svg != null) {
        svg.parentElement?.removeChild(svg);
    }
    const result = getUrlAndPoints();
    if (result == null) {
        return;
    }
    const { points, side } = result;
    const mapping = await fetchMapping(result.url, side);
    const mapped = points.map(mapping);
    const isPilar = points.length === 3;
    const hasOverflow = mapped
        .map(distance({ x: 400, y: 400 }))
        .every((s) => s > 200);
    const minX = Math.min(...mapped.map((m) => m.x));
    const minY = Math.min(...mapped.map((m) => m.y));
    const normalized = mapped.map((p) => ({
        x: p.x - minX,
        y: p.y - minY,
    }));
    const width = Math.max(...normalized.map((p) => p.x));
    const height = Math.max(...normalized.map((p) => p.y));
    const paddingSize = 90;
    const paddedWidth = width + paddingSize * 2;
    const paddedHeight = height + paddingSize * 2;
    const shifted = normalized.map((p) => ({
        x: p.x + paddingSize,
        y: p.y + paddingSize,
    }));
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("style", `border-radius: 5px; position: absolute; bottom: 20px; left: 50%; margin-left: ${-paddedWidth / 2}px; width: ${paddedWidth}px; height: ${paddedHeight}px; background-color: black;`);
    svg.setAttribute("width", paddedWidth.toString());
    svg.setAttribute("height", paddedHeight.toString());
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", result.image);
    image.onerror = () => {
        image.setAttribute("href", result.image.replace(/\.png/, ".jpg"));
    };
    image.setAttribute("width", "800");
    image.setAttribute("height", "800");
    image.setAttribute("x", (-minX + paddingSize).toString());
    image.setAttribute("y", (-minY + paddingSize).toString());
    svg.appendChild(image);
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", shifted.map((p) => `${p.x},${p.y}`).join(" "));
    polyline.setAttribute("fill", "transparent");
    polyline.setAttribute("stroke", "white");
    polyline.setAttribute("strokeWidth", "1");
    svg.appendChild(polyline);
    for (const point of shifted) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", point.x.toString());
        circle.setAttribute("cy", point.y.toString());
        circle.setAttribute("r", "3");
        circle.setAttribute("fill", "white");
        svg.appendChild(circle);
    }
    const centerIndex = isPilar ? 1 : 2;
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", shifted[centerIndex].x.toString());
    txt.setAttribute("y", shifted[centerIndex].y.toString());
    txt.setAttribute("fill", "white");
    txt.setAttribute("text-anchor", "middle");
    txt.append(crossAngle(shifted[centerIndex - 1], shifted[centerIndex], shifted[centerIndex + 1]).toString());
    svg.appendChild(txt);
    if (hasOverflow) {
        const extra = document.createElementNS("http://www.w3.org/2000/svg", "text");
        extra.setAttribute("x", "10");
        extra.setAttribute("y", "20");
        extra.setAttribute("fill", "white");
        extra.append(">10m");
        svg.appendChild(extra);
    }
    document.body.appendChild(svg);
}
(function () {
    "use strict";
    addEventListener("keyup", (ev) => {
        if (ev.key === "q") {
            startAdding().catch();
        }
    });
})();
