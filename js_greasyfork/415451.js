
// ==UserScript==
// @name         SweetSkunk's sweet scripts..
// @namespace    SweetSkunk

// @description  TESTING...TGx
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        https://torrentgalaxy.to/*

// @icon         https://i.imgur.com/9IxBGOA.gif
// @grant        GM_setValue
// @grant        GM_getValue

// @version      2.2

// @history      2.2  Arcade  ~    Image Links
// @history      2.2  all pages    CSS mods

//

// @history      2.1  Lobby   ~   Realtime Clock
// @history      2.1  Forums  ~   Rounded corners on Images + Youtubez
// @history      2.1  all pages      everything disabled by default / fresh start
// @history      2.1  #bugfix        everything stopped working geez

// @history      2.0  all pages      holiday logo added, credit to Ange1 :)
// @history      2.0  all pages      links added to Footer (bottom of page)
// @history      2.0  all pages      multiple CSS mods, optional in future

// @history      1.9  all pages      multiple CSS mods, optional in future
// @history      1.9  mailbox.php    auto-redirect to comment board

// @history      1.8  forums.php     testing "statusicons" hidden on few forums page(s)
// @history      1.8  #bugfixes      shield icon in lobby lol, conflict w/ install, collapsible menus frozen

// @history      1.7  mailbox        auto-expand 1st Sent message
// @history      1.7  most pages     transparent shield icon
// @history      1.7  profile        broken profile avy (fix)
// @history      1.7  #bugfix        still resolving  conflict w/ install

// @history      1.6  all pages      cosmetic updates
// @history      1.6  #bugfix        resolving  conflict w/ install

// @history      1.5  chathistory    goldenrod icon to shield icon
// @history      1.5  lobby          add full date @ bottom of page
// @history      1.5  #bugfix        show clock if Dark theme
// @history      1.5  #bugfix        removed Invalid Character(s) conflict w/ install

// @history      1.4  chathistory    auto expand images
// @history      1.4  lobby          add clock + static radio height
// @history      1.3  forums         add Rounded Corners for Images + Youtube videoz
// @history      1.3  all pages                 diff bgcolor OFF/normal by default
// @history      1.2  all pages      testing w/ diff bgcolor
// @history      1.2  #bugfix        show Edit, Quote buttons
// @history      1.1  #bugfix        Like button support for Chrome
// @history      1.0  forums         Like button w/o page reload  +  New Posts css update

// @exclude        https://torrentgalaxy.to/notrailer.php

// @downloadURL https://update.greasyfork.org/scripts/415451/SweetSkunk%27s%20sweet%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/415451/SweetSkunk%27s%20sweet%20scripts.meta.js
// ==/UserScript==

//alert('go');

var start = new Date();// log start timestamp

(function() {
    'use strict';

    //######################################################################################

     var h = window.document.body.innerHTML;//old school, get once

    ////default,   possible "preview" light theme, etc

     var myUserName = "anonymous";
     var testHTML = "dunno";
     var historyHTML = "dunno";
     var chatHTML = "dunno";
     var splitHTML = "dunno";
     var footerMenu = "dunno";
     var postID = "dunno";
     var mynamePartLiked = "dunno";
     var onlineUsersHTML = "dunno";
     var newpostRedirect = "dunno";
     var recommendationsHTML = "dunno";
     var betaTester = "dunno";
     var showAlerts = "dunno";
     var code = "dunno";//oops
     var dynamicClass = "dunno";
     var postcount = 0;

    //######################################################################################

    //drop where needed ;)         showAlerts = "YES"// NO   quick toggle

      showAlerts = "NO"//  YESNO   quick toggle
    //showAlerts = "YES"// YESNO   quick toggle

        //get/detect UserName,   may need check if logged out,  etc

             //hmm if no html
    if (h.match(/usermenu/)){

    if ($("#usermenu").html().match(/SweetSkunk/)) { //extra functions

                       myUserName = "SweetSkunk"//original ,  needs mods below
                      //
                      //assigned below now  betaTester = "YES"

        if (showAlerts == "YES") {//quick toggle

            alert('SS only');
        }//showAlerts
                       //window.alert(">" + myUserName + "<"); // >SweetSkunk<

    }
        //-----------------------------------------------------------------------




    //if ($("#usermenu").html().match(/ShweetSkunk/)) { //extra functions

        //nope, this account is NOT a beta tester,   & gets no extras  lol
    //}
        //-----------------------------------------------------------------------









    if ($("#usermenu").html().match(/SweetSkunk/)
     || $("#usermenu").html().match(/aaaaaaaaaaaaa/)
     || $("#usermenu").html().match(/bbbbbbbbbbbbb/)
     || $("#usermenu").html().match(/ccccccccccccc/)
     || $("#usermenu").html().match(/account-login/)) { //  anonymous  Not found if logged out

                       betaTester = "YES" // list of Beta-Testers
                   //
        if (showAlerts == "YES") {//quick toggle
        //
            alert('Beta-Tester');
        }//showAlerts
                       //window.alert(">" + myUserName + "<"); // >SweetSkunk<

    }

}
    ///////////////////////////////////////////////////////////////////////////////////////



    //exception
                 //hmm if no html
    if (h.match(/usermenu/)){
    }else{
                if (showAlerts == "YES") {//quick toggle
        //
                      alert('also on list of Beta-Testers');
         betaTester = "YES" // also on list of Beta-Testers
            }//showAlerts
                }
    //

        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 150');
        }//showAlerts


//################################################################################################################################################
//------------------------------------------------------------------------------------------------------------------------------------------------
//################################################################################################################################################
//WORKING scripts (all Users)

// Lobby   ~   Realtime Clock
//###########################################################################################//
if (window.location.href.match(/\/lobby.php/)) { // lobby


    //works original
    $('#pausebutton').after( "<button type=button id=ctclock class='btn btn-default'><font color=gray>Loading. . . . .</font></button>" );////onclick doesnt fire  lol onclick='Ohh, hello there !'ctclockParagraph.

    //css mods due to new button
    $('.chatinputdiv').css('width', '50%');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)

    $("#bbinput").css('height', '35px');//yes seems perfect

var AMPM = "dunno";

function time() {
   var d = new Date();
  var ss = d.getSeconds();
  var mm = d.getMinutes();
  var hh = d.getHours();
   var x = new Date();

   var n = x.toString();

      n=n.replace(new RegExp("Sun ", "g"),"Sunday, ");//<P>full day
      n=n.replace(new RegExp("Sat ", "g"),"Saturday, ");//<P>full day
      n=n.replace(new RegExp("Fri ", "g"),"Friday, ");//<P>full day
      n=n.replace(new RegExp("Thu ", "g"),"Thursday, ");//<P>full day
      n=n.replace(new RegExp("Wed ", "g"),"Wednesday, ");//<P>full day
      n=n.replace(new RegExp("Tue ", "g"),"Tuesday, ");//<P>full day
      n=n.replace(new RegExp("Mon ", "g"),"Monday, ");//<P>full day
      n=n.replace(new RegExp("2020", "g"),"2020 ~ ");//&nbsp;<P>full day
   //remove gmt 0400  tbd  n=n.replace(new RegExp(" Time", "g"),"");//<P>hides

    //
    ////off in x2 places req'd document.getElementById("fullclock").textContent = "" + n + ""//testclockn


    if (parseInt(hh) < 12) {
        AMPM = "AM";
    }else{
        AMPM = "PM";
    }

//?????????????????????????
      hh = hh.toString();
      hh=hh.replace(new RegExp("13", "g"),"1");//<P>full day
      hh=hh.replace(new RegExp("14", "g"),"2");//<P>full day
      hh=hh.replace(new RegExp("15", "g"),"3");//<P>full day
      hh=hh.replace(new RegExp("16", "g"),"4");//<P>full day
      hh=hh.replace(new RegExp("17", "g"),"5");//<P>full day
      hh=hh.replace(new RegExp("18", "g"),"6");//<P>full day
      hh=hh.replace(new RegExp("19", "g"),"7");//<P>full day
      hh=hh.replace(new RegExp("20", "g"),"8");//<P>full day
      hh=hh.replace(new RegExp("21", "g"),"9");//<P>full day
      hh=hh.replace(new RegExp("22", "g"),"10");//<P>full day
      hh=hh.replace(new RegExp("23", "g"),"11");//<P>full day

    //exception
    if (hh=='0') {
        hh='12';
    }
                    ss="000000000" + ss//01,02
    var mySeconds = ss.slice(-2);//last 2 characters:
                    mm="000000000" + mm//01,02
    var myMinutes = mm.slice(-2);//last 2 characters:
      var myHours = hh.slice(-2);//last 2 characters:

    document.getElementById("ctclock").textContent = " " + hh + ":" + myMinutes + ":" + mySeconds + " " + AMPM;
}

setInterval(time, 1000);

};//if (window.location.href.match(/lobby.php/)) { // lobby
//###########################################################################################//







// Forums ~  Rounded corners on Images + Youtubez
//###########################################################################################//
if (window.location.href.match(/\/forums.php/)) { //

                                         //rounded corners, etc
                 $(".img-responsive").css('border-radius', '5px');//Images
               $(".embed-responsive").css('border-radius', '5px');//Youtubez

};//if (window.location.href.match(/forums.php/)) { //
//###########################################################################################//





// Arcade ~  Links & extra drop-shadow added to Images
//###########################################################################################//
if (window.location.href.match(/\/arcade/)) { //actual game pages


     //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.slidingDivf-0b5f54caec5f08fc422eeb291234c6f25e733eec").each(function(index, posttttt){
   //yessssssss


        testHTML = $(posttttt).html();

        //add links to arcade images
    testHTML=testHTML.replace(new RegExp("Get to the top of the tree while avoiding coconuts.", "g"),"Get to the top of the tree while collecting points<br>& avoiding deadly coconuts!");//hides
    testHTML=testHTML.replace(new RegExp("<img src=\"https://img.picturegalaxy.org/static/jollyjumper.jpg\" alt=\"Jolly Jumper\" class=\"gamescreen\">", "g"),"<a href=https://torrentgalaxy.to/arcade/jollyjumper><img src=\"https://img.picturegalaxy.org/static/jollyjumper.jpg\" alt=\"Jolly Jumper\" class=\"gamescreen\"><\/a>");//hmmmmhides
    testHTML=testHTML.replace(new RegExp("<img src=\"https://img.picturegalaxy.org/static/pacman.jpg\" alt=\"Pacman\" class=\"gamescreen\">", "g"),"<a href=https://torrentgalaxy.to/arcade/pacman><img src=\"https://img.picturegalaxy.org/static/pacman.jpg\" alt=\"Pacman\" class=\"gamescreen\"><\/a>");//hmmmmhides
    testHTML=testHTML.replace(new RegExp("<img src=\"https://img.picturegalaxy.org/static/snake.jpg\" alt=\"Galaxy Snake\" class=\"gamescreen\">", "g"),"<a href=https://torrentgalaxy.to/arcade/snake><img src=\"https://img.picturegalaxy.org/static/snake.jpg\" alt=\"Snake\" class=\"gamescreen\"><\/a>");//hmmmmhides


        $(posttttt).html(testHTML);
});

    //////////////////////////////////////////////////////////

    //these need down here,      otherwise,  prevents replace above hmmm
     $(".gamescreen").css('box-shadow', '0 0 10px');//hmmmmm not too bad

     $(".gamescreen").css('border-radius', '13px');//hmmmmm not too bad

};//if (window.location.href.match(/arcade/)) { //
//###########################################################################################//


//################################################################################################################################################
//------------------------------------------------------------------------------------------------------------------------------------------------
//################################################################################################################################################











        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 200');
        }//showAlerts







//alert(betaTester);


//everything below is in BETA MODE lol
    //############################################################################################
    //*********************************************************************************************
    //############################################################################################
  //BETA-TESTING
if (betaTester == "YES"){


        if (showAlerts == "YES") {//quick toggle
        //
            alert('beta tester');
        }//showAlerts






    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //502 blues
      //will have to go old-school,   as there is no HTML / targets
  //
   // if (h=="Nothing to see here.."){//yes works
     if (h.match(/Error 502/) && h.match(/some mook spilling coffee/)) { //  /staff                                                     //Nothing to see here.


         //
        // alert('Nothing .............. to see here..');
       //crazy bug    http://torrentgalaxy.to:443/forum/perma/181551   links dont work in lobby  if in IFRAME  :/

       //Nothing &zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;to see here..

                                        //quick fix
  h=h.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  h=h.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  h=h.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');

//
  //                              h=h.replace(new RegExp("Nothing", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
    //                            h=h.replace(new RegExp("to see here..", "g"),"<title> Galaxy Chat </title><img src=><link rel='shortcut icon' href='https://i.imgur.com/wxb5AEj.gifhttps://torrentgalaxy.to/common/favicon/favicon.ico' /><iframe  style=' border-radius:10px; background-color: #dddccc;'  src=https://torrentgalaxy.to/chathistory.php?action=show&chathistorypage=0 width=100% height=99%></iframe>");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  h=h.replace(new RegExp("Site is temporarily unavailable due to automated maintenance or some mook spilling coffee", "g"),"<P><BR><P><img style=padding-left:55px; src=https://indianmemetemplates.com/storage/fu-that-yao-ming.jpg height=444px><P><BR><P>Site is temporarily unavailable due to automated maintenance or some mook spilling coffee");//hides
//<img style=padding-left:55px; src=https://indianmemetemplates.com/storage/fu-that-yao-ming.jpg height=444px>

        document.body.innerHTML=h;//set back once, Nothing   careful reverts text back if typing   (same as wwt bs))

    }

    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



    //get dynamic class name
    //class='t6279322269541bba0fcb8c5d0d133d25' alt=':_trusted_uploader:'
    //src='/common/images/statusicons/status_sitelover.png' class='t6279322269541bba0fcb8c5d0d133d25' alt=':_sitelover:'
    //----------------------------

if (h.match(/images\/statusicons/)) { //

        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 288');
        }//showAlerts
                                              //    //src='/common/images/statusicons/status_sitelover.png' class='t6279322269541bba0fcb8c5d0d133d25' alt=':_sitelover:'

     dynamicClass = h.split("images\/statusicons")[1];//yes perfect chunk
     //ahaaaaaaaaaaaaaaaaaaa^

        if (showAlerts == "YES") {//quick toggle
        //
            alert(dynamicClass);
        }//showAlerts



     dynamicClass = dynamicClass.split("class=\"")[1].split("\"")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
     

         if (showAlerts == "YES") {//quick toggle
        //
             alert('yesssss');
//
             alert(dynamicClass);//t82fd28998fa259c818fa16e47dff5e41
         }//showAlerts

}// icons

    //------------------------------
   //
  //  alert(dynamicClass);//yes works
    ///status_sitelover.png" class="t82fd28998fa259c818fa16e47dff5e41" alt=":_sitelover:" title="sitelover"><img src="/common











//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/torrentgalaxy/)) { //   ALL pages

       $('.img-responsive').css('border-radius', '3px');//subtle sidebar etc   .css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)



    if (window.location.href.match(/lobby.php/)) { //   exception w/ page updating..
    }else{

//       $('.t3709e35d5c3e631ba3f9caed16c1f93c').css('visibility', 'hidden');//'display', 'none'
         $('.' + dynamicClass).css('visibility', 'hidden');//'display', 'none'
    }
    //holiday logo
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.navbar-header").each(function(index, posttttt){
   //yessssssss


        testHTML = $(posttttt).html();

   //show for ALL eventiually
    //maybe rotate  hehe https://i.imgur.com/mRbBrVT.png https://i.imgur.com/nNe4jGv.png
   //pending

        //old way/common/images/tgxlogo.png
      //
        //yeh too much I guess testHTML=testHTML.replace(new RegExp("https://torrentgalaxy.to:443/common/images/tgxlogo.png", "g"),"https://i.imgur.com/P4XEIiT.png");//<<<  yessssss thx Ange1  https://i.imgur.com/wBSySh8.pnghttps://i.imgur.com/lsw3Uib.pngwow, nice Ange1

        //<img src="https://i.imgur.com/P4XEIiT.png" class="img-responsive" alt="logo" style="border-radius: 3px;" height="65">

     //   testHTML=testHTML.replace(new RegExp("border-radius: 3px", "g"),"border-radius: 38px");//<<<  yessssss thx Ange1  https://i.imgur.com/wBSySh8.pnghttps://i.imgur.com/lsw3Uib.pngwow, nice Ange1

//
      //cool but..   darkred
       //
  //      $(posttttt).css('background-color', 'black');
      //    $(posttttt).css('border-radius', '10px');//hmmmmm not too bad
      //    $(posttttt).css('height', '72px');//hmmmmm not too bad


 //works    .text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
});

    //////////////////////////////////////////////////////////






























    if (showAlerts == "YES") {//quick toggle
        //
            alert('line 400');
        }//showAlerts

//y

//
//for all atm
             //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//torrent results,  should be for ALL pages






