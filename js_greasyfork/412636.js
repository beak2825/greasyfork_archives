// ==UserScript==
// @name         Pixiv Previewer
// @namespace    https://github.com/lintmx
// @version      0.0.1
// @description  preview image in pixiv.
// @author       lintmx
// @license      MIT
// @match        https://www.pixiv.net*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/412636/Pixiv%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/412636/Pixiv%20Previewer.meta.js
// ==/UserScript==

const isDev = false;

const Logger = {
    debug: (...msg) => isDev && console.log('[Pixiv Previewer]', 'DEBUG:', ...msg),
    info: (...msg) => console.log('[Pixiv Previewer]', 'INFO:', ...msg),
    error: (...msg) => console.log('[Pixiv Previewer]', 'ERROR:', ...msg),
};

const Icon = {
    Expand:
        'data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJleHBhbmQtYWx0IiBjbGFzcz0ic3ZnLWlubGluZS0tZmEgZmEtZXhwYW5kLWFsdCBmYS13LTE0IiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0OCA1MTIiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTIxMi42ODYgMzE1LjMxNEwxMjAgNDA4bDMyLjkyMiAzMS4wMjljMTUuMTIgMTUuMTIgNC40MTIgNDAuOTcxLTE2Ljk3IDQwLjk3MWgtMTEyQzEwLjY5NyA0ODAgMCA0NjkuMjU1IDAgNDU2VjM0NGMwLTIxLjM4MiAyNS44MDMtMzIuMDkgNDAuOTIyLTE2Ljk3MUw3MiAzNjBsOTIuNjg2LTkyLjY4NmM2LjI0OC02LjI0OCAxNi4zNzktNi4yNDggMjIuNjI3IDBsMjUuMzczIDI1LjM3M2M2LjI0OSA2LjI0OCA2LjI0OSAxNi4zNzggMCAyMi42Mjd6bTIyLjYyOC0xMTguNjI4TDMyOCAxMDRsLTMyLjkyMi0zMS4wMjlDMjc5Ljk1OCA1Ny44NTEgMjkwLjY2NiAzMiAzMTIuMDQ4IDMyaDExMkM0MzcuMzAzIDMyIDQ0OCA0Mi43NDUgNDQ4IDU2djExMmMwIDIxLjM4Mi0yNS44MDMgMzIuMDktNDAuOTIyIDE2Ljk3MUwzNzYgMTUybC05Mi42ODYgOTIuNjg2Yy02LjI0OCA2LjI0OC0xNi4zNzkgNi4yNDgtMjIuNjI3IDBsLTI1LjM3My0yNS4zNzNjLTYuMjQ5LTYuMjQ4LTYuMjQ5LTE2LjM3OCAwLTIyLjYyN3oiPjwvcGF0aD48L3N2Zz4=',
    Redirect:
        'data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJsb2NhdGlvbi1hcnJvdyIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWxvY2F0aW9uLWFycm93IGZhLXctMTYiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNNDQ0LjUyIDMuNTJMMjguNzQgMTk1LjQyYy00Ny45NyAyMi4zOS0zMS45OCA5Mi43NSAxOS4xOSA5Mi43NWgxNzUuOTF2MTc1LjkxYzAgNTEuMTcgNzAuMzYgNjcuMTcgOTIuNzUgMTkuMTlsMTkxLjktNDE1Ljc4YzE1Ljk5LTM4LjM5LTI1LjU5LTc5Ljk3LTYzLjk3LTYzLjk3eiI+PC9wYXRoPjwvc3ZnPg==',
};

