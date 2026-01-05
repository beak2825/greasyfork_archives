// ==UserScript==
// @name       NewsPlease
// @namespace   5060bb20c2ee4e90acf1a84d8349a2fa
// @version    0.4.1
// @grant       none
// @description  Pour ne voir que les news dans le topic des... news.
// @include      http://forum.canardpc.com/threads/94913*
// @include      http://forum.canardpc.com/threads/98070*
// @include      http://forum.canardpc.com/threads/102308*
// @copyright  2014+, lucskywalker
// @downloadURL https://update.greasyfork.org/scripts/13244/NewsPlease.user.js
// @updateURL https://update.greasyfork.org/scripts/13244/NewsPlease.meta.js
// ==/UserScript==

function main(){
    var input;
    var input2;
    var input2IsAdded = false;
    
    var inputStyle = "font-size:16px;font-weight:bold;margin:0 50px 10px 10px;position: relative;";
    var inputColorOn = "background-color:green;";
    var inputColorLoading = "background-color:darkgrey;";
    var inputColorOff = "background-color:grey;";
    var inputColorOnlyNewsOn = "background-color:#004300;";
    var inputColorOnlyNewsOff = "background-color:#430000;";
    var newsStyle = "border-color:green; border-width:2px";
    var newsHeaderStyle = "background-color:green;";

    var cookiename = "cpcnewsplease";
    var maxNewsPost = 20;
    
    
    jQ(document).ready(function() {
        updateCurrentPageNews();
        
        input=document.createElement("input");
        input.type="button";
        input.value="Afficher les dernières news (v0.4)";
        input.onclick = lastNewsFromLastPage;
        input.setAttribute("style", inputStyle+inputColorOn+"cursor:pointer");
        input.setAttribute("class","newcontent_textcontrol");
        document.getElementById('thread_controls').appendChild(input); 
        
        input2=document.createElement("input");
        input2.type="button";
        input2.value="Précédentes news";
        input2.onclick = lastNewsFromLastPageId;
        input2.setAttribute("style", inputStyle+inputColorOn+"cursor:pointer");
        input2.setAttribute("class","newcontent_textcontrol");
    });
    
/*************************************/
    
    function getLastPageID(){
        var len = document.getElementById("pagination_top").children[0].children.length;
        if(len == 0) return window.location.href;
        var elt = document.getElementById("pagination_top").children[0].children[len-2].children[0];
        
        if(elt.href[0] == "h"){
            var index = elt.href.indexOf("/page");
            return elt.href.substring(index+5);
        } else {
            return elt.innerHTML;
        }
    }
    
    var lastPageIdFromLastNews;
    function lastNewsFromLastPageId(){
        window.top.window.scrollTo(0,0);
        lastNews(lastPageIdFromLastNews-1);
    }
    
    function lastNewsFromLastPage(){
        window.top.window.scrollTo(0,0);
        lastNews(getLastPageID());
    }
    
    function lastNews(pageID){
        // Boutons
        input.value = "Lecture en cours (0/"+maxNewsPost+")";    
        input.setAttribute("style", inputStyle+inputColorLoading);
        input.disabled = true;
        
        if(!input2IsAdded){
            input2IsAdded = true;
            document.getElementById('below_postlist').appendChild(input2);
        }
        
        input2.value = input.value;    
        input2.setAttribute("style", inputStyle+inputColorLoading);
        input2.disabled = true;
        
        
        // Clean des posts
        var currentPosts = document.getElementsByClassName('postbitim');

        for(var i=currentPosts.length-1; i>=0; i--){
            var post = currentPosts[i];
            var parentPost = post.parentNode;
            parentPost.removeChild(post);
        }
        
        // Faire appel a la vrai methode
        lastNewsRecursive(pageID, 0, 0);
    }
    
    // Precision: Pour eviter le "spam" de requêtes, je limite le nombre de page limité à 10.
    function lastNewsRecursive(pageID, countPosts, countPage){
       var posts = [];
       var url = document.getElementsByClassName("threadtitle")[0].children[0].href;
       url = url.replace(/\/page[0-9]*/g, "");
       url = url + "/page"+pageID;
        
       jQ.ajax ({
            type:       'GET',
            url:        url,
            dataType:   'JSON',
            complete:    function (result) {
                var doc = document.implementation.createHTMLDocument ("title");
                doc.documentElement.innerHTML = result.responseText;
                posts = posts.concat(getPostNews(doc));
                
                lastPageIdFromLastNews = pageID;
                
                // Afficher les posts chargés (au fur et à mesure)
                var currentPosts = document.getElementsByClassName('postbitim');
                    
                // Add
                for(var i=0; i < posts.length; i++){
                    var post = posts[i];
                    document.getElementById("posts").appendChild(post);
                }
                
                countPosts = countPosts + posts.length;
                
                if(countPosts < maxNewsPost && parseInt(pageID) > 1 && countPage < 10){
                    input.value = "Lecture en cours ("+countPosts+"/"+maxNewsPost+") ";
                    for(var i=0; i<=countPage; i++) input.value = input.value + ".";
                    
                    input2.value = input.value;
                    
                    // Autre technique pour éviter le spam
                    setTimeout(function(){lastNewsRecursive(parseInt(pageID) - 1, countPosts, countPage + 1);}, 750);
                } else {
                    input.value= "Précédentes news";
                    input.onclick = input2.onclick;
                    input.setAttribute("style", inputStyle+inputColorOn+"cursor:pointer");
                    input.disabled = false;
                    
                    input2.value = input.value;
                    input2.onclick = input.onclick;
                    input2.setAttribute("style", inputStyle+inputColorOn+"cursor:pointer");
                    input2.disabled = false;
                }
            }
        });
    }
    

    
// **********************************************************************
  
    function isNews(post){
        return !(post.innerHTML.indexOf("<a ") === -1 && post.innerHTML.indexOf('type="application/x-shockwave-flash"') === -1 && post.innerHTML.indexOf('#newsfeed') === -1);
    }
        
    function getPostNews(docu){
        var postsResult = Array();

        // Supprimer les posts ignorés (parce que)
        var posts = docu.getElementsByClassName('postbitignored');
        for(var i=posts.length-1; i>=0; i--){
            var post = posts[i];
            var parentPost = post.parentNode;
            parentPost.removeChild(post);
        }

        posts = docu.getElementsByClassName('postbitim');

        // On boucle les posts de la page en cours (au sens inverse, pour avoir les posts les plus récents)  
        for(var i=posts.length-1; i>=0; i--){
            var post = posts[i];
            var contents = post.getElementsByClassName('postcontent');
            var content = contents[0];

            // Désactiver les quotes (pour faciliter la recherche). Nous enregistrons son contenu pour plus tard.
            var quotes = post.getElementsByClassName('bbcode_quote');
            var quoteSaves = new Array();
            var quoteParents = new Array();
            for(var j=quotes.length-1; j>=0; j--){
                var quote = quotes[j];
                var parentQuote = quote.parentNode;

                quoteSaves.push(quote.outerHTML);
                quoteParents.push(parentQuote);
                parentQuote.removeChild(quote);
            }


            // Chercher les news (via liens URL, YT/Flash, ou #newsfeed)
            if (isNews(content)) {
                // Réactiver les quotes
                for(var j=quoteSaves.length-1; j>=0; j--){
                    var quote = quoteSaves[j];
                    var parentQuote = quoteParents[j];

                    var newQuote = docu.createTextNode(quote);
                    parentQuote.innerHTML += quote;
                }

                post.setAttribute("style", newsStyle);
                var newsHeader = post.getElementsByClassName('posthead');
                if(newsHeader.length > 0) newsHeader[0].setAttribute("style", newsHeaderStyle);
                
                postsResult.push(post);
            }
        }

        return postsResult;
    }
    
    // Ceci est un copier-coller, et je vous enmerde.
    function updateCurrentPageNews(){
        posts = document.getElementsByClassName('postbitim');

        // On boucle les posts de la page en cours (au sens inverse, pour avoir les posts les plus récents)  
        for(var i=posts.length-1; i>=0; i--){
            var post = posts[i];
            var contents = post.getElementsByClassName('postcontent');
            var content = contents[0];

            // Désactiver les quotes (pour faciliter la recherche). Nous enregistrons son contenu pour plus tard.
            var quotes = post.getElementsByClassName('bbcode_quote');
            var quoteSaves = new Array();
            var quoteParents = new Array();
            for(var j=quotes.length-1; j>=0; j--){
                var quote = quotes[j];
                var parentQuote = quote.parentNode;

                quoteSaves.push(quote.outerHTML);
                quoteParents.push(parentQuote);
                parentQuote.removeChild(quote);
            }

            // Chercher les news (via liens URL, YT/Flash, ou #newsfeed)
            if (isNews(content)) {
                post.setAttribute("style", newsStyle);
                var newsHeader = post.getElementsByClassName('posthead');
                if(newsHeader.length > 0) newsHeader[0].setAttribute("style", newsHeaderStyle);
            }

            // Réactiver les quotes
            for(var j=quoteSaves.length-1; j>=0; j--){
                var quote = quoteSaves[j];
                var parentQuote = quoteParents[j];

                var newQuote = document.createTextNode(quote);
                parentQuote.innerHTML += quote;
            }
        }
    }
    
    
// **********************************************************************
    
}



function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}
addJQuery(main);


