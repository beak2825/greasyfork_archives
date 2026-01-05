// ==UserScript==
// @name       		Tumblr Followr
// @namespace  		http://wolfspirals.tumblr.com/
// @version    		0.4
// @description  	Mass follow and unfollow blogs on Tumblr
// @include     	*://www.tumblr.com/following
// @grant		    gm_uwin
// @copyright  		2015+, Allyson Moisan
// @downloadURL https://update.greasyfork.org/scripts/10045/Tumblr%20Followr.user.js
// @updateURL https://update.greasyfork.org/scripts/10045/Tumblr%20Followr.meta.js
// ==/UserScript==

(function () {
    var gm_uwin = ( function() {
            var a;
            try {
                a = unsafeWindow == window ? false : unsafeWindow;
                // Chrome: window == unsafeWindow
            } catch(e) {
            }
            return a || ( function() {
                    var el = document.createElement('p');
                    el.setAttribute('onclick', 'return window;');
                    return el.onclick();
                }());
        }());
    
    var $ = gm_uwin.jQuery,
        procF_start = 0,
        procU_start = 0,
        procF_done = 0,
        procU_done = 0;
    
    if ( typeof $ !== "undefined") {
        $(document).ready(function() {
            var s = '<style type="text/css"> #followr, #followr_hide { width: 230px; height: 130px; position: relative; } ' +
                '#followr { top: 10px; left: 0px; } #followr_hide { top: -120px; left: 0px; } #followr_hide p { width: 100%; } ' + 
                '#followr p { width: 100%; margin: 5px 0px; } #followr label, #followr button { color: black; padding: 4px; font-size: 12px; } ' + 
                '#followr button { text-align: center; border: 1px solid #888; margin: 5px 5px 5px 0px; } #followr input { width: 100%; } ' + 
                '#followr { z-index: 1; } #followr_hide { z-index: 0; background: #DDD; visibility: hidden; } ' + 
                '#followr_process, #followr_done { position: absolute; top: 40px; left: 0; text-align: center; font-size: 12px; color: #444; visibility: hidden; }' + 
                '#followr_process strong, #followr_done strong { font-size: 20px; font-weight: bold; }</style>', 
                f = '<div id="followr"><p><label for="follows">Follow Blogs (comma/space separated)</label><br /><input id="followr_follows" name="follows" type="text" /></p>' + 
                '<p><label for="unfollows">Unfollow Blogs (comma/space separated)</label><br /><input id="followr_unfollows" name="unfollows" type="text" /></p>' + 
                '<p><button id="followr_submit">Submit</button><button id="followr_clear">Clear</button></p></div>' + 
                '<div id="followr_hide"><p id="followr_process"><strong>PROCESSING...</strong><br />(please wait)</p>' +
                '<p id="followr_done"><strong>DONE!</strong><br />(please refresh this page)</p></div>';
            $("head").append(s);
            $("#right_column").append(f);
            $("#followr_submit").click(submitFollowr);
            $("#followr_clear").click(clearFollowr);
        });
    }
    
    function submitFollowr() {
        $("#followr_hide").css("z-index", "10");
        $("#followr_hide").css("visibility", "visible");
        $("#followr_process").css("visibility", "visible");
        var follows = $("#followr_follows").get(0).value.replace(/[\s,]+/g, ' ').trim().split(' '),
            unfollows = $("#followr_unfollows").get(0).value.replace(/[\s,]+/g, ' ').trim().split(' '),
            formkey = $("#form_key").get(0).value;
        if (follows.length > 0) {
            $(follows).each(function(i,v) {
                var fblog = $.trim(v);
                if (fblog.length > 0) {
                    fblog =  (fblog).replace(/–/g, "--");
                    procF_start++;
                    var aurl = "https://www.tumblr.com/following",
                        amethod = "POST",
                        adata = {};
                    adata.form_key = formkey;
                    adata.follow_this = fblog;
                    adata.submit = "";
                    $.ajax({url: aurl, type: amethod, data: adata}).complete(function(){ procF_done++; });
                }
            });
        }
        if (unfollows.length > 0) {
            $(unfollows).each(function(i,v) {
                var ublog = $.trim(v);
                if (ublog.length > 0) {
                    ublog = (ublog).replace(/–/g, "--");
                    procU_start++;
                    var aurl = "https://www.tumblr.com/svc/unfollow",
                        amethod = "POST",
                        adata = {};
                    adata.form_key = formkey;
                    adata.data = {};
                    adata.data.tumblelog = ublog,
                        adata.data.source = "UNFOLLOW_SOURCE_FOLLOWING_PAGE";
                    $.ajax({url: aurl, type: amethod, data: adata}).complete(function(){ procU_done++; });
                }
            });
        }
        checkFollowrDone();
    }
    
    function clearFollowr() {
        $("#followr_follows").get(0).value = "";
        $("#followr_unfollows").get(0).value = "";
    }
    
    function checkFollowrDone() {
        if(procF_start === procF_done && procU_start === procU_done){
            $("#followr_process").css("visibility", "hidden");
            $("#followr_done").css("visibility", "visible");
        } else {
            setTimeout(checkFollowrDone, 1000);
        }
    }
})();