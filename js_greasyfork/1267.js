// ==UserScript==
// @name         Hide unwanted posters from Warriorsworld Main
// @namespace    hide_unwanted_posters
// @include      http://forums.warriorsworld.net/main/*
// @include      https://forums.warriorsworld.net/main/*
// @author       Originally designed by Jim Barnett (The fake one). Modified by Retired Season Ticket Holder  11-19-15.
// @description  Improve the quality of your life and save time by hiding all posts written by unwanted posters on warriorsworld.net.
// @version 0.0.1.20160206004944
// @downloadURL https://update.greasyfork.org/scripts/1267/Hide%20unwanted%20posters%20from%20Warriorsworld%20Main.user.js
// @updateURL https://update.greasyfork.org/scripts/1267/Hide%20unwanted%20posters%20from%20Warriorsworld%20Main.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  
	var e = $('span:contains(stexen24)');
        var e2 = $('span:contains(Alonzo)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(four touchdowns in a single game)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(GruberGoober)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(TidesHaveTurned)');
        $.merge( e, e2 );
        e2 = $('span:contains(whack jack)');
        $.merge( e, e2 );
        e2 = $('span:contains(mullyasadanoguac)');
        $.merge( e, e2 );
        e2 = $('span:contains(Bout)');
        $.merge( e, e2 );
        e2 = $('span:contains(K@liboog@n)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Showtime)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(2legit2quit)');
        $.merge( e, e2 );
        e2 = $('span:contains(wavey)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(whiteboy)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(ThrowTheBall)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Khoee)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Smedley)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Building Winners)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(NCal Sports on the Rise)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(gswinsider)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(thehella)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Joe Montana)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(LOLakers)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(david®)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(freddean100)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(TheMuss)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(jayfly)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(malachi constant)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(boobs.myers)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Yoda)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(ebrunrick)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Souvlaki)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(fried ankles and nipples)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(BC)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(HeT)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Dubs Faan)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Bob Myers Tan)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(loozballs)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(Pelican)');
        $.merge( e, e2 ); 
        e2 = $('span:contains(lol@del)');
        $.merge( e, e2 );
        e2 = $('span:contains(tchenerdere)');
        $.merge( e, e2 );
        e2 = $('span:contains(The Maestro)');
        $.merge( e, e2 );
        e2 = $('span:contains(Quicky)');
        $.merge( e, e2 );
        e2 = $('span:contains(Goldenshowers)');
        $.merge( e, e2 );
        e2 = $('span:contains(Before Curry)');
        $.merge( e, e2 );
        e2 = $('span:contains(hedron)');
        $.merge( e, e2 );
        e2 = $('span:contains(zwarrior)');
        $.merge( e, e2 );
        e2 = $('span:contains(Maynard)');
        $.merge( e, e2 );
        e2 = $('span:contains(Portal)');
        $.merge( e, e2 );
        e2 = $('span:contains(Bob myers tan the 2nd)');
        $.merge( e, e2 );
        e2 = $('span:contains(gamme)');
        $.merge( e, e2 );
        e2 = $('span:contains(hudon)');
        $.merge( e, e2 );
        e2 = $('span:contains(johnmax)');
        $.merge( e, e2 );
        e2 = $('span:contains(CCW)');
        $.merge( e, e2 );
        e2 = $('span:contains(before clark)');
        $.merge( e, e2 );
        e2 = $('span:contains(Say it Supot Ako)');
        $.merge( e, e2 );
        e2 = $('span:contains(WEGONNABECHAMPIONSHIP)');
        $.merge( e, e2 );
        e2 = $('span:contains(i am CAM)');
        $.merge( e, e2 );
        e2 = $('span:contains(CCGSW)');
        $.merge( e, e2 );
        e2 = $('span:contains(repeat2016)');
        $.merge( e, e2 );
        e2 = $('span:contains(latvianlighting)');
        $.merge( e, e2 );
        e2 = $('span:contains(Dubswith4)');
        $.merge( e, e2 );
        e2 = $('span:contains(GSWSanctuary)');
        $.merge( e, e2 );
        e2 = $('span:contains(The Bay)');
        $.merge( e, e2 );
        e2 = $('span:contains(Hospital ICU Part 2)');
        $.merge( e, e2 );
        e2 = $('span:contains(Central Coast Dubs)');
        $.merge( e, e2 );
        e2 = $('span:contains(Kamote)');
        $.merge( e, e2 );
        e2 = $('span:contains(herb Garden)');
        $.merge( e, e2 );
        e2 = $('span:contains(paco)');
        $.merge( e, e2 );
        e2 = $('span:contains(dentist)');
        $.merge( e, e2 );
        e2 = $('span:contains(Hocus Bogut)');
        $.merge( e, e2 );
        e2 = $('span:contains(nfldiscount)');
        $.merge( e, e2 );
        e2 = $('span:contains(Larlo)');
        $.merge( e, e2 );
        e2 = $('span:contains(El Nino Warriors)');
        $.merge( e, e2 );
        e2 = $('span:contains(Treasure This)');
        $.merge( e, e2 );
        e2 = $('span:contains(herbs Garden)');
        $.merge( e, e2 );
        e2 = $('span:contains(Merritt College)');
        $.merge( e, e2 );
        e2 = $('span:contains(Middle Ring Finger)');
        $.merge( e, e2 );
        e2 = $('span:contains(Dray23)');
        $.merge( e, e2 );
        e2 = $('span:contains(KIDS BE Harrison around here)');
        $.merge( e, e2 );
        e2 = $('span:contains(COCKAIGNE)');
        $.merge( e, e2 );
        e2 = $('span:contains(aigne)');
        $.merge( e, e2 );
        e2 = $('span:contains(Replacement Poster)');
        $.merge( e, e2 );
        e2 = $('span:contains(DocH)');
        $.merge( e, e2 );
        e2 = $('span:contains(MJ2Russ)');
        $.merge( e, e2 );
        e2 = $('span:contains(PrimeTime)');
        $.merge( e, e2 );
        e2 = $('span:contains(flyby)');
        $.merge( e, e2 );
        e2 = $('span:contains(yeayeayouwrong3)');
        $.merge( e, e2 );
        e2 = $('span:contains(stephgod)');
        $.merge( e, e2 );
        e2 = $('span:contains(robert aint no good)');
        $.merge( e, e2 );
        e2 = $('span:contains(Gangster of Love)');
        $.merge( e, e2 );
        e2 = $('span:contains(back2backchamps)');
        $.merge( e, e2 );
        e2 = $('span:contains(Blues Brother)');
        $.merge( e, e2 );
        e2 = $('span:contains(pico)');
        $.merge( e, e2 );
        e2 = $('span:contains(screw the cavs)');
        $.merge( e, e2 );
        e2 = $('span:contains(Pay HB)');
        $.merge( e, e2 );
        e2 = $('span:contains(Welcome Back Kerr)');
        $.merge( e, e2 );
        e2 = $('span:contains(Sir Lancelot)');
        $.merge( e, e2 );
        e2 = $('span:contains(b2b champs and MVP)');
        $.merge( e, e2 );
        e2 = $('span:contains(Bakla)');
        $.merge( e, e2 );
        e2 = $('span:contains(83)');
        $.merge( e, e2 );
        e2 = $('span:contains(DC Comics)');
        $.merge( e, e2 );
        e2 = $('span:contains(g-eazy)');
        $.merge( e, e2 );
        e2 = $('span:contains(Baloo)');
        $.merge( e, e2 );
        e2 = $('span:contains(stumper)');
        $.merge( e, e2 );
        e2 = $('span:contains(5 x 5)');
        $.merge( e, e2 );
        e2 = $('span:contains(cmlok112)');
        $.merge( e, e2 );
        e2 = $('span:contains(Taz)');
        $.merge( e, e2 );
        e2 = $('span:contains(2015nbachamps)');
        $.merge( e, e2 );
        e2 = $('span:contains(repeatin16)');
        $.merge( e, e2 );
        e2 = $('span:contains(Oracle Bound)');
        $.merge( e, e2 );
        e2 = $('span:contains(Accorn)');
        $.merge( e, e2 );

	var li = e.closest('div.msg').parent('li').remove();

	var post = $('a:contains(Post New Thread)');

	if (post != null){
		var message = 'You have been saved from <span style="font-weight: bold;">' + e.length + '</span> annoying posts';
		post_parent = post.closest('a.blue');
		post_parent.after('<br><span>' + message + '</span>');
	}
    
   // flashfire's dark theme
  var body = $('body, #forumnavbar, #forum_contents, #forumnavbar, #forumpost .form_wrap');
  body.css('background', '#000');
  body.css('color','#fff');
  body.css('font-color','#fff');
  var message = $('.message');
  message.css('color', '#dedede');
  var link = $('a:link');
  link.css('color', '#00ccff');
  var row0 = $('.threads').children('div.row0');;
  row0.css('background', '#000');
  var row1 = $('.threads').children('div.row1');;
  row1.css('background', '#111');
  var grey_stuff = $('.messageinfo, .username, .threadinfo');
  grey_stuff.css('color','#545454');

}

// load jQuery and execute the main function
addJQuery(main);