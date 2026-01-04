// ==UserScript==
// @name        questden-BLICK
// @namespace   questden-BLICK
// @description readability
// @match *://*.questden.org/kusaba/draw/*
// @match *://*.questden.org/kusaba/meep/*
// @match *://*.questden.org/kusaba/moo/*
// @match *://*.questden.org/kusaba/quest/*
// @match *://*.questden.org/kusaba/questdis/*
// @match *://*.questden.org/kusaba/tg/*
// @match *://*.questden.org/kusaba/questarch/*
// @match *://*.questden.org/kusaba/graveyard/*
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @version     2.21
// @author   dediggefedde
// @grant	GM_xmlhttpRequest
// @grant	GM_getValue
// @grant	GM_setValue
// @grant   GM.xmlHttpRequest
// @grant	GM.getValue
// @grant	GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/392187/questden-BLICK.user.js
// @updateURL https://update.greasyfork.org/scripts/392187/questden-BLICK.meta.js
// ==/UserScript==

/*
There are 106 functions in this file.
Function with the largest signature take 4 arguments, while the median is 0.
Largest function has 95 statements in it, while the median is 4.5.
The most complex function has a cyclomatic complexity value of 43 while the median is 2.
*/
/* pdf generation seems to have stopped working... major redo necessary
// @require https://raw.githubusercontent.com/MrRio/jsPDF/master/dist/jspdf.min.js
// @require	http://phi.pf-control.de/userscripts/tgchan2PDF/tgchan2PDF_1-1.user.js
*/

/* itemoptions
0: id
1: lastcheck
2: interval
3: high img
4: high IDs
5: high All
6: ignore img
7: ignore IDs
8: ignore All
9: high Name
10: ignore Name
11: link to high
*/

/*lastviews
thread
	"_"
id
	String.fromCharCode(11)
ref
	String.fromCharCode(11)
count
*/

/*watchids //redundant. itemoptions ->
qthread
	String.fromCharCode(11)
qid
	String.fromCharCode(11)
qname
	String.fromCharCode(11)
qauth
*/

// // @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// // @require	https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
var startTime=new Date().getTime(); //start-time for script.

//Sprache:
var curlang=1; //Englisch
var deutsch=["DEUTSCH","Textgröße","Absätze vergrößern","Bildvergrößerung","Farben invertieren","Schriftart","Laden","Lade vorherigen Teil","Verwalte Watch-Liste","Ihr IP hat sich geändert oder die Browser-Einstellungen wurden gelöscht. Soll die alte Liste beobachteter Themen wiederhergestellt werden?","Absende-Formular verändern","Text art/Größe verändern","erweiterte Watch-Liste","AutoUpdate Watch-Liste"];
var english=["ENGLISH","Font size","Paragraph margin","View image by hover","Invert colours","Font type","Loading","Load previous part","Manage watch list","Your IP has changed or browser settings resetted. Should your watchlist get restored?","Change reply form","Change font size and type","extended watchlist","AutoUpdate watchlist"];
var lang=[deutsch,english];

var deutschimg="data:image/gif;base64,R0lGODlhHgAVAKEDAAAAAP8AAP%2FMAP%2F%2F%2FyH5BAEKAAMALAAAAAAeABUAQAJTBIapau2Ngpy02ouE3rz7LwzPSJbQhabUMoAbCyPmPA8S7aiSrfdrK%2FBJXC%2BiEaZxxGQ4g6gJPUQfqAOF5osIs7ytTusdfgJAjc5YRKs5mfVSUQAAOw%3D%3D";
var englishimg="data:image/gif;base64,R0lGODlhHgAVAKUmAAoKXgsLXwsMXwsMYBMTZLYMBbUNB7YNBbUPCLUPCbUQCrYQCrcQCLcQCrgQCLgQCbgRCbYTDbgTC7gTDLcUDrUVD7gVDrQWELYZE7YeGbogGbq3x9vMztfV2d7U1trX3d%2FY2uHY2dra3t7b3eLg4eXh4v%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMAP%2FMACH5BAEKAD8ALAAAAAAeABUAQAbhwJBw8Csaj8jiYCkMORyX55DTFD4ZEAnj%2BXw0FotnRrlckkIMRmjg5IYIAKZVGvqx28My2xFxzP15S0VtDgkIBgVcW25ueSBCRWmBekmVRx14kwJyDhh%2BZYRVa5x0cxZ%2BgI1DRYVcrq%2BuooQOZHNNarNrVXRlP1WSo0yxeqB%2FTYJFApvGAwGgscbBzXtu1ICUpMfUFKiA2sh5TbEOBxNcGrCArKqzDhAQaekOCk%2FrCfRXDovjk3ODf27UQBsxrMwGO8VKoMFV8E4mQUs%2BiPCwcBRAaQ4bpcFFjFoFWkmKhQgCADs%3D";

var disk="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QULDS01A9SgvwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAA0ElEQVQ4y2NgGOyAEZnD6yr3nxxDPu9%2BBDeHBcMGUQ6iDYrU8GRYdng9AwMDwzIGBoYorAYiK8YHlt%2FYzrD8xnZkoQwGBoYZLLgMYxfjwe86Bk90AxnwuvDnqy9kRQpOAwm5EJeFLLjCJ5KBcBiS5EJcGsjyMjcfN8OXu28JJ2IsSYwFn4Yo20CcctD0R5qBuAzAZxETSfmUiFzERMVywY5iA%2F%2B%2F%2FsHwefej5QwMDIdgeZmi0gbJsBlYiy9Y%2BJNgJophuAyEGXqIiDCLonmJDQCW%2FTng1KHaLAAAAABJRU5ErkJggg%3D%3D";
var hdisk="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QULDS833%2ByjEQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAx0lEQVQ4y2NgGOyAEYVXIPOfLFMmPIGbw4IhqSdItDm7wucxuFUHMjAwMCxjYGCIwm4gkmJ8wG1lEoPbyiRkoQwGBoYZLLgM4%2BeSIuw6VAMZ8Lrw47dnZAUnTgMJuRCXhSy4woeYMCTJhbg0kOVlQTkJhvdbrhPWjSWJseCNydb1uL0MSX%2BkGYjLAHwWMZEUQETkIiYqlgt2lBt46T0Dw4QnyxkYGA7B8jJlpQ3CsBnYiy8IWEaCkSiG4TIQZughIsIsiuYlNgCW%2FjRKPBg%2BOgAAAABJRU5ErkJggg%3D%3D";

var transitionString="#BLICK_watch_bar {transition:width 0.5s,opacity 0.5s, height 0.5s, background-color 0.5s;-moz-transition: width 0.5s,opacity 0.5s, height 0.5s, background-color 0.5s;-webkit-transition: width 0.5s,opacity 0.5s, height 0.5s, background-color 0.5s;-o-transition: width 0.5s,opacity 0.5s, height 0.5s, background-color 0.5s;";
var langimgs=[deutschimg,englishimg];

//Voreinstellung
var externwbar=true;
var gloeinst=true; //change text size/type
var groeinst=18;//px
var abseinst=true;//absatz-vergrößerung
var liseinst=true; //liste vergrößern
var poseinst=true; //post-Formular verändern
var invert=false; //Farben invertieren
var imghover=true; //Bild vergrößern beim hovern
var wateinst=true; //Benutze veränderte Watch-Liste
var autoupdate=false; //update direkt bei pageload
var curwid=340;
var zwiheight=100;
var zwiheight2=510;
var startX;
var startWidth ;
// var curwidakt=false;
var scheinst=0;//Schriftart Georgia
var schriftliste=["Georgia","Palatino Linotype","Book Antiqua", "Tahoma","Arial","Helvetica","Verdana","Times New Roman"];
var schriftreihe="";
var imgbox;var bildel;
// var varheight=0;
var wartimg=document.createElement("img");
var lastviews=[];
var itemoptions=[]; // {string threadID,int milisecForLastCheck, int viewinterval (hours, 0->on reload),bool highlightOnImage,bool highlichtOnID, string highlightIDs, bool highlightonall, bool ignoreonimage, bool ignoreonID, string ignoreIDs, bool ignoreAll, string highname, string ignorename} + bool highonimg
var externlistspeicher=[];

//sync
var syncusername="";
var syncuserpass="";

//watchlist
var wbar;
var wrbar;
var watchids=[];

var icondatabasestring="";
var aktfrag=false;
var speichern,laden;

var charnamelist=[];
var aktcharnames=[];

var refreshimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMiSURBVDiNbVJNbFRlFD33e%2B%2BV%2Ba0zbQdbqLYKhhKmoaIzjX%2FRmEY3xGBYqLxEjJCB8LNhBxsMTQwRdGGi4AOjMUwlmDQBN%2FwEIZLUwqtx0dCS1NLGAUY7tB3ozLTz3vu%2B66LzkllwkpvcxT0nJ%2BdcYmb4SGWyzzTo2hEQ3vSkatWEmCfCuOPKEwAu2Jbp1t0eBHCCfIF0JrtF08RAT9cqfV1ns9HWFAGYUShWMDJ2v3xn%2BqEnFe%2B2LfNselc2w4zvAMSImZHKZNcbuhjZ2tcdiseC0InQHA0gHNARDRkIGgIzxUUczw5XCsWKHQ019D4uVw1mNBEz49U9Z0%2F1rGv7NBgwxK3RHKquB0PX5JrVscW%2B9PPh3vWtpAmCEIRfrk2ot15sFwe%2Bvuo4rmzRAYCZP7wzXRCup1gxLzLjM8eVZ8anZ5MT9%2BaPXu9o7tq3dVMoEQvh43e7RC0GAqAEAEipwlXH85IvPPuDlOoRgEHbMvO2ZV7549uPXhqdLOzdfewS7j8sYXqmDKkYAAMACyyvqumpSH9jJPBVZ%2FvKbgBTdWnruiZ2bnsn6XY%2BHUWicQU0Qb4D1mt38V8%2F37yAJ%2BO0J9VrF4cnq1ftqSXfvOOqAAD2W6gCMGoErpvfAOwE4D5BWLct854v4J0%2F%2Br4GEJgZF%2B1%2F1Knzf%2BWkVD22ZRbrWYezY6tK5aWO30fGbwCI6QBABBAR7v5XhiEYJwf%2FJABf1JNTmWyYiO72blx7Jj8zlwKgAagKABBEBAAdiRBWt4Tx5f63qa0lcuyVPT%2FfSmWy6ZrG9hWGrufyswfyheLrmkaubZmuWHZAeFxxcWFoij2P0b4yisM73gh90Jd8ubU5ci29a8A1dPGNVDI%2B92gBTY1B0oQYBAD%2Fkaj%2Fx6Glidzc5KXhyc7Mlk3hRCyI7rUJeq49HiqWXfw7W4LjeBQJGjh3ebTiSXUEAJYfSTFN5OZO3zy5LfmgsPBJ%2F%2Fc35o8P3CwN384jP1tG1ZUQRCjMl%2BS5y6OLUqmMbZljAOC38BOA7bZlci0wA8B7DYa2VzFvkFLFDV2bIcJQ1ZGHbMv82w%2F3fy5VdmoTZczGAAAAAElFTkSuQmCC";
var nextbutbild="data:image/gif;base64,R0lGODlhEAAQAOMIABIlNRw4UBM7Xi5ZfjhokY6xz6fI4%2Ff4%2Bf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FyH5BAEKAA8ALAAAAAAQABAAAAQx8IlJa5U2awqQ2RVQIB4oiAdZEOZZtu4Hd3IrsnCu79nw%2BQKgBUAregIZonKJxMAeEQA7";
var wartbild="data:image/gif;base64,R0lGODlhMgAyAIQSAIdBG4hBG4lBG4pBG4tBG4hCG4xBG4lCG4pCG4tCG4tCHIxCG4lDG4pDG4tDG4xDG4xDHItEG%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FyH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQJBQAfACwAAAAAMgAyAEAFk%2BAnjmRpnmiqrmzrigDwzq9M33Cc6ngb%2F7WfbSYE9o7IpHLJHA2bJ170CSUJV0ZmEVnseqXVsHhMLkPBZhR6nC1RyW23ebtbK7u%2BOA6%2F59f9VV9vaYSFhoeIiYqLLHaHg4iQgViEjh%2BSgY6YZ5qVek5pV2pzn06WSXR%2FmaJYpTeAja55rDSwKl5LgqZfYoK4jMBKIQAh%2BQQJBQAfACwAAAAAMgAyAEAFqOAnjmRpnmiqpgEArHBMtnJtf%2B6ty%2B67%2FytXYOi7CXvApHLJJBWbNSR0J5wCe0%2FmkHbFeltCYs5KLptFrcA5uI6N26oqPA5Qz1PYO15KfsN6dkpggUaAYChedUdlikRgfnqRkpM%2FfJKEknWUTptOmJNZlJCTRJ0ilqKhoKOZmqZ5r6xNrnS0U1syW6o%2FgzaPuzx1hzpHuG6Pxl2Aib%2BJtlpYv82fptU3IQAh%2BQQJBQAfACwAAAAAMgAyAEAFrOAnjmRpnmiqpkC7vvAYtEJs20Ee3Hzc5r1gLAfQ7YTIpHLJNM1cTRw0yiseqULiFIvUCYzW70%2FHLSt%2FpCuaOgOaVet36gmQr9pXO4pY08%2FbfndWgSo6LXWEe0RaRYknYlZajpOUN3g7X3qGeXtYkpSHnISfoHGTgJUfoalPoomklHipqlugOX2pPwWzqm6sVoi5q6yXs3iHwY50AqFFhzJfAbtlzqGLkbzZSiEAIfkECQUAHwAsAAAAADIAMgBABbvgJ45kaZ5oqp5BCwCtsJJFMLPtrZvHGry2nXD3%2BwGGyJ0gIGgmn9CodKpz%2Faii4AymxQ5bOS8UzBRjY4GCec0uCV5wuAtYxC6L6uehq5Ov%2BShAeW0%2BYIQ3SzCHM2SAiyZMRo8%2BXI6TJWAwMpecnZ6fkXJ3lmdzlShgm1NGMIpIpIxkVKpVp16usUttsFlAnyRgPb8fo8MirbyLmcbELsw1hsZWzEVX0olHxqPZ0mjMH3uR3x%2BpuuPn6G0hACH5BAkFAB8ALAAAAAAyADIAQAXO4CeOZGmeaKqeAxC8grB%2Bwgvc8%2FkGwpH%2FJJ4KJgMaSz5ULXBsOp%2FQqDS6i8GS0xGi5sp%2BYLMY15vCmrY1cqq46qnf8Li8tOQubfgbM%2Bu6Pl0CCEc8O28BZigBfWxxBSk7XXMfiEFgkiKMJTyUlycxA52hoqOkpaaXeDuphHI3fUQ%2BBwgFijaAWYQvnEOKAFB3e1AHYkcDqmQvP7Q8vobBa8dymSbRc890S46SB7t3pyPVktcjNWnfkwID03C7mDHn4O%2FwNPLz9vf4%2Bfr7oiEAIfkECQUAHwAsAAAAADIAMgBABdjgJ45kaZ5oqp6CELyBcASDitCugKxmTAS8YA8AFBqPpBhyGTwwn6MddEo9JgTE1ktQq4pyA1f1kAuGBV5VAOBMQwNtt3xOr09zMRjMteejqQN6cEs3e1YtLW4HRAA8ZH92i0UoYXYkDTqWR5OaKwNSnSkHoKEspaeoqap1BTFhezBEL3FpM1l5eS0Iu4%2BCVYh%2BkDyvW0x%2BAAW0SJLCQX5dVYY8CMBzN0Q8XMpyL9AnxZprKgMEobMpCNt1iasl7O0jAaTwg%2FAjze3qqvqp86v%2B9gIKHEiQSQgAIfkECQUAHwAsAAAAADIAMgBABdXgJ45kaZ5oqqJDIAwIUqDIICBCoOvH6v%2FA0S5ILOJuxaTqoFM6R4LZc0oFDmzYmwtR7dJygYG3qhOMnTnAmYjjrmm9t%2FzpEtjDtno5NyB4EwMLbkU5doZzRUw5iEFXdow%2FTGGQKwU6EJQqZZkokpwnBy%2BfJDijpqeoQQk4LntpLgVxZwdXfS8vLQUFhoV2V122YkGGO0hOMVV3LqkjrAHMUHayqa3CqQmF0B87g6gNm8yK3acITdABAM%2FnAQvnANOnNw3Qj8wBB%2BOmZqgx%2BZnW2gJSCQEAIfkECQUAHwAsAAAAADIAMgBABd7gJ45kaZ5oqq7syAgDDA9tbacOAht3bzuCgMBHROlgRSIiAAgEktBokYBASK%2BpgiAIsGKhW2fjW5SRazknLVr1ioKfrQDhOJzveMcisR0QCAMIfng%2BMUJzhDcxW3aJLToBAwmOLYtulChAQpgqYZecIwdOn6CiiFCkKgdBQpOgr7CxXwkEBgIHgJKyJQi5cq67A34DQmu7HwcFi0%2FHH0ebzR%2FEjNGLxsesQ9Vbqa9ASM2a2s1y0Uu3zQmL0U7jshHtDrsMq1vYo7tL7WQJ3SPPBRolanOrCgxg0RJGCQEAIfkECQUAHwAsAAAAADIAMgBABeTgJ45kaZ5oqq5s675wiQxIEt8tIggD7puCwMDmShwEvw9COOgln9CodDo4LKZPwoBHwN50gsOK6AUjng%2FHIcAOANq7YPjsrdvv3ofBgI85FgRkfStbTYMrCAU7TocoWwFijSc6A11jd4%2BRkiMKAwFIP5Q1LWtxAXR9CKibrK2ur7AnCQtXsSMLVauwCVq2IgQEuq6VW3yxBAY8tkafwqwHW86bTWy2BIuxCaIp0lSflq%2BPoIh2DnENRWXYMaNQcd0sCOg3CVs840laYDQJ2toMqpaw4cGozoEjQQaq2gHOl0McIQAAOw%3D%3D";
var stylebuts="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAABICAYAAAAK2WsnAAAABmJLR0QAbwBvAG98p6s3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QMUFjAYLi5uLgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAgAElEQVR42u29d5gcV5X3%2F7lV1dW5J0ijCRqN0ihYVrJkLByRjU2OywoWTDAsmHfJLD%2FDAmZZA2vDsot5CTYLeA1LWMAmGOM1wcYyDhK2ZcsKtrJGmhlN0KSezpXu74%2FqOD2hezRi7Xe7nmcelWrufOr0uVWn7j11%2B3wFE7Zt27apx44dU6LRqGKapqCCzePxyCNHjtiAk%2F2Zcqvxa%2Fz%2FzXwpZUXMiZsQQlbSbq75Ige94447lJt%2BucUa8XhJCA0pKjuPBMKOyTwrw%2FhjL14AjF999dXmDTfc4BQbvH37dvVj31lmDms1fo3%2Fv48PKJuvPmmdCX%2FXjzq0XADK3dBzzFcBWRwshJRS7Nq1S7vma63GmM%2BPpoKqQIV8pARHgm1DQyaN8vQrV3R2dvZv27YttW3bNgkoXV1d2utu8KZGvT5U1Y1KQsx8DimzP9T4Nf7zlw%2BoG9%2FZl54L%2Fu7bW32AXTRSOWO%2BI8F2oD6dZs%2F3WnXAFkK4geiJJ57wfODrC4yRSIi6gCDkE3g04QaJCgKE7YBpS9IGxNOSxngcvetvz7nwwgt7rr76arOurs7zpuuN2HAoRMgv8HlAUwVKhR%2FAkWDZkrQJ8ZRkXjyOfqLGr%2FGfH%2FwVK1Zol1%2FbE59L%2FgPfbg8BZm6GMxf8ZAZiaUnjeIyHblvkBUwhhNQ0TdONkI%2FWekFrvUJjWMGvg6q4J5npBJYjMUwYT0lOjzskNR%2BKoqyLx%2BMpj8cTVRQlIOt9LIwI5oUUQn6BVwNFqfADOJCxXOcMxx1Smg%2Blu8Z%2FzvI9Cbx9t6Ms%2FyDCTqB0fx9n6fue9%2F5ZPH6Al3b9mHuXvI3uyIqK%2BYCvmL%2B5M4xHo6ob2LRg15FYng%2BEgWS22Zz4J5pwGByHhPQBeAFHSmlrsVhMx6fRFFZY2KiwoE4h4BV4VDD7HihNxrReXnYSy4GMKRmNS3QNeqUHKcTqZDLZlU6nzWAwGPKGdJoiCk1hd4SiewSqIovTIEUzIlG0D7YjMExJUAdFURhwPEgpa%2FznKj99EL2pBbVOQPQINDVDRDkr9oueH01%2FA7RfPWf%2B2Tx%2BBL2piXVaN5nIqortB%2FzekCfPrw%2BCR4WMdRN2GlTf1Pb79U%2FiOGDa0Fwn8nwgWDTFCBbzQz7BDQt3uRECeJhLCsBLHi7s5vccPvtfm%2FGqAtuBVMYDoANpAG10dFQVqht1fB73R9dAU0BvuxBr6ImibG3pB3AcN18hHffvvBooqiCRTreNj49HLMvqTyaTmoMX6Ugyphs5DUsWjU7kJGmTonNIiWW7QUg6EgeBkUq1joyMRAzD6Kua3%2F19WPT2s8efC%2FsTQwhjAOltRPG2TM7PDCMzAzieRmxPy3PH%2FpFDGL55KEkJpw%2BBpx6S2WvZNmDo98h0v3t9CwVHa8Ke9zLSh29Btny4Ovtj8ekfkUk5J%2F0bsGJ4h7tJ2AYLEk8Ti1yeDxwz8QHFQeT5adO94dPGuItPl5ttpUHzQSL9SRzp4PV8qYSfzTvkk5PFfEUAhpEfPmRKyJlJ05TxtDuFsW2JKUsvAm10dFSaFiTSDrGkQFMcAl7hDlHQyYyM51HegFN2KTnZEcR4ShJNOMTTMB6NeoUQyokTJ8yFCxcmR%2BJ1SEsSjQs0NTv8qfD1S%2B4clg1JQzKaFqSHhnQhhOju7rYcx6mOr7wFeq2zxz8D%2B0ejDlrP%2F0U1R0Co7k2k%2BlAWvQd8C1yebSNPfB1hDCNRkNLGEV6che8hqTSfFftt08ZGJZGyGDO1afnq4T2oHe9AWBbywG7EoreBYYGVxOn6OiKyCXxbEIEOUIPI0d1Yh7%2BBlTxFWrersl8eOT79qzvNmpP%2Bvaj3PrYrHSyJ7qdzbDcp%2BQzdkVUV9e%2F69esTI3Enz6%2BPZG9ibiKWen3%2BHGYSPIHyfZAEfXBy0M7zgQRgZBuU8DUV8A%2FnuUMlHhma1E9H%2ByxMy72HYymRiyQOgNbX12clDUk0JulXIJVW0D3uyEARgmTP6Two4HXKni5Suv0fS0lG4w7DMcHo4KCVSCSsxx9%2FPD08PGwOxxaTSdhoqshnWAGs3dfkWdrG7015LJfJtWxJ3FFJDA5ayWTSnIlf6XamfGd4B073bW7eyLcE0ifytlfDFye%2BBuNPoix6J%2Br8rTiZfpwDn4KuG9HO%2FTf3IXzsa8jxJxHt1%2BTb2M9%2BEk7eiFz9lTn3j3XoC9lst8SyHdIrbpiUn3zoLWiam0IXXTcUAMducB94gWXg70ALXAFx3B9sYB2ObMA6eT3U21XZbx3rmtZ2LWKfef9KyRt3%2FpSvnv8NXnS6m9auw8xP3cP2VZ0V9e8rX%2FlKazgm8%2Fz5je6zP5pY6z7TY%2BAN50Y8xaMf93cLWvYRTboBIscHxoHcU84s5guAb308j%2Fk4byow31Q4XnSUE%2F1XZnMdknFLIRt8pBBCaidPnrTTFsQSDkhJMi1LkijjPYN5kM%2FZS2bwUZAO3qYteBrXu1lQC5IZSSzlMJ5WiUajdiKRMB999FHz6NGjZlx7FeQGR0Ud4LTfiLXXTWDpsWxnLvw85r4Plh6ThadZHIXY%2BLiTTqetmfj56HzwczixpxFSoL%2FgzkkDxJnwM3tvRm2%2FBq35pVijO3D6%2FjVvezV8R1mL9LXg8V4KMRvHCmDGPZA5hrfD5dnKuUhfC1pRGyPugUwXeoczK%2FunDRDqC7CH7kOZdyX22H0YaTk5f%2FX3EYDxxBvwvuDnkN3Xz8%2Ftb0Nb%2Bw6UIr8U%2FNMKnbchk9XZb4yOTWv7XFw%2Fa04%2FyjNOB33pAHvFcq4aHmZV%2FC7GWt%2BfbzgdH8jE0zLPH0%2FlzrEPgJTaSio5xQdQYTz7u2jMzvOzE5PcNMAq5rsDhaGqRhBjWT%2FZDqSFQvFrTu3JJ5%2B0jTWSREriOJBKZyNRNkCMDozmQcGQB9tZSbrvATj1K4LLdLTwSixbYliQykhStiSdTjtSSufZZ591Dh06JM3LwHQmuTiVZtKZ7Egp99JGbSs%2FVtQJpgKmaTqGYTh%2F%2BMMf7MWLFzMlP7ct%2B0esru9iRx8vYU4WJGbDz6Tj0P0L9PoXo4QuhA0%2FxzBnwY9sRfrHyOy%2FCSe2G6ykex0IgcjxIltxfGOkJ7SRgDCn5idPfA%2BsGE5sL0r4XJzxvYjAYmTyOCKyGWfsYbyrPocdewYn%2BjSke%2FF0fhLHsLEMC9WwsQwTy57ePxnDyNuazhh5f6czaXxq25z6P3%2BdTLXNwfVz0ZGf8psV78Uw4WBgLVY6TX36JAtP7%2BF4w4YZ%2BdkZWp5vWqX8kLcPgIb7FxEKqG6a7MLCyCjXPnc9mW7u0S5eKFXMFwJIFxIbpSmO9ORusgr22wrkgkNuiiHNVWA4DlIKMtnXI9kkKMNjscKcTlmM42lgZOzXblQ78Dsi5yxHZhdamJbElCqWZUkppezp6ZGAjAACOWlOTObDr5z2mJjsb4ATJ05My88%2FCUd3oETOK2GWLSmdBT%2F12Kuzvu8l8%2FjrSrPQF9xdFd%2BK7sE8%2BBkkCmr9C1CbX4F18nvI1NG83VO1IXU0b%2BNkfBk%2FhOMY6G1%2Fg1SD2LFD%2BFZcT%2BqJN%2BJb%2Bj7SBwaxRv6MGlyDmN%2BM1f0f2CM7wNOQ5cmK%2FCNzq28m2XfsDIqiz5n%2FpZQzzx3PgB%2FKDLO5%2Fz629N1bhj7%2F1G85Xr9%2BRr4QQkbeNlzwzxSmBv0Kp4bShP1avs3DdohL1HiWLyddFj2Rj4QvOU7RO4ovFU7ypcLxL03w01SDSs3NJbgZTByZjSCFBolkIfMZSjtIGSgcS3XhM5z8%2B1RHgiNACIGqqqKlpUWoqsoooEg56dNXZA%2BqpQ4oO1bc39Xw85txGu%2BCl5Qxz5QfuuDXOOkBUgf%2FEYx%2B9%2B99iwms%2B1rZ5TAT3zxyEwiV4IbbUfRI7lEBQuTtTk3TRsmeYDK%2BZ%2BHVONE%2FY574Fp72a1ByTKGiIlEVD0JKnOH7QVFR%2FAsRQqAgcbJtbaa2P%2FXYaxFCIoQg%2Ffhr8u3Sj78GpArCgxh7ErVxy5z5X8wwVzrT6%2BdFPb%2Fkl6s%2BwL2d780fu%2Br493nzM1%2Fk%2FIH7%2BcWa62bkd3d3i7q3j%2BT5AnjYDnOJGmMk0UBjcDT%2FN5GAh1BAZQwYSTQgfCLfPsThwlRmwvctivnuyFwpDNJLM%2FTT%2BmkyvlZYc50dzToTV0oWHbBdSu6YonrBzi7tlNk1nwpomqYEg0HlwgsvVL1er7xHcV%2BsTmqcooKQaJgIxYOUElVVssYZiAlPHFUBj8dTMR%2FAHPkzqqbii3TOOOeeDZ9AM97z%2Fp3MwG8x%2Bu9AGifxKNXxNcdBI4UItOH1RQo3gX0aRVXwKODM0EZXp%2BY7p76LFj4fEepATR%2FFtochtgdVyUD0CTC6UUgi7TRS9aFIAxnfDZ75KNZpiO9GtYewnOSk%2FIYX%2FgorupvU4S8QPv%2FOkn2A5LGvYp26Hf%2F88gCRGXoIo%2BvrhM%2F%2FWVX%2Bz10nU22T9UGlfOFYXHbqV3z9%2FFtLOE8ufDlvPPQVWjM9LI4f4lRk5bT8nJl60b2rSpUdsp6Lw2M8YtcTnhemQ9FJZCzCIZV9jYugMYQ6HGOHrEdV1LwN2Y%2BsTjxnsf2Kqhbd%2FErxLyYNFcWfr4gvAbTW1lYRU0AXElURZd%2FD8OqFxQ9ej4NjJvPHvPXL8emFNRFSgq5AIBBQGhsbtU2bNnl8Pp%2B8bx%2F4ppjjWZHFSKMPLfE4WmgN5ugOfF6v%2B7uDHyay%2FtaS6OZVwPH7K%2BYDOLGHCIQX4%2FfMPBqdDX%2F8yb%2FB2%2F4u6ttfhuH3kzrxnbJzzcQPKAqW7kUQxWP3g2OSOvEt%2FJoJmo5XtVA8GrbXB5O0kaoHXbHwavqk%2FIa1XwZrFKFuQ9E04P1uSmO%2Bm0SMLDi%2F4C9jHEWP4FhxFC1UYv%2BwosMU%2FklE78cfWYrfA4nxP%2Bb3AfyrPkLs0D9jHfoYwaUfQQkswjFGMQZ%2Fhxj8NZGlb8OrVed%2FM3udTLnQyDO7%2FvWZ47z28NcQXh9msL60L5UIvQvOY2l0H3%2FddQs%2FXvuPJLyNU%2FIB26sV%2BLtECz7NR6gxxK6RFt66uy2bUYVFre7nufJujWBA5c7zTUKNIeIjcXxagQ%2BUXF3FfCHg877C6qv%2Fc013fv%2BdV%2F45v3%2Feeefl9%2F%2Fzb%2FtL7M%2Fy3QCxadMm9VgafMJdPSmyQSI3rwr6C52gZY5hpocJ%2Br0IRaNp2SvQdFGyLDQhBFoopLS0tHjWrFmjq6oqvIcEfie7dFuUztf0Fe8m1f0fOIPfRzG30LDwamLRu%2FE0vBC98TJUbynfqwi0cLhivgQs2Y0SbsI58jHC535l2mWts%2BL7%2FWjOCcxn342CpLHzXfi8omq%2BuvxqjL6fw%2FFPuhc4CiLSjjSH8ZsH0CLrUJddTabvzpI2SqQd2xjCaxzAG9g8KT%2BoqShi%2FqT2T5xD463L%2Fhuuyn7bOo6n5QoC3tz%2B5Xk%2FCCC47npSPT%2FGOHkjjnQTZppWT2TNJ9AiG6v2v%2BX3TxsggkV9UE3%2F%2FsMT1zI%2FdQqAr%2B58Bf942d2k9HoAPvnQ22g0ByAQ4Lzkk5z32Ov49Nbfk1H9k%2FLdh2yBb2UXODgxh6v3toMX%2FvBig%2FV3SpobvPzhxQZX3e%2B2uXpvgF9uGiHgCRD0ijwf8BV3XTEfAcFgsNCVRUFUUZQp%2FVTsnyK%2B1JqamhS9V4Ii8GqybKFIMNRE%2FaKXYBlR4gO%2FRZoJ6ptWEWm7Et3fnLfScSCDwA84waBobGxUm5ubPZqmKX5VoqoCr5Al3%2B8QApi%2Flrr5pTdtcPOtE3NMOBIyUuBHIqvhA6augBgluOJ9ePRJc1hnxA9ekFvzcO1UObKK%2BPXtr4HWF2HF9oPw4qnbiJMZwIrtQQvOQ9Mh0PFqnNbLsGL7kcKLFtmAkxnEGH8aGZiPX63e%2FgpyfDPab4%2F%2BEd3no77txSgeSHtsd3%2FC2D2w7C2w7C1z4n%2FDX%2FkIohr%2B17b%2BtMQ%2FAsitW%2Fq%2FL76zzD8q4JuCD4hifkbzE2oIEh9N8NstaUL1Qfz4aW%2FRuXvjKCEtiMfr7gfrA%2FhG3SDo8xT4ue9K5O77ifb7s4FTCIGu6zMGCL%2Bn1D9FfKkFAgEZkDaGoqIICwWJUvQ8aVv7gayLJJGmCyY8eyQCgUSiCjDQCEqLjK4n6%2BvrrVAopACEhI0hVALScrOtYrL1%2F7LsewFuM5HPshqKRkjapD2eRDX8hrVfPav8ObVfi6A1XlSYE%2Fpb8fjbShKeqqcOtfHCwrPf34rH18qY8PyP2W8veAnzmq5ACAkC5mWnhme%2Ff6feFCGfC%2F0rivkAibFkPsEaH0sAcPfGRP7%2Fuf1cOyklKjLPzxqSTyhMtH%2Fpa3bkrdyZKNi%2F87Zi%2B%2Fvz149Cqf3FKQqtvr7ebrAy9GkhdMch4tjZbPRk6%2FPlpItxpYSE0BgXCovMFKai9Pj9%2FjFFUUwhhAhlMvToQYRUCDoWubc0w3vePWMnz1v%2FXZevaMSEQruRwlTV3kr4Vdlf4z%2Fv%2BOHVt06%2FyMuUs%2BLf%2BMDlVa3E%2FdTlf5ySD9jF%2FMj%2B%2B2a10jeqqHl%2B7nVB7g6fS%2F8vMlNkV2m6OYiGhgarvv89banW208NebwkEYSw0aWDUvzuuyiOFs9ZM0Iljkpa0ZhvpTl475avNTc3HwyHw6f9fn8KYEvDN5ZGT3%2F4%2BGmPj5gDQWnjkQ6hVd%2BekT9uCBIiyzfTHPrtlq%2FNnz%2F%2FQCX8Su2v8Wv8Yv4HL3mgOr41Ld954N%2Fb6zf9bd%2FYXNj%2FwG3t9RPv9Lnk%2F9Hl56OJBtiLFy%2BO9jxyVWfbpv8%2BMqJ66Vc8OBWXlIKQbdJixzl09%2FqbvV7vY7quP9vR0TGqqqoJ0NbWNqJvf%2F3KlpU%2FOzSieukX1fHDjkmLHePgXetu9vv9j%2Fn9%2FgM1fo3%2FPOFLgCdva%2FVf8PaTqTPhP%2FafHVNmZc8WX9u2bZsDZA4ePDhw%2FMFLl4%2BNjXXatr3ScZw2KWV44jvXSTZnXIjEKej2eDyHgMM%2Bn%2B%2F0%2BvXr04sWLZIA69evN%2B%2B%2F%2F%2F7%2B3Vm%2BaZorHMdZWCk%2FKkTilKLU%2BDX%2B85Kfe2g%2F9p8dHs58m2ql31nha0IIKaV09u%2Ffn%2Bzt7e0NhULReDx%2BTEoZkVJ6p1x%2BVQo0HMcZk1KOhsPh%2BNatW82tW7fmT7R161a2b9%2BeeOaZZwxgzHGco47jVMwXQhhAtMav8Z%2BP%2FOfzJib5fy5DKipwTnGQcIqSJ3Ka89X4Nf7%2FVv7zbtPcLKnMOUa599571e7ubnVsbExNJpMzTmSSyaQMBAIyEonYixYtEtu2bbOmcLwCiO3bt6uHDh1Savwav8avmm9n%2BfJs8EOhkHXttdda2TUUMj%2BCyJW%2B%2F8x%2FtBvepghqwIvQKgueUoIdS2EMjTP8xGtbOjo6xrdt22Zkcxv5qLx%2F%2F37147fOz%2Bjza%2Fwav8Z%2FLvJ7HnpJc0NDw%2FjWrVuNnK6HkFKK7du3q1%2B5Z6Ppa63PVpKqQheDwjLWdN8YR%2B65pLOtra3%2FoosuSv3TP%2F2TBJTDhw9r1323Ke1tqS%2BU06%2Bi5pnE%2FTp5pr%2FGr%2FFr%2FLnmO9mfVN8YT%2F90w3LHcfp6enrSgNTuuOMO5XsPXmZGOuvx6%2BDNl5urPEC4tSDAu6ieziv%2FeKR%2F52tW9vX19e7atctcsGCBdt0365KRznq8GnlhHncYM3N0I8u3bMjU%2BDV%2BjX9W%2BIYFWns961%2Fz2NE9v75geWdnZ%2B%2BRI0cMLRQKaYHmCEGfpM4PIZ9b1bqauv22AykDEhlQ2iP0SXluOp1O%2Bny%2BqKIo3rqFEcJ%2Bid%2FjBiBNqU75xy2tDykTxMIa%2F7nMV%2B0xjj36Oc696ivYRpTDD32Bc6788vPeP82ndrHl0S%2Bz8%2BJPMNh63qz5Pl2gqtn7q5LMZ1a1Lm3Is%2Bcf27U9nganNYJt26sSicQ4MKINDQ1p3rAXvyYJeyWRrDqPqsCBnd8vAa5%2B4Tsmyhq4xS5t0LOSX3ZER0q5KhaLHU8kEmld1%2F2BSCt%2BTeL3yOwIRRTSw9PLMripYUe67aXAjujYtr2yxn9u8mN9O6iLzMOvSYa6dxIJN%2BDT5Fmx%2F%2BCfrp%2F2Blh12RfmzD%2FL%2Bx5GDQToGN7N%2BKKNs7bfp6uoCiQy78RKghaY2v6Q73Y3R6CCkE7F9n9auzsfHe7itQXga%2B8q7BZ1%2BhfueDVIMFWBHvLiOM5K0zSPAGPa6OioqqgKQlpIKXAciZ2t7bB43es58lTh22u2IyeNQLadrQdhS1A0Uq4uQHhgYEDoui5tFAzDco2wBIqQVWt%2FWrbEMCU2GvF4vPX06dOh2fAPbf80K7f%2B81njz4X9RqybZLQLX7iVYMPySbnp8V4SY8fxhlrx1y9%2Fztjf2%2FUEvnAL4ylJ9%2FEn8AabGU9mRWaMJD17%2FoPk2DGktECo%2BCIdtK9%2FL3vv%2B%2F9YecU3q7J%2FbGx8WtvHU3JO%2BteXGsbTe5hkxqTh4IOMr3gbuMVdq%2Bbb2aF%2FPDXqniNVbreRAD0I48nXIZGEfHdhZCq3H086P8eYvial2y%2FxlFtT1jQlUtHIZDJttm2HAUXr6emR1kJIZyRJzRXBKVS1DnF6OJrHjcXllEOUjOlqc6YdGBsb81mWpR49etRKp9MiZWzEsCWaAooyu1fEjuMO5WzV5TuOMyt%2B%2FYbPMzjqnDX%2BmdivSJODD16HmRgAoSBxULUAKy%2B5AV%2Bk3fW5bfLs9usw4oU2iuqn8%2BLP4Qm1nxX7HcsExYNhmEivNi3%2F%2BNG9rHjhKxkcdTh6eA%2BdWz7B4KiDnYnxzPbrmNfxIgKtbyI0bzWaN8xo90PsuOczJKIDNCdkVfZ3n%2Bqf1u55Rf18Jv277ulf8lToAtqij9HeuxMOPMVgy3mzun5UX25Q8iuiyc2FoBADPVy0X1RwN22CnZaV268XAme0xMropH4ajsp8HsJUIJ1OBx3H8QJC6%2Bvrc%2BxWSFsSBYlhiJIk5amiqtaLouXOc7L1KA0LUoYko0AsFpPpdNp59NFHrSVLltip5m2QKdTky0Xnx%2B54WZ5zwbbfTnkspzsgJeB1%2BYZhzMivdDtT%2FlDX%2FRx7%2FGYkJqH6FSTGjuRtr4Z%2F9JEvMNr3DEs2f5jm5a8gOd7Lvt9fy9i9n2TDK%2F8TgMMP%2FzOjfc%2ByeNOH8m32%2Fu49jP72E6x%2FxQ%2Fn3D%2F77%2F8oIHAcBwmc%2B4pbJuU%2F9oOX5AuWDN1TqNV4%2Bp7rQCgEG1YRbDiX4KK%2FASBhAqZEabiE%2BhULOfn7vyOelFXZf3p4ZFrbo3F55v0rJQsf%2Bym%2FfP1PMQYGaR76Dc1P%2FZrDl26c1fWjOu45RhOLAciMgzfirmJIJLLA7H5mHFpaTxBNgp0dDVViP%2F%2FyibxtnyiuUXJt4fi1JX66Ji8AJHUwTTO%2FNko7cuSI07YBpOmWvc8YMi%2F8KRAMjxai0eFnH6PrmXuRjsWic15K69KLioZYbpCwPZBKpWQmk3GOHTvmdHd3y%2BbXg53V9Cr2%2FYorbuPpe9ziIamM%2B%2FvOy%2F%2BdPf%2F99pJjRVNWVA0ymYw0DMPZsWOH3d3dzVT83PbsA39PdPBJBApb3vTHKRNCs%2BXvf%2FiLLN74fppXvJahngc5%2FchnS2yvlO9reiHzAsuItL%2BcVEZiiQiWCJMYOpnneZu20OhfWtLGViKMDvWQMeWs7J9uC7Vewelj9zJ%2F6cs5ffy%2F3dHiJPwNr88G%2BJ9uZcubtgPw5%2BL9n11By%2FqPlvkFQASWsP5191ZtfzKVmtb2ubh%2BOk5upydyDlER4WT9Ws5PJOjYdxepF1xfEkkq5WvZ0nF%2B%2FYRro28%2Bqamq9%2Fvc0QOAZcjK7c9HGleCiyn%2Blx%2BhGK5sAm6GAMuykNnS3FpfX59sdsAxHBzbHWLkRg9CQDRWUPUwnCDhlgs4vu%2FXDD%2FyI0wnxLzWtfk3GbYNUgHbtqXjOHLXrl0OIF%2F9OnCs8mG9x9eCZWVFO7K%2F1%2F3tZcdKLibp8gHZ09Mje3p6puTntpWX%2FitdT36D0b4dkzLPlG8aKbqf%2BQmNi19OQ8ulnP%2BGP055nun4jYuuwkqP8cz2TzE%2B%2BCS2kSCni5HjNbZP3caxnCn5XbtuxTLGGRt8irr564me3k2gbinJ6FHqFmxhpHc752z9MuOD%2BxgfeIJ0rJuVF30ey3SwbBvbcrBtJ5tVn9o%2FlmXnbS3ZN028gYVz6v%2FcdTLVNhfXz5rdP%2BCxF3wI23I4NW8jtmURinYzv3cXAy2bqubbE05TF3DFbBruay%2FoYlx0oijvl5vmOZXbbxUWc5Yu67Rm9JOgtGy%2Fll9NZUkcG2wxddl7f91KVE8TieQdABx48i7Ov%2FLc%2FChCSvcDOI4j5UTRAmeGue9kv3eqmC%2FP0Hbk1MPULTi%2FOmYF%2FJ13bHWHivEeHrvjxSW%2Fe%2BG27VXxo4NP8eyfPgZSoaHtQpo7X0f3nn8nMXYof%2F5K2ky2xYcPYNsZOs55B6oeJjZygNUX38jjv3gFy8%2F%2Fe4zkAKM9jxJpXIcv0MLJp29luOchdF9jIdk0nQ6FI2fct4w0muadU%2F%2FP2d9M0taXHKLz%2BO9YdfQ3Zb9bcfg3DCw4b85sCQVU%2BoYzhP35QvMluhjV3D9fKtaYKdHFKGpToW3aiRMn5HrAsd1SYU4uQGRfSZlFUdqyJGih%2FLHR4ZNYdmF4Iil8u0XTtLzuAIB0ijLDRfy8toEs18VwI075wo6JugbT8XP%2FGokBmpe9svwiP0P%2BC%2F%2F6AdKJPp7903UYSbfQqS%2B8lA0vua1q%2Bw89%2Bo8IVDa%2F%2Bk40bwQEdOf8kf3jfJtX3Ynmy7bJ%2BlFOoYsB0L7mnYz1P8Lx3V%2BlY93%2FQeQ%2BhOJWOFdUtzDh4Il7EYqGL7LI%2Fby5PiqpZVnO33nnFQhcXYw%2F33l5vp27ryKEh%2FGBx2lsu3jO%2FC8qedF%2FBvy1B3%2FGoxd8jMc3fzA%2Fh9j09HfY%2BugNrOj6HQ9fdH3V%2FNnqYryQ%2Fsrtr1IXgwm6GMV8bfHixe51kP2tUlx2ZkInCGT%2BInCDgBeRrceXE1%2BaTHcgJkAtLoNVxHc%2FoATHQJmgiyHtDKpaWvVUEdXxAUZ6H7II4FsAABWzSURBVEHTNCINKymX9uKM%2BYFgC5tf%2FgMGj91N7%2BEfYyS6CtV8KuQLaSOcJMFIO7o3nI%2B4ljGIqiqugI3jFNr4itpk3DYqckp%2B995v0tCyhVDdUtLRQ9jGEOODTyJIEz21g0y8C6wEtpVC0fxIxyA%2B%2BAR6YAFmeoD4wONYmUEcMz4p%2F6I33Ed0cBcHd3yaC17725J9gCNPfJGefd9ifttFZf4f6nmA47u%2BzAte%2B99V%2BX8mXQwl99SaRf8Kx2LtwZ%2Fxq5ffnhckAjjU%2BWoue%2BwmGuMnWTDyLEONq6viz1YXQym6P2eyv1pdjOLPl%2BPrui7OOeccRWttbRWKAjJbEXfiCi%2BvrhWdzMa2Evljjc0r0bKGyexDTlPLdTEecUAoctLln5GGpRjJXhKDjxJuXMdo30N5XYyDD76bDVd9vyS6aRr4J%2BgaTMcHSazvAeoaluBR5RSrgs6Mv%2Bs3r2HRuX%2FHwhWvwucL0PX01%2FGoTnV8TeD1%2BhD2GFbqFI5jcnL3V%2FEIA49XRxUmHo%2BGz%2BfPtunFcax8G033oGDimYK%2F4YqvY6ZHWHzO36BoOpz%2FUQCa%2FupeQLCgvSBoY6WjaL4IlpFE04Ol9gdCU%2FpnrOe31DUsx6NKoj2%2Fy%2B67fjhnyyc4uOMzHHro71h23j%2Fgr1uEkR5h8NhvGDj2S5au%2F1s0RVblf98MuhjF%2FV1N%2F%2BqZcS5%2B4l8RPj9WsKGE4wTqGGrfTOvpPVy6%2B2buu%2FifSQfmVcyfrS6GpsiK7a9WF2PHZ2Jl9jc0NGgXXXSRR9u0aZM6oICiSjQBiiryOn9CQChQOFk6eohU%2FDShgA9F9bBm%2FavxakXOkwJVg9AEXYzHj7jZV4FEKKJkmL9q8%2Fs4ue9WBg99B7P1QtpXX0O0%2B%2Bc0tF7CvIWX51fhua%2BS3GWq4Qm6BtPxEQIn00U4soAjj%2Fwda190y6TDhzPhB%2Fx%2BnNRRnr3%2FzSAkKze%2FNyt0Uh1%2F%2Bfp30H%2F4p3T9%2BcNZtkJdYwdm6jTW%2BD4i8zewfN3b6Tv8U7r%2B%2FJGSNkZyEHN8H6HmSyfn6woBfd6k9k%2Bc4hGK5KJByfBzJvud5BFal1yFT5PYqSO0LrkSn6fA33Dp5%2Bh59vucfOp6HNtdtKPqDZx70fXUNW1GQlX%2BD8ygi%2BHTZte%2Fb77nrdTHewH4wC%2B38h9vuJ%2BMz9UKufruvyKS7IdAgBUjj7Pi7pfw7Tf%2BCUsLVMQPzFIXw6fJiu2vVhfDp8ky%2FyxcuFBftWqVV2tqalJOSwfFo6BJu7BOPNuvdXVNLFv9KtLpMXqO3IWVSdKycA2LV7yMUKQ1f105EncROA7BCboD2lEH1asgbKvkCSCApuZ1NDXfUmLwC176vbLRuZQSqaoIUR0fJD5dQTgjrN78Ebza5LOLM%2BG%2F8JU%2FzR75wJSzl0r4HStfT9vSK4gN7UWoXuoXbMJIDBAdfpJwaD5eDRav%2Bqt8G1QvdU2bMJIDjJ3eRSiyAG0W9jPtzLQy%2B4f7f4%2FX56N92UvxaKBpFouWvXTCqA2Wr3sHy9e9Y078759BF0PXZsf%2F%2BRvuKnvlmTvTndt%2BU%2F5qMztMr4Tvm6Uuhq5Vbn%2B1uhi6Nrl%2FlixZommBQEA6yQyaT4dk0l1crhQeKJsvLSx6aV10YekF5BQpFktQvB7sdAZ9gi6GTGdQfR6cmIUsWsZaaY45n98IunzPBF2DmfhrL7u15EKZa%2F5c2q9pdTS2XlK4MINtLAi2ldiueepoKG4TaKO5ow0l7P8fs7911atpbrsy956MjZffPqW%2F58r%2FlYGfW%2F0Ls9PFwKnc%2Fsve9VTett4iO%2F%2FtrqL%2F3BWd0n5d15ORSMQMh8OKVl9fbxv7xvEsa8a2LJxUBiGqW1AjARHwIT066VOnUSboYqRPx%2FAtXoCtW8hEJt8BTz%2Fw1hnZGy7%2FoZuMDnpRPTrpU4OoE3QNpuJXs5Kyxn%2F%2B8c%2B5%2BPZpuabhzIr%2Fvjsvqsr%2BW%2F760Yr5a%2FofnpV%2FrKDnL%2BR%2F9%2F4NBoNRVVUtraGhwTIOvaNNCfzklLe5HilUZDKDtKyCuNfEV4dF4VXoGkrAi%2BLzkj4VZcePN5bpYixTv7L08Kl%2FOK4vqMeWKk4ijbRsVl34gxn5GUdBCfpQfV7Sp8bY%2BePzynQNpuJXZr9a49f4JfyvvmFndfzA%2F0v%2BKb1%2F87oYj%2Fzmks7FW%2B8%2Fos%2BPoIZDhaoTFYwejFgK89QAj%2Fxw9ZS6GNt%2F%2FLKV886%2F65A%2BP4ISCSNUpeIIZ8ZSJHoHePgHK6fUNajxa%2Fwaf274xfdviS7GvrsvmJUuhhAiQSW6GFl%2BtboDQoiEUomuQY1f49f4c8qv6WLU%2BDV%2BjT8lv6aLUePX%2BDX%2BlPyaLkaNX%2BPX%2BDldDLK6GGJSXYxP%2FVu9oSiiooKXJSvUskvex468Zdq6%2FR%2B7yZ%2FJFeSo8Wv8Gv85xJeSvn1%2FNbUuxhe%2Fs8hUVYGmiep1MZxsyS1bcvKp10xat%2F%2FDn1PTquoWBM19S7DSE0jp1sO0bWr8Gr%2FGn2O%2BW%2BNDYtnw7EOXl%2BhiiJ%2F97Gfqbb%2FaZHm9Cn6fwKsrbpCocPYiHdd405RkDEkmIxk88OaVGzZs6L322mvNBQsWaO%2F%2FjJXUdYFXdwOQqrrLQCsp%2By2l6xjLcvmGUePX%2BDX%2BXPMNU5LOOGQykv1%2Funy5rusFXQzdoxAOKtRFVMJBBa%2Bu5MvOzTQ8yY0cUmmHeMIhlnCQE%2Br2BwKCUEDF7xf4vAqaKqqs2%2B8an0pJ4km7xn8O8zUlQW%2Fvt%2Bjs%2FDi2HePkiW%2BzbPnHnvf%2BaRvbx8XHvstDy6%2Blv27NrPn157bPShdjbH%2FPWfOPaeXuX8E4drkuhscj8PsVImGVurCCT1dQNTh2srSSzrKOV5W%2FRHXcctle3TXKsmWZLobP68XvEwT8WbZa3RzJtrMjGulg2UqZLkCN%2F9zhJ%2BN7iYQa8PsEYyP7CIfq8HnFWbG%2Fq%2Btr09q%2BZMmH5sw%2FK5JPoQYCLMkcYMx77qzt9%2BvMShfD8CsV239D586qdDE%2B8%2BUtgIJpSnRNlOti5L97IQtTBizBwgWX03XqvjzKtqeavxSqWyMp08WwbB3DlIi0xLJsd%2FhTYQTNJVBMyx0GWbYs0wWoht91%2FKssWfqRs8afC%2FvNzCDpdA%2B6bwEB%2F6JJ2Zn0AKlUDx69CZ9%2F0XPG%2Fr6Bp%2FH5mhiPO%2FT270HX5xGLZ%2Bsx2mn6%2B39OOtWDxAJUdG8rLS1v5ODBL9Gx%2BDNV2T%2BjLkbcmZP%2B9Rlj6ANHSVgG8%2BM7iTW8DrJFEarla5nZ6WKk0rJi%2B0lXqYuRcDBMiWm55e%2FLdTGy85tEykFKiccjcN9m%2BEp0MeY32JMMUVznZDIOiaRDKiPLdTFSL8CybLSkQ%2B4tSTWbO5VxnWOak%2BgCVMH3hz%2FAwJB11vhnYr8SMzne9SVscxiEQCJRVR9LOj6E19%2Fijthsi6PH%2FgXLGMq3URQvHe0fQtWbz4r9tuWK3BiGhe2o0%2FJPnDzA4o7LGByyONb1DB2L3sPAkIVlJjl67IvU11%2BA3%2FcSAoGlaJ4QY2NP8PgTN5NKD1LXaFdl%2F0y6GKF6a07697wT%2F80T6lrax56mY%2FQpRPBp%2BuvXzur6ycRmp4uRGLUqtp%2Fx6nQxhkYsVxfDkGQMp1wXw1LcOYgQuLoYqphUF2NBY%2Fkr2NwIwjAdUmlJKuWU6WIkU5tRMm65LUEhNO%2Fd87d5zrr1t015zK0c5pbld5xyXYCp%2BJXfwWfGHx3eQU%2Fv7UgsAr7FpNInC7ZXwe8%2B8Q3GY4doX%2Fh2GudvJZ3p5%2FChzzA69mVWrf4XAE4c%2FybjsUMsbHtbvs2hg9czMvovrFz15Tn3z9EjN%2BYfBI4jWbb805Py9z%2F2LvfiFDA0clP%2B708P3wQoBAJL8fmWo%2Ftejg24xdJtEOcRCM2n59RnicWdquyfSRejJWqfef9KyaIDd%2FGTzd%2FENE%2FTOvQHWg7%2FnmdXnjOr68dKzk4XIxGzK7f%2FE1XqYoxflbffsmS5LkbdcldZS0qHjJHNgrqrJUp0MY6e3ENP%2F0NIx2Fh80U0zduYF9ywLJmNQLJMFyO0%2BL15p4ui2nkdS27kwLNu6bN0xh2GLlr8OQ4euK7kWC5K5zpjoi7AVPzCRf5FYvF9CCnYcN4PpnzKz5Z%2F6Oi3WNj6VuYveDGjo48xPPq1Etsr5eu%2B9dSJdgLhy0hnHCwriGkFSCR68jzdt44IC0vaWHaQROIUhilnZf90m8%2B3hZHRP9FQfxkjow%2B62fRJ%2BKvWuAFxz9NvZcPGHwLw9O7i%2FbezcvU1ZX4BEOpCVq7%2BbtX2z6SLMRfXz9KhnZz0dBJ1gnTpK9iSSLC06%2Ffc2%2FGBUl2MCvladmRQrS5GOiMrt79qXQwnXxNCMokuRmiJxMy%2B8lBNgVAKAaJYFyOT8RPwraW77wFGonezcqmf%2BsiKfN7Cstwk5URdjCs6Jl8cqmlNBQ2MbLD3eFrLjpUNeSfoAkzFzyerlv4DPd0%2FIDr%2B5JTMM%2BFbZppT%2Fb%2BhruFFRCIXsHbdD6c9z1T8uvpLsYxxjhz6CrH4fhw7SV4XI8uL1F2K5Z%2B8jeNMze%2Ft%2BS9sK04svp9waDWx%2BDP4fIvIpE8SDG0gGt1JZ%2BeniMcPEYvtwUj3sWTpR7Fsd17rvoefXBej2D%2BWZedtLd030T0tc%2Br%2FGXUx5uD6WXviFzy67F3YNnSH12JbFmHrFAtG9tNXNM2olD9rXQynCvur1cWwJz4sJ9HFcN8%2BgCWKV2LJEl0Mn3cxggYSSbdS8eHj97N%2BdWdhCCpz87FJdDH%2Bh7fo%2BOOEQuvnnLv7qTcDYBr97Hn6bSW%2F23jef1XFisX2c%2FTIjYCgLrKJxqar6O%2F9Mal0V1VtJttSiaM40qC15Q2oWpBE4hjLl1%2FHnt3vZPHid3P0yBDR6C5CgVXoehN9vT8kOvYEmqd%2BznxlOQaaovN82XyZEVYNPsiagfvLfrd64P4pA8Rsthl1MarYqtbFmGbTTpw4IZdvKYpSE0p6lehi2BKhBvLHxmKnsB1ZMjwpVMct1cXIJlXLh5fZg0JMf6x4GDeZLsBU%2FPznMIZparpi2jaz4Z%2B36b%2FIpAc5cuRGTHMQAK93Eees%2BVLV%2FK7jNyOEwtpzb0XTQwAMnBL5rPpMbYr9N5Hf0rqN8dguentvp63tLYVMvaIiBCiKB4CR0T%2BBouL1txXaCFHWPxP5u5%2B6GiFcSYSnd78l3%2B7p3W8BqSCERiK2l%2Fr6zXPm%2F5l0Mc70%2BtnYdw9%2FWvF37Fx2Tf7YC7p%2BxJUHb2bV6e1sX%2F3hqvmz1cU4T%2Byu3P4qdTEm1i0u18XI5WVEQXZvsk4orPPO6mKoev5YvoCnWl63v9%2Ba%2BuZVFdWV48Is08UAA2XCE0fK6vgA0dEn0DSVcHhZRW8cquX7AwtYt%2F6rDA3ez8DpX2EaPVOuRJ2KL6WDIE3A34LuCxU9dYddXQwFVxdjmjaqOjW%2Ff%2BAHRMLnEQwuIpPuwnFGicf3IRSD%2BPhTGEYvgjS2nUKofpAGieRedM88LHuIZGIPtjOMdJKT8jef%2FyNi0b0cO%2F6vbNj4%2FZJ9gBNdt9Df9yMaG8sDxOjIDrpPfpv1G2%2Bvyv8z6mIos%2B9f4Vhs6LubOzbdXMJ5tu2lXHH0m8zLnKI5cYTT4c6q%2BLPWxVAqt79qXQyl3P4yXQxFcVW9J67AKtbF0DQwrXT%2BWH3dMjzZsubFymwTdTH%2B8KSYMkqHwx2YZj%2Fp1FMEA6sZjz6W1zs4dvSTrFnzldIkEOW6ANPxAZKJnUTCHegeMePTazb8vXveRWvr22hbeCX%2BgJ%2Be7u%2BXnWtmvopX96KIGNI5jSNNek%2Fehq5ZoOloqo3i0fB5fYhJ2kjVg6raKEKblL9mzeexrTE09XUoqga8x311Pc9N2s5vKuhMWkYMTQ9jWUm07EqeSvwTi%2F%2BJSHgxukcQTzyU3wdYseL9HD36bxw%2Fdj1LOt6P19%2BGYYwyMvRHTg%2FdS8fiv8Gjiar8P5MuRnEfVNO%2FXjPOpUdvRfh8WMEGdK2Io9RxumkDbePPcPnJ2%2FjdOR8n5W2smD9bXQxPkQ0z2V%2BtLsaD7zhWZn%2BJLsaxqMCjuZoWatF74Im6GIZ5gnRmxNXFUDRWL7sKn1cpCRCOlGW6GA%2FuFdlhbPndtaLz7fT0%2FpCRoZ9g12%2Bmre2NxGO%2FI1J3Pg0NF%2Bf57hTInc5M1AWYju%2FOw3oJh%2BZzout6Vq26ccoLarb8gN%2BPpJujhz%2Forjhd9tYSuyvlL136JgYH7qLn5A1Z%2FyvURdoxzWGkdQRfeA1Llr6Rwf7yNoYxhG0cxhdaMwVfRfHPr2zi6a3L%2Fhuqyn5pn6S5%2BVJ8XgVpn8jv57Zz11xH36k7OdX7rzjSzW2pWh2rV32UcGRd1f6fURdjQh9Uyn%2FHUx%2BkPt0HwN8%2F%2Fgb%2B%2FeKfkc7mYq559N3UWYMQCLAqtZtVT76FWy69C1P1V8SfrS6G36dUbH%2FVuhhZPxXzS3QxTsRd4Q1dE6jZb3PmXptEQvNZvPAKMkaUvtP3Y1tJmuevoL11KwF%2FU35u4cjCtzon1u13F165UxNFlM59fN5zmTfvptK538aby6J%2BIQFaHR%2FAp6sgxuhc%2Fp6SZb9zxd%2B8%2BVu5GD3lqKESftvCV9DSegnx2LOgeKkLr8PMnCYW30coOA%2BvV7Co%2FRW0tl5CPHYAKXQi2TbR8T0EA%2FPweETV9lcyqprJ%2FtHRP%2BH1eWlr3YrHI9A8DgvbLs%2BPMPOvDZdug6Xb5sT%2FM%2BlieHUxK%2F5PLvvP8tFK9t%2BfXP6jMv8ogKdC%2Fmx1MTweUbH91epieHUxqX%2Fyuhi5%2FALF4qXZbcOawpKK5qZJEkw5IVVc%2BT0EZboYbo6jdGRSyVai4Zs9gRCyTBdgJv7qc754Vvlzab%2BmRmhoKMjgef0t%2BVWU%2BameGqG%2B%2FoJCx%2FtaaPK1uAFa%2Fs%2FYP3%2Fei2hqelE%2BJ7X23Jv%2FYv37fOPPRhejGv5Fr3wgb%2BOJotXoX%2Fp2sfUnyj9Lll%2Bmi%2BF%2B3xyE5Q4zlCq%2FT577J%2FeudqIuhm2DjSzLbzyz%2F%2F0zPMEk5669pSzHMVEXYCq%2BqMz0Gv95yl%2Bx4qvT8g1Tzor%2Fwe0vq%2BgtSe5N%2Fte3%2FrZi%2Fsq998zKP6aUfzH%2Fl%2Bli2IPva2PBLaccR5a90qp0y8F3%2Ff6Skrr6iqKIzsZblj7T%2F97jEy1e1vmNGbn5FWTZT7TrD5Xzq%2F8QNX6ND1%2B%2B8N7quEWrHP%2Bf8w9ZXYwTT76m0zTdb4wZxix%2BTMmDv9h4s23bO4rq6meEEOm2traRwQNvXmnk%2BLP8efCXNX6NX%2BP%2FJfl5XYydO3f2777%2F4mXxeLzTcZyVs6mrryjKQeDIZHX7f%2FGLX%2FTtvu%2BiZfF4vNOyrJWO47QBFfGBhKIoPZqm1fg1fo3%2FF%2BRr2eq19mc%2F%2B9nUj370o1OpVCpqWdax2dTV1zRtyrr9W7duTfb29ub5QNV8RVFq%2FBq%2Fxv8L8mu6GDV%2BjV%2FjT8n%2F%2FwEPV3J1%2Fv5S1QAAAABJRU5ErkJggg%3D%3D";
// var dropdownimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAA8CAYAAABmdppWAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QMVFiU57U7%2FAQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAFv0lEQVRYw6WYy68cRxWHv1NdPa87viRZGKRETmQ7NyLIXkQoLLJBzhUSbAzICsg7EGyTKPkDyJIIRcq1F1llQTY3jsTGS4iyiZyAgBXyziI4YAucGJtrz6O7q85hUd3zujP2jFJSq0fdVb86VefxVY%2BceemaATgBhM2agcHbZrz90QcnrwPImZeuWZ4L%2FZ4j97K2qJkxCsLdClrjAHD2w%2FdPXpbdn1yzrSMZx59ssd3PkqVrtKgwGim370Y%2Bv60wrFDlKQ%2BAd%2BQtR7vjyFYp2nRLREDVyFsOnFDEwN9DTq%2BoXvUAVYRhAfnYELE5HUEwbFGzXjbghVbb0c0U4Lw3oFThYGSoGM7VI5PaRKxRFJm8QgFVKCNEAw9HvRkUAQ5GRjBFZDNXqxqDMQSELIlCoXBvbBQRpFneosOb9Vp61xgeFUaFUlTQphYsVbhXgA%2FWjOHWn35cO0Aws0OWH33%2Bd6hCUKgCRE3vk1NUiGXaH6mtO7j9bzqPP7tU8PGnT3FvDGrJMYpMVuMAIkJpQhGn16Pf%2FZTB538jhEiMSgiRECLfOP4tbtsrFFEoVQgmKEKsJZOg1A%2BlvuoOj774Z8Y3rk4se2LnNF%2B61wh1XxUh1P2DLAjGulOYEQ0iHHnxL4xvXOWJndP8x70%2BmSzM9q2vyR4GFlxax5vVWdHb%2FSs3l4TMsgDzzR6KTKpHEpsJDaYRM%2F0hIPXdrEmbWlCdkDkmhUEW06wWNlmS1wYREDUI3PIi4L2w1RFauaysNnMGz8xoEYpgbMeAq9j3AmS5Y6sn9DsyX2htmbnz79RAisj2rTF5P7vgDRgFuDOCYWU4t34ue5SjPnDkzoC8K%2BcuvfPUP7wZnBrcwY0aDGxWHHzGxf4jfu%2B9vWOfiYj6J795YlI0N9SqvUs0CCKiAPKzX5l5D702eL8%2Bp9RSUSgDhAAYZ999Qy7Lz98w63Xh2Neh35uWeLPpfc7b9TMzGBVwcB%2B%2B%2FB8UJVOm5Bm0cmi3YA2kJKYY5D71DxG%2BuAumJKZEhaKCvDi8j7NWLoueLEuG%2BAxi5HzK5QjD8TwzVraFnFdL4%2BtJE1NCTPthtvnhQeu9jJrGJwsDjAuIcRM4gXP1dpXTsb7Zm6JMYdC0P%2Bx%2F54FM2f3pHzFLgjGmVWZuxkLV6XKdezhTRuNkyGJ4ucXzSnN9%2FxfXVzLl6RNvEjUZsRinbnZPZn%2Brwg9%2B%2Ba9DTNk5%2BZu5votjXbPEVa0RbcSWtdnxfnGGVaIP8%2FihJX%2FVprYQNm6mfLk6VxfzWm3JciU5MUt9a6Zk0GmlArFOm50w1mcbA0LFvgdoeeh1oNNOVjaWNYNWWevq%2BCsqGAyh3eNCOn2FVByqsFnVdgJ5DkUBnRbn3nqdxBQnKVti3PzTIiu5%2BLU%2Be79%2BmcSUf378CQ%2BLxYdwJZoR5JUXElN2z1yxPBe2%2Bp5Wvv7Xj5lRlkZZKEUZAc7%2B%2FsMXLsv3dq%2FYkX7O8RM9trd9Ovc7MGVyn6uv9TM1YzSI%2FPdOyRe3SgbDMGWKz6HVdnS6GZlbjUyZgYqZ0W45XCaEYJSlUlZaMyVCMVZGo7iEKWnw8g%2BVxJROx5FlAhXnEwIqY3A%2FTKD0QKTIvNWqaXxzlvdmUFXKcBjTwWfDsNFoDIeRGG3KlCoYg0GkqmxtQdU0eYzGeJzGTouDNg%2BnLr16%2FeUHMuXZY3uJKdGoKiMEw2WzTLHp18Y6TBncVAxL4bWUKfVszXVqZ38lU7o3zhKjoXFDppx%2B5oNDTOnd%2FNFXY8qpnUsTpnRv%2FBAzm8blEqbI7pkrFsPhPN30Mxcg842XzZYm%2F2bfzZB5aQTBOZmY7tz07LJqr2aXGwJkmU2ZkueObs%2FRbrvNmRKhrBQnMBrHfS8CrbbQ3%2FL0ehniNmOKWiosB%2FcqtrfzC%2Bk%2Fh8K4PwiUpSJuM6a0uxnDUaDbzc7tX%2Fp2Yoq4VM9C0I09OxzHi4891tr77XvPfSYi%2Bn%2FPbnLTC%2Ba%2BTQAAAABJRU5ErkJggg%3D%3D";

