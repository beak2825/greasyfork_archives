// ==UserScript==
// @name         BinB阅读器捕获脚本(v016061)
// @namespace    summer-script
// @version      0.2.2
// @description  用于binb阅读器v016061版本的漫画的获取脚本
// @author       summer
// @match        https://gammaplus.takeshobo.co.jp/_files/*
// @match        https://www.comicride.jp/viewer/*
// @exclude      https://www.comicride.jp/viewer/*/HTML5/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/374214/BinB%E9%98%85%E8%AF%BB%E5%99%A8%E6%8D%95%E8%8E%B7%E8%84%9A%E6%9C%AC%28v016061%29.user.js
// @updateURL https://update.greasyfork.org/scripts/374214/BinB%E9%98%85%E8%AF%BB%E5%99%A8%E6%8D%95%E8%8E%B7%E8%84%9A%E6%9C%AC%28v016061%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btn = createBtn();
    var jsonUrls = getJsonUrls();
    btn.addEventListener('click', function() {
        run(jsonUrls, btn);
    });

    function run(jsonUrls, btn, counter) {
        var jsonPath = jsonUrls.shift();
        if (undefined === jsonPath) {
            btn.innerText = '获取完毕';
            return;
        }
        var coords, ptimg;
        counter = counter ? counter : 0;
        counter++;
        jsonGet(jsonPath).then(function(ret) {
            ptimg = ret;
            coords = decodeCoords(ptimg.views[0].coords, ptimg.resources);
            var imgPath = ptimg.resources[coords[0].resid].src;
            var imgSrc = getImgUrl(imgPath, jsonPath);
            return loadImg(imgSrc);
        })
        .then(function(img) {
            btn.innerText = '正在获取...(剩余'+jsonUrls.length+'页)';
            var orgwidth = ptimg.views[0].width;
            var orgheight = ptimg.views[0].height;
            var prefix = document.title;
            var filename = prefix + '-' + counter + '.png';
            var cv = toCanvas(img, coords, orgwidth, orgheight);
            toFile(cv, filename);
            run(jsonUrls, btn, counter);
        });
    }

    function loadImg(src) {
        var func = function(resolve) {
            var img = new Image();
            img.onload = function() {
                resolve(img);
            };
            img.onerror = function() {
                console.log('image['+src+'] load fail, retrying...');
                setTimeout(function() {
                    func(resolve);
                }, 2000);
            };
            img.src = src;
        }
        return new Promise(func);
    }

    function toCanvas(img, coords, width, height) {
        var cv = document.createElement('canvas');
        cv.width = width;
        cv.height = height;
        var ctx = cv.getContext('2d');
        for(var i in coords) {
            ctx.drawImage(
                img,
                coords[i].xsrc,
                coords[i].ysrc,
                coords[i].width,
                coords[i].height,
                coords[i].xdest,
                coords[i].ydest,
                coords[i].width,
                coords[i].height
            );
        }
        return cv;
    }

    function toFile(canvas, filename) {
        canvas.toBlob(function(blob) {
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.download = filename;
            a.href = url;
            a.click();
        });
    }

    function jsonGet(path) {
        var func = function(resolve) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (XMLHttpRequest.DONE !== xhr.readyState) {
                    return;
                }
                if (200 !== xhr.status) {
                    return;
                }
                var ret;
                try {
                    ret = JSON.parse(xhr.responseText);
                } catch(err) {
                    ret = false;
                }
                resolve(ret);
            };
            xhr.open('GET', path);
            xhr.send();
        };
        return new Promise(func);
    }

    function createBtn() {
        var wrap = document.createElement('div');
        wrap.style.top = '6px';
        wrap.style.right = '8px';
        wrap.style.zIndex = '302';
        wrap.style.position = 'fixed';
        document.body.appendChild(wrap);
        var btn = document.createElement('button');
        btn.style.marginLeft = '8px';
        btn.style.padding = '8px';
        btn.style.background = '#fff';
        btn.style.border = '1px solid #aaa';
        btn.style.borderRadius = '4px';
        btn.style.minWidth = '112px';
        btn.style.color = '#000';
        btn.style.float = 'right';
        btn.style.cursor = 'pointer';
        btn.innerText = '下载';
        wrap.appendChild(btn);
        return btn;
    }

    function getJsonUrls() {
        var misc = document.getElementById('content')
                           .getElementsByTagName('div');
        var contents = [];
        for (var i = 0; i < misc.length; i++) {
            if (misc[i].hasAttribute('data-ptimg')) {
                contents.push(misc[i].getAttribute('data-ptimg'));
            }
        }
        return contents;
    }

    function decodeCoords(coordsData, resources) {
        var coordData, coordsNum = [];
        for (var i = 0; i < coordsData.length; i++) {
            coordData = coordsData[i];
            var reg = /^([^:]+):(\d+),(\d+)\+(\d+),(\d+)>(\d+),(\d+)$/;
            var n = coordData.match(reg);
            if (!n) {
                return false;
            }
            var r = n[1];
            if (!(r in resources)) {
                return false;
            }
            coordsNum.push({
                resid: r,
                xsrc: parseInt(n[2], 10),
                ysrc: parseInt(n[3], 10),
                width: parseInt(n[4], 10),
                height: parseInt(n[5], 10),
                xdest: parseInt(n[6], 10),
                ydest: parseInt(n[7], 10)
            });
        }
        return coordsNum;
    }

    function getImgUrl(imgPath, jsonPath) {
        var r;
        if (imgPath.indexOf('http://') + imgPath.indexOf('https://') !== -2) {
            r = imgPath;
        } else if ("" === imgPath) {
            r = jsonPath;
        } else if ("/" === imgPath[0]) {
            r = imgPath;
        } else if (".." === jsonPath){
            r = "../" + imgPath;
        } else if (jsonPath.match(/\/\.\.$/)){
            r = jsonPath + "/" + imgPath;
        } else if (-1 === jsonPath.indexOf("/")) {
            r = imgPath;
        } else {
            r = jsonPath.replace(/\/[^\/]*$/, "/") + imgPath;
        }
        if ("" === r) {
            return "";
        }
        var n = [];
        var i = r.replace(/\/+/g, "/")
                 .replace(/\/\.$/, "/")
                 .replace(/(^|\/)\.\.$/, "$1../")
                 .split("/").filter(function(t, i, n) {
                    return "." !== t
                  });
        for (r = 0; r < i.length; r++) {
            if (".." === i[r]) {
                if (n.length > 0) {
                    var e = n.pop();
                    "" === e ? n.push("") : ".." === e && n.push("..", "..")
                } else {
                    n.push("..");
                }
            } else {
                n.push(i[r]);
            }
        }
        var s = n.join("/");
        "" === s && (s = ".");
        return s;
    }
})();