const Previewer = {
    addButton: () => {
        Logger.debug('Start Add Button');
        const illustList = document.querySelectorAll('div[type=illust]>div:not(.pixiv-previewer-btn-exist)');

        for (const illust of illustList) {
            const previewButton = document.createElement('div');
            previewButton.className = 'pixiv-previewer-view-btn';
            previewButton.style.cssText = [
                'position: absolute',
                'left: 0px',
                'bottom: 0px',
                'width: 32px',
                'height: 32px',
                'cursor: pointer',
                'background: no-repeat center/50%',
                'background-image: url("' + Icon.Expand + '")',
            ].join(';');
            previewButton.innerHTML = '&nbsp;';
            previewButton.addEventListener('click', (e) => {
                const clickImgElm = e.target.parentNode.querySelector('a>div:last-child>img');
                const pageSizeElm = e.target.parentNode.querySelector(
                    'a>div:first-child>div:last-child>div>span:last-child'
                );

                if (!clickImgElm) return;

                const imgUrl = clickImgElm.src;
                const pageSize = pageSizeElm ? pageSizeElm.innerText : '1';

                Previewer.showPreview(imgUrl, pageSize);
            });

            illust.appendChild(previewButton);
            illust.classList.add('pixiv-previewer-btn-exist');
        }
    },
    showPreview: (url, pageSize = 1) => {
        const { Time, IllustId } = Previewer.convert(url);
        const Cover = document.querySelector('#pixiv-previewer-cover');
        Cover.style.display = 'flex';
        Cover.dataset.time = Time;
        Cover.dataset.id = IllustId;
        Cover.dataset.size = pageSize;
        Cover.dataset.page = 0;
        document.querySelector('#pixiv-previewer-redirect').href = 'https://www.pixiv.net/artworks/' + IllustId;
        document.querySelector(
            '#pixiv-previewer-image'
        ).src = `https://i.pximg.net/img-master/img/${Time}/${IllustId}_p0_master1200.jpg`;
    },
    convert: (baseUrl = '') => {
        const [, Time = '', IllustId = ''] = baseUrl.match(
            /^https:\/\/i\.pximg\.net\/.+?\/img\/([0-9\/]+?)\/(\d+?)_p.+?\.[a-z]+$/
        );

        return { Time, IllustId };
    },
};

(function () {
    ('use strict');
    Logger.debug('Script Start.');

    const rootElm = document.querySelector('#root');

    // 全屏预览遮罩
    const previewCover = document.createElement('div');
    previewCover.id = 'pixiv-previewer-cover';
    previewCover.style.cssText = [
        'z-index: 445',
        'width: 100%',
        'height: 100%',
        'position: fixed',
        'left: 0px',
        'right: 0px',
        'top: 0px',
        'bottom: 0px',
        'display: none',
        'justify-content: center',
        'align-items: center',
        'flex-direction: column',
        'background: rgba(0, 0, 0, 0.6)',
    ].join(';');
    previewCover.addEventListener('click', (e) => {
        Logger.debug('cover click.');
        e.target.style.display = 'none';
    });

    const previewRedirect = document.createElement('a');
    previewRedirect.id = 'pixiv-previewer-redirect';
    previewRedirect.style.cssText = [
        'width: 32px',
        'height: 32px',
        'background: red',
        'margin-top: 16px',
        'display: block',
        'background: no-repeat center',
        'background-image: url("' + Icon.Redirect + '")',
    ].join(';');
    previewCover.appendChild(previewRedirect);

    const previewImage = document.createElement('img');
    previewImage.id = 'pixiv-previewer-image';
    previewImage.style.cssText = ['max-width: 90%', 'max-height: 90%', 'margin: auto'].join(';');
    previewImage.addEventListener('click', (e) => {
        e.stopPropagation();

        const Cover = document.querySelector('#pixiv-previewer-cover');
        const { time, id, size } = Cover.dataset;
        let { page = 0 } = Cover.dataset;

        let next = Number.parseInt(page, 10) + 1;
        if (next + 1 > size) {
            next = 0;
        }

        if (next != page) {
            document.querySelector(
                '#pixiv-previewer-image'
            ).src = `https://i.pximg.net/img-master/img/${time}/${id}_p${next}_master1200.jpg`;
            Cover.dataset.page = next;
        }

        Logger.debug('click image');
    });
    previewCover.appendChild(previewImage);

    rootElm.appendChild(previewCover);

    setInterval(Previewer.addButton, 1000);

    Logger.debug('Script End.');
})();
