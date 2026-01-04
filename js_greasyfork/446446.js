// ==UserScript==
// @name         【快爆统计】统计显名脚本
// @namespace    wjddd
// @version      0.123456789
// @description  打开网址
// @author       wangjia
// @match        http://admin.newsapp.5054399.com/tongji/tongji.validating.count.php?ac=l
// @match        http://admin.newsapp.5054399.com/
// @match        http://admin.bbs3839.5054399.com/comment/*
// @match        http://admin.bbs3839.5054399.com/bbs/*
// @match        http://review.4399tech.com/admin/home/index-type-2
// @match        http://gm.4399tech.com/
// @icon         https://www.google.com/s2/favicons?domain=5054399.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446446/%E3%80%90%E5%BF%AB%E7%88%86%E7%BB%9F%E8%AE%A1%E3%80%91%E7%BB%9F%E8%AE%A1%E6%98%BE%E5%90%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446446/%E3%80%90%E5%BF%AB%E7%88%86%E7%BB%9F%E8%AE%A1%E3%80%91%E7%BB%9F%E8%AE%A1%E6%98%BE%E5%90%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



var mingdan ={huangjiasi:"黄嘉丝",
              limenglan:"李梦兰",
              liuliuting:"刘柳婷",
              wangjia:"王佳",
              wangyuyang:"王宇阳",
              chendong:"陈东",
              chenmeihua:"陈美华",
              huangyuanfang:"黄苑芳",
              huangyuanni:"黄苑妮",
              lichang:"李昶",
              litingfen:"李婷芬",
              pengjianwu:"彭健武",
              shililing:"石利玲",
              zhongyongsheng:"钟永盛",
              zhumeiling:"朱美玲",
              songwei:"宋威"
             };


if(document.location.href == "http://admin.newsapp.5054399.com/tongji/tongji.validating.count.php?ac=l"
  ){
    var hangshu=document.getElementsByTagName("tbody")[1].getElementsByTagName("tr").length+1;

    for(var i=2;i<hangshu;i++){
        var x = document.querySelector("body > div.row > div:nth-child(1) > table.table.table-striped.table-bordered.table-hover > tbody > tr:nth-child("+i+") > td:nth-child(4)");
        for( let key in mingdan ){
            if(x.innerHTML == key){
                x.innerHTML += "<span style='color:#E003F8'>"+mingdan[key]+"<span>";
                //添加多选框
                let zhinc=document.querySelector("body > div.row > div:nth-child(1) > table.table.table-striped.table-bordered.table-hover > tbody > tr:nth-child("+i+") > td:nth-child(9)").textContent;
                document.querySelector("body > div.row > div:nth-child(1) > table.table.table-striped.table-bordered.table-hover > tbody > tr:nth-child("+i+") > td:nth-child(9)").innerHTML+='<td><input type="checkbox" class="shu" value="'+zhinc+'"></td>'
            }
        }
    }
    //document.querySelector("body > div.row > div:nth-child(1) > table:nth-child(1) > tbody > tr > td").innerHTML +='------------------------------'
    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position="fixed"
    Container.style.left="1280px"
    Container.style.top="110px"
    Container.style['z-index']="999999"
    Container.innerHTML =`<input type="text" id="zonghe" size="2"> <input type="button" id="tongji" value="统计">`
    document.body.appendChild(Container);
    //
    let btnnc=document.querySelector("#tongji");
    let cll =document.getElementsByClassName('shu');
    btnnc.onclick=function(){
        let zong1 = 0;
        var zongNC = Number(zong1);
        for(var x2 = 0;x2<cll.length;x2++){
            if(cll[x2].checked){
                //获取所在行数，导出数给下行
                let jia2= cll[x2].value;

                zongNC += Number(jia2) ;
                console.log(jia2);
                console.log(zongNC);
            }
        }
        document.querySelector("#zonghe").value=zongNC;
    }
}

//上昵称下评价++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
if(document.location.href == "http://admin.bbs3839.5054399.com/comment/work-index.html"
   ||document.location.href == "http://admin.bbs3839.5054399.com/comment/work-index.html?pagesize=20"
   ||document.location.href == "http://admin.bbs3839.5054399.com/comment/work-index.html?pagesize=50"
   ||document.location.href == "http://admin.bbs3839.5054399.com/comment/work-index.html?type=1"
  ){
    document.querySelector("#subContent > div > div > div > div.portlet-body > table").classList.add("table-hover");
    var hangshuP = document.querySelector("#subContent > div > div > div > div.portlet-body > table > tbody").getElementsByTagName("tr").length+1;
    for(var o=2;o<hangshuP;o++){
        var y = document.querySelector("#subContent > div > div > div > div.portlet-body > table > tbody > tr:nth-child("+o+") > td:nth-child(2)");
        for( let key1 in mingdan ){
            if(y.innerHTML == key1){
                y.innerHTML += "<span style='color:#E003F8'>"+mingdan[key1]+"<span>";
                //添加多选框
                let zhipj=document.querySelector("#subContent > div > div > div > div.portlet-body > table > tbody > tr:nth-child("+o+") > td:nth-child(10)").textContent;
                document.querySelector("#subContent > div > div > div > div.portlet-body > table > tbody > tr:nth-child("+o+") > td:nth-child(10)").innerHTML+='<td><input type="checkbox" class="shu" value="'+zhipj+'"></td>'
            }
        }
    }
    //
    //document.querySelector("#cn-material_search").innerHTML +='--------------------------------------------------<input type="text" id="zonghe" size="2"><input type="button" id="tongji" value="统计">'
    let Container1 = document.createElement('div');
    Container1.id = "sp-ac-container";
    Container1.style.position="fixed"
    Container1.style.left="1580px"
    Container1.style.top="190px"
    Container1.style['z-index']="999999"
    Container1.innerHTML =`<input type="text" id="zonghe" size="2"> <input type="button" id="tongji" value="统计">`
    document.body.appendChild(Container1);
    //
    let btnpj=document.querySelector("#tongji");
    let bll =document.getElementsByClassName('shu');

    btnpj.onclick=function(){
        let zong1 = 0;
        var zongPJ = Number(zong1);
        for(var x1 = 0;x1<bll.length;x1++){
            if(bll[x1].checked){
                //获取所在行数，导出数给下行
                let jia1= bll[x1].value;

                zongPJ += Number(jia1) ;
                console.log(jia1);
                console.log(zongPJ);
            }
        }
        document.querySelector("#zonghe").value=zongPJ;
    }
}
//-----------------------------下论坛



