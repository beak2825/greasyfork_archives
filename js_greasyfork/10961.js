// ==UserScript==
// @author         julian-a-schulte 
// @license        GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @name           IMDb Torrent & Streams & subs search
// @version        3.7.1
// @description    Adds title search links to the most popular torrent and stream sites. Added alluc.com and solarmovie.is Button. All Credit goes to r3b31 https://greasyfork.org/en/users/3202-r3b31 this is just a fork of his original script https://greasyfork.org/en/scripts/2995-imdb-torrent-subs-search
// @include        http://www.imdb.*/title/*
// @include        http://imdb.*/title/*
// @include        http://akas.imdb.*/title/*
// @include        http://www.akas.imdb.*/title/*
// @include        *rarbg.to*
// @grant          GM_setValue
// @grant	   GM_xmlhttpRequest
// @grant          GM_getValue
// @grant   	   GM_addStyle
//original script by r3b31 forked by julian-a-schulte, includes code from other open source scripts
// @namespace https://greasyfork.org/users/13294
// @downloadURL https://update.greasyfork.org/scripts/10961/IMDb%20Torrent%20%20Streams%20%20subs%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/10961/IMDb%20Torrent%20%20Streams%20%20subs%20search.meta.js
// ==/UserScript==





//Remove ads
var divs = document.getElementsByTagName('div');
for (var i = 0; i < divs.length; i++)
{if ((divs[i].id == 'injected_billboard')||(divs[i].id == 'injected_navstrip')||(divs[i].id == 'navboard')
     ||(divs[i].id == 'top_ad')||(divs[i].id == 'top_rhs')||(divs[i].class == 'article native-ad-promoted-provider'))
    divs[i].style.display = 'none';}

// Remove all iframes (only used for ads)
var iframes = document.getElementsByTagName('iframe');
for (var i = 0; i < iframes.length; i++)
    iframes[i].style.display = 'none';
//end of ad remover code

//Rarbg - remove sponsored results by Gingerbread Man
//https://greasyfork.org/en/scripts/5755-rarbg-remove-sponsored-results
var rarbg = document.querySelectorAll('[onclick="dd_pp_f_d();"]');
if (rarbg.length > 0) {
    for (i = 0, j = rarbg.length; i < j; i++)
    {var eachrow = rarbg[i].parentNode.parentNode;
     eachrow.parentNode.removeChild(eachrow);}}

//gets the title and year of the movie
function getTitle () { 
    var metas = document.getElementsByTagName('meta'); 

    for (i=0; i<metas.length; i++) { 
        if (metas[i].getAttribute("property") == "og:title") { 
            return metas[i].getAttribute("content"); }} 
    return "";}

//gets the type of movie
function getType () { 
    var metas = document.getElementsByTagName('meta'); 

    for (i=0; i<metas.length; i++) { 
        if (metas[i].getAttribute("property") == "og:type") { 
            return metas[i].getAttribute("content"); }} 
    return "";}

//gets imdb code
var imdb_regex = /\/title\/tt(\d{7})\//;
var id = imdb_regex.exec(window.location.href)[1];