var synbuttons="<span id='synbuttons'><input type='submit' onclick='return false;' id='blick_sync_upload' value='Upload'/><input type='submit' onclick='return false;' id='blick_sync_download' value='Download'/></span>";
var neulist=[];
var aktstand=0;
var qlist=["draw","meep","quest","questdis","tg","questarch"];
var mystyle;
var lastconf=0;
var imgsizeint;
var ladeabbruch=false;

var firstauthor="";
var firsttitle="";
var firstid="";
var nonestand=0;
var i=0;
var tempdum;

/*
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window.localStorage !== null;
    } catch (e) {
        return false;
    }
}

function c_speichern(name, wert){
    var myDate = new Date();
    myDate.setDate(myDate.getDate()+1);
    document.cookie = name + "=" + encodeURI(wert) + ";expires=" + myDate +";domain=.questden.org;path=/kusaba/;";
}

function c_laden(name,def){
    var wert=document.cookie.indexOf(name+"=");
    if(wert==-1)return def;
    wert=document.cookie.substr(wert+name.length+1);
    return decodeURI(wert.substring(0,wert.indexOf(";")));
}
function s_speichern(name,wert){
    localStorage.setItem(name, wert);
}
function s_laden(name,def){
    var ret=localStorage.getItem(name);
    if(ret===null)return def;
    else return ret;
}

if(false){
    typeof GM.getValue!= "undefined"){
		speichern=GM.setValue;
		laden=function(val, def){
            var retWert=null;
            if(def===null)def="";
            (async function(){
                console.log("request",val);
                retWert=await GM.getValue(val,def);
                console.log("responds",val,retWert);
                if(retWert===null)return def;else return ret;
            })();
            var cnt=1000;
            while(retWert==null){
                if(--cnt<0)break;
                //console.log(val,retWert)
            }
            return retWert;
        };
}else if(supports_html5_storage()){
    speichern=s_speichern;
    laden=s_laden;
}else{
    speichern=c_speichern;
    laden=c_laden;
}
*/
//Optik
function gros(){
    addstyle("/*blick_gros*/"+
             "#delform .bbcode_quote{"+
             "	line-height:1.5em;"+
             "	font-family:/*schrift*/"+schriftreihe+"/*schrift*/;"+
             "	font-size:/**/"+groeinst+"px/**/;"+
             "}"+
             "#delform h2.title {"+
             "	font-family:/*schrift*/"+schriftreihe+"/*schrift*/;"+
             "	font-weight:bold;"+
             "	font-size: /**/"+groeinst+"px/**/;"+
             "}"+
             // ".reflink a{text-decoration:underline;}"+
             "#delform {"+
             "	line-height:1.5em;"+
             "	font-family:/*schrift*/"+schriftreihe+"/*schrift*/;"+
             "	font-size:/**/"+groeinst+"px/**/;"+
             "	margin-left: 10px;"+
             "	margin-right: 7%;"+
             "	margin-top: 15px;"+
             "	margin-bottom: 25px;"+
             "	text-align: left;"+
             "	letter-spacing: 1px;"+
             "	color: #003;"+
             "}/*blick_gros*/");
}
function absatz(){
    addstyle("/*abs*/"+
             "#delform>br,#delform>hr {"+
             "display:none;"+
             "}"+
             (window.location.href.search(/\/[\d\+]+\.html/)==-1?"#delform>div{":"#delform{")+
             (!invert?"	box-shadow:0px 0px 5px 3px #000,5px 5px 15px 5px #fff,inset 0px 0px 5px #fff;":"	box-shadow:0px 0px 5px 3px #fff,5px 5px 15px 5px #000000,inset 0px 0px 5px #000;")+
             "	margin-bottom:30px;"+
             "	border-radius:5px;"+
             "	border: 2px groove #000;"+
             "	padding:5px;"+
             "}"+
             ".thumb{"+
             "	box-shadow:0px 0px 15px "+(invert?"#fff":"#000")+";"+
             "	border-radius:10px;"+
             "}"+
             ".reply{"+
             "width: 100%;"+
             "}"+
             ".userdelete{"+
             "clear:both;"+
             "}"+
             "#delform>div {"+
             // "display: inline-block;"+
             "padding: 10px;"+
             "width: 98%;"+
             "}"+
             "#delform>span {"+
             "	margin-top:10px;"+
             "}"+
             "#delform img.inlineimg {"+
             "	vertical-align: middle!important;"+
             "	margin: 0 4px;"+
             "}/*abs*/");
}
function invertcolor(){
    addstyle("/*invert*/"+
             "html, body{"+
             "background-color:#002!important;"+
             "}"+
             "#delform a {"+
             "color: #BB5555;"+
             "font-size: 14px;"+
             "font-style: italic;"+
             "text-decoration: underline;"+
             "}"+
             "#delform, #delform .reply, #delform blockquote{"+
             "background-color:#001;"+
             "color: #FFD;"+
             "}"+
             "#delform blockquote{"+
             "text-shadow:0 0 20px white;"+
             "}"+
             "#delform span.spoiler{"+
             "text-shadow:none;"+
             "}"+
             "#delform .highlight{"+
             "background-color:#003;"+
             "}"+(abseinst?(
        ".thumb{"+
        "	box-shadow:0px 0px 15px #fff;"+
        "	border-radius:10px;"+
        "}"):"")+
             "#delform h2.title{"+
             "color:#fdd"+
             "}/*abs*/"+(abseinst?(
        (window.location.href.search(/\/[\d\+]+\.html/)==-1?"#delform>div{":"#delform {")+
        "box-shadow:0px 0px 5px 3px #fff,5px 5px 15px 5px #000000,inset 0px 0px 5px #000;"+
        "}"):"")+
             "/*abs*/#delform {"+
             "color:#ffd"+
             "}"+
             "/*invert*/");
}
function inserttag(tag,col) {
    if(tag=='icon'&&col===null)return;

    var field=document.forms.namedItem("postform").elements.namedItem("message");
    var browser=navigator.appName;
    var b_version=navigator.appVersion;

    if (browser=="Microsoft Internet Explorer" && b_version>='4'){
        var str = document.selection.createRange().text;
        field.focus();
        var sel = document.selection.createRange();
        if(tag!="icon")sel.text = "["+tag+(tag=="color"?"="+(col===null?"#000000":col):"")+"]" + str + "[/"+tag+"]";else sel.text=(col===null?':icon:':':'+col+':');
        return;
    }

    var startPos = field.selectionStart;
    // var endPos = field.selectionEnd;
    var before = field.value.substr(0, startPos);
    var selected = field.value.substr(field.selectionStart, (field.selectionEnd - field.selectionStart));
    var after = field.value.substr(field.selectionEnd, (field.value.length - field.selectionEnd));
    if(tag!="icon")field.value = before + "["+tag+(tag=="color"?"="+(col===null?"#000000":col):"")+"]" + selected +"[/"+tag+"]" + after;else field.value = before + (col===null?':icon:':':'+col+':') + after;
}
function showcp(){
    var sw=document.getElementById("BLICKcolorpicker");
    if(sw.style.display!="none")sw.style.display="none";else sw.style.display="block";
}
function decimalToHex(d,mod) {
    var hex = Number(d).toString(16);
    hex = (mod===0?"000000":"00").substr(0, (mod===0?6:2) - hex.length) + hex;
    return hex;
}
function GetOffset (object, offset) {
    if (!object) return ;
    offset.y += object.offsetTop;
    GetOffset (object.offsetParent, offset);
}
function GetScrolled (object, offset) {
    if (!object)
        return;
    offset.y -= object.scrollTop;

    if (object.tagName.toLowerCase () != "html") {
        GetScrolled (object.parentNode, offset);
    }
}
function drag(el,event,mode){
    var offset = {x : 0, y : 0};
    GetOffset(el,offset);
    GetScrolled(el,offset);
    offset.y+=el.firstChild.offsetHeight/2;
    if((event.clientY-offset.y)<-3||(event.clientY-offset.y)>el.offsetHeight-3)return;
    el.firstChild.style.top=(event.clientY-offset.y)+"px";
    var prev=document.getElementById("BLICK_prevcol");
    if(mode===0)prev.setAttribute("style",prev.getAttribute("style").replace(/hsl\((.*?),(.*?),(.*?)\)/,'hsl('+((event.clientY-offset.y+3)/el.offsetHeight*360)+',$2,$3)'));else
        if(mode==1)prev.setAttribute("style",prev.getAttribute("style").replace(/hsl\((.*?),(.*?),(.*?)\)/,'hsl($1,'+((event.clientY-offset.y+3)/el.offsetHeight*100)+'%,$3)'));else
            if(mode==2)prev.setAttribute("style",prev.getAttribute("style").replace(/hsl\((.*?),(.*?),(.*?)\)/,'hsl($1,$2,'+((event.clientY-offset.y+3)/el.offsetHeight*100)+'%)'));
    var col=prev.style.backgroundColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
    prev.innerHTML="#"+decimalToHex(col[1],2)+decimalToHex(col[2],2)+decimalToHex(col[3],2);
}

