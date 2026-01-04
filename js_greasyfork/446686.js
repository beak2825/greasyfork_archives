// ==UserScript==
// @name         b站抢原石（开发版）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动抢原石
// @author       小叮当
// @match        https://www.bilibili.com/blackboard/activity-award-exchange.html?task_id=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/446686/b%E7%AB%99%E6%8A%A2%E5%8E%9F%E7%9F%B3%EF%BC%88%E5%BC%80%E5%8F%91%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/446686/b%E7%AB%99%E6%8A%A2%E5%8E%9F%E7%9F%B3%EF%BC%88%E5%BC%80%E5%8F%91%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

var nowtime
var stringTime2 //定时的时间变量
var roomid //24391665,25139243,23522089
var countdown0 //倒计时
var flag=false
var f1 //main函数
var f2 //连点函数
var storge //存储变量
var n //弹幕数量
var m=0 //直播间数量
var text2_start //弹幕循环
var array

var uid //送礼物的uid
var ruid = [] //被送礼物的uid
var biz_id = [] //被送礼物的直播间
var gift_num = []//礼物数量
var gift_count=1 //礼物次数 每次刷新会重置
var cnt=1 //取余数
var cdk_context = []

var array_length //输入数组的长度
var room = GM_getValue("room"); //弹幕房间
var data = GM_getValue("data"); //礼物房间信息
var count_ = 1//循环次数
roomid = GM_getValue("b_room0"); //初始化
data = GM_getValue("data")

var act_id
var task_id = []//网页参数
var group_id = []
var receive_id = []
var receive_from = []
var reward_name = []
var task_name = []
if (GM_getValue("b_stringTime2"))
{
    stringTime2 = GM_getValue("b_stringTime2")
    console.log("不为空")
}
else{
    GM_setValue("b_stringTime2", "2022-6-30 1:59:40")
    stringTime2 = GM_getValue("b_stringTime2");
    console.log("为空")
}


//GM_setValue("stringTime2", "2022-5-30 1:59:40")
//var stringTime2 = "2022-5-30 1:59:40";
console.log(GM_getValue("b_stringTime2"))
var t2 = Date.parse(new Date(stringTime2));



var stringTime3 = "2022-7-12 4:0:0";//到期时间
var t3 = Date.parse(new Date(stringTime3));