//was tgxtablerow
if (h.match(/panel-body/)) { //slidingDivf-6738f3ca4d4a694367a9678aa3c0353dc9cd2427lil different,  but maybe ok

    //this changed ,  so now is DIFF Target



    //https://torrentgalaxy.to/profile/NoisyBoY
    if (showAlerts == "YES") {//quick toggle
        //
            alert('yes found rows');
        }//showAlerts


        //if class,   this seems to be only way          (reminds of WWT  for each in class, etc.  way)
//////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){

    //works now,  basically affects all user TABS

   // <div class="tb2de24f6e703d7de8a916cd8b00f9623">
    //t20361519a6ae3898fcab9fbb86d4d9f1
    //tb2de24f6e703d7de8a916cd8b00f9623
    //<div class="td208eff634dda81538f393edcf26add7">

    // showAlerts = "YES"

//nice helpful                     showAlerts = "YES"// YESNO   quick toggle
//aha , declared above code="hmmmmmmmmmmm";//aha ,  now hmmmmmmmmm vs    undefined ****************** fkkkkkkkkk  haha

    //runs on multiple pages,  use some replaces to  "normalize"  yessssssssssssss

    //noisyboy page 1 hmmm  another way :/   add to list ;)
    // style='text-align:right;'>Added</div>

    h=h.replace(new RegExp(">Added<", "g"),">Added <");// differnt per page

    h=h.replace(new RegExp(">Added&nbsp;<", "g"),">Added <");// differnt per page

    //extra bit where rating was removed
    //<i class='fas fa-angle-down'></i></a></div><!-- <div class='newtablecell'>Rating</div> -->
               //"               "
    h=h.replace(new RegExp("<i class=\"fas fa-angle-down\"><\/i>", "g"),"zzzzzzzzzzzzzzzzzzz");// double quotes
    //
    h=h.replace(new RegExp("<div class='newtablecell'>Rating<\/div>", "g"),"ahaaaaaaaaaaaaaaaa");// single quotes   (nn,  but ok)

    //extra bits from diff page views
    //<i class="fas fa-sort"></i>
    h=h.replace(new RegExp("<i class=\"fas fa-sort\"><\/i>", "g"),"okkkkkkkkkkkkkkkkkkk");// double quotes


if (h.match(/>Added </) && h.match(/watercache/)) { //slidingDivf-6738f3ca4d4a694367a9678aa3c0353dc9cd2427lil different,  but maybe ok

  //showAlerts = "YES"//tricky spot here

        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 450');
        }//showAlerts


//showAlerts = "YES"
 
    //find dynamic class
    //Seeders/Leecher'>S/L&nbsp;</span></div><div class='tgxtablecell' style='text-align:right;'>Added</div><!-- <div class='newtablecell'>Rating</div> -->

    //geez had extra SPACE,           maybe diff for other pages,  not sure ???????????????????????????
    //hmmm <td align='right'>Added <small>07/11/20 09:05</small>
                                                                  //</div><div class='td208eff634dda81538f393edcf26add7' >
     code = h.split(">Added <")[1].split("watercache")[0];//everything afterSeeders/Leecher
    //ahaaaaaaaaaaaaaaaaaaa^

        if (showAlerts == "YES") {//quick toggle
        //
            alert('code 1st split ok==' + code);
        }//showAlerts


     code = code.split("class=\"")[1].split("\"")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
 //

         if (showAlerts == "YES") {//quick toggle
        //
    alert('found watercache code ???????');

         }//showAlerts

}//watercache links / torrent pages



        if (showAlerts == "YES") {//quick toggle
        //
            alert(code);//  if "dunno" then iz problem ;)
        }//showAlerts




  //
   // alert('hmmmmmm ' + code);

//yesssssssssssssssss
      $("div." + code).each(function(index, posttttt){//buggy tgxtablerow
//    $("div.ngggggggggggggggggggggggggggggggggggggggggg").each(function(index, posttttt){//buggy tgxtablerow

 //will need dynamic                panel-body
//<div class="panel-body slidingDivf-6738f3ca4d4a694367a9678aa3c0353dc9cd2427">


        //<div class="tc0219d5f721bc2a2a7291dea30d27b86">
   //yessssssss


     testHTML = $(posttttt).html();

  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');

   //show for ALL eventiually
    //shield
     testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default


    //yesssssssssssssssssssssssssssssssssssalert(testHTML);  comments\" class=\"badge badge-secondary\"  comments\" class=\"badge badge-secondary\" s                                                                         black panther
  testHTML =testHTML.replace(new RegExp("style=\"color:white;\">0<", "g"),"style=\"color:#777;\">0<");//hides, blend w/ bubble bg

  testHTML =testHTML.replace(new RegExp("glyphicon glyphicon-floppy-save\" style=\"color:green", "g"),"glyphicon glyphicon-floppy-save\" style=\"display:none; color:green");//hides
  testHTML =testHTML.replace(new RegExp("collapsehide\" id=\"rounded\">-</div>", "g"),"collapsehide\" id=\"rounded\"> </div>");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
  testHTML =testHTML.replace(new RegExp("<a title=", "g"),"<a noootitle=");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
  testHTML =testHTML.replace(new RegExp("\" title=\"", "g"),"\" nootitle=\"");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides

          testHTML=testHTML.replace(new RegExp(" alt=\":_sitefriend:", "g")," style=visibility:hidden; alt=\":_sitefriend:");//
        //only icon it seems,  hide here

//red text gets annoying (for us atleast lol)
//        testHTML =testHTML.replace(new RegExp("<font color=\"#ff0000", "g"),"<font color=\"white");//hides
        testHTML =testHTML.replace(new RegExp("<font color=\"#ff0000", "g"),"<font color=\"green");//also affects Leech text  so green now
        testHTML =testHTML.replace(new RegExp("255,255,0,0.12", "g"),"");//aha, removes <<  I also wondered why some uploads are highlighted in yellow

        //



        //<div class='tgxtablerow' onmouseover=" return overlib('<div class=\'bubble-outer hovercoverimg collapsehide\'><img class=hovercoverimg src=https://img.picturegalaxy.org/data/cover/imdb/T/D/TD60SC9JF8.jpg /></div>',
        //FILTER,FADETIME,1,FILTEROPACITY,90,FADEIN,51);"
 //ng           testHTML =testHTML.replace(new RegExp("mouseover", "g"),"offffffffffffffffffffffff");//ng hmm
           //ng testHTML =testHTML.replace(new RegExp("FADETIME,1,FILTEROPACITY,90,FADEIN,51", "g"),"FADETIME,10,FILTEROPACITY,100,FADEIN,51");//ng hmm

        //if (testHTML.match(/mouseover/)){

          //      alert('ok');
 //   }
//alert(testHTML);

        //---------------------------------------------------------------------------
             //if (0==0) { //default atm    tbd custom mods,
//user-specific array >>
         if (myUserName.match(/SweetSkunk/)
          || myUserName.match(/SweetSkunk/)
          || myUserName.match(/SweetSkunk/)) { //"light/minimalist theme(s)"  of sorts

        // 4 different ways to spell
              if (testHTML.match(/ And /)
               || testHTML.match(/ and /)
               || testHTML.match(/\.And\./)
               || testHTML.match(/\.and\./)) { //SS only  match tagwords of sorts

                   if (testHTML.match(/XXX/)){//extra criteria
              //idea highlight bg
                    //   alert('found match');

       $(posttttt).css('background-color', 'silver');//or#999        much better ;)
                   }
               }
         }
        //------------------------------------------------------------------------------


          //<img src="/common/images/imdb_icon.png" nootitle="IMDB search">
          if  (testHTML.match(/GalaXXXy/)) {

               testHTML =testHTML.replace(new RegExp("<img src=\"/common/images/imdb_icon.png", "g"),"<img style=visibility:hidden; src=\"/common/images/imdb_icon.png");//ng hmm
//Plot:
//Lots of frisky stuff
          }

        //not remove all teal box size=5
        //class='btn btn-info2 btn-xs'><i class='fas fa-paint-brush'></i> Go to user art

    //step 3  (overwrite cureent HTML  w/ mod HTML)
//works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
});

    //////////////////////////////////////////////////////////










        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 550');
        }//showAlerts

    //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.tgxtable").each(function(index, posttttt){
   //yessssssss


     testHTML = $(posttttt).html();

            //ng   testHTML =testHTML.replace(new RegExp("mouseover", "g"),"offffffffffffffffffffffff");//ng hmm
    //       testHTML =testHTML.replace(new RegExp("FADETIME,1,FILTEROPACITY,90,FADEIN,51", "g"),"FADETIME,10,FILTEROPACITY,100,FADEIN,51");//ng hmm

        //<div class='tgxtablerow' onmouseover=" return overlib('<div class=\'bubble-outer hovercoverimg collapsehide\'><img class=hovercoverimg src=https://img.picturegalaxy.org/data/cover/imdb/T/D/TD60SC9JF8.jpg /></div>',
        //FILTER,FADETIME,1,FILTEROPACITY,90,FADEIN,51);"
 //ng
        //seems to work,  but dunno if best
       //
        testHTML =testHTML.replace(new RegExp("mouseover", "g"),"offffffffffffffffffffffff");//ng hmm
           //ng
        //testHTML =testHTML.replace(new RegExp("FADETIME,1,FILTEROPACITY,90,FADEIN,51", "g"),"FADETIME,10,FILTEROPACITY,100,FADEIN,151");//ng hmm
               //idea highlight bg

      //ahh shows when scrolling etc  $(posttttt).css('background-color', 'gray');//hmm, never see this
    //nn  $(posttttt).css('padding', '1px');//hmm, never see this

     $(posttttt).html(testHTML);
});

    //////////////////////////////////////////////////////////





     };// 0=0                if (myUserName.match(/SweetSkunk/)) { //"light/minimalist theme(s)"  of sorts



//alert('yes 450');
             //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>




 //if (0==0) { //default atm    tbd custom mods,
//user-specific array >>
         if (0==0) { //already in Beta Test mode
             //would likely need exception  for using Dark Theme
        //
 //REMOVED, TBD  SS#dddccc
  //off templooks cool still    topbar is still wheat color $("body").css('background-color', '#dddccc');//E0DFD1hmmmmm not too bad






         //test sidebar
         //off    $('#panelmain').css('background-color', '#dddccc');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)


         //  $("#tgxnavbar").css('box-shadow', '0 0 ');//hmmmmm not too bad
  //not bad at all    $("#tgxnavbar").css('border-top', '5px solid #888');//hmmmmm not too bad


               if (0==0) { //maybe ShweetSkunk  dunno dark theme tests

             $("#tgxnavbar").css('border-top', '2px dotted silver');//subtle

//REMOVED, TBD  SS
 //hmm
       $(".p-title").css('background-color', '#dddccc');//#F6D8CEhmmmmm not too bad

//aha  always changes POST REPLY box.container-fluid

             //off my mockup logo lol
//       $("#pagetop").css('background-color', 'black');//#F6D8CEhmmmmm not too bad
       $("#pagetop").css('background-color', '#dddccc');//top header
               }//              if (0==0) { //dark theme tests



       $("#pagetop").css('min-height', '75px');//75ok    seems ok min-height      76 jumps  necc,  or white line lol
  //   $("#pagetop").css('height', '100px');//#F6D8CEhmmmmm not too bad
   //ng



///////////////////////////////////
//Searching..
                    historyHTML = $("#pagetop").html();//get
                    historyHTML=historyHTML.replace(new RegExp("<button type=\"submit\" class=\"btn btn-primary\">Search<\/button>", "g"),"<button type=\"submit\" class=\"btn btn-primary\"  id=myButton1 onclick=\"document.getElementById('myButton1').textContent='Search..';    setTimeout(function(){ document.getElementById('myButton1').textContent='Search'}, 20000);      \"  >Search<\/button>");//CloseCurtain change text back aswell ;)

             //works  but now dont even need  X close   button      works w/ proper code lol
       $("#pagetop").html(historyHTML);//set
///////////////////////////////
//end Searching..




     //necessary exception
         if (window.location.href.match(/action=viewtopic/)) { //https://torrentgalaxy.to/forums.php?  &topicid=30&page=last#last
             //needs toggle geez,  messes up forums page
             $(".table-striped").css('border-top', '3px solid #c2c2a3');// must be 3px   2px cannot see :/
         }

     $(".well").css('background-color', '#E0DFD1');//lighter #dddccchmmmmm not too badHTML:

     $(".well").css('border-radius', '3px');//hmmmmm not too bad



         //ng
    //ok
  //   $(".profile").css('visibility', 'hidden');//also x2 sorta  profileadult  (bb pic)
    // $(".profileadult").css('visibility', 'hidden');//also x2 sorta  profileadult  (bb pic)

      //REMOVED, TBD  SS
 //off atm
     //OFFFFFF ok,   but certain places    $('.td3a077e52c664f5578ca0cd5927740d5').css('visibility', 'hidden');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)

          //change red streaming text
    //<div class="collapse navbar-collapse sitemenu" style="float:center;" id="navmenu-navbar-collapse">

        historyHTML = $("#navmenu-navbar-collapse").html();//get
        historyHTML=historyHTML.replace(new RegExp("color:red;text-shadow: 0 0 3px", "g"),"color:teal;text-shadow: 0 0 1px");//auto-expand images   show pics by default
        historyHTML=historyHTML.replace(new RegExp("0.5s", "g"),"0s");//auto-expand images   show pics by default

             //may need dark theme mod ??                                                               color=white
        historyHTML=historyHTML.replace(new RegExp("/arcade\">Arcade-hall<", "g"),"/arcade\">Arcade<font style=visibility:hidden;>-hall<\/font><");//hides
//      historyHTML=historyHTML.replace(new RegExp("/arcade\">Arcade-hall<", "g"),"/arcade\">Arcade<small><font color=white>hall<\/font><\/small><");//hides


    //<span style="font-weight:500;color:red;text-shadow: 0 0 3px #FF0000;animation: blinker 0.5s linear 2;">Now streaming</span>

    //<i class='fas fa-neuter' style='font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;' title='Torrent officer'>
//$("#navmenu-navbar-collapse").css('background-color', 'green');
//works  but now dont even need  X close   button      works w/ proper code lol
       $("#navmenu-navbar-collapse").html(historyHTML);//set

    //////////////////////////////////////////////////


         //only triigers for SS atm
 }// if so & so...





        //if class,   this seems to be only way          (reminds of WWT  for each in class, etc.  way)
//////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){


   //ng very buggy  >> needs diff 'target'
    //$("div.panel-heading").each(function(index, posttttt){
        //fkks up the expand/collapse functions on TGx  (not precise enuff aha)

    //aha 1 of 5 matches   (exactly,   5 categories on sidebar)
    //<div id='inthpheader' class='panel-heading'><h3 class='panel-title'><strong><a href='/torrents-hotpicks.php?cat=0'>First Cam</a>

  //ng
 //   $("h3.panel-title").each(function(index, posttttt){


     //if (0==0) { //default atm    tbd custom mods,
//user-specific array >>
         if (myUserName.match(/SweetSkunk/)
          || myUserName.match(/SweetSkunk/)
          || myUserName.match(/SweetSkunk/)) { //"light/minimalist theme(s)"  of sorts

   //  if (9==0) {////buggy but OK for US only ;)
                                                   //disables all the toggle stuff on Sidebar,  but expanded is OK
//**buggy
     testHTML = $("#panelmain").html();//geez,  actually there are 2 (sidebar & main)
                                  //but since by ID,    only triggers on 1st one,   good grief lol

          testHTML=testHTML.replace(new RegExp("cat=4\">Misc</a>", "g"),"cat=4\">Music</a>");//<a href="/torrents-hotpicks.php?cat=4">Misc</a>
          testHTML=testHTML.replace(new RegExp("cat=0\">First Cam</a>", "g"),"cat=0\">First Cams</a>");//subtle ez way to tell if script running yes
 //
   // <i class="fas fa-tree" style="color:#ff7700;"></i> Christmas<
             testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-tree\" style=\"color:#ff7700;\"></i> Christmas<", "g"),"<i class=\"fas fa-tree\" style=\"color:darkgreen;\"></i> Christmas<");//<a href="/torrents-hotpicks.php?cat=4">Misc</a>

        //**needs more place  https://torrentgalaxy.to/torrents-hotpicks.php?cat=4
        //other header + title :/
 // var code = testHTML.split("432c")[1].split("hotlist")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
 //
   ///
   // alert(testHTML);
  //
     //nice to show $("#panelmain").css('background-color', 'gray');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)


        //cat=0'>First Cam<
    $("#panelmain").html(testHTML);

    }//buggy but OK for US only ;)
//});

    //////////////////////////////////////////////////////////




    //footer mods
    //<ul class="list-unstyled text-center">
    //////////////////////////////////////////////////
    //same as below concept

    $("ul.list-unstyled").each(function(index, posttttt){
   //yessssssss

//$(posttttt).css('background-color', 'green');
     testHTML = $(posttttt).html();

        //'inactive,   now halloween pics lol
        testHTML =testHTML.replace(new RegExp(">http://galaxy2gchufcb3z.onion<", "g"),">http://torrentgalaxy.........onion<");//hides
        //testHTML =testHTML.replace(new RegExp("|", "g")," ");//<font color=#dddccc  style=visibility:hidden;>|</font>hides

        //
//http://galaxy2gchufcb3z.onionnnnnnnn (Tor proxy)
             $(posttttt).html(testHTML);
});

    //////////////////////////////////////////////////////////



    //geez needs now for all pages :/
    //

};//if (window.location.href.match(/torrentgalaxy/)) { //  ALL pages
//###########################################################################################//
//###########################################################################################//

        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 700');
        }//showAlerts




//template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/lobby.php/)) { // lobby

    //tbd   radio jumps abit on vs offline
    //   $('#radioinfo').css('height', '151px');
         $('.slidingDivf-98af74dbbb7d05d071e08de1886c87673d65b7bd').css('height', '238px');//240 too much 440 shows ex.
