// ==UserScript==
// @name         腾讯课堂自动签到，可视化签到结果
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  会在直播右上角建一个可视化窗口用于交互，可自定义签到次数和每次间隔时间。在脚本的编辑中更改。
// @author       奥里给
// @match        https://ke.qq.com/webcourse/index.html*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/402203/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%EF%BC%8C%E5%8F%AF%E8%A7%86%E5%8C%96%E7%AD%BE%E5%88%B0%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/402203/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%EF%BC%8C%E5%8F%AF%E8%A7%86%E5%8C%96%E7%AD%BE%E5%88%B0%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==
//默认的次数和时间
(function(){
//定义签到的次数和等待的时间⬇
//签到次数⬇按需求更改
var ciShu=2;
//等待时间⬇按需求更改，建议默认值，单位秒
var denDai=10;
//----------初始值完成，下面勿动，懂js自行更改使用，永久免费开源，----------
var jieGuoY;
var ntime;
var neirong;
var mainD;
//---------这里使用了@wyn665817大佬写的html，感谢！------------
var html = (
        '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; left: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;">' +
            '<span style="font-size: medium;"></span>' +
            '<div id = "yunXin" style="font-size: medium;">脚本正常运行中...</div>' +
            '<div style="max-height: 300px; overflow-y: auto;">' +
                '<table border="1" style="font-size: 12px;">' +
                    '<thead>' +
                        '<tr>' +
                            '<th style="width: 30px; min-width: 100px; font-weight: bold; text-align: center;">类型</th>' +
                            '<th style="width: 60%; min-width: 100px; font-weight: bold; text-align: center;">时间</th>' +
                            '<th style="min-width: 100px; font-weight: bold; text-align: center;">结果</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody id = "jieGuoFanKui">' +
                    '</tbody>' +
                '</table>' +
            '</div>' +
        '</div>'
    );
//建立直播div对象
var addH = document.getElementById("react-body");
//创建div用于存放html
var Element = document.createElement("div");
//绑定元素
addH.appendChild(Element);
//添加元素
Element.innerHTML = html;
//创建反馈标签对象
var tjhs = document.getElementById("jieGuoFanKui");
//--------------main--------------
main();
function main(){
mainD = setInterval(qianDaoJiaoBen,denDai*1000);}
//---------腾讯课堂签到函数---------
function qianDaoJiaoBen(){
console.log("%c"+time()+"%c检测一次","color:red","color:black");
    var qianDaoBtn = document.getElementsByClassName("s-btn s-btn--primary s-btn--m");
    if((qianDaoBtn.length > 0) && (ciShu > 0)){
    for(var i of qianDaoBtn){
      if (i.innerHTML == '签到'){
          i.click();
          console.log("%c"+time()+"%c签到一次","color:red","color:black");
          tianJia();
          };
      if(i.innerHTML == '确定'){
            i.click();
            ciShu -= 1;
            break;};};
}else if(ciShu == 0){
    document.getElementById('yunXin').innerHTML = '所有签到已经完成，脚本关闭';
    clearInterval(mainD);};
console.log("未检测到");
}
//---------添加签到结果函数-------------
function tianJia(){
//创建div用于存放html
    jieGuoY=(
         '<td colspan="1">'+
         '签到'+
         '</td>' +
         '<td colspan="1">'+time()+
        '</td>' +
         '<td colspan="1">'+
         '成功'+
         '</td>');
neirong = document.createElement("tr");
tjhs.appendChild(neirong);
neirong.innerHTML = jieGuoY;}
//--------------获取时间----------
function time(){
var d = new Date();
ntime =(String(d.getHours())+':'+String(d.getMinutes())+':'+String(d.getSeconds()));
return ntime};
})();

