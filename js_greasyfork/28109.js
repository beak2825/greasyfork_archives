// ==UserScript==
// @name         WK Overlay
// @namespace    wkoverlay
// @version      0.3.4
// @description  Overlays component information on reviews when show info is pressed.
// @author       Ethan
// @match        https://www.wanikani.com/review/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28109/WK%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/28109/WK%20Overlay.meta.js
// ==/UserScript==

// TODO if kanji or radical follows vocab, overlay is not removed
var addStyleTag = function(){
        /* Non-Javascript determined (to be put in style tag)*/ 
        var styleText =
        "@media (max-width: 767px) .wkOverlay {\r\n" +
            "font-size: 3.0625em;\r\n" +
            "font-weight: normal;\r\n" +
            "line-height: 2.4em;\r\n" +
        "}\r\n" +
        ".wkOverlay {\r\n" +
            "display: block;\r\n" +
            "position: absolute;\r\n" +
        "}\r\n" +
        ".infoSpan {\r\n" +
            "position: absolute;\r\n" +
            "background-color: black;\r\n" +
            "color: #fff;\r\n" +
            "text-align: center;\r\n" +
            "padding: 5px 10px;\r\n" +
            "border-radius: 6px;\r\n" +
            "display: inline-flex;\r\n" +
            "font-size: 10pt;\r\n" +
            "margin-right:0 2%;\r\n" +
        "}\r\n" +
        ".infoRadSpan {\r\n" +
            "position: absolute;\r\n" +
            "background-color: black;\r\n" +
            "color: #fff;\r\n" +
            "text-align: center;\r\n" +
            "padding: 5px 10px;\r\n" +
            "border-radius: 6px;\r\n" +
            "display: inline-flex;\r\n" +
            "font-size: 10pt;\r\n" +
        "}\r\n" +
        ".infoTop::after{\r\n" +
            "content: '';\r\n" +
            "position: absolute;\r\n" +
            "top: 100%;\r\n" +
            "left:20px;\r\n" +
            "margin-left: -10px;\r\n" +
            "border-width: 10px;\r\n" +
            "border-style: solid;\r\n" +
            "border-color: black transparent transparent transparent\r\n" +
        "}\r\n" +
        ".infoTop{\r\n" +
            "bottom: 100%;\r\n" +
        "}\r\n" +
        ".infoBottom{\r\n" +
            "top: 100%;\r\n" +
        "}\r\n" +
        ".infoBottom::after{\r\n" +
            "content: '';\r\n" +
            "position: absolute;\r\n" +
            "bottom: 100%;\r\n" +
            "left:20px;\r\n" +
            "margin-left: -10px;\r\n" +
            "border-width: 10px;\r\n" +
            "border-style: solid;\r\n" +
            "border-color: transparent transparent black transparent\r\n" +
        "} \r\n"+
        "span.wkOverlayRadBox\r\n{" +
            "background-color: #0af;" +
            "display: inline-block;" +
            "margin-right: 0.3em;" +
            "width: 1.8em;" +
            "height: 1.8em;" +
            "color: #fff;" +
            "line-height: 1.7em;" +
            "text-align: center;" +
            "text-shadow: 0 1px 0 rgba(0,0,0,0.3);" +
            "-webkit-box-sizing: border-box;" +
            "-moz-box-sizing: border-box;" +
            "box-sizing: border-box;" +
            "-webkit-border-radius: 3px;" +
            "-moz-border-radius: 3px;" +
            "border-radius: 3px;" +
            "-webkit-box-shadow: 0 -3px 0 rgba(0,0,0,0.2) inset, 0 0 10px rgba(255,255,255,0.5);" +
            "-moz-box-shadow: 0 -3px 0 rgba(0,0,0,0.2) inset,0 0 10px rgba(255,255,255,0.5);" +
            "box-shadow: 0 -3px 0 rgba(0,0,0,0.2) inset, 0 0 10px rgba(255,255,255,0.5);" +
        "}\r\n" +
        "";
        var styleElem = document.createElement('style');
        styleElem.appendChild(document.createTextNode(styleText));
        document.head.appendChild(styleElem);
};

