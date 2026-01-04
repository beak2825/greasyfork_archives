// ==UserScript==
// @name         Coze Better
// @name:en      Coze Better
// @name:zh      Coze Better
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  🤖用于优化 扣子(coze)的功能体验，具体包括：⚡1. 对话中增加了导出Markdown功能（仅文本），方便用户保存和分享对话记录。⚡2. 为个人空间中的Bots添加了以用户模式启动的按钮（需先发布），方便直接使用自己的bot。⚡3. 优化了开发模式下窗口排布，使宽度可自行调节，并合并了提示词和功能配置为一列，节省界面空间。⚡4. 插件数据中的成功率和耗时数据增加彩色高亮，使其更直观的了解插件的情况。⚡5. 优化对话框输入框宽度和高度，使其更易于编辑长文本，以及其它细节调整。
// @description:en  🤖Optimize experience for Coze, including: ⚡1. Added the export Markdown feature (text only) in the conversation. ⚡2. Added buttons to start Bots in user mode (require published). ⚡3. Optimized layout in development mode, make width adjustable, and merged prompt and configuration into one column. ⚡4. Added highlighting to success rate and time-consuming in plugin data for a more intuitive display. ⚡5. Optimized the width/height of the input box, and other detailed adjustments.
// @author       Yearly
// @match        https://www.coze.com/*
// @match        https://www.coze.cn/*
// @icon data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzMiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMyAzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjNEQ1M0U4IiBkPSJNMCAwaDMzdjMzSDB6Ii8+PHBhdGggZD0iTTE2LjcgNS4xYTguNCA4LjQgMCAwIDAtOC4zIDguNFYxN0g2LjNjLTIuMyAwLTIuOCAzLjItLjYgMy45bDIuNi44djEuNWMwIDEuNSAxLjUgMi40IDIuOSAxLjhsMS40LS43aC4xYzEuMSAzLjcgNi40IDMuNyA3LjYgMGEuMS4xIDAgMCAxIC4xIDBsMS40LjdjMS4zLjYgMi45LS4zIDIuOS0xLjh2LTEuNWwyLjYtLjhjMi4xLS43IDEuNi0zLjktLjYtMy45aC0ydi0zLjVhOC40IDguNCAwIDAgMC04LjMtOC40IiBmaWxsPSIjRjlGOUY5Ii8+PC9zdmc+
// @grant        GM_addStyle
// @grant        window.onurlchange
// @license      AGPL-v3.0
// @homepage     https://greasyfork.org/zh-CN/scripts/497002-coze-better
// @downloadURL https://update.greasyfork.org/scripts/497002/Coze%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/497002/Coze%20Better.meta.js
// ==/UserScript==

