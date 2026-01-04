// ==UserScript==
// @name         bilibili下载视频
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  获取bilibili视频flv下载地址
// @author       bibi
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js
// @match        *://*.bilibili.com/video/*
// @include      https://www.bibibili.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant		 GM_getValue
// @grant		 GM_setValue
// @grant		 GM_notification
// @downloadURL https://update.greasyfork.org/scripts/415392/bilibili%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/415392/bilibili%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
     * 公共变量区
     */
    const scriptVersion = GM_info.script.version.trim(); //本程序的版本
    const scriptIcon = GM_info.script.icon64 || GM_info.script.icon; //本程序的图标
    const scriptName = "bilibilidownload";
    var currentUrl=document.URL;
    var aria2Port=6800;
    //定义数据数组
    //存储cid序列,用于分p记录
    var allcid=[];
    //存储{名字;url;cid}
    var urlArray=new Array();
    //当前p
    var whichP=0;
    //从全局变量中得到sessdata,用于下载.
    var sessdata="";


/******************************************获取下载地址 start********************************************************/
    //获取bv号
    function getBV(){
        //页面获取 bv号
        var bvCode=currentUrl.split("?")[0];
        var bvArray=bvCode.split("/");
        //获取当前分p
        if(currentUrl.split("?")[1]){
            var P=currentUrl.split("?")[1];
            if(P.length>2 && P.substr(0, 2) == "p="){
                whichP=parseInt(P.split("=")[1])-1;
               }else{
                   whichP=0;
               }
           }else{
               //否则当前p为第一p
               whichP=0;
           }
        return bvArray[4];
    }

    //根据bv号获取aid cid
    function getAidAndCid() {
    var bv =getBV();
    var url="https://api.bilibili.com/x/web-interface/view?bvid="+bv;
    return new Promise((resolve,reject)=>{
        $.get(url,
             {},
             function (body){
              var data={};
              data.aid=body.data.aid;
              data.cids=new Array();
                for (let i = 0; i < body.data.pages.length; i++) {
                var mycid={};
                mycid.cid=body.data.pages[i].cid;
                mycid.name=body.data.pages[i].part;
                data.cids[i]=mycid;
                //维护一个cid数组
                allcid[i]=body.data.pages[i].cid;
               }
            //返回数据
            resolve(data);
             }
         )

    });
}

//获取下载url
function getDownUrl(data) {
    return new Promise((resolve,reject)=>{
        //console.log(data);
        //https://api.bilibili.com/x/player/playurl/
        let myurl="https://api.bilibili.com/x/player/playurl?"
        //根据获取aidcid 获得真实的下载地址。
        const promiseArray=[];
        let i=0;
        data.cids.forEach((key)=>{
            let url=myurl+"avid="+data.aid+"&cid="+key.cid+"&qn=80";
            let promise=promiseGetUrl(url,key);
            promiseArray[i]=promise;
            i++;
        })
        //获取结果数组
        resolve(Promise.all(promiseArray));
    });
}

//promiseGetUrl 获取多p视频的url
function promiseGetUrl(url,key) {
    //大于480画质需要验证是否登陆
    //设置cookie
    return new Promise((resolve,reject)=>{

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Accept':' application / JSON',
                'Cookie':'SESSDATA='+sessdata+';',
            },
            onload: function(body) {
                var myport={};
                //console.log(body.responseText);
                var mybody=JSON.parse(body.responseText);
                myport.name=key.name;
                myport.cid=key.cid;
                myport.url=mybody.data.durl[0].url;
                resolve(myport);
            }
        });
    });
}


function get(){
    //获取aidcid
    getAidAndCid().then((data)=>{
    return getDownUrl(data)

    }).then((data)=>{
        //data为数组
        data.forEach((key)=>{
            //console.log(key.name);
            //console.log(key.url);
            //console.log(key.cid);
            //rpcAria2_2(key,bv);
        });
         //将数据存放至全局数组
          urlArray=data;
    });
}
/******************************************设置下载地址end********************************************************/

