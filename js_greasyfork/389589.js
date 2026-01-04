// ==UserScript==
// @name         今年一定島 只開啟一個webm影片
// @description  汲汲營營大報社
// @author       稻米
// @namespace    https://greasyfork.org/zh-TW/scripts/389589
// @version      2025.04.21.0010.build16299

// @match        *://gaia.komica.org/00b/*
// @match        *://gaia.komica1.org/00b/*
// @match        *://gita.komica1.org/00b/*


// @exclude      *://*/00b/src/*
// @exclude      *://*/00b/thumb/*

// @grant        none
// @license      WTFPL


// @downloadURL https://update.greasyfork.org/scripts/389589/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%8F%AA%E9%96%8B%E5%95%9F%E4%B8%80%E5%80%8Bwebm%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/389589/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%8F%AA%E9%96%8B%E5%95%9F%E4%B8%80%E5%80%8Bwebm%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==





//jquery
try{}
catch(err){}
finally{}
//throw "stop";

$(document).ready(function() {
    //console.log( 'jquery ready' );
    //全域變數//global
    //window.var190830=[];
    //$.gginin=window.gg;
    var FFF='';
    FFF=$('#postform');
    //console.log( FFF );
    var cc=0;
    if(FFF.length>0){cc=cc+1;}
    //
    if(cc >0){
        poi();
    }
    //

});

function poi230120收起影片(in1){//收起影片
    //console.log( 'poi230120' );
    //console.log( in1 );
    var time=in1;
    var FFF;
    //
    var aa3=$('video');//全部的video
    aa3.each(function( index,item ) {
        //console.log( index,item );//video
        //var aa2a=$(item).parent().find('.expanded-close.text-button');//寫著收回的按鈕
        var aa2a=$(item);//.parents(); 跟 parent() 不同
        //console.log( aa2a );//寫著收回的按鈕
        if($(item).attr('poi210530')==time){
            //console.log('yy');
            //沒事
        }else{
            //console.log('nn');
            //console.log('收起影片');
            FFF=$(item).parent().find('.expanded-close.text-button');//寫著收回的按鈕
            //console.log( FFF );
            //FFF.click();//收起影片 不要用原生收合按鈕 位置會跑掉
            //
            //手刻模擬收合
            FFF=$(item).parent().prev();//被隱藏的縮圖
            //console.log(FFF);
            //讓縮圖顯示
            FFF.css({'display':'inline',});
            FFF=$(item).parent();//動態新增的元素
            //console.log('動態新增的元素',FFF);
            FFF.remove();//移除

        }
    });

}//poi230120()

function poi230120是否靜音(in1){//切換靜音
    var 目標元素=in1;//點縮圖後產生的video
    //console.log('poi230120切換靜音');
    //
    var json;
    var FFF;

    //影片開啟聲音的手動控制
    var aa2=$(目標元素).prev().find('span');//點縮圖後產生的收合按鈕 //動態元素
    aa2.css({
        "background-color":"yellow",
        "border":"1px solid #000",
    });//連結上背景色 不想上色就把這段刪除
    var str='<span class="poi230120mute">🔕</span>';
    FFF=aa2.parent().append( str );
    //console.log( FFF );//.parent() //
    $('.poi230120mute').css({
        "background-color":"yellow",
        "border":"1px solid #000",
        'cursor':'pointer',
    });//連結上背景色 不想上色就把這段刪除

    //
    //aa[0].muted=false;//解除靜音
    //aa.prop('muted', false);//解除靜音
    //aa[0].volume = 0.5;//設定音量

    //console.log( FFF );
    //localStorage.setItem('image', 'myCat.png');
    //localStorage.removeItem('image');
    //window.localStorage.removeItem('poi230120');
    //console.log( '重置' );


    //FFF=window.localStorage.poi230120;
    //console.log( FFF );

    //初始化資料 1=有聲音 0=沒聲音
    FFF=window.localStorage.getItem('poi230120');
    //FFF=window.localStorage.poi230120;
    //console.log( FFF );

    var 是否重新建立=0;

    if( FFF === null ){ //沒有資料=建立第一次的資料
        console.log( '沒有資料' );
        是否重新建立=1;
    }//if
    //FFF=window.localStorage.getItem('poi230120');
    //
    try{
        json = JSON.parse( FFF );//字串轉json
        if( json.版本 != 100 ){//檢查版本
            是否重新建立=1;
        }//if
    }catch(e){
        //有錯誤會跑到這邊
        console.log( e );
        //throw "json讀取失敗";
        是否重新建立=1;
    }finally{
        console.log( 'try-catch檢查點' );
    }
    //

    if( 是否重新建立==1 ){
        console.log( '資料重新建立' );
        window.localStorage.removeItem('poi230120');//拋棄舊版本資料
        var 初始資料json字串=`{"版本":100,"是否靜音":1,"音量":1,"陣列":["bb1","bb2"]}`;
        window.localStorage.poi230120=初始資料json字串; //寫入初始資料
        //重新讀取
    }//if

    //FFF=window.localStorage.poi230120;
    FFF=window.localStorage.getItem('poi230120');
    json = JSON.parse( FFF );//讀取 //字串轉json
    //console.log( json );//讀取


    //讀取json內容設置是否靜音
    if( json.是否靜音 ==1 ){
        目標元素.muted=true;//靜音
        $('.poi230120mute').text('🔕');
    }else{
        目標元素.muted=false;//解除靜音
        $('.poi230120mute').text('🔔');
    }//if

    //點擊鈴鐺 切換靜音狀態
    $('.poi230120mute').on('click',function(e){
        console.log('click鈴鐺');
        FFF=window.localStorage.poi230120;
        json = JSON.parse( FFF );
        //console.log( json );
        //console.log( json.是否靜音 );
        //
        if(json.是否靜音==1){//切換狀態
            //1->0
            //console.log( 'json.是否靜音==1' );
            json.是否靜音=0;
        }else{
            //0->1
            json.是否靜音=1;
        }
        //

        if( json.是否靜音==1 ){ //根據鈴鐺狀態改變音量
            //1=靜音
            目標元素.muted=true;//靜音
            $('.poi230120mute').text('🔕');
        }else{
            //0=有聲
            目標元素.muted=false;//解除靜音
            $('.poi230120mute').text('🔔');
                
            if(目標元素.volume == 0){
                目標元素.volume=0.5;
            }
        }//if

        json.音量=this.volume;
        //console.log( json );
        let json_str=JSON.stringify(json);
        window.localStorage.poi230120=json_str;//寫入

    });//on=click
/*
            //解除靜音 但音量被設置=0的情況 調整音量=50%
            if( 目標元素.volume == 0 ){
                目標元素.volume = 0.5;
            }
            //音量被設置=0的情況 嘗試解除靜音 便調整音量=50%
            if( this.muted ==0 ){
                this.volume=0.5;
                json.是否靜音=0;
            }

*/




    //return;
    //監視音量改變 同步更改鈴鐺的狀態
    $(目標元素).on('volumechange', function() {
        console.log( '靜音狀態='+this.muted, '音量='+this.volume );
        FFF=window.localStorage.poi230120;
        json = JSON.parse( FFF );//讀取
        //console.log( json );
        //
        //return;

        if(this.muted){
            //1=靜音
            json.是否靜音=1;
        }else{
            //0=有聲
            json.是否靜音=0;
        }//if
        //特例//音量=0
        if( this.volume == 0 ){ 
            //靜音=音量0
            json.是否靜音=1;
            //this.muted=1;
        }else{
            //有聲
        }//if

        //console.log('json.是否靜音', json.是否靜音 );

        if( json.是否靜音==1 ){
            //靜音
            目標元素.muted=true;//靜音
            $('.poi230120mute').text('🔕');
        }else{
            //有聲
            目標元素.muted=false;//解除靜音
            $('.poi230120mute').text('🔔');

        }
        //
        json.音量=this.volume;
        //console.log( json );
        let json_str=JSON.stringify(json);
        window.localStorage.poi230120=json_str;//寫入
    });//on=volumechange

}//poi230120是否靜音

