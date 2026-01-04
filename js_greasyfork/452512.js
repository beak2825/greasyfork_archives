// ==UserScript==
// @name 图集岛看图(改列表可打包)
// @namespace http://tampermonkey.net/
// @version 1.0.1
// @description VIP破解 + 单张下载 + 一键下载（批量单张下载）+ 打包下载 + 本地网页预览 + 简易收藏功能
// @author 村里有个姑娘叫翠花
// @include /https?:\/\/(\w+\.)?tujidao.\w+/
// @icon data:image/jpeg;base64,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
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js
// @require https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/2.0.5/FileSaver.min.js
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452512/%E5%9B%BE%E9%9B%86%E5%B2%9B%E7%9C%8B%E5%9B%BE%28%E6%94%B9%E5%88%97%E8%A1%A8%E5%8F%AF%E6%89%93%E5%8C%85%29.user.js
// @updateURL https://update.greasyfork.org/scripts/452512/%E5%9B%BE%E9%9B%86%E5%B2%9B%E7%9C%8B%E5%9B%BE%28%E6%94%B9%E5%88%97%E8%A1%A8%E5%8F%AF%E6%89%93%E5%8C%85%29.meta.js
// ==/UserScript==

(function () {
    "use strict";
    GM_addStyle(".sc{position: absolute;top: 0;left: 0;background: #ebae12;border-radius: 50%;width: 35px;text-align: center;color: #FFF;z-index: 100;font-size: 13px;cursor: pointer;}");
    var locurl = window.location.href;
    var htmlfilecontent='<html lang="en"><head><title>{{TITLE}}</title><meta charset="UTF-8" /><style>h1,.tags{text-align:center;width:100%;margin:1rem 0;}img {vertical-align: top;text-align: center;}.imgbox{margin-bottom:5px;position: relative;overflow: hidden;}.imgbox img{max-width: 100%;cursor:pointer;}.imgnum{cursor:pointer;position: absolute;left: 0px;top: 0px;background: rgba(255, 152, 0,0.5);z-index: 100;padding: 5px;color: #f9f9f9;border-radius: 0px;}.contianer{column-gap: 5px;margin:0;padding:0;}@media (min-width: 576px) {.contianer{column-count: 1;}}@media (min-width: 768px) {.contianer{column-count: 2;}}@media (min-width: 992px) {.contianer{column-count: 3;}}@media (min-width: 1200px) {.contianer{column-count: 4;}}@media (min-width: 1400px) {.contianer{column-count: 5;}}</style></head><body bgcolor="#27282d"><div style="color:white;font-size:25px"><h1>{{TITLE}}</h1><p class="tags">{{TAGS}}</p><ul id="images" align="center" class="contianer">{{IMAGES}}</ul></div><script src="https://tokinx.github.io/ViewImage/view-image.min.js"></script><script>window.ViewImage && ViewImage.init(".contianer img");</script></body></html>';
    var html1 =
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.js"></script>' +
        "<style>img {vertical-align: top;text-align: center;}" +
        ".imgbox{margin-bottom:5px;position: relative;overflow: hidden;}" +
        ".imgbox img{max-width: 100%;cursor:pointer;}" +
        ".imgnum{cursor:pointer;position: absolute;left: 0px;top: 0px;background: rgba(255, 152, 0,0.5);z-index: 100;padding: 5px;color: #f9f9f9;border-radius: 0px;}" +
        ".btn-box{display:flex;justify-content: space-around;}" +
        ".btn{width:48%;cursor:pointer;background: rgba(255, 152, 0,0.8);z-index: 100;text-align: center;margin: 5px 0;padding: 10px 0px;color: #f9f9f9;border-radius: 2px;}" +
        "a:link{color:pink;}a:visited{color:purple;}" +
        ".contianer{column-gap: 5px;margin:0;padding:0;}@media (min-width: 576px) {.contianer{column-count: 1;}}@media (min-width: 768px) {.contianer{column-count: 2;}}@media (min-width: 992px) {.contianer{column-count: 3;}}@media (min-width: 1200px) {.contianer{column-count: 4;}}@media (min-width: 1400px) {.contianer{column-count: 5;}}" +
        ".loading-box{width: 100%;height: 50px;display: none;align-items: center;position: absolute;top: 50px;left: 0;z-index: 999;}.loading{margin: 0 auto;width: 120px;height: 40px;line-height: 40px;color: #FFF;font-size: 17px;text-align: center;background: #1111119e;border-radius: 2px;}"+
        "</style></head>" +
        '<body bgcolor="#27282d"><div class="loading-box"><p class="loading">下载中...</p></div><ul id="images" align="center" class="contianer">';
    var pic_base =
        "<li class='imgbox'><div class='imgnum'  onclick='download1({pic_id},{num})'>{imgnum} 下载"+
        "</div><img alt='{pic_id}_{num}.jpg' filename='{title}_{num}.jpg' numname='{num}.jpg' data-original='https://tjg.gzhuibei.com/a/1/{pic_id}/{num}.jpg' src='https://tjg.gzhuibei.com/a/1/{pic_id}/{num}.jpg'></li>";
    var title = "";
    var flag = false;
    var layer = null;
    var toastMsg;
    layui.use('layer', function(){
        layer = layui.layer;
    });
// 下载函数
    function download(pic_id,imageId) {
        //console.log('download')
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://tjg.gzhuibei.com/a/1/${pic_id}/${imageId}.jpg`,
            headers: {
                referer: "https://" + window.location.host
            },
            responseType:"blob",
            onload: function(xhr) {
                var r = xhr.responseText,
                    data = new Uint8Array(r.length),
                    i = 0;
                while (i < r.length) {
                    data[i] = r.charCodeAt(i);
                    i++;
                }
                let blob = new Blob([data], {
                    type: "image/jpeg"
                });
                var blobURL = window.URL.createObjectURL(blob);
                //console.log(blobURL)
                var downA = document.createElement("a");
                downA.href = blobURL;
                downA.setAttribute("download", document.title+`_${imageId}.jpg`);
                downA.click();
                window.URL.revokeObjectURL(blobURL);
            }
        })
    }
