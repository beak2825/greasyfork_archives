// ==UserScript==
// @name         truenas disk locator
// @namespace    http://tampermonkey.net/
// @version      2024-07-13.2
// @description  add layout overlay for truenas
// @author       You
// @match        https://truenas/*
// @icon         https://truenas/ui/assets/favicons/favicon.ico
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/500566/truenas%20disk%20locator.user.js
// @updateURL https://update.greasyfork.org/scripts/500566/truenas%20disk%20locator.meta.js
// ==/UserScript==

const locationData = GM_getValue("locationdata") ?? {};

let editmode = true;

const images = locationData.images?.map(imaageStr => {
    const caseImage = new Image();

    caseImage.src = imaageStr;
    caseImage.srcStr = imaageStr;

    return caseImage
})


function getReplySocket(url) {
    const requestMap = {}

    const socket = new WebSocket(url)
    socket.addEventListener("message", message => {
        try {
            const evt = JSON.parse(message.data)
            if(evt.id && requestMap[evt.id]) {
                if(evt.error) {
                    requestMap[evt.id].err(evt)
                } else {
                    requestMap[evt.id].res(evt)
                }
                delete requestMap[evt.id];

            }
        } catch(e) { }
    })
    socket.sendRequest = (request) => {
        return new Promise((res, err) => {
            requestMap[request.id] = { res, err }
            socket.send(JSON.stringify(request))
        })
    }
    return socket
}



const url = location.href;

const authSocket = getReplySocket(`wss://${location.host}/websocket`)
authSocket.addEventListener("open", () => {
    authSocket.send(JSON.stringify({ "msg": "connect", "version": "1", "support": ["1"] }))
})

function startShell() {
    authSocket.sendRequest({
        "id": "09cea36d-3384-8afe-412f-05f99624c9d9",
        "msg": "method",
        "method": "auth.generate_token"
    }).then(token => {
        const shellToken = token.result
        if(!shellToken) {
            debugger;
        }
        const socket = new WebSocket(`wss://${location.host}/websocket/shell/`)
        let echoText = "";
        socket.addEventListener("open", () => {
            socket.send(JSON.stringify({ token: shellToken }));
        })
        socket.addEventListener("message", async (e) => {
            if(typeof e.data == "string" && e.data.includes("connected")) {
                console.log(e.data)

            } else if(e.data instanceof Blob) {
                const text = await e.data.text()
                echoText += text;
                if(echoText.includes("cmd-start") && echoText.split("cmd-end").length > 2) {
                    const disks = echoText.split("total 0")[1].split("cmd-end")[0].split("\r\n").filter(l => l.trim().includes("pci") && !l.includes("-part") && !l.includes(".0 ->"))
                    setDisks(disks);
                    echoText = "";
                } else if(echoText.trim().includes("admin@")) {
                    echoText = "";
                    const getinfoCmd = `echo "cmd-start" && ls -la /dev/disk/by-path && echo "cmd-end" \n`
                    const encoded = new TextEncoder().encode(getinfoCmd);

                    socket.send(encoded)
                }

            }

        })

        socket.addEventListener("close", () => {
            debugger;

        })
    })

}

let diskMap;

function setDisks(disks) {
    diskMap = Object.fromEntries(disks.map(line => {
        const match = line.match(/(?<perms>[lrwx]*) (?<linknum>\d*) (?<owner>[^ ]*) (?<group>[^ ]*) *(?<size>\d*) (?<modmonth>[a-zA-Z]*) (?<modday>\d*) (?<modtime>[\d:]*) (?<path>[^ ]*) -> \.\.\/\.\.\/(?<name>.*)$/)
        return [match.groups.name, match.groups]
    }))
}


authSocket.addEventListener("message", (m) => {
    const evt = JSON.parse(m.data);
    if(evt.msg === "connected") {

        const storageToken = localStorage.getItem("ngx-webstorage|token")
        if(storageToken) {
            const authToken = JSON.parse(storageToken)
            authSocket.sendRequest({
                "id": "5cc307f6-fac4-a746-df80-e6238f2a54e8",
                "msg": "method",
                "method": "auth.token",
                "params": [authToken]
            }).then(resp => {
                if(resp.result == true) {
                    startShell();
                } else {
                    console.warn("token not valid waiting for login")
                    const interv = setInterval(() => {
                        const newStorageToken = localStorage.getItem("ngx-webstorage|token")
                        if(newStorageToken !== storageToken && JSON.parse(newStorageToken) != null) {
                            const authToken = JSON.parse(newStorageToken)
                            clearInterval(interv)
                            authSocket.sendRequest({
                                "id": "5cc307f6-fac4-a746-df80-e6238f2a54e8",
                                "msg": "method",
                                "method": "auth.token",
                                "params": [authToken]
                            }).then(newResp => {
                                if(newResp.result == true) {
                                    startShell();
                                } else {
                                    debugger;
                                }
                            })
                        }
                    }, 100);
                }
            })
        } else {
            debugger;
        }
    } else {


        //debugger;
    }
})