function showipick(){
    var sw=document.getElementById("BLICKipickWrap");
    if(sw.style.display!="none")sw.style.display="none";else{
        sw.style.display="block";

        if(sw.getAttribute("filled")!=1){
            geticonlist();
            sw.setAttribute("filled",1);
        }
    }
}
/*
		#wrapper{display:flex; flex-flow: row wrap;}
		.row{max-width:200px;display:flex;margin: 5px;align-items: center;}
		.row div{overflow-wrap: break-word;}
		.row img{flex-grow:0;flex-shrink:0;}

		<div id='wrapper'>
		  <div class='row'>
			<img style='width:100px;height:100px;display:inline-block;background-color:red'/>
			<div>Eine Beschreibung 1Eine Beschreibung </div>
		  </div>
		</div>
	*/
function isertTagIcon(){
    inserttag("icon",this.getAttribute("icon"));
}
function MouseEnterIcon(){
    this.src="http://questden.org/kusaba/icons/thumb/"+this.getAttribute("realsrc");
    this.style.width="";
    this.style.height="";
}
function imageLoadeIcon(){
    this.style.width="";
    this.style.height="";
}
async function geticonlist(){
    aktfrag=true;
    icondatabasestring="";
    GM.xmlHttpRequest({
        method: 'GET',
        url: "http://questden.org/kusaba/icons/thumb",
        onload: function(data) {
            var rex=/alt="\[IMG\]"><\/td><td><a href="(.*?)">/gi;
            var row="";
            // var html="";
            var ipick=document.getElementById("BLICKiconpicker");
            var erow, eimg,edesc;
            var rowID;
            while((row=rex.exec(data.responseText))!==null){
                rowID=row[1].substring(0,row[1].lastIndexOf(".")-1);
                erow=document.createElement("div");
                erow.className="BLICK_iconpick_row";
                erow.setAttribute("icon",rowID);
                erow.addEventListener("click",isertTagIcon,false);
                eimg=document.createElement("img");
                eimg.style="width:50px;height:50px;border:1px solid black;display:inline-block;margin-right:2px;";
                eimg.setAttribute("realsrc",row[1]);
                eimg.addEventListener("mouseenter",MouseEnterIcon,false);
                eimg.addEventListener("load",imageLoadeIcon,false);
                erow.appendChild(eimg);
                edesc=document.createElement("div");
                edesc.innerHTML=row[1];
                erow.appendChild(edesc);
                ipick.appendChild(erow);
                // icondatabasestring+=":"+row[1];
            }

            iPickerScroll(0);
            // aktfrag=false;
            // insertcode("var icondatabasestring='"+icondatabasestring+"';"+autofillicon.toString());
            // ipick.innerHTML="<input id='BLICKiconinput' type='text' style='width:150px' onkeyup='autofillicon(event);'/><div onclick='"+
            // "var s=document.getElementById(\"BLICKiconlist\");if(s.style.display!=\"none\")s.style.display=\"none\";else s.style.display=\"block\"; "+
            // "return false;' id='BLICKiconlistbut'><div id='BLICKiconlist' style='display:none'>"+icondatabasestring.replace(/:/g,"</div><div onclick='document.getElementById(\"BLICKiconinput\").value=this.innerHTML;autofillicon(null);'>").substring(6)+"</div></div></div><img alt='icon' id='BLICKiconimg' onclick='inserttag(\"icon\",this.getAttribute(\"curval\"));return false;' src='http://www.questden.org/kusaba/icons/thumb/0u0plzs.png'/>";

            // ipick.innerHTML=html;

        },onfailure:function(){aktfrag=false;}});
}
// function autofillicon(el){
// var zwistr;
// if(el!==null){
// if(el.keyCode<48)return;
// var ind=icondatabasestring.indexOf(":"+this.value.toLowerCase());
// if(ind==-1)return;
// var canz=el.target.value.length;

// zwistr=icondatabasestring.substring(ind+1);
// if(zwistr.indexOf(":")!=-1)zwistr=zwistr.substring(0,zwistr.indexOf(":"));
// el.target.value=zwistr;
// el.target.selectionStart = canz;
// el.target.selectionEnd = zwistr.length;
// el.target.focus();
// }else{
// zwistr=document.getElementById("BLICKiconinput").value;
// }
// document.getElementById("BLICKiconimg").src="http://www.questden.org/kusaba/icons/thumb/"+zwistr;
// document.getElementById("BLICKiconimg").setAttribute("curval",zwistr.substring(0,zwistr.indexOf(".")-1));

// }
var last_known_scroll_position=0,ticking=false;
function iPickerScroll(e) {
    if (!ticking) {
        setTimeout(function(){
            var ipick=document.getElementById("BLICKiconpicker");
            last_known_scroll_position = ipick.scrollTop;
            var imgs=ipick.getElementsByTagName("img");
            i=13;
            var off=imgs[i].offsetTop-last_known_scroll_position;
            for(i=0;i<imgs.length;++i){
                off=imgs[i].offsetTop-last_known_scroll_position;
                if(off<ipick.clientHeight && off>0-imgs[i].clientHeight){
                    imgs[i].src="http://questden.org/kusaba/icons/thumb/"+imgs[i].getAttribute("realsrc");
                }
            }

            window.requestAnimationFrame(function() {
                // var rect2 = ipick.getBoundingClientRect();
                // for(i=0;i<imgs.length;++i){

                // var rect = imgs[i].getBoundingClientRect();
                // if(rect.top <ipick.scrollTop + rect2.height)imgs[i].src=imgs[i].src2;
                // }

                ticking = false;
            });
        },500);
    }
    ticking = true;
}
function postf(){

    addstyle("/*postform*/.Blickstylecont{display:inline-block;width:24px;height:24px;overflow:hidden;}"+
             ".Blickstyle{background-image: url('"+stylebuts+"');height:24px;background-repeat:no-repeat;display: block; height: 24px; position: relative; width: 320px;}"+
             ".Blickstyle:hover{background-position: 0px -24px;}"+
             ".Blickstyle:active{background-position: 0px -48px;}"+
             "#BLICKcolorpicker>div{display:inline-block;vertical-align:top;}"+

             ""+
             ".BLICK_options_left{width:200px;display:inline-block;vertical-align:middle;}"+
             ".BLICK_options_left > label {display: block;font: 12pt georgia;text-align: justify; width: 200px;}"+
             ".BLICK_options_right input[type=text]{width:80px;}"+	".BLICK_options_right{text-align:right;width:100px;display:inline-block;vertical-align:middle;}"+
             "#devopts br{clear:both!important;margin-top:10px;display:block;}"+
             ".coll3{display:inline-block;font-size:9pt;text-align:center;vertical-align:middle;width:150px;}"+
             ".coll3 input[type=text]{width:100px;margin-top:-5px;}"+
             ".coll3 p{margin-top:0px;display:inline-block;margin-right:5px;vertical-align:middle;}"+
             ".BLICK_checkwrap {width: 35px;height: 15px;background: #333;margin: auto;border-radius: 50px;position: relative;display:inline-block;margin-right:5px;border:2px inset black;}"+
             " .BLICK_checkwrap label {display: block;width: 20px;height: 14px;border-radius: 50px;-webkit-transition: all .5s ease;-moz-transition: all .5s ease;-o-transition: all .5s ease;-ms-transition: all .5s ease;transition: all .5s ease;cursor: pointer;position: absolute;top: 0px;z-index: 1;left: 2px;background-color: #B2C4AE;}"+
             ".BLICK_checkwrap input[type=checkbox]{display:none;}"+
             ".BLICK_checkwrap input[type=checkbox]:checked + label {left: 14px;background-color: #26ca28;}");

    insertcode(inserttag.toString());
    insertcode(showcp.toString());
    insertcode(GetOffset.toString()+GetScrolled.toString()+decimalToHex.toString());
    insertcode(drag.toString());
    // insertcode(showipick.toString());
    addstyle("#pal a {display: inline-block;	height: 20px;width: 20px; margin: 2px;}#pal {width: 160px;}");

    //4ms since start
    var farbar=["ff0000","00ff00","0000ff","ffff00","00ffff","ff00ff"];
    var cp=document.createElement("div");
    cp.style.display="none";
    cp.style.height="100px";
    cp.id="BLICKcolorpicker";
    var inh="<div id='pal'>";
    var i=0;
    for(i=0;i<farbar.length;i++)inh+="<a href='#' style='background-color:#"+farbar[i]+"' onclick='inserttag(\"color\",\"#"+farbar[i]+"\");return false'></a>";
    for(i=0;i<farbar.length;i++)inh+="<a href='#' style='background-color:#"+farbar[i].replace(/0/g,"8")+"' onclick='inserttag(\"color\",\"#"+farbar[i].replace(/0/g,"8")+"\");return false'></a>";
    for(i=0;i<farbar.length;i++)inh+="<a href='#' style='background-color:#"+farbar[i].replace(/f/g,"8")+"' onclick='inserttag(\"color\",\"#"+farbar[i].replace(/f/g,"8")+"\");return false'></a>";
    for(i=0;i<farbar.length;i++)inh+="<a href='#' style='background-color:#"+decimalToHex((16777215/(farbar.length-1))*i,0)+"' onclick='inserttag(\"color\",\"#"+decimalToHex((16777215/(farbar.length-1))*i,0)+"\");return false'></a>";
    inh+="</div>";
    cp.innerHTML=inh;

    var ipickWrap=document.createElement("div");
    ipickWrap.id="BLICKipickWrap";
    ipickWrap.style.display="none";
    var ipickSearch=document.createElement("span");
    ipickSearch.innerHTML="Search:";
    ipickWrap.appendChild(ipickSearch);
    ipickSearch=document.createElement("input");
    ipickSearch.type="text";
    ipickSearch.id="BLICKipickText";
    ipickSearch.addEventListener("keyup",function(){
        var items=document.getElementsByClassName("BLICK_iconpick_row");
        var tex=document.getElementById("BLICKipickText").value.toLowerCase();
        for(i=0;i<items.length;++i){
            if(items[i].getAttribute("icon").toLowerCase().indexOf(tex)==-1)items[i].style.display="none";
            else items[i].style.display="";
        }
        iPickerScroll(0);
    },false);
    ipickWrap.appendChild(ipickSearch);
    var ipick=document.createElement("div");
    ipick.id="BLICKiconpicker";
    ipickWrap.appendChild(ipick);
    // ipick.style.display="none";
    // ipick.innerHTML="<input id='BLICKiconinput' type='text' style='width:150px' onkeyup='autofillicon(event);'/><div onclick='"+
    // "var s=document.getElementById(\"BLICKiconlist\");if(s.style.display!=\"none\")s.style.display=\"none\";else s.style.display=\"block\"; "+
    // "return false;' id='BLICKiconlistbut'><div id='BLICKiconlist' style='display:none'>"+icondatabasestring.replace(/:/g,"</div><div onclick='document.getElementById(\"BLICKiconinput\").value=this.innerHTML;autofillicon(null);'>").substring(6)+"</div></div></div><img alt='icon' id='BLICKiconimg' onclick='inserttag(\"icon\",this.getAttribute(\"curval\"));return false;' src='http://www.questden.org/kusaba/icons/thumb/0u0plzs.png'/>";

    // geticonlist();
    ipick.addEventListener('scroll', iPickerScroll,false);


    addstyle(""+
             "#BLICKipickWrap{}"+
             "#BLICKiconpicker{width:400px;margin:auto;height:100px;background-color:white;overflow-y: scroll;display:flex; flex-flow: row wrap;}"+
             "#BLICKiconpicker .BLICK_iconpick_row{width:30%;display:flex;margin: 5px;align-items: center;cursor:pointer;}"+
             "#BLICKiconpicker .BLICK_iconpick_row:hover{background-color:#fdd;}"+
             "#BLICKiconpicker .BLICK_iconpick_row div{word-break: break-all;}"+
             "#BLICKiconpicker .BLICK_iconpick_row img{flex-grow:0;flex-shrink:0;}"+
             // "#BLICKiconpicker>*{display: inline-block;vertical-align:middle;}"+
             // "#BLICKiconimg{margin-left:10px;cursor:pointer;}"+
             // "#BLICKiconlistbut{cursor:pointer;display: inline-block;vertical-align:middle;height:20px;width:20px;background-image:url('"+dropdownimg+"');}"+
             // "#BLICKiconlistbut:hover{background-position:0px -20px;}"+
             // "#BLICKiconlistbut:active{background-position:0px -40px;}"+
             // "#BLICKiconlist{overflow-x:hidden;overflow-y:auto;border:2px inset #228;display:none;width:175px;height:100px;background-color:white;position:relative;left:-155px;top:20px;}"+
             // "#BLICKiconlist div:hover{background-color:#22f;color:#88d;}"+
             ".BLICK_slide{position:relative;top:-3px;z-index:9;left:-2px;width:20px;height:3px;border: 3px outset black;}"+
             "#BLICK_scont1{ background: rgb(225,69,29); /* Old browsers */background: -moz-linear-gradient(top,  rgba(225,69,29,1) 0px, rgba(253,255,71,1) 17%, rgba(134,249,254,1) 50%, rgba(41,0,248,1) 65%, rgba(110,0,248,1) 74%, rgba(227,61,249,1) 83%, rgba(225,68,35,1) 100%); /* FF3.6+ */background: -webkit-gradient(linear, left top, left bottom, color-stop(0px,rgba(225,69,29,1)), color-stop(17%,rgba(253,255,71,1)), color-stop(50%,rgba(134,249,254,1)), color-stop(65%,rgba(41,0,248,1)), color-stop(74%,rgba(110,0,248,1)), color-stop(83%,rgba(227,61,249,1)), color-stop(100%,rgba(225,68,35,1))); /* Chrome,Safari4+ */background: -webkit-linear-gradient(top,  rgba(225,69,29,1) 0px,rgba(253,255,71,1) 17%,rgba(134,249,254,1) 50%,rgba(41,0,248,1) 65%,rgba(110,0,248,1) 74%,rgba(227,61,249,1) 83%,rgba(225,68,35,1) 100%); /* Chrome10+,Safari5.1+ */background: -o-linear-gradient(top,  rgba(225,69,29,1) 0px,rgba(253,255,71,1) 17%,rgba(134,249,254,1) 50%,rgba(41,0,248,1) 65%,rgba(110,0,248,1) 74%,rgba(227,61,249,1) 83%,rgba(225,68,35,1) 100%); /* Opera 11.10+ */background: -ms-linear-gradient(top,  rgba(225,69,29,1) 0px,rgba(253,255,71,1) 17%,rgba(134,249,254,1) 50%,rgba(41,0,248,1) 65%,rgba(110,0,248,1) 74%,rgba(227,61,249,1) 83%,rgba(225,68,35,1) 100%); /* IE10+ */background: linear-gradient(to bottom,  rgba(225,69,29,1) 0px,rgba(253,255,71,1) 17%,rgba(134,249,254,1) 50%,rgba(41,0,248,1) 65%,rgba(110,0,248,1) 74%,rgba(227,61,249,1) 83%,rgba(225,68,35,1) 100%); /* W3C */filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e1451d', endColorstr='#e14423',GradientType=0 ); /* IE6-9 */}"+
             "#BLICK_scont2{ background: rgb(128,126,126); /* Old browsers */background: -moz-linear-gradient(top,  rgba(128,126,126,1) 0px, rgba(224,68,29,1) 100%); /* FF3.6+ */background: -webkit-gradient(linear, left top, left bottom, color-stop(0px,rgba(128,126,126,1)), color-stop(100%,rgba(224,68,29,1))); /* Chrome,Safari4+ */background: -webkit-linear-gradient(top,  rgba(128,126,126,1) 0px,rgba(224,68,29,1) 100%); /* Chrome10+,Safari5.1+ */background: -o-linear-gradient(top,  rgba(128,126,126,1) 0px,rgba(224,68,29,1) 100%); /* Opera 11.10+ */background: -ms-linear-gradient(top,  rgba(128,126,126,1) 0px,rgba(224,68,29,1) 100%); /* IE10+ */background: linear-gradient(to bottom,  rgba(128,126,126,1) 0px,rgba(224,68,29,1) 100%); /* W3C */filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#807e7e', endColorstr='#e0441d',GradientType=0 ); /* IE6-9 */}"+
             "#BLICK_scont3{background: rgb(0,0,0); /* Old browsers */background: -moz-linear-gradient(top,  rgba(0,0,0,1) 0px, rgba(255,255,255,1) 100%); /* FF3.6+ */background: -webkit-gradient(linear, left top, left bottom, color-stop(0px,rgba(0,0,0,1)), color-stop(100%,rgba(255,255,255,1))); /* Chrome,Safari4+ */background: -webkit-linear-gradient(top,  rgba(0,0,0,1) 0px,rgba(255,255,255,1) 100%); /* Chrome10+,Safari5.1+ */background: -o-linear-gradient(top,  rgba(0,0,0,1) 0px,rgba(255,255,255,1) 100%); /* Opera 11.10+ */background: -ms-linear-gradient(top,  rgba(0,0,0,1) 0px,rgba(255,255,255,1) 100%); /* IE10+ */background: linear-gradient(to bottom,  rgba(0,0,0,1) 0px,rgba(255,255,255,1) 100%); /* W3C */filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */}/*postform*/");
    var csli=document.createElement("div");
    csli.id="BLICK_slider";
    csli.style.height="100%";
    insertcode("var dragger=false;");
    csli.innerHTML="<div style='width:20px;height:100%;display:inline-block;' id='BLICK_scont1' onmousemove='if(dragger)drag(this,event,0);' onmousedown='dragger=true;drag(this,event,0);'><div class='BLICK_slide'></div></div><div style='width:20px;height:100%;display:inline-block;' id='BLICK_scont2' onmousemove='if(dragger)drag(this,event,1);' onmousedown='dragger=true;drag(this,event,1);'><div class='BLICK_slide' style='top:97px'></div></div><div style='width:20px;height:100%;display:inline-block;' id='BLICK_scont3'  onmousemove='if(dragger)drag(this,event,2);' onmousedown='dragger=true;drag(this,event,2);'><div class='BLICK_slide' style='top:47px'></div></div>";

    document.body.setAttribute("onmouseup","dragger=false;");

    cp.appendChild(csli);

    var csprev=document.createElement("div");
    csprev.id="BLICK_prevcol";
    csprev.setAttribute("style","cursor:pointer;color:black;height:100px;width:100px;background-color:hsl(0,100%,50%);");
    csprev.innerHTML="#ff0000";
    csprev.setAttribute("onclick","inserttag('color',this.innerHTML);");

    cp.appendChild(csprev);

    document.forms.namedItem("postform").elements.namedItem("name").style.width="100%";
    document.forms.namedItem("postform").elements.namedItem("em").style.width="100%";
    if(document.forms.namedItem("postform").elements.namedItem("embed"))document.forms.namedItem("postform").elements.namedItem("embed").style.width="72%";
    document.forms.namedItem("postform").elements.namedItem("postpassword").size="35";

    var tagnams=["b","u","i","s","aa","small","code","spoiler","color"];

    var mes=document.forms.namedItem("postform").elements.namedItem("message");
    mes.style.width="100%";

    var bigcont=document.createElement("div");
    bigcont.setAttribute("style","background-color:#6f6f6f;border:3px solid transparent;width:100%;");
    bigcont.id="BLICKbigcont";

    var bcont=document.createElement("div");
    bcont.className='Blickstylecont';
    var bbut=document.createElement("a");
    bbut.href="#";
    bbut.className='Blickstyle';
    bcont.appendChild(bbut);


    for(i=0;i<tagnams.length;i++){
        bbut=bcont.firstChild;
        bbut.style.left=(-24*i)+"px";
        bbut.setAttribute("onclick","inserttag('"+tagnams[i]+"');return false;")	;
        bigcont.appendChild(bcont);
        bcont=bcont.cloneNode(true);
    }

    bbut=bcont.firstChild;
    bbut.style.left=(-24*i++)+"px";
    bbut.addEventListener("click",showipick,false);
    // bbut.setAttribute("onclick","showipick();return false;")	;
    bigcont.appendChild(bcont);
    bcont=bcont.cloneNode(true);

    bbut=bcont.firstChild;
    bbut.style.left=(-24*i++)+"px";
    bbut.setAttribute("onclick","showcp();return false;")	;
    bigcont.appendChild(bcont);
    bigcont.appendChild(cp,mes);
    bigcont.appendChild(ipickWrap,mes);

    if(document.getElementById("BLICKbigcont")===null)mes.parentNode.insertBefore(bigcont,mes);

    // document.getElementById("BLICKiconinput").addEventListener("keyup",autofillicon,false);

    addstyle("#prevdiv > div {"+
             "background-color: inherit !important;"+
             "}");

    var el=document.createElement("input");
    el.id="BLICKpreviewbut";
    el.type="submit";
    el.value="Preview";
    el.style.marginLeft="10px";
    el.setAttribute("onclick","var i=document.getElementById('prevdiv');if(i==null)i=document.createElement('div');i.id='prevdiv';i.className='reply';i.style.textAlign='left';i.style.backgroundColor='';document.forms.namedItem('postform').appendChild(i);"+
                    "postpreview('prevdiv', '"+document.forms.namedItem("postform").elements.namedItem("board").value+"', "+document.forms.namedItem("postform").elements.namedItem("replythread").value+", document.forms.namedItem('postform').elements.namedItem('message').value);"+
                    "return false;");
    document.forms.namedItem("postform").elements.namedItem("subject").nextSibling.parentNode.insertBefore(el,document.forms.namedItem("postform").elements.namedItem("subject").nextSibling);

    var aktquest=document.getElementsByName("replythread")[0].value;

    for(i=0;i<charnamelist.length;i++)if(charnamelist[i][0]==aktquest)aktcharnames.push(charnamelist[i][1]);


    document.getElementById("postform").addEventListener("submit",function(){
        var form =document.getElementById("postform");
        var charaltind=charnamelist.indexOf([form.getElementByName("replythread")[0].value,form.getElementByName("name")[0].value]);
        if(charaltind!=-1){
            charnamelist.splice(charaltind,1);
        }
        charnamelist.unshift([form.getElementByName("replythread")[0].value,form.getElementByName("name")[0].value]);


        for(var i=0;i<charnamelist.length;i++)charnamelist[i]=charnamelist[i].join(String.fromCharCode(11)); //change charnamelist temporary as now the site will reload. Thus all variables including charnamelist will reload.
        GM.setValue("charnamelist",charnamelist.join(String.fromCharCode(12)));
    },false);

    if(aktcharnames.length!==0){
        document.getElementsByName("name")[0].value=aktcharnames[0];
        document.getElementsByName("name")[0].addEventListener("keyup",function(e){
            if(e.which<47)return true;
            for(var i=0;i<charnamelist.length;i++){
                if(aktcharnames[i].toLowerCase().indexOf(this.value.toLowerCase())===0){
                    var curcursor=this.selectionStart;
                    this.value=aktcharnames[i];
                    this.focus();
                    this.setSelectionRange(curcursor,aktcharnames[i].length);
                    return true;
                }
            }
        },false);
    }

}
async function syncmelden(){
    syncusername=document.getElementById("blick_sync_user").value;
    syncuserpass=document.getElementById("blick_sync_pass").value;
    //setTimeout(function(){
    GM.setValue("syncusername",syncusername);
    GM.setValue("syncuserpass",syncuserpass);
    //},0);
    document.getElementsByClassName("blick_sync_login")[0].innerHTML="<img src='"+wartbild+"' style='height:1em;margin:auto;display:block;'/>";
    GM.xmlHttpRequest({
        method: 'POST',
        url: "http://phi.pf-control.de/tgchan/interface.php?login",
        data: "uname="+syncusername+"&upass="+syncuserpass+"&bot=''",
        headers:{
            "Host": "phi.pf-control.de",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            if(response.responseText==("n:1")){
                document.getElementsByClassName("blick_sync_login")[0].innerHTML="Hello "+syncusername+",<br>"+synbuttons+"<span id='blick_synstatus'></span>";
                document.getElementById("blick_sync_upload").addEventListener("click",function(){

                    document.getElementById("synbuttons").style.display="none";
                    document.getElementById("blick_synstatus").innerHTML="Please wait for Upload.";

                    var blob=[];
                    var prom=[];
                    var liste=["externwbar","gloeinst","groeinst","curwid","abseinst","invert","liseinst","wateinst","poseinst","scheinst","imghover","curlang","autoupdate"];
                    var liste2=["itemoptions","externlistspeicher","lastviews","watchids","version"];

                    for(var i=0;i<liste.length;i++)
                        prom.push((async function(id){blob[id]=await GM.getValue(liste[id],"");})(i));

                    Promise.all(prom).then(function(){
                        blob=blob.join(String.fromCharCode(7));
                        console.log(blob);
                        intersettings(0,blob,true,function(d){
                            if(d=="no"){alert("You disabled synchronizing settings!");}
                            if(d=="n:0"){
                                document.getElementById("synbuttons").style.display="inline";
                                document.getElementById("blick_synstatus").innerHTML="";
                            }
                            blob=[];
                            prom=[];
                            for(var i=0;i<liste2.length;i++)
                                prom.push((async function(id){blob[id]=await GM.getValue(liste2[id],"");})(i));

                            Promise.all(prom).then(function(){
                                blob=blob.join(String.fromCharCode(7));
                                //console.log(blob);

                                intersettings(1,blob,true,function(f){
                                    if(f=="no"){alert("You disabled synchronizing the watchbar!");}
                                    if(f=="n:0"){
                                        // alert("Watchbar data already up to date!");
                                    }
                                    document.getElementById("synbuttons").style.display="inline";
                                    document.getElementById("blick_synstatus").innerHTML="";
                                });
                            });
                        });
                    });
                });
                document.getElementById("blick_sync_download").addEventListener("click",function(){
                    document.getElementById("synbuttons").style.display="none";
                    document.getElementById("blick_synstatus").innerHTML="Please wait for Download.";
                    intersettings(0,"",false, function(d){//read from settings
                        if(d===""){
                            alert("No data stored!");
                            document.getElementById("synbuttons").style.display="inline";
                            document.getElementById("blick_synstatus").innerHTML="";
                            return;
                        }
                        if(d=="no"){
                            alert("You disabled synchronising settings!");
                        }else{
                            var prom=[];
                            var blob=d.split(String.fromCharCode(7));
                            console.log(blob);
                            var liste=["externwbar","gloeinst","groeinst","curwid","abseinst","invert","liseinst","wateinst","poseinst","scheinst","imghover","curlang","autoupdate"];
                            for(var i=0;i<liste.length;i++){
                                if(typeof blob[i]!=="undefined"&&blob[i]!="undefined"&&blob[i]!="null"){
                                    prom.push(GM.setValue(liste[i],blob[i]));
                                }else{
                                    prom.push(GM.setValue(liste[i],null));
                                }
                            //console.log(liste[i],blob[i]);
                            }

                            Promise.all(prom).then(async function(){

                                externwbar=(await GM.getValue("externwbar",true))=="true";
                                gloeinst=(await GM.getValue("gloeinst",true))=="true";
                                groeinst=await GM.getValue("groeinst",18);
                                curwid=await GM.getValue("curwid",340);
                                abseinst=(await GM.getValue("abseinst",true))=="true";
                                invert=(await GM.getValue("invert",false))=="true";
                                liseinst=(await GM.getValue("liseinst",true))=="true";
                                wateinst=(await GM.getValue("wateinst",true))=="true";
                                autoupdate=(await GM.getValue("autoupdate",false))=="true";
                                poseinst=(await GM.getValue("poseinst",true))=="true";
                                scheinst=await GM.getValue("scheinst",0);
                                imghover=(await GM.getValue("imghover",true))=="true";
                                curlang=await GM.getValue("curlang",1);
                                //console.log(scheinst);
                            });
                        }

                        intersettings(1,"",false, function(f){
                            if(f===""){
                                alert("No data stored!");
                                document.getElementById("synbuttons").style.display="inline";
                                document.getElementById("blick_synstatus").innerHTML="";
                                return;
                            }
                            if(f=="no"){
                                alert("You disabled synchronising the watchbar!");
                                document.getElementById("synbuttons").style.display="inline";
                                document.getElementById("blick_synstatus").innerHTML="";
                            }

                            var prom=[];
                            var filecontent=f.split(String.fromCharCode(7));
                            var liste=["itemoptions","externlistspeicher","lastviews","watchids","version"];//GM_listValues();
                            var i=0;
                            for(i=0;i<liste.length;i++){
                                prom.push((async function(id){GM.setValue(liste[id],filecontent[id]);})(i));

                            }
                            if(filecontent.length==4)prom.push((async function(id){GM.setValue("version",0);})());
                            Promise.all(prom).then(async function(){

                                lastviews=(await GM.getValue("lastviews","")).split(String.fromCharCode(12));
                                watchids=(await GM.getValue("watchids","")).split(String.fromCharCode(11));
                                var tempdum=(await GM.getValue("itemoptions","")).split(String.fromCharCode(10));
                                itemoptions=[];
                                for(i=0;i<tempdum.length;i++){
                                    // var itemoptions=new Attay(); // {string threadID,int milisecForLastCheck, int viewinterval (hours, 0->on reload),bool highlightOnImage,bool highlichtOnID, string highlightIDs, bool highlightonall, bool ignoreonimage, bool ignoreonID, string ignoreIDs, bool ignoreAll}
                                    itemoptions.push(tempdum[i].split(String.fromCharCode(11)));
                                    itemoptions[i][1]=parseInt(itemoptions[i][1]);
                                    itemoptions[i][2]=parseInt(itemoptions[i][2]);
                                    itemoptions[i][3]=itemoptions[i][3]=="true";
                                    if(itemoptions[i].length>=11){
                                        itemoptions[i][4]=itemoptions[i][4];
                                        itemoptions[i][5]=itemoptions[i][5]=="true";
                                        itemoptions[i][6]=itemoptions[i][6]=="true";
                                        itemoptions[i][7]=itemoptions[i][7];
                                        itemoptions[i][8]=itemoptions[i][8]=="true";
                                        itemoptions[i][9]=itemoptions[i][9];
                                        itemoptions[i][10]=itemoptions[i][10];
                                        if(itemoptions[i].length>=12){
                                            itemoptions[i][11]=itemoptions[i][11]=="true";
                                        }
                                    }else if(itemoptions[i].length==6){
                                        itemoptions[i][4]=itemoptions[i][4]=="true";
                                        itemoptions[i][5]=itemoptions[i][5];
                                    }
                                }
                                tempdum=(await GM.getValue("externlistspeicher","")).split(String.fromCharCode(10));
                                externlistspeicher=[];
                                for(i=0;i<tempdum.length;i++){
                                    externlistspeicher.push(tempdum[i].split(String.fromCharCode(11)));
                                    externlistspeicher[i][1]=parseInt(externlistspeicher[i][1]);
                                    externlistspeicher[i][2]=parseInt(externlistspeicher[i][2]);
                                    externlistspeicher[i][3]=parseInt(externlistspeicher[i][3]);
                                }
                                backwardversion();
                                alert("Items successfully imported!");
                                location.reload();
                            });
                        });
                    });
                });

            }else{
                if(response.responseText=="n:2")alert("Account not valified.\nPlease check your mail for valification-link.");else
                    if(response.responseText=="n:0")alert("Login Error!\nUser-Password combination not found.");else
                        alert("Login-Error:\n\n"+response.responseText);
                document.getElementById("blick_synstatus").innerHTML=synbuttons;
            }
        }
    });
}
async function intersettings(mode, blob, writeaccess,callback){ //mode: 0 settings, 1 wbar
    GM.xmlHttpRequest({
        method: 'POST',
        url: "http://phi.pf-control.de/tgchan/interface.php?settings",
        data: "blobmode="+mode+"&"+(writeaccess?"write":"read")+"acc=''&blob="+encodeURIComponent(blob),
        headers:{
            "Host": "phi.pf-control.de",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            setTimeout(function(){callback(response.responseText);},0);
        }
    });
}

