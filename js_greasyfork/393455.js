// ==UserScript==
// @name pack fpyoutube
// @namespace AceScript Scripts
// @author papeando
// @match https://www.forosperu.net/*
// @run-at document-start
// @icon https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube_icon_full-color.svg
// @description Script para los videos de youtube en Foros Peru
// @version 2.1
// @downloadURL https://update.greasyfork.org/scripts/393455/pack%20fpyoutube.user.js
// @updateURL https://update.greasyfork.org/scripts/393455/pack%20fpyoutube.meta.js
// ==/UserScript==

sfacebook();stwitter();syoutube();

document.addEventListener ("DOMContentLoaded", sbody);
window.addEventListener ("load", sload);

function sbody() {
  byoutube();bfacebook();
}
function sload() {
  lyoutube();
}
function pyoutube() {
  window.pl=[];
  var yb = document.getElementById("yb0"),i;
  yb.onclick = function() {
    var ytid=player.getVideoUrl().substr(32);
    if (window.pl.indexOf(ytid)==-1) window.pl.unshift(ytid);
  };
  yb = null;yb = document.getElementById("yb1");
  yb.onclick = function() {
    if (window.pl.length!=0) {
      var ytid=player.getVideoUrl().substr(32);
      var sn = window.pl.indexOf(ytid);
      if (sn > -1) window.pl.splice(sn, 1);
    }
  };
  yb = null;yb = document.getElementById("yb2");
  yb.onclick = function() {
    if (window.pl.length!=0) {
      window.player.loadPlaylist({
          'playlist': [window.pl],
          'listType': 'playlist',
          'index': 0,
          'startSeconds': 0
      });
    }
  };
  yb = null;yb = document.getElementById("yb3");
  yb.onclick = function() {
    if (window.pl.length!=0) {
      window.pl.length=0;
    }
  };
  yb = null;yb = document.getElementById("yb4");
  yb.onclick = function() {
    var str=localStorage.getItem("gpl");
    if (str!=null) {
      if (str.length>10) {
        var ar=str.split(","),i;
        if (window.pl.length!=0) {
          for (i = 0; i < ar.length; i++) if (window.pl.indexOf(ar[i])==-1) window.pl.push(ar[i]);
        } else {
          for (i = 0; i < ar.length; i++) window.pl.push(ar[i]);
        }
      }
    }
  };
  yb = null;yb = document.getElementById("yb5");
  yb.onclick = function() {
    window.player.stopVideo();
    document.getElementById("ypanel").style.display = "none";
    document.getElementById("yplayer").style.display = "none";
    if (window.i1!=0) {
      window.bflag=false;
    }
    document.getElementById("yli").style.display = "block";
  };
  yb = null;yb = document.getElementById("yb6");
  yb.onclick = function() {
    var str=localStorage.getItem("gpl"),ar=[];
    if (str!=null) {
      if (str.length>10) {
        ar=str.split(",");
      }
    }
    var i;
    if (ar.length!=0) {
      for (i = 0; i < window.pl.length; i++) if (ar.indexOf(window.pl[i])==-1) ar.push(window.pl[i]);
    } else {
      for (i = 0; i < window.pl.length; i++) ar.push(window.pl[i]);
    }
    localStorage.setItem("gpl", ar);
  };
  yb = null;yb = document.getElementById("yb7");
  yb.onclick = function() {
    var str=localStorage.getItem("gpl");
    if (str!=null) {
      if (str.length>10) {
				var ar=[];localStorage.setItem("gpl", ar);
			}
		}
  };
  yb = null;yb = document.getElementById("yb8");
  yb.onclick = function() {
    var str=localStorage.getItem("gpl");
    if (str!=null) {
      if (str.length>10) {
        var ar=str.split(",");
        window.player.loadPlaylist({
            'playlist': [ar],
            'listType': 'playlist',
            'index': 0,
            'startSeconds': 0
        });
      }
    }
  };
  yb = null;yb = document.getElementById("yb9");
  yb.onclick = function() {
    var str=localStorage.getItem("gpl");
    if (str!=null) {
      if (str.length>10) {
        var ar=str.split(",");
        var ytid=player.getVideoUrl().substr(32);
        var sn = ar.indexOf(ytid);
        if (sn > -1) window.pl.splice(sn, 1);
        localStorage.setItem("gpl", ar);
      }
    }
  };
  yb = null;yb = document.getElementById("yb10");
  yb.onclick = function() {
    var str=localStorage.getItem("gpl"),ar=[],ytid=player.getVideoUrl().substr(32);
    if (str!=null) {
      if (str.length>10) {
        ar=str.split(",");
      }
    }
    if (ar.length!=0) {
      if (ar.indexOf(ytid)==-1) ar.unshift(ytid);
    } else {
      ar.unshift(ytid);
    }
    localStorage.setItem("gpl", ar);
  };
  yb = null;yb = document.getElementById("yb11");
  yb.onclick = function() {
    window.player.loadPlaylist({
        'playlist': ["hHW1oY26kxQ","yaKeFoNOneg","bebuiaSKtU4","VIWVfkF2IeI","GVC5adzPpiE","PRlAY486hVg","AAahcF7ew-0","mOcEqTR1Hn4","nTnRa0glvJQ","dQprOmR-AJQ"],
        'listType': 'playlist',
        'index': 0,
        'startSeconds': 0
    });
  };
  yb = null;yb = document.getElementById("yb12");
  yb.onclick = function() {
    var ar=window.player.getPlaylist();
    if (ar!=null) {
    var str="";
    for (var i = 0; i < ar.length; i++) str +='https://youtu.be/' + ar[i] + '\n';
    var tx = document.createElement("textarea");
    document.body.appendChild(tx);
    tx.value=str;
    tx.select();
    document.execCommand("copy");
    document.body.removeChild(tx);tx=null;
    }
  };
  yb = null;yb = document.getElementById("yb13");
  yb.onclick = function() {
    navigator.clipboard.readText()
    .then(str => {
      if (str.length>10) {
        var xx=str.replace(/^(https:\/\/youtu\.be\/|https:\/\/www\.youtube\.com\/watch\?v=)/igm,"");
        xx=xx.replace(/^(\r\n|\n|\r)/gm,"");xx=xx.replace(/$(\r\n|\n|\r)/gm,",");xx=xx.replace(/,$/,"");
        var ar=xx.split(",");
        window.player.loadPlaylist({
            'playlist': [ar],
            'listType': 'playlist',
            'index': 0,
            'startSeconds': 0
        });
      }
    });
  };
  yb = null;yb = document.getElementById("yb14");
  yb.onclick = function() {
    var ar=window.player.getPlaylist();
    if (ar!=null) {
      for (var i = 0; i < ar.length; i++) if (window.pl.indexOf(ar[i])==-1) window.pl.push(ar[i]);
    }
  };
  yb = null;yb = document.getElementById("yb15");
  yb.onclick = function() {
    var ar=window.player.getPlaylist();
    if (ar!=null) {
      var str=localStorage.getItem("gpl"),ar2=[];
      if (str!=null) {
        if (str.length>10) {
          ar2=str.split(",");
        }
      }
      for (var i = 0; i < ar.length; i++) if (ar2.indexOf(ar[i])==-1) ar2.push(ar[i]);
      localStorage.setItem("gpl", ar2);
    }
  };yb = null;
}
function onPlayerReady(event) {
  pyoutube();var yl;window.bflag2=false;
  if (window.i1!=0) {
    var s1 = "https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube_icon_light.svg",s2="";
    for (var i = 0; i < window.i1; i++) {
      yl = document.getElementById("yl" + i.toString());
      yl.onclick = function() {
        if (this.src != s1) this.src = s1;
        s2 = this.getAttribute("class");
        if (window.bflag===false) {
          document.getElementById("yplayer").style.display = "block";window.bflag=true;document.getElementById("ypanel").style.display = "block";
          document.getElementById("yli").style.display = "none";
        }
        window.player.loadVideoById({videoId: s2});
        return false;
      };yl = null;
    }
    yl = document.getElementById("yli");
    yl.onclick = function() {
      this.style.display = "none";
      if (window.bflag===false) {
        if (window.bflag2===false) {
          window.bflag2=true;window.player.cueVideoById({videoId: 'bebuiaSKtU4'});
        }
        window.bflag=true;
      }
      document.getElementById("yplayer").style.display = "block";document.getElementById("ypanel").style.display = "block";
    };yl.style.display = "block";yl = null;
  } else {
    yl = document.getElementById("yli");
    yl.onclick = function() {
      this.style.display = "none";
      if (window.bflag===false) {
        window.player.cueVideoById({videoId: 'bebuiaSKtU4'});window.bflag=true;
      }
      document.getElementById("yplayer").style.display = "block";document.getElementById("ypanel").style.display = "block";
    };yl.style.display = "block";yl = null;
  }
}
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) event.target.seekTo(0, true);
}
function byoutube() {
  window.codes = [];window.titles = [];window.player;window.bflag=false;window.i1 = 0;
  var s1 = "",s2 = "",cods = [],dx = document.getElementsByTagName('iframe'),i;
  for (i = 0; i < dx.length; i++) {
    if (dx[i].src.includes("https://www.youtube.com/embed/")) {
      s1 = dx[i].src;
      s2 = s1.slice(30, 41);
      s1 = '<img  id="yl' + window.i1 + '" src="https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube_icon_full-color.svg" style="width:25px;height:25px;" class="' + s2 + '">';
      dx[i].insertAdjacentHTML('beforebegin', s1);
      dx[i].id = "yif" + window.i1.toString();
      if (cods.indexOf(s2) === -1) cods.push(s2);
      window.i1++;
    }
  }
  dx = null;
  if (window.i1!=0) {
    for (i = 0; i < window.i1; i++) {
      var xx = document.getElementById("yif" + i.toString());
      xx.parentNode.removeChild(xx);
      xx = null;
    }
    for (i = 0; i < cods.length; i++) tyoutube(cods[i]);
  }
  s1 = '<img  id="yli" src="https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube_icon_full-color.svg" style="display:none;width:25px;height:25px;max-width: none;max-height: none;position:fixed; bottom: 0px;right: 0px;z-index: 99;">';
  document.body.insertAdjacentHTML("beforeend", s1);
  s1='<iframe width="480" height="270" src="https://www.youtube.com/embed/?enablejsapi=1&amp;version=3&amp;rel=0&amp;iv_load_policy=3&amp;showinfo=0&amp;modestbranding=1" frameborder="0" allowfullscreen="" id="yplayer" style="display: none;max-width: none;max-height: none;position:fixed; bottom: 0px;right: 0px;z-index: 99;"></iframe>';
  document.body.insertAdjacentHTML("beforeend", s1);
  var yt = document.getElementById("yplayer");
  yt.onload= function() {
    window.player = new YT.Player('yplayer', {events: {'onReady': onPlayerReady,'onStateChange': onPlayerStateChange}});
  };
  s1='<div id="ypanel" style="display: none;width: 480px;height: 22px;background-color: black;max-width: none;max-height: none;position:fixed; bottom: 270px;right: 0px;z-index: 99;-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;" onmousedown="return false;">';
  var ars = ["A", "Q", "C", "B", "F", "X", "F", "B", "C", "Q", "A", "?", "G", "R", "Fp", "Fg"];
  for (i = 0; i < 16; i++) s1+='<p id="yb' + i.toString() + '"  style="max-width: none;max-height: none;position:fixed; bottom: 272px;right: ' + (460-i*30).toString() + 'px;z-index: 99;">' + ars[i] + '</p>';
  s1+='</div>';document.body.insertAdjacentHTML("beforeend", s1);
}
function lyoutube() {
  if (window.i1!=0) {
    for (var i = 0; i < window.codes.length; i++) {var xxs = document.getElementsByClassName(window.codes[i]);for (var x = 0; x < xxs.length; x++) xxs[x].insertAdjacentText("afterend", window.titles[i]);}
  }
}
function tyoutube(cod) {
  var url = "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" + cod;
  var reqyoutube = new XMLHttpRequest();
  reqyoutube.onreadystatechange = function() {
    if (reqyoutube.readyState == 4 && reqyoutube.status == 200) {
      var str1 = reqyoutube.responseText;
      var objList = JSON.parse(str1);
      str1 = objList["title"];
      if (str1 === undefined) str1 = "Video Eliminado/No disponible";
      window.titles.push(str1 + " ");
      window.codes.push(cod);
    }
  }
  reqyoutube.open("GET", url, true);
  reqyoutube.send(null);
}
function syoutube() {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
function stwitter() {
    var tag = document.createElement('script');
    tag.src ="https://platform.twitter.com/widgets.js";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.onload = function() {
      twttr.ready(
        function (twttr) {
          var intdd = 0,str1 = new Array(2),youd = document.getElementsByClassName("messageText SelectQuoteContainer ugc baseHtml"),i;
          for (i = 0; i < youd.length; i++) {
            var lnk = youd[i].getElementsByTagName('a');
            for (var j = 0; j < lnk.length; j++) {
              if (lnk[j].href.includes("https://twitter.com/") && lnk[j].href.includes("/status/")) {
                lnk[j].style.display = "none";
                str1 = lnk[j].href.split('/status/', 2);
                var s1 = str1[1].substring(0, 19);
                var s2 = '<div id="frtw' + intdd + '" twid="' + s1 + '"></div>';
                lnk[j].insertAdjacentHTML('beforebegin', s2);
                intdd++;
              }
            }
          }
          for (i = 0; i < intdd; i++) {
            var tweet = document.getElementById("frtw" + i);
            var id = tweet.getAttribute("twid");
            twttr.widgets.createTweet(
              id, tweet, {
                conversation: 'none',
                cards: 'visible',
                theme: 'light'
              });
          }
        }
      );
    };
}
function sfacebook() {
  (function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.8";
  fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}
function bfacebook() {
   FB.Event.subscribe("xfbml.render", function(){
     var youd = document.getElementsByTagName('iframe');for (var i = 0; i < youd.length; i++) if (youd[i].src.includes("https://www.facebook.com/")) youd[i].src += "&mute=0";
   });
}