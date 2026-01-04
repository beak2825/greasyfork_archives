// ==UserScript==
// @name         Empornium
// @namespace    empornium.is
// @version      0.1.13
// @description  Tags for empornium
// @author       b1100101
// @match        http*://empornium.is/*
// @match        http*://www.empornium.is/*
// @match        http*://femdomcult.org/*
// @match        http*://www.femdomcult.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477898/Empornium.user.js
// @updateURL https://update.greasyfork.org/scripts/477898/Empornium.meta.js
// ==/UserScript==

var red = ["ai.generated","aestheticillusions.ai ","deepfake","ai.upscale","upscale","piss.drinking","piss","toilet.slavery","toilet.humiliation","toilet","fake.cock","fake.cum","censored","decensored","fake.tits","big.natural.tits","vertical.video","fake.scat","scat","fat.male","fat","obese","farting"];
var green = ["uncensored"];
var blue = ["solo.only","goth", "softcore", "no.sex", "long.hair", "artistic", "eye.contact", "micro.bikini", "cum.swapping", "milf"];
var favs = ["sites",  "mindundermaster.com|carol.lynn|harry.s.morgan|inflagranti|purzel.video|videorama|hegre.homemade|magmafilm|tino.media|alex.d|kitkatclub|monsucre|wifecrazy.com|wife.crazy|lilushandjobs.com|mayashandjobs.com|mistress.t|mycherrycrush.com|queensnake|queensnake.com|tugjobhoneys.com|%26!scat",
            "flat",   "small.natural.tits|small.tits|tiny.tits|flat.chest|a.cup|tiny.natural.tits|%26!transsexual",
            "skinny", "super.skinny|prone.bone|anorexic|petite|skinny|wenona|%26!transexual",
            "femdom", "cruel.anette|post.cum.play|orgasm.control|thevenusgirls.com|numbing.cream|orgasm.denial|ellakross.com|submissivecuckolds.com|post.orgasm.torture|theenglishmansion.com|femmefatalefilms.com|post.cum.torture|ruined.orgams|ruined.orgasm|cruelhandjobs.com|cruelhandjobs|handdomination.com|forced.orgasm|forced.ejaculation|forced.male.orgasm|forced.ejaculation|humilation.pov|femdomempire.com|teaseandthankyou.com|%26!transsexual%26!censored%26!no.sex%26!non.nude",
            "hand",   "slow.handjob|cock.tease|jackoffgirls.com|mylked.com|edgequeens.com|teasepov.com|cock.worship|handjobswithatwist.com|silvercherryhandjobs.com|lingam.massage|klixen|klixen.herself|post.orgasm.handjob|handjob.only|taboohandjobs.com|awesomehandjobs.com|over40handjobs.com|sensual.handjob|marks.head.bobbers.handjobbers|jerkygirls.com|humiliatinghandjob.com|handjob.to.completion|handjobhd.net|teentugs.com|clubtug.com|finishhim.com|tugpass.com|milking.table|forced.handjob|jerkywives.com|tease.and.denial|cock.milking|femdom.handjob|%26!transsexual",
            "bj",     "hotgirlssuckcock.com|thedicksuckers.com|oral.fetish|oral.fixation|mari.sax|sensual.blowjob|sloppy.blowjob|pulsating.cumshot|pulsating.oral.creampie|blowjob.after.cumshot|hands.free.orgasm|hands.free.blowjob|%26!transsexual",
            "ggg",    "thegangbangclub.com|sperma.studio.com|creampie.gangbang|cum.as.lube|ppp.tv|vollgewichste.gangbang.schlampen|snowballing|cum.covered.fucking|bukkake|gokkun|premiumbukkake.com|putalocura.com|french-bukkake.com|ggg|germangoogirls.com|spermmania.com|spermastudio.com|spermastudio|gb01|%26!transsexual",
            "69",     "69.cumshot|69|69.oral.creampie|%26!transsexual",
            "bdsm",   "der.schwarze.dorn|bondageliberation.com|sensualpain.com|breast.bondage|nipple.torture|missxtreme|missxtreme.com|needle.play|extreme|pussy.clamps|sewn.pussy|nailed.tits|tit.torture|insex.com|skewers|tg2club.com|torturegalaxy.com|master.serpent|softsideofbdsm.com|pussy.torture&26!scat",
            "fit",    "female.muscle|sofie.skye|fit.body|female.abs|fit.girl|athletic.body|visible.rib.cage|%26!fake.tits%26!transsexual",
            "person", "katy.faery|betty.g|subprincess|elise.graves|mausezahnchen|kristine.kahill|amai.liu|aria.haze|schnuggie91|leah.maus|zoey.holloway|chloe.temple|aspen.rae|kate.rich|lola.fae|lily.thai|marica.hase|gina.gerson|piper.perri|kobe.tai|violet.monroe|melissa.ashley|heather.brooke|proxy.paige|kitty.jung|sowan",
            "fempov", "reverse.pov|her.pov|female.pov|fpov%26!transsexual",
            "costums", "neon.hair|colored.contacts",
            "gggdvds", "germangoogirls.com%26(dvdr|untouched.dvd|dvd.iso|dvd.folder|dvd9|dvd5)"
           ];

