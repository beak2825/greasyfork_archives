// ==UserScript==
// @name                AcFun-ScrollVolume
// @name:zh-CN          AcFun-滚轮调音量
// @namespace           https://github.com/TitanRGB
// @version             3.4
// @description         Change AcFun's volume by scroll, imitate Bilibili's style.
// @description:zh-CN   滚动滚轮调节AcFun的音量，模仿B站样式。
// @author              https://github.com/TitanRGB
// @icon                data:image/png;base64,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
// @match               http*://acfun.cn
// @match               http*://acfun.cn/*
// @match               http*://www.acfun.cn
// @match               http*://www.acfun.cn/*
// @license             MPL-2.0
// @license^            Mozilla Public License 2.0
// @grant               unsafeWindow
// @charset		        UTF-8
// @homepageURL         https://github.com/SynRGB/AcFun-ScrollVolume
// @contributionURL     https://github.com/SynRGB/AcFun-ScrollVolume
// @copyright           Copyright © 2022-PRESENT, TitanRGB (https://github.com/TitanRGB)
// @downloadURL https://update.greasyfork.org/scripts/453260/AcFun-ScrollVolume.user.js
// @updateURL https://update.greasyfork.org/scripts/453260/AcFun-ScrollVolume.meta.js
// ==/UserScript==

// ./icon/bilibili#bpx-svg-sprite-volume
let icon_volume = `
data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjIgMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNMTAuMTg4IDQuNjVMNiA4SDVhMiAyIDAgMDAtMiAydjJhMiAyIDAgMDAyIDJoMWw0LjE4OCAzLjM1YS41LjUgMCAwMC44MTItLjM5VjUuMDRhLjQ5OC40OTggMCAwMC0uODEyLS4zOXpNMTQuNDQ2IDMuNzc4YTEgMSAwIDAwLS44NjIgMS44MDQgNi4wMDIgNi4wMDIgMCAwMS0uMDA3IDEwLjgzOCAxIDEgMCAwMC44NiAxLjgwNkE4LjAwMSA4LjAwMSAwIDAwMTkgMTFhOC4wMDEgOC4wMDEgMCAwMC00LjU1NC03LjIyMnoiLz4KICAgIDxwYXRoIGQ9Ik0xNSAxMWEzLjk5OCAzLjk5OCAwIDAwLTItMy40NjV2Ni45M0EzLjk5OCAzLjk5OCAwIDAwMTUgMTF6Ii8+Cjwvc3ZnPg==
`;
// ./icon/bilibili#bpx-svg-sprite-volume-off
let icon_volume_off = `
data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjIgMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNMTUgMTFhMy45OTggMy45OTggMCAwMC0yLTMuNDY1djIuNjM2bDEuODY1IDEuODY1QTQuMDIgNC4wMiAwIDAwMTUgMTF6Ii8+CiAgICA8cGF0aCBkPSJNMTMuNTgzIDUuNTgzQTUuOTk4IDUuOTk4IDAgMDExNyAxMWE2IDYgMCAwMS0uNTg1IDIuNTg3bDEuNDc3IDEuNDc3YTguMDAxIDguMDAxIDAgMDAtMy40NDYtMTEuMjg2IDEgMSAwIDAwLS44NjMgMS44MDV6TTE4Ljc3OCAxOC43NzhsLTIuMTIxLTIuMTIxLTEuNDE0LTEuNDE0LTEuNDE1LTEuNDE1TDEzIDEzbC0yLTItMy44ODktMy44ODktMy44ODktMy44ODlhLjk5OS45OTkgMCAxMC0xLjQxNCAxLjQxNEw1LjE3MiA4SDVhMiAyIDAgMDAtMiAydjJhMiAyIDAgMDAyIDJoMWw0LjE4OCAzLjM1YS41LjUgMCAwMC44MTItLjM5di0zLjEzMWwyLjU4NyAyLjU4Ny0uMDEuMDA1YTEgMSAwIDAwLjg2IDEuODA2Yy4yMTUtLjEwMi40MjQtLjIxNC42MjctLjMzM2wyLjMgMi4zYTEuMDAxIDEuMDAxIDAgMDAxLjQxNC0xLjQxNnpNMTEgNS4wNGEuNS41IDAgMDAtLjgxMy0uMzlMOC42ODIgNS44NTQgMTEgOC4xNzJWNS4wNHoiLz4KPC9zdmc+
`;