//             ^^ is same num for everyone?????????????????????????????????


  //??????????????????????????????????????????????????????????????????????????????????????????
  //realtime update in Lobby?
  //ez way
    function getChat(){
               chatHTML = $("#int").html();//get
        onlineUsersHTML = $("#onlinechatters").html();//get

 //       historyHTML=historyHTML.replace(new RegExp("display: none;", "g"),"");//auto-expand images   show pics by default
if (chatHTML.match(/goldenrod/) || onlineUsersHTML.match(/goldenrod/)) {
       //aha
      //
//
 //   alert('golden');


      //
//    var code = historyHTML.split("goldenrod")[1].split("hi ho")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
 //alert(code);

    //shield
    //    historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default

  chatHTML=chatHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  chatHTML=chatHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  chatHTML=chatHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');

    //jumps abit,  but looks better lol
 //       historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=12px width=12px style=padding-bottom:2px;>");//auto-expand images   show pics by default
    //jumps too much
    chatHTML=chatHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=11px width=9px style=padding-bottom:2px;>");//auto-expand images   show pics by default
     //hides    historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;             from 10 to 11px                            padding-right:1px;visibility:hidden;\" title=\"Torrent officer\"><\/i>");//auto-expand images   show pics by default
//^^^
    //(oops,  when re-using code,  ended up re-using old image url )


 //ok   visual verify ,  make sure text not messing up / blurry etc.
 //
    //chatHTML=chatHTML.replace(new RegExp("Nov", "g"),"<u><font color=orange>Nov</font></u>");//auto-expand images   show pics by default

    //    historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=12px width=8px style=padding-bottom:0px;>");//auto-expand images   show pics by default
//diff size  minimal jump,  but too small :/

        //overwrite ONLY if "goldenrod" found ??????????

    //<i class='fas fa-neuter' style='font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;' title='Torrent officer'>
//
  //aha,  yes, saw white bg  $("#int").css('background-color', 'gray');

//works  but now dont even need  X close   button      works w/ proper code lol
       $("#int").html(chatHTML);//set
    /////////////////////////////////////////////////


    chatHTML = $("#onlinechatters").html();//get
   //shield
 //jumps too much
  //nice but too big for here

  chatHTML=chatHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  chatHTML=chatHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  chatHTML=chatHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');

    chatHTML=chatHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=10px width=9px style=padding-bottom:2px;>");//height=15px width=15px style=padding-bottom:2px;>auto-expand images   show pics by default
   //hides      historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;visibility:hidden;\" title=\"Torrent officer\"><\/i>");//auto-expand images   show pics by default
       $("#onlinechatters").html(chatHTML);//set
 //   $("#onlinechatters").css('background-color', 'gray');
}//if sees goldenrod only
    };

    //
    //setTimeout(getChat, 3000);//hmmm dunno   how fast is too fast lol

//not bad,  but too much
    setInterval(getChat, 1000);//hmmm dunno
  //??????????????????????????????????????????????????????????????????????????????????????????





    //???????????????????????????????????????????????????
    //staff recommendations  loads after delay  hmmmmmmmm
     //ez way
    function getRecommendations (){
               recommendationsHTML = $("#splist").html();//get

                                 //quick fix
                                recommendationsHTML=recommendationsHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
                                recommendationsHTML=recommendationsHTML.replace(new RegExp("&zwnj;", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
                                recommendationsHTML=recommendationsHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');

    //jumps abit,  but looks better lol
 //       historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=12px width=12px style=padding-bottom:2px;>");//auto-expand images   show pics by default
    //jumps too much
  //small one  recommendationsHTML=recommendationsHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=10px width=9px style=padding-bottom:2px;>");//auto-expand images   show pics by default

 //copied from above
    //shield
        recommendationsHTML=recommendationsHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default


    //yesssssssssssssssssssssssssssssssssssalert(testHTML);  comments\" class=\"badge badge-secondary\"  comments\" class=\"badge badge-secondary\" s                                                                         black panther
  recommendationsHTML=recommendationsHTML.replace(new RegExp("style=\"color:white;\">0<", "g"),"style=\"color:#777;\">0<");//hides
  recommendationsHTML=recommendationsHTML.replace(new RegExp("glyphicon glyphicon-floppy-save\" style=\"color:green", "g"),"glyphicon glyphicon-floppy-save\" style=\"display:none; color:green");//hides
  recommendationsHTML=recommendationsHTML.replace(new RegExp("collapsehide\" id=\"rounded\">-</div>", "g"),"collapsehide\" id=\"rounded\"> </div>");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
  recommendationsHTML=recommendationsHTML.replace(new RegExp("<a title=", "g"),"<a noootitle=");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
  recommendationsHTML=recommendationsHTML.replace(new RegExp("\" title=\"", "g"),"\" nootitle=\"");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides

        recommendationsHTML=recommendationsHTML.replace(new RegExp(" alt=\":_sitefriend:", "g")," style=visibility:hidden; alt=\":_sitefriend:");//
        //only icon it seems,  hide here
        //<img src="/common/images/td3a077e52c664f5578ca0cd5927740d5/status_sitefriend.gif" class="td3a077e52c664f5578ca0cd5927740d5" alt=":_sitefriend:" nootitle="sitefriend">
///////////


      //hides    historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;visibility:hidden;\" title=\"Torrent officer\"><\/i>");//auto-expand images   show pics by default

//works  but now dont even need  X close   button      works w/ proper code lol
       $("#splist").html(recommendationsHTML);//set
    /////////////////////////////////////////////////


            //test
     //
       //not ideal here ,  messes with otheres $('.td3a077e52c664f5578ca0cd5927740d5').css('visibility', 'hidden');//'display', 'none'
    };

//nope refreshes like Lobby ??
  //resets to original view ??    sometimes varies on how long takes to load initially :/
    setTimeout(getRecommendations, 500);//aha,  req'd  because of way page loads   >> "Loading.."
    setTimeout(getRecommendations, 1500);//aha,  req'd  because of way page loads   >> "Loading.."
//    setTimeout(getRecommendations, 3500);//aha,  req'd  because of way page loads   >> "Loading.."
  //  setTimeout(getRecommendations, 5000);//aha,  req'd  because of way page loads   >> "Loading.."
    //setTimeout(getRecommendations, 10000);//aha,  req'd  because of way page loads   >> "Loading.."

    //geez,   REMOVE ?? mouseover images keep show/ hide  etc   :/
//
    setInterval(getRecommendations, 55000);// weird,  seems to need   but ...aha,  req'd  because of way page loads   >> "Loading.."



    //yep $("#splist").css('background-color', 'gray');//

    //???????????????????????????????????????????????????



    ////////////////////////////////////////////
    //add clock w/ seconds
    //<button type="button" id="pausebutton" class="btn btn-default"><div id="pausestatus"><i class="fas fa-pause" style="color:red;"></i>&nbsp;Pause chat</div></button>

//oops not status
//      ok  $('#pausestatus').append( "<span id=ctclock>Loading..</span>" );//ctclockParagraph.
    //not append                                  >>proper,  but like below better  class='btn btn-default'

    //works original lool                                                           //onclick doesnt fire  lol
//    $('#pausebutton').after( "<button type=button id=ctclock class='btn btn-default' onclick='Ohh, hello there !'><font color=gray>Loading. . . . .</font></button>" );//ctclockParagraph.

    //gives it an icon & addss link
//fancy look,  but nn     $('#pausebutton').after( "<a href='/chathistory.php?action=show' target='_blank' class='btn btn-default' ><font color=gray><i id=ctclock class='fas fa-history'>Loading..&nbsp; </i></font></a>" );//ctclockParagraph.
                                                                    //oops
    //btn btn-default<i class='fas fa-history'>&nbsp;</i>
//<a href='/chathistory.php?action=show' target='_blank' class='btn btn-default'><i class='fas fa-history'>&nbsp;</i>History</a>

    //test
     //   $('.td3a077e52c664f5578ca0cd5927740d5').css('visibility', 'hidden');//'display', 'none'


//affects bottom nav buttons,   but FOOTER mod should overwrite
    $('.btn-default').css('height', '35px');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)

    //ngdocument.getElementById("pausebutton").value="PAUSE";
//<div class="chatinputdiv" style="width:100%;"
    //test visuals
//
//    $('.chatinputdiv').css('width', '50%');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)
    //ng
   // $('.chatinputdiv').css('overflow', 'hidden');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)

    //: nowrap;
    //   $('#pausestatus').css( 'max-width', '90px');//seems to help jumps when Pause vs Resume

  //  $("#bbinput").css('height', '35px');//yes seems perfect
      //ng $("#bbinput").css('width', '10%');//yes seems perfect

//
  //old clock code was here



};//if (window.location.href.match(/lobby.php/)) { // lobby
//###########################################################################################//
//###########################################################################################//



//
    //alert('yes 822');


//template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/mailbox.php/)) { //offftbd


//only expand 1st PM sent msg
    //need find 1st id

    //<tr id="msg_1089220" style="display:none;">


   if (h.match(/<tr id=\"msg_/)) { //split fuction MUST have existing / matching text   or error..

               splitHTML = h.split("<tr id=\"msg_")[1].split("\" style=")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
//b1111 = b1111.replace(new RegExp("&amp;", "g"),"&") + '#last';//nice, but not perfect if multiple new posts :/   sweet padding:5px;    auto-expand images   show msgs by default
  // window.alert(splitHTML);//1089220

   }


        //if class,   this seems to be only way          (reminds of WWT  for each in class, etc.  way)
//////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
  //  var maxShow=0;
    $("table.table-striped").each(function(index, posttttt){//off targets entire Sent page


         testHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssssalert(testHTML);                                                                            black panther
// msg_1089220" style="display:none;">msg_1089220\" style
      //sweet, actualy works
        testHTML =testHTML.replace(new RegExp("msg_" + splitHTML + "\" style=\"display:none;\">", "g"),"msg_" + splitHTML + "\" style=\"box-shadow:0 0 3px #555;\">");//sweet padding:5px;    auto-expand images   show msgs by default

//works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);


//        alert('hmm');
   //yessssssss
// maxShow = maxShow+1;
  //      if (1 == 1){
//alert('1');
    //     }//if 1 off here
});

    ///////////////////////////////////////////////
  //  $("table.table-striped").css('box-shadow', '0 0 15px #444');//hmmmmm not too bad
   //only targets 1st one cause by id $("#mpbox").css('box-shadow', '0 0 5px #555');//hmmmmm not too bad


   //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //SS only
     if (myUserName.match(/SweetSkunk/)) { //

 //gotta do by class

        ////////////////////
$("div.active").each(function(index, posttttt){//is ok,

    testHTML = $(posttttt).html();

//window.alert(testHTML);
/////////????????????????????
         if (testHTML.match(/A new post has been made in topic/)
          && testHTML.match(/action=viewtopic/) && testHTML.match(/page=last/)) { // //split function MUST have existing / matching text   or error..

           splitHTML = testHTML.split("action=viewtopic")[1].split("page=last")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)



newpostRedirect = "YES"

        //static lol
            window.document.title=" Redirecting in 5s..."//window. ?????

 //             setTimeout(function(){ window.document.title=" Redirecting in 5s..."; }, 1000);//backwards hehe
   //           setTimeout(function(){ window.document.title=" Redirecting in 4s..."; }, 2000);//backwards hehe
     //         setTimeout(function(){ window.document.title=" Redirecting in 3s..."; }, 3000);//backwards hehe
       //       setTimeout(function(){ window.document.title=" Redirecting in 2s..."; }, 4000);//backwards hehe
         //     setTimeout(function(){ window.document.title=" Redirecting in 1s..."; }, 5000);//backwards hehe


//build// //&amp;topicid=85&amp;
         splitHTML=splitHTML.replace(new RegExp("&amp;", "g"),"&");//auto-expand images   show pics by default

             //https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1474&page=last
             splitHTML = "https://torrentgalaxy.to/forums.php?action=viewtopic" + splitHTML + "page=last";
//full link window.alert(splitHTML);
//not yet
             setTimeout(function(){ window.location.href = splitHTML; }, 5000);


         }
    //????????????????????????


  //yes perfect     diff target  alert(testHTML);
//$(posttttt).css('background-color', 'green');

 // testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides

    $(posttttt).html(testHTML);
});//each
        ////////////////////


         //update outside of..
         if (newpostRedirect == "YES") {

         historyHTML = $("#message").html();//get
 //      historyHTML=historyHTML.replace(new RegExp("To read this post go to", "g"),"\nRedirecting to.....................................\n");//auto-expand images   show pics by default
         historyHTML=historyHTML.replace(new RegExp(">Message :<", "g"),"><B>Redirecting in 5s...</B><");//auto-expand images   show pics by default

         $("#message").html(historyHTML);//set
     }


        //look for actual msg
 //not proper target        $("#message").css('background-color', 'green');

    //ng js stuff     alert($("#message").html);
//too long of story here...
//     if (h.match(/Check out /)) { // //split function MUST have existing / matching text   or error..

         //A new post has been made in topic |Staff/Moderator Help Thread|
                                //5 diff ways, geez  You can find it at https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=85&page=last
//     if ($("#message").html.match(/A new post has been made in topic/)
  //      || $("#message").html.match(/action=viewtopic/)) { // //split function MUST have existing / matching text   or error..

    //       splitHTML = $("#message").split("action=viewtopic")[1].split("page=last")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)

         //To  read visit https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1474&page=last
         //new text  geez
       //  splitHTML = h.split("Check out ")[1].split("</textarea>")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
               // splitHTML = h.split("You can  find it at ")[1].split("</textarea>")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
//                splitHTML = h.split("To  read visit ")[1].split("</textarea>")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
             //   splitHTML = h.split("To read this post go to ")[1].split("</textarea>")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
                                     //Go to this  link

         //if wanna goto lastpost instead   splitHTML = splitHTML.replace(new RegExp("&amp;", "g"),"&") + '#last';//nice, but not perfect if multiple new posts :/   sweet padding:5px;    auto-expand images   show msgs by default
  //
         //by default,  atually points tolast page, vs.  last post  (pros + cons)
         //A new post has been made in topic |KAT|
 //To read this post go to https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1174&page=last    //override it

//old way ng now..

     //}//read this post...

             //To read this post go to https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=31&page=last</textarea>
     }//SS only
//*********************************************************************
//same concept for Notify on Wall

    // ok for all
    if (0==0) {
     if (h.match(/Visit your profile to see your comment board/) && h.match(/made a new post on your comment board/)) { // //split function MUST have existing / matching text   or error..
//.
         //:25px;/action=viewtopic need more specific
 //window.alert(historyHTML);
//                splitHTML = h.split("To read this post go to ")[1].split("</textarea>")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
//splitHTML = splitHTML.replace(new RegExp("&amp;", "g"),"&") + '#last';//nice, but not perfect if multiple new posts :/   sweet padding:5px;    auto-expand images   show msgs by default
  // window.alert(splitHTML);

         //by default,  atually points tolast page, vs.  last post  (pros + cons)
         //A new post has been made in topic |KAT|
 //To read this post go to https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1174&page=last    //override it

         historyHTML = $("#message").html();//get
 //       historyHTML=historyHTML.replace(new RegExp("To read this post go to", "g"),"\nRedirecting to.....................................\n");//auto-expand images   show pics by default
         historyHTML=historyHTML.replace(new RegExp(">Message :<", "g"),"><B>Redirecting in 5s...</B><");//auto-expand images   show pics by default


         $("#message").html(historyHTML);//set

          window.document.title=" Redirecting in 5s..."//window. ?????

                                 //SweetSkunk's comment board &nbsp;&nbsp;<a href='#newcomment<<hmm goes to last ? ng
  setTimeout(function(){ window.location.href = "https://torrentgalaxy.to/account.php#userboard"; }, 5000);//userboard < not bad shows userpicks aswell

     }
    };//if (0==0) {



  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>






};//if (window.location.href.match(/mailbox.php/)) { //
//###########################################################################################//
//###########################################################################################//


//alert('yes 950');

 //template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/chathistory.php/)) { //  chathistory.php?action=show

    //all hrefs need mod in case of  https://torrentgalaxy.to/account-login.php?returnto=%2Fchathistory.php%3Faction%3Dshow


    $(".namebadge").css('height', '31px');//diff heights if no icons / m i o k

   //top bit

//perfect div / target
        historyHTML = $("#onlinechatters").html();//getintblockslide
    //nn    historyHTML=historyHTML.replace(new RegExp("display: none;", "g"),"");//auto-expand images   show pics by default

    historyHTML=historyHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
    historyHTML=historyHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
    historyHTML=historyHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
    //shield
        historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default



    //<i class='fas fa-neuter' style='font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;' title='Torrent officer'>


       $("#onlinechatters").html(historyHTML);//set
//*********************************************************************




    //override it
//bottom bit
        historyHTML = $("#int").html();//get

        historyHTML=historyHTML.replace(new RegExp("display: none;", "g"),"");//auto-expand images   show pics by default



    historyHTML=historyHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
    historyHTML=historyHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
    historyHTML=historyHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');


    //shield
        historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default


    //<i class='fas fa-neuter' style='font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;' title='Torrent officer'>

//works  but now dont even need  X close   button      works w/ proper code lol
       $("#int").html(historyHTML);//set


//all now       $('.img-responsive').css('border-radius', '4px');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)

   // alert(dynamicClass);
    //buggytd3a077e52c664f5578ca0cd5927740d5
//$('.tc678509eee9f195539ef3c3e99a5a73e').css('visibility', 'hidden');//.css('display', 'none');//t

    $('.' + dynamicClass).css('visibility', 'hidden');//.css('display', 'none');//t
    //:25px;
         //window.alert(historyHTML);
   //               var showActualHTML = historyHTML.split("k66a1141f0")[1].split("glasses")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
         //window.alert(showActualHTML);



};//if (window.location.href.match(/chathistory.php/)) { //  chathistory.php?action=show
//###########################################################################################//
//###########################################################################################//

//
  //  alert('yes 1013');








 //template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/forum\/perma/)
   || window.location.href.match(/action=viewtopic&topicid=/)) { //  permalink
                          //https://torrentgalaxy.to/forum/perma/183714

    $("div.slidingDivf-a869d6e48e515c2ad27baa0f0561c923e19ce20e").each(function(index, posttttt){//is ok,  there are 2 place actually
//may need dynamic  not sure

     testHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssss
 //found target
 //   alert("aha" + testHTML);

 testHTML=testHTML.replace(new RegExp("Not Valid", "g"),"Not Valid..");//testtttttttthides

        //
//h=h.replace(new RegExp("You do not have access to the forum this topic is in.", "g"),"<center>You do not have access to the forum this topic is in..<\/center><P><BR><img style=padding-left:55px; src=https://indianmemetemplates.com/storage/fu-that-yao-ming.jpg height=444px>");//hides
  testHTML=testHTML.replace(new RegExp("Not Valid..", "g"),"Not Valid..<center><BR><b>Oops..</b><P><img style=padding-left:55px; src=https://indianmemetemplates.com/storage/fu-that-yao-ming.jpg height=444px><\/center>");//Oops..<P>hides

        //another error msg
  testHTML=testHTML.replace(new RegExp("Topic not found", "g"),"Topic not found..<center><BR><b>Oops..</b><P><img style=padding-left:55px; src=https://indianmemetemplates.com/storage/fu-that-yao-ming.jpg height=444px><\/center>");//Oops..<P>hides


        // <div class="panel-body slidingDivf-a869d6e48e515c2ad27baa0f0561c923e19ce20e">
    //Topic not found        </div>

    //yesssssalert(testHTML);

  //test works  haha   testHTML=testHTML.replace(new RegExp("do not", "g"),"ahaaaaaaaaaaa");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
//$(posttttt).css('background-color', '#777');
    $(posttttt).html(testHTML);
});//each

};//if (window.location.href.match(/permalink
//###########################################################################################//
//###########################################################################################//







