"use strict";
// ==UserScript==
// @name         静态物体参考
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  多帧静态物体参考
// @author       You
// @match        https://jorn.xcbiaozhu.saicsdv.com/*
// @match        https://*.startask.net/*
// @icon         https://www.google.com/s2/favicons?domain=startask.net
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/432788/%E9%9D%99%E6%80%81%E7%89%A9%E4%BD%93%E5%8F%82%E8%80%83.user.js
// @updateURL https://update.greasyfork.org/scripts/432788/%E9%9D%99%E6%80%81%E7%89%A9%E4%BD%93%E5%8F%82%E8%80%83.meta.js
// ==/UserScript==
let cleanUps = [];
const css = ((a) => a);
function markReference() {
    const canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    canvas.setAttribute("style", css `
      background-color: #f0f2fe;
      position: fixed;
      bottom: 160px;
      left: 50%;
      margin-left: -210px;
      width: 420px;
      height: 220px;
      border-radius: 10px;
    `);
    document.body.appendChild(canvas);
    let polygons = [];
    function renderPoints(points, color) {
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", points.map((p) => `${p.x + 10},${p.y + 10}`).join(" "));
        polygon.setAttribute("fill", "transparent");
        polygon.setAttribute("stroke", color);
        polygon.setAttribute("strokeWidth", "1");
        canvas.appendChild(polygon);
        polygons.push(polygon);
    }
    getSelectedCoordinate(({ referencePoints, newPoints, sideReferenceOrigin, sideNewPoints }) => {
        polygons.forEach((c) => canvas.removeChild(c));
        polygons = [];
        renderPoints(referencePoints, "red");
        if (newPoints) {
            renderPoints(newPoints, "blue");
        }
        renderPoints(sideReferenceOrigin.map((p) => ({ ...p, x: p.x + 200 })), "red");
        if (sideNewPoints) {
            renderPoints(sideNewPoints.map((p) => ({ ...p, x: p.x + 200 })), "blue");
        }
    });
    cleanUps.push(() => canvas.parentElement?.removeChild(canvas));
}
const getShiftedPoint = (mapped) => {
    const minX = Math.min(...mapped.map((m) => m.x));
    const minY = Math.min(...mapped.map((m) => m.y));
    const normalized = mapped.map((p) => ({
        x: p.x - minX,
        y: p.y - minY,
    }));
    const width = Math.max(...normalized.map((p) => p.x));
    const height = Math.max(...normalized.map((p) => p.y));
    const scale = Math.min(200 / width, 200 / height);
    const origin = {
        x: (200 - width * scale) / 2,
        y: (200 - height * scale) / 2,
    };
    return normalized.map((p) => ({
        x: p.x * scale + origin.x,
        y: p.y * scale + origin.y,
    }));
};
const getSelectedCoordinate = (render) => {
    const store = window._annotationStore;
    const selected = store.annotation.mode.slotInstances[0];
    const convert = (x, y, axis) => {
        const { quaternion, translation } = store.taskParams.record.metadata.additionalInfo.lidarParams[store.timeline.currentFrame].lidarToWorld;
        const matrix = new window.THREE.Matrix4().fromArray(selected.asBox3D.box);
        if (axis === "top") {
            return new window.THREE.Vector3(x, y, 0)
                .applyMatrix4(matrix)
                .applyQuaternion(new window.THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w))
                .add(translation);
        }
        else {
            const result = new window.THREE.Vector3(0, x, y)
                .applyMatrix4(matrix)
                .applyQuaternion(new window.THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w))
                .add(translation);
            // noinspection JSSuspiciousNameCombination
            return { x: result.y, y: result.z };
        }
    };
    const referenceOrigin = [
        convert(-0.5, -0.5, "top"),
        convert(-0.5, 0.5, "top"),
        convert(0.5, 0.5, "top"),
        convert(0.5, -0.5, "top"),
    ];
    const sideReferenceOrigin = [
        convert(-0.5, -0.5, "side"),
        convert(-0.5, 0.5, "side"),
        convert(0.5, 0.5, "side"),
        convert(0.5, -0.5, "side"),
    ];
    render({
        referencePoints: getShiftedPoint(referenceOrigin),
        sideReferenceOrigin: getShiftedPoint(sideReferenceOrigin),
    });
    const interval = setInterval(() => {
        if (store.annotation.mode.slotInstances?.[0] == null) {
            cleanUps.forEach((f) => f());
            cleanUps = [];
            return;
        }
        const newPoints = [
            convert(-0.5, -0.5, "top"),
            convert(-0.5, 0.5, "top"),
            convert(0.5, 0.5, "top"),
            convert(0.5, -0.5, "top"),
        ];
        const sideNewPoints = [
            convert(-0.5, -0.5, "side"),
            convert(-0.5, 0.5, "side"),
            convert(0.5, 0.5, "side"),
            convert(0.5, -0.5, "side"),
        ];
        const points = getShiftedPoint([...referenceOrigin, ...newPoints]);
        const sidePoints = getShiftedPoint([
            ...sideReferenceOrigin,
            ...sideNewPoints,
        ]);
        render({
            referencePoints: points.slice(0, 4),
            sideReferenceOrigin: sidePoints.slice(0, 4),
            newPoints: points.slice(4),
            sideNewPoints: sidePoints.slice(4),
        });
    }, 1000);
    cleanUps.push(() => clearInterval(interval));
};
(function () {
    "use strict";
    addEventListener("keyup", (ev) => {
        if (ev.code === "KeyZ" && ev.altKey) {
            cleanUps.forEach((f) => f());
            cleanUps = [];
            // @ts-ignore
            const store = window._annotationStore;
            if (!["POINTCLOUD_SET_SEQUENCE", "POINTCLOUD_SEQUENCE"].includes(store.taskParams.record.attachmentType)) {
                return;
            }
            if (store.annotation.mode.slotInstances[0] == null) {
                return;
            }
            markReference();
        }
    });
})();
