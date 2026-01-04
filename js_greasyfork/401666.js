// ==UserScript==
// @name         SSC Utility v1.3
// @namespace    http://skyscrapercity.com/
// @version      1.3
// @description  Changes: unknown
// @author       jawik80
// @match        https://www.skyscrapercity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401666/SSC%20Utility%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/401666/SSC%20Utility%20v13.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var opcje_daty = { year: 'numeric', month: 'short', day: 'numeric',
                       hour: 'numeric', minute: 'numeric'};
  var v101 = "211";
  var v102 = "212";
  var elements = document.querySelectorAll('.message-attribution-main .u-dt');
//  var elements = document.querySelectorAll('.u-concealed .u-dt');
  var czasy = document.querySelectorAll('.message-attribution-main time'), i;
  var CSSelement = document.getElementsByClassName('p-footer-row-opposite');
  var CSSversion = CSSelement[0].getBoundingClientRect().width;

  var isCSSv102 = true;
  var licznik = 0;

  [].forEach.call( elements, function (el) {
    var str = new Intl.DateTimeFormat( 'en-GB', opcje_daty ).format( new Date( el.dateTime) );
    var datoczas_utworzenia = str.slice(0, -5) + '  at ' + str.slice(-5);

    el.title = datoczas_utworzenia;
    ClearOldAgo();
    el.addEventListener('DOMSubtreeModified', ClearOldAgo);

    function ClearOldAgo(e)
    {
      var jak_dawno = el.innerHTML;
      if ( jak_dawno.slice(-3) != "ago" )
      {
        el.title = datoczas_utworzenia;
      }
      else
      {
        if (isCSSv102)
        {
          el.title = datoczas_utworzenia + ",   " + jak_dawno;
        }
        else
        {
          el.title = datoczas_utworzenia;
        }
      }
    }
  });

// --------------------------------------------------------------------------------------------

  var time1 = setInterval(function() {

    licznik++;
    if (CSSversion == v102)
    {
      clearInterval(time1);
      isCSSv102 = true;
      for (i = 0; i < czasy.length; ++i) {
 //       czasy[i].style.visibility = "hidden";
        czasy[i].style.color = "rgba(255,255,255,0)";
      }
    }
    else
    {
      isCSSv102 = false;
      for (i = 0; i < czasy.length; ++i) {
 //       czasy[i].style.visibility = "visible";
        czasy[i].style.color = "rgba(255,255,255,255)";
      }
    }
    if (licznik >= 20) {
      clearInterval(time1);
    }
  }, 100);


  var time2 = setInterval(function() {
    var gdzie = document.getElementsByClassName('fr-element fr-view');
    if (gdzie.length != 0 )
    {
      for ( var licznik_edytorow = 0; licznik_edytorow < gdzie.length; licznik_edytorow++)
      {
        var obrazki = gdzie[licznik_edytorow].querySelectorAll('.bbImage.fr-fic.fr-dii.fr-draggable');
        for ( var licznik_obrazkow = 0; licznik_obrazkow < obrazki.length; licznik_obrazkow++)
        {
          var obrazek = obrazki[licznik_obrazkow];
          if (!(obrazek.getAttribute('src') != ""))
          {
            if (obrazek.getAttribute('src') != obrazek.getAttribute('data-url'))
            {
              obrazek.setAttribute('src', obrazek.getAttribute('data-url'));
            }
            else
            {
              if (obrazek.getAttribute('src') != obrazek.getAttribute('data-src'))
              {
                obrazek.setAttribute('src', obrazek.getAttribute('data-src'));
              }
            }
          }
        }
      }
    }
  }, 500);

