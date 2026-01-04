// ==UserScript==
// @name         HyReadEPUBV2
// @namespace    https://qinlili.bid
// @version      0.2.2
// @description  适配新版
// @author       琴梨梨
// @match        https://service.ebook.hyread.com.tw/ebookservice/epubreader/hyread/v3/openbook2.jsp?*
// @icon         https://webcdn2.ebook.hyread.com.tw/Template/store/favicon/favicon.ico
// @grant        none
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js#sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==
// @require      https://lib.baomitu.com/forge/0.10.0/forge.all.min.js#sha512-vD/QEI4MRcUFkosDvj9l/W20cvpkM5zSLPbWUqwscPySsicOTwapvHLHCQ1k8CCufi+1nOEJlENsAwQJNIygbg==
// @require      https://lib.baomitu.com/jszip/3.10.1/jszip.min.js#sha512-XMVd28F1oH/O71fzwBnV7HucLxVwtxf26XV8P4wPk26EDxuGZ91N8bsOttmnomcCD3CS5ZMRL50H0GgOHvegtg==
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js
// @license      MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/449872/HyReadEPUBV2.user.js
// @updateURL https://update.greasyfork.org/scripts/449872/HyReadEPUBV2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //CODENAME:SALMON
    //初始化依赖
    const SakiProgress = {
        isLoaded: false,
        progres: false,
        pgDiv: false,
        textSpan: false,
        first: false,
        alertMode: false,
        init: function (color) {
            if (!this.isLoaded) {
                this.isLoaded = true;
                console.info("SakiProgress Initializing!\nVersion:1.0.4\nQinlili Tech:Github@qinlili23333");
                this.pgDiv = document.createElement("div");
                this.pgDiv.id = "pgdiv";
                this.pgDiv.style = "z-index:9999;position:fixed;background-color:white;min-height:32px;width:auto;height:32px;left:0px;right:0px;top:0px;box-shadow:0px 2px 2px 1px rgba(0, 0, 0, 0.5);transition:opacity 0.5s;display:none;";
                this.pgDiv.style.opacity = 0;
                this.first = document.body.firstElementChild;
                document.body.insertBefore(this.pgDiv, this.first);
                this.first.style.transition = "margin-top 0.5s"
                this.progress = document.createElement("div");
                this.progress.id = "dlprogress"
                this.progress.style = "position: absolute;top: 0;bottom: 0;left: 0;background-color: #F17C67;z-index: -1;width:0%;transition: width 0.25s ease-in-out,opacity 0.25s,background-color 1s;"
                if (color) {
                    this.setColor(color);
                }
                this.pgDiv.appendChild(this.progress);
                this.textSpan = document.createElement("span");
                this.textSpan.style = "padding-left:4px;font-size:24px;";
                this.textSpan.style.display = "inline-block"
                this.pgDiv.appendChild(this.textSpan);
                var css = ".barBtn:hover{ background-color: #cccccc }.barBtn:active{ background-color: #999999 }";
                var style = document.createElement('style');
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                document.getElementsByTagName('head')[0].appendChild(style);
                console.info("SakiProgress Initialized!");
            } else {
                console.error("Multi Instance Error-SakiProgress Already Loaded!");
            }
        },
        destroy: function () {
            if (this.pgDiv) {
                document.body.removeChild(this.pgDiv);
                this.isLoaded = false;
                this.progres = false;
                this.pgDiv = false;
                this.textSpan = false;
                this.first = false;
                console.info("SakiProgress Destroyed!You Can Reload Later!");
            }
        },
        setPercent: function (percent) {
            if (this.progress) {
                this.progress.style.width = percent + "%";
            } else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        clearProgress: function () {
            if (this.progress) {
                this.progress.style.opacity = 0;
                setTimeout(function () { SakiProgress.progress.style.width = "0%"; }, 500);
                setTimeout(function () { SakiProgress.progress.style.opacity = 1; }, 750);
            } else {
                console.error("Not Initialized Error-Please Call `init` First!")
            }
        },
        hideDiv: function () {
            if (this.pgDiv) {
                if (this.alertMode) {
                    setTimeout(function () {
                        SakiProgress.pgDiv.style.opacity = 0;
                        SakiProgress.first.style.marginTop = "";
                        setTimeout(function () {
                            SakiProgress.pgDiv.style.display = "none";
                        }, 500);
                    }, 3000);
                } else {
                    this.pgDiv.style.opacity = 0;
                    this.first.style.marginTop = "";
                    setTimeout(function () {
                        SakiProgress.pgDiv.style.display = "none";
                    }, 500);
                }
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        showDiv: function () {
            if (this.pgDiv) {
                this.pgDiv.style.display = "";
                setTimeout(function () { SakiProgress.pgDiv.style.opacity = 1; }, 10);
                this.first.style.marginTop = (this.pgDiv.clientHeight + 8) + "px";
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        setText: function (text) {
            if (this.textSpan) {
                if (this.alertMode) {
                    setTimeout(function () {
                        if (!SakiProgress.alertMode) {
                            SakiProgress.textSpan.innerText = text;
                        }
                    }, 3000);
                } else {
                    this.textSpan.innerText = text;
                }
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        setTextAlert: function (text) {
            if (this.textSpan) {
                this.textSpan.innerText = text;
                this.alertMode = true;
                setTimeout(function () { this.alertMode = false; }, 3000);
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        setColor: function (color) {
            if (this.progress) {
                this.progress.style.backgroundColor = color;
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        addBtn: function (img) {
            if (this.pgDiv) {
                var btn = document.createElement("img");
                btn.style = "display: inline-block;right:0px;float:right;height:32px;width:32px;transition:background-color 0.2s;"
                btn.className = "barBtn"
                btn.src = img;
                this.pgDiv.appendChild(btn);
                return btn;
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        removeBtn: function (btn) {
            if (this.pgDiv) {
                if (btn) {
                    this.pgDiv.removeChild(btn);
                }
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        }
    };
    const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
    const dlFile = (link, name) => {
        let eleLink = document.createElement('a');
        eleLink.download = name;
        eleLink.style.display = 'none';
        eleLink.href = link;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    };


    SakiProgress.init();
    SakiProgress.showDiv();
    SakiProgress.setText("正在等待密钥...");
    let key = false;
    let dlHyRead = async (key, url) => {
        //开始下载
        await sleep(100);
        let fileList = [];
        SakiProgress.showDiv();
        SakiProgress.setText("正在准备下载...");
        console.log("Igniting Salmon Core ...");
        const basePath = url;
        await sleep(100);
        SakiProgress.setPercent(12);
        SakiProgress.setText("正在读取EPUB信息...");
        let container = await (await fetch(basePath + "META-INF/container.xml")).blob();
        fileList.push({ file: container, path: "META-INF/container.xml" });
        let containerParsed = new DOMParser().parseFromString(await container.text(), "text/xml");
        console.log(containerParsed);
        await sleep(100);
        SakiProgress.setPercent(15);
        SakiProgress.setText("正在读取文件清单...");
        let rootfile = containerParsed.getElementsByTagName("rootfile")[0];
        if (rootfile.getAttribute("media-type") == "application/oebps-package+xml" || confirm("该书的信息似乎不符合标准，继续吗？")) {
            //OEBPS/content.opf
            let itemPath = rootfile.getAttribute("full-path");
            console.log(basePath + itemPath);
            let opf = await (await fetch(basePath + itemPath)).blob();
            fileList.push({ file: opf, path: itemPath });
            let opfParsed = new DOMParser().parseFromString(await opf.text(), "text/xml");
            console.log(opfParsed);
            await sleep(100);
            SakiProgress.setPercent(20);
            SakiProgress.setText("正在索引文件...");
            let itemList = opfParsed.getElementsByTagName("item");
            let baseItemPath = basePath + itemPath.substring(0, itemPath.lastIndexOf("/")) + "/";
            let zipPath = itemPath.substring(0, itemPath.lastIndexOf("/")) + "/"
            for (let i = 0; itemList[i]; i++) {
                SakiProgress.setPercent(20 + i / itemList.length * 60);
                SakiProgress.setText("正在下载文件[" + i + "/" + itemList.length + "]...");
                let item = itemList[i];
                if (item.getAttribute("href")) {
                    let itemBlob = await (await fetch(baseItemPath + item.getAttribute("href"))).blob();
                    let path = zipPath + item.getAttribute("href");
                    let type = item.getAttribute("properties") || "normal";
                    fileList.push({ file: itemBlob, path: path, type: type });
                }
            };
            console.log(fileList);
            SakiProgress.setPercent(80);
            SakiProgress.setText("正在解密文本流...");
            await sleep(50);
            let advancedDecrypt = "0";
            let removeList = []
            window.addEventListener("message", e => {
                if (e.data.action == "remove") {
                    removeList.push(e.data.filename);
                };
            })
            for (const file of fileList) {
                if (file.path.endsWith(".xhtml")) {
                    let fileBuffer = forge.util.createBuffer((await file.file.arrayBuffer()));
                    let decryptor = forge.cipher.createDecipher("AES-ECB", key);
                    let output
                    if (decryptor.start(), decryptor.update(fileBuffer), !decryptor.finish()){
                        //解密失败，推测为未加密文件
                        output=await file.file.text();
                    }else{
                        output = decryptor.output.toString();
                    };
                    if (output.indexOf("//<![CDATA[") > 0) {
                        //触发进阶解密:CANVAS解密模式
                        if (advancedDecrypt === "0") {
                            advancedDecrypt = confirm("检测到EPUB自身已被混淆或加密，是否启用进阶解密？\n该功能不稳定，可能无法正常工作\n启用该功能可以让生成的EPUB文件被更多软件支持\n但会延长十倍甚至九倍解密时间\n进阶解密必须保持浏览器处于前台，严禁最小化或切换到其他标签页\n若解密过程失去响应，请打开F12提交日志反馈")
                        }
                        if (advancedDecrypt) {
                            SakiProgress.setText("初始化进阶解密组件...");
                            let urlList = [];
                            fileList.forEach(file => {
                                urlList.push({
                                    filename: file.path.substr(file.path.lastIndexOf("/") + 1),
                                    url: URL.createObjectURL(file.file)
                                })
                            });
                            console.log(urlList);
                            let decryptFrame = document.createElement("iframe");
                            decryptFrame.frameBorder = 0;
                            decryptFrame.style = "padding:100%;z-index:9999;position:fixed;width:100%;margin-top:0px;height:100%;left:0px;right:0px;top:0px;";
                            document.body.appendChild(decryptFrame);
                            SakiProgress.setText("加载文档数据...");
                            let xhtmlParsed = new DOMParser().parseFromString(output, "text/html");
                            console.log(xhtmlParsed);
                            let scriptsBackup = [];
                            for (; xhtmlParsed.getElementsByTagName("script")[0];) {
                                scriptsBackup.push(xhtmlParsed.getElementsByTagName("script")[0].outerHTML);
                                xhtmlParsed.getElementsByTagName("script")[0].remove();
                            };
                            let origincss = "";
                            [].forEach.call(xhtmlParsed.head.children, node => {
                                if (node.rel == "stylesheet") {
                                    console.log(node);
                                    origincss = node.getAttribute("href");
                                    let cssname = node.href;
                                    cssname = cssname.substr(cssname.lastIndexOf("/") + 1);
                                    urlList.forEach(file => {
                                        if (file.filename == cssname) {
                                            node.href = file.url;
                                        }
                                    })
                                }
                            });
                            let hookScript = document.createElement("script");
                            hookScript.innerHTML = `
			console.log("Salmon Advanced Decrypt Mode:0x1");
			window.addEventListener("message", e => {
				console.log(e);
				switch (e.data.method) {
					case "file": {
                        console.log("Filelist Loaded.");
						window.list = e.data.list;
						break;
					};
                    case "restore":{
                        //还原css
                        [].forEach.call(document.head.children,node=>{
                                if(node.rel=="stylesheet"){
                                    console.log(node);
                                    node.href=e.data.css;
                                }
                            });
                        break;
                    };
					case "convert": {
						//用图片取代canvas
						[].forEach.call(document.getElementsByTagName("canvas"), obj => {
							let img = document.createElement("img");
							document.body.appendChild(img);
							img.src = obj.toDataURL("image/jpeg", 0.95);
							img.width = obj.width;
							img.height = obj.height;
							obj.remove()
						});
						//清理所有不该出现在EPUB里的元素
						for(;document.getElementsByTagName("script")[0];){
							document.getElementsByTagName("script")[0].remove();
						};
                        break;
					};
				}
			}, false);
			var valueProp = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
			Object.defineProperty(Image.prototype, 'src', {
				set: function (image) {
					console.log("Hook Image Loader...");
					let filename = image.substr(image.lastIndexOf("/")+1);
					window.list.forEach(file => {
						if (file.filename == filename) {
							image = file.url;
					        console.log("Hook Image Success!");
                            window.parent.postMessage({action:"remove",filename:filename}, "*");
				     	}
					})
					valueProp.set.call(this, image);
				}
			});
			(draw => {
				CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
					console.log([sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight]);
					draw.call(this, image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
				};
			})(CanvasRenderingContext2D.prototype.drawImage);
                            `
                            xhtmlParsed.head.appendChild(hookScript);
                            let docFrame = xhtmlParsed.documentElement.outerHTML;
                            let decryptDoc = decryptFrame.contentDocument;
                            //debugger
                            decryptDoc.open();
                            decryptDoc.write(docFrame);
                            await sleep(10);
                            decryptFrame.contentWindow.postMessage({
                                method: "file",
                                list: urlList
                            }, "*");
                            SakiProgress.setText("加载全文数据...");
                            await sleep(10);
                            scriptsBackup.forEach(script => {
                                decryptDoc.write(script);
                            });
                            SakiProgress.setText("渲染页面...");
                            await sleep(10);
                            //debugger
                            decryptFrame.contentWindow.postMessage({
                                method: "convert"
                            }, "*");
                            decryptDoc.close();
                            SakiProgress.setText("解密页面...");
                            await sleep(10);
                            decryptFrame.contentWindow.postMessage({
                                method: "restore",
                                css: origincss
                            }, "*");
                            await sleep(10);
                            output = decryptFrame.contentDocument.documentElement.outerHTML;
                            SakiProgress.setText("保存页面...");
                            await sleep(10);
                            document.body.removeChild(decryptFrame);
                        }
                    }
                    file.file = new Blob([output]);
                }
            };
            SakiProgress.setPercent(84);
            SakiProgress.setText("正在清理...");
            await sleep(100);
            let emptyfile = await (await fetch("data:image/jpeg,1")).blob();
            removeList.forEach(remove => {
                fileList.forEach(file => {
                    if (file.path.substr(file.path.lastIndexOf("/") + 1) == remove && file.type == "normal") {
                        file.file = emptyfile;
                    }
                });
            });
            SakiProgress.setPercent(85);
            SakiProgress.setText("正在生成文件结构...");
            await sleep(100);
            let zip = new JSZip();
            fileList.forEach(file => zip.file(file.path, file.file, { binary: true }));
            await sleep(100);
            SakiProgress.setPercent(90);
            SakiProgress.setText("正在打包...");
            let zipFile = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            });
            SakiProgress.setPercent(97);
            SakiProgress.setText("正在导出...");
            await sleep(2000);
            dlFile(URL.createObjectURL(zipFile), document.title + ".epub");
            SakiProgress.clearProgress();
            SakiProgress.setText("下载成功！");
            await sleep(3000);
            SakiProgress.hideDiv();
            alert("恭喜下载成功！\n如果对成品满意的话，记得给脚本好评\n除了关注琴梨梨外，也别忘了关注温柔可爱铸币的塔宝@帅比笙歌超可爱OvO，本脚本开发过程全程以塔宝的直播作为BGM")
        } else {
            SakiProgress.clearProgress();
            SakiProgress.hideDiv();
            console.log("User Cancel.");
        }
    }
    let injectWorker = `self.addEventListener("message",(e)=>{console.log(e.data);})`;
    const originWorker = window.Worker
    window.Worker = function (aurl, options) {
        console.log("捉住Worker请求了喵！")
        console.log(aurl)
        var oReq = new XMLHttpRequest();
        oReq.open("GET", aurl, false);
        oReq.send();
        const mergedWorker = URL.createObjectURL(new Blob([injectWorker + oReq.response]))
        console.log("给Worker加点料！寄汤来咯！")
        let hookWorker = new originWorker(mergedWorker, options);
        let originMessage = hookWorker.postMessage;
        hookWorker.postMessage = (msg, list) => {
            console.log(msg);
            if (msg.token && !key) {
                key = Base64.atob(msg.token);
                SakiProgress.setText("已得到密钥！正在准备文档信息...");
                SakiProgress.setPercent(10);
                dlHyRead(key, msg.url.substr(0, msg.url.indexOf("_epub") + 6))
            }
            return originMessage.call(hookWorker, msg, list);
        }
        hookWorker.addEventListener('message', (event) => {
            console.log(hookWorker);
            console.log(event.data);
        }, true);
        return hookWorker;
    };
})();