// ==UserScript==
// @name         百合会漫画
// @namespace    https://bbs.yamibo.com/
// @version      0.9.1
// @description  百合会漫画阅读与下载
// @author       mooth
// @match        https://bbs.yamibo.com/forum-30*
// @match        https://bbs.yamibo.com/forum.php?mod=forumdisplay&fid=30*
// @match        https://bbs.yamibo.com/thread*
// @match        https://bbs.yamibo.com/forum.php?mod=viewthread&tid*

// @icon         https://www.google.com/s2/favicons?domain=yamibo.com

// @require      https://update.greasyfork.org/scripts/471654/1225059/vue3js.js
// @require      https://unpkg.com/fflate@0.8.2/umd/index.js
// @require      https://unpkg.com/axios@1.7.2/dist/axios.min.js

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/436086/%E7%99%BE%E5%90%88%E4%BC%9A%E6%BC%AB%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/436086/%E7%99%BE%E5%90%88%E4%BC%9A%E6%BC%AB%E7%94%BB.meta.js
// ==/UserScript==


(function () {
    GM_addElement('link', {
        href: 'https://unpkg.com/element-plus/dist/index.css',
        rel: 'stylesheet'
    });
    GM_addElement('script', {
        src: 'https://unpkg.com/element-plus',
        type: 'text/javascript',
        id: "element"
    });

    const { createApp, computed, ref, reactive, onMounted, watch } = Vue;

    // 公用方法 ---------------------------------------------------------------------------
    const PubFun = {
        // 创建碎片
        Fragment: (id) => {
            const f = document.createDocumentFragment();
            f.appendChild(document.querySelector(id));
            return f;
        },

        // 解析地址 html_str 返回页面中解析的地址数组
        getUrls: (html) => {
            try {
                // 定义三个数组，分别存储三种不同目的的图片地址
                let urlCandidates = [new Array(), new Array(), new Array()];

                // 定义一个数组，用于存储最终解析出的图片地址
                let urls = [];

                // 使用正则表达式匹配三种不同格式的图片地址
                if (html.match(/zoomfile="(.*?)"/g)) {
                    urlCandidates[2] = html.match(/zoomfile="(.*?)"/g);
                }
                if (html.match(/https:\/\/bbs\.yamibo\.com\/data.*?"/g)) {
                    urlCandidates[1] = html.match(/https:\/\/bbs\.yamibo\.com\/data.*?"/g);
                }
                if (html.match(/<img.*?class="zoom".*?file="(.*?)"/g)) {
                    urlCandidates[0] = html.match(/<img.*?class="zoom".*?file="(.*?)"/g);
                }

                // 将三个数组按照长度排序，优先处理匹配数量最多的情况
                urlCandidates.sort((a, b) => b.length - a.length);

                // 遍历三个数组，将匹配到的图片地址进行格式化后存储到 urls 数组中
                urlCandidates.forEach(list => {
                    list.forEach(str => {
                        if (str.match("bbs.yamibo.com")) {
                            urls.push(str.match(/(https.*?)"/)[1]);
                            // "zoomfile=\"data/attachment/forum/202406/06/120022lu22z92dtq3hedq9.jpg\""
                        } else if (str.match(/zoomfile="(.*?)"/)) {
                            urls.push("https:\/\/bbs.yamibo.com/" + str.match(/zoomfile="(.*?)"/)[1]);
                        } else {
                            urls.push(
                                str.match(/<img.*?class="zoom".*?file="(.*?)"/)[1]
                                    .replace("http", "https")
                            );
                        }
                    });
                });

                // 过滤不需要的图片 和错误匹配
                urls = [...new Set(urls.filter(url => {
                    if (!url.endsWith('.gif') && !url.match('static')) {
                        return url
                    }
                }))];

                // 返回解析出的图片地址数组
                return urls;
            } catch (error) {
                console.log("html地址解析", error);
            }
        },

        // 获取图片生成本地地址 解决跨域 设置同源
        cross: async (url) => {
            return new Promise((resolve, reject) => {
                try {
                    // 将 httpss 替换为 https
                    url = url.replace("httpss", "https");
                    // 定义一个变量，用于存储 blob URL
                    let blobUrl = "";
                    GM_xmlhttpRequest({
                        method: "get",
                        url: url,
                        responseType: "blob",
                        headers: {
                            Referer: "https://bbs.yamibo.com/forum.php?"
                        },
                        onload: (res) => {
                            try {
                                // 将响应数据转换为 blob URL
                                blobUrl = window.URL.createObjectURL(res.response);
                            } catch (error) {
                                reject(`PubFun.cross图片转本地地址 \n${url}\n ${error}`)
                            }

                            resolve(blobUrl);
                        },
                        onerror: () => {
                            console.error("无法链接到该页面");
                            reject("无法链接到该页面");
                        }
                    });
                } catch (error) {
                    reject(`PubFun.cross\n${error}\n${url}`);
                }

            });
        },

        // 文件储存
        saveAs: (data, name, type) => {
            // 创建一个 a 标签
            const link = document.createElement("a");
            // 创建一个 blob URL
            const url = window.URL.createObjectURL(data);
            // 设置 a 标签的 href 属性为 blob URL
            link.href = url;
            // 设置 a 标签的 download 属性为文件名
            link.download = name + "." + type;
            // 模拟点击 a 标签，触发下载
            link.click();
        },

        // fflate打包
        fflate_zip: async (name, urlList, state) => {
            let num = 0;
            let file_b_list = {}
            await new Promise(async resolve => {
                for (let i = 0; i < urlList.length; i++) {
                    const url = urlList[i];
                    try {
                        const res = await axios.get(url, { responseType: 'blob' });
                        num++;

                        if (state) {
                            state.done = num;
                            state.allTasks = urlList.length;
                        }

                        const file_blob = res.data;
                        const file_type = file_blob.type.match(/\/(.*)/)?.[1];
                        const file = new Uint8Array(await file_blob.arrayBuffer());

                        file_b_list[`${i + 1}.${file_type}`] = file;
                    } catch (error) {
                        num++;
                        if (state) {
                            state.error++;
                        }
                        console.error("下载失败:", url, error);
                    }

                    // 完成
                    if(i === urlList.length-1){
                        resolve()
                    }
                }
            });

            // 更新下载状态
            if (state) { state.pack = 1; }
            console.log(file_b_list);
            fflate.zip(file_b_list, { level: 0 }, (err, content) => {
                console.log(content);
                // 生成 zip 包并下载
                try {
                    PubFun.saveAs(new Blob([content], { type: "application/zip" }), name, "zip")
                    // 更新下载状态
                    if (state) {
                        state.pack = 2;
                    }
                } catch (e) {
                    // 更新下载状态
                    if (state) {
                        state.pack = 3;
                    }
                    // 打印错误信息
                    console.error("打包失败:", e);
                }
            })

        },

        // 任务队列 a = new createTaskQueue(10), a.addTask(()=>fun())
        createTaskQueue: (concurrency = 10) => {
            const queue = [];
            let running = 0;

            const run = () => {
                while (running < concurrency && queue.length > 0) {
                    const task = queue.shift();
                    running++;
                    task()
                        .then(() => {
                            running--;
                            run();
                        })
                        .catch(() => {
                            running--;
                            run();
                        });
                }
            };

            const addTask = (task) => {
                queue.push(task);
                run();
            };

            return {
                addTask
            }
        }
    };

    // 漫画列表组件 ---------------------------------------------------------------------------
    class MangaListComponent {
        static f = []
        static columns = 2

        constructor() {
            // 初始化 列数
            if (!GM_getValue("columns")) {
                GM_setValue("columns", 2)
                MangaListComponent.columns = 2
            } else {
                MangaListComponent.columns = GM_getValue("columns")
            }

            // 获取表格节点
            MangaListComponent.f = PubFun.Fragment("#threadlisttableid")

            // 模板样式
            MangaListComponent.style = `
                .columns_container{
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    svg{
                        /* height: 40px; */
                        fill: burlywood;
                        cursor: pointer;
                    }
                }
                .columns_selected{
                    fill: #551201 !important;
                }
                .mt_manga_message_container{
                    display: grid;
                }
                .mt_manga_message {
                    display: flex;
                    height: 150px;
                    padding: 10px 0;
                    /* width: 50%; */
                    float: left;
                    overflow: auto;
                }

                .mt_manga_message::-webkit-scrollbar {
                    /* 整体*/
                    width: 5px;
                }

                .mt_manga_face {
                    height: 100%;
                    img{
                        height: 100%;
                    }
                }

                .mt_manga_info {
                    padding: 0 10px;
                }
                        `
            GM_addStyle(MangaListComponent.style)

            // 模板
            MangaListComponent.template = `
                            <div class="columns_container">
                                <svg @click="columns=1" :class="{'columns_selected':columns==1}" height="40px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1467" ><path d="M868.352 568.32q32.768 0 53.248 19.456t20.48 52.224l0 221.184q0 35.84-19.968 54.784t-52.736 18.944l-706.56 0q-33.792 0-56.832-22.528t-23.04-55.296l0-212.992q0-35.84 19.968-55.808t54.784-19.968l710.656 0zM868.352 90.112q32.768 0 53.248 18.944t20.48 52.736l0 220.16q0 35.84-19.968 54.784t-52.736 18.944l-706.56 0q-33.792 0-56.832-22.528t-23.04-55.296l0-211.968q0-35.84 19.968-55.808t54.784-19.968l710.656 0z" p-id="1468"></path></svg>
                                <svg @click="columns=2" :class="{'columns_selected':columns==2}" height="47px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1618" ><path d="M433.1 480 174.9 480c-25.9 0-46.9-21-46.9-46.9L128 174.9c0-25.9 21-46.9 46.9-46.9l258.2 0c25.9 0 46.9 21 46.9 46.9l0 258.2C480 459 459 480 433.1 480z" p-id="1619"></path><path d="M433.1 896 174.9 896c-25.9 0-46.9-21-46.9-46.9L128 590.9c0-25.9 21-46.9 46.9-46.9l258.2 0c25.9 0 46.9 21 46.9 46.9l0 258.2C480 875 459 896 433.1 896z" p-id="1620"></path><path d="M849.1 480 590.9 480c-25.9 0-46.9-21-46.9-46.9L544 174.9c0-25.9 21-46.9 46.9-46.9l258.2 0c25.9 0 46.9 21 46.9 46.9l0 258.2C896 459 875 480 849.1 480z" p-id="1621"></path><path d="M849.1 896 590.9 896c-25.9 0-46.9-21-46.9-46.9L544 590.9c0-25.9 21-46.9 46.9-46.9l258.2 0c25.9 0 46.9 21 46.9 46.9l0 258.2C896 875 875 896 849.1 896z" p-id="1622"></path></svg>
                                <svg @click="columns=3" :class="{'columns_selected':columns==3}" height="40px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1768" ><path d="M248.832 63.488q28.672 0 48.64 19.968t19.968 48.64l0 116.736q0 28.672-19.968 48.64t-48.64 19.968l-116.736 0q-28.672 0-48.64-19.968t-19.968-48.64l0-116.736q0-28.672 19.968-48.64t48.64-19.968l116.736 0zM572.416 63.488q28.672 0 48.64 19.968t19.968 48.64l0 116.736q0 28.672-19.968 48.64t-48.64 19.968l-118.784 0q-28.672 0-48.64-19.968t-19.968-48.64l0-116.736q0-28.672 19.968-48.64t48.64-19.968l118.784 0zM891.904 63.488q28.672 0 48.64 19.968t19.968 48.64l0 116.736q0 28.672-19.968 48.64t-48.64 19.968l-118.784 0q-28.672 0-48.64-19.968t-19.968-48.64l0-116.736q0-28.672 19.968-48.64t48.64-19.968l118.784 0zM248.832 385.024q28.672 0 48.64 19.968t19.968 48.64l0 116.736q0 28.672-19.968 48.64t-48.64 19.968l-116.736 0q-28.672 0-48.64-19.968t-19.968-48.64l0-116.736q0-28.672 19.968-48.64t48.64-19.968l116.736 0zM572.416 385.024q28.672 0 48.64 19.968t19.968 48.64l0 116.736q0 28.672-19.968 48.64t-48.64 19.968l-118.784 0q-28.672 0-48.64-19.968t-19.968-48.64l0-116.736q0-28.672 19.968-48.64t48.64-19.968l118.784 0zM891.904 385.024q28.672 0 48.64 19.968t19.968 48.64l0 116.736q0 28.672-19.968 48.64t-48.64 19.968l-118.784 0q-28.672 0-48.64-19.968t-19.968-48.64l0-116.736q0-28.672 19.968-48.64t48.64-19.968l118.784 0zM248.832 706.56q28.672 0 48.64 19.968t19.968 48.64l0 116.736q0 28.672-19.968 48.64t-48.64 19.968l-116.736 0q-28.672 0-48.64-19.968t-19.968-48.64l0-116.736q0-28.672 19.968-48.64t48.64-19.968l116.736 0zM572.416 706.56q28.672 0 48.64 19.968t19.968 48.64l0 116.736q0 28.672-19.968 48.64t-48.64 19.968l-118.784 0q-28.672 0-48.64-19.968t-19.968-48.64l0-116.736q0-28.672 19.968-48.64t48.64-19.968l118.784 0zM891.904 706.56q28.672 0 48.64 19.968t19.968 48.64l0 116.736q0 28.672-19.968 48.64t-48.64 19.968l-118.784 0q-28.672 0-48.64-19.968t-19.968-48.64l0-116.736q0-28.672 19.968-48.64t48.64-19.968l118.784 0z" p-id="1769"></path></svg>
                            </div>

                            <div class="mt_manga_message_container">
                                <div v-for="(item, index) in comicList" :key="item.id" class="mt_manga_message" >
                                    <div class="mt_manga_face">
                                        <img :src="item.face" class="face" alt="封面">
                                    </div>
                                    <div v-html="item.innerHTML" class="mt_manga_info"></div>
                                </div>
                            </div>

                            `
            // 创建
            createApp(
                {
                    template: MangaListComponent.template,
                    setup() {
                        // 获取主题列表
                        const fragment = MangaListComponent.f;
                        // 定义主题链接
                        const url = "https://bbs.yamibo.com/forum.php?mod=viewthread&tid=";
                        // 列数
                        const columns = ref(MangaListComponent.columns)
                        // 定义漫画列表数据
                        const comicList = ref([]);
                        // 计算属性，为每个漫画项添加默认封面
                        const computedComicList = computed(() => comicList.value.map((item) => ({
                            ...item,
                            face: item.face || "https://bbs.yamibo.com/data/attachment/forum/201504/01/110518de9s4qsd6qtzbn9m.jpg"
                        })));

                        ////////////////////////////////////////////////////////////////////////////////////
                        // 获取漫画封面
                        const getComicCover = async (url_0, index) => {
                            return new Promise(async (resolve, reject) => {
                                let url = url_0

                                // 判断是否需要重定向
                                let res = await axios.get(url)
                                // 不需要，直接解析html
                                if (res.data.match('html')) {
                                    console.log(`直接解析，${url}`);
                                    // 解析HTML获取图片地址
                                    const urls = PubFun.getUrls(res.data);
                                    // 将解析到的第一个图片地址设置为封面
                                    comicList.value[index].face = await PubFun.cross(urls[0]);
                                    resolve()
                                    return
                                }

                                // 需要重定向
                                try {
                                    // 获取重定向地址
                                    url = await get_redirect_url_eval(url_0)
                                    // 通过iframe 获取重定向地址
                                    if (url == url_0) {
                                        url = await get_redirect_url_iframe(url_0)
                                    }
                                } catch (error) {
                                    // 通过iframe 获取重定向地址
                                    url = await get_redirect_url_iframe(url_0)
                                }

                                // 发送请求获取对应漫画页面的HTML
                                try {
                                    axios.get(url)
                                        .then(async (res) => {

                                            const data = res.data;

                                            // 是否重新加载
                                            if (!data.match('https')) {
                                                console.log("二次加载封面");
                                                getComicCover(url, index)
                                                return
                                            }

                                            let urls = []
                                            try {
                                                // 解析HTML获取图片地址
                                                urls = PubFun.getUrls(data);
                                                // 将解析到的第一个图片地址设置为封面
                                                comicList.value[index].face = await PubFun.cross(urls[0]);

                                                resolve()
                                            } catch (e) {
                                                console.error({
                                                    "漫画页地址": url_0,
                                                    "地址重定向转换": url,
                                                    "封面地址": urls,
                                                    "请求响应": res,
                                                    e
                                                });
                                                resolve()
                                            }
                                        })
                                        .catch((error) => {
                                            // 打印错误信息
                                            console.error(`请求失败${url_0}:\n ${error}`);
                                            resolve()
                                        });
                                } catch (error) {
                                    resolve()
                                }


                            })
                        };

                        // 获取重定向地址 通过eval直接执行地址重定向代码
                        const get_redirect_url_eval = (url) => {
                            return new Promise((resolve, reject) => {
                                try {
                                    // 定义自定义 window 对象
                                    const myWindow = {
                                        window: {
                                            location: {
                                                og: url,
                                                href: url,
                                                assign: (newUrl) => { myWindow.window.location.href = newUrl },
                                            }
                                        },
                                        location: {
                                            href: url,
                                            assign: (newUrl) => { myWindow.location.href = newUrl },
                                            replace: (newUrl) => { myWindow.location.href = newUrl }
                                        },
                                    };

                                    // 定义eval上下文
                                    function evalWithContext(code, context) {
                                        return (function () {
                                            // 通过参数解构来获取上下文中的变量和函数
                                            const contextKeys = Object.keys(context);
                                            const contextValues = contextKeys.map(key => context[key]);
                                            // 创建一个新的函数，该函数的参数是上下文中的变量名，并在函数体中执行代码
                                            const func = new Function(...contextKeys, code);
                                            // 调用函数，并将上下文中的变量值作为参数传递给函数
                                            return func(...contextValues);
                                        })();
                                    }

                                    axios.get(url)
                                        .then(response => {
                                            // 获取跳转代码
                                            const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/i;
                                            const match = response.data.match(scriptRegex);

                                            if (match && match[1]) {
                                                const scriptContent = match[1];

                                                // 执行跳转代码
                                                evalWithContext(scriptContent, myWindow);

                                                console.log(myWindow);

                                                if (myWindow.location.href.match("https")) {
                                                    resolve(myWindow.location.href);
                                                } else {
                                                    resolve("https://bbs.yamibo.com" + myWindow.location.href);
                                                }
                                            } else {
                                                reject(url);
                                            }
                                        })
                                        .catch(error => {
                                            console.error('get_redirect_url_eval错误:', myWindow, error);
                                            reject(url);
                                        });
                                } catch (error) {
                                    reject(url)
                                }

                            });
                        };

                        // 在eval失败后 通过iframe直接执行地址重定向代码
                        const get_redirect_url_iframe = (url) => {
                            return new Promise((resolve, reject) => {

                                // 创建一个 iframe 元素并设置其 src 属性
                                const iframe = document.createElement('iframe');
                                iframe.src = "";
                                // iframe.sandbox = "allow-same-origin allow-scripts"
                                iframe.style.display = "none"
                                document.body.appendChild(iframe)

                                iframe.onload = () => {
                                    console.log("get_redirect_url_iframe", iframe.contentDocument.location.href);
                                    resolve(iframe.contentDocument.location.href)
                                    document.body.removeChild(iframe)
                                }

                                iframe.contentDocument.location.href = url
                            })
                        }

                        // 渐进式加载漫画封面
                        const progressiveLoad = () => {
                            // 10个10个加载
                            const queue = PubFun.createTaskQueue(10);
                            comicList.value.forEach((item, index) => {
                                queue.addTask(() => getComicCover(item.url, index))
                            })
                        };


                        ///////////////////////////////////////////////////////////////////////////////
                        // 通过原始网页数据初始化漫画列表数据 获取对应漫画地址
                        const inti_manga_data = () => {
                            for (let i in fragment.children[0].children) {
                                const el = fragment.children[0].children[i];
                                if (typeof el === "object" && el.id && el.id.match("normalthread")) {
                                    comicList.value.push({
                                        id: el.id,
                                        innerHTML: el.innerHTML,
                                        children: el.children,
                                        url: url + el.id.match("normalthread_(.*)")[1]
                                    });
                                }
                            }
                        }
                        // 组件挂载后执行
                        onMounted(() => {
                            // 初始化漫画列表数据
                            inti_manga_data()
                            // 开始渐进式加载漫画封面
                            progressiveLoad();
                        });

                        ///////////////////////////////////////////////////////////////////////////////
                        // 修改列数
                        watch(columns, (new_val, old_val) => {
                            const el = document.querySelector(".mt_manga_message_container")
                            el.style.gridTemplateColumns = `repeat(${new_val}, 1fr)`;

                            GM_setValue("columns", new_val)
                        })
                        onMounted(() => {
                            const el = document.querySelector(".mt_manga_message_container")
                            el.style.gridTemplateColumns = `repeat(${columns.value}, 1fr)`;
                        })

                        ///////////////////////////////////////////////////////////////////////////////////////////
                        return {
                            comicList: computedComicList,
                            columns
                        };
                    }
                }
            )
                .mount("#moderate")
        }

    };


    // 漫画页面组件 ---------------------------------------------------------------------------
    class MangaComponent {
        constructor() {
            console.log("漫画页面加载");

            // 用于 与vue通信，是否加载漫画模式
            MangaComponent.model_state = 1

            // 百合会»论坛›江湖›貼圖區›中文百合漫画区›【提灯喵汉化组】[金子ある]平良深姐妹都“病”得不轻 1 ...
            // 获取索要创建按钮的位置
            MangaComponent.pt = document.querySelector("#pt")

            // 创建 模式切换按钮
            MangaComponent.mt_cut = document.createElement("div")
            MangaComponent.mt_cut.id = "mt_cut"
            MangaComponent.mt_cut.innerText = "[漫画模式]"
            // 切换模式
            MangaComponent.mt_cut.addEventListener("click", () => {
                if (MangaComponent.model_state === 1) {
                    document.querySelector("#mt_old").style.display = "none"
                    document.querySelector("#mt_manga").style.display = "block"
                    MangaComponent.mt_cut.innerText = "[原始模式]"
                    MangaComponent.model_state = 2
                } else {
                    document.querySelector("#mt_old").style.display = "block"
                    document.querySelector("#mt_manga").style.display = "none"
                    MangaComponent.mt_cut.innerText = "[漫画模式]"
                    MangaComponent.model_state = 1
                }
            })
            // 添加
            MangaComponent.pt.appendChild(MangaComponent.mt_cut)

            // 定义自己el,用于存放两种模式
            MangaComponent.my_el = document.createElement("div")
            MangaComponent.my_el.id = "my_el"
            // 在他的下方插入自己的el
            MangaComponent.pt.parentNode.insertBefore(MangaComponent.my_el, MangaComponent.pt.nextSibling)

            // html模板
            MangaComponent.my_el.innerHTML = `
                    <div id="mt_old"></div>
                    <div id="mt_manga" style="display: none;">
                        <div >
                            <div v-if="urlsLoaded" id = "mt_manga_box" @dblclick="fullScreen = !fullScreen"
                            :class="{is_one_p:onePage , not_one_p:!onePage , is_r_to_l:rightToLeft, is_w_bg:whiteBg}">
                                <div id="mt_set" v-show="showSettings">
                                    <div class="block">
                                        <el-slider v-model="imageSize"></el-slider>
                                        <el-checkbox v-model="rightToLeft">从右向左</el-checkbox>
                                        <el-checkbox v-model="onePage">单开</el-checkbox>
                                        <el-checkbox v-model="whiteBg">白底</el-checkbox>
                                        <el-radio>
                                            <span @click="download()">{{downloadInfo}}</span>
                                        </el-radio>
                                    </div>
                                </div>

                                <img :style="{'width':imageSize +'%'}"
                                    :src="url" class="mt_manga_img" v-for="url in urlList"
                                    @click="showSettings = !showSettings"
                                    >
                            </div>
                        </div>
                    </div>
                `
            // 样式
            MangaComponent.style = `
                        #mt_cut{
                            float: right;
                            font-weight: bold;
                        }
                        .mt_manga_img{
                        }
                        #mt_manga_box{
                            overflow: auto;
                            display: flex;
                        }
                        .is_one_p{
                            flex-direction: column;
                            flex-wrap: nowrap;
                            align-items: center
                        }
                        .not_one_p{
                            flex-wrap: wrap;
                            align-content: flex-start;
                            justify-content: center
                        }
                        .is_r_to_l{
                            flex-direction: row-reverse;
                        }
                        .is_w_bg{
                            background-color: white;
                        }

                        #mt_manga_box::-webkit-scrollbar{    /* 整体*/
                            width: 3px;
                            height: 10px
                        }
                        #mt_manga_box::-webkit-scrollbar-thumb{  /* 滑动条*/
                            background-color: rgb(208, 208, 208);
                            border-radius: 1px;
                        }
                        #mt_set{
                            width: 360px;
                            height: 70px;
                            background-color: rgb(235 179 82);
                            position: fixed;
                            border-radius: 5px;
                            padding: 10px;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                    `
            GM_addStyle(MangaComponent.style)

            // 碎片 用户发布部分
            MangaComponent.f = PubFun.Fragment("#ct")
            document.querySelector("#mt_old").appendChild(MangaComponent.f)


            // 初始化数据
            // 解析页面中的图片地址
            MangaComponent.urls = PubFun.getUrls(document.querySelector("#mt_old").innerHTML);

            localStorage.getItem('size') ? null : localStorage.setItem('size', "100")

            // 创建
            createApp(
                {
                    setup() {
                        // 定义模式状态，1为默认模式，2为漫画模式
                        const model_state = ref(MangaComponent.model);
                        // 定义图片地址列表
                        const urlList = MangaComponent.urls;
                        // 定义图片地址是否加载完成状态
                        const urlsLoaded = ref(true);
                        // 定义是否全屏状态
                        const fullScreen = ref(false);
                        // 定义是否显示设置面板状态
                        const showSettings = ref(false);
                        // 定义下载按钮文字
                        const downloadInfo = ref("下载");
                        // 定义下载状态
                        const downloadState = reactive({ done: 0, error: 0, allTasks: 0, pack: 0 });
                        // 定义图片大小
                        const imageSize = ref(localStorage.getItem('size') - 0);
                        // 定义是否从右向左阅读
                        const rightToLeft = ref(localStorage.getItem("rightToLeft") === "1");
                        // 定义是否单页显示
                        const onePage = ref(localStorage.getItem("onePage") === "1");
                        // 定义是否使用白色背景
                        const whiteBg = ref(localStorage.getItem("whiteBg") === "1");

                        // 下载漫画
                        const download = async () => {
                            // 如果打包状态为0，则开始打包下载
                            if (downloadState.pack === 0) {
                                // 获取漫画名称
                                const packName = document.getElementById("thread_subject").innerText;
                                // 调用下载方法
                                await PubFun.fflate_zip(packName, urlList, downloadState);
                            }
                        };

                        // 监听图片大小变化
                        watch(imageSize, (newSize) => {
                            localStorage.setItem("size", newSize);
                        });
                        // 监听阅读方向变化
                        watch(rightToLeft, (newValue) => {
                            localStorage.setItem("rightToLeft", newValue ? "1" : "0");
                        });
                        // 监听单页显示状态变化
                        watch(onePage, (newValue) => {
                            localStorage.setItem("onePage", newValue ? "1" : "0");
                        });
                        // 监听白色背景状态变化
                        watch(whiteBg, (newValue) => {
                            localStorage.setItem("whiteBg", newValue ? "1" : "0");
                        });
                        // 监听下载状态变化
                        watch(downloadState, () => {
                            // 更新下载按钮文字
                            downloadInfo.value = `${downloadState.done}/${downloadState.allTasks}`;
                            if (downloadState.pack === 1) {
                                downloadInfo.value = "开始打包，请等待...";
                            }
                            if (downloadState.pack === 2) {
                                downloadInfo.value = "完成";
                            }
                        }, { deep: true });
                        // 全屏
                        watch(fullScreen, (new_val) => {
                            const elem = document.documentElement;
                            // 全屏模式的函数
                            function full_screen() {
                                if (elem.requestFullscreen) {
                                    elem.requestFullscreen();
                                } else if (elem.mozRequestFullScreen) { // 兼容 Firefox
                                    elem.mozRequestFullScreen();
                                } else if (elem.webkitRequestFullscreen) { // 兼容 Chrome, Safari 和 Opera
                                    elem.webkitRequestFullscreen();
                                } else if (elem.msRequestFullscreen) { // 兼容 IE/Edge
                                    elem.msRequestFullscreen();
                                }
                            }

                            // 退出全屏模式的函数
                            function exit_fullscreen() {
                                if (document.exitFullscreen) {
                                    document.exitFullscreen();
                                } else if (document.mozCancelFullScreen) { // 兼容 Firefox
                                    document.mozCancelFullScreen();
                                } else if (document.webkitExitFullscreen) { // 兼容 Chrome, Safari 和 Opera
                                    document.webkitExitFullscreen();
                                } else if (document.msExitFullscreen) { // 兼容 IE/Edge
                                    document.msExitFullscreen();
                                }
                            }

                            if (new_val) {
                                full_screen()
                            } else {
                                exit_fullscreen()
                            }
                        })


                        return {
                            model_state,
                            urlList,
                            urlsLoaded,
                            fullScreen,
                            showSettings,
                            downloadInfo,
                            downloadState,
                            imageSize,
                            rightToLeft,
                            onePage,
                            whiteBg,
                            download
                        };
                    }
                })
                .use(ElementPlus)
                .mount("#mt_manga")
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////
    // 根据当前页面挂载组件
    // 主题页面
    if (window.location.href.match("https://bbs.yamibo.com/thread") || window.location.href.match(/forum.php\?mod=viewthread/)) {
        // 依赖加载完成
        document.querySelector("#element").onload = () => {
            new MangaComponent()
        }
    }

    // 主题列表页面
    else if (window.location.href.match("https://bbs.yamibo.com/forum")) {
        new MangaListComponent()
    }
})();