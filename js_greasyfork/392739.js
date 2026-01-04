// ==UserScript==
// @name         追新番磁力下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.9.3
// @description  追新番磁力下载按钮修复
// @author       pbbqdd
// @match        http://www.zhuixinfan.com/viewtvplay*
// @match        http://www.zhuixinfan.com/main.php?mod=viewresource&sid=*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/392739/%E8%BF%BD%E6%96%B0%E7%95%AA%E7%A3%81%E5%8A%9B%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/392739/%E8%BF%BD%E6%96%B0%E7%95%AA%E7%A3%81%E5%8A%9B%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


function selectbt(){//得到magnet link内容
    var torrent = document.getElementById("torrent_url");
    var text =torrent.innerHTML;
    return text;

};


function get_link(tag,url,pro){//get_magnet
$(document).ready(function(){
$.ajax({url:url,success:function(result){
   $(tag).attr(pro,$(result).find("#torrent_url").text())

}})

});
}

function copy_fix(tag,targit){
$(tag).attr("data-clipboard-target",targit);
}

function copy_text(tag,targit){
$(tag).attr("data-clipboard-text",targit);
}

function selectdl(){//选择性复制
    var selectdl = document.createElement("a");
    selectdl.id ="selectdl";
    selectdl.className ="bt bts-copy";
    selectdl.innerHTML="copy选择项";
    var dlink = document.getElementsByClassName("dlinks");
    var mutidown=dlink[1].getElementsByTagName("dt")[0].appendChild(selectdl);
    new ClipboardJS('.bts-copy');
    $(document).ready(function(){
       $("#selectdl").click(function(){
           var toplist = document.getElementsByClassName("td2");
           var i;
           var magnets="";
           for (i = 0; i < toplist.length; i++) {
           var magnet_link=document.getElementById("cb"+i);
               if(magnet_link.checked){

               magnets=magnets+magnet_link.value+"\n";

               }
           }
           copy_text("#selectdl",magnets);
           alert("已复制选中链接")


       });


    });

}
function downlist(){
    var dllist=document.createElement("dl");
    var toplist = document.getElementsByClassName("td2");//捕捉td2选择
    var i;
    for (i = 0; i < toplist.length; i++) {
    var dttmp = document.createElement("dt");
    var input= document.createElement("input");
        input.type="checkbox";
        input.id ="cb"+i;
        input.className="bt bt-cl";
        input.innerHTML=toplist[i].getElementsByTagName("a")[0].innerHTML
        //input.checked="checked"
       // var page_url=toplist[i].getElementsByTagName("a")[0].href;

        //get_link(input,page_url);//magnet link 加入到a的href属性
    toplist[i].appendChild(input);
    dttmp.appendChild(input);
    dllist.appendChild(dttmp);





}
    return dllist;




}

(function() {
    try{

    //修复点击下载按钮
    var text =selectbt(this);
    var ci = document.getElementsByClassName("bt bt-cl");
    ci[0].href = text;
    //修复复制按钮
    new ClipboardJS('.bt-copy');
    $("a.bt.bt-copy").attr("data-clipboard-target",function(){
       var dct=$(this).attr("data-clipboard-target");
       return "#"+dct;

    });

    //定位到连接清单
    }
    catch(e){
        throw e;
    }finally{

    var toplist = document.getElementsByClassName("td2");//捕捉td2选择
    var i;
    for (i = 0; i < toplist.length; i++) {
    var input= document.createElement("a");
    var input_cb = document.createElement("input");
        input_cb.type="checkbox";
        input_cb.checked="checked";
        //input.type="button";
        input_cb.id ="cb"+i;
        input.className="bt bt-cl";
        input.innerHTML="U力下载"
        //input.checked="checked"
        var page_url=toplist[i].getElementsByTagName("a")[0].href;
        get_link(input,page_url,"href");
        get_link(input_cb,page_url,"value");//magnet link 加入到a的href属性
    toplist[i].appendChild(input);
    toplist[i].appendChild(input_cb);

    };

};

    try{
        selectdl();
}catch(e){throw e;}
//加载连接





})();









