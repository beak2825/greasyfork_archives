// ==UserScript==
// @name         福利部落自动保存V1.7备用CDN版
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.8.1
// @description  致敬永远的神李恒道！
// @author       仙流【致敬永远的神李恒道】
// @license MIT
// @match        https://www.afulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.ifulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.afulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.tokyobl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://www.afulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.tokyobl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.ifulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.ifulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.club/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.bfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.bfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://down.tokyobl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.tokyobl.com/wp-content/plugins/erphpdown/download.php*
// @match        https://afulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://ifulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://afulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.tokyobl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://afulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://ifulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://ifulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.club/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://tokyobl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://bfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://bfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://tokyobl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://tokyobl.com/wp-content/plugins/erphpdown/download.php*
// @match        https://cfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://cfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://cfulibl.com/wp-content/plugins/erphpdown/download.php*
// @match        https://www.cfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.cfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.cfulibl.com/wp-content/plugins/erphpdown/download.php*
// @match        https://dfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://dfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.dfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.dfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.kyotoo.org/wp-content/plugins/erphpdown/download.php*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @require      https://cdn.staticfile.org/jszip/3.5.0/jszip.min.js
// @require      https://lib.baomitu.com/limonte-sweetalert2/11.4.8/sweetalert2.all.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/445459/%E7%A6%8F%E5%88%A9%E9%83%A8%E8%90%BD%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98V17%E5%A4%87%E7%94%A8CDN%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/445459/%E7%A6%8F%E5%88%A9%E9%83%A8%E8%90%BD%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98V17%E5%A4%87%E7%94%A8CDN%E7%89%88.meta.js
// ==/UserScript==
var zip = new JSZip();
let showtextouter=document.createElement("div");
let showtext=document.createElement("div");
showtext.innerHTML='';
showtextouter.append(showtext)
showtextouter.className='card-wrap'
showtext.className='card'
document.body.append(showtextouter);
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

function randomstring(text,status){
    if(status===false)
    {
        return text;
    }
    const tempString = []
    for (let i of text) {
        if (!Math.round(Math.random())) {
            tempString.push(i.toLowerCase())
        } else {
            tempString.push(i.toUpperCase())
        }
    }
    return tempString.join('')

}
function saveFile(md5,slicemd5,length,name,method,token,url,randomobfs=false){
    console.log('saveFile',md5,slicemd5,length,name,method)
    Toast.fire('开始保存文件')
    let posttext='path=%2F'+name+'&content-md5='+randomstring(md5,randomobfs)+'&slice-md5='+slicemd5+'&content-length='+length
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
                Swal.fire({
                    title: '成功',
                    text: '保存'+name+'文件成功！李恒道牛逼！！',
                    icon: 'success',
                    confirmButtonText: '确认'
                })

            }else if(json.errno===-6)
            {
                GM_setValue("bdtoken",'');
                Swal.fire({
                    title: '错误',
                    text: '保存文件失败！,百度账号未登录',
                    icon: 'error',
                    confirmButtonText: '确认'
                })
            }else if(json.errno===2)
            {

                Swal.fire({
                    title: '错误',
                    text: '疑似bsdtoken刷新，正在重试！',
                    icon: 'error',
                    confirmButtonText: '确认'
                })
                GM_setValue("bdtoken",'');
                SaveBaiduFile(url)
            }
            else{
                console.log('保存文件失败！',json)
                if(json.errno===404){
                    if(randomobfs===true)
                    {
                        Swal.fire({
                            title: '错误',
                            text: '错误码404，obfs启动无效',
                            icon: 'error',
                            confirmButtonText: '确认'
                        })


                    }
                    else{
                        saveFile(md5,slicemd5,length,name,method,token,url,true)

                    }

                }
                else{
                    Swal.fire({
                        title: '错误',
                        text: '保存文件失败！，好可惜！错误码'+json.errno,
                        icon: 'error',
                        confirmButtonText: '确认'
                    })
                }

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
        Swal.fire({
            title: '错误',
            text: '未输入bdstoken，请阅读使用教程',
            icon: 'error',
            confirmButtonText: '确认'
        })
        return;
    }
    else if(bdsfield.match(/[0-9a-zA-Z]{32}/) == null){
        if(bdsfield.includes("-6")){
            Swal.fire({
                title: '错误',
                text:'未登录百度账号，请登录百度网盘网页版后再次获取',
                icon: 'error',
                confirmButtonText: '确认'
            })
        }else{
            Swal.fire({
                title: '错误',
                text:'未检测到有效bdstoken，请阅读使用教程',
                icon: 'error',
                confirmButtonText: '确认'
            })
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
        Swal.fire({
            title: '错误',
            text:'未检测到有效秒传链接',
            icon: 'error',
            confirmButtonText: '确认'
        })
    }
}



