// ==UserScript==
// @name         图片采集下载工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  测试一下
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_download
// @author       yinyi
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/374077/%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/374077/%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
//全局变量
var ci = 0
var time = 0
var huan = 0
var time1 = 0
var dian = 0
var myVar;
var zifuchangdu;
var img_src = new Array();
var img_name = new Array();

//检测为分页采集模式跳转
 if(GM_getValue("moshi") == 2 && GM_getValue("caijixia") !== undefined && GM_getValue("caijitu") !== undefined && GM_getValue("zhuti") !== undefined){
img_src=GM_getValue("imgurl");
img_name=GM_getValue("imgname");
zifuchangdu=GM_getValue("zifucd");
console.log(GM_getValue("imgurl"));
console.log(GM_getValue("imgname"));
console.log(GM_getValue("caijixia"));
jiansuo();

            var tiaozhuan = document.evaluate(GM_getValue("caijixia"), document).iterateNext();
     if(tiaozhuan){
         console.log(tiaozhuan)
         if(tiaozhuan.href.substring(tiaozhuan.href.length-1) == "#"){
         tiaozhuan.href = tiaozhuan.href.substring(0,tiaozhuan.href.length-1)
         }
     if(tiaozhuan.href && tiaozhuan.href !== window.location.href){
         console.log("有href"+tiaozhuan.href +"||"+ window.location.href)
                setTimeout(function(){ GM_setValue("winurl",window.location.href);tiaozhuan.click(); }, 300);
            }else{
                console.log("无href")
                if(tiaozhuan.parentNode.href){
                console.log("上层有"+tiaozhuan.parentNode)
                    setTimeout(function(){ GM_setValue("winurl",window.location.href);tiaozhuan.parentNode.click(); }, 300);
                }else{
 console.log("结束")
 xiazai();
qingchu();
                }
            }
     }else{
         console.log("Xpath 的规则无法定位，尝试测算url 进行下一页跳转")
         var qwin = GM_getValue("winurl")
         console.log(qwin)
         console.log(qwin[0]+"||"+window.location.host)
         console.log(qwin[1]+"||"+window.location.pathname)

         if(qwin !== window.location.href){
             var zurl = "";

             zurl = zifu(qwin,window.location.href)

             console.log(zurl)
 $.ajax({
  url: zurl,
  type: 'GET',
  complete: function(response) {
   if(response.status == 200) {
setTimeout(function(){ GM_setValue("winurl",window.location.href);window.open(zurl,"_self"); }, 300);
   } else {
    console.log("测算uel无效，终止")
 xiazai()
qingchu();
   }
  }
 });
         }

     }
 }
function qingchu(){
 GM_deleteValue("moshi")
 GM_deleteValue("caijixia")
 GM_deleteValue("caijitu")
 GM_deleteValue("winurl")
 GM_deleteValue("zhuti")
 GM_deleteValue("imgurl")
 GM_deleteValue("imgname")
}

//测算url 的字符处理模块
function zifu(q,d){
var qi = "";
var hi = "";
var qn = 0;
for(var i = 0;i<d.length;i++){
    if(q.substring(0,i+1) == d.substring(0,i+1)){
        qn = i;
    qi = d.substring(0,i+1)
    }
    if(q.substring(q.length-i,q.length) == d.substring(d.length-i,d.length)){
    console.log(q.substring(q.length-i,q.length) +"||"+ d.substring(d.length-i,d.length))
    hi = d.substring(d.length-i,d.length)
    }
}
//console.log(qi+"||"+hi)
//console.log(d.substring(qn+1,d.lastIndexOf(hi)))
    var ye = d.substring(qn+1,d.lastIndexOf(hi))
    ye = Number(ye)+1
    var hurl = qi+ye+hi
    return hurl
}
//定位元素 Xpath 的规则模块
// function readXPath(element) {
//     if (element.id !== "") {return '//*[@id=\"' + element.id + '\"]';}
//     if (element == document.body) {return '/html/' + element.tagName.toLowerCase();}
//     var ix = 1,
//     siblings = element.parentNode.childNodes;

//     for (var i = 0, l = siblings.length; i < l; i++) {
//         var sibling = siblings[i];
//         if (sibling == element) {
//             return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
//         } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
//             ix++;
//         }
//     }
// };
//////////
function readXPath(element) {
    if (element.id!==""){
        return '//*[@id=\"'+element.id+'\"]';
    }

    if (element.getAttribute("class")!==null){
        return '//*[@class=\"'+element.getAttribute("class")+'\"]';
    }

    if (element==document.body){
        return '/html/'+element.tagName;
    }


    var ix= 0,
          siblings= element.parentNode.childNodes;

    for (var i= 0,l=siblings.length; i<l; i++) {
        var sibling= siblings[i];
        if (sibling==element){
            return arguments.callee(element.parentNode)+'/'+element.tagName+((ix+1)==1?'':'['+(ix+1)+']');
        }else if(sibling.nodeType==1 && sibling.tagName==element.tagName){
            ix++;
        }
    }
};



