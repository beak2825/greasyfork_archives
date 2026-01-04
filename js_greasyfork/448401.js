// ==UserScript==
// @name         获取京东商品详情信息
// @version      1.1.1
// @namespace    https://github.com/zyufstudio/TM/tree/master/getJdGoodsInfo
// @description  获取京东商品详情图片
// @author       Johnny Li
// @license      MIT
// @match        *://item.jd.com/*
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      cdn.jsdelivr.net
// @connect      cdn.bootcss.com
// @connect      360buyimg.com
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @require      https://cdn.bootcss.com/jszip/3.2.2/jszip.min.js
// @require      https://cdn.bootcss.com/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/hotkeys-js@3.7.2/dist/hotkeys.min.js
// @downloadURL https://update.greasyfork.org/scripts/448401/%E8%8E%B7%E5%8F%96%E4%BA%AC%E4%B8%9C%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/448401/%E8%8E%B7%E5%8F%96%E4%BA%AC%E4%B8%9C%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var $ = $ || window.$;
  var GetJdGoodsInfo = function () {
    var $doc = $(document);
    var $body = $("html body");

    var getGoodsName = function () {
      var parameterList = $("#detail .p-parameter ul.parameter2 li")
      var nameItem = parameterList.eq(0).text().split("：")
      return nameItem[1]
    }
    var getSpecImgs = function () {
      console.log("开始获取规格说明图片...")
      var imgs = [];
      var specImgList = $("#spec-list ul li img");
      for (var index = 0; index < specImgList.length; index++) {
        const specImgItem = specImgList[index];
        var $specImgItem = $(specImgItem);
        var src = "https:" + $specImgItem.attr("src");
        var reg = /\/(?<siteCode>n\d+)\/(?<sitePx>s?.*)_?jfs\//g
        if (reg.test(src)) {
          var urlRefObj = /\/(?<siteCode>n\d+)\/(?<sitePx>s?.*)_?jfs\//g.exec(src);
          if (urlRefObj.groups["sitePx"].length != 0) {
            src = src.replace(/\/s\d+x\d+_jfs\//g, `/s800x800_jfs/`);
          }
          else {
            src = src.replace(/\/n\d+\//g, `/n12/`);
          }
          var fileFullName = src.split("/").at(-1)
          var fileNameExt = fileFullName.split('.')
          var imgExt = fileNameExt[1]
          var imgName = fileNameExt[0]
          var fileName = `${index + 1}.${imgExt}`

          imgs.push({
            src,
            fileName,
            type: "spec"
          })
        }
      }
      console.log("成功获取规格说明图片")
      return imgs;
    }
    var getDetailImgs = function () {
      console.log("开始获取详情图片...")
      var imgs = [];
      var imgList = getDetailImgList();
      for (let index = 0; index < imgList.length; index++) {
        var src =imgList[index];
        var fileFullName = src.split("/").at(-1)
        var fileNameExt = fileFullName.split('.')
        var imgExt = fileNameExt[1]
        var imgName = fileNameExt[0]
        var fileName = `${index + 1}.${imgExt}`
        imgs.push({
          src,
          fileName,
          type: "detail"
        })
      }
      console.log("成功获取详情图片")
      return imgs;
    }
    const getDetailImgList=function(){
        let imgs = [];
        //img标签形式
        const imgList = $("#J-detail-content img");
        if(imgList.length>0){
            for (let index = 0; index < imgList.length; index++) {
                const imgItem = imgList[index];
                const $imgItem = $(imgItem);
                const src = "https:" + $imgItem.attr("src");
                imgs.push(src);
            }
        }
        //背景url形式
        const bgImgList =$("#J-detail-content .ssd-module-wrap .ssd-module");
        if(bgImgList.length>0){
            const urlReg=/url\("(?<src>https?:\/\/.+)"\)/g;
            for (let index = 0; index < bgImgList.length; index++){
                const imgItem = bgImgList[index];
                const $imgItem = $(imgItem);
                const bgUrl=$imgItem.css('backgroundImage');
                if(urlReg.test(bgUrl)){
                    const urlRegObj=/url\("(?<src>https?:\/\/.+)"\)/g.exec(bgUrl);
                    const src=urlRegObj.groups["src"];
                    imgs.push(src);
                }
            }
        }
        return imgs;
    }
    var downloadGoodsImg = function () {
      var specImgs = getSpecImgs();
      var detailImgs = getDetailImgs();
      var allImgs = specImgs.concat(detailImgs)
      //console.log(allImgs)
      console.log("开始下载图片...")
      downloadImg(0, allImgs)
    }
    var ImgsZip = new JSZip();
    var specImgsZipFolder = ImgsZip.folder('specImgs');
    var detaiImgsZipFolder = ImgsZip.folder('detailImgs');
    var returnFiles = [];
    var downloadImg = function (index, imgs) {
      if (index > imgs.length - 1) {
        var success = $.grep(returnFiles, function (item, index) {
          return item.status == 1;
        });
        var fail = $.grep(returnFiles, function (item, index) {
          return item.status == 0;
        });
        if (success.length > 0) {
          ImgsZip.generateAsync({ type: "blob" }).then(function (content) {
            var ZipName = `${getGoodsName()}__${DateFormat(new Date(), "yyyy-MM-dd hh-mm-ss").toString()}.zip`;
            saveAs(content, ZipName);
            console.log(`已功下载所有图片! 文件名为: ${ZipName}`)
          });
        }
        return;
      }
      var delayTime = 300;
      var src = imgs[index].src;
      var fileName = imgs[index].fileName;
      var fileType = imgs[index].type
      GM_xmlhttpRequest({
        method: "get",
        url: src,
        responseType: "blob",
        onload: function (r) {
          fnonload(r);
        },
        onerror: function (e) {
          fnonerror(e);
        },
        ontimeout: function () {
          fnontimeout();
        }
      })
      function fnonload(r) {
        switch (fileType) {
          case "spec":
            console.log("已下载规格说明图片。url: "+src)
            specImgsZipFolder.file(fileName, r.response);
            break;
          case "detail":
            console.log("已下载详情图片。url: "+src)
            detaiImgsZipFolder.file(fileName, r.response);
            break;
          default:
            break;
        }

        returnFiles.push({ fileName: fileName, status: 1 });
        setTimeout(function () {
          downloadImg(index + 1, imgs);
        }, delayTime);
      }
      function fnonerror(e) {
        console.error(StringFormat("第{0}几张图片{1}下载失败，失败原因：{2}", index + 1, fileName, e.error));
        returnFiles.push({ fileName: fileName, status: 0 });
        setTimeout(function () {
          downloadImg(index + 1, imgs);
        }, delayTime);
      }
      function fnontimeout() {
        console.error(StringFormat("第{0}几张图片{1}下载超时", index + 1, fileName));
        returnFiles.push({ fileName: fileName, status: 0 });
        setTimeout(function () {
          downloadImg(index + 1, imgs);
        }, delayTime);
      }
    }
    var RegMenu = function () {
      GM_registerMenuCommand("获取图片", function () {
        downloadGoodsImg()
      });
    }

    var ArrayUnique = function (args) {
      var temparr = [];
      $.each(args, function (i, v) {
        if ($.inArray(v, temparr) == -1) {
          temparr.push(v);
        }
      });
      return temparr;
    }
    var StringFormat = function (formatStr) {
      var args = arguments;
      return formatStr.replace(/\{(\d+)\}/g, function (m, i) {
        i = parseInt(i);
        return args[i + 1];
      });
    }
    var DateFormat = function (date, formatStr) {
      var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(formatStr)) {
        formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(formatStr)) {
          formatStr = formatStr.replace(
            RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return formatStr;
    }
    this.init = function () {
      RegMenu()
    }
  }
  var g = new GetJdGoodsInfo();
  g.init();
})();