//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/forums.php/)) { //  forums


  $('.form-control').css('min-height', '35px');//aha,   needs min-  to allow normal sized "Post Reply  "90px   good to see exaggerated   yes affects top search aswell :/
//<input type="text" name="keywords" class="form-control" value="" placeholder="search forum">



  //slight diff
//<i style="font-size: 16px;" class="far fa-eye-slash" title="Spoiler" alt="hide"></i>
  $('.fa-eye-slash').css('min-height', '19px');//aha,   needs min-  to allow normal sized "Post Reply  "90px   good to see exaggerated   yes affects top search aswell :/
 $('.fa-image').css('min-height', '19px');//aha,   needs min-  to allow normal sized "Post Reply  "90px   good to see exaggerated   yes affects top search aswell :/


//error msgs
    //***********************

//too many targets 1 of 8 etc
    //$("div.panel-primary").each(function(index, posttttt){//is ok,  there are 2 place actually
//$("td.alt2").each(function(index, posttttt){
 //yessssssss
$("div.slidingDivf-6dd01b53b4fb9b39f88bc4b98f8cbd89de7859c2").each(function(index, posttttt){//is ok,  there are 2 place actually
//may need dynamic  not sure

     testHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssss
 //found target

 testHTML=testHTML.replace(new RegExp("You do not have access to the forum this topic is in.", "g"),"<center>You do not have access to the forum this topic is in..<\/center><P><BR><P><img style=padding-left:55px; src=https://indianmemetemplates.com/storage/fu-that-yao-ming.jpg height=444px>");//hides


    //yesssssalert(testHTML);

  //test works  haha   testHTML=testHTML.replace(new RegExp("do not", "g"),"ahaaaaaaaaaaa");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
//$(posttttt).css('background-color', '#777');
    $(posttttt).html(testHTML);
});//each

    //************************




//alert('550');
//another msg
 //yessssssss

    //************************



    //adding here for ALL forum pages,
    //<img src="/common/images/statusicons/status_male.png" class="t8b068106fff72447bcf2b276c0d58a21" alt=":_male:" title="male">
    //need dynamic       td3a077e52c664f5578ca0cd5927740d5
           // $('.t8b068106fff72447bcf2b276c0d58a21').css('visibility', 'hidden');//'display', 'none'
//       $('.t3709e35d5c3e631ba3f9caed16c1f93c').css('visibility', 'hidden');//'display', 'none'
         $('.' + dynamicClass).css('visibility', 'hidden');//'display', 'none'


    if (window.location.href == "https://torrentgalaxy.to/forums.php"
     || window.location.href == "https://torrentgalaxy.to/forums.php?catchup") { //main page only,   testing hide icons

//        $('.td3a077e52c664f5578ca0cd5927740d5').css('visibility', 'hidden');//'display', 'none'
//       $('.t3709e35d5c3e631ba3f9caed16c1f93c').css('visibility', 'hidden');//'display', 'none'
         $('.' + dynamicClass).css('visibility', 'hidden');//'display', 'none'

        ////////////////////
$("tr.clickable-row").each(function(index, posttttt){//is ok,  there are 2 place actually

//$("td.alt2").each(function(index, posttttt){
 //yessssssss


     testHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssss
 //   alert(testHTML);


  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');

    //shield
    //seems too big    testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:0px;>");//auto-expand images   show pics by default
    testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),
                                         "<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=10px width=9px style=visibility:hidden;>");//  maybe ok show           height=15px width=15px style=padding-bottom:2px;>auto-expand images   show pics by default
    testHTML=testHTML.replace(new RegExp(">2020-", "g"),
                                         ">");//height=15px width=15px style=padding-bottom:2px;>auto-expand images   show pics by default

    $(posttttt).html(testHTML);
});//each
        ////////////////////
    }//main page only
   //************************************************************************************
////could prolly have gone together , thought was diff targets



        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 1100');
        }//showAlerts

    if (window.location.href.match(/forums.php\?action=viewforum&forumid=/)) { //subforums https://torrentgalaxy.to/forums.php?action=viewforum&forumid=22
//alert('hmm');
        $('.td3a077e52c664f5578ca0cd5927740d5').css('visibility', 'hidden');//seems ok

        ////////////////////


$("tr.clickable-row").each(function(index, posttttt){//is ok,  there are 2 place actually
//$("td.alt2").each(function(index, posttttt){
 //yessssssss


     testHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssss
 //   alert(testHTML);

  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');
    //shield
    //seems too big    testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:0px;>");//auto-expand images   show pics by default
    testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),
                                         "<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=10px width=9px style=visibility:hidden;>");//height=15px width=15px style=padding-bottom:2px;>auto-expand images   show pics by default
    testHTML=testHTML.replace(new RegExp(">2020-", "g"),
                                         ">");//height=15px width=15px style=padding-bottom:2px;>auto-expand images   show pics by default

    $(posttttt).html(testHTML);
});//each
        ////////////////////
    }//main page only

    //*******************************************************************************







    //redirect if no unread topics


   //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //SS only
     if (myUserName.match(/SweetSkunk/)) { //

//Game, spam and promotion topics no longer listed on this page -<\/em><\/span><\/p><\/small><\/center><br \/><b
     if (h.match(/>Nothing found</)) { // //split function MUST have existing / matching text   or error..

   //<div class="panel-body slidingDivf-">
//

  //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.slidingDivf-5ef3db1018770e5f66afe29d08da753ff965434b").each(function(index, posttttt){
   //yessssssss
//alert('hmm');

       testHTML = $(posttttt).html();
       testHTML=testHTML.replace(new RegExp("Nothing found", "g"),"<B>Redirecting in 5s...</B>");//auto-expand images   show pics by default

    //yesssssssssssssssssssssssssssssssssssalert(testHTML);                                                                            black panther

        $(posttttt).html(testHTML);
});

    ///////////////////////////////////////////////


                       window.document.title=" Redirecting in 5s..."//window. ?????


setTimeout(function(){ window.location.href = "https://torrentgalaxy.to/forums.php"; }, 5000);

     }//match

     };//SS only
//*********************************************************************

//visual aswell
     //              $("ol.breadcrumb").css('border', '1px dotted gray');//Youtubez lol
       //             $("ol.breadcrumb").css('height', '27px');//Youtubez lol
  //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("ol.breadcrumb").each(function(index, posttttt){
   //yessssssss
//alert('hmm');

       testHTML = $(posttttt).html();
       testHTML=testHTML.replace(new RegExp("border-color:wheat", "g"),"height:23px; border-color:silver");//24auto-expand images   show pics by default

         $(posttttt).html(testHTML);
});

    ///////////////////////////////////////////////





  //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.slidingDivf-5ef3db1018770e5f66afe29d08da753ff965434b").each(function(index, posttttt){
   //yessssssss
//alert('hmm');

       testHTML = $(posttttt).html();
   //handled above    testHTML=testHTML.replace(new RegExp("Nothing found", "g"),"<B>Redirecting in 5s...</B>");//auto-expand images   show pics by default

   //   <button type="submit" value="Search
       testHTML=testHTML.replace(new RegExp("<button type=\"submit\" value=\"Search", "g"),"<button type=\"submit\" style=height:35px value=\"Search");//auto-expand images   show pics by default
       testHTML=testHTML.replace(new RegExp("<input type=\"text\" name=\"keywords", "g"),"<input type=\"text\" style=height:35px name=\"keywords");//auto-expand images   show pics by default
       testHTML=testHTML.replace(new RegExp("Mark All Forums Read.", "g"),"<font size=7><u>Mark All Forums Read</u></font>");//hides

    //yesssssssssssssssssssssssssssssssssssalert(testHTML);                                                                            black panther



        $(posttttt).html(testHTML);
});

    ///////////////////////////////////////////////



  //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.slidingDivf-4cbef334cd56af4e9e97746b84de1fe85fec780d").each(function(index, posttttt){
   //yessssssss
//alert('hmm');

       testHTML = $(posttttt).html();
   //handled above    testHTML=testHTML.replace(new RegExp("Nothing found", "g"),"<B>Redirecting in 5s...</B>");//auto-expand images   show pics by default

   //   <button type="submit" value="Search
       testHTML=testHTML.replace(new RegExp("<button type=\"submit\" value=\"Search", "g"),"<button type=\"submit\" style=height:35px value=\"Search");//auto-expand images   show pics by default
       testHTML=testHTML.replace(new RegExp("<input type=\"text\" name=\"keywords", "g"),"<input type=\"text\" style=height:35px name=\"keywords");//auto-expand images   show pics by default
     //  testHTML=testHTML.replace(new RegExp("Mark All Forums Read.", "g"),"<font size=7><u>Mark All Forums Read</u></font>");//hides

    //yesssssssssssssssssssssssssssssssssssalert(testHTML);                                                                            black panther



        $(posttttt).html(testHTML);
});

    ///////////////////////////////////////////////



    //alert('forums aha');
    // @match old        https://torrentgalaxy.to/forums*
//TorrentGalaxy: TESTING...scripts by SS


    //testing rounded corners, etc
                 $(".img-responsive").css('border-radius', '5px');//images lol
               $(".embed-responsive").css('border-radius', '5px');//Youtubez lol

    //



    //img-responsive rounded



//OLD way ng h=h.replace(new RegExp("<strong>torrentgalaxy.to</strong> is about to be blocked in several regions. &nbsp;&nbsp;&nbsp;&nbsp;<u><strong>Stay with us!</strong></u> Bookmark <a href=\"https://proxygalaxy.pw\" target=\"_blank\">https://proxygalaxy.pw</a> to keep our official proxy list.", "g"),"<font color=#d9edf7><strong>torrentgalaxy.to</strong> is about to be blocked in several regions.    Bookmark <a href=\"https://proxygalaxy.pw\" target=\"_blank\"></a><font color=#d9edf7>https://proxygalaxy.pw</font> to keep our official proxy list.</font>");//hmmmmmmmmmmm yes 1st try   hides
    //<strong>torrentgalaxy.to</strong> is about to be blocked in several regions. &nbsp;&nbsp;&nbsp;&nbsp;<u><strong>Stay with us!</strong></u> Bookmark <a href='https://proxygalaxy.pw' target='_blank'>https://proxygalaxy.pw</a> to keep our official proxy list.
//ng jumps    $("#blockalert").html('<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\"><i class=\"fas fa-window-close\"></i></span></button>');//hmmmmm not too bad
//ng jumps$("#").css('height', '37px');//hmmmmm not too bad

//new try for no jump
                  //REMOVED, TBD       var div_data = "	<ul class=\"nav navbar-nav\">		<li><a href=\"/forums.php\"><span style=\"font-weight:800;\">FORUMS</span></a></li><li><a href=\"/lobby.php\">Lobby</a></li>";
   //ok,  but off atm
    //gave perfect screeenshot ;)    $("#navmenu-navbar-collapse").html(div_data);


    //var alertHTML = $("#blockalert").html();//get

  //  alertHTML=alertHTML.replace(new RegExp("<strong>torrentgalaxy.to</strong> is about to be blocked in several regions. &nbsp;&nbsp;&nbsp;&nbsp;<u><strong>Stay with us!</strong></u> Bookmark <a href=\"https://proxygalaxy.pw\" target=\"_blank\">https://proxygalaxy.pw</a> to keep our official proxy list.", "g"),"<font color=#d9edf7><strong>torrentgalaxy.to</strong> is about to be blocked in several regions.    Bookmark <a href=\"https://proxygalaxy.pw\" target=\"_blank\"></a><font color=#d9edf7>https://proxygalaxy.pw</font> to keep our official proxy list.</font>");//hmmmmmmmmmmm yes 1st try   hides
//works  but now dont even need  X close   button      works w/ proper code lol   $("#blockalert").html(alertHTML);//set

  //nope  $.ajax({url: "https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1690&page=1&like=173793#post173793"});
if (9==0) {
$.ajax({
  url: "https://torrentgalaxy.to/forums.php",
  data: {
    action: "viewtopic",
     topicid: 1690,
     page: 1,
     like: 173793
  },
  success: function( result ) {
       alert('success ???');

    //$( "#weather-temp" ).html( "<strong>" + result + "</strong> degrees" );
  }
});
} //off




    //test dropdown colors
            ////////////////////
//$("div.dropdown").each(function(index, posttttt){//is ok,  there are 2 place actually

//$("td.alt2").each(function(index, posttttt){
 //yessssssss
















 //    testHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssss
 //   alert(testHTML);

    //shield
    //seems too big    testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:0px;>");//auto-expand images   show pics by default
  //  testHTML=testHTML.replace(new RegExp("gray", "g"),
  //                                       "grayyyyyyyyyyyyyyyyyyy");//height=15px width=15px style=padding-bottom:2px;>auto-expand images   show pics by default
    //testHTML=testHTML.replace(new RegExp("Gray", "g"),
    //                                     "Grayyyyyyyyyyyyyyyyy");//height=15px width=15px style=padding-bottom:2px;>auto-expand images   show pics by default

    //no flipping way  haha $(posttttt).html(testHTML);
//});//each
        ////////////////////



    //https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1690&page=1#post174047
        //TESTING...

//    ShowMessage();

    //insert styles

     //   $("<body>").append(`TESTING...<P>`);//ng

 //REMOVED, TBD    $(".ubuntu panel-title").css('display', 'none');

        //sweet $("#headnew").append(`<P><BR><P>&nbsp; AHA, TESTING...<P>`);Forum Threads


//cannot get clock to update  lol    $("#panelheader").append(`<P><P><BR><P>&nbsp; YES, TESTING... <P><P><BR><P><span id='ct' ></span>`);


    //        $(".fas fa-gamepad headericon").append(`<P><BR><P>&nbsp; AHA, TESTING...<P>`);


               // $("#blockalert").hide();
 //REMOVED, TBD         $('#blockalert').css('visibility', 'hidden');

      //REMOVED, TBD        $('#nicehead').css('height', '90px');
     //nope jumps too much     $('.username').css('padding-left', '5px');

//needs work
              //REMOVED, TBD       var div_data = "	<ul class=\"nav navbar-nav\">		<li><a href=\"/forums.php\"><span style=\"font-weight:800;\">FORUMS</span></a></li><li><a href=\"/lobby.php\">Lobby</a></li>";
   //ok,  but off atm
    //gave perfect screeenshot ;)    $("#navmenu-navbar-collapse").html(div_data);


   //ng    $('.list-unstyled text-center').html(div_data);
//     $("footer").html('<P><BR><center>&nbsp; CUSTOM  FOOTER...<P>TorrentGalaxy  @ 2020 is powered by electrons..................etc.</center><BR><P>');
 //REMOVED, TBD      $("footer").append('<P><BR><center>&nbsp; CUSTOM  FOOTER...<P>TorrentGalaxy  @ 2020 is powered by electrons...</center><BR><P>');


    //ng   $('.fas fa-image').prepend('-------');
    //
 //REMOVED, TBD     $('.outerstaffpicks').css('display', 'none');

   //ng$('#splist').css('overflow', 'hidden');
//
  //     $('.chattable').css('height', '999px');
    //   $('.scrollstyle bender shoutbox').css('height', '999px');

      //onclick
   // $('#body131386').append('<BR><img onclick=alert(`space ng  testing...`); src=https://img.picturegalaxy.org/data/cover/imdb/x/E/xET1RRmI5v.jpg  style=cursor:pointer;  height=55px>');

    //not sure if throws error on other pages , ???


    //triggers on this page,  now off    https://torrentgalaxy.to/forum/perma/131386/KAT
    // was test $('#body131386').append('ahaaaaaaaaaaaaaaaaaaaaaaaaa<BR><div width=1500px><img onclick=alert(`testing...`); src=https://img.picturegalaxy.org/data/cover/imdb/x/E/xET1RRmI5v.jpg  style=cursor:pointer;  height=155px></div>');

    //ng  function   bs alert($('#body131386').html);alert($('#body131386').html);
   //better
//alert('geez');

 //ahaaaaaaaaaaaaaaaaa ng  because of space etc  $('.panel-body slidingDivf-eb71e55822f10b6347ffbd6312d02f8da8b339dd').css('display', 'none');
//worsks


    //REMOVED, TBD  $('.slidingDivf-eb71e55822f10b6347ffbd6312d02f8da8b339dd').css('display', 'none');




 //above  var h=document.body.innerHTML;//get once

           ////REMOVED, TBD         if (h.match(/body131386/)) { //  Topics with unread posts

  //<td class= ....
  //  alert($('#body131386').html());//undefined on ther pages
    //triggers on this page,  now off    https://torrentgalaxy.to/forum/perma/131386/KAT

         //         }//nice
    //getting close..   only triggers on this page atm
    //https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1174&page=1   KAT page 1   My torrents doesn't wait ! :P


    // $('#body131386').html("<b>Hello world!</b>");






    //ng too vaguealert($('#body131386').text());

   //ng $('.p-foot').append('<P>????   iz  above,   not below');//  *better with main script turned off,  aha*


   // $('.outerstaffpicks').append('<img src=https://i.imgur.com/o0wXoha.gif>');
 //REMOVED, TBD        $('#zzzzzzzzzzzzzzzzzzzzzzzzzz').css('zzzzzzzzzzzz', 'zzzzzzzzzzzzzzz');



//jumps,  wth   $(".p-foot").css('height', '34px');//hmmmmm not too bad



    //$('#navigation ul li').css('display', 'inline-block');
