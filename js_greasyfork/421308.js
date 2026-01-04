// ==UserScript==
// @name         坦克现形
// @namespace    blog.site.xiaobu
// @version      0.5
// @description  可以让无影坦克现形
// @author       xiaobu
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421308/%E5%9D%A6%E5%85%8B%E7%8E%B0%E5%BD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/421308/%E5%9D%A6%E5%85%8B%E7%8E%B0%E5%BD%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.body.onmouseover = function (e) {
        if (e.target.tagName === 'IMG') {
            show(e.target);
        }
    }

    /**
     * 将无影坦克现形
     * @param select dom元素
     * */
    function show(select) {
        let canvas = document.createElement("canvas");
        let src = select.src;
        // 百度贴吧图片做特殊处理,压缩图片直接怼到原图
        if (select.src.match("tiebapic.baidu.com")) {
            let basePath = '';
            if (select.src.match("https://")) {
                basePath = 'https://tiebapic.baidu.com/forum/pic/item';
            } else {
                basePath = 'http://tiebapic.baidu.com/forum/pic/item';
            }
            let index = select.src.lastIndexOf("/");
            let imgPath = select.src.substring(index);
            src = basePath + imgPath;
        }
        let con = canvas.getContext("2d");
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            con.drawImage(img, 0, 0);


            let imgData = con.getImageData(0, 0, img.width, img.height);
            // new Promise((resolve) => {
            //     resolve();
            // }).then(() => {

            if (imgData.data[0] % 8 !== 0 || imgData.data[1] % 8 !== 3 || imgData.data[2] % 8 === 0 || imgData.data[2] % 8 > 5) {
                throw "error";
            }

            let list = de(imgData.data[2] % 8, imgData);
            let file = new File([list[1].buffer], '', {type: list[0][2]})
            let path = URL.createObjectURL(file);
            select.href = path;
            select.src = path;
            select.style.display = "block";
            // });
        }
    }

    function de(mode, imgdata) {
        let aa = Math.ceil(3 * mode / 8);
        let n = imgdata.width * imgdata.height;
        let j = 0;
        let k = "";
        let i = 1;
        let mlist = [1, 2, 4, 8, 16, 32, 64, 128];
        let word = "";
        let blist//=new Uint8Array();
        let blength = 0;
        while (i < n && (word.length == 0 || word.slice(-1).charCodeAt(0) > 0)) {
            k = k + (imgdata.data[4 * i] + 256).toString(2).slice(-mode);
            k = k + (imgdata.data[4 * i + 1] + 256).toString(2).slice(-mode);
            k = k + (imgdata.data[4 * i + 2] + 256).toString(2).slice(-mode);
            i++
            for (let ii = 0; ii < aa; ii++) {
                if (k.length >= 8 && (word.length == 0 || word.slice(-1).charCodeAt(0) > 0)) {
                    word = word + String.fromCharCode(parseInt(k.slice(0, 8), 2));
                    k = k.slice(8);
                }
            }
        }
//word分隔符:","
        blength = parseInt(word.split(String.fromCharCode(1))[0]);
        if (!(blength > -1)) {
            throw "error"
        }
        if (!(word.split(String.fromCharCode(1)).length > 2)) {
            throw "error"
        }
        blist = new Uint8Array(blength);
        if (k.length >= 8 && j < blength) {
            blist[j] = parseInt(k.slice(0, 8), 2);
            k = k.slice(8);
            j++
        }
        while (i < n && j < blength) {
            k = k + (imgdata.data[4 * i] + 256).toString(2).slice(-mode);
            k = k + (imgdata.data[4 * i + 1] + 256).toString(2).slice(-mode);
            k = k + (imgdata.data[4 * i + 2] + 256).toString(2).slice(-mode);
            i++
            for (let ii = 0; ii < aa; ii++) {
                if (k.length >= 8 && j < blength) {
                    blist[j] = parseInt(k.slice(0, 8), 2);
                    k = k.slice(8);
                    j++
                }
            }
        }
        return [word.split(String.fromCharCode(0))[0].split(String.fromCharCode(1)), blist]
    }

})();