var favs2 = "(" + favs[3] + ")%26(" + favs[5] + ")";
var favs3 = favs2 + "%26(" + favs[19] + ")";

var tagList = document.getElementsByClassName('tags');
//var tagListDetail = document.getElementById('torrent_tags_list');
var favorites = document.getElementsByClassName('head')[1];
var linkbox = document.getElementsByClassName('linkbox');
var path = window.location.href;


if (favorites != null && favorites.innerHTML != "Torrents")
  favorites = document.getElementsByClassName('head')[2];


function myFunction(item,index){
 console.log("in meiner myfunction");
}

/*
for (var i = 0; i < favs.length; i++) {
    for (var j = 0; j < favs[i].split("|").length; j++) {
        console.log(favs[i].split("|")[j]);
    }
}
*/

function myColor(item){
    //console.log(item);

    if(red.indexOf(item.innerHTML) >= 0){
        item.style.color = "red";
    }
    if(green.indexOf(item.innerHTML) >= 0){
        item.style.color = "#00dd00";
    }

    if(blue.indexOf(item.innerHTML) >= 0){
        item.style.color = "#8a2be2";
        item.style.fontWeight = "bold";
    }

    /*for (var i = 0; i < blue.length; i++) {
         console.log(blue[i]);
         if(blue[i].indexOf(item.innerHTML) >= 0){
          item.style.color = "#8a2be2";
            item.style.fontWeight = "bold";
            item.style.background = "#ff0000";
        }
    }*/

     for (var i = 1; i < favs.length - 1; i+=2) {
       if(favs[i].split("|").indexOf(item.innerHTML) >= 0){
         //item.style.color = "#8a2be2";
         item.style.color = "#00ddaa";
         item.style.fontWeight = "bold";
       }
     }

    /*for (var i = 1; i < favs.length - 1; i+=2) {
        for (var j = 0; j < favs[i].split("|").length; j++) {
            //if(item.innerHTML.indexOf(favs[i].split("|")[j]) >= 0){
            if(item.innerHTML == favs[i].split("|")[j]){
                item.style.color = "#00ddaa";
                item.style.fontWeight = "bold";
            }
        }
    }*/

}

function colorDetailPage(){
  setTimeout(colorDetailPageStart, 300);
}

function colorDetailPageStart() {
  //console.log("ColorDetailPage");
  var newTagListDetail = document.getElementById('torrent_tags_list');
  console.log(newTagListDetail.children.length);
  for (var i = 0; i < newTagListDetail.children.length; i++) {
    //console.log(newTagListDetail.children[i].children[0]);
    myColor(newTagListDetail.children[i].children[0],i);
  }
}


function colorEverything(){
    //console.log("ColorEverything");
    for (var i = 0; i < tagList.length; i++) {
        for (var j = 0; j < tagList[i].children.length; j++) {
            myColor(tagList[i].children[j]);
        }
    }
}

function favPornStart(){

    /*** Collage Page ***/
    if(new URL(path).pathname.includes("userhistory.php") && linkbox.length > 0) {
        console.log("userhistory");
//        linkbox[0].innerHTML = "<a href='#' onclick='colorEverything();'>Color</a>" + linkbox[0].innerHTML;

        const link = document.createElement('a');
        link.href = '#'; // Setze href auf '#', um die Seite nicht zu wechseln
        link.textContent = 'Color';

        // Füge einen Event Listener hinzu, um die Funktion auszuführen
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Verhindere das Standardverhalten des Links
            colorEverything(); // Rufe die Funktion auf
        });

        // Füge den Link an den Anfang des innerHTML von linkbox[0] hinzu
        linkbox[0].insertBefore(link, linkbox[0].firstChild);
        colorEverything(); // Rufe die Funktion auf
    }
    /*** Details Page ***/
    else if(new URL(path).searchParams.get("id") != null) {
        var favoritesIDPage = document.getElementsByClassName('head')[1];

        const link = document.createElement('a');
        link.href = '#'; // Setze href auf '#', um die Seite nicht zu wechseln
        link.textContent = 'Color';

        // Füge einen Event Listener hinzu, um die Funktion auszuführen
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Verhindere das Standardverhalten des Links
            colorDetailPage(); // Rufe die Funktion auf
        });

        // Füge den Link an den Anfang des innerHTML von linkbox[0] hinzu
        favoritesIDPage.insertBefore(link, favoritesIDPage.firstChild);
        colorDetailPage();
    }
    else {
        colorEverything();
    }

   if(favorites != null && new URL(path).searchParams.get("id") == null) {
      for (var i = 0; i < favs.length; i+=2) {
          favorites.innerHTML += " <a href='/torrents.php?taglist=" + favs[i+1] + "'>" + favs[i] + "</a>";
      }
      favorites.innerHTML += " || <a href='/torrents.php?taglist=" + favs2 + "'>skinny&flat</a>";
      favorites.innerHTML += " || <a href='/torrents.php?taglist=" + favs3 + "'>skinny&flat&fit</a>";
   }
}

favPornStart();
