// ==UserScript==
// @name         图片下载器
// @namespace    http://tampermonkey.net/
// @version      3.5.1
// @description  批量下载图片，一个可扩展的图片下载器。
// @author       Gscsd
// @include        *
// @icon         data:image/jpeg;base64,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
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @connect      *
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.js
// @run-at       document-end
// @noframes
// @compatible	 Chrome
// @compatible	 Edge
// @downloadURL https://update.greasyfork.org/scripts/439858/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/439858/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function depthTest(fa, a) {
        let sum = 0;
        while (1) {
            if (a === fa) break;
            a = $(a).parent()[0];
            sum++;

        }
        return sum
    }

    function FindBrothers(a) {
        let par = $(a).parent()[0], sea = $(par).find('img').toArray();
        if (sea.length === 1) return FindBrothers(par)
        else {
            let depth = depthTest(par, getimg), sea1 = [];
            sea.forEach((item) => {
                if (depthTest(par, item) === depth) sea1.push(item)
            })
            sea = sea1;
            if (sea.length === 1) return FindBrothers(par);
            return sea
        }
    }

    class TaskQueue {
        downloadIndex = 0;
        retryIndex = 0;
        results = [];
        transfer = [];
        error = [];
        //0未下载 1下载排队中 2下载排队完成，等待中 3下载成功 4下载失败 5下载完成
        downloadStatus = 0

        /**
         * @description 图片下载类
         * @class
         * @constructor
         * @param {Object} o 配置对象
         * @param {Array} o.imglist 图片下载链接列表
         * @param {number=} [o.thread=20] 启用下载线程数
         * @param {number=} [o.retryNum = 3] 下载出错，重试次数
         * @param {Object=} [o.headers = {}] 图片请求头
         * @param {string=} [o.downloadMode = "Zip"] 下载模式，Epub下载需配置扩展名白名单
         * @param {string=} [o.author ="佚名"] 作者，生成Epub会用到
         * @param {string=} o.filename 文件名，不包含拓展名
         * @param {number=} o.timeout 请求超时，默认1min
         * @param {Boolean=} [o.autoRetry = false] 自动重试
         * @param {Boolean=} [o.autoDownload = false] 重试失败后自动下载
         * @param {?Function=} [o.onload = null] 成功回调
         * @param {?Function=} [o.onerror = null] 失败回调
         * @return {null}
         */
        constructor(o) {
            if ($('#v_bar').length) {
                GM_notification({text: '下载中,请稍等...', timeout: 3000})
                return
            }
            ({
                imglist: this.queue = [],
                thread: this.thread = 20,
                retryNum: this.retryNum = 3,
                headers: this.headers = {},
                downloadMode: this.downloadMode = "Zip",
                author: this.author = "佚名",
                filename: this.filename = document.title.replace(/- .*?$/, '').trim(),
                timeout: this.timeout = 60 * 1000,
                autoRetry: this.autoRetry = false,
                autoDownload: this.autoDownload = false,
                onload: this.onload = null,
                onerror: this.onerror = null
            } = o);
            this.progressList = Array(this.queue.length)
            $('body').append(`<div id="v_bar"><div></div></div>`)
            $('head').append(`<style>
            #v_bar{
                width: 1%;
                height: 80%;
                background-color: #00ffff;
                position: fixed;
                top: 50%;
                left: 0;
                z-index: 999999999;
                transform: translate(0,-50%);
            }
            #v_bar>div{
                height: 100%;
                background-color: #8c939d;
            }
            </style>`)
            GM_notification({text: '开始下载', title: this.filename, timeout: 3000})
            this.downloadStart()
        }

        // 下载开始
        downloadStart() {
            this.downloadStatus = 1;
            let download = () => {
                let index = this.downloadIndex
                if (!this.transfer[index] || ($.inArray(index, this.error) > -1 && this.error.shift() + 1)) {
                    this.downloadIndex < this.queue.length - 1 && this.downloadIndex++
                    this.transfer[index] = Promise.race([new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: this.queue[index],
                            headers: this.headers,
                            responseType: "blob",
                            timeout: this.timeout,
                            onload: r => {
                                if (r.readyState === 4 && r.status === 200) {
                                    resolve(r.response)
                                } else {
                                    reject(new Blob([], {type: "image/jpeg"}))
                                }
                                this.judgeFinish(download)
                            },
                            onprogress: xhr => {
                                if (xhr.lengthComputable) {
                                    this.progressList[index] = xhr.loaded / xhr.total * 100;
                                    this.progressBar()
                                }
                            },
                            onerror: _ => {
                                reject(new Blob([], {type: "image/jpeg"}))
                                this.judgeFinish(download)
                            }
                        });
                    }), new Promise((_, reject) => {
                        setTimeout(reject, this.timeout, new Blob([], {type: "image/jpeg"}))
                    })])
                } else {
                    //快速跳过
                    this.downloadIndex < this.queue.length - 1 && this.downloadIndex++ && download()
                }
            }
            // 建立多少个线程
            let thread = [this.thread, this.queue.length];
            //重试则按出错数开启线程
            this.error.length > 0 ? thread.push(this.error.length) : null
            for (let i = 0; i < Math.min(...thread); i++) {
                download(i)
            }
        }

        //判断队列是否完成，并进行后续处理
        judgeFinish(callback) {
            //当下载列表已遍历完成，检验是否每段都下载成功
            if (this.queue.length === this.transfer.length && this.error.length === 0) {
                if (this.downloadStatus !== 1) return
                this.downloadStatus = 2;
                //下载状态改变
                Promise.allSettled(this.transfer).then(all => {
                    all.forEach((item, index) => {
                        if (item.status === "rejected") {
                            this.progressList[index] = 0
                            this.error.push(index)
                        }
                    })
                    //下载出错，尝试重新下载
                    if (this.error.length > 0) {
                        let choice = !this.retryIndex && !this.autoRetry && confirm(`${this.error.length}张图片下载出错。强行打包下载？尝试重新下载？`)
                        if (choice) {
                            this.downloadStatus = 3;
                            this.results = all.map(one => one.value || one.reason);
                            this[this.downloadMode]()
                            return
                        }
                        if (this.retryIndex === this.retryNum) {
                            GM_notification({text: '下载失败', title: this.filename, timeout: 3000})
                            GM_log('下载失败')
                            let choice1 = this.autoDownload || confirm(`重试5次下载失败。强行打包下载？放弃下载？`)
                            if (choice1) {
                                this.downloadStatus = 3;
                                this.results = all.map(one => one.value || one.reason);
                                this[this.downloadMode]()
                            } else {
                                this.downloadStatus = 4
                                $('#v_bar').remove()
                                this.onerror && this.onerror()
                            }

                        } else !choice && this.retryAll()
                    }
                    //下载成功
                    else {
                        this.downloadStatus = 3;
                        this.results = all.map(one => one.value);
                        this[this.downloadMode]()
                    }
                })

            } else callback && callback()

        }

        retryAll() {
            this.downloadIndex = 0;
            this.retryIndex++
            this.downloadStart()
        }

        //进度条
        progressBar() {
            let all = 0
            this.progressList.forEach(item => {
                all += item || 0
            })
            $('#v_bar>div').height((100 - all / this.progressList.length).toFixed(2) + '%')
            return 1
        }


        //处理非法文件名称
        legalize(str) {
            let pattern = new RegExp("[\\\\:<>/?*|]"), rs = "";
            for (let i = 0; i < str.length; i++) {
                rs += str.substr(i, 1).replace(pattern, '');
            }
            return rs.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");
            //const invalidchar = `~!@#$%^&*，。；‘’\\{【】[]}|`;
        }

        //下载
        Download(content, file_extension) {
            let blob_url = URL.createObjectURL(content)
            // 重置进度条状态
            this.progressList.fill(0) && this.progressBar() && $('#v_bar').css("background-color", "#e0e052")
            GM_download({
                url: blob_url,
                name: this.legalize(this.filename) + file_extension,
                onload: _ => {
                    $('#v_bar').remove()
                    GM_notification({text: '下载成功', title: this.filename, timeout: 3000})
                    GM_log('下载成功')
                    this.downloadStatus = 5;
                    URL.revokeObjectURL(blob_url)
                    this.onload && this.onload()
                },
                onprogress: r => {
                    if (r.lengthComputable) {
                        this.progressList.fill(r.loaded / r.total * 100);
                        this.progressBar()
                    }
                },
                onerror: _ => {
                    $('#v_bar').remove()
                    GM_notification({text: '下载至本地失败', title: this.filename, timeout: 3000})
                    GM_log('下载至本地失败')
                    this.downloadStatus = 5;
                    URL.revokeObjectURL(blob_url)
                    this.onerror && this.onerror()
                }
            });
        }

        //Zip打包下载
        Zip() {
            let zip = new JSZip(), num = this.queue.length.toString().length;
            this.results.forEach((content, index) => {
                // 重置进度条状态
                !index && this.progressList.fill(0) && this.progressBar() && $('#v_bar').css("background-color", "red")
                //处理可能无content type情况
                let img_type=content.type||"image/jpeg"
                let name = `${(index + 1).toString().padStart(num, '0')}.${img_type.split('/')[1].replace('jpeg', 'jpg')}`
                zip.file(name, content, {blob: true});
                zip.file(name).async("blob", metadata => {
                    this.progressList[index] = metadata.percent;
                    this.progressBar()

                })
            })
            zip.generateAsync({type: "blob"}).then(content => this.Download(content, '.zip'));
        }

        //Epub打包下载
        Epub() {
            let epub = new JSZip(), num = this.queue.length.toString().length;
            //指定文件类型
            epub.file('mimetype', 'application/epub+zip');
            //container文件
            epub.file('META-INF/container.xml', `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
   <rootfiles>
      <rootfile full-path="OEBPS/metadata.opf" media-type="application/oebps-package+xml"/>
   </rootfiles>
</container>`);
            //配置元数据
            let uuid = URL.createObjectURL(new Blob()).split('/').reverse()[0];
            let metadata = `<?xml version="1.0"  encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uuid_id" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${this.filename}</dc:title>
    <dc:creator opf:role="aut" opf:file-as="${this.author}">${this.author}</dc:creator>
    <dc:identifier opf:scheme="uuid" id="uuid_id">${uuid}</dc:identifier>
    <dc:contributor opf:file-as="GSCSD" opf:role="bkp">GSCSD</dc:contributor>
    <dc:publisher>GSCSD</dc:publisher>
    <dc:date>${new Date().toISOString()}</dc:date>
    <dc:language>zh</dc:language>
    <meta name="cover" content="cover"/>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="main" href="main.html" media-type="application/xhtml+xml"/>
    ${this.results.map((content, index) => {
                let id = (index + 1).toString().padStart(num, '0'),
                    type_name = content.type.split('/')[1].replace('jpeg', 'jpg')
                return `<item id="image${id}" href="Images/${id}.${type_name}" media-type="${content.type}"/>`
            }).join('\n    ')}
    <item id="cover" href="Images/${(1).toString().padStart(num, '0')}.${this.results[0].type.split('/')[1].replace('jpeg', 'jpg')}" media-type="image/jpeg"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="main"/>
   </spine>
</package>
`
            epub.file('OEBPS/metadata.opf', metadata);
            //配置目录
            let toc = `<?xml version='1.0' encoding='utf-8'?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="zh">
  <head>
    <meta name="dtb:uid" content="${uuid}"/>
    <meta name="dtb:depth" content="2"/>
    <meta name="dtb:generator" content="GSCSD"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${this.filename}</text>
  </docTitle>
  <navMap>
    <navPoint id="num_1" playOrder="1">
      <navLabel>
        <text>图片 ${this.results.length}P</text>
      </navLabel>
      <content src="main.html"/>
    </navPoint>
  </navMap>
</ncx>
    `
            epub.file('OEBPS/toc.ncx', toc);
            //配置主html
            let html = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>图片页</title>
    <style>
    img{
        width: 100%;
            }
    </style>
</head>
<body>
<div>
    ${this.results.map((content, index) => {
                let id = (index + 1).toString().padStart(num, '0'),
                    type_name = content.type.split('/')[1].replace('jpeg', 'jpg')
                return `<img src="Images/${id}.${type_name}" alt="加载失败">`
            }).join('\n    ')}
</div>
</body>
</html>`
            epub.file('OEBPS/main.html', html);
            this.results.forEach((content, index) => {
                // 重置进度条状态
                !index && this.progressList.fill(0) && this.progressBar() && $('#v_bar').css("background-color", "red")
                //处理可能无content type情况
                let img_type=content.type||"image/jpeg"
                let name = `OEBPS/Images/${(index + 1).toString().padStart(num, '0')}.${img_type.split('/')[1].replace('jpeg', 'jpg')}`
                epub.file(name, content, {blob: true});
                epub.file(name).async("blob", metadata => {
                    this.progressList[index] = metadata.percent;
                    this.progressBar()

                })
            })
            epub.generateAsync({type: "blob"}).then(content => this.Download(content, '.epub'));
        }

    }

    unsafeWindow.TaskQueue = TaskQueue;

    function add_listener() {
        let el_list = [];
        document.querySelectorAll("img").forEach(img => {
            let a_el = $(img).parents('a'), click_el = a_el.length ? a_el[0] : img
            el_list.push(click_el)
            //先移除之前事件监听
            $(click_el).off('click').click(e => {
                // e.stopImmediatePropagation()
                if ($('#v_bar').length) {
                    GM_notification({text: '下载中,请稍等...', timeout: 3000})
                    return
                }
                window.getimg = e.target;
                // let imglist, width = [], height = [];
                let imglist = FindBrothers(e.target).map((one, index) => {
                    //[width[index], height[index]] = [one.naturalWidth, one.naturalHeight]
                    return one.src
                });
                let len = imglist.length;
                if (len === 0) return;
                if (confirm(`下载全部${len}张图片?`)) new TaskQueue({imglist: imglist})
            });
        })
        return el_list

    }

    //重生成元素，去除事件监听绝杀无解
    function remake(el) {
        let parent = $(el).parent(), next = $(el).next(), html = el.outerHTML;
        $(el).remove();
        next.length ? $(next).before(html) : $(parent).append(html)
    }

    //1.a标签新窗口打开
    $('a').attr("target", "_blank")
    //2.移除onclick属性，主流网站基本弃用
    $("[onclick]").removeAttr("onclick");
    add_listener();
    //3.尝试移除图片上事件监听
    GM_registerMenuCommand("绝招，启用后再点试试！", _ => {
        let els = add_listener();
        els.forEach(el => remake(el));
        add_listener()
    });
    //4.直接重构除script的整个body，釜底抽薪
    GM_registerMenuCommand("终招，启用后再点试试！", _ => {
        document.querySelectorAll('body>*:not(script)').forEach(el => remake(el))
        add_listener()
    });
    //循环添加图片监听，为动态加载图片而准备
    setInterval(add_listener, 2000)
})();
