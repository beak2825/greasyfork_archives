// ==UserScript==
// @name        	PTT Long Change
// @description     Change on PTT.cc.
// @author          Lalong
// @include       	https://www.ptt.cc/bbs/*
// @include       	https://www.ptt.cc/man/*
// @include       	https://www.ptt.cc/ask/over18*
// @version       	2.7.12
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace       https://greasyfork.org/zh-TW/scripts/33714-ptt-long-change
// @grant			GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33714/PTT%20Long%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/33714/PTT%20Long%20Change.meta.js
// ==/UserScript==

GM_addStyle ( `
.topbar{
background-color:rgba(0, 0, 136, 0.4);opacity: 0;transition: opacity 0.3s;
}
.topbar:hover{
background-color:rgba(10, 106, 196, 0.4);opacity:1;
}
.push-userid{
height:31px;
display:inline-block;
transition: all 0.1s ease;
}
.push-userid:hover{
cursor:pointer;
}
.oPo{
position:absolute;
transition: all 0.1s ease;
display:inline-block;
cursor:pointer;
z-index:10;
}
.activeId{
background-color:#444;
border-radius:5px 5px 0px 0px;
}
.pushIdSelect{
background-color:navy;
}
a{
text-decoration:none;
}
a:visited{
color: #aaa;
}
a:hover{
color:black;
}
.pwe-floor{
position:absolute;
left:-4.5em;
width:4em;
text-align:right;
color:gray;
}
.pwe-hover{
border-radius:5px 0px 0px 5px;
text-align:center;
background-color:black;
color:white;
border:1.5px solid grey;
z-index: 5;
}
.id-backColor{
background-color:#113f1b;
}
.id-backColor.pushIdSelect{
background-color:navy;
}
.id_dropDown{
border-radius:0px 10px 10px 10px;
position: absolute;
background-color: #444;
z-index: 10;
white-space: nowrap;
display:none;
}
.drop-menu{
display: block;
padding: 1ex;
color: #aaa;
line-height: 1em;
}
.overlay{
position: absolute;
z-index:2;
background-color:#404040;
border-radius:3px 3px 3px 3px;
width:100%;
}
.overlay:hover, .title:hover{
background-color:#C0C0C0;
color:black;
cursor:pointer;
}
img{
cursor:pointer;
}
` );


var board = $('.board').eq(0).text().split(' ')[1];//看板名稱

$(document).ready(function(){
     var findA=$('a');
    var key=false;
    for(var aItem=0;aItem< findA.length;aItem++)
    {
        var aTarget=$('a').eq(aItem);
        if(/(?=.*imgur\.com\/a\/)/.test(aTarget.prop('href'))){
            setTimeout(mainF, 5000);
            key=true;
            break;
        }
    }
    if(!key){
        mainF();
    }
    //top bar
     $(document).scroll(function() {
         if( $(this).scrollTop() == 0 ){
             if($('#topbar-container').hasClass("topbar")){
                 $('#topbar-container').removeClass('topbar');
             }
         }
         else{
             if(!$('#topbar-container').hasClass("topbar")){
                 $('#topbar-container').addClass('topbar');
             }
         }
  });
});

