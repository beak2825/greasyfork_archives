// ==UserScript==
// @name    Slowly Save Helper
// @description    add a save button on slowly's web version, which can save letter as pdf
// @match    https://web.getslowly.com/friend/*
// @version    1.3
// @copyright    2020,01,26; By duke
// @github    https://github.com/DukeLuo/duke-user-js
// @namespace    https://github.com/DukeLuo/duke-user-js
// @require    https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js
// @downloadURL https://update.greasyfork.org/scripts/395838/Slowly%20Save%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/395838/Slowly%20Save%20Helper.meta.js
// ==/UserScript==

; (function () {
    'use strict';

    const slowlyHeaderMenuSelector = '.App-header .container .col:last-child';
    const letterContainerSelector = '.main-scroller .friend-letters-wrapper > .row';
    const letterContentSelector = '.main-scroller .main-container .friend-Letter-wrapper';
    const profileAvatarSelector = '.App-header .container .col:last-child button:first-child img';
    const friendAvatarSelector = '.friend-header img.link';

    // saving button
    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');

        div.innerHTML = htmlString.trim();

        return div.firstChild;
    }

    function insertCSS(style) {
        const styleSheet = document.createElement("style");

        styleSheet.type = "text/css";
        styleSheet.innerText = style;
        document.head.appendChild(styleSheet);
    }

    function addSaveButton() {
        const buttonStyle = `
        .icon-download3:before {
            content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAAk0lEQVRYhe2VXQqAIBAGp+gMEd3/SGF0GnuSIvzbMrZgByS0dh0+hcAwPopvMBwwaQp4YAPmJwKltdh6mK+npziJFgIjsHAzCYlArnbiSMJpCASJZG2XaXJ9X7N5qnesHwC9sGlzBsG3qbQeoZ6AukDtEUgvYKB4bL9JIFB7EasTU0/ABExAXaD0N3x9P/UEDEOdHSNaUUMYGcVmAAAAAElFTkSuQmCC");
        }`;
        const buttonHtmlString =
            `<button type="button" class="btn btn-default btn-toolbar mr-3" title="Saving">
        <i class="icon-download3 h4 text-lighter"></i>
        </button>`;
        const saveButton = createElementFromHTML(buttonHtmlString);

        saveButton.addEventListener('click', save);
        document.querySelector(slowlyHeaderMenuSelector).appendChild(saveButton);
        insertCSS(buttonStyle);
    }

    // add stamp
    function addStampStyle() {
        const stampStyle = `
            .stamp-nth {
                display: inline-block;
                position: absolute;
                top: 10%;
                left: 5%;
                color: #555;
                font-size: 3rem;
                font-weight: 700;
                font-family: 'Courier';
                padding: 0.25rem 1rem;
                border: 0.25rem solid #555;
                border-radius: 1rem;
                transform: rotate(12deg);
            }
        `;

        insertCSS(stampStyle);
    }

    function createStamp(content) {
        const stampHtml = `
            <span class="stamp-nth">${content}</span>
        `;

        return createElementFromHTML(stampHtml);
    }

    // mask layer
    function addMaskStyle() {
        const maskStyle = `
            .mask {
                width: 100%;
                height: 100%;
                position: fixed;
                top: 0px;
                left: 0px;
                background-color: black;
                opacity: 0.5;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 6rem;
                font-weight: 700;
                color: #444;
                z-index: 9999999999993;
            }
        `;

        insertCSS(maskStyle);
    }

    function addMask() {
        const maskHtml = `
            <div class='mask'>Please wait for a while...</div>
        `;
        const mask = createElementFromHTML(maskHtml);

        addMaskStyle();
        document.body.appendChild(mask);
    }

    function removeMask() {
        const mask = document.querySelector('.mask');

        mask.parentNode.removeChild(mask);
    }

    // letter to pdf
    function getFileName() {
        const profileAvatar = document.querySelector(profileAvatarSelector);
        const friendAvatar = document.querySelector(friendAvatarSelector);

        return `${profileAvatar.alt.toLowerCase()}-${friendAvatar.alt.toLowerCase()}`;
    }

    async function html2canvasWithOption(element) {
        const options = {
            scale: 2,
            useCORS: true,
        };

        return await html2canvas(element, options);
    }

    async function addCover(pdf) {
        const profileAvatar = document.querySelector(profileAvatarSelector);
        const friendAvatar = document.querySelector(friendAvatarSelector);
        profileAvatar.style.width = '100px';
        profileAvatar.style.height = '100px';
        profileAvatar.style.borderWidth = '3px';
        friendAvatar.style.width = '100px';
        friendAvatar.style.height = '100px';
        const profileAvatarCanvas = await html2canvasWithOption(profileAvatar);
        const friendAvatarCanvas = await html2canvasWithOption(friendAvatar);

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.setFontSize(80);
        pdf.text('SLOWLY', pageWidth / 2, pageHeight * 0.4, {
            align: 'center',
            charSpace: '4',
        });
        pdf.addImage(profileAvatarCanvas.toDataURL('image/png'), 'PNG', pageWidth / 2 - 110, pageHeight * 0.6, 100, 100, '', 'FAST');
        pdf.addImage(friendAvatarCanvas.toDataURL('image/png'), 'PNG', pageWidth / 2 + 10, pageHeight * 0.6, 100, 100, '', 'FAST');
        pdf.setFillColor('#ffc300');
        pdf.triangle(pageWidth, pageHeight, pageWidth - 100, pageHeight, pageWidth, pageHeight - 100, 'F');
        pdf.setTextColor('#ffffff');
        pdf.setFontSize(20);
        pdf.text('dukeluo', pageWidth, pageHeight - 5, {
            align: 'right',
            angle: '45',
        });
    }

    async function addPdfPage(element, pdf, order) {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        element.style.width = `${pageWidth}px`;
        element.style.position = 'relative';    // position for stamp
        element.querySelector('.letter').style.border = 'none';
        element.querySelector('.letter').style.boxShadow = 'none';
        const deleteButton = element.querySelector('.modal-footer .link');
        deleteButton.parentNode.removeChild(deleteButton);
        element.appendChild(createStamp(`${order + 1}th letter`));

        const canvas = await html2canvasWithOption(element);
        const imgWidth = pageWidth;
        const imgHeight = canvas.height / canvas.width * imgWidth;
        const times = canvas.height / (pageHeight * 2);
        const count = times % Math.floor(times) < 0.1 ? Math.floor(times) : Math.ceil(times); // html2canvas options
        Array.from(Array(count).keys()).forEach((i) => {
            pdf.addPage(pageWidth, pageHeight);
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, - i * pageHeight, imgWidth, imgHeight, '', 'FAST');
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function findContentDom(order) {
        const cardDomSelector = `.main-scroller .friend-letters-wrapper > .row div:nth-child(${order + 1}) a.card`;
        const cardDom = document.querySelector(cardDomSelector);
        cardDom.click();

        return document.querySelector(letterContentSelector);
    }

    async function back() {
        window.history.back();
        await sleep(300);
    }

    async function save() {
        const name = `${getFileName()}.pdf`;
        const pdf = new jsPDF('p', 'pt', 'a4', true);

        addMask();
        await addCover(pdf);
        scrollToBottom().then(
            () => {
                const letterCount = document.querySelector(letterContainerSelector).childElementCount;

                console.log(`total letter: ${letterCount}`);
                Array.from(Array(letterCount).keys()).reverse().reduce(
                    (chain, order, index) => chain.then(
                        async () => {
                            await addPdfPage(findContentDom(order), pdf, index);
                            await back();
                            console.log(`saved ${index + 1}th letter`);
                        }
                    ),
                    Promise.resolve()).then(
                        () => {
                            pdf.save(name);
                            removeMask();
                        }
                    );
            });
    }

    function scrollToBottom() {
        let count = 10;

        return new Promise((resolve) => {
            const scrollInterval = setInterval(
                () => {
                    if (!count) {
                        stopScroll();
                        return resolve();
                    }
                    window.scrollTo(0, document.body.scrollHeight);
                    count -= 1;
                },
                800);
            const stopScroll = () => clearInterval(scrollInterval);
        });
    }

    // init
    addSaveButton();
    addStampStyle();
})();