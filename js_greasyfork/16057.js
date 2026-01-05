// ==UserScript==
// @name       Better Primewire
// @namespace  http://mcimino.reaktix.com/
// @version    0.5.4
// @description  adds popup links to AddToWatched, AddToFavorites, and AddToWatched on some pages.
// @match      https://www.primewire.ag/*
// @match      https://www.primewire.org/*
// @match      https://www.primewire.is/*
// @copyright  2012+, You
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/16057/Better%20Primewire.user.js
// @updateURL https://update.greasyfork.org/scripts/16057/Better%20Primewire.meta.js
// ==/UserScript==

//console.log("towatch",(window.location.href.match(/towatch/)===null),"favorites",(window.location.href.match(/favorites/)===null));
//console.log((window.location.href.match(/towatch/)===null)&(window.location.href.match(/favorites/)===null));

//popup = function(x){return window.open("https://www.primewire.ag"+x,"myframe","width=400,height=400");};
popup = function(x){return window.open(window.location.origin+x,"myframe","width=400,height=400");};
debug = 0;

for(a=0;a<document.links.length;a++){
    if(debug){console.log(0,a);}
    var b = document.links[a];
    if(debug){console.log(1,b);}

    //prepend AddToFavs to AddToWatched
    c = b.href.match(/(https:..www.primewire.{4,5}addtowatched.php.id.)([0-9]*)(.action.watched.whattodo.add)/);
    if(debug){console.log(2,c,c!==null);}
    if (c!==null){
        if (c.length>0){
            d = '<a href="/addtofavs.php?id=' + c[2] + '&whattodo=add">Add to Favs</a> | ' + b.outerHTML;
            //console.log(a,d);
            b.outerHTML = d;
            a+=1;
        }
    }

    //prepend AddToWatched to DeleteFav
    c = b.href.match(/(https:..www.primewire.{4,5}addtofavs.php.id=)([0-9]*)(.whattodo.delete)/);
    if(debug){console.log(3,c,c!==null);}
    if (c!==null){
        if (c.length>0){
            d = '<a href="/addtowatched.php?id=' + c[2] + '&action=watched&whattodo=add">Add to Watched</a> | ' + b.outerHTML;
            b.outerHTML = d;
            a+=1;
        }
    }

    //append AddToWatched AddToFavs to titles, but only if not already looking at the towatch
    if ((window.location.href.match(/towatch/)===null)&
        (window.location.href.match(/favorites/)===null)&
        (window.location.href.match(/watched/)===null)){
        c = b.href.match(/(https:..www.primewire.{4,5}watch-)([0-9]*)(.*)/);
        if(debug){console.log(4,c,c!==null);}
        if (c!==null){
            //ignore the Featured list
            if (b.innerHTML.slice(0,8)!="<strong>"){
                /*
        d = '<table style="width:inherit;"><tr>'
        d += '<td style="text-align:center"><a href="/addtowatched.php?id=' + c[2] + '&action=towatch&whattodo=add"><img width=15 style="border:0px" src="/images/add_icon_towatch.png" /></a></td>'
        d += '<td style="text-align:center"><a href="/addtowatched.php?id=' + c[2] + '&action=watched&whattodo=add"><img width=15 style="border:0px" src="/images/add_icon_watched.png" /></a></td>'
        d += '<td style="text-align:center"><a href="/addtofavs.php?id=' + c[2] + '&whattodo=add"><img width=15 style="border:0px" src="/images/add_icon_fav.png" /></a></td>'
        d += '</tr></table>'
        */

                d = '<table style="width:inherit;"><tr>';
                d += '<td style="text-align:center"><img width=15 style="border:0px" src="/images/add_icon_towatch.png" onclick=\'popup("/addtowatched.php?id=' + c[2] + '&action=towatch&whattodo=add");\'/></td>';
                d += '<td style="text-align:center"><img width=15 style="border:0px" src="/images/add_icon_watched.png" onclick=\'popup("/addtowatched.php?id=' + c[2] + '&action=watched&whattodo=add")\'/></td>';
                d += '<td style="text-align:center"><img width=15 style="border:0px" src="/images/add_icon_fav.png"     onclick=\'popup("/addtofavs.php?id=' + c[2] + '&whattodo=add")\'/></td>';
                d += '</tr></table>';


                d = b.outerHTML + d;
                b.outerHTML = d;
                //a+=3;
                //console.log(a,d);
            }
        }
    }
}