if(Date.now()<t3){

    GM_addStyle(
        `

* {
	padding:0;
	margin:0 auto;
}
body,html {
	height:113%;
	display:flex;
	justify-content:center;
	background:rgb(73,73,73);
	font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;
}
main {
	width:150px;
	height:550px;
	/* border:1px solid black;
	*/
 transform:scale(0.8);
}
.TextStyle{
    width :300px ;
    height :16px ;
    line-height :16px ;
    border :1px solid #006699 ;
    font :12px "Microsoft Sans Serif" ;
    padding :2px ;
    color :#006699 ;
}

#button {
	width:100%;
	height:60px;
	cursor:pointer;
	position:relative;
	color:white;
	text-align:center;
	line-height:60px;
	font-size:25px;
	margin-bottom:20px;
	transition:0.5s;
	top:0;
}
#text0 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    //text-align: center;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text1 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    //text-align: center;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text2 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text3 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text4 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text5 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text6 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text7 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text8 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text9 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text10 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text11 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text12 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text13 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text14 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text15 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#text16 {
	margin: 2px auto;
    font-size: 20px;
    font-weight: 500;
    width: 1000px;
    color: #ffffff;
	line-height:25px;
}
#countdown {
	margin:2px auto;
	font-size:25px;
	font-weight:700;
	text-align:center;
    color:#ffffff;
}
#countdown2 {
	margin:2px auto;
	font-size:25px;
	font-weight:700;
	text-align:center;
    color:#ffffff;
}
#countdown3 {
	margin:2px auto;
	font-size:25px;
	font-weight:700;
	text-align:center;
    color:#ffffff;
}
#button a {
	width:100%;
	height:100%;
	display:block;
	position:relative;
	z-index:5;
	color:#1b1818;
	text-decoration:none;
	transition:0.2s;
	top:0;
}
.one::before {
	content:'';
	width:100%;
	height:60px;
	position:absolute;
	left:0;
	transition:0.5s;
	background:rgb(93,131,243);
	z-index:1;
}
.one:hover:before {
	filter:blur(15px);
}
.one:hover a {
	transform:scale(1.1);
	text-shadow:0 0 10px white;
}

.one1::before {
	content:'';
	width:100%;
	height:60px;
	position:absolute;
	left:0;
	transition:0.5s;
	background:rgb(93,131,243);
	z-index:1;
}
.one1:hover:before {
	filter:blur(15px);
}
.one1:hover a {
	transform:scale(1.1);
	text-shadow:0 0 10px white;
}
.two::before {
	content:'';
	width:100%;
	height:60px;
	background:rgb(93,243,198);
	position:absolute;
	left:0;
}
.two1::before {
	content:'';
	width:100%;
	height:60px;
	background:rgb(93,243,198);
	position:absolute;
	left:0;
}
@keyframes move {
	0% {
	box-shadow:0px 0 0 rgb(93,243,198),0px 0 0 rgb(93,243,198),0px 0 0 rgb(93,243,198),0px 0 0 rgb(93,243,198),0px 0 0 rgb(93,243,198);
}
50% {
	box-shadow:-1px -1px 0 rgb(93,243,198),-2px -2px 0 rgb(93,243,198),-3px -3px 0 rgb(93,243,198),-4px -4px 0 rgb(93,243,198),-5px -5px 0 rgb(93,243,198);
}
100% {
	box-shadow:1px 1px 0 rgb(93,243,198),2px 2px 0 rgb(93,243,198),3px 3px 0 rgb(93,243,198),4px 4px 0 rgb(93,243,198),5px 5px 0 rgb(93,243,198);
}
}@keyframes moves {
	0% {
	left:0;
	top:0;
}
50% {
	left:-5px;
	top:-5px;
	transform:scale(1.2)
}
100% {
	left:5px;
	top:5px;
	transform:scale(0.9)
}
}.two:hover::before {
	animation:move 0.4s ease 2 alternate;
}
.two1:hover::before {
	animation:move 0.4s ease 2 alternate;
}
.two:hover a {
	animation:moves 0.4s ease 2 alternate;
}
.two1:hover a {
	animation:moves 0.4s ease 2 alternate;
}
.three::before {
	content:'';
	width:100%;
	height:60px;
	background:rgba(255,255,255,0.748);
	position:absolute;
	left:0;
}
.three1::before {
	content:'';
	width:100%;
	height:60px;
	background:rgba(255,255,255,0.748);
	position:absolute;
	left:0;
}
@keyframes move3 {
	0% {
	text-shadow:0px 0px 0 rgb(46,46,46),0px 0px 0 rgb(46,46,46),0px 0px 0 rgb(46,46,46),0px 0px 0 rgb(46,46,46),0px 0px 0 rgb(46,46,46);
}
50% {
	text-shadow:5px 5px 5px rgb(46,46,46),15px 10px 5px rgb(46,46,46),25px 15px 5px rgb(46,46,46),35px 20px 5px rgb(46,46,46),45px 25px 5px rgb(46,46,46);
}
100% {
	text-shadow:-5px -5px 5px rgb(46,46,46),-15px -10px 5px rgb(46,46,46),-25px -15px 5px rgb(46,46,46),-35px -20px 5px rgb(46,46,46),-45px -25px 5px rgb(46,46,46);
}
}@keyframes moves3 {
	0% {
	left:0;
	top:0;
}
50% {
	left:25px;
	top:15px;
	filter:blur(10px);
}
100% {
	left:-25px;
	top:-15px;
	filter:blur(10px);
}
}.three:hover {
	animation:move3 0.4s ease 2 alternate;
}
.three:hover::before {
	animation:moves3 0.5s linear 2 alternate;
}
.three1:hover {
	animation:move3 0.4s ease 2 alternate;
}
.three1:hover::before {
	animation:moves3 0.5s linear 2 alternate;
}
.four {
	overflow:hidden;
	background:rgb(243,171,93);
}
.four::before {
	content:'一键送礼';
	width:100%;
	height:60px;
	position:absolute;
	left:0;
	top:-3px;
	transform:scale(2);
	z-index:1;
	color:rgb(42,42,42);
	opacity:0;
	transition:0.5s;
}
.four::after {
	content:'一键送礼';
	width:100%;
	height:60px;
	position:absolute;
	left:0;
	top:-3px;
	transform:scale(2);
	z-index:1;
	color:black;
	opacity:0;
	transition:0.5s;
}
.four:hover::before {
	transition-delay:0.2s;
	opacity:1;
	top:0;
	transform:scale(1);
}
.four:hover::after {
	opacity:1;
	top:0;
	transform:scale(1);
}
.four1 {
	overflow:hidden;
	background:rgb(243,171,93);
}
.four1::before {
	content:'礼物设定';
	width:100%;
	height:60px;
	position:absolute;
	left:0;
	top:-3px;
	transform:scale(2);
	z-index:1;
	color:rgb(42,42,42);
	opacity:0;
	transition:0.5s;
}
.four1::after {
	content:'礼物设定';
	width:100%;
	height:60px;
	position:absolute;
	left:0;
	top:-3px;
	transform:scale(2);
	z-index:1;
	color:black;
	opacity:0;
	transition:0.5s;
}
.four1:hover::before {
	transition-delay:0.2s;
	opacity:1;
	top:0;
	transform:scale(1);
}
.four1:hover::after {
	opacity:1;
	top:0;
	transform:scale(1);
}
.five a {
	background:rgb(243,93,93);
}
.five::before {
	content:'';
	width:5px;
	height:5px;
	border-radius:50%;
	position:absolute;
	left:0;
	top:25px;
	transition:0.5s ease;
	opacity:1;
	box-shadow:0px 0 0px red,0px -25px 0px red,0px 30px 0px red,0px -9px 0px red;
}
.five::after {
	content:'';
	width:5px;
	height:5px;
	border-radius:50%;
	position:absolute;
	right:0;
	top:25px;
	transition:0.5s ease;
	opacity:1;
	box-shadow:0px 0 0px red,0px -15px 0px red,0px 25px 0px red,0px -9px 0px red;
}
.five:hover::before {
	opacity:1;
	transform:translateX(-30px);
	box-shadow:10px 0 2px red,-20px -30px 7px red,-15px 30px 5px red,-8px -9px 5px red;
}
.five:hover::after {
	opacity:1;
	transform:translateX(30px);
	box-shadow:-5px 0 2px red,20px -15px 7px red,10px 25px 5px red,8px -9px 5px red;
}
.five:hover a {
	background:none;
	box-shadow:0 0 50px rgba(253,77,77,0.857) inset;
}

.five1 a {
	background:rgb(243,93,93);
}
.five1::before {
	content:'';
	width:5px;
	height:5px;
	border-radius:50%;
	position:absolute;
	left:0;
	top:25px;
	transition:0.5s ease;
	opacity:1;
	box-shadow:0px 0 0px red,0px -25px 0px red,0px 30px 0px red,0px -9px 0px red;
}
.five1::after {
	content:'';
	width:5px;
	height:5px;
	border-radius:50%;
	position:absolute;
	right:0;
	top:25px;
	transition:0.5s ease;
	opacity:1;
	box-shadow:0px 0 0px red,0px -15px 0px red,0px 25px 0px red,0px -9px 0px red;
}
.five1:hover::before {
	opacity:1;
	transform:translateX(-30px);
	box-shadow:10px 0 2px red,-20px -30px 7px red,-15px 30px 5px red,-8px -9px 5px red;
}
.five1:hover::after {
	opacity:1;
	transform:translateX(30px);
	box-shadow:-5px 0 2px red,20px -15px 7px red,10px 25px 5px red,8px -9px 5px red;
}
.five1:hover a {
	background:none;
	box-shadow:0 0 50px rgba(253,77,77,0.857) inset;
}
.six a {
	background:rgb(214,231,99);
}
.six::before {
	content:'';
	width:100%;
	height:60px;
	position:absolute;
	left:0;
	transition:0.5s;
	opacity:0;
	box-shadow:0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99);
}
.six::after {
	content:'';
	width:100%;
	height:60px;
	position:absolute;
	top:0;
	right:0;
	transition:0.5s;
	opacity:0;
	box-shadow:0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99);
}
.six:hover::before {
	opacity:0.5;
	box-shadow:-5px 0 5px rgb(121,127,80),-15px 0 5px rgb(170,182,93),-25px 0 5px rgb(171,182,99),-35px 0 5px rgb(217,225,165),-45px 0 5px rgb(227,230,213);
}
.six:hover::after {
	opacity:0.5;
	box-shadow:5px 0 5px rgb(121,127,80),15px 0 5px rgb(170,182,93),25px 0 5px rgb(171,182,99),35px 0 5px rgb(217,225,165),45px 0 5px rgb(227,230,213);
}
.six:hover a {
	filter:blur(1px)
}

.six1 a {
	background:rgb(214,231,99);
}
.six1::before {
	content:'';
	width:100%;
	height:60px;
	position:absolute;
	left:0;
	transition:0.5s;
	opacity:0;
	box-shadow:0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99);
}
.six1::after {
	content:'';
	width:100%;
	height:60px;
	position:absolute;
	top:0;
	right:0;
	transition:0.5s;
	opacity:0;
	box-shadow:0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99),0px 0 0px rgb(214,231,99);
}
.six1:hover::before {
	opacity:0.5;
	box-shadow:-5px 0 5px rgb(121,127,80),-15px 0 5px rgb(170,182,93),-25px 0 5px rgb(171,182,99),-35px 0 5px rgb(217,225,165),-45px 0 5px rgb(227,230,213);
}
.six1:hover::after {
	opacity:0.5;
	box-shadow:5px 0 5px rgb(121,127,80),15px 0 5px rgb(170,182,93),25px 0 5px rgb(171,182,99),35px 0 5px rgb(217,225,165),45px 0 5px rgb(227,230,213);
}
.six1:hover a {
	filter:blur(1px)
}



.seven {
	}.seven::before {
	content:'';
	width:100%;
	height:100%;
	position:absolute;
	left:0;
	background:rgb(132,133,132);
}
.seven::after {
	content:'';
	width:100%;
	height:100%;
	position:absolute;
	left:0;
	top:0;
	opacity:0.7;
	background:rgb(141,233,116);
}
.seven a {
	}@keyframes move7 {
	0% {
	text-shadow:0px 0px 0px black,0px 0px 0px black,0px 0 0px black,0px 0 0px black;
}
50% {
	text-shadow:0px 0px 2px black,5px 0px 2px black,10px 0 2px black,15px 0 2px black;
}
100% {
	text-shadow:0px 0px 2px black,-5px 0px 2px black,-10px 0 2px black,-15px 0 2px black;
}
}@keyframes moves7 {
	0% {
	transform:translateX(0);
}
50% {
	filter:blur(5px);
	transform:translateX(10px);
}
100% {
	transform:translateX(-10px);
	filter:blur(5px);
}
}.seven:hover a {
	animation:move7 0.2s linear 2 alternate;
}
.seven:hover::before {
	animation:moves7 0.15s linear 2 alternate;
}
.seven:hover::after {
	animation:moves7 0.15s linear 2 alternate-reverse;
}


.seven1 {
	}.seven1::before {
	content:'';
	width:100%;
	height:100%;
	position:absolute;
	left:0;
	background:rgb(132,133,132);
}
.seven1::after {
	content:'';
	width:100%;
	height:100%;
	position:absolute;
	left:0;
	top:0;
	opacity:0.7;
	background:rgb(141,233,116);
}
.seven1 a {
	}@keyframes move7 {
	0% {
	text-shadow:0px 0px 0px black,0px 0px 0px black,0px 0 0px black,0px 0 0px black;
}
50% {
	text-shadow:0px 0px 2px black,5px 0px 2px black,10px 0 2px black,15px 0 2px black;
}
100% {
	text-shadow:0px 0px 2px black,-5px 0px 2px black,-10px 0 2px black,-15px 0 2px black;
}
}@keyframes moves7 {
	0% {
	transform:translateX(0);
}
50% {
	filter:blur(5px);
	transform:translateX(10px);
}
100% {
	transform:translateX(-10px);
	filter:blur(5px);
}
}.seven1:hover a {
	animation:move7 0.2s linear 2 alternate;
}
.seven1:hover::before {
	animation:moves7 0.15s linear 2 alternate;
}
.seven1:hover::after {
	animation:moves7 0.15s linear 2 alternate-reverse;
}
  ` )
    /* 点击按钮设置下拉菜单的显示与隐藏 */


    storge=window.sessionStorage.getItem('storge')

    console.log(storge)
    var a = document.createElement('button')
    a.style.background='rgba(140, 140,140, 140)';//颜色弄得差不多吧
    a.style.color="rgb(242, 242, 242)";
    a.innerHTML='设定好时间后，再点我开启'
    a.style.border='3px solid white'//style.border="宽度值 样式值 颜色值"
    a.style.position='absolute'//绝对定位
    a.style.left='75%'
    a.style.top='100px'
    a.style.fontSize='20px'

    var c = document.createElement('button')
    c.style.background='rgba(140, 140,140, 140)';//颜色弄得差不多吧
    //c.innerHTML='一键领取日常奖励开启'
    c.innerHTML="定时时间:"+stringTime2
    c.style.color="rgb(242, 242, 242)";
    c.style.border='3px solid white'//style.border="宽度值 样式值 颜色值"
    c.style.position='absolute'//绝对定位
    c.style.left='75%'
    c.style.top='130px'
    c.style.fontSize='20px'
    c.style.backgroundposition='center'

    var d = document.createElement('button')
    d.style.background='rgba(0, 0,0, 0)';//颜色弄得差不多吧
    d.style.color="rgb(242, 242, 242)";
    //d.style.border='3px solid white'//style.border="宽度值 样式值 颜色值"
    d.style.position='absolute'//绝对定位
    d.style.left='3%'
    d.style.top='190px'
    d.style.fontSize='20px'
    d.style.backgroundposition='center'



    var b=document.querySelector('body')
    //b.append(a)
    //b.append(c)
    //b.append(d)
    //b.append(e)
    //a.addEventListener("click", text);//监听
    //c.addEventListener("click", text1);//监听
    //e.addEventListener("click", text3);//监听

    const dom0 = document.createElement('div') //剩余的时间
    const dom2 = document.createElement('div') //现在时间
    const dom3 = document.createElement('div') //定时的时间
    const dom4 = document.createElement('div') //danmu
    dom0.setAttribute('class', 'time0')
    dom2.setAttribute('class', 'time2')
    dom3.setAttribute('class', 'time3')
    dom4.setAttribute('class', 'danmu')
    dom0.style.top = '160px'
    dom0.style.left='75%'
    dom0.style.position='absolute'//绝对定位
    dom2.style.top = '100px'
    dom2.style.left='75%'
    dom2.style.position='absolute'//绝对定位
    dom3.style.top = '130px'
    dom3.style.left='75%'
    dom3.style.position='absolute'//绝对定位
    dom4.style.top = '60px'
    dom4.style.left='1%'
    dom4.style.position='absolute'//绝对定位
    //<button onclick="myFunction()" class="dropbtn">下拉菜单</button>
    const time = `
    <div id="countdown">
    剩余时间: 00天00:00:00
</div>
`
    const now_time=`
    <div id="countdown2">
</div>
    `
    const set_time=`
    <div id="countdown3">
</div>
    `
    const danmu=`
    <main>
    <div id="text0" class="txt0"></div>
    <div id="text1" class="txt1"></div>
    <div id="text2" class="txt2"></div>
    <div id="text3" class="txt3"></div>
    <div id="text4" class="txt4"></div>
    <div id="text5" class="txt5"></div>
    <div id="text6" class="txt6"></div>
    <div id="text7" class="txt7"></div>
    <div id="text8" class="txt8"></div>
    <div id="text9" class="txt9"></div>
    <div id="text10" class="txt10"></div>
    <div id="text11" class="text11"></div>
    <div id="text12" class="text12"></div>
    <div id="text13" class="text13"></div>
    <div id="text14" class="text14"></div>
    <div id="text15" class="text15"></div>
    <div id="text16" class="text16"></div>
</main>
`
    dom0.innerHTML = time
    document.body.appendChild(dom0)
    dom2.innerHTML = now_time
    document.body.appendChild(dom2)
    dom3.innerHTML = set_time
    document.body.appendChild(dom3)
    dom4.innerHTML = danmu
    document.body.appendChild(dom4)

    function text_store(){
        for(let i=16;i>0;i--){
            let a = i-1
            //console.log(a)
            document.getElementById("text"+i).innerHTML=document.getElementById("text"+a).innerHTML
        }
    }
    function clear(){
        for(let i=16;i>0;i--){
            document.getElementById("text"+i).innerHTML=""
        }
    }

    setInterval(function(){var myDate = new Date();document.getElementById("countdown2").innerText="本地时间:"+myDate.toLocaleString();},30);
    document.getElementById("countdown3").innerHTML = "设定时间:"+GM_getValue("b_stringTime2")

    function Countdown(end) {
        this.end = end;
        this.interval = null;

        this.Init = function() {
            this.interval = setInterval(this.GetCountdown, 1000);
        }

        this.GetCountdown = function() {
            let date = new Date(end) - new Date();

            if (date <= 0) {
                document.getElementById("countdown").innerHTML="剩余时间: 00天00:00:00";
                clearInterval(this.interval);
                return null;
            };

            let d = Math.floor(date / 1000 / 60 / 60 / 24) < 10 ? '0' + Math.floor(date / 1000 / 60 / 60 / 24) : Math.floor(date / 1000 / 60 / 60 / 24);
            let h = Math.floor(date / 1000 / 60 / 60 % 24) < 10 ? '0' + Math.floor(date / 1000 / 60 / 60 % 24) : Math.floor(date / 1000 / 60 / 60 % 24);
            let m = Math.floor(date / 1000 / 60 % 60) < 10 ? '0' + Math.floor(date / 1000 / 60 % 60) : Math.floor(date / 1000 / 60 % 60);
            let s = Math.floor(date / 1000 % 60) < 10 ? '0' + Math.floor(date / 1000 % 60) : Math.floor(date / 1000 % 60);

            document.getElementById("countdown").innerHTML="剩余时间: "+ d + "天" + h + ":" + m + ":" + s

            return null;
        }
    }

    countdown0 = new Countdown(GM_getValue("b_stringTime2")).Init();

    const dom = document.createElement('div')
    dom.setAttribute('class', 'dropdown')
    dom.style.top = '200px'
    dom.style.left='75%'
    dom.style.position='absolute'//绝对定位
    //<button onclick="myFunction()" class="dropbtn">下拉菜单</button>
    const button = `
    <main>
    <div id="button" class="one"><a href="javascript:;">启动</a></div>
    <div id="button" class="two"><a href="javascript:;">发送弹幕</a></div>
    <div id="button" class="three"><a href="javascript:;">一键导出</a></div>
    <div id="button" class="four"><a href="javascript:;">一键送礼</a></div>
    <div id="button" class="five"><a href="javascript:;">一键领奖</a></div>
    <div id="button" class="six"><a href="javascript:;">一键挂机</a></div>
    <div id="button" class="seven"><a href="javascript:;">一键任务</a></div>

</main>
`
    const dom1 = document.createElement('div')
    dom1.setAttribute('class', 'dropdown1')
    dom1.style.top = '200px'
    dom1.style.left='85%'
    dom1.style.position='absolute'//绝对定位
    //<button onclick="myFunction()" class="dropbtn">下拉菜单</button>
    const button_1 = `
    <main>
    <div id="button" class="one1"><a href="">设定定时</a></div>
    <div id="button" class="two1"><a href="javascript:;">弹幕直播间</a></div>
    <div id="button" class="three1"><a href="javascript:;">Button</a></div>
    <div id="button" class="four1"><a href="javascript:;">礼物设定</a></div>
    <div id="button" class="five1"><a href="javascript:;">领奖时间</a></div>
    <div id="button" class="six1"><a href="javascript:;">Button</a></div>
    <div id="button" class="seven1"><a href="javascript:;">Button</a></div>

</main>

`
    dom.innerHTML = button
    document.body.appendChild(dom)
    dom1.innerHTML = button_1
    document.body.appendChild(dom1)


    var button1 = document.getElementsByClassName('one')[0]
    button1.addEventListener("click", start_main);//启动
    var button2 = document.getElementsByClassName('one1')[0]
    button2.addEventListener("click", set_expected_time);//设定时间
    var button3 = document.getElementsByClassName('two')[0]
    button3.addEventListener("click", start_danmu);//发送弹幕
    var button4 = document.getElementsByClassName('two1')[0]
    button4.addEventListener("click", set_danmu);//弹幕房间
    var button5 = document.getElementsByClassName('three')[0]
    button5.addEventListener("click", auto_put);//一键导出
    var button6 = document.getElementsByClassName('four')[0]
    button6.addEventListener("click", send_gift);//一键送礼
    var button7 = document.getElementsByClassName('four1')[0]
    button7.addEventListener("click", set_gift);//礼物设置
    var button8 = document.getElementsByClassName('five')[0]
    button8.addEventListener("click", start_reward);//一键领奖
    var button9 = document.getElementsByClassName('six')[0]
    button9.addEventListener("click", auto_guaiji);//自动挂机
    var button10 = document.getElementsByClassName('five1')[0]
    button10.addEventListener("click", set_sec);//设置挂机循环
    var button11 = document.getElementsByClassName('seven')[0]
    button11.addEventListener("click", auto_task);//一键任务
    //cdk_context=['ATLLSBJGJH52']


    var key
    var per
    var n_time = Date.now();
    GM_xmlhttpRequest({
        method: "get",
        url: 'http://127.0.0.1:5000/test?key='+GM_getValue("key")+'&time='+n_time,
        headers:  {
            //"Content-Type": "application/json"
        },
        onload: function(res){
            console.log(res.responseText)
            //console.log(res)
            //GM_setValue("key", key)
            if(res.responseText == -1){
                alert('版本已经过期，请联系管理员更新！')
                return;
            }
            if(res.responseText == 1){
                per = '1'
                console.log("验证成功")
                if(per == '1'){
                }
            }
            if(res.responseText == 0){
                per = '0'
                console.log("验证失败")
                key = prompt("请输入密钥！然后刷新页面", key)
                GM_setValue("key", key)
                location.reload()
            }
        },
        onerror : function(err){
            console.log('服务器响应失败！请联系管理员启动服务器')
            //alert('服务器响应失败！请联系管理员启动服务器')
        }

    })

    function auto_task(){
        array = []
        array = GM_getValue("room").split(",")
        clear()
        //console.log(GM_getValue("giftCount").length)
        //setTimeout(send_gift,100)
        if(send_gift()==0){
            return 0
        }
        setTimeout(start_danmu,3000)
        clear()
        setTimeout(start_reward,10000)
        setTimeout(auto_guaiji,5000)

    }
    function auto_guaiji(){
        if(!GM_getValue("array_danmu")){
            console.log("请设置弹幕房间！")
            text_store()
            document.getElementById("text0").innerHTML="请设置弹幕房间！"
        }
        console.log(GM_getValue("array_danmu").length)
        for(let i=0;i<GM_getValue("array_danmu").length;i++){
            roomid = GM_getValue("b_room"+i)
            window.open('https://live.bilibili.com/'+roomid+'?broadcast_type=0&is_room_feed=1&spm_id_from=333.999.0.0&room=ok','_blank');
        }
    }
    function exchange_cdk(){

        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://hk4e-api.mihoyo.com/common/apicdkey/api/exchangeCdkey?sign_type=2&auth_appid=apicdkey&authkey_ver=1&cdkey=ATLLSBJGJH52&lang=zh-cn&device_type=pc&ext=%7b%22loc%22%3a%7b%22x%22%3a-3091.17041015625%2c%22y%22%3a252.10728454589845%2c%22z%22%3a-4429.59326171875%7d%2c%22platform%22%3a%22WinST%22%7d&game_version=CNRELWin2.7.0_R7169099_S7808520_D7808520&plat_type=pc&authkey=exuYLZw0gfp1sBK5byhzR2fAKyYtJX%2bpqsg8IqzHGQjZGiPZQmmmQPxx8N%2bYxoBv3gOdA8SK0yNURODzkDT9IuO%2fEKBlZg61zhwi6URKrWa7asvNCqSu0USsw054Cj5u3IplWXeVbEIk4rQzALP%2b72rYVdA%2fTyCpZx72bvxUTIJ5AgerRyWUj0OXaWrx%2bHBQV4rliiP2FswnmxwsQhBi0V0LhFwT8NcZoHXwPY7uQ%2fQ683GMx5TDepEdDzMVCnAkXzj%2b5YVW29H04ogxHYjUr1XV3JvozkraMq2dO2B6Fvoinvvn6jbvHkCO08lf352erQGMDVOHNHFoe31IOU7qvWnzK1%2ffwoygEr4ROYHVaEPJLVZwEAsxS3hFfOPXQ6GqfjaDCxIAOIvd2O0ue1L%2f2UyiyoyyTxFMMLl%2b%2fH2O78qoTYWmpZtGKQTLTuSDw890aknPwbomCQdLMYX8AFLXPglYTLDLHrLMdMgZK0gJWWLREcue0o%2fzgOsfwZc5jwq38Ganv%2f8J6cQm%2fp5ltWkxmMJ8PFfrFYY56nkEFSzwExYM%2fEKZA649cyhUaqVxr6MEOFv61E99%2b59kQ2PTtzCkQ4oIkgxXzLeFgtWxp09ZCcQJCWWvyyUCoALC%2fhl%2bf6T0mKBidzGSEPonxIip1k7AYuabJcoBKamC27CVcwajwDZmAQnW3TnS2CR8kZ7VZDZmnXkBekLFvHegqosGGOPIe%2btkSvKbz6P9HdSJ5AmJZRVW1eJ3sbsQ5%2bIEmFZQ25%2b8uBo93n8ZeO236cornnKx%2b8TA6%2f2LF854FqqDM70U%2bwCHH0axhPYEaLC%2f337ex%2fZN7AqGqfX8dgdIky8fgXYQgCUkkN4K7eMbdW7FYLffx7x8ODi3Q09pgYf9VOf%2f%2bZ004gj29rANxB705cs4FYsswE8IsFxpyUfdnNsPOXABgeVSCTF9HljjvTXRLLXhJSrCmuFPB%2f9aCCwWj%2fxcPa1HQSSMeg3GXuqnIJFAdkFOW%2fl6IxPpDDU4D1cWA6MRbUnuHzB9bBc%2bvwBhK1sUCb0Q6QNzfHrc%2fi6BnZ3EUAxCztH7cxKMgZAxUKmRrP0mm9lHdHnNQh3Ui%2bKSWQcqXE85jyIbQgTuMhri07%2bHSuLyvs6%2blcrhcgLwOhWdzFx4ZZNeonoh4%2btNJdlEgcBxXcgrMw5YrQKQDaSdF5EKO%2fnUFVDzvCMM6XUqZioE5BdDMNsHuGUz9KjHdurgrwsS%2bfS5BclkOBbDSAjnsuVx99kQGUGaHD5kWpyM6PLpFrVJsf00HLBjG2vAxN33J1mQmHF78RfN4xUlIDOBBVGs%2bElDmCCWG09%2bkEylhuA4Q%2fHt3h1hvmHL0hkfNNzd%2b8NKizQwnQ%3d%3d&game_biz=hk4e_cn',
            //data: 'sign_type=2&auth_appid=apicdkey&authkey_ver=1&cdkey=ATLLSBJGJH52&lang=zh-cn&device_type=pc&ext=%7b%22loc%22%3a%7b%22x%22%3a-3091.17041015625%2c%22y%22%3a252.10728454589845%2c%22z%22%3a-4429.59326171875%7d%2c%22platform%22%3a%22WinST%22%7d&game_version=CNRELWin2.7.0_R7169099_S7808520_D7808520&plat_type=pc&authkey=exuYLZw0gfp1sBK5byhzR2fAKyYtJX%2bpqsg8IqzHGQjZGiPZQmmmQPxx8N%2bYxoBv3gOdA8SK0yNURODzkDT9IuO%2fEKBlZg61zhwi6URKrWa7asvNCqSu0USsw054Cj5u3IplWXeVbEIk4rQzALP%2b72rYVdA%2fTyCpZx72bvxUTIJ5AgerRyWUj0OXaWrx%2bHBQV4rliiP2FswnmxwsQhBi0V0LhFwT8NcZoHXwPY7uQ%2fQ683GMx5TDepEdDzMVCnAkXzj%2b5YVW29H04ogxHYjUr1XV3JvozkraMq2dO2B6Fvoinvvn6jbvHkCO08lf352erQGMDVOHNHFoe31IOU7qvWnzK1%2ffwoygEr4ROYHVaEPJLVZwEAsxS3hFfOPXQ6GqfjaDCxIAOIvd2O0ue1L%2f2UyiyoyyTxFMMLl%2b%2fH2O78qoTYWmpZtGKQTLTuSDw890aknPwbomCQdLMYX8AFLXPglYTLDLHrLMdMgZK0gJWWLREcue0o%2fzgOsfwZc5jwq38Ganv%2f8J6cQm%2fp5ltWkxmMJ8PFfrFYY56nkEFSzwExYM%2fEKZA649cyhUaqVxr6MEOFv61E99%2b59kQ2PTtzCkQ4oIkgxXzLeFgtWxp09ZCcQJCWWvyyUCoALC%2fhl%2bf6T0mKBidzGSEPonxIip1k7AYuabJcoBKamC27CVcwajwDZmAQnW3TnS2CR8kZ7VZDZmnXkBekLFvHegqosGGOPIe%2btkSvKbz6P9HdSJ5AmJZRVW1eJ3sbsQ5%2bIEmFZQ25%2b8uBo93n8ZeO236cornnKx%2b8TA6%2f2LF854FqqDM70U%2bwCHH0axhPYEaLC%2f337ex%2fZN7AqGqfX8dgdIky8fgXYQgCUkkN4K7eMbdW7FYLffx7x8ODi3Q09pgYf9VOf%2f%2bZ004gj29rANxB705cs4FYsswE8IsFxpyUfdnNsPOXABgeVSCTF9HljjvTXRLLXhJSrCmuFPB%2f9aCCwWj%2fxcPa1HQSSMeg3GXuqnIJFAdkFOW%2fl6IxPpDDU4D1cWA6MRbUnuHzB9bBc%2bvwBhK1sUCb0Q6QNzfHrc%2fi6BnZ3EUAxCztH7cxKMgZAxUKmRrP0mm9lHdHnNQh3Ui%2bKSWQcqXE85jyIbQgTuMhri07%2bHSuLyvs6%2blcrhcgLwOhWdzFx4ZZNeonoh4%2btNJdlEgcBxXcgrMw5YrQKQDaSdF5EKO%2fnUFVDzvCMM6XUqZioE5BdDMNsHuGUz9KjHdurgrwsS%2bfS5BclkOBbDSAjnsuVx99kQGUGaHD5kWpyM6PLpFrVJsf00HLBjG2vAxN33J1mQmHF78RfN4xUlIDOBBVGs%2bElDmCCWG09%2bkEylhuA4Q%2fHt3h1hvmHL0hkfNNzd%2b8NKizQwnQ%3d%3d&game_biz=hk4e_cn',
            headers:  {
                "Content-Type": "text/plain",
                "Host": "hk4e-api.mihoyo.com",
                "X-Unity-Version": "2017.4.30f1",
                "Accept-Encoding": "identity",
                "User-Agent": "UnityPlayer/2017.4.30f1 (UnityWebRequest/1.0, libcurl/7.51.0-DEV)"
            },
            onload: function(response){
                function getQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]); return null;
                }
                //调用
                alert(getQueryString("authkey_ver"));
                alert(getQueryString("cdkey"));
                console.log("请求成功");
                console.log(response.responseText);
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
    }
    function start_main(){
        if (GM_getValue("b_stringTime2")!=null)
        {
            stringTime2 = GM_getValue("b_stringTime2")
            console.log("不为空")
        }
        else{
            GM_setValue("b_stringTime2", "2022-6-30 1:59:40")
            stringTime2 = GM_getValue("b_stringTime2");
            console.log("为空")
        }

        flag=!flag;
        if(flag){
            let myDate = new Date()
            storge=window.sessionStorage.getItem('storge')
            storge=!storge
            console.log(storge)
            window.sessionStorage.setItem('storge', 'true')
            text_store()
            document.getElementById("text0").innerHTML = myDate.toLocaleString()+':启动'
            console.log('启动');
            f1=setInterval(main,250) //主函数运行
        }else{

            let myDate = new Date()
            window.sessionStorage.setItem('storge', 'false')
            text_store()
            document.getElementById("text0").innerHTML = myDate.toLocaleString()+':关闭'
            console.log('关闭');
            clear()
            clearInterval(f1)
            clearInterval(f2)
        }
    }
    if(storge == "true"){
        //console.log("进来了")
        f1=setInterval(main,250) //主函数运行
    }
    else{
        clearInterval(f1);
    }
    function main(){
        if(Date.now()>=t2){
            //clearInterval(f1);//关闭循环检测f1
            //function reload(){
            try{
                let myDate = new Date()
                var a=document.getElementsByClassName('button exchange-button')[0]
                //console.log(a.innerText)
                if(a.innerText=="暂无领取资格" || a.innerText=="已达每日发放上限"){
                    text_store()
                    document.getElementById("text0").innerHTML = myDate.toLocaleString()+a.innerText
                    window.location.reload()
                }
                if(a.innerText=="领取奖励"){
                    console.log("执行连点");
                    f2=setInterval(function(){document.getElementsByClassName('button exchange-button')[0].click()},10);
                    //text_store()
                    document.getElementById("text0").innerHTML = myDate.toLocaleString()+a.innerText
                    clearInterval(f1);//关闭函数循环执行连点器
                    //}
                }
                if(a.innerText=="查看奖励"){
                    text_store()
                    document.getElementById("text0").innerHTML = myDate.toLocaleString()+"已领取"
                }

            }catch{
                console.log("加载过快")
            }
            //var f3=setInterval(reload,150);//时间到启动函数
        }
        else{
            //countdown = new Countdown(stringTime2).Init();
            //text_store()
            document.getElementById("text0").innerHTML = "时间还没到！"
            //console.log("时间还没到")
        }
    }
    //var f1=setInterval(main,10);//循环刷新检测
    function set_expected_time(){
        stringTime2 = GM_getValue("b_stringTime2");
        nowtime = prompt("请输入你要修改的定时时间,参照格式：2022-7-12 4:0:0", stringTime2)
        GM_setValue("b_stringTime2", nowtime)
        stringTime2 = GM_getValue("b_stringTime2");
        t2 = Date.parse(new Date(stringTime2));
        document.getElementById("countdown3").innerHTML = "设定时间:"+GM_getValue("b_stringTime2")
        countdown0 = new Countdown(GM_getValue("b_stringTime2")).Init();
        console.log('修改成功');
        text_store()
        document.getElementById("text0").innerHTML = "修改成功！"+stringTime2
        console.log(stringTime2)
    }
    //------------------------------------------------------------------------------------------------------自动发送弹幕
    function start_danmu(){
        flag=!flag
        n=0
        if(flag){
            if(!document.getElementById("text0").innerHTML){
                document.getElementById("text0").innerHTML = "开始发送"
            }else{
                text_store()
                document.getElementById("text0").innerHTML = "开始发送"
            }
            text2_start = setInterval(auto_danmu, 500)
        }else{
            clearInterval(text2_start)
            clear()
            if(!document.getElementById("text0").innerHTML){
                document.getElementById("text0").innerHTML = "停止发送"
            }else{
                text_store()
                document.getElementById("text0").innerHTML = "停止发送"
            }
        }
    }
    function auto_danmu(){
        if (!GM_getValue("b_room0"))
        {
            text_store()
            document.getElementById("text0").innerHTML = "请设置发送的房间"
            clearInterval(text2_start)
        }
        n=n+1
        //m=0
        if(n==2){ //当弹幕大于7
            n=0
            //console.log(array.length)
            m++
            roomid = GM_getValue("b_room"+m); //房间加1
            if(m>=GM_getValue("array_danmu").length){
                count_++
                if(count_==10){ //全部房间循环4次，8条弹幕，则停止发送
                    clearInterval(text2_start)
                    clear()
                }
                m=0
                roomid = GM_getValue("b_room"+m); //重置
            }
        }

        let formData = new FormData();
        let lis_text = ['666', '主播真厉害',
                        '爱了，爱了',
                        '关注走一走，活到99',
                        '牛逼！！！',
                        '秀儿，是你吗？',
                        '主播可以帮忙大深渊吗？',
                        '嗨起来，老铁们',
                        '原来你也在玩原神']
        let send_meg = lis_text[Math.floor(Math.random()*lis_text.length)]; //随机选择
        let sKey="bili_jct";
        let csrf=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        let uid_key = "DedeUserID";
        let uid=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(uid_key).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        //console.log('uid'+uid)
        formData.append('color', '16777215')
        formData.append('fontsize', '25')
        formData.append('mode', '1')
        formData.append('msg', send_meg)
        formData.append('rnd', Date.parse(new Date())/1000)
        formData.append('roomid', roomid)
        formData.append('bubble', '0')
        formData.append('csrf', csrf)
        formData.append('csrf_token', csrf)
        //console.log(send_meg)
        //console.log(formData)

        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', 'https://api.live.bilibili.com/msg/send', true);
        //httpRequest.setRequestHeader("Content-type","text/plain");
        httpRequest.withCredentials = true;//设置跨域发送带上cookie
        httpRequest.send(formData)
        httpRequest.onreadystatechange = function () {
            //console.log(httpRequest.responseText)
            var num = parseFloat(cnt%2); // 1 0 1 0
            cnt++
            if(num==0)
            {
                cnt=1
                //console.log(httpRequest.responseText)
                if(!document.getElementById("text0").innerHTML){
                    document.getElementById("text0").innerHTML = n+",直播间"+roomid+":"+send_meg
                }else{
                    text_store()
                    document.getElementById("text0").innerHTML = n+",直播间"+roomid+":"+send_meg
                }
            }
        }
    }
    function set_danmu(){
        //console.log(roomid)
        room = GM_getValue("room");
        let room_ = prompt("请输入要发送弹幕的直播间:房间1,房间2......", room)
        GM_setValue("room", room_)
        array = []
        //console.log(room)
        array = room_.split(",")
        GM_setValue("array_danmu",array)
        for(let i=0;i<array.length;i++){
            GM_setValue("b_room"+i, array[i])
        }
        roomid = GM_getValue("b_room0");
        if(!document.getElementById("text0").innerHTML){
            document.getElementById("text0").innerHTML = "修改成功！直播间:"+room_
        }else{
            text_store()
            document.getElementById("text0").innerHTML = "修改成功！直播间:"+room_
        }
    }
    //时间转换
    function getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    }
    function auto_put(){
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', 'https://api.bilibili.com/x/activity/rewards/awards/mylist?activity_id=1032&csrf=6103c4581e38201218f89e5d1e227c57', true);
        httpRequest.setRequestHeader("Content-type","text/plain");
        httpRequest.withCredentials = true;//设置跨域发送带上cookie
        let activity_id="1032";
        //let aid=window.__INITIAL_STATE__.aid;
        let sKey="bili_jct";
        let csrf=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;

        //上面这一段就是取出csrf,在cookie里面是bili_jct,这一段我是直接copy的,总之获取到就好了啦
        httpRequest.send('activity_id=1032&csrf='+csrf);
        httpRequest.onreadystatechange = function () {
            var num = parseFloat(cnt%2); // 1 0 1 0
            cnt++
            if (num==0)
            {
                cnt=1
                //console.log(csrf)
                console.log(JSON.parse(httpRequest.responseText))
                var json = JSON.parse(httpRequest.responseText)
                var long = json.data.list.length
                var array = []
                for(var i=0;i<long;i++){
                    var name = json.data.list[i].award_name
                    var cdk = json.data.list[i].extra_info.cdkey_content
                    var time = getLocalTime(json.data.list[i].receive_time)
                    //console.log(time)
                    array.push(time+"\t"+name+"\t"+cdk+"\n")
                }

                function exportRaw(data, name_data){
                    let urlObject = window.URL || window.webkitURL || window;
                    let export_blob = new Blob([data]);
                    let save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
                    save_link.href = urlObject.createObjectURL(export_blob);
                    save_link.download = name_data;
                    save_link.click();
                }
                let name_data = 'b_cdk.xls';//文件名
                exportRaw(array, name_data);
                text_store()
                document.getElementById("text0").innerHTML = "导出成功！"
            }
        }
    }
    function set_gift(){
        //console.log(roomid)
        ruid = []
        biz_id = []
        gift_num = [] //数组清除
        data = GM_getValue("data")
        let data_ = prompt("请输入要发送的直播间的：uid1,房间号1,礼物数量1;uid2,房间号2,礼物数量2.....", data) //1,2,3;1,2,3
        gift_count = 1
        GM_setValue("data", data_) //记录当前的输入数据
        let array0 = []
        let array1 = []
        console.log(data)
        array0 = data_.split(";") //[1,2,3] [4,5,6]
        GM_setValue("array0",array0)
        array_length = array0.length //获取输入数组的长度
        for(let i=0;i<array0.length;i++){
            array1 = array0[i].split(",")
            //console.log(array1)
            ruid.push(array1[0])
            GM_setValue("ruid",ruid)
            biz_id.push(array1[1])
            GM_setValue("biz_id",biz_id)
            gift_num.push(array1[2])
            GM_setValue("gift_num",gift_num)
            //GM_setValue("b_gift"+i, array1[i]) //ruid,room,礼物数量 0,1,2
        }

        console.log(ruid)
        console.log(biz_id)
        console.log(gift_num)
        text_store()
        document.getElementById("text0").innerHTML = "修改成功！"+data_
    }
    function send_gift(){
        var gift_cnt = 0 //礼物计数
        gift()
        //console.log("点击成功")
        function gift(){
            if(!GM_getValue("ruid")){
                text_store()
                document.getElementById("text0").innerHTML="请设置礼物房间参数！"
                return 0;
            }
            //console.log("尽力啊了")
            if(gift_cnt<GM_getValue("array0").length){
                console.log(GM_getValue("ruid")[gift_cnt])
                console.log(GM_getValue("biz_id")[gift_cnt])
                console.log(GM_getValue("gift_num")[gift_cnt])
                let formData = new FormData();
                let sKey="bili_jct";
                let csrf=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
                let uid_key = "DedeUserID";
                uid=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(uid_key).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
                formData.append('uid', uid) //365990770
                formData.append('gift_id', '31039')
                formData.append('ruid', GM_getValue("ruid")[gift_cnt]) //1562361662
                formData.append('send_ruid', '0')
                formData.append('gift_num', GM_getValue("gift_num")[gift_cnt])
                formData.append('coin_type', 'gold')
                formData.append('bag_id', '0')
                formData.append('platform', 'pc')
                formData.append('biz_code', 'Live')
                formData.append('biz_id', GM_getValue("biz_id")[gift_cnt]) //23522089
                formData.append('storm_beat_id', '0')
                formData.append('metadata', '')
                formData.append('price', '100')
                formData.append('csrf_token', csrf)
                formData.append('csrf', csrf)
                formData.append('visit_id', 'aed13yjj1wg0')

                //console.log(formData)

                var httpRequest = new XMLHttpRequest();
                httpRequest.open('POST', 'https://api.live.bilibili.com/xlive/revenue/v1/gift/sendGold', true);
                //httpRequest.setRequestHeader("Content-type","text/plain");
                httpRequest.withCredentials = true;//设置跨域发送带上cookie
                httpRequest.send(formData)
                httpRequest.onreadystatechange = function () {
                    let a = JSON.parse(httpRequest.responseText)
                    //console.log(a['code'])
                    var num = parseFloat(cnt%2); // 1 0 1 0
                    cnt++
                    if (num==0)
                    {
                        cnt=1
                        if(a.code == '200024' || a.code == '200005')
                        {
                            console.log(a.message)
                            text_store()
                            document.getElementById("text0").innerHTML = a.message
                        }
                        if(a.code == '-400')
                        {
                            console.log('参数为空，请设定送礼物信息')
                            text_store()
                            document.getElementById("text0").innerHTML = "参数为空，请设定送礼物信息"
                        }
                        if(a.code == '0')
                        {
                            console.log("送礼成功！直播间"+gift_cnt+"收到"+a.data.gift_list[0].gift_name+"x"+GM_getValue("gift_num")[gift_cnt])
                            text_store()
                            document.getElementById("text0").innerHTML = "送礼成功！直播间"+gift_cnt+"收到"+a.data.gift_list[0].gift_name+"x"+GM_getValue("gift_num")[gift_cnt]
                            gift_count++
                        }
                        gift_cnt++
                        gift()
                    }

                }
            }
        }
    }
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if(r != null) return (r[2]);
        return null;
    }
    var auto_msg
    var automsg
    var id
    var rewaed_flag = false
    var pre_time
    function start_reward(){
        rewaed_flag=!rewaed_flag;
        if(rewaed_flag){
            pre_time = setInterval(auto_reward,sec*1000) //定时领取日常奖励
            text_store()
            document.getElementById("text0").innerHTML = "自动领取启动"
            console.log('自动领取启动');

        }else{
            text_store()
            document.getElementById("text0").innerHTML = '自动领取关闭'
            console.log('自动领取关闭');
            clear()
            clearInterval(pre_time)
        }
    }
    var sec
    function set_sec(){
        sec = GM_getValue("sec");
        let sec_ = prompt("请输入要循环的时间单位：【秒】", sec)
        GM_setValue("sec", sec_)
        sec = GM_getValue("sec");
    }
    var heart_beat = 0
    function auto_reward(){
        task_id = []
        group_id = []
        receive_id =[]
        task_name =[]
        reward_name =[]
        let i=0
        let sKey="bili_jct";
        let csrf=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        id = ['1468a06c','94d21f92','e8bf8957','8d0f9e42','db8c4876','8677eb84']
        //----------------------------------------------------------------------------------------------函数2
        var sum = 0
        var name_ = ['累计开播60分钟-','累计开播120分钟-','收到10电池-','弹幕数满6条-','送出的牛娃牛娃满2人-','观看满10分钟-']
        //----------------------------------------------------------------------------------------------函数2
        for(var l=0;l<6;l++){
            auto_msg()
        }
        function auto_msg(){
            let i = l
            var httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', 'https://api.bilibili.com/x/activity/mission/single_task?csrf='+csrf+'&id='+id[i], false);
            httpRequest.withCredentials = true;//设置跨域发送带上cookie
            httpRequest.onreadystatechange = function () {
                    let type = encodeURIComponent(httpRequest.responseText)
                    //console.log(JSON.parse(decodeURIComponent(type)))
                    act_id = JSON.parse(decodeURIComponent(type)).data.task_info.act_id
                    task_id[i] = JSON.parse(httpRequest.responseText).data.task_info.group_list[0].task_id
                    group_id[i] = JSON.parse(httpRequest.responseText).data.task_info.group_list[0].group_id
                    receive_id[i] = JSON.parse(httpRequest.responseText).data.task_info.receive_id
                    task_name[i] = JSON.parse(httpRequest.responseText).data.task_info.task_name
                    reward_name[i] = JSON.parse(httpRequest.responseText).data.task_info.reward_info.reward_name

                    if(receive_id.length == 6)
                    {
                        i=6
                        console.log(task_id)
                        console.log(group_id)
                        console.log(receive_id)
                        console.log("获取数据成功")
                        text_store()
                        document.getElementById("text0").innerHTML = "获取数据成功"
                        //clearInterval(automsg)
                        //autocurrunt =setInterval(auto_currunt,500)
                        //setTimeout(function(){autocurrunt = setInterval(auto_currunt,100)},100)
                }
            }
            httpRequest.send();
        }
        for(var l1=0;l1<6;l1++){
            auto_currunt()
            //clear()
        }
        //----------------------------------------------------------------------------------------------函数2
        function auto_currunt(){
            let sKey="bili_jct";
            let csrf=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
            var httpRequest = new XMLHttpRequest();
            httpRequest.open('POST', 'https://api.bilibili.com/x/activity/mission/task/reward/receive',false);
            httpRequest.setRequestHeader ('Content-type', 'application/x-www-form-urlencoded')
            httpRequest.withCredentials = true;//设置跨域发送带上cookie
            //console.log(JSON.stringify(send_data))
            //上面这一段就是取出csrf,在cookie里面是bili_jct,这一段我是直接copy的,总之获取到就好了
            httpRequest.onreadystatechange = function () {
                    console.log(JSON.parse(httpRequest.responseText))
                    let a = JSON.parse(httpRequest.responseText)
                    let myDate = new Date()
                    if(a.code == 0){ //完成了
                        let name = JSON.parse(httpRequest.responseText).data.name
                        let cdk = JSON.parse(httpRequest.responseText).data.extra.cdkey_content
                        let time = getLocalTime(JSON.parse(httpRequest.responseText).data.receive_time)
                        console.log(time+'\t'+name+'\t'+cdk)
                        text_store()
                        document.getElementById("text0").innerHTML = time+'\t'+name+'\t'+cdk
                        sum++ //完成数量

                    }
                    if(a.code == -400){
                        text_store()
                        document.getElementById("text0").innerHTML =myDate.toLocaleString() + "\t"+name_[l1]+"暂时不可领取"
                        console.log(name_[l1]+"暂时不可领取")
                    }
                    if(a.code == 75086){ //已领取
                        text_store()
                        document.getElementById("text0").innerHTML =myDate.toLocaleString()+ "\t"+name_[l1] + a.message
                        console.log(name_[l1]+a.message)
                        //task_id.splice(j, 1);
                        //group_id.splice(j, 1);
                        //receive_id.splice(j, 1);
                        //name_.splice(j, 1);
                        sum++ //完成数量
                    }
                    if(a.code == 75154){ //来晚了没有奖励
                        text_store()
                        document.getElementById("text0").innerHTML =myDate.toLocaleString()+ "\t"+name_[l1] + a.message
                        console.log(name_[l1] + a.message)
                        //task_id.splice(j, 1);
                        //group_id.splice(j, 1);
                        //receive_id.splice(j, 1);
                        //name_.splice(j, 1);
                        sum++
                    }
                    if(a.code == -509){ //请求频繁
                        console.log(name_[l1] + a.message)
                        text_store()
                        document.getElementById("text0").innerHTML =myDate.toLocaleString()+ "\t"+name_[l1] + a.message
                        l1--
                    }
                    if(sum>5){
                        text_store()
                        document.getElementById("text0").innerHTML = myDate.toLocaleString()+"\t任务领取完毕"
                        console.log("任务领取完毕")
                        sum=0
                        rewaed_flag=!rewaed_flag;
                        clearInterval(pre_time)
                        return 0 //停止函数
                    }
                    console.log("sum:",sum)
                }
            //console.log(task_id[i])
            //console.log(group_id[i])
            //console.log(receive_id)
            httpRequest.send("csrf="+csrf+"&act_id="+act_id+"&task_id="+task_id[l1]+"&group_id="+group_id[l1]+"&receive_id="+receive_id[l1]+"&receive_from=missionLandingPage");
        }
        //httpRequest.send(formData) // 不知道为啥不能用
        //httpRequest.send(JSON.stringify(send_data))//也不能用
    }

}

if(Date.now()>t3){
    alert('版本无效，请更新最新版！')
}

