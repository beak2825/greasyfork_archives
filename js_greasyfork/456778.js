// ==UserScript==
// @name         Pornolab Shows Thumbnails of all torrents on Forum Page
// @description  Lets you preview torrents first image by showing on hover on the tracker listing
// @namespace    https://pornolab.net/forum/index.php
// @version      0.2
// @description  try to take over the world!
// @author       zoe
// @match        https://pornolab.net/forum/*
// @match        https://rutracker.org/forum/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @license      srtuirs
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456778/Pornolab%20Shows%20Thumbnails%20of%20all%20torrents%20on%20Forum%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/456778/Pornolab%20Shows%20Thumbnails%20of%20all%20torrents%20on%20Forum%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';




    let links = window.document.querySelectorAll('.med .tLink');



    for (let i = 0; i < links.length; i++) {
        let el=links[i];
        axios.get(el.href).then(function(res) {

            let div = document.createElement('div');
            div.innerHTML = res.data;
            
            
            let source = div.querySelector('var.postImg').title;

            let sourceList = div.querySelectorAll('.postImg');
            console.log('MyList'+sourceList);

            let sourceList2 = div.querySelectorAll('var.postImg');
            console.log('MyList2'+sourceList);


            var imgs = document.querySelectorAll('.postImg');

    var k;
    for(k = 0; k < imgs.length; ++i) {
        var a = imgs[i];
        var ext = 'jpg';
        if (a.href.includes('jpeg')) {
            ext = 'jpeg';
        } else if (a.href.includes('png')) {
            ext = 'png';
        }
        var img2 = a.querySelectorAll('img.postImg');
        if (img2) {
            img2 = img2[0];
            if (img2.src.includes('fastpic')) {
                var src = img2.src.replace('thumb', 'big').replace('jpeg', ext);
                if (!src.endsWith('?noht=1')) {
                    src = src + '?noht=1';
                }
                img2.src = src;
            }
        }
    }

let maxImg = sourceList.length;

            if(sourceList.length>2) {
            maxImg=2;
            }


            for (let j = 0; j <maxImg; j++) {
                let sc=sourceList[j];
                console.log(sc.title);


                if (sc.title.includes('fastpic') && sc.title.includes('jpeg')) {
                var src2 = sc.title.replace('thumb', 'big').replace('jpeg', 'jpg?md5=3-5wmIGqP-7Ue_LvXEZjLA&expires=1671382800');
                if (!src2.endsWith('?noht=1')) {
                    src2 = src2 + '?noht=1';
                }
               // sc.title = src2;
            }



                console.log('Image No.'+j+' '+sc.title);
                let divname = 'img'+j;
                let theimg = document.createElement('img');
                theimg.src = sc.title;
console.log('theimg '+j+' is '+theimg.src);

                theimg.style = 'width: 100%; height: 720px; border: 5px ';
                // theimg.loading='lazy';

if(sc.title.includes('/big')) {
                el.appendChild(theimg);
                el.style.textDecoration = 'underline';
}


            }




            let img = document.createElement('img');

            let mbr='<mbr>'

            if(source.includes(mbr)) {
                source=source.replace(mbr,'');
                console.log(mbr);
            }

            img.src = source;
            img.alt = source;

            img.classList.add('appendedHoverIMg');
            // img.style = 'position: absolute; left: 350px; margin-top: 25px; margin-bottom:150px; width: 400px; height: 400px';



            img.style = 'width: 100%; height: 720px; border: 5px ';


            //el.appendChild(img);
            el.style.textDecoration = 'underline';










        });
    }








    /*
    links.forEach((el) => {
        el.opened = false
        el.onmouseenter = function() {
            el.opened = true

            axios.get(el.href).then(function(res) {
                if (el.opened !== true) {
                    return ;
                }
                let div = document.createElement('div');
                div.innerHTML = res.data;

                console.log(div.innerHTML)
                let source = div.querySelector('var.postImg').title;
                let img = document.createElement('img');

                img.src = source;

                console.log(img.src)
                img.classList.add('appendedHoverIMg');
                img.style = 'position: absolute; left: 350px; margin-top: 25px; margin-bottom:150px; width: 400px; height: 360px';

                el.appendChild(img);
                el.style.textDecoration = 'underline';
          });
        };

        el.onmouseout = function() {
            el.opened = false
            const node = el.querySelector('.appendedHoverIMg');
            if (node !== null) {
                node.remove();
            }
        }
    }); */
})();