// ==UserScript==
// @name               Kemono zip download
// @name:zh-CN         Kemono 下载为ZIP文件
// @namespace          https://greasyfork.org/users/667968-pyudng
// @version            0.27.9
// @description        Download kemono post in a zip file
// @description:zh-CN  下载Kemono的内容为ZIP压缩文档
// @author             PY-DNG
// @license            MIT
// @match              http*://*.kemono.su/*
// @match              http*://*.kemono.cr/*
// @match              http*://*.kemono.party/*
// @require            data:application/javascript,window.setImmediate%20%3D%20window.setImmediate%20%7C%7C%20((f%2C%20...args)%20%3D%3E%20window.setTimeout(()%20%3D%3E%20f(args)%2C%200))%3B
// @require            https://update.greasyfork.org/scripts/456034/1606773/Basic%20Functions%20%28For%20userscripts%29.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @resource           vue-js      https://unpkg.com/vue@3.5.13/dist/vue.global.prod.js
// @resource           quasar-icon https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons
// @resource           quasar-css  https://cdn.jsdelivr.net/npm/quasar@2.15.1/dist/quasar.prod.css
// @resource           quasar-js   https://cdn.jsdelivr.net/npm/quasar@2.15.1/dist/quasar.umd.prod.js
// @resource           vue-js-bak  https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.min.js
// @resource           quasar-icon-bak https://google-fonts.mirrors.sjtug.sjtu.edu.cn/css?family=Roboto:100,300,400,500,700,900|Material+Icons
// @resource           quasar-css-bak  https://unpkg.com/quasar@2.15.1/dist/quasar.prod.css
// @resource           quasar-js-bak   https://unpkg.com/quasar@2.15.1/dist/quasar.umd.prod.js
// @connect            kemono.su
// @connect            kemono.cr
// @connect            kemono.party
// @icon               https://kemono.su/favicon.ico
// @grant              GM_xmlhttpRequest
// @grant              GM_registerMenuCommand
// @grant              GM_addElement
// @grant              GM_getResourceText
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// @grant              GM_addValueChangeListener
// @grant              GM_setClipboard
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/526459/Kemono%20zip%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/526459/Kemono%20zip%20download.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

/* global LogLevel DoLog Err Assert $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager queueTask FunctionLoader loadFuncs require isLoaded */
/* global setImmediate JSZip Vue Quasar */

