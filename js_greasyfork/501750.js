// ==UserScript==
// @name         pikpak批量改名
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  批量修改文件夹或文件名
// @author       hswmartin
// @match        https://mypikpak.com/drive/all*
// @icon         https://hswpicgo.oss-cn-guangzhou.aliyuncs.com/pic/202407261244530.svg
// @require      https://cdn.jsdelivr.net/npm/tailwindcss-cdn@3.4.3/tailwindcss.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501750/pikpak%E6%89%B9%E9%87%8F%E6%94%B9%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/501750/pikpak%E6%89%B9%E9%87%8F%E6%94%B9%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let headers={}
    //fetch劫持
    let oldfetch=unsafeWindow.fetch
    function fuckfetch() {
        return new Promise((resolve, reject) => {
            oldfetch.apply(this, arguments).then(response => {
                if(arguments[0]?.indexOf("v1/share/status/file")!==-1){
                    headers=arguments[1].headers
                }
                resolve(response);
            });
        });
    }

    const target=document.documentElement
    const config = { attributes: true};
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes"&&mutation.attributeName==="style") {
                document.documentElement.style.fontSize="16px"
            }
        });
    });

    // 以上述配置开始观察目标节点
    observer.observe(target, config);

    unsafeWindow.fetch=fuckfetch
    let v
    document.body.addEventListener('click', ()=>{
        const int=setTimeout(()=>{
            v=document.querySelector("video")
            if(v){
                button.style.display="none"
            }else{
                button.style.display="block"
            }},2000)
        })


    // 创建一个按钮
    var button = document.createElement('button');
    button.innerHTML = '批量改名';
    button.id="rename"
    button.classList.add(..."top-4 right-1/4 fixed rounded-lg text-md bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50".split(/\s+/))
    document.body.appendChild(button);

    // 指定的JS代码
    var yourCode = async function() {
        var overlay = document.createElement('div');
        overlay.id = 'customOverlay';
        overlay.classList.add(...'fixed inset-0 bg-black bg-opacity-50 z-50'.split(/\s+/))
        document.body.appendChild(overlay);

        // 创建并添加文本节点
        var processingText = document.createElement('div');
        processingText.innerHTML = '正在处理中……';
        processingText.classList.add(...'text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold'.split(/\s+/))
        overlay.appendChild(processingText);
        function simplifyFilename(filename) {
            // Regular expression to match S##E## pattern
            const seasonEpisodePattern = /(S\d+E\d+E\d+|S\d+E\d+)/i;

            // Find the match in the filename
            const match = filename.match(seasonEpisodePattern);

            if (match) {
                // Extract the S##E## part
                const seasonEpisode = match[1];

                // Get the file extension
                const extension = filename.split('.').pop();

                // Combine S##E## with the extension
                return `${seasonEpisode}.${extension}`;
            }

            // Return the original filename if no match is found
            return filename;
        }

        async function updateFiles() {
            const listItems = document.querySelector("#app > div.layout > div.main > div.container > div.all.file-explorer > div.list.list-container > div.el-scrollbar > div.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default > div > div.list.list-wrap.all-files-container").querySelectorAll("ol>li");
            let i = 0;
            for (const o of listItems) {
                try {
                    const pattern=/】(.*?)\[.*\]\.(.*)\./
                    const m=o.getAttribute("aria-label").match(pattern)
                    if(simplifyFilename(o.getAttribute("aria-label"))!=o.getAttribute("aria-label")){
                        const response = await fetch("https://api-drive.mypikpak.com/drive/v1/files/" + o.id, {
                            headers: headers,
                            method: "PATCH",
                            body: JSON.stringify({ name: simplifyFilename(o.getAttribute("aria-label")) })
                        });
                    }else if(m){
                        const response = await fetch("https://api-drive.mypikpak.com/drive/v1/files/" + o.id, {
                            headers: headers,
                            method: "PATCH",
                            body: JSON.stringify({ name: m[2]+m[1] })
                        });
                    }
                    i++;
                    if (i === listItems.length) {
                        setTimeout(() => {
                            Swal.fire({
                                title: "成功",
                                text: "成功修改名字！！！",
                                icon: "success",
                                timer: 2000,
                                timerProgressBar: true,

                            }).then(()=>{
                                location.reload()
                            }

                            );
                        }, 5000);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }

        updateFiles();
    };

    // 添加按钮点击事件
    button.addEventListener('click', yourCode);
})();
