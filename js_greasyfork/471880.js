// ==UserScript==
// @name         douyin-user-data-download
// @namespace    http://tampermonkey.net/
// @version      0.5.6
// @description  下载抖音用户主页数据!
// @author       xxmdmst
// @match        https://www.douyin.com/*
// @icon         https://xxmdmst.oss-cn-beijing.aliyuncs.com/imgs/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471880/douyin-user-data-download.user.js
// @updateURL https://update.greasyfork.org/scripts/471880/douyin-user-data-download.meta.js
// ==/UserScript==

(function () {
    let localDownload;
    let localDownloadUrl = GM_getValue("localDownloadUrl", 'http://localhost:8080/data');
    const startPipeline = (start) => {
        if (confirm(start ? "是否开启本地下载通道?\n开启后会向本地服务发送数据，服务地址：\n" + localDownloadUrl : "是否关闭本地下载通道?")) {
            GM_setValue("localDownload", start);
            window.location.reload();
        }
    }
    localDownload = GM_getValue("localDownload", false);
    if (localDownload) {
        GM_registerMenuCommand("✅关闭本地下载通道", () => {
            startPipeline(false);
        })
    } else {
        GM_registerMenuCommand("⛔️开启本地下载通道", () => {
            startPipeline(true);
        })
    }

    GM_registerMenuCommand("♐设置本地下载通道地址", () => {
        localDownloadUrl = GM_getValue("localDownloadUrl", 'http://localhost:8080/data');
        let newlocalDownloadUrl = prompt("请输入新的上报地址：", localDownloadUrl);
        if (newlocalDownloadUrl === null) return;
        newlocalDownloadUrl = newlocalDownloadUrl.trim();
        if (!newlocalDownloadUrl) {
            newlocalDownloadUrl = "http://localhost:8080/data";
            toast("设置了空白地址，已经恢复默认地址为:" + newlocalDownloadUrl);
            localDownloadUrl = newlocalDownloadUrl;
        } else if (localDownloadUrl !== newlocalDownloadUrl) {
            GM_setValue("localDownloadUrl", newlocalDownloadUrl);
            toast("当前上报地址已经修改为:" + newlocalDownloadUrl);
        }
        GM_setValue("localDownloadUrl", newlocalDownloadUrl);
        localDownloadUrl = newlocalDownloadUrl;
    });
    GM_registerMenuCommand("🔄清空信息内容", () => msg_pre.textContent = "")
    let max_author_num = GM_getValue("max_author_num", 1000);
    GM_registerMenuCommand("👤设置最大缓存作者数", () => {
        let new_max_author_num = prompt("设置最大缓存作者数：", max_author_num);
        if (new_max_author_num === null) return;
        if (!/^\d+$/.test(new_max_author_num)) {
            toast("请输入正整数！");
            return;
        }
        max_author_num = parseInt(new_max_author_num);
        GM_setValue("max_author_num", max_author_num);
        toast("当前最大缓存作者数已经修改为:" + max_author_num);
    })
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

    function formatSeconds(seconds) {
        const timeUnits = ['小时', '分', '秒'];
        const timeValues = [
            Math.floor(seconds / 3600),
            Math.floor((seconds % 3600) / 60),
            seconds % 60
        ];
        return timeValues.map((value, index) => value > 0 ? value + timeUnits[index] : '').join('');
    }

    const timeFormat = (timestamp = null, fmt = 'yyyy-mm-dd') => {
        // 其他更多是格式化有如下:
        // yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
        timestamp = parseInt(timestamp);
        // 如果为null,则格式化当前时间
        if (!timestamp) timestamp = Number(new Date());
        // 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
        if (timestamp.toString().length === 10) timestamp *= 1000;
        let date = new Date(timestamp);
        let ret;
        let opt = {
            "y{4,}": date.getFullYear().toString(), // 年
            "y+": date.getFullYear().toString().slice(2,), // 年
            "m+": (date.getMonth() + 1).toString(), // 月
            "d+": date.getDate().toString(), // 日
            "h+": date.getHours().toString(), // 时
            "M+": date.getMinutes().toString(), // 分
            "s+": date.getSeconds().toString() // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
        }
        return fmt
    };
    window.all_aweme_map = new Map();
    window.user_map = new Map();
    const user_local_data = localStorage.getItem('user_local_data');
    if (user_local_data) {
        JSON.parse(user_local_data).forEach((userInfo) => {
            user_map.set(userInfo.uid, userInfo);
        });
    }
    let current_user_id = null;
    const user_key = {
        "nickname": "昵称",
        "following_count": "关注",
        "mplatform_followers_count": "粉丝",
        "total_favorited": "获赞",
        "unique_id": "抖音号",
        "ip_location": "IP属地",
        "gender": "性别",
        "city": "位置",
        "signature": "签名",
        "aweme_count": "作品数",
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

    function copyUserData(node) {
        if (!current_user_id) {
            toast("还没有捕获到用户数据！");
            return;
        }
        let text = [];
        let userInfo = user_map.get(current_user_id);
        for (let key in user_key) {
            let value = (userInfo[key] || "").toString().trim()
            if (value) text.push(user_key[key] + "：" + value);
        }
        copyText(text.join("\n"), node);
    }

    function createVideoButton(text, top, func) {
        const button = document.createElement("button");
        button.textContent = text;
        button.style.position = "absolute";
        button.style.right = "0px";
        button.style.top = top;
        button.style.opacity = "0.5";
        button.style.zIndex = "99";
        if (func) {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                func();
            });
        }
        return button;
    }

    function createDownloadLink(blob, filename, ext, prefix = "") {
        if (filename === null) {
            filename = current_user_id ? user_map.get(current_user_id).nickname : document.title;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = prefix + filename.replace(/[\/:*?"<>|\s]/g, "").slice(0, 40) + "." + ext;
        link.click();
        URL.revokeObjectURL(url);
    }

    function txt2file(txt, filename, ext) {
        createDownloadLink(new Blob([txt], {type: 'text/plain'}), filename, ext);
    }

    function getAwemeName(aweme) {
        let name = aweme.item_title ? aweme.item_title : aweme.caption;
        if (!name) name = aweme.desc ? aweme.desc : aweme.awemeId;
        return (aweme.date ? `【${aweme.date.slice(0, 10)}】` : "") + name.replace(/[\/:*?"<>|\s]+/g, "").slice(0, 27).replace(/\.\d+$/g, "");
    }

    const downloadUrl = (url, node, filename, ext = "mp4") => {
        // toast("准备就绪，等待视频下载完毕后弹出下载界面！");
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url.replace("http://", "https://"), true);
        xhr.responseType = 'blob';
        let textContent = node.textContent;
        xhr.onload = (e) => {
            createDownloadLink(xhr.response, filename, ext);
            setTimeout(() => node.textContent = textContent, 2000);
        };
        xhr.onprogress = (event) => {
            if (event.lengthComputable) {
                node.textContent = "下载" + (event.loaded * 100 / event.total).toFixed(1) + '%';
            }
        };
        xhr.send();
    };
    const downloadVideo = (aweme, node) => {
        toast("准备就绪，等待视频下载完毕后弹出下载界面！");
        let xhr = new XMLHttpRequest();
        let url = aweme.url.replace("http://", "https://");
        let filename = aweme ? getAwemeName(aweme) : window.title;
        let ext = aweme && aweme.images ? "mp3" : "mp4";
        downloadUrl(url, node, filename, ext);
    };
    const downloadImage = (aweme, downloadImageButton) => {
        const zip = new JSZip();
        let textContent = downloadImageButton.textContent;
        downloadImageButton.textContent = "图片下载并打包中...";
        const promises = aweme.images.map((link, index) => {
            return fetch(link)
                .then((response) => response.arrayBuffer())
                .then((buffer) => {
                    downloadImageButton.textContent = `图片已下载【${index + 1}/${aweme.images.length}】`;
                    zip.file(`image_${index + 1}.jpg`, buffer);
                });
        });
        Promise.all(promises)
            .then(() => {
                return zip.generateAsync({type: "blob"});
            })
            .then((content) => {
                createDownloadLink(content, getAwemeName(aweme), "zip", "【图文】");
                setTimeout(() => downloadImageButton.textContent = textContent, 2000);
            });
    };

    function createButtonGroup(aNode) {
        if (aNode.dataset.vid) return;
        let match = aNode.href.match(/(?:video|note)\/(\d+)/);
        if (!match) return;
        let videoId = match[1];
        let aweme = all_aweme_map.get(videoId);
        let copyDescButton = createVideoButton("复制描述", "0px");
        copyDescButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            copyText(aweme.desc, copyDescButton);
        })
        aNode.appendChild(copyDescButton);
        aNode.appendChild(createVideoButton("打开视频源", "20px", () => window.open(aweme.url)));

        let downloadVideoButton = createVideoButton("下载视频", "40px");
        downloadVideoButton.addEventListener("click", () => downloadVideo(aweme, downloadVideoButton));
        aNode.appendChild(downloadVideoButton);

        if (aweme.images) {
            let downloadImageButton = createVideoButton("图片打包下载", "60px");
            downloadImageButton.addEventListener("click", () => downloadImage(aweme, downloadImageButton));
            aNode.appendChild(downloadImageButton);
        }
        aNode.dataset.vid = videoId;
    }

    function flush() {
        let img_num = Array.from(all_aweme_map.values()).filter(a => a.images).length;
        msg_pre.textContent = `已加载${all_aweme_map.size}个作品，${img_num}个图文\n已游览${user_map.size}个作者的主页`;
        if (domLoadedTimer !== null) return;
        data_button.p2.textContent = `${all_aweme_map.size}`;
        user_button.p2.textContent = `${user_map.size}`;
        img_button.p2.textContent = `${img_num}`;
    }

    const formatDouyinAwemeData = item => Object.assign(
        {
            "awemeId": item.aweme_id,
            "item_title": item.item_title,
            "caption": item.caption,
            "desc": item.desc,
            "tag": item.text_extra ? item.text_extra.map(tag => tag.hashtag_name).filter(tag => tag).join("#") : "",
            "video_tag": item.video_tag ? item.video_tag.map(tag => tag.tag_name).filter(tag => tag).join("->") : "",
            "date": timeFormat(item.create_time, "yyyy-mm-dd hh:MM:ss"),
            "create_time": item.create_time,
        },
        item.statistics ? {
            "diggCount": item.statistics.digg_count,
            "commentCount": item.statistics.comment_count,
            "collectCount": item.statistics.collect_count,
            "shareCount": item.statistics.share_count
        } : {},
        item.video ? {
            "duration": formatSeconds(Math.round(item.video.duration / 1000)),
            "url": item.video.play_addr.url_list[0],
            "cover": item.video.cover.url_list[0],
            "images": item.images ? item.images.map(row => row.url_list.pop()) : null,
        } : {},
        item.author ? {
            "uid": item.author.uid,
            "nickname": item.author.nickname
        } : {}
    );


    function formatAwemeData(json_data) {
        return json_data.aweme_list.map(formatDouyinAwemeData);
    }

    function formatUserData(userInfo) {
        for (let key in userInfo) {
            if (!userInfo[key]) userInfo[key] = "";
        }
        return {
            "uid": userInfo.uid,
            "nickname": userInfo.nickname,
            "following_count": userInfo.following_count,
            "mplatform_followers_count": userInfo.mplatform_followers_count,
            "total_favorited": userInfo.total_favorited,
            "unique_id": userInfo.unique_id ? userInfo.unique_id : userInfo.short_id,
            "ip_location": userInfo.ip_location.replace("IP属地：", ""),
            "gender": userInfo.gender ? " 男女".charAt(userInfo.gender).trim() : "",
            "city": [userInfo.province, userInfo.city, userInfo.district].filter(x => x).join("·"),
            "signature": userInfo.signature,
            "aweme_count": userInfo.aweme_count,
            "create_time": Date.now()
        }
    }

    function sendLocalData(jsonData) {
        if (!localDownload) return;
        fetch(localDownloadUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
            .then(response => response.json())
            .then(responseData => {
                console.log('成功:', responseData);
            })
            .catch(error => {
                console.log('上报失败，请检查本地程序是否已经启动！');
            });
    }

    function interceptResponse() {
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            originalSend.apply(this, arguments);
            if (!this._url) return;
            this.url = this._url;
            if (this.url.startsWith("http"))
                this.url = new URL(this.url).pathname
            if (!this.url.startsWith("/aweme/v1/web/")) return;
            const self = this;
            let func = this.onreadystatechange;
            this.onreadystatechange = (e) => {
                if (self.readyState === 4) {
                    let data = JSON.parse(self.response);
                    let jsonData;
                    if (self.url.startsWith("/aweme/v1/web/user/profile/other")) {
                        let userInfo = formatUserData(data.user);
                        user_map.set(userInfo.uid, userInfo);
                        current_user_id = userInfo.uid;
                        console.log("加载作者：", current_user_id);
                        let user_local_data = Array.from(user_map.values()).sort((a, b) => b.create_time - a.create_time);
                        localStorage.setItem('user_local_data', JSON.stringify(user_local_data.slice(0, max_author_num)));
                    } else if ([
                        "/aweme/v1/web/aweme/post/",
                        "/aweme/v1/web/aweme/related/",
                        "/aweme/v1/web/aweme/favorite/",
                        "/aweme/v1/web/mix/aweme/",
                        "/aweme/v1/web/tab/feed/",
                        "/aweme/v1/web/aweme/listcollection/",
                        "/aweme/v1/web/history/read/"
                    ].some(prefix => self.url.startsWith(prefix))) {
                        jsonData = formatAwemeData(data);
                    } else if ([
                        "/aweme/v1/web/follow/feed/",
                        "/aweme/v1/web/familiar/feed/",
                    ].some(prefix => self.url.startsWith(prefix))) {
                        jsonData = data.data.filter(item => item.aweme).map(item => formatDouyinAwemeData(item.aweme));
                    } else if (self.url.startsWith("/aweme/v1/web/general/search/single/")) {
                        jsonData = [];
                        for (let obj of data.data) {
                            if (obj.aweme_info) jsonData.push(formatDouyinAwemeData(obj.aweme_info))
                            if (obj.user_list) {
                                for (let user of obj.user_list) {
                                    user.items.forEach(aweme => jsonData.push(formatDouyinAwemeData(aweme)))
                                }
                            }
                        }
                    } else if (self.url.startsWith("/aweme/v1/web/module/feed/")) {
                        jsonData = data.cards.map(item => formatDouyinAwemeData(JSON.parse(item.aweme)));
                    } else if (self.url.startsWith("/aweme/v1/web/aweme/detail/")) {
                        jsonData = [formatDouyinAwemeData(data.aweme_detail)]
                    }
                    if (jsonData) jsonData = jsonData.filter(item => item.url && item.awemeId);
                    if (jsonData) {
                        sendLocalData(jsonData);
                        jsonData.forEach(aweme => {
                            all_aweme_map.set(aweme.awemeId, aweme);
                        })
                        flush();
                    }
                }
                if (func) func.apply(self, e);
            };
        };
    }

    function downloadData(node, encoding) {
        if (node === null) node = document.createElement("a");
        if (all_aweme_map.size === 0) {
            alert("还没有发现任何作品数据！");
            return;
        }
        if (node.disabled) {
            toast("下载正在处理中，请不要重复点击按钮！");
            return;
        }
        node.disabled = true;
        try {
            let text = "作者昵称,作品描述,作品链接,点赞数,评论数,收藏数,分享数,发布时间,时长,标签,分类,封面,下载链接\n";
            let user_aweme_list = Array.from(all_aweme_map.values()).sort((a, b) => b.create_time - a.create_time);
            user_aweme_list.forEach(aweme => {
                text += [aweme.nickname,
                    '"' + aweme.desc.replace(/,/g, '，').replace(/"/g, '""') + '"',
                    "https://www.douyin.com/video/" + aweme.awemeId,
                    aweme.diggCount, aweme.commentCount,
                    aweme.collectCount, aweme.shareCount, aweme.date,
                    aweme.duration, aweme.tag, aweme.video_tag,
                    aweme.cover, '"' + aweme.url + '"'].join(",") + "\n"
            });
            if (encoding === "gbk") text = str2gbk(text);
            txt2file(text, "【" + timeFormat(Date.now(), "yyyy-mm-dd") + "】抖音当前已加载数据", "csv");
        } finally {
            node.disabled = false;
        }
    }

    function downloadUserData(node, encoding) {
        if (node === null) node = document.createElement("a");
        if (user_map.size === 0) {
            toast("还没有发现任何作者数据！请访问用户主页后再试！\n以https://www.douyin.com/user/开头的链接。");
            return;
        }
        if (node.disabled) {
            toast("下载正在处理中，请不要重复点击按钮！");
            return;
        }
        node.disabled = true;
        try {
            let text = "昵称,关注,粉丝,获赞,抖音号,IP属地,性别,位置,签名,作品数,查看时间,主页\n";
            let userData = Array.from(user_map.values()).sort((a, b) => b.create_time - a.create_time);
            userData.forEach(user_info => {
                text += [user_info.nickname, user_info.following_count, user_info.mplatform_followers_count,
                    user_info.total_favorited, user_info.unique_id, user_info.ip_location,
                    user_info.gender, user_info.city,
                    '"' + user_info.signature.replace(/,/g, '，').replace(/"/g, '""') + '"',
                    user_info.aweme_count, timeFormat(user_info.create_time, "yyyy-mm-dd hh:MM:ss"),
                    "https://www.douyin.com/user/" + user_info.uid].join(",") + "\n"
            });
            if (encoding === "gbk") text = str2gbk(text);
            txt2file(text, "【" + timeFormat(Date.now(), "yyyy-mm-dd") + "】抖音已游览作者的历史记录", "csv");
        } finally {
            node.disabled = false;
        }
    }

    let img_button, data_button, user_button, msg_pre;

    function createMsgBox() {
        msg_pre = document.createElement('pre');
        msg_pre.textContent = '等待上方头像加载完毕';
        msg_pre.style.color = 'white';
        msg_pre.style.position = 'fixed';
        msg_pre.style.right = '5px';
        msg_pre.style.top = '60px';
        msg_pre.style.color = 'white';
        msg_pre.style.zIndex = '503';
        msg_pre.style.opacity = "0.4";
        document.body.appendChild(msg_pre);
    }

    function scrollPageToBottom(scroll_button) {
        let scrollInterval;

        function scrollLoop() {
            let endText = document.querySelector("div[data-e2e='user-post-list'] > ul[data-e2e='scroll-list'] + div div").innerText;
            if (endText.includes("没有更多了")) {
                clearInterval(scrollInterval);
                scrollInterval = null;
                scroll_button.p1.textContent = "已加载全部！";
            } else {
                scrollTo(0, document.body.scrollHeight);
            }
        }

        scroll_button.addEventListener('click', () => {
            if (!scrollInterval) {
                if (!location.href.startsWith("https://www.douyin.com/user/")) {
                    toast("不支持非用户主页开启下拉！");
                } else if (!document.querySelector("div[data-e2e='user-post-list']")) {
                    toast("没有找到用户作品列表！");
                } else {
                    scrollInterval = setInterval(scrollLoop, 1200);
                    scroll_button.p1.textContent = "停止自动下拉";
                }
            } else {
                clearInterval(scrollInterval);
                scrollInterval = null;
                scroll_button.p1.textContent = "开启自动下拉";
            }
        });
    }

    function createCommonElement(tagName, attrs = {}, text = "") {
        const tag = document.createElement(tagName);
        for (const [k, v] of Object.entries(attrs)) {
            tag.setAttribute(k, v);
        }
        if (text) tag.textContent = text;
        tag.addEventListener('click', (event) => event.stopPropagation());
        return tag;
    }

    function createAllButton() {
        let dom = document.querySelector("#douyin-header-menuCt pace-island > div > div:nth-last-child(1) ul a:nth-last-child(1)");
        let baseNode = dom.cloneNode(true);
        baseNode.removeAttribute("target");
        baseNode.removeAttribute("rel");
        baseNode.removeAttribute("href");
        let svgChild = baseNode.querySelector("svg");
        if (svgChild) baseNode.removeChild(svgChild);

        function createNewButton(name, num = "0") {
            let button = baseNode.cloneNode(true);
            button.p1 = button.querySelector("p:nth-child(1)");
            button.p2 = button.querySelector("p:nth-child(2)");
            button.p1.textContent = name;
            button.p2.textContent = num;
            dom.after(button);
            return button;
        }

        img_button = createNewButton("图文打包下载");
        img_button.addEventListener('click', () => downloadImg(img_button));

        let downloadCoverButton = createNewButton("封面打包下载", "");
        downloadCoverButton.addEventListener('click', () => downloadCover(downloadCoverButton));

        data_button = createNewButton("下载已加载的数据");
        data_button.p1.after(createCommonElement("label", {'for': 'gbk'}, 'gbk'));
        let checkbox = createCommonElement("input", {'type': 'checkbox', 'id': 'gbk'});
        checkbox.checked = localStorage.getItem("gbk") === "1";
        checkbox.onclick = (event) => {
            event.stopPropagation();
            localStorage.setItem("gbk", checkbox.checked ? "1" : "0");
        };
        data_button.p1.after(checkbox);
        data_button.addEventListener('click', () => downloadData(data_button, checkbox.checked ? "gbk" : "utf-8"));

        user_button = createNewButton("下载已游览的作者数据");
        user_button.addEventListener('click', () => downloadUserData(user_button, checkbox.checked ? "gbk" : "utf-8"));

        scrollPageToBottom(createNewButton("开启自动下拉到底", ""));

        let share_button = document.querySelector("#frame-user-info-share-button");
        if (share_button) {
            let node = share_button.cloneNode(true);
            node.span = node.querySelector("span");
            node.span.innerHTML = "复制作者信息";
            node.onclick = () => copyUserData(node.span);
            share_button.after(node);
        }
    }

    GM_registerMenuCommand("📋下载已加载的数据", () => {
        downloadData(null, localStorage.getItem("gbk") === "1" ? "gbk" : "utf-8");
    })
    GM_registerMenuCommand("📰下载已游览的作者数据", () => {
        downloadUserData(null, localStorage.getItem("gbk") === "1" ? "gbk" : "utf-8");
    })

    async function downloadCover(node) {
        if (all_aweme_map.size === 0) {
            toast("还没有发现任何作品数据！");
            return;
        }
        if (node.disabled) {
            toast("下载正在处理中，请不要重复点击按钮！");
            return;
        }
        node.disabled = true;
        try {
            const zip = new JSZip();
            msg_pre.textContent = `下载封面并打包中...`;
            let user_aweme_list = Array.from(all_aweme_map.values()).sort((a, b) => b.create_time - a.create_time);
            let promises = user_aweme_list.map((aweme, index) => {
                let awemeName = getAwemeName(aweme) + ".jpg";
                return fetch(aweme.cover)
                    .then(response => response.arrayBuffer())
                    .then(buffer => zip.file(awemeName, buffer))
                    .then(() => msg_pre.textContent = `${index + 1}/${user_aweme_list.length} ` + awemeName)
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

    async function downloadImg(node) {
        if (node.disabled) {
            toast("下载正在处理中，请不要重复点击按钮！");
            return;
        }
        node.disabled = true;
        try {
            const zip = new JSZip();
            let flag = true;
            let aweme_img_list = Array.from(all_aweme_map.values()).sort((a, b) => b.create_time - a.create_time).filter(a => a.images);
            for (let [i, aweme] of aweme_img_list.entries()) {
                let awemeName = getAwemeName(aweme);
                msg_pre.textContent = `${i + 1}/${aweme_img_list.length} ` + awemeName;
                let folder = zip.folder(awemeName);
                await Promise.all(aweme.images.map((link, index) => {
                    return fetch(link)
                        .then((res) => res.arrayBuffer())
                        .then((buffer) => {
                            folder.file(`image_${index + 1}.jpg`, buffer);
                        });
                }));
                flag = false;
            }
            if (flag) {
                alert("当前页面未发现图文链接");
                node.disabled = false;
                return;
            }
            msg_pre.textContent = "图文打包中...";
            zip.generateAsync({type: "blob"})
                .then((content) => {
                    createDownloadLink(content, null, "zip", "【图文】");
                    msg_pre.textContent = "图文打包完成";
                    node.disabled = false;
                });
        } finally {
            node.disabled = false;
        }
    }

    function douyinVideoDownloader() {
        const adjustMargin = (toolDom) => {
            let virtualDom = toolDom.querySelector('.virtual');
            if (location.href.includes('search') && !location.href.includes('modal_id')) {
                toolDom.style.marginTop = "0px";
                virtualDom.style.marginBottom = "37px";
            } else {
                toolDom.style.marginTop = "-68px";
                virtualDom.style.marginBottom = "0px";
            }
        }
        const clonePlayclarity2Download = (xgPlayer, videoId, videoContainer) => {
            let toolDom = xgPlayer.querySelector(`.xgplayer-playclarity-setting[data-vid]`);
            let attrs = {class: "item", style: "text-align:center;"};

            let aweme = all_aweme_map.get(videoId);
            if (toolDom) {
                toolDom.dataset.vid = videoId;
                videoContainer.dataset.vid = videoId;
                adjustMargin(toolDom);
                let virtualDom = toolDom.querySelector('.virtual');
                if (!aweme) return;
                if (!aweme.images && virtualDom.dataset.image) {
                    virtualDom.removeChild(virtualDom.lastElementChild);
                    delete virtualDom.dataset.image;
                } else if (aweme.images && !virtualDom.dataset.image) {
                    let downloadDom2 = createCommonElement("div", attrs, "图文下载");
                    virtualDom.appendChild(downloadDom2);
                    downloadDom2.onclick = () => {
                        aweme = all_aweme_map.get(toolDom.dataset.vid);
                        if (!aweme) {
                            toast('未捕获到对应数据源！');
                        } else if (!aweme.images) {
                            toast('捕获的数据源，不含图片信息！');
                        } else {
                            downloadImage(aweme, downloadDom2);
                        }
                    };
                    virtualDom.dataset.image = videoId;
                }
                return;
            }
            // console.log("打开视频", videoId);
            // if (!aweme) return;
            // toast('当前打开的视频未捕获到数据源，若需要下载请转入观看历史下载！');
            const parser = new DOMParser();
            const doc = parser.parseFromString('<xg-icon class="xgplayer-playclarity-setting" data-state="normal" data-index="7.6">' +
                '<div class="gear"><div class="virtual"></div><div class="btn">下载</div></div></xg-icon>', 'text/html');
            toolDom = doc.body.firstChild;

            toolDom.dataset.vid = videoId;
            toolDom.dataset.index = "7.6";
            videoContainer.dataset.vid = videoId;
            toolDom.style.paddingTop = '100px';
            adjustMargin(toolDom);

            let downloadText = toolDom.querySelector('.btn');
            if (!downloadText) return;
            downloadText.textContent = '下载';
            downloadText.style = 'font-size:14px;font-weight:600;';

            let virtualDom = toolDom.querySelector('.virtual');
            if (!virtualDom) return;
            toolDom.onmouseover = () => virtualDom.style.display = 'block';
            toolDom.onmouseout = () => virtualDom.style.display = 'none';
            virtualDom.innerHTML = '';

            let copyDescDom = createCommonElement("div", attrs, "复制描述");
            virtualDom.appendChild(copyDescDom);

            function checkDatasetVid() {
                if (toolDom.dataset.vid === "null") toolDom.dataset.vid = player.root.closest('div[data-e2e="feed-active-video"]').getAttribute('data-e2e-vid');
            }

            copyDescDom.onclick = () => {
                checkDatasetVid();
                aweme = window.all_aweme_map.get(toolDom.dataset.vid);
                console.log("复制对象：", toolDom.dataset.vid, aweme);
                let textContent = aweme && aweme.desc ? aweme.desc : "";
                let videoDescNode = player.root.querySelector('div[data-e2e="video-desc"]');
                if (!textContent && videoDescNode) {
                    textContent = videoDescNode.textContent
                }
                if (!textContent) {
                    toast('没有发现描述信息！');
                } else {
                    copyText(textContent, copyDescDom);
                }
            }
            let toLinkDom = createCommonElement("div", attrs, "打开视频");
            virtualDom.appendChild(toLinkDom);
            toLinkDom.onclick = () => {
                checkDatasetVid();
                aweme = all_aweme_map.get(toolDom.dataset.vid);
                if (aweme && aweme.url) window.open(aweme.url);
                else {
                    window.open(player.videoList[0].playAddr[0].src);
                }
            };
            let downloadDom = createCommonElement("div", attrs, "下载视频");
            virtualDom.appendChild(downloadDom);
            downloadDom.onclick = () => {
                checkDatasetVid();
                aweme = all_aweme_map.get(toolDom.dataset.vid);
                if (aweme && aweme.url) {
                    downloadVideo(aweme, downloadDom);
                } else if (player) {
                    let videoDescNode = player.root.querySelector('div[data-e2e="video-desc"]');
                    let filename = videoDescNode ? videoDescNode.textContent.replace("展开", '') : window.title;
                    downloadUrl(player.videoList[0].playAddr[0].src, downloadDom, filename);
                } else {
                    toast('未捕获到对应数据源！')
                }
            };
            if (aweme && aweme.images) {
                let downloadDom2 = createCommonElement("div", attrs, "图文下载");
                virtualDom.appendChild(downloadDom2);
                downloadDom2.onclick = () => {
                    aweme = all_aweme_map.get(toolDom.dataset.vid);
                    if (!aweme) {
                        toast('未捕获到对应数据源！');
                    } else if (!aweme.images) {
                        toast('捕获的数据源，不含图片信息！');
                    } else {
                        downloadImage(aweme, downloadDom2);
                    }
                };
                virtualDom.dataset.image = videoId;
            }
            xgPlayer.appendChild(toolDom);
        }
        const run = (node) => {
            if (!node) return;
            let activeVideoElement = node.closest('div[data-e2e="feed-active-video"]');
            let videoId, xgPlayer, videoContainer;
            if (activeVideoElement) {
                videoId = activeVideoElement.getAttribute('data-e2e-vid');
                xgPlayer = activeVideoElement.querySelector('.xg-right-grid');
                videoContainer = activeVideoElement.querySelector("video");
            } else {
                let playVideoElements = Array.from(document.querySelectorAll('video')).filter(v => v.autoplay);
                videoContainer = location.href.includes('modal_id')
                    ? playVideoElements[0]
                    : playVideoElements[playVideoElements.length - 1];
                xgPlayer = node.closest('.xg-right-grid');
                let detailVideoInfo = document.querySelector("[data-e2e='detail-video-info']");
                videoId = detailVideoInfo ? detailVideoInfo.getAttribute('data-e2e-aweme-id') : null;
                videoId = videoId ? videoId : new URLSearchParams(location.search).get('modal_id');
            }
            if (!xgPlayer || !videoContainer) return;
            clonePlayclarity2Download(xgPlayer, videoId, videoContainer);
        }
        const rootObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.className === "gear" || (node.className === "xgplayer-icon" && node.dataset.e2e === "video-player-auto-play") ||
                        (node.classList && node.classList.contains("xgplayer-inner-autoplay"))) {
                        run(node);
                    }
                    // if (node.closest && node.closest('.xg-right-grid')) {
                    //     console.log(node.outerHTML, node);
                    // }
                });
            });
        });
        rootObserver.observe(document.body, {childList: true, subtree: true});
        const checkVideoNode = () => {
            if (typeof player === "undefined" || !player.video) return;
            if (player.root.querySelector(`.xgplayer-playclarity-setting[data-vid]`)) return;
            let xgPlayer = player.root.querySelector('.xg-right-grid');
            if (!xgPlayer) return;
            let activeVideoElement = player.root.closest('div[data-e2e="feed-active-video"]');
            let videoId = activeVideoElement ? activeVideoElement.getAttribute('data-e2e-vid') : "";
            videoId = videoId ? videoId : new URLSearchParams(location.search).get('modal_id');
            clonePlayclarity2Download(xgPlayer, videoId, player.video);
        };
        setInterval(checkVideoNode, 1000);
    }

    function userDetailObserver() {
        const observeList = (scrollList) => {
            if (!scrollList) return;
            console.log('开始监听新创建的视频列表！');
            listObserver.observe(scrollList, {childList: true});
        };
        const listObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type !== 'childList') continue;
                mutation.addedNodes.forEach(node => {
                    createButtonGroup(node.querySelector("a"));
                });
            }
        });
        const rootObserver = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type !== 'childList') continue;
                mutation.addedNodes.forEach(node => {
                    if (!node.querySelector) return;
                    observeList(node.querySelector("ul[data-e2e='scroll-list']"));
                });
                mutation.removedNodes.forEach(node => {
                    if (node.querySelector && node.querySelector("ul[data-e2e='scroll-list']")) {
                        console.log('关闭了一个视频列表');
                        listObserver.disconnect();
                    }
                });
            }
        });
        rootObserver.observe(document.body, {childList: true, subtree: true});
        observeList(document.querySelector("div[data-e2e='user-detail'] ul[data-e2e='scroll-list']"));
    }

    if (document.title === "验证码中间页") return;
    createMsgBox();
    interceptResponse();
    douyinVideoDownloader();
    userDetailObserver();
    let domLoadedTimer;
    const checkElementLoaded = () => {
        const element = document.querySelector('#douyin-header-menuCt pace-island > div > div:nth-last-child(1) ul a');
        if (element) {
            console.log('顶部栏加载完毕');
            msg_pre.textContent = "头像加载完成\n若需要下载用户数据，需进入目标用户主页\n若未捕获到数据，可以刷新重试";
            clearInterval(domLoadedTimer);
            domLoadedTimer = null;
            createAllButton();
            flush();
        }
    };
    document.w = window;
    window.onload = () => {
        domLoadedTimer = setInterval(checkElementLoaded, 700);
    }
})();