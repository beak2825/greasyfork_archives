// ==UserScript==
// @name         b站听视频
// @namespace    qwq0
// @version      0.12
// @description  b站收藏夹听视频
// @author       qwq0
// @match        https://www.bilibili.com/list/ml*
// @match        https://www.bilibili.com/soundPlayer
// @match        https://www.bilibili.com/soundPlayer#*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496668/b%E7%AB%99%E5%90%AC%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/496668/b%E7%AB%99%E5%90%AC%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(async function ()
{
    "use strict";

    if (location.pathname.startsWith("/list/ml"))
    {
        await (new Promise(resolve =>
        {
            document.addEventListener("load", () =>
            {
                setTimeout(() =>
                {
                    resolve();
                }, 1000);
            }, true);
        }));
        let button = document.createElement("div");
        button.innerText = "听视频";
        button.style.position = "fixed";
        button.style.border = "1px solid rgba(140, 140, 140, 0.2)";
        button.style.borderRadius = "5px";
        button.style.zIndex = "10000";
        button.style.left = "10px";
        button.style.top = "115px";
        button.style.padding = "3px";
        button.style.backgroundColor = "rgba(240, 240, 240, 0.1)";
        button.style.cursor = "pointer";
        button.onclick = () =>
        {
            let fid = location.pathname.slice(8);
            if (fid.at(-1) == "/")
                fid = fid.slice(0, -1);
            location.replace(`https://www.bilibili.com/soundPlayer#fid=${fid}`);
        };
        document.body.appendChild(button);
        return;
    }

    navigator.sendBeacon = () => { return false; };

    await (new Promise(resolve =>
    {
        document.addEventListener("load", () =>
        {
            setTimeout(() =>
            {
                resolve();
            }, 1000);
        }, true);
    }));

    let errorElement = document.getElementsByClassName("error-container")[0];
    if (!errorElement)
        return;
    errorElement.remove();

    /** @type {import("../lib/qwqframe")} */
    // @ts-ignore
    const qf = await import("https://unpkg.com/qwq-frame");
    let { NList, createNStyleList: styles, nTagName, eventName, createHookObj, bindValue, getNElement, delayPromise } = qf;

    /**
     *
     * @param {string} paramName
     * @returns {string | undefined}
     */
    function getUrlHashParam(paramName)
    {
        let paramList = location.hash.slice(1).split("&");
        for (let o of paramList)
        {
            if (o.startsWith(paramName + "="))
            {
                return decodeURIComponent(o.slice(paramName.length + 1));
            }
        }
        return undefined;
    }

    let Peerjs = null;
    let loadedPeerjs = false;
    let peer = null;
    let listenTogetherKey = null;
    let connectionSet = new Set();

    async function loadPeerjs()
    {
        if (loadedPeerjs)
            return Peerjs;
        loadedPeerjs = true;
        // @ts-ignore
        Peerjs = await import("https://esm.sh/peerjs?bundle-deps");
        return Peerjs;
    }

    function getListenTogetherId()
    {
        return new Promise(async (resolve) =>
        {
            if (peer)
            {
                resolve(peer.id);
                return;
            }

            await loadPeerjs();

            let id = `bListen-${Math.floor(Math.random() * Math.pow(36, 5)).toString(36)}-${Math.floor(Math.random() * Math.pow(36, 5)).toString(36)}`;
            listenTogetherKey = Math.floor(Math.random() * Math.pow(36, 5)).toString(36);

            peer = new Peerjs.Peer(id);
            function updateCounter()
            {
                playingState.playTogetherState = `当前有 ${connectionSet.size} 个连接到本机的一起听`;
            }
            peer.on("connection", connection =>
            {
                connection.on("data", data =>
                {
                    if (data?.type == "init")
                    {
                        let key = data?.key;
                        if (key == listenTogetherKey)
                        {
                            connectionSet.add(connection);
                            updateCounter();
                            let info = favorList[nowPlayingIndex];
                            connection.send({
                                type: "changeMedia",
                                bvid: info.bvid,
                                title: info.name
                            });
                            connection.send({
                                type: "seekTo",
                                currentTime: audioElement.currentTime
                            });
                        }
                    }
                });
                connection.on("close", () =>
                {
                    connectionSet.delete(connection);
                    updateCounter();
                });
            });

            resolve(id);
        });
    }

    async function listenTogetherData(data)
    {
        connectionSet.forEach(o =>
        {
            o.send(data);
        });
    }

    let fid = getUrlHashParam("fid");
    let hostId = getUrlHashParam("listenTogether");
    if (hostId)
    {
        listenTogetherKey = getUrlHashParam("key");
    }

    let favorListInfo = (
        fid ?
            (await (await fetch(
                `https://api.bilibili.com/x/v3/fav/folder/info?media_id=${fid}`,
                {
                    credentials: "include"
                }
            )).json()).data :
            {}
    );

    /** @type {string} */
    let favorListName = favorListInfo?.title || (hostId ? "一起听收藏夹" : "");
    /** @type {string} */
    let favorListUpperName = favorListInfo?.upper?.name || "";
    /** @type {number} */
    let favorListLength = favorListInfo?.media_count || 0;

    /**
     * @type {Array<{
     *  name: string,
     *  cover: string,
     *  upperName: string,
     *  upperId: string,
     *  bvid: string,
     *  available: boolean
     * }>}
     */
    let favorList = [];

    /**
     * 获取收藏夹中的项目
     * @param {number} index
     * @returns {Promise<favorList[number]>}
     */
    async function getEntry(index)
    {
        if (index >= favorListLength || index < 0)
            return null;
        if (favorList[index])
            return favorList[index];
        try
        {
            let pageIndex = Math.floor(index / 20);
            let pageList = (await (await fetch(
                `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${fid}&ps=${20}&pn=${pageIndex + 1}`,
                {
                    credentials: "include"
                }
            )).json()).data;
            pageList.medias.forEach((o, i) =>
            {
                favorList[pageIndex * 20 + i] = {
                    name: o.title,
                    cover: o.cover,
                    upperName: o.upper.name,
                    upperId: o.upper.mid,
                    bvid: o.bvid,
                    available: o.attr == 0
                };
            });
            return favorList[index];
        }
        catch (err)
        {
            console.error("getEntry error:", err);
            return null;
        }
    }

    /**
     * @type {HTMLAudioElement}
     */
    let audioElement = null;

    let playingState = createHookObj({
        nowPlayingIndex: 0,
        nowPlayingBvid: "",
        nowPlayingTitle: "",
        /** @type {"sequential" | "reverse" | "singleLoop" | "random"} */
        playerMode: "sequential",
        /** @type {"none" | "bassBoost" | "bassBoost2" | "highCut"} */
        audioProcessing: "none",
        playTogetherState: ""
    });
    let nowPlayingIndex = 0;

    /** @type {() => void} */
    let refreshListElement = null;

    let buttonStyle = styles({
        border: "1px solid rgba(140, 140, 180, 0.5)",
        borderRadius: "3px",
        padding: "3px 10px",
        cursor: "pointer"
    });

    getNElement(document.body).setStyles({
        height: "100%",
        display: "flex",
        flexDirection: "column"
    });

    (
        document.getElementById("internationalHeader") ||
        document.getElementById("biliMainHeader")
    ).after(NList.getElement([
        styles({
            margin: "50px",
            flex: "1",
            display: "flex",
            flexDirection: "column"
        }),

        [
            styles({
                padding: "15px",
                border: "1px solid rgba(0, 0, 0, 0.5)",
                borderRadius: "3px",
                marginBottom: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                height: "fit-content"
            }),

            [
                nTagName.audio,
                styles({
                    borderRadius: "100px",
                    border: "1px solid rgba(40, 40, 80, 0.2)",
                    width: "100%"
                }),
                e => audioElement = e.element,
                eventName.ended(() =>
                {
                    if (playingState.playerMode == "singleLoop")
                        audioElement.play();
                    else if (playingState.playerMode == "reverse")
                        switchToPrevious();
                    else
                        switchToNext();
                }),
                eventName.durationchange(() =>
                {
                    navigator.mediaSession.setPositionState({
                        duration: audioElement.duration,
                        playbackRate: 1,
                        position: audioElement.currentTime
                    });
                }),
                eventName.pause(() =>
                {
                    navigator.mediaSession.playbackState = "paused";
                    listenTogetherData({
                        type: "pause"
                    });
                }),
                eventName.play(() =>
                {
                    navigator.mediaSession.playbackState = "playing";
                    listenTogetherData({
                        type: "play"
                    });
                }),
                eventName.seeked(() =>
                {
                    listenTogetherData({
                        type: "seekTo",
                        currentTime: audioElement.currentTime
                    });
                }),
                eventName.canplay(() =>
                {
                    rollbackError = false;
                })
            ],

            [
                "正在播放: ",
                bindValue(playingState, "nowPlayingTitle")
            ],
            [
                `收藏夹: ${favorListName} - `,
                bindValue(playingState, "nowPlayingIndex", o => `${o + 1} / ${favorListLength}`)
            ],

            [
                styles({
                    display: "flex",
                    gap: "8px"
                }),

                [
                    buttonStyle,
                    "上一个",
                    eventName.click(() =>
                    {
                        switchToPrevious();
                    })
                ],

                [
                    buttonStyle,
                    "暂停 / 播放",
                    eventName.click(() =>
                    {
                        if (audioElement.paused)
                            audioElement.play();
                        else
                            audioElement.pause();
                    })
                ],

                [
                    buttonStyle,
                    "下一个",
                    eventName.click(() =>
                    {
                        switchToNext();
                    })
                ]

            ],
            [
                styles({
                    display: "flex",
                    gap: "8px"
                }),

                ...(([
                    {
                        name: "列表循环",
                        modeId: "sequential"
                    },
                    {
                        name: "随机播放",
                        modeId: "random"
                    },
                    {
                        name: "单曲循环",
                        modeId: "singleLoop"
                    },
                    {
                        name: "倒序循环",
                        modeId: "reverse"
                    }
                ]).map(o => [
                    buttonStyle,
                    bindValue(playingState, "playerMode", mode => (mode == o.modeId ? "● " : "")),
                    o.name,
                    eventName.click(() =>
                    {
                        // @ts-ignore
                        playingState.playerMode = o.modeId;
                    })
                ]))
            ],
            [
                styles({
                    display: "flex",
                    gap: "8px"
                }),

                ...(([
                    {
                        name: "无",
                        audioProcessing: "none"
                    },
                    {
                        name: "低音增强",
                        audioProcessing: "bassBoost"
                    },
                    {
                        name: "轰头至尊",
                        audioProcessing: "bassBoost2"
                    },
                    {
                        name: "咚咚",
                        audioProcessing: "highCut"
                    }
                ]).map(o => [
                    buttonStyle,
                    bindValue(playingState, "audioProcessing", audioProcessing => (audioProcessing == o.audioProcessing ? "● " : "")),
                    o.name,
                    eventName.click(() =>
                    {
                        // @ts-ignore
                        playingState.audioProcessing = o.audioProcessing;
                    })
                ]))
            ],
            (!hostId ?
                [
                    styles({
                        display: "flex",
                        gap: "8px",
                        alignItems: "center"
                    }),

                    [
                        buttonStyle,
                        "一起听",
                        eventName.click(async (e, ele) =>
                        {
                            ele.setText("加载中...");

                            let id = await getListenTogetherId();
                            let key = listenTogetherKey;

                            let url = `https://www.bilibili.com/soundPlayer#listenTogether=${id}&key=${key}`;
                            navigator.clipboard.writeText(url);

                            ele.setText("已复制一起听地址");
                            await delayPromise(1000);
                            ele.setText("一起听");
                        })
                    ],

                    [
                        bindValue(playingState, "playTogetherState")
                    ]
                ] :
                [
                    styles({
                        display: "flex",
                        gap: "8px",
                        alignItems: "center"
                    }),
                    [
                        "正在一起听",
                    ],
                    [
                        bindValue(playingState, "playTogetherState")
                    ]
                ]
            ),
        ],

        [
            styles({
                padding: "15px",
                border: "1px solid rgba(0, 0, 0, 0.5)",
                borderRadius: "3px",
                height: "500px",
                overflow: "auto",
                flex: "1 0 0"
            }),

            (ele) =>
            {
                let nowListEndIndex = 0;
                let tryLoad = false;
                ele.addEventListener("scroll", () =>
                {
                    if (ele.element.scrollTop + ele.element.offsetHeight + 20 >= ele.element.scrollHeight)
                    {
                        if (nowListEndIndex < favorListLength)
                        {
                            refreshListElement();
                        }
                    }
                });
                refreshListElement = async () =>
                {
                    if (tryLoad)
                        return;
                    tryLoad = true;
                    if (!favorList[nowListEndIndex])
                        await getEntry(nowListEndIndex);
                    for (let i = nowListEndIndex; i < favorListLength; i++)
                    {
                        let nowIndex = i;
                        if (!favorList[i])
                        {
                            break;
                        }
                        let info = favorList[i];
                        ele.addChild(NList.getElement([
                            styles({
                                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                height: "50px",
                                margin: "5px",
                                borderRadius: "3px",
                                cursor: "pointer"
                            }),
                            `${i + 1}. ${info.name} / ${info.upperName}`,
                            eventName.click(() =>
                            {
                                doPlay(nowIndex);
                            })
                        ]));
                        nowListEndIndex = i + 1;
                    }
                    tryLoad = false;
                };
                setTimeout(refreshListElement, 1000);
            }
        ]
    ]).element);

    audioElement.controls = true;
    audioElement.loop = false;
    audioElement.autoplay = true;
    audioElement.crossOrigin = "anonymous";

    let rollbackError = false;
    audioElement.addEventListener("error", async (err) =>
    {
        if (rollbackError)
            return;
        rollbackError = true;
        let bvid = playingState.nowPlayingBvid;
        console.log(`playing ${bvid} error, trying rollback audio`);
        if (bvid)
        {
            let src = await getAudioSrc(bvid, true);
            if (bvid == playingState.nowPlayingBvid)
            {
                if (src)
                    audioElement.src = src;
                else
                    audioElement.pause();
            }
        }
    });

    /**
     * @param {string} bvid
     * @param {boolean} [rollback]
     * @returns {Promise<string>}
     */
    async function getAudioSrc(bvid, rollback)
    {
        try
        {
            let videoInfo = await (await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`)).json();
            let playurlInfo = await (await fetch(
                `https://api.bilibili.com/x/player/wbi/playurl?bvid=${bvid}&cid=${videoInfo.data.cid}&fnval=${16}`,
                {
                    credentials: "include"
                }
            )).json();
            if (playurlInfo.data.dash)
            {
                /** @type {Array} */
                let audioList = playurlInfo.data.dash.audio;

                let audioInfoMaxId = 0;
                /** @type {Object} */
                let audioInfo = null;

                [
                    ...audioList,
                    ...([
                        (rollback ? undefined : playurlInfo.data.dash?.flac?.audio)
                    ].filter(o => o != undefined))
                ].forEach(o =>
                {
                    let id = o.id;
                    if (id == 30251)
                    {
                        if (rollback)
                            id = -1;
                        else
                            id = 1e5;
                    }
                    if ((!audioInfo) || id > audioInfoMaxId)
                    {
                        audioInfo = o;
                        audioInfoMaxId = id;
                    }
                });
                return audioInfo.baseUrl;
            }
            else
            {
                playurlInfo = await (await fetch(`https://api.bilibili.com/x/player/wbi/playurl?bvid=${bvid}&cid=${videoInfo.data.cid}&fnval=${1}`)).json();
                return playurlInfo.data.durl[0].url;
            }
        }
        catch (err)
        {
            console.error("get audio src error:", err);
            return "";
        }
    }

    /**
     * @param {number} index
     */
    async function doPlay(index)
    {
        nowPlayingIndex = index;
        let info = await getEntry(index);
        if (!info?.available)
        {
            if (playingState.playerMode == "reverse")
                switchToPrevious();
            else
                switchToNext();
            return;
        }
        playingState.nowPlayingIndex = index;
        playingState.nowPlayingBvid = info.bvid;
        playingState.nowPlayingTitle = info.name;
        document.title = `${info.name} - ${favorListName}`;

        (async () =>
        {
            if (index == nowPlayingIndex)
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: info.name,
                    artist: info.upperName,
                    album: "b站听视频",
                    artwork: [
                        {
                            src: info.cover,
                            sizes: "512x512",
                            type: "image/jpeg",
                        }
                    ]
                });
        })();

        listenTogetherData({
            type: "changeMedia",
            bvid: info.bvid,
            title: info.name
        });

        let src = await getAudioSrc(info.bvid);
        if (index == nowPlayingIndex)
        {
            if (src)
                audioElement.src = src;
            else
                audioElement.pause();
        }
    }

    function switchToNext()
    {
        if (favorListLength == 0)
            return;
        if (playingState.playerMode == "random")
            doPlay(Math.floor(Math.random() * favorListLength));
        else
            doPlay((nowPlayingIndex + 1) % favorListLength);
    }

    function switchToPrevious()
    {
        if (favorListLength == 0)
            return;
        if (playingState.playerMode == "random")
            doPlay(Math.floor(Math.random() * favorListLength));
        else
            doPlay((nowPlayingIndex - 1 + favorListLength) % favorListLength);
    }

    if (!hostId)
    {
        doPlay(0);
    }
    else
    {
        (async () =>
        {
            document.title = "一起听";

            playingState.playTogetherState = "正在加载环境";

            await loadPeerjs();

            let id = `bListen-${Math.floor(Math.random() * Math.pow(36, 5)).toString(36)}-${Math.floor(Math.random() * Math.pow(36, 5)).toString(36)}`;

            // @ts-ignore
            peer = new Peerjs.Peer(id);

            playingState.playTogetherState = "正在连接主机";

            await new Promise((resolve) =>
            {
                peer.on("open", () =>
                {
                    resolve();
                });
            });

            let connection = peer.connect(hostId, {
                reliable: true
            });

            connection.on("open", () =>
            {
                playingState.playTogetherState = "已连接到主机";
                connection.send({
                    type: "init",
                    key: listenTogetherKey
                });
            });

            connection.on("data", async (data) =>
            {
                switch (data?.type)
                {
                    case "play": {
                        audioElement.play();
                        break;
                    }
                    case "pause": {
                        audioElement.pause();
                        break;
                    }
                    case "seekTo": {
                        audioElement.currentTime = data.currentTime;
                        break;
                    }
                    case "changeMedia": {
                        playingState.nowPlayingBvid = data.bvid;
                        let src = await getAudioSrc(data.bvid);
                        if (src)
                        {
                            audioElement.src = src;
                            playingState.nowPlayingTitle = data.title;
                        }
                        break;
                    }
                }
            });
            connection.on("close", () =>
            {
                playingState.playTogetherState = "一起听已断开";
            });
        })();
    }

    navigator.mediaSession.setActionHandler("pause", () =>
    {
        audioElement.pause();
    });
    navigator.mediaSession.setActionHandler("play", () =>
    {
        audioElement.play();
    });
    navigator.mediaSession.setActionHandler("nexttrack", () =>
    {
        switchToNext();
    });
    navigator.mediaSession.setActionHandler("previoustrack", () =>
    {
        switchToPrevious();
    });
    navigator.mediaSession.setActionHandler("seekto", (details) =>
    {
        audioElement.currentTime = details.seekTime;
    });

    let audioContext = new AudioContext();

    let mediaSource = audioContext.createMediaElementSource(audioElement);
    mediaSource.connect(audioContext.destination);

    let middleNode = audioContext.createBiquadFilter();
    middleNode.connect(audioContext.destination);

    bindValue(playingState, "audioProcessing").bindToCallback(o =>
    {
        mediaSource.disconnect();
        if (o == "none")
        {
            mediaSource.connect(audioContext.destination);
        }
        else if (o == "bassBoost")
        {
            middleNode.frequency.value = 95;
            middleNode.Q.value = 5;
            middleNode.gain.value = 7;
            middleNode.detune.value = 100;
            middleNode.type = "lowshelf";
            mediaSource.connect(middleNode);
        }
        else if (o == "bassBoost2")
        {
            middleNode.frequency.value = 115;
            middleNode.Q.value = 5;
            middleNode.gain.value = 9;
            middleNode.detune.value = 110;
            middleNode.type = "lowshelf";
            mediaSource.connect(middleNode);
        }
        else if (o == "highCut")
        {
            middleNode.frequency.value = 130;
            middleNode.Q.value = 5;
            middleNode.gain.value = -14;
            middleNode.detune.value = 30;
            middleNode.type = "highshelf";
            mediaSource.connect(middleNode);
        }
    });
})();