if(document.location.href == "http://admin.bbs3839.5054399.com/bbs/statistics-audit.html?pagesize=50"
   || document.location.href == "http://admin.bbs3839.5054399.com/bbs/statistics-audit.html?pagesize=50&p=1"
   || document.location.href == "http://admin.bbs3839.5054399.com/bbs/statistics-audit.html"
   || document.location.href == "http://admin.bbs3839.5054399.com/bbs/statistics-audit.html?pagesize=20"
   || document.location.href == "http://admin.bbs3839.5054399.com/bbs/statistics-audit.html?pagesize=20&p=2"
   || document.location.href == "http://admin.bbs3839.5054399.com/bbs/statistics-audit.html?pagesize=50&p=2"
   || document.location.href == "http://admin.bbs3839.5054399.com/bbs/statistics-audit.html?p=2"
   || document.location.href == "http://admin.bbs3839.5054399.com/bbs/statistics-audit.html?p=2&pagesize=50"
   || document.location.href == "http://admin.bbs3839.5054399.com/bbs/statistics-audit.html?p=2&pagesize=20"
  ){
    var hangshuQ = document.querySelector("#subContent > div > div > div > div.portlet-body > table > tbody").getElementsByTagName("tr").length+1;
    document.querySelector("#subContent > div > div > div > div.portlet-body > table").classList.add("table-hover")
    for(var p=2;p<hangshuQ;p++){
        var z = document.querySelector("#subContent > div > div > div > div.portlet-body > table > tbody > tr:nth-child("+p+") > td:nth-child(1)");
        for( let key2 in mingdan ){
            if(z.innerHTML == key2){
                z.innerHTML += "<span style='color:#E003F8'>"+mingdan[key2]+"<span>";
                //添加多选框
                let zhi=document.querySelector("#subContent > div > div > div > div.portlet-body > table > tbody > tr:nth-child("+p+") > td:nth-child(11)").textContent;
                document.querySelector("#subContent > div > div > div > div.portlet-body > table > tbody > tr:nth-child("+p+") > td:nth-child(11)").innerHTML+='<td><input type="checkbox" class="shu" value="'+zhi+'"></td>';
            }
        }
    }
    //添加计算框
    //document.querySelector("#cn-material_search").innerHTML +='-----------------------------------<input type="text" id="zonghe" size="2"><input type="button" id="tongji" value="统计">';
    let Container2 = document.createElement('div');
    Container2.id = "sp-ac-container";
    Container2.style.position="fixed"
    Container2.style.left="1580px"
    Container2.style.top="110px"
    Container2.style['z-index']="999999"
    Container2.innerHTML =`<input type="text" id="zonghe" size="2"> <input type="button" id="tongji" value="统计">`
    document.body.appendChild(Container2);
    //
    //
    let btnwj=document.querySelector("#tongji");
    let all =document.getElementsByClassName('shu');

    btnwj.onclick=function(){
        let zong1 = 0;
        var zong = Number(zong1);
        for(var x = 0;x<all.length;x++){
            if(all[x].checked){
                //获取所在行数，导出数给下行
                let jia= all[x].value;

                zong += Number(jia) ;
                console.log(jia);
                console.log(zong);
            }
        }
        document.querySelector("#zonghe").value=zong;
    }
}
//------------------------------------------------------------------------------------------------------------------------------------------以下头像
/*
if(document.location.href == "http://review.4399tech.com/admin/home/index-type-2"){
    function myFunction()
    {
        document.querySelector("#content > div > div.table.selfSum > div.el-divider.el-divider--horizontal > div").innerHTML += '-------------------------------<input type="text" id="jieguokuang" size=3><input type="button" id="jisuan" value="计算">'
        var chushen=document.querySelector("#content > div > div.table.selfSum > div.el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_12");
        var fushen=document.querySelector("#content > div > div.table.selfSum > div.el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1) > td.el-table_2_column_13");
        var bianjichu=document.querySelector("#content > div > div.table.selfSum > div.el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_12");
        var bianjifu=document.querySelector("#content > div > div.table.selfSum > div.el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(2) > td.el-table_2_column_13");
        var fll =[chushen,fushen,bianjichu,bianjifu];

        for(var f = 0;f<fll.length;f++){
            var Va=fll[f].innerText;
            fll[f].innerHTML += '--<input type="checkbox" class="bo" value="'+Va+'">';

        }
}
    setTimeout(myFunction(),100000);
}*/