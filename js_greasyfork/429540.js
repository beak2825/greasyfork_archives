// ==UserScript==
// @name         Actually Usable Desktop Pixiv
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  rudementary, slow and very network heavy. but fuck it i just threw this together and i can actually see the fucking images. tested @1080p & 1440p no clue if it works at other resolutions
// @author       InherentlyBadNoodles
// @match        *://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/429540/Actually%20Usable%20Desktop%20Pixiv.user.js
// @updateURL https://update.greasyfork.org/scripts/429540/Actually%20Usable%20Desktop%20Pixiv.meta.js
// ==/UserScript==

(function() {

    var ImageWidth = '25%';
    var IdleCycles = 0;

    console.log(ImageWidth);

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    };


    addGlobalStyle('\
      .khkYDJ, .CMuIj, .layout-body, #wrapper { width: unset !important; }\
      .cVdDlN { width: calc(' + ImageWidth + ' - 24px) !important;}\
      .hvlsSe { width: 100% !important; }\
      .bscYTy, ._2TNr7bf, ._3IpHIQ_ {width: 100% !important; height: unset !important}\
      .JoCpVnw { width: calc(' + ImageWidth + ' - 24px) !important; }\
      .ModifiedImage { width: 100% !important; object-fit: scale-down !important; height: 500px}\
      .thumb { object-fit: scale-down !important;}\
      .JoCpVnw, ._2TNr7bf, ._3IpHIQ_, ._1hsIS11{ height: 500px !important; max-height: unset !important; }\
    ');

    function ModifyImgUrl(old){
      return old.replace('/c/', '/').replace('/250x250_80_a2/', '/').replace('/360x360_10_webp/', '/').replace('/240x240/','/').replace('/img-master/', '/img-original/').replace('/custom-thumb/', '/img-original/').replace('/img-master/', '/img-original/').replace('_square1200','').replace('_custom1200','').replace('_master1200','');
    };

    function ReplaceImg(){

        var ActiveCycle = false;
        var imgUrl;
        var newItem

        // This fetches all of the <img> tags and stores them in "tags".
        var tags = document.getElementsByTagName('img');

        // This loops over all of the <img> tags.
        for (var i = 0; i < tags.length; i++) {

            // This replaces the src attribute of the tag with the modified one
            if(!$(tags[i]).hasClass('ModifiedImage')){
                imgUrl = tags[i].src.trim();
                if(imgUrl){
                    ActiveCycle = true;
                    tags[i].src = ModifyImgUrl(imgUrl);
                    tags[i].classList.add('ModifiedImage');
                    $(tags[i]).on("error", function(){
                        this.src = this.src.replace('.jpg','.png');
                    });
                }
            }
        }



        tags = document.getElementsByClassName('_1hsIS11');

        function GetDivBgUrl(img){
            var style = img.currentStyle || window.getComputedStyle(img, false);
            return style.backgroundImage.slice(4, -1).replace(/"/g, "");
        }

        for (var j = 0; j < tags.length; j++) {

            // This replaces the src attribute of the tag with the modified one
            imgUrl = GetDivBgUrl(tags[j]).trim();
            imgUrl = imgUrl.trim();

            if(imgUrl){
                ActiveCycle = true;
                imgUrl = ModifyImgUrl(imgUrl);
                console.log('Replaced URL: ' + imgUrl);
                newItem = document.createElement('img');
                newItem.src = imgUrl;
                newItem.classList.add('ModifiedImage');

                $(newItem).on("error", function(){
                    this.src = this.src.replace('.jpg','.png');
                    $(this).off("error");
                });

                tags[j].parentNode.replaceChild(newItem, tags[j]);
            }
        }

        if (ActiveCycle){
            IdleCycles = 0
        } else {
            IdleCycles = IdleCycles + 1;
        }

        if (IdleCycles < 30){
            setTimeout(ReplaceImg, 200);
        } else {
            setTimeout(ReplaceImg, 1000);
        }
    }

    setTimeout(ReplaceImg, 1000);

})();