// ==========================================================================================
//alert('UWAGA');
  function DOMReady()
  {
//  alert('DOM is ready');
    function LoadClassicEmoji(e)
    {
      var emoji_menus = document.getElementsByClassName("js-emojiFullList");
      if (emoji_menus.length != 0) // ------------------------------------------------------------------jesli istnieja okna wyboru emotek
      {
        for (var numer_edytora = 0; numer_edytora < emoji_menus.length; numer_edytora++) // ------------powtarzaj dla kazdego okna wyboru emotek
        {
          if (emoji_menus[numer_edytora].children[4].className != "menu-header header-classic-smilies")
          {
//          alert('Create menu Classic Emoji: ' + numer_edytora.toString());
            var newh3 = document.createElement("h3");
            var newdiv = document.createElement("div");
            var newul = document.createElement('ul');
            var wsad = "";
            var x, y = 0;
            var czystka = function (str)
            {
              var temp = document.createElement('div');
              temp.textContent = str;
              return temp.innerHTML;
            };

            newh3.setAttribute("class", "menu-header header-classic-smilies");
            newh3.innerHTML="Classic smilies";
            emoji_menus[numer_edytora].insertBefore(newh3, emoji_menus[numer_edytora].children[4]);               //emoji groups: h3
            newdiv.setAttribute("class", "menu-row row-classic-smilies");
            emoji_menus[numer_edytora].insertBefore(newdiv, emoji_menus[numer_edytora].children[5]);              //emoji groups: div
            newul.setAttribute("class", "emojiList js-emojiList list-classic-smilies");
            emoji_menus[numer_edytora].children[5].appendChild(newul);
            for (x = 0; x < gifs.length; x++)
            {
              var gifs_index = gifs[x][0];
              var gifs_alt = gifs[x][1]; if (gifs_alt === "") { gifs_alt = ":none"+x.toString()+":"};
              var gifs_addr = gifs[x][2];
              wsad +="<li><a class=\"js-emoji\" data-shortname=\"" + gifs_alt.toString() + "\">"+
                     "<img src=\"" + gifs_addr + "\" "+
                     "data-url=\"" + gifs_addr + "\" "+
                     "data-src=\"" + gifs_addr + "\" "+
                     "class=\"bbImage fr-fic fr-dii fr-draggable classic-smilies\" "+
                     "alt=\"" + gifs_alt.toString() + "\" "+
                     "title=\" \" "+
                     "data-shortname=\"" + gifs_alt.toString() + "\"></a></li>";
            }
            emoji_menus[numer_edytora].children[5].children[0].innerHTML = wsad;
          }
        }
      }
    }
    document.addEventListener('DOMSubtreeModified', LoadClassicEmoji);

    var cnt1 = 0;
    var articles_on_page = document.querySelectorAll(".message--post");
    for (cnt1 = 0; cnt1 < articles_on_page.length; cnt1++)
    {
      function getAuthorDataFromSSC(cnt, addrSSC) {
        fetch(addrSSC)
        .then(function(response) {
          return response.text();
        })
        .then(function(html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, "text/html");
          var tmp = doc.querySelectorAll('[qid="profile-page-reaction-score-count"]')[0].innerText;
          var posts = articles_on_page[cnt].querySelectorAll('[qid="message-number-of-posts"]')[0];
          var str = posts.innerText;
          posts.style.visibility = "hidden";
          posts.innerHTML += '<div class="usrPosts" style="display: flex; visibility: visible">' +
                             '<div class="usrPostsNumber" style="min-width: 40px; justify-content: flex-end; display: flex; color: #500070;">' + str.slice(0, -6) +
                             '</div><div class="usrPostsText" style="margin: 0 0 0 6px;">Posts</div></div>';
          var member = articles_on_page[cnt].querySelectorAll(".message-userStats")[0];
          member.innerHTML += '<div class="usrLikes" style="display: flex;"><div class="usrLikesLevel"></div>' +
                              '<div class="usrLikesNumber" style="min-width: 40px; justify-content: flex-end; display: flex; color: #500070;">' + tmp.toString() +
                              '</div><div class="usrLikesText" style="margin: 0 0 0 6px;">Likes received</div></div>';
          console.log('Page #',cnt,' loaded (likes)');
        })
        .catch(function(err) {
          console.log('Failed to fetch page #',cnt,' (likes), error: ', err);
        });
      }
      getAuthorDataFromSSC(cnt1, articles_on_page[cnt1].querySelectorAll('.avatar.avatar--ml')[0].getAttribute("href"));
    }

    var time3 = setInterval(function() {
    var y = 0;
    var like_elements = document.querySelectorAll('.california-likes-container');
    if ( like_elements.length != 0 ) {
      for(y = 0; y < like_elements.length; y++) {
        like_elements[y].style.display = 'flex';
        like_elements[y].style.height = 'auto';
        like_elements[y].style.marginBottom = '10px';
      }
    }
    like_elements = document.querySelectorAll('.california-reaction-bar.reactionsBar.js-reactionsList.is-active');
    if ( like_elements.length != 0 ) {
      for(y = 0; y < like_elements.length; y++) {
        like_elements[y].style.display = 'flex';
        like_elements[y].style.width = '100%';
      }
    }
    like_elements = document.querySelectorAll('.california-reaction-bar.reactionsBar.js-reactionsList.is-active .reactionsBar-link');
    for (cnt1 = 0; cnt1 < like_elements.length; cnt1++)
    {
      if (like_elements[cnt1].innerText.includes('other'))
      {
        function getPostLikesDataFromSSC(cnt, addrPostLikesSSC) {
          fetch(addrPostLikesSSC)
          .then(function(response) {
            return response.text();
          })
          .then(function(html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var tmp = doc.querySelectorAll('#reaction-0 .contentRow-header a');
            var str = "";
            for (var x = 0; x < tmp.length; x++)
            {
              if (x === 0) {
                str = '<div class="reactionsLike" style="display: flex;"><div class="reactionsLike1" style="font-weight: bold;">' + tmp.length + '</div>' +
                      '<div class="reactionsLike2" style="font-weight: bold; margin: 0 0 0 6px;"> likes: </div>' +
                      '<div class="reactionsLike3" style="width: 100%; border-left: 1px solid #d1d1e1; margin: 0 0 0 6px; padding: 0 0 0 3px;">' + tmp[x].innerText;
              } else {
                str += ', ' + tmp[x].innerText;
              }
            }
            str += '</div></div>';
            like_elements[cnt].innerHTML = str;
            like_elements[cnt].style.width = "70%";
            console.log('Likes list #',cnt,' likes: ',tmp.length);
          })
          .catch(function(err) {
            console.log('Like list #',cnt,' failed to fetch: ', err);
          });
        }
        getPostLikesDataFromSSC(cnt1, like_elements[cnt1].getAttribute("href"));
      }
    }
    }, 2000);

