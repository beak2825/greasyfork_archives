// ==UserScript==
// @author       T3rry
// @name         115转存助手
// @namespace    Fake115Upload
// @version      1.4.3
// @description  115文件转存
// @match        https://115.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_log
// @connect      proapi.115.com
// @connect      webapi.115.com
// @connect      115.com
// @require      https://cdn.bootcss.com/jsSHA/2.3.1/sha1.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/413262/115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/413262/115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // unsafeWindow.browserInterface=[];
    //  console.log(unsafeWindow.browserInterface);
    //  unsafeWindow.browserInterface.LoginEncrypt = 1;

    //   console.log(unsafeWindow.browserInterface.LoginEncrypt);
    var str=document.URL;
    var hProtocol="115://";
    var StoreFolder="转存";
    window.CID=0;
    waitForKeyElements("div.file-opr", AddShareSHA1Btn);
    waitForKeyElements("div.dialog-bottom", AddDownloadSha1Btn);


    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("*{margin:0;padding:0;}  .pp_align{font-size: 12px;line-height:30px;font-weight: 500;text-align:center;border:1px solid #D1D4D6} .pub_switch_box{font-size: 0;display: inline-block;} .pub_switch { display: none;} .pub_switch + label {display: inline-block;position: relative;width: 56px;height: 32px;background-color: #fafbfa;border-radius: 50px;-webkit-transition: all 0.1s ease-in;transition: all 0.1s ease-in;} .pub_switch  + label:after {content: ' ';position: absolute;top: 0;width: 100%;height: 100%;-webkit-transition: box-shadow 0.1s ease-in;transition: box-shadow 0.1s ease-in;left: 0;border-radius: 100px;box-shadow: inset 0 0 0 0 #eee, 0 0 1px rgba(0,0,0,0.4);} .pub_switch  + label:before {content: ' ';position: absolute;top: 0px;left: 1px;z-index: 999999;width: 32px;height:32px;-webkit-transition: all 0.1s ease-in;transition: all 0.1s ease-in;border-radius: 100px;box-shadow: 0 3px 1px rgba(0,0,0,0.05), 0 0px 1px rgba(0,0,0,0.3);background: white;} .pub_switch:active + label:after {box-shadow: inset 0 0 0 20px #eee, 0 0 1px #eee;} .pub_switch:active + label:before {width: 37px;} .pub_switch:checked:active + label:before {width: 37px;left: 20px;} .pub_switch  + label:active {box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0px 1px 3px rgba(0,0,0,0.1);} .pub_switch:checked + label:before {content: ' ';position: absolute;left: 31px;border-radius: 100px;} .pub_switch:checked + label:after {content: ' ';font-size: 1.5em;position: absolute;background: #2777F8;box-shadow: 0 0 1px #2777F8;}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    window.linkText=""

    window.reqcount=0

    window.cookie=document.cookie




    function delay(ms) {

        if(ms==0)
        {
            ms=1000*(Math.floor(Math.random()*(11-4))+4);
            console.log(ms);

        }
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    function download(filename,content,contentType) {
        if (!contentType) contentType = 'application/octet-stream';
        var a = document.createElement('a');
        var blob = new Blob([content], { 'type': contentType });
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }
    function SetListView()
    {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://115.com/?ct=user_setting&ac=set',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: PostData({
                setting:'{"view_file":"list"}'
            }),
            responseType: 'json',
            onload: function(response) {
                if (response.status === 200) {
                }
            }
        });
    }

    function AddAutoPickUpBox()
    {
        var i=document.getElementById('js_top_panel_box');
        if (i!=null){

            var id=document.createElement('div');
            id.setAttribute('class','pub_switch_box');



            var ia=document.createElement('span');
            ia.innerText='自动提取:';
            ia.setAttribute('class','pp_align');

            //ia.classList.add("button","btn-line", "btn-upload");


            var ip=document.createElement('input');
            ip.setAttribute('type','checkbox');
            ip.setAttribute('id','autopick');
            ip.setAttribute('class','pub_switch');

            var il=document.createElement('label');
            il.setAttribute('for','autopick');

            id.appendChild(ip);
            id.appendChild(il);

            // ia.appendChild(id);

            i.appendChild(ia);
            i.appendChild(id);



        }


    }


    function AddStroeFloder()
    {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://webapi.115.com/files/add',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            ,
            data: PostData({
                pid:'0',
                cname:StoreFolder
            }),
            responseType: 'json',
            onload: function(response) {
                if (response.status === 200) {
                }
            }
        });
    }


    function Init()
    {
        // AddAutoPickUpBox();
        //FormatCookieString();
        var cid=0;
        var info='';
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://webapi.115.com/files?aid=1&cid=0&o=user_ptime&asc=0&offset=0&show_dir=1&limit=115&code=&scid=&snap=0&natsort=1&record_open_time=1&source=&format=json',
            responseType: 'json',
            onload: function(response) {
                if (response.status === 200) {
                    info = response.response;

                    //  alert(uploadinfo.user_id+'|'+uploadinfo.userkey);
                    try
                    {
                        info.data.forEach(function (line) {
                            if(line.n==StoreFolder)
                            {
                                window.CID=line.cid;
                            }

                        }

                                         )
                        if(window.CID==0)
                        {
                            AddStroeFloder();
                        }
                    }
                    catch(err)
                    {
                        // alert(err);
                    }

                }
            }
        });


    }

    Init();

    function PostData(dict) {
        var k, tmp, v;
        tmp = [];
        for (k in dict) {
            v = dict[k];
            tmp.push(k + "=" + v);
        }
        return tmp.join('&');
    };

    function UrlData(dict) {
        var k, tmp, v;
        tmp = [];
        for (k in dict) {
            v = dict[k];
            tmp.push((encodeURIComponent(k)) + "=" + (encodeURIComponent(v)));
        }
        return tmp.join('&');
    };

    function GetSig(userid, fileid, target, userkey) {
        var sha1, tmp;
        sha1 = new jsSHA('SHA-1', 'TEXT');
        sha1.update("" + userid + fileid + fileid+target + "0");
        tmp = sha1.getHash('HEX');
        sha1 = new jsSHA('SHA-1', 'TEXT');
        sha1.update("" + userkey + tmp + "000000");
        return sha1.getHash('HEX', {
            outputUpper: true
        });
    }
    async  function test(info,flag)
    {
        window.linkText=""

        if(info[0].indexOf('|')==-1 ){


            GetFilesByCID(info[0]);

            await delay(3000);

            while(window.reqcount!=0)
            {
                await delay(50);

            }


            download(info[1]+"_sha1.txt",window.linkText);

            return;
        }

        GetShareLink(info,flag);
    }

    function DeleteCookie(resp)
    {
         try
                    {

        var reg =/set-cookie: .+;/g;

        var setcookie=reg.exec(resp)[0].split(';');

        var filecookie=setcookie[0].slice(11)+"; expires=Thu, 01 Jan 1970 00:00:00 UTC;"+setcookie[3]+";domain=.115.com";

        document.cookie =filecookie;

        RenewCookie()

        return filecookie;
         }
           catch(err)
                    {

                        return null;

                    }

    }

    function RenewCookie()
    {
        var arryCookie=window.cookie.split(';');

        arryCookie.forEach(function (kv) {

            document.cookie=kv+";expires=Thu, 01 Jan 2100 00:00:00 UTC;;domain=.115.com"

        }

       )

    }


    function GetFilesByCID(cid)
    {
          //  console.log("cid:"+cid);
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://webapi.115.com/files?aid=1&cid="+cid+"&o=user_ptime&asc=0&offset=0&show_dir=1&limit=1150&code=&scid=&snap=0&natsort=1&record_open_time=1&source=&format=json&type=&star=&is_share=&suffix=&custom_order=&fc_mix=",
            responseType: 'json',
            onload: function(response) {
                if (response.status === 200) {
                    var info = response.response;

                    try
                    {
                      //  console.log(info);

                        info.data.forEach(function (line) {



                            if(line.cid!=cid) //folder
                            {

                                GetFilesByCID(line.cid);

                            }
                            else
                            {
                                GetShareLink([line.n+'|'+line.s+'|'+line.sha, line.pc],false);


                            }


                        }

                                         )

                    }
                    catch(err)
                    {

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://aps.115.com/natsort/files.php?aid=1&cid="+cid+"&o=file_name&asc=1&offset=0&show_dir=1&limit=1150&code=&scid=&snap=0&natsort=1&record_open_time=1&source=&format=json&type=&star=&is_share=&suffix=&custom_order=&fc_mix=0",       responseType: 'json',
                            onload: function(response) {
                                if (response.status === 200) {
                                    var info = response.response;



                                    try
                                    {

                                        info.data.forEach(function (line) {


                                            if(line.cid!=cid) //folder
                                            {

                                                GetFilesByCID(line.cid);

                                            }
                                            else
                                            {
                                                GetShareLink([line.n+'|'+line.s+'|'+line.sha, line.pc],false);


                                            }


                                        }

                                                         )

                                    }
                                    catch(err)
                                    {
                                        alert(err);
                                    }

                                }
                            }
                        });


                    }

                }
            }
        });

    }

    function CreateShareLink(url,info,cookie,flag){




        var pre_buff=null;

        if(url!==undefined){

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Range": "bytes=0-154112",
                    "Cookie": cookie
                },
                responseType: 'arraybuffer',
                onload: function(response,shalink) {
                    if (response.status === 206) {

                        window.reqcount-=1


                        pre_buff = response.response;

                        try
                        {
                            var data= new Uint8Array(pre_buff);
                            var sha1 = new jsSHA('SHA-1', 'ARRAYBUFFER');
                            sha1.update(data.slice(0, 128 * 1024));
                            var preid = sha1.getHash('HEX', {
                                outputUpper: true
                            });
                            console.log(hProtocol+info[0]+'|'+preid);
                            window.linkText+=hProtocol+info[0]+'|'+preid+'\n'
                            if(flag){
                                var link= prompt("复制分享链接到剪贴板",hProtocol+info[0]+'|'+preid);
                            }

                        }
                        catch(err)
                        {
                            alert(err);
                        }
                    } else {
                        window.reqcount-=1

                        return GM_log("response.status = " + response.status);
                    }
                }
            });
        }

    }
 function GetShareLink(info,flag)
    {
        




        var download_info=null;
        GM_xmlhttpRequest({
            method: "GET",
            url: 'http://webapi.115.com/files/download?pickcode='+info[1],
               headers: {
                     "cache-control":"  no-cache, no-store, max-age=0, must-revalidate", //'public, no-store, no-cache="Set-Cookie", must-revalidate',
                     "Pragma": "no-cache",
                     "Expires": "0"
                },
            responseType: 'json',
            onload: function(response) {
                if (response.status === 200) {
                    download_info = response.response;

                  //    console.log(download_info);


                    window.reqcount+=1

                    var resp=response.responseHeaders

                   //     console.log(resp);

                   var setcookie= DeleteCookie(resp)
                    var filecookie= null;
                    if(setcookie)
                    {
                       filecookie= setcookie;

                    }



                    try
                    {

                        CreateShareLink(download_info.file_url,info,filecookie,flag);

                    }
                    catch(err)
                    {
                        alert('请先登录115'+err);
                    }
                } else {

                    return GM_log("response.status = " + response.status);
                }
            }
        });

    }
    function  DownLoadFileFromSha1Links(links)
    {
        // console.log(links);
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
                    document.cookie=window.cookie
                    //  alert(uploadinfo.user_id+'|'+uploadinfo.userkey);
                    try
                    {

                        var lines=links.split(/\r?\n/);
                        lines.forEach(function (line) {


                            if (line.trim()=="")
                            {
                                return;
                            }
                            var nsf=line.split('|');

                            if(nsf[0].substring(0,6)==hProtocol)
                            {
                                nsf[0]=nsf[0].substring(6);
                            }
                            if(nsf[0]!='' && nsf[1]!='' && nsf[2]!=''&& nsf[3]!=''&&nsf[2].length==40&&nsf[3].length==40)
                            {

                                DownFileBySha1JS(uploadinfo.userkey,uploadinfo.user_id,nsf[0],nsf[1],nsf[2],nsf[3]);



                            }

                            else
                            {
                                alert("链接格式错误!");
                            }

                        });



                    }
                    catch(err)
                    {
                        alert('请先登录115'+err);
                    }
                } else {

                    return GM_log("response.status = " + response.status);
                }

            }
        });
    }

    function DownFileBySha1JS(userkey,user_id,filename,filesize,fileid,preid)
    {
        var target='U_1_'+window.CID.toString();
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://uplb.115.com/3.0/initupload.php?' + UrlData({
                isp: 0,
                appid: 0,
                appversion: '11.2.0',
                format: 'json',
                sig: GetSig(user_id, fileid, target, userkey),

            }),
            data: PostData({
                preid: preid,
                fileid: fileid,
                quickid:fileid,
                app_ver: '11.2.0',
                filename: filename,
                filesize: filesize,
                exif:'',
                target: target,
                userid:user_id

            }),
            responseType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            onload: function(response) {
                if (response.status === 200) {

                    if (response.response.status === 2) {
                        return console.log(''+filename+' 转存成功！');
                    } else {
                        return console.log(''+filename+' 转存失败！');
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
        var filename  = liNode.getAttribute('title');

        if(type=="0")
        {
            var fid  = liNode.getAttribute('cate_id');
            return [fid,filename];
        }
        else
        {

            var filesize =liNode.getAttribute('file_size');
            var sha1 =liNode.getAttribute('sha1');
            var pickcode=liNode.getAttribute('pick_code');
            return [filename+'|'+filesize+'|'+sha1, pickcode];
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
        var inode=document.createTextNode("转存");
        ia.appendChild(inode);
        id.appendChild(ia);
        jNode[0].appendChild(id);
        id.addEventListener('click', function (e) {
            var links= document.getElementById('js_offline_new_add').value
            DownLoadFileFromSha1Links(links);

            (document.getElementsByClassName('close')[2].click());


        })
    }

    }


    function AddShareSHA1Btn(jNode)
    {
        var parentNode=jNode[0].parentNode;
        var sha1Link=GetSha1LinkByliNode(parentNode);
        var aclass=document.createElement('a');


        //    var AutoPickup=document.getElementById('autopick').checked;
        //  if(AutoPickup){
        //    GetShareLink(sha1Link,false);
        //  }
        aclass.addEventListener('click', function (e) {

            test(sha1Link,true);

        })


        var iclass=document.createElement('i');

        var ispan=document.createElement('span');

        var node=document.createTextNode("分享SHA1");

        ispan.appendChild(node);

        aclass.appendChild(iclass);
        aclass.appendChild(ispan);
        jNode[0].appendChild(aclass);

    }

})();
