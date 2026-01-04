// ==UserScript==
// @name         500.com 小助手
// @namespace    https://greasyfork.org/zh-CN/users/252532-markiiiiiiii
// @version      0.0.6
// @description  500.com足彩小助手，页面内显示交战双方历史和赔率信息，无需跳转页面，方便选择
// @author       kumits
// @match        https://trade.500.com/jczq/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=500.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457858/500com%20%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457858/500com%20%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 移除广告层
function removeAdDiv() {
    GM_addStyle('#recommendAtionContainerID{display:none !important}'); // 移除专家推荐层
    GM_addStyle('#floatLayerContainerID{display:none !important}'); //移除浮动app下载层
    GM_addStyle('#popupContainerID{display:none !important}'); //移除遮罩顶层
}

//添加信息图标并绑定动作
function addInfoBtn(){
    //添加图标
    $('td[class="td td-team"] > div[class="team"] > span[class="team-l"]').each((k,v)=>{
        $(v).before('<i class="fa fa-info-circle" aria-hidden="true" style="color:#ff5721"></i>');
    });
   //监听图标点击动作
   $('.fa.fa-info-circle').on({
       click:function(){
        //关闭之前所有的弹窗
        layer.closeAll();
       var targetUrl = $(this).parent().parent().parent().find('.td.td-data > a:first').attr('href');
       var urlArr = getPageArray(targetUrl)
       getMatchInfo(urlArr[0])
       getLottoInfo(urlArr)

   },
       mouseover:function(){
        layer.tips('查看', $(this), {
        tips: [2,'#78BA32'],
        time:2000
    })}
     });
}

//显示低赔率比赛
function showLowOdds(){
    //清除背景图
    $('.betbtn').css('background','none');
$('.betbtn').each((k,v)=>{
   var o = $(v).find('span').text()
   switch(true){
       case(o <= 1.2):
           $(v).css({'background-color':'#711DB0','color':'#fff'});
           break;
       case(1.2< o && o <= 1.3 ):
           $(v).css({'background-color':'#C21292','color':'#fff'});
           break;
       case(1.3< o && o <= 1.4 ):
           $(v).css({'background-color':'#EF4040','color':'#fff'});
           break;
       case(1.4< o && o <= 1.5 ):
           $(v).css({'background-color':'#FFA732','color':'#fff'});
           break;
        case(1.5< o ):
           break;
   }
    })
}

//获取数据页面组
function getPageArray(pageUrlStr){
       //获取页面正则
       var pattern = /(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)/
      //获取页面名
       var pageName = pageUrlStr.match(pattern)[0]
       //页面组
       var pageArray = ['shuju','youliao','touzhu','ouzhi','rangqiu','yazhi','daxiao','bifen','zoushi','stat']
       //url前缀
       var pageUrlPrefix = 'https://odds.500.com/fenxi/'
       var allUrlArr = []
       pageArray.map((item,index)=>{
           allUrlArr.push(pageUrlPrefix+item+'-'+pageName)
       })
    return allUrlArr
}
//获取比赛信息生成弹窗
async function getMatchInfo(urlpath){
    let matchCont = await getMatch(urlpath)
    InfoDiv('主客数据','lt',matchCont);
}
//获取欧赔，亚盘，大小球信息生成弹窗
async function getLottoInfo(urlArr) {
    let oupeiCont = await getOupei(urlArr[3])
    let yapanCont = await getYazhi(urlArr[5])
    let daxiaoCont = await getDaxiao(urlArr[6])
    lottoDatasTabDiv('rt',oupeiCont,yapanCont,daxiaoCont)
}
//获取欧赔
function getOupeiData(urlPath){
   return new Promise((resolve,reject)=>{
       GM_xmlhttpRequest({
        method: "GET",
        responseType:'blob',
        url: urlPath,
        onload: function (res) {
            let reader = new FileReader()
            reader.readAsText(res.response,"gb2312")
            reader.onload=function(e){
                let domObj= e.target.result;
               resolve(getLottoTableDiv(domObj))
            }
        }
    })
       })
}
async function getOupei(urlpath){
    return await getOupeiData(urlpath)
}
//获取亚盘
function getYazhiData(urlPath){
    return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({
        method: "GET",
        responseType:'blob',
        url: urlPath,
        onload: function (res) {
            let reader = new FileReader()
            reader.readAsText(res.response,"gb2312")
            reader.onload=function(e){
                let domObj= e.target.result;
                resolve(getLottoTableDiv(domObj))
            }
        }
    })
    })
}
async function getYazhi(urlpath){
    return await getYazhiData(urlpath)
}
//获取大小球
function getDaxiaoData(urlPath){
    return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({
        method: "GET",
        responseType:'blob',
        url: urlPath,
        onload: function (res) {
            let reader = new FileReader()
            reader.readAsText(res.response,"gb2312")
            reader.onload=function(e){
                let domObj= e.target.result;
                resolve(getLottoTableDiv(domObj))
            }
        }
    })
    })
}
async function getDaxiao(urlpath){
    return await getDaxiaoData(urlpath)
}
// 获取队伍信息
function getMatchData(urlpath) {
    return new Promise((resolve,reject)=>{
    GM_xmlhttpRequest({
        method: "GET",
        responseType:'blob',
        url: urlpath,
        onload: function (res) {
            let reader = new FileReader()
            reader.readAsText(res.response,"gb2312")
            reader.onload=function(e){
               let domObj= e.target.result;
               let tmp = historyDiv(domObj)
                tmp +=bankingDiv(domObj)
                tmp +=recordDiv(domObj)
                tmp +=integralDiv(domObj)
                resolve(tmp)
            }
        }
    })
    })
}
async function getMatch(urlpath){
    return await getMatchData(urlpath)
}
//交战历史层
function historyDiv(dom){
    var filterTabel = $(dom).find('.mar_b.history.M_box')
    filterTabel.find('.M_content>.pub_table>tbody>tr').each(
        function(index,item){
            if(index == 0){
                $(item).find('th:gt(4)').remove()
            }else{
                $(item).find('td:gt(4)').remove()
            }
        }
    );
    filterTabel.find('.M_content>.pub_table>colgroup>col:gt(4)').remove()
    filterTabel.find('.M_content_t').remove();
    filterTabel.find('.M_title>span').remove();
    return filterTabel[0].innerHTML
}

