// ==UserScript==
// @name         Teng 百度网盘文件转存助手（改）
// @namespace    Teng
// @version      1.0.11-patch
// @description  同名脚本有bug（感谢原作者shimmer），已修正，暂时可正常使用（20241124），原作者若修正给我留言我将下架本脚本。使用百度网盘的时候经常要将别人分享的文件（转存到自己网盘里。对于非会员用户有每次500个文件的限制，超过500个文件只能自己手动弄，比较麻烦，因此有了这个工具，希望能帮到需要的人，不喜轻喷。(目前支持保存到根目录)
// @author       Teng
// @license      BSD
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @match        *://pan.baidu.com/disk/main*
// @match        *://yun.baidu.com/disk/main*
// @match        https://pan.baidu.com/s/*
// @require      https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @connect      baidu.com
// @connect      baidupcs.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518700/Teng%20%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518700/Teng%20%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.BaiduTransfer = function(rootPath) {
        this.ROOT_URL = 'https://pan.baidu.com';
        this.bdstoken = null;
        this.shareId = null;
        this.shareRoot = null;
        this.userId = null;
        this.dirList = [];
        this.fileList = [];
        this.rootPath = rootPath || "";
    };

    BaiduTransfer.prototype = {

        request: async function(path, method, params, data, checkErrno) {
            var url = this.ROOT_URL + path;
            if (params) {
                url += '?' + params;
            }

            try {
                var response = await $.ajax({
                    url: url,
                    type: method,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    data: data,
                    xhrFields: {
                        withCredentials: true
                    }
                });
                if (checkErrno && response.errno && response.errno !== 0) {
                    var errno = response.errno;
                    var errmsg = response.show_msg || "过5分钟重试";
                    var customError = new Error(errmsg);
                    customError.errno = errno;
                    throw customError;
                }
                return response;
            } catch (error) {
                throw error;
            }
        },

        createDirectory: async function(dirPath) {
            try {
                await this.listDir(dirPath);
                return;
            } catch (error) {
                if (error.errno !== -9) {
                    throw error;
                }
            }
            var path = "/api/create";
            var params = "a=commit&bdstoken=" + this.bdstoken;
            var data = "path=" + encodeURIComponent(dirPath) + "&isdir=1&block_list=[]";
            return await this.request(path, "POST", params, data, true);
        },

        listDir: async function(dirPath) {
            var path = "/api/list";
            var params = "order=time&desc=1&showempty=0&page=1&num=1000&dir=" + this.customUrlEncode(dirPath) + "&bdstoken=" + this.bdstoken;
            return await this.request(path, "GET", params, null, true);
        },

        transfer: async function(userId, shareId, fsidList, transferPath) {
            var path = "/share/transfer";
            var params = "shareid=" + shareId + "&from=" + userId + "&ondup=newcopy&channel=chunlei&bdstoken=" + this.bdstoken;
            var data = "fsidlist=[" + fsidList.join(",") + "]&path=" + (transferPath || "/");
            var response = await this.request(path, "POST", params, data, false);
            var errno = response.errno;
            if (errno !== 0) {
                if (errno === 2) {
                    var error = new Error("APIParameterError: url=" + path + " param=" + params);
                    throw error;
                } else if (errno === 12) {
                    var limit = response.target_file_nums_limit
                    var count = response.target_file_nums
                    if(limit&&count){
                        var error = new Error("TransferLimitExceededException: limit=" + limit + " count=" + count);
                        throw error;
                    }
                    var error = new Error(response.show_msg);
                    throw error;
                } else if (errno === 1504) {
                    console.log(`Transfer path ${transferPath} exceeds deadline, retry later...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    this.transfer(userId, shareId, fsidList, transferPath);
                } else if (errno === 111) {
                    console.log(`Transfer path ${transferPath} call api too fast , retry later...`);
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    this.transfer(userId, shareId, fsidList, transferPath);
                } else {
                    var error = new Error("BaiduYunPanAPIException: [" + errno + "] " + response.errmsg);
                    throw error;
                }
            }
        },

        getBdstoken: async function() {
            if (this.bdstoken) {
                return this.bdstoken;
            }

            var path = "/api/gettemplatevariable";
            var params = "fields=[\"bdstoken\"]";
            var response = await this.request(path, "GET", params, null, true);
            this.bdstoken = response.result.bdstoken;
            return this.bdstoken;
        },

        getRandsk: async function(shareKey, pwd) {
            var path = "/share/verify";
            var params = "surl=" + shareKey + "&bdstoken=" + this.bdstoken;
            var data = "pwd=" + pwd;
            var response = await this.request(path, "POST", params, data, true);
            return response.randsk;
        },

        getShareData: async function(shareKey, pwd) {
            var path = "/s/1" + shareKey;
            var response = await this.request(path, "GET", null, null ,false);
            var startTag = 'locals.mset(';
            var endTag = '});';

            var startIndex = response.indexOf(startTag);
            if (startIndex === -1) {
                throw new Error("Invalid response: unable to find locals.mset");
            }
            startIndex += startTag.length;

            var endIndex = response.indexOf(endTag, startIndex);
            if (endIndex === -1) {
                throw new Error("Invalid response: unable to find end of locals.mset");
            }

            var jsonStr = response.substring(startIndex, endIndex + 1);
            var data = JSON.parse(jsonStr);
            return {
                userId: data.share_uk,
                shareId: data.shareid,
                bdstoken: data.bdstoken,
                shareRoot: data.file_list[0].parent_path,
                dirList: data.file_list.filter(e => e.isdir === 1).map(function(file) {
                    return {
                        id: file.fs_id,
                        name: file.server_filename,
                    };
                }),
                fileList: data.file_list.filter(e => e.isdir !== 1).map(function(file) {
                    return {
                        id: file.fs_id,
                        name: file.server_filename,
                    };
                })
            };
        },

        updateRandsk: async function(shareKey, pwd) {
            await this.getBdstoken();
            await this.getRandsk(shareKey, pwd);
        },

        initShareData: async function(shareKey, pwd) {
            if (pwd) {
                await this.updateRandsk(shareKey, pwd);
            }
            try {
                var shareData = await this.getShareData(shareKey, pwd);
                this.userId = shareData.userId;
                this.shareId = shareData.shareId;
                this.bdstoken = shareData.bdstoken;
                this.shareRoot = shareData.shareRoot;
                this.dirList = shareData.dirList;
                this.fileList = shareData.fileList;
            } catch (error) {
                if (error.message.indexOf('/share/init')){
                    if (pwd) {
                        throw new Error("Wrong password: " + pwd);
                    } else {
                        throw new Error("Password not specified");
                    }
                }
            }
        },

        transferFiles: async function(fileList, targetPath) {
            if (targetPath) {
                await this.createDirectory(targetPath);
            }

            var maxTransferCount = 100;

            for (var i = 0; i < fileList.length; i += maxTransferCount) {
                var batch = fileList.slice(i, i + maxTransferCount);
                var fsidList = batch.map(function(file) { return file.id; });
                await this.transfer(this.userId, this.shareId, fsidList, targetPath);
            }
            console.log("Transfer " + fileList.length + " files under directory " + targetPath + " success");
        },

        transferDirs: async function(dirList, targetPath) {
            if (targetPath) {
                await this.createDirectory(targetPath);
            }

            if (dirList.length === 0) {
                return;
            }

            var dirPaths = dirList.map(function(dir) {
                return targetPath + '/' + dir.name;
            });

            try {
                await this.transfer(this.userId, this.shareId, dirList.map(dir => dir.id), targetPath);
                dirPaths.forEach(function(dirPath) {
                    console.log(`Transfer directory ${dirPath} success`);
                });
            } catch (error) {
                if (error.message.includes('TransferLimitExceededException:')) {
                    console.log(`Directory ${dirPaths.join(',')} ${error.message}`);

                    if (dirList.length >= 2) {
                        var mid = Math.floor(dirList.length / 2);
                        await this.transferDirs(dirList.slice(0, mid), targetPath);
                        await this.transferDirs(dirList.slice(mid), targetPath);
                    } else {
                        var dir = dirList[0];
                        var dirPath = this.shareRoot;
                        if (targetPath.length > this.rootPath.length) {
                            dirPath += targetPath.slice(this.rootPath.length);
                        }
                        dirPath += '/' + dir.name;

                        var subFiles = await this.listShareDir(this.userId, this.shareId, dirPath);
                        var subDirList = subFiles.filter(function(file) { return file.isDirectory; });
                        var subFileList = subFiles.filter(function(file) { return !file.isDirectory; });

                        if (subDirList.length > 0) {
                            await this.transferDirs(subDirList, targetPath + '/' + dir.name);
                        }
                        if (subFileList.length > 0) {
                            await this.transferFiles(subFileList, targetPath + '/' + dir.name);
                        }
                    }
                } else {
                    throw error;
                }
            }
        },

        listShareDir: async function(userId, shareId, dirPath) {
            var path = "/share/list";
            var page = 1;
            var limit = 100;
            var result = []
            while(true){
                //var params = "uk=" + userId + "&shareid=" + shareId + "&order=name&desc=0&showempty=0&page="+page+"&num=100&dir=" + this.customUrlEncode(dirPath);
                var params = `uk=${userId}&shareid=${shareId}&order=name&desc=0&showempty=0&page=${page}&num=100&dir=${this.customUrlEncode(dirPath)}`;
                var response = await this.request(path, "GET", params, null ,true);
                var list = response.list;
                list.forEach(function(item) {
                    result.push({
                        id: item.fs_id,
                        name: item.server_filename,
                        isDirectory: item.isdir === 1
                    });
                });
                if(list.length < 100){
                    break;
                }
                page++;
            }
            return result;
        },

        extractShareKey: function(url) {
            try {
                var decodedUrl = decodeURIComponent(url);
                if (decodedUrl.includes("/s/1")) {
                    return decodedUrl.split("/s/1")[1].split("?")[0];
                } else if (decodedUrl.includes("surl=")) {
                    return decodedUrl.split("surl=")[1].split("&")[0];
                }
            } catch (e) {
                console.error("Error extracting share key:", e);
            }
            return null;
        },

        customUrlEncode: function(input) {
            let encoded = '';
            for (let c of input) {
                if (c === ' ' || c === '"' || c === '\'') {
                    encoded += encodeURIComponent(c);
                } else {
                    encoded += c;
                }
            }
            return encoded;
        },


        transferFinal: async function(url, pwd) {
            var shareKey = this.extractShareKey(url);
            if (!shareKey) {
                throw new Error("Unable to extract share key from URL");
            }

            await this.initShareData(shareKey, pwd);

            if (this.dirList.length > 0) {
                await this.transferDirs(this.dirList, this.rootPath);
            }

            if (this.fileList.length > 0) {
                await this.transferFiles(this.fileList, this.rootPath);
            }
        }
    };

    var button = '<div id="shimmer-draggable-button" style="position: fixed; bottom: 20px; left: 20px; z-index: 1000; cursor: grab;">'
                +'<button style="padding: 10px 20px; font-size: 16px; border: none; background-color: #007bff; color: white; cursor: pointer; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); transition: background-color 0.3s ease; outline: none;" onmouseover="this.style.backgroundColor=\'#0056b3\';" onmouseout="this.style.backgroundColor=\'#007bff\';">转存助手</button>'
                +'</div>'
    $('body').append(button)

    // 动态创建弹窗
    var modal = $('<div>', {
        id: 'shimmer-input-modal',
        style: 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1001;'
    }).append(
        $('<div>', {
            style: 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);'
        }).append(
            $('<h2>', {
                text: '转存',
                style: 'margin-top: 0; color: #007bff;'
            }),
            $('<input>', {
                type: 'text',
                id: 'shimmer-input-modal-url',
                placeholder: '分享链接',
                style: 'width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;'
            }),
            $('<input>', {
                type: 'text',
                id: 'shimmer-input-modal-pwd',
                placeholder: '密码',
                style: 'width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;'
            }),
                        $('<button>', {
                id: 'shimmer-input-modal-confirm-button',
                text: '确认',
                style: 'width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;',
                on: {
                    mouseover: function() {
                        $(this).css('backgroundColor', '#0056b3');
                    },
                    mouseout: function() {
                        $(this).css('backgroundColor', '#007bff');
                    }
                }
            })
        )
    );

    $('body').append(modal);

    var buttonWidth = $('#shimmer-draggable-button').outerWidth();
    var buttonHeight = $('#shimmer-draggable-button').outerHeight();
    var edgeOffset = 50;

    $('#shimmer-draggable-button').css('left', -buttonWidth + edgeOffset + 'px');

    $('#shimmer-draggable-button').on('mouseenter', function() {
        $(this).css('left', '0');
    });

    $('#shimmer-draggable-button').on('mouseleave', function() {
        $(this).css('left', -buttonWidth + edgeOffset + 'px');
    });

    $('#shimmer-draggable-button').on('click', function(event) {
        $('#shimmer-input-modal').show();
    });

    $('#shimmer-input-modal').on('click', function(event) {
        if (event.target === this) {
            $('#shimmer-input-modal').hide();
        }
    });

    $('#shimmer-input-modal-confirm-button').on('click', async function(event) {
        var rootPath = "";
        var transfer = new BaiduTransfer(rootPath);
        var url = $("#shimmer-input-modal-url").val();
        var pwd = $("#shimmer-input-modal-pwd").val();

        // 检查 url
        if (!url) {
            alert("请输入分享链接");
            return;
        }

        $('#shimmer-draggable-button').css('left', '0');
        $('#shimmer-draggable-button button').text('转存中...').prop('disabled', true);
        $('#shimmer-input-modal').hide();
        alert("转存在后台运行中，请不要关闭浏览器和刷新当前页面，注意左下角按钮的状态（目前这个弹窗需要点击确认）");

        try {
            await transfer.transferFinal(url, pwd);
            console.log("Transfer completed successfully.");
            alert("转存成功");
            location.reload();
        } catch (error) {
            console.error("Error during transfer:", error);
            alert("发生错误了..." + error);
        } finally {
            $('#shimmer-draggable-button').css('left', -buttonWidth + edgeOffset + 'px')
            $('#shimmer-draggable-button button').text('转存助手').prop('disabled', false);
        }
    });

})();

