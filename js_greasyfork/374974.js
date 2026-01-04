// ==UserScript==
// @name         Add io-add button
// @version      0.1
// @description  Personal bookmark site button adder.
// @author       iocelhck
// @grant        none
// @match        *://*/*
// @namespace    iocelhck://io:add
// @downloadURL https://update.greasyfork.org/scripts/374974/Add%20io-add%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/374974/Add%20io-add%20button.meta.js
// ==/UserScript==

(function(){
  var stag = document.createElement("style");
  stag.type = 'text/css';
  var css = "body div#ioadd { \
		width: 60px; padding: 3px !important; margin: 0 !important; \
    background: #222 !important; color: #CC6 !important; \
  	position: fixed; top: 3px; right: 3px; \
		cursor: pointer; \
	  text-align: center; vertical-align: middle; \
		font-family: Trebuchet MS, Verdata, sans-serif; \
		z-index: 999999; \
		border-radius: 4px; \
		}\
		body div#ioadd:hover { background: #622 !important; } \
		body div#ioadd span { vertical-align: middle; }";
 	stag.appendChild(document.createTextNode(css));
  document.head.appendChild(stag);
  var dtag = document.createElement("div");
  dtag.id = "ioadd";
  dtag.innerHTML = "<span>io:add</span>";
  dtag.onclick = function(){
    // stopwords from https://github.com/Yoast/YoastSEO.js/blob/develop/src/config/stopwords.js
    var stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", 
                     "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", 
                     "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", 
                     "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", 
                     "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", 
                     "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", 
                     "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", 
                     "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", 
                     "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", 
                     "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves",
                     // plus some custom ones
                     "reply", "points", "view", "post", "comments", "replies", "facebook", "pinterest"
                    ];
    var tags = {};
    var text = document.body.innerText;
    text = text.replace(/[^A-Za-z-]+/g, ' ');
		var words = text.split(' ');
		if (words.length) {
      for (var i = 0, length = words.length; i < length; i++) {
        var word = words[i].toLowerCase();
        if ((word.length > 3) && (stopwords.indexOf(word) < 0))
        {
        	if (!(word in tags))
            tags[word] = 0;
          tags[word]++;
        }
      }
    }
    for (var i = 0, length = tags.length; i < length; i++) {
        if (tags[i] < 10)
        	delete tags[i];
    }
    var sorted = Object.keys(tags).sort(function(a,b) { return tags[b] - tags[a]; });
    // alert(sorted.map(x => x + ":" + tags[x]));
   	tags = sorted.slice(0, 10).join(",");
    // alert(tags);
    open('http://iocelhacker.pythonanywhere.com/links/add?'
         + 'tags=' + encodeURI(tags)
         + '&url=' + encodeURI(location.href)
         + '&title=' + encodeURI(document.title),
         '_blank');
  };
  document.body.appendChild(dtag);
})();
