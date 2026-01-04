/* globals jQuery, $, JSZip, saveAs, waitForKeyElements */
// ==UserScript==
// @name         幕布导出Xmind文件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  mubu html export to xmind For Lily
// @author       xyan9
// @match        file:///*
// @license MIT
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdn.bootcdn.net/ajax/libs/jszip/3.6.0/jszip.min.js
// @require https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/452972/%E5%B9%95%E5%B8%83%E5%AF%BC%E5%87%BAXmind%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/452972/%E5%B9%95%E5%B8%83%E5%AF%BC%E5%87%BAXmind%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

function Father(name){
    let o = new Object()
    o = {
        "id": genFather(),
        "class": "sheet",
        "title": "画布 1",
        "rootTopic": {
            "id": genFather(),
            "class": "topic",
            "title": name,
            "structureClass": "org.xmind.ui.logic.right",
            "style": {
                "id": genId(),
                "properties": {
                    "svg:fill": "#3949AB",
                    "border-line-color": "none",
                    "line-color": "#141414",
                    "fo:color": "#FFFFFF",
                    "shape-class": "org.xmind.topicShape.roundedRect",
                    "line-class": "org.xmind.branchConnection.roundedElbow",
                    "line-width": "3pt",
                    "line-pattern": "solid",
                    "fill-pattern": "solid",
                    "border-line-width": "0pt",
                    "border-line-pattern": "solid",
                    "arrow-end-class": "org.xmind.arrowShape.none",
                    "alignment-by-level": "inactived",
                    "fo:font-family": "'NeverMind','Microsoft YaHei','PingFang SC','Microsoft JhengHei',sans-serif",
                    "fo:font-style": "normal",
                    "fo:font-weight": 500,
                    "fo:font-size": "30pt",
                    "fo:text-transform": "manual",
                    "fo:text-decoration": "none",
                    "fo:text-align": "center"
                }
            },
            "children": {
                "attached": [

                ]
            }
        },
        "extensions": [
            {
                "provider": "org.xmind.ui.skeleton.structure.style",
                "content": {
                    "centralTopic": "org.xmind.ui.map.clockwise",
                    "mainTopic": "org.xmind.ui.logic.right"
                }
            }
        ],
        "theme": {
            "id": genId(),
            "centralTopic": {
                "id": genId(),
                "properties": {
                    "svg:fill": "#000229",
                    "line-color": "#000229",
                    "shape-class": "org.xmind.topicShape.roundedRect",
                    "line-class": "org.xmind.branchConnection.curve",
                    "line-width": "3pt",
                    "line-pattern": "solid",
                    "fill-pattern": "solid",
                    "border-line-width": "0pt",
                    "arrow-end-class": "org.xmind.arrowShape.none",
                    "alignment-by-level": "inactived",
                    "fo:font-family": "NeverMind",
                    "fo:font-style": "normal",
                    "fo:font-weight": 500,
                    "fo:font-size": "30pt",
                    "fo:text-transform": "manual",
                    "fo:text-decoration": "none",
                    "fo:text-align": "center"
                }
            },
            "mainTopic": {
                "id": genId(),
                "properties": {
                    "shape-class": "org.xmind.topicShape.roundedRect",
                    "line-class": "org.xmind.branchConnection.roundedElbow",
                    "line-width": "2pt",
                    "fill-pattern": "solid",
                    "border-line-width": "0pt",
                    "fo:font-family": "NeverMind",
                    "fo:font-style": "normal",
                    "fo:font-weight": 500,
                    "fo:font-size": "18pt",
                    "fo:text-transform": "manual",
                    "fo:text-decoration": "none",
                    "fo:text-align": "left"
                }
            },
            "subTopic": {
                "id":genId(),
                "properties": {
                    "shape-class": "org.xmind.topicShape.roundedRect",
                    "line-class": "org.xmind.branchConnection.roundedElbow",
                    "line-width": "2pt",
                    "fill-pattern": "solid",
                    "border-line-width": "0pt",
                    "fo:font-family": "NeverMind",
                    "fo:font-style": "normal",
                    "fo:font-weight": 400,
                    "fo:font-size": "14pt",
                    "fo:text-transform": "manual",
                    "fo:text-decoration": "none",
                    "fo:text-align": "left"
                }
            },
            "summaryTopic": {
                "id": genId(),
                "properties": {
                    "svg:fill": "none",
                    "border-line-color": "#000229",
                    "shape-class": "org.xmind.topicShape.roundedRect",
                    "line-class": "org.xmind.branchConnection.roundedElbow",
                    "fill-pattern": "solid",
                    "fo:font-family": "NeverMind",
                    "fo:font-style": "normal",
                    "fo:font-weight": "400",
                    "fo:font-size": "14pt",
                    "fo:text-transform": "manual",
                    "fo:text-decoration": "none",
                    "fo:text-align": "left"
                }
            },
            "calloutTopic": {
                "id": genId(),
                "properties": {
                    "svg:fill": "#000229",
                    "border-line-color": "#000229",
                    "callout-shape-class": "org.xmind.calloutTopicShape.balloon.roundedRect",
                    "fill-pattern": "solid",
                    "fo:font-family": "NeverMind",
                    "fo:font-style": "normal",
                    "fo:font-weight": 400,
                    "fo:font-size": "14pt",
                    "fo:text-transform": "manual",
                    "fo:text-decoration": "none",
                    "fo:text-align": "left"
                }
            },
            "floatingTopic": {
                "id": genId(),
                "properties": {
                    "svg:fill": "#EEEBEE",
                    "border-line-color": "#EEEBEE",
                    "shape-class": "org.xmind.topicShape.roundedRect",
                    "line-class": "org.xmind.branchConnection.roundedElbow",
                    "line-width": "2pt",
                    "line-pattern": "solid",
                    "fill-pattern": "solid",
                    "border-line-width": "0pt",
                    "arrow-end-class": "org.xmind.arrowShape.none",
                    "fo:font-family": "NeverMind",
                    "fo:font-style": "normal",
                    "fo:font-weight": 500,
                    "fo:font-size": "14pt",
                    "fo:text-transform": "manual",
                    "fo:text-decoration": "none",
                    "fo:text-align": "left"
                }
            },
            "boundary": {
                "id": genId(),
                "properties": {
                    "svg:fill": "#000229",
                    "line-color": "#000229",
                    "shape-class": "org.xmind.boundaryShape.roundedRect",
                    "shape-corner": "20pt",
                    "line-width": "2",
                    "line-pattern": "dash",
                    "fill-pattern": "solid",
                    "fo:font-family": "'NeverMind','Microsoft YaHei','PingFang SC','Microsoft JhengHei','sans-serif',sans-serif",
                    "fo:font-style": "normal",
                    "fo:font-weight": 400,
                    "fo:font-size": "14pt",
                    "fo:text-transform": "manual",
                    "fo:text-decoration": "none",
                    "fo:text-align": "center"
                }
            },
            "summary": {
                "id":genId(),
                "properties": {
                    "line-color": "#000229",
                    "shape-class": "org.xmind.summaryShape.round",
                    "line-width": "2pt",
                    "line-pattern": "solid",
                    "line-corner": "8pt"
                }
            },
            "relationship": {
                "id": genId(),
                "properties": {
                    "line-color": "#000229",
                    "shape-class": "org.xmind.relationshipShape.curved",
                    "line-width": "2",
                    "line-pattern": "dash",
                    "arrow-begin-class": "org.xmind.arrowShape.none",
                    "arrow-end-class": "org.xmind.arrowShape.triangle",
                    "fo:font-family": "'NeverMind','Microsoft YaHei','PingFang SC','Microsoft JhengHei','sans-serif',sans-serif",
                    "fo:font-style": "normal",
                    "fo:font-weight": 400,
                    "fo:font-size": "13pt",
                    "fo:text-transform": "manual",
                    "fo:text-decoration": "none",
                    "fo:text-align": "center"
                }
            },
            "map": {
                "id": genId(),
                "properties": {
                    "svg:fill": "#FFFFFF",
                    "multi-line-colors": "#F9423A #F6A04D #F3D321 #00BC7B #486AFF #4D49BE",
                    "color-list": "#000229 #1F2766 #52CC83 #4D86DB #99142F #245570",
                    "line-tapered": "none"
                }
            },
            "importantTopic": {
                "id": genId(),
                "properties": { "svg:fill": "#460400", "fill-pattern": "solid" }
            },
            "minorTopic": {
                "id": genId(),
                "properties": { "svg:fill": "#703D00", "fill-pattern": "solid" }
            },
            "colorThemeId": "Rainbow-#000229-MULTI_LINE_COLORS",
            "expiredTopic": {
                "id":genId(),
                "properties": {
                    "fo:text-decoration": "line-through",
                    "svg:fill": "none"
                }
            },
            "global": {
                "id": genId(),
                "properties": {}
            },
            "skeletonThemeId": genFather(),
        },
        "topicPositioning": "fixed",
        "coreVersion": "2.74.0",
        "relationships": []
    }

    return o
}