//检测设置快捷键
if(!GM_getValue("kuaijiejian")){
    alert("检测到第一次运行故做以下提示：/n 1:默认快捷键【Esc】,如需自定快捷键，可以在关闭本提示之后，长按3秒当前设定的快捷键进行更改.")
    GM_setValue("kuaijiejian",27)
    }

//快捷键验证模块
function yanzheng(event) {
var e = event || window.event || arguments.callee.caller.arguments[0];
        //快捷键替换
if(huan == 1){
huan = 0;
GM_setValue("kuaijiejian",e.keyCode);
alert("快捷键替换完成");
return;
}

if(e && e.keyCode==GM_getValue("kuaijiejian")){return 1;}else{return 0;}}


//快捷键按下
document.onkeydown=function(event){
var an = yanzheng(event)
if(an == 1 && ci == 0){ci = 1;time = new Date().getTime();}
}


//快捷键抬起
document.onkeyup=function(event){
if(ci == 1){
ci = 0;
time = new Date().getTime()-time;

if(time > 1200){
huan = 1;
alert("在关闭本提示之后，单击需要设定为快捷键的按键，请注意避免与其他软件或脚本快捷键冲突，不支持组合键")
return;
}else{
GM_setValue("moshi",1)
time1 = new Date().getTime()-time1

if (time1 < 450){
myStopFunction()
GM_setValue("moshi",2)
}else{
GM_setValue("moshi",1)
time1 = new Date().getTime()
}
myFunction()
}
}

}


function myFunction(){myVar=setTimeout(function(){zhixing()},500);}
function myStopFunction(){clearTimeout(myVar);}

//绑定鼠标点击执行模块
function zhixing(){
document.addEventListener('click', link, true);
console.log(GM_getValue("moshi"))
 GM_deleteValue("caijixia")
 GM_deleteValue("caijitu")
 GM_deleteValue("zhuti")
 GM_deleteValue("imgurl")
 GM_deleteValue("imgname")
}


//点击触发功能
function link(event) {
event.preventDefault();
event.stopPropagation();

//moshi2触发Xpath 定位规则采集
if(event.target.tagName !== "IMG" && GM_getValue("moshi") == 2){
var inpt = prompt(" 请输入【下一页】按钮的Xpath定位",readXPath(event.target));
if(inpt){
//var data = document.evaluate(inpt, document).iterateNext();
//console.log(data)
GM_setValue("caijixia",inpt)
console.log(GM_getValue("caijixia"));
}
}

//对图片特征规则采集
if(event.target.tagName == "IMG"){
var inus = event.target.src.substring(event.target.src.indexOf("\."), event.target.src.lastIndexOf("\/")+1);
zifuchangdu = event.target.src.substring(event.target.src.lastIndexOf("\/")+1,event.target.src.length).length;
console.log(zifuchangdu)
GM_setValue("zifucd",zifuchangdu)
//分割URL 获取最后 / 符号之前部分作为预设特征码,获取格式
var inpusers = prompt("请输入特征码",inus); // 弹出用户输入input框
    if(inpusers){
    GM_setValue("caijitu",inpusers)
    console.log(GM_getValue("caijitu"))
//主题名称采集
var text = event.target.alt.replace(/[^\u4e00-\u9fa5]/g, '')
if(text == "" && document.evaluate('//h1', document).iterateNext() !== null){
text = document.evaluate('//h1', document).iterateNext().innerHTML.replace(/[^\u4e00-\u9fa5]/g, '')
}
if(text == ""){text = "如需自定图片名称可以在此输入，否则请直接点击确定"}
//预测匹配图片数量
var img = document.getElementsByTagName("img")
var yuce = new Array();
for(var i = 0;i<img.length;i++){
if(img[i].src.indexOf(GM_getValue("caijitu")) !== -1 && img[i].src.substring(img[i].src.lastIndexOf("\/")+1,img[i].src.length).length == zifuchangdu){
if(yuce.indexOf(img[i].src) == -1){
//判断数组中是否存在这个链接
yuce[yuce.length] = img[i].src
}
}
}
var inp = prompt("检测图片 "+img.length+' 张 ，匹配图片 '+yuce.length+' 张。\n' + yuce.join('\n'),text);
GM_setValue("zhuti",inp)
jiansuo()
}
}


//核对规则采集
if(GM_getValue("imgurl") !== undefined && GM_getValue("imgname") !== undefined){
    if(GM_getValue("moshi") == 2){
        if(!GM_getValue("caijixia")) {
            alert("双击快捷键为多分页采集模式，当前还没采集【下一页】按钮的 Xpath 定位，请点击【下一页】按钮进行采集，\n\n建议多分页采集时，优先采集【下一页】按钮，再采集图片规则，避免出现本提示。")
        }else{
        document.removeEventListener('click', link, true);
            GM_setValue("winurl",window.location.href);
            var tiaozhuan = document.evaluate(GM_getValue("caijixia"), document).iterateNext();
            if(tiaozhuan.href && tiaozhuan.href !== window.location.href){
            setTimeout(function(){ tiaozhuan.click(); }, 300);
            }else{
                console.log("无href")
                if(tiaozhuan.parentNode.href){
                console.log("上层有"+tiaozhuan.parentNode)
                    tiaozhuan.parentNode.click();
                }else{
                console.log("结束")
qingchu();
                }
            }
        }
        }else{
    //删除鼠标点击事件
    document.removeEventListener('click', link, true);
    xiazai();
    }
}
}
//检测特征码匹配
function jiansuo(){
var img = document.getElementsByTagName("img")
var inp = GM_getValue("zhuti")

for(var i = 0;i<img.length;i++){
if(img[i].src.indexOf(GM_getValue("caijitu")) !== -1 && img[i].src.substring(img[i].src.lastIndexOf("\/")+1,img[i].src.length).length == zifuchangdu){
if(img_src.indexOf(img[i].src) == -1){
//判断数组中是否存在这个链接
img_src[img_src.length] = img[i].src
//匹配一个图片名称
var n = "("+img_src.length+")"
if(inp == ("" || "如需自定图片名称可以在此输入，否则请直接点击确定")){var name = img[i].src.substring(img[i].src.lastIndexOf("\/")+1,img[i].src.lastIndexOf("\."))}else{name = inp+n}
img_name[img_name.length] = name
}
}
}
GM_setValue("imgurl",img_src);
GM_setValue("imgname",img_name);
console.log(GM_getValue("imgurl"));
console.log(GM_getValue("imgname"));
}