//where to display the icons
var div = document.evaluate ("//div[@class='subtext']", document, null,
                             XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//get title only
var title = document.evaluate ("//div[@class='title_wrapper']//h1", document, null,
                               XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var year = getTitle();

if(div && title && year){

    title = title.cloneNode(true);

    var spant = document.evaluate (".//span", title, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if(spant)
    {title.removeChild(spant);}

    var titlet = title.innerHTML;

    titlet = titlet.replace(/\<br\>[\s\S]*/g, ""); //remove original title
    titlet = titlet.replace(/^\s+|\s+$/g, ''); //trim the title
    titlet = titlet.replace(/[\/\\#,+()$~%.'":*?<>{}]/g, ""); //remove bad chars
    titlet = titlet.replace("&nbsp;","");
    titlet = titlet.replace("&amp;","%26");//replace & with code
    titlet = titlet.replace("!","");
    year = year.replace(/[^0-9.]/g, "");//keep numbers only
    year = year.substr(year.length - 4);//only keep year

    if( getType().indexOf("video.tv_show") >= 0){var tv=1;var txt = titlet;}
    else{var tv=0;var txt = (titlet+" "+year);}//only use year in movies

    var tab = div.insertBefore(document.createElement("table"), div.firstChild);

    tab.id = "gm_links";
    _addStyle("@namespace url(http://www.w3.org/1999/xhtml); #gm_links td { width:50px; padding:0px } #gm_links img { margin:0 1px 0 0 } #gm_links a { vertical-align:top; font-weight:bold };");

    var tr = tab.appendChild(document.createElement("tr"));

    //Youtube
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAA"+
        "AAAAAAD///8AEiP//xIj//8SI///EyP//xIj//8SI///EiP//xIj//8SI///EyP//xIj//8SI///"+
        "EiP//xIj//////8AEiP//wAc7v8AHO7/AB3v/wAc7v8AHO7/ABzu/wAc7v8AHO7/ABzu/wAd7/8A"+
        "He//ABzu/wAc7/8AHe//EiP//xIj//8SI////////09V//+6uv////////////9PVf//z87/////"+
        "//+ysv//EiP//5ub////////0tH//xIj//8SI///EiP///////9PVf///////xIj////////T1X/"+
        "//////8SI////////5qZ////////EiP//xIj//8TI///EiP//xIj////////T1X///////8TI///"+
        "/////09V////////EiP///////+amf/////////////S0f//EiP//xIj//8SI////////09V////"+
        "////EiL///////9PVf////////////+6uv//EiP//7q6///v8P//0tH//xIj//8SI///EyP/////"+
        "//8SI///EiP//xIj//8SI///EiP///////8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP/"+
        "/////////////////xIj//8SI///EiP//xMj////////EiP//xIj//8SI///EiP//xIj//8SI///"+
        "EiP//9nZ//8SI///EiP//xMj//8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP//xIj//8S"+
        "I///EiL//9na////////////////////////////////////////////////////////////////"+
        "//////////////////////////////////+r5/b/AAAA//372P//////R5K5/wAAAP/IiWb/////"+
        "/26v1f8AAAD/rGZE////////////////////////////qub1/wAAAP/+/Nj/qub2/wAAAP//////"+
        "AAAA//782P8TcJ3//vzY/wAAAP///////////////////////////6rm9f8AAAD//vzY/6rm9v8A"+
        "AAD//////wAAAP/+/Nj/AAAA//////8AAAD///////////////////////////9ur9b/AAAA/+PF"+
        "ov//////R5K6/wAAAP/JiWb//////wAAAP//////AAAA////////////////////////////AAAA"+
        "//+p7/8AAAD/////////////////////////////////////////////////////////////////"+
        "bq7V/wxKf///////rGZE/+PFov//////////////////////////////////////////////////"+
        "////gAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAA==";

    buildCell(tr, "YouTube","http://www.youtube.com/results?search_query="+txt+" trailer", img);

    //Subs4free
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEA"+
        "AAAAAAAAAAAARUW4AKysqwCYnJ8A6urqAJd5XACkjXYAzMzMAGVUQgDQxLkAalpKAJBzVQB6euAA"+
        "FxeXAE6MyAB9k6oAn7fQAEVFkAA4fcIARkaFAK/K5QCKclkAk5PkAISmyABRUbkAKiq9ADhnlQBC"+
        "i9UAKCiiAO/v7wCKkZgA4eH2AGFh3wCkpKQAamq1AMu9rwAhIZYAiWE4AEFBhQDe3u8AiYm4AGVM"+
        "MwAQENgAnIBlAK2ttQANDcAAlIJxAHh40QC4vcIATk6TAOzq5wBDg70AT0/sANvX0wBycuMAwayX"+
        "AF09HQAICOAAMTF7ADk50AB1UzEAYzsSALKy8wDIuKcARorLAC1wsgCns78AhISXAE5OjAA1f8oA"+
        "aj4SAA4OpgBaeZcAgYHzANjOxADf2NEAa5bBAE83HwBiPhsAw8PDAN/f5wB/rdsA8OvmAKaWhQCH"+
        "tOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAdTwAAAAAAAAkLPCkCAAAADBMAFywAAAAVUzI3TQQAADYmABIeAAAAAAAAUk4iOxkqLUMzAwAA"+
        "AABLBUYuICQ+NBxQQEgQMAAjPStKAB8NT0kmABtBDkIAJQgAAAAAFjoYEQAzIQAAAD84LgYKAAAB"+
        "RzEARRpMDwcASisGNQAAJzlEABRUURAdAAAAAAAAAAAvKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAD//wAA//8AAP8/AAAHJwAAAycAAOAH"+
        "AACAAQAACCEAADwnAAAGIAAAhiAAAP8/AAD//wAA//8AAP//AAA=";

    buildCell(tr, "Subs4free","http://subs4free.com/search_report.php?search="+txt+"&x=0&y=0&selLang=0&cat=0", img);

    //SubtitleSeeker
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAA////AP+ZAAD/zIAA/7NAAP/mwAD/piAA/9mgAP+/YAD/8+AA/+zQAP+fEAD/37AA"+
        "/6wwAP/TkAD/uVAA/8ZwAP/58AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC"+
        "AgICAgICAgICAgICAgICAgICAgICAgICAgIOAREIBhEBCQUECQERCAICBgIHBQMKAgwFBAELDwEG"+
        "Ag0JDA0DBQIDBQQBAgIBBAIFBwQGAwUCAwUEAQ8QEQsCDQwFBAgOAggOBAEMDA0CAgICAgICAgIC"+
        "AgQBAgICAgICAgICAgICAgIGBwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC"+
        "AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

    if(tv){buildCell(tr, "SubtitleSeeker","http://www.subtitleseeker.com/search/TV_EPISODES/"+txt, img);}
    else{buildCell(tr, "SubtitleSeeker","http://www.subtitleseeker.com/search/MOVIE_TITLES/"+txt, img);}

    //Podnapisi
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AADu7u4AAADu7u7u7u7u7u7u7u7u7u7u7u7u7u4AAADu7u4AAAAAAAAAAAAAAAAAAAAAAAAAAADu"+
        "7u7u7u7u7u7u7u7u7u7u7u7u7u4AAAAAAAAAAAAAAAAAAAAAAAAAAADu7u4AAADu7u7u7u7u7u7u"+
        "7u7u7u7u7u7u7u4AAADu7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu7u4AAADu7u7u7u7u7u7u7u7u7u7u7u7u7u4AAADu7u4A"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAADu7u7u7u7u7u7u7u7u7u7u7u7u7u4AAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAADu7u4AAADu7u7u7u7u7u7u7u7u7u7u7u7u7u4AAADu7u4AAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AADu7u7u7u7u7u7u7u7u7u7u7u7u7u4AAAAAAAAAAAAAAAAAAAAAAAAAAADu7u4AAADu7u7u7u7u"+
        "7u7u7u7u7u7u7u7u7u4AAADu7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu7u4AAADu7u7u7u7u7u7u7u7u7u7u7u7u7u4AAADu"+
        "7u4AAAAAAAAAAAAAAAAAAAAAAAAAAADu7u7u7u7u7u7u7u7u7u7u7u4AAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAADu7u4AAADu7u7u7u7u7u7u7u7u7u7u7u4AAADu7u4AAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAADu7u7u7u7u7u7u7u7u7u7u7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    if (tv){buildCell(tr, "Podnapisi","http://www.podnapisi.net/subtitles/search/?keywords="+titlet+"&movie_type=&seasons=&episodes=&year=", img);}
    else{buildCell(tr, "Podnapisi","http://www.podnapisi.net/subtitles/search/?keywords="+titlet+"&movie_type=&seasons=&episodes=&year="+year, img);}

    //OpenSubtitles
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAEgAAABIAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/"+
        "//////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD///////8AAAD/"+
        "//////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqqr///////+qqqoAAAAAAADMzMzu7u7///////9V"+
        "VVUAAAAAAAAAAAAAAAB3d3eZmZkAAAAAAACZmZmIiIgAAACIiIgAAAAAAABERETd3d0AAAAAAAAA"+
        "AAAAAADu7u4REREAAAAAAAARERHu7u4AAABERET////////d3d0zMzMAAAAAAAAAAAAAAADd3d0i"+
        "IiIAAAAAAAARERHd3d0AAADd3d1EREQAAAAAAAAAAAAAAAAAAAAAAAAAAAB3d3eZmZkAAAAAAACq"+
        "qqp3d3cAAADMzMxEREQAAAARERHd3d0AAAAAAAAAAAAAAAAAAACZmZn///////+qqqoAAAAAAAAi"+
        "IiLu7u7////////u7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD/////"+
        "//8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    buildCell(tr, "OpenSubtitles","http://www.opensubtitles.org/en/search/sublanguageid-all/imdbid-"+id, img);  

    //SubScene
    img = "data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA"+
        "BGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VG"+
        "AAADAFBMVEUNLgAlRxYWOwYPMAAOLgAQLwANKwAHKAAKLAALLQANLwAZOwoJKwAJKQArTAAIKAAN"+
        "KgAOMgFVdwDG/xcCIwAFJgBEeQECJAARMwAYOglZjAUpTBMKJwBDYQA/dAABIwAAIQKh0QAaOw89"+
        "YQAbPhABGwAsVgIKJADL/ykJKQAYPQgZPglJaAAFKgB4rQCg3AAPMAB0rgCh5wBYdwAvTAAROgEX"+
        "OAAcMgAFJQC17QCFwwDE/xxSiwAAJgNxrwBwogByogAzYgC0/wiu9wAYOhB9lgDE9ABijACYvwWT"+
        "1wA/dQArSR2DpAAOLQAXPAkHIwAZNQAHKwEJJwBwpQArSgBAWAALKgC06wBAag8YQQgAIwAJLQA5"+
        "WwAQRwwyWABZjgdCZhJYiQh5vwC5/wwrSgAeOwAZQQCErAAOLQAWNQcWOQvA/wF/uQAaPwa3/gCF"+
        "uABnmAB+oQA/XgiTzQANKwBQciIGJgAHJQANKwCLyQAsViwwUwAbNgBEbwCh3gAZOg6DqgBBbACj"+
        "4gBWiwAUQgEXPAcMKQAkSBEMIwAwShcdQQqn6gAQKwCLwgCf5QAmSQ4LLwBYewlHcQCJwABLZQDA"+
        "/wwaPQoPLwCYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eo"+
        "qKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7"+
        "u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3O"+
        "zs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh"+
        "4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P0"+
        "9PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7////M/32SAAAA8UlEQVR42jTPQ3sDARQF"+
        "0DczMeqmZmrbZmobqW3bNu/9u13k6/bsjigAgPbH+9vzOCugiEqS7N/6jA+dDCdVSSFJmmdcN1de"+
        "JhJS56PpDiidK68XgRYScpS/47u6b3+abpg1kYSE7Rq8T5vnHL8/wxp5B1mcGCw6yZnKWH/oymrb"+
        "e28R60JFQnRuac2GIbLDdu2OFdjHt4OjNv3LenuqDytfQgT6oKqS5ONWv6batcZugYBiPvu+jMhM"+
        "Ku4LsBAC6o15y8/ZMfWFRo2EgGT66MBbWuII+Q8sd87rPugBT872VSAkSVUUAEhdGhsCAED5GwDK"+
        "R14PRSW3MQAAAABJRU5ErkJggg==";

    buildCell(tr, "SubScene","http://subscene.com/filmsearch.aspx?q="+txt, img);
    
        //BTDigg
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAEAAA"+
       "AAAAAAABAgIAAXlOAAGpbwABMR8AARsSAAGSXwABKhwAAcqDAAGKWQABVTYAAaBoAAERCwABXT0A"+
       "AYFTAAEgFQAB04kAAAAAgNa0AAAABKZ9cVkAAACbd/93/akAAKd//3//e0Dpj/f3///3ILp/////"+
       "//dgbff///////pf////////oAr////////6L////////4YD////////frf///////KeBj//////"+
       "97ALwn////85sAC7x19/EjsACwBuNbULsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
       "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    buildCell(tr, "BTDigg","https://btdigg.org/search?info_hash=&q="+txt, img);   

    //Limetorrents
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAAAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAA"+
        "AAAAAAD///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B"+
        "////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH/"+
        "//8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af//"+
        "/wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////"+
        "Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////ASaufgsmrX5F"+
        "O7aMuy+wg7svsYO7QbmQuyyxg0XL7eJv////Af///wH///8B////Af///wH///8B////ASGrfEEu"+
        "sIO7T76Y/27OsP+D2cD/gde//2/Nr/9Hu5P/ObWL6Suwg0H///8B////Af///wH///8B8vv4PV/F"+
        "oplTwZzrg9/K/4Tt3f937t3/V+vX/1jr1/9q7Nn/l+3e/37awf9AuZDrH6t6P/b8+Qf///8B////"+
        "AX7Rtq9w0LP/fezc/13t2/9i7tz/hvLk/1rt2v9a7dr/evDh/2/v3/9i7tz/hunY/2HHpv+F07hn"+
        "////AXjRtjl10bb1hvDi/3Px4/9z8eP/c/Lj/5b16v958uT/dPLj/5v16/928uP/c/Hj/3Ty4/+H"+
        "7N3/Yceo//b8+neH17/1m+/i/6n37/+m9+7/k/Xq/4j06f+U9ev/ovbt/5/27f+Z9ez/iPTp/430"+
        "6f+b9ez/qffu/6Do2f9+0bh3kODN/5z27P+c9+3/pPfv/7X48f+3+PL/q/jw/7j58v+7+fP/rvjw"+
        "/7b48v+3+fL/q/jw/6H37v+g9ev/ktzI7aHt4Luo9/C7qPfwu6j38Luo+PC7sPjxu7759Lva+/i7"+
        "1fv4u7v587uw+PK7qPjwu6j38Luo9/C7qPfwu5zl17v///8B////Af///wH///8B////Af///wH/"+
        "//8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af//"+
        "/wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////"+
        "Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B"+
        "////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH/"+
        "//8BAAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA"+
        "//8AAP//AAD//w==";
    
    if (tv){buildCell(tr, "Limetorrents","https://www.limetorrents.cc/search/tv/"+txt, img);}
    else {buildCell(tr, "Limetorrents","https://www.limetorrents.cc/search/movies/"+txt, img);}

    //Torrentz
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAACZZjMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8IAAA/DcAAPw7AAD8PQAA/CAAAPw/AAD8PwAA/D8A"+
        "APw/AAD8PwAA/D8AAPw/AAB8PgAAAAAAAAAAAACAAQAA";

    buildCell(tr, "Torrentz","https://torrentz.eu/search?f="+txt, img);       
    
            //YTS
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAEAAA"+
       "AAAAAAAeHx0ADocOABpPGAACswMAGzwZAB8vHAAfJR0AJCAdAAiaCQAWYBUAAsgBAAapBwAUWhQA"+
       "EnESAALAAgAD1wMABwBtvu6Jd3B3ebqB3Ru0Bweasnd3d5gneeF3d3d3dBVzh3dfh3d3ct5Xd3q3"+
       "d3d1sXd3e/J3d3eyV3dxqXd3dzl3d1Gud3d3NXdXc+rXd3eJd3daO+l3d9J3d4MSu3d3cXd3mJfY"+
       "13dyR3d3d3d3d3Ynd3d3d3d3d3d3d3d3d3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
       "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    buildCell(tr, "YTS","https://yts.ag/browse-movies/"+titlet+"/all/all/0/latest", img); // no support for year in search  

    //btscene
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAEgAAABIAAAAAAAA"+
        "AAAAAABCQkKenp5jY2M7OztHR0fr6+v5+fn8/Pz9/f2jo6MhISEiIiIgICAhISEiIiIfHx8JCQk4"+
        "ODienp6pqalZWVmVlZX6+vr8/Pz7+/vNzc0aGhoODg4SEhIFBQUEBAQHBwcODg4MDAyQkJCmpqad"+
        "nZ14eHj19fX8/Pz7+/vq6upPT09BQUFKSkoICAgDAwMEBARwcHAjIyM8PDzGxsbGxsbo6Oj7+/v8"+
        "/Pz8/Pz6+vrq6urs7Oze3t4aGhoFBQUDAwP39/fCwsItLS09PT3u7u729vb8/Pz6+vr7+/v4+Pj5"+
        "+fn5+fnv7+8uLi4CAgICAgJ0dHQnJydsbGx3d3fX19f7+/v5+fn6+vr6+vr5+fn+/v7////39/dD"+
        "Q0MEBAQCAgJdXV2dnZ3Dw8OcnJzJycnX19fj4+Px8fH4+Pj4+Pj6+vr5+fn5+fl6enoGBgYCAgJI"+
        "SEhEREQlJSUUFBS1tbXp6enb29vPz8/V1dXw8PD7+/vt7e35+fmjo6MGBgYCAgIEBAQFBQUGBgY8"+
        "PDz19fX7+/v9/f36+vrp6enR0dHPz89BQUGdnZ1BQUEDAwMCAgICAgICAgIEBARgYGD8/Pz9/f3+"+
        "/v7+/v77+/v09PS3t7cMDAwdHR0TExMDAwMCAgICAgICAgIEBASVlZX6+vr9/f3+/v7+/v79/f36"+
        "+vrx8fFeXl43NzcTExMFBQUCAgICAgICAgIFBQWvr6/6+vr9/f3+/v7+/v7+/v78/Pz9/f3w8PCo"+
        "qKgLCwsDAwMCAgICAgICAgIEBASNjY38/Pz9/f38/Pz+/v78/Pz+/v7////9/f2Xl5cFBQUFBQUC"+
        "AgIEBAQEBAQGBgY8PDzt7e39/f39/f39/f39/f39/f36+vr29vZnZ2cHBwcEBAQEBAQCAgICAgID"+
        "AwMKCgqgoKD39/f7+/v8/Pz8/Pz8/Pz8/Pyrq6sTExMDAwMEBAQCAgIHBwcHBwcJCQkICAgxMTHc"+
        "3Nz6+vr7+/v7+/v7+/v7+/vS0tIfHx8ICAgGBgYHBwcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    if (tv){buildCell(tr, "Btscene","http://www.btsdl.cc/results.php?q="+txt+"&category=series", img);}
    else{buildCell(tr, "Btscene","http://www.btsdl.cc/results.php?q="+txt+"&category=movies", img);}

    //1337x
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAA"+
        "AAAAAAD+/v4M0dHRSr+/v2vGxsZk/v7+Jf7+/gr+/v4A////AP7+/gD+/v4M/Pz8KMHBwWu+vr5x"+
        "wsLCXvz8/BT+/v4B8vLyIg9Ia/MAdb//AHC3/3eEi6/+/v4r/v7+B////wD+/v4J/v7+LnSGkLMA"+
        "crv/AHW//wBVi//R0dFG/v7+A/7+/hSLjY6XAHfD/wCc//8AcLf/pqamk/7+/iH+/v4K/v7+Iaam"+
        "ppMAcrv/AJz//wCP6/9rfYe1/v7+Hv7+/gH+/v4J/v7+MG9+iL0Ajef/AJz//xlikfLc3Nxk/v7+"+
        "K9zc3GQZX4zzAJz//wCZ+/8gTWnr7OzsTP7+/g/+/v4A/v7+AP7+/g/w8PBKJExk6QCZ+/8Amfv/"+
        "OFds4/f393s4V2zjAJn7/wCc//8WZZbz3NzcZ/7+/hj+/v4B////AP///wD+/v4B/v7+Fdvb22QZ"+
        "X4zyAJz//wCI3/8zRE/yAIbb/wCc//8AcLf/l5mbm/7+/iP+/v4F////AP///wD///8A////AP7+"+
        "/gP+/v4hsrKyjQBoq/8AnP//AJLv/wCc//8AiuP/d4OLuv7+/jD+/v4H/v7+AP///wD///8A////"+
        "AP///wD///8A/v7+Cv7+/j57gofKAIjf/wCc//8Amfv/OFhs6vT09Fn+/v4S/v7+AP///wD///8A"+
        "////AP///wD///8A/v7+AP7+/g/09PRPMVRp6QCZ+/8AnP//AJz//x1UePPk5ORn/v7+Ff7+/gH/"+
        "//8A////AP///wD///8A/v7+AP7+/gn+/v4wfYuTuhyV4/8LoP//A3jD/wCZ+/8AlPP/SWN11vz8"+
        "/Dz+/v4M/v7+AP///wD///8A////AP7+/gX+/v4jlJaYoDCJwf9Ctv//OaHj/3uEitc0bJD2P7X/"+
        "/zee3v96hIq2/v7+L/7+/gf+/v4A////AP7+/gP+/v4Z1tbWazV4ofZCtv//QbP8/z9dcOX4+Phg"+
        "s7Ozli2AtP9Ctv//L4a8/5ibnJv+/v4j/v7+Bf///wD+/v4M6OjoTDBWbe5Ctv//Qrb//zhymPPc"+
        "3Nxk/v7+Hv7+/jB6g4q2OqTn/0K2//84eaHz1tbWZf7+/hT+/v4A/v7+FWp9iLY9rPL/Qrb//zCJ"+
        "wf+np6eS/v7+If7+/gb+/v4O9PT0RD9dcONBs/z/Qrb//zBVber09PQo/v7+A/Hx8R9IZ3rPN2eF"+
        "6jdnhOuKl6Ch/v7+Kv7+/gf///8A/v7+Af7+/hXc3NxWSm2D1zZmhOpAaoXez8/PQv7+/gP+/v4J"+
        "/v7+Gf7+/iv+/v4r/v7+Gv7+/gr+/v4A////AP///wD+/v4D/v7+D/7+/iX+/v4r/v7+H/7+/gz+"+
        "/v4A//8AAIfDAACDgwAAw4cAAOEPAADwDwAA8B8AAPg/AAD4PwAA8B8AAOAPAADhBwAAw4cAAIPD"+
        "AACH4wAA//8AAA0KMA0KDQo=";

    buildCell(tr, "1337x","http://1337x.to/search/"+txt+"/0/", img);

    //extratorrent
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAA"+
        "AAAAAADIvb7/xry9/8e8vf/Ivb7/yL2+/8i9vv/Ivb7/yL2+/8i9vv/Ivb7/yL2+/8i9vv/Ivb7/"+
        "x7y9/8a8vf/Ivb7/xry9//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+"+
        "/v7//v7+//7+/v/+/v7/xry9/8e8vf/8/Pz//Pz8/5OTkv9qSRj/akkY/2tKGf9rShn/a0oZ/2tK"+
        "GP9qSRj/Tzoc/4iEff/8/Pz//Pz8/8e8vf/HvL3/+/v7//v7+/+Hf3P/4bd0/+G3dP/ht3T/4bd0"+
        "/+G3dP/ht3T/4bd0/3hgOv9xbmr/+/v7//v7+//HvL3/x7y9//f4+P/3+Pj/hHxx/+zAfP/swHz/"+
        "7MB8/3xzaP9yal3/cmpd/3JqXf98c2b/xcPB//f4+P/3+Pj/x7y9/8e8vf/29vb/9vb2/4V9cf/t"+
        "xYX/7cWF/2RSNv/Nz8//zs/R/87P0P/Mzs7/29va//f39//29vb/9vb2/8e8vf/HvL3/8/Pz//Pz"+
        "8/+IgHP/78yU/+/MlP94YDr/8vLy//Ly8v/y8vL/8vLy//Ly8v/09PT/8/T0//Lz8//HvL3/x7y9"+
        "//Ly8v/y8vL/h4F5/+/Pnf/vz53/kHdP/3hgOv94YDr/eWE7/3hgOv9USDf/5eLd//Ly8v/y8vL/"+
        "x7y9/8e8vf/w8PD/8PDw/4eBef/t0Kf/7dCn/+3Qp//t0Kf/7dCn/+3Qp//t0Kf/VEg3/9vb2v/w"+
        "7+//8PDw/8e8vf/HvL3/7u3u/+7t7v+Gg33/7dm8/+3ZvP/Txa7/cW5r/3Fua/9xbmv/d3Rv/62r"+
        "qf/o5+f/7u3u/+7t7v/HvL3/x7y9/+vr6//r6+v/h4F4/+/l0P/v5dD/XFVM/8XHx//Fx8f/xcfH"+
        "/8TGxv/r7Ov/6+vr/+vr6//r6+v/x7y9/8e8vf/p6un/6erp/4eAeP/58+b/+fPm/4iEff93dG7/"+
        "fXl0/356df99eXT/bGlj/5OTkf/p6un/6erp/8e8vf/HvL3/6Ofn/+fn5/+GgHj/5uPd/+bj3f/m"+
        "493/5uPd/+bj3f/m493/5uPd/3Z2df9vb2//6Ofn/+fn5//HvL3/x7y9/+fn5//n5+f/raqo/3Z2"+
        "df94eHj/d3d2/3h4ef95eXn/eHh4/3h4eP94eHj/ramo/+fn5//n5+f/x7y9/8a8vf/l5eX/5eXl"+
        "/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/8a8vf/Ivb7/"+
        "xry9/8e8vf/Ivb7/yL2+/8i9vv/Ivb7/yL2+/8i9vv/Ivb7/yL2+/8i9vv/Ivb7/x7y9/8a8vf/I"+
        "vb7/AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA"+
        "//8AAP//AAD//w==";

    if (tv){buildCell(tr, "ExtraTorrent","http://extratorrent.cc/advanced_search/?with="+txt+"&exact=&without=&s_cat=8&s_subcat=&added=&seeds_from=0&seeds_to=&leechers_from=&leechers_to=&size_from=&size_type=b&size_to=#results", img);}
    else{buildCell(tr, "ExtraTorrent","http://extratorrent.cc/advanced_search/?with="+txt+"&exact=&without=&s_cat=4&s_subcat=&added=&seeds_from=0&seeds_to=&leechers_from=&leechers_to=&size_from=&size_type=b&size_to=#results", img);}
   
    //PirateBay
    img = "data:text/html;charset=utf-8;base64,Qk04AwAAAAAAADYAAAAoAAAAEAAAABAAAAABABgAAAAAAAAAAADgTAAA4EwAAAAAAAAAAAAA////"+
        "/////////////////////////////////////////////////v7+/////////////Pz8vb297Ozs"+
        "////////////////////////////////4uLiSUlJ3d3d////////8/PzEhIScnJy8fHx////////"+
        "////////////8fHxwsLCWFhYAAAAyMjI////////5+fnEBAQICAgQkJCV1dXZWVli4uLiYmJUlJS"+
        "KioqPT09bm5uHh4eYWFhwcHBubm5bGxsQEBAp6end3d3FBQUAAAAFBQUOTk5ISEhGRkZPT09WVlZ"+
        "QkJCKioqJycnenp6AAAAQUFBPz8/YGBgjo6O0dHR+/v7////////7+/vxcXFnZ2dg4ODExMTQEBA"+
        "v7+/AAAAgoKCjo6OpaWltra2qqqqpqampaWlpKSkra2tr6+vsbGx5eXll5eXW1tb1NTUcXFxmJiY"+
        "AwMDAAAANzc3VFRUGxsbAAAAX19fPDw8ERERAAAAQUFB/v7+/Pz8////////nJycAAAAAAAAAAAA"+
        "Hx8fCwsLAAAAJiYmBQUFAAAAAAAAKysr+vr6////////////nJycAAAAAAAADw8PAAAAAAAAAAAA"+
        "AAAADQ0NAwMDAAAANjY2+vr6////////////rq6uAAAANjY25eXlWVlZHx8fJycnIyMj0dHRhoaG"+
        "AAAAV1dX////////////////r6+vAAAALS0t0tLSX19fsrKy2dnZZWVlsrKyiIiIAAAAWVlZ////"+
        "////////////r6+vAAAAAAAABQUFAgICExMTEBAQAwMDAwMDAQEBAAAAWlpa////////////////"+
        "q6urAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVFRU////////////////19fXSUlJQUFB"+
        "Q0NDQ0NDQ0NDQ0NDQ0NDQ0NDQkJCQkJCqKio/////////////////////////v7+/v7+/v7+/v7+"+
        "/v7+/v7+/v7+/v7+/v7+////////////AAA=";

    buildCell(tr, "PirateBay","http://thepiratebay.se/search/"+txt+"/0/99/200", img);


    //KickAss
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUFLcyFLV74bO0UuAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeQEthLmNy+DVzhf81c4X/NXOF/ydUYdsc"+
        "PEUdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkTFeuN3WG/zh2iP84doj/OHaI/zh2"+
        "iP84doj/M2t7/B9BS1IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlS1ecPHmM/zx5jP88eYz/WIyc"+
        "/3OfrP9BfI//PHmM/zx5jP83b4D9IEFLPgAAAAAAAAAAAAAAAAAAAAAiQ0wzPXiJ/kB9j/9AfY//"+
        "XZGg//b5+v//////4uvu/2iZp/9AfY//QH2P/zNkcu4AAAAAAAAAAAAAAAAAAAAAMl1q2UWBlP9F"+
        "gZT/RYGU/73T2f///////f7+//L29//p8PL/RYGU/0WBlP9FgZT/KUxXgAAAAAAAAAAAJ0ZPHUeB"+
        "k/9Khpj/SoaY/0qGmP/b5+r//////7vR2P9Khpj/bp6t/0qGmP9Khpj/SoaY/zlndOcAAAAAAAAA"+
        "AC9SXIBPi53/T4ud/0+Lnf9Pi53/0eHm///////F2d//T4ud/0+Lnf9Pi53/T4ud/0+Lnf9Mhpf/"+
        "KEZPEgAAAAA4YGu+VJCh/1SQof9UkKH/VJCh/8HX3f//////6/L0/1SQof9UkKH/VJCh/1SQof9U"+
        "kKH/VJCh/y9QWVwAAAAAQGp31lmUpv9ZlKb/aZ6u/5u/yv/W5en////////////C2N//3urt/3Sm"+
        "tf9ZlKb/WZSm/1mUpv81WWOIAAAAAENseNRemar/Xpmq/3Wntv//////////////////////////"+
        "//////+VvMf/Xpmq/16Zqv9emar/OFtlhAAAAABCaHS+Y52v/2Odr/9nn7H/iLTC/4Kxv//0+Pn/"+
        "/////6zL1f9jna//Y52v/2Odr/9jna//Y52v/zdXYVwAAAAAPF5od2ehsv9nobL/Z6Gy/2ehsv9n"+
        "obL/xtzi///////f6+//Z6Gy/2ehsv9nobL/Z6Gy/2Wdrv80UVoSAAAAADZTXBJkmqr+a6W2/2ul"+
        "tv9rpbb/a6W2/2ultv9rpbb/a6W2/2ultv9rpbb/a6W2/2ultv9SfovlAAAAAAAAAAAAAAAAS3J9"+
        "xG+ouf9vqLn/XIuZ9GGTovpvqLn/b6i5/2+ouf9gkqD5Zpqp/W+ouf9vqLn/QWJsdwAAAAAAAAAA"+
        "AAAAADtZYhdbipfxQWJrbgAAAAAAAAAAR2t2p2CRn/dBYmtuAAAAAAAAAABGanSgVH6L3wAAAAAA"+
        "AAAA/j8AAPgPAADwBwAA4AMAAMADAADAAQAAgAEAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAB"+
        "AADAAQAAxjMAAA==";

    if (tv){buildCell(tr, "KickAss","https://kat.cr/usearch/"+txt+" category:tv/", img);}
    else{buildCell(tr, "KickAss","https://kat.cr/usearch/"+txt+"/", img);}

    //isoHunt
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAQAMAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAD39vX28e/5+fUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAACkim2EWjTazb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACk"+
        "imdmMwDBq5oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQv6qymH4AAACulH1mMwCpi3EA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD08O16UCaAXDPs5N/Mu6xmMwCgfl8AAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAD7+viadFNzRRPl3tjn39dyRBaJYz4AAAAAAAAAAAC7qJaQbUvfzsYA"+
        "AAAAAAAAAAAAAAC1m4ZmMwDGs57p4tqFXjh9VCXo4dgAAAAAAADZyrx1SByMbEUAAAAAAAAAAAAA"+
        "AADJvKtsPQujh2n7+/qUd1dmMwB1Rxl3SRx3SRx1RxlmNAGKZj/l2NMAAAAAAAAAAADk1c5wQBGN"+
        "Z0H18O2niGNmMwBtPA52SRx2SRx2SRxtPQxoNQPl2tQAAAAAAAAAAADz8eyHXz9xQxXt6OTMvrNp"+
        "NwW1mYQAAAAAAAAAAACxloNmMwC6p40AAAAAAAAAAAAAAACjgGJsOgrTx7Xs49uFXjeXdlXv6uMA"+
        "AAAAAADXzb9sPAujgWYAAAAAAAAAAAAAAAC/rZlmNAG4n4gAAAAAAAAAAAAAAAAAAAAAAADn39d3"+
        "TCGDWS7PwbQAAAAAAAAAAADx7ei6pI7Yyr0AAAAAAAAAAAAAAAAAAAAAAAAAAACJZD9rOgrIs54A"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGsZxmMwCkjnAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADSwLdtPQqDWjL08vAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAADy7uju6eQAAADx/wAA8f8AAPH/AACR/wAAAf8AAAHHAACA"+
        "xwAAgAMAAIADAACA4wAAwGMAAMfhAADH8QAA//EAAP/wAAD/+QAA";

    if (tv){buildCell(tr, "isoHunt","http://isohunt.to/torrents/?iht=8&ihq="+txt, img);}
    else{buildCell(tr, "isoHunt","http://isohunt.to/torrents/?iht=5&ihq="+txt, img);}

    //EZTV
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAA"+
        "AAAAAAD////////////////1qojwf0z5zLf////////85dvwf0z4w6v/////////////////////"+
        "///////////wf0z4w6v4w6v////////4w6v0oXz0oXz////////////////////////////////w"+
        "f0z5zLf////////////ykGT5zLf2spT97uf////////////////////////////wf0z5zLf/////"+
        "///73c/xiFj+9vP73c/4w6v////////////////////////////wf0z5zLf////////3u6D2spT/"+
        "///////1qoj////////////////////////////wf0z5zLf////97ufxiFj5zLf////////2spT7"+
        "3c/////////////////////zmXDwf0zwf0zykGTwf0zwf0zwf0z97uf5zLfwf0zwf0z/////////"+
        "///////////+9vPykGT5zLf////////////////////////////////////////////////73b/z"+
        "mT/wfx/wfyf3u3/////zmT/wfw/wfw/wfw/wfw/wfw/ykC/////////97t/xiB/zmT/85c/////7"+
        "3b/5zJ/85c/xiB/zmT/////////////0oU/////////4w4/wfw/97t/////////////73b/////6"+
        "1K/wfw/1ql/////////////////////4w4/ykC/////////////////////////////4w4/wfw/4"+
        "w4/////////////////4w4/wfw/wfw/wfw/wfw/wfw/1ql/////////////2sm/wfw/61K//////"+
        "///////+9u/ykC/73b/////5zJ/wfw/4w4/61K/5zJ/////////zmT/xiB/85c/////////////8"+
        "5c/zmT/wfw/wfw/2sm/////73b/wfw/wfw/wfw/wfw/wfw/ykC//////////////////////////"+
        "//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    
    if (tv){buildCell(tr, "EZTV","https://eztv.ag/search/"+txt,img);}

    //Bitsnoop
    img = "data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAP1JREFU"+
        "OI2lk71rwzAUxH9yLEzR0q4hELIKt1uXNGOG/MkpeO1QmqkYryFQutqLAkYh7pC6SFZVqHOT9HR3"+
        "74MnwTde3h46/oGnx3cBIMaIXRMxVtwjHQaMSajKjMNeevH5wqLzFqXOXjwZioutCsQAh72k2CqM"+
        "8SS+QVVmWCsAkLJjuTqyXB2R8tKltYKqzOIGbmadt0xnJ6azEzpvf+UEBi5u7y69NvWENI3PORii"+
        "i6aeUDyrvyjxCpo6+hQ3mC/sz7kqM5omQd+3XgsuBwYt6Lzl8yPFWoG1gt3rjUeWsvMGGlSg1Jn1"+
        "xgRZ+szrjQkW6epVvv4z9Zex3/kL1CBiDQgjq/0AAAAASUVORK5CYII=";

    buildCell(tr, "BitSnoop","http://bitsnoop.com/search/video/"+txt+"/c/d/1/", img);

    //RARBG
    img = "data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAflJREFU"+
        "OI2F0z9oXEcQx/HPCSWY22DcvFe4CK9KoYOQIhZxE1/j5lQLUpig2lIVIhchsY1xZadIYR8uXKhX"+
        "fZUhnFOeXAVOhBDCI+XbJjHsEozRpjid/OdsMrDMsMN+5/eDnV4ppYePcQ0f4cRq/IWf8cdKp5Ry"+
        "uZTypPx//FNK+aGU8kEppbc86/gCn0/nnfFBS3hzQB9VFWwNq/PDQX0HF/Dtsr++LFKijVk/k9Nb"+
        "Mtvs6VG0v8P2sL6Ox/jtDUBAPyzypUFl60oFJkfR8XGUMJm2RsP6XODLFQCE/iI3DcPNGk42mnpt"+
        "bzwjZRmpI9QurlhYqng7ck76MqgCoQZ/vhOwpMQumc46Kee16VEnp6SLjIaVwHP88h5AInEUo8On"+
        "x2dXsD3asLM1gAdoVwApZ/PjVkpZXfc1/WDexoWo0F8+fo6D10eunXlNSdu2Yuxc2qhNDnZsDRsx"+
        "dmJs7d4/hPP4CR+uABZaMykuPgXu7Y8MmiClbDqZ2r19CCPcfAcgyynKOUsL4y9DCP8+uLcjnMLH"+
        "40MPDybwHb7G+hkgZcSO1Mk5w9+4uzloXtza35bzord3Y2wyncEdfNUrpVzF3a5Lm23bymjqStPU"+
        "v+Iz/IhvZvM5iYwqBINB8zu+752u86e47tU6n2CMmcU+3cAneHlq+wUe4dl/EuoEoSZWymEAAAAA"+
        "SUVORK5CYII=";

    buildCell(tr, "RARBG","http://rarbg.to/torrents.php?search=tt"+id+"&category%5B%5D=14&category%5B%5D=48&category%5B%5D=17&category%5B%5D=44&category%5B%5D=45&category%5B%5D=47&category%5B%5D=42&category%5B%5D=46&category%5B%5D=18&category%5B%5D=41", img);

    //Demonoid
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAACGBUDJB4EJB4DFBEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALiYBTUAPTkIi"+
        "WU8WT0QAPjIASjsDOS8AAAAAAAAAAAAAAAAAAAAAAAAAAAAzRUKnp6eIhITDwMDy7/CkoqKmo6PY"+
        "0tJUWlhEZF4AAAAAAAAAAAAAAAAAAABJSUqSkJHg4OCsrK26u7rv8PDAwcCztLTo6OikpaS+vb1Y"+
        "WFgAAAAAAAAAAAAAAAB+eHmjoqLT09OwsLDAwMDu7u7LzMzl5eXS09O4uLivr66mnp8AEAwAAAAA"+
        "AAAXloIIcF0hQDtyZmjp5eX08vKNjo739vb7+vq5ubjIw8V/ensIWksbo44BBwUAAAASaF0epI8h"+
        "p5Mam4s0g3pslJBNXlydpaWZpqRKb2oWZFgWk30dmoUYhnoAAAAAAAAAAAAHKSIlsJ0tuag0yLg4"+
        "0sI/3MwvuKk10L4yxbIrtaEioYwWeWMAAAAAAAAAAAAAAAAMRjglq5gxwLExraBD18tH3M46s6dA"+
        "08I3x7UpoZArtaQem4IAAAAAAAAAAAAAAAASX1IuwbI0yrspkYZF2s1K3dBK3c9C1cU70L4klIMy"+
        "xbYqu6sHKSIAAAAAAAAAAAAZd24y0MMikn8RRUAtkohD0cJE1cYyp5oXU0wLRTghooguyLwTYFgA"+
        "AAAAAAAAAAAXbWYOQTwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATX1QjtKYAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEBIAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAPw/AADwDwAA4AcAAMADAADA"+
        "AQAAgAAAAIABAADAAwAAwAMAAMABAADAAQAAz/kAAP/9AAD//wAA";
    
    if (tv){buildCell(tr, "Demonoid","http://www.demonoid.ph/files/?category=3&subcategory=0&&language=0&quality=0&seeded=2&external=2&query="+txt+"&uid=0&sort=", img);}
    else{buildCell(tr, "Demonoid","http://www.demonoid.ph/files/?category=1&subcategory=0&&language=0&quality=0&seeded=2&external=2&query="+txt+"&uid=0&sort=", img);}
    

    //RuTracker
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg4ODLy8vd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAADPz8+KioqgoKDb29vj4+Pf39/q6uoAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AADe3t7b29vS0tL29vZOTk5paWlycnJ8fHy8vLwAAAAAAADt7e3c3Nzg4ODc3NympqbDw8OIiIjj"+
        "4+PtTUD8393///////////+8vLwAAAAAAADU1NSgoKCampqUlJSCgoLz8/NKSUni4uLpJxnqOCrw"+
        "Z1z2oZvj4+PPz88AAAAAAADr6+vx8fGmpqaurq7P9dn///9paWm9WlPhIBLpIRLpIRL///9XV1fO"+
        "zMwAAAAAAADg4OD///9D1miK5qEQyz////8+PT1GLCuTFQvNHhHhIBLrtrPPz8+kpKQAAAAAAADh"+
        "4eH8/PwTzEEQyz8Qyz+M5qL///9sbGxWEQyZJBy9WlO7cmzU1NSioqIAAAAAAADDw8P///8Qyz8Q"+
        "yz8Qyz8Qyz9r34j///+emZk+PT1lZWTS0tKmpqbg4OAAAAAAAADY2NiP56V74pVh3YAQyz////+m"+
        "pqZYN9DDtfT///+zoPbf39+xsbEAAAAAAAAAAAAAAAAAAAAAAAAAAAA31F/t7e2YmJhMIedAEulR"+
        "J+uhivSYmJi8vLwAAAAAAAAAAAAAAAAAAAAAAADj4+P+/v7IyMh2XdBAEulAEulAEunHuflKSUmY"+
        "mJgAAAAAAAAAAAAAAAAAAAAAAAAAAADg4ODt7e329vZaM+tAEulAEulRJ+v///9+fn7d3d0AAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAADd3d2plPV4WO/////////////e3t7j4+MAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAADr6+v///////+/v7/i4uLu7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAADV1dXp6ekAAAAAAAAAAAAAAAAAAAAAAAD+PwAA/gMAAPgDAAAAAwAAAAMAAAADAAAA"+
        "AwAAAAMAAAADAAAABwAA8AcAAOAHAADwAwAA/AMAAPwPAAD/PwAA";

    buildCell(tr, "RuTracker","http://rutracker.org/forum/tracker.php?nm="+txt, img);

    //MyTog
    img = "data:text/html;charset=utf-8;base64,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";

    if (tv){buildCell(tr, "GreekTeam","http://greek-team.cc/browse.php?c59=1&c27=1&c35=1&c54=1&c9=1&c25=1&c49=1&c36=1&c15=1&c12=1&c57=1&c34=1&c8=1&c7=1&c42=1&c5=1&c26=1&c37=1&c44=1&c3=1&c4=1&c6=1&c38=1&incldead=0&search="+txt+"&blah=0", img);}
    else{buildCell(tr, "GreekTeam","http://greek-team.cc/browse.php?c59=1&c27=1&c35=1&c9=1&c18=1&c25=1&c52=1&c19=1&c15=1&c39=1&c40=1&c41=1&c53=1&c14=1&c13=1&c12=1&c43=1&c17=1&c55=1&c56=1&incldead=0&search="+txt+"&blah=0", img);}
    
         //Solarmovie Streams
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAACWw9l/haOx/4ehrv+FpbX/l8XcfwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACys6n8Knuf/j8DY//7+/v//////9/n6/6jBzf8rhbH/CZzj/wme5/8Jnuf/CZ7n/wme5/9avu9/AAAAAAAAAAAJoOj/CaDo/4PP8////////////////////////////1iTsP8Jl9v/CaDo/wmg6P8JoOj/CaDo/wAAAAAAAAAACKLp/wii6f8krez/5vb9////////////////////////////Ypq0/wid4v8Ioun/CKLp/wii6f8AAAAAAAAAAAik6/8IpOv/CKTr/4PN7//3/P7///////////////////////////89jLD/CKTr/wik6/8IpOv/AAAAAAAAAAAHp+z/B6fs/wen7P8Uot//Eqjp/yyv6P+T1PD/8/j6/////////////////xSWzv8Hp+z/B6fs/wAAAAAAAAAAB6ru/weq7v8fhrH/XJev/0aPrf8vhqr/KpfF/y+fzv/I3OT///////////9gq8r/B6ru/weq7v8AAAAAAAAAAAes8P8fpdz/2uPn//////////////////X19f/j5+n/+Pr7////////////tNrp/wyt7/8HrPD/AAAAAAAAAAAGr/L/RMDx//n8/v///////////////////////////////////////////8Pm9P8JsPL/Bq/y/wAAAAAAAAAABrL0/xy59f/g9Pz///////////////////////////////////////////951vn/BrL0/way9P8AAAAAAAAAAAW09f8FtPX/mt/5////////////5evt/y+v3/8JtfX/CbX1/wi19f8GtPX/BbT1/wW09f8FtPX/AAAAAAAAAAAFt/f/Bbf3/zLD+P/x+v7///////f39/9Qqsv/Bbf3/wW39/8Ft/f/Bbf3/wW39/8Ft/f/Bbf3/wAAAAAAAAAABLn4/wS5+P8Eufj/eNn7////////////7/P0/2Obr/+lxdH/9Pb3/5S1wf81krL/BLn4/wS5+P8AAAAAAAAAAAS7+f8Eu/n/BLv5/wq9+f+r6Pz/////////////////////////////////3evw/wS5+P8HvPn/AAAAAAAAAABIzvt/BLz6/wS8+v8EvPr/BLz6/8Hu/v///////////////////////////+Ty9/8Eu/n/dtr8fwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////////////////////8AAAAAAAAAAAAAAAAAAAAAAABFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

    buildCell(tr, "Solarmovie Streams","https://www.solarmovie.is/movie/search/"+txt+"/", img);

     //Alluc Streams

    img = "data:text/html;charset=utf-8;base64,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/w/wAAAP8AAAD/AAAA/4AAAf//8D///+Ef///Dj///h8f//4/n///////////ygAAAAwAAAAYAAAAAEAIAAAAAAAACQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA77EIAe+xCAHvsQgB77EIAe+xCAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADvsQgB77EIAe+xCAHvsQgB77EIAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADvswsA77MLBO+zCwfvswsH77MLB++zCwcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO+zCwHvswsH77MLB++zCwfvswsH77MLAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwtQ8B8LUPB/C1DwzwtQ8M8LUPDPC1DwwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPC1DwLwtQ8M8LUPDPC1DwzwtQ8M8LUPBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwtxIB8LcSCvC3EhHwtxIR8LcSEfC3EhEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPC3EgPwtxIR8LcSEfC3EhHwtxIR8LcSCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwuRYB8LkWD/C5FhjwuRYY8LkWGPC5FhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPC5FgTwuRYY8LkWGPC5FhjwuRYY8LkWDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxuxoC8bsaEvG7Gh3xuxod8bsaHfG7Gh0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPG7GgXxuxod8bsaHfG7Gh3xuxod8bsaDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxvR0C8b0dFfG9HSLxvR0i8b0dIvG9HSLxvR8M8r4gB/K+IAfyviAH8r4gB/K+IAfyviAH8r4gB/K+IAfyviAH8r4gB/K+IAfyviAH8r4gB/K+IAfyviAH8r4gB/K+IAfyviAH8r4gB/K+IAfyviAH8r4gB/G9Hw3xvR0i8b0dIvG9HSLxvR0i8b0dEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADyvyIC8r8iGfK/IijyvyIo8r8iKPK/IijyvyIo8r8iKPK/IijyvyIo8r8iKPK/IijyvyIo8r8iKPK/IijyvyIo8r8iKPK/IijyvyIo8r8iKPK/IijyvyIo8r8iKPK/IijyvyIo8r8iKPK/IijyvyIo8r8iKPK/IijyvyIo8r8iKPK/IijyvyIo8r8iFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADywCUC8sElGvLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmLfLBJi3ywSYt8sEmFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADywSYA88MoEPPDKC3zwyky88MpMvPDKTLzwyky88MpMvPDKTLzwyky88MpMvPDKTLzwyky88MpMvPDKTLzwyky88MpMvPDKTLzwyky88MpMvPDKTLzwyky88MpMvPDKTLzwyky88MpMvPDKTLzwyky88MpMvPDKTLzwyky88MpMvPDKTLzwygt88MoDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANqVAAbalQAQ2pUAENqVABDalQAQ2pUAENqVABDalQAQ2pUAENqVABDalQAQ2pUAENqVABDalQAQ2pUAENqVABDalQAQ2pUAENqVABDalQAQ2pUAENqVABDalQAQ2pUAENqVABDalQAQ2pUAENqVABDalQAQ2pUAENqVABDalQADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA25YAINqWAHvalgCf2pYAn9qWAJ/algCf2pYAn9qWAJ/algCf2pYAn9qWAJ/algCf2pYAn9qWAJ/algCf2pYAn9qWAJ/algCf2pYAn9qWAJ/algCf2pYAn9qWAJ/algCf2pYAn9qWAJ/algCf2pYAn9qWAJ/algCf2pYAn9qWAJ/algB125YAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADdmAAD3JcAddyXAPfclwD/3JcA/9yXAP/clwD/3JcA/9yXAP/clwD/3JcA/9yXAP/clwD/3JcA/9yXAP/clwD/3JcA/9yXAP/clwD/3JcA/9yXAP/clwD/3JcA/9yXAP/clwD/3JcA/9yXAP/clwD/3JcA/9yXAP/clwD/3JcA/9yXAP/clwD33JcAe9yYAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADdmQAQ3ZkAn92aAP/dmgD/3ZoA/92aAP/dmgD/3ZoA/92aAP/dmgD/3ZoA/92aAP/dmgD/3ZoA/92aAP/dmgD/3ZoA/92aAP/dmgD/3ZoA/92aAP/dmgD/3ZoA/92aAP/dmgD/3ZoA/92aAP/dmgD/3ZoA/92aAP/dmgD/3ZoA/92aAP/dmgD/3ZkAn92ZABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADfmwAQ35sAn9+cAP/fnAD/35wA/9+cAP/fmwCv3psAf96bAH/emwB/3psAf96bAH/emwB/3psAf96bAH/emwB/3psAf96bAH/emwB/3psAf96bAH/emwB/3psAf96bAH/emwB/3psAf96bAH/emwB/3psAg9+bALHfnAD/35wA/9+cAP/fnAD/35sAn9+bABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADhnQAQ4Z0An+GeAP/hngD/4Z4A/+GeAP/gnAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4JwAAuCcABnhngD/4Z4A/+GeAP/hngD/4Z0An+GdABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADjoAAQ46AAn+OgAP/joAD/46AA/+OgAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADjoAD/46AA/+OgAP/joAD/46AAn+OgABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADlogAQ5KIAn+WiAP/logD/5aIA/+WiAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADlogD/5aIA/+WiAP/logD/5KIAn+WiABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADmpAAQ5qQAn+alAP/mpQD/5qUA/+alAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADmpQD/5qUA/+alAP/mpQD/5qQAn+akABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADopgAQ6KYAn+inAP/opwD/6KcA/+inAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADopwD/6KcA/+inAP/opwD/6KYAn+imABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADqqQAQ6akAn+qpAP/qqQD/6qkA/+qpAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADqqQD/6qkA/+qpAP/qqQD/6akAn+qpABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADsqwAQ66sAn+yrAP/sqwD/7KsA/+yrAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADsqwD/7KsA/+yrAP/sqwD/66sAn+yrABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADtrgAQ7a0An+2uAP/trgD/7a4A/+2uAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADtrgD/7a4A/+2uAP/trgD/7a0An+2uABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADusAIQ7q8Cn+6wA//usAP/7rAD/+6wA/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADusAP/7rAD/+6wA//usAP/7q8Cn+6wAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADvsQYQ77EGn++xBv/vsQb/77EG/++xBv8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADvsQb/77EG/++xBv/vsQb/77EGn++xBhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADvswsQ77MLn++zC//vswv/77ML/++zC/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////8AAP///////wAA/g////B/AAD+D///4H8AAPwP///gfwAA/A///+B/AAD8D///4H8AAPwP///gfwAA/AAAAAB/AAD8AAAAAH8AAPwAAAAAfwAA/gAAAAB/AAD/AAAAAP8AAP4AAAAAfwAA/AAAAAA/AAD8AAAAAD8AAPwAAAAAPwAA/Af//8A/AAD8D///8D8AAPwP///wPwAA/A////A/AAD8D///8D8AAPwP///wPwAA/A////A/AAD8D///8D8AAPwP///wPwAA/A////A/AAD8D///8D8AAPwP///wPwAA/A////A/AAD8D///8D8AAPwP///gPwAA/AAAAAA/AAD8AAAAAD8AAPwAAAAAPwAA/AAAAAA/AAD/AAAAAP8AAP///4B//wAA////AH//AAD///4MH/8AAP///BwP/wAA///4Hg//AAD///B/g/8AAP//8P+D/wAA///w/8P/AAD///////8AAP///////wAA////////AAA=";

    buildCell(tr, "Alluc Streams","http://www.alluc.com/stream/"+txt, img);
   
    //Torrentleech
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAD+/v77+/vs7OzOzs6mpqaGhoZ7e3uMjIyqqqq5ubmsrKyVlZWWlpazs7Pd3d319fX+/v73"+
        "9/fa2tpFRUUAAAAAAAAAAAAAAAA0NDQ/Pz8AAAAAAAAAAAAuLi66urrs7Oz////7+/taWloAAABu"+
        "b29KS0pBQUFgYWAAAAAAAAAIgUUFRyYENh0AAACjo6Pk5OT///////8AAADP0dCwsbCYmZiNj46z"+
        "tbQAAAAPDw8NxGkIf0QEQCIAAACbm5vh4eH///////8cHBzz9fTy9PPDxcQAAAAAAACPj49DQ0My"+
        "34kMvGUGXzMAAACenp7h4eH///////81NTX19vbz9fSxs7IAAADz8/P///9NTU1K4pYO2XQHcDwA"+
        "AAChoaHh4eH///////80NDT19vXx8/KCg4MAAAC8vLz///89PT1G4pQO2XQHcDwAAAChoaHh4eH/"+
        "//////8fHx/z9fTS09NdXl0AAAB2dnbv7+8rKytC4ZIO2XQHcDwAAAChoaHh4eH///91dXUVFRXz"+
        "9fTJy8pdXl0AAAAAAABVVVUjIyM/4ZAO2XQHcDwAAAChoaHh4eH///8pKSn09vX09vXm6OeIiYhX"+
        "WFhzdHMAAAAtLS1B4ZEO2XQHcDwAAAChoaHh4eH///9SUlL3+Pf3+Pf19/bW19aoqanDxMMgICBG"+
        "RkZH4pUO2XQHcDwAAAChoaHh4eH///+oqKiAgID5+vr4+fjz9fQAAAAHBweYmJhfX19f5qMs3oUJ"+
        "h0gAAACrq6vk5OT///////+NjY36+/r5+vn19/YAAAD///////9zc3OC67de5qIMumMAAADCwsLs"+
        "7Oz///////+xsbGTk5OIiIj29/cTExP///////9+fn6Z78R+67Uq3YQAAADm5ub19fX/////////"+
        "//////+oqKhJSUl7e3v///////+qqqqIiIh3d3dAQEB0dHT////+/v7/////////////////////"+
        "//////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    if (tv){buildCell(tr, "TorrentLeech","http://www.torrentleech.org/torrents/browse/index/query/"+txt+"/categories/2,26,27,32,7,34,35", img);}
    else{ buildCell(tr, "TorrentLeech","http://www.torrentleech.org/torrents/browse/index/query/"+txt+"/categories/1,8,9,10,11,12,13,14,15,29,7,34,35", img);}
}

function buildCell(container, title, href, image){
    var a = document.createElement("a");

    if ((title == "Subs4free")||(title == "Btscene")||(title == "Podnapisi")) {
        href = href.replace(/\s/g, "+");} //replace spaces with +'s
    a.href = href; 
    a.setAttribute("target","_blank");
    a.title=title;	
    var img = document.createElement("img");
    img.src = image;
    img.setAttribute("height","16");//needed for Chrome
    img.setAttribute("witdh","16");//needed for Chrome

    a.appendChild(img);
    var cell = container.insertCell(0);
    cell.appendChild(a);
}

function _addStyle(css){
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.innerHTML = css;
            heads[0].appendChild(node); }}}