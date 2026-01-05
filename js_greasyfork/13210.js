// ==UserScript==
// @name         IMDb Search
// @version      1.5
// @description  Search on imdb.com
// @author       FuSiOn
// @match        https://*/*
// @match        http://*/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/10999
// @downloadURL https://update.greasyfork.org/scripts/13210/IMDb%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/13210/IMDb%20Search.meta.js
// ==/UserScript==

$.expr[":"].containsI = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().trim().toUpperCase()
            .indexOf(arg.trim().toUpperCase()) >= 0;
    };
});
$.expr[":"].containsX = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().trim()
            .replace(/\s\([IVX]+\)\s/," ")
            .replace(/\sII(?:\s|:|$)/g,"2")
            .replace(/\sIII(?:\s|:|$)/g,"3")
            .replace(/\sIV(?:\s|:|$)/g,"4")
            .replace(/\sV(?:\s|:|$)/g,"5")
            .replace(/\sVI(?:\s|:|$)/g,"6")
            .replace(/\sVII(?:\s|:|$)/g,"7")
            .replace(/\sIIX(?:\s|:|$)/g,"8")
            .replace(/\sIX(?:\s|:|$)/g,"9")
            .replace(/\sX(?:\s|:|$)/g,"10")
            .replace(/the\b|part(?=\s?\d)/ig,"")
            .replace(/and/ig,"&")
            .replace(/äàâ/ig,"A")
            .replace(/ç/ig,"C")
            .replace(/éèëê/ig,"E")
            .replace(/\W/g,"")
            .toUpperCase()
            .indexOf(arg.trim().replace(/\sII(?:\s|:|$)/g,"2")
                     .replace(/\sIII(?:\s|:|$)/g,"3")
                     .replace(/\sIV(?:\s|:|$)/g,"4")
                     .replace(/\sV(?:\s|:|$)/g,"5")
                     .replace(/\sVI(?:\s|:|$)/g,"6")
                     .replace(/\sVII(?:\s|:|$)/g,"7")
                     .replace(/\sIIX(?:\s|:|$)/g,"8")
                     .replace(/\sIX(?:\s|:|$)/g,"9")
                     .replace(/\sX(?:\s|:|$)/g,"10") 
                     .replace(/the\b|part(?=\s?\d)|p(?=\d)|3d/ig,"")
                     .replace(/and/ig,"&")
                     .replace(/äàâ/ig,"A")
                     .replace(/ç/ig,"C")
                     .replace(/éèëê/ig,"E")
                     .replace(/\W/g,"")
                     .toUpperCase()) >= 0;
    };
});
var IMDb = {
    search: function(arg){
        var argType = typeof arg;
        if((argType != "object" && argType != "string") || (argType=== "object" && typeof arg.title === "undefined")){
            console.log("IMDB_SEARCH: Illegal arguments",arg);
            return;
        }
        if(argType === "string"){
            var str = arg.trim().match(/(.+?)\(?((?:19|20)\d\d)?\)?$/);
            arg = {};
            arg.title = str[1];
            arg.year  = str[2]; 
        }
        arg.year     = (typeof arg.year === "undefined")     ? ""                                 : arg.year;
        arg.type     = (typeof arg.type === "undefined")     ? "movie"                            : arg.type;
        arg.node     = (typeof arg.node === "undefined")     ? ""                                 : arg.node;
        arg.callback = (typeof arg.callback === "undefined") ? function(info){console.log(info);} : arg.callback;
        arg.retry    = (typeof arg.retry === "undefined")    ? false                              : arg.retry;
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://akas.imdb.com/find?ref_=nv_sr_fn&s=all&q=" + encodeURIComponent(arg.title) + ((arg.type === "tv")? "&ttype=tv":"&ttype=ft"),
            onload: function(response) {
                if (response.status == 200) {
                    if (!/<a name="tt"><\/a>[\w\W]+?<\/table>/i.test(response.responseText)) {
                        if (/No results found for/.test(response.responseText)) {
                            console.log("IMDB_Search: No result found for:", arg.title, arg.year);
                        } else {
                            console.log("IMDB_Search: A unknown error has occured:", arg.title, arg.year);
                        }
                        return;
                    }
                    var responseData = response.responseText.match(/<a name="tt"><\/a>[\w\W]+?<\/table>/i)[0]
                    .replace(/(<img[\w\W]+?src=)"[^"]+"/g, '$1""'),
                        selector = {
                            "movie" :'.findResult:containsX("' + arg.title + '"):not(:containsI("(video game)"),:containsI("(tv episode)"),:containsI("(tv series)"),:containsI("(tv mini-series)"),:containsI("(short)"))',
                            "tv":'.findResult:containsX("' + arg.title + '"):containsI("(TV Series)"),.findResult:containsX("' + arg.title + '"):containsI("(tv series)"),.findResult:containsX("' + arg.title + '"):containsI("(tv mini-series)")',
                            "game": '.findResult:containsX("' + arg.title + '"):containsI("(Video Game)")'
                        },
                        result,
                        results = $(selector[arg.type], responseData);
                    if (results.length > 0) {
                        if (results.length > 1) {
                            if (arg.year) {
                                if (results.find(":contains('" + arg.year + "')").length === 0) {
                                    if (results.find(":contains('" + (parseInt(arg.year) - 1) + "')").length === 0) {
                                        results = results.find(":contains('" + (parseInt(arg.year) + 1) + "')");
                                    }else{
                                        results = results.find(":contains('" + (parseInt(arg.year) - 1).toString() + "')");
                                    }
                                } else {
                                    results = results.find(":contains('" + arg.year + "')");
                                }
                            }
                            if (results.length > 0) {
                                $('small',results[0]).remove();
                                result = $(results[0]).find("a").attr("href").match(/tt\d+/)[0];
                                IMDb.info({id:result, node:arg.node, callback:arg.callback});
                            } else {
                                console.log("IMDB_Search: ", "Found no match with the given query and year:", arg.title, arg.year);
                            }
                        } else {
                            $('small',results[0]).remove();
                            result = $(results[0]).find("a").attr("href").match(/tt\d+/)[0];
                            IMDb.info({id:result, node:arg.node, callback:arg.callback});
                        }
                    } else {
                        if ($('.findResult', responseData).length === 1) {
                            results = $('.findResult', responseData);
                            $('small',results[0]).remove();
                            result = $(results[0]).find("a").attr("href").match(/tt\d+/)[0];
                            IMDb.info({id:result, node:arg.node, callback:arg.callback});
                        } else {
                            if(arg.type === 'movie' && arg.retry === false && /[\[(][^\])]+[\])]/.test(arg.title)){
                                IMDb.search({title:title.replace(/[\[(][^\])]+[\])]/,""), year:arg.year, node:arg.node, callback:arg.callback, retry:true});
                            }else{
                                console.log("IMDB_Search: ", "Found no match with the given query:", arg.title, arg.year);
                            }
                        }
                    }
                } else {
                    console.log(response.status + " " + response.statusText);
                }
            }
        });
    },
    info: function(arg){
        var argType = typeof arg;
        if((argType != "object" && argType != "string") || (argType=== "object" && typeof arg.id === "undefined") || (argType === "string" && !(/^tt\d+$/.test(arg.trim())))){
            console.log("IMDB_INFO: Illegal arguments",arg);
            return;
        }
        if(argType === "string"){
            arg = {id:arg.match(/tt\d+/)[0]};
        }
        arg.node     = (typeof arg.node === "undefined")     ? ""                                 : arg.node;
        arg.callback = (typeof arg.callback === "undefined") ? function(info){console.log(info);} : arg.callback;
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://akas.imdb.com/title/" + arg.id,
            onload: function(response) {
                if (response.status == 200) {
                    if(/\/combined$/.test(response.finalUrl)){
                        console.log('Please disable the setting "Always display full cast and crew credits" in your account.');
                        return;
                    }
                    if(!/<div id="title-overview-widget"[^>]+>[\w\W]+?<\/div>\W+?(?=<script>)/i.test(response.responseText)){
                        console.log('IMDb_GetInfo: ','Unknown error occurred.');
                        return;
                    }
                    var fullResponse = response.responseText.replace(/(<img[\w\W]+?src)=("http:\/\/ia\.media-imdb\.com[^"]+")/g, '$1New=$2'),
                        responseData = fullResponse.match(/<div id="title-overview-widget"[^>]+>[\w\W]+?<\/div>\W+?(?=<script>)/i)[0],
                        Info = {
                            "Title":  	     $('.header [itemprop="name"],h1[itemprop="name"]',responseData).text().trim().replace(/\s?\((?:19|20)\d\d\)$/,"") ,
                            "Year":		     $('.header .nobr,#titleYear,[title="See more release dates"]',responseData)[0].textContent.trim().replace(/^.*\(|\)/g,""),
                            "ID":     	     arg.id,
                            "Rating": 	     $('span[itemprop="ratingValue"]', responseData).text(),
                            "ratingCount":   $('span[itemprop="ratingCount"]', responseData).text(),
                            "contentRating": $('[itemprop="contentRating"]', responseData).attr('content'),
                            "Duration":		 typeof($('[itemprop="duration"]', responseData).attr('datetime')) == 'undefined' ? null : $('[itemprop="duration"]', responseData).attr('datetime').replace(/PT(\d+)M/,'$1 min'),
                            "releaseDate":	 $('a [itemprop="datePublished"]', responseData).parent().text().trim(),
                            "Genre":  	     "",
                            "URL":    	     "http://www.imdb.com/title/" + arg.id,
                            "Poster": 	     $('img[alt*="Poster"]', responseData).attr('srcNew') || '',
                            "Trailer":	     typeof($("[itemprop=trailer]", responseData).attr("href")) == 'undefined' ? '' : "http://imdb.com" + $("[itemprop=trailer]",responseData).attr("href"),
                            "InWatchList":   null,
                            "InLists":	     null,
                            "Description":   $('[itemprop="description"]', responseData).text().trim(),
                            "Stars":	     [],
                            "Director": 	 [],
                            "Creator":		 []
                        },
                        stars 	 =  $('[itemprop="actors"] a', responseData).has('[itemprop="name"]'),
                        director = 	$('[itemprop="director"] a', responseData).has('[itemprop="name"]'),
                        creator	 =	$('[itemprop="creator"] a', responseData).has('[itemprop="name"]'),
                        logged 	 = 	/nblogout/.test(response.responseText);
                    $('span[itemprop="genre"]', responseData).each(function() {
                        if (Info.Genre !== "") {
                            Info.Genre += " | ";
                        }
                        Info.Genre += $(this).text();
                    });
                    stars.each(function(){
                        var Star = Info.Stars.push({
                            "Name": $('[itemprop="name"]',this).text(),
                            "URL":	'http://www.imdb.com' + $(this).attr('href'),
                            "Image":""
                        }) -1,
                            $image = $("img[alt=" + '"' + Info.Stars[Star].Name + '"' + "]",fullResponse),
                            image;
                        if($image.length > 0){
                            image = typeof($image.attr("loadlate")) === 'undefined' ? $image.attr("srcNew") : $image.attr("loadlate");
                        }
                        Info.Stars[Star].Image  = image;
                    });
                    director.each(function(){
                        Info.Director.push({
                            "Name": $('[itemprop="name"]',this).text(),
                            "URL":	'http://www.imdb.com' + $(this).attr('href'),
                        });
                    });
                    creator.each(function(){
                        Info.Creator.push({
                            "Name": $('[itemprop="name"]',this).text(),
                            "Type": this.nextSibling.nodeType === 3 ? this.nextSibling.textContent.replace(/\((.+)\)\W*$/,'$1').replace(',','').trim(): '',
                            "URL":	'http://www.imdb.com' + $(this).attr('href'),
                        });
                    });
                    if(logged){
                        GM_xmlhttpRequest({
                            method:  "POST",
                            url:     "http://www.imdb.com/list/_ajax/watchlist_has",
                            data:    "consts%5B%5D=" + Info.ID + "&tracking_tag=wlb-lite",
                            headers:    {
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                            },
                            onload:  function(response) {
                                if(response.status == 200){
                                    var obj = JSON.parse(response.responseText);
                                    if(obj.status === 200){
                                        if(typeof(obj.has[Info.ID]) !== "undefined"){
                                            Info.InWatchList = true;
                                        }else Info.InWatchList = false;
                                        GM_xmlhttpRequest({
                                            method:  "POST",
                                            url:     "http://www.imdb.com/list/_ajax/wlb_dropdown",
                                            data:    "tconst=" + Info.ID,
                                            headers:    {
                                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                                            },
                                            onload:  function(response) {
                                                if(response.status == 200){
                                                    var obj = JSON.parse(response.responseText);
                                                    if(obj.status === 200){
                                                        obj.items.forEach(function(item){
                                                            if(item.data_list_item_ids !== null){
                                                                if(Info.InLists === null) Info.InLists = [];
                                                                Info.InLists.push(item.data_list_id);
                                                            }
                                                        });
                                                        arg.callback(Info,arg.node);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }else{
                        arg.callback(Info,arg.node);
                    }
                }
            }
        });
    },
    inLists: function(arg){
        if(typeof arg === "string" && /^tt\d+$/.test(arg.trim())){
            arg = {id:arg};
        }
        arg.node     = (typeof arg.node === "undefined")     ? ""                                  : arg.node;
        arg.callback = (typeof arg.callback === "undefined") ? function(info){console.log(info);}  : arg.callback;
        GM_xmlhttpRequest({
            method:  "POST",
            url:     "http://www.imdb.com/list/_ajax/watchlist_has",
            data:    "consts%5B%5D=" + arg.id + "&tracking_tag=wlb-lite",
            headers:    {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            onload:  function(response) {
                if(response.status == 200){
                    var obj = JSON.parse(response.responseText);
                    if(obj.status === 200){
                        var Info  = {};
                        if(typeof(obj.has[arg.id]) !== "undefined"){
                            Info.InWatchList = true;
                        }else Info.InWatchList = false;
                        GM_xmlhttpRequest({
                            method:  "POST",
                            url:     "http://www.imdb.com/list/_ajax/wlb_dropdown",
                            data:    "tconst=" + arg.id,
                            headers:    {
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                            },
                            onload:  function(response) {
                                if(response.status == 200){
                                    var obj = JSON.parse(response.responseText);
                                    if(obj.status === 200){
                                        Info.InLists = [];
                                        obj.items.forEach(function(item){
                                            if(item.data_list_item_ids !== null){
                                                Info.InLists.push(item.data_list_id);
                                            }
                                        });
                                        arg.callback(Info,arg.node);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    getYouTube: function(arg){
        var argType = typeof arg;
        if((argType != "object" && argType != "string") || (argType=== "object" && typeof arg.title === "undefined")){
            console.log("getYouTube: Illegal arguments",arg);
            return;
        }
        if(argType === "string"){
            var str = arg.trim().match(/(.+?)\(?((?:19|20)\d\d)?\)?$/);
            arg = {};
            arg.title = str[1];
            arg.year  = str[2]; 
        }
        arg.node     = (typeof arg.node === "undefined")     ? ""                                 : arg.node;
        arg.year     = (typeof arg.year === "undefined")     ? ""                                 : arg.year;
        arg.callback = (typeof arg.callback === "undefined") ? function(info){console.log(info);} : arg.callback;
        GM_xmlhttpRequest({
            method:  "GET",
            url:     encodeURI("https://www.youtube.com/results?search_query=" + arg.title + ' ' + arg.year + " HD trailer+" + arg.type),
            headers:    {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            onload:  function(response) {
                if(response.status == 200){
                    var regex = new RegExp('href="\/watch\\?v=([^"]+)".*?title=".*?' + arg.title +'.+?(?:' + arg.year + ')?',"im"),
                        Info  = {Trailer:""};
                    if(regex.test(response.responseText)){
                        Info.Trailer  = "https://www.youtube.com/embed/" + regex.exec(response.responseText)[1];
                        arg.callback(Info,arg.node);
                    }
                }
            }
        });
    }
};
unsafeWindow.IMDb = IMDb;