function neubildClick(){
    curlang=this.getAttribute("index");
    insertbar();
    GM.setValue("curlang",curlang);
}
//bar
function insertbar(){
    var bar;
    var neub=true;
    if(document.getElementById("BLICK_bar")===null){
        bar=document.createElement("div");
    }else{
        bar=document.getElementById("BLICK_bar");
        neub=false;
    }
    bar.id="BLICK_bar";

    schriftreiher();
    var schriften="";
    var i=0;
    for(i=0;i<schriftliste.length;i++)schriften+="<option"+((i==scheinst)?" selected='selected'":"")+">"+schriftliste[i]+"</option>";
    bar.innerHTML="";

    var syncloginform="<span class='BLICK_title'>sync via phi.pf-control.de:</span><br><input type='input' placeholder='name' value='"+syncusername+"' id='blick_sync_user' style='width:30%;'><input style='width:30%;' type='password' placeholder='password' value='"+syncuserpass+"' id='blick_sync_pass'><input type='submit' onclick='return false;' value='login' id='blick_sync_loggin'><a href='http://phi.pf-control.de/tgchan/interface.php'>Register</a>";

    bar.innerHTML+="<div style='width:300px;font: 16px/2em georgia, Palatino Linotype, Book Antiqua, Tahoma;padding-left: 20px;'><div class='blick_row'><span class='BLICK_title'><input type='checkbox' id='blick_fontein' alt='"+lang[curlang][11]+"' "+((gloeinst)?"checked='ckecked'":"")+"/><label for='blick_fontein'>"+lang[curlang][11]+"</label></span></div><div class='blick_row'><span class='BLICK_title'><input type='checkbox' id='blick_externwbar' alt='"+lang[curlang][12]+"' "+((externwbar)?"checked='ckecked'":"")+"/><label for='blick_externwbar'>"+lang[curlang][12]+"</label></span></div><div style='margin-left:20px;' class='blick_row'><span class='BLICK_title'>"+lang[curlang][1]+":</span><span class='blick_button' id='blick_plus'>+</span><span class='blick_button' id='blick_minus'>-</span></div><div style='margin-left:20px;' class='blick_row'><span class='BLICK_title'>"+lang[curlang][5]+": </span><select id='blick_select'>"+schriften+"</select></div><div class='blick_row'><span class='BLICK_title'><input type='checkbox' id='blick_absver' alt='"+lang[curlang][2]+"' "+((abseinst)?"checked='ckecked'":"")+"/><label for='blick_absver'>"+lang[curlang][2]+"</label></span></div><div class='blick_row'><span class='BLICK_title'><input type='checkbox' id='blick_listver' alt='"+lang[curlang][3]+"' "+((liseinst)?"checked='ckecked'":"")+"/><label for='blick_listver'>"+lang[curlang][3]+"</label></span></div><div class='blick_row'><span class='BLICK_title'><input type='checkbox' id='blick_invert' alt='"+lang[curlang][4]+"' "+((invert)?"checked='ckecked'":"")+"/><label for='blick_invert'>"+lang[curlang][4]+"</label></span></div><div class='blick_row'><span class='BLICK_title'><input type='checkbox' id='blick_watch' alt='"+lang[curlang][8]+"' "+((wateinst)?"checked='ckecked'":"")+"/><label for='blick_watch'>"+lang[curlang][8]+"</label></span></div><div class='blick_row'><span class='BLICK_title'><input type='checkbox' id='blick_posts' alt='"+lang[curlang][10]+"' "+((poseinst)?"checked='ckecked'":"")+"/><label for='blick_posts'>"+lang[curlang][10]+"</label></span></div><div class='blick_row'><span class='BLICK_title'><input type='checkbox' id='blick_autowbarupdate' alt='"+lang[curlang][13]+"' "+((autoupdate)?"checked='ckecked'":"")+"/><label for='blick_autowbarupdate'>"+lang[curlang][13]+"</label></span></div>"+
        "<div class='blick_row blick_sync_login'>"+syncloginform+"</div>"+
        "<div class='blick_row'><span class='BLICK_title'>Data for extended watchlist:</span><br/><input type='submit' id='blick_export' value='export' onclick='return false;'/><input type='submit' id='blick_import' value='import' onclick='return false;'/><input type='file' id='blick_file' value='import' style='display:none;'/></div>"+
        //"<div class='blick_row'><span class='BLICK_title'>PDF-Export</span><input type='submit' id='blick_zip' value='Open Dialog' onclick='return false;'/></div>"+
		"</div>";

    if(neub)document.body.appendChild(bar);

    //document.getElementById("blick_zip").addEventListener("click",showzipper,false);
    document.getElementById("blick_sync_loggin").addEventListener("click",syncmelden,false);
    document.getElementById("blick_export").addEventListener("click",wbarexport,false);
    document.getElementById("blick_import").addEventListener("click",function(){
        var evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent('click',true,true,null,0,0,0,0,0,false,false,false,false,0,null);
        document.getElementById("blick_file").dispatchEvent(evObj);
    },false);
    document.getElementById("blick_file").addEventListener("change",wbarimport,false);

    for(i=0;i<langimgs.length;i++){
        var neubild=document.createElement("IMG");
        neubild.src=langimgs[i];
        neubild.title=lang[i][0];
        neubild.setAttribute("class","BLICK_langimg "+(curlang==i?"BLICK_aktlang":""));
        neubild.setAttribute("style","left:"+(280-30*i)+"px");
        neubild.setAttribute("index",i);
        bar.insertBefore(neubild,bar.firstChild);
        neubild.addEventListener("click",neubildClick);
    }


    document.getElementById("blick_plus").addEventListener("click", function(){schriftvergr(true);}, false);
    document.getElementById("blick_minus").addEventListener("click", function(){schriftvergr(false);}, false);
    document.getElementById("blick_fontein").addEventListener("click", function(){
        if(gloeinst)mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*blick_gros\*\/[\s\S]*?\/\*blick_gros\*\//gi,""); else gros();
        gloeinst= !gloeinst;
        GM.setValue("gloeinst",gloeinst);
    }, false);
    document.getElementById("blick_externwbar").addEventListener("click", function(){
        externwbar= !externwbar;
        GM.setValue("externwbar",externwbar);
        updatewbar(null);
    }, false);
    document.getElementById("blick_absver").addEventListener("click", function(){
        if(abseinst)mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*abs\*\/[\s\S]*?\/\*abs\*\//gi,""); else absatz();
        abseinst= !abseinst;
        GM.setValue("abseinst",abseinst);
    }, false);
    document.getElementById("blick_watch").addEventListener("click", function(){
        if(wateinst){
            document.getElementById("BLICK_watch_bar").parentNode.removeChild(document.getElementById("BLICK_watch_bar"));
            if(document.getElementById("watchedthreads")!==null)document.getElementById("watchedthreads").style.display="";
        } else insertwatchbar();
        wateinst= !wateinst;
        GM.setValue("wateinst",wateinst);
    }, false);
    document.getElementById("blick_autowbarupdate").addEventListener("click", function(){
        autoupdate= !autoupdate;
        GM.setValue("autoupdate",autoupdate);
    }, false);
    document.getElementById("blick_listver").addEventListener("click", function(){
        liseinst= !liseinst;
        insertbox();
        GM.setValue("liseinst",liseinst);
    }, false);
    document.getElementById("blick_invert").addEventListener("click", function(){
        invert= !invert;
        if(!invert)mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*invert\*\/[\s\S]*?\/\*invert\*\//gi,"");else
            invertcolor();
        GM.setValue("invert",invert);
        if(abseinst)absatz();
    }, false);
    document.getElementById("blick_posts").addEventListener("click", function(){
        poseinst= !poseinst;
        if(!poseinst){
            mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*postform\*\/[\s\S]*?\/\*postform\*\//gi,"");
            document.forms.namedItem("postform").elements.namedItem("name").style.width="";
            document.forms.namedItem("postform").elements.namedItem("em").style.width="";
            document.forms.namedItem("postform").elements.namedItem("message").style.width="";
            document.forms.namedItem("postform").elements.namedItem("embed").style.width="";
            document.forms.namedItem("postform").elements.namedItem("postpassword").size="8";
            var rem=document.getElementById("BLICKbigcont");
            rem.parentNode.removeChild(rem);
            rem=document.getElementById("BLICKpreviewbut");
            rem.parentNode.removeChild(rem);
        }else{
            postf();
        }
        GM.setValue("poseinst",poseinst);
    }, false);
    document.getElementById("blick_select").addEventListener("click", function(){
        scheinst=document.getElementById("blick_select").selectedIndex;
        schriftreiher();
        mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*schrift\*\/[\s\S]*?\/\*schrift\*\//gi,"/*schrift*/"+schriftreihe+"/*schrift*/");
        GM.setValue("scheinst",scheinst);
    }, false);

    if(!neub)return;

    addstyle(".blick_sync_login{font-size:12pt;display:block;margin:auto;width:250px;}"+
             ".BLICK_aktlang{box-shadow:0px 0px 15px 5px #ff0;}"+
             ".BLICK_langimg{position:absolute;width:20px;cursor:pointer;}"+
             "#BLICK_bar{width:20px;overflow-y:auto;overflow-x:hidden;position:fixed;transition:width 0.5s,opacity 0.5s, height 0.5s;-moz-transition: width 0.5s,opacity 0.5s, height 0.5s;-webkit-transition: width 0.5s,opacity 0.5s, height 0.5s;-o-transition: width 0.5s,opacity 0.5s, height 0.5s; right:0px;height:30px;background-color:#9ad;z-index:99999999;opacity:0.5;top:50px;border:2px ridge #ddf;border-top-left-radius:25px;border-bottom-left-radius:25px;}"+
             "#BLICK_bar:hover{width:300px;opacity:1;height:350px;}"+
             ".blick_button {"+
             "   background-color: #DDDDFF;"+
             "	border: 1px ridge #CCCCCC;"+
             "	border-radius: 10px 10px 10px 10px;"+
             "	cursor: pointer;"+
             "	display: inline-block;"+
             "	font: 30px/17px georgia;"+
             "	height: 20px;"+
             "	margin: 5px;"+
             "	text-align: center;"+
             "	vertical-align: middle;"+
             "	width: 20px;"+
             "}"+
             ".blick_button:hover {"+
             "background-color: #aaf;"+
             "}"+
             ".blick_button:active {"+
             "background-color: #77d;"+
             "}"+
             "#BLICK_bar input {"+
             "margin: 5px;"+
             "}"+
             "#BLICK_bar label{cursor:pointer;}"+
             "#BLICK_bar input[type=submit]{cursor:pointer;}"+
             "#BLICK_bar input[type=checkbox]{cursor:pointer;}"+
             "#BLICK_bar select{cursor:pointer;}"+
             "#blick_select {"+
             "font: 16px "+schriftreihe+";"+
             "width:180px;"+
             "}");
    addstyle2("#BLICK_bar:hover{height:510px;}");
    // document.body.addEventListener("click",function(e){
    // var curel=e.target;
    // while(true){
    // if(curel==bar){
    // mystyle.innerHTML=mystyle.innerHTML.replace(/#BLICK_bar:hover/g,"#BLICK_bar/**/");
    // return;
    // }else if(curel==wrbar){
    // mystyle.innerHTML=mystyle.innerHTML.replace(/#BLICK_watch_bar:hover/g,"#BLICK_watch_bar/**/");
    // return;
    // }else if(curel==document.body||curel===null){
    // mystyle.innerHTML=mystyle.innerHTML.replace(/#BLICK_bar\/\*\*\//g,"#BLICK_bar:hover").replace(/#BLICK_watch_bar\/\*\*\//g,"#BLICK_watch_bar:hover");
    // return;
    // }else{
    // curel=curel.parentNode;
    // }
    // }
    // },false);
}
function wbarexport(){
    var alles=[];
    var prom=[];
    var liste=["itemoptions","externlistspeicher","lastviews","watchids","version"];//GM_listValues();
    for(var i=0;i<liste.length;i++)
        prom.push((async function(i){alles[i]=await GM.getValue(liste[i]);})(i));
    Promise.all(prom).then(function(){
        alles=alles.join(String.fromCharCode(4));
        var blob = new Blob([alles.replace(/\\/gi,"")]);
       // var blob = new Blob([alles.substring(1)]); //somewhere suddenly millions of \\
        var a= document.createElement("a");
        a.download="questdens_BLICK_wbar.dat";
        a.href=window.URL.createObjectURL(blob);
        document.body.appendChild(a);
        var evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent('click',true,true,null,0,0,0,0,0,false,false,false,false,0,null);
        a.dispatchEvent(evObj);
        a.parentNode.removeChild(a);
    });
}
function wbarimport(event){
    if(!confirm("Do you really want to import this file and overwrite your watchlist, settings and last read posts?"))return true;
    var reader;
    if (window.File && window.FileReader && window.FileList && window.Blob)reader = new FileReader();else
        alert("feature not supported by your Browser!");
    if(event.target.files && event.target.files[0]){
        reader.onload=function(e){
            // setTimeout(function(){
            var i=0;
            var filecontent=e.target.result.split(String.fromCharCode(4));
            var prom=[];
            var liste=["itemoptions","externlistspeicher","lastviews","watchids","version"];//GM_listValues();
            for(i=0;i<filecontent.length;i++){
                prom.push((async function(i){GM.setValue(liste[i],filecontent[i]);})(i));
            }
            if(filecontent.length==4)prom.push((async function(){GM.setValue("version",0);})());

            Promise.all(prom).then(async function(){
                lastviews=(await GM.getValue("lastviews","")).split(String.fromCharCode(12));
                watchids=(await GM.getValue("watchids","")).split(String.fromCharCode(11));
               // console.log("watchids import",(await GM.getValue("watchids","")));
                var tempdum=(await GM.getValue("itemoptions","")).split(String.fromCharCode(10));
                itemoptions=[];
                var zwi;
                for(i=0;i<tempdum.length;i++){
                    // var itemoptions=new Attay(); // {string threadID,int milisecForLastCheck, int viewinterval (hours, 0->on reload),bool highlightOnImage,bool highlichtOnID, string highlightIDs, bool highlightonall, bool ignoreonimage, bool ignoreonID, string ignoreIDs, bool ignoreAll}
                    zwi=tempdum[i].split(String.fromCharCode(11));
                    itemoptions.push(zwi);
                    itemoptions[i][1]=parseInt(itemoptions[i][1]);
                    itemoptions[i][2]=parseInt(itemoptions[i][2]);
                    itemoptions[i][3]=itemoptions[i][3]=="true";
                    if(itemoptions[i].length>=11){
                        itemoptions[i][4]=itemoptions[i][4];
                        itemoptions[i][5]=itemoptions[i][5]=="true";
                        itemoptions[i][6]=itemoptions[i][6]=="true";
                        itemoptions[i][7]=itemoptions[i][7];
                        itemoptions[i][8]=itemoptions[i][8]=="true";
                        itemoptions[i][9]=itemoptions[i][9];
                        itemoptions[i][10]=itemoptions[i][10];
                        if(itemoptions[i].length>=12)
                            itemoptions[i][11]=itemoptions[i][11]=="true";
                    }else if(itemoptions[i].length==6){
                        itemoptions[i][4]=itemoptions[i][4]=="true";
                        itemoptions[i][5]=itemoptions[i][5];
                    }
                }
                tempdum=(await GM.getValue("externlistspeicher","")).split(String.fromCharCode(10));
                externlistspeicher=[];
                for(i=0;i<tempdum.length;i++){
                    externlistspeicher.push(tempdum[i].split(String.fromCharCode(11)));
                    externlistspeicher[i][1]=parseInt(externlistspeicher[i][1]);
                    externlistspeicher[i][2]=parseInt(externlistspeicher[i][2]);
                    externlistspeicher[i][3]=parseInt(externlistspeicher[i][3]);
                }
                //console.log(watchids,itemoptions,externlistspeicher);

                backwardversion();
                alert("Items successfully imported!");

                updatewbar(null,false);
            });
            return true;
            // },0);
        };
        reader.readAsText(event.target.files[0]);
    }
}
function get_active_stylesheet() {
    var links=document.getElementsByTagName("link");
    for(var i=0;i<links.length;i++) {
        var rel=links[i].getAttribute("rel");
        var title=links[i].getAttribute("title");
        if(rel.indexOf("style")!=-1&&title&&!links[i].disabled) return title;
    }
    return null;
}
function restylewatchbar(wert){
    var mystyle;
    if(!mystyle)mystyle=document.getElementById("BLICK_style");
    mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*BLICK_watch_bar_restyle\*\/[\s\S]*?\/\*BLICK_watch_bar_restyle\*\//gi,"");
    addstyle("/*BLICK_watch_bar_restyle*/");
    switch(wert){
        case "Burichan":
            addstyle("#BLICK_watch_bar:hover {background-color:#D6DAF0 ;}"+
                     "#BLICK_watch_bar div.BLICK_wbarRowEntry:nth-child(even){background-color:#C6CAE0 ;}"+
                     "#BLICK_watch_bar div.BLICK_wbarRowEntry:nth-child(odd){background-color:#D6DAF0 ;}"+
                     "#BLICK_watch_bar .BLICK_whead {background-color:#98E;color:black;}"+
                     "#BLICK_watch_bar .BLICK_wtitle>span{color:#0F0C5D;}"+
                     "#BLICK_watch_bar .BLICK_wautor>span{color:#117750;}"+
                     "#BLICK_watch_bar .BLICK_wid>a{color:#34345C;}"+
                     "#wbar_slider {background:repeating-linear-gradient(45deg,#606dbc,#606dbc 10px,#465298 10px,#465298 20px);}"+
                     "");
            break;
        case "Nice":
            addstyle("#BLICK_watch_bar:hover {background-color:#CCDDE7 ;}"+
                     "#BLICK_watch_bar div.BLICK_wbarRowEntry:nth-child(even){background-color:#BCCDD7 ;}"+
                     "#BLICK_watch_bar div.BLICK_wbarRowEntry:nth-child(odd){background-color:#CCDDE7 ;}"+
                     "#BLICK_watch_bar .BLICK_whead {background-color:#98C1A9;color:black;}"+
                     "#BLICK_watch_bar .BLICK_wtitle>span{color:#5962AA;}"+
                     "#BLICK_watch_bar .BLICK_wautor>span{color:#6D4A7E;}"+
                     "#BLICK_watch_bar .BLICK_wid>a{color:#202040;}"+
                     "#wbar_slider {background:repeating-linear-gradient(45deg,#60bc6d,#60bc6d 10px,#469852 10px,#469852 20px);}"+
                     "");
            break;
        case "Futaba":
            addstyle("#BLICK_watch_bar:hover {background-color:#F0E0D6 ;}"+
                     "#BLICK_watch_bar div.BLICK_wbarRowEntry:nth-child(even){background-color:#F0D0C6 ;}"+
                     "#BLICK_watch_bar div.BLICK_wbarRowEntry:nth-child(odd){background-color:#F0E0D6 ;}"+
                     "#BLICK_watch_bar .BLICK_whead {background-color:#EEAA88;color:black;}"+
                     "#BLICK_watch_bar .BLICK_wtitle>span{color:#CC1105;}"+
                     "#BLICK_watch_bar .BLICK_wautor>span{color:#CC1105;}"+
                     "#BLICK_watch_bar .BLICK_wid>a{color:#0000EE;}"+
                     "#wbar_slider {background:repeating-linear-gradient(45deg,#bc606d,#bc606d 10px,#984652 10px,#984652 20px);}"+
                     "");
            break;
        case "Pony":
            addstyle("#BLICK_watch_bar:hover {background:url('/kusaba/css/images/paisley_bckgrnd.gif') repeat scroll 0 0 #FFF4F4}"+
                     "#BLICK_watch_bar .BLICK_wrow{background-color:#FFF4F4 ;}"+
                     "#BLICK_watch_bar .BLICK_whead {background-color:#FDDDE9;color:#800040;}"+
                     "#BLICK_watch_bar .BLICK_wtitle>span{color:#B30028;}"+
                     "#BLICK_watch_bar .BLICK_wautor>span{color:#E7276F;}"+
                     "#BLICK_watch_bar .BLICK_wid>a{color:#E7276F;}"+
                     "#wbar_slider {background:repeating-linear-gradient(45deg,#bc606d,#bc606d 10px,#984652 10px,#984652 20px);}"+
                     "");
            break;

    }
    addstyle("/*BLICK_watch_bar_restyle*/");
}
function insertwatchbar(){
    if(typeof wrbar!="undefined")return;
    wrbar=document.createElement("div");
    wrbar.id="BLICK_watch_bar";
    wbar=document.createElement("div");
    wbar.id="wbar_wrap";
    wrbar.appendChild(wbar);
    var ubar=document.createElement("div");
    ubar.id="wbar_update";
    wrbar.appendChild(ubar);
    var sbar=document.createElement("div");
    sbar.id="wbar_slider";
    wrbar.insertBefore(sbar, wrbar.firstChild);
    document.body.appendChild(wrbar);

    var tempdum=JSON.stringify(itemoptions);
  console.log("bef",tempdum);
/*
    //remove junk data
    var watched=-1;
    var i=0;
    var j=0;
    for(i=lastviews.length-1;i>=0;--i){
        watched=-1;
        for(j=0;j<watchids.length;++j){
            if(watchids[j].split(String.fromCharCode(12))[1]==lastviews[i].split(String.fromCharCode(11))[0].split("_")[1])watched=j;
        }
        if(watched==-1){
            lastviews.splice(i,1);
        }
    }
    GM.setValue("lastviews",lastviews.join(String.fromCharCode(12)));

    for(i=itemoptions.length-1;i>=0;--i){
        if(itemoptions[i][0]=="")itemoptions.splice(i,1);
    }
  console.log("bef",itemoptions);
    var tempdum=JSON.stringify(itemoptions);
  console.log("bef",tempdum);
    tempdum=tempdum.replace(/\],\[/g,String.fromCharCode(10));
    tempdum=tempdum.replace(/,/g,String.fromCharCode(11));
    tempdum=tempdum.replace(/\[+|\]+/g,"");
    tempdum=tempdum.replace(/\\"/g,"\"");
    GM.setValue("itemoptions",tempdum);
  console.log("af",tempdum);

    for(i=externlistspeicher.length-1;i>=0;--i){
        watched=-1;
        for(j=0;j<watchids.length;++j){
            if(watchids[j].split(String.fromCharCode(12))[1]==externlistspeicher[i][0])watched=j;
        }
        if(watched==-1){
            externlistspeicher.splice(i,1);
        }
    }
    tempdum=JSON.stringify(externlistspeicher);
    tempdum=tempdum.replace(/\],\[/g,String.fromCharCode(10));
    tempdum=tempdum.replace(/,/g,String.fromCharCode(11));
    tempdum=tempdum.replace(/"|^\[+|\]+$/g,"");
    GM.setValue("externlistspeicher",tempdum);

*/

    window.addEventListener("resize",function(){
        // var zwiheight=varheight;
        adaptwboxheight();
    },false);
    addstyle("#BLICK_watch_bar{cursor:pointer;overflow: hidden;font-type:"+schriftreihe+";font-size:"+groeinst+"px;color:#d00;width:20px;position:fixed; right:0px;height:30px;background-color:#fad; z-index:99999998;opacity:0.5;top:85px;border:2px ridge #ddf;border-top-left-radius:25px;border-bottom-left-radius:25px;}"+
             "#BLICK_watch_bar:hover{overflow-y:auto;overflow-x:hidden;opacity:1;}"+
             "#BLICK_watch_bar #wbar_wrap{visibility:hidden;cursor:default;}"+
             "#BLICK_watch_bar .BLICK_wrow{display: flex;padding:0px 5px;width:100%;flex-flow:row nowrap;align-items: center;}"+
             "#BLICK_watch_bar:hover #wbar_wrap{visibility:visible;}"+
             "#BLICK_watch_bar:hover #wbar_update{visibility:visible;}"+
             "#wbar_update{width:16px;height:16px;background:url("+refreshimg+") no-repeat;z-index:99;position:absolute;top:0;right:0;visibility:hidden;cursor:pointer;}"+
             "#BLICK_watch_bar .BLICK_whead{text-align:center;font-weight:bold;width:100%;}"+
             "#BLICK_watch_bar .BLICK_wrow>div{display: inline-block; vertical-align: top; word-wrap: break-word;font-size: 12px;line-height:23px;margin:0 5px;}"+
             "#BLICK_watch_bar .BLICK_wid{flex: 0 0 60px;}"+
             "#BLICK_watch_bar .BLICK_wtitle{flex: 1 1 50%;}"+
             "#BLICK_watch_bar .BLICK_wautor{flex: 1 1 20%;}"+
             "#BLICK_watch_bar .BLICK_wnew{flex: 0 0 auto;}"+
             "#BLICK_watch_bar .BLICK_wX{flex: 0 0 10px;}"+
             "#BLICK_watch_bar .BLICK_wSetting{flex: 0 0 40px;}"+
             "#BLICK_watch_bar .BLICK_wnew>strong{color:red;}"+
             "#BLICK_watch_bar .BLICK_wnew>a>strong{color: #007700;}"+
             "#BLICK_watch_bar .BLICK_wnew>a{color: green;}"+
             "#wbar_slider{position: fixed;width:5px;cursor:ew-resize;visibility:hidden;margin:15px 0;border-radius:5px;transition:visibility;transition-delay:0s;}"+
             "#BLICK_watch_bar:hover #wbar_slider{visibility:visible;transition-delay:0.5s;}"+
             "");
    addstyle2("#BLICK_watch_bar:hover{width:"+curwid+"px;height:30px;}"+
              "#BLICK_watch_bar #wbar_wrap{width:"+curwid+"px}"+
              transitionString);
    var watchbox=document.getElementById("watchedthreads");
    if(watchbox!==null)watchbox.style.display="none";else{
        watchbox=document.createElement("div");
        watchbox.id="watchedthreads";
        watchbox.style.display="none";
        document.body.appendChild(watchbox);
    }
    watchbox=document.getElementById("watchedthreadlist");
    if(watchbox!==null)watchbox.style.display="none";else{
        watchbox=document.createElement("div");
        watchbox.id="watchedthreadlist";
        watchbox.style.display="none";
        document.body.appendChild(watchbox);
    }
    ubar.addEventListener("click",function(){
        // var tempdum;
        // if(typeof laden("externlistspeicher")!=="undefined"&&laden("externlistspeicher")!==null){
        // externlistspeicher=[];
        // tempdum=laden("externlistspeicher").split(String.fromCharCode(10));
        // for(i=0;i<tempdum.length;i++){
        // externlistspeicher.push(tempdum[i].split(String.fromCharCode(11)));
        // externlistspeicher[i][1]=parseInt(externlistspeicher[i][1]);
        // externlistspeicher[i][2]=parseInt(externlistspeicher[i][2]);
        // externlistspeicher[i][3]=parseInt(externlistspeicher[i][3]);
        // }
        // }
        // if(typeof laden("itemoptions")!=="undefined"&&laden("itemoptions")!==null){
        // itemoptions=[];
        // tempdum=laden("itemoptions").split(String.fromCharCode(10));
        // for(i=0;i<tempdum.length;i++){
        // itemoptions.push(tempdum[i].split(String.fromCharCode(11)));
        // itemoptions[i][1]=parseInt(itemoptions[i][1]);
        // itemoptions[i][2]=parseInt(itemoptions[i][2]);
        // itemoptions[i][3]=itemoptions[i][3]=="true";
        // if(itemoptions[i].length>=11){
        // itemoptions[i][4]=itemoptions[i][4];
        // itemoptions[i][5]=itemoptions[i][5]=="true";
        // itemoptions[i][6]=itemoptions[i][6]=="true";
        // itemoptions[i][7]=itemoptions[i][7];
        // itemoptions[i][8]=itemoptions[i][8]=="true";
        // itemoptions[i][9]=itemoptions[i][9];
        // itemoptions[i][10]=itemoptions[i][10];
        // if(itemoptions[i].length==12)itemoptions[i][11]=itemoptions[i][11]=="true";
        // }else if(itemoptions[i].length==6){
        // itemoptions[i][4]=itemoptions[i][4]=="true";
        // itemoptions[i][5]=itemoptions[i][5];
        // }
        // if(typeof itemoptions[i][11]== "undefined")itemoptions[i][11]=true;

        // }
        // }
        updatewbar(null);
    },false);

    var wbuts=document.getElementsByClassName("watchthread");
    for(i=0;i<wbuts.length;i++)
        wbuts[i].parentNode.addEventListener("click",updatewbar,false);

    if(autoupdate)setTimeout(function(){updatewbar(null);},500);
    else updatewbar(null,false);


    insertcode("var mystyle;");
    insertcode(addstyle.toString());
    insertcode(restylewatchbar.toString());
    insertcode("set_stylesheet = function(w) {return function(s) {w.call(this, (function(w){restylewatchbar(w);return w;})(s));}}(set_stylesheet);");
    restylewatchbar(get_active_stylesheet());

}
function updatewbarResponse(responseDetails) {
    var i=0,j=0;
    var row=0;
    if(responseDetails.responseText.indexOf("None.")!==0){
        var rex=/(\d+)\.html.*?(?:filetitle">(.*?)<\/span>.*?)?postername">(.*?)<\/span>/g;
        var aboard=responseDetails.responseText.match(/'(\w+)'\);return false;/)[1];
        row=rex.exec(responseDetails.responseText);
        while(row!==null){
            neulist.push(aboard+String.fromCharCode(12)+row[1]+String.fromCharCode(12)+(row[2]?row[2]:"No author")+String.fromCharCode(12)+row[3]);
            row=rex.exec(responseDetails.responseText);
        }
        var aftinsel=wbar.firstChild;
        for(j=qlist.length-1;j>qlist.indexOf(aboard);j--){
            if(wbar.getElementsByClassName(qlist[j]).length>0)aftinsel=wbar.getElementsByClassName(qlist[j])[0];
        }

        var insdiv=document.createElement("div");
        insdiv.innerHTML="<div class='BLICK_whead'>"+
            aboard+"</div><div class='BLICK_wbody'>"+
            responseDetails.responseText.replace(/(<a .*?>\d+<\/a>)(?: - (<span class="filetitle">[^<]*?<\/span>))? - (<span class="postername">[^<]*?<\/span>)((?:<a.*?<\/a>)|(?: <strong>0<\/strong>)) (<a .*?>X<\/a>).*?>/g,"<div class='BLICK_wrow'><div class='BLICK_wid'>$1</div><div class='BLICK_wtitle'>$2</div><div class='BLICK_wautor'>$3</div><div class='BLICK_wnew'>$4</div><div class='BLICK_wX'>$5</div></div>")+
            "</div>";
        insdiv.className="BLICK_wblock "+qlist[j];

        var neutext=insdiv.innerHTML.replace(/(<a href=".*?">)<strong><font color="red">(\d+).*?<\/font><\/strong><\/a>/g,"$1<strong>$2</strong></a>");
        if(neutext!=insdiv.innerHTML){
            insdiv.innerHTML=neutext;
            addstyle("#BLICK_watch_bar{box-shadow:0px 0px 15px 5px red;}");
        }
        wbar.insertBefore(insdiv,aftinsel);

        // varheight+=parseInt(insdiv.clientHeight);
        adaptwboxheight();
    }else {nonestand++;}

    // var rex=/(\d+)\.html.*?(?:filetitle">(.*?)<\/span>.*?)?postername">(.*?)<\/span>/g;
    // row=rex.exec(responseDetails.responseText);

    aktstand--;
    if(aktstand===0){
        // document.body.addEventListener("click",function(e){
        // var curel=e.target;
        // while(true){
        // if(curel==wbar){
        // mystyle.innerHTML=mystyle.innerHTML.replace(/#BLICK_watch_bar:hover/gi,"#BLICK_watch_bar/**/");
        // return;
        // }else if(curel==document.body||curel===null){
        // mystyle.innerHTML=mystyle.innerHTML.replace(/#BLICK_watch_bar\/\*\*\//gi,"#BLICK_watch_bar:hover");
        // return;
        // }else{
        // curel=curel.parentNode;
        // }
        // }
        // },false);

        var xbuts=document.getElementsByClassName("BLICK_wX");
        for(i=0;i<xbuts.length;i++)
            xbuts[i].firstChild.addEventListener("click",updatewbar,false);
        if(neulist.length===0&&watchids.length>0){
            // if(neulist.length===0&&itemoptions.length>0){
            if(qlist.length==nonestand){
                if((new Date().getTime() - lastconf)/1000 <10){}else{
                    lastconf=new Date().getTime();
                    if(confirm(lang[curlang][9])){
                        var atext=document.createElement("script");
                        atext.language="javascript";
                        atext.type="text/javascript";
                        for(i=0;i<watchids.length;i++)
                            // for(i=0;i<itemoptions.length;i++)
                            atext.innerHTML+="new Ajax.Request(ku_boardspath + '/threadwatch.php?do=addthread&board="+watchids[i].split(String.fromCharCode(12))[0]+"&threadid="+watchids[i].split(String.fromCharCode(12))[1]+"',{method:'get',onFailure: function(){ alert(_('Something went wrong...')) }});\n";
                        document.body.appendChild(atext);
                        setTimeout(updatewbar,1000);
                    }else{
                        watchids=[];
                        GM.setValue("watchids",watchids.join(String.fromCharCode(11)));
                    }
                }
            }
        }else{
            watchids=neulist;
            GM.setValue("watchids",watchids.join(String.fromCharCode(11)));
        }
    }
}
function delelsMouseOver(){this.src=hdisk;}
function delelsMouseOut(){this.src=disk;}
var requestLimitter;
var showlim=0;
async function updatewbarRequest(thread,id){
    if(requestLimitter>2){setTimeout(function(){updatewbarRequest(thread,id);},500);return;} //browser seem to freze with more than 4 active http requests. This line limits parallel requests to 3.
    requestLimitter++;
    GM.xmlHttpRequest({
        method: 'GET',
        url: "http://www.questden.org/kusaba/"+thread+"/res/"+id+".html", //TODO: request +50/+100 first?
        onload: function(responseDetails) {
            requestLimitter--;
            (function(asd){setTimeout(function(){
                var speid=0;

                var k=0;
                var lastref=getlastviewref(thread,id);
                var optid=getOptionIndexById(thread+"_"+id);

                var rex=/(?:<span class="filetitle">\s*(.*)\s*<\/span>\s*)?<span class="postername">\s*(.*)\s*<\/span>/g;
                // var aboard=responseDetails.responseText.match(/'(\w+)'\);return false;/)[1];
                var row=rex.exec(responseDetails.responseText);
                if(row===null){
                    // showlim++;
                }
                row[2]=row[2].replace(/(<\/span>)?\s*<span class="postertrip">.*?(<\/span>)?$/g,""); //remove postertrip
                if(typeof row[1]=="undefined")row[1]="No Title";
                // console.log(row[2]);
                var qest_entry=document.getElementById("BLICK_wquest_"+thread+"_"+id);
                // console.log(qest_entry);
                if(qest_entry===null){
                    var qest_block=document.getElementById("BLICK_wblock"+thread);
                    if(qest_block===null){
                        var domEl=document.createElement("div");
                        domEl.setAttribute("class","BLICK_whead");
                        domEl.innerHTML=thread;
                        var domEl2=document.createElement("div");
                        domEl2.setAttribute("id","BLICK_wblock"+thread);
                        domEl2.appendChild(domEl);
                        qest_block=domEl2;
                        wbar.appendChild(qest_block);
                    }
                    var domEl=document.createElement("div");
                    domEl.setAttribute("id","BLICK_wquest_"+thread+"_"+id);
                    domEl.setAttribute("class","BLICK_wbarRowEntry");
                    domEl.innerHTML="<div class='BLICK_wrow'><div class='BLICK_wid'><a href='/kusaba/"+thread+"/res/"+id+".html'>"+id+"</a><a href='/kusaba/"+thread+"/res/"+id+".html' id='BLICK_link"+id+"'></a></div><div class='BLICK_wtitle'><span class='filetitle'>"+row[1]+"</span></div><div class='BLICK_wautor'><span class='postername'>"+row[2]+"</span></div><div class='BLICK_wnew' id='BLICK_new"+thread+"_"+id+"'>0</div><div class='BLICK_wX'><a title='Un-watch' onclick='javascript:removefromwatchedthreads( \""+id+"\", \""+thread+"\");return false;' href='#'>X</a></div><div class='BLICK_wSetting'><img eleid='"+thread+"_"+id+"' class='BLICK_setbut' src='"+disk+"' alt='settings' title='settings'/></div></div>";
                    qest_block.appendChild(domEl);
                    watchids.push([thread,id,row[2],row[1]].join(String.fromCharCode(12)));
                    // console.log("wpush",row[2],row[1]);

                }else{
                    qest_entry.getElementsByClassName("BLICK_wtitle")[0].innerHTML="<span class=\"filetitle\">"+row[1]+"</span>";
                    qest_entry.getElementsByClassName("BLICK_wautor")[0].innerHTML="<span class=\"postername\">"+row[2]+"</span>";
                    var watchs;
                    for(var i=0;i<watchids.length;++i){
                        watchs=watchids[i].split(String.fromCharCode(12));
                        if(watchs[1]==id){
                            watchs[2]=row[1];
                            watchs[3]=row[2];
                            watchids[i]=watchs.join(String.fromCharCode(12));
                            // console.log("wup",watchids[i]);
                            break;
                        }
                    }
                }
                GM.setValue("watchids",watchids.join(String.fromCharCode(11)));

                if(!itemoptions[optid][8]&&itemoptions[optid][7]!==""){
                    var idignorelist=itemoptions[optid][7].split(",");
                    for(k=0;k<idignorelist.length;k++)
                        asd=asd.replace(new RegExp("<span class=\"postername\">(?:[\\s\\S](?!<postername>))*?ID: "+idignorelist[k]+"<\/span>[\\s\\S]*?<\/block","gi"),"");
                }
                if(itemoptions[optid][10]!==""){
                    var nameignorelist=itemoptions[optid][10].split(",");
                    for(k=0;k<nameignorelist.length;k++){
                        asd=asd.replace(new RegExp(">"+nameignorelist[k]+"\\s*?<[\\s\\S]*?<\/block","gi"),"");
                    }
                }
                if(!itemoptions[optid][8]&&itemoptions[optid][6]){
                    asd=asd.replace(new RegExp("class=\"postername\"(?:[\\s\\S](?!class=\"postername\"))*?class=\"thumb\"[\\s\\S]*?<\/block","gi"),"");
                }
                var utex=asd.substring(asd.lastIndexOf("\"reflink\">"));
                if(itemoptions[optid][2]!==0){
                    speid=getSpeicherIndexById(id);
                    if(speid==-1){
                        externlistspeicher.push([id,0,0,0]);
                        speid=externlistspeicher.length-1;
                    }
                    externlistspeicher[speid][2]=0;
                    externlistspeicher[speid][3]=0;
                }
                var newlastid=asd.match(/[\s\S]*highlight\('(\d+?)'\)/i)[1];
                var postCount=asd.split("<span class=\"reflink\">").length;

                var BLICKnew=document.getElementById("BLICK_new"+thread+"_"+id);
                if(BLICKnew===null)return;

                if(lastref===0){
                    setlastviewref(thread,id,newlastid,(postCount>50?"1":"0"));
                }
                if(typeof lastref[1]=="undefined")lastref[1]="";
                lastref[2]=(postCount>49?"1":"0"); //>52?

                if(lastref[1]==utex.match(/highlight\('(\d+)'\)/)[1]||itemoptions[optid][8]){
                    BLICKnew.innerHTML="<a href='http://www.questden.org/kusaba/"+thread+"/res/"+id+(lastref[2]=="1" && asd.indexOf(lastref[1])!=-1?"+50":"")+".html#"+lastref[1]+"'>0</a>";
                    if(itemoptions[optid][2]!==0)externlistspeicher[speid][1]=0;
                }else{
                    var neutext=asd.substring(asd.indexOf("highlight('"+lastref[1]));
                    neutext=neutext.substring(neutext.indexOf("reflink")+1);
                    var newpost=neutext.match(/highlight\('(\d+)'\)/)[1];
                    var newspez=false;

                    var anz=neutext.split("reflink").length;
                    BLICKnew.innerHTML="<a href='http://www.questden.org/kusaba/"+thread+"/res/"+id+(lastref[2]=="0"||anz>100?"":(anz>50?"+100":"+50"))+".html#holdnumber'>"+neutext.split("reflink").length+"</a>";
                    var link=BLICKnew.getElementsByTagName("a")[0];
                    if(itemoptions[optid][5]){
                        if(wbar.getAttribute("red")!="1"){
                            wbar.setAttribute("red","1");
                            addstyle("#BLICK_watch_bar{box-shadow:0px 0px 15px 5px red;}");
                        }
                        BLICKnew.parentNode.style="box-shadow: 0 0 5px 1px green inset;position: relative;";
                    }
                    if(itemoptions[optid][9]!==""){
                        var namehighlist=itemoptions[optid][4].split(",");
                        for(k=0;k<namehighlist.length;k++){
                            var namehighind=neutext.indexOf("<span class=\"postername\">"+namehighlist[k]+"</span>");
                            if(namehighind!=-1){
                                if(wbar.getAttribute("red")!="1"){
                                    wbar.setAttribute("red","1");
                                    addstyle("#BLICK_watch_bar{box-shadow:0px 0px 15px 5px red;}");
                                }
                                link.style.textDecoration="line-through";
                                BLICKnew.parentNode.style="box-shadow: 0 0 5px 3px #f80 inset;position: relative;";
                                if(!newspez)newpost=neutext.substring(namehighind-250).match(/highlight\('(\d+)'\)/)[1];
                                newspez=true;
                                if(itemoptions[optid][2]!==0)externlistspeicher[speid][3]=1;
                            }
                        }
                    }
                    if(itemoptions[optid][2]!==0)externlistspeicher[speid][1]=neutext.split("reflink").length;
                    if(neutext.indexOf("class=\"thumb\"")!=-1){
                        link.style.color="blue";
                        if(itemoptions[optid][3]){
                            if(wbar.getAttribute("red")!="1"){
                                wbar.setAttribute("red","1");
                                addstyle("#BLICK_watch_bar{box-shadow:0px 0px 15px 5px red;}");
                            }
                            BLICKnew.parentNode.style="box-shadow: 0 0 5px 1px blue inset;position: relative;";
                            if(!newspez)newpost=neutext.substring(neutext.indexOf("class=\"thumb\"")-250).match(/alt="(\d+)"/)[1];
                            newspez=true;
                        }
                        if(itemoptions[optid][2]!==0)externlistspeicher[speid][2]=1;
                    }

                    if(itemoptions[optid][4]!==""){
                        var idhighlist=itemoptions[optid][4].split(",");
                        for(k=0;k<idhighlist.length;k++){
                            var idhighind=neutext.indexOf("ID: "+idhighlist[k]+"</span>");
                            if(idhighind!=-1){
                                if(wbar.getAttribute("red")!="1"){
                                    wbar.setAttribute("red","1");
                                    addstyle("#BLICK_watch_bar{box-shadow:0px 0px 15px 5px red;}");
                                }
                                link.style.textShadow="1px 1px 2px red";
                                BLICKnew.parentNode.style="box-shadow: 0 0 5px 1px red inset;position: relative;";
                                if(!newspez)newpost=neutext.substring(idhighind-250).match(/highlight\('(\d+)'\)/)[1];
                                newspez=true;
                                if(itemoptions[optid][2]!==0)externlistspeicher[speid][3]=1;
                            }
                        }
                    }
                    if(itemoptions[optid][11]===false)newpost=lastref[1];
                    link.href=link.href.replace("#holdnumber","#"+newpost);
                }
                if(asd.indexOf("<title>Quest-Archive</title>")!=-1){
                    BLICKnew.parentNode.getElementsByClassName("BLICK_wid")[0].firstChild.style.color="#333";
                }else if(asd.indexOf("<title>Welcome to the Ghost House</title>")!=-1){
                    BLICKnew.parentNode.getElementsByClassName("BLICK_wid")[0].firstChild.style.color="#d33";
                }

                if(itemoptions[optid][2]!==0){

                    var tempdum=externlistspeicher.map(e => e.join(String.fromCharCode(11))).join(String.fromCharCode(10));
                   /* var tempdum=JSON.stringify(externlistspeicher);
                    tempdum=tempdum.replace(/\],\[/g,String.fromCharCode(10));
                    tempdum=tempdum.replace(/,/g,String.fromCharCode(11));
                    tempdum=tempdum.replace(/"|^\[+|\]+$/g,"");*/
                    GM.setValue("externlistspeicher",tempdum);
                }

                if(lastref[2]=="1"){
                    document.getElementById("BLICK_link"+id).innerHTML="+50";
                }

            },0);})(responseDetails.responseText);
        }
    });
}
async function updatewbar(event,sendrequest){
    sendrequest = typeof sendrequest !== 'undefined' ? sendrequest : true;
if(!wbar)insertwatchbar();
    nonestand=0;
    var i=0,j=0;
    var domEl, domEl2;
    if(!externwbar){
       wbar.innerHTML="";
        aktstand=qlist.length;
        for(i=0;i<qlist.length;i++){
            GM.xmlHttpRequest({
                method: 'GET',
                url: "http://www.questden.org/kusaba/threadwatch.php?board="+qlist[i],
                onload: updatewbarResponse
            });
        }
    }else{

        if(event!==null){
            var athread=/addtowatchedthreads\('(\d+)','(\w+)'\);return false;/gi.exec(event.target.parentNode.getAttributeNode('onclick').nodeValue);
            var aauth=/(?:filetitle">[\s\r\n]*?([^<\r\n]*)[\s\r\n]*?<[\s\S]*?)?postername">(?:<a.*?>)?([^<].*?)</gi.exec(event.target.parentNode.parentNode.parentNode.getElementsByTagName("label")[0].innerHTML);
            watchids.push(athread[2]+String.fromCharCode(12)+athread[1]+String.fromCharCode(12)+(aauth[1]?aauth[1]:"No Title")+String.fromCharCode(12)+aauth[2]);
            itemoptions.push([athread[1],0,0,true, "",false,false,"",false,"","",true]);
        }
        wbar.innerHTML="";
        var qthread,qid,qname,qauth;
        watchids=watchids.filter(onlyUnique);
        GM.setValue("watchids",watchids.join(String.fromCharCode(11)));

        requestLimitter=0;
        for(i=0;i<watchids.length;i++){
            if(!watchids[i]||!watchids[i].split(String.fromCharCode(12))[0]||typeof watchids[i].split(String.fromCharCode(12))[0]=="undefined"||watchids[i].split(String.fromCharCode(12))[0]=="undefined"){
                watchids.splice(i,1);
                continue;
            }
            qthread=watchids[i].split(String.fromCharCode(12))[0];
            qid=watchids[i].split(String.fromCharCode(12))[1];
            qname=watchids[i].split(String.fromCharCode(12))[2];
            qauth=watchids[i].split(String.fromCharCode(12))[3];
            var optid=getOptionIndexById(qid);
            var speid=getSpeicherIndexById(qid);
            if(optid==-1){
                itemoptions.push([qid,0,0,true,"",false,false,"",false,"",""]);
                optid=itemoptions.length-1;
            }

            var qest_block=document.getElementById("BLICK_wblock"+qthread);
            if(qest_block===null){
                domEl=document.createElement("div");
                domEl.setAttribute("class","BLICK_whead");
                domEl.innerHTML=qthread;
                domEl2=document.createElement("div");
                domEl2.setAttribute("id","BLICK_wblock"+qthread);
                domEl2.appendChild(domEl);
                qest_block=domEl2;
                wbar.appendChild(qest_block);
            }
            var qest_entry=document.getElementById("BLICK_wquest_"+qthread+"_"+qid);
            if(qest_entry===null){
                domEl=document.createElement("div");
                domEl.setAttribute("id","BLICK_wquest_"+qthread+"_"+qid);
                domEl.setAttribute("class","BLICK_wbarRowEntry");
                domEl.innerHTML="<div class='BLICK_wrow'><div class='BLICK_wid'><a href='/kusaba/"+qthread+"/res/"+qid+".html'>"+qid+"</a><a href='/kusaba/"+qthread+"/res/"+qid+".html' id='BLICK_link"+qid+"'></a></div><div class='BLICK_wtitle'><span class='filetitle'>"+qname+"</span></div><div class='BLICK_wautor'><span class='postername'>"+qauth+"</span></div><div class='BLICK_wnew' id='BLICK_new"+qthread+"_"+qid+"'>0</div><div class='BLICK_wX'><a title='Un-watch' onclick='javascript:removefromwatchedthreads( \""+qid+"\", \""+qthread+"\");return false;' href='#'>X</a></div><div class='BLICK_wSetting'><img eleid='"+qthread+"_"+qid+"' class='BLICK_setbut' src='"+disk+"' alt='settings' title='settings'/></div></div>";
                qest_block.appendChild(domEl);
            }

            var delels=wbar.getElementsByClassName("BLICK_wX");
            for(j=0;j<delels.length;j++){
                delels[j].firstChild.addEventListener("click",removethisfromlist,false);
            }
            delels=wbar.getElementsByClassName("BLICK_setbut");
            for(j=0;j<delels.length;j++){
                delels[j].addEventListener("click",optionwindow,false);
                delels[j].addEventListener("mouseover",delelsMouseOver,false);
                delels[j].addEventListener("mouseout",delelsMouseOut,false);
            }

            if(speid!=-1&&((new Date()).getTime())-itemoptions[optid][1]<(1000*60*60*itemoptions[optid][2])){
                var lastref=getlastviewref(qthread,qid);
                var anz=externlistspeicher[speid][1];
                document.getElementById("BLICK_new"+qthread+"_"+qid).innerHTML="<a href='http://www.questden.org/kusaba/"+qthread+"/res/"+qid+(anz>100?"":(anz>50?"+100":"+50"))+".html#"+lastref[1]+"'>"+externlistspeicher[speid][1]+"</a>";
                if(externlistspeicher[speid][2]==1){
                    document.getElementById("BLICK_new"+qthread+"_"+qid).getElementsByTagName("a")[0].style.color="blue";
                    if(itemoptions[optid][3]){
                        if(wbar.getAttribute("red")!="1"){
                            wbar.setAttribute("red","1");
                            addstyle("#BLICK_watch_bar{box-shadow:0px 0px 15px 5px red;}");
                        }
                        document.getElementById("BLICK_new"+qthread+"_"+qid).parentNode.style="box-shadow: 0 0 5px 1px blue inset;position: relative;";
                    }
                }
                if(externlistspeicher[speid][3]==1){
                    document.getElementById("BLICK_new"+qthread+"_"+qid).getElementsByTagName("a")[0].style.textShadow="1px 1px 2px red";
                    if(itemoptions[optid][4]!==""){
                        if(wbar.getAttribute("red")!="1"){
                            wbar.setAttribute("red","1");
                            addstyle("#BLICK_watch_bar{box-shadow:0px 0px 15px 5px red;}");
                        }
                        document.getElementById("BLICK_new"+qthread+"_"+qid).parentNode.style="box-shadow: 0 0 5px 1px red inset;position: relative;";
                    }
                }
                continue;
            }
            itemoptions[optid][1]=(new Date()).getTime();
            if(sendrequest)updatewbarRequest(qthread,qid);
        }
        var tempdum=itemoptions.map(e => e.join(String.fromCharCode(11))).join(String.fromCharCode(10));
        /*
        var tempdum=JSON.stringify(itemoptions);
        tempdum=tempdum.replace(/\],\[/g,String.fromCharCode(10));
        tempdum=tempdum.replace(/,/g,String.fromCharCode(11));
        tempdum=tempdum.replace(/"|^\[+|\]+$/g,"");
        */
        GM.setValue("itemoptions",tempdum);

        setTimeout(function(){adaptwboxheight();},0);

    }
    addstyle("#wbar_wrap{padding-left:5px;} #BLICK_watch_bar:hover #wbar_wrap{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAABCAYAAAAW%2FmTzAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QcRCwUsews%2B%2FAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAGElEQVQI12NgYGCoTUlJqWWAgNqUlJRaACbBBE1VswcKAAAAAElFTkSuQmCC) repeat-y}");

    if(!widthHandlerDown){
        widthHandlerDown=true;
        document.getElementById("wbar_slider").addEventListener("mousedown",widthAdaptMouseDown,false);
    }
    document.documentElement.addEventListener("mouseup",widthAdaptMouseUp,false);
}
var widthHandlerDown=false;
var widthHandlerUp=false;
var sliderPressed=false;
function widthAdaptMouseDown(e){
    sliderPressed=true;
    // if(e.target==wbar){
    // curwidakt=true;

    // adaptwboxheight();
    if(!widthHandlerUp){
        widthHandlerUp=true;
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(wrbar).width, 10);
        // transitionString="/*"+transitionString+"*/";

        var styleEl=document.getElementById("BLICK_VARstyle");
        if(styleEl===null)addstyle2("");
        styleEl.innerHTML="#BLICK_watch_bar{width:"+curwid+"px;height:"+zwiheight+"px;} #BLICK_watch_bar #wbar_wrap{width:"+curwid+"px} #BLICK_bar:hover{height:"+(zwiheight2+35)+"px;}#wbar_slider{height:"+(zwiheight-30)+"px;visibility:visible;} ";
        document.documentElement.addEventListener("mousemove",updatewbarwidth,false);
    }
    // document.documentElement.removeEventListener("mouseup",widthAdaptMouseUp,false);
    // widthHandlerUp=true;
    // }
}
function widthAdaptMouseUp(e){
    // curwidakt=false;
    // adaptwboxheight();


    var VerticalScrollbar = wrbar.scrollHeight > wrbar.clientHeight;
     var scrollbarWidth = wrbar.offsetWidth - wrbar.clientWidth;

    if(!sliderPressed)return;
    sliderPressed=false;
    document.documentElement.removeEventListener("mousemove",updatewbarwidth,false);
    // document.documentElement.removeEventListener("mouseup",widthAdaptMouseUp,false);
    widthHandlerUp=false;

    var styleEl=document.getElementById("BLICK_VARstyle");
    if(styleEl===null)addstyle2("");
    if(!VerticalScrollbar)curwid+=scrollbarWidth;
    // else
    // curwid+=20; //only if no scroll bar! (TODO)
    styleEl.innerHTML="#BLICK_watch_bar:hover{width:"+curwid+"px;height:"+zwiheight+"px;} #BLICK_watch_bar #wbar_wrap{width:"+curwid+"px} #BLICK_bar:hover{height:"+(zwiheight2+35)+"px;}#wbar_slider{height:"+(zwiheight-30)+"px;} "+transitionString;
    wrbar.style.width="";
    wbar.style.width="";
    adaptwboxheight();
    // transitionString=transitionString.substr(2,transitionString.length-4);
    // mystyle.innerHTML=mystyle.innerHTML.replace(/transsition/g,"transition");
    GM.setValue("curwid",curwid);
}
// var lastWidthChange=0;
function updatewbarwidth(e){
    // var curdat=Date.now();
    // if(curwidakt){

    wbar.style.width = (startWidth - e.clientX + startX) + 'px';
    wrbar.style.width = (startWidth - e.clientX + startX) + 'px';
    curwid=(startWidth - e.clientX + startX) ;//document.body.clientWidth - (e.pageX ? e.pageX : e.clientX + document.body.scrollLeft - document.body.clientLeft);

    // if(Date.now()-lastWidthChange<100)return;
    // setTimeout(function(){
    // adaptwboxheight(0);
    // },1000);
    // lastWidthChange=Date.now();
    // var styleEl=document.getElementById("BLICK_VARstyle");
    // if(styleEl===null)addstyle2("");

    // styleEl.innerHTML="#BLICK_watch_bar:hover{width:"+curwid+"px;height:"+zwiheight+"px;} #BLICK_watch_bar #wbar_wrap{width:"+curwid+"px} #BLICK_bar:hover{height:"+(zwiheight2+35)+"px;}"+transitionString;
    //
    // mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*varwidth\*\/\d+px\/\*varwidth\*\//g,"/*varwidth*/"+(curwid)+"px/*varwidth*/").replace(/transition/g,"transsition");
    // }
}
function removethisfromlist(event){
    var athread=/removefromwatchedthreads\( "(\d+)", "(\w+)"\);return false;/gi.exec(event.target.getAttributeNode('onclick').nodeValue);
    var i=0;
    for(i=0;i<watchids.length;i++){
        if(watchids[i].indexOf(athread[2]+String.fromCharCode(12)+athread[1]+String.fromCharCode(12))===0){
            watchids.splice(i,1);
            break;
        }
    }
    GM.setValue("watchids",watchids.join(String.fromCharCode(11)));

    for(i=0;i<externlistspeicher.length;i++){
        if(externlistspeicher[i][0]==athread[1])
            externlistspeicher.splice(i,1);
    }

    var tempdum=externlistspeicher.map(e => e.join(String.fromCharCode(11))).join(String.fromCharCode(10));
     /*   JSON.stringify(externlistspeicher);
    tempdum=tempdum.replace(/\],\[/g,String.fromCharCode(10));
    tempdum=tempdum.replace(/,/g,String.fromCharCode(11));
    tempdum=tempdum.replace(/"|^\[+|\]+$/g,"");
    */
    GM.setValue("externlistspeicher",tempdum);

    for(i=0;i<itemoptions.length;i++){
        if(itemoptions[i][0]==athread[1])
            itemoptions.splice(i,1);
    }
    var tempdum=itemoptions.map(e => e.join(String.fromCharCode(11))).join(String.fromCharCode(10));
    /*tempdum=JSON.stringify(itemoptions);
    tempdum=tempdum.replace(/\],\[/g,String.fromCharCode(10));
    tempdum=tempdum.replace(/,/g,String.fromCharCode(11));
    tempdum=tempdum.replace(/"|^\[+|\]+$/g,"");*/
    GM.setValue("itemoptions",tempdum);

    updatewbar(null,false);
    // var row=document.getElementById("BLICK_new"+qthread+"_"+athread[1]).parentNode;
    // row.parentNode.removeChild(row);
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function getlastviewref(thread, id){
    for(var i=0;i<lastviews.length;i++){
        if(lastviews[i].indexOf(thread+"_"+id)===0||lastviews[i].indexOf("quest_"+id)===0){
            var ruck=lastviews[i].split(String.fromCharCode(11));
            return (ruck.length==3?ruck:[ruck[0],ruck[1],"false"]);
        }
    }
    return 0;
}
function setlastviewref(thread, id, ref,count){
    var watched=-1;

    for(var j=0;j<watchids.length;++j){
        if(watchids[j].split(String.fromCharCode(12))[1]==id)watched=j;
    }
    if(watched==-1){
        return;}
    for(var i=0;i<lastviews.length;i++){
        if(lastviews[i].indexOf(thread+"_"+id)===0){
            lastviews[i]=thread+"_"+id+String.fromCharCode(11)+ref+String.fromCharCode(11)+count;
            GM.setValue("lastviews",lastviews.join(String.fromCharCode(12)));
            return thread+"_"+id+String.fromCharCode(11)+ref+String.fromCharCode(11)+count;
        }
        if(lastviews[i].indexOf("quest_"+id)===0){
            lastviews[i]="quest_"+id+String.fromCharCode(11)+ref+String.fromCharCode(11)+count;
            GM.setValue("lastviews",lastviews.join(String.fromCharCode(12)));
            return"quest_"+id+String.fromCharCode(11)+ref+String.fromCharCode(11)+count;
        }
    }

    lastviews.push(thread+"_"+id+String.fromCharCode(11)+ref+String.fromCharCode(11)+count);
    GM.setValue("lastviews",lastviews.join(String.fromCharCode(12)));
    return thread+"_"+id+String.fromCharCode(11)+ref+String.fromCharCode(11)+count;

}
var lastadapt=Date.now();
function adaptwboxheight(){
    if((Date.now()-lastadapt)<100)return;
    var el=document.getElementById("wbar_wrap");
    if(el===null)return;
    var varheight=parseInt(el.clientHeight);
    zwiheight=varheight;
    // zwiheight2=510;

    var styleEl=document.getElementById("BLICK_VARstyle");
    if(styleEl===null)addstyle2("");

    // zwiheight=window.innerHeight-el.offsetTop;
    // zwiheight2=window.innerHeight-el.offsetTop;

    if(85 + zwiheight2>window.innerHeight){ //85
        zwiheight2=window.innerHeight-115;
    }
    if(85 +zwiheight>window.innerHeight){
        zwiheight=window.innerHeight-115;

        // mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*varwidth\*\/\d+px\/\*varwidth\*\//g,"/*varwidth*/"+(curwid)+"px/*varwidth*/");
    }else{
        curwid-=20;
        // mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*varwidth\*\/\d+px\/\*varwidth\*\//g,"/*varwidth*/"+(curwid-20)+"px/*varwidth*/");
    }

    styleEl.innerHTML="#BLICK_watch_bar:hover{width:"+curwid+"px;height:"+zwiheight+"px;} #BLICK_watch_bar #wbar_wrap{width:"+curwid+"px} #BLICK_bar:hover{height:"+(zwiheight2+35)+"px;} #wbar_slider{height:"+(zwiheight-30)+"px;} "+transitionString;

    // mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*varheight\*\/[\s\S]*?\/\*varheight\*\//gi,"/*varheight*/"+zwiheight+"px/*varheight*/").replace(/\/\*var2height\*\/[\s\S]*?\/\*var2height\*\//gi,"/*var2height*/"+(zwiheight2+35)+"px/*var2height*/");
}
function expandClick (){
    setTimeout(function(){
        var imgs=document.getElementsByClassName("thumb");
        for(var i=0;i<imgs.length;i++){
            imgs[i].addEventListener("mouseover", imghoverin, false);
            imgs[i].addEventListener("mouseout", imghoverout, false);
        }
    },1000);
}
function insertbox(){
    imgbox=document.getElementById("BLICK_imgbox");
    if(imgbox===null){
        imgbox=document.createElement("div");
        imgbox.id="BLICK_imgbox";
        imgbox.innerHTML="<img src='"+wartbild+"' alt=''/><object width='' height=''><param name='movie' value=''/></object>";
        document.body.appendChild(imgbox);
        var i=0;

        addstyle("#BLICK_imgbox {"+
                 "visibility:hidden;display:block;position:fixed;top=0;"+
                 "}"+
                 "#BLICK_imgbox img{"+
                 "	margin:auto;display:block;"+
                 "}"+
                 "#BLICK_imgbox embed{"+
                 "	margin:auto;display:block;"+
                 "}");
        imgbox.addEventListener("mouseover", imghoverin, false);
        imgbox.addEventListener("mouseout", imghoverout, false);
        var imgs=document.getElementsByClassName("thumb");
        for(i=0;i<imgs.length;i++){
            imgs[i].addEventListener("mouseover", imghoverin, false);
            imgs[i].addEventListener("mouseout", imghoverout, false);
        }
        imgs=document.getElementsByClassName("expandthread");
        for(i=0;i<imgs.length;i++){
            imgs[i].addEventListener("click",expandClick, false);

        }
    }
}
//Technisches
function insertelements(){
    var buttons=document.getElementsByClassName("extrabtns");
    var click=document.createElement("A");
    click.title=lang[curlang][7];
    click.innerHTML="<img alt='' src='"+nextbutbild+"'/>";
    click.addEventListener("click",ladmehr,false);
    click.style.cursor="pointer";

    var quickrep;

    for(var i=0;i<buttons.length;i++){
        quickrep=buttons[i].getElementsByClassName('quickreply');
        if(quickrep.length>0){
            click.id="loadmore"+quickrep[0].parentNode.getAttribute("onclick").match(/\d+/)[0];
            buttons[i].appendChild(click);
            click=click.cloneNode(true);
            click.addEventListener("click",ladmehr,false);
        }
    }
    wartimg.src=wartbild;
    wartimg.setAttribute("style","display:none;top:50%;left:50%;position:fixed;");
    document.body.appendChild(wartimg);
}
async function ladmehr(){
    var threadid=this.parentNode.innerHTML.match(/quickreply\('(\d+)'\);/)[1];
    var curbyte=document.getElementById("replies"+threadid+window.location.href.match(/https?:\/\/.*?\/.*?\/(.*?)\//)[1]).innerHTML.length;
    var replyer=document.getElementById("replies"+threadid+window.location.href.match(/https?:\/\/.*?\/.*?\/(.*?)\//)[1]);
    var current=replyer.getAttribute("current");
    if (navigator.userAgent.indexOf('Firefox') != -1){

        if(current!==null&&current-3001<0)return;
        GM.xmlHttpRequest({
            method: 'GET',
            headers: {
                "Accept-Encoding": "",
                "Range": "bytes="+(current===null?"":(current-3000))+"-"+(current===null?(curbyte+4000):(current-1))
            },
            url: window.location.href.match(/https?:\/\/[\s\S]*\//) + 'res/'+threadid+".html",
            onload: function(responseDetails) {
                var replyer=document.getElementById("replies"+threadid+window.location.href.match(/https?:\/\/.*?\/.*?\/(.*?)\//)[1]);
                if(replyer.getAttribute("total")===null)replyer.innerHTML="";

                var inh=(responseDetails.responseText+(replyer.getAttribute("rest")!==null?decodeURI(replyer.getAttribute("rest")):"")).match(/([\s\S]*?)((<table>[\s\S]*?<\/table>\s*)+)/);
                var autoreladmehr=false;
                if(inh===null){
                    inh=["",responseDetails.responseText+decodeURI(replyer.getAttribute("rest")),""]	;
                    autoreladmehr=true;
                }
                replyer.innerHTML=inh[2]+replyer.innerHTML;
                replyer.setAttribute("rest",encodeURI(inh[1]));
                var korr=replyer.innerHTML.indexOf(",<table>");
                if(korr>-1)replyer.innerHTML=replyer.innerHTML.substr(0,korr);
                var imgs=document.getElementById("replies"+threadid+window.location.href.match(/https?:\/\/.*?\/.*?\/(.*?)\//)[1]).getElementsByClassName("thumb");
                var offs=responseDetails.responseHeaders.match(/Content-Range: bytes (\d+)-\d+\/(\d+)/);
                if(offs!==null){replyer.setAttribute("total",offs[2]);replyer.setAttribute("current",offs[1]);}
                for(var i=0;i<imgs.length;i++){
                    imgs[i].addEventListener("mouseover", imghoverin, false);
                    imgs[i].addEventListener("mouseout", imghoverout, false);
                }
                insertcode("addpreviewevents();");
                if(autoreladmehr){
                    var evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent("click", true, true, null,0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    document.getElementById("loadmore"+threadid).dispatchEvent(evt);
                }
            }
        });
    }else{
        GM.xmlHttpRequest({
            url:window.location.href.match(/https?:\/\/[\s\S]*\//) + 'res/'+threadid+"+50.html", //TODO: +50 existing?
            method: 'GET',
            onload: function(data){
                var inh=(data.responseText+(replyer.getAttribute("rest")!==null?decodeURI(replyer.getAttribute("rest")):"")).match(/(?:<table>[\s\S]*?<\/table>\s*)+/);
                if(inh===null){
                    GM.xmlHttpRequest({
                        url:window.location.href.match(/https?:\/\/[\s\S]*\//) + 'res/'+threadid+".html",
                        method: 'GET',
                        onload: function(data){
                            var inh=(data.responseText+(replyer.getAttribute("rest")!==null?decodeURI(replyer.getAttribute("rest")):"")).match(/(?:<table>[\s\S]*?<\/table>\s*)+/);
                            replyer.innerHTML=inh[0]+replyer.innerHTML;
                            var imgs=document.getElementById("replies"+threadid+window.location.href.match(/https?:\/\/.*?\/.*?\/(.*?)\//)[1]).getElementsByClassName("thumb");

                            for(var i=0;i<imgs.length;i++){
                                imgs[i].addEventListener("mouseover", imghoverin, false);
                                imgs[i].addEventListener("mouseout", imghoverout, false);
                            }
                        }
                    });
                    return;
                }
                replyer.innerHTML=inh[0]+replyer.innerHTML;
                var imgs=document.getElementById("replies"+threadid+window.location.href.match(/https?:\/\/.*?\/.*?\/(.*?)\//)[1]).getElementsByClassName("thumb");

                for(var i=0;i<imgs.length;i++){
                    imgs[i].addEventListener("mouseover", imghoverin, false);
                    imgs[i].addEventListener("mouseout", imghoverout, false);
                }
            }
        });
    }
}
function imghoverin(){
    if(!liseinst)return;
    var link=this.parentNode.parentNode;
    if(link.tagName=="A"){

        imgbox.getElementsByTagName("IMG")[0].style.display="none";
        imgbox.getElementsByTagName("object")[0].style.display="none";
        if(link.href.indexOf(".swf")==-1){
            bildel=imgbox.getElementsByTagName("IMG")[0];
            bildel.addEventListener("load", imgsize);
            bildel.style.height="";
            bildel.style.width="";
            bildel.src=wartbild; //unimportant which image, just a different, valid one
            bildel.src=link.href;
        }
        else{
            bildel=imgbox.getElementsByTagName("object")[0];
            bildel.height=0.9*window.innerHeight;
            bildel.width=0.9*window.innerWidth;
            bildel.data=link.href;
            bildel.getElementsByTagName("param")[0].value=link.href;
            imgsizeint=setInterval(imgsize,500);
            // bildel.addEventListener("load", imgsize);
        }
        bildel.style.display="block";
        wartimg.style.display="block";
        ladeabbruch=false;

    }else if(this.id=="BLICK_imgbox")imgbox.style.visibility="visible";

}
function imghoverout(){
    imgbox.style.visibility="hidden";
    wartimg.style.display="none";
    ladeabbruch=true;
    clearInterval(imgsizeint);
}
function imgsize(){
    if(bildel.clientHeight+bildel.clientWidth>0)clearInterval(imgsizeint);
    if(ladeabbruch)return;
    if(bildel.tagName!="OBJECT"){
        if(window.innerHeight*0.9<bildel.clientHeight){
            bildel.style.height=0.9*window.innerHeight+"px";
        }
        if(window.innerWidth*0.9<bildel.clientWidth){
            bildel.style.height="";bildel.style.width=0.9*window.innerWidth+"px";
        }
    }
    imgbox.style.top=(window.innerHeight-imgbox.clientHeight)/2+"px";
    imgbox.style.left=(window.innerWidth-imgbox.clientWidth)/2+"px";

    imgbox.style.visibility="visible";
    wartimg.style.display="none";
}
function getSpeicherIndexById(id){
    for(var i=0;i<externlistspeicher.length;i++){
        if(externlistspeicher[i][0]==id)return i;
    }
    return -1;
}
function getOptionIndexById(id){
    for(var i=0;i<itemoptions.length;i++){
        if(itemoptions[i][0]==id)return i;
    }

    itemoptions.push([id,0,0,true,"",false,false,"", false, "","",false]);
    //id, lastcheck, interval, highonImg, highIDs, highonAll, ignoreImg, ignoreIDs, ignoreAll, highNames, ignoreNames, linktoImg

    return i;
}
function optionwindow(event){
    optcan();
    var opt = document.createElement('div');
    opt.id="devopts";
    opt.setAttribute('style',"font:10pt Verdana,Arial,Helvetica,sans-serif!important;background-color:#393;left:"+ ((window.innerWidth - 300)/2 - 20) +"px;top:"+ ((window.innerHeight - 430)/2 - 20) +"px;width:300px;height:450px;padding:10px;border:3px ridge black;position:fixed;z-index:99999999;border-radius:15px;box-shadow:2px 2px 5px black;");
    var optid=getOptionIndexById(event.target.getAttribute("eleid"));
    if(optid==-1){
        itemoptions.push([event.target.getAttribute("eleid"),(new Date()).getTime(),0,true,"",false,false,"",false,"",""]);
        optid=itemoptions.length-1;
    }
    opt.innerHTML="<h2 align='center'>Options</h2>"+
        "<div class='BLICK_options_left'><label for='BLICK_viewinterval'>Update Interval (number for hours)</label></div><div class='BLICK_options_right'><input type='text' id='BLICK_viewinterval' value='"+itemoptions[optid][2]+"'/></div>"+
        "<br />"+
        "<div class='BLICK_options_left'>Highlight on</div><br/>"+
        "<div class='coll3'><p>Images</p><div class='BLICK_checkwrap'><input type='checkbox' id='BLICK_imghigh' "+(itemoptions[optid][3]?"checked='checked'":"")+"/><label for='BLICK_imghigh' class='BLICK_checklabel'></label></div></div>"+
        "<div class='coll3'><p>IDs (divide by ,)</p><input type='text' id='BLICK_posthigh' value='"+itemoptions[optid][4]+"'/></div>"+
        "<br />"+
        "<div class='coll3'><p>All new posts</p><div class='BLICK_checkwrap'><input type='checkbox' id='BLICK_allhigh' "+(itemoptions[optid][5]?"checked='checked'":"")+"/><label for='BLICK_allhigh' class='BLICK_checklabel'></label></div></div>"+
        "<div class='coll3'><p>Names (divide by ,)</p><input type='text' id='BLICK_namehigh' value='"+itemoptions[optid][9]+"'/></div>"+
        "<br />"+
        "<div class='BLICK_options_left'>Ignore all</div><br/>"+
        "<div class='coll3'><p>Images</p><div class='BLICK_checkwrap'><input type='checkbox' id='BLICK_imgignore' "+(itemoptions[optid][6]?"checked='checked'":"")+"/><label for='BLICK_imgignore' class='BLICK_checklabel'></label></div></div>"+
        "<div class='coll3'><p>IDs (divide by ,)</p><input type='text' id='BLICK_postignore' value='"+itemoptions[optid][7]+"'/></div>"+
        "<br />"+
        "<div class='coll3'><p>All new posts</p><div class='BLICK_checkwrap'><input type='checkbox' id='BLICK_allignore' "+(itemoptions[optid][8]?"checked='checked'":"")+"/><label for='BLICK_allignore' class='BLICK_checklabel'></label></div></div>"+
        "<div class='coll3'><p>Names (divide by ,)</p><input type='text' id='BLICK_nameignore' value='"+itemoptions[optid][10]+"'/></div>"+
        "<div class='coll3'><p>Link to newest Image</p><div class='BLICK_checkwrap'><input type='checkbox' id='BLICK_linktohigh' "+(itemoptions[optid][11]?"checked='checked'":"")+"/><label for='BLICK_linktohigh' class='BLICK_checklabel'></label></div></div>"+
        "<br />"+
        "<input type='button' value='Save' id='devoptsav' style='margin-left:80px;' elid='"+optid+"'/>"+
        "<input type='button' value='Cancel' id='devoptcan' style='margin-left:30px;' />";
    document.body.appendChild(opt);
    document.getElementById("devoptsav").addEventListener("click",optsav,false);
    document.getElementById("devoptcan").addEventListener("click",optcan,false);
}
function optcan(){
    var rem=document.getElementById("devopts");
    if(!rem)return;
    rem.parentNode.removeChild(rem);
}
function optsav(event){
    var optid=event.target.getAttribute("elid");
    itemoptions[optid][2]=parseInt(document.getElementById("BLICK_viewinterval").value);
    itemoptions[optid][3]=document.getElementById("BLICK_imghigh").checked;
    itemoptions[optid][4]=document.getElementById("BLICK_posthigh").value+"";
    itemoptions[optid][5]=document.getElementById("BLICK_allhigh").checked;
    itemoptions[optid][6]=document.getElementById("BLICK_imgignore").checked;
    itemoptions[optid][7]=document.getElementById("BLICK_postignore").value+"";
    itemoptions[optid][8]=document.getElementById("BLICK_allignore").checked;
    itemoptions[optid][9]=document.getElementById("BLICK_namehigh").value+"";
    itemoptions[optid][10]=document.getElementById("BLICK_nameignore").value+"";
    itemoptions[optid][11]=document.getElementById("BLICK_linktohigh").value+"";

    if(itemoptions[optid][2]<0)itemoptions[optid][2]=0;

    var tempdum=itemoptions.map(e => e.join(String.fromCharCode(11))).join(String.fromCharCode(10));
    /*var tempdum=JSON.stringify(itemoptions);
    tempdum=tempdum.replace(/\],\[/g,String.fromCharCode(10));
    tempdum=tempdum.replace(/,/g,String.fromCharCode(11));
    tempdum=tempdum.replace(/"|^\[+|\]+$/g,"");*/
    GM.setValue("itemoptions",tempdum);
    optcan();
}
function schriftreiher(){
    schriftreihe=schriftliste[scheinst];
    for(var i=0;i<schriftliste.length;i++)if(i!=scheinst)schriftreihe+=", "+schriftliste[i];
}
function schriftvergr(grosser){
    if(grosser)groeinst++;else groeinst--;
    mystyle.innerHTML=mystyle.innerHTML.replace(/\/\*\*\/\d+px\/\*\*\//gi,"/**/"+groeinst+"px/**/");
    GM.setValue("groeinst",groeinst);
}
/*function showzipper(){
    var posts=document.getElementsByClassName("postwidth");

    firstauthor=posts[0].getElementsByClassName('postername');
    if(firstauthor.length>0)firstauthor=firstauthor[0].textContent.trim();else firstauthor="";

    firsttitle=posts[0].getElementsByClassName('filetitle');
    if(firsttitle.length>0)firsttitle=firsttitle[0].textContent.replace(/&nbsp;/g," ").trim();else firsttitle="No Title";

    firstid=posts[0].getElementsByClassName('uid');
    if(firstid.length>0)firstid=firstid[0].textContent.replace(/&nbsp;/g," ").trim();else firstid="";

    var imgOnly,PDFdivider,PDFheader,PDFpageHeader,PDFimgSize,PDFImgQual;

    var prom=(async function(){
        imgOnly=await GM.getValue("PDFimgOnly",false);
        PDFdivider=await GM.getValue("PDFdivider",false);
        PDFheader=await GM.getValue("PDFheader",true);
        PDFpageHeader=await GM.getValue("PDFimgSize",90);
        PDFimgSize=await GM.getValue("PDFImgQual",100);
        PDFImgQual=await GM.getValue("PDFpageHeader",true);
    })();
    prom.then(function(){
        addstyle(""+
                 "#questden_zip_menu{padding:15px;border-radius:10px;box-shadow:2px 2px 2px #000000, 2px 2px 6px #999 inset,-2px -2px 3px #333 inset;position:fixed;top:50%;left:50%;width:400px;height:auto;margin-left:-200px;margin-top:-200px;background-color:white;}"+
                 "#questden_zip_menu div{margin:5px 0}"+
                 "#questden_zip_menu div.questden_zip_header{font-size:14pt;text-align:center;font-weight:bold;}"+
                 "#questden_zip_menu div.questden_zip_explain{text-align:justify;margin:15px 0px;height:1em;overflow:hidden;transition: height 0.5s;cursor:pointer;}"+
                 "#questden_zip_menu div.questden_zip_explain:hover{height:150px;}"+
                 "#questden_zip_menu label{width:150px;display:inline-block;vertical-align: middle;}"+
                 "#questden_zip_menu input, #questden_zip_menu select{width:200px;}"+
                 "#questden_zip_menu #questden_zip_generate_button{width:100px;height:30px;text-align:center;font-weight:bold;box-shadow:2px 2px 2px #200, 2px 2px 6px #a99 inset,-2px -2px 3px #433 inset;line-height:30px;background-color:#fdd;border-radius:15px;cursor:pointer;margin:auto;}"+
                 "#questden_zip_menu #questden_zip_generate_button:hover, #questden_zip_menu #questden_zip_close:hover{box-shadow:1px 1px 1px #200, 1px 1px 4px #a99 inset,-1px -1px 2px #433 inset;}"+
                 "#questden_zip_menu #questden_zip_generate_button:active, #questden_zip_menu #questden_zip_close:active{box-shadow: 2px 2px 6px #533 inset,-1px -1px 2px #533 inset;}"+
                 "#questden_zip_menu #questden_zip_close{width:20px;height:20px;text-align:center;font-weight:bold;box-shadow:2px 2px 2px #200, 2px 2px 6px #a99 inset,-2px -2px 3px #433 inset;line-height:20px;background-color:#fdd;border-radius:10px;cursor:pointer;position:absolute;top:5px;right:15px;}"+
                 "#questden_zip_menu #questden_zip_generate_progress{margin:10px auto;width:80%;height:20px;background-image:linear-gradient(90deg, #9AD15F 0%, #D3DFD5 0%);text-align:center;}"+
                 "");
        var element=""+
            "<div id='questden_zip_close'>X</div>"+
            "<div class='questden_zip_header'>Generate a PDF-file for this quest</div>"+
            "<div class='questden_zip_explain'>"+
            "PDF (portable document format) files can be downloaded and read offline in many devices. They contain Images, texts, links and formats and can be printed easily. Please note that animations, sounds and flash files are not supported. Animated .gif files get converted to jpg with their first frame. F̯̓͢r̴ͨ᷁a̭ͬ̌c̭᷊͔ṱ̾ͫu̻̒͌r̷̜̒e̅ͦ̽d̰̈͢ text will become unreadable."+
            "</div>"+
            "<div class='questden_zip_title'><label for='questden_zip_title_text'>Title</label><input type='text' value='"+firsttitle+"' id='questden_zip_title_text'/></div>"+
            "<div class='questden_zip_author'><label for='questden_zip_author_text'>Included posts (name, id or no., empty for all)</label><input type='text' value='"+firstauthor+"' id='questden_zip_author_text'/></div>"+
            "<div><label for='questden_zip_imagesOnly'>Only posts with Image</label><input type='checkbox' id='questden_zip_imagesOnly' "+(imgOnly?"checked='checked'":"")+"/></div>"+
            "<div><label for='questden_zip_PDFdivider'>Post Separator</label><input type='checkbox' id='questden_zip_PDFdivider' "+(PDFdivider?"checked='checked'":"")+"/></div>"+
            "<div><label for='questden_zip_PDFheader'>Post Header</label><input type='checkbox' id='questden_zip_PDFheader' "+(PDFheader?"checked='checked'":"")+"/></div>"+
            "<div><label for='questden_zip_PDFpageHeader'>Page Header</label><input type='checkbox' id='questden_zip_PDFpageHeader' "+(PDFpageHeader?"checked='checked'":"")+"/></div>"+
            "<div><label for='questden_zip_PDFimgSize'>image size(% width)</label><input type='text' id='questden_zip_PDFimgSize' value='"+PDFimgSize+"' /></div>"+
            "<div><label for='questden_zip_PDFImgQual'>image quality(%)</label><input type='text' id='questden_zip_PDFImgQual' value='"+PDFImgQual+"' /></div>"+
            "<div id='questden_zip_generate_progress'></div>"+
            "<div id='questden_zip_generate_button'>Generate</div>"+
            "";
        var el =document.createElement("div");
        el.innerHTML=element;
        el.id="questden_zip_menu";
        document.body.appendChild(el);
        document.getElementById("questden_zip_author_text").value=firstauthor;
        document.getElementById("questden_zip_close").addEventListener("click",function(){
            document.body.removeChild(this.parentNode);
        });
        document.getElementById("questden_zip_generate_button").addEventListener("click",function(){
            firsttitle=document.getElementById("questden_zip_title_text").value;

            var imgOnly,PDFdivider,PDFheader,PDFpageHeader,PDFimgSize,author,PDFImgQual;
            author= document.getElementById("questden_zip_author_text").value.split(",");
            imgOnly = document.getElementById("questden_zip_imagesOnly").checked;
            PDFdivider= document.getElementById("questden_zip_PDFdivider").checked;
            PDFheader= document.getElementById("questden_zip_PDFheader").checked;
            PDFpageHeader= document.getElementById("questden_zip_PDFpageHeader").checked;
            PDFimgSize= document.getElementById("questden_zip_PDFimgSize").value;
            PDFImgQual= document.getElementById("questden_zip_PDFImgQual").value;

            GM.setValue("PDFimgOnly",imgOnly);
            GM.setValue("PDFdivider",PDFdivider);
            GM.setValue("PDFheader",PDFheader);
            GM.setValue("PDFpageHeader",PDFpageHeader);
            GM.setValue("PDFimgSize",PDFimgSize);
            GM.setValue("PDFImgQual",PDFImgQual);

            var testpdf=new questden2PDF();
            testpdf.title=firsttitle;
            testpdf.progressCallback=function(phase, index, thumbs, posts){

                if(phase===0){
                    document.getElementById("questden_zip_generate_progress").style="	background-image:linear-gradient(90deg, #9AD15F "+(index/(thumbs)*100)+"%, #D3DFD5 "+(index/thumbs*100+10)+"%)";
                    document.getElementById("questden_zip_generate_progress").innerHTML="Downloading image "+index +"/"+thumbs;
                }else if(phase==1){
                    document.getElementById("questden_zip_generate_progress").style="	background-image:linear-gradient(90deg, #9AD15F "+(index/(posts)*100)+"%, #D3DFD5 "+(index/posts*100+10)+"%)";
                    document.getElementById("questden_zip_generate_progress").innerHTML="Processing post "+index +"/"+posts;
                }
            };
            testpdf.postDivider=PDFdivider;
            testpdf.postHeader=PDFheader;
            testpdf.pageHeader=PDFpageHeader;
            testpdf.imgwidh=PDFimgSize/100 *(testpdf.pageWidth -2*testpdf.margin);
            testpdf.jpgQuality=PDFImgQual/100;

            var inclusion=Array.prototype.slice.call(document.querySelectorAll("#delform, td.reply, td.highlight"));
            for(var j=inclusion.length-1;j>=0;--j){
                if(inclusion[j].id=="delform")continue;
                if(imgOnly && inclusion[j].querySelectorAll("img.thumb").length===0){inclusion.splice(j,1);continue;}
                if(author.length==1&&author[0]==="")continue;
                for(var i=0;i<author.length;++i){
                    if(getText(inclusion[j].querySelector("span.postername")).toLowerCase() == author[i].toLowerCase())continue;
                    if(getText(inclusion[j].querySelector("span.uid")).toLowerCase() == author[i].toLowerCase())continue;
                    if(getText(inclusion[j].querySelectorAll("span.reflink a")[1]).toLowerCase() == author[i].toLowerCase())continue;
                }
            }


            // var inclusion=$("#delform, td.reply, td.highlight").filter(function(){
            // if($(this).attr("id")=="delform")return true;
            // if(imgOnly && $(this).find("img.thumb").length===0) return false;
            // for(var i=0;i<author.length;++i){
            // if($(this).find("span.postername").text().toLowerCase()==author[i].toLowerCase())return true;
            // if($(this).find("span.uid").text().toLowerCase().indexOf(author[i].toLowerCase())!=-1)return true;
            // if($(this).find("span.reflink a").eq(1).text().toLowerCase()==author[i].toLowerCase())return true;
            // }
            // if(author.length==1&&author[0]==="")return true;
            // return false;
            // });
            if(inclusion.length===0){
                alert("No post selected for output!");
                return;
            }
            testpdf.convert(inclusion);

        });
    });
}
*/
function getText(elems){ //like Sizzle
    var ret = "", elem;

    for ( var i = 0; elems[i]; i++ ) {
        elem = elems[i];

        // Get the text from text nodes and CDATA nodes
        if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
            ret += elem.nodeValue;

            // Traverse everything else, except comment nodes
        } else if ( elem.nodeType !== 8 ) {
            ret += getText( elem.childNodes );
        }
    }

    return ret;
}
function addstyle(text){
    if(document.getElementById("BLICK_style")===null){
        var sty =document.createElement("style");
        sty.innerHTML=text;
        sty.id="BLICK_style";
        sty.setAttribute("type","text/css");
        document.head.appendChild(sty);
        mystyle=sty;
    }else{
        if(!mystyle)mystyle=document.getElementById("BLICK_style");
        mystyle.innerHTML+=text;
    }
}
function addstyle2(text){
    var sty2;
    if(document.getElementById("BLICK_VARstyle")===null){
        sty2=document.createElement("style");
        sty2.innerHTML=text;
        sty2.id="BLICK_VARstyle";
        sty2.setAttribute("type","text/css");
        document.head.appendChild(sty2);
        // mystyle=sty;
    }else{
        sty2 =document.getElementById("BLICK_VARstyle");
        sty2.innerHTML+=text;
    }
}
function start(){
    if(invert)invertcolor();
    if(gloeinst)gros();
    if(abseinst)absatz();
    insertelements();
    insertbar();
    if(poseinst)postf();
    if(liseinst)insertbox();
    urlanalyse();
    if(wateinst)insertwatchbar();
}
function urlanalyse(){
    var refmatch=window.location.href.match(/kusaba\/(\w+)\/res\/(\d+)\+?\d*.html/);
    var refs=document.getElementsByClassName("reflink");
    if(refmatch){
        setlastviewref(refmatch[1],refmatch[2],refs[refs.length-1].getElementsByTagName("a")[0].getAttribute("onclick").match(/\d+/),((window.location.href.search(/\+50.html/)!=-1)||(refs.length>50))?"1":"0");
        var speid=getSpeicherIndexById(refmatch[2]);
        if(speid==-1){
            externlistspeicher.push([refmatch[2],0,0,0]);
        }else{
            externlistspeicher[speid][1]=0;
            externlistspeicher[speid][2]=0;
            externlistspeicher[speid][3]=0;
        }

        var tempdum=externlistspeicher.map(e => e.join(String.fromCharCode(11))).join(String.fromCharCode(10));
        /*var tempdum=JSON.stringify(externlistspeicher);
        tempdum=tempdum.replace(/\],\[/g,String.fromCharCode(10));
        tempdum=tempdum.replace(/,/g,String.fromCharCode(11));
        tempdum=tempdum.replace(/"|^\[+|\]+$/g,"");*/
        GM.setValue("externlistspeicher",tempdum);
    }
}
function insertcode(text){
    var sty =document.createElement("script");
    sty.innerHTML=text;
    sty.id="BLICK_script";
    sty.setAttribute("type","text/javascript");
    sty.setAttribute("language","havascript");
    document.head.appendChild(sty);
    document.head.removeChild(sty);
}

Array.prototype.trim=function(el){
    for(var i=this.length-1;i>-1;i--){
        if(this[i]==el)this.splice(i,1);
    }
    return this;
};
function backwardversion(){
    var vers;
    var prom=(async function(){vers=GM.getValue("version");})();
    prom.then(function(){
        if(vers===null||vers<172){
            GM.setValue("version",172);
            for(var i=0;i<itemoptions.length;i++){
                // var itemoptions=new Attay(); // {string threadID,int milisecForLastCheck, int viewinterval (hours, 0->on reload),bool highlightOnImage,bool highlichtOnID, string highlightID}
                //to
                // var itemoptions=new Attay(); // {string threadID,int milisecForLastCheck, int viewinterval (hours, 0->on reload),bool highlightOnImage,bool highlichtOnID, string highlightIDs, bool highlightonall, bool ignoreonimage, bool ignoreonID, string ignoreIDs, bool ignoreAll}
                itemoptions[i][4]=itemoptions[i][5]; //highlight ID activated when !=""
                itemoptions[i][5]=false; //highlight all
                itemoptions[i][6]=false; //ignoreimg
                itemoptions[i][7]=""; //ignoreonID
                itemoptions[i][8]=false;	//ignoreALL
                itemoptions[i][9]="";	//highlight name
                itemoptions[i][10]="";	//ignore name
                itemoptions[i][11]=true;	//link to  image post
            }//else if(laden("version")<178){}

            var tempdum=itemoptions.map(e => e.join(String.fromCharCode(11))).join(String.fromCharCode(10));
           /* var tempdum=JSON.stringify(itemoptions);
            tempdum=tempdum.replace(/\],\[/g,String.fromCharCode(10));
            tempdum=tempdum.replace(/,/g,String.fromCharCode(11));
            tempdum=tempdum.replace(/"|^\[+|\]+$/g,"");*/
            GM.setValue("itemoptions",tempdum);
        }
    });
}
async function loadSets(){
    syncusername=await GM.getValue("syncusername","");
    syncuserpass=await GM.getValue("syncuserpass","");

    externwbar=(await GM.getValue("externwbar",true)).toString()=="true";
    gloeinst=(await GM.getValue("gloeinst",true)).toString()=="true";
    groeinst=await GM.getValue("groeinst",18);
    curwid=await GM.getValue("curwid",340);
    abseinst=(await GM.getValue("abseinst",true)).toString()=="true";
    invert=(await GM.getValue("invert",false)).toString()=="true";
    liseinst=(await GM.getValue("liseinst",true)).toString()=="true";
    wateinst=(await GM.getValue("wateinst",true)).toString()=="true";
    autoupdate=(await GM.getValue("autoupdate",false)).toString()=="true";
    poseinst=(await GM.getValue("poseinst",true)).toString()=="true";
    scheinst=await GM.getValue("scheinst",0);
    imghover=(await GM.getValue("imghover",true)).toString()=="true";
    curlang=await GM.getValue("curlang",1);
    watchids=(await GM.getValue("watchids","")).split(String.fromCharCode(11));
    lastviews=(await GM.getValue("lastviews","")).split(String.fromCharCode(12));

    var cnamlist=await GM.getValue("charnamelist","");
    if(typeof cnamlist!=="undefined"&&cnamlist!==null){
        charnamelist=cnamlist.split(String.fromCharCode(12));
        for(i=0;i<charnamelist.length;i++)
            charnamelist[i]=charnamelist[i].split(String.fromCharCode(11));
    }
    var itemopt=await GM.getValue("itemoptions","");
    if(typeof itemopt!=="undefined"&&itemopt!==null){
        tempdum=itemopt.split(String.fromCharCode(10));
        for(i=0;i<tempdum.length;i++){
            itemoptions.push(tempdum[i].split(String.fromCharCode(11)));
            itemoptions[i][1]=parseInt(itemoptions[i][1]);
            itemoptions[i][2]=parseInt(itemoptions[i][2]);
            itemoptions[i][3]=itemoptions[i][3]=="true";
            if(itemoptions[i].length>=11){
                itemoptions[i][4]=itemoptions[i][4];
                itemoptions[i][5]=itemoptions[i][5]=="true";
                itemoptions[i][6]=itemoptions[i][6]=="true";
                itemoptions[i][7]=itemoptions[i][7];
                itemoptions[i][8]=itemoptions[i][8]=="true";
                itemoptions[i][9]=itemoptions[i][9];
                itemoptions[i][10]=itemoptions[i][10];
                if(itemoptions[i].length==12)itemoptions[i][11]=itemoptions[i][11]=="true";
            }else if(itemoptions[i].length==6){
                itemoptions[i][4]=itemoptions[i][4]=="true";
                itemoptions[i][5]=itemoptions[i][5];
            }
            if(typeof itemoptions[i][11]== "undefined")itemoptions[i][11]=true;

        }
    }
  	//console.log(itemoptions);
    var extsp=await GM.getValue("externlistspeicher","");
    if(typeof extsp!=="undefined"&&extsp!==null){
        tempdum=extsp.split(String.fromCharCode(10));
        for(i=0;i<tempdum.length;i++){
            externlistspeicher.push(tempdum[i].split(String.fromCharCode(11)));
            externlistspeicher[i][1]=parseInt(externlistspeicher[i][1]);
            externlistspeicher[i][2]=parseInt(externlistspeicher[i][2]);
            externlistspeicher[i][3]=parseInt(externlistspeicher[i][3]);
        }
    }

    backwardversion();
}
var lprom=loadSets();

lprom.then(start);