function Manifest(imglist){
    let o = new Object()
    o = {
        "file-entries": {
            "content.json": {},
            "metadata.json": {},
            "Thumbnails/thumbnail.png": {}
        }
    }
    //console.log(o)
    for(let i = 0;i < imglist.length;i ++){
        o["file-entries"]["resources/" + imglist[i]]= {}
    }
    //console.log(o)
    return o;
}

function MetaData(sheet){
    let o = new Object()
    o = {
        "creator": { "name": "Vana", "version": "22.09.3168.202209272032" },
        "activeSheetId": sheet
    }
    return o
}

let imgList = [];

let zip

let thumbnail = 'data:image/png;base64,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'

function toZip() {
    var file = document.getElementById("fileID");
    zip = new JSZip();
    let res = getFather()
    //return
    zip.file('content.json', '[' + JSON.stringify(res) + ']')
    zip.file('manifest.json', JSON.stringify(Manifest(imgList)))
    zip.file('metadata.json', JSON.stringify(MetaData(res.id)))
    zip.file('Thumbnails/thumbnail.png', base64StrToBlob(thumbnail))

    zip.generateAsync({
        type: "blob",
    }).then(function (content) {
        saveAs(content, 'mubuexport' + new Date().getTime() + '.xmind');
    });
}

(function() {
    'use strict';

    // Your code here...
    var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:0;left:0px;'>" +
        "<div id='fun1' style='font-size:12px;padding:12px 30px;color:#FFF;background-color:#25AE84;'>导出</div>" +
        "</div>";
    $("body").append(topBox);


    $("body").on("click", "#fun1", function() {
        toZip()
    });

    // exportRaw('content.json', JSON.stringify(father))
})();

