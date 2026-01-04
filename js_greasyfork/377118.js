// ==UserScript==
// @name         批量提取动漫花园BT链接
// @description  筛选、提取、选择并复制动漫花园当前搜索结果的BT链接
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @author       YD-Cat
// @version      1.66
// @namespace    https://greasyfork.org/zh-CN/users/242083-yd-cat
// @copyright    2019+, YD-Cat
// @include      http*://share.dmhy.org/*
// @icon         https://share.dmhy.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/377118/%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%ADBT%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/377118/%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%ADBT%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
var $ = jQuery.noConflict();
var eventFun=function(){

    //显示窗口
    $("#extract").click(function(){
        var magnetObjs=$('.download-arrow.arrow-magnet')
        var titleObjs=$('td.title>a')

        //显示或隐藏
        if($('#magnetBox').css('display')!='block'){
            //初始化内容
            $('#magnetBox #selected').text(0)
            $('#copySltDL>a').text('複製種子下载链接')
            $('#selectAll').attr('flag',false)
            //没有可提取资源
            if(magnetObjs.length<=0||($('#topic_list>tbody>tr[class="mismatch"]').length==$('#topic_list>tbody>tr').length)){
                let str='<tr style="text-align: center;" class="even"><td></td><td class="myTitle">没有资源</td><td></td></tr>';
                $("#magnetUrl tbody").append(str);
                show();
            }
            else{
                var index=1;
                //获取每一行
                titleObjs.each((i,myThis)=>{
                    const tr =$(myThis).parents('#topic_list>tbody>tr');
                    //过滤不符合筛选的资源
                    if(!tr.hasClass('mismatch')){
                        let str='<tr style="text-align: center;" class="even"><td style="user-select: none;">'+ index++ +'</td><td class="align myTitle">'+titleObjs[i].innerText+'</td><td><input type="checkBox"></td><td class="align myDisplay magnet">'+magnetObjs[i].href.substring(0,magnetObjs[i].href.indexOf('&dn'))+'</td><td class="align myDisplay DL_Page">'+myThis.href+'</td><td class="align DL_Link myDisplay"></td></tr>'
                        $("#magnetUrl tbody").append(str);
                    }
                })
                show();
                //加载种子下载链接
                $('#copySltDL>a').text("加载中")
                setTimeout(()=>{
                    $('#magnetUrl tbody>tr').each((i, node)=>{
                        if(i==$('#magnetUrl tbody>tr').length-1){
                            $('#copySltDL>a').text("複製種子下载链接")
                        }
                        $.ajax({
                            url: $(node).children('.DL_Page').text(),
//                             aysnc:false,
                            success: function (data) {
                                $(node).children('.DL_Link').text('https://'+data.match(/dl.dmhy.org(.*).torrent?/)[0])
                            }
                        })
                    })
                },250);
            }
        }
        else{
            hide();
        }
    });

    //全选
    $("#selectAll").click(function(){
        var flag=stringToBoolean($('#selectAll').attr('flag'))
        $('#magnetUrl [type="checkBox"]').each(function(){this.checked= !flag})
        $('#magnetBox #selected').text($('#magnetUrl :checked').length)
        $('#selectAll').attr('flag',!flag)
        if(stringToBoolean($('#selectAll').attr('flag'))){
            $('#magnetUrl tbody>tr').each((i,node)=>{
                $(node).addClass('checked');
            });
        }
        else{
            $('#magnetUrl tbody>tr').each((i,node)=>{
                $(node).removeClass('checked');
            });
        }
    });
    //反选
    $('#selectInvert').click(function(){
        $('#magnetUrl [type="checkBox"]').each(function(){$(this).click()});
        $('#magnetBox #selected').text($('#magnetUrl :checked').length);
        isSelectAll()
    });
    //关闭窗口
    $("#close").click(function(){
        hide();
    });
    $(document).keydown((e)=>{if(e.keyCode==27) hide();})
    //复制已选
    $('#copySltMgnet').click(function(){
        let str='';
        $('#magnetUrl input:checked').each((i,node)=>{
            str+=$(node).parent().next('.magnet').text()+'\n'
        })
        copy(str)
    });
    //复制已选下载链
    $("#copySltDL").click(()=>{
        if($("#copySltDL>a").text()=='複製種子下载链接'){
            var str='';
            $('#magnetUrl input:checked').each((i,node)=>{
                str+=$(node).parent().nextAll('.DL_Link').text()+"\n";
            })
            copy(str)
        }
    })
    //给选择框绑定点击事件
    $(document).on('click','#magnetUrl [type="checkBox"]',function(event){
        event.stopPropagation();
        $(this).parents('tr').toggleClass('checked');
        $('#magnetBox #selected').text($('#magnetUrl :checked').length);
        isSelectAll();
    });
    $(document).on('click','#magnetUrl tbody>tr',function(){
        let checkBox=$(this).find('input')[0];
        if(checkBox!=null){
            checkBox.checked=!checkBox.checked;
            $('#magnetBox #selected').text($('#magnetUrl :checked').length);
            $(this).toggleClass('checked');
            isSelectAll();
        }
    });

    //防止输入非正整数
    $('#page').keypress(function(e){
        return(/[\d]/.test(String.fromCharCode(event.keyCode)))
    });
    //跳转
    $('#goToPage').click(function(){
        let url='https://share.dmhy.org/topics/list/page/';
        let page=$('#page').val();
        let localUrl=window.location.href;
        let KWpoint=localUrl.lastIndexOf('?keyword');
        let keyword;
        if(!(KWpoint>0)){
            url+=page;
        }
        else{
            keyword=localUrl.substring(KWpoint);
            url+=page+keyword;
        }
        window.location.href=url;
    });
    $('#page').keypress(function(){
        if(event.keyCode==13){
            $('#goToPage').click()
        }
    })
    //筛选
    $('#filter').click(function(){
        let regexList
        try{
            regexList=$('#condition').val().split(/[; :,，；]+/).map((r)=>new RegExp(r));
        }
        catch(error){
            alert('筛选条件错误，请参考正则表达式')
        }
        $('#topic_list>tbody>tr').each(function(){
            $(this).removeClass();
            const tagA=this.querySelector('.title>a')
            //筛选资源
            const select = tagA && regexList.reduce((result, regex) =>{return(result && regex.test(tagA.textContent))}, true);
            if(select==false){
                $(this).addClass('mismatch');
            }
            else{
                $(this).removeClass('mismatch');
            }
            //清除样式
            $(this).removeClass('even');
            $(this).removeClass('odd');
        })
        //重新设置样式
        $('#topic_list>tbody>tr[class!="mismatch"]').each((i,node)=>{
            if(i&1) $(node).addClass('odd')
            else $(node).addClass('even')
        });
    })
    $('#condition').keypress(()=>{
        if(event.keyCode==13){
            $('#filter').click()
        }
    })
};
(function() {
    enhanced();
    resourceTable();
    //加载事件
    eventFun();
})();
//增强功能
function enhanced(){
    //添加样式
    let style='<style type="text/css">.myDisplay{display:none;}.checked{background:#9bc6f6}.mismatch{display:none;}.myDiv>p{display:inline;}.line{font-size:16px;line-height:16px;margin:0 5px;}.myInput{position: relative;top: -2px;border: 1px solid #eee;font-size: 13px;}#page{width:3em;}#condition{width:10em;}.myLeft{margin-left: 5px;}#magnetBox{font-size: 13px;position: fixed;background: white;padding: 2px;display:none;border: 1px solid #247;}#magnetUrl{max-height: 405px;;overflow: auto;}#magnetUrl tr{cursor: default;}#magnetUrl thead>tr{background-color: #7e99be;color: white;font-size: 15px;}#magnetUrl th{padding:5px;}#magnetUrl tbody>tr:hover{background-color: #94aed7;}#magnetUrl tbody>tr:active{background-color: #8ab4f6;}#magnetUrl td{padding:6px 8px;color: #247;}.align{text-align: left;padding-left: 10px;}hr{margin:2px 0 0}#selectBox{margin:3px 2px 2px}#selectBox:after{content: "";display: block;clear: both;}#selectBox>ul{margin:0; padding:0;}#selectBox>ul>li{list-style-type: none;text-align: center;}#selectBox a{display:block;padding:5px;border:1px solid #247;}#selectBox>ul>li:nth-of-type(n+2){margin-left:10px;}#copySltDL{width:116px;}#copyText{position:absolute;top:-9999px;z-index:-999;width:0;height:0;opacity:0;}.myTitle{min-width:400px;max-width:580px;word-break: break-all;}input[type=number] {-moz-appearance:textfield;  }  input[type=number]::-webkit-inner-spin-button,  input[type=number]::-webkit-outer-spin-button {  -webkit-appearance: none;  margin: 0;  } </style>'
    $('.table.clear').before(style)
    //跳转
    let goPage='<div class="fl myDiv"><p class="line">&nbsp;|&nbsp;</p><p style="display: inline;">跳轉</p><input type="number" id="page" class="myLeft myInput"><p style="display: inline;" class="myLeft">页</p><a href="javascript:void(0)" id="goToPage" class="myLeft">前往</a></div>';
    //筛选
    let filter='<div class="fl myDiv"><p class="line">&nbsp;|&nbsp;</p><p style="display: inline;">条件</p><input type="text" id="condition" class="myLeft myInput" title="请参考正则表达式"><a href="javascript:void(0)" id="filter" class="myLeft">筛选</a></div>';
    //提取
    let ExtractText='<div class="fl myDiv"><p class="line">&nbsp;|&nbsp;</p><a href="javascript:void(0)" id="extract">提取鏈接</a></div>'
    //选择按钮
    let TextBox='<div id="magnetBox"><div id="magnetUrl"><table border="0"><thead><tr><th width="30">序列</th><th>標題</th><th width="30">選擇</th><th class="myDisplay">磁鏈</th><th class="myDisplay">頁面</th><th class="myDisplay">下载鏈</th></tr></thead><tbody></tbody></table></div><textarea id="copyText"></textarea><hr><div id="selectBox"><ul><li class="fl" id="copySltMgnet"><a href="javascript:void(0)">複製磁鏈</a></li><li class="fl" id="copySltDL"><a href="javascript:void(0)">複製種子下载链接</a></li><li class="fl" id="selectAll" flag=false><a href="javascript:void(0)">全選</a></li><li class="fl" id="selectInvert"><a href="javascript:void(0)">反選</a></li><li class="fl" style="color:#666;line-height:28px">已選擇：<span id="selected">0</span>項</li><li class="fr" id="close"><a href="javascript:void(0)">關閉</a></li></ul></div>'

    let sltObjs=['.nav_title .fl:last','.nav_title .fl:last','.nav_title .fl:last','.table.clear .nav_title:first'];
    let addObjTxts=[goPage,filter,ExtractText,TextBox];

    addObj(sltObjs,addObjTxts);
}
//扩展新番索引列表
function resourceTable(){
    $('#mini_jmd>table:first-of-type').css('display','none');
    $('#mini_jmd>table:last-of-type').removeAttr("style");
    $('#mini_jmd>table:last-of-type').attr("class",'jmd');
    $('#mini_jmd>table:last-of-type tr:even').addClass('even');
    $('#mini_jmd>table:last-of-type tr:odd').addClass('odd');
    let d=new Date();
    let day=d.getDay();
    console.log(day)
    $('#mini_jmd>table:last tr:eq('+day+')').addClass('today');
}
//String转换为Boolean
function stringToBoolean(str){
    switch(str.toLowerCase())
    {
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(str);
    }
}
//复制事件
function copy(str){
    str=str.substring(0,str.length-1)
    $('#copyText').val(str)
    $('#copyText').select()
    document.execCommand('copy');
}
//检测是否全选
function isSelectAll(){
    if(Number($('#magnetBox #selected').text())==$('#magnetUrl [type="checkBox"]').length){
        $('#selectAll').attr('flag',true)
    }
    else{
        $('#selectAll').attr('flag',false)
    }
}
//显示提取窗口
function show(){
    $('#magnetBox').fadeIn(250)
    let left=window.innerWidth/2-$('#magnetUrl')[0].offsetWidth/2;
    let top=window.innerHeight*0.2;
    $('#magnetBox').css({
        'left':left,
        'top':top
    })
}
//隐藏提取窗口
function hide(){
    $('#magnetBox').stop().fadeOut(200,()=>{
        $('#magnetBox').removeAttr('style');
        $('#magnetUrl tbody').text('')
    });

}
//添加对象
function addObj(selectObjs,addObjTxts){
    if(arguments.length>=3||arguments.length<=1){
        throw 'addObj函数所传递的参数个数不对，请确保传递了两个参数';
        return;
    }

    if(typeof arguments[0] == "object"){
        if(arguments[0].length!=arguments[1].length){
            throw 'addObj函数所传递的参数的长度不一致';
            return;
        }
    }
    if(typeof arguments[0] == "string"){
        $(arguments[0]).after(arguments[1]);
    }
    else{
        for(let i in selectObjs){
            $(selectObjs[i]).after(addObjTxts[i]);
        }
    }
}
