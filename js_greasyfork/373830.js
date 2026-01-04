// ==UserScript==
// @name         Steam Wishlist Sorter
// @namespace    SWS
// @version      1.0.1
// @description  Lets you sort your Steam wishlist by comparing two games at a time.
// @author       Anxeal
// @license      MIT
// @match        https://store.steampowered.com/wishlist/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/373830/Steam%20Wishlist%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/373830/Steam%20Wishlist%20Sorter.meta.js
// ==/UserScript==

GM_addStyle(`
.sws-overlay {
     display:flex;
     flex-direction:column;
     justify-content:center;
     align-items:center;
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: rgba(0,0,0,.7);
     z-index:9999;
}
 .sws-close-button {
     position:fixed;
     top:20px;
     right:40px;
     font-size:80px;
     cursor:pointer;
     text-align:center;
}
 .sws-choice-button {
     box-shadow: 0px 0px 0px 5px #ccc;
     margin: 0.5em;
     width: 292px;
     height: 136px;
     cursor: pointer;
     transition: transform .3s ease, box-shadow .3s ease;
}
 .sws-choice-button:hover {
     transform: scale(1.2);
     box-shadow: 0px 0px 0px 5px #09c;
}
 .sws-choice-button:active {
     transform: none;
}
 .sws-app-title-text {
     font-size: 20px;
     line-height: 60px;
}
 .sws-sort-button {
     display:flex;
     justify-content:center;
     align-items:center;
     margin-left:15px;
}
 .sws-progress-outer {
     border:5px solid #069;
     border-radius: 20px;
     background:#999;
     width:800px;
     height:20px;
     margin:30px;
     box-shadow: inset 0 0 5px #000;
}
 .sws-progress-inner {
     border-radius: 10px;
     background-image: linear-gradient( -45deg, #09c 25%, #0cf 25%, #0cf 50%, #09c 50%, #09c 75%, #0cf 75%, #0cf );
     background-size: 20px 20px;
     animation:sws-progress 1s linear 0s infinite;
     height:100%;
     width:0;
     transition: width .5s ease-out;
}
 @keyframes sws-progress {
     to {
        background-position: 0 20px;
    }
}
`);

