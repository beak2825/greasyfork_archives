// ==UserScript==
// @name         Agar.io CSStyler/ExtremeDarkTheme™+No Ads-Works after update - ☑
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds CSStyle/ExtremeDarkTheme™ To Agario and Removes Ads
// @author       Tom Burris + Jack Burch
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20331/Agario%20CSStylerExtremeDarkTheme%E2%84%A2%2BNo%20Ads-Works%20after%20update%20-%20%E2%98%91.user.js
// @updateURL https://update.greasyfork.org/scripts/20331/Agario%20CSStylerExtremeDarkTheme%E2%84%A2%2BNo%20Ads-Works%20after%20update%20-%20%E2%98%91.meta.js
// ==/UserScript==

document.getElementsByClassName("agario-wallet-plus")[0].innerHTML = "<span style='color:black;'>+</span>";
document.getElementById("nick").styler = true;
setTimeout(function() {
 'use strict';
 var music = document.getElementById("nick").music;
 console.log("music is: "+music);

 var panels = $(".agario-panel");

 for (var n = 0;n<panels.length;n++) {
  panels[n].style.backgroundColor = "black";
  panels[n].style.color = "white";
  panels[n].style.outline = "1px solid white";
  panels[n].style.borderRadius = "0px";
 }

 remove();

 $("#settings").show();
 $("#instructions").show();

 document.getElementsByClassName("btn btn-info btn-settings")[0].addEventListener('click', function() {$("#instructions").show();});

 var inputs = document.getElementsByTagName("input");

 for (var n = 0; n < inputs.length; n++) {
  if (inputs[n].type == "text" || (inputs[n].type != "radio" && inputs[n].type != "checkbox")) {
   inputs[n].style.backgroundColor = "black";
   inputs[n].style.color = "white";
   if (inputs[n].id===null || inputs[n].id === "") {
    inputs[n].id = "uniqueID"+n;
   }
   document.styleSheets[document.styleSheets.length-1].addRule('#'+inputs[n].id+'::selection','background: green');
  }
 }

 //document.styleSheets[document.styleSheets.length-1].insertRule('#nick::focus {outline:0px none transparent;}', 0);
 document.getElementById("nick").style.backgroundColor = "black";
 document.getElementById("nick").style.borderColor = "black";
 document.getElementById("nick").style.color = "white";
 document.getElementById("nick").style.borderRadius = "0px";
 document.getElementById("gamemode").style.backgroundColor = "black";
 document.getElementById("gamemode").style.borderColor = "black";
 document.getElementById("gamemode").style.color = "white";
 document.getElementById("gamemode").style.borderRadius = "0px";
 //document.styleSheets[document.styleSheets.length-1].addRule('option::hover','background: green');
 document.getElementById("region").style.backgroundColor = "black";
 document.getElementById("region").style.borderColor = "black";
 document.getElementById("region").style.color = "white";
 document.getElementById("region").style.borderRadius = "0px";
 document.getElementById("quality").style.borderRadius = "0px";
 document.getElementById("quality").style.backgroundColor = "black";
 document.getElementById("quality").style.borderColor = "black";
 document.getElementById("quality").style.color = "white";
 document.getElementById("user-id-tag").style.color = "white";
 /*
 document.getElementsByClassName("agario-wallet-currency")[0].src = "http://i.imgur.com/vCRuop8.png";
 document.getElementsByClassName("progress-bar-star")[0].style.backgroundImage = "url('http://i.imgur.com/fnQkuiv.png')";
 document.getElementById("boostButton").childNodes[3].src = "http://i.imgur.com/W9plOlX.png";
 document.getElementById("massButton").childNodes[3].src = "http://i.imgur.com/b3S9Ni1.png";
 */
 document.getElementById("version-tag").style.color = "white";
 document.getElementsByClassName("text-muted")[1].style.color = "white";
 document.getElementsByClassName("text-muted")[3].style.color = "white";
 document.getElementsByClassName("text-muted")[4].style.color = "white";
 document.getElementsByClassName("text-muted")[5].style.color = "white";
 document.getElementsByClassName("text-muted")[6].style.color = "white";
 document.getElementsByClassName("text-muted")[7].style.color = "white";
 document.getElementsByClassName("text-muted")[8].style.color = "white";
 document.getElementsByClassName("text-muted")[9].style.color = "white";
 document.getElementsByClassName("text-muted")[1].parentNode.style.color = "white";
 document.getElementsByClassName("text-muted")[3].parentNode.style.color = "white";
 document.getElementsByClassName("text-muted")[4].parentNode.style.color = "white";
 document.getElementsByClassName("text-muted")[5].parentNode.style.color = "white";
 document.getElementsByClassName("text-muted")[6].parentNode.style.color = "white";
 document.getElementsByClassName("text-muted")[7].parentNode.style.color = "white";
 document.getElementsByClassName("text-muted")[8].parentNode.style.color = "white";
 document.getElementsByClassName("text-muted")[9].parentNode.style.color = "white";
 document.getElementsByClassName("text-muted")[3].parentNode.parentNode.style.backgroundColor = "black";
 document.getElementsByClassName("text-muted")[9].parentNode.parentNode.style.backgroundColor = "black";
 document.getElementsByClassName("progress-bar progress-bar-striped")[0].style.backgroundColor = "#FFFFFF";
 document.getElementsByClassName("progress-bar progress-bar-striped")[0].style.borderRadius = "0px";
 document.getElementsByClassName("agario-exp-bar progress")[0].style.backgroundColor = "black";
 document.getElementsByClassName("agario-exp-bar progress")[0].style.borderColor = "black";
 document.getElementsByClassName("agario-exp-bar progress")[0].style.borderRadius = "0px";
 document.getElementsByClassName("agario-wallet-container")[0].style.borderColor = "black";
 document.getElementsByClassName("agario-wallet-container")[0].style.borderRadius = "0px";
 document.getElementsByClassName("agario-wallet-plus")[0].style.color = "black";
 document.getElementsByClassName("agario-wallet-plus")[0].style.backgroundColor = "white";
 document.getElementsByClassName("agario-wallet-plus")[0].style.borderRadius = "0px";
 document.getElementsByClassName("agario-wallet-plus")[0].style.borderColor = "white";
 document.getElementsByClassName("agario-profile-picture")[0].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[0].style.borderColor = "black";
 document.getElementsByClassName("btn")[0].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[0].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[0].style.color = "black";
 document.getElementsByClassName("btn")[1].style.borderColor = "black";
 document.getElementsByClassName("btn")[1].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[1].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[1].style.color = "black";
 document.getElementsByClassName("btn")[2].style.borderColor = "black";
 document.getElementsByClassName("btn")[2].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[2].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[2].style.color = "black";
 document.getElementsByClassName("btn")[3].style.borderColor = "black";
 document.getElementsByClassName("btn")[3].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[3].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[3].style.color = "black";
 document.getElementsByClassName("btn")[4].style.borderColor = "black";
 document.getElementsByClassName("btn")[4].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[4].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[4].style.color = "black";
 document.getElementsByClassName("btn")[5].style.borderColor = "black";
 document.getElementsByClassName("btn")[5].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[5].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[5].style.color = "black";
 document.getElementsByClassName("btn")[6].style.borderColor = "black";
 document.getElementsByClassName("btn")[6].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[6].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[6].style.color = "black";
 document.getElementsByClassName("btn")[7].style.borderColor = "black";
 document.getElementsByClassName("btn")[7].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[7].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[7].style.color = "black";
 document.getElementsByClassName("btn")[8].style.borderColor = "black";
 document.getElementsByClassName("btn")[8].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[8].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[8].style.color = "black";
 document.getElementsByClassName("btn")[9].style.borderColor = "black";
 document.getElementsByClassName("btn")[9].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[9].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[9].style.color = "black";
 document.getElementsByClassName("btn")[10].style.borderColor = "black";
 document.getElementsByClassName("btn")[10].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[10].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[10].style.color = "black";
 document.getElementsByClassName("btn")[11].style.borderColor = "black";
 document.getElementsByClassName("btn")[11].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[11].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[11].style.color = "black";
 document.getElementsByClassName("btn")[12].style.borderColor = "black";
 document.getElementsByClassName("btn")[12].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[12].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[12].style.color = "black";
 document.getElementsByClassName("btn")[13].style.borderColor = "black";
 document.getElementsByClassName("btn")[13].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[13].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[13].style.color = "black";
 document.getElementsByClassName("btn")[14].style.borderColor = "black";
 document.getElementsByClassName("btn")[14].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[14].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[14].style.color = "black";
 document.getElementsByClassName("btn")[15].style.borderColor = "black";
 document.getElementsByClassName("btn")[15].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[15].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[15].style.color = "black";
 document.getElementsByClassName("btn")[16].style.borderColor = "black";
 document.getElementsByClassName("btn")[16].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[16].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[16].style.color = "black";
 document.getElementsByClassName("btn")[17].style.borderColor = "black";
 document.getElementsByClassName("btn")[17].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[17].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[17].style.color = "black";
 document.getElementsByClassName("btn")[18].style.borderColor = "black";
 document.getElementsByClassName("btn")[18].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[18].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[18].style.color = "black";
 document.getElementsByClassName("btn")[19].style.borderColor = "black";
 document.getElementsByClassName("btn")[19].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[19].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[19].style.color = "black";
 document.getElementsByClassName("btn")[20].style.borderColor = "black";
 document.getElementsByClassName("btn")[20].style.borderRadius = "0px";
 document.getElementsByClassName("btn")[20].style.backgroundColor = "white";
 document.getElementsByClassName("btn")[20].style.color = "black";
 document.getElementsByClassName("green")[0].style.backgroundColor = "white";
 document.getElementsByClassName("green")[0].style.borderColor = "black";
 document.getElementsByClassName("green")[0].childNodes[0].style.textShadow = "0px 0px 0px black";
 document.getElementsByClassName("green")[0].childNodes[0].style.color = "black";
 document.getElementsByClassName("green")[1].style.backgroundColor = "white";
 document.getElementsByClassName("green")[1].style.borderColor = "black";
 document.getElementsByClassName("green")[1].childNodes[0].style.textShadow = "0px 0px 0px black";
 document.getElementsByClassName("green")[1].childNodes[0].style.color = "black";
 document.getElementsByClassName("green")[2].style.backgroundColor = "white";
 document.getElementsByClassName("green")[2].style.borderColor = "black";
 document.getElementsByClassName("green")[2].childNodes[0].style.textShadow = "0px 0px 0px black";
 document.getElementsByClassName("green")[2].childNodes[0].style.color = "black";
 document.getElementById("freeCoins").style.backgroundColor = "white";
 document.getElementById("freeCoins").style.borderRadius = "0px";
 document.getElementById("freeCoins").style.borderColor = "black";
 document.getElementById("freeCoins").style.color = "black";
 document.getElementById("openShopBtn").style.backgroundColor = "white";
 document.getElementById("openShopBtn").style.borderRadius = "0px";
 document.getElementById("openShopBtn").style.borderColor = "black";
 document.getElementById("openShopBtn").style.color = "black";
 
 /*
 var step;
 for(step = 0; step < document.getElementsByClassName("btn").length; step++) {
     document.getElementsByClassName("btn")[step].style.borderColor = "white";
     document.getElementsByClassName("btn")[step].style.borderRadius = "0px";
     document.getElementsByClassName("btn")[step].style.backgroundColor = "white";
     document.getElementsByClassName("btn")[step].style.color = "black";
 }
 
 var step2;
 for(step2 = 0; step2 < document.getElementsByClassName("circle green").length; step++) {
     document.getElementsByClassName("circle green")[step2].style.backgroundColor = "white";
     document.getElementsByClassName("circle green")[step2].style.borderColor = "black";
 }
 */
 
 var bleh = document.createElement("input");
 bleh.type = "color-picker";
 var right =  document.getElementsByClassName('side-container right-container')[0];
 right.insertBefore(bleh, right.childNodes[2]);
 
 var all = document.getElementsByTagName("*");
 var newColor = "green";
 for (var n = 0; n < all.length; n++) {
  if (all[n]) {
   if (all[n].style) {
    if (all[n].style.color == "white" || all[n].style.color == "#FFF" || all[n].style.color == "#FFFFFF" || all[n].style.color == "rgb(255, 255, 255)" || all[n].style.color == "grey") {
     all[n].style.color = newColor;
    }
    if (all[n].style.background == "white" || all[n].style.background == "#FFF" || all[n].style.background == "#FFFFFF" || all[n].style.background == "rgb(255, 255, 255)") {
     all[n].style.background = newColor;
    }
    if (all[n].style.backgroundColor == "white" || all[n].style.backgroundColor == "#FFF" || all[n].style.backgroundColor == "#FFFFFF" || all[n].style.backgroundColor == "rgb(255, 255, 255)") {
     all[n].style.backgroundColor = newColor;
    }
   }
  }
 }
 
 var PICKER = {
    mouse_inside: false,

    to_: function (dec) {
        var hex = dec.toString(16);
        return hex.length == 2 ? hex : '0' + hex;
    },

    show: function () {
        var input = $(this);
        var position = input.offset();

        PICKER.$colors  = $('<canvas width="230" height="150" ></canvas>');
        PICKER.$colors.css({
            'position': 'absolute',
            'top': position.top + input.height() + 9,
            'left': position.left,
            'cursor': 'crosshair',
            'display': 'none'
        });
        $('body').append(PICKER.$colors.fadeIn());
        PICKER.colorctx = PICKER.$colors[0].getContext('2d');

        PICKER.render();

        PICKER.$colors
            .click(function (e) {
                var new_color = PICKER.get_color(e);
                $(input).css({'background-color': new_color}).val(new_color).trigger('change').removeClass('color-picker-binded');
                PICKER.close();
            })
            .hover(function () {
                PICKER.mouse_inside=true;
            }, function () {
                PICKER.mouse_inside=false;
            });

        $("body").mouseup(function () {
            if (!PICKER.mouse_is_inside) PICKER.close();
        });
    },

    bind_inputs: function () {
        $('input[type="color-picker"]').not('.color-picker-binded').each(function () {
            $(this).click(PICKER.show);
        }).addClass('color-picker-binded');
    },

    close: function () {PICKER.$colors.fadeOut(PICKER.$colors.remove);},

    get_color: function (e) {
        var pos_x = e.pageX - PICKER.$colors.offset().left;
        var pos_y = e.pageY - PICKER.$colors.offset().top;

        var data = PICKER.colorctx.getImageData(pos_x, pos_y, 1, 1).data;
        return '#' + PICKER.to_hex(data[0]) + PICKER.to_hex(data[1]) + PICKER.to_hex(data[2]);
    },

  // Build Color palette
    render: function () {
        var gradient = PICKER.colorctx.createLinearGradient(0, 0, PICKER.$colors.width(), 0);

        // Create color gradient
        gradient.addColorStop(0,    "rgb(255,   0,   0)");
        gradient.addColorStop(0.15, "rgb(255,   0, 255)");
        gradient.addColorStop(0.33, "rgb(0,     0, 255)");
        gradient.addColorStop(0.49, "rgb(0,   255, 255)");
        gradient.addColorStop(0.67, "rgb(0,   255,   0)");
        gradient.addColorStop(0.84, "rgb(255, 255,   0)");
        gradient.addColorStop(1,    "rgb(255,   0,   0)");

        // Apply gradient to canvas
        PICKER.colorctx.fillStyle = gradient;
        PICKER.colorctx.fillRect(0, 0, PICKER.colorctx.canvas.width, PICKER.colorctx.canvas.height);

        // Create semi transparent gradient (white -> trans. -> black)
        gradient = PICKER.colorctx.createLinearGradient(0, 0, 0, PICKER.$colors.height());
        gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
        gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

        // Apply gradient to canvas
        PICKER.colorctx.fillStyle = gradient;
        PICKER.colorctx.fillRect(0, 0, PICKER.colorctx.canvas.width, PICKER.colorctx.canvas.height);
    }
};

PICKER.bind_inputs();
 
 var u = document.getElementsByClassName("form-group clearfix")[0];
 var v = u.childNodes[1];
 v.style.marginLeft = "100px";
 
 var subs = document.getElementById("stats").getElementsByTagName("span");
 for (var n = 0; n < subs.length; n++) {
  if (subs[n].id == "statsSubtext" || subs[n].id == "statsText") {
   subs[n].style.color = "white";
   subs[n].style.opacity = 0.5;
  }
 }
    
    Element.prototype.remove = function() {
    this.parentNode.removeChild(this);
    };
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentNode) {
           this[i].parentNode.removeChild(this[i]);
        }
    }
    };
 function remove() {
        document.getElementById("advertisement").style.display = "none";
        document.getElementById("advertisement").id += "8==========D";
        document.getElementById("adsBottom").style.display = "none";
        document.getElementById("adsBottom").id += "8==========D";
        document.getElementById("promo-badge-container").style.display = "none";
        document.getElementById("promo-badge-container").id += "8==========D";
        document.getElementById("agarYoutube").parentNode.style.display = "none";
        $(".agario-promo").hide();
        $(".diep-cross").hide();
  if (!music) {
   document.getElementsByTagName("hr")[1].parentNode.removeChild(document.getElementsByTagName("hr")[1]);
  }

  //document.getElementsByClassName("row")[0].removeChild(document.getElementsByClassName("btn btn-info btn-settings")[0]);
 }
}, 100);