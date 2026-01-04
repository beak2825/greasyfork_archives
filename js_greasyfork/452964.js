// ==UserScript==
// @name         EQ
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  导出问题
// @author       XB
// @match        http://10.110.75.46/*
// @match        http://10.110.75.47/*
// @match        http://100.19.5.34/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452964/EQ.user.js
// @updateURL https://update.greasyfork.org/scripts/452964/EQ.meta.js
// ==/UserScript==
const first = document;
let wait=[];
let timer=null;
let firstframe=null;
let startid=1;
let number=100;
let solvelist=[];
let solveindex=-1;
let step = 0;
let table=[];
function sleep(time){
 var timeStamp = new Date().getTime();
 var endTime = timeStamp + time;
 while(true){
 if (new Date().getTime() > endTime){
  return;
 }
 }
}
function select_option_checked(doc,selectId, checkValue){
 let select = doc.getElementById(selectId);
 for (let i = 0; i < select.options.length; i++){
 if (select.options[i].value === checkValue){
 select.options[i].selected = true;
 return true;
 }
 }
 return false;
 }
function get_url_extension( url ) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}
function get_url_name( url ) {
    const index = url.lastIndexOf('?');
    if(index===-1){
        return url.substring(url.lastIndexOf('/') + 1, url.length );
    }else{
        return url.substring(url.lastIndexOf('/') + 1, index );
    }
}
function downloadTXT(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
function download(href,name=null){
    let link = document.createElement('a');
    link.style.display="none";
    link.target="_blank";
    link.href=href;
    if(name)
        link.download=name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function getBlob(href){
    return new Promise(resolve =>{
        const xhr = new XMLHttpRequest();
        xhr.open('POST',href,true);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.responseType='blob';
        xhr.onload=()=>{
            if(xhr.status === 200){
                resolve(xhr.response);
            }
        };
        xhr.send();
    });
}
function saveAs(blob,name){
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    link.click();
}
function downloadFile(href,name){
    getBlob(href).then(
        blob =>{
            saveAs(blob,name);
        }
    );
}

function refreshsolvelist(){
    const tmp = first.getElementsByTagName('iframe');
    const tabs = first.getElementsByClassName('tabs-inner');
    if(tmp.length>2&&solveindex>=0){
        const frame = tmp[solveindex+2];
        let input="#questionDescribeInput";
        try{
            if(frame.contentWindow.$("#questionDescribeInput").text()===''){
                if(frame.contentWindow.$("#questionDetail").text()===''){
                    return;
                }
                input="#questionDetail";
            }
            if(step===1){
                frame.contentWindow.$("#developerConfirmInput").val('周青-研发三处,');
                frame.contentWindow.$("#developerConfirmInputId").val('zhouqing01');
                frame.contentWindow.developerConfirmSuggestion_Editor.setContent("add");
                frame.contentWindow.$("#developerConfirmSubmitBtn").click();
                //frame.contentWindow.$("#developerConfirmInput").val('陈相晨-产品研发三处');
                //frame.contentWindow.$("#developerConfirmInputId").val('chenxiangchen');
                //frame.contentWindow.$("input[name='developerConfirmNextStep']").val("others");
                //frame.contentWindow.developerConfirmSuggestion_Editor.setContent("BMC使用命令模拟BIOS传输正常，确认未BIOS未正确传递信息");
            }else if(step===2){
                frame.contentWindow.$("#firstReason").val(3047);
                frame.contentWindow.$("#secondReason").val(3051);
                frame.contentWindow.$("#introducePhase").val(2176);
                frame.contentWindow.$("#questionLiabler_0_Input").val('周青-研发三处,');
                frame.contentWindow.$("#questionLiabler_0_InputId").val("zhouqing01");
                const str = '<p style="white-space: normal;">---------------------------------------------------------------------</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;"><span style="font-weight: 700;">根本原因描述</span>：</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;">功能未完善</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;">---------------------------------------------------------------------</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;"><span style="font-weight: 700;">解决方案--所做改动</span>：</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;">功能已完善</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;"><span style="font-weight: 700;">解决方案--改动影响</span>(若无其他影响，可写无)：</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;">无</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;">---------------------------------------------------------------------</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;"><span style="font-weight: 700;">回归验证目标版本</span>：</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;">'+
                      '1.04'+
                      '</p><p style="font-variant-numeric: normal; font-variant-east-asian: normal; white-space: normal;">---------------------------------------------------------------------</p><p><br style="white-space: normal;"/></p><p><br/></p>';
                frame.contentWindow.UM.getEditor("questionLiabler_0_Editor").setContent(str);
                frame.contentWindow.questionLiabler_0_SubmitBtn.click();
                //modal bootstrap-dialog type-primary fade size-small in
            }else if(step===3){
            }

        }catch (e){
            return;
        }
        if(solveindex===0){
            clearInterval(timer);
            if(step===3){
                step=0;
            }
        }
        tabs[solveindex+1].click();
        solveindex--;
    }
}
function refreshlist(){
    const tmp = first.getElementsByTagName('iframe');
    if(tmp.length>2){
        const frame = tmp[length-1];
        let inputDetail="#questionDescribeInput";
        try{
            if(frame.contentWindow.$("#questionDescribeInput").text()===''){
                if(frame.contentWindow.$("#questionDetail").text()===''){
                    return;
                }
                inputDetail="#questionDetail";
            }
            const id=tmp.length-3+startid;

            table.push({
                i:id,
                id:frame.contentWindow.$("#questionId").val(),
                t:frame.contentWindow.$("#questionTitle").val(),
                de:frame.contentWindow.$(inputDetail)[0].innerText.replaceAll(",","，").replaceAll("\t","    ").replaceAll("\n","<br>"),
                blank1:"",
                blank2:"",
                blank3:"",
                blank4:"",
                blank5:"",
                blank6:"",
                blank7:"",
                type:"待定位",
                certify:"",
                solution:"",
                lc:"",
                s:frame.contentWindow.$("#severityInput option:selected").text(),
                p:frame.contentWindow.$("#priorityInput option:selected").text(),
                o:frame.contentWindow.$("#occurFrequencyInput option:selected").text(),
                di:frame.contentWindow.$("#discoverStageInput option:selected").text(),
                status:"Assigned",
                first:frame.contentWindow.$("#firstGradeCategory option:selected").text(),
                second:frame.contentWindow.$("#secondGradeCategory option:selected").text(),
                u:frame.contentWindow.$("#submitUserName").val()
            });

            const imgs=frame.contentWindow.$(inputDetail).find('img');
            const files=frame.contentWindow.$("#fileList").find('a');
            console.log(imgs);
            console.log(files);
            let i=1;
            for(let img of imgs){
                download(img.src,id+'.'+i+'.'+get_url_extension(img.src));
                ++i;
            }
            for(let file of files){
                let url = file.getAttribute('onclick');
                const fileid = url.match(/downloadFile\(\'(.*)\',(.*)\)/)[1];
                const link= "/ibms/file.do/downloadFile?fileId="+fileid;
                download(link)
                //downloadFile(link,id+'.'+i+'.'+file.innerText);
                if(url!==null){
                    const tabs = first.getElementsByClassName('tabs-inner');
                    //wait.push(id+" "+tabs[tmp.length-1].innerText);
                    wait.push(id+'.'+i+'.'+file.innerText);
                }
                ++i;
            }
        }catch (e){
            return;
        }
        $("#tabs").tabs('close',tmp.length-1);
        if(first.getElementsByTagName('iframe').length<=2){
            clearInterval(timer);
            alert(JSON.stringify(wait));
            wait.length=0;
            console.log(table);
            let text="<html><head><title>潮动力BUG</title></head><body><table>";
            for(const tri in table){
                text+="<tr>";
                const tr = table[table.length-tri-1];
                for(const td in tr){
                    text+="<td>"+tr[td]+"</td>";
                }
                text+="</tr>";
            }
            text+="</table></body></html>";
            downloadTXT("BUGLIST "+(new Date()).toLocaleDateString()+".html",text);
            table.length=0;
        }
    }
}
function refresh(){
    const tmp = first.getElementsByTagName('iframe');
    let toolbar = null;
    if(tmp.length>1){
        firstframe=tmp[1];
        try{
            toolbar = firstframe.contentDocument.getElementsByClassName('toolbar')[0];
            firstframe.contentDocument.getElementById('checkFlowStepBtn').style="width:50px;margin-right:0px";
            firstframe.contentDocument.getElementById('selectBugBtn').style="width:50px;margin-right:0px";
            firstframe.contentDocument.getElementById('resetBtn').style="width:50px;margin-right:0px";
            const redistributeBtn = firstframe.contentDocument.getElementById('redistributeBtn');
            if(redistributeBtn!==null){
                redistributeBtn.style="width:90px;margin-right:0px";
            }
            firstframe.contentDocument.getElementById('exportQuestionBtn').style="width:90px;margin-right:0px";

            let obbtn = firstframe.contentDocument.createElement('button');
            obbtn.className="btn btn-success";
            obbtn.id="eqBtn";
            obbtn.style="width:60px;margin-right:0px";
            let obi=firstframe.contentDocument.createElement('i');
            obi.className="fa fa-download";
            obi.style="padding-right:3px;";
            let obs=firstframe.contentDocument.createElement('span');
            //obs.setAttribute("data-locale","button_download_excel");
            obs.innerText="附件";
            obbtn.appendChild(obi);
            obbtn.appendChild(obs);
            obbtn.onclick=function(){eq()};

            let input=firstframe.contentDocument.createElement('input');
            input.type="text";
            input.placeholder="起始编号";
            input.id="startid";
            input.className="bootstrap-table-head-params header-input";
            input.style="width: 60px;";

            let input1=firstframe.contentDocument.createElement('input');
            input1.type="text";
            input1.placeholder="个数";
            input1.id="number";
            input1.className="bootstrap-table-head-params header-input";
            input1.style="width: 50px;";

            let input2=firstframe.contentDocument.createElement('input');
            input2.type="text";
            input2.placeholder="解bug序列";
            input2.id="solvestr";
            input2.className="bootstrap-table-head-params header-input";
            input2.style="width: 60px;";

            let solvebtn = firstframe.contentDocument.createElement('button');
            solvebtn.className="btn btn-success";
            solvebtn.id="solveBtn";
            solvebtn.style="width:40px;margin-right:0px";
            let solvebtni=firstframe.contentDocument.createElement('i');
            solvebtni.className="fa fa-check-circle";
            solvebtni.style="padding-right:3px;";
            let solvebtns=firstframe.contentDocument.createElement('span');
            solvebtns.innerText="①";
            solvebtn.appendChild(solvebtni);
            solvebtn.appendChild(solvebtns);
            solvebtn.onclick=function(){solve(1)};

            let solvebtn2 = firstframe.contentDocument.createElement('button');
            solvebtn2.className="btn btn-success";
            solvebtn2.id="solveBtn";
            solvebtn2.style="width:40px;margin-right:0px";
            let solvebtni2=firstframe.contentDocument.createElement('i');
            solvebtni2.className="fa fa-check-circle";
            solvebtni2.style="padding-right:3px;";
            let solvebtns2=firstframe.contentDocument.createElement('span');
            solvebtns2.innerText="②";
            solvebtn2.appendChild(solvebtni2);
            solvebtn2.appendChild(solvebtns2);
            solvebtn2.onclick=function(){solve(2)};

            let solvebtn3 = firstframe.contentDocument.createElement('button');
            solvebtn3.className="btn btn-success";
            solvebtn3.id="solveBtn";
            solvebtn3.style="width:40px;margin-right:0px";
            let solvebtni3=firstframe.contentDocument.createElement('i');
            solvebtni3.className="fa fa-check-circle";
            solvebtni3.style="padding-right:3px;";
            let solvebtns3=firstframe.contentDocument.createElement('span');
            solvebtns3.innerText="③";
            solvebtn3.appendChild(solvebtni3);
            solvebtn3.appendChild(solvebtns3);
            solvebtn3.onclick=function(){solve(3)};

            toolbar.appendChild(input);
            toolbar.appendChild(input1);
            toolbar.appendChild(obbtn);
            toolbar.appendChild(input2);
            toolbar.appendChild(solvebtn);
            toolbar.appendChild(solvebtn2);
            toolbar.appendChild(solvebtn3);
        }catch (e){
            return;
        }
        clearInterval(timer);
    }else{
        return;
    }
}

function eq(){
    const list = firstframe.contentDocument.getElementsByClassName('href-pointer');
    startid=(firstframe.contentWindow.$('#startid').val())*1;
    number=(firstframe.contentWindow.$('#number').val())*1;
    for(let i=0;i<list.length&&i<number*3;i+=3){
        const questionId = list[i].getAttribute('onclick').match(/questionDetail\(\'(.*)\',\'(.*)\',\'(.*)\'\)/)[1];
        //const url = "bugManage/bugQuestionDetail2.html?questionId="+questionId;
        //parent.addTab(questionId,url);
        firstframe.contentWindow.questionDetail(questionId,questionId,'assign')
        //const tmp = first.getElementsByTagName('iframe');
        //let secondframe = tmp[2+i/2];
        //secondframe.setAttribute('tab',2+i/2);
        //secondframe.id="i"+(2+i/2);
        //$(secondframe).ready(function(){
            //console.log(secondframe);
        //const imgs=secondframe.contentWindow.$('#questionDetail').find('img');
        //secondframe.contentWindow.$("#tabs").tabs('close',2);
        //});
    }
    clearInterval(timer);
    timer=setInterval(() => {
        refreshlist();
    }, 1000);
}

function solve(stepi){
    //const list = firstframe.contentDocument.getElementsByClassName('href-pointer');
    const solvestr=(firstframe.contentWindow.$('#solvestr').val());
    solvelist = solvestr.split("ISU").map(el => el.trim()).filter(item => item.trim() != '');
    solveindex = solvelist.length-1;
    //alert(JSON.stringify(list));
    for(let i=0;i<solvelist.length;++i){
        firstframe.contentWindow.questionDetail("ISU"+solvelist[i],"ISU"+solvelist[i],'assign');
    }
    step=stepi;
    clearInterval(timer);
    timer=setInterval(() => {
        refreshsolvelist();
    }, 1000);
}

(function() {
    'use strict';
    clearInterval(timer);
    timer=setInterval(() => {
        refresh();
    }, 1000);
    //toolbar.appendChild();
    // Your code here...
})();