// ==UserScript==
// @name         bilibili视频弹幕替换
// @namespace    https://github.com/lyineee/bili_danmaku_replace
// @version      1.0.1
// @description  RT，使用本地的xml弹幕文件替换掉bilibili视频的弹幕(其实不是替换是添加ヾ(≧▽≦*)o
// @author       lyineee
// @match        https://www.bilibili.com/video/*
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      https://cdn.jsdelivr.net/npm/protobufjs@6.10.1/dist/protobuf.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403382/bilibili%E8%A7%86%E9%A2%91%E5%BC%B9%E5%B9%95%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/403382/bilibili%E8%A7%86%E9%A2%91%E5%BC%B9%E5%B9%95%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var input_tag = document.createElement('input');
    input_tag.setAttribute('type', 'file');
    input_tag.style.position = 'fixed';
    input_tag.style.bottom = 0;
    input_tag.addEventListener("change", input_danmaku);
    document.getElementsByTagName('body')[0].appendChild(input_tag);

    var bilidm_proto = { "nested": { "DanmakuElem": { "fields": { "id": { "type": "int64", "id": 1 }, "progress": { "type": "int32", "id": 2 }, "mode": { "type": "int32", "id": 3 }, "fontsize": { "type": "int32", "id": 4 }, "color": { "type": "uint32", "id": 5 }, "midHash": { "type": "string", "id": 6 }, "content": { "type": "string", "id": 7 }, "ctime": { "type": "int64", "id": 8 }, "weight": { "type": "int32", "id": 9 }, "action": { "type": "string", "id": 10 }, "pool": { "type": "int32", "id": 11 }, "idStr": { "type": "string", "id": 12 } } }, "DmSegMobileReply": { "fields": { "elems": { "rule": "repeated", "type": "DanmakuElem", "id": 1 } } } } };

    var root = protobuf.Root.fromJSON(bilidm_proto);
    var dmList = root.lookupType('DmSegMobileReply');
    var dmElem = root.lookupType('DanmakuElem');
    var videoInfo;

    var danmaku;
    function input_danmaku() {
        input_tag.files[0].text().then(function (i) { dmEncode(i) });
        var urlArgs = window.location.search
        var page = /p=(\d+)/.exec(urlArgs)==null?1:/p=(\d+)/.exec(urlArgs)[1];
        var reloadData = {
            autoplay: false,
            cid: videoInfo[page-1].cid,
            dashSymbol: true,
            p: page,
            show_bv: "1",
        }
        window.player.reload(reloadData);
    }

    function dmEncode(xmlData) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlData, "text/xml");
        var dmData = xmlDoc.getElementsByTagName('d');
        var list = new Array();
        for (var i = 0; i < dmData.length; i++) {
            var attrs = dmData[i].getAttribute('p').split(',');
            var msg = dmData[i].childNodes[0].nodeValue;
            var elem = {
                id: 0,
                progress: attrs[0] * 1000,
                mode: Number(attrs[1]),
                fontsize: Number(attrs[2]),
                color: Number(attrs[3]),
                midHash: "",
                content: msg,
                ctime: attrs[4]/1000,
                weight: 6,
                idStr: "0"
            }
            var msgElem = dmElem.create(elem);
            list.push(msgElem);
        }
        var msgList = dmList.create({ elems: list });
        var protoList = dmList.encode(msgList).finish();
        danmaku = protoList.buffer;
    }
    ah.proxy({
        onRequest: (config, handler) => {
            handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
            handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            var reHistory = /api\.bilibili\.com\/x\/v[1-2]\/dm\/history\?type=1/
            var reDataProtobuf = /api\.bilibili\.com\/x\/v2\/dm\/web\/seg\.so.+/
            var videoState = /api\.bilibili\.com\/x\/web-interface\/archive\/stat/
            var pageList = /api\.bilibili\.com\/x\/player\/pagelist/
            if (reDataProtobuf.test(response.config.url)) {
                if(danmaku){
                    response.response = danmaku;
                    danmaku = undefined;
                }
            }
            if (pageList.test(response.config.url)) {
                var pageListData = JSON.parse(response.response);
                videoInfo = pageListData.data
            }
            handler.next(response)
        }
    })
})();