setInterval(() => {

    if(location.pathname.endsWith("/storage/disks") && document.querySelector(".actions-container") && !document.querySelector(".actions-container .insertLBtn") && editmode) {
        const addImageButton = document.createElement("input")
        addImageButton.placeholder = "drag/paste disk layout image here";
        addImageButton.classList.add("insertLBtn")
        addImageButton.addEventListener("paste", async e => {
            const imageTExt = await e.clipboardData.files[0]
            const image = new Image()
            image.src = URL.createObjectURL(imageTExt);
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;

                const context = canvas.getContext("2d");
                context.drawImage(image, 0, 0);

                locationData.images ??= []
                locationData.images.push(canvas.toDataURL())
                GM_setValue("locationdata", locationData)
            }
        })

        document.querySelector(".actions-container").appendChild(addImageButton)

    }
    if(location.pathname.endsWith("/storage/disks") && diskMap) {
        document.querySelectorAll(".mat-sidenav-content #entity-table-component table tbody tr:not(.details-row)").forEach(row => {
            const disk = row.id;
            const path = diskMap[disk].path
            row.title = path
            const modCanvas = document.createElement("canvas");
            row.addEventListener("mouseenter", e => {
                const diskData = locationData.rects[path]
                if(true) {
                    const caseImage = images[diskData?.image ?? 0];
                    modCanvas.remove();
                    modCanvas.width = caseImage.width;
                    modCanvas.height = caseImage.height;

                    modCanvas.style.position = "fixed";
                    modCanvas.style.height = "200px";
                    modCanvas.style.right = "0px";
                    modCanvas.style.zIndex = "9";

                    const context = modCanvas.getContext("2d")
                    context.drawImage(caseImage, 0, 0);
                    row.appendChild(modCanvas)

                    if(diskData?.rect) {
                        try {

                            context.beginPath()
                            context.lineWidth = "2";
                            context.fillStyle = "rgba(0, 255, 0, 0.3)";

                            const pos = diskData.rect[0]
                            const botRight = diskData.rect[1]

                            const rectArgs = [...pos, botRight[0] - pos[0], botRight[1] - pos[1]]
                            context.rect(...rectArgs)
                            context.fill();
                        } catch(e) {

                        }

                    }

                    const ratio = caseImage.height / 200;

                    let topLeft;
                    modCanvas.addEventListener("click", e => {
                        if(!topLeft) {
                            topLeft = [
                                Math.floor(e.offsetX * ratio),
                                Math.floor(e.offsetY * ratio)
                            ]
                        } else if(topLeft) {

                            console.log(`"${path}": [[${topLeft[0]},${topLeft[1]}],[${Math.ceil(e.offsetX * ratio)},${Math.ceil(e.offsetY * ratio)}]]`)

                            locationData.rects ??= {}
                            locationData.rects[path] ??= {}
                            locationData.rects[path].image = diskData?.image ?? 0
                            locationData.rects[path].rect = [
                                topLeft,
                                [
                                    Math.ceil(e.offsetX * ratio),
                                    Math.ceil(e.offsetY * ratio)
                                ]
                            ]
                            GM_setValue("locationdata", locationData)
                            topLeft = undefined
                        }

                    })

                    modCanvas.addEventListener("mousemove", e => {
                        if(topLeft) {
                            const current = [Math.floor(e.offsetX * ratio), Math.floor(e.offsetY * ratio)]
                            context.drawImage(caseImage, 0, 0);


                            context.beginPath()
                            context.lineWidth = "2";
                            context.fillStyle = "rgba(0, 255, 0, 0.3)";

                            const pos = topLeft
                            const botRight = current

                            const rectArgs = [...pos, botRight[0] - topLeft[0], botRight[1] - topLeft[1]]
                            context.rect(...rectArgs)
                            context.fill();
                        }

                    })
                }
            })
            row.addEventListener("mouseleave", e => {
                modCanvas.remove();
            })

            row.querySelectorAll("td:first-child:not(.imageselectadded)").forEach(td => {
                const imageSelector = document.createElement("img")
                imageSelector.style.height = "48px"
                imageSelector.style.width = "48px"
                imageSelector.style.position = "absolute"
                imageSelector.title = "click here to toggle/set image"
                td.classList.add("imageselectadded")

                let imageIndex = 0;

                if(images[imageIndex] && editmode) {
                    imageSelector.src = images[imageIndex].src
                    td.appendChild(imageSelector)
                    imageSelector.onclick = () => {
                        imageIndex++;
                        imageIndex = imageIndex % images.length;
                        imageSelector.src = images[imageIndex].srcStr
                        locationData.rects ??= {}
                        locationData.rects[path] ??= {}
                        locationData.rects[path].image = imageIndex
                        GM_setValue("locationdata", locationData)
                    }
                }
            })
        })
    }
}, 500)


