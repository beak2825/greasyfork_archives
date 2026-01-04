// ==UserScript==
// @name         GC - Sitewide Overlays
// @version      0.1
// @description  Adds custom overlays to your pets when browsing the site.
// @author       dani and CrystalFlame
// @match        *www.grundos.cafe/*
// @exclude      *www.grundos.cafe/petlookup/?pet_name=*
// @exclude      *www.grundos.cafe/rainbowpool/*
// @exclude      *www.grundos.cafe/adopt/
// @exclude      *www.grundos.cafe/search/?query=*
// @exclude      *www.grundos.cafe/transfer/select/


// @grant        none
// @namespace https://greasyfork.org/users/748951
// @downloadURL https://update.greasyfork.org/scripts/489455/GC%20-%20Sitewide%20Overlays.user.js
// @updateURL https://update.greasyfork.org/scripts/489455/GC%20-%20Sitewide%20Overlays.meta.js
// ==/UserScript==



//WELCOME
//    this script comes ready to be used with up to 5 pets
//    pets are identified as Pet A, Pet B, Pet C, etc.
//    each pet has one section of data in 'IMAGE SELECTION' and one in 'SCRIPT'

//HOW TO ADD OVERLAYS
//    go to your first unused Pet in IMAGE SELECTION (Pet A has ben filled in as an example)
//    set 'overlayA' to 'on' (all overlays are off by default)
//    set 'speciesA' to your pets species (all lowercase)
//    set 'colorA' to your pets color AS WRITTEN IN ITS IMG URLS! (ie: usukigirl, faerie_alt1)
//    set 'circleA' through 'rangedA' to the imgae url of the overlays you would like for each pose
//    all images must be manually resized to 150x150px

//HOW TO LEAVE A POSE DEFAULT
//    use the default images url from the rainbow pool (simple, but a bit tedious and bulky if you need a lot)
//    OR
//    you can remove the variable from IMAGE SELECTION and the corresponding line for the pet in SCRIPT (easy and fast, but not beginner friendly)

//HOW TO ADD MORE PETS
//    in the IMAGE SELECTION section copy and paste one of the pre-made Pet sections below the rest
//    change every instance of it's final letter to the next unused letter. (if you hit Z move on to AA, AB, AC, etc)
//    change the color and species and add overlay images
//    in the SCRIPT section copy and paste one of the pre-made Pet sections below the rest
//    change every instance of it's letter to the same letter you used in IMAGE SELECTION



//IMAGE SELECTION//////////////////////////////////////////////////////////////////

