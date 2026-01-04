// ==UserScript==
// @name         优化NTKO办公OA
// @license      AGPL License
// @namespace    https://penicillin.github.io/
// @version      20250122
// @description  无

// @include      http://192.168.1.65/SubModule/DocumentFlow/Style/Lease.aspx?*

// @include      http://192.168.1.65/SubModule/Index.aspx

// @include      http://192.168.1.65/SubModule/News/NewsBackList.aspx?*

// @include      http://192.168.1.65/SubModule/News/NewsEdit.aspx*
// @include      http://192.168.1.65/SubModule/News/NewsAdd.aspx?*

// @include      http://192.168.1.65/SubModule/News/NewsDetail.aspx*

// @include      http://192.168.1.65/OFFICE/ReadOffice.aspx*
// @include      http://192.168.1.65/Office/EditOffice.aspx*

// @downloadURL https://update.greasyfork.org/scripts/516790/%E4%BC%98%E5%8C%96NTKO%E5%8A%9E%E5%85%ACOA.user.js
// @updateURL https://update.greasyfork.org/scripts/516790/%E4%BC%98%E5%8C%96NTKO%E5%8A%9E%E5%85%ACOA.meta.js
// ==/UserScript==

var styleElement = document.createElement('style');
document.getElementsByTagName('body')[0].appendChild(styleElement);

function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    let context = "";
    if (r != null){
        context = decodeURIComponent(r[2]);
    }
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

//法律文件审查
if (document.URL.match(/Lease.aspx/)){
    let css = '* { height: auto !important;  margin-top: auto !important;  margin-bottom: auto !important;padding-top: 0px !important; };';
    let myStyle = document.createElement('style');
    myStyle.type = 'text/css';
    myStyle.textContent = css;
    document.head.appendChild(myStyle);

    let match=document.getElementById('lblb').innerText.match(/关于(.*)/);
    if(match){document.title=match[1] + "审查表"};
}