//生成下载页面
function xiazai() {
var str = ""
    var i = 0;
    GM_getValue("imgurl").forEach(function(url) {
    str=str+'<tr><td><a href='+GM_getValue("imgurl")[i]+' download='+GM_getValue("imgname")[i]+'><input type="checkbox" name="checkbox" value='+i+' checked="true">'+GM_getValue("imgname")[i]+'</td></tr>'
    i++
    });
 var xuanqu = "function opcheckboxed(objName,type){var objNameList=document.getElementsByName(objName);if(null!=objNameList){for(var i=0;i<objNameList.length;i++){if(objNameList[i].checked==true){if(type!=='checkall'){objNameList[i].checked=false}}else{if(type!=='uncheckall'){objNameList[i].checked=true}}}}}"
 var ses = 'function getBase64(imgUrl,name) { var xhr = new XMLHttpRequest(); xhr.open("get", imgUrl, true); xhr.responseType = "blob"; xhr.onload = function () { if (this.status == 200) { var blob = this.response; console.log("blob", blob); let oFileReader = new FileReader(); oFileReader.onloadend = function (e) { let base64 = e.target.result; console.log("方式一》》》》》》》》》", base64);var alink = document.createElement("a"); alink.href = base64; alink.download = name; alink.click(); }; oFileReader.readAsDataURL(blob); }; }; xhr.send(); }'
 var down = "function down(mo){var qxuan = document.getElementsByTagName('input');var i = 0 ;if(mo == 'cop'){ var copy = '';for(i;i<qxuan.length;i++){ if (qxuan[i].checked){copy = copy + qxuan[i].parentNode.href + '\\n'};}; document.addEventListener('copy', save);document.execCommand('copy');document.removeEventListener('copy', save); };function save(e) {e.clipboardData.setData('text/plain', copy);e.preventDefault();} ;if(mo == 'dow'){ var myVar = setInterval(function(){if (qxuan[i].checked){console.log(qxuan[i].parentNode.href+'||'+ qxuan[i].parentNode.download);getBase64(qxuan[i].parentNode.href,qxuan[i].parentNode.download)}; i++ ; if(i == qxuan.length){clearTimeout(myVar);}  }, 600);}}"
 var jsng = xuanqu+ses+down
 var html='<html><head><meta charset="utf-8"><script>'+jsng+'</script><style>table, td, th {border: 1px solid black;vertical-align: middle;} .textCetent{text-align:center;}</style></head><body><h3 class="textCetent">'+GM_getValue("zhuti")+'</h3><table width="100%";height:100px;border-collapse: collapse;><tr border="0"><th colspan="6" bgcolor="Beige"><button onclick="opcheckboxed(\'checkbox\', \'checkall\')">全选</button>   <button onclick="opcheckboxed(\'checkbox\', \'uncheckall\')">取消全选</button>   <button onclick="opcheckboxed(\'checkbox\', \'reversecheck\')">反选</button>   <button onclick="down(\'cop\')">拷贝所选链接</button>   <button onclick="down(\'dow\')">下载所选图片</button></th></tr>'+str+'</table></body></html>'
 var newwindow = window.open('','_blank','width=600,height=900');
 newwindow.document.write(html);
}
})();