(function() {
    'use strict';

    // Salt this event so future scripts don't throw multiple events and confuse the script.
    // This should ensure these events are unique to this script and minimise the chances of catching events in error.
    // TODO: handle possibility of multiple events being thrown by other scripts based on context (eg. multiple 'show' events without a 'hide' => 1 'show') for greater integration between scripts.
    var hideEvent = "hide"+Math.trunc(Math.random()*1000000);
    var showEvent = "show"+Math.trunc(Math.random()*1000000);
//---------------------------
    var oldHide = $.fn.hide;
    $.fn.hide = function(){this.trigger(new jQuery.Event(hideEvent)); return oldHide.apply(this, arguments);};
    var oldShow = $.fn.show;
    $.fn.show = function(){this.trigger(new jQuery.Event(showEvent)); return oldShow.apply(this, arguments);};
//--------------------------

    addStyleTag();

    var parentElement = $("#question");
    var overlay = document.createElement('div');
    overlay.style.display = 'none';
    overlay.className = "wkOverlay";
    overlay.setAttribute('lang', "ja");

    var respComps = {};
    var masterRads = {};
    var prompt = {};
    parentElement[0].appendChild(overlay);
    var newItem = false;

    // just for comparing prompts
    var shallowCompare = function(obj1, obj2){
        return ((obj1.voc && obj2.voc) || (obj1.kan && obj2.kan) || (obj1.rad && obj2.rad)) && ((obj1.voc === obj2.voc) || (obj1.kan === obj2.kan) || (obj1.rad === obj2.rad));
    };
    $.jStorage.listenKeyChange('currentItem', function(){
        while (overlay.firstChild){
            overlay.removeChild(overlay.firstChild);
        }
        // Runs after span is changed, but is this guaranteed?
        var oldPrompt = prompt;
        prompt = $.jStorage.get('currentItem');
        newItem = !shallowCompare(prompt, oldPrompt);

        var itemString = prompt.voc||prompt.kan; // The kanji, vocab (or soon, radical)
        if (itemString){
            for (var ch in itemString){ // Kanji and radical, this will only be one (radical images may need some other handling)
                var chSpan = document.createElement('span');

                chSpan.innerText = itemString[ch];

                chSpan.style.fontSize = document.defaultView.getComputedStyle($("#character")[0], "").fontSize;
            }
        }
    });

    var showRadicalTags = function(){
        console.warn("showtags");
        overlay.style.display = 'block';
        //Since we are currently adding the tips every time we catch a show event, we must delete them all first, or multiple hide/show events will build up more tips for every 'show'
        // Clear array of nodelists
        while (overlay.firstChild){
            overlay.removeChild(overlay.firstChild);
        }
        // Get the related kanji component info for vocab from the 'show answer' page
        // Create an object (respComps) indexed by Kanji characters. eg {"出":" Exit","提":" Present, Submit"}
        $("#related-items .kanji a").each(function(i, comp){

            //Needs love to be more robust when Wanikani makes cosmetic changes to their page
            respComps[comp.childNodes[1].textContent] = comp.childNodes[2].textContent;
        });

        if (prompt.voc){
            // Create flip flop variable so tips with multiple words don't clutter the top or bottom
            var flipTopBottom = false; //true: top, false: bottom
            // Values will be the same for all char, but need to be calculated
            // Position absolute needs negative margins to react to number of characters
            var marginLeftPercentage = (-100/prompt.voc.length) + "%";
            var marginRightPercentage = "2%";
            for (var ch in prompt.voc){
                flipTopBottom = !flipTopBottom;
                var chSpan = document.createElement('span');
                chSpan.className = "wkOverlayChar";

                var comp = document.createElement('span');
                comp.innerText = prompt.voc[ch];
                comp.style.opacity = 0;
                chSpan.appendChild(comp);

                console.info(respComps, prompt.voc[ch], respComps[prompt.voc[ch]]);
                chSpan.style.fontSize = document.defaultView.getComputedStyle($("#character")[0], "").fontSize; // and lineHeight

                // Javascript determined style values.
                overlay.style.height = $("#character span").height() + 'px';
                overlay.style.top = $("#character span").position().top + 'px';
                overlay.style.left = $("#character span").position().left + 'px';
                overlay.style.height = $("#character span").height() + 'px';

                overlay.appendChild(chSpan);
//debugger;
                if (respComps[prompt.voc[ch]]){ // any characters not present in the components section will fail here. There should be no Kanji in the prompt that is not here, so no Kanji should fail.
                    var spInf = document.createElement('span');
                    spInf.innerText = respComps[prompt.voc[ch]];

                    chSpan.appendChild(spInf);
                    spInf.style.marginLeft = marginLeftPercentage;
                    //                    spInf.style.marginRight = marginRightPercentage;
                    if(flipTopBottom){
                        spInf.className = "infoSpan infoTop";
                    }
                    else{
                        spInf.className = "infoSpan infoBottom";
                    }
                }
            }
        }
        if (prompt.kan){
            var respRads = {};
            var slug;
            $("#related-items .radical a").each(function(i, comp){
                //debugger;

                // Needs improvement for when Wanikani changes its page structure
                if (comp.childNodes[1].textContent){
                    slug = comp.childNodes[1].textContent;
                    respRads[slug] = {name: comp.childNodes[2].textContent, kanji: {}};
                }
                else{
                    slug = comp.childNodes[1].firstChild.className;// i class
                    respRads[slug] = {box: comp.childNodes[1].firstChild, name: comp.childNodes[2].textContent, kanji: {}};
                }

                //get position from browser storage if there
                if ($.jStorage.get("overlayMasterRads")){
                    masterRads =  $.jStorage.get("overlayMasterRads");
                }

                if (!masterRads[slug]){
                    masterRads[slug] = respRads[slug];
                }

                if (masterRads[slug].kanji[prompt.kan]){
                    respRads[slug].kanji[prompt.kan] = masterRads[slug].kanji[prompt.kan];
                }
                else{
                    respRads[slug].kanji[prompt.kan] = {x: 0, y: 0};
                }
            });
            console.log("masterRads:", masterRads);
            var kan = document.createElement('span');
            kan.className = "wkOverlayChar";

            kan.innerText = prompt.kan;
            kan.style.opacity = 0.5; //debug kanji
            //kan.appendChild(comp);

            console.info("component object, kanji, compObj[kanji]", respComps, prompt.kan, respComps[prompt.kan]);// will probably only work on kanji that has itself as a radical (eg. 一)
            kan.style.fontSize = document.defaultView.getComputedStyle($("#character")[0], "").fontSize; // and lineHeight

            var overlayLeftOffset = $("#character span").position().left;
            var overlayTopOffset = $("#character span").position().top;
            // Javascript determined style values.
            overlay.style.height = $("#character span").height() + 'px';
            overlay.style.top = $("#character span").position().top + 'px';
            overlay.style.left = overlayLeftOffset + 'px';
            //overlay.style.right = (overlayLeftOffset+$(overlay).width()) + 'px';
            //overlay.style.right = (-overlayRightOffset) + 'px';
            //alert(overlay.style.right);
            overlay.style.height = $("#character span").height() + 'px';

            //overlay.appendChild(kan);

            //respComps is radicals and their names as key->value pairs
            // we need to give the radicals some more info (position, svg path around relevant part of kanji) than the kanji has
            // add this info for each radical: object as scraped: {"疒":" Sick","正":" Correct"} => fn => {"疒":{name:" Sick", "症":{x:num, y:num, svg: svgElem },"正":{name:" Correct", "症":{x:num, y:num, svg: svgElem }}
            // the kanji info bit: "症":{x:num, y:num, svg: svgElem }, needs to be creatable, editable, and retrievable.

            var dragMouseDownHandler = function(evt){
                console.info("mousedown event was heard", evt);
                evt.preventDefault();
                console.log('this == ', this);
                this._mouseDownOrigin = {x: evt.clientX, y: evt.clientY};
                //var elStyle = document.defaultView.getComputedStyle(evt.target, "");
                var elStyle = document.defaultView.getComputedStyle(this, "");
                var l = elStyle.left; var t = elStyle.top;
                //var l = evt.target.style.left; var t = evt.target.style.top;
                this._originalPosition = {x: parseFloat(l.substr(0, l.length-1)), y: parseFloat(t.substr(0, t.length-1))};
                this._mouseMoveHandler = dragMouseMoveHandler.bind(this);
                this._mouseUpHandler = dragMouseUpHandler.bind(this);
                document.addEventListener('mousemove', this._mouseMoveHandler);
                //document.addEventListener('mousemove', dragMouseMoveHandler);
                document.addEventListener('mouseup', this._mouseUpHandler);
                document.addEventListener('mouseout', this._mouseUpHandler);
                //                this.addEventListener('mouseup', dragMouseUpHandler);
                //                this.addEventListener('mouseout', dragMouseUpHandler);
            };
            var dragMouseMoveHandler = function(evt){
                //nsole.log("mousemove", evt, this);
                if (this._mouseDownOrigin){

                    var dx = evt.clientX - this._mouseDownOrigin.x;
                    //console.log("dx", dx);
                    var dy = evt.clientY - this._mouseDownOrigin.y;
                    var l = this.style.left||"0px"; var t = this.style.top||"0px";
                    if (l[l.length-1] === "%" || t[t.length-1] === "%"){
                            console.log("positioned with % ??");
                    }
                    else{
                        var newLeft = Math.max(-overlayLeftOffset, this._originalPosition.x + dx) + "px";
                        console.log("-overlayLeftOffset", -overlayLeftOffset, "this._originalPosition.x", this._originalPosition, "dx", dx);
                        
                        var newTop = Math.max(-overlayTopOffset, this._originalPosition.y + dy) + "px";
                        //want the highest negative number to keep it in the document
                        console.log("moving div:" + newLeft + " " + newTop);
                        this.style.left = newLeft;
                        this.style.right = -'100px';
                        this.style.top = newTop;
                    }
                }
            };
            var dragMouseUpHandler = function(evt){
                if (evt.type === 'mouseup' || evt.type === 'mouseout' && (evt.toElement === null)){ // mouseout leaves entire document
                    // Check if this radical has a payload for the kanji, give it one if not.
                    masterRads[this.slug].kanji[prompt.kan] = {x: this.style.left, y:this.style.top};
                    //console.log("find x and y?", evt);
                    $.jStorage.set("overlayMasterRads", masterRads);

                    console.log("removing listeners", evt.type);
                    document.removeEventListener('mousemove', this._mouseMoveHandler);
                    document.removeEventListener('mouseup', this._mouseUpHandler);
                    document.removeEventListener('mouseout', this._mouseUpHandler);
                }
            };

            // Order is not important for radicals since they are just like, all over the kanji, so we will just iterate.
            for (var rad in respRads){
                var spRadName = document.createElement('span');
                var radBox = document.createElement('span');
                radBox.setAttribute("lang", "ja");
                radBox.className = "wkOverlayRadBox";
                if (!respRads[rad].box){
                    radBox.appendChild(document.createTextNode(rad));
                }
                else{
                    radBox.appendChild(respRads[rad].box.cloneNode());
                }
                spRadName.slug = rad;
                spRadName.appendChild(radBox);
                spRadName.appendChild(document.createTextNode(respRads[rad].name));

                overlay.appendChild(spRadName);
                spRadName.style.marginLeft = (-100)*Math.random() + "%"; //more likely to see them if they are changed up a bit while we code
                spRadName.style.left = respRads[rad].kanji[prompt.kan].x;
                spRadName.style.top = respRads[rad].kanji[prompt.kan].y;
                spRadName.style.cursor = "move";
                spRadName.className = "infoRadSpan";

                //-- todo keep track of these in objects, enable/disable handlers in an edit/setup mode
                //masterRads.currentSlug = slug;
                spRadName.addEventListener('mousedown', dragMouseDownHandler);
            }
        }
    };

    var observer = new MutationObserver(showRadicalTags);
    //observer = new MutationObserver(function(mutation){console.log(mutation);});

    var testObserve = new MutationObserver(function(mutations){
                console.info("%cObserver", "background-color:grey");
                console.info(typeof mutations);
                console.groupCollapsed("Mutation List");
                mutations.forEach(function(mutation){console.info(mutation.type);});
                console.groupEnd();
    });

    // Show overlay when info is being shown.
    $("#item-info").on(showEvent, function(evt){
        console.info("showevt", evt);
        if (newItem){
            newItem = false;
            //watch related items for change
            observer.observe($("#item-info")[0], {childList: true, subtree:true});
        }
        else{
            showRadicalTags();
        }
    });

    $("#item-info").on(hideEvent, function(evt){
        if (evt.target.id === "additional-content-load"){
            console.info("hide evt", evt);
            //debugger;
            overlay.style.display = 'none';
        }
    });
})();