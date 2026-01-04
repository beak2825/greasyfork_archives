// ==UserScript==
// @name         妖火热门
// @namespace    https://yaohuo.me/
// @version      2.0.6
// @description  由于C大禁止，所以即日起该项目停止！
// @author       id:30235
// @match        https://yaohuo.me/
// @icon         https://yaohuo.me/css/favicon.ico
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/452257/%E5%A6%96%E7%81%AB%E7%83%AD%E9%97%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/452257/%E5%A6%96%E7%81%AB%E7%83%AD%E9%97%A8.meta.js
// ==/UserScript==

(function() {
    let title = document.querySelector('.title');

    let rma = document.createElement("a");
    let rmspan = document.createElement("span");
    rmspan.className = "separate";
    rma.innerText = "热门";
    rmspan.innerText = " ";
    rma.style.cursor="pointer";

    let roua = document.createElement("a");
    let rouspan = document.createElement("span");
    rouspan.className = "separate";
    roua.innerText = "肉贴";
    rouspan.innerText = " ";
    roua.style.cursor="pointer";

    title.append(rouspan);
    title.append(roua);
    title.append(rmspan);
    title.append(rma);
    let myurl = '';

    let listW = document.getElementsByClassName("list")[0].offsetWidth;
    
    rma.onclick=function(){
        var xhr=new XMLHttpRequest();
        xhr.open('get',myurl);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = xhr.responseText;
                let res=JSON.parse(resp);
                let rt="";
                for(let key in res["head"]){
                    if(key!="null")
                    rt+='<a  style="color:#a83d65">'+res["head"][key]+'</a><br>';
                }
                 if(res.hasOwnProperty("data1")){
                    rt+='<div style="margin:10px auto;  font-size:18px; background-color:rgb(250,247,239)">近24h</div>';
                    for(let i=0;i<res["data1"].length;i++){
                      rt+=(i+1)+'.<a href="/bbs-'+res["data1"][i][0]+'.html" target="_blank">'+"【"+res["data1"][i][4]+"热】"+res["data1"][i][3]+'</a><br>';

                    }
                }
                if(res.hasOwnProperty("data2")){
                    rt+='<div style="margin:10px auto;  font-size:18px; background-color:rgb(250,247,239)">近48h</div>';
                    for(let i=0;i<res["data2"].length;i++){
                      rt+=(i+1)+'.<a href="/bbs-'+res["data2"][i][0]+'.html" target="_blank">'+"【"+res["data2"][i][4]+"热】"+res["data2"][i][3]+'</a><br>';

                    }
                }
                 if(res.hasOwnProperty("data")){
                    rt+='<div style="margin:10px auto;  font-size:18px; background-color:rgb(250,247,239)">近72h</div>';
                    for(let i=0;i<res["data"].length;i++){
                         rt+=(i+1)+'.<a href="/bbs-'+res["data"][i][0]+'.html" target="_blank">'+"【"+res["data"][i][4]+"热】"+res["data"][i][3]+'</a><br>';

                    }
                }
                let date = new Date();
                let hour = date.getHours();

                rt = '<div class="title"><a href="/">首页</a>&gt;<a href="/bbs/">论坛</a>&gt;热门 更新于：'+res["updateTime"]+'</div>'+'<div class="list">'+rt+'</div>';
                rt+='<div style="margin:10px auto;  font-size:18px; background-color:rgb(250,247,239)">近24h全站热度</div>';
                rt+='  <canvas id="my_canvas" width="'+listW+'" height="200"></canvas>';
                document.body.innerHTML=rt;


                if(res.hasOwnProperty("hot")){
                    const minrd = Math.min.apply(Math,res["hot"]);
                    const maxrd = Math.max.apply(Math,res["hot"]);
                    let data = [];
                     for(let i=0;i<res["hot"].length;i++){
                         data.push({x:i/24*(listW-20),y:(res["hot"][i]-minrd)/(maxrd-minrd)*80})
                    }
                    console.log(data);
                    let lineChart = new LineChart("my_canvas");
                    lineChart.init(data);

                }
            }
        }
        xhr.send();
    };

    roua.onclick=function(){
        var xhr=new XMLHttpRequest();
        xhr.open('get',myurl);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = xhr.responseText;
                let res=JSON.parse(resp);
                let rt="";
                for(let key in res["head"]){
                    if(key!="null")
                    rt+='<a  style="color:#a83d65">'+res["head"][key]+'</a><br>';
                }
                if(res.hasOwnProperty("rou")){
                    for(let i=0;i<res["rou"].length;i++){
                        rt+=(i+1)+'.<img src="/NetImages/li.gif" alt="礼"><a href="/bbs-'+res["rou"][i][0]+'.html" target="_blank">'+res["rou"][i][1]+'</a><br>';
                    }
                }
                rt = '<div class="title"><a href="/">首页</a>&gt;<a href="/bbs/">论坛</a>&gt;肉贴 更新于：'+res["updateTime"]+'</div>'+'<div class="list">'+rt+'</div>';
                 document.body.innerHTML=rt;
            }
        }
        xhr.send();
    };


