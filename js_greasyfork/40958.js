// ==UserScript==
// @name         Myfcu++
// @namespace    https://nicky.tw/
// @version      1.3
// @description  Change Myfcu menu to tree mode
// @author       Dream_Rhythm
// @match        https://myfcu.fcu.edu.tw/main/webClientMyFcuMain.aspx*
// @match        https://myfcu.fcu.edu.tw/main/InfoMyFcuLogin.aspx
// @downloadURL https://update.greasyfork.org/scripts/40958/Myfcu%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/40958/Myfcu%2B%2B.meta.js
// ==/UserScript==

function tree_maker(parent,name,FCUTree){
    $.each(FCUTree.menu.tree,function(idx,value){
        makeFolder(parent,name+idx,value);
    })
}

function makeFolder(parent,name,folderData){
    parent.append("<div id="+name+" style='width:250px;'> <img src='https://github.com/fcu-d0441320/UserScript-Myfcu/raw/master/icons/folder_close.png' width='25' height='25'>"+
            folderData.name+"</div><div class='"+name+"' style='display:none' ></div>");
    $('#'+name).click(function(){
        if($("."+name)[0].style.display=='block'){
            $("."+name).css('display','none');
            $('#'+name+' img').attr("src","https://github.com/fcu-d0441320/UserScript-Myfcu/raw/master/icons/folder_close.png");
        }
        else{
            $("."+name).css('display','block');
            $('#'+name+' img').attr("src","https://github.com/fcu-d0441320/UserScript-Myfcu/raw/master/icons/folder_open.png");
        }
        resizeMenu(parent);
    })
    let array = [];
    $.each(folderData.subs,function(idx,block){
        $.each(block.progs,function(idx2,value){
            array.push(value);
        })
    })
    $.each(array,function(idx,value){
        makeItem($("."+name),name,value,array.length-1==idx);
    });
    $.each($("."+name+" a"),
        function(idx,ele){
            $("."+name+" a").eq(idx).click(function(){

                $("html.ng-scope body.ng-scope table.table-root.div-main-show tbody tr td div.ng-binding.div-Balloon").eq(0).addClass('div-Balloon-hide');
                if($("."+name+" a").eq(idx).data("opennew")){
                    window.open($("."+name+" a").eq(idx).data("url"));
                }
                else window.location = $("."+name+" a").eq(idx).data("url");
            })
        }
    )
}
function makeItem(parent,name,data,isEnd){
    let url = "https://myfcu.fcu.edu.tw/main/webClientMyFcuMain.aspx#/prog/"+data.id;
    let html="<div style='height:23px;'>&nbsp;&nbsp;";

    if(isEnd==true)html+="└";
    else html+="├";

    if(data.openNew==true){
        html+="<a href='javascript: return false;' data-url='"+data.link+"' data-opennew=true";
    }
    else{
        html+="<a href='javascript: return false;' data-url='"+url+"' data-opennew=false";
    }
    html+=" style='color:black;white-space: nowrap' >&nbsp;&nbsp;"+data.name+"</a></div>";
    parent.append(html);
}
function makeSearchItem(parent,data){
    let isfind=false;
    $.each($("#menu_search a"),function(idx,ele){
        let thisStr = ele.innerHTML;
        if(thisStr===data.name){
            isfind=true;
        }
    })

    if(isfind)return;

    let url = "https://myfcu.fcu.edu.tw/main/webClientMyFcuMain.aspx#/prog/"+data.id;
    let html="<div style='height:25px;min-width:250px'>";

    html+="<img src=\"https://github.com/fcu-d0441320/UserScript-Myfcu/raw/master/icons/myfcu_icon.png\" width=\"18\" height=\"18\">"

    if(data.openNew==true){
        html+="<a href='javascript: return false;' data-url='"+data.link+"' data-opennew=true";
    }
    else{
        html+="<a href='javascript: return false;' data-url='"+url+"' data-opennew=false";
    }
    html+=" style='color:black;white-space: nowrap;' >"+data.name+"</a></div>";
    parent.append(html);
}

function GetAllAPP(){
    $.ajax({
       type: "POST",
       url: "https://myfcu.fcu.edu.tw/main/webClientMyFcuMain.aspx/GetAllAppData",
       headers:  {
           "Accept":"application/json, text/plain, */*",
           "Accept-Language":"zh-TW,en-US;q=0.7,en;q=0.3",
           "Cache-Control":"max-age=0, no-cache",
           "Pragma":"no-cache",
           "Content-Type": "application/json; charset=utf-8",
           "User-Agent":"Mozilla/5.0 (Windows NT 10.0;) Gecko/20100101 Firefox/61.0",
           "Set-Cookie":document.cookie
       },
       error: function(error){
           console.log(error)
       },
       success: function(data) {
           tree_maker($('#menu_oritree'),'oriFolder',data);
           $.each(data.menu.list,function(idx,value){
               makeSearchItem($("#menu_search"),value);
           })
           $.each($("#menu_search a"),function(idx,ele){
               $("#menu_search a").eq(idx).click(function(){
                    $("html.ng-scope body.ng-scope table.table-root.div-main-show tbody tr td div.ng-binding.div-Balloon").eq(0).addClass('div-Balloon-hide');
                    if($("#menu_search a").eq(idx).data("opennew")){
                        window.open($("#menu_search a").eq(idx).data("url"));
                    }
                    else window.location = $("#menu_search a").eq(idx).data("url");
               })
               $("#menu_search div").eq(idx).hide();
           })
           resizeMenu($('#menu_oritree'));
           resizeMenu($('#menu_search'));
       }
    });
}

