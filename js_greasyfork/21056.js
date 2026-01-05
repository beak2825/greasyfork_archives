// ==UserScript==
// @name       NewsPlease
// @namespace   5060bb20c2ee4e90acf1a84d8349a2fa
// @version    0.4.3
// @grant       none
// @description  Pour ne voir que les news dans le topic des... news.
// @include      http://forum.canardpc.com/threads/123221*
// @include      https://forum.canardpc.com/threads/123221*
// @copyright  2014+, louck
// @downloadURL https://update.greasyfork.org/scripts/21056/NewsPlease.user.js
// @updateURL https://update.greasyfork.org/scripts/21056/NewsPlease.meta.js
// ==/UserScript==

function main(){
    var inputLastNews;
    var inputPreviousNews;
    var inputPreviousNewsIsAdded = false;

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

        inputLastNews=document.createElement("input");
        inputLastNews.type="button";
        inputLastNews.value="Afficher les dernières news (v0.4)";
        inputLastNews.onclick = lastNewsFromLastPage;
        inputLastNews.setAttribute("style", inputStyle+inputColorOn+"cursor:pointer");
        inputLastNews.setAttribute("class","newcontent_textcontrol");
        document.getElementById('thread_controls').appendChild(inputLastNews);

        inputPreviousNews=document.createElement("input");
        inputPreviousNews.type="button";
        inputPreviousNews.value="Précédentes news";
        inputPreviousNews.onclick = lastNewsFromLastPageId;
        inputPreviousNews.setAttribute("style", inputStyle+inputColorOn+"cursor:pointer");
        inputPreviousNews.setAttribute("class","newcontent_textcontrol");
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
        inputLastNews.value = "Lecture en cours (0/"+maxNewsPost+")";
        inputLastNews.setAttribute("style", inputStyle+inputColorLoading);
        inputLastNews.disabled = true;

        if(!inputPreviousNewsIsAdded){
            inputPreviousNewsIsAdded = true;
            document.getElementById('below_postlist').appendChild(inputPreviousNews);
        }

        inputPreviousNews.value = inputLastNews.value;
        inputPreviousNews.setAttribute("style", inputStyle+inputColorLoading);
        inputPreviousNews.disabled = true;


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

    // Precision: Pour eviter le "spam" de requêtes, je limite le nombre de page à 10.
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
                var doc = document.implementation.createHTMLDocument("title");
                doc.documentElement.innerHTML = result.responseText;

				removeIgnoredPosts(doc);

				var news = getPostNews(doc);
				applyNewsStyleToPosts(news);
                posts = posts.concat(news);

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
                    inputLastNews.value = "Lecture en cours ("+countPosts+"/"+maxNewsPost+") ";
                    for(var j=0; j<=countPage; j++) inputLastNews.value = inputLastNews.value + ".";

                    inputPreviousNews.value = inputLastNews.value;

                    // Autre technique pour éviter le spam
                    setTimeout(function(){lastNewsRecursive(parseInt(pageID) - 1, countPosts, countPage + 1);}, 750);
                } else {
                    inputLastNews.value= "Précédentes news";
                    inputLastNews.onclick = inputPreviousNews.onclick;
                    inputLastNews.setAttribute("style", inputStyle+inputColorOn+"cursor:pointer");
                    inputLastNews.disabled = false;

                    inputPreviousNews.value = inputLastNews.value;
                    inputPreviousNews.onclick = inputLastNews.onclick;
                    inputPreviousNews.setAttribute("style", inputStyle+inputColorOn+"cursor:pointer");
                    inputPreviousNews.disabled = false;
                }
            }
        });
    }



// **********************************************************************

    function isNews(post){
        return post.innerHTML.indexOf("<a ") > -1 									// Lien, Twitter, Img avec lien...
			|| post.innerHTML.indexOf('type="application/x-shockwave-flash"') > -1 	// Flash (ex Youtube)
			|| post.innerHTML.indexOf('<iframe ') > -1 								// IFrame (new Youtube)
			|| post.innerHTML.indexOf('#newsfeed') > -1;							// Tag
    }

    function removeIgnoredPosts(docu){
		var posts = docu.getElementsByClassName('postbitignored');
		for(var i=posts.length-1; i>=0; i--){
			var post = posts[i];
			var parentPost = post.parentNode;
			parentPost.removeChild(post);
		}
	}

    function getPostNews(docu){
        var postsResult = Array();

        var posts = docu.getElementsByClassName('postbitim');

        // On boucle les posts de la page en cours (au sens inverse, pour avoir les posts les plus récents)
        for(var i=posts.length-1; i>=0; i--){
            var post = posts[i];
            var contents = post.getElementsByClassName('postcontent');
            var content = contents[0];

            // Désactiver les quotes (pour faciliter la recherche). Nous enregistrons son contenu pour plus tard.
            var quoteSaves = new Array();
            var quoteParents = new Array();
            hideQuotesFromPost(docu, post, quoteSaves, quoteParents);

            // Chercher les news
            if (isNews(content)) {
                postsResult.push(post);
            }

            // Réactiver les quotes
            showSavedQuotes(docu, quoteSaves, quoteParents);
        }

        return postsResult;
    }

	function applyNewsStyleToPosts(posts){
		for(var i=posts.length-1; i>=0; i--){
            var post = posts[i];
			post.setAttribute("style", newsStyle);
			var newsHeader = post.getElementsByClassName('posthead');
			if(newsHeader.length > 0) newsHeader[0].setAttribute("style", newsHeaderStyle);
        }
	}

    function updateCurrentPageNews(){
		var news = getPostNews(document);
		applyNewsStyleToPosts(news);
    }

	function hideQuotesFromPost(document, post, quoteSaves, quoteParents){
        var quotes = post.getElementsByClassName('bbcode_quote');

		for(var j=quotes.length-1; j>=0; j--){
			var quote = quotes[j];
			var quoteParent = quote.parentNode;

			quoteSaves.push(quote.outerHTML);
			quoteParents.push(quoteParent);
			quoteParent.removeChild(quote);
		}
	}

	function showSavedQuotes(document, quoteSaves, quoteParents){
		for(var j=quoteSaves.length-1; j>=0; j--){
			var quote = quoteSaves[j];
			var parentQuote = quoteParents[j];

			var newQuote = document.createTextNode(quote);
			parentQuote.innerHTML += quote;
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
