// ==UserScript==
// @name         GB688 downloader;国标网下载
// @version      2024.12.23.01
// @license      Apache-2.0
// @namespace    https://github.com/yikuaibaiban/gb688_downloader
// @description  基于国标网显示规律在本地拼合成PDF并提供下载
// @author       yikuaibaiban
// @icon         data:image/png;base64,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
// @match        http://c.gb688.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/510224/GB688%20downloader%3B%E5%9B%BD%E6%A0%87%E7%BD%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/510224/GB688%20downloader%3B%E5%9B%BD%E6%A0%87%E7%BD%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function initStyles() {
    let style = document.createElement("style");
    style.appendChild(document.createTextNode(`.downloader_container {    position: fixed;    height: 40px;    width: 120px;    top: calc(50% - 20px);    right: 20px;}.downloader_container button {    width: 100%;    height: 40px;    background-color: blueviolet;    border: none;    color: white;    line-height: 40px;    text-align: center;    font-size: 20px;    border-radius: 5px;    transition: all 0.3s;    display: flex;    justify-content: center;    align-items: center;}.downloader_container button:hover {    background-color: dodgerblue;}@keyframes loading {    0% {        transform: rotate(0deg);    }    100% {        transform: rotate(360deg);    }}.loading {    width: 18px;    height: 18px;    margin-right: 5px;    animation: loading 1s infinite;}`));
    document.head.appendChild(style);
})();

let viewGbImgCache = [];

async function interceptsXHRCallback(url, response, method, readyState) {
    if (readyState !== 4) return;

    if (url.includes("viewGbImg?fileName=")) {
        let finds = viewGbImgCache.filter(item => item.url === url);
        if (!finds.length) {
            let img = new Image();
            img.src = await blobToBase64(response);//URL.createObjectURL(response);
            viewGbImgCache.push({url, img});
        }
    }
}

interceptsXHR(interceptsXHRCallback);

function interceptsXHR(callback) {
    const open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this.addEventListener('readystatechange', function () {
            callback(url, this.response, method, this.readyState);
        });
        open.apply(this, arguments);
    }
}
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64String = reader.result;
            resolve(base64String);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
}

function downloadPDF() {
    let downloadBtn = document.querySelector('#downloadBtn');
    downloadBtn.disabled = true;

    let loadingIcon = new Image();
    loadingIcon.src =
        'data:image/png;base64,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';
    loadingIcon.className = 'loading';
    downloadBtn.insertBefore(loadingIcon, downloadBtn.children[0]);

    let pheight = document.querySelector('div.page').clientHeight;
    let pwidth = document.querySelector('div.page').clientWidth;

    let qwidth = pwidth * 0.1;
    let qheight = pheight * 0.1;

    let canvasArray = new Array();

    let progressText = document.querySelector('#progressText');

    progressText.innerHTML = "正在提取图片...";
    document.querySelectorAll('.page').forEach(function (elem, i) {
        let canvas = document.createElement('canvas');
        canvas.width = pwidth;
        canvas.height = pheight;
        canvas.setAttribute('complete', '0');
        canvasArray.push(canvas);

        if (elem.hasAttribute('bg')) {
            let url = "viewGbImg?fileName=" + elem.getAttribute('bg');

            let finds = viewGbImgCache.filter(item => item.url === url);
            if (!finds.length) {
                viewGbImgCache.push({url, img: null});
            }
        }
    });

    progressText.innerHTML = "正在下载图片...";
    viewGbImgCache.forEach((item, i) => {
        if (item.img !== null) {
            return;
        }

        fetch(item.url, {headers: {'Cache-Alive': 'chunked'}})
            .then((response) => {
                if (response.status === 200) {
                    return response.blob();
                }
            })
            .then(async (blob) => {
                let img = new Image();
                img.src = await blobToBase64(blob) // URL.createObjectURL(blob);
                viewGbImgCache[i].img = img;
            });
    });

    let timer1 = setInterval(() => {
        for (let i = 0; i < viewGbImgCache.length; i++) {
            if (viewGbImgCache[i].img === null) {
                return;
            }
        }

        clearInterval(timer1);

        progressText.innerHTML = "正在拼合图像...";
        document.querySelectorAll('.page').forEach((elem, i) => {
            let canvas = canvasArray[i];
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, pwidth, pheight);

            try {
                $(elem)
                    .children('span')
                    .each(function (j, s) {
                        ctx.drawImage(
                            viewGbImgCache[i === 0 ? 0 : Math.ceil(i / 4) - 1].img,
                            -parseInt($(s).css('background-position-x')),
                            -parseInt($(s).css('background-position-y')),
                            qwidth,
                            qheight,
                            $(s).attr('class').split('-')[1] * qwidth,
                            $(s).attr('class').split('-')[2] * qheight,
                            qwidth + 1,
                            qheight
                        );
                    });
            } catch (e) {
                console.log(viewGbImgCache[i === 0 ? 0 : Math.ceil(i / 4) - 1].img);
            }

            canvas.setAttribute('complete', '1');
        });
    }, 500);

    let timer = setInterval(() => {
        for (let i = 0; i < canvasArray.length; i++) {
            const element = canvasArray[i];
            if (element.getAttribute('complete') != '1') {
                return;
            }
        }

        progressText.innerHTML = "正在转换PDF...";

        const {jsPDF} = window.jspdf;
        const pdf = new jsPDF('p', 'px', [pwidth, pheight]);

        let title = $('title').text().split('|')[1].toString().trim();
        canvasArray.forEach(function (e, i) {
            progressText.innerHTML = `正在转换PDF（${i + 1}/${canvasArray.length}）...`;
            pdf.addImage(
                e.toDataURL('image/jpeg'),
                'jpeg',
                0,
                0,
                pwidth,
                pheight,
                '',
                'MEDDIUM'
            );
            pdf.addPage();
        });

        let targetPage = pdf.internal.getNumberOfPages();
        pdf.deletePage(targetPage);

        progressText.innerHTML = "PDF转换完成...";

        pdf.save(title + '.pdf');
        clearInterval(timer);
        downloadBtn.disabled = false;
        downloadBtn.removeChild(downloadBtn.children[0]);
    }, 500);
}

function init() {
	var jspdfScript = document.createElement('script');
	jspdfScript.src =
		'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
	document.querySelector('head').appendChild(jspdfScript);

	var container = document.createElement('div');
	document.querySelector('body').appendChild(container);
	container.className = 'downloader_container';
	container.style.zIndex = "999";

	var downloadButton = document.createElement('button');
	container.appendChild(downloadButton);
	downloadButton.innerHTML = '<span>下载PDF</span>';
	downloadButton.addEventListener('click', downloadPDF);
	downloadButton.id = 'downloadBtn';

	var progressText = document.createElement('span');
	container.appendChild(progressText);
	progressText.id = 'progressText';
	progressText.innerHTML = '如需滚动请缓慢滚动，以免缓存图像错位';
}


(async function () {
    init()
})();