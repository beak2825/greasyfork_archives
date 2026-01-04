// ==UserScript==
// @namespace    https://greasyfork.org/zh-TW/scripts/35430
// @name         今年一定島 畫布
// @description  汲汲營營大報社
// @author       稻米
// @version      2022.02.27.0010.build16299


// @include      *://*.komica.org/00/*
// @include      *://*.komica.org/00/*
// @exclude      *://*.komica.org/00/src/*
// @exclude      *://*.komica.org/00/thumb/*
// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm

// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/35430/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E7%95%AB%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/35430/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E7%95%AB%E5%B8%83.meta.js
// ==/UserScript==




//jquery
try{
    $(document).ready(function() {
        //console.log( 'jquery ready' );
        //全域變數//global
        //time = new Date();
        //gg=[];
        //FFF='';
        //
        poi(); //poi()->ppp()->延遲()->ppp_canvas()
    });
    //throw "is empty";
}
catch(err){
    console.log( ''+err.message );
}
finally {
    //console.log( 'jquert測試' );//try-catch-finally
}



function poi(){
    //FFF=$(".id").html();

    //console.log( ''+FFF );
    //console.log( $("#web-ad").attr('id') );
    $("#web-ad").attr('id','poi171120_1');
    $("#web-ad").attr('id','poi171120_2');
    $("#web-ad").attr('id','poi171120_3');
    $("#web-ad").attr('id','poi171120_4');
    //console.log( $("#new_id").attr('id') );
    $("#poi171120_1").html('廣告');
    $("#poi171120_2").html('廣告');
    $("#poi171120_3").html('廣告');
    $("#poi171120_4").html('廣告');
    //
    $("#poi171120_1").css({
        "border":"1px solid #000",
        "display":"inline",
    });//連結上背景色 不想上色就把這段刪除
    $("#poi171120_2").css({
        "border":"1px solid #000",
        "display":"inline",
    });//連結上背景色 不想上色就把這段刪除
    $("#poi171120_3").css({
        "border":"1px solid #000",
        "display":"inline",
    });//連結上背景色 不想上色就把這段刪除
    $("#poi171120_4").css({
        "border":"1px solid #000",
        "display":"inline",
    });//連結上背景色 不想上色就把這段刪除
    //
    $("#poi171120_3").html('');
    $("#poi171120_3").append('<span id="start">點我</span>');
    $("#poi171120_3 > #start").click(function(){
        ppp();
    });
    //

}//function poi(){


function ppp(){
    $("#poi171120_3").css({
        "display":"block",
        "border":"none",
    });//連結上背景色 不想上色就把這段刪除
    $("#poi171120_3").html('<div id="poi171117_base" tabindex="1">tabindex</div>');// href="#poi171117_a"
    $("#poi171117_base").css({
        "background-color":"rgba(0,255,255,0.5)",
        "border":"1px solid #000",
        "width":400,
        "height":300,
        "display":"block",
        "overflow":"hidden",
        "position":"relative",
    });//連結上背景色 不想上色就把這段刪除

    $("#poi171117_base").append('<span id="poi171117_span">span</span>');
    $("#poi171117_span").css({
        "background-color":"green",
        "opacity":"0.5",

        "border":"1px solid #000",
        "width":100,
        "height":100,
        "display":"inline-block",
        "position":"absolute",
        "z-index":"100",

        "top":"0px",
        "left":"-50px",

    });//連結上背景色 不想上色就把這段刪除

    $("#poi171117_base").append('<span id="poi171117_span_01">span</span>');
    $("#poi171117_span_01").css({
        "background-color":"#ddd",
        "border":"1px solid #000",
        "width":100,
        "height":100,
        "display":"inline-block",
        "position":"absolute",
        "z-index":"100",
        "top":"100px",
        "left":"100px",

    });//連結上背景色 不想上色就把這段刪除

    var xx,yy;
    //xx=document.getElementById("poi171120_3");
    xx=$("#poi171120_3").css('width');
    yy=$("#poi171120_3").css('height');
    FFF=xx+'_'+yy;
    console.log( FFF );

    FFF=xx+'_'+yy;
    $("#poi171117_span_01").html(''+FFF);
    //取得焦點時的反應
    $("#poi171117_base").focus(function() { //focusin
        //$( this ).blur();
        console.log( 'focus' );
        xx=$("#poi171120_3").css('width');
        yy=$("#poi171120_3").css('height');
        FFF=xx+'_'+yy;
        $("#poi171117_span_01").html(''+FFF);
        $("#poi171117_span_01").css({
            "background-color":"green",
        });//連結上背景色 不想上色就把這段刪除
    });
    //失去焦點時的反應
    $("#poi171117_base").blur(function() { //
        console.log( 'blur' );
        $("#poi171117_span_01").css({
            "background-color":"#FFF",
        });//連結上背景色 不想上色就把這段刪除

    });



    //FFF=document.getElementById("poi171117_a");
    //console.log( FFF );

    //
    延遲();
    //
}

function 延遲(){
    $('<delay/>').delay(1000).queue(function(next){//延遲1秒後 執行隊列
        //
        ppp_canvas();
        //$('<delay/>').dequeue();//清除隊列
        //next();
    });//delay
}//function 延遲()


function ppp_canvas(){
    var newCanvas = $('<canvas/>',{'id':'poi171120_canvas','Width':100,'Height':200});
    //$("#poi171120_2").html('');
    $('#poi171117_base').append(newCanvas);
    $("#poi171120_canvas").css({
        "position":"absolute",
        "z-index":"-1",
        "top":"0px",
        "left":"0px",
    });//連結上背景色 不想上色就把這段刪除

    var canvas=document.getElementById("poi171120_canvas");
    if(canvas.getContext){
        canvas.width = 400;
        canvas.height = 300;

        var ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(20,20);
        ctx.lineTo(20,100);
        ctx.lineTo(70,100);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle="green";
        ctx.fill();

        var gradient=ctx.createLinearGradient(0,0,400,0);
        gradient.addColorStop("0","magenta");
        gradient.addColorStop("0.5","blue");
        gradient.addColorStop("1.0","red");

        //ctx.strokeStyle="#0000ff";
        ctx.strokeStyle=gradient;

        var gg=[];
        gg[0]=[];
        gg[0][0]=0;
        gg[0][1]=1;
        gg[1]=0;
        gg[10]=0;
        var xx,yy;
        var timer = setInterval(function() {
            gg[0][0]=gg[0][0] + gg[0][1]; //步進值
            if(gg[0][0] > canvas.width){ //超過畫布
                gg[0][1]=gg[0][1] * (-1);
            }
            if(gg[0][0] < 0){ //超過畫布
                gg[0][1]=gg[0][1] * (-1);
            }
            xx=gg[0][0];
            //
            gg[1]=gg[1]+1;
            gg[10]=(canvas.height/2)+(canvas.height/2)*Math.sin( gg[1] *(Math.PI / 180) );
            yy=gg[10];
            //

            //console.log(gg[0]);
            //console.log(xx+','+yy);
            //

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //
            ctx.beginPath();
            ctx.moveTo(xx,yy);
            ctx.lineTo(300,150);
            ctx.moveTo(xx,yy);
            ctx.lineTo(200,200);
            ctx.lineWidth=10;
            ctx.stroke();
        }, 100);


    } else {
        // canvas-unsupported code here
    }




}//ppp()