(function __MAIN__() {
    'use strict';

	const CONST = {
		TextAllLang: {
			DEFAULT: 'en-US',
			'zh-CN': {
                DownloadZip: '下载为ZIP文件',
                DownloadPost: '下载当前作品为ZIP文件',
                DownloadCreator: '下载当前创作者为ZIP文件',
                DownloadCustom: '自定义下载',
                Downloading: '正在下载...',
                FetchingCreatorPosts: '正在获取创作者作品列表...',
                SaveDirMissingTitle: '保存位置未设置',
                SaveDirMissing: '您目前开启了FileSystemAPI保存文件，请先在设置中选择文件保存位置',
                ExportDebugInfo: '导出调试信息',
                Settings: {
                    Title: '设置',
                    SaveContent: '保存文字内容到html文件',
                    SaveApijson: '保存api结果到json文件',
                    TextContent: '保存文字内容时，保存为纯文本txt格式',
                    FlattenFiles: '保存主文件和附件到同一级文件夹',
                    FlattenFilesCaption: '主文件一般是封面图',
                    NoMainfile: '不下载保存主文件',
                    NoMainfileCaption: '主文件一般是封面图',
                    UseFileSystemAPI: '使用FileSystemAPI保存文件',
                    UseFileSystemAPICaption: '使用此API理论上可以保存更大的文件，但可能每次页面刷新后都需要用户重新手动授权',
                    FileSystemAPINotSupported: '您的浏览器不支持此功能；最新版的Chrome或Edge浏览器支持此功能',
                    FileSystemAPINotSupportedTitle: '啊哦Σ(っ °Д °;)っ',
                    NoFolderSelected: '未选择',
                    SaveDir: 'FileSystemAPI下载位置',
                    SaveDirCaption: '使用FileSystemAPI时保存到此位置，需要用户主动选择授权',
                    CustomFilename: '自定义文件名',
                    CustomFilenameCaption: '应用于内容文件',
                    CustomFoldername: '自定义文件夹名',
                    CustomFoldernameCaption: '应用于多篇内容下载中每篇内容的文件夹',
                    CustomNameHelp: `
                        <span class="text-subtitle1" style="color: orange;">以下模板可在自定义文件名中使用，不区分大小写，使用时需保留大括号</span>
                        {PostID}: 帖子内容ID
                        {CreatorID}: 作者ID
                        {Service}: 平台（如"fanbox"/"fantia"等等）
                        {P}: 该文件在当前文件夹层级是第几个文件
                        {Name}: kemono服务器上的文件原名
                        {Base}: 文件原名的非扩展名部分（如"abc.jpg"中的"abc"）
                        {Ext}: 文件原名的扩展名部分（如"abc.jpg"中的"jpg"）
                        {Title}: 帖子内容标题
                        {Creator}: 创作者名
                        {Year}: 四位数年份
                        {Month}: 两位数月份
                        {Date}: 两位数日期
                        {Hour}: 两位数时间
                        {Minute}: 两位数分钟
                        {Second}: 两位数秒
                        {Timestamp}: 纯数字时间戳
                        {Timetext}: 文本时间戳
                        <span class="text-weight-bold">注: 所有时间相关模板均基于内容的发布时间</span>
                    `.replaceAll(/\n[\r\t ]+/g, '\n').trim(),
                },
                ProgressBoard: {
                    TotalProgress: '总进度',
                    TotalProgDesc: '共 {PostsCount} 篇内容需要下载',
                    PostProgDesc: '内有 {FilesCount} 个文件需要下载',
                    ZipProgDesc: '创建ZIP压缩包',
                    ProgressBoardTitle: '下载进度',
                    ClickHint: '单击下载文件，双击查看详情',
                },
                TaskDetail: {
                    Title: '任务详情',
                    TaskName: '任务名称：',
                    TaskDesc: '任务描述：',
                    TaskProgress: '任务进度：',
                    TaskProgDetail: '任务具体进度：',
                    CopyButton: '复制任务信息',
                    OkayButton: '朕知道了，下去吧',
                },
                CustomDownload: {
                    PopupTitle: '自定义下载',
                    TypeLabel: '下载...',
                    ServiceLabel: '发布平台',
                    CreatorLabel: '创作者ID',
                    PostLabel: '内容ID',
                    ExtFilterLabel: '只下载以下扩展名的文件',
                    ExtFilterTooltip: '留空以下载所有文件',
                    MoreOptions: '更多选项',
                    Type: {
                        Post: '单篇内容',
                        Creator: '创作者的多篇内容'
                    },
                    Cancel: '取消',
                    Download: '开始下载',
                },
                PostsSelector: {
                    Title: '选择内容',
                    OK: '确定',
                    Cancel: '取消',
                    SelectAll: '全选',
                },
            },
            'en-US': {
                DownloadZip: 'Download as ZIP file',
                DownloadPost: 'Download post as ZIP file',
                DownloadCreator: 'Download creator as ZIP file',
                DownloadCustom: 'Custom download',
                Downloading: 'Downloading...',
                FetchingCreatorPosts: 'Fetching creator posts list...',
                SelectAll: 'Select All',
                SaveDirMissingTitle: 'Download location missing',
                SaveDirMissing: 'You have enabled FileSystemAPI, please set FileSystemAPI download location before downloading',
                ExportDebugInfo: 'Export debug info',
                Settings: {
                    Title: 'Settings',
                    SaveContent: 'Save text content',
                    SaveApijson: 'Save api result',
                    TextContent: 'Save as pure text file when saving text content',
                    FlattenFiles: 'Save main file and attachments to same folder',
                    FlattenFilesCaption: '"Main file" is usually the cover image',
                    NoMainfile: 'Do not download main file',
                    NoMainfileCaption: '"Main file" is usually the cover image',
                    UseFileSystemAPI: 'Use File API for saving ZIP files',
                    UseFileSystemAPICaption: 'File API supports saving larger file than usual, but requires user granting permission each time',
                    FileSystemAPINotSupported: 'This feature is not supported in your browser, please use latest chrome or edge to use it',
                    FileSystemAPINotSupportedTitle: 'Ah-oh Σ(っ °Д °;)っ',
                    NoFolderSelected: 'Not provided',
                    SaveDir: 'FileSystemAPI download location',
                    SaveDirCaption: 'Used when FileSystemAPI is enabled',
                    CustomFilename: 'Custom file name',
                    CustomFilenameCaption: 'Applies to post files',
                    CustomFoldername: 'Custom folder name',
                    CustomFoldernameCaption: 'Applies to post folders in multiple posts download',
                    CustomNameHelp: `
                        <span class="text-subtitle1" style="color: orange;">The following templates can be used in custom filenames (case insensitive), keep the curly braces when using:</span>
                        {PostID}: Post content ID
                        {CreatorID}: Author ID
                        {Service}: Platform (e.g., "fanbox"/"fantia", etc.)
                        {P}: The file's index number in current folder level
                        {Name}: Original filename on kemono server
                        {Base}: Non-extension part of original filename (e.g., "abc" in "abc.jpg")
                        {Ext}: Extension part of original filename (e.g., "jpg" in "abc.jpg")
                        {Title}: Post title
                        {Year}: 4-digit year
                        {Month}: 2-digit month
                        {Date}: 2-digit date
                        {Hour}: 2-digit hour
                        {Minute}: 2-digit minute
                        {Second}: 2-digit second
                        {Timestamp}: number timestamp
                        {Timetext}: text timestamp
                        <span class="text-weight-bold">Note: all time-related templates are based on the post's publish time</span>
                    `.replaceAll(/\n[\r\t ]+/g, '\n').trim(),
                },
                ProgressBoard: {
                    TotalProgress: 'Total Progress',
                    TotalProgDesc: '{PostsCount} posts to download in total',
                    PostProgDesc: '{FilesCount} files to download inside',
                    ZipProgDesc: 'Compressing all files into a zip file',
                    ProgressBoardTitle: 'Download Progress',
                    ClickHint: 'single-click to download, double-click to view details',
                },
                TaskDetail: {
                    Title: 'Task Detail',
                    TaskName: 'Name: ',
                    TaskDesc: 'Description: ',
                    TaskProgress: 'Progress: ',
                    TaskProgDetail: 'Progress detail: ',
                    CopyButton: 'Copy task info',
                    OkayButton: 'Okay',
                },
                CustomDownload: {
                    PopupTitle: 'Custom download',
                    TypeLabel: 'Download ...',
                    ServiceLabel: 'Service Name',
                    CreatorLabel: 'Creator ID',
                    PostLabel: '内容',
                    ExtFilterLabel: 'Download files with these extensions only',
                    ExtFilterTooltip: 'Leave blank to download all files',
                    MoreOptions: 'More options',
                    Type: {
                        Post: 'single post',
                        Creator: 'creator posts'
                    },
                    Cancel: 'Cancel',
                    Download: 'Download',
                },
                PostsSelector: {
                    Title: 'Select posts',
                    OK: 'OK',
                    Cancel: 'Cancel',
                    SelectAll: 'Select All',
                },
            }
		},
        /** @type {typeof CONST.TextAllLang['zh-CN']} */
        get Text() {
            const i18n = Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
            return CONST.TextAllLang[i18n];
        },
        get Settings() {
            return Settings;
        }
	};

    /**
     * @typedef {Object} setting
     * @property {'string' | 'boolean' | 'number'} type - 设置项类型
     * @property {string} title - 设置项名称
     * @property {string | null} [caption] - 设置项副标题，可以省略；为假值时不渲染副标题元素
     * @property {string} key - 用作settings 读/写对象的prop名称，也用作v-model值
     * @property {string} [storage] - GM存储key；提供时直接在存储空间读写，不提供或为假值时，仅作内存读写（实例间不共享，页面刷新重置）
     * @property {*} default - 用户未设置过时的默认值（初始值）
     * @property {string} [help] - 显示的帮助文档，html格式，\n会自动替换成<br>
     * @property {boolean} [temp=false] - 是否在自定义下载中展示，以允许临时覆盖；不提供时默认为false
     */
    /** @satisfies {Record<string, Omit<setting, 'key'>>} */
    const SettingsObj = {
        save_content: {
            type: 'boolean',
            title: CONST.Text.Settings.SaveContent,
            caption: 'content.html',
            storage: 'save_content',
            default: true,
            temp: true,
        },
        save_apijson: {
            type: 'boolean',
            title: CONST.Text.Settings.SaveApijson,
            caption: 'data.json',
            storage: 'save_apijson',
            default: true,
            temp: true,
        },
        text_content: {
            type: 'boolean',
            title: CONST.Text.Settings.TextContent,
            caption: 'content.txt',
            storage: 'text_content',
            default: false,
            temp: true,
        },
        flatten_files: {
            type: 'boolean',
            title: CONST.Text.Settings.FlattenFiles,
            caption: CONST.Text.Settings.FlattenFilesCaption,
            storage: 'flatten_files',
            default: false,
            temp: true,
        },
        no_mainfile: {
            type: 'boolean',
            title: CONST.Text.Settings.NoMainfile,
            caption: CONST.Text.Settings.NoMainfileCaption,
            storage: 'no_mainfile',
            default: false,
            temp: true,
        },
        fileapi: {
            type: 'boolean',
            title: CONST.Text.Settings.UseFileSystemAPI,
            caption: CONST.Text.Settings.UseFileSystemAPICaption,
            storage: 'fileapi',
            default: false,
            temp: true,
        },
        savedir: {
            type: 'folder',
            title: CONST.Text.Settings.SaveDir,
            caption: CONST.Text.Settings.SaveDirCaption,
            storage: false,
            default: null,
            temp: true,
        },
        filename: {
            type: 'string',
            title: CONST.Text.Settings.CustomFilename,
            caption: CONST.Text.Settings.CustomFilenameCaption,
            storage: 'filename',
            default: '{P}-{Name}',
            help: CONST.Text.Settings.CustomNameHelp.replaceAll('\n', '<br>'),
            temp: true,
        },
        foldername: {
            type: 'string',
            title: CONST.Text.Settings.CustomFoldername,
            caption: CONST.Text.Settings.CustomFoldernameCaption,
            storage: 'foldername',
            default: '{PostID}-{Title}',
            help: CONST.Text.Settings.CustomNameHelp.replaceAll('\n', '<br>'),
            temp: true,
        },
    };
    /** @type {setting[]} */
    const Settings = Object.entries(SettingsObj).reduce((arr, [key, setting]) => {
        setting.key = key;
        arr.push(setting);
        return arr;
    }, []);


    /**
     * 用于更新脚本存储版本的更新器，版本号命名虽然兼容任意版本号格式，但要求与脚本版本号同步
     * 比如：脚本在0.25版本更新了存储，就应将更新到此脚本时运行的存储更新器版本号命名为'0.25'
     * 从而保证存储的版本号和脚本的版本号基本一致，查阅用户存储版本号即可知道对应大致脚本版本范围
     * @typedef {Object} config_updater
     * @property {string} version
     * @property {function} update
     */
    /** @type {config_updater[]} */
    const ConfigUpdaters = [{
        version: '0.21',
        update() {
            const settings = GM_getValue('settings', null);
            if (settings === null) { return; }
            let filename = '';
            if (settings.no_prefix) {
                filename = '{Name}';
            } else {
                filename = '{P}-{Name}';
            }
            delete settings.no_prefix;
            delete settings.number_prefix;
            settings.filename = filename;
            GM_setValue('settings', settings);
        }
    }, {
        version: '0.22',
        update() {
            const settings = GM_getValue('settings', null);
            if (settings === null) { return; }
            let foldername = settings.foldername;
            if (typeof foldername !== 'string') { return; }

            // replace all {Name} with {Title}, which is the recommended template for folder name
            let position = 0;
            const pattern = '{name}';
            while (true) {
                const index = foldername.toLowerCase().indexOf(pattern, position);
                if (index > -1) {
                    foldername = foldername.slice(0, index) + '{Title}' + foldername.slice(index + pattern.length);
                    position = index + pattern.length;
                } else {
                    break;
                }
            }
            settings.foldername = foldername;
            GM_setValue('settings', settings);
        }
    }];

    const functions = {
        utils: {
            /** @typedef {Awaited<ReturnType<typeof functions.utils.func>>} utils */
            async func() {
                const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

                function fillNumber(number, length) {
                    const str = number.toString();
                    return '0'.repeat(length - str.length) + str;
                }

                /**
                 * Convert post content from api to kemono webpage's displaying html
                 * @see https://kemono.su/src/entities/posts/overview/clean-body.ts (in devtools source-mapped files)
                 * @param {string} rawHtml - api-returned post content
                 * @param {string} service - api-returned post service
                 * @returns {string}
                 */
                function content2html(rawHtml, service) {
                    // Create element with html
                    const postContent = $$CrE({
                        tagName: 'pre',
                        props: {
                            innerHTML: rawHtml
                        }
                    });

                    // Cleanup code, gratefully modified from kemono webpage :)
                    if (postContent.childElementCount || postContent.childNodes.length) {
                        if (service === 'fanbox') {
                            // its contents is a text node
                            if (!postContent.childElementCount && postContent.childNodes.length === 1) {
                                // wrap the text node into `<pre>`
                                const textNode = postContent.childNodes[0];
                                const pre = $CrE('pre');
                                textNode.after(pre);
                                pre.appendChild(textNode);
                            }

                            // remove paragraphs with only `<br>` in them
                            const paragraphs = postContent.querySelectorAll("p");
                            paragraphs.forEach((para) => {
                                if (
                                    para.childElementCount === 1 &&
                                    para.firstElementChild?.tagName === "BR"
                                ) {
                                    para.remove();
                                }
                            });
                        }

                        // Remove needless spaces and empty paragraphs.
                        /**
                         * @type {NodeListOf<HTMLParagraphElement}
                         */
                        const paragraphs = postContent.querySelectorAll("p:empty");
                        Array.from(paragraphs).forEach((paragraph) => {
                            if (
                                paragraph.nextElementSibling &&
                                paragraph.nextElementSibling.tagName === "BR"
                            ) {
                                paragraph.nextElementSibling.remove();
                                paragraph.remove();
                            } else {
                                paragraph.remove();
                            }
                        });
                    }

                    return postContent.innerHTML;
                }

                /**
                 * Convert post content from api to pure text
                 * This may be unsafe; Do not use it with untrusted html
                 * @param {string} rawHtml - api-returned post content
                 * @param {string} service - api-returned post service
                 * @returns {string}
                 */
                function content2text(rawHtml, service) {
                    // Convert into kemono webpage's displaying html
                    const html = content2html(rawHtml, service);

                    // Create element with html
                    const elm = $$CrE({
                        tagName: 'pre',
                        props: {
                            innerHTML: html
                        }
                    });
                    // remove all <script> and 'on-xxx' attributes
                    for (const el of $All(elm, '*')) {
                        el.tagName === 'SCRIPT' && el.remove();
                        for (const attr of el.attributes) {
                            attr.name.startsWith('on') && el.removeAttribute(attr.name);
                        }
                    }

                    // Element's innerText is not rendered until it has been appended into DOM
                    document.body.append(elm);
                    const text = elm.innerText;
                    elm.remove();
                    return text;
                }

                /**
                 * Determine whether version 1 is newer than version 2
                 * Standard:
                 * - split two version strings into two arrays by '.'
                 * - compare v1[i] > v2[i], for i from 0 to min(v1.length, v2.length)，return true if v1[i] > v2[i]
                 * - for comparing, each part:
                 *   - bigger number means bigger
                 *   - numbers bigger than letters
                 *   - Greek alphabet words is bigger than other letters
                 *   - other letters compares directly by javascript ">" operator
                 *   - ignore cases (including comparing by ">")
                 * - if v1[i], v2[i] equals, return v1.length > v2.length
                 * - if v1.length === v2.length, return {@link equal}
                 * @param {string} v1
                 * @param {string} v2
                 * @param {boolean} [equal=false] - return true or false when v1 equals to v2
                 * @returns {boolean}
                 */
                function versionNewer(v1, v2, equal=false) {
                    const GreekAlphabet = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'];
                    v1 = v1.split('.');
                    v2 = v2.split('.');
                    for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
                        const part_compare = isNewer(v1[i], v2[i]);
                        if (part_compare > 0) { return true; }
                        if (part_compare < 0) { return false; }
                    }
                    if (v1.length > v2.length) { return true; }
                    if (v1.length < v2.length) { return false; }
                    return equal;

                    /**
                     * Determine whether version part 1 is newer than version part 2
                     * @param {*} vpart1
                     * @param {*} vpart2
                     * @returns {number} - newer for positive values and older for negatives, zero means equal
                     */
                    function isNewer(vpart1, vpart2) {
                        [vpart1, vpart2] = [vpart1, vpart2].map(t => t.toLowerCase());
                        const is_decimal = [vpart1, vpart2].map(isDecimal);
                        const is_greek = [vpart1, vpart2].map(isGreek);
                        if (is_decimal[0]) {
                            if (is_decimal[1]) {
                                const num1 = parseInt(vpart1, 10);
                                const num2 = parseInt(vpart2, 10);
                                return num1 - num2;
                            }
                            return true;
                        }
                        if (is_greek[0]) {
                            if (is_decimal[1]) { return false; }
                            if (is_greek[1]) {
                                const index1 = GreekAlphabet.indexOf(vpart1);
                                const index2 = GreekAlphabet.indexOf(vpart2);
                                return index1 - index2;
                            }
                            return false;
                        }
                        if (is_greek[1] || is_decimal[1]) { return false; }
                        if (vpart1 === vpart2) { return 0; }
                        return vpart1 > vpart2 ? 1 : -1;
                    }

                    function isDecimal(t) {
                        return /^\-?\d+$/.test(t);
                    }

                    function isGreek(t) {
                        return GreekAlphabet.includes(t.toLowerCase());
                    }
                }

                /**
                 * Export all GM storage into one Object
                 * @returns {Object}
                 */
                function getStorageObj() {
                    return GM_listValues().reduce((obj, key) => {
                        obj[key] = GM_getValue(key);
                        return obj;
                    }, {});
                }

                /**
                 * replace current GM storage with given storage Object generated by getStorageObj
                 * @param {Object} data - storage Object generated by getStorageObj
                 */
                function applyStorageObj(data) {
                    GM_listValues().forEach(key => GM_deleteValue(key));
                    Object.entries(data).forEach(([key, val]) => GM_setValue(key, val));
                }

                /**
                 * Async task progress manager \
                 * when awaiting async tasks, replace `await task` with `await manager.progress(task)` \
                 * suppoerts sub-tasks, just `manager.sub(sub_steps, sub_callback)`
                 */
                class ProgressManager extends EventTarget {
                    /** @type {*} */
                    info;
                    /** @type {number} */
                    steps;
                    /** @type {number} */
                    finished;
                    /** @type {'none' | 'sub' | 'self'} */
                    error;
                    /** @type {ProgressManager[]} */
                    #children;
                    /** @type {ProgressManager} */
                    #parent;

                    /**
                     * This callback is called each time a promise resolves
                     * @callback progressCallback
                     * @param {number} resolved_count
                     * @param {number} total_count
                     * @param {ProgressManager} manager
                     */

                    /**
                     * @param {number} [steps=0] - total steps count of the task
                     * @param {progressCallback} [callback] - callback each time progress updates
                     * @param {*} [info] - attach any data about this manager if need
                     */
                    constructor(steps=0, info=undefined) {
                        super();

                        this.steps = steps;
                        this.info = info;
                        this.finished = 0;
                        this.error = 'none';

                        this.#children = [];
                        this.#broadcast('progress');
                    }

                    add() { this.steps++; }

                    /**
                     * @template {Promise | null} task
                     * @param {task} [promise] - task to await, null is acceptable if no task to await
                     * @param {number} [finished] - set this.finished to this value, adds 1 to this.finished if omitted
                     * @param {boolean} [accept_reject=true] - whether to treat rejected promise as resolved; if true, callback will get error object in arguments; if not, progress function itself rejects
                     * @returns {Promise<Awaited<task>>}
                     */
                    async progress(promise, finished, accept_reject = true) {
                        let val;
                        try {
                            val = await Promise.resolve(promise);
                        } catch(err) {
                            this.newError('self', false);
                            if (!accept_reject) {
                                throw err;
                            }
                        }
                        try {
                            this.finished = (typeof finished === 'number' && finished >= 0) ? finished : this.finished + 1;
                            this.#broadcast('progress');
                            //this.finished === this.steps && this.#parent && this.#parent.progress();
                        } finally {
                            return val;
                        }
                    }

                    /**
                     * New error occured in manager's scope, update error status
                     * @param {'none' | 'sub' | 'self'} [error='self']
                     * @param {boolean} [callCallback=true]
                     */
                    newError(error = 'self', callCallback = true) {
                        const error_level = ['none', 'sub', 'self'];
                        if (error_level.indexOf(error) <= error_level.indexOf(this.error)) { return; }

                        this.error = error;
                        this.#parent && this.#parent.newError('sub');
                        callCallback && this.#broadcast('error');
                    }

                    /**
                     * Creates a new ProgressManager as a sub-progress of this
                     * @param {number} [steps=0] - total steps count of the task
                     * @param {*} [info] - attach any data about the sub-manager if need
                     */
                    sub(steps, info) {
                        const manager = new ProgressManager(steps ?? 0, info);
                        manager.#parent = this;
                        this.#children.push(manager);
                        this.#broadcast('sub');
                        return manager;
                    }

                    /**
                     * reset this to an empty manager
                     */
                    reset() {
                        this.steps = 0;
                        this.finished = 0;
                        this.#parent = null;
                        this.#children = [];
                        this.#broadcast('reset');
                    }

                    #broadcast(evt_name) {
                        //this.callback(this.finished, this.steps, this);
                        this.dispatchEvent(new CustomEvent(evt_name, {
                            detail: {
                                type: evt_name,
                                manager: this
                            }
                        }));
                    }

                    get children() {
                        return [...this.#children];
                    }

                    get parent() {
                        return this.#parent;
                    }
                }

                const PerformanceManager = (function() {
                    class RunRecord {
                        static #id = 0;

                        /** @typedef {'initialized' | 'running' | 'finished'} run_status */
                        /** @type {number} */
                        id;
                        /** @type {number} */
                        start;
                        /** @type {number} */
                        end;
                        /** @type {number} */
                        duration;
                        /** @type {run_status} */
                        status;
                        /**
                         * Anything for programmers to mark and read, uses as a description for this run
                         * @type {*}
                         */
                        info;

                        /**
                         * @param {*} [info] - Anything for programmers to mark and read, uses as a description for this run
                         */
                        constructor(info) {
                            this.id = RunRecord.#id++;
                            this.status = 'initialized';
                            this.info = info;
                        }

                        run() {
                            const time = performance.now();
                            this.start = time;
                            this.status = 'running';
                            return this;
                        }

                        stop() {
                            const time = performance.now();
                            this.end = time;
                            this.duration = this.end - this.start;
                            this.status = 'finished';
                            return this;
                        }
                    }
                    class Task {
                        /** @typedef {number | string | symbol} task_id */
                        /** @type {task_id} */
                        id;
                        /** @type {RunRecord[]} */
                        runs;

                        /**
                         * @param {task_id} id
                         */
                        constructor(id) {
                            this.id = id;
                            this.runs = [];
                        }

                        run(info) {
                            const record = new RunRecord(info);
                            record.run();
                            this.runs.push(record);
                            return record;
                        }

                        get time() {
                            return this.runs.reduce((time, record) => {
                                if (record.status === 'finished') {
                                    time += record.duration;
                                }
                                return time;
                            }, 0)
                        }
                    }
                    class PerformanceManager {
                        /** @type {Task[]} */
                        tasks;

                        constructor() {
                            this.tasks = [];
                        }

                        /**
                         * @param {task_id} id
                         * @returns {Task | null}
                         */
                        getTask(id) {
                            return this.tasks.find(task => task.id === id);
                        }

                        /**
                         * Creates a new task
                         * @param {task_id} id
                         * @returns {Task}
                         */
                        newTask(id) {
                            Assert(!this.getTask(id), `given task id ${escJsStr(id)} is already in use`, TypeError);

                            const task = new Task(id);
                            this.tasks.push(task);
                            return task;
                        }

                        /**
                         * Runs a task
                         * @param {task_id} id
                         * @param {*} run_info - Anything for programmers to mark and read, uses as a description for this run
                         * @returns {RunRecord}
                         */
                        run(task_id, run_info) {
                            const task = this.getTask(task_id);
                            Assert(task, `task of id ${escJsStr(task_id)} not found`, TypeError);

                            return task.run(run_info);
                        }

                        totalTime(id) {
                            if (id) {
                                return this.getTask(id).time;
                            } else {
                                return this.tasks.reduce((timetable, task) => {
                                    timetable[task.id] = task.time;
                                    return timetable;
                                }, {});
                            }
                        }

                        meanTime(id) {
                            if (id) {
                                const task = this.getTask(id);
                                return task.time / task.runs.length;
                            } else {
                                return this.tasks.reduce((timetable, task) => {
                                    timetable[task.id] = task.time / task.runs.length;
                                    return timetable;
                                }, {});
                            }
                        }
                    }

                    return PerformanceManager;
                }) ();

                return {
                    window: win,
                    fillNumber, content2html, content2text, versionNewer, getStorageObj, applyStorageObj,
                    ProgressManager, PerformanceManager
                }
            },
        },
        debugging: {
            desc: 'script error handler and debugging tool',
            params: ['GM_setValue', 'GM_getValue'],
            /** @typedef {Awaited<ReturnType<typeof functions.debugging.func>>} debugging */
            async func(GM_setValue, GM_getValue) {
                // Automatically record default funcpool load errors
                const dealLoadError = (error, oFunc) => {
                    saveError({
                        type: 'oFunc',
                        error,
                        info: { id: oFunc.id },
                        key: `oFunc-${oFunc.id}`
                    });
                    DoLog(LogLevel.Error, error, 'error');
                };
                pool.addEventListener('error', e => {
                    const { error, oFunc } = e.detail;
                    dealLoadError(error, oFunc);
                });
                pool.errors.forEach(({error, oFunc}) => dealLoadError(error, oFunc));

                // Menu command to export error log
                // Delay 1s to put menu item into last place in menus list
                setTimeout(() => GM_registerMenuCommand(CONST.Text.ExportDebugInfo, exportDebugInfo), 1000);

                /**
                 * @typedef {Object} ErrorDetail
                 * @property {string} [key] - use key to avoid saving same error multiple times
                 * @property {string} type
                 * @property {Error} error
                 * @property {*} info
                 */
                /**
                 * @typedef {Object} ErrorObject
                 * @property {string} [key]
                 * @property {string} type
                 * @property {*} info
                 * @property {string} message
                 * @property {string | undefined} stack
                 * @property {string} url
                 * @property {boolean} iframe
                 * @property {number} timestamp
                 */
                /**
                 * wrap error details into error object
                 * @param {ErrorDetail} detail
                 * @returns {ErrorObject}
                 */
                function wrapErrorData({type, error, info, key}) {
                    const data = {
                        type, info,
                        message: error.message,
                        stack: error.stack,
                        url: location.href,
                        iframe: window.top !== window,
                        timestamp: Date.now()
                    };
                    key && (data.key = key);
                    return data;
                }

                /**
                 * Save an error into storage
                 * @param {ErrorDetail} detail
                 * @returns {ErrorObject}
                 */
                function saveError({type, error, info, key}) {
                    const data = wrapErrorData({type, error, info, key});
                    const errors = GM_getValue('errors', []);
                    if (key && errors.some(error => error.key === key)) { return; }
                    errors.push(data);
                    const max_save = GM_getValue('max_save', 10);
                    while (errors.length > max_save) { errors.shift(); }
                    GM_setValue('errors', errors);
                    return data;
                }

                /**
                 * Export an error to user as a json file
                 * returns error object
                 * @param {ErrorDetail} detail
                 * @returns {ErrorObject}
                 */
                function exportError({type, error, info, key}) {
                    const data = wrapErrorData({type, error, info, key});
                    download_object(data, `${GM_info.script.name} Error.json`);
                    return data;
                }

                /**
                 * Export all saved errors to user as a json file
                 */
                function exportAllErrors() {
                    const errors = GM_getValue('errors', []);
                    download_object(errors, `${GM_info.script.name} All Errors.json`);
                }

                function exportDebugInfo() {
                    const errors = GM_getValue('errors', []);
                    const debug_info = {
                        errors,
                        ua: navigator.userAgent,
                        version: GM_info.script.version,
                        manager: GM_info.scriptHandler,
                        manager_version: GM_info.version,
                        timestamp: Date.now(),
                    };
                    download_object(debug_info, `${GM_info.script.name} Debug Info.json`);
                }

                /**
                 * download any jsonable data as file
                 * @param {*} data - any jsonable data
                 * @param {string} filename
                 * @param {string} mimetype
                 */
                function download_object(data, filename, mimetype='application/json') {
                    const json = JSON.stringify(data);
                    const url = URL.createObjectURL(new Blob([json], { type: mimetype }));
                    dl_browser(url, filename);
                    setTimeout(() => URL.revokeObjectURL(url));
                }

                return {
                    wrapErrorData, saveError, exportError, exportAllErrors, exportDebugInfo,
                    get errors() { return GM_getValue('errors', []); },
                    get max_save() { return GM_getValue('max_save', 10); },
                    /** @param {number} val */
                    set max_save(val) { GM_setValue('max_save', val); },
                };
            }
        },
        dependencies: {
            desc: 'load dependencies like vue into the page',
            detectDom: ['head', 'body'],
            async func() {
                const StandbySuffix = '-bak';
                const deps = [{
                    name: 'vue-js',
                    type: 'script',
                }, {
                    name: 'quasar-icon',
                    type: 'style'
                }, {
                    name: 'quasar-css',
                    type: 'style'
                }, {
                    name: 'quasar-js',
                    type: 'script'
                }];

                await Promise.all(deps.map(dep => {
                    return new Promise((resolve, reject) => {
                        const resource_text = GM_getResourceText(dep.name) || GM_getResourceText(dep.name + StandbySuffix);
                        switch (dep.type) {
                            case 'script': {
                                // Once load, dispatch load event on messager
                                const evt_name = `load:${dep.name};${Date.now()}`;
                                const rand = Math.random().toString();
                                const messager = new EventTarget();
                                const load_code = [
                                    '\n;',
                                    `window[${escJsStr(rand)}].dispatchEvent(new Event(${escJsStr(evt_name)}));`,
                                    `delete window[${escJsStr(rand)}];\n`
                                ].join('\n');
                                unsafeWindow[rand] = messager;
                                $AEL(messager, evt_name, resolve);
                                GM_addElement(document.head, 'script', {
                                    textContent: resource_text + load_code,
                                });
                                break;
                            }
                            case 'style': {
                                GM_addElement(document.head, 'style', {
                                    textContent: resource_text,
                                });
                                resolve();
                                break;
                            }
                        }
                    });
                }));

                Quasar.setCssVar('primary', 'orange');
                setTimeout(() => Quasar.Dark.set(true));

                // some fixes
                addStyle(`
                    #main h1 {
                        font-size: 2em;
                        line-height: 1.5;
                        letter-spacing: unset;
                    }
                    #main h2 {
                        font-size: 1.6rem;
                        line-height: 1.35;
                        letter-spacing: unset;
                    }
                    #main h3 {
                        font-weight: 400;
                        font-size: 1.5rem;
                        line-height: 1.5;
                        letter-spacing: inherit;
                    }
                    body.q-body--force-scrollbar-y {
                    overflow-y: unset !important;
                    }
                `)
            }
        },
        config: {
            desc: 'config manager',
            dependencies: ['utils', 'debugging'],
            params: ['GM_setValue', 'GM_getValue'],
            /** @typedef {Awaited<ReturnType<typeof functions.config.func>>} config */
            /**
             * @param {typeof GM_setValue} GM_local_setValue
             * @param {typeof GM_getValue} GM_local_getValue
             */
            func(GM_local_setValue, GM_local_getValue) {
                /** @type {utils} */
                const utils = require('utils');
                /** @type {debugging} */
                const debugging = require('debugging');

                let current_version = GM_getValue('config-version', '0');
                for (const updater of ConfigUpdaters) {
                    if (utils.versionNewer(updater.version, current_version)) {
                        const backup_storage = utils.getStorageObj();
                        try {
                            updater.update();
                            current_version = updater.version;
                        } catch (err) {
                            // config updater error
                            DoLog(LogLevel.Error, err, 'error');

                            // 1. save storage content after unsuccessful update
                            const error_storage = utils.getStorageObj();

                            // 2. recover to backup storage
                            utils.applyStorageObj(backup_storage);

                            // 3. report error to debugging
                            const error_obj = debugging.saveError({
                                type: 'updater',
                                key: `updater-${updater.version}`,
                                error: err,
                                info: {
                                    updater_version: updater.version,
                                    backup_storage, error_storage,
                                }
                            });

                            // 4. record error state
                            // has_error flag: tells other oFuncs there's error in storage
                            GM_local_setValue('has_error', true);
                        }
                    }
                }
                GM_setValue('config-version', current_version);

                return {
                    version() {
                        return GM_getValue('config-version');
                    },
                    has_version() {
                        const cur_version = GM_getValue('config-version');
                        const latest_version = ConfigUpdaters[ConfigUpdaters.length-1].version;
                        return utils.versionNewer(cur_version, latest_version, true);
                    },
                    has_error() {
                        return GM_local_getValue('has_error', false);
                    },
                }
            }
        },
        api: {
            desc: 'api for kemono',
            /** @typedef {Awaited<ReturnType<typeof functions.api.func>>} api */
            async func() {
                let api_key = null;

                const Posts = {
                    /**
                     * Get a list of creator posts
                     * @param {string} service - The service where the post is located
                     * @param {number | string} creator_id - The ID of the creator
                     * @param {string} [q] - Search query
                     * @param {number} [o] - Result offset, stepping of 50 is enforced
                     */
                    posts(service, creator_id, q, o) {
                        const search = {};
                        q && (search.q = q);
                        o && (search.o = o);
                        return callApi({
                            endpoint: `/${service}/user/${creator_id}/posts`,
                            search
                        });
                    },

                    /**
                     * Get a specific post
                     * @param {string} service
                     * @param {number | string} creator_id
                     * @param {number | string} post_id
                     * @returns {Promise<Object>}
                     */
                    post(service, creator_id, post_id) {
                        return callApi({
                            endpoint: `/${service}/user/${creator_id}/post/${post_id}`
                        });
                    }
                };
                const Creators = {
                    /**
                     * Get a creator
                     * @param {string} service - The service where the creator is located
                     * @param {number | string} creator_id - The ID of the creator
                     * @returns
                     */
                    profile(service, creator_id) {
                        return callApi({
                            endpoint: `/${service}/user/${creator_id}/profile`
                        });
                    }
                };
                const Custom = {
                    /**
                     * Get a list of creator's ALL posts, calling Post.posts for multiple times and joins the results
                     * @param {string} service - The service where the post is located
                     * @param {number | string} creator_id - The ID of the creator
                     * @param {string} [q] - Search query
                     */
                    async all_posts(service, creator_id, q) {
                        const posts = [];
                        let offset = 0;
                        let api_result = null;
                        while (!api_result || api_result.length === 50) {
                            api_result = await Posts.posts(service, creator_id, q, offset);
                            posts.push(...api_result);
                            offset += 50;
                        }
                        return posts;
                    }
                };
                const API = {
                    get key() { return api_key; },
                    set key(val) { api_key = val; },
                    Posts, Creators,
                    Custom,
                    callApi
                };
                return API;

                /**
                 * callApi detail object
                 * @typedef {Object} api_detail
                 * @property {string} endpoint - api endpoint
                 * @property {Object} [search] - search params
                 * @property {string} [method='GET']
                 * @property {boolean | string} [auth=false] - whether to use api-key in this request; true for send, false for not, and string for sending a specific key (instead of pre-configured `api_key`); defaults to false
                 */

                /**
                 * Do basic kemono api request
                 * This is the queued version of _callApi
                 * @param {api_detail} detail
                 * @returns
                 */
                function callApi(...args) {
                    return queueTask(() => _callApi(...args), 'callApi');
                }

                /**
                 * Do basic kemono api request
                 * @param {api_detail} detail
                 * @returns
                 */
                function _callApi(detail) {
                    const search_string = new URLSearchParams(detail.search).toString();
                    const url = `https://${location.host}/api/v1/${detail.endpoint.replace(/^\//, '')}` + (search_string ? '?' + search_string : '');
                    const method = detail.method ?? 'GET';
                    const auth = detail.auth ?? false;

                    return new Promise((resolve, reject) => {
                        auth && api_key === null && reject('api key not found');

                        const options = {
                            method, url,
                            headers: {
                                accept: 'text/css' // YES, instead of 'application/json', 'text/css' is required by kemono lol
                            },
                            onload(e) {
                                try {
                                    e.status === 200 ? resolve(JSON.parse(e.responseText)) : reject(e.responseText);
                                } catch(err) {
                                    reject(err);
                                }
                            },
                            onerror: err => reject(err)
                        }
                        if (typeof auth === 'string') {
                            options.headers.Cookie = auth;
                        } else if (auth === true) {
                            options.headers.Cookie = api_key;
                        }
                        GM_xmlhttpRequest(options);
                    });
                }
            }
        },
        gui: {
            desc: 'reusable GUI components',
            dependencies: ['dependencies', 'settings', 'utils'],
            /** @typedef {Awaited<ReturnType<typeof functions.gui.func>>} gui */
            async func() {
                /** @type {settings} */
                const settings = require('settings');
                /** @type {utils} */
                const utils = require('utils');

                class clickHandler extends EventTarget {
                    /** @type {ReturnType<setTimeout>} */
                    clickTimeout;
                    /** @type {number} */
                    max_delay;
                    /** @type {function} */
                    onClick;
                    /** @type {function} */
                    onDblclick;

                    constructor() {
                        super();
                        this.max_delay = 250;
                    }

                    click() {
                        const that = this;
                        clearTimeout(this.clickTimeout);
                        this.clickTimeout = setTimeout(
                            () => {
                                const event = new Event('click');
                                typeof that.onClick === 'function' && that.onClick(event);
                                event.defaultPrevented || that.dispatchEvent(event);
                            },
                            this.max_delay
                        );
                    }

                    dblclick() {
                        clearTimeout(this.clickTimeout);
                        const event = new Event('dblclick');
                        typeof this.onDblclick === 'function' && this.onDblclick(event);
                        event.defaultPrevented || this.dispatchEvent(event);
                    }
                }

                class ProgressBoard {
                    app;
                    instance;

                    constructor() {
                        const that = this;

                        // GUI
                        const container = $$CrE({ tagName: 'div', styles: { position: 'fixed', zIndex: '-1' } });
                        const board = $$CrE({
                            tagName: 'div',
                            classes: 'board'
                        });
                        board.innerHTML = `
                            <q-layout view="hhh lpr fff">
                                <q-dialog v-model="showing" :class="{ mobile: $q.platform.is.mobile }" :position="$q.platform.is.mobile ? 'standard' : 'bottom'" seamless :full-width="$q.platform.is.mobile" :full-height="$q.platform.is.mobile">
                                    <q-card class="container-card">
                                        <q-card-section class="header row">
                                            <div class="text-h6">${ CONST.Text.ProgressBoard.ProgressBoardTitle }</div>
                                            <q-space></q-space>
                                            <q-btn :icon="minimized ? 'expand_less' : 'expand_more'" flat round dense @click="minimized = !minimized"></q-btn>
                                            <q-btn icon="close" flat round dense v-close-popup></q-btn>
                                        </q-card-section>
                                        <q-slide-transition>
                                            <q-card-section class="body" v-show="!minimized">
                                                <q-list class="list" :class="{ minimized: minimized }">
                                                    <q-progress-item :manager="manager" v-if="manager"></q-progress-item>
                                                </q-list>
                                            </q-card-section>
                                        </q-slide-transition>
                                    </q-card>
                                </q-dialog>
                            </q-layout>
                        `;
                        container.append(board);
                        detectDom('html').then(html => html.append(container));
                        detectDom('head').then(head => addStyle(`
                            :is(.container-card):not(.mobile *) {
                                max-width: 45vw;
                            }
                            .container-card :is(.header, .body):not(.mobile *) {
                                width: 40vw;
                            }
                            .container-card :is(.body .list):not(.mobile *) {
                                height: 40vh;
                                overflow-y: auto;
                            }
                            .container-card :is(.body .list.minimized):not(.mobile *) {
                                overflow-y: hidden;
                            }
                        `, 'progress-board-style'));

                        this.app = Vue.createApp({
                            data() {
                                return {
                                    board: that,
                                    showing: false,
                                    minimized: false,
                                    manager: null
                                }
                            },
                            methods: {
                                show(manager) {
                                    this.manager = manager;
                                    this.showing = true;
                                    this.minimized = false;
                                }
                            },
                            mounted() {
                                that.instance = this;
                            }
                        });
                        this.app.use(Quasar);

                        // 嵌套进度组件
                        /**
                         * 嵌套进度组件设计：
                         * - 该组件和ProgressManager紧密耦合，所有参数信息均包含在ProgressManager实例中
                         * - 该组件仅需传入一个根ProgressManager实例，所有嵌套子组件均根据根实例分支而来
                         * - 传入的ProgressManager必须有着以下标准的info属性：
                         *   - @property {'root' | 'blob' | 'api' | 'zip' | 'folder'} manager.info.type 用于展示对应图标
                         *   - @property {string} manager.info.name 显示的主要文字，一个短语描述其任务
                         *   - @property {string} [manager.info.desc] 显示的次要文字，一句话描述任务信息
                         */
                        this.app.component('q-progress-item', {
                            name: 'QProgressItem',
                            props: [ 'manager' ],
                            template: `
                                <q-item class="column" style="user-select: none;">
                                    <q-linear-progress
                                        :value="progress"
                                        :color="color"
                                        :indeterminate="indeterminate"
                                    ></q-linear-progress>

                                    <q-expansion-item
                                        expand-separator
                                        v-if="sub_managers.length"
                                        :icon="icon"
                                        :label="manager.info.name"
                                        :caption="manager.info.desc"
                                    >
                                        <q-progress-item
                                            v-for="sub_manager of sub_managers"
                                            :manager="sub_manager"
                                        ></q-progress-item>
                                    </q-expansion-item>

                                    <q-item v-else clickable
                                        title="${ CONST.Text.ProgressBoard.ClickHint }"
                                        @click="handleClick('click', downloadAsset, showDetail)"
                                        @dblclick="handleClick('dblclick', downloadAsset, showDetail)"
                                    >
                                        <q-item-section avatar>
                                            <q-icon :name="icon"></q-icon>
                                        </q-item-section>

                                        <q-item-section>
                                            <q-item-label>{{ manager.info.name }}</q-item-label>
                                            <q-item-label caption>{{ manager.info.desc }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-item>
                            `,
                            data() {
                                return {
                                    click_handler: new clickHandler(),
                                    finished: this.manager.finished,
                                    total: this.manager.steps,
                                    error: this.manager.error,
                                    sub_managers: this.manager.children
                                }
                            },
                            computed: {
                                progress() {
                                    return this.total !== 0 ? this.finished / this.total : 1;
                                },
                                indeterminate() {
                                    return this.total === 0 && this.error !== 'self';
                                },
                                icon() {
                                    return ({
                                        root: 'folder_zip',
                                        blob: 'description',
                                        api: 'api',
                                        zip: 'compress',
                                        folder: 'folder'
                                    })[this.manager.info.type] ?? 'draft'; /** @TODO 需要由调用方将标准化的参数填入ProgressManager的info字段 */
                                },
                                color() {
                                    return ({
                                        none: this.finished === this.total && this.total > 0 ? 'green' : 'blue',
                                        sub: this.finished === this.total ? 'orange' : 'blue',
                                        self: 'red'
                                    })[this.error];
                                },
                                TaskTextInfo() {
                                    const TaskDetail = CONST.Text.TaskDetail;
                                    const info = this.manager.info;
                                    return [
                                        TaskDetail.TaskName + info.name,
                                        TaskDetail.TaskDesc + info.desc,
                                        TaskDetail.TaskProgress + `${ this.progress * 100 }%`,
                                        TaskDetail.TaskProgDetail + `${ this.finished } / ${ this.total }`,
                                    ].join('\n');
                                },
                            },
                            methods: {
                                /**
                                 * @param {'click' | 'dblclick'} type
                                 * @param {function} onClick
                                 * @param {function} onDblclick
                                 */
                                handleClick(type, onClick, onDblclick) {
                                    this.click_handler.onClick = onClick;
                                    this.click_handler.onDblclick = onDblclick;
                                    this.click_handler[type]();
                                },
                                showDetail(e) {
                                    const dialog = Quasar.Dialog.create({
                                        title: CONST.Text.TaskDetail.Title,
                                        message: '',
                                        html: true,
                                        color: 'primary',
                                        ok: {
                                            label: CONST.Text.TaskDetail.OkayButton
                                        },
                                        cancel: {
                                            label: CONST.Text.TaskDetail.CopyButton
                                        },
                                    }).onOk(() => {
                                        // Close popup
                                        // Nothing to do yet
                                    }).onCancel(() => {
                                        // Copy task info
                                        this.copyInfo();
                                    }).onDismiss(() => {
                                        // When dialog isdismissed, no matter how
                                        unwatch();
                                    });
                                    const unwatch = this.$watch('TaskTextInfo', (newInfo, oldInfo) => {
                                        dialog.update({
                                            message: newInfo.replaceAll('\n', '<br>')
                                        });
                                    }, {
                                        immediate: true
                                    });
                                },
                                copyInfo() {
                                    GM_setClipboard(this.TaskTextInfo, 'text');
                                },
                                downloadAsset() {
                                    const info = this.manager.info;
                                    const blob = info.asset;
                                    if (blob) {
                                        const url = URL.createObjectURL(blob);
                                        dl_browser(url, info.name);
                                        setTimeout(() => URL.revokeObjectURL(url));
                                    }
                                },
                            },
                            watch: {
                                manager: {
                                    handler(new_manager, old_manager) {
                                        const that = this;
                                        $AEL(new_manager, 'sub', e => {
                                            that.sub_managers = new_manager.children;
                                        });
                                        $AEL(new_manager, 'progress', e => {
                                            that.finished = new_manager.finished;
                                            that.total = new_manager.steps;
                                        });
                                        $AEL(new_manager, 'error', e => {
                                            that.error = new_manager.error;
                                        });
                                        $AEL(new_manager, 'reset', e => fullRefresh());
                                        fullRefresh();

                                        function fullRefresh() {
                                            that.sub_managers = new_manager.children;
                                            that.finished = new_manager.finished;
                                            that.total = new_manager.steps;
                                            that.error = new_manager.error;
                                        }
                                    },
                                    immediate: true
                                }
                            }
                        });
                        this.app.mount(board);
                    }

                    /**
                     * @param {ProgressManager} manager
                     */
                    show(manager) {
                        this.instance.show(manager);
                    }
                }

                const board = new ProgressBoard();

                class CustomDownloadPanel {
                    app;
                    instance;
                    #promise; // Promise to be created on show() call, and resolved on user submit
                    #resolve; // resolve function for the promise above

                    constructor() {
                        const that = this;

                        // GUI
                        const container = $$CrE({ tagName: 'div', styles: { position: 'fixed', zIndex: '-1' } });
                        const panel = $$CrE({
                            tagName: 'div',
                            classes: 'panel'
                        });
                        panel.innerHTML = `
                            <q-dialog v-model="show" :class="{ mobile: $q.platform.is.mobile }" :full-width="$q.platform.is.mobile" :full-height="$q.platform.is.mobile" @hide="cancel">
                                <q-card class="container-card-custom-dl">
                                    <q-card-section class="header row">
                                        <div class="text-h6">${ CONST.Text.CustomDownload.PopupTitle }</div>
                                        <q-space></q-space>
                                        <q-btn icon="close" flat round dense v-close-popup></q-btn>
                                    </q-card-section>
                                    <q-card-section class="body q-pa-md scroll">
                                        <q-list>
                                            <q-item>
                                                <q-item-section>
                                                    <q-select hide-bottom-space filled v-model="download_type" :options="avail_dl_types" label="${ CONST.Text.CustomDownload.TypeLabel }" ref="dltype_ref" :rules="[ val => !!val ]" lazy-rules></q-select>
                                                </q-item-section>
                                            </q-item>
                                            <q-item>
                                                <q-item-section>
                                                    <q-select hide-bottom-space filled v-model="service" :options="avail_services" label="${ CONST.Text.CustomDownload.ServiceLabel }" ref="service_ref" :rules="[ val => !!val ]" lazy-rules></q-select>
                                                </q-item-section>
                                            </q-item>
                                            <q-item>
                                                <q-item-section>
                                                    <q-input hide-bottom-space filled type="number" v-model.number="creator_id" label="${ CONST.Text.CustomDownload.CreatorLabel }" ref="creator_ref" :rules="[ val => !!val ]" lazy-rules></q-input>
                                                </q-item-section>
                                            </q-item>
                                            <q-item v-if="download_type.value === 'post'">
                                                <q-item-section>
                                                    <q-input hide-bottom-space filled type="text" v-model="post_id" label="${ CONST.Text.CustomDownload.PostLabel }" ref="post_ref" :rules="[ val => download_type.value !== 'post' || !!val ]" lazy-rules></q-input>
                                                </q-item-section>
                                            </q-item>
                                            <q-item>
                                                <q-item-section>
                                                    <q-input hide-bottom-space filled v-model="ext_filter" label-slot>
                                                        <template v-slot:label>
                                                            <div class="row items-center all-pointer-events">
                                                                ${ CONST.Text.CustomDownload.ExtFilterLabel }
                                                                <q-tooltip class="bg-grey-8" anchor="top left" self="bottom left" :offset="[0, 8]">
                                                                    ${ CONST.Text.CustomDownload.ExtFilterTooltip }
                                                                </q-tooltip>
                                                            </div>
                                                        </template>
                                                    </q-input>
                                                </q-item-section>
                                            </q-item>

                                            <q-expansion-item clickable expand-separator label="${ CONST.Text.CustomDownload.MoreOptions }">
                                                <q-list>
                                                    <q-item tag="label" clickable v-for="setting of settings_data">
                                                        <q-item-section>
                                                            <q-item-label>{{ setting.title }}</q-item-label>
                                                            <q-item-label caption v-if="!!setting.caption">{{ setting.caption }}</q-item-label>
                                                        </q-item-section>
                                                        <q-item-section side top>
                                                            <q-checkbox v-if="setting.type === 'boolean'" left-label v-model="temp_settings[setting.key]"></q-checkbox>
                                                            <div v-else-if="setting.type === 'folder'">
                                                                <span style="margin-right: 0.5em;">
                                                                    {{ temp_settings[setting.key]?.name ?? ${ escJsStr(CONST.Text.Settings.NoFolderSelected) } }}
                                                                </span>
                                                                <q-btn icon="folder_open" color="primary" @click="requestFolder(setting.key)"></q-button>
                                                            </div>
                                                            <q-input v-else-if="setting.type === 'string'"
                                                                v-model="temp_settings[setting.key]"
                                                                @focus="tooltips[setting.key] = true"
                                                                @blur="tooltips[setting.key] = false"
                                                                @keydown="e => e.stopPropagation()"
                                                            ></q-input>

                                                            <q-tooltip v-if="setting.help"
                                                                v-model="tooltips[setting.key]"
                                                                :no-parent-event="setting.type === 'string'"
                                                                v-html="setting.help"
                                                                style="font-size: 1em;"
                                                            ></q-tooltip>
                                                        </q-item-section>
                                                    </q-item>
                                                </q-list>
                                            </q-expansion-item>
                                        </q-list>
                                    </q-card-section>
                                    <q-card-actions :align="$q.platform.is.mobile ? 'center' : 'right'">
                                        <q-btn flat v-close-popup>${ CONST.Text.CustomDownload.Cancel }</q-btn>
                                        <q-btn flat @click="submit" :loading="loading" color="primary">${ CONST.Text.CustomDownload.Download }</q-btn>
                                    </q-card-action>
                                </q-card>
                            </q-dialog>
                        `;
                        container.append(panel);
                        detectDom('html').then(html => html.append(container));
                        detectDom('head').then(head => addStyle(`
                            .container-card-custom-dl :is([type=text], input[type=password], input[type=number]) {
                                box-shadow: unset;
                                background: unset;
                            }
                            .container-card-custom-dl :is(.header, .body):not(.mobile *) {
                                width: 35vw;
                                max-width: 80vw;
                                min-width: 35em;
                            }
                            .container-card-custom-dl .body {
                                max-height: 75vh;
                            }
                        `));

                        this.app = Vue.createApp({
                            data() {
                                const settings_data = CONST.Settings.filter(setting => setting.temp);
                                const tooltips = {};
                                for (const setting of settings_data) {
                                    if (setting.help) {
                                        tooltips[setting.key] = false;
                                    }
                                }
                                return {
                                    panel: that,
                                    temp_settings: {},
                                    tooltips,
                                    show: false,
                                    autoclose: true,
                                    download_type: null,
                                    service: '',
                                    creator_id: 0,
                                    post_id: 0,
                                    ext_filter: '',
                                    loading: false,
                                    settings_data,
                                    avail_dl_types: [{
                                        label: CONST.Text.CustomDownload.Type.Post,
                                        value: 'post'
                                    }, {
                                        label: CONST.Text.CustomDownload.Type.Creator,
                                        value: 'creator'
                                    }],
                                    avail_services: [{
                                        "label": "Patreon",
                                        "value": "patreon"
                                    }, {
                                        "label": "Pixiv Fanbox",
                                        "value": "fanbox"
                                    }, {
                                        "label": "Discord",
                                        "value": "discord"
                                    }, {
                                        "label": "Fantia",
                                        "value": "fantia"
                                    }, {
                                        "label": "Afdian",
                                        "value": "afdian"
                                    }, {
                                        "label": "Boosty",
                                        "value": "boosty"
                                    }, {
                                        "label": "Gumroad",
                                        "value": "gumroad"
                                    }, {
                                        "label": "SubscribeStar",
                                        "value": "subscribestar"
                                    }, {
                                        "label": "DLsite",
                                        "value": "dlsite"
                                    }]
                                }
                            },
                            methods: {
                                /**
                                 * @param {string} key
                                 */
                                async requestFolder(key) {
                                    /** @type {Window} */
                                    const win = utils.window;
                                    if (!win.showDirectoryPicker) {
                                        Quasar.Dialog.create({
                                            title: CONST.Text.Settings.FileSystemAPINotSupportedTitle,
                                            message: CONST.Text.Settings.FileSystemAPINotSupported,
                                        });
                                        return;
                                    }
                                    const dir_handle = await win.showDirectoryPicker({
                                        id: key,
                                        mode: 'readwrite',
                                        startIn: 'downloads'
                                    });
                                    this.temp_settings[key] = dir_handle;
                                },
                                submit() {
                                    if (!this.validate()) { return; }
                                    this.show = !this.autoclose;
                                    this.resolve({
                                        download_type: this.download_type.value,
                                        service: this.service.value,
                                        creator_id: this.creator_id,
                                        post_id: typeof this.post_id === 'string' && /\d+/.test(this.post_id) ? parseInt(this.post_id, 10) : this.post_id,
                                        ext_filter: this.ext_filter.split(/[, ]+/).map(ext => ext.replace(/^\.+/, '')).filter(ext => ext.length),
                                        settings: this.temp_settings
                                    });
                                },
                                cancel() {
                                    // This will also be invoked after download button clicked
                                    // Because the dialog popup will be closed after download button clicked
                                    // Since only the first call to the resolve function takes effect to the promise
                                    // This does not make anything wrong
                                    this.resolve(null);
                                },
                                validate() {
                                    const refs = ['dltype_ref', 'service_ref', 'creator_ref', 'post_ref'].map(ref_name => this.$refs[ref_name]).filter(ref => !!ref);
                                    refs.forEach(ref => ref.validate());
                                    return !refs.some(ref => ref.hasError);
                                }
                            },
                            mounted() {
                                that.instance = this;
                            }
                        });
                        this.app.use(Quasar);
                        this.app.mount(panel);
                    }

                    get loading() {
                        return this.instance.loading;
                    }

                    set loading(val) {
                        this.instance.loading = !!val;
                    }

                    get showing() {
                        return this.instance.show;
                    }

                    /** @typedef {'post' | 'creator'} download_type */
                    /** @typedef {'patreon' | 'fanbox' | 'discord' | 'fantia' | 'afdian' | 'boosty' | 'gumroad' | 'subscribestar' | 'dlsite'} kemono_service */
                    /**
                     * Display and wait for user submit
                     * @param {Object} defaultValue
                     * @param {download_type} defaultValue.download_type
                     * @param {kemono_service} defaultValue.service
                     * @param {number | string} defaultValue.creator_id
                     * @param {number | string} [defaultValue.post_id]
                     * @returns {Promise<null | { download_type: download_type, service: kemono_service, creator_id: number, post_id?: number, autoclose: boolean }>}
                     */
                    show({
                        download_type = 'post', service = 'patreon', creator_id = null, post_id = null,
                        autoclose = true
                    } = {}) {
                        if (this.showing) { return this.#promise; }
                        ({ promise: this.#promise, resolve: this.#resolve } = Promise.withResolvers());

                        // 传入的属性
                        this.instance.resolve = this.#resolve;
                        this.instance.download_type = this.instance.avail_dl_types.find(obj => obj.value === download_type);
                        this.instance.service = this.instance.avail_services.find(obj => obj.value === service);
                        this.instance.creator_id = parseInt(creator_id, 10);
                        this.instance.post_id = typeof post_id === 'string' && /\d+/.test(post_id) ? parseInt(post_id, 10) : post_id;
                        this.instance.autoclose = autoclose;

                        // 一次性的下载覆写设置
                        CONST.Settings.filter(s => s.temp).forEach(setting => {
                            this.instance.temp_settings[setting.key] = settings[setting.key];
                        });

                        // 展示下载框
                        this.instance.show = true;

                        return this.#promise;
                    }

                    close() {
                        this.instance.show = false;
                    }
                }

                const panel = new CustomDownloadPanel();

                class PostsSelector {
                    app;
                    instance;
                    posts;
                    #promise; // Promise to be created on show() call, and resolved on user submit
                    #resolve; // resolve function for the promise above

                    /**
                     * @typedef {Object} post
                     * @property {number} id
                     * @property {number} user
                     * @property {string} service
                     * @property {string} title
                     * @property {string} content
                     * @property {Object} embed
                     * @property {boolean} shared_file
                     * @property {string} added
                     * @property {string} published
                     * @property {string} edited
                     * @property {Object} file
                     * @property {Object} attachments
                     * @property {*} poll
                     * @property {*} captions
                     * @property {*} tags
                     */

                    constructor() {
                        const that = this;

                        // GUI
                        const container = $$CrE({ tagName: 'div', styles: { position: 'fixed', zIndex: '-1' } });
                        const panel = $$CrE({
                            tagName: 'div',
                            classes: 'panel'
                        });

                        panel.innerHTML = `
                            <q-dialog v-model="show" :class="{ mobile: $q.platform.is.mobile }" :full-width="$q.platform.is.mobile" :full-height="$q.platform.is.mobile" @hide="cancel">
                                <q-layout container view="hHh lpR fFf" class="posts-selector">
                                    <q-header bordered class="header bg-dark">
                                        <q-toolbar>
                                            <q-toolbar-title>
                                                <q-avatar icon="checklist"></q-avatar>
                                                ${ CONST.Text.PostsSelector.Title }
                                            </q-toolbar-title>
                                            <q-btn icon="close" flat round dense v-close-popup></q-btn>
                                        </q-toolbar>
                                        <q-item tag="label" class="select-all" ref="select_all" clickable v-ripple>
                                            <q-item-section>
                                                <q-item-label lines="1">${ CONST.Text.PostsSelector.SelectAll }</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-checkbox v-model="select_all" @update:model-value="val => selectAll(val)"></q-checkbox>
                                            </q-item-section>
                                        </q-item>
                                    </q-header>

                                    <q-page-container>
                                        <q-page class="bg-dark body">
                                            <q-virtual-scroll
                                                :items="posts"
                                                virtual-scroll-item-size="57"
                                                virtual-scroll-sticky-size-start="57"
                                                class="virtual-scroll"
                                                ref="vscroll"
                                                separator
                                            >
                                                <template v-slot:before>
                                                    <!-- Original SelectAll Placement -->
                                                    <q-tooltip ref="tooltip" :target="false" :no-parent-event="$q.platform.is.mobile">
                                                        <img :src="tooltip_src" loading="lazy" class="image-preview">
                                                    </q-tooltip>
                                                </template>
                                                <template v-slot="{ item: post, index }">
                                                    <q-item tag="label" clickable v-ripple>
                                                        <q-item-section avatar>
                                                            <q-avatar square>
                                                                <q-img v-if="!!post.file?.path"
                                                                    fit="cover"
                                                                    ratio="1"
                                                                    loading="lazy"
                                                                    :src="thumbnails[post.id]"
                                                                    :id="\`thumbnail-\${post.id}\`"
                                                                    @mouseover="e => showThumbnail(e, post)"
                                                                    @touchstart="e => showThumbnail(e, post)"
                                                                >
                                                                </q-img>
                                                                <q-icon v-else name="hide_image"></q-icon>
                                                            </q-avatar>
                                                        </q-item-section>
                                                        <q-item-section>
                                                            <q-item-label lines="1">{{ post.title }}</q-item-label>
                                                        </q-item-section>
                                                        <q-item-section side>
                                                            <q-btn icon="open_in_new" flat target="_blank" :href="\`/\${ post.service }/user/\${ post.user }/post/\${ post.id }\`"></q-btn>
                                                        </q-item-section>
                                                        <q-item-section side>
                                                            <q-checkbox v-model="selected_posts" :val="post" @update:model-value="onSelect"></q-checkbox>
                                                        </q-item-section>
                                                    </q-item>
                                                </template>
                                            </q-virtual-scroll>
                                        </q-page>
                                    </q-page-container>
                                    <q-footer bordered class="footer bg-dark">
                                        <q-toolbar :class="{ row: $q.platform.is.mobile }">
                                            <q-space v-if="$q.platform.is.desktop"></q-space>
                                            <q-btn :class="{ col: $q.platform.is.mobile }" flat v-close-popup>${ CONST.Text.PostsSelector.Cancel }</q-btn>
                                            <q-btn :class="{ col: $q.platform.is.mobile }" flat @click="submit" color="primary">${ CONST.Text.PostsSelector.OK }</q-btn>
                                        </q-toolbar>
                                    </q-footer>
                                </q-layout>
                            </q-dialog>
                        `;

                        container.append(panel);
                        detectDom('html').then(html => html.append(container));
                        detectDom('head').then(head => addStyle(`
                            .posts-selector .body .vscroll-container {
                                max-height: 100vh;
                            }

                            /* 去除"全选"下边框 */
                            .posts-selector .header .select-all {
                                border: none;
                            }

                            /* 根据屏幕宽高确定图像大小 */
                            /* 当屏幕宽度大于高度时（横屏/宽屏） */
                            @media (min-aspect-ratio: 1/1) {
                                .image-preview {
                                    height: 40vh;
                                    width: auto;
                                }
                            }
                            /* 当屏幕高度大于等于宽度时（竖屏/方屏） */
                            @media (max-aspect-ratio: 1/1) {
                                .image-preview {
                                    width: 40vw;
                                    height: auto;
                                }
                            }
                        `));

                        this.app = Vue.createApp({
                            data() {
                                return {
                                    selector: that,
                                    show: false,
                                    select_all: false,
                                    /** @type {post[]} */
                                    posts: [],
                                    /** @type {post[]} */
                                    selected_posts: [],
                                    tooltip_src: '',
                                }
                            },
                            computed: {
                                thumbnails() {
                                    return this.posts.reduce(
                                        (thumbnails, post) => Object.assign(
                                            thumbnails,
                                            { [post.id]: `https://img.${location.host}/thumbnail/data` + post.file.path }
                                        ), {}
                                    );
                                }
                            },
                            methods: {
                                /**
                                 * 展示指定post的封面（主文件）
                                 * @param {TouchEvent} e
                                 * @param {post} post
                                 */
                                async showThumbnail(e, post) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    if (Quasar.Platform.is.mobile) {
                                        // 移动端弹窗展示
                                        const dialog = Quasar.Dialog.create({
                                            message: `<img src="${ this.thumbnails[post.id] }">`,
                                            html: true,
                                            ok: false,
                                            class: 'preview-thumbnail',
                                        });
                                        const qcard = await detectDom('.preview-thumbnail');
                                        $AEL(qcard, 'click', e => dialog.hide(), { once: true });
                                    } else {
                                        // 电脑端用tooltip展示
                                        this.tooltip_src = this.thumbnails[post.id];
                                        this.$refs.tooltip.$props.target = `#thumbnail-${post.id}`;
                                    }

                                    Quasar.Platform.is.mobile && this.$refs.tooltip.show();
                                },
                                submit() {
                                    if (!this.validate()) { return; }
                                    this.show = false;
                                    this.resolve(this.selected_posts.map(
                                        post => this.selector.posts.find(p => p.id === post.id)
                                    ));
                                },
                                cancel() {
                                    // This will also be invoked after submit button clicked
                                    // Because the dialog popup will be closed after download button clicked
                                    // Since only the first call to the resolve function takes effect to the promise
                                    // This does not make anything wrong
                                    this.selected_posts.splice(0, this.selected_posts.length);
                                    this.resolve(null);
                                },
                                validate() {
                                    const refs = [].map(ref_name => this.$refs[ref_name]).filter(ref => !!ref);
                                    refs.forEach(ref => ref.validate());
                                    return !refs.some(ref => ref.hasError);
                                },
                                selectAll(selected) {
                                    if (selected ? this.selected_posts.length === this.posts.length : !this.selected_posts.length) { return; }
                                    this.selected_posts.splice(0, this.selected_posts.length);
                                    selected && this.selected_posts.push(...this.posts);
                                    selected && !this.select_all && (this.select_all = true);
                                },
                                onSelect() {
                                    // Sort selected_posts by posts
                                    this.selected_posts.sort((p1, p2) => this.posts.indexOf(p2) - this.posts.indexOf(p1));

                                    // Update select_all status
                                    const select_all = this.selected_posts.length === this.posts.length ? true : (this.selected_posts.length ? null : false);
                                    select_all !== this.select_all && (this.select_all = select_all);
                                },
                            },
                            mounted() {
                                that.instance = this;
                            },
                            watch: {
                                show(val, old_val) {
                                    const that = this;
                                    if (val && !old_val) {
                                        setTimeout(adjustVirtualScroll);
                                    }

                                    function adjustVirtualScroll(retry = 0) {
                                        if (that.$refs.select_all && that.$refs.vscroll) {
                                            const elm = that.$refs.select_all?.$el;
                                            const height = getComputedStyle(elm).height.match(/((?:\d+\.)?\d+)px/)?.[1];
                                            that.$refs.vscroll.$props.virtualScrollItemSize = height;
                                            that.$refs.vscroll.$props.virtualScrollStickySizeStart = height;
                                        } else {
                                            DoLog(LogLevel.Warning, '[PostSelector] unexpected: $refs not ready');
                                            ++retry <= 3 && setTimeout(adjustVirtualScroll.bind(null, retry), 100);
                                        }
                                    }
                                }
                            }
                        });
                        this.app.use(Quasar);
                        this.app.mount(panel);

                    }

                    /**
                     *
                     * @param {Object} detail
                     * @param {post[]} detail.posts
                     * @param {post[]} [detail.select_all] - whether all posts to be selected by default, true if omitted
                     * @returns
                     */
                    show({ posts, select_all = true }) {
                        if (this.showing) { return this.#promise; }
                        ({ promise: this.#promise, resolve: this.#resolve } = Promise.withResolvers());

                        this.posts = posts;
                        this.instance.resolve = this.#resolve;
                        this.instance.posts = Object.freeze(posts); // 根据QVirtualScroll的建议，冻结数组以取得最佳性能
                        this.instance.selectAll(select_all);
                        this.instance.show = true;
                        return this.#promise;
                    }
                }

                const selector = new PostsSelector();

                return { ProgressBoard, board, CustomDownloadPanel, panel, PostsSelector, selector };
            }
        },
        downloader: {
            desc: 'core zip download utils',
            dependencies: ['utils', 'api', 'settings', 'gui'],
            /** @typedef {Awaited<ReturnType<typeof functions.downloader.func>>} downloader */
            async func() {
                /** @type {utils} */
                const utils = require('utils');
                /** @type {api} */
                const API = require('api');
                /** @type {settings} */
                const settings = require('settings');
                /** @type {gui} */
                const gui = require('gui');

                // Performance record
                const perfmon = new utils.PerformanceManager();
                perfmon.newTask('fetchPost');
                perfmon.newTask('saveAs');
                perfmon.newTask('_fetchBlob');


                class DownloaderItem {
                    /** @typedef {'file' | 'folder'} downloader_item_type */
                    /**
                     * Name of the item, CANNOT BE PATH
                     * @type {string}
                     */
                    name;
                    /** @type {downloader_item_type} */
                    type;

                    /**
                     * @param {string} name
                     * @param {downloader_item_type} type
                     */
                    constructor(name, type) {
                        this.name = name;
                        this.type = type;
                    }
                }

                class DownloaderFile extends DownloaderItem{
                    /** @type {Blob} */
                    data;
                    /** @type {Date} */
                    date;
                    /** @type {string} */
                    comment;

                    /**
                     * @param {string} name - name only, CANNOT BE PATH
                     * @param {Blob} data
                     * @param {Object} detail
                     * @property {Date} [date]
                     * @property {string} [comment]
                     */
                    constructor(name, data, detail) {
                        super(name, 'file');
                        this.data = data;
                        Object.assign(this, detail);
                    }

                    zip(jszip_instance) {
                        const z = jszip_instance ?? new JSZip();
                        const options = {};
                        this.date && (options.date = this.date);
                        this.comment && (options.comment = this.comment);
                        z.file(this.name, this.data, options);
                        return z;
                    }
                }

                class DownloaderFolder extends DownloaderItem {
                    /** @type {Array<DownloaderFile | DownloaderFolder>} */
                    children;

                    /**
                     * @param {string} name - name only, CANNOT BE PATH
                     * @param {Array<DownloaderFile | DownloaderFolder>} [children]
                     */
                    constructor(name, children) {
                        super(name, 'folder');
                        this.children = children && children.length ? children : [];
                    }

                    zip(jszip_instance) {
                        const z = jszip_instance ?? new JSZip();
                        for (const child of this.children) {
                            switch (child.type) {
                                case 'file': {
                                    child.zip(z);
                                    break;
                                }
                                case 'folder': {
                                    const sub_z = z.folder(child.name);
                                    child.zip(sub_z);
                                }
                            }
                        }
                        return z;
                    }
                }

                /** @typedef {InstanceType<typeof utils.ProgressManager>} ProgressManager */
                /**
                 * @typedef {Object} JSZip
                 */
                /**
                 * @typedef {Object} zipObject
                 */
                /**
                 * @typedef {Object} kemono_file
                 * @property {string} path
                 * @property {string} [name]
                 * @property {string} [server]
                 */
                /**
                 * one-time download config for current download
                 * @typedef {Object} download_config
                 * @property {boolean} [flatten_files] - put attachments into root folder instead of attachments folder
                 * @property {boolean} [no_mainfile] - do not download main file
                 * @property {string} [filename] - filename template
                 * @property {string[]} [ext_filter] - download files with these extensions only
                 */

                /**
                 * Download one post in zip file, and show ProgressBoard
                 * @param {Object} detail
                 * @param {string} detail.service
                 * @param {number | string} detail.creator_id
                 * @param {number | string} detail.post_id
                 * @param {download_config} [detail.config] - config object passing to fetchPost
                 */
                async function downloadPost({
                    post,
                    config = {}
                } = {}) {
                    if (!checkFSAPISaveDir(config)) { return; }
                    const { service, creator_id, post_id } = post;
                    const manager = new utils.ProgressManager(3, {
                        type: 'root',
                        name: CONST.Text.ProgressBoard.TotalProgress
                    });
                    gui.board.show(manager);

                    const [data, creator_data] = await manager.progress(Promise.all([
                        API.Posts.post(service, creator_id, post_id),
                        API.Creators.profile(service, creator_id),
                    ]));
                    const folder = await manager.progress(fetchPost({ api_data: data, creator_data, manager, config }));
                    const zip = folder.zip();
                    const filename = `${data.post.title}.zip`;
                    manager.progress(await saveAs(filename, zip, manager, null, config));
                }

                /**
                 * @typedef {Object} PostInfo
                 * @property {string} service,
                 * @property {number} creator_id
                 * @property {number} post_id
                 */

                /**
                 * Download one or multiple posts in zip file, one folder for each post
                 * @param {Object} detail
                 * @param {PostInfo | PostInfo[]} detail.posts
                 * @param {string} detail.filename - file name of final zip file to be delivered to the user
                 * @param {download_config} [detail.config] - config object passing to fetchPost
                 * @param {Object} [detail.creator_data] - creator's data from Creators.Profile api
                 */
                async function downloadPosts({
                    posts, filename,
                    config = {},
                    creator_data = null,
                } = {}) {
                    if (!checkFSAPISaveDir(config)) { return; }
                    Array.isArray(posts) || (posts = [posts]);
                    const manager = new utils.ProgressManager(posts.length + 1, {
                        type: 'root',
                        name: CONST.Text.ProgressBoard.TotalProgress,
                        desc: replaceText(CONST.Text.ProgressBoard.TotalProgDesc, {
                            '{PostsCount}': posts.length.toString()
                        })
                    });
                    gui.board.show(manager);

                    // Fetch posts
                    const post_folders = await Promise.all(
                        posts.map(async post => {
                            const data = await API.Posts.post(post.service, post.creator_id, post.post_id);
                            const folder = await fetchPost({ api_data: data, creator_data, manager, config });
                            await manager.progress();
                            return folder;
                        })
                    );

                    // Merge all post's folders into one
                    const folder = new DownloaderFolder(filename);
                    post_folders.map(async post_folder => {
                        if (folder.name !== '') {
                            folder.children.push(post_folder);
                        } else {
                            folder.children.push(...post_folder.children);
                        }
                    })

                    // Convert folder to zip
                    const zip = folder.zip();

                    // Deliver to user
                    await manager.progress(saveAs(filename, zip, manager, null, config));
                }

                /**
                 * Fetch one post
                 * @param {Object} detail
                 * @param {Object} detail.api_data - kemono post api returned data object
                 * @param {Object} [detail.creator_data] - kemono creators.profile api returned data, request api if not provided
                 * @param {ProgressManager} detail.manager
                 * @param {download_config} [detail.config] - config used for this download, default value for omitted ones is from settings
                 * @returns {Promise<DownloaderFolder>}
                 */
                async function fetchPost({ api_data, creator_data = null, manager, config }) {
                    const perfmon_run = perfmon.run('fetchPost', api_data);
                    const sub_manager = manager.sub(0, {
                        type: 'folder',
                        name: api_data.post.title,
                        desc: replaceText(CONST.Text.ProgressBoard.PostProgDesc, {
                            '{FilesCount}': api_data.post.attachments.length + (api_data.post.file.path ? 1 : 0)
                        })
                    });

                    creator_data || (creator_data = await API.Creators.profile(api_data.post.service, api_data.post.user));

                    let { save_apijson, save_content, text_content, flatten_files, no_mainfile, ext_filter, filename, foldername } = config;
                    save_apijson = save_apijson !== undefined ? save_apijson : settings.save_apijson;
                    save_content = save_content !== undefined ? save_content : settings.save_content;
                    text_content = text_content !== undefined ? text_content : settings.text_content;
                    flatten_files = flatten_files !== undefined ? flatten_files : settings.flatten_files;
                    no_mainfile = no_mainfile !== undefined ? no_mainfile : settings.no_mainfile;
                    filename = filename !== undefined ? filename : settings.filename;
                    foldername = foldername !== undefined ? foldername : settings.foldername;

                    const date = new Date(api_data.post.edited);
                    const folder = new DownloaderFolder(
                        buildName({
                            template: foldername,
                            ori_name: api_data.post.title,
                        }),
                        [
                            ...save_apijson ? [
                                new DownloaderFile(buildName({
                                    template: filename,
                                    p: 0,
                                    ori_name: 'data.json',
                                }), JSON.stringify(api_data))
                            ] : [],
                            ...save_content ? [
                                text_content ?
                                    new DownloaderFile(
                                        buildName({
                                            template: filename,
                                            p: 0,
                                            ori_name: 'content.txt',
                                        }),
                                        utils.content2text(
                                            api_data.post.content,
                                            api_data.post.service
                                        ), { date }) :
                                    new DownloaderFile(
                                        buildName({
                                            template: filename,
                                            p: 0,
                                            ori_name: 'content.html',
                                        }),
                                        `<pre>${
                                            utils.content2html(
                                                api_data.post.content,
                                                api_data.post.service
                                            )
                                        }</pre>`, { date })
                            ] : []
                        ]
                    );

                    // parent folder for attachments
                    let attachments_folder = folder;
                    if (api_data.post.attachments.length && !flatten_files) {
                        attachments_folder = new DownloaderFolder('attachments');
                        folder.children.push(attachments_folder);
                    }

                    /**
                     * @typedef {Object} file_obj
                     * @property {'main' | 'attachment'} type
                     * @property {kemono_file} file
                     * @property {number} index - zero-based index of file in its parent folder's all numbered files
                     */
                    /** @type {file_obj[]} */
                    const files_before_attachments = (flatten_files && !no_mainfile) ? 1 : 0;
                    const file_objs = [
                        no_mainfile ? null : {
                            type: 'main',
                            file: api_data.post.file,
                            index: 0
                        },
                        ...api_data.post.attachments.map((attachment, i) => ({
                            type: 'attachment',
                            file: attachment,
                            index: i + files_before_attachments
                        }))
                    ].filter(f => f !== null);
                    const tasks = file_objs.map(async ({ type: file_type, file, index }) => {
                        if (!file.path) { return; }

                        sub_manager.add();

                        // Filename
                        const ori_name = getFileName(file);
                        const p = index + 1;
                        const name = buildName({
                            ori_name, p,
                            template: filename,
                        });
                        const ext = name.slice(name.lastIndexOf('.') + 1);
                        if (ext_filter && ext_filter.length && !ext_filter.includes(ext)) { return; }

                        // Fetch blob
                        const url = getFileUrl(file);
                        const blob = await sub_manager.progress(fetchBlob(url, name, sub_manager));

                        // Add to folder
                        if (blob) {
                            const parent_folder = ({
                                main: folder,
                                attachment: attachments_folder
                            })[file_type];
                            parent_folder.children.push(new DownloaderFile(
                                name, blob, {
                                    date,
                                    comment: JSON.stringify(file)
                                }
                            ));
                        }
                    });
                    await Promise.all(tasks);

                    // Make sure sub_manager finishes even when no async tasks
                    if (sub_manager.steps === 0) {
                        sub_manager.steps = 1;
                        await sub_manager.progress();
                    }

                    perfmon_run.stop();

                    return folder;

                    /**
                     * @param {kemono_file} file
                     * @returns {string}
                     */
                    function getFileName(file) {
                        return file.name || file.path.slice(file.path.lastIndexOf('/')+1);
                    }

                    /**
                     * @param {kemono_file} file
                     * @returns {string}
                     */
                    function getFileUrl(file) {
                        return (getFileServer(file) ?? `https://n1.${location.host}`) + '/data' + file.path;
                    }

                    /**
                     * @param {kemono_file} file
                     * @returns {string} file extension name, not including '.'
                     */
                    function getFileExt(file) {
                        const name = getFileName(file);
                        return name.slice(name.lastIndexOf('.') + 1);
                    }

                    /**
                     * @param {kemono_file} file
                     * @returns {string} file extension name, not including '.'
                     */
                    function getFileServer(file) {
                        if (file.server) {
                            return file.server;
                        }

                        const preview = [...api_data.attachments, ...api_data.previews].find(preview => preview.path === file.path);
                        return preview?.server ?? null;
                    }

                    /**
                     * Simple wrapper for escapePath(buildNameTemplate(...)) inside fetchPost
                     * @param {Object} detail
                     */
                    function buildName({
                        template, ori_name, p
                    } = {}) {
                        return escapePath(buildNameTemplate({
                            template, ori_name, p,
                            post_id: api_data.post.id,
                            creator_id: api_data.post.user,
                            service: api_data.post.service,
                            title: api_data.post.title,
                            publish_time: api_data.post.published,
                            creator_name: creator_data.name
                        }));
                    }
                }
                /**
                 * Deliver zip file to user
                 * @param {string} filename - filename (with extension, e.g. "file.zip")
                 * @param {JSZip} zip,
                 * @param {ProgressManager} manager
                 * @param {string | null} [comment] - zip file comment
                 * @param {download_config} [config] - config used for this download, default value for omitted ones is from settings
                 */
                async function saveAs(filename, zip, manager, comment=null, config = {}) {
                    const perfmon_run = perfmon.run('saveAs', filename);
                    const sub_manager = manager.sub(100, {
                        type: 'zip',
                        name: filename,
                        desc: CONST.Text.ProgressBoard.ZipProgDesc,
                        asset: null,
                    });

                    if (settings.fileapi) {
                        // FileSystemAPI
                        if (!checkFSAPISaveDir(config)) { return; }
                        const dir_handle = config.savedir ?? settings.savedir;

                        // Get existing file/folder names in savedir
                        const existing_fnames = [];
                        for await (const f of dir_handle.values()) {
                            existing_fnames.push(f.name);
                        }

                        // Generate filename
                        if (existing_fnames.includes(filename)) {
                            const ext_index = filename.lastIndexOf('.');
                            const base = filename.slice(0, ext_index);
                            const ext = filename.slice(ext_index + 1);
                            let new_fname = filename;
                            for (let i = 2; existing_fnames.includes(new_fname); i++) {
                                new_fname = `${ base } (${ i }).${ ext }`;
                            }
                            filename = new_fname;
                        }

                        // Create file
                        const file_handle = await dir_handle.getFileHandle(filename, { create: true });
                        const stream = await file_handle.createWritable({ mode: 'exclusive' });

                        // Generate zip file stream and write into file
                        await new Promise((resolve, reject) => {
                            const options = { type: 'uint8array' };
                            zip.generateInternalStream(
                                options
                            ).on('data', (data, metadata) => {
                                stream.write(data);
                                sub_manager.progress(null, metadata.percent)
                            }).on('end', () => {
                                stream.close();
                                resolve();
                            }).resume();
                        });
                    } else {
                        // Traditional <a download>
                        const options = { type: 'blob' };
                        comment !== null && (options.comment = comment);
                        const blob = sub_manager.info.asset = await zip.generateAsync(options, metadata => sub_manager.progress(null, metadata.percent));
                        const url = URL.createObjectURL(blob);
                        const a = $$CrE({
                            tagName: 'a',
                            attrs: {
                                download: filename,
                                href: url
                            }
                        });
                        a.click();
                    }

                    perfmon_run.stop();
                }

                /** @type {typeof _fetchBlob} */
                function fetchBlob(...args) {
                    if (!fetchBlob.initialized) {
                        queueTask.fetchBlob = {
                            max: 3,
                            sleep: 0
                        };
                        fetchBlob.initialized = true;
                    }

                    return queueTask(() => _fetchBlob(...args), 'fetchBlob');
                }

                /**
                 * Fetch blob data from given url
                 * resolves null if error thrown
                 * @param {string} url
                 * @param {string} filename
                 * @param {ProgressManager} manager
                 * @param {ProgressManager} [sub_manager] provided only in error-retry logic
                 * @param {number} [retry=3] - times to retry before throwing an error
                 * @returns {Promise<Blob | null>}
                 */
                async function _fetchBlob(url, filename, manager, sub_manager = null, retry = 3) {
                    const perfmon_run = perfmon.run('_fetchBlob', url);
                    sub_manager = sub_manager ?? manager.sub(0, {
                        type: 'blob',
                        name: filename,
                        desc: url,
                        asset: null,
                    });

                    try {
                        const blob = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'GET', url,
                                responseType: 'blob',
                                async onprogress(e) {
                                    sub_manager.steps = e.total;
                                    await sub_manager.progress(null, e.loaded);
                                },
                                onload(e) {
                                    e.status === 200 ? resolve(e.response) : onerror(e)
                                },
                                onerror
                            });

                            async function onerror(err) {
                                if (retry) {
                                    sub_manager.reset();
                                    _fetchBlob(url, filename, manager, sub_manager, retry - 1).then(result => {
                                        perfmon_run.stop();
                                        resolve(result);
                                    }).catch(err => doReject(err));
                                } else {
                                    doReject(err);
                                }

                                function doReject(err) {
                                    sub_manager.newError('self');
                                    perfmon_run.stop();
                                    //reject(err);
                                    resolve(null);
                                }
                            }
                        });
                        sub_manager.info.asset = blob;
                        return blob;
                    } catch(err) {
                        throw err;
                    } finally {
                        perfmon_run.stop();
                    }
                }

                /**
                 * Check if FileSystemAPI is enabled but SaveDir not set
                 * If not, alert user and return false
                 * @param {download_config} - also checks this config for savedir existance
                 * @returns {boolean}
                 */
                function checkFSAPISaveDir(config) {
                    if (settings.fileapi && !settings.savedir && !config.savedir) {
                        Quasar.Dialog.create({
                            title: CONST.Text.SaveDirMissingTitle,
                            message: CONST.Text.SaveDirMissing
                        });
                        return false;
                    }
                    return true;
                }

                /**
                 * Replace unallowed special characters in a path part
                 * @param {string} path - a part of path, such as a folder name / file name
                 */
                function escapePath(path) {
                    // Replace special characters
                    const chars_bank = {
                        '\\': '＼',
                        '/': '／',
                        ':': '：',
                        '*': '＊',
                        '?': '？',
                        '"': "'",
                        '<': '＜',
                        '>': '＞',
                        '|': '｜'
                    };
                    for (const [char, replacement] of Object.entries(chars_bank)) {
                        path = path.replaceAll(char, replacement);
                    }

                    // Disallow ending with dots
                    path.endsWith('.') && (path += '_');
                    return path;
                }

                /**
                 * Build filename based on filename template and provided file info
                 * @param {Object} detail
                 * @param {string} detail.template - filename/foldername template, defaults to settings.filename
                 * @param {string | number} [detail.post_id]
                 * @param {string | number} detail.creator_id
                 * @param {string} detail.service
                 * @param {string} detail.ori_name - original filename
                 * @param {string | number} [detail.p] - index of file + 1
                 * @param {string} detail.title - post title
                 * @param {string | number} detail.publish_time - in format that new Date() accepts
                 */
                function buildNameTemplate({
                    template, ori_name, p,
                    post_id, creator_id, service,
                    title, publish_time, creator_name,
                } = {}) {
                    post_id = post_id ?? '';
                    p = p ?? '';
                    const base = ori_name.slice(0, ori_name.lastIndexOf('.'));
                    const ext = ori_name.slice(ori_name.lastIndexOf('.') + 1);
                    const date = new Date(publish_time);
                    const replacements = {
                        '{postid}': post_id.toString(),
                        '{creatorid}': creator_id.toString(),
                        '{service}': service,
                        '{p}': p.toString(),
                        '{name}': ori_name,
                        '{base}': base,
                        '{ext}': ext,
                        '{title}': title,
                        '{creator}': creator_name,
                        '{year}': date.getFullYear().toString(),
                        '{month}': (date.getMonth()+1).toString(),
                        '{date}': date.getDate().toString(),
                        '{hour}': date.getHours().toString(),
                        '{minute}': date.getMinutes().toString(),
                        '{second}': date.getSeconds().toString(),
                        '{timestamp}': date.getTime().toString(),
                        '{timetext}': date.toLocaleString(),
                    };
                    // Replace Upper case patterns to lower case patterns
                    for (const pattern of Object.keys(replacements)) {
                        let position = 0;
                        while (true) {
                            const index = template.toLowerCase().indexOf(pattern, position);
                            if (index > -1) {
                                template = template.slice(0, index) + pattern + template.slice(index + pattern.length);
                                position = index + pattern.length;
                            } else {
                                break;
                            }
                        }
                    }
                    return replaceText(template, replacements);
                }

                return {
                    downloadPost, downloadPosts,
                    fetchPost, saveAs,
                    perfmon
                };
            }
        },
        settings: {
            detectDom: 'html',
            dependencies: ['utils', 'dependencies'],
            params: ['GM_setValue', 'GM_getValue'],
            /** @typedef {Awaited<ReturnType<typeof functions.settings.func>>} settings */
            async func(GM_setValue, GM_getValue) {
                /** @type {utils} */
                const utils = require('utils');

                // settings 数据
                const settings_data = CONST.Settings;

                // settings 读/写对象，既用于oFunc内读写，也直接作为oFunc返回值提供给其他功能函数
                // 对于提供了storage键的，默认直接在GM存储空间读写；不提供storage键的，仅在内存中读写
                /**
                 * @type {{[K in keyof typeof SettingsObj]: typeof SettingsObj[K]['default']}}
                 */
                const settings = {};
                settings_data.forEach(setting => {
                    if (setting.storage) {
                        Object.defineProperty(settings, setting.key, {
                            get() {
                                return GM_getValue(setting.storage, setting.default);
                            },
                            set(val) {
                                GM_setValue(setting.storage, val);
                            }
                        });
                    } else {
                        settings[setting.key] = setting.default;
                    }
                });

                // 创建设置界面
                const container = $$CrE({
                    tagName: 'div',
                    styles: { all: 'initial', position: 'fixed' }
                })
                const app_elm = $CrE('div');
                app_elm.innerHTML = `
                    <q-dialog v-model="show">
                        <q-card>
                            <q-card-section>
                                <div class="text-h6">${ CONST.Text.Settings.Title }</div>
                            </q-card-section>
                            <q-card-section style="max-height: 75vh;" class="scroll">
                                <q-list>
                                    <q-item tag="label" v-for="setting of settings_data" v-ripple>
                                        <q-item-section>
                                            <q-item-label>{{ setting.title }}</q-item-label>
                                            <q-item-label caption v-if="setting.caption">{{ setting.caption }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section avatar>
                                            <q-toggle v-if="setting.type === 'boolean'"
                                                color="primary"
                                                v-model="settings[setting.key]"
                                            ></q-toggle>
                                            <div v-else-if="setting.type === 'folder'">
                                                <span style="margin-right: 0.5em;">
                                                    {{ settings[setting.key]?.name ?? ${ escJsStr(CONST.Text.Settings.NoFolderSelected) } }}
                                                </span>
                                                <q-btn
                                                    icon="folder_open"
                                                    color="primary"
                                                    @click="requestFolder(setting.key)"
                                                ></q-button>
                                            </div>
                                            <q-input v-else-if="setting.type === 'string'"
                                                v-model="settings[setting.key]"
                                                @focus="tooltips[setting.key] = true"
                                                @blur="tooltips[setting.key] = false"
                                                @keydown="e => e.stopPropagation()"
                                            ></q-input>

                                            <q-tooltip v-if="setting.help"
                                                v-model="tooltips[setting.key]"
                                                :no-parent-event="setting.type === 'string'"
                                                v-html="setting.help"
                                                style="font-size: 1em;"
                                            ></q-tooltip>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card-section>
                        </q-card>
                    </q-dialog>
                `;
                container.append(app_elm);
                $('html').append(container);
                const app = Vue.createApp({
                    data() {
                        const tooltips = {};
                        for (const setting of settings_data) {
                            if (setting.help) {
                                tooltips[setting.key] = false;
                            }
                        }
                        return {
                            show: false,
                            settings_data,
                            settings,
                            tooltips,
                        };
                    },
                    methods: {
                        /**
                         * @param {string} key
                         */
                        async requestFolder(key) {
                            /** @type {Window} */
                            const win = utils.window;
                            if (!win.showDirectoryPicker) {
                                Quasar.Dialog.create({
                                    title: CONST.Text.Settings.FileSystemAPINotSupportedTitle,
                                    message: CONST.Text.Settings.FileSystemAPINotSupported,
                                });
                                return;
                            }
                            const dir_handle = await win.showDirectoryPicker({
                                id: key,
                                mode: 'readwrite',
                                startIn: 'downloads'
                            });
                            this.settings[key] = dir_handle;
                        },
                    },
                    mounted() {
                        GM_registerMenuCommand(CONST.Text.Settings.Title, e => this.show = true);
                        GM_addValueChangeListener('settings', () => {
                            this.save_content = settings.save_content;
                            this.save_apijson = settings.save_apijson;
                        });
                    }
                });
                app.use(Quasar);
                app.mount(app_elm);

                return settings;
            }
        },
        'user-interface': {
            dependencies: ['utils', 'api', 'downloader', 'gui'],
            /** @typedef {Awaited<ReturnType<typeof functions['user-interface']['func']>>} ui */
            async func() {
                /** @type {utils} */
                const utils = require('utils');
                /** @type {api} */
                const api = require('api');
                /** @type {downloader} */
                const downloader = require('downloader');
                /** @type {gui} */
                const gui = require('gui');

                let downloading = false;
                let selector = null;

                // Console User Interface
                const ConsoleUI = utils.window.ZIP = {
                    version: GM_info.script.version,
                    require,

                    api, downloader,
                    get ui() { return require('user-interface') },

                    downloadCurrentPost, downloadCurrentCreator, downloadCustom, userDownload, getPageType, apiCurrentPost
                };

                // Menu User Interface
                GM_registerMenuCommand(CONST.Text.DownloadPost, downloadCurrentPost);
                GM_registerMenuCommand(CONST.Text.DownloadCreator, downloadCurrentCreator);
                GM_registerMenuCommand(CONST.Text.DownloadCustom, downloadCustom);

                // Graphical User Interface
                // Make button
                const dlbtn = $$CrE({
                    tagName: 'button',
                    styles: {
                        'background-color': 'transparent',
                        'color': 'white',
                        'border': 'transparent'
                    },
                    listeners: [['click', userDownload]]
                });
                const dltext = $$CrE({
                    tagName: 'span',
                    props: {
                        innerText: CONST.Text.DownloadZip
                    }
                });
                const dlprogress = $$CrE({
                    tagName: 'span',
                    styles: {
                        display: 'none',
                        'margin-left': '10px'
                    }
                });
                dlbtn.append(dltext);
                dlbtn.append(dlprogress);

                // Place button each time a new action panel appears (meaning navigating into a post page)
                let observer;
                detectDom({
                    selector: '.post__actions, .user-header__actions',
                    callback: action_panel => {
                        // Hide dlprogress, its content is still for previous page
                        dlprogress.style.display = 'none';

                        // Append to action panel
                        action_panel.append(dlbtn);

                        // Disconnect old observer
                        observer?.disconnect();

                        // Observe action panel content change, always put download button in last place
                        observer = detectDom({
                            root: action_panel,
                            selector: 'button',
                            callback: btn => btn !== dlbtn && action_panel.append(dlbtn)
                        });
                    }
                });

                return {
                    ConsoleUI,
                    dlbtn, dltext,
                    get ['selector']() { return selector; },
                    downloadCurrentPost, downloadCurrentCreator,
                    getCurrentPost, getCurrentCreator, getPageType
                }

                function userDownload() {
                    const page_type = getPageType();
                    const func = ({
                        post: downloadCurrentPost,
                        creator: downloadCurrentCreator
                    })[page_type] ?? function() {};
                    return func();
                }

                async function downloadCurrentPost() {
                    const post_info = getCurrentPost();
                    if (downloading) { return; }
                    if (!post_info) { return; }

                    try {
                        downloading = true;
                        dlprogress.style.display = 'inline';
                        dltext.innerText = CONST.Text.Downloading;
                        await downloader.downloadPost({
                            post: {
                                service: post_info.service,
                                creator_id: post_info.creator_id,
                                post_id: post_info.post_id,
                            },
                        });
                    } finally {
                        downloading = false;
                        dltext.innerText = CONST.Text.DownloadZip;
                    }
                }

                async function downloadCurrentCreator() {
                    const creator_info = getCurrentCreator();
                    if (downloading) { return; }
                    if (!creator_info) { return; }

                    try {
                        downloading = true;
                        Quasar.Loading.show({ message: CONST.Text.FetchingCreatorPosts });
                        const [profile, selected_posts] = await Promise.all([
                            api.Creators.profile(creator_info.service, creator_info.creator_id),
                            selectCreatorPosts(creator_info, () => Quasar.Loading.hide())
                        ]);
                        if (selected_posts) {
                            dlprogress.style.display = 'inline';
                            dltext.innerText = CONST.Text.Downloading;
                            await downloader.downloadPosts({
                                posts: selected_posts.map(post => ({
                                    service: creator_info.service,
                                    creator_id: creator_info.creator_id,
                                    post_id: post.id
                                })),
                                creator_data: profile,
                                filename: `${profile.name}.zip`
                            });
                        }
                    } finally {
                        downloading = false;
                        dltext.innerText = CONST.Text.DownloadZip;
                    }
                }

                async function downloadCustom() {
                    if (downloading) { return; }

                    try {
                        const post_info = getCurrentPost();
                        const creator_info = getCurrentCreator();
                        const info = post_info ?? creator_info ?? {};
                        const dl_info = await gui.panel.show({
                            download_type: post_info ? 'post' : (creator_info ? 'creator' : undefined),
                            service: info.service ?? undefined,
                            creator_id: info.creator_id ?? undefined,
                            post_id: info.post_id ?? undefined,
                            autoclose: false,
                        });
                        if (dl_info !== null) {
                            downloading = true;

                            if (dl_info.download_type === 'post') {
                                gui.panel.close();
                                await downloader.downloadPost({
                                    post: {
                                        service: dl_info.service,
                                        creator_id: dl_info.creator_id,
                                        post_id: dl_info.post_id,
                                    },
                                    config: {
                                        ext_filter: dl_info.ext_filter,
                                        ...dl_info.settings,
                                    }
                                });
                            } else if (dl_info.download_type === 'creator') {
                                gui.panel.loading = true;
                                Assert(creator_info !== null, 'dl_info.download_type === "creator" but creator_info is null', TypeError);
                                const [profile, selected_posts] = await Promise.all([
                                    api.Creators.profile(creator_info.service, creator_info.creator_id),
                                    selectCreatorPosts(creator_info, () => {
                                        gui.panel.loading = false;
                                        gui.panel.close();
                                    })
                                ]);
                                if (selected_posts) {
                                    dlprogress.style.display = 'inline';
                                    dltext.innerText = CONST.Text.Downloading;
                                    await downloader.downloadPosts({
                                        posts: selected_posts.map(post => ({
                                            service: creator_info.service,
                                            creator_id: creator_info.creator_id,
                                            post_id: post.id,
                                        })),
                                        config: {
                                            ext_filter: dl_info.ext_filter,
                                            ...dl_info.settings,
                                        },
                                        creator_data: profile,
                                        filename: `${profile.name}.zip`
                                    });
                                }
                            }
                        }
                    } finally {
                        downloading = false;
                        dltext.innerText = CONST.Text.DownloadZip;
                    }
                }

                /**
                 * User select creator's posts
                 * @param {CreatorInfo} creator_info
                 * @param {function} onAjaxLoad - callback when api ajax loaded
                 * @returns
                 */
                async function selectCreatorPosts(creator_info, onAjaxLoad=function() {}) {
                    const posts = await api.Custom.all_posts(creator_info.service, creator_info.creator_id);
                    typeof onAjaxLoad === 'function' && onAjaxLoad();
                    const selected_posts = await gui.selector.show({ posts });
                    return selected_posts;
                }

                /**
                 * @typedef {Object} PostInfo
                 * @property {string} service,
                 * @property {number} creator_id
                 * @property {number} post_id
                 */
                /**
                 * Get post info in current page
                 * @returns {PostInfo | null}
                 */
                function getCurrentPost() {
                    const regpath = /^\/([a-zA-Z]+)\/user\/(\d+)\/post\/(\w+)/;
                    const match = location.pathname.match(regpath);
                    if (!match) {
                        return null;
                    } else {
                        return {
                            service: match[1],
                            creator_id: parseInt(match[2], 10),
                            post_id: /\d+/.test(match[3]) ? parseInt(match[3], 10) : match[3]
                        }
                    }
                }

                /**
                 * @typedef {Object} CreatorInfo
                 * @property {string} service
                 * @property {number} creator_id
                 */
                /**
                 * Get creator info in current page
                 * @returns {CreatorInfo | null}
                 */
                function getCurrentCreator() {
                    const regpath = /^\/([a-zA-Z]+)\/user\/(\d+)/;
                    const match = location.pathname.match(regpath);
                    if (!match) {
                        return null;
                    } else {
                        return {
                            service: match[1],
                            creator_id: parseInt(match[2], 10)
                        }
                    }
                }

                /** @typedef { 'post' | 'creator' } page_type */
                /**
                 * @returns {page_type}
                 */
                function getPageType() {
                    const matchers = {
                        post: {
                            type: 'regpath',
                            value: /^\/([a-zA-Z]+)\/user\/(\d+)\/post\/(\w+)/
                        },
                        creator: {
                            type: 'func',
                            value: () => /^\/([a-zA-Z]+)\/user\/(\d+)/.test(location.pathname) && !location.pathname.includes('/post/')
                        },
                    }
                    for (const [type, matcher] of Object.entries(matchers)) {
                        if (FunctionLoader.testCheckers(matcher)) {
                            return type;
                        }
                    }
                }

                async function apiCurrentPost() {
                    const post_info = getCurrentPost();
                    return post_info ? await api.Posts.post(
                        post_info.service,
                        post_info.creator_id,
                        post_info.post_id
                    ) : null;
                }
            },
        }
    };
    const oFuncs = Object.entries(functions).reduce((arr, [id, oFunc]) => {
        oFunc.id = id;
        arr.push(oFunc);
        return arr;
    }, []);
    const pool = loadFuncs(oFuncs);
}) ();