// ==UserScript==
// @name         pixiv_tags
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.pixiv.net/tags/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394533/pixiv_tags.user.js
// @updateURL https://update.greasyfork.org/scripts/394533/pixiv_tags.meta.js
// ==/UserScript==


document.addEventListener("DOMContentLoaded",function(e){
    console.log( "DOMContentLoaded" );
});
document.addEventListener('readystatechange', function(e){
    console.log( 'readystatechange',this.readyState );
});
window.addEventListener('load', function(e){
    console.log( 'load' );
    poi();
});

try{
    $(document).ready(function() {
        console.log( 'jquery ready' );
    });
}
catch(err){}
finally{}


function poi(){
    var aa = document.querySelector('body');
    //console.log( aa );
    var str='<button id="id200102">熱門</button>';
    aa.insertAdjacentHTML('afterbegin', str);
    //
    var dd = document.querySelector('button#id200102');
    console.log( dd );

    dd.addEventListener("click", function(x){
        poi2();
    });
}
function poi2(){
    var aa = document.querySelectorAll('section>div>aside>ul');
    console.log( aa );
    var bb = document.querySelector('section>div');
    console.log( bb );
    //bb.insertAdjacentHTML('beforeend', aa[0].outerHTML );
    var aa2 = document.querySelectorAll('section>div>aside>ul>li>div');
    console.log( aa2 );
    var str="<br/>";
    aa2.forEach(function(item,index){
        console.log( item,index );
        var aa3=item.querySelector('img');
        console.log( aa3.src,aa3.alt  );
        var aa4=item.querySelector('a');
        console.log( aa4.href );
        str=str+'<a href="'+aa4.href+'"><img src="'+aa3.src+'" style="width:auto;height:auto;max-width:100px;max-height:100px;"></a>'+index;
    });
    bb.insertAdjacentHTML('afterend', str);

}
