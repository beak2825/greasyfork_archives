// ==UserScript==
// @name         MagnusImage
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hace zoom sobre una imagen en flexxo. Mantené pulsado z ;D
// @author       You
// @match        http://soporte.flexxus.com.ar/requests/show/index/*
// @grant        none
// @update       https://greasyfork.org/scripts/389796-magnusimage/code/MagnusImage.user.js 
// @downloadURL https://update.greasyfork.org/scripts/389796/MagnusImage.user.js
// @updateURL https://update.greasyfork.org/scripts/389796/MagnusImage.meta.js
// ==/UserScript==
var topeIzq = `<div id="topeIzq" style="
    background: rgba(0,0,0,1);
    background: -moz-linear-gradient(left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    background: -webkit-gradient(left top, right top, color-stop(0%, rgba(0,0,0,1)), color-stop(100%, rgba(0,0,0,0)));
    background: -webkit-linear-gradient(left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    background: -o-linear-gradient(left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    background: -ms-linear-gradient(left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    background: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#000000', GradientType=1 );
    width: 30%;
    height: 100%;
    position: absolute;
    display:none;
"></div>`;
var topeDer = `<div id="topeDer" style="
    background: rgba(0,0,0,0);
    background: -moz-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);
    background: -webkit-gradient(left top, right top, color-stop(0%, rgba(0,0,0,0)), color-stop(100%, rgba(0,0,0,1)));
    background: -webkit-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);
    background: -o-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);
    background: -ms-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);
    background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#000000', GradientType=1 );
    width: 30%;
    height: 100%;
    position: absolute;
    right: 0;
    display:none;
"></div>`;


function magnify(zoom) {
    var img, glass, w, h, bw;
    img = document.querySelector('.cboxPhoto');

    if(document.querySelector('.img-magnifier-glass') !== null){
        return;
    }

    /* Create magnifier glass: */
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");

    /* Insert magnifier glass: */
    img.parentElement.insertBefore(glass, img);

    /* Set background properties for the magnifier glass: */
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = 10;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;

    /* Execute a function when someone moves the magnifier glass over the image: */
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);

    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);

    function moveMagnifier(e) {
      var pos, x, y;
      /* Prevent any other actions that may occur when moving over the image */
      e.preventDefault();
      /* Get the cursor's x and y positions: */
      pos = getCursorPos(e);
      x = pos.x;
      y = pos.y;
      /* Prevent the magnifier glass from being positioned outside the image: */
      if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
      if (x < w / zoom) {x = w / zoom;}
      if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
      if (y < h / zoom) {y = h / zoom;}
      /* Set the position of the magnifier glass: */
      glass.style.left = (x - w) + "px";
      glass.style.top = (y - h) + "px";
      /* Display what the magnifier glass "sees": */
      glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }

    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /* Get the x and y positions of the image: */
      a = img.getBoundingClientRect();
      /* Calculate the cursor's x and y coordinates, relative to the image: */
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /* Consider any page scrolling: */
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }
  }
  function changeImage(direction){
      var cbox = document.querySelector('.cboxPhoto');
      var index = 0;
      var as = document.querySelectorAll('.filesAttached .item a');
      for(var i = 0;i< as.length;i++){
          if(as[i].href == cbox.src){
              if(typeof as[i + direction] == 'undefined'){
                  if(direction == -1){
                      $('#cboxContent').prepend($('#topeIzq'));
                      $('#topeIzq').fadeIn(200).fadeOut(100);
                  }else{
                      $('#cboxContent').prepend($('#topeDer'));
                      $('#topeDer').fadeIn(200).fadeOut(100);
                  }
              }else{
                  index = i+direction;
                  cbox.src = as[index].href;
                  console.log({index, direction,i});
                  break;
              }
          }
      }
  }
  (function(){
      $('#cboxContent').prepend(topeDer);
      $('#cboxContent').prepend(topeIzq);

    document.addEventListener('keydown',e=>{if(e.key.toUpperCase() == 'Z'){magnify(3)};});
    document.addEventListener('keyup',e=>{if(e.key.toUpperCase() == 'Z'){document.querySelector('.img-magnifier-glass').remove()}});
    document.addEventListener('mousewheel',e=>{
        if(document.querySelector('.img-magnifier-glass')== null){return;}
        var w = parseInt(document.querySelector('.img-magnifier-glass').style.width.replace('px',''));
        var h = parseInt(document.querySelector('.img-magnifier-glass').style.height.replace('px',''));
        if(isNaN(w)){
            w=200;
            h=200;
           }
        w += e.deltaY>0?10:-10;
        h += e.deltaY>0?10:-10;
        document.querySelector('.img-magnifier-glass').style.width = w +'px';
        document.querySelector('.img-magnifier-glass').style.height = h +'px';
    });
    document.addEventListener('keydown',e=>{if(e.key.toUpperCase() == 'X'){
        if(document.querySelector('.cboxPhoto') == null){
            document.querySelector('#cboxLoadedContent img').classList.add('cboxPhoto');
        }else{
            document.querySelector('.cboxPhoto').classList.remove('cboxPhoto');
        }
    }});
    document.addEventListener('keyup', e=>{if(e.key == 'ArrowRight'){changeImage(1);}});
    document.addEventListener('keyup', e=>{if(e.key == 'ArrowLeft'){changeImage(-1);}});
  })();