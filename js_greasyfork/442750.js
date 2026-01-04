// ==UserScript==
// @name         Freak r/Place
// @namespace    https://www.reddit.com/r/Place/
// @version      1.0.5
// @description  Place template script
// @author       r/Place
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442750/Freak%20rPlace.user.js
// @updateURL https://update.greasyfork.org/scripts/442750/Freak%20rPlace.meta.js
// ==/UserScript==

const images = [
  /* for the image location, some hosts will not work as they do not sent the appropriate CORS HTTP header,
   *  if your image does not work use a differnet host, imgur works */
  /* scale specifies how large one pixel is in a source image, if the image size is 640x640 and it represents a
   * 64x64 pixel image, scale is 10 */
  
  /* [x_location, y_location, scale, image_url] */
  [1334, 599, 1, "https://i.imgur.com/OYHKhK2.png"] , /* dogs */
  [], /*cussy*/
  /*[100, 500, 10, "http://second_image.png"] ,*/
  
]


const pixels_per_placepixel = 3; // how wide is one r/place pixel, we insert the template pixel into the middle pixel of a "r/place pixel"


function get_pix(imgdata, x, y, scale, width){
  // we want to sample in the middle of the pixel
  x = parseInt(scale/2) + x*scale;
  y = parseInt(scale/2) + y*scale;

  const px = x*4 + y *(width*scale * 4);
  
  const r = imgdata[px  ];
  const g = imgdata[px+1];
  const b = imgdata[px+2];
  const a = imgdata[px+3];
 
  return [r, g, b, a];
}

function set_pix(imgdata, x, y, scale, width, rgba){
  // we want to set in the middle of the pixel
  x = parseInt(scale/2) + x*scale;
  y = parseInt(scale/2) + y*scale;
  
  const px = x*4 + y *(width*scale * 4);
 
  imgdata[px  ] = rgba[0];
  imgdata[px+1] = rgba[1];
  imgdata[px+2] = rgba[2];
  imgdata[px+3] = rgba[3];
}

function imgload(img, x, y, scale){
  const img_canvas = document.createElement("canvas");
  const img_w = img.width; 
  const img_h = img.height; 
  
  img_canvas.width  = img_w;
  img_canvas.height = img_h;
  
  const img_ctx = img_canvas.getContext('2d');
  img_ctx.drawImage(img, 0, 0);  
  
  const canvas = document.createElement("canvas");
  canvas.id = "template";
  canvas.width  = (img_w / scale) * pixels_per_placepixel;
  canvas.height = (img_h / scale) * pixels_per_placepixel;
  
  
  canvas.style = "position: absolute;left:" + x + "px ;top:" + y + "px;image-rendering: pixelated;" + "width: " + parseInt(img_w / scale)  + "px;height: " + parseInt(img_h / scale) + "px;";
  
  console.log(canvas);
  const ctx = canvas.getContext('2d');
  
  const src = img_ctx.getImageData(0, 0, img_w, img_h);
  const dest = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  let width  = parseInt(img.width / scale);
  let height = parseInt(img.height/ scale);
  //width = 10;
  //height = 10;

  for (let j=0; j < height; j+=1){
    for (let i=0; i < width; i+=1){
      const rgba = get_pix(src.data, i, j, scale, width);
      set_pix(dest.data, i, j, pixels_per_placepixel, width, rgba);    
    }   
  }
  
  console.log(dest);
  
  ctx.putImageData(dest, 0, 0);
  console.log(ctx);

	document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0]
    .getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0]
    .appendChild(canvas);
}

function windowload(){
  for (const image of images){
    const img = new Image();
    img.crossOrigin = 'anonymous';
  
    img.addEventListener('load', function() {
      imgload(img, image[0], image[1], image[2])
    }, false);
  
    img.src = image[3];
  }
}


if (window.top !== window.self) {
  window.addEventListener('load', windowload, false);
}