// ==UserScript==
// @name         181113 看ID
// @namespace    https://greasyfork.org/zh-TW/scripts/374306
// @description  汲汲營營大報社
// @author       稻米
// @version      2022.02.27.0010.build16299


// @include      http://*.komica.org/00/*
// @include      https://*.komica.org/00/*
// @include      http://*.komica2.net/00/*
// @include      https://*.komica2.net/00/*
// @include      http://*.komica2.net/*/pixmicat.php?res=*
// @include      https://*.komica2.net/*/pixmicat.php?res=*

// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/374306/181113%20%E7%9C%8BID.user.js
// @updateURL https://update.greasyfork.org/scripts/374306/181113%20%E7%9C%8BID.meta.js
// ==/UserScript==

//jquery
try{
    $(document).ready(function() {
        //console.log(arguments.callee.name); //
        //console.log( 'jquery ready' );
        //全域變數//global
        time = new Date();
        gg=[];
        gg.time=time;
        gg[poi]=null;
        $.gginin=gg;
        //
        poi();
    });
    //throw "is empty";
}
catch(err){
    console.log( ''+err.message );
}
finally {
    //console.log( 'try-catch-finally' );
}
////

function poi(){
    //只在回應模式有效
    //console.log(arguments.callee.name); //
    //console.log(window.location.href);
    //console.log(tmp);
    if( window.location.href.match("\\?res=") ){
        //console.log('回應');
        if( $('div.thread').length == 1 ){
            poi2();
        }
    }else{
        //console.log('非回應');
    }
}//poi(){

function poi2(){
    //產生按鈕
    //console.log(arguments.callee.name); //poi2
    //$("#threads").before('before');
    var FFF='181113 看ID';
    $(".thread").before('<poi><button type="reset">'+FFF+'</button></poi>');
    $('poi >button:contains("'+FFF+'")').click(function(){
        //console.log('按鈕');
        poi3();
    });
    //

}//poi2(){



function poi3(){
    var cc=0;
    var FFF='';
    $(".post").each(function(k,v){
        FFF='';
        FFF=$(this).find(".now").next().text();
        //FFF=FFF.substring(0,5);
        FFF=FFF.substr(-3);
        console.log( FFF );
        FFF=poi3b( FFF );
        console.log( FFF );
        FFF[3]=$(this).find(".id").attr('data-id');
//ES6 String Template
FFF[0]=`
<span style='color:#f00;font-weight:bold;'>
${FFF[0]}
</span>
`;
FFF[1]=`
<span style='color:#0f0;font-weight:bold;'>
${FFF[1]}
</span>
`;
FFF[2]=`
<span style='color:#00f;font-weight:bold;'>
${FFF[2]}
</span>
`;
FFF[3]=`
<span style='color:#000;font-weight:bold;'>
${FFF[3]}
</span>
`;
        FFF='<code>'+FFF[3]+'手拿'+FFF[1]+'，是'+FFF[0]+FFF[2]+'！'+'</code>';
        $(this).find(".quote").after( FFF );

    });

}//poi3()

function poi3b(x){
var a1=['神族','人族','矮人','精靈','龍人','貓人','狼人','魚人','鳥人','魔人'];
var a2=['空手','短劍+盾','雙手劍','弓箭','長矛','雙手斧','長棍','權杖','鞭','錘'];
var a3=['無業','戰士','學者','學徒','竊賊','法師','牧師','僧人','農民','商人'];
//console.log( a1,a2,a3 );
//console.log( x.substr(0,1),x.substr(1,1),x.substr(2,1) );
//console.log( a1[x.substr(0,1)],a2[x.substr(1,1)],a3[x.substr(2,1)] );
return [a1[x.substr(0,1)],a2[x.substr(1,1)],a3[x.substr(2,1)]];
}

function poi0(){}


/*
http://www.homu-api.com/
http://www.homu-api.com/follow/10455981
http://homu.homu-api.com/res/10455438
http://homu.homu-api.com/page/0
*/