//<div ><a href='XXX'>XXX</a></div>




  // ahhhhh, may be necc,   shows odd width when alert shows contrast
   //dunno $(".p-title").css('width', '1300px');//hmmmmm not too bad

    //no just another jump  $(".p-title").css('height', '35px');//because some posts havelarger icons,  some dont
    //https://torrentgalaxy.to/forum/perma/175054/Test-image-post-thread-for-members
    //vs
    //https://torrentgalaxy.to/forum/perma/130865/Test-image-post-thread-for-members


//REMOVED, TBD      $(".img-responsive").css('border-radius', '7px');//hmmmmm not too bad
  //ok,  but  in many places   $(".img-responsive").css('box-shadow', '0 0 5px #444');//hmmmmm not too bad

    //box-shadow: 0 0 5px #444

  //     var modHTML = $("body").html();//oops ,   wrong way /facepalm

    //REMOVED, TBD  modHTML=modHTML.replace(new RegExp("<small>Wk</small>", "g"),"<small>&nbsp; Wk</small>");//<P>hides


// modHTML=modHTML.replace(new RegExp("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", "g"),"");//<P>hides
 //modHTML=modHTML.replace(new RegExp("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", "g"),"");//<P>hides
 //modHTML=modHTML.replace(new RegExp("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", "g"),"");//<P>hides

    //

//noooooooooooooo    $("body").html('<img onclick=alert(`testing...`); src=https://img.picturegalaxy.org/data/cover/imdb/x/E/xET1RRmI5v.jpg  style=cursor:pointer;  height=155px>');//hmmmmm not too bad


    //noooooooooo,  need better way,   BUGGY >  loses text in textarea  if/when  BACKSPACE on page
    //$("body").html(modHTML);//hmmmmm
//**************************************************************************************************

 //nice,  but still contains textarea :/   =  ng
  //
  //user art @ bottom
   // $('.slidingDivf-502bf55519b1c61d050c7b433becc95b6221c567').css('background-color', '#444444');



//alert('yes 1400');
        //if class,   this seems to be only way          (reminds of WWT  for each in class, etc.  way)
//////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.slidingDivf-502bf55519b1c61d050c7b433becc95b6221c567").each(function(index, posttttt){
   //yessssssss


       testHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssssalert(testHTML);                                                                            black panther
 
//
      //  if (myUserName.match(/SweetSkunk/)) { // thanksgiving
     //
        if (0==0) { //halloween + thanksgiving pics

                         if (testHTML.match(/haunted-home/)) { //chck b4 modified..  only modify Artwork by...  IF iz Halloween pics,  sweet
                                                                                 //sry ,  just temporary :)
            testHTML =testHTML.replace(new RegExp("Artwork by <strong><font color=gold>IvOry</font></strong>", "g"),"Artwork by <strong><font color=gold>...</font></strong>");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
            testHTML =testHTML.replace(new RegExp("Artwork by <strong><font color=gold>amalsk</font></strong>", "g"),"Artwork by <strong><font color=gold>...</font></strong>");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
            testHTML =testHTML.replace(new RegExp("Artwork by <strong><font color=gold>Reaper</font></strong>", "g"),"Artwork by <strong><font color=gold>...</font></strong>");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
             }

   testHTML =testHTML.replace(new RegExp("https://picturegalaxy.org/images/2020/11/09/haunted-homea95f535c3d00c3d2d9c5b61770828408.jpg", "g"),"https://i.imgur.com/82Vv6dr.jpg");//hides
   testHTML =testHTML.replace(new RegExp("https://picturegalaxy.org/images/2020/11/09/lqrOr0M27bad00450e33f2442cdafe16779a2a6.gif", "g"),"https://i.imgur.com/82Vv6dr.jpg");//hides


        testHTML =testHTML.replace(new RegExp("https://picturegalaxy.org/images/2020/11/09/Entry-8254bddfc7c3c2d0d.jpg", "g"),"https://i.imgur.com/bq49d97.jpg");//https://i.imgur.com/82Vv6dr.jpghttps://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
        testHTML =testHTML.replace(new RegExp("https://picturegalaxy.org/images/2020/11/09/Entry-6976e6c7d92463fc8.jpg", "g"),"https://i.imgur.com/bq49d97.jpg");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
                                            //'inactive,   now halloween pics lol

//             if (testHTML.match(/haunted-home/)) { // only modify Artwork by...  IF iz Halloween pics,  sweet
  //                                                                               //sry ,  just temporary :)
    //        testHTML =testHTML.replace(new RegExp("Artwork by <strong><font color=gold>IvOry</font></strong>", "g"),"Artwork by <strong><font color=gold>...</font></strong>");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
      //      testHTML =testHTML.replace(new RegExp("Artwork by <strong><font color=gold>amalsk</font></strong>", "g"),"Artwork by <strong><font color=gold>...</font></strong>");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
        //    testHTML =testHTML.replace(new RegExp("Artwork by <strong><font color=gold>Reaper</font></strong>", "g"),"Artwork by <strong><font color=gold>...</font></strong>");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
          //   }

            testHTML =testHTML.replace(new RegExp(">this link<", "g"),">User artwork rules & entries<");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides
            testHTML =testHTML.replace(new RegExp(">To submit your artwork, follow <", "g"),">To submit your artwork,&nbsp; see &nbsp;<");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides

        //ng    testHTML =testHTML.replace(new RegExp("max-height: 200px;", "g"),"max-height: 200px;max-width: 800px;");//https://i.ibb.co/GCNzNkw/RFUser-Art.jpghttps://i.ibb.co/xMF8xMQ/BP.jpghides


            //Artwork by <strong><font color=gold>IvOry</font></strong>
        }
        //not remove all teal boxhttps://picturegalaxy.org/images/2020/11/09/Entry-8254bddfc7c3c2d0d.jpg
        //class='btn btn-info2 btn-xs'><i class='fas fa-paint-brush'></i> Go to user art

    //step 3  (overwrite cureent HTLML  w/ mod HTML)
//works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
});

    ///////////////////////////////////////////////
  //ng sidebar   $('#panelmain').css('background-color', '#777');
//$('.panel-body').css('background-color', '#444444');

      //
 //   $('.btn btn-info2 btn-xs').css('display', 'none');//ng cause of spaces
   // $('.btn-info2').css('display', 'none');  still leaves "-"




        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 1600');
        }//showAlerts


    ///////

  //step 1  (find target)
  //  $(".breadcrumb").css('background-color', '#555');

    //step 2    modify HTML
  //not easy,   especially if NO DIV to target



//
    //alert('mmmmmmmmmmmmmmmhmm');









  //step 1  (find target)
  //  $(".breadcrumb").css('background-color', '#555');

    //step 2    modify HTML
  //not easy,   especially if NO DIV to target
    //if class,   this seems to be only way          (reminds of WWT  for each in class, etc.  way)
//////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("ol.breadcrumb").each(function(index, posttttt){
 //yessssssss


     testHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssssalert(testHTML);
   testHTML =testHTML.replace(new RegExp("lightcoral;", "g"),"wheat; height:23px; border-color:silver;");//24wheathides#397b82
 //testHTML =testHTML.replace(new RegExp(">New Posts<", "g"),">0 New Posts<");//wheathides


   //jumpstestHTML =testHTML.replace(new RegExp("Go to user art <\/a>&nbsp;-&nbsp;", "g"),"<\/a>");//hides

        //not remove all teal box
        //class='btn btn-info2 btn-xs'><i class='fas fa-paint-brush'></i> Go to user art

    //step 3  (overwrite cureent HTLML  w/ mod HTML)
//works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
});

    ///////////////////////////////////////////////

    //var breadcrumbHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssssalert(testHTML);


//step 4    turn off  lol //step 1  (find target)















 //   $("div.f-post").css('background-color', '#ddd');//sweeeeeeeeeeeeeeeeeet nice

