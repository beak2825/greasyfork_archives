// ==UserScript==
// @name         阿里云盘分享脚本
// @namespace    hengji.copy
// @version      3.5
// @description  转自李恒道阿里云盘分享脚本
// @author       李恒道
// @match        https://passport.aliyundrive.com/*
// @match        https://www.aliyundrive.com/drive/*
// @match        https://www.aliyundrive.com/drive
// @match        https://aliyundrive.com/drive/*
// @match        https://aliyundrive.com/drive
// @match        http://passport.aliyundrive.com/*
// @match        http://www.aliyundrive.com/drive/*
// @match        http://www.aliyundrive.com/drive
// @match        http://aliyundrive.com/drive/*
// @match        http://aliyundrive.com/drive
// @icon         https://www.google.com/s2/favicons?domain=aliyundrive.com
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      aliyundrive.com
// @run-at       document-start
// @run-at document-start
// @supportURL   https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=280
// @homepage     https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=280
// @downloadURL https://update.greasyfork.org/scripts/430090/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%88%86%E4%BA%AB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/430090/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%88%86%E4%BA%AB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

let username=''
let password=''
//自动登陆配置项
let NewLink=true;
//使用新版链接
let FileList=[]
let Searchlist=[]
let CreateListner=false;
let GenerateFileInShow=false;
let parent_file_id='root'
let listurl=''
let CreateSaveBtn=false;
let Totallistnum=0;
let Sublistnum=0;
var ShowFileObj={
    name:'文件获取失败',
    content_hash:'hash获取失败',
    size:' ',
    content_type:'Fucccccck',
    file_id:'天才少年李恒道',
    content_type:' '
}
let accesstoken=''
let filenum=0;
let next_markerlist=[]
let totalnum=0;
let Uploadlist=[]
let Success=0;
let Faile=0;
function GetDecrText(text){
    if(text.indexOf('aliyunpan::')!==-1)
    {
        let sizelist=text.replace('aliyunpan::','').split('|')
        if(sizelist.length!==4)
        {
            return 'Error'
        }
        return {content_hash:sizelist[1],content_type:sizelist[3],name:sizelist[0],size:sizelist[2]}
    }
    return JSON.parse(decodeURIComponent(escape(window.atob(text))))


}
function GetFileSha1Encr(tempobj){
    if(NewLink==true)
    {
        let name=tempobj.name.replace('|','=')
        if(name==='')
        {
            name='nameisnull'
        }
        return 'aliyunpan::'+name+'|'+tempobj.content_hash.replace('|','=')+'|'+tempobj.size+'|'+tempobj.content_type.replace('|','=')
    }
    return window.btoa(unescape(encodeURIComponent(JSON.stringify({
        name:tempobj.name,
        content_hash:tempobj.content_hash,
        size:tempobj.size,
        content_type:tempobj.content_type,
    }))))
}
async function UploadOne(num){
    return new Promise((resolve, reject) => {
        let obj=Uploadlist[num]
        let text=GetDecrText(obj.date)
        let useruid=JSON.parse(localStorage.getItem('token')).default_drive_id
        let uploadtext='{"drive_id":"'+useruid+'","part_info_list":[{"part_number":1}],"parent_file_id":"'+parent_file_id+'","name":"'+text.name+'","type":"file","check_name_mode":"auto_rename","size":'+text.size+',"content_hash":"'+text.content_hash+'","content_hash_name":"sha1"}'
        GM_xmlhttpRequest({
            url:"https://api.aliyundrive.com/v2/file/create",
            method :"POST",
            data:uploadtext,
            headers: {
                "Content-type": "application/json;charset=utf-8",
                "Authorization": accesstoken
            },
            onload:function(xhr){
                var json = JSON.parse(xhr.responseText);
                if(json.rapid_upload==true)
                {
                    Success++;
                    SetSelectItem(obj,true,false)
                    resolve('success');

                }
                else{
                    Faile++;
                    SetSelectItem(obj,false,false)
                    resolve('faile');
                }
            }
        });
    });
}
async function StartAllFile(){
    Uploadlist=document.querySelectorAll('.FileListOutShow >div')
    Success=0;
    Faile=0;
    for(let index=0;index<Uploadlist.length;index++){
        if(Uploadlist[index].checkbox===false){
            await UploadOne(index)
        }

    }
    alert('上传完毕,成功了:'+Success+'个文件,失败了:'+Faile+'文件')
    unsafeWindow.location.reload();


}
function AddText(text){
    let list=text.split('\n')
    for(let index=0;index<list.length;index++)
    {
        let rowtext=list[index]
        if(rowtext.indexOf('eyJu')!=-1||rowtext.indexOf('aliyunpan::')!=-1)
        {
            let temp=GetDecrText(rowtext)
            if(temp.content_hash==undefined)
            {
                alert('提取码不正确！')
            }
            else{
                let FileItem=document.createElement('div')
                totalnum+=1
                SetTotalnum()
                FileItem.checkbox=false;
                FileItem.date=rowtext
                FileItem.name=temp.name
                FileItem.innerHTML='<div style="display: flex;align-items: center;justify-content: space-between;">     <div style="width: 160px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">'+temp.name+'</div><div style="flex-grow: 1;text-align: center;">'+temp.size+'</div><div class="checkbox--NOwE_ checkbox-container--TNndw" role="checkbox" aria-checked="false" data-checked="false" data-partial="true" data-disabled="false" data-no-padding="false" style="width: 20px;margin-right: 0px;"><div class="checkbox--11DPr" data-spm-anchor-id="0.0.0.i10.54a06c75uw7F5E"></div></div><div></div></div>'
                document.querySelector('.FileListOutShow').append(FileItem)

            }

        }
    }
    if(document.querySelectorAll('.FileListOutShow >div').length==0)
    {
        alert('找不到分享码！')
    }



}
function ReadFileList(evt){
    totalnum=0
    SetTotalnum()
    let files = evt.files
    if (files.length > 0) {
        let file = files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => {
            let result = reader.result;
            AddText(result)
        };

    }

}
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
function uploadadded(event){
    console.log('uploadadded',event)
}
function SetTotalnum(){
    document.querySelector('.SelectNumShow span').innerText=totalnum
}
function SetSelectItem(item,check,change=true){
    if(item.checkbox===check)
    {
        return;
    }
    if( item.checkbox===false)
    {
        item.checkbox=true
        if(change==true)
        {
            totalnum+=1
            SetTotalnum()
        }

        item.children[0].children[2].setAttribute('data-checked','true')
        item.children[0].children[2].innerHTML='<div class="checkbox--11DPr" data-spm-anchor-id="0.0.0.i10.54a06c75uw7F5E"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M12.6247 5.29974L7.26637 11.9977L3.83435 8.56567L4.96572 7.4343L7.1337 9.60228L11.3753 4.30023L12.6247 5.29974Z"></path></svg></div>'
    }
    else{
        item.checkbox=false
        if(change==true)
        {
            totalnum-=1
            SetTotalnum()
        }

        item.children[0].children[2].setAttribute('data-checked','false')
        item.children[0].children[2].innerHTML='<div class="checkbox--11DPr" data-spm-anchor-id="0.0.0.i10.54a06c75uw7F5E"></div>'
    }
}
function SearchFileMulInsert(text){
    document.querySelector('.FileListOutShow').innerText=''
    totalnum=0
    for(let index=0;index<FileList.length;index++){
        let templist=FileList[index]
        for(let innerindex=0;innerindex<templist.list.length;innerindex++)
        {
            let tempobj=templist.list[innerindex]

            if(tempobj.type!=='folder')
            {
                if(text===''||tempobj.name.indexOf(text)!=-1)
                {
                    let FileItem=document.createElement('div')
                    FileItem.checkbox=false;
                    FileItem.date=GetFileSha1Encr(tempobj)
                    FileItem.name=tempobj.name
                    FileItem.innerHTML='<div style="display: flex;align-items: center;justify-content: space-between;">     <div style="width: 160px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">'+tempobj.name+'</div><div style="flex-grow: 1;text-align: center;">'+tempobj.size+'</div><div class="checkbox--NOwE_ checkbox-container--TNndw" role="checkbox" aria-checked="false" data-checked="false" data-partial="true" data-disabled="false" data-no-padding="false" style="width: 20px;margin-right: 0px;"><div class="checkbox--11DPr" data-spm-anchor-id="0.0.0.i10.54a06c75uw7F5E"></div></div><div></div></div>'
                    FileItem.onclick=function(event){
                        if(event.target.outerHTML.indexOf('checkbox')!==-1||event.target.outerHTML.indexOf('M12.6247 5.29974L7.26637')!==-1)
                        {
                            SetSelectItem(FileItem,!FileItem.checkbox)

                        }
                    }

                    document.querySelector('.FileListOutShow').append(FileItem)
                }

            }

        }
    }

    SetTotalnum()

}
function ShowToast(text,time=3000){
    let toast=document.createElement('div')
    toast.innerHTML='<div><div class="drive-toast"><div><div class="drive-toast-notice"><div class="drive-toast-notice-content"><div class="drive-toast-custom-content drive-toast-info"><div></div><span><div class="content-wrapper--B7mAG" style="margin-left: 20px; " data-desc="false"><div class="title-wrapper--3bQQ2">'
        + text+
        '<div class="desc-wrapper--218x0"></div></div></div></span></div></div></div></div></div></div>'
    document.querySelector('body').append(toast)
    setInterval(function(){toast.remove() }, time);

}
function RefreshToken(){
    if(accesstoken!=='')
    {
        return;
    }
    GM_xmlhttpRequest({
        url:"https://websv.aliyundrive.com/token/refresh",
        method :"POST",
        data:'{"refresh_token": "'+JSON.parse(localStorage.getItem('token')).refresh_token+'"}',
        headers: {
            "Content-type": "application/json;charset=utf-8",
        },
        onload:function(xhr){
            var json = JSON.parse(xhr.responseText);
            accesstoken=json.access_token
            if(accesstoken!==undefined&&accesstoken!='')
            {

            }
            else{
                ShowToast('解析Acess_Token失败!')

            }
        }
    });
}
function CreateShareClip(tempobj){
    ShowFileObj.name=tempobj.name;
    ShowFileObj.content_hash=tempobj.content_hash;
    ShowFileObj.size=tempobj.size;
    ShowFileObj.content_type=tempobj.content_type;
    ShowFileObj.file_id=tempobj.file_id;
    let ret=confirm('文件名:'+ShowFileObj.name+'\n校验值:'+ShowFileObj.content_hash+'\n文件大小:'+ShowFileObj.size+'\n'+
                    '点击确定自动添加分享码到剪辑版');
    if(ret==true)
    {
        try
        {

            GM_setClipboard(GetFileSha1Encr(tempobj))
            alert('文件已设置到剪辑版！')
        }
        catch(err)
        {

            alert('文件名字可能存在特殊关键字，请改名重试')
        }

    }
}
function StartListner(){


    setInterval(function(event) {
        if(CreateSaveBtn===false)
        {
            let header=document.querySelector('[class|=header]')
            if(header!==null&&header.childElementCount===2&&document.querySelector('[class|=header]').children[1].innerText.indexOf('提取分享码')===-1){
                let GenerateShareBtn=document.createElement('div')
                GenerateShareBtn.innerHTML='<div class="button-wrapper--1UkG6" data-type="primary" data-spm-anchor-id="0.0.0.i3.35676c7515rlzj" style="margin-left: 5px;"margin-right:5px;">提取分享码</div>'
                GenerateShareBtn.onclick=function(){
                    var text=prompt("请输入分享码","");
                    if(text==null)
                    {
                        return;}
                    try{
                        text=GetDecrText(text)
                    }catch(err){
                        alert('解析提取码失败！')
                        return;
                    }
                    if(text.content_hash==undefined)
                    {
                        alert('提取码不正确！')
                    }
                    else{
                        if(accesstoken=='')
                        {
                            alert('访问Token异常！')
                            return;
                        }
                        let useruid=JSON.parse(localStorage.getItem('token')).default_drive_id
                        let uploadtext='{"drive_id":"'+useruid+'","part_info_list":[{"part_number":1}],"parent_file_id":"'+parent_file_id+'","name":"'+text.name+'","type":"file","check_name_mode":"auto_rename","size":'+text.size+',"content_hash":"'+text.content_hash+'","content_hash_name":"sha1"}'


                        GM_xmlhttpRequest({
                            url:"https://api.aliyundrive.com/v2/file/create",
                            method :"POST",
                            data:uploadtext,
                            headers: {
                                "Content-type": "application/json;charset=utf-8",
                                "Authorization": accesstoken
                            },
                            onload:function(xhr){
                                var json = JSON.parse(xhr.responseText);
                                if(json.rapid_upload==true)
                                {
                                    alert("提取文件成功！")
                                    unsafeWindow.location.reload();
                                }
                                else{
                                    alert("提取文件失败！")
                                }
                            }
                        });

                    }

                }
                let GenerateShow=false
                let GenerateFileOut=document.createElement('div')
                let GenerateDialogShow;
                let GenerateFileinDialogShow;
                GenerateFileOut.innerHTML='<div class="button-wrapper--1UkG6" data-type="primary" style="margin-left: 5px;"margin-right:5px;">多文件分享</div>'
                GenerateFileOut.onclick=function(){
                    if(GenerateFileInShow==true)
                    {
                        Uploadlist=[]
                        GenerateFileInShow=false;
                        GenerateFileinDialogShow.remove()
                    }
                    if(GenerateShow==true)
                    {
                        return;
                    }
                    GenerateShow=true
                    GenerateDialogShow=document.createElement('div')
                    GenerateDialogShow.innerHTML=`<div class="ant-modal-content" style=" width: 500px;z-index: 99;position: absolute;top: 50px;left: calc(50% - 250px);"><div class="ant-modal-header"><div class="ant-modal-title" id="rcDialogTitle0"><div class="icon-wrapper--3dbbo" style="display: flex;align-items: center;justify-content: space-between;"><span>文件批量导出</span>    <span data-role="icon" data-render-as="svg" data-icon-type="PDSClose" class="close-icon--33bP0 icon--d-ejA " style="    cursor: pointer;"><svg viewBox="0 0 1024 1024"><use xlink:href="#PDSClose"></use></svg></span></div></div></div><div class="ant-modal-body"><div class=""><div class="cover-wrapper--2UqQb" style="    flex-direction: column;    height: 100px;" data-spm-anchor-id="0.0.0.i6.54a06c75eRjwhJ"><div>多文件批量导出 <span style="    color: blue;"> </span></div><div> <span style="    color: blue;" data-spm-anchor-id="0.0.0.i7.54a06c75eRjwhJ"> </span> <span style="    color: blue;"> <!--        span--></span></div><div> <span style="    color: red;" data-spm-anchor-id="0.0.0.i7.54a06c75eRjwhJ"> </span><span style="    color: blue;"><!--        span--></span></div><div></div></div><div style="background: var(--background_secondary_blur);display: flex;align-items: center;padding: 0px 50px;justify-content: space-evenly;padding-bottom: 10px;"><div>搜索文件</div><input type="text" name="SearchMulFile" data-spm-anchor-id="0.0.0.i1.35676c753HbmyV" value=""><div class="button-wrapper--1UkG6" data-type="primary" data-spm-anchor-id="0.0.0.i3.35676c7515rlzj" style="margin-left: 5px;" margin-right:5px;"="">搜索</div>                                                                                                                                                   </div><div class="FileListOutShow            " style="    height: calc(100% - 150px);    overflow-y: scroll;    padding: 5px 20px;    max-height: 300px;" data-spm-anchor-id="0.0.0.i7.54a06c75uw7F5E">    </div><div style="display: flex;flex-direction: row-reverse;margin-top: 10px;align-items: center;"><div class="button-wrapper--1UkG6" data-type="primary" data-spm-anchor-id="0.0.0.i3.35676c7515rlzj" style="margin-left: 5px;" margin-right:5px;"="">导出</div><div class="button-wrapper--1UkG6" data-type="primary" data-spm-anchor-id="0.0.0.i3.35676c7515rlzj" style="margin-left: 5px;" margin-right:5px;"="">全部选择</div>                                                                                                                                                   <div class="SelectNumShow">当前共:<span>330</span>项</div></div>                                                                                                                                                   </div></div></div>`
                    GenerateDialogShow.onclick=function(event){
                        //多选关闭删除
                        if(event.target.outerHTML.indexOf('#PDSClose')!=-1)
                        {
                            GenerateShow=false;
                            GenerateDialogShow.remove()

                            return;
                        }
                        if(event.target.outerHTML.indexOf('全部选择')!=-1)
                        {
                            document.querySelectorAll('.FileListOutShow >div').forEach(item=>{
                                SetSelectItem(item,true)
                            })
                            return;
                        }
                        if(event.target.outerHTML.indexOf('搜索')!=-1)
                        {
                            SearchFileMulInsert(document.querySelector('[name="SearchMulFile"]').value);
                            return;
                        }
                        if(event.target.outerHTML.indexOf('导出')!=-1)
                        {
                            let outtext=' '
                            document.querySelectorAll('.FileListOutShow >div').forEach(item=>{
                                if(item.checkbox==true){
                                    outtext=outtext+item.name+'\n'+item.date+'\n'
                                }
                            })
                            download('导出文件成功By:油猴中文网.txt',outtext)
                            return;
                        }

                    }
                    document.querySelector('body').append(GenerateDialogShow)
                    SearchFileMulInsert('')
                }
                let GenerateFileIn=document.createElement('div')

                GenerateFileIn.innerHTML='<div class="button-wrapper--1UkG6" data-type="primary" style="margin-left: 5px;"margin-right:5px;">多文件提取</div>'
                GenerateFileIn.onclick=function(){
                    if(GenerateShow===true)
                    {
                        GenerateShow=false;
                        GenerateDialogShow.remove()
                    }
                    //导入文件
                    if(GenerateFileInShow==true)
                    {
                        return;
                    }
                    GenerateFileInShow=true
                    GenerateFileinDialogShow=document.createElement('div')
                    unsafeWindow.ReadFileList=ReadFileList
                    GenerateFileinDialogShow.innerHTML=`<div class="ant-modal-content" style=" width: 500px;z-index: 99;position: absolute;top: 50px;left: calc(50% - 250px);"><div class="ant-modal-header"><input id="uploadfile" onchange="ReadFileList(this)" type="file"  style="display: none;"><div class="ant-modal-title" id="rcDialogTitle0"><div class="icon-wrapper--3dbbo" style="display: flex;align-items: center;justify-content: space-between;"><span>文件批量导入(请勿导入时关闭)</span>    <span data-role="icon" data-render-as="svg" data-icon-type="PDSClose" class="close-icon--33bP0 icon--d-ejA " style="    cursor: pointer;"><svg viewBox="0 0 1024 1024"><use xlink:href="#PDSClose"></use></svg></span></div></div></div><div class="ant-modal-body"><div class=""><div class="cover-wrapper--2UqQb" style="    flex-direction: column;    height: 100px;" data-spm-anchor-id="0.0.0.i6.54a06c75eRjwhJ"><div>多文件批量导出<span style="    color: blue;"> </span></div><div> <span style="    color: blue;" data-spm-anchor-id="0.0.0.i7.54a06c75eRjwhJ"> </span> <span style="    color: blue;"> <!--        span--></span></div><div> <span style="    color: red;" data-spm-anchor-id="0.0.0.i7.54a06c75eRjwhJ"> </span><span style="    color: blue;"><!--        span--></span></div><div></div></div><div class="FileListOutShow            " style="    height: calc(100% - 150px);    overflow-y: scroll;    padding: 5px 20px;    max-height: 300px;" data-spm-anchor-id="0.0.0.i7.54a06c75uw7F5E"></div><div style="display: flex;flex-direction: row-reverse;margin-top: 10px;align-items: center;"><div class="button-wrapper--1UkG6" data-type="primary" data-spm-anchor-id="0.0.0.i3.35676c7515rlzj" style="margin-left: 5px;" margin-right:5px;"="">开始提取</div><div class="button-wrapper--1UkG6" data-type="primary" data-spm-anchor-id="0.0.0.i3.35676c7515rlzj" style="margin-left: 5px;" margin-right:5px;"="">导入文件</div>                                                                                                                                                   <div class="SelectNumShow">当前已选:<span>0</span>项</div></div>                                                                                                                                                   </div></div></div>`
                    GenerateFileinDialogShow.onclick=function(event){
                        //多选关闭删除
                        if(event.target.outerHTML.indexOf('#PDSClose')!=-1)
                        {
                            Uploadlist=[]
                            GenerateFileInShow=false;
                            GenerateFileinDialogShow.remove()

                            return;
                        }
                        if(event.target.outerHTML.indexOf('导入文件')!=-1)
                        {
                            document.getElementById("uploadfile").click();


                            return;
                        }
                        if(event.target.outerHTML.indexOf('开始提取')!=-1)
                        {
                            alert('正在开始上传，请勿重复点击！')
                            StartAllFile()

                            return;
                        }

                    }
                    document.querySelector('body').append(GenerateFileinDialogShow)

                }
                document.querySelector('[class|=header]').children[1].append(GenerateShareBtn)
                document.querySelector('[class|=header]').children[1].append(GenerateFileOut)
                document.querySelector('[class|=header]').children[1].append(GenerateFileIn)
            }

        }
        //info-wrapper--
        let formlist=document.querySelectorAll('.ant-modal-body')
        for(let forminedx=0;forminedx<formlist.length;forminedx++){
            let form=formlist[forminedx]
            if(form.offsetWidth==0)
            {
                return;}


            if(form!=null&&form.innerHTML.indexOf('详细信息')!=-1)
            {
                if(form.innerHTML.indexOf('创建时间')!=-1)
                {
                    let img=document.querySelector('.ant-modal-body img')
                    if(img!==null&&img.alt==="folder")
                    {
                        if(document.querySelector('.ant-modal-body').innerText.indexOf('生成分享')!==-1)
                        {
                            document.querySelector('.ant-modal-body [data-type="primary"]').remove()
                        }
                        return;

                    }


                    if(form.innerHTML.indexOf('生成分享')==-1)
                    {
                        let GenerateFileDate=document.createElement('div')
                        GenerateFileDate.innerHTML='<div class="button-wrapper--1UkG6" data-type="primary">生成分享</div>'
                        GenerateFileDate.onclick=function(){
                            let name=document.querySelector('[class|=title-wrapper]').innerText
                            for(let index=0;index<FileList.length;index++){
                                let templist=FileList[index]
                                for(let innerindex=0;innerindex<templist.list.length;innerindex++)
                                {
                                    let tempobj=templist.list[innerindex]

                                    if(tempobj.type!=='folder')
                                    {
                                        if(tempobj.name===name)
                                        {
                                            CreateShareClip(tempobj)
                                            return;
                                        }

                                    }

                                }

                            }
                        }
                        let WrapperList=document.querySelectorAll('[class|=group-wrapper]')
                        WrapperList[WrapperList.length-1].append(GenerateFileDate)

                    }




                }


            }

        }
    }, 1500);


}
if(unsafeWindow.location.href.indexOf('aliyundrive.com/drive')!=-1)
{
    function addXMLRequestCallback(callback){
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            XMLHttpRequest.callbacks.push( callback );
        } else {
            XMLHttpRequest.callbacks = [callback];
            oldSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(){
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                console.log(this)
                if(arguments[0].indexOf!=undefined)
                {
                    if(arguments[0].indexOf('marker')==-1)
                    {
                        this.CreatFirstList=true
                    }else if(FileList.length!=0&&arguments[0].indexOf(FileList[FileList.length-1].name)!==-1){
                        this.NextList=true

                    }
                    console.log('arguments',arguments[0].indexOf,arguments)
                    if(arguments[0].indexOf('parent_file_id')!==-1)
                    {
                        parent_file_id=JSON.parse(arguments[0]).parent_file_id
                        console.log('搜索到了参数',parent_file_id)
                    }
                }
                //FileList=[{name:item.next_marker,list:item.items}]
                oldSend.apply(this, arguments);
            }
        }
    }
    addXMLRequestCallback( function( xhr ) {
        //CreateBanList
        xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                console.log('输出数据',xhr)
                if(xhr.responseURL==="https://websv.aliyundrive.com/token/refresh"){
                    accesstoken=JSON.parse(xhr.response).access_token

                }
                if(xhr.responseURL==="https://api.aliyundrive.com/v2/file/list")
                {
                    let quit=false;
                    document.querySelectorAll('.ant-modal-header').forEach((item)=>{
                        if(item.innerText.indexOf('移动')!==-1)
                        {
                            if(item.offsetWidth!==0)
                            {
                                quit=true
                            }

                        }
                    })
                    if(quit)
                    {
                        return;
                    }
                    let item=JSON.parse(xhr.response)
                    if(listurl===unsafeWindow.location.href)
                    {
                        if(xhr.CreatFirstList==true)
                        {
                            FileList=[{name:item.next_marker,list:item.items}]
                            filenum=item.items.length
                        }
                        else{
                            let Search=false;
                            FileList.forEach((item)=>{
                                if(item.name===item.next_marker)
                                {
                                    item.list=item.items
                                    Search=true
                                }
                            })
                            if(Search===false&&xhr.NextList==true)
                            {
                                FileList.push({name:item.next_marker,list:item.items})
                                filenum+=item.items.length
                            }
                        }
                    }
                    else{
                        listurl=unsafeWindow.location.href
                        FileList=[{name:item.next_marker,list:item.items}]

                        filenum=item.items.length
                    }
                    if(CreateListner===false)
                    {
                        StartListner()
                        CreateListner=true
                    }
                    RefreshToken()
                    ShowToast('已获取文件列表 数量为'+filenum+'(数字如不准请联系作者) By:天才少年李恒道')

                }
            }
        });

    });

}

if(unsafeWindow.location.href.indexOf('passport.aliyundrive.com/mini_login.htm')!=-1)
{
    let container=document.querySelector('#container');

    container.addEventListener("DOMNodeInserted", function(event) {
        if(username=='')
        {
            return}
        if(password=='')
        {
            return}

        let header=document.querySelector('.login-blocks')
        if(header===null)
        {
            return;
        }
        document.querySelector('.login-blocks').children[1].click()
        document.querySelector('#fm-login-id').value=username
        document.querySelector('#fm-login-password').value=password
        document.querySelector('.password-login').click()

    });



    return;
}