//设置b站sessdata 因为httponly 无法在cookie中获取
//不设置只能下载480p视频
function setSessdata(biliSessdata){
    //保存
    if(biliSessdata!=null&&biliSessdata!=""){
        GM_setValue("bilibilidown-sessdata",biliSessdata);
        GM_notification({text:"设置已保存", title:scriptName, image:scriptIcon});
    }else{
        GM_notification({text:"设置失败，不能为空", title:scriptName, image:scriptIcon});
    }
    //返回
    return
}

    //设置Aria2Part 因为用户可能更改端口号
//不设置只能下载480p视频
function setAria2Part(inputbiliSessdata){
    //保存
    if(inputbiliSessdata!=null&&inputbiliSessdata!=""){
        GM_setValue('Aria2Part',inputbiliSessdata);
        GM_notification({text:"aria2c端口已保存", title:scriptName, image:scriptIcon});
    }else{
        GM_notification({text:"设置失败，不能为空", title:scriptName, image:scriptIcon});
    }
    //返回
    return
}

/******************************************设置界面ui start********************************************************/
// 设置界面ui
function setUI(){

 var ui2="<div class='bilibili-dropdown' style='position: relative;display: inline-block'>"+
"<button class='bilibili-dropbtn' style=''background-color: #4CAF50;color: white;padding: 16px;font-size: 16px;border: none;cursor: pointer''>点击下载</button>"+
  "<div class='bilibili-dropdown-content' style='display: none;background-color: #f9f9f9;min-width: 160px;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);'>"+
  "<li><a id=copyOneUrl href='#'>复制本p</a></li>"+
  "<li><a id=copyAllUrl href='#'>复制全部p</a>"+
  "<li><a id=sendOneUrltoAria2 href='#'>发送本p到aria2</a></li>"+
  "<li><a id=sendAllUrltoAria2 href='#'>发送全部到aria2</a></li>"+
  "<li><input type='text' id='inputSessdata'  ></li>"+
  "<li><a id=setSessdata href='#'>设置sessdata</a></li>"+
  "<li><input type='text'  id='inputAria2Port'value='6800'></li>"+
  "<li><a id='setAria2Port' href='#'>设置aria2端口号</a></li>"

  "</div>"+
"</div>";
    var uiStr = "<div href='javascript:void(0)' target='_blank' id='bilibilisetUi' style='cursor:pointer;z-index:98;display:block;width:60px;height:30px;line-height:30px;position:fixed;left:0;top:400px;text-align:center;overflow:visible'>"+ui2+"</div>";
    //console.log(uiStr);
  $("body").append(uiStr);

}
/********************************************设置界面ui end******************************************************/

    function getwhencilck( ){
        $("#bilibilisetUi").click(function(){
            get();
            $("#bilibilisetUi").mouseover(function(){
               //显示下拉菜单
                  $(".bilibili-dropdown-content").css('display','block');
            });

            $("#bilibilisetUi").mouseout(function(){
                  $(".bilibili-dropdown-content").css('display','none');
            });
             /************************************************************绑定事件 start***********************************************/
            //绑定事件 点击下载本p视频
            $(".bilibili-dropbtn").click(function(){
                getBV();
                var innerP=0;
                var whichPCid=allcid[whichP];
                for(var i=0;i<urlArray.length;i++){
                    if(whichPCid==urlArray[i].cid){
                        innerP=i;
                    }
                }

                function func(){
                    GM_notification({text:"下载完成", title:scriptName, image:scriptIcon});
                };
                var details={
                    url:urlArray[innerP].url,
                    headers:{
                        referer:document.URL
                    },
                    name:urlArray[innerP].name+".flv",
                    onload:func
                };
                //调用gm下载
                GM_download(details);
                GM_notification({text:"文件正在下载中,不要关闭本网页", title:scriptName, image:scriptIcon});
                return false;
            })

            //复制本p下载Url
            $("#copyOneUrl").click(function(){
                getBV();
                var innerP=0;
                var whichPCid=allcid[whichP];
                for(var i=0;i<urlArray.length;i++){
                    if(whichPCid==urlArray[i].cid){
                        innerP=i;
                    }
                }
                //console.log(urlArray[innerP].cid);
                var tag = document.createElement('input');
                tag.setAttribute('id', 'cp_hgz_input');
                tag.value = urlArray[innerP].url;
                document.getElementsByTagName('body')[0].appendChild(tag);
                document.getElementById('cp_hgz_input').select();
                document.execCommand('copy');
                document.getElementById('cp_hgz_input').remove();
                return false;
            })

            //复制全部下载Url
            $("#copyAllUrl").click(function(){

                var tag = document.createElement('input');
                tag.setAttribute('id', 'cp_hgz_input');
                for(var i=0;i<=urlArray.length;i++){
                    tag.value =tag.value+urlArray[i].url;
                }
                document.getElementsByTagName('body')[0].appendChild(tag);
                document.getElementById('cp_hgz_input').select();
                document.execCommand('copy');
                document.getElementById('cp_hgz_input').remove();
                return false;
            })
            //发送本p到aria2
            $("#sendOneUrltoAria2").click(function(){
                //得到的数组可能和cid不对应
                getBV();
                var innerP=0;
                var whichPCid=allcid[whichP];
                for(var i=0;i<urlArray.length;i++){
                    if(whichPCid==urlArray[i].cid){
                        innerP=i;
                    }
                }
                let json_rpc = {
                    id:'',
                    jsonrpc:'2.0',
                    method:'aria2.addUri',
                    //"method":'system.listMethods',
                    params:[
                        [urlArray[innerP].url],
                        {
                            out:urlArray[innerP].name+".flv",
                            referer:currentUrl,

                        }
                    ]
                }
                let data=JSON.stringify(json_rpc);
                console.log(data);
                //发送到本地aria2
                $.post(
                    'http://localhost:'+aria2Port+'/jsonrpc',
                    data,
                    function(body){
                        console.log(body);
                        if(body=="error"){
                            GM_notification({text:"发送失败 请检查aria2端口", title:scriptName, image:scriptIcon});
                        }else{
                            GM_notification({text:"发送成功", title:scriptName, image:scriptIcon});
                        }
                    }
                );
                return false;
            })
            //发送全部p到aria2
            $("#sendAllUrltoAria2").click(function(){
                for(var i=0;i<=urlArray;i++){
                    let json_rpc = {
                        id:'',
                        jsonrpc:'2.0',
                        method:'aria2.addUri',
                        //"method":'system.listMethods',
                        params:[
                            [urlArray[i].url],
                            {
                                out:urlArray[i].name+".flv",
                                referer:currentUrl,

                            }
                        ]
                    }
                    let data=JSON.stringify(json_rpc);
                    //发送到本地aria2
                    $.post(
                        'http://localhost:'+aria2Port+'/jsonrpc',
                        data,
                        function(body){
                            console.log(body);
                        }
                    );
                }
                 return false;
            })

            //设置sessdata 如果不设置sessiondata 下载的文件最高为480p
            $("#setSessdata").click(function(){
                var data=$("#inputSessdata").val();
                //console.log(data);
                setSessdata(data);
                 return false;
            })

            //设置aria2端口号
            $("#setAria2Port").click(function(){
                var data=$("#inputAria2Port").val();
                setAria2Part(data);
                 return false;
            })

            //
            var sess=GM_getValue("bilibilidown-sessdata");
            console.log(sess);
            if(sess!=""&&sess!=null){
                sessdata=sess;
            };
            $("#inputSessdata").val(sessdata);
            /************************************************************绑定事件 end***********************************************/
            $('#bilibilisetUi').unbind("click");
        });
    };
//get();
setUI();
getwhencilck();
    setInterval(function() {
        if(currentUrl==document.URL) {
            //console.log(currentUrl);
        }else{
            currentUrl=document.URL;
            //console.log(currentUrl);
            //取消事件。
            //$("#bilibilisetUi").unbind("mouseover");
            //$(".bilibili-dropbtn").unbind("click");
            //$("#bilibilisetUi").children().unbind();
            //getwhencilck( );
        }
    }, 3000);
})();