(function() {

    GM_addStyle(`
    .bot-user-mode-div {
        margin: -10px 10px;
        direction: rtl;
        position: relative;
    }
    .bot-user-mode-btn {
        box-shadow: 1px 1px 3px 1px #0005;
        text-decoration: none;
    }
    .semi-button-primary.bot-need-publish-btn {
        background: #08B;
    }
    `);

    function addUserModeButtons() {
        function addButtonLoop() {
            const bots = document.querySelectorAll("#root section > section > main div.semi-spin-children > div > a[data-testid]");
            if (bots.length > 0) {
                bots.forEach(function(item) {
                    const bot_ele = item;
                    let bots_id = null;
                    let space_id = null;
                    Object.keys(bot_ele).forEach(function(attr) {
                        if (bot_ele[attr].return){
                            bots_id = bot_ele[attr].return.key
                        }
                    })
                    const sp_match = location.href.match(/\/space\/(\d+)\/bot/);
                    if (sp_match && sp_match[1]) {
                        space_id = sp_match[1];
                    }

                    if (!bots_id || !space_id || item.querySelector("div.bot-user-mode-div")) return;

                    if(item.href == null || item.href == '') {
                        item.href = `/space/${space_id}/bot/${bots_id}`;
                    }
                    item.target = "_blank";

                    const editLink = item.href;
                    const btnUser = document.createElement('div');
                    btnUser.className = "bot-user-mode-div";
                    item.append(btnUser);

                    if (item.querySelector("svg.icon-icon.coz-fg-hglt-green")) {
                        const userLink = editLink.replace(/\/space\/(.*)(\/bot\/.*)/, "/store$2?bot_id=true&space=$1");
                        btnUser.innerHTML = `<a class="semi-button semi-button-primary bot-user-mode-btn" href="${userLink}" target="_blank">Open in User Mode</a>`;
                    } else {
                        const publLink = editLink + "/publish";
                        btnUser.innerHTML = `<a class="semi-button semi-button-primary bot-user-mode-btn bot-need-publish-btn" href="${publLink}" target="_blank">Publish</a>`;
                    }

                    const disabledDiv = item.querySelector("div.PXJ4853Z3IeA21PJ0ygy  > div > div.q_zCj8QLjekm7_4bnIZU > div:first-child");
                    if (disabledDiv && disabledDiv.textContent === 'Disabled') {
                        btnUser.innerHTML = `<a class="semi-button bot-user-mode-btn semi-button-secondary-disabled" style="cursor:not-allowed; color:#666;" href="none" >Disabled</a>`;
                    }

                    item.addEventListener('click', function(event) {
                        event.stopPropagation();
                    });
                });
                setTimeout(addButtonLoop, 1000);
            } else {
                setTimeout(addButtonLoop, 800);
            }
        }
        addButtonLoop();
    }

    function exportMarkdown() {
        function convertToMarkdown(html) {
            let markdown = html
            .replace(/<b>(.*?)<\/b>/gi, '**$1**')
            .replace(/<i>(.*?)<\/i>/gi, '*$1*')
            .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<em>(.*?)<\/em>/gi, '*$1*')
            .replace(/<h1.*?>(.*?)<\/h1>/gi, '# $1\n')
            .replace(/<h2.*?>(.*?)<\/h2>/gi, '## $1\n')
            .replace(/<h3.*?>(.*?)<\/h3>/gi, '### $1\n')
            .replace(/<h4.*?>(.*?)<\/h3>/gi, '#### $1\n')
            .replace(/<h5.*?>(.*?)<\/h3>/gi, '##### $1\n')
            .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)')
            .replace(/<code>(.*?)<\/code>/gi, '`$1`');

            const parser = new DOMParser();
            const doc = parser.parseFromString(markdown, 'text/html');

            function countParents(node) {
                let depth = 0;
                while (node.parentNode) {
                    node = node.parentNode;
                    if (node.tagName && (node.tagName.toUpperCase() === 'UL' || node.tagName.toUpperCase() === 'OL')) {
                        depth++;
                    }
                }
                return depth;
            }

            function processList(element) {
                let md = '';
                const depth = countParents(element);
                let index = element.tagName.toUpperCase() === 'OL' ? 1 : null;

                element.childNodes.forEach(node => {
                    if (node.tagName && node.tagName.toLowerCase() === 'li') {
                        if (index != null) {
                            md += '<span> </span>'.repeat(depth*2) + `${index++}\. ${node.textContent.trim()}\n`;
                        } else {
                            md += '<span> </span>'.repeat(depth*2) + `- ${node.textContent.trim()}\n`;
                        }
                    }
                });
                return md;
            }

            Array.from(doc.querySelectorAll('ol, ul')).reverse().forEach(list => {
                list.outerHTML = processList(list);
            });

            doc.querySelectorAll("div.chat-uikit-multi-modal-file-image-content").forEach(multifile => {
                multifile.innerHTML = multifile.innerHTML.replace(/<span class="chat-uikit-file-card__info__size">(.*?)<\/span>/gi, '\n$1');
                multifile.innerHTML = `\n\`\`\`file\n${multifile.textContent}\n\`\`\`\n`;
            });

            doc.querySelectorAll("div[class^=code-block] > div[class^=code-area]").forEach(codearea => {
                const header = codearea.querySelector("div[class^=header] > div[class^=text]");
                const language = header.textContent;
                header.remove();
                codearea.outerHTML = `\n\`\`\`${language}\n${codearea.textContent}\n\`\`\`\n`;
            });

            return (doc.body.innerText || doc.body.textContent) //.replaceAll(":", "\\:");
        }

        function GetDialogContent() {
            const chats = document.querySelectorAll('div[data-scroll-element="scrollable"] div.chat-uikit-message-box-container__message__message-box div.chat-uikit-message-box-container__message__message-box__content');
            let markdownContent = '';

            Array.from(chats).reverse().forEach(chat => {
                const htmlContent = chat.innerHTML;
                const chatMarkdown = convertToMarkdown(htmlContent);
                const isAsk = chat.querySelector("div.chat-uikit-message-box-inner--primary");
                if (isAsk) {
                    markdownContent += "\n******\n## Ask: \n"+ chatMarkdown + '\n\n';
                } else {
                    markdownContent += "## Anser: \n"+ chatMarkdown + '\n\n';
                }
            });

            return markdownContent;
        }

        const succ_svg = `<svg width="32" height="32" viewBox="0 0 24 24" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line"><rect x="3" y="3" width="14" height="14" rx="1" style="fill:#2ca9bc;stroke-width:2"/><path style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="m7 9.63 2.25 2.25L13 8.13"/><rect data-name="primary" x="3" y="3" width="14" height="14" rx="1" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/><path data-name="primary" d="M7 21h13a1 1 0 0 0 1-1V5" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>`
        const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(succ_svg);

        function CopyDialogContent(){
            const mdContent = GetDialogContent();
            navigator.clipboard.writeText(mdContent).then(() => {
                this.style.cursor = 'url(' + svgDataUrl + '), auto';
                setTimeout(() => {
                    this.style.cursor = 'pointer';
                }, 500);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }

        function ExportDialogContent() {
            let fileContent = GetDialogContent();

            let blob = new Blob([fileContent], {type: 'text/plain;charset=utf-8'});
            let fileUrl = URL.createObjectURL(blob);
            let tempLink = document.createElement('a');
            tempLink.href = fileUrl;

            let fileTitle = document.title + "_DialogExport.md";
            tempLink.setAttribute('download', fileTitle);
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            URL.revokeObjectURL(fileUrl);
        }

        function MDaddBtnLoop() {
            if( document.querySelector("#copy_dialog_to_md_button") == null ) {

                var lhead = document.querySelector("div[class*=semi-col]:last-child > div[class*=semi-space]") ||
                    document.querySelector("div.flex.items-center.gap-5.h-6") ||
                    document.querySelector("div.sidesheet-container > :last-child .semi-sidesheet-body > div > div > div >div > div:last-child> div:last-child")||
                    document.querySelector("div.sidesheet-container > :last-child > :first-child > :first-child > :first-child > :last-child");

                const md_icon = `
                <svg xmlns="http://www.w3.org/2000/svg" style="height:15px; fill:#fff; display:inline;" viewBox="0 0 800 512">
                    <path d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"/>
                </svg>`;

                if (lhead) {
                    var btn_cp = document.createElement('button');
                    lhead.insertBefore(btn_cp, lhead.firstChild);
                    btn_cp.className ="semi-button semi-button-primary";
                    btn_cp.id = 'copy_dialog_to_md_button';
                    btn_cp.onclick = CopyDialogContent;
                    btn_cp.style = "margin: 0px 5px;";
                    btn_cp.innerHTML = md_icon + 'Copy';

                    var btn_dl = document.createElement('button');
                    lhead.insertBefore(btn_dl, lhead.firstChild);
                    btn_dl.className ="semi-button semi-button-primary";
                    btn_dl.id = 'export_dialog_to_md_button';
                    btn_dl.onclick = ExportDialogContent;
                    btn_dl.style = "margin: 0px 5px;";
                    btn_dl.innerHTML = md_icon + 'Export';

                    setTimeout(MDaddBtnLoop, 5000);
                }
            }
            setTimeout(MDaddBtnLoop, 2000);
        }

        function CheckPublish() {
            if (/bot_id=true.*?space=(\d+)/.test(location.href)) {
                let not_exist = document.querySelector("div.semi-empty.semi-empty-vertical");
                if (not_exist) {
                    let warn_info = not_exist.querySelector("div.semi-empty-content > h4");

                    if (warn_info && !warn_info.querySelector("hr")) {
                        console.log("warnning=");
                        warn_info.textContent = warn_info.textContent.replace("not exist", "not exist or need update")
                            .replace("不存在", "不存在或需要更新发布");
                        warn_info.innerHTML += "<hr><p style='font-size:large;'>Please publish first to open in user mode!</p>";
                    }

                    let back_div = not_exist.querySelector('div.semi-empty-footer[x-semi-prop="children"] button.semi-button')

                    if (back_div && !not_exist.querySelector("div.semi-empty-footer[x-semi-prop='children'] a[href]")) {
                        const publHref = location.href.replace(/\/store\/bot\/(\d+).*?space=(\d+)/, "/space/$2/bot/$1/publish");
                        const deveHref = location.href.replace(/\/store\/bot\/(\d+).*?space=(\d+)/, "/space/$2/bot/$1");
                        back_div.insertAdjacentHTML('beforebegin', `
                        <a class="semi-button semi-button-primary" href="${publHref}" style="text-decoration:none; margin:0 18px; width:100px;">Publish</a>
                         `);
                        back_div.insertAdjacentHTML('afterend', `
                        <a class="semi-button semi-button-primary" href="${deveHref}" style="text-decoration:none; margin:0 18px; width:100px;">Develop</a>
                         `);
                        back_div.classList.remove("semi-button-primary");
                    }
                } else {
                    setTimeout(CheckPublish, 350);
                }
            }
        }

        CheckPublish();

        MDaddBtnLoop();
    }

    function colorfulPluginsTotal() {
        function convert2ms(timeStr) {
            const value = parseFloat(timeStr);
            return timeStr.endsWith('ms') ? value : value * 1000;
        }
        function xK2number(numStr) {
            let value = parseFloat(numStr);
            if (/[\d\.]+K/.test(numStr)) {
                value = value * 1024;
            } else if (/[\d\.]+M/.test(numStr)) {
                value = value * 1024 * 1024;
            }
            return parseInt(value);
        }

        const plugins = document.querySelectorAll("#semi-modal-body div.flex.justify-between > div:last-child");

        if (plugins.length > 0) {
            if (!document.querySelector("#semi-modal-body > style.qwertyuiop")) {
                let modalCss = document.createElement("style");
                modalCss.className = "qwertyuiop";
                modalCss.innerHTML =
                    `#semi-modal-body div.flex.justify-between > div:last-child > div::after {
                        display: none;
                     }
                     #semi-modal-body div.flex.justify-between > div:last-child > div {
                        border-radius: 5px;
                        padding: 0px 5px;
                        background-color: #EEE;
                        min-width: 70px;
                        justify-content: space-evenly;
                     }`;
                document.querySelector("#semi-modal-body").append(modalCss);
            }

            plugins.forEach(function(plugin) {
                if(plugin.style.color !== `#000`) {
                    plugin.style.color = `#000`;
                    let hue = 180;

                    const botsUsed = plugin.querySelector("div:nth-child(1)");
                    hue = xK2number(botsUsed.innerText).toString(4).length*10;
                    botsUsed.style.backgroundColor = `hsl(${hue}, 50%, 60%)`;

                    const InvoCnts = plugin.querySelector("div:nth-child(2)");
                    hue = xK2number(InvoCnts.innerText).toString(4).length*10;
                    InvoCnts.style.backgroundColor = `hsl(${hue}, 50%, 60%)`;

                    const timeAver = plugin.querySelector("div:nth-child(3)");
                    hue = Math.min(10000, convert2ms(timeAver.innerText));
                    hue = 140 - hue / 10000 * 120;
                    timeAver.style.backgroundColor = `hsl(${hue}, 50%, 60%)`;

                    const succRate = plugin.querySelector("div:nth-child(4)");
                    hue = Math.max(10, parseInt(succRate.innerText)) * 1.3 - 10;
                    succRate.style.backgroundColor = `hsl(${hue}, 50%, 60%)`;
                }
            });
        }
        setTimeout(colorfulPluginsTotal, 1800);
    }

    var win_resize_addEventListener=0;

    function resizeDialogInputDiv() {

        function heigherTextarea() {
            const tArea = event.target;
            if(tArea.scrollHeight > 120) {
                const scroll = tArea.scrollTop;
                tArea.style.height = "auto"
                tArea.style.height = ((tArea.scrollHeight < 600) ? tArea.scrollHeight : 600) + "px";
                tArea.style.maxHeight = "40vh";
                tArea.scrollTop = scroll;
            }
        }

        const inputTextarea = document.querySelector("textarea[data-testid*='chat_input']");
        if (inputTextarea) {
            if (inputTextarea.closest("div[style='width: 640px;']")) {
                inputTextarea.closest("div[style='width: 640px;']").style.width = 'calc(100% - 44px)';
            }
            inputTextarea.addEventListener('input', heigherTextarea);

        } else {
            setTimeout(resizeDialogInputDiv, 700);
        }

        if(win_resize_addEventListener ==0){
            window.addEventListener('resize', function() {
                resizeDialogInputDiv();
            });
            win_resize_addEventListener = 1;
        }

        GM_addStyle(`
            div[data-scroll-element="scrollable"]{
                scrollbar-width: thin!important;
            }
            div[data-scroll-element="scrollable"] ::-webkit-scrollbar {
                width: 8px !important;
                height: 8px !important;
            }
            div[class^=code-area_] > div[class^=content]  {
                max-height: 50vh !important;
                overflow: auto !important;
            }
            div[class^=code-area_] > div[class^=content] > pre {
                overflow: visible !important;
            }
            div[class^=code-area_] ::-webkit-scrollbar-track {
                background: #5558 !important;
            }
            div[class^=code-area_] ::-webkit-scrollbar-thumb {
                background: #9998 !important;
            }
            div[class^=code-area_] ::-webkit-scrollbar-thumb:hover {
                background: #ccc8 !important;
            }
            div[class^=code-area_] ::-webkit-scrollbar {
                width: 8px !important;
                height: 8px !important;
            }
        `);
    }

    function WiderDialog() {
        GM_addStyle(`
       div[data-scroll-element="scrollable"] > div.message-group-wrapper  >div {
         width: 95% !important;
       }
       div.w-full.h-full.flex > div:first-child {
         width: 75% !important;
       }
       div[data-scroll-element="scrollable"] .common-wrapper> div[style="width: 640px;"]{
         width: 90% !important;
       }
    `);
    }

    function DevelopUI_2Cols() {
        GM_addStyle(`
            .sidesheet-container > :first-child > :last-child {
                display: flex !important;
                flex-direction: column !important;
            }
            .sidesheet-container > :first-child > :last-child > :first-child {
                height: 30% !important;
            }
            .sidesheet-container > :first-child > :last-child > :first-child.semi-sidesheet-left {
                height: 100% !important;
            }
            .sidesheet-container > :first-child > :last-child > :first-child > :first-child {
                padding-bottom: 5px !important;
            }
            .sidesheet-container > div.IoQhh3vVUhwDTJi9EIDK > div.arQAab07X2IRwAe6dqHV > div.ZdYiacTEhcgSnacFo_ah > div > div.S6fvSlBc5DwOx925HTh1 {
                padding: 1px 0px 0px 20px;
            }
            textarea[data-testid="prompt-text-area"] {
                background: #FFFE;
            }
        `);

        function makeResizable(target) {
            console.log("makeResizable");
            const handle = document.createElement('div');
            handle.style = 'z-index:1000; position:absolute; left:0px; top:0px; bottom:0px; height:100%; width:8px; cursor:ew-resize; background:#aaa; border:3px outset;';
            handle.id = "Resizable-Handle";
            target.appendChild(handle);

            handle.addEventListener('mousedown', (evt) => {
                evt.preventDefault();
                const startX = evt.clientX;
                const startWidth = target.getBoundingClientRect().width;
                const maxWidth = target.closest('.sidesheet-container').clientWidth - 420;

                function onMouseMove(evt) {
                    let newWidth = startWidth - (evt.clientX - startX);
                    if (newWidth > maxWidth) { newWidth = maxWidth; } // limit max
                    if (newWidth < 200) { newWidth = 200; } // limit min
                    target.style.width = `${newWidth}px`;
                    const semiSideSheet = target.querySelector(".semi-sidesheet");
                    if (semiSideSheet) {
                        semiSideSheet.style.width = `${newWidth}px`;
                    }
                    const sideContainer = target.closest('.sidesheet-container');
                    if (sideContainer) {
                        const percentage = (newWidth / sideContainer.clientWidth) * 100;
                        sideContainer.style.gridTemplateColumns = `auto ${percentage}%`;
                    }
                }

                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    localStorage.setItem('resizable_width_percentage', (target.offsetWidth / window.innerWidth).toFixed(3));
                }

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        function makeResizableLoop() {
            const dialogDiv = document.querySelector('div.sidesheet-container > :last-child'); // document.querySelector('div.sidesheet-container > :last-child .semi-sidesheet');
            if (dialogDiv) {
                const resizable_width_percentage = localStorage.getItem('resizable_width_percentage') || 0.5;
                const resizable_width = `${window.innerWidth * resizable_width_percentage}px`;
                dialogDiv.style.width = resizable_width;
                const semiSideSheet = dialogDiv.querySelector(".semi-sidesheet");
                if (semiSideSheet) {
                    semiSideSheet.style.width = `${resizable_width}px`;
                }
                const sideContainer = dialogDiv.closest('.sidesheet-container');
                if (sideContainer) {
                    const percentage = resizable_width_percentage * 100;
                    sideContainer.style.gridTemplateColumns = `auto ${percentage}%`;
                }
                makeResizable(dialogDiv);

                dialogDiv.querySelector("span.semi-icon").parentElement.addEventListener('click', (event) => {
                    dialogDiv.querySelector("#Resizable-Handle").style.display = "none";
                    setTimeout(function(){
                        if (semiSideSheet) {
                            dialogDiv.style.width = semiSideSheet.style.width;
                        }
                        dialogDiv.querySelector("#Resizable-Handle").style.display = "";
                    }, 150);
                });
                window.addEventListener('resize', () => {
                    const resizable_width_percentage = localStorage.getItem('resizable_width_percentage') || 0.5;
                    const newWidth = `${window.innerWidth * resizable_width_percentage}px`;
                    dialogDiv.style.width = newWidth;
                    if(dialogDiv.querySelector(".semi-sidesheet")){
                        dialogDiv.querySelector(".semi-sidesheet").style.width = newWidth;
                    }
                });
                document.documentElement.style.minWidth="768px";
                document.body.style.minWidth="768px";
            } else {
                setTimeout(makeResizableLoop, 800);
            }
        }
        makeResizableLoop();
    }

    const urlPatterns = {
        space: /https:\/\/www\.coze\.c.*\/space\/.+\/bot$/,
        bot: /https:\/\/www\.coze\.c.*\/store\/bot\/.+/,
        dev: /https:\/\/www\.coze\.c.*\/space\/.+\/bot\/.+/
    };

    let lastUrl = "";

    function checkUrlChange() {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            if (urlPatterns.space.test(location.href)) {
                console.log(">match: space_url");
                addUserModeButtons();
            } else if (urlPatterns.bot.test(location.href)) {
                console.log(">match: user_url");
                exportMarkdown();
                WiderDialog();
                resizeDialogInputDiv();
            } else if (urlPatterns.dev.test(location.href)) {
                console.log(">match: dev_url");
                DevelopUI_2Cols();
                exportMarkdown();
                resizeDialogInputDiv();
                colorfulPluginsTotal();
            }
        }
    }

    checkUrlChange();
    if (window.onurlchange === null) {
        console.log("add onurlchange");
        window.addEventListener('urlchange', (info) => checkUrlChange());
    }

})();