(function() {

//Pet A - Name: Britney
var overlayA = 'off'
var speciesA = 'usul'
var colorA = 'usukigirl'
var circleA = 'https://i.imgur.com/OV8z1DZ.png'
var happyA = 'https://i.imgur.com/OV8z1DZ.png'
var sadA = 'https://i.imgur.com/OV8z1DZ.png'
var angryA = 'https://i.imgur.com/OV8z1DZ.png'
var beatenA = 'https://i.imgur.com/OV8z1DZ.png'
var closeA = 'https://i.imgur.com/OV8z1DZ.png'
var defendedA = 'https://i.imgur.com/OV8z1DZ.png'
var hitA = 'https://i.imgur.com/OV8z1DZ.png'
var rangedA = 'https://i.imgur.com/OV8z1DZ.png'

//Pet B - Name:
var overlayB = 'off'
var speciesB = 'SPECIES'
var colorB = 'COLOR'
var circleB = 'IMAGEURL'
var happyB = 'IMAGEURL'
var sadB = 'IMAGEURL'
var angryB = 'IMAGEURL'
var beatenB = 'IMAGEURL'
var closeB = 'IMAGEURL'
var defendedB = 'IMAGEURL'
var hitB = 'IMAGEURL'
var rangedB = 'IMAGEURL'

//Pet C - Name:
var overlayC = 'off'
var speciesC = 'SPECIES'
var colorC = 'COLOR'
var circleC = 'IMAGEURL'
var happyC = 'IMAGEURL'
var sadC = 'IMAGEURL'
var angryC = 'IMAGEURL'
var beatenC = 'IMAGEURL'
var closeC = 'IMAGEURL'
var defendedC = 'IMAGEURL'
var hitC = 'IMAGEURL'
var rangedC = 'IMAGEURL'

//Pet D - Name:
var overlayD = 'off'
var speciesD = 'SPECIES'
var colorD = 'COLOR'
var circleD = 'IMAGEURL'
var happyD = 'IMAGEURL'
var sadD = 'IMAGEURL'
var angryD = 'IMAGEURL'
var beatenD = 'IMAGEURL'
var closeD = 'IMAGEURL'
var defendedD = 'IMAGEURL'
var hitD = 'IMAGEURL'
var rangedD = 'IMAGEURL'

//Pet E - Name:
var overlayE = 'off'
var speciesE = 'SPECIES'
var colorE = 'COLOR'
var circleE = 'IMAGEURL'
var happyE = 'IMAGEURL'
var sadE = 'IMAGEURL'
var angryE = 'IMAGEURL'
var beatenE = 'IMAGEURL'
var closeE = 'IMAGEURL'
var defendedE = 'IMAGEURL'
var hitE = 'IMAGEURL'
var rangedE = 'IMAGEURL'



//SCRIPT////////////////////////////////////////////////////////////////////////////

    'use strict';
    var tags = document.getElementsByTagName('img');
    if(document.URL.indexOf("grundos.cafe/") >= 0){
        for (var b = 0; b < tags.length; b++) {
            const userinfoDiv = document.getElementById("userinfo");
            const username = userinfoDiv?.querySelector('a[href^="/userlookup"]')?.textContent;
            const reg = new RegExp(`/userlookup/\\?user=${username}$`)
            const loc = window.location.href
                if(reg.test(loc) || !loc.includes(`/userlookup/`) || username === undefined) {

//PET A
                    if (overlayA == 'on'){
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/circle/'+speciesA+'_'+colorA+'.gif', circleA);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/happy/'+speciesA+'_'+colorA+'.gif', happyA);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/sad/'+speciesA+'_'+colorA+'.gif', sadA);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/angry/'+speciesA+'_'+colorA+'.gif', angryA);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/beaten/'+speciesA+'_'+colorA+'.gif', beatenA);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/closeattack/'+speciesA+'_'+colorA+'.gif', closeA);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/defended/'+speciesA+'_'+colorA+'.gif', defendedA);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/hit/'+speciesA+'_'+colorA+'.gif', hitA);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/rangedattack/'+speciesA+'_'+colorA+'.gif', rangedA);
                    }

//PET B
                    if (overlayB == 'on'){
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/circle/'+speciesB+'_'+colorB+'.gif', circleB);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/happy/'+speciesB+'_'+colorB+'.gif', happyB);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/sad/'+speciesB+'_'+colorB+'.gif', sadB);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/angry/'+speciesB+'_'+colorB+'.gif', angryB);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/beaten/'+speciesB+'_'+colorB+'.gif', beatenB);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/closeattack/'+speciesB+'_'+colorB+'.gif', closeB);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/defended/'+speciesB+'_'+colorB+'.gif', defendedB);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/hit/'+speciesB+'_'+colorB+'.gif', hitB);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/rangedattack/'+speciesB+'_'+colorB+'.gif', rangedB);
                    }

//PET C
                    if (overlayC == 'on'){
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/circle/'+speciesC+'_'+colorC+'.gif', circleC);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/happy/'+speciesC+'_'+colorC+'.gif', happyC);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/sad/'+speciesC+'_'+colorC+'.gif', sadC);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/angry/'+speciesC+'_'+colorC+'.gif', angryC);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/beaten/'+speciesC+'_'+colorC+'.gif', beatenC);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/closeattack/'+speciesC+'_'+colorC+'.gif', closeC);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/defended/'+speciesC+'_'+colorC+'.gif', defendedC);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/hit/'+speciesC+'_'+colorC+'.gif', hitC);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/rangedattack/'+speciesC+'_'+colorC+'.gif', rangedC);
                    }


//PET D
                    if (overlayD == 'on'){
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/circle/'+speciesD+'_'+colorD+'.gif', circleD);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/happy/'+speciesD+'_'+colorD+'.gif', happyD);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/sad/'+speciesD+'_'+colorD+'.gif', sadD);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/angry/'+speciesD+'_'+colorD+'.gif', angryD);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/beaten/'+speciesD+'_'+colorD+'.gif', beatenD);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/closeattack/'+speciesD+'_'+colorD+'.gif', closeD);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/defended/'+speciesD+'_'+colorD+'.gif', defendedD);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/hit/'+speciesD+'_'+colorD+'.gif', hitD);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/rangedattack/'+speciesD+'_'+colorD+'.gif', rangedD);
                    }


//PET E
                    if (overlayE == 'on'){
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/circle/'+speciesE+'_'+colorE+'.gif', circleE);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/happy/'+speciesE+'_'+colorE+'.gif', happyE);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/sad/'+speciesE+'_'+colorE+'.gif', sadE);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/angry/'+speciesE+'_'+colorE+'.gif', angryE);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/beaten/'+speciesE+'_'+colorE+'.gif', beatenE);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/closeattack/'+speciesE+'_'+colorE+'.gif', closeE);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/defended/'+speciesE+'_'+colorE+'.gif', defendedE);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/hit/'+speciesE+'_'+colorE+'.gif', hitE);
        tags[b].src = tags[b].src.replace('https://grundoscafe.b-cdn.net/pets/rangedattack/'+speciesE+'_'+colorE+'.gif', rangedE);
                    }


//end

               }
          }
     }
}

)();