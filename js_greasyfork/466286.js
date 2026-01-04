// ==UserScript==
// @name         百度网盘空间占用分析优化版
// @version      1.9
// @description  分析百度网盘当前目录空间占用,并使用ECharts矩形树图展示.✅使用异步请求浏览器不卡死✅实时显示当前扫描的文件夹✅可中断扫描✅可扫描分类内容✅美化图表,丰富信息展示
// @license      LGPL-3.0
// @author       wiix
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://pan.baidu.com/disk/main*
// @match        https://pan.baidu.com/disk/home*
// @grant        GM_addStyle
// @namespace    https://github.com/wiix
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.2/echarts.min.js
// @downloadURL https://update.greasyfork.org/scripts/466286/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A9%BA%E9%97%B4%E5%8D%A0%E7%94%A8%E5%88%86%E6%9E%90%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/466286/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A9%BA%E9%97%B4%E5%8D%A0%E7%94%A8%E5%88%86%E6%9E%90%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function(){
    'use strict';

    function checkVsite() {
        let vDomain = document.domain.split('.').slice(-2).join('.');
        if (vDomain == 'vaptcha.com') return true;
        return false;
    }

    // 延迟执行，否则找不到对应的按钮
    let sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    let isOldHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/home") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isNewHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/main") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isSharePage = function () {
        let path = location.pathname.replace('/disk/', '');
        if (/^\/(s|share)\//.test(path)) {
            return true;
        } else {
            return false;
        }
    }

    let getPageType = function () {
        if (isOldHomePage()) return 'old';
        if (isNewHomePage()) return 'new';
        if (isSharePage()) return 'share';
        return '';
    }

    // 将字节大小格式化为可读格式
    function formatSize(value) {
        let size = value + "B"
        if (value < 1024 * 1024) {
            size = (value / 1024).toFixed(2) + "KB"
        }
        else if (value < 1024 * 1024 * 1024) {
            size = (value / 1024 / 1024).toFixed(2) + 'MB'
        }
        else if (value < 1024 * 1024 * 1024 * 1024) {
            size = (value / 1024 / 1024 / 1024).toFixed(2) + 'GB'
        }
        else if (value < 1024 * 1024 * 1024 * 1024 * 1024) {
            size = (value / 1024 / 1024 / 1024 / 1024).toFixed(2) + 'TB'
        }
        return size;
    }

    function parseTime(time, cFormat) {
        if (arguments.length === 0 || !time) {
            return null
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if ((typeof time === 'string')) {
                if ((/^[0-9]+$/.test(time))) {
                    // support "1548221490638"
                    time = parseInt(time)
                } else {
                    // support safari
                    // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
                    time = time.replace(new RegExp(/-/gm), '/')
                }
            }

            if ((typeof time === 'number') && (time.toString().length === 10)) {
                time = time * 1000
            }
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
            const value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
            if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
            return value.toString().padStart(2, '0')
        })
        return time_str
    }

    //下载文件
    function download(filename, result) {
        console.log("下载:")
        //console.log(result)
        var text=JSON.stringify(result, null, 4);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    let initButtonEvent = function () {
        if(processing){
            console.log("分析中,待结束后重试...")
            return;
        }
        $("#chartcontainer").remove()
        if($("#process_text_container").length==0){
            $("body").prepend(`
            <div id='process_text_container'
            style='z-index:9999;width:600px;word-wrap:break-word;position:absolute;right:0;bottom:0;background-color:#990000;font-size:1em;color:white;'>
            <div id='process_text'></div>
            <div id='process_text_file' style='background-color: #009900;'></div>
            <div id='process_stop' style='background-color: #fac858;text-align:center;cursor:pointer;'>点我中断扫描</div>
            </div>
            `)
        }
        $("#process_stop").click(function(){
            processing = false;
        });
        console.log("href = " + decodeURIComponent(window.location.href))
        console.log("search = " + decodeURIComponent(window.location.search))
        console.log("hash = " + decodeURIComponent(window.location.hash))
        var href = window.location.href;
        //https://pan.baidu.com/disk/main?from=homeSave#/index?category=all&path=/Ad
        if(window.location.hash){
            href = window.location.origin + window.location.hash.substr(1);
        }
        var url = new URL(href);
        console.log("new URL = " + decodeURIComponent(url))

        var path=url.searchParams.get("path");
        console.log("path = " + path)
        if(!path || path.length==0){
            path= "/";
        }
        let category=url.searchParams.get("category");
        console.log("category = " + category)
        if(!category || category.length==0){
            category= "all";
        }
        var name=path.split("/").pop();
        console.log("name = " + name)
        if(!name || name.length==0){
            if(category == "all"){
                name= "根目录";
            }else{
                name= "分类"+category;
            }
        }
        let result = []
        processing = true;
        $('#process_stop').show();
        collectFiles(category,path,name,result).then(function(){
            processing = false;
            $('#process_stop').hide();
            //console.log(result)
            //扫描完成
            $("#process_text").text("已完成对目录:\""+path+"\"的扫描！")
            //显示图表
            showChart(result)
        });

    };

    async function collectFiles(category,path,name,result)
    {
        if(!processing){
            return {size:0,file_count:0};
        }
        $("#process_text").text("目录:"+ path)
        console.log("扫描:"+path)
        //当前目录总大小
        let dir_size = 0;
        let dir_file_count = 0;
        let files = await listFile(path,category);
        let children=[];
        if(files.length>500){
            console.log("大文件夹:\""+path+"\" ,文件数量:"+files.length)
        }
        for(let index=0;index<files.length;index++){
            let value = files[index];
            if(value.isdir==0){//添加到子目录
                //await sleep(1)
                $("#process_text_file").text((index+1)+"/"+files.length+" 文件名: \""+value.server_filename+"\" ,大小:"+formatSize(value.size))
                children.push(
                    {
                        name:value.server_filename,
                        path:value.path,
                        value:value.size,
                        file_count:1
                    })
                dir_size+=value.size;
                dir_file_count++;
            }else if(value.isdir==1)//递归文件夹
            {
                let re = await collectFiles(category,value.path,value.server_filename,children);
                //所有子目录大小相加
                dir_size += re.size;
                dir_file_count += re.file_count;
            }
        }
        result.push({
            name:name,
            path:path,
            children:children,
            value:dir_size,
            file_count:dir_file_count
        })
        return {size:dir_size,file_count:dir_file_count};
    }

    //https://stackoverflow.com/questions/33805176/async-await-and-recursion
    async function listFile(path,category)
    {
        let num = 1000;
        let page = 1;
        let reListSize = num;
        let files = [];
        while(reListSize>=num){
            let list;
            if(category == "all"){
                let url = "https://pan.baidu.com/api/list?clienttype=0&app_id=250528&web=1&order=time&desc=1&num="
                +num+"&page="+page+"&dir="+encodeURIComponent(path);
                let res = await $.ajax({url:url,type:"get",async:true});
                list = res.list;
            }else{
                let url = "https://pan.baidu.com/api/categorylist?clienttype=0&app_id=250528&web=1&order=time&desc=1&num="
                +num+"&page="+page+"&category="+category;
                let res = await $.ajax({url:url,type:"get",async:true});
                list = res.info;
            }
            reListSize = list.length;
            files = files.concat(list);
            page++;
        }
        return files;
    }

    //插入图表，显示图表
    function showChart(result)
    {
        if(result.length==0){
            console.log("扫描结果为空，请重试！");
            $("#process_text_file").text("扫描结果为空，请重试！");
            return;
        }
        console.log("显示图表...")
        //console.log(result)
        if($("#chartcontainer").length==0){
            $("body").prepend(`
            <div id='chartcontainer' style='z-index:99999;background-color: #eee;' >
            <div id='diskusage' style='width:100%;height:100%;border:2px solid #a00;'><div>
            </div>
            `)
        }
        chart = echarts.init(document.getElementById("diskusage"))
        chart.setOption({
            title:{text:result[0].name+" 的空间占用"},
            tooltip:{
                formatter:function(params){
                    let value = params.value
                    let size = formatSize(value);
                    return params.name + " : " + size
                }
            },
            toolbox: {
                show: true,
                bottom:0,
                right:0,
                showTitle:true,
                tooltip:{
                    show:false
                },
                feature: {
                    myToolDownload: {
                        show: true,
                        title: "下载文件列表",
                        icon: `path://M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1
                        .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z`,
                        onclick: function () {
                            //下载文件列表的json数据
                            download("百度网盘 "+result[0].name+" 的文件列表 "+parseTime(new Date())+".json",result);
                        }
                    },
                    myToolMaximize: {
                        show: true,
                        title: "切换最大化",
                        icon: `path://M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10
                        .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0
                        .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 
                        1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z`,
                        onclick: function () {
                            $("#chartcontainer").toggleClass('maximize');
                            chart.resize();
                        }
                    },
                    myToolClose: {
                        show: true,
                        title: "关闭图表",
                        icon: `path://M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8
                        8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z`,
                        onclick: function () {
                            //移除div元素
                            processing = false;
                            $("#chartcontainer").remove()
                            $("#process_text_container").remove()
                            chart = null;
                        }
                    }
                }
            },
            series:{
                leafDepth:1,
                visibleMin:20,
                name:result[0].name,
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                label: {
                    fontSize: 11,
                    formatter:function(params){
                        //let file_count = params.data.file_count;
                        let value = params.value
                        let size = formatSize(value);
                        return params.name + "\n" + size;
                    },
                    padding: 1
                },
                upperLabel: {
                    show:true,
                    formatter:function(params){
                        let file_count = params.data.file_count;
                        if(!file_count){
                            file_count = params.data.children.reduce( function(sum, record) {
                                return sum + record.file_count;
                            },0);
                        }
                        let value = params.value
                        let size = formatSize(value);
                        return params.name + " : " + file_count + " : " + size
                    }
                },
                type:"treemap",
                //直接展示根目录的子目录
                data:result[0].children
            }
        })
    }
    GM_addStyle(`
    #chartcontainer {
        width: 700px;
        height: 500px;
        position: absolute;
        right: 0px;
        top: 150px;
    }
    #chartcontainer.maximize {
        position: absolute;
        right: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
    }
    `);

    $(window).on("resize",function(){
        if($("#chartcontainer").length>0&&$("#chartcontainer").hasClass("maximize")){
            chart.resize();
        }
    });

    let chart = null;
    let processing = false;
    let isVsite = checkVsite();
    let btnDownload = {
        id: 'btn_find_1',
        text: '分析空间占用',
        title: '分析空间占用',
        html: function (pageType) {
            if (pageType === 'old' || pageType == 'share') {
                return `
                    <span class="g-button-right">
                        <em class="icon icon-search" style="color:#ffffff" title="${this.text}"></em>
                        <span class="text" style="width: auto;">${this.text}</span>
                    </span>
                `
            }
            if (pageType === 'new') {
                return `
                    <button class="u-button nd-file-list-toolbar-action-item is-need-left-sep u-button--success u-button--default u-button--small is-has-icon">
                        <i class="u-icon u-icon-search"></i>
                        <span>${this.text}</span>
                    </button>
                `;
            }
        },
        style: function (pageType) {
            if (pageType === 'old' || pageType == 'share') {
                return 'margin:0 5px;';
            }
            if (pageType === 'new') {
                return '';
            }
        },
        class: function (pageType) {
            if (pageType === 'old' || pageType == 'share') {
                return 'g-button g-button-red-large';
            }
            if (pageType === 'new') {
                return '';
            }
        }
    }

    let start = function () {//迭代调用
        if (isVsite) return;
        let pageType = getPageType();
        if (pageType === '') {
            console.log('非正常页面，1秒后将重新查找！');
            sleep(1000).then(() => {
                start();
            })
            return;
        }

        // 创建按钮 START
        let btn = document.createElement('a');
        btn.id = btnDownload.id;
        btn.title = btnDownload.title;
        btn.innerHTML = btnDownload.html(pageType);
        btn.style.cssText = btnDownload.style(pageType);
        btn.className = btnDownload.class(pageType);
        btn.addEventListener('click', function (e) {
            initButtonEvent();
            e.preventDefault();
        });
        // 创建按钮 END

        // 添加按钮 START
        let parent = null;
        if (pageType === 'old') {
            let btnUpload = document.querySelector('[node-type=upload]'); //管理页面：上传
            parent = btnUpload.parentNode;
            parent.insertBefore(btn, parent.childNodes[0]);
        } else if (pageType === 'new') {
            let btnUpload;
            btnUpload = document.querySelector("[class='nd-file-list-toolbar nd-file-list-toolbar__actions inline-block-v-middle']"); //管理页面：新建文件夹
            if (btnUpload) {
                btn.style.cssText = 'margin-right: 5px;';
                // alert('inline-block-v-middle');
                btnUpload.insertBefore(btn, btnUpload.childNodes[0]);
            } else {
                btnUpload = document.querySelector("[class='wp-s-agile-tool-bar__header  is-default-skin is-header-tool']"); //20220612管理页面：整个工具条
                // console.log(btnUpload);
                if (!btnUpload) {
                    btnUpload = document.querySelector("[class='wp-s-agile-tool-bar__header  is-header-tool']"); // 20220629管理页面：整个工具条
                }
                let parentDiv = document.createElement('div');
                parentDiv.className = 'wp-s-agile-tool-bar__h-action is-need-left-sep is-list';
                parentDiv.style.cssText = 'margin-right: 10px;';
                parentDiv.insertBefore(btn, parentDiv.childNodes[0]);
                btnUpload.insertBefore(parentDiv, btnUpload.childNodes[0]);
            }
        }
        // 添加按钮 END
    }
    sleep(500).then(() => {
        start();
    });
})();