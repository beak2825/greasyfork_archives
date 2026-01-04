// ==UserScript==
// @name         Homepage Petpets
// @namespace    https://lel.wtf
// @license      GNU GPLv3
// @version      1.24
// @description  Adds petpets next to your pets on the homepage.
// @author       Lamp
// @match        https://www.neopets.com/home/
// @match        https://www.neopets.com/home/index.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481623/Homepage%20Petpets.user.js
// @updateURL https://update.greasyfork.org/scripts/481623/Homepage%20Petpets.meta.js
// ==/UserScript==

(function() {

    function getpetpets() {
        //Loop over pets
        var pets = document.getElementsByClassName('hp-carousel-pet');

        for (let i = 0; i < pets.length; i++) {
            //Grab pet name
            petname = pets[i].dataset.name;
            localStorage.setItem(petname+"img", pets[i].style.backgroundImage);
            if (pets[i].dataset.petpetimg) {
                //Grab petpet image URL
                petpetimg = pets[i].dataset.petpetimg
                //Store pet name and petpet image URL in localStorage
                if (petpetimg.startsWith("http")) {
                    localStorage.setItem(petname+"petpet", petpetimg);
                } else {
                    localStorage.setItem(petname+"petpet", "http:" + petpetimg);
                }
            } else {
                //Store blank pixel if no petpet image URL
                localStorage.setItem(petname+"petpet", "pix.gif");
            }
        }
    }



        function getpetpetpets() {
        //Loop over pets
        var pets = document.getElementsByClassName('hp-carousel-pet');

        for (let i = 0; i < pets.length; i++) {
            //Grab pet name
            petname = pets[i].dataset.name;

            if (pets[i].dataset.p3img) {
                //Grab petpetpet image URL
                petpetpetimg = pets[i].dataset.p3img
                //Store pet name and petpetpet image URL in localStorage
                //if (petpetimg.startsWith("http")) {
                    localStorage.setItem(petname+"petpetpet", petpetpetimg);
               // } else {
                    //localStorage.setItem(petname+"petpetpet", "http:" + petpetpetimg);
               // }
            } else {
                //Store blank pixel if no petpetpet image URL
                localStorage.setItem(petname+"petpetpet", "pix.gif");

            }
        }
    }




    function displaypetpets() {
        //Loop over pets
        var pets = document.getElementsByClassName('hp-carousel-pet');
        for (let j = 0; j < pets.length; j++) {
            //Grab pet name
            petname = pets[j].dataset.name;

            //Create new image element
            var img = document.createElement('img');
            img.width = "60";
            img.height = "60";
            img.id = petname + 'petpet';

            //Retrieve petpet image for pet from localStorage
            petpetimg = localStorage.getItem(img.id);

            //Run petpet image through processing script on my server and set as src for new image element
             
            img.src = "https://lel.wtf/petpet/" + petpetimg.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');
          

            //Position petpet image and soften edges with CSS drop shadow filter
            var glowstr = 3;
            img.setAttribute("style", "position:absolute;left:0px;bottom:-10px;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);")

            //Write to DOM
            pets[j].appendChild(img);
        }
    }


    function displaypetpetpets() {
        //Loop over pets
        var pets = document.getElementsByClassName('hp-carousel-pet');
        for (let j = 0; j < pets.length; j++) {
            //Grab pet name
            petname = pets[j].dataset.name;

            //Create new image element
            var img = document.createElement('img');
            img.width = "30";
            img.height = "30";
            img.id = petname + 'petpetpet';

            //Retrieve petpetpet image for pet from localStorage
            petpetpetimg = localStorage.getItem(img.id);

            //Run petpetpet image through processing script on my server and set as src for new image element
            
            img.src = "https://lel.wtf/petpet/" + petpetpetimg.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');
        

            //Position petpetpet image and soften edges with CSS drop shadow filter
            var glowstr = 2;
            img.setAttribute("style", "position:absolute;left:55px;bottom:-10px;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);")

            //Write to DOM
            pets[j].appendChild(img);
        }
    }



    //If your are on the homepage run the functions.
    //Later I can use different functions to add petpets/petpetpets to other pages without needing to run getpetpets()/getpetpetpets() as the image URLs will persist in localStorage
    if (document.location == "https://www.neopets.com/home/index.phtml" || document.location == "https://www.neopets.com/home/") {
        getpetpets();
        displaypetpets();
        getpetpetpets();
        displaypetpetpets();
    }
})();