function RefreshToken(url){
    Toast.fire('正在解析百度Token')
    GM_xmlhttpRequest({
        url:'https://pan.baidu.com/api/gettemplatevariable?fields=[%22bdstoken%22]',
        method :"GET",
        headers: {
        },
        onload:function(xhr){
            var json = JSON.parse(xhr.responseText);
            if(json.errno===0)
            {
                Toast.fire('解析百度Token成功')
                GM_setValue("bdtoken",json.result.bdstoken);
                SaveBaiduFile(url)
            }else if(json.errno===-6)
            {
                GM_setValue("bdtoken",'');
                Swal.fire({
                    title: '错误',
                    text: '保存文件失败！,百度账号未登录',
                    icon: 'error',
                    confirmButtonText: '确认'
                })
            }
            else{
                Swal.fire({
                    title: '错误',
                    text: '刷新百度token失败，请检查是否登陆百度账户！错误码:'+json.errno,
                    icon: 'error',
                    confirmButtonText: '确认'
                })
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
                showtext.className='btn-class card'
                showtext.append(item)
            }
        }
    }

}
function GetZipText(url){
    Toast.fire('开始下载秒传压缩包')
    GM_xmlhttpRequest({
        url:url,
        responseType:'arraybuffer',
        method :"GET",
        headers: {
        },
        onload:function(xhr){
            Toast.fire('下载完成，开始解压分析')
            zip.loadAsync(xhr.response).then(function(zip) {
                console.log('老子加载完成了',Object.keys(zip.files))
                let filelist=Object.keys(zip.files)
                if(filelist.length!=0)
                {
                    for(let index=0;index<filelist.length;index++)
                    {
                        zip.file(filelist[index]).async('string').then(data=>{
                            let baiduurl= FindBaiDuURL(data)
                            if(baiduurl=='error')
                            {
                                Swal.fire({
                                    title: '错误',
                                    text: '解析文本失败，请手动处理！',
                                    icon: 'error',
                                    confirmButtonText: '确认'
                                })
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
                    Swal.fire({
                        title: '错误',
                        text: '解析文件失败或无文件，请手动处理！',
                        icon: 'error',
                        confirmButtonText: '确认'
                    })
                }
            }).catch(val=> {
                Swal.fire({
                    title: '错误',
                    text: '下载文件失败，请重新尝试！！',
                    icon: 'error',
                    confirmButtonText: '确认'
                })
            });;
        }
    });

}
function SaveHrelFile(href)
{
    Toast.fire('已开始寻找路径...')
    GM_xmlhttpRequest({
        url:href,
        method :"GET",
        headers: {
        },
        onload:function(xhr){
            Toast.fire('寻找路径成功，开始分析...')
            if(xhr.response.indexOf('pan.baidu.com')!=-1)
            {
                Swal.fire({
                    title: '错误',
                    text: '该文件非百度秒传，请手动处理!',
                    icon: 'error',
                    confirmButtonText: '确认'
                })
                return;
            }
            console.log('有罪推定',xhr)
            let finalurl=xhr.response.replace("<script type='text/javascript'>window.location='","").replace("';</script>",'')

            GetZipText(finalurl)
        }
    });
}
let div=document.createElement("div");
div.innerHTML='<button class="btn-class btnhover-class">一键保存</button>';
Toast.fire('脚本注入成功!')
div.onclick=function(event){
    Toast.fire('开始运行，请勿重复点击！')
    let lista=document.querySelectorAll('a')
    let num=0
    for(let index=0;index<lista.length;index++)
    {
        num++
        SaveHrelFile(lista[index].href)
    }
};

document.querySelector('#erphpdown-download').append(div);
var style=`.btn-class {
    color: #409eff;
    background-color: rgb(236, 245, 255);
    border-color: #b3d8ff;
    border-style: solid;
    border-width: 1px;
    padding: 4.9px 8.5px;
    border-radius: 4.3px;
    cursor: pointer;
     }
     .btnhover-class:hover{
     background: #409eff;
     border-color: #409eff;
     color: #fff;
     }
     .card-wrap{
     display: flex;
justify-content: center;
     }
          .card{
padding: 10.9px;
line-height: 22px;
cursor: auto;
     }

`
var ele=document.createElement("style");
ele.innerHTML=style;
document.getElementsByTagName('head')[0].appendChild(ele)