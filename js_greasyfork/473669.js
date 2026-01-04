// ==UserScript==
// @name         ehentai漫画管理器
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @license      MIT
// @description  exhentai-manga-manager的附加浏览器脚本
// @author       You
// @match        *exhentai.org/*
// @match        *e-hentai.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exhentai.org
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/473669/ehentai%E6%BC%AB%E7%94%BB%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/473669/ehentai%E6%BC%AB%E7%94%BB%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
.download{
   cursor:pointer;
   position: relative;
}
.download::before {
text-align: center;
  content: "点击下载";
  position: absolute;
  width:50px;
  top: -5px;
  left: 50%;
  transform: translate(-50%,0);
  padding: 5px;
  background-color: #444;
  color: #fff;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  border-radius: 5px;
}

.download:hover::before {
  opacity: 1;
  visibility: visible;
}
.mark {
  cursor:pointer;
  position: relative;
  background:rgba(0, 0, 0, 0.1);
}

.mark::before {
text-align: center;
  content: "录入meta";
  position: absolute;
  width:50px;
  top: -5px;
  left: 50%;
  transform: translate(-50%,0);
  padding: 5px;
  background-color: #444;
  color: #fff;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  border-radius: 5px;
}

.mark:hover::before {
  opacity: 1;
  visibility: visible;
}
.copyed{
    font-size:30px;
    position:fixed;
    left: 50%;
    top:100px;
    transform: translate(-50%,0);
    z-index:99;
    padding:10px;
    background-color: #444;
    border-radius: 10px;
    display:none;
    color:#fff;

}
.showDialog{
      white-space: nowrap;
      position:fixed;
      background-color: #444;
      border-radius: 10px;
      padding:18.7px;
      z-index:99;
      color:#fff;
      left: 50%;
      transform: translate(-50%,0);
      vertical-align: middle;
      display:none;
  }
  .showDialog div
  .right{

  }
  .inputtext{
    width: 400px;
  }
  .pointer{
cursor: pointer;
  }
    `);

    'use strict';
    //下载重试次数
    var maxReload=10;
    $("body").prepend("<div class='showDialog'><div><label>端口号<input type='text' class='right inputtext port'></label></div> <br> <div> <label> <span title='点击选择文件路径' class='pointer'>database路径</span> <input type='file' style='display: none;' id='database' name='file'> <input type='text' class='right inputtext databasepath' name=''> </label> </div> <br> <div> <label> <span title='点击选择文件路径' class='pointer'>metabase路径</span> <input type='file' style='display: none;' id='metabase' name='file'> <input type='text' class='right inputtext metadatapath' > </label> </div> <br> <div><label>下载地址<input type='text' class='right inputtext downloadPath'></label></div><br><div class='right'> <button class='confim'>保存</button> <button class='close'>关闭</button> </div> </div>");

    $("body").prepend("<a class='setting'></a>");
    $("body").prepend("<div class='copyed'></div>");
    $(".showDialog .close").click(function(){
        $(".showDialog").hide();
    });

    //菜单保存配置
    $(".showDialog .confim").click(function(){
        if( ($(".showDialog .databasepath").val()!='')&&($(".showDialog .port").val()!='')&&($(".showDialog .metadatapath").val()!='')&&($(".showDialog .downloadPath").val()!='')){
            if(confirm("要保存当前配置吗？")){
                setting("del");
                setting("add");
            }
        }else{
            alert("配置不完整");
        }

    });
    $('#database').change(function() {
        $(".showDialog .databasepath").val(this.value);
    });
    $('#metabase').change(function() {
        $(".showDialog .metadatapath").val(this.value);
    });
    //元数据下载标记
    var yszy=0;
    var ehid;
    var url=window.location.href;
    var result_port;
    var result_appAppDatapath;
    var result_metadatapath;
    var metadatapath;
    var downloadPath;
    var result_downloadPath;
    const request = indexedDB.open('ex1', 1);
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        //  检查对象存储空间是否存在
        if (!db.objectStoreNames.contains('setting')) {

            // 创建对象存储空间
            const objectStore = db.createObjectStore('setting', { keyPath: 'name' });
        }
    };
    request.onsuccess = function(event) {
        const db = event.target.result;

        // 开始事务（读写模式）
        const transaction = db.transaction(['setting'], 'readwrite');

        // 获取对象存储空间
        const store = transaction.objectStore('setting');
        // 获取数据
        store.get("appAppDatapath").onsuccess = function(event) {
            result_appAppDatapath = event.target.result;

        };

        store.get("port").onsuccess = function(event) {
            result_port = event.target.result;
        };
        store.get("metadatapath").onsuccess = function(event) {
            result_metadatapath = event.target.result;
        };
        store.get("downloadPath").onsuccess = function(event) {
            result_downloadPath = event.target.result;
        };

        transaction.oncomplete = function() {
            if(result_appAppDatapath!=undefined){
                $(".showDialog .databasepath").val(result_appAppDatapath['val']);
            }
            if(result_port!=undefined){
                $(".showDialog .port").val(result_port['val']);
            }
            if(result_metadatapath!=undefined){
                $(".showDialog .metadatapath").val(result_metadatapath['val']);
            }
            if(result_downloadPath!=undefined){
                $(".showDialog .downloadPath").val(result_downloadPath['val']);
            }else{
                 $(".showDialog .downloadPath").val('exh');
            }
            $(".setting").html("点击设置");
            $(".setting").click(function(){
                $(".showDialog").show();
            });
            //配置完成后启用主功能
            if((result_appAppDatapath!=undefined)&&(result_port!=undefined)&&(result_metadatapath!=undefined)&&(result_downloadPath!=undefined)){
                //漫画详细页
                if(url.indexOf("hentai.org/g/")!=-1){
                    //详情页显示
                    $("#taglist").append("<div><span class='download'>未下载 </span><span class='mark'><span style='color:#999;text-align: center;'>未连接</span></span><div>");
                    $("body").append("<div class='expage' style='display:none'><div>");
                    //获取当前uid
                    ehid=url.split("/")[4];
                    var Length=$("#gdd tr:eq(5) td:eq(1)").text().split(" ")[0];
                    var urlarr=[];

                    var downloadedarr;
                    var page_check_deferred = $.Deferred();
                    //先完成已下载图片的检测
                    page_check(page_check_deferred);
                    $("#taglist .download").click(function(){
                        window.open(url+'?download=1', '_blank', 'width=240,height=80,menubar=no,toolbar=no,location=no,status=no');
                    });
                    //此页面自动下载页面
                    if(url.indexOf("download=1")!=-1){
                        $("body").append("<div class='jingdu' style='position:fixed; top:0px; font-size:60px; background-color: #444; z-index:99;  cursor:pointer;'>0/0<div>");
                        $(".jingdu").click(function(){
                            window.location.reload();
                        });
                        $.when(page_check_deferred).done(function(){
                            if(downloadedarr.length==Length){
                                setTimeout(function(){
                                    window.close();
                                },10000);

                            }
                            //收集全部详细页
                            collectPage(urlarr).then(function() {
                                $(".jingdu").html("<span class='downloadedcount'>"+downloadedarr.length+"</span>/<span class='allcount'>"+urlarr.length+"</span>");
                                for(var i=0;i<urlarr.length;i++){
                                    if(downloadedarr.includes(urlarr[i].split("-")[1])){
                                        //去除已下载的链接
                                        urlarr[i]=0;
                                    }

                                }
                                 alAll(urlarr);

                                
                            }).catch(function() {
                                // 处理错误
                            });

                        });
                    }
                    //显示有没有元数据
                    $.ajax({
                        url: "http://localhost:"+result_port['val']+"/data.php",  // 请求的URL
                        method: "POST",  // 请求方法，可选项包括 "GET", "POST", "PUT", "DELETE" 等.
                        data:{
                            appAppDatapath:result_appAppDatapath['val'],
                            metadatapath:result_metadatapath['val'],
                            ehid:'["/'+ehid+'/"]',
                            fun:'showDownload'
                        },  // 请求参数，如果不需要传递参数可以省略
                        success: function(response) {
                        

                                if(response.indexOf(ehid)!=-1){
                                    $(".mark").html("<span style='color:#1b1;text-align: center;'>存在元数据</span>");

                                }else{
                                    $(".mark").html("<span style='color:#999;text-align: center;'>无元数据</span>");
                               }
                           
                        },
                        error: function(xhr, status, error) {
                            console.log("请求错误:", error);
                        }
                    });
                    //点击后添加到数据库
                    $(".mark").click(function(){
                        updateSqlite(url,result_appAppDatapath['val'],result_port['val'],result_metadatapath['val'])
                    });
                    //单张下载状态
                    async function page_check(deferred){
                        $.ajax({
                            url: "http://localhost:"+result_port['val']+"/data.php",  // 请求的URL
                            method: "POST",
                            data:{
                                fun:'page_check',
                                downloadPath:result_downloadPath['val'],
                                ehid:ehid
                            },
                            success: function(response) {
                                var Length=$("#gdd tr:eq(5) td:eq(1)").text().split(" ")[0];
                                downloadedarr = JSON.parse(response);
                                if(yszy==0){
                                    if(Length>=8){
                                        if(downloadedarr.includes('8')){
                                            downloadedmeta('Page_8.jpg',url,result_metadatapath['val'],result_port['val'],ehid,result_downloadPath['val'])
                                        }
                                    }else if(Length<8){
                                        if(downloadedarr.includes('1')){
                                            downloadedmeta('Page_1.jpg',url,metadatapath,result_port['val'],ehid,result_downloadPath['val'])
                                        }
                                    }
                                }
                                //改变下载按钮的状态
                                if(downloadedarr==0){
                                }else if(downloadedarr.length<Length){
                                    $("#taglist .download").html(downloadedarr.length+"/"+Length);
                                }else if(downloadedarr.length==Length){
                                    $("#taglist .download").html("下载完成  ");
                                }
                                deferred.resolve('page_check_deferred success');
                            },
                            error: function() {
                                console.log("请求错误:", error);
                            }
                        });
                    }
                    //单张页面链接下载单张
                    async function downloadPage(urlarr,i,reload){
                        if(urlarr[i]!=0&&i<urlarr.length){

                            async function fetchData(url,cou) {
                                try {
                                    const response = await fetch(url);
                                    const html =await response.text();
                                    return html;
                                } catch (error) {
                                    console.error(error);
                                    // 请求失败，则重新发起请求
                                    cou++;
                                    if(cou>=10){
                                         window.location.reload();
                                    }else{
                                         return fetchData(url,cou);
                                    }

                                }
                            }
                            const html =await fetchData(urlarr[i],1);
                            var imageUrl;
                            var imageLinks = [];
                            var imgRegex = /<img\s[^>]*?\bid=['"]img['"][^>]*?src=['"](.*?)['"]/g;
                            var loadfailRegex= /<a\s[^>]*?\bid=['"]loadfail['"][^>]*?onclick=['"]return nl\('([^']*)'\)['"]/g;
                            var match;
                            var loadfail;
                            var lff;
                            if((loadfail = loadfailRegex.exec(html)) !== null) {
                                //重新加载图片代码
                                lff=loadfail[1];
                            }
                            if((match = imgRegex.exec(html)) !== null) {
                                imageUrl=match[1];
                            }

                            var gid=urlarr[i].split("/")[5].split("-")[0];
                            var filename=gid;
                            if($("#gj").length==1){
                                filename=filename+'-'+$("#gj").text();
                            }else{
                                filename=filename+'-'+$("#gn").text();
                            }

                            filename=filename.replace('|','');
                            var pagenum="Page_"+urlarr[i].split("/")[5].split("-")[1].split("?")[0];
                            const jieguo=await dl(imageUrl,filename,pagenum);
                            if(jieguo=='fail'){
                                if(urlarr[i].indexOf("?nl")!=-1){
                                    urlarr[i]= urlarr[i]+"&nl="+lff;
                                }else{
                                    urlarr[i]= urlarr[i]+"?nl="+lff;
                                }
                                downloadPage(urlarr,i,reload);
                            }

                        }
                    }
                    //循环下载
                    async function alAll(urlarr){

                        for(let a=0;a<urlarr.length;a=a+3){
                            await downloadPage(urlarr,a,1);
                        }
                        for(let a=1;a<urlarr.length;a=a+3){
                            await downloadPage(urlarr,a,1);
                        }
                        for(let a=2;a<urlarr.length;a=a+3){
                            await downloadPage(urlarr,a,1);
                        }
                    }
                    //下载
                    async function dl(imageUrl,filename,pagenum){
                        return new Promise((resolve, reject) =>{
                            $.ajax({
                                url: "http://localhost:"+result_port['val']+"/data.php",  // 请求的URL
                                method: "POST",
                                data:{
                                    imageUrl:imageUrl,
                                    filename:filename,
                                    page:pagenum,
                                    downloadPath:result_downloadPath['val'],
                                    fun:'download'
                                }
                            }).done(response => {
                                console.log('请求成功:', response);
                                if(response.indexOf("文件已成功下载并保存到")!=-1){

                                    console.log(pagenum+"已下载");
                                    page_count();
                                    resolve('success');
                                }else{
                                    console.log("图片502");
                                    //重载图片
                                    resolve('fail');
                                }
                                // 执行其他操作
                            }) .fail(error => {
                                console.log("下载超时");
                                resolve('fail');
                            });

                        })


                    }
                    //查看本地图片数量
                    async function page_count(){
                        $.ajax({
                                url: "http://localhost:"+result_port['val']+"/data.php",  // 请求的URL
                                method: "POST",
                                data:{
                                    ehid:ehid,
                                    downloadPath:result_downloadPath['val'],
                                    fun:'page_check'
                                },
                                 success: function(response) {
                                     var response_count=JSON.parse(response).length;
                                     $(".downloadedcount").html(response_count);
                                     if(urlarr.length==response_count){
                                          window.location.reload();
                                     }
                                 }
                        })
                    }
                }
                //e站搜索页面
                if(url.indexOf("hentai.org")!=-1&&$("#toppane").length==1){
                    ehid=[];

                    //右键清空搜索栏
                    $("#f_search").contextmenu(function(){
                        $("#f_search").val("");
                    });
                    //格式化搜索框内的内容
                    $("#f_search").change(function(){
                        var kw=$("#f_search").val();
                        kw=kw.replace(/\(.*?\)/g,'');
                        kw=kw.replaceAll('~','');
                        kw=kw.replace('.zip','');
                        if(!isNaN(kw.substring(0,kw.indexOf("-")))){
                            kw=kw.substring(kw.indexOf("-")+1,kw.length);
                        }
                        $("#f_search").val(kw);
                        $("#f_search").next().trigger("click");
                    });
                    $(".gl1t").append("<div><span></span><span class='mark'><div style='color:#999;text-align: center;'>未连接</span></div><div>");
                    $(".mark").click(function(){
                        updateSqlite($(this).parent().parent().find("a:eq(1)").attr("href"),result_appAppDatapath['val'],result_port['val'],result_metadatapath['val'])
                    });
                    $(".gl1t").each(function(){
                        var ehurl=$(this).find("a").attr("href");
                        ehurl=ehurl.split("/");
                        ehid.push("/"+ehurl[4]+"/");
                    });

                    //显示数据库有没有元数据
                    $.ajax({
                        url: "http://localhost:"+result_port['val']+"/data.php",  // 请求的URL
                        method: "POST",  // 请求方法，可选项包括 "GET", "POST", "PUT", "DELETE" 等.
                        data: {
                            appAppDatapath:result_appAppDatapath['val'],
                            result_metadatapath:result_metadatapath['val'],
                            ehid:JSON.stringify(ehid),
                            fun:'showDownload'
                        },  // 请求参数，如果不需要传递参数可以省略
                        success: function(response){
                            //转为对象
                            var back_obj = eval(response);
                            $(".mark").html("<div style='color:#999;text-align: center;'>未下载</div>");

                            //遍历网址
                            $(".gl1t").each(function(){
                                //修改下载图标的行为
                                var mgurl=$(this).find("a:eq(1)").attr("href");
                                $(this).find(".gldown a").attr("href","javascript:void(0);");
                                $(this).find(".gldown a").attr("onclick","");
                                $(this).find(".gldown").click(function(){
                                    window.open(mgurl+'?download=1', '_blank', 'width=240,height=80,menubar=no,toolbar=no,location=no,status=no');
                                });
                                //遍历返回的对象
                                for(let i=0;i<back_obj.length;i++){
                                    if($(this).find("a").attr("href").indexOf(back_obj[i])!=-1){
                                        $(this).find(".mark").html("<div style='color:#1c1;text-align: center;'>已下载</div>");
                                        break;
                                    }
                                }
                                //当前页面只有一个搜素结果时自动提取meta
                                if($(".gl1t").length==1&& $(".mark").text()=="未下载"){
                                    $(".mark").focus();
                                    $(".mark").trigger("click");
                                }
                            });
                        },
                        error: function(xhr, status, error) {
                            // 请求失败时的回调函数
                            console.log("请求错误:", error);
                        }
                    });

                }
            }

        }
            // 关闭数据库连接
            db.close();
    }


    //将元数据插入metadate
    async function downloadedmeta(page,url,metadatapath,port,ehid,downloadPath){
       url=url.replace('?download=1','');
       let match = /(\d+)\/([a-z0-9]+)/.exec(url);
       fetch('https://api.e-hentai.org/api.php', {
           method: "POST",
           body: JSON.stringify({
               'method': 'gdata',
               'gidlist': [
                   [match[1], match[2]]
               ],
               'namespace': 1
           })
       })
           .then(async res => {
           let metaobj = {}
           let gmetadata = await res.json()
           gmetadata = gmetadata.gmetadata[0]
           let tags = {}
           gmetadata.tags.forEach(tagString => {
               let match = /^(.+):(.+)$/.exec(tagString)
               if (tags[match[1]]) {
                   tags[match[1]].push(match[2])
               } else {
                   tags[match[1]] = [match[2]]
               }
           })
           metaobj.tags = tags
           metaobj.url = url
           metaobj.title = gmetadata.title
           metaobj.title_jpn = gmetadata.title_jpn
           metaobj.rating = +gmetadata.rating
           metaobj.posted = +gmetadata.posted
           metaobj.filecount = +gmetadata.filecount
           metaobj.category = gmetadata.category
           metaobj.filesize = gmetadata.filesize
           metaobj.status = 'tagged'
           $.ajax({
                url: "http://localhost:"+port+"/data.php",  // 请求的URL
                method: "POST",
                data:{
                    page:page,
                    ehid:ehid,
                    downloadPath:downloadPath,
                    metadatapath:metadatapath,
                    metaobj:JSON.stringify(metaobj),
                    fun:'sha1'
                },  
                success: function(response) {

                 
                },
                error: function(xhr, status, error) {
                    console.log("请求错误:", error);
                }
            });
   });
}
   //获取元数据后添加进本地数据库
    function updateSqlite(url,appAppDatapath,port,metadatapath){
        //获取元数据
        let match = /(\d+)\/([a-z0-9]+)/.exec(url);
        fetch('https://api.e-hentai.org/api.php', {
            method: "POST",
            body: JSON.stringify({
                'method': 'gdata',
                'gidlist': [
                    [match[1], match[2]]
                ],
                'namespace': 1
            })
        })
            .then(async res => {
            let metaobj = {}
            let gmetadata = await res.json()
            gmetadata = gmetadata.gmetadata[0]
            let tags = {}
            gmetadata.tags.forEach(tagString => {
                let match = /^(.+):(.+)$/.exec(tagString)
                if (tags[match[1]]) {
                    tags[match[1]].push(match[2])
                } else {
                    tags[match[1]] = [match[2]]
                }
            })
            metaobj.tags = tags
            metaobj.url = url
            metaobj.title = gmetadata.title
            metaobj.title_jpn = gmetadata.title_jpn
            metaobj.rating = +gmetadata.rating
            metaobj.posted = +gmetadata.posted
            metaobj.filecount = +gmetadata.filecount
            metaobj.category = gmetadata.category
            metaobj.filesize = gmetadata.filesize
            metaobj.status = 'tagged'
            var gid=gmetadata.gid
            //连接data.php
            //三次搜索，用gid搜索文件夹名，主要用于ehviewer下载的文件中所带的gid号，用日文搜索文件名，用英文搜索文件名
            $.ajax({
                url: "http://localhost:"+port+"/data.php",  // 请求的URL
                method: "POST",
                data:{
                    appAppDatapath:appAppDatapath,
                    metadatapath:metadatapath,
                    gid:gid,
                    metaobj:JSON.stringify(metaobj),
                    fun:'updateDatabase'
                },  // 请求参数，如果不需要传递参数可以省略
                success: function(response) {
                    //无搜索结果时使用手动输入
                    if(response.indexOf("notfind")!=-1){
                        //复制
                        navigator.clipboard.writeText(JSON.stringify(metaobj));
                        $(".copyed").text("录入失败，请手动录入元数据，元数据已复制到剪切版");
                    }
                    if(response.indexOf("success")!=-1){
                        $(".copyed").text("录入成功");
                    }
                    $('.copyed').fadeIn(); // 元素开始时显示
                    setTimeout(function() {
                        $('.copyed').fadeOut(); // 5秒后元素消失
                    }, 2000);
                },
                error: function(xhr, status, error) {
                    console.log("请求错误:", error);
                }
            });

        })



    }
    //设置端口和文件路径下载路径
    function setting(type){
        const request = indexedDB.open('ex1', 1);
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            //  检查对象存储空间是否存在
            if (!db.objectStoreNames.contains('setting')) {
                // 创建对象存储空间
                const objectStore = db.createObjectStore('setting', { keyPath: 'name' });
            }
        };
        request.onsuccess = function(event) {
            const db = event.target.result;

            // 开始事务（读写模式）
            const transaction = db.transaction(['setting'], 'readwrite');

            // 获取对象存储空间
            const store = transaction.objectStore('setting');
            if(type=='add'){
                var port = $(".showDialog .port").val();
                var appAppDatapath= $(".showDialog .databasepath").val();
                var metadatapath=$(".showDialog .metadatapath").val();
                var downloadPath=$(".showDialog .downloadPath").val();
                const data_port = { name:'port', val: port };
                store.add(data_port);
                const data_appAppDatapath = { name:'appAppDatapath', val: appAppDatapath };
                store.add(data_appAppDatapath);
                const data_metadatapath = { name:'metadatapath', val: metadatapath };
                store.add(data_metadatapath);
                const data_downloadPath = { name:'downloadPath', val: downloadPath };
                store.add(data_downloadPath);
            }else if(type=='del'){
                store.delete('port');
                store.delete('appAppDatapath');
                store.delete('metadatapath');
                store.delete('downloadPath');
            }
            transaction.oncomplete = function() {
                // 关闭数据库连接

                db.close();
                location.reload();
            };

        }


    }
    //收集该本漫画的全部单张页面链接 links 链接数组
    function collectPage(links){
        var Length=$("#gdd tr:eq(5) td:eq(1)").text().split(" ")[0];
        var onepageSize=$("#gdt a").length;
        //向上取余
        var  pagecont=Math.floor((Length-0 + onepageSize - 1) / onepageSize);
        var ajaxRequests = [];
        function ppp(url, i,cou) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: url + "&p=" + i,
                    method: 'GET',
                    success: function(response) {
                        const html = response;
                        const pattern = /<a\s+(?:[^>]*?\s+)?href=(['"])(.*?)\1/g;
                        const divPattern = /<div\s+id="gdt"[^>]*>(.*?)class="gtb"/g;

                        let match;
                        let divmatch;
                        divmatch = divPattern.exec(html)
                        while ((match = pattern.exec(divmatch[0])) !== null) {
                            if (match[2].includes('/s/')) {
                                links.push(match[2]);
                            }
                        }
                        resolve(); // 请求成功后resolve Promise
                    },
                    error: function(xhr, status, error) {
                        console.log('请求错误:', error);

                        cou++;
                        if(cou>=10){
                            window.location.reload();
                        }else{
                            return ppp(url, i,cou)
                        }

                    }
                });
            });
        }


        for (var i = 0; i <= (pagecont - 1); i++) {
            ajaxRequests.push(ppp(url, i,1));
        }

        return Promise.all(ajaxRequests).then(function() {
            // 所有异步请求完成后的处理
        }).catch(function() {
            // 如果有任何一个请求失败，则进行错误处理
        });
    }  
})();