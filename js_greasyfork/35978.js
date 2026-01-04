// ==UserScript==
// @name        AC-论坛悬浮回复框
// @description 常用论坛的悬浮回复框，点击固定，再次点击缩回
// @namespace   K
// @include     *
// @version     2.5
// @note        反馈地址 http://bbs.kafan.cn/thread-2076136-1-1.html
// @note        V2.5 依据建议，替换为https的默认图片
// @note        V2.4 修复回复框右键导致的设置框弹出,同时修改左右和上下位置调整
// @note        V2.3 修复鼠标移开的悬浮框显示问题
// @note        V2.2 根据图标和图标位置动态调整悬浮框的宽度
// @note        V2.1 新增，鼠标移动到图标上显示悬浮框
// @note        V2.0 修改为图标触发效果，支持自定义图标，左键(展开-关闭); 右键(设置界面)
// @icon        https://coding.net/u/zb227/p/zbImg/git/raw/master/img0/icon.jpg
// @run-at document-end
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/35978/AC-%E8%AE%BA%E5%9D%9B%E6%82%AC%E6%B5%AE%E5%9B%9E%E5%A4%8D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/35978/AC-%E8%AE%BA%E5%9D%9B%E6%82%AC%E6%B5%AE%E5%9B%9E%E5%A4%8D%E6%A1%86.meta.js
// ==/UserScript==
var imgAtX      = parseInt(GM_getValue("check_mAtX",  -10)); //图标距离左边或者右边的距离
var imgAtY      = parseInt(GM_getValue("check_mAtY",  -40)); //图标距离顶部或底部的距离
var imgWidth    = parseInt(GM_getValue("check_mWidth",  50)); //图标宽度
var imgHeight   = parseInt(GM_getValue("check_mHeight", 50)); //图标高度
var imgUrl      = GM_getValue("check_mUrl",    "https://a.ikafan.com/image/smiley/default/14.gif"); // 图标地址
var configForm; // 设置界面
/***可以触发悬浮框关闭的Tag名字***/
var frameNames = new Array(
    "div","DIV", "TD", "td", "h", "p", "form"
);
var percentage = parseInt(100*(document.body.clientWidth-2*Math.abs(imgAtX)-2*imgWidth)/document.body.clientWidth);
/***打开设置页面的函数***/
function showConfigFlashRpy () {
    configForm = document.createElement("div");
    configForm.className = "acConfigSetRpy";
    document.body.appendChild(configForm);
    configForm.style = "width: 520px; font-size: 14px; position: fixed; color: rgb(0, 0, 0); z-index: 99; box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5); border: 1px solid rgb(204, 204, 204); background: rgba(255, 255, 255, 0.9) none repeat scroll 0% 0%; border-top-right-radius: 2px; border-bottom-left-radius: 2px; padding: 10px; left: 0px; right: 0px; top: 0px; bottom: 0px; margin: auto; height: 290px; max-height: 90%; overflow: auto; text-align: center; -moz-user-select: none;";
    configForm.appendChild(createTextNode("透明图片请用PNG或者GIF格式, 保存之后刷新页面即可", 1));
    configForm.appendChild(createTextNode("图标的地址："));
    var check_mUrl = configForm.appendChild(createInputNode(imgUrl)).firstChild;
    configForm.appendChild(createTextNode("图标距两边的距离[左正右负]："));
    var check_mAtX = configForm.appendChild(createInputNode(imgAtX)).firstChild;
    configForm.appendChild(createTextNode("图标距上下的距离[上正下负]："));
    var check_mAtY = configForm.appendChild(createInputNode(imgAtY)).firstChild;
    configForm.appendChild(createTextNode("图标宽度："));
    var check_mWidth = configForm.appendChild(createInputNode(imgWidth)).firstChild;
    configForm.appendChild(createTextNode("图标高度："));
    var check_mHeight = configForm.appendChild(createInputNode(imgHeight)).firstChild;
    var check_mSave = configForm.appendChild(createButtonNode("保存"));
    var check_mCancel = configForm.appendChild(createButtonNode("取消"));
    check_mSave.onclick = function(){
        //检查属性是否符合规则
        if(check_mUrl.value.indexOf("http") != 0){
            alert("地址不规范");
        }else if(/^\d+$/.test(check_mAtX) || /^\d+$/.test(check_mAtY) || /^\d+$/.test(check_mWidth) || /^\d+$/.test(check_mHeight)){
            alert("请输入整数");
        }
        //使用保存数据的功能
        GM_setValue("check_mUrl",       check_mUrl.value);
        GM_setValue("check_mAtX",       check_mAtX.value);
        GM_setValue("check_mAtY",       check_mAtY.value);
        GM_setValue("check_mWidth",     check_mWidth.value);
        GM_setValue("check_mHeight",    check_mHeight.value);
        configForm.remove();
        location.reload();
    }
    check_mCancel.onclick = function(){
        configForm.remove();
    }
    //configForm.innerHTML = "<form action=\"#\" ><center><table><tbody><tr><td>图片地址:</td><td><input value=\"xxx\"></td></tr><tr><td>图片靠左边距离:</td><td><input value=\"10\"></td></tr><tr><td>图片宽度</td><td><input value=\"10\"></td></tr><tr><td>图片高度:</td><td><input value=\"10\"></td></tr> </tbody></table><input value=\"save\" type=\"submit\"><input value=\"cancel\" type=\"button\"></center>";
}
/***设置页面用：新增按钮方法***/
function createButtonNode(text){
    var inputDiv = document.createElement("div");
    inputDiv.style = "width: 100px; text-align: center; display: inline-block;margin-bottom:10px;margin-right:10px";
    var inputBox = document.createElement("input");
    inputBox.type = "button";
    inputBox.value = text;
    inputBox.style = "width: 100px; text-align: center; display: inline-block;";
    inputDiv.appendChild(inputBox);
    return inputDiv;
}
/***设置页面用：新增输入框方法***/
function createInputNode(text){
    var inputDiv = document.createElement("div");
    inputDiv.style = "width: 300px; text-align: center; display: inline-block;margin-bottom:20px";
    var inputBox = document.createElement("input");
    inputBox.value = text;
    inputBox.onkeyup = "this.value=this.value.replace(/\D/g,'')";
    inputBox.onafterpaste = "this.value=this.value.replace(/\D/g,'')";
    inputBox.style = "width: 300px; text-align: left; display: inline-block;";
    inputDiv.appendChild(inputBox);
    return inputDiv;
}
/***设置页面用：新增文本方法***/
function createTextNode(text, flag){
    var inputDiv = document.createElement("div");
    inputDiv.style = "width: 200px; text-align: center; display: inline-block; margin-bottom:20px";
    if(flag != null) inputDiv.style = "width: 500px; text-align: center; margin-bottom:20px";
    var inputBox = document.createElement("div");
    inputBox.style = "width: 200px; text-align: left; display: inline-block;";
    if(flag != null) inputBox.style = "width: 500px; text-align: center; margin-bottom:20px";
    inputBox.innerHTML = text;
    inputDiv.appendChild(inputBox);
    return inputDiv;
}
GM_registerMenuCommand("设置论坛回复悬浮窗属性", showConfigFlashRpy)
/***判断是否为可关闭的Tag类型***/
function isFrame(node){
    for(var index = 0; index < frameNames.length; index++){
        if(node.indexOf(frameNames[index]) == 0)
            return true;
    }
    return false;
}
/***右下角图标按钮生成函数***/
function addBtn(nodeName){
    var node = document.querySelector(nodeName);
    if(node == null) return;
    // 隐藏原始回复框
    node.style.visibility = "hidden";
    // 处理表单，表单提交则点击自身，隐藏回复框
    var formNode = document.querySelector(nodeName+" form"); // "#f_pst form"
    if(formNode != null)
        formNode.setAttribute("onsubmit", formNode.getAttribute("onsubmit")+",this.click()");
    // 在父节点中插入按钮节点，并设置按钮style
    var fatherNode = node.parentNode;
    var insNode = document.createElement("div");
    insNode.className = "frep_btn";
    var deltaTextY = (imgAtY>=0?"top:":"bottom:")+Math.abs(imgAtY) + "px !important;";
    var deltaTextX = (imgAtX>=0?"left:":"right:")+Math.abs(imgAtX) + "px !important;";
    console.log(deltaTextX);
    insNode.style = "width:"+imgWidth+"px !important;height:"+imgHeight+"px !important;background-image: url('"+imgUrl+"'); background-repeat: no-repeat; background-size: 100% 100%;position: fixed;z-index: 99 !important;border: 1px solid #2B5782 !important;overflow: hidden;transition-duration: 0.2s !important;transition-delay: 0.3s !important;"+deltaTextY+deltaTextX;
    insNode.style.after = "content:\"\"; display:block; padding-bottom:20%;";
    insNode.setAttribute("expand", "0");
    fatherNode.insertBefore(insNode, fatherNode.firstChild);
    node.setAttribute("expand", "0");
    
    node.onclick = function expandView(sender){
        /***左键为展开和关闭效果; 右键为设置页面-单一页面，禁止多个***/
        console.log(sender);
        if(sender.button == 0){
        //左键展开===关闭
            //console.log(sender);
            //console.log(sender.target);
            //console.log(sender.target.localName);
            if(node.getAttribute("expand") == "0"){//未展开--->展开
                var posTextX = (imgAtX>=0?"left:":"right:")+(imgWidth+Math.abs(imgAtX)+1) +"px !important;";
                node.style = "border:1px solid #2B5782 !important;position:fixed;bottom:-11px !important;z-index:99 !important;bottom:-5px !important;height:auto !important;width:"+percentage+"% !important;overflow:hidden;transition-delay:0.1s !important; background:#fcfcfc;"+posTextX;
                console.log("展开");
                node.setAttribute("expand", "1");
                insNode.setAttribute("expand", "1");
                node.style.visibility = "visible";
            } else{
                if(isFrame(sender.target.localName) == false){
                    console.log("点击了"+sender.target.localName + "，不是边框类型");
                    return;
                }
                console.log("收回");
                node.setAttribute("expand", "0");
                insNode.setAttribute("expand", "0");
                node.style.visibility = "hidden";
            }
        }else{
        //右键设置模式
            if(sender.target.className == "frep_btn"){
                if(document.querySelector(".acConfigSetRpy")==null){
                    showConfigFlashRpy();
                }else{
                    configForm.remove();
                }
            }
        }
    };
    insNode.onmouseover = node.onmouseover = function(){
        if(node.getAttribute("expand") == "0") {
            var posTextX = (imgAtX>=0?"left:":"right:")+(imgWidth+Math.abs(imgAtX)+1) +"px !important;";
            node.style = "border:1px solid #2B5782 !important;position:fixed;bottom:-11px !important;z-index:99 !important;bottom:-5px !important;height:auto !important;width:"+percentage+"% !important;overflow:hidden;transition-delay:0.1s !important; background:#fcfcfc;" + posTextX;
            node.style.visibility = "visible";
        }
    };
    insNode.onmouseout = node.onmouseout = function(){
        if(node.getAttribute("expand") == "0") 
            node.style.visibility = "hidden";
    };
    insNode.onmousedown = node.onclick;
    /***在右下角按钮上禁止右键弹出菜单***/
    /***右键为设置页面-单一；左键为展开和关闭效果***/
    insNode.oncontextmenu = function(){return false;};
}
addBtn("#anchor");
addBtn("#quickpost");
addBtn("#f_pst");
addBtn("#f_post");
addBtn("#fast_post_c");
addBtn("form[action=\"post.php?\"][method=\"post\"] > .t5");