function GetFCUAPPS(){
    $.ajax({
       type: "GET",
       url: "https://myfcu-nicky.firebaseio.com/myfcu.json",
       headers:  {
           "Accept":"application/json, text/plain, */*",
           "Accept-Language":"zh-TW,en-US;q=0.7,en;q=0.3",
           "Content-Type": "text/plain"
             },
       error: function(error){
           console.log(error)
       },
       success: function(data) {
           tree_maker($('#menu_fcuappstree'),'APPSFolder',data);
           resizeMenu($('#menu_fcuappstree'));
       }
    });
}

function resizeMenu(parent){
    if(parent.height()>document.body.clientHeight*0.75){
        parent[0].style.height=document.body.clientHeight*0.75+'px';
        parent[0].style.overflow='scroll';
    }
    else{
        parent[0].style.height='auto';
        parent[0].style.overflow='';
    }
}

if(self.location=='https://myfcu.fcu.edu.tw/main/InfoMyFcuLogin.aspx'){

}
else{
    let place= $(".div-Balloon").eq(0);
    var menu = place.children().eq(3);
    menu.attr('id','menu_ori');

    let html = '<div style="display: flex; flex-flow: row wrap;" id="menu_oritree"></div>';
    html += '<div style="display: flex; flex-flow: row wrap;" id="menu_fcuappstree"></div>';
    html += '<div style="display: flex; flex-flow: row wrap;" id="menu_search"><input id="searchBar" type="text" class="search form-control" placeholder="搜尋" style="width:100%"></div>';

    $("#menu_ori").after(html);
    $("#menu_ori").click(function(){
        $("html.ng-scope body.ng-scope table.table-root.div-main-show tbody tr td div.ng-binding.div-Balloon").eq(0).addClass('div-Balloon-hide');
    })
    $('#menu_oritree').hide();
    $('#menu_fcuappstree').hide();
    $('#menu_search').hide();

    let select = document.createElement('select');
    select.setAttribute("id", "MenuType");

    var option=document.createElement('option');
    option.setAttribute('value','menu_ori');
    option.innerHTML='官方版';
    select.appendChild(option);

    option = document.createElement('option');
    option.setAttribute('value','menu_oritree');
    option.innerHTML='官方樹狀版';
    select.appendChild(option);

    option = document.createElement('option');
    option.setAttribute('value','menu_fcuappstree');
    option.innerHTML='復刻Fcu Apps';
    select.appendChild(option);

    place.children().eq(1).after( '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div style="width: 160px; display: inline-block;"></div>' );
    place.children().eq(2).append(select);
    place.children().eq(2).append('&nbsp;&nbsp;');
    place.children().eq(2).append('<a id="goSearch" href="javascript:return false;"><img src="https://github.com/fcu-d0441320/UserScript-Myfcu/raw/master/icons/search.png" width="20" height="20"></a>');
    $('#MenuType').on('change', function() {
        $.each($('#MenuType option'),function(idx,ele){
            $('#'+ele.value).hide();
        })
        let val = $(this).find(":selected").val();
        $('#'+val).show();
        $('#menu_search').hide();
    });
    $("#searchBar").keyup(function(){
        let want = $("#searchBar").val();
        $.each($("#menu_search a"),function(idx,ele){
            let thisStr = ele.innerHTML;
            if(thisStr.match(want)!=null&&want!=""){
                $("#menu_search div").eq(idx).show();
            }
            else{
                $("#menu_search div").eq(idx).hide();
            }
        })
        resizeMenu($("#menu_search"));
    })
    $("#goSearch").click(function() {
        $('#menu_ori').hide();
        $('#menu_oritree').hide();
        $('#menu_fcuappstree').hide();
        $('#menu_search').show();
    });
    $("#searchBar").focusout(function() {
        if($("#searchBar").val()==""){
            $.each($('#MenuType option'),function(idx,ele){
                $('#'+ele.value).hide();
            })
            let val = $('#MenuType').find(":selected").val();
            $('#'+val).show();
            $('#menu_search').hide();
        }
    });
    $(".barbtn").eq(0).click(
        function(){
            let list = $("html.ng-scope body.ng-scope table.table-root.div-main-show tbody tr td div.ng-binding.div-Balloon.div-Balloon-hide");
            if(list.length==2)list.eq(0).removeClass('div-Balloon-hide');
            else $("html.ng-scope body.ng-scope table.table-root.div-main-show tbody tr td div.ng-binding.div-Balloon").eq(0).addClass('div-Balloon-hide');
        });
    $(window).resize(function() {
        resizeMenu($('#menu_oritree'));
        resizeMenu($('#menu_fcuappstree'));
        resizeMenu($('#menu_search'));
    });

    GetAllAPP();
    GetFCUAPPS();
}
