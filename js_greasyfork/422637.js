// ==UserScript==
// @namespace    https://greasyfork.org/zh-TW/scripts/422637
// @name         210304_homu-api
// @description  汲汲營營大報社
// @author       稻米
// @version      2022.02.27.0010.build16299
// @grant        none

// @include      *://www.homu-api.com/search?id=*
// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm

// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/422637/210304_homu-api.user.js
// @updateURL https://update.greasyfork.org/scripts/422637/210304_homu-api.meta.js
// ==/UserScript==

//jquery
try{
    $(document).ready(function() {
        console.log( 'jquery ready' );
        //color();
        poi_定時檢查();
    });
    //throw "is empty";
}
catch(err){}
finally{}

//poi();
function color(){
    $("div.dialog").css({
        //"background-color":"yellow",
        "border":"1px solid blue",
    });//"background-color","yellow"
}
function poi_定時檢查(){
    console.log( '定時檢查' );
    var timeoutID =window.setTimeout(slowAlert, 2*1000);
    function slowAlert(){
        //console.log( 'slowAlert' );
        var aa=$('div.dialog');
        if(aa.length>1){//數量正確
            //console.log( 'yy' );
            var cc=0;
            aa.each(function(index,item){
                var aa3=$(item).find("div.content");
                if(aa3.length>0){
                    //有找到
                }else{
                    //沒找到
                    return; // 等於continue
                }
                var aa2=$(item).attr('poi');//檢查有無poi屬性
                if(aa2=='123'){
                    //console.log( 'yy' );
                    cc++;
                }else{
                    //console.log( 'nn' );
                }
            });
            //
            if(cc==0){
                console.log( 'cc==0' );
                aa.each(function(index,item){
                    $(item).attr('poi','123');//沒有就增加屬性
                });
                //
                poi();//另外處理
            }
            //

        }else{
            //console.log( 'nn' );
        }
        poi_定時檢查();
    }
    //window.clearTimeout(timeoutID );
}

function poi(){
    var aa = $('div.dialog');
    //console.log( aa.length );
    var bb=[];
    var cc=0;
    aa.each(function(index,item){
        var aa3=$(item).find("div.content");
        if(aa3.length>0){
            //有找到
        }else{
            //沒找到
            return; // 等於continue
        }
        //
        console.log( index,item );
        cc++;
        //console.log( cc );
        var xx=$(item);
        var xx2=xx.find('div.content');
        //console.log( xx2.length );
        if( xx2.length >0 ){
            //xx.push(item);
            //xx.append(cc);
            //xx.attr('poi','123');
            var FFF=$(item).contents();
            //console.log( FFF[4] );
            FFF=$(FFF[4]).contents();
            //console.log( $(FFF[5]).text() );
            FFF=$(FFF[5]).text();//.trim();
            //console.log( FFF );
            FFF=FFF.match(/[0-9]+/);
            //console.log( FFF[0] ); //文章編號
            var aa100=FFF[0];

            var aa200=xx.find('div.message').find('a');
            var aa201=$(aa200).attr('href');
            //console.log( aa201 );//原串連結
            $(aa200).attr('href',aa201+'#r'+aa100);
            //
            color();

            //xx.remove("div.message");
            //xx.remove("div.split-line");
            //xx.remove("div.dialog-img-link");
            //xx.remove("div.content");
        }else{
            xx.append('end');
        }

    });

    //poi2(bb);
    //console.log(  );
}




function poi2(in1){
    var aa2=in1;
    console.log( aa2 );
    aa2=$(aa2);
    //
    var cc=0;
    aa2.each(function(index,item){
        //console.log( item );
        var bb=$(item);
        cc++;
        bb.append(cc);
        bb.remove(".message");
        bb.remove(".split-line");
        bb.remove(".dialog-img-link");
        bb.remove(".content");
        //var bb2=bb.find(".message");
        //console.log( bb2 );
        //var bb3=bb.remove(".message");
        //bb=bb.remove(".split-line");
        //bb=bb.remove(".dialog-img-link");
        //bb=bb.remove(".content");

        //console.log( $(item) );
    });

}



