// ==UserScript==
// @name         v2ex楼中楼
// @namespace    http://tampermonkey.net/
// @version      0.2.4.6
// @description  v2ex楼中楼增强
// @author       xianmua
// @match        https://*.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @run-at       document-end
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466852/v2ex%E6%A5%BC%E4%B8%AD%E6%A5%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/466852/v2ex%E6%A5%BC%E4%B8%AD%E6%A5%BC.meta.js
// ==/UserScript==

function popupWindow(content){
    let floatWindowWrapper,floatWindow,floatWindowGrandWrapper
    floatWindow=document.createElement("div")
    floatWindow.setAttribute("class","replyBoxPage")
    floatWindowWrapper=document.createElement("div")
    floatWindowWrapper.setAttribute("class","replyBoxPageWrapper")
    if(!document.querySelector(".replyBoxPageGrandWrapper")){//replyBoxPageGrandWrapper单独放在一个位置
        floatWindowGrandWrapper=document.createElement("div")
        floatWindowGrandWrapper.setAttribute("class","replyBoxPageGrandWrapper")
        document.querySelector("#Wrapper").appendChild(floatWindowGrandWrapper)
    }

    floatWindowGrandWrapper=document.querySelector(".replyBoxPageGrandWrapper")


    floatWindow.innerHTML=content
    floatWindowWrapper.innerHTML+=floatWindow.outerHTML

    function removeFloatWindow(){
        floatWindowNow.style.opacity = '0';
        floatWindowNow.style.pointerEvents = 'none';
        floatWindowNow.parentNode.remove();
        floatWindowGrandWrapper.style.display="none";
        floatWindowGrandWrapper.classList.remove("show");
    }
    //临时计算悬浮窗位置
    GM_addStyle(`
    .replyBoxPageWrapper{
      left:${wrapperLeft}px;
    }
    .replyBoxPage{
      width:${wrapperWidth}px;
    }
    `)
    //box
    let boxes=document.querySelectorAll(".box"),originBox
    for (let i in boxes){
        if(boxes[i].querySelector(".reply_content")!=null){
            originBox=boxes[i];
            break;
        }else{continue}
    }
    //如果已存在悬浮窗，需要先移除
    if(document.querySelector(".replyBoxPage")){
        document.querySelector(".replyBoxPage").parentNode.remove();
    }
    originBox.appendChild(floatWindowWrapper)//


    let floatWindowNow=document.querySelector(".replyBoxPage")
    if(rightBox){//楼中楼在右侧居中显示，设置css，调整楼中楼宽度。
        GM_addStyle(`
        .replyBoxPageWrapper {
          right: 0;
          margin-right: auto;
          z-index: 9999;
          justify-content:flex-end;
        }
        .replyBoxPage{
          width:${rightBoxWidth}px;
        `)
    }

    floatWindowNow.style.opacity = '1'
    floatWindowNow.style.pointerEvents = 'auto';
    //floatWindowGrandWrapper.style.display="block";

    floatWindowGrandWrapper.classList.add("show")
    //点击暗色/透明背景自动关闭楼中楼
    floatWindowGrandWrapper.addEventListener('click',function() {
        removeFloatWindow()
    })

    //通过监测x坐标，来实现同样效果
    if(outCommentAreaAutoClose){
        function handleMouseMove(event) {
            let x = event.clientX;
            if (x >= xRight || x <= xLeft) {
                removeFloatWindow()
            }
        }

        if (document.querySelector(".replyBoxPageGrandWrapper")) {
            // 阴影背景存在，才会开始检测鼠标位置
            document.querySelector(".replyBoxPageGrandWrapper").addEventListener('mousemove', handleMouseMove);
        }
    }

    if(outFloatAutoClose){//离开楼中楼自动关闭
        floatWindowNow.addEventListener('mouseleave', function() {//mouseleave进入子元素不会触发 mouseout貌似会触发，这两者有区别
            removeFloatWindow()
        });
        floatWindowNow.addEventListener('mouseover', function() {
            floatWindowNow.style.opacity = '1';
            floatWindowNow.style.pointerEvents = 'auto';
        });
    }

}

