// ==UserScript==
// @name         统计消耗/标题
// @namespace    https://greasyfork.org/zh-CN/scripts/436477
// @version      3.42
// @description  快捷键：快捷键：   ~  复制数据；   alt + ~ 复制计划名中的视频名称；   ctrl + ~ 初始化刷新，可以刷新掉排序、筛选、日期等；   shift + ~ 排查计划的投放地区；   - 把roi低于设置值的计划标红；   shift + - 勾选出价大于多少的计划；   = 勾选没过学习期且没出单的计划；   ctrl + \复制计划（可填写参数设置复制计划的速度）；   \ 暂停复制计划；   shift + 1 开启无聊的删除模式，鼠标放哪按delete就可以删除哪里的元素；
// @author       小刘
// @match        https://qianchuan.jinritemai.com/promotion?aavid=*
// @match        https://qianchuan.jinritemai.com/report/*
// @grant        none
// @run-at       document-idle
// @license     木染
// @require      https://cdn.bootcss.com/jquery/3.6.0/jquery.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/436477/%E7%BB%9F%E8%AE%A1%E6%B6%88%E8%80%97%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/436477/%E7%BB%9F%E8%AE%A1%E6%B6%88%E8%80%97%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==
const roi = 1.2,//需要标红的roi  低于此数值标红
      nm = '支付ROI（原成交ROI）',//需要对比的数据，与下面变量相关联
      value = 0.1,//对比小于此数值将会勾选
      cd = 0.1,//复制的速度  秒
      name = ['成交订单金额(元)','消耗(元)','点击次数','成交订单数'],
      area = /长沙|杭州|北京|上海|广州|深圳|济南|内蒙古|西藏|新疆|台湾|香港|澳门|宁夏|青海/g;
let p,
    len=0//复制的次数
