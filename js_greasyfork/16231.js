// ==UserScript==
// @name           LinkoMnija v2.2.2 icons (SSL)
// @include      *linkomanija.net/*
// @description ikonos SSL LM'o versijai
// @version 0.0.1.20160114114518
// @namespace https://greasyfork.org/users/25895
// @downloadURL https://update.greasyfork.org/scripts/16231/LinkoMnija%20v222%20icons%20%28SSL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16231/LinkoMnija%20v222%20icons%20%28SSL%29.meta.js
// ==/UserScript==

var imgs = document.getElementsByTagName('img')

for ( var i in imgs )
{

	for ( o = 1; o <5; o++)
	{
	
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2moviessd.gif"){
	        imgs[i].src = "http://i.imgur.com/eDp8AhN.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/xvid.gif"){
		imgs[i].src = "http://i.imgur.com/eDp8AhN.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/mov-x.gif"){
		imgs[i].src = "http://i.imgur.com/eDp8AhN.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/mov-ru.gif"){
		imgs[i].src = "http://i.imgur.com/oZLuomL.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/movies_ru.gif"){
		imgs[i].src = "http://i.imgur.com/oZLuomL.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2movieshdru.gif"){
		imgs[i].src = "http://i.imgur.com/C0hjJQ6.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/mov-lt.gif"){
		imgs[i].src = "http://i.imgur.com/Mn4gnNT.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/movies_lt.gif"){
		imgs[i].src = "http://i.imgur.com/Mn4gnNT.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2movieshdlt.gif"){
		imgs[i].src = "http://i.imgur.com/Z24azoV.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2android.gif"){
		imgs[i].src = "http://i.imgur.com/e1bCGVv.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/dvd.gif"){
		imgs[i].src = "http://i.imgur.com/C87kBox.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/dvd-lt.gif"){
		imgs[i].src = "http://i.imgur.com/izICUGR.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/dvd_lt.gif"){
		imgs[i].src = "http://i.imgur.com/izICUGR.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2movieshd.gif"){
		imgs[i].src = "http://i.imgur.com/P2oMngW.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2tvsd.gif"){
		imgs[i].src = "http://i.imgur.com/dtFQKoV.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2tvlt.gif"){
		imgs[i].src = "http://i.imgur.com/owfmpNz.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/tv_lt.gif"){
		imgs[i].src = "http://i.imgur.com/owfmpNz.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/mus.gif"){
		imgs[i].src = "http://i.imgur.com/FsPMtXg.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/music.gif"){
		imgs[i].src = "http://i.imgur.com/FsPMtXg.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2tvhdlt.gif"){
		imgs[i].src = "http://i.imgur.com/ROa6onM.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/2/2tvhd.gif"){
		imgs[i].src = "http://i.imgur.com/qD6uOLg.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2tvru.gif"){
		imgs[i].src = "http://i.imgur.com/gcgpx3F.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/mus-lt.gif"){
		imgs[i].src = "http://i.imgur.com/AaCcEC8.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2flac.gif"){
		imgs[i].src = "http://i.imgur.com/N8In2zX.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/music_lt.gif"){
		imgs[i].src = "http://i.imgur.com/AaCcEC8.gif"
		}
				
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/mac.gif"){
		imgs[i].src = "http://i.imgur.com/7HVP2n0.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/mvids.gif"){
		imgs[i].src = "http://i.imgur.com/GI7Sp4q.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/mvid.gif"){
		imgs[i].src = "http://i.imgur.com/GI7Sp4q.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/xbox.gif"){
		imgs[i].src = "http://i.imgur.com/Uu6Dqbk.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/pcg.gif"){
		imgs[i].src = "http://i.imgur.com/PvNWks8.png"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/2pcmisc.gif"){
		imgs[i].src = "http://i.imgur.com/rkTXPVp.gif"
		}

		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/games.gif"){
		imgs[i].src = "http://i.imgur.com/PvNWks8.png"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/app.gif"){
		imgs[i].src = "http://i.imgur.com/H2mqrRv.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/appz.gif"){
		imgs[i].src = "http://i.imgur.com/H2mqrRv.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/bks.gif"){
		imgs[i].src = "http://i.imgur.com/iKVGxHH.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/cons.gif"){
		imgs[i].src = "http://i.imgur.com/CwlGtHO.gif"
		}
				
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/bks-lt.gif"){
		imgs[i].src = "http://i.imgur.com/Lmhp9G0.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/console.gif"){
		imgs[i].src = "http://i.imgur.com/CwlGtHO.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/msc.gif"){
		imgs[i].src = "http://i.imgur.com/UUBoN4m.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/misc.gif"){
		imgs[i].src = "http://i.imgur.com/UUBoN4m.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/misc_lt.gif"){
		imgs[i].src = "http://i.imgur.com/aIxon16.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/msc-lt.gif"){
		imgs[i].src = "http://i.imgur.com/aIxon16.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/doc.gif"){
		imgs[i].src = "http://i.imgur.com/g9WEfMg.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/spo.gif"){
		imgs[i].src = "http://i.imgur.com/7GHDsnv.gif"
		}
		
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/sport.gif"){
		imgs[i].src = "http://i.imgur.com/7GHDsnv.gif"
		}
		if (imgs[i].src == "https://static.linkomanija.net/categories/" + o + "/ani.gif"){
		imgs[i].src = "http://i.imgur.com/aZgxkXT.gif"
		}
	}
	
}