GM_addStyle(`
.replyBoxButton {
  background-color: transparent;
  border: 0px;
  color: gray;
  text-transform: uppercase;
  transition: all 0.3s;
  outline:none;
}

.replyBoxPage {
opacity:0;
  top: 50%;
  left: 50%;
  width: 0;
  max-height:90%;
  overflow:auto;
  background-color: #fff;
  box-shadow: 0 0 28px rgba(0, 0, 0, 0.9);
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  scroll-height:auto;
  pointer-events:none;
  user-select:auto;
}
.replyBoxPage::-webkit-scrollbar {
  width: 8px;
}

.replyBoxPage::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 4px;
}

.replyBoxPage::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

.replyBoxPage::-webkit-scrollbar-thumb:hover {
  background-color: #999;
}

.replyBoxPageWrapper {
  z-index: 1011;
  opacity:1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  -webkit-animation-name: animate;
  -webkit-animation-duration: 0.3s;
  animation-name: animate;
  animation-duration: 0.3s;
  pointer-events:none;
  user-select:auto;
}

@-webkit-keyframes animate {
  from {top:-10px;opacity:0.5}
  to {top:0px;opacity:1}
}
@keyframes animate {
  from {top:-10px;opacity:0.5}
  to {top:0px;opacity:1}
}

.replyBoxPage .replyBoxButton {
 color: transparent;
}

.replyBoxPageGrandWrapper {
  display:none;
  position: fixed;
  opacity:0.5;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);

}
.replyBoxPageGrandWrapper.show {
  display:block!important;
  animation-name: animateWrapper;
  animation-duration: 1s;
}
@keyframes animateWrapper {
  from {opacity:0}
  to {opacity:0.5}
}
`)
/*隐藏乱入的button，，出问题的页面：https://www.v2ex.com/t/942555
.replyBoxPage .replyBoxButton {
 color: transparent;
}
*/


unsafeWindow.preParse=function(button){
    let result=[]
    let fromMem=button.getAttribute("from")//@别人的人
    let toMem=button.getAttribute("to").split(",")//被@的人，用split重新转为数组
    let replyBoxLast=[]//真正的replyBox，如果同时@了多位，那么replyBox需要汇总加起来。fromMem肯定只有一位，toMem会有可能有多位
    if(toMem.length==1){
        result=unsafeWindow.findFirstReplyId(fromMem,toMem[0]);
        if(result[1]=="normal"){
            replyBoxLast=unsafeWindow.genReplyBox(result[0],fromMem,toMem[0])
        }else{
            replyBoxLast=unsafeWindow.genReplyBox(result[0],toMem[0],fromMem)
        }
    }//如果只@了一位的话，那么照常处理
    if(toMem.length>1){
        for(let i in toMem){
            let tmpReplyBox=[]
            result=unsafeWindow.findFirstReplyId(fromMem,toMem[i])//result[0]是第一次对话的replyid；reply[1]是需要在这个replyid前面寻找的 id，可能是toMem，也可能是fromMem
            if(result[1]=="normal"){
                tmpReplyBox=unsafeWindow.genReplyBox(result[0],fromMem,toMem[i])
            }else{
                tmpReplyBox=unsafeWindow.genReplyBox(result[0],toMem[i],fromMem)
            }
            for (let i in tmpReplyBox){//将返回的内容依次抽取出来，填充到一个新数组中
                replyBoxLast.push(tmpReplyBox[i])
            }
        }
    }
    genFloatWindow(replyBoxLast);
}

function genFloatWindow(replyBox){
    let tmp=''
    for(let i in replyBox){
        tmp+=replyBox[i].outerHTML
    }
    popupWindow(tmp)
}

function checkAtId(content,id){
    let isExist=Array.from(content).some(a=>{return a.textContent==id})
    return isExist
}

unsafeWindow.findFirstReplyId = function(fromMem,toMem) {//从前往后依次找，找到两位第一次对话的那条评论，从第一条对话的评论生成楼中楼，效果最好
    for (let i in replyList){
        let replyMem=replyList[i].querySelector("strong a").textContent;
        if(replyMem==fromMem){//如果是fromMem的评论
            if(replyList[i].querySelector(".reply_content a") && !replyList[i].querySelector(".reply_content a").hasAttribute("target")){//如果是fromMem @他人的评论类型,并且a标签不是链接
                //if(replyList[i].querySelector(".reply_content a").textContent==toMem){//如果是fromMem第一次@toMem
                let content=replyList[i].querySelectorAll(".reply_content a")
                if(checkAtId(content,toMem)){//同时@多个id的评论也要算上,所以使用querySelectorAll，并使用一个单独的函数checkAtId,来检测一条评论内是否有@指定id。
                    let tmpArray=[]
                    tmpArray.push(replyList[i].id.slice(2),"normal")
                    return tmpArray//返回这条 第一次会话的replyid，并且准备在此条评论前，收集全部的toMem评论
                }
            }
        }
        if(replyMem==toMem){//如果是toMem的评论
            if(replyList[i].querySelector(".reply_content a") && !replyList[i].querySelector(".reply_content a").hasAttribute("target")){//如果是toMem @他人的评论类型,并且a标签不是链接
                //if(replyList[i].querySelector(".reply_content a").textContent==fromMem){//如果是toMem第一次@fromMem
                let content=replyList[i].querySelectorAll(".reply_content a")
                if(checkAtId(content,fromMem)){
                    let tmpArray=[]
                    tmpArray.push(replyList[i].id.slice(2),"reverse")//颠倒fromMem和toMem
                    return tmpArray//...收集全部的fromMem评论
                }
            }
        }
    }
}