(function($, window) {
    'use strict';

    // Class that does merge sort with manual comparisons from an older project
    class ManualSorter {
        constructor(array, $leftButton, $rightButton, callback) {
            var self = this;
            $leftButton.click(function() {
                if ($(this).is("[disabled]")) return;
                self.compare(-1);
                self.sendNext();
            });
            $rightButton.click(function() {
                if ($(this).is('[disabled]')) return;
                self.compare(1);
                self.sendNext();
            });

            this.arr = this.shuffleArray(array.slice());
            this.step = 1;
            this.index = 0;
            this.done = false;

            this.compCount = 0;
            // approx max comp count
            this.maxCompCount = this.arr.length * Math.ceil(Math.log2(this.arr.length));

            this.cleanVars();
            this.callback = callback;
            this.sendNext();
        }

        sendNext(){
            this.callback(this.getNext());
        }

        cleanVars() {
            this.headLeft = 0;
            this.headRight = 0;
            this.result = [];
        }

        compare(input) {
            if (this.done) return;
            var rightLimit = Math.min(this.step, this.arr.length-(this.index+1)*this.step);
            if (this.headLeft < this.step && this.headRight < rightLimit) {
                if (input < 0) {
                    this.pushLeft();
                }
                else {
                    this.pushRight();
                }
            }
            if (!(this.headLeft < this.step && this.headRight < rightLimit)) {
                while (this.headLeft < this.step) {
                    this.pushLeft();
                }
                while (this.headRight < rightLimit) {
                    this.pushRight();
                }
                for (var i = 0; i < this.result.length; i++) {
                    this.arr[this.index * this.step + i] = this.result[i];
                }
                this.index += 2;
                if ((this.index + 1) * this.step + this.headRight >= this.arr.length) {
                    this.step *= 2;
                    this.index = 0;
                }
                if (this.step >= this.arr.length) {
                    // We are done sorting
                    this.done = true;
                }
                this.cleanVars();
            }
        }

        pushLeft() {
            this.result.push(this.arr[this.index * this.step + this.headLeft]);
            this.headLeft++;
            this.compCount++;
        }

        pushRight() {
            this.result.push(this.arr[(this.index + 1) * this.step + this.headRight]);
            this.headRight++;
            this.compCount++;
        }

        getNext() {
            if (!this.done) {
                return { left: this.arr[this.index * this.step + this.headLeft], right: this.arr[(this.index + 1) * this.step + this.headRight], done: false};
            } else {
                console.log("[SWS] Done sorting!");
                return { result: this.arr, done: true};
            }
        }

        shuffleArray(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }

        serialize() {
            return JSON.stringify(this);
        }

        deserialize(json) {
            var obj = JSON.parse(json);
            console.log(obj);
            for(var val in obj) {
                this[val] = obj[val];
            }
        }

        get progress(){
            return this.compCount/this.maxCompCount*100;
        }
    };

    var waitForWishlist = $.Deferred();

    waitForWishlist.then(function(wl){

        // g_bCanEdit => if wishlist is editable

        // if it isn't our wishlist, don't bother running
        if(!window.g_bCanEdit){
            console.log("[SWS] Can't edit wishlist: Stopping.");
            return;
        }

        var $overlay = $("<div class='sws-overlay'></div>");
        var $closeButton = $("<a class='sws-close-button'>×</a>");
        var $appTitleText = $("<div class='sws-app-title-text '></div>");
        var $leftButton = $("<div class='sws-choice-button'></div>");
        var $rightButton = $leftButton.clone();
        var $progress = $("<div class='sws-progress-outer'><div class='sws-progress-inner'></div></div>");


        $(document.body).append($overlay);
        $overlay.append($closeButton).append($leftButton).append($appTitleText).append($rightButton).append($progress);
        $overlay.hide();

        $('.sws-choice-button').hover(function(){
            $appTitleText.text($(this).attr("data-app-title")).stop().animate({ opacity: 1 }, 200);
        }, function(){
            $appTitleText.stop().animate({ opacity: 0 }, 200);
        }).on("mousedown", function(e){
            if(e.which == 2) { // middleclick
                window.open('https://store.steampowered.com/app/'+$(this).attr("data-app-id")+'/', '_blank');
            }
        });

        // close button behavior
        $closeButton.click(function(){
            $overlay.fadeOut();
        });

        // main buttons

        var $sortButton = $("<div class='sws-sort-button'><div class='btnv6_blue_hoverfade btn_medium'><span>Sort!</span></div></div>");
        var $saveButton = $sortButton.clone();
        var $discardButton = $sortButton.clone();
        var $saveProgressButton = $sortButton.clone();
        var $loadProgressButton = $sortButton.clone();

        $sortButton.appendTo(".wishlist_header").children().click(function(){
            $overlay.fadeIn();
            $discardButton.fadeIn();
            $saveProgressButton.fadeIn();
        });
        $sortButton.hide().fadeIn();

        $saveButton.hide().children().children().text("Save");
        $saveButton.appendTo(".wishlist_header").children().click(function(){
            wl.SaveOrder();
            location.reload();
        });

        $discardButton.hide().children().children().text("Discard");
        $discardButton.appendTo(".wishlist_header").children().click(function(){
            location.reload();
        });

        $saveProgressButton.hide().children().children().text("Save Progress");
        $saveProgressButton.appendTo(".wishlist_header").children().click(function(){
            var data = sorter.serialize();
            GM_setValue("sws-sorter-data", data);
            alert("Progress Saved!");
        });

        $loadProgressButton.hide().children().children().text("Load Progress");
        $loadProgressButton.appendTo(".wishlist_header").children().click(function(){
            var data = GM_getValue("sws-sorter-data");
            sorter.deserialize(data);
            sorter.sendNext();
            $sortButton.children().click();
        });
        if(GM_getValue("sws-sorter-data")) $loadProgressButton.fadeIn();

        var fadeDuration = 100;
        var setChoiceData = function($button, side){
            var bgUrl = "url('"+window.g_rgAppInfo[side].capsule+"')";
            if($button.attr("data-app-id") == side){
                $button.attr("disabled", "disabled")
                    .delay(2*fadeDuration)
                    .removeAttr("disabled");
                return;
            }
            $button.attr("disabled", "disabled").fadeOut(fadeDuration, function(){
                $button.css("background-image", bgUrl);
                $button.attr("data-app-id", side);
                $button.attr("data-app-title", window.g_rgAppInfo[side].name);
                $button.trigger("mouseenter");
            }).fadeIn(fadeDuration, function(){
                $button.removeAttr("disabled");
            });
        }


        var sorter = new ManualSorter(wl.rgAllApps, $leftButton, $rightButton, function(next){
            if (next.done) {
                wl.rgAllApps = next.result;
                wl.Update();
                $overlay.fadeOut();
                $saveButton.fadeIn();
                alert("Done sorting! Please review your wishlist and save or discard.");
            } else {
                setChoiceData($leftButton, next.left);
                setChoiceData($rightButton, next.right);
                if(sorter) $progress.children().width((sorter.progress)+"%");
            }
        });
    });

    var checkWishlist = function(){
        if(!window.g_Wishlist || !window.g_Wishlist.rgAllApps){
            console.log("[SWS] Waiting for wishlist...");
            setTimeout(checkWishlist, 500);
            return;
        }
        console.log("[SWS] Wishlist loaded.");
        waitForWishlist.resolve(window.g_Wishlist);
    };

    checkWishlist();

})(unsafeWindow.jQuery, unsafeWindow);
