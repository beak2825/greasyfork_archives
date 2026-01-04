// ==UserScript==
// @name         今年一定島 查ID改二
// @description  汲汲營營大報社
// @author       稻米
// @version      2022.11.29.0030.build16299
// @namespace    https://greasyfork.org/zh-TW/scripts/455579

// @include      *://*.komica.org/00/*
// @include      *://*.komica.org/00/*
// @exclude      *://*.komica.org/00/src/*
// @exclude      *://*.komica.org/00/thumb/*
// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm

// @grant        none
// @license      WTFPL


// @downloadURL https://update.greasyfork.org/scripts/455579/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%9F%A5ID%E6%94%B9%E4%BA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/455579/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%9F%A5ID%E6%94%B9%E4%BA%8C.meta.js
// ==/UserScript==




//jquery
try{
    $(document).ready(function() {
        poi();
    });
}
catch(err){}
finally{}
//
function 檢查頁面(){
    var cc=0;
    //
    var FFF;
    FFF=$("div.bar_reply:contains('回應模式')");
    if(FFF.length ==1){cc++;}
    FFF=$('.thread');
    if(FFF.length >1){cc++;}
    //
    if(cc>0){
        poi();
    }
}

function poi(){
    var FFF='';
    //FFF=$(".id").html();
    $(".id").each(function(){
        FFF=$(this).html().substr(3,8);
        FFF='<button class="cls_poi221127">查ID</button >';
        $(this).after(''+FFF);
    });
    //
    poi2();
}//function poi(){

function poi2(){
    $('button.cls_poi221127').on('click',function(e){
        console.log('click');
        //console.log( $(this) );
        e.preventDefault();//取消事件的預設行為
        e.stopPropagation();//取消事件傳遞到下一層
        //
        var aa=$(this).parent().find('.id').data();//.data()['id']=U9QoMqwE
        //console.log(aa['id']);//U9QoMqwE

        //poi3( this,aa['id'] );
        poi2建立輸入框( this,aa['id'] );
        //history.pushState('','','123');

    });
}
function poi2建立輸入框(in1,id){
    console.log( 'poi2建立輸入框' );
    //
    console.log( in1.offsetTop ,in1.offsetLeft );

    var FFF;
    FFF=$(in1).position();
    console.log( FFF );
    FFF=$(in1).offset();
    console.log( FFF );

    //var xx=FFF['top'],yy=FFF['left'];
    var [xx,yy]=[FFF['top'],FFF['left']];
    console.log( xx,yy );


    FFF='';
    FFF='<div id="poi221129box"></div>';
    $('#poi221129box').remove();
    //$("div#contents").after(FFF);
    $("body").append(FFF);
    $('#poi221129box').css({
        'background':'rgb(200,200,200)',
        'color':'rgb(100,100,100)',
        'text-align':'initial',
        'width':'100px',
        'height':'50px',
        'position':'absolute',
        'top':xx,
        'left':yy,
    });

    FFF='';
FFF=`
<form id="poi221129form" name="find_id" method="post" action="./pixmicat.php?mode=search"  target="_blank">
<input type="text" name="keyword" value="${id}" size="8">
<input type="hidden" name="field" value="now">
<input type="hidden" name="method" value="AND">
<input type="submit" value="查">
</form>
`;
    //
    $('#poi221129box').html( FFF );
}


function poi3沒用到(in1){

    var jqXHR=$.ajax({
          url: './pixmicat.php?mode=search',
          type: 'POST',
          data: { keyword: in1 , field:"now", method:'AND' },
    });
}


/*
https://komica-cache.appspot.com/?search=ID&q=X6stzlu6
https://www.homu-api.com/search?id=X6stzlu6
*/
