// ==UserScript==
// @author       小工具
// @name         专用工具
// @namespace    https://www.baidu.com
// @version      1.07
// @description  专用小工具
// @match        https://itunnel.top/*
// @match        https://115.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_log
// @connect      proapi.115.com
// @connect      itunnel.top
// @require      https://greasyfork.org/scripts/387426-%E5%B0%8F%E5%B7%A5%E5%85%B7/code/%E5%B0%8F%E5%B7%A5%E5%85%B7.js?version=716709
// @downloadURL https://update.greasyfork.org/scripts/387933/%E4%B8%93%E7%94%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/387933/%E4%B8%93%E7%94%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var str=document.URL;
  if(str == "https://itunnel.top/115upload")
  {
      FillUidAndKey();
  }

 waitForKeyElements("div.file-opr", AddShareSHA1Node);
 waitForKeyElements("div.dialog-bottom", AddDownloadSha1Btn);
function FillUidAndKey()
    {
  var uploadinfo=null;
  GM_xmlhttpRequest({
  method: "GET",
  url: 'http://proapi.115.com/app/uploadinfo',
  responseType: 'json',
  onload: function(response) {
       if (response.status === 200) {
              uploadinfo = response.response;
              //alert(uploadinfo.user_id+'|'+uploadinfo.userkey);
           try
{
           document.getElementById('user_id').value=uploadinfo.user_id;
           document.getElementById('user_key').value=uploadinfo.userkey;
}
           catch(err)
{
    alert('请先登录115');
}
            } else {

              return GM_log("response.status = " + response.status);
            }
  }
});
    }

function test(info)
    {
        if(info==false){
            alert("请选择正确的文件");
            return;
        }
       var link= prompt("复制分享链接到剪贴板",info);
        if (link!=null)
{
    //copyToClipboard(link);
}
    }

function DownFileBySha1(links)
    {
        console.log(links);
        if (links=="")
          {
            alert("链接不能为空");
            return;
          }

         var uploadinfo=null;
          var cid=0;
          GM_xmlhttpRequest({
              method: "GET",
              url: 'http://proapi.115.com/app/uploadinfo',
              responseType: 'json',
              onload: function(response) {
                  if (response.status === 200) {
                      uploadinfo = response.response;
                    //  alert(uploadinfo.user_id+'|'+uploadinfo.userkey);
                      try
                      {

                          var requestParams=encodeURI("links="+links+"&uid="+uploadinfo.user_id+"&userkey="+uploadinfo.userkey+"&cid=0");


                          GM_xmlhttpRequest({
                              method: "GET",
                              url: 'https://itunnel.top/115uploader?'+requestParams,
                              responseType: 'text',
                              onload: function(response) {
                                  if (response.status === 200) {
                                      var uploadinfo = response.response;
                                      try
                                      {
                                          //alert(uploadinfo);

                                      }
                                      catch(err)
                                      {
                                          alert(err);
                                      }
                                  } else {
                                      alert(response.response);
                                      return GM_log("response.status = " + response.response);
                                  }
                              }
                          });
                      }
                      catch(err)
                      {
                          alert('请先登录115');
                      }
                  } else {

                      return GM_log("response.status = " + response.status);
                  }
              }
          });
    }


function GetSha1LinkByliNode(liNode)
    {
      var type=(liNode.getAttribute("file_type"));
       if(type=="0")
      {
          var fid  = liNode.getAttribute('cate_id');
          return false;
       }
     else
     {
         var filename  = liNode.getAttribute('title');
         var filesize =liNode.getAttribute('file_size');
          var sha1 =liNode.getAttribute('sha1');
          console.log(filename+'|'+filesize+'|'+sha1);
          return (filename+'|'+filesize+'|'+sha1);
     }
    }
function AddDownloadSha1Btn(jNode)
    {   if (document.getElementById('downsha1')==null){
        var id=document.createElement('div');
        id.setAttribute('class','con');
        id.setAttribute('id','downsha1');
         var ia=document.createElement('a');
          ia.setAttribute('class','button');
        ia.setAttribute('href','javascript:;');
         var inode=document.createTextNode("无会员下载");
         ia.appendChild(inode);
         id.appendChild(ia);
        jNode[0].appendChild(id);
        id.addEventListener('click', function (e) {
          var links= document.getElementById('js_offline_new_add').value
          var mm=links.split("\n");
            for(var i=0;i<mm.length;i++){
                DownFileBySha1(mm[i]);
            }
          //DownFileBySha1(links);
         alert(mm.length+'个文件开始下载，115服务器可能会卡，请耐心等待！');

        })
    }

    }
function AddShareSHA1Node (jNode)
    {
        var parentNode=jNode[0].parentNode;
        var sha1Link=GetSha1LinkByliNode(parentNode);
        var aclass=document.createElement('a');
        aclass.addEventListener('click', function (e) {
           test(sha1Link);

        })

        var iclass=document.createElement('i');

        var ispan=document.createElement('span');

        var node=document.createTextNode("转存");

        ispan.appendChild(node);

        aclass.appendChild(iclass);
        aclass.appendChild(ispan);
        jNode[0].appendChild(aclass);

   }

})();