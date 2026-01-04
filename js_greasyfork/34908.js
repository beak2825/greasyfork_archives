// ==UserScript==
// @name                cxxxxx 批量导出177图片,支持命令行工具
// @name:zh-CN            cxxxxx 批量导出177图片,支持命令行工具
// @namespace             https://greasyfork.org/
// @version               1.3
// @create                2017-11-10
// @description           批量复制下载命令到剪贴板
// @description:zh-CN     批量复制下载命令到剪贴板
// @author                cxx
// @match                 http://www.177pic.info/html/*.html
// @match                 http://www.177piczz.info/html/*.html
// @run-at                document-end
//上面这句表示 在html文件加载完（即html文档下载并加载完毕，不包括多媒体内容，不包括脚本）运行脚本，重命名不能补零，要自己学习下 js 补零输出
// @grant                 GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/34908/cxxxxx%20%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA177%E5%9B%BE%E7%89%87%2C%E6%94%AF%E6%8C%81%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/34908/cxxxxx%20%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA177%E5%9B%BE%E7%89%87%2C%E6%94%AF%E6%8C%81%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++设置必要的全局变量+++++
//
var huiche = "\r\n";
var zhuomian = "C:\\Users\\Administrator\\Desktop\\";
var zhuomian1 = "C:\\Users\\Administrator\\Desktop\\1aaa";
var zhuomian1a = "C:\\Users\\Administrator\\Desktop\\1aaa\\";
var zhuomian2 = "C:\\Users\\Administrator\\Desktop\\2bbb";
var zhuomian2a = "C:\\Users\\Administrator\\Desktop\\2bbb\\";
var yinhao = "\"";
var pichuli = zhuomian2 +"\\name.bat";
var pichuli2 = zhuomian2 +"\\name2.bat";
下载方式 = 0;
//这种写法是全局变量,如果在function想用全局变量要这样写.
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//----------------------------------------------------------------------------------在网页开头插入一段html代码,这里是插入按钮,并且按钮有事件效果--------
//
//----------------------------------------------------------------------------------用ARIA2C下载
var divObj=document.createElement("div");
//divObj.setAttribute('id','topAlert');
divObj.innerHTML='<html><body><button id="clab" style="z-index: 9999; position: fixed ! important; right: 1200px; top: 3px;" type="button" onclick="myFunction()">导出为aria2c命令</button></body></html>';
var first=document.body.firstChild;//得到页面的第一个元素
document.body.insertBefore(divObj,first);//在得到的第一个元素之前插入
var btn2 = $("#clab");
$(function(){
    // test 的点击事件
    $("#clab").click(function(){
        下载方式 = 1;
        xiazaigongju1= "aria2c -c -s5 -x5 -j5 -o " +"\"";
        xiazaigongju11= ".jpg\" ";
        xiazaigongju = xiazaigongju1;
        //alert("点击了aria2c  "+ 下载方式);
    });
    // 调用 test 的点击事件的两种方法
    // $("#clab").trigger("click");
    //　$("#clab").click();
    //上面两句是js帮忙自动点击按钮,这里我不需要.
});
//----------------------------------------------------------------------------------用AXEL下载
var divObj2=document.createElement("div");
divObj2.innerHTML='<html><body><button id="clab2" style="z-index: 9999; position: fixed ! important; right: 1098px; top: 3px;" type="button" onclick="myFunction()">导出为axel命令</button></body></html>';
document.body.insertBefore(divObj2,divObj);//在得到的第一个元素之前插入
$(function(){
    $("#clab2").click(function(){
        下载方式 = 2;
        xiazaigongju2= ("axel -n 5 -a -o " );
        xiazaigongju = xiazaigongju2;
        xiazaigongju11= ".jpg\" ";
        //alert("点击了axel  "+ 下载方式);
    });
});
//----------------------------------------------------------------------------------用CURL下载
var divObj3=document.createElement("div");
divObj3.innerHTML='<html><body><button id="clab3" style="z-index: 9999; position: fixed ! important; right: 998px; top: 3px;" type="button" onclick="myFunction()">导出为curl命令</button></body></html>';
document.body.insertBefore(divObj3,divObj2);//在得到的第一个元素之前插入
$(function(){
    $("#clab3").click(function(){
        下载方式 = 3;
        xiazaigongju3= ("curl -C-  -# -o " );
        xiazaigongju = xiazaigongju3;
        xiazaigongju11= ".jpg ";
        xiazaigongju33= ".jpg\" ";

        //alert("点击了curl  "+ 下载方式);
    });
});
//----------------------------------------------------------------------------------用WGET下载
var divObj4=document.createElement("div");
divObj4.innerHTML='<html><body><button id="clab4" style="z-index: 9999; position: fixed ! important; right: 869px; top: 3px;" type="button" onclick="myFunction()">导出为wget命令bat</button></body></html>';
document.body.insertBefore(divObj4,divObj3);//在得到的第一个元素之前插入
$(function(){
    $("#clab4").click(function(){
        下载方式 = 4;
        xiazaigongju4= ("wget -c -O \"" );
        xiazaigongju11= ".jpg\" ";
        xiazaigongju = xiazaigongju4;
        //alert("点击了wget  "+ 下载方式);
    });
});
//----------------------------------------------------------------------------------用IDM下载
var divObj5=document.createElement("div");
divObj5.innerHTML='<html><body><button id="clab5" style="z-index: 9999; position: fixed ! important; right: 768px; top: 3px;" type="button" onclick="myFunction()">导出为idm命令</button></body></html>';
document.body.insertBefore(divObj5,divObj4);//在得到的第一个元素之前插入
$(function(){
    $("#clab5").click(function(){
        下载方式 = 5;
        xiazaigongju5= ("idman /n /d " );
        xiazaigongju = xiazaigongju5;
        xiazaigongju11= ".jpg ";
        //alert("点击了curl  "+ 下载方式);
    });
});
//----------------------------------------------------------------------------------
//
//????????????????????????????????????????分析网页代码   找出网址???????
//
$("#clab,#clab2,#clab3,#clab4,#clab5").click( function(){     //*******生成  多按钮触发同一个事件*******
    var title = $("h1").text();
    //新建变量title，内容是"h1变量内容"，由此来获取漫画名。这里的h1是网页中的是类似这行<div class="tit"><h1 class="entry-title">[立场]假如再来一次[183P]</h1>，得到的值是含有双引号的    " [立场]假如再来一次[183P] "
    var a = $("div.wp-pagenavi a");
    //新建一个变量a，定义内容为所有div标签中class组为wp-pagenavi且标签超链接为<a>的元素，作用是获取漫画里的其他分页链接
    /*例如：<div class="wp-pagenavi"><p><span class="pages">页面:</span> <span class="single-navi">1</span> <a href="http://www.177piczz.info/html/2017/11/1556517.html/2"><span class="single-navi">2</span></a> <a href="http://www.177piczz.info/html/2017/11/1556517.html/3"><span class="single-navi">3</span></a> <a href="http://www.177piczz.info/html/2017/11/1556517.html/4"><span class="single-navi">4</span></a> <a href="http://www.177piczz.info/html/2017/11/1556517.html/2">下一页</a></p></div> */
    var href = [window.location.href];
    //新建变量href，获得当前页面的href地址 (URL),这里的效果是获得第一页的地址：http://www.177piczz.info/html/2017/11/1556517.html
    //alert(href);
    for (var k = 0; k < a.length - 1; k++) {
        /*这个是for形式的循环
var k = 0意思是设置变量k为0，从0开始循环。
k < a.length – 1意思是循环条件、次数，这里是循环a变量长度减1次。
K++意思是递加，就是k+1的意思吧，这样才不会出现死循环
*/
        href[k + 1] = (a.eq(k).attr("href"));
        /*这句挺复杂的，慢慢理解，eq(k)是遍历相关的，通过循环，得到所有页面的地址，这里的效果是获得全部的4个页面地址。  http://www.177piczz.info/html/2017/11/1556517.html                         http://www.177piczz.info/html/2017/11/1556517.html/2    http://www.177piczz.info/html/2017/11/1556517.html/3        http://www.177piczz.info/html/2017/11/1556517.html/4 */
    }
    //将所有页链接存为数组href，这时候的数组href.length是19了。
    //alert(href);
    $.ajaxSetup({
        async: false
    });
    //关闭异步
    //不明白，ajaxSetup是 为将来的 AJAX 请求设置默认值 的意思，async: false 就是关闭异步。
    var doc = [];
    //新建变量doc，内容应该是数组的意思

    for (var l = 0; l < href.length; l++) {
        //循环最多19次
        $.get(href[l],
              function(data) {
            doc[l] = new DOMParser().parseFromString(data, "text/html");
            //意思应该是利用刚才得到的19个href地址来新建19个空数组，以后要用到的，用来存各个页面的具体数据，这句不是js脚本的，是XML 文档对象。
        });
    }
    //将所有页源码存为数组doc
    //????????????????????????????????????????
    //
    //************************************************************************************开始输入相关命令*********
    //
    //开始写入  分别生成几个下载工具对应的命令行******************************************
    //
    var result = "cd /"+ huiche;   //在任何cmd中都能运行,效果是回到盘符,等于用了无数个cd..这个命令.
    result = result + "cd C:\\"+ huiche;   //去到c盘,但是有的cmd不能用
    result = result + "C:"+ huiche;      //和上面一样的情况,算是互补吧
    result = result + "md " + yinhao + zhuomian1 + yinhao + huiche;//在桌面新建文件夹,名字是1aaa,效果是md "C:\Users\Administrator\Desktop\1aaa"
    result = result + "md " + yinhao + zhuomian2 + yinhao + huiche ;
    result = result + "ping -n 1 127.0.0.1>nul" + huiche;//延时1秒,防止新建的文件夹没完成导致cd进不了
    result = result + "cd " + yinhao + zhuomian1 +yinhao + huiche;//进入1aaa文件夹,因为很多命令行下载是下到当前目录的。
    //
    //以下是导出成  IDM  时的前置命令************************************
    //
    if(下载方式 == 5){
        result = result + "cd " + yinhao + zhuomian +yinhao + huiche;  //idm模式要手动删除2bbb文件夹的,这样否则不能删除
        result = result + "idman /n /d http://"+huiche;//如果导出的是idm,就提前打开idm,避免冷启动太慢
        result = result + "ping -n 5 127.0.0.1>nul" + huiche;//延时5秒
    }//将生成、转到下载目录的命令存储在字符串result里
    //*******************************************************************
    for (var i = 0,n = 0; i < doc.length; i++, n = n + img.length) {   //设置变量i和n，i最多运行19次，img.length是各个页面的漫画图片数量，
        img = doc[i].querySelectorAll("img");        //querySelectorAll是选择器，返回的是数集，应该是先在第一个i页面查找第一个n组的图片，保存到第一个前面设置的doc数组里面
        for (var j = 0; j < img.length; j++) {       //上面是循环的意思，直到没有符合的时候停止
            if(下载方式 == 1){      //aria2c模式
                result = result + xiazaigongju + [(n+1) + j]+ xiazaigongju11 +  img[j].src +  huiche;
            }
            if(下载方式 == 2){      //axel模式
                result = result + xiazaigongju + yinhao + zhuomian1a + [(n+1) + j]+ xiazaigongju11 + yinhao + img[j].src + yinhao + huiche;
            }
            if(下载方式 == 3){      //curl模式
                result = result + xiazaigongju + yinhao + zhuomian1a + [(n+1) + j]+ xiazaigongju33 + yinhao + img[j].src + yinhao + huiche;
            }
            if(下载方式 == 4){      //wget模式
                result = result + xiazaigongju + zhuomian1a + [(n+1) + j] + xiazaigongju11 + yinhao +  img[j].src + yinhao +  huiche;
            }
            if(下载方式 == 5){      //以下是导出成  IDM  时的命令格式
                result = result + xiazaigongju + yinhao +img[j].src + yinhao + " /P " + yinhao + zhuomian1+ yinhao + " /f "+ [(n+1) + j] + xiazaigongju11 + huiche;
                result = result + "ping -n 2 127.0.0.1>nul" + huiche;
            }
        }
    }
    ///////////////////////////////////////////////////
    ////-----------------------------------------------------    以下是  aria2c curl  wget 下载时修改文件名bat命令     -------------------------------------------------------------

    if(下载方式 == 1){
        ///////////////////只有几页时/////////////////
        if(0<n&&n<10){
            for(var dange=1; dange<=9; dange++)
            {                result =result + "ren " +dange+ ".jpg " +"00"+(dange)+ ".jpg " + huiche;    }} //alert("才"+n+"页哦,好少");
        ///////////////////100页以内时/////////////////
        if(10<=n&&n<99){
            var yeshu = n;
            for(var dange2=1; dange2<=9; dange2++)
            {                result =result + "ren " +dange2+ ".jpg " +"00"+(dange2)+ ".jpg " + huiche;            }
            for(var liangge2=10; liangge2<=yeshu; liangge2++)
            {                result =result + "ren " +liangge2+ ".jpg " +"0"+liangge2+ ".jpg " + huiche;           } } //alert("一共"+n+"页,不错不错");
        ///////////////////大于100页时/////////////////
        if(n>99){
            for(var dange3=1; dange3<=9; dange3++)
            {                result =result + "ren " +dange3+ ".jpg " +"00"+(dange3)+ ".jpg " + huiche;            }
            for(var liangge3=10; liangge3<=99; liangge3++)
            {                result =result + "ren " +liangge3+ ".jpg " +"0"+liangge3+ ".jpg " + huiche;           } }          //alert("一共"+n+"行,哇,好多啊");
        ///////////////////没有图片时///////////////////
        if(n<1){
            alert("可能出错了,没有找到图片,检测脚本或者网站问题");        }//将下载并改名的命令依次存储在字符串result里
    }
    //////
    ////-----------------------------------------------------    以下是  axel  下载时修改文件名bat命令     -------------------------------------------------------------

    if(下载方式 == 2||下载方式 == 3||下载方式 == 4){

        result = result + "cd " + yinhao + zhuomian + yinhao + huiche;
        //
        ///////////////////只有几页时/////////////////
        if(0<n&&n<10){
            for(var dangea=1; dangea<=9; dangea++)
            {                result =result + "ren " + yinhao + zhuomian1a + dangea + ".jpg\" " +"00"+(dangea)+ ".jpg" + huiche;}}
        //alert(zhuomian1a + "才"+n+"页哦,好少");

        ///////////////////100页以内时////////////////
        if(10<=n&&n<99){
            var yeshua = n;
            for(var dange2a=1; dange2a<=9; dange2a++)
            {                result =result + "ren " + yinhao + zhuomian1a + dange2a + ".jpg\" " +"00"+(dange2a)+ ".jpg" + huiche;            }
            for(var liangge2a=10; liangge2a<=yeshua; liangge2a++)
            {                result =result + "ren " + yinhao + zhuomian1a + liangge2a + ".jpg\" " +"0"+(liangge2a)+ ".jpg" + huiche;
            }} //alert("一共"+n+"页,不错不错");
        ///////////////////大于100页时/////////////////
        if(n>99){
            for(var dange3a=1; dange3a<=9; dange3a++)
            {                result =result + "ren " + yinhao + zhuomian1a + dange3a + ".jpg\" " +"00"+(dange3a)+ ".jpg" + huiche;            }
            for(var liangge3a=10; liangge3a<=99; liangge3a++)
            {                result =result + "ren " + yinhao + zhuomian1a + liangge3a + ".jpg\" " +"0"+(liangge3a)+ ".jpg" + huiche;
            } }//alert("一共"+n+"行,哇,好多啊");
        ///////////////////没有图片时///////////////////
        if(n<1){
            alert("可能出错了,没有找到图片,检测脚本或者网站问题");        }
    }
    //
    ////-----------------------------------------------------    以下是  IDM  下载时修改文件名bat命令     -------------------------------------------------------------

    if(下载方式 == 5){            //当用idm导出后,重命名要自己手动点击bat文件,因为dos命令没有判断idm是否下载完成的功能

        result = result + "cd " + yinhao + zhuomian + yinhao + huiche;
        //
        ///////////////////只有几页时/////////////////
        if(0<n&&n<10){
            for(var dangee=1; dangee<=9; dangee++)
            {                result =result + "echo ren " + yinhao + zhuomian1a + dangee + ".jpg\" " +"00"+(dangee)+ ".jpg>>"+ pichuli + huiche;}}
        //alert(zhuomian1a + "才"+n+"页哦,好少");

        ///////////////////100页以内时////////////////
        if(10<=n&&n<99){
            var yeshue = n;
            for(var dange2e=1; dange2e<=9; dange2e++)
            {                result =result + "echo ren " + yinhao + zhuomian1a + dange2e + ".jpg\" " +"00"+(dange2e)+ ".jpg>>"+ pichuli + huiche;            }
            for(var liangge2e=10; liangge2e<=yeshue; liangge2e++)
            {                result =result + "echo ren " + yinhao + zhuomian1a + liangge2e + ".jpg\" " +"0"+(liangge2e)+ ".jpg>>"+ pichuli + huiche;
            }} //alert("一共"+n+"页,不错不错");
        ///////////////////大于100页时/////////////////
        if(n>99){
            for(var dange3e=1; dange3e<=9; dange3e++)
            {                result =result + "echo ren " + yinhao + zhuomian1a + dange3e + ".jpg\" " +"00"+(dange3e)+ ".jpg>>"+ pichuli + huiche;            }
            for(var liangge3e=10; liangge3e<=99; liangge3e++)
            {                result =result + "echo ren " + yinhao + zhuomian1a + liangge3e + ".jpg\" " +"0"+(liangge3e)+ ".jpg>>"+ pichuli + huiche;
            } }//alert("一共"+n+"行,哇,好多啊");
        ///////////////////没有图片时///////////////////
        if(n<1){
            alert("可能出错了,没有找到图片,检测脚本或者网站问题");        }
    }
    //将下载并改名的命令依次存储在字符串result里

    ///-------------------------------------------------------     下载命令 导出完成后的dos命令         -----------------------------------------------

    //result = result + "cd C:\\" + huiche;                //回到c盘,避免cmd出错,效果是C:
    //result = result + "cd " + yinhao + zhuomian + "2bbb" + yinhao + huiche;      //进入文件夹2,效果是cd "C:\Users\Administrator\Desktop\2"
    //result = result + "echo cd " + yinhao + zhuomian + yinhao + ">>name.bat"+ huiche;     //效果是echo cd "C:\Users\Administrator\Desktop">>name.bat
    result = result + "echo ren "+ yinhao + zhuomian1+ yinhao + " " + yinhao + title + yinhao + ">>" + pichuli + huiche;    //把echo ren C:\Users\Administrator\Desktop\1aaa "标题名字"这句话写进name.bat文件里
    if(下载方式 == 5){
        result = result + "echo del %0"+ ">>" + pichuli + huiche;    //当用idm下载时添加这句,删除bat自身命令
    }
    result = result + "echo exit" + ">>" + pichuli + huiche;    //把echo exit这句话写进name.bat文件里
    result = result + "@echo off"+ huiche;    //关闭回显,效果是@echo off
    result = result + "(for /f "+('"delims=/,*,<,?,>,| tokens=1*" ') + ("%i in")+ " \(\'type \"" + pichuli + "\"\'\) do (" + huiche;
    //------------------  当用  IDM  下载时写入这些  -----------------------
    if(下载方式 == 5){
        result = result + "echo,%i%j))>" + yinhao + zhuomian + "\\name2.bat" + yinhao + huiche;//把name2.bat放到桌面
        result = result + "cd " + yinhao + zhuomian + yinhao + huiche;
        result = result + "ping -n 3 127.0.0.1>nul" + huiche;
    }
    //------------------  当用  aria2c curl axel wget  下载时写入这些  -----------------------
    if(下载方式 != 5){
        result = result + "echo,%i%j))>" + yinhao + pichuli2 + yinhao + huiche;
        result = result + "cd .." + huiche;
        result = result + "ping -n 1 127.0.0.1>nul" + huiche;
        result = result + "start " + pichuli2 + huiche;
        result = result + "ping -n 3 127.0.0.1>nul" + huiche;
    }
    //运行name2.bat来修复名字.效果是start name2.bat
    result = result + "cd c:\\" + huiche;
    result = result + "rd /q /s " + yinhao + zhuomian2 + yinhao + huiche;
    result = result + "exit" + huiche;
    result = result + "@echo off"+ huiche;
    result = result + "pause" + huiche;
    result = result + "exit" + huiche;
    //将关闭cmd窗口的命令存储在字符串result里
    GM_setClipboard(result);
    //复制结果到剪贴板
    alert("一共"+n+"行"+"下载命令已经在剪贴板中了");
});
/*              上面的原理是,清除掉所有的6个特殊符号,冒号和反斜杠是目录相关命令要用的就不加了,而双引号不会修改就不加了,主要是除掉问号就行了.
                    CMD运行这些只需要输入%i%j这种就能运行了,而保存为bat后运行的话就需要用%%i%%j这种才能运行
                    在cmd的代码是(for /f "delims=/,*,<,?,>,| tokens=1*" %i in ('type "name.bat"') do (
                       echo,%i%j))>"name2.bat"
    */
/*把标题漫画名字存到本地
思路是由于漫画有特殊符号,保存为UTF-8格式时是会转成问号?的,但是windows文件名中不能有下列9个符号：“?”、“、”、“╲”、“/”、“*”、““”、“”“、“<”、“>”、“|”
只好用for命令来把它去掉.
先把for命令相关内容保存到本地,操作完成后再删除掉,从而达到改漫画目录名的作用,bat中的代码如下:
C:
md "C:\Users\Administrator\Desktop\2"
cd "C:\Users\Administrator\Desktop\2"
echo cd "C:\Users\Administrator\Desktop">>name.bat
echo ren 1 "[たかやKi] むすんで ♥ ひらいて 全4话 [109P]">>name.bat
echo exit>>name.bat
@echo off
(for /f "delims=/,*,<,?,>,| tokens=1*" %i in ('type "name.bat"') do (
echo,%i%j))>"name2.bat"
start name2.bat
ping -n 3 127.0.0.1>nul
cd "C:\Users\Administrator\Desktop"
rd /q /s 2
exit
@echo off
pause
exit
*/





