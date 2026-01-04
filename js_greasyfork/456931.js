// ==UserScript==
// @name         NFTFlip 自动邮件提醒脚本
// @namespace    成都3年java开发找工作，要人的联系我啊！作者还没班上！！
// @version      0.0.3
// @description  基于nftflip.ai平台的自动发送邮件插件脚本代码透明无任何钱包秘钥问题。因为作者老是错过nft出货时间，这个脚本诞生了。后期会考虑加入其它发送邮件的条件
// @author       JingMaster  Twitter：@EEck16 群内昵称：靖靖靖
// @match        https://review.nftflip.ai/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nftflip.ai
// @grant        none
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456931/NFTFlip%20%E8%87%AA%E5%8A%A8%E9%82%AE%E4%BB%B6%E6%8F%90%E9%86%92%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456931/NFTFlip%20%E8%87%AA%E5%8A%A8%E9%82%AE%E4%BB%B6%E6%8F%90%E9%86%92%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
   //全局变量
    //定义时间对象
    let time = new Date();
    //定义上一封邮件发送的日期
    var startSendMailDate = '1990/1/1 00:00:00';
    //现在的日期;
    var nowTime='';
    //定义是否需要发送邮件
    var isSend = false;
    //发送的间隔
    var timeInterval='';
    //发送短信/控制台输出前缀（自定义）
    var msg='您拥有的NFT 实时排名<br>\n';
    //定义发送短信排名(不包括)
    var rank = 5;
    //定义邮件时间间隔(分钟)
    var mailTime=15;
    //定义轮询间隔(毫秒，可自定义 推荐10000 1s=1000ms)
    var executeTime=10000;
    //接收者邮箱(需要更改)
    var to ='@qq.com';
    //发送者邮箱（需要跟你SMTP注册的邮箱地址一样）
    var from = '@gmail.com';
    //smtp服务秘钥（自己用自己的最好）
    var secureToken='';
    //邮件主题(自定义)
    var subject= 'Nft出货自动提醒！！！';
    //邮件内容(自定义 弃用)
    //var mailBody = `<span>该出货了，该出货了<br/>\n`+msg+`<br/></span>`;
    //控制台输出打印排名提醒(设定为true开启控制台输出)
    var consoleStatus = false;
    //请不要修改以下代码
    var Email = {
        send: function (a)
        { return new Promise(function (n, e)
        { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) })
        }, ajaxPost: function (e, n, t)
        { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }
         , ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () {
        var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) {
        var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };


   setInterval(function () {
    var itemClass = document.getElementsByClassName("bar-t-green-c");
    var s=$(itemClass[0]).parent().parent().children("td").eq(0).text();
    if(itemClass.length==0){
        let atime = new Date();
        if(consoleStatus==true){
        console.log(atime.toLocaleString()+'\n没有监控到拥有的nft进入排行榜');
        console.log('上一次邮件提醒时间为'+startSendMailDate);
        }
       return;
       }
    var itemArr = [];
    for(var i = 0; i< itemClass.length; i++){
			itemArr.push(itemClass[i]);
		}
	var numList = [];
    for(var j = 0; j< itemArr.length; j++){
			numList.push($(itemArr[j]).parent().parent().children("td").eq(0).text());
            numList.push($(itemArr[j]).parent().parent().children("td").eq(3).text());
            numList.push($(itemArr[j]).parent().parent().children("td").eq(4).text());
		}
       for(var k= 0; k< numList.length; k++){
           if(k==0){
           msg+=numList[k]+'名 【';
            msg+=document.getElementsByClassName('ant-radio-button-wrapper ant-radio-button-wrapper-checked')[0].children[1].innerText+'内交易次数：'+numList[k+1];
            msg+='当前地板价'+numList[k+2]+'】<br>\n';
           if(numList[k]<rank){
              isSend=true;
           }
           }else if(k%3==0){
            msg+=numList[k]+'名 【';
            msg+=document.getElementsByClassName('ant-radio-button-wrapper ant-radio-button-wrapper-checked')[0].children[1].innerText+'内交易次数：'+numList[k+1];
            msg+='当前地板价'+numList[k+2]+'】<br>\n';
           if(numList[k]<rank){
              isSend=true;
              console.log('此处设为true'+isSend)
           }
           }
		}
       if(consoleStatus==true){
            console.log(msg+'\n上一次邮件提醒时间为'+startSendMailDate)
       }
       if(isSend){
           let nowtime = new Date()
           nowTime=nowtime.toLocaleString();
           timeInterval = GetDateDiff(startSendMailDate,nowTime,'\/1000\/60')/1000/60;
           //console.log('发送邮件间隔时间'+timeInterval);
           if(timeInterval<mailTime){
               msg='您拥有的NFT 实时排名<br>\n';
               return;
           }
           let aftertime = new Date()
           startSendMailDate = aftertime.toLocaleString();
           sendEmailToMe(msg);
           console.log(startSendMailDate+'\n已发送到+'+to+'+邮件箱提醒')
           isSend=false;
       }
       msg='您拥有的NFT 实时排名<br>\n';
}, executeTime);

//时间比较（yyyy-MM-dd HH:mm:ss）
function GetDateDiff(startTime, endTime, diffType) {
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    diffType = diffType.toLowerCase();
    var sTime =new Date(startTime);
    var eTime =new Date(endTime);
    var timeType =1;
    switch (diffType) {
        case"second":
            timeType =1000;
        break;
        case"minute":
            timeType =1000*60;
        break;
        case"hour":
            timeType =1000*3600;
        break;
        case"day":
            timeType =1000*3600*24;
        break;
        default:
        break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
}


function sendEmailToMe(msg) {
    // 函数中的代码
  Email.send({
  SecureToken:secureToken,
  To: to,
  From: from,
  Subject: subject,
  Body: `<span>该出货了，该出货了<br/>\n`+msg+`<br/></span>`
}).then(
  message => {
    if (message == 'OK') {
      // 成功发送了邮件
    } else {
		console.error(message)
	}
  }
);
}
})();