// ==UserScript==
// @name        RYM - Charts - Highlight rated albums
// @description Highlights albums on RYM
// @author      https://github.com/labyrinthofdreams
// @namespace   rateyourmusic
// @include     http*://rateyourmusic.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/0.71/jquery.csv-0.71.min.js
// @version     1.3
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/11614/RYM%20-%20Charts%20-%20Highlight%20rated%20albums.user.js
// @updateURL https://update.greasyfork.org/scripts/11614/RYM%20-%20Charts%20-%20Highlight%20rated%20albums.meta.js
// ==/UserScript==

// 1.3 - Fix for new layout

GM_addStyle(".custom_album_rated { background-color: lightgreen !important; } " + 
            ".custom_album_wl { background-color: yellow !important; } " + 
            ".custom_album_owned { background-color: orange !important; }");

function reset_rym_id() {
    var uid = GM_getValue("rym_uid");
    uid = window.prompt("Reset RYM User ID (" + uid + ")");
    GM_setValue("rym_uid", uid);
    Ratings.download_ratings();
    Highlighter.highlight();
}

var Config = {
    export_url: function(uid) {
        return "https://rateyourmusic.com/user_albums_export?album_list_id=[uid]&noreview".replace("[uid]", uid);
    }
};

var Ratings = {
    ratings: [],    
    wishlist: [],
    owned: [], // ...but not rated
    download_ratings: function() {        
        var uid = GM_getValue("rym_uid");
        console.log("Downloading ratings: " + Config.export_url(uid));
        jQuery.get(Config.export_url(uid), function(data) {
            console.log("Downloaded ratings");
            var result = data.split("\n");
            
            Ratings.ratings = [];
            Ratings.wishlist = [];
            Ratings.owned = [];
            for(var i = 1; i < result.length; ++i) {
                var cur = result[i];
                var review_removed = cur.substr(0, cur.length-5);
                var csv = $.csv.toArray(review_removed);
                
                var rated = csv[7] !== "0";
                if(rated) {
                    Ratings.ratings.push(csv[0]);
                }
                else {
                    // owned or wishlisted
                    var wishlisted = csv[8] === "w";
                    if(!wishlisted) {
                        Ratings.owned.push(csv[0]);
                    }
                    else {
                        Ratings.wishlist.push(csv[0]);
                    }    
                }
                
                /*var not_wishlist = csv[8] !== "w";
                if(not_wishlist) {
                    var rated = csv[7] !== "0";
                    console.log(csv[7] + " " + rated + " " + csv[5]);
                    if(rated) {
                        Ratings.ratings.push(csv[0]);
                    }
                    else {
                        // owned, but not rated
                        Ratings.owned.push(csv[0]);
                    }
                }
                else {
                    Ratings.wishlist.push(csv[0]);
                }*/
                
                
            }
            Ratings.save();
            Highlighter.highlight();
        });
    },
    load: function() {
        var uid = GM_getValue("rym_uid");
        if(uid === undefined) {
            alert("Missing RYM ID!");
        }
        
        var tmp_ratings = GM_getValue("rym_ratings");
        var tmp_wl = GM_getValue("rym_wishlist");
        var tmp_owned = GM_getValue("rym_owned");
        if(tmp_ratings !== undefined) {
            Ratings.ratings = eval(tmp_ratings);
        }
        if(tmp_wl !== undefined) {
            Ratings.wishlist = eval(tmp_wl);
        }
        if(tmp_owned !== undefined) {
            Ratings.owned = eval(tmp_owned);
        }
    },
    save: function() {
        GM_setValue("rym_ratings", uneval(Ratings.ratings));
        GM_setValue("rym_wishlist", uneval(Ratings.wishlist));
        GM_setValue("rym_owned", uneval(Ratings.owned));
    },
    contains: function(album_id, type="r") {
        var types = {r: Ratings.ratings, w: Ratings.wishlist, o: Ratings.owned};
        if(types.hasOwnProperty(type)) {
            var arr = types[type];
            for(var i = 0; i < arr.length; ++i) {
                if(arr[i] == album_id) {
                    return true;
                }
            }
        }    
        return false;
    }
};

var Highlighter = {
    highlight: function() {
        console.log("Highlighting");
        $albums = jQuery("a.album,a.list_album,a.release");
        $albums.each(function(index) {
            $t = jQuery(this);
            $t.removeClass("custom_album_rated").removeClass("custom_album_wl").removeClass("custom_album_owned");
            var album_id = $t.attr("title").match(/\[Album([0-9]+)\]/i)[1]; 
            if(Ratings.contains(album_id, "r")) {
                $t.addClass("custom_album_rated");
            }
            else if(Ratings.contains(album_id, "w")) {
                $t.addClass("custom_album_wl");
            }
            else if(Ratings.contains(album_id, "o")) {
                $t.addClass("custom_album_owned");
            }
        });
    }
};

var App = {
    run: function() {
        Ratings.load();
        Highlighter.highlight();
    }
};        

GM_registerMenuCommand("Reload RYM Ratings", Ratings.download_ratings);
GM_registerMenuCommand("Reset RYM User ID", reset_rym_id);                

jQuery(document).ready(App.run);