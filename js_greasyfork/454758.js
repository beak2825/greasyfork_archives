// ==UserScript==
// @name        同步相册图片
// @namespace   https://greasyfork.org/users/14059
// @description 用浏览器进行爬虫的脚本.自己在var urlList定义爬虫地址列表,然后手动绕过验证码,运行菜单:运行爬虫脚本
// @match     https://www.szwego.com/static/index.html*
// @author      setycyas
// @version     0.08
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/454758/%E5%90%8C%E6%AD%A5%E7%9B%B8%E5%86%8C%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/454758/%E5%90%8C%E6%AD%A5%E7%9B%B8%E5%86%8C%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function(){
    /* 脚本正式开始 */
    'use strict';
//显示加载器

function showLoader() {
$('.content').before('<div class="spinner" style="width: 50%;z-index: 100;position: fixed;left: 0px;right: 0px;margin-left: auto;margin-right: auto;"><img src="https://www.taobaimei.com/images/jiazaizhong1.gif" id="jiazai_donghua" style="width:100%"></div> ');
}
    function jiazaishuzi(){
        let aaa=0;
        $(".paixuaaa").remove();
         $('.f-flex-1 a').each(function(){
         $(this).prepend('<span class="paixuaaa" style="position: absolute;z-index: 1;color: red;text-shadow: 0 0 10px #fff,;">'+aaa+'</span>');
         aaa++;
         });
    }
    window.onscroll = function(){
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
        //console.log(scrollTop);
       // console.log(windowHeight);
       // console.log(scrollHeight);
                   //滚动条到底部的条件
                   //一般来说需要提前触发:scrollTop+windowHeight + 200 >=scrollHeight
                   if(scrollTop+windowHeight+580>=scrollHeight){
        　　　　        //console.log("已触底");
                       jiazaishuzi()
                  }
        }

    window.onload=function(){
        if(window.location.href.indexOf("shop_detail") != -1 ){
        let htmlset='<div style="width:100%;background:#CCCCCC;height:7em;margin-top:55px;position: fixed;top: 0;left: 0;right: 0;z-index: 99;margin-right: auto;margin-left: auto;">';
        htmlset=htmlset+'<div id="leftset" style="float:left;width:70%;height: 7em;margin-top: 0.5em;"><div><div>按数字<input id="start_ks" style="width:35%;height: 3em;" value="0">至<input id="start_js" style="width:35%;height: 3em;" value="50"></div></div><div style="margin-top: 0.5em;"><div>按日期<input id="time_ks" style="width:35%;height: 3em;" value="" placeholder="2022-11-07 00:00:00">至<input id="time_js" style="width:35%;height: 3em;" value="" placeholder="2022-11-07 23:59:59"></div></div></div>';
        htmlset=htmlset+'<div id="rightset" style="float:left;width:30%;height:7em;text-align: center;line-height: 7em;"><div style="height: 3em;margin-top: 0.5em;"><button class="resetpaixu" id="resetpaixu" style="margin-left: 5px;height: 3em;font-size: 1em;display: flow-root;">显示排序</button></div><div style="height: 3em;margin-top: 0.05em;"><button style="margin-left:5px;height: 3em;font-size: 1em;display: flow-root;" class="clickshuju" id="clickshuju">获取数据</button></div></div>';
        htmlset=htmlset+'</div>';
         $('.content ').before(htmlset);
        jiazaishuzi()
                }
    };
    $(document).on("click", ".clickshuju",function () { main();showLoader();console.log("数据获取中"); })
    $(document).on("click", ".resetpaixu",function () { jiazaishuzi();console.log("排序整理中"); })

    /****************************************
  ######## version 2019-03-13 ###########
  ######## 脚本正式开始 ###################
  ****************************************/

    // 自定义爬虫地址数组
    var urlList = [
        'https://www.szwego.com/service/album/get_album_list.jsp?act=attention_enc&search_value=&page_index=1&tag_id=&_=1652298431581'
    ];
    // 用于记录所有爬取内容的数组
    var contentList=[];

    var albumId='';//第一页数据
    var searchValue="";//第一页数据
    var searchImg="";//第一页数据
    var startDate="";//第一页数据
    var endDate="";//第一页数据
    var startDate_time="";//时间戳开始
    var endDate_time="";//13位时间戳结束
    var sourceId="";//第一页数据
    var requestDataType="";//第一页数据
    var timestamp='';
    var shop_url_json="";
    var pic_url="";
    var return_msg="";
    var thisdiv;
    var ii=0;
    var bb=0;
    var i_reset=0;
    //补零操作
function addZero(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}


        function formatDate(date) {
        var datee = new Date(date);
        var YY = datee.getFullYear() + '-';
        var MM = (datee.getMonth() + 1 < 10 ? '0' + (datee.getMonth() + 1) : datee.getMonth() + 1) + '-';
        var DD = (datee.getDate() < 10 ? '0' + (datee.getDate()) : datee.getDate());
        var hh = (datee.getHours() < 10 ? '0' + datee.getHours() : datee.getHours()) + ':';
        var mm = (datee.getMinutes() < 10 ? '0' + datee.getMinutes() : datee.getMinutes()) + ':';
        var ss = (datee.getSeconds() < 10 ? '0' + datee.getSeconds() : datee.getSeconds());
        return YY + MM + DD +" "+hh + mm + ss;
    }
    function GetDateStr(AddDayCount)
    {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+m+"-"+d;
    }
    // 读取urlList的地址,把内容加入到contentList,如果urlList未空,则继续执行自己,否则显示结果
 function getNextUrl(ele){
        ii=ii+1;
        shop_url_json='https://www.szwego.com/album/personal/all?&albumId='+albumId+'&searchValue='+searchValue+'&searchImg='+searchImg+'&startDate='+startDate+'&endDate='+endDate+'&sourceId='+sourceId+timestamp+'&requestDataType='+requestDataType+'';
        console.log('现在读取url: '+shop_url_json);
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "post",
                url: shop_url_json,
                headers:  {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload:(ress)=>{
                    if(ress.status === 200 && $.parseJSON(ress.response)['result']['items'].length!=0)
                    {
                        var time_next=$.parseJSON(ress.response)['result']['items'][$.parseJSON(ress.response)['result']['items'].length - 1].time_stamp;//下一页时间戳
                        // var next_time=time_next.toString().substr(0,time_next.toString().length-3);
                        console.log(formatDate(time_next)+"判断最后一个时间")
                        console.log(formatDate(startDate_time)+"筛选开始时间"+formatDate(endDate_time))
                        if(startDate_time<=time_next && endDate_time>=time_next)
                        {
                            // console.log($.parseJSON(ress.response)['result']['items']);
                            $('#zhixing_sl').text(parseInt($('#zhixing_sl').text())+$.parseJSON(ress.response)['result']['items'].length)
                            contentList=contentList.concat($.parseJSON(ress.response)['result']['items']);
                            console.log(contentList.length+"现在总数");
                            timestamp='&slipType=1&timestamp='+time_next;//第二页开始要加的参数上一页的最后一个发布时间
                            console.log('调用下一页')
                            getNextUrl(ele);
                        }
                        else
                        {
                           // if(ii<=1){$('#zhixing_sl').text(parseInt($('#zhixing_sl').text())+$.parseJSON(ress.response)['result']['items'].length)}
                            contentList=contentList.concat($.parseJSON(ress.response)['result']['items']);
                            console.log(contentList);
                            console.log('加载完毕，准备下载中');
                            console.log(contentList.length+"现在总数");
                            if($('#time_ks').val()!="" && $('#time_js').val()!="" ){
                                while(i_reset<contentList.length){

                                    if(startDate_time>=contentList[i_reset].update_time || endDate_time<=contentList[i_reset].update_time)
                                    {
                                        console.log(formatDate(contentList[i_reset].update_time)+"这个日期不要了")
                                        contentList.splice(i_reset,1);
                                    }
                                    i_reset=i_reset+1;
                                }

                            }//没选时间默认更新到昨天
                           // var oInput = document.createElement('textarea');
                            //document.body.appendChild(oInput);
                            //$('#container').before('<textarea id="oInputdiv">'+JSON.stringify(contentList)+'</textarea><input id="copybtn" type="button" onclick="fuzhia()" value="'+JSON.stringify(contentList)+'"/>');
                            GM_setClipboard(JSON.stringify(contentList.reverse()));
                            $("div.spinner").remove();
                            alert("数据获取成功");
                            //oInputdiv.setAttribute("id","oInputdiv");
                            //oInputdiv.innerHTML = "id2";
                            resolve(true)
                           //subData(contentList,ele);
                        }
                    }else
                    {
                        if($.parseJSON(ress.response)['result']['items'].length==0){
                            //done_renwu(ele);
                            console.log('下一页没内容了');
                            console.log('加载完毕，准备下载中');
                            resolve(true)
                          // subData(contentList,ele);
                        }
                        else{console.log('失败了');resolve(false)}
                    }
                },
                onerror : function(err){
                    console.log('error')
                    console.log(err)
                    resolve(false)
                }
            })
        })
    }


    // 读取urlList的地址,把内容加入到contentList,如果urlList未空,则继续执行自己,否则显示结果
 function getNextUr2(ele){
        ii=ii+1;
        shop_url_json='https://www.szwego.com/album/personal/all?&albumId='+albumId+'&searchValue='+searchValue+'&searchImg='+searchImg+'&startDate='+startDate+'&endDate='+endDate+'&sourceId='+sourceId+timestamp+'&requestDataType='+requestDataType+'';
        console.log('现在读取url: '+shop_url_json);
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "post",
                url: shop_url_json,
                headers:  {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload:(ress)=>{
                    if(ress.status === 200 && $.parseJSON(ress.response)['result']['items'].length!=0)
                    {
                        var time_next=$.parseJSON(ress.response)['result']['items'][$.parseJSON(ress.response)['result']['items'].length - 1].time_stamp;//下一页时间戳
                        // var next_time=time_next.toString().substr(0,time_next.toString().length-3);
                        console.log(formatDate(time_next)+"判断从多少开始")
                        //console.log(formatDate(startDate_time)+"筛选数量"+formatDate(endDate_time))
                        if(contentList.length<$('#start_js').val())
                        {
                            // console.log($.parseJSON(ress.response)['result']['items']);
                            $('#zhixing_sl').text(parseInt($('#zhixing_sl').text())+$.parseJSON(ress.response)['result']['items'].length)
                            contentList=contentList.concat($.parseJSON(ress.response)['result']['items']);
                            console.log(contentList.length+"现在总数");
                            timestamp='&slipType=1&timestamp='+time_next;//第二页开始要加的参数上一页的最后一个发布时间
                            console.log('调用下一页')
                            getNextUr2(ele);
                        }
                        else
                        {
                           // if(ii<=1){$('#zhixing_sl').text(parseInt($('#zhixing_sl').text())+$.parseJSON(ress.response)['result']['items'].length)}
                            contentList=contentList.concat($.parseJSON(ress.response)['result']['items']);
                            console.log(contentList);
                            console.log('加载完毕，准备下载中');
                            console.log(contentList.length+"现在总数");
                           // var oInput = document.createElement('textarea');
                            //document.body.appendChild(oInput);
                            //$('#container').before('<textarea id="oInputdiv">'+JSON.stringify(contentList)+'</textarea><input id="copybtn" type="button" onclick="fuzhia()" value="'+JSON.stringify(contentList)+'"/>');

                            GM_setClipboard(JSON.stringify(contentList.slice($('#start_ks').val(),Number($('#start_js').val())+1)));
                            console.log(contentList.slice($('#start_ks').val(),Number($('#start_js').val())+1));
                            $("div.spinner").remove();
                            alert("数据获取成功");
                            //oInputdiv.setAttribute("id","oInputdiv");
                            //oInputdiv.innerHTML = "id2";
                            resolve(true)
                           //subData(contentList,ele);
                        }
                    }else
                    {
                        if($.parseJSON(ress.response)['result']['items'].length==0){
                            //done_renwu(ele);
                            console.log('下一页没内容了');
                            GM_setClipboard(JSON.stringify(contentList.slice($('#start_ks').val(),Number($('#start_js').val())+1)));
                            console.log(contentList.slice($('#start_ks').val(),Number($('#start_js').val())+1));
                            alert("数据获取成功");
                            resolve(true)
                          // subData(contentList,ele);
                        }
                        else{console.log('失败了');resolve(false)}
                    }
                },
                onerror : function(err){
                    console.log('error')
                    console.log(err)
                    resolve(false)
                }
            })
        })
    }


    function start_caiji()//.length
    {
        var ele="aaa";
        if($('#time_ks').val()=="" && $('#time_js').val()=="" ){//不设置的情况下取前一百天
            albumId=window.location.href;
            if(albumId.indexOf("shop_detail") == -1 ){alert("进入商家列表页在执行");return;}
           var albumIdarr = albumId.split("/")
           albumId = albumIdarr[albumIdarr.length-1]
        //下面是选出时间
        //if($(ele).find(".time_start").text().indexOf("最新")!=-1){ startDate=GetDateStr(-1);endDate=GetDateStr(-1);}//没选时间默认更新到昨天
        //startDate=GetDateStr(-15);endDate=GetDateStr(0);
           // console.log("获取日期"+startDate+"到"+endDate)
        //startDate_time = new Date(startDate+" 00:00:00");
        //startDate_time = startDate_time.getTime();//要几号的时间戳
        //endDate_time = new Date(endDate +" 23:59:59");
        //endDate_time = endDate_time.getTime();//要几号的时间戳
            getNextUr2(ele);
            }
        else{
            startDate_time = $('#time_ks').val().getTime();//要几号的时间戳
            endDate_time = $('#time_js').val().getTime();//要几号的时间戳
            console.log("获取日期"+startDate+"到"+endDate)
            getNextUrl(ele);
        }
       
    }

    // 主函数
    function main(){
        contentList=[];
        timestamp="";
        i_reset=i_reset+0;
        start_caiji();
    }

    /* Main Script */
    GM_registerMenuCommand('同步相册朋友圈',main);

    /* 脚本结束 */
})();