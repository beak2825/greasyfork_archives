// ==UserScript==

// @name         今年一定島 拖放上傳
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/379459
// @version      2024.07.23.0010.build16299


// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gaia.komica2.cc/00b/*
// @match        *://gita.komica1.org/00b/*

// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/379459/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%8B%96%E6%94%BE%E4%B8%8A%E5%82%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/379459/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E6%8B%96%E6%94%BE%E4%B8%8A%E5%82%B3.meta.js
// ==/UserScript==



try{
    $(document).ready(function() {
        window.gg=[]; //globalVar
        gg.time=new Date();//可讀時間
        gg.timestamp=Date.now();//new Date().getTime();
        gg.inside=0;
        gg.cc=0;
        gg.cache='';
        $.gginin=gg;

        //
        poi();
        //color();
        color2();
        poi_change();
    });
}
catch(err){}
finally{}
//
function poi_filereader(input_file,elem_drop_box){
    //var FFF=$(this).prev(".drop_box");
    var FFF=elem_drop_box;
    //var file_path=$(this).val();
    //var file_path=$(this).prop('files');
    //file_path=file_path[0];
    if(input_file){
        console.log( input_file );
    }else{
        console.log( '空',FFF );
        FFF.empty();
        //FFF.html( '空' );
        return 0;
    }
    var file_type=input_file.type;
    //var res = str.match(/image/);//gi
    //var res = str.search("image");//
    //var res = str.indexOf("image");
    var res = file_type.split('/');
    //console.log( res );
    switch( res[0] ){
        case "image":
            //console.log( 'image=');
            //
            var reader = new FileReader();
            reader.onload = function(event){
                //console.log( event );
                FFF.html('<img class="image_droped">');
                var FFF2=FFF.find('img')[0];
                $(FFF2).on('load',function(e){
                    var str=''+this.naturalWidth+'x'+this.naturalHeight+'';
                    //console.log( str );
                });
                $(FFF2).attr({
                    'src': event.target.result,
                    'width':'auto',
                    'height':'100%',
                });
            };
            reader.readAsDataURL( input_file );
            //
            break;
        case "video":
            //console.log( 'video=');
            FFF.html( '影片' );
            break;
        default:
            //console.log('default=');
            FFF.html( '???' );
            break;
    }
}//poi_filereader()


function poi_change(){
    //console.log( 'poi_change' );
    var aa=$('input[type="file"]');
    //console.log( aa );
    $.each(aa,function(index,item){
        //console.log( index,item );
        $(item).on("change",function(e){
            console.log( 'change' );
            poi_filereader( $(this).prop('files')[0] , $(this).prev(".drop_box") );//
        });
    });
}



function color2(){
    var aa=document.styleSheets;
    //console.log( aa );
    //
    var str='';
str=`
.drop_box {
  border:1px solid black;
  width:auto;
  height:100px;
  display:block;
  padding:5px;
}
`;
    //str='.drop_box{border:1px solid black;width:100px;height:100px;}';
    str=str.replace(/\r\n|\n/g,"");
    //border:1px solid #000;
    document.styleSheets[2].insertRule(str,document.styleSheets[2].rules.length);//新增css規則
str=`
.drop_box_hover {
  background-color: yellow;
}
`;
    str=str.replace(/\r\n|\n/g,"");
    document.styleSheets[2].insertRule(str,document.styleSheets[2].rules.length);//新增css規則
    //
    var aa2=document.styleSheets;
    //console.log( aa2 );


}
function color(){
    //.css() sets style attribute of the $('#selector'). It does not create a css rule.
    $('.drop_box').css({
        'border':'1px solid #000',
        'width':'100px',
        'height':'100px',
        'display':'block',
        'padding':'5px',
    });

    $('.drop_box123').css({
        'background-color':'rgb(255,255,0)',
    });
}

function poi(){
    //console.log('poi');
var str=`
123
`;
    if(str==123){
        //console.log(str);
    }else{
        throw '停止';
    }
str=`
<div id='drop_box'>a</div>
<div id='fileDragName'>a</div>
<div id='fileDragSize'>a</div>
<div id='fileDragType'>a</div>
`;
str=`
<div class='drop_box123'>圖片預覽區</div>
`;
    $("input[type='file']").before(''+str);
str=`
<div class='drop_box' >拖放檔案至此</div>
`;
//style='border:1px solid black;width:100px;height:100px;'

    $("input[type='file']").before(''+str);
    //$("input[id='fupfile']").before(''+str);

    ///
    poi2();


}//poi()