//排名层
function bankingDiv(dom){
    var homeTeamName =$(dom).find('.M_box>.M_sub_title>div:first')[0].innerText
    var awayTeamName =$(dom).find('.M_box>.M_sub_title>div:last')[0].innerText
    var homeTeamTable = $(dom).find('.M_box>.M_content>.team_a')
    homeTeamTable.find('table').wrap('<div><h4>主：'+homeTeamName+'</h4></div>');
    var awayTeamTable =$(dom).find('.M_box>.M_content>.team_b')
    awayTeamTable.find('table').wrap('<div><h4>客：'+awayTeamName+'</h4></div>');
    return $(homeTeamTable)[0].innerHTML+$(awayTeamTable)[0].innerHTML
}
//近期战绩层
function recordDiv(dom){
   var homeTeamTable = $(dom).find('.M_box.record>.odds_zj_tubiao.module_cur>.team_a>form>.M_content')
   homeTeamTable.find('.bottom_info').remove()
   homeTeamTable.find('table').wrap('<div><h4>主队战绩</h4></div>');
   var awayTeamTable = $(dom).find('.M_box.record>.odds_zj_tubiao.module_cur>.team_b>form>.M_content')
   awayTeamTable.find('.bottom_info').remove()
   awayTeamTable.find('table').wrap('<div><h4>客队战绩</h4></div>');
   return $(homeTeamTable)[0].innerHTML+$(awayTeamTable)[0].innerHTML
}

//未来赛事层
function integralDiv(dom){
   var homeTeamTable = $(dom).find('.M_box.integral>.M_content>.team_a')
   homeTeamTable.find('table').wrap('<div><h4>主队未来赛事</h4></div>');
   var awayTeamTable = $(dom).find('.M_box.integral>.M_content>.team_b')
   awayTeamTable.find('table').wrap('<div><h4>客队未来赛事</h4></div>');
   return $(homeTeamTable)[0].innerHTML+$(awayTeamTable)[0].innerHTML
}
//获取欧赔、亚盘、大小球数据层
function getLottoTableDiv(dom){
    var lottoTable = $(dom).find('.table_cont').parent()
    return $(lottoTable)[0].innerHTML
}

//左弹出层
function InfoDiv(title,offset,contents) {
    layer.open({
        type:1,
        title: title,
        offset:offset,
        shadeClose: true,
        shade: false,
        area: ['610px', '800px'],
        content: contents
    });
}
//右弹出层
function lottoDatasTabDiv(offset,cont1,cont2,cont3) {
    layer.tab({
        offset:offset,
        area: ['610px', '800px'],
        shade: false,
        tab:[{
        title:'百家欧赔',
        content: cont1
        },{
        title:'亚盘对比',
        content: cont2
        },{
        title:'大小指数',
        content: cont3
        }]
    });
}

//添加css
function addCss() {
    $(document.body).append('<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css" rel="stylesheet">');
    $(document.body).append('<link href="https://www.500cache.com/odds/css/odds_new.css?v=2020-10-22" rel="stylesheet">');
    $(document.body).append('<link href="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/css/all.min.css" rel="stylesheet">');
}

//主函数
function MainFunc() {
    addCss();
    removeAdDiv();
    addInfoBtn();
    showLowOdds();
}

MainFunc(); //主函数执行