// ==UserScript==
// @name         南工大计算机教学管理系统作业提交助手
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  优化南工大计算机教学管理系统是作业提交功能
// @author       PairZhu
// @include      http://10.3.41.240/tms/HomeworkUp/Student/UploadHomework.aspx*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/397854/%E5%8D%97%E5%B7%A5%E5%A4%A7%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%95%99%E5%AD%A6%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E4%BD%9C%E4%B8%9A%E6%8F%90%E4%BA%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397854/%E5%8D%97%E5%B7%A5%E5%A4%A7%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%95%99%E5%AD%A6%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E4%BD%9C%E4%B8%9A%E6%8F%90%E4%BA%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


var force_same=true;//是否强制要求文件名与作业名一致



(function() {
  //不要在意变量的命名方式2333
  //
  //  
  //获取一些需要的父元素
  let father=document.getElementById("ctl00_Main_tbHwUp").getElementsByTagName('tbody')[0];
  let parent=document.querySelector("#aspnetForm > table:nth-child(6) > tbody > tr > td:nth-child(1)");
  let my_e;
  let temp=document.createElement('p');
  temp.innerHTML='收起'
  temp.style="background-color:Green;width:30px;margin-bottom:0;margin-left:5px;text-align:center;cursor:pointer"
  temp.onselectstart=()=>false;
  temp.onclick=(e)=>{
    if(e.toElement.innerText==="收起")
    {
      e.toElement.innerText="展开";
      e.toElement.style.backgroundColor='';
      my_e=document.querySelector("#aspnetForm > table:nth-child(6) > tbody > tr > td:nth-child(1)").removeChild(document.getElementById("myelement"));
    }
    else
    {
      e.toElement.innerText="收起";
      e.toElement.style.backgroundColor="Green"
      my_e=document.querySelector("#aspnetForm > table:nth-child(6) > tbody > tr > td:nth-child(1)").appendChild(my_e);
    }
  }
  parent.appendChild(temp);
  
  temp=document.createElement('div');
  temp.id='myelement';
  temp.style="background-color:Green;width:150px;margin-left:5px;margin-top:0;padding-top: 2px;padding-bottom: 8px;cursor:default"
  temp.onselectstart=()=>false;
  parent.appendChild(temp);
  parent=document.getElementById('myelement');
  
  
  
  //检测提交的文件是否错误
  if(force_same){
    let the_form=document.getElementById('aspnetForm');
    the_form.onsubmit= ()=>{
      for(var i=0;i<father.children.length;i+=5)
      {
        father.children[i].children[1].style="background-color:#FFFFFF";
        if(father.children[i+3].children[1].children[0].value==="")
          continue;
        if(father.children[i+3].children[1].children[0].value!="C:\\fakepath\\"+father.children[i].children[1].innerText+father.children[i].children[2].innerText)
        {
          alert(`作业：${father.children[i].children[1].innerText} 文件选择错误`);
          father.children[i].children[1].style="background-color:#FF0000";
          return false;
        }
      }
      return true;
    }
  }
  
  
  //隐藏已提交过的作业
  temp=document.createElement('td');
  temp.colspan="4";
  father.appendChild(temp);
  temp=document.createElement('p');
  temp.innerHTML='以下为已完成的作业,已自动隐藏,点击按钮 隐藏/显示 被隐藏的作业';
  temp.style="margin-left:5px;height:60px;width:140px";
  parent.appendChild(temp);
  let elearray={};
  
  
  function allshow(e){
    let allbtn=parent.getElementsByClassName("mybtn");
    e.value="hide";
    e.innerText="全部隐藏";
    for(let i of allbtn)
    {
      e_insert(elearray[i.value],i);
    }
  }
  function allhide(e)
  {
    let allbtn=parent.getElementsByClassName("mybtn");
    e.value="show";
    e.innerText="全部显示";
    for(let i of allbtn)
      e_remove(elearray[i.value],i);
  }
  function e_insert(e,prop_e){
    if(e.exist===true)
      return;
    prop_e.style.backgroundColor="#FFFF00";
    e.exist=true;
    let i=0;
    while(i<father.children.length && Number(father.children[i].children[0].innerText)<Number(e.ele[0].children[0].innerText))
    {
      i+=5;
      if(i>=father.children.length)
      {
        for(let j of e.ele)
          father.appendChild(j);
        return;
      }
    }
    for(let j of e.ele)
    {
      father.insertBefore(j,father.children[i]);
      ++i;
    }
  }
  function e_remove(e,prop_e){
    if(e.exist===false)
      return;
    prop_e.style.backgroundColor="#DDDDDD";
    e.exist=false;
    for(let j of e.ele)
      father.removeChild(j);
  }
  function ele_change(e,prop_e){
    if(e.exist==false)
    {
      e_insert(e,prop_e);
    }
    else
    {
      e_remove(e,prop_e);
    }
  }
  function allsubmit(){
    let success_cnt=0,fail_cnt=0,cnt=0;
    allshow({});
    let toappend=[];
    for(let j of document.getElementById('hiddenFile').files)
    {
      for(var i=0;i<father.children.length;i+=5)
      {
        if(j.name===father.children[i].children[1].innerText+father.children[i].children[2].innerText)
        {
          toappend.push([father.children[i+3].children[1].children[0].name,j,father.children[i+3].children[1].children[1].name,"开始上传"]);
          ++cnt;
          father.children[i+3].children[1].removeChild(father.children[i+3].children[1].children[0]);
        }
      }
    }
    for(let i of toappend)
    {
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post','http://202.119.250.105/tms/HomeworkUp/Student/UploadHomework.aspx',false)
      let formdata=new FormData(document.getElementById("aspnetForm"))
      formdata.append(i[0],i[1]);
      formdata.append(i[2],i[3]);
      xhr.send(formdata);
      if(xhr.status==200 && xhr.responseText.indexOf("alert('作业已成功上传!')")!=-1)
        ++success_cnt;
      else
        ++fail_cnt;
    }
    alert(`识别出${cnt}个作业，上传成功${success_cnt}个，上传失败${fail_cnt}个`);
    window.location.replace("http://202.119.250.105/tms/HomeworkUp/Student/UploadHomework.aspx");
  }
  
  
  tempe=document.createElement('button');
  tempe.innerText='全部显示';
  tempe.value="show";
  tempe.type='button';
  tempe.style="height:30px;width:140px;margin-left:5px;cursor:pointer";
  tempe.onclick=(e)=>{(e.toElement.value==='show')?allshow(e.toElement):allhide(e.toElement)};
  parent.appendChild(tempe);
  tempe=document.createElement('br');
  parent.appendChild(tempe);
  tempe=document.createElement('br');
  parent.appendChild(tempe);
  let cnt=0;
  for(var i=0;i<father.children.length;i+=5)
  {
    if(father.children[i].children[4].innerHTML.indexOf('已于')!=-1)
    {
      if(father.children[i].children[4].innerHTML.indexOf('成功提交')!=-1 || father.children[i].children[4].innerHTML.indexOf('成功上传')!=-1)
      {
        let temparray=[];
        temparray.push(father.removeChild(father.children[i]));
        temparray.push(father.removeChild(father.children[i]));
        temparray.push(father.removeChild(father.children[i]));
        temparray.push(father.removeChild(father.children[i]));
        temparray.push(father.removeChild(father.children[i]));

        elearray[temparray[0].children[0].innerText]={ele:temparray, exist:false};
        let tempe=document.createElement('button');
        tempe.innerText=temparray[0].children[1].innerText;
        tempe.type='button';
        tempe.value=temparray[0].children[0].innerText;
        tempe.className='mybtn';
        tempe.onclick=(e)=>{ele_change(elearray[e.toElement.value],e.toElement);}
        if(cnt===0)
        {
          tempe.style="margin-left:5px"
        }
        parent.appendChild(tempe);
        ++cnt;
        if(cnt===3)
        {
          cnt=0;
          tempe=document.createElement('br');
          parent.appendChild(tempe);
        }
        i-=5;
      }
    }
  }
  temp=document.createElement('p');
  temp.innerHTML='<p style="margin:0;text-align: center;font-size: 10pt;color: #ff0000;font-family: 黑体">一键提交所有作业</p>'
                                                +'&nbsp;需文件名与作业题目要求的相同。仅文件名正确的文件会被提交,其余文件不受影响。'
                                                +'<p style="margin:0;text-align:center;color:Yellow">鼠标左键选择多个文件,右键选择文件夹<\p>';
  temp.style="height:80px;width:140px;margin-left:5px;text-align: center;font-size: 8pt";
  parent.appendChild(temp);
  tempe=document.createElement('input');
  tempe.id="hiddenFile";
  tempe.multiple=1;
  tempe.type='file';
  tempe.style.display="none";
  tempe.onchange=(e)=>{document.getElementById('fakefile').innerHTML=(e.srcElement.files.length===0)?"点此选择文件":`已选择${e.srcElement.files.length}个文件`;}
  parent.appendChild(tempe);
  tempe=document.createElement('button');
  tempe.innerHTML='点此选择文件';
  tempe.type='button';
  tempe.style="height:40px;margin-left:5px;width:140px"
  tempe.id="fakefile";
  tempe.onmousedown=(event)=>{
    if(event.button==1)
      return;
    let hiddenFile=document.getElementById('hiddenFile');
    if (event.button == 0)
      hiddenFile.webkitdirectory=false;
    if(event.button == 2)
      hiddenFile.webkitdirectory=true;
    hiddenFile.click()
}

  tempe.onclick=()=>{};
  parent.appendChild(tempe);
  tempe=document.createElement('button');
  tempe.innerHTML='一键提交';
  tempe.type='button';
  tempe.style="height:30px;margin-left:42.5px;width:60px;margin-top:10px;font-size:11px;cursor:pointer"
  tempe.id="fakefile";
  tempe.onclick=allsubmit;
  parent.appendChild(tempe);
  
})();