// 当滚动滚轮, 模拟按下↑↓
let main = function (e) {
    // 仅在全屏时生效
    if (document.querySelector('[data-bind-attr="screen"]') !== null) {
        if (e.wheelDelta) {
            //// Chrome
            // 向上滚动
            if (e.wheelDelta > 0) {
                unsafeWindow.player.volume++;
            }
            // 向下滚动
            if (e.wheelDelta < 0) {
                // pressKey(40);
                unsafeWindow.player.volume--;
            }
        } else if (e.detail) {
            //// Firefox
            // 向上滚动
            if (e.detail > 0) {
                unsafeWindow.player.volume++;
            }
            // 向下滚动
            if (e.detail < 0) {
                unsafeWindow.player.volume--;
            }
        }
        // 音量显示
        try {
            document.querySelector('#volumeDiv').remove();
        } catch (e) {
        }
        let volume = unsafeWindow.player.volume;
        //////////////////////////////////////////////////////////////
        let volumeIcon = document.createElement('span');
        let volumeIconInnerSpan = document.createElement('span');
        let volumeIconImg = document.createElement('img');
        if (volume < 1) {
            volumeIconImg.setAttribute('src', icon_volume_off);
        } else {
            volumeIconImg.setAttribute('src', icon_volume);
        }
        volumeIconImg.setAttribute('style', `
                    width: 100%;
                    height: 100%;
                    -webkit-transition: fill .15s ease-in-out;
                    transition: fill .15s ease-in-out;
                `);
        volumeIconInnerSpan.setAttribute('style', `
                    display: -webkit-inline-box;
                    display: -ms-inline-flexbox;
                    display: inline-flex;
                    width: 100%;
                    height: 100%;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                `);
        volumeIcon.setAttribute('style', `
                    -webkit-box-flex: 0;
                    -ms-flex: none;
                    flex: none;
                    width: 34px;
                    height: 34px;
                `);
        volumeIcon.appendChild(volumeIconImg);
        //////////////////////////////////////////////////////////////
        let volumeSpan = document.createElement('span');
        // 当volume实际为100时，返回值是大于99的小数
        // 当volume实际为0时，返回值是小于1的小数
        if (volume > 99) {
            volumeSpan.innerHTML = '100%';
        } else if (volume < 1) {
            volumeSpan.innerHTML = '0%';
        } else if (volume > 9) {
            volumeSpan.innerHTML = volume.toString().substring(0, 2).replace('.', '') + '%';
        } else {
            volumeSpan.innerHTML = volume.toString().substring(0, 1).replace('.', '') + '%';
        }
        volumeSpan.setAttribute('style', `
                    -webkit-box-flex: 1;
                    -ms-flex: 1;
                    flex: 1;
                    padding: 0 2px;
                    line-height: 34px;
                    text-align: center;
                `);
        //////////////////////////////////////////////////////////////
        let volumeDiv = document.createElement('div');
        volumeDiv.setAttribute('id', 'volumeDiv');
        volumeDiv.setAttribute('style', `
                    position: absolute;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    top: 50%;
                    left: 50%;
                    min-width: 84px;
                    height: 32px;
                    padding: 8px;
                    color: #000;
                    font-size: 20px;
                    border-radius: 4px;
                    background: hsla(0,0%,100%,.8);
                    -webkit-transform: translate(-50%,-50%);
                    transform: translate(-50%,-50%);
                    z-index: 77;
                `);
        volumeDiv.appendChild(volumeIcon);
        volumeDiv.appendChild(volumeSpan);
        //////////////////////////////////////////////////////////////
        let screen = document.querySelector('[data-bind-attr="screen"]');
        screen.appendChild(volumeDiv);
        setTimeout(() => {
            screen.removeChild(volumeDiv);
        }, 500);
        //////////////////////////////////////////////////////////////
    }
};

document.addEventListener('wheel', main, false);

console.log("JS script AcFUN-ScrollVolume (AcFUN-滚轮调音量) loaded. See more details at https://github.com/SynRGB/AcFun-ScrollVolume");