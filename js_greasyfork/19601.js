// ==UserScript==
// @name        Google +1 Remover
// @namespace   MegaByteG+R
// @description A script which removes the google plus +1 sign
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at      document-idle
// @include     *
// @version     0.9.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19601/Google%20%2B1%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/19601/Google%20%2B1%20Remover.meta.js
// ==/UserScript==


    if(!('includes' in String.prototype)) {
       	String.prototype.includes = function(str, startIndex) {
            return -1 !== String.prototype.indexOf.call(this, str, startIndex);
       	};
 	}
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };


    this.$ = this.jQuery = jQuery.noConflict(true);

    $.fn.removeWithLog = function() {
       return this.each(function() {
          if(this.length != 0) {
             console.info("Google +1 Remover:"+
                          "\n\tid = " + $(this).attr("id") +
                          "\n\tclass = " + $(this).attr("class") +
                          "\n\thtml = " + $(this).html());
             this.remove();
          }
       });
    };
    

    var attr = ["class", "id", "title", "tooltip"];
    var filter = ["googleplus", "google_plus", "google-plus", "gplus", "g_plus", "g-plus", "google+"];
    var complex_filter = ["[<attr>*=social][<attr>*=plusone]", "[<attr>*=social][<attr>*=google]"];
    
    for(var a of attr) {
        for(var f of filter) $("["+a+"*="+f+"]").removeWithLog();
        for(var cf of complex_filter) $(cf.replaceAll("<attr>", a)).removeWithLog();
    }
    
    
    var site = window.location.href || document.URL;
    if(site.includes("plus.google.com")) {
        var content = $("body > *").detach();
        $("body").append("                                                      \
           <center style='margin-top: 25px;'>              \
              <h1 style='margin-bottom: 10px;'>Are you sure you want to be here?</h1>                        \
              <input type='button' value='Take me Away!' class='_away' />       \
              <input type='button' value='Show site!' class='_show' />          \
           </center>                                                            \
        ");
        $("._show").click(function() {
           $("body > *").remove();
            $("body").append(content);
        });
        $("._away").click(function() {
           window.location.href = document.referrer;
        });
    }