// 一键下载函数
    function onekeydownload(pic_id,num) {
        for(let i=1;i<=num;i++){
            (function(j) {
                window.setTimeout(function(){
                    download(pic_id,j);
                },100*i);
            })(i);
        }
    }


    //******新增打包下载点击
    function zipDown(){
        //批量下载
        if (!flag) {
            downloadPack();
            flag = true;
        } else {
            alert('下载中, 请耐心等待...\n点击确认继续下载');
        }
    }

    function zipDownByListBtn(title,tag,id,p){
        return zipedByID(title,tag,id,p);
    }

async function zipedByID(title,tag,id,p) {
    var ranges = ['\ud83c[\udf00-\udfff]','\ud83d[\udc00-\ude4f]','\ud83d[\ude80-\udeff]'];
        title = title.replace(/\+/g,"_").replace(/\?/g,"").replace(/\、/g," ").replace(/\\/g,"-").replace(/\//g,"").replace(/\*/g,"-").replace(/\“/g," ").replace(/\”/g," ").replace(/\</g," ").replace(/\>/g," ").replace(/\|/g,"_").replace(new RegExp(ranges.join('|'), 'g'), '');
        var txt = "标题："+"\n" + title+"\n" + "标签："+"\n" + tag+"\n" + "文件列表：" + "\n";
        var imagesli = '';
        var zip = new JSZip();
		var ii = 0;
        for (ii=1;ii<=p;ii++) {
            var filename = ii+".jpg";
			txt += "images/"+filename+"|";
            imagesli += '<li class="imgbox"><div class="imgnum"> ['+ii+'/'+p+'] </div><img src="images/'+filename+'" /></li>';
            const response = getFileByID(id,ii);
			zip.folder("images").file(filename, response);
        }
        var htmlfilecontent2 = htmlfilecontent.replace(/\{\{TITLE\}\}/g,title).replace(/\{\{TAGS\}\}/g,tag).replace(/\{\{IMAGES\}\}/g,imagesli);
        zip.file("info.txt", txt.replace(/^(\s|,)+|(\s|\|)+$/g, ''));
        zip.file("info.html", htmlfilecontent2);
        zip.generateAsync({
            type: 'blob'
        }).then(function (content) {
            saveAs(content, title + '.zip');
        });
 }


    //******新增zip下载
    async function downloadPack() {
        console.log("start download...");
        $(".loading-box").css("display","flex");
        var start = performance.now();

        var list = document.querySelectorAll('.imgbox>img');
        var ranges = ['\ud83c[\udf00-\udfff]','\ud83d[\udc00-\ude4f]','\ud83d[\ude80-\udeff]'];
        var title = document.title.replace(/\+/g,"_").replace(/\?/g,"").replace(/\、/g," ").replace(/\\/g,"-").replace(/\//g,"").replace(/\*/g,"-").replace(/\“/g," ").replace(/\”/g," ").replace(/\</g," ").replace(/\>/g," ").replace(/\|/g,"_").replace(new RegExp(ranges.join('|'), 'g'), '');
        var tags = document.querySelectorAll(".tags a");
        var tag = '';
        for (const tagx of tags) {
			tag += tagx.innerText+"/";
        }
        tag = tag.replace(/^(\s|,)+|(\s|\/)+$/g, '');
        var txt = "标题："+"\n" + title+"\n" + "标签："+"\n" + tag+"\n" + "文件列表：" + "\n";
        var imagesli = '';
        var zip = new JSZip();
		var ii = 0;
        for (const item of list) {
			ii++;
            var url = item.getAttribute('data-original');
            var filename = item.getAttribute('numname');
			txt += "images/"+filename+"|";
            imagesli += '<li class="imgbox"><div class="imgnum"> ['+ii+'/'+list.length+'] </div><img src="images/'+filename+'" /></li>';
            const response = getFile(url);
			zip.folder("images").file(filename, response);
        }
        var htmlfilecontent1 = htmlfilecontent.replace(/\{\{TITLE\}\}/g,title).replace(/\{\{TAGS\}\}/g,tag).replace(/\{\{IMAGES\}\}/g,imagesli);
        zip.file("info.txt", txt.replace(/^(\s|,)+|(\s|\|)+$/g, ''));
        zip.file("info.html", htmlfilecontent1);
        zip.generateAsync({
            type: 'blob'
        }).then(function (content) {
            saveAs(content, title + '.zip');
            var end = performance.now();
            $(".loading-box").css("display","none");
        });
    }

    //******新增下载文件
    async function getFile(url) {

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    referer: "https://" + window.location.host
                },
                responseType: "blob",
                onload: function (response) {
                    //setTimeout(console.log(url+"下载成功"), 300 )
                    resolve(response.response);
                },
                onerror: function (error) {
                    reject(error);
                    //console.log(url+"下载失败");
                    //return false;
                }
            });
        });
    }

    async function getFileByID(id,num) {
        var url = "https://tjg.gzhuibei.com/a/1/"+id+"/"+num+".jpg";
        return getFile(url);
    }
