// ==UserScript==
// @name       Rainbow-Feeling OVER 9000!
// @version    0.25
// @description  Noch mehr Rainbow-Feeling auf MyDealz!
// @match      http://www.mydealz.de/*
// @author     leovie
// @namespace https://greasyfork.org/users/13302
// @downloadURL https://update.greasyfork.org/scripts/10969/Rainbow-Feeling%20OVER%209000%21.user.js
// @updateURL https://update.greasyfork.org/scripts/10969/Rainbow-Feeling%20OVER%209000%21.meta.js
// ==/UserScript==

aut = document.getElementsByClassName("thread-author link text--bold space--after-3")[0];
// Pattern -> nur auf Deal-Seiten, nicht auf Uebersichtsseiten anwenden
pattern = /mydealz\.de\/[^\/]+\//;
matches = document.location.href.match(pattern);
if (aut.href == "http://www.mydealz.de/profile/Rainbowdash" && matches !== null)
	{
        haupt = document.getElementsByClassName("section-sub text--word-wrap")[0];
        haupt.innerHTML = "<p>" + haupt.innerHTML + "</p>";
        haupt.innerHTML = haupt.innerHTML.replace(/<br>/g, "</p><p>");
        haupt.innerHTML = haupt.innerHTML.replace(/<p><\/p>/g, "");
        ps = haupt.getElementsByTagName("p");
        // P-Elemente einfaerben
        colors = ["red", "orange", "green", "turquoise", "indigo", "magenta"];
        for (i=0; i<ps.length; i++)
	        {
		        ps[i].style.color = colors[i%6];
	        }
	    // Kommentare einfaerben + Schriftfarbe weiss
	    e = document.getElementsByClassName("comments-item comments-item--active section--divided section--padded--narrow");
        for (i=0; i<e.length; i++)
            {
                e[i].style.backgroundColor = colors[i%6]; 
                e[i].style.color = "white";
            }
        // Links grau
        e = document.getElementsByClassName("bbcode_url");
        for (i=0; i<e.length; i++)
            {
                e[i].style.color="grey";
                e[i].style.textDecoration = "underline";
            }
        // Menu-Footer weiss einfaerben
        e = document.getElementsByClassName("comments-footer space--top-3 space--bottom-3 text--bold");
        for (i=0; i<e.length; i++)
            {
                e[i].style.backgroundColor = "white";
            }
        // Edit-Text weiss -> Schriftfarbe weiss
        e = document.getElementsByClassName("reasons");
        for (i=0; i<e.length; i++)
            {
                e[i].style.color = "white";
            }
        // Hintergrund -> Rainbowdash-Avatar
        document.getElementsByClassName("page-canvas")[0].style.background="url(http://www.mydealz.de/images/avatars/avatar263417_4.jpg)";
        // Sidebar-Hintergrund -> weiss
        document.getElementsByClassName("content-side width--side")[0].style.backgroundColor = "white";
	}