function poi230120影片置頂(in1){//影片置頂
    //console.log( '影片置頂' );
    //點開影片後將影片位置置頂
    var 目標元素=in1;
    var FFF;

    console.log( 目標元素 );

    //aa.one( "loadedmetadata	" ,function(event){

    目標元素.one("timeupdate",function(event){ //只執行一次的on 開始撥放就置頂
        console.log( '影片置頂' );
        //console.log( this.currentTime , this.duration );//現在播放的時間點 //影片全長

        FFF=$(this).parent().parent();
        //console.log( FFF );
        //FFF=FFF.find('.post-head');
        FFF=FFF.attr('id');
        //console.log( FFF );
        window.location.hash='#'+FFF;//取得id位置

        //FFF=FFF.prop('offsetTop');//取得捲軸位置
        //$(document).scrollTop(FFF);//捲軸移動到video的開頭???
    });

    目標元素.one( "progress" ,function(event){
        //console.log( "progress" );
    });
}

function poi(){
    var FFF;
    var aa0=$('.file-thumb');
    //console.log( aa0 );
    //$('.file-thumb').on('click',function(e){//.file-thumb綁自己 //沒綁到動態元素
    $('body').on('click','.file-thumb',function(e){//body綁.file-thumb //有綁到展開後的動態元素
        //console.log('click .file-thumb'); //ok
        //
        //從附檔名過濾出webm
        FFF=$(this).parent();//縮圖&影片所在的留言位置
        //console.log(FF);
        FFF=FFF.find('.file-text').text();//檔名 //純文字
        FFF=FFF.includes("webm");
        //console.log( FFF ); //ture
        if(FFF){
            //console.log( 'yy' ); //ture
            //沒事
        }else{
            //不是影片
            return 0;//結束
        }




        //標記點擊的影片
        var aa=$(this).next().find('video');//點縮圖後產生的video //動態元素

        aa.css({
            "max-width": "640px",
            "max-height": "640px",
            "min-width": "360px",
            "min-height": "360px",
            "width": "auto",
            "height": "auto",
            //'border-right':'5px solid #F0F',
            'box-shadow':'5px 10px 0px 0px #F0F',
        });//影片的最大長寬
        var time=Date.now();//時間戳
        //console.log('新的時間='+time);
        aa.attr('poi210530',time);//給影片元素新增標籤
        //console.log(aa[0]);//

        //多個影片收合
        poi230120收起影片(time);//多個影片收合
        poi230120影片置頂(aa);//先收合其他影片 再置頂


        //return 0;

        poi230120是否靜音( aa[0] );

        //return 0;













    });
}



/*
展開後的動態元素 不能綁定事件?

*/
