// ==UserScript==
// @name     百度网盘空间占用分析
// @version  1.1
// @description 百度网盘磁盘占用分析,可视化图表的方式显示出来
// @include  https://pan.baidu.com/disk/main*
// @grant    none
// @namespace http://blog.formatfa.top
//引入jquery
// @require      https://code.jquery.com/jquery-latest.js
// @require			 https://cdnjs.cloudflare.com/ajax/libs/echarts/4.3.0/echarts.min.js
// @downloadURL https://update.greasyfork.org/scripts/392532/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A9%BA%E9%97%B4%E5%8D%A0%E7%94%A8%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/392532/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A9%BA%E9%97%B4%E5%8D%A0%E7%94%A8%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==
//这里用这个是匿名函数
(function(){
    'use strict';

    // 字节转换为文件大小
    function getSize(value) {
        let size = "unknow"
        if (value < 1024) {
            size = value + "b"
        }
        else if (value < 1024 * 1024) {
            size = Math.round(value / 1024) + "k"
        }
        else if (value < 1024 * 1024 * 1024) {
            size = Math.round(value / 1024 / 1024) + 'm'
        }
        else if (value < 1024 * 1024 * 1024 * 1024) {
            size = Math.round(value / 1024 / 1024 / 1024) + 'g    '
        }
        return size;
    }


    //下载文件,来自https://blog.csdn.net/weixin_33863087/article/details/93177956
    function download(filename, result) {
        console.log("下载:")
        console.log(result)
        var text=JSON.stringify(result);
        /*   result.forEach(function(value,index){
      text+=(value+"\n")
    })*/
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }


    //遍历获取文件列表,路径，文件夹名字，结果容器，当前深度, 扫描的最大深度
    function collectFiles(path,name,result,nowDepth,maxDepth)
    {
        $("#process_text").text(path)
        //最大深度没定义时 不会判断，会一直扫描, 大于最大深度，不再扫描
        if( maxDepth>0&& nowDepth>maxDepth)
            return
        //目录的名字
        console.log("扫描:"+path)


        //同步请求,一次请求1000个文件，就不用处理翻页，除非有某个文件夹文件数量大于1000的
        let res = $.ajax({
            url:"https://pan.baidu.com/api/list?num=1000&order=time&desc=1&clienttype=0&showempty=0&web=1&page=1&channel=chunlei&web=1&app_id=250528",
            data:{
                dir:path
            },
            type:"get",
            //同步请求，接受数据
            async : false
        })


        let files = res.responseJSON.list

        //目录总大小,echarts的图，每个都要有value
        let dir_size = 0;
        let children=[];
        //数量，用于显示进度
        let count = files.length;
        files.forEach(function(value,index){
            if(nowDepth==0)
                $("#analysis").text("扫描:"+index+"/"+count+" "+value.path)

            if(value.isdir==0)
                //添加到二级目录
            {
                children.push(
                    {
                        name:value.server_filename,
                        path:value.path,
                        value:value.size
                    })
                dir_size+=value.size;
            }
            //文件夹的话，递归
            if(value.isdir==1)
            {
                //添加到总的文件夹大小
                dir_size += collectFiles(value.path,value.server_filename,children,nowDepth+1,maxDepth)
            }

        })
        if(nowDepth==0)$("#analysis").text("空间占用分析")
        result.push({
            name:name,
            path:path,
            children:children,
            value:dir_size
        })

        return dir_size;
    }


    //插入图表，显示图表
    function showChart(result)
    {
        console.log("显示图表...")
        console.log(result)
        //如果没有这个div,就插入,图表大小等
        if($("#chartcontainer").length==0)
            $("body").prepend("<div id='chartcontainer' style='z-index:9999;width: 400px;height:400px;position: fixed;right: 0;top: 0;' ><div id='diskusage' style='width:400px;height:400px;'><div></div>")

        //查找图表
        let chart = echarts.init(document.getElementById("diskusage"))
        chart.setOption({
            title:{text:"磁盘使用"},
            tooltip:{
                formatter:function(params){
                    let value = params.value
                    let size = getSize(value);
                    return params.name + ":" + size
                }
            },
            toolbox: {
                show: true,
                bottom:0,
                showTitle:false,

                tooltip:{
                    show:true
                },
                feature: {

                    myTool1: {
                        show: true,
                        icon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
                        title: "下载文件列表",
                        onclick: function () {
                            //下载文件列表的json数据
                            download("百度网盘文件.json",result);
                        }
                    },
                    myTool2: {
                        show: true,
                        icon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
                        title: "关闭图表",
                        onclick: function () {
                            //直接移除这个div元素
                            $("#chartcontainer").remove()
                        }
                    }


                }
            },
            series:{
                //设置叶片的深度，为1就只显示一级的目录
                leafDepth:1,
                name:"磁盘使用",
                type:"treemap",
                //扫描的结果，第一个只有一个元素，这里直接显示下面的
                data:result[0].children
            }
        })


    }

    setTimeout(()=>{
        //1. 在新建文件夹后面添加个按钮
        var xinjian=$("button[title='新建文件夹']")
        if(xinjian.length==0){
            console.warn("查找不到新建文件夹按钮!!")
            return;
        }

        //显示当前扫描的目录名字
        var process = $('<span id="process_text" ></span>')
        //添加一个按钮到他后面
        var analysis = $("<button id='analysis'>分析</button>")
        analysis.text("空间占用分析")
        console.log(analysis)
        //添加到新建文件夹后面

        xinjian.after(process)
        xinjian.after(analysis)


           //设置点击事件
    $("#analysis").click(function(){
        console.log("fff")
        let result = []

        //查找出当前的目录<span title="全部文件/我的资源/AIDE-Web/AIDE-Web_Carck/Embedded-Chinese/反编译资源">反编译资源</span>
        //找到到的可能有两个，第二个是完整路径
        var path = $('span[title^="全部文件/"]')
        if(path.length==0)
        {
            path="/"
        }
        else
            path=path.attr("title").replace("全部文件","")

        console.log("当前目录:"+path)
        var path = prompt("输入要扫描的目录",path)
        if(path==null)
        {
            alert("输入目录取消")
            return;
        }

        //测试时用某个目录下的
        var depth = prompt("输入要扫描的深度(-1为全盘扫描,文件过多会请求太多卡死，-1谨慎使用)","2")
        if(depth==null)
        {
            alert("取消!")
            return
        }
        collectFiles(path,"根目录",result,0,parseInt(depth))
        console.log("获取到的文件列表..")
        console.log(result)
        //download("files.txt",result);
        //扫描完成，设置成空的
        $("#process_text").text(path)
        //显示图表
        showChart(result)
    })

    },3000)



})()