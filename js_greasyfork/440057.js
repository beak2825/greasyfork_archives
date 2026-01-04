// ==UserScript==
// @name         百度文库拷贝破解
// @namespace    http://tampermonkey.net/
// @homepage     https://www.wangxingyang.com/baiduwenku.html
// @version      0.2
// @description  解除百度文库复制限制
// @author       freefitter
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABpElEQVR4nO3Vv2uUQRDG8c/ebSMWqay0trATAxrUSi1S2AiWFoJYpNCgoBjURsHWJKeNRfAvsDgFixQqKdPZ2ViEiCJYBOQu8f1hEXO59713j7MUfLZ6d2a/O8vMO0OzDnin9Ku2Mjvuaw07xgSAYEVXe2indMhj92zpKJLnBhF8MDeye9hn6zbN70eRiqCw02Bra3up8BBLu1FEBxsBucXqW4csz0ULe4jorSCMuPU89boRELDMHiI6Y8V65bbCUTccc70RkaOwKLOg0IkyXa9qTjOu2LAs6NZuD86hrdTyxRNTkUqqdhXlHrngGRVEZsMpJwex9DxIZSHYclesIb65LCoHgIs66UJq6btDBZHZrPh8V6YBOX66LbOkTGckBYimBW2FVTNeuOZNyrFJ236Yl4NSy5SbVm1PDvhodqgyMledTdRlAtDzqfL9tfkwUtyaRkv9LwFj9B/w7wPycXOhqlJ0yZHKPChMi5MCiM47XhsopbVJAUHfrYbmN/EToN+02eLPfz9OYyZhFJzW1Jn3lTsxaKQjCkp52jy45r1ZvSbTb9M0d4PBozGZAAAAAElFTkSuQmCC
// @include      *://wenku.baidu.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @license      AGPL License
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440057/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%8B%B7%E8%B4%9D%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/440057/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%8B%B7%E8%B4%9D%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var url = window.location.href;
    var host = window.location.host;
    console.log(url);
    if((url.indexOf("wenku.baidu.com/view")==-1 && url.indexOf("wenku.baidu.com/link")==-1) || host!="wenku.baidu.com"){
			return;
		}
    var allContent = "";
    var $ = $ || window.$; //获得jquery的$标识符
    var pageNum = 0,loadPageNum =0 ,docid = "";
    // 添加相关按钮
    var copyBtn = "<div style='position:fixed;z-index:999;background-color:#ccc;cursor:pointer;top:120px;left:0px;'>"+
        "<div id='copyBtn' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:#FE8A23;'>复制</div>"+
        "</div>";
    $("body").append(copyBtn);

    function getCopyData(indexpagedata){
        //debugger;
        allContent = "";
        if(null == indexpagedata || undefined == indexpagedata || "" == indexpagedata)
        {
            console.log("页面数据没取到啊");
            return;
        }else{
            //解析出文章路径
            if(!indexpagedata.hasOwnProperty("readerInfo")){
                console.log("这个文章还不能解析.....");
                return;
            }
            var htmlUrls= indexpagedata.readerInfo.htmlUrls;
            if(!htmlUrls.hasOwnProperty("json")){
                console.log("PPT 解析成图片.....");
                for(let i in htmlUrls){
                    allContent += "<img src='" + htmlUrls[i] + "'/>";
                }
            }else{
                //console.log(GM_listValues())
                var pageinfos = htmlUrls.json;
                var pnginfos = htmlUrls.png;
                // 总页数
                pageNum = indexpagedata.readerInfo.page;
                docid = indexpagedata.readerInfo.docId;
                // 返回的数据页数
                loadPageNum = pageinfos.length;
                for(var ii in pageinfos){
                    let pageLoadUrl = pageinfos[ii].pageLoadUrl;
                    GM_xmlhttpRequest({
                        url: pageLoadUrl,
                        method: 'GET',
                        onload: obj => {
                            let data=obj.response;
                            //console.log(data)
                            // 1、将数据拆分成key和value
                            let key = data.substr(0,data.indexOf("("));
                            let val = data.substr(data.indexOf("(")+1,data.lastIndexOf(")")-data.indexOf("(")-1);
                            // 2、解析文章数据
                            let retJson = JSON.parse(val);
                            let articleInfos = retJson.body;
                            let content = "";
                            //console.log(articleInfos);
                            // 组成完整的章节文章
                            var lineY = 0;
                            for(let i in articleInfos){
                                if("word" == articleInfos[i].t){
                                    // 增加换行
                                    let y = articleInfos[i].p.y
                                    if(lineY == 0){
                                        content += articleInfos[i].c
                                        lineY = y;
                                    }else if(y == lineY){
                                        content += articleInfos[i].c
                                    }else{
                                        if("" != articleInfos[i].c.trim()){
                                            content += "<br/>" + articleInfos[i].c;
                                        }else{
                                            if(" " == articleInfos[i].c){
                                                content += "<br/>" + articleInfos[i].c;
                                            }else{
                                                console.log("未处理的字符:["+ articleInfos[i].c +"]");
                                            }
                                        }
                                        lineY = y;
                                    }
                                }else if("pic" == articleInfos[i].t){
                                    //style="position: absolute;clip: rect(0px,250px,200px,50px);width: 300px;height: 200px">
                                    if(null == articleInfos[i].s || "" == articleInfos[i].s || undefined ==articleInfos[i].s){
                                        //content += "=****pic"+ i +"*****=";
                                        // 文章中包含图片，不处理
                                        content += "";
                                    }else{
                                        content = "PIC"
                                    }
                                    //content += '<img src="' + pnginfos[0].pageLoadUrl + '" style="position: absolute;clip: rect('+ articleInfos[i].c.ix +'px,'+ articleInfos[i].c.iy +'px,'+ articleInfos[i].c.iw +'px,'+ articleInfos[i].c.ih +'px);"/>'
                                }
                            }
                            GM_setValue(docid+key, content);
                        },onerror: err => {
                            console.log(err)
                        }
                    });/**/

                }
                // 按序输出结果
                for(let j=1; j<= loadPageNum ;j++){
                    let tmp = GM_getValue(docid+"wenku_"+j,"");
                    if(tmp == "PIC"){
                        //allContent = allContent.replace("=****pic"+ (j - 1 )+"*****=","<img src='" + pnginfos[j-1].pageLoadUrl + "'/>");
                        allContent += "<img src='" + pnginfos[j-1].pageLoadUrl + "'/>";
                    }else{
                        allContent += tmp;
                    }
                    // 移除相关Key
                    GM_deleteValue(docid+"wenku_"+j);
                }
                //console.log(GM_listValues())
            }
        }
    }

    // 点击拷贝
    $("body").on("click","#copyBtn",function(){
        let indexpagedata = unsafeWindow.pageData;
        getCopyData(indexpagedata);
        let ua = navigator.userAgent;
        let opacity = '0.95';
        if (ua.indexOf("Edge") >= 0) {
            opacity = '0.6';
        } else{
            opacity = '0.95';
        }
        let str = "";
        if(loadPageNum != pageNum){
            str = "当前加载了[" + loadPageNum +"]页，总共[" + pageNum + "]页，登录会加载更多页。"
        }
        let copyTextBox = '<div id="copy_text_box" style="width:100%;height:100%;position: fixed;z-index: 99;display: block;top: 0px;left: 0px;background:rgba(255,255,255,' + opacity + ');-webkit-backdrop-filter: blur(20px);display: flex;justify-content:center;align-items:center;">'+
            '<div id="copy_box_close" style="width:100%;height:100%;position:fixed;top:0px;left:0px;"><div style="font-size:16px;margin-top:20px;text-align:center;"><b>点击文本外关闭弹框</b><div><b style="color:red">' + str +'</b></div></div></div>'+
            '<pre id="copy_text_content" style="padding:20px;border:1px solid #CCC;border-radius:4px;width:60%;font-size:16px;line-height:22px;z-index:10000;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;word-break:break-all;max-height:70%;overflow:auto;"></pre>'+
            '</div>"';
        $('#copy_text_box').remove();
        if("" == allContent){
            allContent = "未获取成功，请再次点击复制按钮！"
        }
        $('body').append(copyTextBox);
        $('#copy_text_content').html(allContent);
        $('#copy_box_close').click(function() {
            $('#copy_text_box').remove();
        });

    });

})();