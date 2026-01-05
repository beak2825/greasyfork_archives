// ==UserScript==
// @name        route assistant
// @namespace   myhead
// @description 金书红颜录路线武功规划脚本，需配合相关维基页面使用
// @version     1.1.4
// @grant       none
// @homepageURL https://greasyfork.org/zh-CN/scripts/13722-route-assistant
// @include     http://tpr.inkit.org/tpr5:route
// @include     http://tpr.inkit.org/doku.php?id=tpr5:route
// @downloadURL https://update.greasyfork.org/scripts/13722/route%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/13722/route%20assistant.meta.js
// ==/UserScript==
/*
    oResult={
        '拳':[aRegExpSearchResult1{[0](matched content),[1](captured content in parenthesis),[2],index,input},aRegExpSearchResult2...],
        '剑':[],
        '兵':[],
        '特':[],
        '暗':[],
        '内':[],
        '轻':[],
        '余':[]
    }
    Pos= aC1[i] ={
            __Con: {
                sMResult: entries list contained by current position
                sPath: route position chain
                sName: route position name,
                sCon: RegExp context of the position,
                nStart: start index in sCon,
                nEnd: end index in sCon
            },
            next: []
            //next is deeper list of route option object
        }

*/
var aC1= [],
    //aC1 correspond to the list of route root object
    aRoute=[],
    oResult={},
    sOrigin='',
    sResult='',
    t;
