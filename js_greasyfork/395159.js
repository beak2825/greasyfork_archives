// ==UserScript==
// @name        推特手機版網頁 top v2
// @namespace   https://greasyfork.org/zh-TW/scripts/375902
// @version     2019.01.03.1604
// @description description
// @author      author
// @@run-at     document-start
// @include     https://twitter.com/*
// @include     https://t.co/*
// @downloadURL https://update.greasyfork.org/scripts/395159/%E6%8E%A8%E7%89%B9%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%20top%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/395159/%E6%8E%A8%E7%89%B9%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%20top%20v2.meta.js
// ==/UserScript==

//jquery
try{
    $(document).ready(function() {
        console.log( 'document ready' );//不會執行這段
    });
    //throw "is empty";
}
catch(err){}
finally{}

document.addEventListener("DOMContentLoaded",function(e){
    console.log( "DOMContentLoaded" );
});
document.addEventListener('readystatechange', function(e){
    console.log( 'readystatechange',this.readyState );
});
window.addEventListener('popstate', function(e){
    console.log( 'popstate' );
});
window.addEventListener('hashchange', function(e){
    console.log( 'hashchange' );
});
window.addEventListener('locationchange', function(){
    console.log('locationchange');
})
window.addEventListener('load', function(e){
    console.log( 'load' );
    //poi();


    window.poi200114_poi2url='';
    poi();//window.location.href
});

function poi(){
    setTimeout(function(e){
        if(window.location.href == window.poi200114_poi2url){
            //沒事
            console.log( '網址沒變');
        }else{
            //
            console.log( '網址改變了',window.location.href );
            window.poi200114_poi2url=window.location.href;
            poi_findimg();
        }
        //
        poi();//top
    }, 0.5*1000);


}
function poi_findimg(){
    setTimeout(function(e){
        var aa = document.querySelector('body');
        //aa=aa.querySelector('div.css-1dbjc4n');
        var aa2=aa.querySelectorAll('div[aria-label="圖片"] > img');
        //var aa3=aa.querySelectorAll('div[aria-label="圖片"]');
        var aa3=aa.querySelector('div[aria-label="圖片"]');
        var aa4=aa.querySelector('ul[role="list"]');
        if(aa4){
            poi_191127(aa4);
        }
        //console.log( aa2 );
        //console.log( aa3  );
        if(aa2.length ){
            //有找到
            //從網址找index
            var str=window.location.href;
            var re = /photo\/([0-9])/;
            var found = str.match(re);
            //console.log( found );
            if(found){
                var img_index=found[1];
                aa2=aa2[img_index-1];
                //console.log(aa2);//目標

				//新增元素
                var ee1=document.querySelector("#poi200114");
                if(ee1){
                    //已存在
                    ee1.outerHTML = "";//刪除舊的
                    aa2.insertAdjacentHTML('afterend', '<div id="poi200114">afterend</div>');
                    //aa3.insertAdjacentHTML('afterend', '<div id="poi200114">afterend</div>');
                }else{
                    //aa.insertAdjacentHTML('beforeend', 'ppp');
                    //aa.insertAdjacentHTML('beforebegin', '<div id="poi200114">beforebegin</div>');
                    aa2.insertAdjacentHTML('afterend', '<div id="poi200114">afterend</div>');
                    //aa3.insertAdjacentHTML('afterend', '<div id="poi200114">afterend</div>');
                }

                //新的位置
                ee1=document.querySelector("#poi200114");
                ee1.innerHTML='清空';


                //console.log( aa2.naturalWidth , aa2.naturalHeight );
                var ss1=''+aa2.naturalWidth +'x'+ aa2.naturalHeight;
                var ss2='';
                ss2=ss2+'<span style="color:#FF0000;">'+ss1+'</span>';
                ss2=ss2+'<span style="color:#00FF00;">'+ss1+'</span>';
                ss2=ss2+'<span style="color:#0000FF;">'+ss1+'</span>';

                //aa2.insertAdjacentHTML('afterend', ','+ss2);
                ee1.insertAdjacentHTML('afterbegin', '<br/>'+ss2);
                //aa3.insertAdjacentHTML('afterend', '載入1');

                aa2.addEventListener('load', function(e) {
                    //console.log( '圖片載入了'+elem.src );
                    //console.log( aa2.naturalWidth , aa2.naturalHeight );
                    var ss1=''+aa2.naturalWidth +'x'+ aa2.naturalHeight;
                    var ss2='';
                    ss2=ss2+'<span style="color:#FF0000;">'+ss1+'</span>';
                    ss2=ss2+'<span style="color:#00FF00;">'+ss1+'</span>';
                    ss2=ss2+'<span style="color:#0000FF;">'+ss1+'</span>';

                    //aa2.insertAdjacentHTML('afterend', '<br/>'+ss2);
                    ee1.insertAdjacentHTML('afterbegin', '<br/>'+ss2);
                    //aa3.insertAdjacentHTML('afterend', '載入2');
                });

            }

        }else{
            //console.log('重試poi_findimg');
            poi_findimg();//top
        }




    }, 0.5*1000);


    //poi_191127(aa);
    //return aa.length;
}//poi









function poi_191127(in1){ //沒用到
    var aa=in1;
/*
https://wangdoc.com/javascript/dom/mutationobserver.html
Mutation Observer API 用来监视 DOM 变动。DOM 的任何变动，比如节点的增减、属性的变动、文本内容的变动，这个 API 都可以得到通知。
*/

	const observer = new MutationObserver(function(mutations, observer){
		mutations.forEach(function(mutation) {
			console.log(mutation); //列舉變動
		});
        //console.log('??');

	});
	var article = document.querySelector('div.css-1dbjc4n');
    article=aa;
    //article=article.querySelector('img');
    console.log(article); //
	//var article = document; //整個網頁

	var options = {
	  'attributes':true,
	  'characterData':true,
	  'childList': true,
	  'subtree':true,
	  //'attributeOldValue':true,
	  //'characterDataOldValue':true,
	  //'attributeFilter':['class','src'],
	} ;
	observer.observe(article, options);
	//observer.disconnect();
}//poi_191127()