$("div.f-post").each(function(index, posttttt){
 //yessssssssoffffffffffffffffffffffffffffffffbuggy


     testHTML = $(posttttt).html();
    //yesssssssssssssssssssssssssssssssssss

    //add exception for moderated posts  ></i>&nbsp; - post moderated by <
    if (testHTML.match(/ - post moderated by </)){
        //skip
        //nice   alert('skip');
        }else{
 //
    //

   // alert(testHTML);//new funky class names added geez



//  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  //testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  //testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');

   //nn alert('1064');

    //alert(testHTML);//new funky class names added geez

if (0==0) {//REMOVED, TBD  SS  maybe if change to funny/cool   will be ok
//default avatar

    //'break allprofile  images
//not bad, still jumps :/    testHTML =testHTML.replace(new RegExp("gif\" class=\"profile\"", "g"),"offf\" class=\"profile\"");//hides


    //x2 places   (threads + profiles)
    //fix broken profile avy

    //still broken pic on profile  :(             will need diff code for profiles :/
    //https://torrentgalaxy.to/profile/Angelina
    testHTML =testHTML.replace(new RegExp("https://img.picturegalaxy.org/static/default-avatar.jpg", "g"),"https://i.imgur.com/NC5pJVl.jpg");//hides

//broken avy fix   niceeeeeee
    testHTML =testHTML.replace(new RegExp("https://i.ibb.co/bjhp1Wt/ezgif-4-dcdd78770a05.gif", "g"),"https://i.imgur.com/PF2Dv4X.gif");//angelina


    //user-specific array >>
         if (myUserName.match(/SweetSkunk/)
          || myUserName.match(/SweetSkunk/)) { //SS only  match tagwords of sorts

    // sry very flashy :/
    testHTML =testHTML.replace(new RegExp("https://media2.giphy.com/media/uZszvSyzCUrfO/giphy.gif", "g"),"");//zzzzzzz&nbsp; hides
    testHTML =testHTML.replace(new RegExp("https://picturegalaxy.org/images/2020/06/24/FECZcdea998d78f1c6ee.gif", "g"),"https://i.imgur.com/PQbV2sQ.gif");//<P>hides
    testHTML =testHTML.replace(new RegExp("https://media1.giphy.com/media/RHlm0r4VlDCgg/giphy.gif", "g"),"offhttps://i.pinimg.com/236x/15/8d/da/158dda701fd0719ad87c715ae0652446--phones-fun-stuff.jpg");//<P>hides
    testHTML =testHTML.replace(new RegExp("https://i.imgur.com/wrns905.gif", "g"),"https://i.imgur.com/TbPA5Gc.png");//<P>hides

         }//SS only

}//running yes, but careful


//REMOVED, TBD
    testHTML =testHTML.replace(new RegExp(">Posted at ", "g"),">Posted ~ ");//<P>hides
    //nope not yet,  needs diff regex

    testHTML =testHTML.replace(new RegExp(">Permalink", "g"),">REFRESH*");//<P>hides
    //nope not yet,  needs diff regex



 //visual mod forums
    //Posted at 2019-12-28 17:26:23(8Hrs ago)
                   //yes works             testHTML =testHTML.replace(/:23\(/g,':23zzz\(');//??
                   //wow works !              testHTML =testHTML.replace(/:23\(/g,'<font color=#dddccc  style=visibility:hidden;>:23\(<\/font>\(');//??
                 testHTML =testHTML.replace(/:00\(/g,'<font color=#dddccc  style=visibility:hidden;>:00<\/font>\(');//??
                 testHTML =testHTML.replace(/:01\(/g,'<font color=#dddccc  style=visibility:hidden;>:01<\/font>\(');//??
                 testHTML =testHTML.replace(/:02\(/g,'<font color=#dddccc  style=visibility:hidden;>:02<\/font>\(');//??
                 testHTML =testHTML.replace(/:03\(/g,'<font color=#dddccc  style=visibility:hidden;>:03<\/font>\(');//??
                 testHTML =testHTML.replace(/:04\(/g,'<font color=#dddccc  style=visibility:hidden;>:04<\/font>\(');//??
                 testHTML =testHTML.replace(/:05\(/g,'<font color=#dddccc  style=visibility:hidden;>:05<\/font>\(');//??
                 testHTML =testHTML.replace(/:06\(/g,'<font color=#dddccc  style=visibility:hidden;>:06<\/font>\(');//??
                 testHTML =testHTML.replace(/:07\(/g,'<font color=#dddccc  style=visibility:hidden;>:07<\/font>\(');//??
                 testHTML =testHTML.replace(/:08\(/g,'<font color=#dddccc  style=visibility:hidden;>:08<\/font>\(');//??
                 testHTML =testHTML.replace(/:09\(/g,'<font color=#dddccc  style=visibility:hidden;>:09<\/font>\(');//??
                 testHTML =testHTML.replace(/:10\(/g,'<font color=#dddccc  style=visibility:hidden;>:10<\/font>\(');//??
testHTML =testHTML.replace(/:11\(/g,'<font color=#dddccc  style=visibility:hidden;>:11<\/font>\(');
testHTML =testHTML.replace(/:12\(/g,'<font color=#dddccc  style=visibility:hidden;>:12<\/font>\(');
testHTML =testHTML.replace(/:13\(/g,'<font color=#dddccc  style=visibility:hidden;>:13<\/font>\(');
testHTML =testHTML.replace(/:14\(/g,'<font color=#dddccc  style=visibility:hidden;>:14<\/font>\(');
testHTML =testHTML.replace(/:15\(/g,'<font color=#dddccc  style=visibility:hidden;>:15<\/font>\(');
testHTML =testHTML.replace(/:16\(/g,'<font color=#dddccc  style=visibility:hidden;>:16<\/font>\(');
testHTML =testHTML.replace(/:17\(/g,'<font color=#dddccc  style=visibility:hidden;>:17<\/font>\(');
testHTML =testHTML.replace(/:18\(/g,'<font color=#dddccc  style=visibility:hidden;>:18<\/font>\(');
testHTML =testHTML.replace(/:19\(/g,'<font color=#dddccc  style=visibility:hidden;>:19<\/font>\(');
testHTML =testHTML.replace(/:20\(/g,'<font color=#dddccc  style=visibility:hidden;>:20<\/font>\(');
testHTML =testHTML.replace(/:21\(/g,'<font color=#dddccc  style=visibility:hidden;>:21<\/font>\(');
testHTML =testHTML.replace(/:22\(/g,'<font color=#dddccc  style=visibility:hidden;>:22<\/font>\(');
testHTML =testHTML.replace(/:23\(/g,'<font color=#dddccc  style=visibility:hidden;>:23<\/font>\(');
testHTML =testHTML.replace(/:24\(/g,'<font color=#dddccc  style=visibility:hidden;>:24<\/font>\(');
testHTML =testHTML.replace(/:25\(/g,'<font color=#dddccc  style=visibility:hidden;>:25<\/font>\(');
testHTML =testHTML.replace(/:26\(/g,'<font color=#dddccc  style=visibility:hidden;>:26<\/font>\(');
testHTML =testHTML.replace(/:27\(/g,'<font color=#dddccc  style=visibility:hidden;>:27<\/font>\(');
testHTML =testHTML.replace(/:28\(/g,'<font color=#dddccc  style=visibility:hidden;>:28<\/font>\(');
testHTML =testHTML.replace(/:29\(/g,'<font color=#dddccc  style=visibility:hidden;>:29<\/font>\(');
testHTML =testHTML.replace(/:30\(/g,'<font color=#dddccc  style=visibility:hidden;>:30<\/font>\(');
testHTML =testHTML.replace(/:31\(/g,'<font color=#dddccc  style=visibility:hidden;>:31<\/font>\(');
testHTML =testHTML.replace(/:32\(/g,'<font color=#dddccc  style=visibility:hidden;>:32<\/font>\(');
testHTML =testHTML.replace(/:33\(/g,'<font color=#dddccc  style=visibility:hidden;>:33<\/font>\(');
testHTML =testHTML.replace(/:34\(/g,'<font color=#dddccc  style=visibility:hidden;>:34<\/font>\(');
testHTML =testHTML.replace(/:35\(/g,'<font color=#dddccc  style=visibility:hidden;>:35<\/font>\(');
testHTML =testHTML.replace(/:36\(/g,'<font color=#dddccc  style=visibility:hidden;>:36<\/font>\(');
testHTML =testHTML.replace(/:37\(/g,'<font color=#dddccc  style=visibility:hidden;>:37<\/font>\(');
testHTML =testHTML.replace(/:38\(/g,'<font color=#dddccc  style=visibility:hidden;>:38<\/font>\(');
testHTML =testHTML.replace(/:39\(/g,'<font color=#dddccc  style=visibility:hidden;>:39<\/font>\(');
testHTML =testHTML.replace(/:40\(/g,'<font color=#dddccc  style=visibility:hidden;>:40<\/font>\(');
testHTML =testHTML.replace(/:41\(/g,'<font color=#dddccc  style=visibility:hidden;>:41<\/font>\(');
testHTML =testHTML.replace(/:42\(/g,'<font color=#dddccc  style=visibility:hidden;>:42<\/font>\(');
testHTML =testHTML.replace(/:43\(/g,'<font color=#dddccc  style=visibility:hidden;>:43<\/font>\(');
testHTML =testHTML.replace(/:44\(/g,'<font color=#dddccc  style=visibility:hidden;>:44<\/font>\(');
testHTML =testHTML.replace(/:45\(/g,'<font color=#dddccc  style=visibility:hidden;>:45<\/font>\(');
testHTML =testHTML.replace(/:46\(/g,'<font color=#dddccc  style=visibility:hidden;>:46<\/font>\(');
testHTML =testHTML.replace(/:47\(/g,'<font color=#dddccc  style=visibility:hidden;>:47<\/font>\(');
testHTML =testHTML.replace(/:48\(/g,'<font color=#dddccc  style=visibility:hidden;>:48<\/font>\(');
testHTML =testHTML.replace(/:49\(/g,'<font color=#dddccc  style=visibility:hidden;>:49<\/font>\(');
testHTML =testHTML.replace(/:50\(/g,'<font color=#dddccc  style=visibility:hidden;>:50<\/font>\(');
testHTML =testHTML.replace(/:51\(/g,'<font color=#dddccc  style=visibility:hidden;>:51<\/font>\(');
testHTML =testHTML.replace(/:52\(/g,'<font color=#dddccc  style=visibility:hidden;>:52<\/font>\(');
testHTML =testHTML.replace(/:53\(/g,'<font color=#dddccc  style=visibility:hidden;>:53<\/font>\(');
testHTML =testHTML.replace(/:54\(/g,'<font color=#dddccc  style=visibility:hidden;>:54<\/font>\(');
testHTML =testHTML.replace(/:55\(/g,'<font color=#dddccc  style=visibility:hidden;>:55<\/font>\(');
testHTML =testHTML.replace(/:56\(/g,'<font color=#dddccc  style=visibility:hidden;>:56<\/font>\(');
testHTML =testHTML.replace(/:57\(/g,'<font color=#dddccc  style=visibility:hidden;>:57<\/font>\(');
testHTML =testHTML.replace(/:58\(/g,'<font color=#dddccc  style=visibility:hidden;>:58<\/font>\(');
testHTML =testHTML.replace(/:59\(/g,'<font color=#dddccc  style=visibility:hidden;>:59<\/font>\(');
testHTML =testHTML.replace(/:60\(/g,'<font color=#dddccc  style=visibility:hidden;>:60<\/font>\(');
//testHTML =testHTML.replace(/:61\(/g,'<font color=#dddccc  style=visibility:hidden;>:61<\/font>\(');
//




  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');


    //shield
    testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default


//padding
//REMOVED, TBD         




    //duunno,, add ID to likebox??
    //ng



    //nooooooooooooooo prevents trigger below   aha testHTML =testHTML.replace(new RegExp("Like", "g"),"maybeeeeeeeee");//<P>hides


    /////////////////////////////////////////////////////////////
    //IFRAME method / old school link

  //  2 parts     beginning & end

    //lil visual test
    //8

    //    $('#body174858').append('ahaaaaaaaaaaaaaaaaaaaaaaaaa<BR><div width=1500px><img onclick=alert(`testing...`); src=https://img.picturegalaxy.org/data/cover/imdb/x/E/xET1RRmI5v.jpg  style=cursor:pointer;  height=155px></div>'); nng  $(posttttt).html(testHTML);   ng $('#likeboxtr').append('dunnoooooo,  needs dynamic atleast');
//////////////////////////////////////////////
        //get ID
  //works                                var postID = testHTML.split(">Post liked by - <")[1].split("</table>")[0]; // nooooo >> <small>Posted atpageid = (url after "&page=") - (the rest of the url starting from #)


    //  regain Quote + Reply buttons
 //        var QuoteHTML = testHTML.split("SmileIT")[1].split(">Reply<")[0]; // nooooo >> <small>Posted atpageid = (url after "&page=") - (the rest of the url starting from #)
// QuoteHTML=`<div align='right'><button onclick="SmileIT` + QuoteHTML + `>Reply</a>&nbsp;</div>`
 //seems right   alert(QuoteHTML);

//alert('hmm not showing footer on page 1          xmas thread');
    //
//######################################################################################

     
  ////////////////////////////////////////////
                              if (testHTML.match(/<tr valign=\"top\" class=\"\" id=\"body/)) { // check ONLY Post Liked bit, etc Topics with unread posts

    //alert('//chrome bugfix');
        postID = testHTML.split("<tr valign=\"top\" class=\"\" id=\"body")[1].split("\"><td width=\"150\" align=\"left\" class=\"comment-details")[0]; // nooooo >> <small>Posted atpageid = (url after "&page=") - (the rest of the url starting from #)

    //chrome  sourcecode   but actually doublequotess ffs
    //<tr valign='top' class='' id='body175599'><td width='150' align='left' class='comment-details'>
                              } else {
   //now needs toggle //*******************************************

   //

    ////////nice 1st try FF only  geez

    //ff original
        postID = testHTML.split("<tr class=\"\" id=\"body")[1].split("\" valign=\"top\"><td class=\"comment-details")[0]; // nooooo >> <small>Posted atpageid = (url after "&page=") - (the rest of the url starting from #)

                              }//end bugfux
  ///////////////////////////////////////////

//alert(postID);// aha  ng >> <a   onclick="setTimeout(function(){ window.document.getElementById('foot182962" valign="top"><td .......
      postID = postID.split("\"")[0]; // quick fix
//
  //  alert(postID);// 182962

//#######################################################################################

    ////////nice 1st try
                                    //old buggy in chrome         var postID = testHTML.split("<tr class=\"\" id=\"body")[1].split("\" valign=\"top\"><td class=\"comment-details")[0]; // nooooo >> <small>Posted atpageid = (url after "&page=") - (the rest of the url starting from #)
              // ahaaaa  HTML w/ Inspect  <tr class="" id="body175222" valign="top"><td class="comment-details
    //   HTM from source code       <tr valign='top' class='' id='body175014'><td width='150' align='left' class='comment-details
    //window.alert(postID);

//needs move below,  not interfere w/   testHTML =testHTML.replace(new RegExp("class=\"p-foot", "g")," id=foot" + postID + " class=\"p-foot");//matching foot ID now...

    //???????????????????????????????????????????????????????????????
     //works,  but would need more code,  etc
    //document.getElementById('foot175054').innerHTML='zetaaaaaaaaaaaaaaa';
   //testHTML =testHTML.replace(new RegExp("class=\"p-foot", "g")," id=foot175054 class=\"p-foot");//<P>hides
//https://torrentgalaxy.to/forum/perma/175054/Test-image-post-thread-for-members
    //???????????????????????????????

    ////////////////////////////////////////////

//document.getElementById('foot" + postID + "').innerHTML='November testing';

    //lots changing,   bit not what we want :/ testHTML =testHTML.replace(new RegExp("<tr class=\"p-foot\"><td width=\"150\" align=\"center\"><a href=\"forums.php", "g"),"<tr class=\"p-foot\"> MERGING  >>>>>>>>>>  <td width=\"150\" align=\"center\" ><a   onclick=\"  $('#body174858').append('<tr><td >not quite?</td></tr>');  $('#body174858').css('background-color', '#777');   this.style.backgroundColor='green';  document.getElementById('testinghmm').innerHTML='<li>Liked! yesssssssss</li><iframe scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/forums.php");//.PHP not found lol   <P>hides
    //ng         testHTML =testHTML.replace(new RegExp("<tr class=\"p-foot\"><td width=\"150\" align=\"center\"><a href=\"forums.php", "g"),"<tr class=\"p-foot\"><td width=\"150\" align=\"center\" ><a   onclick=\"document.getElementById('foot" + postID + "').innerHTML='November testing'; this.style.backgroundColor='blue'; document.getElementById('testinghmm').innerHTML='<li>yesssssssss</li><iframe scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/forums.php");//.PHP not found lol   <P>hides

   //yess  works >>>               testHTML =testHTML.replace(new RegExp("<tr class=\"p-foot\"><td width=\"150\" align=\"center\"><a href=\"forums.php", "g"),"<tr class=\"p-foot\"><td width=\"150\" align=\"center\" ><a   onclick=\"setTimeout(function(){ document.getElementById('foot" + postID + "').innerHTML='+1 &nbsp;<img src=https://i.imgur.com/xxtKctj.gif height=53px>'; }, 5000); document.getElementById('foot" + postID + "').innerHTML='+1 &nbsp;<img src=https://i.imgur.com/oxA5BO9.gif height=53px>';          * <font face=Helvetica size=4><b>+1</b></font> &nbsp;          <b>+1</b> &nbsp;<img src=https://i.imgur.com/oxA5BO9.gif height=22px> &nbsp; &nbsp;           *                 this.style.backgroundColor='blue'; document.getElementById('testinghmm').innerHTML='<li>yesssssssss</li><iframe scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/forums.php");//.PHP not found lol   <P>hides

    testHTML =testHTML.replace(new RegExp("<tr class=\"p-foot\"><td width=\"150\" align=\"center\"><a href=\"forums.php", "g"),"<tr class=\"p-foot\" style=background-color:white;><td width=\"150\" align=\"center\" ><a   onclick=\"setTimeout(function(){ window.document.getElementById('foot" + postID + "').innerHTML='<img src=https://i.imgur.com/JttcpZe.png height=22px style=padding-right:5px><img src=https://i.imgur.com/9IxBGOA.gif height=22px style=padding-right:25px>'; }, 2500); window.document.getElementById('foot" + postID + "').innerHTML='<img src=https://i.imgur.com/JttcpZe.png height=22px style=padding-right:5px><img src=https://i.imgur.com/oxA5BO9.gif height=22px style=padding-right:25px>';   window.document.getElementById('testinghmm').innerHTML='<li>yesssssssss</li><iframe scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/forums.php");//.PHP not found lol   <P>hides
    //aha,  this needs to match default bg color  white   style=background-color:#dddccc;


    //Order of Operations**********
    /// moved here (after)                                                                                                                                                          MERGING  >>>>>>>>>>                                                            #556b2ffinal textPost Liked !  setTimeout(function(){ alert(`Hello`); }, 1000);&nbsp; &nbsp;

    //orig but not good
    //testHTML =testHTML.replace(new RegExp("class=\"p-foot", "g")," id=foot" + postID + " class=\"p-foot");//matching foot ID now...

    //bugfix on our part maybe,         added ID to wrong spot  <TR  vs  <td

    //needs more specific,   ofc :/ p-foot"><td                       id=foot" + postID + "
  //ng  testHTML =testHTML.replace(new RegExp("class=\"p-foot\"><td ", "g"),"class=\"p-foot\">hmmmmmmmmmmmmmm<td id=foot" + postID + " ");//more DIRECT target      matching foot ID now...

      //ngtestHTML =testHTML.replace(new RegExp("class=\"p-foot\" style=\"background-color:white;\"><td ", "g"),"class=\"p-foot\">hmmmmmmmmmmmmmm<td id=foot" + postID + " ");//more DIRECT target      matching foot ID now...







//yesssssssssssssssss,  more specific   targeted different element,  worksssss

//fkn hell,   above MUST match above code essentially,     v  had 2 spaces (above) not 1  /facepalm                hmmmmmmmmmmmmmm
    testHTML =testHTML.replace(new RegExp("class=\"p-foot\" style=background-color:white;><td ", "g"),"class=p-foot><td id=foot" + postID + "  ");//more DIRECT target      matching foot ID now...
                                        //aha,   no double quotes here

    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // yes,  DEBUGGING TOOL,   finds actual code
    //var mynamePart = testHTML.split("p-foot")[1].split("Like")[0]; // nooooo >> <small>Posted atpageid = (url after "&page=") - (the rest of the url starting from #)
              //
    //
    //
    //window.alert(mynamePart);
    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


    //aha,  flippin code is different,  Edit HTML thingy <tr class="p-foot" style="background-color:white;"><td width="150" align="center"><a onclick="setTimeout
    //???????????????????????????????????????????????????????????????

    //Unicode has the following zero-width characters:

  //  U+200B zero width space
//    U+200C zero width non-joiner Unicode code point
    //U+200D zero width joiner Unicode code point
  //  U+FEFF zero width no-break space Unicode code point

//To remove them from a string in JavaScript, you can use a simple regular expression:

//<i class='fas fa-thumbs-up'>&zwnj;&zwnj;</i> Like</a>
//forums fked up geez
    testHTML =testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
    testHTML =testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
    testHTML =testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');

                                            //class='btn btn-default btn-xs' ><i class='fas fa-thumbs-up'>&zwnj;</i> Like</a> <span
                                             //err,  and a space added pffft

    //window.document.getElementById('testinghmm').innerHTML='<li>yesssssssss</li><iframe scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/forums.php?action=viewtopic&amp;topicid=1174&amp;page=17&amp;like=180705#post180705" class="btn btn-default btn-xs"><i class="fas fa-thumbs-up">‌‌‌></iframe>'</i>hmmmmmmmmmmmmm PENDING....</a> <span class="label

    //now add visuals
//old ng now    testHTML =testHTML.replace(new RegExp("\" class=\"btn btn-default btn-xs\" ><i class=\"fas fa-thumbs-up\"><\/i> Like<\/a>", "g"),"></iframe>'\" class=\"btn btn-default btn-xs\" ><i   class=\"fas fa-thumbs-up\"><\/i>hmmmmmmmmmmmmm PENDING....<\/a>");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger

     testHTML =testHTML.replace(new RegExp("\" class=\"btn btn-default btn-xs\"><i class=\"fas fa-thumbs-up\"><\/i> Like<\/a>", "g"),"></iframe>'\" class=\"btn btn-default btn-xs\" ><i   class=\"fas fa-thumbs-up\"><\/i> PENDING....<\/a>");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger


    //window.document.getElementById('testinghmm').innerHTML='<li>yesssssssss</li><iframe scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/forums.php?action=viewtopic&amp;topicid=1768&amp;page=last&amp;like=182962#post182962></iframe>'" class="btn btn-default btn-xs" ><i   class="fas fa-thumbs-up"></i>hmmmmmmmmmmmmm PENDING....


    //nope//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
//off  actually triggered once    onclick=alert('nopeeeeee');

//alert(testHTML);

            //remove extra bit if Xmas threwad, etc
            //<strong>Post liked by (last 30 shown) - </strong>
                    //ng   testHTML.match(/\.and\./)
//ng            testHTML =testHTML.replace(new RegExp(" \(last 30 shown\)>", "g"),"");
         //ng   testHTML =testHTML.replace(new RegExp(/ (last 30 shown)>/, "g"),"");

    //confirm as Liked ?
//old                          if (testHTML.match(/>Post liked by - </)) { // check ONLY Post Liked bit, etc Topics with unread posts
                          if (testHTML.match(/>Post liked by /)) { // check ONLY Post Liked bit, etc Topics with unread posts

                              //                  ><small><strong>Post liked by - </strong></small> <span
 //old                              mynamePartLiked = testHTML.split(">Post liked by - <")[1].split("</table>")[0]; // nooooo >> <small>Posted atpageid = (url after "&page=") - (the rest of the url starting from #)
                                mynamePartLiked = testHTML.split(">Post liked by ")[1].split("</table>")[0]; // nooooo >> <small>Posted atpageid = (url after "&page=") - (the rest of the url starting from #)
              //
                            //  window.alert(mynamePartLiked);

//>SweetSkunk</span>

  //static                    if (mynamePart.match(/SweetSkunk/)) { // will need dyanmaic  haha           Topics with unread posts
                              if (mynamePartLiked.match(myUserName)) { // yesssssssssss will need dyanmaic  haha           Topics with unread posts

                              //    window.alert('aha, liked');
                                  //will need workLike WORKING w/ NEW CODEFIXLike
                                  testHTML =testHTML.replace(new RegExp(" PENDING....", "g")," <font style=visibility:hidden>AHA</font>&nbsp;<font color=gray>Liked !</font>");//x2 PLACES **********    AHA,  Liked already ! Liked *w/ RESTORED CODEsweet,  TGX does not even show
                                                      // reason for >AHA&nbsp;Liked !<       was for intitial spacingstyle=visibility:hidden
                              }
                          }




    /////////////////////////////////////////////////////////////
//alert(testHTML);

//works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);

}//  if (testHTML.match(/ - post moderated by </){


});

//MAYBE this is way togo....... https://torrentgalaxy.to/forums.php?like=174308
    //like function works,,  redirects to main forum page    (but SKIP  loading all pictures,  etc  on thread   niceeeeeeeeeeeeeeee)
    //then dont see,   blah blah  loading etc





        //                        testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
          //                      testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides

   //nn
        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 1900');
        }//showAlerts

 //ng   $("body").html(function () {
 //ng   return $("body").html().replace("Posted", "ahaaaaaaaaaaaaaaaaaaaPosted");
//ng});



    //
     //   $('.logo navbar-brand').css('background-color', '#dddccc');
       // $('.nav navbar-nav').css('background-color', '#dddccc');
      //  $('.collapse navbar-collapse usermenubuttons').css('background-color', '#dddccc');
        //$('#headnew').css('background-color', '#dddccc');






    //    $('#canvas_container').css('align', 'left');
                //works lol

//REMOVED, TBD  $('#canvas_container').css('overflow', 'hidden');

//cause slight jumping,  cause some icons bigger than others


 //REMOVED, TBD  SS   $('.td3a077e52c664f5578ca0cd5927740d5').css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)
    //
   //
   // $('.td3a077e52c664f5578ca0cd5927740d5').css('visibility', 'hidden');//not bad too much space

    //was in x2 places
   //$(".td3a077e52c664f5578ca0cd5927740d5").css('display', 'none');
   //$(".td3a077e52c664f5578ca0cd5927740d5").css('visibility', 'hidden');




     //     $('#canvas_container').css('width', '100px');
    // $('#canvas_container').append('<P>hmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm<P>');
//



//buggy atm,    run at end for now    **needs togggle
//alert('b4 buggy bit');
//******************************************************************************
        //$("p").replaceWith( "<b>Testing...</b><BR>" );//buggy on PACMAN page    hmmmmmmmmmmmmm
      //
//alert('after buggy bit');

 //   $( "body" ).append( "<b>Testing...hmmmmmmmmmmmmmmmm  .................................................................................................................................................... PAGE COMPLETE ???<P><BR><P></b>" );//Paragraph.









  //REMOVED, TBD       $( "body" ).append( "<center><b>PAGE TESTING IN 0.01s<P><BR><P></b></center>" );//Paragraph.




        //if class,   this seems to be only way          (reminds of WWT  for each in class, etc.  way)
//////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){

//buggy , but ok if SPECIFIC to certain text/page
    $("div.panel-heading").each(function(index, posttttt){
                                                                        //no help   $("h3.panel-title").each(function(index, posttttt){
     //   alert("SUSPECT 1");yes triggers buch of times
          testHTML = $(posttttt).html();
          testHTML=testHTML.replace(new RegExp(">Error: Delete post<", "g"),">Alert: Delete post<");//<font color=gray></font>auto-expand images   show pics by default

if (testHTML.match(/>Alert: Delete post</)) { //known bug,  careful
    $(posttttt).html(testHTML);
            //nn    $(posttttt).css('background-color', 'yellow');//blackiz finding target,   but this green does not show ,  geeeeeeez, hmm

}//end known bug

});

    //////////////////////////////////////////////////////////

//////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.slidingDivf-05f60128d156e7eb31f04d89635c54f665174b1b").each(function(index, posttttt){

    //    alert("SUSPECT 2");
    testHTML = $(posttttt).html();
     //     testHTML=testHTML.replace(new RegExp("Error\: Delete Post", "g"),"Warning");//auto-expand images   show pics by default
//    h=h.
    testHTML=testHTML.replace(new RegExp("here<\/a> if you are sure.", "g"),"here if you are sure.<P><img  src='https://i.imgur.com/lwaxcFf.jpg?1' width=100% height=205><\/a>");//hides

    $(posttttt).html(testHTML);
});

    //////////////////////////////////////////////////////////

  //ok  is actually fine triggers yes w/ above code
  //  alert("SUSPECT 2 was likely,                         yes alert here");









//NotNeo code snippet below

//END //NotNeo code snippet




};//if (window.location.href.match(/forums.php/)) { //  forums
//###########################################################################################//
//###########################################################################################//



//alert('yes 1923');

  //  alert('anything??');





 //template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/onliners/)) { //  /onliners

    //get it

    //change it
    //<div id="k63623b3c0" style="display: block;"><br>
				//<img class="img-responsive" style="max-width:300px;max-height:300px;" src="https://media.tenor.com/images/705d4a7513652689e2942a01e4a65521/tenor.gif" alt="" border="0"></div>

    //   need dynamic          td3a077e52c664f5578ca0cd5927740d5
//       $('.t3709e35d5c3e631ba3f9caed16c1f93c').css('visibility', 'hidden');//'display', 'none'
         $('.' + dynamicClass).css('visibility', 'hidden');//'display', 'none'

        //if class,   this seems to be only way          (reminds of WWT  for each in class, etc.  way)
//////////////////////////////////////////////////

    $("div.namebadge").each(function(index, posttttt){
   //ng div.ubposttablediv.ubcell
        //<div class='tprow'><div class='tpcell cellguard'>
//tessssss alert('hmm');//<div class='ubposttable'><div class='tprow'><div class='ubcell'><small>by</small>

    testHTML = $(posttttt).html();

  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');
   //show for ALL eventiually
    //shield
    //dunno
        testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default

        //not remove all teal box size=5
        //class='btn btn-info2 btn-xs'><i class='fas fa-paint-brush'></i> Go to user art

    //step 3  (overwrite cureent HTLML  w/ mod HTML)
//works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
        $(posttttt).css('height', '31px');//31px vs 29px miok, Deep   iz finding target,   but this green does not show ,  geeeeeeez, hmm

});

    //////////////////////////////////////////////////////////

//magnet mods moved
};//if (window.location.href.match(/onliners/)) { //
//###########################################################################################//
//###########################################################################################//





 //template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/staff/)) { //  /staff

    //get it

    //change it
    //<div id="k63623b3c0" style="display: block;"><br>
				//<img class="img-responsive" style="max-width:300px;max-height:300px;" src="https://media.tenor.com/images/705d4a7513652689e2942a01e4a65521/tenor.gif" alt="" border="0"></div>

     //  $('.td3a077e52c664f5578ca0cd5927740d5').css('visibility', 'hidden');//'display', 'none'
     $('.' + dynamicClass).css('visibility', 'hidden');//'display', 'none'
    //override it




//nope #panelmain
    historyHTML = $(".slidingDivf-c0d72e9770302803e84776ab14281d588384e5e6").html();//get
     //   historyHTML=historyHTML.replace(new RegExp("display: none;", "g"),"");//auto-expand images   show pics by default

  historyHTML=historyHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  historyHTML=historyHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  historyHTML=historyHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');
    //shield
        historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default


    //<i class='fas fa-neuter' style='font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;' title='Torrent officer'>

//works  but now dont even need  X close   button      works w/ proper code lol
       $(".slidingDivf-c0d72e9770302803e84776ab14281d588384e5e6").html(historyHTML);//set


     //
  //  $('.slidingDivf-c0d72e9770302803e84776ab14281d588384e5e6').css('background-color', 'green');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)





};//if (window.location.href.match(/\/staff/)) { //  /staff
//###########################################################################################//
//###########################################################################################//






 //template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/profile/)) { //  /profile

 //helpfulto see color
 //     $('.table-hover').css('background-color', 'green');//

    //change it
    //<div id="k63623b3c0" style="display: block;"><br>
				//<img class="img-responsive" style="max-width:300px;max-height:300px;" src="https://media.tenor.com/images/705d4a7513652689e2942a01e4a65521/tenor.gif" alt="" border="0"></div>


    //override it


//***********************NOTE****
 //this code causes error/ stops  if not exist     var historyHTML = $(".slidingDivf-c0d72e9770302803e84776ab14281d588384e5e6").html();//get

//nope #panelmain
 //ng no show other tabs   var historyHTML = $(".tab-pane").html();//get
     historyHTML = $(".table-hover").html();//get

    //<table class="table-hover table-striped"
    //   historyHTML=historyHTML.replace(new RegExp("display: none;", "g"),"");//auto-expand images   show pics by default
                                        //quick fix
  historyHTML=historyHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  historyHTML=historyHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  historyHTML=historyHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');

    //shield
        historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default
//alert('hmm');


    //<i class='fas fa-neuter' style='font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;' title='Torrent officer'>

//works  but now dont even need  X close   button      works w/ proper code lol
       $(".table-hover").html(historyHTML);//set
  //   $('.table-hover').css('background-color', 'green');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)

/////////////////////////////////////////////////////

    //hmm  need dynamic target :

      //
    //geez,  2 diff views here aswell:/  account vs. public view
    //but only need if public view ;]

// <div class="panel-body slidingDivf-cf43f9abcd944ecbe5c4fec1aa4f2cf14015373f">

//should always exist,   iz just dynamic ;]
        code = h.split("panel-body slidingDivf-")[1].split("\">")[0]; //pageid = (url after "&page=") - (the rest of the url starting from #)
// alert(code);//cf43f9abcd944ecbe5c4fec1aa4f2cf14015373f
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        $("div.slidingDivf-" + code).each(function(index, posttttt){

            testHTML = $(posttttt).html();


    //x2 places   (threads + profiles)
    //fix broken profile avy

    //still broken pic on profile  :(             will need diff code for profiles :/
    //https://torrentgalaxy.to/profile/Angelina
    testHTML =testHTML.replace(new RegExp("https://img.picturegalaxy.org/static/default-avatar.jpg", "g"),"https://i.imgur.com/NC5pJVl.jpg");//hides

//broken avy fix   niceeeeeee
    testHTML =testHTML.replace(new RegExp("https://i.ibb.co/bjhp1Wt/ezgif-4-dcdd78770a05.gif", "g"),"https://i.imgur.com/PF2Dv4X.gif");//angelina


    //user-specific array >>
         if (myUserName.match(/SweetSkunk/)
          || myUserName.match(/SweetSkunk/)) { //SS only  match tagwords of sorts

    // sry very flashy :/
    testHTML =testHTML.replace(new RegExp("https://media2.giphy.com/media/uZszvSyzCUrfO/giphy.gif", "g"),"");//zzzzzzz&nbsp; hides
    testHTML =testHTML.replace(new RegExp("https://picturegalaxy.org/images/2020/06/24/FECZcdea998d78f1c6ee.gif", "g"),"https://i.imgur.com/PQbV2sQ.gif");//<P>hides
    testHTML =testHTML.replace(new RegExp("https://media1.giphy.com/media/RHlm0r4VlDCgg/giphy.gif", "g"),"offhttps://i.pinimg.com/236x/15/8d/da/158dda701fd0719ad87c715ae0652446--phones-fun-stuff.jpg");//<P>hides
    testHTML =testHTML.replace(new RegExp("https://i.imgur.com/wrns905.gif", "g"),"https://i.imgur.com/TbPA5Gc.png");//<P>hides

         }//SS only




     //   testHTML=testHTML.replace(new RegExp("Ghost", "g"),"ghosttttttttt");//auto-expand images   show pics by default
       //   testHTML=testHTML.replace(new RegExp("Skunk", "g"),"skunkkkkkkkkkkkk");//auto-expand images   show pics by default
     $(posttttt).html(testHTML);
    //    $(posttttt).css('background-color', 'green');//iz finding target,   but this green does not show ,  geeeeeeez, hmm

});

    //?????????????????????????????????????????????


//aha User details for Ghost.....<a data-toggle="collapse roleup" style="cursor:pointer" class="showHide" id="f-cf43f9abcd944ecbe5c4fec1aa4f2cf14015373f"></a></h3>
 //       </div>
   //     <div class="panel-body slidingDivf-cf43f9abcd944ecbe5c4fec1aa4f2cf14015373f">


  //profile 'tabs' not exist lol   testHTML = $("#profile").html();//get
    //$("#profile").html();//get
 //ng   testHTML = $("#panelmain").html();//get      same for both type acccts ??


//  profile
//    $("#panelmain").html(testHTML);//set
 //left sidebar only   $("#panelmain").css('background-color', 'gray');

    //    $("#panelmain").html();//get      same for both type acccts ??






  ////////////////////////////////////////////////////
//okalert('hmmmmmm');//

//bigj only  fkkkkkkkkkkk    $('.slidingDivf-82d219671535e365307775003326b5bb3a494b36').css('background-color', 'gray');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)
  //big target & would need dynamic  $('.slidingDivf-5156d71a9e1f0d22a5e9ff5024f2361733ff0a46').css('background-color', 'gray');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)

        //if class,   this seems to be only way          (reminds of WWT  for each in class, etc.  way)
//////////////////////////////////////////////////
 if (9==0) {//not very effective,  better below code
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.ubposttable").each(function(index, posttttt){
   //ng div.ubposttablediv.ubcell
        //<div class='tprow'><div class='tpcell cellguard'>
//tessssss alert('hmm');//<div class='ubposttable'><div class='tprow'><div class='ubcell'><small>by</small>

    testHTML = $(posttttt).html();

   //show for ALL eventiually
  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');
    //shield
    //dunno
        testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default

        //not remove all teal box size=5
        //class='btn btn-info2 btn-xs'><i class='fas fa-paint-brush'></i> Go to user art

    //step 3  (overwrite cureent HTLML  w/ mod HTML)
//works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
    $(posttttt).css('background-color', 'blue');//iz finding target,   but this green does not show ,  geeeeeeez, hmm

});
 }; //off
    //////////////////////////////////////////////////////////



    //MULTIPLE TARGETS on user wall :/

    //this is BETTER TARGET ;}

        //if class,   this seems to be only way          (reminds of WWT  for each in class, etc.  way)
//////////////////////////////////////////////////
    //same as below concept

   // $("div.f-post").each(function(index, posttttt){
    $("div.ubcell").each(function(index, posttttt){//yes      found "proper" target
   //ng div.ubposttablediv.ubcell
        //<div class='tprow'><div class='tpcell cellguard'>
//tessssss alert('hmm');//<div class='ubposttable'><div class='tprow'><div class='ubcell'><small>by</small>

     testHTML = $(posttttt).html();

                                        //quick fix
  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');

   //show for ALL eventiually
    //shield
    //dunno
        testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default
//not yet        testHTML=testHTML.replace(new RegExp("on <strong>2020-", "g"),"<strong>");//align right is ok  maybe?

        //not remove all teal box size=5
        //class='btn btn-info2 btn-xs'><i class='fas fa-paint-brush'></i> Go to user art

    //step 3  (overwrite cureent HTLML  w/ mod HTML)
//works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
//yes$(posttttt).css('background-color', 'silver');//iz finding target,   but this green does not show ,  geeeeeeez, hmm

});

    //////////////////////////////////////////////////////////




//////////////////////////////////////////////////
    //same as below concept, slight diff

          

   // $("div.f-post").each(function(index, posttttt){
    $("div.tpcell").each(function(index, posttttt){//yes      found "proper" target
   //ng div.ubposttablediv.ubcell
        postcount=postcount+1;
        //<div class='tprow'><div class='tpcell cellguard'>
//tessssss alert('hmm');//<div class='ubposttable'><div class='tprow'><div class='ubcell'><small>by</small>

     testHTML = $(posttttt).html();


   //show for ALL eventiually
if (postcount<=1) {
        // auto-expand 1st imageONLY ?
        testHTML=testHTML.replace(new RegExp("display: none;", "g"),"");//NOT display:none;  needs space :/
}//1st post
        //may need "1st post with pic"  lol

   //ng kinda wonky     testHTML=testHTML.replace(new RegExp("onmouseout", "g"),"offffonmouseout");//keep pic showing


    //step 3  (overwrite cureent HTLML  w/ mod HTML)
//works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
//yes
     //   $(posttttt).css('background-color', 'silver');//iz finding target,   but this green does not show ,  geeeeeeez, hmm

});

    //////////////////////////////////////////////////////////


//recommendatuions


//////////////////////////////////////////////////
    //same as below concept, slight diff



   // $("div.f-post").each(function(index, posttttt){
    $("div.panel-body").each(function(index, posttttt){//yes      found "proper" target

     testHTML = $(posttttt).html();

        if (testHTML.match(/goldenrod/)) { //  account.php
       //     alert('goldenrod');
                                        //quick fix
  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');

   //show for ALL eventiually
    //shield
    //dunno
        testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default
//not yet        testHTML=testHTML.replace(new RegExp("on <strong>2020-", "g"),"<strong>");//align right is ok  maybe?

        //$(posttttt).css('background-color', 'silver');
        }//goldenrod
    //   testHTML=testHTML.replace(new RegExp("onmouseout", "g"),"offffonmouseout");//keep pic showing


        $(posttttt).html(testHTML);
//yes
     //  //iz finding target,   but this green does not show ,  geeeeeeez, hmm

});

    //////////////////////////////////////////////////////////











};//if (window.location.href.match(/\/profile/)) { //  /profile
//###########################################################################################//
//###########################################################################################//





 //template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/account.php/)) { //  account.php

 //helpfulto see color
 //     $('.table-hover').css('background-color', 'green');//


//nope #panelmain
 //ng no show other tabs   var historyHTML = $(".tab-pane").html();//get
    historyHTML = $(".table-hover").html();//get

    //<table class="table-hover table-striped"
    //   historyHTML=historyHTML.replace(new RegExp("display: none;", "g"),"");//auto-expand images   show pics by default

  historyHTML=historyHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  historyHTML=historyHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  historyHTML=historyHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');
    //shield
        historyHTML=historyHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default



    //<i class='fas fa-neuter' style='font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;' title='Torrent officer'>

//works  but now dont even need  X close   button      works w/ proper code lol
       $(".table-hover").html(historyHTML);//set
  //   $('.table-hover').css('background-color', 'green');//.css('display', 'none');//this is good,  but bit tight  lol  (adding mod below)

/////////////////////////////////////////////////////






};//if (window.location.href.match(/account.php/)) { //  account.php
//###########################################################################################//
//###########################################################################################//

        if (showAlerts == "YES") {//quick toggle
        //
            alert('line 2400');
        }//showAlerts


 //template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/torrent\//)
   || window.location.href.match(/comments.php/)
   || window.location.href.match(/torrents-details.php/)) { //  torrent desc pages    (w/ comments)

    //https://torrentgalaxy.to/torrent/14203553/Black-Beauty-2020-720p-DSNP-WEBRip-800MB-x264-GalaxyRG
    //https://torrentgalaxy.to/comments.php?type=torrent&id=14198815
    //https://torrentgalaxy.to/torrents-details.php?id=14198815

    //aha ,   3 diff type urls

//alert('aha 3 diff pages');

    ///////////////////////??
    //preview links  to iframe ??

    //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.container-fluid").each(function(index, posttttt){
   //yessssssss


     testHTML = $(posttttt).html();

    //user-specific array >>
         if (myUserName.match(/SweetSkunk/)) { //SS only  match tagwords of sorts


        //atm  mainly for NoisyBoy  descriptions
//  //<a href='https://22pixx.xyz/i-o/2020/12/04/5fc99074ab993.jpeg.html' target='_blank'>
    //         https://22pixx.xyz/i-o/2020/12/04/5fc99074ab993.jpeg.html</a>


     //   alert('aha');//7 of them  ........ more than 1 ofc
        //need some code to be more specific
             if (testHTML.match(/jpeg.html/)){//links to ext sites

//$(posttttt).css('background-color', '#dddccc');// gray     target   1 of 7 targets w/  same class ;)


// testHTML =testHTML.replace(new RegExp("xyz", "g"),"xyzzzzzzzzzzzzzzzzzzzzzzz");//yessssssssssss background-color: #dddccc;

                 //maybe no scroll  dunno
testHTML =testHTML.replace(new RegExp("<a href=\"", "g"),"<IFRAME    scrolling=no       style=' border-radius:5px;'   width=100% height=622px         src=\"");//kentk9//yes, large  torrent comments
testHTML =testHTML.replace(new RegExp(".jpeg.html<\/a>", "g"),".jpeg.html<\/IFRAME>");//kentk9//yes, large  torrent comments
    }

         }





 //works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
});

    //////////////////////////////////////////////////////////



    ///////////////////////??






    //torrent comments
    //<div class="panel-body slidingDivf-5f7fe0281e6fc6e2e9dadd1f144b12a3d7a14e2f">


    //not sure if ok here
    // $('.td3a077e52c664f5578ca0cd5927740d5').css('visibility', 'hidden');//.css('display', 'none');//this is good,
     $('.' + dynamicClass).css('visibility', 'hidden');//'display', 'none'
    //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.slidingDivf-5f7fe0281e6fc6e2e9dadd1f144b12a3d7a14e2f").each(function(index, posttttt){
   //yessssssss


     testHTML = $(posttttt).html();

//alert('aha');
        //oooh,  few mods w/ torrent comments
        //    testHTML =testHTML.replace(new RegExp("https://img.picturegalaxy.org/static/default-avatar.jpg", "g"),"https://i.imgur.com/NC5pJVl.jpg");//hides
    //testHTML =testHTML.replace(new RegExp("https://img.picturegalaxy.org/static/default-avatar.jpg", "g"),"https://i.imgur.com/NC5pJVl.jpg");//hides

testHTML =testHTML.replace(new RegExp(">Guest user<", "g"),"><");//hides

    //<h5>Reppoints: <span class='label label-danger'>-100</span>
testHTML =testHTML.replace(new RegExp("label-danger\">-100<", "g"),"label-default\"> &nbsp; &nbsp; &nbsp; 0 <");//yesssssssssss+100hides

testHTML =testHTML.replace(new RegExp("color:#e576e6;\">Guest-", "g"),"color:#666666;\">Guest-");//hides
testHTML =testHTML.replace(new RegExp("profileadult", "g"),"profile");//pink border
testHTML =testHTML.replace(new RegExp("<tr><td width=\"150px\"><center>", "g"),"<tr><td width='150px' valign=top><center>");//kentk9//yes, large  torrent comments

        ////////////////////////////////////////

        //brb
  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');
    //shield
        testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default



   //show for ALL eventiually
    //maybe rotate  hehe https://i.imgur.com/mRbBrVT.png https://i.imgur.com/nNe4jGv.png
   //pending
    //    testHTML=testHTML.replace(new RegExp("", "g"),"");//https://i.imgur.com/lsw3Uib.pngwow, nice Ange1
  //initial test testHTML =testHTML.replace(new RegExp("https://i.imgur.com/wrns905.gif", "g"),"https://i.imgur.com/TbPA5Gc.png");//sorry GR


    //x2 places   (threads + profiles)
    //fix broken profile avy

    //still broken pic on profile  :(             will need diff code for profiles :/
    //https://torrentgalaxy.to/profile/Angelina
    testHTML =testHTML.replace(new RegExp("https://img.picturegalaxy.org/static/default-avatar.jpg", "g"),"https://i.imgur.com/NC5pJVl.jpg");//hides

//broken avy fix   niceeeeeee
    testHTML =testHTML.replace(new RegExp("https://i.ibb.co/bjhp1Wt/ezgif-4-dcdd78770a05.gif", "g"),"https://i.imgur.com/PF2Dv4X.gif");//angelina

        //pink anon button  #e576e6;border-color:#e576e6;">Add comment<input style="display: none;" type="submit" value="Add comment"></label>
    testHTML =testHTML.replace(new RegExp("#e576e6", "g"),"#666666");//angelina

    //user-specific array >>
         if (myUserName.match(/SweetSkunk/)
          || myUserName.match(/SweetSkunk/)) { //SS only  match tagwords of sorts

    // sry very flashy :/
    testHTML =testHTML.replace(new RegExp("https://media2.giphy.com/media/uZszvSyzCUrfO/giphy.gif", "g"),"");//zzzzzzz&nbsp; hides
    testHTML =testHTML.replace(new RegExp("https://picturegalaxy.org/images/2020/06/24/FECZcdea998d78f1c6ee.gif", "g"),"https://i.imgur.com/PQbV2sQ.gif");//<P>hides
    testHTML =testHTML.replace(new RegExp("https://media1.giphy.com/media/RHlm0r4VlDCgg/giphy.gif", "g"),"offhttps://i.pinimg.com/236x/15/8d/da/158dda701fd0719ad87c715ae0652446--phones-fun-stuff.jpg");//<P>hides
    testHTML =testHTML.replace(new RegExp("https://i.imgur.com/wrns905.gif", "g"),"https://i.imgur.com/TbPA5Gc.png");//<P>hides

         }//SS only

  //
    //    $(posttttt).css('background-color', 'green');

 //works    $(posttttt).text('*** need to TARGET specific posts / HTML content,   instead of entire page ***');
    $(posttttt).html(testHTML);
});

    //////////////////////////////////////////////////////////


//yet another place lol

    //////////////////////////////////////////////////
    //same as below concept
   // $("div.f-post").each(function(index, posttttt){
    $("div.limitwidth").each(function(index, posttttt){
   //yessssssss


     testHTML = $(posttttt).html();

//alert('aha');
  testHTML=testHTML.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  testHTML=testHTML.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  testHTML=testHTML.replace(/[\u200C-\u200D\uFEFF]/g, '');

//alert('b4 rod');

    //shield
        testHTML=testHTML.replace(new RegExp("<i class=\"fas fa-neuter\" style=\"font-size:12px;color:goldenrod;padding-left:1px;padding-right:1px;\" title=\"Torrent officer\"><\/i>", "g"),"<img  title=\"Torrent officer\" src=https://picturegalaxy.org/images/2020/11/17/TO-Shield89f7317d739d4744.png height=15px width=15px style=padding-bottom:2px;>");//auto-expand images   show pics by default

//
    //
       // $(posttttt).css('background-color', 'gray');
      //   $(posttttt).css('padding', '10px');//'req'd to see bg color  aha
     $(posttttt).html(testHTML);
});

    //////////////////////////////////////////////////////////

};//if (window.location.href.match(/account.php/)) { //  account.php
//###########################################################################################//
//###########################################################################################//





//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/account.php/)) { //
///////////////////////////////////
//my uploads.
                    historyHTML = $("#torrents").html();//get
                   //
    historyHTML=historyHTML.replace(new RegExp("/common/images/health/health_0.gif\"", "g"),"https://i.imgur.com/AgDYHGd.jpg\" width=59 ");//hides
    historyHTML=historyHTML.replace(new RegExp("color:green", "g"),"visibility:hidden");//hides
    //historyHTML=historyHTML.replace(new RegExp("/common/images/health/health_0.gif\"", "g"),"https://i.imgur.com/AgDYHGd.jpg\" width=59 ");//hides
    historyHTML=historyHTML.replace(new RegExp("<font color=\"#ff0000\">", "g"),"<font style=\"visibility:hidden\">");//hides


historyHTML=historyHTML.replace(new RegExp(">0</a></font></td>", "g"),"><font size=5 style=visibility:hidden;>0</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">1</a></font></td>", "g"),"><font size=5>1</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">2</a></font></td>", "g"),"><font size=5>2</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">3</a></font></td>", "g"),"><font size=5>3</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">4</a></font></td>", "g"),"><font size=5>4</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">5</a></font></td>", "g"),"><font size=5>5</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">6</a></font></td>", "g"),"><font size=5>6</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">7</a></font></td>", "g"),"><font size=5>7</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">8</a></font></td>", "g"),"><font size=5>8</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">9</a></font></td>", "g"),"><font size=5>9</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">10</a></font></td>", "g"),"><font size=5>10</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">11</a></font></td>", "g"),"><font size=5>11</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">12</a></font></td>", "g"),"><font size=5>12</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">13</a></font></td>", "g"),"><font size=5>13</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">14</a></font></td>", "g"),"><font size=5>14</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">15</a></font></td>", "g"),"><font size=5>15</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">16</a></font></td>", "g"),"><font size=5>16</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">17</a></font></td>", "g"),"><font size=5>17</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">18</a></font></td>", "g"),"><font size=5>18</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">19</a></font></td>", "g"),"><font size=5>19</font></a></font></td>");//hides
historyHTML=historyHTML.replace(new RegExp(">20</a></font></td>", "g"),"><font size=5>20</font></a></font></td>");//hides

//
   // $("#torrents").css('background-color', 'green');
             //works  but now dont even need  X close   button      works w/ proper code lol
       $("#torrents").html(historyHTML);//set
///////////////////////////////

};//if (window.location.href.match(/account.php/)) { //
//###########################################################################################//
//###########################################################################################//










//template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/zzzzzzzzzzzzzzzz.php/)) { //


};//if (window.location.href.match(/zzzzzzzzzzzz.php/)) { //
//###########################################################################################//
//###########################################################################################//






    //
//


//moving to very bottom })();//end main function

//alert('yes 2575');


 //   $( "body" ).append( "<b>Testing...hmmmmmmmmmmmmmmmm  .................................................................................................................................................... PAGE COMPLETE ???<P><BR><P></b>" );//Paragraph.

//working link / pic test   for one of last tests   (already liked)

//nice visuals evn some NICE IDEAS >>         $( "body" ).append( "<center><b>PAGE LOADED IN 0.0s<P><BR><P></b><P></center><P><div id=testinghmm  >test div</div><a nnnnooooohref=''  onclick=\"document.title='Loading Lobby...'; document.getElementById('testinghmm').innerHTML='<li>hmm yesssssssss<P><BR></li><iframe scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/lobby.php></iframe>'\"><img style=cursor:pointer;  src=https://i.imgur.com/DtPx4sX.jpg></a><BR><P><BR><P>" );//Paragraph.

//hide all bg stuff,   hope no jump<P>
//REMOVED, TBD  <center><b>PAGE LOADED IN 0.0s<P><BR><P></b><P></center><P>


//even just adding a <BR> changes it ok,  but needs on ALL Pages
       $( "body" ).append( "<BR><div  style=display:none; id=testinghmm ></div>" );//test divParagraph.
//default test links,  etc removed          <a nnnnooooohref=''  onclick=\"document.title='Loading Lobby...'; document.getElementById('testinghmm').innerHTML='<li>hmm yesssssssss<P><BR></li><iframe  style=display:none; scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/lobby.php></iframe>'\"><img style=cursor:pointer;  src=https://i.imgur.com/DtPx4sX.jpg></a><BR><P><BR><P>


//preload like images ??
       $( "body" ).append( "<img style=display:none; src=https://i.imgur.com/JttcpZe.png height=0px><img style=display:none; src=https://i.imgur.com/9IxBGOA.gif height=0px><img style=display:none; src=https://i.imgur.com/oxA5BO9.gif height=0px>" );//test divParagraph.

//idea,  script loaded in 0.003s etc  > moved above w/ lobby     $( "body" ).append( "<center><b><div id=fullclock>PAGE LOADED IN 0.0s</div><P><BR><P></b><P></center>" );//Paragraph.

//static test link  working
//<a nnnnooooohref=''  onclick=\"document.getElementById('testinghmm').innerHTML='<li>hmm yesssssssss</li><iframe scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1690&page=1&like=173867></iframe>'\">

//actual
//tgx source code <tr class='p-foot'><td width='150' align='center'></div><a href='forums.php?action=viewtopic&topicid=98&page=last&like=171929#post171929' class='btn btn-default btn-xs' ><i class='fas fa-thumbs-up'></i> Like</a>



//test holiday pic on sidebar ng 246px<HR><img height=190 src=https://i.ibb.co/LNPhmCM/Ange1-Christmas-gif.gif width=100%>https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1742
//     $( "#panelmain" ).append( "<a title=' Check out TGx 2020 TorrentGalaxy Christmas Banner Competition !! ' href=https://torrentgalaxy.to/forum/perma/179916/2020-TorrentGalaxy-Christmas-Banner-Competition><img src=https://i.imgur.com/yLIyZ3U.png height=60px width=100%></a><center><BR>*<P></center>" );//<HR> style='2px dotted silver'<HR>test divParagraph. style=display:none;
       $( "#panelmain" ).append( "<center><font color=gray>*</font><P></center>" );//<BR><HR> style='2px dotted silver'<HR>test divParagraph. style=display:none;

 //(click here for info)

//onclick="document.getElementById('testinghmm').innerHTML='<li>hmm yesssssssss</li><iframe scrolling=yes width=1000px height=550px src=https://torrentgalaxy.to/forums.php?action=viewtopic&topicid=1690&page=1&like=173867></iframe>'"
//old school  ????????????????????

       $( "body" ).append( "<div  id=ms_elapsed>Time Elapsed..</div><P>" );//<BR>test divParagraph. style=display:none;

       //ng$( "body" ).append( "<iframe src='http://free.timeanddate.com/clock/i7jvdn8b/n3875/szw110/szh110/hoc9b8578/hbw10/hfc754c29/cf100/hnc432f30/fav0/fiv0/mqcfff/mqs4/mql25/mqw12/mqd78/mhcfff/mhs2/mhl5/mhw2/mhd78/mmv0/hhcfff/hhs2/hhl50/hhw8/hmcfff/hms2/hml70/hmw8/hmr4/hscfff/hss3/hsl70/hsw3' frameborder='0' width='110' height='110'>hmmm</iframe>" );//test divParagraph. style=display:none;

//Current “Zulu” Military Time, Time Zone
//
//


var end = +new Date();// log end timestamp
var diff = end - start;
//
//varTimeMS =
    var ModTimeElapsed = (diff/1000)


    //cool, but off for now
//window.document.getElementById('ms_elapsed').innerHTML = '<font size=6 color=black>' + diff + 'ms ~~~ TGX ~~~ ' + ModTimeElapsed.toPrecision(1) + 's<\/font>';

//
//   s="000000000" + s//01,02
  // var mySeconds = s.slice(-2);//last 2 characters:
    var CustomElapsed = ModTimeElapsed + "00000000000";//0.300000000 nn?.toString()
                        ModTimeElapsed = CustomElapsed.slice(0,5);//first 5 ??   -2last 2 characters:float:right;https://torrentgalaxy.to/chathistory.php?action=show
//



//dynamic footer ?


 //if (0==0) { //default atm    tbd custom mods,
//user-specific array >>
                                                       //defined above   var footerMenu = "dunno";//declared here aswell,  hmm......
         if (myUserName.match(/SweetSkunk/)
          || myUserName.match(/SweetSkunk/)) { //"light/minimalist theme(s)"  of sorts


                                                      //custom menu of sorts
                                                              footerMenu = '<a href="/chathistory.php?action=show" class="btn btn-default btn-xs" target="_parent" style="background-color:wheat; height:23px; width:144px; border-color:silver;border-color:wheat; border-color:silver;">History<B></B></a><a href="/forums.php?action=viewunread" class="btn btn-default btn-xs" target="_parent" style="background-color:wheat; height:23px; width:144px; border-color:silver;border-color:wheat; border-color:silver;">Forums<B></B></a><a href="/profile/NoisyBoY/torrents/0" class="btn btn-default btn-xs" target="_parent" style="background-color:wheat; height:23px; width:144px; border-color:silver;border-color:wheat; border-color:silver;">Browse<i></i></a><P><BR>';
         } else {
//background-color:wheat;
                                                              footerMenu = '<a href="https://torrentgalaxy.to/lobby.php" class="btn btn-default btn-xs" target="_parent" style=" height:23px; width:144px; border-color:silver;border-color:wheat; border-color:silver;">Lobby<B></B></a><a href="/forums.php" class="btn btn-default btn-xs" target="_parent" style="b height:23px; width:144px; border-color:silver;border-color:wheat; border-color:silver;">Forums<B></B></a><a href="https://torrentgalaxy.to/torrents.php" class="btn btn-default btn-xs" target="_parent" style=" height:23px; width:144px; border-color:silver;border-color:wheat; border-color:silver;">Browse<i></i></a><P><BR>';
                                                                           //same as site
         }
//forum/perma/179916/2020-TorrentGalaxy-Christmas-Banner-Competition
  window.document.getElementById('ms_elapsed').innerHTML = '<center>' + footerMenu + '* Userscript loaded successfully in ' + ModTimeElapsed + ' seconds<P><a href=https://torrentgalaxy.to/mailbox.php><img src=https://i.imgur.com/P4XEIiT.png style=border-radius:44px; height=69></a><\/center>';
//window.document.getElementById('ms_elapsed').innerHTML = '<center>*SS script completed successfully in ' + diff + 'ms<\/center>';
//setTimeout(function(){ }, 3000);Page loaded
//


  //  alert('yes SCRIPT COMPLETE OK');

            if (showAlerts == "YES") {//quick toggle
        //
            alert('yes SCRIPT COMPLETE OK');
        }//showAlerts


}//if (betaTester = "YES")

    //############################################################################################
    //*********************************************************************************************
    //############################################################################################







//template
//###########################################################################################//
//###########################################################################################//
if (window.location.href.match(/\/galaxychat.php/)) { //run outside of beta testing  req'd
//    alert('hmm');  // (as cannot confirm acct name  hehe )

    //ahhhhh , must check this 1st,
//
//alert(h);

            if (showAlerts == "YES") {//quick toggle
        //
            alert('galaxychat');
        }//showAlerts

    //will have to go old-school,   as there is no HTML / targets
  //
   // if (h=="Nothing to see here.."){//yes works
     if (h.match(/Nothing/) && h.match(/to see here/)) { //  /staff                                                     //Nothing to see here.


         //
        //
      //   alert('Nothing .............. to see here..');
       //crazy bug    http://torrentgalaxy.to:443/forum/perma/181551   links dont work in lobby  if in IFRAME  :/

       //Nothing &zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;to see here..

                                        //quick fix
  h=h.replace(new RegExp("&zwnj;=\"\"", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
  h=h.replace(new RegExp("&zwnj;", "g"),"");//<<x2 PLACES **********        w/ RESTORED CODE x2 places.. must match below test to trigger
  h=h.replace(/[\u200C-\u200D\uFEFF]/g, '');
//alert('b4 rod');


                                h=h.replace(new RegExp("Nothing", "g"),"");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
                                h=h.replace(new RegExp("to see here..", "g"),"<title> Galaxy Chat </title><link rel='shortcut icon' href='https://torrentgalaxy.to/common/favicon/favicon.ico' /><iframe  style=' border-radius:10px; background-color: #dddccc;'  src=https://torrentgalaxy.to/chathistory.php?action=show&chathistorypage=0 width=100% height=99%></iframe>");//https://torrentgalaxy.to/lobby.php<BR><P><BR>  no,  causes scrollhides
//alert(h);
        document.body.innerHTML=h;//set back once, Nothing   careful reverts text back if typing   (same as wwt bs))

    }


};//if (window.location.href.match(/galaxychat.php/)) { //
//###########################################################################################//
//###########################################################################################//






})();//end main function   //moved down here  as part of bugfix

//actually   GREAT tip   (helps how contrast, etc & know when pages firing)
//ahaaaaaaaaaaaaaaaaaaaa, (ALL GOOD)    sometimes code not executing fully ;)
//END


