// ==UserScript==
// @name         rarbg 大预览图
// @namespace
// @version      0.4.1
// @description  预览图替换成更大点的
// @author       You
// @match        https://rarbgprx.org/torrents.php*
// @match        https://rarbg.to/torrents.php*
// @match        https://rarbgaccess.org/torrents.php*
// @exclude      https://rarbgaccess.org/*__cf_chl_tk=*
// @exclude      https://rarbgaccess.org/*__cf_chl_rt_tk=*
// @grant        none
// @run-at document-end
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/381736/rarbg%20%E5%A4%A7%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/381736/rarbg%20%E5%A4%A7%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==

document.onmousemove = function(k) {


    if (pop.children[0]) {

        var h = k.pageX + xoffset; //图片dom的 宽
        var j = k.pageY - pop.children[0].height;// 高
        el = k.target || k.srcElement
        //let _j=j  - 10
        let top=j<scrollY?scrollY:j
        //var r=document.scrollingElement.scrollTop+document.scrollingElement.clientHeight-pop.children[0].height-10
        //if (j>r) {
        //    j=r
        //}
        pop.style.top = top + "px";
        pop.style.left = h + "px"
    }
    //pop.style.top = j + "px";
};
var img=document.querySelectorAll('tr[class="lista2"] > td:nth-child(1) >a:nth-child(1) > img')
var t=document.querySelectorAll('tr[class="lista2"] > td:nth-child(2) >a:nth-child(1)')

var re = /\/(?<id>\d+)\//;
var ee = /\/(?<id>\d+)_/;
nex: for (var i = 0; i <t.length; i++) {
	let a=t[i].attributes.onmouseover
    if (!a) {continue}
	let b=a.value

    //let f= re.exec(b)
    //if (f){
    //    img[i].src=`https://dyncdn.me/mimages/${f.groups.id}/over_opt.jpg`
    //    img[i].width=50
    //}
    let e=b.split('/')
    //console.log(b)
    //console.log(e)
    switch(e[3])
    {
        case 'static':
            switch(e[4])
            {
                case 'over': //18+
                    a.value=b.replace('static/over','posters2/'+e[5].substr(0,1))
                    continue nex;
                case '20': //TVdb
                    let ef= ee.exec(b)
                img[i].src=`https://dyncdn.me/static/20/tvdb/${ef.groups.id}_small.jpg`
                //img[i].width=50

                    a.value=b.replace('_small','_banner_optimized')
                    continue nex;
            }
            console.log("无法替换rarbg图源:"+b)
            continue nex;
        case 'mimages': //movie
            {
                let f= re.exec(b)
                img[i].src=`https://dyncdn.me/mimages/${f.groups.id}/over_opt.jpg`
                img[i].width=50
            a.value=b.replace('over_opt','poster_opt')
            continue nex;}
    }
    console.log("无法替换rarbg图源:"+b)
}