unsafeWindow.genReplyBox = function(currentReplyId,fromMem,toMem) {
    let replyBox=[]
    for (let i in replyList){
        //console.log(replyList[i])
        if(replyList[i].id.slice(2)<currentReplyId){//当前replyId之前的reply，筛选出toMem全部发言
            let replyMem=replyList[i].querySelector("strong a").textContent
            if(replyMem==toMem){
                replyBox.push(replyList[i])
            }
        }

        if(replyList[i].id.slice(2)==currentReplyId){replyBox.push(replyList[i])}//是当前replyId，需要包含在楼中楼内
        if(replyList[i].id.slice(2)>currentReplyId){//当前replyId之后的reply
            let replyMem=replyList[i].querySelector("strong a").textContent
            if(replyMem==toMem){//如果是被@人的发言，筛选出toMem回复fromMem的话
                if(replyList[i].querySelector(".reply_content a") && !replyList[i].querySelector(".reply_content a").hasAttribute("target")){//确定此评论 有在@其他id
                    let content=replyList[i].querySelectorAll(".reply_content a")
                    if(checkAtId(content,fromMem)){
                        replyBox.push(replyList[i])
                    }
                }
            }
            if(replyMem==fromMem){//如果是@别人的人的发言，筛选出fromMem回复toMem的话
                if(replyList[i].querySelector(".reply_content a") && !replyList[i].querySelector(".reply_content a").hasAttribute("target")){
                    let content=replyList[i].querySelectorAll(".reply_content a")
                    if(checkAtId(content,toMem)){

                        replyBox.push(replyList[i])
                    }
                }
            }
        }

    }
    return replyBox//返回楼中楼内容
    //console.log(replyBox)

}
var replyList=[],wrapperLeft,wrapperWidth,rightBoxWidth,xLeft,xRight,lastReplyBoxButton,
    rightBox=GM_getValue("rightBox",false),//右侧楼中楼开关
    outFloatAutoClose=GM_getValue("outFloatAutoClose",false),//鼠标离开悬浮窗 悬浮窗自动关闭
    outCommentAreaAutoClose=GM_getValue("outCommentAreaAutoClose",false),//鼠标离开主评论区，悬浮窗自动关闭
    autoFloatWindow=GM_getValue("autoFloatWindow",false),//在右侧全自动显示 最新一条楼中楼
    buttonTransparent=GM_getValue("buttonTransparent",false),//将按钮☸设置为全透明，页面更美观。
    animationState=GM_getValue("animationState",true),//过渡动画开关
    transparentBackground=GM_getValue("transparentBackground",false)//暗色背景全透明开关