//免超时组件
if (document.URL.match(/SubModule\/Index.aspx/)){
    let REFRESH_URL = 'http://192.168.1.65/SubModule/LeftTree.aspx?DelegataFlag=';//保持网页存活的网址

    let styleElement = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    styleElement.append('.timeViewDIV {height: 2px; position: absolute; top: 0px; left: 0px; z-index: 99;border-radius:1px;}');

    let refreshTime=60*6;//刷新时间60*6
    let firstFlag=true;//首次进页面标识
    let refreshBeat=null;//刷新器
    let tipBeat=null;//登陆人员刷新器
    let fallcount=0

    //定时组件
    function time_Counter(intSec,todo_intime,todo_outime){
        let COUNT=intSec;
        refreshBeat = setInterval(
            () => {
                if (intSec > 0) {
                    todo_intime(intSec);//刷新进度条
                    intSec--;
                } else {
                    intSec=COUNT;
                    if(firstFlag==false){
                        try{
                            if(document.getElementById('refreshFrame').contentWindow.document.getElementById('depTree_1_span').innerText=='首页'){
                                todo_outime();//读回的内容正常，进入下次刷新
                                fallcount=0;
                            }
                        }catch(ERR){
                            if(fallcount<3){
                                fallcount ++;
                                todo_outime();//网页无法打开，或内容不正常，进入尝试
                            }else{
                                alert('网页无法访问，请刷新。')
                                clearInterval(tipBeat);//清除刷新器
                                clearInterval(refreshBeat);//清除刷新器
                            }
                        }

                    }else{
                        firstFlag=false;
                        todo_outime();
                    }
                    //刷新网页
                }
            },1000
        )
    }

    //免超时组件
    let iFrame
    try {
        iFrame = document.createElement('iframe');
    } catch (e) {
        iFrame = document.createElement('iframe');
    }
    iFrame.src = REFRESH_URL;
    iFrame.id = 'refreshFrame'
    iFrame.style.display = "none";
    document.body.appendChild(iFrame);

    let timeViewDIV = document.createElement('DIV');
    timeViewDIV.id='timeViewDIV';
    timeViewDIV.setAttribute('class', 'timeViewDIV');
    document.body.appendChild(timeViewDIV);

    function refshFrameFun(){
        let dateTime = new Date();
        iFrame.src = REFRESH_URL;
        iFrame.setAttribute('refreshTime', dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds());
    }
    function refshFrameTimeView(time){
        let i=time/refreshTime;
        timeViewDIV.style.width=time*100/refreshTime+'%';//改变倒计时指示器的宽度
        timeViewDIV.style.backgroundColor=`RGB(${255*(1-i)},${255*i},0)`;//改变倒计时指示器的RGB
    }
    time_Counter(refreshTime,refshFrameTimeView,refshFrameFun);

    //管理员背景色
    let admin=document.getElementsByClassName('menuText01')[1];
    if (undefined != admin &&admin.innerHTML.search('绍相')<0){
        let adminTip = document.createElement("input");
        adminTip.id = "adminTip";
        adminTip.value = "注意，当前用帐户为 " + document.getElementsByClassName('menuText01')[1].innerHTML;
        adminTip.style.background="#b03b93"
        adminTip.style.color="#FFFFFF"
        adminTip.style.position="fixed";
        adminTip.style.top="0px";
        adminTip.style.left='10%';
        adminTip.style.fontSize='15px';
        adminTip.style.height='21px';
        adminTip.style.width='80%';
        adminTip.style.borderRadius='29px';
        adminTip.style.textAlign='center';
        adminTip.style.fontWeight='bold';
        adminTip.style.zIndex='9999';
        tipBeat=setInterval(function(){adminTip.style.display=new Date().getSeconds()%2==0?"block":"none";},500);
        document.body.appendChild(adminTip);}

    //标题菜单替换
    let htxt=document.getElementById('lblurl_pnl').firstChild.nextSibling;
    let oldOA=document.getElementById('pnl_qt').childNodes[5];
    oldOA.firstElementChild.setAttribute('href','http://192.168.1.180');
    oldOA.firstElementChild.setAttribute('target','_blank');
    oldOA.firstElementChild.style.backgroundImage='url("data:image/jpeg;base64,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AAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0cAAAAGAAAAAAAAAAAAAAAkAAAASwAAAAkAdABvAHAATQBlAG4AdQAwADQAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAEsAAAAkAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAAkAAAAAFJnaHRsb25nAAAASwAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAAJAAAAABSZ2h0bG9uZwAAAEsAAAADdXJsVEVYVAAAAAEAAAAAAABudWxsVEVYVAAAAAEAAAAAAABNc2dlVEVYVAAAAAEAAAAAAAZhbHRUYWdURVhUAAAAAQAAAAAADmNlbGxUZXh0SXNIVE1MYm9vbAEAAAAIY2VsbFRleHRURVhUAAAAAQAAAAAACWhvcnpBbGlnbmVudW0AAAAPRVNsaWNlSG9yekFsaWduAAAAB2RlZmF1bHQAAAAJdmVydEFsaWduZW51bQAAAA9FU2xp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L25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA2LTI3VDEyOjMxOjA2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNi0yN1QxNDo1MTo0OSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0yN1QxNDo1MTo0OSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmOThiYWVjYS05NDdmLWIyNGYtOWNhYy1jZDAyMmNhZjY5NDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkFFRkYyNTMzNDNFMTFFRjlGNjBGNDlGRkE5MTU3QjgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyQUVGRjI1MzM0M0UxMUVGOUY2MEY0OUZGQTkxNTdCOCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkFFRkYyNTAzNDNFMTFFRjlGNjBGNDlGRkE5MTU3QjgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkFFRkYyNTEzNDNFMTFFRjlGNjBGNDlGRkE5MTU3QjgiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Zjk4YmFlY2EtOTQ3Zi1iMjRmLTljYWMtY2QwMjJjYWY2OTQ3IiBzdEV2dDp3aGVuPSIyMDI0LTA2LTI3VDE0OjUxOjQ5KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+4ADkFkb2JlAGRAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQEBAQEBAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgAJABLAwERAAIRAQMRAf/dAAQACv/EAaIAAAAGAgMBAAAAAAAAAAAAAAcIBgUECQMKAgEACwEAAAYDAQEBAAAAAAAAAAAABgUEAwcCCAEJAAoLEAACAQMEAQMDAgMDAwIGCXUBAgMEEQUSBiEHEyIACDEUQTIjFQlRQhZhJDMXUnGBGGKRJUOhsfAmNHIKGcHRNSfhUzaC8ZKiRFRzRUY3R2MoVVZXGrLC0uLyZIN0k4Rlo7PD0+MpOGbzdSo5OkhJSlhZWmdoaWp2d3h5eoWGh4iJipSVlpeYmZqkpaanqKmqtLW2t7i5usTFxsfIycrU1dbX2Nna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")';
    oldOA.firstElementChild.style.display='block';
    oldOA.firstElementChild.style.height='36px';
    oldOA.firstElementChild.style.width='75px';

    let temp = document.createElement('span');
    temp.innerHTML='旧版OA';
    temp.style.color='#FFF';
    temp.style.lineHeight='34px';
    temp.style.marginLeft='28px';
    oldOA.firstElementChild.firstElementChild.replaceWith(temp);

    document.getElementById('lblurl_pnl').replaceWith(htxt);
    document.getElementById('pnl_qt').replaceWith(oldOA);

    //移除末行版权声明
    document.getElementById('footer').remove();
}

