// ==UserScript==
// @name         xiaohongshu_link
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  下载小红书用户主页已加载的数据和封面
// @author       xxmdmst
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474888/xiaohongshu_link.user.js
// @updateURL https://update.greasyfork.org/scripts/474888/xiaohongshu_link.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let table;

    function initGbkTable() {
        // https://en.wikipedia.org/wiki/GBK_(character_encoding)#Encoding
        const ranges = [
            [0xA1, 0xA9, 0xA1, 0xFE],
            [0xB0, 0xF7, 0xA1, 0xFE],
            [0x81, 0xA0, 0x40, 0xFE],
            [0xAA, 0xFE, 0x40, 0xA0],
            [0xA8, 0xA9, 0x40, 0xA0],
            [0xAA, 0xAF, 0xA1, 0xFE],
            [0xF8, 0xFE, 0xA1, 0xFE],
            [0xA1, 0xA7, 0x40, 0xA0],
        ];
        const codes = new Uint16Array(23940);
        let i = 0;

        for (const [b1Begin, b1End, b2Begin, b2End] of ranges) {
            for (let b2 = b2Begin; b2 <= b2End; b2++) {
                if (b2 !== 0x7F) {
                    for (let b1 = b1Begin; b1 <= b1End; b1++) {
                        codes[i++] = b2 << 8 | b1
                    }
                }
            }
        }
        table = new Uint16Array(65536);
        table.fill(0xFFFF);
        const str = new TextDecoder('gbk').decode(codes);
        for (let i = 0; i < str.length; i++) {
            table[str.charCodeAt(i)] = codes[i]
        }
    }

    function str2gbk(str, opt = {}) {
        if (!table) {
            initGbkTable()
        }
        const NodeJsBufAlloc = typeof Buffer === 'function' && Buffer.allocUnsafe;
        const defaultOnAlloc = NodeJsBufAlloc
            ? (len) => NodeJsBufAlloc(len)
            : (len) => new Uint8Array(len);
        const defaultOnError = () => 63;
        const onAlloc = opt.onAlloc || defaultOnAlloc;
        const onError = opt.onError || defaultOnError;

        const buf = onAlloc(str.length * 2);
        let n = 0;

        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code < 0x80) {
                buf[n++] = code;
                continue
            }
            const gbk = table[code];

            if (gbk !== 0xFFFF) {
                buf[n++] = gbk;
                buf[n++] = gbk >> 8
            } else if (code === 8364) {
                buf[n++] = 0x80
            } else {
                const ret = onError(i, str);
                if (ret === -1) {
                    break
                }
                if (ret > 0xFF) {
                    buf[n++] = ret;
                    buf[n++] = ret >> 8
                } else {
                    buf[n++] = ret
                }
            }
        }
        return buf.subarray(0, n)
    }

    const toast = (msg, duration) => {
        duration = isNaN(duration) ? 3000 : duration;
        let toastDom = document.createElement('pre');
        toastDom.textContent = msg;
        toastDom.style.cssText = 'padding:2px 15px;min-height: 36px;line-height: 36px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 9999999;background: rgb(0, 0, 0);font-size: 16px;'
        document.body.appendChild(toastDom);
        setTimeout(function () {
            const d = 0.5;
            toastDom.style.transition = `transform ${d}s ease-in, opacity ${d}s ease-in`;
            toastDom.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(toastDom)
            }, d * 1000);
        }, duration);
    }

    function formatName(name) {
        return name.replace(/[\/:*?"<>|\s]+/g, "").slice(0, 27).replace(/\.\d+$/g, "");
    }

    function copyText(text, node) {
        let oldText = node.textContent;
        navigator.clipboard.writeText(text).then(r => {
            node.textContent = "复制成功";
            toast("复制成功\n" + text.slice(0, 20) + (text.length > 20 ? "..." : ""), 2000);
        }).catch((e) => {
            node.textContent = "复制失败";
            toast("复制失败", 2000);
        })
        setTimeout(() => node.textContent = oldText, 2000);
    }

    let msg_pre;
    window.notes = new Map();


    function interceptResponse() {
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            originalSend.apply(this, arguments);
            const self = this;
            let func = this.onreadystatechange;
            this.onreadystatechange = (e) => {
                if (func) {
                    func.apply(self, e);
                }
                if (self.readyState !== 4 || self.responseURL.indexOf("/api/sns/web/v1/feed") === -1) return;
                let json = JSON.parse(self.response);
                if (!json.success) return;
                load_data();
                for (let item of json.data.items) {
                    console.log(item);
                    let noteCard = item.note_card;
                    let interactInfo = noteCard.interact_info;
                    let old_data = notes.get(item.id);
                    let data = {
                        "id": item.id,
                        "nickname": noteCard.user.nickname,
                        "title": old_data.title,
                        "desc": noteCard.desc.replace(/#.*?\[话题\]#/g, '').trim(),
                        "image_list": noteCard.image_list.map(image => image.url_default),
                        "liked_count": interactInfo.liked_count,
                        "collected_count": interactInfo.collected_count,
                        "comment_count": interactInfo.comment_count,
                        "share_count": interactInfo.share_count,
                        "tag_list": noteCard.tag_list.map(tag => tag.name),
                        "time": noteCard.time,
                        "time_str": new Date(noteCard.time).toLocaleString(),
                        "cover": old_data.cover,
                        "url": old_data.url,
                    };
                    notes.set(item.id, data);
                    // let video_url;
                    // if (noteCard.type === "video") {
                    //     let backup_urls = noteCard.video.media.stream.h264[0].backup_urls;
                    //     for (video_url of backup_urls) {
                    //         if (video_url.indexOf("?") > -1) {
                    //             window.video_url = video_url;
                    //             break;
                    //         }
                    //     }
                    // }
                }
            }
        };
    }

    interceptResponse();

    function createButton(title) {
        let parent = document.querySelector(".info-right-area-more-container .dropdown-items");
        let menu = parent.children[0].cloneNode(true);
        let button = menu.querySelector("span");
        button.textContent = title;
        parent.appendChild(menu);
        return button;
    }

    function txt2file(txt, filename) {
        const blob = new Blob([txt], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.replace(/[\/:*?"<>|]/g, "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function downloadData(encoding) {
        let text = "作品ID,昵称,标题,描述,点赞,收藏,评论,分享,标签,发布时间,封面,链接\n";
        window.notes.values().forEach(item => {
            text += [
                item.id, item.nickname,
                '"' + item.title.replace(/,/g, '，').replace(/"/g, '""') + '"',
                '"' + item.desc.replace(/,/g, '，').replace(/"/g, '""') + '"',
                item.liked_count, item.collected_count, item.comment_count, item.share_count,
                item.tag_list.join("#"), item.time_str,
                item.cover, item.url
            ].join(",") + "\n"
        });
        if (encoding === "gbk") text = str2gbk(text);
        txt2file(text, document.title + ".csv");
    }


    function load_data() {
        for (let items of window.__INITIAL_STATE__["user"]["notes"]._rawValue) {
            for (let item of items) {
                if (notes.has(item.id)) {
                    continue;
                }
                let noteCard = item["noteCard"];
                notes.set(item.id, {
                    "id": item.id,
                    "nickname": noteCard.user.nickname,
                    "title": noteCard.displayTitle,
                    "desc": "", "image_list": [],
                    "liked_count": noteCard.interactInfo.likedCount,
                    "collected_count": "", "comment_count": "", "share_count": "",
                    "tag_list": [], "time": "", "time_str": "",
                    "cover": noteCard.cover.urlDefault,
                    "url": `https://www.xiaohongshu.com/explore/${item.id}?xsec_token=${noteCard.xsecToken}`,
                });
            }
        }
        return notes;
    }

    function createDownloadLink(blob, filename, ext, prefix = "") {
        if (filename === null) {
            filename = document.title;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = prefix + formatName(filename) + "." + ext;
        link.click();
        URL.revokeObjectURL(url);
    }

    async function downloadCover(node) {
        load_data();
        if (node.disabled) {
            toast("下载正在处理中，请不要重复点击按钮！");
            return;
        }
        node.disabled = true;
        try {
            const zip = new JSZip();
            msg_pre.textContent = `下载封面并打包中...`;
            // let user_aweme_list = Array.from(all_aweme_map.values()).sort((a, b) => b.create_time - a.create_time);
            let note_data_list = Array.from(notes.values());
            let promises = note_data_list.map((note, i) => {
                let title = note.desc.match(/[一-龟]+/)?.[0];
                if (!title) title = note.title;
                if (note.image_list.length > 1) {
                    let note_name = formatName(title);
                    msg_pre.textContent = `${i + 1}/${note_data_list.length} ` + note_name;
                    let folder = zip.folder(`${i + 1}.` + note_name);
                    if (note.desc) folder.file(`描述.txt`, note.desc);
                    return Promise.all(note.image_list.map((link, index) => {
                        return fetch(link)
                            .then((res) => res.arrayBuffer())
                            .then((buffer) => {
                                folder.file(`image_${index + 1}.png`, buffer);
                            });
                    }));
                } else {
                    let note_name = formatName(title) + ".png";
                    return fetch(note.cover)
                        .then(response => response.arrayBuffer())
                        .then(buffer => zip.file(`${i + 1}.` + note_name, buffer))
                        .then(() => msg_pre.textContent = `${i + 1}/${note_data_list.length} ` + note_name)
                }
            });
            Promise.all(promises).then(() => {
                return zip.generateAsync({type: "blob"})
            }).then((content) => {
                createDownloadLink(content, null, "zip", "【封面】");
                msg_pre.textContent = "封面打包完成";
                node.disabled = false;
            })
        } finally {
            node.disabled = false;
        }
    }

    function createMsgBox() {
        msg_pre = document.createElement('pre');
        msg_pre.textContent = '';
        msg_pre.style.color = 'blue';
        msg_pre.style.position = 'fixed';
        msg_pre.style.right = '5px';
        msg_pre.style.top = '42px';
        msg_pre.style.zIndex = '503';
        msg_pre.style.opacity = "0.4";
        document.body.appendChild(msg_pre);
    }

    let domLoadedTimer;

    function createAllButton() {
        let b1 = createButton("下载笔记数据", "40px");
        b1.onclick = (e) => {
            load_data();
            downloadData("gbk");
        };
        let b2 = createButton("下载封面图片", "61px");
        b2.onclick = (e) => {
            load_data();
            downloadCover(b2).then(r => {
            });
        };
        let b3 = createButton("复制作者信息", "82px");
        b3.onclick = (e) => {
            let basicInfo = window.__INITIAL_STATE__.user.userPageData._rawValue.basicInfo;
            let interactions = window.__INITIAL_STATE__.user.userPageData._rawValue.interactions;
            let text = [
                "昵称：" + basicInfo.nickname,
                "小红书号：" + basicInfo.redId,
                "IP属地：" + basicInfo.ipLocation,
                "简介：" + basicInfo.desc,
                "性别：" + (basicInfo.gender === 1 ? "女" : "男"),
                interactions.map(item => item.count + item.name).join(" ")
            ].join("\n")
            copyText(text, b3);
        };
    }

    const checkElementLoaded = () => {
        const element = document.querySelector(".info-right-area-more-container .dropdown-items .menu-item span");
        if (element) {
            console.log('加载完毕');
            msg_pre.textContent = "按钮加载完成，点击...按钮使用\n注意：只有点开过的作品才能下载完整数据";
            clearInterval(domLoadedTimer);
            domLoadedTimer = null;
            createAllButton();
            load_data();
        }
    };
    window.onload = () => {
        createMsgBox();
        domLoadedTimer = setInterval(checkElementLoaded, 300);
    }
})();