function genButton(){
let cells=document.getElementsByClassName("cell")
for(let i in cells){
    if(!cells[i].id || cells[i].id=="member-activity"){continue}//没有replyid，或者id是进度条，跳过
    let atMember=cells[i].querySelector(".reply_content a")//有标签a
    let replyContent=cells[i].querySelector(".reply_content");
    if(atMember && replyContent.textContent.charAt(0)==="@"){//第一个字符为@，排除其他超链接情况
        //确定replyBoxButton位置
        let cRect = cells[i].getBoundingClientRect();
        let bTop = cRect.top + window.pageYOffset + cells[i].clientHeight-18;
        let bLeft = cells[i].offsetLeft+cells[i].offsetWidth-20;

        let fromMember=cells[i].querySelector("strong a").textContent//谁在@
        let atMemberTmp=cells[i].querySelectorAll(".reply_content a")//这里重新赋值。有可能同时@多位。要返回一个数组，后面判断长度。
        // 筛选出不带有 target 属性的 <a> 标签
        let atMemberList=[]
        for(let link of atMemberTmp){
            if(!link.hasAttribute("target")){
                atMemberList.push(link.textContent)//筛选出真正的@超链接，并将重要的textContent提取到数组中
            }
        }
        let atMemberListString=atMemberList.join(",")//需要转换成字符串传递，需要的时候使用split方法 重新转换为数组
        replyContent.style.display="inline"
        //replyContent.innerHTML+=`<button class="replyBoxButton" style="position:absolute;left:${bLeft};top:${bTop};font-size:18px" onmouseover="preParse(this);" onmouseout="disappear();"  from=${fromMember} to="${atMemberListString}">☸</button>`//右下角生成一个按钮
        replyContent.innerHTML+=`<button class="replyBoxButton" style="position:absolute;left:${bLeft}px;top:${bTop}px;width:18px;height:18px;line-height:18px"  onmouseover="preParse(this);" from=${fromMember} to="${atMemberListString}">☸</button>`

    }
    replyList.push(cells[i])
}
    wrapperLeft=replyList[0].offsetLeft+replyList[0].offsetWidth*0.09//replyBoxPage的偏移量，在缩放后需要再次计算，实现相对位置
    wrapperWidth=replyList[0].offsetWidth*0.82//缩放后重新计算宽度，保持在中间位。
    rightBoxWidth=document.documentElement.clientWidth-(replyList[0].offsetLeft+replyList[0].offsetWidth)
    xLeft=replyList[0].offsetLeft
    xRight=replyList[0].offsetLeft+replyList[0].offsetWidth
}

//应对缩放问题
window.onresize = function() {
  // 移除所有旧的按钮
  let oldButtons = document.querySelectorAll(".replyBoxButton");
  for (let i = 0; i < oldButtons.length; i++) {//不能用for ...in的写法，会出问题
    oldButtons[i].remove();
  }
  // 创建新的按钮
  replyList=[];//replyList置空，不然会生成重复内容
  genButton();
};

//Esc关闭悬浮窗
$("body")[0].addEventListener("keydown", function(){keyFunc(event)});
var keyFunc = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e.keyCode == 27){
        if(document.querySelector(".replyBoxPage")){
            let float=document.querySelector(".replyBoxPage"),floatWindowGrandWrapper=document.querySelector(".replyBoxPageGrandWrapper")
            float.style.opacity = '0';
            float.style.pointerEvents = 'none';
            float.parentNode.remove();
            floatWindowGrandWrapper.style.display="none"
            floatWindowGrandWrapper.classList.remove("show")
        }
    }
}
//配置开关项，默认关闭，需要可手动开启
function toggle_rightBox(){GM_setValue("rightBox",!rightBox);window.location.reload()}
function toggle_outFloatAutoClose(){GM_setValue("outFloatAutoClose",!outFloatAutoClose);window.location.reload()}
function toggle_outCommentAreaAutoClose(){GM_setValue("outCommentAreaAutoClose",!outCommentAreaAutoClose);window.location.reload()}
function toggle_autoFloatWindow(){
    if(autoFloatWindow){
        if(rightBox){//同时关闭右侧楼中楼功能
            GM_setValue("rightBox",false);
        }
    }else{
        if(!rightBox){//如果尚未开启，那么开启右侧楼中楼功能
            GM_setValue("rightBox",true);
        }
    }
    GM_setValue("autoFloatWindow",!autoFloatWindow);
    window.location.reload()
}
function toggle_buttonTransparent(){GM_setValue("buttonTransparent",!buttonTransparent);window.location.reload()}
function toggle_animationState(){GM_setValue("animationState",!animationState);window.location.reload()}
function toggle_transparentBackground(){GM_setValue("transparentBackground",!transparentBackground);window.location.reload()}

GM_registerMenuCommand(rightBox?"✅右侧楼中楼已开启":"❌右侧楼中楼已关闭",toggle_rightBox);
GM_registerMenuCommand(outFloatAutoClose?"✅鼠标离开楼中楼自动关闭":"❌鼠标离开楼中楼自动关闭",toggle_outFloatAutoClose);
GM_registerMenuCommand(outCommentAreaAutoClose?"✅鼠标离开主评论区 自动关闭楼中楼":"❌鼠标离开主评论区 自动关闭楼中楼",toggle_outCommentAreaAutoClose);
GM_registerMenuCommand(autoFloatWindow?"✅全自动楼中楼瀑布流":"❌全自动楼中楼瀑布流",toggle_autoFloatWindow);
GM_registerMenuCommand(buttonTransparent?"✅☸按钮全透明":"❌☸按钮全透明",toggle_buttonTransparent);
GM_registerMenuCommand(animationState?"✅过渡动画":"❌过渡动画",toggle_animationState)
GM_registerMenuCommand(transparentBackground?"✅暗色背景全透明":"❌暗色背景全透明",toggle_transparentBackground)