// 打开新窗口展示图片
    var createnew = function (num, pic_id, tags) {
        var tagHtml = [];
        var last = tags.pop();
        var pic_new = pic_base.replaceAll("{pic_id}", pic_id).replaceAll('{title}', last.innerText);
        for (let t of tags) {
            tagHtml.push(t.outerHTML);
        }
        tagHtml.push(last.innerText);
        tagHtml =
            "<div style='color:white;font-size:25px'>" + "<div class='tags'>" +
            tagHtml.join(" / ") + "</div>" + `<div class="btn-box"><div class='btn' onclick='download2(${pic_id},${num})'>一键下载</div><div onclick='zipDown()' class="btn">打包下载</div></div>`
            "</div>";
        var imgs = [];
        for (var i = 1; i <= num; i++) {
            imgs.push(
                pic_new.replaceAll("{num}", i).replace("{imgnum}", ` [${i}/${num}]`)
            );
        }
        let html = html1.replace("img_title", `${last.innerText} - ${num}P @ ${pic_id}`);
        html += imgs.join("\n");
        html += '</ul><script src="https://tokinx.github.io/ViewImage/view-image.min.js"></script><script>window.ViewImage && ViewImage.init(".contianer img");</script>';
        //var w = window.open("https://www.tujidao02.com");
        var w = window.open(window.location.href);
        w.onload = () => {
            w.document.write('');
            w.document.write(tagHtml + html);
            w.document.title = last.innerText;
            w.document.close();
        };
    };

    /**
     * 给已有的图片容器添加点击事件，移除原有跳转链接
     */
    function addEvent(list) {
        $('.titletxt').append('<div></br><button type="button" class="layui-btn layui-btn-normal" id="zipall">打包下载当前页所有</button></br></div>');
        $("#zipall").click(function(){
            var h = $(document).height()-$(window).height();
            $(document).scrollTop(h);
            $($("p.zip").toArray().reverse()).each(function(){
                $(this).click();
            });
            //$(document).scrollTop(0);
        });
        for (const li of list) {
            //console.log(li);
            addCollectAndRemoveDom(li);

            //第一个a
            li.querySelector('img').onclick = function () {
                // 获取数量
                var num = li
                    .querySelector("span.shuliang")
                    .innerText.split("P")[0];

                num = parseInt(num);
                var jigou = li.querySelector("span.shuliang").innerText.split("P")[0];
                // id
                var aTag = li.querySelector("a");
                aTag.removeAttribute("href"); // 删除链接，防止跳转
                var id = li.querySelector(".biaoti a").getAttribute("href");
                id = id.split("id=")[1];
                //丢掉最后一个
                var tags = li.querySelectorAll("p>a");

                //console.log(tags);
                createnew(num, id, [...tags]);
            };
        }
    }

    /**
     *  添加收藏与移除
     */
    function addCollectAndRemoveDom(li){

        let id = li.querySelector(".biaoti a").getAttribute("href");
        id = id.split("id=")[1];

        var num = li.querySelector("span.shuliang").innerText.split("P")[0];
        num = parseInt(num);

        var tags = li.querySelectorAll("p>a");
        var arrtags = [...tags];
        //var jigou = tags.shift().innerText;
        var title = arrtags.pop().innerText;
        var tag = '';
        for (const tagx of arrtags) {
			tag += tagx.innerText+"/";
        }
        tag = tag.replace(/^(\s|,)+|(\s|\/)+$/g, '');

        $(li).append('<p class="zip" style="position: absolute;top: 50px;left: 0;height: 35px;line-height: 35px;background: #ebae12;border-radius: 50%;width: 35px;text-align: center;color: #FFF;z-index: 100;font-size: 13px;cursor: pointer;">zip</p>');
        li.querySelector('.zip').onclick = function (){
            zipedByID(title,tag,id,num);
            };



        if(locurl.indexOf("shoucang")==-1){
            $(li).append('<p class="sc" style="height: 35px;line-height: 35px;">收藏</p>');
            li.querySelector('.sc').onclick = function (){
                let lii = li.cloneNode(true);
                let p_sl = lii.querySelector('p');
                if(p_sl.innerText.indexOf("收录")>-1){
                    p_sl.remove();
                }
                let li_str = lii.outerHTML;
                collect(id, li_str);
            };
        }else{
            $(li).append('<p class="sc" style="height: 35px;line-height: 35px;">移除</p>');
            li.querySelector('.sc').onclick = function (){
                collectRemove(id);
            };
        }


    }

    /**
     *  收藏
     */
    function collect(id, li_str){
        //console.log("id: ", id);
        //console.log("li: ",li_str);
        let list = localStorage.getItem("sclist");
        let obj = {
            "id": id,
            "li": li_str.replace('<p class="sc" style="height: 35px;line-height: 35px;">收藏</p>','')
        };
        let arr = [];
        if(list == null){
            //console.log("list不存在");
            arr.push(obj);
            localStorage.setItem("sclist",JSON.stringify(arr));
        }else{
            //console.log("list存在", JSON.parse(list));
            list = JSON.parse(list);
            for(let i=0; i<list.length; i++){
                if(id===list[i].id){
                    layer.msg(id+"已收藏");
                    if(i<list.length){
                        return;
                    }
                }
                if(i==list.length-1 && id != list[i].id){
                    list.push(obj);
                    localStorage.setItem("sclist",JSON.stringify(list));
                }
            }
        }
    }
    /**
     *  取消收藏
     */
    function collectRemove(id){
        let list = localStorage.getItem("sclist");
        list = JSON.parse(list);
        list.forEach((item,index,list) => {
            if(item.id === id){
                list.splice(index,1);
            }
        });
        localStorage.setItem("sclist",JSON.stringify(list));
        main();
        layer.msg(id+"已移除");
    }

    /**
     *  获取收藏写入收藏页面
     */
    function getCollect(){
        if(locurl.indexOf("shoucang")>-1){
            $(".hezi ul").html("");
            let list = localStorage.getItem("sclist");
            if(list != null){
                list = JSON.parse(list);
                for(let item of list){
                    $(".hezi ul").append(item.li);
                }
            }
        }
    }

    /**
     *  获取当前页面的图片列表
     */
    function getLiList() {
        return document.querySelectorAll("div.hezi>ul>li");
    }

    function main(){
        //console.log(locurl);
        if($(".unav")){
            let alist = $(".unav a");
            for(let i=0; i<alist.length; i++){
                //console.log(alist[i]);
                if(alist[i].innerText=='开通会员' || alist[i].innerText=='APP下载'){
                    //console.log("success");
                    alist[i].remove();
                }
                if(alist[i].innerText=='我的收藏'){
                    alist[i].style.color = "#ffca00";
                }
            }
        }
        getCollect();
        addEvent(getLiList());
    }
    main();

    if(!unsafeWindow.download1)
    {
        unsafeWindow.download1 = download;
    }
    if(!unsafeWindow.download2)
    {
        unsafeWindow.download2 = onekeydownload;
    }
    if(!unsafeWindow.zipDown)
    {
        unsafeWindow.zipDown = zipDown;
    }

    var contentContainer = document.getElementById("search");
    var config = { childList: true, subtree: true };
    // 当观察到突变时执行的回调函数
    var callback = function (mutationsList) {
        mutationsList.forEach(function (item, index) {
            const { addedNodes } = item;
            addEvent(addedNodes);
        });
    };

    // 创建一个链接到回调函数的观察者实例
    var observer = new MutationObserver(callback);

    // 开始观察已配置突变的目标节点
    contentContainer && observer.observe(contentContainer, config);

})();