//优化企业快讯管理页
if (document.URL.match(/NewsBackList.aspx/)){
    //导航第一页的“首页”改为刷新框架，隐藏“上一页”按钮
    if (document.getElementById('PageBar1_btnFirst').attributes.disabled != undefined){
        document.getElementById('PageBar1_btnFirst').attributes.removeNamedItem('disabled');
        document.getElementById('PageBar1_btnPrev').style.display='none';
        document.getElementById('PageBar1_btnFirst').setAttribute('onClick','document.location.href=document.location.href');
        document.getElementById('PageBar1_btnFirst').text='刷新';
    }

    function formatDate(dateStr){
        let tempStr=dateStr.split('/');
        return tempStr[0]+'年'+tempStr[1]+'月'+tempStr[2]+'日';
    }
    /**
//拆分表格标题行
let titleNode = document.getElementById('gvRegulationsList');
if (titleNode != null){
    titleNode.getElementsByTagName('th')[5].setAttribute('colspan','3')
}
**/
    let node='';
    let dateArray=[];
    let tempEl='';
    let MoonFlag='';
    let tempYM='';
    for(let i=2;i<17;i++){
        document.getElementById('gvRegulationsList_ctl'+(i<10?'0'+i:i)+'_lblLSSUC').parentElement.style.borderLeft='3px solid #3899ff';//左定界加粗蓝边框

        tempEl=document.getElementById('gvRegulationsList_ctl'+(i<10?'0'+i:i)+'_lblread')
        tempEl.nextElementSibling.remove();//移除“清空已阅”
        tempEl.remove();//移除“查看结果”

        node=document.getElementById('gvRegulationsList_ctl'+(i<10?'0'+i:i)+'_lbltitle');
        if (node == null){break;};
        //更换链接
        node.innerHTML=node.innerHTML.replace('NewsEdit.aspx','NewsDetail.aspx').replace('action=edit','');

        //清理拟稿人空格
        node.parentNode.nextSibling.innerHTML=node.parentNode.nextSibling.innerHTML.trim();

        //清理序号空格
        node.parentElement.parentElement.firstElementChild.innerHTML=node.parentElement.parentElement.firstElementChild.innerHTML.trim();

        //补全标题
        node.getElementsByTagName('a')[0].innerHTML=node.getAttribute('title');

        //拆分发布时间
        /*
    tempEl=node.parentNode.nextSibling.nextSibling;
    tempEl.parentNode.insertBefore(tempEl.cloneNode(true),tempEl);//保留原格式
    dateArray=tempEl.innerHTML.split(' ');//把内容按空格拆分为日期和时间数组
    tempEl.innerHTML=formatDate(dateArray[0]);
    tempEl.parentNode.insertBefore(tempEl.cloneNode(true),tempEl.nextSibling);
    tempEl.nextSibling.innerHTML=dateArray[1];
    */

        node.parentNode.nextSibling.nextSibling.style.borderRight='3px solid #3899ff';//右定界加粗蓝边框

        tempYM=node.parentNode.nextSibling.nextSibling.innerHTML.split(' ')[0].match(/^([^\/]*\/[^\/]*)\//)[1];// 提取四位数年份和月份
        if (MoonFlag !=''){
            if (MoonFlag != tempYM){
                node.parentElement.parentElement.style.boxShadow='red 0px -1px 0px';// 为月份间加线分隔
            }
        }
        MoonFlag = tempYM;
    }

    //翻页工具栏表格样式

    document.getElementById('PageBar1_plPage').getElementsByTagName('table')[0].removeAttribute('style');

    //创建样式表
    let myStyle = document.createElement('style')
    document.head.appendChild(myStyle)

    //更改已访问链接为黑色
    myStyle.innerHTML="a:visited { color: black; }"
    //翻页样式
    myStyle.append('.table_Conference{width: max-content;}');//去掉搜索背景色
    myStyle.append('#PageBar1_plPage {position: fixed; right: 0px; top: 43px; width: max-content; background-color: rgba(139, 230, 230, 0.53);}');//把翻页工具栏浮动并定位
    myStyle.append('#PageBar1_lblCurrPage {font-size: 20px;  font-weight: bold;  font-style: italic;color: #c115ff;  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;}');//改变翻页工具当前页面数值栏样式
    myStyle.append('#PageBar1_plPage a {display:inline-block;padding:1px 5px; border: 1px solid #666;border-radius:5px;}')//改变翻页工具栏链接样式
}

//优化查看简讯页面。
if (document.URL.match(/NewsDetail.aspx/)){
    let news_Number=document.getElementById("td_hidLssuc");
    if (news_Number != undefined){
        document.getElementById("td_hidLssuc").style.display='unset';
        document.getElementById("Panel2").textContent=document.getElementById("Panel2").textContent.replace('期号：',"").replaceAll(' ',"");
        document.getElementById("Panel1").textContent=document.getElementById("Panel1").textContent.replace('拟稿人：',"").replaceAll(' ',"");
        document.getElementById("Panel3").textContent=document.getElementById("Panel3").textContent.replace('发布日期：',"").replaceAll(' ',"");
        document.getElementById('Panel3').parentElement.innerHTML=document.getElementById('Panel3').parentElement.innerHTML.replace('日','日</div><div>');
        document.getElementById('Panel3').nextElementSibling.style.opacity='0.5';
        document.getElementById('Panel3').nextElementSibling.style.marginBottom='-1.4em';

        let articleTitleEl=document.getElementById('lblTitleName');
        let articleTitleArray=articleTitleEl.textContent.split('】');
        let articleTitleSting1='【' + articleTitleArray.slice(0,articleTitleArray.length-1).join(' : ').replaceAll('【','') + '】';
        articleTitleEl.innerHTML='<div style="font-size:20px;color: #d28f0f !important;">' + articleTitleSting1 + '</div><span>' + articleTitleArray[articleTitleArray.length -1];

        styleElement.append('tr {maring:0px;}');
        styleElement.append('@keyframes flowlight {0% {background-position: 0 0; };100% {background-position: -100% 0;}}');
        styleElement.append('html body form#form1 div table tbody tr#div1 td table tbody tr td hr{background-image: -webkit-linear-gradient(left, #D81159, #E53A40 10%, #FFBC42 20%, #75D701 30%, #30A9DE 40%, #D81159 50%, #E53A40 60%, #FFBC42 70%, #75D701 80%, #30A9DE 90%, #D81159);color: transparent;background-size: 200% 100%;animation: flowlight 5s linear infinite;height: 1px;}');
    }
}

//优化编辑器。
if (document.URL.match(/News\/News(Edit|Add).aspx/)){
    //动态加入“预览”按钮
    let news_cmdEdit=document.getElementById("cmdEdit")||document.getElementById("btnCheck");
    if (news_cmdEdit != undefined){
        let temp_preView=news_cmdEdit.cloneNode(true);
        let url="http://192.168.1.65/SubModule/News/NewsDetail.aspx?&typeid=127&id=" + GetQueryString("id");
        temp_preView.id="";
        temp_preView.name="cmdPreview";
        temp_preView.value="预览";
        temp_preView.removeAttribute('onclick');
        temp_preView.setAttribute('onclick','return false');
        temp_preView.addEventListener('click',function(){window.open(url, "_blank");});
        news_cmdEdit.parentNode.appendChild(temp_preView);
    }

    let EditTable=document.getElementById("Panel_save")||document.getElementById("Panel_send");
    if (EditTable != undefined) {
        EditTable.nextSibling.style.width="100%";
    }
    EditTable=document.getElementsByClassName('GbText')[0];
    if (EditTable != undefined) {
        EditTable.style.width="100%";
    }
}
//非IE核心 ，把查看文档改为下载
if (document.URL.match(/(Read|Edit)Office.aspx/)){
    window.location=document.body.getAttribute('onload').split('"')[1]
}