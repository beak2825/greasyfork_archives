// ==UserScript==
// @name         sztu自动评教简易版
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  深圳技术大学自动评教--2021-2022-二
// @author       PETSJ
// @match        https://jwxt.sztu.edu.cn/jsxsd/xspj/xspj_list.do*
// @match        http://jwglxt.qau.edu.cn/jsxsd1/xspj/xspj_edit.do
// @match        https://jwxt.sztu.edu.cn *
// @match       https://jwxt.sztu.edu.cn/jsxsd/xspj/xspj_edit.do*
// @match       https://jwxt.sztu.edu.cn/jsxsd/framework/xsMain.htmlx# *
// @include       https://jwxt.sztu.edu.cn/jsxsd/xspj/xspj_edit.do*
// @include        https://jwxt.sztu.edu.cn *
// @include       https://jwxt.sztu.edu.cn/jsxsd/xspj/xspj_find.do *
// @match       //https://jwxt.sztu.edu.cn/jsxsd/xspj/xspjzd.do*
// @match       https://jwxt.sztu.edu.cn/jsxsd/xspj/xspj_find.do
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446869/sztu%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E7%AE%80%E6%98%93%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/446869/sztu%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E7%AE%80%E6%98%93%E7%89%88.meta.js
// ==/UserScript==


var url = location.pathname,
    mainPage = "https://jwxt.sztu.edu.cn/jsxsd/framework/xsMain.htmlx#",
    main2Page = "https://jwxt.sztu.edu.cn/jsxsd/xspj/xspj_find.do",
    listPage = "https://jwxt.sztu.edu.cn/jsxsd/xspj/xspj_list.do",
    editPage = "http://jwglxt.qau.edu.cn/jsxsd/xspj/xspj_edit.do";
//console.info(url)
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function refresh(){
    window.location.reload();
}
function closePage(){
    if(navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1){
        window.location.href = "about:blank";
        window.close();
    }else{
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
}



if(mainPage.indexOf(url)!=-1 || main2Page.indexOf(url)!=-1){ //---第一个页面
    var findList=[]
    let a=document.getElementsByClassName("layui-table")
    var setEnter = setInterval(enter(),2000)
    function enter(){
        findList = a[0].getElementsByTagName("a")
        if(findList.length!=3)return
        clearInterval(setEnter)

        for(let i=0;i<findList.length-1;i++){ //--点赞评教尚未开发
            window.open(findList[i].getAttribute("href"))
        }
    }
}
else console.info("---not mian page")





sleep(2000).then(() => { //----第二个页面

    if(listPage.indexOf(url)!=-1){
        var alist=[]

        alist = document.getElementsByTagName("a")
        var urlList=[];

        //let a=document.getElementsByName("issavestr")
        //let b=a[0].value
        var td = $('td')
        var isDone = td.eq(td.length-2).text()
        if(isDone.indexOf('是')!=-1){
            alert("评教已经完成！")
        }
        else{
            var isOk = td.eq(td.length-3).text()
            if(isOk.indexOf('是')!=-1){
                var sub=document.getElementById("btnsubmit")
                sub.click()
                //alert("评教完成！")
            }
            else{
                //setTimeout(refresh(),30000)
            }
        }



        function newWin(url, id) {
            var a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('target', '_blank');
            a.setAttribute('id', id);
            // 防止反复添加
            if(!document.getElementById(id)) document.body.appendChild(a);
            a.click();
        }

        for(let i=0;i<alist.length;i++){
            urlList.push(alist[i].getAttribute("href"))
        }
        if(isDone.indexOf('是')==-1){
            for(let i=0;i<urlList.length;i++){
                newWin(urlList[i],i); //----打开评教最终页面--//--直接window.open(url)也行
            }
        }
    }
})







sleep(2000).then(() => { //----评教页面
    if(editPage.indexOf(url)!=-1){
        //var now = document.getElementsByTagName("a");
        //var url2 = location.pathname;

        var isBc = document.getElementById("bc")
        if(!isBc){ //---若已经保存提交则关闭
            //window.close()
            alert("已经评教了噢")
        }else{
            function check(){
                var allTable = document.getElementById("table1").getElementsByTagName("tr");
                var allTableLen = allTable.length;
                console.info(allTableLen)
                for(let k = 2; k < allTableLen; k+=2){
                    if(k != allTableLen - 4){
                        console.info(allTable[k])
                        allTable[k].getElementsByTagName("td")[1].getElementsByTagName("label")[0].getElementsByTagName("input")[0].setAttribute("checked", "checked");
                        //allTable[k].getElementsByTagName("td")[1].getELementsByTagName("label")[1].getElementsByTagName("input")[0].setAttribute("checked", "checked");
                    }
                    else{
                        allTable[k].getElementsByTagName("td")[1].getElementsByTagName("label")[1].getElementsByTagName("input")[0].setAttribute("checked", "checked");
                    }
                }
                save()
            }
            function check2(){

            }

            check(); //---延迟一会checked
            function save(){
                var a = document.getElementById("bc")
                if(a){
                    a.click();
                    setTimeout(function(){closePage()},500)
                }

                else {
                    console.info("---save done")

                }
            }
        }
    }else console.info("---not edit page")

})