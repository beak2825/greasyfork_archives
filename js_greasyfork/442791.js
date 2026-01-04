// ==UserScript==
// @name         Bilibili装扮点赞特效补帧
// @version      2.1.0
// @author       罐头鱼没干
// @match        *://*.bilibili.com/*
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @license      MIT
// @resource     protobuf.js https://cdn.jsdelivr.net/npm/protobufjs@6.10.2/dist/protobuf.min.js
// @resource     pako.js https://cdn.jsdelivr.net/npm/pako@2.0.4/dist/pako.min.js
// @namespace qonsa
// @description 把B站装扮套装的点赞动画（原始为30fps）补到更高的帧率
// @downloadURL https://update.greasyfork.org/scripts/442791/Bilibili%E8%A3%85%E6%89%AE%E7%82%B9%E8%B5%9E%E7%89%B9%E6%95%88%E8%A1%A5%E5%B8%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/442791/Bilibili%E8%A3%85%E6%89%AE%E7%82%B9%E8%B5%9E%E7%89%B9%E6%95%88%E8%A1%A5%E5%B8%A7.meta.js
// ==/UserScript==

(function () {
    // !!! 修改这两行的数值获得自己需要的效果
    const SmoothRate = 2; // 平滑后帧率 = 原始帧率 * 2^n  例如当设为1时，将会把点赞动画从30fps补帧到60fps
    const ScaleRate = 1.5; // 放大倍率
    var type = { "nested": { "com": { "nested": { "opensource": { "nested": { "svga": { "options": { "objc_class_prefix": "SVGAProto", "java_package": "com.opensource.svgaplayer.proto" }, "nested": { "MovieParams": { "fields": { "viewBoxWidth": { "type": "float", "id": 1 }, "viewBoxHeight": { "type": "float", "id": 2 }, "fps": { "type": "int32", "id": 3 }, "frames": { "type": "int32", "id": 4 } } }, "SpriteEntity": { "fields": { "imageKey": { "type": "string", "id": 1 }, "frames": { "rule": "repeated", "type": "FrameEntity", "id": 2 } } }, "AudioEntity": { "fields": { "audioKey": { "type": "string", "id": 1 }, "startFrame": { "type": "int32", "id": 2 }, "endFrame": { "type": "int32", "id": 3 }, "startTime": { "type": "int32", "id": 4 } } }, "Layout": { "fields": { "x": { "type": "float", "id": 1 }, "y": { "type": "float", "id": 2 }, "width": { "type": "float", "id": 3 }, "height": { "type": "float", "id": 4 } } }, "Transform": { "fields": { "a": { "type": "float", "id": 1 }, "b": { "type": "float", "id": 2 }, "c": { "type": "float", "id": 3 }, "d": { "type": "float", "id": 4 }, "tx": { "type": "float", "id": 5 }, "ty": { "type": "float", "id": 6 } } }, "ShapeEntity": { "oneofs": { "args": { "oneof": ["shape", "rect", "ellipse"] } }, "fields": { "type": { "type": "ShapeType", "id": 1 }, "shape": { "type": "ShapeArgs", "id": 2 }, "rect": { "type": "RectArgs", "id": 3 }, "ellipse": { "type": "EllipseArgs", "id": 4 }, "styles": { "type": "ShapeStyle", "id": 10 }, "transform": { "type": "Transform", "id": 11 } }, "nested": { "ShapeType": { "values": { "SHAPE": 0, "RECT": 1, "ELLIPSE": 2, "KEEP": 3 } }, "ShapeArgs": { "fields": { "d": { "type": "string", "id": 1 } } }, "RectArgs": { "fields": { "x": { "type": "float", "id": 1 }, "y": { "type": "float", "id": 2 }, "width": { "type": "float", "id": 3 }, "height": { "type": "float", "id": 4 }, "cornerRadius": { "type": "float", "id": 5 } } }, "EllipseArgs": { "fields": { "x": { "type": "float", "id": 1 }, "y": { "type": "float", "id": 2 }, "radiusX": { "type": "float", "id": 3 }, "radiusY": { "type": "float", "id": 4 } } }, "ShapeStyle": { "fields": { "fill": { "type": "RGBAColor", "id": 1 }, "stroke": { "type": "RGBAColor", "id": 2 }, "strokeWidth": { "type": "float", "id": 3 }, "lineCap": { "type": "LineCap", "id": 4 }, "lineJoin": { "type": "LineJoin", "id": 5 }, "miterLimit": { "type": "float", "id": 6 }, "lineDashI": { "type": "float", "id": 7 }, "lineDashII": { "type": "float", "id": 8 }, "lineDashIII": { "type": "float", "id": 9 } }, "nested": { "RGBAColor": { "fields": { "r": { "type": "float", "id": 1 }, "g": { "type": "float", "id": 2 }, "b": { "type": "float", "id": 3 }, "a": { "type": "float", "id": 4 } } }, "LineCap": { "values": { "LineCap_BUTT": 0, "LineCap_ROUND": 1, "LineCap_SQUARE": 2 } }, "LineJoin": { "values": { "LineJoin_MITER": 0, "LineJoin_ROUND": 1, "LineJoin_BEVEL": 2 } } } } } }, "FrameEntity": { "fields": { "alpha": { "type": "float", "id": 1 }, "layout": { "type": "Layout", "id": 2 }, "transform": { "type": "Transform", "id": 3 }, "clipPath": { "type": "string", "id": 4 }, "shapes": { "rule": "repeated", "type": "ShapeEntity", "id": 5 } } }, "MovieEntity": { "fields": { "version": { "type": "string", "id": 1 }, "params": { "type": "MovieParams", "id": 2 }, "images": { "keyType": "string", "type": "bytes", "id": 3 }, "sprites": { "rule": "repeated", "type": "SpriteEntity", "id": 4 }, "audios": { "rule": "repeated", "type": "AudioEntity", "id": 5 } } } } } } } } } } }
    // xhr hook
    var pageUrl, imageUrl = null, css, decoder, hookTarget;
    var cached = null, cachedImageUrl = GM_getValue("AnimationDataUrl", null), cachedOnLoad;
    GM.getValue("AnimationData", null).then(d => {
        if (d != null)
            dataUrlToBytes(d).then(uintArr => cached = uintArr);
    });
    var imageUrlResolver;
    if (window.location.href.includes("t.bilibili.com") || window.location.href.includes("space.bilibili.com") || window.location.href.includes("www.bilibili.com/v/topic/detail")) {
        let url = new URL(window.location.href);
        let path;
        if (url.hostname.includes("t.bilibili.com")) {
            if (url.pathname == "/") {
                imageUrlResolver = json => json.data?.items[0].basic.like_icon.action_url.replace("http:", "").replace("https:", "");
                path = "feed/all";
            }
            else {
                imageUrlResolver = json => json.data?.item.basic.like_icon.action_url.replace("http:", "").replace("https:", "");
                path = "detail";
            }
        } else if (url.hostname.includes("space.bilibili.com")) {
            imageUrlResolver = json => json.data?.items[0].basic.like_icon.action_url.replace("http:", "").replace("https:", "");
            path = "feed/space";
        } else if (window.location.href.includes("www.bilibili.com/v/topic/detail")) {
            imageUrlResolver = json => json.data.topic_card_list.items[0].dynamic_card_item.basic.like_icon.action_url.replace("https:", "");
            path = "feed/topic";
        }
        pageUrl = "api.bilibili.com/x/polymer/web-dynamic/v1/" + path;
        hookTarget = "onload";
        css = `.svga-player {transform: scale(${ScaleRate}) translateY(7%); transform-origin: bottom} .bili-svga-player {transform: scale(${ScaleRate}) translateY(7%); transform-origin: bottom}`;
    } else if (window.location.href.includes("www.bilibili.com/video/")) {
        hookTarget = "onloadend";
        pageUrl = "api.bilibili.com/x/web-interface/archive/like";
        css = `.svga-container {pointer-events: none; transform: scale(${ScaleRate}); transform-origin: left}`;
        setTimeout(() => imageUrl = unsafeWindow.__INITIAL_STATE__.videoData.user_garb.url_image_ani_cut.replace("http:", "").replace("https:", ""), 3000);
    } else return;
    document.head.appendChild(document.createElement("style")).innerHTML = css;
    const fetchOrigin = fetch;
    unsafeWindow.fetch = function (url, ...options) {
        if (imageUrl == null && url.includes(pageUrl)) {
            return fetchOrigin(url, ...options).then(r => {
                r.clone().json().then(json => {
                    imageUrl = imageUrlResolver(json);
                });
                return r;
            });
        }
        return fetchOrigin(url, ...options);
    }
    const xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...arg) {
        if (imageUrl == null && url.includes(pageUrl)) {
            this.addEventListener("load", function () {
                imageUrl = imageUrlResolver(JSON.parse(this.response));
            });
        } else if (imageUrl != null && url.includes(imageUrl)) {
            if (cached && cachedImageUrl == imageUrl) {
                Object.defineProperty(this, "send", { writable: true });
                this.send = function () { };
                Object.defineProperty(this, "response", { writable: true });
                this.response = cached;
                Object.defineProperty(this, hookTarget, {
                    get() { },
                    set(f) { setTimeout(() => f.call(this), 0) }
                });
            }
            else {
                let onload;
                Object.defineProperty(this, hookTarget, {
                    get() { return onload },
                    set(f) {
                        if (onload) return;
                        cachedOnLoad = f;
                        this.addEventListener("load", onload = function () {
                            if (this.status == 200) {
                                let bin = this.response;
                                Object.defineProperty(this, "response", { writable: true });
                                this.response = insertFrames(bin);
                                GM.setValue("AnimationDataUrl", imageUrl);
                                bytesToBase64DataUrl(this.response).then(base64 => GM.setValue("AnimationData", base64));
                                f.call(this);
                            }
                        })
                    }
                });
            }
        }
        return xhrOpen.call(this, method, url, ...arg);
    }
    function insertFrames(bin) {
        new Function(GM_getResourceText("protobuf.js"))();
        new Function(GM_getResourceText("pako.js"))();
        decoder = protobuf.Root.fromJSON(type).lookupType("com.opensource.svga.MovieEntity");
        let inflate = new pako.Inflate({ chunkSize: 16384, to: "" })
        inflate.push(bin, true);
        let MovieEntity = decoder.decode(inflate.result);
        function insert() {
            MovieEntity.params.fps *= 2;
            MovieEntity.params.frames = MovieEntity.params.frames * 2 - 1;
            for (let i = 0; i < MovieEntity.sprites.length; i++) {
                let extended = new Array(MovieEntity.sprites[i].frames.length * 2 - 1);
                let end = MovieEntity.sprites[i].frames.length - 1;
                for (let j = 0, prev, next; j < end; j++) {
                    prev = MovieEntity.sprites[i].frames[j];
                    next = MovieEntity.sprites[i].frames[j + 1];
                    extended[j * 2] = extended[j * 2 + 1] = prev;
                    if (prev.alpha != 0 && next.alpha != 0) {
                        extended[j * 2 + 1] = { clipPath: prev.clipPath, shapes: prev.shapes, layout: prev.layout, alpha: prev.alpha };
                        extended[j * 2 + 1].__proto__ = prev.__proto__;
                        extended[j * 2 + 1].alpha = ((prev.alpha || 0) + (next.alpha || 0)) / 2;
                        if (prev.transform != null && next.transform != null) {
                            extended[j * 2 + 1].transform = {};
                            let transform = extended[j * 2 + 1].transform;
                            transform.a = (prev.transform.a + next.transform.a) / 2;
                            transform.b = (prev.transform.b + next.transform.b) / 2;
                            transform.c = (prev.transform.c + next.transform.c) / 2;
                            transform.d = (prev.transform.d + next.transform.d) / 2;
                            transform.tx = (prev.transform.tx + next.transform.tx) / 2;
                            transform.ty = (prev.transform.ty + next.transform.ty) / 2;
                        }
                    }
                }
                extended[end * 2] = MovieEntity.sprites[i].frames[end];
                MovieEntity.sprites[i].frames = extended;
            }
        }
        for (let i = 0; i < SmoothRate; i++)
            insert();
        let protoOutput = decoder.encode(MovieEntity).finish();
        let deflate = new pako.Deflate({ chunkSize: 16384 });
        deflate.push(protoOutput, true);
        cached = deflate.result;
        return deflate.result;
    }

    async function bytesToBase64DataUrl(bytes, type = "application/octet-stream") {
        return await new Promise((resolve, reject) => {
            const reader = Object.assign(new FileReader(), {
                onload: () => resolve(reader.result),
                onerror: () => reject(reader.error),
            });
            reader.readAsDataURL(new File([bytes], "", { type }));
        });
    }

    async function dataUrlToBytes(dataUrl) {
        const res = await fetch(dataUrl);
        return new Uint8Array(await res.arrayBuffer());
    }

})()