const remove1=setInterval(function(){
    if($('.bar').length){
        $('.bar').remove();
        if($('.tab-dropdown-menu.byted-popover-wrapper +').length){
            $('.tab-dropdown-menu.byted-popover-wrapper +').remove()
            $('.tab-dropdown-menu.byted-popover-wrapper').remove()
        }
        clearInterval(remove1);
    }
},300)
onkeydown = function(event){
    switch(event.keyCode){
        case 192:
            if(event.ctrlKey){
                window.location.href=window.location.href.split('#')[0];
            }else if(event.altKey){
                yz();
            }else if(event.shiftKey){
                let x=$('label:contains("地域"):eq(0)~div').text().match(area)
                if(x!=null){
                    copyToClip(x,"复制成功")
                    alert(x)
                }else{alert('暂无')}
            }else {
                if(window.location.href.split('?')[0]=='https://qianchuan.jinritemai.com/report/live'){
                    fz1();
                }else fz();
            }break;
        case 220:if(event.ctrlKey){lxfz();}else{p=len;};break;
        case 189:
            if(event.shiftKey){
                jccj();
            }else {bh();};break;
        case 187:jh();break;
        case 49:
            if(event.shiftKey){
                bgms()
            }break;
    }
}
function bgms(){//无聊的删除模式
    alert('已开启删除模式')
    let el
    $('*').mouseover(function(){
        el = event.target;
    })
    onkeydown = function(event){
        if(event.keyCode==46){
            $(el).remove()
        }
    }
}
function fz(){//复制数据
    let a=[]
    for(let i=0;i<name.length;i++){
        for(let o=0;o<$('.promotion.brief-card').length;o++){
            if(name[i]==document.getElementsByClassName('promotion brief-card')[o].getElementsByClassName('wrapper')[0].innerText){
                a[i]=o
                break;
            }
        }
    }
    if(a.includes()){//判断数组是否包含这些数据
        alert('甘霖娘，先把数据调出来')
    }else {
        let c='';
        for(let i=0;i<a.length;i++)
        {
            c=c+document.getElementsByClassName('promotion brief-card')[a[i]].getElementsByClassName('metric-value')[0].innerText.split(' ')[0]+'\t';
        }
        copyToClip(c,"复制成功")
    }
}
function fz1(){//复制视频标题
    let len=$('.bui-table-fixed-body .name').length;
    let c='';
    for(let i=0;i<len;i++){
        if(document.getElementsByClassName('bui-table-body bui-table-overflow-x')[0].getElementsByClassName('bui-table-tr')[i].getElementsByClassName('bui-table-ceil-children-container')[1].innerText!='直播间画面'){
            c=c+document.getElementsByClassName('bui-table-fixed-body')[0].getElementsByClassName('name')[i].innerText+'\n';
        }
    }
    copyToClip(c,"复制成功")
}
function yz(){//复制视频名字
    let a=[], o=0;
    for(let i=0;i<$('.ad_name .name').length;i++){
        if(document.getElementsByClassName('status')[i].innerText!='审核不通过'){
            a[o]=document.querySelectorAll('.ad_name .name')[i].title.split('-')[3];
        } else {
            o--;
        }
        o++;
    }
    let len=a.length;
    for(let i=0;i<len-1;i++){
        for(let o=i+1;o<len;o++){
            if(a[i]==a[o]){
                a.splice(o,1);
                len--;
                o--;
            }
        }
    }
    let c=''
    for(let i=0;i<a.length;i++){
        c=c+a[i]+'\n'
    }
    copyToClip(c,"复制成功")
}
function lxfz(){//连续复制计划
    const x=prompt('要复制第几个计划',1);
    if(x!=null){
        len=prompt('要复制的次数',1);
        if((len!=null)){
            console.log('按键开启')
            p=0;
            console.log('复制第1次');
            document.getElementsByClassName('operation')[x-1].children[1].click();
            let set1=setInterval(function(){
                console.log('开启循环检测')
                if(p<len-1){
                    p++;
                    document.getElementsByClassName('operation')[x-1].children[1].click();
                    console.log('复制第'+(p+1)+'次');
                }else{clearInterval(set1);console.log('复制结束');}
            },cd*1000)
            }
    }
}
function jccj(){//高出价勾选
    const cj=prompt('请输入要标红勾选的出价',60);
    if(cj!=null){
        let a=0,
            len=$('.bui-table-header:eq(0) .byted-popover-wrapper').length,
            len2=$('.bui-table-tr').length/2;
        for(let z=0;z<len2;z++){
            if(document.getElementsByClassName('bui-table-tr')[z].getElementsByClassName('bui-table-column')[6].innerText>cj){
                a++;
                document.getElementsByClassName('bui-table-tr')[z+len2].getElementsByTagName('input')[0].click();
            }
        }
        if(a==0){
            alert('暂无标红计划')
        }else{alert('已标红'+a+'个计划')}
    }
}
function bh(){//roi检测标红
    const r=prompt('请输入要标红的roi',roi);
    if(r!=null){
        const i=count();//i,len2
        let a=0
        for(let z=0;z<i[1];z++){
            if(document.getElementsByClassName('bui-table-tr')[z].getElementsByClassName('bui-table-column')[i[0]].innerText<r){
                a++;
                document.getElementsByClassName('bui-table-tr')[z+i[1]].getElementsByClassName('name')[0].style.color='red';
                //document.getElementsByClassName('bui-table-tr')[z+i[1]].getElementsByTagName('input')[0].click();//1111111111111111
            }
        }
        if(a==0){
            alert('暂无标红计划')
        }else{alert('已标红'+a+'个计划')}
    }
}
function jh(){//计划学习期检测关闭
    const i=count();//i,len2
    let a=0
    for(let o=0;o<i[1];o++){
        if(document.getElementsByClassName('bui-table-tr')[o].getElementsByTagName('g')[0]&&document.getElementsByClassName('bui-table-tr')[o].getElementsByTagName('g')[0].outerHTML.split('">')[0].split('"')[1]=='#999'&&document.getElementsByClassName('bui-table-tr')[o].getElementsByClassName('bui-table-column')[i[0]].innerText<value){
            a++;
            document.getElementsByClassName('bui-table-tr')[o+i[1]].getElementsByTagName('input')[0].click();
        }
    }
    if(a==0){
        alert('暂无符合计划')
    }
}
function copyToClip(content, message) {//复制函数  可调用
    let aux = document.createElement("textarea");
    aux.value=content;
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}
function count(){//运算roi位置和计划数函数   可调用
    let i;
    const len=$('.bui-table-header:first .byted-popover-wrapper').length,
          len2=$('.bui-table-tr').length/2;
    for(let o=0;o<len-1;o++){
        if(nm==document.getElementsByClassName('bui-table-header')[0].getElementsByClassName('byted-popover-wrapper')[o].innerText){
            i=o+9;
            break;
        }
    }
    return [i,len2];
}