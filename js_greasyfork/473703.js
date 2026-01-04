// ==UserScript==
// @name         ShowSpinnerCount (Greasemonkey Ver)
// @namespace    osu
// @version      1.0.1
// @description  Adds spinner count to beatmap pages
// @author       Magnus Cosmos
// @match        https://osu.ppy.sh/*
// @match        https://lazer.ppy.sh/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473703/ShowSpinnerCount%20%28Greasemonkey%20Ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473703/ShowSpinnerCount%20%28Greasemonkey%20Ver%29.meta.js
// ==/UserScript==

const countSpinnerSvg = `"url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTYyLjUgNTYyLjUiIGhlaWdodD0iNTYyLjUiIHdpZHRoPSI1NjIuNSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgdmVyc2lvbj0iMS4xIiBpZD0ic3ZnNDE1NSI+PG1ldGFkYXRhIGlkPSJtZXRhZGF0YTQxNjEiPjxyZGY6UkRGPjxjYzpXb3JrIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZSByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIi8+PGRjOnRpdGxlLz48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMgaWQ9ImRlZnM0MTU5Ii8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMS4yNSwwLDAsLTEuMjUsMCw1NjIuNSkiIGlkPSJnNDE2MyI+PGcgaWQ9Imc0MTY1Ii8+PGcgaWQ9Imc0MTY3Ij48cGF0aCBpZD0icGF0aDQxNjkiIHN0eWxlPSJmaWxsOiM0NDExODg7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmUiIGQ9Im0gNDEwLjg2MzEsMTQ1LjY5OCBjIDQzLjc5NzIsNDMuNzk3MyA0My43OTcyLDExNC44MDY3IDAsMTU4LjYwNCAwLDAgLTEwNi41NjExLDEwNi41NjExIC0xMDYuNTYxMSwxMDYuNTYxMSAtNDMuNzk3Myw0My43OTcyIC0xMTQuODA2Nyw0My43OTcyIC0xNTguNjA0LDAgMCwwIC0xMDYuNTYxMDksLTEwNi41NjExIC0xMDYuNTYxMDksLTEwNi41NjExIC00My43OTcyNTksLTQzLjc5NzMgLTQzLjc5NzI1OSwtMTE0LjgwNjcgMCwtMTU4LjYwNCAwLDAgMTA2LjU2MTA5LC0xMDYuNTYxMDkgMTA2LjU2MTA5LC0xMDYuNTYxMDkgNDMuNzk3MywtNDMuNzk3MjU5IDExNC44MDY3LC00My43OTcyNTkgMTU4LjYwNCwwIDAsMCAxMDYuNTYxMSwxMDYuNTYxMDkgMTA2LjU2MTEsMTA2LjU2MTA5IHoiLz48cGF0aCBpZD0icGF0aDQxNzEiIHN0eWxlPSJmaWxsOiNmZmRkNTU7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUiIGQ9Im0gMzMxLjI1LDIyNSBjIDAsLTU4LjU5MzggLTQ3LjY1NjMsLTEwNi4yNSAtMTA2LjI1LC0xMDYuMjUgLTU4LjU5MzgsMCAtMTA2LjI1LDQ3LjY1NjIgLTEwNi4yNSwxMDYuMjUgMCw1OC41OTM4IDQ3LjY1NjIsMTA2LjI1IDEwNi4yNSwxMDYuMjUgNTguNTkzNywwIDEwNi4yNSwtNDcuNjU2MiAxMDYuMjUsLTEwNi4yNSB6IE0gMzc1LDIyNSBDIDM3NSwzMDcuODEyNSAzMDcuODEyNSwzNzUgMjI1LDM3NSAxNDIuMTg3NSwzNzUgNzUsMzA3LjgxMjUgNzUsMjI1IDc1LDE0Mi4xODc1IDE0Mi4xODc1LDc1IDIyNSw3NSBjIDgyLjgxMjUsMCAxNTAsNjcuMTg3NSAxNTAsMTUwIHoiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjc1LDAsMCwtMC43NSwwLDQ1MCkiIGlkPSJnNDE3MyI+PHBhdGggaWQ9InBhdGg0MTc1IiBzdHlsZT0iZmlsbDogI2ZmZGQ1NTsiIGQ9Im0gMzAwLDIxOC43NTk4IGMgNDQuODY3NywwIDgxLjI0MDIsMzYuMzcyNSA4MS4yNDAyLDgxLjI0MDIgMCw0NC44Njc3IC0zNi4zNzI1LDgxLjI0MDIgLTgxLjI0MDIsODEuMjQwMiAtNDQuODY3NywwIC04MS4yNDAyLC0zNi4zNzI1IC04MS4yNDAyLC04MS4yNDAyIDAsLTQ0Ljg2NzcgMzYuMzcyNSwtODEuMjQwMiA4MS4yNDAyLC04MS4yNDAyIHoiLz48L2c+PC9nPjwvZz48L3N2Zz4=)"`;

window.eval(`
function getReact() {
    return new Promise((resolve) => {
        const defineProperty = Object.defineProperty;
        Object.defineProperty = function () {
            defineProperty.apply(this, arguments);
            const prop = arguments[1];
            const descriptor = arguments[2];
            if (descriptor.get && descriptor.get.a) {
                if ("createElement" in descriptor.get.a) {
                    Object.defineProperty = defineProperty;
                    resolve(descriptor.get.a);
                }
            }
        }
    });
}

getReact().then((react) => {
    const createElement = react.createElement;
    react.createElement = function() {
        const r = createElement.apply(this, arguments);
        if (arguments[1]?.className === "beatmap-basic-stats") {
            const countSpinners = r._owner.stateNode.renderEntry("count_spinners");
            countSpinners.props.children[0].props.style.backgroundImage = ${countSpinnerSvg};
            countSpinners.props.title = "Spinner Count";
            r.props.children.push(countSpinners);
        }
        return r;
    }
});`);

function addStyle(css) {
    const head = document.querySelector("head");
    if (head) {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = css.replace(/;/g, " !important;");
        head.appendChild(style);
    }
}

addStyle(`
@media (min-width: 900px) {
    .beatmapset-header {
        grid-template-columns: 1fr 320px;
    }
    .beatmapset-info {
        grid-template-columns: 1fr 175px 320px;
    }
}`);
