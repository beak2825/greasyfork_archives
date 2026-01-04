// ==UserScript==
// @name        投放
// @namespace   Violentmonkey Scripts
/*
 * 目标网站
 */
// @match       http://192.168.0.97:8085/Statistics/*  
// @grant       GM_addStyle
// @version     1.0
// @author      zwj
// @description 自动修改关键词排名出价、直达出价
/*
 * 外部引用
 * require
 */
// @downloadURL https://update.greasyfork.org/scripts/412156/%E6%8A%95%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/412156/%E6%8A%95%E6%94%BE.meta.js
// ==/UserScript==
(function() {
  
	// 初始化一个 WebSocket 对象   接收服务端推送信息
//https://www.bootcdn.cn/ 开源库
//http://www.bootstrapmb.com/ 模板





  var ws;
  createWebsocket();
   //心跳机制
        let heart = {
            timeOut:3000,
            timeObj : null,
            serverTimeObj : null,
            start:function(){
                //console.log('start');
                let self = this;
                //清除延时器
                this.timeObj && clearTimeout(this.timeObj);
                this.serverTimeObj && clearTimeout(this.serverTimeObj);
                this.timeObj = setTimeout(function(){
                    ws.send(1);//发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
                    //定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
                    // ws.serverTimeObj=setTimeout(function(){
                    //     ws.close();
                    //     createWebsocket();
                    // },self.timeOut)
                },this.timeOut)
            }
        }
        
        //建立websocket连接函数
        function createWebsocket() {
            try {
                websocketData();
            } catch (e) {
                //进行重连;
                console.log('websocket连接错误');
                reConnect(socketUrl);
            }
        }
  function websocketData(){
     if ("WebSocket" in window){
      ws = new WebSocket("ws://192.168.0.33:8089/Statistics_branch/websocket");
      // 建立 websocket 连接成功触发事件
      ws.onopen = function () {
         console.log(dateFtt('yyyy-MM-dd hh:mm:ss',new Date())+"连接成功!!!!");
         // var  from={"serialNo":"xxx","idNo":"xxx"}
         // ws.send(JSON.stringify(from));//发送参数
        console.log(ws);
         heart.start();
      };

      // 当服务端处理完成后会将数据发送回来
      ws.onmessage = function (evt) { //服务端发送数据
        var result= evt.data;
        if(result=="pong"){
          
        }else{
          console.log("日期："+dateFtt('yyyy-MM-dd hh:mm:ss',new Date()));
          console.log(JSON.parse(evt.data));
          //result=
        }
        // var data = JSON.parse(evt.data)
        // console.log(data)    
        heart.start();
        //console.log(ws.readyState);//获取websocket链接状态
      };
      
      //断开重连
      ws.onclose = function(e) {
        console.log(dateFtt('yyyy-MM-dd hh:mm:ss',new Date())+'websocket closed: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
        // if (e.code == 1006) {
          //websocketData();
        // }
      };
       
    }else{
      // 浏览器不支持 WebSocket
      alert("您的浏览器不支持 WebSocket!");
    } 
  }
  //样式
	var style = "input[name='price']:focus,#tj:focus{outline: none;} #operation{position:fixed;top:10%;left:10px;padding: 20px 4px;background: #eee;z-index:99;box-shadow: 1px 1px 3px 1px #00000082;}";
	GM_addStyle(style);
	//页面元素
	var html = "<div id='operation'><div></div>搜索排名出价：<input name='price' style='width:100px;' type='number' autocomplete='off' />" +
		"<br>搜索直达出价：<input name='directPrice' style='width:100px;' type='number' autocomplete='off' /><br>"
  +"修改记录：<div style='border:1px solid #000;height:200px;height:100px;width:100%;overflow-y:scroll;' id='updateInfo'></div><br>"
    +"<button style='' id='tj'>调价</button></div>";
	//$("body").append(html);
  $('#tj').click(function(){
    ws.close();
  })
  var dateFtt = function(fmt, date) { //author: meizz 
		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"h+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
})(jQuery)
