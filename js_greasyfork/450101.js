// ==UserScript==
// @name         E621 Utils
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Adds Some Utilities For E621
// @author       rafa_br34#9060
// @match        https://e621.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @grant        GM.xmlHttpRequest
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/450101/E621%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/450101/E621%20Utils.meta.js
// ==/UserScript==

(async function () {
    const E621_Images_CDN = "https://static1.e621.net/data"
    const E621_Posts = "https://e621.net/posts"


    var g_DataElement = undefined
    var g_Posts = []

    var g_WriteFileQueue = []
    var g_TotalDownloads = 0
    var g_DownloadQueue = 0


    function Sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function RequestWriteFile(Data, FileName, Type="") {
        var TempElement = document.createElement("a");
        var URL = window.URL.createObjectURL(new Blob([Data], { type: "application/octet-stream" }))
        TempElement.setAttribute("href", URL);
        TempElement.setAttribute("download", FileName);
        document.body.appendChild(TempElement);
        TempElement.click();
        document.body.removeChild(TempElement);
        window.URL.revokeObjectURL(URL)

    }


    function MakeE621_CDN_Url(ImageHashMD5, FileFormat) {
        var FirstByte = ImageHashMD5.substr(0, 2)
        var SecondByte = ImageHashMD5.substr(2, 2)

        // CDN/FirstByte/SecondByte/ImageHash.FileFormat
        return `${E621_Images_CDN}/${FirstByte}/${SecondByte}/${ImageHashMD5}.${FileFormat}`
    }


    async function DownloadImage(ImageHashMD5, FileFormat, SelfId) {


        var SelfButton = g_Posts[SelfId]["Data"]["DownloadButton"]

        var Done = false
        var IsDownloading = false
        var State = [false]
        g_DownloadQueue++;
        while (!Done) {
            SelfButton.innerHTML = "Downloading..."
            IsDownloading = true
            try {
                GM.xmlHttpRequest({
                    binary: true,
                    method: "GET",
                    responseType: "blob",
                    url: MakeE621_CDN_Url(ImageHashMD5, FileFormat),
                    onload: async function (Response) {
                        //console.log(Response)
                        try {
                            if (Response.status != 200) {
                                SelfButton.innerHTML = "Failed(Http), Retrying..."
                            }
                            else {
                                SelfButton.innerHTML = "Done!"
                                State = [true, `${ImageHashMD5}.${FileFormat}`, Response.response]
                            }
                        }
                        catch (Exception) {
                            console.log(Exception)
                            SelfButton.innerHTML = "Failed(Exception), Retrying..."
                        }

                        IsDownloading = false
                    },
                    onerror: async function (Response) {
                        SelfButton.innerHTML = "Failed(Error), Retrying..."
                        IsDownloading = false
                    },
                    onabort: async function (Response) {
                        SelfButton.innerHTML = "Failed(Aborted), Retrying..."
                        IsDownloading = false
                    }
                });
            }
            catch (Exception) {
                //console.log(Exception)
                IsDownloading = false
            }

            while (IsDownloading) {
                await Sleep(10)
            }

            if (State[0]) {
                Done = true
                State.splice(0, 1)
                g_WriteFileQueue.push(State)
                g_TotalDownloads++
                SelfButton.innerHTML = "Done"
                await Sleep(1000)
                SelfButton.innerHTML = "Download"
            }
            else {
                await Sleep(3000)
            }

        }


        g_DownloadQueue--;
    }

    var RootDiv = document.createElement("div")
    var Posts = document.getElementById("posts")
    Posts.insertBefore(RootDiv, Posts.firstChild)



    // Download All Button
    {
        var DownloadAllButton = document.createElement("button")
        RootDiv.appendChild(DownloadAllButton)
        DownloadAllButton.innerHTML = "Download All In Page"
        DownloadAllButton.setAttribute("style", "user-select: auto; border-radius: 0px; background-color: rgb(123, 37, 71); color: #ffffff;")

        DownloadAllButton.addEventListener("click",
            async () => {
                for (var Post of g_Posts) {
                    Post.Data.DownloadButton.click()
                    await Sleep(100);
                }
            }
        )
        RootDiv.appendChild(document.createElement("br"))
    }
    

    // Get Source Link List Button
    {
        var GetLinkList = document.createElement("button")
        RootDiv.appendChild(GetLinkList)
        GetLinkList.innerHTML = "Get List Of Image Links(Image Source)"
        GetLinkList.setAttribute("style", "user-select: auto; border-radius: 0px; background-color: rgb(123, 37, 71); color: #ffffff;")

        GetLinkList.addEventListener("click",
            async () => {
                var List = ""
                for (var Post of g_Posts) {
                    List += MakeE621_CDN_Url(Post.Data.MD5, Post.Data.FileFormat) + "\n"
                }
                g_WriteFileQueue.push(["SourceLinks.txt", List])
            }
        )
        RootDiv.appendChild(document.createElement("br"))
    }

    // Get Post Link List Button
    {
        var GetLinkList = document.createElement("button")
        RootDiv.appendChild(GetLinkList)
        GetLinkList.innerHTML = "Get List Of Posts Links(Post Link)"
        GetLinkList.setAttribute("style", "user-select: auto; border-radius: 0px; background-color: rgb(123, 37, 71); color: #ffffff;")

        GetLinkList.addEventListener("click",
            async () => {
                var List = ""
                for (var Post of g_Posts) {
                    List += `${E621_Posts}/${Post.Data.PostId}\n`
                }
                g_WriteFileQueue.push(["PostLinks.txt", List])
            }
        )
        RootDiv.appendChild(document.createElement("br"))
    }


    var g_DataElement = document.createElement("div")

    RootDiv.appendChild(g_DataElement);


    var Runner = async function () {
        while (true) {
            if (g_WriteFileQueue.length > 0) {
                var Data = g_WriteFileQueue.pop()
                RequestWriteFile(Data[1], Data[0])
            }
            await Sleep(100);
        }
    }
    Runner();

    while (true) {
        for (var Object of document.getElementsByTagName("article")) {
            var NewButton = null


            if (g_Posts.find((Post) => { return Post.Element == Object })) {
                continue
            }

            var SplittedUrl = Object.getAttribute("data-file-url").split("/")

            const ImageHash = (SplittedUrl[SplittedUrl.length - 1]).split(".")[0];
            const FileFormat = Object.getAttribute("data-file-ext");
            const TableSize = g_Posts.length

            //console.log("Hash ", ImageHash, " FileFormat ", FileFormat)
            if (!GM || !GM.xmlHttpRequest) {
                NewButton = document.createElement("a")
                NewButton.setAttribute("href", `${E621_Images_CDN}/${ImageHash.substr(0, 2)}/${ImageHash.substr(2, 2)}/${ImageHash}.${FileFormat}`)
                NewButton.setAttribute("download", `${ImageHash}.${FileFormat}`)
                NewButton.setAttribute("target", "_blank")
            }
            else {
                NewButton = document.createElement("button")
                NewButton.addEventListener("click", () => { DownloadImage(ImageHash, FileFormat, TableSize) })
                NewButton.setAttribute("style", "user-select: auto; border-radius: 0px; background-color: rgb(37, 71, 123); color: #ffffff;")
            }

            NewButton.innerHTML = "Download"
            Object.appendChild(NewButton)
            g_Posts.push({ Element: Object, Data: { PostId: Object.getAttribute("data-id"), MD5: ImageHash, FileFormat: FileFormat, DownloadButton: NewButton } })
        }

        g_DataElement.innerHTML = ` Posts: ${g_Posts.length} Total Downloads: ${g_TotalDownloads} Download Queue: ${g_DownloadQueue} Write Queue: ${g_WriteFileQueue.length}`

        await Sleep(1000);
    }



})();