//黑暗模式检测
if(document.querySelector(".light-toggle img")){
    let Mode=document.querySelector(".light-toggle img").getAttribute("alt")
    if(Mode=="Dark"){
        GM_addStyle(`
        .replyBoxPage{
          background-color:#18222d
          }
         a.thank:hover {
           background-color:#18222d
         }
         .replyBoxPage::-webkit-scrollbar-thumb {
         background-color: #6b7788;
           border-radius: 4px;
         }

         .replyBoxPage::-webkit-scrollbar-thumb:hover {
           background-color: #545e6c;
         }

       `)
    }
}
//楼中楼瀑布流，在右侧全自动显示 可视界面最新一条楼中楼，启用此功能会同步开启 右侧楼中楼功能。

if(autoFloatWindow){
    //将全局阴影颜色变淡
    GM_addStyle(`
    .replyBoxPageGrandWrapper {
      background-color:rgba(0,0,0,0.02);
    }
    `)

    function getLastVisibleReplyBoxButton() {
        if(document.querySelector('.replyBoxButton')){
            //修复楼中楼逻辑问题，:not(.replyBoxPage .replyBoxButton)，排除悬浮窗里的replyBoxButton
            let buttons = Array.from(document.querySelectorAll('.replyBoxButton:not(.replyBoxPage .replyBoxButton)'));
            let visibleButtons = buttons.filter(button => {
                let buttonRect = button.getBoundingClientRect();
                return buttonRect.top >= 0 && buttonRect.bottom <= window.innerHeight;
            });
            //return visibleButtons[visibleButtons.length - 1];
            return visibleButtons.at(-1)
        }
    }
    function autoGenFloatWindow(){
        let lastVisibleButton = getLastVisibleReplyBoxButton();
        if(lastVisibleButton && lastVisibleButton!=lastReplyBoxButton){//按钮结果不为空，并且和上次监测的最新按钮不是同一个，然后再考虑下一步。
            //console.log(lastVisibleButton)
            lastReplyBoxButton=lastVisibleButton
            lastVisibleButton.onmouseover()
        }
        if(!lastVisibleButton){//当前页面不存在button时，如果有楼中楼页面，那么会移除;并且将lastReplyBoxButton置空，方便在按钮再次出现时 继续生成
            if(document.querySelector(".replyBoxPage")){
                document.querySelector(".replyBoxPageGrandWrapper").click()
                lastReplyBoxButton=null
            }
        }
    }

    window.addEventListener('scroll', autoGenFloatWindow)

}
//将按钮变透明，更加美观
if (buttonTransparent) {
    GM_addStyle(`
    .replyBoxButton {
      color:transparent;
    }
    `)
}

//继续解决懒加载导致的 按钮错位问题

let lazyElements = document.querySelectorAll('[loading]');
let promises = [];

lazyElements.forEach(element => {
  const promise = new Promise((resolve, reject) => {
    element.onload = () => {
      resolve(element);
    };
    element.onerror = () => {
      console.warn(`Failed to load ${element.src}`);
      resolve(element);
    };
  });
  promises.push(promise);
});

Promise.all(promises.map(p => p.catch(() => undefined))).then(() => {
  // 所有懒加载元素都加载完成后执行函数
    window.onload=function() {
        if(!document.querySelector(".replyBoxButton")){
            genButton()
        }
        //genButton()//在页面内容较多时，需要等到页面加载完全后，再去生成按钮
    }
});
//超时直接生成button，极特殊页面始终不能 通过懒加载监测后生成button。
function directGenButton() {//如果当前页面尚未有button，直接生成
    if(!document.querySelector(".replyBoxButton")){
        genButton()
    }
}
setTimeout(directGenButton,5000)

//过渡动画开关
if(!animationState){
    GM_addStyle(`
      .replyBoxPageWrapper {
        animation-name:none;
      }
      .replyBoxPageGrandWrapper.show {
        animation-name:none;
      }
    `)
}
//暗色背景全透明
if(transparentBackground){
    GM_addStyle(`
      .replyBoxPageGrandWrapper {
        background-color:transparent;
      }
    `)
}