function mainF(){
    //自動skip已滿18頁面
    if( $('.btn-big').length  > 0){$('.btn-big')[0].click();}
    //背景塗黑
    $('body').css('background-color','black');
    //頂端bar隱形樣式
    //$('#topbar-container').addClass('topbar');
    //$("#topbar").css({"background-color":"#0c0a66"})
    //底部bar去除
    $('#navigation-container').remove();
    //頂端bar右邊兩個去除
    //$(".right:contains('關於我們')").after('<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#113f1b" style="width:5%;">');
    $('.right').remove();
    //$("#html5colorpicker").addClass("right").addClass("small");

    var poName =$('.article-meta-value').eq(0).text().trim().split(' ')[0];

    //真‧推文的樓層
    var floorTop=$('.f2:contains("※ 發信站: 批踢踢實業坊")');
    var pushes;
    if(floorTop.length>0){
        pushes = floorTop.nextAll('.push');
    }
    else{
        pushes = $('.push');
    }
    var snNormal=0,snPush=0,snBad=0,snString='',hoverColor='';
    for(var i = 0; i<pushes.length; i++){
        var iNum = i + 1;
        var oMain=pushes.eq(i);
        if(oMain.children('.push-tag').length > 0)
        {
        //push-tag:'→ ','推 ','噓 '
        switch(oMain.children('.push-tag').text())
        {
            case '→ ':
                snNormal++;
                snString='第 '+snNormal+' <span style="color:#f66;">→</span>';
                hoverColor = 'white';
                break;
            case '推 ':
                snPush++;
                snString='第 '+snPush+' 推';
                hoverColor = 'white';
                break;
            case '噓 ':
                snBad++;
                snString='第 '+snBad+' 噓';
                hoverColor = '#f66';
                break;
        }
        var sPush = "<span class='pwe-floor' data-hover='"+snString+"' data-color='"+hoverColor+"'>"+iNum+" 樓 </span>";
        oMain.prepend(sPush);
        oMain.hover(function(){
            var oFinal=$(this).children('.pwe-floor');
            var oPushTag=$(this).children('.push-tag');
            oFinal.attr('data-floor',$(this).children('.pwe-floor').text());
            //oFinal.text(oFinal.attr('data-hover').replace(/\ /g, ''));
            oFinal.html(oFinal.attr('data-hover'));
            var oLeft = oFinal.position().left;
            var tagWidth = oPushTag.width();
            var tagLeft = oPushTag.position().left;
            var setWidth = (tagLeft+tagWidth-oLeft-16)+'px';
            oFinal.css('width',setWidth);
            oFinal.css('color',oFinal.attr('data-color'));
            oFinal.addClass('pwe-hover');
        },function(){
            var oFinal=$(this).children('.pwe-floor');
            oFinal.html(oFinal.attr('data-floor'));
            oFinal.css({'width':'','color':''});
            oFinal.removeClass('pwe-hover');
        });
        }
    }

    //先append div
    var dropDownHtml='<div class="id_dropDown"></div>';
    $('body').append(dropDownHtml);

    //含簽名檔的推文ID變色
    var pushesAll=$('.push');
    for(var j=0; j<pushesAll.length; j++){
        var pushesAllId = pushesAll.eq(j).children('.push-userid');
        var pushEqJ=pushesAll.eq(j);
        var id = pushesAllId.text().trim();
        if(id == poName){ //作者推文底色
            pushEqJ.addClass('id-backColor');
        }
        //推文設定id
        pushesAllId.attr('id',id);
        pushesAllId.addClass(id);
        pushEqJ.click(changeColor);
        pushesAllId.click(activeColor);
        pushesAllId.click(dropDownMenu);
    }

    body_click();

    var oPo=$('#main-content').find('.article-meta-tag:contains("作者")').next();
    var oPoName = oPo.text().trim().split(' ')[0];
    oPo.attr('id',oPoName);
    oPo.addClass('oPo');
    oPo.addClass(oPoName);
    oPo.click(activeColor);
    oPo.click(dropDownMenu);

    //更改標題為連結同標題看板搜尋
    var title =$('#main-content').find('.article-meta-tag:contains("標題")').next();
    var linktitle = title.text().replace('Re:','').trim();//去掉Re:的標題名稱
    title.addClass('title');
    title.click(function(){
        window.location.href = 'https://www.ptt.cc/bbs/'+board+'/search?q=thread%3A'+linktitle;
    });

    //Imgur網址隱藏(ptt網頁版會自動開圖)
    var allA=$('a');
    for(var aItem=0;aItem< allA.length;aItem++)
    {
        var aTarget=$('a').eq(aItem);
        if(/(?=.*imgur)/.test(aTarget.prop('href'))){
            aTarget.css('color','black');
        }
    }
    //Img點擊縮小放大
    $("img").click(slide);

    //去除低調
    $('.f0').removeClass('f0');

    //自動更新推文打開
    $('#article-polling').click();

    //移除"本網站已依台灣網站內容分級規定處理。此區域為限制級，未滿十八歲者不得瀏覽。"字眼
    $('.bbs-footer-message').remove();
};

