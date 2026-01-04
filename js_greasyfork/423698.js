// ==UserScript==
// @name         福利部落自动保存
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       仙流/天才少年李恒道
// @match        https://www.afulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.ifulibl.net/wp-content/plugins/erphpdown/download.php*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/423698/%E7%A6%8F%E5%88%A9%E9%83%A8%E8%90%BD%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/423698/%E7%A6%8F%E5%88%A9%E9%83%A8%E8%90%BD%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==
var zip = new JSZip();
let showtext=document.createElement("div");
showtext.innerHTML='';
document.body.append(showtext);
console.log('zip',zip)
  function saveFile(md5,slicemd5,length,name,method,token,url){
      console.log('saveFile',md5,slicemd5,length,name,method)
      let posttext='path=%2F'+name+'&content-md5='+md5+'&slice-md5='+slicemd5+'&content-length='+length
      GM_xmlhttpRequest({
        url:'https://pan.baidu.com/api/rapidupload?app_id=250528&bdstoken='+token+'&channel=chunlei&clienttype=0&rtype=1&web=1',
        method :"POST",
          data:posttext,
        headers: {
            'Content-Type':'application/json; charset=UTF-8'
        },
        onload:function(xhr){
            var json = JSON.parse(xhr.responseText);
            if(json.errno===0)
            {
                alert('保存'+name+'文件成功！仙流/李恒道牛逼！！')

            }else if(json.errno===-6)
            {
                GM_setValue("bdtoken",'');
                alert('保存文件失败！,百度账号未登录')
            }else if(json.errno===2)
            {
                alert('疑似bsdtoken刷新，正在重试！')
                GM_setValue("bdtoken",'');
                SaveBaiduFile(url)
            }
            else{
                console.log('保存文件失败！',json)
                alert('保存文件失败！，好可惜！错误码'+json.errno)
            }

        }
    });
  }
  function atou(str) {
      return decodeURIComponent(escape(window.atob(str)));
  }
  function Trim(str){
      return str.replace(/(^\s*)|(\s*$)/g, "");
  }
  function getLink(link,token) {
      let bdstoken=''
  let bdsfield = token
  if(bdsfield == ""){
  alert('未输入bdstoken，请阅读使用教程');
  return;
  }
  else if(bdsfield.match(/[0-9a-zA-Z]{32}/) == null){
  if(bdsfield.includes("-6")){
	alert('未登录百度账号，请登录百度网盘网页版后再次获取');
  }else{
  alert('未检测到有效bdstoken，请阅读使用教程');
  }

  return;
  }
  else{
	bdstoken = bdsfield.match(/[0-9a-zA-Z]{32}/)[0];
      console.log('修改了bsdtoken',bdstoken)

  }

  let bdpan = link.match(/bdpan:\/\/(.+)/);
  let pcs = link.match('BaiduPCS-Go');
  let mengji = link.match(/.{32}#.{32}/);
  let bdlink = link.match('bdlink(.+)');
  let pan = link.match(/^pan:\/\//);

 if (mengji){
  let input = link;
  let md5 = input.match(/^(.{32})#/)[1];
  let slicemd5 = input.match(/#(.{32})#/)[1];
  let file_length = input.match(/#([0-9]+)#/)[1];
  let file_name = input.match(/#[0-9]+#(.+)$/)[1];
  file_name = Trim(file_name);
  saveFile(md5, slicemd5, file_length, file_name, mengji,token,link);
  }
      else{
          alert('未检测到有效秒传链接')
      }
  }



function RefreshToken(url){
    GM_xmlhttpRequest({
        url:'https://pan.baidu.com/api/gettemplatevariable?fields=[%22bdstoken%22]',
        method :"GET",
        headers: {
        },
        onload:function(xhr){
            var json = JSON.parse(xhr.responseText);
            if(json.errno===0)
            {
                GM_setValue("bdtoken",json.result.bdstoken);
                SaveBaiduFile(url)
            }else if(json.errno===-6)
            {
                GM_setValue("bdtoken",'');
                alert('保存文件失败！,百度账号未登录')
            }
            else{
                console.log('刷新百度token失败，请检查是否登陆百度账户！',json)
                alert('刷新百度token失败，请检查是否登陆百度账户！错误码:'+json.errno)
            }

        }
    });

}
function SaveBaiduFile(url){
    let token= GM_getValue("bdtoken",'')
    if(token=='')
    {
        RefreshToken(url)
        return;
    }
    console.log('获取当前token',token)
    getLink(url,token)


}
function FindBaiDuURL(text){
    let textlist=text.split(/[\s\n]/)
    let retlist=[]
    for(let index=0;index<textlist.length;index++){
        let temp=textlist[index]
        if(temp!='')
        {
            if(temp.indexOf('#')!=-1)
            {
                let listnum=temp.split('#').length
                console.log('listnum',listnum)
                if(listnum==4){
                    retlist.push(temp)
                }
            }

        }
    }
    if(retlist.length!=0)
    {
        return retlist
    }
    return 'error'
}
function ShowHtmlText(url,name){
    if(showtext.innerHTML.indexOf(name)==-1)
    {
            let textlist=url.split(/[\s\n]/)
    for(let index=0;index<textlist.length;index++){
        let temp=textlist[index]
        if(temp!='')
        {
            let item=document.createElement("div");
            item.innerHTML=temp
            showtext.append(item)
        }
    }
    }

}
function GetZipText(url){


           GM_xmlhttpRequest({
        url:url,
               responseType:'arraybuffer',
        method :"GET",
        headers: {
        },
        onload:function(xhr){
            console.log('xhr加载完毕',xhr)
              zip.loadAsync(xhr.response).then(function(zip) {
                  console.log('老子加载完成了',Object.keys(zip.files))
                  let filelist=Object.keys(zip.files)
                  if(filelist.length!=0)
                  {
                      for(let index=0;index<filelist.length;index++)
                      {
                                 zip.file(filelist[index]).async('string').then(data=>{
                                let baiduurl= FindBaiDuURL(data)
                                debugger;
                                if(baiduurl=='error')
                                {
                                    alert('解析文本失败，请手动操作吧！')
                                }
                                 ShowHtmlText(data,baiduurl[0])
                                 for(let index=0;index<baiduurl.length;index++)
                                 {
                                     SaveBaiduFile(baiduurl[index])
                                 }
                             });

                      }

                  }
                  else{
                      alert('解析文件失败或无文件')
                  }
              }).catch(val=> { alert('下载文件失败，请刷新页面尝试！！') });;
        }
    });

}
function SaveHrelFile(href)
{
    GM_xmlhttpRequest({
        url:href,
        method :"GET",
        headers: {
        },
        onload:function(xhr){
            if(xhr.response.indexOf('pan.baidu.com')!=-1)
            {
                alert('文件不属于秒传压缩包')
                return;
            }
            let finalurl=xhr.response.replace("<script type='text/javascript'>window.location='","").replace("';</script>",'')
            GetZipText(finalurl)
        }
    });
}
let div=document.createElement("div");
div.innerHTML='<button>一键保存</button>';
div.onclick=function(event){
    let lista=document.querySelectorAll('a')
    for(let index=0;index<lista.length;index++)
    {
        SaveHrelFile(lista[index].href)
    }
};

document.querySelector('#erphpdown-download').append(div);