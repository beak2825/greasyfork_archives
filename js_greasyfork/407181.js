// ==UserScript==
// @name         花瓣 - 添加下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.5.4
// @description  给花瓣的图加上“下载”按钮，方便下载
// @author       潘志城_Neo
// @match        *://huaban.com/*
// @match        *://hbimg.huabanimg.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      gd-hbimg.huaban.com
// @downloadURL https://update.greasyfork.org/scripts/407181/%E8%8A%B1%E7%93%A3%20-%20%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/407181/%E8%8A%B1%E7%93%A3%20-%20%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

;(function () {
    "use strict"

    // 所有图片
    var allImages = []
    // 按钮样式
    var btnStyleText =
        "border:0; color:#ffffff ;background-color: rgb(26 179 125 / 75%);border-radius:8px;padding:3px 12px;cursor:pointer;pointer-events:all;"
    var interval = null

    var defaultSetting = {
        prefix: "HB", // 前缀
        show_notification: true, // 是否显示通知消息
        rename: false, // 是否重命名
        show_source_img: false, // 是否显示大图
        show_img_title: false, // 是否显示图片标题
        download_type: "gm_download", // 下载方式
    }

    // 配置信息
    var setting = GM_getValue("setting")
    if (!setting) {
        setting = Object.assign({}, defaultSetting)
    } else {
        setting = Object.assign({}, defaultSetting, setting)
    }
    GM_setValue("setting", setting)

    // 主函数
    function main() {
        document.body.addEventListener("click", function (e) {
            // 点击img标签的时候才尝试添加下载按钮
            if ((e, e.target.tagName === "IMG")) {
                addDonwloadBtnToPreivew()
            }
        })
        // 网页滚动的时候，检测图片是否有添加下载按钮，没有就添加
        document.addEventListener("scroll", throttle(addDownloadBtn, 300))

        // 添加设置选项
        setSettingMenu()

        addDownloadBtn()
        interval = setInterval(() => {
            if (allImages.length === 0) {
                addDownloadBtn()
            } else {
                clearInterval(interval)
            }
        }, 1500)
    }
    main()

    /**
   * 添加设置选项
   */
    function setSettingMenu() {
        var menuCommandSetting = GM_registerMenuCommand(
            "设置",
            function (e) {
                addMenu()
            },
            "S"
        )
        }

    // 插入菜单到页面
    function addMenu() {
        var domMenu = document.getElementById("neo_huaban_menu")
        if (domMenu !== null) {
            return
        }
        domMenu = document.createElement("div")
        domMenu.id = "neo_huaban_menu"
        domMenu.style =
            "z-index:2333; width:252px; min-height:120px; display:flex; flex-direction: column; position:fixed; top:50%; left: 50%; transform:translate(-50%,-50%); border-radius:8px; overflow:hidden; background:white;box-shadow: 2px 2px 6px 1px #5668577a;"
        var domHtml = `
      <div class="title" style="padding:7px; text-align:center; background-color:#1AB37D;color:white;cursor:default;">
        设置
      </div>
      <div class="content" style="display: flex; flex-direction: column; padding:15px; flex:1;">
        <div>
          <div style="display:flex; align-items:center;">
            <div style="display:flex; align-items:center;">
              <span style="display: inline-block;">重命名</span>
              <input type="checkbox" style="margin-left:5px;cursor:pointer;" class="rename" ${
                setting.rename ? "checked" : ""
        }>
            </div>
            <div style="display:flex; align-items:center;">
              <span style="margin-left: 13px; outline: none;" >前缀</span>
              <input style="margin-left:5px; outline:none; width:100px; height: 50%; border-radius: 4px; border: 1px solid #adadadd1;" class="prefix" value="${
                setting.prefix
        }">
            </div>
          </div>
          <div style="font-size: 0.8em; color: #7a7a7a; margin-left: 20px;">
            <div >格式：前缀-年月日-pid</div>
            <div>示例：HB-20230216-<a title="https://huaban.com/pins/5073719443=>最后那串数字就是pid" href="https://huaban.com/pins/5073719443" target="_blank">5073719443</a></div>
          </div>
        </div>
        <div style="height:1px; width:100%; background: #cdd3ce47; margin: 7px;"></div>
        <div>
          <div style="display:flex; align-items:center;">
            <span style="display: inline-block;">显示提示信息</span>
            <input type="checkbox" style="margin-left:5px;cursor:pointer;" class="show_notification" ${
              setting.show_notification ? "checked" : ""
        }>
          </div>
          <div style="font-size: 0.8em; color: #7a7a7a; margin-left: 20px;">
            <div>只在360极速浏览器有用。</div>
          </div>
        </div>
        <div style="height:1px; width:100%; background: #cdd3ce47; margin: 7px;"></div>
        <div style="display:flex; align-items:center;">
            <span style="display: inline-block;">显示大图按钮</span>
            <input type="checkbox" style="margin-left:5px;cursor:pointer;" class="show_source_img" ${
              setting.show_source_img ? "checked" : ""
        }>
        </div>
        <div style="height:1px; width:100%; background: #cdd3ce47; margin: 7px;"></div>
        <div style="display:flex; align-items:center;">
            <span style="display: inline-block;">显示图片标题</span>
            <input type="checkbox" style="margin-left:5px;cursor:pointer;" class="show_img_title" ${
              setting.show_img_title ? "checked" : ""
        }>
        </div>
        <div style="height:1px; width:100%; background: #cdd3ce47; margin: 7px;"></div>
        <div style="display:flex; align-items:center;">
            <span style="display: inline-block;margin-right:5px;">下载方式</span>
            <select class="download_type">
              <option value="gm_download" ${
                setting.download_type === "gm_download" ? "selected" : ""
        }>gm_download</option>
              <option value="fetch" ${setting.download_type} ${
                setting.download_type === "fetch" ? "selected" : ""
        } >fetch</option>
              <option value="xhr" ${
                setting.download_type === "xhr" ? "selected" : ""
        }>xhr</option>
               <option value="xmlhttpRequest" ${
                setting.download_type === "xmlhttpRequest" ? "selected" : ""
        }>xmlhttpRequest</option>
            </select>
        </div>
        <div style="color: #7a7a7a; text-align: center; margin-top: 8px;">
            <span>刷新页面后生效</span>
            <span class="reload_window" style="background-color: #1ab37d; color: white; border-radius: 5px; padding: 2px 6px 3px; cursor: pointer;">立即刷新</span>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; text-align: center; background-color: #ebebeb; color: #333; cursor: pointer; align-items: center;">
          <div class="reset" style="width:50%; text-align:center;">重置设置</div>
          <div class="close" style="width:50%; text-align:center; background-color:#d0d0d0;">
            关闭
          </div>
      </div>
      `
    domMenu.innerHTML = domHtml
        document.body.appendChild(domMenu)

        // 设置-添加事件
        document
            .querySelector("#neo_huaban_menu .content .rename")
            .addEventListener("change", function (e) {
            if (e.target.checked) {
                e.target.removeAttribute("checked")
                setting.rename = true
            } else {
                e.target.setAttribute("checked", true)
                setting.rename = false
            }
            GM_setValue("setting", setting)
        })
        // 关闭按钮
        document
            .querySelector("#neo_huaban_menu .close")
            .addEventListener("click", function (e) {
            removeMenu()
        })

        // 修改前缀
        var dom_prefix = document
        .querySelector("#neo_huaban_menu .prefix")
        .addEventListener("change", function (e) {
            setting.prefix = dom_prefix.value
            GM_setValue("setting", setting)
        })

        // 显示通知消息
        document
            .querySelector("#neo_huaban_menu .content .show_notification")
            .addEventListener("change", function (e) {
            if (e.target.checked) {
                e.target.removeAttribute("checked")
                setting.show_notification = true
            } else {
                e.target.setAttribute("checked", true)
                setting.show_notification = false
            }
            GM_setValue("setting", setting)
        })

        // 显示大图
        document
            .querySelector("#neo_huaban_menu .content .show_source_img")
            .addEventListener("change", function (e) {
            if (e.target.checked) {
                e.target.removeAttribute("checked")
                setting.show_source_img = true
            } else {
                e.target.setAttribute("checked", true)
                setting.show_source_img = false
            }
            GM_setValue("setting", setting)
        })

        // 显示图片标题
        document
            .querySelector("#neo_huaban_menu .content .show_img_title")
            .addEventListener("change", function (e) {
            if (e.target.checked) {
                e.target.removeAttribute("checked")
                setting.show_img_title = true
            } else {
                e.target.setAttribute("checked", true)
                setting.show_img_title = false
            }
            GM_setValue("setting", setting)
        })

        // 修改下载方式
        var dom_download_type = document.querySelector(
            "#neo_huaban_menu .download_type"
        )
        addEventListener("change", function (e) {
            setting.download_type = dom_download_type.value
            GM_setValue("setting", setting)
        })

        // 重置设置
        document
            .querySelector("#neo_huaban_menu .reset")
            .addEventListener("click", function (e) {
            setting = Object.assign({}, defaultSetting)
            GM_setValue("setting", setting)
        })
        // 立即刷新
        document
            .querySelector("#neo_huaban_menu .reload_window")
            .addEventListener("click", function (e) {
            location.reload();
        })
    }

    // 从页面中移除菜单
    function removeMenu() {
        var domMenu = document.getElementById("neo_huaban_menu")
        if (domMenu) {
            domMenu.remove()
        }
    }

    /**
   * 添加下载按钮(如果有按钮，就不添加)
   */
    function addDownloadBtn() {
        // if(document.URL.includes('discovery') || document.URL.includes('domains') || document.URL.includes('boards') || document.URL.includes('follow') || document.URL.includes('search')){
        //     addDownloadBtnToDiscovery()
        // }
        if (document.URL.includes("pins")) {
            addDonwloadBtnToPreivew()
        } else {
            if (!document.URL.includes("user")) {
                addDownloadBtnToDiscovery()
            }
        }
    }

    function addDownloadBtnToDiscovery() {
        allImages = document.querySelectorAll(
             ".transparent-img-bg.hb-image"
        )
        allImages.forEach((dom) => {
            var pinInfo = dom.parentNode.href.split("/")
            // 图片标题和样式
            var imgInfo = {
                title: dom.getAttribute("alt"),
                src: dom.getAttribute("src"),
                pin: pinInfo[pinInfo.length - 1],
            }
            // 和包含图片的a标签同级的节点
            var tempList = dom.parentNode.parentNode.childNodes
            // 图片dom
            var imgNode = tempList[tempList.length - 1]
            // 与图片父级a标签同级，并处于上方的元素
            var lookNode = tempList[tempList.length - 2]

            lookNode.setAttribute("hidden", true)
            lookNode.className = ""
            lookNode.style.cssText =
                "position: absolute;bottom: 8px; right: 8px; display: flex; flex-direction: row;align-items: center;z-index:1"
            // 添加鼠标悬停时的样式
            lookNode.parentNode.addEventListener("mouseover", function () {
                lookNode.removeAttribute("hidden")
            })

            // 移除鼠标悬停时的样式
            lookNode.parentNode.addEventListener("mouseout", function () {
                lookNode.setAttribute("hidden", true)
            })
            if (lookNode.querySelectorAll(".neo_add").length === 0) {
                var btnContainer = document.createElement("div")
                btnContainer.style = "display:flex;"

                if (setting.show_source_img) {
                    // 添加打开大图按钮
                    var sourceBtn = document.createElement("div")
                    sourceBtn.className = "neo_add_source"
                    sourceBtn.innerText = "大图"
                    sourceBtn.addEventListener("click", () => {
                        window.open(imgInfo.src.replace("_fw240webp", ""))
                    })

                    sourceBtn.style.cssText = btnStyleText + "margin-left:3px;"
                    btnContainer.appendChild(sourceBtn)
                }
                // 添加下载图片按钮
                var downloadBtn = document.createElement("div")
                downloadBtn.className = "neo_add"
                downloadBtn.innerText = "下载"
                downloadBtn.addEventListener("click", () => {
                    downloadImage(imgInfo)
                })

                downloadBtn.style.cssText = btnStyleText + "margin-left:3px;"
                btnContainer.appendChild(downloadBtn)
                lookNode.insertBefore(btnContainer, null)
                // 添加图片标题
                if (setting.show_img_title) {
                    var domTitle = document.createElement("div")
                    domTitle.innerText = imgInfo.title
                    domTitle.title = imgInfo.title
                    domTitle.style.cssText =
                        "padding-left:5px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden; color: rgba(30,32,35,.65);height:3em;"
                    dom.parentNode.parentNode.parentNode.appendChild(domTitle)
                }
            }
        })
    }
    function addDonwloadBtnToPreivew() {
        var newBtn = document.createElement("button")
        newBtn.innerText = "下载"
        newBtn.style.cssText = btnStyleText + "border-radius:12px;padding:9px 12px;"
        newBtn.className = "neo_add_btn"
        newBtn.addEventListener("click", function () {
            download()
        })

        function download() {
            var imgDom = document.querySelector("#pin_detail div img")
            var pinInfo = document.URL.split("/")
            var imgInfo = {}
            imgInfo.title = imgDom.alt
            imgInfo.src = imgDom.src
            imgInfo.pin = pinInfo[pinInfo.length - 1]
            downloadImage(imgInfo)
        }
        var count = 0 // 尝试添加下载按钮的次数
        var maxCount = 8 // 最大尝试次数
        var interval = setInterval(function () {
            var btnDom = document.querySelector("#pin_detail div button")
            if (btnDom) {
                clearInterval(interval)
                var neoAddDom = document.querySelector(
                    "#pin_detail div button.neo_add_btn"
                )
                // 如果存在就不继续添加了
                if (neoAddDom) {
                    return
                }
                btnDom.parentNode.appendChild(newBtn)
            }
            if (count >= maxCount) {
                clearInterval(interval)
            } else {
                count++
            }
        }, 1000)
        }

    /**
   * 下载图片
   * @param {Object} imgInfo src：图片链接; title：图片标题
   */
    function downloadImage(imgInfo) {
        //替换文件名中不能有的字符
        var sign_list = ["\\*", "\\'", '\\"', "<", ">", "\\?", "\\.", "\\|", "\\/"]
        for (var i = 0; i < sign_list.length; i++) {
            var reg = "/" + sign_list[i] + "/g"
            var title = imgInfo.title
            if (title) {
                imgInfo.title = imgInfo.title.replace(eval(reg), "_")
            } else {
                imgInfo.title = "无标题"
            }
        }

        imgInfo.src = imgInfo.src.replace(/_fw240.*/, "")
        imgInfo.src = imgInfo.src.replace(/_fw658.*/, "")
        var imgTitle = imgInfo.title
        if (setting.rename) {
            imgTitle =
                (setting.prefix ? setting.prefix + "-" : "") +
                formatDate(new Date()) +
                "-" +
                imgInfo.pin
        }
        show_notification({
            text: imgTitle,
            title: "图片已添加下载",
            timeout: 2000,
        })
        switch (setting.download_type) {
            case "gm_download":
                imageDownload_with_gm_download(imgInfo.src, imgTitle)
                break
            case "fetch":
                imageDownload_with_fetch(imgInfo.src, imgTitle)
                break
            case "xhr":
                imageDownload_with_Xhr_download(imgInfo.src,imgTitle)
                break
            case "xmlhttpRequest":
                imageDownload_with_xmlhttpRequest_download(imgInfo.src,imgTitle)
                break
            default:
                imageDownload_with_Xhr_download(imgInfo.src, imgTitle)
                break
        }

    }

    function show_notification(item) {
        if (setting.show_notification) {
            GM_notification(item)
        }
    }
    function throttle(cb, wait = 300) {
        var last = 0
        return function () {
            var now = new Date().getTime()
            if (now - last > wait) {
                cb.call(this)
                last = new Date().getTime()
            }
        }
    }

    //格式化时间
    function formatDate(dat) {
        //获取年月日，时间
        var year = dat.getFullYear()
        var mon =
            dat.getMonth() + 1 < 10 ? "0" + (dat.getMonth() + 1) : dat.getMonth() + 1
        var data = dat.getDate() < 10 ? "0" + dat.getDate() : dat.getDate()
        var newDate = year + mon + data
        return newDate
    }

    /**
   * 用fecth下载图片
   */
    function imageDownload_with_fetch(src, title) {
        fetch(src)
            .then((response) => response.blob())
            .then((blob) => {
            // 2. 创建Blob对象

            // 3. 创建URL
            const url = URL.createObjectURL(blob)

            // 4. 创建下载链接
            const a = document.createElement("a")
            a.href = url
            a.download = title

            // 5. 模拟点击下载
            document.body.appendChild(a)
            a.click()

            // 清理创建的URL对象
            URL.revokeObjectURL(url)
            document.body.removeChild(a)
        })
            .catch((error) => {
            //下载出错，右下角弹窗通知。
            show_notification({
                text: title + "\n" + error,
                title: "下载出错",
                timeout: 5000,
            })
            console.error(error)
        })

    }

    /**
   * 用GM_download 下载图片
   */
    function imageDownload_with_gm_download(src, title) {
        //启用油猴的增强下载函数，可跨域
        GM_download({
            url: src,
            name: title,
            onprogress: function () {
                if (setting.show_notification) {
                    var isNotice = false
                    return function () {
                        if (!isNotice) {
                            show_notification({
                                text: title,
                                title: "图片已添加下载",
                                timeout: 2000,
                            })
                            isNotice = true
                        }
                    }
                }
            },
            onload: function () {
                //下载完成之后，右下角弹窗通知。
                show_notification({
                    text: title,
                    title: "图片已完成下载",
                    timeout: 5000,
                })
            },
            onerror: function () {
                //下载出错，右下角弹窗通知。
                show_notification({
                    text: title + "\n" + imgInfo.src,
                    title: "下载出错",
                    timeout: 5000,
                })
                console.error(error)
            },
        })
    }
    /**
    * 用原始的ajax方法下载
    */
    function imageDownload_with_Xhr_download(src,title) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
            if (xhr.status === 200) {
                // 创建一个Blob对象
                var blob = xhr.response;
                // 创建一个URL对象
                var url = window.URL.createObjectURL(blob);
                // 创建一个下载链接
                var a = document.createElement('a');
                a.href = url;
                a.download = title;
                // 将链接添加到页面并模拟点击进行下载
                document.body.appendChild(a);
                a.click();
                // 释放URL对象
                window.URL.revokeObjectURL(url);
                a.remove()
            }
        };
        // 错误处理
        xhr.onerror = function() {
            //下载出错，右下角弹窗通知。
            show_notification({
                text: title + "\n" + src,
                title: "下载出错",
                timeout: 5000,
            })
            console.error(error)
        };

        xhr.send();
    }

    /**
    * 用 GM_xmlhttpRequest 方式下载
    */
    function imageDownload_with_xmlhttpRequest_download(src,title){
        GM_xmlhttpRequest({
            method: 'GET',
            url: src,
            responseType: 'blob',
            onload: function(response) {
                const blob = new Blob([response.response], {type: response.response.type});
                const contentType = response.response.type;
                let extension = '';

                // 根据内容类型确定扩展名
                switch(contentType) {
                    case 'image/jpeg':
                        extension = '.jpg';
                        break;
                    case 'image/png':
                        extension = '.png';
                        break;
                    case 'image/gif':
                        extension = '.gif';
                        break;
                    default:
                        extension = '.jpg'; // 默认使用 .jpg
                }

                // 创建下载链接并添加扩展名
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = title + extension;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            },
            onerror: function(error) {
                //下载出错，右下角弹窗通知。
                show_notification({
                    text: title + "\n" + imgInfo.src,
                    title: "下载出错",
                    timeout: 5000,
                })
                console.error(error)
            }
        });
    }
})()