var LineChart = function(canvas){
        // 获取canvas
        this.canvas = document.querySelector("canvas");
        // 获取上下文
        this.ctx = this.canvas.getContext("2d");
        // 获取画布的高
        this.canvasHeight = this.ctx.canvas.height;
        // 获取画布的宽
        this.canvasWidth = this.ctx.canvas.width;
        // 设置网格格子的大小
        this.gridSize = 10;
        // 设置坐标系边距
        this.space = 20;
        // 设置箭头的长
        this.arrowSize = 10;
        // 设置点的大小
        this.dottedSize = 6;




      }
      LineChart.prototype.init = function(data){
        this.drawGrid(this.ctx, this.canvasHeight, this.canvasWidth, this.gridSize);
        this.drawCoord(this.ctx, this.space, this.arrowSize, this.canvasHeight, this.canvasWidth);
        this.drawDotted(data, this.ctx, this.canvasHeight, this.space, this.dottedSize);
      }
      // 绘制网格
      LineChart.prototype.drawGrid = function(ctx,canvasHeight, canvasWidth, gridSize){
        var xLineTotal = Math.floor(canvasHeight / gridSize);
        var yLineTotal = Math.floor(canvasWidth / gridSize);
        // 绘制横线
        for(var i = 0; i < xLineTotal; i++){
          ctx.beginPath();
          ctx.moveTo(0, i * gridSize - .5);
          ctx.lineTo(canvasWidth, i * gridSize - .5);
          ctx.strokeStyle = "#ddd";
          ctx.stroke();
        }
        // 绘制竖线
        for(let i = 0; i < yLineTotal; i++){
          ctx.beginPath();
          ctx.moveTo(i * gridSize - .5, 0 );
          ctx.lineTo(i * gridSize - .5, canvasHeight);
          ctx.strokeStyle = "#ddd";
          ctx.stroke();
        }
      }
      //绘制坐标系
      LineChart.prototype.drawCoord = function(ctx, space, arrowSize, canvasHeight, canvasWidth){
        var x0 = space;
        var y0 = canvasHeight - space;
        // 绘制X轴
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(canvasWidth - space, y0);
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.lineTo(canvasWidth - space - arrowSize, y0 + arrowSize / 2);
        ctx.lineTo(canvasWidth - space - arrowSize, y0 - arrowSize / 2);
        ctx.lineTo(canvasWidth - space, y0);
        ctx.fill();

        // 绘制Y轴
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(space, space);
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.lineTo(space + arrowSize / 2, space + arrowSize);
        ctx.lineTo(space - arrowSize / 2, space + arrowSize);
        ctx.lineTo(space, space);
        ctx.fill();
      }
      // 绘制点并连线
      LineChart.prototype.drawDotted = function(data,ctx,canvasHeight,space,dottedSize){
        var x0 = space;
        var y0 = canvasHeight - space ;
        var prevCanvasX = 0;
        var prevCanvasY = 0;
        data.forEach(function(item,i){
          var canvasX = x0 + item.x;
          var canvasY = y0 - item.y;
          ctx.beginPath();
          ctx.moveTo(canvasX - dottedSize / 2, canvasY - dottedSize / 2);
          ctx.lineTo(canvasX + dottedSize / 2, canvasY - dottedSize / 2);
          ctx.lineTo(canvasX + dottedSize / 2, canvasY + dottedSize / 2);
          ctx.lineTo(canvasX - dottedSize / 2, canvasY + dottedSize / 2);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          if(i == 0){
            ctx.moveTo(x0, y0);
            ctx.lineTo(canvasX, canvasY);
            ctx.stroke();
          }else{
            // ctx.moveTo(x0+data[i-1].x, y0 - data[i-1].y);
            ctx.moveTo(prevCanvasX, prevCanvasY);
            ctx.lineTo(canvasX, canvasY);
            ctx.stroke();
          }
          prevCanvasX = canvasX;
          prevCanvasY = canvasY;
        });


      }


})();