function changeColor(){
    var id = $(this).children('.push-userid').prop('id');
    var target = $('.'+id).parent();
    if(target.hasClass('pushIdSelect')){
        target.removeClass('pushIdSelect');
    }
    else{
        $('.pushIdSelect').removeClass('pushIdSelect');
        target.addClass('pushIdSelect');
    }
};
function activeColor(){
     var target = $(this);
    if(!target.hasClass('activeId')){
        $('.oPo').removeClass('activeId',100);
        $('.push-userid').removeClass('activeId');
        target.addClass('activeId');
    }
};
function dropDownMenu(){
    var _this=$(this);
    _this.addClass('NowDropDown');
    var idDropDown=$('.id_dropDown');
    var iOffset=_this.offset();
    var top=iOffset.top+_this.outerHeight();
    var left=iOffset.left;

    if(idDropDown.hasClass('menuShow')){
        idDropDown.animate({left:left}, 100, 'linear');
        idDropDown.animate({top:top}, 100, 'linear');
    }
    else{
        idDropDown.css('top',top);
        idDropDown.css('left',left);
        idDropDown.fadeIn(150);
        idDropDown.addClass('menuShow');
    }
    writeDropMenu(_this.prop('id'));
};

function writeDropMenu(sId){
    //var sBoard=$('.article-metaline-right').find('.article-meta-value').text().trim();
    var sHtml='';
    sHtml += '<div>';
    sHtml += '<a href="/bbs/'+board+'/search?q=author:'+sId+'" class="drop-menu">Search 此板 '+sId+' 的文章</a>';
    sHtml += '<a href="/bbs/ALLPOST/search?q=author:'+sId+'" class="drop-menu">Search ALLPOST 板 '+sId+' 的文章</a>';
    sHtml += '<a href="https://www.google.com/search?q=site%3Aptt.cc%20'+sId+'" target="_blank" class="drop-menu" >Google PTT '+sId+'</a>';
    sHtml += '<a href="https://www.google.com/search?q='+sId+'" target="_blank" class="drop-menu" >Google '+sId+'</a>';
    sHtml += '</div></div>';
    $('.id_dropDown').html(sHtml);
}

function slide(){
    var target=$(this);
    if(!target.hasClass('imgSmall')){
        var pxHeight;
        var pxWidth;
        if(!target.hasClass('overDiv')){
            pxHeight = target.height()+'px';
            pxWidth = target.width();
            //var divWidth = target.parent().width()/2-pxWidth/2;
            target.parent().css('text-align','center');
            target.before('<div class="overlay">'+target.prop('src')+'</div>');
            target.prev().css('height','25px');
            //target.prev().css({'height':'25px','width':pxWidth+'px','left':divWidth+'px'});
            target.prev().click(clickDiv);
        }
        else{
            target.prev().show();
        }
        target.attr('data-height',pxHeight);
        target.addClass('imgSmall');
        target.addClass('overDiv');
        target.animate({width:pxWidth+'px'},1);
        target.animate({height:"0px"},100);
    }
}

function clickDiv(){
     var target=$(this).next();
    $(this).hide();
    if(target.hasClass('imgSmall')){
        target.removeClass('imgSmall');
        target.animate({height:target.attr('data-height')},101);
    }
}

function body_click(){
    $(document).on('click', function (evt) {
        if(!$(evt.target).parent().parent().hasClass('id_dropDown') && !$(evt.target).hasClass('NowDropDown')){
            $('.oPo').removeClass('activeId',100);
             $('.push-userid').removeClass('activeId',100);
            $('.NowDropDown').removeClass('NowDropDown');
            $('.id_dropDown').removeClass('menuShow');
            $('.id_dropDown').fadeOut(100);
        }
    });
};