function poi2(){
    //var drop_box = document.getElementById('drop_box');
    //var drop_box = document.getElementsByClassName('drop_box');
    //var drop_box = document.querySelectorAll('.drop_box');//querySelector

    //console.log( $('.drop_box') );
    var drop_box=$('.drop_box');
    //console.log( drop_box );

    drop_box.on('click',function(e){
        console.log( 'click' );
        //$(this).toggleClass("hover1");
        //this.classList.toggle("drop_box123");
        //this.classList.add("drop_box123");
        console.log( this.classList );
        //console.log( this );

    });


    drop_box.on('drop',function(e){
        //放置拖動的元素
        console.log('drop');
        e.stopPropagation();//終止事件傳遞到下一層
        e.preventDefault();//終止預設行為
        //this.classList.remove("hover");
        //$(this).removeClass("hover");
        //$(".drop_box123").html('成功');
        $(this).prev(".drop_box123").html('成功');//

        //
        var bb=$(this).next().prop('files');
        //console.log('上傳區的檔案=',bb);
        var aa=e.originalEvent.dataTransfer.files;
        //console.log('拖放區的檔案=',aa);
        //console.log('檔案數=',aa.length);
        if(aa.length == 1){
            if(bb.length == 0){
                console.log('首次載入檔案');
                poi_filereader( aa[0] , $(this) );//
                $(this).next().prop('files',e.originalEvent.dataTransfer.files);
            }
            if(bb.length == 1){
                if(aa[0].name == bb[0].name){
                    console.log('檔案相同');
                    poi_filereader( aa[0] , $(this) );//
                }else{
                    console.log('檔案不同');
                    poi_filereader( aa[0] , $(this) );//
                    $(this).next().prop('files',e.originalEvent.dataTransfer.files);
                }
            }

        }
        //$(this).toggleClass("drop_box_hover");//切換黃色背景
        $(this).removeClass("drop_box_hover");//移除黃色背景
        $.gginin.inside=0;//歸零


    });




    drop_box.on('dragenter',function(e){
        console.log('dragenter');
        e.stopPropagation();//阻止事件傳遞到下一層
        e.preventDefault();//阻止預設行為
        //
        $.gginin.cache=$(this).html();
        $(this).html('dragenter');
    });
    drop_box.on('dragover',function(e){
        console.log('dragover');
        e.stopPropagation();//阻止事件傳遞到下一層
        e.preventDefault();//阻止預設行為
        if($.gginin.inside >0){
        }else{
            $.gginin.inside++;//確認dragover是否是第一次觸發
        }
        $(this).addClass("drop_box_hover");//新增黃色背景
        $.gginin.cc++;
        poi2e( $.gginin.cc ,this );//文字特效

        //this.classList.add("hover");
        //this.classList.toggle("yy");
        //$(this).addClass("drop_box_hover");//變黃色背景
        //
    });
    drop_box.on('dragleave',function(e){
        console.log('dragleave');
        e.stopPropagation();//阻止事件傳遞到下一層
        e.preventDefault();//阻止預設行為
        //
        //$(this).toggleClass("drop_box_hover");//切換黃色背景
        $(this).removeClass("drop_box_hover");//移除黃色背景
        //$.gginin.cache=$(this).html();
        $(this).html('dragleave');
        $.gginin.inside=0;//歸零

    });


    drop_box.on('dragstart',function(e){
        console.log('dragstart');
    });
    drop_box.on('drag',function(e){
        console.log('drag');
    });
    drop_box.on('dragend',function(e){
        console.log('dragend');
        //this.classList.remove("hover");//??
        //$(this).removeClass("hover");
        e.stopPropagation();//阻止事件傳遞到下一層
        e.preventDefault();//阻止預設行為
    });


}//poi2()


function poi2e(cc,me){
    cc=cc%4;
    //console.log( cc );

    var str='－＼｜／';
    if(cc==0 || cc==4){str='－';}
    if(cc==1 || cc==5){str='＼';}
    if(cc==2 || cc==6){str='｜';}
    if(cc==3 || cc==7){str='／';}

    switch(cc){
        case 0:
            str='－';
            break;
        case 1:
            str='＼';
            break;
        case 2:
            str='｜';
            break;
        case 3:
            str='／';
            break;
        default:
            str='???';

    }



    $(me).prev(".drop_box123").html(str);//



    //
}//poi2e()


(function() {
    'use strict';

    // Your code here...
})();