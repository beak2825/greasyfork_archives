// ==UserScript==
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBNTlBOEI1NDc1REExMUU2OTM4MkI1QjIwMkY4Nzg2MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMEQ2QzQwMURCRjQxMUU4QUEwMkUxQkU3Q0REQTE2OSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMEQ2QzQwMERCRjQxMUU4QUEwMkUxQkU3Q0REQTE2OSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmI2ODI5YTYzLWNmYTMtYWM0ZS04ZjBhLWIzMjJkOGJmMGZjMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNTlBOEI1NDc1REExMUU2OTM4MkI1QjIwMkY4Nzg2MyIvPiA8L3Jk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
// @name         ZFDev-百度网盘文件树视图
// @namespace    https://zfdev.com/
// @version      0.4
// @description  添加文件树视图，全局查看文件详情
// @author       ZFDev
// @match        https://pan.baidu.com/s/1*
// @match        https://yun.baidu.com/s/1*
// @require        https://cdn.staticfile.org/html2canvas/0.5.0-beta4/html2canvas.js
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/374408/ZFDev-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E6%A0%91%E8%A7%86%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/374408/ZFDev-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E6%A0%91%E8%A7%86%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.zfdev-tree-manager{background: white;}.zfdev-tree-manager .treeview-node {cursor: unset;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;height: 30px;position: relative;}.zfdev-tree-manager .treeview-node .treeview-txt{cursor: auto;-webkit-user-select: auto;-moz-user-select: auto;-ms-user-select: auto;user-select: auto;}.zfdev-tree-manager .treeview-node:not(.treeview-node-on) {border-bottom: 1px solid #f2f6fd;}.zfdev-tree-manager .treeview-node:hover {background: #e5f0fb;}.zfdev-tree-manager .treeview-node .treeview-node-handler {display: inline-block;min-width: 60%;width: auto;}.zfdev-tree-manager .treeview-node .treeview-size,.zfdev-tree-manager .treeview-node .treeview-time{position: relative;display: inline-block;color: #666;}.zfdev-tree-manager .treeview-node .treeview-size{width:16%;}.zfdev-tree-manager .treeview-node .treeview-time{width:23%;}.zfdev-tree-manager .treeview-node .treeview-txt{width: 80%;padding-right: 10px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}#gengrate-image-copy-dom li,#gengrate-image-copy-dom ul.treeview, {width: max-content;}#gengrate-image-copy-dom .treeview-node{padding-right: 60px;height: 30px;border-bottom: 1px solid #f2f6fd;}#gengrate-image-copy-dom .treeview-node-handler{margin-right: 0!important;}#gengrate-image-copy-dom .treeview-node span {width: 100%;}#zfdev-treeview-img-div{max-height: 800px;position: absolute;z-index: 99999999;top: 50%;left: 50%;transform: translate(-50%,-50%);box-sizing: border-box;-webkit-box-shadow: 0 0.5em 1em 0.5em rgba(0,0,0,.19);box-shadow: 0 0.5em 1em 0.5em rgba(0,0,0,.19);border-bottom-left-radius: .3em;border-bottom-right-radius: .3em;padding: 10px;}#zfdev-treeview-img-div em{height: 25px;width: 25px;padding: 0;margin: 0;line-height: 25px;font-size: 12px;}#zfdev-treeview-img-div > div > a{border-radius: 50%;position: absolute;right: -20px;width: 25px;line-height: 25px;height: 25px;background-color: white;box-shadow: rgba(0, 0, 0, 0.19) 0px 0.3px 1em 0.3px;border: 1px solid rgb(192, 217, 254);padding: 0px;margin-right: 0px;text-align: center;}');
    GM_addStyle('@font-face{font-family:"iconfont-zfdev-filetree";src:url(data:font/truetype;charset=utf-8;base64,AAEAAAALAIAAAwAwR1NVQrD+s+0AAAE4AAAAQk9TLzI8fUhsAAABfAAAAFZjbWFws/QcPQAAAeQAAAGcZ2x5ZqQfxqgAAAOMAAABjGhlYWQTLAKJAAAA4AAAADZoaGVhB94DhQAAALwAAAAkaG10eBAAAAAAAAHUAAAAEGxvY2EBAgCUAAADgAAAAAptYXhwARcARQAAARgAAAAgbmFtZYx+aQAAAAUYAAADIXBvc3QPWfb4AAAIPAAAAEoAAQAAA4D/gABcBAAAAAAABAAAAQAAAAAAAAAAAAAAAAAAAAQAAQAAAAEAAEEtmIxfDzz1AAsEAAAAAADYBl9GAAAAANgGX0YAAP+ABAADgAAAAAgAAgAAAAAAAAABAAAABAA5AAkAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKAB4ALAABREZMVAAIAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAAAAQQAAZAABQAIAokCzAAAAI8CiQLMAAAB6wAyAQgAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA5gfmegOA/4AAXAOAAIAAAAABAAAAAAAABAAAAAQAAAAEAAAABAAAAAAAAAUAAAADAAAALAAAAAQAAAFoAAEAAAAAAGIAAwABAAAALAADAAoAAAFoAAQANgAAAAgACAACAADmB+Yx5nr//wAA5gfmMeZ6//8AAAAAAAAAAQAIAAgACAAAAAMAAQACAAABBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAA0AAAAAAAAAAMAAOYHAADmBwAAAAMAAOYxAADmMQAAAAEAAOZ6AADmegAAAAIAAAAAADwAlADGAAAAAgAA/4wD9AN0AAsAHgAAAQYABxYAFzYANyYAEwEHBiIvAiY0NjIfAQE2MhYUAgDU/uUFBQEb1NQBGwUF/uU+/rYEChsKA6QJExoKkQE3ChoTA3QF/uXU1P7lBQUBG9TUARv+of62BAoKBKQKGhMJkQE3ChQaAAAACQAA/5QD1gM8ABUAGgAeACMAJwAsADAANAA4AAABFSM1MzUjNSMRIRUzNSMVIzUzFTM1Ex0BITUHITUhBR0BITUHITUhBR0BITUHITUhARUhNQchNSEB1urq6iQBDgIC6uoCEQHsJP5cAaT+OAHsJP5cAaT+OAHsJP5cAaT8cQHSOf6eAWIBDyvMJJ/9WCt7LNArewEMNmSaajrMNmSaajrANmSaajoDPdLSrIkAAAACAAD/gAQAA4AACwAXAAABHgEXDgEHLgEnPgE3BgAHFgAXNgA3JgACAL79BQX9vr79BQX9vtr+3wUFASHa2gEhBQX+3wNABf2+vv0FBf2+vv1FBf7f2tr+3wUFASHa2gEhAAAAAAASAN4AAQAAAAAAAAAVAAAAAQAAAAAAAQAXABUAAQAAAAAAAgAHACwAAQAAAAAAAwAXADMAAQAAAAAABAAXAEoAAQAAAAAABQALAGEAAQAAAAAABgAXAGwAAQAAAAAACgArAIMAAQAAAAAACwATAK4AAwABBAkAAAAqAMEAAwABBAkAAQAuAOsAAwABBAkAAgAOARkAAwABBAkAAwAuAScAAwABBAkABAAuAVUAAwABBAkABQAWAYMAAwABBAkABgAuAZkAAwABBAkACgBWAccAAwABBAkACwAmAh0KQ3JlYXRlZCBieSBpY29uZm9udAppY29uZm9udC16ZmRldi1maWxldHJlZVJlZ3VsYXJpY29uZm9udC16ZmRldi1maWxldHJlZWljb25mb250LXpmZGV2LWZpbGV0cmVlVmVyc2lvbiAxLjBpY29uZm9udC16ZmRldi1maWxldHJlZUdlbmVyYXRlZCBieSBzdmcydHRmIGZyb20gRm9udGVsbG8gcHJvamVjdC5odHRwOi8vZm9udGVsbG8uY29tAAoAQwByAGUAYQB0AGUAZAAgAGIAeQAgAGkAYwBvAG4AZgBvAG4AdAAKAGkAYwBvAG4AZgBvAG4AdAAtAHoAZgBkAGUAdgAtAGYAaQBsAGUAdAByAGUAZQBSAGUAZwB1AGwAYQByAGkAYwBvAG4AZgBvAG4AdAAtAHoAZgBkAGUAdgAtAGYAaQBsAGUAdAByAGUAZQBpAGMAbwBuAGYAbwBuAHQALQB6AGYAZABlAHYALQBmAGkAbABlAHQAcgBlAGUAVgBlAHIAcwBpAG8AbgAgADEALgAwAGkAYwBvAG4AZgBvAG4AdAAtAHoAZgBkAGUAdgAtAGYAaQBsAGUAdAByAGUAZQBHAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAHMAdgBnADIAdAB0AGYAIABmAHIAbwBtACAARgBvAG4AdABlAGwAbABvACAAcAByAG8AagBlAGMAdAAuAGgAdAB0AHAAOgAvAC8AZgBvAG4AdABlAGwAbABvAC4AYwBvAG0AAAAAAgAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAQIBAwEEAQUACXh1YW56aG9uZwdzaHV4aW5nCnVuc2VsZWN0ZWQAAAAA) format("truetype");font-weight:normal;font-style:normal;}.iconfont-zfdev-filetree{font-family:"iconfont-zfdev-filetree" !important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;display:inline-block;}.icon-shuxing:before{content:"\\e67a";}.icon-xuanzhong:before{content:"\\e631";}.icon-unselected:before{content:"\\e607";}');

    let log = function() {
        // console.log.apply(console, arguments)
    };
    let filesIcon = {
        "bt": ["fileicon-small-bt", "fileicon-large-bt", "fileicon-middle-bt"],
        "torrent": ["fileicon-small-bt", "fileicon-large-bt", "fileicon-middle-bt"],
        "dws": ["fileicon-small-dws", "fileicon-large-dws", "fileicon-middle-dws"],
        "dwt": ["fileicon-small-dws", "fileicon-large-dws", "fileicon-middle-dws"],
        "dxf": ["fileicon-small-dws", "fileicon-large-dws", "fileicon-middle-dws"],
        "dwg": ["fileicon-small-dws", "fileicon-large-dws", "fileicon-middle-dws"],
        "cad": ["fileicon-small-dws", "fileicon-large-dws", "fileicon-middle-dws"],
        "as": ["fileicon-small-code", "fileicon-large-code"],
        "sh": ["fileicon-small-code", "fileicon-large-code"],
        "c": ["fileicon-small-code", "fileicon-large-code"],
        "cpp": ["fileicon-small-code", "fileicon-large-code"],
        "h": ["fileicon-small-code", "fileicon-large-code"],
        "cs": ["fileicon-small-code", "fileicon-large-code"],
        "asp": ["fileicon-small-code", "fileicon-large-code"],
        "css": ["fileicon-small-code", "fileicon-large-code"],
        "pas": ["fileicon-small-code", "fileicon-large-code"],
        "diff": ["fileicon-small-code", "fileicon-large-code"],
        "patch": ["fileicon-small-code", "fileicon-large-code"],
        "erl": ["fileicon-small-code", "fileicon-large-code"],
        "groovy": ["fileicon-small-code", "fileicon-large-code"],
        "java": ["fileicon-small-code", "fileicon-large-code"],
        "jsp": ["fileicon-small-code", "fileicon-large-code"],
        "js": ["fileicon-small-code", "fileicon-large-code"],
        "json": ["fileicon-small-code", "fileicon-large-code"],
        "pl": ["fileicon-small-code", "fileicon-large-code"],
        "php": ["fileicon-small-code", "fileicon-large-code"],
        "py": ["fileicon-small-code", "fileicon-large-code"],
        "rb": ["fileicon-small-code", "fileicon-large-code"],
        "sass": ["fileicon-small-code", "fileicon-large-code"],
        "scss": ["fileicon-small-code", "fileicon-large-code"],
        "scala": ["fileicon-small-code", "fileicon-large-code"],
        "sql": ["fileicon-small-code", "fileicon-large-code"],
        "vb": ["fileicon-small-code", "fileicon-large-code"],
        "xml": ["fileicon-small-code", "fileicon-large-code"],
        "xhtml": ["fileicon-small-code", "fileicon-large-code"],
        "html": ["fileicon-small-code", "fileicon-large-code"],
        "htm": ["fileicon-small-code", "fileicon-large-code"],
        "md": ["fileicon-small-code", "fileicon-large-code"],
        "less": ["fileicon-small-code", "fileicon-large-code"],
        "lua": ["fileicon-small-code", "fileicon-large-code"],
        "go": ["fileicon-small-code", "fileicon-large-code"],
        "bat": ["fileicon-small-code", "fileicon-large-code"],
        "wml": ["fileicon-small-code", "fileicon-large-code"],
        "txt": ["fileicon-small-txt", "fileicon-large-txt", "fileicon-middle-txt"],
        "rtf": ["fileicon-small-txt", "fileicon-large-txt", "fileicon-middle-txt"],
        "pdf": ["fileicon-small-pdf", "fileicon-large-pdf", "fileicon-middle-pdf"],
        "doc": ["fileicon-small-doc", "fileicon-large-doc", "fileicon-middle-doc"],
        "docx": ["fileicon-small-doc", "fileicon-large-doc", "fileicon-middle-doc"],
        "ppt": ["fileicon-small-ppt", "fileicon-large-ppt", "fileicon-middle-ppt"],
        "pptx": ["fileicon-small-ppt", "fileicon-large-ppt", "fileicon-middle-ppt"],
        "xls": ["fileicon-small-xls", "fileicon-large-xls", "fileicon-middle-xls"],
        "xlsx": ["fileicon-small-xls", "fileicon-large-xls", "fileicon-middle-xls"],
        "vsd": ["fileicon-small-vsd", "fileicon-large-vsd", "fileicon-middle-vsd"],
        "jpg": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "jpeg": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "livp": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "gif": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "bmp": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "png": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "jpe": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "cur": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "svgz": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "tif": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "tiff": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "ico": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "heic": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "heif": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "avci": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "mmap": ["fileicon-small-mmap", "fileicon-large-mmap", "fileicon-middle-mmap"],
        "xmind": ["fileicon-small-xmind", "fileicon-large-xmind", "fileicon-middle-xmind"],
        "mm": ["fileicon-small-mm", "fileicon-large-mm", "fileicon-middle-mm"],
        "wma": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "wav": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "mp3": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "aac": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "ra": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "ram": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "mp2": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "ogg": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "aif": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "mpega": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "amr": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "mid": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "midi": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "m4a": ["fileicon-small-mp3", "fileicon-large-mp3", "fileicon-middle-mp3"],
        "jpg": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "jpeg": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "gif": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "bmp": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "png": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "jpe": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "cur": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "svgz": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "tif": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "tiff": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "ico": ["fileicon-small-pic", "default-large", "fileicon-middle-pic"],
        "exe": ["fileicon-sys-s-exe", "fileicon-sys-l-exe"],
        "msi": ["fileicon-sys-s-exe", "fileicon-sys-l-exe"],
        "dmg": ["fileicon-sys-s-exe", "fileicon-sys-l-dmg"],
        "pkg": ["fileicon-sys-s-exe", "fileicon-sys-l-dmg"],
        "psd": ["fileicon-sys-s-psd", "fileicon-sys-l-psd"],
        "apk": ["fileicon-sys-s-apk", "fileicon-sys-l-apk"],
        "key": ["fileicon-sys-s-key", "fileicon-sys-l-key"],
        "ai": ["fileicon-sys-s-ai", "fileicon-sys-l-ai"],
        "ipa": ["fileicon-sys-s-ipa", "fileicon-sys-l-ipa"],
        "pages": ["fileicon-sys-s-pages", "fileicon-sys-l-pages"],
        "numbers": ["fileicon-sys-s-numbers", "fileicon-sys-l-numbers"],
        "eot": ["fileicon-sys-s-fonts", "fileicon-sys-l-fonts"],
        "ttf": ["fileicon-sys-s-fonts", "fileicon-sys-l-fonts"],
        "woff": ["fileicon-sys-s-fonts", "fileicon-sys-l-fonts"],
        "eps": ["fileicon-sys-s-eps", "fileicon-sys-l-eps"],
        "lnk": ["fileicon-sys-s-links", "fileicon-sys-l-links"],
        "link": ["fileicon-sys-s-links", "fileicon-sys-l-links"],
        "swf": ["fileicon-sys-s-swf", "fileicon-sys-l-swf"],
        "php": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "c": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "js": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "css": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "html": ["fileicon-sys-s-web", "fileicon-sys-l-web"],
        "htm": ["fileicon-sys-s-web", "fileicon-sys-l-web"],
        "xhtml": ["fileicon-sys-s-web", "fileicon-sys-l-web"],
        "java": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "cc": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "python": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "json": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "sh": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "bat": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "ejs": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "xml": ["fileicon-sys-s-code", "fileicon-sys-l-code"],
        "ts": ["fileicon-sys-s-video", "fileicon-sys-l-video"],
        "wmv": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "rmvb": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "mpeg4": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "mpeg2": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "flv": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "avi": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "3gp": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "mpga": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "qt": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "rm": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "wmz": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "wmd": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "wvx": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "wmx": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "wm": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "mpg": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "mp4": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "mkv": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "mpeg": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "mov": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "asf": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "m4v": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "m3u8": ["fileicon-small-video", "fileicon-large-video", "fileicon-middle-video"],
        "rar": ["fileicon-small-zip", "fileicon-large-zip", "fileicon-middle-zip"],
        "zip": ["fileicon-small-zip", "fileicon-large-zip", "fileicon-middle-zip"],
        "other": ["default-small", "default-large", ]
    };
    const name_re = new RegExp().compile(/(^[\d]*)/);
    const name_re2 = new RegExp().compile(/\d/g);

    function listSort(a, b) {
        if (a.isdir === b.isdir) {
            let key = "server_filename";
            let n1 = a[key].match(name_re),
                n2 = b[key].match(name_re);
            if (n1 === null || n2 === null) {
                return (a[key] + "").localeCompare(b[key] + "")
            } else {
                return parseInt(n1.join("")) - parseInt(n2.join(""))
            }
        } else {
            return a.isdir ? -1 : 1
        }
    }

    function listSort2(a, b) {
        if (a.isdir === b.isdir) {
            let key = "server_filename";
            let n1 = a[key].match(name_re2),
                n2 = b[key].match(name_re2);
            if (n1 === null || n2 === null) {
                return (a[key] + "").localeCompare(b[key] + "")
            } else {
                return parseInt(n1.join("")) - parseInt(n2.join(""))
            }
        } else {
            return a.isdir ? -1 : 1
        }
    }

    function pathChange(path) {
        let parentPath = yunData.FILEINFO[0].parent_path;
        let old = location.hash.split("&");
        let newArr = [];
        path = path.substring(0, path.lastIndexOf("/"))
        if (path === decodeURIComponent(parentPath)) {
            path = "/"
        }
        newArr.push("#list/path=" + encodeURIComponent(path));
        if (parentPath) {
            newArr.push("parentPath=" + parentPath)
        }
        old.forEach(function(item, i) {
            let data = item.split("=");
            if (data[0] === "#list/path") {} else if (data[0] === "parentPath") {} else {
                newArr.push(item)
            }
        });
        location.hash = newArr.join("&")
    }

    function conver_size_int_to_str(limit) {
        let size = "";
        let bit = 1;
        if (limit < Math.pow(1024, 1)) {
            size = limit.toFixed(bit) + "B"
        } else if (limit < Math.pow(1024, 2)) {
            size = (limit / Math.pow(1024, 1)).toFixed(bit) + "K"
        } else if (limit < Math.pow(1024, 3)) {
            size = (limit / (Math.pow(1024, 2))).toFixed(bit) + "M"
        } else {
            size = (limit / (Math.pow(1024, 3))).toFixed(bit) + "G"
        }
        let sizestr = size + "";
        let len = sizestr.indexOf(".");
        let dec = sizestr.substr(len + 1, bit);
        if (dec === "00") {
            return sizestr.substring(0, len) + sizestr.substr(len + bit + 1, 2)
        }
        return sizestr
    }

    function conver_size_str_to_int(sizestr) {
        let size = 0;
        if (sizestr.substring(sizestr.length - 2) === s.z) {
            size = parseInt(sizestr.substring(0, sizestr.length - 2)) * Math.pow(1024, 1)
        } else if (sizestr.substring(sizestr.length - 1) === s.v) {
            size = parseInt(sizestr.substring(0, sizestr.length - 1)) * Math.pow(1024, 2)
        } else if (sizestr.substring(sizestr.length - 1) === s.w) {
            size = parseInt(sizestr.substring(0, sizestr.length - 1)) * Math.pow(1024, 3)
        } else if (sizestr.substring(sizestr.length - 1) === s.aa) {
            size = parseInt(sizestr.substring(0, sizestr.length - 1)) * Math.pow(1024, 4)
        } else {}
        return size
    }
    Date.prototype.format = function() {
        return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + " " + this.getHours() + ":" + this.getMinutes()
    };

    function formatDateTime(inputTime) {
        var date = new Date(inputTime);
        return date.format()
    };
    let get_uk = function() {
        return yunData.SHARE_UK
    };
    let get_shareid = function() {
        return yunData.SHARE_ID
    };
    let getCacheData = function(path) {
        path = path.substring(0, 1) != "/" ? "/" + path : path;
        if (cache.list.data.hasOwnProperty(path)) {
            if (cache.list.data[path].hasMore) {
                return false
            }
            return cache.list.data[path].list.sort(listSort2).sort(listSort)
        } else {
            return false
        }
    }
    let getList = function(path, page = 1) {
        return new Promise(function(resolve, reject) {
            if (page === 1) {
                path = path.substring(0, 1) != "/" ? "/" + path : path;
                path = encodeURIComponent(path)
            }
            let uk = get_uk(),
                shareid = get_shareid(),
                url = `/share/list?uk=${uk}&shareid=${shareid}&page=${page}&num=100&dir=${path}`;
            $.ajax({
                type: "GET",
                url: url,
                cache: false,
                async: true,
                success: function(res) {
                    if (res && res.list.length === 100) {
                        getList(path, page + 1).then(res2 => {
                            res.list.push.apply(res.list, res2.list);
                            resolve(res)
                        })
                    } else {
                        resolve(res)
                    }
                },
                failure: function(result) {
                    reject(false)
                },
                error: function(result) {
                    reject(false)
                },
            })
        })
    };
    let addNode = function(node, item, level) {},
        getItme = function(node) {},
        setState = function(node) {},
        itemToHTML = function(item, level, index) {
            let html = `<li><div class="treeview-node ${item.isdir ? '' : 'treenode-empty'}    "_pl="${level*15}px"style="padding-left:${level*15}px"><span class="treeview-node-handler"style="    margin-right: ${-((level-2)*15)}px;">${item.isdir?'':'<span style="position: absolute;left: 20px;color: #888;padding-left: '+((level-1)*15-10)+'px">'+index+'.</span>'}<em class="b-in-blk plus icon-operate"></em>${item.isdir?'<dfn class="b-in-blk treeview-ic">':getIconHTML(item.server_filename)}</dfn><span class="treeview-txt"node-level="${level}"node-path="${item.path}"node-category="${item.category}"node-fs_id="${item.fs_id}"node-isdir="${item.isdir}"node-local_ctime="${item.local_ctime}"node-local_mtime="${item.local_mtime}"node-md5="${item.md5}"node-server_ctime="${item.server_ctime}"node-server_filename="${item.server_filename}"node-server_mtime="${item.server_mtime}"node-size="${item.size}"owner-uk="">${item.server_filename}</span></span><div class="treeview-size">${item.isdir?'':conver_size_int_to_str(item.size)}</div><div class="treeview-time">${item.isdir?'':formatDateTime(item.server_mtime*1000)}</div></div><ul class="treeview  treeview-content treeview-collapse"_pl="${(level+1)*15}px"></ul></li>`;
            return html
        },
        listToHTML = function(list, level) {
            let html = "";
            let fileIndex = 0;
            for (let i = 0; i < list.length; i++) {
                if (!list[i].isdir) fileIndex++;
                html += itemToHTML(list[i], level, fileIndex)
            }
            return html
        },
        getIcon = function(filename) {
            let t = filename.lastIndexOf('.');
            if (t > 0) {
                let type = filename.substring(t + 1, filename.length);
                if (filesIcon.hasOwnProperty(type)) {
                    return filesIcon[type][0]
                }
            }
            return filesIcon.other[0]
        },
        getIconHTML = function(filename) {
            let html = '<dfn class="JS-fileicon '+ getIcon(filename) +'"style="height: 26px;width: 26px;display: inline-block;zoom: 1;vertical-align: middle;"></dfn>';
            return html
        };
    require.loadCss('/sns/box-static/disk-share/pkg/plugin_aef2d24.css')
    let treeHTML = '<div class="zfdev-tree-manager" id="zfdev-tree-manager" style="padding: 0 15px;"><div class="file-tree-container" style="overflow-y: auto; overflow-x: hidden;  height: 619px;"><ul class="treeview treeview-content"><li><div class="treeview-node   treeview-root _minus" _pl="0px" style="padding-left:0px"><span class="treeview-node-handler"><em class="b-in-blk plus icon-operate minus"></em><dfn class="b-in-blk treeview-ic"></dfn><span class="treeview-txt" node-path="/" node-isdir="1" owner-uk="">ZFDev Manager</span></span></div><ul class="treeview treeview-root-content treeview-content" _pl="15px"></ul></li></ul></div></div>';
    $('.KPDwCE').append(treeHTML);
    $("#zfdev-tree-manager .file-tree-container").css('height', $('#shareqr > div.KPDwCE  div.zJMtAEb div.NHcGw').css('height'));
    (function() {
        var observer = new MutationObserver(function(mutations, observer) {
            mutations.forEach(function(mutation) {
                $("#zfdev-tree-manager .file-tree-container").css('height', mutation.target.style.height)
            })
        });
        var config = {
            attributes: true,
            attributeOldValue: false,
            attributeFilter: ['style']
        };
        var el = document.querySelector('#shareqr > div.KPDwCE  div.zJMtAEb div.NHcGw');
        observer.observe(el, config)
    })();
    let $manager = $("#zfdev-tree-manager");
    let rowClick = function(e) {
        log("点击张开");
        let ul = e.parent().parent().next();
        let div = e.parent().parent();
        let textEle = e.next().next();
        let name = textEle.attr('node-server_filename');
        if (div.hasClass('treenode-empty')) {
            return false
        }
        if (e.hasClass('minus')) {
            ul.addClass('treeview-collapse');
            e.removeClass('minus');
            div.removeClass('_minus')
        } else {
            let path = textEle.attr('node-path'),
                level = textEle.attr('node-level'),
                isdir = parseInt(textEle.attr('node-isdir'));
            if (isdir && ul.children().length === 0) {
                let cureentCache = getCacheData(path);
                if (cureentCache) {
                    let html = listToHTML(cureentCache, parseInt(level) + 1);
                    ul.append(html)
                } else {
                    e.addClass('treeview-leaf-loading');
                    getList(path).then(res => {
                        e.removeClass('treeview-leaf-loading');
                        if (res && res.errno === 0) {
                            cache.list.data[path] = {
                                hasMore: false,
                                list: res.list.sort(listSort2).sort(listSort),
                                names: undefined,
                                share: 0
                            };
                            let html = listToHTML(res.list, parseInt(level) + 1);
                            ul.append(html);
                            if (res.list.length === 0) {
                                div.addClass('treenode-empty')
                            }
                        } else {
                            log('返回失败', res)
                        }
                    }, res => {
                        e.removeClass('treeview-leaf-loading')
                    })
                }
            }
            ul.removeClass('treeview-collapse');
            e.addClass('minus');
            div.addClass('_minus')
        }
    };
    $('body .zfdev-tree-manager').on('click', '.treeview-node', e => {
        log("点击张开");
        e = $(e.currentTarget);
        rowClick(e.find('em'));
        $('.treeview-node-on').removeClass('treeview-node-on');
        e.addClass('treeview-node-on');
        let path = e.find('.treeview-txt').attr('node-path');
        pathChange(path);
        setTimeout(function() {
            $('#shareqr div.zJMtAEb dd.JS-item-active .EOGexf').click();
            let name = e.find('.treeview-txt').attr('node-server_filename');
            $('#shareqr div.zJMtAEb dd:not(.JS-item-active):has(.file-name > .text:Contains("' + name + '")) .EOGexf').click()
        }, 200)
    });
    let btnHTML = '<a class="zfdev-tree-switch iconfont-zfdev-filetree icon-shuxing" value="false" href="javascript:void(0)"node-type="zfdev-tree"style="height:30px;width:30px;float:left;background:no-repeat;color:#5f6f95;font-size:20px;text-decoration:blink;"id="zfdev-tree-view-btn"></a>';
    $('#shareqr > div.module-toolbar div.list-grid-switch').append(btnHTML);
    $('#zfdev-tree-view-btn').click(function() {
        if ($('#zfdev-tree-manager').attr('value') === "true") {
            $('#shareqr > div.KPDwCE > div.zJMtAEb').css({
                display: 'block'
            });
            $('#shareqr > div.KPDwCE > div.fyQgAEb').css({
                display: 'none'
            });
            $('#zfdev-tree-manager').css({
                display: 'none'
            });
            $('#zfdev-tree-manager').attr('value', false)
        } else {
            $('#shareqr > div.KPDwCE > div.zJMtAEb').css({
                display: 'none'
            });
            $('#shareqr > div.KPDwCE > div.fyQgAEb').css({
                display: 'none'
            });
            $('#zfdev-tree-manager').css({
                display: ''
            });
            $('#zfdev-tree-manager').attr('value', true)
        }
    });
    $('#shareqr > div.KPDwCE > div.zJMtAEb, #shareqr > div.KPDwCE > div.fyQgAEb').click(function() {
        $('#zfdev-tree-manager').css({
            display: 'none'
        });
        $('#shareqr > div.KPDwCE > div.QxJxtg').css({
            display: ''
        })
    })
    let index = 0
    getCacheData('/').forEach(function(item, index) {
        let html = itemToHTML(item, 1, index);
        $manager.find('.treeview-root-content').append(html)
    })
    function listMenu(e) {
        var i = e("base:widget/libs/jquerypacket.js"),
            t = e("system-core:context/context.js").instanceForSystem,
            s = e("disk-share:widget/pageModule/list/listInit.js"),
            n = void 0,
            r = {
                treeTarget: "#zfdev-tree-manager",
            },
            copyItem = {},
            converItem = function(ele) {
                let item = {
                    category: parseInt(ele.attr('node-path')),
                    docpreview: ele.attr('node-docpreview'),
                    fs_id: parseInt(ele.attr('node-fs_id')),
                    isdir: parseInt(ele.attr('node-isdir')),
                    local_ctime: parseInt(ele.attr('node-local_ctime')),
                    local_mtime: parseInt(ele.attr('node-local_mtime')),
                    md5: ele.attr('node-md5'),
                    path: ele.attr('node-path'),
                    server_ctime: parseInt(ele.attr('node-server_ctime')),
                    server_filename: ele.attr('node-server_filename'),
                    server_mtime: parseInt(ele.attr('node-server_mtime')),
                    size: parseInt(ele.attr('node-size')),
                };
                return item
            },
            o = {
                top: [{
                    title: "展开全部",
                    action: function() {
                        let ul = $(this).closest('.treeview-node').next();
                        let textEle = ul.find('.treeview-txt');
                        ul.find("> li > .treeview-node:not(.treenode-empty) em.icon-operate:not(.minus)").click();
                        return true
                    },
                    display: function() {
                        let node = $(this).closest('.treeview-node');
                        let textEle = node.find('.treeview-txt');
                        let item = converItem(textEle);
                        if (!item.isdir) {
                            return false
                        }
                    },
                    keyboard: ""
                }, {
                    title: "折叠全部",
                    action: function() {
                        let ul = $(this).closest('.treeview-node').next();
                        let textEle = ul.find('.treeview-txt');
                        ul.find("> li > .treeview-node:not(.treenode-empty) em.icon-operate.minus").click();
                        return true
                    },
                    display: function() {
                        let node = $(this).closest('.treeview-node');
                        let textEle = node.find('.treeview-txt');
                        let item = converItem(textEle);
                        if (!item.isdir) {
                            return false
                        }
                    },
                    keyboard: ""
                }],
                middle: [],
                bottom: []
            };
        t.Broker.initMenuBroker({
            target: i(r.treeTarget)[0],
            type: "zfdev-tree",
            config: o,
            events: {
                beforeMenu: function() {
                    let node = $(this).closest('.treeview-node');
                    $('.treeview-node-on').removeClass('treeview-node-on');
                    node.addClass('treeview-node-on')
                },
                afterMenu: function() {
                    s.lock(!0)
                },
                menuHide: function() {
                    s.lock(!1)
                }
            }
        })
    };
    listMenu(require);

    function generateImage() {

        let $img = $("#zfdev-tree-manager-img");
        if ($img.length === 0) {
            let imgHTML = '<div id="zfdev-treeview-img-div"style=""><img id="zfdev-tree-manager-img"src=""style="height: auto;width: auto;max-width: 100%;max-height: 100%;display: block;margin: 0 auto;"><div style="display:block;"><a class="g-button"id="zfdev-treeview-img-zoom"href="javascript:;"title="放大"style="display:none;top:65px;"><span><em class="icon icon-picpre-enlarge"title="放大"style=""></em></span></a><a class="g-button"id="zfdev-treeview-img-download"href="javascript:;"title="下载"style="display:none;top:25px;"><span><em class="icon icon-download"title="下载"style=""></em></span></a><a class="g-button"id="zfdev-treeview-img-close"href="javascript:;"title="关闭"style="top:-15px;color:#666;"><span><em class="icon icon-close"title="关闭"style=""></em></span></a></div></div>';
            $("body").prepend($(imgHTML));
            $img = $('#zfdev-tree-manager-img');
            $('#zfdev-treeview-img-close').click(function() {
                $('#zfdev-treeview-img-div').remove()
            });
            $('#zfdev-treeview-img-download').click(function() {
                var link = document.createElement('a');
                link.href = $("#zfdev-tree-manager-img").attr('src');
                link.download = yunData.FILENAME + ".png";
                var e = document.createEvent('MouseEvents');
                e.initEvent('click', true, true);
                link.dispatchEvent(e);
                link.remove()
            });
            $('#zfdev-treeview-img-zoom').click(function() {
                let w = window.open('https://zfdev.com');
                w.document.write($("#zfdev-tree-manager-img")[0].outerHTML);
                w.document.body.style.background = "dimgrey";
                w.document.title = yunData.FILENAME;
                w.document.title += " 预览图";
            })
        }else{
            $('#zfdev-treeview-img-download').css('display', 'none');
            $('#zfdev-treeview-img-zoom').css('display', 'none');
            $('#zfdev-treeview-img-div').height('');
        }
        $img[0].src = "/box-static/system-core/system/uiService/tip/img/loading-white_e1bf1df.gif";

        var element = $('#zfdev-tree-manager .file-tree-container > .treeview-content ');
        var copyDom = element.clone();
        copyDom.css("background", "white");
        copyDom.addClass("zfdev-tree-manager");
        copyDom.find(".treeview-time").remove();
        copyDom.attr('id', "gengrate-image-copy-dom");
        copyDom.width("max-content");
        copyDom.css('visibility', 'hidden');
        $(copyDom).find('.treeview-node-on').removeClass('treeview-node-on');
        $('#bd').append(copyDom);
        let w = copyDom.width();
        w = w % 2 ? w + 1 : w;
        copyDom.width(w + "px");
        let h = copyDom.height();
        h = h % 2 ? h + 1 : h;
        h = h + 16;
        copyDom.height(h + "px");
        copyDom.css('visibility', 'unset')
        html2image(copyDom, $img[0]);

        function setWatermark(canvas, text, fsz) {
            let context = canvas.getContext('2d');
            context.font = 'bold ' + fsz + 'px Arial';
            context.textBaseline = 'bottom';
            context.fillStyle = '#ccc';
            context.strokeStyle = '#ccc';
            context.fillText(text, context.canvas.width - 150, context.canvas.height - 2);
            context.lineWidth = 2;
            context.strokeRect(0, 0, context.canvas.width, context.canvas.height)
        }

        function html2image(source, image) {
            html2canvas(source, {
                allowTaint: false,
                taintTest: false,
            }).then(function(canvas) {
                setWatermark(canvas, "由 ZFDev Manager 生成", 10);
                var imageData = canvas.toDataURL(1);
                image.src = imageData;
                source.remove();
                $('#zfdev-treeview-img-download').css('display', 'block');
                $('#zfdev-treeview-img-zoom').css('display', 'block');
                if (h > 600) {
                    $('#zfdev-treeview-img-div').height('600px')
                }
            })
        }
    }
    let generateImageHTML = '<a class="g-button" data-button-id="zfdev-filetree-image" id="share-zfdev-filetree-image-btn" data-button-index="2" href="javascript:;" title="预览图"><span class="g-button-right"><em class="iconfont-zfdev-filetree icon-shuxing" title="预览图"></em><span class="text" style="width: auto;padding-left: 5px;">预览图</span></span></a>';
    let $generate_image_button = $(generateImageHTML);
    $("#bd-main .module-share-header .slide-show-right .x-button-box").prepend($generate_image_button);
    $generate_image_button.click(function() {
        generateImage()
    });


    // 默认使用“文件树”视图, 不需要可关闭
    $('#zfdev-tree-view-btn').click()
})();