function getFather(){
    let title = $(".title").eq(0).html();
    let fatherList = $(".node-list:eq(0)").children()

    let father = new Father(title)

    for(let i = 0;i < fatherList.length;i ++){
        let sonList = fatherList.eq(i)
        let node = createTree(sonList)
        father.rootTopic.children.attached.push(node)
    }

    return father
}

function genWord(len){
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let str = ""

    for (let i = 0; i < len; i++) {
        let index = Math.round(Math.random() * (arr.length - 1));
        str += arr[index];
    }
    return str;
}

function genId(){
    return genWord(8) + '-' + genWord(4) + '-' + genWord(4) + '-' + genWord(4) + '-' + genWord(12)
}

function genFather(){
    return genWord(26)
}

function Node(name){
    let o = new Object()
    o = {
        "title": name,
        "id": genId(),
        "style": {
            "id": genId(),
            "properties": {
                "svg:fill": "none",
                "border-line-color": "#232323",
                "line-color": "#232323",
                "fo:color": "#0A0E16",
                "shape-class": "org.xmind.topicShape.underline",
                "line-class": "org.xmind.branchConnection.roundedElbow",
                "line-width": "2pt",
                "line-pattern": "solid",
                "fill-pattern": "solid",
                "border-line-width": "2pt",
                "border-line-pattern": "solid",
                "arrow-end-class": "org.xmind.arrowShape.none",
                "fo:font-family": "'NeverMind','Microsoft YaHei','PingFang SC','Microsoft JhengHei',sans-serif",
                "fo:font-style": "normal",
                "fo:font-weight": 400,
                "fo:font-size": "14pt",
                "fo:text-transform": "manual",
                "fo:text-decoration": "none",
                "fo:text-align": "left"
            },
            "children": {
                "attached": []
            }
        },
        "children": {
            "attached": []
        }
    }
    return o;
}

function createTree(sonNode){
    // console.log(sonList)
    let title = sonNode.children(".content").text()
    let childNum = sonNode.children(".children").length
    let noteNum = sonNode.children(".note").length
    let imgNum = sonNode.children(".image-list").length
    let fatherNode = new Node(title)

    if(noteNum != 0){
        let nodeTitle = sonNode.children(".note").text()
        fatherNode.children.callout= [
            {
                "id": genId(),
                "title": nodeTitle,
                "children": {}
            }
        ]
    }
    if(imgNum != 0){
        let imageSrc = sonNode.children(".image-list").children(".image-item").eq(0).children("img").attr("src")
        // console.log("imgsrc:" + imageSrc)
        let imgUrl = imageSrc
        imageSrc = imageSrc.split("/")
        imageSrc = imageSrc[imageSrc.length - 1]
        imgList.push(imageSrc)
        let request = new XMLHttpRequest();
        request.overrideMimeType('text/plain; charset=x-user-defined');
        request.open('GET', imgUrl, false);
        request.send();
        let pic = Uint8Array.from(request.response, c => c.charCodeAt(0));
        // console.log(pic)
        zip.file('resources/' + imageSrc, pic)
        fatherNode.image = {
            "src": "xap:resources/" + imageSrc
        }
    }
    // console.log(title)

    if(childNum != 0){
        let sonList = sonNode.children(".children").children(".node-list").children()
        for(let i = 0;i < sonList.length;i ++){
            let tempNode = sonList.eq(i)
            let node = createTree(tempNode)
            fatherNode.children.attached.push(node)
        }
    }
    return fatherNode
}

function base64StrToBlob(base64Str) {
    const arr = base64Str.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}
