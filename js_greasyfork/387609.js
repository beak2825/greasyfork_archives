// ==UserScript==
// @name         Ali express
// @namespace    www.aliexpress.com
// @version      0.4
// @description  download the item imgs
// @author       Wuyingqiang
// @match        *://*.aliexpress.com/item*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387609/Ali%20express.user.js
// @updateURL https://update.greasyfork.org/scripts/387609/Ali%20express.meta.js
// ==/UserScript==

var imgs = []
var index = 0;
var z = undefined;
var title = undefined;

function clearImages() {
    imgs = [];
}

function addImage(img) {
    imgs.push(img);
}


/**
*Base64字符串转二进制 - 代码来源： https://blog.csdn.net/Feb_kylin/article/details/79109321
*/
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

/**
 * convertBase64UrlToBlob, convertUrlToBase64 代码来源
 * https://juejin.im/post/5bbf7448f265da0af503441e
*/
function convertUrlToBase64(url) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
      var dataURL = canvas.toDataURL('image/' + ext);
      var base64 = {
        dataURL: dataURL,
        type: 'image/' + ext,
        ext: ext
      };
      resolve(base64);
    };
  });
}

function convertBase64UrlToBlob(base64) {
  var parts = base64.dataURL.split(';base64,');
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

function parsing_b64(base64) {
    console.log("图片: ", base64);
    z.addFile(imgs[index].name + ".png", dataURLtoBlob(base64.dataURL));

    index += 1;
    if (index < imgs.length) {
        convertUrlToBase64(imgs[index].src).then(parsing_b64);
    } else {
        try {
            z.export(title);
        } catch (e) {
            alert("文件压缩失败，请刷新在尝试");
        }
    }
}

function start2Download() {
    try {
        zip.useWebWorkers = false;
        z = new ZipArchive();

        convertUrlToBase64(imgs[index].src).then(parsing_b64);
    } catch(e) {
        alert('zip 压缩的js 没有加载完全，请刷新再试');
    }
}



function generateImage(link) {
    let image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    };

    image.src = link;
}
function addItems(items) {
    var i = 0;
    for (i=0; i < items.length;i++) {
        if (typeof items[i] === "string") {
            addImage(items[i]);
        } else {
            addImage(items[i].getAttribute("src"));
        }
    }
}
function addImgItem(item) {
    imgs.push(item);
}

function downloadImages(){
    console.log("下载图片啦");

    let goodsName = document.getElementsByClassName("product-title")[0].innerText;
    title = goodsName;

    // store imgs link
        var i = 0;
        let imagesView = window.runParams.data.imageModule.imagePathList;

        for (i=0; i < imagesView.length; i++) {
            let item = imagesView[i];
            addImgItem({'name': ' show_out ' + i, 'src': item});
        }

        let itemsSelects = window.runParams.data.skuModule.productSKUPropertyList[0].skuPropertyValues;

        for (i=0; i < itemsSelects.length; i++) {
            let item = itemsSelects[i];
            addImgItem({'name': ' 640x640 ' + item.propertyValueDefinitionName, 'src': item.skuPropertyImagePath});
        }

        try {
            let items = document.getElementById('product-description').getElementsByTagName("img");

            for (i=0; i < items.length; i++) {
                let item = items[i];
                if (item.width == 800) {
                    addImgItem({'name': 'detail ' + i, 'src': item.src});
                }
            }
        } catch(e){
            alert('图片不全哦, 请浏览一下');
            clearImages();
            return ;
        }

    console.log(imgs);
    start2Download();
    // download

    // donwloading *.zip file
}


(function() {
    // import zip js


    var body = document.body;
    var js = [
        'https://gildas-lormeau.github.io/zip.js/demos/zip.js',
        'https://wechat.static.walkyren.com/mime-types.js',
        'https://apps.bdimg.com/libs/jquery/1.9.0/jquery.js',
        'https://sqqihao.github.io/codes/zipjs/deflate.js',
        'https://wechat.static.walkyren.com/ZipArchive.js'
    ];

    for (var i=0; i < js.length; i++) {
        var newscript = document.createElement('script');
        newscript.setAttribute('src',js[i]);
        body.appendChild(newscript);
    }

    var exec = document.createElement('script');
    exec.innerText = "console.log('加载 script 完成');";
    body.appendChild(exec);

    // add function


    'use strict';
    // create button for downloading.
    var downloadButton = document.createElement("span");
    downloadButton.setAttribute("class", "ui-fixed-panel-unit ui-fixed-panel-twitter");
    var btn = document.createElement("button");
    btn.onclick = downloadImages;
    btn.setAttribute("style", "height:2em;background:gold;");

    btn.innerText = "下载商品图片";

    downloadButton.appendChild(btn);

    var popButton = document.getElementsByClassName("sns-shares")[0];
    popButton.appendChild(downloadButton);

    console.log("start");
    // Your code here...
})();