// disable lazyload
    var images = document.querySelectorAll('img.bbImage.lazyload');
    [].forEach.call(images, function(image) {
        image.classList.remove('lazyload');
        image.setAttribute('src', image.getAttribute('data-src'));
    });

  }
  if( document.readyState !== 'loading' ) {
    DOMReady();
  } else {
    document.addEventListener('DOMContentLoaded', DOMReady);
  }


//smilie smilie--sprite smilie--sprite26   //male obazki przeskalowane do rozmiaru emoji
//bbImage fr-fic fr-dii fr-draggable       //obrazki w naturalnych wymiarach
// ==========================================================================================
  var gifs = [ [ 0, "", "https://i.postimg.cc/3kc9fLnM/007.gif" ],
               [ 2, "", "https://i.postimg.cc/QFt0bLgk/2cents.gif" ],
               [ 3, "", "https://i.postimg.cc/PLvygmRC/ancient.gif" ],
               [ 4, "", "https://i.postimg.cc/DJqgZ7FF/angel1.gif" ],
               [ 5, "", "https://i.postimg.cc/7JwNJjYz/angry.gif" ],
               [ 6, "", "https://i.postimg.cc/7b4vN653/angry2.gif" ],
               [ 7, "", "https://i.postimg.cc/fkfGqNd6/angryfire.gif" ],
               [ 8, "", "https://i.postimg.cc/HVWffh4j/applause.gif" ],
               [ 9, "", "https://i.postimg.cc/pp0gxJqC/apple.gif" ],
               [ 10, "", "https://i.postimg.cc/mPtKr1ns/awesome.gif" ],
               [ 11, "", "https://i.postimg.cc/jDmmndVJ/baaa.gif" ],
               [ 12, "", "https://i.postimg.cc/p9j7fbxc/baeh3.gif" ],
               [ 13, "", "https://i.postimg.cc/47T0wLxf/banana.gif" ],
               [ 14, "", "https://i.postimg.cc/KkrHWP1n/banned.gif" ],
               [ 15, "", "https://i.postimg.cc/2LkKN1Wg/bash.gif" ],
               [ 16, "", "https://i.postimg.cc/HjdKyhN3/bawling.gif" ],
               [ 17, "", "https://i.postimg.cc/bdg5HRcP/beer.gif" ],
               [ 18, "", "https://i.postimg.cc/8jC0yrN6/biggrin.gif" ],
               [ 19, "", "https://i.postimg.cc/1fYYb53Y/biggrin2.gif" ],
               [ 20, "", "https://i.postimg.cc/ZWGsK738/blahblah.gif" ],
               [ 21, "", "https://i.postimg.cc/cKf9KRMV/bleep.gif" ],
               [ 22, "", "https://i.postimg.cc/KkF9t104/boink.gif" ],
               [ 23, "", "https://i.postimg.cc/vgz0hGKh/bonk.gif" ],
               [ 24, "", "https://i.postimg.cc/0KycHLRs/booze.gif" ],
               [ 25, "", "https://i.postimg.cc/CdhP1fZQ/bow.gif" ],
               [ 26, "", "https://i.postimg.cc/87YcFWPB/bowtie.gif" ],
               [ 27, "", "https://i.postimg.cc/Z0wfyKpK/carrot.gif" ],
               [ 28, "", "https://i.postimg.cc/8j56XLcM/censored.gif" ],
               [ 29, "", "https://i.postimg.cc/ftmVQLs7/check1.gif" ],
               [ 30, "", "https://i.postimg.cc/ppysQbJQ/cheer.gif" ],
               [ 32, "", "https://i.postimg.cc/k6QghpNf/cheers.gif" ],
               [ 33, "", "https://i.postimg.cc/yk5vvQLM/cheesy.gif" ],
               [ 34, "", "https://i.postimg.cc/BjKNyTyX/chill.gif" ],
               [ 35, "", "https://i.postimg.cc/bGfLjGcL/closed.gif" ],
               [ 36, "", "https://i.postimg.cc/bDzTsKvt/club.gif" ],
               [ 37, "", "https://i.postimg.cc/9zHbkgHT/coffee.gif" ],
               [ 38, "", "https://i.postimg.cc/dk49d47S/colbert.gif" ],
               [ 39, "", "https://i.postimg.cc/BPbBCHHZ/confused.gif" ],
               [ 40, "", "https://i.postimg.cc/qztGhcpj/confused2.gif" ],
               [ 41, "", "https://i.postimg.cc/HVf9QJxH/cool.gif" ],
               [ 42, "", "https://i.postimg.cc/hXTbMSzm/cool2.gif" ],
               [ 43, "", "https://i.postimg.cc/DWhQMtLM/crazy.gif" ],
               [ 44, "", "https://i.postimg.cc/jWh60Zhd/cripes.gif" ],
               [ 45, "", "https://i.postimg.cc/njc4HBdK/cucumber.gif" ],
               [ 46, "", "https://i.postimg.cc/njc4HBdK/cucumber.gif" ],
               [ 47, "", "https://i.postimg.cc/CnRb8Ypz/deadthread.gif" ],
               [ 48, "", "https://i.postimg.cc/R6scqh8k/dead-banana.gif" ],
               [ 49, "", "https://i.postimg.cc/jC2Hm6nt/devil2.gif" ],
               [ 50, "", "https://i.postimg.cc/dDf2Y7Gd/discoduck.gif" ],
               [ 51, "", "https://i.postimg.cc/8jKhTt9Z/dissy.gif" ],
               [ 52, "", "https://i.postimg.cc/m11FDw79/dj.gif" ],
               [ 53, "", "https://i.postimg.cc/ThKbCRBP/doh.gif" ],
               [ 54, "", "https://i.postimg.cc/WtxkyBPw/down.gif" ],
               [ 55, "", "https://i.postimg.cc/rKWr2fVX/drink.gif" ],
               [ 56, "", "https://i.postimg.cc/sMrZj5xB/drink2.gif" ],
               [ 57, "", "https://i.postimg.cc/yDy3kW3L/drool.gif" ],
               [ 58, "", "https://i.postimg.cc/p9Vh8xDR/duck.gif" ],
               [ 59, "", "https://i.postimg.cc/gwMwH5DR/dunno.gif" ],
               [ 60, "", "https://i.postimg.cc/k6B21c1H/eat.gif" ],
               [ 61, "", "https://i.postimg.cc/jwmLG7BS/eek.gif" ],
               [ 62, "", "https://i.postimg.cc/y3RkBNzX/eek2.gif" ],
               [ 63, "", "https://i.postimg.cc/s1GB5TZQ/eek5.gif" ],
               [ 64, "", "https://i.postimg.cc/7fv59SgB/emot-banjo.gif" ],
               [ 65, "", "https://i.postimg.cc/BXxXVtpJ/evil.gif" ],
               [ 66, "", "https://i.postimg.cc/Bj4X9s7H/eviltongue.gif" ],
               [ 67, "", "https://i.postimg.cc/Sndjm5H5/fart.gif" ],
               [ 68, "", "https://i.postimg.cc/67QqqcXQ/fiddle.gif" ],
               [ 69, "", "https://i.postimg.cc/8Fn56vpm/frown.gif" ],
               [ 70, "", "https://i.postimg.cc/xJw1sSbk/gaah.gif" ],
               [ 71, "", "https://i.postimg.cc/Zv6K2Drw/goodbye.gif" ],
               [ 72, "", "https://i.postimg.cc/14Ft84LD/goodnight.gif" ],
               [ 73, "", "https://i.postimg.cc/8jVCMNS9/grandpa.gif" ],
               [ 74, "", "https://i.postimg.cc/fJjRvpWL/grin.gif" ],
               [ 75, "", "https://i.postimg.cc/TpR9dyw3/grouphug.gif" ],
               [ 76, "", "https://i.postimg.cc/K1Gvpf45/grumpy.gif" ],
               [ 77, "", "https://i.postimg.cc/SngQB9Mb/guitar.gif" ],
               [ 78, "", "https://i.postimg.cc/hJh4cGLz/guitarred.gif" ],
               [ 79, "", "https://i.postimg.cc/WDKN3P89/guns1.gif" ],
               [ 80, "", "https://i.postimg.cc/S2MyYttm/gunz.gif" ],
               [ 81, "", "https://i.postimg.cc/V0PzqB3n/hahaha.gif" ],
               [ 82, "", "https://i.postimg.cc/GTPdqTCN/hahano.gif" ],
               [ 83, "", "https://i.postimg.cc/1fP94B0Z/headbang.gif" ],
               [ 84, "", "https://i.postimg.cc/SJrm99VY/heart.gif" ],
               [ 85, "", "https://i.postimg.cc/xX1n3dFx/hi.gif" ],
               [ 86, "", "https://i.postimg.cc/yDpBQzMV/hide.gif" ],
               [ 87, "", "https://i.postimg.cc/QBBDvyDc/hilarious.gif" ],
               [ 88, "", "https://i.postimg.cc/06Lvv05F/hm.gif" ],
               [ 89, "", "https://i.postimg.cc/gX8W2LnJ/hmm.gif" ],
               [ 90, "", "https://i.postimg.cc/tnbHZRxz/horse.gif" ],
               [ 91, "", "https://i.postimg.cc/m1SW-Qx3W/hug.gif" ],
               [ 92, "", "https://i.postimg.cc/WtmVRZBY/huh.gif" ],
               [ 93, "", "https://i.postimg.cc/QHX3jts8/jk.gif" ],
               [ 94, "", "https://i.postimg.cc/yDxCSbk2/kiss.gif" ],
               [ 95, "", "https://i.postimg.cc/Bjz95BFb/kneel.gif" ],
               [ 96, "", "https://i.postimg.cc/8Fr8ZfdH/laugh.gif" ],
               [ 97, "", "https://i.postimg.cc/LYdcw4NM/llama.gif" ],
               [ 98, "", "https://i.postimg.cc/cgQpSqbt/lockd.gif" ],
               [ 99, "", "https://i.postimg.cc/SYkwQZBT/lol.gif" ],
               [ 100, "", "https://i.postimg.cc/p5C3mfx2/love.gif" ],
               [ 101, "", "https://i.postimg.cc/hhnj7Kgw/lovethem.gif" ],
               [ 102, "", "https://i.postimg.cc/5jmtBD2t/lurker.gif" ],
               [ 103, "", "https://i.postimg.cc/BXYQyDD9/mad.gif" ],
               [ 104, "", "https://i.postimg.cc/tssCHTt1/mad2.gif" ],
               [ 105, "", "https://i.postimg.cc/gx1ccWNg/madwife.gif" ],
               [ 106, "", "https://i.postimg.cc/CZDhzQ2S/master.gif" ],
               [ 107, "", "https://i.postimg.cc/2bDzvxpv/naughty.gif" ],
               [ 108, "", "https://i.postimg.cc/q6B4DMvv/nixweiss.gif" ],
               [ 109, "", "https://i.postimg.cc/Yj8pGgdG/nono.gif" ],
               [ 110, "", "https://i.postimg.cc/qzRp8RFm/nono2.gif" ],
               [ 111, "", "https://i.postimg.cc/dLxwnFPJ/notacrook.gif" ],
               [ 112, "", "https://i.postimg.cc/87fD0YNM/nuts2.gif" ],
               [ 113, "", "https://i.postimg.cc/2qpmRxSJ/oh.gif" ],
               [ 114, "", "https://i.postimg.cc/jD1Q4ZhD/okay.gif" ],
               [ 115, "", "https://i.postimg.cc/KkfyTSDS/old.gif" ],
               [ 116, "", "https://i.postimg.cc/ftDNkTXf/omg.gif" ],
               [ 117, "", "https://i.postimg.cc/BtZ30bJq/oops.gif" ],
               [ 118, "", "https://i.postimg.cc/9zxhF2fy/pepper.gif" ],
               [ 119, "", "https://i.postimg.cc/YhhwvP4Z/pet.gif" ],
               [ 120, "", "https://i.postimg.cc/qzSHyGyR/picard.gif" ],
               [ 121, "", "https://i.postimg.cc/3kG5BDFZ/poke.gif" ],
               [ 122, "", "https://i.postimg.cc/rdL6YFh2/popcorn.gif" ],
               [ 123, "", "https://i.postimg.cc/WF2BTYL9/preach.gif" ],
               [ 124, "", "https://i.postimg.cc/tZ2LTd99/previous.gif" ],
               [ 125, "", "https://i.postimg.cc/sGfhrhcF/puke.gif" ],
               [ 126, "", "https://i.postimg.cc/K3jCgKYB/rant.gif" ],
               [ 127, "", "https://i.postimg.cc/GHBZLsV1/rcain.gif" ],
               [ 128, "", "https://i.postimg.cc/rKv7Kw2R/redxdance.gif" ],
               [ 129, "", "https://i.postimg.cc/gx8QRbGS/righton.gif" ],
               [ 130, "", "https://i.postimg.cc/LqS73QXH/rip.gif" ],
               [ 131, "", "https://i.postimg.cc/4K10Lv7p/rock.gif" ],
               [ 132, "", "https://i.postimg.cc/xJT4WkMh/rolleyes.gif" ],
               [ 133, "", "https://i.postimg.cc/62jmw9h3/rollin2.gif" ],
               [ 134, "", "https://i.postimg.cc/7J5QZpBN/runaway.gif" ],
               [ 135, "", "https://i.postimg.cc/6TqPcv9G/sad.gif" ],
               [ 136, "", "https://i.postimg.cc/WhJHLcqN/sad2.gif" ],
               [ 137, "", "https://i.postimg.cc/DSkY7p1q/sarcasm.gif" ],
               [ 138, "", "https://i.postimg.cc/rD1ZsG97/scouserdave.gif" ],
               [ 139, "", "https://i.postimg.cc/GBb7yB7t/screwit.gif" ],
               [ 140, "", "https://i.postimg.cc/jWv8QsmX/shake.gif" ],
               [ 141, "", "https://i.postimg.cc/TL4CFtR5/shifty.gif" ],
               [ 142, "", "https://i.postimg.cc/rRRQk5mn/shocked.gif" ],
               [ 143, "", "https://i.postimg.cc/vD4Pfwzr/siren.gif" ],
               [ 144, "", "https://i.postimg.cc/s1bTJH6t/skull.gif" ],
               [ 145, "", "https://i.postimg.cc/MvRd30gX/slap.gif" ],
               [ 146, "", "https://i.postimg.cc/G4CzW81K/sleepy.gif" ],
               [ 147, "", "https://i.postimg.cc/CRsJShhg/sly.gif" ],
               [ 148, "", "https://i.postimg.cc/PLfyqgJ8/smash.gif" ],
               [ 149, "", "https://i.postimg.cc/GBMQTXTg/smile.gif" ],
               [ 150, "", "https://i.postimg.cc/2bVxQn4k/smiley.gif" ],
               [ 151, "", "https://i.postimg.cc/R6yLXqRc/smug.gif" ],
               [ 152, "", "https://i.postimg.cc/K3TrVFqC/soapbox.gif" ],
               [ 153, "", "https://i.postimg.cc/nM9kMYFT/soon.gif" ],
               [ 154, "", "https://i.postimg.cc/ykqTRgWK/spam1.gif" ],
               [ 155, "", "https://i.postimg.cc/0bp00kJw/speech.gif" ],
               [ 156, "", "https://i.postimg.cc/21rFHs4X/stickdance.gif" ],
               [ 157, "", "https://i.postimg.cc/5Xg5Dsg9/storm.gif" ],
               [ 158, "", "https://i.postimg.cc/VSN9wXZq/stupid.gif" ],
               [ 159, "", "https://i.postimg.cc/DWYrwmRt/suicide.gif" ],
               [ 160, "", "https://i.postimg.cc/8JJhJNSs/suspicious.gif" ],
               [ 163, "", "https://i.postimg.cc/NLX6QsDz/toilet.gif" ],
               [ 164, "", "https://i.postimg.cc/mtGQDv62/tongue2.gif" ],
               [ 165, "", "https://i.postimg.cc/1fcDNvL0/tongue3.gif" ],
               [ 166, "", "https://i.postimg.cc/mPLC3Qsv/tongue4.gif" ],
               [ 167, "", "https://i.postimg.cc/bZmbmsYs/troll.gif" ],
               [ 168, "", "https://i.postimg.cc/R3qty4qG/tuschel.gif" ],
               [ 169, "", "https://i.postimg.cc/xk7mShzQ/tyty.gif" ],
               [ 170, "", "https://i.postimg.cc/KkMMcfPM/wallbash.gif" ],
               [ 171, "", "https://i.postimg.cc/1V1N8FBY/wave.gif" ],
               [ 172, "", "https://i.postimg.cc/ZvPvpqDY/weirdo.gif" ],
               [ 173, "", "https://i.postimg.cc/mh7H0d2x/wink.gif" ],
               [ 174, "", "https://i.postimg.cc/k6qVQbLV/wink2.gif" ],
               [ 175, "", "https://i.postimg.cc/qz0308zN/withstupid.gif" ],
               [ 176, "", "https://i.postimg.cc/Tp9WPpDC/wtf.gif" ],
               [ 177, "", "https://i.postimg.cc/4YxHHsvZ/Y2myNV0.gif" ],
               [ 178, "", "https://i.postimg.cc/FYCdj8GS/yawnee.gif" ],
               [ 179, "", "https://i.postimg.cc/mcccVj65/yes.gif" ],
               [ 180, "", "https://i.postimg.cc/DWtSNG9y/yuck.gif" ],
               [ 181, ":kim:", "https://i.imgur.com/KSnK9pD.gif" ] ];

// -------------------------------------------------------------------------------------------
})();
