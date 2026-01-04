class webdav {
    constructor(Account, Password) {
        this.Account = Account
        this.Password = Password
    }
    NewFolder(FolderName) {
        let url = `https://dav.jianguoyun.com/dav/${FolderName}/`
        let type = "MKCOL" // 新建
        let header = { "authorization": `Basic ${btoa(this.Account + ':' + this.Password)}` }
        return new Promise(
            (complete, error) => {
                GM_xmlhttpRequest({
                    method: type,
                    timeout: 3000,
                    headers: header,
                    url: url,
                    onload: complete,
                    onerror: error,
                    ontimeout: error
                })
            }
        )
    }
    UploadFiles(FolderName, FileName, FileData, DataType) {
        let url = `https://dav.jianguoyun.com/dav/${FolderName}/${FileName}`
        let type = "PUT" // 上传
        let header = { "authorization": `Basic ${btoa(this.Account + ':' + this.Password)}` }
        return new Promise(
            (complete, error) => {
                GM_xmlhttpRequest({
                    method: type,
                    data: FileData,
                    headers: header,
                    url: url,
                    dataType: DataType,
                    onload: function (response) {
                        if (response.status == 201 || response.status == 204) {
                            complete(true)
                        } else {
                            console.error(response)
                            complete(false)
                        }
                    },
                    onerror: error
                })
            }
        )
    }
    DownloadFile(FolderName, FileName) {
        let url = `https://dav.jianguoyun.com/dav/${FolderName}/${FileName}`
        let type = "GET" // 上传
        let header = { "authorization": `Basic ${btoa(this.Account + ':' + this.Password)}` }
        return new Promise(
            (complete, error) => {
                GM_xmlhttpRequest({
                    method: type,
                    timeout: 3000,
                    headers: header,
                    url: url,
                    onload: function (response) {
                        if (response.status == 200) {
                            complete(response.responseText)
                        } else {
                            console.error(response)
                            complete(false)
                        }
                    },
                    onerror: error,
                    ontimeout: error
                })
            }
        )
    }
    GetAllFile(path, depth) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "PROPFIND",
                url: "https://dav.jianguoyun.com/dav/" + path,
                headers: {
                    "Authorization": `Basic ${btoa(this.Account + ':' + this.Password)}`,
                    "Depth": depth
                },
                onload: function (response) {
                    if (response.status == 207) {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                        var responses = xmlDoc.getElementsByTagNameNS("DAV:", "response");
                        var urls = [];
                        for (var i = 0; i < responses.length; i++) {
                            var href = responses[i].getElementsByTagNameNS("DAV:", "href")[0].textContent;
                            var propstat = responses[i].getElementsByTagNameNS("DAV:", "propstat")[0];
                            var status = propstat.getElementsByTagNameNS("DAV:", "status")[0].textContent;
                            if (status.includes("200 OK")) {
                                var resourcetype = propstat.getElementsByTagNameNS("DAV:", "resourcetype")[0];
                                if (resourcetype.getElementsByTagNameNS("DAV:", "collection").length > 0) {
                                    href += "/";
                                }
                                urls.push(href);
                            }
                        }
                        resolve(urls);
                    }
                    else {
                        console.error(response);
                        reject(new Error("The request failed with status code " + response.status));
                    }
                }
            });
        });
    }
    ExistsFile(path) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "HEAD",
                url: "https://dav.jianguoyun.com/dav/" + path,
                headers: {
                    "Authorization": `Basic ${btoa(this.Account + ':' + this.Password)}`
                },
                onload: function (response) {
                    var status = response.status;
                    // 如果状态码是200，表示文件夹存在
                    if (status == 200) {
                        resolve(true)
                    }
                    // 如果状态码是404，表示文件夹不存在
                    else if (status == 404) {
                        resolve(false)
                    } else if (status == 403) {
                        resolve(true)//reject("权限不足,拒绝访问")
                    }
                    else {
                        reject("The status code is " + status + " and the status text is " + response.statusText)
                    }
                }
            });
        }
        )
    }
    AutoBack(fileName, Exclude = [], Callback) {
        let tim = new Date
        let format = `${tim.getFullYear()}-${tim.getMonth()}-${tim.getDate()}`
        let NewFileName = `${fileName}-${format}.json`
        if (GM_getValue('backup', null) != format) {
            var FileData = {}
            GM_listValues().forEach(function (value) {
                if (Exclude.indexOf(value) == -1) {
                    FileData[value] = GM_getValue(value)
                }
            })
            FileData = JSON.stringify(FileData)
            let FilePath = "config/" + fileName
            new Promise(
                complete => {
                    this.ExistsFile(FilePath).then(
                        async response => {
                            if (!response) {//not exist
                                await this.NewFolder(FilePath)
                            }
                            console.log(FilePath, NewFileName, FileData, "json");
                            let status = await this.UploadFiles(FilePath, NewFileName, FileData, "json")
                            if (status) {
                                console.log("上传备份成功");
                                GM_setValue('backup', format)
                                if (Callback != null) {//回调
                                    Callback.call({ webdav: this })
                                }
                            } else {
                                console.log("上传备份失败");
                            }
                            complete(status)
                        }
                    )
                }
            )
        }
    }
}