window.mainDiv= document.createElement('div'),
window.navi= document.createElement('div'),
window.div1= document.createElement('div'),
window.div2= document.createElement('div'),
window.div2p= document.createElement('div'),
window.div2f= document.createElement('div'),
window.round= document.createElement('select'),
window.speci= document.createElement('span'),
window.toggle= document.createElement('button'),
window.oTarget= {};
toggle.innerHTML="打开路线武功规划器";
toggle.onclick=function(){
    if(sOrigin=== '') main();
    mainDiv.style.display='';
};
window.onload=function(){
    toggle.id='__toggle';
    mainDiv.id='__mainDiv';
    oTarget= document.getElementById('target');
    oTarget.insertBefore(toggle,oTarget.firstChild);
};
function main(){
    //search route and set UI;
    if(!oTarget){
        alert('找不到源数据');
        return;
    }
    sOrigin=oTarget.textContent;
    var rP1= /#(.+)/g,sMR='';
    for(var i=0,aTemp;i<100;i++) {
        aTemp=rP1.exec(sOrigin);
        //aTemp contains [0] [1] .index .input
        if (aTemp=== null) break;
        t= aTemp.input.match(/\n\s*.*/)[0].match(/@(.*)/);
        sMR= t? t[1]:'';
        aC1[i]={
            //aC1[i] is route option object
            __Con: {
                sMResult: sMR,
                sPath: aTemp[0],
                sName: aTemp[1],
                sCon: aTemp.input,
                nStart: aTemp.index,
                nEnd: undefined
            },
            next: []
            //next is deeper list of route option object
        };
        //initialise the route result array
        aRoute[i]= aC1[i];
        if(i>0)
            aC1[i-1].__Con.nEnd= aTemp.index-1;
    }
    //create UI and set up initial option list
    mainDiv.setAttribute('style','position: absolute; left: 200px; top: 100px; width: 830px; height: 600px; background: white; border: solid #E0E0E0; overflow: auto;resize: both;');
    //
    navi.innerHTML=
        "<button onclick='div1.style.display=\"\";div2.style.display=\"none\";'>路线选择</button>"+
        "<button onclick='div2.style.display=\"\";div1.style.display=\"none\";'>武功统计</button>"+
        "<button onclick='mainDiv.style.display=\"none\";' style='float: right;'>隐藏</button>";
    navi.setAttribute('style','border-bottom: solid #F0F0F0; background: #F0F0F0');navi.setAttribute('style','border-bottom: solid #F0F0F0;background: #F0F0F0');
    div2.style.display='none';
    div2.innerHTML+= '请选择周目：';
    for(var i=1;i<7;i++)
        round.innerHTML+='<option value='+i+'>'+i+'周</option>';
    div2.appendChild(round);
    button= document.createElement('button');
    button.innerHTML='开始统计';
    button.onclick= analyse;
    div2.appendChild(button);
    //create filter option bar div2f
    div2f.innerHTML+= '结果过滤器：';
    speci.innerHTML+=
        '名称显示<select><option value=1 selected>简名</option><option value=2>全名</option></select> '+
        '类别<select><option value=0 selected>&nbsp;&nbsp;&nbsp;&nbsp;</option><option value="拳">拳</option><option value="剑">剑</option><option value="兵">兵</option><option value="特">特</option><option value="暗">暗</option><option value="内">内</option><option value="轻">轻</option><option value="药">药</option><option value="[^拳剑兵特暗内轻药]">其他</option></select>'+
        '阴阳<select><option value=0 selected>&nbsp;&nbsp;&nbsp;&nbsp;</option><option value="阴">阴</option><option value="阳">阳</option></select>'+
        '最低数值<select><option value=0 selected>&nbsp;&nbsp;&nbsp;&nbsp;</option><option value=1 >1</option><option value=2 >2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select>';
    div2f.appendChild(speci);
    button= document.createElement('button');
    button.innerHTML='过滤结果';
    button.onclick=filter;
    div2f.appendChild(button);
    div2.appendChild(div2f);
    div2.appendChild(div2p);
    div2.style.margin='10px';
    var tarList=document.createElement('ol');
    for(var i=0,li,doList;i<aC1.length;i++){
        //set up the root group
        li= document.createElement('li');
        li.innerHTML=aC1[i].__Con.sName;
        doList= dive(aC1[i],1);
        //set up the first layer option
        if(doList.length>0){
            var select=document.createElement('select');
            select.onchange=routeQuery;
            select.innerHTML+="<option value='"+i+"' selected ></option>";
            for(var j=0;j<doList.length;j++){
                //add drop-down list for each option
                select.innerHTML+=
                    "<option value='"+i+"."+j+"' >"+doList[j].__Con.sName+"</option>";
            }
            li.appendChild(select);
        }
        tarList.appendChild(li);
    }
    button= document.createElement('button');
    button.innerHTML='检查路线冲突';
    button.onclick=checkBinding;
    div1.appendChild(button);
    button= document.createElement('button');
    button.innerHTML='路线导入导出';
    button.onclick=exportAndImport;
    div1.appendChild(button);
    div1.appendChild(tarList);
    mainDiv.appendChild(navi);
    mainDiv.appendChild(div1);
    mainDiv.appendChild(div2);
    document.body.appendChild(mainDiv);
}
function dive(Pos,nSym){
    //dive into route chain,group represents the number of option root
    var rP= new RegExp('\\s'+nSym+'(.*)','g'),sMR,
        sContext= Pos.__Con.sCon.substring(Pos.__Con.nStart,Pos.__Con.nEnd);
    for(var i=0,aTemp;i<100;i++) {
        aTemp= rP.exec(sContext);
        if(aTemp=== null) break;
        t= aTemp.input.match(/\n\s*.*/)[0].match(/@(.*)/);
        sMR= t? t[1]:'';
        Pos.next[i]={
            __Con: {
                sMResult: Pos.__Con.sMResult+ sMR,
                sPath: Pos.__Con.sPath+'-'+aTemp[1],
                sName: aTemp[1],
                sCon: aTemp.input,
                nStart: aTemp.index,
                nEnd: undefined
            },
            next: []
        };
        if(i>0) Pos.next[i-1].__Con.nEnd= aTemp.index-1;
    }
    return Pos.next;
    //the newly matched route to create drop-down of
}
function sort(aEntry,aTarget){
    var i,nIndi;
    if(!aEntry[1]) aEntry.nIndi=0;
    else aEntry.nIndi=parseInt(aEntry[1].match(/\d/)[0]);
    if(!aTarget[0]){
        aTarget[0]=aEntry;
        return;
    }
    for(i=0;i<aTarget.length;i++){
        if(aEntry.nIndi< aTarget[i].nIndi){
            for(var j=aTarget.length-1;j>= i;j--){
                aTarget[j+1]= aTarget[j];
            }
            break;
        }
    }
    aTarget[i]= aEntry;
}
//following fuctions are event handle
function routeQuery(){
    //connecting with selcet.onchange, the event handle to search option of drop-down list,whose value corresponds to the index of content array.Then create relevant drop-down list.
    while(this.nextSibling)
        this.parentNode.removeChild(this.nextSibling);
    if(this.value== this.firstChild.value) return;
    var aValue=this.value.match(/\d+/g),
        //[this] is the node elements triggering the event.[this.value] has form like'1.2.3'
        Pos=aC1[aValue[0]],
        //Pos is route option object
        nSym= 0;
        //nSym is the current route layer of Pos
    for(var i=1;i<aValue.length;i++){
        //convert string path in select's value to virtual array path
        Pos=Pos.next[aValue[i]];
        nSym++;
    }
    var list= dive(Pos,nSym+1);
    if (list.length>0) {
        var select=document.createElement('select');
        select.onchange=routeQuery;
        select.innerHTML+="<option value='"+this.value+"' selected ></option>";
        for(var j=0;j<list.length;j++){
            select.innerHTML+=
                "<option value='"+this.value+"."+j+"' >"+list[j].__Con.sName+"</option>";
        }
        this.parentNode.appendChild(select);
    }
    //if there is no sub option in deeper layer,log the result
    aRoute[aValue[0]]= Pos;
}
//connect with the button '开始统计'
function analyse(){
    oResult={};
    for(var i=0,oT;i<aRoute.length;i++){
        var rP2=/\S+?(\+[1-9][阴阳]?)?(-\S)?(\?[1-6])?(?=\s|$)/gm;
        oT=aRoute[i].__Con;
        sResult= oT.sCon.substring(oT.nStart,oT.nEnd);
        t= sResult.match(/@(.*)/);
        sResult= oT.sMResult+(t? t[1]:'');
        if(sResult=== '') continue;
        for(var j=0,aT=[];j<200;j++){
            aT=rP2.exec(sResult);
            //at[0]-- content; at[1]-- +[rank][yinyang]; at[2]-- -[type]; at[3]-- ?[round]
            if(!aT) break;
            if(!aT[1]) aT[1]= '+0';
            if(aT[3] && parseInt(aT[3].substring(1))> round.value) continue;
            if(!aT[2]) aT[2]='未分类';
            else aT[2]=aT[2].substring(1);
            if(!oResult[aT[2]]) oResult[aT[2]]=[];
            sort(aT,oResult[aT[2]]);
        }
    }
    sResult='';
    //output
    for(var x in oResult){
        sResult+= '类别——'+x+'：<br /><table width="800"><tr>';
        var rTp= /[^\-?\s]+/;
        for(var i=0;i<oResult[x].length;i++){
            sResult+="<td>"+ oResult[x][i][0]+'</td>';
            if((i+1)% 4==0) sResult+= "</tr><tr>"
        }
        sResult+='</tr></table><br /><br />';
    }
    div2p.innerHTML= sResult;
}
//connect with button in filter bar
function filter(){
    var aOut= speci.children,
        rTp= /[^-?\s]+/;
    sResult= '';
    //aOut[1]-- string representing type; aOut[2]-- string representing yin yang; aOut[3]-- number representing value rank
    for(var x in oResult){
        if(aOut[1].value!= '0'){
            var rP=new RegExp(aOut[1].value);
            if(!rP.test(x)) continue;
        }
        sResult+= '类别——'+x+'：<br /><table width="800"><tr>';
        if(aOut[0].value== 1){
            for(var i= 0,j=0,aTemp;i<oResult[x].length;i++){
                aTemp=oResult[x][i];
                if(aOut[2].value!= '0')
                    if(aTemp[1])
                        if(t= aTemp[1].match(/[阴阳]/))
                            if(t[0]!= aOut[2].value)
                                continue;
                if(aOut[3].value== '0' || parseInt(aTemp[1].match(/\d/)[0])>= aOut[3].value){
                    sResult+="<td>"+aTemp[0].match(rTp)[0]+'</td>';
                    if((j+1)% 4==0) sResult+= "</tr><tr>";
                    j++;
                }
            }
        }
        else{
            for(var i= 0,j=0,aTemp;i<oResult[x].length;i++){
                aTemp=oResult[x][i];
                if(aOut[2].value!= '0')
                    if(aTemp[1])
                        if(t= aTemp[1].match(/[阴阳]/))
                            if(t[0]!= aOut[2].value)
                                continue;
                if(aOut[3].value== '0' || parseInt(aTemp[1].match(/\d/)[0])> aOut[3].value){
                    sResult+="<td>"+ aTemp[0]+'</td>';
                    if((j+1)% 4==0) sResult+= "</tr><tr>";
                    j++;
                }
            }
        }
        sResult+='</tr></table><br /><br />';
    }
    div2p.innerHTML= sResult;
}
//connect with button to confirm proper binding
function checkBinding(){
    var aBind=[],Compare={},sCollision='';
    for(var i=0;i<aRoute.length;i++){
        t= aRoute[i];
        t=t.__Con;
        var aT= t.sPath.split(/-/);
        for(var j=0;j<aT.length;j++){
            Compare[aT[j].match(/[^ ]+/)[0]]= 1;
        }
        var rP= /[^ \-\n]*bind\s*([^ \-\n]+)/g;
        for(var j=0,aT1;j<100;j++){
            aT1= rP.exec(t.sPath);
            if(aT1) aBind.push(aT1);
            else break;
        }
    }
    for(var i=0,aT;i<aBind.length;i++){
        if(!Compare[aBind[i][1]]) sCollision+= aBind[i].input+"\n";
    }
    if(sCollision!== '')
        alert ('路线冲突：\n'+sCollision.replace(/bind/g,'绑定'));
}
//connect with button to export and import route selection
function exportAndImport(){
    var i,j,k,sRoot,root,aPath,sOut='请复制以下路线内容来导出：\n';
    for (i=0;i<aRoute.length;i++){
        sOut+= aRoute[i].__Con.sPath + ';\n';
    }
    var sIn= prompt(sOut,'请将要导入的路线内容粘贴到这里');
    var aIn1= sIn?sIn.match(/#.*?;/g):null;
    if (!aIn1) return;
    var aList= div1.getElementsByTagName('li'),context,aOption,sValue;
    for (i=0;i<aIn1.length;i++){
        aPath= aIn1[i].match(/[^\s#-;][^-;]*/g);
        if (!aPath) continue;
        sValue=''+i;
        root= aPath[0];
        for (j=0;j<aList.length;j++){
            if (aList[j].firstChild.textContent.indexOf(root)!=-1) {context=aList[j];break;}
        }
        if (j== aList.length) continue;
        for (j=1;j<aPath.length;j++){
            aOption= context.children[j-1].children;
            for (k=0;k<aOption.length;k++){
                if (aOption[k].textContent.indexOf(aPath[j])!=-1){
                    sValue+='.'+(k-1);
                    context.children[j-1].value=sValue;
                    context.children[j-1].onchange();
                    break;
                }
            }
            if (!context.children[j-1].nextSibling) break;
        }
    }
}